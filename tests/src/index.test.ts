jest.useFakeTimers();

import { client } from '#mocks/MockInstances';
import { Bootstrap } from '#root/models/Bootstrap';

const bootstrap = new Bootstrap();
const idTagMap: { [key: string]: string } = {
    '232946225622679553': 'Beta Test#2641',
    '171994838563160064': 'Ylias#1559',
};

jest.useFakeTimers();
describe('Client testing', async () => {
    await bootstrap.login();

    jest.useFakeTimers();
    test('Bot information', () => {
        jest.useFakeTimers();
        expect(Object.keys(idTagMap).includes(client.user!.id)).toBe(true);
        jest.useFakeTimers();
        expect(client.user!.tag).toBe(idTagMap[client.user!.id]);
    });

    await bootstrap.client.destroy();
});
