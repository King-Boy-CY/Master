<template>
<div class="Flat-code">
    <base-data :editArr="editArr" @select="onbaseSelect" :baseData="baseData" @baseForm="baseFormChange" :contractIndex="contractIndex" ref="baseData" />
    <rating-data ref="ratingData" :ratingData="ratingData" @input="onInput" @pickerChange="pickerChange" @select="onSelect" @changeFrom="changeFrom" />
    <!-- <rating-zone /> -->
    <rating-zoneadd structure="Interval" @Handledestination="Handledestination" :ratingzoneAdd="ratingzoneAdd" @onSelect="onTableSelect" @onInput="onInputZone" :zoneCopy="zoneCopy" @ratingZoneCopy="ratingZoneCopy" @delecopyIndex="delecopyIndex" @ratingAddzone="ratingAddzone" @successForm="SuccessForma" @TotalCommitmen="TotalCommitmena" ref="zoneAdd" />
</div>
</template>

<script lang="ts">
import Vue from 'vue'
import {
    Component,
    Prop
} from 'vue-property-decorator'
import {
    getDstinationList
} from '@/api/index'
import {
    State,
    Mutation
} from 'vuex-class'
import moment from 'moment'
import {
    deepClone,
    isArray
} from "@/assets/ts/index";
// 通用配置
import {
    refsConfig
} from '@/assets/ts/config.d'
// 当页静态数据
import {
    ratingzone
} from './paraMetricData'
// 当页静态数据 变量声明
// import {

// } from './parameter'
// 公有静态数据 
import {
    base,
    rating
} from '../../publicParameter/publicParameterData'
// 公有静态数据  变量声明
import {
    configuRation,
    Destinations,
    getAixosConfig
} from '../../publicParameter/publicConfig'

@Component({
    components: {
        baseData: () => import('../../Basedata.vue'),
        ratingData: () => import('../../Ratingdata.vue'),
        ratingZoneadd: () => import('../../ratingZoneadd.vue'),
    }
})
export default class interval extends Vue {
    @State('ratePlanObject') private ratePlanObject: any
    @State('productIndex') private productIndex ? : any
    @State('prossData') private prossData ? : any
    @Prop(Number) private productKey ? : number // product
    @Prop() private editData ? : any;
    @Prop() private contractIndex ? : number;
    @Prop() private editArr ? : any;
    @Mutation('mutionProduct') mutionProduct
    @State('closeModel') closeModel: any
    public $refs: refsConfig | any
    private CommitmentValue: string = ''; // 计费值
    private CommitmentUnit: string = ''; // 计费单元
    private index: number = 0; // 表格input添加下标
    private zonecopyIndex: number = 0; // Rating zone 复制下标
    private form: any
    private successForm: any
    private baseForm: any
    private productIn: number = 0
    private keepRating: any = {}
    private destinations: object[] = []
    private baseData: any[] = deepClone(base)
    /* Rating data */
    private ratingData: any[] = deepClone(rating)
    /* 表单 Rating zone  */
    private ratingzoneAdd: any[] = deepClone(ratingzone)
    /* 表单 Rating zone 复制数据来源 */
    private zoneCopy: any[] = []
    /* 合并长度和合并的字段 */
    public contactdata: any[] = []
    public baseFormChange(form: any) {
        this.baseForm = form
    }
    public pickerChange(picker: any, name: string) {
        let ratePlanArr = []
        if (this.contractIndex === 1) {
            ratePlanArr = this.getPlanData()
        } else {
            ratePlanArr = this.editArr
        }
        if (moment(picker).format('YYYY-MM-DD') < moment(ratePlanArr[this.productIndex]['commitmentBeginDate']).format('YYYY-MM-DD') && name === 'commitmentunitStartTime') {
            return this.$message.warning('承 诺 量 开 始 时 间 不 能 小 于 周 期 开 始 时 间');
        }
        if (moment(picker).format('YYYY-MM-DD') > moment(ratePlanArr[this.productIndex]['commitmentEndDate']).format('YYYY-MM-DD') && name === 'commitmentunitendtTime') {
            return this.$message.warning('承 诺 量 结 束 时 间 不 能 大 于 周 期 结 束 时 间');
        }
    }
    /* 表格移除 */
    public dele() {
        this.index--;
    }
    public created() {
        this.ratingData.splice(4, 1)
        /* 数据全局校验 */
        Vue.prototype.checkInterVal = (item: any) => {
            return this.checkInterVal(item)
        }
        // this.getDstination()
        // this.addData()
    }
    /* 复制 承诺量总值 */
    public TotalCommitmena(values ? : any) {
        let totalCount: number = 0
        for (let i = 0; i < values.length; ++i) {
            const VAL = values[i]
            let decorator = this.successForm.getFieldValue(VAL.CommitmentValue.decorator)
            if (!!decorator && decorator[0] === 'default') return
            if (!!decorator && decorator[0]) {
                totalCount += Number(this.successForm.getFieldValue(VAL.CommitmentValue.decorator))
            }
        }
        this.form.setFieldsValue({
            TotalCommitmentValue: totalCount === 0 ? undefined : totalCount
        })
    }
    /* 表单 Rating zone 复制数据来源 */
    public ratingZoneCopy() {
        this.zonecopyIndex++
        const ratingzoneCopy: any = [{
            CommitmentValue: {
                type: 'input',
                message: 'Commitment (Value) field should be no-null',
                initialValue: '',
                required: true,
                disabled: false,
                name: 'CommitmentValue',
                decorator: `CommitmentValue${this.zonecopyIndex}`
            },
            Destination: {
                type: 'input',
                message: 'Destination field should be no-null',
                initialValue: '',
                required: true,
                disabled: false,
                options: ['Mins2', 'Quarters2', 'Call2', 'User2'],
                name: 'Destination',
                decorator: `Destination${this.zonecopyIndex}`
            },
            timeBand: {
                type: 'textarea',
                message: 'Time band field should be no-null',
                initialValue: '',
                required: true,
                disabled: false,
                name: 'timeBand',
                decorator: `timeBand${this.zonecopyIndex}`
            },
            inputcolumns: {
                type: 'tableCloums',
                options: [{
                        title: 'No .',
                        dataIndex: 'No',
                        key: 'No'
                    },
                    {
                        title: 'Interval',
                        dataIndex: 'Interval',
                        require: false
                    },
                    {
                        title: 'Rate',
                        dataIndex: 'Rate',
                        initialValue: '',
                        require: true
                    },
                    {
                        title: 'Chargable unit type',
                        dataIndex: 'ChargableunitType',
                        initialValue: '',
                        require: true
                    }
                ]
            },
            inputdata: {
                type: 'tableCloums',
                options: [{
                    name: [{},
                        {
                            type: 'input',
                            decorator: `Interval${this.zonecopyIndex}`,
                            initialValue: '+∞'
                        },
                        {
                            type: 'input',
                            require: true,
                            initialValue: '',
                            decorator: `Rate${this.zonecopyIndex}`
                        },
                        {
                            type: 'select',
                            decorator: `ChargableunitType${this.zonecopyIndex}`,
                            initialValue: '',
                            require: true,
                            options: [{
                                    name: 'Secs',
                                    disabled: false
                                },
                                {
                                    name: 'Mins',
                                    disabled: false
                                },
                                {
                                    name: 'Quarters',
                                    disabled: false
                                },
                                {
                                    name: 'Call',
                                    disabled: false
                                },
                                {
                                    name: 'User',
                                    disabled: false
                                },
                            ]
                        }
                    ],
                    key: this.zonecopyIndex
                }]

            },
            key: this.zonecopyIndex
        }]
        this.zoneCopy = ratingzoneCopy;
    }
    /* 表单 Rating zone Addzone */
    public ratingAddzone() {
        let len: number = 0 // 费率个数（表格zone）
        let options: any[] = [] // 费率单元
        let isCommitmentValue: boolean = false // 承诺量是否为default
        let isCommitment: boolean = false // 承诺量是否需要禁用
        let isAdd: boolean = false // 是否允许插入timeband
        let isCommitmentRequired: boolean = false // 承诺量是否必填
        let successForm = this.successForm.getFieldsValue()
        this.ratingzoneAdd.forEach((res) => {
            let decorator = successForm[res.CommitmentValue.decorator]
            if (!!decorator && decorator[0] !== 'default' || !decorator) {
                isCommitmentValue = true
            }
            isAdd = res.timeBand.isAdd
            isCommitment = res.CommitmentValue.disabled
            isCommitmentRequired = res.CommitmentValue.required
            len += res.inputdata['options'].length
            options = res.inputdata['options'][0].name
            res.inputdata['options'][0].name.forEach((value: any) => {
                if (!!value.options) {
                    options = value.options
                }
            });
        })
        // let options =  this.ratingzoneAdd[0].inputdata.options[0].name[2].options
        this.zonecopyIndex++
        this.ratingzoneAdd.push({
            CommitmentValue: {
                type: 'input',
                message: 'Commitment (Value) field should be no-null',
                initialValue: isCommitmentValue ? [] : ['default'],
                required: isCommitmentRequired,
                disabled: isCommitment ? true : false,
                name: 'CommitmentValue',
                decorator: `CommitmentValue${new Date().getTime() + this.zonecopyIndex}`
            },
            Destination: {
                type: 'input',
                message: 'Destination field should be no-null',
                initialValue: [],
                required: true,
                disabled: false,
                options: this.ratingzoneAdd[0]['Destination']['options'],
                name: 'Destination',
                decorator: `Destination${new Date().getTime() + this.zonecopyIndex}`
            },
            timeBand: {
                type: 'textarea',
                message: 'Time band field should be no-null',
                initialValue: '',
                required: true,
                disabled: false,
                name: 'timeBand',
                decorator: `timeBand${new Date().getTime() + this.zonecopyIndex}`
            },
            inputcolumns: {
                type: 'tableCloums',
                options: [{
                        title: 'No .',
                        dataIndex: 'No',
                        key: 'No'
                    },
                    {
                        title: 'Interval',
                        dataIndex: 'Interval',
                        require: false
                    },
                    {
                        title: 'Rate',
                        dataIndex: 'Rate',
                        initialValue: '',
                        require: true
                    },
                    {
                        title: 'Chargable unit type',
                        dataIndex: 'ChargableunitType',
                        initialValue: '',
                        require: true
                    }
                ]
            },
            inputdata: {
                type: 'tableCloums',
                options: [{
                    name: [{},
                        {
                            type: 'input',
                            decorator: `Interval${new Date().getTime() + this.zonecopyIndex}`,
                            initialValue: '+∞'
                        },
                        {
                            type: 'input',
                            require: true,
                            initialValue: '',
                            decorator: `Rate${new Date().getTime() + this.zonecopyIndex}`
                        },
                        {
                            type: 'select',
                            decorator: `ChargableunitType${new Date().getTime() + this.zonecopyIndex}`,
                            initialValue: '',
                            require: true,
                            options
                        }
                    ],
                    key: this.zonecopyIndex
                }]

            },
            key: this.zonecopyIndex
        });
    }
    /**
     * 复制移除
     */
    public delecopyIndex(index: number, len: number) {
        this.Handledestination()
        let totalCount: number = 0
        let successForm = this.successForm.getFieldsValue()
        let TotalCommitmentValue = this.form.getFieldValue('TotalCommitmentValue')
        if (len === 1) {
            let decorator = this.successForm.getFieldValue(this.ratingzoneAdd[0].CommitmentValue.decorator) || undefined
            if (!decorator || decorator[0] === 'default') {
                this.ratingData[0].disabled = false
            } else {
                this.ratingData[0].disabled = true
            }
            return this.form.setFieldsValue({
                'TotalCommitmentValue': !decorator ? undefined : !!decorator && decorator[0] === 'default' ? TotalCommitmentValue : decorator[0]
            })
        }
        let ratingzoneLen = this.ratingzoneAdd.length
        while (ratingzoneLen--) {
            let ratingzonValue = this.ratingzoneAdd[ratingzoneLen]
            let decorator = successForm[ratingzonValue.CommitmentValue.decorator]
            if (decorator && decorator[0] === 'default' && !TotalCommitmentValue) {
                return this.form.setFieldsValue({
                    TotalCommitmentValue: undefined
                })
            }
            if (isArray(decorator)) {
                totalCount += Number(...decorator)
            }
        }
        this.form.setFieldsValue({
            TotalCommitmentValue: totalCount === 0 ? TotalCommitmentValue : totalCount
        })
    }
    /* onInput -> ratingData 输入触发 */
    public onInput(value: string, name: string) {
        this.CommitmentValue = value;
        const {
            timeBand,
            CommitmentValue,
            Destination
        }: any = this.ratingzoneAdd[0];
        if (!!value && name === 'TotalCommitmentValue') {
            CommitmentValue.required = false;
            this.ratingzoneAdd.forEach((elem: any) => {
                elem.CommitmentValue.disabled = true
                this.successForm.setFieldsValue({
                    [elem.CommitmentValue.decorator]: ['default']
                })
            });
        } else if (!value && name === 'TotalCommitmentValue') {
            CommitmentValue.required = true;
            this.ratingzoneAdd.forEach((elem: any) => {
                elem.CommitmentValue.disabled = false
                this.successForm.setFieldsValue({
                    [elem.CommitmentValue.decorator]: undefined
                })
            });
        }
    }
    /* add 的form表单 */
    public SuccessForma(form ? : any) {
        this.successForm = form;
    }
    /* Commitment(unit) 选中清除已经选中 */
    public setFieldsValue() {
        let arr: any = ''
        this.ratingzoneAdd.forEach(element => {
            // console.log(element.inputdata.options)
            element.inputdata.options.forEach((val: any) => {
                val.name.forEach((item: any) => {
                    if (!!item.decorator && item.decorator.indexOf('ChargableunitType') > -1) {
                        this.successForm.setFieldsValue({
                            [item.decorator]: undefined,
                        });
                    }
                });
            });
        });
        // console.log(arr)
    }
    public emptyUniType(values) {
        values.forEach(item => {
            item.inputdata.options.forEach(ops => {
                ops.name.forEach(itName => {
                    itName.options && itName.options.forEach((elem: any) => {
                        elem.disabled = false
                    })
                })
            })
        })
    }
    /* 初始 费率单元 */
    public commituniType(value ? : string | string[], key ? : number) {
        let CommitmentUnit: string[] = ['Secs', 'Mins', 'Quarters', 'Call', 'User']
        let ChargableunitType = this.ratingzoneAdd
        let successForm = this.successForm.getFieldsValue()
        let isCommitment = this.baseForm.getFieldValue('Commitment');
        if (key) {
            return this.ratingzoneAdd[key].inputdata.options.forEach((ops: any) => {
                ops.name.forEach((itName: any) => {
                    itName.options && itName.options.forEach((elem: any) => {
                        elem.name === 'Call' && (elem.disabled = true)
                        elem.name === 'User' && (elem.disabled = true)
                    });
                });
            })
        }
        if (!value && (isCommitment === 'No' || isCommitment === 2)) {
            return this.emptyUniType(ChargableunitType)
        }
        ChargableunitType.forEach((item: any, index: number) => {
            item.inputdata.options.forEach((ops: any) => {
                ops.name.forEach((itName: any) => {
                    itName.options && itName.options.forEach((elem: any) => {
                        if (!value) {
                            return elem.disabled = false;
                        }

                        if (typeof value === 'object') {
                            return value.forEach(element => {
                                if (element === elem.name) {
                                    elem.disabled = true;
                                }
                            });
                        }
                        let itUnit: any = successForm[itName.decorator]
                        let val = typeof itUnit === 'number' ? CommitmentUnit[itUnit - 1] : itUnit
                        if ((value === 'User' || value === 'Call') && elem.name === value) {
                            if (successForm[itName.decorator] && val !== value) {
                                this.successForm.setFieldsValue({
                                    [itName.decorator]: undefined
                                })
                            }
                            elem.disabled = false
                        } else if ((value !== 'User' && value !== 'Call') && elem.name !== 'User' && elem.name !== 'Call') {
                            if (successForm[itName.decorator] && val === 'Call' || val === 'User') {
                                this.successForm.setFieldsValue({
                                    [itName.decorator]: undefined
                                })
                            }
                            elem.disabled = false
                        } else {
                            elem.disabled = true
                        }
                    });
                });
            });
        });
    }
    /* onSelect -> ratingData 下拉触发 */
    public onSelect(value: string, form: any) {
        this.CommitmentUnit = value;
        this.commituniType(value)
        // this.setFieldsValue()
    }
    /* 调取子组件 统计承诺量 form */
    public changeFrom(form: any) {
        this.form = form
    }
    /* 表格下拉触发 */
    public onTableSelect(value: string, name: string, index: number) {
        if (!value) return
    }
    /* base data 下拉触发 */
    public onbaseSelect(value: any, name: string | number) {
        let rating = this.ratingData
        let ratePlanArr = []
        if (this.contractIndex === 1) {
            ratePlanArr = this.getPlanData()
        } else {
            ratePlanArr = this.editArr
        }
        /* 承诺量 */
        if (!name) return
        let totalCommitValue = this.form.getFieldValue && this.form.getFieldValue('TotalCommitmentValue') || undefined
        let CommitmentUnit = this.form.getFieldValue && this.form.getFieldValue('CommitmentUnit') || undefined

        let ratingAdd = this.ratingzoneAdd
        ratingAdd.forEach(element => {
            if (value === 'Commitment' && (name === 2 || name === 'No' || name === 0)) {
                element.CommitmentValue.disabled = true;
                element.CommitmentValue.required = false
                this.successForm.setFieldsValue && this.successForm.setFieldsValue({
                    [element.CommitmentValue.decorator]: undefined
                })
            } else if (value === 'Commitment' && (name === 1 || name === 'Yes') && !totalCommitValue) {
                element.CommitmentValue.disabled = false;
                element.CommitmentValue.required = true
            }
        });
        if (value === 'Commitment' && (name === 2 || name === 'No' || name === 0)) {
            this.ratingData.forEach((elem: any) => {
                elem.required = false
                elem.disabled = true;
                if (Object.keys(elem).length > 0) {
                    elem['options'] = this.ratingData[1]['options']
                    if (elem.Tips === 'IntervalunitType') {
                        elem.disabled = false;
                        elem.required = true
                        elem['options'] = rating[1]['options']
                    } else {
                        this.form.setFieldsValue && this.form.setFieldsValue({
                            [elem.Tips]: undefined
                        })
                    }
                }
            });
        }
        if (!!name && value === 'Commitment' && (name === 1 || name === 'Yes')) {
            this.form.setFieldsValue && this.form.setFieldsValue({
                [rating[2]['Tips']]: moment(ratePlanArr[this.productIn || 0]['commitmentBeginDate']) || undefined,
                [rating[3]['Tips']]: moment(ratePlanArr[this.productIn || 0]['commitmentEndDate']) || undefined
            })
            let value0 = this.successForm.getFieldValue && this.successForm.getFieldValue(ratingAdd[0]['CommitmentValue']['decorator'])
            this.ratingData.forEach((elem: any) => {
                elem.required = true
                elem.disabled = false;
                // this.form.setFieldsValue({
                //     [elem.Tips]: undefined
                // })
                if (Object.keys(elem).length > 0 && elem.Tips === 'IntervalunitType') {
                    elem.disabled = true;
                    elem['options'] = null;
                    !CommitmentUnit && this.form.setFieldsValue({
                        [elem.Tips]: undefined
                    })
                }
                if (value0 && value0[0] !== 'default' && elem.Tips === 'TotalCommitmentValue') {
                    elem.disabled = true;
                }
            });
        }
        if (!this.form.getFieldValue('CommitmentUnit') && typeof name === "number") {
            this.commituniType()
            this.form.setFieldsValue && this.form.setFieldsValue({
                'IntervalunitType': undefined
            })
        }
    }
    /* rating zone 输入触发 */
    public onInputZone(value: any, name: string) {
        let successForm = this.successForm.getFieldsValue()
        if (value === 'default') {
            this.ratingzoneAdd.forEach((res: any) => {
                this.successForm.setFieldsValue({
                    [res.CommitmentValue.decorator]: ['default']
                })
            })
            this.form.setFieldsValue({
                'TotalCommitmentValue': undefined
            })
            this.ratingData.forEach((res) => {
                if (res.Tips === 'TotalCommitmentValue') {
                    res.disabled = false
                }
            })
            return false
        } else {
            this.ratingzoneAdd.forEach((res: any) => {
                if (!value && !!successForm[res.CommitmentValue.decorator] && successForm[res.CommitmentValue.decorator][0] === 'default') {
                    this.successForm.setFieldsValue({
                        [res.CommitmentValue.decorator]: undefined
                    })
                }
            })
        }
        let ref: any = this.$refs.ratingData;
        let getCount = 0
        ref.checkForm()
        const ratingData: any = this.ratingData
        let ratingAdd = this.ratingzoneAdd
        if (value) {
            let count = 0
            for (let i = 0; i < ratingAdd.length; ++i) {
                const elem = ratingAdd[i];
                let decorator = successForm[elem.CommitmentValue.decorator]
                elem.CommitmentValue.disabled = false
                if (!!decorator && decorator[0] === 'default') {
                    this.successForm.setFieldsValue({
                        [elem.CommitmentValue.decorator]: undefined
                    })
                }
                getCount += Number(decorator ? decorator[0] || decorator : 0)
            }
            count += getCount ? Number(getCount) + Number(value) : Number(value)
            ratingData.forEach((elem: any) => {
                if (elem.Tips === 'TotalCommitmentValue' && !!value) {
                    elem.disabled = true
                }
            })
            this.form.setFieldsValue({
                TotalCommitmentValue: count
            });
        } else {
            let count = 0
            for (let i = 0; i < ratingAdd.length; ++i) {
                const elem = ratingAdd[i];
                let decorator = successForm[elem.CommitmentValue.decorator]
                if (!!decorator && decorator[0] === 'default') {
                    this.successForm.setFieldsValue({
                        [elem.CommitmentValue.decorator]: undefined
                    })
                }
                if (name !== elem.CommitmentValue.decorator && decorator[0]) {
                    count += Number(decorator[0] || 0)
                }
                this.form.setFieldsValue({
                    TotalCommitmentValue: count === 0 || Number.isNaN(count) ? undefined : count
                });
            }
            if (count === 0 || Number.isNaN(count)) {
                ratingData.forEach((elem: any) => {
                    if (elem.Tips === 'TotalCommitmentValue') {
                        elem.disabled = false
                    }
                })
            }
        }
    }
    public commitment(value: number | string) {
        let name: any = undefined
        if (value === 0) {
            name = 'No'
        } else if (value === 1) {
            name = 'Yes'
        }
        return name
    }

    public reCommitment(value: number | string) {
        let name: any = undefined
        if (value === 'No' || value === 2) {
            name = 0
        } else if (value === 'Yes' || value === 1) {
            name = 1
        }
        return name
    }
    public setBaseData(productData) {
        this.$nextTick(() => {
            this.baseData[0].initialValue = this.commitment(productData.isCommitment)
            this.baseData[1].initialValue = this.commitment(productData.isGracePeriod)
            this.baseData[2].initialValue = productData.isCommitment !== 0 && productData.isGracePeriod !== 0 && ['Next period'] || undefined // productData.gracePeriodCycle,
            this.baseData[3].initialValue = this.commitment(productData.isAnyShortfall)
            this.baseData[4].initialValue = productData.trafficFromValue
            this.baseData[5].initialValue = productData.trafficFromPercentage
            this.baseData[6].initialValue = this.commitment(productData.isTrafficForward)
            this.baseData[7].initialValue = productData.isCommitment !== 0 && productData.isTrafficForward !== 0 && ['Next period'] || undefined //productData.trafficPeriodCycle,
            this.baseData[8].initialValue = this.commitment(productData.isAnyExceed)
            this.baseData[9].initialValue = productData.trafficForwardValue
            this.baseData[10].initialValue = productData.trafficForwardPercentage
            this.$nextTick(() => {
                this.baseForm.setFieldsValue({
                    [this.baseData[0].Tips]: this.commitment(productData.isCommitment),
                    [this.baseData[1].Tips]: this.commitment(productData.isGracePeriod),
                    [this.baseData[2].Tips]: productData.isCommitment !== 0 && productData.isGracePeriod !== 0 && ['Next period'] || undefined, // productData.gracePeriodCycle,
                    [this.baseData[3].Tips]: this.commitment(productData.isAnyShortfall),
                    [this.baseData[4].Tips]: productData.trafficFromValue,
                    [this.baseData[5].Tips]: productData.trafficFromPercentage,
                    [this.baseData[6].Tips]: this.commitment(productData.isTrafficForward),
                    [this.baseData[7].Tips]: productData.isCommitment !== 0 && productData.isTrafficForward !== 0 && ['Next period'] || undefined, //productData.trafficPeriodCycle,
                    [this.baseData[8].Tips]: this.commitment(productData.isAnyExceed),
                    [this.baseData[9].Tips]: productData.trafficForwardValue,
                    [this.baseData[10].Tips]: productData.trafficForwardPercentage
                })
            })
            setTimeout(() => {
                this.$refs['baseData'].processingData && this.$refs['baseData'].processingData()
            }, 200);
        })
    }
    public setRatingData(productData, ratePlanArr, CommitmentUnit) {
        this.$nextTick(() => {
            this.form.setFieldsValue({
                [this.ratingData[0].Tips]: productData.totalCommitment,
                [this.ratingData[1].Tips]: CommitmentUnit[productData.commitmentUnit - 1],
                [this.ratingData[2].Tips]: moment(ratePlanArr[this.productIndex || 0]['commitmentBeginDate']),
                [this.ratingData[3].Tips]: moment(ratePlanArr[this.productIndex || 0]['commitmentEndDate']),
                [this.ratingData[4].Tips]: !productData.intervalUnit && CommitmentUnit[productData.intervalUnit - 1] || CommitmentUnit[productData.commitmentUnit - 1]
            })
            if (!!productData.totalCommitment) {
                this.ratingData.forEach((res) => {
                    res.disabled = false
                    res.required = true
                    if (res.Tips === 'TotalCommitmentValue' && productData.ratingZoneList[0]['commitmentValue'] !== -1) {
                        res.disabled = true
                    }
                })
            } else if (productData.isCommitment === 0 || productData.isCommitment === 'No') {
                this.ratingData.forEach((res) => {
                    if (res.Tips !== 'IntervalunitType') {
                        res.disabled = true
                        res.required = false
                        this.form.setFieldsValue({
                            [res.Tips]: undefined
                        })
                    } else {
                        res.disabled = false
                        this.form.setFieldsValue({
                            'IntervalunitType': CommitmentUnit[productData.intervalUnit - 1] || undefined
                        })
                    }
                })
            }
        })
        this.ratingData[2].initialValue = moment(ratePlanArr[this.productIndex || 0]['commitmentBeginDate'])
        this.ratingData[3].initialValue = moment(ratePlanArr[this.productIndex || 0]['commitmentEndDate'])
        this.ratingData[4].initialValue = !productData.intervalUnit && CommitmentUnit[productData.intervalUnit - 1] || CommitmentUnit[productData.commitmentUnit - 1]
    }
    public setZone(productData, CommitmentUnit) {
        if (!!productData && productData.ratingZoneList.length >= 1) {
            setTimeout(() => {
                let formDataObj: any = {}
                productData.ratingZoneList.forEach((elem: any, index: number) => {
                    this.zonecopyIndex++
                    let inputOptions: any = deepClone(this.ratingzoneAdd[index]['inputdata']['options'][0])
                    if (productData.isCommitment === 0 || productData.isCommitment === 'No' || (productData.totalCommitment && elem['commitmentValue'] === -1)) {
                        this.ratingzoneAdd[index].CommitmentValue.disabled = true
                        this.ratingzoneAdd[index].CommitmentValue.required = false
                    } else {
                        this.ratingzoneAdd[index].CommitmentValue.disabled = false
                        this.ratingzoneAdd[index].CommitmentValue.required = true
                    }
                    let len = elem.ratingDetailList.length
                    const deepCloneInputOptions: any = deepClone(this.ratingzoneAdd[index]['inputdata']['options'][0])
                    this.$set(this.ratingzoneAdd[index]['inputdata'], 'options', [])

                    for (let i = 0; i < len; i++) {
                        let inputOptions: any = deepClone(deepCloneInputOptions)
                        if (this.ratingzoneAdd[index].inputdata.options.length !== elem.ratingDetailList.length) {
                            ++this.zonecopyIndex
                            inputOptions.key = '2options' + new Date().getTime() + this.zonecopyIndex
                            inputOptions.name.forEach((element: any, nameIndex: number) => {
                                let value = Object.keys(element).length > 1 && element
                                let decorator = !!value['decorator'] && value['decorator']
                                let cloums = this.ratingzoneAdd[index].inputcolumns['options'][nameIndex]
                                if (!!cloums && Object.keys(element).length > 1) {
                                    element.decorator = cloums['dataIndex'] + new Date().getTime() + this.zonecopyIndex
                                }
                            });
                            this.ratingzoneAdd[index].inputdata['key'] = 'inputdataKey' + new Date().getTime() + this.zonecopyIndex
                            this.ratingzoneAdd[index].inputdata.options.push(inputOptions)
                        }
                    }
                    const commitValue: any = elem['commitmentValue'] == -1 ? ['default'] : elem['commitmentValue'] > -1 ? [elem['commitmentValue']] : undefined
                    this.ratingzoneAdd[index]['CommitmentValue']['initialValue'] = commitValue
                    formDataObj[this.ratingzoneAdd[index]['CommitmentValue'].decorator] = commitValue
                    this.ratingzoneAdd[index]['Destination']['initialValue'] = elem['destinationList'] && elem['destinationList'].split(',') || []
                    elem.ratingDetailList.forEach((detai: any, key: number) => {
                        this.ratingzoneAdd[index]['inputdata']['options'][key]['name'].forEach((elem: any) => {
                            if (!!elem.decorator) {
                                if (elem.decorator.indexOf('Interval') > -1) {
                                    elem.model = detai.intervalThreshold
                                    formDataObj[elem.decorator] = detai.intervalThreshold
                                } else if (elem.decorator.indexOf('Rate') > -1) {
                                    elem.model = detai.rate + ''
                                    formDataObj[elem.decorator] = detai.rate + ''
                                } else if (elem.decorator.indexOf('ChargableunitType') > -1) {
                                    elem.model = detai.chargeUnit ? CommitmentUnit[detai.chargeUnit - 1] : undefined
                                    formDataObj[elem.decorator] = detai.chargeUnit ? CommitmentUnit[detai.chargeUnit - 1] : undefined
                                }
                            }
                        });
                    })
                });
                this.successForm.setFieldsValue(formDataObj)
                this.Handledestination()
            }, 300);
            return false
        }
    }
    public updateZone(ratiLen) {
        if (this.ratingzoneAdd.length !== ratiLen) {
            let newZone: any = []
            for (let index = 0; index < ratiLen; index++) {
                // if (this.ratingzoneAdd.length < ratiLen) {
                this.zonecopyIndex++
                let addZone = deepClone(this.ratingzoneAdd[0])
                addZone['CommitmentValue']['decorator'] = 'CommitmentValue' + this.zonecopyIndex
                addZone['Destination']['decorator'] = 'Destination' + this.zonecopyIndex
                addZone['key'] = '' + new Date().getTime() + this.zonecopyIndex
                addZone['inputdata']['key'] = '' + new Date().getTime() + this.zonecopyIndex
                addZone['inputdata']['options'][0].key = 'options' + new Date().getTime() + this.zonecopyIndex
                addZone['inputdata']['options'][0].name.forEach((item: any) => {
                    if (item.decorator) {
                        const match = item.decorator.match(/[a-zA-Z]+/)
                        if (match) {
                            item.decorator = match[0] + new Date().getTime() + this.zonecopyIndex
                        }
                    }
                })
                newZone.push(addZone)
                // this.ratingzoneAdd.push(addZone)
            }
            this.ratingzoneAdd = []
            this.ratingzoneAdd.push(...newZone)
        }
    }
    /* 复制 插入 触发事件  */
    public assignmentData(productData: any, err ? : string) {
        console.log('productData', productData);
        let CommitmentUnit = ['Secs', 'Mins', 'Quarters', 'Call', 'User']
        let ratePlanArr = []
        if (this.contractIndex === 1) {
            ratePlanArr = this.getPlanData()
        } else {
            ratePlanArr = this.editArr
        }
        this.setBaseData(productData)

        this.setRatingData(productData, ratePlanArr, CommitmentUnit)

        this.commituniType(CommitmentUnit[productData.commitmentUnit - 1] || CommitmentUnit[productData.intervalUnit - 1])

        this.updateZone(productData.ratingZoneList.length)

        this.setZone(productData, CommitmentUnit)
    }
    /* plan配置 默认 Rating data 开始结束时间 */
    public planRatingData() {
        let ratePlanArr = []
        if (this.contractIndex === 1) {
            ratePlanArr = this.getPlanData()
        } else {
            ratePlanArr = this.editArr
        }
        let productData: any
        let planArr: {
            typeName: string,
            productKey: number,
            productData: object
        } = ratePlanArr[this.productIn]
        if (!this.prossData[planArr.typeName + planArr.productKey]) {
            productData = planArr.productData
        } else {
            return false
        }
        let CommitmentUnit = ['Secs', 'Mins', 'Quarters', 'Call', 'User']

        this.setBaseData(productData)

        this.setRatingData(productData, ratePlanArr, CommitmentUnit)

        this.commituniType(CommitmentUnit[productData.commitmentUnit - 1] || CommitmentUnit[productData.intervalUnit - 1])

        this.updateZone(productData.ratingZoneList.length)

        this.setZone(productData, CommitmentUnit)
    }
    /* 处理费率区 */
    public Handledestination(values ? : string[]) {
        // console.log('values', values);
        // if (!values) return
        setTimeout(() => {
            // zone 的所有数据
            const zoneAdd: any = this.$refs.zoneAdd
            const formData: any = zoneAdd.getFieldsValue()
            // const formData: any = this.successForm.getFieldsValue()
            let ratingdata = deepClone(this.ratingzoneAdd)
            // console.log('formData',formData);
            const destinationsOptions = this.destinations.map((destinationsOptionsItem: any) => {
                let newObj: any = {
                    name: destinationsOptionsItem.name,
                    disabled: false
                }
                ratingdata.forEach((optionsItem: any, optionsIndex: number) => {
                    const item = formData[optionsItem.Destination.decorator] || []
                    if (item.includes(destinationsOptionsItem.name)) {
                        newObj.disabled = true
                    }
                })
                return newObj
            })
            this.ratingzoneAdd.forEach((optionsItem: any, optionsIndex: number) => {
                // optionsItem.Destination.options = destinationsOptions
                this.$set(optionsItem.Destination, 'options', destinationsOptions)
            })
            // console.log('this.ratingzoneAdd',this.ratingzoneAdd);
        }, 250)
    }
    /* 获取plan 数据 */
    public activated() {
        Vue.prototype.getInterval = () => {
            console.log('interval')
            this.fieldProcessing()
        }
        this.productIn = this.productIndex
        setTimeout(() => {
            this.getDstination()
        }, 200);
        // 因为子组件异步的问题，需要定时刷新检测，有值才调用初始值
        let timeCle = setInterval(() => {
            if (this.successForm) {
                clearInterval(timeCle)
                this.planRatingData()
            }
        }, 100)
    }

    public getDstination() {
        let arr: any[] = []
        if (this.contractIndex === 1) {
            arr = this.getPlanData()
        } else {
            arr = this.editArr
        }
        if (arr[this.productIndex]) {
            let data: getAixosConfig = {
                params: {
                    productName: arr[this.productIndex]['typeName'].replace(/[\r\n\ +]/g, ""),
                    beginDate: moment(arr[this.productIndex]['commitmentBeginDate']).format('YYYY-MM-DD'),
                    endDate: moment(arr[this.productIndex]['commitmentEndDate']).format('YYYY-MM-DD')
                }
            }
            getDstinationList(data).then((res: Destinations) => {
                let data: Destinations['data'] = res.data || []
                this.destinations = data.map((item: Destinations['destinationValue']) => {
                    return {
                        name: item,
                        disabled: false
                    }
                })
                for (let i = 0; i < this.ratingzoneAdd.length; i++) {
                    const element = this.ratingzoneAdd[i];
                    element['Destination']['options'] = this.destinations
                }
            })
        }
    }

    public deactivated() {
         if(this.closeModel == 'contract') return
        this.fieldProcessing()
    }

    public fieldProcessing() {
        let ratePlanArr: any[] = []
        if (this.contractIndex === 1) {
            ratePlanArr = this.getPlanData()
        } else {
            ratePlanArr = this.editArr
        }

        if (!ratePlanArr.length) {
            return
        }
        let baseForm = this.baseForm.getFieldsValue()
        let ratingForm = this.form.getFieldsValue()
        let productObj: any = {}
        console.log('typeName', ratePlanArr[this.productIn]['typeName'])
        if (!this.prossData[ratePlanArr[this.productIn]['typeName'] + this.productKey]) {
            productObj = {
                productData: {}
            }
        } else {
            productObj = deepClone(this.prossData[ratePlanArr[this.productIn]['typeName'] + this.productKey])
        }

        // 增加
        productObj.productData.productName = ratePlanArr[this.productIn].typeName
        productObj.productData.direction = ratePlanArr[this.productIn].direction
        const Ratestructre: string[] = ['Flat', 'Tier', 'Interval', 'RecurringCharge', 'OneTimeCharge', 'Penalty', 'Cap', 'DisCount'];
        productObj.productData.rateStructure = Ratestructre.indexOf(ratePlanArr[this.productIn].RateStructure) + 1 || undefined

        /* 基本信息 */
        const baseDataColumn = this.baseData
        productObj.productData.isCommitment = this.reCommitment(baseForm[baseDataColumn[0].Tips])
        productObj.productData.isGracePeriod = this.reCommitment(baseForm[baseDataColumn[1].Tips])
        productObj.productData.gracePeriodCycle = baseForm[baseDataColumn[2].Tips] ? baseForm[baseDataColumn[2].Tips][0] : undefined
        productObj.productData.isAnyShortfall = this.reCommitment(baseForm[baseDataColumn[3].Tips])
        productObj.productData.trafficFromValue = baseForm[baseDataColumn[4].Tips] ? +baseForm[baseDataColumn[4].Tips] : undefined
        productObj.productData.trafficFromPercentage = baseForm[baseDataColumn[5].Tips] ? +baseForm[baseDataColumn[5].Tips] : undefined
        productObj.productData.isTrafficForward = this.reCommitment(baseForm[baseDataColumn[6].Tips])
        productObj.productData.trafficPeriodCycle = baseForm[baseDataColumn[7].Tips] ? baseForm[baseDataColumn[7].Tips][0] : undefined
        productObj.productData.isAnyExceed = this.reCommitment(baseForm[baseDataColumn[8].Tips])
        productObj.productData.trafficForwardValue = baseForm[baseDataColumn[9].Tips] ? +baseForm[baseDataColumn[9].Tips] : undefined
        productObj.productData.trafficForwardPercentage = baseForm[baseDataColumn[10].Tips] ? +baseForm[baseDataColumn[10].Tips] : undefined

        /* 复杂信息 */
        const ratingDataColumn = this.ratingData
        let CommitmentUnit: string[] = ['Secs', 'Mins', 'Quarters', 'Call', 'User']
        const findIndex = CommitmentUnit.findIndex((item: any) => item === ratingForm[ratingDataColumn[1].Tips])
        productObj.productData.commitmentBeginDate = ratingForm[ratingDataColumn[2].Tips] && moment(ratingForm[ratingDataColumn[2].Tips]).format('YYYY-MM-DD') || undefined
        productObj.productData.commitmentEndDate = ratingForm[ratingDataColumn[3].Tips] && moment(ratingForm[ratingDataColumn[3].Tips]).format('YYYY-MM-DD') || undefined
        productObj.productData.commitmentUnit = findIndex > -1 ? findIndex + 1 : ratingForm[ratingDataColumn[1].Tips]
        productObj.productData.totalCommitment = ratingForm[ratingDataColumn[0].Tips] ? +ratingForm[ratingDataColumn[0].Tips] : undefined
        productObj.productData.intervalUnit = CommitmentUnit.indexOf(ratingForm[ratingDataColumn[4].Tips]) + 1 || undefined
        console.log('ratingForm', ratingForm);

        /* ratingZone 数据 */
        productObj.productData.ratingZoneList = this.processProductData(this.ratingzoneAdd) || []
        let planArr = ratePlanArr[this.productIn]
        this.prossData[planArr['typeName'] + this.productKey] = deepClone(productObj)
        if (this.contractIndex === 2) {
            planArr.productData = productObj.productData
        }
        console.log('planArr', planArr);
        this.mutionProduct(ratePlanArr)
        console.log('数据保存--productObj', productObj)
        console.log('数据保存--prossData', this.prossData)
    }
    public processProductData(ratingzoneAdd: any) {
        const successFormData = this.successForm.getFieldsValue()
        console.log('successFormData', successFormData)
        const unit: any[] = ['Secs', 'Mins', 'Quarters', 'Call', 'User']
        let zoneAddData: any[] = []
        ratingzoneAdd && ratingzoneAdd.forEach((item: any, index: number) => {
            let commitValue = successFormData[item.CommitmentValue.decorator]
            let obj: any = {
                commitmentValue: !commitValue ? undefined : !!commitValue && commitValue[0] === 'default' ? -1 : commitValue[0],
                destinationList: successFormData[item.Destination.decorator] && successFormData[item.Destination.decorator].join(',') || undefined,
                ratingDetailList: [],
                timeBandDetailList: !item.timeBand.timeBandDetailList ? [] : item.timeBand.timeBandDetailList.map((timeBandDetailItem: any) => {
                    let type = timeBandDetailItem.type
                    if (timeBandDetailItem.type.indexOf('Offpeak') > -1) {
                        type = 2
                    } else if (timeBandDetailItem.type.indexOf('peak') > -1) {
                        type = 1
                    }
                    return Object.assign({}, timeBandDetailItem, {
                        type
                    })
                }),
                zoneNumber: index + 1
            }
            item.inputdata.options.forEach((optionsItem: any, optionsIndex: number) => {
                let listItem: any = {
                    chargeUnit: undefined,
                    rate: undefined,
                    intervalThreshold: undefined,
                }
                optionsItem.name.forEach((innerItem: any, index: number) => {
                    if (innerItem.decorator) {
                        const match = innerItem.decorator.match(/[A-Za-z]+/)
                        let value = successFormData[innerItem.decorator]
                        if (match) {
                            switch (match[0].toLowerCase()) {
                                case 'chargableunittype':
                                    listItem.chargeUnit = value && unit.indexOf(value) + 1 || undefined
                                    break;
                                case 'rate':
                                    listItem.rate = !Number.isNaN(+value) ? +value : undefined
                                    break;
                                case 'interval':
                                    //  === '+∞' ? null :
                                    listItem.intervalThreshold = value !== '+∞' && +value || value === '+∞' && value || value
                                    break;
                            }
                        }
                    }
                })
                obj.ratingDetailList.push(listItem)
            })
            zoneAddData.push(obj)
        })
        return zoneAddData
    }
    // 读取plan tabs
    public getPlanData(assignmentData ? : any) {
        let ratePlanArr: any = []
        for (let i = 0; i < this.ratePlanObject.length; i++) {
            const element = this.ratePlanObject[i];
            if (!!assignmentData && Object.keys(assignmentData).length > 1) {
                element.tabs[this.productIn]['productData'] = assignmentData || {}
            }
            for (let index = 0; index < element.tabs.length; index++) {
                ratePlanArr.push(element.tabs[index])
            }
        }
        return ratePlanArr
    }
    public checkErrorTips(title: string, content: string) {
        return this.$error({
            title,
            content
        });
    }
    public checkbaseData(form: any, item: any) {
        let isCheckStatus: boolean = true
        let baseForm = form.getFieldsValue()

        if (item.isCommitment === 0) return true
        form.validateFields((err: any, value: any) => {
            if (err) {
                //  this.$message.error('ratinZone -- 补充必填项')
            }
        })
        if (item.isGracePeriod === undefined) {
            this.checkErrorTips(`${item.productName}`, 'Grace period field should be no-null')
            isCheckStatus = false
            return false
        }
        if (item.isGracePeriod === 1) {
            if (!item.gracePeriodCycle) {
                this.checkErrorTips(`${item.productName}`, 'Grace period cycle field should be no-null')
                isCheckStatus = false
                return false
            }
            if (item.isAnyShortfall === undefined) {
                this.checkErrorTips(`${item.productName}`, 'Any shortfall field should be no-null')
                return false
            }
            if (item.isAnyShortfall === 0) {
                if (!item.trafficFromValue && !item['trafficFromPercentage']) {
                    this.checkErrorTips(`${item.productName}`, '(Traffic from (Value) or Traffic from (%)) field should be no-null')
                    isCheckStatus = false
                    return false
                }
            }
            isCheckStatus = true
        }
        if (item.isTrafficForward === undefined) {
            this.checkErrorTips(`${item.productName}`, 'Traffic forward to field should be no-null')
            isCheckStatus = false
            return false
        }
        if (item.isTrafficForward === 1) {
            if (!item.trafficPeriodCycle) {
                this.checkErrorTips(`${item.productName}`, 'Forward period cycle field should be no-null')
                isCheckStatus = false
                return false
            }
            if (item.isAnyExceed === undefined) {
                this.checkErrorTips(`${item.productName}`, 'Any exceed field should be no-null')
                return false
            }
            if (item.isAnyExceed === 0) {
                if (!item.trafficForwardValue && !item['trafficForwardPercentage']) {
                    this.checkErrorTips(`${item.productName}`, '(Traffic forward to (Value) or Traffic forward to (%) ) field should be no-null')
                    isCheckStatus = false
                    return false
                }
                isCheckStatus = true
            }
            isCheckStatus = true
        }

        return isCheckStatus
    }
    public checkRatinData(form: any, baseForm: any, item: any) {
        let ratinForm = form.getFieldsValue()
        let isCheckStatus: boolean = true
        let {
            Commitment
        } = baseForm.getFieldsValue()
        form.validateFields((err: any, value: any) => {
            if (err) {
                //  this.$message.error('ratinZone -- 补充必填项')
            }
        })
        if (!item.intervalUnit && item.isCommitment === 0) {
            this.checkErrorTips(`${item.productName}`, 'Interval unit type field should be no-null')
            isCheckStatus = false
            return false
        }
        if (item.isCommitment === 0) return true
        if (!item.totalCommitment) {
            this.checkErrorTips(`${item.productName}`, 'Total Commitment(value) field should be no-null')
            isCheckStatus = false
            return false
        }
        isCheckStatus = true
        if (!item.commitmentUnit) {
            this.checkErrorTips(`${item.productName}`, 'Commitment (unit) field should be no-null')
            isCheckStatus = false
            return false
        }
        isCheckStatus = true
        if (!item.commitmentBeginDate) {
            this.checkErrorTips(`${item.productName}`, 'Commitment start time field should be no-null')
            isCheckStatus = false
            return false
        }
        isCheckStatus = true
        if (!item.commitmentEndDate) {
            this.checkErrorTips(`${item.productName}`, 'Commitment End Time field should be no-null')
            isCheckStatus = false
            return false
        }
        isCheckStatus = true
        let ratePlanArr = []
        if (this.contractIndex === 1) {
            ratePlanArr = this.getPlanData()
        } else {
            ratePlanArr = this.editArr
        }
        // 去掉小时的差异
        // let beg = moment(moment(ratePlanArr[this.productIndex]['commitmentBeginDate']).format('YYYY-MM-DD'))
        // let end = moment(moment(ratePlanArr[this.productIndex]['commitmentEndDate']).format('YYYY-MM-DD'))
        // 匹配多个同结构校验时间而不与本次冲突
        let beg, end
        for (let index = 0; index < ratePlanArr.length; index++) {
            const element: {
                typeName: string
            } = ratePlanArr[index];
            if (element.typeName === item.productName) {
                beg = moment(element['commitmentBeginDate']).endOf('d').format('YYYY-MM-DD')
                end = moment(element['commitmentEndDate']).endOf('d').format('YYYY-MM-DD')
            }
        }
        let ratinFormStart = moment(moment(item.commitmentBeginDate).format('YYYY-MM-DD'))
        let ratinFormEnd = moment(moment(item.commitmentEndDate).format('YYYY-MM-DD'))
        if (ratinFormEnd && end && ratinFormEnd.valueOf() > end.valueOf()) {
            this.checkErrorTips(`${item.productName}`, 'End time of commitment should not be greater than end time of cycle')
            isCheckStatus = false
            return false
        }
        isCheckStatus = true
        if (ratinFormStart && beg && ratinFormStart.valueOf() < beg.valueOf()) {
            this.checkErrorTips(`${item.productName}`, 'Commitment quantity start time should not be less than cycle start time')
            isCheckStatus = false
            return false
        }
        return isCheckStatus
    }

    public checkRatinZone(form: any, baseForm: any, item: any) {
        let ratinZone = form.getFieldsValue()
        let isCheckStatus: boolean = true
        let {
            Commitment
        } = baseForm.getFieldsValue()
        form.validateFields((err: any, value: any) => {
            if (err) {
                //  this.$message.error('ratinZone -- 补充必填项')
            }
        })
        let ratingAdd = this.ratingzoneAdd
        form.validateFields((err: any, value: any) => {
            if (err) {
                //  this.$message.error('ratinZone -- 补充必填项')
            }
        })
        let isDestination: boolean[] = [] // 记录费率区第几个没填入数据
        let isCommitmentValue: boolean[] = [] // 记录承诺量第几个没填入数据
        let isRate: boolean[] = [] // 记录费率值第几个没填入数据
        let rateStr: any[] = []
        let isChargableunitType: boolean[] = [] // 记录计费单位第几个
        let isInterVal: string[] = [] // 记录区间值
        let arr = []
        if (this.contractIndex === 1) {
            arr = this.getPlanData()
        } else {
            arr = this.editArr
        }
        if (arr[this.productIndex] &&  arr[this.productIndex]['typeName'] !== item.productName) {
            for (let i = 0; i < item.ratingZoneList.length; i++) {
                const element = item.ratingZoneList[i];
                if (!element.commitmentValue && item.isCommitment === 1) {
                    this.checkErrorTips(`${item.productName}`, `Zone${i+1} -- 'CommitmentValue' field should be no-null`)
                    isCheckStatus = false
                    break
                }
                if (!element.destinationList) {
                    this.checkErrorTips(`${item.productName}`, `Zone${i+1} -- 'Destination' field should be no-null`)
                    isCheckStatus = false
                    break
                }
                for (let j = 0; j < element.ratingDetailList.length; j++) {
                    const elem = element.ratingDetailList[j];
                    isInterVal[j] = ''
                    if (elem.decorator && elem.decorator.indexOf('Interval') > -1 && ratinZone[elem.decorator]) {
                        isInterVal[j] = ratinZone[elem.decorator]
                    }
                    // if ((!isInterVal[j] || isInterVal[j] === '+∞')) {
                    //     // || Number(isInterVal[j]) 或者不为数字类型
                    //     this.checkErrorTips(`${item.productName}`, `第${i+1}个ratingZone 非最后一行Interval中存在空数据或者'+∞'`)
                    //     isCheckStatus = false
                    //     break
                    // }
                    if (isInterVal.length >= 2 && isInterVal[j - 1] && isInterVal[j]) {
                        if (isInterVal[j - 1] === '+∞' && isInterVal[j] !== '+∞') {
                            this.checkErrorTips(`${item.productName}`, `Zone${i+1} Interval Not less than ${j}row -- Interval  '+∞'`)
                            isCheckStatus = false
                            break
                        }
                        if (+isInterVal[j - 1] >= +isInterVal[j]) {
                            this.checkErrorTips(`${item.productName}`, `Zone${i+1} Interval Needs greater than ${j+1}row -- Interval`)
                            isCheckStatus = false
                            break
                        }
                    }
                    if (!(elem.rate + '')) {
                        this.checkErrorTips(`${item.productName}`, `Zone${i+1} 'Rate' -- field should be no-null `)
                        isCheckStatus = false
                        break
                    }
                    if (Number.isNaN(+elem.rate)) {
                        this.checkErrorTips(`${item.productName}`, `Zone${i+1} 'Rate' -- field should be Number`)
                        isCheckStatus = false
                        break
                    }
                    if (!elem.chargeUnit) {
                        this.checkErrorTips(`${item.productName}`, `Zone${i+1} 'Chargable unit type' -- field should be no-null`)
                        isCheckStatus = false
                        break
                    }
                }
            }
            return isCheckStatus
        } else {
            for (let i = 0; i < ratingAdd.length; i++) {
                const element = ratingAdd[i];
                isDestination[i] = false
                isCommitmentValue[i] = false
                isChargableunitType[i] = false
                if (ratinZone[element.Destination.decorator] && ratinZone[element.Destination.decorator][0]) {
                    isDestination[i] = true
                }
                if (typeof ratinZone[element.CommitmentValue.decorator] === 'object') {
                    isCommitmentValue[i] = true
                }
                if (!isDestination[i]) {
                    this.checkErrorTips(`${item.productName}`, `Zone${i+1} -- 'Destination' field should be no-null`)
                    isCheckStatus = false
                    break
                }
                if (!isCommitmentValue[i] && element.CommitmentValue.required === true) {
                    this.checkErrorTips(`${item.productName}`, `Zone${i+1} -- 'CommitmentValue' field should be no-null`)
                    isCheckStatus = false
                    break
                }
                let options = element.inputdata.options
                for (let k = 0; k < options.length; k++) {
                    const nameOptions = options[k].name;
                    isInterVal[k] = ''
                    for (let j = 0; j < nameOptions.length; j++) {
                        isRate[j] = false
                        rateStr[j] = ''
                        const elem = nameOptions[j];
                        if (Object.keys(elem).length < 3) {
                            continue
                        }
                        if (elem.decorator && elem.decorator.indexOf('Interval') > -1 && ratinZone[elem.decorator]) {
                            isInterVal[k] = ratinZone[elem.decorator]
                        }
                        console.log(k, options.length - 1);

                        if (k !== options.length - 1 && (!isInterVal[k] || isInterVal[k] === '+∞')) {
                            // || Number(isInterVal[k]) 或者不为数字类型.
                            this.checkErrorTips(`${item.productName}`, `The ${i+1} ratingZone column ${j} is not the last row of Interval with empty data or '+'`)
                            isCheckStatus = false
                            break
                        }
                        if (isInterVal.length >= 2 && isInterVal[k - 1] && isInterVal[k]) {
                            if (isInterVal[k - 1] === '+∞' && isInterVal[k] !== '+∞') { //Interval in line ${k+1} of the ${i+1} ratingZone should not be less than'+_____________
                                this.checkErrorTips(`${item.productName}`, `Interval in line ${k+1} of the ${i+1} ratingZone should not be less than '+∞'`)
                                isCheckStatus = false
                                break
                            }
                            if (+isInterVal[k - 1] >= +isInterVal[k]) {
                                this.checkErrorTips(`${item.productName}`, `Interval in line ${k+1} of the ${i+1} ratingZone should not be less than`)
                                isCheckStatus = false
                                break
                            }
                        }
                        if (elem.decorator && elem.decorator.indexOf('Rate') > -1 && ratinZone[elem.decorator]) {
                            rateStr[j] = ratinZone[elem.decorator]
                            isRate[j] = true
                        }
                        if (!rateStr[j] && !isRate[j] && elem.decorator.indexOf('Rate') > -1) {
                            this.checkErrorTips(`${item.productName}`, `Zone${i+1} -- ${k+1} column 'Rate' field should be no-null`)
                            isCheckStatus = false
                            break
                        }
                        if (elem.decorator && elem.decorator.indexOf('ChargableunitType') > -1 && !ratinZone[elem.decorator]) {
                            this.checkErrorTips(`${item.productName}`, `Zone${i+1} -- ${k+1} column 'Chargable unit type' field should be no-null`)
                            isCheckStatus = false
                            break
                        }
                    }
                }
            }
        }
        return isCheckStatus
    }
    /* 校验本页面 */
    public checkInterVal(item: any) {
        let isCheckStatus: boolean = true
        /* 校验基本信息 start*/
        if (!this.checkbaseData(this.baseForm, item)) return isCheckStatus = false
        /* 校验基本信息 end*/

        /* 校验复杂信息 start */
        if (!this.checkRatinData(this.form, this.baseForm, item)) return isCheckStatus = false
        /* 校验复杂信息 end */

        /* 校验ratingZone start */
        if (!this.checkRatinZone(this.successForm, this.baseForm, item)) return isCheckStatus = false
        /* 校验ratingZone end */
        return isCheckStatus
    }
}
</script>
