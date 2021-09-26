import { UserError } from '@sapphire/framework';
import type { SlashCommandPrecondition } from '#framework/lib/structures/SlashCommandPrecondition';

export class SlashCommandPreconditionError extends UserError {
    public readonly precondition: SlashCommandPrecondition;

    public constructor(options: SlashCommandPreconditionError.Options) {
        super({ ...options, identifier: options.identifier ?? options.precondition.name });
        this.precondition = options.precondition;
    }

    // eslint-disable-next-line @typescript-eslint/class-literal-property-style
    public get name(): string {
        return 'SlashCommandPreconditionError';
    }
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace SlashCommandPreconditionError {
    export interface Options extends Omit<UserError.Options, 'identifier'> {
        precondition: SlashCommandPrecondition;
        identifier?: string;
    }
}
