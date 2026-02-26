import type { ChatInputCommandDeniedPayload } from '@sapphire/framework';
import { Events, Listener, UserError } from '@sapphire/framework';
import { Emotion, Emotions } from '#lib/Emotion';
import { MessageFlags } from 'discord-api-types/v10';

export default class SlashCommandDenied extends Listener<typeof Events.ChatInputCommandDenied> {
    constructor(context: Listener.LoaderContext) {
        super(context, {
            event: Events.ChatInputCommandDenied,
        });
    }

    public async run(error: UserError, payload: ChatInputCommandDeniedPayload): Promise<void> {
        const method = payload.interaction.replied ? 'followUp' : 'reply';
        const embed = Emotion.getEmotionEmbed(Emotions.NEUTRAL)
            .setTitle('Command denied')
            .setDescription(error.message)
            .setColor(0xFF4400);

        await payload.interaction[method]({
            embeds: [embed],
            flags: MessageFlags.Ephemeral,
        });
    }
}
