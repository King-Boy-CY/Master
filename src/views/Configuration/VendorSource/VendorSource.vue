<template>
<div>

    <!-- 高级搜索 -->
    <Advanced-search :formoptions="formOptions" :isChildName="true" allowClear @Submit="SearchOk" :data="contractDatas" childDataKey="contractfoVOList" ref="AdvancedSearch" />
    <Table parentKey="id" :isFinance="true" :isNeedCheck="true" :selectedBtn="Formscreening" @onSelectClick="onSelectClick" :columns="columns" :data="data" zebraStripe @onSelectAll="onSelectAll" @onSelect="onSelect" @onSoltClick="onSoltClick" />
    <!-- Add模态弹出框 -->
    <Model align-title="center" v-model="visible" v-if="activeIndex === 1 && visible" shade title="Add Vendor Source" @Screencover="Screencover">
        <template slot="model-body">
            <div class="top-content">
                <form-group :formoptions="baseInfoFormOptions" :span="12" ref="baseInfoFormGroup" class="form-group" @sendChild="sendChild">

                    <!-- <a-col :span="3" class="insert-button">
                        <a-button :size="'small'" type="primary" @click="insertData">
                            ...
                        </a-button>
                    </a-col> -->

                </form-group>
            </div>
            <div class="model-table">
                <keep-alive>
                    <form-group :is='VendorSourceAdd' ref="VendorSourceAdd" />
                </keep-alive>
            </div>
            <div class="model-table">
                <keep-alive>
                    <form-group :is='VendorSourceAddDown' ref="VendorSourceAddDown" />
                </keep-alive>
            </div>
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
    <Model align-title="center" v-model="showChildTable" shade title="add vendor source" @Screencover="Screencover">
        <template slot="model-body">
            <div>
                <div :style="'margin:10px 20px;'">
                    <div :style="'background:#fff;margin-top:20px;padding:0px 0px;'">
                    </div>
                    <div class="menu-child">
                        <VendorSource-addchildtable @confirmData="confirmData" ref="VendorSourceAddchildtable"></VendorSource-addchildtable>
                    </div>
                </div>
            </div>
        </template>
        <template slot="model-footer">
            <a-row>
                <a-col :span="24" :style="{ textAlign: 'center' }">
                    <div style="margin-top:10px;">
                        <a-button type="primary" :style="{ borderRadius: '50px 50px 50px 50px' }" @click="InsertData">Insert</a-button>
                        <a-button :style="{ marginLeft: '8px', color: '#1890ff', borderRadius: '50px 50px 50px 50px', border: '1px solid #1890ff', fontWeight: '600' }" @click="childHandReruen(1)">Return</a-button>
                    </div>
                </a-col>
            </a-row>
        </template>
    </Model>
    <!-- Edit弹出框 -->
    <Model align-title="center" v-model="visible" v-if="activeIndex === 2 && visible" shade title="Edit Vendor Source" @Screencover="Screencover">
        <template slot="model-body">
            <div class="top-content">
                <form-group :formoptions="EditbaseInfoFormOptions" :span="12" ref="baseInfoFormGroup" class="form-group" @sendChild="sendChild">

                    <!-- <a-col :span="3" class="insert-button">
                        <a-button :size="'small'" type="primary" @click="insertData">
                            ...
                        </a-button>
                    </a-col> -->

                </form-group>
            </div>
            <div class="model-table">
                <keep-alive>
                    <form-group :is='VendorSourceTopEdit' ref="VendorSourceTopEdit" :addEdit="addEdit" />
                </keep-alive>
            </div>
            <div class="model-table">
                <keep-alive>
                    <form-group :is='VendorSourceDownEdit' ref="VendorSourceDownEdit" :addEdit="addEdit" />
                </keep-alive>
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
    <Model align-title="center" v-model="showChildTable" shade title="Agreement accout" @Screencover="Screencover">
        <template slot="model-body">
            <div>
                <div :style="'margin:10px 20px;'">
                    <div :style="'background:#fff;margin-top:20px;padding:0px 0px;'">
                    </div>
                    <div class="menu-child">
                        <VendorSource-addchildtable @confirmData="confirmData" ref="VendorSourceAddchildtable"></VendorSource-addchildtable>
                    </div>
                </div>
            </div>
        </template>
        <template slot="model-footer">
            <a-row>
                <a-col :span="24" :style="{ textAlign: 'center' }">
                    <div style="margin-top:10px;">
                        <a-button type="primary" :style="{ borderRadius: '50px 50px 50px 50px' }" @click="InsertData">Insert</a-button>
                        <a-button :style="{ marginLeft: '8px', color: '#1890ff', borderRadius: '50px 50px 50px 50px', border: '1px solid #1890ff', fontWeight: '600' }" @click="childHandReruen(1)">Return</a-button>
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
    refsConfig
} from "@/assets/ts/config.d"
import {
    AxiosGet,
    AxiosDelete
} from "@/api/axios";
import {
    VendorSourceSearch,
    VendorSourceAdd,
    VendorSourceEdit,
    VendorSourceList,
    getDetailService
} from "@/api/index.ts";
import moment from "moment";
import {
    format
} from "ssf/types";
import {
    columns,
    baseInfoFormOptions,
    EditbaseInfoFormOptions,
    formOptions,
    formscreening
} from "./VendorSourceList"
import {
    Columns,
    BaseInfoFormOptions,
    FormOptions,
    Formscreening
} from "./VendorSourceVerify"
import {
    onSelectClick
} from "@/views/Configuration/Exports"

/* 组件 */
@Component({
    components: {
        AdvancedSearch: resolve => require(["@/common/Advancedsearch/index.vue"], resolve),
        Model: resolve => require(["@/common/Model/index.vue"], resolve),
        VendorSourceAdd: resolve => require(["./VendorSourceAdd.vue"], resolve),
        VendorSourceAddT: resolve => require(["./VendorSourceAddT.vue"], resolve),
        VendorSourceTopEdit: resolve => require(["./VendorSourceTopEdit.vue"], resolve),
        VendorSourceDownEdit: resolve => require(["./VendorSourceDownEdit.vue"], resolve),
        Table: () => import("@/views/Finance/components/Table/index.vue"),
        formGroup: () => import("@/views/Finance/components/form-group/index.vue"),
        VendorSourceAddchildtable: resolve => require(["./VendorSourceAddChildTable.vue"], resolve)
    }
})

export default class VendorSource extends Vue {
    private VendorSourceAdd: string = "VendorSourceAdd"; // Add 样式
    private VendorSourceAddDown: string = "VendorSourceAddT"; // Add 第二个表格
    private VendorSourceAddchildtable: string = "VendorSourceAddchildtable"; // Add 子表格
    private VendorSourceTopEdit: string = "VendorSourceTopEdit"
    private VendorSourceDownEdit: string = "VendorSourceDownEdit"
    /**效验Name是否重复 */
    private isRepetition: boolean = false;
    private values = {};
    public $refs: refsConfig | any;
    private insertMsg: any;
    private showChildTable: boolean = false;
    /* 高级搜索 */
    public data: any = [];
    private searchData: any;
    private contractDatas: any[] = [];
    private searchOkData: any[] = [];
    /* 表格 */
    private activeInAdd: number = 0; //add 默认弹框下标
    private activeIndex: number = 0;
    private selectedRows: any;
    private detailsId: any;
    private visible: any = false;

    /* 搜索内容 */
    private formOptions: any['Array'] = formOptions;
    /* Add 属性 */
    private baseInfoFormOptions: any['Array'] = baseInfoFormOptions
    /* Edit 属性 */
    private EditbaseInfoFormOptions: any['Array'] = EditbaseInfoFormOptions;
    /* 编辑功能 */
    private Formscreening: any['Array'] = formscreening;
    /* 表格内容 */
    private columns: any['Array'] = columns;

    /* Add子表格 */
    public insertData() {
        this.showChildTable = !this.showChildTable
    }
    public confirmData(msg) {
        // console.log("hello",msg);
        this.insertMsg = msg
    }

    /* 操作栏点击 -> 回调 */
    public async SearchOk(values: any) {
        // console.log(values)
        let data: any = {
            params: Object.assign({}, values, {
                vendorName: values.vendorName || undefined
            })
        };
        await VendorSourceSearch(data).then((res: any) => {
            this.data = res.data
            // console.log(res)
        })
        this.data.map((item: any, index: number) => {

            if (!item.remark) {
                item.remark = ""
            }

            if (item.lastModified) {
                item.lastModified = moment(item.lastModified).format("YYYY-MM-DD HH:mm")
            }

            // if(item.timeZone) {
            //     item.timeZone = "ㅤ" + item.timeZone + "ㅤ"
            // }
        })
        // console.log(moment("2019-11-29 10:37:20").format("YYYY-MM-DD HH:mm"))
    };

    /**open子表格 */
    private sendChild(values: any) {
        this.showChildTable = !this.showChildTable
    }

    /* 子表格点击事件 */
    public accountNameId: any = "";
    public InsertData(values ? : any): void {
        const baseInfoFormGroup = this.$refs.baseInfoFormGroup
        let value = {}
        value['accountName'] = this.insertMsg[0].AgreementAccount.initialValue
        value['timeZone'] = this.insertMsg[0].TimeZone.initialValue
        baseInfoFormGroup.setFieldsValue(value)
        this.accountNameId = this.insertMsg[0].id
        this.baseInfoFormOptions[2]["initialValue"] = this.insertMsg[0].AgreementAccount.initialValue
        this.baseInfoFormOptions[6]["initialValue"] = this.insertMsg[0].TimeZone.initialValue
        this.EditbaseInfoFormOptions[2]["initialValue"] = this.insertMsg[0].AgreementAccount.initialValue
        this.EditbaseInfoFormOptions[6]["initialValue"] = this.insertMsg[0].TimeZone.initialValue
        if (!this.insertMsg[0].TimeZone) {
            this.baseInfoFormOptions[6]["initialValue"] = "";
            this.EditbaseInfoFormOptions[6]["initialValue"] = "";
        }
        // console.log(this.baseInfoFormOptions)
        // console.log(this.insertMsg)
        this.insertData()
    }

    // 修改按钮可否点击
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

    /* 用户手动选择/取消选择所有列的回调  Table -> 回调 */
    public onSelectAll(selected: any, selectedRows: any, changeRows: any) {
        // console.log(selected, selectedRows, changeRows);
        this.changeDisable(selectedRows);
    }

    /* 用户手动选择/取消选择某列的回调
            @param record: 选中数据
            @param selected: 是否选中 true/false
            @param selectedRows: 所有选中 Array
            */
    private recordId: any = ""
    private selectedId: any = ""
    public onSelect(record: object, selected: boolean, selectedRows: any) {
        // console.log(record,selected,selectedRows) // 选中的数据
        this.changeDisable(selectedRows);
        this.recordId = record
        this.selectedId = selected
        // console.log(this.$store.state.vendorSourceNum)
    }

    /* Add 选项卡 */
    public activeAdd(tab: any, item: any) {
        // console.log(tab,item);

        this.activeInAdd = tab;
        // this.activeSelectAdd = item;
    }

    /* onSoltClick */
    private onSoltClick(soltName: string, text: any, record: any, index: number) {
        // console.log(slotName)
        // console.log(text)
        // console.log(record)
        // console.log(index)
        if (soltName === "download") {
            // this.selectName = "nettingStatementDetails";
            // this.visible = true;
            // this.toExportRowKey = index;
        }
    }

    /* 操作栏点击 -> 回调 */
    private editSelectId: any;
    private addEdit: object = {}
    private accountId: any = "";
    private relatedContract: any = undefined;
    public async onSelectClick({
            name,
            index
        }: any,
        selected: any,
        selectedData: any,
        activeObJ: any
    ) {
        let that: any = this
        const deleted = selectedData.map((item: any) => item.id).join(",")
        const statusList = selectedData.map((item: any) => item.status)
        getDetailService('').then((res: any) => {
            this.baseInfoFormOptions[3].options = res.data
            this.EditbaseInfoFormOptions[3].options = res.data
        })
        if (index == 2) {
            this.activeIndex = 2
            let editId = deleted
            this.editSelectId = deleted
            let addEdit: any;
            let url = `/config/vendor-source/${editId}`
            await AxiosGet(url).then((res: any) => {
                addEdit = res.data
                // console.log(addEdit)
            })
            this.addEdit = addEdit
            // console.log(this.addEdit)
            setTimeout(() => {
                let ServiceData = selectedData[0].serviceName.split(",")
                // console.log(ServiceData)
                this.EditbaseInfoFormOptions[0].initialValue = selectedData[0].vendorName
                this.EditbaseInfoFormOptions[1].initialValue = selectedData[0].status
                this.EditbaseInfoFormOptions[2].initialValue = selectedData[0].accountName
                this.EditbaseInfoFormOptions[3].initialValue = ServiceData
                this.EditbaseInfoFormOptions[4].initialValue = selectedData[0].cliSupportedByDefault
                this.EditbaseInfoFormOptions[5].initialValue = selectedData[0].email
                this.EditbaseInfoFormOptions[6].initialValue = selectedData[0].timeZone
                this.EditbaseInfoFormOptions[7].initialValue = selectedData[0].isAutomateAnalysis
                this.EditbaseInfoFormOptions[8].initialValue = selectedData[0].isAutomateMarkingRoutable
                this.EditbaseInfoFormOptions[9].initialValue = selectedData[0].remark
            });
        }
        if (index == 3) {
            this.activeIndex = 3;
            let url = `/config/vendor-source/${deleted}`;
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
                            if (statusList[i] == 1) {
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
            });
        }
        if (index == 7) {
            this.activeIndex = 7;
            this.$message.loading('loading')
            if (activeObJ === undefined) {
                // Export
                let dataExpot = JSON.parse(JSON.stringify(this.data))
                dataExpot.map((item: any, index: number) => {
                    if (item.timeZone) {
                        item.timeZone = "ㅤ" + item.timeZone + "ㅤ"
                    }
                    if (item.status === 1) {
                        item.status = 'Active'
                    } else if (item.status === 2) {
                        item.status = 'Invalid'
                    }
                    if (item.cliSupportedByDefault === 1) {
                        item.cliSupportedByDefault = "Yes"
                    } else if (item.cliSupportedByDefault === 2) {
                        item.cliSupportedByDefault = "Defined by offer"
                    }

                    if (item.isAutomateAnalysis === 1) {
                        item.isAutomateAnalysis = "On"
                    } else if (item.isAutomateAnalysis === 2) {
                        item.isAutomateAnalysis = "Off"
                    }

                    if (item.isAutomateMarkingRoutable === 1) {
                        item.isAutomateMarkingRoutable = "On"
                    } else if (item.isAutomateMarkingRoutable === 2) {
                        item.isAutomateMarkingRoutable = "Off"
                    }
                })
                onSelectClick(this.columns, dataExpot, `VendorSource`, "VendorSource")
            }
        }
        this.activeIndex = index
        index !== 7 && (this.visible = !this.visible)
        // console.log("不可使用")
    }

    /* 退出 */
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
    /* ChildTable退出 */
    childHandReruen(msg: any) {
        const that: any = this
        if (msg == 1) {
            this.$confirm({
                title: 'Close Tip',
                content: 'Continue to exit?',
                okText: 'Yes',
                cancelText: 'No',
                onOk() {
                    that.ChildScreencover(msg)
                }
            });
        } else {
            that.ChildScreencover(msg);
        }
    }
    /* Save Add */
    private async addAllData() {
        let that: any = this;
        // console.log(this.insertMsg[0].id.initialValue)
        let accid = this.accountNameId
        if (this.activeIndex === 1) {
            const baseInfoFormGroup: any = this.$refs.baseInfoFormGroup;
            const vendorAddDown = this.$refs.VendorSourceAddDown;
            const vendorAddTop = this.$refs.VendorSourceAdd;
            let data = baseInfoFormGroup.getFieldsValue(); // Add数据
            if (!data.accountName || !data.isAutomateAnalysis || !data.isAutomateMarkingRoutable || !data.serviceName || !data.status || !data.vendorName) {
                return baseInfoFormGroup.validateFields()
            } else {
                let objTop = JSON.parse(JSON.stringify(vendorAddTop.$refs.TableInput.getData())); // Add第一表格数据
                let objDown = JSON.parse(JSON.stringify(vendorAddDown.$refs.TableInput.getData())); // Add第二表格数据
                // console.log("data", data)
                let roundingRules: any = []
                let timeBands: any = []
                /* roundingRules */
                for (let i = 0; i < objDown.length; i++) {
                    let array = new Array(objDown[i].minimumValue, objDown[i].initialRounding, objDown[i].additionalRounding,
                        objDown[i].maximumValue, objDown[i].measureAdjustment, objDown[i].isMaximumAsCap == 'YES' ? 1 : '' || objDown[i].isMaximumAsCap == 'NO' ? '0' : '');
                    let rulename = array.join(":");
                    roundingRules.push({
                        roundingRuleName: rulename,
                        minimumValue: objDown[i].minimumValue,
                        initialRounding: objDown[i].initialRounding,
                        additionalRounding: objDown[i].additionalRounding,
                        maximumValue: objDown[i].maximumValue,
                        measureAdjustment: objDown[i].measureAdjustment,
                        isMaximumAsCap: objDown[i].isMaximumAsCap == 'YES' ? 1 : 0 || objDown[i].isMaximumAsCap == 'NO' ? 0 : 1
                    });
                    // console.log(objDown[i].minimumValue)
                }

                /* timeBands */
                for (let i = 0; i < objTop.length; i++) {
                    timeBands.push({
                        weekdayFrom: objTop[i].weekdayFrom,
                        weekdayTo: objTop[i].weekdayTo,
                        dayFrom: objTop[i].dayFrom,
                        dayTo: objTop[i].dayTo,
                        type: objTop[i].Type,
                        timeFrom: objTop[i].timeFrom && objTop[i].timeFrom ? moment(objTop[i].timeFrom).format('HH:mm:ss') : objTop[i].timeFrom,
                        timeTo: objTop[i].timeTo && objTop[i].timeTo ? moment(objTop[i].timeTo).format('HH:mm:ss') : objTop[i].timeTo,
                        timeBandName: objTop[i].timeBandName
                    });
                    // console.log(moment(objTop[i].timeFrom).format('HH:mm:ss'), moment(objTop[i].timeTo).format('HH:mm:ss'))
                }
                // console.log(objTop, objDown)
                let serviceListData = {
                    "roundingRules": roundingRules,
                    "timeBands": timeBands,
                    "vendorSources": {
                        "vendorName": data.vendorName,
                        "status": data.status,
                        "accountName": data.accountName,
                        "serviceName": data.serviceName.length > 1 ? data.serviceName.join(",") : data.serviceName[0],
                        "cliSupportedByDefault": data.cliSupportedByDefault,
                        "email": data.email,
                        "timeZone": data.timeZone,
                        "isAutomateAnalysis": data.isAutomateAnalysis,
                        "isAutomateMarkingRoutable": data.isAutomateMarkingRoutable,
                        "remark": data.remark
                    }
                }
                // console.log(serviceListData)

                for (let i = 0; i < this.formOptions[0].options.length; i++) {
                    if (this.formOptions[0].options[i].name == serviceListData.vendorSources.vendorName) {
                        return this.isRepetition = true
                    } else {
                        this.isRepetition = false
                    }
                }

                if (!this.isRepetition) {
                    VendorSourceAdd(serviceListData).then((res: any) => {
                        // console.log(res.code)
                        if (res.code >= 1) {
                            this.visible = !this.visible;
                            that.$message.success("Successful addition");
                            this.SearchOk((this.$refs.AdvancedSearch as any).getFieldsValue())
                            this.baseInfoFormOptions[2].initialValue = "";
                            this.baseInfoFormOptions[6].initialValue = "";
                            VendorSourceList('').then((res: any) => {
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

    /* Edit Commit Button */
    public editAllData(values: any): void {
        if (this.activeIndex === 2) {
            let that: any = this;
            let editId: any;
            let accountNameId = this.accountNameId
            const editBaseInfoFormGroup: any = this.$refs.baseInfoFormGroup;
            const editVendorAddDown: any = this.$refs.VendorSourceDownEdit;
            const editVendorAddTop: any = this.$refs.VendorSourceTopEdit;
            let data = editBaseInfoFormGroup.validateFields();
            let editobjTop = JSON.parse(JSON.stringify(editVendorAddTop.$refs.TableInput.getData())); // Add第一表格数据
            let editobjDown = JSON.parse(JSON.stringify(editVendorAddDown.$refs.TableInput.getData())); // Add第二表格数据
            // console.log(editobjTop, editobjDown)
            let editRoundingRules: any = []
            let editTimeBands: any = []
            // console.log(data)

            /* editRoundingRules */
            for (let i = 0; i < editobjDown.length; i++) {
                let array = new Array(editobjDown[i].minimumValue, editobjDown[i].initialRounding, editobjDown[i].additionalRounding,
                    editobjDown[i].maximumValue, editobjDown[i].measureAdjustment, editobjDown[i].isMaximumAsCap == 'YES' ? 1 : '' || editobjDown[i].isMaximumAsCap == 'NO' ? 0 : '');
                let rulename = array.join(":");
                editRoundingRules.push({
                    roundingRuleName: rulename,
                    minimumValue: editobjDown[i].minimumValue,
                    initialRounding: editobjDown[i].initialRounding,
                    additionalRounding: editobjDown[i].additionalRounding,
                    maximumValue: editobjDown[i].maximumValue,
                    measureAdjustment: editobjDown[i].measureAdjustment,
                    isMaximumAsCap: editobjDown[i].isMaximumAsCap == 'YES' ? 1 : 0 || editobjDown[i].isMaximumAsCap == 'NO' ? 0 : 1
                });
                // console.log(editobjDown[i].minimumValue)
            }

            /* editTimeBands */
            for (let i = 0; i < editobjTop.length; i++) {
                editTimeBands.push({
                    weekdayFrom: editobjTop[i].weekdayFrom,
                    weekdayTo: editobjTop[i].weekdayTo,
                    dayFrom: editobjTop[i].dayFrom,
                    dayTo: editobjTop[i].dayTo,
                    type: editobjTop[i].Type,
                    timeFrom: editobjTop[i].timeFrom && editobjTop[i].timeFrom ? moment(editobjTop[i].timeFrom).format('HH:mm:ss') : editobjTop[i].timeFrom,
                    timeTo: editobjTop[i].timeTo && editobjTop[i].timeTo ? moment(editobjTop[i].timeTo).format('HH:mm:ss') : editobjTop[i].timeTo,
                    timeBandName: editobjTop[i].timeBandName
                });
                // console.log(moment(editobjTop[i].timeFrom).format('HH:mm:ss'), moment(editobjTop[i].timeTo).format('HH:mm:ss'))
            }

            // console.log("editRoundingRules", editRoundingRules, "editTimeBands", editTimeBands)

            let editData = {
                "roundingRules": editRoundingRules,
                "timeBands": editTimeBands,
                "vendorSources": {
                    "id": this.editSelectId,
                    "vendorName": data.vendorName,
                    "status": data.status,
                    "accountName": data.accountName,
                    "serviceName": data.serviceName.length > 1 ? data.serviceName.join(",") : data.serviceName[0],
                    "cliSupportedByDefault": data.cliSupportedByDefault,
                    "email": data.email,
                    "timeZone": data.timeZone,
                    "isAutomateAnalysis": data.isAutomateAnalysis,
                    "isAutomateMarkingRoutable": data.isAutomateMarkingRoutable,
                    "remark": data.remark
                }
            }
            VendorSourceEdit(editData).then((res: any) => {
                if (res.code >= 1) {
                    this.visible = !this.visible;
                    that.$message.success("Successful addition");
                    this.SearchOk((this.$refs.AdvancedSearch as any).getFieldsValue())
                }
                if (res.code != 1) {
                    return this.$message.warning(res.msg);
                }
            })
        }
    }
    /* 关闭 Add */
    public Screencover(msg ? : any) {

        this.visible = !this.visible;
        this.baseInfoFormOptions[2].initialValue = "";
        this.baseInfoFormOptions[6].initialValue = "";
        // this.$store.state.vendorSourceIndex = false
    }
    public ChildScreencover(msg ? : any) {
        this.showChildTable = !this.showChildTable
    }

    public created() {
        (async () => {
            VendorSourceList('').then((res: any) => {
                this.formOptions[0]['options'] = res.data
            })
        })()
    }

}
</script>

<style lang="scss">
.insert-button {
    width: 50px;
    position: absolute;
    top: -367px;
    text-align: center;
    right: 51%;
}

.testClass {
    margin-top: -50px;
}

.qc {
    width: 100%;
    text-align: center;
    color: rgb(255, 0, 0);
    font-size: 16px;
}
</style>
