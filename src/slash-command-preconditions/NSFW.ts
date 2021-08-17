import type { CommandInteraction } from 'discord.js';
import { Identifiers } from '../models/framework/lib/errors/Identifiers';
import {
    SlashCommandPrecondition,
    SlashCommandPreconditionResult
} from '../models/framework/lib/structures/SlashCommandPrecondition';

export class CorePrecondition extends SlashCommandPrecondition {
    public run(interaction: CommandInteraction): SlashCommandPreconditionResult {
        // `nsfw` is undefined in DMChannel, writing `=== true` will result in it returning`false`.
        return interaction.channel && Reflect.get(interaction.channel, 'nsfw') === true
            ? this.ok()
            : this.error({
                identifier: Identifiers.PreconditionNSFW,
                message: 'You cannot run this command outside NSFW channels.',
            });
    }
}
