<template>
<div>
    <!-- 高级搜索 -->
    <Advanced-search :formoptions="formOptions" :isChildName="true" @selectChange="selectChangebr" allowClear @Submit="SearchOk" :data="contractDatas" ref="AdvancedSearch" childDataKey="contractfoVOList" />
    <!-- 表格 -->
    <Table parentKey="id" :isFinance="true" :isNeedCheck="true" :selectedBtn="Formscreening" @onSelectClick="activeClick" ref="table" @onSelectAll="onSelectAll" @onSelect="onSelect" :columns="columns" :data="data" zebraStripe />
    <!-- 分页 -->
    <!-- <pagination @change="onChang"/> -->
    <!-- Add模态弹出框 -->
    <Model align-title="center" v-model="visible" v-if="activeIndex === 1 && visible" shade title="Add VC rounding rules" @Screencover="Screencover">
        <template slot="model-body">
            <div>
                <div :style="activeSelectAdd === 'numberPlan' ? 'box-shadow: 0px 3px 0px 0px rgb(243, 243, 243);border-radius: 3px;margin:10px 20px;' : 'margin:10px 20px;'">
                    <div :style="activeSelectAdd === 'numberPlan' ? 'background:#fff;margin-top:20px;padding:20px 0px;' : 'background:#fff;margin-top:20px;padding:20px 0px;'">
                    </div>
                    <div class="menu-child">
                        <keep-alive>
                            <form-group :is='activeSelectAdd' ref="service" />
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
    AxiosPut,
    AxiosDelete,
} from '@/api/axios'
import {
    VcRudingRules,
    VcRudingRulesAdd,
    RoundingRuleName,
    MinmumValues,
    AdditionalRoundings,
    Maximums,
    MeasureAdjustments,
    InitialRoundings,
    VcRudingRulesDelete
} from '@/api/index'
import moment from 'moment'
import xlsx from 'xlsx'
import {
    columnsConfig,
    formOptionsConfig,
    column,
} from './VcRoundingRulesConfig'
import {onSelectClick} from '@/views/Configuration/Exports'
import {
    recodeConfig,
    refsConfig
} from '@/assets/ts/config.d'
import {
    getExpData
} from '@/views/Trade/sellPrice/method'


@Component({
    components: {
        AdvancedSearch: resolve => require(["@/common/Advancedsearch/index.vue"], resolve),
        pagination: resolve => require(["@/common/pagination/index.vue"], resolve),
        Model: resolve => require(["@/common/Model/index.vue"], resolve),
        product: resolve => require(["@/components/AddNewContract/product/index.vue"], resolve),
        service: resolve => require(["./VcRoudingRuluesservice.vue"], resolve),
        detailS: (resolve) => require(["@/components/formscReening/details/index.vue"], resolve),
        Table: () => import("@/views/Finance/components/Table/index.vue"),
        contractDetailsEdit: () => import("@/components/AddNewContract/contractDetails/index.vue"),
        TableInput: resolve => require(['@/common/TableInput/index.vue'], resolve)
    }
})
export default class VcRoundingRules extends Vue {
    public $refs: refsConfig | any
    private activeIndex: number = 0;
    private selectName: any = '';
    private direction: any = '' // 方向
    private selectkeyArr: any = [];
    private exports: any = '';
    private array: any = [];
    private detailsId: any;
    private selectedRows: any;
    private activeInAdd: number = 0; //add 默认弹框下标
    private activeInEdit: number = 0; //edit 默认弹框下标
    private relatedContract: string = "";
    private priority: any = "";
    private activeSelectAdd: string = "service"; //add 动态组件切换
    private columns: columnsConfig[] = column //表格名称
    private contractDatas: any[] = []
    private TreatMaximumAsACapOptions: any = [{
            name: 'NO',
            value: 0
        },
        {
            name: 'YES',
            value: 1
        },
    ]
    private data: any[] = [];
    private formOptions: formOptionsConfig[] = [{
            Tips: 'Rule name',
            name: 'roundingRuleName',
            required: false,
            showSearch: true,
            type: 'select',
            span: 12,
            colSpan: 6,
            options: null,

        },
        {
            Tips: 'Minimum value',
            name: 'minimumValue',
            required: false,
            showSearch: true,
            type: 'select',
            span: 12,
            colSpan: 7,
            options: null
        },
        {
            Tips: 'Initial rounding',
            name: 'initialRounding',
            required: false,
            showSearch: true,
            type: 'select',
            span: 12,
            colSpan: 6,
            options: null
        },
        {
            Tips: 'Additional rounding',
            name: 'additionalRounding',
            required: false,
            showSearch: true,
            type: 'select',
            span: 12,
            colSpan: 7,
            options: null
        },
        {
            Tips: 'Maximum',
            name: 'maximumValue',
            required: false,
            type: 'select',
            showSearch: true,
            span: 12,
            colSpan: 6,
            options: null
        },
        {
            Tips: 'Measure adjustment ',
            name: 'measureAdjustment',
            required: false,
            type: 'select',
            showSearch: true,
            span: 12,
            colSpan: 7,
            options: null
        },
        {
            Tips: 'Treat maximum as a cap',
            name: 'isMaximumAsCap',
            required: false,
            type: 'select',
            span: 12,
            width: 200,
            colSpan: 6,
            options: this.TreatMaximumAsACapOptions
        }
    ]

    private Formscreening: any[] = [{
            name: "Add",
            icon: "plus-circle",
            index: 1
        },
        {
            name: "Delete",
            icon: "delete",
            disabled: true,
            tips: "Select a record before you delete it",
            index: 3
        },
        {
            name: "Export",
            icon: "export",
            disabled: true,
            tips: "Edit Must be selected, and can only be singleton",
            index: 4
        }
    ];

    private changeDisable(selectedRows: any) {
        this.Formscreening.forEach((item: any, index: number) => {
            // 2 edit   4 export
            if (selectedRows.length === 1) {
                if ((item.name === "Delete") && (selectedRows[0].adjustmentStatus === 2 || selectedRows[0].adjustmentStatus === 4)) {
                    item.disabled = true;
                } else {
                    item.disabled = false;
                }
            } else if (selectedRows.length > 1) {
                this.Formscreening[2].disabled = true
                this.Formscreening[4].disabled = false
            }
        });
    }

    private selectChangebr() {
        const AdvancedSearch = (this.$refs.AdvancedSearch as any)
        const AdvancedSearchs = AdvancedSearch.getFieldsValue()
    }
    // 高级搜索 Search -> 回调
    public SearchOk(values: any): void {
        let data: any = {
            params: Object.assign({}, values, {
                isMaximumAsCap: values.isMaximumAsCap && values.isMaximumAsCap == 'NO' ? 0 : values.isMaximumAsCap,
            })
        }
        VcRudingRules(data).then((res: any) => {
            this.data = res.data

        })
    }
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
        console.log(selectedRows.length >0);
        
         if(this.data.length > 0){
         this.Formscreening[2].disabled = false;
        }
        if(selectedRows.length > 0){
          this.Formscreening[1].disabled = false;
        }else{
           this.Formscreening[1].disabled = true;
        }
        // this.Formscreening.forEach((item: any) => {
        //     if (  item.index !== 1 && item.index !== 4 ) {
        //         item.disabled = selectedRows.length !== 1
        //     } else if (item.index === 4 ) {
        //         item.disabled = this.data.length === 0
        //     } 
        // })
    
    }
    /* 点击切换页 分页(pagination) -> 回调 */
    public onChang(pageSize: number) {
        // console.log(pageSize)
    }
    /* Add 选项卡 */
    public activeAdd(tab: any, item: any) {
        this.activeInAdd = tab;
        this.activeSelectAdd = item;
    }
    //获取搜索栏的下拉框的数据
    public created() {
        getExpData({
            data: this.formOptions,
            fns: [RoundingRuleName, MinmumValues, InitialRoundings, AdditionalRoundings, Maximums, MeasureAdjustments],
        });

    }
    /* 获取新增公参所有数据 */
    public addAllData(values: any): void {
        let that: any = this;
        if (this.activeIndex === 1) {
            const vcrradd = (this.$refs.service as any);
            let obj = JSON.parse(JSON.stringify(vcrradd.$refs.TableInput.getData()));
            let serviceList: any = [];
            for (let i = 0; i < obj.length; i++) {
                let array = new Array(obj[i].minimumValue, obj[i].initialRounding, obj[i].additionalRounding,
                    obj[i].maximumValue == undefined ? 0 : obj[i].maximumValue, obj[i].measureAdjustment == undefined ? 0 : obj[i].measureAdjustment, obj[i].isMaximumAsCap == 'YES' ? '1' : '' || obj[i].isMaximumAsCap == 'NO' ? '0' : '');
                let rulename = array.join(":");
                serviceList.push({
                    roundingRuleName: rulename,
                    minimumValue: obj[i].minimumValue,
                    initialRounding: obj[i].initialRounding,
                    additionalRounding: obj[i].additionalRounding,
                    maximumValue: obj[i].maximumValue == undefined ? 0 : obj[i].maximumValue,
                    measureAdjustment: obj[i].measureAdjustment == undefined ? 0 : obj[i].measureAdjustment,
                    isMaximumAsCap: obj[i].isMaximumAsCap == 'YES' ? '1' : undefined || obj[i].isMaximumAsCap == 'NO' ? '0' : undefined
                });
            }
            //搜索请求
            VcRudingRulesAdd(serviceList).then((res: any) => {
                if (res.code >= 1) {
                    that.visible = !that.visible;
                    that.$message.success("Successful addition");
                    that.SearchOk((that.$refs.AdvancedSearch as any).getFieldsValue())
                    // that.created();
                    // console.log(that.created());
                } else if (res.code = -203) {
                    that.$message.error(res.msg);
                }
            });
        }
    }


    /* 操作栏点击 -> 回调 */
    private visible: any = false
    private addEdit: object = {}
    public async activeClick({
        name,
        index
    }: any, selected: any, selectedData: any, activeObJ: any) {
        // console.log(selected, index, name)
        // console.log(index !== 3 && (this.visible = !this.visible) && (this.activeIndex = index));
        // console.log(selectedData);
        const deleted = selectedData.map((item: any) => item.id).join(",") //多选删除
        // console.log(deleted);
        /*删除按钮*/
        if (index == 3) {
            this.activeIndex = 3;
            let _this = this;
            this.$confirm({
                title: "Confirm!",
                content: `Continue to  deleted the data?`,
                okText: "YES",
                cancelText: "NO",
                onOk() {
                    const that = this;
                    VcRudingRulesDelete(deleted).then((res: any) => {
                        console.log("Confirm", res);
                        if (res.code <= 1) {
                            _this.visible = false;
                            _this.$message.error(res.msg);
                        } else {
                            _this.visible = false;
                            _this.$message.success("Data has been deleted successfully");
                            _this.SearchOk("");
                        }
                    });
                }
            });
        }
        /**export按钮 */
        if (index == 4 ) {
            // this.activeIndex = 4;
            // if (activeObJ === undefined) {
            //     // Export
            //     this.toExport(selectedData, undefined, selected)
            // }
            onSelectClick(this.columns,this.data,"Vc Rounding Rules"," Vc Rounding Rules")
        }
        index !== 3 && (this.visible = !this.visible) && (this.activeIndex = index)
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
