interface childrens {
    title: string;
    dataIndex: string;
    width?: number;
    key?: string;
    render?: Function
}

// 表头下的传入的参数声明
interface columnsConfig {
    title?: string,
    dataIndex?: string,
    key?: string,
    render?: Function
    align?: string,
    type?: string,
    width?: number,
    children?: Array<childrens>
}

// 表格的数据参数声明
interface formOptionConfig {
    Tips: string,
    name: string,
    required: boolean,
    type: string,
    span?:number,
    wrapperCol?: number | string,
    colSpan?: number,
    options?: null,
    startwithOptions?:boolean,
    fitlterOptions?:boolean,
    showSearch?: boolean,
}

export {
    columnsConfig,
    formOptionConfig
}