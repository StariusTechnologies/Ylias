import Logger from '@lilywonhalf/pretty-logger';
import { Bootstrap } from './models/Bootstrap';
import { SlashCommandRegistrar } from './models/SlashCommandRegistrar';

const productionMode = process.argv.some(arg => arg.toLowerCase().includes('prod'));
const bootstrap = new Bootstrap();
const slashCommandRegistrar = new SlashCommandRegistrar();

bootstrap.initializeClient();

(async () => {
    try {
        await bootstrap.login();

        const { client } = bootstrap;

        Logger.info('-----------------------------');
        slashCommandRegistrar.initializeData(client);

        Logger.info('-----------------------------');
        await slashCommandRegistrar.testGuildRegister();

        if (productionMode) {
            Logger.info('-----------------------------');
            await slashCommandRegistrar.guildsRegister();

            Logger.info('-----------------------------');
            await slashCommandRegistrar.globalRegister();
        }

        process.exit();
    } catch (error) {
        Logger.error(error);
        process.exit(1);
    }
})();
