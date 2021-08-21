import { Interaction, CommandInteraction, ButtonInteraction, Constants, TextChannel } from 'discord.js';
import type { Message } from 'discord.js';
import { Listener } from '@sapphire/framework';
import type { PieceContext } from '@sapphire/pieces';
import { Events } from '../models/framework/lib/types/Events';
import { InteractionManager } from '../models/InteractionManager';
import type { APIMessage } from 'discord-api-types';

export default class InteractionCreate extends Listener<typeof Constants.Events.INTERACTION_CREATE> {
    private interactionManager: InteractionManager = new InteractionManager();

    constructor(context: PieceContext) {
        super(context, {
            event: Constants.Events.INTERACTION_CREATE,
        });
    }

    public run(interaction: Interaction): void {
        if (interaction.isCommand()) {
            this.commandInteractionHandler(interaction);
        } else if (interaction.isButton()) {
            this.buttonInteractionHandler(interaction);
        }
    }

    /**
     * @param {CommandInteraction} interaction
     */
    private async commandInteractionHandler(interaction: CommandInteraction): Promise<void> {
        const args = interaction.options;
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
        const payload = { interaction, command, parameters: interaction.options, context: { commandName } };

        // Run global preconditions:
        const globalResult = await this.container.stores.get('slash-command-preconditions').run(
            interaction,
            command,
            context
        );

        if (!globalResult.success) {
            interaction.client.emit(Events.SlashCommandDenied, globalResult.error, payload);

            return;
        }

        // Run command-specific preconditions:
        const localResult = await command.preconditions.run(interaction, command, context);

        if (!localResult.success) {
            interaction.client.emit(Events.SlashCommandDenied, localResult.error, payload);

            return;
        }

        try {
            interaction.client.emit(Events.SlashCommandRun, interaction, command, { ...payload, args });

            const result = await command.run(interaction, args, context);

            interaction.client.emit(Events.SlashCommandSuccess, { ...payload, args, result });
        } catch (error) {
            interaction.client.emit(Events.SlashCommandError, error, { ...payload, args, piece: command });
        } finally {
            interaction.client.emit(Events.SlashCommandFinish, interaction, command, { ...payload, args });
        }
    }

    /**
     * @param {ButtonInteraction} interaction
     */
    private async buttonInteractionHandler(interaction: ButtonInteraction): Promise<void> {
        if (this.interactionManager.hasListeners(interaction.customId)) {
            this.interactionManager.emit(interaction.customId, interaction);
        } else {
            if (interaction.replied) {
                await interaction.editReply({
                    content: 'This button doesn\'t do anything anymore! You can try sending the command again.',
                    components: [],
                });
            } else {
                await interaction.reply({
                    content: 'This button doesn\'t do anything anymore! You can try sending the command again.',
                    components: [],
                    ephemeral: true,
                });
            }

            const interactionMessage = interaction.message;
            let message: Message = interactionMessage as Message;

            if ((interactionMessage as APIMessage).channel_id) {
                const apiMessage: APIMessage = interactionMessage as APIMessage;
                const channelId = apiMessage.channel_id;
                const channel: TextChannel = await interaction.client.channels.fetch(channelId) as TextChannel;

                message = await channel.messages.fetch(apiMessage.id);
            }

            this.interactionManager.removeMessageComponentFromMessage(message);
        }
    }
}
