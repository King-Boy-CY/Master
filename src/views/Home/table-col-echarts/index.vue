<template>
<div class="echarts-box">
    <a-popover placement="left" v-if="isShowPopover">
        <template slot="content">
            <div style="display: inline-block;margin-right: 20px;" :style="index==dataArr -1?'margin-right: 0':''" v-for="(item,index) in dataArr" :key="index">
                <div style="font-weight: 700;">{{titleArr[index]}}</div>
                <div>{{item}}</div>
            </div>
        </template>
        <div ref="echarts" class="item-canvas-min"></div>
    </a-popover>
    <div v-else ref="echarts" class="item-canvas-min"></div>
</div>
</template>

<script lang="ts">
import Vue from "vue";
import {
    Component,
    Prop,
    // Emit,
    Watch
} from "vue-property-decorator";
// import echarts from 'echarts'
import echarts from '@/lib/echarts' // 按需加载

@Component
export default class OverdueAgreement extends Vue {
    @Prop(Object) options!: any; // 传入 echarts的options
    @Prop() optionName!: any; // 取option的key
    @Prop(Boolean) isShowPopover: any; // 是否启用自己写的悬浮显示

    @Watch('options', {
        deep: true
    })
    onChangeData(newVal: any, oldVal: any) {
        this.setOption()
    }
    public myChart: any // echarts实例
    private titleArr: string[] = []
    private dataArr: string[] = []

    private initMyChart() {
        // 基于准备好的dom，初始化echarts实例
        this.myChart = echarts.init((this as any).$refs.echarts)
        this.setOption()
    }

    private setOption() {
        this.myChart.setOption(this.options[Symbol.for(this.optionName)]);
        this.titleArr = this.options[Symbol.for(this.optionName)].xAxis.data || []
        this.dataArr = this.options[Symbol.for(this.optionName)].series && this.options[Symbol.for(this.optionName)].series[0].data || []
    }

    public mounted() {
        this.initMyChart()
    }
}
</script>

<style lang="scss" scoped>
.echarts-box {

    // position: relative;
    // z-index: 2000;
    .item-canvas-min {
        width: 60px;
        // min-width: 60px;
        // max-width: 200px;
        height: 40px;
        margin: 0 auto
    }
}
</style>
