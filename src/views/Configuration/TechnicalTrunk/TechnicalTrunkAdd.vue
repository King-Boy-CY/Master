<template>
<div>
    <div class="top-content">
        <form-group :formoptions="baseInfoFormOptions" :span="10" ref="baseInfoFormGroup" class="form-group" @sendChild="sendChild" />
    </div>

    <!-- Commercial trunk -->
    <Model align-title="center" v-model="showCommercial" shade title="CommercialTrunk" @Screencover="openCommercial">
        <template slot="model-body">
            <div>
                <div :style="'margin:10px 20px;'">
                    <div :style="'background:#fff;margin-top:20px;padding:0px 0px;'">
                    </div>
                    <div class="menu-child">
                        <Technical-commercial @confirmData="confirmData"/>
                    </div>
                </div>
            </div>
        </template>
        <template slot="model-footer">
            <a-row>
                <a-col :span="24" :style="{ textAlign: 'center' }">
                    <div style="margin-top:10px;">
                        <a-button type="primary" :style="{ borderRadius: '50px 50px 50px 50px' }" @click="InsertData">Insert</a-button>
                        <a-button :style="{ marginLeft: '8px', color: '#1890ff', borderRadius: '50px 50px 50px 50px', border: '1px solid #1890ff', fontWeight: '600' }" @click="CommercialTrunkReturn(1)">Return</a-button>
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
import {
    VendorSourceList
} from "@/api/index.ts";

/**组件 */
@Component({
    components: {
        formGroup: () => import("@/views/Finance/components/form-group/index.vue"),
        Model: resolve => require(["@/common/Model/index.vue"], resolve),
        TechnicalCommercial: resolve => require(["./TechnicalCommercial.vue"], resolve)
    }
})

export default class TechnicalTrunkAdd extends Vue {
    private TechnicalCommercial: string = "TechnicalCommercial";
    public $refs: refsConfig | any;
    private showCommercial: boolean = false;
    private insertComm: any;

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
    private SwitchOptions = [{
        name: "IDD_West_1",
        value: 1
    }, {
        name: "IDD_West_2",
        value: 2
    }, {
        name: "IDD_Eest_3",
        value: 3
    }, {
        name: "IDD_North_2",
        value: 4
    }, {
        name: "IDD_Eest_4",
        value: 5
    }, {
        name: "IDD_Eest_5",
        value: 6
    }, {
        name: "IDD_Premium",
        value: 7
    }, {
        name: "IDD_West_Backup",
        value: 8
    }, {
        name: "IDD_Eest_Backup",
        value: 9
    }]

    /**属性 */
    private baseInfoFormOptions: any[] = [{
        Tips: "Technical trunk",
        decorator: "technicalTrunkName",
        required: true,
        type: "input",
        options: null
    }, {
        Tips: "Switch",
        decorator: "switchName",
        required: true,
        type: "select",
        options: null
    }, {
        Tips: "Trunk type",
        decorator: "trunkType",
        required: true,
        type: "input",
        options: null,
        initialValue: "China"
    }, {
        Tips: "CDR match",
        decorator: "cdrmatch",
        required: true,
        type: "input",
        options: null
    }, {
        Tips: "Status",
        decorator: "status",
        required: true,
        type: "select",
        options: this.StatusOptions,
        initialValue: 1
    }, {
        Tips: "Activated ports",
        decorator: "activatedPorts",
        required: false,
        type: "input",
        options: null,
        rules: [{
                validator: (rule: any, value: any, callback: any) => {
                    if (!value) {
                        callback()
                    }
                    const pattern: RegExp = new RegExp(/^[1-9]\d*$/, "g")
                    if (!pattern.test(value)) {
                        callback(`Only number is allowed for ${value}`)
                    } else {
                        callback()
                    }
                }
            }]
    }, {
        Tips: "Direction",
        decorator: "direction",
        required: true,
        type: "select",
        options: this.directionOptions,
        initialValue: 2
    }, {
        Tips: "Begin date",
        decorator: "beginDate",
        required: true,
        type: "picker",
        options: null
    }, {
        Tips: "End date",
        decorator: "endDate",
        required: true,
        type: "picker",
        options: null,
        initialValue: "2099-12-31"
    }, {
        Tips: "Termination switch",
        decorator: "terinationSwitch",
        required: true,
        type: "input",
        options: null
    }, {
        Tips: "Origination Point",
        decorator: "originationPoint",
        required: true,
        type: "input",
        options: null
    }, {
        Tips: "Destinaton Point",
        decorator: "destinationPoint",
        required: true,
        type: "input",
        options: null
    }, {
        Tips: "Trunk IP",
        decorator: "trunkIp",
        required: false,
        type: "input",
        options: null
    }, {
        Tips: "Remark",
        decorator: "remark",
        required: false,
        type: "textarea",
        span: 20,
        labelSpan: 5
    }]

    /**OpenChildTable */
    private sendChild(value: any) {
        if(value.Tips == "Commercial trunk") {
            this.openCommercial()
        }
    }

    /**openCommercial */
    public openCommercial() {
        this.showCommercial = !this.showCommercial
    }

    /**CommercialTrunkReturn */
    CommercialTrunkReturn(msg: any) {
        let that: any = this
        if (msg == 1) {
            this.$confirm({
                title: 'Close Tip',
                content: 'Continue to exit?',
                okText: 'yes',
                cancelText: 'no',
                onOk() {
                    that.openCommercial(msg)
                }
            });
        } else {
            that.openCommercial(msg)
        }
    }

    /**传值 */
    public confirmData(msg) {
        this.insertComm = msg
    }

    /**InsertData */
    public InsertData(values ? : any): void {
        const baseInfoFormGroup = this.$refs.baseInfoFormGroup
        let value = {}
        let arr = this.insertComm.map((item: any) => item.commercialTrunkName).join(",");
        let acc = this.insertComm.map((item: any) => item.accountName).join(",");
        value['commercialTrunkName'] = arr
        value['accountName'] = acc
        // this.baseInfoFormOptions[4]["initialValue"] = arr;
        // this.baseInfoFormOptions[5]["initialValue"] = acc;
        baseInfoFormGroup.setFieldsValue(value)
        this.openCommercial();
    }

    /**生成created */
    public created() {
        let NowDate = new Date()
        let NowTime = `${NowDate.getFullYear()}-${NowDate.getMonth() + 1 > 9 ? NowDate.getMonth() + 1 : "0" + NowDate.getMonth()}-${NowDate.getDate() > 9? NowDate.getDate() : "0" + NowDate.getDate()}`
        this.baseInfoFormOptions[7]["initialValue"] = NowTime
        VendorSourceList('').then((res: any) => {
            this.baseInfoFormOptions[5]['options'] = res.data
        })
        let switchName: any[] = ["IDD_West_1","IDD_West_2","IDD_East_3","IDD_North_2","IDD_East_4","IDD_East_5","IDD_Premium","IDD_West_Backup","IDD_East_Backup"]
        this.baseInfoFormOptions[1]["options"] = switchName
    }
}
</script>

<style lang="scss">

</style>
