<template>
<div>
    <!-- 高级搜索 -->
    <Advanced-search :formoptions="formOptions" :isChildName="true" allowClear @Submit="SearchOk" :data="contractDatas" childDataKey="contractfoVOList" ref="AdvancedSearch" />
    <!-- 表格 -->
    <Table parentKey="id" :isFinance="true" :isNeedCheck="true" :selectedBtn="Formscreening" @onSelectClick="activeClick" @onSelectAll="onSelectAll" @onSelect="onSelect" :columns="columns" :data="data" zebraStripe />
    <!-- 分页 -->
    <!--<pagination @change="onChang"/>-->
    <!-- Add模态弹出框 -->
    <Model align-title="center" v-model="visible" @close="Screencover" v-if="activeIndex === 1 && visible" shade title="Add new contract" @Screencover="Screencover">
        <template slot="model-body">
            <div>
                <div style="background:#fff;padding:20px 0px;">
                    <a-row class="sRow" type="flex" justify="center">
                        <a-col v-for="(list,index) in listBar" :key="index" class="sCol" :class="{ active: index === activeInAdd }" @click="activeAdd(index,list.cName)">{{list.name}}</a-col>
                    </a-row>
                </div>
                <div class="menu-child">
                    <keep-alive>
                        <div :is="activeSelectAdd" :isSync="isAddSync" />
                    </keep-alive>
                </div>
            </div>
        </template>
        <template slot="model-footer">
            <a-button class="save-btn" type="primary" @click="addAllData(1)">Save all</a-button>
            <a-button class="return-btn" @click="handleReruen(1)">Return</a-button>
        </template>
    </Model>
    <!-- edit 模态框弹出 -->
    <Model align-title="center" v-if="activeIndex === 2 && visible" @close="Screencover" v-model="visible" shade title="Edit contract" @Screencover="Screencover">
        <template slot="model-body">
            <div :style="'margin:10px 20px;'">
                <div style="background:#fff;margin-top:20px;padding:20px 0px;">
                    <a-row class="sRow" type="flex" justify="center">
                        <a-col v-for="(list,index) in listBarEdit" :key="index" class="sCol" :class="{ active: index === activeInEdit }" @click="activeEdit(index,list.cName)">{{list.name}}</a-col>
                    </a-row>
                </div>
                <div class="menu-child">
                    <keep-alive>
                        <div :is="activeSelectEdit" :addEdit="addEdit" />
                    </keep-alive>
                </div>
            </div>
        </template>
        <template slot="model-footer">
            <a-button class="save-btn" type="primary" v-if="activeInEdit !== 2" @click="editProduct(2)">Save all</a-button>
            <a-button class="return-btn" @click="handleReruen">Return</a-button>
        </template>
    </Model>
    <!-- submit  按钮弹出-->
    <div class="submitBtn">
        <Model title="Submit VC Contract" v-if="activeIndex === 4 && visible" v-model="visible" :height="'400px'" width="960px" @Screencover="Screencover">
            <template slot="model-body">
                <form-group :formoptions="formoptionsSubmit" :span="12" ref="formGroup" class="form-group"></form-group>
            </template>
            <template slot="model-footer">
                <a-button class="save-btn" type="primary" v-html="Save" v-if="activeInEdit !== 2" @click="saveContract"></a-button>
                <a-button class="return-btn" @click="handleReruen">Return</a-button>
            </template>
        </Model>
    </div>
    <!--Audtit  按钮弹出-->
    <div class="AudtitBtn">
        <Model title="Submit VC Contract" v-if="activeIndex === 5 && visible" v-model="visible" width="960px" @Screencover="Screencover">
            <template slot="model-body" class="soltSpan">
                <div id="components-form-group">
                    <a-form :form="formAudit" class="inner-form-group">
                        <a-row>
                            <a-col :span="12" v-for="(item,i) in formoptionsAudit" :key="i">
                                <a-form-item :label="item.name" :label-col="{span:6, offset:2}">
                                    <a-select v-if="item.type === 'select'" @change="AuditChange(item.name,$event,i)" @dropdownVisibleChange="dropdownAudit(item.name,$event,i)" :getPopupContainer=" e => e.parentNode" :disabled="item.disabled" v-decorator="[
                                `${item.name}`,
                                {
                                    initialValue:item.initialValue,
                                    rules: [{
                                        required: item.required,
                                        message: `${item.name} field should be no-null`,
                                    }],
                                }
                            ]">
                                        <a-select-option :value="child.name || child" v-for="(child,key) in item.options" :key="key">{{child.name || child}}</a-select-option>
                                    </a-select>
                                    <a-textarea :label-col="{offset:2}" class="textarea" :disabled="item.disabled" allowClear v-if="item.type === 'textarea'" :getPopupContainer=" e => e.parentNode" v-decorator="[ `${item.name}`, { rules: [{ required: item.required, message: `${item.name} field should be no-null`, }], } ]" />
                                </a-form-item>
                            </a-col>
                        </a-row>
                        <a-row v-if="refusedReason!=='' ">
                            <a-col :span="20" :offset="4">
                                <div v-html="refusedReason" class="refusedReasonStyle"></div>
                            </a-col>
                        </a-row>
                    </a-form>
                </div>
            </template>
            <template slot="model-footer">
                <a-button class="save-return" type="primary" v-if="activeInEdit !== 2" v-html="Save" @click="saveAudit"></a-button>
                <a-button class="return-return" @click="handleReruen">Return</a-button>
            </template>
        </Model>
    </div>
    <!-- Details 模态弹出框 -->
    <Model title="VC Informantion" v-if="activeIndex === 6 && visible" v-model="visible" @Screencover="Screencover">
        <template slot="model-body">
            <detail-s :detailResMsg="detailResMsgAdd" :productName="productName"></detail-s>
        </template>
        <template slot="model-footer">
            <a-button class="return-btn" @click="handleReruen">Return</a-button>
        </template>
    </Model>
</div>
</template>

<script lang="ts">
import Vue from "vue";
import {
    Component,
    Watch
} from "vue-property-decorator";
import {
    State,
    Mutation
} from "vuex-class";
import {
    AxiosGet,
    AxiosPatch,
    AxiosDelete,
    AxiosPost,
    AxiosPut
} from "@/api/axios";
import moment from "moment";
import {
    deepClone
} from "@/assets/ts/index.ts";
import {
    downloadLocalFiles
} from "@/views/Finance/components/DownloadFile/saveFile";
@Component({
    components: {
        AdvancedSearch: resolve =>
            require(["@/common/Advancedsearch/index.vue"], resolve),
        // FormscReening: resolve =>
        //     require(["@/common/Formscreening/index.vue"], resolve),
        // Table: resolve => require(["@/common/Table/index.vue"], resolve),
        // pagination: resolve => require(["@/common/pagination/index.vue"], resolve),
        Model: resolve => require(["@/common/Model/index.vue"], resolve),
        contractDetials: resolve =>
            require(["@/components/AddNewContract/contractDetails/index.vue"], resolve),
        cycle: resolve =>
            require(["@/components/AddNewContract/cycle/index.vue"], resolve),
        // numberPlan: resolve => require(["@/components/AddNewContract/numberPlan.vue"], resolve),
        product: resolve =>
            require(["@/components/AddNewContract/product/index.vue"], resolve),
        ratePlan: resolve =>
            require(["@/components/AddNewContract/ratePlan/ratePlan.vue"], resolve),
        service: resolve =>
            require(["@/components/AddNewContract/service/index.vue"], resolve),
        detailS: resolve =>
            require(["@/components/formscReening/details/index.vue"], resolve),
        Table: () => import("@/views/Finance/components/Table/index.vue"),
        contractDetailEdit: () => import("@/components/AddNewContract/contractDetails/index.vue"),
        // import("@/components/addEdit/contractDetailsEdit.vue"),
        serviceEdit: () => import("@/components/AddNewContract/service/index.vue"),
        // import("@/components/addEdit/serviceEdit.vue"),
        cycleEdit: () => import("@/components/AddNewContract/cycle/index.vue"),
        // import("@/components/addEdit/cycleEdit.vue"),
        ratePlanEdit: () => import("@/components/AddNewContract/ratePlan/ratePlan.vue"),
        // import("@/components/addEdit/ratePlanEdit/ratePlanEdit.vue"),
        formGroup: () => import("@/views/Finance/components/form-group/index.vue"),
        // import('@/components/addEdit/productEdit/index.vue')
        productEdit: () => import('@/components/AddNewContract/product/index.vue')
    }
})
export default class VcContract extends Vue {
    @State("productRatingZoneList") private productRatingZoneList ? : any;
    @State("ratePlanObject") private ratePlanObject: any;
    @State("contractData") private contractData: any;
    @State("productForm") private productForm: any;
    @State("prossData") private prossData: any;
    @State("productIndex") private productIndex!: number;
    @State('ContractObject') ContractObject: any
    @State('editProctData') editProctData: any
    @State('closeModel') closeModel: any
    @State('editData') editData: any
    @State('editProduct') editProductData: any
    @Mutation("mutionDetailsId") mutionDetailsId: any;
    @Mutation("clearContractData") clearContractData: any;
    @Mutation("closeModelFn") closeModelFn: any;

    @Watch('activeSelectAdd') onActiveSelectAdd(newVal ? : any, oldVal ? : any) {
        // 监听 组件切换 然后延迟执行下 this._asyncProductData; 同步数据
        if (newVal === 'product' && oldVal === 'cycle') {
            this.isAddSync = true
        } else if (oldVal === 'product') {
            this.isAddSync = false
        }
        console.log('newVal:', newVal);
        console.log('oldVal:', oldVal);
        console.log('isAddSync:', this.isAddSync);
    }
    private isAddSync: boolean = false // 用于判断 是否是cycle 组件切换到product 延迟执行product的方法使数据同步
    @Mutation('mutioncontractIndex') mutioncontractIndex: any
    @Mutation('mutioncontractData') mutioncontractData: any
    private Save: string = "&nbsp;&nbsp;Save&nbsp;&nbsp;&nbsp;";
    private activeIndex: number = 0;
    private listBar: any[] = [{
            name: "Contract Details",
            cName: "contractDetials"
        },
        {
            name: "Service",
            cName: "service"
        },
        {
            name: "Cycle",
            cName: "cycle"
        },
        {
            name: "Rate plan",
            cName: "ratePlan"
        },
        {
            name: "Product",
            cName: "product"
        }
    ];
    private listBarEdit: any[] = [{
            name: "Contract Details",
            cName: "contractDetailEdit"
        },
        {
            name: "Service",
            cName: "serviceEdit"
        },
        {
            name: "Cycle",
            cName: "cycleEdit"
        },
        {
            name: "RatePlan",
            cName: "ratePlanEdit"
        },
        {
            name: "Product",
            cName: "productEdit"
        }
    ];
    private onSelectClick(activeObJ: any, selected: any, selectedData: any) {
        console.log(activeObJ);
        console.log(selected);
        console.log(selectedData);
    }
    private activeInAdd: number = 0; //add 默认弹框下标
    private activeInEdit: number = 0; //edit 默认弹框下标
    private detailResMsgAdd: any; // Add Detail 页面接口数据
    private productName: any; //product 页面数据
    private activeSelectAdd: string = "contractDetials"; //add 动态组件切换
    private activeSelectEdit: string = "contractDetailEdit"; //edit 动态组件切换
    private columns: any[] = [{
            title: "Account",
            dataIndex: "accountName",
            key: "accountName"
            // width:100
        },
        {
            title: "Account type",
            dataIndex: "accountType",
            key: "accountType",
            customRender: (value: any, row: any, index: any) => {
                const obj = {
                    children: value
                };
                const find: any = this.accountTypeOptions.find(
                    (item: any) => item.value === value
                );
                if (find) {
                    obj.children = find.name;
                }
                return obj;
            }
            // width:100
        },
        {
            title: "Contract",
            dataIndex: "contractName",
            key: "contractName"
            // width:100
        },
        {
            title: "Contract Abbrv.",
            dataIndex: "contractAbbrv",
            key: "contractAbbrv"
            // width:100
        },
        {
            title: "Contract type",
            dataIndex: "contractType",
            key: "contractType",
            customRender: (value: any, row: any, index: any) => {
                const obj = {
                    children: value
                };
                const find: any = this.contractTypeOptions.find(
                    (item: any) => item.value === value
                );
                if (find) {
                    obj.children = find.name;
                }
                return obj;
            }
            // width:100
        },
        {
            title: "Contract status",
            dataIndex: "contractStatus",
            key: "contractStatus",
            customRender: (value: any, row: any, index: any) => {
                const obj = {
                    children: value
                };
                const find: any = this.contractStatusOptions.find(
                    (item: any) => item.value === value
                );
                if (find) {
                    obj.children = find.name;
                }
                return obj;
            }
            // width:100
        },
        {
            title: "Operating State",
            dataIndex: "operatingState",
            key: "operatingState",
            customRender: (value: any, row: any, index: any) => {
                const obj = {
                    children: value
                };
                const find: any = this.operatingStateOptions.find(
                    (item: any) => item.value === value
                );
                if (find) {
                    obj.children = find.name;
                } else if (value > 100 && value < 1000) {
                    let n = value - 100;
                    obj.children = `R${n}`;
                }
                return obj;
            }
        },
        {
            title: "Service",
            dataIndex: "configServiceNameList",
            key: "configServiceNameList"
            // width:100
        },
        {
            title: "Begin date",
            dataIndex: "beginDate",
            key: "beginDate",
            width: 120
        },
        {
            title: "End date",
            dataIndex: "endDate",
            key: "endDate",
            width: 120
        },
        {
            title: "Signed date",
            dataIndex: "singedDate",
            key: "singedDate",
            width: 120
        },
        {
            title: "Priority",
            dataIndex: "priority",
            key: "priority",
            customRender: (value: any, row: any, index: any) => {
                const obj = {
                    children: value
                };
                const find: any = this.priorityOptions.find(
                    (item: any) => item.value === value
                );
                if (find) {
                    obj.children = find.name;
                }
                return obj;
            }
            // width:100
        },
        {
            title: "Related Contract",
            dataIndex: "relatedContract",
            key: "relatedContract"
        },
        {
            title: "Auto renew",
            dataIndex: "isAutoRenew",
            key: "isAutoRenew",
            customRender: (value: any, row: any, index: any) => {
                const obj = {
                    children: value
                };
                const find: any = this.isAutoRenewOptions.find(
                    (item: any) => item.value === value
                );
                if (find) {
                    obj.children = find.name;
                }
                return obj;
            }
            // width:100
        },
        {
            title: "Renew date",
            dataIndex: "renewDate",
            key: "renewDate",
            width: 130
        },
        {
            title: "Contract manager",
            dataIndex: "contractManager",
            key: "contractManager"
            // width:100
        },
        {
            title: "Submission time",
            dataIndex: "submissionTime",
            key: "submissionTime",
            width: 170
        },
        {
            title: "Reason",
            dataIndex: "refusedReason",
            key: "refusedReason",
            scopedSlots: {
                customRender: "richText"
            },
            width: 300
        },
        {
            title: "Approved by",
            dataIndex: "approvedBy",
            key: "approvedBy"
            // width:100
        },
        {
            title: "Approved",
            dataIndex: "lastApproved",
            key: "lastApproved",
            width: 170
        },
        {
            title: "Modified by",
            dataIndex: "modifiedBy",
            key: "modifiedBy"
            // width:100
        },
        {
            title: "Last modified",
            dataIndex: "lastModified",
            key: "lastModified",
            width: 170
        }
    ];
    private contractDatas: any[] = [];
    private isAutoRenewOptions: any = [{
            name: "No",
            value: 0
        },
        {
            name: "Yes",
            value: 1
        }
    ];
    private priorityOptions: any = [{
            name: "Low",
            value: 1
        },
        {
            name: "High",
            value: 10
        }
    ];
    private operatingStateOptions: any = [{
            name: "N",
            value: 1
        },
        {
            name: "E",
            value: 2
        },
        {
            name: "D",
            value: 3
        },
        {
            name: "R",
            value: 100
        }
    ];
    private contractStatusOptions: any = [{
            name: "Expired",
            value: 1
        },
        {
            name: "Active",
            value: 2
        },
        {
            name: "Future",
            value: 3
        },
        {
            name: "Invalid",
            value: 4
        }
    ];
    private contractTypeOptions: any = [{
            name: "Draft",
            value: 1
        },
        {
            name: "Processing",
            value: 2
        },
        {
            name: "Refused",
            value: 3
        },
        {
            name: "Approved",
            value: 4
        }
    ];
    private accountTypeOptions: any = [{
            name: "Vendor",
            value: 1
        },
        {
            name: "Client",
            value: 2
        },
        {
            name: "Bilateral",
            value: 3
        }
    ];
    private data: any[] = [];
    private formOptions: any[] = [{
            Tips: "Account",
            name: "accountName",
            required: false,
            type: "select",
            span: 12,
            colSpan: 6,
            options: null
        },
        {
            Tips: "AccountType",
            name: "accountType",
            required: false,
            type: "select",
            span: 12,
            colSpan: 7,
            options: this.accountTypeOptions
        },
        {
            Tips: "Contract",
            name: "contractNameList",
            required: false,
            type: "tags",
            span: 12,
            colSpan: 6,
            options: null
        },
        {
            Tips: "Service",
            name: "configServiceNameList",
            required: false,
            type: "tags",
            span: 12,
            colSpan: 7,
            options: null
        },
        {
            Tips: "Type",
            name: "contractType",
            required: false,
            type: "select",
            span: 12,
            colSpan: 6,
            options: this.contractTypeOptions
        },
        {
            Tips: "Status",
            name: "contractStatus",
            required: false,
            type: "select",
            span: 12,
            colSpan: 7,
            options: this.contractStatusOptions
        },
        {
            Tips: "Operating State",
            name: "operatingState",
            required: false,
            type: "select",
            span: 12,
            colSpan: 6,
            options: this.operatingStateOptions
        },
        {
            Tips: "Contract manager",
            name: "contractManager",
            required: false,
            type: "select",
            span: 12,
            colSpan: 7,
            options: null
        }
    ];
    private formoptionsSubmit: any[] = [{
            Tips: "Contract Name",
            name: "contractName",
            decorator: "contractName",
            initialValue: "",
            type: "input",
            disabled: true,
            options: [],
            offset: 3
        },
        {
            Tips: "Approved by",
            name: "ApprovedBy",
            decorator: "ApprovedBy",
            required: true,
            type: "select",
            initialValue: "",
            options: [],
            offset: 3
        },
        {
            Tips: "Expected Date",
            name: "ExpectedDate",
            decorator: "ExpectedDate",
            required: true,
            initialValue: moment().add(3, 'd'),
            type: "picker",
            options: [],
            offset: 3
        },
        {
            Tips: "Latest Date",
            name: "LatestDate",
            decorator: "LatestDate",
            required: true,
            type: "picker",
            initialValue: moment().add(7, 'd'),
            options: [],
            offset: 3
        }
    ];
    private Formscreening: any[] = [{
            name: "Add",
            icon: "plus-circle",
            index: 1
        },
        {
            name: "Edit",
            icon: "form",
            index: 2,
            disabled: true,
            tips: "Records whose Operating state is 'D/E' cannot be edited;Records whose Type is Processing cannot be edited"
        },
        {
            tips: "Records whose Operating state is 'D/E' cannot be deleted;Records whose Type is 'Processing' cannot be deleted.",
            name: "Delete",
            icon: "delete",
            index: 3,
            disabled: true
        },
        {
            name: "Submit",
            icon: "sumit",
            index: 4,
            disabled: true,
            tips: "Selected record cannot be submitted for approval"
        },
        {
            name: "Audit",
            icon: "audit",
            index: 5,
            disabled: true,
            tips: "Selected records cannot be approved"
        },
        {
            name: "Details",
            icon: "file-text",
            index: 6,
            disabled: true,
            tips: "Need to select the record before operating"
        },
        {
            name: "Export",
            icon: "export",
            index: 7,
            disabled: true,
        }
    ];
    private formoptionsAudit: any[] = [{
            name: "Contract",
            Tips: "Contract",
            required: true,
            disabled: false,
            initialValue: "",
            type: "select",
            options: []
        },
        {
            name: "Approved",
            Tips: "Approved",
            required: true,
            type: "select",
            initialValue: "",
            options: this.isAutoRenewOptions
        },
        {
            name: "Reason",
            Tips: "Reason",
            required: false,
            disabled: false,
            type: "textarea"
        }
    ];
    private changeDisable(selectedRows: any) {
        // 0 edit   1 export
        if (selectedRows.length === 1) {
            this.Formscreening[0].disabled = false;
            this.Formscreening[1].disabled = false;
        } else if (selectedRows.length > 1) {
            this.Formscreening[0].disabled = true;
            this.Formscreening[1].disabled = false;
        } else {
            this.Formscreening[0].disabled = true;
            this.Formscreening[1].disabled = true;
        }
    }
    private form: any; //Submit
    private formAudit: any; //Audit
    public componentArr: string[] = ['Flat', 'Tier', 'Interval', 'RecurringCharge', 'OneTimeCharge', 'Penalty', 'Cap', 'disCount'];
    public onChange() {}
    private beforeCreate() {
        this.form = this.$form.createForm(this);
        this.formAudit = this.$form.createForm(this);
    }
    // 高级搜索 Search -> 回调
    public SearchOk(values ? : any): void {
        const data: any = {
            params: Object.assign({}, values, {
                contractNameList: values.contractNameList && values.contractNameList.length > 0 ?
                    values.contractNameList.join(",") : undefined,
                configServiceNameList: values.configServiceNameList &&
                    values.configServiceNameList.length > 0 ?
                    values.configServiceNameList.join(",") : undefined
            })
        };
        AxiosGet("/contract/vc-contract/summary", data).then((res: any) => {
            this.data = res.data.map((item: any, i: number) => {
                if (item.refusedReason == undefined) {
                    item.refusedReason = "";
                }
                return item;
            });
            // console.log(this.data);
        });
    }
    /* 用户手动选择/取消选择所有列的回调  Table -> 回调 */
    public onSelectAll(selected: any, selectedRows: any, changeRows: any) {
        // console.log(selected, selectedRows, changeRows);
        this.prouccDatiletias(selectedRows);
    }
    /* 用户手动选择/取消选择某列的回调
         @param record: 选中数据
         @param selected: 是否选中 true/false
         @param selectedRows: 所有选中 Array
      */
    public onSelect(record: object, selected: boolean, selectedRows: any) {
        // console.log(record, selected, selectedRows);
        this.prouccDatiletias(selectedRows);
        // console.log(selectedRows.length);
    }
    public AuditChange(val: any, name: string, key ? : number) {
        // console.log("val", val, "name", name);
        this.$nextTick(() => {
            if (val == "Approved" && name == "Yes") {
                this.formAudit.setFieldsValue({
                    Reason: undefined
                });
                this.$set(this.formoptionsAudit[2], "disabled", name == "Yes");
                this.$set(this.formoptionsAudit[2], "required", false)
                console.log(this.formoptionsAudit[2]);
            } else {
                this.$set(this.formoptionsAudit[2], "disabled", false);
                this.$set(this.formoptionsAudit[2], "required", true)
            }
        })

    }
    private detailsId: any; //单选
    private detailsIds: any; //多选
    private refusedReason: any; //audit 内 历史提交记录
    private relatedContract: string = "";
    private priority: any = "";
    public prouccDatiletias(selectedRows: any) {
        console.log(selectedRows);
        this.$set(
            this,
            "relatedContract",
            selectedRows.length ? selectedRows[0].relatedContract : ""
        );
        this.$set(
            this,
            "priority",
            selectedRows.length && selectedRows[0].priority == 10 ? "Low" : "High"
        );
        this.$set(this.Formscreening[1], "disabled", selectedRows.length !== 1);
        this.$set(this.Formscreening[5], "disabled", selectedRows.length !== 1);
        this.$set(this.Formscreening[6], "disabled", selectedRows.length !== 1);
        console.log(this.relatedContract);
        if (selectedRows.length === 1) {
            this.detailsId = selectedRows[0].id;
            if (
                selectedRows[0].contractType == 1 ||
                selectedRows[0].contractType == 3
            ) {
                this.$set(this.Formscreening[3], "disabled", selectedRows.length !== 1);
                this.formoptionsSubmit[0].initialValue = selectedRows[0].contractName;
                AxiosGet("/config/droplist/managers").then(res => {
                    this.formoptionsSubmit[1].options = res.data;
                });
            }
            if (selectedRows[0].contractType == 2) {
                console.log(selectedRows[0].refusedReason);

                this.refusedReason = selectedRows[0].refusedReason ?
                    selectedRows[0].refusedReason
                    .replace(/\n/g, "<br>")
                    .replace("undefined", "") :
                    "";
                this.$set(this.Formscreening[4], "disabled", selectedRows.length !== 1);
                this.formoptionsAudit[0].options = [selectedRows[0].contractName];
                this.formoptionsAudit[0].initialValue = selectedRows[0].contractName;
                this.formoptionsAudit[1].initialValue = "Yes";
                this.AuditChange("Approved", "Yes");
                this.$set(this.Formscreening[2], "disabled", true);
            }
            // if (
            //     selectedRows[0].operatingState == 3 ||
            //     selectedRows[0].contractType == 2
            // ) {
            //     this.$set(this.Formscreening[2], "disabled", true);
            // } else {
            //     this.$set(this.Formscreening[2], "disabled", selectedRows.length !== 1);
            // }            
            if (selectedRows[0].contractType === 2) {
                return this.$set(this.Formscreening[1], "disabled", true);
            }
            if (selectedRows[0].contractType === 4 && (selectedRows[0].operatingState === 2 || selectedRows[0].operatingState === 3)) {
                this.$set(this.Formscreening[2], "disabled", true);
                this.$set(this.Formscreening[1], "disabled", true);
            } else {
                this.$set(this.Formscreening[2], "disabled", false);
                this.$set(this.Formscreening[1], "disabled", false);
            }
        } else {
            this.$set(this.Formscreening[3], "disabled", true);
            this.$set(this.Formscreening[4], "disabled", true);
            this.$set(this.Formscreening[2], "disabled", true);
        }
    }
    /* 点击切换页 分页(pagination) -> 回调 */
    public onChang(pageSize: number) {
        // console.log(pageSize)
    }
    /* Add 选项卡 */
    public activeAdd(tab: any, item: any) {
        // console.log(tab,item);

        this.activeInAdd = tab;
        this.activeSelectAdd = item;
    }
    public switchCheck(RateStructure: string, productData: any) {
        let that: any = this
        let isCheckStatus: boolean = true
        switch (RateStructure) {
            case "Tier":
                if (that.checkTier && !that.checkTier(productData)) isCheckStatus = false
                break;
            case "Flat":
                if (that.checkFlat && !that.checkFlat(productData)) isCheckStatus = false
                break;
            case "Interval":
                if (that.checkInterVal && !that.checkInterVal(productData)) isCheckStatus = false
                break;
            case "OneTimeCharge":
                if (that.checkOneTime && !that.checkOneTime(productData)) isCheckStatus = false
                break;
            case "RecurringCharge":
                if (that.checkRecuuing && !that.checkRecuuing(productData)) isCheckStatus = false
                break;
            case "Penalty":
                break;
            case "Cap":
                break;
            case "Discount":
                break;
        }
        return isCheckStatus
    }
    public async succesAxios(values: any) {
        let isCheckStatus: boolean = false
        let codeData: any = {
            accountName: this.ContractObject.accountName,
            contractCycleBOList: []
        }
        values.forEach((elem: any, index: number) => {
            codeData.contractCycleBOList.push({
                direction: elem.direction,
                cycleName: elem.cycleName,
                configServiceName: elem.configServiceName,
                beginDate: moment(elem.beginDate).format('YYYY-MM-DD'),
                endDate: moment(elem.endDate).format('YYYY-MM-DD')
            })
        });
        await AxiosPost('/contract/vc-contract/cycles/check', codeData).then((res: any) => {
            if (res.code < 0) {
                isCheckStatus = false
                return this.$error({
                    title: 'Cycle name already exists',
                    content: res.msg
                })
            } else {
                isCheckStatus = true
            }
        })
        console.log('isCheckStatus', isCheckStatus);

        return isCheckStatus
    }
    /* Add 校验 */
    public checkAdd(item: any, planArr: any) {
        let that: any = this
        let isCheckStatus: boolean = true
        let product = planArr[this.productIndex]
        let process = this.prossData
        let ischeckDetails: boolean = true
        let isService: boolean = true
        let isCycle: boolean = true
        // let stateData = Object.keys(process).length >= 1 ? process[product['typeName'] + product['productKey']] : undefined
        console.log('product', product);

        if (that.checkDetails && !that.checkDetails()) return ischeckDetails = false, isCheckStatus = false
        if (that.checkService && !that.checkService()) return isService = false, isCheckStatus = false
        if (that.checkCycle && !that.checkCycle()) return isCycle = false, isCheckStatus = false

        // if (!stateData) return isCheckStatus
        /* 校验product 处理 start */
        // if (stateData && isCycle && isService && ischeckDetails) {
        //     isCheckStatus = this.switchCheck(product['RateStructure'], stateData && stateData.productData || {})
        // }

        if (isCheckStatus && isCycle && isService && ischeckDetails) {
            for (let i = 0; i < planArr.length; i++) {
                const elem = planArr[i];
                // if (stateData !== process[elem['typeName'] + elem['productKey']]) {
                if (!process[elem['typeName'] + elem['productKey']] || !process[elem['typeName'] + elem['productKey']].productData) {
                    // cycle 修改了和保存数据的名字后  找之前key保存的数据
                    const typeNameProduct = Object.keys(this.prossData).find((productItem: any) => productItem.indexOf(elem.productKey) > -1)
                    if (!typeNameProduct || !this.prossData[typeNameProduct] || !this.prossData[typeNameProduct].productData) {
                        // 校验是否有product 去掉因为修改了detail cycle数据后 typename和保存数据的名字变了  我用productkey匹配取之前存的数据
                        // 解决 rateplan 插入或复制 然后没有进对应product 无数据bug
                        if (!product.productData) {
                            this.$error({
                                title: 'Incomplete Product information entry',
                                content: elem['typeName'] + ' is not complete'
                            });
                            return isCheckStatus = false
                        }
                        isCheckStatus = product.productData && this.switchCheck(elem['RateStructure'], product.productData)
                        if (isCheckStatus) continue
                        if (!isCheckStatus) break
                    }
                    isCheckStatus = !!typeNameProduct && this.switchCheck(elem['RateStructure'], process[typeNameProduct].productData)
                    if (isCheckStatus) continue
                    if (!isCheckStatus) break
                }
                // console.log('i' + i);
                isCheckStatus = this.switchCheck(elem['RateStructure'], process[elem['typeName'] + elem['productKey']].productData)
                // console.log(elem);
                // }
                // if (isCheckStatus) continue
                if (!isCheckStatus) break
            }
        }
        /* 校验product 处理 end */
        return isCheckStatus
    }
    /* edit 校验 */
    public checkEdit(ra: any[]) {
        let that: any = this
        let isCheckStatus: boolean = true
        let process = this.prossData
        let ischeckDetails: boolean = true
        let isService: boolean = true
        let isCycle: boolean = true
        let ratePlanArr = !this.editProductData[0] ? this.editProductData : ra
        // let editProductData = this.editProductData[0] ? this.editProductData : ratePlanArr
        console.log('ratePlanArr',ratePlanArr);
        
        if (that.checkDetails && !that.checkDetails()) return ischeckDetails = false, isCheckStatus = false
        if (that.checkService && !that.checkService()) return isService = false, isCheckStatus = false
        if (that.checkCycle && !that.checkCycle()) return isCycle = false, isCheckStatus = false
        for (let i = 0; i < ratePlanArr.length; i++) {
            const elem = ratePlanArr[i];
            // let rateStructure = !elem.rateStructure === typeof elem.rateStructure === 'number' ? this.componentArr[elem.rateStructure - 1] : elem.RateStructure
            let rateStructure = !elem.rateStructure && elem.RateStructure ? elem.RateStructure : this.componentArr[elem.rateStructure - 1]
            console.log('rateStructure', rateStructure);
            console.log('elem', elem);
            let data = this.prossData[elem.typeName + elem.productKey]
            if (data) {
                console.log('tabs-1115', elem);
                elem.productData = data.productData
                console.log('data', data);
            }
            if (!elem.productData && !elem.ratingZoneList) {
                this.$error({
                    title: `Incomplete Product information entry`,
                    content: (elem.productName || elem.typeName) + ' is not complete'
                })
                return isCheckStatus = false
            }
            isCheckStatus = this.switchCheck(rateStructure, elem.productData || elem)
            if (isCheckStatus) continue
            if (!isCheckStatus) break
        }
        /* 校验product 处理 end */
        return isCheckStatus
    }
    /**Edit 选项卡 */
    public activeEdit(tab: any, item: any) {
        // console.log(tab,item);
        this.activeInEdit = tab;
        this.activeSelectEdit = item;
    }
    public created() {
        AxiosGet("/config/droplist/accounts").then((res: any) => {
            this.formOptions[0]["options"] = res.data;
        });
        AxiosGet("/config/droplist/contracts").then((res: any) => {
            this.formOptions[2]["options"] = res.data;
        });
        AxiosGet("/config/droplist/services").then((res: any) => {
            this.formOptions[3]["options"] = res.data;
        });
        AxiosGet("/config/droplist/managers").then((res: any) => {
            this.formOptions[7]["options"] = res.data;
        });
    }
    // 合同新增 数据
    private getRatePlanArr(): any {
        let ratePlanArr: any = [];
        for (let i = 0; i < this.ratePlanObject.length; i++) {
            const element = this.ratePlanObject[i];
            for (let index = 0; index < element.tabs.length; index++) {
                ratePlanArr.push(element.tabs[index]);
            }
        }
        return ratePlanArr
    }
    // 合同编辑数据
    public getEditPlanData(assignmentData ? : any) {
        let ratePlanArr: any = []
        let ratePlan = this.editData.ratePlanList
        // 如果plan添加的
        if (this.ratePlanObject.length) {
            let plan = this.ratePlanObject
            for (let index = 0; index < plan.length; index++) {
                const element = plan[index];
                for (let j = 0; j < element.tabs.length; j++) {
                    const elem = element.tabs[j];
                    if (elem.productData && Object.keys(elem.productData).length >= 6) {
                        ratePlanArr.push(elem)
                    } else {
                        ratePlanArr.push(elem)
                    }
                }
            }
        } else {
            console.log(this.editProductData);

            // 直接进入product修改的
            for (let index = 0; index < ratePlan.length; index++) {
                const element = ratePlan[index];
                ratePlanArr = ratePlanArr.concat(element.productList)
            }
        }
        return ratePlanArr
    }

    /* 获取新增合同所有数据 */
    public async addAllData(key: number) {
        let ratePlanArr: any = this.getRatePlanArr()
        // 解决页面修改数据后没有切换 不能保存数据
        let that: any = this;
        let isAgainSave: boolean = false;
        let isReturn: boolean = false;
        let isService = true
        let isCycle = true
        console.log(this.activeSelectAdd);
        console.log('this', this);

        switch (this.activeSelectAdd) {
            case "contractDetials":
                that.setDetails && that.setDetails();
                // that.getService && await that.getService();
                // that.getCycle && await that.getCycle();
                break;
            case "service":
                that.getService && await that.getService();
                // that.getCycle && await that.getCycle();
                break;
            case "cycle":
                that.getCycle && await that.getCycle(true);
                break;
            case "ratePlan":
                // that.getRatePlan && that.getRatePlan()
                break;
            case "product":
                switch (ratePlanArr[this.productIndex].RateStructure) {
                    case "Tier":
                        that.getTier && await that.getTier();
                        break;
                    case "Flat":
                        that.getFlat && await that.getFlat();
                        break;
                    case "Interval":
                        that.getInterval && await that.getInterval();
                        break;
                    case "OneTimeCharge":
                        that.getOnetimeCharge && await that.getOnetimeCharge();
                        break;
                    case "RecurringCharge":
                        that.getRecurringCharge && await that.getRecurringCharge();
                        break;
                    case "Penalty":
                        break;
                    case "Cap":
                        break;
                    case "Discount":
                        break;
                }
                break;
        }
        // 保存完当前显示页数据 才去执行同步数据  主要解决cycle 同步 修改名称
        that.getRatePlan && await that.getRatePlan()
        const Ratestructre: string[] = ['flat', 'tier', 'interval', 'recurringcharge', 'onetimecharge', 'penalty', 'cap', 'discount'];
        /* 校验结构 */
        setTimeout(async () => {
            // 重新获取新的 ratePlan 数据
            ratePlanArr = this.getRatePlanArr()
            let ratePlan = this.ratePlanObject;
            let tabsArr: any = []
            // console.log('ratePlan', ratePlan);
            let {
                contractDetail,
                cycleList,
                serviceList
            } = this.contractData;
            let prossData: any = this.prossData;
            let list: any = {
                ratePlanList: [],
                contractDetail,
                cycleList,
                serviceList
            };
            for (let i = 0; i < ratePlan.length; i++) {
                const element = deepClone(ratePlan[i]);
                list.ratePlanList.push({
                    ratePlanName: element.ratePlanName,
                    productList: []
                });

                const commitmentBeginDate = moment(element.BeginDate)
                const commitmentEndDate = moment(element.EndDate)
                for (let j = 0; j < element.tabs.length; j++) {
                    const elem: any = element.tabs[j];
                    let data: any = prossData[elem.typeName + elem.productKey];
                    console.log(data);
                    console.log('elem', elem);
                    if (!data) {
                        // cycle 修改了和保存数据的名字后  找之前key保存的数据
                        const typeNameProduct = Object.keys(prossData).find((item: any) => item.indexOf('' + elem.productKey) > -1)
                        data = typeNameProduct && prossData[typeNameProduct] || undefined
                    }

                    // 解决 rateplan 插入或复制 然后没有进对应product 无数据bug
                    // 并且解决承诺时间不对问题 循环结构需要特殊处理
                    if (!data && elem.productData) {
                        console.log('elem.rateStructure', elem.RateStructure);
                        if (Number.isNaN(+elem.RateStructure) && Ratestructre.indexOf(elem.RateStructure.toLowerCase()) > -1) {
                            elem.RateStructure = Ratestructre.indexOf(elem.RateStructure.toLowerCase()) + 1
                        }
                        if (elem.RateStructure == 1 || elem.RateStructure == 2 || elem.RateStructure == 3) {
                            if (elem.productData.isCommitment == 1) {
                                elem.productData.commitmentBeginDate = commitmentBeginDate.format('YYYY-MM-DD')
                                elem.productData.commitmentEndDate = commitmentEndDate.format('YYYY-MM-DD')
                            } else {
                                delete elem.productData.commitmentBeginDate
                                delete elem.productData.commitmentEndDate
                            }
                        } else if (elem.RateStructure == 4) {
                            const dateArr = this.getCommitDateArr(elem.productData.dimensionCount, elem.productData.recurringDimension, commitmentBeginDate, commitmentEndDate)
                            console.log('dateArr', dateArr);
                            if (dateArr.length > elem.productData.ratingZoneList.length && elem.productData.isSameTariff !== 1) {
                                this.$error({
                                    title: 'Incomplete Product information entry',
                                    content: elem['typeName'] + ' is not complete'
                                });
                                return isReturn = true
                            }
                            // 修改承诺时间
                            const ratingZoneList = elem.productData.ratingZoneList
                            ratingZoneList.length && dateArr.forEach((dateItem: any, dateIndex: number) => {
                                if (ratingZoneList.length - 1 > dateIndex) {
                                    ratingZoneList.push(deepClone(ratingZoneList[0]))
                                }
                                ratingZoneList[dateIndex].beginDate = dateArr[dateIndex].start_month
                                ratingZoneList[dateIndex].endDate = dateArr[dateIndex].endDate
                            })
                        }
                        data = elem
                    }

                    data && data.productData.ratingZoneList && data.productData.ratingZoneList.forEach((element: any) => {
                        element.ratingDetailList && element.ratingDetailList.forEach((elemItem: any) => {
                            if (elem.RateStructure === 'Interval') elemItem.intervalThreshold = elemItem.intervalThreshold && elemItem.intervalThreshold === '+∞' ? null : +elemItem.intervalThreshold || undefined
                            if (elem.RateStructure === 'Tier') elemItem.tierTo = elemItem.tierTo && elemItem.tierTo === '+∞' ? null : +elemItem.tierTo || undefined
                        });
                    });
                    if (data && data.productData) {
                        let productData: any = deepClone(data.productData)
                        // 修改cycle名称同步修改productName
                        // 如果ratePlanName和productName不同 以ratePlanObject的typeName为主
                        productData.productName = elem.typeName
                        tabsArr.push(productData)
                        list.ratePlanList[i]["productList"].push(productData);
                    }
                }
            }
            let di = ['Inbound', 'Outbound', 'Bilateral']
            /* 处理cycle 保存 不进入plan */
            if (!list.ratePlanList.length && list.cycleList) {
                for (let index = 0; index < list.cycleList.length; index++) {
                    const element = list.cycleList[index];
                    list.ratePlanList.push({
                        ratePlanName: `${list.contractDetail.accountName}-${element.configServiceName}-${di[element.direction-1]}-${element.cycleName}`,
                        productList: []
                    });
                }
            }
            console.log('(isReturn || ratePlanArr.length)',isReturn , ratePlanArr.length);
            console.log((isReturn || ratePlanArr.length) && this.prossData);
            if (!(isReturn || ratePlanArr.length) && this.prossData) {
                if (that.checkDetails && !that.checkDetails()) return 
                if (that.checkService && !that.checkService()) return 
                if (that.checkCycle && !that.checkCycle()) return 
            }
            if ((isReturn || ratePlanArr.length) && this.prossData && !this.checkAdd(this.prossData, ratePlanArr)) {
                console.log('return-1344')
                return
            }
            if (key === 1 && list.cycleList && await this.succesAxios(list.cycleList)) {
                isAgainSave = true
            }
            if ((!isAgainSave && key === 1) || !list.ratePlanList.length) {
                return;
            }
            console.log('list-1172 contract-data', list);

            if (process.env.NODE_ENV !== 'production' && this.$route.query.return == '1') {
                return
            }
            /* 1 合同保存 2 编辑保存 */
            let axiosThen = key === 1 ? AxiosPost("/contract/vc-contract", list) : AxiosPut("/contract/vc-contract", list)
            axiosThen.then((res: any) => {
                if (res.code > 0) {
                    // 清楚数据
                    this.$message.success(res.msg);
                    this.Screencover(1);
                    this.SearchOk((this.$refs.AdvancedSearch as any).getFieldsValue())
                } else {
                    this.$error({
                        title: 'Background check failed',
                        content: res.msg
                    });
                }
            });
        }, 300);
    }
    /* 编辑合同所有数据 */
    public async editProduct(key: number) {
        let that: any = this
        let ratePlanArr: any = this.getEditPlanData()
        console.log('ratePlanArr', ratePlanArr);
        // if (!ratePlanArr[0]) {
        //     return this.$message.warning('No product data');
        // }
        console.log(this.activeSelectEdit);
        let di = ['Inbound', 'Outbound', 'Bilateral']
        let rate = ratePlanArr[this.productIndex]
        let rateStructure: string = ''
        if (!rate['rateStructure'] && rate['RateStructure']) {
            rateStructure = rate['RateStructure']
        } else if (rate['rateStructure']) {
            rateStructure = this.componentArr[rate.rateStructure - 1]
        }
        console.log('rateStructure', rateStructure);

        // let rateStructure = !rate['rateStructure'] ? undefined : typeof rate.rateStructure === 'number' ? this.componentArr[rate.rateStructure - 1] : rate.RateStructure
        console.log('RateStructure', rateStructure);
        switch (this.activeSelectEdit) {
            case "contractDetailEdit":
                that.setDetails && that.setDetails();
                break;
            case "serviceEdit":
                that.getService && await that.getService();
                break;
            case "cycleEdit":
                that.getCycle && await that.getCycle(true);
                break;
            case "ratePlanEdit":
                // that.getRatePlan && that.getRatePlan()
                break;
            case "productEdit":
                switch (rateStructure) {
                    case "Tier":
                        that.getTier && await that.getTier();
                        break;
                    case "Flat":
                        that.getFlat && await that.getFlat();
                        break;
                    case "Interval":
                        that.getInterval && await that.getInterval();
                        break;
                    case "OneTimeCharge":
                        that.getOnetimeCharge && await that.getOnetimeCharge();
                        break;
                    case "RecurringCharge":
                        that.getRecurringCharge && await that.getRecurringCharge();
                        break;
                    case "Penalty":
                        break;
                    case "Cap":
                        break;
                    case "Discount":
                        break;
                }
                break;
        }
        setTimeout(() => {
            if (!this.checkEdit(ratePlanArr)) return console.log('edit-1396-check-error');
            let list = deepClone(this.editData)
            let newList: any = {
                contractDetail: list.contractDetail,
                cycleList: list.cycleList,
                ratePlanList: [],
                serviceList: list.serviceList
            }
            // 直接编辑product数据
            if (!this.ratePlanObject.length) {
                let rateStructure = ''
                let ratingZoneList = []
                let editDataKey: number = -1;

                let editProductData = this.editProductData[0] ? this.editProductData : ratePlanArr
                console.log('editProductData', editProductData);
                for (let index = 0; index < list.ratePlanList.length; index++) {
                    const element = list.ratePlanList[index];
                    newList.ratePlanList.push(deepClone(element))
                    newList.ratePlanList[index]['productList'] = []
                    for (let i = 0; i < element.productList.length; i++) {
                        editDataKey += 1
                        const item = element.productList[i];
                        console.log('item', item);

                        let newItem = deepClone(editProductData[editDataKey]);
                        console.log('newItem', newItem);

                        if (!Object.keys(newItem).length || !newItem.productData) {
                            rateStructure = this.componentArr[item.rateStructure - 1]
                            ratingZoneList = item.ratingZoneList
                        } else {
                            rateStructure = this.componentArr[newItem.productData.rateStructure - 1]
                            ratingZoneList = newItem.productData.ratingZoneList
                        }
                        ratingZoneList.forEach((element: any) => {
                            element.ratingDetailList && element.ratingDetailList.forEach(ratiList => {
                                if (rateStructure === 'Interval') {
                                    ratiList.intervalThreshold = ratiList.intervalThreshold && ratiList.intervalThreshold === '+∞' ? null : +ratiList.intervalThreshold || undefined
                                }
                                if (rateStructure === 'Tier') {
                                    if (ratiList.tierTo) {
                                        ratiList.tierTo
                                    }
                                    ratiList.tierTo = ratiList.tierTo && ratiList.tierTo === '+∞' ? null : +ratiList.tierTo || undefined
                                }
                            });
                        });
                        console.log('this.editProductData', this.editProductData);

                        if (item.productName && newItem.typeName && this.editProductData[0]) {
                            console.log('编辑过product');
                            newList.ratePlanList[index]['productList'].push(newItem.productData)
                        } else if (item.productName === newItem.productName && !newItem.typeName && ratePlanArr[0]) {
                            console.log('没编辑过product');

                            newList.ratePlanList[index]['productList'].push(item)
                        }
                    }
                }
            } else {
                for (let u = 0; u < this.ratePlanObject.length; u++) {
                    const element = this.ratePlanObject[u];
                    let direction = typeof element.direction === 'string' ? element.direction : di[element.direction - 1];
                    newList.ratePlanList.push({
                        productList: [],
                        ratePlanName: `${element.Account}-${element.configServiceName}-${direction}-${element.cycleName}`
                    })
                    for (let i = 0; i < element.tabs.length; i++) {
                        const item = element.tabs[i];
                        let data = this.prossData[item.typeName + item.productKey];
                        if (!data && item.productData) {
                            newList.ratePlanList[u]['productList'].push(deepClone(item.productData))
                        } else {
                            newList.ratePlanList[u]['productList'].push(deepClone(data.productData))
                        }
                        newList.ratePlanList[u]['productList'].forEach(element => {
                            let rateStructure = this.componentArr[element.rateStructure - 1]
                            element.ratingZoneList.forEach(el => {
                                el.ratingDetailList && el.ratingDetailList.forEach(ratiList => {
                                    if (rateStructure === 'Interval') {

                                        ratiList.intervalThreshold = ratiList.intervalThreshold && ratiList.intervalThreshold === '+∞' ? null : +ratiList.intervalThreshold || undefined
                                    }
                                    if (rateStructure === 'Tier') {

                                        ratiList.tierTo = ratiList.tierTo && ratiList.tierTo === '+∞' ? null : +ratiList.tierTo || undefined
                                    }
                                });
                            });
                        });
                    }
                }
            }
            console.log('this.editProductData', this.editProductData);

            console.log('newList', newList);
            console.log('list', list);

            AxiosPut("/contract/vc-contract", newList).then((res: any) => {
                if (res.code > 0) {
                    // 清楚数据
                    this.$message.success(res.msg);
                    this.Screencover();
                    this.SearchOk((this.$refs.AdvancedSearch as any).getFieldsValue())
                } else {
                    this.$error({
                        title: 'Background check failed',
                        content: res.msg
                    });
                }
            });
        }, 300);
    }
    /** Submit contract 保存数*/
    public saveContract() {
        const value: any = (this.$refs.formGroup as any).validateFields();
        if (value) {
            let subTime = new Date().getTime();
            let rcvTime = new Date(value.ExpectedDate._d).getTime();
            let lestTime = new Date(value.LatestDate._d).getTime();
            if (subTime > rcvTime) {
                this.$message.warning(`The Expected Date entered cannot be less than the operation time`);
                return;
            } else if (lestTime < rcvTime) {
                alert(`The Expected Date entered cannot be greater than the latest time`);
                return;
            } else {
                let data: any = {
                    approvedBy: value.ApprovedBy,
                    expectedDate: moment(value.ExpectedDate._d).format("YYYY-MM-DD"),
                    idList: [this.detailsId]
                };
                let url = `/contract/vc-contract/submission`;
                AxiosPatch(url, data).then((res: any) => {
                    console.log(res);
                    if (res.code < 0) {
                        alert(`Operation failed `);
                    } else {
                        this.SearchOk((this.$refs.AdvancedSearch as any).getFieldsValue());
                        this.Screencover();
                    }
                });
            }
        }
    }
    /**Audit contract 保存数据 */
    public saveAudit() {
        this.formAudit.validateFields((err: any, values: any) => {
            if (!err) {
                let url = `/contract/vc-contract/auditing`;
                console.log("Received values of form: ", values);
                let data: any = {
                    contractName: values.Contract,
                    id: this.detailsId,
                    isApproved: values.Approved == "Yes" ? 1 : 0,
                    refusedReason: `${values.Reason||''}<br>${this.refusedReason || ''}`
                };
                AxiosPatch(url, data).then((res: any) => {
                    console.log(res);
                    if (res.code > 0) {
                        this.SearchOk((this.$refs.AdvancedSearch as any).getFieldsValue());
                        this.Screencover();
                    } else {
                        this.$message.error(res.msg)
                    }
                });
            }
        });
    }
    private visible: any = false;
    private addEdit: any = {};
    /* 操作栏点击 -> 回调 */
    public async activeClick({
            name,
            index
        }: any,
        selected: any,
        selectedData: any
    ) {
        let isReturn: boolean = false
        this.mutioncontractIndex(index)
        // console.log(index);
        // console.log(this.detailsId);
        // console.log(this.visible);
        /*addEdit 模态框弹出*/
        if (index == 2 && this.detailsId) {
            this.activeIndex = 2;
            let url = `/contract/vc-contract/editor/${this.detailsId}`;
            await AxiosGet(url).then((response: any) => {
                if (response.code > 0) {
                    this.addEdit = response.data;
                    //后台没传key 值过来，自己加
                    this.addEdit.ratePlanList && this.addEdit.ratePlanList.forEach((item: any, i: number) => {
                        item.key = i;
                    });
                } else {
                    this.$message.error(response.msg);
                    isReturn = true
                }

            });
            !isReturn && this.mutioncontractData(this.addEdit)
        }
        /**Delete */
        if (index == 3 && this.detailsId) {
            this.activeIndex = 3;
            let url = `/contract/vc-contract/${this.detailsId}${!this.relatedContract?'':'?confirm=1'}`;
            //   `The related contract information (${this.relatedContract} / Priority:${this.priority})
            //   will  be changed after deletion， Please confirm whether to delete.`
            let _this = this;
            this.$confirm({
                title: "Confirm!",
                content: `Are you sure to delete the data?`,
                okText: "YES",
                cancelText: "NO",
                onOk() {
                    AxiosDelete(url).then((res: any) => {
                        if (res.code > 0) {
                            _this.$message.success("Data has been deleted successfully");
                            _this.SearchOk((_this.$refs.AdvancedSearch as any).getFieldsValue())
                        }
                        _this.visible = false;
                    });
                },
                onCancel() {
                    _this.visible = false;
                }
            });
        }
        /*submit 模态框弹出*/
        if (index == 4 && this.detailsId) {
            this.activeIndex = 4;
            let url = `/contract/vc-contract/editor/${this.detailsId}`;
        }
        /*Audit 模态框弹出*/
        if (index == 5 && this.detailsId) {
            this.activeIndex = 5;
        }
        /*details 模态框弹出*/
        if (index == 6 && this.detailsId) {
            // let id = this.detailsId[0].id
            let url = `/contract/vc-contract/content/${this.detailsId}`;
            // console.log(id);
            await AxiosGet(url).then((response: any) => {
                this.detailResMsgAdd = response;
                let ratePlanList = this.detailResMsgAdd.data.ratePlanList;
                let productName: any = [];
                for (var i = 0; i < ratePlanList.length; i++) {
                    let items = ratePlanList[i];
                    console.log(items.productList);
                    items.productList.map((item: any, index: number) => {
                        productName.push(Object.assign({}, item));
                        return productName;
                    });
                }
                this.productName = productName;
            });
        }
        if (index == 7) {
            this.$message.loading('loading')
            downloadLocalFiles("file/CMCC_201901_additional__VC_Contract.xlsx", 'CMCC_201901_additional__VC_Contract.xlsx');
        }
        this.activeIndex = index
        index !== 7 && !isReturn && (this.visible = !this.visible)
    }

    /* 退出清空合同全局事件 */
    public clearProduct() {
        console.log('clearProduct check func');
        delete Vue.prototype.checkDetails
        delete Vue.prototype.setDetails
        delete Vue.prototype.getService
        delete Vue.prototype.checkService
        delete Vue.prototype.checkCycle
        delete Vue.prototype.getCycle
        delete Vue.prototype.getTier
        delete Vue.prototype.checkTier
        delete Vue.prototype.getFlat
        delete Vue.prototype.checkFlat
        delete Vue.prototype.getInterVal
        delete Vue.prototype.checkInterVal
        delete Vue.prototype.getOneTime
        delete Vue.prototype.checkOneTime
        delete Vue.prototype.getRecuuing
        delete Vue.prototype.checkRecuuing
        // console.log('vue', Vue.prototype);
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

    private destroyed(): void {
        this.clearProduct()
        this.clearContractData();
    }

    /* 关闭 Add */
    public Screencover(msg ? : any) {
        this.closeModelFn('contract')
        this.visible = false;
        // if (process.env.NODE_ENV !== 'production') return
        this.activeSelectAdd = "contractDetials";
        this.activeSelectEdit = "contractDetailEdit";
        this.activeInAdd = 0
        this.activeInEdit = 0
        //清空vuex 关于合同新增的数据 因为离开页面会执行保存数据方法 所以叫延时
        setTimeout(() => {
            this.clearContractData();
            this.clearProduct()
            msg === 1 && AxiosGet("/config/droplist/accounts").then((res: any) => {
                this.formOptions[0]["options"] = res.data;
            });
        }, 900);
    }

    /* 生成dom数据*/ // 周期 dimensionCount  单位：recurringDimension
    public getCommitDateArr(dimensionCount: number, recurringDimension: number, beginDate: any, endinDate) {
        if (!dimensionCount) return
        let ratePlanArr: any = []
        const arr_month: any = []
        const begin: any = beginDate,
            endin: any = endinDate
        console.log('begin', begin);
        console.log('endin', endin);
        /* 求年份 */
        if (recurringDimension == 4) {
            let beginDate = moment(begin).format("YYYY")
            let endDate: any = moment(endin).format("YYYY")
            let beg = moment([Number(beginDate), 6]);
            let end = moment([Number(endDate), 7]);
            let value: any = dimensionCount
            let len = Math.ceil(end.diff(beg, 'years') / value)
            for (let i = 0; i < (len <= 0 ? 1 : len + 1); ++i) {
                arr_month.push({
                    month: `${i + 1} 年`,
                    start_month: moment(begin).format("YYYY-MM-DD"),
                    endDate: moment(begin).add(value, "year").add(-1, 'd').format("YYYY-MM-DD")
                })
                if (arr_month.length >= 2) {
                    arr_month[i]['start_month'] = moment(arr_month[i - 1]['endDate']).add(1, 'd').format("YYYY-MM-DD")
                    arr_month[i]['endDate'] = moment(arr_month[i - 1]['endDate']).add(value, "year").format("YYYY-MM-DD")
                }
                if (arr_month[i].endDate && moment(arr_month[i].endDate).format('YYYY-MM-DD') >= moment(endin).format('YYYY-MM-DD')) {
                    arr_month[i]['endDate'] = moment(endin).format('YYYY-MM-DD')
                    break
                }
            }
            /* 求月份 */
        } else if (recurringDimension == 3) {
            let beginDate = moment(begin)
            let endDate: any = moment(endin).endOf("d")
            let beg = moment(begin).format('YYYY')
            let MM = Number(moment(begin).format('MM'))
            let value: any = dimensionCount
            // //开始计算这两个时间段相差的月份
            const diff_times = endDate.diff(beginDate, "M");
            for (let i = 0; i < diff_times + 1; ++i) {
                arr_month.push({
                    month: `${i + 1} 月份`,
                    start_month: moment(beginDate).format("YYYY-MM-DD"),
                    endDate: moment(beginDate).add(value, "M").add(-1, 'd').format("YYYY-MM-DD")
                });
                if (arr_month.length >= 2) {
                    arr_month[i]['start_month'] = moment(arr_month[i - 1]['endDate']).add(1, 'd').format("YYYY-MM-DD")
                    arr_month[i]['endDate'] = moment(arr_month[i]['start_month']).add(value, "M").add(-1, 'd').format("YYYY/MM/DD")
                }
                if (arr_month[i].endDate && moment(arr_month[i].endDate).format('YYYY-MM-DD') >= moment(endin).format('YYYY-MM-DD') || moment(arr_month[i].endDate).format('YYYY-MM-DD') === moment(endin).format('YYYY-MM-DD')) {
                    arr_month[i]['endDate'] = moment(endin).format('YYYY-MM-DD')
                    break
                }
            }
            /* 求周 */
        } else if (recurringDimension == 2) {
            let beginDate = moment(begin)
            let endDate: any = moment(endin).endOf("d")
            let value: any = dimensionCount
            //开始计算这两个时间段相差的周
            const diff_times = endDate.diff(beginDate, "days");
            let len = Math.ceil(diff_times + 1 / 7)
            for (let i = 0; i < len; ++i) {
                if (arr_month.length >= 2 && moment(arr_month[i - 1]['endDate']).format('YYYY-MM-DD') >= moment(endin).format('YYYY-MM-DD')) {
                    arr_month[i - 1]['endDate'] = moment(endin).format('YYYY-MM-DD')
                    break
                }
                arr_month.push({
                    month: `${i + 1} 周`,
                    start_month: moment(beginDate).format('YYYY-MM-DD'),
                    endDate: moment(beginDate).add(7 * value - 1, 'days').endOf('days').format('YYYY-MM-DD')
                })
                if (arr_month.length >= 2) {
                    arr_month[i]['start_month'] = moment(arr_month[i - 1]['endDate']).add(1, "days").startOf('days').format("YYYY-MM-DD")
                    arr_month[i]['endDate'] = moment(arr_month[i - 1]['endDate']).add(7 * value, 'days').format("YYYY-MM-DD")
                }
                if (arr_month[i].endDate && moment(arr_month[i].endDate).format('YYYY-MM-DD') >= moment(endin).format('YYYY-MM-DD')) {
                    arr_month[i]['endDate'] = moment(endin).format('YYYY-MM-DD')
                    break
                }
            }
            /* 求天 */
        } else if (recurringDimension == 1) {
            let beginDate = moment(begin)
            let endDate: any = moment(endin).endOf("d")
            let beg = moment(begin).format('YYYY')
            let d = Number(moment(begin).format('d'))
            let value: any = dimensionCount
            //开始计算这两个时间段相差的天
            const diff_times = endDate.diff(beginDate, "days");
            let len = Math.ceil(diff_times / value)
            for (let i = 0; i < diff_times + 1; ++i) {
                if (arr_month.length >= 2 && moment(arr_month[i - 1]['endDate']).format('YYYY-MM-DD') >= moment(endin).format('YYYY-MM-DD')) {
                    arr_month[i - 1]['endDate'] = moment(endin).format('YYYY-MM-DD')
                    break
                }
                arr_month.push({
                    month: `${i + 1} 天`,
                    start_month: moment(begin).format("YYYY-MM-DD"),
                    endDate: moment(begin).add(value - 1, "days").endOf('days').format("YYYY-MM-DD")
                })
                if (arr_month.length >= 2) {
                    arr_month[i]['start_month'] = moment(arr_month[i - 1]['endDate']).add(1, "days").startOf('days').format("YYYY-MM-DD")
                    arr_month[i]['endDate'] = moment(arr_month[i - 1]['endDate']).add(value, "days").endOf('days').format("YYYY-MM-DD")
                }
                if (arr_month[i].endDate && moment(arr_month[i].endDate).format('YYYY-MM-DD') >= moment(endin).format('YYYY-MM-DD')) {
                    arr_month[i]['endDate'] = moment(endin).format('YYYY-MM-DD')
                    break
                }
            }
        }
        // console.log('arr_month', arr_month)
        return arr_month
    }

}
</script>

<style>
.refusedReasonStyle {
    border: 1px solid rgba(0, 0, 0, 0.25);
    background: rgb(245, 245, 245);
    border-radius: 5px;
    font-size: 1rem;
    font-family: sans-serif;
    padding-left: 40px;
    cursor: not-allowed;
    word-break: break-all;
    word-break: break-world;
}

.inner-form-group {
    /*overflow: hidden;*/
    padding: 24px;
    background: #fff;
    border-radius: 6px;
    /* box-shadow: 0px 2px 0px rgb(243, 243, 243); */
}

.inner-form-group .ant-form-item {
    display: flex;
}

.inner-form-group .ant-form-item-control-wrapper {
    flex: 1;
}

#components-form-group {
    max-width: none;
    border-radius: 4px;
    position: relative;
}

#components-form-group .ant-form-item-label {
    text-align: left;
    margin-right: 3px;
}

#components-form-group .inner-form-group .ant-form-item-label label {
    font-weight: 600;
    color: #000;
}

#components-form-group .ant-form-item-children .ant-calendar-picker {
    display: inline-block;
    width: 100%;
}
</style><style lang="scss" scoped>
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

.textarea.ant-input {
    max-width: none;
    width: 251%;
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
