import path from 'path';
import type { PieceContext } from '@sapphire/framework';
import type { Piece } from '@sapphire/framework';
import type { Store } from '@sapphire/pieces';
import { ListenerStore } from '@sapphire/framework';
import { SlashCommandPreconditionStore } from '#root/models/framework/lib/structures/SlashCommandPreconditionStore';
import SlashCommandStore from '#root/models/framework/lib/structures/SlashCommandStore';

const storesMap: {[key: string]: Store<Piece>} = {
    'listeners': new ListenerStore(),
    'slash-command-preconditions': new SlashCommandPreconditionStore(),
    'slash-commands': new SlashCommandStore(),
};

export const getPieceContext = (relativePath: string): PieceContext => {
    const relativePathParts = relativePath.split('/').map(piece => piece.split('\\')).flat();
    const pathParts = [
        __dirname,
        '..',
        '..',
        'dist',
        ...relativePathParts,
    ];

    return {
        path: path.join(...pathParts),
        name: 'Ready',
        store: storesMap[relativePathParts[0]],
    }
};
