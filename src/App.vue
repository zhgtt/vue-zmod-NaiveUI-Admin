<script setup lang="ts">
defineOptions({
  name: 'App',
})

const { VITE_LAYOUT_COMPONENT = 'base' } = import.meta.env
</script>

<template>
  <div
    class="h-full w-full relative"
    :class="[VITE_LAYOUT_COMPONENT === 'base' && 'overflow-hidden'] "
  >
    <RouterView />
  </div>
</template>

<style scoped></style>
