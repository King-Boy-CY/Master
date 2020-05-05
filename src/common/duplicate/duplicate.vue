<template>
  <a-popover placement="bottom"
             :mouseLeaveDelay=".2"
             :getPopupContainer=" e=> e.parentNode"
             trigger="click">
    <template slot="content"
              class="popover">
      <div class="duplicate-code"
           v-for="(item, key) in listcolum"
           :key="key">
        <div class="duplicate-title"
             :class="{duplicateTitleShow:carteTypeIndex==key}"
             @click="oncarteType(key)">
          <a-checkbox :indeterminate="indeterminate && key === carteTypeIndex "
                      :checked="checkAll && key === carteTypeIndex "
                      @change="allCheck">All</a-checkbox>
          <span>
            <a-icon :type="carteType && key === carteTypeIndex ? 'caret-up' : 'caret-down'" />{{item.title}}</span>
        </div>
        <div class="duplicate-content"
             v-if="carteType && key === carteTypeIndex">
          <ul>
            <li v-for="(it,index) in item.options"
                :key="index">
              <a-checkbox-group v-model="checkList"
                                :indeterminate="indeterminate"
                                @change="onChange">
                <a-checkbox :value="it.name"
                            @change="testChange(index)"
                            :class="{bck: checkList.join('').indexOf( it.name ) > -1 }">{{it.name}}</a-checkbox>
              </a-checkbox-group>
            </li>
          </ul>
        </div>
      </div>
    </template>
    <slot></slot>
  </a-popover>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  Component,
  Prop,
  Emit,
  Watch
} from 'vue-property-decorator'

@Component
export default class duplicate extends Vue {
  @Prop(Array) private listcolum ? : any // 列表名称
  @Emit('sendProduct') sendProduct(msg: any, isChecked ? : Boolean) {} //选中项发送给父组件
  private carteType: boolean = false; // 图标 -> 三角
  private indeterminate: boolean = false; // 备选标志
  private carteTypeIndex: number = 0; // 当前坐标
  private checkList: string[] = []; // 全选绑定
  private checkAll: boolean = false; // 是否全选中
  private checkSingle: boolean = false
  private testIndex: number = 0;
  /* 子元素点击触发 */
  public onChange(checkedList: any, i: any) {

    this.sendProduct(checkedList)
    // let options:any=[]
    // this.listcolum.forEach((item:any,index:number,arr:any)=>{
    //   options.push(arr[index].options);
    // })
    //console.log(options);
    // let option = checkedList
    // console.log(option);

    // checkedList -> 点击的数据
    /* 获取子元素长度 */
    let leng: number = 0;
    for (let i = 0; i < this.listcolum.length; i++) {
      if (this.listcolum[this.carteTypeIndex]) {
        leng = this.listcolum[this.carteTypeIndex].options.length;
        break;
      }
    }
    this.indeterminate = !!checkedList.length && (checkedList.length < leng)
    this.checkAll = checkedList.length === leng;

  }
  /* 全选 */
  public allCheck(e: any) {
    let options: any[] = []; // 全选子元素
    let Arr: string[] = []; // 全选数据
    for (let i = 0; i < this.listcolum.length; i++) {
      if (this.listcolum[this.carteTypeIndex]) {
        options = this.listcolum[this.carteTypeIndex].options;
        break;
      }
    }!!options.length && options.forEach((res: any) => {
      Arr.push(res.name);
    })
    Object.assign(this, {
      checkList: e.target.checked ? Arr : [],
      indeterminate: false,
      checkAll: e.target.checked,
    })
    //this.listcolum 把整个列表数据都发过去了。。。
    this.sendProduct(options, this.checkAll);

  }
  /* 头部点击触发 */
  public oncarteType(key: number) {
    console.log(key);

    this.carteTypeIndex = key;
    this.carteType = this.carteTypeIndex === key && !this.carteType;
  }

  public testChange(key: number) {
    // console.log(`子元素被按下`,key);
    this.testIndex = key;
    //console.log(this.testIndex);

  }
}
</script>

<style>
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
</style>
