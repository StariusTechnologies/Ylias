import { join } from 'path';
import { Intents } from 'discord.js';
import {
    ArgumentStore,
    CommandStore,
    ListenerStore,
    PreconditionStore,
    SapphireClient
} from '@sapphire/framework';
import { config as configureEnvironment } from 'dotenv';
import Logger from '@lilywonhalf/pretty-logger';
import SlashCommandStore from './models/framework/lib/structures/SlashCommandStore';
import { SlashCommandPreconditionStore } from './models/framework/lib/structures/SlashCommandPreconditionStore';

configureEnvironment();

declare module '@sapphire/pieces' {
    interface StoreRegistryEntries {
        arguments: ArgumentStore;
        commands: CommandStore;
        'slash-commands': SlashCommandStore;
        listeners: ListenerStore;
        preconditions: PreconditionStore;
        'slash-command-preconditions': SlashCommandPreconditionStore;
    }
}

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

client.stores.registerPath(join(__dirname, 'models', 'framework', 'errorListeners'));
client.stores.register(new SlashCommandStore());
client.stores.register(new SlashCommandPreconditionStore());

client.login(process.env.TOKEN).catch(Logger.exception);
