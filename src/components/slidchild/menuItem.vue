<template functional>
  <a-menu-item :key="props.item.url">
    <router-link tag="p" :to="props.item.url" class="text">
      {{ props.item.name }}
    </router-link>
  </a-menu-item>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'
@Component
export default class renderItem extends Vue {
  @Prop(Object) item: any
}
</script>

<style lang="scss" scoped>
.text {
  width: 170px;
}
</style>
