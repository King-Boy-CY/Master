<!--  -->
<template>
  <div>
  </div>
</template>

<script lang='ts'>
import Vue from 'vue'
import { Component,Prop,Emit } from 'vue-property-decorator'
@Component
export default class ConfirmModal extends Vue {

 /*  @Prop({
    type: String,
    default: 'Do you want to delete these items'
  }) private title!: string

  @Prop({
    type: String,
    default: ''
  }) private content!: string

  @Prop({
    type: String,
    default: 'confirm'
  }) private okText!: string

  @Prop({
    type: String,
    default: 'danger'
  }) private okType!: string

  @Prop({
    type: String,
    default: 'cancel'
  }) private cancelText!: string */

  @Emit("ok") private modalOk(message: string): void {}
  @Emit('cancel') private modalCancel(message: string): void {}



  private showConfirm(eventType,{title= 'Do you want to delete these items', content = '', okText = 'confirm', okType = 'danger',cancelText = 'cancel'} = {}) {
    const that = this
    this.$confirm({
      title: title,
      content: content,
      okText: okText,
      okType: okType,
      cancelText: cancelText,
      onOk() {
        that.modalOk(eventType)
      },
      onCancel() {
        that.modalCancel('cancel')
      }
    })
  }
}

</script>

<style lang='stylus' scoped>
</style>
