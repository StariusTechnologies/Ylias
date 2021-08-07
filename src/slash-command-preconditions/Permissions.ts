import { Interaction, NewsChannel, Permissions, TextChannel } from 'discord.js';
import { Identifiers } from '../models/framework/lib/errors/Identifiers';
import type { SlashCommand } from '../models/framework/lib/structures/SlashCommand';
import {
    SlashCommandPrecondition,
    SlashCommandPreconditionContext,
    SlashCommandPreconditionResult
} from '../models/framework/lib/structures/SlashCommandPrecondition';

export class CorePrecondition extends SlashCommandPrecondition {
    private readonly dmChannelPermissions = new Permissions([
        Permissions.FLAGS.VIEW_CHANNEL,
        Permissions.FLAGS.SEND_MESSAGES,
        Permissions.FLAGS.SEND_TTS_MESSAGES,
        Permissions.FLAGS.EMBED_LINKS,
        Permissions.FLAGS.ATTACH_FILES,
        Permissions.FLAGS.READ_MESSAGE_HISTORY,
        Permissions.FLAGS.MENTION_EVERYONE,
        Permissions.FLAGS.USE_EXTERNAL_EMOJIS,
        Permissions.FLAGS.ADD_REACTIONS,
    ]).freeze();

    public run(
        interaction: Interaction,
        _command: SlashCommand,
        context: SlashCommandPreconditionContext
    ): SlashCommandPreconditionResult {
        const required = (context.permissions as Permissions) ?? new Permissions();
        const channel = interaction.channel as TextChannel | NewsChannel;

        const permissions = interaction.guild
            ? channel.permissionsFor(interaction.client.id)
            : this.dmChannelPermissions;
        const missing = permissions.missing(required);

        return missing.length === 0
            ? this.ok()
            : this.error({
                identifier: Identifiers.SlashCommandPreconditionPermissions,
                message: `I am missing the following permissions to run this command: ${missing
                    .map((perm) => CorePrecondition.readablePermissions[perm])
                    .join(', ')}`,
                context: { missing }
            });
    }

    protected static readonly readablePermissions = {
        ADD_REACTIONS: 'Add Reactions',
        ADMINISTRATOR: 'Administrator',
        ATTACH_FILES: 'Attach Files',
        BAN_MEMBERS: 'Ban Members',
        CHANGE_NICKNAME: 'Change Nickname',
        CONNECT: 'Connect',
        CREATE_INSTANT_INVITE: 'Create Instant Invite',
        DEAFEN_MEMBERS: 'Deafen Members',
        EMBED_LINKS: 'Embed Links',
        KICK_MEMBERS: 'Kick Members',
        MANAGE_CHANNELS: 'Manage Channels',
        MANAGE_EMOJIS_AND_STICKERS: 'Manage Emojis and Stickers',
        MANAGE_GUILD: 'Manage Server',
        MANAGE_MESSAGES: 'Manage Messages',
        MANAGE_NICKNAMES: 'Manage Nicknames',
        MANAGE_ROLES: 'Manage Roles',
        MANAGE_THREADS: 'Manage Threads',
        MANAGE_WEBHOOKS: 'Manage Webhooks',
        MENTION_EVERYONE: 'Mention Everyone',
        MOVE_MEMBERS: 'Move Members',
        MUTE_MEMBERS: 'Mute Members',
        PRIORITY_SPEAKER: 'Priority Speaker',
        READ_MESSAGE_HISTORY: 'Read Message History',
        REQUEST_TO_SPEAK: 'Request to Speak',
        SEND_MESSAGES: 'Send Messages',
        SEND_TTS_MESSAGES: 'Send TTS Messages',
        SPEAK: 'Speak',
        STREAM: 'Stream',
        USE_APPLICATION_COMMANDS: 'Use Application Commands',
        USE_EXTERNAL_EMOJIS: 'Use External Emojis',
        USE_EXTERNAL_STICKERS: 'Use External Stickers',
        USE_PRIVATE_THREADS: 'Use Private Threads',
        USE_PUBLIC_THREADS: 'Use Public Threads',
        USE_VAD: 'Use Voice Activity',
        VIEW_AUDIT_LOG: 'View Audit Log',
        VIEW_CHANNEL: 'Read Messages',
        VIEW_GUILD_INSIGHTS: 'View Guild Insights'
    };
}
