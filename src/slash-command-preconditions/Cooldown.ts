import { RateLimitManager } from '@sapphire/ratelimits';
import type { ChatInputCommandInteraction } from 'discord.js';
import { BucketScope } from '@sapphire/framework';
import { Identifiers } from '#framework/lib/errors/Identifiers';
import type { SlashCommand } from '#framework/lib/structures/SlashCommand';
import {
    SlashCommandPrecondition,
    SlashCommandPreconditionContext,
    SlashCommandPreconditionResult
} from '#framework/lib/structures/SlashCommandPrecondition';

interface SlashCommandCooldownContext extends SlashCommandPreconditionContext {
    scope?: BucketScope;
    delay: number;
    limit?: number;
}

export class CooldownPrecondition extends SlashCommandPrecondition {
    public buckets = new WeakMap<SlashCommand, RateLimitManager<string>>();

    public run(
        interaction: ChatInputCommandInteraction,
        command: SlashCommand,
        context: SlashCommandCooldownContext
    ): SlashCommandPreconditionResult {
        // If the command it is testing for is not this one, return ok:
        if (context.external) {
            return this.ok();
        }

        // If there is no delay (undefined, null, 0), return ok:
        if (!context.delay) {
            return this.ok();
        }

        const ratelimit = this.getManager(command, context).acquire(this.getId(interaction, context));

        if (ratelimit.limited) {
            const remaining = ratelimit.remainingTime;

            return this.error({
                identifier: Identifiers.SlashCommandPreconditionCooldown,
                message: `You have just used this command. Try again in ${Math.ceil(remaining / 1000)} second${remaining > 1000 ? 's' : ''}.`,
                context: { remaining },
            });
        }

        ratelimit.consume();

        return this.ok();
    }

    private getId(interaction: ChatInputCommandInteraction, context: SlashCommandCooldownContext) {
        switch (context.scope) {
            case BucketScope.Global:
                return 'global';

            case BucketScope.Channel:
                return interaction.channelId;

            case BucketScope.Guild:
                return interaction.guild?.id ?? interaction.channelId;

            default:
                return interaction.user.id;
        }
    }

    private getManager(command: SlashCommand, context: SlashCommandCooldownContext) {
        let manager = this.buckets.get(command);

        if (!manager) {
            manager = new RateLimitManager(context.delay, context.limit);
            this.buckets.set(command, manager);
        }

        return manager;
    }
}
