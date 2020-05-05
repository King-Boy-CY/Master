/* 表格数据 -> 身体 */
export const data = [
  {
    key: 1,
    NumberPlan: 'Joe Black2',
    Destination: 'Destination1',
    destType: 'destType1',
    dialedDigits: 'dialedDigits1',
    Country: 'China1',
    CountryCode: 'Country code1',
    roundingRules: 'Rounding rules1'
  },
  {
    key: 2,
    NumberPlan: 'Joe Blacka2',
    Destination: 'Destinationa2',
    destType: 'destType2',
    dialedDigits: 'dialedDigits2',
    Country: 'China2',
    CountryCode: 'Country code2',
    roundingRules: 'Rounding rules2'
  },
  {
    key: 3,
    NumberPlan: 'Joe Black3',
    Destination: 'Destination3',
    destType: 'destType3',
    dialedDigits: 'dialedDigits3',
    Country: 'China3',
    CountryCode: 'Country code3',
    roundingRules: 'Rounding rules3'
  }
]
/* 表格数据 -> 头部 */
export const columns: any = [
  {
    title: 'Number plan',
    dataIndex: 'NumberPlan',
    key: 'NumberPlan'
    // sorter: (a:any, b:any) => a.age - b.age -> 排序声明函数
  },
  {
    title: 'Destination',
    dataIndex: 'Destination',
    key: 'Destination',
    width: '12%'
    // sorter: (a:any, b:any) => a.age - b.age -> 排序声明函数
  },
  {
    title: 'Dest. type',
    dataIndex: 'destType',
    width: '30%',
    key: 'destType'
  },
  {
    title: 'Dialed digits',
    dataIndex: 'dialedDigits',
    width: '30%',
    key: 'dialedDigits'
  },
  {
    title: 'Country',
    dataIndex: 'Country',
    width: '30%',
    key: 'Country'
  },
  {
    title: 'Country code',
    dataIndex: 'CountryCode',
    width: '30%',
    key: 'CountryCode'
  },
  {
    title: 'Rounding rules',
    dataIndex: 'roundingRules',
    width: '30%',
    key: 'roundingRules'
  }
]
export const ratePlanData = [
  {
    key: 1,
    NumberPlan: 'Joe Black',
    Destination: 'Destination',
    destType: 'Destination',
    dialedDigits: 'dialedDigits',
    Country: 'China',
    CountryCode: 'Country code',
    roundingRules: 'Rounding rules'
  }
]
export const ratePlanColumns: any = [
  {
    title: 'Number plan',
    dataIndex: 'NumberPlan',
    key: 'NumberPlan'
    // sorter: (a:any, b:any) => a.age - b.age -> 排序声明函数
  },
  {
    title: 'Destination',
    dataIndex: 'Destination',
    key: 'Destination',
    width: '12%'
    // sorter: (a:any, b:any) => a.age - b.age -> 排序声明函数
  },
  {
    title: 'Dest. type',
    dataIndex: 'destType',
    width: '30%',
    key: 'destType'
  },
  {
    title: 'Dialed digits',
    dataIndex: 'dialedDigits',
    width: '30%',
    key: 'dialedDigits'
  },
  {
    title: 'Country',
    dataIndex: 'Country',
    width: '30%',
    key: 'Country'
  },
  {
    title: 'Country code',
    dataIndex: 'CountryCode',
    width: '30%',
    key: 'CountryCode'
  },
  {
    title: 'Rounding rules',
    dataIndex: 'roundingRules',
    width: '30%',
    key: 'roundingRules'
  }
]

export const ratePlanColumn: any = [
  {
    title: 'Account',
    dataIndex: 'accountName',
    key: 'accountName',
    width: '6%',
    scopedSlots: {
      customRender: 'accountName'
    }
  },
  {
    title: 'Contract',
    dataIndex: 'contractName',
    key: 'contractName',
    width: '4%'
  },
  {
    title: 'Rate plan',
    dataIndex: 'ratePlanName',
    width: '20%',
    key: 'ratePlanName'
  },
  {
    title: 'Product',
    dataIndex: 'productNameList',
    width: '26%',
    key: 'productNameList',
    scopedSlots: {
      customRender: "commaSplit"
    }
  },
  {
    title: 'Begin date',
    dataIndex: 'beginDate',
    width: '10%',
    key: 'beginDate'
  },
  {
    title: 'End date',
    dataIndex: 'endDate',
    width: '10%',
    key: 'endDate'
  },
  // {
  //   title: 'Operating state',
  //   dataIndex: 'Operatingstate',
  //   width: '15%',
  //   key: 'Operatingstate'
  // }
]

// export const ratePlanChilds = [
//   {
//     key: 1,
//     Account: 'account1',
//     Contract: 'contract1',
//     Rateplan: 'Account-contract-Service-direction-Cycle',
//     Product: 'Account-contract-Service-direction-Cycle-Rate plan1',
//     Begindate: '2019-03-05',
//     Enddate: '2019-06-05',
//     Operatingstate: 'D'
//   },
//   {
//     key: 2,
//     Account: 'account2',
//     Contract: 'contract2',
//     Rateplan: 'Account-contract-Service-direction-Cycle',
//     Product: 'Account-contract-Service-direction-Cycle-Rate plan2',
//     Begindate: '2019-03-05',
//     Enddate: '2019-06-05',
//     Operatingstate: 'D'
//   },
//   {
//     key: 3,
//     Account: 'account3',
//     Contract: 'contract3',
//     Rateplan: 'Account-contract-Service-direction-Cycle',
//     Product: 'Account-contract-Service-direction-Cycle-Rate plan3',
//     Begindate: '2019-03-05',
//     Enddate: '2019-06-05',
//     Operatingstate: 'D'
//   }
// ]

const RateStructure: string[] = ['Flat', 'Tier', 'Interval', 'RecurringCharge', 'OneTimeCharge', 'Penalty', 'Cap', 'Discount']
const Direction: string[] = ['Inbound', 'Outbound', 'Bilateral']
export const childColumnss = [
  {
    title: 'productName',
    dataIndex: 'productName',
    width: '30%',
    key: 'productName',
  },
  {
    title: 'Rate structure',
    dataIndex: 'rateStructure',
    width: '8%',
    key: 'rateStructure',
    customRender: (text: any, row: any, index: number) => {
      return {
        children: RateStructure[text - 1],
      };
    },
  },
  {
    title: 'Direction',
    dataIndex: 'direction',
    width: '8%',
    key: 'direction',
    customRender: (text: any, row: any, index: number) => {
      return {
        children: Direction[text - 1],
      };
    },
  },
  {
    title: 'Commitment status',
    dataIndex: 'isCommitment',
    width: '8%',
    key: 'isCommitment',
    customRender: (text: any, row: any, index: number) => {
      return {
        children: text == 1 ? 'Yes' : 'No',
      };
    },
  },

  {
    title: 'Rating zone',
    dataIndex: 'ratingZoneCount',
    width: '8%',
    key: 'ratingZoneCount'
  },
  {
    title: 'Product details',
    dataIndex: 'ProductDetails',
    width: '8%',
    key: 'ProductDetails',
    scopedSlots: { customRender: 'ProductDetails' }
  },
]

export const childData = [
  {
    Product: "Account-contract-Service1",
    rateStructure: 'Flat',
    Direction: 'Bilateral',
    EventType: 'Simple',
    CommitmentStatus: 'Yes',
    RatingZone: '1',
    ProductDetails: 'Details'
  },
  {
    Product: "Account-contract-Service2",
    rateStructure: 'Tire',
    Direction: 'Inbound',
    EventType: 'Simple',
    CommitmentStatus: 'Yes',
    RatingZone: '2',
    ProductDetails: 'Details'
  },
  {
    Product: "Account-contract-Service3",
    rateStructure: 'Interval',
    Direction: 'Inbound',
    EventType: 'Simple',
    CommitmentStatus: 'Yes',
    RatingZone: '3',
    ProductDetails: 'Details'
  },
  {
    Product: "Account-contract-Service4",
    rateStructure: 'Penalty',
    Direction: 'Outbound',
    EventType: 'Simple',
    CommitmentStatus: 'Yes',
    RatingZone: '4',
    ProductDetails: 'Details'
  },
]