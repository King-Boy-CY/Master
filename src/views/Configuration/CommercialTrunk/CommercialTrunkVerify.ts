
/**搜索 */
interface FormOptions {
    Array: Array<formOptionsArray>
}
interface formOptionsArray {
    Tips?: String,
    require?: Boolean,
    name?: String,
    type?: String,
    showSearch?: Boolean,
    span?: Number,
    colSpan?: Number,
    initialValue?: Number | String,
    filterOption?: Boolean,
    optinos?: Array<formOptions> | null
}
interface formOptions {
    name?: String,
    value?: Number
}

/**表格 */
interface Columns {
    Array: Array<columnsArray>
}
interface columnsArray {
    title?: String,
    dataIndex?: String,
    key?: Number | String,
    width?: Number,
    sorter?: (a,b)=>void,
    customRender?: (a:any,b:any,c:any)=>void
}