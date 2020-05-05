const path = require('path')
// const {  } = require('./src/api/config.ts')
const debug = process.env.NODE_ENV !== 'production';
const {
  contractUrl,
  configUrl,
  routeUrl,
  financeUrl,
  tradeUrl
} = require('./public/url.json')
// const FileManagerPlugin = require('filemanager-webpack-plugin')
const date = new Date()
const version =
  date.getFullYear() +
  (date.getMonth() + 1 + '').padStart(2, '0') +
  (date.getDate() + '').padStart(2, '0')
const webpack = require('webpack') // 引入webpack库

function resolve (dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  /*
  production 生产环境
  development 开发环境
  */
  publicPath: debug ? '/' : './',
  indexPath: './index.html',
  // 输出文件目录
  outputDir: '../../../Release/Alpha/dist' + version,
  // 默认在生成的静态资源文件名中包含hash以控制缓存
  filenameHashing: true,
  // 是否在开发环境下通过 eslint-loader 在每次保存时 lint 代码 (在生产构建时禁用 eslint-loader)
  lintOnSave: false,
  // module: {
  //   rules: [
  //     {
  //       // js 文件才使用 babel
  //       test: /\.（js | ts | tsx)$/,
  //       loader: 'babel-loader',
  //       // 只在 src 文件夹下查找
  //       include: [resolve('src')],
  //       // 不会去查找的路径
  //       exclude: /node_modules/
  //     }
  //   ]
  // },
  chainWebpack: config => {
    /**
     * 删除懒加载模块的prefetch，降低带宽压力
     * https://cli.vuejs.org/zh/guide/html-and-static-assets.html#prefetch
     * 而且预渲染时生成的prefetch标签是modern版本的，低版本浏览器是不需要的
     */
    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule.use('vue-svg-loader').loader('vue-svg-loader')

    config.plugins.delete('prefetch')
    if (process.env.NODE_ENV === 'production') {
      config.plugin('html').tap(args => {
        args[0].version = version + ('' + date.getHours()).padStart(2, '0')
        return args
      })
    }

    config.plugin('ignore')
      .use(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/))// 忽略/moment/locale下的所有文件
    config.resolve.alias
      .set('vue$', 'vue/dist/vue.esm.js')
      .set('@', resolve('src'))
      .set('src', resolve('src'))
      .set('assets', resolve('src/assets'))
      .set('components', resolve('src/components'))
      .set('pages', resolve('src/pages'))
      .set('common', resolve('src/common'))
      .set('views', resolve('src/views'))
      .set('public', resolve('public'))
  },
  configureWebpack: {
    // externals: {
    //     vue: "Vue",
    //     vuex: "Vuex",
    //     "vue-router": "VueRouter",
    //     "antd": "Antd",
    //     "nprogress": "NProgress"
    // },
    // plugins: [
    // new FileManagerPlugin({  //初始化 filemanager-webpack-plugin 插件实例
    //   onEnd: {
    //     delete: [   //首先需要删除项目根目录下的dist.zip
    //       './dist.zip',
    //     ],
    //     archive: [ //然后我们选择dist文件夹将之打包成dist.zip并放在根目录
    //       {source: './dist', destination: './dist.zip'},
    //     ]
    //   }
    // })
    // new webpack.optimize.CommonsChunkPlugin({
    //   name:["vender","element","echarts","i18n","echartsGl"],
    //   minChunks:Infinity
    // }),
    // ]
  },
  // 生产环境是否生成 sourceMap
  productionSourceMap: debug,
  // productionSourceMap: true,
  devServer: {
    open: true, // 启动打开浏览器
    port: 8083, // 端口
    proxy: {
      '/config': {
        target: configUrl // 设置你调用的接口域名和端口号  8081
      },
      '/contract': {
        target: contractUrl
      },
      '/finance': {
        target: financeUrl
      },
      '/route': {
        target: routeUrl
      },
      '/trade': {
        target: tradeUrl
      }
    }
  }
}
