/**
 * @description: 字段映射配置表
 * 用于处理后端接口字段与前端字段不一致的情况，统一在此处管理
 */

/**
 * 动态菜单字段映射 (Dynamic Menu -> MenuItem)
 */
export const MENU_FIELD_MAPPING = {
  // 基础字段
  key: 'name',
  label: 'title',
  path: 'path',
  children: 'children',
  icon: 'icon',
  order: 'order',
  target: 'target',
  hide: 'hide',
  href: 'href',

  // 徽标相关
  badge: 'badge',
  badgeType: 'badgeType',
  badgeValue: 'badgeValue',
  badgeColor: 'badgeColor',
} as const
