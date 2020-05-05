<template>
  <div>
    <Advanced-search
      :formoptions="searchOptions"
      :isChildName="true"
      allowClear
      @Submit="SearchOk"
      ref="AdvancedSearch"
      @pickerChange="rangePickerChange"
    />
    <Table
      :isFinance="true"
      :isPagination="false"
      :isNeedCheck="true"
      :backPagination="true"
      :selectedBtn="selectedBtn"
      :columns="columns"
      :data="data"
      :isShowDownloadColor="true"
      :backPaginationObj="backPaginationObj"
      ref="table"
      parentKey="id"
      @onSelectClick="onSelectClick"
      @onSelect="onSelect"
      @onSelectAll="onSelectAll"
      @onSoltClick="onSoltClick"
      @onShowSizeChange="onShowSizeChange"
      @onPageChange="onPageChange"
      @sorterFun="sorterFun"
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
  selectOptionsInterface
} from "@/common/dataConfig/interface";
import { floorBuyRateTableDataInterface } from "./interface";
import { columns } from "./config";
import moment from "moment";
import { testFormOptions, testTableData } from "@/assets/ts/index";
import { getFloorBuyRates, getFloorBuyRateExcel } from "@/api/index";
import { Action } from "vuex-class";
import { checkDateStatus, getExpData, spitDate } from "../sellPrice/method";
import { expExcel, pageFun } from "../sellPrice/api";
import { getPageFucType, sortFunType } from '../sellPrice/type'
import { dateTrafficDate, dateDate } from "../sellPrice/field";
@Component({
  components: {
    AdvancedSearch: () => import("@/common/Advancedsearch/index.vue"),
    // pagination: () => import("@/common/pagination/index.vue"),
    Model: () => import("@/common/Model/index.vue"),
    Table: () => import("@/views/Finance/components/Table/index.vue")
  }
})
class FloorBuyRate extends Vue {
  @Action("getService") getService;
  @Action("getDestination") getDestination;
  @Action("getCountries") getCountries;
  private searchOptions: searchOptionsInterface[] = [
    {
      // 日期
      required: true,
      type: "rangePicker",
      Tips: "Traffic date",
      name: "rangeTime",
      initialValue: [moment().startOf("day"), moment().endOf("day")]
    },
    {
      // 目的地名称
      required: false,
      type: "select",
      Tips: "Destination",
      name: "refOutDestinationName",
      options: [],
      showSearch: true,
      disabled: false
    },
    {
      // 业务名称
      required: false,
      type: "select",
      Tips: "Service",
      name: "configServiceName",
      options: []
    },

    {
      // 号码头前缀
      required: false,
      type: "input",
      Tips: "Dialed digits",
      name: "preDialedDigit",
      isCheckNumber: true
    },
    {
      // 国家名称
      required: false,
      type: "select",
      Tips: "Country",
      name: "countryName",
      options: [],
      showSearch: true,
      disabled: false
    },
    {
      // 国家代码前缀
      required: false,
      type: "input",
      Tips: "Country code",
      name: "preCountryCode",
      isCheckNumber: true
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
  private data: floorBuyRateTableDataInterface[] = [];
  private searchRecord: object = {};
  private backPaginationObj: object = {};
  // 高级搜索 Search -> 回调
  private async SearchOk(formData: any) {
    let new_data: object = spitDate({
      data: formData,
      formData: this.searchOptions,
      field:dateTrafficDate(undefined,true)
    });
    this.searchRecord = new_data;
    this.getPageFuc();
  }

  // 时间范围选择器回调
  private rangePickerChange(value: any) {
    checkDateStatus({
      data: value,
      formData: this.searchOptions,
      disabledKey: [1, 4],
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
      fn: getFloorBuyRates,
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
   * @param record: 选中数据
   * @param selected: 是否选中 true/false
   * @param selectedRows: 所有选中 Array
   */
  public onSelect(record: object, selected: boolean, selectedRows: any) {
    // console.log(record, selected, selectedRows);
    // this.selectedData = selectedRows;
    // this.changeDisable(selectedRows);
  }

  // 表格上方按钮
  private onSelectClick(activeObJ: any, selected: any, selectedData: any) {
    // console.log(activeObJ, selected, selectedData);
    if (!Object.keys(activeObJ).length) return;
    delete this.searchRecord["currPage"];
    delete this.searchRecord["pageSize"];
    expExcel({
      fn: getFloorBuyRateExcel,
      data: this.searchRecord,
      expModule: "Floor Buy Rate"
    });
  }

  private onSoltClick(soltName: string, text: any, record: any, index: number) {
    if (soltName === "download") {
      // console.log("点击了哟");
    }
  }
  private async created() {
    let sedFied = dateDate(2);
    getExpData({
      data: this.searchOptions,
      fns: [this.getDestination, this.getService, this.getCountries],
      field: [sedFied, undefined, sedFied]
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
export default FloorBuyRate;
</script>
