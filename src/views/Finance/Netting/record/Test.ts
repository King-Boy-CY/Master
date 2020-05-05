import { toThousands } from '@/assets/ts/index.ts'
import {
  ChargeTypeOptions,
  DirectionOptions,
  SettleTypeOptions,
  adjustmentStatusOptions
} from "@/views/Finance/common/data/index.ts";
let ChargeTypeOptions1 = ChargeTypeOptions()
let DirectionOptions1 = DirectionOptions()
let SettleTypeOptions1 = SettleTypeOptions()
let adjustmentStatusOptions1 = adjustmentStatusOptions()
const renderContent = (value: any, row: any, index: any, dataIndex: any, options?: Array<Object>) => {
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
  if (options && options instanceof Array) {
    // obj.children = options[value]
    const find:any = options.find((item: any) => item.value === value)
    if (find) {
      obj.children = find.name
    }
  }
  if (dataIndex === 'Inbound_Calls' || dataIndex === 'Inbound_Mins' || dataIndex === 'Inbound_Amount' || dataIndex === 'Outbound_Calls' || dataIndex === 'Outbound_Mins' || dataIndex === 'Outbound_Amount' || dataIndex === 'Netting_Amount') {
    obj.children = toThousands(value)
  }
  return obj;
}

/* 表格数据 -> 头部 */
export const columns: any = [
  {
    title: 'Service',
    dataIndex: 'serviceName',
    key: 'ServiserviceNamece',
    options:null,
    customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'Service', columns[0]['options'])
  }, {
    title: 'Account',
    dataIndex: 'accountName',
    key: 'accountName',
    options:null,
    customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'Account', columns[1]['options'])
  }, {
    title: 'Charge type',
    key: 'chargeType',
    dataIndex: 'chargeType',
    customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'ChargeType', ChargeTypeOptions1),

  }, {
    title: 'Direction',
    key: 'direction',
    dataIndex: 'direction',
    customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'Direction', DirectionOptions1),
  }, {
    title: 'Cycle',
    key: 'nettingCycle',
    dataIndex: 'nettingCycle',
    width: 130,
  }, {
    title: 'Month',
    key: 'nettingMonth',
    dataIndex: 'nettingMonth',
    width: 130,
  }, {
    title: 'Begin date',
    key: 'beginDate',
    dataIndex: 'beginDate',
    width: 170,
  }, {
    title: 'End date',
    key: 'endDate',
    dataIndex: 'endDate',
    width: 170,
  },
  {
    title: 'Inbound data',
    children: [
      {
        title: 'Calls',
        key: 'inboundCalls',
        dataIndex: 'inboundCalls',
        customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'Inbound_Calls'),
      }, {
        title: 'Mins',
        key: 'inboundDuration',
        dataIndex: 'inboundDuration',
        customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'Inbound_Mins'),
      }, {
        title: 'Amount receivable(USD)',
        key: 'amountReceivableUsd',
        dataIndex: 'amountReceivableUsd',
        customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'Inbound_Amount'),
      },
    ]
  },
  {
    title: 'Outbound data',
    children: [
      {
        title: 'Calls',
        key: 'outboundCalls',
        dataIndex: 'outboundCalls',
        customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'Outbound_Calls'),
      }, {
        title: 'Mins',
        key: 'outboundDuration',
        dataIndex: 'outboundDuration',
        customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'Outbound_Mins'),
      }, {
        title: 'Amount payable(USD)',
        key: 'amountPayableUsd',
        dataIndex: 'amountPayableUsd',
        customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'Outbound_Amount'),
      },
    ]
  },
  {
    title: 'Netting data',
    children: [
      {
        title: 'Amount(USD)',
        key: 'nettingAmountUsd',
        dataIndex: 'nettingAmountUsd',
        customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'Netting_Amount'),
      }
    ]
  },
  {
    title: 'Netting statement',
    key: 'nettingStatement',
    dataIndex: 'nettingStatement',
    scopedSlots: { customRender: 'download' },
  }, {
    title: 'Status',
    key: 'nettingStatus',
    dataIndex: 'nettingStatus',
    width: 80,
    customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'Status', adjustmentStatusOptions1),
  }, {
    title: 'Reason',
    key: 'auditReasonHistory',
    dataIndex: 'auditReasonHistory',
  }, {
    title: 'Operator',
    key: 'operator',
    dataIndex: 'operator',
  }, {
    title: 'Submitting time',
    key: 'submittingTime',
    dataIndex: 'submittingTime',
    width: 170,
  }, {
    title: 'Auditor',
    key: 'auditor',
    dataIndex: 'auditor',
  }, {
    title: 'Auditing time',
    key: 'auditingTime',
    dataIndex: 'auditingTime',
    width: 170,
  }, {
    title: 'Settle type',
    key: 'settleType',
    dataIndex: 'settleType',
    customRender: (value: any, row: any, index: any) => renderContent(value, row, index, 'SettleType', SettleTypeOptions1),
  }, {
    title: 'Data-entry operator',
    key: 'dataEntryOperator',
    dataIndex: 'dataEntryOperator',
  }, {
    title: 'Operating time',
    key: 'operatingTime',
    dataIndex: 'operatingTime',
    width: 170,
  }
]
// let a = [{'accountName':'account1'}]
//  b = [{'Account':''}]
//  a = b