import { Listener, UserError } from '@sapphire/framework';
import { PieceContext } from '@sapphire/pieces';
import { Events, SlashCommandDeniedPayload } from '../models/framework/lib/types/Events';

export default class InteractionCreate extends Listener<typeof Events.SlashCommandDenied> {
    constructor(context: PieceContext) {
        super(context, {
            event: Events.SlashCommandDenied,
        });
    }

    async run(error: UserError, payload: SlashCommandDeniedPayload): Promise<void> {
        await payload.interaction.reply({ content: error.message, ephemeral: true });
    }
}
