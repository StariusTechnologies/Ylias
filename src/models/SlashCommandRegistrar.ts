import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { SlashCommand } from './framework/lib/structures/SlashCommand';
import { SapphireClient } from '@sapphire/framework';
import { APIApplicationCommandOption } from 'discord-api-types/payloads/v8/_interactions/slashCommands';

interface APIApplicationCommand {
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
    private slashCommandData: APIApplicationCommand[];

    public constructor() {
        if (SlashCommandRegistrar.instance) {
            return SlashCommandRegistrar.instance;
        }

        this.rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

        SlashCommandRegistrar.instance = this;
    }

    public initializeData(client: SapphireClient): void {
        const slashCommandStore = client.stores.get('slash-commands');

        this.client = client;
        this.slashCommandData = slashCommandStore.array().map((slashCommand: SlashCommand) => {
            return {
                name: slashCommand.name,
                description: slashCommand.description,
                options: slashCommand.arguments.map(argument => {
                    return {
                        ...argument,
                        type: ApplicationCommandOptionTypeMap[argument.type.toString()],
                    }
                }),
            };
        });
    }

    public testGuildRegister(): Promise<unknown> {
        return this.rest.put(
            Routes.applicationGuildCommands(this.client.id, process.env.TEST_GUILD_ID),
            { body: this.slashCommandData }
        );
    }

    public globalRegister(): Promise<unknown> {
        return this.rest.put(
            Routes.applicationCommands(this.client.id),
            { body: this.slashCommandData }
        );
    }
}
