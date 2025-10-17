import { fileURLToPath, URL } from 'node:url'
import process from 'node:process'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { compression } from 'vite-plugin-compression2'
import viteRestart from 'vite-plugin-restart'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const port = Number(env.VITE_PORT) || 5173
  const API_BASE = env.VITE_BASE_API || '/api'
  const WS_BASE = env.VITE_WEBSOCKET_BASE_API || '/ws'
  return {
    css: {
      devSourcemap: true,
      preprocessorOptions: {
        scss: {
          // 自动注入全局样式变量（如需要可启用）
          // additionalData: `@use "@/assets/styles/variables.scss" as *;`,
        },
      },
    },
    optimizeDeps: {
      include: [
        'vue',
        'vue-router',
        'pinia',
        '@vueuse/core',
        'element-plus',
        'axios',
        'echarts',
        'three',
      ],
      exclude: ['vue-demi'],
    },
    plugins: [
      vue(),
      vueDevTools(),
      compression(),
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
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      host: '0.0.0.0', // 局域网访问
      port,
      open: true,
      // 预热常用文件，提升首屏加载速度
      warmup: {
        clientFiles: ['./src/main.js', './src/App.vue', './src/router/index.js'],
      },
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
        output: {
          // 静态资源分类打包
          chunkFileNames: 'js/[name]-[hash].js',
          entryFileNames: 'js/[name]-[hash].js',

          assetFileNames: (assetInfo) => {
            const name = assetInfo?.name || assetInfo?.names?.[0] || ''
            if (!name) return 'assets/[name]-[hash][extname]'

            // 根据文件类型分类存放
            if (name.endsWith('.css')) {
              return 'css/[name]-[hash][extname]'
            }
            if (/\.(png|jpe?g|gif|svg|webp|ico)$/.test(name)) {
              return 'images/[name]-[hash][extname]'
            }
            if (/\.(woff2?|eot|ttf|otf)$/.test(name)) {
              return 'fonts/[name]-[hash][extname]'
            }
            return 'assets/[name]-[hash][extname]'
          },
        },

        advancedChunks: {
          groups: [
            {
              // 核心框架：vue + vue-router + pinia 合并（体积小，一起更新）
              name: 'framework',
              test: /[\\/]node_modules[\\/](vue|@vue[\\/]|vue-router|pinia)/,
              priority: 20, // 高优先级，优先匹配
            },
            {
              // ECharts 单独分包
              name: 'echarts',
              test: /[\\/]node_modules[\\/]echarts/,
              priority: 15,
            },
            {
              // Element Plus 单独分包
              name: 'element-plus',
              test: /[\\/]node_modules[\\/]element-plus/,
              priority: 15,
            },
            {
              // Three.js 单独分包
              name: 'three',
              test: /[\\/]node_modules[\\/]three/,
              priority: 15,
            },
            {
              // 其他依赖统一打包（axios、@vueuse 等小型库）
              name: 'vendor',
              test: /[\\/]node_modules[\\/]/,
              priority: 10, // 最低优先级，兜底规则
            },
          ],
        },
      },
    },
  }
})
