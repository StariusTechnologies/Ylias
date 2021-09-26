import { SlashCommandRegistrar } from '#lib/SlashCommandRegistrar';

const slashCommandRegistrar = new SlashCommandRegistrar();

describe('Testing the InteractionManager class', () => {
    test('Is correctly formed', () => {
        expect(typeof SlashCommandRegistrar).toBe('function');
        expect(typeof slashCommandRegistrar.initializeData).toBe('function');
        expect(typeof slashCommandRegistrar.testGuildRegister).toBe('function');
        expect(typeof slashCommandRegistrar.guildsRegister).toBe('function');
        expect(typeof slashCommandRegistrar.globalRegister).toBe('function');
    });
});
