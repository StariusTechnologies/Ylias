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
        '^#lib/(.*)$': '<rootDir>/src/lib/$1',
        '^#framework/(.*)$': '<rootDir>/src/lib/framework/$1',
    },
    setupFilesAfterEnv: ['<rootDir>/tests/jest.setup.ts'],
    collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
    coveragePathIgnorePatterns: [],
});
