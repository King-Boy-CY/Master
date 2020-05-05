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
      @onSelectClick="onSelectClick"
      @sorterFun="sorterFun"
      parentKey="id"
      zebraStripe
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import {
  formoptions,
  columns,
  tableBtn,
  tableDataConfig,
  getSellPricePageListType,
  getPageFucType,
  sortFunType
} from "./type";
import { spitDate, checkDateStatus } from "./method";
import { formoptionData, tableColumns, selectedBtn } from "./data";
import { getSellPrice } from "@/api/index";
import { recodeConfig } from "@/assets/ts/config";
import moment, { Moment } from "moment";
import { ExpData, expExcel, pageFun } from "./api";
import { dateDate } from "./field";
import { getSellExcel } from "@/api/index";
import { deepClone, isArray,testTableData, testFormOptions } from "@/assets/ts/index";
@Component({
  components: {
    AdvancedSearch: () => import("@/common/Advancedsearch/index.vue"),
    Table: () => import("@/views/Finance/components/Table/index.vue")
  }
})
class sellPrice extends Vue {
  private formoptions: formoptions[] = deepClone(formoptionData);
  private columns: columns[] = tableColumns;
  private tableData: tableDataConfig[] = [];
  private selectedBtn: tableBtn[] = deepClone(selectedBtn);
  private searchRecord: object = {};
  private backPaginationObj: object = {};
  private created () {
    // 高级搜索下拉请求
    ExpData(this.formoptions);
    // 生成高级搜索测试数据
    // testFormOptions({
    //     formData:this.formoptions,
    //     // generate:[[1,10]],
    //     isRandom:false,
    //     length:10
    // })
  }
  // Search
  private async submit(values: object) {
    // let new_data: object = spitDate({
    //   data: values,
    //   formData: this.formoptions
    // });
    // this.searchRecord = new_data;
    // this.getPageFuc();
    // 生成表格测试数据
   const new_tableData =  testTableData({
        tableColumns:tableColumns,
        length:10
    })
    this.tableData = new_tableData;
    console.log('new_tableData',new_tableData);
  }
  // 执行分页 排序
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
      fn: getSellPrice,
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
      disabledKey: [2, 4],
      field: dateDate()
    });
  }
  // 导出
  private onSelectClick(value) {
    if (!Object.keys(value).length) return;
    delete this.searchRecord["currPage"];
    delete this.searchRecord["pageSize"];
    expExcel({
      fn: getSellExcel,
      data: this.searchRecord,
      expModule: "Sell Price"
    });
  }
  // 切换页
  private async onPageChange(page: number, pageSize: number) {
    this.getPageFuc({
      page,
      pageSize
    });
  }
  // 当页显示多少条
  private async onShowSizeChange(page: number, pageSize: number) {
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
export default sellPrice;
</script>
