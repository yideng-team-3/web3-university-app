import { FlatCompat } from '@eslint/eslintrc';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: { plugins: {} },
});

// eslint-disable-next-line import/no-default-export
export default [
  ...compat.extends(
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'airbnb-base',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'next/core-web-vitals',
    'prettier'
  ),
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'public/**',
      'next.config.js',
      'tailwind.config.js',
      'postcss.config.js',
      'src/types/ethers-contracts/**'
    ],
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      // airbnb 规范相关配置
      'import/extensions': 0,
      'import/no-extraneous-dependencies': 0,
      'import/prefer-default-export': 0,
      'import/no-unresolved': 0, // TypeScript 处理这个
      
      // React 相关规则
      'react/react-in-jsx-scope': 0, // Next.js 不需要导入 React
      'react/jsx-filename-extension': [1, { extensions: ['.tsx', '.jsx'] }],
      'react/prop-types': 0, // 使用 TypeScript 类型替代
      'react/require-default-props': 0, // TypeScript 处理这个
      
      // TypeScript 相关规则
      '@typescript-eslint/no-explicit-any': 2, // 禁止使用 any 类型
      '@typescript-eslint/explicit-module-boundary-types': 0,
      '@typescript-eslint/no-unused-vars': [
        'error', 
        { 
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_'
        }
      ],
      
      // 其他规则
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-param-reassign': ['error', { props: false }],
      'max-len': ['error', { code: 120 }],
      'no-underscore-dangle': 0,
      'no-use-before-define': 0,
      '@typescript-eslint/no-use-before-define': ['error'],
      
      // React Hooks 规则
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
];