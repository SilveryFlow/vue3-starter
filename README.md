# Vue3 + Vite 7 项目模板

这是一个基于 Vue 3.5 + Vite 7 (Rolldown) 的现代化前端项目模板，集成了当前主流的技术栈和最佳实践。

## 特性

### 核心技术栈
- **Vue 3.5**: 使用 Composition API 和 `<script setup>` 语法。
- **Vite 7**: 下一代前端构建工具，开启 Rolldown 引擎。
- **Pinia**: 官方推荐的状态管理库。
- **Vue Router**: 路由管理。
- **Element Plus**: 基于 Vue 3 的组件库，已配置按需导入。
- **UnoCSS**: 即时原子化 CSS 引擎。
- **ECharts 6**: 配合 `vue-echarts` 实现数据可视化。

### 工程化配置
- **自动导入**:
  - `unplugin-auto-import`: 自动导入 Vue、Vue Router、Pinia、VueUse 等 API。
  - `unplugin-vue-components`: 自动导入 Element Plus 组件、ECharts 图表组件。
  - `unplugin-icons`: 自动导入 Iconify 图表（支持 Element Plus 图标集 `i-ep-*`）。
- **样式系统**:
  - SCSS 预处理器，配置了自动注入全局变量。
  - Normalize.css 重置样式。
  - 字体文件自动分割与优化加载 (`cn-font-split`, `vite-plugin-font`)。
- **构建优化**:
  - 图片压缩 (`vite-plugin-image-optimizer`)。
  - Gzip/Brotli 压缩 (`vite-plugin-compression2`)。
  - 智能分包策略 (`framework`, `echarts`, `element-plus` 等独立分包)。
- **代码规范**:
  - ESLint (Flat Config) + Oxlint (极速 Lint) + Prettier。
  - Git Hooks (尚未配置 husky，但脚本已就绪)。

### 工具库
- **Axios**: 二次封装的请求工具，支持拦截器、取消请求、错误处理。
- **VueUse**: 强大的 Vue 组合式工具集。

## 🚀 快速开始

### 环境要求
- Node.js 20.19+ 或 22.12+ (推荐使用 LTS 版本)
- 推荐使用 Bun 作为包管理器 (也可使用 npm/pnpm)

### 安装依赖

```bash
# 使用 Bun (推荐)
bun install

# 或使用 npm
npm install
```

### 启动开发服务器

```bash
bun dev
# 或
npm run dev
```

访问 http://localhost:5173 即可看到项目。

### 生产构建

```bash
bun run build
# 或
npm run build
```

构建产物位于 `dist/` 目录。

### 预览生产构建

```bash
bun preview
# 或
npm run preview
```

### 代码检查与格式化

```bash
# 运行 Lint (包含 Oxlint 和 ESLint)
npm run lint

# 仅运行 Oxlint (快速检查)
npm run lint:oxlint

# 格式化代码
npm run format
```

## 📂 目录结构

```
src/
├── api/             # 接口请求层
├── assets/          # 静态资源
│   ├── fonts/       # 字体文件
│   └── styles/      # 样式文件 (index.scss, variables.scss)
├── components/      # 公共组件 (自动注册)
├── config/          # 全局配置
├── directives/      # 自定义指令
├── router/          # 路由配置
├── stores/          # Pinia 状态管理
├── types/           # TypeScript 类型定义
├── utils/           # 工具函数 (request.js, fontSplitImport.js 等)
├── views/           # 页面视图
├── App.vue          # 根组件
└── main.js          # 入口文件
```

## 🛠️ 配置说明

### 环境变量
项目根目录支持 `.env` 文件配置：
```env
VITE_PORT=5173
VITE_BASE_API=/api              # HTTP 接口前缀
VITE_WEBSOCKET_BASE_API=/ws     # WebSocket 接口前缀
```

### 自动导入使用示例

**Vue API** (无需 import):
```javascript
const count = ref(0)
const router = useRouter()
```

**组件** (无需 import):
```vue
<template>
  <el-button type="primary">按钮</el-button>
  <hello-world />
</template>
```

**图标** (无需 import):
```vue
<template>
  <!-- 使用 Element Plus 图标 -->
  <i-ep-search />
  <i-ep-edit />
</template>
```

**ECharts** (无需 import):
```vue
<template>
  <v-chart :option="chartOption" autoresize />
</template>
```

### 请求封装
使用 `src/utils/request.js` 进行 API 请求：
```javascript
import request from '@/utils/request'

export function getUserInfo() {
  return request({
    url: '/user/info',
    method: 'get'
  })
}
```

## 📦 依赖列表

| 依赖 | 说明 |
| --- | --- |
| `vue` | ^3.5.25 |
| `vite` | ^8.0.0-beta.1 |
| `element-plus` | ^2.12.0 |
| `pinia` | ^3.0.4 |
| `vue-router` | ^4.6.4 |
| `echarts` | ^6.0.0 |
| `unocss` | ^66.5.10 |
| `axios` | ^1.13.2 |

## 📄 License

MIT
