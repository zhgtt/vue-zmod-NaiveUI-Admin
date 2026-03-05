<script setup lang="ts">
import { getHcInfo, getMenus } from '@/api/modules/common'

definePage({
  name: 'request',
  meta: {
    title: '请求管理',
    menuProps: {
      iconConfig: { name: 'solar:home-angle-2-broken', type: 'iconify' },
      order: 1,
    },
  },
})

const { data, send } = useRequest(getHcInfo, {
  immediate: false, // 是否立即发送请求
})

async function handleClick() {
  await send({ departure: '北京', arrival: '包头' })
  console.log('data: ', data.value)
}
</script>

<template>
  请求管理

  <n-button type="primary" @click="handleClick">
    获取火车信息
  </n-button>

  <div>{{ data }}</div>
</template>

<style scoped></style>
