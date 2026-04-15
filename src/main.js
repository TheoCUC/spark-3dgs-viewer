// 这个文件负责创建 Spark Viewer 的界面结构，并把用户输入交给实际渲染器。

import './style.css'

import { createSparkViewer } from './viewer/spark-viewer.js'
import {
  DEFAULT_SPLAT_URL,
  mergeViewerOptions,
  readViewerOptionsFromUrl,
} from './config/viewer-config.js'

const app = document.querySelector('#app')

if (!app) {
  throw new Error('页面缺少 #app 容器，无法初始化 Viewer。')
}

app.innerHTML = `
  <div class="layout">
    <aside class="panel">
      <div>
        <p class="eyebrow">Spark 2.0 Preview</p>
        <h1>3DGS Viewer</h1>
        <p class="description">
          输入一个 splat 文件地址，就可以直接在浏览器里查看 3DGS 场景。
        </p>
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

        <div class="actions">
          <button type="submit">加载场景</button>
          <button type="button" id="load-sample" class="secondary">载入示例</button>
        </div>
      </form>

      <div class="info-card">
        <p class="info-title">当前状态</p>
        <p id="status-text" class="status-text">正在准备 Viewer…</p>
        <p id="progress-text" class="progress-text">等待加载</p>
      </div>

      <div class="info-card">
        <p class="info-title">操作方式</p>
        <ul class="tips">
          <li>鼠标拖动：旋转视角</li>
          <li>滚轮：前后移动</li>
          <li>W / A / S / D：平移</li>
          <li>Shift：加速移动</li>
        </ul>
      </div>
    </aside>

    <main class="viewport-wrap">
      <canvas id="viewer-canvas"></canvas>
    </main>
  </div>
`

const form = document.querySelector('#viewer-form')
const urlInput = document.querySelector('#splat-url')
const lodInput = document.querySelector('#lod')
const pagedInput = document.querySelector('#paged')
const extSplatsInput = document.querySelector('#ext-splats')
const statusText = document.querySelector('#status-text')
const progressText = document.querySelector('#progress-text')
const sampleButton = document.querySelector('#load-sample')
const canvas = document.querySelector('#viewer-canvas')

if (
  !(form instanceof HTMLFormElement) ||
  !(urlInput instanceof HTMLInputElement) ||
  !(lodInput instanceof HTMLInputElement) ||
  !(pagedInput instanceof HTMLInputElement) ||
  !(extSplatsInput instanceof HTMLInputElement) ||
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

const initialOptions = readViewerOptionsFromUrl(new URL(window.location.href))
applyFormOptions(initialOptions)
loadScene(initialOptions)

form.addEventListener('submit', async (event) => {
  event.preventDefault()
  await loadScene(getFormOptions())
})

sampleButton.addEventListener('click', async () => {
  const options = mergeViewerOptions({ splatUrl: DEFAULT_SPLAT_URL, lod: true, paged: false, extSplats: false })
  applyFormOptions(options)
  await loadScene(options)
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
  lodInput.checked = options.lod
  pagedInput.checked = options.paged
  extSplatsInput.checked = options.extSplats
}

// 加载场景并把当前配置同步到分享链接中。
async function loadScene(options) {
  applyFormOptions(options)
  syncUrl(options)
  await viewer.load(options)
}

// 更新地址栏，方便直接分享当前打开的场景。
function syncUrl(options) {
  const url = new URL(window.location.href)
  url.searchParams.set('url', options.splatUrl)
  url.searchParams.set('lod', String(options.lod))
  url.searchParams.set('paged', String(options.paged))
  url.searchParams.set('extSplats', String(options.extSplats))
  window.history.replaceState({}, '', url)
}
