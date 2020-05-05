<template>
<div>
    <!-- 高级搜索 -->
    <Advanced-search :formoptions="formOptionS" @Submit="SearchOk" @select="onTimebandSelect" :data="tableDatasa" childDataKey="contractfoVOList" :isChildName="true" allowClear ref="AdvancedSearch" />
    <!-- 表格 -->
    <!-- <i-table style="overflow:auto" border @on-selection-change="onSelect" stripe :columns="columns" :data="tableDatasa" ref="table"></i-table> -->
    <!-- <Table :isFinance="true" border :isNeedCheck="true" :selectedBtn="Formscreening" @onSelectClick="activeClick" ref="table" @on-selection-change="onSelect" @onSelect="onSelect" :columns="columns" :data="tableDatasa" stripe /> -->
    <!-- <i-table :isFinance="true" border :isNeedCheck="true" :selectedBtn="Formscreening" @onSelectClick="activeClick" style="overflow:auto" border @on-selection-change="onSelect" stripe :columns="columns" :data="tableDatasa"></i-table> -->
    <Table :columns="columns" :data="tableDatasa" :selectedBtn="Formscreening" @onSelectClick="activeClick" @onSelect="onSelect"></Table>
    <!-- 分页 -->
    <!--<pagination @change="onChang"/>-->
    <!-- Add模态弹出框 -->
    <Model align-title="center"  :width="width" v-if="activeIndex === 1 && visible" v-model="visible" shade title="Add Reference Time band" @Screencover="Screencover" :unsetBodyPadding=true>
        <template slot="model-body">
            <div>
                <div :style="activeSelectAdd === 'numberPlan' ? 'box-shadow: 0px 3px 0px 0px rgb(243, 243, 243);border-radius: 3px;margin:10px 20px;' : 'margin:10px 20px;'">
                    <div :style="activeSelectAdd === 'numberPlan' ? 'background:#fff;margin-top:20px;padding:0px 0px;' : 'background:#fff;margin-top:20px;padding:0px 0px;'">
                    </div>
                    <div class="menu-child">
                        <keep-alive>
                            <form-group :is='activeSelectAdd' ref="service" />
                        </keep-alive>
                    </div>
                </div>
            </div>
        </template>
        <template slot="model-footer">
            <a-row>
                <a-col :span="24" :style="{ textAlign: 'center' }" @click="handlesaveAll">
                    <div style="margin-top:10px;">
                        <a-button type="primary" :style="{ borderRadius: '50px 50px 50px 50px' }" @click="addAllData">
                            save
                        </a-button>
                        <a-button :style="{ marginLeft: '8px', color: '#1890ff', borderRadius: '50px 50px 50px 50px', border: '1px solid #1890ff', fontWeight: '600' }" @click="handleReruen">
                            Return
                        </a-button>
                    </div>
                </a-col>
            </a-row>
        </template>
    </Model>
    <!-- Edit 模态框弹出 -->
    <Model align-title="center" :width="width" :unsetBodyPadding=true :height="'auto'" v-model="visible" v-if="activeIndex === 2 && visible" shade title="Reference Time band Edit" @Screencover="Screencover">
        <template slot="model-body">
            <div>
                <div :style="activeSelectEdit === 'numberPlan' ? 'box-shadow: 0px 3px 0px 0px rgb(243, 243, 243);border-radius: 3px;margin:10px 20px;' : 'margin:10px 20px;'">
                    <div :style="activeSelectEdit === 'numberPlan' ? 'background:#fff;margin-top:20px;padding:0px 0px;' : 'background:#fff;margin-top:20px;'"></div>
                    <div class="menu-child">
                        <keep-alive>
                            <div :is="activeSelectEdit" ref="editRef" :addEdit="addEdit" />
                        </keep-alive>
                    </div>
                </div>
            </div>
        </template>
        <template slot="model-footer">
            <a-row>
                <a-col :span="24" :style="{ textAlign: 'center' }" @click="handlesaveAll">
                    <div style="margin-top:10px;">
                        <a-button type="primary" style="border-radius:50px;min-width:75px;" @click="editllData">Save </a-button>
                        <a-button :style="{ marginLeft: '8px', color: '#1890ff', borderRadius: '50px 50px 50px 50px', border: '1px solid #1890ff', fontWeight: '600' }" @click="handleReruen">Return</a-button>
                    </div>
                </a-col>
            </a-row>
        </template>
    </Model>
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
    RefTimeBandAdd,
    RefTimeBandEdit,
    RefTimeBands,
    RefTimeBandNames,
    RefTimeBandDelete,
} from '@/api/index'
import {
    columnsConfig,
    formOptionConfig
} from './RefTimeBandConfig'
import {
    recodeConfig,
    refsConfig
} from '@/assets/ts/config.d'

@Component({
    components: {
        AdvancedSearch: resolve => require(["@/common/Advancedsearch/index.vue"], resolve),
        pagination: resolve => require(["@/common/pagination/index.vue"], resolve),
        Model: resolve => require(["@/common/Model/index.vue"], resolve),
        selectInput: resolve => require(['@/common/selectInput/index.vue'], resolve),
        RefTimeBandServer: resolve => require(["./RefTimeBandServer.vue"], resolve),
        Table: () => import("@/common/table_timeband/index.vue"),
        // Table: () => import("@/views/Finance/components/Table/index.vue"),
        RefTimeBandEdit: resolve => require(["./RefTimeBandEdit.vue"], resolve),
        TableInput: resolve => require(['@/common/TableInput/index.vue'], resolve)
    }
})
export default class RefTimeBand extends Vue {
    @Prop() private names: any;
    public $refs: refsConfig | any
    private tableColumn ? : any;
    private activeIndex: number = 0;
    private selectName: any = '';
    private width:string = "100%"
    private roundingRules: any = []
    private index: number = 0;
    private direction: any = '' // 方向
    private selectkeyArr: any = [];
    private timeBandName: any = ''
    private array: any = [];
    private detailsId: any;
    private selectedRows: any;
    private tableDatasa: any[] = []
    private activeSelectAdd: string = "RefTimeBandServer"; //add 动态组件切换
    private activeSelectEdit: string = "RefTimeBandEdit"; //edit 动态组件切换
    private recode = (text, row, index, value) => {
        //  console.log('text', text, 'row', row, 'index', index,row.detailList);
        // console.log(row.detailList[index])
        return row.detailList.map((res: any) => {
            return res[value] || ''

        })
    }
    private columns: columnsConfig[] = [{
            type: 'selection',
            width: 60,
            align: 'center'
        },
        {
            title: 'TimeBandName',
            dataIndex: 'timeBandName',
            width: 120,
            key: 'timeBandName',
            // customRender: (value: string, row: any, index: number) => {
            //     return this.renderContent(value, row, index);
            // }
        },
        {
            title: 'Day',
            children: [{
                    title: 'From',
                    dataIndex: 'dayFrom',
                    width: 70,
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
                    width: 70,
                    key: 'dayTo',
                    // customRender: (value: string, row: any, index: number) => {
                    //     return this.renderContent(value, row, index);
                    // }
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
                    width: 70,
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
                    width: 70,
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
                    width: 100,
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
                    width: 100,
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
            title: 'beginDate',
            dataIndex: 'beginDateTime',
            width: 200,
            key: 'beginDateTime',
            render: (h: any, params: any) => {
                if (params.row.detailList.length > 1) {
                    return h('div', {
                        attrs: {
                            class: 'subCol'
                        },
                    }, [
                        h('ul', params.row.detailList.map((item: any) => {
                            return h('li', {}, item.beginDateTime)
                        }))
                    ]);
                } else {
                    return h('div', {
                        attrs: {
                            class: 'subCol'
                        }
                    }, [
                        h('span', params.row.detailList.map((item: any) => {
                            return h('li', {}, item.beginDateTime)
                        })),
                    ])
                }
            }
        },
        {
            title: 'endDate',
            dataIndex: 'endDateTime',
            width: 200,
            key: 'endDateTime',
            render: (h: any, params: any) => {
                if (params.row.detailList.length > 1) {
                    return h('div', {
                        attrs: {
                            class: 'subCol'
                        },
                    }, [
                        h('ul', params.row.detailList.map((item: any) => {
                            return h('li', {}, item.endDateTime)
                        }))
                    ]);
                } else {
                    return h('div', {
                        attrs: {
                            class: 'subCol'
                        }
                    }, [
                        h('span', params.row.detailList.map((item: any) => {
                            return h('li', {}, item.endDateTime)
                        })),
                    ])
                }
            }
        },
        {
            title: "Modified by",
            dataIndex: "modifiedBy",
            key: "modifiedBy",
            width: 110,
        },
        {
            title: "Last modified",
            dataIndex: "lastModified",
            key: "lastModified",
            width: 110,
        }
    ];
    private contractDatas: any[] = []
    private data: any[] = [];
    private values = {};
    private formOptionS: formOptionConfig[] = [{
        Tips: 'Time band',
        name: 'timeBandName',
        required: false,
        type: 'select',
        options: null,
        startwithOptions:true,
        showSearch:true,
    }];
    private Formscreening: any[] = [{
            name: "Add",
            icon: "plus-circle",
            index: 1
        },
        {
            name: "Edit",
            icon: "form",
            disabled: true,
            tips: "Please select only one record to proceed",
            index: 2
        },
        {
            name: "Delete",
            icon: "delete",
            disabled: true,
            tips: "Select a record before you delete it",
            index: 3
        }
    ];
    // 高级搜索 Search -> 回调
    public async SearchOk(values: any) {
        console.log(values);
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
        await RefTimeBands(data).then((res: recodeConfig) => {
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
        this.timeband = selectedRows;
        this.prouccDatiletias(selectedRows)
    }
    /**多选禁止操作按钮 */
    public prouccDatiletias(selectedRows: any) {
        if (selectedRows.length) {
            this.detailsId = selectedRows[0].id
        }
        this.$set(this.Formscreening[1], 'disabled', selectedRows.length !== 1)
        this.$set(this.Formscreening[2], 'disabled', selectedRows.length == 0)
    }
    /* 点击切换页 分页(pagination) -> 回调 */
    public onChang(pageSize: number) {
        // console.log(pageSize)
    }

    public created() {
        RefTimeBandNames("").then((res: recodeConfig) => {
            // console.log(res);
            this.formOptionS[0]['options'] = res.data
        })
    }
    /* 高级搜索多选触发 */
    public onTimebandSelect(value: string, name: string) {
        // console.log('value', value, 'name', name);

    }
    /* 获取新增公参所有数据*/
    public addAllData(values: any, val: string): void {
        let that: any = this;
        console.log(values, val);
        if (this.activeIndex === 1) {
            const vcrradd = this.$refs.service;
            // console.log(vcrradd.getData())
            let {
                stateValue
            } = vcrradd.$refs.input;
            let obj = JSON.parse(JSON.stringify(vcrradd.$refs.TableInput.getData()));
            // console.log(vcrradd.getData(),obj,vcrradd)
            let serviceList: any = [];
            for (let i = 0; i < obj.length; i++) {
                serviceList.push({
                    weekdayFrom: obj[i].weekdayFrom,
                    weekdayTo: obj[i].weekdayTo,
                    dayFrom: obj[i].dayFrom,
                    dayTo: obj[i].dayTo,
                    type: obj[i].Type == "Off-peak" ? 2 : 1 || obj[i].Type == "peak" ? 1 : 2,
                    timeFrom: obj[i].timeFrom && obj[i].timeFrom ? moment(obj[i].timeFrom).format('HH:mm:ss') : obj[i].timeFrom,
                    timeTo: obj[i].timeTo && obj[i].timeTo ? moment(obj[i].timeTo).format('HH:mm:ss') : obj[i].timeTo,
                    beginDateTime: obj[i].beginDateTime && obj[i].beginDateTime ? moment(obj[i].beginDateTime).format("YYYY-MM-DD") : obj[i].beginDateTime,
                    endDateTime: obj[i].endDateTime && obj[i].endDateTime ? moment(obj[i].endDateTime).format("YYYY-MM-DD") : obj[i].endDateTime,
                });
                console.log(moment(obj[i].timeFrom).format('HH:mm:ss'), moment(obj[i].timeTo).format('HH:mm:ss'))
                if (moment(obj[i].timeFrom).format('HH:mm:ss') > moment(obj[i].timeTo).format('HH:mm:ss')) {
                    that.$message.error("The start time of workday cannot be greater than the end time of workday");
                }
            }
            let timeband: any = stateValue.trim();
            console.log(timeband);
            let service = {
                "detailList": serviceList,
                "timeBandName": stateValue
            }
            // console.log(service);
            RefTimeBandAdd(service).then((res: any) => {
                if (res.code >= 1) {
                    that.visible = !that.visible;
                    that.$message.success("Successful addition");
                    this.$set(this.Formscreening[1], 'disabled', true)
                    this.$set(this.Formscreening[2], 'disabled', true)
                    this.SearchOk((this.$refs.AdvancedSearch as any).getFieldsValue())
                }
                if (res.code < 1) {
                    this.$message.error(res.msg);
                }
            });
        }
    }
    //修改的公参数据
    public editllData(values: any): void {
        let that: any = this;
        if (this.activeIndex === 2) {
            const editRef = that.$refs.editRef;
            console.log(editRef.$refs.TableInput.getData())
            let obj = JSON.parse(JSON.stringify(editRef.$refs.TableInput.getData()));
            console.log(obj)
            let serviceList: any = [];
            for (let i = 0; i < obj.length; i++) {
                serviceList.push({
                    weekdayFrom: obj[i].weekdayFrom,
                    weekdayTo: obj[i].weekdayTo,
                    dayFrom: obj[i].dayFrom,
                    dayTo: obj[i].dayTo,
                    Type: obj[i].Type == "Off-peak" ? 2 : obj[i].Type || obj[i].Type == "peak" ? 1 : obj[i].Type,
                    timeFrom: obj[i].timeFrom ? moment(obj[i].timeFrom).format('HH:mm:ss') : obj[i].timeFrom,
                    timeTo: obj[i].timeTo ? moment(obj[i].timeTo).format('HH:mm:ss') : obj[i].timeFrom,
                    beginDateTime: obj[i].beginDateTime && obj[i].beginDateTime ? moment(obj[i].beginDateTime).format("YYYY-MM-DD") : obj[i].beginDateTime,
                    endDateTime: obj[i].endDateTime && obj[i].endDateTime ? moment(obj[i].endDateTime).format("YYYY-MM-DD") : obj[i].endDateTime,
                });
                console.log(obj[i], obj[i].timeFrom)
                if (moment(obj[i].timeFrom).format('HH:mm:ss') > moment(obj[i].timeTo).format('HH:mm:ss')) {
                    that.$message.error("The start time of workday cannot be greater than the end time of workday");
                }
            }

            let service = {
                "detailList": serviceList,
                "timeBandName": this.addEdit[0].timeBandName
            }
            console.log(service);
            RefTimeBandEdit(service).then((res: any) => {
                if (res.code >= 1) {
                    that.visible = !that.visible;
                    that.$message.success("Successful addition");
                    this.$set(this.Formscreening[1], 'disabled', true)
                    this.$set(this.Formscreening[2], 'disabled', true)
                    // AxiosGet("/config/ref-time-band").then((res: any) => {
                    //     that.tableDatasa = res.data;
                    // });
                    setTimeout(() => {
                        this.SearchOk((this.$refs.AdvancedSearch as any).getFieldsValue())
                    }, 100)
                }
                if (res.code < 1) {
                    this.$message.error(res.msg);
                }
            });
        }
    }
    private timeband: any = ""
    private visible: any = false
    private addEdit: object = {}
    /* 操作栏点击 -> 回调 */
    public async activeClick({
        name,
        index,
    }: any, selected: any, selectedData: any, activeObJ: any, ) {
        // console.log(selectedData,name,index);
        // console.log(index)
        console.log(index !== 5 && (this.visible = !this.visible) && (this.activeIndex = index));
        console.log(this.detailsId);
        const deleted = selectedData.map((item: any) => item.timeBandName).join(",") //多选删除
        console.log(deleted)
        if (index == 1 && this.detailsId) {
            this.activeIndex = 1;
            this.direction = '';
            console.log(this.visible)
            this.visible = true;
        }
        if (index == 2) {
            console.log("this.names", this.names);
            this.activeIndex = 2;
            this.addEdit = selectedData
            if (this.addEdit[0].detailList.length == 2) {}
            //  console.log(this.addEdit)
        }
        /*删除按钮*/
        if (index == 3) {
            this.activeIndex = 3;
            let code = undefined
            let _this = this;
            this.$confirm({
                title: "Confirm!",
                content: `Continue to  deleted the data?`,
                okText: "YES",
                cancelText: "NO",
                onOk() {
                    const that = this;
                    RefTimeBandDelete(deleted).then((res: any) => {
                        // console.log("Confirm", res);
                        if (res.code < 0) {
                            _this.$message.error(res.msg);
                            // console.log(_this.visible);
                            _this.visible = false;
                            code = res.code
                        } else {
                            _this.$set(_this.Formscreening[1], 'disabled', true)
                            _this.$set(_this.Formscreening[2], 'disabled', true)
                            code = res.code
                            _this.visible = false;
                            _this.$message.success("Data has been deleted successfully");
                            _this.SearchOk("");

                        }
                    });

                }
            });
        }
        setTimeout(() => {
            console.log('visible', this.visible);
        }, 1000);
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
