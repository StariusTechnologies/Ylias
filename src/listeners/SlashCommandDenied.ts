import { Listener, UserError } from '@sapphire/framework';
import { Events, SlashCommandDeniedPayload } from '#lib/framework/lib/types/Events';
import { Emotion, Emotions } from '#lib/Emotion';

export default class SlashCommandDenied extends Listener<typeof Events.SlashCommandDenied> {
    constructor(context: Listener.LoaderContext) {
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
