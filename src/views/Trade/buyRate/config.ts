import {
    tableColumnsInterface,
} from '@/common/dataConfig/interface'
/* 表格数据 -> 头部 */
export const columns: tableColumnsInterface[] = [
    {
        title: 'Destination',
        dataIndex: 'refOutDestinationName',
        key: 'refOutDestinationName',
        options: null,
        sorter: true
    },
    {
        title: 'Rate',
        dataIndex: 'rate',
        key: 'rate',
        width: 140,
        options: null,
        sorter: true
    },
    {
        title: 'Currency',
        dataIndex: 'currencyType',
        key: 'currencyType',
        width: 120,
        sorter: true
    },
    {
        title: 'Type',
        key: 'agreementType',
        dataIndex: 'agreementType',
        width: 120,
        sorter: true
    },
    {
        title: 'Dialed digits',
        key: 'dialedDigitsList',
        dataIndex: 'dialedDigitsList',
        width: 200,
        sorter: true,
        scopedSlots: {
            customRender: "commaSplitNumber"
        },
    },
    {
        title: 'Country',
        key: 'countryName',
        dataIndex: 'countryName',
        width: 140,
        sorter: true
    },
    {
        title: 'Country code',
        key: 'countryCode',
        dataIndex: 'countryCode',
        width: 140,
        sorter: true
    },
    {
        title: 'Service',
        key: 'configServiceName',
        dataIndex: 'configServiceName',
        width: 140,
        sorter: true
    },
    {
        title: 'Commercial trunk',
        key: 'commercialTrunkName',
        dataIndex: 'commercialTrunkName',
        width: 160,
        sorter: true
    },
    {
        title: 'Account',
        key: 'accountName',
        dataIndex: 'accountName',
        width: 160,
        sorter: true
    },
    {
        title: 'CLI',
        key: 'isCli',
        dataIndex: 'isCli',
        width: 120,
        sorter: true
    },
    {
        title: 'Time band',
        key: 'timeBandName',
        dataIndex: 'timeBandName',
        width: 120,
        sorter: true
    },
    {
        title: 'Rounding rules',
        key: 'roundingRuleName',
        dataIndex: 'roundingRuleName',
        width: 160,
        sorter: true
    },
    {
        title: 'Charge basis',
        key: 'chargeBasis',
        dataIndex: 'chargeBasis',
        width: 130,
        sorter: true
    },
    {
        title: 'Begin date',
        key: 'beginDate',
        dataIndex: 'beginDate',
        width: 120,
        sorter: true
    },
    {
        title: 'End date',
        key: 'endDate',
        dataIndex: 'endDate',
        width: 120,
        sorter: true
    },
    {
        title: 'File',
        key: 'sourceName',
        dataIndex: 'sourceName',
        width: 200,
        scopedSlots: { customRender: 'download' },
        sorter: true
    }
]