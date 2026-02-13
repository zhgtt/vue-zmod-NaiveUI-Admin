<script setup lang="ts">
/**
 * @description: 🍄 页面中需使用 definePage 对路由/对应菜单进行设置
 *
 * ? 可自定义当前页面配置，比如自定义 name、redirect（重定向）、meta、alias 等属性，会和自动生成的路由合并
 */
definePage({
  name: 'home',
  meta: {
    title: '首页',
    menuProps: {
      iconConfig: { name: 'home', type: 'icon-park' },
      order: 1,
    },
  },
})

// const router = useRouter()

// function handleClick() {
//   router.push('/about')
// }
</script>

<template>
  <h1>首页面！！！！😐😐😐😐</h1>
  naive-ui组件
  <n-button type="primary">
    点击跳转
  </n-button>
</template>

<style scoped></style>
