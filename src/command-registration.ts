import Logger from '@lilywonhalf/pretty-logger';
import { Bootstrap } from '#lib/Bootstrap';
import { SlashCommandRegistrar } from '#lib/SlashCommandRegistrar';
import path from 'path';

const productionMode = process.argv.some(arg => arg.toLowerCase().includes('prod'));
const dotEnvPath = path.join(__dirname, '..', `${productionMode ? 'prod' : ''}.env`);
const bootstrap = new Bootstrap({ dotEnvPath });
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
    } catch (error: any) {
        Logger.error(error);
        process.exit(1);
    }
})();
