interface formoptions {
  Tips: string,
  name: string,
  required: boolean,
  type: string,
  initialValue?: string | number | object,
  showSearch?: boolean,
  options?: string[],
  span?: number
}
interface tableBtn {
  name: string,
  icon: string,
  index: number,
  disabled: boolean
}
interface columns {
  title: string,
  dataIndex: string,
  key: string | number,
  width: number
}
interface tableBtn {
  name: string,
  icon: string,
  index: number,
  disabled: boolean
}
export {
  formoptions,
  columns,
  tableBtn
}