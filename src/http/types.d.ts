/**
 * @description: 定义请求参数类型
 */

import type { AlovaGenerics, Method } from 'alova'

// 请求时扩展的 config.headers 配置
export interface CustomHeaders {
  'X-Loading'?: boolean | string // 开启全局loading，默认为 true，字符串表示自定义提示loading
  [key: string]: any // 支持其他自定义 header
}

// 标准响应结构
export interface ApiResponse<T = any> {
  code: number
  data: T // 可以是任意类型的数据
  message: string
}

// 状态码的捕捉策略类型
export interface CodeStrategy {
  /**
   * 判断业务是否成功
   * @param code 后端返回的业务状态码
   * @returns boolean
   */
  isSuccess?: (code: number) => boolean

  /**
   * 特定错误码的处理映射表
   * key: 错误码, value: 处理函数
   * 示例: { 401: () => { router.push('/login') } }
   */
  errorHandlerMap?: Record<number, (response: ApiResponse<any>) => void | Promise<void>>

  /**
   * 默认错误处理
   * 当 code 不是成功码，且不在 errorHandlerMap 中时触发
   */
  defaultErrorHandler?: (response: ApiResponse<any>) => void | Promise<void>
}
