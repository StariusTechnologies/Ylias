import Logger from '@lilywonhalf/pretty-logger';
import { Guild } from 'discord.js';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { Snowflake } from 'discord-api-types/globals';
import { APIApplicationCommandOption } from 'discord-api-types/payloads/v8/_interactions/slashCommands';
import { SapphireClient } from '@sapphire/framework';
import { SlashCommand } from './framework/lib/structures/SlashCommand';
import SlashCommandStore from './framework/lib/structures/SlashCommandStore';

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

const ApplicationCommandOptionTypeMap: { [key: string]: number } = {
    SUBCOMMAND: 1,
    SUBCOMMANDGROUP: 2,
    STRING: 3,
    INTEGER: 4,
    BOOLEAN: 5,
    USER: 6,
    CHANNEL: 7,
    ROLE: 8,
    MENTIONABLE: 9,
    NUMBER: 10,
}

export class SlashCommandRegistrar {
    private static instance: SlashCommandRegistrar;

    private rest: REST;
    private client: SapphireClient;
    private slashCommandStore: SlashCommandStore;
    private globalSlashCommandData: APIApplicationCommand[];
    private guildSlashCommandData: APIApplicationCommand[];

    public constructor() {
        if (SlashCommandRegistrar.instance) {
            return SlashCommandRegistrar.instance;
        }

        this.rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

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
        const testGuild = this.client.guilds.cache.get(process.env.TEST_GUILD_ID);
        const slashCommandData = this.globalSlashCommandData.map(data => {
            return { ...data, guild_id: testGuild.id };
        }).concat(this.guildSlashCommandData.map(data => {
            return { ...data, guild_id: testGuild.id };
        }));

        await testGuild.commands.fetch();

        Logger.info('Started refreshing application slash commands for test guild.');

        const resultCommands = await this.rest.put(
            Routes.applicationGuildCommands(this.client.id, testGuild.id),
            { body: slashCommandData }
        ) as APIGuildApplicationCommand[];

        const commandsWithPermissions = resultCommands.flat().filter((command: APIGuildApplicationCommand) => {
            return this.slashCommandStore.get(command.name).permissions?.length > 0;
        });

        const fullPermissions = commandsWithPermissions.map((command: APIGuildApplicationCommand) => {
            return {
                id: command.id,
                permissions: this.slashCommandStore.get(command.name).permissions,
            };
        });

        await testGuild.commands.permissions.set({ fullPermissions });

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
            Routes.applicationCommands(this.client.id),
            { body: this.globalSlashCommandData }
        );

        Logger.info('Successfully reloaded application slash commands for global scope.');
    }

    private async guildRegister(guild: Guild): Promise<void> {
        await guild.commands.fetch();

        const commandsResult = await this.rest.put(
            Routes.applicationGuildCommands(this.client.id, guild.id),
            { body: this.guildSlashCommandData }
        ) as APIGuildApplicationCommand[];

        const commandsWithPermissions = commandsResult.filter((command: APIGuildApplicationCommand) => {
            return this.slashCommandStore.get(command.name).permissions?.length > 0;
        });

        const fullPermissions = commandsWithPermissions.map((command: APIGuildApplicationCommand) => {
            return {
                id: command.id,
                permissions: this.slashCommandStore.get(command.name).permissions,
            };
        });

        await guild.commands.permissions.set({ fullPermissions });
    }

    private slashCommandToSlashCommandData(slashCommand: SlashCommand): APIApplicationCommand {
        return {
            application_id: this.client.application.id,
            guild_id: null,
            name: slashCommand.name,
            description: slashCommand.description,
            options: slashCommand.arguments.map(argument => {
                return {
                    ...argument,
                    type: ApplicationCommandOptionTypeMap[argument.type.toString()],
                }
            }),
            default_permission: slashCommand.defaultPermission,
        };
    }
}
