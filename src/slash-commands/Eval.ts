import { ChatInputCommandInteraction, EmbedBuilder, ApplicationCommandOptionType } from 'discord.js';
import type { Piece } from '@sapphire/pieces';
import Logger from '@lilywonhalf/pretty-logger';
import { SlashCommand } from '#framework/lib/structures/SlashCommand';

export default class EvalCommand extends SlashCommand {
    constructor(context: Piece.LoaderContext) {
        super(context, {
            description: 'Allows you to execute nodejs code and display the return value.',
            defaultPermission: false,
            arguments: [{
                name: 'code',
                description: 'The nodejs code you want to execute',
                type: ApplicationCommandOptionType.String,
                required: true,
            }],
            permissions: [{
                type: 'USER',
                id: process.env.MOM as string,
                permission: true,
            }],
        });
    }

    public async run(interaction: ChatInputCommandInteraction): Promise<void> {
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
