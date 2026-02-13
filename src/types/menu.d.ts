/**
 * 菜单相关的类型定义
 */
// * 当随意引入一个类型时，这个 d.ts 文件就会变成一个模块，所以需要声明 global 特殊处理，若不引入，则还是全局的类型
import type { MenuOption } from 'naive-ui'

declare global {
  namespace APP {
    namespace Menu {
      // 菜单项的基本属性
      interface BaseItem {
        // 菜单项的唯一标识
        key: string

        // 菜单项的显示文本
        label?: string

        // 跳转的路由路径
        routePath?: string

        // 菜单项的子菜单
        children?: MenuItem[] | RouteRecordRaw[]

        // 菜单层级
        level?: number
      }

      // 🍄 在路由页面中用于自定义的菜单配置项类型
      interface ItemConfig {
        // 对应菜单的图标配置项，它是个对象，采用 SvgIcon 组件的类型
        iconConfig?: import('@/components/custom/SvgIcon.vue').IconProps

        // 对应菜单的排序，必须大于 0，不设置的话默认为 最大值
        order?: number

        // 指定菜单跳转方式
        target?: 'self' | '_blank'

        // 是否禁用菜单，默认为 false
        disabled?: boolean

        // 如果不想使用路由指定的 title 属性作为菜单名称，可以自行定义 菜单名称
        customLabel?: string

        // 是否隐藏该菜单，默认为 false
        hideInMenu?: boolean

        // 指定其所在的文件夹目录是否为 单独的子菜单项，默认为 true；（🍄 仅在 index.vue 设置中才有效，推荐 一个文件夹代表一个子菜单项，也是默认情况）
        // ! 如果想让该文件展示为嵌套（父级）菜单，则将其设置为 false
        isChildMenu?: boolean

        // 对应路由的参数，如果设置的话，点击菜单进入该路由，会自动携带该参数
        query?: Record<string, string>

        // 对应菜单的外链地址（仅在自定义菜单时生效，在 .vue 文件中定义无效）
        href?: string

        // 指定嵌套（父级）菜单的 key，用于自定义菜单时，指定其父级菜单
        parentKey?: string

        // 菜单权限标识
        // permission?: string
      }

      // 🍄 完整的菜单项类型（兼容 naive-ui 的菜单类型）
      type MenuItem = BaseItem & ItemConfig & MenuOption

      // TODO 菜单配置
      interface Config {
        // 是否开启手风琴模式（同时只能展开一个菜单）
        accordion?: boolean

        // 菜单是否可折叠（收缩，仅在 mode = vertical 垂直布局下生效）
        collapsible?: boolean

        // 菜单折叠时的宽度（仅在 mode = vertical 垂直布局下生效）
        collapsedWidth?: number

        // 菜单展示模式: 'vertical' | 'horizontal' | 'inline'
        mode?: 'vertical' | 'horizontal' | 'inline'

        // 菜单主题: 'light' | 'dark' | 'inverted'
        theme?: 'light' | 'dark' | 'inverted'

        // 是否显示缩进线
        indent?: boolean

        // 菜单项缩进值
        indentSize?: number
      }
    }
  }
}
