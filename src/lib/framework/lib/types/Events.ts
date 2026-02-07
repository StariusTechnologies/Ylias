import { CommandInteractionOptionResolver, Events as DjsEvents, CommandInteraction } from 'discord.js';
import type { UserError } from '@sapphire/framework';
import type { SlashCommand, SlashCommandContext } from '#framework/lib/structures/SlashCommand';

export const Events = {
    // #region Discord.js base events
    ChannelCreate: DjsEvents.ChannelCreate,
    ChannelDelete: DjsEvents.ChannelDelete,
    ChannelPinsUpdate: DjsEvents.ChannelPinsUpdate,
    ChannelUpdate: DjsEvents.ChannelUpdate,
    ClientReady: DjsEvents.ClientReady,
    Debug: DjsEvents.Debug,
    Error: DjsEvents.Error,
    GuildBanAdd: DjsEvents.GuildBanAdd,
    GuildBanRemove: DjsEvents.GuildBanRemove,
    GuildCreate: DjsEvents.GuildCreate,
    GuildDelete: DjsEvents.GuildDelete,
    GuildEmojiCreate: DjsEvents.GuildEmojiCreate,
    GuildEmojiDelete: DjsEvents.GuildEmojiDelete,
    GuildEmojiUpdate: DjsEvents.GuildEmojiUpdate,
    GuildIntegrationsUpdate: DjsEvents.GuildIntegrationsUpdate,
    GuildMemberAdd: DjsEvents.GuildMemberAdd,
    GuildMemberAvailable: DjsEvents.GuildMemberAvailable,
    GuildMemberRemove: DjsEvents.GuildMemberRemove,
    GuildMemberUpdate: DjsEvents.GuildMemberUpdate,
    GuildMembersChunk: DjsEvents.GuildMembersChunk,
    GuildRoleCreate: DjsEvents.GuildRoleCreate,
    GuildRoleDelete: DjsEvents.GuildRoleDelete,
    GuildRoleUpdate: DjsEvents.GuildRoleUpdate,
    GuildUpdate: DjsEvents.GuildUpdate,
    InviteCreate: DjsEvents.InviteCreate,
    InviteDelete: DjsEvents.InviteDelete,
    MessageBulkDelete: DjsEvents.MessageBulkDelete,
    MessageCreate: DjsEvents.MessageCreate,
    MessageDelete: DjsEvents.MessageDelete,
    MessageReactionAdd: DjsEvents.MessageReactionAdd,
    MessageReactionRemoveAll: DjsEvents.MessageReactionRemoveAll,
    MessageReactionRemove: DjsEvents.MessageReactionRemove,
    MessageUpdate: DjsEvents.MessageUpdate,
    PresenceUpdate: DjsEvents.PresenceUpdate,
    Raw: DjsEvents.Raw,
    ShardDisconnect: DjsEvents.ShardDisconnect,
    ShardError: DjsEvents.ShardError,
    ShardReady: DjsEvents.ShardReady,
    ShardReconnecting: DjsEvents.ShardReconnecting,
    ShardResume: DjsEvents.ShardResume,
    TypingStart: DjsEvents.TypingStart,
    UserUpdate: DjsEvents.UserUpdate,
    VoiceStateUpdate: DjsEvents.VoiceStateUpdate,
    Warn: DjsEvents.Warn,
    WebhooksUpdate: DjsEvents.WebhooksUpdate,
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
    ButtonError: 'buttonError' as const,
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
        unknownSlashCommandName: [payload: UnknownSlashCommandNamePayload];
        unknownSlashCommand: [payload: UnknownSlashCommandPayload];
        preSlashCommandRun: [payload: PreSlashCommandRunPayload];
        slashCommandDenied: [error: UserError, payload: SlashCommandDeniedPayload];
        slashCommandAccepted: [payload: SlashCommandAcceptedPayload];
        slashCommandRun: [
            interaction: CommandInteraction,
            command: SlashCommand,
            payload: SlashCommandRunPayload
        ];
        slashCommandSuccess: [payload: SlashCommandSuccessPayload];
        slashCommandError: [error: Error, payload: SlashCommandErrorPayload];
        buttonError: [error: Error, interaction: ButtonInteraction];
        slashCommandFinish: [
            interaction: CommandInteraction,
            command: SlashCommand,
            payload: SlashCommandFinishPayload
        ];
    }
}
