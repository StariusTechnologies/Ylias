import type { CommandInteraction } from 'discord.js';
import { Identifiers } from '../models/framework/lib/errors/Identifiers';
import {
    SlashCommandPrecondition,
    SlashCommandPreconditionResult
} from '../models/framework/lib/structures/SlashCommandPrecondition';

export class GuildPrivateThreadOnlyPrecondition extends SlashCommandPrecondition {
    public run(interaction: CommandInteraction): SlashCommandPreconditionResult {
        return interaction.channel?.isThread() && interaction.channel?.type === 'GUILD_PRIVATE_THREAD'
            ? this.ok()
            : this.error({
                identifier: Identifiers.PreconditionGuildPrivateThreadOnly,
                message: 'You can only run this command in private server thread channels.',
            });
    }
}
