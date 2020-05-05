<template>
  <div id="track">
    <div class="head">
      <div class="goBack" @click="back"><a-button type="primary" ghost> ＜ Go Back</a-button></div>
      <div class="title">Commercial route guide details</div>
    </div>
    <div :style="{height: '110px',paddingLeft: '24px',paddingTop: '20px'}">
            <a-row class="aRow">
              <a-col  :offset="1" :span="13" :style="{paddingBottom: '17px'}">Details of routing strategy for Route product: &nbsp; <span class="topColor">{{passParams.product?passParams.product:''}}</span></a-col>
              <a-col :offset="1" :span="9" :style="{paddingBottom: '17px'}">Route class: &nbsp;<span class="topColor">{{passParams.routeClass ?passParams.routeClass :''}}</span></a-col>
              <a-col  :offset="1" :span="13">Currency:  &nbsp;<span class="topColor">{{passParams.currency ?passParams.currency :''}}</span></a-col>
              <a-col :offset="1" :span="9">Traffic date:&nbsp;<span class="topColor">{{passParams.trafficDate?passParams.trafficDate:''}} &nbsp;to&nbsp;{{passParams.trafficDateTo?passParams.trafficDateTo:''}}</span> </a-col>
            </a-row>
          </div>
    
    <!-- table -->
    <div>
      <nested-table :columns="copyColumns" :data="data" :border="border" :disabledSelect="disabledSelect" :isAlphabet="isAlphabet" :isInput="isInput" @selectedRows="onSelectChange"></nested-table>
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
  routeGuideDetailsCol,
  formOptionsUtil,
  routeGuideDetialsBtn
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
    FormGroup: () => import("@/components/router/FormGroup.vue"),
    NestedTable: ()=> import("@/components/router/nestedTable.vue")
  }
})
export default class routeGuideDetails extends Vue {

  //OperateBtn 传值
  private btnList: IBtnList[] = routeGuideDetialsBtn


  // 接收子组件table勾选过的值
  private selectedRows: any[] = []
  // user-defined 模态框可选数据
  private plainOptions: string[] = [
    "Status",
    "Begin date",
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

  private columns: IColumns[] = routeGuideDetailsCol
  private copyColumns: IColumns[] = routeGuideDetailsCol
  private data: any = []
  private border: boolean = true

  //是否显示字母表
  private isAlphabet:boolean = false

  //是否需要勾选
  private disabledSelect:boolean = true

    //是否可编辑
  private isInput:boolean = false

  //保存跳转过来的参数
  private passParams: any = {
    product: '',
    routeClass: '',
    currency: '',
    trafficDate: '',
    trafficDateTo: ''
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
 

  /**点击
   * operateBtn时触发
   *
   */
  private operateClick(eventType: string): void {
    console.log(eventType)
    if (eventType === "ViewTechnicalRouting") {
        if(this.selectedRows.length === 1) {
          if(this.selectedRows[0].transactionId !== ''){
            this.$router.push({ name: 'ManagementTechnical', query: { 'data': this.selectedRows[0]}})
          }else{
            this.$message.warning('The selected transactionId Is empty Do not jump')
          }
        }else{
          this.$message.warning(Message.AtLeast_One)
        }
    }
  }


  //返回上一页
  private back() {
    this.$router.go(-1)
  }

  protected mounted() {
      this.routeParams()
  }

  private routeParams() {
    let url = '/route/guide/details'
    let jumpParams = this.$route.query.data
    console.log(jumpParams)
    getFormoptions({ id: jumpParams},url).then(res => {
        if (res.code === Status.Ok) {
          this.passParams = res.data[0]
          this.data = res.data[0].routeGuideDetailsVOList
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
  padding-left: 8px !important;
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
