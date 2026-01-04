// PingFang SC
import { css as PingFangSCRegular } from '@/assets/fonts/PingFang SC Regular.woff2'

export const fonts = {
  PingFangSCRegular,
}

/* 注册为全局css变量 */
for (const [name, font] of Object.entries(fonts)) {
  document.documentElement.style.setProperty(`--font-${name}`, font.family)
}

export default fonts
