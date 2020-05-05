<template>
<div>
    <div class="SortTable">
        <div style="width: 45%">
            <Advanced-search :formoptions="formoptions" :isChildName="true" allowClear ref="AdvancedSearch" @Submit="SearchOk" />
            <Table :useDefined="false" parentKey="id" :isFinance="true" :isNeedCheck="true" :columns="Rightcolumns" zebraStripe :data="Rightdata" @onSelect="onSelectRight" @onSelectAll="onSelectAllRight" />
        </div>
        <div style="width: 8%;margin-top: 10%;">
            <div class="right_icons" @click="getRightData">&lt;</div>
            <div class="left_icons" @click="getLeftData">&gt;</div>
        </div>
        <div style="width: 45%">
            <div>Selected destinations:</div>
            <Table :useDefined="false" parentKey="id" :isFinance="true" :isNeedCheck="true" :columns="Leftcolumns" zebraStripe :data="Leftdata" @onSelect="onSelectLeft" @onSelectAll="onSelectAllLeft" />
            <div :style="{margin: '20px 100px', textAlign: 'center'}">
                <a-button type="primary" :style="{ borderRadius: '50px 50px 50px 50px' }" @click="InsertDes">Insert</a-button>
                <a-button :style="{ marginLeft: '8px', color: '#1890ff', borderRadius: '50px 50px 50px 50px', border: '1px solid #1890ff', fontWeight: '600' }" @click="destinationsReruen(1)">Return</a-button>
            </div>
        </div>
    </div>
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
    refsConfig,
    recodeConfig
} from "@/assets/ts/config.d";
import {
    DestinationformOptions,
    DestinationColumns
} from "../RouteProductList";
import {
    RouteProductRefNpDes,
    RouteProductDestination,
    RouteProductDestinationSearch,
    RouteProductCategoryList,
    RouteProductCountriesList
} from "@/api/index.ts";
import {
    Axios,
    AxiosPost,
    AxiosDelete,
    AxiosPut,
    AxiosGet
} from "@/api/axios";

@Component({
    components: {
        AdvancedSearch: resolve => require(["@/common/Advancedsearch/index.vue"], resolve),
        Table: () => import("@/views/Finance/components/Table/index.vue")
    }
})

export default class rpDestination extends Vue {
    @Emit('confirmDestinations') confirmDestinations(msg ? : any) {}
    @Emit('insterDes') insterDes(msg ? : any) {}
    @Emit('returnDes') returnDes(msg ? : any) {}
    @Prop() desList: any;
    public $refs: refsConfig | any;
    private Leftdata: any[] = [];
    private Rightdata: any[] = [];
    private RightSelectList: any;
    private LeftSelectList: any;
    private Middle: any[] = [];
    /**搜索 */
    private formoptions: any = DestinationformOptions
    /**Right 表头 */
    private Rightcolumns: any = DestinationColumns
    /**Left 表头 */
    private Leftcolumns: any = DestinationColumns

    /**SearchOk */
    public SearchOk(values ? : any): void {
        let data: any = {
            parmas: Object.assign({}, values, {
                destination: values.destination || undefined,
                countryName: values.countryName || undefined,
                category: values.category || undefined,
                destinationType: values.destinationType || undefined
            })
        };
        // if(data.parmas.destinationName) {
        //     let url = `/config/ref-np-destination?refNpId=3&destinationName=${data.parmas.destinationName}`
        //     AxiosGet(url).then((res: any) => {
        //         this.Rightdata = res.data
        //     })
        // } 
        // if(!data.parmas.destinationName) {
        //     AxiosGet('/config/ref-np-destination?refNpId=3').then((res: any) => {
        //         this.Rightdata = res.data
        //     })
        // }
        // let destinationName = `&destinationName=${values.destinationName}`
        // let destinationType = `&destinationType=${values.destinationType}`
        // let countryName = `&countryName=${values.countryName}`
        // let category = `&category=${values.category}`
        // let url = `/config/ref-np-destination?refNpId=1${values.destinationName?destinationName: ''}${values.destinationType?destinationType: ''}${values.destinationType?destinationType: ''}${values.category?category: ''}`
        // console.log(values)
        // let desName = `destination=${values.destination}`
        // let counName = `&countryName=${values.countryName}`
        // let cateG = `&category=${values.category}`
        // let desType = `&destinationType=${values.destinationType}`
        // let url = `/config/droplist/routeProduct/destinations?${values.destination? desName: ""}${values.countryName? counName: ""}${values.category? cateG: ""}${values.destinationType? desType: ""}`
        // console.log(url)
        RouteProductDestination(data.parmas).then((res: any) => {
            // console.log(res.data)
            this.Rightdata = res.data
        })
    }

    private larr: any = []
    /**左侧用户选择 */
    public onSelectLeft(record: any, selected: boolean, selectedRows: any) {
        selectedRows.map((item: any, i: number) => {
            const key = new Date().getTime() + i
            return this.$set(this.larr, i, {
                key,
                destinationName: item.destinationName
            })
        })
        this.LeftSelectList = selectedRows
    }
    public onSelectAllLeft(record: any, selected: boolean, selectedRows: any) {
        this.LeftSelectList = selectedRows
    }

    /**右侧用户选择 */
    public onSelectRight(record: any, selected: boolean, selectedRows: any) {
        this.RightSelectList = selectedRows
    }
    public onSelectAllRight(record: any, selected: boolean, selectedRows: any) {
        this.RightSelectList = selectedRows
    }

    /**getRightData */
    private getLeftData() {
        // console.log(this.RightSelectList)
        if (this.RightSelectList) {
            for (let i = 0; i < this.RightSelectList.length; i++) {
                this.Middle.push({
                    name: this.RightSelectList[i].name,
                    id: this.RightSelectList[i].id
                })
            }
            // console.log(this.RightSelectList)
            // console.log(this.Middle)
            this.Leftdata = this.Middle
            this.SearchOk((this.$refs.AdvancedSearch as any).getFieldsValue());
            this.confirmDestinations(this.Leftdata)
        }
    }

    private getRightData() {
        // console.log(this.LeftSelectList)
        // console.log(this.Middle)
        if (this.LeftSelectList) {
            for (let i = 0; i < this.LeftSelectList.length; i++) {
                for (let j = 0; j < this.Middle.length; j++) {
                    if (this.LeftSelectList[i] == this.Middle[j]) {
                        this.Middle.splice(j, 1)
                    }
                }
            }
        }
    }

    public InsertDes() {
        this.insterDes(this.Leftdata)
    }

    destinationsReruen(msg: any) {
        let that: any = this
        if (msg == 1) {
            this.$confirm({
                title: 'Close Tip',
                content: 'Continue to exit?',
                okText: 'yes',
                cancelText: 'no',
                onOk() {
                    that.returnDes()
                }
            });
        } else {
            that.returnDes()
        }
    }

    public created() {
        let DesList:any[] = [];
        RouteProductDestination('').then((res: any) => {
            DesList = Array.from(new Set(res.data))
            this.formoptions[0]["options"] = DesList
        })
        RouteProductCategoryList('').then((res: any) => {
            this.formoptions[3]["options"] = res.data
        })
        RouteProductCountriesList('').then((res: any) => {
            this.formoptions[2]["options"] = res.data
        })  
        if (this.desList.length >= 1) {
            let desArr = this.desList.split(',')
            for (let i = 0; i < desArr.length; i++) {
                this.Middle.push({
                    name: desArr[i]
                })
            }
            // console.log(this.Middle)
            this.Leftdata = this.Middle
            this.confirmDestinations(this.Leftdata)
        }
    }
}
</script>

<style lang="scss">
.SortTable {
    display: flex;
}

.left_icons {
    font-size: 3rem;
    text-align: center;
    color: rgb(221, 221, 221);
}

.left_icons:hover {
    color: rgb(56, 56, 56);
}

.right_icons {
    font-size: 3rem;
    text-align: center;
    color: rgb(221, 221, 221);
}

.right_icons:hover {
    color: rgb(56, 56, 56);
}
</style>
