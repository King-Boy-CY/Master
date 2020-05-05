<template functional>
<a-sub-menu :key="props.item.name" id="sub-menu">
    <span slot="title">
        {{ props.item.name}}</span>
    <template v-for="(child,index) in props.item.options">
        <a-menu-item :key="child.url" v-if="!child.options">
            <router-link tag="p" :to="child.url" class="text-1">
                {{child.name}}
            </router-link>
        </a-menu-item>
        <sub-menu v-else :key="index" :item="child" />
    </template>
</a-sub-menu>
</template>

<script lang="ts">
import Vue from 'vue'
import {
    Component,
    Prop
} from 'vue-property-decorator'
@Component
export default class renderItem extends Vue {
    @Prop(Object) item: any
}
</script>

<style lang="scss" scoped>
.text-1 {
    width: 148px;
}

/* 清除ul背景与父级容器保存一致 */
#sub-menu ul {
    background: unset;
    box-shadow: none;
}
</style>
