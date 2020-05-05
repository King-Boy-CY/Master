<template>
<div>
    <span style="color:red">*</span>Time band name
    <a-input class="input" size="large" ref="input" onKeypress="javascript:if(event.keyCode == 32)event.returnValue = false;" />
    <Table-input :inputcolumns="inputcolumns" @input="selectchange" @select="selectchange" :tableAdd="selectedRows" :inputdata="inputdata" border :addData="Newdata" @addChange="addData" @deleteChange="dele" ref="TableInput" :diyAdd="true" @onDiyAdd="onDiyAdd"></Table-input>
</div>
</template>

<script lang="ts">
import Vue from "vue";
import {
    Component,
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
import {
    refsConfig
} from '@/assets/ts/config.d'
@Component({
    components: {
        TableInput: resolve =>
            require(["@/common/TableInput/timeband.vue"], resolve),
        AdvancedSearch: resolve =>
            require(["@/common/Advancedsearch/index.vue"], resolve)
    }
})
export default class VcTimeBandServer extends Vue {
    @Prop() addEdit: any;
    @State("contractData") contractData: any;
    private serviceFilterObj: any;
    public $refs: refsConfig | any
    private index: number = 0;
    private Newdata: any[] = [];
    private isWeekday: boolean = false
    private isDays: boolean = false
    private Service: any = {};
    private val: String = '';
    private selectedRows: any[] = [] // 表格选中
    private dayObj: any = {}
    private form: any; //表单
    private planNameObj: any = {};
    private roundingRuleName: any;
    public beforeCreate(): void {
        let that: any = this;
    }
    public inputcolumns: any[] = [{
            title: "No .",
            dataIndex: "No",
            key: "No"
        },
        {
            title: "Day",
            dataIndex: "Day",
            require: true,
            width: "100px"
            // sorter: (a:any, b:any) => a.age - b.age -> 排序声明函数
        },
        {
            title: "Weekday",
            dataIndex: "Weekday",
            dataType: "input",
            require: true,
            width: "100px"
            // sorter: (a:any, b:any) => a.age - b.age -> 排序声明函数
        },
        {
            title: "Specific time",
            dataIndex: "Specifictime",
            dataType: "input",
            require: true
        },
        {
            title: "Type",
            dataIndex: "Type",
            dataType: "input",
            require: true,
            width: '120px'
        }
    ];
    public inputdata: any[] = [{
        key: 1,
        Day: {
            decorator: "select",
            options: null,
            children: [{
                    type: 'select',
                    decorator: 'dayFrom',
                    disabled: true,
                    require: false,
                    options: ["01", "02", "03", "04", "05", "06", "07", "08", "09", 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]
                },
                {
                    type: 'select',
                    decorator: 'dayTo',
                    disabled: true,
                    require: false,
                    slotName: 'To',
                    options: ["01", "02", "03", "04", "05", "06", "07", "08", "09", 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]
                }
            ]
        },
        Weekday: {
            type: "picker",
            decorator: "Weekday",
            // initialValue: "1",
            options: null,
            require: true,
            children: [{
                    type: 'select',
                    disabled: false,
                    require: false,
                    decorator: 'weekdayFrom',
                    initialValue: "01",
                    options: ["01", "02", "03", "04", "05", "06", "07"]
                },
                {
                    type: 'select',
                    disabled: false,
                    require: false,
                    slotName: 'To',
                    decorator: 'weekdayTo',
                    initialValue: "07",
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
                    require: true,
                    initialValue: "00:00:00",
                    decorator: 'timeFrom',
                },
                {
                    type: 'timeFrom',
                    require: true,
                    slotName: 'To',
                    initialValue: "23:59:59",
                    decorator: 'timeTo',
                }
            ]
        },
        Type: {
            type: "select",
            decorator: "type",
            options: [{
                    name: "peak",
                },
                {
                    name: 'Off-peak',
                },
            ]
        }
    }];

    /* ADD 数据生成 */
    public actions() {
        const arr: any = [];
        this.index++;
        this.index + 1;
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
                initialValue: "01",
                decorator: `weekdayFrom${this.index}`,
                slotName: 'To',
                disabled: false,
                options: ["01", "02", "03", "04", "05", "06", "07"]
            },
            {
                type: 'select',
                initialValue: "07",
                decorator: `weekdayTo${this.index}`,
                disabled: false,
                options: ["01", "02", "03", "04", "05", "06", "07"]
            }
        ]
        let time: object = [{
                type: 'timeFrom',
                decorator: `timeFrom${this.index}`,
                initialValue: "00:00:00",
                slotName: 'To',
            },
            {
                type: 'timeFrom',
                initialValue: "23:59:59",
                decorator: `timeTo${this.index}`,
            }
        ]
        const actions = new Map([
            [1, []],
            [2, ["input", `Day${this.index}`, "", "", ]],
            [3, ["input", `Weekday${this.index}`, "", "", ]],
            [4, ["timeFrom", `Specifictime${this.index}`, "", "", time]],
            [5, ["select", `Type${this.index}`,
                [{
                        name: "peak",
                    },
                    {
                        name: "Off-peak",
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
                children: action[4] || undefined
            });
        }
        return arr;
    }

    private change(val: string) {
        console.log(val)
    }

    /*选择校验*/
    private selectchange(inputdata: any, name: any, u, key: number, index: number) {
        this.$nextTick(() => {
            const that = this;
            let getdata = (that.$refs.TableInput as any).getData(true);
            // console.log(inputdata, name, name, u, key, index);
            // console.log('getdata', getdata);
            let data = (that.$refs.TableInput as any).getArr()
            // console.log('data', data);
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
                // 2 week
                this.$set(dataItem.name[2].children[0], 'disabled', isHasDay)
                this.$set(dataItem.name[2].children[1], 'disabled', isHasDay)
                this.$set(dataItem.name[2], 'require', isHasWeek)
                let week = this.inputdata[0].Weekday.children;
                if (isHasWeek == false) {
                    week.forEach((item: any, index) => {
                        item.initialValue = undefined
                    })
                } else if (isHasWeek == true) {
                    week[0].initialValue = "01"
                    week[1].initialValue = '07'
                }
            })
            //Day的校验
            if (!!inputdata && name.indexOf('dayTo') > -1 && Number(getdata[key].dayFrom) > Number(inputdata)) {
                return this.$message.error("Day to can NOT be less than Day from");
            }
            if (!!inputdata && name.indexOf('dayFrom') > -1 && Number(getdata[key].dayTo) < Number(inputdata)) {
                return this.$message.error("Day to can NOT be less than Day from");
            }
            //weekday的校验
            if (!!inputdata && name.indexOf('weekdayTo') > -1 && Number(getdata[key].weekdayFrom) > Number(inputdata)) {
                return this.$message.error("WeekDay to can NOT be less than  WeekDay from ");
            }
            if (!!inputdata && name === "weekdayFrom" && Number(getdata[key].weekdayTo) < Number(inputdata)) {
                return this.$message.error("Specific time to  can NOT  be less   Specific time from e");
            }

            //timeFromday的校验
            if (!!inputdata && name.indexOf('timeTo') > -1 && Number(getdata[key].timeFrom) > Number(inputdata)) {
                return this.$message.error("Specifictime to can NOT be less than  Specificfrom ");
            }

        })
    }
    private getFildValue() {
        return this.$refs.TableInput.form.getFieldsValue();
    }
    private getSetFields() {
        return this.$refs.TableInput.form.setFields
    }
    // public async created(name: any, selectedData: any) {
    //     this.addData();
    // }
    // add数据
    public addData() {
        this.Newdata = [this.actions()];
        console.log(this.Newdata, this.form);
    }

    private onDiyAdd() {
        let dataArr: any = this.$refs.TableInput.getArr()
        // console.log('dataArr', dataArr);
        // let data:any = this.$refs.TableInput.getData();
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

                })
            }
            if (deepNameItem.decorator) {
                const match = deepNameItem.decorator.match(/[a-zA-Z]+/)
                if (match) {
                    deepNameItem.decorator = match[0] + key + deepIndex
                }
            }
        })
        // console.log('deep', deep);
        dataArr.push(deep)
        // console.log('dataArr', dataArr);
    }

    public dele() {
        // this.index--;
    }
    /* 表格输入框 校验成功触发 */
    // private values: any;
    // private goNoNext: boolean = true;
    // public getData() {
    //     return this.$refs.TableInput && this.$refs.TableInput.getData()
    // }

    // private Directions: any = []
    // private Services: any = []
    // private contractServiceArr: any

    // /* 数据更新触发 */
    // public sourcesUpdata(values: any[]) {
    //     values.forEach((val: any) => {
    //         val.name.length && val.name.forEach((item: any) => {
    //             if (!!item.decorator && item.decorator.indexOf("Service") > -1 && item.options.length !== this.ContractDetails.Service.length) {
    //                 item.options = this.ContractDetails.Service
    //             }
    //         });
    //     });
    // }
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
