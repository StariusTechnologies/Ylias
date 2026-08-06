import { Events, Message } from 'discord.js';
import { Listener } from '@sapphire/framework';
import { Emotion, Emotions } from '#lib/Emotion';

let lastIndex: number;

export default class MessageCreate extends Listener<typeof Events.MessageCreate> {
    constructor(context: Listener.LoaderContext) {
        super(context, {
            event: Events.MessageCreate,
        });
    }

    public run(message: Message): void {
        this.handleAethersyaDM(message);
        this.handleBotMention(message);
    }

    private handleAethersyaDM(message: Message): void {
        if (message.guild || message.author.id !== process.env.AETHERSYA) {
            return;
        }

        if (Math.random() > .99) {
            const messages: [Emotions, string][] = [
                [Emotions.WINK, `Coucou Sya, ça me fait toujours autant plaisir de te servir de post-it :3 !`],
                [Emotions.SURPRISE, `Hey Sya, tu sais que je peux lire TOUT ce que tu écris hein O-O ?`],
                [Emotions.SAD, `Sya, ça fait trop longtemps que tu m'as pas envoyé de message je commençais à m'inquiéter ;-; ...`],
                [Emotions.NEUTRAL, `Salut Sya, comment va la mafia ?`],
            ];

            if (lastIndex === undefined) {
                lastIndex = Math.floor(Math.random() * messages.length);
            }

            lastIndex = (lastIndex + 1) % messages.length;

            const [emotion, text] = messages[lastIndex];

            message.reply({ embeds: [Emotion.getEmotionEmbed(emotion).setDescription(text)] });
        }
    }

    private handleBotMention(message: Message): void {
        if (!message.mentions.users.has(message.client.user!.id) || message.guildId !== process.env.TEST_GUILD_ID) {
            return;
        }

        const embed = Emotion.getEmotionEmbed(Emotions.NEUTRAL).setTitle('Pinged');

        message.reply({
            embeds: [embed.setDescription(`Hello there! It's me, a bot! If you want me to do something for you, you must use my slash commands! Type a slash (/) in the message bar to get a list of them!`)],
        });
    }
}
