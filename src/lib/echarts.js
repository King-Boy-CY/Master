/**
 * 全部按需配置
 * https://github.com/apache/incubator-echarts/blob/master/index.js
 * https://www.w3cschool.cn/echarts_tutorial/echarts_tutorial-ey1g28xg.html
 */
// 加载echarts，注意引入文件的路径
import echarts from 'echarts/lib/echarts'

// 引入你需要使用的图表类型，标题，提示信息等
import 'echarts/lib/chart/line' // 折线图
import 'echarts/lib/chart/bar' // 柱状图
import 'echarts/lib/chart/pie' // 饼图

// import 'echarts/lib/chart/scatter'

import 'echarts/lib/component/legend'
import 'echarts/lib/component/title'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/axisPointer'

export default echarts