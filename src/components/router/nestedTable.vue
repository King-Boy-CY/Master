<!-- 不带编辑的table -->
<template>
  <div>
    <!-- 字母表 -->
    <div class="alphabetList" v-if="isAlphabet">
      <a-button class="resetBtn" v-for="(item, index) in alphabet" :class="{ isActive: isActive === index }" :key="index" @click="toggleLetter(item, index)">{{
        item
      }}</a-button>
    </div>
    <!-- table -->
    <div class="route-table">
      <a-table
        :columns="columns"
        :dataSource="data"
        :rowKey="record => record.id"
        :rowSelection="disabledSelect === true ? null:{selectedRowKeys: selectedRowKeys, onChange:onSelectChange}"
        :pagination="false"
        :scroll="{ x: true }"
        @change="handleTableChange"
        @expand="expand"
        style="word-break: break-all;"
      >
        <a-table
          size="default"
          style="margin-bottom:0;"
          :rowKey="record => record.routeName"
          slot="expandedRowRender"
          :columns="nestColumns"
          :dataSource="routeList"
          :pagination="false"
          id="nextTable"
        >
          <template slot="routeName" slot-scope="routeName">
            <div class="routeName">{{ routeName }}</div>
          </template>
          <template
            v-for="col in ['route1', 'route2', 'route3', 'route4', 'route5', 'route6', 'route7', 'route8', 'route9', 'route10']"
            :slot="col"
            slot-scope="text, record"
          >
            <div :key="col">
              <a-input
                style="margin: -5px 0"
                :value="text"
                @change="e => handleChange(e.target.value, record.routeName, col)"
                :disabled="record.routeName === 'Rate' || text === '' ? true : false"
              />
            </div>
          </template>
        </a-table>
      </a-table>
    </div>
  </div>
</template>

<script lang='ts'>
import Vue from 'vue'
import { Component, Prop, Emit } from 'vue-property-decorator'
import { alphabet, IColumns, nestedTableCol, nestedTableColInput } from '@/untils/router.ts'

@Component
export default class SimpleTable extends Vue {
  /**
   * Data
   */

  //字母集
  private alphabet: string[] = alphabet

  // 用于切换字母的状态
  private isActive: number = 0

  // 指定选中项的key数组，需要和onChange进行配合
  private selectedRowKeys: string[] = []

  private currentPage: number = 1
  private pageSize: number = 10

  private routeList: any = []

  private expandedRowKeys: any = []

  private changeId: number[] = []

  /**
   * Prop
   */
  @Prop() private columns?: IColumns[]
  @Prop({
    type: Number,
    default: 0
  })
  private propTotal!: number

  @Prop() private data?: any
  @Prop() private border?: boolean
  @Prop() private isAlphabet?: boolean
  @Prop() private isInput?: boolean

  @Prop({
    type:Boolean,
    default: false
  }) private disabledSelect!: boolean

  private nestColumns: any = this.isInput === false ? nestedTableCol : nestedTableColInput
  /**
   * @Emit
   */
  @Emit('toggleLetter') private toggle_letter(letter: string, index: number): any {}

  // table 勾选后数据传给父元素
  @Emit('selectedRows') private selectChange(selectedRows: any[]): void {}

  //table 勾选数据传ID给父元素
  @Emit('selectedRowKeys') private selectKeys(selectedRows: any[]): void {}

  protected mounted() {
    console.log(this.data)
  }

  /**
   * Method
   */

  /**
   * 点击字母
   * toggleAlphabet
   */
  public toggleLetter(item: string, index: number): void {
    this.isActive = index
    this.toggle_letter(item, index)
  }

  /**
   * handleTableChange
   */
  @Emit('handletablechange') public handletablechange(pagination: any, filters: any, sorter: any) {}

  private handleTableChange(pagination: any, filters: any, sorter: any) {
    console.log(pagination)
    this.handletablechange(pagination, filters, sorter)
  }

  private clearSelected() {
    this.selectedRowKeys = []
    this.expandedRowKeys = []
  }
  //点击展开按钮时触发
  private expand(expanded, record) {
    console.log(record)
    // this.expandedRowKeys = [] // 重置展开节点，只展开当前点击的节点（内部数据调用模板，无法做到同时几个内层表格数据直接缓存在页面）
    if (expanded) {
      this.routeList = record.routeName
    }
  }

  public onSelectChange(selectedRowKeys, selectedRows) {
    console.log('selectedRowKeys change:', selectedRowKeys)
    console.log('selectedRows change', selectedRows)
    this.selectedRowKeys = selectedRowKeys
    this.selectChange(selectedRows)
    this.selectKeys(selectedRowKeys)
  }

  private handleChange(value, key, column) {
    // debugger
    console.log(this.routeList)
    const newData = [...this.routeList]
    const target = newData.filter(item => key === item.routeName)[0]
    console.log(target)
    if (target) {
      console.log(target[column])
      console.log(value)
      if (value === '') {
        target[column] = null
      } else {
        target[column] = value
      }

      this.routeList = newData
    }
  }

  /**
   * Computed
   */

  get pagination() {
    return {
      total: this.propTotal,
      showSizeChanger: true,
      pageSizeOptions: ['10', '20', '50', '100'],
      current: this.currentPage,
      pageSize: this.pageSize,
      showTotal: (total: number, range: Array<string>) => {
        return `${range[0] || ''} - ${range[1] || ''} records / Total ${total} records`
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
</script>

<style  scoped>
.route-table >>> .ant-table td {
  /* white-space: nowrap; */
  text-align: center;
}



.route-table >>> .ant-table table {
  width: 2340px;
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

#nextTable >>>.ant-table-thead > tr > th{
  height: 0;
  padding: 0;
}

.alphabetList {
  display: flex;
}

.resetBtn {
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  margin-right: 5px;
  border-color: #3e77d8;
  color: #3e77d8;
  margin-top: 15px;
  font-size: 14px;
  margin-bottom: 12px;
}
.isActive {
  background-color: #3e77d8;
  color: #fff;
}
.tabl {
  position: relative;
  width: 100%;
  display: block;
}
.tabl tr {
  display: inline-block;
}
.tabl th,
td {
  display: block;
  width: 45px;
}
.routeName {
  text-align: right;
}
#nextTable >>> table tbody tr td:nth-child(1) {
  background: rgba(232, 234, 246, 1);
}
</style>
