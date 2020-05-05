<template>
<div class="Ratingzone">
    <h1>Rating zone</h1>
    <div v-for="(i,k) in ratingzoneAdd" :key="i.key" class="ratingzoneAdd-code">
        <div class="Ratingzone-code">
            <div class="Zone-code">
                <a-row>
                    <a-col :span="18">
                        <span class="title">Zone&nbsp;{{k+1}}</span>
                    </a-col>
                    <a-col :span="6">
                        <span class="Copy" @click="copyZone(k)">Copy zone</span>
                        <span class="Delete" @click="deleteZone(k)">Delete zone</span>
                    </a-col>
                </a-row>
            </div>
            <a-form :form="form">
                <a-row>
                    <a-col :span="24">
                        <a-form-item :label="i.CommitmentValue.name" :colon="false" :hasFeedback="false" :label-col="{ span: 3, offset: 1 }" :wrapper-col="{ span: 14 }">
                            <el-select :multiple-limit="1" placeholder="" @change="onInput($event,i.CommitmentValue.decorator)" filterable multiple allow-create :disabled="i.CommitmentValue.disabled" :getPopupContainer="triggerNode => triggerNode.parentNode" style="width:100%;vertical-align: middle;" v-decorator="[
                                `${i.CommitmentValue.decorator}`,
                                {
                                rules: [{
                                    required: i.CommitmentValue.required,
                                    message: i.CommitmentValue.message
                                }],
                                  initialValue: i.CommitmentValue.initialValue
                                }
                            ]">
                                <el-option :value="child" v-for="(child,key) in ['default']" :key="key">
                                </el-option>
                            </el-select>
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item :label="i.Destination.name" :colon="false" :hasFeedback="false" :label-col="{ span: 3, offset: 1 }" :wrapper-col="{ span: 18 }">
                            <select-input ref="selectAll" :values.sync="i.Destination.initialValue" allShow :disabled="i.timeBand.disabled" :options="i.Destination.options" multiple filterable @change="onChange" style="width:100%" :getPopupContainer="triggerNode => triggerNode.parentNode" v-decorator="[
                                `${i.Destination.decorator}`,
                                {
                                rules: [{
                                    required: i.Destination.required,
                                    message: i.Destination.message
                                }],
                                initialValue:i.Destination.initialValue
                                }
                            ]" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="22" v-if="timeBand">
                        <a-form-item :label="i.timeBand.name" :colon="false" :hasFeedback="false" :label-col="{ span: 3, offset: 1 }" :wrapper-col="{ span: 19 }">
                            <a-textarea disabled autosize class="Timeband" style="resize: none;" v-decorator="[
                                `${i.timeBand.decorator}`,
                                {
                                rules: [{
                                    required:false,
                                    message: i.timeBand.message
                                }],
                                initialValue: i.timeBand.initialValue
                                }
                            ]" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="2" v-if="timeBand">
                        <span @click="goVisibleHide(k,i.timeBand.isInsert)" :class="i.timeBand.isInsert ?['disabled','Go'] : ['Go']">Go</span>
                        <span @click="clearTimeband(k,i.timeBand.isClear)" :class="i.timeBand.isClear ?['disabled','clear'] : ['clear']">Clear</span>
                    </a-col>
                    <model title="Time band" v-model="goVisible" width="1200px" @Screencover="goVisibleHide">
                        <template slot="model-body">
                            <AdvancedSearch :formoptions="formOptionS" @Submit="SearchOk" @select="onTimebandSelect" />
                            <Table @onSelect="onSelect" :columns="tableColumn" :data="tableDatasa" :scroll="{ x: 2000, y: 250 }" />
                            <!--max-height:350px;-->
                            <!-- <i-table style="overflow:auto" border @on-selection-change="onSelect" stripe :columns="tableColumn" :data="tableDatasa"></i-table> -->
                        </template>
                        <template slot="model-footer">
                            <a-row style="margin-top:20px;">
                                <a-col :span="24" style="text-align:center;">
                                    <a-button type="primary" @click="confirm(k)">Confirm</a-button>
                                    <a-button style="margin-left:30px;" @click="goVisibleHide">Return</a-button>
                                </a-col>
                            </a-row>
                        </template>
                    </model>
                    <!-- style="overflow-x: auto" -->
                    <a-col :span="24" style="overflow-x: auto;overflow-y:hidden;">
                        <div>
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
                                                <a-input :disabled="it.disabled" @change="onTableInput" @blur="onBlurTableInput($event,it.decorator,ip.name,key,k)" v-if="it.type === 'input' " v-decorator="[
                                    `${it.decorator}`,
                                    {
                                      rules: [{
                                        required: it.require,
                                        message: `${it.decorator.replace(/\d/g,'')} field should be no-null`
                                      }],
                                      initialValue: it.model || it.initialValue || undefined
                                  }
                                ]" />
                                                <!-- <a-select allowClear showArrow
                                                 :getPopupContainer="triggerNode => triggerNode.parentNode" 
                                                    v-if="it.type === 'select' " :style="{minWidth:'130px'}" v-decorator="[
                                    `${it.decorator}`,
                                    {
                                      rules: [{
                                        required:  it.require,
                                        message: `${it.decorator.replace(/\d/g,'')} field should be no-null`
                                      }],
                                      initialValue:it.model ||it.initialValue || undefined
                                    }
                                  ]">
                                                    <a-select-option :disabled="itn.disabled" v-for="(itn,index) in it.options" :value="itn.value || itn.name || itn" :key="index">
                                                        {{itn.name || itn}}
                                                    </a-select-option>

                                                </a-select> -->
                                                <el-select class="select_code" clearable filterable v-if="it.type === 'select' " :style="{width:'100%'}" v-decorator="[
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
                                                        {{itn.name|| itn}}
                                                    </el-option>
                                                </el-select>
                                            </a-form-item>
                                        </td>
                                        <td class="td-delete" style="border:0;text-align: center;padding:0;" v-if="!timeBand">
                                            <span @click="deleteTab(key,k)" class="delete">
                                                <a-icon type="minus" />
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </a-col>
                </a-row>
                <a-row :gutter="24" class="Row" v-if="!timeBand">
                    <a-col :span="24">
                        <span @click="Add(k,i.timeBand.isInsert)" :style="i.timeBand.isInsert && {cursor: 'no-drop',background: '#ccc'}">
                            <a-icon type="plus" />
                        </span>
                    </a-col>
                </a-row>
            </a-form>
        </div>
    </div>
    <a-row>
        <a-col>
            <span class="addZone" @click="addZone">Add zone</span>
        </a-col>
    </a-row>
</div>
</template>

<script lang="ts">
import Vue from 'vue'
import {
    getratingZoneTimeband
} from '@/api/index'
import {
    Component,
    Prop,
    Emit,
    Watch
} from 'vue-property-decorator'
import {
    columns,
    data
} from '@/common/ts/tableData'
import {
    Mutation
} from 'vuex-class'
import moment from 'moment'
import {
    type
} from '../../../filter';

// 公用配置参数
import {
    recodeConfig
} from '@/assets/ts/config.d'
// 页面请求参数配置
import {
    getDataConfig
} from './pageConfig.d'
@Component({
    components: {
        AdvancedSearch: resolve => require(['@/common/Advancedsearch/timeband.vue'], resolve),
        TableInput: resolve => require(['@/common/TableInput/index.vue'], resolve),
        selectInput: resolve => require(['@/common/selectInput/index.vue'], resolve),
        Table: resolve => require(["@/common/table_timeband/index.vue"], resolve),
        model: resolve => require(['@/common/Model/index.vue'], resolve)
    }
})
export default class penAlty extends Vue {
    /* Prop -> inputcolumns & inputdata */
    // @Prop(Array) private inputcolumns ? : any;
    // @Prop(Array) private inputdata ? : any;
    /* table */
    @Prop(Boolean) private timeBand ? : any;
    @Prop(Array) private tableData ? : any;
    @Prop(Array) private tableColumn ? : any;
    @Prop(Array) private Newdata ? : any
    /* 表单数据来源 */
    @Prop(Array) private ratingzoneAdd: any
    /* Zone Copy */
    @Prop(Array) private zoneCopy ? : any
    /* 是否需要从后台获取费率区 */
    @Prop(String) private structure ? : string /* 当前所在的结构 */
    @Prop(Boolean) private Interval ? : Boolean; //
    @Emit('onInput') onInputChange(value: string, name: string) {} // 输入框输入触发
    @Emit('onTableInput') onTableInputs(value: string, name: string, arr: any) {} // 表格输入框输入触发
    @Emit('onSelect') onSelectChange(value: string, name: string, index: number) {} // 下拉框选中触发
    @Emit('tableDele') tableDele() {} // 表格移除触发
    @Emit('addChange') addChange() {} // Zone Add 触发
    @Emit('ratingZoneCopy') ratingZoneCopy() {} // Zone复制触发
    @Emit('ratingAddzone') ratingAddzone() {} // Zone复制触发
    @Emit('delecopyIndex') delecopyIndex(index: number, len: number) {} // Zone复制删除触发
    @Emit('successForm') SuccessForma(form: any) {} // Zone复制删除触发
    @Emit('TotalCommitmen') TotalCommitmen(value ? : number) {} // 承诺量统计
    @Emit('rateInitData') rateInitData(value ? : number, index ? : number) {} /* timeband 清除触发 */
    @Emit('blur') onblur(value ? : string, name ? : string, arr ? : any, item ? : any, index ? : number, arrIndex ? : number) {} /* timeband 清除触发 */
    @Emit('Handledestination') Handledestination(values ? : string[]) {} /* 费率区重复设置 */
    @Mutation('mutionProductZoneList') mutionProductZoneList: any
    /* goVisible -> Time band */

    private tableDatasa: any[] = []
    private goVisible: boolean = false;
    public data: any[] = data // Table title
    public columns: any[] = columns // Table body
    private DestinationCheck: string[] = [] // 费率区选中
    private values: string[] = []; // 费率区选中数据
    private records: any = []; // Time band 表格选中
    private timebandValue: string = ''
    private copyGoIndex: number = 0
    private isAddDispad: boolean = false
    private DestinationArr: string[] = []
    // private inputData: any = this.inputdata
    // private inputColumns: any = this.inputcolumns
    private addIndex = new Date().getTime()
    private TableaddArr: any = []
    /* From */
    private form: any;
    public beforeCreate() {
        this.form = this.$form.createForm(this);
    }
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
    public warinng(title: string, content: string) {
        return this.$error({
            title,
            content,
        });
    }
    /**
     * Add
     */
    public Add(key: number, isAdd: boolean) {
        if (isAdd) return this.$message.error('ban delete')
        this.addIndex++
        let len: number = 0
        let keyRount = new Date().getTime()
        this.ratingzoneAdd.forEach((res: any) => {
            len += res.inputdata['options'].length
        });
        let Index = this.addIndex >= len ? this.addIndex : len
        const {
            options
        } = this.ratingzoneAdd[key].inputdata;
        const {
            name
        } = options[options.length - 1]

        let inputcolumns = this.ratingzoneAdd[key].inputcolumns['options']
        let inputOptions: any = JSON.parse(JSON.stringify(options[0]))
        /* Interval Add 校验 */

        // console.log('this.structure', this.structure);
        // console.log('this.ratingzoneAdd', this.ratingzoneAdd);
        if (this.structure === 'Interval') {
            if (options.length >= 2) {
                let {
                    name: Opname
                } = options[options.length - 2]
                const prev = this.form.getFieldValue(Opname[name.length - 3].decorator)
                const next = this.form.getFieldValue(name[name.length - 3].decorator)
                if ((next && next === '+∞') || !prev || (prev && prev === '+∞')) {
                    return this.warinng('Interval Add Eroor', 'There is unfilled data or there is  +∞')
                }
                if (Number(next) <= Number(prev)) {
                    return this.warinng('Interval Add Eroor', 'The next line needs to be larger than the previous line -Interval')
                }
            } else if (options.length === 1) {
                const next = this.form.getFieldValue(name[name.length - 3].decorator)
                if (next && next === '+∞' || !next) {
                    return this.warinng('Interval Add Eroor', 'Previous line interval is empty or +∞')
                }
            }
        }
        // if (name[name.length - 3].decorator.indexOf('Interval') > -1 && options.length > 1) {

        // }
        inputOptions.key = this.addIndex
        /* Tire Add 校验 */

        if (inputOptions.name.length === 6) {
            let TierFo = this.form.getFieldValue(this.ratingzoneAdd[key]['inputdata']['options'][options.length - 1]['name'][name.length - 4]['decorator'])
            console.log('TierFo', TierFo);

            if (!TierFo || TierFo === '+∞') {
                return this.warinng('Lack Tire to', 'When it is + ∞ or empty, the next line is not allowed to be added')
            }
        }
        inputOptions.name.forEach((element: any, index: number) => {
            let value = Object.keys(element).length > 1 && element
            let decorator = !!value['decorator'] && value['decorator']
            /* 阶梯结构 */
            if (inputOptions.name.length === 6 && !!decorator && Object.keys(element).length > 1 && element) {
                // let TierFo = this.form.getFieldValue(this.ratingzoneAdd[key]['inputdata']['options'][options.length - 1]['name'][name.length - 4]['decorator'])
                // if (!TierFo || TierFo === '+∞') {
                //   return this.warinng('缺少 Tire to', 'tire to为+∞或者为空时，不允许添加下一行')
                // }
                element['decorator'] = inputcolumns[index]['dataIndex'] + keyRount + Index
                let decorator = this.ratingzoneAdd[key]['inputdata']['options'][options.length - 1]['name'][name.length - 4]['decorator']
                if (value['decorator'].indexOf('Tierfrom') > -1 && this.form.getFieldValue(decorator)) {
                    element.model = Number(this.form.getFieldValue(decorator)) + 1
                    element.disabled = true
                } else {
                    element.model = ''
                }
                return false
            }
            element.decorator = inputcolumns[index]['dataIndex'] + Index
            if (element.decorator && element.decorator.indexOf('ChargableunitType') > -1 && element.decorator) {
                element.initialValue = ''
                element.model = ''
                element.decorator = `ChargableunitType${Index}`
            } else {
                element.model = ''
            }
        });
        options.push(inputOptions)
    }
    /* 删除表格某一行 */
    public deleteTab(key: number, index: number) {
        // if (this.ratingzoneAdd[index].inputdata.options.length === 1) {
        //     return true;
        // }        
        if (key === 0) return
        this.ratingzoneAdd[index].inputdata.options.splice(key, 1);
        /* 处理tier 删除行设置上一次的to+1 */
        let options = this.ratingzoneAdd[index].inputdata.options
        if (options[key - 1] && options[key - 1].name.length === 6 && options[key]) {
            let successForm = this.form.getFieldsValue()
            this.form.setFieldsValue({
                [options[key].name[1]['decorator']]: successForm[options[key - 1].name[2]['decorator']] && +successForm[options[key - 1].name[2]['decorator']] + 1 || undefined
            })
        }
    }
    /* 生成复制数据 */
    public replicationProcessing(numbKey: number) {
        let isStatus: boolean = false
        this.form.validateFields((err: any, values: any) => {
            // if (err) return this.$message.error('input Required')
            let {
                CommitmentValue,
                Destination,
                inputcolumns,
                inputdata,
                timeBand
            } = this.ratingzoneAdd[numbKey]
            /* 校验本复制对象是否存在于Required而未输入 */
            if (CommitmentValue === true && !values[CommitmentValue.decorator].length) {
                return this.$message.error('input - CommitmentValue - Required')
            }
            if (!values[Destination.decorator].length) {
                return this.$message.error('input - Destination - Required')
            }
            let name = inputdata.options[0].name
            for (let index = 0; index < name.length; index++) {
                const element = name[index];
                if (Object.keys(element).length < 1) continue
                if (!values[element.decorator] && element.require) {
                    let decorator: any = element.decorator.match(/[a-zA-Z]+/)
                    return this.$message.error(`input - ${decorator[0]} - Required`)
                }
            }
            let {
                CommitmentValue: CommitCopy,
                Destination: DestinCopy,
                inputcolumns: columnsCopy,
                inputdata: dataCopy,
                timeBand: timeBandCopy
            } = this.zoneCopy[0]
            /* 非flat结构 && 多条数据 */
            if (dataCopy.options.length !== inputdata.options.length && !this.timeBand) {
                CommitCopy.initialValue = values[CommitmentValue.decorator]
                CommitCopy.disabled = CommitmentValue.disabled
                CommitCopy.required = CommitmentValue.required
                DestinCopy.options = Destination.options
                DestinCopy.initialValue = []
                timeBandCopy.initialValue = this.form.getFieldValue(timeBand.decorator)
                this.addIndex++
                dataCopy.options[0].name = JSON.parse(JSON.stringify(inputdata.options[0].name))
                columnsCopy.options = JSON.parse(JSON.stringify(inputcolumns.options))
                /* 处理匹配相同数据结构 */
                let inputOptions: any = JSON.parse(JSON.stringify(inputdata.options[0]))
                dataCopy['options'] = JSON.parse(JSON.stringify(inputdata.options))
                inputdata.options.forEach((data: any, index: number) => {
                    dataCopy['options'][index].name.forEach((element: any, num: number) => {
                        this.addIndex++
                        if (Object.keys(element).length > 1) {
                            let columns = columnsCopy.options[num]['dataIndex']
                            let temp = 'unkown'
                            if (data.name && data.name[num] && data.name[num]['decorator']) {
                                temp = data.name[num]['decorator'].replace(/[^0-9]/ig, "")
                            }
                            element.decorator = columns.indexOf('No') === -1 && columns + new Date().getTime() + this.addIndex //+ this.addIndex
                            if (!element.decorator) {
                                return isStatus = true
                            }
                            if (element.decorator.indexOf('Rate') === -1) {
                                element.model = ''
                                element.model = columns.indexOf('No') === -1 && values[element.decorator] || values[columns + temp] || values[columns + temp + 'k']
                            } else {
                                element.model = ''
                            }
                            if (element.decorator.indexOf('ChargableunitType') > -1) {
                                element.options = inputdata.options[0].name[num].options
                            }
                        }
                    });
                });
            } else {
                /* 非flat 结构 单条 */
                CommitCopy.initialValue = values[CommitmentValue.decorator]
                CommitCopy.disabled = CommitmentValue.disabled
                CommitCopy.required = CommitmentValue.required
                DestinCopy.options = Destination.options
                DestinCopy.initialValue = []
                timeBandCopy.initialValue = this.form.getFieldValue(timeBand.decorator)
                dataCopy.options[0].name.forEach((data: any, index: number) => {
                    this.addIndex++
                    if (Object.keys(data).length > 1) {
                        let columns = columnsCopy.options[index]['dataIndex']
                        let temp = inputdata.options[0].name[index]['decorator'].replace(/[^0-9]/ig, "")
                        data.decorator = columns.indexOf('No') === -1 && columns + new Date().getTime() + this.addIndex //this.addIndex
                        if (data.decorator.indexOf('Rate') === -1) {
                            data.model = ''
                            data.model = columns.indexOf('No') === -1 && values[data.decorator] || values[columns + temp] || values[columns + temp + 'k']
                        } else {
                            data.model = ''
                        }
                        if (data.decorator.indexOf('ChargableunitType') > -1) {
                            data.options = inputdata.options[0].name[index].options
                        }
                    }
                });
            }
            /* flat 结构 */
            if (this.timeBand) {
                // 多条费率
                if (dataCopy.options[0].name.length !== inputdata.options[0].name.length) {
                    dataCopy.options[0].name = JSON.parse(JSON.stringify(inputdata.options[0].name))
                    columnsCopy.options = JSON.parse(JSON.stringify(inputcolumns.options))
                }
                // this.form.getFieldValue(CommitmentValue.decorator)
                // CommitCopy.initialValue = CommitmentValue.initialValue
                CommitCopy.initialValue = values[CommitmentValue.decorator]
                CommitCopy.require = CommitmentValue.require
                CommitCopy.disabled = CommitmentValue.disabled
                CommitCopy.required = CommitmentValue.required
                DestinCopy.options = Destination.options
                DestinCopy.initialValue = []
                timeBandCopy.initialValue = this.form.getFieldValue(timeBand.decorator)
                timeBandCopy.timeBandDetailList = timeBand['timeBandDetailList']
                timeBandCopy.isInsert = timeBand.isInsert
                dataCopy.options[0].name.forEach((data: any, index: number) => {
                    this.addIndex++
                    if (Object.keys(data).length > 1) {
                        let columns = columnsCopy.options[index]['dataIndex']
                        let temp = inputdata.options[0].name[index]['decorator'].replace(/[^0-9]/ig, "")
                        data.decorator = columns.indexOf('No') === -1 && columns + new Date().getTime() + this.addIndex //this.addIndex
                        if (data.decorator.indexOf('Rate') === -1) {
                            data.initialValue = ''
                            data.model = columns.indexOf('No') === -1 && values[data.decorator] || values[columns + temp] || values[columns + temp + 'k']
                        } else {
                            data.initialValue = ''
                            data.model = ''
                        }
                        if (data.decorator.indexOf('ChargableunitType') > -1) {
                            data.options = inputdata.options[0].name[index].options
                        }
                    }
                });
            }
            this.ratingzoneAdd.push(this.zoneCopy[0])
            setTimeout(() => {
                // 承诺量统计
                this.TotalCommitmen(this.ratingzoneAdd)
                // 费率区重复处理
                let formData = this.form.getFieldsValue()
                let ratingdata = this.ratingzoneAdd
                let destinationArr: any = []
                for (let i = 0; i < ratingdata.length; i++) {
                    const element = ratingdata[i];
                    destinationArr.push(...formData[element.Destination.decorator])
                }
                this.Handledestination(destinationArr)
            }, 200)
            // this.fieldProcessing(this.ratingzoneAdd) // 生成后端字段
        })
    }
    /* 生成复制字段数据 */
    public fieldProcessing() {
        let values: any[] = this.ratingzoneAdd
        let CommitmentUnit = ['Secs', 'Mins', 'Quarters', 'Call', 'User']
        let ratingZoneList: any[] = []
        let count: number = 0
        let ratingDetailObject: any = {}
        let flg: number = 0
        let rate: number[] = [],
            chargeUnit: number = 0
        for (let i: number = 0; i < values.length; i++) {
            const elem = values[i];
            count = 0
            rate = []
            /* flat 结构 */
            if (this.timeBand) {
                if (elem.timeBand.data) {
                    elem.inputdata.options[0].name.forEach((ops: any) => {
                        if (Object.keys(ops).length > 0) {
                            if (ops.decorator.indexOf('Rate') > -1) {
                                rate.push(Number(this.form.getFieldValue(ops.decorator)))
                            } else {
                                chargeUnit = CommitmentUnit.indexOf(this.form.getFieldValue(ops.decorator)) + 1
                            }
                        }
                    });
                    elem.timeBand.data.forEach((ele: any, index: number) => {
                        ele['rate'] = rate[index]
                        ele['chargeUnit'] = chargeUnit
                        ele['destinationList'] = this.form.getFieldValue(elem.Destination.decorator).join(',') || []
                    });
                }
            }
            ratingZoneList.push({
                commitmentValue: this.form.getFieldValue(elem.CommitmentValue.decorator) || undefined,
                destinationList: this.form.getFieldValue(elem.Destination.decorator) || [],
                timeBandName: null,
                zoneNumber: i + 1,
                ratingDetailList: elem.timeBand.data || []
            })

        }
        this.mutionProductZoneList(ratingZoneList)
    }
    /* copyZone -> dom 复制 */
    public copyZone(numbKey: number) {
        /* 调用复制源数据 */
        this.ratingZoneCopy()
        setTimeout(() => {
            this.replicationProcessing(numbKey)
        }, 300)
    }
    public addZone() {
        this.values = []
        this.ratingAddzone()
    }
    public addData() {
        this.addChange()
    }
    /* 表格移除 */
    public dele() {
        this.tableDele()
    }
    /* 高级搜索回调 */
    public async SearchOk(values: getDataConfig['params']) {
        console.log(values)
        if (values.dayFrom && !values.dayTo) {
            return this.$message.error('Select month end days')
        }
        if (values.dayTo && !values.dayFrom) {
            return this.$message.error('Select the start days of the month')
        }
        if (values.weekdayFrom && !values.weekdayTo) {
            return this.$message.error('Select start time of working day')
        }
        if (values.weekdayTo && !values.weekdayFrom) {
            return this.$message.error('Select end of workday')
        }
        let data: getDataConfig = {
            params: {
                timeBandName: values.timeBandName || undefined,
                timeFrom: values.timeFrom && moment(values.timeFrom).format('HH:mm:ss') || undefined,
                dayTo: values.dayTo || undefined,
                weekdayFrom: values.weekdayFrom || undefined,
                weekdayTo: values.weekdayTo || undefined,
                timeTo: values.timeTo && moment(values.timeTo).format('HH:mm:ss') || undefined,
                dayFrom: values.dayFrom || undefined,
                type: values.type || undefined
            }
        }
        await getratingZoneTimeband(data).then((res: recodeConfig) => {
            this.tableDatasa = res.data || []
        })
    }
    /* deleteZone -> 复制 移除 */
    public deleteZone(index: number) {
        if (this.ratingzoneAdd.length !== 1) {
            this.ratingzoneAdd.splice(index, 1)
            this.delecopyIndex(index, this.ratingzoneAdd.length)
        }
        // if (this.ratingzoneAdd.length === 1) {
        //   this.ratingzoneAdd[0]['CommitmentValue'].disabled = true
        // }
    }
    /* 清除timeband */
    public clearTimeband(clearKey: number, isClear ? : boolean) {
        console.log('clearKey', clearKey);

        if (isClear && typeof isClear === 'boolean') return
        if (!this.form.getFieldValue(this.ratingzoneAdd[clearKey]['timeBand']['decorator'])) return
        // this.copyGoIndex
        let key = this.ratingzoneAdd[clearKey]['inputdata']['options'][0]['key']
        this.form.setFieldsValue({
            [this.ratingzoneAdd[clearKey]['timeBand']['decorator']]: undefined
        });
        let inputcolumns = {
            type: 'tableCloums',
            options: [{
                    title: 'No .',
                    dataIndex: 'No',
                    key: 'No'
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
        this.ratingzoneAdd[clearKey]['inputdata'] = inputdata
        this.ratingzoneAdd[clearKey]['inputcolumns'] = inputcolumns
        this.ratingzoneAdd[clearKey].timeBand.timeBandDetailList = undefined
        this.rateInitData(2, clearKey)
    }
    /* 用户手动选择/取消选择所有列的回调  Table -> 回调 */
    public onSelectAll(selected: any, selectedRows: any, changeRows: any) {
        // this.assigNment(selectedRows)
    }
    /* 用户手动选择/取消选择某列的回调
        @param record: 选中数据
        @param selected: 是否选中 true/false
        @param selectedRows: 所有选中 Array
        */
    public onSelect(record: any) {
        this.records = record
        // this.assigNment(selectedRows)
    }
    /* Go Visible */
    public goVisibleHide(key: number, isAdd ? : boolean) {
        if (typeof isAdd === 'boolean' && isAdd) return
        this.copyGoIndex = key
        this.goVisible = !this.goVisible;
    }
    /* 插入 */
    public confirm(confirmKey: number) {
        let data: any[] = [],
            columns: any[] = [],
            arr: any[] = [],
            count: number = 0,
            objCount: any = {},
            peakCount: number = 0,
            offPeakCount: number = 0,
            str: string = '',
            options: any[] = []
        this.ratingzoneAdd[0]['inputdata']['options'][0]['name'].forEach((elem: any) => {
            if (elem.options) {
                console.log(elem.options);

                options = JSON.parse(JSON.stringify(elem.options))
            }
        });
        if (!this.records.length) return this.$message.error('No data')
        let timeBandDetailList: any[] = []
        let type = ''
        this.records.length && this.records.forEach((element: any) => {
            timeBandDetailList = timeBandDetailList.concat(element.detailList)
            element.detailList.length && element.detailList.forEach((value: any, key: number) => {
                count += 1
                if (!objCount['Offpeak'] && value.type === 2) {
                    offPeakCount = 1
                    objCount['Offpeak'] = 'Offpeak'
                    type = 'Offpeak' + offPeakCount
                } else if (objCount['Offpeak'] && value.type === 2) {
                    offPeakCount += 1
                    type = 'Offpeak' + offPeakCount
                }
                if (!objCount['peak'] && value.type === 1) {
                    peakCount = 1
                    objCount['peak'] = 'peak'
                    type = 'peak' + peakCount
                } else if (objCount['peak'] && value.type === 1) {
                    peakCount += 1
                    type = 'peak' + peakCount
                }
                str += `${type || '--'}\xa0\xa0\xa0\xa0:\xa0${value.dayFrom || '--'}-${value.dayTo || '--'}\xa0/\xa0${value.weekdayFrom || '--'}-${value.weekdayTo || '--'}\xa0/\xa0${value.timeFrom || '--'}-${value.timeTo || '--'}\n`
                // this.ratingzoneAdd[index]['timeBand']['data'] = value
                // arr.push(value)
                data.push({
                    type: 'input',
                    decorator: 'Rate' + new Date().getTime() + count,
                    key: value.key,
                    require: true,
                    initialValue: ''
                })
                columns.push({
                    title: type + '\xa0' + 'Rate',
                    dataIndex: 'Rate',
                    require: true
                })
            });
        });
        this.ratingzoneAdd[this.copyGoIndex]['timeBand'].timeBandDetailList = timeBandDetailList
        data.unshift({})
        data.push({
            type: 'select',
            decorator: 'ChargableunitType' + new Date().getTime() + count,
            require: true,
            options
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
        let itName: object = {
            key: new Date().getTime() + count,
            name: data
        }
        this.goVisible = !this.goVisible;
        this.ratingzoneAdd[this.copyGoIndex]['inputcolumns']['options'] = columns
        this.ratingzoneAdd[this.copyGoIndex]['inputdata']['options'][0] = (itName)
        this.ratingzoneAdd[this.copyGoIndex]['timeBand'].isInsert = true
        this.ratingzoneAdd[this.copyGoIndex].timeBand.isClear = false
        this.form.setFieldsValue({
            [this.ratingzoneAdd[this.copyGoIndex].timeBand.decorator]: str.trim()
        })
        this.rateInitData(1, this.copyGoIndex)
    }
    /* 输入触发 -> ratingzone */
    public onInput(e: any, name: string) {
        this.onInputChange(e[0], name)
    }
    /* 高级搜索多选触发 */
    public onTimebandSelect(value: string, name: string) {
        console.log('value', value, 'name', name);

    }
    /* 表格输入框失焦触发 */
    public onBlurTableInput(e: any, name: string, item: object | any, index: number, k: number) {
        if (!!name && name.indexOf('Rate') > -1) return
        this.onblur(e.target.value, name, this.ratingzoneAdd, item, index + 1, k)
    }
    // public Search(values: any): void {
    //     let data = {
    //         params: {
    //             accountName: values.accountName,
    //             contractNameList: values.contractNameList,
    //             configServiceNameList: values.configServiceNameList,
    //             direction: values.direction,
    //             cycleNameList: values.cycleNameList,
    //             rateStructure: values.rateStructure
    //         }
    //     }
    //     AxiosGet('/vc-contract/products/summary', data, '/contract').then((res: any) => {
    //         this.data = res.data
    //     })
    // }
    /* TableInput 输入框输入触发 */
    public onTableInput(e: any, arr: any) {
        this.onTableInputs(e.target.value, e.target.id, this.ratingzoneAdd)
    }
    /* 下拉选中 */
    public onTableSelect(value: string, name: string, index: number) {
        this.onSelectChange(value, name, index)
    }
    /* 费率区选中 */
    public onChange(val: string[]) {
        this.Handledestination(val)
        this.DestinationCheck = val;
    }
    /* 表单数据 */
    public success(values: any) {
        console.log(values)
    }
    public successForm() {
        console.log('977-this.form', this.form);

        this.SuccessForma(this.form)
    }
    public updateChange(values: string[]) {
        this.$set(this, 'DestinationArr', values)
    }
    public assDestinationArr(values: string[]) {
        this.$set(this, 'DestinationArr', values)
    }

    public getFieldsValue() {
        return this.form.getFieldsValue()
    }
    public activated() {
        Vue.prototype.getZoneList = function () {
            console.log('getZoneList')
            // this.fieldProcessing()
        }
        this.successForm()
    }
    public created() {
        let that = this
        Vue.prototype.getZoneList = function () {
            that.$nextTick(() => {
                that.fieldProcessing()
            })
        }
        this.successForm()
        let obj: any = {}
        this.ratingzoneAdd.forEach((elem: any, index: number) => {
            if (elem['CommitmentValue']['decorator'].indexOf(index) > -1) return
            elem['CommitmentValue']['decorator'] = elem['CommitmentValue']['decorator'] + index;
            elem['Destination']['decorator'] = elem['Destination']['decorator'] + index;
            elem['timeBand']['decorator'] = elem['timeBand']['decorator'] + index;
            elem['key'] = 0
        });
    }

}
</script>

<style>
.ivu-table:before {
    background-color: unset;
}

.subCol>ul>li {
    margin: 0 -18px;
    list-style: none;
    text-align: center;
    /* padding: 9px; */
    border-bottom: 1px solid #e6e6e6;
    /* overflow: hidden; */
    height: 50px;
    line-height: 50px;
}

.subCol>ul>li:last-child {
    border-bottom: none;
}

.AdvancedSearch {
    display: flex;
    row-gap: 3;
    justify-content: center;
}

.Ratingzone-code .select_code .el-input__inner {
    height: 32px;
    line-height: 32px;
}
</style><style lang="scss" scoped>
.Ratingzone {
    padding: 0px 10px;
    border: 1px solid rgb(211, 210, 210);

    h1 {
        padding: 10px;
        // border-bottom: 1px solid rgb(231, 231, 231);
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

    .Copy,
    .Delete,
    .addZone {
        display: inline-block;
        padding: 5px 10px;
        border-radius: 50px;
        color: #fff;
        border: 1px solid #1890ff;
        background-color: #1890ff;
        margin: 5px;
        font-weight: 500;
        cursor: pointer;

        &:hover {
            opacity: 0.8;
        }
    }

    .Delete {
        color: #f5222d;
        border: 1px solid #f5222d;
        background: #f5f5f5;
    }
}

.addZone {
    border-radius: 6px;
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
    margin-left: -29px;

    &:hover {
        opacity: 0.8;
    }
}

.Ratingzone-code {
    border: 1px solid rgb(212, 212, 212);
    padding: 0;
    margin: 10px 0px;
    background-color: rgb(251, 251, 251);
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
    overflow-y: scroll;
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

.table-code {
    display: flex;
    justify-content: space-between;
    position: relative;

    div:nth-child(1) {
        width: 100%;
    }

    div:nth-child(2) {
        vertical-align: middle;
        box-sizing: border-box;

        ul {
            list-style: none;
            padding-top: 60px;
            box-sizing: border-box;

            li {
                -webkit-transition: all 0.2s;
                transition: all 0.2s;
                height: 39px;
                line-height: 40px;
                margin: 0px 5px;

                span {
                    display: inline-block;
                    background: #f06666;
                    width: 24px;
                    height: 24px;
                    line-height: 27px;
                    border-radius: 50%;
                    text-align: center;
                    cursor: pointer;

                    &:hover {
                        background: red;
                    }
                }

                i {
                    font-size: 20px;
                    color: #fff;
                }
            }
        }
    }
}

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
    background-color: #dcdcdc;
    border-color: #d9d9d9;
    text-shadow: none;
    box-shadow: none;
    border: 0;
    // width: 100px;
    cursor: no-drop;
    font-weight: 600;

    // &:hover {
    //   color: rgba(0, 0, 0, 0.25);
    //   background-color: #f5f5f5;
    //   border-color: #d9d9d9;
    //   text-shadow: none;
    //   box-shadow: none;
    //   border: 0;
    // }
}
</style>
