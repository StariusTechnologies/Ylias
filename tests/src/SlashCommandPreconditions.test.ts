import path from 'path';
import fs from 'fs';
import { getPieceContext } from '#mocks/MockInstances';

const preconditionsPath = path.join(__dirname, '..', '..', 'src', 'preconditions');
const preconditionFiles = fs.readdirSync(preconditionsPath)
    .filter(filename => filename.endsWith('.ts'))
    .map(filename => filename.substr(0, filename.length - 3));

for (const preconditionFile of preconditionFiles) {
    describe(`Testing the ${preconditionFile} precondition`, () => {
        it('Is correctly formed', () => {
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            const preconditionModuleExports = require(
                path.join(preconditionsPath, preconditionFile)
            );
            const preconditionClassKey = Object.keys(preconditionModuleExports).find(
                key => key.toLowerCase().includes('precondition')
            );

            expect(preconditionClassKey).not.toBeUndefined();

            const PreconditionClass = preconditionModuleExports[preconditionClassKey!];
            const preconditionObject = new PreconditionClass(
                getPieceContext(`preconditions/${preconditionFile}.ts`)
            );

            expect(typeof preconditionObject.constructor).toBe('function');
            expect(typeof preconditionObject.chatInputRun).toBe('function');
        });
    });
}
