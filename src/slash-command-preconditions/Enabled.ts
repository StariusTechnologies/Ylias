import type { PieceContext } from '@sapphire/pieces';
import type { CommandInteraction } from 'discord.js';
import { Identifiers } from '#framework/lib/errors/Identifiers';
import type { SlashCommand } from '#framework/lib/structures/SlashCommand';
import { SlashCommandPrecondition } from '#framework/lib/structures/SlashCommandPrecondition';

export class EnabledPrecondition extends SlashCommandPrecondition {
    public constructor(context: PieceContext) {
        super(context, { position: 10 });
    }

    public run(
        _: CommandInteraction,
        command: SlashCommand,
        context: SlashCommandPrecondition.Context
    ): SlashCommandPrecondition.Result {
        return command.enabled ? this.ok() : this.error({
            identifier: Identifiers.CommandDisabled,
            message: 'This command is disabled.',
            context,
        });
    }
}
