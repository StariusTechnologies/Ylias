import path from 'path';
import fs from 'fs';
import { getPieceContext } from '#mocks/MockInstances';

const listenersPath = path.join(__dirname, '..', '..', 'src', 'listeners');
const listenerFiles = fs.readdirSync(listenersPath)
    .filter(filename => filename.endsWith('.ts'))
    .map(filename => filename.substr(0, filename.length - 3));

for (const listenerFile of listenerFiles) {
    describe(`Testing the ${listenerFile} event listener`, () => {
        it('Is correctly formed', () => {
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            const { default: ListenerClass } = require(
                path.join(listenersPath, listenerFile)
            );
            const listenerObject = new ListenerClass(
                getPieceContext(`listeners/${listenerFile}.ts`)
            );

            expect(typeof listenerObject.constructor).toBe('function');
            expect(typeof listenerObject.run).toBe('function');
        });
    });
}
