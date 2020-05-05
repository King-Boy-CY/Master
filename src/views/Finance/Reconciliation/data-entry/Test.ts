import {
  ChargeTypeOptions,
  DirectionOptions,
  BillingTypeOptions,
  ChargeableUnitTypeOptions
} from '@/views/Finance/common/data/index.ts'
import {getAccountOptions,getServiceOptions} from "@/views/Finance/common/js/exchangeData.ts"
let ChargeTypeOptions1 = ChargeTypeOptions()
let DirectionOptions1 = DirectionOptions()
let BillingTypeOptions1 = BillingTypeOptions()
let ChargeableUnitTypeOptions1 = ChargeableUnitTypeOptions()

const renderContent = (value: any, row: any, index: any, dataIndex: any, options?: any) => {
  const obj = {
    children: value,
    attrs: {
      colSpan: 1,
      rowSpan: 1
    },
  };
  if (options && options instanceof Array) {
    const find = options.find((item: any) => item.value === value)
    if (find) {
      obj.children = find.name
    }
  }
  return obj;
}


// const renderNumber = (value: any, row: any, index: any, dataIndex: any, options?: any) => {
//   const obj = {
//     children: value,
//     attrs: {
//       colSpan: 1,
//       rowSpan: 1
//     },
//   };
//   if (options && options instanceof Array) {
//     const find = options.find((item: any) => item.value === value)
//     if (find) {
//       obj.children = find.name
//     }
//   }
//   return obj;
// }

/* 表格数据 -> 身体 */
export const data = [
  {
    key: 0,
    Service: 'IP',
    Account: '中yin123,./',
    ChargeType: 2,
    BillingType: 2,
    Direction: 2,
    Cycle: '',
    Month: '201801',
    BeginDate: '2018-01-01',
    EndDate: '2018-01-31',
    Currency: 'USD',
    ExchangeDate: 'Default',
    Inbound_Destination: '',
    Inbound_TotalTrafficVolume: '',
    Inbound_ChargableUnitType: '',
    Inbound_TotalAmounts_Currency: '',
    Outbound_Destination: 'Hong Kong Fixed,Hong Kong Mobile',
    Outbound_TotalTrafficVolume: '135769',
    Outbound_ChargableUnitType: 'Mins',
    Outbound_TotalAmounts_Currency: '',
    Amount_Currency: '',
    Amount_USD: '',
    OperatorFiles: 'statement.xlsx',
    ModifiedBy: 'vivian',
    LastModified: '2018-3-8  9:15:00',
    Remark: '',
    InboundTableData: [],
    OutboundTableData: [
      {
        Destination: 'Hong Kong Fixed',
        Calls: '6578',
        Mins: '123579',
        ChargeTrafficVolume: '123579',
        Amounts_Currrency: '',
      },
      {
        Destination: 'Hong Kong Mobile',
        Calls: '5579',
        Mins: '12190',
        ChargeTrafficVolume: '12190',
        Amounts_Currrency: '',
      }
    ]
  },
  {
    key: 1,
    Service: 'IP',
    Account: 'account2',
    ChargeType: 1,
    BillingType: 1,
    Direction: 1,
    Cycle: '-',
    Month: '201901',
    BeginDate: '2019-01-01',
    EndDate: '2019-01-31',
    Currency: 'SDR',
    ExchangeDate: '2018-12-23',
    Inbound_Destination: 'Macau-Fixed，Macau-Mobile',
    Inbound_TotalTrafficVolume: '152734',
    Inbound_ChargableUnitType: 'Mins',
    Inbound_TotalAmounts_Currency: '4055.2',
    Outbound_Destination: '',
    Outbound_TotalTrafficVolume: '',
    Outbound_ChargableUnitType: '',
    Outbound_TotalAmounts_Currency: '',
    Amount_Currency: '4055.2',
    Amount_USD: '6155.88',
    OperatorFiles: 'statement.xlsx',
    ModifiedBy: 'vivian',
    LastModified: '2019-5-5  9:00:05',
    InboundTableData: [
      {
        Destination: 'Macau-Fixed',
        Calls: '112',
        Mins: '13469',
        ChargeTrafficVolume: '13469',
        Amounts_Currrency: '158',
      },
      {
        Destination: 'Macau-Mobile',
        Calls: '142572',
        Mins: '139265',
        ChargeTrafficVolume: '139265',
        Amounts_Currrency: '3897.2',
      }
    ],
    OutboundTableData: []
  }
]

export const statusOptions = [
  {
    name: 'Unlocked',
    value: 1
  }, {
    name: 'Locked',
    value: 2
  }, {
    name: 'Disputed',
    value: 3
  }, {
    name: 'Settled',
    value: 4
  }, {
    name: 'Post Close Re-rate',
    value: 5
  }]

export const lockedDateOptions = [
  {
    name: 'Default',
    value: 1
  }, {
    name: '2',
    value: 2
  }, {
    name: 'disputed',
    value: 3
  }, {
    name: 'settled',
    value: 4
  }, {
    name: 'post close Re-rate',
    value: 5
  }]

/* 表格数据 -> 头部 */
export const columns: any = [
  {
    title: 'Service',
    dataIndex: 'serviceName',
    key: 'serviceName',
    width: 100
  },
  {
    title: 'Account',
    dataIndex: 'accountName',
    key: 'accountName ',
    width: 100
  },
  {
    title: 'Charge type',
    dataIndex: 'chargeType',
    key: 'chargeType',
    width: 150,
    customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'ChargeType', ChargeTypeOptions1),
  },
  {
    title: 'Billing type',
    key: 'billingType',
    dataIndex: 'billingType',
    width: 220,
    customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'BillingType', BillingTypeOptions1),
  },
  {
    title: 'Direction',
    key: 'direction',
    dataIndex: 'direction',
    width: 150,
    customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'Direction', DirectionOptions1),
  },
  {
    title: 'Cycle',
    key: 'billingCycle',
    dataIndex: 'billingCycle',
    width: 150,
    // customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'Cycle'),
  }, {
    title: 'Month',
    key: 'billingMonth',
    dataIndex: 'billingMonth',
    width: 150,
    // customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'Month'),
  }, {
    title: 'Begin date',
    key: 'beginDate',
    dataIndex: 'beginDate',
    width: 190,
    // customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'BeginDate'),
  },
  {
    title: 'End date',
    key: 'endDate',
    dataIndex: 'endDate',
    width: 190,
    // customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'EndDate'),
  }, {
    title: 'Currency',
    key: 'currency',
    dataIndex: 'currency',
    width: 200,
   }, {
    title: 'Exchange date',
    key: 'exchangeDate',
    dataIndex: 'exchangeDate',
    width: 190,
    // customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'ExchangeDate'),
  }, {
    title: 'Inbound data',
    children: [
      {
        title: 'Destination',
        key: 'inboundDestinations',
        dataIndex: 'inboundDestinations',
        width: 300,
        // customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'LastModified'),
      },
      {
        title: 'Total charge traffic volume',
        key: 'inboundTotalVolume',
        dataIndex: 'inboundTotalVolume',
        width: 200,
        customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'inboundTotalVolume')
      },
      {
        title: 'Chargable unit type',
        key: 'inboundChargeableUnitType',
        dataIndex: 'inboundChargeableUnitType',
        width: 200,
        customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'inboundChargeableUnitType',ChargeableUnitTypeOptions1)
      }, {
        title: 'Total amount (Currency)',
        key: 'inboundTotalAmount',
        dataIndex: 'inboundTotalAmount',
        width: 200,
        customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'inboundTotalAmount',ChargeableUnitTypeOptions1)

      },
    ]
  },
  {
    title: 'Outbound data',
    children: [
      {
        title: 'Destination',
        key: 'outboundDestinations',
        dataIndex: 'outboundDestinations',
        width: 300,
        // customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'LastModified'),
      },
      {
        title: 'Total charge traffic volume',
        key: 'outboundTotalVolume',
        dataIndex: 'outboundTotalVolume',
        width: 200,
      },
      {
        title: 'Chargable unit type',
        key: 'outboundChargeableUnitType',
        dataIndex: 'outboundChargeableUnitType',
        width: 200,
        customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'outboundChargeableUnitType',ChargeableUnitTypeOptions1)
      }, {
        title: 'Total amount (Currency)',
        key: 'outboundTotalAmount',
        dataIndex: 'outboundTotalAmount',
        width: 200,
      },
    ]
  }, {
    title: 'Netting data',
    children: [
      {
        title: 'Amount (Currency)',
        key: 'totalAmount',
        dataIndex: 'totalAmount',
        width: 200,
      },
      {
        title: 'Amount (USD)',
        key: 'totalUSDAmount',
        dataIndex: 'totalUSDAmount',
        width: 200,
      }
    ]
  },
  {
    title: 'Operator files',
    key: 'operatorFiles',
    dataIndex: 'operatorFiles',
    width: 200,
    scopedSlots: {customRender: 'download'}
  }, {
    title: 'Modified by',
    key: 'modifiedBy',
    dataIndex: 'modifiedBy',
    width: 200,
  }, {
    title: 'Last modified',
    key: 'lastModified',
    dataIndex: 'lastModified',
    width: 210,
  },
]