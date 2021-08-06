import { Intents } from 'discord.js';
import { SapphireClient } from '@sapphire/framework';
import { config as configureEnvironment } from 'dotenv';
import Logger from '@lilywonhalf/pretty-logger';
import SlashCommandStore from './models/SlashCommandStore';

configureEnvironment();

const intents = [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_BANS,
    Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
    Intents.FLAGS.GUILD_INTEGRATIONS, // TODO check if necessary
    Intents.FLAGS.GUILD_WEBHOOKS, // TODO check if necessary
    Intents.FLAGS.GUILD_INVITES,
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.GUILD_PRESENCES,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
];

const client = new SapphireClient({
    intents,
    defaultPrefix: '.',
});

client.stores.register(new SlashCommandStore());
client.login(process.env.TOKEN).catch(Logger.exception);
