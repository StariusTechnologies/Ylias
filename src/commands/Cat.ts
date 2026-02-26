import { Command, BucketScope } from '@sapphire/framework';
import { fetch } from '@sapphire/fetch';
import Logger from '@lilywonhalf/pretty-logger';
import { Emotion, Emotions } from '#lib/Emotion';

export default class CatCommand extends Command {
    constructor(context: Command.LoaderContext, options: Command.Options) {
        super(context, {
            ...options,
            description: 'Displays a random cat.',
            cooldownDelay: 10000,
            cooldownScope: BucketScope.User,
        });
    }

    public override registerApplicationCommands(registry: Command.Registry): void {
        registry.registerChatInputCommand((builder) =>
            builder.setName(this.name).setDescription(this.description)
        );
    }

    public async chatInputRun(interaction: Command.ChatInputCommandInteraction): Promise<void> {
        const response = await fetch(
            'https://api.thecatapi.com/v1/images/search',
            (process.env.CAT_API_KEY ? {
                headers: {
                    'x-api-key': process.env.CAT_API_KEY,
                },
            } : {})
        ).catch(error => {
            Logger.notice(error);
        }) as any;

        if (response?.length) {
            await interaction.reply(response[0].url);
        } else {
            const embed = Emotion.getEmotionEmbed(Emotions.SAD)
                .setTitle('No more cats')
                .setDescription('The random cat API seems to be down at the moment.');

            await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }
}
