<script setup lang="tsx">
/**
 * 菜单渲染组件 - 水平菜单
 */
import { useMenuStore } from '@/store'

defineOptions({
  name: 'GlobalHorizontalMenu',
})

const menuStore = useMenuStore()

const { menuModelValue } = storeToRefs(menuStore)

const { menuData, renderMenuLabel, renderMenuIcon, navigateToMenuItem } = menuStore
</script>

<template>
  <n-menu
    v-model:value="menuModelValue"
    mode="horizontal"
    :options="menuData"
    :render-label="renderMenuLabel"
    :render-icon="renderMenuIcon"
    @update:value="navigateToMenuItem"
  />
</template>

<style scoped></style>
