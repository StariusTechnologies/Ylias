import type { CommandInteraction } from 'discord.js';
import type { PieceContext } from '@sapphire/pieces';
import { SlashCommand } from '#framework/lib/structures/SlashCommand';
import { Emotion, Emotions } from '#lib/Emotion';
import { BucketScope } from '@sapphire/framework';

export default class CrashCommand extends SlashCommand {
    constructor(context: PieceContext) {
        super(context, {
            description: 'This command kills me. I mean... Literally.',
            preconditions: [{
                name: 'Cooldown',
                context: {
                    scope: BucketScope.User,
                    delay: 10000,
                },
            }],
        });
    }

    public async run(interaction: CommandInteraction): Promise<void> {
        await interaction.reply({
            embeds: [Emotion.getEmotionEmbed(Emotions.UNAMUSED).setDescription(
                `Oh, so it's like that? So you're tired of me? Alright. You really think you can get rid of me just like that? You really think it's that easy? Yo, I'm crazy! I can handle paradoxes without a flinch!\n\n"This sentence is wrong."`
            )],
        });

        throw new Error('I just crashed');
    }
}
