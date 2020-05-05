<template>
<div>
    <Advanced-search :formoptions="formOptions" @Submit="SearchOk" :isChildName="true" allowClear :data="contractDatas" childDataKey="contractfoVOList" />
    <!-- 表格 -->
    <Table parentKey="id" :isFinance="true" :isNeedCheck="true" @onSelectAll="onSelectAll" @onSelect="onSelect" @onSelectClick="onSelectClick" :selectedBtn="selectedBtn" :columns="columns" :data="data" zebraStripe />
    <!-- 分页 -->
    <!--<pagination @change="onChang"-->
    <!--@showSizeChange="onShowSizeChange" />-->
    <!-- Deatils模态弹出框 -->
    <Model align-title="center" class="bgcol" v-model="visible" shade title="Vc information Details" @Screencover="Screencover">
        <template slot="model-body">
            <div>
                <div :style="activeSelect === 'numberPlan' ? 'box-shadow: 0px 3px 0px 0px rgb(243, 243, 243);border-radius: 3px;margin:10px 20px;' : 'margin:10px 20px;'">

                    <a-row type="flex" justify="center">
                        <a-col v-if="!!currentProductData" style="font-size:20px">
                            {{currentProductData[0].productName}}
                        </a-col>
                    </a-row>

                    <div class="menu-child">
                        <flat v-if="!!currentProductData &&currentProductData[0].rateStructure ==1" :currentProductData="currentProductData"></flat>
                        <tier v-if="!!currentProductData &&currentProductData[0].rateStructure ==2" :currentProductData="currentProductData"></tier>
                        <interval v-if="!!currentProductData &&currentProductData[0].rateStructure ==3" :currentProductData="currentProductData"></interval>
                        <recurring-charge v-if="!!currentProductData&&currentProductData[0].rateStructure ==4" :currentProductData="currentProductData"></recurring-charge>
                        <one-time-change-view v-if="!!currentProductData &&currentProductData[0].rateStructure ==5" :currentProductData="currentProductData"></one-time-change-view>
                    </div>
                </div>
            </div>
        </template>

        <template slot="model-footer">
            <a-row>
                <a-col :span="24" :style="{ textAlign: 'center' }" @click="handlesaveAll">
                    <div style="margin-top:10px;">

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

import {
    AxiosGet
} from '@/api/axios'
@Component({
    components: {
        AdvancedSearch: resolve => require(["@/common/Advancedsearch/index.vue"], resolve),
        FormscReening: resolve => require(["@/common/Formscreening/index.vue"], resolve),
        // Table: resolve => require(["@/common/Table/index.vue"], resolve),
        // pagination: resolve => require(["@/common/pagination/index.vue"], resolve),
        Model: resolve => require(["@/common/Model/index.vue"], resolve),
        contractDetials: resolve => require(["@/components/AddNewContract/contractDetails/index.vue"], resolve),
        cycle: resolve => require(["@/components/AddNewContract/cycle/index.vue"], resolve),
        numberPlan: resolve => require(["@/components/AddNewContract/numberPlan.vue"], resolve),
        product: resolve => require(["@/components/AddNewContract/product/index.vue"], resolve),
        ratePlan: resolve => require(["@/components/AddNewContract/ratePlan/ratePlan.vue"], resolve),
        service: resolve => require(["@/components/AddNewContract/service/index.vue"], resolve),
        Table: () => import("@/views/Finance/components/Table/index.vue"),
        flat: () => import('@/components/formscReening/details/productDetail/flatView.vue'),
        tier: () => import('@/components/formscReening/details/productDetail/tierView.vue'),
        interval: () => import('@/components/formscReening/details/productDetail/intervalView.vue'),
        recurringCharge: () => import('@/components/formscReening/details/productDetail/recurringChargeView.vue'),
        oneTimeChangeView: () => import('@/components/formscReening/details/productDetail/oneTimeChangeView.vue')
    }
})
export default class product extends Vue {
    private currentProductData: any[] = [{
        productName: '',
        rateStructure: ''
    }]
    private selectedBtn: any = [{
            name: 'Details',
            icon: 'file-text',
            index: 1,
            disabled: true,
            tips: 'Please select one record to view details'
        }, {
            name: 'Export',
            icon: 'export',
            index: 2,
            disabled: false
        },
        {
            name: 'Download',
            icon: 'download',
            index: 3,
            disabled: false
        }
    ]
    private activeIndex: number = 0;
    public columns: any[] = [{
            title: 'Contract',
            dataIndex: 'contractName',
            key: 'contractName'
        },
        {
            title: 'Product',
            dataIndex: 'productName',
            key: 'productName'
        },
        {
            title: 'Structure',
            dataIndex: 'rateStructure',
            key: 'rateStructure',
            customRender: (value: any, row: any, index: any) => {
                const obj = {
                    children: value,
                };
                const find: any = this.rateStructurOptions.find((item: any) => item.value === value)
                if (find) {
                    obj.children = find.name
                }
                return obj;
            },
        },
        {
            title: 'Commitment',
            dataIndex: 'isCommitment',
            key: 'isCommitment',
            customRender: (value: any, row: any, index: any) => {
                const obj = {
                    children: value,
                };
                const find: any = this.isCommitmentOptions.find((item: any) => item.value === value)
                if (find) {
                    obj.children = find.name
                }
                return obj;
            },
        },
        {
            title: 'Begin date',
            dataIndex: 'beginDate',
            key: 'beginDate'
        },
        {
            title: 'End date',
            dataIndex: 'endDate',
            key: 'endDate'
        },
        {
            title: 'Status',
            dataIndex: 'contractStatus',
            key: 'contractStatus',
            customRender: (value: any, row: any, index: any) => {
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
            title: 'Modifled by',
            dataIndex: 'modifiedBy',
            key: 'modifiedBy'
        },
        {
            title: 'Last Modifled',
            dataIndex: 'lastModified',
            key: 'lastModified'
        },
    ];
    private contractDatas: any[] = []
    public data: any[] = [];
    private activeIn: number = 0;
    private activeSelect: string = "contractDetials";
    /* Add 选项卡 */
    public active(tab: any, item: any) {
        console.log(tab, item);

        this.activeIn = tab;
        this.activeSelect = item;
    }
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
    private rateStructurOptions: any = [{
        name: 'Flat',
        value: 1
    }, {
        name: 'Tier',
        value: 2
    }, {
        name: 'Interval',
        value: 3
    }, {
        name: 'RecurringCharge',
        value: 4
    }, {
        name: 'OneTimeCharge',
        value: 5
    }, {
        name: 'Penalty',
        value: 6
    }, {
        name: 'Cap',
        value: 7
    }, {
        name: 'Discount',
        value: 8
    }]
    private isCommitmentOptions: any = [{
        name: 'No',
        value: 0
    }, {
        name: 'Yes',
        value: 1
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
            Tips: 'Service',
            name: 'configServiceName',
            required: false,
            type: 'select',
            span: 12,
            colSpan: 5,
            options: null
        },
        {
            Tips: 'Direction',
            name: 'direction',
            required: false,
            type: 'select',
            span: 12,
            colSpan: 6,
            options: [{
                name: 'Inbound',
                value: 1
            }, {
                name: 'outbound',
                value: 2
            }, ]
        },
        {
            Tips: 'Cycle',
            name: 'cycleNameList',
            required: false,
            type: 'tags',
            span: 12,
            colSpan: 5,
            options: null
        },
        {
            Tips: 'Rate Structure',
            name: 'rateStructureList',
            required: false,
            type: 'tags',
            span: 12,
            colSpan: 6,
            options: [{
                name: 'Flat',
                value: 1
            }, {
                name: 'Tier',
                value: 2
            }, {
                name: 'Interval',
                value: 3
            }, {
                name: 'RecurringCharge',
                value: 4
            }, {
                name: 'OneTimeCharge',
                value: 5
            }, {
                name: 'Penalty',
                value: 6
            }, {
                name: 'Cap',
                value: 7
            }, {
                name: 'Discount',
                value: 8
            }]

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
            }, {
                name: 'R',
                value: 100
            }]
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
    /**Details || Export  || Download  回调 */
    public async onSelectClick(activeObJ: any, selected: any, selectedRows: any) {
        if (activeObJ.name == "Details") {
            console.log(activeObJ);
            console.log(selected);
            console.log('selectedRows', selectedRows);
            let id = selectedRows[0].productId
            let url = `/contract/vc-contract/products/contents/${id}`
            await AxiosGet(url).then((response) => {
                console.log(response);
                this.currentProductData = response.data
                // this.$set(this,'currentProductData',response.data)
                // this.$forceUpdate()
            })
            this.visible = !this.visible

            console.log(this.currentProductData);

        }
    }
    /* 筛选栏 button-数据
       @param name: button 名字
       @param icon: button 图标
    */
    // 高级搜索 Search -> 回调

    public SearchOk(values: any): void {
        let data: any = {
            params: Object.assign({}, values, {
                rateStructureList: values.rateStructureList && values.rateStructureList.length > 0 ? values.rateStructureList.join(',') : undefined,
                cycleNameList: values.cycleNameList && values.cycleNameList.length > 0 ? values.cycleNameList.join(',') : undefined,
                beginDate: values.beginDate ? values.beginDate.format('YYYY-MM-DD') : undefined,
                endDate: values.endDate ? values.endDate.format('YYYY-MM-DD') : undefined,
            })
        }

        AxiosGet('/vc-information/products', data, '/contract').then((res: any) => {
            res.data.forEach((item: any, index: number) => {
                item['id'] = index
            })
            this.data = res.data
        })
    }
    /* 用户手动选择/取消选择所有列的回调  Table -> 回调 */
    public onSelectAll(selected: boolean, selectedRows: any, changeRows: any) {
        console.log(selected, selectedRows, changeRows);
        this.selectedBtn[0].disabled = !(changeRows.length == '1')
    }
    /* 用户手动选择/取消选择某列的回调
         @param record: 选中数据
         @param selected: 是否选中 true/false
         @param selectedRows: 所有选中 Array
      */
    public onSelect(record: object, selected: boolean, selectedRows: any) {
        // console.log(record, selected, selectedRows);
        console.log(selectedRows.length);
        this.selectedBtn[0].disabled = !(selectedRows.length == '1')

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
        console.log(this.currentProductData);

        AxiosGet("/config/droplist/accounts").then((res: any) => {
            this.formOptions[0]['options'] = res.data
        })
        AxiosGet("/config/droplist/services").then((res: any) => {
            this.formOptions[2]['options'] = res.data
        })
        AxiosGet("/config/droplist/contracts").then((res: any) => {
            this.formOptions[1]['options'] = res.data
        })

        AxiosGet("/config/droplist/cycles").then((res: any) => {
            this.formOptions[4]['options'] = res.data
        })
    }

    /* 操作栏点击 -> 回调 */
    public activeClick({
        name,
        index
    }: any) {
        console.log(`activeClick`);

        console.log(name, index);

        // index !== 3 && (this.visible = !this.visible) && (this.activeIndex = index);
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

<style lang="scss">
.slot-model-box {
    margin: 10px 20px;
    background: #fff;
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
