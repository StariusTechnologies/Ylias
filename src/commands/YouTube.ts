import { Command, BucketScope } from '@sapphire/framework';
import { fetch } from '@sapphire/fetch';
import Logger from '@lilywonhalf/pretty-logger';
import { Emotion, Emotions } from '#lib/Emotion';

export default class YouTubeCommand extends Command {
    private static readonly YOUTUBE_VIDEO_KIND = 'youtube#video';

    constructor(context: Command.LoaderContext, options: Command.Options) {
        super(context, {
            ...options,
            description: 'Allows you to search a video on YouTube.',
            cooldownDelay: 5000,
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
                        .setName('query')
                        .setDescription('The search query')
                        .setRequired(true)
                )
        );
    }

    public async chatInputRun(interaction: Command.ChatInputCommandInteraction): Promise<void> {
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
                    break;
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
