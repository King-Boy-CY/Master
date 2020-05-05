<template>
  <div id="track">
    <!--  表单部分 -->
    <fold-container>
      <template slot="formgroup">
        <form-group ref="formgroup" :formoptions="topFromOptions" @Submit="searchSubmit" :identifying="identifying" @monthPickerChange="searchMonthPicherChange">
          <a-row>
            <a-col :span="24" :style="{ textAlign: 'center' }">
              <a-button
                type="primary"
                html-type="submit"
                icon="search"
                :style="{ borderRadius: '50px 50px 50px 50px' }"
              >Search</a-button>
              <a-button
                :style="{ marginLeft: '30px', backgroundColor: 'rgb(245,177,72)', color: '#fff', border: 0, borderRadius: '50px 50px 50px 50px' }"
                @click="handleReset"
                icon="undo"
              >Reset</a-button>
            </a-col>
          </a-row>
        </form-group>
      </template>
    </fold-container>
    <!--  operate list -->
    <div>
      <operate-btn
        :columns="columns"
        :BtnList="btnList"
        :plainOptions="plainOptions"
        @operateClick="operateClick"
        @userDefindConfirm="userDefindConfirm">
      </operate-btn>
    </div>
    <!-- table -->
    <div>
      <simple-table :columns="copyColumns" :propTotal="pagination.total" :data="data" :border="border" :isAlphabet="isAlphabet" @handletablechange="tableChange" @selectedRows="onSelectChange"></simple-table>
    </div>

  </div>
</template>
<script lang="ts">
import Vue from "vue"
import moment from "moment"
import { Component } from "vue-property-decorator"
import {
  IBtnList,
  trackCommercialBtn,
  IColumns,
  trackColumns,
  IFormoptions,
  trackCommercialFrom,
  formOptionsUtil,
  compareDate
} from "@/untils/router"

import {
  getFormoptions,
  postSearchResult,
  postComercialAdd
} from "@/api/router"

import { Status, Message, Pagination, IPagination } from "../index"

import { debounce } from "ts-debounce"
@Component({
  components: {
    FoldContainer: () => import("@/components/router/FoldContainer.vue"),
    OperateBtn: () => import("@/components/router/OperateBtn.vue"),
    SimpleTable: () => import("@/components/router/SimpleTable.vue"),
    Model: () => import("@/common/Model/index.vue"),
    FormGroup: () => import("@/components/router/FormGroup.vue")
  }
})
export default class trackCommercial extends Vue {
  private form: any
  // 控制form隐藏显示
  private collapsed: boolean = false

  //OperateBtn 传值

  private btnList: IBtnList[] = trackCommercialBtn

  // 控制add modal
  private visible: boolean = false

  // 接收子组件table勾选过的值
  private selectedRows: any[] = []

  //标识哪个页面调用formGroup
  private identifying :any = {name:'trackCommercial',num:30}

  // user-defined 模态框可选数据
  private plainOptions: string[] = [
    "Product",
    "Route class",
    "Status",
    "Route1",
    "Route2",
    "Route3",
    "Route4",
    "Route5",
    "Route6",
    "Route7",
    "Route8",
    "Route9",
    "Route10",
    "Begin date",
    "End date",
    "Service",
    "Country",
    "Remark",
    "Last update",
    "Staff"
  ]
  //private expand: boolean = false

  private columns: IColumns[] = trackColumns
  private copyColumns: IColumns[] = trackColumns
  private data: any = []
  private border: boolean = true

  //是否显示字母表
  private isAlphabet:boolean = false

  // topFrom
  private topFromOptions: IFormoptions[] = trackCommercialFrom

  //分页
  private pagination: IPagination = Pagination

  //保存params
  private searchParams: any

  //search submit
  private url: string = "/route/guide/search"
  private searchSubmit(err: any, values: any): void {
    const params = {
      params: {
        routeClass: values.routeClass ? values.routeClass : "",
        product: values.product ? values.product : '',
        service: values.service ? values.service : "",
        country: values.country ? values.country : "",
        beginDate: values.beginDate===undefined ||values.beginDate.length === 0 ? '' : values.beginDate[0].format('YYYY-MM-DD'),
        beginDateTo: values.beginDate===undefined ||values.beginDate.length === 0 ? '' : values.beginDate[1].format('YYYY-MM-DD'),
        transactionId: values.transactionId ? values.transactionId : ""
      },
      status: values.status == 'All' ? '' : values.status,
      pageSize: this.pagination.pageSize,
      pageNum: this.pagination.pageNum,
      sortField: this.pagination.sortField,
      sortOrder: this.pagination.sortOrder
    };
    this.searchParams = params.params
    // TODO 点击search时的处理逻辑
    postSearchResult(params, this.url).then(res => {
        if (res.code === Status.Ok) {
          this._dataCleaning(res)
        }else{
          this._dataCleaning(res)
          this.$message.error(res.msg)
        }
      }).catch(error => {
        this.$message.error(Message.Net_anomaly)
      })
  }

  private _dataCleaning(data) {
    const pagination = { ...this.pagination }
    pagination.total = data.data.total
    this.data = data.data.list
    this.pagination = pagination
  }

  /**
   * 子组件table勾选change时触发
   * @Params selectedRows 勾选的行
   */
  private onSelectChange(selectedRows: any[]): void {
    console.log(selectedRows)
    this.selectedRows = selectedRows
  }

   /**
   * User-Defind Confirm 接收子组件参数
   */
  private userDefindConfirm(checkboxColumns: any[]): void {
    console.log(checkboxColumns)
    this.copyColumns = checkboxColumns
  }
  /**
   * form表单实例化
   */
  protected beforeCreate() {
    this.form = this.$form.createForm(this)
  }

  /**点击
   * operateBtn时触发
   *
   */
  private operateClick(eventType: string): void {
    console.log(eventType)
    if(eventType === 'details'){
      if(this.selectedRows.length === 1) {
        this.$router.push({ name: 'CommercialRoute', query: { 'data': this.selectedRows[0].id}})
      }else{
        this.$message.warning(Message.AtLeast_One)
      }
    }else if(eventType === 'ViewTechnical'){
      if(this.selectedRows.length === 1) {
        this.$router.push({ name: 'ManagementTechnical', query: { 'data': this.selectedRows[0]}})
      }else{
        this.$message.warning(Message.AtLeast_One)
      }
    }
  }
  private Return(): void {
    this.visible = !this.visible
  }

  /**
   * Form表单展开与收缩
   */
  public toggle() {
    this.collapsed = !this.collapsed
  }

  /**
   * Form Reset
   */
  public handleReset() {
    const ref: any = this.$refs["formgroup"]
    ref.resetFields()
  }

  /**
   * 分页 排序 筛选变化时触发
   *
   */
  public tableChange(pagination, filters, sorter) {
    console.log(sorter)
    const pager = { ...pagination }
    pager.current = pagination.current
    this.pagination = pager
    // this.pagination.sortField = sorter.field
    // this.pagination.sortOrder = sorter.order
    // this.pagination['pageSize'] = pagination.pageSize

    postSearchResult(
      {
        params: this.searchParams,
        pageSize: pagination.pageSize,
        pageNum: pagination.current,
        sortField: sorter.field ? sorter.field : "",
        sortOrder: sorter.order ? sorter.order : ""
      },this.url).then(res => {
        this._dataCleaning(res)
      }).catch(error => {})
  }

    //form请求
  protected mounted() {
    getFormoptions({ id: 11 }).then(res => {
        if (res.code === Status.Ok) {
          const data = res.data; // TODO searchOptions
          this.topFromOptions = formOptionsUtil(this.topFromOptions, data, 1)
        } else {
          this.$message.error(Message.Unknown)
        }
      })
      .catch(error => {
        console.log(error)
      })
  }


  public selectChange(val, name) {
    console.log(val)
    console.log(name)
  }

  private errorModal(title: string, content: string) {
    this.$error({title, content})
  }

  private searchMonthPicherChange(e, val, decorator) {
    const warn: string = decorator === 'beginDate' ? '开始时间不能大于结束时间' : '结束时间不能小于开始时间'
    const beginDate: string = val['beginDate'] === null || val['beginDate'] === undefined ? '' : moment(val['beginDate']).format('YYYY-MM-DD')
    const endDate: string = val['beginDateTo'] === null || val['beginDateTo'] === undefined ? '' : moment(val['beginDateTo']).format('YYYY-MM-DD')
    if (compareDate(beginDate, endDate) === false) {
      const searchFormRefs = this.$refs['formgroup'] as any
      searchFormRefs.resetFields([decorator])
      this.errorModal(decorator, warn)
    }
  }
}
</script>

<style scoped>
#track >>> .ant-col-8{
  padding-left: 1.3% !important;
}
#track >>> .ant-col-5{
  padding-left: 0 !important;
}
</style>
