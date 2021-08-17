jest.useFakeTimers();

import { Bootstrap } from '#root/models/Bootstrap';

const bootstrap = new Bootstrap();

bootstrap.initializeIntents();
bootstrap.initializeClient();

export const { client } = bootstrap;
