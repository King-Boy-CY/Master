<template>
  <div class="statement monthly">
    <!-- 高级搜索 -->
    <Advanced-search
      :formoptions="formOptions"
      :formscreening="Formscreening"
      :needExport="false"
      searchText="Search"
      @Submit="SearchOk"
      @selectChange="selectChange"
      @monthPickerChange="monthPickerChange"
      @btnClick="activeClick"
      ref="AdvancedSearch"
    />
    <Table
      parentKey="id"
      :isFinance="true"
      :isNeedCheck="true"
      :selectedBtn="selectedBtn"
      :isShowDownloadColor="true"
      @onSelectClick="onSelectClick"
      @onSoltClick="onSoltClick"
      ref="table"
      :lessSpace="true"
      @onSelect="onSelect"
      @onSelectAll="onSelectAll"
      :columns="columns"
      :data="data"
      :scrollX="3200"
      zebraStripe
    ></Table>
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
      :title="modalTitle"
      onOk="handleOk"
    >
      <div class="body">
        <div class="modal-box" :key="href+0">
          <div class="modal-box-title" v-if="selectName === 'Edit'">
            <span class="piece"></span>
            <span class="title-text">Basic data</span>
          </div>
          <!--@inputChange=""-->
          <form-group
            v-if="selectName !== 'nettingStatementDetails'"
            :formoptions="selectName === 'Edit'?editBaseInfoFormOptions:baseInfoFormOptions"
            @selectChange="baseInfoSelectChange"
            @monthPickerChange="baseInfoPickerChange"
            :span="12"
            ref="baseInfoFormGroup"
            resize="none"
            class="form-group"
          ></form-group>
          <Table
            v-else
            :isFinance="true"
            @onSelectClick="onSelectClick"
            ref="ExportTable"
            @onSelect="onSelect"
            @onSelectAll="onSelectAll"
            :columns="statementColumns"
            :data="statementData"
            :rowClassName="rowClassName"
            :isPagination="false"
            zebraStripe
          ></Table>
        </div>

        <template v-show="selectName === 'Edit'">
          <!--Inbound data-->
          <div class="modal-box" v-show="ShowInbounddata" :key="href+1">
            <div class="modal-box-title">
              <span class="piece"></span>
              <span class="title-text">Inbound data</span>
            </div>
            <form-group
              :formoptions="inboundFormOptions"
              @selectChange="inboundSelectChange"
              @inputChange="inboundSelectChange"
              :span="12"
              ref="inboundInfoFormGroup"
              class="form-group"
            ></form-group>
          </div>

          <!--Outbound data-->
          <div class="modal-box" v-show="ShowOutbounddata" :key="href+2">
            <div class="modal-box-title">
              <span class="piece"></span>
              <span class="title-text">Outbound data</span>
            </div>
            <form-group
              :formoptions="outboundFormOptions"
              @selectChange="outboundSelectChange"
              @inputChange="outboundSelectChange"
              :span="12"
              ref="outboundInfoFormGroup"
              class="form-group"
            ></form-group>
          </div>

          <!--Netting data-->
          <div class="modal-box" v-show="ShowNettingData" :key="href+3">
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
        </template>
      </div>
      <div style="padding-top: 20px;text-align: center">
        <a-button
          v-if="selectName !== 'nettingStatementDetails'"
          type="primary"
          style="border-radius: 50px;min-width: 90px"
          @click="save"
        >Save</a-button>
        <a-button
          type="primary"
          style="border-radius: 50px;min-width: 90px"
          @click="toExportExcel"
          v-if="selectName == 'nettingStatementDetails'"
        >toExport</a-button>
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
import { Component } from "vue-property-decorator";
import { exportExcelTransferFormat } from "@/views/Finance/components/DownloadFile/xlsx";
import { downloadLocalFiles } from "@/views/Finance/components/DownloadFile/saveFile";
import {
  columns
} from "./Test";
import {
  statementColumns
} from "@/views/Finance/Netting/statement/Test.ts";
import {
  BillingTypeOptions,
  ChargeTypeOptions,
  DirectionOptions,
  SettleTypeOptions,
  adjustmentStatusOptions
} from "@/views/Finance/common/data/index.ts";
import {
  getAccountOptions,
  getServiceOptions,
  RecordSearchData,
  getCyclesOptions,
  getCurrencyOptions
} from "@/views/Finance/common/js/exchangeData.ts";
import moment from "moment";
import {
  NettingStatementEdit,
  NettingStatementAuditing,
  NettingStatementSubmit
} from "@/api/index.ts";
import { refsConfig, recodeConfig } from "@/assets/ts/config.d";
import financeMixin from "@/views/Finance/common/js/mixin.ts";
import xlsx from "xlsx";
import {
  baseInfoFormOptions,
  inboundFormOptions,
  outboundFormOptions,
  nettingdFormOptions,
  nettingObj
} from "@/views/Finance/common/data/netting.ts";
import { AxiosGet, AxiosDelete } from "@/api/axios";
import { deepClone } from "@/assets/ts/index.ts";
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
export default class Record extends Vue {
  private href: string = window.location.href;
  public columns: any[] = columns;
  public data: any[] = [];
  private CyclesOptions: any = null;
  public statementColumns: any[] = statementColumns;
  private toExportRowKey: number = 0;
  private searchData: any;
  public $refs: refsConfig | any;
  private ShowNettingData: boolean = true;
  private ShowOutbounddata: boolean = true;
  private ShowInbounddata: boolean = true;
  private DirectionOptions: any[] = DirectionOptions();
  private BillingTypeOptions: any[] = BillingTypeOptions();
  private ChargeTypeOptions: any[] = ChargeTypeOptions();
  private SettleTypeOptions: any[] = SettleTypeOptions();
  private adjustmentStatusOptions: any[] = adjustmentStatusOptions();

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
      required: false,
      type: "select",
      options: null
    },
    {
      Tips: "Account",
      name: "Account",
      required: false,
      type: "select",
      options: null
    },
    {
      Tips: "Charge type",
      name: "ChargeType",
      required: false,
      type: "select",
      options: this.ChargeTypeOptions
    },
    {
      Tips: "Direction",
      name: "Direction",
      required: false,
      type: "select",
      options: this.DirectionOptions
    },
    {
      Tips: "Cycle",
      name: "Cycle",
      required: false,
      type: "select",
      options: null,
      disabled: false
    },
    {
      Tips: "Month",
      name: "Month",
      required: false,
      type: "picker-month",
      disabled: false
    },
    {
      Tips: "Begin date",
      name: "BeginDate",
      required: false,
      disabled: false,
      type: "picker"
    },
    {
      Tips: "End date",
      name: "EndDate",
      required: false,
      disabled: false,
      type: "picker"
    },
    {
      Tips: "Status",
      name: "Status",
      required: false,
      type: "select",
      options: this.adjustmentStatusOptions
    },
    {
      Tips: "Settle Type",
      name: "SettleType",
      required: false,
      type: "select",
      options: this.SettleTypeOptions
    }
  ];
  /* 筛选栏 button-数据
         @param name: button 名字
         @param icon: button 图标
      */

  private selectedBtn: any = [
    {
      name: "Submit",
      icon: "form",
      // style: {backgroundColor: '#316ad7', color: '#fff'},
      index: 0,
      disabled: true,
      tips: "Selected records can NOT be reviewed  or submitted for approval"
    },
    {
      name: "Audit",
      icon: "audit",
      index: 1,
      disabled: true,
      tips: "Selected records can NOT be reviewed  or submitted for approval"
    },
    {
      name: "Edit",
      icon: "edit",
      index: 2,
      disabled: true
    },
    {
      name: "Delete",
      icon: "delete",
      style: {
        color: "#f5b148",
        borderColor: "#f5b148"
      },
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

  private selectName: any = ""; // 点击操作栏的标识
  private direction: any = ""; // 方向
  private selectkeyArr: any = []; // 表格勾选中的key
  // 弹出框 modal  内容
  // basic data
  private baseInfoFormOptions: any[] = [];
  private SubmitNettingFormOptions: any[] = [
    {
      Tips: "Approved by",
      decorator: "ApprovedBy",
      required: true,
      type: "select",
      options: [
        {
          name: "Jack",
          value: "Jack"
        },
        {
          name: "Yarn",
          value: "Yarn"
        },
        {
          name: "UU",
          value: "UU"
        }
      ],
      span: 12,
      labelSpan: 8,
      wrapperSpan: 16
    },
    {
      Tips: "",
      decorator: "",
      required: false,
      initialValue: "",
      type: "",
      span: 12,
      labelSpan: 8,
      wrapperSpan: 16
    },
    {
      Tips: "Expected Date",
      decorator: "ExpectedDate",
      required: false,
      type: "picker",
      initialValue: moment()
        .add(3, "day")
        .format("YYYY-MM-DD"),
      span: 12,
      labelSpan: 8,
      wrapperSpan: 16
    },
    {
      Tips: "Latest Date",
      decorator: "LatestDate",
      required: false,
      type: "picker",
      initialValue: moment()
        .add(7, "day")
        .format("YYYY-MM-DD"),
      span: 12,
      labelSpan: 8,
      wrapperSpan: 16
    },
    {
      Tips: "Remark",
      decorator: "Remark",
      required: false,
      type: "textarea",
      isAlign: true,
      span: 24,
      labelSpan: 3,
      wrapperSpan: 19
    }
  ];
  private AuditNettingFormOptions: any[] = [
    {
      Tips: "Approved",
      decorator: "Approved",
      required: true,
      type: "select",
      options: [
        {
          name: "Yes",
          value: 1
        },
        {
          name: "No",
          value: 2
        }
      ],
      initialValue: 1,
      span: 12,
      labelSpan: 8,
      wrapperSpan: 20
    },
    {
      Tips: "Reason",
      decorator: "Reason",
      required: false,
      isAlign: true,
      type: "textarea",
      span: 24,
      labelSpan: 3,
      wrapperSpan: 20
    },
    {
      Tips: " ",
      decorator: "ReasonHistory",
      required: false,
      disabled: true,
      isAlign: true,
      type: "textarea",
      span: 24,
      labelSpan: 3,
      wrapperSpan: 20
    },
    {
      Tips: "Remark",
      decorator: "Remark",
      required: false,
      isAlign: true,
      type: "textarea",
      span: 24,
      labelSpan: 3,
      wrapperSpan: 20
    }
  ];

  private editBaseInfoFormOptions = baseInfoFormOptions().map((item: any) =>
    Object.assign({}, item, {
      disabled: true
    })
  );
  private inboundFormOptions = inboundFormOptions();
  private outboundFormOptions = outboundFormOptions();
  private nettingdFormOptions = nettingdFormOptions();
  private nettingObj = nettingObj();

  get modalTitle() {
    switch (this.selectName) {
      case "Submit":
        return "Submit Netting record";
      case "Audit":
        return "Audit Netting record";
      case "Edit":
        return "Edit";
      default:
        return "Details";
    }
  }
  // 高级搜索 Search -> 回调
  public async SearchOk(values: any) {
    let data: any = {
      serviceName: values.Service,
      accountName: values.Account,
      chargeType: values.ChargeType,
      nettingCycle: values.Cycle,
      nettingMonth: values.Month?moment(values.Month).format('YYYY-MM'):undefined,
      nettingStatus: values.Status,
      settleType: values.SettleType,
      beginDate: values.BeginDate?moment(values.BeginDate).format('YYYY-MM-DD'):undefined,
      direction: values.Direction,
      endDate: values.EndDate?moment(values.EndDate).format('YYYY-MM-DD'):undefined,
    };
    let resData = await RecordSearchData(data);
    if (resData.code <= 0) {
      this.$message.warning(resData.msg);
    } else {
      resData.data.forEach(element => {
          element.key = element.id;
          element.operatingTime = element.operatingTime
            ? moment(element.operatingTime).format("YYYY-MM-DD HH:mm:ss")
            : undefined;
          element.auditingTime = element.auditingTime
            ? moment(element.auditingTime).format("YYYY-MM-DD HH:mm:ss")
            : undefined;
          element.submittingTime = element.submittingTime
            ? moment(element.submittingTime).format("YYYY-MM-DD HH:mm:ss")
            : undefined;
        });
      this.data = resData.data;
    }
  }
  public monthPickerChange(formData: any, newData: any = {}) {
    // const AdvancedSearch: any = this.$refs.AdvancedSearch;
    // AdvancedSearch.setFieldsValue(
    //   Object.assign({}, newData, {
    //     BeginDate: formData["Month"]
    //       ? moment(formData["Month"]).startOf("month")
    //       : undefined,
    //     EndDate: formData["Month"]
    //       ? moment(formData["Month"]).endOf("month")
    //       : undefined,
    //     Cycle: undefined
    //   })
    // );
  }

  public selectChange(formData: any, name: string) {
    const AdvancedSearch: any = this.$refs.AdvancedSearch;
    let changeData: any = {};
    this.formOptions.forEach((item: any) => {
      // vc  Charge type 为 Hubbing 时cycle不能选择 为 VC 时 month不能选择。
      if (formData.ChargeType == undefined) {
        item.required = false;
      }
      if (
        (item.name === "Month" && formData["ChargeType"] == 2) ||
        (item.name === "Cycle" && formData["ChargeType"] == 1)
      ) {
        item.disabled = true;
        item.required = false;
      }
      if (
        (item.name === "Month" && formData["ChargeType"] == 1) ||
        (item.name === "Cycle" && formData["ChargeType"] == 2)
      ) {
        item.disabled = false;
        item.required = false;
      }
    });
    if (formData["ChargeType"] == 1) {
      this.monthPickerChange(formData, changeData);
    } else {
      let find: any;
      if (formData["Cycle"]) {
        find = this.CyclesOptions.find(
          (item: any) => item.name === formData["Cycle"]
        );
      }
    }

    if (name === "Account" || name === "Service" || name === "Direction"){
      let data = {
        accountName: formData["Account"],
        serviceName: formData["Service"],
        direction: formData["Direction"]
      };
      getCyclesOptions({ params: data }).then((res: any) => {
        console.log(res);
        this.formOptions[4].options = res;
        this.CyclesOptions = res;
      });
    }
  }

  // 修改按钮可否点击
  private changeDisable(selectedRows: any) {
    /* 0 Add 1 Edit 2 Confirm  3 Anti confirm  4 Delete  5 Details 6 Export */
    const AdvancedSearch: any = this.$refs.AdvancedSearch;
    const formData = AdvancedSearch.getFieldsValue();
    this.selectedBtn.forEach((item: any, index: number) => {
      //没有长度时
      if (!selectedRows.length) {
        item.disabled = true;
      } else if (selectedRows.length === 1) {
        //长度等于 1
        //Submit draft/Refused 可以进行 Submit    Edit draft/Refused 可以进行 Edit    Delete draft/Refused 可以进行 Delete
        if (
          (item.name === "Submit" ||
            item.name === "Delete" ||
            item.name === "Edit") &&
          (selectedRows[0].nettingStatus == 1 ||
            selectedRows[0].nettingStatus == 3)
        ) {
          item.disabled = false;
        }
        //Audit Processing 可以进行 Audit
        else if (item.name === "Audit" && selectedRows[0].nettingStatus == 2) {
          item.disabled = false;
        } else {
          if (item.name === "Export" || item.name === "Download") {
            item.disabled = false;
          }
        }
      } else if (selectedRows.length > 1) {
        //长度大于 1
        if (item.name !== "Export") {
          item.disabled = true;
        }
      }
    });
  }

  /* 用户手动选择/取消选择所有列的回调  Table -> 回调 */
  public onSelectAll(selected: any, selectedRows: any, changeRows: any) {
    // console.log(selected, selectedRows, changeRows);
    this.selectkeyArr = selected;
    this.changeDisable(selectedRows);
  }

  /* 用户手动选择/取消选择某列的回调
           @param record: 选中数据
           @param selected: 是否选中 true/false
           @param selectedRows: 所有选中 Array
        */
  public onSelect(
    record: object,
    selected: boolean,
    selectedRows: any,
    formData: any
  ) {
    this.selectkeyArr = selected;
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
  public activeClick(msg: any) {
    console.log(msg);
  }

  // 表格 上方按钮
  private onSelectClick(activeObJ: any, selected: any, selectedData: any) {
    this.selectName = activeObJ.name;
    this.selectkeyArr = selected;
    if (activeObJ.name === "Edit") {
      this.toEdit(selected, selectedData);
      this.ShowNettingData = true;
      if (selectedData[0].direction === 2 || selectedData[0].direction === 3) {
        this.ShowOutbounddata = true;
      }
      if (selectedData[0].direction === 1 || selectedData[0].direction === 3) {
        this.ShowInbounddata = true;
      }
    } else {
      this.ShowNettingData = false;
      this.ShowOutbounddata = false;
      this.ShowInbounddata = false;
    }
    if (activeObJ.name === "Submit") {
      this.baseInfoFormOptions = deepClone(this.SubmitNettingFormOptions);
      this.baseInfoFormOptions["statementNumber"] =
        selectedData[0].statementNumber;
      this.visible = true;
    }
    if (activeObJ.name === "Audit") {
      this.baseInfoFormOptions = deepClone(this.AuditNettingFormOptions);
      this.baseInfoFormOptions["statementNumber"] =
        selectedData[0].statementNumber;
      this.baseInfoFormOptions[2].initialValue =
        selectedData[0].auditReasonHistory;
      this.visible = true;
      if (selectedData[0].auditReasonHistory) {
        setTimeout(() => {
          console.log(this.$refs.baseInfoFormGroup);
          const baseInfo: any = this.$refs.baseInfoFormGroup;
          baseInfo.setFieldsValue({
            ReasonHistory: selectedData[0].auditReasonHistory
          });
        }, 500);
      } else {
        this.AuditNettingFormOptions.splice(2, 1);
      }
    }
    if (activeObJ.name === "Export") {
      this.toExport(selectedData, undefined, selected);
    }
    if (activeObJ.name === "Download") {
      this.toExportExcel(selectedData)
      console.log('selectedData',selectedData);
    }
    if (activeObJ.name === "Delete") {
      const that = this;
      const ref: any = this.$refs;
      const statementNumber = selectedData
        .map((item: any) => item.statementNumber)
        .join("&statementNumbers=");
      const url = `/finances/netting/record?statementNumber=${statementNumber}`;
      this.$confirm({
        title: "Confirm!",
        content: "Continue to  deleted the data?",
        okText: "YES",
        cancelText: "NO",
        async onOk() {
          const deleteArr = selected.sort();
          await AxiosDelete(url).then((res: any) => {
            if (res.code == 1) {
              that.SearchOk("");
            }
          });
          that.$nextTick(() => {
            ref.table.clearSelectRowKeys();
            that.$message.success("Data has been deleted successfully", 1);
          });
        }
      });
    }
  }

  private onSoltClick(soltName: string, text: any, record: any, index: number) {
    if (soltName === "download") {
      // this.toExport([record], text)
      this.selectName = "nettingStatementDetails";
      this.visible = true;
      this.toExportRowKey = index;
    }
  }
  public toExportExcel(selectedData: any) {
    if(selectedData[0].accountName === 'KT'){
      downloadLocalFiles(
      "file/NettingStatement-VC-KT-201901.xlsx",
      this.data[this.toExportRowKey].NettingStatement
    );
    }
    if(selectedData[0].accountName === 'CMCC'){
      downloadLocalFiles(
      "file/NettingStatement-VC-CMCC-201901.xlsx",
      this.data[this.toExportRowKey].NettingStatement
    );
    }
    if(selectedData[0].accountName === 'CMHK'){
      downloadLocalFiles(
      "file/NettingStatement-Hubbing-CMHK-201901.xlsx",
      this.data[this.toExportRowKey].NettingStatement
    );
    }
    if(selectedData[0].accountName === 'KDDI'){
      downloadLocalFiles(
      "file/NettingStatement-VC-KDDI-201801.xlsx",
      this.data[this.toExportRowKey].NettingStatement
    );
    }
    
  }

  private toSubmit() {}

  private toExport(
    selectedData: any,
    name: any = "Netting Record.xls",
    selected?: any
  ): void {
    const filterData = selectedData.map((item: any) => {
      let newItem = JSON.parse(JSON.stringify(item));
      console.log('newItem',newItem);
      
      delete newItem.id;
      delete newItem.InboundTableData;
      delete newItem.OutboundTableData;
      if (newItem.Direction == 1) {
        delete newItem.Outbound_Calls;
        delete newItem.Outbound_Mins;
        delete newItem.Outbound_Amount;
        delete newItem.Outbound_Currency;
      } else if (newItem.Direction == 2) {
        delete newItem.Inbound_Calls;
        delete newItem.Inbound_Mins;
        delete newItem.Inbound_Amount;
        delete newItem.Inbound_Currency;
      }
      for (let key in newItem) {
        let find: any;
        switch (key) {
          case "chargeType":
            find = this.ChargeTypeOptions.find(
              (inner: any) => inner.value === item[key]
            );
            break;
          case "direction":
            find = this.BillingTypeOptions.find(
              (inner: any) => inner.value === item[key]
            );
            break;
          case "settleType":
            find = this.SettleTypeOptions.find(
              (inner: any) => inner.value === item[key]
            );
            break;
          case "nettingStatus":
            find = this.adjustmentStatusOptions.find(
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
    /* generate workbook and add the worksheet */
    const wb: xlsx.WorkBook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, "Sheet1");
    xlsx.writeFile(wb, name);
  }

  private toEdit(selected: any, selectedData: any): void {
    this.visible = true;
    this.selectkeyArr = selected;
    const data = Object.assign({}, selectedData[0], {
      Service: selectedData[0].serviceName,
      Account: selectedData[0].accountName,
      ChargeType: selectedData[0].chargeType,
      Direction: selectedData[0].direction,
      Cycle: selectedData[0].nettingCycle,
      Month: selectedData[0].nettingMonth,
      BeginDate: selectedData[0].beginDate,
      EndDate: selectedData[0].endDate,
      Inbound_Amount: selectedData[0].amountReceivable,
      Inbound_Currency: selectedData[0].inboundCurrency,
      Inbound_Calls: selectedData[0].inboundCalls,
      Inbound_Mins: selectedData[0].inboundDuration,
      Outbound_Amount: selectedData[0].aamountPayable,
      Outbound_Currency: selectedData[0].outboundCurrency,
      Outbound_Calls: selectedData[0].outboundCalls,
      Outbound_Mins: selectedData[0].outboundDuration,
      Amount_USD: selectedData[0].nettingAmountUsd,
      ExchangeDate: selectedData[0].exchangeDate,
      id: selectedData[0].id,
      statementNumber: selectedData[0].statementNumber
    });
    this.direction = data.Direction || "";
    this.nettingObj.netting = {
      Amount_USD: data.Amount_USD,
      ExchangeDate: data.ExchangeDate
    };
    if (data.Direction == 1) {
      this.nettingObj.inbound = {
        Inbound_Amount: data.Inbound_Amount,
        Inbound_Currency: data.Inbound_Currency,
        Inbound_Calls: data.Inbound_Calls,
        Inbound_Mins: data.Inbound_Mins
      };
      this.nettingObj.outbound = undefined;
    } else if (data.Direction == 2) {
      this.nettingObj.inbound = undefined;
      this.nettingObj.outbound = {
        Outbound_Amount: data.Outbound_Amount,
        Outbound_Currency: data.Outbound_Currency,
        Outbound_Calls: data.Outbound_Calls,
        Outbound_Mins: data.Outbound_Mins
      };
    } else {
      this.nettingObj.inbound = {
        Inbound_Amount: data.Inbound_Amount,
        Inbound_Currency: data.Inbound_Currency,
        Inbound_Calls: data.Inbound_Calls,
        Inbound_Mins: data.Inbound_Mins
      };
      this.nettingObj.outbound = {
        Outbound_Amount: data.Outbound_Amount,
        Outbound_Currency: data.Outbound_Currency,
        Outbound_Calls: data.Outbound_Calls,
        Outbound_Mins: data.Outbound_Mins
      };
    }
    for (let dataKey in data) {
      this.editBaseInfoFormOptions.forEach((item: any) => {
        item.required = false;
        if (item.decorator === dataKey) {
          this.$set(item, "initialValue", data[dataKey]);
        }
      });
      this.inboundFormOptions.forEach((item: any) => {
        if (item.decorator === dataKey) {
          this.$set(item, "initialValue", data[dataKey]);
        }
      });

      this.outboundFormOptions.forEach((item: any) => {
        if (item.decorator === dataKey) {
          this.$set(item, "initialValue", data[dataKey]);
        }
      });
      this.nettingdFormOptions.forEach((item: any) => {
        if (item.decorator === dataKey) {
          this.$set(item, "initialValue", data[dataKey]);
        }
      });
    }
    this.editBaseInfoFormOptions["id"] = data.id;
    this.editBaseInfoFormOptions["statementNumber"] = data.statementNumber;
    this.calculatorTotal(false);
  }

  /* 退出 */
  handleReturn() {
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
  private baseInfoSelectChange(formData: any,name:string): void {
    if (this.selectName === "Edit") {
      this.direction = formData["Direction"] || undefined;
      if (formData.Direction == 1) {
        this.nettingObj.outbound = undefined;
      } else if (formData.Direction == 2) {
        this.nettingObj.inbound = undefined;
      }
      // 切换重新计算
      this.calculatorTotal(false);
    } else {
      if (formData.Approved) {
        this.baseInfoFormOptions.forEach((item: any) => {
          if (item.decorator === "Reason") {
            item.required = formData.Approved == 2;
            const baseInfoFormGroup: any = this.$refs.baseInfoFormGroup;
            baseInfoFormGroup.setFieldsValue({
              Reason: undefined
            });
          }
        });
      }
    }
  }

  // base 日期选择框回调
  private baseInfoPickerChange(formData: any, newData: any = {}): void {
    if (this.selectName === "Edit") {
      this.commomBaseInfoPickerChange(
        formData,
        newData,
        this.selectName,
        this.$refs.baseInfoFormGroup
      );
    }
  }

  private inboundSelectChange(formData: any) {
    this.nettingObj.inbound = formData;
    this.calculatorTotal();
  }

  private outboundSelectChange(formData: any) {
    this.nettingObj.outbound = formData;
    this.calculatorTotal();
  }

  private nettingSelectChange(formData: any) {
    this.nettingObj.netting = formData;
    this.calculatorTotal();
  }

  // 计算 inbound 与 outbound 的差值
  private calculatorTotal(isCheck: boolean = true): void {
    if (isCheck) {
      const baseInfoFormGroup: any = this.$refs.baseInfoFormGroup;
      const baseInfoData = baseInfoFormGroup.validateFields();
      if (!baseInfoData) {
        return;
      }
    }

    // 判断是否需要汇率日期必填
    // let isNeedRate = false
    // for (let key in this.nettingObj) {
    //   const item = this.nettingObj[key]
    //   if (key !== 'netting' && item && typeof item == 'object') {
    //     if (item.Currency != 1) {
    //       isNeedRate = true
    //     }
    //   }
    // }
    let isNeedRate =
      (this.nettingObj.inbound &&
        this.nettingObj.inbound.Inbound_Currency != 1) ||
      (this.nettingObj.outbound &&
        this.nettingObj.outbound.Outbound_Currency != 1);
    // console.log('isNeedRate', isNeedRate)

    // 将 netting data 设置费率日期选择框
    this.nettingdFormOptions.forEach((item: any) => {
      if (item.decorator === "ExchangeDate") {
        item.required = isNeedRate;
        item.disabled = !isNeedRate;
      }
    });
    // 根据时间 this.nettingObj.netting.ExchangeDate 取出费率
    // 转换inbound和outbound 每一个金额为 USD
    let rate: any = [
      {
        name: "USD",
        value: 1
      },
      {
        name: "RMB",
        value: 0.1453
      },
      {
        name: "SDR",
        value: 0.1456
      }
    ];
    // if (this.nettingObj.netting && this.nettingObj.netting.ExchangeDate) {
    //   const ramd: any =
    //     moment(this.nettingObj.netting.ExchangeDate).format("MM") / 1000;
    //   rate = [
    //     {
    //       name: "USD",
    //       value: 1
    //     },
    //     {
    //       name: "RMB",
    //       value: 0.1423 + ramd
    //     },
    //     {
    //       name: "SDR",
    //       value: 0.1426 + ramd
    //     }
    //   ];
    // }
    let Amount_USD: any = 0;
    // console.log(this.nettingObj)
    // Inbound_Amount
    // Inbound_Currency
    if (this.nettingObj.inbound) {
      let inRateIndex: any =
        this.nettingObj.inbound && this.nettingObj.inbound.Inbound_Currency
          ? this.nettingObj.inbound.Inbound_Currency - 1
          : 0;
      let outRateIndex: any =
        this.nettingObj.outbound && this.nettingObj.outbound.Outbound_Currency
          ? this.nettingObj.outbound.Outbound_Currency - 1
          : 0;
      const inBoundAmount: any = this.nettingObj.inbound
        ? +this.nettingObj.inbound.Inbound_Amount * rate[+inRateIndex].value
        : 0;
      Amount_USD =
        inBoundAmount -
        (this.nettingObj.outbound
          ? +this.nettingObj.outbound.Outbound_Amount *
            rate[+outRateIndex].value
          : 0);
    } else {
      let outRateIndex: any =
        this.nettingObj.outbound && this.nettingObj.outbound.Outbound_Currency
          ? this.nettingObj.outbound.Outbound_Currency - 1
          : 0;
      Amount_USD = this.nettingObj.outbound
        ? +this.nettingObj.outbound.Outbound_Amount * rate[+outRateIndex].value
        : 0;
    }
    // console.log(Amount_USD)
    // 当 nettingdFormOptions 的 ExchangeDate为必选并且没有值时设置为0
    setTimeout(() => {
      const nettingInfoFormGroup: any = this.$refs.nettingInfoFormGroup;
      // console.log(nettingInfoFormGroup)
      const value: any =
        this.nettingdFormOptions[1].required &&
        !this.nettingObj.netting.ExchangeDate
          ? 0
          : Amount_USD.toFixed(4);
      if (nettingInfoFormGroup) {
        nettingInfoFormGroup.setFieldsValue({
          Amount_USD: value
        });
      } else {
        this.nettingdFormOptions.forEach((item: any) => {
          if (item.decorator === "Amount_USD") {
            this.$set(item, "initialValue", value);
          }
        });
      }
    }, 0);
  }

  // model 弹出框点击 save按钮，保存
  private async save() {
    const baseInfoFormGroup = this.$refs.baseInfoFormGroup;
    const baseInfoFormGroups = baseInfoFormGroup.getFieldsValue();
    if (this.selectName === "Submit" || this.selectName === "Audit") {
      // 检验 和取值 baseInfoFormGroup
      const baseInfoFormGroup: any = this.$refs.baseInfoFormGroup;
      const baseInfoData = baseInfoFormGroup.validateFields();
      if (!baseInfoData) {
        this.$message.warning("请填写完整");
        return;
      }
      const index = this.selectkeyArr[0]; //修改第几个
      let changeStatus: any = {};
      if (this.selectName === "Submit") {
        console.log("index", baseInfoFormGroups, this.baseInfoFormOptions);
        let data = {
          statementNumber: this.baseInfoFormOptions["statementNumber"],
          approvedBy: baseInfoFormGroups.ApprovedBy,
          expectedDate: moment(baseInfoFormGroups.ExpectedDate).format(
            "YYYY-MM-DD"
          ),
          latestDate: moment(baseInfoFormGroups.LatestDate).format(
            "YYYY-MM-DD"
          ),
          remark: baseInfoFormGroups.Remark
        };
        await NettingStatementSubmit(data).then((resp: recodeConfig) => {
          if (resp.code === 1) {
            this.SearchOk("");
            this.$message.success(resp.msg);
            this.visible = false;
          }
        });
      }
      if (this.selectName === "Audit") {
        console.log(
          "sdfdsdfdsdf",
          baseInfoFormGroups,
          this.baseInfoFormOptions
        );
        let data = {
          statementNumber: this.baseInfoFormOptions["statementNumber"],
          approved: baseInfoFormGroups.Approved,
          auditReason: baseInfoFormGroups.Reason,
          auditReasonHistory: baseInfoFormGroups.ReasonHistory,
          remark: baseInfoFormGroups.Remark
        };
        await NettingStatementAuditing(data).then((resp: recodeConfig) => {
          if (resp.code === 1) {
            this.SearchOk("");
            this.$message.success(resp.msg);
            this.visible = false;
          }
        });
      }
      if (this.data[index]) {
        //如果存在index，修改data里面的数据
        this.data[index] = Object.assign(this.data[index], changeStatus);
      }
    } else if (this.selectName === "Edit") {
      const inboundInfoFormGroup: any = this.$refs.inboundInfoFormGroup;
      const inboundInfoFormGroups = inboundInfoFormGroup.getFieldsValue();
      const outboundInfoFormGroup: any = this.$refs.outboundInfoFormGroup;
      const outboundInfoFormGroups = outboundInfoFormGroup.getFieldsValue();
      const nettingInfoFormGroup: any = this.$refs.nettingInfoFormGroup;
      const nettingInfoFormGroups = nettingInfoFormGroup.getFieldsValue();
      let data = {
        serviceName: baseInfoFormGroups.Service,
        accountName: baseInfoFormGroups.Account,
        chargeType: baseInfoFormGroups.ChargeType,
        direction: baseInfoFormGroups.Direction,
        nettingCycle: baseInfoFormGroups.Cycle,
        nettingMonth: moment(baseInfoFormGroups.Month).format("YYYY-MM"),
        beginDate: moment(baseInfoFormGroups.BeginDate).format("YYYY-MM-DD"),
        endDate: moment(baseInfoFormGroups.EndDate).format("YYYY-MM-DD"),
        amountReceivable: inboundInfoFormGroups.Inbound_Amount,
        amountReceivableUsd: 1,
        inboundDuration: inboundInfoFormGroups.Inbound_Mins,
        inboundCalls: inboundInfoFormGroups.Inbound_Calls,
        inboundCurrency: inboundInfoFormGroups.Inbound_Currency,
        amountPayable: outboundInfoFormGroups.Outbound_Amount,
        outboundDuration: outboundInfoFormGroups.Outbound_Mins,
        amountPayableUsd: 1,
        outboundCalls: outboundInfoFormGroups.Outbound_Calls,
        outboundCurrency: outboundInfoFormGroups.Outbound_Currency,
        exchangeDate: moment(nettingInfoFormGroups.ExchangeDate).format(
          "YYYY-MM"
        ),
        nettingAmountUsd: nettingInfoFormGroups.Amount_USD,
        id: this.editBaseInfoFormOptions["id"],
        statementNumber: this.editBaseInfoFormOptions["statementNumber"]
      };
      await NettingStatementEdit(data).then((resp: recodeConfig) => {
        if (resp.code === 1) {
          this.SearchOk("");
          this.$message.success(resp.msg);
          this.visible = false;
        }
      });
    }
  }
  public async mounted() {
    let AccountOptions = await getAccountOptions();
    let ServiceOptions = await getServiceOptions();
    let CurrencyOptions = await getCurrencyOptions();
    let CyclesOptions = await getCyclesOptions()
    // 
    this.columns[0]["options"] = ServiceOptions;
    this.formOptions[0]["options"] = ServiceOptions;
    this.columns[1]["options"] = AccountOptions;
    // 
    this.formOptions[1]["options"] = AccountOptions;
    this.inboundFormOptions[1].options = CurrencyOptions;
    this.outboundFormOptions[1].options = CurrencyOptions;
    // 
    this.formOptions[4]["options"] = CyclesOptions;
    this.CyclesOptions = CyclesOptions
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

.subheading td {
  font-weight: 600;
  color: #000;
}
</style><style lang="scss" scoped>
@import "@/views/Finance/common/css/Statement.scss";
@import "@/views/Finance/common/css/modal.scss";
</style>
