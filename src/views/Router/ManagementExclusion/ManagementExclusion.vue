<template>
  <div id="mangrmentExculusion">
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
      <operate-btn ref="operateBtn" :columns="columns" :BtnList="btnList" :plainOptions="plainOptions" @operateClick="operateClick" @userDefindConfirm="userDefindConfirm"  @beforeUpload="beforeUpload"></operate-btn>
    </div>
    <!-- table -->
    <div>
      <simple-table :columns="copyColumns" :propTotal="pagination.total" :data="data" ref="simpleTable" :border="border" :isAlphabet="isAlphabet" @handletablechange="tableChange" @selectedRows="onSelectChange" @selectedRowKeys="onSelectKeys"></simple-table>
    </div>
    <!-- add Modal -->
    <div class="add-model">
      <model
        title="Add Management of Exclusion"
        v-model="visible"
        width="1200px"
      >
        <template slot="model-body">
          <div id="exclusionAdd">
            <form-group :formoptions="addFormOptions" @selectChange="selectChange" ref="addForm" @monthPickerChange="addMonthPickerChange"></form-group>
          </div>
        </template>
        <template slot="model-footer">
          <a-row>
            <a-col :span="24" :style="{ textAlign: 'center' }">
              <a-button
                :style="{ marginLeft: '20px', minWidth: '100px', borderRadius: '50px' }"
                type="primary"
                @click="addRoute('add')"
              >Save</a-button>
              <a-button
                :style="{ marginLeft: '20px', minWidth: '100px', borderRadius: '50px' }"
                @click="Return('add')"
              >Return</a-button>
            </a-col>
          </a-row>
        </template>
      </model>
    </div>
    <!-- edit Modal -->
    <div class="edit-model">
      <model
        title="Edit Management of Exclusion"
        v-model="editVisible"
        width="1200px"
      >
        <template slot="model-body">
          <div id="exclusionEdit">
            <form-group :formoptions="editFormOptions" @selectChange="selectChange" ref="editForm" @monthPickerChange="editMonthPickerChange"></form-group>
          </div>
        </template>
        <template slot="model-footer">
          <a-row>
            <a-col :span="24" :style="{ textAlign: 'center' }">
              <a-button
                :style="{ marginLeft: '20px', minWidth: '100px', borderRadius: '50px' }"
                type="primary"
                @click="addRoute('edit')"
              >Save</a-button>
              <a-button
                :style="{ marginLeft: '20px', minWidth: '100px', borderRadius: '50px' }"
                @click="Return('edit')"
              >Return</a-button>
            </a-col>
          </a-row>
        </template>
      </model>
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
  exclusionBtn,
  IColumns,
  exclusionColumns,
  IFormoptions,
  exclusionFrom,
  commercialFrom,
  exclusionAddFrom,
  exclusionEditFrom,
  formOptionsUtil,
  initialValue,
  compareDate
} from "@/untils/router"
import {
  getFormoptions,
  postSearchResult,
  postComercialAdd,
  putComercialEdit
} from "@/api/router"
import { Status, Message, Pagination, IPagination } from "../index"
import { debounce } from "ts-debounce"
import axios from 'axios'
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
export default class MangrmentExculusion extends Vue {
  private form: any
  // 控制form隐藏显示
  private collapsed: boolean = false

  //OperateBtn 传值

  private btnList: IBtnList[] = exclusionBtn

  // 控制add modal
  private visible: boolean = false

  // edit modal
  private editVisible: boolean = false

  // 接收子组件table勾选过的值
  private selectedRows: any[] = []

  //标识哪个页面调用formGroup
  private identifying :any = {name:'exclusion',num:0}

  // user-defined 模态框可选数据
  private plainOptions: string[] = [
    "Route class",
    "Product",
    "Commercial trunk",
    "Account",
    "Status",
    "Begin date",
    "End date",
    "Remark",
    "Last update",
    "Staff"
  ];
  //private expand: boolean = false

  private columns: IColumns[] = exclusionColumns
  private copyColumns: IColumns[] = exclusionColumns
  private data: any = []
  private border: boolean = true

  // 存储初始化selectoptions的值，用于edit时映射
  private dataOptions: object = {
    routeClass: [],
    status: [
      {
        id:2,
        name:'active'
      },
      {
        id:3,
        name: 'invalid'
      }
    ],
    product: []
  }

  /**
   * 刷新，add edit等清除所选择的数据
   */
  private clearSelected() {
    let tableRef = this.$refs['simpleTable'] as any
    tableRef.clearSelected()
  }

  //是否显示字母表
  private isAlphabet: boolean = false

  // topFrom
  private topFromOptions: IFormoptions[] = exclusionFrom

  // add model formOptions
  private addFormOptions: IFormoptions[] = exclusionAddFrom

  // add model formOptions
  private editFormOptions: IFormoptions[] = exclusionEditFrom

  //分页
  private pagination: IPagination = Pagination

  //保存params
  private searchParams: any

  //保存values
  private values: any

  //保存deleteID
  private deleteParams :any

  // 存储确认取消modal过来的值，ok/cancel
  private okOrCancel: string = ''

   //保存导出Id
  private exportId:any

  //search submit
  private url: string = "/route/exclusion/query"
  private searchSubmit(err: any, values: any): void {
    this.values = values
    const params = {
      params: {
        routeClass: values.routeClass ? values.routeClass : "",
        product: values.product ? values.product : '',
        commercialTrunk: values.commercialTrunk ? values.commercialTrunk : "",
        account: values.account ? values.account : "",
        beginDate: values.beginDate===undefined ||values.beginDate.length === 0 ? '' : values.beginDate[0].format('YYYY-MM-DD'),
        beginDateTo: values.beginDate===undefined ||values.beginDate.length === 0 ? '' : values.beginDate[1].format('YYYY-MM-DD'),
        endDate: values.endDate===undefined ||values.endDate.length === 0 ? '' : values.endDate[0].format('YYYY-MM-DD'),
        endDateTo: values.endDate===undefined ||values.endDate.length === 0 ? '' : values.endDate[1].format('YYYY-MM-DD'),
        status: values.status ? values.status : "",
        remark: values.remark ? values.remark : ""
      },
      pageSize: this.pagination.pageSize,
      pageNum: this.pagination.pageNum
    };
    this.searchParams = params.params
    // TODO 点击search时的处理逻辑
    postSearchResult(params, this.url).then(res => {
        if (res.code === Status.Ok) {
          this._dataCleaning(res)
          this.clearSelected()
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
    if (eventType === "add") {
      this.visible = true
    }else if(eventType === "edit"){
      if(this.selectedRows.length !== 1){
        this.$message.warning(Message.AtLeast_One)
      }else{
        this.editFormOptions = initialValue(this.editFormOptions, this.selectedRows[0], this.dataOptions, '')
        this.editVisible = true
      }
    }else if(eventType === "delete"){
      if(this.selectedRows.length > 0) {
        this.delete()
      }else{
        this.$message.warning(Message.AtLeast_One)
      }
    } else if(eventType === 'export'){
        this.exportConfim()
    }
  }

  private beforeUpload(fileList: string[]): void {
    console.log(fileList.length)
    if (fileList.length > 0) {
      const title =  `Are you going to upload 1 file?`
      console.log(title)
      this.confirmModal("upload", title,{okText:'Proceed'} )
    }
  }


  private Return(type: string): void {
    if(type === 'add'){
      this.visible = !this.visible
    }else{
      this.editVisible = !this.editVisible
    }
  }

  /**
   * Form表单展开与收缩
   */
  public toggle() {
    //this.expand = !this.expand
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

    postSearchResult(
      {
        params: this.searchParams,
        pageSize: pagination.pageSize,
        pageNum: pagination.current
      },this.url).then(res => {
        this._dataCleaning(res)
      }).catch(error => {})
  }

    //form请求
  protected mounted() {
    getFormoptions({ id: 8 }).then(res => {
        if (res.code === Status.Ok) {
          const data = res.data; // TODO searchOptions
          this.topFromOptions = formOptionsUtil(this.topFromOptions, data)
          this.addFormOptions = formOptionsUtil(this.addFormOptions, data)
          this.editFormOptions = formOptionsUtil(this.editFormOptions, data)
          this.dataOptions = Object.assign(this.dataOptions, data)
        } else {
          this.$message.error(Message.Unknown)
        }
      })
      .catch(error => {
        this.$message.error(Message.Unknown)
      })
  }


  //add弹框  点击save
  private addUrl: string = "/route/exclusion/add"
  private addSave () {
    const addForm = this.$refs['addForm'] as any
    const formVal = addForm.getFieldsValue()
    formVal.beginDate = moment(formVal.beginDate).format('YYYY-MM-DD')
    formVal.endDate = moment(formVal.endDate).format('YYYY-MM-DD')
    console.log(formVal)
    postComercialAdd(
      {
        routeClass: formVal.routeClass ? formVal.routeClass : "",
        product: formVal.product ? formVal.product : '',
        commercialTrunk: formVal.commercialTrunk ? formVal.commercialTrunk : "",
        status: formVal.status,
        beginDate: formVal.beginDate,
        endDate: formVal.endDate,
        remark: formVal.remark ? formVal.remark : ""

      },this.addUrl).then(res => {
        // TODO
        if(res.code === Status.Ok){
          this.visible = false
          let dataList = [res.data]
          this.data = dataList
        }
      }).catch(error => {})


  }

  //edit弹框  点击save
  private editUrl: string = "/route/exclusion/update"
  private editSave () {
    const addForm = this.$refs['editForm'] as any
    const formVal = addForm.getFieldsValue()
    formVal.beginDate = moment(formVal.beginDate).format('YYYY-MM-DD')
    formVal.endDate = moment(formVal.endDate).format('YYYY-MM-DD')
    console.log(formVal)
    putComercialEdit(
      {
        id:this.selectedRows[0].id,
        routeClass: formVal.routeClass ? formVal.routeClass : "",
        product: formVal.product ? formVal.product : '',
        commercialTrunk: formVal.commercialTrunk ? formVal.commercialTrunk : "",
        status: formVal.status,
        beginDate: formVal.beginDate,
        endDate: formVal.endDate,
        remark: formVal.remark ? formVal.remark : ""

      },this.editUrl).then(res => {
        // TODO
        if(res.code === Status.Ok){
          this.editVisible = false
          let dataList = [res.data]
          this.data = dataList
        }
      }).catch(error => {})


  }

  //接收子组件传递过来的参数
  private onSelectKeys(keys) {
    this.deleteParams = keys
    this.exportId = keys
  }

  //删除
  public delete() {
    this.confirmModal('delete')
  }

  private deleteRequest() {
    const url = "/route/exclusion/del"
    postSearchResult(this.deleteParams,url).
    then(res => {
        // TODO
        if(res.code === Status.Ok){
          this.$message.info('deleted successfully')
          this.searchSubmit('',this.values)
          this.clearSelected()
        }
      }).catch(error => {})
  }

  /**
   * add edit相关操作
   */
  private addRoute(type: string): void {
    let formrefs: any = (type === 'edit') ? this.$refs['editForm'] as any :  this.$refs['addForm'] as any
    console.log(formrefs)
    const values = formrefs.getFieldsValue()
    const validateValues = formrefs.validateFields()
    console.log(validateValues)
    if (validateValues) {
       this.confirmModal(type)
    }
  }

  private exportConfim(){
    this.confirmModal('export')
  }

  //导出
  private export(){
    let ref:any = this.$refs['formgroup'] as any
    let values:any = ref.getFieldsValue()
    let exparams:any = {
      params:{
          routeClass: values.routeClass ? values.routeClass : "",
          product: values.product ? values.product : "",
          account: values.account ? values.account : "",
          status: values.status ? values.status : "",
          beginDate: values.beginDate ? moment(values.beginDate).format('YYYY-MM-DD') : "",
          beginDateTo: values.beginDateTo ? moment(values.beginDateTo).format('YYYY-MM-DD') : "",
          endDate: values.endDate ? moment(values.endDate).format('YYYY-MM-DD') : "",
          endDateTo: values.endDateTo ? moment(values.endDateTo).format('YYYY-MM-DD') : "",
          commercialTrunk: values.commercialTrunk ? values.commercialTrunk : ""
      }
    }
    axios({
      url:'/route/exclusion/export',
      data:exparams,
      method:'post',
      responseType: 'blob',
      }).then((data)=>{
        const url = window.URL.createObjectURL(data.data)
        const a = document.createElement('a')
        const filename = decodeURI(data.headers['content-disposition'].split(';')[1].split('=')[1])
        a.href = url
        a.download = (data.data, filename)
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
    })
  }

   //确定取消modal
   private modalOk(eventType: string): void {
    this.okOrCancel = eventType
    if (eventType === 'edit') {
      this.editSave()
      this.clearSelected()
    } else if (eventType === 'add') {
      this.addSave()
      this.clearSelected()
    }else if(eventType === 'delete') {
      this.deleteRequest()
    }else if(eventType === 'export'){
      this.export()
    } else if(eventType === 'upload') {
      const uploadUrl = `/route/exclusion/import`
      const operateRefs = this.$refs['operateBtn'] as any
      const data = operateRefs.handleUpload()
      postComercialAdd(data,uploadUrl).then((res) => {
        if (res.code === Status.Ok) {
          this.data = res.data
          this.clearSelected()
          this.pagination.total = 0
        } else {
          this.$message.error(res.msg)
         }
       })
    }

  }

  private modalCancel(message: string): void {
    console.log(message)
     this.okOrCancel = message
  }
  private confirmModal(eventType: string, title: string = Message.Confirm_Title, args: object = {}): void {
    const confirmref = this.$refs['confirmModal'] as any
    let title1 = ''
    if(eventType === 'add'){
      title1 = Message.Confirm_Add
    }else if(eventType === 'edit'){
      title1 = Message.Confirm_Edit
    }else if(eventType === 'delete'){
      title1 = Message.Confirm_Delete
    }else if(eventType === 'export'){
      title1 = Message.Confirm_Export
    } else {
      title1 = title
    }
    confirmref.showConfirm(eventType,{title: title1, ...args})

  }

  public selectChange(val, name) {
    console.log(val)
    console.log(name)
  }

   private errorModal(title: string, content: string) {
    this.$error({title, content})
  }

  private searchMonthPicherChange(e, val, decorator) {
    const searchFormRefs = this.$refs['formgroup'] as any
    let warn: string = ''
    console.log(val)
    if(decorator === 'beginDate' || decorator === 'endDate') {
      warn = '开始时间不能大于结束时间'
    } else {
      warn = '结束时间不能小于开始时间'
    }
    if (decorator === 'beginDate' || decorator === 'beginDateTo') {
      const beginDate: string = val['beginDate'] === undefined || val['beginDate'] === null ? '' : moment(val['beginDate']).format('YYYY-MM-DD')
      const beginDateTo: string = val['beginDateTo'] === undefined || val['beginDateTo'] === null ? '' : moment(val['beginDateTo']).format('YYYY-MM-DD')
      if (compareDate(beginDate, beginDateTo) === false) {
        searchFormRefs.resetFields([decorator])
        this.errorModal(decorator, warn)
      }
    } else if(decorator === 'endDate' || decorator === 'endDateTo') {
      const endDate: string =  val['endDate'] === undefined || val['endDate'] === null ? '' : moment(val['endDate']).format('YYYY-MM-DD')
      const endDateTo: string   = val['endDateTo'] === undefined || val['endDateTo'] === null ? '' : moment(val['endDateTo']).format('YYYY-MM-DD')
      if (compareDate(endDate, endDateTo) === false) {
        searchFormRefs.resetFields([decorator])
        this.errorModal(decorator, warn)
      }
    }

  }

   private addMonthPickerChange(e, val, decorator) {
    const warn: string = decorator === 'beginDate' ? '开始时间不能大于结束时间' : '结束时间不能小于开始时间'
    const beginDate: string = val['beginDate'] === null || val['beginDate'] === undefined ? '' : moment(val['beginDate']).format('YYYY-MM-DD')
    const endDate: string = val['endDate'] === null || val['endDate'] === undefined ? '' : moment(val['endDate']).format('YYYY-MM-DD')
    if (compareDate(beginDate, endDate) === false) {
      const addFormRefs = this.$refs['addForm'] as any
      addFormRefs.resetFields([decorator])
      this.errorModal(decorator, warn)
    }
  }

  private editMonthPickerChange(e, val, decorator) {
    const warn: string = decorator === 'beginDate' ? '开始时间不能大于结束时间' : '结束时间不能小于开始时间'
    const beginDate: string = val['beginDate'] === null || val['beginDate'] === undefined ? '' : moment(val['beginDate']).format('YYYY-MM-DD')
    const endDate: string = val['endDate'] === null || val['endDate'] === undefined ? '' : moment(val['endDate']).format('YYYY-MM-DD')
    if (compareDate(beginDate, endDate) === false) {
      const editFormRefs = this.$refs['editForm'] as any
      editFormRefs.resetFields([decorator])
      this.errorModal(decorator, warn)
    }
  }
}
</script>

<style scoped>
#mangrmentExculusion >>> .ant-col-8{
  padding-left: 3% !important;
}
#mangrmentExculusion >>> .ant-col-12{
  padding-left: 6% !important;
}
#mangrmentExculusion >>> .ant-col-5{
  padding-left: 4px !important;
}
#exclusionAdd >>> .ant-col-20{
  padding-left: 1.8%;
}
#exclusionEdit >>> .ant-col-20{
  padding-left: 1.8%;
}
</style>
