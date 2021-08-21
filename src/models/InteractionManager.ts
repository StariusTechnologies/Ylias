import { Message, MessageButton, Collection } from 'discord.js';
import { EventEmitter } from 'stream';
import type { APIPartialEmoji } from 'discord-api-types';
import type {
    MessageEditOptions,
    MessageButtonStyle,
    ButtonInteraction,
    TextBasedChannels,
    Emoji
} from 'discord.js';

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
    private static readonly DEFAULT_BUTTON_TIMEOUT = 20 * 60000;

    private static buttons: Collection<string, MessageButton> = new Collection();
    private static instance: InteractionManager;

    constructor() {
        super();

        if (InteractionManager.instance) {
            return InteractionManager.instance;
        }

        InteractionManager.instance = this;
    }

    /**
     * @param {string} interactionId
     *
     * @returns {boolean}
     */
    public hasListeners(interactionId: string): boolean {
        return this.listenerCount(interactionId) > 0;
    }

    /**
     * @param {ButtonCreationData} data
     *
     * @returns {MessageButton}
     */
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
                let message = await channel.messages.cache.find(message => {
                    return message.components.some(
                        row => row.components.some(component => component.customId === id)
                    );
                });

                if (!(message instanceof Message)) {
                    message = await channel.messages.fetch(message!.id);
                }

                if (message) {
                    this.removeMessageComponentFromMessage(message);
                }

                this.removeAllListeners(button.id);
            }, timeout);
        }

        return button;
    }

    /**
     * @param {Message} message
     */
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
}
