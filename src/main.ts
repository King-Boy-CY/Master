import Vue from 'vue'
// 主组件
import App from './App.vue'
// 路由
import router from './router'
// 状态管理
import store from './vuex/store'
// moment 格式化工具
import moment from 'moment'
// import iView from 'iview';
import { Table } from 'iview';
import 'iview/dist/styles/iview.css';    // 使用 CSS
// import 'animate.css'
// antd ui框架
import Antd, { message } from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
// 清除浏览器默认样式
import 'reset-css'
// 加载进度条
import 'nprogress/nprogress.css'
import NProgress from 'nprogress'
// 修复一些原生方法出现的问题
import '@/assets/ts/prototype.js'
// @ts-ignore 忽略下一行 ts检测
import { Select, Option, Scrollbar } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/advancedSearch.scss'
// 路由跳转前判断是否登陆
router.beforeEach((to, from, next): void => {
  NProgress.start()
  next()
})

// 路由跳转结束
router.afterEach((): void => {
  NProgress.done()
})

message.config({
  top: `50%`,
  duration: 2,
  maxCount: 1,
});
/**处理页面出现 chunk-vendors.86eebdfd.js:31 ChunkLoadError: Loading chunk chunk-b4b5da3e failed.
缺少文件时问题无法 打开页面 重新加载一次 **/
router.onError((error) => {
  const pattern = /Loading chunk (\d)+ failed/g;
  const isChunkLoadFailed = error.message.match(pattern);
  const targetPath = (router as any).history.pending.fullPath;
  if (isChunkLoadFailed) {
    router.replace(targetPath);
  }
});
Vue.config.productionTip = false
Vue.prototype.moment = moment
// 开启全局loading方法
Vue.prototype.openLoading = () => {
  store.state.loading = true
}
// 关闭全局loading方法
Vue.prototype.closeLoading = () => {
  store.state.loading = false
}
// 声明插件Vue不认识的方法
declare module 'vue/types/vue' {
  interface Vue {
    openLoading(): void;
    closeLoading(): void;
    $setTableHeight(iscollapsible?: boolean): void;
    $vcSetTableHeight(iscollapsible?: boolean): void;
  }
}
// element ui
Vue.use(Select);
Vue.use(Option);
Vue.use(Scrollbar);
// Vue.use(iView);
Vue.component('iTable', Table);
Vue.use(Antd)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
