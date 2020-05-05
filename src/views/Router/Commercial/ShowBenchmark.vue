<template>
  <div id="track">
    <div class="head">
      <div class="goBack" @click="back"><a-button type="primary" ghost> ＜ Go Back</a-button></div>
      <div class="title">Show Benchmark and constraint</div>
    </div>
    <div :style="{height: '60px',paddingLeft: '24px',paddingTop: '20px'}">
        <a-row class="aRow">
          <a-col  :span="7" :style="{paddingBottom: '17px'}">Route class: &nbsp;<span class="topColor">{{routeClass ?routeClass :''}}</span></a-col>
          <a-col  :offset="1" :span="7" :style="{paddingBottom: '17px'}">Product: &nbsp; <span class="topColor">{{product?product:''}}</span></a-col>
          <a-col  :offset="1" :span="7">Begin Date:  &nbsp;<span class="topColor">{{passParams.beginDate ?passParams.beginDate :''}}</span></a-col>
        </a-row>
    </div>
    <!-- table -->
    <div class="tableTitle">
      <div>&nbsp;</div>
      <span>Management of Inclusion</span>
    </div>
    <div class="showTable">
      <simple-table :columns="copyColumns" :data="data" :border="border" :isPag="isPag" :disabledSelect="disabledSelect" :isAlphabet="isAlphabet" :isInput="isInput"></simple-table>
    </div>
    <div class="tableTitle">
      <div>&nbsp;</div>
      <span>Management of Exclusion</span>
    </div>
    <div class="showTable">
      <simple-table :columns="copyColumns2" :data="data2" :border="border" :isPag="isPag" :disabledSelect="disabledSelect" :isAlphabet="isAlphabet" :isInput="isInput"></simple-table>
    </div>
    <div class="tableTitle">
      <div>&nbsp;</div>
      <span>Route class Benchmark</span>
    </div>
    <div class="showTable">
      <simple-table :columns="copyColumns3" :data="data3" :border="border" :isPag="isPag" @handletablechange="tableChangeRouteClass" :disabledSelect="disabledSelect" :isAlphabet="isAlphabet" :isInput="isInput"></simple-table>
    </div>
    <div class="tableTitle">
      <div>&nbsp;</div>
      <span>Routing Product Benchmark</span>
    </div>
    <div class="showTable">
      <simple-table :columns="copyColumns4" :data="data4" :border="border" :isPag="isPag" @handletablechange="tableChangeProduct" :disabledSelect="disabledSelect" :isAlphabet="isAlphabet" :isInput="isInput"></simple-table>
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
  routeGuideDetialsBtn,
  inclusionColumns,
  exclusionColumns,
  routeClassColumns,
  routeProductColumns
} from "@/untils/router"
import { Mutation,Getter } from 'vuex-class'

import {
  getFormoptions,
  postSearchResult,
  postComercialAdd
} from "@/api/router"

import { Status, Message, Pagination, IPagination } from "../index"

import { debounce } from "ts-debounce"
Component.registerHooks([
  'beforeEnter',
  'beforeRouteEnter',//进入路由之前
  'beforeRouteLeave',//离开路由之前
  'beforeRouteUpdate'
])
@Component({
  components: {
    FoldContainer: () => import("@/components/router/FoldContainer.vue"),
    OperateBtn: () => import("@/components/router/OperateBtn.vue"),
    SimpleTable: () => import("@/components/router/SimpleTable.vue"),
    Model: () => import("@/common/Model/index.vue"),
    FormGroup: () => import("@/components/router/FormGroup.vue")
  }
})
export default class routeGuideDetails extends Vue {

 @Mutation('setCommercialData') mutationCommercialData
 @Mutation('setRoute') mutationRoute

  private copyColumns: IColumns[] = inclusionColumns
  private copyColumns2: IColumns[] = exclusionColumns
  private copyColumns3: IColumns[] = routeClassColumns
  private copyColumns4: IColumns[] = routeProductColumns
  private data: any = []
  private data2: any = []
  private data3: any = []
  private data4: any = []
  private border: boolean = true

  //是否显示字母表
  private isAlphabet:boolean = false

  //是否需要勾选
  private disabledSelect:boolean = true

    //是否可编辑
  private isInput:boolean = false

  private isPag:boolean = false

  //保存params
  private searchParams: any


  private params: any = {
    product: '',
    routeClass: '',
    beginDate: '',
    endDate:'',
    type:'',
    sortField: '',
    sortOrder: ''
  }
  
  private passParams:any = {
    product: '',
    routeClass: '',
    beginDate: '',
  }

  private dataOptions:any
 
  private product:string = ''

  private routeClass:string = ''

  //返回上一页
  private back() {
 
 
 
    this.$router.go(-1)
  }

   protected beforeRouteEnter(to: any, from: any, next: any) {
    console.log('enter')
    console.log(from)
    next((vm) => {
      console.log(vm)
      vm.mutationRoute(from.name)
    })
  }
  protected mounted() {
    getFormoptions({ id: 2 }).then(res => {
        if (res.code === Status.Ok) {
          this.dataOptions = res.data; // TODO searchOptions
          this.routeParams()
        }
      })
      .catch(error => {
        console.log(error)
      })
  }

  private url = '/route/commercial-routing/showbenchmarks'
  private routeParams() { 
    this.passParams = this.$route.query
    console.log(this.passParams)
    console.log(this.dataOptions)
    for(let i=0;i<this.dataOptions.product.length;i++){
      if(this.passParams.product === this.dataOptions.product[i].id){
        this.product = this.dataOptions.product[i].name
      }
    }
    for(let i=0;i<this.dataOptions.routeClass.length;i++){
      if(this.passParams.routeClass === this.dataOptions.routeClass[i].id){
        this.routeClass = this.dataOptions.routeClass[i].name
      }
    }
    this.params.product = this.passParams.product
    this.params.routeClass = this.passParams.routeClass
    this.params.beginDate = this.passParams.beginDate
    this.params.endDate = this.passParams.endDate

    // this.searchParams = jumpParams
    postSearchResult(this.params,this.url).then(res => {
        if (res.code === Status.Ok) {
          this._dataCleaning(res)
          
        } else {
          this.$message.error(res.msg)
        }
      })
      .catch(error => {
        this.$message.error(Message.Net_anomaly)
      })
  }

  public _dataCleaning(res) {
    this.data = res.data.inclusionVOList
    this.data2 = res.data.exclusionVOList
    this.data3 = res.data.routeClassBenchmarkVOList
    this.data4 = res.data.routeProductBenchmarkVOList
  }

  public tableChangeRouteClass(pagination, filters, sorter) {
    console.log('1'+sorter)
    postSearchResult(
      {
        product: this.passParams.product ? this.passParams.product : '',
        routeClass: this.passParams.routeClass ? this.passParams.routeClass : '',
        beginDate: this.passParams.beginDate ? this.passParams.beginDate : '',
        endDate: this.passParams.endDate ? this.passParams.endDate : '',
        type:'routeClass',
        sortField: sorter.field ? sorter.field : "",
        sortOrder: sorter.order ? sorter.order : ""
      },this.url).then(res => {
        if (res.code === Status.Ok) {
          this.data3 = res.data.routeClassBenchmarkVOList
          
        } else {
          this.$message.error(Message.Unknown)
        }
      }).catch(error => {
        this.$message.error(Message.Net_anomaly)
      })
  }

  public tableChangeProduct(pagination, filters, sorter) {
    console.log('2'+sorter)
    postSearchResult(
      {
        product: this.passParams.product ? this.passParams.product : '',
        routeClass: this.passParams.routeClass ? this.passParams.routeClass : '',
        beginDate: this.passParams.beginDate ? this.passParams.beginDate : '',
        endDate: this.passParams.endDate ? this.passParams.endDate : '',
        type:'routeProduct',
        sortField: sorter.field ? sorter.field : "",
        sortOrder: sorter.order ? sorter.order : ""
      },this.url).then(res => {
        if (res.code === Status.Ok) {
          this.data4 = res.data.routeProductBenchmarkVOList
          
        } else {
          this.$message.error(Message.Unknown)
        }
      }).catch(error => {
        this.$message.error(Message.Net_anomaly)
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
.tableTitle div{
    border: 1px solid rgba(245,177,72,1);
    width: 10px;
    height: 10px;
    float: left;
    margin-right: 10px;
    background: rgba(245,177,72,1);
    margin-top: 4px;
}
.tableTitle span{
    font-size: 13px;
    font-weight: 600;
}
.tableTitle{
  margin-bottom: 20px;
  margin-top: 40px;
  margin-left: 20px;
}
.showTable{
  padding-left: 20px;
  padding-right: 20px;
}
.showTable >>> .ant-table-body{
  border-radius: 6px;
}
</style>
