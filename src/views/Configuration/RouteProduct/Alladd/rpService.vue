<template>
<div>
    <Table parentKey="id" :isFinance="true" :columns="columns" :data="data" zebraStripe :isNeedCheck="true" @onSelect="onSelect" @onSelectAll="onSelectAll" />
</div>
</template>

<script lang="ts">
import Vue from "vue";
import {
    Component,
    Emit
} from "vue-property-decorator";
import {
    refsConfig,
    recodeConfig
} from "@/assets/ts/config.d";
import {
    serivceColumns
} from "../RouteProductList";
import {
    RouteProductService
} from "@/api/index.ts";

@Component({
    components: {
        Table: () => import("@/views/Finance/components/Table/index.vue")
    }
})

export default class rpService extends Vue {
    @Emit('confirmSerivce') confirmSerivce(msg ? : any) {}
    public $refs: refsConfig | any;

    /**表格内容 */
    private data: any = [];
    /**表头 */
    private columns: any[] = serivceColumns;

    /**用户选择 */
    public onSelectAll(selected: any, selectedRows: any, changeRows: any) {
        // console.log(selected)
    }
    /**获取选择数据 */
    private arr: any = []
    public onSelect(record: any, selected: boolean, selectedRows: any) {
        // console.log(selectedRows)
        selectedRows.map((item: any, i: number) => {
            // console.log(item)
            const key = new Date().getTime() + i 
            return this.$set(this.arr, i, {
                key,
                serviceName: item.serviceName
            })
        })
        this.confirmSerivce(this.arr)
    }

    /**获取数据 */
    public created() {
        (async ()=> {
            RouteProductService('').then((res: any) => {
                this.data = res.data
            })
        })()
    }
}

</script>

<style lang="scss">

</style>
