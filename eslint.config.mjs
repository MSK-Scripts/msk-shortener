import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname  = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  // ─── Ignore ──────────────────────────────────────────────────
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'public/**',
      '*.config.js',
      '*.config.mjs',
      '*.config.ts',
      'next-env.d.ts',
      'out/**',
      'build/**',
    ],
  },

  // ─── Next.js + TypeScript Regeln ─────────────────────────────
  ...compat.extends('next/core-web-vitals', 'next/typescript'),

  // ─── Custom Overrides ────────────────────────────────────────
  {
    rules: {
      // any[] casts in db.ts sind bewusst gesetzt
      '@typescript-eslint/no-explicit-any': 'warn',
      // Ungenutzte Variablen erlauben wenn mit _ präfixiert
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern:   '^_',
          varsIgnorePattern:   '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
  },
]

export default eslintConfig
