import Logger from '@lilywonhalf/pretty-logger';
import type { Guild } from 'discord.js';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';
import type { Snowflake, APIApplicationCommandOption } from 'discord-api-types/v10';
import type { SapphireClient } from '@sapphire/framework';
import type { SlashCommand } from '#framework/lib/structures/SlashCommand';
import type SlashCommandStore from '#framework/lib/structures/SlashCommandStore';

export interface APIGuildApplicationCommand {
    id: Snowflake;
    application_id: Snowflake;
    name: string;
    description: string;
    version?: string;
    default_permission?: boolean;
    type?: number;
    guild_id: Snowflake;
    options?: APIApplicationCommandOption[];
}

interface APIApplicationCommand {
    application_id: Snowflake;
    guild_id?: Snowflake;
    name: string;
    description: string;
    options?: APIApplicationCommandOption[];
    default_permission?: boolean;
}

export class SlashCommandRegistrar {
    private static instance: SlashCommandRegistrar;

    private rest!: REST;
    private client!: SapphireClient;
    private slashCommandStore!: SlashCommandStore;
    private globalSlashCommandData!: APIApplicationCommand[];
    private guildSlashCommandData!: APIApplicationCommand[];

    public constructor() {
        if (SlashCommandRegistrar.instance) {
            return SlashCommandRegistrar.instance;
        }

        this.rest = new REST({ version: '10' }).setToken(process.env.TOKEN as string);

        SlashCommandRegistrar.instance = this;
    }

    public initializeData(client: SapphireClient): void {
        Logger.info('Initializing slash commands data...');

        this.slashCommandStore = client.stores.get('slash-commands');
        const globalCommands = this.slashCommandStore.filter(command => !command.guildCommand);
        const guildCommands = this.slashCommandStore.filter(command => command.guildCommand);

        this.client = client;
        this.globalSlashCommandData = globalCommands.map(this.slashCommandToSlashCommandData.bind(this));
        this.guildSlashCommandData = guildCommands.map(this.slashCommandToSlashCommandData.bind(this));

        Logger.info(`Global slash commands: ${this.globalSlashCommandData.map(command => command.name)}`);
        Logger.info(`Guild slash commands: ${this.guildSlashCommandData.map(command => command.name)}`);
        Logger.info('Slash commands data initialized');
    }

    public async testGuildRegister(): Promise<void> {
        const testGuild = this.client.guilds.cache.get(process.env.TEST_GUILD_ID as string)!;
        const slashCommandData = this.globalSlashCommandData.map(data => {
            return { ...data, guild_id: testGuild.id };
        }).concat(this.guildSlashCommandData.map(data => {
            return { ...data, guild_id: testGuild.id };
        }));

        await testGuild.commands.fetch();

        Logger.info('Started refreshing application slash commands for test guild.');

        await this.rest.put(
            Routes.applicationGuildCommands(this.client.id!, testGuild.id),
            { body: slashCommandData }
        ) as APIGuildApplicationCommand[];

        Logger.info('Successfully reloaded application slash commands for test guild.');
    }

    public async guildsRegister(): Promise<void> {
        Logger.info('Started refreshing application slash commands for production guilds.');

        await Promise.all(this.client.guilds.cache.filter(guild => guild.id !== process.env.TEST_GUILD_ID).map(
            this.guildRegister.bind(this)
        ));

        Logger.info('Successfully reloaded application slash commands for production guilds.');
    }

    public async globalRegister(): Promise<void> {
        Logger.info('Started refreshing application slash commands for global scope.');

        await this.rest.put(
            Routes.applicationCommands(this.client.id!),
            { body: this.globalSlashCommandData }
        );

        Logger.info('Successfully reloaded application slash commands for global scope.');
    }

    private async guildRegister(guild: Guild): Promise<void> {
        await guild.commands.fetch();

        await this.rest.put(
            Routes.applicationGuildCommands(this.client.id!, guild.id),
            { body: this.guildSlashCommandData }
        ) as APIGuildApplicationCommand[];
    }

    private slashCommandToSlashCommandData(slashCommand: SlashCommand): APIApplicationCommand {
        return {
            application_id: this.client.application!.id,
            guild_id: undefined,
            name: slashCommand.name,
            description: slashCommand.description,
            options: slashCommand.arguments as unknown as APIApplicationCommandOption[],
            default_permission: slashCommand.defaultPermission,
        };
    }
}
