import { Listener, UserError } from '@sapphire/framework';
import { PieceContext } from '@sapphire/pieces';
import { Events, SlashCommandDeniedPayload } from '../models/framework/lib/types/Events';
import { Emotion, Emotions } from '../models/Emotion';

export default class SlashCommandDenied extends Listener<typeof Events.SlashCommandDenied> {
    constructor(context: PieceContext) {
        super(context, {
            event: Events.SlashCommandDenied,
        });
    }

    public async run(error: UserError, payload: SlashCommandDeniedPayload): Promise<void> {
        const method = payload.interaction.replied ? 'followUp' : 'reply';
        const embed = Emotion.getEmotionEmbed(Emotions.NEUTRAL)
            .setTitle('Command denied')
            .setDescription(error.message)
            .setColor(0xFF4400);

        await payload.interaction[method]({
            embeds: [embed],
            ephemeral: true,
        });
    }
}
