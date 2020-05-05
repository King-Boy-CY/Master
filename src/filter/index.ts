import Vue from 'vue'
// 优先级
export const priority = Vue.filter('priority', (val: any) => {
  switch (val) {
    case 1:
      return 'Low'
    case 10:
      return 'High'
    default:
      return val
  }
})
//合同状态
export const contractStatus = Vue.filter('contractStatus', (val: any) => {
  switch (val) {
    case 1:
      return 'Expired'
    case 2:
      return 'Active'
    case 3:
      return 'Future'
    case 4:
      return 'Invalid'
    default:
      return val
  }
})
//号码头状态
export const numberPlanStatus = Vue.filter('numberPlanStatus', (val: any) => {
  switch (val) {
    case 1:
      return 'Expired'
    case 2:
      return 'Active'
    case 3:
      return 'Future'
    case 4:
      return 'Invalid'
    default:
      return val
  }
})
//合同类型
export const contractType = Vue.filter('contractType', (val: any) => {
  switch (val) {
    case 1:
      return 'Draft'
    case 2:
      return 'processing'
    case 3:
      return 'Refused'
    case 4:
      return 'Approved'
    default:
      return val
  }
})
//操作状态
export const operatingState = Vue.filter('operatingState', (val: any) => {
  if (val == undefined) {
    return
  } else if (val == 1) {
    return 'N'
  } else if (val == 2) {
    return 'E'
  } else if (val == 3) {
    return 'D'
  } else if (val == 100) {
    return 'R'
  } else if (val.length = 3 && val > 100 && val < 1000) {
    let n = val - 100
    return 'R' + n
  } else {
    return val
  }
})
//方向
export const direction = Vue.filter('direction', (val: any) => {
  switch (val) {
    case 1:
      return 'Inbound'
    case 2:
      return 'Outbound'
    case 3:
      return 'Bilateral'
    case "Inbound":
      return 1
    case "Outbound":
      return 2
    case "Bilateral":
      return 3
    default:
      return val
  }
})
//局数据状态
export const cycleState = Vue.filter('cycleState', (val: any) => {
  switch (val) {
    case 1:
      return 'Useful'
    case 2:
      return 'Discarded'
    default:
      return val
  }
})
//费率结构
export const rateStructure = Vue.filter('rateStructure', (val: any) => {
  switch (val) {
    case 1:
      return 'Flat'
    case 2:
      return 'Tier'
    case 3:
      return 'Interval'
    case 4:
      return 'RecurringCharge'
    case 5:
      return 'OneTimeCharge'
    case 6:
      return 'Penalty'
    case 7:
      return 'Cap'
    case 8:
      return 'Discount'
    default:
      return val
  }
})
//承诺量单位
export const commitmentUnit = Vue.filter('commitmentUnit', (val: any) => {
  switch (val) {
    case 1:
      return 'Sec'
    case 2:
      return 'Min'
    case 3:
      return 'Quarter'
    case 4:
      return 'Call'
    case 5:
      return 'User'
    default:
      return val
  }
})
//阶梯计费单位
export const tierUnit = Vue.filter('tierUnit', (val: any) => {
  switch (val) {
    case 1:
      return 'Sec'
    case 2:
      return 'Min'
    case 3:
      return 'Quarter'
    case 4:
      return 'Call'
    case 5:
      return 'User'
    default:
      return val
  }
})
//区间计费单位
export const intervalUnit = Vue.filter('intervalUnit', (val: any) => {
  switch (val) {
    case 1:
      return 'Sec'
    case 2:
      return 'Min'
    case 3:
      return 'Quarter'
    case 4:
      return 'Call'
    case 5:
      return 'User'
    default:
      return val
  }
})
//计费单元
export const chargeUnit = Vue.filter('chargeUnit', (val: any) => {
  switch (val) {
    case 1:
      return 'Secs'
    case 2:
      return 'Mins'
    case 3:
      return 'Quarters'
    case 4:
      return 'Call'
    case 5:
      return 'User'
    default:
      return val
  }
})
//循环维度
export const recurringDimension = Vue.filter('recurringDimension', (val: any) => {
  switch (val) {
    case 1:
      return 'Day'
    case 2:
      return 'Week'
    case 3:
      return 'Mounth'
    case 4:
      return 'Year'
    default:
      return val
  }
})
// 是否自动延期
export const isAutoRenew = Vue.filter('isAutoRenew', (val: any) => {
  switch (val) {
    case 0:
      return 'No'
    case 1:
      return 'Yes'
    default:
      return val
  }
})
//主叫号码显示
export const isCli = Vue.filter('isCli', (val: any) => {
  switch (val) {
    case 0:
      return 'No'
    case 1:
      return 'Yes'
    default:
      return val
  }
})
//是否有承诺量
export const isCommitment = Vue.filter('isCommitment', (val: any) => {
  switch (val) {
    case 0:
      return 'No'
    case 1:
      return 'Yes'
    default:
      return val
  }
})
//是否有宽限期
export const isGracePeriod = Vue.filter('isGracePeriod', (val: any) => {
  switch (val) {
    case 0:
      return 'No'
    case 1:
      return 'Yes'
    default:
      return val
  }
})
//是否补足亏空
export const isAnyShortfall = Vue.filter('isAnyShortfall', (val: any) => {
  switch (val) {
    case 0:
      return 'No'
    case 1:
      return 'Yes'
    default:
      return val
  }
})
// 是否超出给未来
export const isTrafficForward = Vue.filter('isTrafficForward', (val: any) => {
  switch (val) {
    case 0:
      return 'No'
    case 1:
      return 'Yes'
    default:
      return val
  }
})
//是否给出所有承诺量
export const isAnyExceed = Vue.filter('isAnyExceed', (val: any) => {
  switch (val) {
    case 0:
      return 'No'
    case 1:
      return 'Yes'
    default:
      return val
  }
})
//是否固定费用
export const isFixedCharge = Vue.filter('isFixedCharge', (val: any) => {
  switch (val) {
    case 0:
      return 'No'
    case 1:
      return 'Yes'
    default:
      return val
  }
})
//是否费率一致
export const isSameTariff = Vue.filter('isSameTariff', (val: any) => {
  switch (val) {
    case 0:
      return 'No'
    case 1:
      return 'Yes'
    default:
      return val
  }
})
//是否将最大时长作为阀值
export const isMaximumAsCap = Vue.filter('isMaximumAsCap', (val: any) => {
  switch (val) {
    case 0:
      return 'No'
    case 1:
      return 'Yes'
    default:
      return val
  }
})
//timeband类型
export const type = Vue.filter('type', (val: any) => {
  switch (val) {
    case 1:
      return 'Peak'
    case 2:
      return 'OffPeak'
    default:
      return val
  }
})
//账户类型
export const accountType = Vue.filter('accountType', (val: any) => {
  switch (val) {
    case 1:
      return 'Vendor'
    case 2:
      return 'Client'
    case 3:
      return 'Bilateral'
    default:
      return val
  }
})
//账户状态
export const accountStatus = Vue.filter('accountStatus', (val: any) => {
  switch (val) {
    case 1:
      return 'Expired'
    case 2:
      return 'Active'
    default:
      return val
  }
})
//业务类型
export const serviceType = Vue.filter('serviceType', (val: any) => {
  switch (val) {
    case 1:
      return 'Real'
    case 2:
      return 'Virtual'
    default:
      return val
  }
})
//费率区类型
export const destinationType = Vue.filter('destinationType', (val: any) => {
  switch (val) {
    case 1:
      return 'Mobile'
    case 2:
      return 'Fixed'
    default:
      return val
  }
})

