<template>
<div>
    <Advanced-search :formoptions="formoptions" :isChildName="true" allowClear @Submit="SearchOk" ref="AdvancedSearch" />
    <!-- <Table parentKey="id" :isSingleCheck="true" :isFinance="true" :columns="columns" :data="data" zebraStripe :isNeedCheck="true" :isAlphabet="isAlphabet" /> -->
    <div>
        <!-- <simple-table :columns="columns" @toggleLetter="toggleLetter" :data="data" :border="border" :isAlphabet="isAlphabet" @selectedRows="onSelect" :propTotal="pagination.total" @selectedRowKeys="onSelectedRowKeys"></simple-table> -->
        <Table :isFinance="true" :isNeedCheck="true" :columns="columns" @toggleLetter="toggleLetter" :data="data" :border="border" :isAlphabet="isAlphabet" @onSelect="onSelect" :propTotal="pagination.total" @selectedRowKeys="onSelectedRowKeys" />
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
    refsConfig
} from "@/assets/ts/config.d";
import {
    Excludeformoptions,
    Excludecolumns,
    baseInfoFormOptions
} from "../ClientSourceList";
import {
    ClientSourceExcludeSearch,
    ClientSourceExcludeCountry,
    ClientSourceExcludedialedDigits,
    ClientSourceExcludeCountryCode
} from "@/api/index.ts";
import {
    AxiosGet
} from "@/api/axios";

@Component({
    components: {
        AdvancedSearch: resolve => require(["@/common/Advancedsearch/index.vue"], resolve),
        Table: () => import("@/views/Finance/components/Table/index.vue"),
        SimpleTable: () => import("@/components/router/SimpleTable.vue")
    }
})

export default class clientSourceExclude extends Vue {
    @Prop() getExclude: any;
    @Emit('confirmExclude') confirmExclude(msg ? : any) {}
    private border: boolean = true;
    //是否显示字母表
    private isAlphabet: boolean = true;
    // 保存切换字母的值，默认为All
    private letter: string = 'All';
    //保存params
    private searchParams: any;
    // 搜索url
    private commentsUrl: any;

    //分页
    private pagination: any = {
        pageSize: 10,
        pageNum: 1,
        total: 0,
        sortField: '',
        sortOrder: '',
    }

    public $refs: refsConfig | any;
    private baseInfoFormOptions: any = baseInfoFormOptions;

    /**选项 */
    private ExcludedestinationinclientofferOptions: any = [{
        name: "YES",
        value: 0
    }, {
        name: "NO",
        value: 1
    }]

    /**搜索 */
    private formoptions: any[] = [{
        Tips: "Number plan",
        name: "numberPlanName",
        required: true,
        type: "select",
        options: null
    }, {
        Tips: "Destination",
        name: "destinationName",
        required: false,
        type: "input",
        showSearch: true,
        options: null
    }, {
        Tips: "Dialed digits",
        name: "dialedDigit",
        required: false,
        type: "input",
        showSearch: true,
        filterOption: true,
        options: null
    }, {
        Tips: "Country",
        name: "country",
        required: false,
        type: "select",
        showSearch: true,
        filterOption: true,
        options: null
    }, {
        Tips: "Country code",
        name: "countryCode",
        required: false,
        type: "input",
        filterOption: true,
        options: null
    }, {
        Tips: "Exclude destinationin client offer",
        name: "isExcludeDestination",
        required: true,
        type: "select",
        options: this.ExcludedestinationinclientofferOptions
    }];

    /**表头 */
    private columns: any[] = Excludecolumns;
    private ExcludeNeed: any;

    /**表格 */
    private data: any[] = [];

    /**SearchOk */
    private SearchOk(values ? : any): void {
        // console.log(values)
        let data: any = {
            params: Object.assign({}, values, {
                    destinationName: values.destinationName,
                    numberPlanName: values.numberPlanName,
                    dialedDigit: values.dialedDigit,
                    country: values.country,
                    countryCode: values.countryCode,
                    isExcludeDestination: values.isExcludeDestination
                },
                // letter: this.letter,
                // pageSize: this.pagination.pageSize,
                // pageNum: this.pagination.pageNum,
                // sortField: this.pagination.sortField,
                // sortOrder: this.pagination.sortOrder
            )
        };
        const params = {
            params: {
                destinationName: values.destinationName ? values.destinationName : "",
                numberPlanName: values.numberPlanName ? values.numberPlanName : "",
                dialedDigit: values.dialedDigit ? values.dialedDigit : "",
                country: values.country ? values.country : "",
                countryCode: values.countryCode ? values.countryCode : "",
                isExcludeDestination: values.isExcludeDestination ? values.isExcludeDestination : ""
            },
            letter: this.letter,
            pageSize: this.pagination.pageSize,
            pageNum: this.pagination.pageNum,
            sortField: this.pagination.sortField,
            sortOrder: this.pagination.sortOrder
        };
        this.searchParams = params.params
        let numberPlanTypeList = values.numberPlanName
        if(numberPlanTypeList.split("")[0] == "R") {
            numberPlanTypeList = 1
        } else if(numberPlanTypeList == "string") {
            numberPlanTypeList = 1
        } else {
            numberPlanTypeList = 2
        }

        let ExcludeDestination: any;
        // console.log(ExcludeDestination)
        if (values.isExcludeDestination == "YES") {
            ExcludeDestination = 0
        } else if(values.isExcludeDestination == 1) {
            ExcludeDestination = 1
        } else {
            ExcludeDestination = ""
        }
        // console.log(ExcludeDestination)
        // console.log(values.isExcludeDestination)
        // console.log(numberPlanTypeList)
        // &destinationName=${values.destinationName}&country=${values.country}&countryCode=${values.countryCode}
        let datass = {
            countryCode: `&countryCode=${values.countryCode}`,
            destinationName: `&destinationName=${values.destinationName}`,
            country: `&country=${values.country}`,
            isExcludeDestination: `&isExcludeDestination=${ExcludeDestination}`,
            clientId: `&clientId=${this.getExclude}`,
            dialedDigit: `&dialedDigit=${values.dialedDigit}`,
            numberPlanType: `numberPlanType=${numberPlanTypeList}`
        }
        // console.log(values)
        let url = `/config/clientSources/getDestinations?${datass.numberPlanType}&numberPlanName=${values.numberPlanName}${values.countryCode? datass.countryCode : ""}${values.destinationName? datass.destinationName : ""}${values.country? datass.country : ""}${values.isExcludeDestination? datass.isExcludeDestination : ""}${this.getExclude? datass.clientId : ""}${values.dialedDigit? datass.dialedDigit : ""}`
        this.commentsUrl = url
        // console.log(url)
        AxiosGet(url).then((res: any) => {
            // console.log(res.data)
            this.data = res.data
        })
    }

    private _dataCleaning(data) {
        const pagination = {
            ...this.pagination
        }
        pagination.total = data.data.total
        this.data = data.data.list
        this.pagination = pagination
    }

    private toggleLetter(letter: string, index: number): void {
        // console.log(letter, index)
        let url = this.commentsUrl
        let arrList: any[] = [];
        let arrData: any;
        this.letter = letter
        if (index != 0) {
            AxiosGet(url).then(res => {
                let length = res.data.length
                for (let i = 0; i < length; i++) {
                    // console.log(res.data[i].destinationName[0])
                    if (res.data[i].destinationName[0].toUpperCase() == letter) {
                        arrList.push({
                            country: res.data[i].country,
                            countryCode: res.data[i].countryCode,
                            destinationName: res.data[i].destinationName,
                            dialedDigit: res.data[i].dialedDigit,
                            isExcludeDestination: res.data[i].isExcludeDestination
                        })
                        // this.data = arrList
                    } else {
                        this.data = []
                    }
                }
                this.data = arrList
                // arrList.map((item: any) => {
                //     arrData = item.dataList
                // })
                // console.log(arrData)
            })
        }
        if (index == 0) {
            this.SearchOk((this.$refs.AdvancedSearch as any).getFieldsValue());
        }
    }

    /**用户选择 */
    private arr: any = []
    private onSelect(record: any, selected: boolean, selectedRows: any): void {
        // console.log(selectedRows)
        selectedRows.map((item: any, i: number) => {
            const key = new Date().getTime() + 1
            return this.$set(this.arr, i, {
                key,
                destinationName: item.destinationName
            })
        })
        this.confirmExclude(this.arr)
    }
    private onSelectedRowKeys(rowKeys: number[]): void {

    }

    public created() {
        let arrs: any[] = []
        let countryName: any[] = [];
        arrs.push({
            numberPlanName: this.baseInfoFormOptions[4].initialValue
        })
        // this.ExcludeNeed = this.baseInfoFormOptions[8].initialValue
        this.formoptions[0]['options'] = arrs[0]
        this.formoptions[0]['initialValue'] = arrs[0].numberPlanName
        this.formoptions[0]['disabled'] = true
        let url = `/config/droplist/referenceNumberPlan/countryWithCodesById?referenceName=${arrs[0].numberPlanName}`
        AxiosGet(url).then((res: any) => {
            // this.formoptions[3]['options'] = res.data
            // this.formoptions[3]['options'] = countryId.countryName
            countryName = res.data.map((item: any) => item.countryName)
            // console.log(countryName)
            countryName = Array.from(new Set(countryName))
            this.formoptions[3]['options'] = countryName
        })
        ClientSourceExcludedialedDigits('').then((res: any) => {
            this.formoptions[2]['options'] = res.data
        })
        ClientSourceExcludeCountryCode('').then((res: any) => {
            this.formoptions[4]['options'] = res.data
        })
        // console.log(this.getExclude)
    }
}
</script>

<style lang="scss">

</style>
