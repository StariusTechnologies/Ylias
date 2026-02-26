import { BucketScope, Command } from '@sapphire/framework';
import { Emotion, Emotions } from '#lib/Emotion';
import { MessageFlags } from "discord-api-types/v10";

export default class CrashCommand extends Command {
    constructor(context: Command.LoaderContext, options: Command.Options) {
        super(context, {
            ...options,
            description: 'This command kills me. I mean... Literally.',
            cooldownDelay: 10000,
            cooldownScope: BucketScope.User,
        });
    }

    public override registerApplicationCommands(registry: Command.Registry): void {
        registry.registerChatInputCommand((builder) =>
            builder.setName(this.name).setDescription(this.description)
        );
    }

    public async chatInputRun(interaction: Command.ChatInputCommandInteraction): Promise<void> {
        await interaction.reply({
            embeds: [Emotion.getEmotionEmbed(Emotions.UNAMUSED).setDescription(
                `Oh, so it's like that? So you're tired of me? Alright. You really think you can get rid of me just like this? You really think it's that easy? You don't know me, I'm crazy! I can handle paradoxes without a flinch!\n\n"This sentence is wrong."`
            )],
            flags: MessageFlags.Ephemeral,
        });

        throw new Error('I just crashed');
    }
}
