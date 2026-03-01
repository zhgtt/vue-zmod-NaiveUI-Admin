<script setup lang="ts">
definePage({
  name: 'menuSettings',
  meta: {
    title: '菜单管理',
    query: { a: 1 },
    menuProps: {
      iconConfig: { name: 'solar:home-angle-2-broken', type: 'iconify' },
      order: 2,
    },
  },
})
</script>

<template>
  菜单管理

  <SvgIcon name="moon" />
</template>

<style scoped></style>
