<script setup lang="tsx">
/**
 * @description: 页面标签栏功能
 * ? 支持关闭、拖拽、刷新、右侧点击功能（固定、关闭等）
 */
import { useDraggable } from 'vue-draggable-plus'

import type { PageTab } from '@/store'
import { useLayoutStore, usePageTabsStore } from '@/store'

import { useTabsContext } from './use-tabs-context'

defineOptions({
  name: 'GlobalPageTabs',
})

const layoutStore = useLayoutStore()
const pageTabsStore = usePageTabsStore()

const { tabsConfig, asyncStyle, headerConfig } = storeToRefs(layoutStore)
const { tabs, activeTab } = storeToRefs(pageTabsStore)

/**
 * @description: 右侧下拉菜单相关
 */
// 使用本地 hooks 提供的右键菜单功能
const {
  showDropdown,
  dropdownX,
  dropdownY,
  menuOptions,
  handleSelect,
  handleTabRightClick,
  onClickOutside,
} = useTabsContext()

/**
 * @description: 拖拽相关
 */
const pageTabsRef = ref<InstanceType<typeof NTabs> | null>(null)

// 处理拖拽逻辑
function initDraggable() {
  if (!pageTabsRef.value)
    return

  // 获取 n-tabs 组件内部的 tab 父容器 DOM
  // 🔔 这里的选择器是基于 Naive UI 的 DOM 结构，如果 Naive UI 更新可能会失效
  const el = pageTabsRef.value.$el.querySelector('.n-tabs-wrapper') as HTMLElement
  if (!el)
    return

  // 直接传入 tabs，不是 tabs.value，否则显示不正常
  useDraggable(el, tabs, {
    animation: 300, // 拖动时显示动画时间
    handle: '.drag-handle', // 指定拖拽句柄，只有包含该类的元素才能被拖拽
    draggable: '.n-tabs-tab-wrapper', // 指定元素内的哪些项目应该是可拖动的
    // ghostClass: 'ghost',

    // 拖拽移动的时候触发
    onMove: (evt) => {
      // 获取固定标签的数量
      const fixedCount = tabs.value.filter(t => t.fixed).length

      // 使用 evt.related 获取拖向目标 DOM 元素，然后手动计算其索引
      const children = Array.from(el.children)
      // 过滤出实际的可拖拽项（排除其他可能的辅助元素）
      // NOTE classList.contains 是 DOM 元素上的一个方法，用来判断该元素是否包含某个 class 名
      const draggableItems = children.filter((c) => {
        return c.classList.contains('n-tabs-tab-wrapper')
      })

      // 🍄 获取目标索引（就是拖向哪个元素的索引，比如 a 拖向 b，这里就是获取 b 的索引）
      const targetIndex = draggableItems.indexOf(evt.related as HTMLElement)

      // 🍄 只要目标索引小于固定标签数量，就说明试图拖入固定区域，应予以禁止
      return targetIndex >= fixedCount
    },
    onStart: () => {
      console.warn('🚀🚀🚀 拖拽开始 🚀🚀🚀')
    },
    onEnd: () => {
      console.warn('🗾🗾🗾 拖拽结束 🗾🗾🗾', tabs.value)
    },
  })
}

onMounted(async () => {
  // * 等待 DOM 渲染完成
  await nextTick()

  initDraggable()
})
function handleTabClick(tab: PageTab) {
  // TODO 切换到非当前菜单层的 标签，对应的菜单层没有展开
  console.log('tab: ', tab)
  pageTabsStore.setActiveTab(tab)
}

function handleClose(key: string) {
  pageTabsStore.closeTab(key)
}
</script>

<template>
  <div
    class="shrink-0 w-full transition-all-300 absolute left-0 z-97"
    :style="{
      // height: `${tabsConfig.height}px`,
      paddingLeft: `${asyncStyle.headerOffsetLeft}px`,
      top: `${headerConfig.height}px`,
    }"
  >
    <div class="p-x-4 pt-2">
      <n-tabs
        ref="pageTabsRef"
        v-model:value="activeTab"
        type="card"
        @close="handleClose"
      >
        <n-tab
          v-for="tab in tabs"
          :key="tab.key"
          :name="tab.key"
          :closable="!tab.fixed && tabs.length > 1"
          :class="{ 'drag-handle': !tab.fixed }"
          :style="{
            height: `${tabsConfig.height}px`,
          }"
          @click="handleTabClick(tab)"
          @contextmenu.prevent="(e: MouseEvent) => handleTabRightClick(e, tab)"
        >
          <!-- * NOTE flex 布局下，可以多使用 gap 来控制元素之间的间距 -->
          <div class="flex items-center gap-2">
            <template v-if="tab.icon">
              <SvgIcon v-bind="{ ...tab.icon }" class="font-size-4" />
            </template>
            <span>{{ tab.title }}</span>
            <!-- 固定的标签，要单独显示个图标 -->
            <template v-if="tab.fixed">
              <SvgIcon type="iconify" name="tabler:pinned-filled" class="font-size-4" />
            </template>
          </div>
        </n-tab>
      </n-tabs>
    </div>
  </div>

  <!-- * 再加一个高度一样的 div ，用于占位，避免标签栏被顶掉 -->
  <div class="shrink-0 overflow-hidden" :style="{ height: `${tabsConfig.height}px` }" />

  <!-- 右键下拉菜单 -->
  <n-dropdown
    placement="bottom-start"
    trigger="manual"
    :x="dropdownX"
    :y="dropdownY"
    :options="menuOptions"
    :show="showDropdown"
    :on-clickoutside="onClickOutside"
    @select="handleSelect"
  />
</template>

<style scoped>

</style>
