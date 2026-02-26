const tseslint = require('typescript-eslint');
const jsdoc = require('eslint-plugin-jsdoc');
const jest = require('eslint-plugin-jest');
const stylistic = require('@stylistic/eslint-plugin');

module.exports = tseslint.config(
    {
        ignores: ['dist/**', 'node_modules/**'],
    },
    ...tseslint.configs.recommended,
    {
        files: ['src/**/*.ts', 'tests/**/*.ts'],
        plugins: {
            jsdoc,
            '@stylistic': stylistic,
        },
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: __dirname,
            },
        },
        rules: {
            'prefer-destructuring': 'warn',
            'require-unicode-regexp': 'warn',
            'no-trailing-spaces': 'warn',
            'curly': ['error', 'all'],
            'padded-blocks': ['error', 'never', { 'allowSingleLineBlocks': false }],
            'indent': ['error', 4, { 'SwitchCase': 1 }],
            'no-multi-spaces': ['error'],
            'object-curly-spacing': ['error', 'always'],
            'array-bracket-spacing': ['error', 'never'],
            'brace-style': ['error', '1tbs'],
            'max-len': ['error', { 'code': 120, 'ignoreStrings': true, 'ignoreTemplateLiterals': true }],

            '@stylistic/comma-dangle': ['error', {
                'arrays': 'always-multiline',
                'objects': 'always-multiline',
                'imports': 'never',
                'exports': 'never',
                'functions': 'never',
            }],
            '@stylistic/quotes': ['error', 'single', { 'allowTemplateLiterals': 'always' }],
            '@stylistic/lines-between-class-members': ['error', 'always', { 'exceptAfterSingleLine': true }],
            '@stylistic/padding-line-between-statements': [
                'error',
                { 'blankLine': 'always', 'prev': '*', 'next': 'return' },
                { 'blankLine': 'always', 'prev': ['const', 'let', 'var'], 'next': '*' },
                { 'blankLine': 'any', 'prev': ['const', 'let', 'var'], 'next': ['const', 'let', 'var'] },
                { 'blankLine': 'always', 'prev': 'directive', 'next': '*' },
                { 'blankLine': 'any', 'prev': 'directive', 'next': 'directive' },
                { 'blankLine': 'always', 'prev': ['case', 'default'], 'next': '*' },
                { 'blankLine': 'always', 'prev': ['block', 'if', 'for', 'try'], 'next': '*' },
                { 'blankLine': 'always', 'prev': '*', 'next': ['block', 'if', 'for', 'try'] },
            ],

            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-non-null-assertion': 'off',

            'jsdoc/check-access': 'warn',
            'jsdoc/check-alignment': 'warn',
            'jsdoc/check-line-alignment': 'warn',
            'jsdoc/check-param-names': 'warn',
            'jsdoc/check-property-names': 'warn',
            'jsdoc/check-syntax': 'warn',
            'jsdoc/check-tag-names': 'warn',
            'jsdoc/check-types': 'warn',
            'jsdoc/check-values': 'warn',
            'jsdoc/empty-tags': 'warn',
            'jsdoc/implements-on-classes': 'warn',
            'jsdoc/match-description': 'warn',
            'jsdoc/tag-lines': 'warn',
            'jsdoc/no-bad-blocks': 'warn',
            'jsdoc/no-defaults': 'warn',
            'jsdoc/require-param': 'warn',
            'jsdoc/require-param-name': 'warn',
            'jsdoc/require-param-type': 'warn',
            'jsdoc/require-property': 'warn',
            'jsdoc/require-property-name': 'warn',
            'jsdoc/require-property-type': 'warn',
            'jsdoc/require-returns': 'warn',
            'jsdoc/require-returns-check': 'warn',
            'jsdoc/require-returns-type': 'warn',
            'jsdoc/require-yields': 'warn',
            'jsdoc/valid-types': 'warn',
        },
    },
    {
        files: ['tests/**/*.ts'],
        ...jest.configs['flat/recommended'],
    },
);
