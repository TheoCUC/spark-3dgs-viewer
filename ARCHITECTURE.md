# 架构说明

## 文件职责

- `index.html`：页面入口，挂载前端应用
- `src/main.js`：创建界面、读取表单、响应加载动作
- `src/config/viewer-config.js`：统一处理默认配置、表单值和 URL 查询参数
- `src/viewer/spark-viewer.js`：封装 Spark + THREE 的渲染、加载和相机定位逻辑
- `src/style.css`：页面布局和样式
- `tests/viewer-config.test.js`：验证 Viewer 配置整理逻辑
- `CONTEXT.md`：记录当前进度和关键决定
- `README.md`：项目说明、运行方法和搜索记录

## 模块调用关系

1. `index.html` 加载 `src/main.js`
2. `src/main.js` 调用 `viewer-config.js` 读取和整理配置
3. `src/main.js` 调用 `spark-viewer.js` 创建 Viewer 实例
4. `spark-viewer.js` 使用 THREE.js 和 Spark 完成渲染与场景加载
5. `tests/viewer-config.test.js` 直接验证 `viewer-config.js` 的行为

## 关键设计决定

- 用原生 JavaScript，不额外引入前端框架，先把 Viewer 保持简单。
- 把 Viewer 配置单独抽到 `viewer-config.js`，这样既方便测试，也方便以后继续扩展。
- 用 URL 查询参数保存当前配置，方便复现和分享。
- 默认提供 Spark 官方 butterfly 示例，保证项目打开后就能马上看到结果。
