/**
 * @description: alova 拦截器的封装
 */
import type { AlovaGenerics, Method } from 'alova'
import type { ApiResponse, CodeStrategy, CustomHeaders } from '../types'

import { isPlainObject } from 'es-toolkit/compat'
import { merge } from 'es-toolkit/object'

// import { useUserStore } from '@/store'

import { createCodeHandler } from './codeHandler'
import { mainAppStrategy } from './strategy'

/**
 * 🥑 Loading 管理器 (引用计数法)
 * 解决并发请求时 loading 闪烁或提前关闭的问题
 */
const loadingManager = {
  count: 0,
  start() {
    if (this.count === 0) {
      // TODO 处理 loading 开启逻辑
    }
    this.count++
  },
  close() {
    if (this.count > 0) {
      this.count--
    }
    if (this.count === 0) {
      // TODO 处理 loading 关闭逻辑
    }
  },
}

/**
 * 创建拦截器
 * @param customStrategy 自定义的状态码处理策略
 */
export function createInterceptors(customStrategy: CodeStrategy = {}) {
  // 1️⃣ 业务状态码处理，可传自定义的 strategy 做合并处理，不传就走通用的 strategy
  // 注意：这里手动深度合并 errorHandlerMap，以保留默认的错误处理逻辑
  // NOTE merge 用来深度合并两个对象
  const strategy: CodeStrategy = merge(mainAppStrategy, customStrategy)

  // 2️⃣ 创建业务码处理器（闭包缓存，避免每次请求重复创建）
  const codeHandler = createCodeHandler(strategy)

  // 3️⃣ 请求前置拦截器
  const beforeRequest = async (method: Method<AlovaGenerics>) => {
    console.log('method: ', method)
    // const userStore = useUserStore()

    // 初始化 headers
    // NOTE isPlainObject 用来检查数据是否为 对象
    if (!isPlainObject(method.config.headers)) {
      method.config.headers = {}
    }

    const headers = method.config.headers as CustomHeaders

    // 开启全局 loading， X-Loading 为 false 时，不开启全局 loading
    if (headers['X-Loading'] !== false) {
      loadingManager.start()
    }

    // TODO 注入 token
    // NOTE isNil 用来检查数据是否 有值
    // if (!isNil(userStore.token)) {
    //   headers.Authorization = `Bearer ${token}`
    // }

    // TODO 处理文件上传
    // 文件上传适配 (FormData 自动识别，删除 Content-Type 让浏览器自动设置 boundary)
    if (method.data instanceof FormData) {
      delete headers['Content-Type']
    }
  }

  // 4️⃣ 响应成功拦截
  const onSuccess = (adapterType: 'fetch' | 'axios') => {
    return async (response: Response | any, _method: Method<AlovaGenerics>) => {
      // 解析原始数据
      let rawData: ApiResponse<any>
      if (['axios'].includes(adapterType)) {
        rawData = response.data // Axios 直接是 data
      }
      else {
        rawData = await response.json() // Fetch 需要解析
      }

      // 委托给 CodeHandler 处理业务逻辑
      return await codeHandler(rawData)
    }
  }

  // 5️⃣ 响应完成拦截器
  const onComplete = async (method: Method<AlovaGenerics>) => {
    // 关闭全局 loading
    const headers = method.config.headers as CustomHeaders
    if (headers['X-Loading'] !== false) {
      loadingManager.close()
    }
  }

  return { beforeRequest, onSuccess, onComplete }
}
