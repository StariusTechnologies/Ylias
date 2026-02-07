import { ApplicationCommandOptionType, type ChatInputCommandInteraction } from 'discord.js';
import type { SlashCommand } from '#framework/lib/structures/SlashCommand';
import {
    SlashCommandPrecondition,
    SlashCommandPreconditionContext,
    SlashCommandPreconditionResult
} from '#framework/lib/structures/SlashCommandPrecondition';

export const SlashCommandArgumentFormats = {
    URL: /^https?:\/\/.+/gu.test,
}

interface SlashCommandArgumentFormatData {
    name: string;
    validate: (value: string) => boolean;
    errorMessage?: string;
}

interface SlashCommandArgumentFormatContext extends SlashCommandPreconditionContext {
    formats: SlashCommandArgumentFormatData[];
}

declare module '../lib/framework/lib/structures/SlashCommandPrecondition' {
    interface SlashCommandPreconditions {
        ArgumentFormat: SlashCommandArgumentFormatContext;
    }
}

export class ArgumentFormatPrecondition extends SlashCommandPrecondition {
    public run(
        interaction: ChatInputCommandInteraction,
        _: SlashCommand,
        context: SlashCommandArgumentFormatContext
    ): SlashCommandPreconditionResult {
        // If the command it is testing for is not this one, return ok:
        if (context.external) {
            return this.ok();
        }

        const acceptedTypes: ApplicationCommandOptionType[] = [ApplicationCommandOptionType.String, ApplicationCommandOptionType.Number, ApplicationCommandOptionType.Integer];

        for (const formatData of context.formats) {
            const hasArgument = interaction.options.get(formatData.name);
            const isCorrectType = hasArgument && acceptedTypes.includes(interaction.options.get(formatData.name)!.type);

            if (!isCorrectType) {
                continue;
            }

            if (!formatData.validate(interaction.options.get(formatData.name)!.value as string)) {
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
