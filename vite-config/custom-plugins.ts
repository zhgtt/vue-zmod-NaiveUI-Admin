/**
 * @description: 自定义插件
 */
import type { PluginOption } from 'vite'

import path from 'node:path' // 引入 path 模块处理路径
import process from 'node:process'

/**
 * @description: 自定义插件
 */

// 1️⃣ 删除 views 下的目录或文件时，精准控制路由的更新
// * 此插件为解决删除文件目录时，vite 监听不到文件的变化，导致路由数据没有实时更新的问题
export function RouterWatcherPlugin(): PluginOption {
  return {
    name: 'vite:router-watcher-plugin',
    configureServer(server) {
      // 获取 src/views 的绝对路径，确保跨平台匹配准确
      const viewsPath = path.resolve(process.cwd(), 'src/views').replace(/\\/g, '/')

      server.watcher.on('all', (event, filePath) => {
        // 1. 标准化路径（将 Windows 的 \ 转为 /）
        const normalizedPath = filePath.replace(/\\/g, '/')

        // 2. 检查是否在 src/views 目录下
        const isInViews = normalizedPath.startsWith(viewsPath)

        // 3. 检查是否是 index.vue 文件
        const isIndexFile = normalizedPath.endsWith('index.vue')

        // 4. 定义触发重启的事件：删除文件、删除目录
        const isStructureChange = ['unlink', 'unlinkDir'].includes(event)

        // 逻辑组合：必须在 views 目录下，且是 index.vue 的增删，或者是目录的增删
        if (isInViews && isStructureChange && (isIndexFile || event.includes('Dir'))) {
          console.warn(`\n[路由结构变更] 检测到 ${event}: ${path.relative(process.cwd(), filePath)}`)

          server.restart().then(() => {
            console.warn('🚀 重启服务重启成功，路由数据已同步...\n')
          })
        }
      })
    },
  }
}
