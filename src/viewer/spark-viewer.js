// 这个文件负责封装 Spark + THREE 的初始化、渲染循环和场景加载流程。

import * as THREE from 'three'
import { SparkControls, SplatMesh } from '@sparkjsdev/spark'

// 创建一个可重复加载 splat 场景的 Viewer 实例。
export function createSparkViewer({ canvas, onStatusChange, onProgressChange }) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setClearColor(0x050816, 1)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(60, 1, 0.01, 2000)
  camera.position.set(0, 0, 3)

  const controls = new SparkControls({ canvas })
  const clock = new THREE.Clock()
  const grid = new THREE.GridHelper(4, 8, 0x3b82f6, 0x334155)
  grid.position.y = -1.2
  scene.add(grid)

  let activeMesh = null
  let loadVersion = 0

  renderer.setAnimationLoop(() => {
    controls.update(camera)
    renderer.render(scene, camera)
  })

  resize()
  window.addEventListener('resize', resize)

  onStatusChange('Viewer 已就绪')
  onProgressChange('请输入地址或拖拽本地文件开始加载')

  return {
    load,
    dispose,
  }

  // 加载一个新的 splat 场景，并替换掉当前显示内容。
  async function load({ options, source }) {
    const currentVersion = ++loadVersion
    const startedAt = clock.getElapsedTime()

    onStatusChange('正在加载场景…')
    onProgressChange(source.kind === 'local-file' ? '正在读取本地文件' : '正在请求文件')

    clearActiveMesh()

    const meshOptions = await createMeshOptions({ options, source, currentVersion, loadVersion })
    const mesh = new SplatMesh({
      ...meshOptions,
      lod: options.lod,
      paged: source.kind === 'local-file' ? false : options.paged,
      extSplats: options.extSplats,
      onProgress: (event) => {
        if (currentVersion !== loadVersion) {
          return
        }

        const progressMessage = formatProgress(event, source.kind)
        onProgressChange(progressMessage)
      },
      onLoad: (loadedMesh) => {
        if (currentVersion !== loadVersion) {
          return
        }

        focusCamera(camera, loadedMesh)
      },
    })

    activeMesh = mesh
    scene.add(mesh)

    try {
      await mesh.initialized

      if (currentVersion !== loadVersion) {
        mesh.dispose()
        return
      }

      focusCamera(camera, mesh)

      const elapsedSeconds = Math.max(clock.getElapsedTime() - startedAt, 0.1)
      onStatusChange('场景加载完成')
      onProgressChange(`已完成，用时 ${elapsedSeconds.toFixed(1)} 秒`)
    } catch (error) {
      if (activeMesh === mesh) {
        scene.remove(mesh)
        activeMesh = null
      }

      mesh.dispose()
      onStatusChange('加载失败')
      onProgressChange(readErrorMessage(error))
    }
  }

  // 根据画布尺寸更新相机和渲染器，保证画面比例正确。
  function resize() {
    const width = canvas.clientWidth || window.innerWidth
    const height = canvas.clientHeight || window.innerHeight

    camera.aspect = width / Math.max(height, 1)
    camera.updateProjectionMatrix()
    renderer.setSize(width, height, false)
  }

  // 清理资源，避免重复加载时残留旧数据。
  function clearActiveMesh() {
    if (!activeMesh) {
      return
    }

    scene.remove(activeMesh)
    activeMesh.dispose()
    activeMesh = null
  }

  // 在页面销毁时释放 WebGL 资源。
  function dispose() {
    window.removeEventListener('resize', resize)
    clearActiveMesh()
    renderer.dispose()
  }
}

// 根据来源准备 Spark 需要的加载参数。
async function createMeshOptions({ source }) {
  if (source.kind === 'local-file') {
    return {
      fileBytes: await source.file.arrayBuffer(),
      fileName: source.fileName,
    }
  }

  return {
    url: source.url,
  }
}

// 根据加载进度生成更好懂的提示语。
function formatProgress(event, sourceKind) {
  if (event.total) {
    const percent = ((event.loaded / event.total) * 100).toFixed(1)
    return sourceKind === 'local-file' ? `读取中 ${percent}%` : `下载中 ${percent}%`
  }

  if (event.loaded) {
    const megaBytes = (event.loaded / (1024 * 1024)).toFixed(2)
    return sourceKind === 'local-file' ? `已读取 ${megaBytes} MB` : `已下载 ${megaBytes} MB`
  }

  return sourceKind === 'local-file' ? '正在读取本地文件' : '正在下载文件'
}

// 读取错误信息，避免直接显示难懂的对象结构。
function readErrorMessage(error) {
  if (error instanceof Error && error.message) {
    return error.message
  }

  return '文件地址无效，或当前文件暂时无法读取。'
}

// 按场景包围盒调整相机位置，让模型尽量直接出现在视野中央。
function focusCamera(camera, mesh) {
  const box = mesh.getBoundingBox()

  if (box.isEmpty()) {
    camera.position.set(0, 0, 3)
    camera.lookAt(0, 0, 0)
    return
  }

  const size = new THREE.Vector3()
  const center = new THREE.Vector3()
  box.getSize(size)
  box.getCenter(center)

  const maxSize = Math.max(size.x, size.y, size.z, 0.5)
  const distance = maxSize * 1.6

  camera.position.set(center.x, center.y, center.z + distance)
  camera.near = Math.max(distance / 200, 0.01)
  camera.far = Math.max(distance * 20, 100)
  camera.updateProjectionMatrix()
  camera.lookAt(center)
}
