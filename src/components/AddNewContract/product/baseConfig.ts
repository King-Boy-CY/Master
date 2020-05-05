// 传入参数
interface baseCycle {
    params:baseParams
}
// get params 的传入参数变量声明
interface baseParams {
    direction:Number,
    productName:String,
    endDate:String
}
// baseData 返回值的变量声明
interface baseData {
    code?:number,
    data?:String[],
    msg?:String,
    destinationValue?:Object
}
export {
    baseCycle,
    baseData
}