// table-input inputcolumns
export interface tableInputcolumnInterface {
    title:string;
    required?: boolean;
    type: string;
    options?: {
        name: string;
        value: number | string;
    }[] | string[];
    initialValue?: any;
    disabled?: boolean;
    rules?: any[]; // 看antd文档
    isCheckNumber?: boolean;
    // [prop: string]: any;
}

export interface initDataInterface {
    [prop: string]: any;
}