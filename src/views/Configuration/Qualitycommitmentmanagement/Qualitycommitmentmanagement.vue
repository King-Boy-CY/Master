<template>
<div>
    <!-- 高级搜索 -->
    <Advanced-search autoClearSearchValue :formoptions="formOptions" :isChildName="true" allowClear @Submit="SearchOk" ref="AdvancedSearch" />
    <!-- 表格 -->
    <Table parentKey="id" :isFinance="true" :isNeedCheck="true" :selectedBtn="Formscreening" @onSelectClick="activeClick" @onSelectAll="onSelectAll" @onSelect="onSelect" :columns="columns" :data="data" zebraStripe />
    <!-- 弹出框 -->
    <Model align-title="center" v-model="visible" shade :title="getModalTitle" @Screencover="Screencover">
        <template slot="model-body">
            <form-group v-if="activeIndex === 1 && visible" :formoptions="addFormGroupOptions" :span="12" ref="add" class="form-group"></form-group>
            <form-group v-if="activeIndex === 2 && visible" :formoptions="editFormGroupOptions" :span="12" ref="edit" class="form-group"></form-group>
            <detail v-if="activeIndex === 3 && visible" :qualityCommitmentId="qualityCommitmentId"></detail>
        </template>
        <template slot="model-footer">
            <a-row>
                <a-col :span="24" :style="{ textAlign: 'center' }" @click="handlesaveAll">
                    <div style="margin-top:10px;">
                        <a-button type="primary" style="border-radius:50px;min-width:75px;" @click="save">&nbsp; Save&nbsp;</a-button>
                        <a-button :style="{ marginLeft: '8px', color: '#1890ff', borderRadius: '50px 50px 50px 50px', border: '1px solid #1890ff', fontWeight: '600' }" @click="handleReruen">Return</a-button>
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
} from "vuex-class";
import {
    AxiosDelete
} from "@/api/axios";
import moment from "moment";
import {
    ExchangeRates,
    formOptionsConfigs
} from "./QualitycommitmentmanagementConfig";
import {
    Qualitycommitmentmanagements,
    QualitycommitmentmanagementAdd,
    QualitycommitmentmanagementEdit,
    QualitycommitmentmanagementDelete
} from "@/api/index";
import {
    addFormGroupOptionsData,
    editFormGroupOptionsData,
    formOptionsData,
    FormscreeningData,
    columnsData
} from "./config"
import xlsx, {
    stream
} from 'xlsx'
import {
    recodeConfig,
    refsConfig
} from '@/assets/ts/config.d'

@Component({
    components: {
        AdvancedSearch: resolve =>
            require(["@/common/Advancedsearch/index.vue"], resolve),
        pagination: resolve => require(["@/common/pagination/index.vue"], resolve),
        Model: resolve => require(["@/common/Model/index.vue"], resolve),
        contractDetials: resolve =>
            require(["@/components/AddNewContract/contractDetails/index.vue"], resolve),
        Detail: resolve =>
            require(["./Detail/QualitycommitmentmanagementDetail.vue"], resolve),
        formGroup: () => import("@/views/Finance/components/form-group/index.vue"),
        detailS: resolve =>
            require(["@/components/formscReening/details/index.vue"], resolve),
        Table: () => import("@/views/Finance/components/Table/index.vue")
    }
})
export default class Qualitycommitmentmanagement extends Vue {
    private values = {};
    public $refs: refsConfig | any
    private detailsId: any;
    private relatedContract: string = "";
    private qualityCommitmentId: any;
    public data: any = [];
    private activeIndex: number = 0;
    private get getModalTitle(): string {
        if (this.activeIndex === 1) {
            return 'ADD'
        } else if (this.activeIndex === 2) {
            return 'Edit '
        } else if (this.activeIndex === 3) {
            return 'Detail'
        }
        return 'unKnow'
    }
     private  save(){
        if (this.activeIndex === 1) {
           this.addAllData();
        } else if (this.activeIndex === 2) {
           this.editllData();
        }
    }
    private addFormGroupOptions: any[] = addFormGroupOptionsData; //新增的数据
    private editFormGroupOptions: any[] = editFormGroupOptionsData; //编辑的数据
    private columns: ExchangeRates[] = columnsData //表头数据
    private formOptions: formOptionsConfigs[] = formOptionsData //搜索数据
    private Formscreening: any[] = FormscreeningData //操作栏数据
    /* 用户手动选择/取消选择所有列的回调  Table -> 回调 */
    public onSelectAll(selected: boolean, selectedRows: any, changeRows: any) {
        this.prouccDatiletias(selectedRows);
    }
    public onSelect(record: object, selected: boolean, selectedRows: any) {
        console.log(selectedRows, selected, record);
        record = selectedRows[0]
        this.values[0] = record
        this.prouccDatiletias(selectedRows)
    }
    public prouccDatiletias(selectedRows: any) {
        if (selectedRows.length) {
            this.detailsId = selectedRows[0].id;
        }
        // console.log(selectedRows,this.Formscreening[1])
        this.$set(this.Formscreening[1], "disabled", selectedRows.length !== 1);
        this.$set(this.Formscreening[2], "disabled", selectedRows.length !== 1);
        if(this.data.length === 0){
           this.$set(this.Formscreening[1], "disabled", true);
        }
    }
    /* 点击切换页 分页(pagination) -> 回调 */
    public onChang(pageSize: number) {
        // console.log(pageSize)
    }
  
    // 新增保存
    public addAllData(): void {
        // console.log(this.values[0],'values');
        // console.log('values',values,this.activeIndex);
        let that: any = this;
        if (this.activeIndex == 1) {
            let obj = JSON.parse(JSON.stringify(that.$refs.add.form.getFieldsValue()));
            console.log(obj);
            let {
                qualityCommitmentName,
                status,
                remark,
            } = obj;
            let vendorId: any
            console.log(remark);
            status = status == 'Active' ? 1 : status || status == 'Invalid' ? 2 : status
            let add = {
                qualityCommitmentName,
                remark,
                status,
            }
            // console.log(edit, vendorName, vendorName);
            QualitycommitmentmanagementAdd(add).then((res: any) => {
                if (res.code >= 1) {
                    that.visible = !that.visible;
                    that.$message.success("Successful addition");
                    this.$set(this.Formscreening[1], 'disabled', true)
                    this.$set(this.Formscreening[2], 'disabled', true)
                    setTimeout(() => {
                        this.SearchOk(this.$refs.AdvancedSearch.getFieldsValue())
                    }, 100)
                }
                if (res.code = -203) {

                }
            });
        }
    }
    // 编辑保存
    public editllData(): void {
        // console.log(this.values[0],'values');
        // console.log('values',values);
        let that: any = this;
        if (this.activeIndex == 2) {
            let obj = JSON.parse(JSON.stringify(that.$refs.edit.form.getFieldsValue()));
            console.log(obj);
            let {
                qualityCommitmentName,
                status,
                remark,
            } = obj;
            let vendorId: any
            let id = this.qualityCommitmentId
            console.log(remark, id);
            status = status == 'Active' ? 1 : status || status == 'Invalid' ? 2 : status
            let edit = {
                qualityCommitmentName,
                remark,
                status,
                id
            }
            console.log(edit);
            QualitycommitmentmanagementEdit(edit).then((res: any) => {
                if (res.code >= 1) {
                    that.visible = !that.visible;
                    that.$message.success("Successful addition");
                    this.$set(this.Formscreening[1], 'disabled', true)
                    this.$set(this.Formscreening[2], 'disabled', true)
                    setTimeout(() => {
                        this.SearchOk(this.$refs.AdvancedSearch.getFieldsValue())
                    }, 100)
                }
            });
        }
    }

    private toExport(selectedData: any, name: any = 'Qualitycommitmentmanagement.xls', selected ? : any): void {
        const filterData = selectedData.map((item: any) => {
            let newItem = JSON.parse(JSON.stringify(item))
            delete newItem.id
            let {
                qualityCommitmentName,
                modifiedBy,
                lastModified,
                status,
                remark
            } = newItem;
            let Qualitycommitment = qualityCommitmentName;
            let Status = status == 1 ? 'Active' : status || status == 2 ? 'Invalid' : status;
            let Remark = remark;
            let Modifiedby = modifiedBy;
            let Lastmodified = lastModified
            let data = {
                Qualitycommitment,
                Status,
                Remark,
                Modifiedby,
                Lastmodified
            }
            return data
        })
        const ws: xlsx.WorkSheet = xlsx.utils.json_to_sheet(filterData);
        const wb: xlsx.WorkBook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');
        xlsx.writeFile(wb, name);
    }

    /* 操作栏点击 -> 回调 */
    public async SearchOk(values: any) {
        let data: any = {
            params: Object.assign({}, values, {
            })
        };
        console.log(data);
      await  Qualitycommitmentmanagements(data).then((res: any) => {
            this.data = res.data;
        });
          this.data.map((item: any, index: number) => {
            if (item.status === 1) {
                item.status = 'Active'
            } else if (item.status === 2) {
                item.status = 'Invalid'
            }
        });
    }

    private visible: any = false;
    public async activeClick({
        name,
        index
    }: any, selected: any, selectedData: any, activeObJ: any) {
        const deleted = selectedData.map((item: any) => item.id).join(",") //多选删除
        this.qualityCommitmentId = deleted;
        console.log(selectedData, index);
        if(index === 2){
            this.editFormGroupOptions[0].initialValue = this.values[0].qualityCommitmentName;
            this.editFormGroupOptions[1].initialValue = this.values[0].status === 1 ? 'Active': 'Invalid';
            this.editFormGroupOptions[2].initialValue = this.values[0].qualityCommitmentName;
        }

        if (index == 4 && this.detailsId) {
            this.activeIndex = 4;
            // console.log(this.StatusOptions,this.StatusOptions[0].name = 'Active');
            let _this = this;
            this.$confirm({
                title: "Confirm!",
                content: `Continue to  deleted the data?`,
                okText: "YES",
                cancelText: "NO",
                onOk() {
                    const that = this;
                    QualitycommitmentmanagementDelete(deleted).then((res: any) => {
                        console.log("Confirm", res);
                        if (res.code < 0) {
                            console.log(_this.visible);
                            _this.visible = false;
                        } else if (res.code > 0) {
                            _this.visible = false;
                            _this.$message.success("Data has been deleted successfully");
                            _this.SearchOk("");

                        }
                    });
                }
            });
            if (index == 3 && this.detailsId) {}
        }

        /**export按钮 */
        if (index == 5 && this.detailsId) {
            this.activeIndex = 5;
            if (activeObJ === undefined) {
                // Export
                this.toExport(selectedData, undefined, selected)
            }
        }
        index !== 5 && (this.visible = !this.visible) && (this.activeIndex = index);
    }

    public updated(data: any) {
        // console.log('改变')
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
.ant-form-item-label {
    margin-right: 20px;
}
</style>
