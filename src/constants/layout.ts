/**
 * @description: 布局相关的常量配置（默认配置，可自行修改）
 */

import type { RouteComponent } from 'vue-router'

import BaseLayout from '@/layouts/base-layout/index.vue'
import BlankLayout from '@/layouts/blank-layout/index.vue'

/**
 * @description: 1️⃣ 根据路由定义页面的布局组件 👇
 */
export const pageLayouts: Record<APP.Layout.Types, RouteComponent | (() => Promise<RouteComponent>)> = {
  base: BaseLayout,
  blank: BlankLayout,
} as const // ? @类型解释: 添加 as const 确保类型不可变

// 2️⃣ 默认布局配置
export const defaultLayoutConfig: APP.Layout.LayoutConfig = {
  navMode: 'side', // 布局模式
}

// 2️⃣ 默认顶部栏配置
export const defaultHeaderConfig: APP.Layout.HeaderConfig = {
  height: 60,
  title: 'ZMod-Admin',
  showBreadcrumb: true,
}

// 3️⃣ 默认侧边栏配置
export const defaultSidebarConfig: APP.Layout.SidebarConfig = {
  width: 260,
  collapsedWidth: 90, // 折叠宽度
}

// 4️⃣ 默认标签栏配置
export const defaultTabsConfig: APP.Layout.TabsConfig = {
  show: true, // 是否显示
  height: 50,
}

// 5️⃣ 默认页脚配置
export const defaultFooterConfig: APP.Layout.FooterConfig = {
  // show: true,
  // fixed: false,
  height: 50,
}

// 6️⃣ 默认主题配置
// const defaultThemeConfig: APP.Layout.ThemeConfig = {
//   darkMode: false,
//   primaryColor: '#18a058',
//   contentWidth: 'fluid',
//   navMode: 'side',
// }
