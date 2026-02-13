<script setup lang="ts">
/**
 * 侧边栏
 */
import { GlobalLogo, GlobalMenu } from '@/layouts/modules'

import { useLayoutStore, useMenuStore } from '@/store'

defineOptions({
  name: 'GlobalSidebar',
})

const layoutStore = useLayoutStore()
// const menuStore = useMenuStore()

const { layoutConfig, sideBarWidth, asyncStyle } = storeToRefs(layoutStore)
// const { collapsed } = storeToRefs(menuStore)

// const { updateSideBarConfig } = layoutStore

// 是否显示 logo
const isShowLogo = computed(() => {
  return ['side'].includes(layoutConfig.value.navMode)
})
</script>

<template>
  <!-- NOTE 给 aside 加 top 和 pb 为 2px，目的是防止与 nprogress 进度条样式重叠 -->
  <aside
    class="absolute left-0 top-2px h-full transition-all-300 bg-white pb-2px"
    :style="{
      width: `${sideBarWidth}px`,
      paddingTop: `${asyncStyle.sideOffsetTop}px`,
      zIndex: `${asyncStyle.sideBarZIndex}`,
    }"
  >
    <div
      class="shadow-sider transition-300 size-full flex flex-col items-stretch"
    >
      <!-- logo -->
      <GlobalLogo v-if="isShowLogo" />

      <!-- 菜单 -->
      <div class="flex-1 overflow-y-auto">
        <GlobalMenu class="h-full" mode="vertical" />
      </div>
    </div>
  </aside>
</template>

<style scoped>
.shadow-sider {
  box-shadow:
    0 0 rgb(0 0 0 / 0),
    0 0 rgb(0 0 0 / 0),
    2px 0 8px 0 rgb(29, 35, 41, 0.05);
}
</style>
