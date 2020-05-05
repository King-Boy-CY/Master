const CliOptions: any = [{
    name: 'NO',
    value:0
},
{
    name: 'YES',
    value:1
},
]
export  const addFormGroupOptionsData: any[] = [{
    Tips: 'Destination',
    decorator: 'destinationName',
    required: true,
    type: 'select',
    showSearch: true,
    span: 12,
    labelSpan: 6,
    options:[],
},
{
    Tips: 'Dialed digits',
    decorator: 'dialedDigit',
    disabled: true,
    required: true,
    type: 'input',
    options: null,
    span: 12,
    labelSpan: 6,
},
{
    Tips: 'Country',
    decorator: 'country',
    disabled:true,
    required: true,
    type: 'input',
    span: 12,
   labelSpan: 6,
},
{
    Tips: 'Country code',
    decorator: 'countryCode',
    disabled: true,
    required: false,
    type: 'input',
    options: null,
    span: 12,
    labelSpan: 6,
},
{
    Tips: 'CLI',
    decorator: 'isCli',
    required: false,
    type: 'select',
    span: 12,
    labelSpan: 6,
    options:CliOptions
},
 {
    Tips: 'ASR',
    decorator: 'asr',
    required: false,
    type: 'input',
    span: 12,
    labelSpan: 6,
    rules: [{
                validator: (rule: any, value: any, callback: any) => {
                    if (!value) {
                        callback()
                    }
                    const pattern: RegExp = new RegExp(/^\d+$|^\d+\.\d+$/, "g")
                    if (!pattern.test(value)) {
                        callback(`Only number is allowed for ${value}`)
                    } else {
                        callback()
                    }
                }
            }]
},
{
    Tips: 'ALOC',
    decorator: 'aloc',
    required: false,
    type: 'input',
    span: 12,
    labelSpan: 6,
    rules: [{
        validator: (rule: any, value: any, callback: any) => {
            if (!value) {
                callback()
            }
            const pattern: RegExp = new RegExp(/^\d+$|^\d+\.\d+$/, "g")
            if (!pattern.test(value)) {
                callback(`Only number is allowed for ${value}`)
            } else {
                callback()
            }
        }
    }]
},
{
    Tips: 'NER',
    decorator: 'ner',
    required: false,
    type: 'input',
    span: 12,
    labelSpan: 6,
    rules: [{
        validator: (rule: any, value: any, callback: any) => {
            if (!value) {
                callback()
            }
            const pattern: RegExp = new RegExp(/^\d+$|^\d+\.\d+$/, "g")
            if (!pattern.test(value)) {
                callback(`Only number is allowed for ${value}`)
            } else {
                callback()
            }
        }
    }]
},

]

export  const editFormGroupOptionsData: any[] = [{
    Tips: 'Destination',
    decorator: 'destinationName',
    required: true,
    type: 'select',
    showSearch: true,
    span: 12,
    labelSpan: 6,
    options:[],
},
{
    Tips: 'Dialed digits',
    decorator: 'dialedDigit',
    disabled: true,
    required: true,
    type: 'input',
    options: null,
    span: 12,
    labelSpan: 6,
},
{
    Tips: 'Country',
    decorator: 'country',
    disabled:true,
    required: false,
    type: 'input',
    span: 12,
   labelSpan: 6,
},
{
    Tips: 'Country code',
    decorator: 'countryCode',
    disabled: true,
    required: false,
    type: 'input',
    options: null,
    span: 12,
    labelSpan: 6,
},
{
    Tips: 'CLI',
    decorator: 'isCli',
    required: false,
    type: 'select',
    span: 12,
    labelSpan: 6,
    options:CliOptions
},
 {
    Tips: 'ASR',
    decorator: 'asr',
    required: false,
    type: 'input',
    span: 12,
    labelSpan: 6,
    rules: [{
        validator: (rule: any, value: any, callback: any) => {
            if (!value) {
                callback()
            }
            const pattern: RegExp = new RegExp(/^\d+$|^\d+\.\d+$/, "g")
            if (!pattern.test(value)) {
                callback(`Only number is allowed for ${value}`)
            } else {
                callback()
            }
        }
    }]
},
{
    Tips: 'ALOC',
    decorator: 'aloc',
    required: false,
    type: 'input',
    span: 12,
   labelSpan: 6,
   rules: [{
    validator: (rule: any, value: any, callback: any) => {
        if (!value) {
            callback()
        }
        const pattern: RegExp = new RegExp(/^\d+$|^\d+\.\d+$/, "g")
        if (!pattern.test(value)) {
            callback(`Only number is allowed for ${value}`)
        } else {
            callback()
        }
    }
}]
},
{
    Tips: 'NER',
    decorator: 'ner',
    required: false,
    type: 'input',
    span: 12,
    labelSpan: 6,
    rules: [{
        validator: (rule: any, value: any, callback: any) => {
            if (!value) {
                callback()
            }
            const pattern: RegExp = new RegExp(/^\d+$|^\d+\.\d+$/, "g")
            if (!pattern.test(value)) {
                callback(`Only number is allowed for ${value}`)
            } else {
                callback()
            }
        }
    }]
},
]
export const  columnsData: any = [{
    title: 'Destination',
    dataIndex: 'destinationName',
    key: 'destinationName',
    width: 300,
},
{
    title: 'Dialed digits',
    dataIndex: 'dialedDigit',
    key: 'dialedDigit',
    width: 150
},
{
    title: 'Country',
    dataIndex: 'country',
    key: 'country',
    width: 150
},
{
    title: 'Country code',
    dataIndex: 'countryCode',
    key: 'countryCode',
    width: 200
},
{
    title: 'CLI',
    dataIndex: 'isCli',
    key: 'isCli',
    width: 100
},
{
    title: 'ASR',
    dataIndex: 'asr',
    key: 'asr',
    width: 200
},
{
    title: 'ALOC',
    dataIndex: 'aloc',
    key: 'aloc',
    // width:100
},
{
    title: 'NER',
    dataIndex: 'ner',
    key: 'ner',
    width: 170
},
];
export const formOptionsData: any = [{
    Tips: 'Destination',
    name: 'destinationName',
    required: false,
    showSearch: true,
    type: 'input',
    span: 12,
    colSpan: 6,
    options: null,

},
{
    Tips: 'Dialed digits',
    name: 'dialedDigit',
    required: false,
    showSearch: true,
    type: 'input',
    span: 12,
    colSpan: 7,
    options: null
},
{
    Tips: 'Country',
    name: 'country',
    required: false,
    showSearch: true,
    type: 'select',
    span: 12,
    colSpan: 6,
    options: null
},
{
    Tips: 'Country code',
    name: 'countryCode',
    required: false,
    type: 'input',
    span: 12,
    colSpan: 7,
    options: null
}
]
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
{
    name: "Import",
    icon: "form",
    disabled: true,
    tips: "Select a record before you delete it",
    index: 4
},
{
    name: "Export",
    icon: "export",
    disabled: true,
    tips: "Edit Must be selected, and can only be singleton",
    index: 5
}
];