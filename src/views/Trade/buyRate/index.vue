<template>
  <div>
    <Advanced-search
      :formoptions="searchOptions"
      :isChildName="true"
      allowClear
      @Submit="SearchOk"
      ref="AdvancedSearch"
      @selectChange="searchSelectChange"
      @pickerChange="rangePickerChange"
    />
    <Table
      :isFinance="true"
      :isNeedCheck="true"
      :isPagination="false"
      :backPagination="true"
      :selectedBtn="selectedBtn"
      :columns="columns"
      :data="data"
      :isShowDownloadColor="true"
      :backPaginationObj="backPaginationObj"
      @onSelectClick="onSelectClick"
      @onSelect="onSelect"
      @onSelectAll="onSelectAll"
      @onSoltClick="onSoltClick"
      @onShowSizeChange="onShowSizeChange"
      @onPageChange="onPageChange"
      @sorterFun="sorterFun"
      ref="table"
      parentKey="id"
      :scrollX="2600"
      zebraStripe
    ></Table>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import {
  searchOptionsInterface,
  selectedBtnInterface,
  tableColumnsInterface,
  selectOptionsInterface,
  responedInterface
} from "@/common/dataConfig/interface";
import { buyRateTableDataInterface } from "./interface";
import { columns } from "./config";
import { testFormOptions, testTableData } from "@/assets/ts/index";
import moment from "moment";
import { getBuyRates, CommercialTrunkList, getBuyRateExcel } from "@/api/index";
import { agreementTypeOption, CLITypeOption } from "@/common/ts/options";
import { resolveSelectResponed } from "@/assets/ts/index";
import { Action } from "vuex-class";
import { checkDateStatus, getExpData, spitDate } from "../sellPrice/method";
import { expExcel, pageFun } from "../sellPrice/api";
import { getPageFucType, sortFunType } from "../sellPrice/type";
import { dateDate } from "../sellPrice/field";
@Component({
  components: {
    AdvancedSearch: () => import("@/common/Advancedsearch/index.vue"),
    // pagination: () => import("@/common/pagination/index.vue"),
    Model: () => import("@/common/Model/index.vue"),
    Table: () => import("@/views/Finance/components/Table/index.vue")
  }
})
class BuyRate extends Vue {
  @Action("getAccounts") getAccounts;
  @Action("getService") getService;
  @Action("getDestination") getDestination;
  @Action("getCountries") getCountries;
  // @Action('getCountriesCode') getCountriesCode;

  private searchOptions: searchOptionsInterface[] = [
    {
      required: true,
      type: "rangePicker",
      Tips: "Begin date",
      name: "rangeTime",
      format: "YYYY-MM-DD",
      // showTime: {
      //     hideDisabledOptions: true,
      //     defaultValue: [moment('00:00:00', 'HH:mm'), moment('23:59:59', 'HH:mm:ss')]
      // },
      initialValue: [
        moment()
          .add(-1, "M")
          .startOf("month"),
        moment()
          .add(31, "d")
          .endOf("day")
      ]
    },
    {
      required: false,
      type: "select",
      Tips: "Account",
      name: "accountName",
      options: [],
      showSearch: true
    },
    {
      required: false,
      type: "select",
      Tips: "Commercial trunk",
      name: "commercialTrunkName",
      options: [],
      disabled: true,
      showSearch: true
    },
    {
      // 合同类型
      required: false,
      type: "select",
      Tips: "Type",
      name: "agreementType",
      options: agreementTypeOption
    },
    {
      required: false,
      type: "select",
      Tips: "Destination",
      name: "refOutDestinationName",
      options: [],
      showSearch: true,
      disabled: false
    },

    {
      required: false,
      type: "input",
      Tips: "Dialed digits",
      name: "preDialedDigit",
      isCheckNumber: true
    },
    {
      required: false,
      type: "select",
      Tips: "Country",
      name: "countryName",
      options: [],
      showSearch: true,
      disabled: false
    },
    {
      required: false,
      type: "input",
      Tips: "Country code",
      name: "preCountryCode",
      isCheckNumber: true
    },
    {
      required: false,
      type: "select",
      Tips: "Service",
      name: "configServiceName",
      options: []
    },
    {
      // 是否主叫显示
      required: false,
      type: "select",
      Tips: "CLI",
      name: "isCli",
      options: CLITypeOption
    }
  ];

  private selectedBtn: selectedBtnInterface[] = [
    {
      name: "Export",
      icon: "export",
      index: 0,
      disabled: true
      // tips: `Selected records can NOT be reviewed  or submitted for approval`
    }
  ];

  private columns: tableColumnsInterface[] = columns;
  private data: buyRateTableDataInterface[] = [];
  private lastAccountName: string = "";
  private searchRecord: object = {};
  private backPaginationObj: object = {};
  // 高级搜索 Search -> 回调
  private async SearchOk(formData: any) {
    formData.isCli = formData.isCli
      ? formData.isCli === "No"
        ? 0
        : 1
      : undefined;
    let new_data: object = spitDate({
      data: formData,
      formData: this.searchOptions
    });
    this.searchRecord = new_data;
    this.getPageFuc();
  }

  private searchSelectChange(formData: any) {
    this.searchOptions[2].disabled = !formData.accountName;
    if (!formData.accountName) {
      (this.$refs.AdvancedSearch as any).setFieldsValue({
        commercialTrunkName: undefined
      });
    }

    if (formData.accountName && this.lastAccountName !== formData.accountName) {
      // 获取 CommercialTrunk options
      const data: any = {
        params: {
          accountName: formData.accountName
        }
      };
      CommercialTrunkList(data).then((res: responedInterface) => {
        this.searchOptions[2].options = resolveSelectResponed(res);
      });
    }
    this.lastAccountName = formData.accountName || "";
  }

  // 时间范围选择器回调
  private rangePickerChange(value: any) {
    checkDateStatus({
      data: value,
      formData: this.searchOptions,
      disabledKey: [4, 6],
      field: dateDate(2)
    });
  }
  private async getPageFuc(params?: getPageFucType) {
    let currPage: number = 1,
      pageSize: number = 10;
    // 排序
    if (params && params.sortField && params.sortMode) {
      this.searchRecord["sortField"] = params.sortField;
      this.searchRecord["sortMode"] = params.sortMode;
    }
    // 分页
    if (params && params.page && params.pageSize) {
      currPage = params.page;
      pageSize = params.pageSize;
    }
    const { data, backPage } = await pageFun({
      data: this.searchRecord,
      currPage,
      pageSize,
      fn: getBuyRates,
      selectedBtn: this.selectedBtn
    });
    this.data = data;
    this.backPaginationObj = backPage;
  }
  /* 用户手动选择/取消选择所有列的回调  Table -> 回调 */
  public onSelectAll(selected: any, selectedRows: any, changeRows: any) {
    // console.log(selected, selectedRows, changeRows);
    // this.changeDisable(selectedRows);
    // this.selectedData = selectedRows;
  }

  /* 用户手动选择/取消选择某列的回调
    @param record: 选中数据
    @param selected: 是否选中 true/false
    @param selectedRows: 所有选中 Array
    */
  public onSelect(record: object, selected: boolean, selectedRows: any) {
    // console.log(record, selected, selectedRows);
  }

  // 表格上方按钮
  private onSelectClick(activeObJ: any, selected: any, selectedData: any) {
    if (!Object.keys(activeObJ).length) return;
    delete this.searchRecord["currPage"];
    delete this.searchRecord["pageSize"];
    expExcel({
      fn: getBuyRateExcel,
      data: this.searchRecord,
      expModule: "Buy Rate"
    });
  }

  private onSoltClick(soltName: string, text: any, record: any, index: number) {
    if (soltName === "download") {
      // console.log("点击了哟");
    }
  }

  private async created() {
    let sedFied = dateDate(2)
    getExpData({
      data: this.searchOptions,
      fns: [
        this.getAccounts,
        this.getDestination,
        this.getCountries,
        this.getService
      ],
      field: [undefined, sedFied, sedFied, undefined]
    });
  }
  private async onPageChange(page, pageSize) {
    this.getPageFuc({
      page,
      pageSize
    });
  }
  private async onShowSizeChange(page, pageSize) {
    this.getPageFuc({
      page,
      pageSize
    });
  }
  // 排序
  private sorterFun(sort: sortFunType) {
    //  ascend(升序) & descend(降序)
    if(!this.data[0]) return
    let { order, column } = sort;
    this.getPageFuc({
      sortField: column.dataIndex,
      sortMode: order === "ascend" ? "ASC" : "DESC"
    });
  }
  // 防止切换页面 回来状态还是可以选中而数据已经情空
  private destroyed() {
    this.selectedBtn[0]["disabled"] = true;
  }
}
export default BuyRate;
</script>
