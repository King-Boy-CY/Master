import {
    responedInterface
} from '@/common/dataConfig/interface'
import { stateHandlingType, apiObjConfig, getFunDataType, expDataType, testFormType, dateStatusType, getExpDataType, expExcelType } from './type'
import { recodeConfig } from "@/assets/ts/config"
import moment, { Moment } from 'moment'
// 深拷贝
// 深拷贝
export const deepClone = (obj: any): any => {
    //判断拷贝的要进行深拷贝的是数组还是对象，是数组的话进行数组拷贝，对象的话进行对象拷贝
    var objClone = Array.isArray(obj) ? [] : {};
    //进行深拷贝的不能为空，并且是对象或者是
    if (obj && typeof obj === "object") {
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (obj[key] && typeof obj[key] === "object" && !(obj[key] instanceof RegExp)) {
                    // objClone[key] = deepClone(obj[key]);
                    objClone[key] = obj[key] instanceof moment ? moment(obj[key]) : deepClone(obj[key]);
                } else {
                    objClone[key] = obj[key];
                }
            }
        }
    } else {
        objClone = obj
    }
    return objClone;
}
// 数值装换三位加,号  例如 1000 =>1,000
export const toThousands = (num: any): any => {
    if (!Number(num)) return num
    const numArr = ('' + num).split('.')
    return (numArr[0] + '' || '0').replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') + (numArr[1] ? ('.' + numArr[1]) : '');
}

// 去数组空数据方法
export const notempty = function (data: any) {
    return data.filter(function (val) {
        return val !== '' && val !== undefined
    });
};
/**
 * 简单数组 | 对象数组去重去重
 * @param arr  简单数组 | 对象数组
 * @param distinctKey  对象数组去重时传入 根据这个key去重
 */
export const distinct = (arr: any[], distinctKey?: string) => {
    let result: any[] = []
    let obj = {}
    for (let i of arr) {
        const key: string = !distinctKey ? i : i[distinctKey]
        if (key !== null && typeof key === 'object') {
            throw new Error('参数一传入的对象数组时，需要传入参数二(distinctKey：去重的key)')
        }
        if (!obj[key]) {
            result.push(i)
            obj[key] = 1
        }
    }
    return result
}

// 是不是数组 用Array.isArray() 就好了
export const isArray = (values: any) => values && values instanceof Array
// 是不是对象
export const isObject = (value: any): boolean => value !== null && typeof value === 'object'
// 是不是数字
export const isNumber = (value: any) => typeof value === 'number'
// 表格字母排序
export const stringSorter = <T extends string>(a: T, b: T): number => a.toUpperCase().localeCompare(b.toUpperCase())

function fromCharCode(element, isRandom, len) {
    if (isRandom && len && typeof isNumber(len)) {
        for (let i = 0; i < len; i++) {
            if (element.options && !element.options.includes(String.fromCharCode(i + 65))) {
                element.options.push(String.fromCharCode(i + 65))
            }
        }
    }
}
/** 测试 demo 所用。。
 *  高级搜索带options 生成测试数据
 * @param values 高级搜索表单
 * @param numKey? [[key,length,item],....] key:指定下标,length需要生成的条数,item?:(指定变量 | boolean ) 指定变量 则是指定数据，true则是 A,b,c... 默认name
 */
export const testFormOptions = function (param: testFormType) {
    const { formData, generate, isRandom, length } = param
    const valueForm = formData;
    const numArr = generate;
    if (numArr && isArray(numArr)) {
        let isOptions: boolean = true;
        for (let i = 0, len = numArr.length; i < len; ++i) {
            const [key, length, item] = numArr[i];
            isOptions = true
            for (let index = 0; index < length; index++) {
                if (valueForm[key] && valueForm[key].options) {
                    if (valueForm[key].options[0] && isOptions) {
                        valueForm[key].options = [];
                        isOptions = false;
                    }
                    let isRan: typeof item, str: typeof item
                    typeof item === 'boolean' ? (isRan = item) : (str = item)
                    let value = str ? valueForm[key][str] + (index + 1) : valueForm[key].name + (index + 1);
                    if (str && !valueForm[key][str]) {
                        throw `不存在这个指定属性-> ${str}`;
                    }
                    if (!valueForm[key].options.includes(value) && !isRan) {
                        valueForm[key].options.push(value)
                    }
                    if (isRan) {
                        fromCharCode(valueForm[key], isRan, length)
                    }
                }
            }
        }
    } else {
        valueForm.forEach(element => {
            let isOps = (element.options && !element.options[0]);
            if (isOps && !isRandom) {
                if (length && isNumber(length)) {
                    for (let i = 0; i < length; i++) {
                        element.options.push(element.name + (i + 1))
                    }
                } else {
                    element.options.push(...[element.name + '1', element.name + '2', element.name + '3'])
                }
            }
            isRandom && isOps && fromCharCode(element, isRandom, length)
        });
    }
}
interface record {
    [k: string]: string
}
// 表格生成测试数据 测试 demo 所用。。
export const testTableData = function (param: { tableColumns: any, length: number }) {
    const { tableColumns, length } = param
    const data = tableColumns;
    let newArr: any = [];
    let record: record = {}
    data.forEach((element, index) => {
        if (!record['key']) {
            record['key'] = index
        }
        record[element.dataIndex] = element.dataIndex
    })
    for (let i = 0; i < length; i++) {
        for (const key in record) {
            record[key] = key + i
        }
        newArr.push({ ...record })
    }
    return newArr;
}

/**
 * 下拉框的接口处理
 * @param res 接口返回
 * @param config 每个item中需要修改的key
 * 
 *  每一项是对象 但对象的属性不是name和value 例如 [{id:13,name}] = >[{value:13,name}] 那么 config 传 [{oldKey:id,newKey:value}]
 */
export const resolveSelectResponed = (res: responedInterface, config?: { oldKey: string | number, newKey: string | number }[]) => {
    if (res.code > 0 && res.data && res.data.length && res.data instanceof Array) {
        return res.data.map((item: string) => {
            // item 是对象
            if (typeof item === 'object' && item !== null) {
                if (config && config instanceof Array && config.length) {
                    config.forEach((configItem: any) => {
                        item[configItem.newKey] = item[configItem.oldKey]
                        delete item[configItem.oldKey]
                    })
                    return item
                }
            } else if (typeof item === 'string') {
                // item 是字符串
                return {
                    name: item,
                    value: item
                }
            }
            return item
        })
    }
    return []
}
/**
 *  请求自动调用 & 赋值
 * @param fn 接口的回调
 * @param resolve Promise 如果都请求完了就执行
 * @param len 需要被调用接口的个数
 * @param field 发送到后台的对象
 */
// 存储请求的数据
let opsData: any = [];
// 存储请求的回调
let actions: any = [];
function getFunData(param: getFunDataType) {
    const { fn, index, field, formData } = param
    const action = async () => {
        let fieObj: apiObjConfig = {};
        if (isArray(field)) {
            fieObj = getTransmissionData(field, undefined, undefined, formData);
        }
        let data = Object.keys(fieObj).length ? fieObj : field;
        await fn(data).then((res: recodeConfig) => {
            const newData = res.data ? res.data : res;
            opsData[index] && opsData[index].push(newData)
        });
        return opsData[index]
    }
    actions.push(action());
}
/**
 *  读取 & 设定值
 * @param values 表单数据
 * @param funs 调用的接口集合
 */
let isFn = (fn, newData) => typeof fn === 'function' && fn(newData)
export const getExpData = async function (params: getExpDataType) {
    let { data, fns, field, success, error } = params;
    let formData = data;
    let apiObj: apiObjConfig = {}; // 此对象记录已请求的值 -> 暂无用到 简称备胎       
    await expData({ fns, field, formData: formData });
    Promise.all(actions).then(() => {
        let newData = [].concat(...opsData);
        let i = -1;
        formData.forEach(item => {
            if (item.options === null) {
                item.options = [];
            }
            if (item.options && !item.options[0] && item.disabled !== true) {
                i += 1;
                apiObj[item.name] = newData[i];
                item.options = newData[i] || [];
            }
        });
        i = -1;
        opsData = []
        isFn(success, newData)
    }).catch(function (err) {
        isFn(error, err)
    });
}
/**
 * 返回请求值
 * @param fns 接收接口集合 执行 Promise
 * @param field 发送到后台的对象
 */
export const expData = function (param: expDataType) {
    const { fns, field, formData } = param
    fns.forEach((fun, index) => {
        opsData[index] = [];
        getFunData({
            fn: fun,
            index,
            field: isArray(field) ? field[index] : field,
            formData
        });
    });
}
/**
 * 
 * @param field 开始，结束时间等其他的字段名
 * @param format 时间格式 默认 YYYY-MM-DD
 * @param data 选中的时间
 */
function getTransmissionData(field: any, data?: Moment[], format?: string, formData?: any) {
    let initDate = data || getInitDate(formData);
    let fieObj: apiObjConfig = {};
    for (const key in field) {
        if (isObject(field[key])) {
            let obj = field[key];
            for (const index in obj) {
                fieObj[index] = obj[index];
            }
        } else {
            fieObj[field[key]] = moment(initDate[key]).format(format || 'YYYY-MM-DD');
        }
    }
    return fieObj
}
let isDateEmpty: boolean = false; // 记录是否清空过时间 用于数据的还原防止无用的请求 (用户可能重新选回默认时间)
let firstData: string[] = []; // 收录第一次的数据
// 读取时间控件值 带开始结束的
function getInitDate(formData) {
    let initDate: Moment[] = [];
    formData.forEach((res) => {
        if (res.initialValue && isArray(res.initialValue) && res.type === 'rangePicker') {
            initDate = res.initialValue;
        }
    });
    return initDate
}
/**
 * 根据时间状态禁止对应选项
 * @param params {
 *      formData：表单数据
 *      disabledKey:需要禁止状态的下标
 *      fns：需要请求的数组 api
 *      field：需要传到后台的参数
 *  }
 */
async function stateHandling(params: stateHandlingType) {
    let { formData, disabledKey, fns, field, format, data } = params;
    let new_data: any = [], i: number = -1;
    let fieObj: apiObjConfig = getTransmissionData(field, data, format, formData);
    await expData({
        fns, field: { ...fieObj }, formData
    });
    Promise.all(actions).then(() => {
        new_data = [].concat(...opsData)
        disabledKey.forEach(index => {
            !isDateEmpty && firstData.push(formData[index]["options"]);
            i += 1;
            formData[index]["disabled"] = false;
            formData[index]["options"] = new_data[i];
        });
        i = -1;
        isDateEmpty = true;
        opsData = [];
    })
}
/**
 *  时间状态
 * @param params {
 *          data:时间控件选择的时间,
 *          formData:表单数据
 *          disabledKey:需要禁止状态的下标
 *          fns：需要请求的数组 api    
 *          field：需要传到后台的参数   默认 ["beginDate", "endDate"]
 *          format:时间需要格式化的格式 默认 YYYY-MM-DD
 * }
 */
export const checkDateStatus = async function (params: dateStatusType) {
    let { data, formData, disabledKey, fns, field = ["beginDate", "endDate"], format = 'YYYY-MM-DD' } = params;
    if (!data.length) {
        disabledKey.forEach(index => {
            formData[index]["disabled"] = true;
        });
    } else {
        let initDate: Moment[] = getInitDate(formData);
        if (!initDate[-1]) {
            stateHandling({ disabledKey, field, fns, formData, format, data })
            return disabledKey.forEach(index => formData[index]["disabled"] = false);
        }
        let [initBeg, initEnd] = initDate;
        let [beg, end]: Moment[] = data;
        // 拿到默认时间判断跟当前时间是否相同不同则重新调用接口
        if (moment(initBeg).valueOf() === moment(beg).valueOf() && moment(end).valueOf() === moment(initEnd).valueOf()) {
            let i: number = -1;
            disabledKey.forEach(index => {
                i += 1;
                formData[index]["disabled"] = false;
                if (firstData[- 1]) {
                    formData[index]["options"] = firstData[i];
                }
            });
            i = -1;
        } else {
            stateHandling({ disabledKey, field, fns, formData, format, data })
        }
    }
}
function openDownloads(url: any, saveName: string): void {
    const _window: any = window
    if (!/http/.test(url)) {
        url = _window.HOST + url
    }
    if (typeof url == 'object' && url instanceof Blob) {
        url = URL.createObjectURL(url)
    }
    let aLink = document.createElement('a')
    aLink.href = url
    aLink.download = saveName || ''
    let event: any
    if (_window.MouseEvent) {
        event = new MouseEvent('click')
    } else {
        event = document.createEvent('MouseEvents')
        event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null
        )
    }
    aLink.dispatchEvent(event)
}
export const expExcel = async function ({ fn, data, expModule, format }: expExcelType) {
    let fieName = (expModule || '') + '_' + moment().format(format || 'YYYYMMDDHHmmss')
    await fn(data).then((res: any) => {
        let blob = new Blob([res], { type: "application/xlsx" });
        let url = window.URL.createObjectURL(blob);
        openDownloads(url, fieName + '.xlsx');
    })
}