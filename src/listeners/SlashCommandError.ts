import { Listener, UserError } from '@sapphire/framework';
import { PieceContext } from '@sapphire/pieces';
import { Events, SlashCommandErrorPayload } from '../models/framework/lib/types/Events';
import { Emotion, Emotions } from '../models/Emotion';

export default class SlashCommandError extends Listener<typeof Events.SlashCommandError> {
    constructor(context: PieceContext) {
        super(context, {
            event: Events.SlashCommandError,
        });
    }

    public async run(error: UserError, payload: SlashCommandErrorPayload): Promise<void> {
        await payload.interaction.reply({
            embeds: [
                Emotion.getEmotionEmbed(Emotions.SAD).setTitle('Command error').setDescription(error.message),
            ],
            ephemeral: true,
        });
    }
}
