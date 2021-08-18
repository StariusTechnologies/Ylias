import type { CommandInteraction } from 'discord.js';
import type { PieceContext } from '@sapphire/pieces';
import { SlashCommand } from '../models/framework/lib/structures/SlashCommand';
import { fetch } from '@sapphire/fetch';
import { BucketScope } from '@sapphire/framework';
import { Emotion, Emotions } from '../models/Emotion';

export default class ImgurCommand extends SlashCommand {
    constructor(context: PieceContext) {
        super(context, {
            description: 'Displays a random picture.',
            arguments: [{
                name: 'search',
                description: 'Your search query',
                type: 'STRING',
                required: false,
            }],
            preconditions: [{
                name: 'Cooldown',
                context: {
                    scope: BucketScope.User,
                    delay: 10000,
                },
            }],
        });
    }

    async run(interaction: CommandInteraction): Promise<void> {
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

            await interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const results = responses.data.filter((response: any) => {
            return (response?.type?.indexOf('image') > -1 || response.is_album) && !response.nsfw;
        });
        const result = results[Math.floor(Math.random() * results.length)];

        if (!result) {
            const embed = Emotion.getEmotionEmbed(Emotions.SAD)
                .setTitle('No results')
                .setDescription(`Welp... Seems like there is no result for your search...`);

            await interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const link = result.gifv ?? result.link;

        await interaction.reply({
            content: link,
        });
    }
}
