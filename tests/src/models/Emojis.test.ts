import Emojis from '#root/models/Emojis';

describe('Testing the Emojis class', () => {
    test('Is correctly formed', () => {
        expect(typeof Emojis).toBe('object');
        expect(Object.keys(Emojis).every(key => typeof key === 'string')).toBe(true);
        expect(Object.values(Emojis).every(value => typeof value === 'string')).toBe(true);
        expect(Object.keys(Emojis).length).toBe(41);
    });
});
