/**
 * @description: 创建 alova 实例，可以根据业务场景创建多个实例
 */
import type { CodeStrategy } from './types'

import createFetchInstance from './adapters/fetch'

// 1️⃣ 创建 alova 通用实例请求 - fetch 请求适配器
export const request = createFetchInstance()

// 示例：创建特殊 fecth 实例，实例的状态码捕捉不同
// 比如这个实例想让状态码成功的值为 0 或 200，401 时不走退出登录逻辑，其他的不变
// const elseAppStrategy: CodeStrategy = {
//   isSuccess: code => [200, 0].includes(code),

//   errorHandlerMap: {
//     // 401 特殊处理：跳转登录
//     401: () => {
//       // 走其他逻辑
//     },
//   },
// }

// export const elseRequest = createFetchInstance(elseAppStrategy)

// 如果需要 Axios 实例，也使用同样的策略，这里不做实现
// export const axiosRequestt = createAxiosInstance();
