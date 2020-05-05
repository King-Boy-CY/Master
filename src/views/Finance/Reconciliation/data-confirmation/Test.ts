import {
  BillingTypeOptions,
  DirectionOptions,
  ChargeTypeOptions,
  ChargeableUnitTypeOptions,
  DifferenceOptions
} from '@/views/Finance/common/data/index.ts'
let DirectionOptions1: any[] = DirectionOptions();
let BillingTypeOptions1: any[] = BillingTypeOptions();
let ChargeTypeOptions1: any[] = ChargeTypeOptions();
let ChargeableUnitTypeOptions1: any[] = ChargeableUnitTypeOptions();
let DifferenceOptions1: any[] = DifferenceOptions();

const renderContent = (value: any, row: any, index: any, dataIndex: any, options?: any) => {
  const obj = {
    children: value,
    attrs: {
      colSpan: 1,
      rowSpan: 1
    },
  };
  /*if (row.colMerge) {
    let firstArr: any = []
    let otherArr: any = []
    for (let i = 0; i < row.colMerge.length; i++) {
      const colArr = row.colMerge[i].split('-')
      firstArr.push({name: colArr[0], len: colArr.length})
      otherArr.push(colArr.slice(1))
    }
    otherArr = [].concat(...otherArr)
    // otherArr = Array.prototype.concat.call([],...otherArr)
    const find1: any = firstArr.find((item: any) => item.name === dataIndex)
    if (find1) {
      obj.attrs.colSpan = +find1.len;
    } else {
      const find2: any = otherArr.find((item: any) => item === dataIndex)
      if (find2) {
        obj.attrs.colSpan = 0;
      }
    }
  }
  if (row.rowMerge && row.rowMerge.length) {
    const find: any = row.rowMerge.find((item: any) => item.colName === dataIndex)
    if (find) {
      obj.attrs.rowSpan = +find.rowSpan;
    }
  }*/
  if (options && options instanceof Array) {
    // obj.children = options[value]
    const find = options.find((item: any) => item.value === value)
    if (find) {
      obj.children = find.name
    }
  }
  return obj;
}

/* 表格数据 -> 身体 */
export const data = [
  // {
  //   key: 0,
  //   Service: 'IDD',
  //   Account: 'KT',
  //   ChargeType: 2,
  //   BillingType: 2,
  //   Direction: 2,
  //   Cycle: '-',
  //   Month: '2018-01',
  //   BeginDate: '2018-01-01',
  //   EndDate: '2018-01-31',
  //   OutboundDestination:'Hong Kong Fixed,Hong Kong Mobile',
  //   InboundDestination: '-',
  //   SystemAmounts_USD: '-',
  //   LoggingAmouts_USD: '-',
  //   'Difference_%': '-',
  //   Difference_value: '-',
  //   SystemChargeTrafficVolume:'126789',
  //   LoggingChargeTrafficVolume:'123579',
  //   ChargeableUnitType:'mins',
  //   Difference_ChargeTrafficVolume:'2.60',
  //   Difference_ChargeTrafficVolumeValue:'3210',
  //   Status: 2,
  //   ModifiedBy: 'vivian',
  //   LastModified: '2018-3-11  9:15:00',
  //   Remark: '6666',
    // modelData: [
    //   {
    //     key: 0,
    //     ComparisonItem: 'Mins',
    //     Inbound_CTM: '3000',
    //     Inbound_KDDI: '1500',
    //     Outbound_CTM: '2100',
    //     Outbound_KDDI: '1500',
    //     Netting_CTM: '2200',
    //     Netting_KDDI: '1500',
    //   }, {
    //     key: 1,
    //     ComparisonItem: 'Calls',
    //     Inbound_CTM: '2000',
    //     Inbound_KDDI: '1500',
    //     Outbound_CTM: '2000',
    //     Outbound_KDDI: '1500',
    //     Netting_CTM: '2000',
    //     Netting_KDDI: '1500',
    //   }, {
    //     key: 2,
    //     ComparisonItem: 'Charge traffic volume',
    //     Inbound_CTM: '2000',
    //     Inbound_KDDI: '1500',
    //     Outbound_CTM: '2000',
    //     Outbound_KDDI: '1500',
    //     Netting_CTM: '2000',
    //     Netting_KDDI: '1500',
    //   }, {
    //     key: 3,
    //     ComparisonItem: 'Amouts(USD)',
    //     Inbound_CTM: '2000',
    //     Inbound_KDDI: '1500',
    //     Outbound_CTM: '2000',
    //     Outbound_KDDI: '1500',
    //     Netting_CTM: '2000',
    //     Netting_KDDI: '1500',
    //   }
    // ]
  // },
  // {
  //   key: 1,
  //   Service: 'IDD',
  //   Account: 'CMHK',
  //   ChargeType: 1,
  //   BillingType: 1,
  //   Direction: 1,
  //   Cycle: '-',
  //   Month: '2019-01',
  //   BeginDate: '2019-01-01',
  //   EndDate: '2019-01-31',
  //   OutboundDestination:'-',
  //   InboundDestination: 'Macau-Fixed,Macau-Mobile',
  //   SystemAmounts_USD: '6133.96',
  //   LoggingAmouts_USD: '6155.68',
  //   'Difference_%': '-0.35',
  //   Difference_value: '-21.72',
  //   SystemChargeTrafficVolume:'170247',
  //   LoggingChargeTrafficVolume:'170279',
  //   ChargeableUnitType:'mins',
  //   Difference_ChargeTrafficVolume:'-0.02',
  //   Difference_ChargeTrafficVolumeValue:'-32',
  //   Status: 1,
  //   ModifiedBy: 'vivian',
  //   LastModified: '2019-5-9  9:00:05',
  //   Remark: '8888',
    // modelData: [
    //   {
    //     key: 0,
    //     ComparisonItem: 'Mins',
    //     Inbound_CTM: '3100',
    //     Inbound_KDDI: '1500',
    //     Outbound_CTM: '2100',
    //     Outbound_KDDI: '1500',
    //     Netting_CTM: '2200',
    //     Netting_KDDI: '1500',
    //   }, {
    //     key: 1,
    //     ComparisonItem: 'Calls',
    //     Inbound_CTM: '2000',
    //     Inbound_KDDI: '1500',
    //     Outbound_CTM: '2000',
    //     Outbound_KDDI: '1500',
    //     Netting_CTM: '2000',
    //     Netting_KDDI: '1500',
    //   }, {
    //     key: 2,
    //     ComparisonItem: 'Charge traffic volume',
    //     Inbound_CTM: '2000',
    //     Inbound_KDDI: '1500',
    //     Outbound_CTM: '2000',
    //     Outbound_KDDI: '1500',
    //     Netting_CTM: '2000',
    //     Netting_KDDI: '1500',
    //   }, {
    //     key: 3,
    //     ComparisonItem: 'Amount(USD)',
    //     Inbound_CTM: '2000',
    //     Inbound_KDDI: '1500',
    //     Outbound_CTM: '2000',
    //     Outbound_KDDI: '1500',
    //     Netting_CTM: '6133.96',
    //     Netting_KDDI: '6155.68',
    //   }
    // ]
  // }
]
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
    key: 'accountName',
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
    width: 300,
  }, {
    title: 'Month',
    key: 'billingMonth',
    dataIndex: 'billingMonth',
    width: 300,
  }, {
    title: 'Begin date',
    key: 'beginDate',
    dataIndex: 'beginDate',
    width: 200,
  },
  {
    title: 'End date',
    key: 'endDate',
    dataIndex: 'endDate',
    width: 200,
  },{
    title: 'Inbound data',
    children: [
      {
        title: 'Destination',
        key: 'inboundDestList',
        dataIndex: 'inboundDestList',
        width: 150,
      },{
        title: 'System Charge traffic volume',
        key: 'inboundVolume1',
        dataIndex: 'inboundVolume1',
        width: 200,
      },{
        title: 'Logging Charge traffic volume',
        key: 'inboundVolume2',
        dataIndex: 'inboundVolume2',
        width: 200,
      },{
        title: 'Chargable unit type',
        key: 'inboundChargeableUnitType',
        dataIndex: 'inboundChargeableUnitType',
        width: 200,
        customRender: (value: any, row: any, index: any) => renderContent(value, row, index,"inboundChargeableUnitType", ChargeableUnitTypeOptions1 )
      }, {
        title: 'System amount',
        key: 'inboundAmount1',
        dataIndex: 'inboundAmount1',
        width: 200,
      },{
        title: 'Logging amount',
        key: 'inboundAmount2',
        dataIndex: 'inboundAmount2',
        width: 200,
      },{
        title: 'Difference_ Charge traffic volume（%）',
        key: 'inboundMinsDifference',
        dataIndex: 'inboundMinsDifference',
        width: 200,
      },{
        title: 'Difference_ Charge traffic volume（value）',
        key: 'inboundMinsDifferencePercent',
        dataIndex: 'inboundMinsDifferencePercent',
        width: 250,
      },
    ]
  },{
    title: 'Outbound data',
    children: [
      {
        title: 'Destination',
        key: 'outboundDestList',
        dataIndex: 'outboundDestList',
        width: 150,
      },{
        title: 'System Charge traffic volume',
        key: 'outboundVolume1',
        dataIndex: 'outboundVolume1',
        width: 200,
      },{
        title: 'Logging Charge traffic volume',
        key: 'outboundVolume2',
        dataIndex: 'outboundVolume2',
        width: 200,
      },{
        title: 'Chargable unit type',
        key: 'outboundChargeableUnitType',
        dataIndex: 'outboundChargeableUnitType',
        width: 200,
        customRender: (value: any, row: any, index: any) => renderContent(value, row, index, "outboundChargeableUnitType" ,ChargeableUnitTypeOptions1)
      }, {
        title: 'System amount',
        key: 'outboundAmount1',
        dataIndex: 'outboundAmount1',
        width: 200,
      },{
        title: 'Logging amount',
        key: 'outboundAmount2',
        dataIndex: 'outboundAmount2',
        width: 200,
      },{
        title: 'Difference_ Charge traffic volume（%）',
        key: 'outboundMinsDifference',
        dataIndex: 'outboundMinsDifference',
        width: 200,
      },{
        title: 'Difference_ Charge traffic volume（value）',
        key: 'outboundMinsDifferencePercent',
        dataIndex: 'outboundMinsDifferencePercent',
        width: 250,
      },
    ]
  },{
    title: 'Netting data',
    children: [
      {
        title: 'System Amount（USD）',
        key: 'nettingAmount1',
        dataIndex: 'nettingAmount1',
        width: 200,
      },{
        title: 'Logging Amount（USD）',
        key: 'nettingAmount2',
        dataIndex: 'nettingAmount2',
        width: 200,
      }, {
        title: 'Difference_Amount（%）',
        key: 'nettingAmountDifference',
        dataIndex: 'nettingAmountDifference',
        width: 200,
      },{
        title: 'Difference_Amount（value）',
        key: 'nettingAmountDifferencePercent',
        dataIndex: 'nettingAmountDifferencePercent',
        width: 200,
      }
    ]
  },{
    title: 'Status',
    key: 'dataConfirmationStatus',
    dataIndex: 'dataConfirmationStatus',
    width: 200,
    customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'Status', DifferenceOptions1),
  }, {
    title: 'Modified by',
    key: 'modifiedBy',
    dataIndex: 'modifiedBy',
    width: 200,
  }, {
    title: 'Last modified',
    key: 'lastModified',
    dataIndex: 'lastModified',
    width: 400,
  },
]


const modelRenderContent = (value: any, row: any, index: any, dataIndex: any, options?: any) => {
  const obj = {
    children: value,
    attrs: {
      colSpan: 1,
      rowSpan: 1
    },
  };
  /*if (row.colMerge) {
    let firstArr: any = []
    let otherArr: any = []
    for (let i = 0; i < row.colMerge.length; i++) {
      const colArr = row.colMerge[i].split('-')
      firstArr.push({name: colArr[0], len: colArr.length})
      otherArr.push(colArr.slice(1))
    }
    otherArr = [].concat(...otherArr)
    // otherArr = Array.prototype.concat.call([],...otherArr)
    const find1: any = firstArr.find((item: any) => item.name === dataIndex)
    if (find1) {
      obj.attrs.colSpan = +find1.len;
    } else {
      const find2: any = otherArr.find((item: any) => item === dataIndex)
      if (find2) {
        obj.attrs.colSpan = 0;
      }
    }
  }
  if (row.rowMerge && row.rowMerge.length) {
    const find: any = row.rowMerge.find((item: any) => item.colName === dataIndex)
    if (find) {
      obj.attrs.rowSpan = +find.rowSpan;
    }
  }*/
  if (options && options instanceof Array) {
    // obj.children = options[value]
    const find = options.find((item: any) => item.value === value)
    if (find) {
      obj.children = find.name
    }
  }
  const head = dataIndex.split('_')[0]
  switch (dataIndex) {
    case 'ComparisonItem':
      const arr = ['Mins', 'Calls', 'Charge traffic volume', 'Amount(USD)']
      obj.children = arr[index % 4]
      break;
    case 'Inbound_Difference_rate':
    case 'Outbound_Difference_rate':
    case 'Netting_Difference_rate':
      // if (row[dataIndex]) {
      //   obj.children = row[dataIndex]
      // } else {
      if (row[`${head}_CTM`] && row[`${head}_KDDI`] && row[`${head}_CTM`] != '0' && row[`${head}_KDDI`] != '0') {
        obj.children = ((row[`${head}_CTM`] - row[`${head}_KDDI`]) / row[`${head}_KDDI`] * 100).toFixed(2)
      } else if (row[`${head}_CTM`] == '0' || row[`${head}_KDDI`] == '0') {
        // obj.children = '0%'
        obj.children = '0'
      } else {
        obj.children = ''
      }
      // }
      break;
    case 'Inbound_Difference_value':
    case 'Outbound_Difference_value':
    case 'Netting_Difference_value':
      // if (row[dataIndex]) {
      //   obj.children = row[dataIndex]
      // } else {
      if (row[`${head}_CTM`] && row[`${head}_KDDI`]) {
        obj.children = (row[`${head}_CTM`] - row[`${head}_KDDI`]).toFixed(2)
      } else if (row[`${head}_CTM`] == '0' || row[`${head}_KDDI`] == '0') {
        obj.children = 0
      } else {
        obj.children = ''
      }
      // }
      break;
  }
  return obj;
}

export const modelColumns: any = [
  {
    title: 'Comparison item',
    dataIndex: 'ComparisonItem',
    key: 'ComparisonItem',
    width: 80,
    // fixed: true,
    customRender: (value: any, row: any, index: any) => modelRenderContent(value, row, index, 'ComparisonItem'),
  },
  {
    title: 'Inbound data',
    children: [
      {
        title: 'CTM',
        dataIndex: 'Inbound_CTM',
        key: 'Inbound_CTM',
        width: 80,
      },
      {
        title: 'KDDI',
        dataIndex: 'Inbound_KDDI',
        key: 'Inbound_KDDI',
        width: 80,
      },
      {
        title: 'Difference(%)',
        dataIndex: 'Inbound_Difference_rate',
        key: 'Inbound_Difference_rate',
        width: 80,
        customRender: (value: any, row: any, index: any) => modelRenderContent(value, row, index, 'Inbound_Difference_rate'),
      },
      {
        title: 'Difference(value)',
        dataIndex: 'Inbound_Difference_value',
        key: 'Inbound_Difference_value',
        width: 80,
        customRender: (value: any, row: any, index: any) => modelRenderContent(value, row, index, 'Inbound_Difference_value'),
      },
    ]
  },
  {
    title: 'Outbound data',
    children: [
      {
        title: 'CTM',
        dataIndex: 'Outbound_CTM',
        key: 'Outbound_CTM',
        width: 80,
      },
      {
        title: 'KDDI',
        dataIndex: 'Outbound_KDDI',
        key: 'Outbound_KDDI',
        width: 80,
      },
      {
        title: 'Difference(%)',
        dataIndex: 'Outbound_Difference_rate',
        key: 'Outbound_Difference_rate',
        width: 80,
        customRender: (value: any, row: any, index: any) => modelRenderContent(value, row, index, 'Outbound_Difference_rate'),
      },
      {
        title: 'Difference(value)',
        dataIndex: 'Outbound_Difference_value',
        key: 'Outbound_Difference_value',
        width: 80,
        customRender: (value: any, row: any, index: any) => modelRenderContent(value, row, index, 'Outbound_Difference_value'),
      },
    ]
  },
  {
    title: 'Netting data',
    children: [
      {
        title: 'CTM',
        dataIndex: 'Netting_CTM',
        key: 'Netting_CTM',
        width: 80,
      },
      {
        title: 'KDDI',
        dataIndex: 'Netting_KDDI',
        key: 'Netting_KDDI',
        width: 80,
      },
      {
        title: 'Difference(%)',
        dataIndex: 'Netting_Difference_rate',
        key: 'Netting_Difference_rate',
        width: 80,
        customRender: (value: any, row: any, index: any) => modelRenderContent(value, row, index, 'Netting_Difference_rate'),
      },
      {
        title: 'Difference(value)',
        dataIndex: 'Netting_Difference_value',
        key: 'Netting_Difference_value',
        width: 80,
        customRender: (value: any, row: any, index: any) => modelRenderContent(value, row, index, 'Netting_Difference_value'),
      },
    ]
  },
]
export const modelData: any = [
  {
    key: 0,
    ComparisonItem: 'Mins',
    Inbound_CTM: undefined,
    Inbound_KDDI: undefined,
    'Inbound_Difference_rate': undefined,
    Inbound_Difference_value: undefined,
    Outbound_CTM: undefined,
    Outbound_KDDI: undefined,
    'Outbound_Difference_rate': undefined,
    Outbound_Difference_value: undefined,
    Netting_CTM: undefined,
    Netting_KDDI: undefined,
    'Netting_Difference_rate': undefined,
    Netting_Difference_value: undefined,
  }, {
    key: 1,
    ComparisonItem: 'Calls',
    Inbound_CTM: undefined,
    Inbound_KDDI: undefined,
    'Inbound_Difference_rate': undefined,
    Inbound_Difference_value: undefined,
    Outbound_CTM: undefined,
    Outbound_KDDI: undefined,
    'Outbound_Difference_rate': undefined,
    Outbound_Difference_value: undefined,
    Netting_CTM: undefined,
    Netting_KDDI: undefined,
    'Netting_Difference_rate': undefined,
    Netting_Difference_value: undefined,
  }, {
    key: 2,
    ComparisonItem: 'Charge traffic volume',
    Inbound_CTM: undefined,
    Inbound_KDDI: undefined,
    'Inbound_Difference_rate': undefined,
    Inbound_Difference_value: undefined,
    Outbound_CTM: undefined,
    Outbound_KDDI: undefined,
    'Outbound_Difference_rate': undefined,
    Outbound_Difference_value: undefined,
    Netting_CTM: undefined,
    Netting_KDDI: undefined,
    'Netting_Difference_rate': undefined,
    Netting_Difference_value: undefined,
  }, {
    key: 3,
    ComparisonItem: 'Amount(USD)',
    Inbound_CTM: undefined,
    Inbound_KDDI: undefined,
    'Inbound_Difference_rate': undefined,
    Inbound_Difference_value: undefined,
    Outbound_CTM: undefined,
    Outbound_KDDI: undefined,
    'Outbound_Difference_rate': undefined,
    Outbound_Difference_value: undefined,
    Netting_CTM: undefined,
    Netting_KDDI: undefined,
    'Netting_Difference_rate': undefined,
    Netting_Difference_value: undefined,
  }]