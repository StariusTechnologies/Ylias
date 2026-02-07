import { ChannelType, type ChatInputCommandInteraction } from 'discord.js';
import { Identifiers } from '#framework/lib/errors/Identifiers';
import {
    SlashCommandPrecondition,
    SlashCommandPreconditionResult
} from '#framework/lib/structures/SlashCommandPrecondition';

export class GuildNewsThreadOnlyPrecondition extends SlashCommandPrecondition {
    public run(interaction: ChatInputCommandInteraction): SlashCommandPreconditionResult {
        return interaction.channel?.isThread() && interaction.channel?.type === ChannelType.AnnouncementThread
            ? this.ok()
            : this.error({
                identifier: Identifiers.PreconditionGuildNewsThreadOnly,
                message: 'You can only run this command in server announcement thread channels.',
            });
    }
}
