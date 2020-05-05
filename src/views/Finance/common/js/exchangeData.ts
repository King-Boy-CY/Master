import axios from 'axios'
import {message} from 'ant-design-vue'
import {
  getDetailAccounts,
  getDetailService,
  AdjustmentCndnSearch,
  AdjustmentRecordSearch,
  AdjustmentRecordAudit,
  AdjustmentRecordSubmit,
  AdjustmentCndnUpload,
  getServiceCurrencys,
  nettingRecordSearch,
  getFinanceCycles,
  getFinanceDestinations,
  confirmationDestInbound,
  confirmationDestOutbound
} from '@/api/index'
import {
  selectDataConfig as dataConfig
} from '@/common/dataConfig/index'

// 转换下拉框数据格式
const generateData = (resData: any, valueType: String = 'number') => {
  let data: Array<string | number | object> = [];
  resData.forEach((element: any, value: number) => {
    data.push({
      name: element,
      value: valueType === 'number' ? value + 1 : element
    })
  });
  return data
}

/************* 
 * 获取下拉框数据
 * ****************/

// 获取account数据

export const getAccountOptions = async (data?: any) => {
  // account的数据
  const res: dataConfig = await getDetailAccounts(data)
  return generateData(res.data || [], 'String')
}
// 获取services数据
export const getServiceOptions = async (data?: any) => {
  const res: dataConfig = await getDetailService(data)
  console.log(res);

  return generateData(res.data || [], 'String')
}
// 获取currency数据
export const getCurrencyOptions = async (data?: any) => {
  const res: dataConfig = await getServiceCurrencys(data)
  return generateData(res.data || [], 'String')
}
// 获取cycles数据
export const getCyclesOptions = async (data?: any) => {
  const res: dataConfig = await getFinanceCycles(data)
  let result: any = [], obj = {}, resData: any = res.data;
  for (let i = 0; i < resData.length; i++) {
    if (!obj[resData[i].name]) {
      result.push(resData[i])
      obj[resData[i].name] = true;
    }
  }
  return result
}
// 获取destinations数据
export const getDestinationsOptions = async (data?: any, isConcat?: boolean, isAdd: boolean = false) => {
  const res: dataConfig = await getFinanceDestinations(data)
  if (isConcat) {
    let changeData: any = res.data;
    let returnData: any = [];
    changeData.forEach((ele: any) => {
      returnData.push(ele.destinationNameList)
    })
    changeData = []
    for (let i in returnData) {
      changeData = changeData.concat(returnData[i])
    }
    returnData = [...new Set(changeData)]
    return generateData(returnData[0] || [], 'String')
  } else {
    if (isAdd) {
      const resInbound: dataConfig = await confirmationDestInbound(data)
      const resOutbound: dataConfig = await confirmationDestOutbound(data)
      let inboundData = generateData(resInbound.data || [], 'String')
      let outboundData = generateData(resOutbound.data || [], 'String')
      if (resInbound['code']&&resInbound['code']<0||resOutbound['code']&&resOutbound['code']<0) {
        message.warning('destination is not defined')
      }else {
        return [
          {
            data:inboundData,
            direction:1
          },
          {
            data:outboundData,
            direction:2
          }
        ]
      }
    } else {
      let changeData: any = res.data;
      let returnData: any = []
      changeData.forEach((ele: any) => {
        returnData.push({ data: generateData(ele.destinationNameList, 'String'), direction: ele.direction })
      })
      return returnData;
    }
  }
}

export const confirmationGetDestinbound = async (data?: any, isConcat?: boolean) => {
  const res: dataConfig = await confirmationDestInbound(data)
  return generateData(res.data || [], 'String')
}

export const confirmationGetDestoutbound = async (data?: any, isConcat?: boolean) => {
  const res: dataConfig = await confirmationDestOutbound(data)
  return generateData(res.data || [], 'String')
}

/************* 
 * Adjustment 调账
 * ****************/
// 搜索cn dn数据 
export const getCndnData = async (data?: any) => {
  const res: any = await AdjustmentCndnSearch(data)
  return res || {}
}

// 搜索record数据 
export const getRecordData = async (data?: any) => {
  const res: any = await AdjustmentRecordSearch(data)
  return res || {}
}

// 审核record数据 
export const AuditRecordData = async (data?: any) => {
  const res: any = await AdjustmentRecordAudit(data)
  return res || {}
}
// 提交record数据 
export const SubmitRecordData = async (data?: any) => {
  const res: any = await AdjustmentRecordSubmit(data)
  return res || {}
}

// cndn upload 表格 
export const UploadCndnFile = async (data?: any) => {
  const res: any = await AdjustmentCndnUpload(data)
  return res || {}
}

/************* 
 * netting 冲销
 * ****************/

export const RecordSearchData = async (data?: any) => {
  const res: any = await nettingRecordSearch(data)
  return res || {}
}