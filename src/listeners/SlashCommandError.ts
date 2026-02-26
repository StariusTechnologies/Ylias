import Logger from '@lilywonhalf/pretty-logger';
import { Listener, Events } from '@sapphire/framework';
import type { ChatInputCommandErrorPayload } from '@sapphire/framework';
import { Emotion, Emotions } from '#lib/Emotion';
import { MessageFlags } from 'discord-api-types/v10';

export default class SlashCommandError extends Listener<typeof Events.ChatInputCommandError> {
    constructor(context: Listener.LoaderContext) {
        super(context, {
            event: Events.ChatInputCommandError,
        });
    }

    public async run(error: Error, payload: ChatInputCommandErrorPayload): Promise<void> {
        const commandsNotWorthOurTimeAndResources = ['crash'];
        const method = payload.interaction.replied ? 'followUp' : 'reply';
        const embed = Emotion.getEmotionEmbed(Emotions.SAD)
            .setTitle('Command error')
            .setDescription(error.message)
            .setColor(0xFF0000);

        if (!commandsNotWorthOurTimeAndResources.includes(payload.interaction.commandName)) {
            Logger.exception(error);
            Logger.debug({
                user: {
                    id: payload.interaction.user.id,
                    tag: payload.interaction.user.tag,
                },
                name: payload.interaction.commandName,
                options: payload.interaction.options.data,
            });
        }

        await payload.interaction[method]({
            embeds: [embed],
            flags: MessageFlags.Ephemeral,
        });
    }
}
