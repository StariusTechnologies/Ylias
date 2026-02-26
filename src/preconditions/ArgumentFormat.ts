import { ApplicationCommandOptionType, type ChatInputCommandInteraction } from 'discord.js';
import { Precondition } from '@sapphire/framework';
import type { ChatInputCommand } from '@sapphire/framework';

export const SlashCommandArgumentFormats = {
    URL: /^https?:\/\/.+/gu.test,
}

interface SlashCommandArgumentFormatData {
    name: string;
    validate: (value: string) => boolean;
    errorMessage?: string;
}

interface SlashCommandArgumentFormatContext extends Precondition.Context {
    formats: SlashCommandArgumentFormatData[];
}

declare module '@sapphire/framework' {
    interface Preconditions {
        ArgumentFormat: SlashCommandArgumentFormatContext;
    }
}

export class ArgumentFormatPrecondition extends Precondition {
    public chatInputRun(
        interaction: ChatInputCommandInteraction,
        _: ChatInputCommand,
        context: SlashCommandArgumentFormatContext
    ): Precondition.Result {
        const acceptedTypes: ApplicationCommandOptionType[] = [
            ApplicationCommandOptionType.String,
            ApplicationCommandOptionType.Number,
            ApplicationCommandOptionType.Integer,
        ];

        for (const formatData of context.formats) {
            const hasArgument = interaction.options.get(formatData.name);
            const isCorrectType = hasArgument && acceptedTypes.includes(interaction.options.get(formatData.name)!.type);

            if (!isCorrectType) {
                continue;
            }

            if (!formatData.validate(interaction.options.get(formatData.name)!.value as string)) {
                return this.error({
                    identifier: 'preconditionArgumentFormat',
                    message: formatData.errorMessage ?? `The value you entered for the option "${formatData.name}" is invalid.`,
                    context: formatData,
                });
            }
        }

        return this.ok();
    }
}
