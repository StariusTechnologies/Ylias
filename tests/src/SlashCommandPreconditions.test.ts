import path from 'path';
import fs from 'fs';
import { getPieceContext } from '#mocks/MockInstances';

const slashCommandPreconditionsPath = path.join(__dirname, '..', '..', 'src', 'slash-command-preconditions');
const slashCommandPreconditionFiles = fs.readdirSync(slashCommandPreconditionsPath)
    .filter(filename => filename.endsWith('.ts'))
    .map(filename => filename.substr(0, filename.length - 3));

for (const slashCommandPreconditionFile of slashCommandPreconditionFiles) {
    describe(`Testing the ${slashCommandPreconditionFile} slash command precondition`, () => {
        it('Is correctly formed', async () => {
            const preconditionModuleExports = await import(
                path.join(slashCommandPreconditionsPath, slashCommandPreconditionFile)
            );
            const preconditionClassKey = Object.keys(preconditionModuleExports).find(
                key => key.toLowerCase().includes('precondition')
            );

            expect(preconditionClassKey).not.toBeUndefined();

            const PreconditionClass = preconditionModuleExports[preconditionClassKey!];
            const preconditionObject = new PreconditionClass(
                getPieceContext(`slash-command-preconditions/${slashCommandPreconditionFile}.ts`)
            );

            expect(typeof preconditionObject.constructor).toBe('function');
            expect(typeof preconditionObject.run).toBe('function');
        });
    });
}
