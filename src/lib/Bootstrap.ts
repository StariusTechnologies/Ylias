import { join } from 'path';
import { Client, GatewayIntentBits } from 'discord.js';
import {
    SapphireClient
} from '@sapphire/framework';
import { config as configureEnvironment } from 'dotenv';
import SlashCommandStore from '#framework/lib/structures/SlashCommandStore';
import { SlashCommandPreconditionStore } from '#framework/lib/structures/SlashCommandPreconditionStore';

declare module '@sapphire/pieces' {
    interface StoreRegistryEntries {
        'slash-commands': SlashCommandStore;
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
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.GuildModeration,
            GatewayIntentBits.GuildEmojisAndStickers,
            GatewayIntentBits.GuildIntegrations, // TODO check if necessary
            GatewayIntentBits.GuildWebhooks, // TODO check if necessary
            GatewayIntentBits.GuildInvites,
            GatewayIntentBits.GuildVoiceStates,
            GatewayIntentBits.GuildPresences,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.GuildMessageReactions,
            GatewayIntentBits.DirectMessages,
            GatewayIntentBits.DirectMessageReactions,
            GatewayIntentBits.MessageContent,
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
