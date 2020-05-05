





import moment from 'moment'

/**
 *
 *
 * @export
 * @param {string} beginDate 开始时间
 * @param {string} endDate 结束时间
 * @returns {(boolean|number)} 结束时间大于开始时间返回true
 */
export function compareDate(beginDate: string, endDate: string): boolean|number {
  if (beginDate !== '' && endDate !== ''){
    const startDate = new Date(beginDate).getTime()
    const finishDate = new Date(endDate).getTime()
    return startDate < finishDate
  } else {
    return 1
  }
}

export function getCommercialTrunk(data:any[]): any[] {
  let commercialTrunkList: any[] = []
  if(data.length === 0) {
    commercialTrunkList = []
  } else {
    data.forEach((item) => {
      commercialTrunkList.push({
        id: item.id,
        planPercentage: item.planPercentage,
        commercialTrunk: item.commercialTrunk
      })
    })
  }

  return commercialTrunkList
}

/**
 *data的item.status等于参数status时，返回true
 *
 * @export
 * @param {any[]} data
 * @param {string} [status='active']
 * @returns {boolean}
 */
export function isActive(data: any[], status: string[] = ['active']): boolean {
  let result: boolean = false
  data.forEach((item: any, index: number) => {
    if(status.includes(item['status'].toLowerCase())) {
      result = true
    }
  })

  return result
}



/**
 *格式化datae YYYY-MM-DD
 *
 * @export
 * @param {object} data
 * @returns {object}
 */
export function formatDate(data: object): object {
  let resultData = { ...data }

  for (const key in resultData) {
   if(key.includes('date') || key.includes('Date')) {
     if( resultData[key] !== '' &&  resultData[key] !== null) {
      resultData[key] = moment(resultData[key]).format('YYYY-MM-DD')
     } else {
      resultData[key] = ''
     }

   }
  }
  return resultData
}
export function dataCleaning(res: any, page: any){
  let pagination = { ...page }
  let data = []
  if(res.data['list']) {
    data = res.data['list']
  }else{
    data = []
  }
  pagination.total =res.data['total']
  return [data,pagination]

}
/**
 * 处理form表单options数据
 */
export function formOptionsUtil(formoptions: any[], data: any,flag: number = 0): any[] {
  let formOptions: any[] = [...formoptions ]
  formOptions.forEach((item: any, index: number) => {
    if (flag === 0) {
      for (const key in data) {
        if(key === item.decorator) {
          item.options = data[key]
        }
      }
    } else {
      for (const key in data) {
        if(key === item.decorator) {
          item.options = data[key]
        }
        if (key === 'status' && key === item.decorator) {
          data[key].forEach((innerItem) => {
            if (innerItem.name !== 'Retired') {
              item.initIalValue.push(innerItem.id)
            }
          })
        }
      }
    }

  })
  return formOptions
}

/**
 *
 *
 * @export
 * @param {any[]} options formoptions
 * @param {*} data 表格选中的数据
 * @param {object} [dataOptions={}]
 * @param {string} [status='Manually input']
 * @returns {any[]}
 */
export function initialValue(options: any[], data: any,dataOptions: object = {}, status: string='Manually input'): any[] {
  let formoptions: any[] = [ ...options]
  console.log(data)
  for (const key in data) {
    formoptions.forEach((item: any, index: number) => {
      if(key === item.decorator) {
        if(item.hasOwnProperty('options')){
          if(Object.keys(dataOptions).length !== 0){
            for(let idx in dataOptions) {
              if(idx === item.decorator) {
                item['options'] = dataOptions[idx]
                  dataOptions[idx].forEach((item1: any,index1: number) => {
                    if(item1['name'] === data[key]) {
                      item['initIalValue'] = item1['id']
                    }
                  })
              }
            }
          }
        }
        if(item.hasOwnProperty('initialValue') && !item.hasOwnProperty('options')) {
          item['initialValue'] = data[key]
        }
      }
      if(key === 'status' && key === item.decorator) {
        if(status === 'Manually input') {
          item.initialValue = 'Manually input'
        }
      }
    })
  }
  return formoptions
}

export function getId(selectedRows: any[]): string[] {
  let productIdList: string[] = []
  if (selectedRows) {
    selectedRows.forEach((item: any, index: number) => {
      productIdList.push(item.product)
    })
  }
  return productIdList
}

export function getUserDefinedOptions (options: IColumns[]): string[] {
  let userDefinedOptions: string[] = []
  options.forEach((item: any, index: number) => {
    if(item.title) {
      userDefinedOptions.push(item.title)
    }
  })
  return userDefinedOptions
}

export function setBtnDisabled(BtnList: IBtnList[], disable: boolean, ...type): IBtnList[] {
  let btnList:IBtnList[] = [...BtnList]
  let typeList: any = []
  if(type.length !== 0 && Object.prototype.toString.call(type[0]).slice(8,-1) === 'Array') {
    typeList = type[0]
  } else {
    typeList = type
  }
  btnList.forEach((item) => {
    for(let i = 0; i< typeList.length; i++) {
      if(item.eventType.toLowerCase() === typeList[i].toLowerCase()) {
        item.disabled = disable
      }
    }
  })
  return btnList
}

// 获取当前时间年月日 yyyy-mm-dd
export function getDate(): string {
  let date=new Date()
  let y = date.getFullYear()
  let m: number | string = date.getMonth() + 1
  m = m < 10 ? '0' + m : m
  let d: number | string = date.getDate()
  d = d < 10 ? ('0' + d) : d
  return `${y}-${m}-${d}`

}

export function agoDate(num:number, type: string = 'ago') :string {
    let curDate = new Date()
    let agoDate = type === 'ago' ? curDate.setDate(curDate.getDate()-num) : curDate.setDate(curDate.getDate()+num)
    let agoDates = new Date(agoDate)
    let y = agoDates.getFullYear()
    let m: number | string = agoDates.getMonth() + 1
    m = m < 10 ? '0' + m : m
    let d: number | string = agoDates.getDate()
    d = d < 10 ? ('0' + d) : d
    let dateAgo = `${y}-${m}-${d}`
    return dateAgo
}



export function technicalPass(data:any, params:any):any {
  for(let i=0;i<data.length;i++){
    if(data[i].hasOwnProperty('options')){
      for(let j=0;j<data[i].options.length;j++){
        if(data[i].decorator ==='routeClass'){
          if(data[i].options[j].name === params.routeClass){
            data[i].initIalValue = data[i].options[j].id
          }
        }
        if(data[i].decorator ==='product'){
          if(data[i].options[j].name === params.product){
            data[i].initIalValue = data[i].options[j].id
          }
        }
        if(data[i].decorator ==='switch'){
          if(data[i].options[j].name === params.switchName){
            data[i].initIalValue = data[i].options[j].id
          }
        }
        if(data[i].decorator ==='trafficOrigination'){
          if(data[i].options[j].name === params.trafficOrigination){
            data[i].initIalValue = data[i].options[j].id
          }
        }
        if(data[i].decorator ==='status'){
          if(data[i].options[j].name === params.status){
            data[i].initIalValue = []
          }
        }
      }
    }else{
      if(data[i].decorator ==='beginDate'){
        data[i].initialValue =params.beginDate
      }
      if(data[i].decorator ==='beginDateTo'){
        data[i].initialValue =params.endDate
      }
      if(data[i].decorator ==='transactionId'){
        data[i].initialValue =params.transactionId
      }
    }
  }
  return data
}

export interface IBtnList {
  type: string,
  name: string,
  icon: string,
  eventType: string,
  [prop: string]: any
}

export const btnList: IBtnList[] =[
  {
    type: 'default',
    icon: 'plus-circle',
    name: 'Add',
    eventType: 'add'

  },
  {
    type: 'default',
    icon: 'eye',
    name: 'View Commercial <br/> route guide detail',
    eventType: 'ViewDetail'
  },
  {
    type: 'default',
    icon: 'eye',
    name: 'View Technical <br/> routing order',
    eventType: 'ViewOrder'
  },
  {
    type: 'default',
    icon: 'download',
    name: 'Export',
    eventType:'export'
  }
]

//CommercialBtn
export const commercialBtn: IBtnList[] =[
  {
    type: 'default',
    icon: 'plus-circle',
    name: 'Add',
    eventType: 'add',
    disabled: false

  },
  {
    type: 'default',
    icon: 'form',
    name: 'Edit',
    eventType: 'edit',
    disabled: true
  },
  {
    type: 'default',
    icon: 'file-text',
    name: 'Details',
    eventType: 'details',
    disabled: true
  },
  {
    type: 'default',
    icon: 'check-circle',
    name: 'Approve',
    eventType:'approve',
    disabled: true
  },
  {
    type: 'default',
    icon: 'stop',
    name: 'Reject',
    eventType:'reject',
    disabled: true
  },
  {
    type: 'default',
    icon: 'check-circle', //待定
    name: 'Apply for commercial <br/> approve',
    eventType:'commercialApprove',
    disabled: true
  },
  {
    type: 'default',
    icon: 'eye',
    name: 'View commercial <br/> trunk connection',
    eventType:'viewCommercial',
    disabled: true
  },
  {
    type: 'default',
    icon: 'export',
    name: 'Export',
    eventType:'export'
  }
]

//track commercialBtn
export const trackCommercialBtn: IBtnList[] =[
  {
    type: 'default',
    icon: 'file-text',
    name: 'Details',
    eventType: 'details'
  },
  {
    type: 'default',
    icon: 'eye',
    name: 'View Technical <br/> routing order',
    eventType:'ViewTechnical'
  }
]


//Management of technical  Btn
export const technicalBtn: IBtnList[] =[
  {
    type: 'default',
    icon: 'form',
    name: 'Edit technical trunk <br/> connection',
    eventType: 'ViewEditTechnical'
  },
  {
    type: 'default',
    icon: 'form',
    name: 'View switch config.',
    eventType:'ViewEditSwitch'
  },
  {
    type: 'default',
    icon: 'check-square',
    name: 'Tech accept',
    eventType:'TechnicalAccept'
  }
  ,
  {
    type: 'default',
    icon: 'check-square',
    name: 'Tech reject',
    eventType:'TechnicalReject'
  }
]


//management of Inclusion  Btn
export const inclusionBtn: IBtnList[] =[
  {
    type: 'default',
    icon: 'plus-circle',
    name: 'Add',
    eventType: 'add'
  },
  {
    type: 'default',
    icon: 'form',
    name: 'Edit',
    eventType:'edit'
  },
  {
    type: 'default',
    icon: 'delete',
    name: 'Delete',
    eventType:'delete'
  },
  {
    type: 'default',
    icon: 'download',
    name: 'Export',
    eventType:'export'
  },
  {
    type: 'default',
    icon: 'upload',
    name: 'Upload',
    eventType:'upload'
  }
]
// routeProuct
export const routeProductBtn: IBtnList[] =[
  {
    type: 'default',
    icon: 'plus-circle',
    name: 'Add',
    eventType: 'add'
  },
  {
    type: 'default',
    icon: 'form',
    name: 'Edit',
    eventType:'edit',
    disabled: true
  },
  {
    type: 'default',
    icon: 'delete',
    name: 'Delete',
    eventType:'delete',
    disabled: true
  },
  {
    type: 'default',
    icon: 'export',
    name: 'Export',
    eventType:'export'
  },
  {
    type: 'default',
    icon: 'upload',
    name: 'Upload',
    eventType:'upload'
  }
]

//management of Exclusion  Btn
export const exclusionBtn: IBtnList[] =[
  {
    type: 'default',
    icon: 'plus-circle',
    name: 'Add',
    eventType: 'add'
  },
  {
    type: 'default',
    icon: 'form',
    name: 'Edit',
    eventType:'edit'
  },
  {
    type: 'default',
    icon: 'delete',
    name: 'Delete',
    eventType:'delete'
  },
  {
    type: 'default',
    icon: 'download',
    name: 'Export',
    eventType:'export'
  },
  {
    type: 'default',
    icon: 'upload',
    name: 'Upload',
    eventType:'upload'
  }

]

export const routeGuideDetialsBtn: IBtnList[] =[
  {
    type: 'default',
    icon: 'eye',
    name: 'View Technical Routing Order',
    eventType: 'ViewTechnicalRouting'
  }
]
//switchConfiguration
export const switchConfigurationBtn: IBtnList[] =[
  {
    type: 'default',
    icon: 'edit',
    name: 'Edit technical trunk</br>connection',
    eventType: 'editTechnical'
  },
  {
    type: 'default',
    icon: 'sync',
    name: 'Refresh',
    eventType: 'refresh'
  }
]

//techniacalTrunk
export const techniacalTrunkBtn: IBtnList[] =[
  {
    type: 'default',
    icon: 'file-done',
    name: 'Submit change',
    eventType: 'submitChange'
  },
  {
    type: 'default',
    icon: 'export',
    name: 'Exit without change',
    eventType: 'exitWithout'
  },
  {
    type: 'default',
    icon: 'sync',
    name: 'Refresh',
    eventType: 'refresh'
  }
]


// 生成All及A-Z
function generateBigLetter(): string[] {
  const ch_big = 'A'
  let str_big = ''
  let letterList: string[] = []
  for(var i=0;i<26;i++){
      str_big += String.fromCharCode(ch_big.charCodeAt(0)+i);
  }
  letterList = str_big.split('')
  letterList.splice(0,0,'All')
  return letterList
}

export const alphabet: string[] =  generateBigLetter()

export interface IColumns {
  title: string,
  dataIndex?: string,
  [prop: string]: any

}

export const columns: IColumns[] = [
  {
    title: 'Product',
    dataIndex:'product',
    sorter: true,
    width: 120
  },
  {
    title: 'Route class',
    dataIndex: 'routeClass',
    width: 120
  },
  {
    title: 'Begin date',
    dataIndex: 'beginDate',
    sorter: true,
    width: 180
  },
  {
    title: 'End date',
    dataIndex: 'endDate',
    width: 180
  },
  {
    title: 'Status',
    dataIndex: 'status',
    width: 180
  },
  {
    title: 'MOU(1000 minutes)',
    dataIndex: 'mou',
    width: 120
  },
  {
    title: 'ASR',
    dataIndex: 'asr',
    width: 120
  },
  {
    title: 'Margin',
    dataIndex: 'margin',
    width: 120
  },
  {
    title: 'Current cost',
    dataIndex: 'currentCost',
    width: 140
  },
  {
    title: 'Plan Cost',
    dataIndex: 'planCost'
  },
  {
    title: 'Floor reference price',
    dataIndex: 'floorReferencePrice'
  },
  {
    title: 'Floor sell price',
    dataIndex: 'floorSellPrice'
  },
  {
    title: 'Inclusion',
    dataIndex: 'inclusion'
  },
  {
    title: 'Exclusion',
    dataIndex: 'exclusion'
  },
  {
    title: 'Route1',
    dataIndex: 'route1',
    scopedSlots: { customRender: 'route1' }

  },
  {
    title: 'Route2',
    dataIndex: 'route2',
    scopedSlots: { customRender: 'route2' }
  },
  {
    title: 'Route3',
    dataIndex: 'route3',
    scopedSlots: { customRender: 'route3' }
  },
  {
    title: 'Route4',
    dataIndex: 'route4',
    scopedSlots: { customRender: 'route4' }
  },
  {
    title: 'Route5',
    dataIndex: 'route5',
    scopedSlots: { customRender: 'route5' }
  },
  {
    title: 'Route6',
    dataIndex: 'route6',
    scopedSlots: { customRender: 'route6' }
  },
  {
    title: 'Route7',
    dataIndex: 'route7',
    scopedSlots: { customRender: 'route7' }
  },
  {
    title: 'Route8',
    dataIndex: 'route8',
    scopedSlots: { customRender: 'route8' }
  },
  {
    title: 'Route9',
    dataIndex: 'route9',
    scopedSlots: { customRender: 'route9' }
  },
  {
    title: 'Route10',
    dataIndex: 'route10',
    scopedSlots: { customRender: 'route10' }
  },
  {
    title: 'Last update',
    dataIndex: 'lastUpdate'
  },
  {
    title: 'Staff',
    dataIndex: 'staff'
  }

]


//commercial  columns
export const commercialColumns: IColumns[] = [
  {
    title: 'Product',
    dataIndex:'product',
    width: 120
  },
  {
    title: 'Route class',
    dataIndex: 'routeClass'
  },
  {
    title: 'Status',
    sorter: true,
    dataIndex: 'status'
  },
  {
    title: 'Inclusion',
    dataIndex: 'inclusion'
  },
  {
    title: 'Exclusion',
    dataIndex: 'exclusion',
  },
  {
    title: 'Route1',
    dataIndex: 'route1',
    scopedSlots: {customRender: 'route1'}
  },
  {
    title: 'Route2',
    dataIndex: 'route2',
    scopedSlots: {customRender: 'route2'}
  },
  {
    title: 'route3',
    dataIndex: 'route3',
    scopedSlots: {customRender: 'route3'}
  },
  {
    title: 'Current cost',
    dataIndex: 'currentCost'
  },
  {
    title: 'Plan Cost',
    dataIndex: 'planCost'
  },
  {
    title: 'Actual cost',
    dataIndex: 'actualCost'
  },
  {
    title: 'Floor reference price',
    dataIndex: 'floorReferencePrice'
  },
  {
    title: 'Floor sell price',
    dataIndex: 'floorSellPrice'
  },
  {
    title: 'Begin date',
    dataIndex: 'beginDate'
  },
  {
    title: 'End date',
    dataIndex: 'endDate'
  },
  {
    title: 'Country',
    dataIndex: 'country'
  },
  {
    title: 'Service',
    dataIndex: 'service'
  },
  {
    title: 'Remark',
    dataIndex: 'remark'
  },
  {
    title: 'Last update',
    dataIndex: 'lastUpdate'
  },
  {
    title: 'staff',
    dataIndex:'staff'
  }
]

//trackCommercialColumns
export const trackColumns: IColumns[] = [
  {
    title: 'Transaction ID',
    dataIndex:'transactionId',
    width: 120
  },
  {
    title: 'Product',
    dataIndex:'product',
    sorter: true,
    width: 120
  },
  {
    title: 'Route class',
    dataIndex: 'routeClass',
    sorter: true
  },
  {
    title: 'Status',
    dataIndex: 'status'
  },
  {
    title: 'Route1',
    dataIndex: 'route1',
    scopedSlots: { customRender: 'route1' }
  },
  {
    title: 'Route2',
    dataIndex: 'route2',
    scopedSlots: { customRender: 'route2' }
  },
  {
    title: 'Route3',
    dataIndex: 'route3',
    scopedSlots: { customRender: 'route3' }
  },
  {
    title: 'Route4',
    dataIndex: 'route4',
    scopedSlots: { customRender: 'route4' }
  },
  {
    title: 'Route5',
    dataIndex: 'route5',
    scopedSlots: { customRender: 'route5' }
  },
  {
    title: 'Route6',
    dataIndex: 'route6',
    scopedSlots: { customRender: 'route6' }
  },
  {
    title: 'Route7',
    dataIndex: 'route7',
    scopedSlots: { customRender: 'route7' }
  },
  {
    title: 'Route8',
    dataIndex: 'route8',
    scopedSlots: { customRender: 'route8' }
  },
  {
    title: 'Route9',
    dataIndex: 'route9',
    scopedSlots: { customRender: 'route9' }
  },
  {
    title: 'Route10',
    dataIndex: 'route10',
    scopedSlots: { customRender: 'route10' }
  },
  {
    title: 'Begin Date',
    dataIndex: 'beginDate',
    sorter: true
  },
  {
    title: 'End Date',
    dataIndex: 'endDate'
  },
  {
    title: 'Service',
    dataIndex: 'service'
  },
  {
    title: 'Country',
    dataIndex: 'country'
  },
  {
    title: 'Remark',
    dataIndex: 'remark'
  },
  {
    title: 'Last update',
    dataIndex: 'lastUpdate'
  },
  {
    title: 'Staff',
    dataIndex: 'staff'
  }

]

//managemnet`TechnicalColumns`
export const technicalColumns: IColumns[] = [
  {
    title: 'Transaction ID',
    dataIndex:'transactionId',
    width: 120
  },
  {
    title: 'Product',
    dataIndex:'product',
    sorter: true,
    width: 120
  },
  {
    title: 'Route class',
    dataIndex: 'routeClass',
    sorter: true
  },
  {
    title: 'Status',
    dataIndex: 'status',
    sorter: true
  },
  {
    title: 'Route1',
    dataIndex: 'route1',
    scopedSlots: { customRender: 'route1' }
  },
  {
    title: 'Route2',
    dataIndex: 'route2',
    scopedSlots: { customRender: 'route2' }
  },
  {
    title: 'Route3',
    dataIndex: 'route3',
    scopedSlots: { customRender: 'route3' }
  },
  {
    title: 'Route4',
    dataIndex: 'route4',
    scopedSlots: { customRender: 'route4' }
  },
  {
    title: 'Route5',
    dataIndex: 'route5',
    scopedSlots: { customRender: 'route5' }
  },
  {
    title: 'Route6',
    dataIndex: 'route6',
    scopedSlots: { customRender: 'route6' }
  },
  {
    title: 'Route7',
    dataIndex: 'route7',
    scopedSlots: { customRender: 'route7' }
  },
  {
    title: 'Route8',
    dataIndex: 'route8',
    scopedSlots: { customRender: 'route8' }
  },
  {
    title: 'Route9',
    dataIndex: 'route9',
    scopedSlots: { customRender: 'route9' }
  },
  {
    title: 'Route10',
    dataIndex: 'route10',
    scopedSlots: { customRender: 'route10' }
  },
  {
    title: 'Begin Date',
    dataIndex: 'beginDate',
    sorter: true
  },
  {
    title: 'End Date',
    dataIndex: 'endDate'
  },
  {
    title: 'Last update',
    dataIndex: 'lastUpdate'
  },
  {
    title: 'Staff',
    dataIndex: 'staff'
  }

]

//manageInclusionColumns
export const inclusionColumns: IColumns[] = [
  {
    title: 'Route class',
    dataIndex: 'routeClass'
  },
  {
    title: 'Product',
    dataIndex:'product'
  },
  {
    title: 'Commercial Trunk',
    dataIndex: 'commercialTrunk'
  },
  {
    title: 'Account',
    dataIndex: 'account'
  },
  {
    title: 'Status',
    dataIndex: 'status'
  },
  {
    title: 'Begin date',
    dataIndex: 'beginDate'
  },
  {
    title: 'End Date',
    dataIndex: 'endDate'
  },
  {
    title: 'Remark',
    dataIndex: 'remark',
    scopedSlots: { customRender: 'remark' }
  },
  {
    title: 'Last update',
    dataIndex: 'lastUpdate'
  },
  {
    title: 'Staff',
    dataIndex: 'staff'
  }
]

//management of Exclusion Columns
export const exclusionColumns: IColumns[] = [
  {
    title: 'Route class',
    dataIndex: 'routeClass'
  },
  {
    title: 'Product',
    dataIndex:'product'
  },
  {
    title: 'Commercial Trunk',
    dataIndex: 'commercialTrunk'
  },
  {
    title: 'Account',
    dataIndex: 'account'
  },
  {
    title: 'Status',
    dataIndex: 'status'
  },
  {
    title: 'Begin date',
    dataIndex: 'beginDate'
  },
  {
    title: 'End Date',
    dataIndex: 'endDate'
  },
  {
    title: 'Remark',
    dataIndex: 'remark'
  },
  {
    title: 'Last update',
    dataIndex: 'lastUpdate'
  },
  {
    title: 'Staff',
    dataIndex: 'staff'
  }
]

//Route Class Benchmark Columns
export const routeClassColumns: IColumns[] = [
  {
    title: 'Route class',
    dataIndex: 'routeClass',
    sorter: true
  },
  {
    title: 'Status',
    dataIndex:'status'
  },
  {
    title: 'Begin date',
    dataIndex: 'beginDate',
    sorter: true
  },
  {
    title: 'End Date',
    dataIndex: 'endDate'
  },
  {
    title: 'Margin-minimum',
    dataIndex: 'marginMinimum'
  },
  {
    title: 'ASR-minimum',
    dataIndex: 'asrMinimum',
    scopedSlots: { customRender: 'asrMinimum' }
  },
  {
    title: 'Impact-minimum(x1000)',
    dataIndex: 'impactMinimum'
  },
  {
    title: 'Impact-maximum(x1000)',
    dataIndex: 'impactMaximum'
  },
  {
    title: 'Maximum Commercial trunks',
    dataIndex: 'maximumCommercialTrunks'
  },
  {
    title: 'Maximum Technical trunks',
    dataIndex: 'maximumTechnicalTrunks'
  },
  {
    title: 'Maximum Internal trunks',
    dataIndex: 'maximumInternalTrunks'
  },
  {
    title: 'Minimum MOS',
    dataIndex: 'minimumMos'
  },
  {
    title: 'Remark',
    dataIndex: 'remark'
  },
  {
    title: 'Last update',
    dataIndex: 'lastUpdate'
  },
  {
    title: 'staff',
    dataIndex: 'staff'
  }
]

//route Product columns
export const routeProductColumns: IColumns[] = [
  {
    title: 'Route class',
    dataIndex: 'routeClass',
    sorter: true
  },
  {
    title: 'Product',
    dataIndex: 'product'

  },
  {
    title: 'Status',
    dataIndex:'status'
  },
  {
    title: 'Begin date',
    dataIndex: 'beginDate',
    sorter: true
  },
  {
    title: 'End Date',
    dataIndex: 'endDate'
  },
  {
    title: 'Margin-minimum',
    dataIndex: 'marginMinimum'
  },
  {
    title: 'ASR-minimum',
    dataIndex: 'asrMinimum',
    scopedSlots: { customRender: 'asrMinimum' }
  },
  {
    title: 'Impact-minimum(x1000)',
    dataIndex: 'impactMinimum'
  },
  {
    title: 'Impact-maximum(x1000)',
    dataIndex: 'impactMaximum'
  },
  {
    title: 'Maximum Commercial trunks',
    dataIndex: 'maximumCommercialTrunks'
  },
  {
    title: 'Maximum Technical trunks',
    dataIndex: 'maximumTechnicalTrunks'
  },
  {
    title: 'Maximum Internal trunks',
    dataIndex: 'maximumInternalTrunks'
  },
  {
    title: 'Minimum MOS',
    dataIndex: 'minimumMos'
  },
  {
    title: 'Remark',
    dataIndex: 'remark'
  },
  {
    title: 'Last update',
    dataIndex: 'lastUpdate'
  },
  {
    title: 'staff',
    dataIndex: 'staff'
  }
]

//edit commercial routeColumns
export const editRouteColumns: IColumns[] = [
  {
    title: 'Commercial Trunk',
    dataIndex:'commercialTrunk',
    width: 120
  },
  {
    title: 'Account',
    dataIndex: 'account',
  },
  {
    title: 'Rate',
    dataIndex: 'rate',
    sorter: true,
  },
  {
    title: 'Margin',
    dataIndex: 'margin'
  },
  {
    title: 'Plan percentage',
    width: 200,
    dataIndex: 'planPercentage',

    scopedSlots: { customRender: 'planPercentage' }
  },
  {
    title: 'Current percentage',
    dataIndex: 'currentPercentage'
  },
  {
    title: 'Percentage in operation',
    dataIndex: 'percentageInOperation'
  },
  {
    title: 'MOU(1000 minutes)',
    dataIndex: 'mou'
  },
  {
    title: 'Number of calls(x1000)',
    dataIndex: 'numberOfCalls'
  },
  {
    title: 'ASR',
    dataIndex: 'asr'
  },
  {
    title: 'CLI',
    dataIndex: 'cli'
  },
  {
    title: 'NER',
    dataIndex: 'ner'
  },
  {
    title: 'MOS',
    dataIndex: 'mos'
  },
  {
    title: 'Begin Date',
    dataIndex: 'beginDate',
    sorter: true
  },
  {
    title: 'End Date',
    dataIndex: 'endDate'
  }
]


//commercialTrunkCol
export const commercialTrunkCol: IColumns[] = [
  {
    title: 'Commercial Trunk',
    dataIndex:'commercialTrunk',
    width: 120
  },
  {
    title: 'Account',
    dataIndex:'account',
    width: 120
  },
  {
    title: 'Rate',
    dataIndex: 'rate',
    sorter: true
  },
  {
    title: 'Margin',
    dataIndex: 'margin'
  },
  {
    title: 'Plan Percentage',
    dataIndex: 'planPercentage'
  },
  {
    title: 'Current percentage',
    dataIndex: 'currentPercentage'
  },
  {
    title: 'Percentage in operation',
    dataIndex: 'percentageInOperation'
  },
  {
    title: 'MOU',
    dataIndex: 'mou'
  },
  {
    title: 'Number of calls',
    dataIndex: 'numberOfCalls'
  },
  {
    title: 'ASR',
    dataIndex: 'asr'
  },
  {
    title: 'CLI',
    dataIndex: 'cli'
  },
  {
    title: 'NER',
    dataIndex: 'ner'
  },
  {
    title: 'MOS',
    dataIndex: 'mos'
  },
  {
    title: 'Begin Date',
    dataIndex: 'beginDate'
  },
  {
    title: 'End Date',
    dataIndex: 'endDate'
  }

]

//technicalTrunkCol
export const technicalTrunkCol: IColumns[] = [
  {
    title: 'Plan Rank',
    dataIndex:'planRank',
    width: 160,
    scopedSlots: { customRender: 'planRank' }
  },
  {
    title: 'Implemented Rank',
    dataIndex: 'implementedRank',
  },
  {
    title: 'Technical Trunk',
    dataIndex: 'technicalTrunk',
  },
  {
    title: 'Commercial Trunk',
    dataIndex: 'commercialTrunk'
  },
  {
    title: 'Account',
    dataIndex: 'account'
  },
  {
    title: 'Rate',
    dataIndex: 'rate',
    sorter: true
  },
  {
    title: 'Plan Percentage',
    dataIndex: 'planPercentage',
    width: 160,
    scopedSlots: { customRender: 'planPercentage' }
  },
  {
    title: 'Current percentage',
    dataIndex: 'currentPercentage',
  },
  {
    title: 'Percentage in operation',
    dataIndex: 'percentageInOperation'
  },
  {
    title: 'MOU(1000 minutes)',
    dataIndex: 'mou',
    scopedSlots: { customRender: 'mou' }
  },{
    title: 'Number of calls(x1000)',
    dataIndex: 'numberOfCalls',
    scopedSlots: { customRender: 'numberOfCalls' }
  },
  {
    title: 'ASR',
    dataIndex: 'asr'
  },
  {
    title: 'CLI',
    dataIndex: 'cli'
  },
  {
    title: 'NER',
    dataIndex: 'ner'
  },
  {
    title: 'MOS',
    dataIndex: 'mos'
  },
  {
    title: 'Begin Date',
    dataIndex: 'beginDate',
    sorter: true
  },
  {
    title: 'End Date',
    dataIndex: 'endDate'
  }
]

//routeGuideDetailsCol
export const routeGuideDetailsCol: IColumns[] = [
  {
    title: 'Status',
    dataIndex:'status',
    width: 200
  },
  {
    title: 'Begin date',
    dataIndex:'beginDate',
    width: 140
  },
  {
    title: 'Route1',
    dataIndex: 'route1',
    width: 200
  },
  {
    title: 'Route2',
    dataIndex: 'route2',
    width: 200
  },
  {
    title: 'Route3',
    dataIndex: 'route3',
    width: 200
  },
  {
    title: 'Route4',
    dataIndex: 'route4',
    width: 200
  },
  {
    title: 'Route5',
    dataIndex: 'route5',
    width: 200
  },
  {
    title: 'Route6',
    dataIndex: 'route6',
    width: 200
  },
  {
    title: 'Route7',
    dataIndex: 'route7',
    width: 200
  },
  {
    title: 'Route8',
    dataIndex: 'route8',
    width: 200
  },
  {
    title: 'Route9',
    dataIndex: 'route9',
    width: 200
  },
  {
    title: 'Route10',
    dataIndex: 'route10',
    width: 200
  }

]

//switchConfigurationCol
export const switchConfigurationCol: IColumns[] = [
  {
    title: 'Switch',
    dataIndex:'switchName',
    width: 150
  },
  {
    title: 'Traffic origination',
    dataIndex:'trafficOrigination',
    width: 150
  },
  {
    title: 'Status',
    dataIndex: 'status',
    width: 200
  },
  {
    title: 'Route1',
    dataIndex: 'routeOne',
    width: 184
  },
  {
    title: 'Route2',
    dataIndex: 'routeTwo',
    width: 184
  },
  {
    title: 'Route3',
    dataIndex: 'routeThree',
    width: 184
  },
  {
    title: 'Route4',
    dataIndex: 'routeFour',
    width: 184
  },
  {
    title: 'Route5',
    dataIndex: 'routeFive',
    width: 184
  },
  {
    title: 'Route6',
    dataIndex: 'routeSix',
    width: 184
  },
  {
    title: 'Route7',
    dataIndex: 'routeSeven',
    width: 184
  },
  {
    title: 'Route8',
    dataIndex: 'routeEight',
    width: 184
  },
  {
    title: 'Route9',
    dataIndex: 'routeNine',
    width: 184
  },
  {
    title: 'Route10',
    dataIndex: 'routeTen',
    width: 184
  }

]

//switchConfigurationCol
export const nestedTableCol: IColumns[] = [
  {
    title: '',
    dataIndex: 'routeName',
    width:344,
    scopedSlots: { customRender: 'routeName' }
  },
  {
    title: '',
    dataIndex: 'route1',
    width:201.7
  },
  {
    title: '',
    dataIndex: 'route2',
    width:201
  },
  {
    title: '',
    dataIndex: 'route3',
    width:200
  },
  {
    title: '',
    dataIndex: 'route4',
    width:200
  },
  {
    title: '',
    dataIndex: 'route5',
    width:200
  },
  {
    title: '',
    dataIndex: 'route6',
    width:200
  },
  {
    title: '',
    dataIndex: 'route7',
    width:200
  },
  {
    title: '',
    dataIndex: 'route8',
    width:200
  },
  {
    title: '',
    dataIndex: 'route9',
    width:200
  },
  {
    title: '',
    dataIndex: 'route10',
    width:200
  }

]
;
//switchConfigurationCol
export const nestedTableColInput: IColumns[] = [
  {
    title: '',
    dataIndex: 'routeName',
    width:550,
    scopedSlots: { customRender: 'routeName' }
  },
  {
    title: '',
    dataIndex: 'route1',
    width:180
  },
  {
    title: '',
    dataIndex: 'route2',
    width:180
  },
  {
    title: '',
    dataIndex: 'route3',
    width:180
  },
  {
    title: '',
    dataIndex: 'route4',
    width:180
  },
  {
    title: '',
    dataIndex: 'route5',
    width:185
  },
  {
    title: '',
    dataIndex: 'route6',
    width:180
  },
  {
    title: '',
    dataIndex: 'route7',
    width:180
  },
  {
    title: '',
    dataIndex: 'route8',
    width:180
  },
  {
    title: '',
    dataIndex: 'route9',
    width:180
  },
  {
    title: '',
    dataIndex: 'route10',
    width:180
  }

];
//technicalTrunkData
export let technicalTrunkData = [
  {
    key:1,
    planRank: 'product1',
    implementedRank: 'Routeclass',
    technicalTrunk: '1',
    commercialTrunk: 'route1',
    account:'route2',
    rate: 'route3',
    planPercentage: 'route4',
    percentageInOperation: 'route5',
    mou: 'route6',
    numberOfCalls: 'route7',
    asr: 'route8',
    ner: 'route9',
    mos: 'route10',
    beginDate: '2022-22-11',
    endDate: '2022-22-11'
  }
]

export interface IFormoptions {
  required: boolean,
  type: string,
  Tips: string,
  decorator: string,
  options?: any[],
  [prop: string]: any
}

export const searchOptions: IFormoptions[] = [
  {
    Tips: 'Product',
    decorator: 'product',
    required: false,
    type: 'radioSelect',
    span: '10',
    colOffset:'1',
    wrapperSpan: 18,
    labelSpan:6,
    initIalValue:'',
    options:[]
  },
  {
    Tips: 'Service',
    decorator: 'service',
    required: false,
    type: 'select',
    span: '10',
    colOffset: '2',
    wrapperSpan: 18,
    labelSpan: 6,
    initIalValue:'',
    options:[]
  },
  {
    Tips: 'Country',
    decorator: 'country',
    required: false,
    type: 'radioSelect',
    span: '22',
    colOffset: '1',
    wrapperSpan: 10,
    labelSpan: 2,
    filterType: true,
    initIalValue:'',
    options:[]
  },
  {
    Tips: 'Currency',
    decorator: 'currency',
    required: true,
    type: 'select',
    span: '10',
    colOffset:'1',
    wrapperSpan: 18,
    labelSpan:6,
    initIalValue: 31,
    filterType: true,
    options:[]
  },
  {
    Tips: 'Traffic date',
    decorator: 'trafficDate',
    required: true,
    type: 'picker-range',
    disabled: false,
    span: '10',
    colOffset: '2',
    wrapperSpan: 18,
    labelSpan: 6,
    initialValue:[agoDate(7),getDate()]
  }
  // },{
  //   Tips: 'To',
  //   decorator: 'trafficDateTo',
  //   required: true,
  //   type: 'picker',
  //   disabled: false,
  //   span: '5',
  //   offset:0,
  //   wrapperSpan: 15,
  //   labelSpan:4,
  //   initialValue:getDate()

  // }
]

//commmercial addFROM
export const overviewAddForm: IFormoptions[] =[
  {
    Tips: 'Route class',
    decorator: 'routeClass',
    required: true,
    type: 'select',
    span: '10',
    colOffset:'1',
    wrapperSpan: 18,
    labelSpan:6,
    initIalValue:'',
    options:[]
  },
  {
    Tips: 'Product',
    decorator: 'product',
    required: true,
    type: 'select',
    span: '10',
    colOffset: '2',
    wrapperSpan: 18,
    labelSpan: 6,
    initIalValue:'',
    options:[]
  },
  {
    Tips: 'Status',
    decorator: 'status',
    required: true,
    type: 'input',
    span: '22',
    colOffset: '1',
    wrapperSpan: 11,
    labelSpan: 2,
    disabled: true,
    initialValue:'manually input'
  },
  {
    Tips: 'Begin date',
    decorator: 'beginDate',
    required: true,
    type: 'picker',
    disabled: false,
    span: '10',
    colOffset: '1',
    wrapperSpan: 18,
    labelSpan:6,
    initialValue:getDate()
  },
  {
    Tips: 'End date',
    decorator: 'endDate',
    required: true,
    type: 'picker',
    disabled: false,
    span: '10',
    colOffset: '2',
    wrapperSpan: 18,
    labelSpan:6,
    initialValue:'2099-12-31'

  },
  {
    Tips: 'Remark',
    decorator: 'remark',
    required: false,
    type: 'textarea',
    disabled: false,
    span: '22',
    colOffset: '1',
    wrapperSpan: 22,
    labelSpan:2,
    initialValue:''
    // wrapperOffset: 1

  }


]

//edit commercial route form
export const editRouteOptions: IFormoptions[] = [
  {
    Tips: 'Commercial trunk',
    decorator: 'commercialTrunk',
    required: false,
    type: 'radioSelect',
    span: '6',
    colOffset:'1',
    wrapperSpan: 14,
    labelSpan:10,
    options:[]
  },
  {
    Tips: 'Rate',
    decorator: 'rate',
    required: false,
    type: 'input',
    span: '4',
    colOffset: '1',
    wrapperSpan: 15,
    labelSpan: 6
  },
  {
    Tips: 'To',
    decorator: 'rateTo',
    required: false,
    type: 'input',
    span: '4',
    wrapperSpan: 15,
    labelSpan: 6
  },
  {
    Tips: 'ASR>',
    decorator: 'asr',
    required: false,
    type: 'input',
    span: '6',
    colOffset:'1',
    wrapperSpan: 15,
    labelSpan:10
  },
  {
    Tips: 'CLI',
    decorator: 'cli',
    required: false,
    type: 'select',
    disabled: false,
    colOffset:'1',
    span: '6',
    wrapperSpan: 14,
    labelSpan:10,
    options:[
      {
        id:2,
        name:'YES'
      },{
        id:3,
        name:'NO'
      }
    ]

  }
]


//commmercial addFROM
export const commercoalAddForm: IFormoptions[] =[
  {
    Tips: 'Route class',
    decorator: 'routeClass',
    required: true,
    type: 'radioSelect',
    span: '10',
    colOffset:'1',
    wrapperSpan: 18,
    labelSpan:6,
    initIalValue: '',
    options:[]
  },
  {
    Tips: 'Product',
    decorator: 'product',
    required: true,
    type: 'radioSelect',
    span: '10',
    colOffset: '2',
    wrapperSpan: 18,
    labelSpan: 6,
    initIalValue: '',
    options:[

    ]
  },
  {
    Tips: 'Status',
    decorator: 'status',
    required: true,
    type: 'input',
    span: '22',
    colOffset: '1',
    wrapperSpan: 11,
    labelSpan: 2,
    disabled: true,
    initialValue: 'manually input'
  },
  {
    Tips: 'Begin date',
    decorator: 'beginDate',
    required: true,
    type: 'picker',
    disabled: false,
    span: '10',
    colOffset: '1',
    initialValue: getDate(),
    wrapperSpan: 18,
    labelSpan:6


  },
  {
    Tips: 'End date',
    decorator: 'endDate',
    required: true,
    type: 'picker',
    disabled: false,
    span: '10',
    colOffset: '2',
    wrapperSpan: 18,
    initialValue: '2099-12-31',
    labelSpan:6,

  },
  {
    Tips: 'Remark',
    decorator: 'remark',
    required: false,
    type: 'textarea',
    disabled: false,
    span: '22',
    colOffset: '1',
    wrapperSpan: 22,
    labelSpan:2,
    initialValue: ''
    // wrapperOffset: 1

  }


]

export const commercoalAddFormClean: IFormoptions[] =[
  {
    Tips: 'Route class',
    decorator: 'routeClass',
    required: true,
    type: 'radioSelect',
    span: '10',
    colOffset:'1',
    wrapperSpan: 18,
    labelSpan:6,
    initIalValue: '',
    options:[]
  },
  {
    Tips: 'Product',
    decorator: 'product',
    required: true,
    type: 'radioSelect',
    span: '10',
    colOffset: '2',
    wrapperSpan: 18,
    labelSpan: 6,
    initIalValue: '',
    options:[

    ]
  },
  {
    Tips: 'Status',
    decorator: 'status',
    required: true,
    type: 'input',
    span: '22',
    colOffset: '1',
    wrapperSpan: 11,
    labelSpan: 2,
    disabled: true,
    initialValue: 'manually input'
  },
  {
    Tips: 'Begin date',
    decorator: 'beginDate',
    required: true,
    type: 'picker',
    disabled: false,
    span: '10',
    colOffset: '1',
    initialValue: getDate(),
    wrapperSpan: 18,
    labelSpan:6


  },
  {
    Tips: 'End date',
    decorator: 'endDate',
    required: true,
    type: 'picker',
    disabled: false,
    span: '10',
    colOffset: '2',
    wrapperSpan: 18,
    initialValue: '2099-12-31',
    labelSpan:6,

  },
  {
    Tips: 'Remark',
    decorator: 'remark',
    required: false,
    type: 'textarea',
    disabled: false,
    span: '22',
    colOffset: '1',
    wrapperSpan: 22,
    labelSpan:2,
    initialValue: ''
    // wrapperOffset: 1

  }


]


//commmercial editFROM
export const commercoalEditForm: IFormoptions[] =[
  {
    Tips: 'Route class',
    decorator: 'routeClass',
    required: true,
    type: 'select',
    span: '10',
    colOffset:'1',
    wrapperSpan: 18,
    labelSpan:6,
    disabled:true,
    initIalValue: '',
    options:[

    ]
  },
  {
    Tips: 'Product',
    decorator: 'product',
    required: true,
    type: 'select',
    span: '10',
    colOffset: '2',
    wrapperSpan: 18,
    labelSpan: 6,
    initIalValue:'',
    disabled: true,
    options:[

    ]
  },
  {
    Tips: 'Status',
    decorator: 'status',
    required: true,
    type: 'input',
    span: '22',
    colOffset: '1',
    wrapperSpan: 11,
    labelSpan: 2,
    disabled: true,
    initialValue: 'manually input'

  },
  {
    Tips: 'Begin date',
    decorator: 'beginDate',
    required: true,
    type: 'picker',
    disabled: false,
    span: '10',
    colOffset: '1',
    wrapperSpan: 18,
    labelSpan:6,
    initialValue: ''


  },
  {
    Tips: 'End date',
    decorator: 'endDate',
    required: true,
    type: 'picker',
    disabled: false,
    span: '10',
    colOffset: '2',
    wrapperSpan: 18,
    labelSpan:6,
    initialValue: ''

  },
  {
    Tips: 'Remark',
    decorator: 'remark',
    required: false,
    type: 'textarea',
    disabled: false,
    span: '22',
    colOffset: '1',
    wrapperSpan: 22,
    labelSpan:2,
    initialValue: ''
    // wrapperOffset: 1

  }


]

//commercial from
export const commercialFrom: IFormoptions[] =[
  {
    Tips: 'Route class',
    decorator: 'routeClass',
    required: false,
    type: 'radioSelect',
    span: '10',
    colOffset:'1',
    wrapperSpan: 18,
    labelSpan:6,
    filterType: true,

    initIalValue:'',

    options:[]
  },
  {
    Tips: 'Product',
    decorator: 'product',
    required: false,
    type: 'radioSelect',
    span: '10',
    colOffset: '2',
    wrapperSpan: 18,
    labelSpan: 6,
    initIalValue:'',
    options:[]
  },
  {
    Tips: 'Service',
    decorator: 'service',
    required: false,
    type: 'radioSelect',
    span: '10',
    colOffset: '1',
    wrapperSpan: 18,
    labelSpan: 6,
    initIalValue: '',
    // wrapperOffset: 1,
    options:[]
  },
  {
    Tips: 'Country',
    decorator: 'country',
    required: false,
    type: 'radioSelect',
    span: '10',
    colOffset: '2',
    wrapperSpan: 18,
    labelSpan: 6,
    filterType: true,
    initIalValue:'',
    options:[]
  },
  {
    Tips: 'Actual cost-plan cost',
    decorator: 'actualCost',
    required: false,
    type: 'input',
    disabled: false,
    span: '6',
    colOffset: '1',
    wrapperSpan: 11,
    initialValue: '',
    labelSpan:13

  },
  {
    Tips: 'To',
    decorator: 'actualCostTo',
    required: false,
    type: 'input',
    disabled: false,
    span: '4',
    offset:1,
    wrapperSpan: 18,
    initialValue: '',
    labelSpan:5,

  },
  {
    Tips: 'Current cost-plan cost',
    decorator: 'currentCost',
    required: false,
    type: 'input',
    disabled: false,
    span: '6',
    colOffset: '2',
    wrapperSpan: 10,
    initialValue: '',
    labelSpan:14

  },{
    Tips: 'To',
    decorator: 'currentCostTo',
    required: false,
    type: 'input',
    disabled: false,
    span: '4',
    offset:1,
    wrapperSpan: 18,
    initialValue: '',
    labelSpan:5,

  },
  {
    Tips: 'Status',
    decorator: 'status',
    required: true,
    type: 'tags',
    span: '10',
    colOffset: '1',
    wrapperSpan: 18,
    labelSpan: 6,
    // wrapperOffset: 1,
    initIalValue:[1,2,3,4],
    options:[]
  }
  ,

  {
    Tips: 'Begin date',
    decorator: 'beginDate',
    required: false,
    type: 'picker-range',
    disabled: false,
    colOffset:2,
    span: '10',
    wrapperSpan: 18,
    labelSpan:6,
    initialValue:[]

  },/* {
    Tips: 'To',
    decorator: 'endDate',
    required: false,
    type: 'picker',
    disabled: false,
    span: '5',
    offset:0,
    wrapperSpan: 15,
    labelSpan:4,
    initialValue:''

  }, */

  {
    Tips: 'Currency',
    decorator: 'currency',
    required: true,
    type: 'radioSelect',
    span: '10',
    colOffset: '1',
    wrapperSpan: 18,
    labelSpan: 6,
    initIalValue:31,
    filterType: true,
    options:[]
  }


]

//trackCommercial from
export const trackCommercialFrom: IFormoptions[] =[
  {
    Tips: 'Route class',
    decorator: 'routeClass',
    required: false,
    type: 'select',
    span: '10',
    colOffset:'1',
    wrapperSpan: 18,
    labelSpan:6,
    options:[]
  },
  {
    Tips: 'Product',
    decorator: 'product',
    required: false,
    type: 'radioSelect',
    span: '10',
    colOffset: '2',
    wrapperSpan: 18,
    labelSpan: 6,
    options:[]
  },
  {
    Tips: 'Services',
    decorator: 'service',
    required: false,
    type: 'select',
    span: '10',
    colOffset: '1',
    wrapperSpan: 18,
    labelSpan: 6,
    // wrapperOffset: 1,
    options:[]
  },
  {
    Tips: 'Country',
    decorator: 'country',
    required: false,
    type: 'radioSelect',
    span: '10',
    colOffset: '2',
    wrapperSpan: 18,
    labelSpan: 6,
    // wrapperOffset: 1,
    options:[]
  },
  {
    Tips: 'Status',
    decorator: 'status',
    required: false,
    type: 'tags',
    span: '10',
    colOffset: '1',
    wrapperSpan: 18,
    labelSpan: 6,
    initIalValue:[],
    options:[]
  },
  {
    Tips: 'Begin date',
    decorator: 'beginDate',
    required: false,
    type: 'picker-range',
    disabled: false,
    span: '10',
    colOffset: '2',
    wrapperSpan: 18,
    labelSpan: 6,
    initialValue:[]

  },
  {
    Tips: 'Transaction ID',
    decorator: 'transactionId',
    required: false,
    type: 'input',
    span: '10',
    colOffset: '1',
    wrapperSpan: 18,
    labelSpan: 6
  }


]

//mangement Technical from
export const technicalFrom: IFormoptions[] =[
  {
    Tips: 'Route class',
    decorator: 'routeClass',
    required: false,
    type: 'select',
    span: '10',
    colOffset:'1',
    wrapperSpan: 18,
    labelSpan:6,
    initIalValue:'',
    options:[]
  },
  {
    Tips: 'Product',
    decorator: 'product',
    required: false,
    type: 'radioSelect',
    span: '10',
    colOffset: '2',
    wrapperSpan: 18,
    labelSpan: 6,
    initIalValue:'',
    options:[]
  },
  {
    Tips: 'Status',
    decorator: 'status',
    required: false,
    type: 'tags',
    span: '10',
    colOffset: '1',
    wrapperSpan: 18,
    labelSpan: 6,
    initIalValue:[],
    options:[]
  },
  {
    Tips: 'Begin date',
    decorator: 'beginDate',
    required: false,
    type: 'picker-range',
    disabled: false,
    span: '10',
    colOffset: '2',
    wrapperSpan: 18,
    labelSpan: 6,
    initialValue:[]

  },
  {
    Tips: 'Transaction ID',
    decorator: 'transactionId',
    required: false,
    type: 'input',
    span: '10',
    colOffset: '1',
    wrapperSpan: 18,
    labelSpan: 6,
    initialValue:''
  }


]



//Management of Inclusion From
export const inclusionFrom: IFormoptions[] =[
  {
    Tips: 'Route class',
    decorator: 'routeClass',
    required: false,
    type: 'select',
    span: '10',
    colOffset:'1',
    wrapperSpan: 17,
    labelSpan:7,
    options:[]
  },
  {
    Tips: 'Product',
    decorator: 'product',
    required: false,
    type: 'radioSelect',
    span: '10',
    colOffset: '2',
    wrapperSpan: 17,
    labelSpan: 7,
    options:[]
  },
  {
    Tips: 'Commercial trunk',
    decorator: 'commercialTrunk',
    required: false,
    type: 'radioSelect',
    span: '10',
    colOffset: '1',
    wrapperSpan: 17,
    labelSpan: 7,
    // wrapperOffset: 1,
    options:[]
  },
  {
    Tips: 'Account',
    decorator: 'account',
    required: false,
    type: 'radioSelect',
    span: '10',
    colOffset: '2',
    wrapperSpan: 17,
    labelSpan: 7,
    // wrapperOffset: 1,
    options:[]
  },
  {
    Tips: 'Begin date',
    decorator: 'beginDate',
    required: false,
    type: 'picker-range',
    disabled: false,
    span: '10',
    colOffset: '1',
    wrapperSpan: 17,
    labelSpan: 7,
    initialValue:[]

  },
  {
    Tips: 'End date',
    decorator: 'endDate',
    required: false,
    type: 'picker-range',
    disabled: false,
    span: '10',
    colOffset: '2',
    wrapperSpan: 17,
    labelSpan: 7,
    initialValue:[]

  },
  {
    Tips: 'Status',
    decorator: 'status',
    required: false,
    type: 'select',
    span: '10',
    colOffset: '1',
    wrapperSpan: 17,
    labelSpan: 7,
    initIalValue:'2',
    options:[
      {
        name: 'All',
        id: '1'
      },
      {
        name: 'Active',
        id: '2'
      },
      {
        name: 'Invalid',
        id: '3'
      }
    ]
  },
  {
    Tips: 'Remark',
    decorator: 'remark',
    required: false,
    type: 'input',
    disabled: false,
    span: '10',
    colOffset: '2',
    wrapperSpan: 17,
    labelSpan:7,

  }


]

//Management of Exclusion From
export const exclusionFrom: IFormoptions[] =[
  {
    Tips: 'Route class',
    decorator: 'routeClass',
    required: false,
    type: 'select',
    span: '10',
    colOffset:'1',
    wrapperSpan: 17,
    labelSpan:7,
    options:[]
  },
  {
    Tips: 'Product',
    decorator: 'product',
    required: false,
    type: 'radioSelect',
    span: '10',
    colOffset: '2',
    wrapperSpan: 17,
    labelSpan: 7,
    options:[]
  },
  {
    Tips: 'Commercial trunk',
    decorator: 'commercialTrunk',
    required: false,
    type: 'select',
    span: '10',
    colOffset: '1',
    wrapperSpan: 17,
    labelSpan: 7,
    // wrapperOffset: 1,
    options:[]
  },
  {
    Tips: 'Account',
    decorator: 'account',
    required: false,
    type: 'select',
    span: '10',
    colOffset: '2',
    wrapperSpan: 17,
    labelSpan: 7,
    // wrapperOffset: 1,
    options:[]
  },
  {
    Tips: 'Begin date',
    decorator: 'beginDate',
    required: false,
    type: 'picker-range',
    disabled: false,
    span: '10',
    colOffset: '1',
    wrapperSpan: 17,
    labelSpan: 7,
    initialValue:[]

  },
  {
    Tips: 'End date',
    decorator: 'endDate',
    required: false,
    type: 'picker-range',
    disabled: false,
    span: '10',
    colOffset: '2',
    wrapperSpan: 17,
    labelSpan: 7,
    initialValue:[]

  },
  {
    Tips: 'Status',
    decorator: 'status',
    required: false,
    type: 'select',
    span: '10',
    colOffset: '1',
    wrapperSpan: 17,
    labelSpan: 7,
    initIalValue:'2',
    options:[
      {
        name: 'All',
        id: '1'
      },
      {
        name: 'Active',
        id: '2'
      },
      {
        name: 'Invalid',
        id: '3'
      }
    ]
  }
]


//Management of Inclusion Add From
export const inclusionAddFrom: IFormoptions[] =[
  {
    Tips: 'Route class',
    decorator: 'routeClass',
    required: true,
    type: 'select',
    span: '10',
    colOffset:'1',
    wrapperSpan: 18,
    labelSpan:6
  },
  {
    Tips: 'Product',
    decorator: 'product',
    required: true,
    type: 'radioSelect',
    span: '10',
    colOffset: '2',
    wrapperSpan: 18,
    labelSpan: 6
  },
  {
    Tips: 'Commercial trunk',
    decorator: 'commercialTrunk',
    required: true,
    type: 'select',
    span: '10',
    colOffset: '1',
    wrapperSpan: 18,
    labelSpan: 6,
    // wrapperOffset: 1,
    options:[]
  },
  {
    Tips: 'Status',
    decorator: 'status',
    required: true,
    type: 'select',
    span: '10',
    colOffset: '2',
    wrapperSpan: 18,
    labelSpan:6,
    options:[
      {
        name: 'Active',
        id: '2'
      },
      {
        name: 'Invalid',
        id: '3'
      }
    ],
    initialValue:'active'
  },
  {
    Tips: 'Begin date',
    decorator: 'beginDate',
    required: true,
    type: 'picker',
    span: '10',
    colOffset: '1',
    wrapperSpan: 18,
    labelSpan: 6
  },
  {
    Tips: 'End date',
    decorator: 'endDate',
    required: true,
    type: 'picker',
    disabled: false,
    span: '10',
    colOffset: '2',
    wrapperSpan: 18,
    labelSpan:6,

  },
  {
    Tips: 'Remark',
    decorator: 'remark',
    required: false,
    type: 'textarea',
    disabled: false,
    span: '24',
    colOffset: '1',
    wrapperSpan: 20,
    labelSpan:2

  }
]


//Management of Inclusion Edit From
export const inclusionEditFrom: IFormoptions[] =[
  {
    Tips: 'Route class',
    decorator: 'routeClass',
    required: true,
    type: 'select',
    span: '10',
    colOffset:'1',
    wrapperSpan: 18,
    labelSpan:6,
    disabled:true,
    initIalValue:'',
    options:[]
  },
  {
    Tips: 'Product',
    decorator: 'product',
    required: true,
    type: 'radioSelect',
    span: '10',
    colOffset: '2',
    wrapperSpan: 18,
    labelSpan: 6,
    disabled:true,
    initIalValue:'',
    options:[]
  },
  {
    Tips: 'Commercial trunk',
    decorator: 'commercialTrunk',
    required: true,
    type: 'select',
    span: '10',
    colOffset: '1',
    wrapperSpan: 18,
    labelSpan: 6,
    initIalValue:'',
    // wrapperOffset: 1,
    options:[]
  },
  {
    Tips: 'Status',
    decorator: 'status',
    required: true,
    type: 'select',
    span: '10',
    colOffset: '2',
    wrapperSpan: 18,
    labelSpan:6,
    initIalValue:'',
    // wrapperOffset: 1,
    options:[
      {
        name: 'Active',
        id: '2'
      },
      {
        name: 'Invalid',
        id: '3'
      }
    ]
  },
  {
    Tips: 'Begin date',
    decorator: 'beginDate',
    required: true,
    type: 'picker',
    span: '10',
    colOffset: '1',
    wrapperSpan: 18,
    labelSpan: 6,
    initialValue: ''
  },
  {
    Tips: 'End date',
    decorator: 'endDate',
    required: true,
    type: 'picker',
    disabled: false,
    span: '10',
    colOffset: '2',
    wrapperSpan: 18,
    labelSpan:6,
    initialValue: ''

  },
  {
    Tips: 'Remark',
    decorator: 'remark',
    required: false,
    type: 'textarea',
    disabled: false,
    span: '24',
    colOffset: '1',
    wrapperSpan: 20,
    labelSpan:2,
    initialValue:''

  }
]

//Management of Exclusion Add From
export const exclusionAddFrom: IFormoptions[] =[
  {
    Tips: 'Route class',
    decorator: 'routeClass',
    required: true,
    type: 'select',
    span: '10',
    colOffset:'1',
    wrapperSpan: 18,
    labelSpan:6
  },
  {
    Tips: 'Product',
    decorator: 'product',
    required: true,
    type: 'radioSelect',
    span: '10',
    colOffset: '2',
    wrapperSpan: 18,
    labelSpan: 6
  },
  {
    Tips: 'Commercial trunk',
    decorator: 'commercialTrunk',
    required: true,
    type: 'select',
    span: '10',
    colOffset: '1',
    wrapperSpan: 18,
    labelSpan: 6,
    // wrapperOffset: 1,
    options:[]
  },
  {
    Tips: 'Status',
    decorator: 'status',
    required: true,
    type: 'select',
    span: '10',
    colOffset: '2',
    wrapperSpan: 18,
    labelSpan:6,
    // wrapperOffset: 1,
    options:[
      {
        name: 'Active',
        id: '2'
      },
      {
        name: 'Invalid',
        id: '3'
      }
    ]
  },
  {
    Tips: 'Begin date',
    decorator: 'beginDate',
    required: true,
    type: 'picker',
    span: '10',
    colOffset: '1',
    wrapperSpan: 18,
    labelSpan: 6,
    // wrapperOffset: 1,
    options:[]
  },
  {
    Tips: 'End date',
    decorator: 'endDate',
    required: true,
    type: 'picker',
    disabled: false,
    span: '10',
    colOffset: '2',
    wrapperSpan: 18,
    labelSpan:6,

  },
  {
    Tips: 'Remark',
    decorator: 'remark',
    required: false,
    type: 'textarea',
    disabled: false,
    span: '24',
    colOffset: '1',
    wrapperSpan: 20,
    labelSpan:2

  }
]

//Management of Exclusion Edit From
export const exclusionEditFrom: IFormoptions[] =[
  {
    Tips: 'Route class',
    decorator: 'routeClass',
    required: true,
    type: 'select',
    span: '10',
    colOffset:'1',
    wrapperSpan: 18,
    labelSpan:6,
    disabled:true,
    initIalValue:'',
    options:[]
  },
  {
    Tips: 'Product',
    decorator: 'product',
    required: true,
    type: 'radioSelect',
    span: '10',
    colOffset: '2',
    wrapperSpan: 18,
    labelSpan: 6,
    disabled:true,
    initIalValue:'',
    options:[]
  },
  {
    Tips: 'Commercial trunk',
    decorator: 'commercialTrunk',
    required: true,
    type: 'select',
    span: '10',
    colOffset: '1',
    wrapperSpan: 18,
    labelSpan: 6,
    initIalValue:'',
    options:[]
  },
  {
    Tips: 'Status',
    decorator: 'status',
    required: true,
    type: 'select',
    span: '10',
    colOffset: '2',
    wrapperSpan: 18,
    labelSpan:6,
    initIalValue:'',
    options:[
      {
      name: 'All',
      id: '1'
      },
      {
        name: 'Active',
        id: '2'
      },
      {
        name: 'Invalid',
        id: '3'
      }
    ]
  },
  {
    Tips: 'Begin date',
    decorator: 'beginDate',
    required: true,
    type: 'picker',
    span: '10',
    colOffset: '1',
    wrapperSpan: 18,
    labelSpan: 6,
    initialValue: ''
  },
  {
    Tips: 'End date',
    decorator: 'endDate',
    required: true,
    type: 'picker',
    disabled: false,
    span: '10',
    colOffset: '2',
    wrapperSpan: 18,
    labelSpan:6,
    initialValue: ''

  },
  {
    Tips: 'Remark',
    decorator: 'remark',
    required: false,
    type: 'textarea',
    disabled: false,
    span: '24',
    colOffset: '1',
    wrapperSpan: 20,
    labelSpan:2,
    initialValue:''

  }
]



//Route class benchMark From
export const routeClassFrom: IFormoptions[] =[
  {
    Tips: 'Route class',
    decorator: 'routeClass',
    required: false,
    type: 'select',
    span: '10',
    colOffset:'1',
    wrapperSpan: 18,
    labelSpan:6,
    options:[]
  },
  {
    Tips: 'Status',
    decorator: 'status',
    required: true,
    type: 'select',
    span: '10',
    colOffset: '2',
    wrapperSpan: 18,
    labelSpan: 6,
    initIalValue:2,
    options:[
      {
        id: 1,
        name: 'All'
      },
      {
        id: 2,
        name: 'Active'
      },
      {
        id: 3,
        name: 'Invalid'
      }
    ]
  },
  {
    Tips: 'Begin date',
    decorator: 'beginDate',
    required: false,
    type: 'picker-range',
    disabled: false,
    span: '10',
    colOffset:'1',
    wrapperSpan: 18,
    labelSpan:6,
    initialValue:[]

  } ,/*{
    Tips: 'To',
    decorator: 'beginDateTo',
    required: false,
    type: 'picker',
    disabled: false,
    span: '5',
    wrapperSpan: 15,
    labelSpan:4,
    initialValue:''

  }, */
  {
    Tips: 'End date',
    decorator: 'endDate',
    required: false,
    type: 'picker-range',
    disabled: false,
    span: '10',
    colOffset: '2',
    wrapperSpan: 18,
    labelSpan: 6,
    initialValue:[]

  }/* ,{
    Tips: 'To',
    decorator: 'endDateTo',
    required: false,
    type: 'picker',
    disabled: false,
    span: '5',
    wrapperSpan: 15,
    labelSpan:4,
    initialValue:''

  } */
]
//Route Class Add Model From
export const routeClassAddFrom: IFormoptions[] =[
  {
    Tips: 'Route class',
    decorator: 'routeClass',
    required: true,
    type: 'select',
    span: '10',
    colOffset:'1',
    wrapperSpan: 18,
    labelSpan:7
  },
  {
    Tips: 'Status',
    decorator: 'status',
    required: true,
    type: 'select',
    span: '10',
    colOffset: '2',
    wrapperSpan: 18,
    labelSpan:7,
    initIalValue: 2,
    // wrapperOffset: 1,
    options:[
      {
        name: 'Active',
        id: 2
      },
      {
        name: 'Invalid',
        id: 3
      }
    ]
  },
  {
    Tips: 'Begin date',
    decorator: 'beginDate',
    required: true,
    type: 'picker',
    span: '10',
    colOffset: '1',
    wrapperSpan: 18,
    labelSpan: 7
  },
  {
    Tips: 'End date',
    decorator: 'endDate',
    required: true,
    type: 'picker',
    disabled: false,
    span: '10',
    colOffset: '2',
    wrapperSpan: 18,
    labelSpan:7,
  },
  {
    Tips: 'Margin-minimum',
    decorator: 'marginMinimum',
    required: false,
    type: 'input',
    span: '10',
    colOffset: '1',
    wrapperSpan: 18,
    labelSpan: 7
  },
  {
    Tips: 'ASR-minimum',
    decorator: 'asrMinimum',
    required: false,
    type: 'input',
    span: '10',
    colOffset: '2',
    wrapperSpan: 18,
    labelSpan: 7
  },
  {
    Tips: 'Impact-minimum(x1000)',
    decorator: 'impactMinimum',
    required: false,
    type: 'input',
    span: '10',
    colOffset: '1',
    wrapperSpan: 18,
    labelSpan: 7
  },
  {
    Tips: 'Impact-maximum(x1000)',
    decorator: 'impactMaximum',
    required: false,
    type: 'input',
    span: '10',
    colOffset: '2',
    wrapperSpan: 18,
    labelSpan: 7
  },
  {
    Tips: 'Maximum Commercial trunks',
    decorator: 'maximumCommercialTrunks',
    required: false,
    type: 'input',
    span: '10',
    colOffset: '1',
    wrapperSpan: 18,
    labelSpan: 7
  },
  {
    Tips: 'Maximum Technical trunks',
    decorator: 'maximumTechnicalTrunks',
    required: false,
    type: 'input',
    span: '10',
    colOffset: '2',
    wrapperSpan: 18,
    labelSpan: 7
  },
  {
    Tips: 'Maximum Internal trunks',
    decorator: 'maximumInternalTrunks',
    required: false,
    type: 'input',
    span: '10',
    colOffset: '1',
    wrapperSpan: 18,
    labelSpan: 7
  },
  {
    Tips: 'Minimum MOS',
    decorator: 'minimumMos',
    required: false,
    type: 'input',
    span: '10',
    colOffset: '2',
    wrapperSpan: 18,
    labelSpan: 7
  },
  {
    Tips: 'Remark',
    decorator: 'remark',
    required: false,
    type: 'textarea',
    disabled: false,
    span: '24',
    colOffset: '1',
    wrapperSpan: 21,
    labelSpan:2
  }
]

//Route Class Edit Model From
export const routeClassEditFrom: IFormoptions[] =[
  {
    Tips: 'Route class',
    decorator: 'routeClass',
    required: true,
    type: 'select',
    span: '10',
    colOffset:'1',
    wrapperSpan: 18,
    labelSpan:7,
    disabled:true,
    initIalValue: '',
    options:[]
  },
  {
    Tips: 'Status',
    decorator: 'status',
    required: true,
    type: 'select',
    span: '10',
    colOffset: '2',
    wrapperSpan: 18,
    labelSpan:7,
    initIalValue: '',
    options:[
      {
        id:1,
        name:'Active'
      },
      {
        id:2,
        name: 'Invalid'
      }
    ]
  },
  {
    Tips: 'Begin date',
    decorator: 'beginDate',
    required: true,
    type: 'picker',
    span: '10',
    colOffset: '1',
    wrapperSpan: 18,
    labelSpan: 7,
    initialValue:''

  },
  {
    Tips: 'End date',
    decorator: 'endDate',
    required: true,
    type: 'picker',
    disabled: false,
    span: '10',
    colOffset: '2',
    wrapperSpan: 18,
    labelSpan:7,
    initialValue: ''
  },
  {
    Tips: 'Margin-minimum',
    decorator: 'marginMinimum',
    required: false,
    type: 'input',
    span: '10',
    colOffset: '1',
    wrapperSpan: 18,
    labelSpan: 7,
    initialValue: ''
  },
  {
    Tips: 'ASR-minimum',
    decorator: 'asrMinimum',
    required: false,
    type: 'input',
    span: '10',
    colOffset: '2',
    wrapperSpan: 18,
    labelSpan: 7,
    initialValue: ''

  },
  {
    Tips: 'Impact-minimum(x1000)',
    decorator: 'impactMinimum',
    required: false,
    type: 'input',
    span: '10',
    colOffset: '1',
    wrapperSpan: 18,
    labelSpan: 7,
    initialValue: ''
  },
  {
    Tips: 'Impact-maximum(x1000)',
    decorator: 'impactMaximum',
    required: false,
    type: 'input',
    span: '10',
    colOffset: '2',
    wrapperSpan: 18,
    labelSpan: 7,
    initialValue: ''

  },
  {
    Tips: 'Maximum Commercial trunks',
    decorator: 'maximumCommercialTrunks',
    required: false,
    type: 'input',
    span: '10',
    colOffset: '1',
    wrapperSpan: 18,
    labelSpan: 7,
    initialValue: ''
  },
  {
    Tips: 'Maximum Technical trunks',
    decorator: 'maximumTechnicalTrunks',
    required: false,
    type: 'input',
    span: '10',
    colOffset: '2',
    wrapperSpan: 18,
    labelSpan: 7,
    initialValue: ''
  },
  {
    Tips: 'Maximum Internal trunks',
    decorator: 'maximumInternalTrunks',
    required: false,
    type: 'input',
    span: '10',
    colOffset: '1',
    wrapperSpan: 18,
    labelSpan: 7,
    initialValue: ''
  },
  {
    Tips: 'Minimum MOS',
    decorator: 'minimumMos',
    required: false,
    type: 'input',
    span: '10',
    colOffset: '2',
    wrapperSpan: 18,
    labelSpan: 7,
    initialValue: ''
  },
  {
    Tips: 'Remark',
    decorator: 'remark',
    required: false,
    type: 'textarea',
    disabled: false,
    span: '24',
    colOffset: '1',
    wrapperSpan: 21,
    labelSpan:2,
    initialValue: ''
  }
]

//Route Product Add Model From
export const routeProductAddFrom: IFormoptions[] =[
  {
    Tips: 'Route class',
    decorator: 'routeClass',
    required: true,
    type: 'select',
    span: '10',
    colOffset:'1',
    wrapperSpan: 18,
    labelSpan:7
  },
  {
    Tips: 'Product',
    decorator: 'product',
    required: true,
    type: 'radioSelect',
    span: '10',
    colOffset: '2',
    wrapperSpan: 18,
    labelSpan:7,
    // wrapperOffset: 1,
    options:[
    ]
  },
  {
    Tips: 'Status',
    decorator: 'status',
    required: true,
    type: 'select',
    span: '10',
    colOffset: '1',
    wrapperSpan: 18,
    labelSpan:7,
    initIalValue: 2,
    options:[
      {
        id:2,
        name:'Active'
      },
      {
        id:3,
        name: 'Invalid'
      }
    ]
  },
  {
    Tips: 'Begin date',
    decorator: 'beginDate',
    required: true,
    type: 'picker',
    span: '10',
    colOffset: '2',
    wrapperSpan: 18,
    labelSpan: 7,
    initialValue:getDate()
  },
  {
    Tips: 'End date',
    decorator: 'endDate',
    required: true,
    type: 'picker',
    disabled: false,
    span: '10',
    colOffset: '1',
    wrapperSpan: 18,
    labelSpan:7,
    initialValue: '2099-12-31',
  },
  {
    Tips: 'Margin-minimum',
    decorator: 'marginMinimum',
    required: false,
    type: 'input',
    span: '10',
    colOffset: '2',
    wrapperSpan: 18,
    labelSpan: 7

  },
  {
    Tips: 'ASR-minimum',
    decorator: 'asrMinimum',
    required: false,
    type: 'input',
    span: '10',
    colOffset: '1',
    wrapperSpan: 18,
    labelSpan: 7

  },
  {
    Tips: 'Impact-minimum(x1000)',
    decorator: 'impactMinimum',
    required: false,
    type: 'input',
    span: '10',
    colOffset: '2',
    wrapperSpan: 18,
    labelSpan: 7

  },
  {
    Tips: 'Impact-maximum(x1000)',
    decorator: 'impactMaximum',
    required: false,
    type: 'input',
    span: '10',
    colOffset: '1',
    wrapperSpan: 18,
    labelSpan: 7


  },
  {
    Tips: 'Maximum Commercial trunks',
    decorator: 'maximumCommercialTrunks',
    required: false,
    type: 'input',
    span: '10',
    colOffset: '2',
    wrapperSpan: 18,
    labelSpan: 7

  },
  {
    Tips: 'Maximum Technical trunks',
    decorator: 'maximumTechnicalTrunks',
    required: false,
    type: 'input',
    span: '10',
    colOffset: '1',
    wrapperSpan: 18,
    labelSpan: 7

  },
  {
    Tips: 'Maximum Internal trunks',
    decorator: 'maximumInternalTrunks',
    required: false,
    type: 'input',
    span: '10',
    colOffset: '2',
    wrapperSpan: 18,
    labelSpan: 7

  },
  {
    Tips: 'Minimum MOS',
    decorator: 'minimumMos',
    required: false,
    type: 'input',
    span: '10',
    colOffset: '1',
    wrapperSpan: 18,
    labelSpan: 7

  },
  {
    Tips: 'Remark',
    decorator: 'remark',
    required: false,
    type: 'textarea',
    disabled: false,
    span: '24',
    colOffset: '1',
    wrapperSpan: 21,
    labelSpan:2
  }
]

//Route Product Edit Model From
export const routeProductEditFrom: IFormoptions[] =[
  {
    Tips: 'Route class',
    decorator: 'routeClass',
    required: true,
    type: 'select',
    span: '10',
    colOffset:'1',
    wrapperSpan: 18,
    labelSpan:7,
    initIalValue:'',
    options: [],
    disabled: true
  },
  {
    Tips: 'Product',
    decorator: 'product',
    required: true,
    type: 'radioSelect',
    span: '10',
    colOffset: '2',
    wrapperSpan: 18,
    labelSpan:7,
    initIalValue: '',
    options:[],
    disabled:true
  },
  {
    Tips: 'Status',
    decorator: 'status',
    required: true,
    type: 'select',
    span: '10',
    colOffset: '1',
    wrapperSpan: 18,
    labelSpan:7,
    initIalValue: '',
    options:[

    ]
  },
  {
    Tips: 'Begin date',
    decorator: 'beginDate',
    required: true,
    type: 'picker',
    span: '10',
    colOffset: '2',
    wrapperSpan: 18,
    labelSpan: 7,
    initialValue:''
  },
  {
    Tips: 'End date',
    decorator: 'endDate',
    required: true,
    type: 'picker',
    disabled: false,
    span: '10',
    colOffset: '1',
    wrapperSpan: 18,
    labelSpan:7,
    initialValue:''
  },
  {
    Tips: 'Margin-minimum',
    decorator: 'marginMinimum',
    required: false,
    type: 'input',
    span: '10',
    colOffset: '2',
    wrapperSpan: 18,
    labelSpan: 7,
    initialValue: ''
  },
  {
    Tips: 'ASR-minimum',
    decorator: 'asrMinimum',
    required: false,
    type: 'input',
    span: '10',
    colOffset: '1',
    wrapperSpan: 18,
    labelSpan: 7,
    initialValue: ''
  },
  {
    Tips: 'Impact-minimum(x1000)',
    decorator: 'impactMinimum',
    required: false,
    type: 'input',
    span: '10',
    colOffset: '2',
    wrapperSpan: 18,
    labelSpan: 7,
    initialValue: ''
  },
  {
    Tips: 'Impact-maximum(x1000)',
    decorator: 'impactMaximum',
    required: false,
    type: 'input',
    span: '10',
    colOffset: '1',
    wrapperSpan: 18,
    labelSpan: 7,
    initialValue: ''
  },
  {
    Tips: 'Maximum Commercial trunks',
    decorator: 'maximumCommercialTrunks',
    required: false,
    type: 'input',
    span: '10',
    colOffset: '2',
    wrapperSpan: 18,
    labelSpan: 7,
    initialValue: ''

  },
  {
    Tips: 'Maximum Technical trunks',
    decorator: 'maximumTechnicalTrunks',
    required: false,
    type: 'input',
    span: '10',
    colOffset: '1',
    wrapperSpan: 18,
    labelSpan: 7,
    initialValue: ''

  },
  {
    Tips: 'Maximum Internal trunks',
    decorator: 'maximumInternalTrunks',
    required: false,
    type: 'input',
    span: '10',
    colOffset: '2',
    wrapperSpan: 18,
    labelSpan: 7,
    initialValue: ''

  },
  {
    Tips: 'Minimum MOS',
    decorator: 'minimumMos',
    required: false,
    type: 'input',
    span: '10',
    colOffset: '1',
    wrapperSpan: 18,
    labelSpan: 7,
    initialValue: ''

  },
  {
    Tips: 'Remark',
    decorator: 'remark',
    required: false,
    type: 'textarea',
    disabled: false,
    span: '24',
    colOffset: '1',
    wrapperSpan: 21,
    labelSpan:2,
    initialValue: ''

  }
]

//Route Product benchMark From
export const routeProductFrom: IFormoptions[] =[
  {
    Tips: 'Route class',
    decorator: 'routeClass',
    required: false,
    type: 'select',
    span: '10',
    colOffset:'1',
    wrapperSpan: 18,
    labelSpan:6,
    options:[]
  },
  {
    Tips: 'Product',
    decorator: 'product',
    required: false,
    type: 'radioSelect',
    span: '10',
    colOffset: '2',
    wrapperSpan: 18,
    labelSpan: 6,
    // wrapperOffset: 1,
    options:[]
  },
  {
    Tips: 'Begin date',
    decorator: 'beginDate',
    required: false,
    type: 'picker-range',
    disabled: false,
    span: '10',
    colOffset:'1',
    wrapperSpan: 18,
    labelSpan:6,
    initialValue:[]

  },/* {
    Tips: 'To',
    decorator: 'beginDateTo',
    required: false,
    type: 'picker',
    disabled: false,
    span: '5',
    wrapperSpan: 15,
    labelSpan:4,
    initialValue:''

  }, */
  {
    Tips: 'End date',
    decorator: 'endDate',
    required: false,
    type: 'picker-range',
    disabled: false,
    span: '10',
    colOffset: '2',
    wrapperSpan: 18,
    labelSpan: 6,
    initialValue:[]

  },/* {
    Tips: 'To',
    decorator: 'endDateTo',
    required: false,
    type: 'picker',
    disabled: false,
    span: '5',
    wrapperSpan: 15,
    labelSpan:4,
    initialValue:''

  }, */
  {
    Tips: 'Status',
    decorator: 'status',
    required: true,
    type: 'select',
    span: '10',
    colOffset: '1',
    wrapperSpan: 18,
    labelSpan: 6,
    initIalValue: 2,
    options:[
      {
        name: 'All',
        id: 1
      },
      {
        name: 'Active',
        id: 2
      },
      {
        name: 'Invalid',
        id: 3
      }
    ]
  }
]

//Switch benchMark From
export const switchFrom: IFormoptions[] =[
  {
    Tips: 'Route class',
    decorator: 'RouteClass',
    required: false,
    type: 'select',
    span: '10',
    colOffset:'1',
    wrapperSpan: 18,
    labelSpan:6,
    options:[
      {
        name: 'routeclass1',
        value: 'routeclass1'
      },
      {
        name: 'routeclass2',
        value: 'routeclass2'
      }
    ]
  },
  {
    Tips: 'Routing product',
    decorator: 'routingProduct',
    required: false,
    type: 'select',
    span: '10',
    colOffset: '1',
    wrapperSpan: 18,
    labelSpan: 6,
    // wrapperOffset: 1,
    options:[
      {
        name: 'open',
        value: '1'
      },
      {
        name: 'close',
        value: '2'
      }
    ]
  },
  {
    Tips: 'Switch',
    decorator: 'switch',
    required: false,
    type: 'select',
    span: '10',
    colOffset: '1',
    wrapperSpan: 18,
    labelSpan: 6,
    // wrapperOffset: 1,
    options:[
      {
        name: 'open',
        value: '1'
      },
      {
        name: 'close',
        value: '2'
      }
    ]
  },
  {
    Tips: 'Status',
    decorator: 'status',
    required: false,
    type: 'select',
    span: '10',
    colOffset: '1',
    wrapperSpan: 18,
    labelSpan: 6,
    // wrapperOffset: 1,
    options:[
      {
        name: 'open',
        value: '1'
      },
      {
        name: 'close',
        value: '2'
      }
    ]
  },
  {
    Tips: 'Begin date',
    decorator: 'beginDate',
    required: false,
    type: 'picker',
    span: '10',
    colOffset: '1',
    wrapperSpan: 18,
    labelSpan: 6
  },
  {
    Tips: 'End date',
    decorator: 'endDate',
    required: false,
    type: 'picker',
    disabled: false,
    span: '10',
    colOffset: '1',
    wrapperSpan: 18,
    labelSpan:6,

  }
]


//commercialTrunk from
export const commercialTrunkForm: IFormoptions[] =[
  {
    Tips: 'CommercialTrunk',
    decorator: 'commercialTrunk',
    required: false,
    type: 'select',
    span: '10',
    colOffset:'1',
    wrapperSpan: 18,
    labelSpan:6,
    options:[]
  },
  {
    Tips: 'rateBetween',
    decorator: 'rateBetween',
    required: false,
    type: 'input',
    disabled: false,
    offset:6,
    span: '8',
    wrapperSpan: 9,
    labelSpan:8,
    initialValue:''

  },{
    Tips: 'and',
    decorator: 'and',
    required: false,
    type: 'input',
    disabled: false,
    span: '5',
    wrapperSpan: 15,
    labelSpan:4,
    initialValue:''

  },
  {
    Tips: 'ASR>',
    decorator: 'asr',
    required: false,
    type: 'input',
    span: '10',
    colOffset:'1',
    wrapperSpan: 18,
    labelSpan:6
  },{
    Tips: 'CLI',
    decorator: 'cli',
    required: false,
    type: 'select',
    disabled: false,
    span: '10',
    colOffset: '2',
    wrapperSpan: 18,
    labelSpan:6,
    initIalValue:'All',
    options:[
      {
        id:2,
        name:'YES'
      },{
        id:3,
        name:'NO'
      }
    ]
  }
]

//technicalTrunkForm from
export const technicalTrunkForm: IFormoptions[] =[
  {
    Tips: 'Switch',
    decorator: 'switch',
    required: false,
    type: 'select',
    span: '10',
    colOffset:'1',
    wrapperSpan: 18,
    labelSpan:6,
    options:[]
  },
  {
    Tips: 'Traffic origination',
    decorator: 'trafficOrigination',
    required: true,
    type: 'select',
    span: '10',
    colOffset: '2',
    wrapperSpan: 18,
    labelSpan:6,
    options:[{
      id:1,
      name:'Home'
    },{
      id:2,
      name:'External'
    },{
      id:3,
      name:'Home/External'
    }]
  },
  {
    Tips: 'Commercial trunk',
    decorator: 'commercialTrunk',
    required: false,
    type: 'select',
    disabled: false,
    span: '10',
    colOffset: '1',
    wrapperSpan: 18,
    labelSpan:6,
    options:[]
  },
  {
    Tips: 'Rate',
    decorator: 'rate',
    required: false,
    type: 'input',
    disabled: false,
    span: '7',
    offset:3,
    colOffset: '1',
    wrapperSpan:12,
    labelSpan:8,
    initialValue:''

  },{
    Tips: 'To',
    decorator: 'rateTo',
    required: false,
    type: 'input',
    disabled: false,
    span: '5',
    wrapperSpan: 15,
    labelSpan:4,
    initialValue:''

  },
  {
    Tips: 'ASR>',
    decorator: 'asr',
    required: false,
    type: 'input',
    span: '10',
    colOffset:'1',
    wrapperSpan: 18,
    labelSpan:6
  },{
    Tips: 'CLI',
    decorator: 'cli',
    required: false,
    type: 'select',
    disabled: false,
    span: '10',
    colOffset:'2',
    wrapperSpan: 18,
    labelSpan:6,
    options:[

      {
        id:1,
        name:'YES'
      },{
        id:2,
        name:'NO'
      }
    ]
  }
]
