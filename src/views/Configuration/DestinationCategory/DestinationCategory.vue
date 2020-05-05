<template>
<div>
    <!-- 高级搜索 -->
    <Advanced-search :formoptions="formOptions" :isChildName="true" allowClear @Submit="SearchOk" ref="AdvancedSearch" />
    <Table parentKey="id" :isFinance="true" :isNeedCheck="true" :selectedBtn="Formscreening" @onSelectClick="onSelectClick" :columns="columns" :data="data" zebraStripe @onSelectAll="onSelectAll" @onSelect="onSelect" />

    <!-- Add模态弹出框 -->
    <Model align-title="center" v-model="visible" v-if="activeIndex === 1 && visible" shade title="Add destination category" @Screencover="Screencover">
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
                <a-col :span="24" :style="{ textAlign: 'center' }" @click="handlesaveAll">
                    <div style="margin-top: 10px;">
                        <a-button type="primary" :style="{ borderRadius: '50px 50px 50px 50px' }" @click="addAllData">Save</a-button>
                        <a-button :style="{ marginLeft: '8px', color: '#1890ff', borderRadius: '50px 50px 50px 50px', border: '1px solid #1890ff', fontWeight: '600' }" @click="handleReruen(1)">Return</a-button>
                    </div>
                </a-col>
            </a-row>
        </template>
    </Model>

    <!-- Edit模态弹出框 -->
    <Model align-title="center" v-model="visible" v-if="activeIndex === 2 && visible" shade title="Edit destination category" @Screencover="Screencover">
        <template slot="model-body">
            <div class="top-content">
                <form-group :formoptions="editbaseInfoFormOptions" ref=baseInfoFormGroup />
            </div>
        </template>
        <template slot="model-footer">
            <a-row>
                <a-col :span="24" :style="{ textAlign: 'center' }" @click="handlesaveAll">
                    <div style="margin-top: 10px;">
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
import Vue from "vue";
import {
    Component
} from "vue-property-decorator";
import {
    refsConfig
} from "@/assets/ts/config.d"
import {
    formOptions,
    formscreening,
    columns,
    baseInfoFormOptions
} from "./DestinationCategoryList"
import {
    AxiosDelete
} from "@/api/axios";
import {
    DestinationCategorySearch,
    DestinationCategoryAdd,
    DestinationCategoryEdit,
    DestinationCategoryList
} from "@/api/index.ts";
import {
    FormOptions,
    Formscreening,
    Columns,
    BaseInfoFormOptions
} from "./DestinationCategoryConfig"

/**组件 */
@Component({
    components: {
        AdvancedSearch: resolve => require(["@/common/Advancedsearch/index.vue"], resolve),
        Model: resolve => require(["@/common/Model/index.vue"], resolve),
        Table: () => import("@/views/Finance/components/Table/index.vue"),
        formGroup: () => import("@/views/Finance/components/form-group/index.vue")
    }
})

export default class DestinationCategory extends Vue {
    private visible: any = false;
    /**效验Name是否重复 */
    private isRepetition: boolean = false;
    private activeIndex: number = 0;
    public $refs: refsConfig | any;

    /**搜索 */
    private formOptions: FormOptions['Array'] = formOptions

    /**编辑栏 */
    private Formscreening: Formscreening['Array'] = formscreening

    /**编辑栏状态 */
    private changeDisable(selectedRows: any) {
        if (selectedRows.length === 1) {
            this.Formscreening[1].disabled = false
            this.Formscreening[2].disabled = false
        } else if (selectedRows.length > 1) {
            this.Formscreening[1].disabled = true
            this.Formscreening[2].disabled = false
        } else {
            this.Formscreening[1].disabled = true
            this.Formscreening[2].disabled = true
        }
    }

    /**表头 */
    private columns: Columns['Array'] = columns

    /**表格内容 */
    private data: any = []

    /**Add属性 */
    private baseInfoFormOptions: any['Array'] = baseInfoFormOptions

    /**Edit属性 */
    private editbaseInfoFormOptions: any['Array'] = baseInfoFormOptions

    /**选择/取消回调 */
    public onSelectAll(selected: any, selectedRows: any, changeRows: any) {
        this.changeDisable(selectedRows);
    }
    public onSelect(record: object, selected: boolean, selectedRows: any) {
        this.changeDisable(selectedRows);
    }

    /**编辑栏功能 */
    private DescId: any;
    private relatedContract: any = undefined;
    public async onSelectClick({
            name,
            index
        }: any,
        selected: any,
        selectedData: any
    ) {
        const deleted = selectedData.map((item: any) => item.id).join(",")
        let that: any = this
        this.baseInfoFormOptions[0].disabled = false
        this.baseInfoFormOptions[0]['initialValue'] = ""
        this.baseInfoFormOptions[1]['initialValue'] = ""
        this.baseInfoFormOptions[2]['initialValue'] = ""
        if (index == 2) {
            this.DescId = selectedData[0].id
            this.activeIndex = 2
            this.baseInfoFormOptions[0].disabled = true
            this.editbaseInfoFormOptions[0]['initialValue'] = selectedData[0].categoryName
            this.editbaseInfoFormOptions[1]['initialValue'] = selectedData[0].status
            this.editbaseInfoFormOptions[2]['initialValue'] = selectedData[0].remark
        }
        if (index == 3) {
            this.activeIndex = 3
            let code = undefined
            if (this.relatedContract == undefined || "") {
                let url = `/config/destination-category/${deleted}`
                let _this = this;
                this.$confirm({
                    title: "Confirm!",
                    content: `Continue to  deleted the data?`,
                    okText: "YES",
                    cancelText: "NO",
                    onOk() {
                        const that = this;
                        AxiosDelete(url).then((res: any) => {
                            if (selectedData[0].status == 1) {
                                _this.visible = false;
                                _this.$message.error("Only invalid records could be deleted");
                            } else if (res.code < 0) {
                                _this.visible = false
                            } else {
                                _this.visible = false;
                                _this.$message.success("Data has been deleted successfully");
                                _this.SearchOk((_this.$refs.AdvancedSearch as any).getFieldsValue());
                            }
                        });
                    }
                })
            }
        }
        this.activeIndex = index
        this.visible = !this.visible
    }

    /**SearchOk */
    public SearchOk(values ? : any): void {
        let data: any = {
            params: Object.assign({}, values, {
                categoryName: values.categoryName || undefined
            })
        };
        DestinationCategorySearch(data).then((res: any) => {
            this.data = res.data
        })
    }

    /**Sava Add */
    private async addAllData() {
        let that: any = this
        if (this.activeIndex === 1) {
            const baseInfoFormGroup: any = this.$refs.baseInfoFormGroup;
            if (baseInfoFormGroup.validateFields()) {
                let data = baseInfoFormGroup.validateFields();
                let savaData = {
                    "categoryName": data.categoryName,
                    "remark": data.remark,
                    "status": data.status
                }
                if (savaData) {
                    DestinationCategoryAdd(savaData).then((res: any) => {
                        if (res.code >= 1) {
                            this.visible = !this.visible;
                            that.$message.success("Successful addition");
                            this.SearchOk((this.$refs.AdvancedSearch as any).getFieldsValue());
                            DestinationCategoryList('').then((res: any) => {
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

    /**Sava Add */
    private async editAllData() {
        let that: any = this
        if (this.activeIndex === 2) {
            const editBaseInfoFormGroup: any = this.$refs.baseInfoFormGroup;
            let data = editBaseInfoFormGroup.validateFields();
            let editData = {
                "id": this.DescId,
                "categoryName": data.categoryName,
                "remark": data.remark,
                "status": data.status
            }
            DestinationCategoryEdit(editData).then((res: any) => {
                if (res.code >= 1) {
                    this.visible = !this.visible;
                    that.$message.success("Successful addition");
                    this.SearchOk((this.$refs.AdvancedSearch as any).getFieldsValue());
                }
                if (res.code != 1) {
                    return this.$message.warning(res.msg);
                }
            })
        }
    }

    /* 关闭 Add */
    public Screencover(msg: string) {
        this.visible = !this.visible;
        this.editbaseInfoFormOptions[0]['initialValue'] = ""
        this.editbaseInfoFormOptions[1]['initialValue'] = ""
        this.editbaseInfoFormOptions[2]['initialValue'] = ""
        this.baseInfoFormOptions[0]['initialValue'] = ""
        this.baseInfoFormOptions[1]['initialValue'] = ""
        this.baseInfoFormOptions[2]['initialValue'] = ""
    }

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

    /* 校验所有 */
    public handlesaveAll() {
        // console.log("校验开始");
    };

    public created() {
        DestinationCategoryList('').then((res: any) => {
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
