import Logger from '@lilywonhalf/pretty-logger';
import { Bootstrap } from '#lib/Bootstrap';

Logger.info('Booting up application...');

const bootstrap = new Bootstrap();

bootstrap.initializeIntents();
bootstrap.initializeClient();

Logger.info('Application initialized');
Logger.info('Logging in...');

bootstrap.login();
