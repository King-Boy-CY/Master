<template>
<div class="recurring-code">
    <h1 style="padding:10px;">Basic data</h1>
    <a-form :form="form">
        <a-row style="padding:10px;">
            <a-col :span="12">
                <a-form-item label="Recurring dimension" :colon="false" :hasFeedback="false" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
                    <a-select :getPopupContainer="triggerNode => triggerNode.parentNode" v-decorator="[
                `recurringDimension`,
                {
                  rules: [{
                    required: true,
                    message: `recurringDimension field should be no-null`
                  }]
                }
              ]" placeholder="" @change="recurringChange($event)">
                        <a-select-option :value="child" v-for="(child,key) in ['Day', 'Week', 'Month', 'Year']" :key="key">
                            {{child}}
                        </a-select-option>
                    </a-select>
                </a-form-item>
            </a-col>
            <a-col :span="12">
                <a-form-item label="Counts" :colon="false" :hasFeedback="false" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
                    <a-input @blur="countChange" v-decorator="[
                `Counts`,
                {
                  rules: [{
                    required: true,
                    message: `Counts field should be no-null`
                  }]
                }
              ]" placeholder="" />
                </a-form-item>
            </a-col>
            <a-col :span="12">
                <a-form-item label="Fixed charge" :colon="false" :hasFeedback="false" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
                    <a-select @change="handleChange($event,'fixedCharge')" :getPopupContainer="triggerNode => triggerNode.parentNode" v-decorator="[
                `fixedCharge`,
                {
                  rules: [{
                    required: true,
                    message: `fixedCharge field should be no-null`,
                  }],
                 initialValue: 'Yes'
                }
              ]" placeholder="">
                        <!-- 先去掉默认值 加上印象固定费率 rateplan 插入数据的渲染 -->

                        <a-select-option :value="child" v-for="(child,key) in ['Yes','No']" :key="key">{{child}}</a-select-option>
                    </a-select>
                </a-form-item>
            </a-col>
            <a-col :span="12">
                <a-form-item label="Same tariff" :colon="false" :hasFeedback="false" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
                    <a-select @change="sameTariChange" :getPopupContainer="triggerNode => triggerNode.parentNode" v-decorator="[
                `sameTariff`,
                {
                  rules: [{
                    required: false,
                    message: `sameTariff field should be no-null`,
                  }],
                 initialValue: 'No'
                }
              ]" placeholder="">
                        <!-- 先去掉默认值 加上印象固定费率 rateplan 插入数据的渲染 -->
                        <a-select-option :value="child" v-for="(child,key) in ['Yes','No']" :key="key">{{child}}</a-select-option>
                    </a-select>
                </a-form-item>
            </a-col>
        </a-row>
    </a-form>
    <!-- <div>
        <h1>Rating data</h1>
        <div class="Zone-code">
          <span class="title">Zone</span>
        </div>
          <table>
            <thead>
              <tr>
                <th></th>
              </tr>
            </thead>
          </table>
        </div> -->
    <!--<div class="example" v-show="spinning">

      <a-spin tip="生成复制中..." :spinning="spinning"/>
    </div>-->
    <ratingZoneForm ref="ratingZoneForm" v-if="fixedCharge === 'Yes'" :ratingData="ratingData" :fixedCharge="fixedCharge" @input="onInput" @picker="onPicker" @ratingForm="ratingForm" />
    <rating-zone :destinationsOptions="destinationsOptions" ref="ratingData" :ratingData="rateData" v-else :tableColumn="tablColumns" @rowChange="ratingDataRowChange" @ratingForm="ratingZoneForm" @input="onZoneInput" @select="onZoneselect" @picker="onZonePicker" />
</div>
</template>

<script lang="ts">
import Vue from 'vue'
import {
    Component,
    Prop
} from 'vue-property-decorator'
import {
    getDstinationList
} from '@/api/index'
import moment from 'moment'
import {
    State,
    Mutation
} from 'vuex-class'
import {
    deepClone
} from "@/assets/ts/index";
// 通用配置
import { refsConfig } from '@/assets/ts/config.d'
import ratingZone from '../../Ratingzone.vue'
import ratingZoneForm from '../../ratingZoneForm.vue'
// 公有静态数据  变量声明
import { Destinations, getAixosConfig } from '../../publicParameter/publicConfig'
@Component({
    components: {
        TableInput: ()=> import('@/common/TableInput/index.vue'),
        // ratingZone: resolve => require(['../Ratingzone.vue'], resolve),
        // ratingZoneForm: resolve => require(['../ratingZoneForm.vue'], resolve),
        ratingZone,
        ratingZoneForm
    }
})

export default class recurringCharge extends Vue {
    @State('ratePlanObject') private ratePlanObject: any
    @State('productIndex') private productIndex ? : any
    @State('prossData') private prossData ? : any
    @Mutation('mutionProduct') mutionProduct: any
    @Prop(Array) private tableColumn ? : any;
    @Prop(Number) private productKey ? : number // productKey 标识唯一数据
    @Prop() private editData ? : any;
    @Prop() private contractIndex ? : number;
    @Prop() private editArr ? : any;
    @State('closeModel') closeModel: any
    public $refs: refsConfig | any
    private fixedCharge: string = 'Yes';
    private recurringValue: string = ''
    private sameTariValue: string = ''
    private ratingform: any
    private ratingZoneform: any
    private beginObj: any = {}
    private proIndex: number = 0
    private spinning: boolean = false
    /* 表格数据 -> 头部 */
    private tablColumns: any[] = [{
            type: 'selection',
            width: 60,
            align: 'center'
        },
        {
            title: 'TimeBandName',
            dataIndex: 'timeBandName',
            width: 134,
            key: 'timeBandName',
            // customRender: (value: string, row: any, index: number) => {
            //     return this.renderContent(value, row, index);
            // }
        },
        {
            title: 'Day',
            children: [{
                    title: 'From',
                    dataIndex: 'dayFrom',
                    width: 151,
                    key: 'dayFrom',
                    // customRender: (value: string, row: any, index: number) => {
                    //     return this.renderContent(value, row, index);
                    // }
                    render: (h: any, params: any) => {
                        if (params.row.detailList.length > 1) {
                            return h('div', {
                                attrs: {
                                    class: 'subCol'
                                },
                            }, [
                                h('ul', params.row.detailList.map((item: any) => {
                                    return h('li', {}, item.dayFrom)
                                }))
                            ]);
                        } else {
                            return h('div', {
                                attrs: {
                                    class: 'subCol'
                                }
                            }, [
                                h('span', params.row.detailList.map((item: any) => {
                                    return h('li', {}, item.dayFrom)
                                })),
                            ])
                        }
                    }
                },
                {
                    title: 'To',
                    dataIndex: 'dayTo',
                    width: 122,
                    key: 'dayTo',
                    // customRender: (value: string, row: any, index: number) => {
                    //     return this.renderContent(value, row, index);
                    // }
                    render: (h: any, params: any) => {
                        if (params.row.detailList.length > 1) {
                            return h('div', {
                                attrs: {
                                    class: 'subCol'
                                },
                            }, [
                                h('ul', params.row.detailList.map((item: any) => {
                                    return h('li', {}, item.dayTo)
                                }))
                            ]);
                        } else {
                            return h('div', {
                                attrs: {
                                    class: 'subCol'
                                }
                            }, [
                                h('span', params.row.detailList.map((item: any) => {
                                    return h('li', {}, item.dayTo)
                                })),
                            ])
                        }
                    }
                },
            ]
        },
        {
            title: 'Weekday',
            children: [{
                    title: 'WeekdaysFrom',
                    dataIndex: 'weekdayFrom',
                    width: 204,
                    key: 'weekdayFrom',
                    render: (h: any, params: any) => {
                        if (params.row.detailList.length > 1) {
                            return h('div', {
                                attrs: {
                                    class: 'subCol'
                                },
                            }, [
                                h('ul', params.row.detailList.map((item: any) => {
                                    return h('li', {}, item.weekdayFrom)
                                }))
                            ]);
                        } else {
                            return h('div', {
                                attrs: {
                                    class: 'subCol'
                                }
                            }, [
                                h('span', params.row.detailList.map((item: any) => {
                                    return h('li', {}, item.weekdayFrom)
                                })),
                            ])
                        }
                    }
                },
                {
                    title: 'WeekdaysTo',
                    dataIndex: 'weekdayTo',
                    width: 204,
                    key: 'weekdayTo',
                    render: (h: any, params: any) => {
                        if (params.row.detailList.length > 1) {
                            return h('div', {
                                attrs: {
                                    class: 'subCol'
                                },
                            }, [
                                h('ul', params.row.detailList.map((item: any) => {
                                    return h('li', {}, item.weekdayTo)
                                }))
                            ]);
                        } else {
                            return h('div', {
                                attrs: {
                                    class: 'subCol'
                                }
                            }, [
                                h('span', params.row.detailList.map((item: any) => {
                                    return h('li', {}, item.weekdayTo)
                                })),
                            ])
                        }
                    }
                },
            ]
        },
        {
            title: 'Specific time',
            children: [{
                    title: 'From',
                    dataIndex: 'timeFrom',
                    width: 204,
                    key: 'timeFrom',
                    render: (h: any, params: any) => {
                        if (params.row.detailList.length > 1) {
                            return h('div', {
                                attrs: {
                                    class: 'subCol'
                                },
                            }, [
                                h('ul', params.row.detailList.map((item: any) => {
                                    return h('li', {}, item.timeFrom)
                                }))
                            ]);
                        } else {
                            return h('div', {
                                attrs: {
                                    class: 'subCol'
                                }
                            }, [
                                h('span', params.row.detailList.map((item: any) => {
                                    return h('li', {}, item.timeFrom)
                                })),
                            ])
                        }
                    }
                },
                {
                    title: 'To',
                    dataIndex: 'timeTo',
                    width: 124,
                    key: 'timeTo',
                    render: (h: any, params: any) => {
                        if (params.row.detailList.length > 1) {
                            return h('div', {
                                attrs: {
                                    class: 'subCol'
                                },
                            }, [
                                h('ul', params.row.detailList.map((item: any) => {
                                    return h('li', {}, item.timeTo)
                                }))
                            ]);
                        } else {
                            return h('div', {
                                attrs: {
                                    class: 'subCol'
                                }
                            }, [
                                h('span', params.row.detailList.map((item: any) => {
                                    return h('li', {}, item.timeTo)
                                })),
                            ])
                        }
                    }
                },
            ]
        },
        {
            title: 'Type',
            dataIndex: 'type',
            width: 100,
            key: 'type',
            render: (h: any, params: any) => {
                if (params.row.detailList.length > 1) {
                    return h('div', {
                        attrs: {
                            class: 'subCol'
                        },
                    }, [
                        h('ul', params.row.detailList.map((item: any) => {
                            return h('li', {}, item.type)
                        }))
                    ]);
                } else {
                    return h('div', {
                        attrs: {
                            class: 'subCol'
                        }
                    }, [
                        h('span', params.row.detailList.map((item: any) => {
                            return h('li', {}, item.type)
                        })),
                    ])
                }
            }
        },
        {
            title: 'Modified by',
            dataIndex: 'modifiedBy',
            width: 100,
            key: 'modifiedBy',
        },
        {
            title: 'Last modified',
            dataIndex: 'lastModified',
            width: 100,
            key: 'lastModified',

        }
    ];
    /* Rating data */
    private ratingData: any[] = []
    private rateData: any[] = []
    /* From */
    private form: any;

    // ratingZoneList 数据
    private ratingZoneList: any[] = []

    private destinationsOptions: object[] = []

    // 定时器id
    private timer: number = 0

    public beforeCreate() {
        this.form = this.$form.createForm(this);
    }
    public checkErrorTips(title: string, content: string) {
        return this.$error({
            title,
            content
        });
    }
    public checkRecuuing(item: any) {
        let isCheckStatus: boolean = true
        let that: any = this
        this.form.validateFields((err: any, value: any) => {
            if (err) {

            }
        })
        if (!item.recurringDimension) {
            this.checkErrorTips(`${item.productName}`, `'Recurring dimension' field should be no-null`)
            isCheckStatus = false
            return false
        }
        if (!item.dimensionCount) {
            this.checkErrorTips(`${item.productName}`, ` 'Counts' field should be no-null`)
            isCheckStatus = false
            return false
        }
        console.log('item.isFixedCharge', item.isFixedCharge);
        //  if (this.fixedCharge !== 'Yes') {
        //     this.rateData = rateDom
        //     this.$refs.ratingData && this.$refs.ratingData.form.resetFields()
        // } else {
        //     this.ratingData = rateDom
        //     this.$refs.ratingZoneForm && this.$refs.ratingZoneForm.zoneForm.resetFields()
        // }
        console.log('item', item);
        console.log('that.$refs', that.$refs);
        if (item.isFixedCharge == 1) {
            isCheckStatus = true
            let ratingData = this.ratingData
            console.log('that.$refs.ratingZoneForm', that.$refs.ratingZoneForm);

            // that.$refs.ratingZoneForm.zoneForm.validateFields((err: any, value: any) => {
            //     if (err) {

            //     }
            // })
            // let rateDataForm = that.$refs.ratingZoneForm.form.getFieldsValue()
            for (let i = 0; i < item.ratingZoneList.length; i++) {
                const elem = item.ratingZoneList[i];
                if (!(elem.amount + '')) {
                    this.checkErrorTips(`${item.productName}`, `'Amount' field should be no-null`)
                    isCheckStatus = false
                    break
                }
                if (Number.isNaN(+elem.amount)) {
                    this.checkErrorTips(`${item.productName}`, `'Amount' field should be Number`)
                    isCheckStatus = false
                    break
                }

                // if (!elem.chargeItem) {
                //     this.checkErrorTips(`${item.productName}`,'循环维度未输入固定金额名称')
                //     isCheckStatus = false
                //     break
                // }
                if (!elem.beginDate) {
                    this.checkErrorTips(`${item.productName}`, `'Begin date' field should be no-null`)
                    isCheckStatus = false
                    break
                }
                if (!elem.endDate) {
                    this.checkErrorTips(`${item.productName}`, `'End date' field should be no-null`)
                    isCheckStatus = false
                    break
                }
            }
            return isCheckStatus
        } else {
            isCheckStatus = true
            console.log('that.$refs.ratingData', that.$refs.ratingData);

            // that.$refs.ratingData.form.validateFields((err: any, value: any) => {
            //     if (err) {

            //     }
            // })
            let isChargeUnit: any[] = []
            let isDestinationList: any[] = []
            let isRate: any[] = []
            for (let i = 0; i < item.ratingZoneList.length; i++) {
                const elem = item.ratingZoneList[i];
                isDestinationList[i] = []
                isChargeUnit[i] = []
                isRate[i] = []
                isDestinationList[i].push({
                    status: true,
                    index: 0
                })
                isChargeUnit[i].push({
                    status: true,
                    index: 0
                })
                isRate[i].push({
                    status: true,
                    type: true,
                    index: 0
                })
                // if (!elem.chargeItem) {
                //     this.checkErrorTips(`${item.productName}`,'循环维度未输入固定金额名称')
                //     isCheckStatus = false
                //     break
                // }
                if (!elem.beginDate) {
                    this.checkErrorTips(`${item.productName}`, `Zone${i+1} 'Begin date' field should be no-null`)
                    isCheckStatus = false
                    break
                }
                if (!elem.endDate) {
                    this.checkErrorTips(`${item.productName}`, `Zone${i+1} 'End date' field should be no-null`)
                    isCheckStatus = false
                    break
                }
                // 行数
                let row: number = 0
                for (let j = 0; j < elem.ratingDetailList.length; j++) {
                    const element = elem.ratingDetailList[j];
                    element.timeBandDetailIndex == 0 && row++
                    if (!element.chargeUnit) isChargeUnit[i][0]['status'] = false, isChargeUnit[i][0]['index'] = j + 1
                    if (!element.destinationList) isDestinationList[i][0]['status'] = false, isChargeUnit[i][0]['index'] = j + 1
                    // if (!element.rate) isRate[i][0]['status'] = false, isChargeUnit[i][0]['index'] = j + 1
                    if (!(element.rate + "")) isRate[i][0]['status'] = false, isChargeUnit[i][0]['index'] = j + 1
                    if (Number.isNaN(+element.rate)) isRate[i][0]['status'] = false, isRate[i][0]['type'] = false, isChargeUnit[i][0]['index'] = j + 1

                }
                if (!isDestinationList[i][0]['status']) {
                    // 第${isChargeUnit[i][0]['index']}列未输入循环维度费率区
                    this.checkErrorTips(`${item.productName}`, `Zone${i+1} -- ${row}row  'Destination' field should be no-null`)
                    isCheckStatus = false
                    break
                }
                if (!isRate[i][0]['status']) {
                    //第${i+1}个Zone 第${row}行 第${isChargeUnit[i][0]['index']}列未输入循环维度费率值
                    this.checkErrorTips(`${item.productName}`, `Zone${i+1} -- ${row}row ${isChargeUnit[i][0]['index']}column 'Rate' field should be ${isRate[i][0].type?'no-null':'Number'}`)
                    isCheckStatus = false
                    break
                }
                if (!isChargeUnit[i][0]['status']) {
                    this.checkErrorTips(`${item.productName}`, `Zone${i+1} -- ${row}row 'Chargable unit type' field should be no-null`)
                    isCheckStatus = false
                    break
                }
            }
            return isCheckStatus
        }
        return isCheckStatus
    }

    /* 生成dom数据*/
    public selectDom(values ? : number | string) {
        if (!values || !this.fixedCharge || !this.recurringValue) return
        this.spinning = !this.spinning
        let ratePlanArr: any = []
        if (this.contractIndex === 1) {
            ratePlanArr = this.getTabs()
        } else {
            ratePlanArr = this.editArr
        }
        const arr_month: any = []
        let begin: any, endin: any
        // for (let i = 0; i < this.ratePlanObject.length; i++) {
        //     const element = this.ratePlanObject[i];
        //     for (let j = 0; j < element.tabs.length; j++) {
        //         const elme = element.tabs[j];
        //         ratePlanArr.push(elme)
        //         // if (element.tabs[this.proIndex].RateStructure === elme.RateStructure) {
        //         //   begin = moment(elme.commitmentBeginDate)
        //         //   endin = moment(elme.commitmentEndDate)
        //         // }
        //     }
        // }
        console.log('ratePlanArr', ratePlanArr);

        begin = moment(ratePlanArr[this.proIndex].commitmentBeginDate)
        endin = moment(ratePlanArr[this.proIndex].commitmentEndDate)
        // console.log('begin', begin);
        // console.log('endin', endin);
        /* 求年份 */
        if (this.recurringValue === 'Year') {
            let beginDate = moment(begin).format("YYYY")
            let endDate: any = moment(endin).format("YYYY")
            var beg = moment([Number(beginDate), 6]);
            var end = moment([Number(endDate), 7]);
            // let value = Number(this.form.getFieldValue('Counts')||values)
            let value: any = values
            let len = Math.ceil(end.diff(beg, 'years') / value)
            for (let i = 0; i < (len <= 0 ? 1 : len + 1); ++i) {
                arr_month.push({
                    month: `${i + 1} 年`,
                    start_month: moment(begin).format("YYYY/MM/DD"),
                    endDate: moment(begin).add(value, "year").add(-1, 'd').format("YYYY/MM/DD")
                })
                if (arr_month.length >= 2) {
                    arr_month[i]['start_month'] = moment(arr_month[i - 1]['endDate']).add(1, 'd').format("YYYY/MM/DD")
                    arr_month[i]['endDate'] = moment(arr_month[i - 1]['endDate']).add(value, "year").format("YYYY/MM/DD")
                }
                if (arr_month[i].endDate && moment(arr_month[i].endDate).format('YYYY/MM/DD') >= moment(endin).format('YYYY/MM/DD')) {
                    arr_month[i]['endDate'] = moment(endin).format('YYYY/MM/DD')
                    break
                }
            }
            // arr_month[arr_month.length - 1]['endDate'] = moment(endin).format('YYYY/MM/DD')
            /* 求月份 */
        } else if (this.recurringValue === 'Month') {
            let beginDate = moment(begin)
            let endDate: any = moment(endin).endOf("d")
            let beg = moment(begin).format('YYYY')
            let MM = Number(moment(begin).format('MM'))
            // let value = Number(this.form.getFieldValue('Counts')||values)
            let value: any = values
            console.log('value', value);

            // //开始计算这两个时间段相差的月份
            const diff_times = endDate.diff(beginDate, "M");
            for (let i = 0; i < diff_times + 1; ++i) {
                arr_month.push({
                    month: `${i + 1} 月份`,
                    start_month: moment(beginDate).format("YYYY/MM/DD"),
                    endDate: moment(beginDate).add(value, "M").add(-1, 'd').format("YYYY/MM/DD")
                });
                if (arr_month.length >= 2) {
                    arr_month[i]['start_month'] = moment(arr_month[i - 1]['endDate']).add(1, 'd').format("YYYY/MM/DD")
                    arr_month[i]['endDate'] = moment(arr_month[i]['start_month']).add(value, "M").add(-1, 'd').format("YYYY/MM/DD")
                }
                if (arr_month[i].endDate && moment(arr_month[i].endDate).format('YYYY/MM/DD') >= moment(endin).format('YYYY/MM/DD') || moment(arr_month[i].endDate).format('YYYY/MM/DD') === moment(endin).format('YYYY/MM/DD')) {
                    arr_month[i]['endDate'] = moment(endin).format('YYYY/MM/DD')
                    break
                }
            }
            // arr_month[arr_month.length - 1]['endDate'] = moment(endin).format('YYYY/MM/DD')
            /* 求周 */
        } else if (this.recurringValue === 'Week') {
            let beginDate = moment(begin)
            let endDate: any = moment(endin).endOf("d")
            // let value = Number(this.form.getFieldValue('Counts')||values)
            let value: any = values
            //开始计算这两个时间段相差的周
            const diff_times = endDate.diff(beginDate, "days");
            let len = Math.ceil(diff_times + 1 / 7)
            for (let i = 0; i < len; ++i) {
                if (arr_month.length >= 2 && moment(arr_month[i - 1]['endDate']).format('YYYY/MM/DD') >= moment(endin).format('YYYY/MM/DD')) {
                    arr_month[i - 1]['endDate'] = moment(endin).format('YYYY/MM/DD')
                    break
                }
                arr_month.push({
                    month: `${i + 1} 周`,
                    start_month: moment(beginDate).format('YYYY/MM/DD'),
                    endDate: moment(beginDate).add(7 * value - 1, 'days').endOf('days').format('YYYY/MM/DD')
                })
                if (arr_month.length >= 2) {
                    arr_month[i]['start_month'] = moment(arr_month[i - 1]['endDate']).add(1, "days").startOf('days').format("YYYY/MM/DD")
                    arr_month[i]['endDate'] = moment(arr_month[i - 1]['endDate']).add(7 * value, 'days').format("YYYY/MM/DD")
                }
                if (arr_month[i].endDate && moment(arr_month[i].endDate).format('YYYY/MM/DD') >= moment(endin).format('YYYY/MM/DD')) {
                    arr_month[i]['endDate'] = moment(endin).format('YYYY/MM/DD')
                    break
                }
            }
            // arr_month[arr_month.length - 1]['endDate'] = moment(endin).format('YYYY/MM/DD')
            /* 求天 */
        } else if (this.recurringValue === 'Day') {
            let beginDate = moment(begin)
            let endDate: any = moment(endin).endOf("d")
            let beg = moment(begin).format('YYYY')
            let d = Number(moment(begin).format('d'))
            // let value = Number(this.form.getFieldValue('Counts') || values)
            let value: any = values
            //开始计算这两个时间段相差的天
            const diff_times = endDate.diff(beginDate, "days");
            let len = Math.ceil(diff_times / value)
            for (let i = 0; i < diff_times + 1; ++i) {
                if (arr_month.length >= 2 && moment(arr_month[i - 1]['endDate']).format('YYYY/MM/DD') >= moment(endin).format('YYYY/MM/DD')) {
                    arr_month[i - 1]['endDate'] = moment(endin).format('YYYY/MM/DD')
                    break
                }
                arr_month.push({
                    month: `${i + 1} 天`,
                    start_month: moment(begin).format("YYYY/MM/DD"),
                    endDate: moment(begin).add(value - 1, "days").endOf('days').format("YYYY/MM/DD")
                })
                if (arr_month.length >= 2) {
                    arr_month[i]['start_month'] = moment(arr_month[i - 1]['endDate']).add(1, "days").startOf('days').format("YYYY/MM/DD")
                    arr_month[i]['endDate'] = moment(arr_month[i - 1]['endDate']).add(value, "days").endOf('days').format("YYYY/MM/DD")
                }
                if (arr_month[i].endDate && moment(arr_month[i].endDate).format('YYYY/MM/DD') >= moment(endin).format('YYYY/MM/DD')) {
                    arr_month[i]['endDate'] = moment(endin).format('YYYY/MM/DD')
                    break
                }
            }
        }
        console.log('arr_month', arr_month)
        this.procussDom(arr_month)
    }

    /* count 季度 */
    public countChange(e: any) {
        if (!e.target.value) {
            this.rateData = []
            this.ratingData = []
            return
        }
        this.selectDom(e.target.value)
    }

    /* 处理dom */
    public procussDom(arr: any) {
        let arr_month = arr
        // if (!arr_month.length) return this.$message.error(`数据生成${arr_month.length}条`)
        let rateDom: any[] = []
        for (let i = 0; i < arr_month.length; i++) {
            const elem = arr_month[i];
            if (this.fixedCharge === 'Yes') {
                rateDom.push({
                    Zone: i + 1,
                    ChargeItem: {
                        name: 'ChargeItem' + i + 1,
                        type: 'input',
                        disabled: false,
                        initialValue: ''
                    },
                    Amount: {
                        type: 'input',
                        name: 'Amount' + i + 1,
                        disabled: false,
                        initialValue: '',
                        required: true
                    },
                    beginDate: {
                        type: 'picker',
                        initialValue: elem.start_month,
                        disabled: true,
                        name: 'beginDate' + i + 1,
                        required: true
                    },
                    endDate: {
                        type: 'picker',
                        initialValue: elem.endDate,
                        disabled: true,
                        required: true,
                        name: 'endDate' + i + 1,
                    }
                })
            } else {
                let inputdataOptions: any
                let inputcolumns: any
                let timeBand: any

                let rateData = this.rateData
                let newData: any = []
                let count = -1
                let unit = ['Secs', 'Mins', 'Quarters', 'Call', 'User']
                /* 身体 */
                let dataList: any = []
                /* 头部 */
                let columnsList: any = []
                let timeBandInitialValue: string = ''
                let date = new Date().getTime()
                // 数据
                const zoneList = this.ratingZoneList[i];
                const rateList = rateData[i]

                if (zoneList && zoneList.ratingDetailList.length) {
                    /* 加入头部数据 */
                    let objCount: any = {},
                        peakCount: number = 0,
                        offPeakCount: number = 0
                    columnsList.push({
                        dataIndex: 'No',
                        key: 'No',
                        title: 'No'
                    })
                    columnsList.push({
                        dataIndex: 'destination',
                        key: 'destination',
                        title: 'destination',
                        require: true
                    })

                    for (let k = 0; zoneList.timeBandDetailList && k < zoneList.timeBandDetailList.length; k++) {
                        const elem = zoneList.timeBandDetailList[k];

                        if (!objCount['Offpeak'] && elem.type == 2) {
                            offPeakCount = 1
                            objCount['Offpeak'] = 'Offpeak'
                            elem.type = 'Offpeak' + offPeakCount
                        } else if (objCount['Offpeak'] && elem.type == 2) {
                            offPeakCount += 1
                            // objCount[item.type] = 'Offpeak'
                            elem.type = 'Offpeak' + offPeakCount
                        }
                        if (!objCount['peak'] && elem.type == 1) {
                            peakCount = 1
                            objCount['peak'] = 'peak'
                            elem.type = 'peak' + peakCount
                        } else if (objCount['peak'] && elem.type == 1) {
                            peakCount += 1
                            // objCount['peak'] = 'peak'
                            elem.type = 'peak' + peakCount
                        }
                        timeBandInitialValue += `${elem.type || '--'}\xa0\xa0\xa0\xa0:\xa0${elem.dayFrom || '--'}-${elem.dayTo || '--'}\xa0/\xa0${elem.weekdayFrom || '--'}-${elem.weekdayTo || '--'}\xa0/\xa0${elem.timeFrom || '--'}-${elem.timeTo || '--'}\n`

                        columnsList.push({
                            dataIndex: elem.type === 1 ? 'peck' : 'Offpeck',
                            key: elem.type === 1 ? 'peck' : 'Offpeck',
                            title: elem.type === 1 ? 'peck' : 'Offpeck',
                            // title: elem.type,
                            require: true
                        })
                    }
                    (!zoneList.timeBandDetailList || !zoneList.timeBandDetailList.length) && columnsList.push({
                        dataIndex: 'Rate',
                        key: 'Rate',
                        title: 'Rate',
                        // title: elem.type,
                        require: true
                    })
                    columnsList.push({
                        dataIndex: 'ChargableunitType',
                        key: 'ChargableunitType',
                        title: 'Chargable unit type',
                        require: true
                    })

                    let lastCount: number = -1 // 上一次的count
                    let rateNum: number = 0
                    for (let o = 0; o < zoneList.ratingDetailList.length; o++) {
                        const elem = zoneList.ratingDetailList[o];
                        let {
                            chargeUnit,
                            destinationList,
                            rate,
                            timeBandDetailIndex
                        } = elem
                        console.log('this.fixedCharge', this.fixedCharge, !timeBandDetailIndex ? 0 : count);

                        if (elem.timeBandDetailIndex === 0 || elem.timeBandDetailIndex === undefined) {
                            count++
                            this.$set(dataList, count, [])

                        }
                        // console.log('elem.timeBandDetailIndex', elem.timeBandDetailIndex);
                        // console.log('上一次的count,lastCount', lastCount);
                        // console.log('count', count);

                        /* 加入身体数据 */
                        // 当上一次的count 和本次count 不相同的话 说明是需要换行了  否则的话 就在改行插入数据到倒数第二位置
                        if (lastCount !== count) {
                            dataList[count].splice(0, 0, {}, {
                                decorator: 'destination' + date + count,
                                disabled: false,
                                initialValue: destinationList && destinationList instanceof Array ? destinationList : (destinationList ? destinationList.split(',') : []),
                                options: deepClone(this.destinationsOptions),
                                require: true,
                                type: 'tabs'
                            }, {
                                decorator: 'Rate' + (elem.timeBandDetailIndex || '') + date + ++rateNum,
                                disabled: false,
                                initialValue: elem.rate + '',
                                timeBandDetailIndex: elem.timeBandDetailIndex,
                                require: true,
                                type: 'input'
                            }, {
                                decorator: 'ChargableunitType' + date + count,
                                disabled: false,
                                initialValue: unit[chargeUnit - 1],
                                require: true,
                                options: unit,
                                chargeUnit: chargeUnit,
                                type: 'select'
                            })
                        } else {
                            dataList[count].splice(-1, 0, {
                                decorator: 'Rate' + (elem.timeBandDetailIndex || '') + date + ++rateNum,
                                disabled: false,
                                initialValue: elem.rate + '',
                                timeBandDetailIndex: elem.timeBandDetailIndex,
                                require: true,
                                type: 'input'
                            })
                        }
                        lastCount = count
                    }
                    // console.log('dataList', dataList);
                    inputdataOptions = dataList.map((item: any, index: number) => {
                        return {
                            name: item,
                            key: '' + new Date().getTime() + index
                        }
                    })
                    inputcolumns = {
                        type: 'tableCloums',
                        options: columnsList
                    }
                    timeBand = {
                        type: 'textarea',
                        message: 'Time band field should be no-null',
                        initialValue: timeBandInitialValue || '',
                        required: true,
                        disabled: false,
                        name: 'timeBand',
                        decorator: `timeBand` + new Date().getTime() + i,
                        timeBandDetailList: zoneList.timeBandDetailList,
                    }
                } else {
                    inputcolumns = {
                        type: 'tableCloums',
                        options: [{
                                title: 'No .',
                                dataIndex: 'No',
                                key: 'No'
                            },
                            {
                                title: 'destination',
                                dataIndex: 'destination',
                                key: 'destination0',
                                require: true
                            },
                            {
                                title: 'Rate',
                                dataIndex: 'Rate',
                                initialValue: '',
                                require: true
                            },
                            {
                                title: 'Chargable unit type',
                                dataIndex: 'ChargableunitType',
                                initialValue: '',
                                require: true
                            }
                        ]
                    }
                    inputdataOptions = [{
                        name: [{},
                            {
                                type: 'tabs',
                                require: true,
                                initialValue: [],
                                decorator: `destination` + i + 1,
                                disabled: false,
                                options: deepClone(this.destinationsOptions)
                            },
                            {
                                type: 'input',
                                require: true,
                                initialValue: '',
                                decorator: `Rate` + i + 1,
                                disabled: false
                            },
                            {
                                type: 'select',
                                decorator: `ChargableunitType` + i + 1,
                                initialValue: '',
                                require: true,
                                disabled: false,
                                options: [{
                                        name: 'Secs',
                                        disabled: false
                                    }, {
                                        name: 'Mins',
                                        disabled: false
                                    }, {
                                        name: 'Quarters',
                                        disabled: false
                                    },
                                    {
                                        name: 'Call',
                                        disabled: false
                                    },
                                    {
                                        name: 'User',
                                        disabled: false
                                    },
                                ]
                            }
                        ],
                        key: '' + new Date().getTime() + i
                    }]
                    timeBand = {
                        type: 'textarea',
                        message: 'Time band field should be no-null',
                        initialValue: timeBandInitialValue || '',
                        required: true,
                        disabled: false,
                        name: 'timeBand',
                        decorator: `timeBand` + i + 1,
                        timeBandDetailList: undefined
                    }
                }

                if (this.sameTariValue === 'Yes' && i !== 0) {
                    const clone = deepClone(rateDom[0])
                    // 复制设置zone 的表头
                    inputcolumns = clone.inputcolumns
                    const key = '' + new Date().getTime()
                    // 复制设置zone 的表格数据
                    inputdataOptions = clone.inputdata.options.map((item: any, index: number) => {
                        item.key = key + index
                        const innerKey = '' + new Date().getTime() + index
                        item.name.forEach((innerItem: any, innerIndex: number) => {
                            if (innerItem.decorator) {
                                innerItem.disabled = true
                                const match = innerItem.decorator.match(/[a-zA-Z]+/)
                                innerItem.decorator = (match[0] ? match[0] : '') + innerKey + innerIndex
                            }
                        })
                        return item
                    })

                    console.log('相同结构 inputdataOptions', inputdataOptions)
                    // 设置timeBand
                    timeBand = Object.assign({}, clone.timeBand ? clone.timeBand : {}, {
                        decorator: 'timeBand' + key + i
                    })
                }
                rateDom.push({
                    beginDate: {
                        type: 'date',
                        message: 'beginDate field should be no-null',
                        initialValue: elem.start_month,
                        required: true,
                        disabled: true,
                        name: 'beginDate',
                        decorator: `beginDate` + i + 1
                    },
                    endDate: {
                        type: 'date',
                        message: 'endDate field should be no-null',
                        initialValue: elem.endDate,
                        required: true,
                        disabled: true,
                        name: 'endDate',
                        decorator: `endDate` + i + 1
                    },
                    timeBand: timeBand,
                    inputcolumns: inputcolumns,
                    inputdata: {
                        type: 'tableCloums',
                        options: inputdataOptions
                    }
                })
            }
        }
        console.log('rateDom', rateDom);
        if (this.fixedCharge !== 'Yes') {
            this.rateData = rateDom
            this.$refs.ratingData && this.$refs.ratingData.form.resetFields()
        } else {
            this.ratingData = rateDom
            this.$refs.ratingZoneForm && this.$refs.ratingZoneForm.zoneForm.resetFields()
        }

        this.spinning = !this.spinning
        setTimeout(() => {
            // 保持一致
            this.sameTariChange(this.sameTariValue)
            // 计算 所有zone destinations 和单位 禁止项
            if (this.fixedCharge !== 'Yes') {
                for (let zoneIndex = 0; zoneIndex < this.rateData.length; zoneIndex++) {
                    this.calDesOptions(zoneIndex, true)
                }
            }
        }, 200)
    }

    public onInput(value: string, name: string, item: object) {
        this.procussSame(value, name, item)
    }

    public onZoneInput(value: string, name: string, item: object, index: number) {
        this.procussSame(value, name, item, index)
    }

    public onPicker(value: any, name: string) {
        this.procussSame(value, name)
    }

    public onZonePicker(value: any, name: string, item: object) {
        this.procussSame(value, name, item)
    }

    // 删除行回调
    private ratingDataRowChange(zoneIndex: number, rowIndex: number) {
        if (this.timer) {
            clearTimeout(this.timer)
        }
        this.timer = setTimeout(() => {
            this.calDesOptions(zoneIndex)
        }, 200)
    }

    public onZoneselect(value: any, name: string, item: object, index: number, zoneIndex: number) {
        // zoneIndex：第几个zone    index： zone里面数据第几行
        if (this.timer) {
            clearTimeout(this.timer)
        }
        this.timer = setTimeout(() => {
            this.procussSame(value, name, item, index)
            if (name.indexOf('destination') !== -1) {
                this.calDesOptions(zoneIndex)
            }
        }, 200)
    }

    // 计算 destinationsOptions 和 单位 该禁止项
    private calDesOptions(zoneIndex: number, isCalTimeBand ? : boolean) {
        const ratingDataRef: any = this.$refs.ratingData
        if (!ratingDataRef) {
            return
        }
        const formData: any = ratingDataRef.form.getFieldsValue()
        const inputdataOptions: any = deepClone(this.rateData[zoneIndex].inputdata.options)
        const destinationsOptions = this.destinationsOptions.map((destinationsOptionsItem: any) => {
            let newObj: any = {
                name: destinationsOptionsItem.name,
                disabled: false
            }
            inputdataOptions.forEach((optionsItem: any, optionsIndex: number) => {
                const item = formData[optionsItem.name[1].decorator] || []
                if (item.includes(destinationsOptionsItem.name)) {
                    newObj.disabled = true
                }
            })
            return newObj
        })
        const timeBandDetailList: any[] = this.rateData[zoneIndex].timeBand.timeBandDetailList || []
        inputdataOptions.forEach((optionsItem: any, optionsIndex: number) => {
            optionsItem.name[1].options = destinationsOptions
            if (isCalTimeBand) {
                optionsItem.name[optionsItem.name.length - 1].options = optionsItem.name[optionsItem.name.length - 1].options.map((item: any) => {
                    const name = typeof item === 'object' && item !== null ? item.name : item
                    return {
                        name,
                        disabled: !!((name === "Call" || name === "User") && timeBandDetailList && timeBandDetailList.length)
                    }
                }) || []
            }
            // this.$set(optionsItem.name[1], 'options', destinationsOptions)
        })
        this.$set(this.rateData[zoneIndex].inputdata, 'options', inputdataOptions)
    }
    /* 处理 费率一致 */
    public procussSame(value: any, name: string, item ? : any, dataNumber ? : number) {
        console.log('rateData', this.rateData)
        console.log('name', name)
        let rateData = this.fixedCharge === 'Yes' && this.ratingData || this.rateData
        rateData.forEach((elem: any, i: number) => {
            //   console.log('elem', elem);
            elem.beginDate.disabled = true
            elem.endDate.disabled = true
            if (this.fixedCharge === 'Yes' && this.sameTariValue === 'Yes') {
                if (i !== 0 && name.indexOf('ChargeItem') > -1 && elem.ChargeItem.name.indexOf('ChargeItem') > -1) {
                    this.ratingform.setFieldsValue({
                        [elem.ChargeItem.name]: value
                    })
                }
                if (i !== 0 && name.indexOf('Amount') > -1 && elem.Amount.name.indexOf('Amount') > -1) {
                    this.ratingform.setFieldsValue({
                        [elem.Amount.name]: value
                    })
                }
                if (value && name.indexOf('beginDate') > -1 && elem.beginDate.name.indexOf('beginDate') > -1) {
                    this.ratingform.setFieldsValue({
                        [elem.beginDate.name]: moment(value['_d'], 'YYYY/MM/DD')
                    })
                }
                if (value && name.indexOf('endDate') > -1 && elem.endDate.name.indexOf('endDate') > -1) {
                    this.ratingform.setFieldsValue({
                        [elem.endDate.name]: moment(value['_d'], 'YYYY/MM/DD')
                    })
                }
            }

            if (this.fixedCharge === 'No' && this.sameTariValue === 'Yes') {
                elem.beginDate.disabled = true
                elem.endDate.disabled = true
                if (value && elem.beginDate.decorator.indexOf('beginDate') > -1 && name.indexOf('beginDate') > -1) {
                    this.ratingZoneform.setFieldsValue({
                        [elem.beginDate.decorator]: moment(value['_d'], 'YYYY/MM/DD')
                    })
                }
                if (value && elem.endDate.decorator.indexOf('endDate') > -1 && name.indexOf('endDate') > -1) {
                    this.ratingZoneform.setFieldsValue({
                        [elem.endDate.decorator]: moment(value['_d'], 'YYYY/MM/DD')
                    })
                }
                // dataNumber 数据第几行
                elem.inputdata.options.forEach((optionsItem: any, optionsIndex: number) => {
                    optionsItem.name && optionsItem.name.forEach((ops: any) => {
                        if (Object.keys(ops).length > 1 && !!ops.decorator) {
                            ops.disabled = i !== 0 || false
                            if (dataNumber === optionsIndex) {
                                if (i !== 0 && value && ops.decorator.indexOf('Rate') > -1 && name.indexOf('Rate') > -1 && ops.timeBandDetailIndex == item.timeBandDetailIndex) {
                                    console.log('ops', ops);
                                    this.ratingZoneform.setFieldsValue({
                                        [ops.decorator]: value
                                    })
                                }
                                if (i !== 0 && !!value && name.indexOf('ChargableunitType') > -1 && ops.decorator.indexOf('ChargableunitType') > -1) {
                                    this.ratingZoneform.setFieldsValue({
                                        [ops.decorator]: value
                                    })
                                }
                                if (i !== 0 && !!value && name.indexOf('destination') > -1 && ops.decorator.indexOf('destination') > -1) {
                                    // ops.initialValue = value
                                    this.$set(ops, 'initialValue', value)
                                    this.ratingZoneform.setFieldsValue({
                                        [ops.decorator]: value
                                    })
                                }
                            }
                        }
                    })
                })

                // elem.inputdata.options[dataNumber]['name'].forEach((ops: any) => {
                //
                // });
            }
        })
    }

    /* 所有费率保持一致 */
    public sameTariChange(value: string) {
        let rateData = this.fixedCharge === 'Yes' && this.ratingData || this.rateData
        if (this.fixedCharge === 'No' && this.$refs.ratingData) {
            this.$nextTick(() => {
                this.$refs.ratingData.sameTariValueChange(value)
            })
        }
        let val:any = {}
        let formData: any = {}
        if (this.fixedCharge === 'Yes') {
            formData = this.$refs.ratingZoneForm ? this.$refs.ratingZoneForm.zoneForm.getFieldsValue() : {}
        } else {
            formData = this.$refs.ratingData ? this.$refs.ratingData.form.getFieldsValue() : {}
        }
        // console.log('数据formData', formData)
        const key = '' + new Date().getTime()
        let count: number = 0
        let setData: any = {}
        rateData.forEach((elem: any, i: number) => {
            if (i === 0) {
                val = elem
            }
            if (this.fixedCharge === 'Yes') {
                if (value === 'No') {
                    this.$refs.ratingZoneForm && this.$refs.ratingZoneForm.zoneForm.setFieldsValue({
                        [elem.Amount.name]: undefined,
                        [elem.ChargeItem.name]: undefined
                    })
                }
                if (value === 'Yes' && i !== 0) {
                    this.$refs.ratingZoneForm && this.$refs.ratingZoneForm.zoneForm.setFieldsValue({
                        [elem.Amount.name]: this.$refs.ratingZoneForm.zoneForm.getFieldValue(val.Amount.name),
                        [elem.ChargeItem.name]: this.$refs.ratingZoneForm.zoneForm.getFieldValue(val.ChargeItem.name)
                    })
                }
                elem.Amount.disabled = i !== 0 && value === 'Yes'
                elem.ChargeItem.disabled = i !== 0 && value === 'Yes'
            }
            if (this.fixedCharge === 'No') {
                elem.beginDate.disabled = true
                elem.endDate.disabled = true
                count++
                if (i) {
                    if (value === 'Yes') {
                        let firstInputOptions = deepClone(rateData[0].inputdata.options)
                        firstInputOptions.forEach((item: any, index: number) => {
                            count++
                            item.key = key + i + index + count
                            item.name.forEach((innerItem: any) => {
                                count++
                                innerItem.disabled = value === 'Yes'
                                if (innerItem.decorator) {
                                    const temp: string = innerItem.decorator
                                    const match = innerItem.decorator.match(/[a-zA-Z]+/)
                                    innerItem.decorator = (match[0] ? match[0] : '') + key + i + index + count
                                    setData[innerItem.decorator] = formData[temp]
                                }
                            })
                        })
                        this.$set(elem.inputdata, 'options', firstInputOptions)
                        const firstRate = deepClone(rateData[0])
                        let timeBand: any = firstRate.timeBand
                        const temp: string = timeBand.decorator
                        timeBand.decorator = 'timeBand' + key + i
                        setData[timeBand.decorator] = formData[temp]
                        this.$set(elem, 'timeBand', timeBand)
                        this.$set(elem, 'inputcolumns', firstRate.inputcolumns)
                    } else {
                        elem.inputdata.options.forEach((optionsItem: any) => {
                            optionsItem.name.forEach((item: any) => {
                                if (item.decorator) {
                                    item.disabled = false
                                }
                            })
                        })
                    }
                }
            }
        })
        this.$nextTick(() => {
            this.$refs.ratingData && Object.keys(setData).length && (this.$refs.ratingData as any).form.setFieldsValue(setData)
        })
        rateData.length && this.fixedCharge === 'Yes' && value === 'Yes' && (rateData[0].beginDate.disabled = true, rateData[0].endDate.disabled = true)
        return this.sameTariValue = value
    }

    /* select */
    public handleChange(value: string, name ? : string) {
        this.fixedCharge = value;
        if (!!value) {
            this.selectDom(Number(this.form.getFieldValue('Counts')))
            this.sameTariChange(this.form.getFieldValue('sameTariff'))
        }
    }

    public recurringChange(value: any) {
        this.recurringValue = value;
        if (!this.form.getFieldValue('Counts')) {
            this.rateData = []
            this.ratingData = []
            // this.$message.error('输入Counts')
            return
        }
        setTimeout(() => {
            this.selectDom(this.form.getFieldValue('Counts'))
        }, 100);
    }

    public ratingForm(form: any) {
        return this.ratingform = form
    }

    public ratingZoneForm(form: any) {
        return this.ratingZoneform = form
    }

    public commitment(value: number | string) {
        let name: any
        if (value === 0) {
            name = 'No'
        } else if (value === 1) {
            name = 'Yes'
        }
        return name
    }

    public reCommitment(value: number | string) {
        let name: any
        if (value === 'No' || value === 2) {
            name = 0
        } else if (value === 'Yes' || value === 1) {
            name = 1
        } else {
            name = value
        }
        return name
    }

    public getTabs() {
        let ratePlanArr: any[] = []
        for (let i = 0; i < this.ratePlanObject.length; i++) {
            const element = this.ratePlanObject[i];
            for (let index = 0; index < element.tabs.length; index++) {
                ratePlanArr.push(element.tabs[index])
            }
        }
        return ratePlanArr
    }

    public async assignmentData(value: any) {
        console.log('value', value);
        if (!value) {
            return
        }
        // const dateUnit: string[] = ['Year', 'Month', 'Week', 'Day']
        const dateUnit: string[] = ['Day', 'Week', 'Month', 'Year']
        this.fixedCharge = this.commitment(value.isFixedCharge)
        console.log('this.fixedCharge', this.fixedCharge);

        this.sameTariValue = this.commitment(value.isSameTariff)
        this.recurringValue = value.recurringDimension && dateUnit[value.recurringDimension - 1] || ''
        console.log('this.sameTariValue', this.sameTariValue);
        console.log('this.recurringValue', this.recurringValue);
        console.log('Counts', value.dimensionCount);

        this.$nextTick(() => {
            this.form.setFieldsValue({
                'Counts': value.dimensionCount ? value.dimensionCount : undefined,
                'fixedCharge': this.fixedCharge,
                'recurringDimension': this.recurringValue,
                'sameTariff': this.sameTariValue
            })
        })
        // return
        console.log('this.fixedCharge', this.fixedCharge)
        console.log('sameTariValue', this.sameTariValue)
        this.ratingZoneList = value.ratingZoneList ? value.ratingZoneList : []
        await this.selectDom(value.dimensionCount ? value.dimensionCount : undefined)

        let data: any[] = []
        if (this.fixedCharge !== 'Yes') {
            data = this.rateData
        } else {
            data = this.ratingData
        }
        // console.log('rateData', this.rateData)
        let newData = data.slice(value.ratingZoneList.length)
        console.log('newData--', newData);
        console.log('data--', data)
        // console.log('ratingZoneList--', value.ratingZoneList)
        console.log('value', value)
        // 如果生成的大于复制，则多出几个Zone，这个时候要注意是不是Same Tariff，如果Same Tariff为Yes，则多出的几个Zone和以前的Zone保持费率一致
        if (data.length > value.ratingZoneList.length && this.sameTariValue === 'Yes') {
            data.forEach((res, index: number) => {
                if (this.fixedCharge === 'Yes') {
                    this.$refs.ratingZoneForm.zoneForm.setFieldsValue({
                        [res.Amount.name]: value.ratingZoneList[0].amount,
                        [res.ChargeItem.name]: value.ratingZoneList[0].chargeItem
                    })
                } else {
                    // this.setRatingData(value, res)
                    // this.$refs.ratingData.form.setFieldsValue({
                    //   [res.timeBand.decorator]: value.ratingZoneList[0].timeBand,
                    //   [res.inputdata.options[0]['name'][1].decorator]: value.ratingZoneList[0].tableDat.destination,
                    //   [res.inputdata.options[0]['name'][2].decorator]: value.ratingZoneList[0].tableDat.rate,
                    //   [res.inputdata.options[0]['name'][3].decorator]: value.ratingZoneList[0].tableDat.ChargableunitType
                    // })
                    // this.$set(res.inputdata.options[0]['name'][1], 'initialValue', value.ratingZoneList[0].tableDat.destination)
                }
            })
        }
        if (data.length > value.ratingZoneList.length && this.sameTariValue === 'No') {
            data.forEach((res, index: number) => {
                if (this.fixedCharge === 'Yes') {
                    if (value.ratingZoneList[index]) {
                        console.log(res.Amount.name);
                        console.log(res.ChargeItem.name);
                        setTimeout(() => {

                            this.$refs.ratingZoneForm.zoneForm.setFieldsValue({
                                [res.Amount.name]: value.ratingZoneList[index].amount,
                                [res.ChargeItem.name]: value.ratingZoneList[index].chargeItem
                            })
                        }, 300);
                    } else {
                        newData.forEach((res) => {
                            this.$refs.ratingZoneForm.zoneForm.setFieldsValue({
                                [res.Amount.name]: undefined,
                                [res.ChargeItem.name]: undefined
                            })
                        })
                    }
                } else {
                    // if (value.ratingZoneList[index]) {
                    //   this.$refs.ratingData.form.setFieldsValue({
                    //     [res.timeBand.decorator]: value.ratingZoneList[index].timeBand,
                    //     [res.inputdata.options[0]['name'][1].decorator]: value.ratingZoneList[index].tableDat.destination,
                    //     [res.inputdata.options[0]['name'][2].decorator]: value.ratingZoneList[index].tableDat.rate,
                    //     [res.inputdata.options[0]['name'][3].decorator]: value.ratingZoneList[index].tableDat.ChargableunitType
                    //   })
                    //   this.$set(res.inputdata.options[0]['name'][1], 'initialValue', value.ratingZoneList[index].tableDat.destination)
                    //
                    // } else {
                    //   newData.forEach((res) => {
                    //     this.$refs.ratingData.form.setFieldsValue({
                    //       [res.timeBand.decorator]: undefined,
                    //       [res.inputdata.options[0]['name'][1].decorator]: undefined,
                    //       [res.inputdata.options[0]['name'][2].decorator]: undefined,
                    //       [res.inputdata.options[0]['name'][3].decorator]: undefined
                    //     })
                    //     this.$set(res.inputdata.options[0]['name'][1], 'initialValue', undefined)
                    //   })
                    // }
                }
            })
        }
        // 如果生成的小于复制，则删除几个Zone
        if (data.length < value.ratingZoneList.length && this.sameTariValue === 'Yes') {
            let newData = value.ratingZoneList.slice(0, data.length)
            data.forEach((res, index) => {
                if (this.fixedCharge === 'Yes') {
                    setTimeout(() => {

                        this.$refs.ratingZoneForm.zoneForm.setFieldsValue({
                            [res.Amount.name]: newData[0].amount,
                            [res.ChargeItem.name]: newData[0].chargeItem
                        })
                    }, 300);
                } else {
                    // this.setRatingData(value,res)
                    // this.$refs.ratingData.form.setFieldsValue({
                    //   [res.timeBand.decorator]: value.ratingZoneList[0].timeBand,
                    //   [res.inputdata.options[0]['name'][1].decorator]: newData[0].tableDat.destination,
                    //   [res.inputdata.options[0]['name'][2].decorator]: newData[0].tableDat.rate,
                    //   [res.inputdata.options[0]['name'][3].decorator]: newData[0].tableDat.ChargableunitType
                    // })
                    // this.$set(res.inputdata.options[0]['name'][1], 'initialValue', newData[0].tableDat.destination)
                }
            })
        }
        if (data.length < value.ratingZoneList.length && this.sameTariValue === 'No') {
            let newData = value.ratingZoneList.slice(0, data.length)
            data.forEach((res, index) => {
                if (this.fixedCharge === 'Yes') {
                    setTimeout(() => {

                        this.$refs.ratingZoneForm.zoneForm.setFieldsValue({
                            [res.Amount.name]: newData[index].amount,
                            [res.ChargeItem.name]: newData[index].chargeItem
                        })
                    }, 300);
                } else {
                    // this.setRatingData(value,res)
                    // this.$refs.ratingData.form.setFieldsValue({
                    //   [res.timeBand.decorator]: value.ratingZoneList[index].timeBand,
                    //   [res.inputdata.options[0]['name'][1].decorator]: newData[index].tableDat.destination,
                    //   [res.inputdata.options[0]['name'][2].decorator]: newData[index].tableDat.rate,
                    //   [res.inputdata.options[0]['name'][3].decorator]: newData[index].tableDat.ChargableunitType
                    // })
                    // this.$set(res.inputdata.options[0]['name'][1], 'initialValue', newData[index].tableDat.destination)
                }
            })
        }
        /* 如果生成跟复制一样直接赋值 */
        // console.log('ratingZoneList', value.ratingZoneList);
        if (data.length === value.ratingZoneList.length) {
            console.log('以有数据和传入数据相同')
            data.forEach((res, index: number) => {
                if (this.fixedCharge === 'Yes') {
                    if (value.ratingZoneList[index]) {
                        if (this.sameTariValue === 'Yes') {
                            setTimeout(() => {
                                this.$refs.ratingZoneForm.zoneForm.setFieldsValue({
                                    [res.Amount.name]: value.ratingZoneList[0].amount,
                                    [res.ChargeItem.name]: value.ratingZoneList[0].chargeItem
                                })
                            }, 300);
                        } else {
                            setTimeout(() => {
                                this.$refs.ratingZoneForm.zoneForm.setFieldsValue({
                                    [res.Amount.name]: value.ratingZoneList[index].amount,
                                    [res.ChargeItem.name]: value.ratingZoneList[index].chargeItem
                                })
                            }, 300);
                        }
                    }
                } else {
                    // if (value.ratingZoneList[index]) {
                    //   if (this.sameTariValue === 'Yes') {
                    //     this.$refs.ratingData.form.setFieldsValue({
                    //       [res.timeBand.decorator]: value.ratingZoneList[0].timeBand,
                    //       [res.inputdata.options[0]['name'][1].decorator]: value.ratingZoneList[0].tableDat.destination,
                    //       [res.inputdata.options[0]['name'][2].decorator]: value.ratingZoneList[0].tableDat.rate,
                    //       [res.inputdata.options[0]['name'][3].decorator]: value.ratingZoneList[0].tableDat.ChargableunitType
                    //     })
                    //     this.$set(res.inputdata.options[0]['name'][1], 'initialValue', value.ratingZoneList[0].tableDat.destination)
                    //   } else {
                    //     this.$refs.ratingData.form.setFieldsValue({
                    //       [res.timeBand.decorator]: value.ratingZoneList[index].timeBand,
                    //       [res.inputdata.options[0]['name'][1].decorator]: value.ratingZoneList[index].tableDat.destination,
                    //       [res.inputdata.options[0]['name'][2].decorator]: value.ratingZoneList[index].tableDat.rate,
                    //       [res.inputdata.options[0]['name'][3].decorator]: value.ratingZoneList[index].tableDat.ChargableunitType
                    //     })
                    //     this.$set(res.inputdata.options[0]['name'][1], 'initialValue', value.ratingZoneList[index].tableDat.destination)
                    //   }
                    // }
                }
            })
        }
        // console.log(value.recurringCode.length, this.ratingData.length);
        // console.log(value['item']);
        // this.spinning = !this.spinning
        console.log(data)
    }

    public getDstination(arr: any[]) {
        if (arr[this.productIndex] || arr[0]) {
            let data:getAixosConfig = {
                params: {
                    productName: arr[this.productIndex]['typeName'].replace(/[\r\n\s]+/g, ""),
                    // direction: arr[this.productIndex]['direction'] || 1
                    beginDate: moment(arr[this.productIndex]['commitmentBeginDate']).format('YYYY-MM-DD'),
                    endDate: moment(arr[this.productIndex]['commitmentEndDate']).format('YYYY-MM-DD')
                }
            }
             getDstinationList(data).then((res: Destinations) => {
                let data: Destinations['data'] = res.data || []
                this.destinationsOptions = data.map((item: Destinations['destinationValue']) => {
                    return {
                        name: item,
                        disabled: false
                    }
                })
            })
        }
    }

    public setRatingData(value: any, res: any) {
        // 未用 
        // value 数据
        let setData: any = {}
        let data: any = []
        value.ratingZoneList.forEach((outerItem: any, outerIndex: number) => {
            if (!data[outerIndex]) {
                data[outerIndex] = []
                this.$set(data, outerIndex, [])
            }
            let index: number = 0
            outerItem.ratingDetailList.forEach((dataItem: any, dataIndex: number) => {
                if (!data[outerIndex][index]) {
                    // data[outerIndex][index] = []
                    this.$set(data[outerIndex], index, [])
                }
                if (dataItem.timeBandDetailIndex == 0 && dataIndex !== 0) {
                    index++
                }
                console.log(dataItem)
                data[outerIndex][index].push(dataItem)
                // data[outerIndex][index][dataIndex]=dataItem

                console.log(data)
            })
        })

        // 处理的数据
        console.log('处理的数据', data)
        setData[res.timeBand.decorator] = 'xxxx'
        res.inputdata.options.forEach((inputOptions: any, inputIndex: number) => {
            inputOptions.name.forEach((nameOptions: any, nameIndex: number) => {
                if (nameOptions.decorator) {
                    if (inputOptions.decorator.indexOf('destination') > -1) {
                        setData[inputOptions.decorator] = data[inputIndex].destinationList
                    } else if (inputOptions.decorator.indexOf('Rate') > -1) {
                        // timeBandDetailIndex
                        setData[inputOptions.decorator] = data[inputIndex].rate
                    } else if (inputOptions.decorator.indexOf('ChargableunitType') > -1) {
                        setData[inputOptions.decorator] = data[inputIndex].chargeUnit
                    }
                }
            })
        })
        console.log('数据' + setData)
        // this.$refs.ratingData.form.setFieldsValue(setData)
    }

    public deactivated() {
        if(this.closeModel == 'contract') return
        this.fieldProcessing()
    }
    public fieldProcessing() {
        let data: any = []
        let productObj: any = {}
        let ratePlanArr: any = []
        if (this.contractIndex === 1) {
            ratePlanArr = this.getTabs()
        } else {
            ratePlanArr = this.editArr
        }
        console.log('typeName', ratePlanArr[this.proIndex]['typeName'])
        if (!this.prossData[ratePlanArr[this.proIndex]['typeName'] + ratePlanArr[this.proIndex].productKey]) {
            productObj = {
                productData: {}
            }
        } else {
            productObj = deepClone(this.prossData[ratePlanArr[this.proIndex]['typeName'] + ratePlanArr[this.proIndex].productKey])
        }

        // 增加
        productObj.productData.productName = ratePlanArr[this.proIndex].typeName
        productObj.productData.direction = ratePlanArr[this.proIndex].direction
        const Ratestructre: string[] = ['Flat', 'Tier', 'Interval', 'RecurringCharge', 'OneTimeCharge', 'Penalty', 'Cap', 'DisCount'];
        productObj.productData.rateStructure = Ratestructre.indexOf(ratePlanArr[this.proIndex].RateStructure) + 1 || undefined

        // 基础数据
        // productObj.baseData = this.form.getFieldsValue()
        const baseData = this.form.getFieldsValue()
        const dateUnit: string[] = ['Day', 'Week', 'Month', 'Year']
        productObj.productData.recurringDimension = dateUnit.indexOf(baseData['recurringDimension']) + 1 || undefined
        productObj.productData.dimensionCount = +baseData['Counts'] || undefined
        productObj.productData.isFixedCharge = this.reCommitment(baseData['fixedCharge'])
        productObj.productData.isSameTariff = this.reCommitment(baseData['sameTariff'])

        // if (this.fixedCharge === 'Yes') {
        if (productObj.productData.isFixedCharge) {
            // zone
            const zoneFormData = (this.$refs.ratingZoneForm as any).zoneForm.getFieldsValue()
            this.ratingData.forEach((element: any, index: number) => {
                data.push({
                    amount: !Number.isNaN(+zoneFormData[element.Amount.name]) ? +zoneFormData[element.Amount.name] : undefined,
                    chargeItem: zoneFormData[element.ChargeItem.name],
                    beginDate: zoneFormData[element.beginDate.name].format('YYYY-MM-DD'),
                    endDate: zoneFormData[element.endDate.name].format('YYYY-MM-DD'),
                    zoneNumber: index + 1
                })
            });
            productObj.productData.ratingZoneList = data
        } else {
            const ratingData = (this.$refs.ratingData as any).form.getFieldsValue()
            const unit: any[] = [{
                name: 'Secs',
                value: 1,
            }, {
                name: 'Mins',
                value: 2,
            }, {
                name: 'Quarters',
                value: 3,
            }, {
                name: 'Call',
                value: 4,
            }, {
                name: 'User',
                value: 5,
            }]
            let ratingZoneList: any = []
            this.rateData && this.rateData.forEach((item: any, index: number) => {
                let obj: any = {
                    beginDate: ratingData[item.beginDate.decorator] ? ratingData[item.beginDate.decorator].format('YYYY-MM-DD') : undefined,
                    endDate: ratingData[item.endDate.decorator] ? ratingData[item.endDate.decorator].format('YYYY-MM-DD') : undefined,
                    ratingDetailList: [],
                    timeBandDetailList: item.timeBand && item.timeBand.timeBandDetailList ? item.timeBand.timeBandDetailList.map((timeBandDetailItem: any) => {
                        let type = timeBandDetailItem.type
                        if (timeBandDetailItem.type.indexOf('Offpeak') > -1) {
                            type = 2
                        } else if (timeBandDetailItem.type.indexOf('peak') > -1) {
                            type = 1
                        }
                        return Object.assign({}, timeBandDetailItem, {
                            type
                        })
                    }) : undefined,
                    zoneNumber: index + 1
                }
                item.inputdata.options.forEach((optionsItem: any, optionsIndex: number) => {
                    // 判断是否 isSameTariff 是则使用第一个
                    const chargeUnit = unit.find((item: any) => item.name == ratingData[optionsItem.name[optionsItem.name.length - 1].decorator])
                    const chargeUnitValue = chargeUnit ? chargeUnit.value : ratingData[optionsItem.name[optionsItem.name.length - 1].decorator]
                    const destinationValue = ratingData[optionsItem.name[1].decorator] ? ratingData[optionsItem.name[1].decorator].join(',') : undefined
                    // console.log(chargeUnitValue)
                    // console.log(destinationValue)
                    optionsItem.name.forEach((innerItem: any, index: number) => {
                        // 去除第一个和最后一个 得到只包含rate的
                        if (innerItem.decorator && optionsItem.name.length - 1 !== index && 0 !== index && 1 !== index) {
                            obj.ratingDetailList.push({
                                destinationList: destinationValue,
                                rate: !Number.isNaN(+ratingData[innerItem.decorator]) ? +ratingData[innerItem.decorator] : undefined,
                                chargeUnit: chargeUnitValue,
                                timeBandDetailIndex: +innerItem.timeBandDetailIndex > -1 ? innerItem.timeBandDetailIndex : 0,
                                id: innerItem.id > -1 ? innerItem.id : undefined
                            })
                        }
                    })
                })
                ratingZoneList.push(obj)
            })
            productObj.productData.ratingZoneList = ratingZoneList
            // productObj.item = this.getTabs()[this.proIndex]
        }
        // this.prossData[ratePlanArr[this.proIndex]['typeName'] + ratePlanArr[this.proIndex].productKey] = deepClone(productObj)
        let planArr = ratePlanArr[this.proIndex]
        this.prossData[planArr['typeName'] + planArr.productKey] = deepClone(productObj)
        if (this.contractIndex === 2) {
            planArr.productData = productObj.productData
        }
        console.log('planArr', planArr);
        this.mutionProduct(ratePlanArr)
        // console.log('data', data)
        // console.log('prossData', this.prossData, this.proIndex);

        console.log('保存数据productObj', productObj)
        console.log('当前结构this.rateData', this.rateData);
    }
    public created() {
        Vue.prototype.checkRecuuing = (item: any) => {
            return this.checkRecuuing(item)
        }

        Vue.prototype.getRecurringCharge = () => {
            console.log('recurringCharge')
            this.fieldProcessing()
        }
        this.proIndex = this.productIndex
        // const ratePlanArr = this.getTabs()
        // this.getDstination(ratePlanArr)
        // let ratePlan: any = ratePlanArr[this.proIndex]
        // console.log('ratePlan', ratePlan);

        // if (!this.prossData[ratePlan.typeName + ratePlan.productKey]) {
        //     setTimeout(() => {
        //         this.assignmentData(ratePlan.productData)
        //     }, 500)
        // }
    }
    public activated() {
        // this.proIndex = this.productIndex
        setTimeout(() => {
            let ratePlanArr: any = []
            if (this.contractIndex === 1) {
                ratePlanArr = this.getTabs()
            } else {
                ratePlanArr = this.editArr
            }
            this.getDstination(ratePlanArr)
            let ratePlan: any = ratePlanArr[this.proIndex]
            if (!this.prossData[ratePlan.typeName + ratePlan.productKey]) {
                setTimeout(() => {
                    this.assignmentData(ratePlan.productData)
                }, 500)
            }
        }, 200);
    }
}
</script>

<style>
.subCol>ul>li {
    margin: 0 -18px;
    list-style: none;
    text-Align: center;
    /* padding: 9px; */
    border-bottom: 1px solid #e6e6e6;
    /* overflow: hidden; */
    height: 50px;
    line-height: 50px;
}

.subCol>ul>li:last-child {
    border-bottom: none;
}
</style><style lang="scss" scoped>
.example {
    text-align: center;
    // background: rgba(0,0,0,0.05);
    border-radius: 4px;
    margin-bottom: 20px;
    padding: 30px 50px;
    margin: 20px 0;
}

.Ratingzone {
    h1 {
        padding: 10px;
        border-bottom: 1px solid rgb(231, 231, 231);
    }
}

.Ratingzone-code {
    border: 1px solid rgb(212, 212, 212);
    padding: 0;
    margin: 10px 0px;
    background-color: rgb(251, 251, 251);
}

.Zone-code {

    border: 1px solid rgb(238, 238, 238);
    margin: 5px;

    .title {
        padding: 10px;
        font-weight: 600;
        color: #000;
        background-color: #e9eaf3;
        display: block;
        padding-left: 20px;
    }
}

.gridtable {
    font-family: 'Chinese Quote', -apple-system, BlinkMacSystemFont, 'Segoe UI',
        'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue',
        Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',
        'Segoe UI Symbol';
    font-size: 14px;
    font-variant: tabular-nums;
    line-height: 1.5;
    color: rgba(0, 0, 0, 0.65);
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    list-style: none;
    position: relative;
    width: 100%;
    margin: 5px;
    text-align: center;
}

table.border tr th,
table.border tr td {
    border: 1px solid rgb(203, 203, 207);
}

table.gridtable th {
    background: #fafafa;
    transition: background 0.3s ease;
    color: rgba(0, 0, 0, 0.85);
    font-weight: 500;
    border-bottom: 1px solid #e8e8e8;
    padding: 8px;
    background: rgb(233, 234, 243);
}

table.gridtable td {
    padding: 2px 5px;
    background-color: #ffffff;

    .ant-form-item {
        margin: 0;
    }
}
</style>
