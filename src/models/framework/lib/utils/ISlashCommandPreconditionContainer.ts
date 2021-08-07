import type { Awaited } from '@sapphire/utilities';
import type { UserError, Result } from '@sapphire/framework';
import type { Interaction } from 'discord.js';
import type { SlashCommand } from '../structures/SlashCommand';
import { SlashCommandPreconditionContext } from '../structures/SlashCommandPrecondition';

export type SlashCommandPreconditionContainerResult = Result<unknown, UserError>;

export type SlashCommandPreconditionContainerReturn = Awaited<SlashCommandPreconditionContainerResult>;

export type AsyncSlashCommandPreconditionContainerReturn = Promise<SlashCommandPreconditionContainerResult>;

export interface ISlashCommandPreconditionContainer {
    run(
        interaction: Interaction,
        command: SlashCommand,
        context?: SlashCommandPreconditionContext
    ): SlashCommandPreconditionContainerReturn;
}
