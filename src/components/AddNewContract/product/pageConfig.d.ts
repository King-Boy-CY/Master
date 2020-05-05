// ratingZoneadd Go timeband 表格搜索 - 高级搜索 Search
interface getDataConfig {
    params: getParamsConfig
}
interface getParamsConfig {
    timeBandName: string | undefined,
    timeFrom: string | number | undefined,
    dayTo: string | number | undefined,
    weekdayFrom: string | number | undefined,
    weekdayTo: string | number | undefined,
    timeTo: string | number | undefined,
    dayFrom: string | number | undefined,
    type: string | number | undefined
}
export {
    getDataConfig,
    getParamsConfig
}