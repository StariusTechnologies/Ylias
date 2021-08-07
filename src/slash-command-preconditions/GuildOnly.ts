import type { Interaction } from 'discord.js';
import { Identifiers } from '../models/framework/lib/errors/Identifiers';
import {
    SlashCommandPrecondition,
    SlashCommandPreconditionResult
} from '../models/framework/lib/structures/SlashCommandPrecondition';

export class CorePrecondition extends SlashCommandPrecondition {
    public run(interaction: Interaction): SlashCommandPreconditionResult {
        return interaction.guild === null
            ? this.error({
                identifier: Identifiers.PreconditionGuildOnly,
                message: 'You cannot run this command in DMs.'
            })
            : this.ok();
    }
}
