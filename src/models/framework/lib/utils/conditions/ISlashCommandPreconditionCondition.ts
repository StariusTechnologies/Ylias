import type { Interaction } from 'discord.js';
import type { SlashCommand } from '../../structures/SlashCommand';
import type {
    SlashCommandPreconditionContext
} from '../../structures/SlashCommandPrecondition';
import type { ISlashCommandPreconditionContainer, SlashCommandPreconditionContainerReturn } from '../ISlashCommandPreconditionContainer';

export interface ISlashCommandPreconditionCondition {
    sequential(
        interaction: Interaction,
        command: SlashCommand,
        entries: readonly ISlashCommandPreconditionContainer[],
        context: SlashCommandPreconditionContext
    ): SlashCommandPreconditionContainerReturn;

    parallel(
        interaction: Interaction,
        command: SlashCommand,
        entries: readonly ISlashCommandPreconditionContainer[],
        context: SlashCommandPreconditionContext
    ): SlashCommandPreconditionContainerReturn;
}
