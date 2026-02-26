import { Message, AttachmentBuilder, User } from 'discord.js';
import { Command } from '@sapphire/framework';

export default class AvatarCommand extends Command {
    constructor(context: Command.LoaderContext, options: Command.Options) {
        super(context, {
            ...options,
            description: `Displays a user's profile picture.`,
        });
    }

    public override registerApplicationCommands(registry: Command.Registry): void {
        registry.registerChatInputCommand((builder) =>
            builder
                .setName(this.name)
                .setDescription(this.description)
                .addUserOption((option) =>
                    option
                        .setName('user')
                        .setDescription('The user you wanna display the profile picture of')
                        .setRequired(false)
                )
        );
    }

    public async chatInputRun(interaction: Command.ChatInputCommandInteraction): Promise<void> {
        const user: User = interaction.options.getUser('user') ?? interaction.user;
        const avatarURL = user.displayAvatarURL();

        await interaction.reply({ files: [new AttachmentBuilder(
            avatarURL + '?size=2048',
            { name: user.id + avatarURL.substring(avatarURL.lastIndexOf('.')) }
        )], fetchReply: true }) as Message;
    }
}
