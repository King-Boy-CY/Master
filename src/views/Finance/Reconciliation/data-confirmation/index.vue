<template>
  <div class="data-comfirmation statement">
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
      parentKey="dataConfirmationId"
      :isTableHeight="true"
      :isFinance="true"
      :isNeedCheck="true"
      :selectedBtn="selectedBtn"
      @onSelectClick="onSelectClick"
      :scrollX="3900"
      ref="table"
      :lessSpace="true"
      @onSelect="onSelect"
      @onSoltClick="onSoltClick"
      @onSelectAll="onSelectAll"
      :columns="columns"
      :data="data"
      :rowClassName="rowClassName"
      zebraStripe
    />
    <a-modal
      centered
      @cancel="handleReturn"
      class="edit-modal"
      width="950px"
      v-model="visible"
      v-if="visible"
      :footer="null"
      :title="selectName==='Add'?'Add record':selectName==='Edit'?'Edit':'Details'"
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
            @monthPickerChange="baseInfoPickerChange"
            :span="12"
            ref="baseInfoFormGroup"
            class="form-group"
          ></form-group>
        </div>
        <div class="modal-box">
          <div class="modal-box-title">
            <span class="piece"></span>
            <span class="title-text">Settle information</span>
          </div>
          <form-group
            :formoptions="settleFormOptions"
            :span="12"
            @handleClick="settleHandleClick"
            :collapseTags="true"
            ref="settleFormGroup"
            :multipleCheckBoxStyle="'data-confirmation'"
            resize="none"
            class="form-group"
          ></form-group>
          <div class="form-group" style="padding: 0 24px 24px">
            <div class="SpanBtn">
              <span
                style="font-weight: 600;color: #333;display:inline-block;margin-bottom: -40px"
              >Data comparison:</span>
              <a-button type="primary" @click="settleHandleClick" v-show="CompareShow">compare</a-button>
            </div>
            <Table
              :isFinance="true"
              :useDefined="false"
              :scrollX="3900"
              ref="ExportTable"
              :isTableHeight="true"
              :columns="modelColumns"
              :data="modelData"
              :rowClassName="modelRowClassName"
              v-if="modelTableShow"
              :isPagination="PaginationShow"
              zebraStripe
            />
          </div>
        </div>
      </div>
      <div style="padding-top: 20px;text-align: center">
        <a-button
          type="primary"
          style="border-radius: 50px;min-width: 90px"
          @click="ExportOp"
          v-if="showExport"
        >Export</a-button>
        <a-button
          type="primary"
          style="border-radius: 50px;min-width: 90px"
          @click="save"
          v-else
        >save</a-button>
        <a-button
          @click="handleReturn"
          style="margin-left: 14px;border-color:#1890ff;color:#1890ff;border-radius: 50px;min-width: 90px"
        >Return</a-button>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import {
  columns,
  data,
  modelColumns,
  modelData,
} from "./Test";
import {
  BillingTypeOptions,
  DirectionOptions,
  ChargeTypeOptions,
  destination,
  DifferenceOptions
} from "@/views/Finance/common/data/index.ts";
import {
  getAccountOptions,
  getServiceOptions,
  getCyclesOptions,
  getDestinationsOptions
} from "@/views/Finance/common/js/exchangeData.ts";
import moment from "moment";
import financeMixin from "@/views/Finance/common/js/mixin.ts";
import xlsx from "xlsx";
import { refsConfig, recodeConfig } from "@/assets/ts/config.d";
import {
  ReconciliationDataComfirmationSearch,
  ReconciliationDataComfirmationAdd,
  ReconciliationDataComfirmationEdit,
  ReconciliationDataComfirmationCompare,
  ReconciliationDataComfirmationInboundDestination,
  ReconciliationDataComfirmationOutboundDestination
} from "@/api/index.ts";
import { AxiosDelete, AxiosPatch } from "../../../../api/axios";

@Component({
  components: {
    AdvancedSearch: () =>
      import("@/views/Finance/components/Advancedsearch/index.vue"),
    Table: () => import("@/views/Finance/components/Table/index.vue"),
    // pagination: () => import("@/common/pagination/index.vue"),
    // model: () => import('@/common/Model/index.vue')
    formGroup: () => import("@/views/Finance/components/form-group/index.vue"),
    // TableInput: () => import("@/views/Finance/components/table-input/index.vue")
  },
  mixins: [financeMixin]
})
export default class DataConfirmation extends Vue {
  public AccountOptions: any = [];
  public ServiceOptions: any = [];
  public columns: any[] = columns;
  // 只能用于判断  [{list:[],direction:1},{list:[],direction:2}]
  public DestinationOptions = [];
  public CyclesOptions = [];
  public modelColumns: any[] = modelColumns;
  public data: any[] = [];
  // public modelData: any[] = modelData2;
  public modelData: any[] = modelData;
  private selectkeyArr: any = [];
  private searchData: any;
  private modelTableShow: any = true;
  private showExport: boolean = false;
  private isAdd: boolean = false;
  private toExportRowKey: number = 0;
  private PaginationShow: boolean = false;
  private CompareShow: boolean = false;
  private DirectionOptions: any[] = DirectionOptions();
  private DirectionOptions1: any[] = DirectionOptions();
  private BillingTypeOptions: any[] = BillingTypeOptions();
  private BillingTypeOptions1: any[] = BillingTypeOptions();
  private ChargeTypeOptions: any[] = ChargeTypeOptions();
  private ChargeTypeOptions1: any[] = ChargeTypeOptions();
  private DifferenceOptions: any[] = DifferenceOptions()
  public $refs: refsConfig | any;
  private dataConfirmationId: number = 0;
  // table选择框 选择后的按钮
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
      name: "Confirm",
      icon: "check-circle",
      index: 2,
      disabled: true
    },
    {
      name: "Anti confirm",
      icon: "check-circle",
      index: 3,
      disabled: true
    },
    {
      name: "Delete",
      icon: "delete",
      style: {
        color: "#f5b148",
        borderColor: "#f5b148"
      },
      index: 4,
      disabled: true
    },
    {
      name: "Details",
      icon: "file-text",
      index: 5,
      disabled: true
    },
    {
      name: "Export",
      icon: "export",
      index: 6,
      disabled: true
    }
  ];

  /* 弹出框显示/隐藏 */
  public visible: boolean = false;
  /*  高级搜索输入框数据
              @param name：label 值 && from输出的字段
              @param required：是否必填 默认false && from输出的字段
              @param type: 输入框什么类型， 例如select['下拉'], picker['时间选择器'] -> 目前只支持这俩个
              @param options：输入框['下拉的子元素数据']
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
      Tips: "Difference",
      name: "Status",
      required: false,
      type: "select",
      options:this.DifferenceOptions
    },
    {
      Tips: "Destination",
      name: "Destination",
      required: false,
      type: "tags",
      options: null
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

  // 弹窗 base info
  private baseInfoFormOptions: any[] = [
    {
      Tips: "Service",
      decorator: "Service",
      required: true,
      type: "select",
      options: this.ServiceOptions
    },
    {
      Tips: "Account",
      decorator: "Account",
      required: true,
      type: "select",
      options: this.AccountOptions
    },
    {
      Tips: "Charge type",
      decorator: "ChargeType",
      required: true,
      type: "select",
      options: this.ChargeTypeOptions1
    },
    {
      Tips: "Billing type",
      decorator: "BillingType",
      required: true,
      type: "select",
      options: this.BillingTypeOptions1
    },
    {
      Tips: "Direction",
      decorator: "Direction",
      required: true,
      type: "select",
      options: this.DirectionOptions1
    },
    {
      Tips: "Cycle",
      decorator: "Cycle",
      type: "select",
      options: null
    },
    {
      Tips: "Month",
      decorator: "Month",
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
  // 弹窗 settle info
  private settleFormOptions: any[] = [
    {
      Tips: "Inbound-Dest.",
      decorator: "InboundDestination",
      required: false,
      type: "tags-all",
      initialValue: [],
      options: null,
      disabled: true,
      span: 24,
      labelSpan: 4,
      wrapperSpan: 20
    },
    {
      Tips: "Outbound-Dest.",
      decorator: "OutboundDestination",
      required: false,
      type: "tags-all",
      initialValue: [],
      options: null,
      disabled: true,
      span: 24,
      labelSpan: 4,
      wrapperSpan: 20
    },
    {
      Tips: "Status",
      decorator: "Status",
      required: false,
      type: "select",
      options: this.DifferenceOptions,
      span: 24,
      labelSpan: 4,
      wrapperSpan: 20
    },
    {
      Tips: "Remark",
      decorator: "Remark",
      required: false,
      type: "textarea",
      initialValue: undefined,
      span: 24,
      labelSpan: 4,
      wrapperSpan: 20
    }
  ];
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
  private tableInputDisabled: boolean = false;
  private selectName: any = "";
  private direction: any = ""; // 方向

  // 高级搜索 Search -> 回调
  public async SearchOk(values: any) {
    let data = {
      destination: values.Destination,
      ServiceName: values.Service,
      accountName: values.Account,
      chargeType: values.ChargeType,
      billingType: values.BillingType,
      direction: values.Direction,
      dataConfirmationStatus: values.Status,
      beginDate: values.BeginDate,
      endDate: values.EndDate
    };
    await ReconciliationDataComfirmationSearch(data).then(
      (resp: recodeConfig) => {
        if (resp.code !== 1) {
          this.$message.warning(resp.msg);
          this.data = [];
        } else {
          this.data = resp.data;
        }
      }
    );
  }
  public modelDestinationsOptionsFunc(formData?: any){
    if(this.selectName === 'Add'){
      this.$nextTick(()=>{
      const baseInfoFormGroup = this.$refs.baseInfoFormGroup
      const baseInfoFormGroupData = baseInfoFormGroup.getFieldsValue()
      if(baseInfoFormGroupData.Direction !== undefined &&
        baseInfoFormGroupData.Service !== undefined &&
        baseInfoFormGroupData.Account !== undefined &&
        baseInfoFormGroupData.ChargeType !== undefined &&
        baseInfoFormGroupData.BillingType !== undefined &&
        (baseInfoFormGroupData.Cycle !== undefined ||
        baseInfoFormGroupData.Month !== undefined)){
          let data = {
            ServiceName: baseInfoFormGroupData.Service,
            accountName: baseInfoFormGroupData.Account,
            chargeType: baseInfoFormGroupData.ChargeType,
            billingType: baseInfoFormGroupData.BillingType,
            direction: baseInfoFormGroupData.Direction,
            beginDate: baseInfoFormGroupData.BeginDate
            ? moment(baseInfoFormGroupData.BeginDate).format('YYYY-MM-DD')
            : undefined,
            billingCycle:baseInfoFormGroupData.Cycle,
            billingMonth: baseInfoFormGroupData.Month
              ? moment(baseInfoFormGroupData.Month).format('YYYY-MM')
              :undefined,
            endDate: baseInfoFormGroupData.EndDate
            ? moment(baseInfoFormGroupData.EndDate).format('YYYY-MM-DD')
            : undefined
          }
            if(baseInfoFormGroupData.Direction === 1 || baseInfoFormGroupData.Direction === 3){
             ReconciliationDataComfirmationInboundDestination(data).then((resp:recodeConfig)=>{
               this.settleFormOptions[0].options = resp.data
             })
          }
          if(baseInfoFormGroupData.Direction === 2 || baseInfoFormGroupData.Direction === 3){
            ReconciliationDataComfirmationOutboundDestination(data).then((resp:recodeConfig)=>{
              this.settleFormOptions[1].options = resp.data
            })
          }
        }
      })
    }else if( this.selectName === 'Edit'){
        if(formData.serviceName !== undefined &&
        formData.accountName !== undefined &&
        formData.chargeType !== undefined &&
        formData.billingType !== undefined &&
        formData.direction !== undefined &&
        (formData.billingCycle !== undefined ||
        formData.billingMonth !== undefined) ){
          let data = {
            ServiceName: formData.serviceName,
            accountName: formData.accountName,
            chargeType: formData.chargeType,
            billingType: formData.billingType,
            direction: formData.direction,
            beginDate: formData.beginDate
            ? moment(formData.beginDate).format('YYYY-MM-DD')
            : undefined,
            billingCycle:formData.billingCycle,
            billingMonth: formData.billingMonth
              ? moment(formData.billingMonth).format('YYYY-MM')
              :undefined,
            endDate: formData.endDate
            ? moment(formData.endDate).format('YYYY-MM-DD')
            : undefined
          }
          if(formData.direction === 1 || formData.direction === 3){
             ReconciliationDataComfirmationInboundDestination(data).then((resp:recodeConfig)=>{
               this.settleFormOptions[0].options = resp.data
             })
          }
          if(formData.direction === 2 || formData.direction === 3){
            ReconciliationDataComfirmationOutboundDestination(data).then((resp:recodeConfig)=>{
              this.settleFormOptions[1].options = resp.data
            })
          }
        }
    }
  }
  public getDestinationsOptionsFunc(formData: any, name: any, isAll: boolean) {
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
      if (isAll) {
        getDestinationsOptions({ params: data }, true).then((res: any) => {
          this.DestinationOptions = res;
          this.searchFormOptions[6].options = res;
        });
      } else {
        if (this.isAdd) {
          data["billingCycle"] = formData["Cycle"];
          data["billingMonth"] = formData["Month"]
            ? moment(formData["Cycle"]).format("YYYY-MM")
            : undefined;
          data["chargeType"] = formData["ChargeType"];
          data["billingType"] = formData["BillingType"];

          if (
            (formData["Month"] && formData["Cycle"] == undefined) ||
            formData["Cycle"] == "-"
          ) {
            data["endDate"] =
              moment(formData["Month"])
                .endOf("month")
                .format("YYYY-MM-DD") ||
              moment(formData["billingMonth"])
                .endOf("month")
                .format("YYYY-MM-DD");
            data["beginDate"] =
              moment(formData["Month"])
                .startOf("month")
                .format("YYYY-MM-DD") ||
              moment(formData["billingMonth"])
                .startOf("month")
                .format("YYYY-MM-DD");
          }
          if (formData["Cycle"]) {
            this.CyclesOptions.forEach((element: any) => {
              if (
                element.name === formData["Cycle"] ||
                element.name === formData["billingCycle"]
              ) {
                data["beginDate"] = element.BeginDate;
                data["endDate"] = element.EndDate;
              }
            });
          }
        }
      }
    }
  }

  public selectChange(formData: any, name: string) {
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
    this.getDestinationsOptionsFunc(formData, name, true);
  }

  private baseInfoSelectChange(formData: any, name: string): void {
    if (formData["Direction"] == 1) {
      this.settleFormOptions[0].disabled = false;
      this.settleFormOptions[0].required = true;
      this.settleFormOptions[1].initialValue = [];
    } else {
      this.settleFormOptions[0].disabled = true;
      this.settleFormOptions[0].required = false;
    }
    if (formData["Direction"] == 2) {
      this.settleFormOptions[1].disabled = false;
      this.settleFormOptions[1].required = true;
      this.settleFormOptions[0].initialValue = [];
    } else {
      this.settleFormOptions[1].disabled = true;
      this.settleFormOptions[1].required = false;
    }
    if (formData["Direction"] == 3) {
      this.settleFormOptions[1].disabled = false;
      this.settleFormOptions[0].disabled = false;
      this.settleFormOptions[0].required = true;
      this.settleFormOptions[1].required = true;
    }
    if (name === "Account" || name === "Service" || name === "Direction") {
      let data = {
        accountName: formData["Account"],
        serviceName: formData["Service"],
        direction: formData["Direction"]
      };
      getCyclesOptions({ params: data }).then((res: any) => {
        this.baseInfoFormOptions[5].options = res;
        this.CyclesOptions = res;
      });
    }
    this.modelDestinationsOptionsFunc()
    if (this.selectName != "Edit") {
      this.commomBaseInfoSelectChange(
        formData,
        this.baseInfoFormOptions,
        this.$refs.baseInfoFormGroup,
        name
      );
    }
    //
    for (let i in this.baseInfoFormOptions) {
      let item: any = this.baseInfoFormOptions[i];
      if (item.decorator == "Direction") {
        for (let j in item.options) {
          let obj = item.options[j];
          //根据BillingType来确认Direction的可选值
          if (formData["BillingType"] !== 3) {
            if (obj.name === "bilateral") {
              obj.disabled = true;
            }
          } else {
            obj.disabled = false;
          }
        }
      }
    }
  }
//  MOnth 选择框
  private baseInfoPickerChange(formData: any, newData: any = {}): void {
    this.commomBaseInfoPickerChange(
      formData,
      newData,
      this.selectName,
      this.$refs.baseInfoFormGroup
    );
    this.modelDestinationsOptionsFunc()
  }

  // 修改按钮可否点击
  private changeDisable(selectedRows: any) {
    /* 0 Add 1 Edit 2 Confirm  3 Anti confirm  4 Delete  5 Details 6 Export */
    this.selectedBtn.forEach((item: any, index: number) => {
      if (selectedRows.length == 0) {
        item.name !== "Add" ? (item.disabled = true) : (item.disabled = false);
      } else if (selectedRows.length === 1) {
        if (
          item.name === "Confirm" ||
          item.name === "Delete" ||
          item.name === "Edit"
        ) {
          if (selectedRows[0].dataConfirmationStatus !== 1) {
            item.disabled = false;
          }
        } else if (item.name === "Anti confirm") {
          if (selectedRows[0].dataConfirmationStatus !== 2) {
            item.disabled = false;
          }
        } else {
          if (item.name === "Details" || item.name === "Export") {
            item.disabled = false;
          }
        }
      } else if (selectedRows.length >= 1) {
        if (
          item.name === "Add" ||
          item.name === "Export" ||
          item.name === "Delete" ||
          item.name === "Confirm" ||
          item.name === "Anti confirm"
        ) {
          item.disabled = false;
          let dataConfirmationChoseDeleteOrAnticonfirm = selectedRows.every(
            (item: any) => item.dataConfirmationStatus === 2
          );
          let dataConfirmationChoseConfirm = selectedRows.every(
            (item: any) => item.dataConfirmationStatus === 1
          );
          if (
            (item.name === "Delete" || item.name === "Confirm") &&
            dataConfirmationChoseDeleteOrAnticonfirm === false
          ) {
            item.disabled = true;
          }
          if (
            item.name === "Anti confirm" &&
            dataConfirmationChoseConfirm === false
          ) {
            item.disabled = true;
          }
        } else {
          if (item.name !== "Add" || item.name !== "Export") {
            item.disabled = true;
          }
        }
      }
    });
  }

  /* 用户手动选择/取消选择所有列的回调  Table -> 回调 */
  public onSelectAll(selected: any, selectedRows: any, changeRows: any) {
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
   
  }

  /* 选择当前列表显示多少列
            @param: current  : 当前页
            @param：pageSize : 当前显示多少列
         */
  public onShowSizeChange(current: number, pageSize: number): void {

  }

  /* 操作栏点击 -> 回调 */
  public activeClick(msg: any) {}

  // 表格样式
  private rowClassName(record: any, index: any) {
    if (record.te) {
      return "left";
    }
    return "";
  }

  // model 内表格 样式
  private modelRowClassName(record: any, index: any) {
    let str = "";
    if (this.direction == 2) {
      str = "disabled-in";
    } else if (this.direction == 1) {
      str = "disabled-out";
    }
    if (index <= 2) {
      return str + " disabled-netting";
    }
    return str;
  }

  // 表格 上方按钮
  private onSelectClick(activeObJ: any, selected: any, selectedData: any) {
    this.modelData = this.modelData;
    this.direction = "";
    this.selectName = activeObJ.name;
    if (activeObJ.name == "Details") {
      this.showExport = true;
    } else {
      this.showExport = false;
    }
    switch (activeObJ.name) {
      case "Export":
        this.toExport(selectedData, undefined, selected);
        break;
      case "Edit":
        this.CompareShow = true;
        this.toEdit(selected, selectedData);
        this.modelDestinationsOptionsFunc(selectedData[0])
        break;
      case "Details":
        this.toEdit(selected, selectedData);
        this.CompareShow = false;
        break;
      case "Add":
        this.visible = true;
        this.isAdd = true;
        this.CompareShow = true;
        modelColumns[1].children[1].title = "KDDI";
        modelColumns[2].children[1].title = "KDDI";
        modelColumns[3].children[1].title = "KDDI";
        this.baseInfoFormOptions.forEach((item: any) => {
          item.disabled =
            item.decorator === "BeginDate" || item.decorator === "EndDate";
          this.$set(item, "initialValue", undefined);
        });
        this.settleFormOptions[0].initialValue = [];
        this.settleFormOptions[1].initialValue = [];
        this.settleFormOptions[2].initialValue = undefined;
        this.settleFormOptions[3].initialValue = undefined;
        break;
      case "Delete":
        const that1 = this;
        this.$confirm({
          title: "Confirm!",
          content: "Are you sure you deleted the data?",
          okText: "YES",
          cancelText: "NO",
          async onOk() {
            const dataConfirmationId = selectedData
              .map((item: any) => item.dataConfirmationId)
              .join("&dataConfirmationId=");
            let url = `/finance/reconciliation/dataConfirmation?dataConfirmationId=${dataConfirmationId}`;
            await AxiosDelete(url).then((resp: recodeConfig) => {
              if (resp.code !== 1) {
                that1.$message.warning(resp.msg);
              } else {
                that1.$message.success(resp.msg);
                that1.SearchOk("");
              }
            });
          }
        });
        break;
      case "Confirm":
        const that = this;
        this.$confirm({
          title: "Confirm!",
          content: "Data mutual exclusion,do you go on?",
          okText: "YES",
          cancelText: "NO",
          async onOk() {
            const dataConfirmationId = selectedData
              .map((item: any) => item.dataConfirmationId)
              .join("&confirmIDs=");
            let url = `/finance/reconciliation/dataConfirmation/confirm?confirmIDs=${dataConfirmationId}`;
            AxiosPatch(url).then((resp: recodeConfig) => {
              if (resp.code !== 1) {
                that.$message.warning(resp.msg);
              } else {
                that.$message.success(resp.msg);
                that.SearchOk("");
              }
            });
          }
        });
        break;
      case "Anti confirm":
        const thats = this;
        this.$confirm({
          title: "Anti confirm!",
          content: "Data mutual exclusion,do you go on?",
          okText: "YES",
          cancelText: "NO",
          async onOk() {
            const dataConfirmationId = selectedData
              .map((item: any) => item.dataConfirmationId)
              .join("&antiConfirmIDs=");
            let url = `/finance/reconciliation/dataConfirmation/antiConfirm?antiConfirmIDs=${dataConfirmationId}`;
            await AxiosPatch(url).then((resp: recodeConfig) => {
              if (resp.code !== 1) {
                thats.$message.warning(resp.msg);
              } else {
                thats.$message.success(resp.msg);
                thats.SearchOk("");
              }
            });
          }
        });
        break;
    }
  }
  // 确认后修改
  private ConfirmDetail(that: any, selected: any, data: any) {
    for (let i = 0; i < selected.length; i++) {
      const index = selected[i];
      data[index] = Object.assign(data[index], {
        LastModified: moment().format("YYYY-MM-DD HH:mm:ss"),
        ModifiedBy: "vivian",
        Status: this.selectName === "Confirm" ? 1 : 2
      });
    }
    if (this.selectName == "Confirm") {
      that.$message.success("The difference is confirmed!");
    } else {
      that.$message.success(
        "The difference is unconfirmed, please continue to process!"
      );
    }
  }

  private toExport(
    selectedData: any,
    name: any = "Reconciliation record.xls",
    selected?: any
  ): void {
    const filterData = selectedData.map((item: any) => {
      let newItem = JSON.parse(JSON.stringify(item));
      delete newItem.key;
      delete newItem.modelData;
      for (let key in newItem) {
        let find: any;
        switch (key) {
          case "Status":
            find = this.DifferenceOptions.find(
              (inner: any) => inner.value === item[key]
            );
            break;
          case "ChargeType":
            find = this.ChargeTypeOptions.find(
              (inner: any) => inner.value === item[key]
            );
            break;
          case "BillingType":
            find = this.BillingTypeOptions.find(
              (inner: any) => inner.value === item[key]
            );
            break;
          case "InboundDestination && OutboundDestination":
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

    const ws: xlsx.WorkSheet = xlsx.utils.json_to_sheet(filterData);
    const wb: xlsx.WorkBook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, "Sheet1");
    xlsx.writeFile(wb, name);
  }

  private toEdit(selected: any, selectedData: any): void {
    //初始时先清除inbound 和 outbound的值
    if (selectedData[0].Direction) {
      this.settleFormOptions[0].initialValue = [];
      this.settleFormOptions[1].initialValue = [];
    }
    if (selectedData.length > 1 || !selectedData.length) {
      this.$warning({
        title: "Warning!",
        content:
          "The data cannot be edited,You can only choose one and not many.",
        onOk() {},
        onCancel() {}
      });
      return;
    }
    this.visible = true;
    this.selectkeyArr = selected;
    const data = Object.assign({}, selectedData[0], {
      Account: selectedData[0].accountName,
      BeginDate:
        selectedData[0].beginDate !== undefined
          ? moment(selectedData[0].beginDate).format("YYYY-MM-DD")
          : selectedData[0].beginDate,
      Cycle: selectedData[0].billingCycle,
      Month:
        selectedData[0].billingMonth !== undefined
          ? moment(selectedData[0].billingMonth).format("YYYY-MM")
          : undefined,
      BillingType: selectedData[0].billingType,
      ChargeType: selectedData[0].chargeType,
      dataConfirmationId: selectedData[0].dataConfirmationId,
      Status: selectedData[0].dataConfirmationStatus,
      dataEntryIdInbound: selectedData[0].dataEntryIdInbound,
      dataEntryIdOutbound: selectedData[0].dataEntryIdOutbound,
      Direction: selectedData[0].direction,
      EndDate:
        selectedData[0].endDate !== undefined
          ? moment(selectedData[0].endDate).format("YYYY-MM-DD")
          : selectedData[0].endDate,
      InboundDestination: selectedData[0].inboundDestList,
      OutboundDestination: selectedData[0].outboundDestList,
      Remark: selectedData[0].remark,
      Service: selectedData[0].serviceName,
    });
    let modelData = [
      {
          key: 0,
          Inbound_CTM: selectedData[0].inboundMins1,
          Inbound_Difference_rate: selectedData[0].inboundMinsDifference,
          Inbound_Difference_value: selectedData[0].inboundMinsDifferencePercent,
          Inbound_KDDI: selectedData[0].inboundMins2,
          Netting_CTM: selectedData[0].nettingMins1,
          Netting_Difference_rate: selectedData[0].nettingMinsDifference,
          Netting_Difference_value: selectedData[0].nettingMinsDifferencePercent,
          Netting_KDDI: selectedData[0].nettingMins2,
          Outbound_CTM: selectedData[0].outboundMins1,
          Outbound_Difference_rate: selectedData[0].outboundMinsDifference,
          Outbound_Difference_value: selectedData[0].outboundMinsDifference,
          Outbound_KDDI: selectedData[0].outboundMins2
      },
      {
          key: 1,
          Inbound_CTM: selectedData[0].inboundCalls1,
          Inbound_Difference_rate: selectedData[0].inboundCallsDifference,
          Inbound_Difference_value: selectedData[0].inboundCallsDifferencePercent,
          Inbound_KDDI: selectedData[0].inboundCalls2,
          Netting_CTM: selectedData[0].nettingCalls1,
          Netting_Difference_rate: selectedData[0].nettingCallsDifference,
          Netting_Difference_value: selectedData[0].nettingCallsDifferencePercent,
          Netting_KDDI: selectedData[0].nettingCalls2,
          Outbound_CTM: selectedData[0].outboundCalls1,
          Outbound_Difference_rate: selectedData[0].outboundCallsDifference,
          Outbound_Difference_value: selectedData[0].outboundCallsDifferencePercent,
          Outbound_KDDI: selectedData[0].outboundCalls2
      },{
          key: 2,
          Inbound_CTM: selectedData[0].inboundVolume1,
          Inbound_Difference_rate: selectedData[0].inboundVolumeDifference,
          Inbound_Difference_value: selectedData[0].inboundVolumeDifferencePercent,
          Inbound_KDDI: selectedData[0].inboundVolume2,
          Netting_CTM: selectedData[0].nettingVolume1,
          Netting_Difference_rate: selectedData[0].nettingVolumeDifference,
          Netting_Difference_value: selectedData[0].nettingVolumeDifferencePercent,
          Netting_KDDI: selectedData[0].nettingVolume2,
          Outbound_CTM: selectedData[0].outboundVolume1,
          Outbound_Difference_rate: selectedData[0].outboundVolumeDifference,
          Outbound_Difference_value: selectedData[0].outboundVolumeDifferencePercent,
          Outbound_KDDI: selectedData[0].outboundVolume2
      },{
          key: 3,
          Inbound_CTM: selectedData[0].inboundAmount1,
          Inbound_Difference_rate: selectedData[0].inboundAmountDifference,
          Inbound_Difference_value: selectedData[0].inboundAmountDifferencePercent,
          Inbound_KDDI: selectedData[0].inboundAmount2,
          Netting_CTM: selectedData[0].nettingAmount1,
          Netting_Difference_rate: selectedData[0].nettingAmountDifference,
          Netting_Difference_value: selectedData[0].nettingAmountDifferencePercent,
          Netting_KDDI: selectedData[0].nettingAmount2,
          Outbound_CTM: selectedData[0].outboundAmount1,
          Outbound_Difference_rate: selectedData[0].outboundAmountDifference,
          Outbound_Difference_value: selectedData[0].outboundAmountDifferencePercent,
          Outbound_KDDI: selectedData[0].outboundAmount2
      },
    ]
    setTimeout(() => {
      // 基础信息
      // const baseInfoFormGroup: any = this.$refs.baseInfoFormGroup
      // baseInfoFormGroup.setFieldsValue(data)
      this.tableInputDisabled = this.selectName === "Details";
      for (let dataKey in data) {
        this.baseInfoFormOptions.forEach((item: any) => {
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
          if (item.decorator === dataKey) {
            this.$set(item, "initialValue", data[dataKey]);
          }
        });
        modelColumns[1].children[1].title = this.baseInfoFormOptions[1].initialValue;
        modelColumns[2].children[1].title = this.baseInfoFormOptions[1].initialValue;
        modelColumns[3].children[1].title = this.baseInfoFormOptions[1].initialValue;
        this.dataConfirmationId = selectedData[0].dataConfirmationId;
        this.settleFormOptions.forEach((item: any, index: number) => {
          item.disabled = this.selectName === "Details";
          if (
            item.decorator === dataKey &&
            (dataKey === "OutboundDestination" ||
              dataKey === "InboundDestination")
          ) {
            if (data[dataKey] !== undefined) {
              let datas = data[dataKey].split(",");
              this.$set(item, "initialValue", datas);
            }
          }
          // 由于 Status 和 Remark 的 initialValue 是字符串 所以使用 $set 进行赋值
          if (
            item.decorator === dataKey &&
            (dataKey === "Status" || dataKey === "Remark")
          ) {
            this.$set(item, "initialValue", data[dataKey]);
          }
        });
      }
      if(this.selectName === "Edit"){
        if (selectedData[0].direction === 1) {
        this.$set(this.settleFormOptions[1], "disabled", true);
      } else if (selectedData[0].direction === 2) {
        this.$set(this.settleFormOptions[0], "disabled", true);
      }
      }
      
      if(this.selectName === "Details"){
        // 弹出框里 Table 里的数据进行赋值
        this.modelData = this.calculatorDiff(data.Direction, modelData);
      }
    }, 250);
  }

  // 计算model弹出框 数据差值 和不显示数据
  private calculatorDiff(direction: any, data): any {
    return data.map((item: any, index: number) => {
      let newItem = JSON.parse(JSON.stringify(item));
      let obj: any;
      for (let key in newItem) {
        if (
          (direction == 1 && key.startsWith("Outbound")) ||
          (direction == 2 && key.startsWith("Inbound")) ||
          (key.startsWith("Netting") && index !== data.length - 1)
        ) {
          delete newItem[key];
        }
      }
      if (index === data.length - 1) {
        if (direction == 1) {
          obj = {
            Netting_CTM: item.Inbound_CTM,
            Netting_KDDI: item.Inbound_KDDI
          };
        } else if (direction == 2) {
          obj = {
            Netting_CTM: item.Outbound_CTM,
            Netting_KDDI: item.Outbound_KDDI
          };
        } else {
          obj = {
            Netting_CTM: item.Netting_CTM,
            Netting_KDDI: item.Netting_KDDI
          };
        }
      }
      return Object.assign({}, newItem, obj);
    });
  }

  // model 弹出框点击 save按钮
  private async save() {
    this.isAdd = false;
    const baseInfoFormGroup: any = this.$refs.baseInfoFormGroup;
    const baseInfoData = baseInfoFormGroup.validateFields();
    const settleFormGroup: any = this.$refs.settleFormGroup;
    const settleData = settleFormGroup.validateFields();
    let data = {
      accountName: baseInfoData.Account,
      beginDate:
        baseInfoData.BeginDate !== undefined
          ? moment(baseInfoData.BeginDate).format("YYYY-MM-DD")
          : baseInfoData.BeginDate,
      billingCycle: baseInfoData.Cycle,
      billingMonth:
        baseInfoData.Month !== undefined
          ? moment(baseInfoData.Month).format("YYYY-MM")
          : baseInfoData.Month,
      billingType: baseInfoData.BillingType,
      chargeType: baseInfoData.ChargeType,
      dataConfirmationId: this.dataConfirmationId,
      dataConfirmationStatus: settleData.Status,
      dataEntryIdInbound: undefined,
      dataEntryIdOutbound: undefined,
      direction: baseInfoData.Direction,
      endDate:
        baseInfoData.EndDate !== undefined
          ? moment(baseInfoData.EndDate).format("YYYY-MM-DD")
          : baseInfoData.EndDate,
      inboundAmount1: this.modelData[3].Inbound_CTM,
      inboundAmount2: this.modelData[3].Inbound_KDDI,
      inboundAmountDifference: this.modelData[3].Inbound_Difference_rate,
      inboundAmountDifferencePercent: this.modelData[3]
        .Inbound_Difference_value,
      inboundCalls1: this.modelData[1].Inbound_CTM,
      inboundCalls2: this.modelData[1].Inbound_KDDI,
      inboundCallsDifference: this.modelData[1].Inbound_Difference_rate,
      inboundCallsDifferencePercent: this.modelData[1].Inbound_Difference_value,
      inboundDestList:
        settleData.InboundDestination !== []
          ? settleData.InboundDestination.join(",")
          : undefined,
      inboundMins1: this.modelData[0].Inbound_CTM,
      inboundMins2: this.modelData[0].Inbound_KDDI,
      inboundMinsDifference: this.modelData[0].Inbound_Difference_rate,
      inboundMinsDifferencePercent: this.modelData[0].Inbound_Difference_value,
      inboundVolume1: this.modelData[2].Inbound_CTM,
      inboundVolume2: this.modelData[2].Inbound_KDDI,
      inboundVolumeDifference: this.modelData[2].Inbound_Difference_rate,
      inboundVolumeDifferencePercent: this.modelData[2]
        .Inbound_Difference_value,
      nettingAmount1: this.modelData[3].Netting_CTM,
      nettingAmount2: this.modelData[3].Netting_KDDI,
      nettingAmountDifference: this.modelData[3].Netting_Difference_rate,
      nettingAmountDifferencePercent: this.modelData[3]
        .Netting_Difference_value,
      nettingCalls1: this.modelData[1].Netting_CTM,
      nettingCalls2: this.modelData[1].Netting_KDDI,
      nettingCallsDifference: this.modelData[1].Netting_Difference_rate,
      nettingCallsDifferencePercent: this.modelData[1].Netting_Difference_value,
      nettingMins1: this.modelData[0].Netting_CTM,
      nettingMins2: this.modelData[0].Netting_KDDI,
      nettingMinsDifference: this.modelData[0].Netting_Difference_rate,
      nettingMinsDifferencePercent: this.modelData[0].Netting_Difference_value,
      nettingVolume1: this.modelData[2].Netting_CTM,
      nettingVolume2: this.modelData[2].Netting_KDDI,
      nettingVolumeDifference: this.modelData[2].Netting_Difference_rate,
      nettingVolumeDifferencePercent: this.modelData[2]
        .Netting_Difference_value,
      outboundAmount1: this.modelData[3].Outbound_CTM,
      outboundAmount2: this.modelData[3].Outbound_KDDI,
      outboundAmountDifference: this.modelData[3].Outbound_Difference_rate,
      outboundAmountDifferencePercent: this.modelData[3]
        .Outbound_Difference_value,
      outboundCalls1: this.modelData[1].Outbound_CTM,
      outboundCalls2: this.modelData[1].Outbound_KDDI,
      outboundCallsDifference: this.modelData[1].Outbound_Difference_rate,
      outboundCallsDifferencePercent: this.modelData[1]
        .Outbound_Difference_value,
      outboundDestList: settleData.OutboundDestination
        ? settleData.OutboundDestination.join(",")
        : undefined,
      outboundMins1: this.modelData[0].Outbound_CTM,
      outboundMins2: this.modelData[0].Outbound_KDDI,
      outboundMinsDifference: this.modelData[0].Outbound_Difference_rate,
      outboundMinsDifferencePercent: this.modelData[0]
        .Outbound_Difference_value,
      outboundVolume1: this.modelData[2].Outbound_CTM,
      outboundVolume2: this.modelData[2].Outbound_KDDI,
      outboundVolumeDifference: this.modelData[2].Outbound_Difference_rate,
      outboundVolumeDifferencePercent: this.modelData[2]
        .Outbound_Difference_value,
      remark: settleData.Remark,
      serviceName: baseInfoData.Service
    };
    if (settleData.Status == undefined) {
      this.$message.warning("Status must be entered");
    } else {
      if (!baseInfoData) return console.log(1);
      if (this.selectName === "Add") {
        await ReconciliationDataComfirmationAdd(data).then(
          (resp: recodeConfig) => {
            if (resp.code !== 1) {
              this.$message.warning(resp.msg);
            } else {
              this.SearchOk("");
              this.visible = false;
            }
          }
        );
      }
    }
    if (this.selectName === "Edit") {
      await ReconciliationDataComfirmationEdit(data).then(
        (resp: recodeConfig) => {
          if (resp.code !== 1) {
            this.$message.warning(resp.msg);
          } else {
            this.SearchOk("");
            this.visible = false;
          }
        }
      );
    }
  }
  private ExportOp() {
    const name: any = "Details record.xls";
    let table = document.createElement("table"); //创建一个li节点
    const tableRef: any = this.$refs.ExportTable;
    const list = tableRef.$el.querySelectorAll(".ant-table-fixed");
    let html: string = "";
    for (let i = 0; i < list.length; i++) {
      html += list[i].innerHTML;
    }
    table.innerHTML = html;
    const sheet: any = xlsx.utils.table_to_sheet(table); //将一个table对象转换成一个sheet对象
    // antd表头和body 在不同的table上  下列操作为合并
    this.openDownloadDialog(this.sheet2blob(sheet), name);
  }
  private onSoltClick(soltName: string, text: any, record: any, index: number) {
    if (soltName === "download") {
      // this.toExport([record], text)
      this.selectName = "";
      this.visible = true;
      this.toExportRowKey = index;
    }
  }
  // 弹出框关闭按钮
  private handleReturn() {
    this.settleFormOptions.forEach((item: any) => {
      this.$set(item, "disabled", false);
    });
    this.modelData.forEach((item: any) => {
      item.Inbound_CTM = undefined;
      item.Inbound_KDDI = undefined;
      item.Outbound_CTM = undefined;
      item.Outbound_KDDI = undefined;
      item.Netting_CTM = undefined;
      item.Netting_KDDI = undefined;
    });
    this.visible = !this.visible;
    this.isAdd = false;
  }
  // compare按钮
  private async settleHandleClick(name) {
    // add 对比按钮
    const baseInfoFormGroup: any = this.$refs.baseInfoFormGroup;
    const baseInfoData = baseInfoFormGroup.validateFields();
    this.direction = baseInfoData.Direction;
    const settleFormGroup: any = this.$refs.settleFormGroup;
    const settleData = settleFormGroup.validateFields();
    let data = {
      accountName: baseInfoData.Account,
      beginDate:
        baseInfoData.BeginDate !== undefined
          ? moment(baseInfoData.BeginDate).format("YYYY-MM-DD")
          : baseInfoData.BeginDate,
      billingCycle: baseInfoData.Cycle,
      billingMonth:
        baseInfoData.Month !== undefined
          ? moment(baseInfoData.Month).format("YYYY-MM")
          : baseInfoData.Month,
      billingType: baseInfoData.BillingType,
      chargeType: baseInfoData.ChargeType,
      dataConfirmationStatus: settleData.Status,
      direction: baseInfoData.Direction,
      endDate:
        baseInfoData.EndDate !== undefined
          ? moment(baseInfoData.EndDate).format("YYYY-MM-DD")
          : baseInfoData.EndDate,
      inboundDestList:
        settleData.InboundDestination !== []
          ? settleData.InboundDestination.join(",")
          : undefined,
      outboundDestList: settleData.OutboundDestination
        ? settleData.OutboundDestination.join(",")
        : undefined,
      remark: settleData.Remark,
      serviceName: baseInfoData.Service
    }
    await ReconciliationDataComfirmationCompare(data).then((resp: recodeConfig) =>{

    })
  }
  public async created() {
    // 函数变量
    let AccountOptions = await getAccountOptions();
    let ServiceOptions = await getServiceOptions();
    let DestinationOptions = await getDestinationsOptions(undefined, true);
    // 变量赋值
    this.ServiceOptions = ServiceOptions;
    this.AccountOptions = AccountOptions;
    this.DestinationOptions = DestinationOptions;
    // searchFormOptions
    this.searchFormOptions[0].options = ServiceOptions;
    this.searchFormOptions[1].options = AccountOptions;
    this.searchFormOptions[6].options = DestinationOptions;
    // baseInfoFormOptions
    this.baseInfoFormOptions[0].options = ServiceOptions;
    this.baseInfoFormOptions[1].options = AccountOptions;

    this.settleFormOptions[0].options = DestinationOptions;
    this.settleFormOptions[1].options = DestinationOptions;
  }
}
</script>

<style lang="scss">
@import "@/views/Finance/common/css/deep-modal.scss";
.data-comfirmation .ant-table-tbody tr.left td:not(:first-child) {
  text-align: left;
}
.SpanBtn {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 20px;
}
.components-table .ant-table-tbody > tr.disabled-in > td {
  &:nth-of-type(2),
  &:nth-of-type(3),
  &:nth-of-type(4),
  &:nth-of-type(5) {
    background: #eee;
  }
}

.components-table .ant-table-tbody > tr.disabled-out > td {
  &:nth-of-type(6),
  &:nth-of-type(7),
  &:nth-of-type(8),
  &:nth-of-type(9) {
    background: #eee;
  }
}

.components-table .ant-table-tbody > tr.disabled-netting > td {
  &:nth-of-type(10),
  &:nth-of-type(11),
  &:nth-of-type(12),
  &:nth-of-type(13) {
    background: #eee;
  }
}
</style><style lang="scss" scoped>
@import "@/views/Finance/common/css/Statement.scss";
@import "@/views/Finance/common/css/modal.scss";
</style>
<style>
.data-confirmation .el-input--suffix .el-input__inner {
  height: 32px !important;
  line-height: 32px !important;
}
.data-confirmation .el-select__tags {
  max-width: 350px !important;
}
</style>