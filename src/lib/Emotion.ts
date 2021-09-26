import { MessageEmbed } from 'discord.js';

export enum Emotions {
    NEUTRAL = 'https://cdn.nostradamus.dev/ylias/emotions/neutral.gif',
    SAD = 'https://cdn.nostradamus.dev/ylias/emotions/sad.gif',
    SURPRISE = 'https://cdn.nostradamus.dev/ylias/emotions/surprise.gif',
    UNAMUSED = 'https://cdn.nostradamus.dev/ylias/emotions/unamused.gif',
    WINK = 'https://cdn.nostradamus.dev/ylias/emotions/wink.gif'
}

export class Emotion {
    private static DEFAULT_EMBED_COLOUR = 0xE88745;

    public static getEmotionEmbed(emotion: Emotions): MessageEmbed {
        return Emotion.addEmotionToEmbed(new MessageEmbed().setColor(Emotion.DEFAULT_EMBED_COLOUR), emotion);
    }

    public static addEmotionToEmbed(embed: MessageEmbed, emotion: Emotions): MessageEmbed {
        return embed.setThumbnail(emotion);
    }
}
