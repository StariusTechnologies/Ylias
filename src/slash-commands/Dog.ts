import type { ChatInputCommandInteraction } from 'discord.js';
import type { Piece } from '@sapphire/pieces';
import { SlashCommand } from '#framework/lib/structures/SlashCommand';
import { fetch, FetchResultTypes } from '@sapphire/fetch';
import { BucketScope } from '@sapphire/framework';
import { Emotion, Emotions } from '#lib/Emotion';
import Logger from '@lilywonhalf/pretty-logger';

export default class DogCommand extends SlashCommand {
    constructor(context: Piece.LoaderContext) {
        super(context, {
            description: 'Displays a random dog.',
            preconditions: [{
                name: 'Cooldown',
                context: {
                    scope: BucketScope.User,
                    delay: 10000,
                },
            }],
        });
    }

    public async run(interaction: ChatInputCommandInteraction): Promise<void> {
        const response = await fetch('https://random.dog/woof', FetchResultTypes.Text).catch(error => {
            Logger.notice(error);
        }) as any;

        if (response && response.split('\n').length < 2) {
            await interaction.reply(`https://random.dog/${response.trim()}`);
        } else {
            const embed = Emotion.getEmotionEmbed(Emotions.SAD)
                .setTitle('No more dogs')
                .setDescription('The random dog API seems to be down at the moment.');

            await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }
}
