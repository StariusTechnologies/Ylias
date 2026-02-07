import { EmbedBuilder } from 'discord.js';

export enum Emotions {
    NEUTRAL = 'https://cdn.nostradamus.dev/ylias/emotions/neutral.gif',
    SAD = 'https://cdn.nostradamus.dev/ylias/emotions/sad.gif',
    SURPRISE = 'https://cdn.nostradamus.dev/ylias/emotions/surprise.gif',
    UNAMUSED = 'https://cdn.nostradamus.dev/ylias/emotions/unamused.gif',
    WINK = 'https://cdn.nostradamus.dev/ylias/emotions/wink.gif'
}

export class Emotion {
    private static DEFAULT_EMBED_COLOUR = 0xE88745;

    public static getEmotionEmbed(emotion: Emotions): EmbedBuilder {
        return Emotion.addEmotionToEmbed(new EmbedBuilder().setColor(Emotion.DEFAULT_EMBED_COLOUR), emotion);
    }

    public static addEmotionToEmbed(embed: EmbedBuilder, emotion: Emotions): EmbedBuilder {
        return embed.setThumbnail(emotion);
    }
}
