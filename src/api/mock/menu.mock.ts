import { defineMock } from '@alova/mock'

export default defineMock(
  {
    // 模拟获取菜单列表
    // * 针对单个 api 请求，可以在请求前面加 -，表示禁用此 api 请求使用 mock
    '[GET]/api/menus': () => {
      return {
        code: 200,
        message: '获取菜单成功',
        data: [
          {
            id: 1,
            name: '首页',
            path: '/dashboard',
            icon: 'Dashboard',
            type: 'menu',
            sort: 1,
            hidden: false,
            children: [],
          },
          {
            id: 2,
            name: '系统管理',
            path: '/system',
            icon: 'Setting',
            type: 'directory',
            sort: 2,
            hidden: false,
            children: [
              {
                id: 21,
                name: '用户管理',
                path: '/system/user',
                icon: 'User',
                type: 'menu',
                sort: 1,
                hidden: false,
                children: [],
              },
              {
                id: 22,
                name: '角色管理',
                path: '/system/role',
                icon: 'UserFilled',
                type: 'menu',
                sort: 2,
                hidden: false,
                children: [],
              },
              {
                id: 23,
                name: '菜单管理',
                path: '/system/menu',
                icon: 'Menu',
                type: 'menu',
                sort: 3,
                hidden: false,
                children: [],
              },
            ],
          },
          {
            id: 3,
            name: '内容管理',
            path: '/content',
            icon: 'Document',
            type: 'directory',
            sort: 3,
            hidden: false,
            children: [
              {
                id: 31,
                name: '文章管理',
                path: '/content/article',
                icon: 'Tickets',
                type: 'menu',
                sort: 1,
                hidden: false,
                children: [],
              },
              {
                id: 32,
                name: '分类管理',
                path: '/content/category',
                icon: 'Folder',
                type: 'menu',
                sort: 2,
                hidden: false,
                children: [],
              },
            ],
          },
          {
            id: 4,
            name: '数据统计',
            path: '/statistics',
            icon: 'DataLine',
            type: 'directory',
            sort: 4,
            hidden: false,
            children: [
              {
                id: 41,
                name: '访问统计',
                path: '/statistics/visit',
                icon: 'View',
                type: 'menu',
                sort: 1,
                hidden: false,
                children: [],
              },
              {
                id: 42,
                name: '销售统计',
                path: '/statistics/sales',
                icon: 'Money',
                type: 'menu',
                sort: 2,
                hidden: false,
                children: [],
              },
            ],
          },
        ],
      }
    },
  },
  //*  这里可以单独控制 mock 组是否启用 mock 请求，默认为 true
  true,
)
