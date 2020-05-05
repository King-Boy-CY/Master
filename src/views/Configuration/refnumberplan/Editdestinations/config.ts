import moment from "moment";
import {
    ExchangeRates,
    formOptionsConfigs,
} from "./EditdestinationConfig";

export const addFormOptionsData: any[] = [{
    Tips: 'Destination',
    decorator: 'destinationName',
    required: false,
    type: 'input',
    span: 12,
    labelSpan: 6,
},
{
    Tips: 'Destination type',
    decorator: 'destinationType',
    disabled: false,
    required: false,
    type: 'select',
    options: [{
        name: 'Mobile',
        value: 1
    },
    {
        name: 'Fixed',
        value: 2
    },
    ],
    span: 12,
    labelSpan: 6,
},
{
    Tips: 'Country',
    decorator: 'countryName',
    required: false,
    type: 'select',
    showSearch: true,
    span: 12,
    labelSpan: 6,
    options: null
},
{
    Tips: 'Country code',
    decorator: 'countryCode',
    required: false,
    disabled: true,
    type: 'select',
    span: 12,
    labelSpan: 6,
    options: null
},
{
    Tips: 'Category',
    decorator: 'categoryList',
    required: false,
    type: 'tags',
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
    required: true,
    type: 'picker',
    span: 12,
    labelSpan: 6,
    initialValue: moment().set('year', 2099).endOf('y'),
},
{
    Tips: 'Dialed digit',
    decorator: 'dialedDigitList',
    required: false,
    type: 'textarea',
    span: 24,
    labelSpan: 3,
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

export const editFormOptionsData: any[] = [{
    Tips: 'Destination',
    decorator: 'destinationName',
    required: false,
    type: 'input',
    span: 12,
    labelSpan: 6,
},
{
    Tips: 'Destination type',
    decorator: 'destinationType',
    disabled: false,
    required: false,
    type: 'select',
    options: [{
        name: 'Mobile',
        value: 1
    },
    {
        name: 'Fixed',
        value: 2
    },
    ],
    span: 12,
    labelSpan: 6,
},
{
    Tips: 'Country',
    decorator: 'countryName',
    required: false,
    type: 'select',
    showSearch: true,
    span: 12,
    labelSpan: 6,
    options: null
},
{
    Tips: 'Country code',
    decorator: 'countryCode',
    required: false,
    disabled: true,
    type: 'select',
    span: 12,
    labelSpan: 6,
    options: null
},
{
    Tips: 'Category',
    decorator: 'categoryList',
    required: false,
    type: 'tags',
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
    required: true,
    type: 'picker',
    span: 12,
    labelSpan: 6,
    initialValue: moment().set('year', 2099).endOf('y'),
},
{
    Tips: 'Dialed digit',
    decorator: 'dialedDigitList',
    required: false,
    type: 'textarea',
    span: 24,
    labelSpan: 3,
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
const destinationTypeOptions: any = [{
    name: 'Mobile',
    value: 1
},
{
    name: 'Fixed',
    value: 2
}
];
export const columnsData: ExchangeRates[] = [{
    title: 'Destination',
    dataIndex: 'destinationName',
    key: 'destinationName',
    width: 200,
},
{
    title: 'Destination type',
    dataIndex: 'destinationType',
    key: 'destinationType',
    width: 150,
    customRender: (value: any, row: any, index: any) => {
        const obj = {
            children: value,
        };
        const find: any = destinationTypeOptions.find((item: any) => item.value === value)
        if (find) {
            obj.children = find.name
        }
        return obj;
    },
},
{
    title: 'Dialed digit',
    dataIndex: 'dialedDigitList',
    key: 'dialedDigitList',
    width: 300,
    scopedSlots: {
        customRender: "commaSplitNumber"
    }
},
{
    title: 'Country',
    dataIndex: 'countryName',
    key: 'countryName',
    width: 200
},
{
    title: 'Country code',
    dataIndex: 'countryCode',
    key: 'countryCode',
    width: 150
},
{
    title: 'Category',
    dataIndex: 'categoryList',
    key: 'categoryList',
    width: 150
},
{
    title: 'Begin Date',
    dataIndex: 'beginDate',
    key: 'beginDate',
    width: 200,
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
export const formOptionsData: formOptionsConfigs[] = [{
    Tips: 'Destination',
    name: 'destinationName',
    required: false,
    type: 'input',
    span: 12,
    colSpan: 6,

},
{
    Tips: 'Destination type',
    name: 'destinationType',
    required: false,
    type: 'select',
    span: 12,
    colSpan: 7,
    options: destinationTypeOptions,
},
{
    Tips: 'Dialed digit',
    name: 'dialedDigitList',
    required: false,
    showSearch: true,
    type: 'input',
    span: 12,
    colSpan: 6,
    startwithOptions:true
},
{
    Tips: 'Country',
    name: 'countryName',
    required: false,
    showSearch: true,
    type: 'select',
    span: 12,
    colSpan: 7,
    startwithOptions:true,
    options: []
},
{
    Tips: 'Country code',
    name: 'countryCode',
    required: false,
    type: 'select',
    showSearch: true,
    span: 12,
    startwithOptions:true,
    colSpan: 6,
    options: []
},
{
    Tips: 'Category',
    name: 'categoryList',
    required: false,
    type: 'select',
    showSearch: true,
    span: 12,
    colSpan: 7,
    options: [],
    startwithOptions:true,
},
{
    Tips: 'Effecive date',
    name: 'effeciveDate',
    required: false,
    type: 'picker',
    showSearch: true,
    span: 12,
    colSpan: 6,
    initialValue: moment().endOf('m'),

}
];
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

