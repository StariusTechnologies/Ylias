import type { Config } from '@jest/types';

export default async (): Promise<Config.InitialOptions> => ({
    coverageProvider: 'v8',
    displayName: 'unit test',
    testEnvironment: 'node',
    testMatch: ['<rootDir>/tests/**/*.test.ts'],
    transform: {
        '^.+\\.ts$': ['ts-jest', { tsconfig: 'tests/tsconfig.json' }],
    },
    moduleNameMapper: {
        '^#mocks/(.*)$': '<rootDir>/tests/mocks/$1',
        '^#root/(.*)$': '<rootDir>/src/$1',
        '^#lib/(.*)$': '<rootDir>/src/lib/$1',
    },
    setupFilesAfterEnv: ['<rootDir>/tests/jest.setup.ts'],
    collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
    coveragePathIgnorePatterns: [],
});
