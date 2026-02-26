import path from 'path';
import type { PieceContext } from '@sapphire/framework';
import type { Piece } from '@sapphire/framework';
import type { Store } from '@sapphire/pieces';
import { TextChannel, Guild, ButtonStyle, ChannelType } from 'discord.js';
import { ListenerStore, CommandStore, PreconditionStore } from '@sapphire/framework';
import type { ButtonCreationData } from '#lib/InteractionManager';
import { Bootstrap } from '#lib/Bootstrap';

const storesMap: {[key: string]: Store<Piece>} = {
    'listeners': new ListenerStore(),
    'preconditions': new PreconditionStore(),
    'commands': new CommandStore(),
};

const devDotEnvPath = path.join(__dirname, '..', '..', '..', '.env');
const bootstrap = new Bootstrap({ dotEnvPath: devDotEnvPath });

bootstrap.initializeClient();

const { client } = bootstrap;
const guild = new (Guild as any)(client, { id: '123456789012345678', unavailable: true });
const textChannel = new (TextChannel as any)(guild, { id: '123456789012345678', type: ChannelType.GuildText, name: 'test' }, client);

export const messageButtonData: ButtonCreationData = {
    id: 'testId',
    style: ButtonStyle.Primary,
    label: 'testLabel',
    callback: () => {},
    channel: textChannel,
    timeout: 0,
};

const distRoot = path.join(__dirname, '..', '..', 'dist');

export const getPieceContext = (relativePath: string): PieceContext => {
    const relativePathParts = relativePath.split('/').map(piece => piece.split('\\')).flat();

    return {
        root: distRoot,
        path: path.join(distRoot, ...relativePathParts),
        name: 'Ready',
        store: storesMap[relativePathParts[0]],
    } as PieceContext;
};
