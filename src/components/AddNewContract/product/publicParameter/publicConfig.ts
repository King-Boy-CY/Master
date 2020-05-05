interface baseConfig {
    initialValue?: string | undefined | Number | Number[] | String[],
    Tips: String | Number | Symbol | any,
    disabled: boolean,
    required: boolean
}
interface ratingConfig {
    initialValue?: string | undefined | Number | Number[] | String[] | Object,
    Tips: symbol | String | Number | any,
    disabled: boolean,
    required: boolean,
    options?: Array<ratingOptions>
}
interface ratingOptions {
    // length: number,
    name: String,
    disabled: Boolean,
    options:object[]
}
interface ratingzoneConfig {
    initialValue?: String | undefined | undefined[] | Number | Number[] | String[],
    Tips?: symbol,
    disabled?: boolean,
    required?: boolean,
    timeBand?: any,
    CommitmentValue: any,
    inputdata: any,
    Destination: any,
    inputcolumns: Object,
    options?: Object | null
    key?: symbol | String | Number,
    message?: String,
    decorator?: String,
    name?: String,
    type?: String,
    isInsert?: boolean,
    isClear?: boolean
}
interface configuRation {
    baseData: Array<baseConfig>,
    ratingData: Array<ratingConfig>,
    ratingzoneAdd: Array<ratingzoneConfig>
}
// product 费率区
interface Destinations {
    code?: number,
    data?: String[] | [],
    msg?: String,
    destinationValue?: Object
}
// get 费率区 传入参数
interface getAixosConfig {
    params: getParamsConfig
}
interface getParamsConfig {
    productName: String,
    beginDate: String,
    endDate: String
}
// Vuex mutations 函数声明
// declare class mutationsConfig {
//     mutionContract: (value: Object) => void
//     contractData: (value: Object) => void
// }
interface mutationsConfig {
    mutionContract(): (value: Object) => void
    mutionServiceTest: (values: Array<string>) => void
    mutionService:(values:Array<string>) => void
    mutioServictFilter:(values:MapConstructor) => void
}
// Vuex state 状态声明
interface stateConfig {
    ContractObject:contractDetailConfig,
    contractIndex:number
}
// 表单 editData
interface editConfig {
    contractDetail: contractDetailConfig
}
interface contractDetailConfig {
    accountName: string,
    contractName: string,
    contractAbbrv?: string,
    configServiceNameList: string,
    relatedContract?: string,
    priority: number,
    singedDate?: string,
    beginDate: string,
    endDate: string,
    isAutoRenew: number,
    renewDate?: string
}
export {
    configuRation,
    Destinations,
    getAixosConfig,
    mutationsConfig,
    editConfig,
    stateConfig
}