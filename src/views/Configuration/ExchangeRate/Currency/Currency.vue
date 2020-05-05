<template>
<div>
    <!-- 高级搜索 -->
    <Advanced-search :formoptions="formOptions" :isChildName="true" allowClear @Submit="SearchOk" :data="contractDatas" childDataKey="contractfoVOList" />
    <!-- 表格 -->
    <Table parentKey="id" :isFinance="true" :isNeedCheck="true" :selectedBtn="Formscreening" @onSelectClick="activeClick" ref="table" @onSelectAll="onSelectAll" @onSelect="onSelect" :columns="columns" :data="data" zebraStripe />
    <!-- 分页 -->
    <!--<pagination @change="onChang"/>-->
    <!-- Add模态弹出框 -->
    <Model align-title="center" v-if="activeIndex === 1 && visible" v-model="visible" shade title="Add Currency" @Screencover="Screencover">
        <template slot="model-body">
            <div>
                <div :style="activeSelectAdd === 'numberPlan' ? 'box-shadow: 0px 3px 0px 0px rgb(243, 243, 243);border-radius: 3px;margin:10px 20px;' : 'margin:10px 20px;'">
                    <div :style="activeSelectAdd === 'numberPlan' ? 'background:#fff;margin-top:20px;padding:20px 0px;' : 'background:#fff;margin-top:20px;padding:20px 0px;'">
                    </div>
                    <div class="menu-child">
                        <keep-alive>
                            <form-group :is='activeSelectAdd' ref="isdeep" />
                        </keep-alive>
                    </div>
                </div>
            </div>
        </template>
        <template slot="model-footer">
            <a-row>
                <a-col :span="24" :style="{ textAlign: 'center' }" @click="handlesaveAll">
                    <div style="margin-top:10px;">
                        <a-button type="primary" :style="{ borderRadius: '50px 50px 50px 50px' }" @click="addAllData">
                            save
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
import {
    State,
    Mutation
} from 'vuex-class'
import {
    AxiosGet,
    AxiosPost,
    AxiosDelete,
} from '@/api/axios'
import {
    CurrencySearch,
    CurrencyAdd,
    currencys,
    CurrencyDelete
} from '@/api/index'
import {
    Currencys,
    formOptionsConfigs
} from './CurrencyConfig'
import {
    format
} from 'ssf/types';
import {
    recodeConfig,
    refsConfig
} from '@/assets/ts/config.d'
import {
    distinct
} from "@/assets/ts/index";

@Component({
    components: {
        AdvancedSearch: resolve => require(["@/common/Advancedsearch/index.vue"], resolve),
        pagination: resolve => require(["@/common/pagination/index.vue"], resolve),
        Model: resolve => require(["@/common/Model/index.vue"], resolve),
        CurrencyAdd: resolve => require(["./Currencyadd.vue"], resolve),
        detailS: (resolve) => require(["@/components/formscReening/details/index.vue"], resolve),
        Table: () => import("@/views/Finance/components/Table/index.vue"),
        contractDetailsEdit: () => import("@/components/AddNewContract/contractDetails/index.vue"),
        TableInput: resolve => require(['@/common/TableInput/index.vue'], resolve)
    }
})
export default class Currency extends Vue {
    private activeIndex: number = 0;
    private selectName: any = '';
    private direction: any = '' // 方向
    private values = {};
    public $refs: refsConfig | any
    private detailsId: any;
    private selectedRows: any;
    private activeInAdd: number = 0; //add 默认弹框下标
    private activeInEdit: number = 0; //edit 默认弹框下标
    private detailResMsg: any; // Detail 页面接口数据
    private productName: any //product 页面数据
    private relatedContract: string = "";
    private priority: any = "";
    private activeSelectAdd: string = "CurrencyAdd"; //add 动态组件切换
    private columns: Currencys[] = [{
            title: 'Currency',
            dataIndex: 'currencyType',
            key: 'currencyType',
            width: 300
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            width: 150
        },
        {
            title: 'Remark',
            dataIndex: 'remark',
            key: 'remark',
            width: 150
        },
        {
            title: 'Modified by',
            dataIndex: 'modifiedBy',
            key: 'modifiedBy',
            // width:100
        },
        {
            title: 'Last modified',
            dataIndex: 'lastModified',
            key: 'lastModified',
            width: 170
        },
    ];
    private contractDatas: any[] = []
    private data: any[] = [];
    private formOptions: formOptionsConfigs[] = [{
        Tips: 'Currency',
        name: 'currencyType',
        required: false,
        type: 'select',
        span: 12,
        showSearch: true,
        startwithOptions: true,
        colSpan: 6,
        options: null
    }]
    private Formscreening: any[] = [{
            name: "Add",
            icon: "plus-circle",
            index: 1
        },
        {
            name: "Delete",
            icon: "delete",
            disabled: true,
            tips: "Need to be selected to delete",
            index: 2
        },
    ];
    /* 用户手动选择/取消选择所有列的回调  Table -> 回调 */
    public onSelectAll(selected: any, selectedRows: any, changeRows: any) {
        // console.log(selected, selectedRows, changeRows);
        this.prouccDatiletias(selectedRows)
    }
    /* 用户手动选择/取消选择某列的回调
         @param record: 选中数据
         @param selected: 是否选中 true/false
         @param selectedRows: 所有选中 Array
      */
    public onSelect(record: object, selected: boolean, selectedRows: any) {
        // console.log(record, selected, selectedRows);
        this.prouccDatiletias(selectedRows)
    }

    /**多选禁止操作按钮 */
    public prouccDatiletias(selectedRows: any) {
        if (selectedRows.length) {
            this.detailsId = selectedRows[0].id
        }
        this.$set(this.Formscreening[1], 'disabled', selectedRows.length == 0)
    }
    /* 点击切换页 分页(pagination) -> 回调 */
    public onChang(pageSize: number) {
        // console.log(pageSize)
    }
    // /* Add 选项卡 */
    // public activeAdd(tab: any, item: any) {
    //     console.log(tab, item);

    //     this.activeInAdd = tab;
    //     this.activeSelectAdd = item;
    // }
    /* 获取新增合同所有数据 */
    public addAllData(values: any): void {
        let that: any = this;
        if (this.activeIndex === 1) {
            let {
                currencyType,
                description,
                remark
            } = that.$refs.isdeep.form.getFieldsValue();
            console.log(that.$refs.isdeep.form.getFieldsValue())
            let add = {
                currencyType,
                description,
                remark
            }
            CurrencyAdd(add).then((res: any) => {
                if (res.code >= 1) {
                    that.visible = !that.visible;
                    that.$message.success("Successful addition");
                    CurrencySearch("").then((res: any) => {
                        that.data = res.data;
                        console.log(that.data)
                    });
                } else {
                    that.$message.warning(res.msg);
                }
            });
        }
    }

    // 高级搜索 Search -> 回调
    public SearchOk(values: any): void {
        let data: any = {
            params: Object.assign({}, values, {})
        }
        // console.log('data', data,values);
        CurrencySearch(data).then((res: any) => {
            this.data = res.data
        })
    }

    public created() {
        currencys("").then((res: recodeConfig) => {
            this.$set(this.formOptions[0], "options",distinct(res.data))
        })
    }

    /* 操作栏点击 -> 回调 */
    private visible: any = false
    private addEdit: any = {}
    public async activeClick({
        name,
        index
    }: any, selected: any, selectedData: any, activeObJ: any) {
        // console.log(index);
        // console.log(this.detailsId);
        console.log(selectedData);
        console.log(index !== 3 && (this.visible = !this.visible) && (this.activeIndex = index));
        const deleted = selectedData.map((item: any) => item.id).join(",") //多选删除
        /*删除按钮*/
        if (index == 2 && this.detailsId) {
            this.activeIndex = 2;
            let _this = this;
            this.$confirm({
                title: "Confirm!",
                content: `You are sure you want to delete it ?`,
                okText: "YES",
                cancelText: "NO",
                onOk() {
                    const that = this;
                    CurrencyDelete(deleted).then((res: any) => {
                        console.log("Confirm", res);
                        if (res.code < 0) {
                            _this.$message.error(res.msg);
                            console.log(_this.visible);
                            _this.visible = false;
                        } else {
                            _this.visible = false;
                            _this.$message.success("Data has been deleted successfully");
                            _this.SearchOk("");
                        }
                    });
                }
            });
        }
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
    max-width: 611px;
    margin: 0px auto;
    border-radius: 50px 50px 50px 50px;
    box-sizing: border-box;
    font-size: 14px;
    font-weight: 600;
    display: flex;
    justify-content: space-between;
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
