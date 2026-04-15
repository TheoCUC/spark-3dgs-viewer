# 架构说明

## 文件职责

- `index.html`：页面入口，挂载前端应用
- `src/main.js`：创建界面、切换主页/Viewer 状态、响应远程加载和本地拖拽加载
- `src/config/viewer-config.js`：统一处理默认配置、表单值和 URL 查询参数
- `src/config/scene-source.js`：统一描述远程地址和本地文件两种场景来源
- `src/config/viewer-shell.js`：管理全屏主页、侧边栏显示和折叠状态
- `src/viewer/spark-viewer.js`：封装 Spark + THREE 的渲染、加载和相机定位逻辑
- `src/style.css`：页面布局、全屏主页、悬浮玻璃侧边栏和拖拽样式
- `tests/viewer-config.test.js`：验证 Viewer 配置整理逻辑
- `tests/scene-source.test.js`：验证场景来源解析和说明文本
- `tests/viewer-shell.test.js`：验证主页与侧边栏外壳状态逻辑
- `CONTEXT.md`：记录当前进度和关键决定
- `README.md`：项目说明、运行方法和搜索记录

## 模块调用关系

1. `index.html` 加载 `src/main.js`
2. `src/main.js` 调用 `viewer-config.js` 读取和整理配置
3. `src/main.js` 调用 `scene-source.js` 决定当前是远程地址还是本地文件
4. `src/main.js` 调用 `viewer-shell.js` 决定当前显示全屏主页还是侧边栏 Viewer
5. `src/main.js` 调用 `spark-viewer.js` 创建 Viewer 实例
6. `spark-viewer.js` 使用 THREE.js 和 Spark 完成渲染与场景加载
7. 三组测试分别验证配置、来源和外壳状态逻辑

## 关键设计决定

- 用原生 JavaScript，不额外引入前端框架，先把 Viewer 保持简单。
- 把 Viewer 配置、场景来源和外壳状态拆成独立文件，方便测试和继续扩展。
- 远程 URL 与本地文件共用同一套 Viewer，只在加载前切换来源参数。
- 本地文件模式不写入 URL，避免浏览器地址栏出现不可分享的本地状态。
- 默认首屏改成全屏拖拽主页，降低第一次使用时的理解成本。
- 侧边栏只在场景加载后显示，并支持折叠，减少对画面的遮挡。
