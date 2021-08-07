import type { Interaction } from 'discord.js';
import { Identifiers } from '../models/framework/lib/errors/Identifiers';
import {
    SlashCommandPrecondition,
    SlashCommandPreconditionResult
} from '../models/framework/lib/structures/SlashCommandPrecondition';

export class CorePrecondition extends SlashCommandPrecondition {
    public run(interaction: Interaction): SlashCommandPreconditionResult {
        return interaction.channel.isThread() && interaction.channel.type === 'GUILD_NEWS_THREAD'
            ? this.ok()
            : this.error({
                identifier: Identifiers.PreconditionGuildNewsThreadOnly,
                message: 'You can only run this command in server announcement thread channels.',
            });
    }
}
