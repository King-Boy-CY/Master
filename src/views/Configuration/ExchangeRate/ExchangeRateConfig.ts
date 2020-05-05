// 表头下的传入的参数声明
interface ExchangeRates {
    title: string,
    dataIndex: string,
    key: string,
    width: number,
    sorter?:Function,
}
// 表格的传入数据参数声明
interface formOptionsConfigs {
    Tips: string,
    name?: string,
    required: boolean,
    showSearch?: boolean,
    type: string,
    initialValue?: string | object,
    showTime?:boolean,
    format?:string,
    span?: number,
    colSpan?: number,
    options?: null,
   
}


function pop(value: any) {
    return value.pop();
}

export const dateDate = (direction?: number, isDirection?: boolean) => {
    let field = ["beginDate", "endDate", { direction: direction || 1 }]
    if (isDirection) {
        pop(field)
    }
    return field;
};

export { ExchangeRates,formOptionsConfigs}