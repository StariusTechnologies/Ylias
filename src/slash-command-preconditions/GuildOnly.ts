import type { CommandInteraction } from 'discord.js';
import { Identifiers } from '#framework/lib/errors/Identifiers';
import {
    SlashCommandPrecondition,
    SlashCommandPreconditionResult
} from '#framework/lib/structures/SlashCommandPrecondition';

export class GuildOnlyPrecondition extends SlashCommandPrecondition {
    public run(interaction: CommandInteraction): SlashCommandPreconditionResult {
        return interaction.guild === null
            ? this.error({
                identifier: Identifiers.PreconditionGuildOnly,
                message: 'You cannot run this command in DMs.',
            })
            : this.ok();
    }
}
