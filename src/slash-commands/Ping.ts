import type { CommandInteraction, Message } from 'discord.js';
import type { APIMessage } from 'discord-api-types';
import type { PieceContext } from '@sapphire/pieces';
import { SlashCommand } from '#framework/lib/structures/SlashCommand';

export default class PingCommand extends SlashCommand {
    constructor(context: PieceContext) {
        super(context, {
            description: 'Tests the latency.',
        });
    }

    public async run(interaction: CommandInteraction): Promise<void> {
        const response = await interaction.reply({ content: 'Ping...', fetchReply: true });
        let responseTimestamp;

        if ((response as Message).createdTimestamp) {
            responseTimestamp = (response as Message).createdTimestamp;
        } else {
            responseTimestamp = Date.parse((response as APIMessage).timestamp);
        }

        const latency = responseTimestamp - interaction.createdTimestamp;

        await interaction.editReply(`Pong! Took me ${latency}ms.`);
    }
}
