<!-- router模块table上面的操作按钮 -->
<template>
  <div class="operate-container">
    <div class="operate-list">
      <!-- BtnList -->
      <div class="btn-container">
        <ul class="btn-list">
          <li v-for="(item, index) in BtnList" :key="index" style="margin-bottom:5px;">
            <a-button
              v-if="item.name !== 'Upload'"
              class="btn"
              :disabled="item.disabled && item.disabled !== false ? item.disabled : false"
              :type="item.type"
              :icon="item.icon"
              @click="operateClick(item.eventType)"
            >
              <a-icon type="item.icon"></a-icon>
              <span v-html="item.name" style="line-height:13px"></span>
            </a-button>
            <a-upload
              v-else
              name="file"
              :fileList="fileList"
              @change="handleChange"
              accept=".csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              :beforeUpload="beforeUpload"
              :remove="handleRemove"
            >
              <a-button class="btn">
                <a-icon type="upload" />
                <span v-html="item.name" style="line-height:13px"></span>
              </a-button>
            </a-upload>
          </li>
        </ul>
      </div>
      <!-- User-defined -->
      <div>
        <a-button icon="scissor" class="user-defined" @click="() => (visible = !visible)">User-defined</a-button>
      </div>
    </div>
    <!-- user-defined 模态框 -->
    <model title="User-defined" v-if="useDefined" v-model="visible" width="800px" @Screencover="Return">
      <!-- model-body -->
      <template slot="model-body">
        <div class="All-code">
          <div :style="{ borderBottom: '1px solid #E9E9E9' }">
            <a-checkbox :indeterminate="indeterminate" @change="onCheckAllChange" :checked="checkAll">
              All
            </a-checkbox>
          </div>
          <br />
          <a-checkbox-group v-model="checkedList" @change="onChange">
            <a-row>
              <a-col :span="8" v-for="(item, index) in plainOptions" :key="index">
                <a-checkbox :value="item">{{ item }}</a-checkbox>
              </a-col>
            </a-row>
          </a-checkbox-group>
        </div>
      </template>
      <!-- model-footer -->
      <template slot="model-footer">
        <a-row>
          <a-col :span="24" :style="{ textAlign: 'center' }">
            <a-button type="primary" @click="Confirm">Confirm</a-button>
            <a-button style="margin-left:20px;" @click="Return">Return</a-button>
          </a-col>
        </a-row>
      </template>
    </model>
  </div>
</template>

<script lang='ts'>
import Vue from 'vue'
import { Component, Prop, Emit } from 'vue-property-decorator'
import { debounce } from 'ts-debounce'
import { IBtnList, alphabet } from '@/untils/router.ts'

@Component({
  components: {
    Model: () => import('@/common/Model/index.vue')
  }
})
export default class OperateBtn extends Vue {
  /**
   * Data
   */

  // 用于切换字母的状态
  private isActive: number = 0
  // 模态框显示
  private visible: boolean = false

  // 全选样式
  private indeterminate: boolean = false

  // 全选
  private checkAll: boolean = true

  //当前选中的数据
  private checkList: any[] = []

  private fileList: string[] = []

  /**
   * Prop
   */
  @Prop({
    type: Array,
    default: () => {
      return []
    }
  })
  private BtnList!: IBtnList[]

  // 是否使用useDefined
  @Prop({
    type: Boolean,
    default: true
  })
  private useDefined!: boolean

  @Prop({
    type: Array,
    default: () => {
      return []
    }
  })
  private plainOptions!: string[]

  @Prop({
    type: Array,
    default: () => {
      return []
    }
  })
  private columns!: any[]

  // 当前已选中
  private checkedList: any[] = this.plainOptions

  /**
   * @Emit
   */

  /**
   * operateClick 点击触发，参数传给父组件
   */
  @Emit('operateClick') private operateEvent(eventType: string): any {}

  @Emit('beforeUpload') private handleBeforeUpload(fileList: string[]): void {}

  /**
   * User-Defind 点击Confirm,参数传给父组件
   */
  @Emit('userDefindConfirm') private userDefindConfirm(checkboxColumns: any[]): void {}

  /**
   * Method
   */

  private operateClick1(eventType: string): any {
    console.log(1)
    this.operateEvent(eventType)
  }
  // click事件防抖
  private operateClick = debounce(this.operateClick1, 500)

  public Return(): void {
    this.visible = !this.visible
  }

  private beforeUpload(file) {
    console.log('beforeUpload')
    this.fileList = [...this.fileList, file]
    this.handleBeforeUpload(this.fileList)
    return false
  }
  private handleRemove(file) {
    const index = this.fileList.indexOf(file)
    const newFileList = this.fileList.slice()
    newFileList.splice(index, 1)
    this.fileList = newFileList
  }

  private handleUpload(): any {
    const { fileList } = this
    console.log(fileList)
    const formData = new FormData()
    fileList.forEach(file => {
      formData.append('file', file)
    })
    console.log(fileList)
    console.log(formData)
    return formData
  }
  private handleChange({file,fileList,event}) {
    this.fileList = [file]
  }

  // 全选触发
  public onCheckAllChange(e: any) {
    let newValue = Object.assign(this, {
      checkedList: e.target.checked ? this.plainOptions : [],
      indeterminate: false,
      checkAll: e.target.checked
    })
    e.target.checked && (this.checkList = this.plainOptions)
  }

  /**
   * 单击checkbox触发
   * onChange
   */
  public onChange(checkedList: any) {
    this.indeterminate = !!checkedList.length && checkedList.lenght < this.plainOptions.length
    this.checkAll = checkedList.length === this.plainOptions.length
    this.checkList = [...checkedList]
  }

  /**
   * 模态框确认按钮
   * Confirm
   */
  public Confirm() {
    if (this.checkedList.length === 0) {
      this.$message.warning('请勾选需要展示的字段')
      return
    }
    this.visible = !this.visible
    let checkboxColumns: any[] = []
    if (this.checkAll) {
      checkboxColumns = this.columns
    } else {
      this.columns.forEach((item: any, index: number) => {
        for (const key in this.checkedList) {
          if (this.checkedList[key] === item.title || this.checkedList[key] === item.dataIndex || this.checkedList[key] === item.decorator) {
            const newItem = Object.assign({}, item, {
              width: item.width ? item.width : (100 / this.checkedList.length).toFixed(2) + '%'
            })
            checkboxColumns.push(newItem)
          }
        }
      })
    }

    this.userDefindConfirm(checkboxColumns)
  }
}
</script>

<style  scoped>
.operate-container >>> .ant-checkbox-group .ant-checkbox-group-item {
  width: 180px;
}

.operate-container {
  margin-top: 8px;
}
.operate-list {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
}

.btn-container {
  overflow: hidden;
}

.btn-list {
  display: flex;
  flex-wrap: wrap;
  flex: 1;
  text-align: left;
  line-height: 100%;
  padding-top: 10px;
}

.btn-list > li {
  flex: none;
}
.btn {
  min-width: 100px;
  height: 32px;
  border-radius: 16px;
  border: 1px solid #5286d7;
  color: #5286d7;
  margin-right: 14px;
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

.btn:hover {
  background-color: #316ad7 !important;
  border-color: #316ad7 !important;
  color: #fff !important;
}

.user-defined {
  flex: 0 0 130px;
  background-color: transparent;
  border: 0;
  color: #3e77d8;
  font-weight: 600;
  margin: 10px 0px;
  box-shadow: none;
  outline: none;
  padding-right: 0;
}

.All-code {
  margin: 20px auto;
  min-height: 200px;
  width: 600px;
}
</style>
