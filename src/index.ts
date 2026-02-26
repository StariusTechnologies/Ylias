import Logger from '@lilywonhalf/pretty-logger';
import { Bootstrap } from '#lib/Bootstrap';
import { ApplicationCommandRegistries, RegisterBehavior } from '@sapphire/framework';

Logger.info('Booting up application...');

ApplicationCommandRegistries.setDefaultBehaviorWhenNotIdentical(RegisterBehavior.BulkOverwrite);

const bootstrap = new Bootstrap();

bootstrap.initializeIntents();
bootstrap.initializeClient();

Logger.info('Application initialized');
Logger.info('Logging in...');

bootstrap.login();
