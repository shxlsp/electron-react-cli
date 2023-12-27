module.exports = {
  extends: ['alloy', 'alloy/react', 'alloy/typescript'],
  parser: '@typescript-eslint/parser',
  plugins: ['prettier', 'react-hooks'],
  root: true,
  settings: {
    react: {
      version: 'detect',
    },
  },
  globals: {
    JSX: true,
    React: true,
  },
  rules: {
    // 自定义你的规则
    '@typescript-eslint/explicit-member-accessibility': 'off',
    '@typescript-eslint/no-require-imports': 'off',
    'prettier/prettier': 'error',
    'react-hooks/rules-of-hooks': 'error', // 检查 Hook 的规则
    'react-hooks/exhaustive-deps': 'error', // 检查 effect 的依赖
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'react/no-unknown-property': ['error', { ignore: ['clstag'] }],
  },
};
