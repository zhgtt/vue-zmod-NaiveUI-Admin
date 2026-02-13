<script setup lang="ts">
/**
 * @description: 主体内容展示区域
 */
import { useLayoutStore } from '@/store'

defineOptions({
  name: 'GlobalContent',
})

const layoutStore = useLayoutStore()

const { asyncStyle } = storeToRefs(layoutStore)
</script>

<template>
  <RouterView v-slot="{ Component, route }">
    <main
      class="flex flex-col flex-grow transition-all-300 overflow-y-auto"
      :style="{ paddingLeft: `${asyncStyle.contentOffsetLeft}px` }"
    >
      <div class="p-4 bg-#F5F8FA">
        <!--    <Transition> -->
        <!--      <KeepAlive> -->
        <component :is="Component" />
        <!--      </KeepAlive> -->
        <!--    </Transition> -->
      </div>
    </main>
  </RouterView>
</template>

<style scoped></style>
