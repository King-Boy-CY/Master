
interface Destinations {
    code?:number,
    data?:String[],
    msg?:String
}
interface Columns {
    Array:Array<columnsArray>
}
interface columnsArray {
    type?:String,
    width?:Number,
    align?:String,
    title?:String,
    dataIndex?:String,
    key?:Number|String,
    children?:Array<columnsChildren>
}
interface columnsChildren {
    title:String,
    dataIndex:String,
    width?:Number,
    key:String|Number,
    render?:(a:any,b:Object)=>void
}
interface ratingDataSet {
    Tips:string,
    disabled:boolean
}
export {
    Destinations,
    Columns,
    ratingDataSet
}