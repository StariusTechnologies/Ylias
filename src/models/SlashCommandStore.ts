import { AliasStore } from '@sapphire/pieces';
import { SlashCommand } from './SlashCommand';

export default class SlashCommandStore extends AliasStore<SlashCommand> {
    constructor() {
        super(SlashCommand as any, { name: 'slash-commands' });
    }
}
