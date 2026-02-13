import { defineConfig } from 'unocss'

export default defineConfig({
  shortcuts: [
    // 添加自定义快捷方式
    ['flex-center', 'flex justify-center items-center'],
    ['flex-x-center', 'flex justify-center'],
    ['flex-y-center', 'flex items-center'],
    ['flex-1-hidden', 'flex-1 overflow-hidden'],
  ],
  // rules: [
  // ],
})
