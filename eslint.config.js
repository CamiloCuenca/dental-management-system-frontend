import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: { react: { version: '18.3' } },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      
      // Reglas personalizadas (ajustes para evitar tus errores)
      'react/prop-types': 'off',                   // Desactiva validación de PropTypes
      'no-unused-vars': 'warn',                    // Convierte vars no usadas en warnings
      'react/jsx-no-target-blank': 'off',          // Ya lo tenías desactivado
      'react/react-in-jsx-scope': 'off',           // No requiere import React en JSX
      'react-hooks/exhaustive-deps': 'warn',       // Dependencias de Hooks como warning
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
];