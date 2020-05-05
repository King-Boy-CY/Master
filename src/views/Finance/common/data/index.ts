import { deepClone } from '@/assets/ts';

  // 待完善
  // returnData是请求回来的数据
  // localData是本地数据
  export const exchangeData = (localData: Array<number | string>,returnData: Array<number | string>) => {
    let newData: Array<string|number> = [];
    returnData.forEach((item: any, key: any) => {
      let {
        serviceName: Service,
        accountName: Account,
        chargeType: ChargeType,
        direction: Direction,
        cycleName: Cycle,
        adjustmentMonth: Month,
        beginDate: BeginDate,
        endDate: EndDate
      }: any = item;
      let {
        Service: serviceName,
        Account: accountName,
        ChargeType: chargeType,
        Direction: direction,
        Cycle: cycleName,
        Month: adjustmentMonth,
        BeginDate: beginDate,
        EndDate: endDate,
        ...other
      }: any = localData[key]
      newData.push({ 
        key, 
        Service, 
        Account, 
        ChargeType,
        Direction,
        Cycle,
        Month,
        BeginDate,
        EndDate,
        ...other
      });
    });
    return newData;
  }
export const CycleOptions = [
  {
    name: '201701',
    value: '201701',
    BeginDate: '2017-01-01',
    EndDate: '2017-06-30',
  },
  {
    name: '201801',
    value: '201801',
    BeginDate: '2018-01-01',
    EndDate: '2018-03-31',
  },
  {
    name: '201806',
    value: '201806',
    BeginDate: '2018-06-01',
    EndDate: '2018-06-30',
  },
  {
    name: '201808',
    value: '201808',
    BeginDate: '2018-08-01',
    EndDate: '2018-08-31',
  }, {
    name: '201901',
    value: '201901',
    BeginDate: '2019-01-01',
    EndDate: '2019-03-31'
  }, {
    name: '201902',
    value: '201902',
    BeginDate: '2019-02-01',
    EndDate: '2019-02-27'
  }, {
    name: '201903',
    value: '201903',
    BeginDate: '2019-03-01',
    EndDate: '2019-03-31'
  },{
    name: '201904',
    value: '201904',
    BeginDate: '2019-04-01',
    EndDate: '2019-04-30'
  },{
    name: '201905',
    value: '201905',
    BeginDate: '2019-05-01',
    EndDate: '2019-05-31',
  },{
    name: '201906',
    value: '201906',
    BeginDate: '2019-06-01',
    EndDate: '2019-06-30'
  }]
export const AccountCycleOptions =[
    {
      name:4,
      value:'201901',
      BeginDate: '20190101',
      EndDate: '20190331'
    },
    {
      name:4,
      value:'201801',
      BeginDate: '20180101',
      EndDate: '20180331'
    },
    {
      name:1,
      value:'201901',
      BeginDate: '20190101',
      EndDate: '20190630'
    },
    {
      name:1,
      value:'201902',
      BeginDate: '20190101',
      EndDate: '20190331'
    },
    {
      name:1,
      value:'201801',
      BeginDate: '20180101',
      EndDate: '20180630'
    },
    {
      name:3,
      value:'201801',
      BeginDate: '20180101',
      EndDate: '20180331'
    },
    {
      name:3,
      value:'201901',
      BeginDate: '20190101',
      EndDate: '20190131'
    },
  ]
  //cndn 单独出来的调账的类型
  export const AdjustmentTypeCndnOptions: any = ()=>{
    return [
     {
       name: 'CN',
       value: 1
     }, {
       name: 'DN',
       value: 2
     }
   ]
 }

// 调账类型
export const AdjustmentTypeOptions: any = ()=>{
   return [
    {
      name: 'CN',
      value: 1
    }, {
      name: 'DN',
      value: 2
    }, {
      name: 'Changed Agreement',
      value: 3
    }, {
      name: 'Suspend CDR',
      value: 4
    }
  ]
}

// 数据来源
export const DataSourceOptions: any = ()=>{
  return [
    {
      name: 'System',
      value: 1
    }, {
      name: 'Operator',
      value: 2
    }
  ]
}

// 计费单元 [value = name]
export const ChargeableUnitTypeOptions: any = ()=>{
  return [
    {
      name: 'Secs',
      value: 1
    },
    {
      name: 'Mins',
      value: 2
    },
    {
      name: 'quarter',
      value: 3
    },
    {
      name: 'Calls',
      value: 4
    },  {
      name: 'User',
      value: 5
    },  
  ]
}
export const destination = [
  {
    name:'Hong Kong Fixed',
    value:'Hong Kong Fixed'
  },
  {
    name: 'Hong Kong Mobile',
    value: 'Hong Kong Mobile'
  },
  {
    name:'Macau-Fixed',
    value:'Macau-Fixed'
  },
  {
    name:'Macau-Mobile',
    value:'Macau-Mobile'
  },
  {
    name:'JAPAN-IP PHONE',
    value:'JAPAN-IP PHONE'
  },
  {
    name:'JAPAN-MOBILE',
    value:'JAPAN-MOBILE'
  },
  {
    name:'INDIA-BANGALORE',
    value:'INDIA-BANGALORE'
  },
  {
    name:'INDIA-CHENNAI',
    value:'INDIA-CHENNAI'
  },
  {
    name:'Malaysia Fixed',
    value:'Malaysia Fixed'
  },
  {
    name:'Malaysia Mobile',
    value:'Malaysia Mobile'
  }
]

// 账单状态
export const StatementStatusOptions: any = ()=>{
  return [
    {
      name: 'Unlocked',
      value: 1
    }, {
      name: 'Locked',
      value: 2
    }, {
      name: 'Settled',
      value: 3
    }, {
      name: 'Post Close Re-rate',
      value: 4
    }
  ]
}

// 方向
export const DirectionOptions: any=()=>{
  return [
    {
    name: 'Inbound',
    value: 1
    }, {
      name: 'outbound',
      value: 2
    }, {
      name: 'bilateral',
      value: 3
    }]
}

// 账单类型
export const BillingTypeOptions: any = ()=>{
  return [
    {
      name: 'Invoice',
      value: 1,
      disabled:false
    },
    {
      name: 'Declaration',
      value: 2,
      disabled:false
    },
    {
      name: 'General statement',
      value: 3,
      disabled:false
    }
  ]
}

// 冲销出具类型
export const SettleTypeOptions: any = () =>{
  return [
    {
      name:'System',
      value:1
    },
    {
      name:'Manual',
      value:2
    }
  ]
}

// 财务类型
export const  ChargeTypeOptions: any = ()=>{
  return [{
    name: 'Hubbing',
    value: 1
  }, {
    name: 'VC',
    value: 2
  }]
}
// 调账状态
export const adjustmentStatusOptions: any = ()=>{
  return [
    {
      name:'Draft',
      value:1
    },
    {
      name:'Processing',
      value:2
    },
    {
      name:'Refused',
      value:3
    },
    {
      name:'Approved',
      value:4
    }
  ]
}

// 对账单差异状态
export const DifferenceOptions: any = ()=>{
  return [
    {
      name: 'Confirmed',
      value: 1
    },
    {
      name:'Processing',
      value:2
    }
  ]
}


export const AccountOptions: any = [
  {
  name: 'CMCC',
  value: 1
}, {
  name: 'CMHK',
  value: 2
}, {
  name: 'KDDI',
  value: 3
},{
  name:'KT',
  value:4
}]

export const ServiceOptions: any = [
  {
    name: 'IP',
    value: 1
  },
  {
    name: 'IDD',
    value: 2
  },
  {
    name: 'IPLC',
    value: 3
  },
]