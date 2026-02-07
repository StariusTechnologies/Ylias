import { ok } from '@sapphire/framework';
import type { ISlashCommandPreconditionCondition } from './ISlashCommandPreconditionCondition';

export const SlashCommandPreconditionConditionAnd: ISlashCommandPreconditionCondition = {
    async sequential(interaction, command, entries, context) {
        for (const child of entries) {
            const result = await child.run(interaction, command, context);

            if (result.isErr()) {
                return result;
            }
        }

        return ok();
    },
    async parallel(interaction, command, entries, context) {
        const results = await Promise.all(entries.map(entry => entry.run(interaction, command, context)));

        // This is simplified compared to PreconditionContainerAny because we're looking for the first error.
        // However, the base implementation short-circuits with the first Ok.
        return results.find(r => r.isErr()) ?? ok();
    },
};
