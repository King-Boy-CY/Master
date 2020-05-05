<template>
<div>
    <Advanced-search :formoptions="formoptions" :isChildName="true" allowClear @Submit="SearchOk" />
    <Table parentKey="id" :isSingleCheck="true" :isFinance="true" :columns="columns" :data="data" zebraStripe :isNeedCheck="true" />
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
    AxiosGet
} from "@/api/axios";

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
        Table: () => import("@/views/Finance/components/Table/index.vue")
    }
})

export default class clientSourceReference extends Vue {
    public $refs: refsConfig | any;

    /**选项 */
    private StatusOptions: any = [{
        name: "Active",
        value: 1
    }, {
        name: "Invalid",
        value: 2
    }]

    /**搜索 */
    private formoptions: any[] = [{
        Tips: "Reference price list",
        required: false,
        name: "referencePriceList",
        type: "tags",
        showSearch: true,
        span: 12,
        options: null
    }, {
        Tips: "Reference price policy",
        required: false,
        name: "referencePricePolicy",
        type: "tags",
        showSearch: true,
        span: 12,
        options: null
    }, {
        Tips: "Status",
        required: false,
        name: "status",
        type: "select",
        showSearch: true,
        span: 12,
        options: this.StatusOptions
    }, {
        Tips: "Last update",
        required: false,
        name: "lastUpdate",
        type: "picker",
        showSearch: true,
        span: 12,
        options: null
    }];

    /**表头 */
    private columns: any[] = [{
        title: "Reference price list",
        dataIndex: "Referencepricelist",
        key: "Referencepricelist"
    }, {
        title: "Reference price",
        dataIndex: "referencePrice",
        key: "referencePrice"
    }, {
        title: "Status",
        dataIndex: "status",
        key: "status",
        customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'status', this.StatusOptions)
    }, {
        title: "Policy",
        dataIndex: "policy",
        key: "policy"
    }, {
        title: "Currency",
        dataIndex: "currencyType",
        key: "currencyType"
    }, {
        title: "Service",
        dataIndex: "serviceList",
        key: "serviceList"
    }, {
        title: "Route class",
        dataIndex: "routeClassName",
        key: "routeClassName"
    }, {
        title: "Remark",
        dataIndex: "remark",
        key: "remark"
    }, {
        title: "Modified by",
        dataIndex: "modifiedBy",
        key: "modifiedBy"
    }, {
        title: "Last modified",
        dataIndex: "lastModified",
        key: "lastModified"
    }];

    /**表格 */
    private data: any[] = [];

    /**SearchOk */
    public SearchOk(values ? : any): void {
        console.log("RefSearchOk")
    }
}
</script>

<style lang="scss">

</style>
