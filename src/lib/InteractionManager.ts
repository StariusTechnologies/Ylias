import { Message, MessageButton, Collection, TextChannel } from 'discord.js';
import { EventEmitter } from 'stream';
import type { APIPartialEmoji, APIMessage } from 'discord-api-types';
import type {
    MessageEditOptions,
    MessageButtonStyle,
    ButtonInteraction,
    TextBasedChannels,
    Emoji
} from 'discord.js';
import { MINUTE } from './DateTimeUtils';

export interface ButtonCreationData {
    id: string;
    style?: MessageButtonStyle;
    label?: string;
    emoji?: string | Emoji | APIPartialEmoji;
    callback?: (interaction: ButtonInteraction) => void;
    timeout?: number;
    channel: TextBasedChannels;
}

export class InteractionManager extends EventEmitter{
    private static readonly NO_BUTTON_TIMEOUT = 0;
    private static readonly DEFAULT_BUTTON_TIMEOUT = 20 * MINUTE;

    private static buttons: Collection<string, MessageButton> = new Collection();
    private static instance: InteractionManager;

    constructor() {
        super();

        if (InteractionManager.instance) {
            return InteractionManager.instance;
        }

        InteractionManager.instance = this;
    }

    public hasListeners(interactionId: string): boolean {
        return this.listenerCount(interactionId) > 0;
    }

    public getButton(
        { id, style, label, emoji, callback, timeout, channel }: ButtonCreationData
    ): MessageButton {
        const button: any = InteractionManager.buttons.has(id)
            ? InteractionManager.buttons.get(id)
            : new MessageButton().setCustomId(id);

        if (style) {
            button.setStyle(style);
        }

        if (label) {
            button.setLabel(label);
        }

        if (emoji) {
            button.setEmoji(emoji);
        }

        if (callback) {
            this.on(id, callback);
        }

        InteractionManager.buttons.set(id, button);
        timeout = timeout ?? InteractionManager.DEFAULT_BUTTON_TIMEOUT;

        if (timeout > InteractionManager.NO_BUTTON_TIMEOUT) {
            setTimeout(async () => {
                const message = await channel.messages.cache.find(message => {
                    return message.components.some(
                        row => row.components.some(component => component.customId === id)
                    );
                });

                if (message) {
                    this.removeMessageComponentFromMessage(message);
                }

                this.removeAllListeners(button.id);
            }, timeout);
        }

        return button;
    }

    public removeMessageComponentFromMessage(message: Message): void {
        const editOptions: MessageEditOptions = {
            components: [],
        };

        if (message.content && message.content.length > 0) {
            editOptions.content = message.content;
        }

        if (message.embeds && message.embeds.length > 0) {
            editOptions.embeds = message.embeds;
        }

        message.edit(editOptions);
    }

    public async handleUnboundButton(interaction: ButtonInteraction): Promise<void> {
        if (interaction.replied) {
            await interaction.editReply({
                content: 'This button doesn\'t do anything anymore! You can try sending the command again.',
                components: [],
            });
        } else {
            await interaction.reply({
                content: 'This button doesn\'t do anything anymore! You can try sending the command again.',
                components: [],
                ephemeral: true,
            });
        }

        const interactionMessage = interaction.message;
        let message: Message = interactionMessage as Message;

        if ((interactionMessage as APIMessage).channel_id) {
            const apiMessage: APIMessage = interactionMessage as APIMessage;
            const channelId = apiMessage.channel_id;
            const channel: TextChannel = await interaction.client.channels.fetch(channelId) as TextChannel;

            message = await channel.messages.fetch(apiMessage.id);
        }

        this.removeMessageComponentFromMessage(message);
    }
}
