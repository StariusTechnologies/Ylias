import type { Awaited } from '@sapphire/utilities';
import type { UserError, Result } from '@sapphire/framework';
import type { CommandInteraction } from 'discord.js';
import type { SlashCommand } from '../structures/SlashCommand';
import { SlashCommandPreconditionContext } from '../structures/SlashCommandPrecondition';

export type SlashCommandPreconditionContainerResult = Result<unknown, UserError>;

export type SlashCommandPreconditionContainerReturn = Awaited<SlashCommandPreconditionContainerResult>;

export type AsyncSlashCommandPreconditionContainerReturn = Promise<SlashCommandPreconditionContainerResult>;

export interface ISlashCommandPreconditionContainer {
    run(
        interaction: CommandInteraction,
        command: SlashCommand,
        context?: SlashCommandPreconditionContext
    ): SlashCommandPreconditionContainerReturn;
}
