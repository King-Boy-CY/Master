<template>
<div class="card" ref="overdueAgree">
    <div class="card-header">
        <div class="card-title" @click="titleClick">Overdue agreement</div>
    </div>
    <div class="card-content">
        <div class="content-top">
            <div class="item">
                <p class="item-title">Overdue agreement</p>
                <p class="item-content">Vc: 6</p>
            </div>
            <div class="item item-right">
                <p class="item-title">Overdue agreement</p>
                <p class="item-content">Hubbing: 27</p>
            </div>
        </div>
        <div class="content-bottom">
            <div class="item">
                <div class="item-top">
                    <p class="item-title">Agreement to be overdure</p>
                    <p class="item-content">Vc: 312</p>
                </div>
                <div class="item-bottom">
                    <!-- <slot name="drawFirstRow1-vc"></slot> -->
                    <div ref="drawFirstRow1-vc" id="drawFirstRow1-vc" class="canvas-min" :style="{
                        width:canvansWidth
                    }" @click="titleClick"></div>
                </div>
            </div>
            <div class="item">
                <div class="item-top">
                    <p class="item-title">Agreement to be overdure</p>
                    <p class="item-content">Hubbing: 199</p>
                </div>
                <div class="item-bottom">
                    <!-- <slot name="drawFirstRow1-hubbing"></slot> -->
                    <div ref="drawFirstRow1-hubbing" id="drawFirstRow1-hubbing" class="canvas-min" :style="{
                        width:canvansWidth
                    }"></div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script lang="ts">
import Vue from "vue";
import {
    Component,
    Prop,
    Emit
} from "vue-property-decorator";
// import echarts from 'echarts'
import echarts from '@/lib/echarts' // 按需加载
@Component
export default class OverdueAgreement extends Vue {
    @Prop(Object) data ? : object;

    private myChartVc: any // echarts 实例
    private myChartHubbing: any // echarts 实例
    private canvansWidth: string = '100%' // canvans小的框

    private drawOverdueAgreement() {
        // 基于准备好的dom，初始化echarts实例
        const drawFirstRow1Vc: any = this.$refs['drawFirstRow1-vc']
        const drawFirstRow1Hubbing: any = this.$refs['drawFirstRow1-hubbing']
        this.myChartVc = echarts.init(drawFirstRow1Vc)
        this.myChartHubbing = echarts.init(drawFirstRow1Hubbing)
        let option = {
            color: ['rgba(255, 255, 255, 0.7)'],
            tooltip: {
                trigger: 'axis',
                axisPointer: { // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            grid: {
                left: '-10%',
                right: '4%',
                bottom: '3%',
                top: '20%',
                containLabel: true
            },
            xAxis: [{
                type: 'category',
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: '#fff',
                        fontSize: 14,
                        fontWeight: 600,
                    },
                },
                data: ['Sep.', 'Oct.', 'Nov.'],
                axisLine: {
                    show: false

                },
                axisTick: { //刻度线
                    show: false
                },
                splitLine: { //网格线
                    show: false
                }
            }],
            yAxis: [{
                type: 'value',
                show: false,
            }],
            series: []
        };
        this.myChartVc.setOption(Object.assign({}, option, {
            series: [{
                type: 'bar',
                label: {
                    normal: {
                        show: true,
                        position: 'top',
                        color: '#fff',
                        fontSize: 14,
                    }
                },
                data: [33, 45, 234]
            }]
        }));
        this.myChartHubbing.setOption(Object.assign({}, option, {
            series: [{
                type: 'bar',
                label: {
                    normal: {
                        show: true,
                        position: 'top',
                        color: '#fff',
                        fontSize: 14,
                    }
                },
                data: [34, 98, 67]
            }]
        }));
    }
    private getCanvansWidth() {
        if (!this.$refs.overdueAgree) {
            return
        }
        const contentWidth: number = (this.$refs.overdueAgree as any).offsetWidth
        // console.log(contentWidth);
        const width: number = Math.round(contentWidth / 2) - 28
        this.canvansWidth = width + 'px';

        this.myChartVc.resize({
            width
        })
        this.myChartHubbing.resize({
            width
        })
    }

    private titleClick() {
        this.$router.push('/Home/Contract/VcContract')
    }

    private created() {
        // 访问接口

        // 渲染dom后
        this.$nextTick(() => {
            this.drawOverdueAgreement()
        })
        // setTimeout(() => {
        //     this.getCanvansWidth()
        // }, 20)
    }
    private mounted() {

    }

    private destroyed() {
        this.myChartVc.clear()
        this.myChartHubbing.clear()
    }
}
</script>

<style lang="scss" scoped>
.canvas-min {
    // width: 170px;
    width: 80%;
    height: 190px;
    margin: 0 auto;
}

.card {
    background-color: #ffffff;
    min-height: 300px;
    overflow: hidden;

    // .card-title {
    //     font-weight: 600;
    //     margin-top: 10px;
    //     font-size: 16px;
    //     cursor: pointer;
    //     white-space: nowrap;
    //     line-height: 16px;
    //     border-left: #3e77d8 6px solid;
    //     padding: 2px 0 2px 10px;

    //     &:hover {
    //         color: #0000ff
    //     }
    // }
    .card-header {
        margin-top: 6px;
        margin-bottom: 10px;
        display: flex;
        line-height: 28px;

        .card-title {
            flex: 1;
            font-size: 16px;
            font-weight: 600;
            line-height: 16px;
            border-left: #3e77d8 6px solid;
            padding: 2px 0 2px 10px;
            margin-top: 4px;
            margin-bottom: 4px;
            white-space: nowrap;
            cursor: pointer;
            transition: all 0.5s cubic-bezier(0.39, 0.575, 0.565, 1);

            &:hover {
                color: #0000ff
            }
        }
    }

    .card-content {
        margin-top: 10px;

        .content-top {
            display: flex;

            .item {
                overflow: hidden;
                margin: 0 8px;
                // max-width: calc(50%-16px);
                // flex: 1 1 50%;
                flex: 1;
                background-color: #3E77D8;
                text-align: center;
                color: #ffffff;

                &.item-right {

                    background-color: #F5B148;
                }

                .item-title {
                    font-size: 14px;
                    line-height: 34px;
                    white-space: nowrap;
                    overflow: hidden;
                }

                .item-content {
                    font-size: 16px;
                    font-weight: 700;
                    line-height: 44px;
                }
            }
        }

        .content-bottom {
            margin-top: 10px;
            margin-bottom: 10px;
            display: flex;

            .item {
                overflow: hidden;
                flex: 1;
                background-color: #F5B148;
                margin: 0 8px;
                color: #ffffff;
                text-align: center;
                min-height: 226px;

                &:last-child {
                    background-color: #3E77D8;
                }

                .item-top {
                    background-color: rgba(255, 255, 255, .15);

                    .item-title {
                        font-size: 14px;
                        line-height: 34px;
                        // max-width: 176px;
                        white-space: nowrap;
                        overflow: hidden;
                        // text-overflow: ellipsis;
                    }

                    .item-content {
                        font-size: 16px;
                        font-weight: 700;
                        line-height: 44px;
                    }
                }

            }
        }
    }

}
</style>
