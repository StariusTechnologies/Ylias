import path from 'path';
import { Bootstrap } from '#lib/Bootstrap';

const devDotEnvPath = path.join(__dirname, '..', '..', '..', '.env');
const bootstrap = new Bootstrap({ dotEnvPath: devDotEnvPath });

describe('Testing the Bootstrap class', () => {
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
