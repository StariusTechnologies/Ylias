import { ActionRowBuilder, AttachmentBuilder, ButtonBuilder, ButtonStyle, type TextBasedChannel } from 'discord.js';
import { Command, BucketScope } from '@sapphire/framework';
import { fetch } from '@sapphire/fetch';
import Logger from '@lilywonhalf/pretty-logger';
import { Emotion, Emotions } from '#lib/Emotion';
import { InteractionManager } from '#lib/InteractionManager';
import { RatReputation } from '#lib/RatReputation';
import { MessageFlags } from 'discord-api-types/v10';

const PER_PAGE = 10;
const MAX_PAGE_RETRIES = 3;
let totalHits: number | null = null;

export default class RatCommand extends Command {
    private interactionManager = new InteractionManager();
    private ratReputation = new RatReputation();

    constructor(context: Command.LoaderContext, options: Command.Options) {
        super(context, {
            ...options,
            description: 'Displays a random rat.',
            cooldownDelay: 10000,
            cooldownScope: BucketScope.User,
        });
    }

    public override registerApplicationCommands(registry: Command.Registry): void {
        registry.registerChatInputCommand((builder) =>
            builder.setName(this.name).setDescription(this.description)
        );
    }

    private async fetchTotalHits(): Promise<void> {
        if (totalHits !== null) {
            return;
        }

        const initial = await fetch(
            `https://pixabay.com/api/?key=${process.env.PIXABAY_API_KEY}&q=rat&image_type=photo&safesearch=true&per_page=3`
        ) as any;

        ({ totalHits } = initial);
    }

    private async fetchRandomPage(): Promise<any[]> {
        const lastPage = Math.ceil(totalHits! / PER_PAGE);
        const randomPage = Math.floor(Math.random() * lastPage) + 1;

        const data = await fetch(
            `https://pixabay.com/api/?key=${process.env.PIXABAY_API_KEY}&q=rat&image_type=photo&safesearch=true&per_page=${PER_PAGE}&page=${randomPage}`
        ) as any;

        return data.hits;
    }

    private async pickGoodImage(): Promise<any> {
        for (let pageRetry = 0; pageRetry < MAX_PAGE_RETRIES; pageRetry++) {
            const hits = await this.fetchRandomPage();

            for (const hit of hits.sort(() => Math.random() - 0.5)) {
                const isBad = await this.ratReputation.isBadImage(String(hit.id));

                if (!isBad) {
                    return hit;
                }
            }
        }

        return null;
    }

    public async chatInputRun(interaction: Command.ChatInputCommandInteraction): Promise<void> {
        await interaction.deferReply();

        try {
            await this.fetchTotalHits();

            const image = await this.pickGoodImage();

            if (!image) {
                const embed = Emotion.getEmotionEmbed(Emotions.SURPRISE)
                    .setTitle('Bad luck!')
                    .setDescription('I tried a few times but only found bad images. Try again!');

                await interaction.editReply({ embeds: [embed] });

                return;
            }

            const imageId = String(image.id);

            let channel = interaction.channel as TextBasedChannel;

            if (!channel) {
                channel = await interaction.client.channels.fetch(
                    interaction.channelId!
                ) as TextBasedChannel;
            }

            const yesButton = this.interactionManager.getButton({
                id: `ratYes-${imageId}-${interaction.id}`,
                style: ButtonStyle.Success,
                label: 'This is a rat',
                emoji: '🐀',
                channel,
                callback: async (buttonInteraction) => {
                    const result = await this.ratReputation.vote(imageId, buttonInteraction.user.id, true);

                    await buttonInteraction.reply({
                        content: result === 'duplicate' ? 'You already voted for this!' : 'Vote recorded!',
                        flags: MessageFlags.Ephemeral,
                    });
                },
            });

            const noButton = this.interactionManager.getButton({
                id: `ratNo-${imageId}-${interaction.id}`,
                style: ButtonStyle.Danger,
                label: 'This is not a rat',
                channel,
                callback: async (buttonInteraction) => {
                    const result = await this.ratReputation.vote(imageId, buttonInteraction.user.id, false);

                    await buttonInteraction.reply({
                        content: result === 'duplicate' ? 'You already voted for this!' : 'Vote recorded!',
                        flags: MessageFlags.Ephemeral,
                    });
                },
            });

            const row = new ActionRowBuilder<ButtonBuilder>().addComponents(yesButton, noButton);
            const imageUrl: string = image.largeImageURL;
            const extension = imageUrl.split('.').pop()?.split('?')[0] ?? 'jpg';
            const attachment = new AttachmentBuilder(imageUrl, { name: `rat.${extension}` });

            await interaction.editReply({
                files: [attachment],
                components: [row],
            });
        } catch (error: any) {
            Logger.notice(error);

            const embed = Emotion.getEmotionEmbed(Emotions.SAD)
                .setTitle('No rats found')
                .setDescription('The Pixabay API seems to be down at the moment.');

            await interaction.editReply({ embeds: [embed] });
        }
    }
}
