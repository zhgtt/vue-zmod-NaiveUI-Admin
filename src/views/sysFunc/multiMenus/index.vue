<script setup lang="ts">
definePage({
  name: 'multiMenus',
  redirect: '/sysFunc/multiMenus/menu1',
  meta: {
    title: '嵌套菜单',
    menuProps: {
      iconConfig: { name: 'home', type: 'icon-park' },
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
