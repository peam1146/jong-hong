const { defineConfig } = require('eslint-define-config')

const config = defineConfig({
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint/eslint-plugin', 'unused-imports', 'simple-import-sort'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
  rules: {
    '@typescript-eslint/no-this-alias': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-namespace': 'off',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' },
    ],
    '@typescript-eslint/no-explicit-any': 'off',
    'unused-imports/no-unused-imports': 'error',
    'simple-import-sort/exports': 'error',
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          // Side effect imports.
          ['^\\u0000'],
          // React
          ['^react'],
          // Node.js builtins prefixed with `node:`.
          ['^node:'],
          // Absolute imports and other imports such as Vue-style `@/foo`.  Anything not matched in another group.
          ['^'],
          // Internal Packages. Things that start with a letter (or digit or underscore), or `@repo` followed by a letter.
          ['^@aqua?\\w'],
          // Internal aliases. Anything that starts with `~`.
          ['^~'],
          // Relative imports. Anything that starts with a dot.
          ['^\\.'],
          // Relative imports from outside. Anything that starts with a dot.
          ['^\\.\\.'],
        ],
      },
    ],
  },
  ignorePatterns: ['build'],
  overrides: [
    {
      files: ['*.js', '*.cjs'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
        'no-undef': 'off',
      },
    },
  ],
  settings: {
    react: { version: '18.2.0' },
  },
})

module.exports = config
