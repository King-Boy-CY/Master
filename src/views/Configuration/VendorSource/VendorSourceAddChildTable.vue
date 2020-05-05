<template>
<div>
    <Advanced-search ref="searchref" :formoptions="formoptions" :isChildName="true" @Submit="SearchOk" allowClear childDataKey="contractfoVOList" />
    <Table parentKey="id" :isSingleCheck="true" :isFinance="true" :columns="columns" :data="data" zebraStripe :isNeedCheck="true" @onSelect="onSelect" />
</div>
</template>

<script lang="ts">
import Vue from 'vue'
import {
    Component,
    Emit
} from "vue-property-decorator"
import {
    getDetailAccounts,
    VendorSourceCompanies,
    VendorSourceAccountSearch
} from "@/api/index.ts";
import {
    State,
    Mutation
} from 'vuex-class'
import {
    refsConfig
} from "@/assets/ts/config.d"
import {
    acconutformoptions,
    accountcolumns,
} from "./VendorSourceList"
import {
    Columns,
    FormOptions
} from "./VendorSourceVerify"

const renderContent = (value: any, row: any, index: any, dataIndex: any, options ? : any) => {
    const obj = {
        children: value,
        attrs: {
            colSpan: 1,
            rowSpan: 1
        },
    };

    if (options && options instanceof Array) {
        const find = options.find((item: any) => item.value === value)
        if (find) {
            obj.children = find.name
        }
    }
    return obj;
}

@Component({
    components: {
        AdvancedSearch: resolve => require(["@/common/Advancedsearch/index.vue"], resolve),
        Table: () => import("@/views/Finance/components/Table/index.vue"),
    }
})

export default class VendorSourceAddChildTable extends Vue {
    @Emit('confirmData') confirmData(msg ? : any) {}
    private data: any[] = [];
    private isSingleCheck: boolean = true;
    public needChangeData: any[] = [];
    public $refs: refsConfig | any;

    /* 搜索内容 */
    private formoptions: FormOptions['Array'] = acconutformoptions;
    /* 表格内容 */
    private columns: Columns['Array'] = accountcolumns;

    private confirmDate: any
    private arr: any = []
    public onSelect(record: any, selected: boolean, selectedRows: any) {
        // console.log("打印record",record)
        // console.log("打印selected",selected)
        // console.log("打印selectedRows",selectedRows)
        this.confirmDate = selected
        selectedRows.map((item: any, i: number) => {
            // console.log("打印item",item);
            const key = new Date().getTime() + i
            // console.log("打印key",key)

            return this.$set(this.arr, i, {
                key,
                AgreementAccount: {
                    type: 'input',
                    decorator: 'AgreementAccount' + key,
                    initialValue: item.accountName
                },
                TimeZone: {
                    type: 'input',
                    decorator: 'TimeZone' + key,
                    initialValue: item.timeZone
                },
                id: item.id
            })
        })
        this.confirmData(this.arr)
    }

    public SearchOk(values ? : any): void {
        // console.log(values)
        let data: any = {
            params: Object.assign({}, values, {
                accountStatus: values.accountStatus || undefined,
                accountName: values.accountName || undefined,
                companyName: values.companyName || undefined
            })
        }
        VendorSourceAccountSearch(data).then((res: any) => {
            // console.log(res.data)
            this.data = res.data
        })
    }

    public created() {
        (async () => {
            getDetailAccounts('').then((res: any) => {
                // console.log(res.data)
                this.formoptions[0]['options'] = res.data
            })
            VendorSourceCompanies('').then((res: any) => {
                // console.log(res.data)
                this.formoptions[1]['options'] = res.data
            })
        })()
    }
}
</script>
