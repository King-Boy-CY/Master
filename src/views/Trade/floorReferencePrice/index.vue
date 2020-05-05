<template>
  <div>
    <Advanced-search
      ref="searchref"
      :formoptions="formoptions"
      :isChildName="true"
      @Submit="SearchOk"
      allowClear
      childDataKey="contractfoVOList"
      @pickerChange="pickerChange"
    ></Advanced-search>

    <Table
      :isFinance="true"
      :isNeedCheck="true"
      :selectedBtn="Formscreening"
      :isPagination="false"
      :backPagination="true"
      :columns="columns"
      :data="data"
      :backPaginationObj="backPaginationObj"
      @sorterFun="sorterFun"
      @onSelectClick="activeClick"
      @onSelectAll="onSelectAll"
      @onSelect="onSelect"
      @onShowSizeChange="onShowSizeChange"
      @onPageChange="onPageChange"
      parentKey="id"
      zebraStripe
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import moment, { Moment } from "moment";
import { formoptions, columns } from "./config";
import { formoptionsData, FormscreeningData, columnsData } from "./data";
import { getPageFucType, sortFunType } from "../sellPrice/type";
import { spitDate } from "../sellPrice/method";
import { dateTrafficDate, dateDate } from "../sellPrice/field";
import {
  getRefInDestinationName,
  getCountryName,
  getDetailService,
  getFloorRefPrice,
  getRefPriceExcel
} from "@/api/index";
import { checkDateStatus, getExpData } from "../sellPrice/method";
import { expExcel, pageFun } from "../sellPrice/api";
import { deepClone } from "@/assets/ts/index";
@Component({
  components: {
    AdvancedSearch: resolve =>
      require(["@/common/Advancedsearch/index.vue"], resolve),
    Table: resolve =>
      require(["@/views/Finance/components/Table/index.vue"], resolve)
  }
})
class floorSellPrice extends Vue {
  private formoptions: any[] = deepClone(formoptionsData);
  private Formscreening: any[] = deepClone(FormscreeningData);
  private columns: any[] = columnsData;
  private data: any[] = [];
  private searchRecord: object = {};
  private backPaginationObj: object = {};
  public pickerChange(values: Moment[]) {
    /*  checkDateStatus :日期清空时  Destination&& Country 置灰 */
    checkDateStatus({
      data: values,
      formData: this.formoptions,
      disabledKey: [1, 4],
      field: dateDate()
    });
  }
  public async SearchOk(formData: any) {
    let new_data = spitDate({
      data: formData,
      formData: this.formoptions,
      field: dateTrafficDate(undefined, true)
    });
    this.searchRecord = new_data;
    this.getPageFuc();
  }
  public async getPageFuc(params?: getPageFucType) {
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
      fn: getFloorRefPrice, //axios请求
      selectedBtn: this.Formscreening
    });
    this.data = data;
    this.backPaginationObj = backPage;
  }
  public activeClick(activeObJ: any) {
    if (!Object.keys(activeObJ).length) return;
    delete this.searchRecord["currPage"];
    delete this.searchRecord["pageSize"];
    expExcel({
      fn: getRefPriceExcel,
      data: this.searchRecord,
      expModule: "Floor Reference Price"
    });
  }
  public onSelectAll() {}
  public onSelect() {}
  public async created() {
    // fn getExpData 代替此种写法
    let sedFied = dateDate();
    getExpData({
      data: this.formoptions,
      fns: [getRefInDestinationName, getDetailService, getCountryName],
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
    if(!this.data[0]) return
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
