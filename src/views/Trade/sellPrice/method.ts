import moment, { Moment } from 'moment'
import { recodeConfig } from "@/assets/ts/config"
import { apiObjConfig, spitDateType, dateStatusType, expDataType, stateHandlingType } from './type'
import { getRefInDestinationName, getCountryName } from "@/api/index"
import { isArray, isObject } from '@/assets/ts/index'
const formats: string = 'YYYY-MM-DD';
/**
 * 
 * @param values 已输入值 -> 对象格式
 * @param format 时间格式
 * @param formoptionData 高级搜索表单数据
 * @param names 时间变量名
 */
export const spitDate = function (params: spitDateType): object {
    let { data, format, formData, field = ['beginDate', 'endDate'] } = params;
    let newData = data && JSON.parse(JSON.stringify(data)) || undefined;
    let ops = formData;
    if (newData) {
        for (const key in newData) {
            // 如果是带开始结束时间的
            if (Array.isArray(newData[key])) {
                let fistFiedStart: string = field.shift() || '';
                let fistFiedEnd: string = field.shift() || '';
                if (fistFiedStart && fistFiedEnd) {
                    let [beg, end] = newData[key];
                    newData[fistFiedStart] = moment(beg).format(format || 'YYYY-MM-DD');
                    newData[fistFiedEnd] = moment(end).format(format || 'YYYY-MM-DD');
                }
                delete newData[key]
            }
        }
        // 如果下拉框需要传数字的话
        ops.forEach(element => {
            if (element.sendNumber && element.options && newData[element.name]) {
                newData[element.name] = element.options.indexOf(newData[element.name]) + 1;
            }
        });
    }
    return newData
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
function getFunData(fn: Function, index, field?: any, formoptionData?: any) {
    const action = async () => {
        let fieObj: apiObjConfig = {};
        if (isArray(field)) {
            fieObj = getTransmissionData(field, undefined, undefined, formoptionData);
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
 * 返回请求值
 * @param fns 接收接口集合 执行 Promise
 * @param field 发送到后台的对象
 */
export const expData = function (fns: Function[], field?: any, formoptionData?: any) {
    fns.forEach((fun, index) => {
        opsData[index] = [];
        getFunData(fun, index, isArray(field) ? field[index] : field, formoptionData);
    });
}
/**
 *  读取 & 设定值
 * @param values 表单数据
 * @param funs 调用的接口集合
 */
export const getExpData = async function (params: expDataType) {
    let { data, fns, field } = params;
    let formoptionData = data;
    let apiObj: apiObjConfig = {}; // 此对象记录已请求的值 -> 暂无用到 简称备胎       
    await expData(fns, field, formoptionData);
    Promise.all(actions).then(() => {
        let newData = [].concat(...opsData);
        let i = -1;
        formoptionData.forEach(item => {
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
            fieObj[field[key]] = moment(initDate[key]).format(format || formats);
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
    let newDdata: any = [], i: number = -1;
    let fieObj: apiObjConfig = getTransmissionData(field, data, format, formData);
    await expData(fns, { ...fieObj }, formData);
    Promise.all(actions).then(() => {
        newDdata = [].concat(...opsData)
        disabledKey.forEach(index => {
            !isDateEmpty && firstData.push(formData[index]["options"]);
            i += 1;
            formData[index]["disabled"] = false;
            formData[index]["options"] = newDdata[i];
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
    let { data, formData, disabledKey, fns = [getRefInDestinationName, getCountryName], field = ["beginDate", "endDate"], format = formats } = params;
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