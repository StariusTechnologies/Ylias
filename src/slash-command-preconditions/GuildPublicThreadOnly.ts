import type { CommandInteraction } from 'discord.js';
import { Identifiers } from '#framework/lib/errors/Identifiers';
import {
    SlashCommandPrecondition,
    SlashCommandPreconditionResult
} from '#framework/lib/structures/SlashCommandPrecondition';

export class GuildPublicThreadOnlyPrecondition extends SlashCommandPrecondition {
    public run(interaction: CommandInteraction): SlashCommandPreconditionResult {
        return interaction.channel?.isThread() && interaction.channel?.type === 'GUILD_PUBLIC_THREAD'
            ? this.ok()
            : this.error({
                identifier: Identifiers.PreconditionGuildPublicThreadOnly,
                message: 'You can only run this command in public server thread channels.',
            });
    }
}
