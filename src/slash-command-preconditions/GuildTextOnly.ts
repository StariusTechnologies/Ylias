import type { CommandInteraction, TextBasedChannels } from 'discord.js';
import { Identifiers } from '#framework/lib/errors/Identifiers';
import {
    SlashCommandPrecondition,
    SlashCommandPreconditionResult
} from '#framework/lib/structures/SlashCommandPrecondition';

export class GuildTextOnlyPrecondition extends SlashCommandPrecondition {
    private readonly allowedTypes: TextBasedChannels['type'][] = [
        'GUILD_TEXT',
        'GUILD_PUBLIC_THREAD',
        'GUILD_PRIVATE_THREAD',
    ];

    public run(interaction: CommandInteraction): SlashCommandPreconditionResult {
        return interaction.channel && this.allowedTypes.includes(interaction.channel.type)
            ? this.ok()
            : this.error({
                identifier: Identifiers.PreconditionGuildTextOnly,
                message: 'You can only run this command in server text channels.',
            });
    }
}
