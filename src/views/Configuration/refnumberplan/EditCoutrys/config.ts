import moment from "moment";


export const baseInfoFormOptionsData: any[] = [{
    Tips: "Upload",
    decorator: "Upload",
    width: '100%',
    required: true,
    disabled: false,
    type: "upload",
    options: null,
    accept: ".xlsx",
    multiple: true
}];

export const addFormOptionsData: any[] = [{
    Tips: 'Country',
    decorator: 'countryName',
    required: true,
    type: 'input',
    span: 12,
    labelSpan: 6,
},
{
    Tips: 'Country code',
    decorator: 'countryCode',
    disabled: false,
    required: true,
    type: 'input',
    options: null,
    span: 12,
    labelSpan: 6,
},
{
    Tips: 'Zone',
    decorator: 'timeZone',
    required: false,
    type: 'input',
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
    initialValue: moment().endOf('m'),
    span: 12,
    labelSpan: 6,
},
{
    Tips: 'End date',
    decorator: 'endDate',
    required: true,
    type: 'picker',
    initialValue: moment().set('year', 2099).endOf('y'),
    span: 12,
    labelSpan: 6,
},
{
    Tips: 'Remark',
    decorator: 'remark',
    disabled: false,
    required: false,
    type: 'textarea',
    options: null,
    span: 24,
    labelSpan: 3,
},
]
export const FormscreeningData: any[] = [{
    name: "Add",
    icon: "plus-circle",
    index: 1,
    txt: 'add'
},
{
    name: "Edit",
    icon: "form",
    disabled: true,
    tips: "Please select only one record to proceed",
    index: 2,
    txt: 'edit'
},
{
    name: "Delete",
    icon: "delete",
    disabled: true,
    tips: "Select a record before you delete it",
    index: 3,
    txt: 'delete'
},
{
    name: "Upload",
    icon: "upload",
    disabled: false,
    tips: "Please select only one record to proceed",
    index: 4,
    txt: 'upload'
},
{
    name: "Export",
    icon: "export",
    disabled: true,
    index: 5,
    txt: 'export'
}
];
export const formOptionsData: any = [{
    Tips: 'Country',
    name: 'countryName',
    required: false,
    type: 'input',
    showSearch: true,
    span: 12,
    colSpan: 6,
},
{
    Tips: 'Country code',
    name: 'countryCode',
    required: false,
    type: 'input',
    showSearch: true,
    span: 12,
    colSpan: 7,
    initialValue: undefined,
    startwithOptions:true,
},
{
    Tips: 'Zone',
    name: 'timeZone',
    required: false,
    showSearch: true,
    type: 'input',
    span: 12,
    colSpan: 6,
},
{
    Tips: 'Effecive date',
    name: 'effeciveDate',
    required: false,
    showSearch: true,
    type: 'picker',
    span: 12,
    colSpan: 7,
    initialValue: moment().endOf('m'),
}
];

export const columnsData: any[] = [{
    title: 'Country',
    dataIndex: 'countryName',
    key: 'countryName',
    width: 150
},
{
    title: 'Country code',
    dataIndex: 'countryCode',
    key: 'countryCode',
    width: 150
},
{
    title: 'Zone',
    dataIndex: 'timeZone',
    key: 'timeZone',
    width: 200
},
{
    title: 'Begin Date',
    dataIndex: 'beginDate',
    key: 'beginDate',
    width: 100,
},
{
    title: 'End Date',
    dataIndex: 'endDate',
    key: 'endDate',
    width: 200
},
{
    title: 'Last modified',
    dataIndex: 'lastModified',
    key: 'lastModified',
    width: 100,
},
{
    title: 'Modified by',
    dataIndex: 'modifiedBy',
    key: 'modifiedBy',
    width: 200
},
{
    title: 'Remark',
    dataIndex: 'remark',
    key: 'remark',
    width: 100,
}
];

export const editFormOptionsData: any[] = [{
    Tips: 'Country',
    decorator: 'countryName',
    required: true,
    type: 'input',
    span: 12,
    labelSpan: 6,
},
{
    Tips: 'Country code',
    decorator: 'countryCode',
    disabled: false,
    required: true,
    type: 'input',
    options: null,
    span: 12,
    labelSpan: 6,
},
{
    Tips: 'Zone',
    decorator: 'timeZone',
    required: false,
    type: 'input',
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
    initialValue: moment().endOf('m'),
    span: 12,
    labelSpan: 6,
},
{
    Tips: 'End date',
    decorator: 'endDate',
    required: true,
    type: 'picker',
    initialValue: moment().set('year', 2099).endOf('y'),
    span: 12,
    labelSpan: 6,
},
{
    Tips: 'Remark',
    decorator: 'remark',
    disabled: false,
    required: false,
    type: 'textarea',
    options: null,
    span: 24,
    labelSpan: 3,
},
]