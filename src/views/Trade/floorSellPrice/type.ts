import { Moment } from 'moment';

interface formoptions {
    Tips: string,
    name: string,
    required: boolean,
    type: string,
    initialValue?: string | number | object | Moment[] | symbol,
    showSearch?: boolean,
    options?: string[] | object
}
interface columns {
    title: string,
    dataIndex: string,
    key: string
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