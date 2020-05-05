import { Moment } from 'moment';
export interface stateHandlingType {
    formData: any,
    fns: Function[] | any,
    field: any,
    disabledKey: number[],
    format: string,
    data?: Moment[] | undefined
}
interface promiseConfig {
    refInDestinationName: string[]
}
export interface apiObjConfig {
    [k: string]: string[] | object[] | Promise<promiseConfig> | Moment[] | string
}
export interface getFunDataType {
    fn: Function,
    index: number,
    field?: any,
    formData?: any
}
export interface expDataType {
    fns: Function[],
    field?: any,
    formData?: any
}
export interface testFormType {
    formData: any,
    generate?: any,
    isRandom?: boolean,
    length?: number
}
export interface dateStatusType {
    data: Moment[],
    formData: any,
    fns?: Function[],
    field?: any,
    format?: string,
    disabledKey: number[]
}
export interface getExpDataType{
    data: any,
    fns: Function[],
    field?: any,
    success?:Function,
    error?:Function
}
export interface expExcelType {
    fn: Function,
    data: object,
    expModule: string,
    format?:string
}