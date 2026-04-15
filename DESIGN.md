# spark-3dgs-viewer DESIGN.md

## 1. Design Goal
把 3DGS Viewer 做成更像 Raycast 官网 / 桌面工具首页的体验：
- 默认首屏是聚焦“开始加载场景”的深色工作台
- 加载完成后退化成一个不打扰画面的悬浮控制面板
- 整体观感偏 macOS 原生、克制、锐利，而不是炫技式玻璃拟态

## 2. Visual Theme
- 主背景：近黑偏冷蓝 `#07080a`
- 主文本：近白 `#f9f9f9`
- 次文本：`#cdcdce`
- 弱文本：`#9c9c9d`
- 品牌强调：Raycast Red `#ff6363`
- 交互强调：Raycast Blue `#55b3ff`
- 成功态：`#5fc992`

## 3. Typography
- 主字体：Inter
- 等宽字体：Geist Mono
- 标题：大号、偏紧字距，仅用于主页 hero / 核心面板标题
- 正文：14–16px，略微正向字距，保证暗色背景下的清晰度

## 4. Surface Rules
- 卡片不用纯透明玻璃，使用深色实体 + 很轻的高光和边框
- 阴影采用多层结构：
  - 外层 containment ring
  - inset 顶部高光
  - 深色外投影
- 所有 surface 均保持克制，避免大面积蓝紫渐变

## 5. Component Rules
### Buttons
- 主按钮：白底深字，胶囊形，像桌面工具 CTA
- 次按钮：深色半透明底 + 细边框
- hover 主要靠 opacity / 微小抬升，不靠夸张变色

### Inputs
- 深色输入框，轻边框
- focus 使用细蓝色 ring
- placeholder 保持灰色，不抢主视觉

### Toggle / Mini Cards
- 使用统一圆角和统一轻阴影
- 视觉上更像设置面板的条目，而不是营销卡片

## 6. Layout Rules
### Landing
- 左侧：品牌、hero 标题、说明、能力点
- 右侧：拖拽 / URL / 示例入口
- 让“加载场景”永远是视觉主动作

### Sidebar
- 左上角悬浮
- 默认展开，但能一键折叠
- 展开时像工具抽屉；折叠后只留小按钮

## 7. Motion
- 全局过渡轻量、快速
- transform 控制在 1–4px 的细微位移
- 不使用大范围弹性动画

## 8. Don’ts
- 不要做亮色霓虹科技风
- 不要做过厚玻璃和过重描边
- 不要让控制栏长期抢过 Viewer 画面
- 不要在主页堆太多解释性文字
