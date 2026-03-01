/**
 * 路由相关的类型定义
 */
import type { LocationQueryRaw } from 'vue-router'
import 'vue-router'

/**
 * @description: 自定义 RouteMeta 的类型，用于菜单转换的逻辑，覆盖 vue-router 中的 RouteMeta 类型
 */
declare module 'vue-router' {
  interface RouteMeta {
    // 当前路由的完整路径地址（会自动生成，可以忽略，一般不需要手动设置），也是对应菜单的跳转路径
    fullPath?: string

    // 🍄 当前路由页面 document 的标题，也是对应菜单/嵌套菜单（父级）的名称
    title?: string

    // NOTE 当前路由页面的参数，设置后，会自动携带该参数
    // * 1. query 参数在路由初始时默认是没有的，如果要配置，需要在页面中的 definePage 中的 meta 对象中设置
    // * 2. 在路由转换菜单时，已经将 meta.query 的值带入到转换后的菜单对象中
    // * 3. 菜单：点击进行路由跳转时，如果设置了 query 参数，则会自动带入到地址栏中
    // * 4. 面包屑：由于数据是从菜单数据中转换的，所以有 query，也会被带入到地址栏中，面包屑的跳转采用的是菜单的跳转逻辑
    // * 5. 标签页：由于每个标签是直接获取的路由对象，所以路由数据转换成标签页数据时，query 也会被带上
    query?: LocationQueryRaw

    // 🍄 是否为缓存路由
    keepAlive?: boolean

    // 🍄 是否进入到空白布局容器
    blank?: boolean

    // 🍄 对应菜单的配置
    menuProps?: APP.Menu.ItemConfig

    // 🍄 当前路由页面是否显示在标签栏中，默认是都显示，除非明确设置为 false
    showInTabs?: boolean
  }
}
