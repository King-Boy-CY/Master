<template>
  <div id="track">
    <div class="head">
      <div class="goBack" @click="back"><a-button type="primary" ghost> ＜ Go Back</a-button></div>
      <div class="title">Commercial trunk connection</div>
    </div>
    <!--  表单部分 -->
    <fold-container>
      <template slot="formgroup">
        <form-group ref="formgroup" :formoptions="topFromOptions" @Submit="searchSubmit">
          <div slot="descriptionSlot" :style="{backgroundColor: 'white',paddingLeft: '24px',paddingTop: '20px'}">
            <a-row class="aRow">
              <a-col :offset="1" :span="13" :style="{paddingBottom: '17px'}">Details of routing strategy for Route product:&nbsp; <span class="topColor">{{passParams.product?passParams.product:''}}</span></a-col>
              <a-col :offset="1" :span="7" :style="{paddingBottom: '17px'}">Route class: &nbsp;<span class="topColor">{{passParams.routeClass ?passParams.routeClass :''}}</span></a-col>
              <a-col :offset="1" :span="13" :style="{paddingBottom: '17px'}">Currency: &nbsp;<span class="topColor">{{passParams.currency ?passParams.currency :''}}</span></a-col>
              <a-col :offset="1" :span="9" :style="{paddingBottom: '17px'}">Traffic date: &nbsp;<span class="topColor">{{passParams.trafficDate?passParams.trafficDate:''}} &nbsp;to&nbsp;{{passParams.trafficDateTo?passParams.trafficDateTo:''}}</span></a-col>
              <a-col :offset="1" :span="4" >Status: &nbsp;<span class="topColor">{{passParams.status?passParams.status:''}}</span></a-col>
              <a-col :offset="2" :span="4" >Begin date:&nbsp;<span class="topColor">{{passParams.beginDate?passParams.beginDate:''}}</span></a-col>
              <a-col :offset="2" :span="4" >Plan cost:&nbsp;<span class="topColor">{{passParams.planCost?passParams.planCost:''}}</span></a-col>
              <a-col :offset="2" :span="4" >Floor sell price:&nbsp;<span class="topColor">{{passParams.floorSellPrice?passParams.floorSellPrice:''}}</span></a-col>
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
      <simple-table :columns="copyColumns" :isPag="isPag" :disabledSelect="disabledSelect" :data="data" :border="border" :isAlphabet="isAlphabet" @handletablechange="tableChange" @selectedRows="onSelectChange"></simple-table>
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
  commercialTrunkCol,
  IFormoptions,
  commercialTrunkForm,
  formOptionsUtil
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
export default class commercialTrunk extends Vue {
  private form: any
  // 控制form隐藏显示
  private collapsed: boolean = false

  //OperateBtn 传值

  private btnList: IBtnList[] = []

  // 控制add modal
  private visible: boolean = false

  // 接收子组件table勾选过的值
  private selectedRows: any[] = []
  // user-defined 模态框可选数据
  private plainOptions: string[] = [
    "Commercial Trunk",
    "Account",
    "Rate",
    "Margin",
    "Plan Percentage",
    "Current percentage",
    "Acutual percentage",
    "MOU",
    "Number of calls",
    "ASR",
    "CLI",
    "NER",
    "MOS",
    "Begin date",
    "End date"
  ]
  //private expand: boolean = false

  private columns: IColumns[] = commercialTrunkCol
  private copyColumns: IColumns[] = commercialTrunkCol
  private data: any = []
  private border: boolean = true

  //是否显示字母表
  private isAlphabet:boolean = false

  //是否分页
  private isPag:boolean = false

  //是否需要勾选
  private disabledSelect:boolean = true

  // topFrom
  private topFromOptions: IFormoptions[] = commercialTrunkForm

  //分页
  private pagination: IPagination = Pagination

  //保存params
  private searchParams: any

  //保存跳转过来的参数
  private passParams: any = {
    product: '',
    routeClass: '',
    currency: '',
    trafficDate: '',
    trafficDateTo: '',
    status: '',
    beginDate: '',
    planCost: '',
    floorSellPrice :''
  }

  //search submit
  private url: string = "/route/guide/connection"
  private searchSubmit(err: any, values: any): void {
    console.log(values)
    let cli = 1
    if(values.cli === 'All'){
       cli = 1
    }else{
      cli = values.cli
    }
    const params = {
      params: {
        id:this.passParams.id,
        commercialTrunk: values.commercialTrunk ? values.commercialTrunk : "",
        rateBetween: values.rateBetween ? values.rateBetween : '',
        rateBetweenAnd: values.and ? values.and : "",
        asr: values.asr ? values.asr : "",
        cli: cli ? cli : ""
      },
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
    this.data = data.data
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
    // if (eventType === "add") {
    //   this.visible = true
    // }
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
    this.pagination = pager

    postSearchResult(
      {
        params: this.searchParams,
        sortField: sorter.field ? sorter.field : "",
        sortOrder: sorter.order ? sorter.order : ""
      },this.url).then(res => {
        this._dataCleaning(res)
      }).catch(error => {})
  }

    //form请求
  protected mounted() {
    getFormoptions({ id: 7 }).then(res => {
        if (res.code === Status.Ok) {
          const data = res.data; // TODO searchOptions
          this.topFromOptions = formOptionsUtil(this.topFromOptions, data)
        } else {
          this.$message.error(Message.Unknown)
        }
      })
      .catch(error => {
        console.log(error)
      })
      this.routeParams()
  }

  //返回上一页
  private back() {
    this.$router.go(-1)
  }

  private routeParams() {
    let url = '/route/guide/connect'
    let jumpParams = this.$route.query.data
    console.log(jumpParams)
    getFormoptions({ id: jumpParams},url).then(res => {
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

  public selectChange(val, name) {
    console.log(val)
    console.log(name)
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
