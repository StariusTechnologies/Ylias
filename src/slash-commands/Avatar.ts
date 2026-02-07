import { ChatInputCommandInteraction, Message, AttachmentBuilder, User, ApplicationCommandOptionType } from 'discord.js';
import type { Piece } from '@sapphire/pieces';
import { SlashCommand } from '#framework/lib/structures/SlashCommand';

export default class AvatarCommand extends SlashCommand {
    constructor(context: Piece.LoaderContext) {
        super(context, {
            description: `Displays a user's profile picture.`,
            arguments: [{
                name: 'user',
                description: 'The user you wanna display the profile picture of',
                type: ApplicationCommandOptionType.User,
                required: false,
            }],
        });
    }

    public async run(interaction: ChatInputCommandInteraction): Promise<void> {
        const user: User = interaction.options.getUser('user') ?? interaction.user;
        const avatarURL = user.displayAvatarURL();

        await interaction.reply({ files: [new AttachmentBuilder(
            avatarURL + '?size=2048',
            { name: user.id + avatarURL.substring(avatarURL.lastIndexOf('.')) }
        )], fetchReply: true }) as Message;
    }
}
