<template>
<div>
    <!-- 高级搜索 -->
    <Advanced-search :formoptions="formOptions" :isChildName="true" @selectChange="selectChangebr" allowClear @Submit="SearchOk" :data="contractDatas" ref="AdvancedSearch" childDataKey="contractfoVOList" />
    <!-- 表格 -->
    <Table parentKey="id" :isAlphabet="isAlphabet" :isFinance="true" :isNeedCheck="true" :selectedBtn="Formscreening" @onSelectClick="activeClick" ref="table" @toggleLetter="toggleLetter" @onSelectAll="onSelectAll" @onSelect="onSelect" :columns="columns" :data="data" zebraStripe />
    <!-- Add模态弹出框 -->
    <Model align-title="center" v-model="visible" shade :title="getModalTitle" @Screencover="Screencover">
        <template slot="model-body">
            <form-group v-if="activeIndex === 1 && visible" @selectChange="addhandleChange" :formoptions="addFormGroupOptions" :span="12" ref="service" class="form-group"></form-group>
            <form-group v-if="activeIndex === 2 && visible" @selectChange="edithandleChange" :formoptions="editFormGroupOptions" :span="12" ref="edit" class="form-group"></form-group>
            <form-group v-if="activeIndex === 4 && visible" :span="12" ref="import" class="form-group"></form-group>
        </template>
        <template slot="model-footer">
            <a-row>
                <a-col :span="24" :style="{ textAlign: 'center' }" @click="handlesaveAll">
                    <div style="margin-top:10px;">
                        <a-button type="primary" :style="{ borderRadius: '50px 50px 50px 50px' }" @click="save">
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
    Component,
    Emit,
    Prop
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
    QualitycommitmentmanagementsDetail,
    QualitycommitmentmanagementsDetailAdd,
    QualitycommitmentmanagementsDetailEdit,
    QualitycommitmentmanagementsDetailDelete,
    destinations
} from '@/api/index'
import {
    addFormGroupOptionsData,
    editFormGroupOptionsData,
    columnsData,
    formOptionsData,
    FormscreeningData
} from './config'
import moment from 'moment'
import xlsx from 'xlsx'
import {
    recodeConfig,
    refsConfig
} from '@/assets/ts/config.d'
import {
    currencys
} from '../../../../api';

@Component({
    components: {
        AdvancedSearch: resolve => require(["@/common/Advancedsearch/index.vue"], resolve),
        pagination: resolve => require(["@/common/pagination/index.vue"], resolve),
        Model: resolve => require(["@/common/Model/index.vue"], resolve),
        product: resolve => require(["@/components/AddNewContract/product/index.vue"], resolve),
        formGroup: () => import("@/views/Finance/components/form-group/index.vue"),
        rateImport: () => import("./Import/index.vue"),
        detailS: (resolve) => require(["@/components/formscReening/details/index.vue"], resolve),
        Table: () => import("@/views/Finance/components/Table/index.vue"),
    }
})
export default class QualitycommitmentmanagementDetail extends Vue {
    @Prop([Number, String]) private qualityCommitmentId: any;
    public $refs: refsConfig | any;
    private values = {};
    private activeIndex: number = 0;
    private selectName: any = '';
    private detailsId: any;
    private selectedRows: any;
    private id: any;
    private activeSelectAdd: string = "service";
    private activeSelectEdit: string = "Edit";
    private isAlphabet: boolean = true; //是否显示字母表
    private addFormGroupOptions: any[] = addFormGroupOptionsData; //新增的数据
    private editFormGroupOptions: any[] = editFormGroupOptionsData; //编辑的数据
    private columns: any = columnsData; //表头数据
    private contractDatas: any[] = []
    private data: any[] = [];
    private destinationName: any;
    private destination: any;
    private formOptions: any = formOptionsData //高级搜索数据
    private Formscreening: any[] = FormscreeningData //操作栏数据
    private get getModalTitle(): string {
        if (this.activeIndex === 1) {
            return 'ADD'
        } else if (this.activeIndex === 2) {
            return 'Edit '
        } else if (this.activeIndex === 4) {
            return 'Import'
        }
        return 'unKnow'
    }
    private save() {
        if (this.activeIndex === 1) {
            this.addAllData();
        } else if (this.activeIndex === 2) {
            this.editllData();
        }
    }
    private changeDisable(selectedRows: any) {
        this.Formscreening.forEach((item: any, index: number) => {
            // console.log("item", item, index);
            // 2 edit   4 export
            if (selectedRows.length === 1) {
                if ((item.name === "Delete") && (selectedRows[0].adjustmentStatus === 2 || selectedRows[0].adjustmentStatus === 4)) {
                    item.disabled = true;
                } else {
                    item.disabled = false;
                }
            } else if (selectedRows.length > 1) {
                this.Formscreening[2].disabled = true
                this.Formscreening[4].disabled = false
            }
        });
    }

    //获取搜索栏的下拉框的数据
    public created() {
        destinations("").then((res: any) => {
            this.destination = res.data;
            console.log(res.data);
            this.destinationName = res.data.map((item: any) => item.destinationName)
            this.$set(this.addFormGroupOptions[0], "options", this.destinationName);
            this.$set(this.editFormGroupOptions[0], "options", this.destinationName);
        })
    }

    private addhandleChange(val: any, currentName: string, key: number) {
        this.handleChange(val, currentName, key);
    }
    private edithandleChange(val: any, currentName: string, key: number) {
        this.handleChange(val, currentName, key);
    }
    //destination的联动事件
    private handleChange(val: any, currentName: string, key: number) {
        let that = this;
        let {
            destinationName
        } = val;
        let FormGroupOptions = this.activeIndex === 1 ? this.addFormGroupOptions : this.editFormGroupOptions;
        let ref = this.activeIndex === 1 ? this.$refs.service : this.$refs.edit;
        if (currentName === "destinationName") {
            let destination = this.destination.find((item: any) => item.destinationName === destinationName);
            ref.setFieldsValue({
                [FormGroupOptions[1].decorator]: destination ? destination.dialedDigit : undefined,
                [FormGroupOptions[2].decorator]: destination ? destination.countryName : undefined,
                [FormGroupOptions[3].decorator]: destination ? destination.countryCode : undefined,
            })
        }

    }
    //字母表点击请求
    private toggleLetter(letter: string, index: number): void {
        // console.log(letter, index);
        let arrList: any[] = [];
        let arrData: any;
        //this.letter = letter
        let data: any = {
            params: Object.assign({}, {
                qualityCommitmentId: this.qualityCommitmentId,
            })
        }
        if (index != 0) {
            QualitycommitmentmanagementsDetail(data).then((res: any) => {
                let length = res.data.length
                for (let i = 0; i < length; i++) {
                    // console.log(res.data[i].destinationName[0])
                    if (res.data[i].destinationName[0].toUpperCase() == letter) {
                        arrList.push({
                            destinationName: res.data[i].destinationName,
                            dialedDigit: res.data[i].dialedDigit,
                            country: res.data[i].country,
                            countryCode: res.data[i].countryCode,
                            isCli: res.data[i].isCli,
                            asr: res.data[i].asr,
                            aloc: res.data[i].aloc,
                            ner: res.data[i].ner,
                        })
                    } else {
                        this.data = []
                    }
                }
                this.data = arrList
            })
        }
        if (index == 0) {
            this.SearchOk((this.$refs.AdvancedSearch as any).getFieldsValue());
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
                qualityCommitmentId: this.qualityCommitmentId,
            })
        }
        QualitycommitmentmanagementsDetail(data).then((res: any) => {
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
        // console.log(record, selected, selectedRows);
        record = selectedRows[0]
        this.values[0] = record
        this.prouccDatiletias(selectedRows)
    }
    /**多选禁止操作按钮 */
    public prouccDatiletias(selectedRows: any) {
        if (selectedRows.length) {
            this.detailsId = selectedRows[0].id
        }
        this.$set(this.Formscreening[1], 'disabled', selectedRows.length !== 1)
        this.$set(this.Formscreening[2], 'disabled', selectedRows.length === 0)
        this.$set(this.Formscreening[3], 'disabled', selectedRows.length == 0)
        this.$set(this.Formscreening[4], 'disabled', selectedRows.length == 0)
    }
    /* 点击切换页 分页(pagination) -> 回调 */
    public onChang(pageSize: number) {
        // console.log(pageSize)
    }
    /* Add 选项卡 */
    public activeAdd(tab: any, item: any) {
        console.log(tab, item);

        this.activeSelectAdd = item;
    }

    // 新增保存
    public addAllData(): void {
        let that: any = this;
        if (this.activeIndex == 1) {
            let obj = JSON.parse(JSON.stringify(that.$refs.service.form.getFieldsValue()));
            console.log(obj);
            let qualityCommitmentId = this.qualityCommitmentId;
            let {
                destinationName,
                dialedDigit,
                country,
                countryCode,
                isCli,
                asr,
                aloc,
                ner
            } = obj;
            let add = {
                destinationName,
                dialedDigit,
                qualityCommitmentId,
                country,
                countryCode,
                isCli,
                asr,
                aloc,
                ner
            }
            console.log(add);
            QualitycommitmentmanagementsDetailAdd(add).then((res: any) => {
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
    // 编辑保存
    public editllData(): void {
        // console.log(this.values[0],'values');
        // console.log('values',values);
        let that: any = this;
        if (this.activeIndex == 2) {
            let obj = JSON.parse(JSON.stringify(that.$refs.edit.form.getFieldsValue()));
            let qualityCommitmentId = this.qualityCommitmentId;
            let {
                destinationName,
                dialedDigit,
                country,
                countryCode,
                isCli,
                asr,
                aloc,
                ner
            } = obj;
            let edit = {
                destinationName,
                dialedDigit,
                country,
                countryCode,
                isCli,
                asr,
                qualityCommitmentId,
                aloc,
                ner
            }
            QualitycommitmentmanagementsDetailEdit(edit).then((res: any) => {
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

    // 导出的数据处理
    private toExport(selectedData: any, name: any = 'VcRoundingRules.xls', selected ? : any): void {
        const filterData = selectedData.map((item: any) => {
            let newItem = JSON.parse(JSON.stringify(item))
            delete newItem.id
            let {
                aloc,
                asr,
                country,
                countryCode,
                destinationName,
                dialedDigit,
                isCli,
                ner
            } = newItem
            let Destination = destinationName;
            let Dialeddigits = dialedDigit;
            let Country = country;
            let Countrycode = countryCode;
            let CLI = isCli;
            let ASR = asr;
            let ALOC = aloc;
            let NER = ner;
            console.log(newItem);
            let newData = {
                Destination,
                Dialeddigits,
                Country,
                Countrycode,
                CLI,
                ASR,
                ALOC,
                NER
            }
            return newData
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

    /* 操作栏点击 -> 回调 */
    private visible: any = false
    private addEdit: object = {}
    public async activeClick({
        name,
        index
    }: any, selected: any, selectedData: any, activeObJ: any) {
        console.log(selected, index, name)
        console.log(selectedData);
        const deleted = selectedData.map((item: any) => item.id).join(",") //多选删除
        console.log(deleted);
        this.id = deleted;
        /*删除按钮*/
        if (index === 2) {
            this.editFormGroupOptions[0].initialValue = this.values[0].destinationName;
            this.editFormGroupOptions[1].initialValue = this.values[0].dialedDigit;
            this.editFormGroupOptions[2].initialValue = this.values[0].country;
            this.editFormGroupOptions[3].initialValue = this.values[0].countryCode;
            this.editFormGroupOptions[4].initialValue = this.values[0].isCli;
            this.editFormGroupOptions[5].initialValue = this.values[0].asr === 0 ? '0' : this.values[0].asr;
            this.editFormGroupOptions[6].initialValue = this.values[0].aloc === 0 ? '0' : this.values[0].aloc;
            this.editFormGroupOptions[7].initialValue = this.values[0].ner === 0 ? '0' : this.values[0].ner;
        }
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
                    QualitycommitmentmanagementsDetailDelete(deleted).then((res: any) => {
                        console.log("Confirm", res);
                        if (res.code < 0) {
                            console.log(_this.visible);
                            _this.visible = false;
                        } else {
                            _this.visible = false;
                            _this.$message.success("Data has been deleted successfully");
                            _this.SearchOk("");
                        }
                    });
                }
            });
        }
        /**export按钮 */
        if (index == 5) {
            // Export
            this.toExport(selectedData, undefined, selected)
        }
        index !== 5 && index !== 3 && (this.visible = !this.visible) && (this.activeIndex = index);
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
