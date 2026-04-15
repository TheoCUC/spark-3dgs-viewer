import { describe, expect, it } from 'vitest'

import {
  DEFAULT_SPLAT_URL,
  mergeViewerOptions,
  readViewerOptionsFromUrl,
} from '../src/config/viewer-config.js'

describe('mergeViewerOptions', () => {
  it('在地址为空时回退到默认样例', () => {
    const options = mergeViewerOptions({ splatUrl: '   ' })

    expect(options.splatUrl).toBe(DEFAULT_SPLAT_URL)
    expect(options.lod).toBe(true)
    expect(options.paged).toBe(false)
    expect(options.extSplats).toBe(false)
  })

  it('会把字符串开关转换成布尔值', () => {
    const options = mergeViewerOptions({
      splatUrl: 'https://example.com/scene.rad',
      lod: 'false',
      paged: 'true',
      extSplats: 'true',
    })

    expect(options).toMatchObject({
      splatUrl: 'https://example.com/scene.rad',
      lod: false,
      paged: true,
      extSplats: true,
    })
  })
})

describe('readViewerOptionsFromUrl', () => {
  it('会读取查询参数并覆盖默认值', () => {
    const options = readViewerOptionsFromUrl(
      new URL(
        'https://viewer.local/?url=https%3A%2F%2Fexample.com%2Fstream.rad&lod=false&paged=true',
      ),
    )

    expect(options.splatUrl).toBe('https://example.com/stream.rad')
    expect(options.lod).toBe(false)
    expect(options.paged).toBe(true)
    expect(options.extSplats).toBe(false)
  })
})
