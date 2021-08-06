import { Interaction } from 'discord.js';
import { PieceContext } from '@sapphire/pieces';
import { SlashCommand } from '../models/SlashCommand';

export default class PingCommand extends SlashCommand {
    constructor(context: PieceContext) {
        super(context, {
            aliases: ['pong'],
            description: 'Tests the latency.',
        });
    }

    async run(interaction: Interaction): Promise<void> {
        const response = await interaction.channel.send('Ping...');
        const latency = response.createdTimestamp - interaction.createdTimestamp;

        await response.edit(`Pong! Took me ${latency}ms.`);
    }
}
