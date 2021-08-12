import { CommandInteraction } from 'discord.js';
import { PieceContext } from '@sapphire/pieces';
import { SlashCommand } from '../models/framework/lib/structures/SlashCommand';
import { fetch } from '@sapphire/fetch';
import { BucketScope } from '@sapphire/framework';

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
        const args = interaction.options.getString('search');
        const search = args?.length > 0 ? args : '';
        let path = search ? `/3/gallery/search/` : '/3/gallery/random/random/';

        path += '?q_size_px=med&q=' + encodeURIComponent(search);

        const responses = await fetch(
            'https://api.imgur.com' + path,
            {
                headers: { 'Authorization': `Client-ID ${process.env.IMGUR_CLIENT_ID}` },
            }
        ) as any;

        if (!responses?.data) {
            throw new Error(`Welp... Seems like Imgur API just crashed. I'm sorry ${interaction.user.username}...`);
        }

        const results = responses.data.filter((response: any) => {
            return (response?.type?.indexOf('image') > -1 || response.is_album) && !response.nsfw;
        });
        const result = results[Math.floor(Math.random() * results.length)];

        if (!result) {
            throw new Error(`Welp... Seems like there is no result for your search. I'm sorry ${interaction.user.username}...`);
        }

        const link = result.gifv ?? result.link;

        await interaction.reply({
            content: link,
        });
    }
}
