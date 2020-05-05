<template>
  <div class="rerating statement">
    <!-- 高级搜索 -->
    <Advanced-search
      :formoptions="formOptions"
      searchText="Generate"
      @Submit="SearchOk"
      @selectChange="selectChange"
      @monthPickerChange="monthPickerChange"
      @btnClick="activeClick"
      ref="AdvancedSearch"
    ></Advanced-search>
    <a-tabs v-model="activeTabs" @change="callback" type="card">
      <a-tab-pane tab="Adjustment Data" :key="1">
        <a-row class="data-before" justify="start" type="flex" style="padding-left:24px;">
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
        <Table
          :isFinance="true"
          :isTableHeight="true"
          :scrollX="1200"
          ref="table1"
          :columns="FinanceReratingTablesTitle"
          :data="data"
          :rowClassName="rowClassName"
          :useDefined="false"
          v-show="show"
          :isPagination="PaginationShow"
          zebraStripe
        />
      </a-tab-pane>
      <a-tab-pane tab="New Data" :key="2">
        <a-row class="data-before" justify="start" type="flex" style="padding-left:24px;">
          <a-col
            v-for="(item,key) in dataBeforeColumnsItems"
            :key="key"
            :span="RowWidthFunc2(item)"
            style="padding: 8px 0;"
          >
            <span :class="['a-row-table-head']">{{item.name}}:</span>
            {{dataBefore[item.dataIndex]||'--'}}
          </a-col>
        </a-row>
        <Table
          :isFinance="true"
          :scrollX="2000"
          :isTableHeight="true"
          ref="table2"
          :columns="FinanceReratingNewDataTables"
          :data="ReratingNewData"
          :useDefined="false"
          :isPagination="false"
          :showHeader="false"
          @click="adjustment"
          v-show="show"
          :rowClassName="rowClassName"
          zebraStripe
        />
      </a-tab-pane>
      <a-tab-pane tab="Original Data" :key="3">
        <a-row class="data-before" justify="start" type="flex" style="padding-left:24px;">
          <a-col
            v-for="(item,key) in dataBeforeColumnsItems"
            :key="key"
            :span="RowWidthFunc2(item)"
            style="padding: 8px 0;"
          >
            <span :class="['a-row-table-head']">{{item.name}}:</span>
            {{dataBefore[item.dataIndex]||'--'}}
          </a-col>
        </a-row>
        <Table
          :isFinance="true"
          :scrollX="2000"
          ref="table3"
          :isTableHeight="true"
          :columns="FinanceReratingNewDataTables"
          :data="ReratingOriginal"
          :useDefined="false"
          :showHeader="false"
          :rowClassName="rowClassName"
          :isPagination="false"
          v-show="show"
          zebraStripe
        />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { refsConfig, recodeConfig } from "@/assets/ts/config.d";
import { Component } from "vue-property-decorator";
import { downloadLocalFiles } from "@/views/Finance/components/DownloadFile/saveFile";
import {
  columns,
  data,
  statusOptions,
  lockedDateOptions,
  FinanceReratingTablesTitle,
  dataBeforeColumns,
  FinanceReratingNewDataTables,
  ReratingOriginal,
  ReratingNewData,
  AdjustmentTypeOptions
} from "./Test";
import {
  ChargeTypeOptions,
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
    Table: () => import("@/views/Finance/components/Table/index.vue"),
    // pagination: () => import("@/common/pagination/index.vue")
    // model: () => import('@/common/Model/index.vue')
    // formGroup: () => import('@/views/Finance/components/form-group/index.vue'),
    // TableInput: () => import("@/views/Finance/components/table-input/index.vue")
  },
  mixins: [financeMixin]
})
export default class AdjustmentRerating extends Vue {
  public columns: any[] = columns;
  public FinanceReratingTablesTitle: any[] = FinanceReratingTablesTitle;
  public data: any[] = [];
  public ChargeTypeOptions: any[] = ChargeTypeOptions();
  public DirectionOptions: any[] = DirectionOptions();
  private CyclesOptions: any = null;
  public dataBeforeColumns: any[] = dataBeforeColumns;
  public FinanceReratingNewDataTables: any[] = FinanceReratingNewDataTables;
  public ReratingNewData: any[] = ReratingNewData;
  public ReratingOriginal: any[] = ReratingOriginal;
  private searchData: any;
  private activeTabs: number = 1;
  private show: boolean = false;
  private dataBeforeColumnsItems: any[] = [];
  private PaginationShow: boolean = false;
  public $refs: refsConfig | any;
  /* 弹出框显示/隐藏 */
  public visible: boolean = false;
  /*  高级搜索输入框数据
          @param name：label 值 && from输出的字段
          @param required：是否必填 默认false && from输出的字段
          @param type: 输入框什么类型， 例如select['下拉'], picker['时间选择器']
          @param options：输入框['下拉的子元素数据']
      */
  private formOptions: any[] = [
    {
      Tips: "Service",
      name: "Service",
      type: "select",
      required: true,
      options: null
    },
    {
      Tips: "Account",
      name: "Operator",
      type: "select",
      required: true,
      options: null
    },
    {
      Tips: "Charge type",
      name: "ChargeType",
      type: "select",
      required: true,
      options: this.ChargeTypeOptions
    },
    {
      Tips: "Direction",
      name: "Direction",
      type: "select",
      required: true,
      options: this.DirectionOptions
    },
    {
      Tips: "Adjustment type",
      name: "AdjustmentType",
      type: "select",
      required: true,
      options: AdjustmentTypeOptions
    },
    {
      Tips: "Cycle",
      name: "Cycle",
      type: "select",
      required: false,
      disabled: true,
      options: null
    },
    {
      Tips: "Month",
      name: "Month",
      required: false,
      disabled: true,
      type: "picker-month"
    },
    {
      Tips: "Begin date",
      name: "BeginDate",
      type: "picker",
      disabled: true,
      required: true
    },
    {
      Tips: "End date",
      name: "EndDate",
      type: "picker",
      disabled: true,
      required: true
    }
  ];
  private dataBefore: any = {
    Operator: "",
    Service: "",
    ChargeType: "",
    Direction: "",
    Month: "",
    Cycle: "",
    SettlePeriod: "",
    BillingType: "",
    AdjustmentType: "",
    StatementNumber: ""
  };

  // a-col的表头宽度设置
  public RowWidthFunc(item: any) {
    if (item.dataIndex == "Operator") {
      return 4;
    } else if (item.dataIndex == "Service") {
      return 4;
    } else if (item.dataIndex == "Direction") {
      return 5;
    } else if (item.dataIndex == "Month") {
      return 5;
    } else if (item.dataIndex == "Cycle") {
      return 4;
    } else if (item.dataIndex == "ChargeType") {
      return 5;
    } else if (item.dataIndex == "BillingType") {
      return 6;
    } else if (item.dataIndex == "SettlePeriod") {
      return 6;
    } else if (item.dataIndex == "StatementNumber") {
      return 6;
    } else if (item.dataIndex == "AdjustmentType") {
      return 6;
    }
  }
  public RowWidthFunc2(item: any) {
    if (item.dataIndex == "Operator") {
      return 5;
    } else if (item.dataIndex == "Service") {
      return 5;
    } else if (item.dataIndex == "Direction") {
      return 6;
    } else if (item.dataIndex == "Month") {
      return 5;
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
  // 高级搜索 generate -> 回调
  public SearchOk(formData: any) {
    this.searchData = formData;
    this.selectChange(formData, name);
    setTimeout(() => {
      this.data = data;
      let oldData: object = {
        Operator: "",
        Service: "",
        ChargeType: "",
        Direction: "",
        Month: "",
        Cycle: "",
        SettlePeriod: "",
        BillingType: "Adjustment Statement",
        AdjustmentType: "Changed Agreement",
        StatementNumber: ""
      };
      this.dataBeforeColumns.forEach((item: any) => {
        if (formData[item.dataIndex]) {
          this.dataBefore[item.dataIndex] = formData[item.dataIndex];
        } else {
          this.dataBefore[item.dataIndex] = oldData[item.dataIndex];
        }
        if (item.dataIndex == "ChargeType") {
          this.dataBefore[item.dataIndex] = this.ChargeTypeOptions[
            this.dataBefore[item.dataIndex] - 1
          ].name;
        }
        if (item.dataIndex == "Direction") {
          this.dataBefore[item.dataIndex] = this.DirectionOptions[
            this.dataBefore[item.dataIndex] - 1
          ].name;
        }
        if (item.dataIndex == "SettlePeriod") {
          if (formData["Month"]) {
            this.dataBefore[item.dataIndex] =
              moment(formData["BeginDate"]).format("YYYYMMDD") +
              "--" +
              moment(formData["EndDate"]).format("YYYYMMDD");
          }
          if (formData["Cycle"]) {
            this.dataBefore[item.dataIndex] =
              moment(formData["BeginDate"]).format("YYYYMMDD") +
              "--" +
              moment(formData["EndDate"]).format("YYYYMMDD");
          }
        }
        if (item.dataIndex == "AdjustmentType") {
          this.dataBefore[item.dataIndex] =
            AdjustmentTypeOptions[this.dataBefore[item.dataIndex] - 1].name;
        }

        if (item.dataIndex === "Month" || item.dataIndex === "Cycle") {
          const selectDate: any =
            item.dataIndex == "Cycle"
              ? formData[item.dataIndex]
              : moment(formData[item.dataIndex]).format("YYYYMM");
          let find: any;
          if (formData["Cycle"]) {
            find = this.CyclesOptions.find(
              (item: any) => item.name === formData["Cycle"]
            );
            if (find) {
              this.dataBefore[item.dataIndex] = moment(
                find.BeginDate.replace(/-/g, "")
              ).format("YYYYDD");
            }
            return;
          }
          let startTime: any = moment(selectDate)
            .startOf("month")
            .format("YYYY-MM-DD");
          let endTime: any = moment(selectDate)
            .endOf("month")
            .format("YYYY-MM-DD");
          this.dataBefore[item.dataIndex] =
            startTime.replace(/-/g, "") + "--" + endTime;
        }
      });
      if (
        formData["Operator"] == "CMCC" &&
        formData["ChargeType"] == 2 &&
        formData["Service"] == "IDD" &&
        formData["Direction"] == 3 &&
        formData["Cycle"] == "201901" &&
        formData["AdjustmentType"] == 1
      ) {
        this.show = true;
        this.dataBefore.StatementNumber = "201911061130016868";
      } else {
        this.show = false;
      }
    }, 500);
  }
  public monthPickerChange(formData: any, newData: any = {}) {
    const AdvancedSearch: any = this.$refs.AdvancedSearch;
    AdvancedSearch.setFieldsValue(
      Object.assign({}, newData, {
        BeginDate: formData["Month"]
          ? moment(formData["Month"]).startOf("month")
          : undefined,
        EndDate: formData["Month"]
          ? moment(formData["Month"]).endOf("month")
          : undefined,
        Cycle: undefined
      })
    );
  }
  public selectChange(formData: any, name: string) {
    // console.log(formData,name);

    if (name === "Operator" || name === "Service" || name === "Direction") {
      let data = {
        accountName: formData["Operator"],
        serviceName: formData["Service"],
        direction: formData["Direction"]
      };
      console.log("data", data);
      getCyclesOptions({ params: data }).then((res: any) => {
        console.log(res);
        this.formOptions[5].options = res;
        this.CyclesOptions = res;
      });
    }
    this.data = [];
    this.dataBefore = {
      Operator: "",
      Service: "",
      ChargeType: "",
      Direction: "",
      Month: "",
      Cycle: "",
      BillingType: "",
      StatementNumber: ""
    };
    const AdvancedSearch: any = this.$refs.AdvancedSearch;

    this.formOptions.forEach((item: any) => {
      if (item.name === "Month" || item.name === "Cycle") {
        item.disabled = false;
        item.required = true;
      }
    });
    this.dataBeforeColumns.forEach((item: any) => {
      if (item.name == "Month" || item.name == "Cycle") {
        if (formData["ChargeType"] == 1) {
          item.name = "Month";
          item.dataIndex = "Month";
        } else {
          item.name = "Cycle";
          item.dataIndex = "Cycle";
        }
      }
    });
    let changeData: any = {};
    if (formData["ChargeType"] == 1) {
      // vc  Charge type 为 Hubbing 时cycle不能选择 为 VC 时 month不能选择。
      this.formOptions.forEach((item: any) => {
        if (item.name === "Cycle") {
          item.disabled = true;
          item.required = false;
        } else {
          this.changeDestinaitonStatus(item, formData, changeData);
        }
      });
      // console.log(changeData)
      this.monthPickerChange(formData, changeData);
    } else {
      let find: any;
      if (formData["Cycle"]) {
        find = this.CyclesOptions.find(
          (item: any) => item.name === formData["Cycle"]
        );
        AdvancedSearch.setFieldsValue({
          BeginDate: moment(find.BeginDate),
          EndDate: moment(find.EndDate)
        });
      }
      this.formOptions.forEach((item: any) => {
        if (item.name === "Month") {
          item.disabled = true;
          item.required = false;
        } else {
          this.changeDestinaitonStatus(item, formData, changeData);
        }
      });
    }
  }
  public callback(key: number) {
    const AdvancedSearch = this.$refs.AdvancedSearch;
    const AdvancedSearchs = AdvancedSearch.getFieldsValue();
      if (
        AdvancedSearchs.Service === "IDD" &&
        AdvancedSearchs.Operator === "CMCC" &&
        AdvancedSearchs.Direction === 3 &&
        AdvancedSearchs.ChargeType === 2 &&
        AdvancedSearchs.Cycle === "201901" &&
        AdvancedSearchs.AdjustmentType === 1
      ) {
        if (key == 1) {
          this.dataBefore.BillingType = "Changed Agreement";
          this.dataBefore.StatementNumber = "201911061130016868";
        }
        if (key == 2) {
          this.dataBefore.StatementNumber = "";
          this.dataBefore.BillingType = "General Statement";
        }
        if (key == 3) {
          this.dataBefore.BillingType = "General Statement";
          this.dataBefore.StatementNumber = "201908031130330231";
        }
      }
    if (key == 2) {
      this.dataBeforeColumnsItems = this.dataBeforeColumns.filter(
        (item: any, i: number) => {
          return item.dataIndex != "AdjustmentType";
        }
      );
    }
  }
  private changeDestinaitonStatus(item: any, formData: any, changeData): any {
    if (item.name === "InboundDestinaiton" || item.name === "InboundItem") {
      item.disabled =
        formData["SettleType"] == 2 ||
        (formData["SettleType"] == 1 && formData["DataSourceType"] === 2) ||
        formData["Direction"] == 2;
      if (item.disabled) {
        if (item.name === "InboundDestinaiton") {
          item.initialValue = [];
        } else {
          changeData[item.name] = undefined;
        }
      }
    } else if (
      item.name === "OutboundDestinaiton" ||
      item.name === "OutboundItem"
    ) {
      item.disabled =
        formData["SettleType"] == 2 ||
        (formData["SettleType"] == 1 && formData["DataSourceType"] === 2) ||
        formData["Direction"] == 1;
      if (item.disabled) {
        if (item.name === "OutboundDestinaiton") {
          item.initialValue = [];
        } else {
          changeData[item.name] = undefined;
        }
      }
    } else if (item.name === "DataSourceType") {
      // SettleType 为 manual 禁用 DataSourceType 并清空值
      if (formData["SettleType"] == 2) {
        changeData["DataSourceType"] = undefined;
      }
      item.disabled = formData["SettleType"] == 2;
      item.required = formData["SettleType"] != 2;
    }
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
    if (msg == "Export") {
      this.toExport();
    }
  }

  private rowClassName(record: any, index: any) {
    if (record.hideBorder) {
      return "table-footer";
    }
    if (record.te) {
      return "left";
    }
    if (record.subheading) {
      return "subheading";
    } else if (record.headline) {
      return "headline";
    }
    if (record.useTableHeader) {
      return "header-style";
    } else if (record.useTableLittleHeader) {
      return "header-little-title-style";
    } else if (record.useTableDataHeader) {
      return "header-data-style";
    } else if (record.useTableDataFooter) {
      return "footer-data-style";
    }
    return "";
  }
  private toExport() {
    if (!this.data || !this.data.length) {
      this.$message.warning("请先获取数据");
      return;
    }
    downloadLocalFiles(
      "file/AdjustmentStatement-Bilateral-CMCC-201901-0815.xlsx",
      "AdjustmentStatement-Bilateral-CMCC-201901.xlsx"
    );
    // console.log("data", this.data);
    // if (this.data.length !== 0) {
    //   const files1 = this.data.map((item: any) => {
    //     let newItem = JSON.parse(JSON.stringify(item));
    //     delete newItem.key;
    //     for (let key in newItem) {
    //       let find: any;
    //       switch (key) {
    //         case "ChargeType":
    //           find = ChargeTypeOptions.find(
    //             (inner: any) => inner.value === item[key]
    //           );
    //           break;
    //         case "Direction":
    //           find = DirectionOptions.find(
    //             (inner: any) => inner.value === item[key]
    //           );
    //           break;
    //       }
    //       if (find) {
    //         newItem[key] = find.name;
    //       }
    //     }
    //     return newItem;
    //   });
    //   const files2 = this.ReratingNewData.map((item: any) => {
    //     let newItem = JSON.parse(JSON.stringify(item));
    //     delete newItem.key;
    //     for (let key in newItem) {
    //       let find: any;
    //       switch (key) {
    //         case "ChargeType":
    //           find = ChargeTypeOptions.find(
    //             (inner: any) => inner.value === item[key]
    //           );
    //           break;
    //         case "Direction":
    //           find = DirectionOptions.find(
    //             (inner: any) => inner.value === item[key]
    //           );
    //           break;
    //       }
    //       if (find) {
    //         newItem[key] = find.name;
    //       }
    //     }
    //     return newItem;
    //   });
    //   const files3 = this.ReratingOriginal.map((item: any) => {
    //     let newItem = JSON.parse(JSON.stringify(item));
    //     delete newItem.key;
    //     for (let key in newItem) {
    //       let find: any;
    //       switch (key) {
    //         case "ChargeType":
    //           find = ChargeTypeOptions.find(
    //             (inner: any) => inner.value === item[key]
    //           );
    //           break;
    //         case "Direction":
    //           find = DirectionOptions.find(
    //             (inner: any) => inner.value === item[key]
    //           );
    //           break;
    //       }
    //       if (find) {
    //         newItem[key] = find.name;
    //       }
    //     }
    //     return newItem;
    //   });
    //   const ws1: xlsx.WorkSheet = xlsx.utils.json_to_sheet(files1);
    //   const ws2: xlsx.WorkSheet = xlsx.utils.json_to_sheet(files2);
    //   const ws3: xlsx.WorkSheet = xlsx.utils.json_to_sheet(files3);
    //   const wb: xlsx.WorkBook = xlsx.utils.book_new();
    //   xlsx.utils.book_append_sheet(wb, ws1, "Sheet1");
    //   xlsx.utils.book_append_sheet(wb, ws2, "Sheet2");
    //   xlsx.utils.book_append_sheet(wb, ws3, "Sheet3");
    //   xlsx.writeFile(wb, `Adjustment_rerating.xlsx`);
    // } else {
    //   this.$warning({
    //     title: "Warning!",
    //     content: "你暂时没有数据",
    //     onOk() {},
    //     onCancel() {}
    //   });
    //   return;
    // }
  }

  private adjustment() {
    console.log("this", this);
    this.dataBefore.AdjustmentType = "";
  }

  /* 退出 */
  private handleReturn() {
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

<style lang="scss">
@import "@/views/Finance/common/css/deep-modal.scss";

.rerating .ant-table-tbody tr.left td:not(:first-child) {
  text-align: left;
}

.rerating .ant-table-tbody tr.table-footer td:not(:last-child) {
  text-align: left;
  background: #f5f6fa;
  border: none;
}

.rerating .ant-table-tbody tr.table-footer td:last-child {
  text-align: left;
  border: none;
  background: #f5f6fa;
}

.rerating .ant-table-tbody tr.header-style td {
  color: #000000;
  background: #edeef7;
  font-weight: 600;
  font-size: 16px;
  text-align: center;
}

.rerating .ant-table-tbody tr.header-data-style td:first-child {
  font-weight: 600;
  font-size: 16px;
  color: #000000;
  text-align: left;
}

.rerating .ant-table-tbody tr.header-little-title-style td {
  text-align: center;
  font-weight: 600;
  font-size: 14px;
  color: #000000;
}

.rerating .ant-table-tbody tr.footer-data-style td:first-child {
  font-weight: 600;
  font-size: 14px;
  color: #000000;
  text-align: left;
}

/*.general .ant-table-thead > tr > th,*/
.rerating .ant-table-tbody > tr > td {
  text-align: left;
  padding: 8px 0 8px 6px;
}

.rerating .headline td:first-child {
  background-color: rgb(230, 231, 237);
  /*color: #fff;*/
  text-align: left;
  font-weight: 600;
}

.rerating .subheading td {
  font-weight: 600;
  color: #000;
}
</style><style lang="scss" scoped>
@import "@/views/Finance/common/css/Statement.scss";
@import "@/views/Finance/common/css/modal.scss";
</style>
