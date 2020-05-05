<template>
<div>
    <Advanced-search :formoptions="formOptions" :isChildName="true" allowClear @Submit="SearchOk" ref="AdvancedSearch" />
    <Table parentKey="id" :isFinance="true" :useDefined="false" :isNeedCheck="true" :columns="columns" :data="data" zebraStripe @onSelectAll="onSelectAll" @onSelect="onSelect" />
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
    AxiosDelete
} from "@/api/axios";
import xlsx from 'xlsx';
import {
    TechnicalTrunkList,
    TechnicalTrunkAccList,
    CommercialTrunkList
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
        formGroup: () => import("@/views/Finance/components/form-group/index.vue"),
    }
})

export default class TechnicalTrunkChild extends Vue {
    @Emit('confirmTechnical') confirmTechnical(msg ? : any) {}
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
    private SwitchOptions = [{
        name: "IDD_West_1",
        value: 1
    }, {
        name: "IDD_West_2",
        value: 2
    }, {
        name: "IDD_Eest_3",
        value: 3
    }, {
        name: "IDD_North_2",
        value: 4
    }, {
        name: "IDD_Eest_4",
        value: 5
    }, {
        name: "IDD_Eest_5",
        value: 6
    }, {
        name: "IDD_Premium",
        value: 7
    }, {
        name: "IDD_West_Backup",
        value: 8
    }, {
        name: "IDD_Eest_Backup",
        value: 9
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
        Tips: "Switch",
        require: false,
        name: "switch",
        type: "select",
        showSearch: true,
        options: null,
        span: 10
    }, {
        Tips: "Account",
        require: false,
        name: "accountName",
        type: "input",
        showSearch: true,
        options: null,
        span: 10
    }, {
        Tips: "Status",
        require: false,
        name: "status",
        type: "select",
        showSearch: true,
        options: this.StatusOptions,
        span: 10,
        initialValue: 1
    }]

    /**编辑栏 */
    private Formscreening: any[] = [{
        name: "Add",
        icon: "plus-circle",
        index: 1
    }, {
        name: "Edit",
        icon: "form",
        index: 2,
        disabled: true,
        tips: "Records whose Operating state is 'D/E' cannot be edited;Records whose Type is Processing cannot be edited"
    }, {
        name: "Delete",
        icon: "delete",
        index: 3,
        disabled: true
    }, {
        name: "Export",
        icon: "export",
        index: 4,
        disabled: true
    }]

    /**表头 */
    private columns: any[] = [{
        title: "Technical trunk",
        dataIndex: "technicalTrunkName",
        key: "technicalTrunkName"
    }, {
        title: "Status",
        dataIndex: "status",
        key: "status",
        sorter: (a, b) => a.status.length - b.status.length,
        customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'status', this.StatusOptions)
    }, {
        title: "Account",
        dataIndex: "accountName",
        key: "accountName"
    }, {
        title: "Switch",
        dataIndex: "switchName",
        key: "switchName",
        sorter: (a, b) => {
            var stringA = a.switchName.toUpperCase();
            var stringB = b.switchName.toUpperCase();
            if (stringA < stringB) {
                return -1;
            }
            if (stringA > stringB) {
                return 1;
            }
            return 0;
        }
    }, {
        title: "Trunk type",
        dataIndex: "trunkType",
        key: "trunkType"
    }, {
        title: "CDR match",
        dataIndex: "cDRmatch",
        key: "cDRmatch"
    }, {
        title: "Commercial trunk",
        dataIndex: "commercialTrunkName",
        key: "commercialTrunkName",
        sorter: (a, b) => {
            var stringA = a.commercialTrunkName.toUpperCase();
            var stringB = b.commercialTrunkName.toUpperCase();
            if (stringA < stringB) {
                return -1;
            }
            if (stringA > stringB) {
                return 1;
            }
            return 0;
        }
    }, {
        title: "Activated ports",
        dataIndex: "activatedPorts",
        key: "activatedPorts"
    }, {
        title: "Direction",
        dataIndex: "direction",
        key: "direction",
        customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'direction', this.directionOptions)
    }, {
        title: "Begin date",
        dataIndex: "beginDate",
        key: "beginDate"
    }, {
        title: "End date",
        dataIndex: "endDate",
        key: "endDate"
    }, {
        title: "Termination switch",
        dataIndex: "terinationSwitch",
        key: "terinationSwitch"
    }, {
        title: "Origination Point",
        dataIndex: "originationPoint",
        key: "originationPoint"
    }, {
        title: "Destinaton Point",
        dataIndex: "destinationPoint",
        key: "destinationPoint"
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
                switchName: values.switchName || undefined
            })
        }
        AxiosGet("/config/technicalTrunks", data).then((res: any) => {
            this.data = res.data
        })
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

    /**Save操作回调 */
    private async addAllData() {}

    /**选择/取消回调 */
    public onSelectAll(selected: any, selectedRows: any, changeRows: any) {

    }
    private arr: any[] = []
    public onSelect(record: object, selected: boolean, selectedRows: any) {
        selectedRows.map((item: any, i: number) => {
            // console.log(item)
            const key = new Date().getTime() + i
            return this.$set(this.arr, i, {
                key,
                technicalTrunkName: item.technicalTrunkName
            })
        })
        this.confirmTechnical(this.arr)
    }

    public created() {
        let switchName: any[] = ["IDD_West_1", "IDD_West_2", "IDD_East_3", "IDD_North_2", "IDD_East_4", "IDD_East_5", "IDD_Premium", "IDD_West_Backup", "IDD_East_Backup"]
        this.formOptions[2]["options"] = switchName
        CommercialTrunkList('').then((res: any) => {
            this.formOptions[0]['options'] = res.data
        })
        TechnicalTrunkList('').then((res: any) => {
            this.formOptions[1]['options'] = res.data
        })
        TechnicalTrunkAccList('').then((res: any) => {
            this.formOptions[3]['options'] = res.data
        })
    }
}
</script>

<style lang="scss">

</style>
