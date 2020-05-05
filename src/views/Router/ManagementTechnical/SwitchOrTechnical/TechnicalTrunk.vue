<template>
  <div id="technical">
    <div class="head">
      <div class="goBack" @click="back"><a-button type="primary" ghost> ＜ Go Back</a-button></div>
      <div class="title">Technical trunk connection</div>
    </div>
    <!--  表单部分 -->
    <fold-container>
      <template slot="formgroup">
        <form-group ref="formgroup" :formoptions="topFromOptions" @Submit="searchSubmit">
          <div slot="descriptionSlot" :style="{backgroundColor: 'white',paddingLeft: '24px',paddingTop: '20px'}">
            <a-row class="aRow">
              <a-col :offset="1" :span="13" :style="{paddingBottom: '17px'}">Details of routing strategy for Route product: &nbsp; <span class="topColor">{{passParams.product?passParams.product:''}}</span></a-col>
              <a-col :offset="1" :span="8" :style="{paddingBottom: '17px'}">Route class:  &nbsp;<span class="topColor">{{passParams.routeClass ?passParams.routeClass :''}}</span></a-col>
              <a-col :offset="1" :span="13" >Currency:&nbsp;<span class="topColor">{{passParams.currency ?passParams.currency :''}}</span> </a-col>
              <a-col :offset="1" :span="8" >Traffic date: &nbsp;<span class="topColor">{{passParams.trafficDate?passParams.trafficDate:''}} &nbsp;to&nbsp;{{passParams.trafficDateTo?passParams.trafficDateTo:''}}</span> </a-col>
            </a-row>
          </div>
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
      <simple-table :columns="copyColumns" :data="data" :border="border" :isPag="false" :disabledSelect="disabledSelect" :isAlphabet="isAlphabet" @changeId="changeIdL" @dataChild="getChildData" @handletablechange="tableChange" @selectedRows="onSelectChange" ref="simpleTable"></simple-table>
    </div>

  </div>
</template>
<script lang="ts">
import Vue from "vue"
import moment from "moment"
import { Component } from "vue-property-decorator"
import {
  IBtnList,
  IColumns,
  technicalTrunkCol,
  IFormoptions,
  technicalTrunkForm,
  formOptionsUtil,
  technicalTrunkData,
  techniacalTrunkBtn,
  technicalPass
} from "@/untils/router"

import {
  getFormoptions,
  postSearchResult,
  postComercialAdd
} from "@/api/router"

import { Status, Message, Pagination, IPagination } from "../../index"

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
export default class technicalTrunk extends Vue {
  private form: any
  // 控制form隐藏显示
  private collapsed: boolean = false

  //OperateBtn 传值

  private btnList: IBtnList[] = techniacalTrunkBtn

  // 控制add modal
  private visible: boolean = false

  // 接收子组件table勾选过的值
  private selectedRows: any[] = []
  // user-defined 模态框可选数据
  private plainOptions: string[] = [
    "Plan Rank",
    "Implemented Rank",
    "Technical Trunk",
    "Commercial Trunk",
    "Account",
    "Rate",
    "Plan Percentage",
    "Percentage in operation",
    "MOU",
    "Number of calls",
    "ASR",
    "NER",
    "MOS",
    "Begin date",
    "End date"
  ]
  //private expand: boolean = false

  private columns: IColumns[] = technicalTrunkCol
  private copyColumns: IColumns[] = technicalTrunkCol
  private data: any = []
  private border: boolean = true

  //是否显示字母表
  private isAlphabet:boolean = false

  // topFrom
  private topFromOptions: IFormoptions[] = technicalTrunkForm

  //分页
  private pagination: IPagination = Pagination

  //是否需要勾选
  private disabledSelect:boolean = true

  //保存params
  private searchParams: any

  private changeId: number[] = []

  private values :any
  private err :any
  private repeatData:any = []

  private jumpParams:any = []

  //保存跳转过来的参数
  //保存跳转过来的参数
  private passParams: any = {
    product: '',
    routeClass: '',
    currency: '',
    trafficDate: '',
    trafficDateTo: ''
  }

  //search submit
  private url: string = "/route/order/technical"
  private searchSubmit(err: any, values: any): void {
    console.log(values)
    if(values.trafficOrigination === '' || values.trafficOrigination === undefined){
      return
    }
    let re=/^\d+$|^\d*\.\d+$/g

    this.err = err
    this.values = values
    let routeData:any = this.$route.query.data
    const params = {
        transactionId:routeData.transactionId,
        id:routeData.id,
        switchId: values.switch ? values.switch : "",
        trafficOrigination: values.trafficOrigination,
        commercialTrunk: values.commercialTrunk ? values.commercialTrunk : '',
        rateFrom: values.rate ? values.rate : "",
        rateTo: values.rateTo ? values.rateTo : "",
        asr: values.asr ? values.asr : "",
        cli: values.cli ? values.cli : "",
        sortField: this.pagination.sortField,
        sortOrder: this.pagination.sortOrder
    };
    this.searchParams = params
    if(params.asr !== '' && params.asr !== undefined){
      if (!re.test(params.asr)) {
        this.$message.error('You can only enter Numbers and decimals')
      }else{
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
    }else{
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

  }

  private _dataCleaning(data) {
    const pagination = { ...this.pagination }
    this.data = data.data
    this.repeatData = data.data
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
    if (eventType === "submitChange") {
        this.submitChange()
    }else if(eventType === "exitWithout"){
      this.$router.go(-1)
    }else if(eventType === "refresh"){
      this.refresh()
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

  public changeIdL(data) {
    this.changeId = data
  }

  //refresh
  public refresh() {
    const oldData = [...this.data]
    let spliceData: any =[]
    if(this.changeId.length === 0) {
      return
    } else {
      for(let i = 0; i < this.changeId.length; i++) {
        oldData.forEach((item, index) => {
          if (item.id === this.changeId[i]) {
            spliceData = spliceData.concat(oldData.splice(index, 1))
          }
        })
      }
      this.data = spliceData.concat(oldData)
      this.changeId = []
    }
  }

  //点击保存修改按钮
  public submitChange() {
    console.log(this.$route.query.data)
    let data:any = this.$route.query.data
    let submitData = this.data
    let params:any = []
    console.log(submitData)
    for(let i=0;i<submitData.length;i++){
      if(submitData[i].planRank !== ''){
        if(submitData[i].planPercentage === ''){
          this.$message.error('planPercentage cannot be empty')
          return
        }
      }else if(submitData[i].planRank === ''){
        if(submitData[i].planPercentage !== ''){
          this.$message.error('planRank cannot be empty')
          return
        }
      }
    }
      for(let i=0;i<submitData.length;i++){
        submitData[i].switchId = data.id
        if(submitData[i].planRank !== '' && submitData[i].planPercentage !== ''){
            params.push(submitData[i])
            console.log(params)
          }
      }

    let url = '/route/order/technical/update'
    let dataList:any = []
    // postSearchResult( params,url).then(res => {
    //     if(res.code === Status.Ok){
    //       this.data = res.data
    //     }else{
    //       this.$message.warning(res.msg)
    //     }
    //   }).catch(error => {
    //     this.$message.warning(error.msg)
    //   })


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
    this.pagination = pager
    let searchP:any = this.searchParams
    let routeData1:any = this.$route.query.data
    console.log(this.searchParams)
    postSearchResult(
      {
        transactionId:routeData1.transactionId,
        id:routeData1.id,
        switchId: searchP.switchId ? searchP.switchId : "",
        trafficOrigination: searchP.trafficOrigination,
        commercialTrunk: searchP.commercialTrunk ? searchP.commercialTrunk : '',
        rateFrom: searchP.rate ? searchP.rate : "",
        rateTo: searchP.rateTo ? searchP.rateTo : "",
        asr: searchP.asr ? searchP.asr : "",
        cli: searchP.cli ? searchP.cli : "",
        sortField: sorter.field ? sorter.field : "",
        sortOrder: sorter.order ? sorter.order : ""
      },this.url).then(res => {
        this._dataCleaning(res)
      }).catch(error => {})
  }

    //form请求
  protected mounted() {
    this.routeParams()
    let url = '/route/droplist/switch'
    let data:any = this.$route.query.data
    getFormoptions({ transactionId: data.transactionId },url).then(res => {
        if (res.code === Status.Ok) {
          const data = res.data; // TODO searchOptions
          this.topFromOptions = formOptionsUtil(this.topFromOptions, data)
          this.withParameters(this.topFromOptions)
        } else {
          this.$message.error(Message.Unknown)
        }
      })
      .catch(error => {
        console.log(error)
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
            this.topFromOptions[i].initIalValue = 'All'
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

  //返回上一页
  private back() {
    this.$router.go(-1)
  }

  private routeParams() {
    let url = '/route/order/technical/head'
    let jumpParams:any = this.$route.query.data
    console.log(jumpParams)
    postSearchResult({ switchId: jumpParams.id,transactionId:jumpParams.transactionId},url).then(res => {
        if (res.code === Status.Ok) {
          this.passParams = res.data
        } else {
          this.$message.error(Message.Unknown)
        }
      })
      .catch(error => {
        console.log(error)
      })
  }

  /**
   * 刷新，add edit等清除所选择的数据
   */
  private clearSelected() {
    let tableRef = this.$refs['simpleTable'] as any
    tableRef.clearSelected()
  }

  public getChildData(data){
    this.data = data
  }

  public selectChange(val, name) {
    console.log(val)
    console.log(name)
  }
}
</script>

<style scoped>
#technical >>> .ant-col-8{
  padding-left: 3% !important;
}
#technical >>> .ant-col-12{
  padding-left: 6% !important;
}
#technical >>> .ant-col-5{
  padding-left: 4px !important;
}
.head{
  height: 38px;
}
.goBack{
  position: fixed;
  z-index: 99;
  top: 11px;
}
.title{
  position: absolute;
  top: 18px;
  width: 100%;
  text-align: center;
  color:#474747;
  font-weight: bold;
  font-size: 18px;
}
.aRow{
  color:#000;
  font-size: 14px;
}
.topColor{
  color: #474747;
}
</style>
