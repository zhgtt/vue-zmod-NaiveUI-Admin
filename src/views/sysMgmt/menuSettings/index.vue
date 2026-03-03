<script setup lang="ts">
import { useMenuStore } from '@/store'

definePage({
  name: 'menuSettings',
  meta: {
    title: '菜单管理',
    query: { a: 1 },
    menuProps: {
      iconConfig: { name: 'solar:home-angle-2-broken', type: 'iconify' },
      order: 2,
      badge: { type: 'dot' }
    },
  },
})

const menuStore = useMenuStore()

function handleClick() {
  menuStore.setMenuBadge('sysMgmt', {
    type: 'dot',
    color: '#52c41a', // 自定义颜色
  })
  // 1. 添加徽标
  menuStore.setMenuBadge('userSettings', {
    type: 'tag',
    value: '11',
    // color: '#52c41a', // 自定义颜色
  })
}
// 1. 设置圆点标记 (呼吸灯效果)
</script>

<template>
  菜单管理

  <n-button @click="handleClick">
    设置徽标
  </n-button>

  <SvgIcon name="moon" />
</template>

<style scoped></style>
