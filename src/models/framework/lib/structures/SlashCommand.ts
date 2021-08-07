import { AliasPiece, AliasPieceOptions, PieceContext } from '@sapphire/pieces';
import { Awaited, isNullish } from '@sapphire/utilities';
import { Interaction, PermissionResolvable, Permissions, CommandInteractionOptionResolver } from 'discord.js';
import {
    CommandOptionsRunType,
    CommandPreConditions,
    BucketScope
} from '@sapphire/framework';
import {
    SlashCommandPreconditionContainerArray,
    SlashCommandPreconditionEntryResolvable
} from '../utils/SlashCommandPreconditionContainerArray';

export abstract class SlashCommand<T = CommandInteractionOptionResolver> extends AliasPiece {
    public description: string;

    public preconditions: SlashCommandPreconditionContainerArray;

    public detailedDescription: string;

    protected constructor(context: PieceContext, options: SlashCommandOptions = {}) {
        super(context, { ...options, name: (options.name ?? context.name).toLowerCase() });
        this.description = options.description ?? '';
        this.detailedDescription = options.detailedDescription ?? '';

        if (options.generateDashLessAliases) {
            const names = [this.name, ...this.aliases];
            const dashLessAliases = [];

            for (const name of names) {
                if (name.includes('-')) {
                    dashLessAliases.push(name.replace(/-/gu, ''));
                }
            }

            this.aliases = [...this.aliases, ...dashLessAliases];
        }

        this.preconditions = new SlashCommandPreconditionContainerArray(options.preconditions);
        this.parseConstructorPreConditions(options);
    }

    public abstract run(interaction: Interaction, args: T, context: SlashCommandContext): Awaited<unknown>;

    public toJSON(): Record<string, any> {
        return {
            ...super.toJSON(),
            description: this.description,
            detailedDescription: this.detailedDescription,
        };
    }

    protected parseConstructorPreConditions(options: SlashCommandOptions): void {
        this.parseConstructorPreConditionsRunIn(options);
        this.parseConstructorPreConditionsNsfw(options);
        this.parseConstructorPreConditionsRequiredClientPermissions(options);
        this.parseConstructorPreConditionsCooldown(options);
    }

    protected parseConstructorPreConditionsNsfw(options: SlashCommandOptions): void {
        if (options.nsfw) {
            this.preconditions.append(CommandPreConditions.NotSafeForWork);
        }
    }

    protected parseConstructorPreConditionsRunIn(options: SlashCommandOptions): void {
        const runIn = this.resolveConstructorPreConditionsRunType(options.runIn);

        if (runIn !== null) {
            this.preconditions.append(runIn as any);
        }
    }

    protected parseConstructorPreConditionsRequiredClientPermissions(options: SlashCommandOptions): void {
        const permissions = new Permissions(options.requiredClientPermissions);

        if (permissions.bitfield !== 0n) {
            this.preconditions.append({ name: CommandPreConditions.Permissions, context: { permissions } });
        }
    }

    protected parseConstructorPreConditionsCooldown(options: SlashCommandOptions): void {
        const limit = options.cooldownLimit ?? 1;
        const delay = options.cooldownDelay ?? 0;

        if (limit && delay) {
            this.preconditions.append({
                name: CommandPreConditions.Cooldown,
                context: { scope: options.cooldownScope ?? BucketScope.User, limit, delay },
            });
        }
    }

    private resolveConstructorPreConditionsRunType(
        runIn: SlashCommandOptions['runIn']
    ): SlashCommandPreconditionContainerArray | CommandPreConditions | null {
        if (isNullish(runIn)) {
            return null;
        }

        if (typeof runIn === 'string') {
            switch (runIn) {
                case 'DM':
                    return CommandPreConditions.DirectMessageOnly;

                case 'GUILD_TEXT':
                    return CommandPreConditions.GuildTextOnly;

                case 'GUILD_NEWS':
                    return CommandPreConditions.GuildNewsOnly;

                case 'GUILD_NEWS_THREAD':
                    return CommandPreConditions.GuildNewsThreadOnly;

                case 'GUILD_PUBLIC_THREAD':
                    return CommandPreConditions.GuildPublicThreadOnly;

                case 'GUILD_PRIVATE_THREAD':
                    return CommandPreConditions.GuildPrivateThreadOnly;

                case 'GUILD_ANY':
                    return CommandPreConditions.GuildOnly;

                default:
                    return null;
            }
        }

        // If there's no channel it can run on, throw an error:
        if (runIn.length === 0) {
            throw new Error(`${this.constructor.name}[${this.name}]: "runIn" was specified as an empty array.`);
        }

        if (runIn.length === 1) {
            return this.resolveConstructorPreConditionsRunType(runIn[0]);
        }

        const keys = new Set(runIn);

        const dm = keys.has('DM');
        const guildText = keys.has('GUILD_TEXT');
        const guildNews = keys.has('GUILD_NEWS');
        const guild = guildText && guildNews;

        // If runs everywhere, optimise to null:
        if (dm && guild) {
            return null;
        }

        const guildPublicThread = keys.has('GUILD_PUBLIC_THREAD');
        const guildPrivateThread = keys.has('GUILD_PRIVATE_THREAD');
        const guildNewsThread = keys.has('GUILD_NEWS_THREAD');
        const guildThreads = guildPublicThread && guildPrivateThread && guildNewsThread;

        // If runs in any thread, optimise to thread-only:
        if (guildThreads && keys.size === 3) {
            return CommandPreConditions.GuildThreadOnly;
        }

        const preconditions = new SlashCommandPreconditionContainerArray();

        if (dm) {
            preconditions.append(CommandPreConditions.DirectMessageOnly);
        }

        if (guild) {
            preconditions.append(CommandPreConditions.GuildOnly);
        } else {
            // GuildText includes PublicThread and PrivateThread
            if (guildText) {
                preconditions.append(CommandPreConditions.GuildTextOnly);
            } else {
                if (guildPublicThread) {
                    preconditions.append(CommandPreConditions.GuildPublicThreadOnly);
                }

                if (guildPrivateThread) {
                    preconditions.append(CommandPreConditions.GuildPrivateThreadOnly);
                }
            }

            // GuildNews includes NewsThread
            if (guildNews) {
                preconditions.append(CommandPreConditions.GuildNewsOnly);
            } else if (guildNewsThread) {
                preconditions.append(CommandPreConditions.GuildNewsThreadOnly);
            }
        }

        return preconditions;
    }
}

export interface SlashCommandOptions extends AliasPieceOptions {
    generateDashLessAliases?: boolean;

    description?: string;

    detailedDescription?: string;

    preconditions?: readonly SlashCommandPreconditionEntryResolvable[];

    nsfw?: boolean;

    cooldownLimit?: number;

    cooldownDelay?: number;

    cooldownScope?: BucketScope;

    requiredClientPermissions?: PermissionResolvable;

    runIn?: CommandOptionsRunType | readonly CommandOptionsRunType[] | null;
}

export interface SlashCommandContext extends Record<PropertyKey, unknown> {
    commandName: string;
}
