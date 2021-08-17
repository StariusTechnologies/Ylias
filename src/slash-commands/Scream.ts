import type { CommandInteraction } from 'discord.js';
import type { PieceContext } from '@sapphire/pieces';
import { SlashCommand } from '../models/framework/lib/structures/SlashCommand';
import { Emotion, Emotions } from '../models/Emotion';

interface ScreamData {
    scream: string,
    renderedScream: string,
    multipliedLetter: string,
    emoji: string
}

export default class PingCommand extends SlashCommand {
    private screamList: ScreamData[] = [
        { scream: 'awoo', renderedScream: 'AWOO%%', multipliedLetter: 'O', emoji: ':full_moon:' },
        { scream: 'ahou', renderedScream: 'AHO%%U', multipliedLetter: 'O', emoji: ':full_moon:' },
        { scream: 'bark', renderedScream: 'RRR%% BARK', multipliedLetter: 'R', emoji: ':dog:' },
        { scream: 'ouaf', renderedScream: 'GRR%% OUAF', multipliedLetter: 'R', emoji: ':dog:' },
        { scream: 'meow', renderedScream: 'ME%%OW', multipliedLetter: 'E', emoji: ':cat:' },
        { scream: 'miaou', renderedScream: 'MIA%%OU', multipliedLetter: 'A', emoji: ':cat:' },
        { scream: 'miou', renderedScream: 'MIO%%U', multipliedLetter: 'O', emoji: ':cat:' },
        { scream: 'squee', renderedScream: 'SQUEE%%', multipliedLetter: 'E', emoji: '' },
        { scream: 'grawr', renderedScream: 'GRA%%WR', multipliedLetter: 'A', emoji: '' },
        { scream: 'rawr', renderedScream: 'RA%%WR', multipliedLetter: 'A', emoji: '' },
        { scream: 'grou', renderedScream: 'GRO%%U', multipliedLetter: 'O', emoji: ':smiley_cat:' },
        { scream: 'ui', renderedScream: 'UI%%', multipliedLetter: 'I', emoji: ':ok_hand:' },
        { scream: 'spaghetti', renderedScream: 'SPAGHETTI%%', multipliedLetter: 'I', emoji: ':spaghetti:' },
    ];

    constructor(context: PieceContext) {
        super(context, {
            description: 'You can make me scream something!',
            arguments: [{
                name: 'scream',
                description: 'Write something you want me to scream.',
                type: 'STRING',
                required: true,
            }],
        });
    }

    public async run(interaction: CommandInteraction): Promise<void> {
        const scream = interaction.options.getString('scream', true);
        let renderedScream;
        let multipliedLetter;
        let emoji = '';
        let emotion = Emotions.NEUTRAL;

        for (const screamData of this.screamList) {
            const regexp = new RegExp(`^${screamData.scream}$`, 'u');

            if (regexp.test(scream)) {
                ({ renderedScream, multipliedLetter, emoji } = screamData);
                break;
            }
        }

        if (!renderedScream) {
            emotion = Emotions.SURPRISE;
            ({ renderedScream, multipliedLetter } = this.parseUnlistedScream(scream));
        }

        multipliedLetter += Array(Math.floor(Math.random() * 42)).fill(multipliedLetter).join('');
        renderedScream = renderedScream.replace(/%%/gu, multipliedLetter as string);

        const embed = Emotion.getEmotionEmbed(emotion)
            .setTitle('Scream')
            .setDescription(`${emoji} ${renderedScream}`);

        await interaction.reply({ embeds: [embed] });
    }

    private parseUnlistedScream(scream: string): { renderedScream: string, multipliedLetter: string } {
        const vowelRegexp = /([aeiouy])/igu;
        let renderedScream;
        let multipliedLetter;

        if (scream.length === 1) {
            return {
                renderedScream: `${scream.toUpperCase()}%%`,
                multipliedLetter: scream.toLowerCase(),
            }
        }

        if (vowelRegexp.test(scream)) {
            let vowel;
            let vowelPosition = 0;
            let regexpResult;
            const doubleVowelRegexp = /([aeiouy])\1/igu;

            if (scream.match(doubleVowelRegexp)) {
                do {
                    if (regexpResult) {
                        [, vowel] = regexpResult;
                        vowelPosition = regexpResult.index;
                    }

                    regexpResult = doubleVowelRegexp.exec(scream);
                } while (regexpResult);
            } else {
                const consonantRegexp = /([^aeiouy])/igu;
                const lastCharacterIsE = scream.slice(-1) === 'e';
                const penultimateCharacterIsConsonant = consonantRegexp.test(scream.slice(-2, 1));
                const shouldRemoveLastCharacter = lastCharacterIsE
                    && penultimateCharacterIsConsonant
                    && vowelRegexp.test(scream.slice(-1));
                const searchableScream = shouldRemoveLastCharacter ? scream.slice(-1) : scream;

                do {
                    if (regexpResult) {
                        [, vowel] = regexpResult;
                        vowelPosition = regexpResult.index;
                    }

                    regexpResult = vowelRegexp.exec(searchableScream);
                } while (regexpResult);
            }

            renderedScream = `${scream.slice(0, vowelPosition + 1)}%%${scream.slice(vowelPosition + 1)}`;
            multipliedLetter = vowel;
        } else {
            multipliedLetter = scream.slice(Math.floor(Math.random() * (scream.length - 1)), 1);
            const lastIndex = scream.lastIndexOf(multipliedLetter);

            renderedScream = `${scream.slice(0, lastIndex + 1)}%%${scream.slice(lastIndex + 1)}`;
        }

        renderedScream = renderedScream.toUpperCase();
        multipliedLetter = multipliedLetter!.toUpperCase();

        return { renderedScream, multipliedLetter };
    }
}
