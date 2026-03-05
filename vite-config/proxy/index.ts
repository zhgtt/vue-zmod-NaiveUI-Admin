/**
 *  @description: 解析服务代理配置
 */
import type { ProxyOptions } from 'vite'

import { merge } from 'es-toolkit/object'
import { isPlainObject, isString } from 'es-toolkit/predicate'

// 引入不同环境的代理项列表
import proxyConfigDev from './proxy-config-dev'

/**
 * 代理配置项类型
 * @example ['/api', 'http://localhost:3000']
 * @example ['/api', { target: 'http://localhost:3000', rewrite: path => path.replace(/^\/api/, '') }]
 */
// 定义 单个代理项 类型
type ProxyItem = [string, string | ProxyOptions]

// 定义 代理项组成的 list 的类型
export type ProxyList = ProxyItem[]

// 定义 代理目标列表 类型
type ProxyTargetList = Record<string, ProxyOptions>

// 获取代理目标列表
const proxyConfig: Record<string, ProxyList> = {
  // 开发环境代理
  development: proxyConfigDev,
  // ... 其他环境
}

/**
 * 创建 Vite 代理配置
 * @param env - 环境变量对象
 * @param mode - 当前运行模式 (development, production 等)
 */
export function createViteProxy(mode: string) {
  // 代理项列表
  const list = proxyConfig[mode] || []

  const ret: ProxyTargetList = {}

  // 1️⃣ 循环处理 ProxyList
  for (const [prefix, targetOrOptions] of list) {
    const isTargetString = isString(targetOrOptions)
    const isTargetObj = isPlainObject(targetOrOptions)

    if (!isTargetString && !isTargetObj) {
      throw new Error(`代理配置错误: 代理目标格式错误！出错项: ${prefix}`)
    }

    // 代理配置项，地址/配置对象
    const target = isTargetObj ? targetOrOptions.target : targetOrOptions
    // 代理地址是否为 https
    const isHttps = /^https:\/\//.test(target as string)

    // 默认配置项
    const defaultConfig: ProxyOptions = {
      target: target as string,
      changeOrigin: true,
      ws: false, // 是否启用 websocket
      rewrite: path => path.replace(new RegExp(`^${prefix}`), ''),
      // https 地址时，是否验证证书有效性，开发环境建议设置为 false，不然有可能会代理失败
      ...(isHttps && { secure: false }),
    }

    // 如果代理项是 字符串，直接使用默认配置
    if (isTargetString) {
      ret[prefix] = defaultConfig
    }
    // 如果是对象，深度合并配置，允许用户覆盖默认值
    else {
      ret[prefix] = merge(defaultConfig, targetOrOptions)
    }
  }

  return ret
}
