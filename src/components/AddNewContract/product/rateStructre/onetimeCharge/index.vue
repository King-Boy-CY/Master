<template>
<div>
    <h1 style="padding:10px;font-weight:600;">Rating data</h1>
    <Table-input ref="tableInput" :inputcolumns='inputcolumns' :inputdata='inputdata' border :Check="false" :addData="Newdata" @addChange="addData" :initData="initData" />
</div>
</template>

<script lang="ts">
import Vue from 'vue'
import {
    Component,
    Prop
} from 'vue-property-decorator'
import {
    State,
    Mutation
} from 'vuex-class'
import {
    deepClone
} from "@/assets/ts/index";

@Component({
    components: {
        TableInput: () => import('@/common/TableInput/index.vue')
}
})
export default class onetimeCharge extends Vue {
    @State('prossData') private prossData: any
    @State('productIndex') private productIndex: any
    @State('ratePlanObject') private ratePlanObject: any
    @Prop() private editData ? : any;
    @Prop() private contractIndex ? : number;
    @Prop() private editArr ? : any;
    @Mutation('mutionProduct') mutionProduct: any
    @Prop(Number) private productKey ? : number // productKey 标识唯一数据
    @State('closeModel') closeModel: any
    private initData: any[] = [] // 用于数据初始化
    private proIndex: number = 0
    private oneTimeIndex: number = 0
    public $refs:any
    /* TableInput 身体 */
    public inputdata: any[] = [{
        key: 1,
        chargeItem: {
            type: 'input',
            decorator: 'chargeItem'
        },
        Amount: {
            type: 'input',
            decorator: 'Amount'
        }
    }];
    /* TableInput 头部 */
    public inputcolumns: any = [{
            title: 'No .',
            dataIndex: 'No',
            key: 'No'
        },
        {
            title: 'Charge-Item',
            dataIndex: 'chargeItem',
            require: true
        },
        {
            title: 'Amount',
            dataIndex: 'Amount',
            require: true
        }
    ];

    /* TableInput Add */
    public Newdata: any = []
    /* ADD 数据生成 */
    public actions() {
        this.oneTimeIndex++
        const arr: any = [];
        let key = new Date().getTime()
        /* 数据 -> TableInput 一致 重复一份作用于配置后台接口，自定义字段，type类型等。。 */
        const actions = new Map([
            [1, []],
            [2, ['input', 'chargeItem' + key + this.oneTimeIndex]],
            [3, ['input', 'Amount' + key + this.oneTimeIndex]]
        ])
        for (let index = 1; index < actions.size + 1; index++) {
            const action: any = actions.get(index);
            arr.push({
                type: action[0],
                decorator: action[1],
                options: action[2] || undefined
            });
        }
        return arr
    }
    public checkErrorTips(title: string, content: string) {
        return this.$error({
            title,
            content
        });
    }
    public checkOneTime(item: any) {
        let isCheckStatus: boolean = true
        console.log('item---oneTime-98', item);
        let that: any = this
        let oneForm = that.$refs.tableInput.form.getFieldsValue() // 表单数据
        let data = that.$refs.tableInput.Arr // 数据来源
        let ischargeItem: string[] | undefined[] = []
        let isAmount: String[] | undefined[] | number[] | any = []
        let arr = []
        if (this.contractIndex === 1) {
            arr = this.getTabs()
        } else {
            arr = this.editArr
        }

        that.$refs.tableInput.form.validateFields((err: any, value: any) => {
            if (err) {
                //  this.$message.error('ratinZone -- 补充必填项')
            }
        })
        if (arr[this.productIndex]['typeName'] !== item.productName) {
            if (!item.ratingZoneList.length) {
                this.checkErrorTips(`${item.productName}--Check error`, `No data`)
                isCheckStatus = false
            }
            for (let i = 0; i < item.ratingZoneList.length; i++) {
                const elem = item.ratingZoneList[i];
                console.log('elem', elem);
                if (!(elem.amount + '')) {
                    this.checkErrorTips(`${item.productName}--Check error`, `${i+1} colum -- 'Amount' field should be no-null`)
                    isCheckStatus = false
                    break
                }
                if (Number.isNaN(elem.amount)) {
                    this.checkErrorTips(`${item.productName}--Check error`, `${i+1} colum -- 'Amount' field should be Number`)
                    isCheckStatus = false
                    break
                }
                if (!elem.chargeItem) {
                    this.checkErrorTips(`${item.productName}--Check error`, `${i+1} colum  -- 'Charge-Item' field should be no-null`)
                    isCheckStatus = false
                    break
                }

            }
            return isCheckStatus
        } else {
            for (let index = 0; index < data.length; index++) {
                const element = data[index];
                ischargeItem[index] = undefined
                isAmount[index] = undefined
                for (let i = 0; i < element.name.length; i++) {
                    const elem = element.name[i];
                    if (Object.keys(elem).length < 1) continue
                    if (elem.decorator && elem.decorator.indexOf('chargeItem') > -1 && oneForm[elem.decorator]) {
                        ischargeItem[index] = oneForm[elem.decorator]
                    }
                    if (elem.decorator && elem.decorator.indexOf('Amount') > -1 && oneForm[elem.decorator]) {
                        isAmount[index] = oneForm[elem.decorator] + ''
                    }
                }
                if (!isAmount[index] && !ischargeItem[index]) {
                    this.checkErrorTips(`${item.productName}`, ` ${index+1} colum -- 'Amount,Charge-Item' field should be no-null`)
                    isCheckStatus = false
                    break
                }
                if (!isAmount[index]) {
                    this.checkErrorTips(`${item.productName}`, `${index+1} colum -- 'Amount' field should be no-null `)
                    isCheckStatus = false
                    break
                }
                if (Number.isNaN(isAmount[index])) {
                    this.checkErrorTips(`${item.productName}--Check error`, `${index+1} colum -- 'Amount' field should be Number`)
                    isCheckStatus = false
                    break
                }
                if (!ischargeItem[index]) {
                    this.checkErrorTips(`${item.productName}`, `${index+1} colum -- 'Charge-Item' field should be no-null`)
                    isCheckStatus = false
                    break
                }
            }
        }
        return isCheckStatus
    }
    /* 复制 */
    public assignmentData(values: any) {
        // console.log(values)
        if (!values) return
        let inputdata: any[] = []
        for (let i = 0; i < values.ratingZoneList.length; ++i) {
            inputdata.push({
                key: i,
                chargeItem: {
                    type: 'input',
                    decorator: 'chargeItem' + i + new Date().getTime(),
                    initialValue: values.ratingZoneList[i]['chargeItem']
                },
                Amount: {
                    type: 'input',
                    decorator: 'Amount' + i + new Date().getTime(),
                    initialValue: values.ratingZoneList[i]['amount'] + ''
                }
            })
        }
        // console.log(inputdata) 
        // inputdata.length && (this.$refs.tableInput as any).initDataAndColums(inputdata)
        inputdata.length && (this.initData = inputdata)
    }
    public getTabs(): any {
        let ratePlanArr: any[] = []
        for (let i = 0; i < this.ratePlanObject.length; i++) {
            const element = this.ratePlanObject[i];
            for (let index = 0; index < element.tabs.length; index++) {
                ratePlanArr.push(element.tabs[index])
            }
        }
        return ratePlanArr
    }
    public deactivated() {
         if(this.closeModel == 'contract') return
        this.fieldProcessing()
    }
    public created() {
        Vue.prototype.checkOneTime = (item: any) => {
            return this.checkOneTime(item)
        }
        this.addData()
    }
    public fieldProcessing() {
        this.$nextTick(() => {
            if(!this.$refs.tableInput) return
            let ratePlanArr: any = []
            if (this.contractIndex === 1) {
                ratePlanArr = this.getTabs()
            } else {
                ratePlanArr = this.editArr
            }
            let productObj: any = {}
            if (!this.prossData[ratePlanArr[this.proIndex]['typeName'] + this.productKey]) {
                productObj = {
                    productData: {}
                }
            } else {
                productObj = deepClone(this.prossData[ratePlanArr[this.proIndex]['typeName'] + this.productKey])
            }
            let data: any = []
            // let formData = this.$refs.tableInput.form.getFieldsValue()
            const getData = this.$refs.tableInput.getData();
            !!getData && getData.forEach((element: any) => {
                data.push({
                    amount: !Number.isNaN(element.Amount) ? +element.Amount : undefined,
                    chargeItem: element.chargeItem,
                    zoneNumber: 1
                })
            });
            // 增加
            productObj.productData.productName = ratePlanArr[this.proIndex].typeName
            productObj.productData.direction = ratePlanArr[this.proIndex].direction
            const Ratestructre: string[] = ['Flat', 'Tier', 'Interval', 'RecurringCharge', 'OneTimeCharge', 'Penalty', 'Cap', 'DisCount'];
            productObj.productData.rateStructure = Ratestructre.indexOf(ratePlanArr[this.proIndex].RateStructure) + 1 || undefined
            productObj.productData.ratingZoneList = data
            let planArr = ratePlanArr[this.proIndex]
            this.prossData[planArr['typeName'] + this.productKey] = deepClone(productObj)
            if (this.contractIndex === 2) {
                planArr.productData = productObj.productData
            }
            console.log('planArr', planArr);
            this.mutionProduct(ratePlanArr)
            // 保存数据
            console.log('保存数据 productObj', productObj)
        })
    }
    public activated() {
        Vue.prototype.getOnetimeCharge = () => {
            console.log('onetimeCharge')
            this.fieldProcessing()
        }
        this.proIndex = this.productIndex
        let ratePlanArr: any = []
        if (this.contractIndex === 1) {
            ratePlanArr = this.getTabs()
        } else {
            ratePlanArr = this.editArr
        }
        let productData: any
        if (!this.prossData[ratePlanArr[this.proIndex]['typeName'] + ratePlanArr[this.proIndex].productKey]) {
            productData = ratePlanArr[this.proIndex]['productData']
        } else {
            return false
        }
        // setTimeout(() => {
        this.assignmentData(productData)
        // }, 600)
    }
    // add数据
    public addData() {
        this.Newdata = [this.actions()];
    }
}
</script>

<style lang="scss" scoped>
</style>
