import type { Interaction } from 'discord.js';
import { Identifiers } from '../models/framework/lib/errors/Identifiers';
import {
    SlashCommandPrecondition,
    SlashCommandPreconditionResult
} from '../models/framework/lib/structures/SlashCommandPrecondition';

export class CorePrecondition extends SlashCommandPrecondition {
    private readonly allowedTypes: Interaction['channel']['type'][] = ['GUILD_NEWS', 'GUILD_NEWS_THREAD'];

    public run(interaction: Interaction): SlashCommandPreconditionResult {
        return this.allowedTypes.includes(interaction.channel.type)
            ? this.ok()
            : this.error({
                identifier: Identifiers.PreconditionGuildNewsOnly,
                message: 'You can only run this command in server announcement channels.',
            });
    }
}
