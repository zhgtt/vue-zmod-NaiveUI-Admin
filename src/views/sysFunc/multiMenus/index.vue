<script setup lang="ts">
definePage({
  name: 'multiMenus',
  redirect: '/sysFunc/multiMenus/menu1',
  meta: {
    title: '嵌套菜单',
    menuProps: {
      iconConfig: { name: 'solar:home-angle-2-broken', type: 'iconify' },
      order: 2,
      isChildMenu: false,
    },
  },
})
</script>

<template>
  多级菜单
</template>

<style scoped></style>
