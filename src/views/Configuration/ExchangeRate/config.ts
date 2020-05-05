import moment from 'moment'
export const addFormGroupOptionsData: any[] = [{
    Tips: 'Currency1',
    decorator: 'currency1',
    required: true,
    type: 'select',
    span: 12,
    labelSpan: 6,
},
{
    Tips: 'Currency2',
    decorator: 'currency2',
    disabled: false,
    required: true,
    type: 'select',
    options: null,
    span: 12,
    labelSpan: 6,
},
{
    Tips: 'Rate',
    decorator: 'rate',
    disabled: false,
    required: true,
    type: 'input',
    options: null,
    span: 12,
    labelSpan: 6,
    rules: [{
        validator: (rule: any, value: any, callback: any) => {
            if (!value) {
                callback()
            }
            const pattern: RegExp = new RegExp(/^[1-9]\d*$/, "g")
            if (!pattern.test(value)) {
                callback(`Only number is allowed for ${value}`)
            } else {
                callback()
            }
        }
    }]
},
{
    Tips: 'Vendor',
    decorator: 'vendorName',
    disabled: false,
    required: false,
    type: 'select',
    options: null,
    span: 12,
    labelSpan: 6,
},
{
    Tips: 'Client',
    decorator: 'clientName',
    disabled: false,
    required: false,
    type: 'select',
    options: null,
    span: 12,
    labelSpan: 6,
},
{
    Tips: 'Begin date',
    decorator: 'beginDate',
    disabled: false,
    required: true,
    type: 'picker',
    options: null,
    span: 12,
    labelSpan: 6,
    initialValue: moment().endOf('m'),
},
{
    Tips: 'End date',
    decorator: 'endDate',
    disabled: false,
    required: true,
    type: 'picker',
    options: null,
    span: 12,
    labelSpan: 6,
    initialValue: moment().endOf('month'),
}
]
export const editFormGroupOptionsData: any[] = [{
    Tips: 'Currency1',
    decorator: 'currency1',
    required: true,
    type: 'select',
    span: 12,
    labelSpan: 6,
},
{
    Tips: 'Currency2',
    decorator: 'currency2',
    disabled: false,
    required: true,
    type: 'select',
    options: null,
    span: 12,
    labelSpan: 6,
},
{
    Tips: 'Rate',
    decorator: 'rate',
    disabled: false,
    required: true,
    type: 'input',
    options: null,
    span: 12,
    labelSpan: 6,
    rules: [{
        validator: (rule: any, value: any, callback: any) => {
            if (!value) {
                callback()
            }
            const pattern: RegExp = new RegExp(/^[1-9]\d*$/, "g")
            if (!pattern.test(value)) {
                callback(`Only number is allowed for ${value}`)
            } else {
                callback()
            }
        }
    }]
},
{
    Tips: 'Vendor',
    decorator: 'vendorName',
    disabled: false,
    required: false,
    type: 'select',
    options: null,
    span: 12,
    labelSpan: 6,
},
{
    Tips: 'Client',
    decorator: 'clientName',
    disabled: false,
    required: false,
    type: 'select',
    options: null,
    span: 12,
    labelSpan: 6,
},
{
    Tips: 'Begin date',
    decorator: 'beginDate',
    disabled: false,
    required: true,
    type: 'picker',
    options: null,
    span: 12,
    labelSpan: 6,
},
{
    Tips: 'End date',
    decorator: 'endDate',
    disabled: false,
    required: true,
    type: 'picker',
    options: null,
    span: 12,
    labelSpan: 6,
}
]
export const  formoptionsData: any[] = [{
    Tips: 'currency1',
            name: 'currency1',
            required: false,
            type: 'select',
            initialValue: 'USD',
            span: 12,
            colSpan: 6,
            options: null,

        },
        {
            Tips: 'currency2',
            name: 'currency2',
            required: false,
            type: 'select',
            span: 12,
            colSpan: 6,
            options: null
        },
        {
            Tips: 'Vendor',
            name: 'vendorId',
            required: false,
            showSearch: true,
            type: 'select',
            span: 12,
            colSpan: 6,
            options: null
        },
        {
            Tips: 'Client',
            name: 'clientId',
            required: false,
            showSearch: true,
            type: 'select',
            span: 12,
            colSpan: 6,
            options: null
        },
        {
            Tips: "Begin date",
            required: true,
            name: 'begindate',
            type: 'rangePicker',
            span: 12,
            colSpan: 6,
            showTime: false, // 增加时间选择功能
            format: 'YYYY-MM-DD', // 自定义时间格式 默认YYYY-MM-DD
            initialValue: [
                moment().month(moment().month() - 1).startOf('month'),
                moment().endOf('m')
            ]
        },
        // {
        //     Tips: 'to',
        //     name:'endDate',
        //     required: false,
        //     type: 'picker',
        //     span: 6,
        //     colSpan: 11,
        //     wrapperCol:2,
        //     options: null
        // },
    ];
export const columnsData: any[] = [{
    title: 'currency1',
    dataIndex: 'currency1',
    key: 'currency1',
    width: 200,
    sorter: (a, b) => a.currency1.length - b.currency1.length
},
{
    title: 'currency2',
    dataIndex: 'currency2',
    key: 'currency2',
    width: 150
},
{
    title: 'Rate',
    dataIndex: 'rate',
    key: 'rate',
    width: 150
},
{
    title: 'Vendor',
    dataIndex: 'vendorName',
    key: 'vendorName',
    width: 200
},
{
    title: 'Client',
    dataIndex: 'clientName',
    key: 'clientName',
    width: 100
},
{
    title: 'Begin Date',
    dataIndex: 'beginDate',
    key: 'beginDate',
    width: 100,
    sorter: (a, b) => a.beginDate.toUpperCase().localeCompare(b.beginDate.toUpperCase()),
},
{
    title: 'End Date',
    dataIndex: 'endDate',
    key: 'endDate',
    width: 200
},
];
export const FormscreeningData: any[] = [{
    name: "Add",
    icon: "plus-circle",
    index: 1
},
{
    name: "Edit",
    icon: "form",
    disabled: true,
    tips: "Please select only one record to proceed",
    index: 2
},
{
    name: "Delete",
    icon: "delete",
    disabled: true,
    tips: "Select a record before you delete it",
    index: 3
},
// {
//     name: "Import",
//     icon: "upload",
//     disabled: false,
//     tips: "Please select only one record to proceed",
//     index: 4
// },
{
    name: "Export",
    icon: "export",
    index: 5,
    disabled: true,
}
];