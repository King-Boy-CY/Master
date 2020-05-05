<template>
<a-pagination :showTotal="showTotal" :pageSizeOptions="pageSizeOptions" :total="total" :showSizeChanger="showSizeChanger" :pageSize.sync="_pageSize" v-model="_currentPage" @showSizeChange="onShowSizeChange" @change="onChangePage" align="left" style="margin-top:20px;">
    <!-- <template slot='buildOptionText' slot-scope='props' align="center">
        <span v-if="props.value!=='50'">{{props.value}}条/页</span>
        <span v-if="props.value==='50'">全部</span>
    </template> -->
</a-pagination>
</template>

<script lang="ts">
import Vue from 'vue'
import {
    Component,
    Emit,
    Prop
} from 'vue-property-decorator'

@Component
export default class pagination extends Vue {
    @Prop(Number) total!: number; // 总数量
    @Prop(Number) currentPage!: number; // 当前页数 :currentPage.sync 传入
    @Prop(Number) pageSize!: number; // 每页大小 :pageSize.sync 传入
    @Prop({
        type: Boolean,
        default: true
    }) showSizeChanger: any; // 是否显示修改页数大小
    @Prop({
        type: Array,
        default () {
            return ['10', '20', '30', '40', '50']
        }
    }) pageSizeOptions: any; // 每页大小

    @Emit('change') change(currentPage: number) {}
    @Emit('showSizeChange') showSizeChange(currentPage: number, pageSize: number) {}

    private get _pageSize() {
        return this.pageSize
    }
    private set _pageSize(pageSize) {
        // 更新 父组件传入的值  prop需要用 :pageSize.sync 传入
        this.$emit('update:pageSize', pageSize)
    }

    private get _currentPage() {
        return this.currentPage
    }
    private set _currentPage(currentPage) {
        // 更新 父组件传入的值  prop需要用 :currentPage.sync 传入
        this.$emit('update:currentPage', currentPage)
    }

    private showTotal(total: number, range: Array < string > ) {
        return `${range[0] || ''} - ${range[1] || ''} records / Total ${total} records`
    }

    /* 选择当前列表显示多少列
       @param: current  : 当前页
       @param：pageSize : 当前显示多少列
    */
    public onShowSizeChange(current: number, pageSize: number): void {
        console.log(current, pageSize)
        this.$nextTick(() => {
            this.showSizeChange(current, pageSize)
        })
    }

    /* 点击切换页 */
    public onChangePage(currentPage: number) {
        console.log(currentPage)
        this.$nextTick(() => {
            this.change(currentPage)
        })
    }

}
</script>
