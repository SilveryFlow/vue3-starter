# Vue3 项目

基于 Vue 3 + Vite 的项目

## 技术栈

- Vue 3.5（Composition API）
- Vite 7（rolldown-vite）
- Element Plus
- Pinia
- ECharts 6（配合 vue-echarts）
- Sass、Normalize.css

## 环境要求

- Node.js 20.19+ 或 22.12+
- 推荐包管理器：Bun（也可使用 npm/pnpm/yarn）

## 安装与运行

使用 Bun：

```bash
bun install
bun dev
```

使用 npm：

```bash
npm i
npm run dev
```

生产构建与预览：

```bash
# Bun
bun run build
bun preview

# 或 npm
npm run build
npm run preview
```

## 可用脚本

- dev: 启动开发服务器
- build: 生产构建
- preview: 预览生产构建
- lint: 运行所有 Lint（oxlint + eslint）
- lint:oxlint: 使用 oxlint（更快的 JS/TS 规则）
- lint:eslint: 使用 ESLint
- format: 使用 Prettier 格式化 `src/`

## 目录结构

```
src/
├── api/           # 接口请求
├── assets/        # 图片、字体、样式（全局样式在 assets/styles）
├── components/    # 通用组件
├── router/        # 路由
├── stores/        # Pinia 状态
├── utils/         # 工具方法（含 request.js、websocket.js）
└── views/         # 页面视图
```

## 环境变量

在项目根目录创建 `.env`（或 `.env.local`），支持以下变量：

```
VITE_PORT=5173
VITE_BASE_API=/api
VITE_WEBSOCKET_BASE_API=/ws
```

说明：

- `VITE_BASE_API` 与 `VITE_WEBSOCKET_BASE_API` 会用于开发代理（见 `vite.config.js`）。
- 生产环境请在网关或 Nginx 层配置反向代理。

## 开发说明

- 自动导入：已配置 `unplugin-auto-import` 与 `unplugin-vue-components`，Vue/Router/Pinia/API 与 Element Plus 组件可直接使用。
- 全局样式：在 `src/main.js` 中统一引入 `assets/styles` 下的样式。
- 图表：使用 ECharts 6 + vue-echarts，已内置组件解析器，直接在组件中使用图表组件即可。
- 代码风格：使用 ESLint、Oxlint 与 Prettier，提交前建议执行 `bun lint` 与 `bun format`。

### ECharts 使用说明（vue-echarts 按需）

- 已配置自动解析 `<v-chart>` 组件（`vite.config.js` 使用自定义 `VChartResolver`，来源 `vue-echarts`）。
- 采用按需引入，不做 ECharts 的全量导入；需在每个使用图表的组件内，按 `option` 中用到的图表类型与组件进行注册。

最小用例（柱状图）：

```vue
<template>
  <v-chart class="chart" :option="option" autoresize />
  <!-- 注意：v-chart 已自动可用，无需手动 import/注册组件 -->
  <!-- autoresize 建议开启，容器尺寸变化时自适应 -->
  <!-- 仅按需注册：BarChart、GridComponent、CanvasRenderer 与 option 对应 -->
</template>

<script setup>
import { ref } from 'vue'
import { use } from 'echarts/core'
import { BarChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

use([BarChart, GridComponent, TooltipComponent, LegendComponent, CanvasRenderer])

const option = ref({
  grid: { left: 20, right: 20, top: 20, bottom: 20 },
  tooltip: { trigger: 'axis' },
  legend: {},
  xAxis: { type: 'category', data: ['A', 'B', 'C'] },
  yAxis: { type: 'value' },
  series: [{ type: 'bar', data: [12, 20, 18] }],
})
</script>
```

要点说明：

- 使用 Vue ECharts（`vue-echarts`）渲染；会根据传入的 `option` 使用到的图表与组件来工作，但仍需先通过 `echarts/core` 的 `use([...])` 显式注册对应模块。
- 若 `option` 中使用了未注册的图表或组件，会出现报错或空白；按需补齐对应模块并重新注册即可。

### Element Plus 图标使用

本项目已在 `vite.config.js` 启用 `unplugin-icons`，并通过 `IconsResolver({ enabledCollections: ['ep'] })` 开启 Element Plus 图标集合，推荐直接使用 `i-ep-*` 组件，无需手动 import：

```vue
<template>
  <i-ep-search style="font-size: 18px; color: #409eff" />
</template>
```

在按钮中使用（无需 `ElIcon` 包裹）：

```vue
<template>
  <el-button type="primary">
    <i-ep-upload style="margin-right: 6px" />
    上传
  </el-button>
  <el-button> <i-ep-delete /> 删除 </el-button>
  <el-button text> <i-ep-arrow-right /> 下一步 </el-button>

  <!-- 尺寸与颜色可通过行内样式或类名控制 -->
  <i-ep-warning class="icon--warn" />

  <!-- 建议：使用 CSS 统一管理图标尺寸/颜色 -->
  <!-- .icon--warn { font-size: 16px; color: #e6a23c; } -->

  <!-- 注意：`i-ep-*` 已是组件，无需额外包裹 <el-icon> -->
  <!-- <el-icon><i-ep-search /></el-icon> 不是必需的 -->

  <!-- 也可使用“传统导入”方式（可选）： -->
  <!--
  <script setup>
  import { Search, Upload } from '@element-plus/icons-vue'
  </script>
  <el-icon><Search /></el-icon>
  <el-icon><Upload /></el-icon>
  -->
</template>
```

常见问题：若 `i-ep-*` 组件未解析，请确认依赖已安装并重启开发服务器。

## 路由约定

- `/screen` 大屏视图（如年方式、供应链）
- `/control` 控制台（如日调度、月计划、年方式、供应链）

实际路由请参考 `src/router/index.js` 与各视图目录。

## 开发代理与接口

开发环境已在 `vite.config.js` 中配置代理：

- HTTP 接口代理到 `VITE_BASE_API` 对应的后端地址
- WebSocket 代理到 `VITE_WEBSOCKET_BASE_API` 对应的后端地址

如需变更后端地址，请调整 `vite.config.js` 或在 `.env` 中覆盖变量。

## 构建与产物

- 产物位于 `dist/`，按类型分类输出：`js/`、`css/`、`images/`、`fonts/`。
- 已启用压缩插件，默认生成 `.gz` 与 `.br` 文件。
- 采用分包策略（framework/echarts/element-plus/three/vendor）以提升缓存与加载效率。

部署建议：将 `dist/` 发布到任意静态服务器；如需二级路径，请在 Vite 配置中设置 `base`。

## 常见问题

- 端口被占用：修改 `.env` 中的 `VITE_PORT`。
- 组件未找到类型：删除 `src/types` 下 d.ts 后重新启动开发服务器，让自动导入重新生成。
- 样式不生效：确认已安装 `sass-embedded`，并保持与 Node 版本兼容。

---

如需补充业务文档或约定，请在本文件下继续追加章节。
