import Logger from '@lilywonhalf/pretty-logger';
import { Client, Events } from 'discord.js';
import { Listener } from '@sapphire/framework';

export default class Ready extends Listener<typeof Events.ClientReady> {
    constructor(context: Listener.LoaderContext) {
        super(context, {
            event: Events.ClientReady,
        });
    }

    public run(client: Client): void {
        const nbGuilds = client.guilds.cache.size;

        Logger.info(`Logged in as ${client.user!.username}#${client.user!.discriminator}`);
        Logger.info(`Serving in ${nbGuilds} guild${nbGuilds > 1 ? 's' : ''}`);
    }
}
