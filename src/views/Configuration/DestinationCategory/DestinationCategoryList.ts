
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

/**RouteProduct选项 */
export const StatusOptionstest = [{
    name: "Active",
    value:1
},{
    name: "Invalid",
    value: 2
}]


/**DestinationCategory搜索 */
export const formOptions = [{
    Tips: "Category",
    required: false,
    name: "categoryName",
    type: "select",
    showSearch: true,
    span: 12,
    colSpan: 5,
    options: null
},{
    Tips: "Status",
    require : false,
    name: "status",
    type: "select",
    showSearch: true,
    span: 12,
    colSpan: 5,
    options: StatusOptionstest,
    initialValue: 1
}]

/**编辑栏 */
export const formscreening = [{
    name: "Add",
    icon: "plus-circle",
    index: 1
},{
    name: "Edit",
    icon: "form",
    index: 2,
    disabled: true,
    tips: "Records whose Operating state is 'D/E' cannot be edited;Records whose Type is Processing cannot be edited"
},{
    name: "Delete",
    icon: "delete",
    index: 3,
    disabled: true
}]

/**表格内容 */
export const columns = [{
    title: "Category",
    dataIndex: 'categoryName',
    key: "categoryName",
    sorter: (a, b) => {
        var stringA = a.categoryName.toUpperCase();
        var stringB = b.categoryName.toUpperCase();
        if (stringA < stringB) {
            return -1;
        }
        if (stringA > stringB) {
            return 1;
        }
        return 0;
    }
},{
    title: "Status",
    dataIndex: "status",
    key: "status",
    sorter: (a, b) => a.status - b.status,
    customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'status', StatusOptionstest)
},{
    title: "Remark",
    dataIndex: "remark",
    key: "remark"
},{
    title: "Modified by",
    dataIndex: "modifiedBy",
    key: "modifiedBy"
},{
    title: "Last modified",
    dataIndex: "lastModified",
    key: "lastModified"
}]

/**Add属性 */
export const baseInfoFormOptions = [{
    Tips: "Category",
    decorator: "categoryName",
    required: true,
    type: "input",
    options: null,
    span: 12,
    colSpan: 3,
    disabled: false
},{
    Tips: "Status",
    decorator: "status",
    required: false,
    type: "select",
    options: StatusOptionstest,
    span: 12,
    colSpan: 3
},{
    Tips: "Remark",
    decorator: "remark",
    required: false,
    type: "textarea",
    isAlign: true,
    span: 24,
    labelSpan: 4
}]
