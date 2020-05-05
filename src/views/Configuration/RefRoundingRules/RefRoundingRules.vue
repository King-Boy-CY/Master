<template>
<div>
    <!-- 高级搜索 -->
    <Advanced-search :formoptions="formOptions" :isChildName="true" @selectChange="selectChangebr" allowClear @Submit="SearchOk" :data="contractDatas" ref="AdvancedSearch" childDataKey="contractfoVOList" />
    <!-- 表格 -->
    <Table parentKey="id" :isFinance="true" :isNeedCheck="true" :selectedBtn="Formscreening" @onSelectClick="activeClick" ref="table" @onSelectAll="onSelectAll" @onSelect="onSelect" :columns="columns" :data="data" zebraStripe />
    <!-- 分页 -->
    <!-- <pagination @change="onChang"/> -->
    <!-- Add模态弹出框 -->
    <Model align-title="center" v-model="visible" v-if="activeIndex === 1 && visible" shade title="Add Reference rounding rules" @Screencover="Screencover">
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
    RefRoundingRules,
    RefRoundingRulesAdd,
    RefRoundingRuleName,
    RefMinmumValues,
    RefAdditionalRoundings,
    RefMaximums,
    RefMeasureAdjustments,
    RefInitialRoundings,
    RefRoundingRulesDelete
} from '@/api/index'
import moment from 'moment'
import {
    columnsConfig
} from './RefRoundingRulesConfig'
import xlsx, {
    stream
} from 'xlsx'
import {
    recodeConfig,
    refsConfig
} from '@/assets/ts/config.d'
import {
    downloadExcel
} from "@/assets/ts/xlsx-style/index";

@Component({
    components: {
        AdvancedSearch: resolve => require(["@/common/Advancedsearch/index.vue"], resolve),
        pagination: resolve => require(["@/common/pagination/index.vue"], resolve),
        Model: resolve => require(["@/common/Model/index.vue"], resolve),
        product: resolve => require(["@/components/AddNewContract/product/index.vue"], resolve),
        service: resolve => require(["./RefRoundingRuleservice.vue"], resolve),
        detailS: (resolve) => require(["@/components/formscReening/details/index.vue"], resolve),
        Table: () => import("@/views/Finance/components/Table/index.vue"),
        contractDetailsEdit: () => import("@/components/AddNewContract/contractDetails/index.vue"),
        TableInput: resolve => require(['@/common/TableInput/index.vue'], resolve)
    }
})
export default class RefRoundingRule extends Vue {
    public $refs: refsConfig | any
    private activeIndex: number = 0;
    private selectName: any = '';
    private direction: any = '' // 方向
    private selectkeyArr: any = [];
    private exports: any = '';
    // 导出的数据处理
    private toExport(selectedData: any, name: any = 'RefRoundingRules.xls', selected ? : any): void {
        const filterData = selectedData.map((item: any) => {
            let newItem = JSON.parse(JSON.stringify(item))
            delete newItem.id
            console.log(newItem);

            // for (let key in newItem) {
            //     let find: any
            //     switch (key) {
            //         case 'TreatMaximumAsACap':
            //             find = this.TreatMaximumAsACapOptions.find((inner: any) => inner.value === item[key])
            //             break;
            //     }
            //     if (find) {
            //         newItem[key] = find.name
            //     }
            // }
            return newItem
        })
        const ws: xlsx.WorkSheet = xlsx.utils.json_to_sheet(filterData);
        /* generate workbook and add the worksheet */
        const wb: xlsx.WorkBook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');
        // console.log(wb)
        /*  if(!wb.Props) wb.Props = {};
          wb.Props.Title = "Insert Title Here"+res;*/
        /* save to file */
        xlsx.writeFile(wb, name);
    }

    private array: any = [];
    private detailsId: any;
    private selectedRows: any;
    private activeInAdd: number = 0; //add 默认弹框下标
    private activeInEdit: number = 0; //edit 默认弹框下标
    private relatedContract: string = "";
    private priority: any = "";
    private activeSelectAdd: string = "service"; //add 动态组件切换
    private columns: columnsConfig[] = [{
            title: 'Rule name',
            dataIndex: 'roundingRuleName',
            key: 'roundingRuleName',
            width: 300,
        },
        {
            title: 'Minimum value',
            dataIndex: 'minimumValue',
            key: 'MinimumValue',
            width: 150
        },
        {
            title: 'Initial rounding',
            dataIndex: 'initialRounding',
            key: 'initialRounding',
            width: 150
        },
        {
            title: 'Additional rounding',
            dataIndex: 'additionalRounding',
            key: 'additionalRounding',
            width: 200
        },
        {
            title: 'Maximum',
            dataIndex: 'maximumValue',
            key: 'maximumValue',
            width: 100
        },
        {
            title: 'Measure adjustment',
            dataIndex: 'measureAdjustment',
            key: 'measureAdjustment',
            width: 200
        },
        {
            title: 'Treat maximum as a cap',
            dataIndex: 'isMaximumAsCap',
            key: 'isMaximumAsCap',
            customRender: (value: any, row: any, index: any) => {
                const obj = {
                    children: value,
                };
                const find: any = this.TreatMaximumAsACapOptions.find((item: any) => item.value === value)
                if (find) {
                    obj.children = find.name
                }
                return obj;
            },
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
    private formOptions: any[] = [{
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
        // 2 edit   4 export
        if (selectedRows.length === 1) {
            this.Formscreening[2].disabled = false
            this.Formscreening[4].disabled = false
        } else if (selectedRows.length > 1) {
            this.Formscreening[2].disabled = true
            this.Formscreening[4].disabled = false
        } else {
            this.Formscreening[2].disabled = true
            this.Formscreening[4].disabled = true
        }
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
        RefRoundingRules(data).then((res: any) => {
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
        console.log(record, selected, selectedRows);
        this.prouccDatiletias(selectedRows)
    }
    /**多选禁止操作按钮 */
    public prouccDatiletias(selectedRows: any) {
        if (selectedRows.length) {
            this.detailsId = selectedRows[0].id
        }
        if(this.data.length > 0){
         this.Formscreening[2].disabled = false;
         }
        if(selectedRows.length > 0){
          this.Formscreening[1].disabled = false;
        }else{
           this.Formscreening[1].disabled = true;
        }
    }
    /* 点击切换页 分页(pagination) -> 回调 */
    public onChang(pageSize: number) {
        // console.log(pageSize)
    }
    /* Add 选项卡 */
    public activeAdd(tab: any, item: any) {
        console.log(tab, item);
        this.activeInAdd = tab;
        this.activeSelectAdd = item;
    }
    //获取搜索栏的下拉框的数据
    public created() {
        RefRoundingRuleName("").then((res: recodeConfig) => {
            this.formOptions[0]['options'] = res.data
        })
        RefMinmumValues("").then((res: recodeConfig) => {
            this.formOptions[1]['options'] = res.data
        })
        RefInitialRoundings("").then((res: recodeConfig) => {
            this.formOptions[2]['options'] = res.data
        })
        RefAdditionalRoundings("").then((res: recodeConfig) => {
            this.formOptions[3]['options'] = res.data
        })
        RefMaximums("").then((res: recodeConfig) => {
            this.formOptions[4]['options'] = res.data
        })
        RefMeasureAdjustments("").then((res: recodeConfig) => {
            this.formOptions[5]['options'] = res.data
        })
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
                    isMaximumAsCap: obj[i].isMaximumAsCap == 'YES' ? '1' : '' || obj[i].isMaximumAsCap == 'NO' ? '0' : ''
                });
                console.log(obj[i].minimumValue)
            }
            console.log(serviceList);

            RefRoundingRulesAdd(serviceList).then((res: any) => {
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
            // AxiosPost("/config/ref-rounding-rule", serviceList).then((res: any) => {
            //     if (res.code >= 1) {
            //         that.visible = !that.visible;
            //         that.$message.success("Successful addition");
            //         this.SearchOk((this.$refs.AdvancedSearch as any).getFieldsValue())
            //         this.created();
            //     }
            // });
        }
    }
    /* 操作栏点击 -> 回调 */
    private visible: any = false
    private addEdit: object = {}
    public async activeClick({
        name,
        index
    }: any, selected: any, selectedData: any, activeObJ: any) {
        console.log(selected, index, name)
        console.log(index !== 3 && (this.visible = !this.visible) && (this.activeIndex = index));
        console.log(selectedData);
        const deleted = selectedData.map((item: any) => item.id).join(",") //多选删除
        console.log(deleted);

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
                    RefRoundingRulesDelete(deleted).then((res: any) => {
                        console.log("Confirm", res);
                        if (res.code < 0) {
                            console.log(_this.visible);
                            _this.visible = false;
                        } else {
                            _this.visible = false;
                            _this.$message.success("Data has been deleted successfully");
                            _this.SearchOk("");
                        }
                        // if (res.code = -203) {
                        //     _this.$message.error(res.msg);
                        // }
                    });
                }
            });
        }
        /**export按钮 */
        if (index == 4 ) {
            downloadExcel(this.columns, this.data, `Reference Rounding Rules`, "Reference Rounding Rules"); 
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
