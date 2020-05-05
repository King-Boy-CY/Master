<template>
<div>
    <Table-input :isNotCheck="true" :inputcolumns="inputcolumns" border :inputdata="inputdata" ref="TableInput" :addData="Newdata" @addChange="addData" @deleteChange="dele" :Rounding="isRouting" @input="selectchange" @select="selectchange" :diyAdd="true" @onDiyAdd="onDiyAdd" />
</div>
</template>

<script lang="ts">
import Vue from "vue";
import {
    Component,
    Prop
} from "vue-property-decorator";
import {
    notempty,
    deepClone
} from '@/assets/ts/index.ts'
import {
    refsConfig,
    recodeConfig
} from "@/assets/ts/config.d"
import {
    inputcolumnsTop,
    inputdataTopadd
} from './VendorSourceList'

@Component({
    components: {
        TableInput: resolve =>
            require(["@/common/TableInput/timeband.vue"], resolve)
    }
})

export default class VendorSourceAdd extends Vue {

    private Newdata: any[] = [];
    private index: number = 0;
    private isRouting: boolean = false;
    public $refs: refsConfig | any;

    /* 表头 */
    public inputcolumns: any[] = inputcolumnsTop;
    /* 表格 */
    public inputdata: any[] = inputdataTopadd;

    /* 方法 */

    /* Add生成 */
    public actions() {
        const arr: any = [];
        this.index++;
        this.index + 1;
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

        return arr;
    }

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
            // console.log('getdata', getdata);
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
                weekdayToArr.push(dataItem.weekdayTo)
            })
            const isHasDay: boolean = !!(notempty(dayFromArr).length + notempty(dayToArr).length)
            const isHasWeek: boolean = !!(notempty(weekdayFromArr).length + notempty(weekdayToArr).length)
            // console.log(notempty(dayFromArr));
            // console.log(notempty(dayToArr));
            data.forEach((dataItem: any, dataIndex: any) => {
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

    public async created(name: any, selectedData: any) {
        this.addData();
        this.inputdata[0].day.children[0].disabled = false
        this.inputdata[0].day.children[1].disabled = false
        this.inputdata[0].weekday.children[0].disabled = false
        this.inputdata[0].weekday.children[1].disabled = false
    }

    /* Add数据 */
    // private addList: any;
    public addData() {
        // if (this.$refs.TableInput) {
        //     this.addList = this.$refs.TableInput.getData()
        // }
        this.Newdata = [this.actions()]
        // console.log(this.Newdata)
    }

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
                    item.initialValue = undefined
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

}
</script>

<style lang="scss">


</style>
