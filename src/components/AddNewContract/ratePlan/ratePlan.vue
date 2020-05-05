<template>
<div>
    <a-form :form='form' class="rateForm">
        <ul>
            <li v-for="(list,index) in ulListItem" :key="contractIndex === 2 ? list.ratePlanName : ''+index">
                <a-collapse v-model="activeKey" @change="collapseChange(index)" class="rateplan-li">
                    <!-- && !CycleObjec[0]  -->
                    <a-collapse-panel :header="
                    contractIndex === 2? `Rate plan${index+1}\xa0\xa0:\xa0\xa0\xa0\xa0${list.ratePlanName}` :
                    `Rate plan${index+1}\xa0\xa0:\xa0\xa0\xa0\xa0${ContractObject.accountName}-${list.Service}-${list.Direction}-${list.Cycle}`
                    " :key="''+list.key">
                        <rate-plan-product :form="form" @progData="progData" :sendratePlanProduct='sendratePlanProduct' :currentKey="index" :collapseIndex="collapseIndex" :dataSources="dataSources" :TestArr.sync="TestArr[index]" :insertIndex="insertIndex" ref="product" @eventShow="rcvShow">
                        </rate-plan-product>
                    </a-collapse-panel>
                </a-collapse>
            </li>
        </ul>
    </a-form>
    <a-modal title="Rate plan" :footer="null" v-model="visible" v-if="visible" @ok="handleOk" style="min-width:960px;">
        <rate-plan-insert @sendProduct="sendProduct" @visibleHide="showModal">
        </rate-plan-insert>
    </a-modal>
</div>
</template>

<script lang="ts">
import Vue from 'vue'
import {
    Component,
    Watch,
    Provide
} from 'vue-property-decorator'
import {
    State,
    Getter,
    Mutation
} from 'vuex-class'
import moment from 'moment'
import ratePlanProduct from '@/components/AddNewContract/ratePlan/ratePlanProduct.vue'
import {
    deepClone
} from '@/assets/ts/index.ts'
@Component({
    components: {
        ratePlanInsert: () => import('@/components/AddNewContract/ratePlan/ratePlanInsert.vue'),
        ratePlanProduct: ratePlanProduct,
    }
})
export default class ratePlan extends Vue {
    @State('ContractObject') ContractObject: any
    @Getter('ServiceList') ServiceList: any
    @State('CycleObjec') CycleObjec: any
    @State("prossData") private prossData: any;
    @Mutation('mutionRatePlan') mutionRatePlan: any
    @State("contractIndex") private contractIndex: any;
    @State('editData') editData: any
    @State('closeModel') closeModel: any
    private dataSources: any[] = []
    private insertIndex: number = 0 //insert组件插入点击的位置
    private TestArr: any[] = []
    private ulListItem: any[] = []
    // private checkList: any[] = [] // 复制勾选的
    @Provide('provideCheckList') private checkList: any[] = [];
    private sendratePlanProduct: any = []
    public form: any

    private beforeCreate() {
        this.form = this.$form.createForm(this)
    }

    private sendProductValue: any = []

    activated() {
        if (this.contractIndex === 1) {
            this.ulListItem = deepClone(this.CycleObjec)
            let len = this.ulListItem.length
            if (len > this.TestArr.length) {
                for (let i = this.TestArr.length; i < len; i++) {
                    this.$set(this.dataSources, i, [])
                    this.$set(this.TestArr, i, [])
                }
            }
        } else {
            // setTimeout(() => {
            //     if (this.CycleObjec[0] && this.contractIndex === 2) {
            //         this.ulListItem = deepClone(this.CycleObjec)
            //         this.activeKey = this.ulListItem.map((a:any,b:Number)  => ''+b)
            //         console.log(this.activeKey,'activeKey');

            //         let len = this.ulListItem.length
            //         if (len > this.TestArr.length) {
            //             for (let i = this.TestArr.length; i < len; i++) {
            //                 this.$set(this.dataSources, i, [])
            //                 this.$set(this.TestArr, i, [])
            //             }
            //         }
            //     }
            // }, 300);
        }
    }

    private goNext: boolean = true

    deactivated() {
        if(this.closeModel == 'contract') return
        this.saveData()
    }

    public progData(valeus: any, index: number, msgString: any) {
        if (!valeus && !index && !!msgString.length) {
            // console.log('dataSources', this.dataSources)
            // console.log('msgString', msgString)
            return false
        }
        // console.log(index)
        // console.log('values', valeus)
        this.$set(this.dataSources, index, valeus || [])
    }

    visible: boolean = false
    public activeKey: any = ['0']
    private isShowInsert: boolean = false
    private collapseIndex: number = 0
    public inputcolumns: any[] = [{
            title: 'No .',
            dataIndex: 'No',
            key: 'No'
        },
        {
            title: 'Service',
            dataIndex: 'Service',
            dataType: 'select',
            require: true
            // sorter: (a:any, b:any) => a.age - b.age -> 排序声明函数
        },
        {
            title: 'Direction',
            dataIndex: 'Direction',
            dataType: 'select',
            require: true
            // sorter: (a:any, b:any) => a.age - b.age -> 排序声明函数
        },
        {
            title: 'Cycle',
            dataIndex: 'Cycle',
            dataType: 'input',
            require: true
        },
        {
            title: 'Begin date',
            dataIndex: 'BeginDate',
            dataType: 'picker',
            require: true
        },
        {
            title: 'End date',
            dataIndex: 'EndDate',
            dataType: 'picker',
            require: true
        }
    ]
    public inputdata: any[] = [{
        key: new Date().getTime(),
        Service: {
            type: 'select',
            decorator: 'IDD',
            options: [{
                    name: 'IDD'
                },
                {
                    name: 'IPLC'
                },
                {
                    name: 'IP'
                }
            ]
        },
        Direction: {
            type: 'select',
            decorator: 'Inbound',
            options: [{
                    name: 'Inbound'
                },
                {
                    name: 'Outbound'
                },
            ]
        },
        Cycle: {
            type: 'input',
            decorator: 'dialedDigits'
        },
        BeginDate: {
            type: 'picker',
            decorator: 'Country'
        },
        EndDate: {
            type: 'picker',
            decorator: 'CountryCode'
        },
    }];

    /* 切换面板的回调 */
    public collapseChange(key: number) {
        // console.log(key)
        this.collapseIndex = key
    }

    public rcvShow(index: any) {
        this.visible = !this.visible
        // console.log(this.visible)
        this.insertIndex = index
        // console.log(this.TestArr);
    }
    /**
     *  @param {pro} ratePlan Name
     *  @returns {
     *  beg:周期开始时间
     *  end：周期结束时间
     *  direction:周期方向
     * }
     */
    public getPrdParams(pro:string[]) {
        let beg, end, direction
        for (let index = 0; index < this.editData.cycleList.length; index++) {
            const cycl = this.editData.cycleList[index];
            if (pro && cycl && cycl.configServiceName === pro[1] && cycl.cycleName === pro[3]) {
                beg = moment(cycl.beginDate).format('YYYY-MM-DD')
                end = moment(cycl.endDate).format('YYYY-MM-DD')
                direction = pro[2] === 'Inbound' ? 1 : 2
            }
        }
        return {
            beg,
            end,
            direction
        }
    }
    public sendProduct(msg: any) {
        console.log(msg);
        const options: any[] = [{
                name: 'Flat',
            },
            {
                name: 'Tier',
            },
            {
                name: 'Interval',
            },
            {
                name: 'RecurringCharge',
            },
            {
                name: 'OneTimeCharge'
            },
            {
                name: 'Penalty'
            },
            {
                name: 'Cap'
            },
            {
                name: 'Discount'
            }
        ]

        const ref: any = this.$refs;
        //rateStructure  Product
        let filterArr: any = []
        // console.log(msg.resDate);
        const key: string = '' + new Date().getTime()
        if (this.contractIndex === 1) {
            msg.record.forEach((item: any, i: number) => {
                let find = msg.resDate.find((innerItem: any) => innerItem.productId === item.productId ||
                    innerItem.id === item.productId)
                filterArr.push({
                    direction: this.CycleObjec[this.insertIndex].Direction.toLowerCase() == 'Inbound' ? 1 : 2,
                    commitmentEndDate: moment(this.CycleObjec[this.insertIndex].EndDate).format('YYYY-MM-DD'),
                    commitmentBeginDate: this.CycleObjec[this.insertIndex].BeginDate,
                    initialValue: item.rateStructure,
                    typeName: item.productName,
                    options,
                    productId: item.productId,
                    productData: find,
                    productKey: key + i
                })
            })
            this.sendratePlanProduct = filterArr
            this.sendratePlanProduct.forEach((item: any, innerIndex: number) => {
                let timestamp = new Date().getTime();
                item.initialValue = item.options[item.initialValue - 1] && item.options[item.initialValue - 1].name
                let ratePlan = `${this.CycleObjec[this.insertIndex].Account }-${this.CycleObjec[this.insertIndex].Service}-${this.CycleObjec[this.insertIndex].Direction}-${this.CycleObjec[this.insertIndex].Cycle}`
                item.decorator = `${item.initialValue}-${this.insertIndex}-${timestamp}${innerIndex}`
                item.typeName = `${ratePlan}-${item.initialValue}-001`
            })
        } else {
            let ratePlanList = this.editData.ratePlanList[this.insertIndex]
            let { beg, end, direction } = this.getPrdParams(ratePlanList['ratePlanName'].split('-'))
            msg.record.forEach((item: any, i: number) => {
                let find = msg.resDate.find((innerItem: any) => innerItem.productId === item.productId ||
                    innerItem.id === item.productId)
                filterArr.push({
                    direction,
                    commitmentEndDate: moment(end).format('YYYY-MM-DD'),
                    commitmentBeginDate: beg,
                    initialValue: item.rateStructure,
                    typeName: item.productName,
                    options,
                    productId: item.productId,
                    productData: find,
                    productKey: key + i
                })
            })
            this.sendratePlanProduct = filterArr
            this.sendratePlanProduct.forEach((item: any, innerIndex: number) => {
                let timestamp = new Date().getTime();
                item.initialValue = item.options[item.initialValue - 1] && item.options[item.initialValue - 1].name
                let ratePlan = ratePlanList['ratePlanName']
                item.decorator = `${item.initialValue}-${this.insertIndex}-${timestamp}${innerIndex}`
                item.typeName = `${ratePlan}-${item.initialValue}-001`
            })
        }
        this.$set(this.TestArr, this.insertIndex, this.TestArr[this.insertIndex].concat(this.sendratePlanProduct))
        this.$nextTick(() => {
            ref.product[this.insertIndex].tableConcat()
        })
    }

    showModal() {
        this.visible = !this.visible
    }

    handleOk(e: any) {
        // console.log(e);
        this.visible = !this.visible
    }

    public created() {
        if (this.contractIndex === 1) {
            this.ulListItem = deepClone(this.CycleObjec)
            for (let i = 0; i < this.CycleObjec.length; i++) {
                this.$set(this.dataSources, i, [])
                this.$set(this.TestArr, i, [])
            }
        } else {
            this.ulListItem = this.editData.ratePlanList
            this.activeKey = []
            for (let j = 0; j < this.ulListItem.length; j++) {
                this.activeKey.push('' + j)
                let items = this.ulListItem[j].productList;
                this.$set(this.dataSources, j, items)
                this.$set(this.TestArr, j, items)
            }
        }
        // if (this.contractIndex === 2) {
        //     console.log('2', this.editData.ratePlanList);
        //     this.ulListItem = this.editData.ratePlanList
        // }
        Vue.prototype.getRatePlan = async () => {
            if (this.contractIndex === 1) {
                this.ulListItem = deepClone(this.CycleObjec)
                let len = this.ulListItem.length
                if (len > this.TestArr.length) {
                    for (let i = this.TestArr.length; i < len; i++) {
                        this.$set(this.dataSources, i, [])
                        this.$set(this.TestArr, i, [])
                    }
                }
                const refProduct: any = this.$refs.product || []
                await refProduct.forEach((item: any) => {
                    item.checkIndex(0)
                })
                setTimeout(async () => {
                    await this.saveData()
                    const that: any = this
                    that.asyncProductData && that.asyncProductData()
                }, 100)
            }
        }
    }

    private saveData() {
        //发送 Product 页面需要的数据 到 vuex state(ratePlanObject)
        // console.log(this.sendProductValue);
        console.log(this.TestArr);
        for (let i = 0; i < this.TestArr.length; i++) {
            let items = this.TestArr[i]
            items.forEach((item: any) => {
                if (item.typeName == "") {
                    this.$message.error('Rate structure 必须选择，不能留空项目，如不需要，请删除')
                    return this.goNext = false
                } else {
                    return this.goNext = true
                }
            })
        }
        // console.log(this.goNext);
        const formDate = this.form.getFieldsValue()
        let sendProduct: any = []
        if (this.contractIndex === 1) {
            for (let i = 0; i < this.ulListItem.length; i++) {
                const arr = this.TestArr[i]
                const key = new Date().getTime()
                let {
                    Service,
                    Direction,
                    Cycle
                } = this.ulListItem[i]
                sendProduct.push({
                    BeginDate: this.CycleObjec[i].BeginDate,
                    EndDate: this.CycleObjec[i].EndDate,
                    Direction: this.CycleObjec[i].Direction,
                    cycleName: Cycle,
                    tabs: [],
                    ratePlanName: `${this.ContractObject.accountName}-${Service}-${Direction}-${Cycle}` || undefined
                })
                for (let j = 0; j < arr.length; j++) {
                    let item = JSON.parse(JSON.stringify(arr[j]))
                    delete item.options
                    arr[j].initialValue = formDate[item.decorator]
                    item.RateStructure = formDate[item.decorator]
                    arr[j].productKey = arr[j].productKey ? arr[j].productKey : '' + key + j
                    // item.commitmentEndDate = moment(this.CycleObjec[i].EndDate).format('YYYY-MM-DD')
                    // item.commitmentBeginDate = this.CycleObjec[i].BeginDate
                    sendProduct[i].tabs.push(item)
                }
            }
        } else {

            let OutboundArr: any[] = []
            let contractDetail = this.editData.contractDetail
            const key = new Date().getTime()
            let newList = JSON.parse(JSON.stringify(this.editData['cycleList']))
            sendProduct = newList.map((item: any, index: number) => {
                item.Account = contractDetail.accountName
                item.Contract = contractDetail.contractName
                item.key = String(index)
                if (item.direction === 3) {
                    item.direction = 'Inbound'
                    OutboundArr.push(Object.assign({}, item, {
                        direction: 'Outbound',
                        key: '' + key + index
                    }))
                }
                return item
            }).concat(OutboundArr).sort((a: any, b: any) => a.configServiceName.localeCompare(b.configServiceName))
            for (let i = 0; i < this.ulListItem.length; i++) {
                const arr: any = this.TestArr[i]
                sendProduct[i].tabs = []
                for (let j = 0; j < arr.length; j++) {
                    let item = JSON.parse(JSON.stringify(arr[j]))
                    delete item.options
                    arr[j].initialValue = formDate[item.decorator]
                    item.RateStructure = formDate[item.decorator]
                    item.commitmentBeginDate = sendProduct[i].beginDate
                    item.commitmentEndDate = sendProduct[i].endDate
                    // item.productKey = new Date().getTime()+10*30
                    arr[j].productKey = arr[j].productKey ? arr[j].productKey : '' + key + j
                    sendProduct[i].tabs.push(item)
                }
            }
        }
        this.mutionRatePlan(this.goNext ? sendProduct : [])
        console.log('sendProduct', sendProduct);
    }
}
</script>

<style>
.rateplan-li .ant-collapse-item .ant-collapse-content {
    overflow: unset;
}
</style><style scoped>
.ant-modal-title {
    text-align: center;
}
</style>
