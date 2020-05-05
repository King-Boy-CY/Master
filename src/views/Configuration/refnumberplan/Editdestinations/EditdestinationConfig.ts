import vue from 'vue'
import {
  EditDestinationUpload,
  } from '@/api/index'

// 表头下的传入的参数声明
interface ExchangeRates {
    title: string,
    dataIndex: string,
    key: string,
    width: number,
    sorter?:Function,
    customRender?:Function,
    scopedSlots?:{customRender:string};
}
// 表格的传入数据参数声明
interface formOptionsConfigs {
  Tips: string,
  name: string,
  required: boolean,
  showSearch?: boolean,
  type: string,
  filterOption?:boolean,
  initialValue?: Object | String,
  span: number,
  colSpan: number,
  options?: any[],
  startwithOptions?:boolean
 
}
// cndn upload 表格 
export const UploadCndnFile = async (data?: any) => {
    const res: any = await EditDestinationUpload(data)
    return res || {}
}

export { ExchangeRates,formOptionsConfigs}