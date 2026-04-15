// 这个文件负责创建 Spark Viewer 的界面结构，并把用户输入交给实际渲染器。

import './style.css'

import { createSparkViewer } from './viewer/spark-viewer.js'
import {
  DEFAULT_SPLAT_URL,
  mergeViewerOptions,
  readViewerOptionsFromUrl,
} from './config/viewer-config.js'
import {
  describeSceneSource,
  resolveSceneSource,
} from './config/scene-source.js'
import {
  createInitialShellState,
  getLoadedShellState,
  toggleSidebarCollapsed,
} from './config/viewer-shell.js'

const ACCEPTED_FILE_TYPES = '.ply,.spz,.splat,.ksplat,.zip,.rad,.sog'

const app = document.querySelector('#app')

if (!app) {
  throw new Error('页面缺少 #app 容器，无法初始化 Viewer。')
}

app.innerHTML = `
  <div class="layout" id="layout">
    <div class="ambient ambient-a"></div>
    <div class="ambient ambient-b"></div>
    <div class="ambient ambient-c"></div>

    <main class="viewport-wrap" id="viewport-wrap">
      <canvas id="viewer-canvas"></canvas>

      <section class="landing-screen" id="landing-screen">
        <div class="landing-card" id="landing-card">
          <p class="eyebrow">Spark 2.0 Preview</p>
          <h1>把 3DGS 文件拖进来</h1>
          <p class="landing-description">默认先进入全屏主页。你可以直接拖拽本地文件，也可以输入远程地址后开始查看。</p>

          <div class="landing-dropzone">
            <p class="landing-drop-title">拖拽本地文件到这里</p>
            <p class="landing-drop-subtitle">支持 .ply / .spz / .splat / .ksplat / .zip / .rad / .sog</p>
            <button type="button" id="landing-pick-file" class="landing-primary-button">选择本地文件</button>
          </div>

          <form id="landing-form" class="landing-form">
            <input
              id="landing-url"
              name="landingUrl"
              type="url"
              placeholder="输入远程 splat 地址，例如 https://example.com/scene.spz"
              autocomplete="off"
            />
            <button type="submit" class="landing-secondary-button">加载远程场景</button>
          </form>

          <div class="landing-quick-actions">
            <button type="button" id="landing-sample" class="landing-tertiary-button">载入官方示例</button>
          </div>
        </div>
      </section>

      <div class="drop-overlay" id="drop-overlay">
        <div class="drop-overlay-card">
          <p>松开鼠标后立即加载本地文件</p>
        </div>
      </div>
    </main>

    <aside class="panel-shell" id="panel-shell">
      <button type="button" id="sidebar-toggle" class="sidebar-toggle" aria-label="切换侧边栏">
        <span class="sidebar-toggle-icon">☰</span>
      </button>

      <aside class="panel" id="sidebar-panel">
        <div class="panel-glow"></div>

        <div class="panel-section panel-header">
          <p class="eyebrow">Spark 2.0 Preview</p>
          <h2>3DGS Viewer</h2>
          <p class="description">场景加载后显示这个侧边栏，你可以随时折叠收起。</p>
        </div>

        <form id="viewer-form" class="viewer-form">
          <label class="field">
            <span>文件地址</span>
            <input
              id="splat-url"
              name="splatUrl"
              type="url"
              placeholder="https://example.com/scene.spz"
              autocomplete="off"
            />
          </label>

          <div class="toggle-group">
            <label class="toggle">
              <input id="lod" name="lod" type="checkbox" />
              <span>自动 LoD</span>
            </label>
            <label class="toggle">
              <input id="paged" name="paged" type="checkbox" />
              <span>流式加载</span>
            </label>
            <label class="toggle">
              <input id="ext-splats" name="extSplats" type="checkbox" />
              <span>高精度坐标</span>
            </label>
          </div>

          <div class="drop-card" id="drop-card">
            <p class="drop-title">拖拽本地文件到这里</p>
            <p class="drop-subtitle">支持 .ply / .spz / .splat / .ksplat / .zip / .rad / .sog</p>
            <button type="button" id="pick-file" class="secondary wide-button">选择本地文件</button>
          </div>

          <div class="actions">
            <button type="submit">加载远程场景</button>
            <button type="button" id="load-sample" class="secondary">载入示例</button>
          </div>
        </form>

        <div class="info-card panel-section">
          <p class="info-title">当前来源</p>
          <p id="source-text" class="status-text">远程文件 ${DEFAULT_SPLAT_URL}</p>
          <p id="status-text" class="progress-text">正在准备 Viewer…</p>
          <p id="progress-text" class="progress-text">等待加载</p>
        </div>

        <div class="info-card panel-section">
          <p class="info-title">操作方式</p>
          <ul class="tips">
            <li>拖拽文件到页面：直接打开本地场景</li>
            <li>鼠标拖动：旋转视角</li>
            <li>滚轮：前后移动</li>
            <li>W / A / S / D：平移</li>
            <li>Shift：加速移动</li>
          </ul>
        </div>
      </aside>

      <input id="file-input" class="hidden-input" type="file" accept="${ACCEPTED_FILE_TYPES}" />
    </aside>
  </div>
`

const form = document.querySelector('#viewer-form')
const landingForm = document.querySelector('#landing-form')
const layout = document.querySelector('#layout')
const viewportWrap = document.querySelector('#viewport-wrap')
const landingScreen = document.querySelector('#landing-screen')
const landingCard = document.querySelector('#landing-card')
const panelShell = document.querySelector('#panel-shell')
const sidebarPanel = document.querySelector('#sidebar-panel')
const sidebarToggle = document.querySelector('#sidebar-toggle')
const dropCard = document.querySelector('#drop-card')
const dropOverlay = document.querySelector('#drop-overlay')
const fileInput = document.querySelector('#file-input')
const pickFileButton = document.querySelector('#pick-file')
const landingPickFileButton = document.querySelector('#landing-pick-file')
const landingSampleButton = document.querySelector('#landing-sample')
const urlInput = document.querySelector('#splat-url')
const landingUrlInput = document.querySelector('#landing-url')
const lodInput = document.querySelector('#lod')
const pagedInput = document.querySelector('#paged')
const extSplatsInput = document.querySelector('#ext-splats')
const sourceText = document.querySelector('#source-text')
const statusText = document.querySelector('#status-text')
const progressText = document.querySelector('#progress-text')
const sampleButton = document.querySelector('#load-sample')
const canvas = document.querySelector('#viewer-canvas')

if (
  !(form instanceof HTMLFormElement) ||
  !(landingForm instanceof HTMLFormElement) ||
  !(layout instanceof HTMLElement) ||
  !(viewportWrap instanceof HTMLElement) ||
  !(landingScreen instanceof HTMLElement) ||
  !(landingCard instanceof HTMLElement) ||
  !(panelShell instanceof HTMLElement) ||
  !(sidebarPanel instanceof HTMLElement) ||
  !(sidebarToggle instanceof HTMLButtonElement) ||
  !(dropCard instanceof HTMLElement) ||
  !(dropOverlay instanceof HTMLElement) ||
  !(fileInput instanceof HTMLInputElement) ||
  !(pickFileButton instanceof HTMLButtonElement) ||
  !(landingPickFileButton instanceof HTMLButtonElement) ||
  !(landingSampleButton instanceof HTMLButtonElement) ||
  !(urlInput instanceof HTMLInputElement) ||
  !(landingUrlInput instanceof HTMLInputElement) ||
  !(lodInput instanceof HTMLInputElement) ||
  !(pagedInput instanceof HTMLInputElement) ||
  !(extSplatsInput instanceof HTMLInputElement) ||
  !(sourceText instanceof HTMLElement) ||
  !(statusText instanceof HTMLElement) ||
  !(progressText instanceof HTMLElement) ||
  !(sampleButton instanceof HTMLButtonElement) ||
  !(canvas instanceof HTMLCanvasElement)
) {
  throw new Error('页面元素初始化失败，无法继续创建 Viewer。')
}

const viewer = createSparkViewer({
  canvas,
  onStatusChange: (message) => {
    statusText.textContent = message
  },
  onProgressChange: (message) => {
    progressText.textContent = message
  },
})

let currentLocalFile = null
let dragDepth = 0

const currentUrl = new URL(window.location.href)
const initialOptions = readViewerOptionsFromUrl(currentUrl)
let shellState = createInitialShellState({ hasInitialScene: currentUrl.searchParams.has('url') })

applyFormOptions(initialOptions)
landingUrlInput.value = initialOptions.splatUrl
applyShellState(shellState)

if (shellState.showLanding) {
  refreshSourceText(initialOptions)
} else {
  loadScene(initialOptions)
}

form.addEventListener('submit', async (event) => {
  event.preventDefault()
  currentLocalFile = null
  await loadScene(getFormOptions())
})

landingForm.addEventListener('submit', async (event) => {
  event.preventDefault()
  currentLocalFile = null
  const options = mergeViewerOptions({
    splatUrl: landingUrlInput.value,
    lod: lodInput.checked,
    paged: pagedInput.checked,
    extSplats: extSplatsInput.checked,
  })
  applyFormOptions(options)
  await loadScene(options)
})

sampleButton.addEventListener('click', async () => {
  currentLocalFile = null
  const options = createSampleOptions()
  applyFormOptions(options)
  landingUrlInput.value = options.splatUrl
  await loadScene(options)
})

landingSampleButton.addEventListener('click', async () => {
  currentLocalFile = null
  const options = createSampleOptions()
  applyFormOptions(options)
  landingUrlInput.value = options.splatUrl
  await loadScene(options)
})

sidebarToggle.addEventListener('click', () => {
  shellState = {
    ...shellState,
    sidebarCollapsed: toggleSidebarCollapsed(shellState.sidebarCollapsed),
  }
  applyShellState(shellState)
})

pickFileButton.addEventListener('click', () => {
  fileInput.click()
})

landingPickFileButton.addEventListener('click', () => {
  fileInput.click()
})

fileInput.addEventListener('change', async (event) => {
  const file = event.target.files?.[0]

  if (!file) {
    return
  }

  await loadLocalFile(file)
  fileInput.value = ''
})

urlInput.addEventListener('input', () => {
  if (urlInput.value.trim()) {
    currentLocalFile = null
    landingUrlInput.value = urlInput.value
    refreshSourceText(getFormOptions())
  }
})

landingUrlInput.addEventListener('input', () => {
  if (landingUrlInput.value.trim()) {
    currentLocalFile = null
  }
})

;[layout, viewportWrap, dropCard, landingCard, canvas].forEach((element) => {
  element.addEventListener('dragenter', handleDragEnter)
  element.addEventListener('dragover', handleDragOver)
  element.addEventListener('dragleave', handleDragLeave)
  element.addEventListener('drop', handleDrop)
})

// 从表单里收集当前配置。
function getFormOptions() {
  return mergeViewerOptions({
    splatUrl: urlInput.value,
    lod: lodInput.checked,
    paged: pagedInput.checked,
    extSplats: extSplatsInput.checked,
  })
}

// 把配置写回表单，保持界面和实际状态一致。
function applyFormOptions(options) {
  urlInput.value = options.splatUrl
  landingUrlInput.value = options.splatUrl
  lodInput.checked = options.lod
  pagedInput.checked = options.paged
  extSplatsInput.checked = options.extSplats
}

// 切换主页和侧边栏的显示状态。
function applyShellState(state) {
  layout.classList.toggle('is-landing', state.showLanding)
  landingScreen.classList.toggle('hidden', !state.showLanding)
  panelShell.classList.toggle('hidden', !state.sidebarVisible)
  panelShell.classList.toggle('collapsed', state.sidebarCollapsed)
  sidebarPanel.setAttribute('aria-hidden', String(state.sidebarCollapsed))
  sidebarToggle.setAttribute('aria-expanded', String(!state.sidebarCollapsed))
  sidebarToggle.title = state.sidebarCollapsed ? '展开侧边栏' : '收起侧边栏'
}

// 加载远程或本地场景，并同步页面上的来源说明。
async function loadScene(options) {
  applyFormOptions(options)

  const source = resolveSceneSource({ options, file: currentLocalFile })
  refreshSourceText(options)
  syncUrl(options, source.kind)

  shellState = {
    ...getLoadedShellState(),
    sidebarCollapsed: shellState.sidebarCollapsed,
  }
  applyShellState(shellState)

  await viewer.load({ options, source })
}

// 读取本地文件后立即开始加载。
async function loadLocalFile(file) {
  currentLocalFile = file
  const options = getFormOptions()
  refreshSourceText(options)
  await loadScene(options)
}

// 更新来源说明，让用户知道当前渲染的是什么。
function refreshSourceText(options) {
  const source = resolveSceneSource({ options, file: currentLocalFile })
  sourceText.textContent = describeSceneSource(source)
}

// 生成示例场景配置。
function createSampleOptions() {
  return mergeViewerOptions({
    splatUrl: DEFAULT_SPLAT_URL,
    lod: true,
    paged: false,
    extSplats: false,
  })
}

// 更新地址栏；本地文件不写入 URL，只保留远程模式的地址。
function syncUrl(options, sourceKind) {
  const url = new URL(window.location.href)
  url.searchParams.set('lod', String(options.lod))
  url.searchParams.set('paged', String(options.paged))
  url.searchParams.set('extSplats', String(options.extSplats))

  if (sourceKind === 'remote-url') {
    url.searchParams.set('url', options.splatUrl)
  } else {
    url.searchParams.delete('url')
  }

  window.history.replaceState({}, '', url)
}

// 进入拖拽状态时显示覆盖层。
function handleDragEnter(event) {
  if (!hasFiles(event)) {
    return
  }

  event.preventDefault()
  dragDepth += 1
  dropOverlay.classList.add('active')
  dropCard.classList.add('active')
  landingCard.classList.add('drag-active')
}

// 拖拽经过时阻止浏览器直接打开文件。
function handleDragOver(event) {
  if (!hasFiles(event)) {
    return
  }

  event.preventDefault()
  event.dataTransfer.dropEffect = 'copy'
}

// 离开拖拽区域时恢复普通状态。
function handleDragLeave(event) {
  if (!hasFiles(event)) {
    return
  }

  event.preventDefault()
  dragDepth = Math.max(dragDepth - 1, 0)

  if (dragDepth === 0) {
    dropOverlay.classList.remove('active')
    dropCard.classList.remove('active')
    landingCard.classList.remove('drag-active')
  }
}

// 放下文件后读取第一个文件并立即加载。
async function handleDrop(event) {
  if (!hasFiles(event)) {
    return
  }

  event.preventDefault()
  dragDepth = 0
  dropOverlay.classList.remove('active')
  dropCard.classList.remove('active')
  landingCard.classList.remove('drag-active')

  const file = event.dataTransfer.files?.[0]

  if (!file) {
    return
  }

  await loadLocalFile(file)
}

// 只在拖拽的是文件时才接管事件。
function hasFiles(event) {
  return Array.from(event.dataTransfer?.types ?? []).includes('Files')
}
