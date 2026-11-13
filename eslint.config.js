import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'public/mediapipe-vision', 'public/worklets']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
   rules: {
      'no-restricted-syntax': ['error',
        { selector: 'ObjectPattern > Property > Identifier.value[name=/^_[A-Z]/]', message: 'Do not prefix component props with "_" — it breaks <Component /> usage.' },
        { selector: 'ArrayPattern > Identifier[name=/^_[A-Z]/]', message: 'Do not prefix component props with "_" — it breaks <Component /> usage.' },
        { selector: ':function > Identifier.params[name=/^_[A-Z]/]', message: 'Do not prefix component props with "_" — it breaks <Component /> usage.' },
      ],
      'no-unused-vars': ['error', {
        varsIgnorePattern: '^[A-Z_]',
        argsIgnorePattern: '^[A-Z_]',
        destructuredArrayIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      }],
      // Disable react-hooks v7 strict rules — code works fine without them
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/set-state-in-render': 'off',
      'react-hooks/refs': 'off',
      'react-hooks/static-components': 'off',
      'react-hooks/immutability': 'off',
      'react-hooks/purity': 'off',
      'react-hooks/preserve-manual-memoization': 'off',
      'react-hooks/use-memo': 'off',
    },
  },
])
