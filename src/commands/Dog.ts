import { Command, BucketScope } from '@sapphire/framework';
import { fetch, FetchResultTypes } from '@sapphire/fetch';
import { Emotion, Emotions } from '#lib/Emotion';
import Logger from '@lilywonhalf/pretty-logger';
import { MessageFlags } from 'discord-api-types/v10';

export default class DogCommand extends Command {
    constructor(context: Command.LoaderContext, options: Command.Options) {
        super(context, {
            ...options,
            description: 'Displays a random dog.',
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
        const response = await fetch('https://random.dog/woof', FetchResultTypes.Text).catch(error => {
            Logger.notice(error);
        }) as any;

        if (response && response.split('\n').length < 2) {
            await interaction.reply(`https://random.dog/${response.trim()}`);
        } else {
            const embed = Emotion.getEmotionEmbed(Emotions.SAD)
                .setTitle('No more dogs')
                .setDescription('The random dog API seems to be down at the moment.');

            await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
        }
    }
}
