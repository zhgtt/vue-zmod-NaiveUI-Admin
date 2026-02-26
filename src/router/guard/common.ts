/**
 * 路由守卫，处理路由跳转的 进度条、浏览器标签页的 title 等
 */
import type { Router } from 'vue-router'

import { useTitle } from '@vueuse/core'

import { useLayoutStore, usePageTabsStore } from '@/store'

export function createCommonRouteGuard(router: Router) {
  /**
   * @description: 路由前置守卫，用于在 跳转到新路由前 执行逻辑 👇
   *
   * NOTE 函数的参数中如果有多个参数，但是只用到某几个，那么其他没有用到的可以用 _xx 来表示
   */
  router.beforeEach(async (_to, _from, next) => {
    // 开启进度条
    window.NProgress?.start()
    next()
  })

  /**
   * @description: 路由后置守卫，用于在 路由跳转完成后 执行逻辑 👇
   */
  router.afterEach((to) => {
    console.log('to: ', to)

    // 关闭进度条
    window.NProgress?.done()

    /**
     * @description: 1️⃣ 动态设置浏览器标题，支持国际化 👇
     */
    const { title: documentTitle } = to.meta
    if (documentTitle) {
      useTitle(documentTitle)
    }

    /**
     * @description: 2️⃣ 动态将当前路由页面添加到标签栏中 👇
     */
    // 获取布局配置
    const layoutStore = useLayoutStore()

    if (layoutStore.tabsConfig?.show === true) {
      // 默认都会添加标签页，除非明确设置为 false 或是特殊页面
      const shouldAddTab = to.meta?.showInTabs !== false
      // 定义一个立即执行函数
      shouldAddTab && (() => {
        const pageTabsStore = usePageTabsStore()
        pageTabsStore.addTab(to)
      })()
    }
  })
}
