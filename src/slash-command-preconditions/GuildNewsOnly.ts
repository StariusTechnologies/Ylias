import type { CommandInteraction, TextBasedChannels } from 'discord.js';
import { Identifiers } from '../models/framework/lib/errors/Identifiers';
import {
    SlashCommandPrecondition,
    SlashCommandPreconditionResult
} from '../models/framework/lib/structures/SlashCommandPrecondition';

export class GuildNewsOnlyPrecondition extends SlashCommandPrecondition {
    private readonly allowedTypes: TextBasedChannels['type'][] = ['GUILD_NEWS', 'GUILD_NEWS_THREAD'];

    public run(interaction: CommandInteraction): SlashCommandPreconditionResult {
        return interaction.channel && this.allowedTypes.includes(interaction.channel.type)
            ? this.ok()
            : this.error({
                identifier: Identifiers.PreconditionGuildNewsOnly,
                message: 'You can only run this command in server announcement channels.',
            });
    }
}
