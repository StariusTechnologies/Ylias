import type { CommandInteraction } from 'discord.js';
import type { PieceContext } from '@sapphire/pieces';
import { fetch } from '@sapphire/fetch';
import { BucketScope } from '@sapphire/framework';
import Logger from '@lilywonhalf/pretty-logger';
import { SlashCommand } from '#framework/lib/structures/SlashCommand';
import { Emotion, Emotions } from '#lib/Emotion';

export default class YouTubeCommand extends SlashCommand {
    private static readonly YOUTUBE_VIDEO_KIND = 'youtube#video';

    constructor(context: PieceContext) {
        super(context, {
            description: 'Allows you to search a video on YouTube.',
            arguments: [{
                name: 'query',
                description: 'The search query',
                type: 'STRING',
                required: true,
            }],
            preconditions: [{
                name: 'Cooldown',
                context: {
                    scope: BucketScope.User,
                    delay: 5000,
                },
            }],
        });
    }

    public async run(interaction: CommandInteraction): Promise<void> {
        const videoURL = 'https://www.youtube.com/watch?v=';
        const apiBaseURL = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=50`;
        const query = encodeURIComponent(interaction.options.getString('query', true));
        const apiURL = `${apiBaseURL}&key=${process.env.GOOGLE_API_KEY}&q=${query}`;
        const response: any = await fetch(apiURL);
        const errorEmbed = Emotion.getEmotionEmbed(Emotions.SAD).setTitle('YouTube');

        if (response?.items) {
            let link;

            for (const item of response.items) {
                if (item.id.kind === YouTubeCommand.YOUTUBE_VIDEO_KIND) {
                    link = videoURL + item.id.videoId;
                }
            }

            if (link) {
                await interaction.reply(link);
            } else {
                await interaction.reply({ embeds: [errorEmbed.setDescription('No results found.')] });
            }
        } else {
            Logger.exception(response);

            const errorMessage = `YouTube sent an error: ${response.error}`;
            const failedMessage = `It seems like YouTube is not working.`;

            errorEmbed.setDescription(response.error ? errorMessage : failedMessage);

            await interaction.reply({ embeds: [errorEmbed] });
        }
    }
}
