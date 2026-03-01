/**
 * @description: 针对 tabs 点击右侧的下拉菜单进行封装
 */
import type { DropdownOption } from 'naive-ui'

import { findIndex } from 'es-toolkit/compat'

import { useAppActions } from '@/hooks'

import type { PageTab } from '@/store'
import { usePageTabsStore } from '@/store'

import SvgIcon from '@/components/custom/SvgIcon.vue'

export function useTabsContext() {
  const pageTabsStore = usePageTabsStore()

  const { tabs, activeTab } = storeToRefs(pageTabsStore)

  // 获取封装好的 hooks
  const { reloadPage, toggleMaximize, openInNewWindow } = useAppActions()

  // 右键菜单相关状态
  const showDropdown = ref(false)
  const dropdownX = ref(0) // 下拉菜单的 x 坐标
  const dropdownY = ref(0) // 下拉菜单的 y 坐标

  // 当前右侧点击 所属的标签页 对象
  const currentRightClickTab = ref<PageTab | null>(null)

  /**
   * @description: 1️⃣ 计算右键菜单选项
   */
  const menuOptions = computed<DropdownOption[]>(() => {
    const tab = currentRightClickTab.value
    if (!tab)
      return []

    const { key, fixed } = tab
    const tabsList = tabs.value

    // 右侧菜单所属的标签页是否是激活的
    const isCurrent = key === activeTab.value
    // 右侧菜单所属的标签页的 索引
    const index = findIndex(tabsList, t => t.key === key)
    // 标签列 > 1 时，才可进行关闭操作
    const hasOther = tabsList.length > 1

    // 🍄 辅助函数：检查某范围内是否全部固定
    const isAllFixed = (list: PageTab[]) => list.length === 0 || list.every(t => t.fixed)

    // 🍄 分割左右列表
    const leftTabs = tabsList.slice(0, index)
    const rightTabs = tabsList.slice(index + 1)

    // 🍄 权限判断
    const disabledMap = {
      refresh: !isCurrent, // 只有当前激活的标签页可刷新
      close: fixed || !hasOther,
      // 检查是否有关闭其他标签页的权限（存在非当前且非固定的标签）
      closeOther: !tabsList.some(t => t.key !== key && !t.fixed),
      closeLeft: isAllFixed(leftTabs),
      closeRight: isAllFixed(rightTabs),
    }

    // 辅助函数：生成菜单项
    const createItem = (label: string, key: string, iconName: string, disabled = false) => ({
      label,
      key,
      disabled,
      icon: () => <SvgIcon type="iconify" name={iconName} class="font-size-4" />,
    })

    return [
      createItem('重新加载', 'refresh', 'tabler:refresh', disabledMap.refresh),
      createItem('关闭标签页', 'close', 'tabler:x', disabledMap.close),
      { type: 'divider', key: 'd1' }, // 下拉菜单分割线

      // 固定/取消固定
      createItem(fixed ? '取消固定' : '固定', 'fixed', fixed ? 'tabler:pinned-off' : 'tabler:pinned'),
      createItem('内容区全屏', 'maximize', 'tabler:window-maximize'),
      createItem('新窗口打开', 'newWindow', 'tabler:app-window'),
      { type: 'divider', key: 'd2' },

      createItem('关闭其他标签页', 'closeOther', 'tabler:arrow-bar-both', disabledMap.closeOther),
      createItem('关闭左侧标签页', 'closeLeft', 'tabler:arrow-bar-to-left', disabledMap.closeLeft),
      createItem('关闭右侧标签页', 'closeRight', 'tabler:arrow-bar-to-right', disabledMap.closeRight),
    ]
  })

  /**
   * @description: 2️⃣ 策略模式处理菜单动作
   */
  const actionMap: Record<string, (tab: PageTab, index: number) => void> = {
    refresh: () => reloadPage(),
    close: (tab, index) => pageTabsStore.closeTab(tab.key, index),
    fixed: (tab, index) => pageTabsStore.toggleFixedTab(tab.key, index),
    closeOther: tab => pageTabsStore.closeOtherTabs(tab.key),
    closeLeft: (tab, index) => pageTabsStore.closeLeftTabs(tab.key, index),
    closeRight: (tab, index) => pageTabsStore.closeRightTabs(tab.key, index),
    maximize: (tab) => {
      // 如果不是当前标签页，先进行路由跳转
      if (tab.key !== activeTab.value) {
        pageTabsStore.setActiveTab(tab)
      }
      toggleMaximize()
    },
    newWindow: tab => openInNewWindow(tab.path),
  }

  /**
   * @description: 3️⃣ 处理右键菜单选择
   */
  function handleSelect(key: string | number) {
    const tab = currentRightClickTab.value
    if (!tab)
      return

    showDropdown.value = false

    // 获取当前标签页的索引
    const index = findIndex(tabs.value, t => t.key === tab.key)

    // 触发事件
    const action = actionMap[String(key)]
    action?.(tab, index)
  }

  /**
   * @description: 4️⃣ 标签页右键点击事件（需阻止默认行为）
   */
  function handleTabRightClick(e: MouseEvent, tab: PageTab) {
    showDropdown.value = false

    // 使用 nextTick 确保 DOM 更新后重新计算位置并显示
    nextTick().then(() => {
      currentRightClickTab.value = tab
      dropdownX.value = e.clientX
      dropdownY.value = e.clientY
      showDropdown.value = true
    })
  }

  /**
   * @description: 点击外部关闭下拉菜单
   */
  function onClickOutside() {
    showDropdown.value = false
  }

  return {
    // 状态
    showDropdown,
    dropdownX,
    dropdownY,
    menuOptions,

    // 方法
    handleSelect,
    handleTabRightClick,
    onClickOutside,
  }
}
