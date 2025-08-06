const { FlatCompat } = require('@eslint/eslintrc')
const js = require('@eslint/js')
const path = require('path')
const globals = require('globals')

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
})

module.exports = [
  {
    ignores: [
      'node_modules/',
      'packages/frontend/src/graphql/index.tsx',
      'packages/api/src/graphql.ts',
      'packages/db-migration/**',
      '**/lib/**',
      '**/dist/**',
    ],
  },

  {
    settings: {
      react: { version: 'detect' },
    },
  },

  // Extend old configs
  ...compat.extends(
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier'
  ),

  // Set parser and parserOptions for TS files
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: require('@typescript-eslint/parser'),
      parserOptions: {
        project: [path.resolve(__dirname, 'tsconfig.eslint.json')],
        tsconfigRootDir: __dirname,
        sourceType: 'module',
      },
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
    },
    rules: {
      '@typescript-eslint/ban-types': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          varsIgnorePattern: '^_',
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-use-before-define': 'off',
      'react/display-name': 'off',
      'react/prop-types': 'off',
    },
  },

  //Set globals for js files
  {
    files: ['**/*.js', 'scripts/**/*.js', '*.config.js', '.eslintrc.js'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
      },
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          varsIgnorePattern: '^_',
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
  },

  // React plugin specific settings for JSX/TSX files
  {
    files: ['**/*.tsx', '**/*.jsx'],
    plugins: {
      react: require('eslint-plugin-react'),
      'react-hooks': require('eslint-plugin-react-hooks'),
    },
  },

  //backend and components package rule override
  {
    files: ['packages/backend/**/*.{ts,tsx,js,jsx}', 'packages/components/**/*.{ts,tsx,js,jsx}'],
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'off',
      'react/prop-types': 'off',
    },
  },
]
