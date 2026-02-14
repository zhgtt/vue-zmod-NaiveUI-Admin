<script setup lang="ts">
/**
 * @description: 基础布局容器
 */
import { GlobalContent, GlobalFooter, GlobalHeader, GlobalPageTabs, GlobalSidebar } from '../modules'

import { useLayoutStore } from '@/store'

defineOptions({
  name: 'BaseLayout',
})

const layoutStore = useLayoutStore()

const { sideBarVisible } = storeToRefs(layoutStore)
</script>

<template>
  <div class="h-full flex flex-col transition-all-300">
    <!-- 顶部导航 -->
    <GlobalHeader />

    <!-- 标签栏 -->
    <GlobalPageTabs />

    <!-- 侧边栏（水平菜单模式，没有侧边栏） -->
    <GlobalSidebar v-if="sideBarVisible" />

    <!-- 主体内容 -->
    <GlobalContent />

    <!-- 底部内容 -->
    <GlobalFooter />
  </div>
</template>

<style scoped></style>
