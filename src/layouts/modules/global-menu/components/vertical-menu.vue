<script setup lang="tsx">
/**
 * 菜单渲染组件 - 垂直菜单
 */
import { useLayoutStore, useMenuStore } from '@/store'

defineOptions({
  name: 'GlobaVerticallMenu',
})

const layoutStore = useLayoutStore()
const menuStore = useMenuStore()

// NOTE 动态变化的状态就用 storeToRefs，这样状态就具有响应式
const { verticalMenuData, menuModelValue, collapsed } = storeToRefs(menuStore)

const { sideBarConfig } = layoutStore
const { renderMenuLabel, renderMenuIcon, navigateToMenuItem } = menuStore
</script>

<template>
  <n-menu
    v-model:value="menuModelValue"
    mode="vertical"
    :options="verticalMenuData"
    accordion
    :render-label="renderMenuLabel"
    :render-icon="renderMenuIcon"
    :collapsed="collapsed"
    :collapsed-width="sideBarConfig.collapsedWidth"
    @update:value="navigateToMenuItem"
  />
</template>

<style scoped></style>
