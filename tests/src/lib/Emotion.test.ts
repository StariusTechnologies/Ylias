import { Emotion, Emotions } from '#lib/Emotion';
import { EmbedBuilder } from 'discord.js';

describe('Testing the Emotion class', () => {
    test('Is correctly formed', () => {
        expect(typeof Emotion).toBe('function');
        expect(typeof Emotions).toBe('object');
        expect(typeof Emotion.getEmotionEmbed).toBe('function');
        expect(typeof Emotion.addEmotionToEmbed).toBe('function');
    });

    test('Returns the correct values', () => {
        const emotionEmbed = Emotion.getEmotionEmbed(Emotions.WINK).setDescription('test');
        const addedEmotionEmbed = Emotion.addEmotionToEmbed(new EmbedBuilder().setDescription('test'), Emotions.WINK);

        expect(typeof emotionEmbed).toBe('object');
        expect(typeof addedEmotionEmbed).toBe('object');

        expect(emotionEmbed.data.description).toBe('test');
        expect(addedEmotionEmbed.data.description).toBe('test');
        expect(emotionEmbed.data.thumbnail?.url).toBe(Emotions.WINK);
        expect(addedEmotionEmbed.data.thumbnail?.url).toBe(Emotions.WINK);
    });
});
