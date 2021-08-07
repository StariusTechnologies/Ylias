import type { PieceContext } from '@sapphire/pieces';
import { Listener } from '@sapphire/framework';
import { SlashCommandErrorPayload, Events } from '../lib/types/Events';

export class CoreEvent extends Listener<typeof Events.SlashCommandError> {
    public constructor(context: PieceContext) {
        super(context, { event: Events.SlashCommandError });
    }

    public run(error: Error, context: SlashCommandErrorPayload): void {
        const { name, path } = context.piece;

        this.container.logger.error(`Encountered error on slash command "${name}" at path "${path}"`, error);
    }
}
