<script setup lang="ts">
/**
 * 菜单渲染组件 - 一级菜单
 *
 * ? n-menu 组件中，如果只显示一级菜单数据，则不会触发 update:value 菜单选中 事件，需要用 update:expanded-keys 菜单展开 事件来代替
 */
import { useLayoutStore, useMenuStore } from '@/store'

import { findMenuByKey } from '@/utils'

defineOptions({
  name: 'GlobalRootLevelMenu',
})

const layoutStore = useLayoutStore()
const menuStore = useMenuStore()

const { selectedRootKey } = storeToRefs(menuStore)

const { menuData, rootMenuData, renderMenuLabel, renderMenuIcon, menuRouterPush } = menuStore
const { setSideBarVisible } = layoutStore

// 当前展开的菜单项集合（意义不大，但必须要定义）
const expandedKeys = ref<string[]>([])

// 🍄 菜单 展开/折叠 事件（来处理跳转和侧边栏显隐的状态）
function handleExpandedKeysUpdate(newKeys: string[]) {
  if (!newKeys.length)
    return

  // 先获取对应的菜单项对象
  const menuKey = newKeys[0]
  const menuItem = findMenuByKey(menuData, menuKey)

  if (!menuItem) {
    console.error(`未找到菜单项: ${menuKey}`)
    return
  }

  // 如果是外链菜单，不更新selectedRootKey，直接打开链接
  if ('href' in menuItem) {
    window.open(menuItem.href, menuItem.target || '_blank')
    return
  }

  // 不是外链菜单，正常更新selectedRootKey
  selectedRootKey.value = menuKey

  // 根据菜单项类型处理不同逻辑
  const hasChildren = Boolean(menuItem.children?.length)

  // 设置侧边栏可见性，没有子菜单则不显示侧边栏
  setSideBarVisible(hasChildren)

  // 如果没有子菜单，执行路由跳转
  if (!hasChildren) {
    menuRouterPush(menuItem)
  }
}
</script>

<template>
  <n-menu
    v-model:value="selectedRootKey"
    mode="horizontal"
    :options="rootMenuData"
    :expanded-keys="expandedKeys"
    :render-label="renderMenuLabel"
    :render-icon="renderMenuIcon"
    @update:expanded-keys="handleExpandedKeysUpdate"
  />
</template>

<style scoped></style>
