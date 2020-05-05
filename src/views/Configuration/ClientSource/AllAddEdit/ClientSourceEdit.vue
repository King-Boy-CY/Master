<template>
<div>
    <!-- 表格 -->
    <div class="top-content">
        <form-group :formoptions="baseInfoFormOptions" :span="12" ref="baseInfoFormGroup" class="form-group" @sendChild="sendChild" @selectChange="handleChange">

        </form-group>
    </div>

    <!-- Agreement account -->
    <Model align-title="center" v-model="showAccount" shade title="Agreement account" @Screencover="openAccount">
        <template slot="model-body">
            <div>
                <div :style="'margin:10px 20px;'">
                    <div :style="'background:#fff;margin-top:20px;padding:0px 0px;'">
                    </div>
                    <div class="menu-child">
                        <client-source-account ref="clientSourceAccount" @confirmAccount="confirmAccount" />
                    </div>
                </div>
            </div>
        </template>
        <template slot="model-footer">
            <a-row>
                <a-col :span="24" :style="{ textAlign: 'center' }">
                    <div style="margin-top:10px;">
                        <a-button type="primary" :style="{ borderRadius: '50px 50px 50px 50px' }" @click="InsertAccount">Insert</a-button>
                        <a-button :style="{ marginLeft: '8px', color: '#1890ff', borderRadius: '50px 50px 50px 50px', border: '1px solid #1890ff', fontWeight: '600' }" @click="accountReturn(1)">Return</a-button>
                    </div>
                </a-col>
            </a-row>
        </template>
    </Model>

    <!-- Number plan -->
    <!-- <Model align-title="center" v-model="showNumberplan" shade title="Number plan" @Screencover="openNumberplan">
        <template slot="model-body">
            <div>
                <div :style="'margin:10px 20px;'">
                    <div :style="'background:#fff;margin-top:20px;padding:0px 0px;'">
                    </div>
                    <div class="menu-child">
                        <client-source-numberplan ref="clientSourceNumberplan" @confirmNumberplan="confirmNumberplan" />
                    </div>
                </div>
            </div>
        </template>
        <template slot="model-footer">
            <a-row>
                <a-col :span="24" :style="{ textAlign: 'center' }">
                    <div style="margin-top:10px;">
                        <a-button type="primary" :style="{ borderRadius: '50px 50px 50px 50px' }" @click="InsertNumberplan">Insert</a-button>
                        <a-button :style="{ marginLeft: '8px', color: '#1890ff', borderRadius: '50px 50px 50px 50px', border: '1px solid #1890ff', fontWeight: '600' }" @click="numberplanReturn(1)">Return</a-button>
                    </div>
                </a-col>
            </a-row>
        </template>
    </Model> -->

    <!-- Reference price list -->
    <!-- <Model align-title="center" v-model="showReferencepricelist" shade title="Reference price list" @Screencover="openReference">
        <template slot="model-body">
            <div>
                <div :style="'margin:10px 20px;'">
                    <div :style="'background:#fff;margin-top:20px;padding:0px 0px;'">
                    </div>
                    <div class="menu-child">
                        <client-source-reference ref="clientSourceReference" />
                    </div>
                </div>
            </div>
        </template>
        <template slot="model-footer">
            <a-row>
                <a-col :span="24" :style="{ textAlign: 'center' }">
                    <div style="margin-top:10px;">
                        <a-button type="primary" :style="{ borderRadius: '50px 50px 50px 50px' }">Insert</a-button>
                        <a-button :style="{ marginLeft: '8px', color: '#1890ff', borderRadius: '50px 50px 50px 50px', border: '1px solid #1890ff', fontWeight: '600' }" @click="referenceReturn(1)">Return</a-button>
                    </div>
                </a-col>
            </a-row>
        </template>
    </Model> -->

    <!-- Exclude destination of client price list -->
    <Model align-title="center" v-model="showExcludedestination" shade title="Exclude destination of client price list" @Screencover="openExclude">
        <template slot="model-body">
            <div>
                <div :style="'margin:10px 20px;'">
                    <div :style="'background:#fff;margin-top:20px;padding:0px 0px;'">
                    </div>
                    <div class="menu-child">
                        <client-source-exclude ref="clientSourceExclude" @confirmExclude="confirmExclude" :getExclude="getExclude"/>
                    </div>
                </div>
            </div>
        </template>
        <template slot="model-footer">
            <a-row>
                <a-col :span="24" :style="{ textAlign: 'center' }">
                    <div style="margin-top:10px;">
                        <a-button type="primary" :style="{ borderRadius: '50px 50px 50px 50px' }" @click="InsertExclude">Insert</a-button>
                        <a-button :style="{ marginLeft: '8px', color: '#1890ff', borderRadius: '50px 50px 50px 50px', border: '1px solid #1890ff', fontWeight: '600' }" @click="excludeReturn(1)">Return</a-button>
                    </div>
                </a-col>
            </a-row>
        </template>
    </Model>

</div>
</template>

<script lang="ts">
/**Plugin */
import Vue from "vue";
import {
    Component,
    Prop,
    Emit
} from "vue-property-decorator";
import {
    baseInfoFormOptions
} from "../ClientSourceList";
import {
    refsConfig,
    recodeConfig
} from "@/assets/ts/config.d";
import {
    AxiosGet
} from "@/api/axios";
import {
    getDetailService,
    ClientSourceSalesList,
    ClientSourceQcomList,
    ClientSourceRefList,
    ClientSourceNameList
} from "@/api/index.ts";

/**组件 */
@Component({
    components: {
        formGroup: () => import("@/views/Finance/components/form-group/index.vue"),
        Model: resolve => require(["@/common/Model/index.vue"], resolve),
        clientSourceAccount: resolve => require(["./clientSourceAccount.vue"], resolve),
        clientSourceNumberplan: resolve => require(["./clientSourceNumberplan.vue"], resolve),
        clientSourceReference: resolve => require(["./clientSourceReference.vue"], resolve),
        clientSourceExclude: resolve => require(["./clientSourceExclude.vue"], resolve),
    }
})

export default class ClientSourceEdit extends Vue {
    @Emit('confirmData') confirmData(msg ? : any) {}
    @Prop() addEdit: any;
    public $refs: refsConfig | any;
    private inAccount: any;
    private inNumberplan: any;
    private inExclude: any;
    private getExclude: object = {};

    /**子表格 */
    private clientSourceAccount: string = "clientSourceAccount";
    private clientSourceNumberplan: string = "clientSourceNumberplan";
    private clientSourceReference: string = "clientSourceReference";
    private clientSourceExclude: string = "clientSourceExclude";
    /**子表格状态 */
    private showAccount: boolean = false;
    private showNumberplan: boolean = false;
    private showReferencepricelist: boolean = false;
    private showExcludedestination: boolean = false;

    /**Add 属性 */
    private baseInfoFormOptions: any[] = baseInfoFormOptions;

    /**显示子表格 */
    public openAccount() {
        this.showAccount = !this.showAccount
    }
    // public openNumberplan() {
    //     this.showNumberplan = !this.showNumberplan
    // }
    // public openReference() {
    //     this.showReferencepricelist = !this.showReferencepricelist
    // }
    public openExclude() {
        this.showExcludedestination = !this.showExcludedestination
    }

    /**open子表格 */
    private sendChild(values: any) {
        if (values.Tips == "Agreement account") {
            this.showAccount = !this.showAccount
        }
        if (values.Tips == "Number plan") {
            this.showNumberplan = !this.showNumberplan
        }
        if (values.Tips == "Reference price list") {
            this.showReferencepricelist = !this.showReferencepricelist
        }
        if (values.Tips == "Exclude destination of client price list") {
            this.showExcludedestination = !this.showExcludedestination
        }
    }
    /**监听 */
    private handleChange(values: any) {
        const baseInfoFormGroup = this.$refs.baseInfoFormGroup
        let value = {}
        let routeClassArr: any;
        if (values.referencePriceList) {
            routeClassArr = values.referencePriceList.split("-")[1]
            value['routeClass'] = routeClassArr
            baseInfoFormGroup.setFieldsValue(value)
        } else {
            this.baseInfoFormOptions[7].initialValue = ""
        }
        if (values.numberPlanList) {
            this.baseInfoFormOptions[8].disabled = false
            this.baseInfoFormOptions[5].disabled = false
            this.baseInfoFormOptions[4].initialValue = values.numberPlanList
        } else {
            this.baseInfoFormOptions[8].disabled = true
            this.baseInfoFormOptions[5].disabled = true
            this.baseInfoFormOptions[4].initialValue = ""
        }
        this.confirmData(routeClassArr)
    }

    /**获取选中数据 */
    public confirmAccount(msg) {
        this.inAccount = msg
    }
    // public confirmNumberplan(msg) {
    //     this.inNumberplan = msg
    // }
    public confirmExclude(msg) {
        this.inExclude = msg
    }

    /**InsertAccount */
    public InsertAccount(values ? : any): void {
        const baseInfoFormGroup = this.$refs.baseInfoFormGroup
        let value = {}
        value["accountName"] = this.inAccount[0].accountName
        baseInfoFormGroup.setFieldsValue(value)
        this.openAccount()
    }
    /**InsertNumberplan */
    // public InsertNumberplan(values ? : any): void {
    //     this.inNumberplan.map((item: any) => {
    //         this.baseInfoFormOptions[4]["initialValue"] = item.numberPlanName
    //         if (item.direction == 1) {
    //             this.baseInfoFormOptions[5].disabled = false;
    //         } else {
    //             this.baseInfoFormOptions[5].disabled = true;
    //         }
    //     })
    //     if (this.baseInfoFormOptions[4]["initialValue"]) {
    //         this.baseInfoFormOptions[8]['disabled'] = false
    //     }
    //     this.openNumberplan()
    // }
    /**InsertExclude */
    public InsertExclude(values ? : any): void {
        const baseInfoFormGroup = this.$refs.baseInfoFormGroup
        let value = {}
        let arr = this.inExclude.map((item: any) => item.destinationName).join(",")
        // this.baseInfoFormOptions[8]["initialValue"] = arr
        value['excludeDestinationList'] = arr
        baseInfoFormGroup.setFieldsValue(value)
        this.openExclude()
    }

    /**Return */
    accountReturn(msg: any) {
        let that: any = this
        if (msg == 1) {
            this.$confirm({
                title: 'Close Tip',
                content: 'Continue to exit?',
                okText: 'yes',
                cancelText: 'no',
                onOk() {
                    that.openAccount(msg)
                }
            });
        } else {
            that.openAccount(msg)
        }
    }
    // numberplanReturn(msg: any) {
    //     let that: any = this
    //     if (msg == 1) {
    //         this.$confirm({
    //             title: 'Close Tip',
    //             content: 'Continue to exit?',
    //             okText: 'yes',
    //             cancelText: 'no',
    //             onOk() {
    //                 that.openAccount(msg)
    //             }
    //         });
    //     } else {
    //         that.openAccount(msg)
    //     }
    // }
    // referenceReturn(msg: any) {
    //     let that: any = this
    //     if (msg == 1) {
    //         this.$confirm({
    //             title: 'Close Tip',
    //             content: 'Continue to exit?',
    //             okText: 'yes',
    //             cancelText: 'no',
    //             onOk() {
    //                 that.openAccount(msg)
    //             }
    //         });
    //     } else {
    //         that.openAccount(msg)
    //     }
    // }
    excludeReturn(msg: any) {
        let that: any = this
        if (msg == 1) {
            this.$confirm({
                title: 'Close Tip',
                content: 'Continue to exit?',
                okText: 'yes',
                cancelText: 'no',
                onOk() {
                    that.openExclude(msg)
                }
            });
        } else {
            that.openExclude(msg)
        }
    }

    /**created */
    public created() {
        let ServiceData = this.addEdit.serviceList.split(",")
        let Distaf = this.addEdit.numberPlanList? false : true
        let excludeDe = this.addEdit.excludeDestinationList == "undefined"? "" : this.addEdit.excludeDestinationList
        this.baseInfoFormOptions[0]["initialValue"] = this.addEdit.clientName
        this.baseInfoFormOptions[0]["disabled"] = true
        this.baseInfoFormOptions[1]["initialValue"] = this.addEdit.status == "Invalid"? 2 : 1
        this.baseInfoFormOptions[2]["initialValue"] = this.addEdit.accountList
        this.baseInfoFormOptions[3]["initialValue"] = ServiceData
        this.baseInfoFormOptions[4]["initialValue"] = this.addEdit.numberPlanList
        this.baseInfoFormOptions[5]["initialValue"] = this.addEdit.qualityCommitment
        this.baseInfoFormOptions[6]["initialValue"] = this.addEdit.referencePriceList
        this.baseInfoFormOptions[5].disabled = Distaf
        this.baseInfoFormOptions[7]["initialValue"] = this.addEdit.routeClass
        this.baseInfoFormOptions[8]["initialValue"] = excludeDe
        this.baseInfoFormOptions[8].disabled = Distaf
        this.baseInfoFormOptions[9]["initialValue"] = this.addEdit.email
        this.baseInfoFormOptions[10]["initialValue"] = this.addEdit.timeZone
        this.baseInfoFormOptions[11]["initialValue"] = this.addEdit.rateIncreaseNoticePeriond
        this.baseInfoFormOptions[12]["initialValue"] = this.addEdit.rateDecreaseNoticePeriond
        this.baseInfoFormOptions[13]["initialValue"] = this.addEdit.sales
        this.baseInfoFormOptions[14]["initialValue"] = this.addEdit.remark

        ClientSourceSalesList('').then((res: any) => {
            this.baseInfoFormOptions[13]["options"] = res.data
        })
        ClientSourceQcomList('').then((res: any) => {
            this.baseInfoFormOptions[5]["options"] = res.data
        })
        getDetailService('').then((res: any) => {
            this.baseInfoFormOptions[3]["options"] = res.data
        })
        ClientSourceNameList('').then((res: any) => {
            this.baseInfoFormOptions[4]['options'] = res.data
        })
        let refPriceList: any[] = ["RPL-Gold-Asia-2019", "RPL-Silver-Asia-2019", "RPL-Branz-Asia-2019", "RPL-Gold-America-2019", "RPL-Silver-America-2019", "RPL-Gold-Europe-2019"]
        this.baseInfoFormOptions[6]["options"] = refPriceList
        this.getExclude = this.addEdit.id
    }
}
</script>

<style lang="scss">
.Account-button {
    width: 50px;
    position: absolute;
    top: -495px;
    text-align: center;
    right: 51%;
}

.Number-button {
    width: 50px;
    position: absolute;
    top: -431px;
    text-align: center;
    right: 51%;
}

.Reference-button {
    width: 50px;
    position: absolute;
    top: -367px;
    text-align: center;
    right: 51%;
}

.Exclude-button {
    width: 50px;
    position: absolute;
    top: -302px;
    text-align: center;
    right: 51%;
}
</style>
