let plugins = [
  [
    "component",
    {
      "libraryName": "element-ui",
      "styleLibraryName": "theme-chalk"
    }
  ],
  [
    "import",
    {
      "libraryName": "iview",
      "libraryDirectory": "src/components"
    }
  ]
]
// 生产环境移除console
// if (process.env.NODE_ENV === 'production') {
//   plugins.push("transform-remove-console")
// }
module.exports = {
  // 将loose为true将会生成性能更高但不符合规范的代码。
  presets: [[
    '@vue/app', { useBuiltIns: "entry", loose: true }
  ]],
  plugins
}
