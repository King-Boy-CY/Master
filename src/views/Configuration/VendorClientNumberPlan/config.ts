import { searchOptionInterface, columnInterface } from './interface'
import {
    selectedBtnInterface,
    selectOptionsInterface,
    formGroupOptionInterface,
    formGroupType
} from '@/common/dataConfig/interface'
import moment from 'moment'
export const sourceTypeOptions: selectOptionsInterface[] = [
    {
        name: 'Vendor',
        value: 1
    },
    {
        name: 'Client',
        value: 2
    }
]

export const statusOptions: selectOptionsInterface[] = [
    {
        name: 'Active',
        value: 1
    },
    {
        name: 'Invalid',
        value: 2
    },
]

const renderContent: Function = (value: any, row: any, index: number, dataIndex: string | number, options?: any): object => {
    const obj = {
        children: value,
        attrs: {
            colSpan: 1,
            rowSpan: 1
        },
    };
    if (options && options instanceof Array) {
        // obj.children = options[value]
        const find = options.find((item: any) => item.value == value)
        if (find) {
            obj.children = find.name
        }
    }
    return obj;
}

export const columns: columnInterface[] = [
    {
        title: "Number plan",
        dataIndex: "vendorClientNpName",
        key: "vendorClientNpName",
        width: 200,
        sorter: (a: any, b: any) => a.numberPlanName.toUpperCase().localeCompare(b.numberPlanName.toUpperCase()),
    },
    {
        title: "Source type",
        dataIndex: "sourceType",
        key: "sourceType",
        width: 150,
        customRender: (value: any, row: any, index: number) => renderContent(value, row, index, 'sourceType', sourceTypeOptions),
        options: sourceTypeOptions
    },
    {
        title: "Source",
        dataIndex: "sourceName",
        key: "sourceName",
        width: 150
    },
    {
        title: "Status",
        dataIndex: "status",
        key: "status",
        width: 150,
        sorter: (a: any, b: any) => a.status.toUpperCase().localeCompare(b.status.toUpperCase()),
        customRender: (value: any, row: any, index: number) => renderContent(value, row, index, 'status', statusOptions),
        options: statusOptions
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
        width: 180,
    },
    {
        title: "Last modified",
        dataIndex: "lastModified",
        key: "lastModified",
        width: 180,
    }
];

export const searchFormOptions: searchOptionInterface[] = [
    {
        Tips: 'Number plan',
        name: 'vendorClientNpName',
        required: false,
        type: 'select',
        showSearch: true,
        filterOption: true,
        span: 12,
        colSpan: 6,
        options: [],

    },
    {
        Tips: 'Source type',
        name: 'sourceType',
        required: true,
        type: 'select',
        span: 12,
        colSpan: 7,
        options: sourceTypeOptions,
        initialValue: 1,
    },
    {
        Tips: 'Source',
        name: 'sourceId',
        required: false,
        type: 'select',
        showSearch: true,
        span: 12,
        colSpan: 6,
        options: []
    },
    {
        Tips: 'Status',
        name: 'status',
        required: true,
        type: 'select',
        span: 12,
        colSpan: 7,
        options: statusOptions,
        initialValue: 1,
    },
];

export const selectedBtn: selectedBtnInterface[] = [
    {
        name: "Add",
        icon: "plus-circle",
        disabled: false,
        tips: "Please select only one record to proceed",
        index: 'add'
    },
    {
        name: "Edit",
        icon: "form",
        disabled: true,
        tips: "Please select only one record to proceed",
        index: 'edit'
    },
    {
        name: "Edit destination",
        icon: "edit",
        index: 'editDestination',
        disabled: true,
        tips: "Need to select the record before operating"
    },
    {
        name: "Edit country",
        icon: "edit",
        index: 'editCountry',
        disabled: true,
        tips: "Need to select the record before operating"
    },
    {
        name: "Delete",
        icon: "delete",
        index: 'delete',
        disabled: true,
        tips: "Need to select the record before operating"
        // and only invalid records could be deleted
    },
    {
        name: "Export",
        icon: "export",
        index: 'export',
        disabled: true,
    }
];


export const addFormGroupOptions: formGroupOptionInterface[] = [
    {
        Tips: "Number plan",
        decorator: "vendorClientNpName",
        required: true,
        disabled: true,
        type: formGroupType.input,
        span: 12,
        labelSpan: 6,
        initialValue: undefined
    },
    {
        Tips: "Source type",
        decorator: "sourceType",
        required: true,
        disabled: false,
        type: formGroupType.select,
        options: sourceTypeOptions,
        span: 12,
        labelSpan: 6,
        initialValue: undefined
    },
    {
        Tips: "Source",
        decorator: "sourceId",
        required: true,
        type: formGroupType.select,
        showSearch: true,
        options: [],
        span: 12,
        labelSpan: 6,
        initialValue: undefined

    },
    {
        Tips: "Status",
        decorator: "status",
        required: false,
        type: formGroupType.select,
        options: statusOptions,
        initialValue: 1,
        span: 12,
        labelSpan: 6,
    },
    {
        Tips: "Remark",
        decorator: "remark",
        required: false,
        type: formGroupType.textarea,
        span: 24,
        labelSpan: 3,
        initialValue: undefined
    },

]
