import { Collection, CommandInteraction, User } from 'discord.js';
import type { PieceContext } from '@sapphire/pieces';
import { SlashCommand } from '../models/framework/lib/structures/SlashCommand';
import { Emotion, Emotions } from '../models/Emotion';

export default class SlotsCommand extends SlashCommand {
    private static MAX_ATTEMPTS = 5;
    private static attempts: Collection<User, number>;
    private static firstAttemptTime: Collection<User, Date>;
    private static emojis: Array<string> = [
        ':dog:',
        ':cat:',
        ':mouse:',
        ':hamster:',
        ':rabbit:',
        ':bear:',
        ':panda_face:',
        ':koala:',
        ':tiger:',
        ':lion_face:',
        ':cow:',
        ':pig:',
        ':frog:',
        ':octopus:',
        ':monkey_face:',
        ':chicken:',
        ':penguin:',
        ':bird:',
        ':baby_chick:',
        ':wolf:',
        ':boar:',
        ':horse:',
        ':unicorn:',
        ':bee:',
        ':bug:',
        ':snail:',
        ':beetle:',
        ':ant:',
        ':spider:',
        ':scorpion:',
        ':crab:',
        ':snake:',
        ':turtle:',
        ':tropical_fish:',
        ':fish:',
        ':blowfish:',
        ':dolphin:',
        ':whale:',
        ':whale2:',
        ':crocodile:',
        ':water_buffalo:',
        ':ox:',
        ':dromedary_camel:',
        ':camel:',
        ':elephant:',
        ':goat:',
        ':ram:',
        ':sheep:',
        ':rat:',
        ':turkey:',
        ':dove:',
        ':dog2:',
        ':poodle:',
        ':dragon_face:',
        ':eagle:',
        ':duck:',
        ':bat:',
        ':shark:',
        ':owl:',
        ':fox:',
        ':butterfly:',
        ':deer:',
        ':gorilla:',
        ':lizard:',
        ':rhino:',
        ':shrimp:',
        ':squid:',
    ];

    constructor(context: PieceContext) {
        super(context, {
            description: `Wanna play slot machines? Well, there is no money implied but it's still fun.`,
        });

        if (!SlotsCommand.attempts) {
            SlotsCommand.attempts = new Collection<User, number>();
        }

        if (!SlotsCommand.firstAttemptTime) {
            SlotsCommand.firstAttemptTime = new Collection<User, Date>();
        }
    }

    private isDateBeforeToday(date: Date) {
        const now: Date = new Date;
        const yearHasPassed = date.getFullYear() < now.getFullYear();
        const monthHasPassed = date.getMonth() < now.getMonth();
        const dayHasPassed = date.getDate() < now.getDate();

        return yearHasPassed || monthHasPassed || dayHasPassed;
    }

    public async run(interaction: CommandInteraction): Promise<void> {
        const { user } = interaction;

        if (!SlotsCommand.attempts.has(user)) {
            SlotsCommand.attempts.set(user, 0);
        }

        if (!SlotsCommand.firstAttemptTime.has(user)) {
            SlotsCommand.firstAttemptTime.set(user, new Date);
        }

        if (this.isDateBeforeToday(SlotsCommand.firstAttemptTime.get(user)!)) {
            SlotsCommand.attempts.set(user, 0);
            SlotsCommand.firstAttemptTime.set(user, new Date);
        }

        if (SlotsCommand.attempts.get(user)! >= SlotsCommand.MAX_ATTEMPTS) {
            await interaction.reply({
                embeds: [Emotion.getEmotionEmbed(Emotions.WINK).setTitle('Come back tomorrow!').setDescription(
                    `You tried too hard today, ${user.username}, come back tomorrow :D !`
                )],
                ephemeral: true,
            });

            return;
        }

        SlotsCommand.attempts.set(user, SlotsCommand.attempts.get(user)! + 1);

        const firstEmoji: string = SlotsCommand.emojis[Math.floor(Math.random() * SlotsCommand.emojis.length)];
        const secondEmoji: string = SlotsCommand.emojis[Math.floor(Math.random() * SlotsCommand.emojis.length)];
        const thirdEmoji: string = SlotsCommand.emojis[Math.floor(Math.random() * SlotsCommand.emojis.length)];

        const won = firstEmoji == secondEmoji && secondEmoji == thirdEmoji;
        const result = won ? ':sparkles: **JACKPOT** :sparkles:' : ':x: **TRY AGAIN** :x:';
        const embed = Emotion.getEmotionEmbed(won ? Emotions.SURPRISE : Emotions.WINK)
            .setTitle('Slots machine')
            .setDescription(
                `${firstEmoji}${secondEmoji}${thirdEmoji}\n${result}`
            );
        const reply: any = { embeds: [embed] };

        if (won) {
            reply.content = interaction.client.users.cache.get(process.env.MOM as string)!.toString();
        }

        await interaction.reply(reply);
    }
}
