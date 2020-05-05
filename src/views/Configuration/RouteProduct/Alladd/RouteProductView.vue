<template>
<div>
    <Table :columns="columns" :data="tableDatasa"></Table>
</div>
</template>

<script lang="ts">
import Vue from "vue";
import {
    Component,
    Prop,
    Emit
} from "vue-property-decorator";
import {
    State,
    Mutation,
} from 'vuex-class'
import {
    AxiosGet,
    AxiosDelete,
} from '@/api/axios'
import moment from 'moment'
import xlsx from 'xlsx'
import {
    RefTimeBands,
    RefTimeBandNames
} from '@/api/index'
import {
    refsConfig
} from '@/assets/ts/config.d'

@Component({
    components: {
        AdvancedSearch: resolve => require(["@/common/Advancedsearch/index.vue"], resolve),
        Table: () => import("@/common/table_timeband/index.vue"),
    }
})
export default class RouteProductView extends Vue {
    @Emit('confirmTimeband') confirmTimeband(msg ? : any) {}
    @Prop() private names: any;
    @Prop() lookTime: any;
    public $refs: refsConfig | any;
    private tableColumn ? : any;
    private activeIndex: number = 0;
    private selectName: any = '';
    private roundingRules: any = []
    private index: number = 0;
    private direction: any = '' // 方向
    private selectkeyArr: any = [];
    private timeBandName: any = ''
    private array: any = [];
    private detailsId: any;
    private selectedRows: any;
    private tableDatasa: any[] = []
    private recode = (text, row, index, value) => {

        return row.detailList.map((res: any) => {
            return res[value] || ''

        })
    }
    private columns: any[] = [{
            type: 'selection',
            width: 60,
            align: 'center'
        },
        {
            title: 'TimeBandName',
            dataIndex: 'timeBandName',
            width: 120,
            key: 'timeBandName',
        },
        {
            title: 'Day',
            children: [{
                    title: 'From',
                    dataIndex: 'dayFrom',
                    width: 60,
                    key: 'dayFrom',
                    render: (h: any, params: any) => {
                        if (params.row.detailList.length > 1) {
                            return h('div', {
                                attrs: {
                                    class: 'subCol'
                                },
                            }, [
                                h('ul', params.row.detailList.map((item: any) => {
                                    return h('li', {}, item.dayFrom)
                                }))
                            ]);
                        } else {
                            return h('div', {
                                attrs: {
                                    class: 'subCol'
                                }
                            }, [
                                h('span', params.row.detailList.map((item: any) => {
                                    return h('li', {}, item.dayFrom)
                                })),
                            ])
                        }
                    }
                },
                {
                    title: 'To',
                    dataIndex: 'dayTo',
                    width: 60,
                    key: 'dayTo',
                    render: (h: any, params: any) => {
                        if (params.row.detailList.length > 1) {
                            return h('div', {
                                attrs: {
                                    class: 'subCol'
                                },
                            }, [
                                h('ul', params.row.detailList.map((item: any) => {
                                    return h('li', {}, item.dayTo)
                                }))
                            ]);
                        } else {
                            return h('div', {
                                attrs: {
                                    class: 'subCol'
                                }
                            }, [
                                h('span', params.row.detailList.map((item: any) => {
                                    return h('li', {}, item.dayTo)
                                })),
                            ])
                        }
                    }
                },
            ]
        },
        {
            title: 'Weekday',
            children: [{
                    title: 'From',
                    dataIndex: 'weekdayFrom',
                    width: 60,
                    key: 'weekdayFrom',
                    render: (h: any, params: any) => {
                        if (params.row.detailList.length > 1) {
                            return h('div', {
                                attrs: {
                                    class: 'subCol'
                                },
                            }, [
                                h('ul', params.row.detailList.map((item: any) => {
                                    return h('li', {}, item.weekdayFrom)
                                }))
                            ]);
                        } else {
                            return h('div', {
                                attrs: {
                                    class: 'subCol'
                                }
                            }, [
                                h('span', params.row.detailList.map((item: any) => {
                                    return h('li', {}, item.weekdayFrom)
                                })),
                            ])
                        }
                    }
                },
                {
                    title: 'To',
                    dataIndex: 'To',
                    width: 60,
                    key: 'weekdayTo',
                    render: (h: any, params: any) => {
                        if (params.row.detailList.length > 1) {
                            return h('div', {
                                attrs: {
                                    class: 'subCol'
                                },
                            }, [
                                h('ul', params.row.detailList.map((item: any) => {
                                    return h('li', {}, item.weekdayTo)
                                }))
                            ]);
                        } else {
                            return h('div', {
                                attrs: {
                                    class: 'subCol'
                                }
                            }, [
                                h('span', params.row.detailList.map((item: any) => {
                                    return h('li', {}, item.weekdayTo)
                                })),
                            ])
                        }
                    }
                },
            ]
        },
        {
            title: 'Specific time',
            children: [{
                    title: 'From',
                    dataIndex: 'timeFrom',
                    width: 90,
                    key: 'timeFrom',
                    render: (h: any, params: any) => {
                        if (params.row.detailList.length > 1) {
                            return h('div', {
                                attrs: {
                                    class: 'subCol'
                                },
                            }, [
                                h('ul', params.row.detailList.map((item: any) => {
                                    return h('li', {}, item.timeFrom)
                                }))
                            ]);
                        } else {
                            return h('div', {
                                attrs: {
                                    class: 'subCol'
                                }
                            }, [
                                h('span', params.row.detailList.map((item: any) => {
                                    return h('li', {}, item.timeFrom)
                                })),
                            ])
                        }
                    }
                },
                {
                    title: 'To',
                    dataIndex: 'timeTo',
                    width: 90,
                    key: 'timeTo',
                    render: (h: any, params: any) => {
                        if (params.row.detailList.length > 1) {
                            return h('div', {
                                attrs: {
                                    class: 'subCol'
                                },
                            }, [
                                h('ul', params.row.detailList.map((item: any) => {
                                    return h('li', {}, item.timeTo)
                                }))
                            ]);
                        } else {
                            return h('div', {
                                attrs: {
                                    class: 'subCol'
                                }
                            }, [
                                h('span', params.row.detailList.map((item: any) => {
                                    return h('li', {}, item.timeTo)
                                })),
                            ])
                        }
                    }
                },
            ]
        },
        {
            title: 'Modified by',
            dataIndex: 'modifiedBy',
            width: 90,
            key: 'modifiedBy',
        },
        {
            title: 'Last modified',
            dataIndex: 'lastModified',
            width: 115,
            key: 'lastModified',
        }
    ];
    private data: any[] = [];

    public created() {
        let arr: any[] = [];
        for (let i = 0; i < this.lookTime.length; i++) {
            let url = `/config/ref-time-band?timeBandName=${this.lookTime[i]}`
            AxiosGet(url).then((res: any) => {
                arr.push({
                    timeband: res.data
                })
                let datas = arr.map((item: any) => item.timeband[0])
                this.tableDatasa = datas
            })
        }
    }

}
</script>

<style>
.ivu-table-header {
    font-size: 14px;
    font-family: "Chinese Quote", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    color: rgba(0, 0, 0, 0.85);
    font-weight: 500
}

.ivu-table-cell {
    font-size: 14px;
}

.ivu-table-border td,
.ivu-table-border th {
    list-style: none;
    text-align: center;
    border-right: 1px solid #e8eaec;
}

.ivu-table:before {
    background-color: unset;
}

.subCol>ul>li {
    margin: 0 -18px;
    list-style: none;
    text-align: center;
    font-size: 14px;
    /* padding: 9px; */
    border-bottom: 1px solid #e6e6e6;
    /* overflow: hidden; */
    color: rgba(0, 0, 0, 0.65);
    height: 50px;
    line-height: 50px;
}

.subCol {
    font-size: 14px;
}

.subCol>ul>li:last-child {
    border-bottom: none;
}
</style><style lang="scss" scoped>
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
