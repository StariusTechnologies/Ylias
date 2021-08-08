import type { CommandInteraction } from 'discord.js';
import type { SlashCommand } from '../../structures/SlashCommand';
import type {
    SlashCommandPreconditionContext
} from '../../structures/SlashCommandPrecondition';
import type { ISlashCommandPreconditionContainer, SlashCommandPreconditionContainerReturn } from '../ISlashCommandPreconditionContainer';

export interface ISlashCommandPreconditionCondition {
    sequential(
        interaction: CommandInteraction,
        command: SlashCommand,
        entries: readonly ISlashCommandPreconditionContainer[],
        context: SlashCommandPreconditionContext
    ): SlashCommandPreconditionContainerReturn;

    parallel(
        interaction: CommandInteraction,
        command: SlashCommand,
        entries: readonly ISlashCommandPreconditionContainer[],
        context: SlashCommandPreconditionContext
    ): SlashCommandPreconditionContainerReturn;
}
