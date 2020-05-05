<template>
  <div id="managementTechnical">
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
      <operate-btn :columns="columns" :BtnList="btnList" :plainOptions="plainOptions" @operateClick="operateClick" @userDefindConfirm="userDefindConfirm">></operate-btn>
    </div>
    <!-- table -->
    <div>
      <simple-table :columns="copyColumns" :propTotal="pagination.total" :data="data" :border="border" :isAlphabet="isAlphabet" @selectedRowKeys="onSelectedRowKeys" ref="simpleTable" @handletablechange="tableChange" @selectedRows="onSelectChange"></simple-table>
    </div>
    <!-- 确定取消modal -->
    <div>
      <confirm-modal ref="confirmModal" @ok="modalOk" @cancel="modalCancel"></confirm-modal>
    </div>

  </div>
</template>
<script lang="ts">
import Vue from "vue"
import moment from "moment"
import { Component } from "vue-property-decorator"
import {
  IBtnList,
  technicalBtn,
  IColumns,
  technicalColumns,
  IFormoptions,
  technicalFrom,
  formOptionsUtil,
  initialValue,
  technicalPass,
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
    FormGroup: () => import("@/components/router/FormGroup.vue"),
    ConfirmModal: () => import('@/components/router/ConfirmModal.vue')
  }
})
export default class ManagementTechnical extends Vue {
  private form: any
  // 控制form隐藏显示
  private collapsed: boolean = false

  //OperateBtn 传值

  private btnList: IBtnList[] = technicalBtn

  // 控制add modal
  private visible: boolean = false

  // 接收子组件table勾选过的值
  private selectedRows: any[] = []

  //标识哪个页面调用formGroup
  private identifying :any = {name:'technical',num:0}
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
    "Last update",
    "Staff"
  ]
  //private expand: boolean = false

  private columns: IColumns[] = technicalColumns
  private copyColumns: IColumns[] = technicalColumns
  private data: any = []
  private border: boolean = true

  /**
   * 刷新，add edit等清除所选择的数据
   */
  private clearSelected() {
    let tableRef = this.$refs['simpleTable'] as any
    tableRef.clearSelected()
  }

  // 存储初始化selectoptions的值，用于edit时映射
  private dataOptions: object = {
    product:[],
    routeClass:[],
    status:[]
  }

  // 存储确认取消modal过来的值，ok/cancel
  private okOrCancel: string = ''

  //是否显示字母表
  private isAlphabet:boolean = false

  // topFrom
  private topFromOptions: IFormoptions[] = technicalFrom

  //分页
  private pagination: IPagination = Pagination

  //保存params
  private searchParams: any

  //保存上一页带过来的参数
  private jumpParams:any

  //保存修改status状态
  private statusId:number = 0

  //保存勾选ID
  private selectedId: number[] = []

  //保存values
  private values: any

  //search submit
  private url: string = "/route/order/orders"
  private searchSubmit(err: any, values: any): void {
    this.values = values
    const params = {
      params: {
        routeClass: values.routeClass ? values.routeClass : "",
        product: values.product ? values.product : '',
        status: values.status ? values.status : "",
        beginDate: values.beginDate===undefined ||values.beginDate.length === 0 ? '' : values.beginDate[0].format('YYYY-MM-DD'),
        beginDateTo: values.beginDate===undefined ||values.beginDate.length === 0 ? '' : values.beginDate[1].format('YYYY-MM-DD'),
        transactionId: values.transactionId ? values.transactionId : ""
      },
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
          this.clearSelected()
          this.selectedRows = []
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
   *table 勾选的id
   */
  private onSelectedRowKeys(rowKeys: number[]): void {
    this.selectedId = rowKeys
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
    console.log(this.selectedRows)
    if (eventType === "ViewEditTechnical") {
      if(this.selectedRows.length === 1) {
        this.$router.push({ name: 'TechnicaTrunk', query: { 'data': this.selectedRows[0] }})
      }else{
        this.$message.warning(Message.AtLeast_One)
      }
    }else if(eventType === "ViewEditSwitch") {
      if(this.selectedRows.length === 1) {
        this.$router.push({ name: 'SwitchConfiguration', query: { 'data': this.selectedRows[0].transactionId }})
      }else{
        this.$message.warning(Message.AtLeast_One)
      }
    }else if(eventType === "TechnicalAccept"){
      if(this.selectedRows.length === 0) {
        this.$message.warning('Please select multiple data')
      }else{
        this.statusId = 1
        this.technicalAccept()
      }
    }else if(eventType === "TechnicalReject"){
      if(this.selectedRows.length === 0) {
        this.$message.warning('Please select multiple data')
      }else{
        this.statusId = 2
        this.technicalReject()
      }
    }
  }

  private technicalAccept(){
    const dataList = this.selectedRows
    let statusList:any = []
    const confirmref = this.$refs['confirmModal'] as any
    for(let i=0;i<dataList.length;i++){
      statusList.push(dataList[i].status)
    }
    if(statusList.indexOf('T-accepted') != -1){
      this.$error({
        title: 'This is an error message',
        content: 'Please select state not T-accepted',
      })
    }else{
      confirmref.showConfirm('accept',{title : 'Are you going to TechnicalAccept ' +dataList.length+ ' records?This technical order will be sent to Network Implementation for translation into MML',okText:'Proceed'})
    }
  }


  private technicalReject() {
    // debugger
    console.log(this.selectedRows)
    const dataList = this.selectedRows
    let statusList:any = []
    const confirmref = this.$refs['confirmModal'] as any
    for(let i=0;i<dataList.length;i++){
      statusList.push(dataList[i].status)
    }
    console.log(statusList)
    if(statusList.indexOf('T-rejected') != -1 || statusList.indexOf('T-accepted') != -1){
      this.$error({
        title: 'This is an error message',
        content: 'Please select state not T-rejected and T-accepted',
      })
      this.clearSelected()
      this.selectedRows = []
    }else{
      confirmref.showConfirm('accept',{title : 'Are you going to TechnicalReject' +dataList.length+ 'records?This technical order will be sent to Network Implementation for translation into MML',okText:'Proceed'})
    }
  }
  //确定取消modal

  private modalOk(eventType: string): void {
    if(this.statusId === 1){
      this.getTechnicalAccept()
    }else if(this.statusId === 2){
      this.getTechnicalReject()
    }

    this.clearSelected()
    this.selectedRows = []

  }
  ////修改accep 请求
  private getTechnicalAccept() {
    let url="/route/order/update/accepted"
    postSearchResult(this.selectedId, url).then(res => {
        if (res.code === Status.Ok) {
          this.$message.info(res.msg)
          this.searchSubmit('',this.values)
          this.clearSelected()
          this.selectedRows = []
        }
      }).catch(error => {
        this.$message.error(Message.Net_anomaly)
      })
  }
  //修改reject 请求
  // private rejectUrl = ''
  private getTechnicalReject() {
    let url="/route/order/update/reject"
    postSearchResult(this.selectedId, url).then(res => {
        if (res.code === Status.Ok) {
          this.$message.info(res.msg)
          this.searchSubmit('',this.values)
          this.clearSelected()
          this.selectedRows = []
        }
      }).catch(error => {
        this.$message.error(Message.Net_anomaly)
      })
  }


  private modalCancel(message: string): void {
    console.log(message)
     this.okOrCancel = message
     this.clearSelected()
     this.selectedRows = []
  }
  private confirmModal(eventType: string): void {
    const confirmref = this.$refs['confirmModal'] as any
    confirmref.showConfirm(eventType,{title : Message.Confirm_Title})

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
    getFormoptions({ id: 12 }).then(res => {
        if (res.code === Status.Ok) {
          const data = res.data; // TODO searchOptions
          this.topFromOptions = formOptionsUtil(this.topFromOptions, data)
          this.withParameters(this.topFromOptions)
        } else {
          this.$message.error(Message.Unknown)
        }
      })
      .catch(error => {
        this.$message.error(Message.Unknown)
      })


  }

  //如果从其他页面跳转过来赋值
  private withParameters(data){
    console.log(this.$route.query.data)
    if(this.$route.query.data){
      this.jumpParams = this.$route.query.data
      this.topFromOptions = technicalPass(data, this.jumpParams)
    }else{
      for(let i=0;i<this.topFromOptions.length;i++){
        if(this.topFromOptions[i].hasOwnProperty('options')){
          if(this.topFromOptions[i].decorator === 'status'){
            this.topFromOptions[i].initIalValue = [7,17]
          }else{
            this.topFromOptions[i].initIalValue = ''
          }
        }else{
          this.topFromOptions[i].initialValue = ''
        }
      }
      // this.topFromOptions =
    }

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
      const addFormRefs = this.$refs['formgroup'] as any
      addFormRefs.resetFields([decorator])
      this.errorModal(decorator, warn)
    }
  }
}
</script>

<style scoped>
#managementTechnical >>> .ant-col-8{
  padding-left: 1.3% !important;
}
#managementTechnical >>> .ant-col-5{
  padding-left: 4px !important;
}
</style>
