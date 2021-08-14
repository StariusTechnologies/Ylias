import { CommandInteraction, MessageEmbed } from 'discord.js';
import { PieceContext } from '@sapphire/pieces';
import { SlashCommand } from '../models/framework/lib/structures/SlashCommand';
import { fetch } from '@sapphire/fetch';
import { BucketScope } from '@sapphire/framework';
import { Emotion, Emotions } from '../models/Emotion';

export default class WikiCommand extends SlashCommand {
    constructor(context: PieceContext) {
        super(context, {
            description: 'I can look up an article on Wikipedia and write the beginning here if you want.',
            arguments: [
                {
                    name: 'language',
                    description: 'Language prefix',
                    type: 'STRING',
                    required: true,
                },
                {
                    name: 'search',
                    description: 'What you are looking for',
                    type: 'STRING',
                    required: true,
                },
            ],
            preconditions: [{
                name: 'Cooldown',
                context: {
                    scope: BucketScope.User,
                    delay: 5000,
                },
            }],
        });
    }

    async run(interaction: CommandInteraction): Promise<void> {
        const languagePrefix = interaction.options.getString('language');
        const search = interaction.options.getString('search');
        const host = 'https://' + languagePrefix + '.wikipedia.org';
        const path = '/w/api.php?action=query&prop=extracts&exintro&explaintext&format=json&redirects=1&titles=';
        const url = host + path + encodeURIComponent(search);

        let data = await fetch(url) as any;

        if (!data?.query?.pages) {
            await interaction.reply({
                embeds: [Emotion.getEmotionEmbed(Emotions.SAD).setTitle('Wikipedia').setDescription(
                    `Seems like Wikipedia crashed. Didn't think that day would come! Sorry ${interaction.user.username}!`
                )],
                ephemeral: true,
            });

            return;
        }

        data = data.query.pages;
        const [firstPageId] = Object.keys(data);

        if (!firstPageId || !data[firstPageId]?.extract) {
            await interaction.reply({
                embeds: [Emotion.getEmotionEmbed(Emotions.SURPRISE).setTitle('Wikipedia').setDescription(
                    `23 19, WE GOT A 23 19!! Oh, wait, it's a 404, sorry. Well, the page you asked for doesn't exist on Wikipédia. Sorry ${interaction.user.username}!`
                )],
                ephemeral: true,
            });

            return;
        }

        const { title, extract } = data[firstPageId];
        const urlWiki = `${host}/wiki/${encodeURIComponent(title)}`;
        const embed = new MessageEmbed().setTitle(title).setURL(urlWiki).setDescription(
            extract.slice(0, 1000) + (extract.length > 1000 ? '...' : '')
        ).setColor(0xE88745);

        await interaction.reply({
            content: `Result for : **${search}**`,
            embeds: [embed],
        });
    }
}
