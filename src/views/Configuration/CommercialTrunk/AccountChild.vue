<template>
<div>
    <Advanced-search :formoptions="formoptions" :isChildName="true" allowClear @Submit="SearchOk" />
    <Table parentKey="id" :isSingleCheck="true" :useDefined="false" :isFinance="true" :columns="columns" :data="data" zebraStripe :isNeedCheck="true" @onSelect="onSelect" @onSelectAll="onSelectAll" />
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
import {
    getDetailAccounts,
    VendorSourceCompanies,
    VendorSourceAccountSearch
} from "@/api/index.ts";
import {
    VendorSourceSearch,
    VendorSourceList,
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

@Component({
    components: {
        AdvancedSearch: resolve => require(["@/common/Advancedsearch/index.vue"], resolve),
        Table: () => import("@/views/Finance/components/Table/index.vue")
    }
})

export default class CommercialAccount extends Vue {
    @Emit('confirmDataAccount') confirmDataAccount(msg ? : any) {}
    public $refs: refsConfig | any;

    /**选项 */
    private accountStatusOptions = [{
            name: "Active",
            value: 1
        },
        {
            name: "Expired",
            value: 2
        },
        {
            name: "Future",
            value: 3
        }
    ];
    private accountTypeOptions = [{
        name: 'Vendor',
        value: 1
    }, {
        name: 'Client',
        value: 2
    }, {
        name: 'Bilateral',
        value: 3
    }];
    private AutomateOptions = [{
            name: "On",
            value: 1
        },
        {
            name: "Off",
            value: 2
        }
    ];
    private StatusOptions = [{
            name: "Active",
            value: 1
        },
        {
            name: "Invalid",
            value: 2
        }
    ];
    private ServiceOptions = [{
            name: 'IP',
            value: 1
        },
        {
            name: 'IDD',
            value: 2
        },
        {
            name: 'IPLC',
            value: 3
        }
    ];
    private CLIOptions = [{
            name: "Yes",
            value: 1
        },
        {
            name: "Defined by offer",
            value: 2
        }
    ];

    /**搜索 */
    private formoptions: any[] = [{
            Tips: "Name",
            require: false,
            name: "vendorName",
            type: "select",
            showSearch: true,
            span: 12,
            colSpan: 5,
            options: null
        },
        {
            Tips: "Status",
            require: false,
            name: "status",
            showSearch: true,
            type: "select",
            span: 12,
            colSpan: 5,
            options: this.StatusOptions,
            initialValue: 1
        }
    ];

    /**表头 */
    private columns: any[] = [{
            title: "Name",
            dataIndex: "vendorName",
            key: "vendorName",
            width: 280,
            sorter: (a, b) => {
                var stringA = a.vendorName.toUpperCase();
                var stringB = b.vendorName.toUpperCase();
                if (stringA < stringB) {
                    return -1;
                }
                if (stringA > stringB) {
                    return 1;
                }
                return 0;
            }
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            width: 100,
            sorter: (a, b) => a.status - b.status,
            customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'status', this.StatusOptions)
        },
        {
            title: "Agreement account",
            dataIndex: "accountName",
            key: "accountName",
            width: 220
        },
        {
            title: "Service",
            dataIndex: "serviceName",
            key: "service",
            width: 80,
            customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'Service', this.ServiceOptions)
        },
        {
            title: "CLI supported by default",
            dataIndex: "cliSupportedByDefault",
            key: "cliSupportedByDefault",
            width: 140,
            customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'cliSupportedByDefault', this.CLIOptions)
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            width: 280
        },
        {
            title: "Time zone(UTC)",
            dataIndex: "timeZone",
            key: "timeZone",
            width: 160
        },
        {
            title: "Automate analysis of decoed offer",
            dataIndex: "isAutomateAnalysis",
            key: "isAutomateAnalysis",
            width: 180,
            customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'isAutomateAnalysis', this.AutomateOptions)
        },
        {
            title: "Automate marking routable",
            dataIndex: "isAutomateMarkingRoutable",
            key: "isAutomateMarkingRoutable",
            width: 160,
            customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'isAutomateMarkingRoutable', this.AutomateOptions)
        },
        {
            title: "Remark",
            dataIndex: "remark",
            key: "remark",
            width: 200
        },
        {
            title: "Modified by",
            dataIndex: "modifiedBy",
            key: "modifiedBy",
            width: 120
        },
        {
            title: "Last modified",
            dataIndex: "lastModified",
            key: "lastModified",
            width: 200
        }
    ];
    /**表格 */
    private data: any[] = [];

    /**SearchOk */
    public SearchOk(values ? : any): void {
        let data: any = {
            params: Object.assign({}, values, {
                vendorName: values.vendorName || undefined
            })
        };
        VendorSourceSearch(data).then((res: any) => {
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
            const key = new Date().getTime() + i
            // console.log(item)
            return this.$set(this.arr, i, {
                key,
                vendorName: {
                    initialValue: item.vendorName
                },
                accountName: {
                    initialValue: item.accountName
                },
                id: item.id
            })
        })
        this.confirmDataAccount(this.arr)
    }

    /**下拉 */
    public async created() {
        (async () => {
            VendorSourceList('').then((res: any) => {
                this.formoptions[0]['options'] = res.data
            })
        })()
    }
}
</script>
