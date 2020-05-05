<template>
  <div id="routeClass">
    <!--  表单部分 -->
    <fold-container>
      <template slot="formgroup">
        <form-group ref="formgroup" :identifying="identifying" :formoptions="topFromOptions" @Submit="searchSubmit"  @monthPickerChange="searchMonthPicherChange">
          <a-row>
            <a-col :span="24" :style="{textAlign: 'center'}">
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
      <operate-btn ref="operateBtn" :columns="columns" :BtnList="btnList" :plainOptions="plainOptions" @operateClick="operateClick"  @userDefindConfirm="userDefindConfirm" @beforeUpload="beforeUpload"></operate-btn>
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
        @selectedRows="onSelectChange"
        @selectedRowKeys="onSelectedRowKeys"
        ref="simpleTable"
      ></simple-table>
    </div>
    <!-- add Modal -->
    <div class="add-model">
      <model
        title="Add benchmark for route class"
        v-model="visible"
        width="1200px"
      >
        <template slot="model-body">
          <div id="routeClassAdd">
            <form-group ref="routeClassAdd" :formoptions="addFormOptions" @selectChange="selectChange" @monthPickerChange="addMonthPickerChange" @inputChange="addInputChange"></form-group>
          </div>
        </template>
        <template slot="model-footer">
          <a-row>
            <a-col :span="24" :style="{ textAlign: 'center' }">
              <a-button
                :style="{ marginLeft: '20px', minWidth: '100px', borderRadius: '50px' }"
                type="primary"
                @click="addAndEditSave('add')"
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
        title="Edit benchmark for route class"
        v-model="editVisible"
        width="1200px"
      >
        <template slot="model-body">
          <div id="routeClassEdit">
            <form-group ref="routeClassEdit" :formoptions="editFormOptions" @selectChange="selectChange" @monthPickerChange="editMonthPickerChange" @inputChange="editInputChange"></form-group>
          </div>
        </template>
        <template slot="model-footer">
          <a-row>
            <a-col :span="24" :style="{ textAlign: 'center' }">
              <a-button
                :style="{ marginLeft: '20px', minWidth: '100px', borderRadius: '50px' }"
                type="primary"
                @click="addAndEditSave('edit')"
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
    <!-- 确定/取消modal -->
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
  routeProductBtn,
  IColumns,
  routeClassColumns,
  IFormoptions,
  routeClassFrom,
  routeClassEditFrom,
  routeClassAddFrom,
  formOptionsUtil,
  dataCleaning,
  getUserDefinedOptions,
  initialValue,
  setBtnDisabled,
  formatDate,
  isActive,
  compareDate
} from "@/untils/router"

import {routePointNumberReg, routeNumberReg} from '@/common/RegExp/number'

import { getFormoptions, postSearchResult, postComercialAdd, putComercialEdit,postDelete} from '@/api/router'
import { Status, Message, Pagination, IPagination} from '../index'
import axios from 'axios'

@Component({
  components: {
    FoldContainer: () => import('@/components/router/FoldContainer.vue'),
    OperateBtn: () => import("@/components/router/OperateBtn.vue"),
    SimpleTable: () => import("@/components/router/SimpleTable.vue"),
    Model: () => import("@/common/Model/index.vue"),
    ConfirmModal: () => import('@/components/router/ConfirmModal.vue'),
    FormGroup: () => import("@/components/router/FormGroup.vue")
  }
})
export default class RouteClass extends Vue {

  //标识哪个页面调用formGroup
  private identifying :any = {name:'routeClass',num:31}

  // 控制form隐藏显示
  private collapsed: boolean = false

  //OperateBtn 传值

  private btnList: IBtnList[] = routeProductBtn

  // 控制add modal
  private visible: boolean = false

  // edit modal
  private editVisible: boolean = false



  private columns: IColumns[] = routeClassColumns
  private copyColumns: IColumns[] = routeClassColumns
  private data: any = []
  private border: boolean = true

  // user-defined 模态框可选数据
  private plainOptions: string[] =  getUserDefinedOptions(this.columns)

  //是否显示字母表
  private isAlphabet:boolean = false

  // 保存搜索表单的值
  private formData: object = {}

  // topFrom
  private topFromOptions: IFormoptions[] = routeClassFrom

  // add model formOptions
  private addFormOptions: IFormoptions[] = routeClassAddFrom

  // edit model formOptions
  private editFormOptions: IFormoptions[] = routeClassEditFrom

  // 接收子组件table勾选过的值
  private selectedRows: any[] = []
  private selectedId: number[] = []

  // 保存add edit的值
  private modifyValues: object = {}

  // 存储确认取消modal过来的值，ok/cancel
  private okOrCancel: string = ''

  //保存导出Id
  private exportId:any

    // 存储初始化selectoptions的值，用于edit时映射
  private dataOptions: object = {
    routeClass: [],
    status: [
       {
        id: 2,
        name: 'active'
      },
      {
        id: 3,
        name: 'invalid'
      }
    ]

  }

   //分页
  private pagination: IPagination = Pagination

  private queryUrl: string = `/route/route-class/query`



   private errorModal(title: string, content: string) {
    this.$error({title, content})
  }

  /**
   * 刷新，add edit等清除所选择的数据
   */
  private clearSelected() {
    let tableRef = this.$refs['simpleTable'] as any
    tableRef.clearSelected()
  }

  // search submit
  private searchSubmit(err: any, values: any): void {

    if (err) {
      return
    }

    const beginDate = values['beginDate']
    const endDate = values['endDate']
    const fieldsValues = {
      'beginDate': beginDate === undefined || beginDate.length === 0 ? '' : beginDate[0].format('YYYY-MM-DD'),
      'beginDateTo': beginDate === undefined || beginDate.length === 0 ? '' : beginDate[1].format('YYYY-MM-DD'),
      'endDate': endDate === undefined || endDate.length === 0 ? '' : endDate[0].format('YYYY-MM-DD'),
      'endDateTo': endDate === undefined || endDate.length === 0 ? '' : endDate[1].format('YYYY-MM-DD'),
      'routeClass': values['routeClass'] !== undefined ? values['routeClass'] : '',
      'status': values['status'] !== undefined ? values['status'] : ''
    }
    this.formData = fieldsValues
    const params = {
      params: {...this.formData},
      pageSize: this.pagination.pageSize,
      pageNum: 1,
      sortField: this.pagination.sortField,
      sortOrder: this.pagination.sortOrder
    }
        // TODO 点击search时的处理逻辑
     postSearchResult(params, this.queryUrl).then((res) => {
      if(res.code === Status.Ok) {
         [this.data, this.pagination] = dataCleaning(res, this.pagination)
         this.clearSelected()
      } else {
        this.$message.error(res.msg)
        this.pagination['pageNum'] = Pagination.pageNum
        this.pagination['pageSize'] = Pagination.pageSize
        this.pagination['total'] = 0
      }
    })


  }

  /**
   * Form Reset
   */
  public handleReset() {
    const ref: any = this.$refs['formgroup']
    ref.resetFields()
  }

  /**点击
   * operateBtn时触发
   *
   */
  private operateClick(eventType: string): void {
    if (eventType === "add") {
      this.visible = true
    }else if(eventType === "edit") {
      this.editVisible = true
      this.editFormOptions = initialValue(this.editFormOptions, this.selectedRows[0], this.dataOptions, '')
    }else if(eventType === 'delete') {
       if(this.selectedRows.length === 0) {
        this.$message.warning(Message.AtLeast_One)
      }
      if (isActive(this.selectedRows)) {
        this.$warning({
          title: 'Warning',
          content: 'Only invalid records could be deleted',
          okText: 'Confirm'
        })
      } else {
        const title =  `Are you going to delete ${this.selectedRows.length} records?`
        this.confirmModal(eventType, title,{okText:'Proceed'} )
      }
    }else if(eventType === 'export'){
      this.exportConfim()
    }
  }

  private beforeUpload(fileList: string[]): void {
    if (fileList.length > 0) {
      const title =  `Are you going to upload 1 file?`
      this.confirmModal("upload", title,{okText:'Proceed'} )
    }
  }

  private Return(type: string): void {
    if (type === 'add') {
       this.confirmModal('addReturn', Message.Give_Up,{okText:'YES',cancelText:'NO'})
      //this.visible = !this.visible
    } else {
      //this.editVisible = !this.editVisible
      this.confirmModal('editReturn', Message.Give_Up,{okText:'YES',cancelText:'NO'})
    }
  }



  // add edit
  private addAndEditSave(type: string): void {
    let formrefs: any = (type === 'edit') ? this.$refs['routeClassEdit'] as any : this.$refs['routeClassAdd'] as any
    const values = formrefs.getFieldsValue()
    const validateValues = formrefs.validateFields()
    //验证字段是否符合
    console.log(validateValues)
    if (validateValues) {
       this.modifyValues = type === 'edit' ? Object.assign(formatDate(validateValues), { id: this.selectedId[0] }) : formatDate(validateValues)
       this.confirmModal(type,Message.Submit_Change)
    }
  }

   private addSave(params) {
     const url: string = `/route/route-class/add`
    postComercialAdd(params,url).then((res) => {
      if(res.code === Status.Ok) {
        this.visible = false
        this.data = [res.data]
        this.pagination['pageNum'] = Pagination.pageNum
        this.pagination['pageSize'] = Pagination.pageSize
        this.pagination['total'] = 1
        this.btnList = setBtnDisabled(this.btnList, true, 'Edit', 'delete')
      }

    })
  }
  private editSave(params) {
    const url: string = `/route/route-class/update`
    putComercialEdit(params,url).then((res) => {
      if(res.code === Status.Ok) {
        this.editVisible = false
        this.data = [res.data]
        this.pagination['pageNum'] = Pagination.pageNum
        this.pagination['pageSize'] = Pagination.pageSize
        this.pagination['total'] = 1
        this.btnList = setBtnDisabled(this.btnList, true, 'Edit', 'delete')
      } else if (res.code === Status.Repeat) {
        this.$error({
          title: 'Error',
          content: res.msg
        })
      }
    })
  }

  private exportConfim(){
    this.confirmModal('export')
  }

  //导出
  private export(){
    const initialForm = this.$refs['formgroup'] as any
    const values = initialForm.getFieldsValue()
    const beginDate = values['beginDate']
    const endDate = values['endDate']
    const fieldsValues = {
      'beginDate': beginDate === undefined || beginDate.length === 0 ? '' : beginDate[0].format('YYYY-MM-DD'),
      'beginDateTo': beginDate === undefined || beginDate.length === 0 ? '' : beginDate[1].format('YYYY-MM-DD'),
      'endDate': endDate === undefined || endDate.length === 0 ? '' : endDate[0].format('YYYY-MM-DD'),
      'endDateTo': endDate === undefined || endDate.length === 0 ? '' : endDate[1].format('YYYY-MM-DD'),
      'routeClass': values['routeClass'] !== undefined ? values['routeClass'] : '',
      'status': values['status'] !== undefined ? values['status'] : ''
    }
    let exparams:any = {
      params: { ...fieldsValues,id:this.exportId }
    }
    axios({
      url:'/route/route-class/export',
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


  private modalOk(eventType: string): void {
    console.log(eventType)
    this.okOrCancel = eventType
    if (eventType === 'edit') {

       this.editSave(this.modifyValues)
       this.clearSelected()

    } else if (eventType === 'add') {
      this.addSave(this.modifyValues)
      this.clearSelected()
    } else if(eventType === 'delete') {
      this.delete()
    } else if (eventType === 'addReturn') {
      this.visible = !this.visible
    } else if (eventType === 'editReturn') {
      this.editVisible = !this.editVisible
    }else if(eventType === 'export'){
      this.export()
    } else if(eventType === 'upload') {
      const uploadUrl = `/route/route-class/import`
      const operateRefs = this.$refs['operateBtn'] as any
      const data = operateRefs.handleUpload()
      postComercialAdd(data,uploadUrl).then((res) => {
         if (res.code === Status.Ok) {
          this.data = res.data
          this.clearSelected()
          this.btnList = setBtnDisabled(this.btnList, true, 'Edit', 'delete')
           this.pagination.total = 0
         } else {
           this.$message.error(res.msg)
         }
       })
    }
  }

  private modalCancel(message: string): void {
     this.okOrCancel = message
  }

  private confirmModal(eventType: string, title: string = Message.Confirm_Title, args: object = {}): void {
    const confirmref = this.$refs['confirmModal'] as any
    confirmref.showConfirm(eventType, { title: title, ...args })
  }




  /**
   * Form表单展开与收缩
   */
  public toggle() {
    //this.expand = !this.expand
    this.collapsed = !this.collapsed
  }

  /**
   * User-Defind Confirm 接收子组件参数
   */
  private userDefindConfirm(checkboxColumns: any[]):void {


    this.copyColumns = checkboxColumns
  }



  /**
   * 子组件table勾选change时触发
   * @Params selectedRows 勾选的行
   */
  private onSelectChange(selectedRows: any[]): void {
    if (selectedRows.length !== 0 && selectedRows.length === 1) {
      this.btnList = setBtnDisabled(this.btnList, false, 'Edit','delete')
    } else if(selectedRows.length >= 1) {
       this.btnList = setBtnDisabled(this.btnList, false, 'delete')
       this.btnList = setBtnDisabled(this.btnList, true, 'edit')
    }else {
      this.btnList = setBtnDisabled(this.btnList, true, 'Edit', 'delete')
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


     postSearchResult({
       params:this.formData,
       pageSize: pagination.pageSize,
       pageNum: pagination.current,
       sortField: sorter.field ? sorter.field : '',
       sortOrder: sorter.order ? sorter.order : ''
     }, this.queryUrl).then((res) => {
      if(res.code === Status.Ok) {
         [this.data, this.pagination] = dataCleaning(res, this.pagination)
      }
    })

  }


  public selectChange(val, name) {
    console.log(val)
    console.log(name)
  }


  private delete(): void {
    postDelete(this.selectedId,'/route/route-class/del').then(res => {
      if (res.code === Status.Ok) {
        this.$message.info('deleted successfully')
        this.search()
        this.clearSelected()
      }
    })
  }
  /**
   *  查询方法用于删除后查询
   */
  private search() {
    const url = `/route/route-class/query`
    let params = {
      params: this.formData,
      pageSize: this.pagination.pageSize,
      pageNum: this.pagination.currentPage,
      sortField: this.pagination.sortField,
      sortOrder: this.pagination.sortOrder,
    }
    postSearchResult(params, url).then(res => {
      [this.data, this.pagination] = dataCleaning(res, this.pagination)
    })
  }

  private searchMonthPicherChange(e, val, decorator) {
    console.log(decorator)
    console.log(val)
    console.log(e)
    const searchFormRefs = this.$refs['formgroup'] as any
    let warn: string = ''
    if(decorator === 'beginDate' || decorator === 'endDate') {
      warn = '开始时间不能大于结束时间'
    } else {
      warn = '结束时间不能小于开始时间'
    }
    if (decorator === 'beginDate' || decorator === 'beginDateTo') {
      const beginDate: string = val['beginDate'] === null || val['beginDate'] === undefined ? '' : moment(val['beginDate']).format('YYYY-MM-DD')
      const beginDateTo: string = val['beginDateTo'] === null || val['beginDateTo'] === undefined ? '' : moment(val['beginDateTo']).format('YYYY-MM-DD')
      if (compareDate(beginDate, beginDateTo) === false) {
        searchFormRefs.resetFields([decorator])
        this.errorModal(decorator, warn)
      }
    } else if(decorator === 'endDate' || decorator === 'endDateTo') {
      const endDate: string =  val['endDate'] === null || val['endDate'] === undefined ? '' : moment(val['endDate']).format('YYYY-MM-DD')
      const endDateTo: string   = val['endDateTo'] === null ||  val['endDateTo'] === undefined ? '' : moment(val['endDateTo']).format('YYYY-MM-DD')
      if (compareDate(endDate, endDateTo) === false) {
        searchFormRefs.resetFields([decorator])
        this.errorModal(decorator, warn)
      }
    }

  }

  private addMonthPickerChange(e, val, decorator) {
    console.log(moment(e).format('YYYY-MM-DD'))
    const warn: string = decorator === 'beginDate' ? '开始时间不能大于结束时间' : '结束时间不能小于开始时间'
    const beginDate: string = val['beginDate'] === null || val['beginDate'] === undefined  ? '' : moment(val['beginDate']).format('YYYY-MM-DD')
    const endDate: string = val['endDate'] === null || val['endDate'] === undefined? '' : moment(val['endDate']).format('YYYY-MM-DD')
    if (compareDate(beginDate, endDate) === false) {
      const addFormRefs = this.$refs['routeClassAdd'] as any
      addFormRefs.resetFields([decorator])
      this.errorModal(decorator, warn)
    }
  }

  private editMonthPickerChange(e, val, decorator) {
    const warn: string = decorator === 'beginDate' ? '开始时间不能大于结束时间' : '结束时间不能小于开始时间'
    const beginDate: string = val['beginDate'] === null || val['beginDate'] === undefined ? '' : moment(val['beginDate']).format('YYYY-MM-DD')
    const endDate: string = val['endDate'] === null || val['endDate'] === undefined ? '' : moment(val['endDate']).format('YYYY-MM-DD')

    if (compareDate(beginDate, endDate) === false) {
      const editFormRefs = this.$refs['routeClassEdit'] as any
      editFormRefs.resetFields([decorator])
      this.errorModal(decorator, warn)
    }
  }

  private addInputChange(e: any, values: any,decorator: string): void {
    this.fieldsVerify(e, 'routeClassAdd', values, decorator)
  }
  private editInputChange(e: any, values: any,decorator: string): void {
    this.fieldsVerify(e, 'routeClassEdit', values, decorator)
  }

  private fieldsVerify(e:any, ref: any, values: any, decorator: string) {
    const formRefs = this.$refs[ref] as any
    const fieldsFloat: string[] = ['marginMinimum', 'asrMinimum', 'impactMinimum', 'impactMaximum']
    const dataType: string[] = ['+', '-']
    const fieldsInt: string[] = ['maximumCommercialTrunks', 'maximumTechnicalTrunks', 'maximumInternalTrunks', 'minimumMos']
    const patternFloat: RegExp = new RegExp(routePointNumberReg, 'g')
    const patternInt: RegExp = new RegExp(routeNumberReg,'g')
    const maxFloatNum: number = 10000000
    const maxIntNum: number = 65536
    let value: string = values[decorator].trim()
    let result: string = ''
    if (fieldsFloat.includes(decorator)) {
      if(values[decorator]) {
        if(patternFloat.test(values[decorator].trim())){
          /* if(values[decorator] === '0') {
            addFormRefs.setFieldsValue({[decorator]: ''})
            this.errorModal('','The value cannot be 0')

          } */
          //判断是否有+，-号
          if(values[decorator].trim().startsWith('-')) {
            if (parseFloat(value.slice(1)) > maxFloatNum) {
              result = values[decorator].trim().slice(0, -1)
              formRefs.setFieldsValue({[decorator]: result})
              this.errorModal(decorator, 'The input data is out of the specified range')
              return
            }
          } else {
            if (values[decorator].includes('+')) {
              if(parseFloat(value.slice(1)) > maxFloatNum) {
                result = values[decorator].trim().slice(0, -1)
                formRefs.setFieldsValue({[decorator]: result})
                this.errorModal(decorator, 'The input data is out of the specified range')
                return
              }
            } else {
              if(parseFloat(value) >  maxFloatNum) {
                result = values[decorator].trim().slice(0, -1)
                formRefs.setFieldsValue({[decorator]: result})
                this.errorModal(decorator, 'The input data is out of the specified range')
                return
              }
            }
          }
        } else {
          //patternFloat验证不通过
          if(e.inputType !== 'deleteContentBackward'){
            result = values[decorator].trim().slice(0, -1)
            formRefs.setFieldsValue({[decorator]: ''})
            this.errorModal(decorator, 'You can only enter Numbers and decimals')
            return
          }

        }
      }

    } else if (fieldsInt.includes(decorator)) {
      if (patternInt.test(values[decorator].trim())) {
        if (parseInt(value) > 65536) {
           result = values[decorator].trim().slice(0, -1)
           formRefs.setFieldsValue({[decorator]: result})
           this.errorModal(decorator, 'The input data is out of the specified range')
           return
        }

      } else {
        if(e.inputType !== 'deleteContentBackward'){
          result = values[decorator].trim().slice(0, -1)
          formRefs.setFieldsValue({[decorator]: ''})
          this.errorModal(decorator, 'type error')
          return
        }

      }
    }
  }


  protected mounted() {
    getFormoptions({id:9}).then((res) => {
      if(res.code === Status.Ok) {
        const data = res.data
        this.topFromOptions = formOptionsUtil(this.topFromOptions, data)
        this.addFormOptions = formOptionsUtil(this.addFormOptions,data)
        this.dataOptions = Object.assign(this.dataOptions, data)
      }
    })
  }
}
</script>

<style scoped>
#routeClass >>> .ant-col-8{
  padding-left: 3% !important;
}
#routeClass >>> .ant-col-12{
  padding-left: 6% !important;
}
#routeClass >>> .ant-col-5{
  padding-left: 4px !important;
}
#routeClassAdd >>> .ant-col-21{
  padding-left: 3.3%;
  padding-right: 2.5%;
}
#routeClassEdit >>> .ant-col-21{
  padding-left: 3.3%;
  padding-right: 2.5%;
}
</style>
