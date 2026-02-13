<script setup lang="ts">
/**
 * @description: 该页面作为 嵌套菜单 的父级菜单使用
 *
 * ? 该页面不能被当作页面展示，需指定 redirect 重定向路由
 */
definePage({
  name: 'sysFunc',
  redirect: '/sysFunc/request',
  meta: {
    title: '系统功能',
    menuProps: {
      iconConfig: { name: 'home', type: 'icon-park' },
      order: 2,
      isChildMenu: false,
    },
  },
})
</script>

<template>
  系统功能
</template>

<style scoped></style>
