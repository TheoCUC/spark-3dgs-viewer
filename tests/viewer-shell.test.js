import { describe, expect, it } from 'vitest'

import {
  createInitialShellState,
  getLoadedShellState,
  toggleSidebarCollapsed,
} from '../src/config/viewer-shell.js'

describe('createInitialShellState', () => {
  it('没有初始地址时显示全屏主页引导', () => {
    const state = createInitialShellState({ hasInitialScene: false })

    expect(state).toEqual({
      showLanding: true,
      sidebarVisible: false,
      sidebarCollapsed: false,
    })
  })

  it('有初始地址时直接进入查看模式', () => {
    const state = createInitialShellState({ hasInitialScene: true })

    expect(state).toEqual({
      showLanding: false,
      sidebarVisible: true,
      sidebarCollapsed: false,
    })
  })
})

describe('getLoadedShellState', () => {
  it('加载场景后自动关闭主页并显示侧边栏', () => {
    const state = getLoadedShellState()

    expect(state).toEqual({
      showLanding: false,
      sidebarVisible: true,
      sidebarCollapsed: false,
    })
  })
})

describe('toggleSidebarCollapsed', () => {
  it('会切换侧边栏折叠状态', () => {
    expect(toggleSidebarCollapsed(false)).toBe(true)
    expect(toggleSidebarCollapsed(true)).toBe(false)
  })
})
