import fs from 'node:fs'
import path from 'node:path'

/**
 * 获取 Element Plus 全局组件名
 * @param dtsPath global.d.ts 文件路径，可选，默认 node_modules/element-plus/global.d.ts
 * @returns 组件名数组
 */
export const getElementPlusNames = (dtsPath = 'node_modules/element-plus/global.d.ts') => {
  const globalDtsPath = path.resolve(dtsPath)

  if (!fs.existsSync(globalDtsPath)) {
    return []
  }

  const content = fs.readFileSync(globalDtsPath, 'utf-8')

  return Array.from(content.matchAll(/^\s*(El\w+):/gm)).map((m) => m[1])
}
