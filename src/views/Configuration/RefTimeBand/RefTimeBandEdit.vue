<template>
<div>
    <span style="color:red">*</span> Time band name
    <a-input :required="true" class="input" :disabled="true" size="large" ref="input" v-model="timebandname" />
    <Table-input :inputcolumns="inputcolumns" @select="selectchange" :tableAdd="selectedRows" :inputdata="inputdata" border :addData="Newdata" @addChange="addData" @deleteChange="dele" ref="TableInput" :diyAdd="true" @onDiyAdd="onDiyAdd"></Table-input>
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
    AxiosGet
} from "@/api/axios";
import {
    State,
    Mutation
} from "vuex-class";
import {
    Tree
} from 'iview';
import {
    notempty,
    deepClone
} from '@/assets/ts/index.ts'
import moment from 'moment';
import {
    recodeConfig,
    refsConfig
} from '@/assets/ts/config.d'
@Component({
    components: {
        TableInput: resolve =>
            require(["@/common/TableInput/timeband.vue"], resolve),
    }
})
export default class VcTimeBandEdit extends Vue {
    @Prop(Object) private values: any
    @Prop() addEdit: any;
    @Prop() selectedData: any;
    private serviceFilterObj: any;
    public $refs: refsConfig | any
    private timebandname: string = '';
    private Newdata: any[] = [];
    private index: number = 0;
    private d: any[] = [];
    private selectedRows: any[] = [] // 表格选中
    private Service: any = {};
    private form: any; //表单
    private planNameObj: any = {};
    public beforeCreate(): void {
        let that: any = this;
    }
    public inputcolumns: any[] = [{
            title: "No .",
            dataIndex: "No",
            key: "No",

        },
        {
            title: "Day",
            dataIndex: "Day",
            require: true,
            width:"100px"
            // sorter: (a:any, b:any) => a.age - b.age -> 排序声明函数
        },
        {
            title: "Weekday",
            dataIndex: "Weekday",
            dataType: "input",
            require: true,
             width:"100px"
            // sorter: (a:any, b:any) => a.age - b.age -> 排序声明函数
        },
        {
            title: "Specific time",
            dataIndex: "Specifictime",
            dataType: "input",
            require: false,
            width:"130px"
        },
        {
            title: "Begin time",
            dataIndex: "beginDateTime",
            dataType: "picker",
            require: true,
            width:"170px"
        },
        {
            title: "End time",
            dataIndex: "endDateTime",
            dataType: "picker",
            require: true,
            width:"170px"
        }
    ];
    public inputdata: any[] = [];
    private recode = (text, row, index, value) => {
        //  console.log('text', text, 'row', row, 'index', index,);
        return row.detailList.map((res: any) => {
            return `${res[value]  || ''} `
        })
    }
    private columns: any[] = [{
            dataIndex: 'timeBandName',
            width: 134,
            key: 'timeBandName',
        },
        {
            title: 'Day',
            children: [{
                    dataIndex: 'dayFrom',
                    width: 151,
                    key: 'dayFrom',
                    customRender: (text, row, index) => {
                        return {
                            children: this.recode(text, row, index, 'dayFrom')
                            //this.recode(text, row, index, 'dayFrom')
                        }
                    },
                },
                {
                    title: 'To',
                    dataIndex: 'dayTo',
                    width: 122,
                    key: 'dayTo',
                    disabled: false,
                    // customRender: (value: string, row: any, index: number) => {
                    //     return this.renderContent(value, row, index);
                    // }
                    scopedSlots: {
                        customRender: 'dayTo'
                    },
                    customRender: (text, row, index) => {
                        return {
                            children: this.recode(text, row, index, 'dayTo')
                            //this.recode(text, row, index, 'dayFrom')
                        }
                    }
                },
            ]
        },
        {
            title: 'Weekday',
            children: [{
                    title: 'WeekdaysFrom',
                    dataIndex: 'weekdayFrom',
                    width: 204,
                    key: 'weekdayFrom',
                    customRender: (text, row, index) => {
                        return {
                            children: this.recode(text, row, index, 'weekdayFrom')
                        }
                    }
                },
                {
                    title: 'WeekdaysTo',
                    dataIndex: 'weekdayTo',
                    width: 204,
                    key: 'weekdayTo',
                    customRender: (text, row, index) => {
                        return {
                            children: this.recode(text, row, index, 'weekdayTo')
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
                    width: 204,
                    key: 'timeFrom',
                    customRender: (text, row, index) => {
                        return {
                            children: this.recode(text, row, index, 'timeFrom')
                        }
                    }
                },
                {
                    title: 'To',
                    dataIndex: 'timeTo',
                    width: 124,
                    key: 'timeTo',
                    customRender: (text, row, index) => {
                        return {
                            children: this.recode(text, row, index, 'timeTo')
                        }
                    }
                },
            ]
        },
        {
            title: 'Type',
            dataIndex: 'type',
            width: 100,
            key: 'type',
            customRender: (text, row, index) => {
                return {
                    children: this.recode(text, row, index, 'type')
                }
            }
        },
        {
            title: 'Modified by',
            dataIndex: 'modifiedBy',
            width: 100,
            key: 'modifiedBy',
        },
        {
            title: 'Last modified',
            dataIndex: 'lastModified',
            width: 100,
            key: 'lastModified',

        }
    ];

    /* ADD 数据生成 */
    public actions() {
        const arr: any = [];
        this.serviceList = this.addEdit[0].detailList
        this.index++;
        if (this.index < this.addEdit[0].detailList.length) {
            this.index = this.addEdit[0].detailList.length
        }
        // console.log("this.serviceList",this.serviceList.length,this.index,)
        let options: object = [{
                type: 'select',
                decorator: `dayFrom${this.index}`,
                slotName: 'To',
                disabled: false,
                options: ["01", "02", "03", "04", "05", "06", "07", "08", "09", 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]
            },
            {
                type: 'select',
                decorator: `dayTo${this.index}`,
                disabled: false,
                options: ["01", "02", "03", "04", "05", "06", "07", "08", "09", 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]
            }
        ]
        let Weekday: object = [{
                type: 'select',
                decorator: `weekdayFrom${this.index}`,
                slotName: 'To',
                disabled: false,
                options: ["01", "02", "03", "04", "05", "06", "07"]
            },
            {
                type: 'select',
                decorator: `weekdayTo${this.index}`,
                disabled: false,
                options: ["01", "02", "03", "04", "05", "06", "07"]
            }
        ]
        let time: object = [{
                type: 'timeFrom',
                decorator: `timeFrom${this.index}`,
                slotName: 'To',
            },
            {
                type: 'timeFrom',
                decorator: `timeTo${this.index}`,
            }
        ]

        const actions = new Map([
            [1, []],
            [2, ["input", `Day${this.index}`, "", "", options]],
            [3, ["input", `Weekday${this.index}`, "", "", Weekday]],
            [4, ["timeFrom", `Specifictime${this.index}`, "", "", time]],
            [5, ["select", `Type${this.index}`,
                [{
                        name: "peak",
                        value: 0
                    },
                    {
                        name: "Off-peak",
                        value: 1
                    }
                ], 'peak'
            ]]
        ]);
        for (let index = 1; index < actions.size + 1; index++) {
            const action: any = actions.get(index);
            arr.push({
                type: action[0],
                decorator: action[1],
                options: action[2],
                initialValue: action[3] || "",
                children: action[4] || undefined,
            });
        }
        return arr;

    }

    private onSelect(record: any, selected: boolean, selectedRows: any) {
        console.log(selectedRows);
    }

    /**修改页面渲染数据*/
    private serviceList: any = [];
    public async created() {
        this.serviceList = this.addEdit[0].detailList
        console.log(this.addEdit[0]);
        this.timebandname = this.addEdit[0].timeBandName
        console.log(this.timebandname)
        ///config/droplist/vcTimeBandNames
        let inputdata: any = []
        console.log(this.serviceList);
        if (this.serviceList) {
            for (let i = 0; i < this.serviceList.length; i++) {
                let item = this.serviceList[i]
                // console.log(inputdata,"item.timeFrom",this.serviceList.length,item);   
                console.log("select", item.type)
                inputdata[i] = {
                    key: 1,
                    Day: {
                        decorator: "select",
                        options: null,
                        children: [{
                                type: 'select',
                                decorator: `dayFrom${i}`,
                                disabled: (item.weekdayFrom || item.weekdayTo) && true || false,
                                initialValue: item.dayFrom,
                                options: ["01", "02", "03", "04", "05", "06", "07", "08", "09", 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]
                            },
                            {
                                type: 'select',
                                decorator: `dayTo${i}`,
                                slotName: 'To',
                                disabled: (item.weekdayFrom || item.weekdayTo) && true || false,
                                initialValue: item.dayTo,
                                options: ["01", "02", "03", "04", "05", "06", "07", "08", "09", 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]
                            }
                        ]
                    },
                    Weekday: {
                        type: "picker",
                        decorator: "Weekday",
                        options: null,
                        children: [{
                                type: 'select',
                                disabled: (item.dayFrom || item.dayTo) && true || false,
                                decorator: `weekdayFrom${i}`,
                                initialValue: item.weekdayFrom,
                                options: ["01", "02", "03", "04", "05", "06", "07"]
                            },
                            {
                                type: 'select',
                                disabled: (item.dayFrom || item.dayTo) && true || false,
                                decorator: `weekdayTo${i}`,
                                slotName: 'To',
                                initialValue: item.weekdayTo,
                                options: ["01", "02", "03", "04", "05", "06", "07"]
                            }
                        ]
                    },
                    Specifictime: {
                        type: "timeFrom",
                        decorator: "Specifictime",
                        options: null,
                        children: [{
                                type: 'timeFrom',
                                decorator: `timeFrom${i}`,
                                initialValue: item.timeFrom,
                                disabled: false,

                            },
                            {
                                type: 'timeFrom',
                                initialValue: item.timeTo,
                                disabled: false,
                                slotName: 'To',
                                decorator: `timeTo${i}`,
                            }
                        ]
                    },
                    beginDateTime: {
                        type: "picker",
                        decorator: "beginDateTime",
                        disabled: false,
                        initialValue: moment(item.beginDateTime),
                        width: 60,
                        options: null
                    },
                    endDateTime: {
                        type: "picker",
                        decorator: "endDateTime",
                        initialValue: moment(item.endDateTime),
                        disabled: false,
                        width: 60,
                        options: null
                    },
                }
                // console.log(inputdata,item.timeTo,item.timeFrom,moment(item.timeFrom, 'HH:mm:ss'));
                this.inputdata = inputdata
                // this.$refs.TableInput.initDataAndColums(inputdata)
                // console.log(inputdata,this.$refs.TableInput);
            }
            // })
        }
        this.addData();
    }

    /*选择校验*/
    private selectchange(inputdata: any, name: any, u, key: number, index: number) {
        this.$nextTick(() => {
            const that = this;
            let getdata = that.$refs.TableInput.getData();
            console.log(inputdata, name, name, u, key, index);
            console.log('getdata', getdata);
            let data = that.$refs.TableInput.getArr()
            console.log('data', data);
            let dayFromArr: any = []
            let dayToArr: any = []
            let weekdayFromArr: any = []
            let weekdayToArr: any = []
            getdata.forEach((dataItem: any, dataIndex: number) => {
                dayFromArr.push(dataItem.dayFrom)
                dayToArr.push(dataItem.dayTo)
                weekdayFromArr.push(dataItem.weekdayFrom)
                weekdayToArr.push(dataItem.weekdayTo)
            })
            const isHasDay: boolean = !!(notempty(dayFromArr).length + notempty(dayToArr).length)
            const isHasWeek: boolean = !!(notempty(weekdayFromArr).length + notempty(weekdayToArr).length)
            // 1 day 2 week
            data.forEach((dataItem: any, dataIndex: any) => {
                this.$set(dataItem.name[1].children[0], 'disabled', isHasWeek)
                this.$set(dataItem.name[1].children[1], 'disabled', isHasWeek)
                this.$set(dataItem.name[1], 'require', isHasDay)
                this.$set(dataItem.name[1].children[0], 'require', isHasDay)
                this.$set(dataItem.name[1].children[1], 'require', isHasDay)

                // 2 week
                this.$set(dataItem.name[2].children[0], 'disabled', isHasDay)
                this.$set(dataItem.name[2].children[1], 'disabled', isHasDay)
                this.$set(dataItem.name[2], 'require', isHasWeek)
                this.$set(dataItem.name[2].children[0], 'require', isHasWeek)
                this.$set(dataItem.name[2].children[1], 'require', isHasWeek)
                // console.log( this.inputdata[0]);    
                //  if (isHasWeek == false) {
                //     week.forEach((item: any, index) => {
                //         item.initialValue = undefined
                //     })
                // } else if (isHasWeek == true) {
                //     week[0].initialValue = "01"
                //     week[1].initialValue = '07'
                // }
            })

            //Day的校验
            if (!!inputdata && name.indexOf('dayTo') > -1 && Number(getdata[key].dayFrom) > Number(inputdata)) {
                return this.$message.error("The number of days at the end of a month should not be less than the number of days at the beginning of a month");
            }
            if (!!inputdata && name.indexOf('dayFrom') > -1 && Number(getdata[key].dayTo) < Number(inputdata)) {
                return this.$message.error("The number of days at the beginning of a month should not be greater than that at the end of a month.");
            }
            //weekday的校验
            if (!!inputdata && name.indexOf('weekdayTo') > -1 && Number(getdata[key].weekdayFrom) > Number(inputdata)) {
                return this.$message.error("The end of the working day should not be less than the beginning of the working day");
            }
            if (!!inputdata && name === "weekdayFrom" && Number(getdata[key].weekdayTo) < Number(inputdata)) {
                return this.$message.error("The starting time of working day should not be greater than the ending time of working day");
            }
        })
    }

    // add数据
    public addData() {
        this.Newdata = [this.actions()];
    }
    // 自定义 add
    private onDiyAdd() {
        let dataArr: any = this.$refs.TableInput.getArr()
        console.log('dataArr', dataArr);
        if (!dataArr || !dataArr.length) return
        const deep: any = deepClone(dataArr[0])
        const key = new Date().getTime()
        deep.key = key
        deep.name.forEach((deepNameItem: any, deepIndex: number) => {
            if (deepNameItem.children && deepNameItem.children.length) {
                deepNameItem.children.forEach((item: any, index) => {
                    if (item.decorator) {
                        const match = item.decorator.match(/[a-zA-Z]+/)
                        if (match) {
                            item.decorator = match[0] + key + index
                        }
                    }
                    item.initialValue = undefined;
                    console.log(this.inputdata);
                    
                })
            }
            if (deepNameItem.decorator) {
                const match = deepNameItem.decorator.match(/[a-zA-Z]+/)
                if (match) {
                    deepNameItem.decorator = match[0] + key + deepIndex
                    deepNameItem.initialValue = undefined;
                }
            }

        })
        console.log('deep', deep);
        dataArr.push(deep)
        console.log('dataArr', dataArr);
    }

    public dele() {
        this.index--;
    }
    public getData() {
        return (this.$refs.TableInput as any) && (this.$refs.TableInput as any).getData()

    }
    private editsave() {

    }

    private Directions: any = []
    private Services: any = []
    private contractServiceArr: any
}
</script>

<style>
.tab {
    border: 1px solid red;
}

.input {
    width: 300px;
    margin: 0 0 20px 20px;

}
</style>
