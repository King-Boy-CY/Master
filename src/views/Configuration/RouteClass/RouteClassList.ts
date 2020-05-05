
const renderContent = (value: any, row: any, index: any, dataIndex: any, options ? : any) => {
    const obj = {
        children: value,
        attrs: {
            colSpan: 1,
            rowSpan: 1
        },
    };

    if (options && options instanceof Array) {
        const find = options.find((item: any) => item.value === value)
        if (find) {
            obj.children = find.name
        }
    }
    return obj;
}


/**Status选项 */
export const statusOptionstest = [{
    name: "Active",
    value: 1
},
{
    name: "Invalid",
    value: 2
}];


/**高级搜索 */
export const formOptions = [{
    Tips: "Route class",
    required: false,
    name: "routeClassName",
    type: "select",
    showSearch: true,
    span: 12,
    colSpan: 5,
    options: null
},
{
    Tips: "Status",
    required: false,
    name: "status",
    type: "select",
    span: 12,
    colSpan: 5,
    options: statusOptionstest
}];


/**操作栏 */
export const formscreening = [{
    name: "Add",
    icon: "plus-circle",
    index: 1,
},
{
    name: "Edit",
    icon: "form",
    index: 2,
    disabled: true,
    tips: "Records whose Operating state is 'D/E' cannot be edited;Records whose Type is Processing cannot be edited",
},
{
    name: "Delete",
    icon: "delete",
    index: 3,
    disabled: true
},
{
    name: "Export",
    icon: "export",
    index: 7,
    disabled: true
}];


/**表格内容 */
export const columns =  [{
    title: "Route class",
    dataIndex: "routeClassName",
    key: "routeClassName",
    sorter: (a, b) => {
        var stringA = a.routeClassName.toUpperCase();
        var stringB = b.routeClassName.toUpperCase();
        if (stringA < stringB) {
            return -1;
        }
        if (stringA > stringB) {
            return 1;
        }
        return 0;
    }
},
{
    title: "Description",
    dataIndex: "description",
    key: "description"
},
{
    title: "Status",
    dataIndex: "status",
    key: "status",
    sorter: (a, b) => a.status.length - b.status.length,
    customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'status', statusOptionstest)
},
{
    title: "Remark",
    dataIndex: "remark",
    key: "remark"
},
{
    title: "Modified By",
    dataIndex: "modifiedBy",
    key: "modifiedBy"
},
{
    title: "Last modified",
    dataIndex: "lastModified",
    key: "lastModified"
}];


/**add 属性 */
export const baseInfoFormOptions = [{
    Tips: "Route class",
    decorator: "routeClassName",
    required: true,
    type: "input",
    options: null,
    span: 12,
    isAlign: true
},
{
    Tips: "Status",
    decorator: "status",
    required: true,
    type: "select",
    options: statusOptionstest,
    span: 12,
    isAlign: true,
    initialValue: 1
},
{
    Tips: "Description",
    decorator: "description",
    required: false,
    type: "textarea",
    isAlign: true,
    span: 24,
    labelSpan: 4,
    wrapperSpan: 19,
    initialValue: "More details about route class"
},
{
    Tips: "Remark",
    decorator: "remark",
    required: false,
    type: "textarea",
    isAlign: true,
    span: 24,
    labelSpan: 4,
    wrapperSpan: 19
}];

/**edit 属性 */
export const editbaseInfoFormOptions = [{
    Tips: "Route class",
    decorator: "routeClassName",
    required: true,
    type: "input",
    options: null,
    span: 12,
    isAlign: true,
    initialValue: ""
},
{
    Tips: "Status",
    decorator: "status",
    required: true,
    type: "select",
    options: statusOptionstest,
    span: 12,
    isAlign: true,
    initialValue: ""
},
{
    Tips: "Description",
    decorator: "description",
    required: false,
    type: "textarea",
    isAlign: true,
    span: 24,
    labelSpan: 4,
    wrapperSpan: 19,
    initialValue: ""
},
{
    Tips: "Remark",
    decorator: "remark",
    required: false,
    type: "textarea",
    isAlign: true,
    span: 24,
    labelSpan: 4,
    wrapperSpan: 19,
    initialValue: ""
}];