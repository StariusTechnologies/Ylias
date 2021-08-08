import type { CommandInteraction } from 'discord.js';
import { Identifiers } from '../models/framework/lib/errors/Identifiers';
import {
    SlashCommandPrecondition,
    SlashCommandPreconditionResult
} from '../models/framework/lib/structures/SlashCommandPrecondition';

export class CorePrecondition extends SlashCommandPrecondition {
    public run(interaction: CommandInteraction): SlashCommandPreconditionResult {
        return interaction.guild === null
            ? this.ok()
            : this.error({
                identifier: Identifiers.SlashCommandPreconditionDMOnly,
                message: 'You cannot run this command outside DMs.',
            });
    }
}
