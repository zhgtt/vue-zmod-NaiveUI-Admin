<script setup lang="ts">
/**
 * 封装 图标 组件，支持 自定义 svg 图标、以及引入各大图标库，如 iconify 等
 */
import type { CSSProperties } from 'vue'

import { Icon } from '@iconify/vue'

// 定义组件属性类型
export interface IconProps {
  type?: 'local' | 'iconify' // 图标类型，默认为 local
  name: string // 图标名称
}

defineOptions({
  name: 'SvgIcon',
  inheritAttrs: false, // 不继承父组件的任何属性
})

const props = withDefaults(defineProps<IconProps>(), {
  type: 'local',
})

// 获取组件的内置属性
const attrs = useAttrs()
const bindAttrs = computed<{ class: string, style: CSSProperties }>(() => {
  return {
    class: (attrs.class as string) || '',
    style: (attrs.style as CSSProperties) || '',
  }
})

// 定义本地项目中的图标 name
const symbolId = computed(() => {
  const { VITE_ICON_LOCAL_PREFIX: prefix } = import.meta.env // 前缀名称，可在 env 中自定义

  const iconName = props.name || 'no-icon'

  return `#${prefix}-${iconName}`
})
</script>

<template>
  <!-- 本地 svg，默认为 16px -->
  <template v-if="type === 'local'">
    <svg aria-hidden="true" width="1em" height="1em" v-bind="bindAttrs">
      <use :xlink:href="symbolId" fill="currentColor" />
    </svg>
  </template>

  <!-- iconify 图标库 -->
  <template v-if="type === 'iconify'">
    <Icon :icon="name" v-bind="bindAttrs" />
  </template>
</template>

<style scoped></style>
