import { CommandInteraction, MessageEmbed } from 'discord.js';
import type { PieceContext } from '@sapphire/pieces';
import { fetch } from '@sapphire/fetch';
import { BucketScope } from '@sapphire/framework';
import { SlashCommand } from '#framework/lib/structures/SlashCommand';
import { Emotion, Emotions } from '#lib/Emotion';

export default class WikiCommand extends SlashCommand {
    private static wikipediaLanguages = [
        'en', 'fr', 'de', 'es', 'ja', 'ru', 'it', 'zh', 'pt', 'ar', 'fa', 'pl', 'nl', 'id', 'uk', 'he', 'sv', 'cs',
        'ko', 'vi', 'ca', 'no', 'fi', 'hu', 'tr', 'th', 'hi', 'bn', 'simple', 'ceb', 'ro', 'sw', 'kk', 'da', 'eo', 'sr',
        'lt', 'sk', 'bg', 'sl', 'eu', 'et', 'hr', 'ms', 'el', 'arz', 'ur', 'ta', 'te', 'nn', 'gl', 'az', 'af', 'bs',
        'be', 'ml', 'ka', 'is', 'sq', 'uz', 'la', 'mk', 'lv', 'azb', 'mr', 'sh', 'tl', 'cy', 'ckb', 'ast', 'jv',
        'be-tarask', 'zh-yue', 'hy', 'pa', 'sa', 'as', 'my', 'kn', 'si', 'ha', 'war', 'zh-min-nan', 'vo', 'min',
        'lmo', 'ht', 'lb', 'br', 'gu', 'tg', 'sco', 'ku', 'new', 'bpy', 'nds', 'io', 'pms', 'su', 'oc', 'nap', 'ba',
        'scn', 'wa', 'bar', 'an', 'ksh', 'szl', 'fy', 'frr', 'als', 'ia', 'ga', 'yi', 'mg', 'gd', 'vec', 'ce', 'mai',
        'xmf', 'sd', 'wuu', 'mrj', 'mhr', 'km', 'roa-tara', 'am', 'roa-rup', 'map-bms', 'bh', 'mnw', 'shn', 'bcl', 'co',
        'cv', 'dv', 'nds-nl', 'fo', 'hif', 'fur', 'gan', 'glk', 'hak', 'ilo', 'pam', 'csb', 'avk', 'lij', 'li', 'gv',
        'mi', 'mt', 'nah', 'ne', 'nrm', 'se', 'nov', 'qu', 'os', 'pag', 'ps', 'pdc', 'rm', 'bat-smg', 'sc', 'tt', 'tk',
        'hsb', 'fiu-vro', 'vls', 'yo', 'diq', 'zh-classical', 'frp', 'lad', 'kw', 'mn', 'haw', 'ang', 'ln', 'ie', 'wo',
        'tpi', 'ty', 'crh', 'nv', 'jbo', 'ay', 'pcd', 'zea', 'eml', 'ky', 'ig', 'or', 'cbk-zam', 'kg', 'arc', 'rmy',
        'ab', 'gn', 'so', 'kab', 'ug', 'stq', 'udm', 'ext', 'mzn', 'pap', 'cu', 'sah', 'tet', 'sn', 'lo', 'pnb', 'iu',
        'na', 'got', 'bo', 'dsb', 'chr', 'cdo', 'om', 'ee', 'av', 'bm', 'zu', 'pnt', 'cr', 'pih', 'ss', 'bi', 'rw',
        'ch', 'xh', 'kl', 'ik', 'bug', 'dz', 'kv', 'xal', 'st', 'tw', 'bxr', 'ak', 'ny', 'fj', 'lbe', 'za', 'ks', 'ff',
        'lg', 'rn', 'mwl', 'lez', 'bjn', 'gom', 'tyv', 'vep', 'nso', 'kbd', 'ltg', 'rue', 'gag', 'koi', 'krc', 'ace',
        'olo', 'kaa', 'mdf', 'myv', 'ady', 'jam', 'tcy', 'dty', 'kbp', 'din', 'lfn', 'gor', 'inh', 'sat', 'hyw', 'nqo',
        'ban', 'szy', 'ary', 'lld', 'smn', 'skr', 'mad', 'dag', 'shi', 'nia', 'pi', 'to', 'sm', 'ti', 've', 'ts', 'tn',
        'tum', 'ki', 'sg', 'chy', 'pfl', 'srn', 'atj', 'gcr', 'awa', 'nostalgia',
    ];

    constructor(context: PieceContext) {
        super(context, {
            description: 'I can look up an article on Wikipedia and write the beginning here if you want.',
            arguments: [
                {
                    name: 'language',
                    description: 'Wikipedia language code (the subdomain for the language)',
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
            }, {
                name: 'ArgumentFormat',
                context: { formats: [{
                    name: 'language',
                    validate: value => WikiCommand.wikipediaLanguages.includes(value),
                    errorMessage: 'This is not a valid Wikipedia language code',
                }] },
            }],
        });
    }

    async run(interaction: CommandInteraction): Promise<void> {
        const languagePrefix = interaction.options.getString('language');
        const search = interaction.options.getString('search', true);
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
            content: `Result for : **${search}** (${languagePrefix})`,
            embeds: [embed],
        });
    }
}
