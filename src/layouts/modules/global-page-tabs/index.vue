<script setup lang="ts">
/**
 * @description: TODO 标签栏内容
 */
import { useLayoutStore } from '@/store'

defineOptions({
  name: 'GlobalPageTabs',
})

/**
 * @description: 标签栏内容
 */

const layoutStore = useLayoutStore()

const { tabsConfig, asyncStyle, headerConfig } = storeToRefs(layoutStore)

const nameRef = ref(1)
// const message = useMessage()
const panelsRef = ref([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15])

function handleClose(name: number) {
  const { value: panels } = panelsRef
  if (panels.length === 1) {
    // message.error('最后一个了')
    return
  }
  // message.info(`关掉 ${name}`)
  const index = panels.findIndex(v => name === v)
  panels.splice(index, 1)
  if (nameRef.value === name) {
    nameRef.value = panels[index]
  }
}

const name = nameRef
const panels = panelsRef
</script>

<template>
  <div :style="{ height: `${headerConfig.height}px` }" />
  <div
    class="flex-shrink-0 w-full transition-all-300 absolute top-10 left-0 z-97"
    :style="{
      height: `${tabsConfig.height}px`,
      paddingLeft: `${asyncStyle.headerOffsetLeft}px`,
    }"
  >
    <n-tabs
      v-model:value="name"
      type="card"
      closable
      tab-style="min-width: 80px;"
      @close="handleClose"
    >
      <n-tab-pane
        v-for="panel in panels"
        :key="panel"
        :tab="panel.toString()"
        :name="panel"
      >
        {{ panel }}
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<style scoped>

</style>
