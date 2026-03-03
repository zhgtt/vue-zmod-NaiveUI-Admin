<script setup lang="tsx">
/**
 * @description: 页面标签栏功能（由路由数据主导）
 * ? 支持关闭、拖拽、刷新、右侧点击功能（固定、关闭左侧/右侧/其他 等）
 * TODO 后续最大化时，要将标签栏也可以显示
 */
import { useDraggable } from 'vue-draggable-plus'

import type { PageTab } from '@/store'
import { useLayoutStore, usePageTabsStore } from '@/store'

import { useAppActions } from '@/hooks'

import { useTabsContext } from './hooks/use-tabs-context'

defineOptions({
  name: 'GlobalPageTabs',
})

const layoutStore = useLayoutStore()
const pageTabsStore = usePageTabsStore()

const { tabsConfig, asyncStyle, headerConfig } = storeToRefs(layoutStore)
const { tabs, activeTab } = storeToRefs(pageTabsStore)

// 全局的 hooks
const { reloadPage, toggleMaximize } = useAppActions()

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
// NOTE vue3.5 版本之后，组件模板引用可以使用 useTemplateRef，与之前的 ref 区分开，语义更清晰
const pageTabsEl = useTemplateRef('pageTabsRef')
// 处理拖拽逻辑
function initDraggable() {
  if (!pageTabsEl.value)
    return

  // 获取 n-tabs 组件内部的 tab 父容器 DOM
  // 🔔 这里的选择器是基于 Naive UI 的 DOM 结构，如果 Naive UI 更新可能会失效
  const el = pageTabsEl.value.$el.querySelector('.n-tabs-wrapper') as HTMLElement
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
  // 等待 DOM 渲染完成
  await nextTick()

  initDraggable()
})

// tab 点击事件
function handleTabClick(tab: PageTab) {
  pageTabsStore.setActiveTab(tab)
}

// tab 关闭事件
function handleClose(key: string) {
  pageTabsStore.closeTab(key)
}

/**
 * @description: 渲染右侧操作按钮
 */
function SuffixActions() {
  const actions = [
    { label: '刷新当前页', icon: 'tabler:refresh', onClick: () => reloadPage() },
    { label: '内容区全屏', icon: 'tabler:maximize', onClick: () => toggleMaximize() },
  ]

  return actions.map((action) => {
    return (
      <n-tooltip key={action.label} show-arrow={false} placement="bottom-end" trigger="hover">
        {{
          trigger: () => (
            <n-button quaternary circle onClick={action.onClick}>
              <SvgIcon class="font-size-5" type="iconify" name={action.icon} />
            </n-button>
          ),
          default: () => action.label,
        }}
      </n-tooltip>
    )
  })
}
</script>

<template>
  <div
    class="shrink-0 w-full transition-all-300 absolute left-0 z-97"
    :style="{
      height: `${tabsConfig.height}px`,
      paddingLeft: `${asyncStyle.contentOffsetLeft}px`,
      top: `${headerConfig.height}px`,
    }"
  >
    <!-- <div class="p-x-4"> -->
    <!-- TODO 可以更换背景色 bg-#F5F8FA -->
    <n-tabs
      ref="pageTabsRef"
      v-model:value="activeTab"
      class="p-x-3 pt-2"
      type="card"
      @close="handleClose"
    >
      <n-tab
        v-for="tab in tabs"
        :key="tab.key"
        :class="{ 'drag-handle': !tab.fixed }"
        :style="{
          height: `${tabsConfig.height - 8}px`,
        }"
        :name="tab.key"
        :closable="!tab.fixed && tabs.length > 1"
        @click="handleTabClick(tab)"
        @contextmenu.prevent="(e: MouseEvent) => handleTabRightClick(e, tab)"
      >
        <!-- NOTE flex 布局下，可以多使用 gap 来控制元素之间的间距 -->
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

      <!-- TODO 优化成tsx 改成循环调用，右侧操作，提供 刷新、内容全屏 功能 -->
      <template #suffix>
        <div class="flex items-center gap-2">
          <SuffixActions />
        </div>
      </template>
    </n-tabs>
    <!-- </div> -->
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
