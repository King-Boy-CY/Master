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
/* 表格数据 -> 身体 */
/*Month
Calls
Mins
ChargeableTrafficVolume
ChargeableUnitType
Rate_EUR
CMCCEUR
CMCCUSD
CTMEUR
CTMUSD*/


export const dataInbound= [
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
    key: 2,
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
    key: 1,
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
    colMerge: ['Month-Calls-Mins'],
  },
  {
    key: 3,
    Month: '201901',
    Calls: '23,456',
    Mins: '145,678',
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
    Calls: '76,457',
    Mins: '434,567',
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
    Calls: '812,458',
    Mins: '8,345,678',
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
    Month: 'Total',
    Calls: '912,371',
    Mins: '8,925,923',
    ChargeableTrafficVolume: '',
    ChargeableUnitType: '',
    Rate_EUR: '',
    CMCCEUR: '',
    CMCCUSD: '',
    CTMEUR: '',
    CTMUSD: ''
  },
  {
    key: 7,
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
    colMerge: ['Month-Calls-Mins'],
  },
  {
    key: 8,
    Month: 'Rating Data',
    Calls: 'IDD:(0.0-15000000.0)mins',
    Mins: 'Macau Fixed/2N/Macau Mobile',
    ChargeableTrafficVolume: '8,925,923',
    ChargeableUnitType: 'mins',
    Rate_EUR: '0.010000',
    CMCCEUR: '',
    CMCCUSD: '',
    CTMEUR: '89259.23',
    CTMUSD: ''
  },
  {
    key: 9,
    Month: 'Total of  Traffic',
    Calls: '',
    Mins: '',
    ChargeableTrafficVolume: '',
    ChargeableUnitType: '',
    Rate_EUR: '',
    CMCCEUR: '---',
    CMCCUSD: '',
    CTMEUR: '89259.23',
    CTMUSD: '',
    isAddBorderTop:true
  },
  {
    key: 10,
    Month: 'Converted EUR to USD @1.513',
    Calls: '',
    Mins: '',
    ChargeableTrafficVolume: '',
    ChargeableUnitType: '',
    Rate_EUR: '',
    CMCCEUR: '',
    CMCCUSD: '---',
    CTMEUR: '',
    CTMUSD: '135049.21',
    colMerge:['Month-Calls'],
    useTableDataFooter:true
  },
  {
    key: 11,
    Month: 'Net amount for Exchange Traffic',
    Calls: '',
    Mins: '',
    ChargeableTrafficVolume: '',
    ChargeableUnitType: '',
    Rate_EUR: '',
    CMCCEUR: '---',
    CMCCUSD: '---',
    CTMEUR: '---',
    CTMUSD: '135049.21',
    colMerge:['Month-Calls-Mins'],
    useTableDataHeader:true
  }
]

export const dataBilateralCMCC = [
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
    key: 2,
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
    key: 1,
    Month: 'Outbound-CTM  to CMCC',
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
    colMerge: ['Month-Calls-Mins'],
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
    Mins: '2,363,457',
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
  },
  {
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
    Calls: '385705',
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
    colMerge: ['Month-Calls-Mins'],
  },
  {
    key: 11,
    Month: 'Commitment State',
    Calls: 'Commitment Value',
    Mins: '',
    ChargeableTrafficVolume: '21,000,000',
    ChargeableUnitType: 'mins',
    Rate_EUR: '',
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
    ChargeableTrafficVolume: '21,000,000',
    ChargeableUnitType: 'mins',
    Rate_EUR: '0.126286',
    CMCCEUR: '26520006.00',
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
    colMerge: ['Month-Calls-Mins'],
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
    colMerge: ['Month-Calls-Mins']
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
    CTMUSD: '',
    isAddBorderTop:true
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
    colMerge:['Month-Calls-Mins'],
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
    colMerge:['Month-Calls-Mins'],
    useTableDataHeader:true
  }
]

export const dataBilateralKDDI = [
  {
    key: 0,
    Month: 'Detail of Traffic',
    Calls: '',
    Mins: '',
    ChargeableTrafficVolume: '',
    ChargeableUnitType: '',
    Rate_EUR: '',
    CMCCEUR: 'Amount Due to KDDI',
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
    Rate_EUR: 'Rate(USD)',
    CMCCEUR: 'USD',
    CMCCUSD: 'USD',
    CTMEUR: 'USD',
    CTMUSD: 'USD',
    useTableLittleHeader:true,
  },
  {
    key: 2,
    Month: 'Outbound-CTM to KDDI',
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
    colMerge: ['Month-Calls-Mins'],
  },
  
  {
    key: 3,
    Month: '201801',
    Calls: '23,480',
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
    Month: '201802',
    Calls: '3,481',
    Mins: '123,456',
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
    Month: '201803',
    Calls: '13,482',
    Mins: '74,014,202',
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
    Month: 'Total',
    Calls: '40443',
    Mins: '74,436,225',
    ChargeableTrafficVolume: '',
    ChargeableUnitType: '',
    Rate_EUR: '',
    CMCCEUR: '',
    CMCCUSD: '',
    CTMEUR: '',
    CTMUSD: ''
  },
  {
    key: 7,
    Month: 'Flat -ALL',
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
    colMerge: ['Month-Calls-Mins'],
  },
  {
    key: 8,
    Month: 'Rating Data',
    Calls: '-',
    Mins: '-',
    ChargeableTrafficVolume: '74,436,225',
    ChargeableUnitType: 'mins',
    Rate_EUR: '0.0000',
    CMCCEUR: '0.00',
    CMCCUSD: '',
    CTMEUR: '',
    CTMUSD: ''
  },
  {
    key: 9,
    Month: 'Inbound-CTM to KDDI',
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
    colMerge: ['Month-Calls-Mins'],
  },
  {
    key: 10,
    Month: '201801',
    Calls: '23,480',
    Mins: '398,567',
    ChargeableTrafficVolume: '',
    ChargeableUnitType: '',
    Rate_EUR: '',
    CMCCEUR: '',
    CMCCUSD: '',
    CTMEUR: '',
    CTMUSD: ''
  },
  {
    key: 11,
    Month: '201802',
    Calls: '3,481',
    Mins: '13,456',
    ChargeableTrafficVolume: '',
    ChargeableUnitType: '',
    Rate_EUR: '',
    CMCCEUR: '',
    CMCCUSD: '',
    CTMEUR: '',
    CTMUSD: ''
  },
  {
    key: 12,
    Month: '201803',
    Calls: '229,865',
    Mins: '7,314,202',
    ChargeableTrafficVolume: '',
    ChargeableUnitType: '',
    Rate_EUR: '',
    CMCCEUR: '',
    CMCCUSD: '',
    CTMEUR: '',
    CTMUSD: ''
  },
 
  {
    key: 13,
    Month: 'Total',
    Calls: '256,826',
    Mins: '7,726,225',
    ChargeableTrafficVolume: '',
    ChargeableUnitType: '',
    Rate_EUR: '',
    CMCCEUR: '',
    CMCCUSD: '',
    CTMEUR: '',
    CTMUSD: ''
  },
  {
    key: 14,
    Month: 'Tire-ALL',
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
    colMerge:['Month-Calls-Mins']
  },
  {
    key: 15,
    Month: 'Commitment State',
    Calls: 'Commitment Value',
    Mins: '',
    ChargeableTrafficVolume: '5,600,000',
    ChargeableUnitType: 'mins',
    Rate_EUR: '',
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
    key: 16,
    Month: '',
    Calls: 'Shortfall of Committed Volume for 201702',
    Mins: '',
    ChargeableTrafficVolume: '1,523,104',
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
    key: 17,
    Month: 'Rating Data',
    Calls: 'IDD(0.0-5600000.0)mins',
    Mins: '',
    ChargeableTrafficVolume: '5,600,000',
    ChargeableUnitType: 'quarter',
    Rate_EUR: '10800.0000',
    CMCCEUR: '',
    CMCCUSD: '',
    CTMEUR: '10800.00',
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
    key: 18,
    Month: '',
    Calls: 'IDD(5600001.0-5699999.0)mins',
    Mins: '',
    ChargeableTrafficVolume: '99,998',
    ChargeableUnitType: 'mins',
    Rate_EUR: '0.0000',
    CMCCEUR: '',
    CMCCUSD: '',
    CTMEUR: '0.00',
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
    key: 19,
    Month: '',
    Calls: 'IDD(5700000.0.0-)mins',
    Mins: '',
    ChargeableTrafficVolume: '503,123',
    ChargeableUnitType: 'mins',
    Rate_EUR: '0.0002',
    CMCCEUR: '',
    CMCCUSD: '',
    CTMEUR: '100,62',
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
    key: 20,
    Month: 'Total of Traffic',
    Calls: '',
    Mins: '',
    ChargeableTrafficVolume: '-',
    ChargeableUnitType: '',
    Rate_EUR: '',
    CMCCEUR: '0.00',
    CMCCUSD: '',
    CTMEUR: '10900.62',
    CTMUSD: '',
    isAddBorderTop:true
  },
  {
    key: 21,
    Month: 'Converted EUR to USD @1.513',
    Calls: '',
    Mins: '',
    ChargeableTrafficVolume: '-',
    ChargeableUnitType: '',
    Rate_EUR: '',
    CMCCEUR: '',
    CMCCUSD: '0.00',
    CTMEUR: '',
    CTMUSD: '10900.62',
    colMerge:['Month-Calls-Mins'],
    useTableDataFooter:true
  },
  {
    key: 22 ,
    Month: 'Net amount for Exchange Traffic',
    Calls: '',
    Mins: '',
    ChargeableTrafficVolume: '',
    ChargeableUnitType: '',
    Rate_EUR: '',
    CMCCEUR: '---',
    CMCCUSD: '---',
    CTMEUR: '---',
    CTMUSD: '10900.62',
    colMerge:['Month-Calls-Mins'],
    useTableDataHeader:true
  }
]


/* 表格数据 -> 头部 */
export const columns: any = [
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
      customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'Rate_EUR'),
      customCell:() => {return {class: 'vertical-td-style'}}
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
        customCell:() => {return {class: 'vertical-td-style'}},
        customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'CMCCEUR')
      },
      {
        title: ' ',
        dataIndex: 'CMCCUSD',
        key: 'CMCCUSD',
        width: 200,
        customCell:() => {return {class: 'vertical-td-style'}},
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
        customCell:() => {return {class: 'vertical-td-style'}},
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
