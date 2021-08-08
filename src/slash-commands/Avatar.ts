import { CommandInteraction, Message, MessageAttachment, User } from 'discord.js';
import { PieceContext } from '@sapphire/pieces';
import { SlashCommand } from '../models/framework/lib/structures/SlashCommand';

export default class AvatarCommand extends SlashCommand {
    constructor(context: PieceContext) {
        super(context, {
            description: `Displays a user's profile picture.`,
            arguments: [{
                name: 'user',
                description: 'The user you wanna display the profile picture of',
                type: 'USER',
                required: false,
            }],
        });
    }

    async run(interaction: CommandInteraction): Promise<void> {
        const user: User = interaction.options.getUser('user') ?? interaction.user;
        const avatarURL = user.displayAvatarURL({ dynamic: true });

        await interaction.reply({ files: [new MessageAttachment(
            avatarURL + '?size=2048',
            user.id + avatarURL.substr(avatarURL.lastIndexOf('.'))
        )], fetchReply: true }) as Message;
    }
}
