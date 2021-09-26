import { CommandInteraction, MessageEmbed } from 'discord.js';
import type { PieceContext } from '@sapphire/pieces';
import Logger from '@lilywonhalf/pretty-logger';
import { SlashCommand } from '#framework/lib/structures/SlashCommand';

export default class EvalCommand extends SlashCommand {
    constructor(context: PieceContext) {
        super(context, {
            description: 'Allows you to execute nodejs code and display the return value.',
            defaultPermission: false,
            arguments: [{
                name: 'code',
                description: 'The nodejs code you want to execute',
                type: 'STRING',
                required: true,
            }],
            permissions: [{
                type: 'USER',
                id: process.env.MOM as string,
                permission: true,
            }],
        });
    }

    public async run(interaction: CommandInteraction): Promise<void> {
        let output;
        const embed = new MessageEmbed()
            .setTitle('✅ Code executed')
            .setColor(0xE88745)
            .setFields({
                name: 'Executed code',
                value: `\`\`\`js\n${interaction.options.getString('code')}\`\`\``,
            });

        try {
            output = eval(interaction.options.getString('code', true));
        } catch (error) {
            Logger.exception(error);
            output = error.message;
            embed.setTitle('❌ Code crashed');
        }

        if (!output || output.toString().trim().length < 1) {
            output = '<empty>';
        }

        embed.addField('Result', output.toString());

        await interaction.reply({
            embeds: [embed],
        });
    }
}
