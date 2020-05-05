<template>
<div class="Flat-code">
    <base-data :editArr="editArr" @select="onbaseSelect" :baseData="baseData" @baseForm="baseFormChange" :contractIndex="contractIndex" ref="baseData" />
    <rating-data ref="ratingData" :ratingData="ratingData" @input="onInput" @select="onSelect" @changeFrom="changeFrom" @pickerChange="pickerChange" />
    <rating-zoneadd @Handledestination="Handledestination" @rateInitData="rateInitData" timeBand :tableData="tableData" :tableColumn="tablColumns" :ratingzoneAdd="ratingzoneAdd" @onSelect="onTableSelect" @tableDele="dele" @onInput="onInputZone" :zoneCopy="zoneCopy" @ratingZoneCopy="ratingZoneCopy" @delecopyIndex="delecopyIndex" @ratingAddzone="ratingAddzone" @successForm="SuccessForma" ref="zoneAdd" @TotalCommitmen="TotalCommitmena" />
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
    isArray,
    isNumber
} from "@/assets/ts/index"

// 通用配置
import {
    refsConfig
} from '@/assets/ts/config.d'
// 当页静态数据
import {
    columns,
    ratingzone
} from './paraMetricData'
// 当页静态数据 变量声明
import {
    Columns,
    ratingDataSet
} from './parameter'
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

export default class Flat extends Vue {
    public $refs: refsConfig | any // 第一种方式 直接使用接口索引签名
    // 第二种需要声明每个ref
    // public $refs!: {
    //     ratingData: any,
    //     baseData:any,
    //     zoneAdd:any
    // }
    @State('ratePlanObject') private ratePlanObject: any
    @State('productIndex') private productIndex ? : any
    @State('contractData') private contractData ? : any
    @State('productRatingZoneList') private productRatingZoneList ? : any
    @State('productForm') private productForm: any
    @State('prossData') private prossData: any
    @Mutation('mutionProduct') mutionProduct: any
    @Prop(Number) private productKey ? : string // product key
    @Prop() private editData ? : any;
    @Prop() private contractIndex ? : number;
    @Prop() private editArr ? : any;
    @State('closeModel') closeModel: any
    private CommitmentUnit: string = ''; // 计费单元
    private index: number = new Date().getTime(); // 表格input添加下标
    private zonecopyIndex: number = 0; // Rating zone 复制下标
    private CommitmentValues: any = {} // 复制的承诺量
    private form: any
    private successForm: any
    private baseForm: any
    private keepRating: any = {}
    private productIn: number = 0
    private destinations: object[] = []
    private baseData: configuRation['baseData'] = deepClone(base)
    /* Rating data */
    private ratingData: configuRation['ratingData'] = deepClone(rating)
    // /* 表格数据 -> 身体 */
    private tableData: any[] = []
    private tableDatasa: any[] = []
    /* 表格数据 -> 头部 */
    private tablColumns: Columns['Array'] = columns
    /* 表单 Rating zone  */
    private ratingzoneAdd: configuRation['ratingzoneAdd'] = deepClone(ratingzone)
    /* 表单 Rating zone 复制数据来源 */
    private zoneCopy: any[] = []
    /* 合并长度和合并的字段 */
    public contactdata: any[] = []

    /* 表格移除 */
    public dele() {
        this.index--;
    }

    public baseFormChange(form: any) {
        this.baseForm = form
    }

    public created() {
        this.ratingData.splice(4, 2)
        // this.getDstination()
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
        const ratingzoneCopy = [{
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
                options: null,
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
        let options = [] // 费率单元
        let isCommitmentValue: boolean = false // 承诺量是否为default
        let isCommitment: boolean = false // 承诺量是否需要禁用
        let isCommitmentRequired: boolean = false // 承诺量是否必填
        let commitmentUnit = this.form.getFieldValue('CommitmentUnit') // 是否有计费单元
        let dateTime = new Date().getTime() // 时间戳
        this.ratingzoneAdd.forEach((res) => {
            let decorator = this.successForm.getFieldValue(res.CommitmentValue.decorator)
            if (!!decorator && decorator[0] !== 'default' || !decorator) {
                isCommitmentValue = true
            }
            isCommitment = res.CommitmentValue.disabled
            isCommitmentRequired = res.CommitmentValue.required
            len += res.inputdata['options'].length
            let nameArr = res.inputdata['options'][0].name
            let nameLen = nameArr.length
            while (nameLen--) {
                let op = nameArr[nameLen].options
                options = !options[0] && isArray(op) && deepClone(op) || options
                    // 如果没有计费单元 则清除所有限制
                    !commitmentUnit && options.forEach((ops: {
                        disabled: boolean
                    }) => ops.disabled = false)
            }
        })
        this.zonecopyIndex++
        setTimeout(() => {
            this.ratingzoneAdd.push({
                CommitmentValue: {
                    type: 'input',
                    message: 'Commitment (Value) field should be no-null',
                    initialValue: isCommitmentValue ? [] : ['default'],
                    required: isCommitmentRequired,
                    disabled: isCommitment ? true : false, // isCommitment ? true :
                    name: 'CommitmentValue',
                    decorator: `CommitmentValue${dateTime + this.zonecopyIndex}`
                },
                Destination: {
                    type: 'input',
                    message: 'Destination field should be no-null',
                    initialValue: [],
                    required: true,
                    disabled: false,
                    options: this.ratingzoneAdd[0]['Destination']['options'],
                    name: 'Destination',
                    decorator: `Destination${dateTime + this.zonecopyIndex}`
                },
                timeBand: {
                    type: 'textarea',
                    message: 'Time band field should be no-null',
                    initialValue: '',
                    required: true,
                    disabled: false,
                    name: 'timeBand',
                    decorator: `timeBand${dateTime + this.zonecopyIndex}`,
                    isInsert: false,
                    isClear: true
                },
                inputcolumns: {
                    type: 'tableCloums',
                    options: [{
                            title: 'No .',
                            dataIndex: 'No',
                            key: 'No'
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
                                require: true,
                                initialValue: '',
                                decorator: `Rate${dateTime + len}`
                            },
                            {
                                type: 'select',
                                decorator: `ChargableunitType${dateTime + len}`,
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
        }, 100)
    }

    /* timeband 触发  count:1 === 插入timeband count:2 === 清除 */
    public rateInitData(count: number, index: number) {
        let options = this.ratingData[1]['options'] || []
        let successForm = this.successForm.getFieldsValue()
        let str = ''
        let optionsLen = options.length
        this.ratingzoneAdd.forEach((res) => {
            if (successForm[res.timeBand.decorator]) {
                str += successForm[res.timeBand.decorator] ? successForm[res.timeBand.decorator] : ''
            }
        })
        while (optionsLen--) {
            const element = options[optionsLen];
            if (!str && count !== 1) {
                this.ratingzoneAdd[index].timeBand.isInsert = false
                this.ratingzoneAdd[index].timeBand.isClear = true
                element.name === 'User' && (element.disabled = false)
                element.name === 'Call' && (element.disabled = false)
            } else {
                element.name === 'User' && (element.disabled = true)
                element.name === 'Call' && (element.disabled = true)
            }
        }
        if (count === 1) return this.commituniType(['User', 'Call'], index)
        /* timeband clear  */
        if (count === 2) {
            this.ratingzoneAdd[index].timeBand.isInsert = false
            this.ratingzoneAdd[index].timeBand.isClear = true
            let commUnit = this.form.getFieldValue('CommitmentUnit');
            this.commituniType(commUnit, index)
        }
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

    // /* onInput -> ratingData 输入触发 */
    public onInput(value: string, name: string) {
        const {
            CommitmentValue
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
        console.log('form-437', form);

        this.successForm = form;
    }

    /* Commitment(unit) 选中清除已经选中 */
    public setFieldsTimeband(value ? : string) {
        if (value && typeof value === 'string') {
            this.ratingzoneAdd.forEach((element: any) => element.timeBand.isInsert = (value === 'User' || value === 'Call'))
        }
    }
    public emptyUniType(key ? : number | undefined, successForm ? : any) {
        console.log('key',key);
        let ChargableunitType = this.ratingzoneAdd,index:number = -1
         ChargableunitType.forEach((res: any,k:number) => {
             let tmb = successForm[res['timeBand']['decorator']];
             if(!tmb) index = k;
         })
         let valIndex = isNumber(key) ? key : index !== -1 && index;
        if (typeof valIndex === 'number') {
            let nameArr = this.ratingzoneAdd[valIndex].inputdata.options[0]['name']
            nameArr.forEach((res: any) => {
                if (res.options) {
                    let ops = deepClone(res.options);
                    ops.forEach(item => item.disabled = false);
                    res.options = ops;
                    // res.options.forEach(item => item.disabled = false);
                }
            })
        }
    }
    /* 初始 费率单元 */
    public commituniType(value ? : string | string[], key ? : number) {
        let CommitmentUnit: string[] = ['Secs', 'Mins', 'Quarters', 'Call', 'User']
        let ChargableunitType = this.ratingzoneAdd
        let successForm = this.successForm.getFieldsValue()
        let isCommitment = this.baseForm.getFieldValue('Commitment');
        let timeband: string = ''
        console.log('isCommitment', isCommitment);
        console.log('value', value);

        console.log('value', value);
        if (isArray(value) && typeof key === 'number') {
            return this.ratingzoneAdd[key].inputdata.options.forEach((ops: any) => {
                ops.name.forEach((itName: any) => {
                    itName.options && itName.options.forEach((elem: any) => {
                        elem.name === 'Call' && (elem.disabled = true)
                        elem.name === 'User' && (elem.disabled = true)
                    });
                });
            })
            return false
        }
        // base 操作
        if (!value && (isCommitment === 'No' || isCommitment === 2)) {
            return this.emptyUniType(undefined, successForm)
        }
        // zone 操作
        if (!value && (isCommitment === 'No' || isCommitment === 2) && typeof key === 'number') {
            return this.emptyUniType(key)
        }
        ChargableunitType.forEach((item: any, index: number) => {
            timeband += successForm[item['timeBand']['decorator']] ? successForm[item['timeBand']['decorator']] : ''
            // item.inputdata.options.forEach((ops: any) => {
                let name = item.inputdata.options[0]['name']
                name.forEach((itName: any) => {
                    itName.options && itName.options.forEach((elem: any) => {
                        if (value && isArray(value)) {
                            return Array.from(value).forEach(element => elem.disabled = element === elem.name);
                        }
                        let itUnit: number | string = successForm[itName.decorator]
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
            // });
        });
        // 初始如果存在timeband则禁用Call和User
        let ratingData: any = this.ratingData[1].options
        let ratingLen = ratingData.length
        console.log('timeband:', timeband);

        if (timeband) {
            console.log('初始如果存在timeband则禁用Call和User');
            while (ratingLen--) {
                let value = ratingData[ratingLen]['name']
                ratingData[ratingLen]['disabled'] = (value === 'Call' || value === 'User')
            }
        }
        else{
            console.log('没有timeband');
        ratingData.forEach( res => res.disabled = false )
        }
    }

    /* onSelect -> ratingData 下拉触发 */
    public onSelect(value: string, form: any) {
        this.CommitmentUnit = value;
        this.commituniType(value)
        this.setFieldsTimeband(value)
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
        this.$nextTick(() => {
            let rating = this.ratingData
            let ratePlanArr: any[] = []
            if (this.contractIndex === 1) {
                ratePlanArr = this.getPlanData()
            } else {
                ratePlanArr = this.editArr
            }
            /* 承诺量 */
            if (!name) return
            let totalCommitValue = this.form.getFieldValue && this.form.getFieldValue('TotalCommitmentValue') || undefined
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
                this.commituniType()
                for (let i = 0; i < rating.length; ++i) {
                    const element = rating[i];
                    if (Object.keys(element).length > 0) {
                        this.form.setFieldsValue && this.form.setFieldsValue({
                            [element.Tips]: undefined
                        })
                    }
                }
                return !!name && value === 'Commitment' && rating.forEach((elem: any) => {
                    elem.required = false;
                    elem.disabled = true;
                });
            }
            if (!!name && value === 'Commitment' && (name === 1 || name === 'Yes')) {
                this.form.setFieldsValue && this.form.setFieldsValue({
                    [rating[2]['Tips']]: moment(ratePlanArr[this.productIn || 0]['commitmentBeginDate']) || undefined,
                    [rating[3]['Tips']]: moment(ratePlanArr[this.productIn || 0]['commitmentEndDate']) || undefined
                })
                let value0 = this.successForm.getFieldValue && this.successForm.getFieldValue(ratingAdd[0]['CommitmentValue']['decorator']) || undefined
                return rating.forEach((elem: any) => {
                    elem.required = true
                    elem.disabled = false;
                    if (value0 && value0[0] !== 'default' && elem.Tips === 'TotalCommitmentValue') {
                        elem.disabled = true;
                    }
                });

            }
        })
    }

    /* rating zone 输入触发 */
    public onInputZone(value: any, name: string) {
        let successForm = this.successForm.getFieldsValue()
        let ratingzoneLen = this.ratingzoneAdd.length
        let ratingzone = this.ratingzoneAdd
        let totalName = 'TotalCommitmentValue'
        if (value === 'default') {
            let ratingLen = this.ratingData.length
            let ratingData = this.ratingData
            while (ratingzoneLen--) {
                let res = ratingzone[ratingzoneLen]
                this.successForm.setFieldsValue({
                    [res.CommitmentValue.decorator]: ['default']
                })
            }
            this.form.setFieldsValue({
                [totalName]: undefined
            })
            while (ratingLen--) {
                let res = ratingData[ratingLen]
                if (res.Tips === totalName) {
                    res.disabled = false
                }
            }
            return false
        } else {
            while (ratingzoneLen--) {
                let res = ratingzone[ratingzoneLen]
                let decorator = successForm[res.CommitmentValue.decorator]
                if (!value && isArray(decorator) && decorator[0] === 'default') {
                    this.successForm.setFieldsValue({
                        [res.CommitmentValue.decorator]: undefined
                    })
                }
            }
        }
        let ref: any = this.$refs.ratingData;
        let getCount = 0
        ref.checkForm()
        const ratingData: any = this.ratingData
        let ratingAdd = this.ratingzoneAdd
        let ratingLen = this.ratingzoneAdd.length
        if (value) {
            let count = 0
            while (ratingLen--) {
                let elem: any = ratingAdd[ratingLen];
                let decorator = successForm[elem.CommitmentValue.decorator]
                if (isArray(decorator) && decorator[0] === 'default') {
                    this.successForm.setFieldsValue({
                        [elem.CommitmentValue.decorator]: undefined
                    })
                }
                if (elem.Tips === totalName) {
                    elem.disabled = true
                }
                getCount += isArray(decorator) && +decorator[0] || 0
            }
            ratingData.forEach((elem: ratingDataSet) => elem.disabled = elem.Tips === totalName)
            count += getCount ? Number(getCount) + Number(value) : Number(value)
            this.form.setFieldsValue({
                TotalCommitmentValue: count
            });
        } else {
            let count = 0
            while (ratingLen--) {
                let elem = ratingAdd[ratingLen];
                let decorator = successForm[elem.CommitmentValue.decorator]
                if (isArray(decorator) && decorator[0] === 'default') {
                    this.successForm.setFieldsValue({
                        [elem.CommitmentValue.decorator]: undefined
                    })
                }
                if (isArray(decorator) && name !== elem.CommitmentValue.decorator) {
                    count += Number(decorator[0] || 0)
                }
                this.form.setFieldsValue({
                    TotalCommitmentValue: count === 0 || isNaN(count) ? undefined : count
                });
            }
            if (count === 0 || isNaN(count)) {
                ratingData.forEach((elem: ratingDataSet) => elem.Tips === totalName && (elem.disabled = false))
            }
        }
    }

    /* Rating data */
    public pickerChange(picker: Object, name: string) {
        let ratePlanArr: object[] = []
        if (this.contractIndex === 1) {
            ratePlanArr = this.getPlanData()
        } else {
            ratePlanArr = this.editArr
        }
        let beg = moment(ratePlanArr[this.productIndex]['commitmentBeginDate']).format('YYYY-MM-DD')
        let end = moment(ratePlanArr[this.productIndex]['commitmentEndDate']).format('YYYY-MM-DD')
        let pickerDate = moment(picker).format('YYYY-MM-DD')
        if (pickerDate < beg && name === 'commitmentunitStartTime') {
            return this.$message.warning('承 诺 量 开 始 时 间 不 能 小 于 周 期 开 始 时 间');
        }
        if (pickerDate > end && name === 'commitmentunitendtTime') {
            return this.$message.warning('承 诺 量 结 束 时 间 不 能 大 于 周 期 结 束 时 间');
        }
    }

    public commitment(value: number | string) {
        let name: any
        if (value === 0) {
            name = 'No'
        } else if (value === 1) {
            name = 'Yes'
        }
        return name
    }

    public reCommitment(value: number | string) {
        let name: any
        if (value === 'No' || value === 2) {
            name = 0
        } else if (value === 'Yes' || value === 1) {
            name = 1
        }
        return name
    }
    // zone
    public updateZone(ratiLen: number, count: number, privatekey: number): void {
        if (this.ratingzoneAdd.length !== ratiLen) {
            let newZone: any = []
            for (let index = 0; index < ratiLen; index++) {
                this.zonecopyIndex++
                count += 1
                let addZone = deepClone(this.ratingzoneAdd[0])
                addZone['CommitmentValue']['decorator'] = 'CommitmentValue' + privatekey + this.zonecopyIndex
                addZone['Destination']['decorator'] = 'Destination' + privatekey + this.zonecopyIndex
                addZone['timeBand']['decorator'] = 'timeBand' + privatekey + this.zonecopyIndex
                addZone['timeBand']['initialValue'] = undefined
                addZone['key'] = 'key' + privatekey + this.zonecopyIndex

                addZone['inputdata']['key'] = '' + privatekey + this.zonecopyIndex
                addZone['inputdata']['options'][0].key = 'options' + privatekey + this.zonecopyIndex
                addZone['inputdata']['options'][0].name.forEach((item: any) => {
                    if (item.decorator) {
                        const match = item.decorator.match(/[a-zA-Z]+/)
                        if (match) {
                            item.decorator = match[0] + privatekey + this.zonecopyIndex
                        }
                    }
                })
                newZone.push(addZone)
            }
            this.ratingzoneAdd = []
            this.ratingzoneAdd.push(...newZone)
        }
    }
    // timeBand
    public setTimeband(productData, outerKey: string, count) {
        let data: any[] = [],
            columns: any[] = [],
            objCount: any = {},
            peakCount: number = 0,
            offPeakCount: number = 0,
            str: string = '',
            options: any = [],
            destinationArr: string[] = []
        this.ratingzoneAdd[0]['inputdata']['options'][0]['name'].forEach((elem: any) => {
            if (elem.options) {
                options = deepClone(elem.options)
            }
        });
        if (!!productData && productData.ratingZoneList.length >= 1) {
            productData.ratingZoneList.forEach((elem: any, index: number) => {
                if (productData.isCommitment === 0 || productData.isCommitment === 'No' || (productData.totalCommitment && elem['commitmentValue'] === -1)) {
                    this.ratingzoneAdd[index].CommitmentValue.disabled = true
                    this.ratingzoneAdd[index].CommitmentValue.required = false
                } else {
                    this.ratingzoneAdd[index].CommitmentValue.disabled = false
                    this.ratingzoneAdd[index].CommitmentValue.required = true
                }
                this.zonecopyIndex++
                data = []
                columns = []
                str = ''
                peakCount = 0,
                    offPeakCount = 0
                let chargeUnit: number = 0
                let type: string = ''
                this.$nextTick(() => {
                    const commitValue: any = elem['commitmentValue'] == -1 ? ['default'] : elem['commitmentValue'] > -1 ? [elem['commitmentValue']] : undefined
                    // this.ratingzoneAdd[index]['CommitmentValue']['decorator'] = commitValue
                    this.successForm.setFieldsValue({
                        [this.ratingzoneAdd[index]['CommitmentValue']['decorator']]: commitValue
                    })
                })
                this.ratingzoneAdd[index]['Destination']['initialValue'] = elem['destinationList'] && elem['destinationList'].split(',') || []
                this.ratingzoneAdd[index]['timeBand']['data'] = elem.ratingDetailList || []
                // 修改
                this.ratingzoneAdd[index]['timeBand'].timeBandDetailList = elem.timeBandDetailList
                destinationArr = [...destinationArr, ...elem['destinationList'].split(',')]
                elem.ratingDetailList.forEach((detai: any, key: number) => {
                    let timeBandDetail = elem.timeBandDetailList[key]
                    count += 1
                    let value = !!timeBandDetail && timeBandDetail || undefined
                    chargeUnit = detai.chargeUnit
                    if (!!timeBandDetail && !!timeBandDetail['type']) {
                        if (!objCount['Offpeak'] && timeBandDetail.type === 2) {
                            offPeakCount = 1
                            objCount['Offpeak'] = 'Offpeak'
                            type = 'Offpeak' + offPeakCount
                        } else if (objCount['Offpeak'] && timeBandDetail.type === 2) {
                            offPeakCount += 1
                            type = 'Offpeak' + offPeakCount
                        }
                        if (!objCount['peak'] && timeBandDetail.type === 1) {
                            peakCount = 1
                            objCount['peak'] = 'peak'
                            type = 'peak' + peakCount
                        } else if (objCount['peak'] && timeBandDetail.type === 1) {
                            peakCount += 1
                            type = 'peak' + peakCount
                        }
                        str += `${type || '--'}\xa0\xa0\xa0\xa0:\xa0${value.dayFrom || '--'}-${value.dayTo || '--'}\xa0/\xa0${value.weekdayFrom || '--'}-${value.weekdayTo || '--'}\xa0/\xa0${value.timeFrom || '--'}-${value.timeTo || '--'}\n`
                        this.ratingzoneAdd[index]['timeBand']['initialValue'] = str.trim()
                    }
                    this.ratingzoneAdd[index].timeBand.isInsert = str && true
                    this.ratingzoneAdd[index].timeBand.isClear = str && false
                    // this.ratingzoneAdd[index]['timeBand']['data'] = value
                    this.ratingzoneAdd[index]['inputdata']['options'][0]['name'].forEach((el: any) => {
                        if (!!this.ratingzoneAdd[index]['timeBand']['initialValue']) {
                            !!el.options && el.options.forEach((ops: any) => {
                                ops.disabled = ops.name === 'User'
                            });
                        }
                    });
                    data.push({
                        type: 'input',
                        decorator: 'Rate' + outerKey + count,
                        key,
                        require: true,
                        initialValue: '',
                        model: detai.rate + ''
                    })
                    columns.push({
                        title: type + '\xa0' + 'Rate',
                        dataIndex: 'Rate',
                        require: true
                    })
                });
                data.unshift({})
                data.push({
                    type: 'select',
                    decorator: 'ChargableunitType' + outerKey + count,
                    options,
                    initialValue: options[chargeUnit - 1] && options[chargeUnit - 1].name || undefined
                })
                columns.unshift({
                    title: 'No .',
                    dataIndex: 'No',
                    key: 'No'
                })
                columns.push({
                    title: 'Chargable unit type',
                    dataIndex: `ChargableunitType`,
                    require: true
                })
                let itName: any = {
                    key: new Date().getTime(),
                    name: data
                }
                this.ratingzoneAdd[index]['inputcolumns']['options'] = columns
                this.ratingzoneAdd[index]['inputdata']['options'][0] = itName
            });
            return false
        }
    }
    // BaseData
    public setBaseData(productData) {
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
                [this.baseData[7].Tips]: productData.isCommitment !== 0 && productData.isTrafficForward !== 0 && ['Next period'] || undefined, // productData.trafficPeriodCycle
                [this.baseData[8].Tips]: this.commitment(productData.isAnyExceed),
                [this.baseData[9].Tips]: productData.trafficForwardValue,
                [this.baseData[10].Tips]: productData.trafficForwardPercentage
            })
            setTimeout(() => {
                this.$refs['baseData'].processingData && this.$refs['baseData'].processingData()
            }, 300);
        })

    }
    public setRatingData(ratePlanArr, productData, beg, end) {
        let CommitmentUnit = ['Secs', 'Mins', 'Quarters', 'Call', 'User']
        if (!productData) {
            this.ratingData[2].initialValue = beg || undefined
            this.ratingData[3].initialValue = end || undefined
            return false
        }
        this.$nextTick(() => {
            // Rating data 开始结束时间productData.totalCommitment
            this.form.setFieldsValue({
                [this.ratingData[0].Tips]: productData.totalCommitment,
                [this.ratingData[1].Tips]: CommitmentUnit[productData.commitmentUnit - 1] || productData.commitmentUnit,
                [this.ratingData[2].Tips]: beg,
                [this.ratingData[3].Tips]: end
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
                    res.disabled = true
                    res.required = false
                    this.form.setFieldsValue({
                        [res.Tips]: undefined
                    })
                })
            }
            this.commituniType(CommitmentUnit[productData.commitmentUnit - 1] || productData.commitmentUnit)
        })
    }
    public assignmentData(assignmentData ? : any, index ? : number) {
        let ratePlanArr: any[] = [],
            count: number = 0
        if (this.contractIndex === 1) {
            ratePlanArr = this.getPlanData()
        } else {
            ratePlanArr = this.editArr
        }
        let productData = !!assignmentData && assignmentData || ratePlanArr[this.productIn].productData || undefined
        this.setBaseData(productData)
        // RatingData
        let beg = moment(ratePlanArr[this.productIn || 0]['commitmentBeginDate']),
            end = moment(ratePlanArr[this.productIn || 0]['commitmentEndDate'])
        this.setRatingData(ratePlanArr, productData, beg, end)

        console.log(this.ratingzoneAdd.length, productData.ratingZoneList.length);
        this.updateZone(productData.ratingZoneList.length, count, new Date().getTime())

        this.setTimeband(productData, new Date().getTime() + '', count)
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
    /* plan配置 默认 */
    public planRatingData() {
        let count: number = 0
        let ratePlanArr: any[] = []
        if (this.contractIndex === 1) {
            ratePlanArr = this.getPlanData()
        } else {
            ratePlanArr = this.editArr
        }

        let productData: any
        let planArr = ratePlanArr[this.productIn]
        if (!this.prossData[planArr['typeName'] + planArr.productKey]) {
            productData = planArr['productData']
        } else {
            return false
        }
        this.setBaseData(productData)
        // RatingData
        let beg = moment(ratePlanArr[this.productIn || 0]['commitmentBeginDate']),
            end = moment(ratePlanArr[this.productIn || 0]['commitmentEndDate'])
        this.setRatingData(ratePlanArr, productData, beg, end)
        if (!productData) {
            return false
        }
        this.updateZone(productData.ratingZoneList.length, count, new Date().getTime())
        this.setTimeband(productData, new Date().getTime() + '', count)
    }
    /* 处理费率区 */
    public Handledestination(values ? : string[]) {
        setTimeout(() => {
            // zone 的所有数据
            const zoneAdd: any = this.$refs.zoneAdd
            const formData: any = zoneAdd.getFieldsValue()
            let ratingdata = deepClone(this.ratingzoneAdd)
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
        }, 400)
    }
    public processProductData(ratingzoneAdd: any) {
        const successFormData = this.successForm.getFieldsValue()
        const unit: any[] = [{
            name: 'Secs',
            value: 1,
        }, {
            name: 'Mins',
            value: 2,
        }, {
            name: 'Quarters',
            value: 3,
        }, {
            name: 'Call',
            value: 4,
        }, {
            name: 'User',
            value: 5,
        }]
        let zoneAddData: any[] = []
        ratingzoneAdd && ratingzoneAdd.forEach((item: any, index: number) => {
            let commitValue = successFormData[item.CommitmentValue.decorator]

            let obj: any = {
                commitmentValue: !commitValue ? undefined : !!commitValue && commitValue[0] === 'default' ? -1 : commitValue[0],
                destinationList: successFormData[item.Destination.decorator] && successFormData[item.Destination.decorator].join(',') || undefined,
                ratingDetailList: [],
                timeBandDetailList: !item.timeBand.timeBandDetailList ? [] : item.timeBand.timeBandDetailList,
                zoneNumber: index + 1
            }
            let count: number = 0
            const ratingDetailList = item.inputdata.options[0].name
            const chargeUnit = unit.find((item: any) => item.name == successFormData[ratingDetailList[ratingDetailList.length - 1].decorator])
            ratingDetailList && ratingDetailList.length && ratingDetailList.forEach((innerItem: any, index: number) => {
                if (innerItem.decorator && ratingDetailList.length - 1 != index) {
                    obj.ratingDetailList.push({
                        rate: !Number.isNaN(+successFormData[innerItem.decorator]) ? +successFormData[innerItem.decorator] : undefined,
                        chargeUnit: chargeUnit ? chargeUnit.value : successFormData[ratingDetailList[ratingDetailList.length - 1].decorator],
                        timeBandDetailIndex: count++
                    })
                }
            })
            zoneAddData.push(obj)
        })
        return zoneAddData
    }

    /* 保存当页数据 */
    public fieldProcessing() {

        let ratePlanArr: any[] = []
        if (this.contractIndex === 1) {
            ratePlanArr = this.getPlanData()
        } else {
            ratePlanArr = this.editArr
        }
        console.log('ratePlanArr', ratePlanArr);
        console.log(this.productIn);

        setTimeout(() => {
            let baseForm = this.baseForm.getFieldsValue()
            let ratingForm = this.form.getFieldsValue()
            let productObj: any = {}
            let ra = ratePlanArr[this.productIn]
            if (!this.prossData[ra['typeName'] + ra.productKey]) {
                productObj = {
                    productData: {}
                }
            } else {
                productObj = deepClone(this.prossData[ra['typeName'] + ra.productKey])
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
            productObj.productData.gracePeriodCycle = baseForm[baseDataColumn[2].Tips] && baseForm[baseDataColumn[2].Tips][0] || undefined
            productObj.productData.isAnyShortfall = this.reCommitment(baseForm[baseDataColumn[3].Tips])
            productObj.productData.trafficFromValue = +baseForm[baseDataColumn[4].Tips] || undefined
            productObj.productData.trafficFromPercentage = +baseForm[baseDataColumn[5].Tips] || undefined
            productObj.productData.isTrafficForward = this.reCommitment(baseForm[baseDataColumn[6].Tips])
            productObj.productData.trafficPeriodCycle = baseForm[baseDataColumn[7].Tips] && baseForm[baseDataColumn[7].Tips][0] || undefined
            productObj.productData.isAnyExceed = this.reCommitment(baseForm[baseDataColumn[8].Tips])
            productObj.productData.trafficForwardValue = +baseForm[baseDataColumn[9].Tips] || undefined
            productObj.productData.trafficForwardPercentage = +baseForm[baseDataColumn[10].Tips] || undefined

            /* 复杂信息 */
            const ratingDataColumn = this.ratingData
            let CommitmentUnit: string[] = ['Secs', 'Mins', 'Quarters', 'Call', 'User']
            const find = CommitmentUnit.findIndex((item: any) => item === ratingForm[ratingDataColumn[1].Tips])
            productObj.productData.commitmentBeginDate = ratingForm[ratingDataColumn[2].Tips] && moment(ratingForm[ratingDataColumn[2].Tips]).format('YYYY-MM-DD') || undefined
            productObj.productData.commitmentEndDate = ratingForm[ratingDataColumn[3].Tips] && moment(ratingForm[ratingDataColumn[3].Tips]).format('YYYY-MM-DD') || undefined
            productObj.productData.commitmentUnit = find > -1 ? find + 1 : ratingForm[ratingDataColumn[1].Tips]
            productObj.productData.totalCommitment = +ratingForm[ratingDataColumn[0].Tips] || undefined

            /* ratingZone 数据*/
            productObj.productData.ratingZoneList = this.processProductData(this.ratingzoneAdd) || []
            let planArr = ratePlanArr[this.productIn]
            this.prossData[planArr['typeName'] + planArr.productKey] = deepClone(productObj)
            if (this.contractIndex === 2) {
                planArr.productData = productObj.productData
            }
            console.log('planArr', planArr);
            this.mutionProduct(ratePlanArr)
            // console.log('保存name--', planArr['typeName']);
            // console.log('保存key--', planArr.productKey);
            console.log('数据保存--productObj', productObj)
        }, 200);
    }
    public deactivated() {
        console.log('this',this);
        console.log('closeModel',this.closeModel);
        if(this.closeModel == 'contract') return
        this.fieldProcessing()
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
        let ratePlanArr: any[] = []
        if (this.contractIndex === 1) {
            ratePlanArr = this.getPlanData()
        } else {
            ratePlanArr = this.editArr
        }

        let ratinForm = form.getFieldsValue()
        let isCheckStatus: boolean = true
        //  if (typeof item === 'object' && ratePlanArr[this.productIndex]['typeName'] !== item['productName']) return isCheckStatus
        let {
            Commitment
        } = baseForm.getFieldsValue()
        form.validateFields((err: any, value: any) => {
            if (err) {
                //  this.$message.error('ratinZone -- 补充必填项')
            }
        })
        if (item.isCommitment === 0) return true
        if (!item.totalCommitment) {
            this.checkErrorTips(`${item.productName}`, 'Total Commitment (value) field should be no-null')
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
            this.checkErrorTips(`${item.productName}`, 'Commitment end time field should be no-null')
            isCheckStatus = false
            return false
        }
        isCheckStatus = true

        // 去掉小时的差异
        // let beg = moment(ratePlanArr[this.productIndex]['commitmentBeginDate']).endOf('d').format('YYYY-MM-DD')
        // let end = moment(ratePlanArr[this.productIndex]['commitmentEndDate']).startOf('d').format('YYYY-MM-DD')
        // 匹配多个同结构校验时间而不与本次冲突
        let beg, end
        for (let index = 0; index < ratePlanArr.length; index++) {
            const element = ratePlanArr[index];
            if (element.typeName === item.productName) {
                beg = moment(element['commitmentBeginDate']).endOf('d').format('YYYY-MM-DD')
                end = moment(element['commitmentEndDate']).endOf('d').format('YYYY-MM-DD')
            }
        }
        let ratinFormStart = moment(item.commitmentBeginDate).endOf('d').format('YYYY-MM-DD')
        let ratinFormEnd = moment(item.commitmentEndDate).endOf('d').format('YYYY-MM-DD')
        //结束时间的当天的0点
        // console.log('beg',beg.valueOf(),beg.format('YYYY-MM-DD'));
        // console.log('end',end.valueOf(),end.format('YYYY-MM-DD'));
        // console.log('ratinFormStart',ratinFormStart.valueOf(),ratinFormStart.format('YYYY-MM-DD'));
        // console.log('ratinFormEnd',ratinFormEnd.valueOf(),ratinFormEnd.format('YYYY-MM-DD'));

        if (ratinFormEnd && end && ratinFormEnd.valueOf() > end.valueOf()) {
            this.checkErrorTips(`${item.productName}`, 'correct--End time of commitment should not be greater than end time of cycle')
            isCheckStatus = false
            return false
        }
        isCheckStatus = true
        if (ratinFormStart && beg && ratinFormStart.valueOf() < beg.valueOf()) {
            this.checkErrorTips(`${item.productName}`, 'correct--Commitment quantity start time should not be less than cycle start time')
            isCheckStatus = false
            return false
        }
        return isCheckStatus
    }
    public checkErrorTips(title: string, content: string) {
        return this.$error({
            title,
            content
        });
    }
    public checkRatinZone(form: any, baseForm: any, item: any) {
        let ratinZone = form.getFieldsValue()
        let isCheckStatus: boolean = true
        let {
            Commitment
        } = baseForm.getFieldsValue()
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
        // let arr = this.getPlanData()
        let arr: any[] = []
        if (this.contractIndex === 1) {
            arr = this.getPlanData()
        } else {
            arr = this.editArr
        }
        if (arr[this.productIndex] &&  arr[this.productIndex]['typeName'] !== item.productName) {
            for (let i = 0; i < item.ratingZoneList.length; i++) {
                const element = item.ratingZoneList[i];
                if (!element.commitmentValue && item.isCommitment === 1) {
                    this.checkErrorTips(`${item.productName}`, `Zone${i+1}  -- CommitmentValue field should be no-null`)
                    isCheckStatus = false
                    break
                }
                if (!element.destinationList) {
                    this.checkErrorTips(`${item.productName}`, `Zone${i+1}  -- Destination field should be no-null`)
                    isCheckStatus = false
                    break
                }
                for (let j = 0; j < element.ratingDetailList.length; j++) {
                    const elem = element.ratingDetailList[j];
                    if (!(elem.rate + '')) {
                        this.checkErrorTips(`${item.productName}`, `Zone${i+1} -- ${j} column -- Rate field should be no-null`)
                        isCheckStatus = false
                        break
                    }
                    if (Number.isNaN(+elem.rate)) {
                        this.checkErrorTips(`${item.productName}`, `Zone${i+1} ${j} column 'Rate' field should be Number`)
                        isCheckStatus = false
                        break
                    }
                    if (!elem.chargeUnit) {
                        this.checkErrorTips(`${item.productName}`, `Zone${i+1} -- ${j} column -- Chargable unit type field should be no-null`)
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
                if (ratinZone[element.Destination.decorator][0]) {
                    isDestination[i] = true
                }
                if (typeof ratinZone[element.CommitmentValue.decorator] === 'object') {
                    isCommitmentValue[i] = true
                }
                if (!isDestination[i]) {
                    this.checkErrorTips(`${item.productName}`, `Zone${i+1}  -- Destination field should be no-null`)
                    isCheckStatus = false
                    break
                }
                if (!isCommitmentValue[i] && element.CommitmentValue.required === true) {
                    this.checkErrorTips(`${item.productName}`, `Zone${i+1}  -- CommitmentValue field should be no-null`)
                    isCheckStatus = false
                    break
                }
                let nameOptions = element.inputdata.options[0].name
                for (let j = 0; j < nameOptions.length; j++) {
                    isRate[j] = false
                    rateStr[j] = ''
                    const elem = nameOptions[j];
                    if (Object.keys(elem).length < 3) {
                        continue
                    }
                    if (elem.decorator && elem.decorator.indexOf('Rate') > -1 && ratinZone[elem.decorator]) {
                        rateStr[j] = ratinZone[elem.decorator]
                        isRate[j] = true
                    }
                    if (!rateStr[j] && !isRate[j] && elem.decorator.indexOf('Rate') > -1) {
                        this.checkErrorTips(`${item.productName}`, `Zone${i+1} -- ${j} column -- Rate field should be no-null`)
                        isCheckStatus = false
                        break
                    }
                    if (elem.decorator && elem.decorator.indexOf('ChargableunitType') > -1 && !ratinZone[elem.decorator]) {
                        this.checkErrorTips(`${item.productName}`, ` Zone${i+1} -- ${j} column -- Chargable unit type field should be no-null `)
                        isCheckStatus = false
                        break
                    }
                }
            }
            return isCheckStatus
        }
    }
    /* 校验本页面 */
    public checkFlat(item: any) {
        let isCheckStatus = true
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
    /* 获取plan 数据 */
    public activated() {
        this.productIn = this.productIndex
        /* 数据保存 */
        Vue.prototype.getFlat = () => {
            this.fieldProcessing()
        }
        /* 数据全局校验 */
        Vue.prototype.checkFlat = (item: any) => {
            return this.checkFlat(item)
        }
        // let planArr = this.getPlanData()
        // 因为子组件异步的问题，需要定时刷新检测，有值才调用初始值
        let timeCle = setInterval(() => {
            console.log(this.successForm, '1606');
            if (this.successForm) {
                clearInterval(timeCle)
                this.planRatingData()
            }
        }, 100)

        // this.planRatingData()
        setTimeout(() => {
            this.getDstination()
        }, 200);
        // this.initialContractData()
    }

    public getDstination() {
        let arr: any[] = []
        if (this.contractIndex === 1) {
            arr = this.getPlanData()
        } else {
            arr = this.editArr
        }
        if (arr[this.productIndex] || arr[0]) {
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
                this.ratingzoneAdd.forEach(element => {
                    element['Destination']['options'] = this.destinations || []
                });
            })
        }
    }
}
</script>

<style>
.ivu-table-header {
    font-size: 14px;
    font-family: "Chinese Quote", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    color: rgba(0, 0, 0, 0.85);
    font-weight: 500;
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

    /* padding: 9px; */
    border-bottom: 1px solid #e6e6e6;
    /* overflow: hidden; */
    height: 50px;
    line-height: 50px;
}

.subCol {
    font-size: 14px;
}

.subCol>ul>li:last-child {
    border-bottom: none;
}
</style>
