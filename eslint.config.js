import { createConfigForNuxt } from '@nuxt/eslint-config/flat'

export default createConfigForNuxt()
  .prepend({
      rules: {
        'function-paren-newline': ['error', { 'minItems': 2 }],
        'function-call-argument-newline': ['error', 'always'],
        'import/order': ['error', {
          'groups': [['builtin', 'external', 'internal']],
          'pathGroupsExcludedImportTypes': ['builtin'],
          'newlines-between': 'always',
          'alphabetize': {
            'order': 'asc',
            'caseInsensitive': true
          },
        }],
        'import/newline-after-import': 'error',
        'object-curly-spacing': ['error', 'always'],
        'object-curly-newline': ['error', {
          'ObjectExpression': {
            'multiline': true,
            'minProperties': 2
          },
          'ObjectPattern': {
            'multiline': true,
            'minProperties': 2
          },
          'ImportDeclaration': {
            'multiline': true,
            'minProperties': 2
          },
          'ExportDeclaration': {
            'multiline': true,
            'minProperties': 2
          },
        }],
        'object-property-newline': ['error', { 'allowAllPropertiesOnSameLine': false }],
        'quotes': ['error', 'single'],
      }
    })
  .override(
    'nuxt/typescript/rules',
    {
      rules: {
        '@typescript-eslint/ban-types': 'off',
        'no-prototype-builtins': 'off',
      }
    }
  )