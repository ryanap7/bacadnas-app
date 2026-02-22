module.exports = {
    extends: ['expo/node_modules/eslint-config-expo', 'plugin:expo/recommended'],
    plugins: ['expo'],
    parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true,
        },
    },
    rules: {
        'no-console': 'warn',
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
        'react-hooks/exhaustive-deps': 'warn',
        'react-hooks/rules-of-hooks': 'error',
        'import/order': [
            'warn',
            {
                groups: [['builtin', 'external'], ['internal'], ['parent', 'sibling', 'index']],
                'newlines-between': 'always',
            },
        ],
    },
    settings: {
        'import/resolver': {
            node: { extensions: ['.ts', '.tsx', '.js', '.jsx'] },
        },
    },
};
