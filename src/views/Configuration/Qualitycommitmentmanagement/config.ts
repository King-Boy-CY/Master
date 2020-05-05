const statusOptions =[
    {
        name: 'Active',
        value: 0
    },
    {
        name: 'Invalid',
        value: 1
    },
]
export  const addFormGroupOptionsData: any[] = [{
    Tips: 'Quality commitment',
    decorator: 'qualityCommitmentName',
    required: true,
    type: 'input',
    span: 12,
    labelSpan:6
},
{
    Tips: 'Status',
    decorator: 'status',
    disabled: false,
    required: true,
    type: 'select',
    options: statusOptions,
    span: 12,
    labelSpan:6
},
{
    Tips: 'Remark',
    decorator: 'remark',
    disabled: false,
    required: false,
    type: 'textarea',
    options: null,
    span: 24,
    labelSpan: 3
},
]
export  const editFormGroupOptionsData: any[] = [{
    Tips: 'Quality commitment',
    decorator: 'qualityCommitmentName',
    required: true,
    type: 'input',
    span: 12,
    labelSpan:6
},
{
    Tips: 'Status',
    decorator: 'status',
    disabled: false,
    required: true,
    type: 'select',
    options: statusOptions,
    span: 12,
    labelSpan:6
},
{
    Tips: 'Remark',
    decorator: 'remark',
    disabled: false,
    required: false,
    type: 'textarea',
    options: null,
    span: 24,
    labelSpan: 3
},
]
export const formOptionsData: any[] = [{
    Tips: 'Route class',
    name: 'currency1',
    required: false,
    type: 'input',
    span: 12,
    colSpan: 6,
    options: null,

},
{
    Tips: 'Status',
    name: 'status',
    required: false,
    type: 'select',
    span: 12,
    colSpan: 7,
    options: statusOptions
},
{
    Tips: 'Description',
    name: 'description',
    required: false,
    showSearch: true,
    type: 'input',
    span: 12,
    colSpan: 6,
    options: null
},
{
    Tips: 'Remark',
    name: 'remark',
    required: false,
    showSearch: true,
    type: 'input',
    span: 12,
    colSpan: 7,
    options: null
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
    name: "Details",
    icon: "file-text",
    index: 3,
    disabled: true,
    tips: "Need to select the record before operating"
},
{
    name: "Delete",
    icon: "delete",
    disabled: true,
    tips: "Select a record before you delete it",
    index: 4
},
{
    name: "Export",
    icon: "export",
    index: 5,
    disabled: true,
}
];
export const columnsData: any[] = [{
    title: "Quality commitment",
    dataIndex: "qualityCommitmentName",
    key: "qualityCommitmentName",
    width: 200,
    sorter: (a, b) => a.qualityCommitmentName.toUpperCase().localeCompare(b.qualityCommitmentName.toUpperCase()),
    // sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
},
{
    title: "Status",
    dataIndex: "status",
    key: "status",
    width: 150,
    sorter: (a, b) => a.status - b.status,
    customRender: (value: any, row: any, index: any) => {
        const obj = {
            children: value,
        };
        const find: any = statusOptions.find((item: any) => item.value === value)
        if (find) {
            obj.children = find.name
        }
        return obj;
    },
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
