// 表头下的传入的参数声明
interface Currencys {
    title: string,
    dataIndex: string,
    key: string,
    width?: number
}
// 表格的传入数据参数声明
interface formOptionsConfigs {
    Tips: string,
    name: string,
    required: boolean,
    showSearch?: boolean,
    type: string,
    startwithOptions?:boolean,
    initialValue?: string,
    span: number,
    colSpan: number,
    options?: null,
}

export { Currencys,formOptionsConfigs}