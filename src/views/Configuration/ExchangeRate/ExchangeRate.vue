<template>
<div>
    <!-- 高级搜索 -->
    <Advanced-search autoClearSearchValue :formoptions="formOptions" :isChildName="true" allowClear @Submit="SearchOk" ref="AdvancedSearch" isNotShadow />
    <!-- 表格 -->
    <Table parentKey="id" :isFinance="true" :isNeedCheck="true" :selectedBtn="Formscreening" @onSelectClick="activeClick" @onSelectAll="onSelectAll" @onSelect="onSelect" :columns="columns" :data="data" zebraStripe />
    <!-- Add模态弹出框 -->
    <Model align-title="center" v-model="visible" shade :title="getModalTitle" @Screencover="Screencover">
        <template slot="model-body">
            <form-group v-if="activeIndex === 1 && visible" :formoptions="addFormGroupOptions" :span="12" ref="add" class="form-group"></form-group>
            <form-group v-if="activeIndex === 2 && visible" :formoptions="editFormGroupOptions" :span="12" ref="edit" class="form-group"></form-group>
            <rateImport v-if="activeIndex === 4 && visible" />
        </template>
        <template slot="model-footer">
            <a-row>
                <a-col :span="24" :style="{ textAlign: 'center' }">
                    <div style="margin-top:10px;">
                        <a-button type="primary" style="border-radius:50px;min-width:75px;" @click="save">Save</a-button>
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
    AxiosGet,
    AxiosPost,
    AxiosPut,
    AxiosDelete
} from "@/api/axios";
import moment from "moment";
import {
    ExchangeRates,
    formOptionsConfigs,
    dateDate
} from "./ExchangeRateConfig";
import {
    ExchangeRate,
    ExchangeRateEdit,
    ExchangeRateAdd,
    VendorSourceList,
    getServiceCurrencys,
    ClientSourceNameList,
    ClientSourceList
} from "@/api/index";
import {
    spitDate
} from "@/views/Trade/sellPrice/method";
import {
    recodeConfig,
    refsConfig
} from '@/assets/ts/config.d'
import {
    onSelectClick
} from '@/views/Configuration/Exports'
import {
    addFormGroupOptionsData,
    editFormGroupOptionsData,
    formoptionsData,
    columnsData,
    FormscreeningData
} from './config'
import {
    distinct
} from "@/assets/ts/index";
import {
    downloadExcel
} from "@/assets/ts/xlsx-style/index";

@Component({
    components: {
        AdvancedSearch: resolve =>
            require(["@/common/Advancedsearch/index.vue"], resolve),
        pagination: resolve => require(["@/common/pagination/index.vue"], resolve),
        Model: resolve => require(["@/common/Model/index.vue"], resolve),
        formGroup: () => import("@/views/Finance/components/form-group/index.vue"),
        Table: () => import("@/views/Finance/components/Table/index.vue"),
        rateImport: () => import('./Import/index.vue')
    }
})
export default class ExchangeRated extends Vue {
    private values = {};
    public $refs: refsConfig | any
    private detailsId: any;
    private relatedContract: string = "";
    private id: any;
    private activeIndex: number = 0;
    private clientid: any;
    private VendorSourceid: any;
    private get getModalTitle(): string {
        if (this.activeIndex === 1) {
            return 'Add Exchange Rate'
        } else if (this.activeIndex === 2) {
            return 'Exchange Rate Edit'
        } else if (this.activeIndex === 4) {
            return 'Import'
        }
        return 'unKnow'
    }
    private addFormGroupOptions: any[] = addFormGroupOptionsData; //新增的数据
    private editFormGroupOptions: any[] = editFormGroupOptionsData; //编辑的数据
    private columns: ExchangeRates[] = columnsData //表头数据
    private contractDatas: any = [];
    public data: any = [];
    private formOptions: formOptionsConfigs[] = formoptionsData //高级搜索数据
    private Formscreening: any[] = FormscreeningData

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
        this.Formscreening.forEach((item: any) => {
            if (item.index !== 4 && item.index !== 1 && item.index !== 5) {
                item.disabled = selectedRows.length !== 1
            } else if (item.index === 5) {
                item.disabled = this.data.length === 0
            }
        })
    }
    /* 点击切换页 分页(pagination) -> 回调 */
    public onChang(pageSize: number) {
        // console.log(pageSize)
    }
    private save() {
        if (this.activeIndex === 1) {
            this.addAllData();
        } else if (this.activeIndex === 2) {
            this.editllData();
        }
    }
    // 新增保存
    public addAllData(): void {
        // console.log(this.values[0],'values');
        // console.log('values',values);
        let that: any = this;
        if (this.activeIndex === 1) {
            let test = JSON.parse(JSON.stringify(that.$refs.add.form.validateFields()));
            let obj = JSON.parse(JSON.stringify(that.$refs.add.form.getFieldsValue()));
            // console.log(obj);

            let {
                currency1,
                currency2,
                rate,
                clientName,
                beginDate,
                endDate,
                vendorName
            } = obj;
            beginDate = moment(obj.beginDate).format("YYYY-MM-DD") || undefined || '';
            endDate = moment(obj.endDate).format("YYYY-MM-DD") || undefined || '';
            let id = this.id
            let vendorId = vendorName
            let clientId = clientName
            let add = {
                currency1,
                currency2,
                rate,
                vendorId,
                clientId,
                beginDate,
                endDate,
            }
            // console.log(add, vendorName, vendorName);
            ExchangeRateAdd(add).then((res: any) => {
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
        let that: any = this;
        if (this.activeIndex === 2) {
            let obj = JSON.parse(JSON.stringify(that.$refs.edit.form.getFieldsValue()));
            console.log(obj);
            let {
                currency1,
                currency2,
                rate,
                clientName,
                beginDate,
                endDate,
                vendorName
            } = obj;
            beginDate = moment(obj.beginDate).format("YYYY-MM-DD") || undefined || '';
            endDate = moment(obj.endDate).format("YYYY-MM-DD") || undefined || '';
            let id = this.id ? (+this.id) : this.id;
            let client = this.clientid.find((item: any) => item.name = clientName);
            let vendor = this.VendorSourceid.find((item: any) => item.name = vendorName);
            console.log(client, vendor);
            console.log('obj', obj);
            let vendorId = vendor ? vendor.id : undefined;
            let clientId = client ? client.id : undefined;
            console.log(vendorId, clientId);
            let edit = {
                currency1,
                currency2,
                rate,
                vendorId,
                clientId,
                beginDate,
                endDate,
                id
            }
            // console.log(edit, vendorName, vendorName);
            ExchangeRateEdit(edit).then((res: any) => {
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
    /* 操作栏点击 -> 回调 */
    public SearchOk(values: any): void {
        let new_data: object = spitDate({
            data: values,
            formData: this.formOptions
        });
        console.log(new_data);
        ExchangeRate(new_data).then((res: any) => {
            this.data = res.data;
        });
    }

    public created() {
        const that = this;
        getServiceCurrencys("").then((res: recodeConfig) => {
            this.$set(this.formOptions[0], "options", distinct(res.data))
            this.$set(this.formOptions[1], "options", distinct(res.data))
            this.$set(this.addFormGroupOptions[0], "options", distinct(res.data))
            this.$set(this.addFormGroupOptions[1], "options", distinct(res.data))
            this.$set(this.editFormGroupOptions[0], "options", distinct(res.data))
            this.$set(this.editFormGroupOptions[1], "options", distinct(res.data))
        })
        VendorSourceList("").then((res: recodeConfig) => {
            this.VendorSourceid = res.data;
            const data = res.data.map((item: any) => {
                return {
                    value: item.id,
                    name: item.name
                }
            })
            // console.log(data);
            this.formOptions[2]['options'] = data
            this.$set(this.addFormGroupOptions[3], "options", data)
            this.$set(this.editFormGroupOptions[3], "options", data)
        })

        ClientSourceList("").then((res: any) => {
            this.clientid = res.data;
            const data = res.data.map((item: any) => {
                return {
                    value: item.id,
                    name: item.name
                }
            })
            this.formOptions[3]['options'] = data
            console.log(data);
            this.$set(this.addFormGroupOptions[4], "options", data)
            this.$set(this.editFormGroupOptions[4], "options", data)
        })
    }

    private visible: any = false;
    // activeObJ: any, selected: any, selectedData: any
    public async activeClick({
            name,
            index
        }: any,
        selected: boolean,
        selectedData: any,
        activeObJ: any
    ) {
        const deleted = selectedData.map((item: any) => item.id).join(",") //多选删除
        this.id = deleted;
        if (index == 2) {
            console.log('22222');
            // this.activeIndex = 2;
            // if(activeObJ = undefined){
            console.log(this.values[0]);
            this.editFormGroupOptions[0].initialValue = this.values[0].currency1;
            this.editFormGroupOptions[1].initialValue = this.values[0].currency2;
            this.editFormGroupOptions[2].initialValue = this.values[0].rate;
            this.editFormGroupOptions[3].initialValue = this.values[0].vendorName;
            this.editFormGroupOptions[4].initialValue = this.values[0].clientName;
            this.editFormGroupOptions[5].initialValue = this.values[0].beginDate;
            this.editFormGroupOptions[6].initialValue = this.values[0].endDate;
            // }
        }
        if (index == 3 && this.detailsId) {
            this.activeIndex = 3;
            let url = `/config/exchange-rate/${deleted}`;
            let _this = this;
            this.$confirm({
                title: "Confirm!",
                content: `Continue to  deleted the data?`,
                okText: "YES",
                cancelText: "NO",
                onOk() {
                    const that = this;
                    AxiosDelete(url).then((res: any) => {
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
        if (index == 5) {
            downloadExcel(this.columns, this.data, `Exchange Rate`, "Exchange Rate");
        }
        index !== 5 && index !== 3 && (this.visible = !this.visible) && (this.activeIndex = index);
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
