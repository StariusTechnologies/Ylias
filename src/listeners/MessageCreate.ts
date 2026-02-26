import { Events, Message, NewsChannel, TextChannel, ThreadChannel } from 'discord.js';
import { Listener } from '@sapphire/framework';
import Emojis from '#lib/Emojis';
import { Emotion, Emotions } from '#lib/Emotion';

type GuildTextChannel = TextChannel | ThreadChannel | NewsChannel;
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
        this.handleMomMention(message);
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
        if (!message.mentions.users.has(message.client.user!.id)) {
            return;
        }

        const embed = Emotion.getEmotionEmbed(Emotions.NEUTRAL).setTitle('Pinged');

        message.reply({
            embeds: [embed.setDescription(`Hello there! It's me, a bot! If you want me to do something for you, you must use my slash commands! Type a slash (/) in the message bar to get a list of them!`)],
        });
    }

    private handleMomMention(message: Message): void {
        const pingsMom = message.mentions.users.has(process.env.MOM as string);

        if (!message.guild || message.author?.id === process.env.MOM || pingsMom) {
            return;
        }

        const mom = message.client.users.cache.get(process.env.MOM as string)!;
        const momMember = message.guild.members.cache.get(mom.id);
        const cancelWords = ['lildami', 'wolfy', 'lille'];
        const searchWords = [
            mom.id,
            mom.username,
            'leel',
            'lil',
            'lyl',
            'liily',
            'lielie',
            'l¡ly',
            'wolf',
            `${Emojis.l}${Emojis.i}${Emojis.l}${Emojis.y}`,
            `${Emojis.l} ${Emojis.i} ${Emojis.l} ${Emojis.y}`,
        ];

        if (momMember && momMember.nickname) {
            searchWords.push(momMember.nickname);
        }

        for (const cancelWord of cancelWords) {
            if (message.content.toLowerCase().includes(cancelWord)) {
                return;
            }
        }

        let found = false;

        for (const searchWord of searchWords) {
            found = found || message.content.toLowerCase().includes(searchWord);
        }

        if (found) {
            const channel = message.channel as GuildTextChannel;
            const embed = Emotion.getEmotionEmbed(Emotions.WINK)
                .setURL(message.url)
                .setAuthor({
                    name: message.member!.displayName,
                    iconURL: message.author.displayAvatarURL(),
                    url: message.url,
                })
                .setDescription(message.content)
                .setFooter({ text: `#${channel.name} in ${message.guild.name}` });

            mom.send({ embeds: [embed] });
        }
    }
}
