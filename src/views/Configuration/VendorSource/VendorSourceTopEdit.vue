<template>
<div>
    <Table-input :isNotCheck="true" :inputcolumns="inputcolumns" border :inputdata="inputdata" ref="TableInput" :addData="Newdata" @addChange="addData" @deleteChange="dele" :Rounding="isRouting" @input="selectchange" @select="selectchange" />
</div>
</template>

<script lang="ts">
import Vue from "vue";
import {
    Component,
    Prop
} from "vue-property-decorator";
import {
    notempty
} from '@/assets/ts/index.ts'
import {
    refsConfig,
    recodeConfig
} from "@/assets/ts/config.d"
import {
    Axios,
    AxiosGet
} from "@/api/axios";
import {
    inputcolumnsTop
} from "./VendorSourceList"

@Component({
    components: {
        TableInput: resolve =>
            require(["@/common/TableInput/timeband.vue"], resolve)
    }
})

export default class VendorSourceTopEtid extends Vue {
    @Prop() addEdit: any;
    private Newdata: any[] = [];
    private index: number = 0;
    private isRouting: boolean = false;
    public $refs: refsConfig | any;

    /* 表头 */
    public inputcolumns: any[] = inputcolumnsTop;

    public inputdata: any[] = []

    /* 方法 */

    /* 校验 */
    private selectchange(inputdata: any, name: any, u, key: number, index: number) {
        // console.log("inputdata",inputdata) //选中的值
        // console.log("name",name) // decorator
        // console.log("u",u)
        // console.log("key",key)
        // console.log("index",index)
        this.$nextTick(() => {
            const that = this;
            let getdata = this.$refs.TableInput.getData();
            let data = this.$refs.TableInput.getArr();
            // console.log(this.$refs.TableInput)
            let dayFromArr: any = [];
            let dayToArr: any = [];
            let weekdayFromArr: any = [];
            let weekdayToArr: any = [];
            getdata.forEach((dataItem: any, dataIndex: number) => {
                dayFromArr.push(dataItem.dayFrom)
                dayToArr.push(dataItem.dayTo)
                weekdayFromArr.push(dataItem.weekdayFrom)
                weekdayToArr.push(dataItem.weekdayToArr)
            })
            const isHasDay: boolean = !!(notempty(dayFromArr).length + notempty(dayToArr).length)
            const isHasWeek: boolean = !!(notempty(weekdayFromArr).length + notempty(weekdayToArr).length)
            data.forEach((dataItem: any, dataIndex: any) => {
                // console.log(dataItem,dataIndex)
                this.$set(dataItem.name[2].children[0], 'disabled', isHasWeek)
                this.$set(dataItem.name[2].children[1], 'disabled', isHasWeek)
                this.$set(dataItem.name[2], 'require', isHasDay)
                
                this.$set(dataItem.name[3].children[0], 'disabled', isHasDay)
                this.$set(dataItem.name[3].children[1], 'disabled', isHasDay)
                this.$set(dataItem.name[3], 'require', isHasWeek)
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
        })
    }

    /* Add数据 */
    public addData() {
        this.Newdata = [this.actions()]
    }

    public dele() {
        this.index--;
    }

    /* Add生成 */
    public actions() {
        const arr: any = [];
        this.index ++;
        if(this.index < this.addEdit.TimeBand.length) {
            this.index = this.addEdit.TimeBand.length
        }
        let days: object = [{
                type: 'select',
                decorator: `dayFrom${this.index}`,
                disabled: false,
                options: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"]
            },
            {
                type: 'select',
                decorator: `dayTo${this.index}`,
                disabled: false,
                slotName: 'to',
                options: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"]
            }
        ]
        let weekdays: object = [{
                type: 'select',
                decorator: `weekdayFrom${this.index}`,
                disabled: false,
                options: ["01", "02", "03", "04", "05", "06", "07"]
            },
            {
                type: 'select',
                decorator: `weekdayTo${this.index}`,
                disabled: false,
                slotName: 'to',
                options: ["01", "02", "03", "04", "05", "06", "07"]
            }
        ]
        let times: object = [{
                type: 'timeFrom',
                decorator: `timeFrom${this.index}`,
            },
            {
                type: 'timeFrom',
                slotName: 'to',
                decorator: `timeTo${this.index}`,
            }
        ]

        const actions = new Map([
            [1, []],
            [2, ["input", `timeBandName${this.index}`, "", "peak"]],
            [3, ["input", `day${this.index}`, "", "", days]],
            [4, ["input", `weekday${this.index}`, "", "", weekdays]],
            [5, ["timeFrom", `specificTime${this.index}`, "", "", times]]
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
        let list = this.addEdit.TimeBand
        if(list[0].weekdayFrom || list[0].weekdayTo) {
            days[0].disabled = true
            days[1].disabled = true
        }
        if(list[0].dayFrom || list[0].dayTo) {
            weekdays[0].disabled = true
            weekdays[1].disabled = true
        }
        return arr;
    }

    private serviceList: any = [];
    private editId:any = this.$store.state.vendorSourceNum
    public async created() {
        let that: any = this;
        // console.log("addEdit",this.addEdit)
        this.serviceList = this.addEdit.TimeBand
        // console.log(this.serviceList)
        // let url = `/config/vendor-source/${this.editId}`
        // let serviceList: any;
        // await AxiosGet(url).then((res: any) => {
        //     serviceList = res.data.TimeBand
        //     // console.log("里面",serviceList)
        // })
        // // console.log(serviceList)
        let inputdata: any = []
            if (this.serviceList) {
                for (let i = 0; i < this.serviceList.length; i++) {
                    let item = this.serviceList[i]
                    // console.log(item)
                    inputdata[i] = {
                        key: 1,
                        timeBandName: {
                            type: "input",
                            decorator: `timeBandName${i}`,
                            options: null,
                            initialValue: item.timeBandName
                        },
                        day: {
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
                                    disabled: (item.weekdayFrom || item.weekdayTo) && true || false,
                                    initialValue: item.dayTo,
                                    slotName: 'To',
                                    options: ["01", "02", "03", "04", "05", "06", "07", "08", "09", 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]
                                }
                            ]
                        },
                        weekday: {
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
                                    initialValue: item.weekdayTo,
                                    slotName: 'To',
                                    options: ["01", "02", "03", "04", "05", "06", "07"]
                                }
                            ]
                        },
                        specificTime: {
                            type: "timeFrom",
                            decorator: "specificTime",
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
                        }
                    }
                    this.inputdata = inputdata
                }
            }
        this.addData();
    }
}
</script>

<style lang="scss">

</style>
