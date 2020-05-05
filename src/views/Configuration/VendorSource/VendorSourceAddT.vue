<template>
<div>
    <Table-input :inputcolumns="inputcolumns" :inputdata="inputdata" border :addData="Newdata" @addChange="addData" @deleteChange="dele" @select="handleChange" @input="handleChange" @success="success" @sourcesUpdata="sourcesUpdata" ref="TableInput"></Table-input>
</div>
</template>

<script lang="ts">
import Vue from "vue";
import {
    Component,
} from "vue-property-decorator";
import {
    State,
    Mutation
} from "vuex-class";
import {
    refsConfig
} from "@/assets/ts/config.d";

@Component({
    components: {
        TableInput: resolve =>
            require(["@/common/TableInput/timeband.vue"], resolve),
        AdvancedSearch: resolve =>
            require(["@/common/Advancedsearch/index.vue"], resolve)
    }
})

export default class VendorSourceAddDown extends Vue {
    @State("ContractObject") ContractDetails: any;
    @Mutation("mutionService") mutionService: any;
    @Mutation("mutioServictFilter") mutioServictFilter: any;
    @Mutation("mutionServiceTest") mutionServiceTest: any;
    @State("contractData") contractData: any;
    private serviceFilterObj: any;
    private index: number = 0;
    private Newdata: any[] = [];
    private Service: any = {};
    private form: any; //表单
    private planNameObj: any = {};
    private roundingRuleName: any;
    public $refs: refsConfig | any;
    public beforeCreate(): void {
        let that: any = this;
    }
    public inputcolumns: any['Array'] = [{
            title: "No .",
            dataIndex: "No",
            key: "No"
        },
        {
            title: "Rule Name",
            dataIndex: "roundingRuleName",
            dataType: "input",
            require: false,
            width: "220px"
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
            title: "Measure adjustment",
            dataIndex: "measureAdjustment",
            dataType: "input",
            require: true,
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
            require: true,

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
    public TreatMaximumAsACapOptions = [{
            name: "YES",
            value: 1
        },
        {
            name: "NO",
            value: 2
        }
    ];
    public inputdata: any[] = [{
        key: 1,
        roundingRuleName: {
            type: "input",
            decorator: "roundingRuleName",
            disabled: true,
            options: null
        },
        minimumValue: {
            type: "input",
            decorator: "minimumValue",
            initialValue: "",
            options: null
        },
        initialRounding: {
            type: "input",
            decorator: "initialRounding",
            initialValue: "",
            options: null,

        },
        additionalRounding: {
            type: "input",
            decorator: "additionalRounding",
            initialValue: "",
            options: null
        },
        maximumValue: {
            type: "input",
            decorator: "maximumValue",
            options: null,
            initialValue: "",
            width: 80
        },
        measureAdjustment: {
            type: "input",
            decorator: "measureAdjustment",
            initialValue: "",
            options: null
        },
        isMaximumAsCap: {
            type: "select",
            decorator: "isMaximumAsCap",
            initialValue: "",
            options: this.TreatMaximumAsACapOptions
        }
    }];

    /* ADD 数据生成 */
    public actions() {
        const arr: any = [];
        let isDisabled: any = true;
        let num: number = 1;
        this.index++;
        const actions = new Map([
            [1, []],
            [2, ["input", `roundingRuleName${this.index}`, "", "", isDisabled]],
            [3, ["input", `minimumValue${this.index}`, '', '']],
            [4, ["input", `initialRounding${this.index}`, '', '']],
            [5, ["input", `additionalRounding${this.index}`, '', '']],
            [6, ["input", `maximumValue${this.index}`, '', '']],
            [7, ["input", `measureAdjustment${this.index}`, '', '']],
            [8,
                [
                    "select",
                    `isMaximumAsCap${this.index}`,
                    [{
                            name: "YES",
                            value: 1,
                        },
                        {
                            name: "NO",
                            value: 2
                        },

                    ],
                ],
            ]
        ]);
        for (let index = 1; index < actions.size + 1; index++) {
            const action: any = actions.get(index);
            arr.push({
                type: action[0],
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
        this.addData();
        // this.splitChange();
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
        setTimeout(() => {
            this.$nextTick(() => {
                let rulesArr = (this.$refs.TableInput as any).getData();
                let inStigetArr = (this.$refs.TableInput as any).getArr();
                // console.log(rulesArr,obj,)
                if (rulesArr) {
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
                        (this.$refs.TableInput as any).form.setFieldsValue({
                            [roundingRuleName]: `${minimumValue || ""}\xa0:${initialRounding || '1'}\xa0:${additionalRounding || ""}\xa0:${maximumValue || ""}\xa0:${measureAdjustment || ""}\xa0:${maximumValue ? (isMaximumAsCap === "NO" ? "0" : isMaximumAsCap || isMaximumAsCap === "YES" ? "1" : isMaximumAsCap): ""}`
                        });
                    });
                }
            });
        }, 10000)
    }
    public success(val: any) {
        this.splitChange();
    }
    private Directions: any = [];
    private Services: any = [];
    private contractServiceArr: any;
    /* 数据更新触发 */
    public sourcesUpdata(values: any[]) {
        this.created();
        values.forEach((val: any) => {
            val.name.length &&
                val.name.forEach((item: any) => {
                    if (
                        !!item.decorator &&
                        item.decorator.indexOf("Service") > -1 &&
                        item.options.length !== this.ContractDetails.roundingRuleName.length
                    ) {
                        item.options = this.ContractDetails.roundingRuleName;
                    }
                });
        });
    }

    /* 表格输入框 校验成功触发 */
    public async checkAll(): Promise < any > {
        return new Promise(async (resolve: any, reject: any) => {
            let value = this.$refs.TableInput.getData()
            if (!value) return
            // console.log('VendorSource-第二个表格的数据', value)
            let arr: any = [];
            let dataParams: any[] = []
            let isGoNext: boolean = true
        })
    }
    public deactivated() {}
}
</script>

<style lang="scss">

</style>
