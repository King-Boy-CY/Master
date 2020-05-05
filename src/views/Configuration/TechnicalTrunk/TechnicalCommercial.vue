<template>
<div>
    <!-- 搜索 || 表格 -->
    <Advanced-search :formoptions="formOptions" :isChildName="true" allowClear @Submit="SearchOk" ref="AdvancedSearch" />
    <Table parentKey="id" :isSingleCheck="true" :isFinance="true" :useDefined="false" :isNeedCheck="true" :columns="columns" :data="data" zebraStripe @onSelectAll="onSelectAll" @onSelect="onSelect" />

</div>
</template>

<script lang="ts">
// 插件
import Vue from "vue";
import {
    Component,
    Emit
} from "vue-property-decorator";
import {
    refsConfig
} from "@/assets/ts/config.d";
import {
    AxiosGet,
    AxiosDelete,
    AxiosPost,
    AxiosPut
} from "@/api/axios";
import xlsx from 'xlsx';
import {
    VendorSourceList,
    CommercialTrunkList,
    TechnicalTrunkList,
    getDetailAccounts,
    CommercialTrunkSearch
} from "@/api/index.ts";

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

// 组件
@Component({
    components: {
        AdvancedSearch: resolve => require(["@/common/Advancedsearch/index.vue"], resolve),
        Model: resolve => require(["@/common/Model/index.vue"], resolve),
        Table: () => import("@/views/Finance/components/Table/index.vue"),
        formGroup: () => import("@/views/Finance/components/form-group/index.vue")
    }
})

export default class TechnicalCommercial extends Vue {
    @Emit('confirmData') confirmData(msg ? : any) {}
    private visible: any = false;
    private activeIndex: number = 0;
    public $refs: refsConfig | any;
    /**效验Name是否重复 */
    private isRepetition: boolean = false;

    /**选项 */
    private StatusOptions = [{
        name: "Active",
        value: 1
    }, {
        name: "Invalid",
        value: 2
    }]
    private isCliOptions = [{
        name: "NO",
        value: 0
    }, {
        name: "YES",
        value: 1
    }]
    private directionOptions = [{
        name: "Inbound",
        value: 1
    }, {
        name: "Outbound",
        value: 2
    }, {
        name: "Bilateral",
        value: 3
    }]
    /**搜索 */
    private formOptions: any[] = [{
        Tips: "Commercial trunk",
        require: false,
        name: "commercialTrunkName",
        type: "select",
        showSearch: true,
        options: null,
        span: 10
    }, {
        Tips: "Technical Trunk",
        require: false,
        name: "technicalTrunkName",
        type: "select",
        showSearch: true,
        options: null,
        span: 10
    }, {
        Tips: "Vendor",
        require: false,
        name: "vendorName",
        type: "select",
        showSearch: true,
        options: null,
        span: 10
    }, {
        Tips: "Account",
        require: false,
        name: "accountName",
        type: "select",
        showSearch: true,
        options: null,
        span: 10
    }, {
        Tips: "CLI",
        require: false,
        name: "isCli",
        type: "select",
        showSearch: true,
        options: this.isCliOptions,
        span: 10
    }, {
        Tips: "Status",
        require: false,
        name: "status",
        type: "select",
        showSearch: true,
        options: this.StatusOptions,
        initialValue: 1,
        span: 10
    }]

    /**表头 */
    private columns: any[] = [{
        title: "Commercial trunk",
        dataIndex: "commercialTrunkName",
        key: "commercialTrunkName",
        sorter: (a, b) => a.commercialTrunkName.length - b.commercialTrunkName.length
    }, {
        title: "Vendor",
        dataIndex: "vendorName",
        key: "vendorName"
    }, {
        title: "Account",
        dataIndex: "accountName",
        key: "accountName"
    }, {
        title: "Status",
        dataIndex: "status",
        key: "status",
        sorter: (a, b) => a.status - b.status,
        customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'status', this.StatusOptions)
    }, {
        title: "CLI",
        dataIndex: "isCli",
        key: "isCli",
        customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'isCli', this.isCliOptions)
    }, {
        title: "Direction",
        dataIndex: "direction",
        key: "direction",
        customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'direction', this.directionOptions)
    }, {
        title: "Technical trunk",
        dataIndex: "technicalTrunkName",
        key: "technicalTrunkName"
    }, {
        title: "Begin date",
        dataIndex: "beginDate",
        key: "beginDate"
    }, {
        title: "End date",
        dataIndex: "endDate",
        key: "endDate"
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
    }]

    /**数据 */
    private data: any[] = []

    /**SearchOk */
    public SearchOk(values ? : any): void {
        let data: any = {
            params: Object.assign({}, values, {
                commercialTrunkName: values.commercialTrunkName || undefined,
                technicalTrunkName: values.technicalTrunkName || undefined,
                accountName: values.accountName || undefined,
                isCli: values.isCli == "NO" ? 0 : undefined || values.isCli == 1 ? 1 : undefined || undefined,
                vendorName: values.vendorName || undefined
            })
        }
        CommercialTrunkSearch(data).then((res: any) => {
            // console.log(res.data)
            this.data = res.data
        })
    }

    /**选择/取消回调 */
    public onSelectAll(selected: any, selectedRows: any, changeRows: any) {

    }
    private arr: any = []
    public onSelect(record: object, selected: boolean, selectedRows: any) {
        selectedRows.map((item: any, i: number) => {
            const key = new Date().getTime() + i
            return this.$set(this.arr, i, {
                key,
                commercialTrunkName: item.commercialTrunkName,
                id: item.id,
                accountName: item.accountName
            })
        })
        this.confirmData(this.arr)
    }

    /**关闭编辑窗口 */
    public Screencover(msg ? : any) {
        this.visible = !this.visible;
    }

    /**Return操作回调 */
    handleReruen(msg: any) {
        const that: any = this
        if (msg == 1) {
            this.$confirm({
                title: 'Close Tip',
                content: 'Continue to  exit?',
                okText: 'yes',
                cancelText: 'no',
                onOk() {
                    that.Screencover(msg);
                },
            });
        } else {
            that.Screencover(msg);
        }
    }

    /**created */
    public created() {
       getDetailAccounts('').then((res: any) => {
            this.formOptions[3]['options'] = res.data
        })
        VendorSourceList('').then((res: any) => {
            this.formOptions[2]['options'] = res.data
        })
        CommercialTrunkList('').then((res: any) => {
            this.formOptions[0]['options'] = res.data
        })
        TechnicalTrunkList('').then((res: any) => {
            this.formOptions[1]['options'] = res.data
        })
    }
}
</script>

<style lang="scss">

</style>
