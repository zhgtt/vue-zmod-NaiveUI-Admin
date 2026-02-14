<script setup lang="ts">
/**
 * @description: 顶部栏内容
 */
import { GlobalActions, GlobalBreadcrumb, GlobalLogo, GlobalMenu } from '@/layouts/modules'

import { useLayoutStore, useMenuStore } from '@/store'

defineOptions({
  name: 'GlobalHeader',
})

const layoutStore = useLayoutStore()
const menuStore = useMenuStore()

const { layoutConfig, headerConfig, asyncStyle } = storeToRefs(layoutStore)

const { toggleCollapsed } = menuStore

const navMode = layoutConfig.value.navMode

// 除 side 模式都需要在顶部显示菜单和LOGO
const showMenuAndLogoInHeader = computed(() => {
  return ['top', 'mixedSide'].includes(navMode)
})

// 面包屑的显示与否，只在 side 模式下进行控制
const showBreadcrumbInHeader = computed(() => {
  return ['side'].includes(navMode) && headerConfig.value?.showBreadcrumb
})
</script>

<template>
  <!-- ? flex-shrink-0：作用防止元素在 flex 容器中被压缩 -->
  <header
    class="flex-shrink-0 w-full transition-all-300 absolute top-0 left-0 z-97"
    :style="{
      height: `${headerConfig.height}px`,
      paddingLeft: `${asyncStyle.headerOffsetLeft}px`,
    }"
  >
    <div class="text-base-text shadow-header transition-300 h-full flex-y-center">
      <!-- 左侧区域：Logo 和 菜单折叠按钮 -->
      <GlobalLogo v-if="showMenuAndLogoInHeader" />

      <div class="header-container h-full flex-y-center flex-1-hidden px-3">
        <!-- TODO 菜单折叠按钮，后期要将其放至侧边栏的底部 -->
        <template v-if="layoutConfig.navMode !== 'top'">
          <n-button @click="toggleCollapsed">
            <SvgIcon name="gravity-ui:bars-play" type="iconify" />
          </n-button>
        </template>

        <!-- 中间区域：菜单、面包屑 -->
        <div class="h-full flex-y-center flex-1-hidden">
          <!-- 水平菜单 -->
          <template v-if="showMenuAndLogoInHeader">
            <GlobalMenu class="mx-auto" mode="horizontal" />
          </template>

          <!-- 面包屑（水平菜单模式，没有面包屑） -->
          <template v-if="showBreadcrumbInHeader">
            <GlobalBreadcrumb />
          </template>
        </div>

        <!-- 右侧区域：功能按钮和用户信息等 -->
        <GlobalActions />
      </div>
    </div>
  </header>

  <!-- NOTE 再加一个高度一样的 div，为了能 header 正常吸顶 -->
  <div class="flex-shrink-0 overflow-hidden" :style="{ height: `${headerConfig.height}px` }" />
</template>

<style scoped>
.header-container {
  /* transition: all 0.3s; */
}
.shadow-header {
  box-shadow:
    rgba(0, 0, 0, 0.03) 0px 1px 2px 0px,
    rgba(0, 0, 0, 0.02) 0px 1px 6px -1px,
    rgba(0, 0, 0, 0.02) 0px 2px 4px 0px;
}
</style>
