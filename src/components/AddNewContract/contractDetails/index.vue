<template>
<div>
    <div id="components-form-demo-advanced-search" class="unset">
        <a-form class="ant-advanced-search-form" :form="form" @submit="handleSearch" v-show="expand">
            <a-row justify="start" type="flex">
                <a-col :span="8" v-for="(item,key) in formoptions" :key="key" style="height: 60px;">
                    <a-form-item :label="item.Tips" :colon="false" :wrapperCol="{ span: 9 }" :label-col="{ span: 9, offset: 2 }" :hasFeedback="false">
                        <a-select @change="handleChange(item.name,$event,key)" @dropdownVisibleChange="dropdownVisibleChange(item.name,$event,key)" :getPopupContainer=" e=>e.parentNode" v-if="item.type==='select'" allowClear :disabled="item.disabled" v-decorator="[
                                `${item.name}`,
                                {
                                    initialValue:item.initialValue,
                                    rules: [{
                                        required: item.required,
                                        message: `${item.Tips} field should be no-null`,
                                    }],
                                    initialValue:item.initialValue || undefined
                                }
                            ]" placeholder="">
                            <a-select-option :value="child.name || child" v-for="(child,key) in item.options" :key="key" :disabled="( child.name || child) ==='Low'&& low ">
                                {{child.name || child}}
                            </a-select-option>
                        </a-select>
                        <a-date-picker :disabled="item.disabled" @click="pickChang(item.name,key)" v-if="item.type === 'picker'" :getCalendarContainer="e => e.parentNode" v-decorator="[
                            `${item.name}`,
                            {
                              rules: [{
                                required: item.required,
                                message: `${item.Tips} field should be no-null`,
                              }],
                                initialValue:item.initialValue
                            }
                        ]" @change="onChange(item.name,$event,key)" style="width:100%" placeholder="YYYY-MM-DD" />
                        <a-input placeholder="" :disabled="item.disabled" allowClear v-else-if="item.type === 'input'" :getPopupContainer=" e => e.parentNode" v-decorator="[
                            `${item.name}`,
                            {
                                rules: [{
                                    required: item.required,
                                    message: `${item.Tips} field should be no-null`,
                                }
                                ],
                                initialValue:item.initialValue
                            }
                        ]" />
                        <a-select mode="multiple" :disabled="item.disabled" :maxTagCount="contractIndex === 1 ? 1 : 99999" :getPopupContainer=" e => e.parentNode" v-decorator="[
                                      `${item.name}`,
                                      {
                                        rules: [{
                                          required: item.required,
                                          message: `${item.Tips} field should be no-null`,
                                        }],
                                initialValue:item.initialValue
                                      }
                                    ]" placeholder="" @click=" handleChange(item.name, key, child.name)" v-else-if=" item. type === 'tags'">
                            <a-select-option v-for=" (itn,index) in item.options" :value="itn.name || itn" :key="index">
                                {{itn.name || itn}}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
            </a-row>
        </a-form>
    </div>
</div>
</template>

<script lang="ts">
import Vue from 'vue'
import {
    Component,
    Prop
} from 'vue-property-decorator'
import {
    Mutation,
    State
} from 'vuex-class'
import moment from 'moment'
import {
    deepClone
} from "../../../assets/ts/index";
// Api 请求
import {
    getDetailAccounts,
    getDetailService,
    getDetailrelatedContract
} from '../../../api/index'
// 当前页面变量声明
import {
    getConfig,
    formConfig,
    formValueConfig,
    concatDataConfig
} from './detailsConfig'
// import { mutationsConfig } from '@/assets/ts/config.d'
// 模块通用参数声明
import { mutationsConfig,editConfig } from '../product/publicParameter/publicConfig'
import {
    recodeConfig
} from '../../../assets/ts/config';
@Component({
    components: {
        selectInput: () => import('@/common/selectInput/index.vue')
    }
})
export default class Home extends Vue {
    @Mutation('mutionContract') mutionContract: mutationsConfig['mutionContract'] | any
    // @Mutation('mutionContractData') mutionContractData: any
    @State('contractData') contractData: Object | undefined 
    @State('editData') editData: editConfig | any
    @State('contractIndex') contractIndex: number | undefined
    @State('closeModel') closeModel: any
    private low: boolean = true; // 优先级
    private form: any;
    private expand: boolean = true
    public beforeCreate(): void {
        let that: any = this
        this.form = that.$form.createForm(this);
    }
    //  @Prop(Array) formoptions?:any
    @Prop({
        type: Number,
        default: 8
    }) span ? : number
    private formoptions: Array < formConfig > = [{
            Tips: 'Account',
            name: 'accountName',
            required: true,
            type: 'select',
            options: null,
            initialValue: undefined,
            disabled: false
        },
        {
            Tips: 'Contract',
            name: 'contractName',
            required: true,
            // pattern: /^[^-]+$/,
            // patternTips: "【Contract Name can not contain the character '-'】",
            type: 'input',
            options: null,
            initialValue: undefined,
            disabled: false
        },
        {
            Tips: 'Contract Abbrv.',
            name: 'contractAbbrv',
            required: false,
            // patternTips: '',
            type: 'input',
            options: null,
            initialValue: undefined,
            disabled: false
        },
        {
            Tips: 'Service',
            name: 'configServiceNameList',
            required: true,
            type: 'tags',
            options: null,
            initialValue: undefined,
            disabled: false
        },
        {
            Tips: 'Related Contract',
            name: 'relatedContract',
            disabled: false,
            required: false,
            allowClear: false,
            type: 'select',
            options: null,
            initialValue: undefined
        },
        {
            Tips: 'Priority',
            name: 'priority',
            initialValue: 'High',
            required: true,
            type: 'select',
            disabled: false,
            options: [{
                name: 'High',
                value: true
            }, {
                name: 'Low'
            }]
        },
        {
            Tips: 'Signed date',
            name: 'singedDate',
            required: false,
            type: 'picker',
            initialValue: undefined,
            disabled: false
        },
        {
            Tips: 'begin date',
            name: 'beginDate',
            required: true,
            type: 'picker',
            initialValue: undefined,
            disabled: false
        },
        {
            Tips: 'End date',
            name: 'endDate',
            required: true,
            type: 'picker',
            initialValue: undefined,
            disabled: false
        },
        {
            Tips: 'Auto renew',
            name: 'isAutoRenew',
            required: true,
            disabled: false,
            type: 'select',
            initialValue: 'No',
            options: [{
                name: 'Yes'
            }, {
                name: 'No'
            }]
        },
        {
            Tips: 'Renew date',
            name: 'renewDate',
            required: false,
            disabled: true,
            type: 'picker',
            initialValue: undefined
        },

    ]
    /* 下拉按下触发 */
    public dropdownVisibleChange(name: string, open: boolean, key: number): void {
        if (open && name === 'relatedContract' && this.form.getFieldValue('configServiceNameList') && this.form.getFieldValue('accountName')) {
            let data: getConfig = {
                params: {
                    accountName: this.form.getFieldValue('accountName'),
                    serviceNameList: this.form.getFieldValue('configServiceNameList').join(','),
                    contractName: this.form.getFieldValue('contractName')
                }
            }
            getDetailrelatedContract(data).then((res: recodeConfig): void => {
                this.formoptions[4]['options'] = res.data
            })
        }
    }
    /* 下拉选中 */
    public handleChange(val: string, name: string, key: number): void {
        this.formoption(val, name, key)
    }
    public crearChange(val: string, name: string, key: number): void {
        this.formoption(val, name, key)
    }
    public handleSearch(val: editConfig): void {}

    public formoption(val: string, name: string, key: number) {
        this.formoptions.forEach((elem: formConfig) => {
            if (val === 'relatedContract') {
                this.form.setFields({
                    'isAutoRenew': undefined,
                    'renewDate': undefined
                })
                this.low = !name;
                elem.name === 'isAutoRenew' && (elem.disabled = true);
                elem.name === 'renewDate' && (elem.disabled = true);
                this.form.setFieldsValue({
                    renewDate: undefined
                })
                if (!name) {
                    this.form.setFields({
                        'isAutoRenew': undefined,
                        'renewDate': undefined
                    })
                    elem.name === 'isAutoRenew' && (elem.disabled = false);
                    elem.name === 'renewDate' && (elem.disabled = true);
                    this.form.setFieldsValue({
                        priority: 'High',
                    })
                }
            }
            if (val === 'isAutoRenew' && !name) return
            if (val === 'isAutoRenew' && name === 'Yes') {
                this.form.setFields({
                    'relatedContract': undefined,
                    'renewDate': undefined
                })
                this.form.setFieldsValue({
                    'renewDate': moment('2099-12-31'),
                    'relatedContract': undefined
                })
                elem.name === 'relatedContract' && (elem.disabled = true);
                elem.name === 'renewDate' && (elem.disabled = false, elem.required = true);
            } else if (val === 'isAutoRenew' && name === 'No') {
                this.form.setFields({
                    'relatedContract': undefined,
                    'renewDate': undefined
                })
                elem.name === 'relatedContract' && (elem.disabled = false);
                elem.name === 'renewDate' && (elem.disabled = true, elem.required = false);
                this.form.setFieldsValue({
                    'renewDate': undefined,
                    'relatedContract': undefined
                })
            } else if (val === 'isAutoRenew' && !name) {
                this.form.setFields({
                    'relatedContract': undefined,
                    'renewDate': undefined
                })
                elem.name === 'relatedContract' && (elem.disabled = false);
                elem.name === 'renewDate' && (elem.disabled = false, elem.required = false);
                this.form.setFieldsValue({
                    renewDate: undefined,
                    'relatedContract': undefined
                })
            }
        })
    }
    public onChange(val: string, date: object, name: string)  {
        let beg = this.form.getFieldsValue()
        if (!!beg.beginDate && val === 'endDate' && moment(beg.beginDate).startOf('days') > moment(date).endOf('days')) {
            this.form.setFieldsValue({
                'endDate': undefined
            })
            return this.$message.warning('结束日期不能小于开始日期');
        }
        if (!!beg.endDate && val === 'beginDate' && moment(beg.endDate).endOf('days') < moment(date).startOf('days')) {
            this.form.setFieldsValue({
                'beginDate': undefined
            })
            return this.$message.warning('开始日期不能大于结束日期');
        }
        if (!!beg.endDate && val === 'renewDate' && moment(date).startOf('days') < moment(beg.endDate).endOf('days')) {
            this.form.setFieldsValue({
                'renewDate': undefined
            })
            return this.$message.warning('续期时间不能小于结束日期');
        }
    }
    public onTags(values: string[]) {}
    public created(): void {
        Vue.prototype.checkDetails = (): boolean => {
            let data = this.form.getFieldsValue()
            let isCheckStatus: boolean = true
            if (!data.accountName) return this.checkErrorTips('Contract Details', ' 未选用户姓名'), isCheckStatus = false
            if (!data.contractName) return this.checkErrorTips('Contract Details', ' 未输入合同'), isCheckStatus = false
            if (!data.configServiceNameList.length) return this.checkErrorTips('Contract Details', ' 未选server'), isCheckStatus = false
            if (!data.priority) return this.checkErrorTips('Contract Details', ' 未选优先级'), isCheckStatus = false
            if (!data.beginDate) return this.checkErrorTips('Contract Details', ' 未选周期开始时间'), isCheckStatus = false
            if (!data.endDate) return this.checkErrorTips('Contract Details', ' 未选周期结束时间'), isCheckStatus = false
            if (!!data.beginDate && moment(data.beginDate._d).startOf('days') > moment(data.endDate._d).endOf('days')) {
                return this.checkErrorTips('Contract Details', '结束日期不能小于开始日期'), isCheckStatus = false;
            }
            console.log('2');
            
            let cheFormoptions = this.formoptions
            for (let i = 0; i < cheFormoptions.length; i++) {
                const element = cheFormoptions[i];
                if (!data[element.name] && element.required) {
                    this.checkErrorTips(element.Tips, ' no data')
                    return isCheckStatus = false
                }
            }
            if (!!data.endDate && moment(data.endDate._d).endOf('days') < moment(data.beginDate._d).startOf('days')) {
                return this.checkErrorTips('Contract Details', '开始日期不能大于结束日期'), isCheckStatus = false;
            }
            return isCheckStatus
        }
        Vue.prototype.setDetails = (): void => {
            this.saveData()
        }
        if (this.contractIndex === 2 && Object.keys(this.editData.contractDetail).length > 1) {
            let detailData = this.editData.contractDetail
            this.formoptions[0].disabled = true
            this.formoptions[1].disabled = true
            this.formoptions[3].disabled = true
            this.formoptions[7].disabled = true
            this.formoptions[8].disabled = true
            this.formoptions[10].disabled = true
            this.formoptions[0].initialValue = detailData.accountName
            this.formoptions[1].initialValue = detailData.contractName
            this.formoptions[2].initialValue = detailData.contractAbbrv
            this.formoptions[3].initialValue = detailData.configServiceNameList.split(',')
            this.formoptions[4].initialValue = detailData.relatedContract
            this.formoptions[5].initialValue = detailData.priority === 10 ? 'High' : 'Low'
            this.formoptions[6].initialValue = detailData.singedDate && moment(detailData.singedDate) || undefined
            this.formoptions[7].initialValue = detailData.beginDate && moment(detailData.beginDate) || undefined
            this.formoptions[8].initialValue = detailData.endDate && moment(detailData.endDate) || undefined
            this.formoptions[9].initialValue = detailData.isAutoRenew == 1 ? 'Yes' : 'No'
            this.formoptions[10].initialValue = detailData.renewDate && moment(detailData.renewDate) || undefined
            this.$nextTick(() => {
                this.formoptions.forEach((elem: formConfig) => {
                    if (detailData.relatedContract) {
                        this.form.setFields({
                            'isAutoRenew': undefined,
                            'renewDate': undefined
                        })
                        this.low = !name;
                        elem.name === 'isAutoRenew' && (elem.disabled = false);
                        elem.name === 'renewDate' && (elem.disabled = true);
                        this.form.setFieldsValue({
                            renewDate: undefined
                        })
                    }
                    if (!detailData.relatedContract) {
                        this.form.setFields({
                            'isAutoRenew': undefined,
                            'renewDate': undefined
                        })
                        elem.name === 'isAutoRenew' && (elem.disabled = false);
                        elem.name === 'renewDate' && (elem.disabled = true);
                        this.form.setFieldsValue({
                            priority: 'High',
                        })
                    }
                    if (detailData.isAutoRenew === 1) {
                        this.form.setFields({
                            'relatedContract': undefined,
                            'renewDate': undefined
                        })
                        this.form.setFieldsValue({
                            'relatedContract': undefined
                        })
                        elem.name === 'relatedContract' && (elem.disabled = true);
                        elem.name === 'renewDate' && (elem.disabled = false, elem.required = true);
                    } else if (detailData.isAutoRenew === 0) {
                        this.form.setFields({
                            'relatedContract': undefined,
                            'renewDate': undefined
                        })
                        this.form.setFieldsValue({
                            // 'relatedContract': undefined,
                            'renewDate': undefined
                        })
                        elem.name === 'relatedContract' && (elem.disabled = false);
                        elem.name === 'renewDate' && (elem.disabled = true, elem.required = false);
                    }
                })
            })
        }
    }
    public deactivated() {
        if(this.closeModel == 'contract') return
        this.saveData()
    }
    public saveData(): void {
        let data: Object = {}
        let concatData: concatDataConfig = {}
        this.form.validateFields((err: string, values: formValueConfig) => {
            if (!err) {
                let newData = JSON.parse(JSON.stringify(values)) //deepClone(values)
                let listData: Object = {}
                if (this.contractIndex === 2) {
                    listData = this.editData.contractDetail
                }
                concatData = values
                concatData.Service = values.configServiceNameList
                concatData.BeginDate = values.beginDate
                concatData.EndDate = values.endDate
                this.mutionContract(concatData)
                if (newData.configServiceNameList) newData.configServiceNameList = newData.configServiceNameList.join(',')
                if (newData.isAutoRenew) {
                    newData.isAutoRenew = newData.isAutoRenew === 'Yes' ? 1 : 0;
                    
                    if (newData.isAutoRenew === 1) {
                        delete listData['relatedContract']
                    }else{
                        if (!this.form.getFieldValue('relatedContract')) {
                            delete listData['relatedContract']
                        }
                        delete listData['renewDate']
                    }
                }
                if (newData.priority) newData.priority = newData.priority === 'High' ? 10 : 1
                if (newData.beginDate) newData.beginDate = newData.beginDate && moment(newData.beginDate).format('YYYY-MM-DD') || undefined
                if (newData.endDate) newData.endDate = newData.endDate && moment(newData.endDate).format('YYYY-MM-DD') || undefined
                if (newData.singedDate) newData.singedDate = newData.singedDate && moment(newData.singedDate).format('YYYY-MM-DD') || undefined
                if (newData.renewDate) newData.renewDate = newData.renewDate && moment(newData.renewDate).format('YYYY-MM-DD') || undefined
                for (const key in newData) {
                    // if (newData[key] !== null && newData[key] !== undefined && newData[key] !== '') {
                        listData[key] = newData[key]
                    // }
                }
                data['contractDetail'] = listData
                console.log('listData',listData);
                console.log('newData',newData);
                console.log('this.editData',this.editData);
                
                // this.mutionContractData(data)
                this.contractData && (this.contractData['contractDetail'] = newData)
            }
        })
    }
    public pickChang(name: string, index: number): void {}
    public checkErrorTips(title: string, content: string): object {
        return this.$error({
            title,
            content
        });
    }
    public activated() {
        /* 本页面校验 */
        getDetailAccounts().then((res: recodeConfig): void => {
            this.formoptions[0]['options'] = res.data
        })
        getDetailService().then((res: recodeConfig): void => {
            this.formoptions[3]['options'] = res.data
        })
    }
}
</script>

<style>
</style>
