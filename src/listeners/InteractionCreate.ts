import { Interaction, CommandInteraction } from 'discord.js';
import { Listener } from '@sapphire/framework';
import { PieceContext } from '@sapphire/pieces';

export default class InteractionCreate extends Listener {
    constructor(context: PieceContext) {
        super(context, {
            event: 'interactionCreate',
        });
    }

    /**
     * @param {Interaction} interaction
     */
    run(interaction: Interaction): void {
        if (interaction.isCommand()) {
            this._commandInteractionHandler(interaction);
        }
    }

    /**
     * @param {CommandInteraction} interaction
     */
    async _commandInteractionHandler(interaction: CommandInteraction): Promise<void> {
        if (interaction.commandName.toLowerCase() === 'ping') {
            // Do something
        }
    }
}
