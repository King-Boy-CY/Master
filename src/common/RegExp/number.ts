// 检验支持数字为小数、且负数不能超过4位的正则
export const nagativePointNumberReg = /^(\-|\+)?\d+(\.\d{1,4})?$/;
// 检验支持数字为小数、负数的正则，负数不限制输入位数
export const nagativeNoLimitPointNumberReg = /^(\-|\+)?\d+(\.\d+)?$/;
// 检验支持数字的正则，不能为负数、可以为小数
export const numberPointReg = /^\d+(\.\d+)?$/;
// 检验支持数字的正则，不能为负数、可以为小数,保留4位小数
export const numberPointLimitReg = /^(0|[1-9]\d*)(\.\d{1,4})?$/
// 检验支持数字的正则，不能为负数、不可以为小数
export const numberReg = /^[1-9]\d*$/;
// 验证是否为正确邮箱的正则
export const emailReg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;

// 数字可以为正整数 负整数且小数点不能超过5位 及 0
export const routePointNumberReg = /^(\-|\+)?\d*(\.\d{0,5})?$/;

// 数字为正整数
export const routeNumberReg = /^[1-9]\d*$/;

// 值为百分数
export const percentReg = /^\d+(\.\d+)?%/;
