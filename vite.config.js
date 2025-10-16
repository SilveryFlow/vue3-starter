import { fileURLToPath, URL } from 'node:url'
import process from 'node:process'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import viteCompression from 'vite-plugin-compression'
import viteRestart from 'vite-plugin-restart'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import legacy from '@vitejs/plugin-legacy'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const port = env.VITE_PORT || 5173
  const API_BASE = env.VITE_BASE_API || '/api'
  const WS_BASE = env.VITE_WEBSOCKET_BASE_API || '/ws'
  return {
    css: {
      devSourcemap: true,
    },
    plugins: [
      vue(),
      vueDevTools(),
      viteCompression(),
      viteCompression({
        algorithm: 'brotliCompress',
        ext: '.br',
      }),
      viteRestart({
        restart: ['.env', 'vite.config.[jt]s', 'src/config/**/*'],
      }),
      AutoImport({
        imports: [
          'vue',
          'vue-router',
          'pinia',
          '@vueuse/core',
          { '@vueuse/router': ['useRouteHash', 'useRouteQuery', 'useRouteParams'] },
        ],
        resolvers: [ElementPlusResolver()],
        dts: 'src/types/auto-imports.d.ts',
        eslintrc: {
          enabled: true,
        },
      }),
      Components({
        resolvers: [ElementPlusResolver({ importStyle: 'sass' })],
      }),
      legacy({
        targets: ['defaults', 'not IE 11'],
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      host: '0.0.0.0', // 局域网访问
      port,
      open: true, // 启动自动打开浏览器
      proxy: {
        // HTTP API 代理
        [API_BASE]: {
          target: 'http://192.168.0.100:8080', // 后端接口地址
          changeOrigin: true,
          rewrite: (path) => path.replace(new RegExp(`^${API_BASE}`), ''),
        },

        // WebSocket 代理
        [WS_BASE]: {
          target: 'ws://192.168.0.100:8080', // WebSocket 地址
          changeOrigin: true,
          ws: true, // 开启 websocket 代理
          logLevel: 'debug',
          rewrite: (path) => path.replace(new RegExp(`^${WS_BASE}`), ''),
        },
      },
    },

    build: {
      rolldownOptions: {
        advancedChunks: {
          groups: [
            {
              name: 'vue-vendor',
              test: /\/node_modules\/(vue|@vue\/runtime-core|@vue\/reactivity)/,
            },
            { name: 'vue-router-vendor', test: /\/node_modules\/vue-router/ },
            { name: 'echarts-vendor', test: /\/node_modules\/echarts/ },
            { name: 'element-plus-vendor', test: /\/node_modules\/element-plus/ },
            { name: 'three-vendor', test: /\/node_modules\/three/ },
          ],
        },
      },
    },
  }
})
