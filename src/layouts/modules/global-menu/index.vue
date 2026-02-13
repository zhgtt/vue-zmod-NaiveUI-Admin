<script setup lang="tsx">
/**
 * 菜单渲染组件
 */
import type { MenuProps } from 'naive-ui'

// 导入菜单组件
import HorizontalMenu from './components/horizontal-menu.vue'
import VerticalMenu from './components/vertical-menu.vue'
import RootLevelMenu from './components/root-level-menu.vue'

import { useLayoutStore } from '@/store'

// 定义组件属性类型
interface Props {
  mode?: MenuProps['mode'] // 菜单模式：horizontal（水平） | vertical（垂直）
}

defineOptions({
  name: 'GlobalMenu',
})

// 定义组件接收的属性
const props = withDefaults(defineProps<Props>(), {
  mode: 'vertical',
})

const layoutStore = useLayoutStore()

const { layoutConfig } = storeToRefs(layoutStore)

// 根据 mode 展示相应组件
const activeMenu = computed(() => {
  const navMode = layoutConfig.value.navMode

  if (props.mode === 'horizontal') {
    if (['mixedSide'].includes(navMode))
      return RootLevelMenu // 只有一级菜单

    return HorizontalMenu // 水平菜单
  }

  return VerticalMenu // 垂直菜单
})
</script>

<template>
  <div id="__GLOBAL_MENU__">
    <!-- 根据 mode 属性动态渲染对应的菜单组件 -->
    <component :is="activeMenu" />
  </div>
</template>

<style scoped></style>
