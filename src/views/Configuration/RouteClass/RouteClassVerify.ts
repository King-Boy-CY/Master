
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
    span?: Number,
    colSpan?: Number,
    options?: Array<formOptions> | null
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

/**Add-Edit 属性 */
interface BaseInfoFormOptions {
    Array: Array<baseInfoFormOptionsArray>
}
interface baseInfoFormOptionsArray {
    Tips?: String,
    decorator?: String,
    required?: Boolean,
    type?: String,
    disabled?: Boolean,
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

/**操作栏 */
interface Formscreening {
    Array: Array<formscreeningArray>
}
interface formscreeningArray {
    name?: String,
    icon?: String,
    index?: Number,
    disabled?: Boolean,
    tips?: String,
    style?: Array<formscreeningStyle>
}
interface formscreeningStyle {
    color?: String,
    borderColor?: String
}

export {Columns,FormOptions,Formscreening,BaseInfoFormOptions}