import type { UserError, Result } from '@sapphire/framework';
import type { CommandInteraction } from 'discord.js';
import type { SlashCommand } from '#framework/lib/structures/SlashCommand';
import type { SlashCommandPreconditionContext } from '#framework/lib/structures/SlashCommandPrecondition';

export type SlashCommandPreconditionContainerResult = Result<unknown, UserError>;

export type SlashCommandPreconditionContainerReturn = SlashCommandPreconditionContainerResult | Promise<SlashCommandPreconditionContainerResult>;

export type AsyncSlashCommandPreconditionContainerReturn = Promise<SlashCommandPreconditionContainerResult>;

export interface ISlashCommandPreconditionContainer {
    run(
        interaction: CommandInteraction,
        command: SlashCommand,
        context?: SlashCommandPreconditionContext
    ): SlashCommandPreconditionContainerReturn;
}
