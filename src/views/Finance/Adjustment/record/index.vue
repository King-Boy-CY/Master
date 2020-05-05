<template>
  <div class="record statement">
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
    ></Advanced-search>
    <Table
      :isFinance="true"
      :isNeedCheck="true"
      :lessSpace="true"
      :selectedBtn="selectedBtn"
      @onSelectClick="onSelectClick"
      :scrollX="2300"
      ref="table"
      @onSelect="onSelect"
      @onSelectAll="onSelectAll"
      :columns="columns"
      :data="data"
      :rowClassName="rowClassName"
      zebraStripe
    />
    <a-modal
      centered
      class="edit-modal"
      width="950px"
      v-model="visible"
      v-if="visible"
      :footer="null"
      title="Logging Data"
      onOk="handleOk"
    >
      <template slot="footer">
        <a-button key="submit" type="primary" @click="save">Save</a-button>
        <a-button key="back" @click="handleReturn">Return</a-button>
      </template>
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
            resize="none"
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
import { Component } from "vue-property-decorator";
import { columns, data, statusOptions, lockedDateOptions } from "./Test";
import {
  getDetailAccounts,
  getDetailService,
  AdjustmentCndnSearch
} from "@/api/index";
import {
  AdjustmentTypeOptions,
  ChargeableUnitTypeOptions,
  DirectionOptions,
  ChargeTypeOptions,
  adjustmentStatusOptions
} from "@/views/Finance/common/data/index";
import moment from "moment";
import { deepClone } from "@/assets/ts/index.ts";
import financeMixin from "@/views/Finance/common/js/mixin";
import xlsx from "xlsx";
import { ServicesOptions } from "../../Statement/monthly/Test";
import {
  getAccountOptions,
  getServiceOptions,
  getRecordData,
  AuditRecordData,
  SubmitRecordData,
  getCyclesOptions
} from "@/views/Finance/common/js/exchangeData.ts";
import { AdjustmentRecordExport } from "@/api/index.ts";
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
export default class AdjustmentRecord extends Vue {
  public columns: any[] = columns;
  public data: any[] = [];
  public CyclesOptions: any[] = [];
  private selectkeyArr: any = [];
  private selectedData: any = [];
  private AdjustmentTypeOptions: any = AdjustmentTypeOptions();
  private ChargeableUnitTypeOptions: any = ChargeableUnitTypeOptions();
  private DirectionOptions: any = DirectionOptions();
  private ChargeTypeOptions: any = ChargeTypeOptions();
  private adjustmentStatusOptions: any = adjustmentStatusOptions();

  private tableData: any = data;
  private searchData: any;
  // table选择框 选择后的按钮

  private selectedBtn: any = [
    {
      name: "Submit",
      icon: "plus-circle",
      index: 0,
      disabled: true,
      tips: `Selected records can NOT be reviewed  or submitted for approval`
    },
    {
      name: "Audit",
      icon: "file-search",
      index: 1,
      disabled: true,
      tips: `Selected records can NOT be reviewed  or submitted for approval`
    },
    {
      name: "Export",
      icon: "export",
      index: 2,
      disabled: true,
      tips: `Selected records can NOT be reviewed  or submitted for approval`
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
  private formOptions: any[] = [
    {
      Tips: "Service",
      name: "Service",
      type: "select",
      options: null
    },
    {
      Tips: "Account",
      name: "Account",
      type: "select",
      options: null
    },
    {
      Tips: "Charge type",
      name: "ChargeType",
      type: "select",
      options: this.ChargeTypeOptions
    },
    {
      Tips: "Direction",
      name: "Direction",
      type: "select",
      options: this.DirectionOptions
    },
    {
      Tips: "Adjustment type",
      name: "AdjustmentType",
      type: "select",
      options: this.AdjustmentTypeOptions
    },
    {
      Tips: "Status",
      name: "Status",
      type: "select",
      options: this.adjustmentStatusOptions
    },
    {
      Tips: "Cycle",
      name: "Cycle",
      type: "select",
      options: null
    },
    {
      Tips: "Month",
      name: "Month",
      type: "picker-month"
    },
    {
      Tips: "Begin date",
      name: "BeginDate",
      disabled: false,
      required: false,
      type: "picker"
    },
    {
      Tips: "End date",
      name: "EndDate",
      disabled: false,
      required: false,
      type: "picker"
    }
  ];
  private baseInfoFormOptions: any[] = [
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
      Tips: "Status",
      decorator: "Status",
      required: true,
      options: this.adjustmentStatusOptions
    },
    {
      Tips: "Cycle",
      decorator: "Cycle",
      required: true,
      type: "select",
      disabled: true,
      options: null
    },
    {
      Tips: "Month",
      decorator: "Month",
      required: true,
      disabled: true,
      type: "picker-month"
    },
    {
      Tips: "Begin date",
      decorator: "BeginDate",
      required: false,
      type: "picker"
    },
    {
      Tips: "End date",
      decorator: "EndDate",
      required: false,
      type: "picker"
    },
    {
      Tips: "Adjustment type",
      decorator: "AdjustmentType",
      required: true,
      type: "select",
      options: this.AdjustmentTypeOptions
    },
    {
      Tips: "Amount",
      decorator: "Amount",
      required: true,
      type: "input"
    },
    {
      Tips: "Currency",
      decorator: "Currency",
      required: true,
      type: "select",
      options: null
    },
    {
      Tips: "Exchange date",
      decorator: "ExchangeDate",
      required: true,
      type: "picker-month"
    },
    {
      Tips: "Charge Traffic Volume",
      decorator: "ChargeTrafficVolume",
      required: false,
      type: "input"
    },
    {
      Tips: "Chargeable Unit Type",
      decorator: "ChargeableUnitType",
      required: false,
      type: "select",
      options: this.ChargeableUnitTypeOptions,
      initialValue: 2
    },
    {
      Tips: "Operator files",
      decorator: "OperatorFiles",
      required: false,
      type: "upload"
    },
    {
      Tips: "Reason",
      decorator: "Reason",
      type: "textarea"
    }
  ];
  private SubmitFinanceFormOptions: any[] = [
    {
      Tips: "Approved by",
      decorator: "ApprovedBy",
      required: true,
      type: "select",
      options: [
        {
          name: "Vivian",
          value: 1
        },
        {
          name: "Lily",
          value: 2
        },
        {
          name: "Jack",
          value: 3
        },
        {
          name: "……",
          value: 4
        }
      ],
      initialValue: 1,
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
      Tips: "Expected date",
      decorator: "ExpectedDate",
      required: false,
      initialValue: moment()
        .add(3, "day")
        .format("YYYY-MM-DD"),
      type: "picker",
      span: 12,
      labelSpan: 8,
      wrapperSpan: 16
    },
    {
      Tips: "Latest date",
      decorator: "LatestDate",
      required: false,
      initialValue: moment()
        .add(7, "day")
        .format("YYYY-MM-DD"),
      type: "picker",
      span: 12,
      labelSpan: 8,
      wrapperSpan: 16
    },
    {
      Tips: "Remark",
      decorator: "Remark",
      required: false,
      type: "textarea",
      span: 24,
      labelSpan: 4,
      wrapperSpan: 20
    }
  ];
  private AuditFinanceFormOptions: any[] = [
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
      span: 16,
      labelSpan: 6,
      wrapperSpan: 6
    },
    {
      Tips: "Reason",
      decorator: "Reason",
      required: false,
      type: "textarea",
      span: 24,
      labelSpan: 4,
      wrapperSpan: 20
    },
    {
      Tips: " ",
      decorator: "ReasonHistory",
      required: false,
      disabled: true,
      type: "textarea",
      span: 24,
      labelSpan: 4,
      wrapperSpan: 20
    },
    {
      Tips: "Remark",
      decorator: "Remark",
      required: false,
      type: "textarea",
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
  private selectName: any = "";
  private direction: any = ""; // 方向
  private currency: any = ""; // 币种

  // 高级搜索 Search -> 回调
  public async SearchOk(formData: any) {
    console.log(formData);
    this.searchData = formData;
    this.selectChange(formData, name);
    if (
      formData["BeginDate"] &&
      formData["EndDate"] &&
      moment(formData["BeginDate"]).valueOf() >
        moment(formData["EndDate"]).valueOf()
    ) {
      this.$message.warning("Start time can NOT be greater than the End time");
      return;
    }
    let reqData: any = {
      params: Object.assign(
        {},
        {
          serviceName: formData.Service,
          accountName: formData.Account,
          adjustmentType: formData.AdjustmentType,
          chargeType: formData.ChargeType,
          cycleName: formData.Cycle,
          dataSource: formData.DataSource,
          direction: formData.Direction,
          beginDate: formData.BeginDate,
          endDate: formData.EndDate,
          month: formData.Month
            ? moment(formData.Month).format("YYYY-MM")
            : formData.Month,
          adjustmentStatus: formData.Status
        }
      )
    };

    console.log(reqData);
    let resData = await getRecordData(reqData);
    if (resData.code <= 0) {
      this.$message.warning(resData.msg);
      this.data = [];
    } else {
      if (resData.data) {
        resData.data.forEach(element => {
          element.key = element.id;
          element.submittingTime = element.submittingTime
            ? moment(element.submittingTime).format("YYYY-MM-DD HH:mm:ss")
            : undefined;
          element.auditingTime = element.auditingTime
            ? moment(element.auditingTime).format("YYYY-MM-DD HH:mm:ss")
            : undefined;
        });
        this.data = resData.data;
      }
    }
    console.log(resData);
  }

  // 高级搜索的select选择后执行
  public selectChange(formData: any, name:string) {
    const AdvancedSearch: any = this.$refs.AdvancedSearch;
    if (name === "Operator" || name === "Service" || name === "Direction") {
      let data = {
        accountName: formData["Account"],
        serviceName: formData["Service"],
        direction: formData["Direction"]
      };
      getCyclesOptions({ params: data }).then((res: any) => {
        console.log(res);
        this.formOptions[6].options = res;
        this.CyclesOptions = res;
        console.log(this);
      });
    }
    this.commomBaseInfoSelectChange(
        formData,
        this.formOptions,
        this.$refs.AdvancedSearch,
        name
      );
  }

  public monthPickerChange(formData: any, name:string) {
    this.commomBaseInfoSelectChange(
        formData,
        this.formOptions,
        this.$refs.AdvancedSearch,
        name
      );
  }
  // form的select选择后执行
  private baseInfoSelectChange(formData: any,name:string): void {
    this.baseInfoFormOptions.forEach((item: any) => {
      if (item.decorator === "ExchangeDate") {
        item.disabled = formData["Currency"] == 1;
        item.required = !item.disabled;
        formData["ExchangeDate"] = undefined;
      }
      if (item.decorator === "Reason") {
        item.required = !(formData["Approved"] == 1);
        item.disabled = formData.Approved == 1;
      }
      if (item.decorator === "ReasonHistory") {
        item.disabled = true;
      }
    });
  }

  private baseInfoPickerChange(formData: any, newData: any = {}): void {}

  // 勾选表格数据后，表格上方按钮可否点击和修改数据
  private changeDisable(selectedRows: any) {
    console.log("selectedRows", selectedRows);
    this.selectedBtn.forEach((item: any, index: number) => {
      if (selectedRows.length === 1) {
        /*1:Draft, 2:Processing, 3:Refused, 4:Approved */
        if (
          (selectedRows[0].adjustmentStatus == "Draft" ||
            selectedRows[0].adjustmentStatus == "Refused" ||
            selectedRows[0].adjustmentStatus == 1 ||
            selectedRows[0].adjustmentStatus == 3) &&
          item.name === "Submit"
        ) {
          item.disabled = false;
        } else if (
          item.name === "Audit" &&
          (selectedRows[0].adjustmentStatus === "Processing" ||
            selectedRows[0].adjustmentStatus === 2)
        ) {
          item.disabled = false;
        } else if (item.name === "Export") {
          item.disabled = false;
        } else {
          item.disabled = true;
        }
      } else if (selectedRows.length > 1) {
        if (item.name === "Submit" || item.name === "Audit") {
          item.disabled = true;
        }
      }
    });
  }

  /* 用户手动选择/取消选择所有列的回调  Table -> 回调 */
  public onSelectAll(selected: any, selectedRows: any, changeRows: any) {
    console.log(selected, selectedRows, changeRows);
    this.changeDisable(selectedRows);
    this.selectedData = selectedRows;
  }

  /* 用户手动选择/取消选择某列的回调
         @param record: 选中数据
         @param selected: 是否选中 true/false
         @param selectedRows: 所有选中 Array
      */
  public onSelect(record: object, selected: boolean, selectedRows: any) {
    console.log(record, selected, selectedRows);
    if (!selectedRows.length) {
      this.selectedBtn[2].disabled = true;
    }
    this.selectedData = selectedRows;
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
  /**** submit audit export等按钮操作 ****/
  // 1:Draft, 2:Processing, 3:Refused, 4:Approved
  private onSelectClick(activeObJ: any, selected: any, selectedData: any) {
    console.log(activeObJ, selected, selectedData);
    this.selectName = activeObJ.name;
    this.selectkeyArr = selected;
    if (activeObJ.name === "Export") {
      this.toExport(selectedData);
    } else if (activeObJ.name === "Submit") {
      console.log(this.SubmitFinanceFormOptions);

      this.baseInfoFormOptions = deepClone(this.SubmitFinanceFormOptions);
      // this.baseInfoFormOptions.forEach((item: any) => {
      //   item.disabled = item.decorator === 'BeginDate' || item.decorator === 'EndDate'
      //   item.initialValue = undefined
      // })type: 'picker',
      this.visible = true;
    } else if (activeObJ.name === "Audit") {
      this.baseInfoFormOptions = deepClone(this.AuditFinanceFormOptions);
      this.visible = true;
      // 给默认reason加disabled状态
      this.baseInfoFormOptions[1].disabled = true;
      this.baseInfoFormOptions[2].disabled = true;
      console.log(this.selectedData);

      if (this.selectedData[0].auditReasonHistory) {
        setTimeout(() => {
          console.log(this.$refs.baseInfoFormGroup);
          const baseInfo: any = this.$refs.baseInfoFormGroup;
          baseInfo.setFieldsValue({
            ReasonHistory: selectedData[0].auditReasonHistory
          });
        }, 500);
      } else {
        // this.baseInfoFormOptions.splice(2,1)
        this.baseInfoFormOptions.splice(2, 1);
      }
    }
  }

  private async toExport(selectedData) {
    const filterData = selectedData.map((item: any) => {
      let newItem = JSON.parse(JSON.stringify(item));
      delete newItem.key;
      delete newItem.id
      for (let key in newItem) {
        let find: any;
        switch (key) {
          case "adjustmentStatus":
            find = this.adjustmentStatusOptions.find(
              (inner: any) => inner.value === item[key]
            );
            break;
          case "adjustmentType":
            find = this.AdjustmentTypeOptions.find(
              (inner: any) => inner.value === item[key]
            );
            break;
          case "chargeType":
            find = this.ChargeTypeOptions.find(
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
    console.log("filterData", filterData);
    let data: any = [];
    filterData.forEach((item: any) => {
      data.push(item);
    });
    await AdjustmentRecordExport(data).then((resp: any) => {
      let blob = new Blob([resp], { type: "application/xlsx" });
      let url = window.URL.createObjectURL(blob);
      this.openDownload(url, "AdjustmentRecord.xlsx");
    });
  }

  // modal save 按钮
  private async save() {
    if (this.selectName === "Submit" || this.selectName === "Audit") {
      // 检验 和取值 baseInfoFormGroup
      const baseInfoFormGroup: any = this.$refs.baseInfoFormGroup;
      const baseInfoData = baseInfoFormGroup.validateFields();
      if (!baseInfoData) {
        
        return;
      }
      const index = this.selectkeyArr[0];
      let infoStatus: any = {};
      if (this.selectName === "Submit") {
        infoStatus.remark = baseInfoData.Remark ? baseInfoData.Remark : "";
        infoStatus.expectedDate = baseInfoData.ExpectedDate
          ? moment(baseInfoData.ExpectedDate).format("YYYY-MM-DD")
          : undefined;
        infoStatus.latestDate = baseInfoData.LatestDate
          ? moment(baseInfoData.LatestDate).format("YYYY-MM-DD")
          : undefined;
        infoStatus.approvedBy = this.SubmitFinanceFormOptions[0].options[
          baseInfoData.ApprovedBy - 1
        ].name;
        infoStatus.statementNumber = this.selectedData[0].statementNumber
          ? this.selectedData[0].statementNumber
          : "";
        let reqData = await SubmitRecordData(infoStatus);
        if (reqData.code >= 1) {
          this.$message.success(reqData.msg);
          this.visible = false;
        } else {
          this.$message.warning(reqData.msg);
        }
      } else {
        (infoStatus.approved = baseInfoData.Approved),
          (infoStatus.auditReasonHistory = this.selectedData[0]
            .auditReasonHistory
            ? this.selectedData[0].auditReasonHistory
            : "");
        infoStatus.auditReason = baseInfoData.Reason ? baseInfoData.Reason : "";
        infoStatus.remark = baseInfoData.Remark ? baseInfoData.Remark : "";
        infoStatus.statementNumber = this.selectedData[0].statementNumber
          ? this.selectedData[0].statementNumber
          : "";
        let reqData = await AuditRecordData(infoStatus);
        console.log(reqData);
        if (reqData.code >= 1) {
          this.$message.success(reqData.msg);
          this.visible = false;
        } else {
          this.$message.warning(reqData.msg);
        }
      }
    }
    const AdvancedSearch = this.$refs.AdvancedSearch as any;
    const AdvancedSearchs = AdvancedSearch.getFieldsValue();
    this.SearchOk(AdvancedSearchs);
  }

  /* 退出 */
  private handleReturn() {
    this.visible = !this.visible;
  }
  public async created() {
    let AccountOptions = await getAccountOptions();
    let ServiceOptions = await getServiceOptions();
    let CyclesOptions = await getCyclesOptions();
    // 
    this.columns[0]["options"] = ServiceOptions;
    this.formOptions[0]["options"] = ServiceOptions;
    // 
    this.columns[1]["options"] = AccountOptions;
    this.formOptions[1]["options"] = AccountOptions;
    // 
    this.CyclesOptions = CyclesOptions;
    this.formOptions[6]["options"] = CyclesOptions;
  }
}
</script>
<style lang="scss">
@import "@/views/Finance/common/css/deep-modal.scss";

.record.ant-table-tbody tr.left td:not(:first-child) {
  text-align: left;
}
</style>
<style lang="scss" scoped>
@import "@/views/Finance/common/css/Statement.scss";
@import "@/views/Finance/common/css/modal.scss";
</style>
