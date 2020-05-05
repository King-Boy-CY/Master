<template>
<a-popover placement="bottom" :mouseLeaveDelay=".2" :getPopupContainer=" e=> e.parentNode" trigger="click">
    <template slot="content" class="popover">
        <div class="duplicate-code">
            <ul>
                <a-radio-group>
                    <template v-for="(item,index) in listcolum">
                        <span v-if="!item.length" :key="index">
                            No product replication
                        </span>
                        <li v-for="(it,index) in item" :key="it.typeName" @click.stop="onChange($event,it,index)">

                            <a-radio :value="it.typeName">{{it.typeName}}</a-radio>
                        </li>
                    </template>
                </a-radio-group>
            </ul>
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
    @Emit('productCheck') productCheck(it: object, item: object, index: number) {} //选中项发送给父组件
    private timer: number = 0 // 计时器id
    public onChange(it: object, item: object, index: number) {
        // 防抖
        if (this.timer) {
            clearTimeout(this.timer)
        }
        this.timer = setTimeout(() => {
            this.productCheck(it, item, index)
        }, 200)
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
