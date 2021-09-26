import path from 'path';
import { Bootstrap } from '#lib/Bootstrap';
import { config as configureEnvironment } from 'dotenv';

const prodDotEnvPath = path.join(__dirname, '..', '..', '..', 'prod.env');
const devDotEnvPath = path.join(__dirname, '..', '..', '..', '.env');

configureEnvironment({ path: prodDotEnvPath });

const prodToken = process.env.TOKEN;

delete process.env.TOKEN;

const bootstrap = new Bootstrap({ dotEnvPath: devDotEnvPath });
const devToken = process.env.TOKEN;

describe('Testing the Bootstrap class', () => {
    test('Different tokens for dev and prod environments', () => {
        expect(prodToken).not.toEqual(devToken);
    });

    test('Is correctly formed', () => {
        expect(typeof bootstrap).toBe('object');
        expect(typeof bootstrap.initializeIntents).toBe('function');
        expect(typeof bootstrap.initializeClient).toBe('function');
        expect(typeof bootstrap.login).toBe('function');
    });

    test('Returns the correct values', () => {
        expect(bootstrap.initializeIntents()).toBeUndefined();
        expect(bootstrap.initializeClient()).toBeUndefined();
    });
});
