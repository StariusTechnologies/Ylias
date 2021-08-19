import { InteractionManager } from '#root/models/InteractionManager';
import { messageButtonData } from '#mocks/MockInstances';

const interactionManager: InteractionManager = new InteractionManager();

describe('Testing the InteractionManager class', () => {
    test('Is correctly formed', () => {
        expect(typeof InteractionManager).toBe('object');
        expect(typeof InteractionManager.hasListeners).toBe('function');
        expect(typeof InteractionManager.getButton).toBe('function');
        expect(typeof InteractionManager.removeMessageComponentFromMessage).toBe('function');
    });

    test('Returns the correct values', () => {
        const messageButton = interactionManager.getButton(messageButtonData);
        const [callback] = interactionManager.listeners('testId');

        expect(typeof messageButton).toBe('MessageButton');
        expect(messageButton.id).toBe(messageButtonData.id);
        expect(messageButton.style).toBe(messageButtonData.style);
        expect(messageButton.label).toBe(messageButtonData.label);
        expect(callback()).toBe('testCallback');

        expect(typeof interactionManager.hasListeners()).toBe('boolean');
        expect(interactionManager.removeMessageComponentFromMessage()).toBeUndefined();
    });
});
