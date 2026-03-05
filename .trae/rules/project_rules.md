# 项目开发规范（精简优化版）

## 一、核心技术栈（强制）

必须基于 **Vue 3.5+ + Vite 7+ + Pinia + TypeScript** 开发

## 二、UI 与样式（强制）

1. **唯一 UI 库**：Naive UI（使用前务必查阅[最新官方文档](https://www.naiveui.com/)）
2. **样式方案**：UnoCSS

## 三、工具链（强制，禁止手动造轮子）

| 场景       | 工具/插件                        | 说明                                                                                    |
| ---------- | -------------------------------- | --------------------------------------------------------------------------------------- |
| 数据处理   | es-toolkit                       | 所有数据逻辑优先用它封装的方法                                                          |
| 代码规范   | @antfu/eslint-config             | 严格遵循其规则                                                                          |
| 路由       | unplugin-vue-router + vue-router | 按约定式路由开发                                                                        |
| 日期处理   | Day.js                           | 所有日期相关逻辑                                                                        |
| 网络请求   | Alova                            | 统一请求层封装[最新文档](https://alova.js.org/zh-CN/tutorial/getting-started/introduce) |
| 通用 Hooks | VueUse                           | 使用前查[最新文档](https://vueuse.org/)                                                 |

## 四、代码风格（强制）

- **简洁优先**：避免冗余 if/for，优先用函数式/声明式写法
- **可维护性**：逻辑分层清晰，命名精准，不写“聪明但晦涩”的代码
- **可复用性**：组件封装清晰，复用性高，无副作用
<!-- - **可测试性**：测试用例编写清晰，测试用例覆盖全面 -->
- **可扩展性**：代码结构清晰，可扩展性高，可维护性高
- **要求代码 简洁高级优雅不冗余**，多使用 es-toolkit 工具库，多使用 VueUse 中的 hooks，多使用 naive-ui 的组件

## 五、参考项目

可参考以下中后台系统的设计与实现思路：

- https://www.vben.pro/#/analytics
- https://naive-ui-admin.vercel.app/about/index
- https://naive.soybeanjs.cn/pro-naive/form/step
- https://admin.slashspaces.com/workbench
- https://vuejs-core.cn/shop-vite/?from=website#/index
- https://www.artd.pro/#/change/log
- https://fantastic-admin.hurui.me/pro-example/#/menu_badge_example/text

---
