import Logger from '@lilywonhalf/pretty-logger';
import { Bootstrap } from './models/Bootstrap';
import { SlashCommandRegistrar } from './models/SlashCommandRegistrar';

const needGlobalRegister = process.argv.some(arg => arg.toLowerCase() === 'global');
const bootstrap = new Bootstrap();
const slashCommandRegistrar = new SlashCommandRegistrar();

bootstrap.initializeClient();

(async () => {
    try {
        await bootstrap.login();

        const { client } = bootstrap;

        slashCommandRegistrar.initializeData(client);

        Logger.info('Started refreshing application slash commands for test guild.');
        await slashCommandRegistrar.testGuildRegister();
        Logger.info('Successfully reloaded application slash commands for test guild.');

        if (needGlobalRegister) {
            Logger.info('Started refreshing application slash commands for global scope.');
            await slashCommandRegistrar.globalRegister();
            Logger.info('Successfully reloaded application slash commands for global scope.');
        }

        process.exit();
    } catch (error) {
        Logger.error(error);
        process.exit(1);
    }
})();
