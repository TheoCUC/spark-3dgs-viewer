# spark-3dgs-viewer

中文 | [English](#english)

一个基于 Spark 2.0 preview 的 3D Gaussian Splatting 网页 Viewer。

主要特性：
- 默认显示极简全屏主页
- 支持拖拽或选择本地 3DGS 文件
- 支持远程场景 URL 加载与示例快捷入口
- 支持自动 LoD、流式加载、高精度坐标切换
- 加载后显示可折叠悬浮侧边栏
- 已配置 GitHub Pages 自动部署

## 在线地址

- GitHub Pages: https://theocuc.github.io/spark-3dgs-viewer/

## 技术栈

- Vite
- Three.js
- Spark 2.0 preview
- 原生 JavaScript + CSS

## 本地运行

```bash
cd ~/Code/spark-3dgs-viewer
npm install
npm run dev -- --host 0.0.0.0
```

## 打包

```bash
npm run build
```

## 测试

```bash
npm test
```

## GitHub Pages 部署

这个仓库已经包含 GitHub Pages 自动部署配置：

- workflow: `.github/workflows/deploy-pages.yml`
- Vite 会通过 `VITE_BASE_PATH` 自动设置 `base`
- 当前仓库 `TheoCUC/spark-3dgs-viewer` 的 Pages 路径为：`/spark-3dgs-viewer/`

如果首次启用，请在 GitHub 仓库中确认：
- Settings → Pages
- Build and deployment → Source
- 选择 `GitHub Actions`

之后每次 push 到 `main`，Actions 会自动：
1. 安装依赖
2. 运行测试
3. 构建站点
4. 发布到 GitHub Pages

## 当前已实现

- Spark 2.0 preview 接入
- 极简 landing 页面
- 本地文件拖拽/选择加载
- 远程 URL 加载
- 示例场景入口
- 可折叠悬浮侧边栏
- 状态显示与基础交互
- GitHub Pages 自动发布

## 参考

- Spark 官方文档：Getting Started / New Features in 2.0 / Level-of-Detail / Controls
- Spark 官方示例：`examples/viewer/index.html`
- Spark 仓库：`sparkjsdev/spark` 的 `v2.0.0-preview`

---

## English

A web-based 3D Gaussian Splatting viewer powered by Spark 2.0 preview.

Key features:
- Minimal full-screen landing page by default
- Drag-and-drop or file picker for local 3DGS assets
- Remote scene loading via URL and built-in sample shortcut
- Toggles for auto LoD, paged loading, and high-precision coordinates
- Floating collapsible sidebar after scene load
- GitHub Pages auto deployment is already configured

## Live Demo

- GitHub Pages: https://theocuc.github.io/spark-3dgs-viewer/

## Tech Stack

- Vite
- Three.js
- Spark 2.0 preview
- Vanilla JavaScript + CSS

## Run Locally

```bash
cd ~/Code/spark-3dgs-viewer
npm install
npm run dev -- --host 0.0.0.0
```

## Build

```bash
npm run build
```

## Test

```bash
npm test
```

## GitHub Pages Deployment

This repository already includes GitHub Pages automation:

- workflow: `.github/workflows/deploy-pages.yml`
- Vite switches `base` automatically through `VITE_BASE_PATH`
- For `TheoCUC/spark-3dgs-viewer`, the Pages base path is `/spark-3dgs-viewer/`

If this is the first time enabling Pages, make sure the repository setting is:
- Settings → Pages
- Build and deployment → Source
- Select `GitHub Actions`

After that, every push to `main` will automatically:
1. install dependencies
2. run tests
3. build the site
4. deploy to GitHub Pages

## Implemented So Far

- Spark 2.0 preview integration
- Minimal landing page
- Local file drag-and-drop / picker loading
- Remote URL loading
- Sample scene shortcut
- Floating collapsible sidebar
- Status display and core interactions
- GitHub Pages auto publishing

## References

- Spark docs: Getting Started / New Features in 2.0 / Level-of-Detail / Controls
- Spark example viewer: `examples/viewer/index.html`
- Spark repo: `sparkjsdev/spark` on `v2.0.0-preview`
