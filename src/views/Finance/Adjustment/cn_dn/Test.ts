import {
  DataSourceOptions,
  ChargeableUnitTypeOptions,
  DirectionOptions,
  AdjustmentTypeOptions,
  ChargeTypeOptions
} from '@/views/Finance/common/data/index.ts'
import {
  calcTableTd
} from "@/views/Finance/components/DownloadFile/xlsx";
let DataSourceOptions1 = DataSourceOptions()
let ChargeableUnitTypeOptions1 = ChargeableUnitTypeOptions()
let DirectionOptions1 = DirectionOptions()
let AdjustmentTypeOptions1 = AdjustmentTypeOptions()
let ChargeTypeOptions1 = ChargeTypeOptions()
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
    const find = options.find((item: any) => item.value == value)
    if (find) {
      obj.children = find.name
    }
  }
  return obj;
}

/* 表格数据 -> 身体 */
export const data = [
  
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
    },
  {
    title: 'Account',
    dataIndex: 'accountName',
    key: 'accountName',
    },
  {
    title: 'Charge type',
    dataIndex: 'chargeType',
    key: 'chargeType',
    width: 150,
    customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'chargeType', ChargeTypeOptions1),
  },
  {
    title: 'Direction',
    key: 'direction',
    dataIndex: 'direction',
    customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'direction', DirectionOptions1),
  },
  {
    title: 'Cycle',
    key: 'cycleName',
    dataIndex: 'cycleName',
    width: 100,
    // customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'Cycle'),
  }, {
    title: 'Month',
    key: 'adjustmentMonth',
    dataIndex: 'adjustmentMonth',
    width: 100,
    // customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'Month'),
  }, {
    title: 'Begin date',
    key: 'beginDate',
    dataIndex: 'beginDate',
    width: 210,
    // customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'BeginDate'),
  },
  {
    title: 'End date',
    key: 'endDate',
    dataIndex: 'endDate',
    width: 210,
  },
  {
    title: 'Adjustment type',
    key: 'adjustmentType',
    dataIndex: 'adjustmentType',
    width: 190,
    customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'adjustmentType', AdjustmentTypeOptions1),
  }, {
    title: 'Amount',
    key: 'amount',
    dataIndex: 'amount',
    // width: 190,
  },
  {
    title: 'Currency',
    key: 'currency',
    dataIndex: 'currency',
    options:[],
    customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'currency', columns[10].options),
  }, 
  {
    title: 'Exchange date',
    key: 'exchangeDate',
    dataIndex: 'exchangeDate',
    width: 190,
  },
  {
    title: 'Amount(USD)',
    key: 'amountUsd',
    dataIndex: 'amountUsd',
    width: 190,
  },
  {
    title: 'Charge Traffic Volume',
    key: 'chargeTrafficVolume',
    dataIndex: 'chargeTrafficVolume',
    width: 280,
  }, {
    title: 'Chargeable Unit Type',
    key: 'chargeableUnitType',
    dataIndex: 'chargeableUnitType',
    width: 220,
    customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'chargeableUnitType', ChargeableUnitTypeOptions1),
  },
  {
    title: 'Reason',
    key: 'adjustmentReason',
    dataIndex: 'adjustmentReason',
    width: 350,
  }, {
    title: 'Data Source',
    key: 'dataSource',
    dataIndex: 'dataSource',
    width: 190,
    customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'dataSource', DataSourceOptions1),
  }, {
    title: 'Operator files',
    key: 'operatorFiles',
    dataIndex: 'operatorFiles',
    scopedSlots: {customRender: 'download'},
    width: 200,
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

/* 弹出模态框的头部PreviewColumns和数据PreviewData*/
export const PreviewColumns: any = [
  {
    title: ' ',
    dataIndex: 'columns1',
    key: 'columns1',
    width: 600,
    customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'columns1')
  },
  {
    title: ' ',
    dataIndex: 'columns2',
    key: 'columns2',
    width: 200,
    customCell:() => {return {class: 'center-td-style'}},
    customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'columns2')

  },
  {
    title: ' ',
    dataIndex: 'columns3',
    key: 'columns3',
    width: 100,
    customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'columns3')
  },
  {
    title: ' ',
    dataIndex: 'columns4',
    key: 'columns4',
    width: 100,
    customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'columns4')
  },
  {
    title: ' ',
    dataIndex: 'columns5',
    key: 'columns5',
    width: 150,
    customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'columns5')
  },
  {
    title: ' ',
    dataIndex: 'columns6',
    key: 'columns6',
    width: 100,
    customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'columns6')
  },
  {
    title: ' ',
    dataIndex: 'columns7',
    key: 'columns7',
    width: 100,
    customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'columns7')    
  },
  {
    title: ' ',
    dataIndex: 'columns8',
    key: 'columns8',
    width: 100,
    customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'columns8')
  },
  {
    title: ' ',
    dataIndex: 'columns9',
    key: 'columns9',
    width: 100,
    customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'columns9')  
  },
  {
    title: ' ',
    dataIndex: 'columns10',
    key: 'columns10',
    width: 150,
    customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'columns10')  
  },
  {
    title: ' ',
    dataIndex: 'columns11',
    key: 'columns11',
    width: 100,
    customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'columns11')  
  },
  {
    title: ' ',
    dataIndex: 'columns12',
    key: 'columns12',
    width: 100,
    customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'columns12')  
  },
  {
    title: ' ',
    dataIndex: 'columns13',
    key: 'columns13',
    width: 100,
    customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'columns13')  
  }
]
export const SystemData = [
  {
    key: 0,
    columns1: 'Receiving Operator: CMCC',
    columns2: '',
    columns3: '',
    columns4: '',
    columns5: '',
    columns6: '',
    columns7: '',
    columns8: '',
    columns9: '',
    columns10: 'Sending Operator: CTM',
    columns11: '',
    columns12: '',
    columns13: '',
    FontSizeEleven:true,
    colMerge:['columns1-columns2','columns10-columns11-columns12-columns13']
  },
  {
    key: 1,
    columns1: 'Leagl Address：',
    columns2: '',
    columns3: '',
    columns4: '',
    columns5: '',
    columns6: '',
    columns7: '',
    columns8: '',
    columns9: '',
    columns10: 'Leagl Address：',
    columns11: '',
    columns12: '',
    columns13: '',
    FontSizeEleven:true,
    colMerge:['columns1-columns2','columns10-columns11']
  },
  {
    key: 2,
    columns1: "China Mobile10F Guotong",
    columns2: '',
    columns3: '',
    columns4: '',
    columns5: '',
    columns6: '',
    columns7: '',
    columns8: '',
    columns9: '',
    columns10: 'Macau 14F, Guotong Building, 9023',
    columns11: '',
    columns12: '',
    columns13: '',
    colMerge:['columns1-columns2','columns10-columns11-columns12-columns13']
  },
  {
    key: 4,
    columns1: 'CREDIT NOTE FOR Discount From CTM',
    columns2: '',
    columns3: '',
    columns4: '',
    columns5: '',
    columns6: '',
    columns7: '',
    columns8: '',
    columns9: '',
    columns10: '',
    columns11: '',
    columns12: '',
    columns13: '',
    FontSizeEighteen:true,
    colMerge:['columns1-columns2-columns3-columns4-columns5-columns6-columns7-columns8-columns9-columns10-columns11-columns12-columns13']
  },
  {
    key: 5,
    columns1: 'Credit Note Date: 17-Apr-2018',
    columns2: '',
    columns3: '',
    columns4: '',
    columns5: '',
    columns6: '',
    columns7: '',
    columns8: '',
    columns9: '',
    columns10: '',
    columns11: '',
    columns12: '',
    columns13: '',
    FontSizeEleven:true,
    colMerge:['columns1-columns2']
  },
  {
    key: 6,
    columns1: 'Credit Note No: CN-IDD-CTM-CMCC-VC-Bilateral-201801-1',
    columns2: '',
    columns3: '',
    columns4: '',
    columns5: '',
    columns6: '',
    columns7: '',
    columns8: '',
    columns9: '',
    columns10: '',
    columns11: '',
    columns12: '',
    columns13: '',
    FontSizeEleven:true,
    colMerge:['columns1-columns2']
  },
  {
    key: 7,
    columns1: 'Traffic Period: 01/01/2018 - 30/06/2018',
    columns2: '',
    columns3: '',
    columns4: '',
    columns5: '',
    columns6: '',
    columns7: '',
    columns8: '',
    columns9: '',
    columns10: '',
    columns11: '',
    columns12: '',
    columns13: '',
    FontSizeEleven:true,
    colMerge:['columns1-columns2']
  },
  {
    key: 8,
    columns1: 'Seq No.',
    columns2: 'Detail Description',
    columns3: '',
    columns4: '',
    columns5: '',
    columns6: '',
    columns7: '',
    columns8: 'Value in SDR',
    columns9: '',
    columns10: '',
    columns11: 'Value in USD',
    columns12: '',
    columns13: '',
    ModalHeadBG:true,
    colMerge:['columns2-columns3-columns4-columns5-columns6-columns7','columns8-columns9-columns10','columns11-columns12-columns13']
  },
  {
    key: 9,
    columns1: 1,
    columns2: 'CTM-CMCC-Discount by additional agreement',
    columns3: '',
    columns4: '',
    columns5: '',
    columns6: '',
    columns7: '',
    columns8: '413468.144',
    columns9: '',
    columns10: '',
    columns11: '575374',
    columns12: '',
    columns13: '',
    colMerge:['columns2-columns3-columns4-columns5-columns6-columns7','columns8-columns9-columns10','columns11-columns12-columns13']
  },
  {
    key: 10,
    columns1: '',
    columns2: 'Credit Note Total',
    columns3: '',
    columns4: '',
    columns5: '',
    columns6: '',
    columns7: '',
    columns8: '413468.144',
    columns9: '',
    columns10: '',
    columns11: '575374',
    columns12: '',
    columns13: '',
    FontSizeEleven:true,
    colMerge:['columns2-columns3-columns4-columns5-columns6-columns7','columns8-columns9-columns10','columns11-columns12-columns13']
  },
  {
    key: 11,
    columns1: 'Exchange Rate SDR/USD:',
    columns2: '',
    columns3: '1.39158',
    columns4: '',
    columns5: '22-Mar-18',
    columns6: '',
    columns7: '',
    columns8: '',
    columns9: '',
    columns10: '',
    columns11: '',
    columns12: '',
    columns13: '',
    colMerge:['columns1-columns2']
  },
  {
    key: 12,
    columns1: 'For Enquiries:',
    columns2: '',
    columns3: '',
    columns4: '',
    columns5: '',
    columns6: '',
    columns7: '',
    columns8: '',
    columns9: '',
    columns10: '',
    columns11: '',
    columns12: '',
    columns13: '',
    FontSizeEleven:true,
    colMerge:['columns1-columns2']
  },
  {
    key: 13,
    columns1: 'Email: invoices@archclearing.com',
    columns2: '',
    columns3: '',
    columns4: '',
    columns5: '',
    columns6: '',
    columns7: '',
    columns8: '',
    columns9: '',
    columns10: '',
    columns11: '',
    columns12: '',
    columns13: '',
    colMerge:['columns1-columns2']
  },
  {
    key: 14,
    columns1: 'Tel : +86 138 2882 5639',
    columns2: '',
    columns3: '',
    columns4: '',
    columns5: '',
    columns6: '',
    columns7: '',
    columns8: '',
    columns9: '',
    columns10: '',
    columns11: '',
    columns12: '',
    columns13: '',
    colMerge:['columns1-columns2']
  },
  {
    key: 15,
    columns1: 'Fax : +86 755 83889510',
    columns2: '',
    columns3: '',
    columns4: '',
    columns5: '',
    columns6: '',
    columns7: '',
    columns8: '',
    columns9: '',
    columns10: '',
    columns11: '',
    columns12: '',
    columns13: '',
    colMerge:['columns1-columns2']
  }
]
export const OperatorData = [
  {
    key: 0,
    columns1: 'Receiving Operator:CHNCT',
    columns2: '',
    columns3: '',
    columns4: '',
    columns5: '',
    columns6: '',
    columns7: '',
    columns8: '',
    columns9: 'Sending Operator: HKGPP',
    columns10: '',
    columns11: '',
    columns12: '',
    columns13: '',
    FontSizeEleven:true,
    colMerge:['columns1-columns2','columns9-columns10-columns11-columns12-columns13']
  },
  {
    key: 1,
    columns1: 'China Mobile10F Guotong Building South Of ',
    columns2: '',
    columns3: '',
    columns4: '',
    columns5: '',
    columns6: '',
    columns7: '',
    columns8: '',
    columns9: 'ARCH-CMHK 14F,Guotong Building,9023',
    columns10: '',
    columns11: '',
    columns12: '',
    columns13: '',
    colMerge:['columns1-columns2','columns9-columns10-columns11-columns12-columns13']
  },
  {
    key: 2,
    columns1: 'XinzhouBinhe RoadShenzhen518048 China',
    columns2: '',
    columns3: '',
    columns4: '',
    columns5: '',
    columns6: '',
    columns7: '',
    columns8: '',
    columns9: 'BinheRoad, Shenzhen, China518048',
    columns10: '',
    columns11: '',
    columns12: '',
    columns13: '',
    colMerge:['columns1-columns2','columns9-columns10-columns11-columns12-columns13']
  },
  {
    key:3,
    columns1: '',
    columns2: '',
    columns3: '',
    columns4: '',
    columns5: '',
    columns6: '',
    columns7: '',
    columns8: '',
    columns9: '',
    columns10: '',
    columns11: '',
    columns12: '',
    columns13: ''
  },
  {
    key:4,
    columns1: '',
    columns2: '',
    columns3: '',
    columns4: '',
    columns5: '',
    columns6: '',
    columns7: '',
    columns8: '',
    columns9: '',
    columns10: '',
    columns11: '',
    columns12: '',
    columns13: ''
  },
  {
    key:5,
    columns1: '',
    columns2: '',
    columns3: '',
    columns4: '',
    columns5: '',
    columns6: '',
    columns7: '',
    columns8: '',
    columns9: '',
    columns10: '',
    columns11: '',
    columns12: '',
    columns13: ''
  },
  {
    key:6,
    columns1: '',
    columns2: '',
    columns3: '',
    columns4: '',
    columns5: '',
    columns6: '',
    columns7: '',
    columns8: '',
    columns9: '',
    columns10: '',
    columns11: '',
    columns12: '',
    columns13: ''
  },
  {
    key: 7,
    columns1: 'DEBIT NOTE FOR SIMM TRAFFIC FROM ARCH',
    columns2: '',
    columns3: '',
    columns4: '',
    columns5: '',
    columns6: '',
    columns7: '',
    columns8: '',
    columns9: '',
    columns10: '',
    columns11: '',
    columns12: '',
    columns13: '',
    FontSizeEighteen:true,
    colMerge:['columns1-columns2-columns3-columns4-columns5-columns6-columns7-columns8-columns9-columns10-columns11-columns12-columns13']
  },
  {
    key:8,
    columns1: '',
    columns2: '',
    columns3: '',
    columns4: '',
    columns5: '',
    columns6: '',
    columns7: '',
    columns8: '',
    columns9: '',
    columns10: '',
    columns11: '',
    columns12: '',
    columns13: ''
  },
  {
    key: 9,
    columns1: 'Debit Note Date:17-Apr-2019',
    columns2: '',
    columns3: '',
    columns4: '',
    columns5: '',
    columns6: '',
    columns7: '',
    columns8: '',
    columns9: '',
    columns10: '',
    columns11: '',
    columns12: '',
    columns13: '',
    FontSizeEleven:true,
    colMerge:['columns1-columns2']
  },
  {
    key: 10,
    columns1: 'Debit Note No: DN-SIMM-HKGPP-CHNCT-201903-1',
    columns2: '',
    columns3: '',
    columns4: '',
    columns5: '',
    columns6: '',
    columns7: '',
    columns8: '',
    columns9: '',
    columns10: '',
    columns11: '',
    columns12: '',
    columns13: '',
    FontSizeEleven:true,
    colMerge:['columns1-columns2-columns3-columns4']
  },
  {
    key: 11,
    columns1: 'Traffic Period: 01/03/2019-31/03/2019',
    columns2: '',
    columns3: '',
    columns4: '',
    columns5: '',
    columns6: '',
    columns7: '',
    columns8: '',
    columns9: '',
    columns10: '',
    columns11: '',
    columns12: '',
    columns13: '',
    FontSizeEleven:true,
    colMerge:['columns1-columns2']
  },
  {
    key: 12,
    columns1: 'Seq No.',
    columns2: 'Detail Description',
    columns3: '',
    columns4: '',
    columns5: '',
    columns6: '',
    columns7: '',
    columns8: 'Value in SDR',
    columns9: '',
    columns10: '',
    columns11: 'Value in USD',
    columns12: '',
    columns13: '',
    ModalHeadBG:true,
    ModalTableLimit:true,
    colMerge:['columns2-columns3-columns4-columns5-columns6-columns7','columns8-columns9-columns10','columns11-columns12-columns13']
  },
  {
    key: 13,
    columns1: 1,
    columns2: 'CMHK-CMCC 201903 SIMM Monthly Fee',
    columns3: '',
    columns4: '',
    columns5: '',
    columns6: '',
    columns7: '',
    columns8: '413468.144',
    columns9: '',
    columns10: '',
    columns11: '575374.00',
    columns12: '',
    columns13: '',
    ModalTableLimit:true,
    colMerge:['columns2-columns3-columns4-columns5-columns6-columns7','columns8-columns9-columns10','columns11-columns12-columns13']
  },
  {
    key: 14,
    columns1: '',
    columns2: 'Debit Note Total',
    columns3: '',
    columns4: '',
    columns5: '',
    columns6: '',
    columns7: '',
    columns8: '413468.144',
    columns9: '',
    columns10: '',
    columns11: '575374.00',
    columns12: '',
    columns13: '',
    FontSizeEleven:true,
    ModalTableLimit:true,
    colMerge:['columns2-columns3-columns4-columns5-columns6-columns7','columns8-columns9-columns10','columns11-columns12-columns13']
  },
  {
    key:15,
    columns1: '',
    columns2: '',
    columns3: '',
    columns4: '',
    columns5: '',
    columns6: '',
    columns7: '',
    columns8: '',
    columns9: '',
    columns10: '',
    columns11: '',
    columns12: '',
    columns13: ''
  },
  {
    key: 16,
    columns1: 'Exchange Rate USD/USD:',
    columns2: '1.39158',
    columns3: '',
    columns4: '',
    columns5: '22-Feb-19',
    columns6: '',
    columns7: '',
    columns8: '',
    columns9: '',
    columns10: '',
    columns11: '',
    columns12: '',
    columns13: '',
    centerNumberStyle:true,
    colMerge:['columns1']
  },
  {
    key:17,
    columns1: '',
    columns2: '',
    columns3: '',
    columns4: '',
    columns5: '',
    columns6: '',
    columns7: '',
    columns8: '',
    columns9: '',
    columns10: '',
    columns11: '',
    columns12: '',
    columns13: ''
  },
  {
    key:18,
    columns1: '',
    columns2: '',
    columns3: '',
    columns4: '',
    columns5: '',
    columns6: '',
    columns7: '',
    columns8: '',
    columns9: '',
    columns10: '',
    columns11: '',
    columns12: '',
    columns13: ''
  },
  {
    key: 19,
    columns1: 'For Enquiries:',
    columns2: '',
    columns3: '',
    columns4: '',
    columns5: '',
    columns6: '',
    columns7: '',
    columns8: '',
    columns9: '',
    columns10: '',
    columns11: '',
    columns12: '',
    columns13: '',
    FontSizeEleven:true,
    colMerge:['columns1-columns2']
  },
  {
    key: 20,
    columns1: 'Email: invoices@archclearing.com',
    columns2: '',
    columns3: '',
    columns4: '',
    columns5: '',
    columns6: '',
    columns7: '',
    columns8: '',
    columns9: '',
    columns10: '',
    columns11: '',
    columns12: '',
    columns13: '',
    colMerge:['columns1-columns2']
  },
  {
    key: 21,
    columns1: 'Tel : +86 138 2882 5639',
    columns2: '',
    columns3: '',
    columns4: '',
    columns5: '',
    columns6: '',
    columns7: '',
    columns8: '',
    columns9: '',
    columns10: '',
    columns11: '',
    columns12: '',
    columns13: '',
    colMerge:['columns1-columns2']
  },
  {
    key: 22,
    columns1: 'Fax : +86 755 83889510',
    columns2: '',
    columns3: '',
    columns4: '',
    columns5: '',
    columns6: '',
    columns7: '',
    columns8: '',
    columns9: '',
    columns10: '',
    columns11: '',
    columns12: '',
    columns13: '',
    colMerge:['columns1-columns2']
  }]
export const SystemDataDownloadExcelRules = [{
  grid: calcTableTd(13, 1, 1, 1),
  style: {
      backgroundColor: "#edeef7"
  }
},
{
  grid: calcTableTd(13, 16, 1, 1),
  style: {
      border: "0.5px solid #E8E8E8",
      height: "40px"
  }
},
{
  grid: calcTableTd(13, 15, 1, 2),
  style: {
      backgroundColor: "#F5F6FA"
  }
},
{
  grid: calcTableTd(13, 2, 1, 1),
  style: {
      fontSize: "14px",
      fontWeight: "Bold",
      color: "#000000"
  }
},
{
  grid: calcTableTd(13, 1, 1, 5),
  style: {
      fontSize: "16px",
      fontWeight: "Bold",
      color: "#000000"
  }
},
{
  grid: calcTableTd(13, 3, 1, 6),
  style: {
      fontSize: "14px",
      fontWeight: "Bold",
      color: "#000000"
  }
},
{
  grid: calcTableTd(13, 1, 1, 9),
  style: {
    backgroundColor: "#000000",
    color:'#FFFFFF'
  }
},
{
  grid: calcTableTd(13, 1, 1, 11),
  style: {
      fontSize: "14px",
      fontWeight: "Bold",
      color: "#000000"
  }
},
{
  grid: calcTableTd(13, 1, 1, 13),
  style: {
      fontSize: "14px",
      fontWeight: "Bold",
      color: "#000000"
  }
}
]
export const OperatorDataDownloadExcelRules = [{
  grid: calcTableTd(13, 1, 1, 1),
  style: {
      backgroundColor: "#edeef7"
  }
},
{
  grid: calcTableTd(13, 15, 1, 1),
  style: {
      border: "0.5px solid #E8E8E8",
      height: "40px"
  }
},
{
  grid: calcTableTd(13, 14, 1, 2),
  style: {
      backgroundColor: "#F5F6FA"
  }
},
{
  grid: calcTableTd(13, 2, 1, 1),
  style: {
      fontSize: "14px",
      fontWeight: "Bold",
      color: "#000000"
  }
},
{
  grid: calcTableTd(13, 1, 1, 4),
  style: {
      fontSize: "16px",
      fontWeight: "Bold",
      color: "#000000"
  }
},
{
  grid: calcTableTd(13, 3, 1, 5),
  style: {
      fontSize: "14px",
      fontWeight: "Bold",
      color: "#000000"
  }
},
{
  grid: calcTableTd(13, 1, 1, 8),
  style: {
    backgroundColor: "#000000",
    color:'#FFFFFF'
  }
},
{
  grid: calcTableTd(13, 1, 1, 10),
  style: {
      fontSize: "14px",
      fontWeight: "Bold",
      color: "#000000"
  }
},
{
  grid: calcTableTd(13, 1, 1, 12),
  style: {
      fontSize: "14px",
      fontWeight: "Bold",
      color: "#000000"
  }
}
]





