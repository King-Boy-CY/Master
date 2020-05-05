<template>
<div class="ratePlanPage">
    <product-detail :isVisible.sync="isVisible" :productId="productId"></product-detail>
    <AdvancedSearch :formoptions="formOptions" :allowClear="true" @Submit="SearchOk" :span='span' :isChildName="true" />
    <div class="ratePlan">
        <Table @onSelectAll="onSelectAll" @insertDetail="insertDetail" ref="ratePlanInsert" @onSelect="onSelect" @onChange="onChange" :useSelectedRowKeys="true" :columns="ratePlanColumn" :data="ratePlanDatas" zebraStripe childTab :childColumnss="childColumnss" :isRate="true" childDataKey="contractRatePlanInfoVOList" childKey="productId" :pageSizeOptions="['5','20', '50', '100']" :defaultPageSize="5" :scroll="{ x: '100%'}">

        </Table>
    </div>
    <div>
        <a-row>
            <a-col :span="24" :style="{ textAlign: 'center' ,marginTop:'16px'}">
                <a-button type="primary" :style="{ borderRadius: '50px 50px 50px 50px' }" @click="confirm">
                    Confirm
                </a-button>
                <a-button type="primary" @click="Screencover" :style="{ borderRadius: '50px 50px 50px 50px', background:'0px', color: '#1890ff', marginLeft:'8px' }">
                    return
                </a-button>
            </a-col>
        </a-row>
    </div>
</div>
</template>

<script lang="ts">
import Vue from 'vue'
// import {
//     AxiosPost
// } from '@/api/axios'
import{
  getDetailAccounts,
  cycleContract,
  getDetailService,
  cycleCycle,
  cycleContents,
  rateplansSummary,
}from "@/api/index.ts";
import {
    Component,
    Prop,
    Emit
} from 'vue-property-decorator'
import {
    ratePlanColumn,
    childColumnss,
    childData
} from '@/common/ts/tableData'

import {
    RateStructureOption,
    DirectionOption
} from '@/common/ts/options'

import moment from 'moment'

@Component({
    components: {
        AdvancedSearch: resolve => require(['@/common/Advancedsearch/index.vue'], resolve),
        Model: resolve => require(["@/common/Model/index.vue"], resolve),
        Table: resolve => require(["@/common/Table/index.vue"], resolve),
        flat: () => import('@/components/formscReening/details/productDetail/flatView.vue'),
        tier: () => import('@/components/formscReening/details/productDetail/tierView.vue'),
        interval: () => import('@/components/formscReening/details/productDetail/intervalView.vue'),
        recurringCharge: () => import('@/components/formscReening/details/productDetail/recurringChargeView.vue'),
        oneTimeChangeView: () => import('@/components/formscReening/details/productDetail/oneTimeChangeView.vue'),
        productDetail: () => import('@/components/AddNewContract/productDetail.vue')
    }
})
export default class ratePlanInsert extends Vue {
    @Emit('sendProduct') sendProduct(msg: any) {}

    @Emit('visibleHide') visibleHide() {}

    // private selectedRowKeys:any=[]
    private activeSelect: string = ''
    private formOptions: any[] = [{
            Tips: 'Account',
            name: 'Account',
            required: false,
            type: 'select',
            options: null
        },
        {
            Tips: 'Contract',
            name: 'Contract',
            required: false,
            type: 'tags',
            options: null
        },
        {
            Tips: 'Service',
            name: 'Service',
            required: false,
            type: 'tags',
            options: null
        },
        {
            Tips: 'Direction',
            name: 'Direction',
            required: false,
            type: 'select',
            options: [{
                    name: 'Inbound',
                    value: 1
                },
                {
                    name: 'Outbound',
                    value: 2
                }
            ]
        },
        {
            Tips: 'Cycle',
            name: 'Cycle',
            required: false,
            type: 'tags',
            options: null
        },
        {
            Tips: 'RateStructure',
            name: 'RateStructure',
            required: false,
            type: 'select',
            options: RateStructureOption
            // options: [{
            //   name: 'flat'
            // }, {
            //   name: 'tier'
            // },{
            //   name: 'interval'
            // },{
            //   name: 'recurring charge'
            // },{
            //   name: 'one-time charge'
            // },{
            //   name: 'penalty'
            // },{
            //   name: 'cap'
            // },{
            //   name: 'discount'
            // }]
        },
    ]
    /* 弹出框显示/隐藏 */
    public isVisible: boolean = false;
    private span: number = 12
    private ratePlanColumn: any[] = ratePlanColumn //表头
    private ratePlanDatas: any[] = [] //表格主
    private childColumnss: any[] = childColumnss //子表格表头
    private childData: any[] = [] //子表格身体
    // private record: any = [] //子组件confirm
    private tableSelectObj: any = {} //table 组件勾选的数据
    //Insert 页面 Seach 按钮传递过来的值
    /* 用户手动选择/取消选择所有列的回调  Table -> 回调 */
    public onChange(selectedRowKeys: any, selectedRows: any) {
        // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
    }

    // private selectMsg: any = [] //给后台参数
    public onSelectAll(selected: any, selectedRows: any, changeRows: any, key: string) {
        // this.record = selectedRows.length>0 ? selectedRows : 'changeRows'
        if (key) {
            this.tableSelectObj[key] = selectedRows.length > 0 ? selectedRows : []
        }
    }

    /* 用户手动选择/取消选择某列的回调
         @param record: 选中数据
         @param selected: 是否选中 true/false
         @param selectedRows: 所有选中 Array
      */
    public onSelect(record: object, selected: boolean, selectedRows: any, key: string) {
        // console.log(record, selected, selectedRows)
        // console.log("record:"+record, "selected"+selected, "selectedRows"+selectedRows)
        if (key) {
            this.tableSelectObj[key] = selectedRows.length > 0 ? selectedRows : []
        }
    }

    private productId: string | number = ''

    /**Table Details 传过来的 id */
    public async insertDetail(id: any) {
        this.productId = id
        this.isVisible = !this.isVisible
    }

    // 高级搜索 Search -> 回调
    public SearchOk(val: any) {
        console.log(val);
        // 清楚上一次选中后又按搜索的数据
        this.tableSelectObj = {}
        const {
            Account: accountName,
            Contract: contractNameList,
            Cycle: cycleNameList,
            Direction: direction,
            RateStructure: rateStructure,
            Service: configServiceNameList
        } = val
        const ratePlanSearch = {
            accountName,
            contractNameList: contractNameList && contractNameList.length ? contractNameList.join(',') : undefined,
            cycleNameList: cycleNameList && cycleNameList.length ? cycleNameList.join(',') : undefined,
            direction,
            rateStructure,
            configServiceNameList: configServiceNameList && configServiceNameList.length ? configServiceNameList.join(',') : undefined,
        }
        // console.log(ratePlanSearch);
        // AxiosGet('/contract/vc-contract/rateplans/summary', {
        //     params: ratePlanSearch
        // })
        rateplansSummary({params: ratePlanSearch}).then((res: any) => {
            const ratePlanDatas = res.data
            ratePlanDatas.forEach((item: any, index: number) => {
                item.contractRatePlanInfoVOList && item.contractRatePlanInfoVOList.forEach((inner: any) => {
                    inner.parentKey = index
                })
            });
            this.ratePlanDatas = ratePlanDatas
        })
    }

    public Screencover() {
        this.visibleHide()
    }

    private setOptions(arr: string[]): object[] {
        return arr.map((item: any) => {
            return {
                name: item,
                value: item
            }
        })
    }
    public created() {
        // AxiosGet("/config/droplist/accounts", {}).then((res: any) => {
        //     this.formOptions[0].options = this.setOptions(res.data)
        // })
         getDetailAccounts().then((res: any) => {
            this.formOptions[0].options = this.setOptions(res.data)
        })
        // AxiosGet("/config/droplist/contracts").then((res: any) => {
        //     this.formOptions[1]['options'] = this.setOptions(res.data)
        // })
        cycleContract().then((res: any) => {
            this.formOptions[1]['options'] = this.setOptions(res.data)
        })
        // AxiosGet("/config/droplist/services").then((res: any) => {
        //     this.formOptions[2]['options'] = this.setOptions(res.data)
        // })
        getDetailService().then((res: any) => {
            this.formOptions[2]['options'] = this.setOptions(res.data)
        })
        // AxiosGet("/config/droplist/cycles").then((res: any) => {
        //     this.formOptions[4]['options'] = this.setOptions(res.data)
        // })
        cycleCycle().then((res: any) => {
            this.formOptions[4]['options'] = this.setOptions(res.data)
        })
    }

    //提交数据到 ratePlan页面
    private ids: string = ''

    public async confirm() {
        let record: any = []
        console.log(this.tableSelectObj)
        for (let key in this.tableSelectObj) {
            const item = JSON.parse(JSON.stringify(this.tableSelectObj[key]))
            record = record.concat(item)
        }
        this.ids = record.map((item: any) => item.productId).join(',')
        if (!this.ids) {
            // console.log('没有勾选')
            this.$message.warning('not checked')
            return false
        }
        // await AxiosGet('/contract/vc-contract/products/contents/' + this.ids).then((res: any) => {
        //     this.sendProduct({
        //         record,
        //         resDate: res.data
        //     })
        // })
        await cycleContents(this.ids).then((res: any) => {
            this.sendProduct({
                record,
                resDate: res.data
            })
        })
        // console.log(this.resData);
        await this.Screencover()
        this.$nextTick(() => {
            const ratePlanInsert: any = this.$refs.ratePlanInsert
            ratePlanInsert.clearSelectRowKeys()
            this.tableSelectObj = {}
        })
    }
}
</script>

<style>
.ratePlanPage .ant-table-bordered .ant-table-thead>tr>th,
.ratePlanPage .ant-table-bordered .ant-table-tbody>tr>td {
    /* text-align: center; */
    width: 5.6%;
}
</style><style lang="scss" scoped>
// .ratePlanPage {
//   width: 100%;
//   overflow-x: scroll;
// }
.model-title {
    padding: 16px 24px;
    color: rgba(0, 0, 0, 0.65);
    border-bottom: 1px solid #e8e8e8;
    font-weight: 600;

    .ant-modal-close {
        cursor: pointer;
        border: 0;
        background: transparent;
        position: absolute;
        right: 0;
        top: 0;
        z-index: 10;
        font-weight: 700;
        line-height: 1;
        text-decoration: none;
        transition: color 0.3s;
        color: rgba(0, 0, 0, 0.45);
        outline: 0;
        padding: 0;
        transition: all 0.2s;

        &:hover {
            color: #000;
        }
    }
}

.ant-modal-close {
    cursor: pointer;
    border: 0;
    background: transparent;
    position: absolute;
    right: 40px;
    top: 40px;
    z-index: 10;
    font-weight: 700;
    line-height: 1;
    text-decoration: none;
    transition: color 0.3s;
    color: rgba(0, 0, 0, 0.45);
    outline: 0;
    padding: 0;
    transition: all 0.2s;

    &:hover {
        color: #000;
    }
}

.ratePlan {
    // overflow-x: scroll;
    background: rgb(255, 255, 255);
    //margin-top: 20px;
}
</style>
