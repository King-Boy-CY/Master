<template>
  <div>
    <Advanced-search ref="searchref"
                     :formoptions="formOptions"
                     :isChildName="true"
                     @Submit="SearchOk"
                     allowClear
                     childDataKey="contractfoVOList"></Advanced-search>
    <!-- :data="contractDatas" -->
    <Table parentKey="id"
           :isFinance="true"
           :scrollX="1200"
           :isTableHeight="true"
           :isNeedCheck="true"
           @onSelectAll="onSelectAll"
           @onSelect="onSelect"
           :columns="columns"
           :data="data"
           zebraStripe />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  Component,
  Emit
} from "vue-property-decorator"
import {
  AxiosGet,
} from '@/api/axios'
@Component({
  components: {
    AdvancedSearch: resolve => require(["@/common/Advancedsearch/index.vue"], resolve),
    Table: () => import("@/views/Finance/components/Table/index.vue"),
  }
})
export default class insertRecord extends Vue {
  @Emit('confirmData') confirmData(msg ? : any) {}
  private formOptions: any[] = [{
      Tips: 'Account',
      name: 'accountName',
      required: false,
      type: 'select',
      span: 8,
      options: null
    },
    {
      Tips: 'Service',
      name: 'configServiceName',
      required: false,
      type: 'select',
      span: 8,
      options: null
    },
    {
      Tips: 'Direction',
      name: 'direction',
      required: false,
      type: 'select',
      span: 8,
      options: [{
        name: 'Inbound',
        value: 1
      }, {
        name: 'Outbound',
        value: 2
      }]
    },
    {
      Tips: 'NumberPlanType',
      name: 'numberPlanType',
      required: false,
      type: 'select',
      showSearch: true,
      span: 8,
      options: [{
        name: 'Hubbing',
        value: 1
      }, {
        name: 'VC',
        value: 2
      }, {
        name: 'Reference',
        value: 3
      }]
    },
    {
      Tips: 'Destination',
      name: 'destinationNames',
      required: false,
      type: 'tags',
      span: 8,
      options: null
    },
    {
      Tips: 'Country name',
      name: 'countryName',
      required: false,
      type: 'select',
      span: 8,
      options: [{
        name: 'Mobile',
        value: 1
      }, {
        name: 'Fixed',
        value: 2
      }]
    },
    {
      Tips: 'Dialed digits',
      name: 'dialedDigits',
      showSearch: true,
      required: false,
      type: 'tags',
      span: 8,
      options: null
    },
    {
      Tips: 'Status',
      name: 'numberPlanStatus',
      required: false,
      type: 'select',
      span: 8,
      options: [{
        name: 'Expired',
        value: 1
      }, {
        name: 'Active',
        value: 2
      }, {
        name: 'Future',
        value: 3
      }, ]
    }
  ]
  private numberPlanStatusOptions: any = [{
      name: 'Expired',
      value: 1
    },
    {
      name: 'Active',
      value: 2
    },
    {
      name: 'Future',
      value: 3
    },
    {
      name: 'Invalid',
      value: 4
    }
  ]
  private columns: any[] = [{
      title: 'Number Plan name',
      dataIndex: 'numberPlanName',
      key: 'numberPlanName',
      // width:100
    },
    {
      title: 'Destination',
      dataIndex: 'destinationName',
      key: 'destinationName',
      // width:100
    },
    {
      title: 'Dest.Type',
      dataIndex: 'destinationType',
      key: 'destinationType',
      customRender: (value: any, row: any, index: any) => {
        const obj = {
          children: value,
        };
        const find: any = this.destinationTypeOptions.find((item: any) => item.value === value)
        if (!!find) {
          obj.children = find.name
        }
        return obj;
      },
      // width:100
    },
    {
      title: 'Dialed digits',
      dataIndex: 'dialedDigitsList',
      key: 'dialedDigitsList',
      customCell:() => {return {class: 'fixed-width'}},
      scopedSlots: {
        customRender: "commaSplitNumber"
      }
    },
    {
      title: 'Country code',
      dataIndex: 'countryCode',
      key: 'countryCode',
    },
    {
      title: 'Country',
      dataIndex: 'countryName',
      key: 'countryName',
    },
    {
      title: 'Rounding rules',
      dataIndex: 'roundingRuleName',
      key: 'roundingRuleName',
      // width:100
    },
    {
      title: 'Status',
      dataIndex: 'numberPlanStatus',
      key: 'numberPlanStatus',
      customRender: (value: any, row: any, index: any) => {
        const obj = {
          children: value,
        };
        const find: any = this.numberPlanStatusOptions.find((item: any) => item.value === value)
        if (find) {
          obj.children = find.name
        }
        return obj;
      },
      // width:100
    },
    // width:100
    // {
    //   title: 'Begin date',
    //   dataIndex: 'beginDate',
    //   key: 'beginDate',
    // },
    // {
    //   title: 'End date',
    //   dataIndex: 'endDate',
    //   key: 'endDate'
    // },
    // {
    //   title: 'Modified by',
    //   dataIndex: 'modifiedBy',
    //   key: 'modifiedBy',
    //   // width:100
    // },
    // {
    //   title: 'Last modified',
    //   dataIndex: 'lastModified',
    //   key: 'lastModified',
    // },
  ];
  private destinationTypeOptions: any = [{
    name: 'Mobile',
    value: 1
  }, {
    name: 'Fixed',
    value: 2
  }]
  private data: any[] = [];
  private rulesData:any[]=[]
  // 全选
  public onSelectAll(selected: boolean, selectedRows: any, changeRows: any) {
    console.log('selected', selected);
    console.log('selectedRows', selectedRows);
    console.log('changeRows', changeRows);
    this.confirmDate = selectedRows
    selectedRows.map((item: any, i: number) => {
      console.log(item);
      const key = new Date().getTime() + i
       this.$set(this.arr, i, {
        key,
        Destination: {
          type: 'input',
          decorator: 'Destination' + key,
          initialValue: item.destinationName
        },
        destType: {
          type: 'select',
          decorator: 'destType' + key,
          options: [{
              name: 'Mobile'
            },
            {
              name: 'Fixed'
            }
          ],
          initialValue: item.destinationType == 1 ? 'Mobile' : 'Fixed'
        },
        dialedDigits: {
          type: 'input',
          decorator: 'dialedDigits' + key,
          initialValue: item.dialedDigitsList,
        },
        CountryCode: {
          type: 'tags',
          showSearch: true,
          required: true,
          decorator: 'CountryCode' + key,
          options: [],
          initialValue: item.countryCode,
          // allowClear: false
        },
        Country: {
          type: 'tags',
          showSearch: true,
          decorator: 'Country' + key,
          options: [],
          initialValue: item.countryName,
          // allowClear: false
        },
        roundingFules: {
          type: 'select',
          decorator: 'roundingFules' + key,
          showSearch: true,
          options:  this.rulesData,
          initialValue: item.roundingRuleName,
          // allowClear: false

        }
      })
    })
    console.log(this.arr);
    this.confirmData(this.arr)
  }
  private confirmDate: any
  private arr: any = []
  // 非全选
  public onSelect(selected: any, selectedRows: boolean, changeRows: any) {
    console.log('selected', selected);
    console.log('selectedRows', selectedRows);
    console.log('changeRows', changeRows);
    this.confirmDate = selected
    changeRows.map((item: any, i: number) => {
      console.log(item);
      const key = new Date().getTime() + i
      console.log(key);
      
      return this.$set(this.arr, i, {
        key,
        Destination: {
          type: 'input',
          decorator: 'Destination' + key,
          initialValue: item.destinationName
        },
        destType: {
          type: 'select',
          decorator: 'destType' + key,
          options: [{
              name: 'Mobile'
            },
            {
              name: 'Fixed'
            }
          ],
          initialValue: item.destinationType == 1 ? 'Mobile' : 'Fixed'
        },
        dialedDigits: {
          type: 'input',
          decorator: 'dialedDigits' + key,
          initialValue: item.dialedDigitsList,
        },
        CountryCode: {
          type: 'tags',
          showSearch: true,
          required: true,
          decorator: 'CountryCode' + key,
          options: [],
          initialValue: item.countryCode,
          // allowClear: false
        },
        Country: {
          type: 'tags',
          showSearch: true,
          decorator: 'Country' + key,
          options: [],
          initialValue: item.countryName,
          // allowClear: false
        },
        roundingFules: {
          type: 'select',
          decorator: 'roundingFules' + key,
          showSearch: true,
          options: this.rulesData,
          initialValue: item.roundingRuleName,
          // allowClear: false

        }
      })
    })
    console.log(this.arr);
    this.confirmData(this.arr)
  }
  public async created() {
    AxiosGet("/config/droplist/accounts").then((res: any) => {
      this.formOptions[0]['options'] = res.data
    })
    AxiosGet("/config/droplist/services").then((res: any) => {
      this.formOptions[1]['options'] = res.data
    })
    AxiosGet("/config/droplist/numberPlan/destinations").then((res: any) => {
      this.formOptions[4]['options'] = res.data
    })
    AxiosGet("/config/droplist/numberPlan/countries").then((res: any) => {
      res.data.unshift('-')
      this.formOptions[5]['options'] = res.data
    })
    AxiosGet("/config/droplist/numberPlan/dialedDigits").then((res: any) => {
      this.formOptions[6]['options'] = res.data
    })
    await AxiosGet("/config/droplist/vcRoundingRule/names").then((res: any) => {
      this.$set(this,'rulesData',res.data)
    })
    // console.log(this.rulesData);
    this.rulesData.unshift('Default')
    
  }
  public SearchOk(values ? : any): void {
    console.log(values);

    let data: any = {
      params: Object.assign({}, values, {
        // destinationType: values.destinationType && values.destinationType.length > 0 ? values.destinationType.join(',') : undefined,
        dialedDigits: values.dialedDigits && values.dialedDigits.length > 0 ? values.dialedDigits.join(',') : undefined,
        destinationNames: values.destinationNames && values.destinationNames.length > 0 ? values.destinationNames.join(',') : undefined,
      })
    }
    console.log('data1111111', data);
    // for(let key in data){
    //   console.log(data[key]);
      
    // }

    AxiosGet('/config/vc-number-plan/insert', data).then((res: any) => {
      this.data = res.data.map((item: any, index: number) => {
        return Object.assign({},item,{
          id:index
        })
      })
      console.log(this.data);
    })
  }
}
</script>
<style>
.components-table .ant-table-thead > tr > th.fixed-width, .components-table .ant-table-tbody > tr > td.fixed-width{
  word-break: break-all;
  width:26%;
}
</style>
