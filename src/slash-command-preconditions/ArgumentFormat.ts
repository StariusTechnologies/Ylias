import type { CommandInteraction, ApplicationCommandOptionType } from 'discord.js';
import { SlashCommand } from '../models/framework/lib/structures/SlashCommand';
import {
    SlashCommandPrecondition,
    SlashCommandPreconditionContext,
    SlashCommandPreconditionResult
} from '../models/framework/lib/structures/SlashCommandPrecondition';

export const SlashCommandArgumentFormats = {
    URL: /^https?:\/\/.+/gu,
}

interface SlashCommandArgumentFormatData {
    name: string;
    format: RegExp;
    errorMessage?: string;
}

interface SlashCommandArgumentFormatContext extends SlashCommandPreconditionContext {
    formats: SlashCommandArgumentFormatData[];
}

declare module '../models/framework/lib/structures/SlashCommandPrecondition' {
    interface SlashCommandPreconditions {
        ArgumentFormat: SlashCommandArgumentFormatContext;
    }
}

export class CorePrecondition extends SlashCommandPrecondition {
    public run(
        interaction: CommandInteraction,
        command: SlashCommand,
        context: SlashCommandArgumentFormatContext
    ): SlashCommandPreconditionResult {
        // If the command it is testing for is not this one, return ok:
        if (context.external) {
            return this.ok();
        }

        const acceptedTypes: ApplicationCommandOptionType[] = ['STRING', 'NUMBER', 'INTEGER'];

        for (const formatData of context.formats) {
            const hasArgument = interaction.options.get(formatData.name);
            const isCorrectType = hasArgument && acceptedTypes.includes(interaction.options.get(formatData.name).type);

            if (!isCorrectType) {
                continue;
            }

            if (!formatData.format.test(interaction.options.get(formatData.name).value as string)) {
                return this.error({
                    identifier: 'slashCommandPreconditionArgumentFormat',
                    message: formatData.errorMessage ?? `The value you entered for the option "${formatData.name}" is invalid.`,
                    context: formatData,
                });
            }
        }

        return this.ok();
    }
}
