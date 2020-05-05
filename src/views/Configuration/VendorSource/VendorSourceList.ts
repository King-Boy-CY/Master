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


/**选项内容 */
export const AutomateOptions = [{
    name: "On",
    value: 1
},
{
    name: "Off",
    value: 2
}];

export const CLIOptions = [{
    name: "Yes",
    value: 1
},
{
    name: "Defined by offer",
    value: 2
}];

export const StatusOptionstest = [{
    name: "Active",
    value: 1
},
{
    name: "Invalid",
    value: 2
}];

export const ServiceOptions = [{
    name: 'IP',
    value: 1
},
{
    name: 'IDD',
    value: 2
},
{
    name: 'IPLC',
    value: 3
}];


/**表格内容 */
export const columns = [{
    title: "Name",
    dataIndex: "vendorName",
    key: "vendorName",
    width: 280,
    sorter: (a, b) => {
        var stringA = a.vendorName.toUpperCase();
        var stringB = b.vendorName.toUpperCase();
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
    title: "Status",
    dataIndex: "status",
    key: "status",
    width: 100,
    sorter: (a, b) => a.status.length - b.status.length,
    customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'status', StatusOptionstest)
},
{
    title: "Agreement account",
    dataIndex: "accountName",
    key: "accountName",
    width: 220
},
{
    title: "Service",
    dataIndex: "serviceName",
    key: "service",
    width: 80,
    customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'Service', ServiceOptions)
},
{
    title: "CLI supported by default",
    dataIndex: "cliSupportedByDefault",
    key: "cliSupportedByDefault",
    width: 140,
    customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'cliSupportedByDefault', CLIOptions)
},
{
    title: "Email",
    dataIndex: "email",
    key: "email",
    width: 280
},
{
    title: "Time zone(UTC)",
    dataIndex: "timeZone",
    key: "timeZone",
    width: 160
},
{
    title: "Automate analysis of decoed offer",
    dataIndex: "isAutomateAnalysis",
    key: "isAutomateAnalysis",
    width: 180,
    customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'isAutomateAnalysis', AutomateOptions)
},
{
    title: "Automate marking routable",
    dataIndex: "isAutomateMarkingRoutable",
    key: "isAutomateMarkingRoutable",
    width: 160,
    customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'isAutomateMarkingRoutable', AutomateOptions)
},
{
    title: "Remark",
    dataIndex: "remark",
    key: "remark",
    width: 200
},
{
    title: "Modified by",
    dataIndex: "modifiedBy",
    key: "modifiedBy",
    width: 120
},
{
    title: "Last modified",
    dataIndex: "lastModified",
    key: "lastModified",
    width: 200
}];


/**Add 属性 */
export const baseInfoFormOptions = [{
    Tips: "Name",
    decorator: "vendorName",
    required: true,
    type: "input",
    options: null
},
{
    Tips: "Status",
    decorator: "status",
    required: true,
    type: "select",
    options: StatusOptionstest,
    initialValue: 1
},
{
    Tips: "Agreement account",
    decorator: "accountName",
    required: true,
    type: "child",
    initialValue: ""
}, {
    Tips: "Service",
    decorator: "serviceName",
    required: true,
    type: "tags",
    options: null
},
{
    Tips: "CLI supported by default",
    decorator: "cliSupportedByDefault",
    required: false,
    type: "select",
    options: CLIOptions,
    initialValue: 2,
},
{
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
},
{
    Tips: "Time zone(UTC)",
    decorator: "timeZone",
    required: false,
    disabled: true,
    type: "input",
    initialValue: "",
    options: null
},
{
    Tips: "Automate analysis of decoded offer",
    decorator: "isAutomateAnalysis",
    required: true,
    type: "select",
    options: AutomateOptions,
    initialValue: 2
},
{
    Tips: "Automate marking routable",
    decorator: "isAutomateMarkingRoutable",
    required: true,
    type: "select",
    options: AutomateOptions,
    initialValue: 2
},
{
    Tips: "Remark",
    decorator: "remark",
    required: false,
    type: "textarea",
    isAlign: true,
    span: 23,
    labelSpan: 2,
    wrapperSpan: 1
}];


/**Edit 属性 */
export const EditbaseInfoFormOptions = [{
    Tips: "Name",
    decorator: "vendorName",
    required: true,
    type: "input",
    options: null,
    disabled: true,
    initialValue: ""
},
{
    Tips: "Status",
    decorator: "status",
    required: true,
    type: "select",
    options: StatusOptionstest,
    initialValue: ""
},
{
    Tips: "Agreement account",
    decorator: "accountName",
    required: true,
    type: "child",
    initialValue: ""
}, {
    Tips: "Service",
    decorator: "serviceName",
    required: true,
    type: "tags",
    options: null,
    initialValue: ""
},
{
    Tips: "CLI supported by default",
    decorator: "cliSupportedByDefault",
    required: false,
    type: "select",
    options: CLIOptions,
    initialValue: ""
},
{
    Tips: "Email",
    decorator: "email",
    required: true,
    type: "input",
    options: null,
    initialValue: "",
    rules: [{
        validator: (rule: any, value: any, callback: any) => {
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
        }
    }]
},
{
    Tips: "Time zone(UTC)",
    decorator: "timeZone",
    required: false,
    disabled: true,
    type: "input",
    initialValue: "",
    options: null
},
{
    Tips: "Automate analysis of decoded offer",
    decorator: "isAutomateAnalysis",
    required: true,
    type: "select",
    initialValue: "",
    options: AutomateOptions
},
{
    Tips: "Automate marking routable",
    decorator: "isAutomateMarkingRoutable",
    required: true,
    type: "select",
    initialValue: "",
    options: AutomateOptions
},
{
    Tips: "Remark",
    decorator: "remark",
    required: false,
    type: "textarea",
    isAlign: true,
    span: 23,
    labelSpan: 2,
    wrapperSpan: 1,
    initialValue: ""
}];


/**搜索内容 */
export const formOptions = [{
    Tips: "Name",
    require: false,
    name: "vendorName",
    type: "select",
    showSearch: true,
    span: 12,
    colSpan: 5,
    options: null
},
{
    Tips: "Status",
    require: false,
    name: "status",
    showSearch: true,
    type: "select",
    span: 12,
    colSpan: 5,
    options: StatusOptionstest
}];


/**操作功能 */
export const formscreening = [{
    name: "Add",
    icon: "plus-circle",
    index: 1
},
{
    name: "Edit",
    icon: "form",
    index: 2,
    disabled: true,
    tips: "Records whose Operating state is 'D/E' cannot be edited;Records whose Type is Processing cannot be edited"
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


/**account选择项 */
export const accountStatusOptionstest = [{
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
    options: accountStatusOptionstest
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
        const find: any = accountStatusOptionstest.find((item: any) => item.value === value)
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
    dataIndex: 'countryName',
    key: 'countryName'
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


/**VendorSourceTop表头 */
export const inputcolumnsTop = [{
    title: "No.",
    dataIndex: "no",
    key: "no"
},
{
    title: "Time band",
    dataIndex: "timeBandName",
    require: true,
},
{
    title: "Day",
    dataIndex: "day",
    require: true,
    width:"100px"
},
{
    title: "Weekday",
    dataIndex: "weekday",
    require: true,
    width:"100px"
},
{
    title: "Specific time",
    dataIndex: "specificTime"
}];

/** */

/**VendorSourceTop表格 */
export const inputdataTopadd = [{
    key: 1,
    timeBandName: {
        type: "input",
        decorator: "timeBandName",
        initialValue: "peak"
    },
    day: {
        decorator: "select",
        options: null,
        initialValue: "",
        children: [{
                type: "select",
                decorator: "dayFrom",
                initialValue: "",
                disabled: false,
                options: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"]
            },
            {
                type: "select",
                decorator: "dayTo",
                initialValue: "",
                disabled: false,
                slotName: "to",
                options: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"]
            }
        ]
    },
    weekday: {
        type: "picker",
        decorator: "weekday",
        options: null,
        children: [{
                type: "select",
                disabled: false,
                decorator: "weekdayFrom",
                options: ["01", "02", "03", "04", "05", "06", "07"]
            },
            {
                type: "select",
                disabled: false,
                decorator: "weekdayTo",
                slotName: "to",
                options: ["01", "02", "03", "04", "05", "06", "07"]
            }
        ]
    },
    specificTime: {
        type: "timeFrom",
            decorator: "Specifictime",
            options: null,
            children: [{
                    type: 'timeFrom',
                    initialValue: "",
                    decorator: 'timeFrom',
                },
                {
                    type: 'timeFrom',
                    slotName: 'To',
                    initialValue: "",
                    decorator: 'timeTo',
                }
            ]
    }
}];
