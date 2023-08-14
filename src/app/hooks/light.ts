export function isUesLightTheme(path: string) {
  return ['/', '/explorer', '/zh-CN', '/en-US', '/en-US/explorer'].includes(path)
}
