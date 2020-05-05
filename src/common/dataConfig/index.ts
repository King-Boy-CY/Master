// 下拉框通用返回值
interface selectDataConfig {
    code?:number,
    data?:String[] | Array<Object> | String | Number | Number[],
    msg?:string,
    url?:any,
    baseURL?:any
}
export {
    selectDataConfig
}