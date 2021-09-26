import { Constants, Message, MessageAttachment, NewsChannel, TextChannel, ThreadChannel } from 'discord.js';
import { Listener } from '@sapphire/framework';
import type { PieceContext } from '@sapphire/pieces';
import Emojis from '#lib/Emojis';
import { Emotion, Emotions } from '#lib/Emotion';

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
        const embed = Emotion.getEmotionEmbed(Emotions.WINK).setTitle('Slash commands');
        const commandsToIgnore = ['ping'];
        const commandExists = this.container.stores.get('slash-commands').has(commandName);

        if (commandExists) {
            if (message.content.startsWith('/')) {
                message.reply({
                    embeds: [embed.setDescription(`You actually have to click on the slash command when it pops up (you can also use the tab key on desktop) or else it won't work`)],
                    files: [
                        new MessageAttachment(
                            'https://i.discord.fr/UZR.png',
                            'mobile-click.png'
                        ),
                        new MessageAttachment(
                            'https://i.discord.fr/DGJ.png',
                            'desktop-click.png'
                        ),
                    ],
                });
            } else if (!commandsToIgnore.includes(commandName)) {
                message.reply({
                    embeds: [embed.setDescription(`I work with slash commands now, try typing \`/${commandName.toLowerCase()}\`!`)],
                });
            }
        }
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
                .setAuthor(message.member!.displayName, message.author.displayAvatarURL({ dynamic: true }), message.url)
                .setDescription(message.content)
                .setFooter(`#${channel.name} in ${message.guild.name}`);

            mom.send({ embeds: [embed] });
        }
    }
}
