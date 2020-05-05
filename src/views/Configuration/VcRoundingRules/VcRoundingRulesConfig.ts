// get 表头下的传入的参数声明
interface columnsConfig{
    title: string,
    dataIndex: string,
    key: string,
    width?: number,
    customRender?: Function
}
interface formOptionsConfig {
    Tips: string,
    name: string,
    required: boolean,
    showSearch?: boolean,
    type: string,
    span: number,
    width?:number,
    colSpan: number,
    options: any,
}
const TreatMaximumAsACapOptions: any = [{
    name: 'NO',
    value:0
},
{
    name: 'YES',
    value:1
},
]

const formOptiondata:formOptionsConfig[]= [{
    Tips: 'Rule name',
    name: 'roundingRuleName',
    required: false,
    showSearch: true,
    type: 'select',
    span: 12,
    colSpan: 6,
    options: null,

},
{
    Tips: 'Minimum value',
    name: 'minimumValue',
    required: false,
    showSearch: true,
    type: 'select',
    span: 12,
    colSpan: 7,
    options: null
},
{
    Tips: 'Initial rounding',
    name: 'initialRounding',
    required: false,
    showSearch: true,
    type: 'select',
    span: 12,
    colSpan: 6,
    options: null
},
{
    Tips: 'Additional rounding',
    name: 'additionalRounding',
    required: false,
    showSearch: true,
    type: 'select',
    span: 12,
    colSpan: 7,
    options: null
},
{
    Tips: 'Maximum',
    name: 'maximumValue',
    required: false,
    type: 'select',
    showSearch: true,
    span: 12,
    colSpan: 6,
    options: null
},
{
    Tips: 'Measure adjustment ',
    name: 'measureAdjustment',
    required: false,
    type: 'select',
    showSearch: true,
    span: 12,
    colSpan: 7,
    options: null
},
{
    Tips: 'Treat maximum as a cap',
    name: 'isMaximumAsCap',
    required: false,
    type: 'select',
    span: 12,
    width: 200,
    colSpan: 6,
    options: TreatMaximumAsACapOptions
}
]
const column = [{
    title: 'Rule name',
    dataIndex: 'roundingRuleName',
    key: 'roundingRuleName',
    width: 300,
},
{
    title: 'Minimum value',
    dataIndex: 'minimumValue',
    key: 'MinimumValue',
    width: 150
},
{
    title: 'Initial rounding',
    dataIndex: 'initialRounding',
    key: 'initialRounding',
    width: 150
},
{
    title: 'Additional rounding',
    dataIndex: 'additionalRounding',
    key: 'additionalRounding',
    width: 200
},
{
    title: 'Maximum',
    dataIndex: 'maximumValue',
    key: 'maximumValue',
    width: 100
},
{
    title: 'Measure adjustment',
    dataIndex: 'measureAdjustment',
    key: 'measureAdjustment',
    width: 200
},
{
    title: 'Treat maximum as a cap',
    dataIndex: 'isMaximumAsCap',
    key: 'isMaximumAsCap',
    customRender: (value: any, row: any, index: any) => {
        const obj = {
            children: value,
        };
        const find: any = TreatMaximumAsACapOptions.find((item: any) => item.value === value)
        if (find) {
            obj.children = find.name
        }
        return obj;
    },
},
{
    title: 'Modified by',
    dataIndex: 'modifiedBy',
    key: 'modifiedBy',
    // width:100
},
{
    title: 'Last modified',
    dataIndex: 'lastModified',
    key: 'lastModified',
    width: 170
},
];
export {
    columnsConfig,formOptionsConfig,column,formOptiondata
}