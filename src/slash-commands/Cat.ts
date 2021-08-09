import { CommandInteraction } from 'discord.js';
import { PieceContext } from '@sapphire/pieces';
import { SlashCommand } from '../models/framework/lib/structures/SlashCommand';
import { fetch } from '@sapphire/fetch';
import { BucketScope } from '@sapphire/framework';

export default class CatCommand extends SlashCommand {
    constructor(context: PieceContext) {
        super(context, {
            description: 'Displays a random cat.',
            preconditions: [{
                name: 'Cooldown',
                context: {
                    scope: BucketScope.User,
                    delay: 10000,
                },
            }],
        });
    }

    async run(interaction: CommandInteraction): Promise<void> {
        const user = interaction.user;
        const response = await fetch('https://aws.random.cat/meow') as any;

        if (response?.file) {
            await interaction.reply(response.file);
        } else {
            throw new Error('The random cat API seems to be down at the moment.');
        }
    }
}
