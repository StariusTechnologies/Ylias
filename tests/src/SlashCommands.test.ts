import path from 'path';
import fs from 'fs';
import { getPieceContext } from '#mocks/MockInstances';

const commandsPath = path.join(__dirname, '..', '..', 'src', 'commands');
const commandFiles = fs.readdirSync(commandsPath)
    .filter(filename => filename.endsWith('.ts'))
    .map(filename => filename.substr(0, filename.length - 3));

for (const commandFile of commandFiles) {
    describe(`Testing the ${commandFile} command`, () => {
        it('Is correctly formed', () => {
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            const { default: CommandClass } = require(
                path.join(commandsPath, commandFile)
            );
            const commandObject = new CommandClass(
                getPieceContext(`commands/${commandFile}.ts`),
                { name: commandFile.toLowerCase() }
            );

            expect(typeof commandObject.constructor).toBe('function');
            expect(typeof commandObject.chatInputRun).toBe('function');
        });
    });
}
