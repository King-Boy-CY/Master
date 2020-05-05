<template>
<div>
    <Advanced-search :formoptions="formoptions" :isChildName="true" allowClear @Submit="SearchOk" />
    <Table parentKey="id" :isFinance="true" :isSingleCheck="true" :isNeedCheck="true" :useDefined="false" :columns="columns" :data="data"  @onSelect="onSelect" @onSelectAll="onSelectAll" />
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
    Numberplancolumns,
    Numberplanformoptions
} from "../ClientSourceList"
import {
    AxiosGet
} from "@/api/axios";
import {
    ClientSourceNumberPlanList,
    ClientSourceNumberPlanSearch,
    getDetailService
} from "@/api/index.ts";

@Component({
    components: {
        AdvancedSearch: resolve => require(["@/common/Advancedsearch/index.vue"], resolve),
        Table: () => import("@/views/Finance/components/Table/index.vue")
    }
})

export default class clientSourceNumberplan extends Vue {
    @Emit('confirmNumberplan') confirmNumberplan(msg ?: any) {}
    public $refs: refsConfig | any;

    /**搜索 */
    private formoptions: any[] = Numberplanformoptions;

    /**表头 */
    private columns: any[] = Numberplancolumns;
    
    /**表格 */
    private data: any[] = [];

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
                numberPlanName: item.numberPlanName,
                direction: item.direction
            })
        })
        this.confirmNumberplan(this.arr)
    }

    /**SearchOk */
    public SearchOk(values ? : any): void {
        let data: any = {
            params: Object.assign({}, values, {
                numberPlanName: values.numberPlanName || undefined,
            })
        }
        ClientSourceNumberPlanSearch(data).then((res: recodeConfig) => {
            // console.log(res.data)
            this.data = res.data
        })
    }

    public created() {
        ClientSourceNumberPlanList('').then((res: any) => {
            this.formoptions[0]['options'] = res.data
        })
        getDetailService('').then((res: any) => {
            this.formoptions[1]['options'] = res.data
        })
    }
}
</script>

<style lang="scss">

</style>
