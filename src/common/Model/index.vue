<template>
<div v-if="_visible">
    <a-modal :maskClosable="false" :keyboard="false" centered class="edit-modal" :width="width" :height="height" v-if="_visible" v-model="_visible" :footer="null" :title="title" v-bind="$attrs" v-on="$listeners">
        <div class="body" :style="{
          height: height,
          overflow: 'auto'
        }">
            <slot name="model-body"></slot>
        </div>
        <div class="model-footer-box">
            <slot name="model-footer"></slot>
        </div>
    </a-modal>
</div>
</template>

<script lang="ts">
import Vue from 'vue'
import {
    Component,
    Prop,
    Emit
} from 'vue-property-decorator'

@Component
export default class Model extends Vue {
    @Prop(Boolean) private value!: boolean // 显示/隐藏 使用 v-model 绑定哟
    // 标题
    @Prop(String) private title ? : string
    // 宽度
    @Prop({
        type: [Number, String],
        default: '80%'
    }) private width ? : any
    // 高度
    @Prop(String) private height ? : string
    @Prop(Boolean) private unsetBodyPadding ? : boolean // 是否去除 body 的padding样式
    @Emit('close') close(msg: string) {};

    private get _visible(): boolean {
        return this.value;
    }
    private set _visible(visible: boolean) {
        this.$emit('input', visible);
        !visible && this.close('callback');
    }

}
</script>

<style lang="scss">
@import '@/views/Finance/common/css/deep-modal.scss';
</style><style lang="scss" scoped>
@import '@/views/Finance/common/css/modal.scss';

.model-footer-box {
    padding-top: 20px;
    text-align: center;
}

::-webkit-scrollbar-thumb:hover {
    background-color: #bbb;
}
</style>
