<template>
<div>
    <!-- 表格 -->
    <div class="top-content">
        <form-group :formoptions="baseInfoFormOptions" :span="12" ref="baseInfoFormGroup" class="form-group" @sendChild="sendChild">
            <!-- Destinations -->
            <!-- <a-col :span="3" class="destinations-button">
                <a-button :size="'small'" type="primary" @click="openDestinations">
                    ...
                </a-button>
            </a-col> -->
            <!-- Service -->
            <!-- <a-col :span="3" class="service-button">
                <a-button :size="'small'" type="primary" @click="openService">
                    ...
                </a-button>
            </a-col> -->
            <!-- Time band -->
            <!-- <a-col :span="3" class="timeband-button">
                <a-button :size="'small'" type="primary" @click="openTimeband">
                    ...
                </a-button>
            </a-col> -->
        </form-group>
    </div>

    <!-- destinations子表格 -->
    <Model align-title="center" v-model="showDestinations" shade title="Destinations" @Screencover="openDestinations">
        <template slot="model-body">
            <div>
                <div :style="'margin:10px 20px;'">
                    <div :style="'background:#fff;margin-top:20px;padding:0px 0px;'">
                    </div>
                    <div class="menu-child">
                        <rp-destinations ref="rpDestinations" @confirmDestinations="confirmDestinations" :desList="desList" @insterDes="insterDes" @returnDes="returnDes"></rp-destinations>
                    </div>
                </div>
            </div>
        </template>
        <!-- <template slot="model-footer">
            <a-row>
                <a-col :span="24" :style="{ textAlign: 'center' }">
                    <div style="margin-top:10px;">
                        <a-button type="primary" :style="{ borderRadius: '50px 50px 50px 50px' }" @click="InsertDestination">Insert</a-button>
                        <a-button :style="{ marginLeft: '8px', color: '#1890ff', borderRadius: '50px 50px 50px 50px', border: '1px solid #1890ff', fontWeight: '600' }" @click="destinationsReruen(1)">Return</a-button>
                    </div>
                </a-col>
            </a-row>
        </template> -->
    </Model>

    <!-- Service子表格 -->
    <Model align-title="center" v-model="showService" shade title="Service" @Screencover="openService">
        <template slot="model-body">
            <div>
                <div :style="'margin:10px 20px;'">
                    <div :style="'background:#fff;margin-top:20px;padding:0px 0px;'">
                    </div>
                    <div class="menu-child">
                        <rp-service ref="rpService" @confirmSerivce="confirmSerivce"></rp-service>
                    </div>
                </div>
            </div>
        </template>
        <template slot="model-footer">
            <a-row>
                <a-col :span="24" :style="{ textAlign: 'center' }">
                    <div style="margin-top:10px;">
                        <a-button type="primary" :style="{ borderRadius: '50px 50px 50px 50px' }" @click="InsertService">Insert</a-button>
                        <a-button :style="{ marginLeft: '8px', color: '#1890ff', borderRadius: '50px 50px 50px 50px', border: '1px solid #1890ff', fontWeight: '600' }" @click="serviceReruen(1)">Return</a-button>
                    </div>
                </a-col>
            </a-row>
        </template>
    </Model>

    <!-- Timeband子表格 -->
    <Model align-title="center" v-model="showTimeband" shade title="Timeband" @Screencover="openTimeband">
        <template slot="model-body">
            <div>
                <div :style="'margin:10px 20px;'">
                    <div :style="'background:#fff;margin-top:20px;padding:0px 0px;'">
                    </div>
                    <div class="menu-child">
                        <rp-timeband ref="rpTimeband" @confirmTimeband="confirmTimeband"></rp-timeband>
                    </div>
                </div>
            </div>
        </template>
        <template slot="model-footer">
            <a-row>
                <a-col :span="24" :style="{ textAlign: 'center' }">
                    <div style="margin-top:10px;">
                        <a-button type="primary" :style="{ borderRadius: '50px 50px 50px 50px' }" @click="InsertTimeband">Insert</a-button>
                        <a-button :style="{ marginLeft: '8px', color: '#1890ff', borderRadius: '50px 50px 50px 50px', border: '1px solid #1890ff', fontWeight: '600' }" @click="timebandReruen(1)">Return</a-button>
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
    Component
} from "vue-property-decorator";
import {
    refsConfig,
    recodeConfig
} from "@/assets/ts/config.d"
import {
    baseInfoFormOptions
} from "../RouteProductList"
import {
    RouteProductRefTimeband
} from "@/api/index.ts"

/**组件 */
@Component({
    components: {
        formGroup: () => import("@/views/Finance/components/form-group/index.vue"),
        Model: resolve => require(["@/common/Model/index.vue"], resolve),
        rpDestinations: resolve => require(["./rpDestinations.vue"], resolve),
        rpService: resolve => require(["./rpService.vue"], resolve),
        rpTimeband: resolve => require(["./rpTimeband.vue"], resolve)
    }
})

export default class RouteProductAdd extends Vue {
    private rpDestinations: string = "rpDestinations"; // Destinations
    private rpService: string = "rpService"; // Service
    private rpTimeband: string = "rpTimeband"; // rpTimeband

    private desList: object = {};
    private showService: boolean = false;
    private showTimeband: boolean = false;
    private showDestinations: boolean = false;
    public $refs: refsConfig | any;
    private inService: any;
    private inTimeband: any;
    private inDestination: any;

    /**表格 */
    private baseInfoFormOptions: any[] = baseInfoFormOptions

    /**显示子表格 */
    public openDestinations() {
        // console.log("openDestinations")
        this.showDestinations = !this.showDestinations
        this.desList = this.baseInfoFormOptions[2]['initialValue']
    }
    public openService() {
        // console.log("openService")
        this.showService = !this.showService
    }
    public openTimeband() {
        // console.log("openTimeband")
        this.showTimeband = !this.showTimeband
    }

    /**获取选中数据 */
    public confirmSerivce(msg) {
        this.inService = msg
    }
    public confirmTimeband(msg) {
        this.inTimeband = msg
    }
    public confirmDestinations(msg) {
        // this.inDestination = msg
    }
    public insterDes(msg) {
        const baseInfoFormGroup = this.$refs.baseInfoFormGroup
        let value = {}
        this.inDestination = msg
        let Destinationarr: any[] = []
        this.inDestination.map((item: any) => {
            Destinationarr.push(item.name)
        })
        value['destinationName'] = Destinationarr.toString()
        this.baseInfoFormOptions[2].initialValue = Destinationarr.toString()
        this.baseInfoFormOptions[0].initialValue = `${this.baseInfoFormOptions[2].initialValue + "-"}${this.baseInfoFormOptions[3].initialValue + "-"}${this.baseInfoFormOptions[4].initialValue}`
        baseInfoFormGroup.setFieldsValue(value)
        this.openDestinations()
    }
    public returnDes(msg) {
        this.openDestinations()
    }

    /**InsertService */
    public InsertService(values ? : any): void {
        const baseInfoFormGroup = this.$refs.baseInfoFormGroup
        let value = {}
        // console.log(this.inService)
        let Servicearr: any[] = []
        this.inService.map((item: any) => {
            Servicearr.push(item.serviceName)
            // this.baseInfoFormOptions[3]["initialValue"] = this.InsertList
        })
        value['serviceName'] = Servicearr.toString()
        this.baseInfoFormOptions[3]["initialValue"] = Servicearr.toString()
        this.baseInfoFormOptions[0].initialValue = `${this.baseInfoFormOptions[2].initialValue + "-"}${this.baseInfoFormOptions[3].initialValue + "-"}${this.baseInfoFormOptions[4].initialValue}`
        baseInfoFormGroup.setFieldsValue(value)
        this.openService()
    }

    /**InsertTimeband */
    public InsertTimeband(values ? : any): void {
        const baseInfoFormGroup = this.$refs.baseInfoFormGroup
        let value = {}
        let Timebandarr: any[] = []
        this.inTimeband.map((item: any) => {
            Timebandarr.push(item.timeBandName)
        })
        value['refTimeBandName'] = Timebandarr.toString()
        this.baseInfoFormOptions[4]["initialValue"] = Timebandarr.toString()
        this.baseInfoFormOptions[0].initialValue = `${this.baseInfoFormOptions[2].initialValue + "-"}${this.baseInfoFormOptions[3].initialValue + "-"}${this.baseInfoFormOptions[4].initialValue}`
        baseInfoFormGroup.setFieldsValue(value)
        this.openTimeband()
    }

    /**InsertDestination */
    public InsertDestination(values ? : any): void {
        // console.log(this.inDestination)
        let Destinationarr: any[] = []
        this.inDestination.map((item: any) => {
            Destinationarr.push(item.name)
        })
        this.baseInfoFormOptions[2].initialValue = Destinationarr.toString()
        this.baseInfoFormOptions[0].initialValue = `${this.baseInfoFormOptions[2].initialValue + "-"}${this.baseInfoFormOptions[3].initialValue + "-"}${this.baseInfoFormOptions[4].initialValue}`
        this.openDestinations()
    }

    /**destinationsReruen退出 */
    destinationsReruen(msg: any) {
        let that: any = this
        if (msg == 1) {
            this.$confirm({
                title: 'Close Tip',
                content: 'Continue to exit?',
                okText: 'yes',
                cancelText: 'no',
                onOk() {
                    that.openDestinations(msg)
                }
            });
        } else {
            that.openDestinations(msg)
        }
    }

    /**serviceReruen退出 */
    serviceReruen(msg: any) {
        let that: any = this
        if (msg == 1) {
            this.$confirm({
                title: 'Close Tip',
                content: 'Continue to exit?',
                okText: 'yes',
                cancelText: 'no',
                onOk() {
                    that.openService(msg)
                }
            });
        } else {
            that.openService(msg)
        }
    }

    /**timebandReruen退出 */
    timebandReruen(msg: any) {
        let that: any = this
        if (msg == 1) {
            this.$confirm({
                title: 'Close Tip',
                content: 'Continue to exit?',
                okText: 'yes',
                cancelText: 'no',
                onOk() {
                    that.openTimeband(msg)
                }
            });
        } else {
            that.openTimeband(msg)
        }
    }

    private sendChild(value: any) {
        // console.log(value)
        if (value.Tips == "Destinations") {
            this.showDestinations = !this.showDestinations
        }
        if (value.Tips == "Time band") {
            this.showTimeband = !this.showTimeband
        }
        if (value.Tips == "Service") {
            this.showService = !this.showService
        }
    }

    public created() {
        this.baseInfoFormOptions[0]["disabled"] = false
        this.baseInfoFormOptions[2]["disabled"] = false
        this.baseInfoFormOptions[3]["disabled"] = false
        this.baseInfoFormOptions[4]["disabled"] = false
        this.baseInfoFormOptions[0]["initialValue"] = ""
        this.baseInfoFormOptions[1]["initialValue"] = 1
        this.baseInfoFormOptions[2]["initialValue"] = ""
        this.baseInfoFormOptions[3]["initialValue"] = ""
        this.baseInfoFormOptions[4]["initialValue"] = ""
        this.baseInfoFormOptions[5]["initialValue"] = ""
        this.baseInfoFormOptions[6]["initialValue"] = ""
        this.baseInfoFormOptions[7]["initialValue"] = "2099-12-31"
        this.baseInfoFormOptions[8]["initialValue"] = ""

        let date = new Date()
        let times = `${date.getFullYear()}-${date.getMonth() + 1 > 9 ? date.getMonth() + 1 : "0" + date.getMonth()}-${date.getDate() > 9? date.getDate() : "0" + date.getDate()}`
        this.baseInfoFormOptions[6]["initialValue"] = times
        RouteProductRefTimeband('').then((res: any) => {
            // console.log(res.data)
            this.baseInfoFormOptions[4].options = res.data
        })
    }
}
</script>

<style lang="scss">
.destinations-button {
    position: absolute;
    top: -19.25rem;
    right: 52%;
    width: 26px;
}

.service-button {
    position: absolute;
    top: -19.25rem;
    right: 1%;
    width: 26px;
}

.timeband-button {
    position: absolute;
    top: -15.25rem;
    right: 52%;
    width: 26px;
}
</style>
