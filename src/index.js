import { SapphireClient } from '@sapphire/framework';
import dotenv from 'dotenv';
import Logger from '@lilywonhalf/pretty-logger';

dotenv.config();
const client = new SapphireClient({
    intents: ['GUILDS', 'GUILD_MESSAGES'],
    defaultPrefix: '.',
});

client.login(process.env.TOKEN).catch(Logger.exception);
