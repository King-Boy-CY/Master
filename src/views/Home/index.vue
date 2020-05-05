<template>
<div class="page-home" id="page-home" ref="pageHome">
    <!-- 第一行 -->
    <a-row :gutter="24" justify="space-between" type="flex" class="row">
        <!-- :xs="24" :sm="12" :lg="8" :xl="8" -->
        <a-col :span="8">
            <overdue-agreement ref="overdueAgreement"></overdue-agreement>
        </a-col>
        <a-col :span="8">
            <div class="card">
                <home-table ref="AgreementWVD" type="echarts" :privateKey="0" title="Agreement with volume deviation" :activeIndex.sync="AgreementWVDIndex" :selectBtn="AgreementWVDBtn" v-model="AgreementWVDValue" :selectOptions="AgreementWVDOptions" :option="AgreementWVDOption" @onTabsClick="tabChange" @onSelectChange="selectChange"></home-table>
            </div>
        </a-col>
        <a-col :span="8">
            <home-table title="Low credit account" :columns="lCAccountColumns" :data="lCAccountData"></home-table>
        </a-col>
    </a-row>

    <!-- 第二行 -->
    <a-row :gutter="24" justify="space-between" type="flex" class="row">
        <a-col :span="8">
            <home-table class="card max-card" selectWildth="220px" :privateKey="1" :activeIndex.sync="costFluctuationIndex" :selectBtn="costFluctuationBtn" v-model="costFluctuationValue" :selectOptions="costFluctuationOptions" title="Cost fluctuation" :columns="costFluctuationColumns" :data="costFluctuationData" @onTabsClick="tabChange" @onSelectChange="selectChange"></home-table>
        </a-col>
        <a-col :span="8">
            <home-table class="card max-card" :privateKey="2" :activeIndex.sync="fluctuationDestIndex" :selectBtn="fluctuationDestBtn" v-model="fluctuationDestValue" :selectOptions="fluctuationDestOptions" title="Volume fluctuation-destination" :columns="fluctuationDestColumns" :data="fluctuationDestData" @onTabsClick="tabChange" @onSelectChange="selectChange"></home-table>
        </a-col>
        <a-col :span="8">
            <home-table class="card max-card" :privateKey="3" :activeIndex.sync="fluctuationAccIndex" :selectBtn="fluctuationAccBtn" v-model="fluctuationAccValue" :selectOptions="fluctuationAccOptions" title="Volume fluctuation-account" :columns="fluctuationAccColumns" :data="fluctuationAccData" @onTabsClick="tabChange" @onSelectChange="selectChange"></home-table>
        </a-col>
    </a-row>

    <!-- 第三行 -->
    <a-row :gutter="24" justify="space-between" type="flex" class="row">
        <a-col :span="8">
            <div class="card min-card">
                <!-- <div class="card-title">Error CDR</div> -->
                <div class="card-header">
                    <div class="card-title">Error CDR</div>
                </div>
                <div class="card-content">
                    <div ref="drawThreadRow1" id="drawThreadRow1" class="canvas-normal" :style="{
                        width: canvansWidth
                    }"></div>
                </div>
            </div>
        </a-col>
        <a-col :span="8">
            <div class="card min-card">
                <div class="card-header">
                    <div class="card-title">Vendor offer</div>
                    <a-select v-model="VOSelectValue" class="card-select" style="width: 100px;margin-right:10px">
                        <a-select-option v-for="(optionsItem,index) in VOSelectOptions" :key="index" :value="optionsItem.value">{{optionsItem.name}}</a-select-option>
                    </a-select>
                </div>
                <div class="card-content">
                    <div class="total-data">
                        <!-- 总数 -->
                        {{VendorOfferData&&VendorOfferData.reduce((sum,item,index)=>{
                            sum+=item.value
                            return sum
                        },0)||''}}
                    </div>
                    <div ref="drawThreadRow2" id="drawThreadRow2" class="canvas-normal" :style="{
                        width: canvansWidth
                    }"></div>
                </div>
                <!-- <div ref="drawThreadRow2" id="drawThreadRow2" class="canvas-normal"></div> -->
            </div>
        </a-col>
        <a-col :span="8">
            <div class="card min-card">
                <div class="card-header">
                    <div class="card-title">Client offer</div>
                    <a-select v-model="COSelectValue" class="card-select" style="width: 100px;margin-right:10px">
                        <a-select-option v-for="(optionsItem,index) in COSelectOptions" :key="index" :value="optionsItem.value">{{optionsItem.name}}</a-select-option>
                    </a-select>
                </div>
                <div class="card-content">
                    <div class="total-data client-offer">
                        <!-- 总数 -->
                        {{ClientOfferData&&ClientOfferData.reduce((sum,item,index)=>{
                            sum+=item.value
                            return sum
                        },0)||''}}
                    </div>
                    <div ref="drawThreadRow3" id="drawThreadRow3" class="canvas-normal" :style="{
                        width: canvansWidth
                    }"></div>
                </div>
                <!-- <div ref="drawThreadRow3" id="drawThreadRow3" class="canvas-normal"></div> -->
            </div>
        </a-col>
    </a-row>

    <!-- 第四行 -->
    <a-row :gutter="24" justify="space-between" type="flex" class="row">
        <a-col :span="12">
            <div class="card min-card">
                <div class="card-header">
                    <div class="card-title">Routing change</div>
                    <a-select v-model="ROSelectValue" class="card-select" style="width: 100px;margin-right:10px">
                        <a-select-option v-for="(optionsItem,index) in ROSelectOptions" :key="index" :value="optionsItem.value">{{optionsItem.name}}</a-select-option>
                    </a-select>
                </div>
                <div class="card-content">
                    <div ref="drawFourthRow1" id="drawFourthRow1" class="canvas-max" :style="{
                        width: bCanvansWidth
                    }"></div>
                </div>
            </div>
        </a-col>
        <a-col :span="12">
            <div class="card min-card">
                <!-- <div class="card-title">Total volume</div> -->
                <div class="card-header">
                    <div class="card-title">Total volume</div>
                </div>
                <div class="card-content">
                    <div ref="drawFourthRow2" id="drawFourthRow2" class="canvas-max" :style="{
                        width: bCanvansWidth
                    }"></div>
                </div>
            </div>
        </a-col>
    </a-row>
</div>
</template>

<script lang="ts">
import Vue from "vue";
import {
    Component,
    Watch
} from "vue-property-decorator";
// import echarts from "echarts";
import echarts from '@/lib/echarts' // 按需加载
import {
    lCAccountColumns,
    costFluctuationColumns,
    fluctuationDestColumns,
    fluctuationAccColumns,
    commonTableOption,
    dataSelectOptions,
    lCAccountData,
    costFluctuationData,
    costFluctuationDownData,
    fluctuationDestData,
    fluctuationDestOutBoundData,
    fluctuationAccData,
    fluctuationAccOutBoundData,
    AgreementWVDCompletionRate,
    AgreementWVDCommonRate,
    AgreementWVDGoodRate,
    AgreementWVDVeryGoodRate
} from "./data";
@Component({
    components: {
        overdueAgreement: () => import("./overdue-agreement/index.vue"),
        homeTable: () => import("./home-table/index.vue")
    }
})
export default class HomePage extends Vue {
    // 表头
    private lCAccountColumns: Array < Object > = lCAccountColumns;
    private costFluctuationColumns: Array < Object > = costFluctuationColumns;
    private fluctuationDestColumns: Array < Object > = fluctuationDestColumns;
    private fluctuationAccColumns: Array < Object > = fluctuationAccColumns;

    // 第一行第二 按钮下标
    private AgreementWVDIndex: any = 0;
    // 第二行 按钮
    private costFluctuationIndex: number = 0;
    private fluctuationDestIndex: number = 0;
    private fluctuationAccIndex: number = 0;

    // 第一行
    private AgreementWVDBtn: any = ["Insufficient", "Redundant"];
    // 第二行
    private costFluctuationBtn: string[] = ["Cost up", "Cost down"];
    private fluctuationDestBtn: string[] = ["Inbound", "Outbound"];
    private fluctuationAccBtn: string[] = ["Inbound", "Outbound"];

    // 第一行第二个 多选框绑定value
    private AgreementWVDValue: any = [];
    // select 框
    private costFluctuationValue: string | number = 3;
    private fluctuationDestValue: string | number = "2019/9/12";
    private fluctuationAccValue: string | number = "2019/9/12";
    private VOSelectValue: string | number = "2019/9/12";
    private COSelectValue: string | number = "2019/9/12";
    private ROSelectValue: string | number = "2019/9/12";

    private AgreementWVDOptions: object = [{
        name: "Without grace period",
        value: 1
    }];
    private costFluctuationOptions: object[] = [{
            name: "Leaset cost without quality assuarance",
            value: 1
        },
        {
            name: "Mixed cost",
            value: 2
        },
        {
            name: "Hot destination in route",
            value: 3
        }
    ];
    private fluctuationDestOptions: object[] = dataSelectOptions;
    private fluctuationAccOptions: object[] = dataSelectOptions;
    private VOSelectOptions: object[] = dataSelectOptions;
    private COSelectOptions: object[] = dataSelectOptions;
    private ROSelectOptions: object[] = dataSelectOptions;

    private AgreementWVDOption: any = {
        tooltip: {
            show: true,
            trigger: "axis",
            showDelay: 0,
            // formatter: '{a0}: {c0}<br/>{a1}: {c1}<br/>{a2}: {c2}',
            formatter: (params: any, ticket: any, callback: any) => {
                return `${params[0].axisValueLabel}
                <br/>${params[0].marker} ${params[0].seriesName}: ${params[0].data}%
                <br/>${params[1].marker} ${params[1].seriesName}: ${params[1].data.toFixed(4)}%
                <br/>${params[2].marker} ${params[2].seriesName}: ${(params[2].data + params[1].data).toFixed(4)}%`;
            },
            extraCssText: "box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);",
            axisPointer: {
                type: "shadow"
            }
        },
        grid: {
            left: "4",
            right: "20",
            bottom: "3%",
            top: "0%",
            containLabel: true
        },
        // legend: {
        //     data: ['完成率', '计划完成率', '一般', '及格', '优秀'],
        //     icon: 'roundRect',
        //     left: 'right',
        //     top: '0%',
        // },
        xAxis: {
            type: "value",
            max: 100,
            splitLine: {
                show: false
            },
            axisLabel: {
                formatter: "{value} %"
            }
        },
        yAxis: {
            boundaryGap: true,
            axisLine: {
                show: false
            },

            data: [
                "AT&T US-Out-VoIp",
                "British T-Out-Ang",
                "Duetch T Afri-Out-Ang",
                "Vodafone HK-Out-VoIp",
                "Russian T-Out",
                "Sigtel-Out-VoIp-USD",
                "Airtel Ind.-Sri.-VoIp-USD",
                "CnUnicom-China,Kor-VoIp-USD",
                "Metfone-Cambodia-All-USD",
                "Telenore-Duetch-USD",
                "Smartone-HK-VoIp-HKD",
                "LG Kor-Korea-Ang-USD",
                "Verizon Carribean-Cubap-USD",
                "Citic-Ita.-VoIp-USD"
            ],
            axisTick: {
                //刻度线
                show: false,
                alignWithLabel: true
            },
            splitLine: {
                //网格线
                show: false
            },
            interval: 89,
            splitNumber: 30,
            symbolSize: 78,
            axisLabel: {
                lineHeight: 16,
                formatter: function (value: any) {
                    // if (value.length > 10) {
                    //     return value.slice(0, value.indexOf(" ")) +
                    //         "\n" +
                    //         value.slice(value.indexOf(" ") + 1, 25)
                    // }
                    return value;
                }
            }
        },
        series: [{
                // name: "完成率",
                name: "Actual",
                type: "bar",
                barGap: "-200%",
                barWidth: 10,
                z: 10,
                itemStyle: {
                    normal: {
                        color: "#474747"
                    }
                },
                data: AgreementWVDCompletionRate
            },
            // {
            //     name: '计划完成率',
            //     type: 'scatter',
            //     symbol: 'rect',
            //     silent: true,
            //     itemStyle: {
            //         normal: {
            //             color: '#F33535'
            //         }
            //     },
            //     symbolSize: [5, 30],
            //     symbolOffset: [0, '-20%'],
            //     z: 20,
            //     data: [95, 90, 90, 90, 85]
            // },
            {
                // 红色
                // name: "一般",
                name: "Floor",
                type: "bar",
                barWidth: 30,
                itemStyle: {
                    normal: {
                        color: "#F26872"
                    }
                },
                stack: "total",
                symbolOffset: [0, "-30%"],
                data: AgreementWVDCommonRate
            },
            {
                // 绿色
                // name: "良好",
                name: "Ceiling",
                type: "bar",
                barWidth: 30,
                itemStyle: {
                    normal: {
                        color: "#89CC22"
                    }
                },
                stack: "total",
                data: AgreementWVDGoodRate
            },
            {
                // name: "优秀",
                name: "perfect",
                type: "bar",
                barWidth: 30,
                itemStyle: {
                    normal: {
                        color: "#F5B148"
                    }
                },
                stack: "total",
                data: AgreementWVDVeryGoodRate
            }
        ]
    };

    private commonTableOption: object = commonTableOption;
    private lCAccountData: object = lCAccountData;
    private costFluctuationData: object = costFluctuationData;
    private fluctuationDestData: object = fluctuationDestData;
    private fluctuationAccData: object = fluctuationAccData;

    private VendorOfferData: object = [{
            name: "Decoded",
            value: 75
        },
        {
            name: "Format error",
            value: 35
        },
        {
            name: "Rejected by busineess rule",
            value: 10
        },
        {
            name: "Processed",
            value: 250
        }
    ]

    private ClientOfferData: object = [{
            value: 75,
            name: "New"
        },
        {
            value: 35,
            name: "Requested"
        },
        {
            value: 10,
            name: "Rejected"
        }
    ]
    private echartStyle: object = {
        normal: {},
        emphasis: {
            barBorderWidth: 1,
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            shadowColor: "rgba(0,0,0,0.5)"
        }
    };

    private drawThreadRow1Chart: any // 第三行 第一个 echarts 实例
    private drawThreadRow2Chart: any // echarts 实例
    private drawThreadRow3Chart: any // echarts 实例
    private drawFourthRow1Chart: any // echarts 实例
    private drawFourthRow2Chart: any // echarts 实例

    private timer: number = 0 // 定时器 id
    private canvansWidth: string = '100%' // canvans小的框
    private bCanvansWidth: string = '100%' // canvans大的框

    private drawThreadRow1() {
        const drawThreadRow1: any = this.$refs.drawThreadRow1;
        this.drawThreadRow1Chart = echarts.init(drawThreadRow1);
        const data: string[] = ["5-Sep", "6", "7", "8", "9", "10", "11", "12-Sep"]
        let option: object = {
            color: ["#0068FE", "#2F4371", "#19A8D8"],
            tooltip: {
                trigger: "axis",
                formatter: (params: any, ticket: any, callback: any) => {
                    // 判断是否有单位
                    let unit: string = ''
                    if (+params[0].axisValueLabel) {
                        // 拿到所有数据的第一个切割下 获取单位
                        unit = '-' + data.slice(0, 1)[0].split('-')[1]
                    }
                    return `${params[0].axisValueLabel + unit}
                    <br/>${params[0].marker}Value: ${params[0].data}`;
                },
            },
            grid: {
                left: "8%",
                right: "4%",
                bottom: "3%",
                containLabel: true
            },
            xAxis: {
                type: "category",
                axisLabel: {
                    interval: 0
                },
                data
            },
            yAxis: [{
                type: "value",
                // name: "Error CDR values",
                // nameLocation: "center",
                // nameTextStyle: {
                //     padding: [0, 0, 30, 0]
                //     // fontWeight: 600,
                // }
            }],
            series: [{
                data: [423, 44, 234, 225, 33, 167, 33, 2],
                type: "line"
            }]
        };
        this.drawThreadRow1Chart.setOption(option);
    }

    private drawThreadRow2() {
        const drawThreadRow2: any = this.$refs.drawThreadRow2;
        this.drawThreadRow2Chart = echarts.init(drawThreadRow2);
        let option: object = {
            color: ["#f5b148", "#F46871", "#5681F4", "#89CC22"],
            tooltip: {
                trigger: "item",
                formatter: "{a} <br/>{b} : {c} ({d}%)",
                extraCssText: 'z-index: 1000;box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);'
            },
            // legend: {
            //     orient: 'vertical',
            //     x: 'left',
            //     // type: 'scroll',
            //     // orient: 'vertical',
            //     // right: 10,
            //     // top: 20,
            //     // bottom: 20,
            //     data: ['Decoded', 'Format error', 'Rejected by busineess rule', 'Routable', 'Processed'],
            // },
            grid: {
                left: "30%",
                right: "30%",
                // bottom: "3%",
                // containLabel: true
            },
            series: [{
                name: "Vendor offer",
                type: "pie",
                radius: ["20%", "50%"],
                center: ["45%", "50%"],
                startAngle: 200,
                avoidLabelOverlap: false,
                label: {
                    normal: {
                        formatter: (params: any, ticket: any, callback: any) => {
                            return `${params.name}: ${params.value}`
                            // \n${params.percent}
                        },
                        // rotate: 40,
                        // position: "inside"
                    },
                },
                data: this.VendorOfferData,
                // itemStyle: {
                //     emphasis: {
                //         shadowBlur: 10,
                //         shadowOffsetX: 0,
                //         shadowColor: "rgba(0, 0, 0, 0.5)"
                //     }
                // }
            }]
        };
        this.drawThreadRow2Chart.setOption(option);
    }

    private drawThreadRow3() {
        const drawThreadRow3: any = this.$refs.drawThreadRow3;
        this.drawThreadRow3Chart = echarts.init(drawThreadRow3);
        const option: object = {
            color: ["#263159", "#6E94FB", "#3e77d8"],
            tooltip: {
                trigger: "item",
                formatter: "{a} <br/>{b} : {c} ({d}%)",
                extraCssText: 'z-index: 1000;box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
                // axisPointer:{
                //     z:100
                // }
            },
            grid: {
                left: "30%",
                right: "30%",
                // bottom: "3%",
                // containLabel: true
            },
            series: [{
                name: "Client offer",
                type: "pie",
                radius: ["20%", "50%"],
                center: ["50%", "50%"],
                startAngle: 135,
                data: this.ClientOfferData,
                avoidLabelOverlap: false,
                label: {
                    normal: {
                        formatter: (params: any, ticket: any, callback: any) => {
                            return `${params.name}: ${params.value}`
                            // \n${params.percent}
                        },
                        // rotate: 40,
                        // position: "inside"
                    },
                },
                // itemStyle: {
                //     emphasis: {
                //         shadowBlur: 10,
                //         shadowOffsetX: 0,
                //         shadowColor: "rgba(0, 0, 0, 0.5)"
                //     }
                // }
            }]
        };
        this.drawThreadRow3Chart.setOption(option);
    }

    private drawFourthRow1() {
        const drawFourthRow1: any = this.$refs.drawFourthRow1;
        this.drawFourthRow1Chart = echarts.init(drawFourthRow1);
        const option: object = {
            color: ["#F5B148", "#3E77D8"],
            tooltip: {
                trigger: "axis",
                axisPointer: {
                    // 坐标轴指示器，坐标轴触发有效
                    type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
                },
                formatter: (params: any, ticket: any, callback: any) => {
                    return params[0].axisValueLabel + '<br/>' + params.map((item: any) => {
                        return `${item.marker} ${item.componentIndex === 0 ?'Yesterday':'Today'}: ${item.data}`
                    }).join('<br/>')
                },
            },
            legend: {
                top: 20,
                right: 10,
                data: ["11-Aug", "12-Aug"]
            },
            grid: {
                left: "7%",
                right: "4%",
                bottom: "3%",
                containLabel: true
            },
            xAxis: [{
                type: "category",
                axisLabel: {
                    interval: 0
                    // rotate: -20,
                    // align: 'left',
                    // margin: 16,
                    // // left: 0
                    // lineHeight: 56,
                    // textStyle: {
                    //     // color: '#333',
                    //     // fontSize: 14,
                    //     // fontWeight: 600,
                    // },
                },
                data: [
                    "C-rejected",
                    "C-accepted",
                    "T-accepted",
                    "T-rejected",
                    "C-implemented",
                    "Failed",
                    "Other"
                ]
            }],
            yAxis: [{
                type: "value",
                // name: "Routing values",
                // nameLocation: "center",
                // nameTextStyle: {
                //     padding: [0, 0, 30, 0]
                //     // fontWeight: 600,
                // }
            }],
            series: [{
                    name: "11-Aug",
                    type: "bar",
                    barGap: '0',
                    data: [12, 342, 259, 5, 300, 16, 212]
                },
                {
                    name: "12-Aug",
                    type: "bar",
                    barGap: '0',
                    data: [59, 76, 40, 61, 57, 39, 46]
                }
            ]
        };
        this.drawFourthRow1Chart.setOption(option);
    }

    private drawFourthRow2() {
        const drawFourthRow2: any = this.$refs.drawFourthRow2;
        this.drawFourthRow2Chart = echarts.init(drawFourthRow2);
        const option: object = {
            color: ["#263159", "#F46871"],
            tooltip: {
                trigger: "axis",
                axisPointer: {
                    // 坐标轴指示器，坐标轴触发有效
                    type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            legend: {
                top: 20,
                right: 10,
                data: ["Inbound", "Outbound"]
            },
            grid: {
                left: "7%",
                right: "4%",
                bottom: "3%",
                containLabel: true
            },
            xAxis: [{
                type: "category",
                axisLabel: {
                    // interval: 0,
                    // rotate: -20,
                    align: "left"
                    // margin: 16,
                    // left: 0
                    // lineHeight: 56,
                },
                // , '12-Sep'
                data: ["5-Sep", "6", "7", "8", "9", "10", "11-Jan"]
            }],
            yAxis: [{
                type: "value",
                name: "X 1000 (min)",
                nameLocation: "center",
                nameTextStyle: {
                    padding: [0, 0, 30, 0]
                    // fontWeight: 600,
                }
            }],
            series: [{
                    name: "Inbound",
                    type: "bar",
                    barGap: '0',
                    data: [12, 342, 259, 212, 300, 123, 212]
                },
                {
                    name: "Outbound",
                    type: "bar",
                    barGap: '0',
                    data: [12, 334, 259, 212, 300, 16, 210]
                }
            ]
        };
        this.drawFourthRow2Chart.setOption(option);
    }

    // tab卡切换回调 index 选中的下标 0开始 privateKey 传入组件的值(privateKey)
    private tabChange(index: number, privateKey: number | string) {
        console.log("tabChange index", index);
        console.log("privateKey", privateKey);
        switch (privateKey) {
            case 0:
                this.AgreementWVDValue = [];
                // this.AgreementWVDOption.yAxis.data = ['AT&T US-Out-VoIp-USD', 'British T-Out-Ang-USD', 'Duetch T Afri-Out-Ang-USD', 'Vodafone HK-Out-VoIp-USD', 'Russian T-Out-USD']
                if (index === 0) {
                    this.AgreementWVDOptions = [{
                        name: "Without grace period",
                        value: 1
                    }]
                    // 完成率 计划完成率 一般 及格 优秀
                    this.AgreementWVDOption.series[0].data = AgreementWVDCompletionRate;
                    // this.AgreementWVDOption.series[1].data = [95, 90, 90, 90, 85]
                    this.AgreementWVDOption.series[1].data = AgreementWVDCommonRate;

                    this.AgreementWVDOption.series[2].data = AgreementWVDGoodRate;
                    this.AgreementWVDOption.series[3].data = AgreementWVDVeryGoodRate;
                } else {
                    this.AgreementWVDOptions = [{
                        name: "Without forward",
                        value: 2
                    }]

                    // 完成率 计划完成率 一般 及格 优秀
                    this.AgreementWVDOption.series[0].data = [
                        61.9042,
                        72.3351,
                        80.3571,
                        55.2023,
                        84.6273,
                        79.5185,
                        28.2296,
                        31.6413,
                        94.6948,
                        94.2612,
                        73.281,
                        64.4472,
                        92.6601,
                        63.6827
                    ];
                    // this.AgreementWVDOption.series[1].data = [60, 90, 90, 90, 100]
                    this.AgreementWVDOption.series[1].data = [
                        43.9042,
                        53.3351,
                        65.3571,
                        38.2023,
                        65.6273,
                        65.5185,
                        13.2296,
                        17.6413,
                        86.6948,
                        77.2612,
                        56.281,
                        50.4472,
                        75.6601,
                        46.6827
                    ];

                    this.AgreementWVDOption.series[2].data = [
                        53.9042 - 43.9042,
                        63.3351 - 53.3351,
                        75.3571 - 65.3571,
                        48.2023 - 38.2023,
                        75.6273 - 65.6273,

                        75.5185 - 65.5185,
                        23.2296 - 13.2296,
                        27.6413 - 17.6413,
                        90.6948 - 86.6948,
                        87.2612 - 77.2612,
                        66.281 - 56.281,
                        60.4472 - 50.4472,
                        85.6601 - 75.6601,
                        56.6827 - 46.6827
                    ];
                    this.AgreementWVDOption.series[3].data = [
                        100 - 53.9042,
                        100 - 63.3351,
                        100 - 75.3571,
                        100 - 48.2023,
                        100 - 75.6273,

                        100 - 75.5185,
                        100 - 23.2296,
                        100 - 27.6413,
                        100 - 90.6948,
                        100 - 87.2612,
                        100 - 66.281,
                        100 - 60.4472,
                        100 - 85.6601,
                        100 - 56.6827
                    ];
                }
                break;
            case 1:
                if (index === 0) {
                    this.costFluctuationData = costFluctuationData;
                } else {
                    this.costFluctuationData = costFluctuationDownData
                }
                break;
            case 2:
                if (index === 0) {
                    this.fluctuationDestData = fluctuationDestData;
                } else {
                    this.fluctuationDestData = fluctuationDestOutBoundData
                }
                break;
            case 3:
                if (index === 0) {
                    this.fluctuationAccData = fluctuationAccData;
                } else {
                    this.fluctuationAccData = fluctuationAccOutBoundData
                }
                break;
        }
    }
    // 选项框切换回调 val 选中的值 privateKey 传入组件的值(privateKey)
    private selectChange(val: number | string, privateKey: number | string) {
        console.log("selectChange val", val);
        console.log("privateKey", privateKey);
        switch (privateKey) {
            case 0:
                break;
            case 1:
                break;
            case 2:
                break;
            case 3:
                break;
        }
    }

    private getCanvansWidth() {
        if (!this.$refs.pageHome) {
            return
        }
        const contentWidth: number = (this.$refs.pageHome as any).offsetWidth
        // console.log(contentWidth);
        const mWidth: number = Math.round(contentWidth / 3) - 16
        const bWidth: number = Math.round(contentWidth / 2) - 16
        this.canvansWidth = mWidth + 'px';
        this.bCanvansWidth = bWidth + 'px';
        // console.log(this.canvansWidth);
        // 重新设置echarts实例宽度
        // console.log(this.drawThreadRow1Chart);
        this.drawThreadRow1Chart.resize({
            width: mWidth
        })
        this.drawThreadRow2Chart.resize({
            width: mWidth,
        })
        this.drawThreadRow3Chart.resize({
            width: mWidth,
        })
        this.drawFourthRow1Chart.resize({
            width: bWidth,
        })
        this.drawFourthRow2Chart.resize({
            width: bWidth,
        })
    }

    private resize() {
        // 防抖
        if (this.timer) {
            clearTimeout(this.timer)
        }
        this.timer = setTimeout(() => {
            this.getCanvansWidth()
            const overdueAgreement: any = this.$refs.overdueAgreement
            const AgreementWVD: any = this.$refs.AgreementWVD
            if (!overdueAgreement || !AgreementWVD) {
                return
            }
            overdueAgreement.getCanvansWidth()
            AgreementWVD.getCanvansWidth()
        }, 100)
    }

    private created() {
        window.addEventListener('resize', this.resize);
        this.resize()
    }
    private destroyed() {
        window.removeEventListener('resize', this.resize)
        this.drawThreadRow1Chart.clear()
        this.drawThreadRow2Chart.clear()
        this.drawThreadRow3Chart.clear()
        this.drawFourthRow1Chart.clear()
        this.drawFourthRow2Chart.clear()
    }

    private mounted() {
        // 第三行 第一个
        this.drawThreadRow1();
        // 第三行 第二个
        this.drawThreadRow2();
        // 第三行 第三个
        this.drawThreadRow3();
        // 第四行 第一个
        this.drawFourthRow1();
        // 第四行 第二个
        this.drawFourthRow2();
    }
}
</script>

<style lang="scss" scoped>
.canvas-normal {
    // width: 370px;
    width: 100%;
    height: 300px;
    // margin: 0 auto;
    position: absolute;
    left: 50%;
    top: 0;
    transform: translate3d(-50%, 0, 0);
}

.canvas-max {
    // margin: 0 auto;
    width: 100%;
    height: 300px;
    position: absolute;
    left: 50%;
    top: 0;
    transform: translate3d(-50%, 0, 0);
}

.page-home {
    overflow: hidden;
    width: 100%;
    min-width: 1280px;
    height: 100%;
    margin-right: 0;
    padding: 4px;
    background-color: rgb(245, 246, 250);

    .row {
        margin-bottom: 20px;
        // overflow: hidden;

        &:last-child {
            margin-bottom: 0;
        }

        .card {
            position: relative;
            min-height: 410px;
            height: 410px;
            overflow: hidden;
            background-color: #fafafa;
            box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
            box-shadow: 0px 2px 4px 3px #e7e9f5;

            &.max-card {
                min-height: 470px;
                height: 470px;
            }

            &.min-card {
                min-height: 350px;
                height: 350px;
            }

            .card-title {
                font-weight: 600;
                margin-top: 10px;
                font-size: 16px;
                cursor: pointer;
                border-left: #3e77d8 6px solid;
                padding: 2px 0 2px 10px;

                &:hover {
                    color: #0000ff;
                }
            }

            .card-header {
                margin-top: 6px;
                margin-bottom: 10px;
                display: flex;
                line-height: 28px;

                .card-title {
                    flex: 1;
                    line-height: 16px;
                    margin-top: 4px;
                    margin-bottom: 4px;
                    white-space: nowrap;
                }

                .card-select {
                    flex: 0 0 120px;

                    .ant-select-selection--single {
                        line-height: 28px;

                        .ant-select-selection__rendered {
                            line-height: 28px;
                        }
                    }
                }
            }

            .card-content {
                margin-top: 10px;
                min-height: 300px; // 画图div是绝对定位脱离文档流 导致中间的圆错位
                position: relative;

                .content-top {
                    display: flex;

                    .item {
                        // overflow: hidden;
                        margin: 0 8px;
                        flex: 1;
                        background-color: rgb(130, 83, 200);
                        text-align: center;
                        color: #ffffff;

                        &.item-right {
                            background-color: rgb(250, 94, 36);
                        }

                        .item-title {
                            font-size: 14px;
                            line-height: 34px;
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
                        flex: 1;
                        background-color: rgb(255, 163, 24);
                        margin: 0 8px;
                        color: #ffffff;
                        text-align: center;
                        min-height: 226px;

                        &:last-child {
                            background-color: rgb(0, 143, 42);
                        }

                        .item-top {
                            background-color: rgba(255, 255, 255, 0.3);

                            .item-title {
                                font-size: 14px;
                                line-height: 34px;
                            }

                            .item-content {
                                font-size: 16px;
                                font-weight: 700;
                                line-height: 44px;
                            }
                        }
                    }
                }

                .total-data {
                    position: absolute;
                    top: 50%;
                    left: 45%;
                    z-index: 1;
                    border-radius: 50%;
                    width: 80px;
                    height: 80px;
                    line-height: 80px;
                    // 宽度和高度相同 都为宽度20%    
                    // width: 20%;
                    // height: 0;
                    // padding-top: 20%;
                    // background-color: #fafafa;
                    text-align: center;
                    font-size: 20px;
                    transform: translate3d(-50%, -50%, 0);

                    &.client-offer {
                        left: 50%;
                    }
                }
            }
        }
    }
}
</style>
