<template>
  <div class="statement monthly">
    <!-- 高级搜索 -->
    <Advanced-search
      :formoptions="formOptions"
      :formscreening="Formscreening"
      @Submit="SearchOk"
      @selectChange="selectChange"
      @monthPickerChange="monthPickerChange"
      @btnClick="activeClick"
      ref="AdvancedSearch"
    >
      <!-- 操作栏 -->
      <!--<div class="outer-operation">
        <div class="inner">
          <a-button v-for="(item,key) in Formscreening" :key="key" class="color-blue" :class="{'active': item.name === 'Generate'}" :icon="item.icon" @click.stop="active(item,key)">
            {{item.name}}
          </a-button>
        </div>
      </div>-->
    </Advanced-search>
    <!-- 表格上方 -->
    <a-row class="data-before" justify="start" type="flex">
      <a-col
        v-for="(item,key) in dataBeforeColumns"
        :key="key"
        :span="RowWidthFunc(item)"
        style="padding: 8px 0;"
      >
        <span :class="['a-row-table-head']">{{item.name}}:</span>
        {{dataBefore[item.dataIndex]||'--'}}
      </a-col>
    </a-row>
    <!--<a-table style="background-color: #fff" :columns="columns" :dataSource="data" :scroll="{ x: 1500 }" align="center" bordered>-->
    <!--</a-table>-->
    <Table
      :isFinance="true"
      @onSelectAll="onSelectAll"
      :scrollX="'100%'"
      ref="table"
      @onSelect="onSelect"
      :columns="columns"
      :lessSpace="true"
      :data="data"
      :isPagination="false"
      :useDefined="false"
      :rowClassName="rowClassName"
      zebraStripe
    />
    <!--<div class="Statement-pagination">-->
    <!--&lt;!&ndash; 分页 &ndash;&gt;-->
    <!--<pagination @change="onChang"-->
    <!--@showSizeChange="onShowSizeChange"/>-->
    <!--</div>-->
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import {
  ChargeTypeOptions
} from "@/views/Finance/common/data/index.ts";
import {
  downloadLocalFiles
} from "@/views/Finance/components/DownloadFile/saveFile"
import axios from "axios";
import save from "file-saver";
import {
  columnsHubbing,
  BillingTypeOptions,
  columnsVC,
  DataHubbingInbound,
  DataHubbingOutbound,
  DataVCInbound,
  DataVCOutbound,
  DirectionOptions
} from "./Test";
import moment from "moment";
import financeMixin from "@/views/Finance/common/js/mixin.ts";
import xlsx from "xlsx";
import { deepClone } from "@/assets/ts/index.ts";
import {
    getAccountOptions,
    getServiceOptions, 
}from "@/views/Finance/common/js/exchangeData.ts"

@Component({
  components: {
    AdvancedSearch: () =>
      import("@/views/Finance/components/Advancedsearch/index.vue"),
    // FormscReening: () => import("@/common/Formscreening/index.vue"),
    Table: () => import("@/views/Finance/components/Table/index.vue"),
    pagination: () => import("@/common/pagination/index.vue")
  },
  mixins: [financeMixin]
})
export default class Monthly extends Vue {
  private activeIndex: number = 0;
  public columnsHubbing: any[] = columnsHubbing;
  public columnsVC: any[] = columnsVC;
  public columns: any[] = columnsHubbing;
  public DataHubbingInbound: any[] = DataHubbingInbound;
  public DataHubbingOutbound: any[] = DataHubbingOutbound;
  public DataVCInbound: any[] = DataVCInbound;
  public DataVCOutbound: any[] = DataVCOutbound;
  public AccountOptions: any[] = [];
  public ServiceOptions: any[] = [];
  public data: any[] = [];
  // public data: any[] = data;
  private activeIn: number = 0;
  private activeSelect: string = "contractDetials";
  private searchData: any;
  private ChargeTypeOptions: any[] = ChargeTypeOptions();

  /* Add 选项卡 */
  public active(tab: any, item: any) {
    console.log(item);
    this.activeIn = tab;
    this.activeSelect = item;
  }
  // a-col的表头宽度设置
  public RowWidthFunc(item: any) {
    if (item.dataIndex == "Operator") {
      return 6;
    } else if (item.dataIndex == "Service") {
      return 5;
    } else if (item.dataIndex == "Direction") {
      return 6;
    } else if (item.dataIndex == "BillingType") {
      return 7;
    } else if (item.dataIndex == "ChargeType") {
      return 6;
    } else if (item.dataIndex == "Month") {
      return 5;
    } else if (item.dataIndex == "SettlePeriod") {
      return 6;
    } else if (item.dataIndex == "StatementNumber") {
      return 7;
    }
  }

  /* 弹出框显示/隐藏 */
  public visible: boolean = false;
  /*  高级搜索输入框数据
          @param name：label 值 && from输出的字段
          @param required：是否必填 默认false && from输出的字段
          @param type: 输入框什么类型， 例如select['下拉'], picker['时间选择器'] -> 目前只支持这俩个
          @param options：输入框['下拉的子元素数据']
      */
  private formOptions: any[] = [
    {
      Tips: "Service",
      name: "Service",
      required: true,
      type: "select",
      options: null
    },
    {
      Tips: "Account",
      name: "Account",
      required: true,
      type: "select",
      options: null
    },
    {
      Tips: "Charge type",
      name: "ChargeType",
      required: true,
      type: "select",
      options: this.ChargeTypeOptions
    },
    {
      Tips: "Billing type",
      name: "BillingType",
      required: true,
      type: "select",
      options: BillingTypeOptions
    },
    {
      Tips: "Direction",
      name: "Direction",
      required: true,
      type: "select",
      options: DirectionOptions
    },
    {
      Tips: "Month",
      name: "Month",
      required: true,
      type: "picker-month"
    },
    {
      Tips: "Begin date",
      name: "BeginDate",
      disabled: true,
      required: true,
      type: "picker"
    },
    {
      Tips: "End date",
      name: "EndDate",
      disabled: true,
      required: true,
      type: "picker"
    }
  ];
  /* 筛选栏 button-数据
       @param name: button 名字
       @param icon: button 图标
    */
  private Formscreening: any[] = [
    {
      name: "Generate"
    },
    {
      name: "Export"
    },
    {
      name: "Reset"
    }
  ];
  /* 表头数据 */
  private dataBeforeColumns: any[] = [
    {
      name: "Operator",
      dataIndex: "Operator"
    },
    {
      name: "Service",
      dataIndex: "Service"
    },
    {
      name: "Direction",
      dataIndex: "Direction"
    },
    {
      name: "Billing type",
      dataIndex: "BillingType"
    },
    {
      name: "Charge type",
      dataIndex: "ChargeType"
    },
    {
      name: "Month",
      dataIndex: "Month"
    },
    {
      name: "Settle Period",
      dataIndex: "SettlePeriod"
    },
    {
      name: "Statement Number",
      dataIndex: "StatementNumber"
    }
  ];
  private dataBefore: any = {
    Operator: "",
    Service: "",
    ChargeType: "",
    Direction: "",
    Month: "",
    BillingType: "",
    SettlePeriod:"",
    StatementNumber: ""
  };

  // 高级搜索 Search -> 回调
  public SearchOk(formData: any) {
    this.searchData = formData;
    let BillingType = formData["BillingType"],
      ChargeType = formData["ChargeType"],
      Direction = formData["Direction"],
      Account = formData["Account"],
      Service = formData["Service"],
      Month = formData["Month"],
      BeginDate = formData["BeginDate"],
      EndDate = formData["EndDate"],
      time190101 = moment("2019-01-01").subtract(1, "days"),
      time190131 = moment("2019-01-31").add(1, "days");
    setTimeout(() => {
      console.log('formData',formData)
      if (
        BillingType === 1 &&
        ChargeType === 1 &&
        Direction === 1 &&
        Service === 'IDD' &&
        Account === 'CMHK' &&
        moment(BeginDate).isBetween(time190101, time190131) &&
        moment(EndDate).isBetween(time190101, time190131)
      ) {
        this.data = DataHubbingInbound;
        this.dataBefore.StatementNumber = "201902071208001256";
      } else if (
        BillingType === 1 &&
        ChargeType === 1 &&
        Service === 'IDD' &&
        Direction === 2 &&
        Account === 'CMHK' &&
        moment(BeginDate).isBetween(time190101, time190131) &&
        moment(EndDate).isBetween(time190101, time190131)
      ) {
        this.data = DataHubbingOutbound;
        this.dataBefore.StatementNumber = "201902071209001342";
      } else if (
        BillingType === 2 &&
        ChargeType === 2 &&
        Direction === 1 &&
        Service === 'IDD' &&
        Account === 'CMCC' &&
        moment(BeginDate).isBetween(time190101, time190131) &&
        moment(EndDate).isBetween(time190101, time190131)
      ) {
        this.data = DataVCInbound;
        this.dataBefore.StatementNumber = "201902051150001335";
      } else if (
        BillingType === 2 &&
        ChargeType === 2 &&
        Direction === 2 &&
        Service === 'IDD' &&
        Account === 'CMCC' &&
        moment(BeginDate).isBetween(time190101, time190131) &&
        moment(EndDate).isBetween(time190101, time190131)
      ) {
        this.data = DataVCOutbound;
        this.dataBefore.StatementNumber = "201902070915507789";
      } else {
        this.data = [];
        this.dataBefore = {
          Operator: "",
          Service: "",
          ChargeType: "",
          Direction: "",
          Month: "",
          BillingType: "",
          SettlePeriod:"",
          StatementNumber: ""
        };
        return;
      }

      this.dataBeforeColumns.forEach((item: any) => {
        if (formData[item.dataIndex]) {
          this.dataBefore[item.dataIndex] = formData[item.dataIndex] || "--";
        }
        if (item.dataIndex === "Service") {
          this.dataBefore[item.dataIndex] = formData[item.dataIndex] || "--";
        }
        if (item.dataIndex === "Direction") {
          this.dataBefore[item.dataIndex] =
            DirectionOptions[formData[item.dataIndex] - 1].name || "--";
        }
        if (item.dataIndex === "ChargeType") {
          this.dataBefore[item.dataIndex] =
            this.ChargeTypeOptions[formData[item.dataIndex] - 1].name || "--";
        }
        if (item.dataIndex === "Operator") {
          this.dataBefore[item.dataIndex] = formData['Account'] || "--";
        }
        if (item.dataIndex === "BillingType") {
          this.dataBefore[item.dataIndex] =
            BillingTypeOptions[this.dataBefore[item.dataIndex] - 1].name ||
            "--";
        }
        if (item.dataIndex === "Month") {
          const startTime: any = moment(Month).startOf("month").format("YYYYMM");
          this.dataBefore[item.dataIndex] = startTime;
        }
        if (item.dataIndex == "SettlePeriod") {
          if (formData["Month"]) {
            this.dataBefore[item.dataIndex] =
              moment(formData["BeginDate"]).format("YYYYMMDD") +
              "--" +
              moment(formData["EndDate"]).format("YYYYMMDD");
          }
        }
      });
    }, 500);
  }

  public monthPickerChange(formData: any) {
    if (formData["Month"]) {
      const startTime: any = moment(formData["Month"]).startOf("month");
      const tempTime: any = moment(formData["Month"]).endOf("month");
      const ref: any = this.$refs;
      ref.AdvancedSearch.setFieldsValue({
        BeginDate: startTime,
        EndDate: tempTime
      });
    } else {
      // this.$refs.AdvancedSearch.setFieldsValue({'BeginDate': undefined, 'EndDate': undefined})
    }
  }

  public selectChange(formData: any,name: string) {
    this.dataBefore = {
      Operator: "",
      Service: "",
      ChargeType: "",
      Direction: "",
      Month: "",
      BillingType: "",
      SettlePeriod:"",
      StatementNumber: ""
    };
    const ref: any = this.$refs;
    // this.dataBeforeColumns.forEach((item: any) => {
    //     console.log('item',item)

    // })
    let columns: any[];
    if (formData["ChargeType"] === 2) {

      columns = columnsVC;
    } else if (formData["ChargeType"] === 1) {
      columns = columnsHubbing;
    } else {
      columns = columnsHubbing;
    }
    this.$set(this, "columns", columns);
    for (let i in this.formOptions) {
      if (this.formOptions[i].name == "BillingType") {
        for (let j in this.formOptions[i].options) {
          let obj = this.formOptions[i].options[j];
        //   formData["ChargeType"] == 1
        //     ? this.$set(obj, "disabled", obj.name !== "Invoice")&&this.$refs.AdvancedSearch.setFieldsValue({BillingType:1}) : this.$set(obj, "disabled", obj.name === "Invoice")&&this.$refs.AdvancedSearch.setFieldsValue({BillingType:2});
        }
      }
    }
  }

  /* 用户手动选择/取消选择所有列的回调  Table -> 回调 */
  public onSelectAll(selected: any, selectedRows: any, changeRows: any) {
    // console.log(selected, selectedRows, changeRows);
  }

  /* 用户手动选择/取消选择某列的回调
         @param record: 选中数据
         @param selected: 是否选中 true/false
         @param selectedRows: 所有选中 Array
      */
  public onSelect(record: object, selected: boolean, selectedRows: any) {
    // console.log(record, selected, selectedRows);
  }

  /* 点击切换页 分页(pagination) -> 回调 */
  public onChang(pageSize: number) {
    // console.log(pageSize)
  }

  /* 选择当前列表显示多少列
        @param: current  : 当前页
        @param：pageSize : 当前显示多少列
     */
  public onShowSizeChange(current: number, pageSize: number): void {
    // console.log(current, pageSize)
  }

  /* 操作栏点击 -> 回调 */
  public activeClick(msg: any) {
    console.log(msg);
    // index !== 3 && (this.visible = !this.visible) && (this.activeIndex = index);
    if (msg === "Export") {
      if (!this.data || !this.data.length) {
        this.$message.warning("请先获取数据");
        return;
      }
      if (this.data == DataHubbingInbound) {
        downloadLocalFiles('file/Invoice-HUbbing-inbound-CMHK-201901-0815.xls','Invoice-HUbbing-inbound-CMHK-201901.xlsx')
      }
      if (this.data == DataHubbingOutbound) {
        downloadLocalFiles('file/Invoice-HUbbing-outbound-CMHK-201901-0815.xls','Invoice-HUbbing-outbound-CMHK-201901.xlsx')
      }
      if (this.data == DataVCInbound) {
        downloadLocalFiles('file/Declaration-VC-inbound-CMCC-201901-0815.xls','Declaration-VC-inbound-CMCC-201901.xlsx')
      }
      if (this.data == DataVCOutbound) {
        downloadLocalFiles('file/Declaration-VC-outbound-CMCC-2019010-0815.xls','Declaration-VC-outbound-CMCC-201901.xlsx')
      }

        // ./img/icons/android-chrome-192x192.png
        // @/views/Finance/Statement/monthly/index.vue
        // this.openDownloadDialog('/public/file/','Declaration-VC-inbound-CMCC-201901-0815.xls')
        // this.openDownloadDialog('/public/file/Declaration-VC-inbound-CMCC-201901-0815.xls','Declaration-VC-inbound-CMCC-201901-0815.xls')
        // this.openDownloadDialog('./Declaration-VC-inbound-CMCC-201901-0815.xls','Declaration-VC-inbound-CMCC-201901-0815.xls')
        // window.open('./Declaration-VC-inbound-CMCC-201901-0815.xls')
        // (url: string, data?: any, baseURL: string = '')
        // form表单实现
        // let form: any = document.createElement('form')
        // document.body.appendChild (form)
        // form.action = '/public/file/Declaration-VC-inbound-CMCC-201901-0815.xls'
        // form.method = 'post'
        // form.submit();
        // document.body.removeChild(form)
        // ajax(type,url,data,dataType)
        // iframe实现
        // var iframe: any = document.createElement("iframe");
        // document.body.appendChild(iframe);
        // iframe.src ='/public/file/Declaration-VC-inbound-CMCC-201901-0815.xls';
        // iframe.parentNode.removeChild(iframe)
        // antd表头和body 在不同的table上  下列操作为合并
        // let table = document.createElement("table"); //创建一个li节点
        // const tableRef: any = this.$refs.table
        // const list = tableRef.$el.querySelectorAll(".ant-table-fixed")
        // let html: string = ''
        // for (let i = 0; i < list.length; i++) {
        //     html += list[i].innerHTML
        // }
        // table.innerHTML = html
        // const sheet: any = xlsx.utils.table_to_sheet(table); //将一个table对象转换成一个sheet对象
        // const dataBefore = this.dataBefore
        // this.openDownloadDialog(this.sheet2blob(sheet), `${dataBefore.Direction}_${this.searchData.Account}_${dataBefore.Service}_${dataBefore.ChargeType}_Traffic_${dataBefore.BillingType}_${moment(this.searchData.Month['_d']).format('YYYY/MM')}.xlsx`);
    }
  }

  /* 校验所有 */
  handlesaveAll() {
    // console.log("校验开始");
  }

  /* 退出 */
  handleReruen() {
    this.Screencover();
  }

  /* 关闭 Add */
  public Screencover() {
    this.visible = !this.visible;
  }

  private rowClassName(record: any, index: any) {
    if (record.textAlign) {
      return "table-footer-center";
    }
    if (record.hideBorder) {
      return "table-footer";
    }
    if (record.te) {
      return "left";
    }
    return "";
  }

    public async created(){
    let AccountOptions = await getAccountOptions()
    let ServiceOptions = await getServiceOptions()
    this.formOptions[0]['options'] = ServiceOptions
    this.ServiceOptions = ServiceOptions
    this.formOptions[1]['options'] = AccountOptions
    this.AccountOptions = AccountOptions
  }
}
</script>

<style>
.monthly .ant-table-tbody tr.left td:not(:first-child) {
  text-align: left;
}

.monthly .ant-table-tbody tr.table-footer td {
  text-align: left;
  background: #ffffff;
  border: none;
}

.monthly .ant-table-tbody tr.table-footer-center td {
  text-align: center;
}

.monthly .ant-table-tbody tr td {
  padding: 2px;
}
</style><style lang="scss" scoped>
@import "@/views/Finance/common/css/Statement.scss";
</style>
