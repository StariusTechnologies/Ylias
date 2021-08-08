import type { PieceContext } from '@sapphire/pieces';
import type { CommandInteraction } from 'discord.js';
import { Identifiers } from '../models/framework/lib/errors/Identifiers';
import type { SlashCommand } from '../models/framework/lib/structures/SlashCommand';
import { SlashCommandPrecondition } from '../models/framework/lib/structures/SlashCommandPrecondition';

export class CorePrecondition extends SlashCommandPrecondition {
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
