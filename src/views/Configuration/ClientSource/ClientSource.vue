<template>
<div>
    <!-- 高级搜索 -->
    <Advanced-search :formoptions="formOptions" :isChildName="true" allowClear @Submit="SearchOk" ref="AdvancedSearch" />
    <Table parentKey="id" :isFinance="true" :isNeedCheck="true" :selectedBtn="Formscreening" :columns="columns" :data="data" @onSelectClick="onSelectClick" @onSelectAll="onSelectAll" @onSelect="onSelect" />

    <!-- Add模态弹出框 -->
    <Model align-title="center" v-model="visible" v-if="activeIndex === 1 && visible" shade title="Add client source" @Screencover="Screencover">
        <template slot="model-body">
            <keep-alive>
                <form-group :is='ClientSourceAdd' ref="ClientSourceAdd" @confirmData="confirmData" />
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
    <Model align-title="center" v-model="visible" v-if="activeIndex === 2 && visible" shade title="Edit client source" @Screencover="Screencover">
        <template slot="model-body">
            <keep-alive>
                <form-group :is='ClientSourceEdit' ref="ClientSourceEdit" :addEdit="addEdit" />
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
/**插件 */
import Vue from 'vue';
import {
    Component
} from "vue-property-decorator";
import {
    refsConfig
} from "@/assets/ts/config.d";
import {
    formOptions,
    formscreening,
    columns
} from "./ClientSourceList";
import {
    AxiosGet,
    AxiosDelete,
    AxiosPost,
    AxiosPut
} from "@/api/axios";
import {
    ClientSourceSearch,
    ClientSourceAdd,
    ClientSourceEdit,
    ClientSourceList,
    getDetailAccounts,
} from "@/api/index.ts"
import {
    FormOptions,
    Formscreening,
    Columns,
    BaseInfoFormOptions
} from "./ClientSourceVerify"
import xlsx from 'xlsx';
import {
    onSelectClick
} from "@/views/Configuration/Exports"

/**组件 */
@Component({
    components: {
        AdvancedSearch: resolve => require(["@/common/Advancedsearch/index.vue"], resolve),
        Model: resolve => require(["@/common/Model/index.vue"], resolve),
        Table: () => import("@/views/Finance/components/Table/index.vue"),
        formGroup: () => import("@/views/Finance/components/form-group/index.vue"),
        ClientSourceAdd: resolve => require(["./AllAddEdit/ClientSourceAdd.vue"], resolve),
        ClientSourceEdit: resolve => require(["./AllAddEdit/ClientSourceEdit.vue"], resolve)
    }
})

/**属性 */
export default class ClientSource extends Vue {
    /**子表格页面 */
    private ClientSourceAdd: string = "ClientSourceAdd";
    private ClientSourceEdit: string = "ClientSourceEdit";

    /**效验Name是否重复 */
    private isRepetition: boolean = false;
    private inRouteClass: any;

    private visible: any = false;
    private activeIndex: number = 0;
    public $refs: refsConfig | any;

    /**搜索 */
    private formOptions: any['Array'] = formOptions;

    /**编辑栏 */
    private Formscreening: Formscreening['Array'] = formscreening;

    /**表头 */
    private columns: Columns['Array'] = columns;

    /**表格内容 */
    private data: any = [];

    /**SearchOk --- 回调 */
    public async SearchOk(values ? : any) {
        let data: any = {
            params: Object.assign({}, values, {
                clientName: values.clientName || undefined
            })
        };
        await ClientSourceSearch(data).then((res: any) => {
            // console.log(res.data)
            this.data = res.data
        })
        this.data.map((item: any, index: number) => {
            if (item.status === 1) {
                item.status = 'Active'
            } else if (item.status === 2) {
                item.status = 'Invalid'
            }

            if (!item.referencePriceList) {
                item.referencePriceList = ""
            }
            if (!item.routeClass) {
                item.routeClass = ""
            }
            if (!item.currencyType) {
                item.currencyType = ""
            }
            if (!item.sales) {
                item.sales = ""
            }
            if (!item.qualityCommitment) {
                item.qualityCommitment = ""
            }
            if (!item.remark) {
                item.remark = ""
            }
            // if (item.timeZone) {
            //     item.timeZone = "ㅤ" + item.timeZone + "ㅤ"
            // }
        })
    }

    public confirmData(msg) {
        this.inRouteClass = msg
    }

    /**编辑栏功能 */
    private clientSourceId: any;
    private relatedContract: any = undefined;
    private addEdit: object = {}
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
            this.clientSourceId = selectedData[0].id
            this.activeIndex = 2
            this.addEdit = selectedData[0]
        }
        if (index == 3) {
            this.activeIndex = 3;
            let code = undefined;
            if (this.relatedContract == undefined || "") {
                let url = `/config/clientSources/${deleteId}`;
                let _this = this;
                this.$confirm({
                    title: "Confirm!",
                    content: `Continue to  deleted the data?`,
                    okText: "YES",
                    cancelText: "NO",
                    onOk() {
                        AxiosDelete(url).then((res: any) => {
                            // console.log(selectedData)
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
        }
        if (index == 4) {
            this.activeIndex = 4
            this.$message.loading('loading')
            // if (activeObJ === undefined) {
            //     this.toExport(selectedData, undefined, selected)
            // }
            let dataExpot = JSON.parse(JSON.stringify(this.data))
            dataExpot.map((item: any, index: number) => {
                if (item.timeZone) {
                    item.timeZone = "ㅤ" + item.timeZone + "ㅤ"
                }
            })
            onSelectClick(this.columns, dataExpot, `ClientSource`, "ClientSource")
        }
        this.activeIndex = index
        index !== 4 && (this.visible = !this.visible)
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

    /**选择/取消回调 */
    public onSelectAll(selected: any, selectedRows: any, changeRows: any) {
        this.changeDisable(selectedRows);
    }
    public onSelect(record: object, selected: boolean, selectedRows: any) {
        this.changeDisable(selectedRows);
    }

    /**addAllData */
    private async addAllData() {
        let that: any = this;
        const baseInfoFormGroup: any = this.$refs.ClientSourceAdd;
        let data = baseInfoFormGroup.$refs.baseInfoFormGroup.getFieldsValue()
        if (!data.accountName || !data.clientName || !data.rateDecreaseNoticePeriond || !data.rateIncreaseNoticePeriond || !data.referencePriceList || !data.sales || !data.serviceList || !data.status) {
            return baseInfoFormGroup.$refs.baseInfoFormGroup.validateFields()
        } else {
            let numberPlanTypes: any;
            if (data.numberPlanList) {
                numberPlanTypes = data.numberPlanList.split(" ")[0] == "Reference" ? 1 : 2
            }
            let sendSaveData = {
                "accountList": encodeURIComponent(data.accountName),
                "clientName": encodeURIComponent(data.clientName),
                "email": data.email,
                "excludeDestinationList": data.excludeDestinationList,
                "numberPlanList": data.numberPlanList,
                "qualityCommitment": data.qualityCommitment,
                "rateDecreaseNoticePeriond": parseInt(data.rateDecreaseNoticePeriond),
                "rateIncreaseNoticePeriond": parseInt(data.rateIncreaseNoticePeriond),
                "referencePriceList": data.referencePriceList,
                "numberPlanType": numberPlanTypes,
                "remark": data.remark,
                "routeClass": this.inRouteClass,
                "sales": data.sales,
                "serviceList": data.serviceList.length > 1 ? data.serviceList.join(",") : data.serviceList[0],
                "status": data.status,
                "timeZone": data.timeZone,
                "currencyType": data.referencePriceList.split("-")[2]
            }

            // console.log(sendSaveData)
            for (let i = 0; i < this.formOptions[0].options.length; i++) {
                if (this.formOptions[0].options[i].name == sendSaveData.clientName && sendSaveData.status == 1) {
                    return this.isRepetition = true
                } else {
                    this.isRepetition = false
                }
            }
            if (!this.isRepetition) {
                let url: any;
                let excludeDestinationC = `&excludeDestinationList=${sendSaveData.excludeDestinationList}`
                if (!sendSaveData.numberPlanList) {
                    url = `/config/clientSources?clientName=${sendSaveData.clientName}&status=${sendSaveData.status}&accountList=${sendSaveData.accountList}&serviceList=${sendSaveData.serviceList}&currencyType=${sendSaveData.currencyType}&referencePriceList=${sendSaveData.referencePriceList}&routeClass=${sendSaveData.routeClass}&email=${sendSaveData.email}&timeZone=${sendSaveData.timeZone}&rateIncreaseNoticePeriond=${sendSaveData.rateIncreaseNoticePeriond}&rateDecreaseNoticePeriond=${sendSaveData.rateDecreaseNoticePeriond}&sales=${sendSaveData.sales}&remark=${sendSaveData.remark}`
                } else if (sendSaveData.numberPlanList) {
                    url = `/config/clientSources?clientName=${sendSaveData.clientName}&status=${sendSaveData.status}&accountList=${sendSaveData.accountList}&serviceList=${sendSaveData.serviceList}&referencePriceList=${sendSaveData.referencePriceList}&routeClass=${sendSaveData.routeClass}&email=${sendSaveData.email}&timeZone=${sendSaveData.timeZone}&rateIncreaseNoticePeriond=${sendSaveData.rateIncreaseNoticePeriond}&rateDecreaseNoticePeriond=${sendSaveData.rateDecreaseNoticePeriond}&sales=${sendSaveData.sales}&remark=${sendSaveData.remark}&currencyType=${sendSaveData.currencyType}${sendSaveData.excludeDestinationList? excludeDestinationC : "" }&numberPlanList=${sendSaveData.numberPlanList}&qualityCommitment=${sendSaveData.qualityCommitment}&numberPlanType=${sendSaveData.numberPlanType}`
                }
                AxiosPost(url).then((res: any) => {
                    // console.log(res)
                    if (res.code >= 1) {
                        this.visible = !this.visible;
                        that.$message.success("Successful addition");
                        that.SearchOk((that.$refs.AdvancedSearch as any).getFieldsValue());
                        ClientSourceList('').then((res: any) => {
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

    /**editAllData */
    private async editAllData() {
        let that: any = this;
        const editbaseInfoFormGroup: any = this.$refs.ClientSourceEdit;
        let data = editbaseInfoFormGroup.$refs.baseInfoFormGroup.getFieldsValue();
        if (!data.accountName || !data.clientName || !data.rateDecreaseNoticePeriond || !data.rateIncreaseNoticePeriond || !data.referencePriceList || !data.sales || !data.serviceList || !data.status) {
            return editbaseInfoFormGroup.$refs.baseInfoFormGroup.validateFields()
        } else {
            let numberPlanTypes: any;
            if (data.numberPlanList) {
                numberPlanTypes = data.numberPlanList.split(" ")[0] == "Reference" ? 1 : 2
            }
            // console.log(numberPlanTypes)
            // let sendEditData = {
            //     "clientName": data.clientName,
            //     "status": data.status,
            //     "accountList": data.accountName,
            //     "serviceList": data.serviceList,
            //     "numberPlanList": data.numberPlanList,
            //     "qualityCommitment": data.qualityCommitment,
            //     "referencePriceList": data.referencePriceList,
            //     "routeClass": data.routeClassName,
            //     "excludeDestinationList": data.excludeDestinationList,
            //     "email": data.email,
            //     "timeZone": data.timeZone,
            //     "rateIncreaseNoticePeriond": data.rateIncreaseNoticePeriond,
            //     "rateDecreaseNoticePeriond": data.rateDecreaseNoticePeriond,
            //     "sales": data.sales,
            //     "remark": data.remark
            // }
            // let url = `/config/clientSources?clientName=${sendEditData.clientName}&status=${sendEditData.status}&accountList=${sendEditData.accountList}&serviceList=${sendEditData.serviceList}&numberPlanList=${sendEditData.numberPlanList}&qualityCommitment=${sendEditData.qualityCommitment}&referencePriceList=${sendEditData.referencePriceList}&routeClass=${sendEditData.routeClass}&excludeDestinationList=${sendEditData.excludeDestinationList}&email=${sendEditData.email}&timeZone=${sendEditData.timeZone}&rateIncreaseNoticePeriond=${sendEditData.rateIncreaseNoticePeriond}&rateDecreaseNoticePeriond=${sendEditData.rateDecreaseNoticePeriond}&sales=${sendEditData.sales}&remark=${sendEditData.remark}`
            // AxiosPut(url).then((res: any) => {
            //     if (res.code >= 1) {
            //         this.visible = !this.visible;
            //         that.$message.success("Successful addition");
            //         that.SearchOk((that.$refs.AdvancedSearch as any).getFieldsValue());
            //     }
            //     if (res.code != 1) {
            //         return this.$message.warning(res.msg);
            //     }
            // })

            // "id": this.clientSourceId,
            // "clientName": data.clientName,
            // "referencePriceList": data.referencePriceList,
            // "excludeDestinationList": data.excludeDestinationList,
            let sendEditData = {
                "accountList": data.accountName,
                "clientName": data.clientName,
                "email": data.email,
                "excludeDestinationList": data.excludeDestinationList,
                "id": this.clientSourceId,
                "numberPlanList": data.numberPlanList,
                "qualityCommitment": data.qualityCommitment,
                "rateDecreaseNoticePeriond": data.rateDecreaseNoticePeriond,
                "rateIncreaseNoticePeriond": data.rateIncreaseNoticePeriond,
                "referencePriceList": data.referencePriceList,
                "remark": data.remark,
                "numberPlanType": numberPlanTypes,
                "routeClass": data.routeClass,
                "sales": data.sales,
                "serviceList": data.serviceList.length > 1 ? data.serviceList.join(",") : data.serviceList[0],
                "status": data.status,
                "timeZone": data.timeZone,
                "currencyType": data.referencePriceList.split("-")[2]
            }
            ClientSourceEdit(sendEditData).then((res: any) => {
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

    /**关闭编辑窗口 */
    public Screencover(msg ? : any) {
        this.visible = !this.visible;
    }

    /**获取下拉值 */
    public created() {
        let NameList: any;
        ClientSourceList('').then((res: any) => {
            // console.log(res.data)
            NameList = res.data.map((item: any) => item.name)
            NameList = Array.from(new Set(NameList))
            this.formOptions[0]['options'] = NameList
        })
    }

}
</script>

<style lang="scss">
.qc {
    width: 100%;
    text-align: center;
    color: rgb(255, 0, 0);
    font-size: 16px;
}
</style>
