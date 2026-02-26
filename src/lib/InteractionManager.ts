import { Message, ButtonBuilder, Collection, TextChannel, ButtonStyle } from 'discord.js';
import { EventEmitter } from 'stream';
import { APIPartialEmoji, APIMessage, MessageFlags } from 'discord-api-types/v10';
import type {
    MessageEditOptions,
    ButtonInteraction,
    TextBasedChannel,
    Emoji
} from 'discord.js';
import { MINUTE } from './DateTimeUtils';

declare module 'discord.js' {
    interface ClientEvents {
        buttonError: [error: Error, interaction: ButtonInteraction];
    }
}

export interface ButtonCreationData {
    id: string;
    style?: ButtonStyle;
    label?: string;
    emoji?: string | Emoji | APIPartialEmoji;
    callback?: (interaction: ButtonInteraction) => void;
    timeout?: number;
    channel: TextBasedChannel;
}

export class InteractionManager extends EventEmitter{
    private static readonly NO_BUTTON_TIMEOUT = 0;
    private static readonly DEFAULT_BUTTON_TIMEOUT = 20 * MINUTE;

    private static buttons: Collection<string, ButtonBuilder> = new Collection();
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
    ): ButtonBuilder {
        const button: any = InteractionManager.buttons.has(id)
            ? InteractionManager.buttons.get(id)
            : new ButtonBuilder().setCustomId(id);

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
                        row => 'components' in row && row.components.some(
                            (component: any) => component.customId === id
                        )
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
                flags: MessageFlags.Ephemeral,
            });
        }

        const interactionMessage = interaction.message;
        let message: Message = interactionMessage as Message;

        if ((interactionMessage as unknown as APIMessage).channel_id) {
            const apiMessage = interactionMessage as unknown as APIMessage;
            const channelId = apiMessage.channel_id;
            const channel: TextChannel = await interaction.client.channels.fetch(channelId) as TextChannel;

            message = await channel.messages.fetch(apiMessage.id);
        }

        this.removeMessageComponentFromMessage(message);
    }
}
