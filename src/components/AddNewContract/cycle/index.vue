<template>
<div>
    <Table-input :inputcolumns="inputcolumns" :inputdata="inputdata" :newAdd="contractIndex !== 2" :Check="contractIndex !== 2" :btnDisabled="contractIndex === 2" :addData="Newdata" @inputBlur="inputChange" @success="success" @sendArr="sendArr" @addChange="addData" @deleteChange="dele" border ref="TableInput" @sourcesUpdata="sourcesUpdata" />
    <div>
    </div>
    <!-- @sourcesUpdata="sourcesUpdata" -->
</div>
</template>

<script lang="ts">
import Vue from "vue";
import {
    Component
} from "vue-property-decorator";
import {
    State,
    Mutation
} from 'vuex-class'
import moment from 'moment'
// Api 请求
import {
    CheckService
} from '@/api/index'
// 通用返回值
import {
    selectDataConfig as checkConfig
} from '@/common/dataConfig/index'
import {
    direction
} from '@/filter/index'
import {
    cycleDataConfig
} from './cycleConfig'
// 全局通用参数声明
import { refsConfig } from '@/assets/ts/config.d'
@Component({
    components: {
        TableInput: resolve => require(["@/common/TableInput/index.vue"], resolve)
    }
})
export default class cycle extends Vue {
    @State('ContractObject') ContractObject: any
    @State('contractData') contractData: any
    @State('serviceFilter') serviceFilter: any //vuex 里面过滤出来一个带下标前缀的对象
    @State('ServiceObject') ServiceObject: any
    @State('serviceTest') serviceTest: any
    @State('closeModel') closeModel: any
    @State('editData') editData: any
    @State('contractIndex') contractIndex: any
    @Mutation('mutionCycle') mutionCycle: any
    public $refs:refsConfig | any
    /**Direction 下 方向重复判断  */
    private oldArr: any = []
    private newArr: any = []
    /**校验成功后保存的数据 */
    private values: any
    private Directions: any = []
    private Services: any = []
    private setServe: any
    private index: number = new Date().getTime()
    private inputcolumns: any[] = [{
            title: "No .",
            dataIndex: "No",
            key: "No",
            dataType: ""
        },
        {
            title: "Service",
            dataIndex: "Service",
            dataType: "select",
            require: true,
            width: '10%'
            // sorter: (a:any, b:any) => a.age - b.age -> 排序声明函数
        },
        {
            title: "Direction",
            dataIndex: "Direction",
            dataType: "select",
            require: true,
            width: '19%'
        },
        {
            title: "Cycle",
            dataIndex: "Cycle",
            dataType: "input",
            require: true,
            width: '19%',
            config: {
                maxLength: 6
            },
            rules: [{
                validator: (rule: any, value: any, callback: any) => {
                    if (!value) {
                        callback()
                    }
                    const pattern: RegExp = new RegExp(/^[1-9]\d*$/, "g")
                    if (!pattern.test(value)) {
                        callback('Cycle is not number')
                    } else {
                        callback()
                    }
                }
            }]
        }, {
            title: "Begin date",
            dataIndex: "BeginDate",
            dataType: "picker",
            require: true,
            width: '19%'
        }, {
            title: "End date",
            dataIndex: "EndDate",
            dataType: "picker",
            require: true,
            width: '19%'
        }
    ];
    private inputdata: any[] = [{
        key: new Date().getTime(),
        Service: {
            type: "select",
            decorator: "Service",
            options: null
        },
        Direction: {
            type: "select",
            decorator: "Direction",
            options: [{
                    name: "Inbound"
                },
                {
                    name: "Outbound"
                },
                {
                    name: "Bilateral"
                }
            ]
        },
        Cycle: {
            type: "input",
            decorator: "Cycle"
        },
        BeginDate: {
            type: "picker",
            decorator: "BeginDate"
        },
        EndDate: {
            type: "picker",
            decorator: "EndDate"
        }
    }];
    private rcvMsg: any = "";
    private cycleInner: any = [];
    /* TableInput Add */
    private Newdata: any = [];
    private goOnNext: boolean = true
    private serviceAndCycleNext: boolean = true
    /* ADD 数据生成 */
    public actions() {
        const arr: any = [];
        this.index++;
        const actions = new Map([
            [1, []],
            [
                2,
                [
                    "select",
                    `Service${this.index}`,
                    this.setServe || null
                ]
            ],
            [
                3,
                [
                    "select",
                    `Direction${this.index}`,
                    [{
                            name: "Inbound"
                        },
                        {
                            name: "Outbound"
                        },
                        {
                            name: "Bilateral"
                        }
                    ]
                ]
            ],
            [4, ["input", `Cycle${this.index}`]],
            [
                5,
                [
                    "picker",
                    `BeginDate${this.index}`,
                    [{
                            name: "CountryCode2-1"
                        },
                        {
                            name: "CountryCode2-2"
                        }
                    ]
                ]
            ],
            [
                6,
                [
                    "picker",
                    `EndDate${this.index}`,
                    [{
                            name: "Country2-1"
                        },
                        {
                            name: "Country2-2"
                        }
                    ]
                ]
            ]
        ]);
        for (let index = 1; index < actions.size + 1; index++) {
            const action: any = actions.get(index);
            arr.push({
                type: action[0],
                decorator: action[1],
                options: action[2]
            });
        }
        return arr;
    }

    //接收子组件change
    public inputChange(val: string, event ? : string) {
        let reg = /^\d{6}$/;
        if (!reg.test(val)) {
            return false
        } else {
            return true
        }
    }

    public sendArr(msg: any) {
        this.rcvMsg = msg;
    }

    /**删除 */
    public dele() {
        // this.index--;
    }
    public checkErrorTips(title: string, content: string) {
        return this.$error({
            title,
            content
        });
    }
    //日期校验函数
    /**检查所有日期开始和结束时间 */
    /**日期周期校验
     *      基本的思路，
     日期也可以当成字符串进行比较
     把开始日期，结束日期分别存进两个数组，
     并用sort排序，循环遍历数组，
     从开始时间的第二个元素去比较结束时间的第一个元素，
     如果小于，就代表时间段有交叉，直接跳出，
     不然就继续遍历，遍历结束，说明时间没有重复，可以提交。
     */
    public serverAndCycleVolidate(begin: any, over: any): boolean {
        begin.sort((a: any, b: any) => new Date(a).getTime() - new Date(b).getTime());
        over.sort((a: any, b: any) => new Date(a).getTime() - new Date(b).getTime());
        //开始时间的当天的0点
        let dateBegin: any = [],
            dateEnd: any = []
        for (let i = 0; i < begin.length; i++) {
            //结束时间的当天的0点
            const s: any = moment(moment(begin[i]).format("YYYY-MM-DD")).valueOf()
            const e: any = moment(moment(over[i]).format("YYYY-MM-DD")).valueOf()
            dateBegin.push(s)
            dateEnd.push(e)
        }

        //contractDetail页面合同开始日期
        const contractBeginDate: any = moment(moment(this.ContractObject.BeginDate).format("YYYY-MM-DD")).valueOf()

        //contractDetail页面合同结束日期
        const contractEndDate: any = moment(moment(this.ContractObject.EndDate).format("YYYY-MM-DD")).valueOf()

        if (dateBegin[0] !== contractBeginDate) {
            // this.goOnNext=false
            this.checkErrorTips('Cycle', "Cycle  check failed");
            // this.checkErrorTips('Cycle', "输入的BeginDate开始日期必须等于ContralDeatil页面的开始日期");
            // this.checkErrorTips('Cycle', "Cycle BeginDate should be equal to BeginDate of ContralDeatil"); 
            return false
        }
        if (dateEnd[dateEnd.length - 1] !== contractEndDate) {
            //  this.goOnNext=false
            this.checkErrorTips('Cycle', "Cycle  check failed");
            // this.checkErrorTips('Cycle', "输入的EndDate结束日期必须等于ContralDeatil页面的结束日期");
            return false
        }

        for (let i = 1; i < dateBegin.length; i++) {
            if (dateBegin[i] <= dateEnd[i - 1]) {
                this.goOnNext = false
                this.checkErrorTips('Cycle', "Cycle  check failed");
                // this.checkErrorTips('Cycle', "时间重复");
                return false
            } else if ((dateBegin[i] - dateEnd[i - 1]) > 86400000 || (dateBegin[i] - dateEnd[i - 1]) == 0) {
                this.goOnNext = false
                this.checkErrorTips('Cycle', "Cycle  check failed");
                // this.checkErrorTips('Cycle', "时间周期需连续,且开始日期不能为上一个结束日期");
                return false
            }
        }
        return true
    }

    //service 页面 和 cycle 页面 方向 的 缺少比对
    // public getArrDefault(arr1:any,arr2:any){
    //  return arr1.concat(arr2).filter(function(val:any,i:number,arr:any){
    //    return arr.indexOf(val) == arr.lastIndexOf(val)
    //  })
    // }
    public succesAxios(values: any, notShowCheckSuccess) {
        let codeData: cycleDataConfig = {
            accountName: this.ContractObject.accountName,
            contractCycleBOList: []
        }
        values.forEach((elem: any, index: number) => {
            codeData.contractCycleBOList.push({
                direction: elem.Direction === "Inbound" && 1 || elem.Direction === "Outbound" && 2 || elem.Direction === "Bilateral" && 3,
                cycleName: elem.Cycle,
                configServiceName: elem.Service,
                beginDate: moment(elem.BeginDate).format('YYYY-MM-DD'),
                endDate: moment(elem.EndDate).format('YYYY-MM-DD')
            })
        });
       this.contractIndex !== 2 &&  CheckService(codeData).then((res: checkConfig) => {
            if (res.code && res.code < 0) {
                this.goOnNext = false;
                return this.$error({
                    title: 'Check error',
                    content: res.msg
                })
            }
            if (!notShowCheckSuccess) {
                this.$success({
                    title: 'success',
                    content: res.msg
                })
            }
        })
        // AxiosPost('/contract/vc-contract/cycles/check', codeData).then((res: any) => {
        //     console.log(res);
        //     if (res.code < 0) {
        //         this.goOnNext = false;
        //         return this.$error({
        //             title: 'Check error',
        //             content: res.msg
        //         })
        //     }
        //     if (!notShowCheckSuccess) {
        //         this.$success({
        //             title: 'success',
        //             content: res.msg
        //         })
        //     }
        // })
    }
    //校验成功
    private repeatCycleNext: boolean = true
    private checkAllNext: boolean = true

    public success(val: any, notShowCheckSuccess ? : boolean, isNotCheck ? : boolean) {
      try {
            this.goOnNext = true;
        let values = val;
        let len = values.length;
        /**数据处理 */
        let map: any = {};
        let dest: any = [];
        for (let i = 0; i < values.length; i++) {
            let ai = values[i];
            if (!map[ai.Service]) {
                dest.push({
                    No: `${i+1}`,
                    Service: ai.Service,
                    Direction: ai.Direction,
                    Cycle: ai.Cycle,
                    BeginDate: ai.BeginDate,
                    EndDate: ai.EndDate,
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
        let enumeration: any = []
        let result: any  = []
        let Direction:any = []
        let setDirection: any = []
        dest.forEach((elem: any, index: number) => {
            enumeration.push(elem.data);
        });
        let raar: any = []
        for (let r = 0; r < enumeration.length; r++) {
            let mapDirection: any = {}
            let destDirection: any = []
            let mapCheckService: any = {}
            let checkService: any = []
            let temp = enumeration[r]
            if (enumeration[r]) {
                for (let j = 0; j < temp.length; j++) {
                    let as = temp[j]
                    if (!mapCheckService[as.Direction]) {
                        checkService.push({
                            Service: as.Service,
                            Direction: as.Direction,
                            data: [as]
                        })
                        mapCheckService[as.Direction] = as
                    } else {
                        for (let dj = 0; dj < checkService.length; dj++) {
                            let djs = checkService[dj]
                            if (djs.Direction == as.Direction) {
                                djs.data.push(as)
                            }
                        }
                    }
                    if (!mapDirection[as.Direction]) {
                        destDirection.push({
                            No: as.No,
                            Service: as.Service,
                            Direction: as.Direction,
                            Cycle: as.Cycle,
                            BeginDate: as.BeginDate,
                            EndDate: as.EndDate,
                            data: [as]
                        })
                        mapDirection[as.Direction] = as
                    } else {
                        for (let j = 0; j < destDirection.length; j++) {
                            let djs = destDirection[j];
                            if (djs.Direction == as.Direction) {
                                djs.data.push(as);
                            }
                        }
                    }
                }
            }
            let arrCycle: any = []
            checkService.forEach((item: any, i: number) => {
                let s = `${item.Service}`
                let d = `${ item.Direction}`
                let s_d = `${item.Service}_${item.Direction}`
                arrCycle[i] = [s_d, d]
            })

            raar.push(arrCycle)
            // console.log(destDirection);
            for (var i = 0; i < destDirection.length; i++) {
                let cy: any = [],
                    bgDates: any = [],
                    endDates: any = [],
                    ser: any = [],
                    direc: any = []
                let item = destDirection[i].data
                // console.log(item);

                for (var j = 0; j < item.length; j++) {
                    let value = item[j]
                    ser.push(value.Service)
                    direc.push(value.Direction)
                    bgDates.push(value.BeginDate._d)
                    endDates.push(value.EndDate._d)
                    cy.push(value.Cycle)
                    bgDates.sort()
                    endDates.sort()
                    cy.sort()
                }
                for (let c = 0; c < cy.length; c++) {
                    if (cy[c] == cy[c + 1]) {
                        this.repeatCycleNext = false
                        return this.checkErrorTips('Cycle', `Direction Cyle 重复`)
                    } else if (cy[c] !== cy[c + 1]) {
                        this.repeatCycleNext = true
                    }
                }
                /**相同service && Direction 时间连贯 校验 */
                this.repeatCycleNext = this.serverAndCycleVolidate(bgDates, endDates)
                // console.log(this.repeatCycleNext);
                if (!this.repeatCycleNext) return
            }
            let Services: any = [],
                Directions: any = [],
                Cycles: any = [],
                BeginDates: any = [],
                EndDates: any = []
            for (let j = 0; j < temp.length; j++) {
                let tempj: any = temp[j]
                Services.push(tempj.Service)
                Directions.push(tempj.Direction)
                Cycles.push(tempj.Cycle)
                BeginDates.push(tempj.BeginDate)
                EndDates.push(tempj.EndDate)
            }

            result.push({
                'index': r,
                'Service': Services,
                'Direction': Directions,
                'Cycle': Cycles,
                'BeginDate': BeginDates,
                'EndDate': EndDates
            })
        }

        let compare =this.serviceFilter
        let arrService: any = [] //Service 页面传过来，处理后的数据[[Array1],[Array2],[Array3]]
        let as = 0;
        compare.forEach(function (value: any, key: number, map: any) {            
            arrService[as] = JSON.parse(JSON.stringify([key, value]))
            as++;
        })        
        let cycleVal = raar.reduce((sums: any, item: any, index: number, arr: any) => {
            sums = sums.concat([...item])
            return sums
        }, []);
        //Cycley页面 处理后 与 arrService 对比，如果Service 页面有Bilateral 自动拆分成Inbound && Outbound
        let addArr1: any = []
        let ServFilter = arrService.map((item: any, index: number) => {
            let xx = item[0].split('_')
            if (xx[1] == 'Bilateral') {
                item[0] = xx[0] + '_Inbound'
                addArr1.push(xx[0] + '_Outbound')
            }
            return item[0]
        }).concat(addArr1).sort((a: any, b: any) => a.localeCompare(b))

        let addArr2: any = []
        let cycleFilter = cycleVal.map((item: any, index: number) => {
            let xx = item[0].split('_')
            if (xx[1] == 'Bilateral') {
                item[0] = xx[0] + '_Inbound'
                addArr2.push(xx[0] + '_Outbound')
            }
            return item[0]
        }).concat(addArr2).sort((a: any, b: any) => a.localeCompare(b))
        // console.log(ServFilter,cycleFilter);
        if (ServFilter.join(',') !== cycleFilter.join(',')) {
            if (ServFilter.length > cycleFilter.length) {
                // let difs=this.getArrDefault(ServFilter,cycleFilter)
                // console.log(difs.join(','));
                // let dif =difs.join(',').replace(/,/g,"--And--")
                // return this.checkErrorTips(`缺少Service----${dif}`);
                this.goOnNext = false
                return this.checkErrorTips('Cycle', "Cycle  check failed");
                // return this.checkErrorTips('Cycle', '缺少Service与Service不一致')
            } else {
                this.goOnNext = false
                return this.checkErrorTips('Cycle', "Cycle  check failed");
                // return this.checkErrorTips('Cycle', 'Direction与Servie页面传过来的不一致不正确')
            }
        }

        let Cycle: any = [],
            BeginDate: any = [],
            EndDate: any = [],
            Service: any = []
        for (let i = 0; i < result.length; i++) {
            Direction.push(result[i].Direction)
            Cycle.push(result[i].Cycle)
            BeginDate.push(result[i].BeginDate)
            EndDate.push(result[i].EndDate)
            Service.push(result[i].Service)
        }
        this.checkAllNext = this.checkAllDate(val)
        if (!this.checkAllNext) return

        /**方向校验 */
        Direction.forEach((item: any, i: number) => {
            setDirection = Array.from(new Set(item))
            if (setDirection.length === 3) {
                this.goOnNext = false
                return this.checkErrorTips('Cycle', "Cycle  check failed");
                // return this.checkErrorTips('Cycle', '不能同时存在inbound/outbound和Bilateral')
            } else if (setDirection.length === 2) {
                if (setDirection.join('').indexOf('Bilateral') !== -1) {
                    this.goOnNext = false
                    return this.checkErrorTips('Cycle', "Cycle  check failed");
                    // return this.checkErrorTips('Cycle', '业务不能选择Bilateral后又选择单向')
                }
            }
        })
        val.forEach((item: any) => {
            this.goOnNext = this.inputChange(item.Cycle)
            // console.log(this.goOnNext);

            if (this.goOnNext == false) {
                // this.checkErrorTips('Cycle', `cycle输入周期例如:201900 长度为6位数,且输入前四位必须与开始年份一致`);
                this.checkErrorTips('Cycle', "Cycle  check failed");
                return this.goOnNext = false
            }
        })

        if (this.goOnNext && this.serviceAndCycleNext && this.repeatCycleNext && this.checkAllNext) {
            this.goOnNext = true
            this.serviceAndCycleNext = true
            this.repeatCycleNext = true
            this.checkAllNext = true
            this.values = val;
            // console.log(`success checked`);
            !isNotCheck && this.succesAxios(val, notShowCheckSuccess)
        }
        return this.goOnNext && this.serviceAndCycleNext && this.repeatCycleNext && this.checkAllNext
      } catch (error) {
          console.log('cycle-success-error',error);
          
      }
    }

    /**Direction 下 方向重复判断 */
    public directionCheck(val: any) {
        this.oldArr.push(val)
        this.newArr = Array.from(new Set(this.oldArr))
        if (this.newArr.length == 3) {
            return this.checkErrorTips('Cycle', "Cycle  check failed");
            // return this.checkErrorTips('Cycle',
            //     `不能同时存在inbound/outbound和Bilateral`
            // )
        }
        if (this.newArr.length == 2) {
            let newArrStr = this.newArr.join('')
            if (newArrStr.indexOf('Bilateral') > -1) {
                return this.checkErrorTips('Cycle', "Cycle  check failed");
                // return this.checkErrorTips('Cycle', '业务不能选择Bilateral后又选择单向')
            }
        }
    }

    public checkAllDate(val: any) {
        let msg: boolean = true
        let values = val;
        let len = values.length;
        for (let i = 0; i < len; i++) {
            let cycle = values[i].Cycle.slice(0, 4);
            let beginYear = values[i].BeginDate._d;
            for (let j = i + 1; j <= i + 1; j++) {
                if (values[i].BeginDate._d > values[i].EndDate._d) {
                    //开始日期和结束日期校验
                    //this.goOnNext=false
                    this.checkErrorTips('Cycle', `Incorrect begin and end date`);
                    msg = false
                } else if (String(beginYear).indexOf(cycle) == -1) {
                    //cycle 校验
                    //this.goOnNext=false
                    this.checkErrorTips('Cycle',
                        `The first four digits of the Cycle value need to be consistent with the year of the entry Cycle.`
                    );
                    msg = false
                }
            }
        }
        return msg
    }

    // add数据
    public addData() {
        this.Newdata = [this.actions()];
        this.inputdata[0].Service.options = this.setServe || null
        this.Newdata[0][1].options = this.setServe || null
    }

    /* 数据更新触发 */
    public sourcesUpdata(values: any[]) {
        values.forEach((val: any) => {
            val.name.length && val.name.forEach((item: any) => {
                if (!!item.decorator && item.decorator.indexOf("Service") > -1 && item.options && item.options.length !== this.ContractObject.Service.length) {
                    item.options = this.ContractObject.Service
                }
            });
        });
    }
    activated() {
        // console.log(this.ServiceObject);
        this.setServe = Array.from(new Set(this.ServiceObject.Service))
        let ref: any = this.$refs.TableInput;
        this.addData();
        if (ref) {
            ref.sourcesUpdata && ref.sourcesUpdata()
        }
    }
    public async checkCycle() {
        let tabData = this.$refs.TableInput.getData()
        let arr = this.$refs.TableInput.getArr()
        let formData = this.$refs.TableInput.form.getFieldsValue()
        let isStatus: boolean = true
        let isStatusItem: any[] = []
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
                    this.checkErrorTips('Cycle', "Cycle  check failed");
                    // this.checkErrorTips('Cycle', `第${i+1}列下的第${isStatusItem[i][0]['elemIndex']}行的${isStatusItem[i][0]['elemName']}未输入`)
                    isStatus = false
                    break
                }

            }
            console.log('formData', formData);
            return isStatus
        }
        return isStatus
    }
    public saveData(notShowCheckSuccess ? : boolean, isNotCheck ? : boolean) {
        if (!this.$refs.TableInput) return
        let date = this.$refs.TableInput.getData()
        console.log('date',date);
        
        if (!date) return
        this.success(date, notShowCheckSuccess, isNotCheck)
        console.log('736-this.values',this.values);
        
        if (!this.goOnNext || !this.serviceAndCycleNext || !this.repeatCycleNext || !this.checkAllNext) {
            // this.$message.error(`输入信息有误,请仔细核对输入信息后再进入RatePlan页面`)
            return false
        }
        if (this.values) {
            let cycleData: any = []
            let OutboundArr: any = []
            let values = JSON.parse(JSON.stringify(this.values))
            console.log('values',values);
            console.log(this.ContractObject);
            
            let dick = values.map((item: any, index: number) => {
                console.log('item',item);
                
                item.Account = this.ContractObject.accountName
                item.Contract = this.ContractObject.ContractName
                item.key = String(index)
                if (item.Direction == 'Bilateral') {
                    item.Direction = 'Inbound'
                    OutboundArr.push(Object.assign({}, item, {
                        Direction: 'Outbound',
                        key: '1_' + index
                    }))
                }
                return item
            }).concat(OutboundArr).sort((a: any, b: any) => a.Service.localeCompare(b.Service))
            this.values.forEach((elem: any) => {
                cycleData.push({
                    beginDate: moment(elem.BeginDate).format('YYYY-MM-DD'),
                    configServiceName: elem.Service,
                    cycleName: elem.Cycle,
                    direction: elem.Direction === 'Inbound' ? 1 : elem.Direction === 'Outbound' ? 2 : 3,
                    endDate: moment(elem.EndDate).format('YYYY-MM-DD')
                })
            });
            // console.log(cycleData)
            // console.log('cycle保存数据',dick)
            this.mutionCycle(dick)
            this.contractData['cycleList'] = cycleData
        }
    }
    public deactivated() {
        this.$nextTick(() => {
            if (this.closeModel == 'contract') {
                return
            }
            console.log('closeContractModel', this.closeModel);
            this.saveData(true)
            const that: any = this
            that.getRatePlan && that.getRatePlan()
        })
    }
    public created() {
        // /* 校验本页面 */
        Vue.prototype.getCycle = (isNotCheck: boolean) => {
            return this.saveData(true, isNotCheck);
        }
        Vue.prototype.checkCycle = () => {
            return this.checkCycle()
        }
        let inputdata: any = []
        if (this.contractIndex === 2 && Object.keys(this.editData).length > 1) {
            let serviceList = this.editData.cycleList
            for (let i = 0; i < serviceList.length; i++) {

                let item = serviceList[i]
                console.log(item);

                inputdata[i] = {
                    key: 1,
                    Service: {
                        type: "select",
                        decorator: "Service",
                        options: [item.configServiceName],
                        initialValue: item.configServiceName,
                        disabled: true
                    },
                    Direction: {
                        type: "select",
                        decorator: "Direction",
                        options: [item.direction],
                        initialValue: direction(item.direction),
                        disabled: true
                    },
                    Cycle: {
                        type: "input",
                        decorator: "Cycle",
                        initialValue: item.cycleName,
                        disabled: true
                    },
                    BeginDate: {
                        type: "picker",
                        decorator: "BeginDate",
                        initialValue: moment(item.beginDate),
                        disabled: true
                    },
                    EndDate: {
                        type: "picker",
                        decorator: "EndDate",
                        initialValue: moment(item.endDate),
                        disabled: true
                    }
                }
            }
            this.inputdata = inputdata
        }
    }
}
</script>

<style>
.tab {
    border: 1px solid red;
}

.ant-calendar-picker {
    width: 100%;
}
</style>
