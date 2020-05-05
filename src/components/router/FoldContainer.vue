<!-- 可折叠的搜索容器 -->
<template>
  <div>
    <div id="components-form-demo-advanced-search">
      <transition name="router-slid">
        <div v-show="!collapsed">
           <slot name="formgroup"></slot>
        </div>

      </transition>
    </div>
    <a-row>
      <a-col :span="24">
        <div  class=" collapsible " @click="toggle" :style="collapsed ? { marginTop: '-16px' } : ''">
          <span>
            <a-icon :type="collapsed ? 'down' : 'up'"></a-icon>
          </span>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script lang='ts'>
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
@Component
export default class FoldContainer extends Vue {
  // 控制收起与展开
  private collapsed: boolean = false
  private toggle() {
    this.collapsed = !this.collapsed
  }
}
</script>

<style scoped>
</style>
