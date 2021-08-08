import { CommandInteraction, Message } from 'discord.js';
import { PieceContext } from '@sapphire/pieces';
import { SlashCommand } from '../models/framework/lib/structures/SlashCommand';

export default class PingCommand extends SlashCommand {
    constructor(context: PieceContext) {
        super(context, {
            description: 'Tests the latency.',
        });
    }

    async run(interaction: CommandInteraction): Promise<void> {
        const response = await interaction.reply({ content: 'Ping...', fetchReply: true }) as Message;
        const latency = response.createdTimestamp - interaction.createdTimestamp;

        await interaction.editReply(`Pong! Took me ${latency}ms.`);
    }
}
