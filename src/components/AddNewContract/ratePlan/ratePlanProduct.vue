<template>
<div>
    <span class="btns">
        <a-button @click="eventShowAnd">Insert system record</a-button>
        <!-- <a-tooltip placement="top"> -->
        <!-- <a-dropdown> -->
        <template v-if="dataSources&&dataSources.length">
            <dupli-cate :listcolum="dataSources" :currentKey="currentKey" @sendProduct='rcvDuplicate' ref="deleteDataChange">
                <a-button>Duplicate current record</a-button>
            </dupli-cate>
        </template>
        <!-- </a-dropdown> -->
        <!-- </a-tooltip> -->
    </span>

    <section class="code-box-demo">
        <div class="table-code">
            <div class="inner-table-code">
                <table class="gridtabe border " style="width:100%">
                    <thead>
                        <tr>
                            <th v-for="(item,index) in inputcolumns" :key="index">
                                {{item.title}}
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr v-for="(item,key) in copTestArr" :key="item.key">
                            <td :style="{width: '5%'}">
                                <a-form-item>
                                    {{key+1}}
                                </a-form-item>
                            </td>
                            <td :style="{width: '25%'}">
                                <a-form-item>
                                    <a-select :getPopupContainer=" e=> e.parentNode" :style="{width:'95%'}" v-decorator="[
                                  `${item.decorator}`,
                                  {
                                    rules: [{
                                      required:  false,
                                      message: `${item.name} field should be no-null`
                                    }],
                                    initialValue:item.initialValue
                                  }]">
                                        <a-select-option v-for="(iItem,index ) in item.options" :key="index" @click="handleChange(key,iItem.name,item)" :value="iItem.name">
                                            {{iItem.name}}
                                        </a-select-option>
                                    </a-select>
                                </a-form-item>
                            </td>
                            <td :style="{width: '65%'}">
                                <a-form-item>
                                    {{item.typeName}}
                                </a-form-item>
                            </td>

                        </tr>
                    </tbody>
                </table>
            </div>
            <!-- 删除一行按钮 -->
            <div :style="!copTestArr.length ? { visibility: 'hidden', minWidth: '23.72px'} : '' ">
                <ul>
                    <li class="ulLi" v-for="(item,key) in copTestArr
                         " :key="key" @click="deleteTab(key,item)">
                        <span>
                            <a-icon type="minus" />
                        </span>
                    </li>
                </ul>
            </div>
        </div>

        <!-- 添加按钮 -->
        <a-row :gutter="24" class="Row">
            <a-col :span="8">

            </a-col>
            <a-col :span="8">
                <span @click="Add">
                    <a-icon type="plus" />
                </span>
            </a-col>
            <a-col :span="8">
                <span @click="Confirm">Confirm</span>
            </a-col>
        </a-row>

    </section>

</div>
</template>

<script lang="ts">
import Vue from 'vue'
import {
    Component,
    Prop,
    Emit,
    Inject
} from 'vue-property-decorator'
import {
    State
} from 'vuex-class'
import moment from 'moment'
import {
    deepClone
} from '@/assets/ts/index.ts';

@Component({
    components: {
        dupliCate: () => import("./duplicate.vue"),
        //  dupliCate:()=>import("../../../common/duplicate/duplicate.vue")
    }
})
export default class ratePlanProduct extends Vue {
    @Prop(Boolean) public border ? : true; //是否显示边框
    @Prop(Number) public collapseIndex ? : any;
    @Prop(Number) public currentKey ? : any;
    @Prop(Object) public form ? : any;
    @Prop(Array) public TestArr ? : any;
    @State("contractIndex") private contractIndex: any;
    @State('editData') editData: any
    // @Emit('update:TestArr') setTestArr(arr:any) {
    // }
    @Emit('resetDataSouceUni') resetDataSouceUni(index: any) {}

    @Emit('eventShow') eventShow(index: any) {} //是否显示insert页面
    @Emit('progData') progData(values: any, index: number | string, msgString ? : any) {} //选中项发送给父组件
    @Prop(Array) public sendratePlanProduct: any
    @Prop(Array) public dataSources: any
    @Inject() private provideCheckList: any
    @State('CycleObjec') CycleObjec: any
    @State('prossData') private prossData ? : any
    public $refs:any
    private addIndex: number = 0

    get copTestArr() {
        return this.TestArr
    }

    set copTestArr(val: any) {
        this.$emit("update:TestArr", val)
    }

    public listcolum: any[] = []
    public Test: string = ''
    public count: number = 1
    visible: boolean = true

    showModal() {
        this.visible = true
    }

    handleOk(e: any) {
        console.log(e);
        this.visible = false
    }

    public Arr: any[] = []
    public num: number = 1
    // public form: any
    public inputcolumns: any[] = [

        {
            title: 'No .',
        },
        {
            title: 'Rate structure',
        },
        {
            title: 'Product',
        }
    ]
    private inputdata: any = [{
            name: 'Flat',
            decorator: `Flat${this.addIndex}`
        },
        {
            name: 'Tier',
            decorator: `Tier${this.addIndex}`
        },
        {
            name: 'interval',
            decorator: `interval${this.addIndex}`
        },
        {
            name: 'Recurring charge',
            decorator: `recurringCharge${this.addIndex}`
        },
        {
            name: 'One-time charge',
            decorator: `neeTimeCharge${this.addIndex}`
        },
        {
            name: 'Penalty',
            decorator: `Penalty${this.addIndex}`
        },
        {
            name: 'Cap',
            decorator: `Cap${this.addIndex}`
        },
        {
            name: 'Discount',
            decorator: `Discount${this.addIndex}`
        },
    ]
    //private inputdata:any=['Flat','Tire','interval','Recurring charge','One-time charge','Penalty','Cap']
    private productInner: string | number = "666" //prodouct 自动生成内容
    private addData: any = ''
    private tableAdd: any = ''
    private productCheck: any = {} // Product当前选中的值
    private deleteData: string[] = []

    // private beforeCreate() {
    //   this.form = this.$form.createForm(this)
    // }
    public checkIndex(deleteProduct ? : any, deleteKey ? : any) {
        // if (this.contractIndex === 1) {
            setTimeout(() => {
                let value: any
                let formValue = this.form.getFieldsValue()
                let obj: any = {}
                let objPad: any
                let ratePlan: string = ''
                if (this.contractIndex === 2) {
                   ratePlan =  this.editData.ratePlanList[this.currentKey]['ratePlanName']
                }else{
                   ratePlan =  `${this.CycleObjec[this.currentKey].Account }-${this.CycleObjec[this.currentKey].Service}-${this.CycleObjec[this.currentKey].Direction}-${this.CycleObjec[this.currentKey].Cycle}`
                }                
                this.TestArr.forEach((item: any, index: number) => {
                    value = formValue[item.decorator]
                    // console.log(value);
                    if (value) {
                        if (!obj[value]) {
                            obj[value] = 1
                        } else {
                            obj[value]++
                        }
                        objPad = (obj[value] + "").padStart(3, '0')
                        item.typeName = `${ratePlan}-${value}-${objPad}`
                        // console.log('typeName',item.typeName);
                        // if(deleteProduct&&deleteKey==index&&item.hasOwnProperty('productData')&&item.hasOwnProperty('productId')){
                        //   // delete item.productData
                        //   // delete item.productId
                        // }
                    }
                })
                // console.log(obj);
            }, 50)
        // }

    }
    // 编辑的时候匹配cycle对应的方向，时间
   public getCycleDetils () {
       let proName = this.editData.ratePlanList[this.currentKey]['ratePlanName'].split('-')
            let di = ['Inbound', 'Outbound', 'Bilateral']
            let beg, end, Direction: any
            for (let i = 0; i < this.editData.cycleList.length; i++) {
                const element = this.editData.cycleList[i];
                const {
                    configServiceName,
                    cycleName,
                    direction
                } = element
                Direction = element.direction
                if (proName[1] === configServiceName && di.indexOf(proName[2]) + 1 === direction && proName[3] === cycleName) {
                    beg = element.beginDate
                    end = element.endDate
                    Direction = element.direction
                }
            }
            return {
               beg,
               end,
               Direction
            }
    }
    //增加行数
    public Add() {
        if (this.contractIndex === 1) {
            // this.addIndex++
            this.addIndex = new Date().getTime()
            //if(!this.addData) return this.$message.warning('请先配置Add配置/Configure Add data first')
            const newData = {
                options: [{
                        name: 'Flat',
                        decorator: `Flat-${this.currentKey}-${this.addIndex}`
                    },
                    {
                        name: 'Tier',
                        decorator: `Tier-${this.currentKey}-${this.addIndex}`
                    },
                    {
                        name: 'Interval',
                        decorator: `interval-${this.currentKey}-${this.addIndex}`
                    },
                    {
                        name: 'RecurringCharge',
                        decorator: `recurringCharge-${this.currentKey}-${this.addIndex}`
                    },
                    {
                        name: 'OneTimeCharge',
                        decorator: `neeTimeCharge-${this.currentKey}-${this.addIndex}`
                    },
                    {
                        name: 'Penalty',
                        decorator: `Penalty-${this.currentKey}-${this.addIndex}`
                    },
                    {
                        name: 'Cap',
                        decorator: `Cap-${this.currentKey}-${this.addIndex}`
                    },
                    {
                        name: 'Discount',
                        decorator: `Discount-${this.currentKey}-${this.addIndex}`
                    },
                ],
                decorator: `RateStructure-${this.currentKey}-${this.addIndex}`,
                typeName: '',
                direction: this.CycleObjec[this.currentKey].Direction == 'Inbound' ? 1 : this.CycleObjec[this.currentKey].Direction == 'Outbound' ? 2 : 3,
                commitmentEndDate: moment(this.CycleObjec[this.currentKey].EndDate).format('YYYY-MM-DD'),
                commitmentBeginDate: this.CycleObjec[this.currentKey].BeginDate,
                key: this.addIndex
            }
            // console.log(this.copTestArr);
            this.copTestArr.push(newData)
            // this.checkIndex()
            // console.log(this.currentKey)
        } else {
            this.addIndex = new Date().getTime()
            let {Direction,beg,end} = this.getCycleDetils()
            const newData = {
                options: [{
                        name: 'Flat',
                        decorator: `Flat-${this.currentKey}-${this.addIndex}`
                    },
                    {
                        name: 'Tier',
                        decorator: `Tier-${this.currentKey}-${this.addIndex}`
                    },
                    {
                        name: 'Interval',
                        decorator: `interval-${this.currentKey}-${this.addIndex}`
                    },
                    {
                        name: 'RecurringCharge',
                        decorator: `recurringCharge-${this.currentKey}-${this.addIndex}`
                    },
                    {
                        name: 'OneTimeCharge',
                        decorator: `neeTimeCharge-${this.currentKey}-${this.addIndex}`
                    },
                    {
                        name: 'Penalty',
                        decorator: `Penalty-${this.currentKey}-${this.addIndex}`
                    },
                    {
                        name: 'Cap',
                        decorator: `Cap-${this.currentKey}-${this.addIndex}`
                    },
                    {
                        name: 'Discount',
                        decorator: `Discount-${this.currentKey}-${this.addIndex}`
                    },
                ],
                decorator: `RateStructure-${this.currentKey}-${this.addIndex}`,
                typeName: '',
                direction: Direction,
                commitmentEndDate: moment(end).format('YYYY-MM-DD'),
                commitmentBeginDate: moment(beg).format('YYYY-MM-DD'),
                key: this.addIndex
            }
            this.copTestArr.push(newData)
            console.log(this.copTestArr);
            
        }
        console.log('this.copTestArr', this.copTestArr);
    }

    private goOnNext: boolean = true

    public Confirm() {
        this.goOnNext = true
        // console.log(this.TestArr)
        this.TestArr.forEach((elem: any) => {
            if (elem.typeName == "") {
                this.goOnNext = false
                return alert('不能Confirm 空值，必须选择')
            }
        });
        if (this.goOnNext) {
            let obj: any = {
                title: '',
                key: 0,
                options: []
            }
            obj.title = `${this.CycleObjec[this.currentKey].Account }-${this.CycleObjec[this.currentKey].Service}
               - ${this.CycleObjec[this.currentKey].Direction} - ${this.CycleObjec[this.currentKey].Cycle}`
            obj.key = this.currentKey
            this.copTestArr.forEach((elem: any, index: number) => {
                let newItem = deepClone(elem)
                let match: any = newItem.typeName.match(/-(.*-\d*)/)
                // console.log(match);
                newItem.name = match[1] || 'un'
                // newItem.uni = new Date().getTime() + index
                newItem.uni = newItem.productKey || new Date().getTime() + index
                elem.sourceUni = newItem.uni
                // console.log(elem, newItem)
                obj.options.push(newItem)
            });
            // console.log(obj)
            this.progData(obj, this.currentKey)
        }
    }

    private cycleKey: any
    private cycleName: any

    public handleChange(key: any, name ? : any, item ? : any) {
        this.cycleKey = key
        this.cycleName = name
        if (item) {
            item.productKey = new Date().getTime()
            if (item.hasOwnProperty('productData')) {
                delete item.productData
            }
            if (item.hasOwnProperty('productId')) {
                delete item.productId
            }
        }
        this.checkIndex(1, key)
    }
    created() {
        if (this.contractIndex === 2) {
            this.$nextTick(() => {
                let list = this.editData.ratePlanList
                let key = new Date().getTime()
                let prossData: any = []
                for (let i = 0; i < list.length; i++) {
                    // this.addIndex++
                    const elem = list[i];
                    prossData[i] = []
                    if (elem.productList) {
                        // setTimeout(() => {
                        for (let j = 0; j < elem.productList.length; j++) {
                            const element = elem.productList[j];
                            console.log('element',element);
                            
                            this.addIndex++
                            element.ratingZoneList.length && prossData[i].push({
                                options: [{
                                        name: 'Flat',
                                        decorator: `Flat-${this.currentKey}-${this.addIndex}`
                                    },
                                    {
                                        name: 'Tier',
                                        decorator: `Tier-${this.currentKey}-${this.addIndex}`
                                    },
                                    {
                                        name: 'Interval',
                                        decorator: `interval-${this.currentKey}-${this.addIndex}`
                                    },
                                    {
                                        name: 'RecurringCharge',
                                        decorator: `recurringCharge-${this.currentKey}-${this.addIndex}`
                                    },
                                    {
                                        name: 'OneTimeCharge',
                                        decorator: `neeTimeCharge-${this.currentKey}-${this.addIndex}`
                                    },
                                    {
                                        name: 'Penalty',
                                        decorator: `Penalty-${this.currentKey}-${this.addIndex}`
                                    },
                                    {
                                        name: 'Cap',
                                        decorator: `Cap-${this.currentKey}-${this.addIndex}`
                                    },
                                    {
                                        name: 'Discount',
                                        decorator: `Discount-${this.currentKey}-${this.addIndex}`
                                    },
                                ],
                                decorator: `RateStructure-${this.currentKey}-${this.addIndex}`,
                                typeName: element['productName'],
                                initialValue: element['productName'].split('-')[4],
                                direction: element['direction'],
                                commitmentEndDate: moment(element['commitmentEndDate']).format('YYYY-MM-DD'),
                                commitmentBeginDate: element['commitmentBeginDate'] || undefined,
                                key: this.addIndex,
                                productData: element.ratingZoneList && element.ratingZoneList.length && element || undefined,
                                productKey: key + i + j
                            })
                        }
                        // }, 0);
                    }
                }
                this.copTestArr = prossData[this.currentKey]
            })
        }
    }
    private deleteName: any

    public deleteTab(key: number, name: string) {
        this.deleteName = name;
        (this.provideCheckList[this.currentKey] || []).forEach((elem: any, i: number) => {
            // console.log(elem);
            if (this.copTestArr[key].sourceUni && elem === this.copTestArr[key].sourceUni) {
                this.provideCheckList[this.currentKey].splice(i, 1)
                this.$nextTick(() => {
                    this.$refs.deleteDataChange.change()
                })
            }
        })
        //  this.copTestArr[key].sourceUni 为在confirm时增加的属性(时间戳+index) 在复制的组件数据中也加了uni属性  通过对比两属性删除
        if (this.copTestArr[key].sourceUni) {
            for (let i = 0; i < this.dataSources.length; i++) {
                const item = this.dataSources[i]
                // console.log(item);
                if (item.options && item.options instanceof Array) {
                    for (let j = 0; j < item.options.length; j++) {
                        const innerItem = item.options[j]
                        if (innerItem && innerItem.uni === this.copTestArr[key].sourceUni) {
                            item.options.splice(j, 1)
                        }
                    }
                }
            }
        }
        this.copTestArr.splice(key, 1)
        this.checkIndex()
    }

    public tableConcat() {
        this.checkIndex()
    }

    /**duplicate 发送过来的数据 */
    public rcvDuplicate(checkedList: any, index: number) {
        if(!checkedList || !checkedList.length) return 
        let key = new Date().getTime()
        //  ${this.CycleObjec[this.currentKey].Contract}-
        let ratePlan = `${this.CycleObjec[this.currentKey].Account }-${this.CycleObjec[this.currentKey].Service}-${this.CycleObjec[this.currentKey].Direction}-${this.CycleObjec[this.currentKey].Cycle}`
        checkedList.forEach((item: any, checkedIndex: number) => {
            this.dataSources[index].options.forEach((innerItem: any, innerIndex: number) => {
                if (innerItem.uni === item) {
                    const newObj = deepClone(innerItem)
                    // console.log('newObj', newObj);
                    newObj.productKey = key + innerIndex
                    newObj.key = Math.random()
                    newObj.initialValue = this.form.getFieldValue(newObj.decorator)
                    newObj.typeName = `${ratePlan}-${newObj.name}`
                    let find: any = this.copTestArr.find((testItem: any) => {
                        return testItem.typeName === newObj.typeName
                    })
                    // console.log(find);
                    if (find) {
                        newObj.typeName = `${ratePlan}-${newObj.name}`.replace(/-(\s)-(\d)/, (a: any, b: any, c: any) => `-${b}-${(++c + '').padStart(3, '0')}`)
                    }
                    newObj.decorator = newObj.decorator.replace(/-(\d)-(\d+)/, (a: any, b: any, c: any) => `-${this.currentKey}-${new Date().getTime() + innerIndex}`)
                    newObj.direction = this.CycleObjec[this.currentKey].Direction.toLowerCase() == 'inbound' ? 1 : 2
                    // 查找是否有保存数据
                    // console.log('prossData',this.prossData);
                    // console.log('item',item);
                    const typeNameProduct: any = Object.keys(this.prossData).find((productItem: any) => productItem.indexOf(item) > -1)
                    if (typeNameProduct && this.prossData[typeNameProduct] && this.prossData[typeNameProduct].productData) {
                        newObj.productData = this.prossData[typeNameProduct].productData
                    }
                    // console.log('newObj', newObj);
                    this.copTestArr.push(newObj)
                }
            })
        })
        this.checkIndex()
    }

    public eventShowAnd() {
        this.eventShow(this.currentKey)
    }

    activated() {
        setTimeout(() => {
            this.checkIndex()
        }, 0)
    }
}
</script>

<style lang="scss" scoped>
.btns {
    display: flex;
    justify-content: center;

    button {
        // width: 178px;
        border: 1px solid rgb(169, 163, 255);
        border-radius: 15px;
        background: #fafafa;
        color: rgb(10, 68, 255);
        margin: 15px 15px;
        outline: none;
        transition: all 0.2s linear;
        cursor: pointer;

        &:hover {
            background: #3e77d8;
            color: #fff;
        }
    }
}

.code-box-demo {
    margin-left: 30px;
}

.gridtable {
    font-family: 'Chinese Quote', -apple-system, BlinkMacSystemFont, 'Segoe UI',
        'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue',
        Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',
        'Segoe UI Symbol';
    font-size: 14px;
    font-variant: tabular-nums;
    line-height: 1.5;
    color: rgba(0, 0, 0, 0.65);
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    list-style: none;
    position: relative;
    width: 95%;
}

table.border thead {
    width: 98%;
}

table.border thead tr :nth-child(1) {
    width: 5%;
}

table.border thead tr :nth-child(2) {
    width: 40%;
}

table.border thead tr :nth-child(3) {
    width: 40%;
}

table.border tr th {
    border: 1px solid rgb(221, 224, 241);
    text-align: center;
    font-weight: bold;
    height: 43px;
    vertical-align: middle;
}

table.border tr td {
    background: #fafafa;
    border: 1px solid rgb(221, 224, 241);
    text-align: center;
}

table .gridtable td {
    padding: 8px;
    background-color: #ffffff;

    .ant-form-item {
        margin: 0;
    }
}

.table-code {
    display: flex;
    justify-content: space-between;
    position: relative;

    div:nth-child(1) {
        width: 100%;
    }

    div:nth-child(2) {
        vertical-align: middle;
        box-sizing: border-box;

        ul {
            list-style: none;
            // padding-left: 10px;
            padding-top: 43px;
            box-sizing: border-box;

            li {
                -webkit-transition: all 0.2s;
                transition: all 0.2s;
                height: 40px;
                line-height: 40px;

                span {
                    display: inline-block;
                    background: #f06666;
                    width: 24px;
                    height: 24px;
                    line-height: 27px;
                    border-radius: 50%;
                    text-align: center;
                    cursor: pointer;

                    &:hover {
                        background: red;
                    }
                }

                i {
                    font-size: 20px;
                    color: #fff;
                }
            }
        }
    }
}

.Row {
    padding: 15px 0px;
    transition: all 0.2s;
    text-align: center;

    span {
        cursor: pointer;
    }

    div:nth-child(2) span {
        border-radius: 50px;
        display: inline-block;
        width: 100px;
        background: rgb(62, 119, 216);
        color: #fff;
        padding: 2px;

        &:hover {
            opacity: 0.8;
        }

        i {
            font-size: 17px;
        }
    }

    div:nth-child(3) span {
        border-radius: 50px;
        display: inline-block;
        background: rgb(62, 119, 216);
        color: #fff;
        padding: 2px;
        width: 80px;

        &:hover {
            opacity: 0.8;
        }
    }
}

.ant-form-item-control {
    line-height: 32.9999px;
    position: relative;
    zoom: 1;
}

.ant-form-item {
    margin: 0;
}

// .ulLi {
//   -webkit-transition: all 0.2s;
//   transition: all 0.2s;
//   height: 40px;
//   line-height: 56px;
//   /* margin-right: 16px; */
//   padding-right: 15px;
// }
</style>
