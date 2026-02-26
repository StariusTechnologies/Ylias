import { Command, BucketScope } from '@sapphire/framework';
import { fetch } from '@sapphire/fetch';
import { Emotion, Emotions } from '#lib/Emotion';
import { MessageFlags } from 'discord-api-types/v10';

export default class ImgurCommand extends Command {
    constructor(context: Command.LoaderContext, options: Command.Options) {
        super(context, {
            ...options,
            description: 'Displays a random picture.',
            cooldownDelay: 10000,
            cooldownScope: BucketScope.User,
        });
    }

    public override registerApplicationCommands(registry: Command.Registry): void {
        registry.registerChatInputCommand((builder) =>
            builder
                .setName(this.name)
                .setDescription(this.description)
                .addStringOption((option) =>
                    option
                        .setName('search')
                        .setDescription('Your search query')
                        .setRequired(false)
                )
        );
    }

    async chatInputRun(interaction: Command.ChatInputCommandInteraction): Promise<void> {
        const search = interaction.options.getString('search') ?? '';
        let path = search.length > 0 ? `/3/gallery/search/` : '/3/gallery/random/random/';

        path += '?q_size_px=med&q=' + encodeURIComponent(search);

        const responses = await fetch(
            'https://api.imgur.com' + path,
            {
                headers: { 'Authorization': `Client-ID ${process.env.IMGUR_CLIENT_ID}` },
            }
        ) as any;

        if (!responses?.data) {
            const embed = Emotion.getEmotionEmbed(Emotions.SAD)
                .setTitle('No more images')
                .setDescription(`Welp... Seems like Imgur API just crashed...`);

            await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
        }

        const results = responses.data.filter((response: any) => {
            return (response?.type?.indexOf('image') > -1 || response.is_album) && !response.nsfw;
        });
        const result = results[Math.floor(Math.random() * results.length)];

        if (!result) {
            const embed = Emotion.getEmotionEmbed(Emotions.SAD)
                .setTitle('No results')
                .setDescription(`Welp... Seems like there is no result for your search...`);

            await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
        }

        const link = result.gifv ?? result.link;

        await interaction.reply({
            content: link,
        });
    }
}
