# spark-3dgs-viewer

一个简单的网页 Viewer，用 Spark 2.0 preview 作为引擎来查看 3D Gaussian Splatting 场景。

## 这个项目能做什么

- 默认先显示一个全屏主页，引导你拖拽 3DGS 文件进入
- 把本地 splat 文件拖到页面里直接打开
- 也可以点击按钮选择本地文件
- 也支持输入一个 splat 文件地址，直接在浏览器里打开远程场景
- 场景加载后显示悬浮侧边栏，并且可以折叠收起
- 支持切换自动 LoD
- 支持切换流式加载
- 支持切换高精度坐标模式
- 远程地址模式会把当前配置写进地址栏，方便直接分享同一个 Viewer 链接

## 技术架构

- Vite：负责本地开发和打包
- THREE.js：负责基础相机、场景和渲染循环
- Spark 2.0 preview：负责 3DGS 的加载和显示
- 原生 JavaScript + CSS：负责界面和交互

## 本地运行

先进入项目目录：

```bash
cd ~/Code/spark-3dgs-viewer
```

安装依赖：

```bash
npm install
```

启动本地开发：

```bash
npm run dev -- --host 0.0.0.0
```

打包：

```bash
npm run build
```

## 部署方法和命令

这个项目当前是纯前端静态站点。

先打包：

```bash
npm run build
```

打包结果会在 `dist/` 目录里，可以直接部署到任何静态文件服务。

## 测试方法和常用命令

运行测试：

```bash
npm test
```

运行打包检查：

```bash
npm run build
```

## 搜索记录

- skills.sh：这次没有额外依赖第三方方案，直接按 Spark 官方文档做最小可运行实现。
- Spark 官方文档：重点参考了 Getting Started、New Features in 2.0、Spark Level-of-Detail、Controls。
- Spark 示例：参考了官方 `examples/viewer/index.html` 的拖拽和本地文件入口。
- Liquid Glass 参考：查了 Apple 风格相关资料，并参考了 Liquid Glass Studio、liquid-glass-js、以及 kube.io 的原理文章。
- GitHub：参考了 `sparkjsdev/spark` 的 `v2.0.0-preview` 分支，确认当前预览版仍在持续维护。

## 已完成功能

- 初始 npm 项目和前端开发环境
- Spark 2.0 preview 接入
- 3DGS Viewer 页面布局
- 默认全屏拖拽主页
- splat 地址输入和示例加载按钮
- 本地文件拖拽加载
- 本地文件选择按钮
- 自动 LoD、流式加载、高精度坐标开关
- 悬浮 liquid glass 风格侧边栏
- 侧边栏折叠收起
- 基本相机移动和状态提示
- 配置、来源和外壳状态测试

## 待办事项

- 暂无强制待办
