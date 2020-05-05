<template>
<div>
    <!-- 高级搜索 -->
    <Advanced-search :formoptions="formOptions" :isChildName="true" @selectChange="selectChangebr" allowClear @Submit="SearchOk" :data="contractDatas" ref="AdvancedSearch" childDataKey="contractfoVOList" />
    <!-- 表格 -->
    <Table parentKey="id" :isFinance="true" :isNeedCheck="true" :selectedBtn="Formscreening" @onSelectClick="activeClick" ref="table" @onSelectAll="onSelectAll" @onSelect="onSelect" :columns="columns" :data="data" zebraStripe />
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
} from 'vuex-class'
import {
    AxiosGet,
} from '@/api/axios'
import {
    CountryCode
} from '@/api/index'
import moment from 'moment'
import xlsx from 'xlsx'
import {
    recodeConfig,
    refsConfig
} from '@/assets/ts/config.d'
import {
    downloadExcel
} from "@/assets/ts/xlsx-style/index";

@Component({
    components: {
        AdvancedSearch: resolve => require(["@/common/Advancedsearch/index.vue"], resolve),
        pagination: resolve => require(["@/common/pagination/index.vue"], resolve),
        Model: resolve => require(["@/common/Model/index.vue"], resolve),
        detailS: (resolve) => require(["@/components/formscReening/details/index.vue"], resolve),
        Table: () => import("@/views/Finance/components/Table/index.vue"),
        TableInput: resolve => require(['@/common/TableInput/index.vue'], resolve)
    }
})
export default class VcRoundingRules extends Vue {
    public $refs: refsConfig | any
    private activeIndex: number = 0;
    private selectName: any = '';
    private directions: any = '' // 方向
    private selectkeyArr: any = [];
    private exports: any = '';
    private array: any = [];
    private detailsId: any;
    private tableDatasa: any[] = []
    private selectedRows: any;
    private relatedContract: string = "";
    private priority: any = "";
    private columns: any = [{
            title: "Direction",
            dataIndex: "direction",
            key: "direction",
        },
        {
            title: "Country",
            dataIndex: "countryName",
            key: "countryName"
        },
        {
            title: "Country code",
            dataIndex: "countryCode",
            key: "countryCode"
        },
        {
            title: "Zone",
            dataIndex: "timeZone",
            key: "timeZone"
        },
        {
            title: "Begin data",
            dataIndex: "beginDate",
            key: "beginDate"
        },
        {
            title: "End data",
            dataIndex: "endDate",
            key: "endDate"
        },
        {
            title: "Remark",
            dataIndex: "remark",
            key: "remark"
        },
        {
            title: "Modified by",
            dataIndex: "modifiedBy",
            key: "modifiedBy"
        },
        {
            title: "Last modified",
            dataIndex: "lastModified",
            key: "lastModified"
        }
    ];
    private DirectionOptions: any = [{
            name: 'Inbound',
            value: 1
        },
        {
            name: 'Outbound',
            value: 2
        },
    ]
    private contractDatas: any[] = []
    private data: any[] = [];
    private formOptions: any[] = [{
            Tips: 'Direction',
            name: 'direction',
            required: false,
            type: 'select',
            span: 8,
            labelSpan: 8,
            options: this.DirectionOptions
        },
        {
            Tips: 'Country',
            name: 'countryName',
            required: false,
            type: 'select',
            showSearch: true,
            span: 8,
            labelSpan: 8,
            options: null
        },
        {
            Tips: 'Country code',
            name: 'countryCode',
            required: false,
            type: 'select',
            showSearch: true,
            span: 8,
            labelSpan: 8,
            options: null
        },
        {
            Tips: 'Zone',
            name: 'timeZone',
            required: false,
            showSearch: true,
            type: 'select',
            span: 8,
            labelSpan: 8,
            options: null
        },
        {
            Tips: 'Begin date',
            name: 'beginDate',
            required: false,
            type: 'picker',
            span: 8,
            labelSpan: 8,
            options: null
        },
        {
            Tips: 'End date',
            name: 'endDate',
            required: false,
            type: 'picker',
            span: 8,
            labelSpan: 8,
            options: null
        }
    ]

    private Formscreening: any[] = [{
        name: "Export",
        icon: "export",
        disabled: true,
        index: 1
    }];

    private selectChangebr() {
        const AdvancedSearch = (this.$refs.AdvancedSearch as any)
        const AdvancedSearchs = AdvancedSearch.getFieldsValue()
    }
    // 高级搜索 Search -> 回调
    public async SearchOk(values: any) {
        let data: any = {
            params: Object.assign({}, values, {
                beginDate: values.beginDate ? values.beginDate.format('YYYY-MM-DD') : undefined,
                endDate: values.endDate ? values.endDate.format('YYYY-MM-DD') : undefined,
            })
        }
        await CountryCode(data).then((res: any) => {
            this.data = res.data
        })
        console.log(this.data);

        this.data.map((item: any, index: number) => {
            if (item.direction === 1) {
                item.direction = 'Inbound'
            } else if (item.direction === 2) {
                item.direction = 'Outbound'
            }
        });
    }
    /* 用户手动选择/取消选择所有列的回调  Table -> 回调 */
    public onSelectAll(selected: any, selectedRows: any, changeRows: any) {
        // console.log(selected, selectedRows, changeRows);
        this.prouccDatiletias(selectedRows)
    }
    /* 用户手动选择/取消选择某列的回调
         @param record: 选中数据
         @param selected: 是否选中 true/false
         @param selectedRows: 所有选中 Array
      */
    public onSelect(record: object, selected: boolean, selectedRows: any) {
        console.log(record, selected, selectedRows);
        this.prouccDatiletias(selectedRows)
    }
    /**多选禁止操作按钮 */
    public prouccDatiletias(selectedRows: any) {
        if (selectedRows.length) {
            this.detailsId = selectedRows[0].id
        }
        this.Formscreening.forEach((item: any) => {
            if (item.index === 1) {
                item.disabled = this.data.length === 0;
            }
        });
        // this.$set(this.Formscreening[0], 'disabled', selectedRows.length == 0)
    }
    /* 点击切换页 分页(pagination) -> 回调 */
    public onChang(pageSize: number) {
        // console.log(pageSize)
    }

    //获取搜索栏的下拉框的数据
    public created() {
        AxiosGet("/config/droplist/countries").then((res: recodeConfig) => {
            this.formOptions[1]['options'] = res.data
        })
        AxiosGet("/config/droplist/countryCodes").then((res: recodeConfig) => {
            this.formOptions[2]['options'] = res.data
        })
        AxiosGet("/config/droplist/timezone").then((res: recodeConfig) => {
            this.formOptions[3]['options'] = res.data
        })
    }
    /* 操作栏点击 -> 回调 */
    private visible: any = false
    private addEdit: object = {}
    public async activeClick({
        name,
        index
    }: any, selected: any, selectedData: any, activeObJ: any) {
        console.log(selected, index, name)
        console.log(index !== 3 && (this.visible = !this.visible) && (this.activeIndex = index));
        console.log(selectedData);
        const deleted = selectedData.map((item: any) => item.id).join(",") //多选删除
        console.log(deleted);
        if (index == 1) {
            downloadExcel(this.columns, this.data, 'CountryCode', 'CountryCode');
        }
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
.slot-model-box {
    margin: 10px 20px;
    // background:#fff;
    box-shadow: 0px 3px 10px 0px rgb(243, 243, 243);
    border-radius: 2px;
    min-height: 300px;
    padding: 20px 5px;
}

.sRow {
    border: 1px solid rgb(62, 119, 216);
    max-width: 611px;
    margin: 0px auto;
    border-radius: 50px 50px 50px 50px;
    box-sizing: border-box;
    font-size: 14px;
    font-weight: 600;
    display: flex;
    justify-content: space-between;
}

.sCol {
    padding: 11px 19px 11px 16px;
    border-radius: 50px 50px 50px 50px;
    color: rgb(62, 119, 216);
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        background: rgb(62, 119, 216);
        color: #ffffff;
    }
}

.active {
    transition: all 0.2s;
    background: rgb(62, 119, 216);
    color: #ffffff;
}
</style>
