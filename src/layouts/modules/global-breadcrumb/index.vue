<script setup lang="tsx">
/**
 * @description: 全局面包屑组件
 */
import type { DropdownOption } from 'naive-ui'

import { useMenuStore } from '@/store'

import { findPathToNode } from '@/utils/menu'

defineOptions({
  name: 'GlobalBreadcrumb',
})

const menuStore = useMenuStore()

const { menuData, selectedKey } = storeToRefs(menuStore)

const { renderMenuIcon, menuRouterPush } = menuStore

/**
 * @description: 1️⃣ 获取面包屑数据，其实就是获取从 根菜单到当前选中菜单 的范围路径
 */
const breadcrumbList = computed<APP.Menu.MenuItem[]>(() => {
  const { value: currentKey } = selectedKey
  const { value: menus } = menuData

  if (!currentKey || !menus.length)
    return []

  const pathData = findPathToNode(menus, currentKey)
  return pathData || []
})

/**
 * @description: 2️⃣ 构造下拉菜单选项
 * @param {APP.Menu.MenuItem} item - 当前面包屑项
 */
function getDropdownOptions(item: APP.Menu.MenuItem): DropdownOption[] {
  // 获取“子级”选项
  const childrenOptions = (item.children || []).map(child => ({
    label: child.label as string,
    key: child.key,
    disabled: child?.disabled || child.key === selectedKey.value, // 当前菜单需要禁用
    icon: () => renderMenuIcon(child),
    // 存储原始菜单项数据
    menuItem: child,
  }))

  return childrenOptions as unknown as DropdownOption[]
}

/**
 * @description: 3️⃣ 处理下拉菜单的选择事件
 */
function handleSelect(_key: string | number, option: DropdownOption) {
  const item = option?.menuItem as APP.Menu.MenuItem

  if (item.href) {
    window.open(item.href, '_blank')
    return
  }
  menuRouterPush(item)
}

/**
 * @description: 4️⃣ TSX 渲染函数
 * 使用 render 函数模式或直接在 template 中使用组件
 */
// 渲染面包屑项内容的函数
function renderBreadcrumbContent(item: APP.Menu.MenuItem) {
  return (
    <div>
      {renderMenuIcon(item)}
      <span class="ml-1">{item.label}</span>
    </div>
  )
}

// 渲染完整的面包屑组件
function BreadcrumbRender() {
  return (
    <n-breadcrumb>
      {breadcrumbList.value.map((item) => {
        // 如果有对应的子项，渲染为下拉菜单面包屑项
        if (item?.children?.length) {
          const options = getDropdownOptions(item)
          return (
            <n-breadcrumb-item key={item.key}>
              <n-dropdown
                options={options}
                onSelect={handleSelect}
                trigger="hover"
              >
                {renderBreadcrumbContent(item)}
              </n-dropdown>
            </n-breadcrumb-item>
          )
        }

        // 如果没有子项，直接渲染为普通面包屑项
        return (
          <n-breadcrumb-item key={item.key}>
            {renderBreadcrumbContent(item)}
          </n-breadcrumb-item>
        )
      })}
    </n-breadcrumb>
  )
}
</script>

<template>
  <div class="ml-3">
    <!-- 直接使用 TSX 组件 -->
    <BreadcrumbRender />
  </div>
</template>

<style scoped>
/* 可以在这里添加一些微调样式 */
</style>
