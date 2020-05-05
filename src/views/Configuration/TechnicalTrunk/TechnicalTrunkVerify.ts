/**搜索 */
interface FormOptions {
    Array: Array<formOptionsArray>
}
interface formOptionsArray {
    Tips: String,
    require: Boolean,
    name: String,
    type: String,
    showSearch: Boolean,
    span?: Number,
    initialValue?: Number | String,
    options?: Array<formOptions> | null
}
interface formOptions {
    name?: String,
    value?: Number
}

interface Columns {
    Array: Array<columnsArray>
}
interface columnsArray {
    title: String,
    dataIndex: String,
    key: String,
    sorter?: (a,b)=>void,
    customRender?: (a:any,b:any,c:any)=>void

}

export {
    FormOptions,
    Columns
}