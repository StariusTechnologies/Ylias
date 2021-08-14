import { CommandInteraction } from 'discord.js';
import { PieceContext } from '@sapphire/pieces';
import { SlashCommand } from '../models/framework/lib/structures/SlashCommand';
import { SlashCommandArgumentFormats } from '../slash-command-preconditions/ArgumentFormat';
import { Emotion, Emotions } from '../models/Emotion';

export default class SetAvatarCommand extends SlashCommand {
    constructor(context: PieceContext) {
        super(context, {
            name: 'setavatar',
            description: 'Allows you to change my avatar.',
            defaultPermission: false,
            arguments: [{
                name: 'url',
                description: 'The URL of the avatar you would like me to change to.',
                type: 'STRING',
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
                id: process.env.MOM,
                permission: true,
            }],
        });
    }

    async run(interaction: CommandInteraction): Promise<void> {
        interaction.client.user.setAvatar(interaction.options.getString('url')).then(() => {
            const embed = Emotion.getEmotionEmbed(Emotions.NEUTRAL)
                .setTitle('I look great!')
                .setDescription('My profile picture has been successfully changed!');

            interaction.reply({ embeds: [embed] });
        });
    }
}
