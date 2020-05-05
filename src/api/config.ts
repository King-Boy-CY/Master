const { parse } = require('psl')
// 版本
export const VERSION = '1.0.1'
export const deName = 'dyh'
export const HOST = (() => {
  const { subdomain, sld, tld }: any = parse(document.domain)
  // 测试环境
  if (document.domain === 'localhost' || parseInt(subdomain) === 168) {
    return 'http://192.168.121.41:8080/'
  } else {

  }
  // 正式 || 测试-Test
  //   return /.*-test\d?/.test(subdomain)
  //     ? `${location.protocol}//{测试域名}.${sld}.${tld}`
  //     : `${location.protocol}//{正式域名}.${sld}.${tld}`
})()
