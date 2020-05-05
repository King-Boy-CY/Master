// 搜索框 options
export interface searchOptionsInterface {
    required?: boolean;
    type: string;
    Tips: string;
    name: string;
    options?: {
        name: string;
        value: number | string;
    }[];
    initialValue?: any;
    format?: string;
    showTime?: any;
    disabled?: boolean;
    showSearch?: boolean;
    isCheckNumber?: boolean;
    // [prop: string]: any;
}

// table 上方按钮 options
export interface selectedBtnInterface {
    name: string | number;
    icon: string;
    index: number | string;
    disabled: boolean;
    tips?: string;
}

// table表头options
export interface tableColumnsInterface {
    title: string | number;
    dataIndex: string | number;
    key: string | number;
    options?: any;
    customRender?: Function;
    sorter?: Function | boolean;
    [prop: string]: any;
}

// 接口返回参数
export interface responedInterface {
    code: number;
    data: any;
    msg?: string;
}

// 选择框options
export interface selectOptionsInterface {
    name: string;
    value: number | string;
}

// formGroup 所有控件类型
export enum formGroupType {
    tags = 'tags',
    select = 'select',
    tagsAll = 'tags-all',
    input = 'input',
    child = 'child',
    upload = 'upload',
    textarea = 'textarea',
    pickerMonth = 'picker-month',
    picker = 'picker',
}

// form group 组件 options
export interface formGroupOptionInterface {
    disabled?: boolean; // 是否禁止
    required?: boolean; //是否必选
    showSearch?: boolean; // select是否可以搜索
    Tips?: string; // 该框名字
    decorator: string; // 数据下标 数据的key
    type: formGroupType; // 类型
    // options?: selectOptionsInterface[] | string[];
    options?: Array<selectOptionsInterface> | Array<string>;
    span?: number, // 外围盒子大小
    labelSpan?: number, // label 占用多大Span
    offset?: number, // labelSpan的偏移值
    wrapperSpan?: number, // 内容占用
    initialValue?: any, // 初始值
    isOptionsUseValue?: boolean; // select的options使用value
}