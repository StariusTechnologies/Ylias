import { join } from 'path';
import { Client, Intents } from 'discord.js';
import {
    ArgumentStore,
    CommandStore,
    ListenerStore,
    PreconditionStore,
    SapphireClient
} from '@sapphire/framework';
import { config as configureEnvironment } from 'dotenv';
import Logger from '@lilywonhalf/pretty-logger';
import SlashCommandStore from './framework/lib/structures/SlashCommandStore';
import { SlashCommandPreconditionStore } from './framework/lib/structures/SlashCommandPreconditionStore';

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

export class Bootstrap {
    private static instance: Bootstrap;

    private intents: number[];
    private _client: SapphireClient;

    public constructor() {
        if (Bootstrap.instance) {
            return Bootstrap.instance;
        }

        configureEnvironment();
        this.intents = [];

        Bootstrap.instance = this;
    }

    public initializeIntents(): void {
        this.intents = [
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
    }

    public initializeClient(): void {
        this._client = new SapphireClient({
            intents: this.intents,
            defaultPrefix: '.',
        });

        this._client.stores.registerPath(join(__dirname, 'framework', 'errorListeners'));
        this._client.stores.register(new SlashCommandStore());
        this._client.stores.register(new SlashCommandPreconditionStore());
    }

    public async login(): Promise<Client> {
        return new Promise((resolve, reject) => {
            this._client.once('ready', resolve);
            this._client.login(process.env.TOKEN).catch(reject);
        });
    }

    public get client(): SapphireClient {
        return this._client;
    }
}
