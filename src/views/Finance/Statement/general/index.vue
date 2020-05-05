<template>
  <div class="general statement">
    <!-- 高级搜索 -->
    <Advanced-search
      :formoptions="formOptions"
      :formscreening="Formscreening"
      ref="AdvancedSearch"
      @Submit="SearchOk"
      @selectChange="selectChange"
      @monthPickerChange="monthPickerChange"
      @btnClick="activeClick"
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
        style="padding: 4px 0;"
      >
        <span :class="['a-row-table-head']">{{item.name}}:</span>
        {{dataBefore[item.dataIndex]||'--'}}
      </a-col>
    </a-row>
    <!--<a-table :pagination="false" style="background-color: #fff" :columns="columns" :dataSource="data"-->
    <!--:scroll="{ x: 1500,y:500 }" align="center"-->
    <!--bordered>-->
    <!--</a-table>-->
    <Table
      :isFinance="true"
      @onSelectAll="onSelectAll"
      ref="table"
      @onSelect="onSelect"
      :scrollX="1600"
      :columns="columns"
      :data="data"
      :isTableHeight="true"
      :lessSpace="true"
      :useDefined="false"
      :showHeader="false"
      :rowClassName="rowClassName"
      :isPagination="false"
      zebraStripe
    />
    <!-- 模态弹出框 -->
  </div>
</template>

<script lang="ts">
import Vue from "vue";
// import '@/views/Finance/js/prototype.js'
import { Component } from "vue-property-decorator";
import {
  columns,
  dataBilateralCMCC,
  dataBilateralKDDI,
  dataInbound
} from "./Test";
import { downloadLocalFiles } from "@/views/Finance/components/DownloadFile/saveFile";
import {
  DirectionOptions
} from "@/views/Finance/common/data/index.ts";
import moment from "moment";
import financeMixin from "@/views/Finance/common/js/mixin.ts";
import xlsx from "xlsx";
import {
  getAccountOptions,
  getServiceOptions,
  getCyclesOptions
} from "@/views/Finance/common/js/exchangeData.ts";

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
export default class General extends Vue {
  private activeIndex: number = 0;
  public columns: any[] = columns;
  public data: any[] = [];
  public CyclesOptions: any[] = [];
  public DirectionOptions: any[] = DirectionOptions();

  private listBar: any[] = [
    {
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
    {
      name: "Number plan",
      cName: "numberPlan"
    },
    {
      name: "Product",
      cName: "product"
    }
  ];
  private activeIn: number = 0;
  private activeSelect: string = "contractDetials";
  private searchData: any;

  /* Add 选项卡 */
  public active(tab: any, item: any) {
    console.log(item);
    this.activeIn = tab;
    this.activeSelect = item;
  }

  // a-col的表头宽度设置
  public RowWidthFunc(item: any) {
    if (item.dataIndex == "Operator") {
      return 5;
    } else if (item.dataIndex == "Service") {
      return 5;
    } else if (item.dataIndex == "Direction") {
      return 6;
    } else if (item.dataIndex == "Month") {
      return 6;
    } else if (item.dataIndex == "Cycle") {
      return 5;
    } else if (item.dataIndex == "ChargeType") {
      return 5;
    } else if (item.dataIndex == "BillingType") {
      return 6;
    } else if (item.dataIndex == "SettlePeriod") {
      return 6;
    } else if (item.dataIndex == "StatementNumber") {
      return 8;
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
      options: [
        {
          name: "VC"
        }
      ],
      initialValue: "VC"
    },
    {
      Tips: "Billing type",
      name: "BillingType",
      required: true,
      type: "select",
      options: [
        {
          name: "General Statement"
        }
      ],
      initialValue: "General Statement"
    },
    {
      Tips: "Direction",
      name: "Direction",
      required: true,
      type: "select",
      options: this.DirectionOptions
    },
    {
      Tips: "Cycle",
      name: "Cycle",
      required: true,
      type: "select",
      options: null
    },
    {
      Tips: "Begin date",
      name: "BeginDate",
      required: true,
      disabled: true,
      type: "picker"
    },
    {
      Tips: "End date",
      name: "EndDate",
      required: true,
      disabled: true,
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
      name: "Cycle",
      dataIndex: "Cycle"
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
    Cycle: "",
    SettlePeriod: "",
    BillingType: "",
    StatementNumber: ""
  };
  // 高级搜索 Search -> 回调
  public SearchOk(formData: any) {
    this.searchData = formData;
    let Direction = formData["Direction"],
      Account = formData["Account"],
      Service = formData["Service"],
      Cycle = formData["Cycle"];
    setTimeout(() => {
      if (
        Direction === 3 &&
        Account === 'CMCC' &&
        Service === 'IDD' &&
        Cycle === "201901"
      ) {
        this.data = dataBilateralCMCC;
        this.dataBefore.StatementNumber = "201908031130330231";
      } else if (
        Direction === 3 &&
        Account === 'KDDI' &&
        Service === 'IDD' &&
        Cycle === "201801"
      ) {
        this.data = dataBilateralKDDI;
        this.dataBefore.StatementNumber = "201903031522005661";
      } else if (
        Direction === 1 &&
        Account === 'CMCC' &&
        Service === 'IDD' &&
        Cycle === "201902"
      ) {
        this.data = dataInbound;
        this.dataBefore.StatementNumber = "201908031150330231";
      } else {
        this.data = [];
        this.$message.warning('No Data')
        this.dataBefore = {
          Operator: "",
          Service: "",
          ChargeType: "",
          Direction: "",
          Cycle: "",
          SettlePeriod: "",
          BillingType: "",
          StatementNumber: ""
        };
        return;
      }
      this.dataBeforeColumns.forEach((item: any) => {
        if (formData[item.dataIndex]) {
          this.dataBefore[item.dataIndex] = formData[item.dataIndex];
        }
        if (item.dataIndex == "Operator") {
          this.dataBefore["Operator"] = formData['Account'] || '--';
        }
        if (item.dataIndex == "Service") {
          this.dataBefore["Service"] = formData['Service'] || '--';
        }
        if (item.dataIndex == "Direction") {
          this.dataBefore["Direction"] =
            this.DirectionOptions[formData[item.dataIndex] - 1].name;
        }
        if (item.dataIndex === "Cycle") {
          const find = this.CyclesOptions.find(
            (inner: any) => inner.name === formData[item.dataIndex]
          );
          if (find) {
            this.dataBefore[item.dataIndex] = find.name;
            this.dataBefore["SettlePeriod"] =
              find.BeginDate.replace(/-/g, "") +
              "--" +
              find.EndDate.replace(/-/g, "");
          }
        }
      });
    }, 500);
  }

  public monthPickerChange(formData: any) {
    console.log(formData);
    
  }

  public selectChange(formData: any, name: string) {
    
    let searchRef: any = this.$refs.AdvancedSearch,find: any;
    if (name === "Account" || name === "Service" || name === "Direction"){
      let data = {
        accountName: formData["Account"],
        serviceName: formData["Service"],
        direction: formData["Direction"]
      };
      getCyclesOptions({ params: data }).then((res: any) => {
        this.formOptions[5].options = res;
        this.CyclesOptions = res;
      });
    }
    if (name === 'Cycle') {
        find = this.CyclesOptions.find(
        (item: any) => item.name === formData["Cycle"]
      );
      let concatData: any = Object.assign({},formData, {
        BeginDate: find?moment(find.BeginDate):undefined,
        EndDate: find?moment(find.EndDate):undefined
      })
      searchRef.setFieldsValue(concatData);
      console.log(find,concatData);
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

  // 给表格的row加样式，判断data数据里面是否有以下字段
  private rowClassName(record: any, index: any) {
    if (record.subheading) {
      return "subheading";
    } else if (record.headline) {
      return "headline";
    } else if (record.useTableHeader) {
      return "header-style";
    } else if (record.useTableLittleHeader) {
      return "header-little-title-style";
    } else if (record.useTableDataHeader) {
      return "header-data-style";
    } else if (record.useTableDataFooter) {
      return "footer-data-style";
    } else if (record.isAddBorderTop) {
      return "total-words-border-top";
    } else if (record.hideBorder) {
      return "hide-border";
    }
    return "";
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
    // index !== 3 && (this.visible = !this.visible) && (this.activeIndex = index);
    const dataBefore = this.dataBefore;
    if (msg === "Export") {
      if (!this.data || !this.data.length) {
        this.$message.warning("请先获取数据");
        return;
      }
      let name = `${dataBefore.Direction}_${this.searchData.Account}_${
        dataBefore.Service
      }_${dataBefore.ChargeType}_Traffic_${dataBefore.BillingType}_${moment(
        this.searchData.Cycle["_d"]
      ).format("YYYY/MM")}.xlsx`;

      if (this.data == dataBilateralCMCC) {
        downloadLocalFiles(
          "file/dataBilateralCMCC.xlsx",
          "GeneralStatement-VC-bilateral-CMCC-201901.xlsx"
        );
      } else if (this.data == dataBilateralKDDI) {
        downloadLocalFiles(
          "file/dataBilateralKDDI.xlsx",
          "GeneralStatement-VC-bilateral-KDDI-201801.xlsx"
        );
      } else if (this.data == dataInbound) {
        downloadLocalFiles(
          "file/dataInbound.xlsx",
          "GeneralStatement-VC-Inbound-CMCC-201902.xlsx"
        );
      }
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
  public async created() {
    let AccountOptions = await getAccountOptions();
    let ServiceOptions = await getServiceOptions();
    this.formOptions[0]["options"] = ServiceOptions;
    this.formOptions[1]["options"] = AccountOptions;
  }
}
</script>
<style>
.general.statement .ant-table-tbody tr.header-style td {
  color: #0e0202;
  background: #edeef7;
  font-weight: 600;
  font-size: 16px;
  text-align: center;
}
.general.statement .ant-table-tbody tr.header-data-style td:first-child {
  font-weight: 600;
  font-size: 16px;
  color: #000000;
  text-align: left;
}
.general.statement .ant-table-tbody tr.header-little-title-style td {
  text-align: center;
  font-weight: 600;
  font-size: 14px;
  color: #000000;
}
.general.statement .ant-table-fixed .ant-table-tbody tr.total-words-border-top {
  border-top: 2px solid #cccccc;
}
.general.statement .ant-table-tbody tr:last-child {
  border-bottom: 2px solid #cccccc;
}
.general.statement .ant-table-tbody tr.footer-data-style td:first-child {
  font-weight: 600;
  font-size: 14px;
  color: #000000;
  text-align: left;
}
/*.general .ant-table-thead > tr > th,*/
.general .ant-table-tbody > tr > td:not(:first-child) {
  text-align: left;
  padding: 2px 0 2px 2px;
}

.general .headline td:first-child {
  background-color: rgb(230, 231, 237);
  /*color: #fff;*/
  text-align: left;
  font-weight: 600;
}

.general .subheading td {
  font-weight: 600;
  color: #000;
}
.general .ant-table-tbody tr:not(.header-style) td.vertical-td-style,
.general .ant-table-tbody tr:not(:first-child) td.vertical-td-style,
.general .ant-table-tbody tr:not(.hide-border) td.vertical-td-style {
  border-right: 2px solid #cccccc;
}
</style>
<style lang="scss" scoped>
@import "@/views/Finance/common/css/Statement.scss";
.general {
  .data-before {
    font-size: 14px;
    /*background-color: #fff;*/
    border-radius: 10px;
    /*min-width: 1200px;*/
    .min-w {
      min-width: 300px;
    }
  }
}
</style>