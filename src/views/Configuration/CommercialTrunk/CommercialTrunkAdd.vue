<template>
<div>
    <div class="top-content">
        <form-group :formoptions="baseInfoFormOptions" :span="10" ref="baseInfoFormGroup" class="form-group" @sendChild="sendChild" />
    </div>

    <!-- Technical trunk -->
    <Model align-title="center" v-model="showTechnicalTrunk" shade title="TechnicalTrunk" @Screencover="openTechnicalTrunk">
        <template slot="model-body">
            <div>
                <div :style="'margin:10px 20px;'">
                    <div :style="'background:#fff;margin-top:20px;padding:0px 0px;'">
                    </div>
                    <div class="menu-child">
                        <Technical-trunk-child @confirmTechnical="confirmTechnical" />
                    </div>
                </div>
            </div>
        </template>
        <template slot="model-footer">
            <a-row>
                <a-col :span="24" :style="{ textAlign: 'center' }">
                    <div style="margin-top:10px;">
                        <a-button type="primary" :style="{ borderRadius: '50px 50px 50px 50px' }" @click="InsertTechnical">Insert</a-button>
                        <a-button :style="{ marginLeft: '8px', color: '#1890ff', borderRadius: '50px 50px 50px 50px', border: '1px solid #1890ff', fontWeight: '600' }" @click="TechnicalTrunkReturn(1)">Return</a-button>
                    </div>
                </a-col>
            </a-row>
        </template>
    </Model>

    <!-- Account -->
    <Model align-title="center" v-model="showAccount" shade title="Vendor" @Screencover="openAccount">
        <template slot="model-body">
            <div>
                <div :style="'margin:10px 20px;'">
                    <div :style="'background:#fff;margin-top:20px;padding:0px 0px;'">
                    </div>
                    <div class="menu-child">
                        <Account-child @confirmDataAccount="confirmDataAccount" />
                    </div>
                </div>
            </div>
        </template>
        <template slot="model-footer">
            <a-row>
                <a-col :span="24" :style="{ textAlign: 'center' }">
                    <div style="margin-top:10px;">
                        <a-button type="primary" :style="{ borderRadius: '50px 50px 50px 50px' }" @click="InsertAccount">Insert</a-button>
                        <a-button :style="{ marginLeft: '8px', color: '#1890ff', borderRadius: '50px 50px 50px 50px', border: '1px solid #1890ff', fontWeight: '600' }" @click="AccountReturn(1)">Return</a-button>
                    </div>
                </a-col>
            </a-row>
        </template>
    </Model>
</div>
</template>

<script lang="ts">
// 插件
import Vue from "vue";
import {
    Component
} from "vue-property-decorator";
import {
    refsConfig,
    recodeConfig
} from "@/assets/ts/config.d";

/**组件 */
@Component({
    components: {
        formGroup: () => import("@/views/Finance/components/form-group/index.vue"),
        Model: resolve => require(["@/common/Model/index.vue"], resolve),
        TechnicalTrunkChild: resolve => require(["./TechnicalTrunkChild.vue"], resolve),
        AccountChild: resolve => require(["./AccountChild.vue"], resolve)
    }
})

export default class CommercialTrunkAdd extends Vue {
    private TechnicalTrunkChild: string = "TechnicalTrunkChild";
    private AccountChild: string = "AccountChild";
    public $refs: refsConfig | any;
    private showTechnicalTrunk: boolean = false;
    private showAccount: boolean = false;
    private insertAccount: any;
    private insertTechnical: any;

    /**选项 */
    private StatusOptions = [{
        name: "Active",
        value: 1
    }, {
        name: "Invalid",
        value: 2
    }]
    private directionOptions = [{
        name: "Inbound",
        value: 1
    }, {
        name: "Outbound",
        value: 2
    }, {
        name: "Bilateral",
        value: 3
    }]
    /**属性 */
    private baseInfoFormOptions: any[] = [{
        Tips: "Commercial trunk",
        decorator: "commercialTrunkName",
        required: true,
        type: "input",
        options: null
    }, {
        Tips: "Technical trunk",
        decorator: "technicalTrunkName",
        required: false,
        type: "child",
        options: null,
        initialValue: null
    }, {
        Tips: "Vendor",
        decorator: "vendorName",
        required: true,
        type: "child",
        options: null,
        initialValue: ""
    }, {
        Tips: "Account",
        decorator: "accountName",
        required: true,
        type: "input",
        options: null,
        initialValue: "",
        disabled: true
    }, {
        Tips: "Status",
        decorator: "status",
        required: true,
        type: "select",
        options: this.StatusOptions,
        initialValue: 1
    }, {
        Tips: "Direction",
        decorator: "direction",
        required: true,
        type: "select",
        options: this.directionOptions,
        initialValue: 1
    }, {
        Tips: "Begin date",
        decorator: "beginDate",
        required: true,
        type: "picker",
        options: null,
        initialValue: ""
    }, {
        Tips: "End date",
        decorator: "endDate",
        required: false,
        type: "picker",
        options: null,
        initialValue: "2099-12-31"
    }, {
        Tips: "Remark",
        decorator: "remark",
        require: false,
        type: "textarea",
        span: 20,
        labelSpan: 5
    }]

    /**OpenChildTable */
    private sendChild(value: any) {
        if(value.Tips == "Technical trunk") {
            this.showTechnicalTrunk = !this.showTechnicalTrunk
        }
        if(value.Tips == "Vendor") {
            this.showAccount = !this.showAccount
        }
    }

    /**传值 */
    public confirmDataAccount(msg) {
        this.insertAccount = msg
    }
    public confirmTechnical(msg) {
        this.insertTechnical = msg
    }

    /**openTechnicalTrunk */
    public openTechnicalTrunk() {
        this.showTechnicalTrunk = !this.showTechnicalTrunk
    }
    /**openAccount */
    public openAccount() {
        this.showAccount = !this.showAccount
    }
    /**TechnicalTrunkReturn */
    TechnicalTrunkReturn(msg: any) {
        let that: any = this
        if (msg == 1) {
            this.$confirm({
                title: 'Close Tip',
                content: 'Continue to exit?',
                okText: 'yes',
                cancelText: 'no',
                onOk() {
                    that.openTechnicalTrunk(msg)
                }
            });
        } else {
            that.openTechnicalTrunk(msg)
        }
    }
    /**AccountReturn */
    AccountReturn(msg: any) {
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


    /**InsertAccount */
    public InsertAccount(values ? : any): void {
        const baseInfoFormGroup = this.$refs.baseInfoFormGroup
        let value = {}
        value['vendorName'] = this.insertAccount[0].vendorName.initialValue
        value['accountName'] = this.insertAccount[0].accountName.initialValue
        baseInfoFormGroup.setFieldsValue(value)
        // console.log(this.insertAccount)
        this.openAccount()
    }

    /**InsertTechnical */
    public InsertTechnical(values ? : any): void {
        const baseInfoFormGroup = this.$refs.baseInfoFormGroup
        let value = {}
        let arr = this.insertTechnical.map((item: any) => item.technicalTrunkName).join(",")
        value['technicalTrunkName'] = arr
        // this.baseInfoFormOptions[1]["initialValue"] = arr
        baseInfoFormGroup.setFieldsValue(value)
        this.openTechnicalTrunk()
    }

    /**生成created */
    public created() {
        let NowDate = new Date()
        let NowTime = `${NowDate.getFullYear()}-${NowDate.getMonth() + 1 > 9 ? NowDate.getMonth() + 1 : "0" + NowDate.getMonth()}-${NowDate.getDate() > 9? NowDate.getDate() : "0" + NowDate.getDate()}`
        this.baseInfoFormOptions[6]["initialValue"] = NowTime
    }
}
</script>

<style lang="scss">

</style>
