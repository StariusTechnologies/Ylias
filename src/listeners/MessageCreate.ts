import { Constants, Message, NewsChannel, TextChannel, ThreadChannel } from 'discord.js';
import { Listener } from '@sapphire/framework';
import { PieceContext } from '@sapphire/pieces';
import Emojis from '../models/Emojis';
import { Emotion, Emotions } from '../models/Emotion';

type GuildTextChannel = TextChannel | ThreadChannel | NewsChannel;

export default class MessageCreate extends Listener<typeof Constants.Events.MESSAGE_CREATE> {
    constructor(context: PieceContext) {
        super(context, {
            event: Constants.Events.MESSAGE_CREATE,
        });
    }

    public run(message: Message): void {
        this.handlePrefixedCommand(message);
        this.handleMomMention(message);
    }

    private handlePrefixedCommand(message: Message): void {
        const commandName = message.content.split(' ')[0].slice(1);

        if (this.container.stores.get('slash-commands').has(commandName)) {
            message.reply(`I work with slash commands now, try typing \`/${commandName.toLowerCase()}\`!`);
        }
    }

    private handleMomMention(message: Message): void {
        if (!message.guild || message.author?.id === process.env.MOM || message.mentions.users.has(process.env.MOM)) {
            return;
        }

        const mom = message.client.users.cache.get(process.env.MOM);
        const momMember = message.guild.members.cache.get(mom.id);
        const cancelWords = ['lildami', 'wolfyse'];
        const searchWords = [
            mom.id,
            mom.username,
            mom.discriminator,
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

        if (momMember) {
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
                .setAuthor(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }), message.url)
                .setDescription(message.content)
                .setFooter(`#${channel.name} in ${message.guild.name}`);

            mom.send({ embeds: [embed] });
        }
    }
}
