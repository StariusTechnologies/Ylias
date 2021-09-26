import type { CommandInteraction } from 'discord.js';
import type { PieceContext } from '@sapphire/pieces';
import { fetch } from '@sapphire/fetch';
import { BucketScope } from '@sapphire/framework';
import { SlashCommand } from '#framework/lib/structures/SlashCommand';

export default class AwwCommand extends SlashCommand {
    constructor(context: PieceContext) {
        super(context, {
            description: 'Sends a link to something cute.',
            arguments: [{
                name: 'hot',
                description: 'Fetch a post from the hot posts',
                type: 'BOOLEAN',
                required: false,
            }],
            preconditions: [{
                name: 'Cooldown',
                context: {
                    scope: BucketScope.User,
                    delay: 10000,
                },
            }],
        });
    }

    public async run(interaction: CommandInteraction): Promise<void> {
        const isHot = interaction.options.getBoolean('hot') as boolean;
        const url = `https://www.reddit.com/r/aww/${isHot ? '' : 'new'}.json?count=100`;
        const response = await fetch(url) as any;
        const children = response?.data?.children ? response.data.children.filter((child: any) => {
            return child.data?.preview?.images;
        }) : [];

        if (children.length) {
            const picture = children[Math.floor(Math.random() * children.length)];

            await interaction.reply(picture.data.url.replace(/&amp;/gu, '&'));
        } else {
            await interaction.reply({
                content: 'There seem to have been a problem while retrieving an image. Please try again later.',
                ephemeral: true,
            });
        }
    }
}
