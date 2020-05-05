interface cycleDataConfig {
    accountName:String,
    contractCycleBOList:Array<contractData>
}
interface contractData {
    direction:Number | false,
    cycleName:String,
    configServiceName:String,
    beginDate:String,
    endDate:String
}
export {
    cycleDataConfig
}