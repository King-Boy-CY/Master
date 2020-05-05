



/**
 * 定义请求状态Enum
 * 定义展示信息Enum
 */
export  const enum  Status {
  Ok = 1,
  error = -1

}

export const enum Message {
  Edid = 'Edif success',
  Add = 'Add success',
  Net_anomaly = 'Net Anomaly',
  Unknown = 'Unknown Error',
  AtLeast_One = "Please select at least one piece of data",
  Only_One = 'Only one data can be selected',
  Confirm_Title = 'Are you sure you want to save the current data?',
  Confirm_Delete = 'Are you sure you want to delete the selected data ?',
  Confirm_Add = 'Are you sure you want to add it ?',
  Confirm_Edit = 'Are you sure you want to modify this data ?'
}

/**
 * results:返回数据数量
 * page: 当前页
 * total 数据总量
 * sortField: 按什么字段筛选
 * sortOrder: 排序 descend 降序 ascend 升序
 */
export interface IPagination {
  pageSize: number,
  currentPage: number,
  total: number,
  sortField: string,
  sortOrder: string,
  [prop: string]: any
}

export let Pagination: IPagination = {
  pageSize: 10,
  currentPage: 1,
  total: 0,
  sortField: '',
  sortOrder: ''
}
