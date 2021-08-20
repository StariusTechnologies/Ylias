import path from 'path';
import type { PieceContext } from '@sapphire/framework';
import type { Piece } from '@sapphire/framework';
import type { Store } from '@sapphire/pieces';
import { TextChannel, Guild } from 'discord.js';
import { ListenerStore } from '@sapphire/framework';
import { SlashCommandPreconditionStore } from '#root/models/framework/lib/structures/SlashCommandPreconditionStore';
import SlashCommandStore from '#root/models/framework/lib/structures/SlashCommandStore';
import type { ButtonCreationData } from '#root/models/InteractionManager';
import { Bootstrap } from '#root/models/Bootstrap';
import type { APIPartialChannel } from 'discord-api-types';
import { ChannelType } from 'discord-api-types';
import type { RawGuildData } from 'discord.js/typings/rawDataTypes';

const storesMap: {[key: string]: Store<Piece>} = {
    'listeners': new ListenerStore(),
    'slash-command-preconditions': new SlashCommandPreconditionStore(),
    'slash-commands': new SlashCommandStore(),
};

const devDotEnvPath = path.join(__dirname, '..', '..', '..', '.env');
const bootstrap = new Bootstrap({ dotEnvPath: devDotEnvPath });

const rawGuildData: RawGuildData = { id: '123456789012345678', unavailable: true };
const apiPartialChannel: APIPartialChannel = { id: '123456789012345678', type: ChannelType.GuildText, name: 'test' };
const { client } = bootstrap;
const guild = new Guild(client, rawGuildData);
const textChannel = new TextChannel(guild, apiPartialChannel, client);

export const messageButtonData: ButtonCreationData = {
    id: 'testId',
    style: 'PRIMARY',
    label: 'testLabel',
    callback: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
    channel: textChannel,
    timeout: 0,
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
