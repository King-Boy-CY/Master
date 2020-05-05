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

export const NeedRoutingSuggestion = [{
    name: "NO",
    value: 0
},{
    name: "YES",
    value: 1
}]

export const ServiceOptions = [{
    name: "IDD"
},{
    name: "ISDN"
},{
    name: "Analog"
},{
    name: "IPLC"
}]

export const RouteProductservice = [{
    name: "real",
    value: 1
},{
    name: "virtual",
    value: 2
}]

export const DestTypeOptions = [{
    name: "Mobile",
    value: 1
},{
    name: "Fixed",
    value: 2
}]


/**搜索内容 */
export const formOptions = [{
    Tips: "Route product",
    require : false,
    name: "routeProductName",
    type: "select",
    showSearch: true,
    filterOption: true,
    options: []
},{
    Tips: "Destination",
    require : false,
    name: "destinationName",
    type: "select",
    showSearch: true,
    filterOption:"filterOption",
    autoClearSearchValue:true,
    options: []
},{
    Tips: "Status",
    require : false,
    name: "status",
    type: "select",
    showSearch: true,
    options: StatusOptionstest
},{
    Tips: "Need Routing Suggestion",
    require : false,
    name: "isNeedRoutingSuggestion",
    type: "select",
    showSearch: true,
    options: NeedRoutingSuggestion
},{
    Tips: "Effective date",
    require: false,
    name: "effectiveDate",
    type: "picker",
    options: null,
},{
    Tips: "to",
    require: false,
    name: "effectiveDateTo",
    type: "picker",
    options: null,
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
    name: "View time band",
    icon: "eye",
    index: 3,
    disabled: true
},{
    name: "Delete",
    icon: "delete",
    index: 4,
    disabled: true
},{
    name: "Export",
    icon: "export",
    index: 5,
    disabled: true
}]

/**表格内容 */
export const columns = [{
    title: "Route product",
    dataIndex: "routeProductName",
    key: "routeProductName",
    sorter: (a, b) => {
        var stringA = a.routeProductName.toUpperCase();
        var stringB = b.routeProductName.toUpperCase();
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
    sorter: (a, b) => a.status.length - b.status.length,
    customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'status', StatusOptionstest)
},{
    title: "Destination",
    dataIndex: "destinationName",
    key: "destinationName"
},{
    title: "Serivce",
    dataIndex: "serviceName",
    key: "serviceName"
},{
    title: "Time band",
    dataIndex: "refTimeBandName",
    key: "refTimeBandName"
},{
    title: "Need routing suggestion",
    dataIndex: "isNeedRoutingSuggestion",
    key: "isNeedRoutingSuggestion",
    customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'isNeedRoutingSuggestion', NeedRoutingSuggestion)
},{
    title: "Begin date",
    dataIndex: "beginDate",
    key: "beginDate"
},{
    title: "End date",
    dataIndex: "endDate",
    key: "endDate"
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

/**Add 属性 */
export const baseInfoFormOptions = [{
    Tips: "Route product",
    decorator: "routeProductName",
    required: true,
    type: "input",
    options: null
},{
    Tips: "Status",
    decorator: "status",
    required: true,
    type: "select",
    options: StatusOptionstest,
    initialValue: 1
},{
    Tips: "Destinations",
    decorator: "destinationName",
    required: true,
    type: "child",
    options: null,
    initialValue: ""
},{
    Tips: "Service",
    decorator: "serviceName",
    required: true,
    type: "child",
    options: null,
    initialValue: ""
},{
    Tips: "Time band",
    decorator: "refTimeBandName",
    required: true,
    type: "child",
    options: null,
    initialValue: ""
},{
    Tips: "Need Routing Suggestion",
    decorator: "isNeedRoutingSuggestion",
    required: true,
    type: "select",
    options: NeedRoutingSuggestion
},{
    Tips: "Begin date",
    decorator: "beginDate",
    required: true,
    type: "picker",
    options: null
},{
    Tips: "End date",
    decorator: "endDate",
    required: true,
    type: "picker",
    options: null,
    initialValue: "2099-12-31"
},{
    Tips: "Remark",
    decorator: "remark",
    require: false,
    type: "textarea",
    span: 24,
    labelSpan: 5
}]

/**Service表头 */
export const serivceColumns = [{
    title: "Serivce",
    dataIndex: "serviceName",
    key: "serviceName"
},{
    title: "Type",
    dataIndex: "serviceType",
    key: "type",
    customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'service', RouteProductservice)
},{
    title: "Created data",
    dataIndex: "createdData",
    key: "createdData"
},{
    title: "Created by",
    dataIndex: "createdBy",
    key: "createdBy"
},{
    title: "Modified by",
    dataIndex: "modifiedBy",
    key: "modifiedBy"
},{
    title: "Last modified",
    dataIndex: "lastModified",
    key: "lastModified"
}]

/**Timeband搜索 */
export const timebandformOptions = [{
    Tips: "Time band",
    require: false,
    name: "timeBandName",
    type: "input",
    showSearch: true,
    span: 12,
    colSpan: 5,
    options: null
}]

/**Timeband表格 */
export const timebandColumns = [{
    title: "Time band",
    dataIndex: "timeBandName",
    key: "timeBandName"
},{
    title: "Year",
    dataIndex: "year",
    key: "year"
},{
    title: "Month",
    dataIndex: "month",
    key: "month"
},{
    title: "Days",
    dataIndex: "days",
    key: "days"
},{
    title: "Weekday",
    dataIndex: "weekday",
    key: "weekday"
},{
    title: "From",
    dataIndex: "from",
    key: "from"
},{
    title: "To",
    dataIndex: "to",
    key: "to"
}]

/**Destination搜索 */
export const DestinationformOptions = [{
    Tips: "Destination",
    required: false,
    name: "destination",
    type: "select",
    showSearch: true,
    span: 20,
    colSpan: 7,
    options: null
},{
    Tips: "Dest.Type",
    required: false,
    name: "destinationType",
    type: "select",
    showSearch: true,
    span: 20,
    colSpan: 7,
    options: DestTypeOptions
},{
    Tips: "Country name",
    required: false,
    name: "countryName",
    type: "select",
    showSearch: true,
    span: 20,
    colSpan: 7,
    options: null
},{
    Tips: "Category",
    required: false,
    name: "category",
    type: "select",
    showSearch: true,
    span: 20,
    colSpan: 7,
    options: null
}]

/**Destination表格 */
export const DestinationColumns = [{
    title: "Destination",
    dataIndex: "name",
    key: "name"
}]

/**View Time band属性 */
export const ViewTimebandformOptions = [{
    Tips: "Time band",
    required: false,
    disabled: true,
    name: "timeBandName",
    type: "input",
    span: 12,
    colSpan: 3
},{
    Tips: "Year",
    required: false,
    disabled: true,
    name: "year",
    type: "input",
    span: 12,
    colSpan: 3
},{
    Tips: "Month",
    required: false,
    disabled: true,
    name: "month",
    type: "input",
    span: 12,
    colSpan: 3
},{
    Tips: "Days",
    required: false,
    disabled: true,
    name: "days",
    type: "input",
    span: 12,
    colSpan: 3
},{
    Tips: "Weekday",
    required: false,
    disabled: true,
    name: "weekday",
    type: "input",
    span: 12,
    colSpan: 3
},{
    Tips: "From",
    required: false,
    disabled: true,
    name: "from",
    type: "input",
    span: 12,
    colSpan: 3
},{
    Tips: "To",
    required: false,
    disabled: true,
    name: "to",
    type: "input",
    span: 12,
    colSpan: 3
}]