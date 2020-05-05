// 表头下的传入的参数声明
export interface columnInterface {
    title: string;
    dataIndex: string;
    key: string;
    width?: number;
    customRender?: Function;
    sorter?: Function;
    options?: {
        name: string,
        value: string | number
    }[];
}

export interface searchOptionInterface {
    Tips: string;
    name: string;
    required: boolean;
    showSearch?: boolean;
    type: string;
    filterOption?: boolean;
    initialValue?: string | number;
    span: number;
    colSpan: number;
    options?: {
        name: string,
        value: string | number
    }[];
}

// export {
//     searchFormOptions
// }