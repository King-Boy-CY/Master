import moment from 'moment'
export const formoptionData = [
    {
        Tips: 'Begin date',
        name: 'begOfEnd',
        required: true,
        type: 'rangePicker',
        showTime: false,// 增加时间选择功能
        format: 'YYYY-MM-DD',// 自定义时间格式 默认YYYY-MM-DD
        initialValue: [
            moment(new Date(new Date(new Date().toLocaleDateString()).getTime())),
            moment().add(31, 'days').endOf('days')
        ]
    },
    {
        Tips: 'Account',
        name: 'accountName',
        required: false,
        type: 'select',
        showSearch: true,
        options: []
    },

    {
        Tips: 'Destination',
        name: 'refInDestinationName',
        required: false,
        type: 'select',
        options: [],
        showSearch: true
    },
    {
        Tips: 'Dialed digits',
        name: 'preDialedDigit',
        required: false,
        type: 'input',
        isCheckNumber: true
    },
    {
        Tips: 'Country',
        name: 'countryName',
        required: false,
        showSearch: true,
        type: 'select',
        options: []
    },
    {
        Tips: 'Country code',
        name: 'preCountryCode',
        required: false,
        type: 'input',
        isCheckNumber: true
    },
    {
        Tips: 'Service',
        name: 'configServiceName',
        required: false,
        type: 'select',
        options: []
    },
    {
        Tips: 'Origin',
        name: 'priceOrigin',
        required: false,
        type: 'select',
        options: ['Upload', 'VC', 'Reference', 'Exception'],
        sendNumber: true
    }
];
export const tableColumns = [
    {
        title: 'Destination',
        dataIndex: 'refInDestinationName',
        key: 'refInDestinationName',
        sorter: true
    }, {
        title: 'Price',
        dataIndex: 'price',
        key: 'price',
        sorter: true
    }, {
        title: 'Currency',
        dataIndex: 'currencyType',
        key: 'currencyType',
        sorter: true
    }, {
        title: 'Service',
        dataIndex: 'configServiceName',
        key: 'configServiceName',
        sorter: true
    }, {
        title: 'Route class',
        dataIndex: 'routeClassName',
        key: 'routeClassName',
        sorter: true
    }, {
        title: 'Dialed digits',
        dataIndex: 'dialedDigitsList',
        key: 'dialedDigitsList',
        sorter: true,
        scopedSlots: {
            customRender: "commaSplitNumber"
        },
    }, {
        title: 'Country',
        dataIndex: 'countryName',
        key: 'countryName',
        sorter: true
    }, {
        title: 'Country code',
        dataIndex: 'countryCode',
        key: 'countryCode',
        sorter: true
    }, {
        title: 'CLI',
        dataIndex: 'isCli',
        key: 'isCli',
        sorter: true
    }, {
        title: 'Time band',
        dataIndex: 'timeBandName',
        key: 'timeBandName',
        sorter: true
    }, {
        title: 'Rounding rules',
        dataIndex: 'roundingRuleName',
        key: 'roundingRuleName',
        sorter: true
    }, {
        title: 'Origin',
        dataIndex: 'priceOrigin',
        key: 'priceOrigin',
        sorter: true
    }, {
        title: 'Commercial trunk',
        dataIndex: 'commercialTrunkName',
        key: 'commercialTrunkName',
        sorter: true
    }, {
        title: 'Accout',
        dataIndex: 'accountName',
        key: 'accountName',
        sorter: true
    }, {
        title: 'Charge basis',
        dataIndex: 'chargeBasis',
        key: 'chargeBasis',
        sorter: true
    }, {
        title: 'Begin date',
        dataIndex: 'beginDate',
        key: 'beginDate',
        sorter: true
    }, {
        title: 'End date',
        dataIndex: 'endDate',
        key: 'endDate',
        sorter: true
    }, {
        title: 'Outbound reference destination',
        dataIndex: 'refOutDestinationName',
        key: 'refOutDestinationName',
        sorter: true
    }, {
        title: 'File',
        dataIndex: 'sourceName',
        key: 'sourceName',
        sorter: true
    },
]
export const selectedBtn = [{
    name: 'Export',
    icon: 'export',
    index: 1,
    disabled: true
}];
