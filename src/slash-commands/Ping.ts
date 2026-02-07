import type { ChatInputCommandInteraction } from 'discord.js';
import type { Piece } from '@sapphire/pieces';
import { SlashCommand } from '#framework/lib/structures/SlashCommand';

export default class PingCommand extends SlashCommand {
    constructor(context: Piece.LoaderContext) {
        super(context, {
            description: 'Tests the latency.',
        });
    }

    public async run(interaction: ChatInputCommandInteraction): Promise<void> {
        const response = await interaction.reply({ content: 'Ping...', fetchReply: true });
        const latency = response.createdTimestamp - interaction.createdTimestamp;

        await interaction.editReply(`Pong! Took me ${latency}ms.`);
    }
}
