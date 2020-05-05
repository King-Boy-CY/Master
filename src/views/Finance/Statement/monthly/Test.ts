const renderContent = (value: any, row: any, index: any, dataIndex: any) => {
  const obj = {
    children: value,
    attrs: {
      colSpan: 1,
      rowSpan: 1
    },
  };
  if (row.colMerge) {
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
  }
  return obj;
}

// const renderContent = (value:any, row:any, index:any) => {
//   const obj = {
//     children: value,
//     attrs: {
//       colSpan:1
//     },
//   };
//   if (index === 4) {
//     obj.attrs.colSpan = 0;
//   }
//   return obj;
// };
/*高级搜索的搜索数据*/ 
export const  ServicesOptions = [{
  name: 'IDD',
  value: 1
}, {
  name: 'IP',
  value: 2
}, {
  name: 'IPLC',
  value: 3
}]

export const  DirectionOptions = [
  {
  name: 'Inbound',
  value: 1
}, {
  name: 'Outbound',
  value: 2
}, {
  name: 'All',
  value: 3
}
]

/* 表格数据 -> 身体 DataHubbingInbound  DataHubbingOutbound  DataVCInbound  */
export const DataHubbingInbound = [
  {
    key: 1,
    SerialNumber: 1,
    AreaCode: 8531,
    Destination:'Macau-Fixed',
    DestinationType: 'Fixed',
    Service: 'IDD',
    Calls: '111',
    Mins: '13,467',
    Rate_SDR: '0.010000',
    Amount_SDR: '134.67',
    Amount_USD: '203.76',
  },
  {
    key: 2,
    SerialNumber: 2,
    AreaCode: 8532,
    DestinationType: 'Mobile',
    Destination:'Macau-Mobile',
    Service: 'IDD',
    Calls: '142,569',
    Mins: '156,780',
    Rate_SDR: '0.0250000',
    Amount_SDR: '3919.50',
    Amount_USD: '5930.20',
  },
  {
    key: 3,
    SerialNumber: 3,
    AreaCode: 8536,
    Destination:'Macau-2n',
    DestinationType: 'Fixed',
    Service: 'IDD',
    Calls: '3837',
    Mins: '5,678',
    Rate_SDR: '0.0450000',
    Amount_SDR: '255.51',
    Amount_USD: '386.59',
  },
  {
    key: 4,
    SerialNumber: 4,
    AreaCode: 8537,
    Destination: 'Macau-other',
    DestinationType: 'Fixed',
    Service: 'IDD',
    Calls: '5184',
    Mins: '8,953',
    Rate_SDR: '0.0550000',
    Amount_SDR: '492.42',
    Amount_USD: '745.02',
  },
  {
    key: 5,
    SerialNumber: '',
    AreaCode: '',
    Destination: 'Total:(Due To：CTM)',
    DestinationType: '',
    Service: '',
    Calls: '152,734',
    Mins: '184,878',
    Rate_SDR: '',
    Amount_SDR: '4802.10',
    Amount_USD: '7265.57',
    colMerge: ['Destination-DestinationType-Service']
  },
  {
    key: 6,
    SerialNumber: 'Converted SDR to USD @1.513(20181223)',
    AreaCode: '',
    Destination: '',
    DestinationType: '',
    Service: '',
    Calls: '',
    Mins: '',
    Rate_SDR: '',
    Amount_SDR: '',
    Amount_USD: '',
    hideBorder:true,
    colMerge: ['SerialNumber-AreaCode-Destination-DestinationType-Service-Calls-Mins-Rate_SDR-Amount_SDR-Amount_USD']
  }
]
export const DataHubbingOutbound = [
  {
    key: 1,
    SerialNumber: 1,
    AreaCode: 862,
    Destination:'China-Fixed',
    DestinationType: 'Fixed',
    Service: 'IDD',
    Calls: '111.00',
    Mins: '2113.00',
    Rate_SDR: '0.010000',
    Amount_SDR: '21.13',
    Amount_USD: '31.97',
  },
  {
    key: 2,
    SerialNumber: 2,
    AreaCode: 863,
    DestinationType: 'Mobile',
    Destination:'China-Mobile',
    Service: 'IDD',
    Calls: '142,569.00',
    Mins: '1,345,674.00',
    Rate_SDR: '0.0250000',
    Amount_SDR: '35641.85',
    Amount_USD: '50900.12',
  },
  {
    key: 3,
    SerialNumber: 3,
    AreaCode: 8527,
    Destination:'HK-UT Mobile',
    DestinationType: 'Mobile',
    Service: 'IDD',
    Calls: '3,837.00',
    Mins: '5,678.00',
    Rate_SDR: '0.0450000',
    Amount_SDR: '255.51',
    Amount_USD: '2386.59',
  },
  {
    key: 4,
    SerialNumber: 4,
    AreaCode: 1234,
    Destination: 'USA',
    DestinationType: 'Fixed',
    Service: 'IDD',
    Calls: '5,184.00',
    Mins: '9136.00',
    Rate_SDR: '0.0550000',
    Amount_SDR: '502.48',
    Amount_USD: '760.25',
  },
  {
    key: 5,
    SerialNumber: '',
    AreaCode: '',
    Destination: 'Total:(Due To：CMHK)',
    DestinationType: '',
    Service: '',
    Calls: '151,701.00',
    Mins: '1,362,601.00',
    Rate_SDR: '',
    Amount_SDR: '34420.97',
    Amount_USD: '52078.93',
    colMerge: ['Destination-DestinationType-Service']
  },
  {
    key: 6,
    SerialNumber: 'Converted SDR to USD @1.513(20181223)',
    AreaCode: '',
    Destination: '',
    DestinationType: '',
    Service: '',
    Calls: '',
    Mins: '',
    Rate_SDR: '',
    Amount_SDR: '',
    Amount_USD: '',
    hideBorder:true,
    colMerge: ['SerialNumber-AreaCode-Destination-DestinationType-Service-Calls-Mins-Rate_SDR-Amount_SDR-Amount_USD']
  }
]
export const DataVCInbound = [
  {
    key: 1,
    SerialNumber: 1,
    AreaCode: 85326,
    Destination:'Macau mobile',
    DestinationType: 'mobile',
    Service: 'IDD',
    Calls: '256',
    Mins: '6000'
  },
  {
    key: 2,
    SerialNumber: 2,
    AreaCode: 8539,
    Destination:'Macau 2N',
    DestinationType: 'Fixed',
    Service: 'IDD',
    Calls: '456',
    Mins: '3000'
  },
  {
    key: 3,
    SerialNumber: 3,
    AreaCode: '8833,8537',
    Destination:'Macau fixed',
    DestinationType: 'Fixed',
    Service: 'IDD',
    Calls: '342569',
    Mins: '442569'
  },
  {
    key: 4,
    SerialNumber: 'Total',
    AreaCode: 'Fixed Minutes:445,569.00         Mobile Minutes6,000.00',
    Destination: '',
    DestinationType: '',
    Service: '',
    Calls: '',
    Mins: '',
    Rate_SDR: '',
    Amount_SDR: '',
    Amount_USD: '',
    textAlign:true,
    colMerge: ['AreaCode-Destination-DestinationType-Service-Calls-Mins']
  }
]
export const BillingTypeOptions = [
  {
    name: 'Invoice',
    value: 1,
    disabled:false
  },
  {
    name: 'Declaration',
    value: 2,
    disabled:false
  },
]
export const DataVCOutbound = [
  {
    key: 1,
    SerialNumber: 1,
    AreaCode: 869,
    Destination:'China mobile',
    DestinationType: 'mobile',
    Service: 'IDD',
    Calls: '3456',
    Mins: '4000'
  },
  {
    key: 2,
    SerialNumber: 2,
    AreaCode: '8692, 8693, 861',
    Destination:'China fixed',
    DestinationType: 'Fixed',
    Service: 'IDD',
    Calls: '142569',
    Mins: '142569'
  },
  {
    key: 3,
    SerialNumber: 'Total',
    AreaCode: 'Fixed Minutes:142,569.00          Mobile Minutes:4,000.00',
    Destination: '',
    DestinationType: '',
    Service: '',
    Calls: '',
    Mins: '',
    Rate_SDR: '',
    Amount_SDR: '',
    Amount_USD: '',
    textAlign:true,
    colMerge: ['AreaCode-Destination-DestinationType-Service-Calls-Mins']
  }
]

export const columnsHubbing = [
  {
    title: 'Serial Number',
    dataIndex: 'SerialNumber',
    key: 'SerialNumber',
    customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'SerialNumber'),
  },
  {
    title: 'Area code',
    dataIndex: 'AreaCode',
    key: 'AreaCode',
    customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'AreaCode'),
  },
  {
    title: 'Destination',
    dataIndex: 'Destination',
    key: 'Destination',
    customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'Destination'),
  },
  {
    title: 'Destination Type',
    dataIndex: 'DestinationType',
    key: 'DestinationType',
    customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'DestinationType'),
  },
  {
    title: 'Service',
    key: 'Service',
    dataIndex: 'Service',
    customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'Service'),
  },
  {
    title: 'Calls',
    key: 'Calls',
    dataIndex: 'Calls',
    customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'Calls'),
  },
  {
    title: 'Mins',
    key: 'Mins',
    dataIndex: 'Mins',
    customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'Mins'),
  },
  {
    title: 'Rate（SDR）',
    key: 'Rate_SDR',
    dataIndex: 'Rate_SDR',
    customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'Rate_SDR'),
  },
  {
    title: 'Amount（SDR）',
    key: 'Amount_SDR',
    dataIndex: 'Amount_SDR',
    customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'Amount_SDR'),
  },
  {
    title: 'Amount（USD）',
    key: 'Amount_USD',
    dataIndex: 'Amount_USD',
    customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'Amount_USD'),
  }
]
/* 表格数据 -> 头部 */
export const columnsVC: any = [
  {
    title: 'Serial Number',
    dataIndex: 'SerialNumber',
    key: 'SerialNumber',
    customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'SerialNumber'),
  },
  {
    title: 'Area code',
    dataIndex: 'AreaCode',
    key: 'AreaCode',
    customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'AreaCode'),
  },
  {
    title: 'Destination',
    dataIndex: 'Destination',
    key: 'Destination',
    customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'Destination'),
  },
  {
    title: 'Destination Type',
    dataIndex: 'DestinationType',
    key: 'DestinationType',
    customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'DestinationType'),
  },
  {
    title: 'Service',
    key: 'Service',
    dataIndex: 'Service',
    customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'Service'),
  },
  {
    title: 'Calls',
    key: 'Calls',
    dataIndex: 'Calls',
    customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'Calls'),
  },
  {
    title: 'Mins',
    key: 'Mins',
    dataIndex: 'Mins',
    customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'Mins'),
  }
]