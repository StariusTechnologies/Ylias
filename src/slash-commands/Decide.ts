import type { CommandInteraction } from 'discord.js';
import type { PieceContext } from '@sapphire/pieces';
import { SlashCommand } from '#framework/lib/structures/SlashCommand';
import { Emotion, Emotions } from '#lib/Emotion';

export default class DecideCommand extends SlashCommand {
    constructor(context: PieceContext) {
        super(context, {
            description: 'Multiple options, you need to make a choice, and you just can\'t make your mind? Let me help :D !',
            arguments: Array(10).fill({}).map((_: any, index) => {
                return {
                    name: `choice${index + 1}`,
                    description: 'One of the options',
                    type: 'STRING',
                    required: index < 2,
                }
            }),
        });
    }

    public async run(interaction: CommandInteraction): Promise<void> {
        const choices = interaction.options.data.filter(option => option.value).map(option => option.value);
        const choice = choices[Math.floor(Math.random() * choices.length)];
        const deliverySentences = [
            `I choose ${choice}!`,
            `${choice}, without a doubt.`,
            `You kidding, right? Pick ${choice}, obviously!`,
            `To make this choice is a big responsibility. But I'm ready. I pick ${choice}.`,
        ];
        const embed = Emotion.getEmotionEmbed(Emotions.NEUTRAL)
            .setTitle('A tough decision')
            .setDescription(deliverySentences[Math.floor(Math.random() * deliverySentences.length)]);

        await interaction.reply({ embeds: [embed] });
    }
}
