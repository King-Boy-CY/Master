<template>
<div>
    <!-- 高级搜索 -->
    <Advanced-search :formoptions="formOptionS" @Submit="SearchOk" @select="onTimebandSelect" :data="tableDatasa" childDataKey="contractfoVOList" :isChildName="true" allowClear ref="AdvancedSearch" />

    <Table :columns="columns" :data="tableDatasa" @onSelect="onSelect"></Table>
</div>
</template>

<script lang="ts">
import Vue from "vue";
import {
    Component,
    Prop,
    Emit,
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
export default class RefTimeBand extends Vue {
    @Emit('confirmTimeband') confirmTimeband(msg ? : any) {}
    @Prop() private names: any;
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
    private values = {};
    private formOptionS: any[] = [{
        Tips: 'Time band',
        name: 'timeBandName',
        required: false,
        type: 'select',
        options: null
    }];
    // 高级搜索 Search -> 回调
    public async SearchOk(values: any) {
        // console.log(values);
        if ((values.dayFrom && !values.dayTo) || (values.dayTo && !values.dayFrom) || (values.weekdayFrom && !values.weekdayTo) || (values.weekdayTo && !values.weekdayFrom)) {
            return this.$message.error(`${values} can NOT be empty`)
        }
        let data = {
            params: {
                timeFrom: values.timeFrom && moment(values.timeFrom).format('HH:mm:ss') || undefined,
                dayTo: values.dayTo || undefined,
                weekdayFrom: values.weekdayFrom || undefined,
                weekdayTo: values.weekdayTo || undefined,
                timeTo: values.timeTo && moment(values.timeTo).format('HH:mm:ss') || undefined,
                dayFrom: values.dayFrom || undefined,
                type: values.type || undefined,
                timeBandName: values.timeBandName || undefined,
            },
        }
        // console.log(data)
        await RefTimeBands(data).then((res: any) => {
            this.tableDatasa = res.data || []
            // console.log(this.tableDatasa)
        })
        this.tableDatasa.forEach((item: any, index: number) => {
            // console.log(item.detailList);
            item.detailList.length && item.detailList.forEach((innerItem: any) => {
                // console.log(innerItem.type)
                if (innerItem.type === 1) {
                    innerItem.type = 'peak'
                } else {
                    innerItem.type = 'Offpeak'
                }
            });
        });
    }
    /* 用户手动选择/取消选择所有列的回调  Table -> 回调 */
    public onSelectAll(selected: any, selectedRows: any, changeRows: any) {

    }
    private arr: any = []
    public onSelect(record: object, selected: boolean, selectedRows: any) {
        // console.log(selectedRows)
        selectedRows.map((item: any, i: number) => {
            const key = new Date().getTime() + i
            return this.$set(this.arr, i, {
                key,
                timeBandName: item.timeBandName
            })
        })
        this.confirmTimeband(this.arr)
    }
    /* 点击切换页 分页(pagination) -> 回调 */
    public onChang(pageSize: number) {
        // console.log(pageSize)
    }

    public created() {
        RefTimeBandNames('').then((res: any) => {
            // console.log(res);
            this.formOptionS[0]['options'] = res.data
        })
    }
    /* 高级搜索多选触发 */
    public onTimebandSelect(value: string, name: string) {
        // console.log('value', value, 'name', name);

    }
    private visible: any = false
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
