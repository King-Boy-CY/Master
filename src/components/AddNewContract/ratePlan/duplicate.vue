<template>
  <div class="duplicate">
    <a-popover placement="bottom"
               :mouseLeaveDelay=".2"
               :getPopupContainer=" e=> e.parentNode"
               trigger="click"
               v-model="visible">
      <template slot="content" v-if="listcolum && listcolum.length">
        <div class="duplicate-code"
             v-for="(item, key) in listcolum"
             :key="key">
          <div class="duplicate-title"
               :class="{duplicateTitleShow:carteTypeIndex==key}"
               @click="oncarteType(key)">
            <a-checkbox :indeterminate="indeterminate && key === carteTypeIndex"
                        :checked="checkAll && key === carteTypeIndex "
                        autocomplete="off"
                        @change="allCheck">All
            </a-checkbox>
            <span>
              <a-icon :type="carteType && key === carteTypeIndex  ? 'caret-up' : 'caret-down'" />{{item.title}}
            </span>
          </div>
          <div class="duplicate-content"
               v-if="carteType && key === carteTypeIndex">
            <ul>
              <li v-for="(it,index) in item.options"
                  :key="index">
                <a-checkbox-group v-model="provideCheckList[carteTypeIndex]"
                                  :indeterminate="indeterminate"
                                  @change="onChange">
                  <a-checkbox :value="it.uni"
                              autocomplete="off">{{it.typeName}}
                  </a-checkbox>
                </a-checkbox-group>
              </li>
            </ul>
          </div>
        </div>
      </template>
      <slot></slot>
    </a-popover>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import {
    Component,
    Prop,
    Emit,
    Watch,
    Inject
  } from 'vue-property-decorator'

  @Component
  export default class duplicate extends Vue {
    @Prop(Array) private listcolum ?: any // 列表名称
    @Emit('sendProduct') sendProduct(checkedList: any[], index: number, checkAll?: boolean) {
    } //选中项发送给父组件
    @Prop(Number) public currentKey ?: any;
    // @Prop(Object) public deleteName?:any //product页面传过来的时间戳
    @Inject() private provideCheckList: any;
    private oldCheckList: any = [];
    private copylistcolum: any = this.listcolum;

    @Watch('provideCheckList', {deep: true, immediate: true})
    onCheckListChanged(newVal: any, oldVal: any) {
    }

    private visible: boolean = false

    @Watch('visible') visibles(newVal: any, oldVal: any) {
      if (newVal == false && this.provideCheckList && this.provideCheckList.length) {
        this.sendProduct(this.provideCheckList[this.carteTypeIndex], this.carteTypeIndex, this.checkAll)
        this.$nextTick(() => {
          for (let i = 0; i < this.provideCheckList.length; i++) {
            this.$set(this.provideCheckList, i, [])
          }
          this.indeterminate = this.checkAll = this.carteType = false
        })
      }
    }

    private carteType: boolean = false;
    private indeterminate: boolean = false;
    private carteTypeIndex: number = 0;
    // private checkList:string[] = []
    private checkAll: boolean = false;
    private checkedList: any

    public onChange(checkedList?: any) {
      let leng: number = 0;
      if (this.listcolum[this.carteTypeIndex]) {
        leng = this.listcolum[this.carteTypeIndex].options.length;
      }
      this.indeterminate = !!checkedList.length && (checkedList.length < leng)
      this.checkAll = checkedList.length === leng && leng !== 0;
      this.checkedList = checkedList
      this.$set(this.provideCheckList, this.carteTypeIndex, checkedList)
      this.change()
    }
    // 计算checkbox 的勾选状态
    public change() {
      if (!Object.keys(this.listcolum[this.carteTypeIndex]).length) return
      // console.log(`cange`);
      // let checkedList: any = this.provideCheckList[this.currentKey]
      let checkedList: any = this.provideCheckList[this.carteTypeIndex]
      let leng: number = 0;
      if (this.listcolum[this.carteTypeIndex]) {        
        leng = this.listcolum[this.carteTypeIndex].options.length;
      }
      // console.log(checkedList.length);
      // console.log(leng);
      this.indeterminate = !!checkedList.length && (checkedList.length < leng)
      this.checkAll = leng !== 0 && checkedList.length === leng
    }

    activated() {
      // console.log(this.listcolum);
    }

    /* 全选 */
    public allCheck(e: any) {
      if (!e.target.checked) {
        this.provideCheckList[this.carteTypeIndex] = []
      } else {
        // this.listcolum[this.carteTypeIndex] 多选框选中数据
        this.$set(this.provideCheckList, this.carteTypeIndex, [])
        for (let i = 0; i < this.listcolum[this.carteTypeIndex].options.length; i++) {
          if (this.listcolum[this.carteTypeIndex]) {
            let item: any = this.listcolum[this.carteTypeIndex].options[i]
            this.$set(this.provideCheckList[this.carteTypeIndex], i, item.uni)
          }
        }        
      }
      this.change()
      //this.sendProduct(this.provideCheckList[this.currentKey],this.carteTypeIndex,this.checkAll)
    }

    /* 头部点击触发 */
    public oncarteType(key: number) {
      this.carteType = true;
      this.carteTypeIndex = key;
      this.$nextTick(() => {
        this.change()
      })
    }
  }
</script>

<style lang="scss">
.duplicate {
  .duplicate-content {
    padding: 10px;
  }

  .duplicate-title {
    padding: 5px;

    /* color: #fff; */
    font-weight: 600;
  }

  .duplicateTitleShow {
    background: rgb(163, 195, 255);
    color: #ffffff;
  }

  .bck {
    color: rgb(163, 195, 255);
  }
}
</style>
