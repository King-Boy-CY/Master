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
      firstArr.push({ name: colArr[0], len: colArr.length })
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
export const StatementNumberOptions = [
  {
    name:"201909081118183217",
    value:1  //CMCC
  },
  {
    name:"201903081118183217",
    value:2   //CMHK
  },
  {
    name:"201908071118185858",
    value:3   //KDDI
  },
  {
    name:"201807021218183217",
    value:4   //2018KT
  },
  {
    name:"201905081518158868",
    value:5    //2019KT
  }
]
/* 表格数据 -> 身体 */

export const statusOptions = [
  {
    name: 'Confirmed',
    value: 1
  },
  {
    name: 'Processing',
    value: 2
  }]
export const DifferenceOptions = [
  {
    name: 'Confirmed',
    value: 1
  }, {
    name: 'Processing',
    value: 2
  }, {
    name: 'All',
    value: 3
  }]
export const SettleTypeOptions = [
  {
    name: 'System',
    value: 1
  }, {
    name: 'Manual',
    value: 2
  }]
export const DataSourceTypeOptions = [
  {
    name: 'Operator',
    value: 1
  }, {
    name: 'System',
    value: 2
  }
]
export const InboundItemOptions = [
  {
    name: 'Charge Traffic',
    value: 1
  }, {
    name: 'amount',
    value: 2
  }
]
export const StatementKTTS = [
  {
    key: 1,
    SerialNumber: '1',
    Operator: 'KT',
    Inbound_Mins: '113567.00',
    Inbound_Amount_SDR: '35678.25',
    Inbound_Amount_USD: '35678.25',
    Inbound_Total_R02: '35678.25',
    Outbound_Mins: '213567.00',
    Outbound_Amount_SDR: '56788.68',
    Outbound_Amount_USD: '56788.68',
    Outbound_Total_R02: '56788.68',
    Netting_Amount_USD: '-21110.43',
  },
  {
    key: 2,
    SerialNumber: 'Total',
    Operator: '',
    Inbound_Mins: '113567.00',
    Inbound_Amount_SDR: '35678.25',
    Inbound_Amount_USD: '35678.25',
    Inbound_Total_R02: '35678.25',
    Outbound_Mins: '213567.00',
    Outbound_Amount_SDR: '56788.68',
    Outbound_Amount_USD: '56788.68',
    Outbound_Total_R02: '56788.68',
    Netting_Amount_USD: '-21110.43',
    colMerge: ['SerialNumber-Operator'],
  },
  {
    key: 3,
    SerialNumber: 'Data source type:system',
    // SerialNumber: 'Issuer:Jack',
    Operator: '',
    Inbound_Mins: 'issuer:vivian',
    Inbound_Amount_SDR: '',
    Inbound_Amount_USD: 'issuing time:2019/5/8 ',
    Inbound_Total_R02: '',
    Outbound_Mins: 'Auditor:Lily',
    Outbound_Amount_SDR: '',
    Outbound_Amount_USD: '',
    Outbound_Total_R02: 'Auditing time:2019/5/9',
    Netting_Amount_USD: '',
    colMerge: ['SerialNumber-Operator', 'Inbound_Mins-Inbound_Amount_SDR', 'Inbound_Amount_USD-Inbound_Total_R02', 'Outbound_Mins-Outbound_Amount_SDR-Outbound_Amount_USD', 'Outbound_Total_R02-Netting_Amount_USD'],
  },

  {
    key: 4,
    SerialNumber: 'Details',
    Operator: '',
    Inbound_Mins: '',
    Inbound_Amount_SDR: '',
    Inbound_Amount_USD: '',
    Inbound_Total_R02: '',
    Outbound_Mins: '',
    Outbound_Amount_SDR: '',
    Outbound_Amount_USD: '',
    Outbound_Total_R02: '',
    Netting_Amount_USD: '',
    subheading: 'Details',
    colMerge: ['SerialNumber-Operator-Inbound_Mins-Inbound_Amount_SDR-Inbound_Amount_USD-Inbound_Total_R02-Outbound_Mins-Outbound_Amount_SDR-Outbound_Amount_USD-Outbound_Total_R02-Netting_Amount_USD'],
  },
  {
    key: 5,
    SerialNumber: 'Month',
    Operator: '',
    Inbound_Mins: 'Inbound',
    Inbound_Amount_SDR: '',
    Inbound_Amount_USD: '',
    Inbound_Total_R02: '',
    Outbound_Mins: 'Outbound',
    Outbound_Amount_SDR: '',
    Outbound_Amount_USD: '',
    Outbound_Total_R02: '',
    Netting_Amount_USD: '',
    // -Netting_Amount_USD-Cycle
    subheading: 'Inbound',
    rowMerge: [{
      colName: 'SerialNumber',
      rowSpan: 2
    }, {
      colName: 'Operator',
      rowSpan: 2
    }],
    colMerge: ['SerialNumber-Operator', 'Inbound_Mins-Inbound_Amount_SDR-Inbound_Amount_USD-Inbound_Total_R02', 'Outbound_Mins-Outbound_Amount_SDR-Outbound_Amount_USD-Outbound_Total_R02-Netting_Amount_USD'],
  },
  {
    key: 6,
    SerialNumber: '',
    Operator: '',
    Inbound_Mins: 'Destination',
    Inbound_Amount_SDR: '',
    Inbound_Amount_USD: 'Data source',
    Inbound_Total_R02: 'Type',
    Outbound_Mins: 'Destination',
    Outbound_Amount_SDR: '',
    Outbound_Amount_USD: 'Data source',
    Outbound_Total_R02: 'Type',
    Netting_Amount_USD: '',
    subheading: 'Inbound',
    rowMerge: [{
      colName: 'SerialNumber',
      rowSpan: 0
    }, {
      colName: 'Operator',
      rowSpan: 0
    }],
    colMerge: ['SerialNumber-Operator', 'Inbound_Mins-Inbound_Amount_SDR', 'Outbound_Mins-Outbound_Amount_SDR'],
  },
  {
    key: 7,
    SerialNumber: '201901-201903',
    Operator: '',
    Inbound_Mins: '-',
    Inbound_Amount_SDR: '',
    Inbound_Amount_USD: '-',
    Inbound_Total_R02: '-',
    Outbound_Mins: '-',
    Outbound_Amount_SDR: '',
    Outbound_Amount_USD: '-',
    Outbound_Total_R02: '-',
    Netting_Amount_USD: '',
    colMerge: ['SerialNumber-Operator', 'Inbound_Mins-Inbound_Amount_SDR', 'Outbound_Mins-Outbound_Amount_SDR'],
  },

]
export const StatementKTS = [
  {
    key: 1,
    SerialNumber: '1',
    Operator: 'KT',
    Inbound_Mins: '-',
    Inbound_Amount_SDR: '-',
    Inbound_Amount_USD: '-',
    Inbound_Total_R02: '-',
    Outbound_Mins: '22408121.00',
    Outbound_Amount_SDR: '206400.00',
    Outbound_Amount_USD: '3122283.20',
    Outbound_Total_R02: '312283.20',
    Netting_Amount_USD: '-312283.20',
  },
  {
    key: 2,
    SerialNumber: 'Total',
    Operator: '',
    Inbound_Mins: '-',
    Inbound_Amount_SDR: '-',
    Inbound_Amount_USD: '-',
    Inbound_Total_R02: '-',
    Outbound_Mins: '22408121.00',
    Outbound_Amount_SDR: '206400.00',
    Outbound_Amount_USD: '3122283.20',
    Outbound_Total_R02: '312283.20',
    Netting_Amount_USD: '-312283.20',
    colMerge: ['SerialNumber-Operator'],
  },
  {
    key: 3,
    SerialNumber: 'Data source type:Operator',
    // SerialNumber: 'Issuer:Jack',
    Operator: '',
    Inbound_Mins: 'issuer:vivian',
    Inbound_Amount_SDR: '',
    Inbound_Amount_USD: 'issuing time:2018/7/3',
    Inbound_Total_R02: '',
    Outbound_Mins: 'Auditor:Lily',
    Outbound_Amount_SDR: '',
    Outbound_Amount_USD: '',
    Outbound_Total_R02: 'Auditing time:2018/7/20',
    Netting_Amount_USD: '',
    colMerge: ['SerialNumber-Operator', 'Inbound_Mins-Inbound_Amount_SDR', 'Inbound_Amount_USD-Inbound_Total_R02', 'Outbound_Mins-Outbound_Amount_SDR-Outbound_Amount_USD', 'Outbound_Total_R02-Netting_Amount_USD'],
  },

  {
    key: 4,
    SerialNumber: 'Details',
    Operator: '',
    Inbound_Mins: '',
    Inbound_Amount_SDR: '',
    Inbound_Amount_USD: '',
    Inbound_Total_R02: '',
    Outbound_Mins: '',
    Outbound_Amount_SDR: '',
    Outbound_Amount_USD: '',
    Outbound_Total_R02: '',
    Netting_Amount_USD: '',
    subheading: 'Details',
    colMerge: ['SerialNumber-Operator-Inbound_Mins-Inbound_Amount_SDR-Inbound_Amount_USD-Inbound_Total_R02-Outbound_Mins-Outbound_Amount_SDR-Outbound_Amount_USD-Outbound_Total_R02-Netting_Amount_USD'],
  },
  {
    key: 5,
    SerialNumber: 'Month',
    Operator: '',
    Inbound_Mins: 'Inbound',
    Inbound_Amount_SDR: '',
    Inbound_Amount_USD: '',
    Inbound_Total_R02: '',
    Outbound_Mins: 'Outbound',
    Outbound_Amount_SDR: '',
    Outbound_Amount_USD: '',
    Outbound_Total_R02: '',
    Netting_Amount_USD: '',
    // -Netting_Amount_USD-Cycle
    subheading: 'Inbound',
    rowMerge: [{
      colName: 'SerialNumber',
      rowSpan: 2
    }, {
      colName: 'Operator',
      rowSpan: 2
    }],
    colMerge: ['SerialNumber-Operator', 'Inbound_Mins-Inbound_Amount_SDR-Inbound_Amount_USD-Inbound_Total_R02', 'Outbound_Mins-Outbound_Amount_SDR-Outbound_Amount_USD-Outbound_Total_R02-Netting_Amount_USD'],
  },
  {
    key: 6,
    SerialNumber: '',
    Operator: '',
    Inbound_Mins: 'Destination',
    Inbound_Amount_SDR: '',
    Inbound_Amount_USD: 'Data source',
    Inbound_Total_R02: 'Type',
    Outbound_Mins: 'Destination',
    Outbound_Amount_SDR: '',
    Outbound_Amount_USD: 'Data source',
    Outbound_Total_R02: 'Type',
    Netting_Amount_USD: '',
    subheading: 'Inbound',
    rowMerge: [{
      colName: 'SerialNumber',
      rowSpan: 0
    }, {
      colName: 'Operator',
      rowSpan: 0
    }],
    colMerge: ['SerialNumber-Operator', 'Inbound_Mins-Inbound_Amount_SDR', 'Outbound_Mins-Outbound_Amount_SDR'],
  },
  {
    key: 7,
    SerialNumber: '201801',
    Operator: '',
    Inbound_Mins: '-',
    Inbound_Amount_SDR: '',
    Inbound_Amount_USD: '-',
    Inbound_Total_R02: '-',
    Outbound_Mins: 'Hong Kong Fixed/Hong Kong Mobile',
    Outbound_Amount_SDR: '',
    Outbound_Amount_USD: 'KT',
    Outbound_Total_R02: 'Traffic',
    Netting_Amount_USD: '',
    colMerge: ['SerialNumber-Operator', 'Inbound_Mins-Inbound_Amount_SDR', 'Outbound_Mins-Outbound_Amount_SDR'],
  },

]
export const StatementIDDS = [
  {
    key: 1,
    SerialNumber: '1',
    Operator: 'KDDI',
    Inbound_Mins: '7726225.00',
    Inbound_Amount_SDR: '11211.58',
    Inbound_Amount_USD: '11211.58',
    Inbound_Total_R02: '11211.58',
    Outbound_Mins: '74436225.00',
    Outbound_Amount_SDR: '0.00',
    Outbound_Amount_USD: '0.00',
    Outbound_Total_R02: '0.00',
    Netting_Amount_USD: '11211.58',
  },
  {
    key: 2,
    SerialNumber: 'Total',
    Operator: '',
    Inbound_Mins: '7726225.00',
    Inbound_Amount_SDR: '11211.58',
    Inbound_Amount_USD: '11211.58',
    Inbound_Total_R02: '11211.58',
    Outbound_Mins: '74436225.00',
    Outbound_Amount_SDR: '0.00',
    Outbound_Amount_USD: '0.00',
    Outbound_Total_R02: '0.00',
    Netting_Amount_USD: '11211.58',
    colMerge: ['SerialNumber-Operator'],
  },
  {
    key: 3,
    SerialNumber: 'Data source type:Operator',
    // SerialNumber: 'Issuer:Jack',
    Operator: '',
    Inbound_Mins: 'issuer:vivian',
    Inbound_Amount_SDR: '',
    Inbound_Amount_USD: 'issuing time:2019/8/7',
    Inbound_Total_R02: '',
    Outbound_Mins: 'Auditor:Jack',
    Outbound_Amount_SDR: '',
    Outbound_Amount_USD: '',
    Outbound_Total_R02: 'Auditing time:2019/8/8',
    Netting_Amount_USD: '',
    colMerge: ['SerialNumber-Operator', 'Inbound_Mins-Inbound_Amount_SDR', 'Inbound_Amount_USD-Inbound_Total_R02', 'Outbound_Mins-Outbound_Amount_SDR-Outbound_Amount_USD', 'Outbound_Total_R02-Netting_Amount_USD'],
  },

  {
    key: 4,
    SerialNumber: 'Details',
    Operator: '',
    Inbound_Mins: '',
    Inbound_Amount_SDR: '',
    Inbound_Amount_USD: '',
    Inbound_Total_R02: '',
    Outbound_Mins: '',
    Outbound_Amount_SDR: '',
    Outbound_Amount_USD: '',
    Outbound_Total_R02: '',
    Netting_Amount_USD: '',
    subheading: 'Details',
    colMerge: ['SerialNumber-Operator-Inbound_Mins-Inbound_Amount_SDR-Inbound_Amount_USD-Inbound_Total_R02-Outbound_Mins-Outbound_Amount_SDR-Outbound_Amount_USD-Outbound_Total_R02-Netting_Amount_USD'],
  },
  {
    key: 5,
    SerialNumber: 'Month',
    Operator: '',
    Inbound_Mins: 'Inbound',
    Inbound_Amount_SDR: '',
    Inbound_Amount_USD: '',
    Inbound_Total_R02: '',
    Outbound_Mins: 'Outbound',
    Outbound_Amount_SDR: '',
    Outbound_Amount_USD: '',
    Outbound_Total_R02: '',
    Netting_Amount_USD: '',
    // -Netting_Amount_USD-Cycle
    subheading: 'Inbound',
    rowMerge: [{
      colName: 'SerialNumber',
      rowSpan: 2
    }, {
      colName: 'Operator',
      rowSpan: 2
    }],
    colMerge: ['SerialNumber-Operator', 'Inbound_Mins-Inbound_Amount_SDR-Inbound_Amount_USD-Inbound_Total_R02', 'Outbound_Mins-Outbound_Amount_SDR-Outbound_Amount_USD-Outbound_Total_R02-Netting_Amount_USD'],
  },
  {
    key: 6,
    SerialNumber: '',
    Operator: '',
    Inbound_Mins: 'Destination',
    Inbound_Amount_SDR: '',
    Inbound_Amount_USD: 'Data source',
    Inbound_Total_R02: 'Type',
    Outbound_Mins: 'Destination',
    Outbound_Amount_SDR: '',
    Outbound_Amount_USD: 'Data source',
    Outbound_Total_R02: 'Type',
    Netting_Amount_USD: '',
    subheading: 'Inbound',
    rowMerge: [{
      colName: 'SerialNumber',
      rowSpan: 0
    }, {
      colName: 'Operator',
      rowSpan: 0
    }],
    colMerge: ['SerialNumber-Operator', 'Inbound_Mins-Inbound_Amount_SDR', 'Outbound_Mins-Outbound_Amount_SDR'],
  },
  {
    key: 7,
    SerialNumber: '201801-201812',
    Operator: '',
    Inbound_Mins: 'ALL',
    Inbound_Amount_SDR: '',
    Inbound_Amount_USD: 'KDDI',
    Inbound_Total_R02: 'amount',
    Outbound_Mins: '-',
    Outbound_Amount_SDR: '',
    Outbound_Amount_USD: '-',
    Outbound_Total_R02: '-',
    Netting_Amount_USD: '',
    colMerge: ['SerialNumber-Operator', 'Inbound_Mins-Inbound_Amount_SDR', 'Outbound_Mins-Outbound_Amount_SDR'],
  },
]
export const StatementRows = [
  {
    key: 1,
    SerialNumber: '1',
    Operator: 'CMCC',
    Inbound_Mins: '13662727.00',
    Inbound_Amount_SDR: '2652000.00',
    Inbound_Amount_USD: '4012476.00',
    Inbound_Total_R02: '4012476.00',
    Outbound_Mins: '22408121.00',
    Outbound_Amount_SDR: '2755230.09',
    Outbound_Amount_USD: '4168663.13',
    Outbound_Total_R02: '4168663.13',
    Netting_Amount_USD: '-156187.13',
  },
  {
    key: 2,
    SerialNumber: 'Total',
    Operator: '',
    Inbound_Mins: '13662727.00',
    Inbound_Amount_SDR: '2652000.00',
    Inbound_Amount_USD: '4012476.00',
    Inbound_Total_R02: '4012476.00',
    Outbound_Mins: '22408121.00',
    Outbound_Amount_SDR: '2755230.09',
    Outbound_Amount_USD: '4168663.13',
    Outbound_Total_R02: '4168663.13',
    Netting_Amount_USD: '-156187.13',
    colMerge: ['SerialNumber-Operator'],
  },
  {
    key: 3,
    SerialNumber: 'Data source type:System',
    // SerialNumber: 'Issuer:Jack',
    Operator: '',
    Inbound_Mins: 'issuer:vivian',
    Inbound_Amount_SDR: '',
    Inbound_Amount_USD: 'issuing time:2019/9/8',
    Inbound_Total_R02: '',
    Outbound_Mins: 'Auditor:Lily',
    Outbound_Amount_SDR: '',
    Outbound_Amount_USD: '',
    Outbound_Total_R02: 'Auditing time:2019/9/9',
    Netting_Amount_USD: '',
    colMerge: ['SerialNumber-Operator', 'Inbound_Mins-Inbound_Amount_SDR', 'Inbound_Amount_USD-Inbound_Total_R02', 'Outbound_Mins-Outbound_Amount_SDR-Outbound_Amount_USD', 'Outbound_Total_R02-Netting_Amount_USD'],
  },

  {
    key: 4,
    SerialNumber: 'Details',
    Operator: '',
    Inbound_Mins: '',
    Inbound_Amount_SDR: '',
    Inbound_Amount_USD: '',
    Inbound_Total_R02: '',
    Outbound_Mins: '',
    Outbound_Amount_SDR: '',
    Outbound_Amount_USD: '',
    Outbound_Total_R02: '',
    Netting_Amount_USD: '',
    subheading: 'Details',
    colMerge: ['SerialNumber-Operator-Inbound_Mins-Inbound_Amount_SDR-Inbound_Amount_USD-Inbound_Total_R02-Outbound_Mins-Outbound_Amount_SDR-Outbound_Amount_USD-Outbound_Total_R02-Netting_Amount_USD'],
  },
  {
    key: 5,
    SerialNumber: 'Month',
    Operator: '',
    Inbound_Mins: 'Inbound',
    Inbound_Amount_SDR: '',
    Inbound_Amount_USD: '',
    Inbound_Total_R02: '',
    Outbound_Mins: 'Outbound',
    Outbound_Amount_SDR: '',
    Outbound_Amount_USD: '',
    Outbound_Total_R02: '',
    Netting_Amount_USD: '',
    // -Netting_Amount_USD-Cycle
    subheading: 'Inbound',
    rowMerge: [{
      colName: 'SerialNumber',
      rowSpan: 2
    }, {
      colName: 'Operator',
      rowSpan: 2
    }],
    colMerge: ['SerialNumber-Operator', 'Inbound_Mins-Inbound_Amount_SDR-Inbound_Amount_USD-Inbound_Total_R02', 'Outbound_Mins-Outbound_Amount_SDR-Outbound_Amount_USD-Outbound_Total_R02-Netting_Amount_USD'],
  },
  {
    key: 6,
    SerialNumber: '',
    Operator: '',
    Inbound_Mins: 'Destination',
    Inbound_Amount_SDR: '',
    Inbound_Amount_USD: 'Data source',
    Inbound_Total_R02: 'Type',
    Outbound_Mins: 'Destination',
    Outbound_Amount_SDR: '',
    Outbound_Amount_USD: 'Data source',
    Outbound_Total_R02: 'Type',
    Netting_Amount_USD: '',
    subheading: 'Inbound',
    rowMerge: [{
      colName: 'SerialNumber',
      rowSpan: 0
    }, {
      colName: 'Operator',
      rowSpan: 0
    }],
    colMerge: ['SerialNumber-Operator', 'Inbound_Mins-Inbound_Amount_SDR', 'Outbound_Mins-Outbound_Amount_SDR'],
  },
  {
    key: 7,
    SerialNumber: '201901-201906',
    Operator: '',
    Inbound_Mins: '-',
    Inbound_Amount_SDR: '',
    Inbound_Amount_USD: '-',
    Inbound_Total_R02: '-',
    Outbound_Mins: '-',
    Outbound_Amount_SDR: '',
    Outbound_Amount_USD: '-',
    Outbound_Total_R02: '-',
    Netting_Amount_USD: '',
    colMerge: ['SerialNumber-Operator', 'Inbound_Mins-Inbound_Amount_SDR', 'Outbound_Mins-Outbound_Amount_SDR'],
  },
]
export const statementData = [
  {
    key: 1,
    SerialNumber: '1',
    Operator: 'CMHK',
    Inbound_Mins: '184878.00',
    Inbound_Amount_SDR: '5443.93',
    Inbound_Amount_USD: '7287.29',
    Inbound_Total_R02: '7287.29',
    Outbound_Mins: '1362601.00',
    Outbound_Amount_SDR: '34420.97',
    Outbound_Amount_USD: '52078.93',
    Outbound_Total_R02: '52078.93',
    Netting_Amount_USD: '-44791.64',
  },
  {
    key: 2,
    SerialNumber: 'Total',
    Operator: '',
    Inbound_Mins: '184878.00',
    Inbound_Amount_SDR: '5443.93',
    Inbound_Amount_USD: '7287.29',
    Inbound_Total_R02: '7287.29',
    Outbound_Mins: '1362601.00',
    Outbound_Amount_SDR: '34420.97',
    Outbound_Amount_USD: '52078.93',
    Outbound_Total_R02: '52078.93',
    Netting_Amount_USD: '-44791.64',
    colMerge: ['SerialNumber-Operator'],
  },
  {
    key: 3,
    SerialNumber: 'Data source type:Operator',
    // SerialNumber: 'Issuer:Jack',
    Operator: '',
    Inbound_Mins: 'issuer:vivian',
    Inbound_Amount_SDR: '',
    Inbound_Amount_USD: 'issuing time:2019/3/8',
    Inbound_Total_R02: '',
    Outbound_Mins: 'Auditor:Lily',
    Outbound_Amount_SDR: '',
    Outbound_Amount_USD: '',
    Outbound_Total_R02: 'Auditing time:2019/3/11',
    Netting_Amount_USD: '',
    colMerge: ['SerialNumber-Operator', 'Inbound_Mins-Inbound_Amount_SDR', 'Inbound_Amount_USD-Inbound_Total_R02', 'Outbound_Mins-Outbound_Amount_SDR-Outbound_Amount_USD', 'Outbound_Total_R02-Netting_Amount_USD'],
  },

  {
    key: 4,
    SerialNumber: 'Details',
    Operator: '',
    Inbound_Mins: '',
    Inbound_Amount_SDR: '',
    Inbound_Amount_USD: '',
    Inbound_Total_R02: '',
    Outbound_Mins: '',
    Outbound_Amount_SDR: '',
    Outbound_Amount_USD: '',
    Outbound_Total_R02: '',
    Netting_Amount_USD: '',
    subheading: 'Details',
    colMerge: ['SerialNumber-Operator-Inbound_Mins-Inbound_Amount_SDR-Inbound_Amount_USD-Inbound_Total_R02-Outbound_Mins-Outbound_Amount_SDR-Outbound_Amount_USD-Outbound_Total_R02-Netting_Amount_USD'],
  },
  {
    key: 5,
    SerialNumber: 'Month',
    Operator: '',
    Inbound_Mins: 'Inbound',
    Inbound_Amount_SDR: '',
    Inbound_Amount_USD: '',
    Inbound_Total_R02: '',
    Outbound_Mins: 'Outbound',
    Outbound_Amount_SDR: '',
    Outbound_Amount_USD: '',
    Outbound_Total_R02: '',
    Netting_Amount_USD: '',
    // -Netting_Amount_USD-Cycle
    subheading: 'Inbound',
    rowMerge: [{
      colName: 'SerialNumber',
      rowSpan: 2
    }, {
      colName: 'Operator',
      rowSpan: 2
    }],
    colMerge: ['SerialNumber-Operator', 'Inbound_Mins-Inbound_Amount_SDR-Inbound_Amount_USD-Inbound_Total_R02', 'Outbound_Mins-Outbound_Amount_SDR-Outbound_Amount_USD-Outbound_Total_R02-Netting_Amount_USD'],
  },
  {
    key: 6,
    SerialNumber: '',
    Operator: '',
    Inbound_Mins: 'Destination',
    Inbound_Amount_SDR: '',
    Inbound_Amount_USD: 'Data source',
    Inbound_Total_R02: 'Type',
    Outbound_Mins: 'Destination',
    Outbound_Amount_SDR: '',
    Outbound_Amount_USD: 'Data source',
    Outbound_Total_R02: 'Type',
    Netting_Amount_USD: '',
    subheading: 'Inbound',
    rowMerge: [{
      colName: 'SerialNumber',
      rowSpan: 0
    }, {
      colName: 'Operator',
      rowSpan: 0
    }],
    colMerge: ['SerialNumber-Operator', 'Inbound_Mins-Inbound_Amount_SDR', 'Outbound_Mins-Outbound_Amount_SDR'],
  },
  {
    key: 7,
    SerialNumber: '201901',
    Operator: '',
    Inbound_Mins: 'Macau-Fixed/ Macau-Mobile',
    Inbound_Amount_SDR: '',
    Inbound_Amount_USD: 'CMHK',
    Inbound_Total_R02: 'amount',
    Outbound_Mins: '-',
    Outbound_Amount_SDR: '',
    Outbound_Amount_USD: '-',
    Outbound_Total_R02: '-',
    Netting_Amount_USD: '',
    colMerge: ['SerialNumber-Operator', 'Inbound_Mins-Inbound_Amount_SDR', 'Outbound_Mins-Outbound_Amount_SDR'],
  },

]
export const HeaderTitle = [
  {
    name:'Amount_USD',
    value:1
  },
  {
    name:'Amount_EUR',
    value:2
  },
  {
    name:'Amount_SDR',
    value:3
  },
]
/* 表格数据 -> 头部 */
export const statementColumns: any = [
  {
    title: 'Serial number',
    dataIndex: 'SerialNumber',
    key: 'SerialNumber',
    width: 100,
    customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'SerialNumber'),
  },
  {
    title: 'Operator',
    dataIndex: 'Operator',
    key: 'Operator',
    width: 200,
    // sorter: (a:any, b:any) => a.age - b.age -> 排序声明函数
    customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'Operator'),
  },
  {
    title: 'Inbound(Receivable)',
    children: [{
      title: 'Duration(Mins)',
      key: 'Inbound_Mins',
      dataIndex: 'Inbound_Mins',
      width: 220,
      customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'Inbound_Mins'),
    }, {
      title: 'Amount_SDR',
      key: 'Inbound_Amount_SDR',
      dataIndex: 'Inbound_Amount_SDR',
      width: 220,
      customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'Inbound_Amount_SDR'),
    }, {
      title: 'Amount_USD',
      key: 'Inbound_Amount_USD',
      dataIndex: 'Inbound_Amount_USD',
      width: 220,
      customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'Inbound_Amount_USD'),
    }, {
      title: 'Total',
      children: [{
        title: 'R02',
        key: 'Inbound_Total_R02',
        dataIndex: 'Inbound_Total_R02',
        width: 220,
        customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'Inbound_Total_R02'),
      }]
    }],
  }, {
    title: 'Outbound(Payable)',
    children: [{
      title: 'Duration(Mins)',
      key: 'Outbound_Mins',
      dataIndex: 'Outbound_Mins',
      width: 220,
      customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'Outbound_Mins'),
    }, {
      title: 'Amount_SDR',
      key: 'Outbound_Amount_SDR',
      dataIndex: 'Outbound_Amount_SDR',
      width: 220,
      customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'Outbound_Amount_SDR'),
    }, {
      title: 'Amount_USD',
      key: 'Outbound_Amount_USD',
      dataIndex: 'Outbound_Amount_USD',
      width: 220,
      customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'Outbound_Amount_USD'),
    }, {
      title: 'Total',
      children: [{
        title: 'P02',
        key: 'Outbound_Total_R02',
        dataIndex: 'Outbound_Total_R02',
        width: 220,
        customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'Outbound_Total_R02'),
      }]
    }],
  }, {
    title: 'Netting',
    children: [{
      title: 'Amount(USD)',
      key: 'Netting_Amount_USD',
      dataIndex: 'Netting_Amount_USD',
      width: 220,
      customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'Netting_Amount_USD'),
    }],
  }
]
