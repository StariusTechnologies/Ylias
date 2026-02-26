import { Precondition } from '@sapphire/framework';
import type { ChatInputCommandInteraction } from 'discord.js';

declare module '@sapphire/framework' {
    interface Preconditions {
        OwnerOnly: never;
    }
}

export class OwnerOnlyPrecondition extends Precondition {
    public chatInputRun(interaction: ChatInputCommandInteraction): Precondition.Result {
        if (interaction.user.id === process.env.MOM) {
            return this.ok();
        }

        return this.error({ message: 'Only the bot owner can use this command.' });
    }
}
