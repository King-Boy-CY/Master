import {
  BillingTypeOptions,
  DirectionOptions,
  StatementStatusOptions,
  ChargeTypeOptions
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

/* 表格数据 -> 身体 */
export const data = [
  {
    key: 0,
    Service: 'IDD',
    Account: 'CMCC',
    StatementNumber: '201902051150001000',
    Status: 4,
    Month: '201901',
    Cycle: '-',
    LockedDate: '20190205',
    ChargeType: 2,
    Direction: 1,
    BillingType: 2,
    BeginDate: '2019-01-01',
    EndDate: '2019-01-31',
    Issuer: 'Jack',
    ModifiedBy: 'Jack',
    LastModified: '2019-2-5 9:00:00'
  },
  {
    key: 1,
    Service: 'IDD',
    Account: 'CMCC',
    StatementNumber: '201902070915507000',
    Status: 4,
    Month: '201901',
    Cycle: '-',
    LockedDate: '20190207',
    ChargeType: 2,
    Direction: 2,
    BillingType: 2,
    BeginDate: '2019-01-01',
    EndDate: '2019-01-31',
    Issuer: 'Jack',
    ModifiedBy: 'Jack',
    LastModified: '2019-2-7 9:00:05',
  },
  {
    key: 2,
    Service: 'IDD',
    Account: 'CMHK',
    StatementNumber: '201902071208001000',
    Status: 1,
    Month: '201901',
    Cycle: '-',
    LockedDate: '',
    ChargeType: 1,
    Direction: 1,
    BillingType: 1,
    BeginDate: '2019-01-01',
    EndDate: '2019-01-31',
    Issuer: 'Lily',
    ModifiedBy: 'Lily',
    LastModified: '2019-2-7 12:08:00',
  },
  {
    key: 3,
    Service: 'IDD',
    Account: 'CMHK',
    StatementNumber: '201902071209001000',
    Status: 1,
    Month: '201901',
    Cycle: '-',
    LockedDate: '',
    ChargeType: 1,
    Direction: 2,
    BillingType: 1,
    BeginDate: '2019-01-01',
    EndDate: '2019-01-31',
    Issuer: 'Lily',
    ModifiedBy: 'Lily',
    LastModified: '2019-2-7 12:09:00',
  },
  {
    key: 4,
    Service: 'IDD',
    Account: 'CMCC',
    StatementNumber: '201908031130330000',
    Status: 4,
    Month: '-',
    Cycle: '201901',
    LockedDate: '20190803',
    ChargeType: 2,
    Direction: 3,
    BillingType: 3,
    BeginDate: '2019-01-01',
    EndDate: '2019-06-30',
    Issuer: 'Vivian',
    ModifiedBy: 'Vivian',
    LastModified: '2019-7-3 16:15:06',
  },
  {
    key: 5,
    Service: 'IDD',
    Account: 'CMCC',
    StatementNumber: '201908031150330000',
    Status: 3,
    Month: '-',
    Cycle: '201902',
    LockedDate: '20190606',
    ChargeType: 2,
    Direction: 1,
    BillingType: 3,
    BeginDate: '2019-01-01',
    EndDate: '2019-03-31',
    Issuer: 'Vivian',
    ModifiedBy: 'Vivian',
    LastModified: '2019-7-3 16:16:30',
  },
  {
    key: 6,
    Service: 'IDD',
    Account: 'IPLC',
    StatementNumber: '201903031522005000',
    Status: 3,
    Month: '-',
    Cycle: '201801',
    LockedDate: '20190206',
    ChargeType: 2,
    Direction: 3,
    BillingType: 3,
    BeginDate: '2018-01-01',
    EndDate: '2018-03-31',
    Issuer: 'Jack',
    ModifiedBy: 'Jack',
    LastModified: '2019-1-8 10:25:30',
  },
  
]

export const lockedDateOptions = [{
  name: 'Unlocked',
  value: 1
}, {
  name: 'locked',
  value: 2
}, {
  name: 'settled',
  value: 3
}, {
  name: 'post close Re-rate',
  value: 4
}]

/* 表格数据 -> 头部 */

export const columns: any = [
  {
    title: 'Service',
    dataIndex: 'Service',
    key: 'Service',
    width: 100,
    options:null,
    customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'Service', columns[0]['options'])
  },
  {
    title: 'Account',
    dataIndex: 'Account',
    key: 'Account',
    width: 100,
    options:null,
    customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'Account', columns[1]['options'])
  },
  {
    title: 'Statement number',
    dataIndex: 'StatementNumber',
    key: 'StatementNumber',
    width: 100,
    // sorter: (a:any, b:any) => a.age - b.age -> 排序声明函数
    customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'StatementNumber'),
  },
  {
    title: 'Status',
    dataIndex: 'Status',
    key: 'Status',
    width: 250,
    customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'Status', StatementStatusOptions()),
  },
  {
    title: 'Locked date',
    key: 'LockedDate',
    dataIndex: 'LockedDate',
    width: 220,
    customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'LockedDate', lockedDateOptions),
  }, {
    title: 'ChargeType',
    key: 'ChargeType',
    dataIndex: 'ChargeType',
    width: 150,
    customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'ChargeType', ChargeTypeOptions()),
  },
  {
    title: 'Direction',
    key: 'Direction',
    dataIndex: 'Direction',
    width: 150,
    customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'Direction', DirectionOptions()),
  },
  {
    title: 'Billing type',
    key: 'BillingType',
    dataIndex: 'BillingType',
    width: 150,
    customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'BillingType', BillingTypeOptions()),
  },
  {
    title: 'Cycle',
    dataIndex: 'Cycle',
    key: 'Cycle',
    width: 100,
    customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'Cycle')
  },
  {
    title: 'Month',
    dataIndex: 'Month',
    key: 'Month',
    width: 100,
    customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'Month')
  },
  {
    title: 'Begin date',
    key: 'BeginDate',
    dataIndex: 'BeginDate',
    width: 200,
    customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'BeginDate'),
  },
  {
    title: 'End date',
    key: 'EndDate',
    dataIndex: 'EndDate',
    width: 200,
    customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'EndDate'),
  }, {
    title: 'Issuer',
    key: 'Issuer',
    dataIndex: 'Issuer',
    width: 200,
    customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'Issuer'),
  }, {
    title: 'Modified by',
    key: 'ModifiedBy',
    dataIndex: 'ModifiedBy',
    width: 200,
    customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'ModifiedBy'),
  }, {
    title: 'Last modified',
    key: 'LastModified',
    dataIndex: 'LastModified',
    width: 200,
    customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'LastModified'),
  }
]
