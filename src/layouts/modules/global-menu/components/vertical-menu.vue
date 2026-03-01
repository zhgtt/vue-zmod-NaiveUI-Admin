<script setup lang="ts">
/**
 * @description: 菜单渲染组件 - 侧边垂直菜单
 * TODO 需要去掉悬浮状态，右键打开新窗口后，悬浮状态还在
 */
import { useLayoutStore, useMenuStore } from '@/store'

defineOptions({
  name: 'GlobaVerticallMenu',
})

const layoutStore = useLayoutStore()
const menuStore = useMenuStore()

// NOTE 动态变化的状态就用 storeToRefs，这样状态就具有响应式
const { verticalMenuData, menuModelValue, expandedKeys } = storeToRefs(menuStore)

const { sideBarConfig, collapsed } = storeToRefs(layoutStore)
</script>

<template>
  <n-menu
    v-model:value="menuModelValue"
    mode="vertical"
    :options="verticalMenuData"
    accordion
    :expanded-keys="expandedKeys"
    :render-label="menuStore.renderMenuLabel"
    :render-icon="menuStore.renderMenuIcon"
    :collapsed="collapsed"
    :collapsed-width="sideBarConfig.collapsedWidth"
    @update:value="menuStore.navigateToMenuItem"
    @update:expanded-keys="menuStore.setExpandedKeys"
  />
</template>

<style scoped></style>
