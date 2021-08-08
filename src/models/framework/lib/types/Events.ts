import { CommandInteractionOptionResolver, Constants, CommandInteraction } from 'discord.js';
import type {
    UserError
} from '@sapphire/framework';
import type { SlashCommand, SlashCommandContext } from '../structures/SlashCommand';

export const Events = {
    // #region Discord.js base events
    ChannelCreate: Constants.Events.CHANNEL_CREATE,
    ChannelDelete: Constants.Events.CHANNEL_DELETE,
    ChannelPinsUpdate: Constants.Events.CHANNEL_PINS_UPDATE,
    ChannelUpdate: Constants.Events.CHANNEL_UPDATE,
    ClientReady: Constants.Events.CLIENT_READY,
    Debug: Constants.Events.DEBUG,
    Error: Constants.Events.ERROR,
    GuildBanAdd: Constants.Events.GUILD_BAN_ADD,
    GuildBanRemove: Constants.Events.GUILD_BAN_REMOVE,
    GuildCreate: Constants.Events.GUILD_CREATE,
    GuildDelete: Constants.Events.GUILD_DELETE,
    GuildEmojiCreate: Constants.Events.GUILD_EMOJI_CREATE,
    GuildEmojiDelete: Constants.Events.GUILD_EMOJI_DELETE,
    GuildEmojiUpdate: Constants.Events.GUILD_EMOJI_UPDATE,
    GuildIntegrationsUpdate: Constants.Events.GUILD_INTEGRATIONS_UPDATE,
    GuildMemberAdd: Constants.Events.GUILD_MEMBER_ADD,
    GuildMemberAvailable: Constants.Events.GUILD_MEMBER_AVAILABLE,
    GuildMemberRemove: Constants.Events.GUILD_MEMBER_REMOVE,
    GuildMemberUpdate: Constants.Events.GUILD_MEMBER_UPDATE,
    GuildMembersChunk: Constants.Events.GUILD_MEMBERS_CHUNK,
    GuildRoleCreate: Constants.Events.GUILD_ROLE_CREATE,
    GuildRoleDelete: Constants.Events.GUILD_ROLE_DELETE,
    GuildRoleUpdate: Constants.Events.GUILD_ROLE_UPDATE,
    GuildUnavailable: Constants.Events.GUILD_UNAVAILABLE,
    GuildUpdate: Constants.Events.GUILD_UPDATE,
    Invalidated: Constants.Events.INVALIDATED,
    InviteCreate: Constants.Events.INVITE_CREATE,
    InviteDelete: Constants.Events.INVITE_DELETE,
    MessageBulkDelete: Constants.Events.MESSAGE_BULK_DELETE,
    MessageCreate: Constants.Events.MESSAGE_CREATE,
    MessageDelete: Constants.Events.MESSAGE_DELETE,
    MessageReactionAdd: Constants.Events.MESSAGE_REACTION_ADD,
    MessageReactionRemoveAll: Constants.Events.MESSAGE_REACTION_REMOVE_ALL,
    MessageReactionRemove: Constants.Events.MESSAGE_REACTION_REMOVE,
    MessageUpdate: Constants.Events.MESSAGE_UPDATE,
    PresenceUpdate: Constants.Events.PRESENCE_UPDATE,
    RateLimit: Constants.Events.RATE_LIMIT,
    Raw: Constants.Events.RAW,
    ShardDisconnect: Constants.Events.SHARD_DISCONNECT,
    ShardError: Constants.Events.SHARD_ERROR,
    ShardReady: Constants.Events.SHARD_READY,
    ShardReconnecting: Constants.Events.SHARD_RECONNECTING,
    ShardResume: Constants.Events.SHARD_RESUME,
    TypingStart: Constants.Events.TYPING_START,
    UserUpdate: Constants.Events.USER_UPDATE,
    VoiceStateUpdate: Constants.Events.VOICE_STATE_UPDATE,
    Warn: Constants.Events.WARN,
    WebhooksUpdate: Constants.Events.WEBHOOKS_UPDATE,
    // #endregion Discord.js base events

    // #region Sapphire load cycle events
    CommandAccepted: 'commandAccepted' as const,
    CommandDenied: 'commandDenied' as const,
    CommandError: 'commandError' as const,
    CommandFinish: 'commandFinish' as const,
    CommandRun: 'commandRun' as const,
    CommandSuccess: 'commandSuccess' as const,
    SlashCommandAccepted: 'slashCommandAccepted' as const,
    SlashCommandDenied: 'slashCommandDenied' as const,
    SlashCommandError: 'slashCommandError' as const,
    SlashCommandFinish: 'slashCommandFinish' as const,
    SlashCommandRun: 'slashCommandRun' as const,
    SlashCommandSuccess: 'slashCommandSuccess' as const,
    ListenerError: 'listenerError' as const,
    MentionPrefixOnly: 'mentionPrefixOnly' as const,
    NonPrefixedMessage: 'nonPrefixedMessage' as const,
    PiecePostLoad: 'piecePostLoad' as const,
    PieceUnload: 'pieceUnload' as const,
    PluginLoaded: 'pluginLoaded' as const,
    PreCommandRun: 'preCommandRun' as const,
    PreSlashCommandRun: 'preSlashCommandRun' as const,
    PrefixedMessage: 'prefixedMessage' as const,
    PreMessageParsed: 'preMessageParsed' as const,
    UnknownCommand: 'unknownCommand' as const,
    UnknownCommandName: 'unknownCommandName' as const,
    UnknownSlashCommand: 'unknownSlashCommand' as const,
    UnknownSlashCommandName: 'unknownSlashCommandName' as const,
    // #endregion Sapphire load cycle events
};

export interface UnknownSlashCommandNamePayload {
    interaction: CommandInteraction;
}

export interface UnknownSlashCommandPayload extends UnknownSlashCommandNamePayload {
    commandName: string;
}

export interface ISlashCommandPayload {
    interaction: CommandInteraction;
    command: SlashCommand;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface PreSlashCommandRunPayload extends SlashCommandDeniedPayload {}

export interface SlashCommandDeniedPayload extends ISlashCommandPayload {
    parameters: CommandInteractionOptionResolver;
    context: SlashCommandContext;
}

export interface SlashCommandAcceptedPayload extends ISlashCommandPayload {
    parameters: CommandInteractionOptionResolver;
    context: SlashCommandContext;
}

export interface SlashCommandRunPayload<
    T extends CommandInteractionOptionResolver = CommandInteractionOptionResolver
> extends SlashCommandAcceptedPayload {
    args: T;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SlashCommandFinishPayload<
    T extends CommandInteractionOptionResolver = CommandInteractionOptionResolver
> extends SlashCommandRunPayload<T> {}

export interface SlashCommandErrorPayload<
    T extends CommandInteractionOptionResolver = CommandInteractionOptionResolver
> extends SlashCommandRunPayload<T> {
    piece: SlashCommand;
}

export interface SlashCommandSuccessPayload<
    T extends CommandInteractionOptionResolver = CommandInteractionOptionResolver
> extends SlashCommandRunPayload<T> {
    result: unknown;
}

declare module 'discord.js' {
    interface ClientEvents {
        [Events.UnknownSlashCommandName]: [payload: UnknownSlashCommandNamePayload];
        [Events.UnknownSlashCommand]: [payload: UnknownSlashCommandPayload];
        [Events.PreSlashCommandRun]: [payload: PreSlashCommandRunPayload];
        [Events.SlashCommandDenied]: [error: UserError, payload: SlashCommandDeniedPayload];
        [Events.SlashCommandAccepted]: [payload: SlashCommandAcceptedPayload];
        [Events.SlashCommandRun]: [
            interaction: CommandInteraction,
            command: SlashCommand,
            payload: SlashCommandRunPayload
        ];
        [Events.SlashCommandSuccess]: [payload: SlashCommandSuccessPayload];
        [Events.SlashCommandError]: [error: Error, payload: SlashCommandErrorPayload];
        [Events.SlashCommandFinish]: [
            interaction: CommandInteraction,
            command: SlashCommand,
            payload: SlashCommandFinishPayload
        ];
    }
}
