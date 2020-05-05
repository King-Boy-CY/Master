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
    <Model align-title="center" v-if="activeIndex === 1 && visible" v-model="visible" shade title="Add VC Time band" @Screencover="Screencover">
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
    <Model align-title="center" :height="'auto'" v-model="visible" v-if="activeIndex === 2 && visible" shade title="VC Time band Edit" @Screencover="Screencover">
        <template slot="model-body">
            <div>
                <div :style="activeSelectEdit === 'numberPlan' ? 'box-shadow: 0px 3px 0px 0px rgb(243, 243, 243);border-radius: 3px;margin:10px 20px;' : 'margin:10px 20px;'">
                    <div :style="activeSelectEdit === 'numberPlan' ? 'background:#fff;margin-top:20px;padding:00px 0px;' : 'background:#fff;margin-top:20px;padding:0px 0px;'"></div>
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
    Watch
} from "vue-property-decorator";
import {
    State,
    Mutation,
} from 'vuex-class'
import {
    AxiosGet,
    AxiosPost,
    AxiosPut,
    AxiosDelete,
} from '@/api/axios'
import moment from 'moment'
import xlsx from 'xlsx'
import {
    VCTimeBand,
    VcTimeBandAdd,
    VcTimeBandEdit,
    VCTimeBandDelete
} from '@/api/index'
import {
    columnsConfig,
    formOptionConfig
} from './VcTimeBandConfig'
import {
    recodeConfig,
    refsConfig
} from '@/assets/ts/config.d'
import {
    isAnyShortfall
} from '../../../filter';
import {
    onSelectClick
} from '@/views/Configuration/Exports'
import {
    downloadExcel
} from '@/assets/ts/xlsx-style/index'
@Component({
    components: {
        AdvancedSearch: resolve => require(["@/common/Advancedsearch/timeband.vue"], resolve),
        pagination: resolve => require(["@/common/pagination/index.vue"], resolve),
        Model: resolve => require(["@/common/Model/index.vue"], resolve),
        selectInput: resolve => require(['@/common/selectInput/index.vue'], resolve),
        VcTimeBandServer: resolve => require(["./VcTimeBandServer.vue"], resolve),
        Table: () => import("@/common/table_timeband/index.vue"),
        // Table: () => import("@/views/Finance/components/Table/index.vue"),
        VcTimeBandEdit: resolve => require(["./VcTimeBandEdit.vue"], resolve),
        TableInput: resolve => require(['@/common/TableInput/index.vue'], resolve)
    }
})
export default class VcTimeBand extends Vue {
    public $refs: refsConfig | any
    private tableColumn ? : any;
    private activeIndex: number = 0;
    private selectName: any = '';
    private roundingRules: any = []
    private index: number = 0;
    private direction: any = '' // 方向
    private selectkeyArr: any = [];
    private timeBandName: any = ''
    private exports: any = '';
    private array: any = [];
    private detailsId: any;
    private selectedRows: any;
    private tableDatasa: any[] = []
    private relatedContract: string = "";
    private priority: any = "";
    private activeSelectAdd: string = "VcTimeBandServer"; //add 动态组件切换
    private activeSelectEdit: string = "VcTimeBandEdit"; //edit 动态组件切换
    public selectedRowslength:any;
    private recode = (text, row, index, value) => {
        return row.detailList.map((res: any) => {
            return res[value] || ''

        })
    }
    private columns: columnsConfig[] = [{
            type: 'selection',
            width: 60,
            align: 'center',
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
                    width: 60,
                    key: 'dayFrom',
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
                    dataIndex: 'weekdayTo',
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
            title: 'Type',
            dataIndex: 'type',
            width: 90,
            key: 'type',
            render: (h: any, params: any) => {
                if (params.row.detailList.length > 1) {
                    return h('div', {
                        attrs: {
                            class: 'subCol'
                        },
                    }, [
                        h('ul', params.row.detailList.map((item: any) => {
                            return h('li', {}, item.type == 1 ? 'peak' : item.type && item.type == 2 ? 'Offpeak' : item.type)
                        }))
                    ]);
                } else {
                    return h('div', {
                        attrs: {
                            class: 'subCol'
                        }
                    }, [
                        h('span', params.row.detailList.map((item: any) => {
                            return h('li', {}, item.type == 1 ? 'peak' : item.type && item.type == 2 ? 'Offpeak' : item.type)
                        })),
                    ])
                }
            }
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
    private contractDatas: any[] = []
    private data: any[] = [];
    private values = {};
    private formOptionS: formOptionConfig[] = [{
            Tips: 'Time band name',
            name: 'timeBandName',
            required: false,
            type: 'select',
            options: null
        },
        {
            Tips: 'Type',
            name: 'type',
            required: false,
            type: 'select',
            options: null,
            colSpan: 5,
            span: 12
        },
        {
            Tips: 'Days',
            name: '1',
            required: false,
            type: 'select',
            options: null,
            colSpan: 9,
            span: 6,
            wrapperCol: 2
        },
        {
            Tips: 'to',
            name: '11',
            required: false,
            type: 'select',
            options: null,
            colSpan: 3,
            span: 6
        },
        {
            Tips: 'Weekday',
            name: 'WeekdayFrom',
            required: false,
            type: 'select',
            options: null,
            colSpan: 11,
            span: 6
        },
        {
            Tips: 'to',
            name: 'WeekdayTo',
            required: false,
            type: 'select',
            options: null,
            colSpan: 5,
            span: 6
        },
        {
            Tips: 'Specific time',
            name: 'null',
            required: false,
            type: 'picker',
            colSpan: 9,
            span: 6,
            wrapperCol: 2
        },
        {
            Tips: 'to',
            name: 'null',
            required: false,
            type: 'picker',
            colSpan: 3,
            span: 6
        },
    ];
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
        },
        {
            name: "Export",
            icon: "export",
            disabled: true,
            tips: "Select a record before you can export",
            index: 4
        }
    ];
    // 高级搜索 Search -> 回调
    public async SearchOk(values: any) {
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
        if (moment(values.timeFrom).format('HH:mm:ss') > moment(values.timeTo).format('HH:mm:ss')) {
            this.$message.error("The start time of workday cannot be greater than the end time of workday");
        }

        await VCTimeBand(data).then((res: any) => {
            this.tableDatasa = res.data || []
            // console.log(this.tableDatasa)
        })
        console.log('this.tableDatasa',this.tableDatasa);
        
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
        //export的禁用修改
        this.Formscreening.forEach((item: any) => {
             if (item.index === 4) {
                item.disabled = this.tableDatasa.length === 0
            } 
        })
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
        this.selectedRowslength = selectedRows.length;
        this.$set(this.Formscreening[1], 'disabled', selectedRows.length !== 1)
        this.$set(this.Formscreening[2], 'disabled', selectedRows.length == 0)
    }
    /* 点击切换页 分页(pagination) -> 回调 */
    public onChang(pageSize: number) {
        // console.log(pageSize)
    }

    public created() {
        AxiosGet("/config/droplist/vcTimeBandNames").then((res: recodeConfig) => {
            this.formOptionS[0]['options'] = res.data
        })
    }
    /* 高级搜索多选触发 */
    public onTimebandSelect(value: string, name: string) {
        // console.log('value', value, 'name', name);

    }

    public saveSetError(key: string, value: string) {
        // let setFields = this.$refs.service.$refs.TableInput.form.setFields
        return this.$refs.service.$refs.TableInput.form.setFields({
            [key]: {
                errors: [value]
            }
        })
    }

    /* 获取新增公参所有数据*/
    public addAllData(values: any, val: string) {
        let that: any = this;
          this.$nextTick(() => {
        if (this.activeIndex === 1) {
            const vcrradd = (this.$refs.service as any);
            // console.log(vcrradd.getData())
            let {
                stateValue
            } = vcrradd.$refs.input;
            // let { stateValue }:any = val
            let obj = vcrradd.$refs.TableInput.getData();
            // let arr = JSON.parse(JSON.stringify(vcrradd.$refs.TableInput.getArr()));
            // console.log("vcrradd.getData()",arr)
            let serviceList: any = [];
            // let {
            //     timeFrom,
            //     timeTo
            // } = obj;
            // console.log(timeFrom, timeTo);
            // console.log('values',values);
            // let formData = vcrradd.getFildValue()
            //    let arrLen = arr.length
            // if(!this.checkSaveData(arr,arrLen,formData)) return false
            for (let i = 0; i < obj.length; i++) {
                serviceList.push({
                    weekdayFrom: obj[i].weekdayFrom,
                    weekdayTo: obj[i].weekdayTo,
                    dayFrom: obj[i].dayFrom,
                    dayTo: obj[i].dayTo,
                    type: obj[i].Type == "Off-peak" ? 2 : 1 || obj[i].Type == "peak" ? 1 : 2,
                    timeFrom: obj[i].timeFrom && obj[i].timeFrom ? moment(obj[i].timeFrom).format('HH:mm:ss') : obj[i].timeFrom,
                    timeTo: obj[i].timeTo && obj[i].timeTo ? moment(obj[i].timeTo).format('HH:mm:ss') : obj[i].timeTo,
                });
               
                // if(moment(obj[i].timeFrom).format('HH:mm:ss')> moment(obj[i].timeTo).format('HH:mm:ss')){
                //      this.$message.error(`${values} can NOT be empty`)
                // }
                if (moment(obj[i].timeFrom).format('HH:mm:ss') > moment(obj[i].timeTo).format('HH:mm:ss')) {
                    that.$message.error("The start time of workday cannot be greater than the end time of workday");
                }
            }
            let timeband: any = stateValue.trim();
    
            // let i = this.index;
            // console.log(serviceList[i].timeFrom,serviceList,this.index);
            let service = {
                "detailList": serviceList,
                "timeBandName": timeband
            }
            // console.log(service);
            VcTimeBandAdd(service).then((res: any) => {
                //  that.$message.error(res.msg);
                if (res.code >= 1) {
                    that.visible = !that.visible;
                    that.$message.success("Successful addition");
                    this.$set(this.Formscreening[1], 'disabled', true)
                    this.$set(this.Formscreening[2], 'disabled', true)
                    this.$set(this.Formscreening[3], 'disabled', true)
                    this.SearchOk((this.$refs.AdvancedSearch as any).getFieldsValue())
                }
                if(res.code < 1 ){
                    this.$message.error(res.msg);
                }
            });
        }
          });
    }
    //修改的公参数据
    public editllData(values: any): void {
        let that: any = this;
        if (this.activeIndex === 2) {
            const editRef = that.$refs.editRef;
    
            let obj = JSON.parse(JSON.stringify(editRef.$refs.TableInput.getData()));

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
                });
          
                if (moment(obj[i].timeFrom).format('HH:mm:ss') > moment(obj[i].timeTo).format('HH:mm:ss')) {
                    that.$message.error("The start time of workday cannot be greater than the end time of workday");
                }
            }

            let service = {
                "detailList": serviceList,
                "timeBandName": this.addEdit[0].timeBandName
            }
     
            //编辑请求数据
            VcTimeBandEdit(service).then((res: any) => {
                if (res.code >= 1) {
                    that.visible = !that.visible;
   
                    that.$message.success("Successful addition");
                    this.$set(this.Formscreening[1], 'disabled', true)
                    this.$set(this.Formscreening[2], 'disabled', true)
                    this.$set(this.Formscreening[3], 'disabled', true)
                    // AxiosGet("/config/vc-time-band").then((res: any) => {
                    //     that.tableDatasa = res.data;
                    // });
                    setTimeout(() => {
                        this.SearchOk((this.$refs.AdvancedSearch as any).getFieldsValue())
                    }, 100)
                }
                  if(res.code < 1 ){
                    this.$message.error(res.msg);
                }
            });
        }
    }
    // private toExport(selectedData: any, name: any = 'VcTimeBand.xls', selected ? : any): void {
    //     const filterData = selectedData.map((item: any) => {
    //         let newItem = JSON.parse(JSON.stringify(item))
    
    //         const detailList = newItem.detailList;

    //         delete newItem.detailList.id

    //         let {
    //             dayFrom,
    //             dayTo,
    //             type,
    //             timeFrom,
    //             timeTo
    //         } = detailList
    //         detailList.map((item: any) => {
     
    //             let dayFrom = item.dayFrom;
    //             let dayTo: number = item.dayTo;
    //             let timeFrom: string = item.timeFrom;
    //             let timeTo: string = item.timeTo;
    //             let type: string = item.type;
    
    //         })
    
    //         return newItem
    //     })
    //     const ws: xlsx.WorkSheet = xlsx.utils.json_to_sheet(filterData);
    //     const wb: xlsx.WorkBook = xlsx.utils.book_new();
    //     xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');
    //     xlsx.writeFile(wb, name);
    // }
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
        // console.log(selectedData);

        // console.log(index !== 5 && (this.visible = !this.visible) && (this.activeIndex = index));
        // console.log(this.detailsId);
        const deleted = selectedData.map((item: any) => item.timeBandName).join(",") //多选删除
        if (index == 1 && this.detailsId) {
            this.activeIndex = 1;
            this.direction = '';
            this.visible = true
        }
        if (index == 2) {

            this.activeIndex = 2;
            this.addEdit = selectedData
            if (this.addEdit[0].detailList.length == 2) {}
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
                    VCTimeBandDelete(deleted).then((res: any) => {

                        if (res.code < 0) {
                            _this.$message.error(res.msg);

                            _this.visible = false;
                            code = res.code
                        } else {
                            _this.$set(_this.Formscreening[1], 'disabled', true)
                            _this.$set(_this.Formscreening[2], 'disabled', true)
                            _this.$set(_this.Formscreening[3], 'disabled', true)
                            code = res.code
                            _this.visible = false;
                            _this.$message.success("Data has been deleted successfully");
                            _this.SearchOk("");

                        }
                    });

                }
            });
        }
        /**export按钮 */
        if (index == 4) {
            // this.activeIndex = 4;
            // if (activeObJ === undefined) {
            //     // Export
            //     this.toExport(selectedData, undefined, selected)
            // }
            //   onSelectClick(this.columns, this.tableDatasa, `Vc Number plan`, "Vc Number plan");
              downloadExcel(this.columns, this.tableDatasa, `Vc Number plan`, "Vc Number plan");
            // index !== 3 && (this.visible = !this.visible) && (this.activeIndex = index);
        }
        // setTimeout(() => {
        //     console.log('visible', this.visible);

        // }, 1000);
        index !== 5 && (this.visible = !this.visible) && (this.activeIndex = index)
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
