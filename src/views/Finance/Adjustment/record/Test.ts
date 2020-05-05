import {
  AdjustmentTypeOptions,
  ChargeTypeOptions,
  DirectionOptions,
} from '@/views/Finance/common/data/index.ts'

const renderContent = (value: any, row: any, index: any, dataIndex: any, options?: any) => {
  const obj = {
    children: value,
    attrs: {
      colSpan: 1,
      rowSpan: 1
    },
  };
  if (options && options instanceof Array) {
    // obj.children = options[value]
    const find = options.find((item: any) => item.value === value)
    if (find) {
      obj.children = find.name
    }
  }
  return obj;
}

/* 表格数据 -> 身体
1:Draft, 2:Processing, 3:Refused, 4:Approved
*/
export const data = [
  {
    key: 0,
    Service: 2,
    Account: 1,
    ChargeType: 2,
    Direction: 3,
    Cycle: '201701',
    Month: '-',
    BeginDate: '2017-01-01',
    EndDate: '2017-06-30',
    AdjustmentType: 1,
    Amounts_USD: '575374.00',
    Status: 4,
    Reason: 'Error on amount',
    Remark: '',
    Operator: 'vivian',
    SubmittingTime: '2017-11-8  12:15:08',
    Auditor: 'jack',
    AuditingTime: '2017-11-9  9:15:08'
  },
  {
    key: 1,
    Service: 2,
    Account: 3,
    ChargeType: 1,
    Direction: 1,
    Cycle: '-',
    Month: '201901',
    BeginDate: '2019-01-01',
    EndDate: '2019-01-31',
    AdjustmentType: 2,
    Amounts_USD: '6328.00',
    Status: 1,
    Reason: '',
    Remark: '',
    Operator: '',
    SubmittingTime: '',
    Auditor: '',
    AuditingTime: ''
  }, {
    key: 2,
    Service: 2,
    Account: 1,
    ChargeType: 2,
    Direction: 3,
    Cycle: '201901',
    Month: '-',
    BeginDate: '2019-01-01',
    EndDate: '2019-06-30',
    AdjustmentType: 3,
    Amounts_USD: '-2116172.58',
    Status: 2,
    Reason: '',
    Remark: '',
    Operator: 'jack',
    SubmittingTime: '2019-11-8  11:22:08',
    Auditor: 'vivian',
    AuditingTime: '2019-11-9  14:01:05'
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
    value:4
  }, { 
    name: 'Post Close Re-rate',
    value: 5
  }]
export const StatusOptionsValue = [
  {
    name: "Draft",
    value:1,
  },
  {
    name: "Processing",
    value:2,
  },
  {
    name: "Refused",
    value:3,
  },
  {
    name: "Approved",
    value:4,
  }
]
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
    options:null,
    customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'serviceName', columns[0]['options'])
  },
  {
    title: 'Account',
    dataIndex: 'accountName',
    key: 'accountName',
    options:null,
    // sorter: (a:any, b:any) => a.age - b.age -> 排序声明函数
    customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'accountName', columns[1]['options']),
  },
  {
    title: 'Charge type',
    dataIndex: 'chargeType',
    key: 'chargeType',
    width: 150,
    customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'chargeType', ChargeTypeOptions()),
  },
  {
    title: 'Direction',
    key: 'direction',
    dataIndex: 'direction',
    customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'direction', DirectionOptions()),
  },
  {
    title: 'Adjustment type',
    key: 'adjustmentType',
    dataIndex: 'adjustmentType',
    width: 190,
    customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'adjustmentType', AdjustmentTypeOptions()),
  },
  {
    title: 'Cycle',
    key: 'cycleName',
    dataIndex: 'cycleName',
    width: 140,
    customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'cycleName')
  }, 
  {
    title: 'Month',
    key: 'adjustmentMonth',
    dataIndex: 'adjustmentMonth',
    width: 140
  },
  {
    title: 'Begin date',
    key: 'beginDate',
    dataIndex: 'beginDate',
    width: 190
  },
  {
    title: 'End date',
    key: 'endDate',
    dataIndex: 'endDate',
    width: 190
  }, 
  {
    title: 'Amounts(USD)',
    key: 'amountUsd',
    dataIndex: 'amountUsd',
    width: 190,
  },
  {
    title: 'Status',
    key: 'adjustmentStatus',
    dataIndex: 'adjustmentStatus',
    width: 190,
    customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'adjustmentStatus', StatusOptionsValue),
  },
  {
    title: 'Reason',
    key: 'auditReasonHistory',
    dataIndex: 'auditReasonHistory',
    width: 200,
  },
  {
    title: 'remark',
    key: 'remark',
    dataIndex: 'remark',
    width: 200,
  },
  {
    title: 'Operator',
    key: 'operator',
    dataIndex: 'operator',
    width: 190,
  },
  {
    title: 'Submitting time',
    key: 'submittingTime',
    dataIndex: 'submittingTime',
    width: 200,
  },
  {
    title: 'Auditor',
    key: 'auditor',
    dataIndex: 'auditor',
    width: 190,
  },
  {
    title: 'Auditing time',
    key: 'auditingTime',
    dataIndex: 'auditingTime',
    width: 200,
  }
]
