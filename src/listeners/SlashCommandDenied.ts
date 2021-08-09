import { Listener, UserError } from '@sapphire/framework';
import { PieceContext } from '@sapphire/pieces';
import { Events, SlashCommandDeniedPayload } from '../models/framework/lib/types/Events';
import { Emotion, Emotions } from '../models/Emotion';

export default class InteractionCreate extends Listener<typeof Events.SlashCommandDenied> {
    constructor(context: PieceContext) {
        super(context, {
            event: Events.SlashCommandDenied,
        });
    }

    async run(error: UserError, payload: SlashCommandDeniedPayload): Promise<void> {
        await payload.interaction.reply({
            embeds: [
                Emotion.getEmotionEmbed(Emotions.NEUTRAL).setTitle('Command error').setDescription(error.message),
            ],
            ephemeral: true,
        });
    }
}
