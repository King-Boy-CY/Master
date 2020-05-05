<template>
<div>
    <!-- 高级搜索a -->
    <Advanced-search :formoptions="formOptions" @Submit="SearchOk" :isChildName="true" allowClear :data="contractDatas" childDataKey="contractfoVOList" />
    <!-- 表格 -->
    <Table parentKey="id" :isFinance="true" :isNeedCheck="true" @onSelectAll="onSelectAll" @onSelect="onSelect" :selectedBtn="selectedBtn" :columns="columns" :data="data" zebraStripe />
    <!-- 分页 -->
    <!-- <pagination @change="onChang"
                @showSizeChange="onShowSizeChange" /> -->
    <!-- 模态弹出框 -->
    <Model align-title="center" v-model="visible" shade title="Add new contract" @Screencover="Screencover">
        <template slot="model-body">
            <div>
                <div :style="activeSelect === 'numberPlan' ? 'box-shadow: 0px 3px 0px 0px rgb(243, 243, 243);border-radius: 3px;margin:10px 20px;' : 'margin:10px 20px;'">
                    <div :style="activeSelect === 'numberPlan' ? 'background:#fff;margin-top:20px;padding:20px 0px;' : 'background:#fff;margin-top:20px;padding:20px 0px;'">
                        <a-row class="sRow" type="flex" justify="center">
                            <a-col v-for="(list,index) in listBar" :key="index" class="sCol" :class="{ active: index === activeIn }" @click="active(index,list.cName)">
                                {{list.name}}
                            </a-col>
                        </a-row>
                    </div>
                    <div class="menu-child">
                        <keep-alive>
                            <div :is='activeSelect' />
                        </keep-alive>
                    </div>
                </div>
            </div>
        </template>

        <template slot="model-footer">
            <a-row>
                <a-col :span="24" :style="{ textAlign: 'center' }" @click="handlesaveAll">
                    <div style="margin-top:10px;">
                        <a-button type="primary" :style="{ borderRadius: '50px 50px 50px 50px' }">
                            Save all
                        </a-button>
                        <a-button :style="{ marginLeft: '8px', color: '#1890ff', borderRadius: '50px 50px 50px 50px', border: '1px solid #1890ff', fontWeight: '600' }" @click="handleReruen">
                            Return
                        </a-button>
                    </div>
                </a-col>
            </a-row>
        </template>
    </Model>
</div>
</template>

<script lang="ts">
import Vue from "vue";
import {
    Component
} from "vue-property-decorator";
// import {
//     columns,
//     data
// } from "@/common/ts/Test";
import {
    AxiosGet
} from '@/api/axios'
import {
    data
} from "../../Finance/Reconciliation/data-confirmation/Test";
import {
    operatingState
} from '@/filter/index'
@Component({
    components: {
        AdvancedSearch: resolve => require(["@/common/Advancedsearch/index.vue"], resolve),
        FormscReening: resolve => require(["@/common/Formscreening/index.vue"], resolve),
        // Table: resolve => require(["@/common/Table/index.vue"], resolve),
        Model: resolve => require(["@/common/Model/index.vue"], resolve),
        Table: () => import("@/views/Finance/components/Table/index.vue"),
    }
})
export default class contractDetails extends Vue {
    private operatingState: Function = operatingState
    crated() {
        console.log(this);
    }
    private selectedBtn: any = [{
        name: 'Export',
        icon: 'export',
        index: 1,
        disabled: false
    }]
    private activeIndex: number = 0;
    public columns: any[] = [{
            title: 'Account',
            dataIndex: 'accountName',
            key: 'accountName',

        },
        {
            title: 'Account type',
            dataIndex: 'accountType',
            key: 'accountType',
            customRender: (value: any, row: any, index: any) => {
                const obj = {
                    children: value,
                };
                const find: any = this.accounttypeOptions.find((item: any) => item.value === value)
                if (find) {
                    obj.children = find.name
                }
                return obj;
            },
        },
        {
            title: 'Time zone',
            dataIndex: 'timeZone',
            key: 'timeZone'
        },
        {
            title: 'Contract',
            dataIndex: 'contractName',
            key: 'contractName'
        },
        {
            title: 'Contract Abbrv.',
            dataIndex: 'contractAbbrv',
            key: 'contractAbbrv'
        },
        {
            title: 'Service',
            dataIndex: 'configServiceNameList',
            key: 'configServiceNameList'
        },
        {
            title: 'Begin date',
            dataIndex: 'beginDate',
            key: 'beginDate'
        },
        {
            title: 'End date',
            dataIndex: 'endDate',
            key: 'endDate',
            sorter: (a, b) => {
                console.log('a', a, 'b', b);
                return a['endDate'] - b['endDate'];
            },
        },
        {
            title: 'Signed date',
            dataIndex: 'singedDate',
            key: 'singedDate'
        },
        {
            title: 'Priority',
            dataIndex: 'priority',
            key: 'priority',
            customRender: (value: any, row: any, index: any) => {
                const obj = {
                    children: value,
                };
                const find: any = this.priorityOptions.find((item: any) => item.value === value)
                if (find) {
                    obj.children = find.name
                }
                return obj;
            },
        },
        {
            title: 'Related Contract',
            dataIndex: 'relatedContract',
            key: 'relatedContract'
        },
        {
            title: 'Auto renew',
            dataIndex: 'isAutoRenew',
            key: 'isAutoRenew',
            customRender: (value: any, row: any, index: any) => {
                const obj = {
                    children: value,
                };
                const find: any = this.isAutoRenewOptions.find((item: any) => item.value === value)
                if (find) {
                    obj.children = find.name
                }
                return obj;
            },
        },
        {
            title: 'renew date',
            dataIndex: 'renewDate',
            key: 'renewDate'
        },
        {
            title: 'Status',
            dataIndex: 'contractStatus',
            key: 'contractStatus',
            customRender: (value: any, row: any, index: any) => {
                console.log(value)
                const obj = {
                    children: value,
                };
                const find: any = this.contractStatusOptions.find((item: any) => item.value === value)
                if (find) {
                    obj.children = find.name
                }
                return obj;
            },
        },
        {
            title: 'Operating State',
            dataIndex: 'operatingState',
            key: 'operatingState',
            customRender: (value: any, row: any, index: any) => {
                // console.log(value);

                const obj = {
                    children: value,
                };
                const find: any = this.operatingStateOptions.find((item: any) => item.value === value)
                if (find) {
                    obj.children = find.name
                } else if (value > 100 && value < 1000) {
                    let n = value - 100
                    obj.children = `R${n}`
                }
                return obj;
            },
        },
        {
            title: 'Modified by',
            dataIndex: 'modifiedBy',
            key: 'modifiedBy'
        },
        {
            title: 'Last Modified',
            dataIndex: 'lastModified',
            key: 'lastModified'
        },
    ];
    private contractDatas: any[] = []
    public data: any[] = [];
    private listBar: any[] = [{
            name: "Contract Details",
            cName: "contractDetials"
        },
        {
            name: "Service",
            cName: "service"
        },
        {
            name: "Cycle",
            cName: "cycle"
        },
        {
            name: "Rate plan",
            cName: "ratePlan"
        },
        {
            name: "Number plan",
            cName: "numberPlan"
        },
        {
            name: "Product",
            cName: "product"
        }
    ];
    private activeIn: number = 0;
    private activeSelect: string = "contractDetials";
    /* Add 选项卡 */
    public active(tab: any, item: any) {
        this.activeIn = tab;
        this.activeSelect = item;
    }
    /* 弹出框显示/隐藏 */
    public visible: boolean = false;
    /*  高级搜索输入框数据
          @param name：label 值 && from输出的字段
          @param required：是否必填 默认false && from输出的字段
          @param type: 输入框什么类型， 例如select['下拉'], picker['时间选择器'] -> 目前只支持这俩个
          @param options：输入框['下拉的子元素数据']
      */
    private formOptions: any[] = [{
            Tips: 'Account',
            name: 'accountName',
            required: false,
            type: 'select',
            span: 12,
            colSpan: 5,
            options: null
        },
        {
            Tips: 'Contract',
            name: 'contractName',
            required: false,
            type: 'select',
            span: 12,
            colSpan: 6,
            options: null
        },
        {
            Tips: 'Status',
            name: 'contractStatus',
            required: false,
            type: 'select',
            span: 12,
            colSpan: 5,
            options: [{
                name: 'Expired',
                value: 1
            }, {
                name: 'Active',
                value: 2
            }, {
                name: 'Future',
                value: 3
            }, {
                name: 'Invalid',
                value: 4
            }]
        },
        {
            Tips: 'Operating State',
            name: 'operatingState',
            required: false,
            type: 'select',
            span: 12,
            colSpan: 6,
            options: [{
                    name: 'N',
                    value: 1
                }, {
                    name: 'E',
                    value: 2
                }, {
                    name: 'D',
                    value: 3
                },
                {
                    name: 'R',
                    value: 100
                },
            ]
        },
        {
            Tips: 'Begin date',
            name: 'beginDate',
            required: false,
            span: 12,
            colSpan: 5,
            type: 'picker'
        },
        {
            Tips: 'End date',
            name: 'endDate',
            required: false,
            span: 12,
            colSpan: 6,
            type: 'picker'
        }
    ]
    private accounttypeOptions: any = [{
        name: 'bilateral',
        value: 1
    }, {
        name: 'vendor',
        value: 2
    }, {
        name: 'client',
        value: 3
    }]
    private priorityOptions: any = [{
        name: 'low',
        value: 1
    }, {
        name: 'high',
        value: 10
    }, ]
    private isAutoRenewOptions: any = [{
        name: 'no',
        value: 0
    }, {
        name: 'yes',
        value: 1
    }, ]
    private contractStatusOptions: any = [{
        name: 'Expired',
        value: 1
    }, {
        name: 'Active',
        value: 2
    }, {
        name: 'Future',
        value: 3
    }, {
        name: 'Invalid',
        value: 4
    }]
    private operatingStateOptions: any = [{
        name: 'N',
        value: 1
    }, {
        name: 'E',
        value: 2
    }, {
        name: 'D',
        value: 3
    }, {
        name: 'R',
        value: 100
    }]
    // 修改按钮可否点击
    private changeDisable(selectedRows: any) {
        // 0 edit   1 export
        if (selectedRows.length === 1) {
            this.selectedBtn[0].disabled = false
            this.selectedBtn[1].disabled = false
        } else if (selectedRows.length > 1) {
            this.selectedBtn[0].disabled = true
            this.selectedBtn[1].disabled = false
        } else {
            this.selectedBtn[0].disabled = true
            this.selectedBtn[1].disabled = true
        }
    }
    public SearchOk(values: any): void {
        const data: any = {
            params: Object.assign({}, values, {
                contractNameList: values.contractNameList && values.contractNameList.length > 0 ? values.contractNameList.join(',') : undefined,
                configServiceNameList: values.configServiceNameList && values.configServiceNameList.length > 0 ? values.configServiceNameList.join(',') : undefined,
                beginDate: values.beginDate ? values.beginDate.format('YYYY-MM-DD') : undefined,
                endDate: values.endDate ? values.endDate.format('YYYY-MM-DD') : undefined,
            })
        }
        AxiosGet('/contract/vc-information/details', data).then((res: any) => {
            res.data.forEach((item: any, index: number) => {
                item['id'] = index
            })
            this.data = res.data
        })
    }
    /* 用户手动选择/取消选择所有列的回调  Table -> 回调 */
    public onSelectAll(selected: any, selectedRows: any, changeRows: any) {
        // console.log(selected, selectedRows, changeRows);
    }
    /* 用户手动选择/取消选择某列的回调
         @param record: 选中数据
         @param selected: 是否选中 true/false
         @param selectedRows: 所有选中 Array
      */
    public onSelect(record: object, selected: boolean, selectedRows: any) {
        // console.log(record, selected, selectedRows);
    }

    /* 点击切换页 分页(pagination) -> 回调 */
    public onChang(pageSize: number) {
        // console.log(pageSize)
    }
    /* 选择当前列表显示多少列
        @param: current  : 当前页
        @param：pageSize : 当前显示多少列
     */
    public onShowSizeChange(current: number, pageSize: number): void {
        // console.log(current, pageSize)
    }
    public created() {
        AxiosGet("/config/droplist/accounts").then((res: any) => {
            this.formOptions[0]['options'] = res.data
        })
        AxiosGet("/config/droplist/contracts").then((res: any) => {
            this.formOptions[1]['options'] = res.data
        })
    }
    /* 操作栏点击 -> 回调 */
    public activeClick({
        name,
        index
    }: any) {
        index !== 3 && (this.visible = !this.visible) && (this.activeIndex = index);
    }
    /* 校验所有 */
    handlesaveAll() {
        // console.log("校验开始");
    }
    /* 退出 */
    handleReruen() {
        this.Screencover();
    }
    /* 关闭 Add */
    public Screencover() {
        this.visible = !this.visible;
    }
}
</script>

<style lang="scss" scoped>
.slot-model-box {
    margin: 10px 20px;
    // background:#fff;
    box-shadow: 0px 3px 10px 0px rgb(243, 243, 243);
    border-radius: 2px;
    min-height: 300px;
    padding: 20px 5px;
}

.sRow {
    border: 1px solid rgb(62, 119, 216);
    max-width: 587px;
    margin: 0px auto;
    border-radius: 50px 50px 50px 50px;
    box-sizing: border-box;
    font-size: 14px;
    font-weight: 600;
}

.sCol {
    padding: 11px 19px 11px 16px;
    border-radius: 50px 50px 50px 50px;
    color: rgb(62, 119, 216);
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        background: rgb(62, 119, 216);
        color: #ffffff;
    }
}

.active {
    transition: all 0.2s;
    background: rgb(62, 119, 216);
    color: #ffffff;
}
</style>
