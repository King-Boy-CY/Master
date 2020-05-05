// 表头下的传入的参数声明
interface columnsConfigs {
    title: string,
    dataIndex: string,
    key: string,
    width?: number,
    customRender?: Function
    sorter?:Function
}
// 表格的传入数据参数声明
interface formOptionsConfigs {
    Tips: string,
    name?: string,
    decorator?:string
    required: boolean,
    showSearch?: boolean,
    type: string,
    labelSpan?: number |string,
    disabled?:boolean,
    filterOption?:boolean,
    initialValue?: string | number,
    span: number,
    colSpan?: number,
    options?: string[] | null | Object,
}

export { columnsConfigs,formOptionsConfigs}