<template>
<div>
    <!-- 高级搜索 -->
    <Advanced-search autoClearSearchValue :formoptions="formOptions" :isChildName="true" allowClear @Submit="SearchOk" ref="AdvancedSearch" />
    <!-- 表格 -->
    <Table parentKey="id" :isFinance="true" :isNeedCheck="true" :selectedBtn="Formscreening" @onSelectClick="activeClick" @onSelectAll="onSelectAll" @onSelect="onSelect" :columns="columns" :data="data" zebraStripe />
    <!-- 模态框弹出 -->
    <Model align-title="center" :height="'auto'" v-model="visible" shade :title="getModalTitle" @Screencover="Screencover">
        <template slot="model-body">
            <!-- edit -->
            <form-group  v-if="activeIndex === 2 && visible" :formoptions="addFormGroupOptions" :span="12" ref="formGroup" class="form-group"></form-group>
            <!--  edit destination-->
            <edit-destination v-if="activeIndex ===3 && visible" ref="editdestination" :refnumberplanname="refnumberplanname" :refnumberplanid="refnumberplanid" ></edit-destination>
            <!--  editcountry-->
            <edit-country v-if="activeIndex ===4 && visible" ref="editcoutry" :refnumberplanid="refnumberplanid"></edit-country>

        </template>
        <template slot="model-footer" v-if="activeIndex ===2">
            <a-row>
                <a-col :span="24" :style="{ textAlign: 'center' }">
                    <div style="margin-top:10px;">
                        <a-button type="primary" style="border-radius:50px;min-width:75px;" @click="editllData">Save </a-button>
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
import moment from "moment";
import {
    columnsConfigs,
    formOptionsConfigs
} from "./refnumberplanConfig";
import {
    RefNumberPlan,
    RefNumberPlanAdd,
    RefNumberPlanEdit,
    RefNumberPlanDelete,
    ClientSourceNumberPlanList,
    getDetailService
} from "@/api/index";
import {columnsData,formOptionsData,FormscreeningData,addFormGroupOptionsData} from './config'
import xlsx, {
    stream
} from 'xlsx'
import {
    recodeConfig,
    refsConfig
} from '@/assets/ts/config.d'
import {
    AxiosGet
} from '@/api/axios';
import {
    getExpData
} from '@/views/Trade/sellPrice/method'
import {
    onSelectClick
} from '@/views/Configuration/Exports'

@Component({
    components: {
        AdvancedSearch: resolve =>
            require(["@/common/Advancedsearch/index.vue"], resolve),
        pagination: resolve => require(["@/common/pagination/index.vue"], resolve),
        Model: resolve => require(["@/common/Model/index.vue"], resolve),
        contractDetials: resolve =>
            require(["@/components/AddNewContract/contractDetails/index.vue"], resolve),
        formGroup: () => import("@/views/Finance/components/form-group/index.vue"),
        editCountry: resolve =>
            require(["./EditCoutrys/editcoutry.vue"], resolve),
        editDestination: resolve =>
            require(["./Editdestinations/Editdestination.vue"], resolve),
        Table: () => import("@/views/Finance/components/Table/index.vue")
    }
})
export default class RefNumberPlans extends Vue {
    private values = {};
    public $refs: refsConfig | any
    // private detailsId: any;
    private relatedContract: string = "";
    private refnumberplanid: any;
    private refnumberplanname:any;
    private activeIndex: number = 0;
    private columns: columnsConfigs[] = columnsData //表头数据
    private contractDatas: any = [];
    public data: any = [];
    private formOptions: formOptionsConfigs[] = formOptionsData  //高级搜索数据
    private Formscreening: any[] = FormscreeningData  //操作栏数据
    private addFormGroupOptions: any[] = addFormGroupOptionsData //编辑的数据
    private get getModalTitle(): string {
        if (this.activeIndex === 2) {
            return 'Reference  Number Plan Edit'
        } else if (this.activeIndex === 3) {
            return 'Edit destination'
        } else if (this.activeIndex === 4) {
            return 'Edit country'
        }
        return 'unKnow'
    }

    public created() {
        getExpData({
            data: this.formOptions,
            fns: [ClientSourceNumberPlanList, getDetailService],
        });
         getDetailService("").then((res: recodeConfig) => {
            // console.log(res);
            this.addFormGroupOptions[2]['options'] = res.data
        })
        
    }

    /* 操作栏点击 -> 回调 */
    public async SearchOk(values: any) {
        console.log(values);
        let data: any = {
            params: Object.assign({}, values, {})
        };
        console.log(data);
        await RefNumberPlan(data).then((res: any) => {
            this.data = res.data;
        });
        this.data.map((item: any, index: number) => {
            // console.log(item.detailList);
            // console.log(innerItem.type)
            if (item.direction === 1) {
                item.direction = 'Inbound'
            } else if (item.direction === 2) {
                item.direction = 'Outbound'
            }
            if (item.status === 1) {
                item.status = 'Active'
            } else if (item.status === 2) {
                item.status = 'Invalid'
            }
        });
    }

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
    //     if (selectedRows.length) {
    //         this.detailsId = selectedRows[0].id;
    //     }
    console.log(2222);
    
        this.Formscreening.forEach((item: any) => {
            if (item.index !== 6) {
                item.disabled = selectedRows.length !== 1
            } else if (item.index === 6) {
                item.disabled = this.data.length === 0
            } 
        })
    }
    /* 点击切换页 分页(pagination) -> 回调 */
    public onChang(pageSize: number) {
        // console.log(pageSize)
    }
    // 编辑保存
    public editllData(values: any): void {
        let that: any = this;
        if (this.activeIndex == 2) {
            let obj = JSON.parse(JSON.stringify(that.$refs.formGroup.form.getFieldsValue()));
            console.log(obj);
            let {
                direction,
                configServiceIdList,
                numberPlanName,
                status,
                remark,
            } = obj;
            let id = this.refnumberplanid
            console.log(remark);
            direction = direction == 'Inbound' ? 1 : direction || direction == 'Outbound' ? 2 : direction
            status = status == 'Active' ? 1 : status || status == 'Invalid' ? 2 : status
            configServiceIdList = configServiceIdList.join(',');
            let edit = {
                direction,
                remark,
                id,
                configServiceIdList,
                status,
                numberPlanName
            }
            console.log(edit);
            RefNumberPlanEdit(edit).then((res: any) => {
                if (res.code >= 1) {
                    that.visible = !that.visible;
                    that.$message.success("Successful addition");
                    this.$set(this.Formscreening[1], 'disabled', true)
                    this.$set(this.Formscreening[2], 'disabled', true)
                    this.$set(this.Formscreening[2], 'disabled', true)
                    setTimeout(() => {
                        this.SearchOk(this.$refs.AdvancedSearch.getFieldsValue())
                    }, 100)
                }
            });
        }
    }
    private visible: any = false;
    public async activeClick({
        name,
        index
    }: any, selected: any, selectedData: any,activeObJ:any) {
        this.activeIndex = index
        console.log(selectedData);
        const deleted = selectedData.map((item: any) => item.id).join(",") //多选删除
        this.refnumberplanid = deleted;//获取传递id
        const refnumname= selectedData.map((item: any) => item.numberPlanName).join(',');//获取传递name  
        this.refnumberplanname =refnumname;
        if(index == 2 ){
             this.activeIndex = 2;
            if (activeObJ === undefined) {
            let serviceName = this.values[0].serviceName.split(",");
            this.addFormGroupOptions[0].initialValue = this.values[0].direction;
            this.addFormGroupOptions[1].initialValue = this.values[0].numberPlanName;
            this.addFormGroupOptions[2].initialValue = serviceName
            this.addFormGroupOptions[3].initialValue = this.values[0].status;
            this.addFormGroupOptions[4].initialValue = this.values[0].remark;
            }
        }
        /**export按钮 */
        if (index == 6) {
            // this.onSelectClick(activeObJ)
            onSelectClick(this.columns, this.data, `Reference Number plan`, "Reference Number plan");
        }
        index !== 6 && (this.visible = !this.visible)
    }

    public updated(data: any) {
        // console.log('改变')
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
