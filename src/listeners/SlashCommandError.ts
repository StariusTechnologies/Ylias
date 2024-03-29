import Logger from '@lilywonhalf/pretty-logger';
import { Listener, UserError } from '@sapphire/framework';
import type { PieceContext } from '@sapphire/pieces';
import { Events, SlashCommandErrorPayload } from '#lib/framework/lib/types/Events';
import { Emotion, Emotions } from '#lib/Emotion';

export default class SlashCommandError extends Listener<typeof Events.SlashCommandError> {
    constructor(context: PieceContext) {
        super(context, {
            event: Events.SlashCommandError,
        });
    }

    public async run(error: UserError, payload: SlashCommandErrorPayload): Promise<void> {
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
            ephemeral: true,
        });
    }
}
