import { CommandInteraction } from 'discord.js';
import { PieceContext } from '@sapphire/pieces';
import { SlashCommand } from '../models/framework/lib/structures/SlashCommand';
import { fetch, FetchResultTypes } from '@sapphire/fetch';
import { BucketScope } from '@sapphire/framework';

export default class DogCommand extends SlashCommand {
    constructor(context: PieceContext) {
        super(context, {
            description: 'Displays a random dog.',
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
        const response = await fetch('https://random.dog/woof', FetchResultTypes.Text) as any;

        if (response?.split('\n').length < 2) {
            await interaction.reply(`https://random.dog/${response.trim()}`);
        } else {
            throw new Error('The random dog API seems to be down at the moment.');
        }
    }
}
