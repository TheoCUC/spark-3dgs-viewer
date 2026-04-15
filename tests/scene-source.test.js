import { describe, expect, it } from 'vitest'

import {
  createLocalFileSceneSource,
  createRemoteSceneSource,
  describeSceneSource,
  resolveSceneSource,
} from '../src/config/scene-source.js'

describe('resolveSceneSource', () => {
  it('有本地文件时优先使用本地文件', () => {
    const file = { name: 'room.spz', size: 1024 }

    const source = resolveSceneSource({
      file,
      options: { splatUrl: 'https://example.com/remote.spz' },
    })

    expect(source).toMatchObject({
      kind: 'local-file',
      fileName: 'room.spz',
      file,
    })
  })

  it('没有本地文件时使用远程地址', () => {
    const source = resolveSceneSource({
      options: { splatUrl: 'https://example.com/remote.spz' },
    })

    expect(source).toEqual(createRemoteSceneSource('https://example.com/remote.spz'))
  })
})

describe('describeSceneSource', () => {
  it('会输出更好懂的本地文件说明', () => {
    const source = createLocalFileSceneSource({ name: 'kitchen.rad', size: 5 * 1024 * 1024 })

    expect(describeSceneSource(source)).toBe('本地文件 kitchen.rad（5.00 MB）')
  })

  it('会输出远程地址说明', () => {
    const source = createRemoteSceneSource('https://example.com/remote.spz')

    expect(describeSceneSource(source)).toBe('远程文件 https://example.com/remote.spz')
  })
})
