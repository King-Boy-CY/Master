<template>
  <div>
    <div id="components-form-demo-advanced-search">
      <div class="formoptions">
        <a :style="{ marginLeft: '8px', fontSize: '18px' }"
           @click="toggle">
        </a>
      </div>
      <a-form class="ant-advanced-search-form"
              :form="form"
              @submit="handleSearch"
              v-show="expand">
        <a-row>
          <a-col :span="item.span || span"
                 v-for="(item,key) in formoptions"
                 :key="key">
            <a-form-item :label="item.Tips"
                         :colon="false"
                         :labelCol="{ span: item.colSpan || colSpan,offset: item.offset || 1 }"
                         :hasFeedback="false">
              <a-select @change="handleChange(item.name,$event,key)"
                        @dropdownVisibleChange="dropdownVisibleChange(item.name,$event,key)"
                        :getPopupContainer=" e=>e.parentNode"
                        v-if="item.type==='select'"
                        allowClear
                        :disabled="item.disabled"
                        v-decorator="[
                                `${item.name}`,
                                {
                                    initialValue:item.initialValue,
                                    rules: [{
                                        required: item.required,
                                        message: `${item.Tips} field should be no-null`,
                                    }],
                                }
                            ]"
                        :placeholder="isPlaceholder?item.name:''">
                <a-select-option :value="child.name || child"
                                 v-for="(child,key) in item.options"
                                 :key="key"
                                 :disabled="( child.name || child) ==='Low'&& low ">
                  {{child.name || child}}
                </a-select-option>
              </a-select>
              <a-date-picker @click="pickChang(item.name,key)"
                             :disabled="item.disabled"
                             v-if="item.type === 'picker'"
                             :getCalendarContainer="e => e.parentNode"
                             v-decorator="[
                            `${item.name}`,
                            {
                              rules: [{
                                required: item.required,
                                message: `${item.Tips} field should be no-null`,
                              }]
                            }
                        ]"
                             @change="onChange(item.name,$event,key)"
                             style="width:100%"
                             placeholder="YYYY-MM-DD"
                             format="YYYY-MM-DD" />
              <a-input :placeholder="isPlaceholder?item.decorator:''"
                       :disabled="item.disabled"
                       v-else-if="item.type === 'input'"
                       :getPopupContainer=" e => e.parentNode"
                       v-decorator="[
                            `${item.name}`,
                            {
                                rules: [{
                                    required: item.required,
                                    message: `${item.Tips} field should be no-null`
                                }],
                            }
                        ]" />
              <a-select mode="multiple"
              :maxTagCount="1"
                        :getPopupContainer=" e => e.parentNode"
                        v-decorator="[
                                      `${item.name}`,
                                      {
                                        rules: [{
                                          required: item.required,
                                          message: `${item.Tips} field should be no-null`,
                                        }],
                                      }
                                    ]"
                        :placeholder="isPlaceholder?Service:''"
                        @click=" handleChange(item.name, key, child.name)"
                        v-else-if=" item. type === 'tags'">
                <a-select-option v-for=" (itn,index) in item.options"
                                 :value="itn.name || itn"
                                 :key="index">
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
  Mutation
} from 'vuex-class'
import {
  AxiosGet
} from '@/api/axios'
import moment from 'moment'
import { rateStructure } from '../../filter';

@Component({
  components: {
    selectInput: resolve => require(['@/common/selectInput/index.vue'], resolve)
  }
})
export default class Home extends Vue {
    @Mutation('mutionContract') mutionContract: any
    @Mutation('mutionContractData') mutionContractData: any
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
            options: null,
            span:12,
            colSpan:6,
             offset:-1
        },
        {
            Tips: 'Account Abbrv.',
            name: 'accountAbbrv',
            required: false,
            type: 'input',
            options: null,
            span:12,
            colSpan:6
        },
        {
            Tips: 'Type',
            name: 'accountType',
            required: false,
            initialValue:'Vendor',
            type: 'select',
            span:12,
            colSpan:6,
            offset:-1,
            options: [{
                name:"Vendor",
                value:1
            },{
                name:"Client",
                value:2,
            },{
                name:"Bilateral",
                value:3
            }],
        },
        {
            Tips: 'company',
            name: 'companyName',
            required: true,
            type: 'select',
            options: null,
            span:12,
              colSpan:6
        },
          {
            Tips: 'Time zone type',
            name: 'timeZoneType',
            disabled: false,
            required: true,
            initialValue:'GMT',
            type: 'select',
            options: [{
                name:"GMT",
                value:1
            },{
                name:"DST",
                value:2
            }],
            span:12,
            colSpan:6,
             offset:-1
        },
          {
            Tips: 'Timezone',
            name: 'timeZone',
            disabled: false,
            required: true,
            type: 'input',
            options: null,
            span:12,
            colSpan:6
        },
         {
            Tips: 'Status',
            name: 'accountStatus',
            disabled: false,
            required: true,
            type: 'select',
            options:[{
                name:"Expired",
                value:1
            },{
                name:"Active",
                value:2
            }],
            span:12,
            colSpan:6,
             offset:-1
        },
         {
            Tips: 'Credit limit',
            name: 'cerditLimit',
            disabled: false,
            required: false,
            type: 'input',
            options: null,
            span:12,
              colSpan:6
        },
         {
            Tips: 'Deposit',
            name: 'deposit',
            disabled: false,
            required: false,
            type: 'input',
            options: null,
            span:12,
            colSpan:6,
             offset:-1
        },
        {
            Tips: 'Currency',
            name: 'currencyType',
            disabled: false,
            required: false,
            initialValue:'USD',
            type: 'select',
            options: null,
            span:12,
            colSpan:6
        },
         {
            Tips: 'Contact',
            name: 'contact',
            disabled: false,
            required: false,
            type: 'input',
            options: null,
            span:12,
            colSpan:6,
            offset:-1
        },
         {
            Tips: 'Title',
            name: 'title',
            disabled: false,
            required: false,
            type: 'input',
            options: null,
            span:12,
            colSpan:6,

        },
         {
            Tips: 'Phone',
            name: 'phone',
            disabled: false,
            required: false,
            type: 'input',
            options: null,
            span:12,
           colSpan:6,
            offset:-1
        },
         {
            Tips: 'Fax',
            name: 'fax',
            disabled: false,
            required: false,
            type: 'input',
            options: null,
            span:12,
            colSpan:6,
        },
         {
            Tips: 'Country',
            name: 'countryName',
            disabled: false,
            required: false,
            type: 'select',
            options: null,
            span:12,
            colSpan:6,
             offset:-1
        },
         {
            Tips: 'Address',
            name: 'address',
            disabled: false,
            required: false,
            type: 'input',
            options: null,
            span:24,
            colSpan:3,
             offset:-1
        },
         {
            Tips: 'Remark',
            name: 'remark',
            disabled: false,
            required: false,
            type: 'input',
            options: null,
            span:24,
            colSpan:3,
            offset:-1
        },
  ]
  /* 下拉按下触发 */
  public dropdownVisibleChange(name: string, open: boolean, key: number) {
    if (open && name === 'relatedContract' && this.form.getFieldValue('configServiceNameList') && this.form.getFieldValue('accountName')) {
      let data = {
        params: {
          accountName: this.form.getFieldValue('accountName'),
          serviceNameList: this.form.getFieldValue('configServiceNameList').join(','),
          contractName: this.form.getFieldValue('contractName')
        }
      }
      AxiosGet("/config/droplist/relatedContracts", data).then((res: any) => {
        this.formoptions[4]['options'] = res.data
      })
    }
  }
  /* 下拉选中 */
  public handleChange(val: any, name: string, key: number) {
    this.formoption(val, name, key)
    console.log('val', val, 'name', name, );
  }
  public crearChange(val: any, name: string, key: number) {
    this.formoption(val, name, key)
  }
  public handleSearch(val: any) {}
  public toggle(val: any) {
  }
  public formoption(val: any, name: string, key: number) {
  }
  public onChange(val: any, date: any, name: string) {
  }
  public onTags(values: string[]) {}
  public deactivated() {
    let data:any = {}
    let concatData:any = {}
    this.form.validateFields((err: any, values: any) => {
      if (!err) {
     }
    })
  }
  public pickChang(name: string, index: number) {}
  public activated() {

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
