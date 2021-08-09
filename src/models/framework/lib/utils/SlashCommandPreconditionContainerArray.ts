import { Collection, CommandInteraction } from 'discord.js';
import type { SlashCommand } from '../structures/SlashCommand';
import type {
    SlashCommandPreconditionContext,
    SlashCommandPreconditionKeys,
    SimpleSlashCommandPreconditionKeys
} from '../structures/SlashCommandPrecondition';
import type { ISlashCommandPreconditionCondition } from './conditions/ISlashCommandPreconditionCondition';
import { SlashCommandPreconditionConditionAnd } from './conditions/SlashCommandPreconditionConditionAnd';
import { SlashCommandPreconditionConditionOr } from './conditions/SlashCommandPreconditionConditionOr';
import type { ISlashCommandPreconditionContainer, SlashCommandPreconditionContainerReturn } from './ISlashCommandPreconditionContainer';
import {
    SlashCommandPreconditionContainerSingle,
    SlashCommandPreconditionSingleResolvable,
    SlashCommandPreconditionSingleResolvableDetails,
    SimpleSlashCommandPreconditionSingleResolvableDetails
} from './SlashCommandPreconditionContainerSingle';

export const enum SlashCommandPreconditionRunMode {
    Sequential,
    Parallel
}

export enum SlashCommandPreconditionRunCondition {
    And,
    Or
}

export interface SlashCommandPreconditionArrayResolvableDetails {
    entries: readonly SlashCommandPreconditionEntryResolvable[];
    mode: SlashCommandPreconditionRunMode;
}

export type SlashCommandPreconditionArrayResolvable = readonly SlashCommandPreconditionEntryResolvable[]
    | SlashCommandPreconditionArrayResolvableDetails;

export type SlashCommandPreconditionEntryResolvable = SlashCommandPreconditionSingleResolvable
    | SlashCommandPreconditionArrayResolvable;

function isSingle(entry: SlashCommandPreconditionEntryResolvable): entry is SlashCommandPreconditionSingleResolvable {
    return typeof entry === 'string' || Reflect.has(entry, 'name');
}

/**
 * An {@link ISlashCommandPreconditionContainer} that defines an array
 * of multiple {@link ISlashCommandPreconditionContainer}s.
 *
 * By default, array containers run either of two conditions:AND and OR ({@link SlashCommandPreconditionRunCondition}),
 * the top level will always default to AND, where the nested one flips the logic (OR, then children arrays are AND,
 * then OR...).
 *
 * This allows `['Connect', ['Moderator', ['DJ', 'Author']]]` to become a thrice-nested precondition container, where:
 * - Level 1: [Single(Connect), Array] runs AND, both containers must return a successful value.
 * - Level 2: [Single(Moderator), Array] runs OR, either container must return a successful value.
 * - Level 3: [Single(DJ), Single(Author)] runs AND, both containers must return a successful value.
 *
 * In other words, it is identical to doing:
 * ```typescript
 * Connect && (Moderator || (DJ && Author));
 * ```
 *
 * More advanced logic can be accomplished by adding more {@link ISlashCommandPreconditionCondition}s
 * (e.g. other operators), see {@link SlashCommandPreconditionContainerArray.conditions} for more information.
 */
export class SlashCommandPreconditionContainerArray implements ISlashCommandPreconditionContainer {
    public readonly mode: SlashCommandPreconditionRunMode;
    public readonly entries: ISlashCommandPreconditionContainer[];
    public readonly runCondition: SlashCommandPreconditionRunCondition;

    public constructor(
        data: SlashCommandPreconditionArrayResolvable = [],
        parent: SlashCommandPreconditionContainerArray | null = null
    ) {
        this.entries = [];
        this.runCondition = parent?.runCondition === SlashCommandPreconditionRunCondition.And
            ? SlashCommandPreconditionRunCondition.Or
            : SlashCommandPreconditionRunCondition.And;

        if (Array.isArray(data)) {
            const casted = data as readonly SlashCommandPreconditionEntryResolvable[];

            this.mode = parent?.mode ?? SlashCommandPreconditionRunMode.Sequential;
            this.parse(casted);
        } else {
            const casted = data as SlashCommandPreconditionArrayResolvableDetails;

            this.mode = casted.mode;
            this.parse(casted.entries);
        }
    }

    public add(entry: ISlashCommandPreconditionContainer): this {
        this.entries.push(entry);

        return this;
    }

    public append(
        keyOrEntries: SimpleSlashCommandPreconditionSingleResolvableDetails
            | SimpleSlashCommandPreconditionKeys
            | SlashCommandPreconditionContainerArray
    ): this;

    public append<K extends SlashCommandPreconditionKeys>(
        entry: SlashCommandPreconditionSingleResolvableDetails<K>
    ): this;

    public append(entry: SlashCommandPreconditionContainerArray | SlashCommandPreconditionSingleResolvable): this {
        this.entries.push(
            entry instanceof SlashCommandPreconditionContainerArray
                ? entry
                : new SlashCommandPreconditionContainerSingle(entry)
        );

        return this;
    }

    public run(
        interaction: CommandInteraction,
        command: SlashCommand,
        context: SlashCommandPreconditionContext = {}
    ): SlashCommandPreconditionContainerReturn {
        return this.mode === SlashCommandPreconditionRunMode.Sequential
            ? this.condition.sequential(interaction, command, this.entries, context)
            : this.condition.parallel(interaction, command, this.entries, context);
    }

    protected parse(entries: Iterable<SlashCommandPreconditionEntryResolvable>): this {
        for (const entry of entries) {
            this.add(
                isSingle(entry)
                    ? new SlashCommandPreconditionContainerSingle(entry)
                    : new SlashCommandPreconditionContainerArray(entry, this)
            );
        }

        return this;
    }

    protected get condition(): ISlashCommandPreconditionCondition {
        return SlashCommandPreconditionContainerArray.conditions.get(this.runCondition);
    }

    /**
     * The preconditions to be run. Extra ones can be added by augmenting {@link SlashCommandPreconditionRunCondition}
     * and then inserting {@link ISlashCommandPreconditionCondition}s.
     *
     * @example
     * ```typescript
     * // Adding more kinds of conditions
     *
     * // Set the new condition:
     * SlashCommandPreconditionContainerArray.conditions.set(2, SlashCommandPreconditionConditionRandom);
     *
     * // Augment Sapphire to add the new condition, in case of a JavaScript
     * // project, this can be moved to an `Augments.d.ts` (or any other name)
     * // file somewhere:
     * declare module '@sapphire/framework' {
     *   export enum SlashCommandPreconditionRunCondition {
     *     Random = 2
     *   }
     * }
     * ```
     */
    public static readonly conditions = new Collection<
        SlashCommandPreconditionRunCondition,
        ISlashCommandPreconditionCondition
    >([
        [SlashCommandPreconditionRunCondition.And, SlashCommandPreconditionConditionAnd],
        [SlashCommandPreconditionRunCondition.Or, SlashCommandPreconditionConditionOr],
    ]);
}
