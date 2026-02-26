import { Client, Events, GatewayIntentBits } from 'discord.js';
import {
    SapphireClient
} from '@sapphire/framework';
import { config as configureEnvironment } from 'dotenv';

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
            GatewayIntentBits.GuildIntegrations,
            GatewayIntentBits.GuildWebhooks,
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
    }

    public async login(): Promise<Client> {
        return new Promise((resolve, reject) => {
            this.client.once(Events.ClientReady, resolve);
            this.client.login(process.env.TOKEN).catch(reject);
        });
    }
}
