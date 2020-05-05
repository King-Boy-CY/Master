<template>
  <div id="track">
    <div class="head">
      <div class="goBack" @click="back"><a-button type="primary" ghost> ＜ Go Back</a-button></div>
      <div class="title">Switch configuration</div>
    </div>
    <div :style="{height: '75px',paddingLeft: '24px',paddingTop: '20px'}">
            <a-row class="aRow">
              <a-col :span="10" :style="{paddingBottom: '17px'}">Details of routing strategy for Route product: &nbsp; <span class="topColor">{{passParams.product?passParams.product:''}}</span></a-col>
              <a-col :offset="3" :span="9" :style="{paddingBottom: '17px'}">Route class: &nbsp;<span class="topColor">{{passParams.routeClass ?passParams.routeClass :''}}</span></a-col>
            </a-row>
          </div>
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
      <nested-table :columns="copyColumns" :data="data" ref="nestedTable" :border="border" :isAlphabet="isAlphabet" :isInput="isInput" @selectedRows="onSelectChange"></nested-table>
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
  switchConfigurationCol,
  formOptionsUtil,
  switchConfigurationBtn
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
export default class switchConfiguration extends Vue {

  //OperateBtn 传值
  private btnList: IBtnList[] = switchConfigurationBtn


  // 接收子组件table勾选过的值
  private selectedRows: any[] = []
  // user-defined 模态框可选数据
  private plainOptions: string[] = [
    "Switch",
    "Traffic origination",
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
    "Route10"
  ]
  //private expand: boolean = false

  private columns: IColumns[] = switchConfigurationCol
  private copyColumns: IColumns[] = switchConfigurationCol
  private data: any = []
  private border: boolean = true

  //是否显示字母表
  private isAlphabet:boolean = false

  //是否可编辑
  private isInput:boolean = true


  //保存跳转过来的参数
  private passParams: any = {
    product: '',
    routeClass: ''
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
    if (eventType === "submitChange") {
      this.submitChange()
    }else if(eventType === "editTechnical"){
      if(this.selectedRows.length === 1) {
        this.$router.push({ name: 'TechnicaTrunk', query: { 'data': this.selectedRows[0] }})
      }else{
        this.$message.warning('Only one record can be selected')
      }
    }else if(eventType === "refresh"){
      this.routeParams()
    }
  }

  //点击submitChange
  private submitChange() {
    let submitData = this.selectedRows
    let rateList:any = []
    for(let i=0;i<submitData.length;i++){
      for(let j = 0;j<submitData[i].routeName.length;j++){
        if(submitData[i].routeName[j].routeName === 'Rank'){
          rateList.push(submitData[i].routeName[j])
        }
      }
    }

    if(rateList != []){
      // debugger
      for(let r=0;r<rateList.length;r++){
        if(rateList[r].route10 !== '' && rateList[r].route10 !== null){
          if(rateList[r].route9 === '' || rateList[r].route8 === '' ||rateList[r].route7 === '' ||rateList[r].route6 === '' ||rateList[r].route5 === '' ||rateList[r].route4 === '' ||rateList[r].route3 === '' ||rateList[r].route2 === '' ||rateList[r].route1 === '' || rateList[r].route9 === null || rateList[r].route8 === null ||rateList[r].route7 === null ||rateList[r].route6 === null ||rateList[r].route5 === null ||rateList[r].route4 === null ||rateList[r].route3 === null ||rateList[r].route2 === null ||rateList[r].route1 === null){
            alert('123123')
          }else{
            this.postSubmit()
          }
        }else if(rateList[r].route9 !== '' && rateList[r].route9 !== null){
          if(rateList[r].route8 === '' ||rateList[r].route7 === '' ||rateList[r].route6 === '' ||rateList[r].route5 === '' ||rateList[r].route4 === '' ||rateList[r].route3 === '' ||rateList[r].route2 === '' ||rateList[r].route1 === '' || rateList[r].route8 === null ||rateList[r].route7 === null ||rateList[r].route6 === null ||rateList[r].route5 === null ||rateList[r].route4 === null ||rateList[r].route3 === null ||rateList[r].route2 === null ||rateList[r].route1 === null){
            alert('123123')
          }else{
            this.postSubmit()
          }
        }else if(rateList[r].route8 !== '' && rateList[r].route8 !== null){
          if(rateList[r].route7 === '' ||rateList[r].route6 === '' ||rateList[r].route5 === '' ||rateList[r].route4 === '' ||rateList[r].route3 === '' ||rateList[r].route2 === '' ||rateList[r].route1 === ''||rateList[r].route7 === null ||rateList[r].route6 === null ||rateList[r].route5 === null ||rateList[r].route4 === null ||rateList[r].route3 === null ||rateList[r].route2 === null ||rateList[r].route1 === null){
            alert('123123')
          }else{
            this.postSubmit()
          }
        }else if(rateList[r].route7 !== '' && rateList[r].route7 !== null){
          if(rateList[r].route6 === '' ||rateList[r].route5 === '' ||rateList[r].route4 === '' ||rateList[r].route3 === '' ||rateList[r].route2 === '' ||rateList[r].route1 === '' ||rateList[r].route6 === null ||rateList[r].route5 === null ||rateList[r].route4 === null ||rateList[r].route3 === null ||rateList[r].route2 === null ||rateList[r].route1 === null){
            alert('123123')
          }else{
            this.postSubmit()
          }
        }else if(rateList[r].route6 !== '' && rateList[r].route6 !== null){
          if(rateList[r].route5 === '' ||rateList[r].route4 === '' ||rateList[r].route3 === '' ||rateList[r].route2 === '' ||rateList[r].route1 === '' ||rateList[r].route5 === null ||rateList[r].route4 === null ||rateList[r].route3 === null ||rateList[r].route2 === null ||rateList[r].route1 === null){
            alert('123123')
          }else{
            this.postSubmit()
          }
        }else if(rateList[r].route5 !== '' && rateList[r].route5 !== null){
          if(rateList[r].route4 === '' ||rateList[r].route3 === '' ||rateList[r].route2 === '' ||rateList[r].route1 === ''||rateList[r].route4 === null ||rateList[r].route3 === null ||rateList[r].route2 === null ||rateList[r].route1 === null){
            alert('123123')
          }else{
            this.postSubmit()
          }
        }else if(rateList[r].route4 !== '' && rateList[r].route4 !== null){
          if(rateList[r].route3 === '' ||rateList[r].route2 === '' ||rateList[r].route1 === ''||rateList[r].route3 === null ||rateList[r].route2 === null ||rateList[r].route1 === null){
            alert('123123')
          }else{
            this.postSubmit()
          }
        }else if(rateList[r].route3 !== '' &&rateList[r].route3 !== null){
          if(rateList[r].route2 === '' ||rateList[r].route1 === ''||rateList[r].route2 === null ||rateList[r].route1 === null){
            alert('123123')
          }else{
            this.postSubmit()
          }
        }else if(rateList[r].route2 !== '' && rateList[r].route2 !== null){
          if(rateList[r].route1 === '' ||rateList[r].route1 === null){
            alert('123123')
          }else{
            this.postSubmit()
          }
        }
      }
    }

  }

  private postSubmit() {
    let selectData = this.selectedRows
    let params:any = []
    let url = '/route/order/switch/update'
    for(let i=0;i<selectData.length;i++){
      params.push({
        id:selectData[i].id,
        percentage1:selectData[i].routeName[1].route1,
        percentage2:selectData[i].routeName[1].route2,
        percentage3:selectData[i].routeName[1].route3,
        percentage4:selectData[i].routeName[1].route4,
        percentage5:selectData[i].routeName[1].route5,
        percentage6:selectData[i].routeName[1].route6,
        percentage7:selectData[i].routeName[1].route7,
        percentage8:selectData[i].routeName[1].route8,
        percentage9:selectData[i].routeName[1].route9,
        percentage10:selectData[i].routeName[1].route10,
        rank1:selectData[i].routeName[2].route1,
        rank2:selectData[i].routeName[2].route2,
        rank3:selectData[i].routeName[2].route3,
        rank4:selectData[i].routeName[2].route4,
        rank5:selectData[i].routeName[2].route5,
        rank6:selectData[i].routeName[2].route6,
        rank7:selectData[i].routeName[2].route7,
        rank8:selectData[i].routeName[2].route8,
        rank9:selectData[i].routeName[2].route9,
        rank10:selectData[i].routeName[2].route10
      })
    }
    console.log(params)
    postSearchResult(params,url).then(res => {
        if (res.code === Status.Ok) {
            this.clearSelected()
            this.data = res.data.switchDetailVO
            console.log(this.data)
        } else {
          this.$message.error(Message.Unknown)
        }
      })
      .catch(error => {
        console.log(error)
      })

  }

  //返回上一页
  private back() {
    this.$router.go(-1)
  }

  protected mounted() {
      this.routeParams()

  }

  private routeParams() {
    let url = '/route/order/switch'
    let jumpParams = this.$route.query.data
    console.log(jumpParams)
    const params = {
        transactionId:jumpParams
    }
    postSearchResult(params,url).then(res => {
        if (res.code === Status.Ok) {
          this.passParams = res.data
          this.data = res.data.switchDetailVO
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
    let tableRef = this.$refs['nestedTable'] as any
    tableRef.clearSelected()
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
