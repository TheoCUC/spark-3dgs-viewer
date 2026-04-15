// 这个文件负责统一描述远程地址和本地拖拽文件两种场景来源。

// 创建远程地址来源。
export function createRemoteSceneSource(url) {
  return {
    kind: 'remote-url',
    url,
  }
}

// 创建本地文件来源。
export function createLocalFileSceneSource(file) {
  return {
    kind: 'local-file',
    file,
    fileName: file.name,
  }
}

// 根据当前输入状态决定这次应该加载哪个来源。
export function resolveSceneSource({ options, file }) {
  if (file) {
    return createLocalFileSceneSource(file)
  }

  return createRemoteSceneSource(options.splatUrl)
}

// 生成更容易给用户看的来源说明。
export function describeSceneSource(source) {
  if (source.kind === 'local-file') {
    return `本地文件 ${source.fileName}（${formatFileSize(source.file.size)}）`
  }

  return `远程文件 ${source.url}`
}

// 把字节数格式化成更容易理解的大小文本。
function formatFileSize(size) {
  if (!Number.isFinite(size) || size <= 0) {
    return '未知大小'
  }

  const megaBytes = size / (1024 * 1024)
  return `${megaBytes.toFixed(2)} MB`
}
