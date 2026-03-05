import { request } from '@/http'

interface HcInfo {
  departure: string
  arrival: string
}
export function getHcInfo(params: HcInfo) {
  // NOTE 请求方法后面跟 类型，是为了让响应数据也拥有这个类型
  return request.Get<HcInfo>(
    '/API/hc/api',
    {
      params: { ...params, type: 'json' },
    },
  )
}

export const getMenus = () => request.Get('/menus')
