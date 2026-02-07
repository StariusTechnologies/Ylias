import { Interaction, ChatInputCommandInteraction, CommandInteractionOptionResolver, ButtonInteraction, Events as DjsEvents } from 'discord.js';
import { Listener } from '@sapphire/framework';
import { Events } from '#lib/framework/lib/types/Events';
import { InteractionManager } from '#lib/InteractionManager';

export default class InteractionCreate extends Listener<typeof DjsEvents.InteractionCreate> {
    private interactionManager: InteractionManager = new InteractionManager();

    constructor(context: Listener.LoaderContext) {
        super(context, {
            event: DjsEvents.InteractionCreate,
        });
    }

    public run(interaction: Interaction): void {
        if (interaction.isChatInputCommand()) {
            this.commandInteractionHandler(interaction);
        } else if (interaction.isButton()) {
            this.buttonInteractionHandler(interaction);
        }
    }

    private async commandInteractionHandler(interaction: ChatInputCommandInteraction): Promise<void> {
        const args = interaction.options as any;
        const { commandName } = interaction;
        const command = this.container.stores.get('slash-commands').get(commandName);

        if (!command) {
            interaction.client.emit(
                Events.UnknownSlashCommand,
                { interaction, commandName }
            );

            return;
        }

        const context = { commandName };
        const payload = { interaction, command, parameters: interaction.options as CommandInteractionOptionResolver, context: { commandName } };

        // Run global preconditions:
        const globalResult = await this.container.stores.get('slash-command-preconditions').run(
            interaction,
            command,
            context
        );

        if (globalResult.isErr()) {
            interaction.client.emit(Events.SlashCommandDenied, globalResult.unwrapErr(), payload);

            return;
        }

        // Run command-specific preconditions:
        const localResult = await command.preconditions.run(interaction, command, context);

        if (localResult.isErr()) {
            interaction.client.emit(Events.SlashCommandDenied, localResult.unwrapErr(), payload);

            return;
        }

        try {
            interaction.client.emit(Events.SlashCommandRun, interaction, command, { ...payload, args });

            const result = await command.run(interaction, args, context);

            interaction.client.emit(Events.SlashCommandSuccess, { ...payload, args, result });
        } catch (error: unknown) {
            interaction.client.emit(Events.SlashCommandError, error as Error, { ...payload, args, piece: command });
        } finally {
            interaction.client.emit(Events.SlashCommandFinish, interaction, command, { ...payload, args });
        }
    }

    private buttonInteractionHandler(interaction: ButtonInteraction): void {
        if (this.interactionManager.hasListeners(interaction.customId)) {
            try {
                this.interactionManager.emit(interaction.customId, interaction);
            } catch (error: unknown) {
                interaction.client.emit(Events.ButtonError, error as Error, interaction);
            }
        } else {
            this.interactionManager.handleUnboundButton(interaction);
        }
    }
}
