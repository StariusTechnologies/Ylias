import { Store } from '@sapphire/pieces';
import { ok } from '@sapphire/framework';
import type { Interaction } from 'discord.js';
import { SlashCommand } from './SlashCommand';
import { SlashCommandPrecondition, SlashCommandPreconditionContext, AsyncSlashCommandPreconditionResult } from './SlashCommandPrecondition';

export class SlashCommandPreconditionStore extends Store<SlashCommandPrecondition> {
    private readonly globalPreconditions: SlashCommandPrecondition[] = [];

    public constructor() {
        super(SlashCommandPrecondition as any, { name: 'slash-command-preconditions' });
    }

    public async run(
        interaction: Interaction,
        slashCommand: SlashCommand,
        context: SlashCommandPreconditionContext = {}
    ): AsyncSlashCommandPreconditionResult {
        for (const precondition of this.globalPreconditions) {
            const result = await precondition.run(interaction, slashCommand, context);

            if (!result.success) {
                return result;
            }
        }

        return ok();
    }

    public set(key: string, value: SlashCommandPrecondition): this {
        if (value.position !== null) {
            const index = this.globalPreconditions.findIndex(
                (precondition) => precondition.position >= value.position
            );

            // If a middleware with lower priority wasn't found, push to the end of the array
            if (index === -1) {
                this.globalPreconditions.push(value);
            } else {
                this.globalPreconditions.splice(index, 0, value);
            }
        }

        return super.set(key, value);
    }

    public delete(key: string): boolean {
        const index = this.globalPreconditions.findIndex((precondition) => precondition.name === key);

        // If the middleware was found, remove it
        if (index !== -1) {
            this.globalPreconditions.splice(index, 1);
        }

        return super.delete(key);
    }

    public clear(): void {
        this.globalPreconditions.length = 0;

        return super.clear();
    }
}
