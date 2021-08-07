import type { Interaction } from 'discord.js';
import { Identifiers } from '../models/framework/lib/errors/Identifiers';
import {
    SlashCommandPrecondition,
    SlashCommandPreconditionResult
} from '../models/framework/lib/structures/SlashCommandPrecondition';

export class CorePrecondition extends SlashCommandPrecondition {
    public run(interaction: Interaction): SlashCommandPreconditionResult {
        // `nsfw` is undefined in DMChannel, doing `=== true`
        // will result on it returning`false`.
        return Reflect.get(interaction.channel, 'nsfw') === true
            ? this.ok()
            : this.error({
                identifier: Identifiers.PreconditionNSFW,
                message: 'You cannot run this command outside NSFW channels.',
            });
    }
}
