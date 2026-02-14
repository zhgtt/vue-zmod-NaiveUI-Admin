<script setup lang="ts">
/**
 * @description: logo 组件
 */
import { useLayoutStore, useMenuStore } from '@/store'

defineOptions({
  name: 'GlobalLogo',
})

// 获取布局配置
const layoutStore = useLayoutStore()
const menuStore = useMenuStore()

const { headerConfig, sideBarWidth, sideBarConfig } = storeToRefs(layoutStore)
const { collapsed } = storeToRefs(menuStore)

// 显示标题的状态
const showTitle = ref(false)
// logo 宽度
const logoWidth = ref(sideBarConfig.value.width)

// 🍄 监听导航模式变化，动态更改样式
watchEffect(() => {
  const isCollapsed = collapsed.value

  // 折叠时
  if (isCollapsed) {
    // 改变 logo 宽度
    logoWidth.value = sideBarWidth.value
    // 不显示标题
    showTitle.value = false
  }
  else {
    logoWidth.value = sideBarConfig.value.width
    showTitle.value = true
  }
})
</script>

<template>
  <a
    href="/"
    class="w-full flex-center"
    :style="{ width: `${logoWidth}px`, height: `${headerConfig.height}px` }"
  >
    <!-- TODO logo 图标需要自定义，也有可能是一个图片 -->
    <SvgIcon name="leo" type="icon-park" :style="{ fontSize: '2em' }" />

    <!-- 只在未折叠时显示标题 -->
    <!-- TODO 动画效果后期改成使用 动画库 -->
    <transition name="fade">
      <h2 v-if="showTitle" class="pl-2 text-4 font-bold">{{ headerConfig.title }}</h2>
    </transition>
  </a>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
