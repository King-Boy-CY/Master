<template>
<div>
    <Advanced-search :formoptions="formOptions" :isChildName="true" allowClear @Submit="SearchOk" ref="AdvancedSearch" />
    <Table parentKey="id" :isFinance="true" :isNeedCheck="true" :selectedBtn="Formscreening" @onSelectClick="activeClick" :columns="columns" :data="data" zebraStripe @onSelectAll="onSelectAll" @onSelect="onSelect" />
    <!-- Add模态弹出框 -->
    <Model align-title="center" v-model="visible" v-if="activeIndex === 1 && visible" shade title="Add route class" @Screencover="Screencover">
        <template slot="model-body">
            <div class="top-content">
                <form-group :formoptions="baseInfoFormOptions" ref=baseInfoFormGroup />
            </div>
            <div class="qc" v-show="isRepetition">
                Duplicate name.
            </div>
        </template>
        <template slot="model-footer">
            <a-row>
                <a-col :span="24" :style="{ textAlign: 'center' }">
                    <div style="margin-top: 10px;">
                        <a-button type="primary" :style="{ borderRadius: '50px 50px 50px 50px' }" @click="addAllData">Save</a-button>
                        <a-button :style="{ marginLeft: '8px', color: '#1890ff', borderRadius: '50px 50px 50px 50px', border: '1px solid #1890ff', fontWeight: '600' }" @click="handleReruen(1)">Return</a-button>
                    </div>
                </a-col>
            </a-row>
        </template>
    </Model>

    <!-- Edit 模态弹出框 -->
    <Model align-title="center" v-model="visible" v-if="activeIndex === 2 && visible" shade title="Edit route class" @Screencover="Screencover">
        <template slot="model-body">
            <div class="top-content">
                <form-group :formoptions="EditbaseInfoFormOptions" ref=baseInfoFormGroup />
            </div>
        </template>
        <template slot="model-footer">
            <a-row>
                <a-col :span="24" :style="{ textAlign: 'center' }">
                    <div style="margin-top: 10px;">
                        <a-button type="primary" :style="{ borderRadius: '50px 50px 50px 50px' }" @click="EditAllData">Save</a-button>
                        <a-button :style="{ marginLeft: '8px', color: '#1890ff', borderRadius: '50px 50px 50px 50px', border: '1px solid #1890ff', fontWeight: '600' }" @click="handleReruen(1)">Return</a-button>
                    </div>
                </a-col>
            </a-row>
        </template>
    </Model>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import {
    Component
} from "vue-property-decorator";
import {
    AxiosPost,
    AxiosDelete,
    AxiosPut
} from "@/api/axios"
import {
    RouteClassSearch,
    RouteClassAdd,
    RouteClassEdit,
    RouteClassList
} from "@/api/index"
import {
    formOptions,
    formscreening,
    columns,
    baseInfoFormOptions,
    editbaseInfoFormOptions,
} from "./RouteClassList"
import {
    FormOptions,
    Columns,
    BaseInfoFormOptions,
    Formscreening
} from "./RouteClassVerify"
import {
    refsConfig
} from "@/assets/ts/config.d"
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

@Component({
    components: {
        AdvancedSearch: resolve => require(["@/common/Advancedsearch/index.vue"], resolve),
        Table: () => import("@/views/Finance/components/Table/index.vue"),
        Model: resolve => require(["@/common/Model/index.vue"], resolve),
        formGroup: () => import("@/views/Finance/components/form-group/index.vue"),
    }
})

export default class RouteClass extends Vue {
    private detailsId: any;
    /**效验Name是否重复 */
    private isRepetition: boolean = false;
    public $refs: refsConfig | any;
    /* 高级搜索 */
    private formOptions: any['Array'] = formOptions;
    /* 表格 */
    private activeIndex: number = 0;
    private visible: any = false;
    private data: any[] = [];
    private Formscreening: Formscreening['Array'] = formscreening;
    private columns: Columns['Array'] = columns;
    /* add属性 */
    private baseInfoFormOptions: BaseInfoFormOptions['Array'] = baseInfoFormOptions;
    /* Edit属性 */
    private EditbaseInfoFormOptions: BaseInfoFormOptions['Array'] = editbaseInfoFormOptions;
    /* 方法 */

    /* 用户手动选择/取消选择所有列的回调  Table -> 回调 */
    public onSelectAll(selected: any, selectedRows: any, changeRows: any) {
        this.changeDisable(selectedRows);
    }
    /* 用户手动选择/取消选择某列的回调 */
    public onSelect(record: object, selected: boolean, selectedRows: any) {
        this.changeDisable(selectedRows);
    }
    /* 修改按钮可否点击 */
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

    /* 搜索 */
    public async SearchOk(values ? : any) {
        let data: any = {
            params: Object.assign({}, values, {
                routeClassName: values.routeClassName || undefined
            })
        };
        await RouteClassSearch(data).then((res: any) => {
            this.data = res.data
        })
        this.data.map((item: any, index: number) => {
            if (item.status === 1) {
                item.status = 'Active'
            } else if (item.status === 2) {
                item.status = 'Invalid'
            }
        })
    }

    /* 操作栏点击 -> 回调 */
    private routeClassId: any;
    private relatedContract: any = undefined;
    public async activeClick({
            name,
            index
        }: any,
        selected: any,
        selectedData: any,
        activeObJ: any
    ) {
        // console.log(index);
        // console.log(this.detailsId);
        // console.log(this.visible);
        /*Edit 模态框弹出*/
        const deleted = selectedData.map((item: any) => item.id).join(",")
        if (index == 2) {
            this.routeClassId = selectedData[0].id
            this.activeIndex = 2;
            this.EditbaseInfoFormOptions[0].initialValue = selectedData[0].routeClassName
            this.EditbaseInfoFormOptions[0].disabled = true
            this.EditbaseInfoFormOptions[1].initialValue = selectedData[0].status
            this.EditbaseInfoFormOptions[2].initialValue = selectedData[0].description
            this.EditbaseInfoFormOptions[3].initialValue = selectedData[0].remark
            // console.log(selectedData[0].status)
        }
        /**Delete */
        if (index == 3) {
            this.activeIndex = 3;
            let url = `/config/route-class/${deleted}`
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
        /**Export */
        if (index == 7) {
            this.$message.loading('loading')
            this.activeIndex = 7;
            if (activeObJ === undefined) {
                // Export
                // this.toExport(selectedData, undefined, selected)
                onSelectClick(this.columns,this.data,`RouteClass`,"RouteClass")
            }
        }
        this.activeIndex = index
        index !== 7 && (this.visible = !this.visible)
    };
    /* 退出 */
    public handleReruen(msg: any) {
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
    };

    /* 获取Add的所有参数 */
    public async addAllData(values: any) {
        let that: any = this;
        const baseInfoFormGroup: any = this.$refs.baseInfoFormGroup;
        let data: any = baseInfoFormGroup.validateFields();
        if (baseInfoFormGroup.validateFields()) {
            let sendSavaData = {
                "description": data.description,
                "remark": data.remark,
                "routeClassName": data.routeClassName,
                "status": data.status
            }
            // console.log(sendSavaData)
            for (let i = 0; i < this.formOptions[0].options.length; i++) {
                // console.log(this.formOptions[0].options[i])
                if (this.formOptions[0].options[i] == sendSavaData.routeClassName) {
                    return this.isRepetition = true
                } else {
                    this.isRepetition = false
                }
            }
            if (!this.isRepetition) {
                let url = `/config/route-class?routeClassName=${sendSavaData.routeClassName}&description=${sendSavaData.description == "undefined"? " " : sendSavaData.description}&status=${sendSavaData.status}&remark=${sendSavaData.remark == "undefined"? " " : sendSavaData.remark}`
                // console.log(url)
                AxiosPost(url).then((res: any) => {
                    // console.log(res.data)
                    if (res.code >= 1) {
                        this.visible = !this.visible;
                        that.$message.success("Successful addition");
                        this.SearchOk((this.$refs.AdvancedSearch as any).getFieldsValue());
                        RouteClassList('').then((res: any) => {
                            this.formOptions[0]['options'] = res.data
                        })
                    }
                    if (res.code != 1) {
                        return this.$message.warning(res.msg);
                    }
                })
            }
        }
    };

    /* 获取Edit的所有参数 */
    public async EditAllData(values: any) {
        let that: any = this;
        const editBaseInfoFormGroup: any = this.$refs.baseInfoFormGroup;
        let data = editBaseInfoFormGroup.getFieldsValue();
        let statusList: any; 
        if(data.status == 1 || data.status == "Active") {
            statusList = 1
        } else if(data.status == 2 || data.status == "Invalid") {
            statusList = 2
        }
        let sendSavaData = {
            "id": this.routeClassId,
            "description": data.description,
            "remark": data.remark,
            "routeClassName": data.routeClassName,
            "status": statusList
        }
        // console.log(statusList)
        let url = `/config/route-class?id=${this.routeClassId}&routeClassName=${data.routeClassName}&description=${sendSavaData.description == undefined? " " : sendSavaData.description}&status=${sendSavaData.status}&remark=${sendSavaData.remark == undefined? " " : sendSavaData.remark}`
        AxiosPut(url).then((res: any) => {
            if (res.code >= 1) {
                this.visible = !this.visible;
                that.$message.success("Successful addition");
                this.SearchOk((this.$refs.AdvancedSearch as any).getFieldsValue());
            }
            if (res.code != 1) {
                return this.$message.warning(res.msg);
            }
        })
    };

    /* 关闭 Add */
    public Screencover(msg: string) {
        this.visible = !this.visible;
    }

    /* 获取下拉框的值 */
    public created() {
        (async () => {
            RouteClassList('').then((res: any) => {
                this.formOptions[0]['options'] = res.data
            })
        })()
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
