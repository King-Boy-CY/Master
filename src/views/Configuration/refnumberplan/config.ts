import {
    columnsConfigs,
    formOptionsConfigs
} from "./refnumberplanConfig";

export const columnsData: columnsConfigs[] = [{
    title: "Number plan",
    dataIndex: "numberPlanName",
    key: "numberPlanName",
    width: 200,
    sorter: (a, b) => a.numberPlanName.toUpperCase().localeCompare(b.numberPlanName.toUpperCase()),
},
{
    title: "Service",
    dataIndex: "serviceName",
    key: "serviceName",
    width: 150,
},
{
    title: "Direction",
    dataIndex: "direction",
    key: "direction",
    width: 150
},
{
    title: "Status",
    dataIndex: "status",
    key: "status",
    width: 150,
    sorter: (a, b) => a.status.toUpperCase().localeCompare(b.status.toUpperCase()),
},
{
    title: "Remark",
    dataIndex: "remark",
    key: "remark",
    width: 150
},
{
    title: "Modified by",
    dataIndex: "modifiedBy",
    key: "modifiedBy",
},
{
    title: "Last modified",
    dataIndex: "lastModified",
    key: "lastModified"
}

];

const DescriptionOptions: any = [{
    name: 'Inbound',
    value: 1
},
{
    name: 'Outbound',
    value: 2
},
]

const statusOptions: any = [{
    name: 'Active',
    value: 1
},
{
    name: 'Invalid',
    value: 2
},
]

export const formOptionsData: formOptionsConfigs[] = [{
    Tips: 'Number plan',
    name: 'numberPlanName',
    required: false,
    type: 'select',
    showSearch: true,
    filterOption: true,
    span: 12,
    colSpan: 6,
    options: null,

},
{
    Tips: 'Service',
    name: 'serviceName',
    required: false,
    type: 'select',
    showSearch: true,
    span: 12,
    colSpan: 7,
    options: null
},
{
    Tips: 'Direction',
    name: 'direction',
    required: false,
    type: 'select',
    span: 12,
    colSpan: 6,
    options: DescriptionOptions
},
{
    Tips: 'Status',
    name: 'status',
    required: false,
    type: 'select',
    span: 12,
    colSpan: 7,
    options: statusOptions,
    initialValue: 1,
},
];

export const FormscreeningData: any[] = [{
    name: "Edit",
    icon: "form",
    disabled: true,
    tips: "Please select only one record to proceed",
    index: 2
},
{
    name: "Edit destination",
    icon: "file-text",
    index: 3,
    disabled: true,
    tips: "Need to select the record before operating"
},
{
    name: "Edit country",
    icon: "file-text",
    index: 4,
    disabled: true,
    tips: "Need to select the record before operating"
},
{
    name: "Export",
    icon: "export",
    index: 6,
    disabled: true,
}
];

export const addFormGroupOptionsData: formOptionsConfigs[] = [{
    Tips: 'Direction',
    decorator: 'direction',
    required: true,
    type: 'input',
    span: 12,
    labelSpan: 6,
    disabled: true,
    options: [{
            name: 'Inbound',
            value: 1
        },
        {
            name: 'Outbound',
            value: 2
        },
    ],
},
{
    Tips: 'Number plan',
    decorator: 'numberPlanName',
    disabled: true,
    required: true,
    type: 'input',
    options: null,
    span: 12,
    labelSpan: 6,
},
{
    Tips: 'Service',
    decorator: 'configServiceIdList',
    required: true,
    type: 'tags',
    span: 12,
    labelSpan: 6,
    options: null,
},
{
    Tips: 'Status',
    decorator: 'status',
    disabled: true,
    required: true,
    type: 'select',
    options: [{
            name: 'Active',
            value: 1
        },
        {
            name: 'Invalid',
            value: 2
        },
    ],
    span: 12,
    labelSpan: 6,
},
{
    Tips: "Remark",
    decorator: "remark",
    required: false,
    type: "textarea",
    span: 24,
    labelSpan: 3,
},
]
