import { InteractionManager } from '#root/models/InteractionManager';
import { messageButtonData } from '#mocks/MockInstances';

const interactionManager = new InteractionManager();

describe('Testing the InteractionManager class', () => {
    test('Is correctly formed', () => {
        expect(typeof InteractionManager).toBe('function');
        expect(typeof interactionManager.hasListeners).toBe('function');
        expect(typeof interactionManager.getButton).toBe('function');
        expect(typeof interactionManager.removeMessageComponentFromMessage).toBe('function');
    });

    test('Returns the correct values', () => {
        const messageButton = interactionManager.getButton(messageButtonData);
        const [callback] = interactionManager.listeners(messageButtonData.id);

        expect(typeof messageButton).toBe('object');
        expect(messageButton.customId).toBe(messageButtonData.id);
        expect(messageButton.style).toBe(messageButtonData.style);
        expect(messageButton.label).toBe(messageButtonData.label);
        expect(typeof callback).toBe('function');

        expect(typeof interactionManager.hasListeners(messageButtonData.id)).toBe('boolean');
    });
});
