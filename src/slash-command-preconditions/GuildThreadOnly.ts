import type { CommandInteraction } from 'discord.js';
import { Identifiers } from '#framework/lib/errors/Identifiers';
import {
    SlashCommandPrecondition,
    SlashCommandPreconditionResult
} from '#framework/lib/structures/SlashCommandPrecondition';

export class GuildThreadOnlyPrecondition extends SlashCommandPrecondition {
    public run(interaction: CommandInteraction): SlashCommandPreconditionResult {
        return interaction.channel?.isThread()
            ? this.ok()
            : this.error({
                identifier: Identifiers.PreconditionThreadOnly,
                message: 'You can only run this command in server thread channels.',
            });
    }
}
