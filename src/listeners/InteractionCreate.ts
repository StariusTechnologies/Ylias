import { Interaction, ButtonInteraction, Events as DjsEvents } from 'discord.js';
import { Listener } from '@sapphire/framework';
import { InteractionManager } from '#lib/InteractionManager';

export default class InteractionCreate extends Listener<typeof DjsEvents.InteractionCreate> {
    private interactionManager: InteractionManager = new InteractionManager();

    constructor(context: Listener.LoaderContext) {
        super(context, {
            event: DjsEvents.InteractionCreate,
        });
    }

    public run(interaction: Interaction): void {
        if (interaction.isButton()) {
            this.buttonInteractionHandler(interaction);
        }
    }

    private buttonInteractionHandler(interaction: ButtonInteraction): void {
        if (this.interactionManager.hasListeners(interaction.customId)) {
            try {
                this.interactionManager.emit(interaction.customId, interaction);
            } catch (error: unknown) {
                interaction.client.emit('buttonError', error as Error, interaction);
            }
        } else {
            this.interactionManager.handleUnboundButton(interaction);
        }
    }
}
