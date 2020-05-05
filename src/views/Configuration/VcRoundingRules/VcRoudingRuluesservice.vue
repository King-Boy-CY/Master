<template>
<div>
    <Table-input :inputcolumns="inputcolumns" :inputdata="inputdata" border :addData="Newdata" @addChange="addData" @deleteChange="dele" @select="handleChange" @input="handleChange"  @sourcesUpdata="sourcesUpdata" ref="TableInput"></Table-input>
</div>
</template>

<script lang="ts">
import Vue from "vue";
import {
    Component
} from "vue-property-decorator";
import {
    AxiosGet
} from "@/api/axios";
import {
    State,
    Mutation
} from "vuex-class";
import {recodeConfig,refsConfig} from '@/assets/ts/config.d'

@Component({
    components: {
        TableInput: resolve => require(["@/common/TableInput/timeband.vue"], resolve),
        AdvancedSearch: resolve => require(["@/views/Configuration/NumberPlan/index.vue"], resolve)
    }
})
export default class vcRoundingRuleservice extends Vue {
    public $refs:refsConfig | any
    private serviceFilterObj: any;
    private index: number = 0;
    private Newdata: any[] = [];
    private Service: any = {};
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
            title: "RuleName",
            dataIndex: "roundingRuleName",
            dataType: "input",
            require: false,
            width:"140px"
            // sorter: (a:any, b:any) => a.age - b.age -> 排序声明函数
        },
        {
            title: "Minimum value",
            dataIndex: "minimumValue",
            dataType: "input",
            require: true,
            // 校验是不是一个数字
            rules: [{
                validator: (rule: any, value: any, callback: any) => {
                    if (!value) {
                        callback()
                    }
                    const pattern: RegExp = new RegExp(/^[1-9]\d*$/, "g")
                    if (!pattern.test(value)) {
                        callback(`Only number is allowed for ${value}`)
                    } else {
                        callback()
                    }
                }
            }]
            // sorter: (a:any, b:any) => a.age - b.age -> 排序声明函数
        },
        {
            title: "Initial rounding",
            dataIndex: "initialRounding",
            dataType: "input",
            require: true,
            // 校验是不是一个数字
            rules: [{
                validator: (rule: any, value: any, callback: any) => {
                    if (!value) {
                        callback()
                    }
                    const pattern: RegExp = new RegExp(/^[1-9]\d*$/, "g")
                    if (!pattern.test(value)) {
                        callback(`Only number is allowed for ${value}`)
                    } else {
                        callback()
                    }
                }
            }]
        },
        {
            title: "Additional rounding",
            dataIndex: "additionalRounding",
            dataType: "input",
            require: true,
            // 校验是不是一个数字
            rules: [{
                validator: (rule: any, value: any, callback: any) => {
                    if (!value) {
                        callback()
                    }
                    const pattern: RegExp = new RegExp(/^[1-9]\d*$/, "g")
                    if (!pattern.test(value)) {
                        callback(`Only number is allowed for ${value}`)
                    } else {
                        callback()
                    }
                }
            }]
        },
        {
            title: "Maximum",
            dataIndex: "maximumValue",
            dataType: "input",
            require: false,
            // 校验是不是一个数字
            rules: [{
                validator: (rule: any, value: any, callback: any) => {
                    if (!value) {
                        callback()
                    }
                    const pattern: RegExp = new RegExp(/^[1-9]\d*$/, "g")
                    if (!pattern.test(value)) {
                        callback(`Only number is allowed for ${value}`)
                    } else {
                        callback()
                    }
                }
            }]
        },
        {
            title: "Measure adjustment",
            dataIndex: "measureAdjustment",
            dataType: "input",
            require: false,
            // 校验是不是一个数字
            rules: [{  
                validator: (rule: any, value: any, callback: any) => {
                    if (!value) {
                        callback()
                    }
                    const pattern: RegExp = new RegExp(/^-?[0-9]\d*$/, "g")
                    if (!pattern.test(value)) {
                        callback(`Only number is allowed for ${value}`)
                    } else {
                        callback()
                    }
                }
            }]
        },
        {
            title: "Treat maximumValue as a cap",
            dataIndex: "isMaximumAsCap",
            dataType: "picker",
            require: false,
            customRender: (value: any, row: any, index: any) => {
                const obj = {
                    children: value
                };
                const find: any = this.TreatMaximumAsACapOptions.find(
                    (item: any) => item.value === value
                );
                if (find) {
                    obj.children = find.name;
                }
                return obj;
            }
        }
    ];
    public TreatMaximumAsACapOptions: any = [{
            name: "NO",
        },
        {
            name: "YES",
        }
    ];
    public inputdata: any[] = [{
        key: 1,
        roundingRuleName: {
            type: "input",
            decorator: "roundingRuleName",
            initialValue:'1\xa0:1\xa0:1\xa0:\xa00:\xa00:',
            disabled: true,
            options: null
        },
        minimumValue: {
            type: "input",
            decorator: "minimumValue",
            initialValue: "1",
            options: null
        },
        initialRounding: {
            type: "input",
            decorator: "initialRounding",
            initialValue: "1",
            options: null,
         
        },
        additionalRounding: {
            type: "input",
            decorator: "additionalRounding",
            initialValue: "1",
            options: null
        },
        maximumValue: {
            type: "input",
            decorator: "maximumValue",
            options: null,
            width: 80
        },
        measureAdjustment: {
            type: "input",
            decorator: "measureAdjustment",
            options: null
        },
        isMaximumAsCap: {
            type: "select",
            decorator: "isMaximumAsCap",
            // initialValue: "YES",
            options: this.TreatMaximumAsACapOptions
        }
    }];

    /* ADD 数据生成 */
    public actions() {
        const arr:any = [];
        let isDisabled: any = true;
        let num: number = 1;
        let val:string ='1\xa0:1\xa0:1\xa0:\xa00:\xa00:';
        this.index++;
        const actions = new Map([
            [1, []],
            [2, ["input", `roundingRuleName${this.index}`, "", val, isDisabled]],
            [3, ["input", `minimumValue${this.index}`, '', num ]],
            [4, ["input", `initialRounding${this.index}`, '', num]],
            [5, ["input", `additionalRounding${this.index}`, '', num]],
            [6, ["input", `maximumValue${this.index}`]],
            [7, ["input", `measureAdjustment${this.index}`]],
            [8, ["select",
                    `isMaximumAsCap${this.index}`,
                    [
                        {
                            name: "NO",
                        },
                        {
                            name: "YES",
                        },  
                    ],
                ],]
        ]);
        for (let index = 1; index < actions.size + 1; index++) {
            const action: any = actions.get(index);
            arr.push({
                type : action[0],
                decorator: action[1],
                options: action[2],
                initialValue: action[3] || "",
                disabled: action[4] || false
            });
        }
        return arr;
    }

    public handleChange(name: string, arr: string, val: any) {
        // console.log(this.planNameObj);
        this.$nextTick(() => {
        this.splitChange();
        })
    }

    public async created() {
        await AxiosGet("/config/droplist/vcRoundingRule/names")
            .then((res: recodeConfig) => {
                this.inputdata[0]["options"] = res.data;
            })
            .catch((err: string) => {
                this.addData();
            });
        console.log(this.form);
        this.addData();
    }
    // add数据
    public addData() {
        this.Newdata = [this.actions()];
    }
    public dele() {
        this.index--;
    }
    /* 表格输入框 校验成功触发 */
    private val: any;
    private values: any;
    private goNoNext: boolean = true;
    public splitChange() {
        this.$nextTick(() => {
        let rulesArr = this.$refs.TableInput.getData();
        let inStigetArr = this.$refs.TableInput.getArr();
        // console.log(rulesArr,obj,)
        if(rulesArr){
        rulesArr.forEach((elem: any, index: number) => {
            let roundingRuleName = inStigetArr[index]["name"][1]["decorator"];
            let {
                additionalRounding,
                initialRounding,
                isMaximumAsCap,
                maximumValue,
                measureAdjustment,
                minimumValue
            } = elem;
            // console.log(isMaximumAsCap);
            this.$refs.TableInput.form.setFieldsValue({
                [roundingRuleName]: `${minimumValue || "0"}\xa0:${initialRounding || '0'}\xa0:${additionalRounding || "0"}:${maximumValue || "0"}\xa0:${measureAdjustment || "0"}\xa0:${isMaximumAsCap === "NO" ? "0" : '' || isMaximumAsCap === "YES" ? "1" : ''}`
            });
            });
        }
        });
    }
  
    private Directions: any = [];
    private Services: any = [];
    private contractServiceArr: any;
    /* 数据更新触发 */
    public sourcesUpdata(values: any[]) {
        this.created();
    }
    public deactivated() {}
}
</script>

<style>
.tab {
    border: 1px solid red;
}
</style>
