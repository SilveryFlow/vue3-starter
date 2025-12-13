// 自动扫描当前目录下所有指令文件并立即导入
const modules = import.meta.glob('./*.js', { eager: true })

export default {
  install(app) {
    for (const [path, module] of Object.entries(modules)) {
      if (path.includes('index.js')) continue // 跳过 index.js

      // 指令名取文件名去掉后缀
      const name = path.split('/').pop().replace('.js', '')
      // 支持默认导出或命名导出 vName 或 name
      const directive = module.default || module[`v${capitalize(name)}`] || module[name]

      if (!directive) continue

      app.directive(name, directive)
    }
  },
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
