<template>
<a-layout-content :style="{ margin: '0 16px 0 4px',minHeight:'100vh',background:'rgb(245,246,250)',overflowX:'auto' }" @click.capture="closechildMenu">
    <div style="min-width:700px;margin-top: 16px;">
      <router-view></router-view>
    </div>
  </a-layout-content>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { Mutation, State } from "vuex-class";
@Component
export default class Content extends Vue {
  /* 关闭子菜单 */
  @Mutation("mutionchildShow") mutionchildShow?: any;
  @State("childShow") childShow?: Boolean;
  public closechildMenu() {
    if (this.childShow) {
      this.mutionchildShow({
        childShow: false
      });
    }
  }
}
</script>
