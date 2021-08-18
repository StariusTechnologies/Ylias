import { APIPartialEmoji } from 'discord-api-types';
import { MessageButton, Collection } from 'discord.js';
import type { MessageButtonStyle, ButtonInteraction, TextBasedChannels } from 'discord.js';
import { EventEmitter } from 'stream';

interface ButtonCreationData {
    id: string;
    style: MessageButtonStyle;
    label: string;
    emoji: APIPartialEmoji;
    callback: (interaction: ButtonInteraction) => void;
    timeout: number;
    channel: TextBasedChannels;
}

export class InteractionManager {
    static NO_BUTTON_TIMEOUT = 0;
    static DEFAULT_BUTTON_TIMEOUT = 20 * 60000;

    static buttons = new Collection();

    /**
     * @param {ButtonCreationData} data
     *
     * @returns {MessageButton}
     */
    public async getButton({ id, style, label, emoji, callback, timeout, channel }: ButtonCreationData) {
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
            EventEmitter.on(id, callback);
        }

        InteractionManager.buttons.set(id, button);
        timeout = timeout ?? InteractionManager.DEFAULT_BUTTON_TIMEOUT;

        if (timeout > InteractionManager.NO_BUTTON_TIMEOUT) {
            setTimeout(() => {
                const message = channel.messages.cache.find(message => {
                    return message.components.some(
                        row => row.components.some(component => component.customId === id)
                    )
                });

                if (message) {
                    this.removeMessageComponentFromMessage(message);
                }

                this.removeAllListeners(button.id);
            }, timeout);
        }

        return button;
    }
}
