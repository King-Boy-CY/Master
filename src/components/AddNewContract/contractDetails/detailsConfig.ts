// 获取关联合同变量的声明
interface getConfig {
    params: paramsConfig,
}
// get params 下的传入的参数声明
interface paramsConfig {
    accountName: String,
    serviceNameList: String[] | String,
    contractName: String,
}
// 表单列表
interface formConfig {
    Tips: string,
    name: string,
    required: boolean,
    type: string,
    options?: string[] | number[] | string | number | [] | Object[] | null,
    initialValue: string | number | string[] | undefined | object,
    disabled?: boolean,
    allowClear?: boolean
}

interface formValueConfig {
    configServiceNameList: string,
    beginDate: string,
    endDate: string
}
interface concatDataConfig {
    Service?: string,
    BeginDate?: string,
    EndDate?: string,
    [key: string]: any
}
export {
    getConfig,
    formConfig,
    formValueConfig,
    concatDataConfig
}