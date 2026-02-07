import { ApplicationCommandOptionType, type ChatInputCommandInteraction } from 'discord.js';
import type { Piece } from '@sapphire/pieces';
import { SlashCommand } from '#framework/lib/structures/SlashCommand';
import { SlashCommandArgumentFormats } from '../slash-command-preconditions/ArgumentFormat';
import { Emotion, Emotions } from '#lib/Emotion';

export default class SetAvatarCommand extends SlashCommand {
    constructor(context: Piece.LoaderContext) {
        super(context, {
            name: 'setavatar',
            description: 'Allows you to change my avatar.',
            defaultPermission: false,
            arguments: [{
                name: 'url',
                description: 'The URL of the avatar you would like me to change to.',
                type: ApplicationCommandOptionType.String,
                required: true,
            }],
            preconditions: [{
                name: 'ArgumentFormat',
                context: {
                    formats: [{
                        name: 'url',
                        errorMessage: 'This URL is invalid',
                        validate: SlashCommandArgumentFormats.URL,
                    }],
                },
            }],
            permissions: [{
                type: 'USER',
                id: process.env.MOM as string,
                permission: true,
            }],
        });
    }

    async run(interaction: ChatInputCommandInteraction): Promise<void> {
        interaction.client.user!.setAvatar(interaction.options.getString('url', true)).then(() => {
            const embed = Emotion.getEmotionEmbed(Emotions.NEUTRAL)
                .setTitle('I look great!')
                .setDescription('My profile picture has been successfully changed!');

            interaction.reply({ embeds: [embed] });
        });
    }
}
