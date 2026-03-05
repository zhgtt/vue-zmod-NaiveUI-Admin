/// <reference types="vite/client" />

/**
 * 对 env 环境变量进行类型声明
 */
declare namespace Env {
  // 声明路由模式，只支持 history | hash
  type RouterHistoryMode = 'history' | 'hash'

  // 声明 Env.ImportMeta 类型
  interface ImportMeta {
    // 项目基础路径前缀
    readonly VITE_BASE_URL: string

    // 项目基础请求地址（一般是完整的项目的地址，包含端口号，分 测试/生产 环境）
    readonly VITE_API_BASE_URL: string

    // 本地 svg 图标的前缀
    readonly VITE_ICON_LOCAL_PREFIX: string

    // 路由模式
    readonly VITE_ROUTER_HISTORY_MODE?: RouterHistoryMode

    // 自行指定路由 / 的重定向路由路径，也就是对根路由 root 指定重定向路由路径，默认为 /home
    readonly VITE_ROOT_ROUTE_REDIRECT?: string

    // 选择全局的布局容器组件，默认为 base 布局，包含菜单等子组件；如果设置为 blank，只是一个空白页面
    readonly VITE_LAYOUT_COMPONENT?: 'base' | 'blank'

    // 是否需要动态菜单的实现逻辑，默认为 false
    // readonly VITE_IS_MENU_DYNAMIC?: boolean
  }
}

/**
 * 声明 import.meta 类型
 * NOTE 添加了 /// <reference types="vite/client" /> 并通过声明合并扩展了 ImportMetaEnv ，使其包含 Vite 内置变量（如 DEV , MODE ）以及自定义的 Env.ImportMeta 变量
 */
interface ImportMetaEnv extends Env.ImportMeta { }
