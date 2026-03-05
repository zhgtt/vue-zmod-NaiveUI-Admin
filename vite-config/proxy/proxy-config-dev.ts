/**
 * @description: dev 环境下的代理项配置
 */
import type { ProxyList } from './index'

const proxyConfigDev: ProxyList = [
  // 接口 api
  [
    '/API', // 代理接口前缀
    'https://api.lolimi.cn/API', // 代理地址
  ],
  // ...其他
]

export default proxyConfigDev
