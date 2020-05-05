<template>
<div>
    <!-- 高级搜索 -->
    <Advanced-search :formoptions="formOptions" :isChildName="true" allowClear @Submit="SearchOk" ref="AdvancedSearch" @pickerChange="changes"/>
    <Table parentKey="id" :isFinance="true" :isNeedCheck="true" :selectedBtn="Formscreening" @onSelectClick="onSelectClick" :columns="columns" :data="data" zebraStripe @onSelectAll="onSelectAll" @onSelect="onSelect" />

    <!-- Add模态弹出框 -->
    <Model align-title="center" v-model="visible" v-if="activeIndex === 1 && visible" shade title="Add route product" @Screencover="Screencover">
        <template slot="model-body">
            <keep-alive>
                <form-group :is='RouteProductAdd' ref="RouteProductAdd" />
            </keep-alive>
            <div class="qc" v-show="isRepetition">
                Duplicate name.
            </div>
        </template>
        <template slot="model-footer">
            <a-row>
                <a-col :span="24" :style="{ textAlign: 'center' }">
                    <div style="margin-top:10px;">
                        <a-button type="primary" :style="{ borderRadius: '50px 50px 50px 50px' }" @click="addAllData">Save</a-button>
                        <a-button :style="{ marginLeft: '8px', color: '#1890ff', borderRadius: '50px 50px 50px 50px', border: '1px solid #1890ff', fontWeight: '600' }" @click="handleReruen(1)">Return</a-button>
                    </div>
                </a-col>
            </a-row>
        </template>
    </Model>

    <!-- Edit模态弹出框 -->
    <Model align-title="center" v-model="visible" v-if="activeIndex === 2 && visible" shade title="Edit route product" @Screencover="Screencover">
        <template slot="model-body">
            <keep-alive>
                <form-group :is='RouteProductEdit' ref="RouteProductEdit" :addEdit="addEdit" />
            </keep-alive>
        </template>
        <template slot="model-footer">
            <a-row>
                <a-col :span="24" :style="{ textAlign: 'center' }">
                    <div style="margin-top:10px;">
                        <a-button type="primary" :style="{ borderRadius: '50px 50px 50px 50px' }" @click="editAllData">Save</a-button>
                        <a-button :style="{ marginLeft: '8px', color: '#1890ff', borderRadius: '50px 50px 50px 50px', border: '1px solid #1890ff', fontWeight: '600' }" @click="handleReruen(1)">Return</a-button>
                    </div>
                </a-col>
            </a-row>
        </template>
    </Model>

    <!-- View模态弹出框 -->
    <Model align-title="center" v-model="visible" v-if="activeIndex === 3 && visible" shade title="View time band" @Screencover="Screencover">
        <template slot="model-body">
            <keep-alive>
                <form-group :is='RouteProductView' ref="RouteProductView" :lookTime="lookTime" />
            </keep-alive>
        </template>
        <template slot="model-footer">
            <a-row>
                <a-col :span="24" :style="{ textAlign: 'center' }">
                    <div style="margin-top:10px;">
                        <a-button :style="{ marginLeft: '8px', color: '#1890ff', borderRadius: '50px 50px 50px 50px', border: '1px solid #1890ff', fontWeight: '600' }" @click="handleReruen()">Return</a-button>
                    </div>
                </a-col>
            </a-row>
        </template>
    </Model>
</div>
</template>

<script lang="ts">
/**插件 */
import Vue from "vue";
import {
    Component
} from "vue-property-decorator";
import {
    refsConfig
} from "@/assets/ts/config.d";
import {
    formscreening,
    columns,
    baseInfoFormOptions
} from "./RouteProductList";
import {
    AxiosGet,
    AxiosDelete
} from "@/api/axios";
import moment from "moment";
import {
    RouteProductSearch,
    RouteProductAdd,
    RouteProductEdit,
    RouteProductDestination,
    RouteProductName
} from "@/api/index.ts";
import {
    FormOptions,
    Formscreening,
    BaseInfoFormOptions,
    Columns
} from "./RouteProductVerify";
import {
    onSelectClick
} from "@/views/Configuration/Exports";

/**组件 */
@Component({
    components: {
        AdvancedSearch: resolve => require(["@/common/Advancedsearch/index.vue"], resolve),
        Model: resolve => require(["@/common/Model/index.vue"], resolve),
        Table: () => import("@/views/Finance/components/Table/index.vue"),
        formGroup: () => import("@/views/Finance/components/form-group/index.vue"),
        RouteProductAdd: resolve => require(["./Alladd/RouteProductAdd.vue"], resolve),
        RouteProductEdit: resolve => require(["./Alladd/RouteProductEdit.vue"], resolve),
        RouteProductView: resolve => require(["./Alladd/RouteProductView.vue"], resolve)
    }
})

export default class Routeduct extends Vue {
    /**子表格页面 */
    private RouteProductAdd: string = "RouteProductAdd"; // RouteProductAdd 页
    private RouteProductEdit: string = "RouteProductEdit"; // RouteProductEdit 页
    private RouteProductView: string = "RouteProductView"; // RouteProductView 页

    /**效验Name是否重复 */
    private isRepetition: boolean = false;

    private visible: any = false;
    private activeIndex: number = 0;
    public $refs: refsConfig | any;

    private format: string = 'YYYY-MM-DD';

    /**选项 */
    private StatusOptionstest: any = [{
        name: "Active",
        value: 1
    }, {
        name: "Invalid",
        value: 2
    }]

    private NeedRoutingSuggestion: any = [{
        name: "NO",
        value: 0
    }, {
        name: "YES",
        value: 1
    }]

    /**搜索 */
    public data: any[] = [];
    private formOptions: any['Array'] = [{
        Tips: "Route product",
        required: false,
        name: "routeProductName",
        type: "select",
        showSearch: true,
        filterOption: true,
        span: 10,
        colSpan: 6,
        options: []
    }, {
        Tips: "Destination",
        required: false,
        name: "destinationName",
        type: "select",
        showSearch: true,
        filterOption: true,
        span: 10,
        colSpan: 6,
        options: []
    }, {
        Tips: "Status",
        required: false,
        name: "status",
        type: "select",
        showSearch: true,
        span: 10,
        colSpan: 6,
        options: this.StatusOptionstest
    }, {
        Tips: "Need Routing Suggestion",
        required: false,
        name: "isNeedRoutingSuggestion",
        type: "select",
        showSearch: true,
        span: 10,
        colSpan: 6,
        options: this.NeedRoutingSuggestion
    }, {
        Tips: 'Effective date',
        name: 'effectiveDate',
        required: false,
        type: 'picker',
        span: 10,
        colSpan: 6,
        initialValue: moment()
    }]

    private changes(value: any) {
        // console.log(value)
        // console.log(this)
    }

    /**add 属性 */
    private baseInfoFormOptions: BaseInfoFormOptions['Array'] = baseInfoFormOptions;

    /**编辑栏 */
    private Formscreening: Formscreening['Array'] = formscreening;

    /**表格内容 */
    private columns: Columns['Array'] = columns;

    /**搜索点击 */
    public async SearchOk(values ? : any) {
        let effectiveDate: any
        if (values.effectiveDate) {
            let BeginYear = values.effectiveDate._d.getFullYear()
            let BeginMonth = values.effectiveDate._d.getMonth() + 1
            let BeginDate = values.effectiveDate._d.getDate()
            effectiveDate = `${BeginYear}-${BeginMonth > 9? BeginMonth: "0" + BeginMonth}-${BeginDate >9? BeginDate: "0" + BeginDate}`
        }
        let data: any = {
            params: Object.assign({}, values, {
                routeProductName: values.routeProductName || undefined,
                destinationName: values.destinationName || undefined,
                effectiveDate: effectiveDate,
                isNeedRoutingSuggestion: values.isNeedRoutingSuggestion == "NO"? 0 : "" || values.isNeedRoutingSuggestion == 1? 1 : "" || undefined
            })
        };
        await RouteProductSearch(data).then((res: any) => {
            this.data = res.data
            // console.log(res.data)
        })
        this.data.map((item: any, index: number) => {
            // console.log(item.detailList);
            // console.log(innerItem.type)
            if (item.isNeedRoutingSuggestion === 0) {
                item.isNeedRoutingSuggestion = 'NO'
            } else if (item.isNeedRoutingSuggestion === 1) {
                item.isNeedRoutingSuggestion = 'YES'
            }
            if (item.status === 1) {
                item.status = 'Active'
            } else if (item.status === 2) {
                item.status = 'Invalid'
            }
        });
    };

    /**编辑栏功能 */
    private EditId: any
    private addEdit: object = {}
    private lookTime: object = {}
    public async onSelectClick({
            name,
            index
        }: any,
        selected: any,
        selectedData: any,
        activeObJ: any
    ) {
        let that: any = this
        const deleteId = selectedData.map((item: any) => item.id).join(",")
        if (index == 2) {
            this.activeIndex = 2
            this.addEdit = selectedData[0]
            this.EditId = deleteId
        }
        if (index == 3) {
            this.activeIndex = 3
            // console.log(selectedData)
            // this.lookTime = selectedData[0].refTimeBandName
            // console.log(selectedData[0])
            if(selectedData[0].refTimeBandName != "") {
                let refArr = selectedData[0].refTimeBandName.split(",")
                this.lookTime = refArr
            } else {
                let refArr = []
                this.lookTime = refArr
            }
        }
        if (index == 4) {
            this.activeIndex = 4;
            let url = `/config/routeProducts/${deleteId}`;
            let _this = this;
            this.$confirm({
                title: "Confirm!",
                content: `Continue to  deleted the data?`,
                okText: "YES",
                cancelText: "NO",
                onOk() {
                    AxiosDelete(url).then((res: any) => {
                        if (res.code < 0) {
                            _this.visible = false
                        } else {
                            _this.visible = false;
                            _this.$message.success("Data has been deleted successfully");
                            _this.SearchOk((_this.$refs.AdvancedSearch as any).getFieldsValue());
                        }
                    })
                }
            })
        }
        if (index == 5) {
            this.activeIndex = 5
            this.$message.loading('loading')
            // if (activeObJ === undefined) {
            //     this.toExport(selectedData, undefined, selected)
            // }
            onSelectClick(this.columns,this.data,`RouteProduct`,"RouteProduct")
        }
        this.activeIndex = index
        index !== 5 && (this.visible = !this.visible)
    }

    /**编辑栏状态 */
    private changeDisable(selectedRows: any) {
        let lengths = this.data.length
        if (selectedRows.length === 1) {
            this.Formscreening[1].disabled = false
            this.Formscreening[2].disabled = false
            this.Formscreening[3].disabled = false
        } else if (selectedRows.length > 1) {
            this.Formscreening[1].disabled = true
            this.Formscreening[2].disabled = true
            this.Formscreening[3].disabled = false
        } else {
            this.Formscreening[1].disabled = true
            this.Formscreening[2].disabled = true
            this.Formscreening[3].disabled = true
        }
        if (lengths <= 0) {
            this.Formscreening[4].disabled = true;
        } else {
            this.Formscreening[4].disabled = false;
        }
    }

    /**选择/取消回调 */
    public onSelectAll(selected: any, selectedRows: any, changeRows: any) {
        this.changeDisable(selectedRows);
    }
    public onSelect(record: object, selected: boolean, selectedRows: any) {
        this.changeDisable(selectedRows);
    }

    /**关闭编辑窗口 */
    public Screencover(msg ? : any) {
        this.visible = !this.visible;
        // console.log(this.baseInfoFormOptions)
        this.baseInfoFormOptions[0]["initialValue"] = ""
        this.baseInfoFormOptions[1]["initialValue"] = ""
        this.baseInfoFormOptions[2]["initialValue"] = ""
        this.baseInfoFormOptions[3]["initialValue"] = ""
        this.baseInfoFormOptions[4]["initialValue"] = ""
        this.baseInfoFormOptions[5]["initialValue"] = ""
        this.baseInfoFormOptions[6]["initialValue"] = ""
        this.baseInfoFormOptions[7]["initialValue"] = "2099-12-31"
        this.baseInfoFormOptions[8]["initialValue"] = ""
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
    private async addAllData() {
        let that: any = this;
        const baseInfoFormGroup: any = this.$refs.RouteProductAdd
        let data = baseInfoFormGroup.$refs.baseInfoFormGroup.validateFields()
        if (data) {
            let BeginDays: any
            let EndDays: any
            if (data.beginDate._d || data.endDate._d) {
                // BeginDay
                let BeginYear = data.beginDate._d.getFullYear()
                let BeginMonth = data.beginDate._d.getMonth() + 1
                let BeginDate = data.beginDate._d.getDate()
                BeginDays = `${BeginYear}-${BeginMonth > 9? BeginMonth: "0" + BeginMonth}-${BeginDate >9? BeginDate: "0" + BeginDate}`
                // endDay
                let EndYear = data.endDate._d.getFullYear()
                let EndMonth = data.endDate._d.getMonth() + 1
                let EndDate = data.endDate._d.getDate()
                EndDays = `${EndYear}-${EndMonth >9 ? EndMonth: "0" + EndMonth}-${EndDate >9? EndDate: "0" + EndDate}`
            }
            // console.log(BeginDays,EndDays)

            let datas = {
                "beginDate": BeginDays,
                "destinationName": data.destinationName,
                "endDate": EndDays,
                "isNeedRoutingSuggestion": data.isNeedRoutingSuggestion == "NO" ? 0 : 1 || data.isNeedRoutingSuggestion == "YES" ? 1 : 0,
                "refTimeBandName": data.refTimeBandName,
                "remark": data.remark,
                "routeProductName": data.routeProductName,
                "serviceName": data.serviceName,
                "status": data.status
            }

            /**效验Name是否重复 */
            let length = this.formOptions[0].options.length;
            for (let i = 0; i < length; i++) {
                // console.log(this.formOptions[0].options[i])
                if (this.formOptions[0].options[i] == datas.routeProductName) {
                    return this.isRepetition = true
                } else {
                    this.isRepetition = false
                }
            }

            if (!this.isRepetition) {
                RouteProductAdd(datas).then((res: any) => {
                    // console.log(res)
                    if (res.code >= 1) {
                        // console.log(datas)
                        this.Screencover()
                        that.$message.success("Successful addition");
                        this.SearchOk((this.$refs.AdvancedSearch as any).getFieldsValue());
                        this.baseInfoFormOptions[2]["initialValue"] = ""
                        this.baseInfoFormOptions[3]["initialValue"] = ""
                        this.baseInfoFormOptions[4]["initialValue"] = ""
                        RouteProductName('').then((res: any) => {
                            this.formOptions[0]['options'] = res.data
                        })
                    }
                    if (res.code != 1) {
                        return this.$message.warning(res.msg);
                    }
                })
            }
            // console.log(BeginDays,EndDays)
        }
    }

    /**editAllData */
    private async editAllData() {
        let that: any = this;
        const editBaseInfoFormGroup: any = this.$refs.RouteProductEdit
        let data = editBaseInfoFormGroup.$refs.baseInfoFormGroup.getFieldsValue()
        let BeginDays: any
        let EndDays: any
        if (data.beginDate._d || data.endDate._d) {
            // BeginDay
            let BeginYear = data.beginDate._d.getFullYear()
            let BeginMonth = data.beginDate._d.getMonth() + 1
            let BeginDate = data.beginDate._d.getDate()
            BeginDays = `${BeginYear}-${BeginMonth > 9? BeginMonth: "0" + BeginMonth}-${BeginDate >9? BeginDate: "0" + BeginDate}`
            // endDay
            let EndYear = data.endDate._d.getFullYear()
            let EndMonth = data.endDate._d.getMonth() + 1
            let EndDate = data.endDate._d.getDate()
            EndDays = `${EndYear}-${EndMonth >9 ? EndMonth: "0" + EndMonth}-${EndDate >9? EndDate: "0" + EndDate}`
        }
        let editData = {
            "id": this.EditId,
            "beginDate": BeginDays,
            "destinationName": data.destinationName,
            "endDate": EndDays,
            "isNeedRoutingSuggestion": data.isNeedRoutingSuggestion == "NO" ? 0 : 1 || data.isNeedRoutingSuggestion == "YES" ? 1 : 0,
            "refTimeBandName": data.refTimeBandName,
            "remark": data.remark,
            "routeProductName": data.routeProductName + "",
            "serviceName": data.serviceName,
            "status": data.status
        }
        // console.log(editData)
        RouteProductEdit(editData).then((res: any) => {
            if (res.code >= 1) {
                this.Screencover()
                that.$message.success("Successful addition");
                this.SearchOk((this.$refs.AdvancedSearch as any).getFieldsValue());
                this.baseInfoFormOptions[2]["initialValue"] = ""
                this.baseInfoFormOptions[3]["initialValue"] = ""
                this.baseInfoFormOptions[4]["initialValue"] = ""
            }
            if (res.code != 1) {
                return this.$message.warning(res.msg);
            }
        })
    }

    public created() {
        console.log(this.formOptions)
        RouteProductDestination('').then((res: any) => {
            // console.log(res.data)
            this.formOptions[1]['options'] = res.data
        })
        RouteProductName('').then((res: any) => {
            // console.log(res.data)
            this.formOptions[0]['options'] = res.data
        })
    }
}
</script>

<style lang="scss">
.qc {
    width: 100%;
    text-align: center;
    color: rgb(192, 0, 0);
    font-size: 16px;
}
</style>
