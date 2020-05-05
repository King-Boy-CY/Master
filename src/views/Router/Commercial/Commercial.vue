<template>
  <div id="commercial">
    <!--  表单部分 -->
    <fold-container>
      <template slot="formgroup">
        <form-group ref="formgroup" :identifying="identifying" :formoptions="topFromOptions" @Submit="searchSubmit" @monthPickerChange="searchMonthPicherChange">
          <a-row>
            <a-col :span="24" :style="{ textAlign: 'center' }">
              <a-button type="primary" html-type="submit" icon="search" :style="{ borderRadius: '50px 50px 50px 50px' }">
                Search
              </a-button>
              <a-button
                :style="{ marginLeft: '30px', backgroundColor: 'rgb(245,177,72)', color: '#fff', border: 0, borderRadius: '50px 50px 50px 50px' }"
                @click="handleReset"
                icon="undo"
              >
                Reset
              </a-button>
            </a-col>
          </a-row>
          <div class="collapsible" @click="toggle" :style="collapsed ? { marginTop: '-16px' } : ''"></div>
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
        @userDefindConfirm="userDefindConfirm"
      ></operate-btn>
    </div>
    <!-- table -->
    <div>
      <simple-table
        :propTotal="pagination.total"
        :columns="copyColumns"
        :data="data"
        :border="border"
        :isAlphabet="isAlphabet"
        @handletablechange="tableChange"
        @toggleLetter="toggleLetter"
        @selectedRows="onSelectChange"
        @selectedRowKeys="onSelectedRowKeys"
        ref="simpleTable"
      ></simple-table>
    </div>
    <!-- add Modal -->
    <div class="add-model">
      <model title="Add Commercial route guide suggestion" v-model="visible" width="1200px">
        <template slot="model-body">
          <div id="commercialAdd">
            <form-group :formoptions="addFormOptions" @monthPickerChange="addMonthPickerChange" @selectChange="addSelectChange" ref="addForm"></form-group>
          </div>
        </template>
        <template slot="model-footer">
          <a-row>
            <a-col :span="24" :style="{ textAlign: 'center' }">
              <a-button :style="{ marginLeft: '20px', minWidth: '100px', borderRadius: '50px' }" type="primary" @click="addAndEditSave('add')">Save</a-button>
              <a-button :style="{ marginLeft: '20px', minWidth: '100px', borderRadius: '50px' }" @click="Return('add')">Return</a-button>
              <a-button :style="{ marginLeft: '20px', minWidth: '100px', borderRadius: '50px' }" @click="showEditRoute" :disabled="disabled"
                >Edit route</a-button
              >
              <a-button :style="{ marginLeft: '20px', minWidth: '100px', borderRadius: '50px' }" @click="gotoBenchmark" :disabled="disabled">Show Benchmark and constraint</a-button>
            </a-col>
          </a-row>
        </template>
      </model>
    </div>
    <!-- edit model -->
    <div class="edit-model">
      <model title="Edit Commercial route guide suggestion" v-model="editVisible" width="1200px">
        <template slot="model-body">
          <div id="commercialEdit">
            <form-group :formoptions="editFormOptions" @selectChange="selectChange" ref="editForm" @monthPickerChange="editMonthPickerChange"></form-group>
          </div>
        </template>
        <template slot="model-footer">
          <a-row>
            <a-col :span="24" :style="{ textAlign: 'center' }">
              <a-button :style="{ marginLeft: '20px', minWidth: '100px', borderRadius: '50px' }" type="primary" @click="addAndEditSave('edit')">Save</a-button>
              <a-button :style="{ marginLeft: '20px', minWidth: '100px', borderRadius: '50px' }" @click="Return('edit')">Return</a-button>
              <a-button :style="{ marginLeft: '20px', minWidth: '100px', borderRadius: '50px' }" @click="showEditRoute('edit')" :disabled="editDisabled">Edit route</a-button>
              <a-button :style="{ marginLeft: '20px', minWidth: '100px', borderRadius: '50px' }" @click="gotoBenchmark('edit')">Show Benchmark and constraint</a-button>
            </a-col>
          </a-row>
        </template>
      </model>
    </div>
    <!--  edit route Modal -->
    <div>
      <edit-route :parentdata="editRouteOptions" :parentParams="editRouteParams" :isEditRoute="isEditRoute" @modalVis="modalVis" @exitWithout="exitWithout" @changeSubmit="changeSubmit" @editRouteData="editRouteData"></edit-route>
    </div>
    <!-- 确定取消modal -->
    <div>
      <confirm-modal ref="confirmModal" @ok="modalOk" @cancel="modalCancel"></confirm-modal>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import moment from 'moment'
import { Component,Watch } from 'vue-property-decorator'
import { Getter,Mutation } from 'vuex-class'

import {
  IBtnList,
  commercialBtn,
  IColumns,
  commercialColumns,
  IFormoptions,
  commercoalEditForm,
  commercoalAddForm,
  commercialFrom,
  formOptionsUtil,
  initialValue,
  getId,
  dataCleaning,
  getUserDefinedOptions,
  formatDate,
  isActive,
  setBtnDisabled,
  getCommercialTrunk,
  compareDate
} from '@/untils/router'

import { getFormoptions, postSearchResult, postComercialAdd, putComercialEdit, putApproveAndReject } from '@/api/router'
import { Status, Message, Pagination, IPagination } from '../index'
import { debounce } from 'ts-debounce'
import axios from 'axios'
Component.registerHooks([
  'beforeEnter',
  'beforeRouteEnter',//进入路由之前
  'beforeRouteLeave',//离开路由之前
  'beforeRouteUpdate'
])
@Component({
  name: 'Commercial',
  components: {
    FoldContainer: () => import('@/components/router/FoldContainer.vue'),
    OperateBtn: () => import('@/components/router/OperateBtn.vue'),
    SimpleTable: () => import('@/components/router/SimpleTable.vue'),
    Model: () => import('@/common/Model/index.vue'),
    FormGroup: () => import('@/components/router/FormGroup.vue'),
    ConfirmModal: () => import('@/components/router/ConfirmModal.vue'),
    EditRoute: () => import('@/components/router/EditRoute.vue')
  },

  filters: {
    filternames(value: any): string {
      return `hello filter`
    }
  }
})
export default class Commercial extends Vue {

  @Getter('commercialdataList') getterCommercialdata
  @Getter('route') getterRoute
  @Mutation('setEditRoutData') setEditRoute
  @Mutation('setCommercialData') mutationCommercialData
  @Mutation('setRoute') mutationRoute
  private editRouteOptions: any = []
  private routerFrom: string = ''

  private identifying :any = {name:'commercial',num:31}
  // 控制form隐藏显示
  private collapsed: boolean = false

  //OperateBtn 传值

  private btnList: IBtnList[] = commercialBtn

  // 接收子组件table勾选过的值
  private selectedRows: any[] = []
  private selectedId: number[] = []

  // 控制add modal
  private visible: boolean = false
  // 控制edit modal
  private editVisible: boolean = false

  // 存储确认取消modal过来的值，ok/cancel
  private okOrCancel: string = ''

  //private expand: boolean = false

  private columns: IColumns[] = commercialColumns
  private copyColumns: IColumns[] = commercialColumns
  private data: any[] = []
  private border: boolean = true

  // user-defined 模态框可选数据
  private plainOptions: string[] = getUserDefinedOptions(this.columns)

  // 保存搜索表单的值
  private formData: object = {}
  //是否显示字母表
  private isAlphabet: boolean = true
  // 保存切换字母的值，默认为All
  private letter: string = 'All'

  // add model formOptions
  private addFormOptions: IFormoptions[] = commercoalAddForm
  // edit model formOptions
  private editFormOptions: IFormoptions[] = commercoalEditForm

  // 控制eidt route modal隐藏显示
  private isEditRoute: boolean = false

  // 父组件参数用于edit route 搜索使用
  private editRouteParams: object = {
    routeClass:'',
    product: '',
    beginDate: '',
    endDate: '',
    id: '',
    remark: ''

  }

  // edit route 更改后点击submit change 保存下来数据
  private editRouteSave:  any= []

  // 点击ok后把editRouteSace 赋值给editRouteCopy
  private editRouteCopy: any[] = []

  // edit route 按钮是否可以点击
  private disabled: boolean = true

  private editDisabled: boolean = false

  // 保存add edit的值
  private modifyValues: object = []

  private queryUrl: string = `/route/commercial-routing/select`

  //topFrom
  private topFromOptions: IFormoptions[] = commercialFrom

  // 存储初始化selectoptions的值，用于edit时映射
  private dataOptions: object = {
    routeClass: [],
    product: []
  }

  //保存导出Id
  private exportId:any

  //保存values
  private values: any

  //接收editroute 数据
  private editRouteList: any


  //分页
  private pagination: IPagination = Pagination


  private errorModal(title: string, content: string) {
    this.$error({title, content})
  }

  private clearSelected() {
    let tableRef = this.$refs['simpleTable'] as any
    tableRef.clearSelected()
  }

  //search submit
  private searchSubmit(err: any, values: any): void {
    if(err) {
      return
    }
    console.log(values)
    const beginDate = values['beginDate']
    const fieldsValues = {
      'routeClass': values['routeClass'] !== undefined ? values['routeClass'] : '',
      'product': values['product'] !== undefined ? values['product'] : '',
      'service': values['service'] !== undefined ? values['service'] : '',
      'country': values['country'] !== undefined ? values['country'] : '',
      'actualCost': values['actualCost'] !== undefined ? values['actualCost'] : '',
      'actualCostTo':values['actualCostTo'] !== undefined ? values['actualCostTo'] : '',
      'currentCost': values['currentCost'] !== undefined ? values['currentCost'] : '',
      'currentCostTo': values['currentCostTo'] !== undefined ? values['currentCostTo'] : '',
      'beginDate': beginDate===undefined || beginDate.length === 0 ? '' : beginDate[0].format('YYYY-MM-DD'),
      'endDate':beginDate===undefined ||  beginDate.length === 0 ? '' : beginDate[1].format('YYYY-MM-DD'),
      'status': values['status'] !== undefined ? values['status'] : [],
      'currency':values['currency'] !== undefined ? values['currency'] : '',
    }
    this.formData = fieldsValues
    const params = {
      params: { ...this.formData },
      letter: this.letter,
      pageSize: this.pagination.pageSize,
      pageNum: this.pagination.pageNum,
      sortField: this.pagination.sortField,
      sortOrder: this.pagination.sortOrder
    }
    // TODO 点击search时的处理逻辑
    postSearchResult(params, this.queryUrl).then(res => {
      if (res.code === Status.Ok) {
        [this.data, this.pagination] = dataCleaning(res, this.pagination)
        this.clearSelected()
      } else {
        this.data = []
        this.$message.error(res.msg)
        this.pagination['pageNum'] = Pagination.pageNum
        this.pagination['pageSize'] = Pagination.pageSize
        this.pagination['total'] = 0
      }
    })
  }
  /**点击
   * operateBtn时触发
   *
   */
  private operateClick(eventType: string): void {
    if (eventType === 'add') {
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
    } else if (eventType === 'edit') {
        this.editFormOptions = initialValue(this.editFormOptions, this.selectedRows[0], this.dataOptions)
        this.editVisible = true
        this.$nextTick(() => {
          const editFormGroup = this.$refs['editForm'] as any
          const fieldsValues = editFormGroup.getFieldsValue()
          this.editRouteParams['product'] = fieldsValues['product']
          this.editRouteParams['routeClass'] = fieldsValues['routeClass']
          this.editRouteParams['beginDate'] = moment(fieldsValues['beginDate']).format('YYYY-MM-DD')
          this.editRouteParams['endDate'] = moment(fieldsValues['endDate']).format('YYYY-MM-DD')
          this.editRouteParams['id'] = this.selectedRows[0]['id']
        })

    } else if(eventType === 'details'){
       this.$router.push({ name: 'CommercialRoute', query: { 'data': this.selectedRows[0].id}})
    } else if (eventType === 'approve') {
      if (!isActive(this.selectedRows, [ 'suggested-m', 'suggested-m-future', 'suggested', 'suggested-future'])) {
        this.$warning({
          title: 'Warming',
          content: `Only record with Status as  Suggested-M, Suggested-M-Future, Suggested, Suggested-Future could be modified`,
          okText: 'Confirm'
        })
        return
      } else {
         this.approveAndReject(this.selectedId, eventType)
      }

    } else if (eventType === 'reject') {
      if (!isActive(this.selectedRows, [ 'suggested-m', 'suggested-m-future', 'suggested', 'suggested-future'])) {
        this.$warning({
          title: 'Warming',
          content: `Only record with Status as  Suggested_M, Suggested_M_Future, Suggested, Suggested_Future could be modified`,
          okText: 'Confirm'
        })
        return
      } else {
         this.approveAndReject(this.selectedId, eventType)
      }
    } else if (eventType === 'commercialApprove') {
      if (!isActive(this.selectedRows, [ 'manually_input', 'c-rejected'])) {
        this.$warning({
          title: 'Warming',
          content: `Only record with Status as Manually_input, C_rejected could be modified`,
          okText: 'Confirm'
        })
        return
      } else {
         this.approveAndReject(this.selectedId, 'apply')
      }
    } else if (eventType === 'details') {
      // TODO 跳转到Comercial route guide detail
    } else if (eventType === 'export') {
        this.exportConfim()
    } else if (eventType === 'viewCommercial') {
      if(this.selectedRows.length === 1) {
        this.$router.push({ name: 'CommercialTrunk', query: { 'data': this.selectedRows[0].id }})
      }else{
        this.$message.warning(Message.AtLeast_One)
      }
    }
  }

  private approveAndReject(selectedId: any, eventType: string, url?: string): any {
    putApproveAndReject(selectedId,eventType)
      .then(res => {
        if (res.code === Status.Ok) {

          this.$message.success(`${res.data.length} records are processed`)
          this.data = res.data
          this.pagination['pageNum'] = Pagination.pageNum
          this.pagination['pageSize'] = Pagination.pageSize
          this.pagination['total'] = 1
           this.clearSelected()
          // TODO 是否需要根据eventType判断禁用按钮
        } else {
          // TODO Approve 后台未成功
        }
      })
      .catch(error => {
        // TODO Approve发生错误
      })
  }

  /**
   * add edit相关操作
   */
  private addAndEditSave(type: string): void {
    let formrefs: any = type === 'edit' ? (this.$refs['editForm'] as any) : (this.$refs['addForm'] as any)
    const validateValues = formrefs.validateFields()

    if (validateValues) {
      this.modifyValues = type === 'edit' ? Object.assign(formatDate(validateValues), { id: this.selectedId[0] }) : formatDate(validateValues)
      console.log(this.modifyValues)
      const title = type === 'edit' ? Message.Confirm_Edit : Message.Confirm_Add
      this.confirmModal(type,title)
    }
  }

   //接收editroute数据
  private editRouteData(data) {
    this.editRouteList = data
  }

  private addSave(params) {
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
        this.data = [res.data]
        this.pagination['pageNum'] = Pagination.pageNum
        this.pagination['pageSize'] = Pagination.pageSize
        this.pagination['total'] = 1
        this.clearSelected()
        this.setEditRoute([])
      } else {
        this.$message.error(res.msg)

      }
    })
 }

  private editSave(params) {
    if(this.editRouteList === undefined){
      this.editPost(params)
    }else{
      for(let i=0;i<this.editRouteList.length;i++){
        for(let j=0;j<params.commercialTrunk.length;j++){
          if(this.editRouteList[i].commercialTrunk === params.commercialTrunk[j].commercialTrunk){
            params.commercialTrunk[j].id = this.editRouteList[i].id
            this.editPost(params)
          }
        }
      }
    }
  }

  private editPost(params){
    putComercialEdit(params).then(res => {
      if (res.code === Status.Ok) {
        this.$message.info('saved successfully')
        this.editVisible = false
        this.data = [res.data]
        this.pagination['pageNum'] = Pagination.pageNum
        this.pagination['pageSize'] = Pagination.pageSize
        this.pagination['total'] = 1
        this.clearSelected()
        this.setEditRoute([])
      } else {
        this.$message.error(res.msg)
      }
    })
  }

  private Return(type: string): void {

    if (type === 'add') {
       this.confirmModal('addReturn', Message.Give_Up,{okText:'YES',cancelText:'NO'})
        this.setEditRoute([])
      //this.visible = !this.visible
    } else {
      //this.editVisible = !this.editVisible
      this.confirmModal('editReturn', Message.Give_Up,{okText:'YES',cancelText:'NO'})
       this.setEditRoute([])
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
    const ref: any = this.$refs['formgroup']
    ref.resetFields()
  }

  /**
   * User-Defind Confirm 接收子组件参数
   */
  private userDefindConfirm(checkboxColumns: any[]): void {
    this.copyColumns = checkboxColumns
  }
  /**
   * 切换字母表，接受子组件传过来的参数
   */
  private toggleLetter(letter: string, index: number): void {
    this.letter = letter
    this.pagination['pageNum'] = Pagination['pageNum']
    console.log({
       params: this.formData,
        pageSize: this.pagination.pageSize,
        pageNum: this.pagination.pageNum,
        sortField: this.pagination.sortField,
        sortOrder: this.pagination.sortOrder,
        letter: this.letter
    })
    postSearchResult(
      {
        params: this.formData,
        pageSize: this.pagination.pageSize,
        pageNum: this.pagination.pageNum,
        sortField: this.pagination.sortField,
        sortOrder: this.pagination.sortOrder,
        letter: this.letter
      },
      this.queryUrl
    )
      .then(res => {
        // TODO
        if(res.code === Status.Ok) {
          [this.data, this.pagination] = dataCleaning(res, this.pagination)
          this.clearSelected()
        } else {
          this.$message.error(res.msg)
          this.data = []
          this.pagination['pageNum'] = Pagination.pageNum
          this.pagination['pageSize'] = Pagination.pageSize
          this.pagination['total'] = 0
          this.clearSelected()

        }

      })
  }

  /**
   * 子组件table勾选change时触发
   * @Params selectedRows 勾选的行
   */
  private onSelectChange(selectedRows: any[]): void {
    const oneSelected: string[] = ['edit', 'details', 'viewCommercial', 'reject', 'approve', 'commercialApprove']
    const multipleSelected: string[] = ['reject', 'approve', 'commercialApprove']
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
   *table 勾选的id
   */
  private onSelectedRowKeys(rowKeys: number[]): void {

    this.selectedId = rowKeys
    this.exportId = rowKeys
  }

  /**
   * 分页 排序 筛选变化时触发
   *
   */
  public tableChange(pagination, filters, sorter) {
    const pager = { ...pagination }
    pager.current = pagination.current
    this.pagination = pager
    this.pagination['sortField'] = sorter.field ? sorter.field: ''
    this.pagination['sortOrder'] = sorter.order ? sorter.order : ''
    this.pagination['pageSize'] = pagination.pageSize
    this.pagination['pageNum'] = pagination.current

    postSearchResult(
      {
        params: this.formData,
        pageSize: pagination.pageSize,
        pageNum: pagination.current,
        sortField: sorter.field ? sorter.field : '',
        sortOrder: sorter.order ? sorter.order : '',
        letter: this.letter
      },
      this.queryUrl
    )
      .then(res => {
        if(res.code === Status.Ok) {
           [this.data, this.pagination] = dataCleaning(res, this.pagination)
         } else {
          this.$message.error(res.msg)
          this.data = []
          this.pagination['pageNum'] = Pagination.pageNum
          this.pagination['pageSize'] = Pagination.pageSize
          this.pagination['total'] = 0
          this.clearSelected()
         }


      })
      .catch(error => {})
  }
  // select发生变化时触发
  public selectChange(val, name) {
    console.log(val)
    console.log(name)
  }

  private addSelectChange(val, name) {
    console.log(name)
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

  private searchMonthPicherChange(e, val, decorator) {
    const warn: string = decorator === 'beginDate' ? '开始时间不能大于结束时间' : '结束时间不能小于开始时间'
    const beginDate: string = val['beginDate'] === null ? '' : moment(val['beginDate']).format('YYYY-MM-DD')
    const endDate: string = val['endDate'] === null ? '' : moment(val['endDate']).format('YYYY-MM-DD')
    if (compareDate(beginDate, endDate) === false) {
      const searchFormRefs = this.$refs['formgroup'] as any
      searchFormRefs.resetFields([decorator])
      this.errorModal(decorator, warn)
    }
  }
  private addMonthPickerChange(e, val, decorator) {
    const warn: string = decorator === 'beginDate' ? '开始时间不能大于结束时间' : '结束时间不能小于开始时间'
    const beginDate: string = val['beginDate'] === null ? '' : moment(val['beginDate']).format('YYYY-MM-DD')
    const endDate: string = val['endDate'] === null ? '' : moment(val['endDate']).format('YYYY-MM-DD')
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

  private editMonthPickerChange(e, val, decorator) {
    const warn: string = decorator === 'beginDate' ? '开始时间不能大于结束时间' : '结束时间不能小于开始时间'
    const beginDate: string = val['beginDate'] === null || val['beginDate'] === undefined ? '' : moment(val['beginDate']).format('YYYY-MM-DD')
    const endDate: string = val['endDate'] === null || val['endDate'] === undefined ? '' : moment(val['endDate']).format('YYYY-MM-DD')
    if (compareDate(beginDate, endDate) === false) {
      const editFormRefs = this.$refs['editForm'] as any
      editFormRefs.resetFields([decorator])
      this.errorModal(decorator, warn)
    }
    let testTrue: boolean = false
    console.log(val)
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
      this.editDisabled = false
      this.editRouteParams['beginDate'] =  moment(val['beginDate']).format('YYYY-MM-DD')
      this.editRouteParams['endDate'] =  moment(val['endDate']).format('YYYY-MM-DD')
    } else {
      this.editDisabled = true
    }
  }

  //确定取消modal

  private modalOk(eventType: string): void {
    this.okOrCancel = eventType
    if (eventType === 'edit') {
      this.modifyValues['status'] = 5
      let commercialTrunk: any[] = getCommercialTrunk(this.editRouteCopy)
      this.editSave(Object.assign(this.modifyValues, { commercialTrunk}))
      this.editFormOptions = commercoalEditForm
    } else if (eventType === 'add') {
      this.modifyValues['status'] = 5
      let commercialTrunk: any[] = getCommercialTrunk(this.editRouteCopy)
      console.log(this.modifyValues)
      console.log(Object.assign(this.modifyValues, { commercialTrunk}))
      this.addSave(Object.assign(this.modifyValues, { commercialTrunk}))
      this.addFormOptions = commercoalAddForm
    } else if (eventType ==='editRoute') {
      console.log(eventType)
      this.editRouteCopy = this.editRouteSave
      this.$message.info('saved successfully')
      this.isEditRoute = false
    } else if (eventType === 'addReturn') {
      this.visible = !this.visible
      this.addFormOptions = commercoalAddForm
    } else if (eventType === 'editReturn') {
      this.editVisible = !this.editVisible
       this.editFormOptions = commercoalEditForm
    } else if (eventType === 'editRouteReturn') {
      this.isEditRoute = false
      this.setEditRoute([])
    }else if(eventType === 'export'){
      this.export()
    }
  }

    private exportConfim(){
      this.confirmModal('export' ,Message.Confirm_Export)
    }

  //导出
  private export(){
    const initialForm = this.$refs['formgroup'] as any
    const values = initialForm.getFieldsValue()
    const beginDate = values['beginDate']
    const fieldsValues = {
      'routeClass': values['routeClass'] !== undefined ? values['routeClass'] : '',
      'product': values['product'] !== undefined ? values['product'] : '',
      'service': values['service'] !== undefined ? values['service'] : '',
      'country': values['country'] !== undefined ? values['country'] : '',
      'actualCost': values['actualCost'] !== undefined ? values['actualCost'] : '',
      'actualCostTo':values['actualCostTo'] !== undefined ? values['actualCostTo'] : '',
      'currentCost': values['currentCost'] !== undefined ? values['currentCost'] : '',
      'currentCostTo': values['currentCostTo'] !== undefined ? values['currentCostTo'] : '',
      'beginDate': beginDate === undefined ? '' : beginDate[0].format('YYYY-MM-DD'),
      'endDate': beginDate === undefined ? '' : beginDate[1].format('YYYY-MM-DD'),
      'status': values['status'] !== undefined ? values['status'] : [],
      'currency':values['currency'] !== undefined ? values['currency'] : '',
    }
    let exparams:any = {
      params: { ...fieldsValues,ids:this.exportId }
    }
    axios({
        url:'/route/commercial-routing/export',
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

  private modalCancel(message: string): void {
    this.okOrCancel = message
    console.log(message)
  }

  private confirmModal(eventType: string, title: string = Message.Confirm_Title, args: object = {}): void {
    const confirmref = this.$refs['confirmModal'] as any
    confirmref.showConfirm(eventType, { title: title, ...args })
  }

  //
  private showEditRoute(eventType: string = 'add'): void {
    if(eventType === 'edit') {
      this.$nextTick(() => {
        const editFormGroup = this.$refs['editForm'] as any
        const fieldsValues = editFormGroup.getFieldsValue()
        this.editRouteParams['product'] = fieldsValues['product']
        this.editRouteParams['routeClass'] = fieldsValues['routeClass']
        this.editRouteParams['beginDate'] = moment(fieldsValues['beginDate']).format('YYYY-MM-DD')
        this.editRouteParams['endDate'] = moment(fieldsValues['endDate']).format('YYYY-MM-DD')
      })
    }
    this.isEditRoute = !this.isEditRoute
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
  private gotoBenchmark(type: string): void {
    const topFormRefs = this.$refs['formgroup'] as any
    const addFormRefs = this.$refs['addForm'] as any
    const editFormRefs =this.$refs['editForm'] as any

    let addValues = {}
    let editValues = {}
    console.log(topFormRefs)
    console.log(addFormRefs)
    const topValues = topFormRefs.getFieldsValue()
    if(addFormRefs){
      addValues = addFormRefs.getFieldsValue()
    }
    if (editFormRefs) {
       editValues = editFormRefs.getFieldsValue()
    }
    let topForm = this._setOptions(this.topFromOptions,topValues)
    let editForm = Object.keys(editValues).length !== 0 ? this._setOptions(this.editFormOptions,editValues) : this.editFormOptions
    let addForm = Object.keys(addValues).length !== 0 ? this._setOptions(this.addFormOptions,addValues) : this.addFormOptions



    let commercialData = {
      from:'commercial',
      data: this.data,
      topFromOptions: topForm,
      addFormOptions: addForm,
      editFormOptions: editForm,
      selectedId: this.selectedId,
      selectedRows: this.selectedRows,
      selectedRowKeys: this.selectedId,
      editRouteParams: this.editRouteParams,
      visible: this.visible,
      editVisible: this.editVisible,
      editRouteOptions: this.editRouteOptions,
      disabled: this.disabled,
      pagination: this.pagination
    }

    this.mutationCommercialData(commercialData)
    this.$router.push({ name: 'ShowBenchmark', query: this.editRouteParams as any})
  }
  // edit route modal子组件点击右上角X返回参数
  private modalVis(data) {
    console.log("XXX")
    this.isEditRoute = data
  }
  // edit route modal 点击exit
  private exitWithout(exitWithout) {
    console.log('modal')
    this.setEditRoute([])
    this.confirmModal('editRouteReturn',  Message.Give_Up, {okText:'YES',cancelText:'NO'})

  }
  //edit route modal submit接收参数

  private changeSubmit(data) {
    this.editRouteSave = data
    this.confirmModal('editRoute', Message.Submit_Change)
  }



  protected mounted() {
    console.log(this.getterRoute)
    const commercialdata = this.getterCommercialdata
    if (this.getterRoute === 'Commercial') {
      this.visible = commercialdata.visible
      this.editVisible = commercialdata.editVisible
      this.data = commercialdata.data
      this.topFromOptions = commercialdata.topFromOptions
      this.addFormOptions = commercialdata.addFormOptions
      this.editFormOptions = commercialdata.editFormOptions
      this.editRouteOptions = commercialdata.editRouteOptions
      this.selectedId = commercialdata.selectedId
      this.selectedRows = commercialdata.selectedRows
      this.pagination = commercialdata.pagination
      this.disabled = commercialdata.disabled
      this.editRouteParams = commercialdata.editRouteParams
      this.mutationRoute('')
      this.mutationCommercialData({})
    } else {

        getFormoptions({ id: 10 }).then(res => {
      if (res.code === Status.Ok) {
        const data = res.data // TODO 为topFromOptions赋值
        this.topFromOptions = formOptionsUtil(this.topFromOptions, data)
        let splitOptions: object = {
          product: [],
          routeClass: []
        }
        for (const key in data) {
          if (data.hasOwnProperty('routeClass') && key === 'routeClass') {
            splitOptions['routeClass'] = data['routeClass']
          } else if (data.hasOwnProperty('routeClass') && key === 'product') {
            splitOptions['product'] = data['product']
          }
        }
        this.addFormOptions = formOptionsUtil(this.addFormOptions, splitOptions)
        this.dataOptions = Object.assign(this.dataOptions, splitOptions)
      } else {
        this.$message.error(Message.Unknown)
      }
    })

    getFormoptions({ id: 4 }).then(res => {
      if (res.code === Status.Ok) {
        this.editRouteOptions = res.data
        //this.addFormOptions = formOptionsUtil(this.addFormOptions, data)
      }
    })

    }

    if (this.$route.params.addData && this.$route.params.addData!== '1') {
      const queryData = JSON.parse(decodeURIComponent(this.$route.params.addData))
      this.data = queryData as string[]
      this.pagination['pageNum'] = Pagination.pageNum
      this.pagination['pageSize'] = Pagination.pageSize
      this.pagination['total'] = 1
    }






  }

  private activated() {
    console.log('keep-alice')
  }
  private deactivated() {
    console.log('deactivated')
  }

}
</script>

<style scoped>
#commercial >>> .ant-col-8 {
  padding-left: 8px !important;
}
#commercial >>> .ant-col-15 {
  padding-right: 2px !important;
}
#commercial >>> .ant-col-5 {
  padding-left: 0 !important;
}
#commercialAdd >>> .ant-col-11 {
  padding-left: 2.7%;
  padding-right: 10%;
}
#commercialAdd >>> .ant-col-22 {
  padding-left: 2.7%;
}
#commercialEdit >>> .ant-col-11 {
  padding-left: 2.7%;
  padding-right: 10%;
}
#commercialEdit >>> .ant-col-22 {
  padding-left: 2.7%;
}
#commercial {
  background: rgba(245, 246, 250, 1);
}
</style>


