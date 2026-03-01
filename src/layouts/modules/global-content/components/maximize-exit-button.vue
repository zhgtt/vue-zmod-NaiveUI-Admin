<script setup lang="ts">
/**
 * @description 退出页面最大化的按钮组件
 */
import { useAppActions } from '@/hooks'

import { useLayoutStore } from '@/store'

defineOptions({
  name: 'MaximizeExitButton',
})

const layoutStore = useLayoutStore()

const { isMaximized } = storeToRefs(layoutStore)

const { toggleMaximize } = useAppActions()
</script>

<template>
  <div
    v-if="isMaximized"
    class="fixed top-0 right-0 z-999 w-10 h-10 bg-#2d8cf0 cursor-pointer flex-center pr-1 pt-1 rounded-bl-full transition-opacity hover:opacity-80"
    @click="toggleMaximize"
  >
    <SvgIcon type="iconify" name="tabler:minimize" class="text-white text-lg" />
  </div>
</template>

<style scoped></style>
