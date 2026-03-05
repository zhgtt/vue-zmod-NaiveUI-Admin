/**
 * @description: 通用的状态码处理策略
 */
import type { CodeStrategy } from '../types'

// NOTE naive-ui 支持 createDiscreteApi 方法，用于创建独立的 API 实例
import { createDiscreteApi } from 'naive-ui'

const { message: NMessage } = createDiscreteApi(['message'])

/**
 * @description: 定义通用的状态码处理逻辑
 */
export const mainAppStrategy: CodeStrategy = {
  // 成功状态码
  isSuccess: code => [200].includes(code),

  errorHandlerMap: {
    // 401 特殊处理：跳转登录
    401: (res) => {
      NMessage.error(res.message || '您的登录状态已过期，请重新登录')
      // TODO 这里进行登录过期处理，例如跳转登录页
      // router.push('/login');
    },
    // 403 没有权限
    403: (res) => {
      NMessage.error(res.message || '您没有权限访问该资源')
    },
    // 404 资源不存在
    404: (res) => {
      NMessage.error(res.message || '资源不存在，请联系管理员')
    },
    // 500 服务器内部错误
    500: (res) => {
      NMessage.error(res.message || '服务器内部错误，请联系管理员')
    },
  },

  // 默认错误处理：直接弹出后端返回的 message
  defaultErrorHandler: (res) => {
    NMessage.error(res.message)
  },
}
