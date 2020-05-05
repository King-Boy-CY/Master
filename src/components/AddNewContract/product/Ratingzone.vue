<template>
<div class="Ratingzone">
    <h1>Rating zone</h1>
    <div v-for="(i,k) in ratingData" :key="i.key" class="ratingzoneAdd-code">
        <div class="Ratingzone-code">
            <div class="Zone-code">
                <a-row>
                    <a-col :span="24">
                        <span class="title">Zone&nbsp;{{k+1}}</span>
                    </a-col>
                </a-row>
            </div>
            <a-form :form="form">
                <a-row>
                    <a-col :span="12">
                        <a-form-item label="Begin date" :colon="false" :hasFeedback="false" :label-col="{ span: 6, offset: 2   }" :wrapper-col="{ span: 15 }">
                            <a-date-picker @change="onPicker($event,i.beginDate.decorator)" placeholder="YYYY-MM-DD" :disabled="i.beginDate.disabled" type="text" v-decorator="[
                                `${i.beginDate.decorator}`,
                                {
                                rules: [{
                                    required:i.endDate.require,
                                    message: i.beginDate.message
                                }],
                                initialValue: i.beginDate.initialValue && moment(i.beginDate.initialValue, 'YYYY-MM-DD') || ''
                                }
                            ]" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label="End date" :colon="false" :hasFeedback="false" :label-col="{ span: 6, offset: 1 }" :wrapper-col="{ span: 15 }">
                            <a-date-picker @change="onPicker($event,i.endDate.decorator)" placeholder="YYYY-MM-DD" :disabled="i.endDate.disabled" type="text" v-decorator="[
                                `${i.endDate.decorator}`,
                                {
                                rules: [{
                                    required:i.endDate.require,
                                    message: i.endDate.message
                                }],
                                initialValue:  i.endDate.initialValue && moment(i.endDate.initialValue, 'YYYY-MM-DD') || ''
                                }
                            ]" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="22">
                        <a-form-item :label="i.timeBand.name" :colon="false" :hasFeedback="false" :label-col="{ span: 3, offset: 1 }" :wrapper-col="{ span: 19 }">
                            <a-textarea disabled autosize class="Timeband" v-decorator="[
                                `${i.timeBand.decorator}`,
                                {
                                rules: [{
                                    required:i.timeBand.require,
                                    message: i.timeBand.message
                                }],
                                initialValue: i.timeBand.initialValue
                                }
                            ]" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="2">
                        <span class="Go" @click="goVisibleHide(k,i.timeBand.timeBandDetailList&&i.timeBand.timeBandDetailList.length || sameTariValue === 'Yes'&&k)" :class="i.timeBand.timeBandDetailList&&i.timeBand.timeBandDetailList.length || sameTariValue === 'Yes'&&k ?'disabled':''">Go</span>
                        <span class="clear" @click="clearTimeband(k,!(i.timeBand.timeBandDetailList&&i.timeBand.timeBandDetailList.length) || sameTariValue === 'Yes'&&k)" :class="!(i.timeBand.timeBandDetailList&&i.timeBand.timeBandDetailList.length) || sameTariValue === 'Yes'&&k?'disabled':''">Clear</span>
                    </a-col>
                    <model title="Time band" v-model="goVisible" width="1200px" @Screencover="goVisibleHide">
                        <template slot="model-body">
                            <AdvancedSearch :formoptions="formOptionS" @Submit="SearchOk" />
                            <!-- <Table @onSelectAll="onSelectAll" pagination @onSelect="onSelect" :columns="tableColumn" :data="tableData" zebraStripe :scroll="{ x: 2000, y: 250 }" /> -->
                            <!--max-height:350px;-->
                            <i-table style="overflow:auto" border @on-selection-change="onSelectChange" stripe :columns="tableColumn" :data="tableDatasa"></i-table>
                        </template>
                        <template slot="model-footer">
                            <a-row style="margin-top:20px;">
                                <a-col :span="24" style="text-align:center;">
                                    <a-button type="primary" @click="confirm">Confirm</a-button>
                                    <a-button style="margin-left:30px;" @click="goVisibleHide">Return</a-button>
                                </a-col>
                            </a-row>
                        </template>
                    </model>
                    <a-col :span="24" style="overflow-x: auto;overflow-y:hidden;">
                        <!-- <TableInput @success="success" @successForm="successForm" ref="TableInput" @addChange="addData" @deleteChange="dele" :inputcolumns='inputcolumns' :inputdata='inputdata' border :addData="Newdata" @input="onTableInput" @select="onTableSelect" /> -->
                        <table class="gridtable border">
                            <thead>
                                <tr>
                                    <th v-for="(item,key) in i.inputcolumns.options" :key="key">
                                        <span :style="{color: item.require ? 'red' : ''}" v-show="item.require">*</span>{{item.title}}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(ip,key) in i.inputdata.options" :key="ip.key">

                                    <td v-for="(it,index) in ip.name" :key="index" :style="{ width:it.width }">
                                        <a-form-item>
                                            <span v-if=" index <= 0 ">{{ key + 1}}</span>
                                        </a-form-item>
                                        <a-form-item>
                                            <a-input @change="onInput($event,it.decorator,it,key)" placeholder="" :disabled="it.disabled" v-if="it.type === 'input' " v-decorator="[
                                    `${it.decorator}`,
                                    {
                                      rules: [{
                                        required: it.require,
                                        message: `${it.decorator.replace(/\d+/g,'')} field should be no-null`
                                      }],
                                      initialValue: it.model || it.initialValue || ''
                                  }
                                ]" />
                                            <!-- <a-select showArrow @change="onSelect($event,it.decorator,it,key,k)" :disabled="it.disabled" :getPopupContainer="triggerNode => triggerNode.parentNode" placeholder="" v-if="it.type === 'select' " :style="{minWidth:'130px'}" v-decorator="[
                                    `${it.decorator}`,
                                    {
                                      rules: [{
                                        required:  it.require,
                                        message: `${it.decorator.replace(/\d+/g,'')} field should be no-null`
                                      }],
                                      initialValue:it.model ||it.initialValue || ''
                                    }
                                  ]">
                                                <a-select-option :disabled="itn.disabled" v-for="(itn,index) in it.options" :value="itn.name || itn" :key="index">
                                                    {{itn.name || itn}}
                                                </a-select-option>

                                            </a-select> -->
                                            <el-select class="select_code" clearable filterable @change="onSelect($event,it.decorator,it,key,k)" v-if="it.type === 'select' " :style="{width:'100%'}" v-decorator="[
                                    `${it.decorator}`,
                                    {
                                      rules: [{
                                        required:  it.require,
                                        message: `${it.decorator.replace(/\d/g,'')} field should be no-null`
                                      }],
                                      initialValue:it.model ||it.initialValue || undefined
                                    }
                                  ]" :popper-append-to-body="false" placeholder="">
                                                <el-option :disabled="itn.disabled" v-for="(itn,index) in it.options" :value="itn.name|| itn" :key="index">
                                                    {{itn.name || itn}}
                                                </el-option>
                                            </el-select>
                                            <select-input @change="onSelect($event,it.decorator,it,key,k)" :disabled="it.disabled" v-else-if="it.type === 'tabs'" :values.sync="it.initialValue" ref="selectAll" allShow :options="it.options || []" multiple filterable placeholder="" style="width:100%" :getPopupContainer="triggerNode => triggerNode.parentNode" v-decorator="[
                                            `${it.decorator}`,
                                            {
                                            rules: [{
                                                required: it.require,
                                                message: `${it.decorator.replace(/\d+/g,'')} field should be no-null`,
                                            }],
                                            initialValue:it.initialValue
                                            }
                                        ]" />
                                            <!-- message: it.name, -->
                                            <!-- initialValue: it.model || it.initialValue -->
                                        </a-form-item>
                                    </td>
                                    <td class="td-delete" style="border:0;text-align: center;padding:0;">
                                        <span @click="deleteTab(k,key,sameTariValue === 'Yes'&&k)" class="delete" :class="sameTariValue === 'Yes'&&k?'disabled':''">
                                            <a-icon type="minus" />
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </a-col>
                </a-row>
                <!-- <a-row :gutter="24" class="Row" v-if="!timeBand">
                    <a-col :span="24">
                        <span @click="Add(k,i.timeBand.isAdd)" :style="i.timeBand.isAdd && {cursor: 'no-drop',background: '#ccc'}">
                            <a-icon type="plus" />
                        </span>
                    </a-col>
                </a-row> -->
                <a-row :gutter="24" class="Row">
                    <a-col :span="24">
                        <span @click="Add(k,sameTariValue === 'Yes'&&k)" :style="i.timeBand.isAdd && {cursor: 'no-drop',background: '#ccc'}" :class="sameTariValue === 'Yes'&&k?'disabled':''">
                            <a-icon type="plus" />
                        </span>
                    </a-col>
                </a-row>
            </a-form>
        </div>
    </div>
</div>
</template>

<script lang="ts">
import Vue from 'vue'
import {
    Component,
    Prop,
    Emit
} from 'vue-property-decorator'
import {
    AxiosGet
} from '@/api/axios'
import moment from 'moment'
import {
    deepClone
} from "@/assets/ts/index.ts";
import {
    State
} from 'vuex-class'

@Component({
    components: {
        AdvancedSearch: resolve => require(['@/common/Advancedsearch/timeband.vue'], resolve),
        TableInput: resolve => require(['@/common/TableInput/index.vue'], resolve),
        selectInput: resolve => require(['@/common/selectInput/index.vue'], resolve),
        Table: resolve => require(["@/common/Table/index.vue"], resolve),
        model: resolve => require(['@/common/Model/index.vue'], resolve)
    }
})
export default class ratingZone extends Vue {
    @State('ratePlanObject') private ratePlanObject: any
    @State('productIndex') private productIndex ? : any
    @Prop(Array) private ratingData ? : any
    @Prop(Array) private tableColumn ? : any
    @Prop(Array) private destinationsOptions ? : any // destinations选项

    @Emit('input') inputChange(value: string | number, name: string, item: object, index: number) {}

    @Emit('select') selectChange(value: string | number, name: string, item: object, index: number, zoneIndex: number) {}

    @Emit('ratingForm') ratingForm(form: any) {}

    @Emit('picker') pickerChange(value: any, name: string) {}

    // 删除行的回调
    @Emit('rowChange') rowChange(zoneIndex: number, rowIndex: number) {}

    private timer: number = 0
    private Newdata: any[] = [];
    private records: any
    private goCopyIndex: number = 0
    private tableDatasa: any[] = []
    private formOptionS: any[] = [{
            Tips: 'Time band name',
            name: 'Timebandname',
            required: false,
            type: 'select',
            options: null
        },
        {
            Tips: 'Type',
            name: 'Offpeak',
            required: false,
            type: 'select',
            options: null,
            colSpan: 5,
            span: 12
        },
        {
            Tips: 'Days',
            name: '1',
            required: false,
            type: 'select',
            options: null,
            colSpan: 9,
            span: 6,
            wrapSpan: 2
        },
        {
            Tips: 'to',
            name: '11',
            required: false,
            type: 'select',
            options: null,
            colSpan: 3,
            span: 6
        },
        {
            Tips: 'Weekday',
            name: '1',
            required: false,
            type: 'select',
            options: null,
            colSpan: 11,
            span: 6
        },
        // {
        //     Tips: 'Rate plan',
        //     name: 'ratePlan',
        //     required: false,
        //     type: 'select',
        //     options: [{
        //         name: 'Rate plan1'
        //     }, {
        //         name: 'Rate plan2'
        //     }]
        // },
        {
            Tips: 'to',
            name: '5',
            required: false,
            type: 'select',
            options: null,
            colSpan: 5,
            span: 6
        },
        // {
        //     Tips: 'Product',
        //     name: 'Product',
        //     required: false,
        //     type: 'select',
        //     options: [{
        //         name: 'Product1'
        //     }, {
        //         name: 'Product2'
        //     }]
        // },
        {
            Tips: 'Specific time',
            name: 'null',
            required: false,
            type: 'picker',
            colSpan: 9,
            span: 6,
            wrapperCol: 2

        },
        {
            Tips: 'to',
            name: null,
            required: false,
            type: 'picker',
            colSpan: 3,
            span: 6
        },
        // {
        //     Tips: 'Operating state',
        //     name: 'operatingState',
        //     required: false,
        //     type: 'select',
        //     options: [{
        //         name: 'Operating state1'
        //     }, {
        //         name: 'Operating state2'
        //     }]
        // }
    ];

    private tableData: any[] = [{
        serialNumber: 'serialNumber',
        Status: 'Status',
        setupTime: 'setupTime',
        Year: 'Year',
        Month: 'Month',
        Day: 'Day',
        Weekday: 'Weekday',
        From: 'From',
        To: 'To',
        Type: 'Type',
        relevantRateplan: 'relevantRateplan'
    }]
    private selectedRows: any[] = [] // 表格选中
    // private destinationsOptions: any[] = [] //destinations选项
    /* Go */
    private goVisible: boolean = false;
    private sameTariValue: string = ''
    /* From */
    private form: any;

    public beforeCreate() {
        this.form = this.$form.createForm(this);
    }

    public sameTariValueChange(value: string) {
        return this.sameTariValue = value
    }

    public onSelectChange(record: any) {
        this.records = record
    }

    public onSelect(value: string, name: string, item: object, index: number, zoneIndex: number) {
        // index 数据第几行数
        this.selectChange(value, name, item, index, zoneIndex)
    }

    /* 清除timeband */
    public clearTimeband(clearKey: number, isDisabled ? : boolean) {
        if (isDisabled) {
            return
        }
        for (let i = 0; i < this.ratingData.length; i++) {
            if (this.sameTariValue !== 'Yes' && clearKey !== i) {
                continue
            }
            let key = this.ratingData[i]['inputdata']['options'][0]['key']
            this.form.setFieldsValue({
                [this.ratingData[i]['timeBand']['decorator']]: ''
            });
            let inputcolumns = {
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

            let inputdata = {
                type: 'tableCloums',
                options: [{
                    name: [{},
                        {
                            type: 'tabs',
                            require: true,
                            initialValue: [],
                            decorator: `destination${key}`,
                            disabled: false,
                            options: this.destinationsOptions
                        },
                        {
                            type: 'input',
                            require: true,
                            initialValue: '',
                            decorator: `Rate${key}`
                        },
                        {
                            type: 'select',
                            decorator: `ChargableunitType${key}`,
                            initialValue: '',
                            require: true,
                            options: [{
                                    name: 'Secs',
                                    disabled: false
                                },
                                {
                                    name: 'Mins',
                                    disabled: false
                                },
                                {
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
                    key
                }]
            }
            this.ratingData[i]['inputdata'] = inputdata
            this.ratingData[i]['inputcolumns'] = inputcolumns
            this.ratingData[i].timeBand.timeBandDetailList = undefined
        }
    }

    /* Go Visible */
    public goVisibleHide(key: number, isDisabled ? : boolean) {
        if (isDisabled) {
            return
        }
        this.goCopyIndex = key
        this.goVisible = !this.goVisible;
    }

    public onInput(e: any, name: string, item: object, index: number) {
        // console.log(e)
        // index 数据第几行数
        this.inputChange(e.target.value, name, item, index)
    }

    public onPicker(val: any, name: string) {
        this.pickerChange(val, name)
    }

    /* 插入 */
    public confirm() {
        let data: any[] = [],
            columns: any[] = [],
            arr: any[] = [],
            count: number = 0,
            objCount: any = {},
            peakCount: number = 0,
            offPeakCount: number = 0,
            str: string = '',
            options: any[] = []
        const name: any = this.ratingData[0]['inputdata']['options'][0]['name']
        // 设置禁止项
        options = name && name[name.length - 1].options.map((item: any) => {
            if (typeof item === 'object' && item !== null) {
                return {
                    name: item.name,
                    disabled: item.name === "Call" || item.name === "User"
                }
            }
            return {
                name: item,
                disabled: item === "Call" || item === "User"
            }
        }) || []
        if (!this.records.length) return this.$message.error('No data')
        console.log('records', this.records)
        let timeBandDetailList: any[] = []
        // timeBandDetailIndex
        let timeBandDetailIndex: number = 0
        this.records.length && this.records.forEach((element: any, elementIndex: number) => {
            count += 1
            timeBandDetailList = timeBandDetailList.concat(element.detailList || [])
            element.detailList.length && element.detailList.forEach((value: any, key: number) => {
                count += 1
                if (!objCount['Offpeak'] && value.type.indexOf('Off') > -1) {
                    offPeakCount = 1
                    objCount['Offpeak'] = 'Offpeak'
                    value.type = 'Offpeak' + offPeakCount
                } else if (objCount['Offpeak'] && value.type.indexOf(objCount['Offpeak']) > -1 && value.type.indexOf('Off') > -1) {
                    offPeakCount += 1
                    // objCount[item.type] = 'Offpeak'
                    value.type = 'Offpeak' + offPeakCount
                }
                if (!objCount['peak'] && value.type.indexOf('Off') === -1) {
                    peakCount = 1
                    objCount['peak'] = 'peak'
                    value.type = 'peak' + peakCount
                } else if (objCount['peak'] && value.type.indexOf(objCount['peak']) > -1 && value.type.indexOf('Off') === -1) {
                    peakCount += 1
                    // objCount['peak'] = 'peak'
                    value.type = 'peak' + peakCount
                }
                str += `${value.type || '--'}\xa0\xa0\xa0\xa0:\xa0${value.dayFrom || '--'}-${value.dayTo || '--'}\xa0/\xa0${value.weekdayFrom || '--'}-${value.weekdayTo || '--'}\xa0/\xa0${value.timeFrom || '--'}-${value.timeTo || '--'}\n`
                // this.ratingzoneAdd[index]['timeBand']['data'] = value
                // arr.push(value)
                data.push({
                    type: 'input',
                    decorator: 'Rate' + new Date().getTime() + count + 'k',
                    timeBandDetailIndex: timeBandDetailIndex++,
                    key: value.key,
                    require: false,
                    disabled: false,
                    initialValue: ''
                })
                columns.push({
                    title: value.type + '\xa0' + 'Rate',
                    dataIndex: 'Rate',
                    require: true
                })
            });
        });

        // 设置 timeBandDetailList
        if (this.sameTariValue === 'Yes') {
            this.ratingData.forEach((inner: any) => {
                inner.timeBand.timeBandDetailList = timeBandDetailList
            })
        } else {
            this.ratingData[this.goCopyIndex].timeBand['timeBandDetailList'] = timeBandDetailList
        }
        data.unshift({
            type: 'tabs',
            require: true,
            initialValue: [],
            decorator: `destination` + new Date().getTime() + count + 'k',
            disabled: false,
            options: this.destinationsOptions
        })
        data.unshift({})
        data.push({
            type: 'select',
            decorator: 'ChargableunitType' + new Date().getTime() + count,
            options,
            disabled: false,
        })
        columns.unshift({
            title: 'destination',
            dataIndex: 'destination',
            key: 'destination0',
            require: true
        })
        columns.unshift({
            title: 'No .',
            dataIndex: 'No',
            key: 'No'
        })

        columns.push({
            title: 'Chargable unit type',
            dataIndex: 'ChargableunitType',
            require: true
        })
        let itName: any = {
            key: '' + new Date().getTime() + count,
            name: data
        }
        this.goVisible = !this.goVisible;
        arr.forEach((item: any, key) => {
            if (!objCount['Offpeak'] && item.type.indexOf('Off') > -1) {
                peakCount = 1
                objCount['Offpeak'] = 'Offpeak'
                item.type = 'Offpeak' + peakCount
            } else if (objCount['Offpeak'] && item.type.indexOf(objCount['Offpeak']) > -1 && item.type.indexOf('Off') > -1) {
                peakCount += 1
                item.type = 'Offpeak' + peakCount
            }
            if (!objCount['peak'] && item.type.indexOf('Off') === -1) {
                peakCount = 1
                item.type = 'peak' + peakCount
            } else if (objCount['peak'] && item.type.indexOf(objCount['peak']) > -1 && item.type.indexOf('Off') === -1) {
                peakCount += 1
                item.type = 'peak' + peakCount
            }
        });
        /* 费率保持一致 */
        console.log('sameTariValue', this.sameTariValue === 'Yes');

        if (this.sameTariValue === 'Yes') {
            this.ratingData.forEach((elem: any, index: number) => {
                count += 1
                this.ratingData[index]['inputcolumns']['options'] = columns
                // elem['inputdata']['options'][0] = JSON.parse(JSON.stringify(itName))
                elem['inputdata']['options'] = [deepClone(itName)]
                elem['inputdata']['options'][0].name.forEach((ops: any, keyIn: number) => {
                    count += 1
                    ops.disabled = index !== 0 || false
                    ops.decorator = ops.decorator + count
                });
                this.$nextTick(() => {
                    this.form.setFieldsValue({
                        [elem['timeBand']['decorator']]: str
                    });
                })
            });
        } else {
            // this.ratingData.forEach((elem: any, index: number) => {
            let elem = this.ratingData[this.goCopyIndex]
            count += 1
            // elem['inputdata']['options'][0] = itName
            elem['inputdata']['options'] = [itName]
            elem['inputcolumns']['options'] = columns
            elem['inputdata']['options'][0].name.forEach((ops: any, keyIn: number) => {
                count += 1
                // ops.disabled = true
                ops.disabled = false
                ops.decorator = ops.decorator + count
            });
            // if (!!elem && index === this.goCopyIndex) {
            this.$nextTick(() => {
                this.form.setFieldsValue({
                    [elem.timeBand.decorator]: str
                });
            })
            // }
            // })
            // }
            console.log('timeband:', 'timeBand' + this.goCopyIndex);
        }
        //   // this.rateInitData(1)
    }

    /* 高级搜索回调 */
    public async SearchOk(values: any) {
        let data = {
            params: {
                timeBandName: values.timeBandName,
                timeFrom: values.timeFrom && moment(values.timeFrom).format('hh:mm:ss'),
                dayTo: values.dayTo,
                weekdayFrom: values.weekdayFrom,
                weekdayTo: values.weekdayTo,
                timeTo: values.timeTo && moment(values.timeTo).format('hh:mm:ss')
            }
        }
        await AxiosGet('/config/vc-time-band', data).then((res: any) => {
            this.tableDatasa = res.data || []
        })
        this.tableDatasa.forEach((item: any, index: number) => {
            item.detailList.length && item.detailList.forEach((innerItem: any) => {
                if (innerItem.type === 1) {
                    innerItem.type = 'peak'
                } else {
                    innerItem.type = 'Offpeak'
                }
            });
        });
    }

    public onChange() {

    }

    public deleteTab(key: number, index: number, isDisabled: boolean) {
        if (isDisabled) {
            return
        }
        if (key > -1 && index > -1) {
            if (this.sameTariValue === 'Yes') {
                this.ratingData.forEach((ratingDataItem: any, ratingDataIndex: number) => {
                    if (ratingDataItem.inputdata.options.length > 1) {
                        ratingDataItem.inputdata.options.splice(index, 1)
                    }

                })
            } else if (this.ratingData[key].inputdata.options.length > 1) {
                this.ratingData[key].inputdata.options.splice(index, 1)
            }
            this.rowChange(key, index)
        }
    }

    public Add(key: number, isAdd: boolean) {
        if (isAdd) return
        const {
            options
        } = this.ratingData[key].inputdata;
        const currentKey = '' + new Date().getTime()
        console.log(this.sameTariValue);
        if (this.sameTariValue === 'Yes') {
            this.ratingData.forEach((ratingDataItem: any, ratingDataIndex: number) => {
                let inputOptions: any = deepClone(options[options.length - 1])
                inputOptions.key = 'options' + ratingDataIndex + currentKey
                inputOptions.name.forEach((element: any, index: number) => {
                    if (element.decorator) {
                        if (element.decorator.includes('destination')) {
                            element.initialValue = []
                        } else {
                            element.initialValue = undefined
                        }
                        const match = element.decorator.match(/[a-zA-Z]+/)
                        element.decorator = (match[0] ? match[0] : '') + ratingDataIndex + currentKey + index
                    }
                });
                ratingDataItem.inputdata.options.push(inputOptions)
            })
        } else {
            let inputOptions: any = deepClone(options[options.length - 1])
            inputOptions.key = 'options' + currentKey
            inputOptions.name.forEach((element: any, index: number) => {
                if (element.decorator) {
                    if (element.decorator.includes('destination')) {
                        element.initialValue = []
                    } else {
                        element.initialValue = undefined
                    }
                    const match = element.decorator.match(/[a-zA-Z]+/)
                    element.decorator = (match[0] ? match[0] : '') + currentKey + index
                }
            });
            options.push(inputOptions)
        }
    }

    public created() {
        this.ratingForm(this.form)
        // this.getDstination()
    }

    public getDstination() {
        // let ratePlanArr: any[] = []
        // for (let i = 0; i < this.ratePlanObject.length; i++) {
        //     const element = this.ratePlanObject[i];
        //     for (let index = 0; index < element.tabs.length; index++) {
        //         ratePlanArr.push(element.tabs[index])
        //     }
        // }
        // if (ratePlanArr[this.productIndex] || ratePlanArr[0]) {
        //     let data = {
        //         params: {
        //             productName: ratePlanArr[this.productIndex]['typeName'].replace(/[\r\n\ +]/g, ""),
        //             direction: ratePlanArr[this.productIndex]['direction'] || 1
        //         }
        //     }
        //     AxiosGet('/config/droplist/contract/destinations', data).then((res: any) => {
        //         this.destinationsOptions = res.data || []
        //     })
        // }
    }
}
</script>

<style>
.Ratingzone-code .select_code .el-input__inner {
    height: 32px;
    line-height: 32px;
}
</style><style lang="scss" scoped>
.td-delete {
    vertical-align: middle;
}

.delete {
    display: inline-block;
    background: #f06666;
    width: 24px;
    height: 24px;
    line-height: 24px;
    border-radius: 50%;
    text-align: center;
    cursor: pointer;
    color: #fff;

    &:hover {
        background: red;
    }
}

.Timeband {
    margin-left: 10px;
}

.Ratingzone-code {
    border: 1px solid rgb(212, 212, 212);
    padding: 5px;
    margin: 10px 0px;
    background-color: rgb(251, 251, 251);
}

.Zone-code {
    padding: 2px;
    border: 1px solid rgb(238, 238, 238);
    background-color: #e9eaf3;

    .title {
        padding: 10px;
        font-weight: 600;
        color: #000;
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
    text-align: center;
}

table.border tr th,
table.border tr td {
    border: 1px solid rgb(221, 224, 241);
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
    padding: 0px 8px;
    background-color: #ffffff;

    .ant-form-item {
        margin: 0;
    }
}

.Ratingzone {
    h1 {
        padding: 10px;
        border-bottom: 1px solid rgb(231, 231, 231);
    }
}

.Zone-code {
    margin: 25px 10px;
    border: 1px solid rgb(238, 238, 238);

    .title {
        padding: 10px;
        font-weight: 600;
        color: #000;
        background-color: #e9eaf3;
        display: block;
        padding-left: 20px;
    }
}

.Go,
.clear {
    display: inline-block;
    width: 40px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    color: #fff;
    background-color: #3e77d8;
    transition: all 0.2s;
    cursor: pointer;
    border-radius: 6px;
    margin: 4px 0px;
    margin-left: -19px;

    &:hover {
        opacity: 0.8;
    }
}

.clear {
    margin-left: 10px;
    background: red;

    &:hover {
        opacity: .8;
    }
}

.Row {
    padding: 15px 0px;
    transition: all 0.2s;
    text-align: center;

    span {
        cursor: pointer;
    }

    span {
        color: rgb(64, 120, 216);
        font-size: 18px;
        font-weight: 600;
    }

    span {
        border-radius: 50px;
        display: inline-block;
        width: 100px;
        background: rgb(62, 119, 216);
        color: #fff;
        padding: 2px;

        &:hover {
            opacity: 0.8;
        }

        i {
            font-size: 17px;
        }
    }
}

.disabled {
    color: rgba(0, 0, 0, 0.25);
    background-color: #dcdcdc !important;
    border-color: #d9d9d9;
    text-shadow: none;
    box-shadow: none;
    border: 0;
    // width: 100px;
    cursor: no-drop;
    font-weight: 600;

    &:hover {
        //   color: rgba(0, 0, 0, 0.25);
        //   background-color: #f5f5f5;
        //   border-color: #d9d9d9;
        //   text-shadow: none;
        //   box-shadow: none;
        //   border: 0;
        background-color: #dcdcdc;
        // background-color: unset
    }
}
</style>
