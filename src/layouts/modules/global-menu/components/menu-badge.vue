<script setup lang="ts">
import type { IconProps } from '@/components/custom/SvgIcon.vue'

interface MenuBadgeProps {
  options: APP.Menu.MenuBadge
}

defineProps<MenuBadgeProps>()
</script>

<template>
  <div v-if="options.show !== false" class="ml-2 flex-y-center shrink-0">
    <!-- 1. 圆点 (Breathing Dot) -->
    <template v-if="options.type === 'dot'">
      <div class="relative flex-center h-2 w-2">
        <span
          class="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
          :style="{ backgroundColor: options.color || '#f5222d' }"
        />
        <span
          class="relative inline-flex h-2 w-2 rounded-full"
          :style="{ backgroundColor: options.color || '#f5222d' }"
        />
      </div>
    </template>

    <!-- 2. 标签 (Tag) -->
    <template v-if="options.type === 'tag'">
      <n-tag
      type="success"
        round
        v-bind="options.tagProps"
        :color="options.color"
        size="small"
        class="text-xs px-1.5 h-5 flex items-center justify-center""
      >
        {{ options.value }}
      </n-tag>
    </template>

    <!-- 3. 图标 (Icon) -->
     <template v-if="options.type === 'icon'">
      <SvgIcon v-bind="{...(options.iconConfig as IconProps)}" :class="options.class" />
     </template>
  </div>
</template>

<style scoped>
/* 如果项目使用了 UnoCSS，可以直接使用 animate-ping，否则需手动定义 */
/* @keyframes ping {
  75%,
  100% {
    transform: scale(2);
    opacity: 0;
  }
} */
/* .animate-ping {
  animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
} */
</style>
