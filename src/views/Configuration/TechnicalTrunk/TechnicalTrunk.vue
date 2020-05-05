<template>
<div>
    <Advanced-search :formoptions="formOptions" :isChildName="true" allowClear @Submit="SearchOk" ref="AdvancedSearch" />
    <Table parentKey="id" :isFinance="true" :isNeedCheck="true" :selectedBtn="Formscreening" @onSelectClick="onSelectClick" :columns="columns" :data="data" zebraStripe @onSelectAll="onSelectAll" @onSelect="onSelect" />

    <!-- Add模态弹出框 -->
    <Model align-title="center" v-model="visible" v-if="activeIndex === 1 && visible" shade title="Add Technical Trunk" @Screencover="Screencover">
        <template slot="model-body">
            <keep-alive>
                <form-group :is='TechnicalTrunkAdd' ref="TechnicalTrunkAdd" />
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
    <Model align-title="center" v-model="visible" v-if="activeIndex === 2 && visible" shade title="Edit Technical Trunk" @Screencover="Screencover">
        <template slot="model-body">
            <keep-alive>
                <form-group :is='TechnicalTrunkEdit' ref="TechnicalTrunkEdit" :addEdit="addEdit" />
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
</div>
</template>

<script lang="ts">
// 插件
import Vue from "vue";
import {
    Component
} from "vue-property-decorator";
import {
    refsConfig
} from "@/assets/ts/config.d";
import {
    AxiosDelete
} from "@/api/axios";
import {
    TechnicalTrunkSearch,
    TechnicalTrunkAdd,
    TechnicalTrunkEdit,
    TechnicalTrunkList,
    getDetailAccounts,
    CommercialTrunkList
} from "@/api/index.ts";
import {
    FormOptions,
    Columns
} from "./TechnicalTrunkVerify"
import {
    onSelectClick
} from "@/views/Configuration/Exports"

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
        TechnicalTrunkAdd: resolve => require(["./TechnicalTrunkAdd.vue"], resolve),
        TechnicalTrunkEdit: resolve => require(["./TechnicalTrunkEdit.vue"], resolve)
    }
})

export default class TechnicalTrunk extends Vue {
    private TechnicalTrunkAdd: string = "TechnicalTrunkAdd";
    private TechnicalTrunkEdit: string = "TechnicalTrunkEdit";
    private addEdit: object = {};
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
        name: "switchName",
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
        initialValue: 1,
        span: 10
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
    private columns: Columns['Array'] = [{
        title: "Technical trunk",
        dataIndex: "technicalTrunkName",
        key: "technicalTrunkName"
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
        title: "Account",
        dataIndex: "accountName",
        key: "accountName"
    }, {
        title: "Status",
        dataIndex: "status",
        key: "status",
        sorter: (a, b) => a.status.length - b.status.length,
        customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'status', this.StatusOptions)
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
    public async SearchOk(values ? : any) {
        let data: any = {
            params: Object.assign({}, values, {
                commercialTrunkName: values.commercialTrunkName || undefined,
                technicalTrunkName: values.technicalTrunkName || undefined,
                accountName: values.accountName || undefined,
                switchName: values.switchName || undefined
            })
        }
        await TechnicalTrunkSearch(data).then((res: any) => {
            // console.log(res.data)
            this.data = res.data
        })
        this.data.map((item: any, index: number) => {
            if (item.status === 1) {
                item.status = 'Active'
            } else if (item.status === 2) {
                item.status = 'Invalid'
            }
            if (item.direction === 1) {
                item.direction = 'Inbound'
            } else if (item.direction === 2) {
                item.direction = 'Outbound'
            } else if (item.direction === 3) {
                item.direction = 'Bilateral'
            }

            if(!item.activatedPorts) {
                item.activatedPorts = ""
            }
            if(!item.remark) {
                item.remark = ""
            }
            if(!item.accountName) {
                item.accountName = ""
            }
            if(!item.commercialTrunkName) {
                item.commercialTrunkName = ""
            }
        })
    }

    /**编辑栏操作 */
    private TechnicalId: any;
    public async onSelectClick({
            name,
            index
        }: any,
        selected: any,
        selectedData: any,
        activeObJ: any
    ) {
        let that: any = this;
        const deleteId = selectedData.map((item: any) => item.id).join(",")
        if (index == 2) {
            this.activeIndex = 2;
            this.addEdit = selectedData[0];
            this.TechnicalId = deleteId;
        }
        if (index == 3) {
            this.activeIndex = 3;
            let url = `/config/technicalTrunks/${deleteId}`;
            let _this = this;
            this.$confirm({
                title: "Confirm!",
                content: `Continue to  deleted the data?`,
                okText: "YES",
                cancelText: "NO",
                onOk() {
                    AxiosDelete(url).then((res: any) => {
                        if (selectedData[0].status == "Active") {
                            _this.visible = false;
                            _this.$message.error("Only invalid records could be deleted");
                        } else if (res.code < 0) {
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
        if (index == 4) {
            this.activeIndex = 4;
            this.$message.loading('loading')
            // if (activeObJ === undefined) {
            //     this.toExport(selectedData, undefined, selected)
            // }
            onSelectClick(this.columns,this.data,"TechnicalTrunk.xls")
        }
        this.activeIndex = index;
        index !== 4 && (this.visible = !this.visible)
    }

    /**选择/取消回调 */
    public onSelectAll(selected: any, selectedRows: any, changeRows: any) {
        this.changeDisable(selectedRows);
    }
    public onSelect(record: object, selected: boolean, selectedRows: any) {
        this.changeDisable(selectedRows);
    }

    /**编辑栏状态 */
    private changeDisable(selectedRows: any) {
        let lengths = this.data.length
        if (selectedRows.length === 1) {
            this.Formscreening[1].disabled = false;
            this.Formscreening[2].disabled = false;
        } else if (selectedRows.length > 1) {
            this.Formscreening[1].disabled = true;
            this.Formscreening[2].disabled = false;
        } else {
            this.Formscreening[1].disabled = true;
            this.Formscreening[2].disabled = true;
        }
        if (lengths <= 0) {
            this.Formscreening[3].disabled = true;
        } else {
            this.Formscreening[3].disabled = false;
        }
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
    private async addAllData() {
        let that: any = this;
        const baseInfoFormGroup: any = this.$refs.TechnicalTrunkAdd;
        let data = baseInfoFormGroup.$refs.baseInfoFormGroup.validateFields()
        if (baseInfoFormGroup.$refs.baseInfoFormGroup.validateFields()) {
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
            let sendSaveData = {
                // "accountName": data.accountName,
                "activatedPorts": data.activatedPorts,
                "beginDate": BeginDays,
                "cdrmatch": data.cdrmatch,
                // "commercialTrunkName": data.commercialTrunkName,
                "destinationPoint": data.destinationPoint,
                "direction": data.direction,
                "endDate": EndDays,
                "originationPoint": data.originationPoint,
                "remark": data.remark,
                "status": data.status,
                "switchName": data.switchName,
                "technicalTrunkName": data.technicalTrunkName,
                "terinationSwitch": data.terinationSwitch,
                "trunkIp": data.trunkIp,
                "trunkType": data.trunkType
            }
            let length = this.formOptions[0].options.length;
            for (let i = 0; i < length; i++) {
                if (this.formOptions[1].options[i] == sendSaveData.technicalTrunkName) {
                    return this.isRepetition = true
                } else {
                    this.isRepetition = false
                }
            }
            // console.log(data)
            if (!this.isRepetition) {
                TechnicalTrunkAdd(sendSaveData).then((res: any) => {
                    // console.log(res)
                    if (res.code >= 1) {
                        this.visible = !this.visible;
                        that.$message.success("Successful addition");
                        that.SearchOk((that.$refs.AdvancedSearch as any).getFieldsValue());
                    }
                    if (res.code != 1) {
                        return this.$message.warning(res.msg);
                    }
                })
            }
        }
    }

    /**editAllData */
    private async editAllData() {
        let that: any = this;
        const editbaseInfoFormGroup: any = this.$refs.TechnicalTrunkEdit;
        let data = editbaseInfoFormGroup.$refs.baseInfoFormGroup.validateFields();
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
            let sendEditData = {
                "id": this.TechnicalId,
                // "accountName": data.accountName,
                "activatedPorts": data.activatedPorts,
                "beginDate": BeginDays,
                "cdrmatch": data.cdrmatch,
                // "commercialTrunkName": data.commercialTrunkName,
                "destinationPoint": data.destinationPoint,
                "direction": data.direction,
                "endDate": EndDays,
                "originationPoint": data.originationPoint,
                "remark": data.remark,
                "status": data.status,
                "switchName": data.switchName,
                "technicalTrunkName": data.technicalTrunkName,
                "terinationSwitch": data.terinationSwitch,
                "trunkIp": data.trunkIp,
                "trunkType": data.trunkType
            }
            TechnicalTrunkEdit(sendEditData).then((res: any) => {
                if (res.code >= 1) {
                    this.visible = !this.visible;
                    that.$message.success("Successful addition");
                    that.SearchOk((that.$refs.AdvancedSearch as any).getFieldsValue());
                }
                if (res.code != 1) {
                    return this.$message.warning(res.msg);
                }
            })
        }
    }

    public created() {
        let switchName: any[] = ["IDD_West_1","IDD_West_2","IDD_East_3","IDD_North_2","IDD_East_4","IDD_East_5","IDD_Premium","IDD_West_Backup","IDD_East_Backup"]
        this.formOptions[2]["options"] = switchName
        CommercialTrunkList('').then((res: any) => {
            this.formOptions[0]['options'] = res.data
        })
        TechnicalTrunkList('').then((res: any) => {
            this.formOptions[1]['options'] = res.data
        })
        getDetailAccounts('').then((res: any) => {
            this.formOptions[3]['options'] = res.data
        })
    }
}
</script>

<style lang="scss">

</style>
