import path from 'node:path'
import fs from 'node:fs'

import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import pluginOxlint from 'eslint-plugin-oxlint'
import unocss from '@unocss/eslint-config/flat'

// 读取 unplugin-auto-import 生成的 ESLint globals
const autoImportGlobalsPath = path.resolve('./.eslintrc-auto-import.json')
let autoImportGlobals = {}
if (fs.existsSync(autoImportGlobalsPath)) {
  autoImportGlobals = JSON.parse(fs.readFileSync(autoImportGlobalsPath, 'utf-8')).globals || {}
}

export default defineConfig([
  {
    name: 'app/files-to-lint',
    files: ['**/*.{js,mjs,jsx,vue}'],
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...autoImportGlobals,
      },
    },
  },

  unocss,

  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],

  ...pluginOxlint.buildFromOxlintConfigFile('.oxlintrc.json'),
])
