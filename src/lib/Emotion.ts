import { EmbedBuilder } from 'discord.js';

const EMOTION_ROOT_URI = 'https://static.frenchdiscord.com/ylias/emotions';

export enum Emotions {
    NEUTRAL = `${EMOTION_ROOT_URI}/neutral.gif`,
    SAD = `${EMOTION_ROOT_URI}/sad.gif`,
    SURPRISE = `${EMOTION_ROOT_URI}/surprise.gif`,
    UNAMUSED = `${EMOTION_ROOT_URI}/unamused.gif`,
    WINK = `${EMOTION_ROOT_URI}/wink.gif`
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
