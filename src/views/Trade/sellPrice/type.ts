import { Moment } from 'moment';

interface formoptions {
    Tips: string,
    name: string,
    required: boolean,
    type: string,
    initialValue?: string | number | object,
    showSearch?: boolean,
    options?: string[] | object
}
interface columns {
    title: string,
    dataIndex: string,
    key: string
}
interface tableBtn {
    name: string,
    icon: string,
    index: number,
    disabled: boolean
}
interface tableDataConfig {
    [k: string]: string | number
}
interface apiObjConfig {
    [k: string]: string[] | object[] | Promise<promiseConfig> | Moment[] | string
}
interface promiseConfig {
    refInDestinationName: string[]
}
interface spitDateType {
    data?: object,
    format?: string,
    formData: any,
    field?: string[] | object | any
}
interface dateStatusType {
    data: Moment[],
    formData: any,
    fns?: Function[],
    field?: any,
    format?: string,
    disabledKey: number[]
}
interface stateHandlingType {
    formData: any,
    fns: Function[] | any,
    field: any,
    disabledKey: number[],
    format: string,
    data?:Moment[] | undefined
}
interface expDataType {
    data: any,
    fns: Function[],
    field?: any
}
interface expExcelType {
    fn: Function,
    data: object,
    expModule: string
}
interface getSellPricePageListType {
    data: object,
    currPage?: number,
    pageSize?: number,
    fn: Function,
    backPaginationObj?: object,
    selectedBtn?: any
}
interface pageFunType {
    data: any,
    backPage: object
}
interface sortFunType {
    columnKey: string | number,
    field: string,
    order: string,
    column: {
        dataIndex: string | number,
        key: string | number,
        sorter: boolean | Function,
        title: string
    }
}
interface getPageFucType {
    page?: number,
    pageSize?: number,
    sortField?: string | number,
    sortMode?: string | number
}
export {
    formoptions,
    columns,
    tableBtn,
    tableDataConfig,
    apiObjConfig,
    spitDateType,
    dateStatusType,
    expDataType,
    stateHandlingType,
    expExcelType,
    getSellPricePageListType,
    pageFunType,
    sortFunType,
    getPageFucType
}