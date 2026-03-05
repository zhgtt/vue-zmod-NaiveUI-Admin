/**
 * @description: 创建 alova 实例 - fetch 请求适配器
 */
import type { CodeStrategy } from '../types'

import { createAlova } from 'alova'
import adapterFetch from 'alova/fetch'
import VueHook from 'alova/vue'

import { createDiscreteApi } from 'naive-ui'

import { createInterceptors } from '../core/interceptors'
import { mockAdapter } from './mock'

const { message: NMessage } = createDiscreteApi(['message'])

const { VITE_API_BASE_URL, DEV } = import.meta.env

function createFetchInstance(codeStrategy?: CodeStrategy) {
  const { beforeRequest, onSuccess, onComplete } = createInterceptors(codeStrategy)

  return createAlova({
    // 请求基础地址，默认获取地址栏地址和端口号
    baseURL: VITE_API_BASE_URL || window.location.origin,

    timeout: 60000, // 请求超时时间，全局设置为 1分钟，也可以针对某个 api 单独设置其超时时间

    // 通过环境变量控制生产环境下，不会将mock相关代码打包进去
    requestAdapter: DEV ? mockAdapter : adapterFetch(),

    // 使用 hooks 模式
    statesHook: VueHook,

    // 请求拦截器
    beforeRequest,

    // 响应拦截器
    responded: {
      onSuccess: onSuccess('fetch'),

      // NOTE 由于window.fetch的特点，只有在连接超时或连接中断时才会触发onError拦截器，其他情况均会触发onSuccess拦截器
      // 所以这里的 onError 不做公共的封装，单独处理
      onError: async (err, method) => {
        const errorMap: Record<string, string> = {
          'TimeoutError': '请求超时，请稍后重试',
          'timeout': '请求超时，请稍后重试',
          'Network Error': '网络连接异常，请检查网络',
        }
        const errMsg = err.message

        // 优先匹配 err.name，其次模糊匹配 errMsg
        const message = errorMap[err.name]
          // NOTE Object.entries 将对象转换为 [key, value] 键值对组成的二维数组
          || Object.entries(errorMap).find(([key]) => errMsg.includes(key))?.[1]
          || '网络请求错误'

        NMessage.error(message)

        console.error(`[Alova Error] ${method.url}:`, err)
        throw err
      },

      onComplete,
    },
  })
}

export default createFetchInstance
