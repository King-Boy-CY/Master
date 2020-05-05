<template>
<div>
    <Table-input :inputcolumns='inputcolumns' :inputdata='inputdata' border :addData="Newdata" 
    :newAdd="contractIndex !== 2" :initData="initData" @addChange="addData" @deleteChange="dele" @success="success" @sourcesUpdata="sourcesUpdata" ref="TableInput">
    </Table-input>
</div>
</template>

<script lang="ts">
import Vue from 'vue'
import {
    Component
} from 'vue-property-decorator'
import {
    State,
    Mutation
} from 'vuex-class'
// Api 请求
import {
    getServiceCurrencys
} from '@/api/index'
// 通用下拉框返回值
import {
    selectDataConfig
} from '@/common/dataConfig/index'
import {
    direction
} from '@/filter/index'
// 当前页面传入参数声明
import { serverConfig } from './serviceConfig'

// 模块通用参数声明
import { mutationsConfig,editConfig, stateConfig } from '../product/publicParameter/publicConfig'
// 全局通用参数声明
import { refsConfig } from '@/assets/ts/config.d'
@Component({
    components: {
        TableInput: () => import('@/common/TableInput/index.vue')
    },
})
export default class cycle extends Vue {
    @State('ContractObject') ContractDetails: stateConfig['ContractObject'] | any
    @Mutation('mutionService') mutionService: mutationsConfig['mutionService'] | any
    @Mutation('mutioServictFilter') mutioServictFilter: mutationsConfig['mutioServictFilter'] | any
    @Mutation('mutionServiceTest') mutionServiceTest: mutationsConfig['mutionServiceTest'] | any
    @State('contractData') contractData: stateConfig['ContractObject'] | any
    @State('editData') editData: editConfig | any
    @State('contractIndex') contractIndex: stateConfig['contractIndex'] | any
    @State('closeModel') closeModel: any
    public $refs!:refsConfig
    private initData: serverConfig['data'] = [] // 用于数据初始化
    private serviceFilterObj: any
    private index: number = new Date().getTime();
    private Newdata: any[] = [];
    private Service: any = {}
    public inputcolumns: serverConfig['columns'] = [{
            title: 'No .',
            dataIndex: 'No',
            key: 'No'
        },
        {
            title: 'Service',
            dataIndex: 'Service',
            dataType: 'select',
            require: true,
            width: '24%'
            // sorter: (a:any, b:any) => a.age - b.age -> 排序声明函数
        },
        {
            title: 'Direction',
            dataIndex: 'Direction',
            dataType: 'select',
            require: true,
            width: '24%'
            // sorter: (a:any, b:any) => a.age - b.age -> 排序声明函数
        },
        {
            title: 'Currency',
            dataIndex: 'Currency',
            dataType: 'picker',
            require: true,
            width: '24%'
        },
        {
            title: 'CLI',
            dataIndex: 'CLi',
            dataType: 'picker',
            require: false,
            width: '24%'
        }
    ]
    public inputdata: serverConfig['data'] = [{
        key: new Date().getTime(),
        Service: {
            type: 'select',
            decorator: 'Service',
            options: null
        },
        Direction: {
            type: 'select',
            decorator: 'Direction',
            options: [{
                    name: "Inbound"
                },
                {
                    name: 'Outbound'
                },
                {
                    name: 'Bilateral'
                },
            ]
        },
        Currency: {
            type: 'select',
            decorator: 'Currency',
            initialValue: 'USD',
            options: null
        },
        CLi: {
            type: 'select',
            decorator: 'CLi',
            initialValue: 'Yes',
            options: [{
                    name: 'YES'
                },
                {
                    name: 'NO'
                },

            ]
        },
    }];
    /* ADD 数据生成 */
    public actions():object[] {
        const arr:object[] = [];
        this.index++
        const actions = new Map([
            [1, []],
            [2, ['select', `Service${this.index}`, !!this.ContractDetails && this.ContractDetails.Service]],
            [3, ['select', `Direction${this.index}`, [{
                    name: "Inbound"
                },
                {
                    name: 'Outbound'
                },
                {
                    name: 'Bilateral'
                },
            ]]],
            [4, ['select', `Currency${this.index}`, this.inputdata[0]['Currency']['options'], 'USD']],
            [5, ['select', `CLi${this.index}`, [{
                    name: 'YES'
                },
                {
                    name: 'NO'
                },

            ], 'Yes']]

        ])
        for (let index = 1; index < actions.size + 1; index++) {
            const action:any = actions.get(index);
            arr.push({
                type: action[0],
                decorator: action[1],
                options: action[2],
                initialValue: action[3] || ''
            });
        }
        return arr
    }
    // checkErrorTips
    public async created() {
        /* 校验本页面 */
        Vue.prototype.getService = () => {
            return this.saveData();
        }
        Vue.prototype.checkService = () => {
            return this.checkService();
        }
        let currencyOptions:selectDataConfig['data'] = []
        await getServiceCurrencys().then((res: selectDataConfig) => {
            if (res.data) {
                this.inputdata[0]['Currency']['options'] = res.data
                currencyOptions = res.data
            }
            
        }).catch((err: string) => {
            this.addData()
        })
        if (this.contractIndex === 1) {
            this.addData()
        } else {
            if (this.contractIndex === 2 && Object.keys(this.editData).length > 1) {
                let serviceList = this.editData.serviceList
                let inputdata: serverConfig['data'] = []
                for (let i = 0; i < serviceList.length; i++) {
                    let item = serviceList[i]
                    inputdata[i] = {
                        key: i,
                        Service: {
                            type: 'select',
                            decorator: 'Service',
                            options: null,//[item.configServiceName],
                            initialValue: item.configServiceName,
                            disabled: true
                        },
                        Direction: {
                            type: 'select',
                            decorator: 'Direction',
                            options: null,//[direction(item.direction)],
                            initialValue: direction(item.direction),
                            disabled: true
                        },
                        Currency: {
                            type: 'select',
                            decorator: 'Currency',
                            initialValue: item.currencyType,
                            options: currencyOptions
                        },
                        CLi: {
                            type: 'select',
                            decorator: 'CLi',
                            initialValue: item.isCli === 1 ? 'Yes' : 'No',
                            options: [{
                                    name: 'Yes'
                                },
                                {
                                    name: 'No'
                                },
                            ]
                        },
                    }
                }
                this.inputdata = inputdata
                this.initData = inputdata
                // this.$nextTick(() => {
                //     this.$refs.TableInput && this.$refs.TableInput.initDataAndColums(inputdata)
                // })
            }
        }

    }
    // add数据
    public addData() {
        this.Newdata = [this.actions()];
    }
    public dele() {
        this.index--;
    }
    /* 表格输入框 校验成功触发 */
    private val: any
    private values: any

    private goNoNext: boolean = true
    public checkErrorTips(title: string, content: string) {
        return this.$error({
            title,
            content
        });
    }
    public processingData(val: any) {
      try {
            console.log(val,'val');

        this.goNoNext = true
        // console.log(val);
        this.val = val
        let valService: any = []
        let values = val;
        let len = values.length;
        let map: any = {};
        let dest: any = [];
        for (let i = 0; i < values.length; i++) {
            valService.push(values[i].Service)
            let ai = values[i];
            if (!map[ai.Service]) {
                dest.push({
                    No: ai.No,
                    Service: ai.Service,
                    Direction: ai.Direction,
                    Currency: ai.Currency,
                    CLi: ai.CLi,
                    data: [ai]
                });
                map[ai.Service] = ai;
            } else {
                for (let j = 0; j < dest.length; j++) {
                    let dj = dest[j];
                    if (dj.Service == ai.Service) {
                        dj.data.push(ai);
                        break;
                    }
                }
            }
        }
        console.log('valService',valService);
        
        let a = valService.sort((a: any, b: any) => a.localeCompare(b))
        
        let setValService = Array.from(new Set(a))
        console.log('a',a,'setValService',setValService);
        console.log('this.ContractDetails',this.ContractDetails);
        
        // console.log(setValService);

        let sortSet = this.ContractDetails.Service.sort((a: any, b: any) => a.localeCompare(b))
        if (setValService.join('') !== sortSet.join('')) {
            // this.goNoNext=false
            return this.checkErrorTips('Service', 'service不完整')
        }
        // console.log(map);
        // console.log(dest);
        let enumeration: any = []
        dest.forEach((elem: any, index: number) => {
            enumeration.push(elem.data);
        });
        // console.log(enumeration);
        var result: any = []
        for (var r = 0; r < enumeration.length; r++) {
            var Services:any = [],
                Directions:any = [],
                Cycles:any = [],
                beginDates:any = [],
                EndDates:any = []
            var temp = enumeration[r]
            for (var j = 0; j < temp.length; j++) {
                var tempj = temp[j]
                Services.push(tempj.Service)
                Directions.push(tempj.Direction)
                Cycles.push(tempj.Cycle)
                beginDates.push(tempj.beginDate)
                EndDates.push(tempj.EndDate)
            }
            result.push({
                'index': r,
                'Service': Services,
                'Direction': Directions,
                'Cycle': Cycles,
                'beginDate': beginDates,
                'EndDate': EndDates
            })
        }
        // console.log(result);
        var Direction:any = []
        for (var i = 0; i < result.length; i++) {
            Direction.push(result[i].Direction)
        }
        var setDirection: any = []
        /**ddddd */
        let cycles: any = {}
        var newMsg = new Map()
        Direction.forEach((item: any, i: number) => {
            setDirection = Array.from(new Set(item))
            if (setDirection.length == 1 && item.length > 1) {
                if (item !== setDirection) {
                    // console.log(item);
                    // console.log(setDirection);
                    this.goNoNext = false
                    return this.checkErrorTips('Service', '同一个业务不能重复')

                }
            } else if (setDirection.length === 3) {
                this.goNoNext = false
                return this.checkErrorTips('Service', '不能同时存在Inbound/0utbound和Bilateral')

            } else if (setDirection.length === 2 && setDirection.join('').indexOf('Bilateral') !== -1) {
                this.goNoNext = false
                return this.checkErrorTips('Service', '业务不能选择Bilateral后又选择单向')

            }
            let direcs: any = [],
                sers: any = [],
                cycle: any = {}
            //console.log('校验成功', setDirection)
            val.forEach((item: any, index: number) => {
                direcs.push(item.Direction)
                this.Directions = [].concat(direcs)
                sers.push(item.Service)
                this.Services = [].concat(sers)
            })
            cycle.Direction = direcs
            cycle.Service = sers
            let direc: any = []
            let ser: any = []
            for (let key of cycle.Direction) {
                direc.push(key)
            }
            for (let key of cycle.Service) {
                ser.push(key)
            }
            // console.log(direc);
            // console.log(ser);

            let a: any = 0
            for (var i = 0; i < ser.length; i++) {
                newMsg.set(`${ser[i]}_${direc[i]}`, direc[i])
            }
            newMsg.forEach((value: any, key: any, map) => {
                // console.log(key, value);
            })

            cycles.Direction = direc
            cycles.Service = ser
            // console.log(this.goNoNext);

        })
        if (this.goNoNext) {
            // console.log(`success services`);
            // this.goNoNext=true
            this.values = cycles
            this.serviceFilterObj = newMsg
        }
        return this.goNoNext
      } catch (error) {
          console.log('error',error);
          
      }
    }
    public success(val: any) {
        return this.processingData(val)
    }
    public saveData() {
        let tabData = this.$refs.TableInput.getData()
        if (!tabData) return
        let data = JSON.parse(JSON.stringify(tabData))
        this.processingData(data)
        let serviceList:any = []
        let currData = this.inputdata[0]['Currency']['options']
        for (let i = 0; i < data.length; i++) {
            serviceList.push({
                configServiceName: data[i].Service,
                currencyType: data[i].Currency, //currData.indexOf(data[i].Currency)+1,
                direction: data[i].Direction === 'Inbound' && 1 || data[i].Direction === 'Outbound' && 2 || data[i].Direction === 'Bilateral' && 3,
                isCli: data[i].CLi === 'Yes' ? 0 : 1
            })
          if (this.contractIndex === 2 ) {
                let ser = this.editData['serviceList'][i]
                ser['currencyType'] = data[i]['Currency']
                ser['isCli'] = data[i]['CLi'] === 'Yes' ? 1 : 0
          }
        }
        this.contractData['serviceList'] = serviceList
        if (this.values) {
            this.mutionService(this.values)
            this.mutioServictFilter(this.serviceFilterObj)
            this.mutionServiceTest(this.val)
        }
    }
    public async checkService() {
        let tabData = this.$refs.TableInput.getData()
        let arr = this.$refs.TableInput.getArr()
        let formData = this.$refs.TableInput.form.getFieldsValue()
        let isStatus: boolean = true
        let isStatusItem:any = []
        console.log('checkService--', tabData);

        if (!tabData) {
            for (let i = 0; i < arr.length; i++) {
                const element = arr[i];
                isStatusItem[i] = []
                for (let j = 0; j < element.name.length; j++) {
                    const elem = element.name[j];
                    if (!elem.decorator) {
                        continue
                    }
                    let mac = elem.decorator.match(/[A-Za-z]+/)
                    if (!formData[elem.decorator]) {
                        isStatusItem[i][0] = {
                            itemIndex: i + 1,
                            decorator: elem.decorator,
                            elemIndex: j,
                            elemName: mac[0]
                        }
                        isStatus = false
                        break
                    }
                }
                if (isStatusItem[i][0] && !formData[isStatusItem[i][0].decorator]) {
                    this.checkErrorTips('Service', `第${i+1}列下的第${isStatusItem[i][0]['elemIndex']}行的${isStatusItem[i][0]['elemName']}未输入`)
                    isStatus = false
                    break
                }

            }
            console.log('isStatus', isStatus);
            return isStatus
        }
        return isStatus
    }
    private Directions: any = []
    private Services: any = []
    private contractServiceArr: any
    public activated() {
        this.$nextTick(() => {
            const serve = null
            this.inputdata[0].Service.options = this.ContractDetails.Service || null
            if (this.Newdata.length) {
                this.Newdata[0][1].options = this.ContractDetails.Service || null
            }
            this.contractServiceArr = this.ContractDetails.Service
            let ref: any = this.$refs.TableInput;
            ref && ref.sourcesUpdata()
            //  console.log(this.ContractDetails)
        })
    }
    /* 数据更新触发 */
    public sourcesUpdata(values: any[]) {
        values.forEach((val: any) => {
            val.name.length && val.name.forEach((item: any) => {
                if (!!item.decorator && item.decorator.indexOf("Service") > -1 && item.options && item.options.length !== this.ContractDetails.Service.length) {
                    item.options = this.ContractDetails.Service
                }
            });
        });
    }
    public deactivated() {
        if(this.closeModel == 'contract') return
        this.saveData()
    }
}
</script>

<style>
.tab {
    border: 1px solid red;
}
</style>
