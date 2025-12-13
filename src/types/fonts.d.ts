// // src/fonts.d.ts
/*
结合@/utils/fontSplitImport.js使用
vite-plugin-font的类型提示还不完善，需要手动声明
*/

// 声明所有 .woff2 文件导出结构
declare module '*.woff2' {
  /**
   * vite-plugin-font 导出的对象结构
   * 包含 family (字体名) 和其他属性
   */
  export const css: {
    family: string
    // 如果你还用到了其他属性，可以在这里补上，例如 weight, style 等
    [key: string]: any
  }
}

// 如果你还有 .ttf 或 .woff，照葫芦画瓢复制一份
declare module '*.ttf' {
  export const css: {
    family: string
    [key: string]: any
  }
}
