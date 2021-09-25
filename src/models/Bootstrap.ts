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

type BootstrapOptions = {
    dotEnvPath?: string;
};

export class Bootstrap {
    private static instance: Bootstrap;

    public client!: SapphireClient;
    private intents: number[] = [];

    public constructor({ dotEnvPath }: BootstrapOptions = {}) {
        if (Bootstrap.instance) {
            return Bootstrap.instance;
        }

        if (dotEnvPath) {
            configureEnvironment({ path: dotEnvPath });
        } else {
            configureEnvironment();
        }

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
        this.client = new SapphireClient({
            intents: this.intents,
        });

        this.client.stores.registerPath(join(__dirname, 'framework', 'errorListeners'));
        this.client.stores.register(new SlashCommandStore());
        this.client.stores.register(new SlashCommandPreconditionStore());
    }

    public async login(): Promise<Client> {
        return new Promise((resolve, reject) => {
            this.client.once('ready', resolve);
            this.client.login(process.env.TOKEN).catch(reject);
        });
    }
}
