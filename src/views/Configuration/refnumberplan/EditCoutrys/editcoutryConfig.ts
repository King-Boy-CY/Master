// 表头下的传入的参数声明
interface ExchangeRates {
    title: string,
    dataIndex: string,
    key: string,
    width: number,
    sorter?:Function,
}
// 表格的传入数据参数声明
interface formOptionsConfigs {
    Tips: string,
    name: string,
    required: boolean,
    showSearch?: boolean,
    type: string,
    filterOption?:boolean,
    initialValue?: Object | String,
    span: number,
    colSpan: number,
    options?: null,
   
}

export { ExchangeRates,formOptionsConfigs}