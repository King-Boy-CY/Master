<!-- 不带编辑的table -->
<template>
  <div class="components-table">
     <!-- 字母表 -->
    <div class="alphabetList" v-if="isAlphabet">
      <a-button class="resetBtn" v-for="(item, index) in alphabet" :class="{isActive: isActive === index} " :key="index" @click="toggleLetter(item,index)">{{item}}</a-button>
    </div>
    <!-- table -->
    <div class="route-table">
      <a-table :columns="columns"
        :dataSource="data"
        :rowKey="record => record.id"
        :rowSelection="disabledSelect === true ? null:{selectedRowKeys: selectedRowKeys, onChange:onSelectChange}"
        :pagination="pagination"

        align="center"
        @change="handleTableChange"
        :bordered="border"
        :scroll="{x: true}"
        :loading="loading"
      >
        <template slot="asrMinimum" slot-scope="asrMinimum">
          <div >{{asrMinimum}}<span v-if="asrMinimum !== '' ">%</span></div>
        </template>
        <template slot="remark" slot-scope="remark">
          <div :title="remark">{{remark | ellipsis}}</div>
        </template>
        <template slot="mou" slot-scope="mou">
          <div v-if="mou === ''"></div>
          <div v-else>{{mou*1000}}</div>
        </template>
        <template slot="numberOfCalls" slot-scope="numberOfCalls">
          <div v-if="numberOfCalls === ''"></div>
          <div v-else>{{numberOfCalls*1000}}</div>
        </template>
        <template slot="route1" slot-scope="route1">
          <span v-if="route1 === null">&nbsp;</span>
          <span v-else>{{route1.commercialTrunk}}<br/> {{route1.planPercentage}}  {{route1.rate}}</span>
        </template>
        <template slot="route2" slot-scope="route2">
          <span v-if="route2 === null">&nbsp;</span>
          <span v-else>{{route2.commercialTrunk}}<br/> {{route2.planPercentage}}  {{route2.rate}}</span>
        </template>
        <template slot="route3" slot-scope="route3">
          <span v-if="route3 === null">&nbsp;</span>
          <span v-else>{{route3.commercialTrunk}}<br/> {{route3.planPercentage}}  {{route3.rate}}</span>
        </template>
        <template slot="route4" slot-scope="route4">
          <span v-if="route4 === null">&nbsp;</span>
          <span v-else>{{route4.commercialTrunk}}<br/> {{route4.planPercentage}}  {{route4.rate}}</span>
        </template>
        <template slot="route5" slot-scope="route5">
          <span v-if="route5 === null">&nbsp;</span>
          <span v-else>{{route5.commercialTrunk}}<br/> {{route5.planPercentage}}  {{route5.rate}}</span>
        </template>
        <template slot="route6" slot-scope="route6">
          <span v-if="route6 === null">&nbsp;</span>
          <span v-else>{{route6.commercialTrunk}}<br/> {{route6.planPercentage}}  {{route6.rate}}</span>
        </template>
        <template slot="route7" slot-scope="route7">
          <span v-if="route7 === null">&nbsp;</span>
          <span v-else>{{route7.commercialTrunk}}<br/> {{route7.planPercentage}}  {{route7.rate}}</span>
        </template>
        <template slot="route8" slot-scope="route8">
          <span v-if="route8 === null">&nbsp;</span>
          <span v-else>{{route8.commercialTrunk}}<br/> {{route8.planPercentage}}  {{route8.rate}}</span>
        </template>
        <template slot="route9" slot-scope="route9">
          <span v-if="route9 === null">&nbsp;</span>
          <span v-else>{{route9.commercialTrunk}}<br/> {{route9.planPercentage}}  {{route9.rate}}</span>
        </template>
        <template slot="route10" slot-scope="route10">
          <span v-if="route10 === null">&nbsp;</span>
          <span v-else>{{route10.commercialTrunk}}<br/> {{route10.planPercentage}}  {{route10.rate}}</span>
        </template>
        <template v-for="col in ['planPercentage','planRank']" :slot="col" slot-scope="text, record">
          <div :key="col">
            <a-input
              style="margin: -5px 0"
              :value="text"
              @change="e => handleChange(e.target.value, record.id, col)"
            />
          </div>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script lang='ts'>
import Vue from 'vue'
import { Component, Prop, Emit } from 'vue-property-decorator'
import { alphabet, IColumns } from '@/untils/router.ts'
import { Getter,Mutation } from 'vuex-class'




@Component({
  filters: {
    ellipsis(value: any): string {
      let remark: string = ''
      if(value.length > 64){
         remark = value.slice(0,64) + '...'
      }else{
        remark = value
      }
        return remark
    }
  }
})
export default class SimpleTable extends Vue {
  /**
   * Data
   */
  
  @Getter('commercialdataList') getterCommercialdata
  @Getter('route') getterRoute
  @Mutation('setEditRoutData') setEditRoute
  @Mutation('setCommercialData') mutationCommercialData
  @Mutation('setRoute') mutationRoute

    //字母集
  private alphabet: string[] = alphabet

    // 用于切换字母的状态
  private isActive: number = 0

  // 指定选中项的key数组，需要和onChange进行配合
  private selectedRowKeys: string[] = []

  private currentPage: number = 1
  private pageSize: number = 10

  private scrollX ? : any

  private proData:any = []

  private changeId: number[] = []



  /**
   * Prop
   */
  @Prop(Array) private columns!: IColumns[]
  @Prop({
    type: Number,
    default: 0
  })
  private propTotal!: number

  @Prop() private data?: any
  @Prop({
    type: Boolean,
    default: false
  }) private border!: boolean
  @Prop() private isAlphabet?: boolean
  @Prop() private isPag?: boolean
  @Prop({
    type: Boolean,
    default: false
  }) private loading!: boolean


  @Prop({
    type:Boolean,
    default: false
  }) private disabledSelect!: boolean
  /**
   * @Emit
   */
  @Emit('toggleLetter') private toggle_letter(letter: string, index: number): any {

  }

  // table 勾选后数据传给父元素
  @Emit('selectedRows') private selectChange(selectedRows: any[]): void {}

  //table 勾选数据传ID给父元素
  @Emit('selectedRowKeys') private selectKeys(selectedRows: any[]): void {}


  /**
   * Method
   */

  /**
   * 点击字母
   * toggleAlphabet
   */
  public toggleLetter(item: string, index: number):void {

    this.isActive = index
    this.toggle_letter(item,index)

  }

  /**
   * handleTableChange
   */
  @Emit('handletablechange') public handletablechange(pagination: any, filters: any,sorter: any) {

  }


  private handleTableChange(pagination: any, filters: any, sorter: any) {
    console.log(pagination)
    this.handletablechange(pagination, filters, sorter)
  }


  private clearSelected() {
    this.selectedRowKeys = []
  }

  public onSelectChange(selectedRowKeys,selectedRows) {
    console.log('selectedRowKeys change:',selectedRowKeys)
    console.log('selectedRows change',selectedRows)
    this.selectedRowKeys = selectedRowKeys
    this.selectChange(selectedRows)
    this.selectKeys(selectedRowKeys)
  }


  private findId(key): boolean{
    return this.changeId.indexOf(key) > -1
  }

  private handleChange(value, key, column) {
    // debugger
    if(this.changeId.length === 0) {
      this.changeId.push(key)
    } else if(!this.findId(key)) {
      console.log(this.findId(key))
      this.changeId.push(key)
    }
    this.$emit('changeId', this.changeId)
    console.log(this.data)
    const newData = [...this.data]
    const target = newData.filter(item => key === item.id)[0]
    if (target) {
      target[column] = value
      this.proData = newData
      this.$emit('dataChild', this.proData)
    }
  }

  /**
   * Computed
   */

  get calcScrollX() {
    if (
      this.selectedRowKeys.length == 0 ||
      this.selectedRowKeys.length == this.columns.length
    ) {
      // console.log('勾选中所有')
      if (this.scrollX) {
        return this.scrollX;
      }
      return (130 * this.selectedRowKeys.length) / 9 + "%";
    } else {
      // console.log('勾选个数低于总数')
      if (this.scrollX) {
        return ("" + this.scrollX).replace(
          /^(\d+)(%|px)$/,
          (match: any, num: any, unit: any) => {
            return (
              Math.ceil((num / this.columns.length) * this.selectedRowKeys.length) +
              unit
            );
          }
        );
      }
      return (
        (((130 * this.selectedRowKeys.length) / this.columns.length) *
          this.selectedRowKeys.length) /
        9 +
        20 +
        "%"
      );
    }
  }


  get pagination () {
    if(this.isPag === false){
      return false
    }else{
      return {
        total: this.propTotal,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'],
        current: this.currentPage,
        pageSize: this.pageSize,
        showTotal: (total: number, range: Array<string>) => {
          return `${range[0] || ""} - ${range[1] ||""} records / Total ${total} records`
        },
        onChange: (page: any, pageSize: any) => {
          this.currentPage = page
          this.pageSize = this.pageSize

        },

        onShowSizeChange: (current: any, size: any) => {
          this.currentPage = current
          this.pageSize = size
        }
      }
    }


  }

  protected mounted() {
   const data =this. getterCommercialdata
   console.log(data)
   if(Object.keys(data).length !== 0 ) {
     if(data.hasOwnProperty('selectedRowKeys')){
         this.selectedRowKeys = data.selectedRowKeys 
     }
    
   }
  
  }

}

</script>

<style  scoped>

  .route-table >>> .ant-table-tbody {

    background:rgba(255,255,255,1);
  }
  .route-table >>> .ant-table-thead > tr > th {
    font-size: 14px;
    padding: 10px 20px;
    vertical-align: middle;
    height:40px;
    white-space: nowrap;
    background: rgba(232,234,246,1);
    text-align: center;
    word-break:break-all;
    word-wrap:break-word;
  }

  .route-table >>> .ant-table-tbody > tr > td{
    border: none
  }

  .route-table >>> .ant-table td  {
    white-space: nowrap;
    vertical-align: middle;
    text-align: center;
    padding: 10px 20px;
  }


.route-table >>> .ant-table-pagination.ant-pagination {
  margin-left: 20px;
  float: left;
}
.alphabetList {
  display: flex;
  max-width: 1129px;
  justify-content: space-between;
}

.resetBtn {
  width:30px;
  height:30px;
  display: flex;
  justify-content: center;
  margin-right: 5px;
  border-color: #3e77d8;
  color:  #3e77d8;
  font-size: 14px;
  margin-bottom: 11px;

}
.isActive {
  background-color: #3e77d8;
  color: #fff;
}
</style>
