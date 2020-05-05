export interface IFormoptions {
    required: boolean,
    type: string,
    Tips: string,
    decorator: string,
    options?: any[],
    [prop: string]: any
}

export interface IBtnList {
    type: string,
    name: string,
    icon: string,
    eventType: string,
    [prop: string]: any
}


export const Search: IFormoptions[] = [
    {
        Tips: 'Destination',
        decorator: 'routeClass',
        required: false,
        type: 'select',
        span: '10',
        colOffset: '1',
        wrapperSpan: 18,
        labelSpan: 6,
        options: []
    },
    {
        Tips: 'Dialed digits',
        decorator: 'routingProduct',
        required: false,
        type: 'input',
        span: '10',
        colOffset: '2',
        wrapperSpan: 18,
        labelSpan: 6,
        // wrapperOffset: 1,
        options: []
    },
    {
        Tips: 'Country',
        decorator: 'status',
        required:false,
        showSearch:true,
        type: 'select',
        span: '10',
        colOffset: '1',
        wrapperSpan: 18,
        labelSpan: 6,
        options: []
    },
    {
        Tips: 'Country code',
        decorator: 'aa',
        required: false,
        type: 'select',
        span: '10',
        colOffset: '2',
        wrapperSpan: 18,
        labelSpan: 6,
        options: []
    },
]


export const btn: IBtnList[] = [
    {
        type: 'default',
        icon: 'plus-circle',
        name: 'Add',
        eventType: 'add'
    },
    {
        type: 'default',
        icon: 'form',
        name: 'Edit',
        eventType: 'edit'
    },
    {
        type: 'default',
        icon: 'delete',
        name: 'Delete',
        eventType: 'delete'
    },
    {
        type:"default",
        icon: "file-text",
        name: "Import",
        eventType:'import'
    },
    {
        type:"default",
        icon: "file-text",
        name: "Export",
        eventType:'export'
    },
]
