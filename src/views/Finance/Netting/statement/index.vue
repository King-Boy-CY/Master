<template>
  <div class="statement monthly">
    <!-- 高级搜索 -->
    <Advanced-search
      :formoptions="formOptions"
      :formscreening="Formscreening"
      :needAdd="true"
      :span="12"
      :collapseTags="true"
      :multipleCheckBoxStyle="'netting-statement'"
      @Submit="SearchOk"
      @selectChange="selectChange"
      @monthPickerChange="monthPickerChange"
      @btnClick="activeClick"
      showMaskPLan
      ref="AdvancedSearch"
    />
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
    <Table
      :isFinance="true"
      :lessSpace="true"
      :scrollX="1800"
      ref="table"
      @onSelect="onSelect"
      @onSelectAll="onSelectAll"
      :columns="columns"
      :data="data"
      :isPagination="false"
      :rowClassName="rowClassName"
      :useDefined="false"
      zebraStripe
    />
    <!--<div class="Statement-pagination">-->
    <!--<pagination @change="onChang"-->
    <!--@showSizeChange="onShowSizeChange"/>-->
    <!--</div>-->
    <a-modal
      centered
      class="edit-modal"
      width="950px"
      v-model="visible"
      v-if="visible"
      :footer="null"
      :title="selectName==='Add'?'Add record':selectName==='Edit'?'Edit':'Details'"
      onOk="handleOk"
    >
      <div class="body">
        <div class="modal-box" :key="0">
          <div class="modal-box-title">
            <span class="piece"></span>
            <span class="title-text">Basic data</span>
          </div>
          <form-group
            :formoptions="baseInfoFormOptions"
            @selectChange="baseInfoSelectChange"
            @monthPickerChange="baseInfoPickerChange"
            :span="12"
            ref="baseInfoFormGroup"
            class="form-group"
          ></form-group>
        </div>
        <!--Inbound data-->
        <div class="modal-box" :key="href+1">
          <div class="modal-box-title">
            <span class="piece"></span>
            <span class="title-text">Inbound data</span>
          </div>
          <form-group
            :formoptions="inboundFormOptions"
            @selectChange="inboundSelectChange"
            :collapseTags="true"
            @inputChange="inboundSelectChange"
            :span="12"
            ref="inboundInfoFormGroup"
            class="form-group"
          ></form-group>
        </div>

        <!--Outbound data-->
        <div class="modal-box" :key="href+2">
          <div class="modal-box-title">
            <span class="piece"></span>
            <span class="title-text">Outbound data</span>
          </div>
          <form-group
            :formoptions="outboundFormOptions"
            @selectChange="outboundSelectChange"
            :collapseTags="true"
            @inputChange="outboundSelectChange"
            :span="12"
            ref="outboundInfoFormGroup"
            class="form-group"
          ></form-group>
        </div>

        <!--Netting data-->
        <div class="modal-box" :key="href+4">
          <div class="modal-box-title">
            <span class="piece"></span>
            <span class="title-text">Netting data</span>
          </div>
          <form-group
            :formoptions="nettingdFormOptions"
            @monthPickerChange="nettingSelectChange"
            @inputChange="nettingSelectChange"
            :span="12"
            ref="nettingInfoFormGroup"
            class="form-group"
          ></form-group>
        </div>
      </div>
      <div style="padding-top: 20px;text-align: center">
        <a-button type="primary" style="border-radius: 50px;min-width: 90px" @click="save">Save</a-button>
        <a-button
          @click="handleReturn('Reset')"
          style="margin-left: 14px;border-color:#1890ff;color:#1890ff;border-radius: 50px;min-width: 90px"
        >Return</a-button>
      </div>
    </a-modal>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { NettingStatementAdd } from "@/api/index.ts";
import { refsConfig, recodeConfig } from "@/assets/ts/config.d";
import { Component } from "vue-property-decorator";
import {
  getAccountOptions,
  getServiceOptions,
  getCurrencyOptions,
  getCyclesOptions,
  getDestinationsOptions
} from "@/views/Finance/common/js/exchangeData.ts";
import {
  StatementKTTS,
  StatementKTS,
  statementData,
  StatementRows,
  StatementIDDS,
  statementColumns,
  SettleTypeOptions,
  DataSourceTypeOptions,
  InboundItemOptions,
  StatementNumberOptions,
  HeaderTitle
} from "./Test";
import {
  CycleOptions,
  AccountCycleOptions,
  ServiceOptions,
  ChargeTypeOptions,
  DirectionOptions,
  BillingTypeOptions
} from "@/views/Finance/common/data/index.ts";
import moment from "moment";
import financeMixin from "@/views/Finance/common/js/mixin.ts";
import xlsx from "xlsx";
import {
  inboundFormOptions,
  outboundFormOptions,
  nettingdFormOptions,
  nettingObj
} from "@/views/Finance/common/data/netting.ts";
import { deepClone } from "@/assets/ts/index.ts";
import { downloadLocalFiles } from "@/views/Finance/components/DownloadFile/saveFile";
import { initialValue } from "../../../../untils/router";
@Component({
  components: {
    AdvancedSearch: () =>
      import("@/views/Finance/components/Advancedsearch/index.vue"),
    // FormscReening: () => import("@/common/Formscreening/index.vue"),
    Table: () => import("@/views/Finance/components/Table/index.vue"),
    pagination: () => import("@/common/pagination/index.vue"),
    formGroup: () => import("@/views/Finance/components/form-group/index.vue")
  },
  mixins: [financeMixin]
})
export default class Statement extends Vue {
  private href: string = window.location.href;
  public columns: any[] = statementColumns;
  public data: any[] = [];
  public DestinationOptions: any[] = [];
  public ChargeTypeOptions: any[] = ChargeTypeOptions();
  public DirectionOptions: any[] = DirectionOptions();
  public BillingTypeOptions: any[] = BillingTypeOptions();
  private searchData: any;
  /* 弹出框显示/隐藏 */
  public visible: boolean = false;
  public $refs: refsConfig | any;

  /*  高级搜索输入框数据
          @param name：label 值 && from输出的字段
          @param required：是否必填 默认false && from输出的字段
          @param type: 输入框什么类型， 例如select['下拉'], picker['时间选择器'] -> 目前只支持这俩个
          @param options：输入框['下拉的子元素数据']
      */
  private CyclesOptions: any;
  private InboundShow: boolean = false;
  private formOptions: any[] = [
    {
      Tips: "Service",
      name: "Service",
      required: true,
      type: "select",
      span: 8,
      wrapperCol: { span: 14 },
      labelCol: { span: 10 },
      options: null
    },
    {
      Tips: "Account",
      name: "Account",
      required: true,
      type: "select",
      span: 8,
      wrapperCol: { span: 14 },
      labelCol: { span: 10 },
      options: null
    },
    {
      Tips: "Charge type",
      name: "ChargeType",
      required: true,
      type: "select",
      span: 8,
      wrapperCol: { span: 14 },
      labelCol: { span: 10 },
      options: this.ChargeTypeOptions
    },

    {
      Tips: "Direction",
      name: "Direction",
      required: true,
      type: "select",
      span: 8,
      wrapperCol: { span: 14 },
      labelCol: { span: 10 },
      options: this.DirectionOptions
    },
    {
      Tips: "Cycle",
      name: "Cycle",
      required: false,
      type: "select",
      span: 8,
      wrapperCol: { span: 14 },
      labelCol: { span: 10 },
      options: this.CyclesOptions,
      disabled: false
    },
    {
      Tips: "Month",
      name: "Month",
      required: false,
      span: 8,
      wrapperCol: { span: 14 },
      labelCol: { span: 10 },
      type: "picker-month",
      disabled: false
    },
    {
      Tips: "Begin date",
      name: "BeginDate",
      required: true,
      span: 8,
      wrapperCol: { span: 14 },
      labelCol: { span: 10 },
      disabled: true,
      type: "picker"
    },
    {
      Tips: "End date",
      name: "EndDate",
      required: true,
      disabled: true,
      span: 8,
      wrapperCol: { span: 14 },
      labelCol: { span: 10 },
      type: "picker"
    },
    {
      Tips: "Settle Type",
      name: "SettleType",
      required: true,
      type: "select",
      span: 8,
      wrapperCol: { span: 14 },
      labelCol: { span: 10 },
      options: SettleTypeOptions
    },
    {
      Tips: "Data source type",
      name: "DataSourceType",
      required: true,
      visiable: false,
      type: "select",
      options: DataSourceTypeOptions,
      span: 8,
      style: { position: "absolute", bottom: "20px", left: 0 },
      wrapperCol: { span: 14 },
      labelCol: { span: 10 }
    },
    {
      Tips: "Inbound-Dest.",
      name: "InboundDestinaiton",
      required: false,
      type: "tags-all",
      span: 8,
      offset: 8,
      wrapperCol: { span: 14 },
      labelCol: { span: 10 },
      initialValue: [],
      options: []
    },
    {
      Tips: "Outbound-Dest.",
      name: "OutboundDestinaiton",
      required: false,
      span: 8,
      wrapperCol: { span: 14 },
      labelCol: { span: 10 },
      type: "tags-all",
      initialValue: [],
      options: []
    },
    {
      Tips: "Inbound-item",
      name: "InboundItem",
      required: false,
      type: "select",
      span: 8,
      offset: 8,
      wrapperCol: { span: 14 },
      labelCol: { span: 10 },
      options: InboundItemOptions
    },
    {
      Tips: "Outbound-item",
      name: "OutboundItem",
      required: false,
      span: 8,
      wrapperCol: { span: 14 },
      // style: {marginTop:'-28px'},
      labelCol: { span: 10 },
      type: "select",
      options: InboundItemOptions
    }
  ];
  private baseInfoFormOptions: any = [
    {
      Tips: "Service",
      decorator: "Service",
      required: true,
      type: "select",
      options: null
    },
    {
      Tips: "Account",
      decorator: "Account",
      required: true,
      type: "select",
      options: null
    },
    {
      Tips: "Charge type",
      decorator: "ChargeType",
      required: true,
      type: "select",
      options: this.ChargeTypeOptions
    },
    {
      Tips: "Direction",
      decorator: "Direction",
      required: true,
      type: "select",
      options: this.DirectionOptions
    },
    {
      Tips: "Cycle",
      decorator: "Cycle",
      required: true,
      type: "select",
      options: this.CyclesOptions
    },
    {
      Tips: "Month",
      decorator: "Month",
      required: true,
      type: "picker-month"
    },
    {
      Tips: "Begin date",
      decorator: "BeginDate",
      required: true,
      type: "picker",
      disabled: true
    },
    {
      Tips: "End date",
      decorator: "EndDate",
      required: true,
      type: "picker",
      disabled: true
    }
  ];
  /* 筛选栏 button-数据
       @param name: button 名字
       @param icon: button 图标
    */
  // a-col的表头宽度设置
  public RowWidthFunc(item: any) {
    if (item.dataIndex == "Account") {
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
      dataIndex: "Account"
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
      name: "Settle period",
      dataIndex: "SettlePeriod"
    },
    {
      name: "Statement Number",
      dataIndex: "StatementNumber"
    }
  ];
  private dataBefore: any = {
    Account: "",
    Service: "",
    ChargeType: "",
    Direction: "",
    Month: "",
    Cycle: "",
    SettlePeriod: "",
    BillingType: "",
    StatementNumber: ""
  };

  private selectName: any = ""; // 点击操作栏的标识
  private direction: any = ""; // 方向
  private selectkeyArr: any = []; // 表格勾选中的key

  // 弹出框 modal  内容
  private inboundFormOptions = inboundFormOptions();
  private outboundFormOptions = outboundFormOptions();
  private nettingdFormOptions = nettingdFormOptions();
  private nettingObj = nettingObj();

  // 高级搜索 generate -> 回调
  public SearchOk(formData: any) {
    console.log("formData", formData);

    this.searchData = formData;
    this.selectChange(formData, name);
    const StatementNumber = this.createStatementNumber();
    let ChargeType = formData["ChargeType"],
      Direction = formData["Direction"],
      Account = formData["Account"],
      Service = formData["Service"],
      Month = formData["Month"],
      Cycle = formData["Cycle"],
      BeginDate = formData["BeginDate"],
      EndDate = formData["EndDate"];
    const oldData: object = {
      Account: "",
      Service: "IDD",
      ChargeType: "",
      Direction: "Inbound",
      Month: "",
      Cycle: "",
      SettlePeriod: "",
      BillingType: "Netting_Statement",
      StatementNumber
    };
    if (
      formData["SettleType"] === 1 &&
      formData["DataSourceType"] === 1 &&
      formData["Direction"] === 3 &&
      formData["InboundDestinaiton"].length === 0 &&
      formData["OutboundDestinaiton"].length === 0
    ) {
      this.$message.warning(
        "Inbound-Dest. and Outbound-Dest. must have a value"
      );
    }
    setTimeout(() => {
      this.dataBeforeColumns.forEach((item: any) => {
        if (formData[item.dataIndex]) {
          this.dataBefore[item.dataIndex] = formData[item.dataIndex] || "";
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
        if (item.dataIndex === "Month") {
          this.dataBefore[item.dataIndex] = moment(formData["BeginDate"])
            .startOf("month")
            .format("YYYYMM");
        }
        if (item.dataIndex === "Cycle") {
          this.dataBefore[item.dataIndex] = formData["Cycle"];
          console.log("formData", formData["Cycle"]);
          this.dataBefore[item.dataIndex] = moment(formData["BeginDate"])
            .startOf("month")
            .format("YYYYMM");
        }
        if (
          Account == "CMCC" &&
          ChargeType == 2 &&
          Service == "IDD" &&
          Direction == 3 &&
          Cycle == "201901"
        ) {
          if (item.dataIndex == "StatementNumber") {
            this.dataBefore[item.dataIndex] = StatementNumberOptions[0].name;
          }
          this.data = StatementRows;
          statementColumns[2].children[1].title = HeaderTitle[1].name;
          statementColumns[3].children[1].title = HeaderTitle[1].name;
        }
        if (
          Account == "CMHK" &&
          ChargeType == 1 &&
          Service == "IDD" &&
          Direction == 3 &&
          moment(BeginDate).format("YYYY-MM-DD") == "2019-01-01"
        ) {
          if (item.dataIndex == "StatementNumber") {
            this.dataBefore[item.dataIndex] = StatementNumberOptions[1].name;
          }
          this.data = statementData;
          statementColumns[2].children[1].title = HeaderTitle[2].name;
          statementColumns[3].children[1].title = HeaderTitle[2].name;
        }
        if (
          Account == "KDDI" &&
          ChargeType == 2 &&
          Service == "IDD" &&
          Direction == 3 &&
          Cycle == "201801"
        ) {
          if (item.dataIndex == "StatementNumber") {
            this.dataBefore[item.dataIndex] = StatementNumberOptions[2].name;
          }
          this.data = StatementIDDS;
          statementColumns[2].children[1].title = HeaderTitle[0].name;
          statementColumns[3].children[1].title = HeaderTitle[0].name;
        }
        if (
          Account == "KT" &&
          ChargeType == 2 &&
          Service == "IDD" &&
          Direction == 2 &&
          Cycle == "201801"
        ) {
          if (item.dataIndex == "StatementNumber") {
            this.dataBefore[item.dataIndex] = StatementNumberOptions[3].name;
          }
          this.data = StatementKTS;
          statementColumns[2].children[1].title = HeaderTitle[0].name;
          statementColumns[3].children[1].title = HeaderTitle[0].name;
        }
        if (
          Account == "KT" &&
          ChargeType == 2 &&
          Service == "IDD" &&
          Direction == 3 &&
          Cycle == "201901"
        ) {
          if (item.dataIndex == "StatementNumber") {
            this.dataBefore[item.dataIndex] = StatementNumberOptions[4].name;
          }
          this.data = StatementKTTS;
          statementColumns[2].children[1].title = HeaderTitle[0].name;
          statementColumns[3].children[1].title = HeaderTitle[0].name;
        }
      });
    }, 500);
  }

  public monthPickerChange(formData: any, name: string) {
    this.commomBaseInfoSelectChange(
      formData,
      this.formOptions,
      this.$refs.AdvancedSearch,
      name
    );
  }

  public selectChange(formData: any, name: string) {
    
    this.data = [];
    this.dataBefore = {
      Account: "",
      Service: "",
      ChargeType: "",
      Direction: "",
      Month: "",
      Cycle: "",
      SettlePeriod: "",
      BillingType: "",
      StatementNumber: ""
    };
    const AdvancedSearch: any = this.$refs.AdvancedSearch;
    this.commomBaseInfoSelectChange(
      formData,
      this.formOptions,
      this.$refs.AdvancedSearch,
      name
    );
    this.getDestinationsOptionsFunc(formData, name);
    this.formOptions.forEach((item: any) => {
      this.changeDestinaitonStatus(item, formData);
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

    if (name === "Account" || name === "Service" || name === "Direction") {
      let data = {
        accountName: formData["Account"],
        serviceName: formData["Service"],
        direction: formData["Direction"]
      };
      getCyclesOptions({ params: data }).then((res: any) => {
        // console.log(res);
        this.formOptions[4].options = res;
        this.CyclesOptions = res;
      });
    }
  }
  // 修改 inbound/outbound  Destinaiton inbound/outbound item 状态
  private changeDestinaitonStatus(item: any, formData: any): any {
    let refs: any = this.$refs.AdvancedSearch;
    if (formData["SettleType"] == 2) {
      if (item.name == "DataSourceType") {
        item.disabled = true;
        item.required = false;
      }
      if (
        item.name == "InboundDestinaiton" ||
        item.name == "OutboundDestinaiton" ||
        item.name == "OutboundItem" ||
        item.name == "InboundItem"
      ) {
        item.disabled = true;
        refs.setFieldsValue({
          DataSourceType: undefined,
          InboundDestinaiton: undefined,
          OutboundDestinaiton: undefined,
          OutboundItem: undefined,
          InboundItem: undefined
        });
        return;
      }
    } else {
      if (item.name == "DataSourceType") {
        item.required = true;
        item.disabled = false;
      }
      if (formData["DataSourceType"] === 2) {
        if (
          item.name == "InboundDestinaiton" ||
          item.name == "OutboundDestinaiton" ||
          item.name == "OutboundItem" ||
          item.name == "InboundItem"
        ) {
          item.disabled = true;
        }
        refs.setFieldsValue({
          InboundDestinaiton: undefined,
          OutboundDestinaiton: undefined,
          OutboundItem: undefined,
          InboundItem: undefined
        });
      } else {
        if (
            item.name == "OutboundDestinaiton" ||
            item.name == "OutboundItem" ||
            item.name == "InboundDestinaiton" ||
            item.name == "InboundItem"
          ) {
            this.$set(item,'disabled',false);
            this.$set(item,'required',false);
          }

        if (formData["Direction"]) {
          if (formData["Direction"] === 2) {
            if (
              item.name == "InboundDestinaiton" ||
              item.name == "InboundItem"
            ) {
              item.disabled = true;
              item.required = false;
              item.name === 'InboundDestinaiton'?item.initialValue = []:item.initialValue;
            }
            if (
              item.name == "OutboundDestinaiton" ||
              item.name == "OutboundItem"
            ) {
              item.disabled = false;
              item.required = true;
            }
            refs.setFieldsValue({
              InboundItem: undefined
            });
          } else if (formData["Direction"] === 1) {
            if (
              item.name == "OutboundDestinaiton" ||
              item.name == "OutboundItem"
            ) {
              item.name === 'OutboundDestinaiton'?item.initialValue = []:item.initialValue;
              item.disabled = true;
              item.required = false;
            }
            if (
              item.name == "InboundDestinaiton" ||
              item.name == "InboundItem"
            ) {
              item.disabled = false;
              item.required = true;
            }
            refs.setFieldsValue({
              OutboundItem: undefined
            });
          }
        }
      }
    }
  }

  /* 用户手动选择/取消选择所有列的回调  Table -> 回调 */
  public onSelectAll(selected: any, selectedRows: any, changeRows: any) {
    // console.log(selected, selectedRows, changeRows);
    this.selectkeyArr = selected;
  }

  /* 用户手动选择/取消选择某列的回调
         @param record: 选中数据
         @param selected: 是否选中 true/false
         @param selectedRows: 所有选中 Array
      */
  public onSelect(record: object, selected: boolean, selectedRows: any) {
    // console.log(record, selected, selectedRows);
    this.selectkeyArr = selected;
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
    this.selectName = msg;
    if (msg === "Export") {
      this.toExport();
    } else if (msg == "Add") {
      this.inboundFormOptions.forEach((it: any) => {
        it.disabled = true;
      });
      this.outboundFormOptions.forEach((it: any) => {
        it.disabled = true;
      });
      this.visible = true;
      this.nettingObj = {
        inbound: undefined,
        outbound: undefined,
        netting: {
          Amount_USD: undefined,
          ExchangeDate: undefined
        }
      };
    }
  }

  private toExport() {
    if (!this.data || !this.data.length) {
      this.$message.warning("Please issue a bill before exporting the data");
      return;
    }
    this.$nextTick(() => {
      const dataBefore = this.dataBefore;
      let name = `${this.searchData.Account}_${
        dataBefore.Service
      }_Mixed_Traffic_Netting_Statement_${
        this.searchData.Month
          ? moment(this.searchData.Month["_d"]).format("YYYY/MM")
          : this.searchData.Cycle
      }.xlsx`;
      if (this.data == StatementRows) {
        downloadLocalFiles(
          "file/NettingStatement-VC-CMCC-201901.xlsx",
          "NettingStatement-VC-CMCC-201901.xlsx"
        );
      } else if (this.data == statementData) {
        downloadLocalFiles(
          "file/NettingStatement-Hubbing-CMHK-201901.xlsx",
          "NettingStatement-Hubbing-CMHK-201901.xlsx"
        );
      } else if (this.data == StatementIDDS) {
        downloadLocalFiles(
          "file/NettingStatement-VC-KDDI-201801.xlsx",
          "NettingStatement-VC-KDDI-201801.xlsx"
        );
      } else if (this.data == StatementKTS) {
        //18
        downloadLocalFiles(
          "file/NettingStatement-VC-Kt-201801.xlsx",
          "NettingStatement-VC-Kt-201801.xlsx"
        );
      } else if (this.data == StatementKTTS) {
        //19
        downloadLocalFiles(
          "file/NettingStatement-VC-KT-201901.xlsx",
          "NettingStatement-VC-KT-201901.xlsx"
        );
      }
      // antd表头和body 在不同的table上  下列操作为合并
      // let table = document.createElement("table"); //创建一个li节点
      // const tableRef: any = this.$refs.table;
      // const list = tableRef.$el.querySelectorAll(".ant-table-fixed");

      // let html: string = "";
      // for (let i = 0; i < list.length; i++) {
      //   html += list[i].innerHTML;
      // }
      // table.innerHTML = html;
      // const sheet: any = xlsx.utils.table_to_sheet(table); //将一个table对象转换成一个sheet对象
      // const dataBefore = this.dataBefore;
      // // const find = BillingTypeOptions.find((inner: any) => inner.value === dataBefore.BillingType)
      // this.openDownloadDialog(
      //   this.sheet2blob(sheet),
      //   `${this.searchData.Account}_${
      //     dataBefore.Service
      //   }_Mixed_Traffic_Netting_Statement_${
      //     this.searchData.Month
      //       ? moment(this.searchData.Month["_d"]).format("YYYY-MM")
      //       : this.searchData.Cycle
      //   }.xlsx`
      // );
    });
  }

  private toEdit(): void {}

  /* 退出 */
  handleReturn(str: any) {
    this.visible = !this.visible;
  }

  private rowClassName(record: any, index: any) {
    if (record.subheading) {
      return "subheading";
    } else if (record.headline) {
      return "headline";
    }
    return "";
  }

  // base 选择框回调
  private baseInfoSelectChange(formData: any, name: string): void {
    // console.log(formData)
    if (this.selectName === "Add") {
      const inboundInfoFormGroup: any = this.$refs.inboundInfoFormGroup;
      const outboundInfoFormGroup: any = this.$refs.outboundInfoFormGroup;
      if (formData.Direction === 1) {
        this.inboundFormOptions.forEach((it: any) => {
          it.disabled = false;
        });
          inboundInfoFormGroup.setFieldsValue({
            Inbound_Currency:'USD'
          })
          this.outboundFormOptions.forEach((it: any) => {
          it.disabled = true;
        });
          outboundInfoFormGroup.setFieldsValue({
            Outbound_Amount: undefined,
            Outbound_Calls: undefined,
            Outbound_Currency: undefined,
            Outbound_Mins: undefined
          });
       
      }
      if (formData.Direction === 2) {
        this.outboundFormOptions.forEach((it: any) => {
          it.disabled = false;
           });
          outboundInfoFormGroup.setFieldsValue({
            Outbound_Currency:'USD'
          })
          this.inboundFormOptions.forEach((it: any) => {
          it.disabled = true;
        });
          inboundInfoFormGroup.setFieldsValue({
            Inbound_Amount: undefined,
            Inbound_Calls: undefined,
            Inbound_Mins: undefined,
            Inbound_Currency: undefined
          });
      }
      if(formData.Direction === 3){
        inboundInfoFormGroup.setFieldsValue({
            Inbound_Currency:'USD'
          })
         outboundInfoFormGroup.setFieldsValue({
            Outbound_Currency:'USD'
          })
          this.inboundFormOptions.forEach((it: any) => {
          it.disabled = false;
        });
          this.outboundFormOptions.forEach((it: any) => {
          it.disabled = false;
           });
      }
      if (formData.Direction == 1) {
        this.nettingObj.outbound = undefined;
      } else if (formData.Direction == 2) {
        this.nettingObj.inbound = undefined;
      }
      // 切换重新计算
      this.calculatorTotal(false);

      this.commomBaseInfoSelectChange(
        formData,
        this.baseInfoFormOptions,
        this.$refs.baseInfoFormGroup,
        name
      );
      if(formData.Direction === 1 || formData.Direction === 3){
      this.$set(this.inboundFormOptions[1],'initialValue','USD')
    }
    if(formData.Direction === 2 || formData.Direction === 3){
        this.$set(this.outboundFormOptions[1],'initialValue','USD')
    }
    }
  }

  // base 日期选择框回调
  private baseInfoPickerChange(formData: any, name: string): void {
    this.commomBaseInfoSelectChange(
      formData,
      this.baseInfoFormOptions,
      this.$refs.baseInfoFormGroup,
      name
    );
  }

  private inboundSelectChange(formData: any) {
    console.log("1", formData);
    this.nettingObj.inbound = formData;
    this.calculatorTotal();
  }

  private outboundSelectChange(formData: any) {
    console.log("2", formData);
    this.nettingObj.outbound = formData;
    this.calculatorTotal();
  }

  private nettingSelectChange(formData: any) {
    console.log("3", formData);
    this.nettingObj.netting = formData;
    this.calculatorTotal();
  }

  // 计算 inbound 与 outbound 的差值
  private calculatorTotal(isCheck: boolean = true): void {
    const baseInfoFormGroup: any = this.$refs.baseInfoFormGroup;
    const baseInfoFormGroups = baseInfoFormGroup.getFieldsValue();
    const nettingInfoFormGroup: any = this.$refs.nettingInfoFormGroup;
    if (isCheck) {
      const baseInfoData = baseInfoFormGroup.validateFields();
      if (!baseInfoData) {
        return;
      }
    }
    let rate: any = [
      {
        name: "RMB",
        value: 1
      },
      {
        name: "HDK",
        value: 0.1278
      },
      {
        name: "JPY",
        value: 0.009164
      },
      {
        name: "USD",
        value: 1
      },
      {
        name: "UDY",
        value: 1
      },
      {
        name: "TUE",
        value: 1
      },
      {
        name: "EUR",
        value: 1.1034
      },
      {
        name: "SDR",
        value: 1.37
      },
      {
        name: "CNY",
        value: 0.1428
      }
    ];
    let Amount_USD1: any;
    let Amount_USD2: any;
    let Amount_USD: any;
    nettingInfoFormGroup.setFieldsValue({
      Amount_USD: 0
    });
    if (this.nettingObj.inbound) {
      rate.forEach((item: any) => {
        if (this.nettingObj.inbound) {
          if (this.nettingObj.inbound.Inbound_Currency === item.name) {
            Amount_USD1 = (
              this.nettingObj.inbound.Inbound_Amount * item.value
            ).toFixed(4);
            if (baseInfoFormGroups.Direction === 1) {
              nettingInfoFormGroup.setFieldsValue({
                Amount_USD: Amount_USD1
              });
            }
          }
        }
      });
    }
    if (this.nettingObj.outbound) {
      rate.forEach((item: any) => {
        if (this.nettingObj.outbound.Outbound_Currency === item.name) {
          Amount_USD2 = (
            this.nettingObj.outbound.Outbound_Amount * item.value
          ).toFixed(4);
          if (baseInfoFormGroups.Direction === 2) {
            nettingInfoFormGroup.setFieldsValue({
              Amount_USD: Amount_USD2
            });
          }
        }
      });
    }
    if (baseInfoFormGroups.Direction === 3) {
      if (Amount_USD1 && Amount_USD2) {
        Amount_USD = (Amount_USD1 - Amount_USD2).toFixed(4);
        nettingInfoFormGroup.setFieldsValue({
          Amount_USD: Amount_USD
        });
      }
    }
    //   // 判断是否需要汇率日期必填
    //   let isNeedRate = false
    //   for (let key in this.nettingObj) {
    //     const item = this.nettingObj[key]
    //     if (key !== 'netting' && item && typeof item == 'object') {
    //       if (item.Currency != 'USD') {
    //         isNeedRate = true
    //       }
    //     }
    //   }
    //   // let isNeedRate =
    //   //   (this.nettingObj.inbound &&
    //   //     this.nettingObj.inbound.Inbound_Currency != 'USD') ||
    //   //   (this.nettingObj.outbound &&
    //   //     this.nettingObj.outbound.Outbound_Currency != 'USD');
    //   //  console.log('isNeedRate', isNeedRate)

    //    // 将 netting data 设置费率日期选择框
    //   this.nettingdFormOptions.forEach((item: any) => {
    //     if (item.decorator === "ExchangeDate") {
    //       item.required = isNeedRate;
    //       item.disabled = !isNeedRate;
    //     }
    //   });
    //   // // 根据时间 this.nettingObj.netting.ExchangeDate 取出费率
    //   // // 转换inbound和outbound 每一个金额为 USD
    //   let rate: any = [
    //     {
    //         name: "RMB",
    //         value: 1
    //       },
    //       {
    //         name: "HDK",
    //         value: 0.1278
    //       },
    //       {
    //         name: "JPY",
    //         value: 0.009164
    //       },
    //       {
    //         name: "USD",
    //         value: 1
    //       },
    //       {
    //         name: "UDY",
    //         value: 1
    //       },
    //       {
    //         name: "TUE",
    //         value: 1
    //       },
    //       {
    //         name: "EUR",
    //         value: 1.1034
    //       },
    //       {
    //         name: "SDR",
    //         value: 1.37
    //       }
    //   ];
    //   if (this.nettingObj.netting && this.nettingObj.netting.ExchangeDate) {
    //     rate = [
    //       {
    //         name: "RMB",
    //         value: 1
    //       },
    //       {
    //         name: "HDK",
    //         value: 0.1278
    //       },
    //       {
    //         name: "JPY",
    //         value: 0.009164
    //       },
    //       {
    //         name: "USD",
    //         value: 1
    //       },
    //       {
    //         name: "UDY",
    //         value: 1
    //       },
    //       {
    //         name: "TUE",
    //         value: 1
    //       },
    //       {
    //         name: "EUR",
    //         value: 1.1034
    //       },
    //       {
    //         name: "SDR",
    //         value: 1.37
    //       }
    //     ];
    //   }
    //   let Amount_USD: any = 0;
    //   if (this.nettingObj.inbound) {
    //     let inRateIndex: any =
    //       this.nettingObj.inbound && this.nettingObj.inbound.Inbound_Currency
    //         ? this.nettingObj.inbound.Inbound_Currency - 1
    //         : 0;
    //     let outRateIndex: any =
    //       this.nettingObj.outbound && this.nettingObj.outbound.Outbound_Currency
    //         ? this.nettingObj.outbound.Outbound_Currency - 1
    //         : 0;
    //     const inBoundAmount: any = this.nettingObj.inbound
    //       ? +this.nettingObj.inbound.Inbound_Amount * rate[+inRateIndex].value
    //       : 0;
    //     Amount_USD =
    //       inBoundAmount -
    //       (this.nettingObj.outbound
    //         ? +this.nettingObj.outbound.Outbound_Amount *
    //           rate[+outRateIndex].value
    //         : 0);
    //   } else {
    //     let outRateIndex: any =
    //       this.nettingObj.outbound && this.nettingObj.outbound.Outbound_Currency
    //         ? this.nettingObj.outbound.Outbound_Currency - 1
    //         : 0;
    //     Amount_USD = this.nettingObj.outbound
    //       ? +this.nettingObj.outbound.Outbound_Amount * rate[+outRateIndex].value
    //       : 0;
    //   }
    //   // // 当 nettingdFormOptions 的 ExchangeDate为必选并且没有值时设置为0
    //   setTimeout(() => {
    //     const inboundInfoFormGroup: any = this.$refs.inboundInfoFormGroup;
    //     const inboundInfoFormGroups = inboundInfoFormGroup.getFieldsValue()
    //     const nettingInfoFormGroup: any = this.$refs.nettingInfoFormGroup;
    //     const nettingInfoFormGroups = nettingInfoFormGroup.getFieldsValue()
    //     console.log('nettingInfoFormGroup',inboundInfoFormGroups);
    //     const value: any =
    //       this.nettingdFormOptions[1].required &&
    //       !this.nettingObj.netting.ExchangeDate
    //         ? 0
    //         : Amount_USD.toFixed(4);
    //     nettingInfoFormGroup.setFieldsValue({
    //       Amount_USD: value
    //     });
    //   }, 300);
  }

  // model 弹出框点击 save按钮
  private async save() {
    const baseInfoFormGroup = this.$refs.baseInfoFormGroup;
    const baseInfoFormGroups = baseInfoFormGroup.getFieldsValue();
    console.log("baseInfoFormGroups", baseInfoFormGroups);
    const inboundInfoFormGroup = this.$refs.inboundInfoFormGroup;
    const inboundInfoFormGroups = inboundInfoFormGroup.getFieldsValue();
    console.log("inboundInfoFormGroups", inboundInfoFormGroups);
    const outboundInfoFormGroup = this.$refs.outboundInfoFormGroup;
    const outboundInfoFormGroups = outboundInfoFormGroup.getFieldsValue();
    console.log("outboundInfoFormGroups", outboundInfoFormGroups);
    const nettingInfoFormGroup = this.$refs.nettingInfoFormGroup;
    const nettingInfoFormGroups = nettingInfoFormGroup.getFieldsValue();
    console.log("nettingInfoFormGroups", nettingInfoFormGroups);
    if (this.selectName === "Add") {
      let data: any = {
        serviceName: baseInfoFormGroups.Service,
        accountName: baseInfoFormGroups.Account,
        chargeType: baseInfoFormGroups.ChargeType,
        direction: baseInfoFormGroups.Direction,
        nettingCycle: baseInfoFormGroups.Cycle,
        nettingMonth: moment(baseInfoFormGroups.Month).format("YYYY-MM"),
        beginDate: moment(baseInfoFormGroups.BeginDate).format("YYYY-MM-DD"),
        endDate: moment(baseInfoFormGroups.EndDate).format("YYYY-MM-DD"),
        amountReceivable: inboundInfoFormGroups.Inbound_Amount,
        amountPayableUsd: 0,
        amountReceivableUsd: 0,
        inboundDuration: inboundInfoFormGroups.Inbound_Mins,
        inboundCalls: inboundInfoFormGroups.Inbound_Calls,
        inboundCurrency: inboundInfoFormGroups.Inbound_Currency,
        amountPayable: outboundInfoFormGroups.Outbound_Amount,
        outboundDuration: outboundInfoFormGroups.Outbound_Mins,
        outboundCalls: outboundInfoFormGroups.Outbound_Calls,
        outboundCurrency: outboundInfoFormGroups.Outbound_Currency,
        exchangeDate: moment(nettingInfoFormGroups.ExchangeDate).format(
          "YYYY-MM"
        ),
        amountUsd: nettingInfoFormGroups.Amount_USD,
        id: undefined
      };
      await NettingStatementAdd(data).then((resp: recodeConfig) => {
        if (resp.code == 1) {
          this.visible = false;
        }
      });
    }
  }

  public getDestinationsOptionsFunc(formData: any, name: any) {
    if (
      name === "Account" ||
      name === "Service" ||
      name === "Direction" ||
      name === "Cycle" ||
      name === "Month"
    ) {
      let data = {
        accountName: formData["Account"] ? formData["Account"] : undefined,
        serviceName: formData["Service"] ? formData["Service"] : undefined,
        direction: formData["Direction"] ? formData["Direction"] : undefined
      };
      // if (formData["Month"]&&formData["Cycle"]==undefined||formData["Cycle"]=='-') {
      //   data["endDate"] =
      //     moment(formData["Month"])
      //       .endOf("month")
      //       .format("YYYY-MM-DD") ||
      //     moment(formData["billingMonth"])
      //       .endOf('month')
      //       .format("YYYY-MM-DD");
      //   data["beginDate"] =
      //     moment(formData["Month"])
      //       .startOf('month')
      //       .format("YYYY-MM-DD") ||
      //     moment(formData["billingMonth"])
      //       .startOf('month')
      //       .format("YYYY-MM-DD");
      //       console.log(formData["Month"]);
      //       console.log(moment(formData["Month"])
      //       .subtract(1, "days"));

      //       console.log(formData["Month"]);

      // }
      // if (formData["Cycle"]) {
      //   this.CyclesOptions.forEach((element: any) => {
      //     if (
      //       element.name === formData["Cycle"] ||
      //       element.name === formData["billingCycle"]
      //     ) {
      //       data["beginDate"] = element.BeginDate;
      //       data["endDate"] = element.EndDate;
      //     }
      //   });
      // }
      getDestinationsOptions({ params: data }, false).then((res: any) => {
        this.DestinationOptions = res;
        res.forEach((ele: any) => {
          if (ele.direction === 1) {
            this.formOptions[10].options = ele.data;
          }
          if (ele.direction === 2) {
            this.formOptions[11].options = ele.data;
          }
        });
      });
    }
  }

  public async created() {
    let AccountOptions = await getAccountOptions();
    let ServiceOptions = await getServiceOptions();
    let CurrencyOptions = await getCurrencyOptions();
    let CyclesOptions = await getCyclesOptions();
    this.formOptions[0]["options"] = ServiceOptions;
    this.baseInfoFormOptions[0]["options"] = ServiceOptions;
    this.formOptions[1]["options"] = AccountOptions;
    this.baseInfoFormOptions[1]["options"] = AccountOptions;
    this.inboundFormOptions[1].options = CurrencyOptions;
    this.outboundFormOptions[1].options = CurrencyOptions;
    this.formOptions[4]["options"] = CyclesOptions;
    this.baseInfoFormOptions[4]["options"] = CyclesOptions;
    this.CyclesOptions = CyclesOptions;

    this.getDestinationsOptionsFunc({}, "Account");
  }
}
</script>

<style lang="scss">
@import "@/views/Finance/common/css/deep-modal.scss";

.monthly.statement .ant-table-tbody tr.left td:not(:first-child) {
  text-align: left;
}

.monthly.statement .headline td:first-child {
  background-color: rgb(230, 231, 237);
  /*color: #fff;*/
  text-align: left;
  font-weight: 600;
}
.monthly.statement .subheading td {
  font-weight: 600;
  color: #000;
}
// .monthly.statement form .ant-select {
//     width: auto;
// }
</style><style lang="scss" scoped>
@import "@/views/Finance/common/css/Statement.scss";
@import "@/views/Finance/common/css/modal.scss";
</style>
<style>
/* .multiple-checkbox-style .el-input__inner,.el-input.el-input--suffix.is-focus{
  height: 30px!important;
}
.multiple-checkbox-style .el-select__tags{
  max-width: 200px!important;
} */
</style>
<style>
.netting-statement .el-input--suffix .el-input__inner {
  height: 32px !important;
  line-height: 32px !important;
}
.netting-statement .el-select__tags {
  max-width: 250px !important;
}
</style>