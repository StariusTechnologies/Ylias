import type { CommandInteraction } from 'discord.js';
import type { SlashCommand } from '#framework/lib/structures/SlashCommand';
import type {
    SlashCommandPreconditionContext
} from '#framework/lib/structures/SlashCommandPrecondition';
import type {
    ISlashCommandPreconditionContainer,
    AsyncSlashCommandPreconditionContainerReturn
} from '#framework/lib/utils/ISlashCommandPreconditionContainer';

export interface ISlashCommandPreconditionCondition {
    sequential(
        interaction: CommandInteraction,
        command: SlashCommand,
        entries: readonly ISlashCommandPreconditionContainer[],
        context: SlashCommandPreconditionContext
    ): AsyncSlashCommandPreconditionContainerReturn;

    parallel(
        interaction: CommandInteraction,
        command: SlashCommand,
        entries: readonly ISlashCommandPreconditionContainer[],
        context: SlashCommandPreconditionContext
    ): AsyncSlashCommandPreconditionContainerReturn;
}
