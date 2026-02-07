import { ChannelType, type ChatInputCommandInteraction } from 'discord.js';
import { Identifiers } from '#framework/lib/errors/Identifiers';
import {
    SlashCommandPrecondition,
    SlashCommandPreconditionResult
} from '#framework/lib/structures/SlashCommandPrecondition';

export class GuildPublicThreadOnlyPrecondition extends SlashCommandPrecondition {
    public run(interaction: ChatInputCommandInteraction): SlashCommandPreconditionResult {
        return interaction.channel?.isThread() && interaction.channel?.type === ChannelType.PublicThread
            ? this.ok()
            : this.error({
                identifier: Identifiers.PreconditionGuildPublicThreadOnly,
                message: 'You can only run this command in public server thread channels.',
            });
    }
}
