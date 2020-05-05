<template>
  <div class="sellPrice">
    <AdvancedSearch
      :formoptions="formoptions"
      @Submit="submit"
      allowClear
      @pickerChange="pickerChange"
    />
    <Table
      :columns="columns"
      :data="tableData"
      :selectedBtn="selectedBtn"
      :isNeedCheck="true"
      :isPagination="false"
      :backPagination="true"
      :backPaginationObj="backPaginationObj"
      @onShowSizeChange="onShowSizeChange"
      @onPageChange="onPageChange"
      parentKey="id"
      @onSelectClick="onSelectClick"
      @sorterFun="sorterFun"
      zebraStripe
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { formoptions, columns, tableBtn } from "./type";
import { formoptionData, tableColumns, selectedBtn } from "./data";
import { getFloorSellPrice, getFloorSellPriceExcel } from "@/api/index";
import { recodeConfig } from "@/assets/ts/config";
import { tableDataConfig } from "../sellPrice/type";
import { spitDate, checkDateStatus } from "../sellPrice/method";
import moment, { Moment } from "moment";
import { getPageFucType, sortFunType } from "../sellPrice/type";
import { expExcel, pageFun } from "../sellPrice/api";
import { dateTrafficDate, dateDate } from "../sellPrice/field";
import { ExpData } from "./api";
import { deepClone } from "@/assets/ts/index";

@Component({
  components: {
    AdvancedSearch: () => import("@/common/Advancedsearch/index.vue"),
    Table: () => import("@/views/Finance/components/Table/index.vue")
  }
})
class floorSellPrice extends Vue {
  private formoptions: formoptions[] = deepClone(formoptionData);
  private columns: columns[] = tableColumns;
  private tableData: tableDataConfig[] = [];
  private selectedBtn: tableBtn[] = deepClone(selectedBtn);
  private searchRecord: object = {};
  private backPaginationObj: object = {};
  private created () {
    // 高级搜索下拉请求
    ExpData(this.formoptions, dateDate());
  }
  // Search
  private async submit(values: object) {
    let new_data = spitDate({
      data: values,
      formData: this.formoptions,
      field: dateTrafficDate(undefined, true)
    });
    this.searchRecord = new_data;
    this.getPageFuc();
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
      fn: getFloorSellPrice,
      selectedBtn: this.selectedBtn
    });
    this.tableData = data;
    this.backPaginationObj = backPage;
  }
  // 时间控件触发
  private pickerChange(values: Moment[]) {
    checkDateStatus({
      data: values,
      formData: this.formoptions,
      disabledKey: [1, 3],
      field: dateDate()
    });
  }
  private onSelectClick(value) {
    if (!Object.keys(value).length) return;
    delete this.searchRecord["currPage"];
    delete this.searchRecord["pageSize"];
    expExcel({
      fn: getFloorSellPriceExcel,
      data: this.searchRecord,
      expModule: "Floor Sell Price"
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
    if(!this.tableData[0]) return
    //  ascend(升序) & descend(降序)
    let { order, column } = sort;
    this.getPageFuc({
      sortField: column.dataIndex,
      sortMode: order === "ascend" ? "ASC" : "DESC"
    });
  }
}
export default floorSellPrice;
</script>
