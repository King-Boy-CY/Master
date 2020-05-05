//cli过滤 
export const cli = function (val: any) {
  let cli = ""
  switch (val) {
    case 1:
      cli = "YES"
      break
    case 2:
      cli = "NO"
      break
  }
  return cli
}

//direction 方向过滤
export const direction = function (val: any) {
  let text = ""
  switch (val) {
    case 1:
      text = "Inbound"
      break
    case 2:
      text = "Outbound"
      break
    case 3:
      text = "Bilateral"
      break
    default:
      text = "NULL"
  }
  return text
}
//rateStructure 字段过滤
export const rateStructure = function (val: any) {
  let text: any = ""
  switch (val) {
    case 1:
      text = "Flat"
      break
    case 2:
      text = "Tier"
      break
    case 3:
      text = "Interval"
      break
    case 4:
      text = "RecurringCharge"
      break
    case 5:
      text = "OneTimeCharge"
      break
    case 6:
      text = "Penalty"
      break
    case 7:
      text = "Cap"
      break
    case 8:
      text = "Discount"
      break
  }
  return text
}
//commitmentUnit 
export const commitmentUnit = function (val: any) {
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
}