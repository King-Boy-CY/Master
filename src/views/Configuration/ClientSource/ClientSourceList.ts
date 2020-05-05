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

import {
    emailReg
} from "@/common/RegExp/number";

/**ClinetSource选项 */
export const StatusOptions = [{
    name: "Active",
    value:1
},{
    name: "Invalid",
    value: 2
}]

export const ServiceOptions = [{
    name: "IDD",
    value: 1
},{
    name: "IPLC",
    value: 2
},{
    name: "VOIP",
    value: 3
}]


/**Account选项 */
export const accountStatusOptions = [{
    name: "Active",
    value: 1
},
{
    name: "Expired",
    value: 2
}];

export const accountTypeOptions = [{
    name: 'Vendor',
    value: 1
}, {
    name: 'Client',
    value: 2
}, {
    name: 'Bilateral',
    value: 3
}];

/**Number plan选项 */
export const sourceTypeOptions = [{
    name: "Vendor",
    value: 1
},{
    name: "Client",
    value: 2
}]
export const directionOptions = [{
    name: "Inbound",
    value: 1
},{
    name: "OutBound",
    value: 2
},{
    name: "Bilateral",
    value: 3
}]

/**Exclude destination of client price list选项 */
export const ExcludedestinationinclientofferOptions = [{
    name: "YES",
    value: 0
},{
    name: "NO",
    value: 1
}]

/**搜索内容 */
export const formOptions = [{
    Tips: "Name",
    require: false,
    name: "clientName",
    type: "select",
    showSearch: true,
    span: 10,
    colSpan: 3,
    options: null
},{
    Tips: "Status",
    require : false,
    name: "status",
    type: "select",
    showSearch: true,
    span: 10,
    colSpan: 3,
    options: StatusOptions
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
},{
    name: "Export",
    icon: "export",
    index: 4,
    disabled: true
}]

/**表头 */
export const columns = [{
    title: "Name",
    dataIndex: "clientName",
    key: "clientName",
    sorter: (a, b) => {
        var stringA = a.clientName.toUpperCase();
        var stringB = b.clientName.toUpperCase();
        if (stringA < stringB) {
            return -1;
        }
        if (stringA > stringB) {
            return 1;
        }
        return 0;
    },
},{
    title: "Status",
    dataIndex: "status",
    key: "status",
    sorter: (a, b) => {
        var stringA = a.status.toUpperCase();
        var stringB = b.status.toUpperCase();
        if (stringA < stringB) {
            return -1;
        }
        if (stringA > stringB) {
            return 1;
        }
        return 0;
    },
    customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'status', StatusOptions)
},{
    title: "Agreement account",
    dataIndex: "accountList",
    key: "accountList"
},{
    title: "Service",
    dataIndex: "serviceList",
    key: "serviceList"
},{
    title: "Number plan",
    dataIndex: "numberPlanList",
    key: "numberPlanList"
},{
    title: "Currency",
    dataIndex: "currencyType",
    key: "currencyType"
},{
    title: "Reference price list",
    dataIndex: "referencePriceList",
    key: "referencePriceList"
},{
    title: "Route class",
    dataIndex: "routeClass",
    key:"routeClass"
},{
    title: "Quality commitment",
    dataIndex: "qualityCommitment",
    key: "qualityCommitment"
},{
    title: "Email",
    dataIndex: "email",
    key: "email"
},{
    title: "Time zone(UTC)",
    dataIndex: "timeZone",
    key: "timeZone"
},{
    title: "Rate increase notice period (Days)",
    dataIndex: "rateIncreaseNoticePeriond",
    key: "rateIncreaseNoticePeriond"
},{
    title: "Rate decrease notice period (Days)",
    dataIndex: "rateDecreaseNoticePeriond",
    key: "rateDecreaseNoticePeriond"
},{
    title: "Sales",
    dataIndex: "sales",
    key: "sales"
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

export const baseInfoFormOptions = [{
    Tips: "Name",
    decorator: "clientName",
    required: true,
    type: "input",
    options: null
},{
    Tips: "Status",
    decorator: "status",
    required: true,
    type: "select",
    options: StatusOptions
},{
    Tips: "Agreement account",
    decorator: "accountName",
    required: true,
    disabled: false,
    type: "child",
    options: null,
    initialValue: ""
},{
    Tips: "Service",
    decorator: "serviceList",
    required: true,
    type: "tags",
    options: null
},{
    Tips: "Number plan",
    decorator: "numberPlanList",
    required: false,
    type: "select",
    options: null,
    initialValue: ""
},{
    Tips: "Quality commitment",
    decorator: "qualityCommitment",
    required: false,
    type: "select",
    options: null,
    initialValue: ""
},{
    Tips: "Reference price list",
    decorator: "referencePriceList",
    required: true,
    type: "select",
    options: null,
    initialValue: ""
},{
    Tips: "Route class",
    decorator: "routeClass",
    required: true,
    type: "input",
    options: null,
    initialValue: "",
    disabled: true
},{
    Tips: "Exclude destination of client price list",
    decorator: "excludeDestinationList",
    required: false,
    type: "child",
    options: null,
    disabled: true,
    initialValue: ""
},{
    Tips: "Email",
    decorator: "email",
    required: true,
    type: "input",
    options: null,
    rules: [{
        validator: (rule: any, value: any, callback: any) => {
            setTimeout(() => {
                if (!value) {
                    callback();
                }
                const pattern: RegExp = new RegExp(
                    emailReg,
                    "g"
                );
                if (!pattern.test(value)) {
                    callback(`Please enter the correct mailbox`);
                } else {
                    callback();
                }
            },500)
        }
    }]
},{
    Tips: "Time zone(UTC)",
    decorator: "timeZone",
    required: true,
    type: "input",
    options: null,
    initialValue: ""
},{
    Tips: "Rate increase notice period(Days)",
    decorator: "rateIncreaseNoticePeriond",
    required: true,
    type: "input",
    options: null,
    rules: [{
        validator: (rule: any, value: any, callback: any) => {
            const pattern: RegExp = new RegExp(/^[1-9]\d*$/, "g")
            if(!pattern.test(value)) {
                callback(`Only number is allowed for ${value}`)
            } else {
                callback()
            }
        }
    }]
},{
    Tips: "Rate decrease notice period(Days)",
    decorator: "rateDecreaseNoticePeriond",
    required: true,
    type: "input",
    options: null,
    rules: [{
        validator: (rule: any, value: any, callback: any) => {
            const pattern: RegExp = new RegExp(/^[1-9]\d*$/, "g")
            if(!pattern.test(value)) {
                callback(`Only number is allowed for ${value}`)
            } else {
                callback()
            }
        }
    }]
},{
    Tips: "Sales",
    decorator: "sales",
    required: true,
    type: "select",
    options: null
},{
    Tips: "Remark",
    decorator: "remark",
    required: false,
    type: "textarea",
    isAlign: true,
    span: 23,
    labelSpan: 4
}]

/**account搜索内容 */
export const acconutformoptions = [{
    Tips: "Account",
    name: "accountName",
    required: false,
    type: "select",
    showSearch: true,
    span: 12,
    options: null
},
{
    Tips: "Company",
    name: "companyName",
    required: false,
    type: "select",
    showSearch: true,
    span: 12,
    options: null
},
{
    Tips: "Status",
    name: "accountStatus",
    required: false,
    type: "select",
    showSearch: true,
    span: 12,
    options: accountStatusOptions
}];

/**account表格 */
export const accountcolumns = [{
    title: 'Account',
    dataIndex: 'accountName',
    key: 'accountName'
},
{
    title: 'Account Abbrv.',
    dataIndex: 'accountAbbrv',
    key: 'accountAbbrv',
},
{
    title: 'Type',
    dataIndex: 'accountType',
    key: 'accountType',
    customRender: (value: any, row: any, index: any) => {
        const obj = {
            children: value,
        };
        const find: any = accountTypeOptions.find((item: any) => item.value === value)
        if (!find) {
            obj.children = ''
        }
        if (find) {
            obj.children = find.name
        }
        return obj;
    }
},
{
    title: 'Time zone Type',
    dataIndex: 'timeZoneType',
    key: 'timeZoneType',
},
{
    title: 'Time zone',
    dataIndex: 'timeZone',
    key: 'timeZone',
},
{
    title: 'Status',
    dataIndex: 'accountStatus',
    key: 'accountStatus',
    customRender: (value: any, row: any, index: any) => {
        const obj = {
            children: value,
        };
        const find: any = accountStatusOptions.find((item: any) => item.value === value)
        if (!find) {
            obj.children = ''
        }
        if (find) {
            obj.children = find.name
        }
        return obj;
    }
},
{
    title: 'Company',
    dataIndex: 'companyName',
    key: 'companyName'
},
{
    title: 'Credit limit',
    dataIndex: 'cerditLimit',
    key: 'cerditLimit'
},
{
    title: 'Deposit',
    dataIndex: 'deposit',
    key: 'deposit'
},
{
    title: 'Currency',
    dataIndex: 'currencyType',
    key: 'currencyType',
},
{
    title: 'Contact',
    dataIndex: 'contact',
    key: 'contact',
},
{
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
},
{
    title: 'Phone',
    dataIndex: 'phone',
    key: 'phone'
},
{
    title: 'Fax',
    dataIndex: 'fax',
    key: 'fax'
},
{
    title: 'Address',
    dataIndex: 'address',
    key: 'address'
},
{
    title: 'Country',
    dataIndex: 'country',
    key: 'country'
},
{
    title: 'Remark',
    dataIndex: 'remark',
    key: 'remark'
},
{
    title: 'Created by',
    dataIndex: 'createdBy',
    key: 'createdBy'
},
{
    title: 'Created date',
    dataIndex: 'createdTime',
    key: 'createdTime'
},
{
    title: 'Modified by',
    dataIndex: 'modifiedBy',
    key: 'modifiedBy'
},
{
    title: 'Last modified',
    dataIndex: 'lastModified',
    key: 'lastModified'
}];

/**Number plan搜索 */
export const Numberplanformoptions = [{
    Tips: "Number plan",
    name: "vendorClientNpName",
    required: false,
    type: "select",
    showSearch: true,
    span: 12,
    options: null
},{
    Tips: "Service",
    name: "serviceName",
    required: false,
    type: "select",
    showSearch: true,
    span: 12,
    options: null
},{
    Tips: "Direction",
    name: "direction",
    required: false,
    type: "select",
    showSearch: true,
    span: 12,
    options: directionOptions
},{
    Tips: "Status",
    name: "status",
    required: false,
    type: "select",
    showSearch: true,
    span: 12,
    options: StatusOptions
}]

/**Number plan表头 */
export const Numberplancolumns = [{
    title: "Number plan",
    dataIndex: "numberPlanName",
    key: "numberPlanName"
},{
    title: "Service",
    dataIndex: "serviceName",
    key: "serviceName"
},{
    title: "Direction",
    dataIndex: "direction",
    key: "direction",
    customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'direction', directionOptions)
},{
    title: "Status",
    dataIndex: "status",
    key: "status",
    sorter: (a, b) => a.status - b.status,
    customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'status', StatusOptions)
},{
    title: "Remark",
    dataIndex: "remark",
    key: "remark"
},{
    title: "Modifled by",
    dataIndex: "modifiedBy",
    key: "modifiedBy"
},{
    title: "Last modified",
    dataIndex: "lastModified",
    key: "lastModified"
}]

/**Reference price list搜索 */
export const Referenceformoptions = [{
    Tips: "Reference price list",
    required: false,
    name: "referencePriceList",
    type: "select",
    showSearch: true,
    span: 12,
    options: null
},{
    Tips: "Reference price policy",
    required: false,
    name: "referencePricePolicy",
    type: "select",
    showSearch: true,
    span: 12,
    options: null
},{
    Tips: "Status",
    required: false,
    name: "status",
    type: "select",
    showSearch: true,
    span: 12,
    options: StatusOptions
},{
    Tips: "Last update",
    required: false,
    name: "lastUpdate",
    type: "picker",
    showSearch: true,
    span: 12,
    options: null
}]

/**Reference price list表头 */
export const Referencecolumns = [{
    title: "Reference price list",
    dataIndex: "Referencepricelist",
    key: "Referencepricelist"
},{
    title: "Reference price",
    dataIndex: "referencePrice",
    key: "referencePrice"
},{
    title: "Status",
    dataIndex: "status",
    key: "status",
    customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'status', StatusOptions)
},{
    title: "Policy",
    dataIndex: "policy",
    key: "policy"
},{
    title: "Currency",
    dataIndex: "currencyType",
    key: "currencyType"
},{
    title: "Service",
    dataIndex: "serviceList",
    key: "serviceList"
},{
    title: "Route class",
    dataIndex: "routeClass",
    key: "routeClass"
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

/**Exclude destination of client price list搜索 */
export const Excludeformoptions= [{
    Tips: "Number plan",
    name: "numberPlanName",
    required: false,
    type: "input",
    showSearch: true,
    span: 12,
    options: null
},{
    Tips: "Destination",
    name: "destinationName",
    required:false,
    type: "input",
    showSearch: true,
    span: 12,
    options: null
},{
    Tips: "Dialed digits",
    name: "dialedDigit",
    required: false,
    type: "select",
    showSearch: true,
    span: 12,
    options: null
},{
    Tips: "Country name",
    name: "country",
    required: false,
    type: "input ",
    showSearch: true,
    options: null
},{
    Tips: "Country code",
    name: "countryCode",
    required: false,
    type: "input",
    span: 12,
    options: null
},{
    Tips: "Exclude destinationin client offer",
    name: "isExcludeDestination",
    required: false,
    type: "select",
    span: 12,
    options: ExcludedestinationinclientofferOptions
}]

/**Exclude destination of client price list表头 */
export const Excludecolumns = [{
    title: "Destination",
    dataIndex: "destinationName",
    key: "destinationName"
},{
    title: "Dialed digits",
    dataIndex: "dialedDigit",
    key: "dialedDigit",
    width: 300,
    scopedSlots: {
        customRender: "commaSplitNumber"
    }
},{
    title: "Country",
    dataIndex: "country",
    key: "country"
},{
    title: "Country code",
    dataIndex: "countryCode",
    key: "countryCode"
},{
    title: "Exclude destination in client offer",
    dataIndex: "isExcludeDestination",
    key: "isExcludeDestination",
    customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'excludedestinationinclientoffer', ExcludedestinationinclientofferOptions)
}]