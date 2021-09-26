import { Collection, CommandInteraction, User, MessageActionRow, ButtonInteraction, Message, TextBasedChannels } from 'discord.js';
import type { MessageButton, WebhookEditMessageOptions } from 'discord.js';
import type { PieceContext } from '@sapphire/pieces';
import { SlashCommand } from '#framework/lib/structures/SlashCommand';
import { InteractionManager } from '#lib/InteractionManager';
import { Emotion, Emotions } from '#lib/Emotion';
import { sleep } from '#lib/DateTimeUtils';

interface UserSlotsData {
    attempts: number;
    firstAttemptTime: Date;
    processing: boolean;
    button?: MessageButton;
}

export default class SlotsCommand extends SlashCommand {
    private static MAX_ATTEMPTS = 5;
    private static usersSlotsData: Collection<User, UserSlotsData>;
    private static interactionManager: InteractionManager = new InteractionManager();
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

        if (!SlotsCommand.usersSlotsData) {
            SlotsCommand.usersSlotsData = new Collection<User, UserSlotsData>();
        }
    }

    private isDateBeforeToday(date: Date) {
        const now: Date = new Date;
        const yearHasPassed = date.getFullYear() < now.getFullYear();
        const monthHasPassed = date.getMonth() < now.getMonth();
        const dayHasPassed = date.getDate() < now.getDate();

        return yearHasPassed || monthHasPassed || dayHasPassed;
    }

    private async playSlots(interaction: CommandInteraction | ButtonInteraction) {
        const { user } = interaction;
        const userSlotsData = SlotsCommand.usersSlotsData.has(user)
            ? SlotsCommand.usersSlotsData.get(user)
            : SlotsCommand.usersSlotsData.set(user, {
                attempts: 0,
                firstAttemptTime: new Date,
                processing: false,
            }).get(user);
        let message: Message;

        if (interaction.isButton()) {
            message = interaction.channel!.messages.cache.get(interaction.message.id)
                ?? await interaction.channel!.messages.fetch(interaction.message.id);
        }

        if (userSlotsData!.processing) {
            return;
        }

        userSlotsData!.processing = true;

        if (this.isDateBeforeToday(userSlotsData!.firstAttemptTime)) {
            userSlotsData!.attempts = 0;
            userSlotsData!.firstAttemptTime = new Date;
        }

        if (userSlotsData!.attempts >= SlotsCommand.MAX_ATTEMPTS) {
            const comeBackEmbed = Emotion.getEmotionEmbed(Emotions.WINK).setTitle('Come back tomorrow!').setDescription(
                `You tried too hard today, ${user.username}, come back tomorrow :D !`
            );

            if (interaction.isButton()) {
                await message!.edit({ embeds: [comeBackEmbed], components: [] } );
            } else {
                await interaction.reply({ embeds: [comeBackEmbed], components: [] });
            }

            userSlotsData!.processing = false;

            return;
        }

        userSlotsData!.attempts++;

        const firstEmoji: string = SlotsCommand.emojis[Math.floor(Math.random() * SlotsCommand.emojis.length)];
        const secondEmoji: string = SlotsCommand.emojis[Math.floor(Math.random() * SlotsCommand.emojis.length)];
        const thirdEmoji: string = SlotsCommand.emojis[Math.floor(Math.random() * SlotsCommand.emojis.length)];

        const won = firstEmoji == secondEmoji && secondEmoji == thirdEmoji;
        const result = won ? ':sparkles: **JACKPOT** :sparkles:' : ':x: **TRY AGAIN** :x:';
        const firstEmbed = Emotion.getEmotionEmbed(Emotions.NEUTRAL)
            .setTitle('Slots machine')
            .setDescription(
                `${firstEmoji}:question::question:`
            );
        const secondEmbed = Emotion.getEmotionEmbed(Emotions.NEUTRAL)
            .setTitle('Slots machine')
            .setDescription(
                `${firstEmoji}${secondEmoji}:question:`
            );
        const thirdEmbed = Emotion.getEmotionEmbed(won ? Emotions.SURPRISE : Emotions.WINK)
            .setTitle('Slots machine')
            .setDescription(
                `${firstEmoji}${secondEmoji}${thirdEmoji} \n${result}`
            );

        if (interaction.isButton()) {
            await message!.edit({ embeds: [firstEmbed] });
        } else {
            await interaction.reply({ embeds: [firstEmbed] });
        }

        const editedReply: WebhookEditMessageOptions = { embeds: [secondEmbed] };

        await sleep(500);

        if (interaction.isButton()) {
            await message!.edit(editedReply);
        } else {
            await interaction.editReply(editedReply);
        }

        if (won) {
            editedReply.content = interaction.client.users.cache.get(process.env.MOM as string)!.toString();
        }

        editedReply.embeds = [thirdEmbed];

        if (!userSlotsData!.button) {
            let { channel } = interaction;

            if (!channel) {
                channel = await interaction.client.channels.fetch(interaction.channelId!) as TextBasedChannels;
            }

            userSlotsData!.button = SlotsCommand.interactionManager.getButton({
                id: `playSlotsAgain${interaction.id}`,
                style: 'PRIMARY',
                label: 'Play again',
                emoji: '🔁',
                channel,
                callback: (buttonInteraction) => {
                    buttonInteraction.deferUpdate();
                    this.playSlots(buttonInteraction);
                },
            });
        }

        if (!won) {
            editedReply.components = [new MessageActionRow().addComponents(userSlotsData!.button)];
        }

        await sleep(500);

        if (interaction.isButton()) {
            await message!.edit(editedReply);
        } else {
            await interaction.editReply(editedReply);
        }

        userSlotsData!.processing = false;
    }

    public async run(interaction: CommandInteraction): Promise<void> {
        await this.playSlots(interaction);
    }
}
