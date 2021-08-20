import path from 'path';
import fs from 'fs';
import { getPieceContext } from '#mocks/MockInstances';

const slashCommandsPath = path.join(__dirname, '..', '..', 'src', 'slash-commands');
const slashCommandFiles = fs.readdirSync(slashCommandsPath)
    .filter(filename => filename.endsWith('.ts'))
    .map(filename => filename.substr(0, filename.length - 3));

for (const slashCommandFile of slashCommandFiles) {
    describe(`Testing the ${slashCommandFile} slash command`, () => {
        it('Is correctly formed', async () => {
            const { default: SlashCommandClass } = await import(
                path.join(slashCommandsPath, slashCommandFile)
            );
            const slashCommandObject = new SlashCommandClass(
                getPieceContext(`slash-commands/${slashCommandFile}.ts`)
            );

            expect(typeof slashCommandObject.constructor).toBe('function');
            expect(typeof slashCommandObject.run).toBe('function');
        });
    });
}
