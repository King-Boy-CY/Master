<template>
<div>
    <!-- 搜索 || 表格 -->
    <Advanced-search :formoptions="formOptions" :isChildName="true" allowClear @Submit="SearchOk" ref="AdvancedSearch" />
    <Table parentKey="id" :isFinance="true" :isNeedCheck="true" :selectedBtn="Formscreening" @onSelectClick="activeClick" :columns="columns" :data="data" zebraStripe @onSelectAll="onSelectAll" @onSelect="onSelect" />

    <!-- Add模态弹出框 -->
    <Model align-title="center" v-model="visible" v-if="activeIndex === 1 && visible" shade title="Add Commercial Trunk" @Screencover="Screencover">
        <template slot="model-body">
            <keep-alive>
                <form-group :is='CommercialTrunkAdd' ref="CommercialTrunkAdd" />
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
    <Model align-title="center" v-model="visible" v-if="activeIndex === 2 && visible" shade title="Edit Commercial Trunk" @Screencover="Screencover">
        <template slot="model-body">
            <keep-alive>
                <form-group :is='CommercialTrunkEdit' ref="CommercialTrunkEdit" :addEdit="addEdit" />
            </keep-alive>
            <div class="qc" v-show="isRepetition">
                Duplicate name.
            </div>
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
    <Model align-title="center" v-model="visible" v-if="activeIndex === 3 && visible" shade title="View Technical Trunk" @Screencover="Screencover">
        <template slot="model-body">
            <keep-alive>
                <form-group :is='CommercialTrunkView' ref="CommercialTrunkView" :addEdit="addEdit" />
            </keep-alive>

        </template>
        <template slot="model-footer">
            <a-row>
                <a-col :span="24" :style="{ textAlign: 'center' }">
                    <div style="margin-top:10px;">
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
    CommercialTrunkSearch,
    CommercialTrunkAdd,
    CommercialTrunkEdit,
    CommercialTrunkList,
    TechnicalTrunkList,
    TechnicalTrunkAccList,
    VendorSourceList
} from "@/api/index.ts";
import xlsx from 'xlsx';
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
        CommercialTrunkAdd: resolve => require(["./CommercialTrunkAdd.vue"], resolve),
        CommercialTrunkEdit: resolve => require(["./CommercialTrunkEdit.vue"], resolve),
        CommercialTrunkView: resolve => require(["./CommercialTrunkView.vue"], resolve)
    }
})

export default class CommercialTrunk extends Vue {
    /**弹框页面 */
    private CommercialTrunkAdd: string = "CommercialTrunkAdd";
    private CommercialTrunkEdit: string = "CommercialTrunkEdit";
    private CommercialTrunkView: string = "CommercialTrunkView";
    private addEdit: object = {};
    private visible: any = false;
    private activeIndex: number = 0;
    public $refs: refsConfig | any;
    /**效验Name是否重复 */
    private isRepetition: boolean = false;

    /**选项 */
    private statusOptions = [{
        name: "Active",
        value: 1
    }, {
        name: "Invalid",
        value: 2
    }]
    private isCliOptions = [{
        name: "NO",
        value: 0
    }, {
        name: "YES",
        value: 1
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
        Tips: "Vendor",
        require: false,
        name: "vendorName",
        type: "select",
        showSearch: true,
        options: null,
        span: 10
    }, {
        Tips: "Account",
        require: false,
        name: "accountName",
        type: "select",
        showSearch: true,
        options: null,
        span: 10
    }, {
        Tips: "CLI",
        require: false,
        name: "isCli",
        type: "select",
        showSearch: true,
        options: this.isCliOptions,
        span: 10
    }, {
        Tips: "Status",
        require: false,
        name: "status",
        type: "select",
        showSearch: true,
        options: this.statusOptions,
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
        name: "View technical trunks",
        icon: "eye",
        index: 3,
        disabled: true
    }, {
        name: "Delete",
        icon: "delete",
        index: 4,
        disabled: true
    }, {
        name: "Export",
        icon: "export",
        index: 5,
        disabled: true
    }]

    /**表头 */
    private columns: any[] = [{
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
        title: "Vendor",
        dataIndex: "vendorName",
        key: "vendorName"
    }, {
        title: "Account",
        dataIndex: "accountName",
        key: "accountName"
    }, {
        title: "Status",
        dataIndex: "status",
        key: "status",
        sorter: (a, b) => a.status.length - b.status.length,
        customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'status', this.statusOptions)
    }, {
        title: "CLI",
        dataIndex: "isCli",
        key: "isCli",
        customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'isCli', this.isCliOptions)
    }, {
        title: "Direction",
        dataIndex: "direction",
        key: "direction",
        customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'direction', this.directionOptions)
    }, {
        title: "Technical trunk",
        dataIndex: "technicalTrunkName",
        key: "technicalTrunkName"
    }, {
        title: "Begin date",
        dataIndex: "beginDate",
        key: "beginDate"
    }, {
        title: "End date",
        dataIndex: "endDate",
        key: "endDate"
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

    /**编辑栏操作 */
    private CommercialId: any;
    public async activeClick({
            name,
            index
        }: any,
        selected: any,
        selectedData: any,
        activeObJ: any
    ) {
        let that: any = this;
        const deleteId = selectedData.map((item: any) => item.id).join(",")
        const statusList = selectedData.map((item: any) => item.status)
        if (index == 2) {
            this.activeIndex = 2;
            this.CommercialId = deleteId
            this.addEdit = selectedData[0]
        }
        if (index == 3) {
            this.activeIndex = 3;
            this.addEdit = selectedData[0]
        }
        if (index == 4) {
            this.activeIndex = 4;
            let url = `/config/commercialTrunks/${deleteId}`;
            let _this = this;
            this.$confirm({
                title: "Confirm!",
                content: `Continue to  deleted the data?`,
                okText: "YES",
                cancelText: "NO",
                onOk() {
                    AxiosDelete(url).then((res: any) => {
                        // console.log(statusList)
                        for (let i = 0; i < statusList.length; i++) {
                            if (statusList[i] == "Active") {
                                _this.visible = false;
                                _this.$message.error("Only invalid records could be deleted");
                            } else if (res.code < 0) {
                                _this.visible = false
                            } else {
                                _this.visible = false;
                                _this.$message.success("Data has been deleted successfully");
                                _this.SearchOk((_this.$refs.AdvancedSearch as any).getFieldsValue());
                            }
                        }
                    })
                }
            })
        }
        if (index == 5) {
            this.activeIndex = 5;
            this.$message.loading('loading')
            // if (activeObJ === undefined) {
            //     this.toExport(selectedData, undefined, selected)
            // }
            onSelectClick(this.columns, this.data, `CommercialTrunk`, "CommercialTrunk")
        }
        this.activeIndex = index;
        index !== 5 && (this.visible = !this.visible)
    }

    /**SearchOk */
    public async SearchOk(values ? : any) {
        let data: any = {
            params: Object.assign({}, values, {
                commercialTrunkName: values.commercialTrunkName || undefined,
                technicalTrunkName: values.technicalTrunkName || undefined,
                accountName: values.accountName || undefined,
                isCli: values.isCli == "NO" ? 0 : undefined || values.isCli == 1 ? 1 : undefined || undefined,
                vendorName: values.vendorName || undefined
            })
        }
        // console.log(values)
        await CommercialTrunkSearch(data).then((res: any) => {
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

            if (item.isCli === 0) {
                item.isCli = "NO"
            } else if (item.isCli === 1) {
                item.isCli = "YES"
            } else {
                item.isCli = ""
            }

            if (!item.remark) {
                item.remark = ""
            }
        })
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
        const baseInfoFormGroup: any = this.$refs.CommercialTrunkAdd
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

                let datas = {
                    "beginDate": BeginDays,
                    "endDate": EndDays,
                    "status": data.status,
                    "remark": data.remark,
                    "accountName": data.accountName,
                    "commercialTrunkName": data.commercialTrunkName,
                    "direction": data.direction,
                    "technicalTrunkName": data.technicalTrunkName,
                    "vendorName": data.vendorName
                }

                let length = this.formOptions[0].options.length;
                for (let i = 0; i < length; i++) {
                    // console.log(this.formOptions[0].options[i])
                    if (this.formOptions[0].options[i] == datas.commercialTrunkName) {
                        return this.isRepetition = true
                    } else {
                        this.isRepetition = false
                    }
                }

                if (!this.isRepetition) {
                    CommercialTrunkAdd(datas).then((res: any) => {
                        // console.log(res)
                        if (res.code >= 1) {
                            // console.log(datas)
                            this.Screencover()
                            that.$message.success("Successful addition");
                            that.SearchOk((that.$refs.AdvancedSearch as any).getFieldsValue())
                            CommercialTrunkList('').then((res: any) => {
                                this.formOptions[0]['options'] = res.data
                            })
                        }
                        if (res.code != 1) {
                            return this.$message.warning(res.msg);
                        }
                    })
                }
            }
        }
    }

    /**editAllData */
    private async editAllData() {
        let that: any = this;
        const editbaseInfoFormGroup: any = this.$refs.CommercialTrunkEdit;
        let data = editbaseInfoFormGroup.$refs.baseInfoFormGroup.validateFields();
        // console.log(data)
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

                let sendEditData = {
                    "id": this.CommercialId,
                    "beginDate": BeginDays,
                    "endDate": EndDays,
                    "status": data.status,
                    "remark": data.remark,
                    "accountName": data.accountName,
                    "commercialTrunkName": data.commercialTrunkName + "",
                    "direction": data.direction,
                    "technicalTrunkName": data.technicalTrunkName,
                    "vendorName": data.vendorName
                }
                CommercialTrunkEdit(sendEditData).then((res: any) => {
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

    /**created */
    public created() {
        TechnicalTrunkAccList('').then((res: any) => {
            this.formOptions[3]['options'] = res.data
        })
        VendorSourceList('').then((res: any) => {
            this.formOptions[2]['options'] = res.data
        })
        CommercialTrunkList('').then((res: any) => {
            this.formOptions[0]['options'] = res.data
        })
        TechnicalTrunkList('').then((res: any) => {
            this.formOptions[1]['options'] = res.data
        })
    }
}
</script>

<style lang="scss">

</style>
