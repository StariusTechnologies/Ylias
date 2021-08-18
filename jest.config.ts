import type { Config } from '@jest/types';

export default async (): Promise<Config.InitialOptions> => ({
    coverageProvider: 'v8',
    displayName: 'unit test',
    testEnvironment: 'node',
    testRunner: 'jest-circus/runner',
    testMatch: ['<rootDir>/tests/**/*.test.ts'],
    moduleNameMapper: {
        '^#mocks/(.*)$': '<rootDir>/tests/mocks/$1',
        '^#root/(.*)$': '<rootDir>/src/$1',
    },
    setupFilesAfterEnv: ['<rootDir>/tests/jest.setup.ts'],
    collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
    coveragePathIgnorePatterns: [
        '<rootDir>/dist',
        '<rootDir>/src/listeners',
        '<rootDir>/src/models/framework',
        '<rootDir>/src/models/Emojis.ts',
        '<rootDir>/src/models/Emotion.ts',
        '<rootDir>/src/models/SlashCommandRegistrar.ts',
        '<rootDir>/src/slash-command-preconditions',
        '<rootDir>/src/slash-commands',
        '<rootDir>/src/command-registration.ts',
        '<rootDir>/src/index.ts',
    ],
});
