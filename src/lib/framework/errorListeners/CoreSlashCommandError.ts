import { Listener } from '@sapphire/framework';
import { SlashCommandErrorPayload, Events } from '#framework/lib/types/Events';

export class CoreEvent extends Listener<typeof Events.SlashCommandError> {
    public constructor(context: Listener.LoaderContext) {
        super(context, { event: Events.SlashCommandError });
    }

    public run(error: Error, context: SlashCommandErrorPayload): void {
        const { name, location } = context.piece;

        this.container.logger.error(`Encountered error on slash command "${name}" at path "${location.full}"`, error);
    }
}
