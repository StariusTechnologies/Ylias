import type { ChatInputCommandInteraction } from 'discord.js';
import type { Piece } from '@sapphire/pieces';
import { fetch } from '@sapphire/fetch';
import { BucketScope } from '@sapphire/framework';
import Logger from '@lilywonhalf/pretty-logger';
import { SlashCommand } from '#framework/lib/structures/SlashCommand';
import { Emotion, Emotions } from '#lib/Emotion';

export default class CatCommand extends SlashCommand {
    constructor(context: Piece.LoaderContext) {
        super(context, {
            description: 'Displays a random cat.',
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
        const response = await fetch('https://aws.random.cat/meow').catch(error => {
            Logger.notice(error);
        }) as any;

        if (response?.file) {
            await interaction.reply(response.file);
        } else {
            const embed = Emotion.getEmotionEmbed(Emotions.SAD)
                .setTitle('No more cats')
                .setDescription('The random cat API seems to be down at the moment.');

            await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }
}
