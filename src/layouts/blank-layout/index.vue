<script setup lang="ts">
/**
 * 空白布局容器
 */
defineOptions({
  name: 'BlankLayout',
})
</script>

<template>
  <RouterView v-slot="{ Component, route }">
    <main class="h-full transition-all-300">
      <!--    <Transition> -->
      <!--      <KeepAlive> -->
      <component :is="Component" />
      <!--      </KeepAlive> -->
      <!--    </Transition> -->
    </main>
  </RouterView>
</template>

<style scoped>

</style>
