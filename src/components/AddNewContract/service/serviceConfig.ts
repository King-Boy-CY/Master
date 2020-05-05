interface serverConfig {
    columns: Array<columnsConfig>,
    data: Array<dataConfig>
}
// 表格title
interface columnsConfig {
    title: string,
    dataIndex: string,
    key?: string | number,
    dataType?: string,
    require?: boolean,
    width?: string,
    sorter?: (a: any, b: any) => void
}
// 表格数据
interface dataConfig {
    key: string | number,
    Service: typeConfig,
    Direction: typeConfig,
    Currency: typeConfig,
    CLi: typeConfig
}
interface typeConfig {
    type:string,
    decorator:string,
    options:null | object | string[],
    initialValue?:string | undefined,
    disabled?:boolean
}
// interface directionConfig {

// }
// interface currencyConfig {

// }
// interface cliConfig {

// }
export {
    serverConfig
}