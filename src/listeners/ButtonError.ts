import Logger from '@lilywonhalf/pretty-logger';
import { Listener, UserError } from '@sapphire/framework';
import type { ButtonInteraction } from 'discord.js';
import { Emotion, Emotions } from '#lib/Emotion';
import { MessageFlags } from 'discord-api-types/v10';

export default class ButtonError extends Listener {
    constructor(context: Listener.LoaderContext) {
        super(context, {
            event: 'buttonError',
        });
    }

    public async run(error: UserError, interaction: ButtonInteraction): Promise<void> {
        const method = interaction.replied ? 'followUp' : 'reply';
        const embed = Emotion.getEmotionEmbed(Emotions.SAD)
            .setTitle('Button interaction error')
            .setDescription('The button interaction failed. You can try sending the command again!')
            .setColor(0xFF0000);

        Logger.exception(error);
        Logger.debug({
            user: {
                id: interaction.user.id,
                tag: interaction.user.tag,
            },
            customId: interaction.customId,
            message: interaction.message,
        });

        await interaction[method]({
            embeds: [embed],
            flags: MessageFlags.Ephemeral,
        });
    }
}
