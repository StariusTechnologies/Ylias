import type { CommandInteraction } from 'discord.js';
import { Identifiers } from '../models/framework/lib/errors/Identifiers';
import {
    SlashCommandPrecondition,
    SlashCommandPreconditionResult
} from '../models/framework/lib/structures/SlashCommandPrecondition';

export class CorePrecondition extends SlashCommandPrecondition {
    private readonly allowedTypes: CommandInteraction['channel']['type'][] = [
        'GUILD_TEXT',
        'GUILD_PUBLIC_THREAD',
        'GUILD_PRIVATE_THREAD',
    ];

    public run(interaction: CommandInteraction): SlashCommandPreconditionResult {
        return this.allowedTypes.includes(interaction.channel?.type)
            ? this.ok()
            : this.error({
                identifier: Identifiers.PreconditionGuildTextOnly,
                message: 'You can only run this command in server text channels.',
            });
    }
}
