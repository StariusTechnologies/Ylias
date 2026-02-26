import { Command } from '@sapphire/framework';
import { Emotion, Emotions } from '#lib/Emotion';

export default class DecideCommand extends Command {
    constructor(context: Command.LoaderContext, options: Command.Options) {
        super(context, {
            ...options,
            description: 'Multiple options, you need to make a choice, and you just can\'t make your mind? Let me help :D !',
        });
    }

    public override registerApplicationCommands(registry: Command.Registry): void {
        registry.registerChatInputCommand((builder) => {
            builder.setName(this.name).setDescription(this.description);

            for (let i = 0; i < 10; i++) {
                builder.addStringOption((option) =>
                    option
                        .setName(`choice${i + 1}`)
                        .setDescription('One of the options')
                        .setRequired(i < 2)
                );
            }

            return builder;
        });
    }

    public async chatInputRun(interaction: Command.ChatInputCommandInteraction): Promise<void> {
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
