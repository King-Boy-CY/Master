<template>
  <div>
    <!-- 高级搜索 -->
    <Advanced-search :formoptions="formOptions"
                     :isChildName="true"
                     allowClear
                     @Submit="SearchOk"
                     :data="contractDatas"
                     childDataKey="contractfoVOList" />
    <!-- 操作栏 -->
    <Table parentKey="id"
           :isFinance="true"
           :isNeedCheck="true"
           :selectedBtn="Formscreening"
           @onSelectClick="activeClick"
           @onSelectAll="onSelectAll"
           @onSelect="onSelect"
           :columns="columns"
           :data="data"
           zebraStripe />
    <!-- Add模态弹出框 -->
    <a-modal centered
             class="edit-modal"
             width="950px"
             :footer="null"
             v-model="visible"
             v-if="visible"
             title="Logging Data"
             @cancel="handleReturn">
      <div class="body">
        <div class="modal-box">
          <form-group :formoptions="baseInfoFormOptions"
                      :span="12"
                      ref="baseInfoFormGroup"
                      class="form-group">
          </form-group>
        </div>
      </div>
      <div style="padding-top: 20px;text-align: center">
        <!-- addAllData -->
        <a-button type="primary"
                  style="border-radius: 50px;min-width: 90px"
                  @click="save">
          Save
        </a-button>
        <a-button @click="handleReturn('Reset')"
                  style="margin-left: 14px;border-color:#1890ff;color:#1890ff;border-radius: 50px;min-width: 90px">
          Return
        </a-button>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import {
  Component
} from "vue-property-decorator";
import {
  State,
  Mutation
} from 'vuex-class'
import {
  AxiosGet,
  AxiosPost,
  AxiosPut
} from '@/api/axios'
// import qs from 'qs'
import {
  deepClone
} from "@/assets/ts/index.ts";
import {
  datas
} from "../../common/ts/Test";

@Component({
  components: {
    AdvancedSearch: resolve => require(["@/common/Advancedsearch/index.vue"], resolve),
    Table: () => import("@/views/Finance/components/Table/index.vue"),
    formGroup: () => import('@/views/Finance/components/form-group/index.vue'),
  }
})
export default class account extends Vue {
  @State('productRatingZoneList') private productRatingZoneList ? : any
  @State('ratePlanObject') private ratePlanObject: any
  @State('contractData') private contractData: any
  @State('productForm') private productForm: any
  @State('detailsId') detailsId: any
  @Mutation('mutionContract') mutionContract: any
  @Mutation('mutionDetailsId') mutionDetailsId: any
  private activeIndex: number = 0;
  private values = {}
  private listBar: any[] = [{
      name: "Contract Details",
      cName: "contractDetials"
    },
    {
      name: "Service",
      cName: "service"
    },
    {
      name: "Cycle",
      cName: "cycle"
    },
    {
      name: "Rate plan",
      cName: "ratePlan"
    },
    // {
    //   name: "Number plan",
    //   cName: "numberPlan"
    // },
    {
      name: "Product",
      cName: "product"
    }
  ];
  private onSelectClick(activeObJ: any, selected: any, selectedData: any) {
    console.log(activeObJ);
    console.log(selected);
    console.log(selectedData);
  }
  private activeIn: number = 0;
  private detailResMsg: any // Detail 页面接口数据
  private productName: any //product 页面数据
  private activeSelect: string = "accounttype";
  private activeSelectEdit: string = "accountEdit";
  private recode: any = {}
  private form: any;
  public columns: any[] = [{
      title: 'Account',
      dataIndex: 'accountName',
      key: 'accountName'
    },
    {
      title: 'Account Abbrv.',
      dataIndex: 'accountAbbrv',
      key: 'accountAbbrv',
    },
    {
      title: 'Type',
      dataIndex: 'accountType',
      key: 'accountType',
      customRender: (value: any, row: any, index: any) => {
        const obj = {
          children: value,
        };
        const find: any = this.accountTypeOptions.find((item: any) => item.value === value)
        if (!find) {
          obj.children = ''
        }
        if (find) {
          obj.children = find.name
        }
        return obj;
      }
    },
    {
      title: 'Time zone Type',
      dataIndex: 'timeZoneType',
      key: 'timeZoneType',
    },
    {
      title: 'Time zone',
      dataIndex: 'timeZone',
      key: 'timeZone',
    },
    {
      title: 'Status',
      dataIndex: 'accountStatus',
      key: 'accountStatus',
      customRender: (value: any, row: any, index: any) => {
        const obj = {
          children: value,
        };
        const find: any = this.accountStatusOptions.find((item: any) => item.value === value)
        if (!find) {
          obj.children = ''
        }
        if (find) {
          obj.children = find.name
        }
        return obj;
      }
    },
    {
      title: 'Company',
      dataIndex: 'companyName',
      key: 'companyName'
    },
    {
      title: 'Credit limit',
      dataIndex: 'cerditLimit',
      key: 'cerditLimit'
    },
    {
      title: 'Deposit',
      dataIndex: 'deposit',
      key: 'deposit'
    },
    {
      title: 'Currency',
      dataIndex: 'currencyType',
      key: 'currencyType',
    },
    {
      title: 'Contact',
      dataIndex: 'contact',
      key: 'contact',
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone'
    },
    {
      title: 'Fax',
      dataIndex: 'fax',
      key: 'fax'
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address'
    },
    {
      title: 'Country',
      dataIndex: 'countryName',
      key: 'countryName'
    },
    {
      title: 'Remark',
      dataIndex: 'remark',
      key: 'remark'
    },
    {
      title: 'Created by',
      dataIndex: 'createdBy',
      key: 'createdBy'
    },
    {
      title: 'Created date',
      dataIndex: 'createdTime',
      key: 'createdTime'
    },
    {
      title: 'Modified by',
      dataIndex: 'modifiedBy',
      key: 'modifiedBy'
    },
    {
      title: 'Last modified',
      dataIndex: 'lastModified',
      key: 'lastModified'
    },
  ];
  private accountTypeOptions: any = [{
    name: 'Vendor',
    value: 1
  }, {
    name: 'Client',
    value: 2
  }, {
    name: 'Bilateral',
    value: 3
  }]
  private accountStatusOptions: any = [{
    name: 'Expired',
    value: 1
  }, {
    name: 'Active',
    value: 2
  }, ]
  private contractDatas: any[] = []
  public data: any[] = [];
  private formOptions: any[] = [{
      Tips: 'Account',
      name: 'accountName',
      showSearch: true,
      required: false,
      type: 'select',
      span: 8,
      labelSpan: 8,
      options: null
    },
    {
      Tips: 'Company',
      name: 'companyName',
      showSearch: true,
      required: false,
      type: 'select',
      span: 8,
      labelSpan: 8,
      options: null
    },
    {
      Tips: 'Status',
      name: 'accountStatus',
      required: false,
      type: 'select',
      span: 8,
      labelSpan: 8,
      options: [{
        name: 'Expired',
        value: 1
      }, {
        name: 'Active',
        value: 2
      }]
    }
  ]

  private baseInfoFormOptions: any[] = [{
      Tips: 'Account',
      decorator: 'accountName',
      required: true,
      type: 'input',
      span: 12,
      labelSpan: 8,
    },
    {
      Tips: 'Account Abbrv.',
      decorator: 'accountAbbrv',
      required: false,
      type: 'input',
      options: null,
      span: 12,
      labelSpan: 8,
    },
    {
      Tips: 'Type',
      decorator: 'accountType',
      initialValue: 'Vendor',
      required:true,
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
      labelSpan: 8,
    },
    {
      Tips: 'company',
      decorator: 'companyName',
      initialValue: '',
      required: true,
      type: 'select',
      options: null,
      span: 12,
      labelSpan: 8,
    },
    {
      Tips: 'Time zone type',
      decorator: 'timeZoneType',
      disabled: false,
      required: true,
      initialValue: 'GMT',
      allowClear: false,
      type: 'select',
      options: [{
        name: "GMT"
      }, {
        name: "DST"
      }],
      span: 12,
      labelSpan: 8,
    },
    {
      Tips: 'Timezone',
      decorator: 'timeZone',
      disabled: false,
      required: true,
      initialValue: '+0800',
      allowClear: false,
      type: 'input',
      options: null,
      span: 12,
      labelSpan: 8,
    },
    {
      Tips: 'Status',
      decorator: 'accountStatus',
      disabled: false,
      required: true,
      allowClear: false,
      type: 'select',
      span: 12,
      labelSpan: 8,
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
      decorator: 'cerditLimit',
      disabled: false,
      required: false,
      initialValue: '',
      allowClear: false,
      type: 'input',
      options: null,
      span: 12,
      labelSpan: 8,
    },
    {
      Tips: 'Deposit',
      decorator: 'deposit',
      disabled: false,
      required: false,
      initialValue: '',
      allowClear: false,
      type: 'input',
      options: null,
      span: 12,
      labelSpan: 8,
    },
    {
      Tips: 'Currency',
      decorator: 'currencyType',
      disabled: false,
      required: false,
      initialValue: 'USD',
      allowClear: false,
      type: 'select',
      options: null,
      span: 12,
      labelSpan: 8,
    },
    {
      Tips: 'Contact',
      decorator: 'contact',
      disabled: false,
      initialValue: '',
      required: false,
      allowClear: false,
      type: 'input',
      options: null,
      span: 12,
      labelSpan: 8,
    },
    {
      Tips: 'Title',
      decorator: 'title',
      disabled: false,
      initialValue: '',
      required: false,
      allowClear: false,
      type: 'input',
      options: null,
      span: 12,
      labelSpan: 8,
    },
    {
      Tips: 'Phone',
      decorator: 'phone',
      disabled: false,
      initialValue: '',
      required: false,
      allowClear: false,
      type: 'input',
      options: null,
      span: 12,
      labelSpan: 8,
    },
    {
      Tips: 'Fax',
      decorator: 'fax',
      disabled: false,
      required: false,
      initialValue: '',
      allowClear: false,
      type: 'input',
      options: null,
      span: 12,
      labelSpan: 8,
    },
    {
      Tips: 'Country',
      decorator: 'countryName',
      disabled: false,
      required: false,
      initialValue: '',
      allowClear: false,
      type: 'select',
      options: null,
      span: 12,
      labelSpan: 8,
    },
    {
      Tips: 'Address',
      decorator: 'address',
      disabled: false,
      initialValue: '',
      required: false,
      type: 'input',
      options: null,
      // span: 24,
      // colSpan: 3,
      span: 24,
      labelSpan: 4,
      wrapperSpan: 19,
      isAlign: true
    },
    {
      Tips: 'Remark',
      decorator: 'remark',
      disabled: false,
      initialValue: '',
      required: false,
      type: 'input',
      options: null,
      // span: 24,
      // colSpan: 3,
      // offset: -1，
      span: 24,
      labelSpan: 4,
      wrapperSpan: 19,
      isAlign: true
    },
  ]
  /* Add 选项卡 */
  public active(tab: any, item: any) {
    this.activeIn = tab;
    this.activeSelect = item;
  }
  private Formscreening: any[] = [{
      name: "Add",
      icon: "plus-circle",
      index: 1
    },
    {
      name: "Edit",
      icon: "form",
      index: 2,
      disabled: true,
      tips: 'Please select only one record to proceed'
    },
    {
      name: "Export",
      icon: "export",
      index: 3
    }
  ];
  public prouccDatiletias(selectedRows: any) {
    if (!selectedRows.length) {
      this.Formscreening[1].disabled = true
      this.Formscreening[1].tips = "Please select only one record to proceed"
      return false
    }
    if (selectedRows[0].accountStatus === 1) {
      this.Formscreening[1].disabled = true;
      this.Formscreening[1].tips = "Records with Status 'Invalid'   can NOT be edited";
      return
    } else if (selectedRows[0].accountStatus === 2) {
      this.Formscreening[1].disabled = false;
      this.Formscreening[1].tips = "";
    }
    if (selectedRows.length > 1) {
      this.Formscreening[1].disabled = true;
      this.Formscreening[1].tips = "Please select only one record to proceed";
      return false;
    } else {
      this.Formscreening[1].disabled = false
      this.Formscreening[1].tips = ""
    }
  }
  // private activeIndex:any = ''
  // private contractStatus: string[] = ['expired', 'active', 'future', 'invalid'];
  // private contractType: string[] = ['draft', 'processing', 'refused','approved']
  // 高级搜索  Search  -  >  回调
  /* 用户手动选择/取消选择所有列的回调  Table -> 回调  */
  public onSelectAll(selected: any, selectedRows: any, changeRows: any) {
    // console.log(selected, selectedRows, changeRows);
    this.values = deepClone(selectedRows)
    this.prouccDatiletias(selectedRows)
  }
  public onSelect(record: any, selected: boolean, selectedRows: any) {
    record = selectedRows[0]
    this.values = deepClone(selectedRows)
    // console.log(99999999);
    this.prouccDatiletias(selectedRows)

  }
  /* 点击切换页 分页(pagination) -> 回调 */
  public onChang(pageSize: number) {
    // console.log(pageSize)
  }
  public getTable(data:any) :void{
    AxiosGet('/config/accounts', data).then((res: any) => {
      this.data = res.data
    })
  }
   private  created () {
    AxiosGet("/config/droplist/accounts").then((res: any) => {
      this.formOptions[0]['options'] = res.data
    })
    AxiosGet("/config/droplist/companies").then((res: any) => {
      this.formOptions[1]['options'] = res.data
    })
    AxiosGet("/config/droplist/accounts").then((res: any) => {
      this.baseInfoFormOptions[0]['options'] = res.data
    })
    AxiosGet("/config/droplist/companies").then((res: any) => {
      this.baseInfoFormOptions[3]['options'] = res.data
    })
    AxiosGet("/config/droplist/currencys").then((res: any) => {
      this.baseInfoFormOptions[9]['options'] = res.data
    })
    AxiosGet("/config/droplist/countries").then((res: any) => {
      this.baseInfoFormOptions[14]['options'] = res.data
    })
    // (async ()=>{
    //   const data = await Promise.all([
    //     "/config/droplist/accounts",
    //     "/config/droplist/companies",
    //     "/config/droplist/accounts",
    //     "/config/droplist/companies",
    //     "/config/droplist/currencys",
    //     "/config/droplist/countries"
    //   ].map(
    //     (url:string)=>AxiosGet(url).catch(
    //       (err:any)=>{
    //         console.log(err);
    //       }
    //     )
    //   )
    // );
    // this.formOptions[0]['options']= data[0].data
    // this.formOptions[1]['options'] = data[1].data
    //  this.baseInfoFormOptions[0]['options'] = data[2].data
    //   this.baseInfoFormOptions[3]['options'] = data[3].data
    //    this.baseInfoFormOptions[9]['options'] = data[4].data
    //     this.baseInfoFormOptions[14]['options'] = data[5].data

    // })()
  }
  /* 获取新增合同所有数据 */
  public addAllData(values: any) {
    let that: any = this
    const baseInfoFormGroup: any = this.$refs.baseInfoFormGroup
    const data: any = baseInfoFormGroup.validateFields()
    // data.id = this.values[0].id;
    if (data) {
      // 检验通过
      console.log(data);
      let reg= /^[+-]((0[0-9]|1[01])[0-5][0-9]|1200)$/;
      let rs = reg.test(data.timeZone);
      console.log(rs);
      if (!rs) {
        return this.$message.error(' Invalid format for TimeZone')
      }
    }
    let concatData: any = {}
    console.log('values', values);
    concatData = values
    concatData.Account = values.accountName
    console.log(data);
    this.baseInfoFormOptions[2]['options'].forEach((element:any) => {
      if (data['accountType'] === element.name) {
        data['accountType'] = element.value
      }
    });
    this.baseInfoFormOptions[6]['options'].forEach((element:any) => {
      if (data['accountStatus'] === element.name) {
        data['accountStatus'] = element.value
      }
    });
    // data[]
    // console.log('formOptions', formOptions)
    // qs.stringify(this.$refs.editRef.form.getFieldsValue())
    AxiosPost('/config/accounts', data).then((res:any) => {
      if (res.code >= 0) {
        this.visible = !this.visible;
        that.getTable();
      }
      if (res.code != 1) {
        return this.$message.warning(res.msg);
      }
    })
    // console.log(this.ratePlanObject);
    let CommitmentUnit = ['Secs', 'Mins', 'Quarters', 'Call', 'User']
    // console.log('changeFrom', this.form.getFieldsValue())
    // console.log('ratePlanList', this.ratePlanObject);
    let ratePlanList: any = []
    // console.log('this.ratePlanObject',this.ratePlanObject);
    for (let i = 0; i < this.ratePlanObject.length; i++) {
      const element = this.ratePlanObject[i];
      ratePlanList.push({
        productList: [],
        ratePlanName: ''
      })
      for (let index = 0; index < element.tabs.length; index++) {
        const elem = element.tabs[index];
        const {
          baseForm,
          ZoneForm,
          ratingForm
        } = this.productForm.processingForm.get(String(elem.sourceUni))

      }
    }
    for (let i = 0; i < this.ratePlanObject.length; ++i) {
      const elem = this.ratePlanObject[i];
    }
  }
  public editllData(values: any): void {
    // console.log('this.detailsId', this.detailsId, this.values);
    let that: any = this
    const baseInfoFormGroup: any = this.$refs.baseInfoFormGroup
    const data: any = baseInfoFormGroup.validateFields()
    let re = /^[+-]((0[0-9]|1[01])[0-5][0-9]|1200)$/;
    data.id = that.values[0].id;
    let rs = re.test(data.timeZone);
    if (!rs) {
      return that.$message.error('Invalid format for TimeZone')
    }
    let concatData: any = {}
    this.baseInfoFormOptions[2]['options'].forEach((element:any) => {
      if (data['accountType'] === element.name) {
        data['accountType'] = element.value
      }
    });
    this.baseInfoFormOptions[6]['options'].forEach((element:any) => {
      if (data['accountStatus'] === element.name) {
        data['accountStatus'] = element.value
      }
    });
    console.log('data', data, this.recode)
    // qs.stringify(this.$refs.editRef.form.getFieldsValue())
    AxiosPut('/config/accounts', data).then((res) => {
      //         res.data.forEach((item: any, index: number)=>{
      //     item['id'] = index    
      //    })
      console.log(res.data)
      if (res.code >= 0) {
        this.visible = !this.visible
        that.getTable()
      }
      if (res.code != 1) {
        return this.$message.warning(res.msg);
      }
    })
  }
  /* 操作栏点击 -> 回调 */
  public SearchOk(values: any): void {
    let data: any = {
      params: Object.assign({}, values, {})
    }
    this.getTable(data)
  }
  private visible: boolean = false
  // activeObJ: any, selected: any, selectedData: any
  public async activeClick({
    name,
    index
  }: any, selected: any, selectedData: any) {
    let that:any= this
    if (index == 2) {
      setTimeout(() => {
        console.log(that.values[0], 'values');
        const baseInfoFormGroup: any = this.$refs.baseInfoFormGroup
        for (const key in that.values[0]) {
          if (key === 'accountType' && !!Number(that.values[0][key])) {
            that.values[0][key] = ['Vendor', 'Client', 'Bilateral'][that.values[0][key] - 1]
          }
          if (key === 'accountStatus' && !!Number(that.values[0][key])) {
            that.values[0][key] = ['Expired', 'Active'][that.values[0][key] - 1]
          }
        }
        baseInfoFormGroup.setFieldsValue(that.values[0])
      },200)
    }
    index !== 3 && (this.visible = !this.visible) && (this.activeIndex = index);
  }

  private save() {
    const baseInfoFormGroup: any = this.$refs.baseInfoFormGroup
    const data: object = baseInfoFormGroup.getFieldsValue()
    if (this.activeIndex == 1) {
      this.addAllData(data)
    } else if (this.activeIndex == 2) {
      this.editllData(data)
    }
  }
  private tableSelectObj: any = {}
  private sendProduct: any = {}
  private ids: string = ''
  /* 校验所有 */
  handlesaveAll() {
    // console.log("校验开始");
  }
  /* 退出 */
  handleReturn() {
    this.Screencover();
  }
  /* 关闭 Add */
  public Screencover() {
    this.visible = !this.visible;
  }
}
</script>

<style lang="scss">
@import '@/views/Finance/common/css/deep-modal.scss';
</style><style lang="scss" scoped>
@import '@/views/Finance/common/css/modal.scss';
</style>
