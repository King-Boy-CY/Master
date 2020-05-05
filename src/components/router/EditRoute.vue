<template>
  <div id="editRoute">
    <div id="ttt">
      <model title="Edit commercial route" width="90%" v-model="checkValue" height="570px">
        <template slot="model-body">
          <fold-container>
            <template slot="formgroup">
              <form-group ref="formgroup" :formoptions="searchOptions" @Submit="searchSubmit">
                <a-row>
                  <a-col :span="24" :style="{ textAlign: 'center' }">
                    <a-button
                      type="primary"
                      html-type="submit"
                      icon="search"
                      :style="{ borderRadius: '50px 50px 50px 50px' }"
                    >Search</a-button>
                    <a-button
                      :style="{ marginLeft: '8px', backgroundColor: 'rgb(245,177,72)', color: '#fff', border: 0, borderRadius: '50px 50px 50px 50px' }"
                      @click="handleReset"
                      icon="undo"
                    >Reset</a-button>
                  </a-col>
                </a-row>
              </form-group>
            </template>
          </fold-container>
          <div class="route-table">
            <a-table
              :columns="columns"
              :dataSource="data"
              :scroll="{x: true}"
              :pagination="false"
              @change="handleTableChange"
              :border="border"
              :rowKey="record => record.id"
              :loading= "loading"
            >
              <template v-for="col in ['planPercentage']" :slot="col" slot-scope="text, record">
                <div :key="col">
                  <a-input
                    style="margin: -5px 0;width:150px"
                    :value="text"
                    @change="e => handleChange(e.target.value, record.commercialTrunk, col)"
                  />
                </div>
              </template>
            </a-table>
          </div>
        </template>
        <template slot="model-footer">
          <a-row>
            <a-col :span="24" :style="{ textAlign: 'center' }">
              <a-button
                :style="{ marginLeft: '20px', minWidth: '100px', borderRadius: '50px' }"
                type="primary"
                @click="reflash"
                :disabled= "editRouteList.length > 0 ? false : true"
              >Refresh</a-button>
              <a-button
                :style="{ marginLeft: '20px', minWidth: '100px', borderRadius: '50px' }"
                :disabled="changedData.length > 0 ? false : true"
                @click="changeSubmit"

              >Submit change</a-button>
              <a-button
                :style="{ marginLeft: '20px', minWidth: '100px', borderRadius: '50px' }"
                @click="exitWithout"
              >Exit without change</a-button>
            </a-col>
          </a-row>
        </template>
      </model>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { Component, Prop, Emit, Watch} from "vue-property-decorator"
import { Getter, Mutation} from 'vuex-class'
import { Status, Message, Pagination, IPagination } from "@/views/Router/index"
import {
  IColumns,
  IFormoptions,
  formOptionsUtil,
  editRouteColumns,
  editRouteOptions,
} from "@/untils/router"
import {percentReg} from '@/common/RegExp/number'
import { getFormoptions, postSearchResult } from "@/api/router"
import { debounce } from "ts-debounce"

@Component({
  components: {
    FoldContainer: () => import("@/components/router/FoldContainer.vue"),
    SimpleTable: () => import("@/components/router/SimpleTable.vue"),
    Model: () => import("@/common/Model/index.vue"),
    FormGroup: () => import("@/components/router/FormGroup.vue")
  }
})
export default class EditRoute extends Vue {

  @Prop() private parentdata!:any
  private form: any
  // 控制form隐藏显示
  private collapsed: boolean = false

  //是否显示字母表
  private isAlphabet: boolean = false
  // 接收子组件table勾选过的值
  private selectedRows: any[] = []

  private columns: IColumns[] = editRouteColumns
  private copyColumns: IColumns[] = editRouteColumns
  private data: any = this.parentdata
  private border: boolean = true

  private searchOptions: IFormoptions[] = editRouteOptions

  // 指定选中项的key数组，需要和onChange进行配合
  private selectedRowKeys: string[] = []

  //排序
  private pagination: IPagination = Pagination

  //保存params
  private searchParams: any

  private changeId: number[] = []
  private changedData: any[] = []
  private loading: boolean = false
  private disabledSelect: boolean = true

  @Getter('editRouteList') editRouteList
  @Mutation('setEditRoutData') setEditRoute

  
  //接收子组件传过来的控制modal显示隐藏
  @Prop() private isEditRoute!: boolean
  @Prop({
    type: Object,
    default: {}
  }) private parentParams!: object



  @Watch('isEditRoute', {
    immediate: true
  })
  onChangeModal(newVal: any, oldVal: any) {
    console.log(newVal)
    if (!newVal) {
      this.data = []
      this.changedData = []
      this.selectedRowKeys = []
    } else{
      this.data = this.editRouteList
      this.changedData = this.editRouteList
      console.log(this.changedData)
    }
  }
  get checkValue() {
    return this.isEditRoute
  }
  set checkValue(isModal) {
    this.$emit("modalVis", isModal)
  }

  //exitWithout
  private exitWithout() {
    this.$emit("exitWithout", false)
  }

  //search submit
  private url: string = "/route/commercial-routing/query"
  private searchSubmit(err: any, values: any): void {
    console.log(this.editRouteList)
    const params = {
      commercialTrunk: values.commercialTrunk ? values.commercialTrunk : "",
      rate: values.rate ? values.rate : "",
      rateTo: values.rateTo ? values.rateTo : "",
      asr: values.asr ? values.asr : "",
      cli: values.cli ? values.cli : "",
      sortField: this.pagination.sortField,
      sortOrder: this.pagination.sortOrder
    }
    this.searchParams = params
    // TODO 点击search时的处理逻辑
    this.loading= true
    postSearchResult(Object.assign(params,this.parentParams), this.url)
      .then(res => {
        this.loading = false
        if (res.code === Status.Ok) {
          this._dataCleaning(res)
        } else {
          this._dataCleaning(res)
          this.$message.error(res.msg)
        }
      })
      .catch(error => {
        this.loading = false
        this.$message.error(Message.Net_anomaly)
      })

  }

  /**
   * rate 排序 变化时触发
   *
   */
  public handleTableChange(pagination: any, filters: any, sorter: any) {
    console.log(pagination)
    const pager = { ...pagination }
    this.pagination = pager
    const params = {
        commercialTrunk:this.searchParams.commercialTrunk,
        rate:this.searchParams.rate,
        rateTo:this.searchParams.rateTo,
        asr:this.searchParams.asr,
        cli:this.searchParams.cli,
        sortField: sorter.field ? sorter.field : "",
        sortOrder: sorter.order ? sorter.order : ""
      }
    postSearchResult(
      Object.assign(params,this.parentParams),
      this.url
    )
      .then(res => {
        this._dataCleaning(res)
      })
      .catch(error => {})
  }

  //reflash
  private reflash() {
    console.log(this.editRouteList)
    this.loading = true
    const oldData = [...this.data]
    let spliceData: any =[]
    if(this.editRouteList.length === 0) {
      this.loading = true
      return
    } else {
      for(let i = 0; i < this.editRouteList.length; i++) {
        oldData.forEach((item, index) => {
          if (item.commercialTrunk === this.editRouteList[i].commercialTrunk) {
            spliceData = spliceData.concat(oldData.splice(index, 1))
          }
        })
      }
      this.data = spliceData.concat(oldData)
      this.changeId = []
      this.loading = false
    }

  }
  // private selectChange:any
  private changeSubmit() {
    const percentPattern: RegExp = new RegExp(percentReg)
    let totalPercentage: number = 0
    const changedLength: number = this.changedData.length
      if(this.changedData.length !== 0 && this.changedData.length <= 10) {
        for (let i = 0; i < this.changedData.length; i++) {
          let a:boolean = percentPattern.test(this.changedData[i].planPercentage)
          if(a === false) {
            this.$error({title:'planPercentage',content:'Content can only be a percentage'})
            totalPercentage = 0
            return
          } else {
            totalPercentage += parseFloat(this.changedData[i]['planPercentage'].slice(0,-1)) * 1000
          }
        }
        if (totalPercentage/1000 > 100) {
          totalPercentage = 0
          this.$error({title:'Total',content: 'The total cannot be greater than 100%'})
          return
        }
        this.setEditRoute(this.changedData)
        console.log(this.changedData)
        this.$emit("changeSubmit", this.changedData)
      }else{
        this.$message.warning('Check 10 pieces of data at most')
      }
  }

  private _dataCleaning(data) {
    let routeList:any = this.editRouteList
    if(routeList.length === 0){
      const pagination = { ...this.pagination }
      this.data = data.data
      this.pagination = pagination
    }else{
      for(let i=0;i < routeList.length; i++){
        for(let j=0;j < data.data.length; j++){
          if(routeList[i].commercialTrunk === data.data[j].commercialTrunk ){
            data.data[j].planPercentage = routeList[i].planPercentage
            const pagination = { ...this.pagination }
            this.data = data.data
            this.pagination = pagination
            this.$emit("editRouteData", this.data)
          }
        }
      }
    }

  }
  /**
   * Form Reset
   */
  public handleReset() {
    const ref: any = this.$refs["formgroup"]
    ref.resetFields()
  }

  public onSelectChange(selectedRowKeys, selectedRows) {
    console.log("selectedRowKeys change:", selectedRowKeys)
    console.log("selectedRows change", selectedRows)
    this.selectedRowKeys = selectedRowKeys
    this.selectedRows = selectedRows
  }

  private findId(key): boolean{
    return this.changeId.indexOf(key) > -1
  }

  private handleChange(value, key, column) {
    if(this.changeId.length === 0) {
      this.changeId.push(key)
    } else if(!this.findId(key)) {
      console.log(this.findId(key))
      this.changeId.push(key)
    }
    const newData = [...this.data]
    const target = newData.filter(item => key === item.commercialTrunk)[0]
    console.log(target)
    if (target) {
      target[column] = value
      this.data = newData
      if (this.changedData.length !== 0) {
        const val = this.changedData.filter(item => key === item.commercialTrunk)[0]
        if (!val) {
          console.log(this.changedData)
          this.changedData.push(target)
        } else {
          this.changedData.forEach((item) => {
            if (item.commercialTrunk === key) {
              item['planPercentage'] = value
            }
          })
        }

      } else {
         this.changedData.push(target)
      }
    }
    for(let i=0;i<this.changedData.length;i++){
      if(this.changedData[i].planPercentage==='0%' || this.changedData[i].planPercentage==='' ||this.changedData[i].planPercentage==='%' ||this.changedData[i].planPercentage==='0'){
        this.changedData.splice(i,1)
      }
    }
    console.log(this.changedData)
  }

  //form请求
  protected mounted() {
    this.data = formOptionsUtil(this.searchOptions,this.data)
    // getFormoptions({ id: 4 })
    //   .then(res => {
    //     if (res.code === Status.Ok) {
    //       console.log('editroute')
    //       const data = res.data // TODO searchOptions
    //       this.searchOptions = formOptionsUtil(this.searchOptions, data)
    //     } else {
    //       this.$message.error(Message.Unknown)
    //     }
    //   })
    //   .catch(error => {
    //     console.log(error)
    //   })
  }
}
</script>
<style scoped>
.route-table >>> .ant-table td {
  white-space: nowrap;
  text-align: center;
}

.route-table >>> .ant-table-thead > tr > th {
  font-size: 14px;
  padding: 2px;
  vertical-align: middle;
  text-align: center;
  background: rgba(232, 234, 246, 1);
  height: 40px;
}
.route-table >>> .ant-table-pagination.ant-pagination {
  margin-left: 20px;
  float: left;
}
</style>
