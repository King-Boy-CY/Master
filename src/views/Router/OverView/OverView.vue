<template>
  <div id="overView">
    <fold-container>
      <template slot="formgroup">
        <form-group ref="formgroup" :formoptions="searchOptions" @Submit="searchSubmit"  @monthPickerChange="searchMonthPicherChange">
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

    <div>
      <operate-btn
        :columns="columns"
        :BtnList="btnList"
        :plainOptions="plainOptions"
        @operateClick="operateClick"
        @userDefindConfirm="userDefindConfirm"
      ></operate-btn>
    </div>
    <!-- table -->
    <div>
      <simple-table
        :columns="copyColumns"
        :data="data"
        :propTotal="pagination.total"
        :border="border"
        :isAlphabet="isAlphabet"
        @handletablechange="tableChange"
        @toggleLetter="toggleLetter"
        @selectedRows="onSelectChange"
        ref="simpleTable"
        @selectedRowKeys="onSelectKeys"
      ></simple-table>
    </div>
    <!-- add Modal -->
    <div class="add-model">
      <model
        title="Add Commercial route guide suggestion"
        v-model="visible"
        width="1200px"
      >
        <template slot="model-body">
          <div id="addCommercial">
            <form-group :formoptions="formOptions" @selectChange="selectChange" ref="addForm" @monthPickerChange="addMonthPickerChange"></form-group>
          </div>
        </template>
        <template slot="model-footer">
          <a-row>
            <a-col :span="24" :style="{ textAlign: 'center' }">
              <a-button
                :style="{ marginLeft: '20px', minWidth: '100px', borderRadius: '50px' }"
                type="primary"
                @click="addRoute"
              >Save</a-button>
              <a-button
                :style="{ marginLeft: '20px', minWidth: '100px', borderRadius: '50px' }"
                @click="Return"
              >Return</a-button>
              <a-button
                :style="{ marginLeft: '20px', minWidth: '100px', borderRadius: '50px' }"
                @click="addEditRoute"
                :disabled="disabled"
              >Edit route</a-button>
              <a-button
                :style="{ marginLeft: '20px', minWidth: '100px', borderRadius: '50px' }"
                @click="showBenchmark"
                :disabled="disabled"
              >Show Benchmark and constraint</a-button>
            </a-col>
          </a-row>
        </template>
      </model>
    </div>
    <div>
      <edit-route :parentParams="editRouteParams" :isEditRoute="isEditRoute" @modalVis="modalVis" @exitWithout="exitWithout" @changeSubmit="changeSubmit" @editRouteData="editRouteData"></edit-route>
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
import { Mutation,Getter } from 'vuex-class'
import {
  IBtnList,
  btnList,
  IColumns,
  columns,
  IFormoptions,
  searchOptions,
  overviewAddForm,
  formOptionsUtil,
  setBtnDisabled,
  formatDate,
  getCommercialTrunk,
  compareDate,
  agoDate,
  getDate
} from "@/untils/router"
import {
  getFormoptions,
  postSearchResult,
  postComercialAdd
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
    EditRoute: () => import("@/components/router/EditRoute.vue"),
    ConfirmModal: () => import('@/components/router/ConfirmModal.vue')
  }
})
export default class OverView extends Vue {
  @Getter('commercialdataList') getterCommercialdata
  @Getter('route') getterRoute
  @Mutation('setEditRoutData') setEditRoute
  @Mutation('setCommercialData') mutationCommercialData
  @Mutation('setRoute') mutationRoute

  private form: any
  // 控制form隐藏显示
  private collapsed: boolean = false

  //OperateBtn 传值

  private btnList: IBtnList[] = btnList

  // 控制add modal
  private visible: boolean = false

  //是否显示字母表
  private isAlphabet: boolean = true

  //是否显示editroute
  private isEditRoute :boolean = false

  // 保存切换字母的值，默认为All
  private letter: string = "All"

  // 接收子组件table勾选过的值
  private selectedRows: any[] = []

   // 点击ok后把editRouteSace 赋值给editRouteCopy
  private editRouteCopy: any[] = []

  // 父组件参数用于edit route 搜索使用
  private editRouteParams: object = {
    routeClass:'',
    product: '',
    beginDate: '',
    endDate: '',
    id: '',
    remark: ''

  }

  // user-defined 模态框可选数据
  private plainOptions: string[] = [
    "Product",
    "Service",
    "Country",
    "Currency",
    "Route class",
    "Begin date",
    "Mou",
    "ASR",
    "Margin",
    "Current cost",
    "Plan Cost",
    "Floor selling price",
    "Inclusion",
    "Route1",
    "Route2",
    "Route3",
    "Route4",
    "Route5",
    "Route6",
    "Route7",
    "Route8",
    "Route9",
    "Route10"
  ]
  //private expand: boolean = false

  private columns: IColumns[] = columns
  private copyColumns: IColumns[] = columns
  private data: any = []
  private border: boolean = true

  private searchOptions: IFormoptions[] = searchOptions

  // add model formOptions
  private formOptions: IFormoptions[] = overviewAddForm

  //分页
  private pagination: IPagination = Pagination

  //保存params
  private searchParams: any

   // edit route 按钮是否可以点击
  private disabled: boolean = true

  // //保存editroute弹出层params
  // private editRouteParams: any

  // edit route 更改后点击submit change 保存下来数据
  private editRouteSave:  any= []

  // 存储确认取消modal过来的值，ok/cancel
  private okOrCancel: string = ''

   // 保存add edit的值
  private modifyValues: object = []

  //保存导出Id
  private exportId:any

  //保存from参数
  private values:any

  //保存editroute数据
  private editRouteList: any

   /**
   * 刷新，add edit等清除所选择的数据
   */
  private clearSelected() {
    let tableRef = this.$refs['simpleTable'] as any
    tableRef.clearSelected()
  }

  //search submit
  private url: string = "/route/oc-routing/search"
  private addUrl: string = "/route/commercial-routing/add"
  private searchSubmit(err: any, values: any): void {
    console.log(values)
    this.values = values
    const params = {
      params: {
        product: values.product ? values.product : "",
        service: values.service ? values.service : "",
        country: values.country ? values.country : "",
        currency: values.currency ? values.currency : "",
        trafficDate: values.trafficDate === undefined|| values.trafficDate.length === 0 ? '' : values.trafficDate[0].format('YYYY-MM-DD'),
        trafficDateTo: values.trafficDate === undefined|| values.trafficDate.length === 0 ? '' : values.trafficDate[1].format('YYYY-MM-DD')
      },
      letter: this.letter,
      pageSize: this.pagination.pageSize,
      pageNum: this.pagination.pageNum,
      sortField: this.pagination.sortField,
      sortOrder: this.pagination.sortOrder
    };
    this.searchParams = params.params
    // TODO 点击search时的处理逻辑
    if (
      this.searchParams.currency != "" &&
      this.searchParams.trafficDate != "" &&
      this.searchParams.trafficDateTo != ""
    ) {
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
  }

  private _dataCleaning(data) {
    const pagination = { ...this.pagination }
    pagination.total = data.data.total
    this.data = data.data.list
    this.pagination = pagination
  }

  //接收子组件传递过来的参数
  private onSelectKeys(keys) {
    this.exportId = keys
  }

  /**
   * 子组件table勾选change时触发
   * @Params selectedRows 勾选的行
   */
  private onSelectChange(selectedRows: any[]): void {
    const oneSelected: string[] = ['edit', 'details', 'viewCommercial', 'reject', 'approve', 'commercialApprove', 'export']
    const multipleSelected: string[] = ['reject', 'approve', 'commercialApprove', 'export']
    if (selectedRows.length !== 0 && selectedRows.length === 1) {
      this.btnList = setBtnDisabled(this.btnList, false, oneSelected)
    } else if (selectedRows.length > 1) {
      this.btnList = setBtnDisabled(this.btnList, true, oneSelected)
      this.btnList = setBtnDisabled(this.btnList, false, multipleSelected)
    } else {
      this.btnList = setBtnDisabled(this.btnList, true, oneSelected)
    }
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
      // add 弹出时限制edit route点击
      this.$nextTick(() => {
        const addFormGroup = this.$refs['addForm'] as any
        addFormGroup. setFieldsValue({routeClass:'',product: ''})
        const fieldsValues = addFormGroup.getFieldsValue()
        let testTrue: boolean = fieldsValues['product'] && fieldsValues['beginDate'] && fieldsValues['endDate']
        if (testTrue) {
          this.disabled = false
          this.editRouteParams['product'] = fieldsValues['product']
          this.editRouteParams['routeClass'] = fieldsValues['routeClass']
          this.editRouteParams['beginDate'] = moment(fieldsValues['beginDate']).format('YYYY-MM-DD')
          this.editRouteParams['endDate'] = moment(fieldsValues['endDate']).format('YYYY-MM-DD')
        } else {
          this.disabled = true
        }
      })
    }else if(eventType === 'ViewDetail'){
      if(this.selectedRows.length === 1) {
        this.$router.push({ name: 'CommercialTrunk', query: { 'data': this.selectedRows[0].id }})
      }else{
        this.$message.warning(Message.AtLeast_One)
      }
    }else if(eventType === 'ViewOrder'){
      if(this.selectedRows.length === 1) {
        this.$router.push({ name: 'TechnicaTrunk', query: { 'data': this.selectedRows[0]}})
      }else{
        this.$message.warning(Message.AtLeast_One)
      }
    }else if(eventType === 'export'){
        this.exportConfim()
    }
  }
  private Return(): void {
    this.visible = !this.visible
    this.setEditRoute([])
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

  private errorModal(title: string, content: string) {
    this.$error({title, content})
  }

  private searchMonthPicherChange(e, val, decorator) {
    const warn: string = decorator === 'trafficDate' ? '开始时间不能大于结束时间' : '结束时间不能小于开始时间'
    const beginDate: string = val['trafficDate'] === null || val['trafficDate'] === undefined ? '' : moment(val['trafficDate']).format('YYYY-MM-DD')
    const endDate: string = val['trafficDateTo'] === null || val['trafficDateTo'] === undefined ? '' : moment(val['trafficDateTo']).format('YYYY-MM-DD')
    if (compareDate(beginDate, endDate) === false) {
      const searchFormRefs = this.$refs['formgroup'] as any
      searchFormRefs.resetFields([decorator])
      this.errorModal(decorator, warn)
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
    let testTrue: boolean = false
    if(e !== null) {
      if(val['product'] !== '' && val['routeClass']!== '' && val['beginDate'] !== 'null' &&  val['beginDate'] !== null) {
        testTrue = true
      } else {
        testTrue = false
      }
      console.log(testTrue)
    } else {
      testTrue = false
    }

    if (testTrue) {
      this.disabled = false
      this.editRouteParams['product'] = val['product']
      this.editRouteParams['routeClass'] = val['routeClass']
      this.editRouteParams['beginDate'] = moment(val['beginDate']).format('YYYY-MM-DD')
      this.editRouteParams['endDate'] = moment(val['endDate']).format('YYYY-MM-DD')
    } else {
      this.disabled = true
    }

  }

  /**
   * 切换字母表，接受子组件传过来的参数
   */
  private toggleLetter(letter: string, index: number): void {
    console.log(this.pagination.sortField)
    console.log(this.pagination.sortOrder)
    this.letter = letter
    postSearchResult(
      {
        params: this.searchParams,
        letter: letter,
        pageSize: this.pagination.pageSize,
        pageNum: 1,
        sortField: this.pagination.sortField ? this.pagination.sortField : "",
        sortOrder: this.pagination.sortOrder ? this.pagination.sortOrder : ""
      },this.url).then(res => {
        // TODO
        if (res.code === Status.Ok) {
            this._dataCleaning(res)
          }else{
          this._dataCleaning(res)
          this.$message.error(res.msg)
        }
      }).catch(error => {})
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

  public selectChange(val, name) {
    let testTrue = val['product'] && val['routeClass'] && val['beginDate'] && val['endDate']
    if (testTrue) {
      this.disabled = false
      this.editRouteParams['product'] = val['product']
      this.editRouteParams['routeClass'] = val['routeClass']
      this.editRouteParams['beginDate'] = moment(val['beginDate']).format('YYYY-MM-DD')
      this.editRouteParams['endDate'] = moment(val['endDate']).format('YYYY-MM-DD')
    } else {
      this.disabled = true
    }
  }

  //form请求
  protected mounted() {
     const commercialdata = this.getterCommercialdata
    if(this.getterRoute === 'overview') {
       this.visible = commercialdata.visible
      this.data = commercialdata.data
      this.searchOptions = commercialdata.topFromOptions
      this.formOptions = commercialdata.addFormOptions
      this.selectedRows = commercialdata.selectedRows
      this.pagination = commercialdata.pagination
      this.disabled = commercialdata.disabled
      this.editRouteParams = commercialdata.editRouteParams
      console.log(commercialdata.addFormOptions)
      this.mutationRoute('')
      this.mutationCommercialData({})
    } else {
      getFormoptions({ id: 2 }).then(res => {
        if (res.code === Status.Ok) {
          const data = res.data; // TODO searchOptions
          this.searchOptions = formOptionsUtil(this.searchOptions, data)
          this.formOptions = formOptionsUtil(this.formOptions, data)
        } else {
          this.$message.error(Message.Unknown)
        }
      })
      .catch(error => {
        console.log(error)
      })
    }

  }

    //接收editroute数据
  private editRouteData(data) {
    this.editRouteList = data
  }

  //add弹框  点击save
  private addSave (params) {
    if(this.editRouteList === undefined){
      this.addPost(params)
    }else{
      for(let i=0;i<this.editRouteList.length;i++){
        for(let j=0;j<params.commercialTrunk.length;j++){
          if(this.editRouteList[i].commercialTrunk === params.commercialTrunk[j].commercialTrunk){
            params.commercialTrunk[j].id = this.editRouteList[i].id
            this.addPost(params)
          }
        }
      }
    }
  }

  private addPost(params){
    postComercialAdd(params).then(res => {
      if (res.code === Status.Ok) {
        this.$message.info('saved successfully')
        this.visible = false
        const data = [res.data]
        this.setEditRoute([])
        this.$router.push({ name: 'Commercial', params: { addData: encodeURIComponent(JSON.stringify([res.data]))}})
      }
    })
  }

  private addRoute() {
    const formrefs = this.$refs['addForm'] as any
    const validateValues = formrefs.validateFields()
    if (validateValues) {
      this.modifyValues =  formatDate(validateValues)
      const title =  Message.Confirm_Add
      this.confirmModal('add',title)
    }

  }
   private _setOptions(formOptions: any, values: any): any {
    formOptions.forEach((item) => {
      for (const key in values) {
        if (item.decorator === key) {
          if(item.hasOwnProperty('initIalValue')) {
             item.initIalValue = values[key] === undefined ? '' : values[key]
          } else {
            item.initialValue = values[key] === undefined ? '' : values[key]
          }

        }
      }
    })
    return formOptions
  }
  private showBenchmark(){

    const topFormRefs = this.$refs['formgroup'] as any
    const addFormRefs = this.$refs['addForm'] as any

    let addValues = {}


    const topValues = topFormRefs.getFieldsValue()
    if(addFormRefs){
      addValues = addFormRefs.getFieldsValue()
    }
    let topForm = this._setOptions(this.searchOptions,topValues)
    let addForm = Object.keys(addValues).length !== 0 ? this._setOptions(this.formOptions,addValues) : this.formOptions



    let commercialData = {
      from:'commercial',
      data: this.data,
      topFromOptions: topForm,
      addFormOptions: addForm,
      selectedRows: this.selectedRows,
      visible: this.visible,
      disabled: this.disabled,
      pagination: this.pagination,
      editRouteParams: this.editRouteParams
    }

    this.mutationCommercialData(commercialData)



    const formrefs = this.$refs['addForm'] as any
    const validateValues = formrefs.validateFields()
    console.log(validateValues)
    validateValues.beginDate = validateValues.beginDate.format('YYYY-MM-DD')
    validateValues.endDate = validateValues.endDate.format('YYYY-MM-DD')
    this.$router.push({ name: 'ShowBenchmark', query: validateValues})
    // if (validateValues) {
    //   this.modifyValues =  formatDate(validateValues)
    //   const title =  Message.Confirm_Add
    //   this.confirmModal('add',title)
    // }
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
          product: values.product ? values.product : "",
          service: values.service ? values.service : "",
          country: values.country ? values.country : "",
          currency: values.currency ? values.currency : "",
          trafficDate: values.trafficDate === undefined|| values.trafficDate.length === 0 ? '' : values.trafficDate[0].format('YYYY-MM-DD'),
          trafficDateTo: values.trafficDate === undefined|| values.trafficDate.length === 0 ? '' : values.trafficDate[1].format('YYYY-MM-DD')
      }
    }
    axios({
        url:'/route/oc-routing/export',
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


  private addEditRoute() {
    console.log(111112223)
    this.isEditRoute = true
  }
  //子组件点击右上角X  返回参数
  private modalVis(data) {
    this.isEditRoute = data
  }
  //子组件点击exit返回参数
  private exitWithout(exitWithout) {
    this.confirmModal('editRouteReturn',  Message.Give_Up, {okText:'YES',cancelText:'NO'})

  }

  //接收子组件sunmit参数
  private changeSubmit(data){
    this.editRouteSave = data
    this.confirmModal('editRoute', Message.Submit_Change)
  }


  //确定取消modal

  private modalOk(eventType: string): void {
    if (eventType === 'add') {
      this.modifyValues['status'] = 5
      let commercialTrunk: any[] = getCommercialTrunk(this.editRouteCopy)
      this.addSave(Object.assign(this.modifyValues, { commercialTrunk}))
    } else if (eventType ==='editRoute') {
      console.log(eventType)
      this.editRouteCopy = this.editRouteSave
      this.$message.info('saved successfully')
      this.isEditRoute = false
    } else if (eventType === 'addReturn') {
      this.visible = !this.visible
    }else if(eventType === 'export'){
      this.export()
    } else if (eventType === 'editRouteReturn') {
      this.isEditRoute = false
      this.setEditRoute([])
    }


    // this.modifyValues['status'] = 5
    //   let commercialTrunk: any[] = getCommercialTrunk(this.editRouteCopy)
    //   this.addSave(Object.assign(this.modifyValues, { commercialTrunk}))
    // this.clearSelected()

  }

  private modalCancel(message: string): void {
    console.log(message)
     this.okOrCancel = message
  }
  private confirmModal(eventType: string, title: string = Message.Confirm_Title, args: object = {}): void {
    console.log(eventType)
    if(eventType === 'add'){
      title = Message.Confirm_Add
    }else if(eventType === 'export'){
      title = Message.Confirm_Export
    }
    // confirmref.showConfirm(eventType,{title : title})
    const confirmref = this.$refs['confirmModal'] as any
    confirmref.showConfirm(eventType, { title: title, ...args })
  }
}
</script>

<style scoped>
#overView >>> .ant-col-10 {
  padding-right: 5.9%;
  padding-left: 2.6%;
}
#overView >>> .ant-col-8 {
  padding-left: 1.3%;
}
#overView >>> .ant-col-5 {
  padding-left: 0;
}
#addCommercial >>> .ant-col-11 {
  padding-right: 10%;
  padding-left: 2.6%;
}
#addCommercial >>> .ant-col-22 {
  padding-left: 2.7%;
}
</style>
