<script setup lang="ts">
/**
 * @description: 底部展示区域
 */
import { useLayoutStore } from '@/store'

defineOptions({
  name: 'GlobalFooter',
})

const layoutStore = useLayoutStore()

const { footerConfig, asyncStyle } = storeToRefs(layoutStore)
</script>

<template>
  <footer
    class="flex-shrink-0 transition-all-300 z-93"
    :style="{
      paddingLeft: `${asyncStyle.contentOffsetLeft}px`,
      height: `${footerConfig.height}px`,
    }"
  >
    <div class="bg-white transition-300 h-full flex-center">
      底部内容
    </div>
  </footer>
</template>

<style scoped>

</style>
