import { Command, BucketScope } from '@sapphire/framework';
import { fetch } from '@sapphire/fetch';

export default class AwwCommand extends Command {
    constructor(context: Command.LoaderContext, options: Command.Options) {
        super(context, {
            ...options,
            description: 'Sends a link to something cute.',
            cooldownDelay: 10000,
            cooldownScope: BucketScope.User,
        });
    }

    public override registerApplicationCommands(registry: Command.Registry): void {
        registry.registerChatInputCommand((builder) =>
            builder
                .setName(this.name)
                .setDescription(this.description)
                .addBooleanOption((option) =>
                    option
                        .setName('hot')
                        .setDescription('Fetch a post from the hot posts')
                        .setRequired(false)
                )
        );
    }

    public async chatInputRun(interaction: Command.ChatInputCommandInteraction): Promise<void> {
        const isHot = interaction.options.getBoolean('hot') as boolean;
        const url = `https://www.reddit.com/r/aww/${isHot ? '' : 'new'}.json?count=100`;
        const response = await fetch(url) as any;
        const children = response?.data?.children ? response.data.children.filter((child: any) => {
            return child.data?.preview?.images;
        }) : [];

        if (children.length) {
            const picture = children[Math.floor(Math.random() * children.length)];

            await interaction.reply(picture.data.url.replace(/&amp;/gu, '&'));
        } else {
            await interaction.reply({
                content: 'There seem to have been a problem while retrieving an image. Please try again later.',
                ephemeral: true,
            });
        }
    }
}
