<template>
<div class="VendorClientNumberPlan">
    <Advanced-search autoClearSearchValue :formoptions="searchFormOptions" :isChildName="true" allowClear @Submit="SearchOk" ref="AdvancedSearch" @selectChange="searchSelectChange" @onBtnClick="onBtnClick" />
    <Table parentKey="id" :isFinance="true" :isNeedCheck="true" :selectedBtn="selectedBtn" @onSelectClick="activeClick" @onSelectAll="onSelectAll" @onSelect="onSelect" :columns="columns" :data="data" zebraStripe />
    <Model align-title="center" :width="activeIndex !=='add' && activeIndex !=='edit' && '92%' || undefined" :height="'auto'" v-if="visible" v-model="visible" shade :title="getModalTitle">
        <template slot="model-body">
            <!-- add  edit-->
            <form-group v-if="activeIndex==='add' || activeIndex ==='edit'" :formoptions="addFormGroupOptions" :span="12" ref="formGroup" class="form-group" @selectChange="formGroupSelectChange"></form-group>
            <!-- editDestination -->
            <edit-destination v-if="activeIndex==='editDestination'" :refnumberplanname="refnumberplanname" :refnumberplanid="idArr.length?idArr[0]:'0000'" isVendorClient></edit-destination>
            <!-- editCountry -->
            <edit-countries v-if="activeIndex==='editCountry'" :refnumberplanid="idArr.length?idArr[0]:'0000'" isVendorClient></edit-countries>
        </template>
        <template slot="model-footer">
            <a-button class="save-btn" type="primary" @click="save">Save</a-button>
            <a-button class="return-btn" @click="handleReturn">Return</a-button>
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
import moment from "moment";
import {
    getVendorClientNumberPlan,
    addVendorClientNumberPlan,
    editVendorClientNumberPlan,
    deleteVendorClientNumberPlan,
    VendorSourceList,
    ClientSourceList,
    getVendorClientNumberPlanNames
} from "@/api/index";
import {
    columnInterface,
    searchOptionInterface
} from "./interface";
import {
    selectedBtnInterface,
    selectOptionsInterface,
    formGroupOptionInterface
} from '@/common/dataConfig/interface'
import {
    searchFormOptions,
    columns,
    selectedBtn,
    // sourceTypeOptions,
    // statusOptions,
    addFormGroupOptions
} from './config'
import xlsx from 'xlsx'
import {
    recodeConfig,
    refsConfig
} from '@/assets/ts/config.d'
import {
    resolveSelectResponed,
    deepClone
} from '@/assets/ts/index'
import {
    downloadExcel
} from '@/assets/ts/xlsx-style/index'

@Component({
    components: {
        AdvancedSearch: () => import("@/common/Advancedsearch/index.vue"),
        pagination: () => import("@/common/pagination/index.vue"),
        Model: () => import("@/common/Model/index.vue"),
        Table: () => import("@/views/Finance/components/Table/index.vue"),
        formGroup: () => import("@/views/Finance/components/form-group/index.vue"),
        editDestination: () => import('@/views/Configuration/refnumberplan/Editdestinations/Editdestination.vue'),
        editCountries: () => import('@/views/Configuration/refnumberplan/EditCoutrys/editcoutry.vue'),
    }
})
export default class VendorClientNumberPlan extends Vue {
    // public $refs: any
    private columns: columnInterface[] = columns;
    private data: any = [];
    private searchFormOptions: searchOptionInterface[] = searchFormOptions;
    private selectedBtn: selectedBtnInterface[] = selectedBtn;
    private addFormGroupOptions: formGroupOptionInterface[] = deepClone(addFormGroupOptions);
    private oldSourceType: number = -1 // 高级搜索 上一次选择的SourceType
    private oldSourceTypeFormGroup: number = -1 // FormGroup 上一次选择的SourceType
    private visible: any = false; // 弹出框显隐
    private activeIndex: number | string = ''; // table 上方按钮点击标识
    private refnumberplanname: string = ''; //表格勾选的numplan名字
    private idArr: number[] = [] // 表格勾选的id 数组

    private get getModalTitle(): string {
        if (this.activeIndex === 'add') {
            return 'Add vendor/client number plan'
        } else if (this.activeIndex === 'edit') {
            return 'Edit vendor/client number plan'
        } else if (this.activeIndex === 'editDestination') {
            return 'Edit destination'
        } else if (this.activeIndex === 'editCountry') {
            return 'Edit country'
        }
        return 'unKnow'
    }

    /* 高级搜索成功回调 */
    private SearchOk(formData: any) {
        const data: any = {
            params: formData
        };
        getVendorClientNumberPlan(data).then((res: any) => {
            if (res.code > -1) {
                this.data = res.data;
            }
        });
    }

    private async searchSelectChange(formData: any, init ? : boolean) {
        // 选择的sourceType没有变 return
        if (this.oldSourceType === formData.sourceType) return
        // console.log(formData);
        const sourceOptions: selectOptionsInterface[] = await this.getSource(formData, init, () => {
            (this.$refs.AdvancedSearch as any).setFieldsValue({
                'sourceId': undefined
            })
        })
        // console.log('sourceOptions', sourceOptions);
        this.searchFormOptions[2].options = sourceOptions
        this.oldSourceType = formData.sourceType
    }

    // 获取source 下拉框 options  requestBeforeFn 请求前执行
    private async getSource(formData: any, init ? : boolean, requestBeforeFn ? : Function) {
        // this.loseEfficacyLoading()
        // 根据sourceType取值，如果为1从VendorSource中取，为2则从ClientSource中取
        let request: any
        if (formData.sourceType === 1) {
            request = VendorSourceList
        } else if (formData.sourceType === 2) {
            request = ClientSourceList
        }
        if (request) {
            // 清空之前选择的数据 非第一次进来时
            if (!init) {
                typeof requestBeforeFn === 'function' && requestBeforeFn()
            }
            const res: any = await request({
                params: {
                    loseLoading: true
                }
            })
            return resolveSelectResponed(res, [{
                oldKey: 'id',
                newKey: 'value'
            }])
        }
        return []
    }

    private onBtnClick(name: string) {
        if (name === 'reset') {
            this.searchSelectChange({
                sourceType: this.searchFormOptions[1].initialValue
            }, true)
        }
    }

    // formGroupSelectChange
    private async formGroupSelectChange(formData: any, name: string) {
        this.$nextTick(async () => {
            console.log('formData', formData, 'name', name);
            if (name === 'sourceType') {
                // 选择的sourceType没有变 return
                if (this.oldSourceTypeFormGroup !== formData.sourceType) {
                    const sourceOptions: selectOptionsInterface[] = await this.getSource(formData, false, () => {
                        (this.$refs.formGroup as any).setFieldsValue({
                            'sourceId': undefined
                        })
                    })
                    // console.log('sourceOptions', sourceOptions);
                    this.addFormGroupOptions[2].options = sourceOptions
                    this.oldSourceTypeFormGroup = formData.sourceType
                }
            }
            if (this.activeIndex === 'add') {
                let sourceObject: any, sourceTypeObject: any
                if (formData.sourceId && this.addFormGroupOptions[2].options) {
                    sourceObject = (this.addFormGroupOptions[2].options as any).find((item: any) => item.value === formData.sourceId)
                }
                if (formData.sourceType && this.addFormGroupOptions[1].options) {
                    sourceTypeObject = (this.addFormGroupOptions[1].options as any).find((item: any) => item.value === formData.sourceType)
                }
                (this.$refs.formGroup as any).setFieldsValue({
                    'vendorClientNpName': (sourceObject ? sourceObject.name : '') + '-' + (sourceTypeObject ? sourceTypeObject.name : '') + '-Service-' + moment().format('YYYYMMDD')
                })
            }
        })
    }
    /* 用户手动选择/取消选择所有列的回调  Table -> 回调 */
    private onSelectAll(selected: boolean, selectedRows: any, changeRows: any) {
        this.changeDisabled(selectedRows);
    }

    private onSelect(record: object, selected: boolean, selectedRows: any) {
        console.log(selectedRows, selected, record);
        this.changeDisabled(selectedRows)
    }

    // 修改table上方按钮disabled状态
    private changeDisabled(selectedRows: any) {
        this.selectedBtn.forEach((item: selectedBtnInterface) => {
            if (item.index === 'edit' || item.index === 'editDestination' || item.index === 'editCountry') {
                item.disabled = selectedRows.length !== 1
            } else if (item.index === 'export') {
                item.disabled = this.data.length === 0
            } else if (item.index === 'delete') {
                item.disabled = selectedRows.length === 0
            }
        })
    }

    // modal 保存按钮
    private save(values: any): void {
        switch (this.activeIndex) {
            case 'add':
            case 'edit':
                const formData: any = (this.$refs.formGroup as any).validateFields()
                console.log('formData', formData);
                if (formData) {
                    const data: any = Object.assign({}, formData, this.activeIndex == 'edit' ? {
                        id: this.idArr[0]
                    } : {})
                    let request: any = editVendorClientNumberPlan
                    if (this.activeIndex === 'add') {
                        request = addVendorClientNumberPlan
                    }
                    request(data).then((res: any) => {
                        if (res.code > 0) {
                            this.$message.success(res.msg);
                            this.visible = false;
                            this.SearchOk((this.$refs.AdvancedSearch as any).getFieldsValue())
                        }
                    });
                }
                break;
            case 'editDestination':
                this.visible = false
                break;
            case 'editCountry':
                this.visible = false
                break;
        }

    }

    // table 上方按钮点击回调
    private async activeClick({
        name,
        index
    }: any, selectedKey: any, selectedData: any) {
        this.activeIndex = index
        console.log(name, index, 'selectedData', selectedData, selectedKey);
        this.idArr = selectedKey
        this.refnumberplanname = selectedData.map((item: any) => item.vendorClientNpName).join(','); //获取传递name
        const data: any = selectedData[0]
        switch (index) {
            case 'add':
                this.addFormGroupOptions = deepClone(addFormGroupOptions)
                this.visible = true
                break;
            case 'edit':
                const sourceOptions: any = await this.getSource(data)
                // console.log(sourceOptions);
                // this.addFormGroupOptions[2].options = sourceOptions
                this.addFormGroupOptions.forEach((formGroupItem: any) => {
                    for (const key in data) {
                        if (formGroupItem.decorator === key) {
                            if (key === 'sourceId') {
                                formGroupItem.options = sourceOptions
                                // sourceId 为0时为空
                                formGroupItem.initialValue = data[key] == 0 ? undefined : data[key]
                            } else {
                                formGroupItem.initialValue = data[key]
                            }
                        }
                    }
                    formGroupItem.disabled = formGroupItem.decorator !== 'status' && formGroupItem.decorator !== 'remark'

                })
                this.visible = true
                break;
            case 'editDestination':
                this.visible = true
                break;
            case 'editCountry':
                this.visible = true
                break;
            case 'delete':
                // id就是 selectedKey  因为parentKey传了id
                deleteVendorClientNumberPlan(selectedKey).then((res: any) => {
                    if (res.code > 0) {
                        this.$message.success(res.msg)
                        this.SearchOk((this.$refs.AdvancedSearch as any).getFieldsValue())
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                break;
            case 'export':
                downloadExcel(this.columns, this.data, `Vendor/Client Number plan`, "Vendor/Client Number plan");
                break;

        }
    }

    /* 退出 */
    private handleReturn() {
        this.visible = !this.visible;
    }

    private created() {
        this.searchSelectChange({
            sourceType: this.searchFormOptions[1].initialValue
        }, true)
        // 高级搜索 numberplan 下拉框
        getVendorClientNumberPlanNames().then((res: any) => {
            const numberPlanNames: selectOptionsInterface[] = resolveSelectResponed(res)
            this.searchFormOptions[0].options = numberPlanNames
        })
    }

}
</script>

<style lang="scss">

</style>
