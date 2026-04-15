// 这个文件负责整理 Viewer 的配置，并给页面提供统一的默认值。

export const DEFAULT_SPLAT_URL = 'https://sparkjs.dev/assets/splats/butterfly.spz'

const DEFAULT_OPTIONS = {
  splatUrl: DEFAULT_SPLAT_URL,
  lod: true,
  paged: false,
  extSplats: false,
}

// 把表单值或查询参数统一整理成 Viewer 可直接使用的配置。
export function mergeViewerOptions(input = {}) {
  return {
    splatUrl: normalizeUrl(input.splatUrl ?? input.url),
    lod: normalizeBoolean(input.lod, DEFAULT_OPTIONS.lod),
    paged: normalizeBoolean(input.paged, DEFAULT_OPTIONS.paged),
    extSplats: normalizeBoolean(input.extSplats, DEFAULT_OPTIONS.extSplats),
  }
}

// 从页面地址里读取配置，方便直接分享可打开的链接。
export function readViewerOptionsFromUrl(url) {
  const params = url.searchParams

  return mergeViewerOptions({
    url: params.get('url'),
    lod: params.get('lod'),
    paged: params.get('paged'),
    extSplats: params.get('extSplats'),
  })
}

// 清理输入地址，空值时回退到默认示例。
function normalizeUrl(value) {
  if (typeof value !== 'string') {
    return DEFAULT_OPTIONS.splatUrl
  }

  const trimmed = value.trim()
  return trimmed || DEFAULT_OPTIONS.splatUrl
}

// 兼容布尔值和字符串布尔值。
function normalizeBoolean(value, fallback) {
  if (typeof value === 'boolean') {
    return value
  }

  if (typeof value !== 'string') {
    return fallback
  }

  const normalized = value.trim().toLowerCase()

  if (normalized === 'true') {
    return true
  }

  if (normalized === 'false') {
    return false
  }

  return fallback
}
