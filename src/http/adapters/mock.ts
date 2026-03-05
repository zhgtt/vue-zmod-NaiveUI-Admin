/**
 * @description: alova 的 mock 模拟请求适配器
 * 它其实不算是一个请求器，但是它可以在 alova 实例中选择是否使用 mock 进行请求
 * 对未匹配到的 mock 接口，可以使用 fetch/axios 进行请求
 */
import type { MockWrapper } from '@alova/mock'
import adapterFetch from 'alova/fetch'
import { createAlovaMockAdapter } from '@alova/mock'

// 自动导入 src/api/mock 下所有的 .mock.ts 文件
const mockModules = import.meta.glob('@/api/mock/*.mock.ts', {
  eager: true, // 同步引入
  import: 'default', // 默认导出9
})

// 组合成数组集合
const mocks = Object.values(mockModules) as MockWrapper[]

export const mockAdapter = createAlovaMockAdapter(mocks, {
  // 全局控制是否启用mock接口，默认为true
  enable: true,

  // 非模拟请求适配器，用于未匹配mock接口时发送请求
  httpAdapter: adapterFetch(),

  // mock接口响应延迟，单位毫秒
  delay: 1000,

  // 是否打印mock接口请求信息
  mockRequestLogger: true,
})
