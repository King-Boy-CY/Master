
/**搜索 */
interface FormOptions {
    Array: Array<formOptionsArray>
}
interface formOptionsArray {
    Tips?: String,
    required?: Boolean,
    name?: String,
    type?: String,
    showSearch?: Boolean,
    filterOption?: Boolean,
    span?: Number,
    colSpan?: Number,
    options?: Array<formOptions> | null
}
interface formOptions {
    name?: String,
    value?: Number
}

/**编辑栏 */
interface Formscreening {
    Array: Array<formscreeningArray>
}
interface formscreeningArray {
    name?: String,
    icon?: String,
    index?: Number,
    disabled?: Boolean,
    tips?: String
}

/**表头 */
interface Columns {
    Array: Array<columnsArray>
}
interface columnsArray {
    title?: String,
    dataIndex?: String,
    key?: String | Number,
    sorter?: (a,b)=>void,
    customRender?: (a:any,b:any,c:any)=>void
}

/**Model 属性 */
interface BaseInfoFormOptions {
    Array: Array<baseInfoFormOptionsArray>
}
interface baseInfoFormOptionsArray {
    Tips?: String,
    decorator?: String,
    required?: Boolean,
    type?: String,
    disabled?: String,
    initialValue?: Number | String,
    span?: Number,
    labelSpan?: Number,
    wrapperSpan?: Number,
    options?:Array<addOptions> | null
    rules?: Array<addRules>
}
interface addOptions {
    name?: String,
    value?: Number
}
interface addRules {
    validator?: (a:any,b:any,c:any)=>void
}

export {FormOptions,Formscreening,Columns,BaseInfoFormOptions}