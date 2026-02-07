import { ChannelType, type ChatInputCommandInteraction } from 'discord.js';
import { Identifiers } from '#framework/lib/errors/Identifiers';
import {
    SlashCommandPrecondition,
    SlashCommandPreconditionResult
} from '#framework/lib/structures/SlashCommandPrecondition';

export class GuildTextOnlyPrecondition extends SlashCommandPrecondition {
    private readonly allowedTypes = [
        ChannelType.GuildText,
        ChannelType.PublicThread,
        ChannelType.PrivateThread,
    ];

    public run(interaction: ChatInputCommandInteraction): SlashCommandPreconditionResult {
        return interaction.channel && this.allowedTypes.includes(interaction.channel.type)
            ? this.ok()
            : this.error({
                identifier: Identifiers.PreconditionGuildTextOnly,
                message: 'You can only run this command in server text channels.',
            });
    }
}
