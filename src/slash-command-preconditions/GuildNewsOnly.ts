import { ChannelType, type ChatInputCommandInteraction } from 'discord.js';
import { Identifiers } from '#framework/lib/errors/Identifiers';
import {
    SlashCommandPrecondition,
    SlashCommandPreconditionResult
} from '#framework/lib/structures/SlashCommandPrecondition';

export class GuildNewsOnlyPrecondition extends SlashCommandPrecondition {
    private readonly allowedTypes = [ChannelType.GuildAnnouncement, ChannelType.AnnouncementThread];

    public run(interaction: ChatInputCommandInteraction): SlashCommandPreconditionResult {
        return interaction.channel && this.allowedTypes.includes(interaction.channel.type)
            ? this.ok()
            : this.error({
                identifier: Identifiers.PreconditionGuildNewsOnly,
                message: 'You can only run this command in server announcement channels.',
            });
    }
}
