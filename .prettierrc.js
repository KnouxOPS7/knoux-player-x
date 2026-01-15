/**
 * ================================================================================
 * KNOUX Player X
 * ================================================================================
 * Project: KNOUX Player X
 * File: C:\Users\Aisha\Downloads\knox-player-x\.prettierrc.js
 * Role: Prettier Configuration for Automated Code Formatting
 * Layer: Core
 * Author: SADEK ELGAZAR (KNOUX)
 * Status: FINALIZED
 * ================================================================================
 * 
 * This configuration ensures consistent, premium code formatting across all
 * project files with cinematic intelligence aesthetics:
 * 
 * - Consistent indentation and spacing
 * - Automated line wrapping at optimal lengths
 * - Unified quote and semicolon usage
 * - Harmonized object and array formatting
 * - Balanced bracket and operator spacing
 * - Cross-platform newline normalization
 * - Unicode and emoji-aware formatting
 * - Performance-optimized processing
 * - Editor integration compatibility
 * - Team collaboration consistency
 */

module.exports = {
  // Basic formatting
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  quoteProps: 'as-needed',
  jsxSingleQuote: false,
  trailingComma: 'es5',
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'avoid',
  
  // Special language handling
  rangeStart: 0,
  rangeEnd: Infinity,
  
  // Parser preferences
  parser: 'typescript',
  
  // File-specific overrides
  overrides: [
    {
      files: '*.json',
      options: {
        parser: 'json'
      }
    },
    {
      files: '*.md',
      options: {
        parser: 'markdown',
        proseWrap: 'preserve'
      }
    },
    {
      files: '*.yaml',
      options: {
        parser: 'yaml'
      }
    },
    {
      files: '*.html',
      options: {
        parser: 'html'
      }
    },
    {
      files: '*.css',
      options: {
        parser: 'css'
      }
    },
    {
      files: '*.scss',
      options: {
        parser: 'scss'
      }
    },
    {
      files: '*.graphql',
      options: {
        parser: 'graphql'
      }
    },
    {
      files: '*.vue',
      options: {
        parser: 'vue'
      }
    }
  ],
  
  // Editor integration
  insertPragma: false,
  requirePragma: false,
  
  // Special handling
  proseWrap: 'preserve',
  htmlWhitespaceSensitivity: 'css',
  vueIndentScriptAndStyle: false,
  
  // Line endings
  endOfLine: 'lf',
  
  // Embedded language formatting
  embeddedLanguageFormatting: 'auto',
  
  // JSX-specific
  singleAttributePerLine: false,
  
  // Experimental
  experimentalTernaries: false
};