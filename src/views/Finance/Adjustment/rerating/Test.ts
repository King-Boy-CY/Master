import {
  DataSourceOptions,
  ChargeableUnitTypeOptions,
  ChargeTypeOptions,
  DirectionOptions
} from '@/views/Finance/common/data/index.ts'
const renderContent = (value: any, row: any, index: any, dataIndex: any, options?: any) => {
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

  if (options && options instanceof Array) {
    // obj.children = options[value]
    const find = options.find((item: any) => item.value === value)
    if (find) {
      obj.children = find.name
    }
  }
  return obj;
}


/* 表格数据 -> 头部上面的数据 */


export const dataBeforeColumns = [
  {
    name: "Operator",
    dataIndex: "Operator",
  },  {
    name: "Service",
    dataIndex: "Service",
  }, {
    name: "Direction",
    dataIndex: "Direction",
  },  {
    name: "Billing type",
    dataIndex: "BillingType",
  }, {
    name: "Charge type",
    dataIndex: "ChargeType",
  }, {
    name: "Cycle",
    dataIndex: "Cycle",
  },{
    name: "Settle period",
    dataIndex: "SettlePeriod",
  }, {
    name: "Adjustment type",
    dataIndex: "AdjustmentType",
  }, {
    name: "Statement Number",
    dataIndex: "StatementNumber",
  }];
/* 表格数据 -> 身体 */
export const data = [
  {
    key: 0,
    InboundNewAmountsUSD: '2832336',
    InboundOriginalAmountsUSD: '4012476',
    InboundAdjustmentAmountUSD: '-1180140.00',
    OutboundNewAmountsUSD:'5104695.71',
    OutboundOriginalAmountsUSD:'4168663.13',
    OutboundAdjustmentAmountUSD:'936032.58',
    NettingNewAmountsUSD:'-2272359.13',
    NettingOriginalAmountsUSD:'-156187.13',
    NettingAdjustmentAmountUSD:'-2116172.58'
  },
  {
    key: 1,
    InboundNewAmountsUSD: '2832336',
    InboundOriginalAmountsUSD: '4012476',
    InboundAdjustmentAmountUSD: '-1180140.00',
    OutboundNewAmountsUSD:'5104695.71',
    OutboundOriginalAmountsUSD:'4168663.13',
    OutboundAdjustmentAmountUSD:'936032.58',
    NettingNewAmountsUSD:'-2272359.13',
    NettingOriginalAmountsUSD:'-156187.13',
    NettingAdjustmentAmountUSD:'-2116172.58',
    colMerge: ['Month-Calls-Mins-ChargeableTrafficVolume-Rate_SDR']
  },
  {
    key: 2,
    InboundNewAmountsUSD: 'Issuer: Vivian',
    InboundOriginalAmountsUSD:'',
    InboundAdjustmentAmountUSD: 'Issuing time:2019-11-06',
    OutboundNewAmountsUSD:'',
    OutboundOriginalAmountsUSD:'Auditor: Lily',
    OutboundAdjustmentAmountUSD:'',
    NettingNewAmountsUSD: 'Auditingtime:2019-11-13',
    NettingOriginalAmountsUSD:'',
    NettingAdjustmentAmountUSD:'',
    hideBorder: true,
    colMerge: ['InboundNewAmountsUSD-InboundOriginalAmountsUSD','InboundAdjustmentAmountUSD-OutboundNewAmountsUSD','OutboundOriginalAmountsUSD-OutboundAdjustmentAmountUSD','NettingNewAmountsUSD-NettingOriginalAmountsUSD-NettingAdjustmentAmountUSD'],
  },
]
// Finance Rerating页面New Data表格数据
export const ReratingNewData = [
  {
    key: 0,
    Month: 'Detail of Traffic',
    Calls: '',
    Mins: '',
    ChargeableTrafficVolume: '',
    ChargeableUnitType: '',
    Rate_EUR: '',
    CMCCEUR: 'Amount Due to CMCC',
    CMCCUSD: '',
    CTMEUR: 'Amount Due to  CTM',
    CTMUSD: '',
    useTableHeader:true,
    colMerge: ['Month-Calls-Mins-ChargeableTrafficVolume-ChargeableUnitType-Rate_EUR','CMCCEUR-CMCCUSD','CTMEUR-CTMUSD']
  },
  {
    key: 1,
    Month: 'Month',
    Calls: 'Calls',
    Mins: 'Mins',
    ChargeableTrafficVolume: 'Chargeable Traffic Volume',
    ChargeableUnitType: 'Chargeable Unit Type',
    Rate_EUR: 'Rate(EUR)',
    CMCCEUR: 'EUR',
    CMCCUSD: 'USD',
    CTMEUR: 'EUR',
    CTMUSD: 'USD',
    useTableLittleHeader:true,
  },
  {
    key: 2,
    Month: 'Outbound-CTM to CMCC',
    Calls: '',
    Mins: '',
    ChargeableTrafficVolume: '',
    ChargeableUnitType: '',
    Rate_EUR: '',
    CMCCEUR: '',
    CMCCUSD: '',
    CTMEUR: '',
    CTMUSD: '',
    useTableDataHeader:true,
    colMerge: ['Month-Calls-Mins-ChargeableTrafficVolume-ChargeableUnitType-Rate_EUR-CMCCEUR-CMCCUSD-CTMEUR-CTMUSD'],
  },
  {
    key: 3,
    Month: '201901',
    Calls: '123,45',
    Mins: '298,567',
    ChargeableTrafficVolume: '',
    ChargeableUnitType: '',
    Rate_EUR: '',
    CMCCEUR: '',
    CMCCUSD: '',
    CTMEUR: '',
    CTMUSD: ''
  },
  {
    key: 4,
    Month: '201902',
    Calls: '3,456',
    Mins: '23,456',
    ChargeableTrafficVolume: '',
    ChargeableUnitType: '',
    Rate_EUR: '',
    CMCCEUR: '',
    CMCCUSD: '',
    CTMEUR: '',
    CTMUSD: ''
  },
  {
    key: 5,
    Month: '201903',
    Calls: '56,789',
    Mins: '23,456',
    ChargeableTrafficVolume: '',
    ChargeableUnitType: '',
    Rate_EUR: '',
    CMCCEUR: '',
    CMCCUSD: '',
    CTMEUR: '',
    CTMUSD: ''
  },
  {
    key: 6,
    Month: '201904',
    Calls: '2,457',
    Mins: '79,458',
    ChargeableTrafficVolume: '',
    ChargeableUnitType: '',
    Rate_EUR: '',
    CMCCEUR: '',
    CMCCUSD: '',
    CTMEUR: '',
    CTMUSD: '',

  },
  {
    key: 7,
    Month: '201905',
    Calls: '45,231',
    Mins: '348,157',
    ChargeableTrafficVolume: '',
    ChargeableUnitType: '',
    Rate_EUR: '',
    CMCCEUR: '',
    CMCCUSD: '',
    CTMEUR: '',
    CTMUSD: '',

  },{
    key: 8,
    Month: '201906',
    Calls: '265,427',
    Mins: '19,295,026',
    ChargeableTrafficVolume: '',
    ChargeableUnitType: '',
    Rate_EUR: '',
    CMCCEUR: '',
    CMCCUSD: '',
    CTMEUR: '',
    CTMUSD: '',
  },
  {
    key: 9,
    Month: 'Total',
    Calls: '385,705',
    Mins: '22,408,121',
    ChargeableTrafficVolume: '',
    ChargeableUnitType: '',
    Rate_EUR: '',
    CMCCEUR: '',
    CMCCUSD: '',
    CTMEUR: '',
    CTMUSD: ''
  },
  {
    key: 10,
    Month: 'Tier - China Fixed /China Mobile ',
    Calls: '',
    Mins: '',
    ChargeableTrafficVolume: '',
    ChargeableUnitType: '',
    Rate_EUR: '',
    CMCCEUR: '',
    CMCCUSD: '',
    CTMEUR: '',
    CTMUSD: '',
    useTableDataFooter:true,
    colMerge: ['Month-Calls-Mins-ChargeableTrafficVolume-ChargeableUnitType-Rate_EUR-CMCCEUR-CMCCUSD-CTMEUR-CTMUSD'],
  },
  {
    key:11,
    Month: 'Commitment State',
    Calls: 'Commitment Value',
    Mins: '',
    ChargeableTrafficVolume: '21,000,000',
    ChargeableUnitType: 'mins',
    Rate_EUR: '-',
    CMCCEUR: '',
    CMCCUSD: '',
    CTMEUR: '',
    CTMUSD: '',
    rowMerge: [{
      colName: 'Month',
      rowSpan: 2
    }]
  },
  {
    key: 12,
    Month: '',
    Calls: 'Excess forward to Next period',
    Mins: '',
    ChargeableTrafficVolume: '196,514',
    ChargeableUnitType: 'mins',
    Rate_EUR: '-',
    CMCCEUR: '',
    CMCCUSD: '',
    CTMEUR: '',
    CTMUSD: '',
    rowMerge: [{
      colName: 'Month',
      rowSpan: 0
    }]
  },
  {
    key: 13,
    Month: 'Rating Data',
    Calls: 'IDD:(0.0-21000000.0)mins',
    Mins: 'China Fixed /China Mobile ',
    ChargeableTrafficVolume: '21000000',
    ChargeableUnitType: 'mins',
    Rate_EUR: '0.156286',
    CMCCEUR: '2652006.00',
    CMCCUSD: '',
    CTMEUR: '',
    CTMUSD: '',
    rowMerge: [{
      colName: 'Month',
      rowSpan: 3
    },{
      colName: 'Mins',
      rowSpan: 3
    }]
  },
  {
    key: 14,
    Month: '',
    Calls: 'IDD:(21000001.0-22134000.0)mins',
    Mins: '',
    ChargeableTrafficVolume: '1,134,000',
    ChargeableUnitType: 'mins',
    Rate_EUR: '0.080000',
    CMCCEUR: '102060.00',
    CMCCUSD: '',
    CTMEUR: '',
    CTMUSD: '',
    rowMerge: [{
      colName: 'Month',
      rowSpan: 0
    },{
      colName: 'Mins',
      rowSpan: 0
    }]
  },
  {
    key: 15,
    Month: '',
    Calls: 'IDD:(22134001.0-)mins',
    Mins: '',
    ChargeableTrafficVolume: '77,606',
    ChargeableUnitType: 'mins',
    Rate_EUR: '0.0150000',
    CMCCEUR: '1164.09',
    CMCCUSD: '',
    CTMEUR: '',
    CTMUSD: '',
    rowMerge: [{
      colName: 'Month',
      rowSpan: 0
    },{
      colName: 'Mins',
      rowSpan: 0
    }]
  },
  {
    key: 16,
    Month: 'Inbound-CMCC to CTM',
    Calls: '',
    Mins: '',
    ChargeableTrafficVolume: '',
    ChargeableUnitType: '',
    Rate_EUR: '',
    CMCCEUR: '',
    CMCCUSD: '',
    CTMEUR: '',
    CTMUSD: '',
    useTableDataHeader:true,
    colMerge: ['Month-Calls-Mins-ChargeableTrafficVolume-ChargeableUnitType-Rate_EUR-CMCCEUR-CMCCUSD-CTMEUR-CTMUSD'],
  },
  {
    key: 17,
    Month: '201901',
    Calls: '0',
    Mins: '0',
    ChargeableTrafficVolume: '',
    ChargeableUnitType: '',
    Rate_EUR: '',
    CMCCEUR: '',
    CMCCUSD: '',
    CTMEUR: '',
    CTMUSD: ''
  },
  {
    key: 18,
    Month: '201902',
    Calls: '0',
    Mins: '0',
    ChargeableTrafficVolume: '',
    ChargeableUnitType: '',
    Rate_EUR: '',
    CMCCEUR: '',
    CMCCUSD: '',
    CTMEUR: '',
    CTMUSD: ''
  },
  {
    key: 19,
    Month: '201903',
    Calls: '0',
    Mins: '0',
    ChargeableTrafficVolume: '',
    ChargeableUnitType: '',
    Rate_EUR: '',
    CMCCEUR: '',
    CMCCUSD: '',
    CTMEUR: '',
    CTMUSD: ''
  },
  {
    key: 20,
    Month: '201904',
    Calls: '33,459',
    Mins: '298,567',
    ChargeableTrafficVolume: '',
    ChargeableUnitType: '',
    Rate_EUR: '',
    CMCCEUR: '',
    CMCCUSD: '',
    CTMEUR: '',
    CTMUSD: '',

  },
  {
    key: 21,
    Month: '201905',
    Calls: '3,176,460',
    Mins: '4,123,456',
    ChargeableTrafficVolume: '',
    ChargeableUnitType: '',
    Rate_EUR: '',
    CMCCEUR: '',
    CMCCUSD: '',
    CTMEUR: '',
    CTMUSD: ''
  },
  
  {
    key: 22,
    Month: '201906',
    Calls: '5,343,461',
    Mins: '9,195,026',
    ChargeableTrafficVolume: '',
    ChargeableUnitType: '',
    Rate_EUR: '',
    CMCCEUR: '',
    CMCCUSD: '',
    CTMEUR: '',
    CTMUSD: ''
  },{
    key: 23,
    Month: 'Total',
    Calls: '8,556,735',
    Mins: '13,662,727',
    ChargeableTrafficVolume: '',
    ChargeableUnitType: '',
    Rate_EUR: '',
    CMCCEUR: '',
    CMCCUSD: '',
    CTMEUR: '',
    CTMUSD: ''
  },
  {
    key: 24,
    Month: 'Tier - Macau Fixed/2N/Macau Mobile',
    Calls: '',
    Mins: '',
    ChargeableTrafficVolume: '',
    ChargeableUnitType: '',
    Rate_EUR: '',
    CMCCEUR: '',
    CMCCUSD: '',
    CTMEUR: '',
    CTMUSD: '',
    useTableDataFooter:true,
    colMerge: ['Month-Calls-Mins-ChargeableTrafficVolume-ChargeableUnitType-Rate_EUR-CMCCEUR-CMCCUSD-CTMEUR-CTMUSD']
  },
  {
    key: 25,
    Month: 'Commitment State',
    Calls: 'Commitment Value',
    Mins: '',
    ChargeableTrafficVolume: '15,600,000',
    ChargeableUnitType: 'mins',
    Rate_EUR: '-',
    CMCCEUR: '',
    CMCCUSD: '',
    CTMEUR: '',
    CTMUSD: '',
    rowMerge: [{
      colName: 'Month',
      rowSpan: 2
    }]
  },
  {
    key: 26,
    Month: '',
    Calls: 'Shortfall of Committed Volume From Next period',
    Mins: '',
    ChargeableTrafficVolume: '1,937,273',
    ChargeableUnitType: 'mins',
    Rate_EUR: '-',
    CMCCEUR: '',
    CMCCUSD: '',
    CTMEUR: '',
    CTMUSD: '',
    rowMerge: [{
      colName: 'Month',
      rowSpan: 0
    }]
  },
  {
    key: 27,
    Month: 'Rating Data',
    Calls: 'IDD:(0.0-15600000.0)mins',
    Mins: 'Macau Fixed/2N/Macau Mobile',
    ChargeableTrafficVolume: '15,600,000',
    ChargeableUnitType: 'mins',
    Rate_EUR: '0.120000',
    CMCCEUR: '',
    CMCCUSD: '',
    CTMEUR: '1872000.00',
    CTMUSD: '',
    rowMerge: [{
      colName: 'Month',
      rowSpan: 3
    },{ 
      colName: 'Mins',
      rowSpan: 3
    }]
  },
  {
    key: 28,
    Month: '',
    Calls: 'IDD:(15600001.0-15800000.0)mins',
    Mins: '',
    ChargeableTrafficVolume: '-',
    ChargeableUnitType: '',
    Rate_EUR: '0.0600000',
    CMCCEUR: '',
    CMCCUSD: '',
    CTMEUR: '',
    CTMUSD: '',
    rowMerge: [{
      colName: 'Month',
      rowSpan: 0
    },{ 
      colName: 'Mins',
      rowSpan: 0
    }]
  },
  {
    key: 29,
    Month: '',
    Calls: 'IDD:(15800001.0-1)mins',
    Mins: '',
    ChargeableTrafficVolume: '-',
    ChargeableUnitType: '',
    Rate_EUR: '0.100000',
    CMCCEUR: '',
    CMCCUSD: '',
    CTMEUR: '',
    CTMUSD: '',
    rowMerge: [{
      colName: 'Month',
      rowSpan: 0
    },{ 
      colName: 'Mins',
      rowSpan: 0
    }]
  },
  {
    key: 30,
    Month: 'Total of Traffic',
    Calls: '',
    Mins: '',
    ChargeableTrafficVolume: '-',
    ChargeableUnitType: '',
    Rate_EUR: '',
    CMCCEUR: '3373890.09',
    CMCCUSD: '',
    CTMEUR: '1872000.00',
    CTMUSD: ''
  },
  {
    key: 31,
    Month: 'Converted EUR to USD @1.513',
    Calls: '',
    Mins: '',
    ChargeableTrafficVolume: '-',
    ChargeableUnitType: '',
    Rate_EUR: '',
    CMCCEUR: '',
    CMCCUSD: '5104695.71',
    CTMEUR: '',
    CTMUSD: '2832336.00',
    colMerge:['Month-Calls'],
    useTableDataFooter:true
  },
  {
    key: 32,
    Month: 'Net amount for Exchange Traffic',
    Calls: '',
    Mins: '',
    ChargeableTrafficVolume: '',
    ChargeableUnitType: '',
    Rate_EUR: '---',
    CMCCEUR: '---',
    CMCCUSD: '---',
    CTMEUR: '',
    CTMUSD: '-2272359.71',
    colMerge:['Month-Calls'],
    useTableDataHeader:true
  }
]
export const ReratingOriginal = [
  {
    key: 0,
    Month: 'Detail of Traffic',
    Calls: '',
    Mins: '',
    ChargeableTrafficVolume: '',
    ChargeableUnitType: '',
    Rate_EUR: '',
    CMCCEUR: 'Amount Due to CMCC',
    CMCCUSD: '',
    CTMEUR: 'Amount Due to  CTM',
    CTMUSD: '',
    useTableHeader:true,
    colMerge: ['Month-Calls-Mins-ChargeableTrafficVolume-ChargeableUnitType-Rate_EUR','CMCCEUR-CMCCUSD','CTMEUR-CTMUSD']
  },
  {
    key: 1,
    Month: 'Month',
    Calls: 'Calls',
    Mins: 'Mins',
    ChargeableTrafficVolume: 'Chargeable Traffic Volume',
    ChargeableUnitType: 'Chargeable Unit Type',
    Rate_EUR: 'Rate(EUR)',
    CMCCEUR: 'EUR',
    CMCCUSD: 'USD',
    CTMEUR: 'EUR',
    CTMUSD: 'USD',
    useTableLittleHeader:true,
  },
  {
    key: 2,
    Month: 'Outbound-CTM to CMCC',
    Calls: '',
    Mins: '',
    ChargeableTrafficVolume: '',
    ChargeableUnitType: '',
    Rate_EUR: '',
    CMCCEUR: '',
    CMCCUSD: '',
    CTMEUR: '',
    CTMUSD: '',
    useTableDataHeader:true,
    colMerge: ['Month-Calls-Mins-ChargeableTrafficVolume-ChargeableUnitType-Rate_EUR-CMCCEUR-CMCCUSD-CTMEUR-CTMUSD'],
  },
  {
    key: 3,
    Month: '201901',
    Calls: '123,45',
    Mins: '298,567',
    ChargeableTrafficVolume: '',
    ChargeableUnitType: '',
    Rate_EUR: '',
    CMCCEUR: '',
    CMCCUSD: '',
    CTMEUR: '',
    CTMUSD: ''
  },
  {
    key: 4,
    Month: '201902',
    Calls: '3,456',
    Mins: '23,456',
    ChargeableTrafficVolume: '',
    ChargeableUnitType: '',
    Rate_EUR: '',
    CMCCEUR: '',
    CMCCUSD: '',
    CTMEUR: '',
    CTMUSD: ''
  },
  {
    key: 5,
    Month: '201903',
    Calls: '56,789',
    Mins: '23,456',
    ChargeableTrafficVolume: '',
    ChargeableUnitType: '',
    Rate_EUR: '',
    CMCCEUR: '',
    CMCCUSD: '',
    CTMEUR: '',
    CTMUSD: ''
  },
  {
    key: 6,
    Month: '201904',
    Calls: '2,457',
    Mins: '79,458',
    ChargeableTrafficVolume: '',
    ChargeableUnitType: '',
    Rate_EUR: '',
    CMCCEUR: '',
    CMCCUSD: '',
    CTMEUR: '',
    CTMUSD: '',

  },
  {
    key: 7,
    Month: '201905',
    Calls: '45,231',
    Mins: '348,157',
    ChargeableTrafficVolume: '',
    ChargeableUnitType: '',
    Rate_EUR: '',
    CMCCEUR: '',
    CMCCUSD: '',
    CTMEUR: '',
    CTMUSD: '',

  },{
    key: 8,
    Month: '201906',
    Calls: '265,427',
    Mins: '19,295,026',
    ChargeableTrafficVolume: '',
    ChargeableUnitType: '',
    Rate_EUR: '',
    CMCCEUR: '',
    CMCCUSD: '',
    CTMEUR: '',
    CTMUSD: '',

  },
  {
    key: 9,
    Month: 'Total',
    Calls: '385,705',
    Mins: '22,408,121',
    ChargeableTrafficVolume: '',
    ChargeableUnitType: '',
    Rate_EUR: '',
    CMCCEUR: '',
    CMCCUSD: '',
    CTMEUR: '',
    CTMUSD: ''
  },
  {
    key: 10,
    Month: 'Tier - China Fixed /China Mobile ',
    Calls: '',
    Mins: '',
    ChargeableTrafficVolume: '',
    ChargeableUnitType: '',
    Rate_EUR: '',
    CMCCEUR: '',
    CMCCUSD: '',
    CTMEUR: '',
    CTMUSD: '',
    useTableDataFooter:true,
    colMerge: ['Month-Calls-Mins-ChargeableTrafficVolume-ChargeableUnitType-Rate_EUR-CMCCEUR-CMCCUSD-CTMEUR-CTMUSD'],
  },
  {
    key: 11,
    Month: 'Commitment State',
    Calls: 'Commitment Value',
    Mins: '',
    ChargeableTrafficVolume: '21,000,000',
    ChargeableUnitType: 'mins',
    Rate_EUR: '-',
    CMCCEUR: '',
    CMCCUSD: '',
    CTMEUR: '',
    CTMUSD: '',
    rowMerge: [{
      colName: 'Month',
      rowSpan: 2
    }]
  },
  {
    key: 12,
    Month: '',
    Calls: 'Excess forward to Next period',
    Mins: '',
    ChargeableTrafficVolume: '196,514',
    ChargeableUnitType: 'mins',
    Rate_EUR: '-',
    CMCCEUR: '',
    CMCCUSD: '',
    CTMEUR: '',
    CTMUSD: '',
    rowMerge: [{
      colName: 'Month',
      rowSpan: 0
    }]
  },
  {
    key: 13,
    Month: 'Rating Data',
    Calls: 'IDD:(0.0-21000000.0)mins',
    Mins: 'China Fixed /China Mobile ',
    ChargeableTrafficVolume: '21000000',
    ChargeableUnitType: 'mins',
    Rate_EUR: '0.126286',
    CMCCEUR: '2652006.00',
    CMCCUSD: '',
    CTMEUR: '',
    CTMUSD: '',
    rowMerge: [{
      colName: 'Month',
      rowSpan: 3
    },{
      colName: 'Mins',
      rowSpan: 3
    }]
  },
  {
    key: 14,
    Month: '',
    Calls: 'IDD:(21000001.0-22134000.0)mins',
    Mins: '',
    ChargeableTrafficVolume: '1,134,000',
    ChargeableUnitType: 'mins',
    Rate_EUR: '0.090000',
    CMCCEUR: '102060.00',
    CMCCUSD: '',
    CTMEUR: '',
    CTMUSD: '',
    rowMerge: [{
      colName: 'Month',
      rowSpan: 0
    },{
      colName: 'Mins',
      rowSpan: 0
    }]
  },
  {
    key: 15,
    Month: '',
    Calls: 'IDD:(22134001.0-)mins',
    Mins: '',
    ChargeableTrafficVolume: '77,606',
    ChargeableUnitType: 'mins',
    Rate_EUR: '0.0150000',
    CMCCEUR: '1164.09',
    CMCCUSD: '',
    CTMEUR: '',
    CTMUSD: '',
    rowMerge: [{
      colName: 'Month',
      rowSpan: 0
    },{
      colName: 'Mins',
      rowSpan: 0
    }]
  },
  {
    key: 16,
    Month: 'Inbound-CMCC to CTM',
    Calls: '',
    Mins: '',
    ChargeableTrafficVolume: '',
    ChargeableUnitType: '',
    Rate_EUR: '',
    CMCCEUR: '',
    CMCCUSD: '',
    CTMEUR: '',
    CTMUSD: '',
    useTableDataHeader:true,
    colMerge: ['Month-Calls-Mins-ChargeableTrafficVolume-ChargeableUnitType-Rate_EUR-CMCCEUR-CMCCUSD-CTMEUR-CTMUSD'],
  },
  {
    key: 17,
    Month: '201901',
    Calls: '0',
    Mins: '0',
    ChargeableTrafficVolume: '',
    ChargeableUnitType: '',
    Rate_EUR: '',
    CMCCEUR: '',
    CMCCUSD: '',
    CTMEUR: '',
    CTMUSD: ''
  },
  {
    key: 18,
    Month: '201902',
    Calls: '0',
    Mins: '0',
    ChargeableTrafficVolume: '',
    ChargeableUnitType: '',
    Rate_EUR: '',
    CMCCEUR: '',
    CMCCUSD: '',
    CTMEUR: '',
    CTMUSD: ''
  },
  {
    key: 19,
    Month: '201903',
    Calls: '0',
    Mins: '0',
    ChargeableTrafficVolume: '',
    ChargeableUnitType: '',
    Rate_EUR: '',
    CMCCEUR: '',
    CMCCUSD: '',
    CTMEUR: '',
    CTMUSD: ''
  },
  {
    key: 20,
    Month: '201904',
    Calls: '33,459',
    Mins: '298,567',
    ChargeableTrafficVolume: '',
    ChargeableUnitType: '',
    Rate_EUR: '',
    CMCCEUR: '',
    CMCCUSD: '',
    CTMEUR: '',
    CTMUSD: '',

  },
  {
    key: 21,
    Month: '201905',
    Calls: '3,176,460',
    Mins: '4,123,456',
    ChargeableTrafficVolume: '',
    ChargeableUnitType: '',
    Rate_EUR: '',
    CMCCEUR: '',
    CMCCUSD: '',
    CTMEUR: '',
    CTMUSD: ''
  },
  {
    key: 22,
    Month: '201906',
    Calls: '5,343,461',
    Mins: '9,195,026',
    ChargeableTrafficVolume: '',
    ChargeableUnitType: '',
    Rate_EUR: '',
    CMCCEUR: '',
    CMCCUSD: '',
    CTMEUR: '',
    CTMUSD: ''
  },
  {
    key: 23,
    Month: 'Total',
    Calls: '8,556,735',
    Mins: '13,662,727',
    ChargeableTrafficVolume: '',
    ChargeableUnitType: '',
    Rate_EUR: '',
    CMCCEUR: '',
    CMCCUSD: '',
    CTMEUR: '',
    CTMUSD: ''
  },
  {
    key: 24,
    Month: 'Tier - Macau Fixed/2N/Macau Mobile',
    Calls: '',
    Mins: '',
    ChargeableTrafficVolume: '',
    ChargeableUnitType: '',
    Rate_EUR: '',
    CMCCEUR: '',
    CMCCUSD: '',
    CTMEUR: '',
    CTMUSD: '',
    useTableDataFooter:true,
    colMerge: ['Month-Calls-Mins-ChargeableTrafficVolume-ChargeableUnitType-Rate_EUR-CMCCEUR-CMCCUSD-CTMEUR-CTMUSD']
  },
  {
    key: 25,
    Month: 'Commitment State',
    Calls: 'Commitment Value',
    Mins: '',
    ChargeableTrafficVolume: '15,600,000',
    ChargeableUnitType: 'mins',
    Rate_EUR: '-',
    CMCCEUR: '',
    CMCCUSD: '',
    CTMEUR: '',
    CTMUSD: '',
    rowMerge: [{
      colName: 'Month',
      rowSpan: 2
    }]
  },
  {
    key: 26,
    Month: '',
    Calls: 'Shortfall of Committed Volume From Next period',
    Mins: '',
    ChargeableTrafficVolume: '1,937,273',
    ChargeableUnitType: 'mins',
    Rate_EUR: '-',
    CMCCEUR: '',
    CMCCUSD: '',
    CTMEUR: '',
    CTMUSD: '',
    rowMerge: [{
      colName: 'Month',
      rowSpan: 0
    }]
  },
  {
    key: 27,
    Month: 'Rating Data',
    Calls: 'IDD:(0.0-15600000.0)mins',
    Mins: 'Macau Fixed/2N/Macau Mobile',
    ChargeableTrafficVolume: '15,600,000',
    ChargeableUnitType: 'mins',
    Rate_EUR: '0.170000',
    CMCCEUR: '',
    CMCCUSD: '',
    CTMEUR: '2652000.00',
    CTMUSD: '',
    rowMerge: [{
      colName: 'Month',
      rowSpan: 3
    },{ 
      colName: 'Mins',
      rowSpan: 3
    }]
  },
  {
    key: 28,
    Month: '',
    Calls: 'IDD:(15600001.0-15800000.0)mins',
    Mins: '',
    ChargeableTrafficVolume: '-',
    ChargeableUnitType: '',
    Rate_EUR: '0.0600000',
    CMCCEUR: '',
    CMCCUSD: '',
    CTMEUR: '',
    CTMUSD: '',
    rowMerge: [{
      colName: 'Month',
      rowSpan: 0
    },{ 
      colName: 'Mins',
      rowSpan: 0
    }]
  },
  {
    key: 29,
    Month: '',
    Calls: 'IDD:(15800001.0-1)mins',
    Mins: '',
    ChargeableTrafficVolume: '-',
    ChargeableUnitType: '',
    Rate_EUR: '0.100000',
    CMCCEUR: '',
    CMCCUSD: '',
    CTMEUR: '',
    CTMUSD: '',
    rowMerge: [{
      colName: 'Month',
      rowSpan: 0
    },{ 
      colName: 'Mins',
      rowSpan: 0
    }]
  },
  {
    key: 30,
    Month: 'Total of Traffic',
    Calls: '',
    Mins: '',
    ChargeableTrafficVolume: '-',
    ChargeableUnitType: '',
    Rate_EUR: '',
    CMCCEUR: '2755230.09',
    CMCCUSD: '',
    CTMEUR: '2652000.00',
    CTMUSD: ''
  },
  {
    key: 31,
    Month: 'Converted EUR to USD @1.513',
    Calls: '',
    Mins: '',
    ChargeableTrafficVolume: '-',
    ChargeableUnitType: '',
    Rate_EUR: '',
    CMCCEUR: '',
    CMCCUSD: '4168663.13',
    CTMEUR: '',
    CTMUSD: '4012476.00',
    colMerge:['Month-Calls'],
    useTableDataFooter:true
  },
  {
    key: 32,
    Month: 'Net amount for Exchange Traffic',
    Calls: '',
    Mins: '',
    ChargeableTrafficVolume: '',
    ChargeableUnitType: '',
    Rate_EUR: '---',
    CMCCEUR: '---',
    CMCCUSD: '---',
    CTMEUR: '',
    CTMUSD: '-156187.13',
    colMerge:['Month-Calls'],
    useTableDataHeader:true
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
  },{
    name: 'disputed',
    value: 3
  }, {
    name: 'settled',
    value: 4
  }, {
    name: 'post close Re-rate',
    value: 5
  }]

export const AdjustmentTypeOptions = [
    {
      name: 'Changed Aggrement',
      value: 1
    }, {
      name: 'Suspend CDR',
      value: 2
    }
  ]

  /* 表格数据 -> 头部 */
export const columns: any = [
  {
    title: 'Service',
    dataIndex: 'Service',
    key: 'Service',
    // customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'Service'),
  },
  {
    title: 'Account',
    dataIndex: 'Account',
    key: 'Account',
    // sorter: (a:any, b:any) => a.age - b.age -> 排序声明函数
    // customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'Account'),
  },
  {
    title: 'Charge type',
    dataIndex: 'ChargeType',
    key: 'ChargeType',
    width: 150,
    customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'ChargeType', ChargeTypeOptions()),
  },
  {
    title: 'Direction',
    key: 'Direction',
    dataIndex: 'Direction',
    customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'Direction', DirectionOptions()),
  },
  {
    title: 'Cycle',
    key: 'Cycle',
    dataIndex: 'Cycle',
    width: 150,
    // customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'Cycle'),
  }, {
    title: 'Month',
    key: 'Month',
    dataIndex: 'Month',
    width: 150,
    // customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'Month'),
  }, {
    title: 'Begin date',
    key: 'BeginDate',
    dataIndex: 'BeginDate',
    width: 190,
    // customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'BeginDate'),
  },
  {
    title: 'End date',
    key: 'EndDate',
    dataIndex: 'EndDate',
    width: 190,
  },
  {
    title: 'Adjustment type',
    key: 'AdjustmentType',
    dataIndex: 'AdjustmentType',
    // width: 190,
    customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'AdjustmentType', AdjustmentTypeOptions),
  }, {
    title: 'Amount',
    key: 'Amount',
    dataIndex: 'Amount',
    // width: 190,
  },
  {
    title: 'Currency',
    key: 'Currency',
    dataIndex: 'Currency',
    // width: 200,
  }, {
    title: 'Exchange date',
    key: 'ExchangeDate',
    dataIndex: 'ExchangeDate',
    width: 190,
  },
  {
    title: 'Amounts(USD)',
    key: 'Amounts_USD',
    dataIndex: 'Amounts_USD',
    width: 190,
  },
  {
    title: 'Charge Traffic Volume',
    key: 'ChargeTrafficVolume',
    dataIndex: 'ChargeTrafficVolume',
    width: 190,
  }, {
    title: 'Chargeable Unit Type',
    key: 'ChargeableUnitType',
    dataIndex: 'ChargeableUnitType',
    // width: 190,
    customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'ChargeableUnitType', ChargeableUnitTypeOptions()),
  },
  {
    title: 'Reason',
    key: 'Reason',
    dataIndex: 'Reason',
    width: 200,
  }, {
    title: 'Data Source',
    key: 'DataSource',
    dataIndex: 'DataSource',
    // width: 200,
    customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'DataSource', DataSourceOptions()),
  }, {
    title: 'Operator files',
    key: 'OperatorFiles',
    dataIndex: 'OperatorFiles',
    // width: 200,
  }, {
    title: 'Modified by',
    key: 'ModifiedBy',
    dataIndex: 'ModifiedBy',
    // width: 200,
  }, {
    title: 'Last modified',
    key: 'LastModified',
    dataIndex: 'LastModified',
    width: 190,
  },
]
export const FinanceReratingTablesTitle: any = [
  {
    title: 'Inbound  Data',
    dataIndex: 'InboundData',
    key: 'InboundData',
    children: [
      {
        title: 'New Amounts（USD）',
        dataIndex: 'InboundNewAmountsUSD',
        key: 'InboundNewAmountsUSD',
        width: 120,
        customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'InboundNewAmountsUSD')
      },  {
        title: 'Original Amounts（USD）',
        dataIndex: 'InboundOriginalAmountsUSD',
        key: 'InboundOriginalAmountsUSD',
        width: 120,
        customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'InboundOriginalAmountsUSD')
      },  {
        title: 'Adjustment Amount(USD)',
        dataIndex: 'InboundAdjustmentAmountUSD',
        key: 'InboundAdjustmentAmountUSD',
        width: 120,
        customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'InboundAdjustmentAmountUSD')
      }
    ]
  },  {
    title: 'Outbound  Data',
    dataIndex: 'OutboundData',
    key: 'OutboundData',
    children: [
      {
        title: 'New Amounts（USD）',
        dataIndex: 'OutboundNewAmountsUSD',
        key: 'OutboundNewAmountsUSD',
        width: 120,
        customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'OutboundNewAmountsUSD'),
      },  {
        title: 'Original Amounts（USD）',
        dataIndex: 'OutboundOriginalAmountsUSD',
        key: 'OutboundOriginalAmountsUSD',
        width: 120,
        customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'OutboundOriginalAmountsUSD'),
      },  {
        title: 'Adjustment Amount(USD)',
        dataIndex: 'OutboundAdjustmentAmountUSD',
        key: 'OutboundAdjustmentAmountUSD',
        width: 120,
        customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'OutboundAdjustmentAmountUSD'),
      }
    ]
  },  {
    title: 'Netting  Data',
    dataIndex: 'NettingData',
    key: 'NettingData',
    children: [
      {
        title: 'New Amounts（USD）',
        dataIndex: 'NettingNewAmountsUSD',
        key: 'NettingNewAmountsUSD',
        width: 120,
        customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'NettingNewAmountsUSD'),
      },  {
        title: 'Original Amounts（USD）',
        dataIndex: 'NettingOriginalAmountsUSD',
        key: 'NettingOriginalAmountsUSD',
        width: 120,
        customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'NettingOriginalAmountsUSD'),
      },  {
        title: 'Adjustment Amount(USD)',
        dataIndex: 'NettingAdjustmentAmountUSD',
        key: 'NettingAdjustmentAmountUSD',
        width: 120,
        customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'NettingAdjustmentAmountUSD'),
      }
    ]
  }
]
/* Finance Rerating页面New Data表格数据 -> 头部 */
export const FinanceReratingNewDataTables: any = [
  {
    title: 'Detail of Traffic',
    children: [{
      title: ' ',
      dataIndex: 'Month',
      key: 'Month',
      width: 200,
      customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'Month'),
      // sorter: (a, b) => a.age - b.age,
    }, {
      title: ' ',
      dataIndex: 'Calls',
      key: 'Calls',
      width: 200,
      customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'Calls')
    }, {
      title: ' ',
      dataIndex: 'Mins',
      key: 'Mins',
      width: 250,
      customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'Mins')
    }, {
      title: ' ',
      dataIndex: 'ChargeableTrafficVolume',
      key: 'ChargeableTrafficVolume',
      width: 200,
      customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'ChargeableTrafficVolume')
    }, 
    {
      title: ' ',
      dataIndex: 'ChargeableUnitType',
      key: 'ChargeableUnitType',
      width: 200,
      customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'ChargeableUnitType')
    },
    {
      title: ' ',
      dataIndex: 'Rate_EUR',
      key: 'Rate_EUR',
      width: 200,
      customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'Rate_EUR')
    }],
  },
  {
    title: 'Amount Due to CMCC',
    children: [
      {
        title: ' ',
        dataIndex: 'CMCCEUR',
        key: 'CMCCEUR',
        width: 200,
        customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'CMCCEUR')
      },
      {
        title: ' ',
        dataIndex: 'CMCCUSD',
        key: 'CMCCUSD',
        width: 200,
        customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'CMCCUSD')
      }
    ],
  },
  {
    title: 'Amount Due to  CTM',
    children: [
      {
        title: ' ',
        dataIndex: 'CTMEUR',
        key: 'CTMEUR',
        width: 200,
        customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'CTMEUR')
      },
      {
        title: ' ',
        dataIndex: 'CTMUSD',
        key: 'CTMUSD',
        width: 200,
        customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'CTMUSD')
      }
    ],
  },
]
