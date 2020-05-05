import moment from 'moment'
/* 查询表格数据 */
export const formoptionsData: any[] = [
  {
    Tips: "Traffic date",
    name: "trafficDateName",
    required: true,
    type: 'rangePicker',
    format: 'YYYY-MM-DD',
    initialValue: [
      // moment(),
      // moment().add(1, 'days')
      moment(new Date(new Date(new Date().toLocaleDateString()).getTime())),
      moment(new Date(new Date(new Date().toLocaleDateString()).getTime())),
    ]
  },
  {
    Tips: "Destination",
    name: "refInDestinationName",
    required: false,
    type: "select",
    span: 8,
    options: [],
    disabled: false,
    showSearch: true
  },
  {
    Tips: "Service",
    name: "configServiceName",
    required: false,
    type: "select",
    span: 8,
    options: []
  },

  {
    Tips: "Dialed digits",
    name: "preDialedDigit",
    required: false,
    type: "input",
    span: 8,
    isCheckNumber: true
  },
  {
    Tips: "Country",
    name: "countryName",
    required: false,
    type: "select",
    span: 8,
    options: [],
    disabled: false,
    showSearch: true,
  },
  {
    Tips: "Country code",
    name: "preCountryCode",
    required: false,
    type: "input",
    span: 8,
    isCheckNumber: true
  }
]
/* 中间操作栏数据 */
export const FormscreeningData = [{
  name: "Export",
  icon: "export",
  index: 1,
  disabled: true
}]
/* 表格数据 */
export const columnsData: any[] = [
  {
    title: "Traffic date",
    dataIndex: "trafficDate",
    key: "trafficDate",
    width: 60,
    sorter: true
  },
  {
    title: "Destination",
    dataIndex: "refInDestinationName",
    key: "refInDestinationName",
    width: 60,
    sorter: true
  },
  {
    title: "Route class",
    dataIndex: "routeClassName",
    key: "routeClassName",
    width: 60,
    sorter: true
  },
  {
    title: "Service",
    dataIndex: "configServiceName",
    key: "configServiceName",
    width: 60,
    sorter: true
  },
  {
    title: "Minimum",
    dataIndex: "minimumPrice",
    key: "minimumPrice",
    width: 60,
    sorter: true

  },
  {
    title: "Target",
    dataIndex: "targetPrice",
    key: "targetPrice",
    width: 60,
    sorter: true
  },
  {
    title: "Cost",
    dataIndex: "cost",
    key: "cost",
    width: 60,
    sorter: true
  },
  {
    title: "Currency",
    dataIndex: "currencyType",
    key: "currencyType",
    width: 60,
    sorter: true
  },
  {
    title: "CLI",
    dataIndex: "isCli",
    key: "isCli",
    width: 60,
    sorter: true
  },
  {
    title: "Commercial trunk",
    dataIndex: "commercialTrunkName",
    key: "commercialTrunkName",
    width: 60,
    sorter: true
  },
  {
    title: "Account",
    dataIndex: "accountName",
    key: "accountName",
    width: 60,
    sorter: true
  },
  {
    title: "Dialed digits",
    dataIndex: "dialedDigitsList",
    key: "dialedDigitsList",
    width: 60,
    sorter: true,
    scopedSlots: {
      customRender: "commaSplitNumber"
    },
  },
  {
    title: "Country",
    dataIndex: "countryName",
    key: "countryName",
    width: 60,
    sorter: true
  },
  {
    title: "Country code",
    dataIndex: "countryCode",
    key: "countryCode",
    width: 60,
    sorter: true
  },
  {
    title: "Time band",
    dataIndex: "timeBandName",
    key: "timeBandName",
    width: 60,
    sorter: true
  },
  {
    title: "Rounding rules",
    dataIndex: "roundingRuleName",
    key: "roundingRuleName",
    width: 60,
    sorter: true
  },
  {
    title: "Charge basis",
    dataIndex: "chargeBasis",
    key: "chargeBasis",
    width: 60,
    sorter: true
  },
  {
    title: "Begin date",
    dataIndex: "beginDate",
    key: "beginDate",
    width: 60,
    sorter: true
  },
  {
    title: "End date",
    dataIndex: "endDate",
    key: "endDate",
    width: 60,
    sorter: true
  },
  {
    title: "Outbound reference destination",
    dataIndex: "refOutDestinationName",
    key: "refOutDestinationName",
    width: 60,
    sorter: true
  },
  {
    title: "Reference price list",
    dataIndex: "refPriceListName",
    key: "refPriceListName",
    width: 60,
    sorter: true
  },
  {
    title: "Designate date",
    dataIndex: "designateDate",
    key: "designateDate",
    width: 60,
    sorter: true
  }
]