import { EmbedBuilder } from 'discord.js';
import { Command } from '@sapphire/framework';
import Logger from '@lilywonhalf/pretty-logger';

export default class EvalCommand extends Command {
    constructor(context: Command.LoaderContext, options: Command.Options) {
        super(context, {
            ...options,
            description: 'Allows you to execute nodejs code and display the return value.',
            preconditions: ['OwnerOnly'],
        });
    }

    public override registerApplicationCommands(registry: Command.Registry): void {
        registry.registerChatInputCommand((builder) =>
            builder
                .setName(this.name)
                .setDescription(this.description)
                .addStringOption((option) =>
                    option
                        .setName('code')
                        .setDescription('The nodejs code you want to execute')
                        .setRequired(true)
                )
        );
    }

    public async chatInputRun(interaction: Command.ChatInputCommandInteraction): Promise<void> {
        let output;
        const embed = new EmbedBuilder()
            .setTitle('✅ Code executed')
            .setColor(0xE88745)
            .setFields({
                name: 'Executed code',
                value: `\`\`\`js\n${interaction.options.getString('code')}\`\`\``,
            });

        try {
            output = eval(interaction.options.getString('code', true));
        } catch (error: any) {
            Logger.exception(error);
            output = error.message;
            embed.setTitle('❌ Code crashed');
        }

        if (!output || output.toString().trim().length < 1) {
            output = '<empty>';
        }

        embed.addFields({ name: 'Result', value: output.toString() });

        await interaction.reply({
            embeds: [embed],
        });
    }
}
