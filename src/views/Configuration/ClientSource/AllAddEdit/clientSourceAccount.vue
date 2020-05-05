<template>
<div>
    <Advanced-search :formoptions="formoptions" :isChildName="true" allowClear @Submit="SearchOk" />
    <Table parentKey="id" :isSingleCheck="true" :isFinance="true" :useDefined="false" :columns="columns" :data="data" zebraStripe :isNeedCheck="true" @onSelect="onSelect" @onSelectAll="onSelectAll" />
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
    accountcolumns,
    acconutformoptions,
} from "../ClientSourceList"
import {
    AxiosGet
} from "@/api/axios";
import {
    getDetailAccounts,
    VendorSourceCompanies,
    VendorSourceAccountSearch
} from "@/api/index.ts";

@Component({
    components: {
        AdvancedSearch: resolve => require(["@/common/Advancedsearch/index.vue"], resolve),
        Table: () => import("@/views/Finance/components/Table/index.vue")
    }
})

export default class clientSourceAccount extends Vue {
    @Emit('confirmAccount') confirmAccount(msg ?: any) {};
    public $refs: refsConfig | any;

    /**搜索 */
    private formoptions: any[] = acconutformoptions;

    /**表头 */
    private columns: any[] = accountcolumns;

    /**表格 */
    private data: any[] = [];

    /**SearchOk */
    public SearchOk(values ? : any): void {
        let data: any = {
            params: Object.assign({}, values, {
                accountStatus: values.accountStatus || undefined,
                accountName: values.accountName || undefined,
                companyName: values.companyName || undefined
            })
        }
        VendorSourceAccountSearch(data).then((res: recodeConfig) => {
            // console.log(res.data)
            this.data = res.data
        })
    }

    /**用户选择 */
    public onSelectAll(selected: any, selectedRows: any, changeRows: any) {
        // console.log(selected)
    }

    /**获取数据 */
    private arr: any = []
    public onSelect(record: any, selected: boolean, selectedRows: any) {
        selectedRows.map((item: any, i: number) => {
            // console.log(item)
            const key = new Date().getTime() + i
            return this.$set(this.arr, i, {
                key,
                accountName: item.accountName,
                timeZone: item.timeZone
            })
        })
        this.confirmAccount(this.arr)
    }

    public created() {
        getDetailAccounts('').then((res: any) => {
            this.formoptions[0]['options'] = res.data
        })
        VendorSourceCompanies('').then((res: any) => {
            this.formoptions[1]['options'] = res.data
        })
    }
}
</script>

<style lang="scss">

</style>
