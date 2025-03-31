import { FlatCompat } from '@eslint/eslintrc';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: { plugins: [] }, 
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
      'react/no-unescaped-entities': 'warn', // 将未转义实体的错误降级为警告
      
      // TypeScript 相关规则
      '@typescript-eslint/no-explicit-any': 'warn', // 降低为警告级别
      '@typescript-eslint/explicit-module-boundary-types': 0,
      '@typescript-eslint/no-unused-vars': [
        'warn', 
        { 
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_'
        }
      ],
      '@typescript-eslint/no-use-before-define': 'warn', // 降级为警告
      
      // 其他规则
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-param-reassign': ['warn', { props: false }],
      'max-len': ['warn', { 
        code: 150, // 增加最大行长度
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreRegExpLiterals: true,
        ignoreComments: true 
      }],
      'no-underscore-dangle': 0,
      'no-use-before-define': 0,
      'no-unused-vars': ['warn', { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_'
      }],
      'no-shadow': 'warn', // 降级为警告
      'no-plusplus': 'warn', // 降级为警告
      'no-nested-ternary': 'warn', // 降级为警告
      'no-await-in-loop': 'warn', // 降级为警告
      'no-void': 'warn', // 降级为警告
      'no-promise-executor-return': 'warn', // 降级为警告
      'no-undef': 'error', // 保持未定义变量为错误，这是潜在的运行时错误
      'camelcase': 'warn', // 降级为警告
      'no-dupe-keys': 'error', // 保持重复键为错误，这可能导致意外行为
      
      // React Hooks 规则
      'react-hooks/rules-of-hooks': 'error', // 这是一个关键规则，保持为错误
      'react-hooks/exhaustive-deps': 'warn',
      
      // 解决Next.js Image组件问题的规则
      '@next/next/no-img-element': 'off', // 禁用img标签检查
    },
  },
];