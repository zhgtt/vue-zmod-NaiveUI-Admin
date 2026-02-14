<script setup lang="ts">
definePage({
  name: 'sysMgmt',
  redirect: '/sysMgmt/UserSettings',
  meta: {
    title: '系统管理',
    menuProps: {
      iconConfig: { name: 'home', type: 'icon-park' },
      order: 3,
      isChildMenu: false,
    },
  },
})
</script>

<template>
  系统管理
</template>

<style scoped></style>
