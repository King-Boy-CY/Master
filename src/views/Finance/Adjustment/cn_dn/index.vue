<template>
  <div class="cndn statement">
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
      parentKey="id"
      :isFinance="true"
      :isNeedCheck="true"
      :selectedBtn="selectedBtn"
      @onSelectClick="onSelectClick"
      @onSoltClick="onSoltClick"
      :scrollX="2500"
      ref="table"
      :lessSpace="true"
      @onSelect="onSelect"
      @onSelectAll="onSelectAll"
      :columns="columns"
      :data="data"
      :class="['reduce-margin']"
      :rowClassName="rowClassName"
      :isShowDownloadColor="isShowDownloadColor"
      zebraStripe
    />
    <a-modal
      centered
      class="edit-modal"
      width="950px"
      :footer="null"
      v-model="visible"
      v-if="visible"
      title="Logging Data"
      @cancel="handleReturn"
    >
      <div class="body">
        <div class="modal-box">
          <div class="modal-box-title"></div>
          <form-group
            v-if="selectName != 'modalTableVisible'"
            :formoptions="baseInfoFormOptions"
            @selectChange="baseInfoSelectChange"
            @uploadChange="uploadFileChange"
            @monthPickerChange="baseInfoPickerChange"
            :span="12"
            ref="baseInfoFormGroup"
            class="form-group"
            @inputChange="inputChangeHandle"
          ></form-group>
            <!-- <iframe v-else width="100%" height="500px" src="../../../../../../../file/warning.pdf" frameborder="0"></iframe> -->
          <Table
            v-else
            :isFinance="true"
            ref="ExportTable"
            :useDefined="false"
            :columns="PreviewColumns"
            :data="PreviewData"
            :rowClassName="rowClassName"
            :customCell="customCell"
            :isTableHeight="true"
            :showHeader="false"
            :isPagination="false"
            :singlePageTableClass="['remove-all-border']"
            :scrollX="'120%'"
            zebraStripe
          />
        </div>
      </div>
      <div style="padding-top: 20px;text-align: center">
        <a-button
          type="primary"
          style="border-radius: 50px;min-width: 90px"
          @click="save"
          v-if="selectName != 'modalTableVisible'"
          v-show="SaveBtn"
        >Save</a-button>
        <!-- <a-button
          type="primary"
          style="border-radius: 50px;min-width: 90px"
          v-if="selectName == 'modalTableVisible'"
          @click="ExportOp"
        >toExport</a-button> -->
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
import {
  downloadExcel,
  downloadLocalFiles
} from "@/views/Finance/components/DownloadFile/saveFile";
import { saveAs } from "file-saver";
import {
  exportExcelTransferFormat,
  calcTableTd
} from "@/views/Finance/components/DownloadFile/xlsx";
import {
  columns,
  data,
  lockedDateOptions,
  PreviewColumns,
  SystemData,
  OperatorData,
  SystemDataDownloadExcelRules,
  OperatorDataDownloadExcelRules
} from "./Test";
import {
  getAccountOptions,
  getServiceOptions,
  getCndnData,
  UploadCndnFile,
  getCurrencyOptions,
  getCyclesOptions,
  getDestinationsOptions
} from "@/views/Finance/common/js/exchangeData.ts";
import {
  DataSourceOptions,
  ChargeableUnitTypeOptions,
  ChargeTypeOptions,
  DirectionOptions,
  AdjustmentTypeCndnOptions,
  adjustmentStatusOptions
} from "@/views/Finance/common/data/index.ts";
import moment from "moment";
import financeMixin from "@/views/Finance/common/js/mixin.ts";
import {
  AdjustmentCndnSearch,
  AdjustmentCndnAdd,
  AdjustmentCndnEdit,
  AdjustmentRecordDownloadSystem,
  AdjustmentCndnExport
} from "@/api/index.ts";
import { AxiosGet, AxiosDelete, AxiosPost } from "@/api/axios";
import {
  nagativePointNumberReg,
  numberPointReg,
  numberReg,
  nagativeNoLimitPointNumberReg
} from "@/common/RegExp/number";
import xlsx from "xlsx";
import { refsConfig, recodeConfig } from "@/assets/ts/config.d";
import { columnsHubbing } from "../../Statement/monthly/Test";
@Component({
  components: {
    AdvancedSearch: () =>
      import("@/views/Finance/components/Advancedsearch/index.vue"),
    Table: () => import("@/views/Finance/components/Table/index.vue"),
    // pagination: () => import("@/common/pagination/index.vue"),
    formGroup: () => import("@/views/Finance/components/form-group/index.vue"),
    // TableInput: () => import("@/views/Finance/components/table-input/index.vue")
  },
  mixins: [financeMixin]
})
export default class DataEntery extends Vue {
  public columns: any[] = columns;
  public CyclesOptions: any = null;
  public data: any[] = [];
  public copyData: any[] = data;
  public formDataObj: any = undefined;
  private selectkeyArr: any = [];
  private searchData: any;
  // table选择框 选择后的按钮
  private SaveBtn: boolean = true;
  private values = {};

  /* 弹出模态框的头部PreviewColumns和数据PreviewData*/
  public PreviewColumns: any[] = PreviewColumns;
  public PreviewData: any[] = [];
  // 选择的按钮
  private DirectionOptions: any[] = DirectionOptions();
  private DataSourceOptions: any[] = DataSourceOptions();
  private ChargeTypeOptions: any[] = ChargeTypeOptions();
  private ChargeableUnitTypeOptions: any[] = ChargeableUnitTypeOptions();
  private adjustmentStatusOptions: any[] = adjustmentStatusOptions();
  private AdjustmentTypeOptions: any[] = AdjustmentTypeCndnOptions();
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
      disabled: true,
      tips: undefined
    },
    {
      name: "Delete",
      icon: "delete",
      style: {
        color: "#f5b148",
        borderColor: "#f5b148"
      },
      index: 2,
      disabled: true,
      tips: undefined
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
      disabled: true,
      tips: undefined
    }
  ];

  /* 弹出框显示/隐藏 */
  public visible: boolean = false;
  //声明使用$refs
  public $refs: refsConfig | any;
  public isShowDownloadColor: Boolean = true; //表格数据行中点击下载数据颜色是否显示
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
      Tips: "Cycle",
      name: "Cycle",
      type: "select",
      options: null,
      disabled: false
    },
    {
      Tips: "Month",
      name: "Month",
      type: "picker-month",
      disabled: false
    },
    {
      Tips: "Begin date",
      name: "BeginDate",
      type: "picker",
      disabled: false
    },
    {
      Tips: "End date",
      name: "EndDate",
      type: "picker",
      disabled: false
    },
    {
      Tips: "Data Source",
      name: "DataSource",
      type: "select",
      options: this.DataSourceOptions
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
      required: false,
      type: "select",
      options: this.ChargeTypeOptions
    },
    {
      Tips: "Direction",
      decorator: "Direction",
      required: false,
      type: "select",
      options: this.DirectionOptions
    },
    {
      Tips: "Cycle",
      decorator: "Cycle",
      activeAddDate: true,
      required: false,
      type: "select",
      options: null
    },
    {
      Tips: "Month",
      decorator: "Month",
      activeAddDate: true,
      required: false,
      type: "picker-month"
    },
    {
      Tips: "Begin date",
      decorator: "BeginDate",
      required: false,
      disabled: false,
      type: "picker",
      disabledDate: (current: object, str: string) =>
        this.disabledBeginDate(current, "EndDate")
    },
    {
      Tips: "End date",
      decorator: "EndDate",
      required: false,
      disabled: false,
      type: "picker",
      disabledDate: (current: object, str: string) =>
        this.disabledBeginDate(current, "BeginDate")
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
      type: "input",
      rules: [
        {
          validator: (rule: any, value: any, callback: any) => {
            if (!value) {
              callback();
            }
            const pattern: RegExp = new RegExp(
              nagativeNoLimitPointNumberReg,
              "g"
            );
            if (!pattern.test(value)) {
              callback(`Only  number is allowed for Amount`);
            } else {
              callback();
            }
          }
        }
      ]
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
      placeholderName: "Default",
      required: false,
      type: "picker-month"
    },
    {
      Tips: "Charge Traffic Volume",
      decorator: "ChargeTrafficVolume",
      required: false,
      type: "input",
      rules: [
        {
          validator: (rule: any, value: any, callback: any) => {
            if (!value) {
              callback();
            }
            const pattern: RegExp = new RegExp(numberReg, "g");
            if (!pattern.test(value)) {
              callback(`Only  number is allowed for Charge traffic`);
            } else {
              callback();
            }
          }
        }
      ]
    },
    {
      Tips: "Chargeable Unit Type",
      decorator: "ChargeableUnitType",
      required: false,
      type: "select",
      options: this.ChargeableUnitTypeOptions
    },

    {
      Tips: "Data Source",
      decorator: "DataSource",
      required: true,
      type: "select",
      options: this.DataSourceOptions
    },
    {
      Tips: "Operator files",
      decorator: "OperatorFiles",
      required: false,
      disabled: false,
      type: "upload"
    },
    {
      Tips: "Reason",
      decorator: "AdjustmentReason",
      required: true,
      type: "textarea",
      span: 24,
      labelSpan: 4,
      wrapperSpan: 19,
      isAlign: true,
      config: {
        maxLength: 180
      }
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
  private toExportRowKey: number = 0;

  // 开始时间和结束时间的区间判断
  // 返回false不禁用，true是禁用
  public disabledBeginDate(current: object, str?: string) {
    let formData = this.$refs.baseInfoFormGroup.getFieldsValue();
    if (formData.Cycle) {
      let find: any = this.CyclesOptions.find(
        (item: any) => item.name === formData.Cycle
      );
      if (str === "EndDate") {
        return (
          find &&
          (moment(current).valueOf() <= moment(find.BeginDate).valueOf() ||
            moment(current).valueOf() >= moment(find.EndDate).valueOf() ||
            moment(current).valueOf() >= moment(formData.EndDate).valueOf())
        );
      } else if (str === "BeginDate") {
        return (
          find &&
          (moment(current).valueOf() <= moment(find.BeginDate).valueOf() ||
            moment(current).valueOf() >= moment(find.EndDate).valueOf() ||
            moment(current).valueOf() <= moment(formData.BeginDate).valueOf())
        );
      }
    } else if (formData.Month) {
      let find: any = {
        BeginDate: moment(formData["Month"]).startOf("month"),
        EndDate: moment(formData["Month"]).endOf("month")
      };
      if (str === "EndDate") {
        return (
          find &&
          (moment(current).valueOf() < moment(find.BeginDate).valueOf() ||
            moment(current).valueOf() > moment(find.EndDate).valueOf() ||
            moment(current).valueOf() > moment(formData.EndDate).valueOf())
        );
      } else if (str === "BeginDate") {
        return (
          find &&
          (moment(current).valueOf() < moment(find.BeginDate).valueOf() ||
            moment(current).valueOf() > moment(find.EndDate).valueOf() ||
            moment(current).valueOf() < moment(formData.BeginDate).valueOf())
        );
      }
    }
    return false;
    // return find&&(moment(current).valueOf()<moment(find.BeginDate).valueOf() || moment(current).valueOf()>moment(find.EndDate).valueOf())
  }
  // 高级搜索 Search -> 回调
  public async SearchOk(values: any) {
    // const jsonData = {
    //   sheetName: "aaaaaaaaaa",
    //   head:{
    //     columns1:'columns1',
    //     columns2:'columns2',
    //     columns3:'columns3',
    //     columns4:'columns4'
    //   },
    //   data:[
    //         {
    //       columns1:'1',
    //       columns2:'1',
    //       columns3:'1',
    //       columns4:'1'
    //     },
    //     {
    //       columns1:'2',
    //       columns2:'2',
    //       columns3:'2',
    //       columns4:'2'
    //     },
    //     {
    //       columns1:'3',
    //       columns2:'3',
    //       columns3:'3',
    //       columns4:'3'
    //     }
    //   ],
    //   styles: [{
    //       grid: [
    //           [1, 1],
    //           [1, 2],
    //           [1, 3],
    //           [1, 4],
    // [2, 1],
    //           [2, 2],
    //           [2, 3],
    //           [2, 4]
    //       ],
    //       style: {
    //         width:'150px',
    //         background:'#FF0000',
    //         border: "1px solid #000000"
    //       }
    //   }],
    //   merges: []
    // };

    // downloadExcel(jsonData, jsonData.sheetName);

    let data: any = {
      serviceName: values.Service,
      accountName: values.Account,
      adjustmentType: values.AdjustmentType,
      beginDate: values.BeginDate,
      chargeType: values.ChargeType,
      cycle: values.Cycle,
      dataSource: values.DataSource,
      direction: values.Direction,
      endDate: values.EndDate,
      month: values.Month
    };
    // 查询
    let resData = await getCndnData(data);
    if (resData.code <= 0) {
      this.$message.warning(resData.msg);
      this.data = [];
    } else {
      this.data = resData.data;
    }
    values;
  }
  // 高级搜索条件选择后则执行
  public async selectChange(values: any, name: string) {
    // this.data = []
    const AdvancedSearch: any = this.$refs.AdvancedSearch;
    this.formOptions.forEach((item: any) => {
      if (item.name === "Month" || item.name === "Cycle") {
        item.disabled =
          item.name === "Month"
            ? values["ChargeType"] != 1
            : values["ChargeType"] == 1;
      }
      if (name === "Account" || name === "Service" || name === "Direction") {
        let data = {
          accountName: values["Account"],
          serviceName: values["Service"],
          direction: values["Direction"]
        };
        getCyclesOptions({ params: data }).then((res: any) => {
          this.formOptions[5].options = res;
          this.CyclesOptions = res;
        });
      }
    });
    let changeData: any = {};
    if (values["ChargeType"] == 1) {
      // vc  Charge type 为 Hubbing 时cycle不能选择 为 VC 时 month不能选择。
      this.monthPickerChange(values, changeData);
    } else {
      let find: any;
      if (values["Cycle"]) {
        find = this.CyclesOptions.find(
          (item: any) => item.name == values["Cycle"]
        );
        this.$refs.AdvancedSearch.setFieldsValue({
          BeginDate: find.BeginDate
            ? moment(find.BeginDate)
            : moment(find.BeginDate),
          EndDate: find.EndDate ? moment(find.EndDate) : moment(find.EndDate)
        });
      }
    }
  }
  // 高级搜索日期选择
  public monthPickerChange(values: any, newData: any = {}) {
    const AdvancedSearch: any = this.$refs.AdvancedSearch;
    AdvancedSearch.setFieldsValue(
      Object.assign({}, newData, {
        BeginDate: values["Month"]
          ? moment(values["Month"]).startOf("month")
          : undefined,
        EndDate: values["Month"]
          ? moment(values["Month"]).endOf("month")
          : undefined,
        Cycle: undefined
      })
    );
  }
  // modal模态框弹出后，选择执行
  private baseInfoSelectChange(values: any, currentName: string): void {
    this.commomBaseInfoSelectChange(
      values,
      this.baseInfoFormOptions,
      this.$refs.baseInfoFormGroup,
      currentName
    );
    this.baseInfoFormOptions.forEach((item: any) => {
      let baseInfoFormGroup = this.$refs.baseInfoFormGroup;
      if (item.decorator === "ExchangeDate") {
        item.disabled = values["Currency"] == "USD";
        baseInfoFormGroup.setFieldsValue({
          ExchangeDate:
            values.Currency == "USD" ? undefined : values.ExchangeDate
        });
      }
      if (item.decorator === "ChargeableUnitType") {
        this.$set(item, "required", !!values.ChargeTrafficVolume);
      }

      if (item.decorator == "OperatorFiles") {
        item.disabled = values.DataSource == 1;
        baseInfoFormGroup.setFieldsValue({
          OperatorFiles: values.DataSource == 1 ? "" : values.OperatorFiles
        });
        item.required = !item.disabled;
      }
    });
    if (
      currentName === "Account" ||
      currentName === "Service" ||
      currentName === "Direction"
    ) {
      let data = {
        accountName: values["Account"],
        serviceName: values["Service"],
        direction: values["Direction"]
      };
      getCyclesOptions({ params: data }).then((res: any) => {
        this.baseInfoFormOptions[4].options = res;
      });
    }
  }

  /*模态框输入值的回调函数 */
  private inputChangeHandle(formData: any): void {
    this.baseInfoFormOptions.forEach((item: any) => {
      if (item.decorator === "ChargeableUnitType") {
        // item.required = !!formData.ChargeTrafficVolume;
        this.$set(item, "required", !!formData.ChargeTrafficVolume);
      }
    });
  }

  /*模态框日期选择的回调函数 */
  private baseInfoPickerChange(formData: any, currentName: string): void {
    // currentName 当前操作日期的选择框名字
    this.commomBaseInfoSelectChange(
      formData,
      this.baseInfoFormOptions,
      this.$refs.baseInfoFormGroup,
      currentName
    );
  }

  // 修改表格上方按钮可否点击
  private changeDisable(selectedRows: any) {
    this.selectedBtn.forEach((item: any, index: number) => {
      if (!selectedRows.length) {
        if (item.name !== "Add") {
          item.disabled = true;
          item.tips = `You haven't selected data to ${item.name} yet.`;
        }
      } else if (selectedRows.length === 1) {
        // Edit 按钮  1 draft和 4 refused状态的数据点击  状态(Status)
        if (
          (item.name === "Edit" || item.name === "Delete") &&
          (selectedRows[0].adjustmentStatus === 2 ||
            selectedRows[0].adjustmentStatus === 4)
        ) {
          item.disabled = true;
          item.tips = `Only  records with Status as "Draft" /"Refused" can be ${item.name}.`;
        } else {
          item.disabled = false;
        }
      } else if (selectedRows.length > 1) {
        if (item.name === "Edit") {
          item.disabled = true;
          item.tips = `Only one item can be ${item.name}.`;
        } else if (
          item.name === "Add" ||
          item.name === "Export" ||
          item.name === "Delete" ||
          item.name === "Download"
        ) {
          item.disabled = false;
        }
        selectedRows.forEach((it: any) => {
          if (
            item.name === "Delete" &&
            (it.adjustmentStatus === 2 || it.adjustmentStatus === 4)
          ) {
            item.disabled = true;
          }
        });
      } else {
        if (item.name !== "Add") {
          item.disabled = true;
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
    // console.log(pageSize)`
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
    let str: string = "";
    if (record.te) {
      str += " left";
    } else if (record.FontSizeEleven) {
      str += " font-size-eleven";
    } else if (record.FontSizeEighteen) {
      str += " font-size-eighteen";
    } else if (record.ModalHeadBG) {
      str += " modal-table-head-bg";
    } else if (record.ModalTableLimit) {
      str += " modal-table-limit";
    } else if (record.centerNumberStyle) {
      str += " center-number-style";
    }

    return str;
  }

  private customCell(record: any, index: any) {
    return {
      style: {
        color: "#FF0000"
      }
    };
  }

  // add edit delete等操作
  private async onSelectClick(
    activeObJ: any,
    selected: any,
    selectedData: any
  ) {
    this.selectName = activeObJ.name;
    if (activeObJ.name === "Export") {
      this.toExport(selectedData);
    }
    if (activeObJ.name === "Edit") {
      // Edit 禁止编辑基础信息
      this.toEdit(selected, selectedData);
    }
    if (activeObJ.name === "Add") {
      this.visible = true;
    }
    if (activeObJ.name === "Delete") {
      const that = this;
      const statementNumber = selectedData
        .map((item: any) => item.statementNumber)
        .join("&statementNumbers=");
      const url = `/finance/adjustment/cndn?statementNumbers=${statementNumber}`;
      this.$confirm({
        title: "Confirm!",
        content: "Continue to  deleted the data?",
        okText: "YES",
        cancelText: "NO",
        async onOk() {
          //确认删除
          await AxiosDelete(url).then((res: any) => {
            if (res.code == 1) {
              that.SearchOk("");
            }
          });
          // 确认删除提示语
          that.$message.success("Data has been deleted successfully", 1);
        }
      });
    }
    if (activeObJ.name === "Download") {
      let data: any = [];
      selectedData.forEach((it: any) => {
        if (it.dataSource === 1) {
          let {
            accountName,
            adjustmentMonth,
            adjustmentReason,
            adjustmentStatus,
            adjustmentType,
            amount,
            amountUsd,
            beginDate,
            chargeTrafficVolume,
            chargeType,
            chargeableUnitType,
            currency,
            cycleName,
            dataSource,
            direction,
            endDate,
            exchangeDate,
            id,
            lastModified,
            modifiedBy,
            operatorFiles,
            serviceName,
            statementNumber
          }: any = it;
          data.push({
            accountName,
            adjustmentMonth,
            adjustmentReason,
            adjustmentStatus,
            adjustmentType,
            amount,
            amountUsd,
            beginDate,
            chargeTrafficVolume,
            chargeType,
            chargeableUnitType,
            currency,
            cycleName,
            dataSource,
            direction,
            endDate,
            exchangeDate,
            id,
            lastModified,
            modifiedBy,
            operatorFiles,
            serviceName,
            statementNumber
          });
        }
      });
      let dataSourceOne = selectedData.every(
        (item: any) => item.dataSource === 1
      );
      let dataSourceTwo = selectedData.every(
        (item: any) => item.dataSource === 2
      );
      console.log('dataSourceOne',dataSourceOne);
      console.log('dataSourceTwo',dataSourceTwo);
      
      if (dataSourceOne === true) {
        // 当dataSource 为System 请求的接口
        await AdjustmentRecordDownloadSystem(data).then((resp: any) => {
          let blob = new Blob([resp], { type: "application/zip" });
          let url = window.URL.createObjectURL(blob);
          let link = document.createElement("a");
          link.style.display = "none";
          link.href = url;
          link.download = "Adjustment Statement.zip"; //docNumber 文件名
          // document.body.appendChild(link);
          // link.click();
          //this.openDownload(url, 'Adjustment Statement.pdf');
        });
      } else if (dataSourceTwo === true) {
        // 当dataSource 为Operator 请求的接口
        this.operatorFiles(selectedData);
        // this.openDownload(
        //   `http://192.168.121.41:8082/finance/adjustment/operatorDownload?fileName=${fileNames}`,
        //   fileName
        // );
      } else {
        //多选时，两种状态同事存在时
        await AdjustmentRecordDownloadSystem(data).then((resp: any) => {
          let blob: any = new Blob([resp], { type: "application/zip" });
          let url = window.URL.createObjectURL(blob);
          let link = document.createElement("a");
          link.style.display = "none";
          link.href = url;
          link.download = "Adjustment Statement.zip"; //docNumber 文件名
          // document.body.appendChild(link);
          // link.click();
          //this.openDownload(url, "AdjustmentCndn");
        });
        this.operatorFiles(selectedData);
        // this.openDownload(
        //   `http://192.168.121.41:8082/finance/adjustment/operatorDownload?fileName=${fileNames}`,
        //   fileName
        // );
      }
      // recodeConfig
    }
  }
  // 上传文件的方法 Upload
  private async uploadFileChange(info) {
    let formDataObj: any = new FormData();
    formDataObj.append("file", info.file.originFileObj);
    this.formDataObj = formDataObj;
  }
  private operatorFiles(selectedData: any) {
    const fileName = selectedData.map((item: any) => item.operatorFiles);
    const fileNames = fileName
      .filter((item: any) => item !== undefined)
      .join("&fileName=");
    let url = `/finance/adjustment/operatorDownload?fileName=${fileNames}`;
    let xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.responseType = "blob";
    xhr.onload = function() {
      if (this.status === 200) {
        let content = this.response;
        let aTag = document.createElement("a");
        let blob: any = new Blob([content]);
        let headerName: any = xhr.getResponseHeader("Content-disposition");
        let DownloadfileName = decodeURIComponent(headerName).substring(20);
        aTag.download = DownloadfileName;
        aTag.href = URL.createObjectURL(blob);
        aTag.click();
        URL.revokeObjectURL(blob);
      }
    };
    xhr.send();
  }
  private onSoltClick(soltName: string, text: any, record: any, index: number) {
    if (soltName === "download") {
      if (record.DataSource == 1) {
        this.PreviewData = SystemData;
      } else {
        this.PreviewData = OperatorData;
      }
      this.selectName = "modalTableVisible";
      this.visible = true;
    }
    this.toExportRowKey = index;
  }
  //导出数据的方法
  private ExportOp() {
    downloadLocalFiles("file/dn.xlsx", "dn.xlsx");
  }
  private async toExport(selectedData) {
    let filterData = selectedData.map((item: any) => {
      const newItem = JSON.parse(JSON.stringify(item));
      delete newItem.id;
      for (let key in newItem) {
        let find: any;
        switch (key) {
          case "adjustmentStatus":
            find = this.adjustmentStatusOptions.find(
              (it: any) => it.value === item[key]
            );
            break;
          case "adjustmentType":
            find = this.AdjustmentTypeOptions.find(
              (it: any) => it.value === item[key]
            );
            break;
          case "chargeType":
            find = this.ChargeTypeOptions.find(
              (it: any) => it.value === item[key]
            );
            break;
          case "chargeableUnitType":
            find = this.ChargeableUnitTypeOptions.find(
              (it: any) => it.value === item[key]
            );
            break;
          case "dataSource":
            find = this.DataSourceOptions.find(
              (it: any) => it.value === item[key]
            );
            break;
          case "direction":
            find = this.DirectionOptions.find(
              (it: any) => it.value === item[key]
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
    await AdjustmentCndnExport(data).then((resp: any) => {
      let blob = new Blob([resp], { type: "application/xlsx" });
      let url = window.URL.createObjectURL(blob);
      this.openDownload(url, "AdjustmentCndn.xlsx");
    });
  }
  // 编辑功能
  private toEdit(selected: any, selectedData: any): void {
    this.visible = true;
    this.selectkeyArr = selected;
    const data: any = {
      Service: selectedData[0].serviceName,
      Account: selectedData[0].accountName,
      ChargeType: selectedData[0].chargeType,
      Direction: selectedData[0].direction,
      Cycle: moment(selectedData[0].cycleName).format("YYYY-MM") || undefined,
      AdjustmentType: selectedData[0].adjustmentType,
      Amount: selectedData[0].amount,
      Currency: selectedData[0].currency,
      EndDate:
        moment(selectedData[0].endDate).format("YYYY-MM-DD") || undefined,
      BeginDate:
        moment(selectedData[0].beginDate).format("YYYY-MM-DD") || undefined,
      Month:
        moment(selectedData[0].adjustmentMonth).format("YYYY-MM") || undefined,
      ExchangeDate:
        moment(selectedData[0].exchangeDate).format("YYYY-MM") || undefined,
      ChargeTrafficVolume: selectedData[0].chargeTrafficVolume,
      ChargeableUnitType: selectedData[0].chargeableUnitType,
      DataSource: selectedData[0].dataSource,
      OperatorFiles: selectedData[0].operatorFiles,
      AdjustmentReason: selectedData[0].adjustmentReason
    };
    setTimeout(() => {
      // 设置基础信息数据
      this.baseInfoFormOptions.forEach((item: any) => {
        if (
          (item.decorator === "Service" ||
            item.decorator === "Account" ||
            item.decorator === "ChargeType" ||
            item.decorator === "Direction") &&
          this.selectName === "Edit"
        ) {
          item.disabled = true;
        } else if (item.decorator === "ExchangeDate") {
          item.disabled = data.Currency == "USD";
        } else if (item.decorator === "Cycle" || item.decorator === "Month") {
          item.disabled =
            item.decorator === "Cycle"
              ? data.ChargeType == 1
              : data.ChargeType == 2;
          item.required = !item.disabled;
        } else if (item.decorator === "OperatorFiles") {
          item.disabled = selectedData[0].DataSource == 1;
        } else {
          item.disabled = false;
        }
        for (let dataKey in data) {
          if (item.decorator === dataKey) {
            if (item.decorator === "Cycle" || item.decorator === "Month") {
              !item.disabled && this.$set(item, "initialValue", data[dataKey]);
            } else {
              this.$set(item, "initialValue", data[dataKey]);
            }
          }
        }
      });
      this.baseInfoFormOptions["Status"] = selectedData[0].adjustmentStatus;
      this.baseInfoFormOptions["StatementNumber"] =
        selectedData[0].statementNumber;
      if (this.baseInfoFormOptions[14].initialValue === 1) {
        this.baseInfoFormOptions[15].disabled = true;
        this.baseInfoFormOptions[15].initialValue = undefined;
      }
    }, 100);
  }
  // modal save 按钮
  private async save(values: any) {
    const baseInfoFormGroup: any = this.$refs.baseInfoFormGroup;
    const baseInfoData = baseInfoFormGroup.validateFields();
    if (!baseInfoData) return console.log(1);
    if (this.selectName === "Add") {
      let data: any = {
        accountName: baseInfoData.Account || undefined,
        adjustmentReason: baseInfoData.AdjustmentReason || undefined,
        adjustmentType: baseInfoData.AdjustmentType || undefined,
        amount: baseInfoData.Amount || undefined,
        beginDate:
          moment(baseInfoData.BeginDate).format("YYYY-MM-DD") || undefined,
        chargeTrafficVolume: baseInfoData.ChargeTrafficVolume || undefined,
        chargeType: baseInfoData.ChargeType || undefined,
        chargeableUnitType: baseInfoData.ChargeableUnitType || undefined,
        currency: baseInfoData.Currency || undefined,
        cycleName: baseInfoData.Cycle || undefined,
        dataSource: baseInfoData.DataSource || undefined,
        direction: baseInfoData.Direction || undefined,
        endDate: moment(baseInfoData.EndDate).format("YYYY-MM-DD") || undefined,
        exchangeDate:
          moment(baseInfoData.ExchangeDate).format("YYYY-MM") || undefined,
        adjustmentMonth:
          moment(baseInfoData.Month).format("YYYY-MM") || undefined,
        operatorFiles: baseInfoData.OperatorFiles || undefined,
        serviceName: baseInfoData.Service || undefined
      };
      // 上传文件
      if (baseInfoData.DataSource === 2) {
        let uploadData = await UploadCndnFile(this.formDataObj);
        this.formDataObj = undefined;
      }
      await AdjustmentCndnAdd(data).then((resp: recodeConfig) => {
        if (resp.code == 1) {
          this.$message.success(resp.msg);
          this.SearchOk("");
          this.visible = false;
        }
      });
    }
    if (this.selectName === "Edit") {
      let data: any = {
        serviceName: baseInfoData.Service || undefined,
        accountName: baseInfoData.Account || undefined,
        adjustmentReason: baseInfoData.AdjustmentReason || undefined,
        adjustmentType: baseInfoData.AdjustmentType || undefined,
        amount: baseInfoData.Amount || undefined,
        beginDate:
          moment(baseInfoData.BeginDate).format("YYYY-MM-DD") || undefined,
        chargeTrafficVolume: baseInfoData.ChargeTrafficVolume || undefined,
        chargeType: baseInfoData.ChargeType || undefined,
        chargeableUnitType: baseInfoData.ChargeableUnitType || undefined,
        currency: baseInfoData.Currency || undefined,
        cycleName: baseInfoData.Cycle || undefined,
        dataSource: baseInfoData.DataSource || undefined,
        direction: baseInfoData.Direction || undefined,
        endDate: moment(baseInfoData.EndDate).format("YYYY-MM-DD") || undefined,
        exchangeDate:
          moment(baseInfoData.ExchangeDate).format("YYYY-MM") || undefined,
        adjustmentMonth:
          moment(baseInfoData.Month).format("YYYY-MM") || undefined,
        operatorFiles:
          baseInfoData.DataSource === 1
            ? undefined
            : baseInfoData.OperatorFiles,
        adjustmentStatus: this.baseInfoFormOptions["Status"] || undefined,
        statementNumber:
          this.baseInfoFormOptions["StatementNumber"] || undefined
      };
      // 上传文件
      if (baseInfoData.DataSource === 2 && this.formDataObj) {
        let uploadData = await UploadCndnFile(this.formDataObj);
        this.formDataObj = undefined;
      }
      //修改文件名 
      await AdjustmentCndnEdit(data).then((resp: recodeConfig) => {
        if (resp.code == 1) {
          this.$message.success(resp.msg);
          this.SearchOk("");
          this.visible = false;
        }
      });
    }
    this.baseInfoFormOptions.forEach((item: any) => {
      item.initialValue = undefined;
      item.disabled = false;
    });
  }
  /* 退出 */

  private handleReturn() {
    if (this.selectName == "modalTableVisible") {
      this.visible = !this.visible;
    } else {
      this.visible = !this.visible;
      this.baseInfoFormOptions[13].required = false;
      this.$refs.baseInfoFormGroup.resetFields();
      this.baseInfoFormOptions.forEach((item: any) => {
        item.initialValue = undefined;
        item.disabled = false;
      });
    }
  }
  //初始加载的数据
  public async created() {
    let AccountOptions = await getAccountOptions();
    let ServiceOptions = await getServiceOptions();
    let CurrencyOptions = await getCurrencyOptions();
    let CyclesOptions = await getCyclesOptions();

    //
    this.columns[0]["options"] = ServiceOptions;
    this.formOptions[0]["options"] = ServiceOptions;
    this.baseInfoFormOptions[0]["options"] = ServiceOptions;
    //
    this.columns[1]["options"] = AccountOptions;
    this.formOptions[1]["options"] = AccountOptions;
    this.baseInfoFormOptions[1]["options"] = AccountOptions;
    //
    this.columns[10].options = CurrencyOptions;
    this.baseInfoFormOptions[10]["options"] = CurrencyOptions;
    //
    this.CyclesOptions = CyclesOptions;
    this.formOptions[5]["options"] = CyclesOptions;
  }
}
</script>

<style lang="scss">
@import "@/views/Finance/common/css/deep-modal.scss";
.cndn .ant-table-tbody tr.left td:not(:first-child) {
  text-align: left;
}

.ant-modal.edit-modal .ant-table-tbody tr.font-size-eleven td {
  // text-align: center;
  font-size: 14px;
  color: #000000;
  font-weight: bold;
}

.ant-modal.edit-modal .ant-table-tbody tr.font-size-eighteen td {
  text-align: center !important;
  font-size: 22px;
  color: #000000;
  font-weight: bold;
}
.remove-all-border
  .ant-table-tbody
  > tr.center-number-style
  > td.center-td-style {
  text-align: center !important;
}
.remove-all-border .ant-table-thead > tr > th,
.remove-all-border .ant-table-tbody > tr > td {
  border-right: 1px solid transparent;
  border-bottom: 1px solid transparent;
  color: #000000;
  text-align: left !important;
  padding: 2px !important;
}
.modal-table-head-bg {
  background: #dcdff1;
}

// modal-table-limit
</style>
<style lang="scss" scoped>
@import "@/views/Finance/common/css/Statement.scss";
@import "@/views/Finance/common/css/modal.scss";
</style>