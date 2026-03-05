/**
 * @description: 对接口返回的状态码进行捕捉和处理，适配多种场景
 */
import type { ApiResponse, CodeStrategy } from '../types'

import { has } from 'es-toolkit/compat'

/**
 * 创建业务码处理器
 * @param strategy 业务状态码策略
 * @returns 处理函数，供拦截器调用
 */
export function createCodeHandler(strategy: CodeStrategy) {
  return async (response: ApiResponse<any>) => {
    const { code, message, data } = response

    // 1️⃣ 成功状态判断
    if (strategy.isSuccess && strategy.isSuccess(code)) {
      return data // 直接返回业务数据
    }

    // 2️⃣ 错误状态处理
    // 检查是否有针对特定 code 的处理器
    if (strategy.errorHandlerMap && has(strategy.errorHandlerMap, code)) {
      const handler = strategy.errorHandlerMap[code]
      await handler(response)
    }
    else if (strategy.defaultErrorHandler) {
      // 执行默认错误处理
      await strategy.defaultErrorHandler(response)
    }

    // 3️⃣ 抛出业务错误，交给外层 onError 捕获
    throw new Error(message)
  }
}
