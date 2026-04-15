// 这个文件负责管理 Viewer 外壳界面的显示状态，比如首页引导和侧边栏折叠。

// 根据是否已有初始场景决定默认显示哪个界面。
export function createInitialShellState({ hasInitialScene }) {
  if (hasInitialScene) {
    return getLoadedShellState()
  }

  return {
    showLanding: true,
    sidebarVisible: false,
    sidebarCollapsed: false,
  }
}

// 场景加载完成后统一切换到查看状态。
export function getLoadedShellState() {
  return {
    showLanding: false,
    sidebarVisible: true,
    sidebarCollapsed: false,
  }
}

// 切换侧边栏折叠状态。
export function toggleSidebarCollapsed(currentValue) {
  return !currentValue
}
