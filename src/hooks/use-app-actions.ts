/**
 * @description: 全局通用的系统 操作 Hooks
 * ? 包含：刷新页面、最大化/还原、新窗口打开
 */
import { useLayoutStore } from '@/store'

export function useAppActions() {
  const router = useRouter()
  const route = useRoute()

  const layoutStore = useLayoutStore()

  /**
   * @description: 1️⃣ 刷新页面
   * @param path - 路由路径，默认为当前页面路径
   * @param query - 路由参数，默认为当前页面参数
   */
  function reloadPage(path?: string, query?: Record<string, any>) {
    const targetPath = path || route.path
    const targetQuery = query || route.query

    // 使用带时间戳的方式强制刷新
    router.replace({
      path: targetPath,
      query: { ...targetQuery, _t: Date.now() },
    })
  }

  /**
   * @description: 2️⃣ 切换 内容区域 最大化/还原
   */
  function toggleMaximize() {
    layoutStore.toggleMaximize()
  }

  /**
   * @description: 3️⃣ 在新窗口打开页面
   * @param fullPath - 完整路径，默认为当前完整路径
   */
  function openInNewWindow(fullPath?: string) {
    const targetPath = fullPath || route.fullPath
    // NOTE router.resolve 是 Vue Router 提供的一个方法，用于 解析路由信息并生成完整的路由对象 ，而不进行实际的路由跳转
    const { href } = router.resolve(targetPath)

    window.open(href, '_blank')
  }

  return {
    reloadPage,
    toggleMaximize,
    openInNewWindow,
  }
}
