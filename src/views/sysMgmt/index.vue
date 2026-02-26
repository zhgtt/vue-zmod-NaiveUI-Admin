<script setup lang="ts">
definePage({
  name: 'sysMgmt',
  redirect: '/sysMgmt/UserSettings',
  meta: {
    title: '系统管理',
    menuProps: {
      iconConfig: { name: 'solar:home-angle-2-broken', type: 'iconify' },
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
