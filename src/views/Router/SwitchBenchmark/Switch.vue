<template>
  <div>
    <!--  表单部分 -->
    <div id="components-form-demo-advanced-search" v-show="!collapsed">
      <transition name="router-slid">
        <div>
          <form-group :formoptions="topFromOptions" @selectChange="selectChange"></form-group>
          <a-row>
            <a-col :span="24" :style="{ textAlign: 'center', backgroundColor: '#fff', borderRadius:'6px',paddingBottom:'20px' }">
              <a-button type="primary" html-type="submit" icon="search" :style="{ borderRadius: '50px 50px 50px 50px' }">
                Search
              </a-button>
              <a-button
                :style="{ marginLeft: '8px', backgroundColor: 'rgb(245,177,72)', color: '#fff', border: 0, borderRadius: '50px 50px 50px 50px' }"
                @click="handleReset"
                icon="undo"
              >
                Reset
              </a-button>
            </a-col>
          </a-row>
        </div>

      </transition>
    </div>
    <!-- 折叠箭头 -->
    <a-row>
      <a-col :span="24">
        <div class="collapsible" :style="collapsed ? { marginTop: '-16px' } : ''">
          <span @click="toggle">
            <a-icon :type="collapsed ? 'down' : 'up'" />
          </span>
        </div>
      </a-col>
    </a-row>
    <!--  operate list -->
    <div>
      <operate-btn :BtnList="btnList" :plainOptions="plainOptions" @operateClick="operateClick"></operate-btn>
    </div>
    <!-- table -->
    <div>
      <simple-table :columns="columns" :data="data" :border="border" :isAlphabet="isAlphabet" @tableChange="tableChange"></simple-table>
    </div>
    <!-- add Modal -->
    <div class="add-model">
      <model
        title="Add Management of Inclusion"
        v-model="visible"
        width="1200px"
        @Screencover="Return"
      >
        <template slot="model-body">
          <div>
            <form-group :formoptions="formOptions" @selectChange="selectChange"></form-group>
          </div>
        </template>
        <template slot="model-footer">
          <a-row>
            <a-col :span="24" :style="{ textAlign: 'center' }">
              <a-button
                :style="{ marginLeft: '20px', minWidth: '100px', borderRadius: '50px' }"
                type="primary"
              >Save</a-button>
              <a-button
                :style="{ marginLeft: '20px', minWidth: '100px', borderRadius: '50px' }"
                @click="Return('add')"
              >Return</a-button>
            </a-col>
          </a-row>
        </template>
      </model>
    </div>
    <!-- edit Modal -->
    <div class="edit-model">
      <model
        title="Edit Management of Inclusion"
        v-model="editVisible"
        width="1200px"
        @Screencover="Return"
      >
        <template slot="model-body">
          <div>
            <form-group :formoptions="formOptions" @selectChange="selectChange"></form-group>
          </div>
        </template>
        <template slot="model-footer">
          <a-row>
            <a-col :span="24" :style="{ textAlign: 'center' }">
              <a-button
                :style="{ marginLeft: '20px', minWidth: '100px', borderRadius: '50px' }"
                type="primary"
              >Save</a-button>
              <a-button
                :style="{ marginLeft: '20px', minWidth: '100px', borderRadius: '50px' }"
                @click="Return('edit')"
              >Return</a-button>
            </a-col>
          </a-row>
        </template>
      </model>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import moment from "moment";
import { Component } from "vue-property-decorator";
import {
  IBtnList,
  inclusionBtn,
  IColumns,
  routeClassColumns,
  IFormoptions,
  switchFrom,
  exclusionAddFrom
} from "@/untils/router";

@Component({
  components: {
    OperateBtn: () => import("@/components/router/OperateBtn.vue"),
    SimpleTable: () => import("@/components/router/SimpleTable.vue"),
    Model: () => import("@/common/Model/index.vue"),
    FormGroup: () => import("@/components/router/FormGroup.vue")
  }
})
export default class OverView extends Vue {
  private form: any;
  // 控制form隐藏显示
  private collapsed: boolean = false;

  //OperateBtn 传值

  private btnList: IBtnList[] = inclusionBtn;

  // 控制add modal
  private visible: boolean = false;

  // edit modal
  private editVisible: boolean = false;

  // user-defined 模态框可选数据
  private plainOptions: string[] = [
    "Product",
    "Service",
    "Country",
    "Route class",
    "Begin date",
    "Mou",
    "ASR",
    "Margin",
    "Current cost"
  ];
  //private expand: boolean = false

  private columns: IColumns[] = routeClassColumns;
  private data: any = [];
  private border: boolean = true;

  //是否显示字母表
  private isAlphabet:boolean = true;

  // topFrom
  private topFromOptions: IFormoptions[] = switchFrom;

  // add model formOptions
  private formOptions: IFormoptions[] = exclusionAddFrom;

  /**
   * form表单实例化
   */
  protected beforeCreate() {
    this.form = this.$form.createForm(this);
  }

  /**点击
   * operateBtn时触发
   *
   */
  private operateClick(eventType: string): void {
    console.log(eventType)
    if (eventType === "add") {
      this.visible = true;
    }else if(eventType === "edit"){
      this.editVisible = true;
    }
  }
  private Return(type: string): void {
    if(type === 'add'){
      this.visible = !this.visible;
    }else{
      this.editVisible = !this.editVisible;
    }
  }


  /**
   * Form表单展开与收缩
   */
  public toggle() {
    //this.expand = !this.expand
    this.collapsed = !this.collapsed;
  }
  /**
   * Form Reset
   */
  public handleReset() {
    this.form.resetFields();
  }

  /**
   * productSelectChange
   */
  public productSelectChange(value: string): void {
    console.log(value);
  }

  public tableChange(pagination, filters, sorter) {
    console.log(pagination);
    console.log(filters);
    console.log(sorter);
  }

  public selectChange(val, name) {
    console.log(val);
    console.log(name);
  }
}
</script>

<style scoped>
</style>
