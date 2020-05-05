<template>
<div>
    <div id="components-form-demo-advanced-search">
        <div class="formoptions">
            <a :style="{ marginLeft: '8px', fontSize: '18px' }" @click="toggle">
            </a>
        </div>
        <a-form class="ant-advanced-search-form" :form="form" @submit="handleSearch" v-show="expand">
            <a-row>
                <a-col :span="item.span || span" v-for="(item,key) in formoptions" :key="key">
                    <a-form-item :label="item.Tips" :colon="false" :labelCol="{ span: item.colSpan || colSpan,offset: item.offset || 1 }" :hasFeedback="false">
                        <a-select @change="handleChange(item.name,$event,key)" @dropdownVisibleChange="dropdownVisibleChange(item.name,$event,key)" :getPopupContainer=" e=>e.parentNode" v-if="item.type==='select'" allowClear :disabled="item.disabled" v-decorator="[
                                `${item.name}`,
                                {
                                    initialValue:item.initialValue,
                                    rules: [{
                                        required: item.required,
                                        message: `${item.Tips} field should be no-null`,
                                    }],
                                }
                            ]" :placeholder="isPlaceholder?item.Tips:''">
                            <a-select-option :value="child.name || child" v-for="(child,key) in item.options" :key="key" :disabled="( child.name || child) ==='Low'&& low ">
                                {{child.name || child}}
                            </a-select-option>
                        </a-select>
                        <a-date-picker @click="pickChang(item.name,key)" :disabled="item.disabled" v-if="item.type === 'picker'" :getCalendarContainer="e => e.parentNode" v-decorator="[
                            `${item.name}`,
                            {
                              rules: [{
                                required: item.required,
                                message: `${item.Tips} field should be no-null`,
                              }]
                            }
                        ]" @change="onChange(item.name,$event,key)" style="width:100%" placeholder="YYYY-MM-DD" format="YYYY-MM-DD" />
                        <a-input :placeholder="isPlaceholder?item.Tips:''" :disabled="item.disabled" :checked="item.isSelect" v-else-if="item.type === 'input'" :getPopupContainer=" e => e.parentNode" v-decorator="[
                            `${item.name}`,
                            {
                                rules: [{
                                    required: item.required,
                                    message: `${item.Tips} field should be no-null`
                                }],
                            }
                        ]" />
                        <a-select mode="multiple" :maxTagCount="1" :getPopupContainer=" e => e.parentNode" v-decorator="[
                                      `${item.name}`,
                                      {
                                        rules: [{
                                          required: item.required,
                                          message: `${item.Tips} field should be no-null`,
                                        }],
                                      }
                                    ]" :placeholder="isPlaceholder?item.Tips:''" @click=" handleChange(item.name, key, child.name)" v-else-if=" item. type === 'tags'">
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
    Prop,
    Watch
} from 'vue-property-decorator'
import {
    Mutation
} from 'vuex-class'
import {
    AxiosGet,
    AxiosPut
} from '@/api/axios'
import moment from 'moment'
@Component({
    components: {
        selectInput: resolve => require(['@/common/selectInput/index.vue'], resolve)
    }
})
export default class Home extends Vue {
    @Mutation('mutionContract') mutionContract: any
    @Mutation('mutionContractData') mutionContractData: any
    @Prop(Object) private values: any
    @Prop() private currentProductData: any
    @Prop(Boolean) private isPlaceholder?: boolean // 是否需要使用 Placeholder 

    private low: boolean = true;
    private autoRenew: boolean = true;
    private singedDate: boolean = true;
    private relatedContract: boolean = true;
    private placeholder: any = {};
    private date: any = {}
    private form: any;
    private expand: boolean = true
    public beforeCreate(): void {
        let that: any = this
        this.form = that.$form.createForm(this);
    }
    private accountStatusOptions: any = [{
        name: 'Expired',
        value: 1
    }, {
        name: 'Active',
        value: 2
    }, ]
    //  @Prop(Array) formoptions?:any
    @Prop({
        type: Number,
        default: 8
    }) span ? : number
    private formoptions: any[] = [{
            Tips: 'Account',
            name: 'accountName',
            required: true,
            type: 'input',
            span: 12,
            colSpan: 6,
            offset: -1
        },
        {
            Tips: 'Account Abbrv.',
            name: 'accountAbbrv',
            required: false,
            type: 'input',
            options: null,
            span: 12,
            colSpan: 6
        },
        {
            Tips: 'Type',
            name: 'accountType',
            initialValue: 'Vendor',
            required: false,
            type: 'select',
            options: [{
                name: "Vendor",
                value: 1
            }, {
                name: "Client",
                value: 2, 
            }, {
                name: "Bilateral",
                value: 3
            }],
            span: 12,
            colSpan: 6,
            offset: -1
        },
        {
            Tips: 'company',
            name: 'companyName',
            initialValue: '',
            required: true,
            type: 'select',
            options: null,
            span: 12,
            colSpan: 6
        },
        {
            Tips: 'Time zone type',
            name: 'timeZoneType',
            disabled: false,
            required: true,
            initialValue: '',
            allowClear: false,
            type: 'select',
            options: [{
                name: "GMT"
            }, {
                name: "DST"
            }],
            span: 12,
            colSpan: 6,
            offset: -1
        },
        {
            Tips: 'Timezone',
            name: 'timeZone',
            disabled: false,
            required: true,
            initialValue: '',
            allowClear: false,
            type: 'input',
            options: null,
            span: 12,
            colSpan: 6
        },
        {
            Tips: 'Status',
            name: 'accountStatus',
            disabled: false,
            required: true,
            allowClear: false,
            type: 'select',
            span: 12,
            colSpan: 6,
            offset: -1,
            options: [{
                name: 'Expired',
                value: 1
            }, {
                name: 'Active',
                value: 2
            }],
        },
        {
            Tips: 'Credit limit',
            name: 'cerditLimit',
            disabled: false,
            required: false,
            initialValue: '',
            allowClear: false,
            type: 'input',
            options: null,
            span: 12,
            colSpan: 6
        },
        {
            Tips: 'Deposit',
            name: 'deposit',
            disabled: false,
            required: false,
            initialValue: '',
            allowClear: false,
            type: 'input',
            options: null,
            span: 12,
            colSpan: 6,
            offset: -1
        },
        {
            Tips: 'Currency',
            name: 'currencyType',
            disabled: false,
            required: false,
            initialValue: '',
            allowClear: false,
            type: 'select',
            options: null,
            span: 12,
            colSpan: 6
        },
        {
            Tips: 'Contact',
            name: 'contact',
            disabled: false,
            initialValue: '',
            required: false,
            allowClear: false,
            type: 'input',
            options: null,
            span: 12,
            colSpan: 6,
            offset: -1
        },
        {
            Tips: 'Title',
            name: 'title',
            disabled: false,
            initialValue: '',
            required: false,
            allowClear: false,
            type: 'input',
            options: null,
            span: 12,
            colSpan: 6,
        },
        {
            Tips: 'Phone',
            name: 'phone',
            disabled: false,
            initialValue: '',
            required: false,
            allowClear: false,
            type: 'input',
            options: null,
            span: 12,
            colSpan: 6,
            offset: -1
        },
        {
            Tips: 'Fax',
            name: 'fax',
            disabled: false,
            required: false,
            initialValue: '',
            allowClear: false,
            type: 'input',
            options: null,
            span: 12,
            colSpan: 6,
        },
        {
            Tips: 'Country',
            name: 'countryName',
            disabled: false,
            required: false,
            initialValue: '',
            allowClear: false,
            type: 'select',
            options: null,
            span: 12,
            colSpan: 6,
            offset: -1
        },
        {
            Tips: 'Address',
            name: 'address',
            disabled: false,
            initialValue: '',
            required: false,
            type: 'input',
            options: null,
            span: 24,
            colSpan: 3,
            offset: -1
        },
        {
            Tips: 'Remark',
            name: 'remark',
            disabled: false,
            initialValue: '',
            required: false,
            type: 'input',
            options: null,
            span: 24,
            colSpan: 3,
            offset: -1
        },
    ]
    /* 下拉按下触发 */
    public dropdownVisibleChange(name: string, open: boolean, key: number) {
        if (open && name === 'relatedContract' && this.form.getFieldValue('configServiceNameList') && this.form.getFieldValue('accountName')) {
            let data = {
                params: {
                    accountName: this.form.getFieldValue('accountName'),
                    serviceNameList: this.form.getFieldValue('configServiceNameList').join(', ')
                }
            }
        }
    }
    /* 下拉选中 */
    public handleChange(val: any, name: string, key: number) {
        this.formoption(val, name, key)
        console.log("1")
        console.log('val', val, 'name', name, );
    }
    public crearChange(val: any, name: string, key: number) {
        this.formoption(val, name, key)
    }
    public handleSearch(val: any) {}
    public toggle(val: any) {

    }
    public formoption(val: any, name: string, key: number) {}
    public onChange(val: any, date: any, name: string) {}
    public onTags(values: string[]) {}
    public deactivated() {
        let data: any = {}
        let concatData: any = {}
        this.form.validateFields((err: any, values: any) => {
            if (!err) {
                console.log('values', values);
                concatData = values
                concatData.Service = values.configServiceNameList
                concatData.BeginDate = values.beginDate
                concatData.EndDate = values.endDate
                this.mutionContract(concatData)
                values.configServiceNameList = values.configServiceNameList.join(', ')
                values.isAutoRenew = values.isAutoRenew === 'Yes' ? 1 : 2
                values.priority = values.priority === 'Yes' ? 1 : 2
                data['contractDetail'] = values
                this.mutionContractData(data)
            }
        })
    }
    public pickChang(name: string, index: number) {}
    public activated() {
        this.$nextTick(() => {
            for (const key in this.values[0]) {
                if (key === 'accountType' && !!Number(this.values[0][key])) {
                    this.values[0][key] = ['Vendor', 'Client', 'Bilateral'][this.values[0][key] - 1]
                }
                if (key === 'accountStatus' && !!Number(this.values[0][key])) {
                    this.values[0][key] = ['Expired', 'Active'][this.values[0][key] - 1]
                }
                this.form.setFieldsValue({
                    [key]: this.values[0][key]
                })
            }
        })
        AxiosGet("/config/droplist/accounts").then((res: any) => {
            this.formoptions[0]['options'] = res.data
        })
        AxiosGet("/config/droplist/currencys").then((res: any) => {
            this.formoptions[9]['options'] = res.data
        })
        AxiosGet("/config/droplist/companies").then((res: any) => {
            this.formoptions[3]['options'] = res.data
        })
        AxiosGet("/config/droplist/countries").then((res: any) => {
            this.formoptions[14]['options'] = res.data
        })
    }
}
</script>

<style>
</style>
