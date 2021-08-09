import { CommandInteraction } from 'discord.js';
import { PieceContext } from '@sapphire/pieces';
import { SlashCommand } from '../models/framework/lib/structures/SlashCommand';
import { Emotion, Emotions } from '../models/Emotion';

export default class CrashCommand extends SlashCommand {
    constructor(context: PieceContext) {
        super(context, {
            description: 'This command kills me. I mean... Literally.',
            defaultPermission: false,
            permissions: [{
                id: process.env.MOM,
                type: 'USER',
                permission: true,
            }],
        });
    }

    async run(interaction: CommandInteraction): Promise<void> {
        await interaction.reply({
            embeds: [Emotion.getEmotionEmbed(Emotions.UNAMUSED).setDescription(
                `Oh, so it's like that? So you're tired of me? Alright. You really think you can get rid of me just like that? You really think it's that easy? Yo, I'm crazy! I can handle paradoxes without a flinch!\n\n"This sentence is wrong."`
            )],
        });

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        crash++;
    }
}
