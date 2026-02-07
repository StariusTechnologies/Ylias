import type { ChatInputCommandInteraction } from 'discord.js';
import { Identifiers } from '#framework/lib/errors/Identifiers';
import {
    SlashCommandPrecondition,
    SlashCommandPreconditionResult
} from '#framework/lib/structures/SlashCommandPrecondition';

export class NSFWPrecondition extends SlashCommandPrecondition {
    public run(interaction: ChatInputCommandInteraction): SlashCommandPreconditionResult {
        // `nsfw` is undefined in DMChannel, writing `=== true` will result in it returning`false`.
        return interaction.channel && Reflect.get(interaction.channel, 'nsfw') === true
            ? this.ok()
            : this.error({
                identifier: Identifiers.PreconditionNSFW,
                message: 'You cannot run this command outside NSFW channels.',
            });
    }
}
