<template>
<div>
    <Table parentKey="id" :isFinance="true" :useDefined="false" :isNeedCheck="true" :columns="columns" :data="data" zebraStripe />
</div>
</template>

<script lang="ts">
import Vue from "vue";
import {
    Component,
    Prop
} from "vue-property-decorator";
import {
    refsConfig
} from "@/assets/ts/config.d";
import {
    AxiosGet
} from "@/api/axios";

const renderContent = (value: any, row: any, index: any, dataIndex: any, options ? : any) => {
    const obj = {
        children: value,
        attrs: {
            colSpan: 1,
            rowSpan: 1
        },
    };

    if (options && options instanceof Array) {
        const find = options.find((item: any) => item.value === value)
        if (find) {
            obj.children = find.name
        }
    }
    return obj;
}

// 组件
@Component({
    components: {
        Table: () => import("@/views/Finance/components/Table/index.vue"),
        formGroup: () => import("@/views/Finance/components/form-group/index.vue")
    }
})

export default class CommercialView extends Vue {
    @Prop() addEdit: any;
    public $refs: refsConfig | any;
    /**选项 */
    private StatusOptions = [{
        name: "Active",
        value: 1
    }, {
        name: "Invalid",
        value: 2
    }]
    /**表头 */
    private columns: any[] = [{
        title: "Technical trunk",
        dataIndex: "technicalTrunkName",
        key: "technicalTrunkName",
        sorter: (a, b) => {
            var stringA = a.technicalTrunkName.toUpperCase();
            var stringB = b.technicalTrunkName.toUpperCase();
            if (stringA < stringB) {
                return -1;
            }
            if (stringA > stringB) {
                return 1;
            }
            return 0;
        }
    }, {
        title: "Switch",
        dataIndex: "switchName",
        key: "switchName",
        sorter: (a, b) => {
            var stringA = a.switchName.toUpperCase();
            var stringB = b.switchName.toUpperCase();
            if (stringA < stringB) {
                return -1;
            }
            if (stringA > stringB) {
                return 1;
            }
            return 0;
        }
    }, {
        title: "Trunk type",
        dataIndex: "trunkType",
        key: "trunkType"
    }, {
        title: "CDR match",
        dataIndex: "cDRmatch",
        key: "cDRmatch"
    }, {
        title: "Commercial trunk",
        dataIndex: "commercialTrunkName",
        key: "commercialTrunkName"
    }, {
        title: "Account",
        dataIndex: "accountName",
        key: "accountName"
    }, {
        title: "Status",
        dataIndex: "status",
        key: "status",
        sorter: (a, b) => a.status - b.status,
        customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'status', this.StatusOptions)
    }, {
        title: "Activated ports",
        dataIndex: "activatedPorts",
        key: "activatedPorts"
    }, {
        title: "Direction",
        dataIndex: "direction",
        key: "direction"
    }, {
        title: "Begin date",
        dataIndex: "beginDate",
        key: "beginDate"
    }, {
        title: "End date",
        dataIndex: "endDate",
        key: "endDate"
    }, {
        title: "Termination switch",
        dataIndex: "terinationSwitch",
        key: "terinationSwitch"
    }, {
        title: "Origination Point",
        dataIndex: "originationPoint",
        key: "originationPoint"
    }, {
        title: "Destinaton Point",
        dataIndex: "destinationPoint",
        key: "destinationPoint"
    }, {
        title: "Remark",
        dataIndex: "remark",
        key: "remark"
    }, {
        title: "Modified by",
        dataIndex: "modifiedBy",
        key: "modifiedBy"
    }, {
        title: "Last modified",
        dataIndex: "lastModified",
        key: "lastModified"
    }]

    /**数据 */
    private data: any[] = []

    public created() {
        // let url = `/config/technicalTrunks?commercialTrunkName=${this.addEdit.commercialTrunkName}`
        // AxiosGet(url).then((res: any) => {
        //     this.data = res.data
        // })
        if(this.addEdit.technicalTrunkName) {
            let teArr: any = this.addEdit.technicalTrunkName.split(",")
            let teArrList: any[] = []
            for (let i = 0; i < teArr.length; i++) {
                let url = `/config/technicalTrunks?technicalTrunkName=${teArr[i]}`
                AxiosGet(url).then((res: any) => {
                    teArrList.push({
                        technicalList: res.data
                    })
                    let datas = teArrList.map((item: any) => item.technicalList)
                    let dataList = datas.map((item: any) => item[0])
                    this.data = dataList
                })
            }
        }
    }

}
</script>
