<template>
  <div class="data-entery statement">
    <!-- 高级搜索 -->
    <Advanced-search
      :formoptions="searchFormOptions"
      :formscreening="Formscreening"
      :needExport="false"
      searchText="Search"
      @Submit="SearchOk"
      @selectChange="selectChange"
      @btnClick="activeClick"
      ref="AdvancedSearch"
    ></Advanced-search>
    <Table
      parentKey="dataEntryId"
      :isFinance="true"
      :isNeedCheck="true"
      :selectedBtn="selectedBtn"
      @onSelectClick="onSelectClick"
      :scrollX="4500"
      ref="table"
      :lessSpace="true"
      @onSelect="onSelect"
      @onSoltClick="onSoltClick"
      @onSelectAll="onSelectAll"
      :columns="columns"
      :data="data"
      :isShowDownloadColor="true"
      :rowClassName="rowClassName"
      zebraStripe
    />
    <a-modal
      @cancel="handleReturn"
      centered
      class="edit-modal"
      width="950px"
      v-model="visible"
      v-if="visible"
      :footer="null"
      title="Logging Data"
      onOk="handleOk"
    >
      <div class="body">
        <div class="modal-box">
          <div class="modal-box-title">
            <span class="piece"></span>
            <span class="title-text">Basic information</span>
          </div>
          <form-group
            :formoptions="baseInfoFormOptions"
            @selectChange="baseInfoSelectChange"
            @uploadChange="uploadFileChange"
            @monthPickerChange="baseInfoPickerChange"
            v-if="selectName != 'modalTableVisible'"
            :span="12"
            ref="baseInfoFormGroup"
            class="form-group"
          ></form-group>
          <Table
            v-else
            :isFinance="true"
            ref="ExportTable"
            :useDefined="false"
            :columns="columns"
            :data="data"
            :rowClassName="rowClassName"
            :isPagination="false"
            zebraStripe
          />
        </div>
        <div class="modal-box" v-if="selectName != 'modalTableVisible'">
          <div class="modal-box-title">
            <span class="piece"></span>
            <span class="title-text">Settle information</span>
          </div>
          <div v-show="direction == 1|| direction == 3">
            <!--Inbound data-->
            <div style="margin-left:44px;margin-top: 20px;font-weight: 700;">Inbound data</div>
            <form-group
              :formoptions="Inbound_settleInfoFormOptions"
              :span="12"
              ref="Inbound_settleInfoFormOptions"
              class="form-group"
            ></form-group>
            <Table-input
              class="form-group"
              :key="1"
              @inputChange="inboundInputChange"
              :collapseTags="true"
              :multipleCheckBoxStyle="'data-entry'"
              :inputcolumns="inboundSettleInfoColumns"
              :Check="false"
              :btnDisabled="tableInputDisabled"
              border
              @select="InboundTableSelectFunc"
              :initData="inboundInitData"
              @deleteChange="dele"
              ref="InboundTableInput"
            />
          </div>
          <div v-show="direction == 2|| direction == 3">
            <!--Outbound data-->
            <div style="margin-left:44px;margin-top: 20px;font-weight: 700;">Outbound data</div>
            <form-group
              :formoptions="Outbound_settleInfoFormOptions"
              :span="12"
              ref="Outbound_settleInfoFormOptions"
              class="form-group"
            ></form-group>
            <Table-input
              class="form-group"
              :key="2"
              @inputChange="outboundInputChange"
              :inputcolumns="outboundSettleInfoColumns"
              :collapseTags="true"
              :multipleCheckBoxStyle="'data-entry'"
              :Check="false"
              :btnDisabled="tableInputDisabled"
              @select="OutboundTableSelectFunc"
              :initData="outboundInitData"
              @deleteChange="dele2"
              border
              ref="OutboundTableInput"
            />
          </div>
        </div>
        <div class="modal-box" v-if="selectName != 'modalTableVisible'">
          <div class="modal-box-title">
            <span class="piece"></span>
            <span class="title-text">Netting data</span>
          </div>
          <form-group
            :formoptions="nettingDataFormOptions"
            :span="12"
            ref="nettingFormGroup"
            class="form-group"
          ></form-group>
        </div>
      </div>
      <div style="padding-top: 20px;text-align: center">
        <a-button
          type="primary"
          class="save-btn"
          @click="save"
          v-if="selectName != 'modalTableVisible'"
          v-show="showBtn"
        >Save</a-button>
        <a-button class="return-btn" @click="handleReturn">Return</a-button>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { numberReg, numberPointLimitReg } from "@/common/RegExp/number";
import { data, statusOptions, lockedDateOptions, columns } from "./Test";
import {
  ChargeTypeOptions,
  DirectionOptions,
  BillingTypeOptions,
  ChargeableUnitTypeOptions
} from "@/views/Finance/common/data/index.ts";
import {
  getAccountOptions,
  getServiceOptions,
  getCyclesOptions,
  getDestinationsOptions,
  getCurrencyOptions,
  UploadCndnFile
} from "@/views/Finance/common/js/exchangeData.ts";
import { AxiosGet, AxiosDelete } from "@/api/axios";
import moment from "moment";
import axios from "axios";
import financeMixin from "@/views/Finance/common/js/mixin.ts";
import xlsx from "xlsx";
import { deepClone } from "@/assets/ts/index";
import {
  ReconciliationDataEntyAdd,
  ReconciliationDataEntySearch,
  ReconciliationDataEntyEdit,
  ReconciliationDataEntyExport
} from "@/api/index.ts";
import { refsConfig, recodeConfig } from "@/assets/ts/config.d";
@Component({
  components: {
    AdvancedSearch: () =>
      import("@/views/Finance/components/Advancedsearch/index.vue"),
    Table: () => import("@/views/Finance/components/Table/index.vue"),
    // pagination: () => import("@/common/pagination/index.vue"),
    // model: () => import('@/common/Model/index.vue')
    formGroup: () => import("@/views/Finance/components/form-group/index.vue"),
    TableInput: () => import("@/views/Finance/components/table-input/index.vue")
  },
  mixins: [financeMixin]
})
export default class DataEntery extends Vue {
  public ServiceOptions: any = [];
  public AccountOptions: any = [];
  public data: any = [];
  public CyclesOptions: any = [];
  public CurrencyOptions: any = [];
  public DestinationOptions: any = [];
  public DestinationOptions2: any = [];
  public columns: any[] = columns;
  private selectkeyArr: any = [];
  private searchData: any;
  private showBtn: boolean = true;
  private checkedEditData: any = {};
  // 上传文件的保存文件对象的变量
  public formDataObj: any = undefined;
  public $refs: refsConfig | any;
  private DirectionOptions: any[] = DirectionOptions();
  private BillingTypeOptions: any[] = BillingTypeOptions();
  private ChargeTypeOptions: any[] = ChargeTypeOptions();
  private ChargeableUnitTypeOptions: any[] = ChargeableUnitTypeOptions();

  private selectedBtn: any = [
    {
      name: "Add",
      icon: "plus-circle",
      // style: {backgroundColor: '#316ad7', color: '#fff'},
      index: 0
    },
    {
      name: "Edit",
      icon: "edit",
      index: 1,
      disabled: true
    },
    {
      name: "Delete",
      icon: "delete",
      style: {
        color: "#f5b148",
        borderColor: "#f5b148"
      },
      index: 2,
      disabled: true
    },
    {
      name: "Details",
      icon: "file-text",
      index: 3,
      disabled: true
    },
    {
      name: "Export",
      icon: "export",
      index: 4,
      disabled: true
    },
    {
      name: "Download",
      icon: "download",
      index: 5,
      disabled: true
    }
  ];

  /* 弹出框显示/隐藏 */
  //   private onSoltClick(soltName: string, text: any, record: any, index: number) {
  //     if (soltName === "download") {
  //       this.selectName = "modalTableVisible";
  //       this.visible = true;
  //     }
  //   }

  public visible: boolean = false;
  /**  高级搜索输入框数据
   * @param name：label 值 && from输出的字段
   * @param required：是否必填 默认false && from输出的字段
   * @param type: 输入框什么类型， 例如select['下拉'], picker['时间选择器'] -> 目前只支持这俩个
   * @param options：输入框['下拉的子元素数据']
   */
  private searchFormOptions: any[] = [
    {
      Tips: "Service",
      name: "Service",
      required: false,
      type: "select",
      options: this.ServiceOptions
    },
    {
      Tips: "Account",
      name: "Account",
      required: false,
      type: "select",
      options: this.AccountOptions
    },
    {
      Tips: "Charge type",
      name: "ChargeType",
      required: false,
      type: "select",
      options: this.ChargeTypeOptions
    },
    {
      Tips: "Billing type",
      name: "BillingType",
      required: false,
      type: "select",
      options: this.BillingTypeOptions
    },
    {
      Tips: "Direction",
      name: "Direction",
      required: false,
      type: "select",
      options: this.DirectionOptions
    },
    {
      Tips: "Begin date",
      name: "BeginDate",
      required: false,
      type: "picker"
    },
    {
      Tips: "End date",
      name: "EndDate",
      required: false,
      type: "picker"
    }
  ];

  private baseInfoFormOptions: any[] = [
    {
      Tips: "Service",
      decorator: "Service",
      required: true,
      disabled: true,
      type: "select",
      options: this.ServiceOptions
    },
    {
      Tips: "Account",
      decorator: "Account",
      required: true,
      disabled: true,
      type: "select",
      options: this.AccountOptions
    },
    {
      Tips: "Charge type",
      decorator: "ChargeType",
      required: true,
      disabled: true,
      type: "select",
      options: this.ChargeTypeOptions
    },
    {
      Tips: "Billing type",
      decorator: "BillingType",
      required: true,
      disabled: true,
      type: "select",
      options: this.BillingTypeOptions
    },
    {
      Tips: "Direction",
      decorator: "Direction",
      required: true,
      disabled: true,
      type: "select",
      options: this.DirectionOptions
    },
    {
      Tips: "Cycle",
      decorator: "Cycle",
      type: "select",
      disabled: true,
      options: null
    },
    {
      Tips: "Month",
      decorator: "Month",
      disabled: true,
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
    },
    {
      Tips: "Operator files",
      decorator: "OperatorFiles",
      required: false,
      disabled: true,
      type: "upload"
    },
    {
      Tips: "Currency",
      decorator: "Currency",
      required: false,
      disabled: true,
      type: "select",
      options: null
    },
    {
      Tips: "Exchange date",
      decorator: "ExchangeDate",
      placeholderName: "Default",
      required: false,
      disabled: true,
      type: "picker-month"
    }
  ];

  private Inbound_settleInfoFormOptions: any[] = [
    {
      Tips: "Total charge traffic volume",
      decorator: "Inbound_TotalTrafficVolume",
      required: false,
      disabled: true,
      type: "input",
      labelSpan: 12,
      initialValue: undefined
    },
    {
      Tips: "Total amount (Currency)",
      decorator: "Inbound_TotalAmounts_Currency",
      required: false,
      disabled: true,
      labelSpan: 12,
      type: "input",
      initialValue: undefined
    },
    {
      Tips: "Chargable unit type",
      decorator: "Inbound_ChargableUnitType",
      required: false,
      type: "select",
      labelSpan: 12,
      initialValue: undefined,
      options: this.ChargeableUnitTypeOptions
    }
  ];

  private Outbound_settleInfoFormOptions: any[] = [
    {
      Tips: "Total charge traffic volume",
      decorator: "Outbound_TotalTrafficVolume",
      required: false,
      disabled: true,
      type: "input",
      labelSpan: 12
    },
    {
      Tips: "Total amount (Currency)",
      decorator: "Outbound_TotalAmounts_Currency",
      required: false,
      disabled: true,
      type: "input",
      labelSpan: 12
    },
    {
      Tips: "Chargable unit type",
      decorator: "Outbound_ChargableUnitType",
      required: false,
      type: "select",
      options: this.ChargeableUnitTypeOptions,
      labelSpan: 12
    }
  ];

  private nettingDataFormOptions: any[] = [
    {
      Tips: "Amount(Currency)",
      decorator: "Amount_Currency",
      required: false,
      disabled: true,
      type: "input"
    },
    {
      Tips: "Amount(USD)",
      decorator: "Amount_USD",
      required: false,
      disabled: true,
      type: "input"
    },
    {
      Tips: "Remark",
      decorator: "Remark",
      required: false,
      type: "textarea",
      isAlign: true,
      span: 24,
      labelSpan: 4,
      wrapperSpan: 19
    }
  ];
  private settleInfoColumns: any[] = [
    {
      title: "No.",
      dataIndex: "No",
      key: "No",
    },
    {
      title: "Destination",
      dataIndex: "Destination",
      type: "tabs",
      require: true,
      width: "200px",
      initialValue: [],
      options: []
    },
    {
      title: "Calls",
      dataIndex: "Calls",
      type: "input",
      require: true,
      pattern: numberReg,
      message: 'Charge traffic volume can only contain positive numbers',
    },
    {
      title: "Mins",
      dataIndex: "Mins",
      type: "input",
      require: true,
      pattern: numberReg,
      message: 'Charge traffic volume can only contain positive numbers',
    },
    {
      title: "Charge traffic volume",
      dataIndex: "ChargeTrafficVolume",
      type: "input",
      require: true,
      pattern: numberReg,
      message: 'Charge traffic volume can only contain positive numbers',
    },
    {
      title: "Amount (Currency)",
      dataIndex: "Amounts_Currency",
      type: "input",
      require: false,
      pattern: numberPointLimitReg,
      message: 'Amount (Currency) can only contain numbers',
    }
  ];

  private inboundSettleInfoColumns: any[] = deepClone(this.settleInfoColumns);
  private outboundSettleInfoColumns: any[] = deepClone(this.settleInfoColumns);

  private Formscreening: any[] = [
    {
      name: "Generate",
      value: 1
    },
    {
      name: "Export",
      value: 2
    },
    {
      name: "Reset",
      value: 3
    }
  ];
  private tableInputDisabled: boolean = false;
  private selectName: any = "";
  private direction: any = ""; // 方向
  private currency: any = ""; // 币种

  private inboundInitData: any = [];
  private outboundInitData: any = [];

  private totalMoneyObj: any = {
    inbound: undefined,
    outbound: undefined
  };

  /* 删除模态框的Inbound的data多选项 */
  public dele(data: any): void {
    this.inboundInputChange(data);
    this.reDefineTableInputDisabled(1);
  }
  /* 删除模态框的Outbound的data多选项 */
  public dele2(data: any): void {
    this.outboundInputChange(data);
    this.reDefineTableInputDisabled(2);
  }

  // 高级搜索 Search -> 回调
  public async SearchOk(values: any) {
    let data = {
      ServiceName: values.Service,
      accountName: values.Account,
      chargeType: values.ChargeType,
      billingType: values.BillingType,
      direction: values.Direction,
      beginDate: values.BeginDate,
      endDate: values.EndDate
    };
    await ReconciliationDataEntySearch(data).then((resp: recodeConfig) => {
      if (resp.code === 1) {
        this.data = this.DestinationToString(resp.data);
      } else {
        this.$message.warning(resp.msg);
        this.data = [];
      }
      // console.log(this.data);
    });
  }
  // 把destination数组转化成字符串
  public DestinationToString(successData) {
    // console.log(successData);
    successData.forEach(element => {
      element.inboundDestinations = [];
      element.outboundDestinations = [];
      if (element.inboundDestList && element.inboundDestList !== "[]") {
        element.inboundDestList.forEach((ele, index) => {
          if (Array.isArray(element.inboundDestinations)) {
            element.inboundDestinations.push(ele.destination);
            if (index === element.inboundDestList.length - 1) {
              element.inboundDestinations = element.inboundDestinations.join(
                ","
              );
            }
          }
        });
      }
      if (element.outboundDestList && element.outboundDestList !== "[]") {
        element.outboundDestList.forEach((ele, index) => {
          if (Array.isArray(element.outboundDestinations)) {
            element.outboundDestinations.push(ele.destination);
            if (index === element.outboundDestList.length - 1) {
              element.outboundDestinations = element.outboundDestinations.join(
                ","
              );
            }
          }
        });
      }
    });
    return successData;
  }

  public selectChange(formData: any, currentName: string) {
    const refs: any = this.$refs.AdvancedSearch;
    for (let i in this.searchFormOptions) {
      if (this.searchFormOptions[i].name == "BillingType") {
        for (let j in this.searchFormOptions[i].options) {
          let obj = this.searchFormOptions[i].options[j];
          //根据ChargeType来确认BillingType的可选值
          if (formData["ChargeType"] === 1) {
            if (formData["BillingType"] !== 1) {
              refs.setFieldsValue({ BillingType: undefined });
            }
            this.$set(obj, "disabled", obj.name !== "Invoice");
          } else if (formData["ChargeType"] === 2) {
            if (formData["BillingType"] === 1) {
              refs.setFieldsValue({ BillingType: undefined });
            }
            this.$set(obj, "disabled", obj.name === "Invoice");
          } else {
            obj.disabled = false;
          }
        }
      }
    }
  }

  private baseInfoSelectChange(formData: any, name: string): void {
    let refs: any = this.$refs.baseInfoFormGroup;
    // console.log(formData, name);
    let CycleData = {
      accountName: formData["Account"],
      serviceName: formData["Service"],
      direction: formData["Direction"]
    };
    // 请求destination
    if (
      name == "Account" ||
      name == "Service" ||
      name == "Direction" ||
      name == "Month" ||
      name == "Cycle"
    ) {
      this.reqDestination(formData);
    }
    // 请求cycle
    if (name == "Account" || name == "Service" || name == "Direction") {
      getCyclesOptions({
        params: CycleData
      }).then((res: any) => {
        this.baseInfoFormOptions[5].options = res;
        this.CyclesOptions = res;
      });
    }
    //
    if (this.selectName != "Edit") {
      this.commomBaseInfoSelectChange(
        formData,
        this.baseInfoFormOptions,
        this.$refs.baseInfoFormGroup,
        name
      );
    }
    this.direction = formData["Direction"] || undefined;
    // 给记录两个方向的变量赋值(为了计算netting的amount值)
    if (this.direction == 1) {
      this.totalMoneyObj.outbound = undefined;
    } else if (this.direction == 2) {
      this.totalMoneyObj.inbound = undefined;
    }
    if (formData["Currency"]) {
      this.currency = formData.Currency;
    }
    // 计算netting 的amount值
    this.calculatorTotal();
  }

  /* 选择模态框的Inbound的data多选项 */
  private InboundTableSelectFunc(
    val: string,
    name: string,
    index: number,
    rowIndex: number
  ): void {
    this.$nextTick(() => {
      this.reDefineTableInputDisabled(1);
    });
  }
  /* 选择模态框的Outbound的data多选项 */
  private OutboundTableSelectFunc(
    val: string,
    name: string,
    index: number,
    rowIndex: number
  ): void {
    this.$nextTick(() => {
      this.reDefineTableInputDisabled(2);
    });
  }

  // 请求destination
  public async reqDestination(formData: any, isEdit: boolean = false) {
    let destinationData: any = {
      accountName: formData["Account"] || formData["accountName"] || undefined,
      serviceName: formData["Service"] || formData["Service"] || undefined,
      direction: formData["Direction"] || formData["direction"] || undefined
    };
    // if (formData["Month"] || formData["billingMonth"]) {
    //   destinationData["endDate"] =
    //     moment(formData["Month"])
    //       .subtract(1, "days")
    //       .format("YYYY-MM-DD") ||
    //     moment(formData["billingMonth"])
    //       .subtract(1, "days")
    //       .format("YYYY-MM-DD");
    //   destinationData["beginDate"] =
    //     moment(formData["Month"])
    //       .add(1, "days")
    //       .format("YYYY-MM-DD") ||
    //     moment(formData["billingMonth"])
    //       .add(1, "days")
    //       .format("YYYY-MM-DD");
    // }
    // if (formData["Cycle"] || formData["billingCycle"]) {
    //   this.CyclesOptions.forEach((element: any) => {
    //     if (
    //       element.name === formData["Cycle"] ||
    //       element.name === formData["billingCycle"]
    //     ) {
    //       destinationData["beginDate"] = element.BeginDate;
    //       destinationData["endDate"] = element.EndDate;
    //     }
    //   });
    // }
    this.$nextTick(async () => {
      let InboundTableInput = this.$refs.InboundTableInput,
        OutboundTableInput = this.$refs.OutboundTableInput;
      let res: any = await getDestinationsOptions(
        {
          params: destinationData
        },
        false
      );
      console.log("res", res);

      res.forEach((ele: any) => {
        if (ele.direction === 1) {
          // inbound赋值
          this.inboundSettleInfoColumns[1].options = ele.data;
          this.DestinationOptions = ele.data;
          // console.log("InboundTableInput", InboundTableInput);

          InboundTableInput.Arr.forEach((element: any) => {
            this.$set(element.name[1], "options", ele.data);
          });
        } else if (ele.direction === 2) {
          // outbound赋值
          this.outboundSettleInfoColumns[1].options = ele.data;
          this.DestinationOptions2 = ele.data;
          // console.log("OutboundTableInput", OutboundTableInput);

          OutboundTableInput.Arr.forEach((element: any) => {
            this.$set(element.name[1], "options", ele.data);
          });
        }
      });
      console.log("settleInfoColumns", this.settleInfoColumns);
    });
  }

  private baseInfoPickerChange(formData: any, name: string): void {
    this.commomBaseInfoSelectChange(
      formData,
      this.baseInfoFormOptions,
      this.$refs.baseInfoFormGroup,
      name
    );
  }

  // inbound方向输入改变时的回调
  private inboundInputChange(data: any): void {
    // console.log(data);
    // Inbound_TotalTrafficVolume
    const ref: any = this.$refs;
    let total = data.reduce(
      (sum: any, item: any) => {
        sum.Inbound_TotalTrafficVolume += +item.ChargeTrafficVolume || 0;
        sum.Inbound_TotalAmounts_Currency += +item.Amounts_Currency || 0;
        return sum;
      },
      {
        Inbound_TotalAmounts_Currency: 0,
        Inbound_TotalTrafficVolume: 0
      }
    );
    const copTotal = Object.assign(
      {},
      {
        Inbound_TotalAmounts_Currency: total.Inbound_TotalAmounts_Currency || 0,
        Inbound_TotalTrafficVolume: total.Inbound_TotalTrafficVolume || 0
      }
    );
    this.totalMoneyObj.inbound = copTotal;
    this.calculatorTotal();
    ref.Inbound_settleInfoFormOptions &&
      ref.Inbound_settleInfoFormOptions.setFieldsValue(copTotal);
  }

  // outbound方向输入改变时的回调
  private outboundInputChange(data: any): void {
    // console.log(data);
    const ref: any = this.$refs;
    let total = data.reduce(
      (sum: any, item: any) => {
        sum.Outbound_TotalTrafficVolume += +item.ChargeTrafficVolume || 0;
        sum.Outbound_TotalAmounts_Currency += +item.Amounts_Currency || 0;
        return sum;
      },
      {
        Outbound_TotalAmounts_Currency: 0,
        Outbound_TotalTrafficVolume: 0
      }
    );
    const copTotal = Object.assign(
      {},
      {
        Outbound_TotalAmounts_Currency:
          total.Outbound_TotalAmounts_Currency || 0,
        Outbound_TotalTrafficVolume: total.Outbound_TotalTrafficVolume || 0
      }
    );
    this.totalMoneyObj.outbound = copTotal;
    this.calculatorTotal();
    ref.Outbound_settleInfoFormOptions &&
      ref.Outbound_settleInfoFormOptions.setFieldsValue(copTotal);
  }

  // 计算 inbound 与 outbound 的差值
  private calculatorTotal(): void {
    let Amount_Currency: any, Amount_USD: number, currency: number, find: any;

    if (this.totalMoneyObj.inbound) {
      Amount_Currency =
        (this.totalMoneyObj.inbound
          ? this.totalMoneyObj.inbound.Inbound_TotalAmounts_Currency
          : 0) -
        (this.totalMoneyObj.outbound
          ? this.totalMoneyObj.outbound.Outbound_TotalAmounts_Currency
          : 0);
    } else {
      Amount_Currency = this.totalMoneyObj.outbound
        ? this.totalMoneyObj.outbound.Outbound_TotalAmounts_Currency
        : 0;
    }
    console.log(this.totalMoneyObj);
    console.log(Amount_Currency);

    this.$nextTick(() => {
      // setTimeout(()=>{
      const nettingFormGroup: any = this.$refs.nettingFormGroup;
      const rate: any = [
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

      if (this.currency) {
        find = rate.find((item: any) => this.currency === item.name);
        currency = (find && find.value) || 0;
      }
      let Amount_USD: number = currency
        ? Amount_Currency * currency
        : Amount_Currency;
      nettingFormGroup.setFieldsValue({
        Amount_Currency: Amount_Currency.toFixed(4),
        Amount_USD: Amount_USD.toFixed(4)
      });
    });
  }

  // 修改表格上方按钮可否点击
  private changeDisable(selectedRows: any) {
    /* 0 Add 1 Edit 2 Delete 3 Details 4 Export 5 Download */
    this.selectedBtn.forEach((item: any, index: number) => {
      if (selectedRows.length === 1) {
        if (index > 0) {
          item.disabled = false;
        }
      } else if (selectedRows.length > 1) {
        if (index == 4 || index == 2 || index == 5) {
          item.disabled = false;
        } else if (index !== 0) {
          item.disabled = true;
        }
      } else {
        if (index !== 0) {
          item.disabled = true;
        }
      }
    });
  }

  /* 用户手动选择/取消选择所有列的回调  Table -> 回调 */
  public onSelectAll(selected: any, selectedRows: any, changeRows: any) {
    // console.log(selected, selectedRows, changeRows);
    this.changeDisable(selectedRows);
  }

  /* 用户手动选择/取消选择某列的回调
                             @param record: 选中数据
                             @param selected: 是否选中 true/false
                             @param selectedRows: 所有选中 Array
                          */
  public onSelect(record: object, selected: boolean, selectedRows: any) {
    this.changeDisable(selectedRows);
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
  public activeClick(msg: any) {}

  private rowClassName(record: any, index: any) {
    if (record.te) {
      return "left";
    }
    return "";
  }

  private onSelectClick(activeObJ: any, selected: any, selectedData: any) {
    this.selectName = activeObJ.name;
    if (activeObJ.name === "Details") {
      this.showBtn = false;
    } else {
      this.showBtn = true;
    }
    if (activeObJ.name === "Export") {
      // Export
      this.toExport(selectedData);
    } else if (activeObJ.name === "Edit" || activeObJ.name === "Details") {
      // Edit 禁止编辑基础信息
      this.toEdit(selected, selectedData);
    } else if (activeObJ.name === "Add") {
      this.direction = "";
      // Add
      this.baseInfoFormOptions.forEach((item: any) => {
        item.disabled =
          item.decorator === "BeginDate" ||
          item.decorator === "EndDate" ||
          item.decorator === "Cycle" ||
          item.decorator === "Month";
        item.initialValue = undefined;
      });
      this.Inbound_settleInfoFormOptions.forEach((item: any) => {
        item.decorator == "Inbound_TotalTrafficVolume" ||
        item.decorator == "Inbound_TotalAmounts_Currency"
          ? (item.disabled = true)
          : (item.disabled = false);
        item.initialValue = undefined;
      });
      this.Outbound_settleInfoFormOptions.forEach((item: any) => {
        item.decorator == "Outbound_TotalTrafficVolume" ||
        item.decorator == "Outbound_TotalAmounts_Currency"
          ? (item.disabled = true)
          : (item.disabled = false);
        item.disabled ? item.disabled : false;
        item.initialValue = undefined;
      });
      this.tableInputDisabled = false;
      this.nettingDataFormOptions.forEach((item: any) => {
        if (this.selectName === "Details") {
          item.disabled = true;
        } else if (this.selectName === "Add" || this.selectName === "Edit") {
          item.decorator == "Amount_Currency" || item.decorator == "Amount_USD"
            ? (item.disabled = true)
            : (item.disabled = false);
        } else {
          item.disabled = false;
        }
        item.initialValue = undefined;
      });

      this.visible = true;
    } else if (activeObJ.name === "Delete") {
      const that = this;
      const ref: any = this.$refs;
      const dataEntryId = selectedData
        .map((item: any) => item.dataEntryId)
        .join("&dataEntryId=");
      const url = `/finance/reconciliation/dataEntry?dataEntryId=${dataEntryId}`;
      this.$confirm({
        title: "Confirm!",
        content: "Continue to  deleted the data?",
        okText: "YES",
        cancelText: "NO",
        async onOk() {
          await AxiosDelete(url).then((res: any) => {
            if (res.code == 1) {
              that.SearchOk("");
            }
          });
          that.$nextTick(() => {
            ref.table.clearSelectRowKeys();
            that.$message.success("Data has been deleted successfully");
          });
        }
      });
    } else if (activeObJ.name === "Download") {
      let isDownload: boolean = false;
      let fileName: any = selectedData;
      selectedData.forEach((ele: any) => {
        if (ele.operatorFiles) {
          isDownload = true;
        }
      });
      if (isDownload) {
        fileName = selectedData
          .map((item: any) => item.operatorFiles)
          .join("&fileName=");
        let url = `/finance/reconciliation/dataEntry_download?fileName=${fileName}`;
        let xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.responseType = "blob";
        xhr.onload = function() {
          if (this.status === 200) {
            let content = this.response;
            let aTag = document.createElement("a");
            let blob: any = new Blob([content]);
            let headerName: any = xhr.getResponseHeader("Content-disposition");
            let DownloadfileName: any = decodeURIComponent(
              headerName
            ).substring(20);
            aTag.download = DownloadfileName;
            aTag.href = URL.createObjectURL(blob);
            aTag.click();
            URL.revokeObjectURL(blob);
          }
        };
        xhr.send();
        // this.openDownload(
        //   `http://192.168.121.41:8082/finance/reconciliation/dataEntry_download?fileName=${fileName}`,
        //   fileName
        // );
      } else {
        this.$message.warning("Empty file cannot be downloaded");
      }
    }
  }
  private async toExport(selectedData) {
    const filterData = selectedData.map((item: any) => {
      let newItem = JSON.parse(JSON.stringify(item));
      delete newItem.key;
      delete newItem.inboundDestList;
      delete newItem.outboundDestList;
      for (let key in newItem) {
        let find: any;
        switch (key) {
          case "inboundChargeableUnitType":
            find = this.ChargeableUnitTypeOptions.find(
              (inner: any) => inner.value === item[key]
            );
            break;
          case "chargeType":
            find = this.ChargeTypeOptions.find(
              (inner: any) => inner.value === item[key]
            );
            break;
          case "billingType":
            find = this.BillingTypeOptions.find(
              (inner: any) => inner.value === item[key]
            );
            break;
          case "direction":
            find = this.DirectionOptions.find(
              (inner: any) => inner.value === item[key]
            );
            break;
        }
        if (find) {
          newItem[key] = find.name;
        }
      }
      return newItem;
    });
    let data: any = [];
    filterData.forEach((item: any) => {
      data.push(item);
    });

    await ReconciliationDataEntyExport(data).then((resp: any) => {
      let blob = new Blob([resp], { type: "application/xlsx" });
      let url = window.URL.createObjectURL(blob);
      this.openDownload(url, "The other party data.xlsx");
    });
  }
  // toEdit的请求数据值
  public returnEditData(selectedData: any) {
    const data = Object.assign({}, selectedData[0], {
      Service: selectedData[0].serviceName,
      Account: selectedData[0].accountName,
      ChargeType: selectedData[0].chargeType,
      BillingType: selectedData[0].billingType,
      Direction: selectedData[0].direction,
      Cycle: selectedData[0].billingCycle,
      EndDate: selectedData[0].endDate
        ? moment(selectedData[0].endDate).format("YYYY-MM-DD")
        : undefined,
      BeginDate: selectedData[0].beginDate
        ? moment(selectedData[0].beginDate).format("YYYY-MM-DD")
        : undefined,
      Month: selectedData[0].billingMonth
        ? moment(selectedData[0].billingMonth).format("YYYY-MM-DD")
        : undefined,
      Currency: selectedData[0].currency,
      OperatorFiles: selectedData[0].operatorFiles,
      ExchangeDate:
        selectedData[0].exchangeDate == "Default"
          ? undefined
          : moment(selectedData[0].exchangeDate).format("YYYY-MM-DD"),
      Inbound_TotalTrafficVolume: selectedData[0].inboundTotalVolume,
      Inbound_TotalAmounts_Currency: selectedData[0].inboundTotalAmount,
      Inbound_ChargableUnitType: selectedData[0].inboundChargeableUnitType,
      Amount_Currency: selectedData[0].totalAmount,
      Amount_USD: selectedData[0].totalUSDAmount,
      Outbound_ChargableUnitType: selectedData[0].outboundChargeableUnitType,
      Outbound_TotalAmounts_Currency: selectedData[0].outboundTotalAmount,
      Outbound_TotalTrafficVolume: selectedData[0].outboundTotalVolume,
      Remark: selectedData[0].remark,
      Amounts_Currency: selectedData[0].amount,
      Calls: selectedData[0].calls,
      ChargeTrafficVolume: selectedData[0].chargeTrafficVolume,
      Destination: selectedData[0].inboundDestinations,
      Mins: selectedData[0].duration,
      InboundTableData: [],
      OutboundTableData: []
    });

    //将InboundTableInput的值的格式转化为项目可读格式
    selectedData[0].inboundDestList.forEach((ele: any) => {
      data.InboundTableData.push({
        Amounts_Currency: ele.amount,
        Calls: ele.calls,
        ChargeTrafficVolume: ele.chargeTrafficVolume,
        Destination: ele.destination,
        Mins: ele.duration
      });
    });
    selectedData[0].outboundDestList.forEach((ele: any) => {
      data.OutboundTableData.push({
        Amounts_Currency: ele.amount,
        Calls: ele.calls,
        ChargeTrafficVolume: ele.chargeTrafficVolume,
        Destination: ele.destination,
        Mins: ele.duration
      });
    });
    return data;
  }

  // table input 组件改变disabled状态
  public reDefineTableInputDisabled(direction: number) {
    setTimeout(() => {
      if (direction === 1 || direction === 3) {
        let InboundTableInput = this.$refs.InboundTableInput;
        let data1: any = InboundTableInput.getData(true);

        const allDest1: any = data1.reduce(
          (sums: any, item: any, index: number) => {
            sums = sums.concat(item.Destination);
            return sums;
          },
          []
        );

        // 设置destination重复disabled
        InboundTableInput.Arr.forEach((DestinationOptions: any) => {
          DestinationOptions.name[1].options.forEach((destinationItem: any) => {
            this.$set(
              destinationItem,
              "disabled",
              allDest1.includes(destinationItem.name)
            );
          });
        });
        console.log(InboundTableInput.Arr);
      } else if (direction === 2 || direction === 3) {
        let OutboundTableInput = this.$refs.OutboundTableInput;
        console.log(OutboundTableInput);

        let data2: any = OutboundTableInput.getData(true);

        const allDest2: any = data2.reduce(
          (sums: any, item: any, index: number) => {
            // console.log("ertertyertyert", sums, item);
            sums = sums.concat(item.Destination);
            return sums;
          },
          []
        );

        OutboundTableInput.Arr.forEach((DestinationOptions: any) => {
          DestinationOptions.name[1].options.forEach((destinationItem: any) => {
            this.$set(
              destinationItem,
              "disabled",
              allDest2.includes(destinationItem.name)
            );
          });
        });
        console.log(OutboundTableInput.Arr);
      }
    }, 500);
  }

  private toEdit(selected: any, selectedData: any): void {
    this.checkedEditData = selectedData[0];
    this.currency = selectedData[0].currency;
    // console.log("selectedData", selectedData);
    if (selectedData.length > 1) {
      this.$warning({
        title: "Warning!",
        content: "The data cannot be edited,you can not checked more than one",
        onOk() {},
        onCancel() {}
      });
      return;
    }
    this.visible = true;
    this.selectkeyArr = selected;
    // 请求数据
    let data: any = this.returnEditData(selectedData);

    this.baseInfoFormOptions["DateEntyId"] = selectedData[0].dataEntryId;
    this.direction = data.Direction || "";
    if (this.direction == 1) {
      this.totalMoneyObj.outbound = undefined;
    } else if (this.direction == 2) {
      this.totalMoneyObj.inbound = undefined;
    }
    this.direction = data.Direction;
    setTimeout(async () => {
      for (let dataKey in data) {
        this.baseInfoFormOptions.forEach((item: any) => {
          // 设置basic information数据是否可编辑
          if (
            (item.decorator !== "OperatorFiles" &&
              item.decorator !== "Currency" &&
              item.decorator !== "ExchangeDate" &&
              this.selectName === "Edit") ||
            this.selectName === "Details"
          ) {
            item.disabled = true;
          } else {
            item.disabled = false;
          }
          // edit、details的值设置
          if (item.decorator === dataKey) {
            this.$set(item, "initialValue", data[dataKey]);
          }
        });
        // 设置Settle information Inbound 方向数据是否可编辑
        this.Inbound_settleInfoFormOptions.forEach((item: any) => {
          if (item.decorator === dataKey) {
            this.$set(item, "initialValue", data[dataKey]);
          }
          if (this.selectName === "Details") {
            item.disabled = true;
          } else if (this.selectName === "Add" || this.selectName === "Edit") {
            item.decorator == "Inbound_TotalTrafficVolume" ||
            item.decorator == "Inbound_TotalAmounts_Currency"
              ? (item.disabled = true)
              : (item.disabled = false);
          } else {
            item.disabled = false;
          }
        });
        // 设置Settle information Outbound 方向数据是否可编辑
        this.Outbound_settleInfoFormOptions.forEach((item: any) => {
          if (item.decorator === dataKey) {
            this.$set(item, "initialValue", data[dataKey]);
          }
          if (this.selectName === "Details") {
            item.disabled = true;
          } else if (this.selectName === "Add" || this.selectName === "Edit") {
            item.decorator == "Outbound_TotalTrafficVolume" ||
            item.decorator == "Outbound_TotalAmounts_Currency"
              ? (item.disabled = true)
              : (item.disabled = false);
          } else {
            item.disabled = false;
          }
        });

        // 设置 Netting data 数据是否可编辑
        this.nettingDataFormOptions.forEach((item: any) => {
          if (item.decorator === dataKey) {
            this.$set(item, "initialValue", data[dataKey]);
          }
          if (this.selectName === "Details") {
            item.disabled = true;
          } else if (this.selectName === "Add" || this.selectName === "Edit") {
            item.decorator == "Amount_Currency" ||
            item.decorator == "Amount_USD"
              ? (item.disabled = true)
              : (item.disabled = false);
          } else {
            item.disabled = false;
          }
        });
      }
      // settle table inbound input
      const r = await this.reqDestination(selectedData[0], true);

      const InboundTableInput: any = this.$refs.InboundTableInput;
      // const InboundTableInputs = InboundTableInput.getData(true);
      this.tableInputDisabled = this.selectName === "Details";
      if (this.direction == 1 || this.direction == 3) {
        if (data.InboundTableData && data.InboundTableData.length) {
          this.inboundInitData = data.InboundTableData.map((item: any) => {
            return Object.assign({}, item, {
              Destination:
                (item.Destination && item.Destination.split(",")) || []
            });
          });
          this.inboundInputChange(data.InboundTableData);
          this.calculatorTotal();
          this.reDefineTableInputDisabled(1);
        } else {
          InboundTableInput.reset();
        }
      }
      // settle table outbound input
      const OutboundTableInput: any = this.$refs.OutboundTableInput;
      if (this.direction == 2 || this.direction == 3) {
        if (data.OutboundTableData && data.OutboundTableData.length) {
          this.outboundInitData = data.OutboundTableData.map((item: any) => {
            return Object.assign({}, item, {
              Destination:
                (item.Destination && item.Destination.split(",")) || []
            });
          });
          this.outboundInputChange(data.OutboundTableData);
          this.calculatorTotal();
          this.reDefineTableInputDisabled(2);
        } else {
          OutboundTableInput.reset();
        }
      }
    }, 700);
  }

  private onSoltClick(
    soltName: string,
    text: any,
    record: any,
    index: number
  ) {}

  // modal save 按钮
  private async save() {
    //   basic information下拉框校验、获取refs和取值
    const baseInfoFormGroup: any = this.$refs.baseInfoFormGroup;
    const baseInfoData = baseInfoFormGroup.validateFields();
    const baseInfoFormGroups = baseInfoFormGroup.getFieldsValue();
    // inbound方向校验和获取refs
    const InboundTableInput: any = this.$refs.InboundTableInput;
    const InboundTableInputs = InboundTableInput.getData;
    const InboundTableInputsValue = InboundTableInputs();
    console.log('InboundTableInputsValue',InboundTableInputsValue);
    
    // Outbound方向校验和获取refs
    const OutboundTableInput: any = this.$refs.OutboundTableInput;
    const OutboundTableInputs = OutboundTableInput.getData;
    const OutboundTableInputsValue = OutboundTableInputs();
    // Inbound方向下拉框取值
    const Inbound_settleInfoFormOptions = this.$refs
      .Inbound_settleInfoFormOptions;
    const Inbound_settleInfoFormOptionss = Inbound_settleInfoFormOptions.getFieldsValue();
    // Outbound方向下拉框取值
    const Outbound_settleInfoFormOptions = this.$refs
      .Outbound_settleInfoFormOptions;
    const Outbound_settleInfoFormOptionss = Outbound_settleInfoFormOptions.getFieldsValue();
    // netting下拉框取值
    const nettingFormGroup = this.$refs.nettingFormGroup;
    const nettingFormGroups = nettingFormGroup.getFieldsValue();

    if (baseInfoData) {
      if (baseInfoData.Direction === 1) {
        if (InboundTableInputs(false) === undefined) {
          return;
        }
      } else if (baseInfoData.Direction === 2) {
        if (OutboundTableInputs(false) === undefined) {
          return;
        }
      } else if (baseInfoData.Direction === 3) {
        if (
          InboundTableInputs(false) === undefined ||
          OutboundTableInputs(false) === undefined
        ) {
          return;
        }
      }
      // 数据请求
      let data: any = {
        accountName: baseInfoFormGroups.Account,
        beginDate: baseInfoFormGroups.BeginDate
          ? moment(baseInfoFormGroups.BeginDate).format("YYYY-MM-DD")
          : undefined,
        billingCycle: baseInfoFormGroups.Cycle
          ? baseInfoFormGroups.Cycle
          : undefined,
        billingMonth: baseInfoFormGroups.Month
          ? moment(baseInfoFormGroups.Month).format("YYYY-MM")
          : undefined,
        billingType: baseInfoFormGroups.BillingType,
        chargeType: baseInfoFormGroups.ChargeType,
        currency: baseInfoFormGroups.Currency,
        dataEntryId: undefined,
        direction: baseInfoFormGroups.Direction,
        endDate: baseInfoFormGroups.EndDate
          ? moment(baseInfoFormGroups.EndDate).format("YYYY-MM-DD")
          : undefined,
        exchangeDate: baseInfoFormGroups.ExchangeDate
          ? moment(baseInfoFormGroups.ExchangeDate).format("YYYY-MM")
          : undefined,
        remark: nettingFormGroups.Remark ? nettingFormGroups.Remark : "",
        serviceName: baseInfoFormGroups.Service,
        totalAmount: nettingFormGroups.Amount_Currency
          ? nettingFormGroups.Amount_Currency
          : undefined,
        totalUSDAmount: nettingFormGroups.Amount_USD
          ? nettingFormGroups.Amount_USD
          : undefined,
        operatorFiles: baseInfoFormGroups.OperatorFiles,
        inboundChargeableUnitType: undefined,
        inboundTotalAmount: undefined,
        inboundTotalVolume: undefined,
        inboundDestList: [
          {
            amount: undefined,
            calls: undefined,
            chargeTrafficVolume: undefined,
            dataEntryId: undefined,
            destination: undefined,
            destinationId: undefined,
            duration: undefined
          }
        ],
        outboundChargeableUnitType: undefined,
        outboundTotalAmount: undefined,
        outboundTotalVolume: undefined,
        outboundDestList: [
          {
            amount: undefined,
            calls: undefined,
            chargeTrafficVolume: undefined,
            dataEntryId: undefined,
            destination: undefined,
            destinationId: undefined,
            duration: undefined
          }
        ]
      };
      if (
        (Array.isArray(InboundTableInputsValue) && data.direction === 1) ||
        data.direction === 3
      ) {
        data.inboundChargeableUnitType =
          Inbound_settleInfoFormOptionss.Inbound_ChargableUnitType;
        data.inboundTotalAmount =
          Inbound_settleInfoFormOptionss.Inbound_TotalAmounts_Currency;
        data.inboundTotalVolume =
          Inbound_settleInfoFormOptionss.Inbound_TotalTrafficVolume;
        data.inboundDestList = [];
        InboundTableInputsValue.forEach((ele: any) => {
          // this.checkedEditData
          data.inboundDestList.push({
            amount: ele.Amounts_Currency,
            calls: ele.Calls,
            chargeTrafficVolume: ele.ChargeTrafficVolume,
            dataEntryId: 0,
            destination: ele.Destination.join(","),
            destinationId: 0,
            duration: ele.Mins
          });
        });
      }
      if (
        (Array.isArray(OutboundTableInputsValue) && data.direction === 2) ||
        data.direction === 3
      ) {
        (data.outboundChargeableUnitType =
          Outbound_settleInfoFormOptionss.Outbound_ChargableUnitType),
          (data.outboundTotalAmount =
            Outbound_settleInfoFormOptionss.Outbound_TotalAmounts_Currency),
          (data.outboundTotalVolume =
            Outbound_settleInfoFormOptionss.Outbound_TotalTrafficVolume),
          (data.outboundDestList = []);
        OutboundTableInputsValue.forEach((ele: any) => {
          data.outboundDestList.push({
            amount: ele.Amounts_Currency,
            calls: ele.Calls,
            chargeTrafficVolume: ele.ChargeTrafficVolume,
            dataEntryId: 0,
            destination: ele.Destination.join(","),
            destinationId: 0,
            duration: ele.Mins
          });
        });
      }
      if (this.formDataObj) {
        console.log("this.formDataObj", this.formDataObj);
        let uploadData = await UploadCndnFile(this.formDataObj);
        this.formDataObj = undefined;
      }

      if (this.selectName === "Add") {
        console.log(data);
        await ReconciliationDataEntyAdd(data).then((resp: recodeConfig) => {
          if (resp.code === 1) {
            this.SearchOk((this.$refs.AdvancedSearch as any).getFieldsValue());
            this.handleReturn();
            this.$message.success(resp.msg);
            this.visible = false;
          } else {
            this.$message.warning(resp.msg);
          }
        });
      } else if (this.selectName === "Edit") {
        setTimeout(() => {
          data.dataEntryId = this.checkedEditData.dataEntryId;
          data.inboundDestList.forEach((element: any, index: number) => {
            element.dataEntryId = this.checkedEditData.inboundDestList[
              index
            ].dataEntryId;
            element.destinationId = this.checkedEditData.inboundDestList[
              index
            ].dataEntryId;
          });
          data.outboundDestList.forEach((element: any, index: number) => {
            element.dataEntryId = this.checkedEditData.outboundDestList[
              index
            ].dataEntryId;
            element.destinationId = this.checkedEditData.outboundDestList[
              index
            ].dataEntryId;
          });
          ReconciliationDataEntyEdit(data).then((resp: recodeConfig) => {
            if (resp.code === 1) {
              this.SearchOk((this.$refs.AdvancedSearch as any).getFieldsValue());
              this.handleReturn();
              this.$message.success(resp.msg);
              this.visible = false;
            } else {
              this.$message.warning(resp.msg);
            }
          });
        }, 500);
      }
    } else {
      return;
    }
  }

  //
  public uploadFileChange(info) {
    let formDataObj: any = new FormData();
    formDataObj.append("file", info.file.originFileObj);
    this.formDataObj = formDataObj;
  }

  /* 退出 */
  private handleReturn() {
    this.visible = !this.visible;
    this.baseInfoFormOptions.forEach((item: any) => {
      item.initialValue = undefined;
      item.disabled = false;
    });
    this.Inbound_settleInfoFormOptions.forEach((item: any) => {
      item.initialValue = undefined;
      item.disabled = false;
    });
    this.Outbound_settleInfoFormOptions.forEach((item: any) => {
      item.initialValue = undefined;
      item.disabled = false;
    });
    this.tableInputDisabled = false;
    this.totalMoneyObj = {
      inbound: undefined,
      outbound: undefined
    };
    this.inboundInitData = [];
    this.outboundInitData = [];
    this.formDataObj = undefined;
  }

  public async created() {
    // 函数变量
    let ServiceOptions = await getServiceOptions();
    let AccountOptions = await getAccountOptions();
    let CurrencyOptions = await getCurrencyOptions();
    let DestinationOptions = await getDestinationsOptions(undefined, true);
    let InboundTableInput: any = this.$refs.InboundTableInput;
    let OutboundTableInput: any = this.$refs.OutboundTableInput;

    // 变量赋值
    this.AccountOptions = getAccountOptions;
    this.ServiceOptions = ServiceOptions;
    this.CurrencyOptions = CurrencyOptions;
    // searchFormOptions
    this.searchFormOptions[0].options = ServiceOptions;
    this.searchFormOptions[1].options = AccountOptions;
    this.baseInfoFormOptions[10].options = CurrencyOptions;
    // baseInfoFormOptions
    this.baseInfoFormOptions[0].options = ServiceOptions;
    this.baseInfoFormOptions[1].options = AccountOptions;
    //
    this.settleInfoColumns[1].options = DestinationOptions;
    this.DestinationOptions = DestinationOptions;
    this.settleInfoColumns[1].options = DestinationOptions;
    this.DestinationOptions2 = DestinationOptions;
    // console.log(InboundTableInput, OutboundTableInput);

    DestinationOptions.forEach((ele: any) => {
      if ((this.direction && this.direction === 1) || this.direction === 3) {
        InboundTableInput.Arr.forEach((element: any) => {
          this.$set(element.name[1], "options", ele.data);
        });
      } else if (
        (this.direction && this.direction === 2) ||
        this.direction === 3
      ) {
        OutboundTableInput.Arr.forEach((element: any) => {
          this.$set(element.name[1], "options", ele.data);
        });
      } else {
        return;
      }
    });
  }
}
</script>
<style lang="scss" scoped>
@import "@/views/Finance/common/css/modal.scss";
</style>

