<template>
  <a-layout-header style="background: #fff; padding: 0;text-align:center;">
    <h1>头部</h1>
  </a-layout-header>
</template>
<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'

@Component
export default class Header extends Vue {}
</script>
<style lang="scss" scoped>
  .trigger {
    font-size: 18px;
    line-height: 64px;
    padding: 0 24px;
    cursor: pointer;
    transition: color .3s;
    & :hover{
      color: #1890ff;
    }
  }
</style>
