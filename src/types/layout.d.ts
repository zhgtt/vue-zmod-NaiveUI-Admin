/**
 * 布局相关的类型定义
 */
declare namespace APP.Layout {
  // 布局类型
  type Types = 'base' | 'blank'

  // 顶部栏配置
  interface HeaderConfig {
    // 是否固定顶部
    fixed?: boolean

    // 顶部栏高度，默认为 60px
    height: number

    // 是否显示 logo
    showLogo?: boolean

    // 顶部栏标题
    title?: string

    // 是否显示面包屑（top、mixedSide 模式下不会显示）
    showBreadcrumb?: boolean
  }

  // 侧边栏配置
  interface SidebarConfig {
    // 侧边栏宽度（默认为 224px）
    width: number

    // 折叠后侧边栏宽度（默认为 64px）
    collapsedWidth: number
  }

  // 标签栏配置
  interface TabsConfig {
    // 是否显示
    show?: boolean

    // 是否固定标签栏
    fixed?: boolean

    // 标签栏高度
    height?: number
  }

  // 页脚配置
  interface FooterConfig {
    // 是否显示
    show?: boolean

    // 是否固定页脚
    fixed?: boolean

    // 页脚高度
    height: number
  }

  // 其他配置
  interface OtherConfig {
    // 是否显示返回顶部按钮
    showBackTop?: boolean

    // 是否显示设置抽屉
    showSettingDrawer?: boolean
  }

  // 布局配置类型
  interface LayoutConfig {
    // 内容区域宽度（固定宽度或者流式宽度）
    contentWidth?: 'fixed' | 'fluid'

    // 菜单折叠按钮的位置
    menuTogglePosition?: 'header' | 'sidebar'

    /**
     * 🍄 布局导航模式（菜单的位置）
     *
     * side - 侧边垂直（菜单都在侧边栏，侧边栏会遮挡顶部栏，默认情况）
     * mixedSide - 混合垂直（顶部为 一级菜单，其他层级的放在侧边，侧边栏不会遮挡顶部栏）
     * top - 顶部水平（菜单都在顶部栏）
     */
    navMode: 'side' | 'top' | 'mixedSide'
  }
}
