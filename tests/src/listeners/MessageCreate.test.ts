import Ready from '#root/listeners/Ready';
import { getPieceContext } from '#mocks/MockInstances';

const readyListener = new Ready(getPieceContext('listeners/MessageCreate.ts'));

describe('Testing the MessageCreate event listener', () => {
    test('Is correctly formed', () => {
        expect(typeof readyListener).toBe('object');
        expect(typeof readyListener.run).toBe('function');
    });
});
