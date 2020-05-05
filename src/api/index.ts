import { AxiosPost, AxiosGet, AxiosPut, AxiosPatch, AxiosDelete, Axios } from './axios'
import { AxiosConfig } from './parameter'
// 合同 Add Details 获取用户
export const getDetailAccounts = async (data?: AxiosConfig['data']) => AxiosGet('/config/droplist/accounts', data)

// 合同 Add Details 获取业务
export const getDetailService = async (data?: AxiosConfig['data']) => AxiosGet('/config/droplist/services', data)

// 合同 Add Details 获取关联合同
export const getDetailrelatedContract = async (data?: AxiosConfig['data']) => AxiosGet('/config/droplist/relatedContracts', data)

// 合同 Add service  获取费率
export const getServiceCurrencys = async (data?: AxiosConfig['data']) => AxiosGet('/config/droplist/currencys', data)

// 合同 Add cycle check校验
export const CheckService = async (data: AxiosConfig['data']) => AxiosPost('/contract/vc-contract/cycles/check', data)
// 合同 Add cycle 获取Contract
export const cycleContract = async (data?: AxiosConfig['data']) => AxiosGet('/config/droplist/contracts', data)
// 合同 Add cycle 获取Cycle
export const cycleCycle = async (data?: AxiosConfig['data']) => AxiosGet('/config/droplist/cycles', data)




//合同 Add cycle insert search
export const rateplansSummary = async (data?: AxiosConfig['data']) => AxiosGet('/contract/vc-contract/rateplans/summary', data)







// 合同 Add cycle insert confirm 
export const cycleContents = async (data: AxiosConfig['data']) => AxiosGet('/contract/vc-contract/products/contents/' + data)
// product Flat Dstination 费率区
export const getDstinationList = async (data: AxiosConfig['data']) => AxiosGet('/config/droplist/contract/destinations', data)

// product BaseData 获取cycle 未来的周期
export const getPeriodCycles = async (data: AxiosConfig['data']) => AxiosGet('/config/droplist/periodCycles', data)

// product ratingZoneadd timeband
export const getratingZoneTimeband = async (data: AxiosConfig['data']) => AxiosGet('/config/vc-time-band', data)



//   公参模块


// Configuration RefRudingRules的下拉框
export const RefRoundingRuleName = async (data: AxiosConfig['data']) => AxiosGet('/config/droplist/refRoundingRule/names', data)
export const RefMinmumValues = async (data: AxiosConfig['data']) => AxiosGet('/config/droplist/refRoundingRule/minmumValues', data)
export const RefAdditionalRoundings = async (data: AxiosConfig['data']) => AxiosGet('/config/droplist/refRoundingRule/additionalRoundings', data)
export const RefInitialRoundings = async (data: AxiosConfig['data']) => AxiosGet('/config/droplist/refRoundingRule/initialRoundings', data)
export const RefMaximums = async (data: AxiosConfig['data']) => AxiosGet('/config/droplist/refRoundingRule/maximums', data)
export const RefMeasureAdjustments = async (data: AxiosConfig['data']) => AxiosGet('/config/droplist/refRoundingRule/measureAdjustments', data)

// Configuration VcRudingRules的下拉框
export const RoundingRuleName = async (data: AxiosConfig['data']) => AxiosGet('/config/droplist/vcRoundingRule/names', data)
export const MinmumValues = async (data: AxiosConfig['data']) => AxiosGet('/config/droplist/vcRoundingRule/minmumValues', data)
export const AdditionalRoundings = async (data: AxiosConfig['data']) => AxiosGet('/config/droplist/vcRoundingRule/additionalRoundings', data)
export const InitialRoundings = async (data: AxiosConfig['data']) => AxiosGet('/config/droplist/vcRoundingRule/initialRoundings', data)
export const Maximums = async (data: AxiosConfig['data']) => AxiosGet('/config/droplist/vcRoundingRule/maximums', data)
export const MeasureAdjustments = async (data: AxiosConfig['data']) => AxiosGet('/config/droplist/vcRoundingRule/measureAdjustments', data)
export const VcNumberPlanCountries = async (data?: AxiosConfig['data']) => AxiosGet('/config/droplist/countries', data)
export const VcNumberPlanDialedDigits = async (data?: AxiosConfig['data']) => AxiosGet('/config/droplist/vcNumberPlan/dialedDigits', data)
export const VcNumberPlanDestinations = async (data?: AxiosConfig['data']) => AxiosGet('/config/droplist/vcNumberPlan/destinations', data)

// product VcRudingRules的搜索
export const VcRudingRules = async (data: AxiosConfig['data']) => AxiosGet('/config/vc-rounding-rule', data)

// Configuration VcRudingRules的新增
export const VcRudingRulesAdd = async (data: AxiosConfig['data']) => AxiosPost('/config/vc-rounding-rule', data)

// Configuration VcRudingRules的新增
export const VcRudingRulesDelete = async (data: AxiosConfig['data']) => AxiosDelete('/config/vc-rounding-rule/' + data)


// product RefRoundingRules的搜索
export const RefRoundingRules = async (data: AxiosConfig['data']) => AxiosGet('/config/ref-rounding-rule', data)

// Configuration Qualitycommitmentmanagement的搜索
export const Qualitycommitmentmanagements = async (data: AxiosConfig['data']) => AxiosGet('/config/qualityCommitments', data)

// Configuration Qualitycommitmentmanagement的新增
export const QualitycommitmentmanagementAdd = async (data: AxiosConfig['data']) => AxiosPost('/config/qualityCommitments', data)

// Configuration Qualitycommitmentmanagement的编辑
export const QualitycommitmentmanagementEdit = async (data: AxiosConfig['data']) => AxiosPut('/config/qualityCommitments', data)

// Configuration Qualitycommitmentmanagement的删除
export const QualitycommitmentmanagementDelete = async (data: AxiosConfig['data']) => AxiosDelete('/config/qualityCommitments/' + data)

// Configuration Qualitycommitmentmanagement的搜索
export const QualitycommitmentmanagementsDetail = async (data: AxiosConfig['data']) => AxiosGet('/config/qualityCommitments/details', data)


// Configuration Qualitycommitmentmanagement的下拉框
export const destinations = async (data: AxiosConfig['data']) => AxiosGet('/config/droplist/qualityCommitment/destinations', data)

// Configuration Qualitycommitmentmanagement的新增
export const QualitycommitmentmanagementsDetailAdd = async (data: AxiosConfig['data']) => AxiosPost('/config/qualityCommitments/details', data)

// Configuration Qualitycommitmentmanagement的编辑
export const QualitycommitmentmanagementsDetailEdit = async (data: AxiosConfig['data']) => AxiosPut('/config/qualityCommitments/details', data)

// Configuration Qualitycommitmentmanagement的删除
export const QualitycommitmentmanagementsDetailDelete = async (data: AxiosConfig['data']) => AxiosDelete('/config/qualityCommitments/details/' + data)



// Configuration RefRoundingRules的新增
export const RefRoundingRulesAdd = async (data: AxiosConfig['data']) => AxiosPost('/config/ref-rounding-rule', data)

// Configuration RefRoundingRules的删除
export const RefRoundingRulesDelete = async (data: AxiosConfig['data']) => AxiosDelete('/config/ref-rounding-rule/' + data)

// Configuration ExchangeRate的搜索
export const ExchangeRate = async (data: AxiosConfig['data']) => AxiosGet('/config/exchange-rate', data)

// Configuration ExchangeRate的新增
export const ExchangeRateAdd = async (data: AxiosConfig['data']) => AxiosPost('/config/exchange-rate', data)

// Configuration ExchangeRate的编辑
export const ExchangeRateEdit = async (data: AxiosConfig['data']) => AxiosPut('/config/exchange-rate', data)

// Configuration ExchangeRate的删除
export const ExchangeRateDelete = async (data: AxiosConfig['data']) => AxiosDelete('/config/exchange-rate/' + data)

// Configuration CountryCode的搜索
export const CountryCode = async (data: AxiosConfig['data']) => AxiosGet('/config/country-code', data)

// Configuration VCTimeBand的搜索
export const VCTimeBand = async (data: AxiosConfig['data']) => AxiosGet('/config/vc-time-band', data)

// Configuration VCTimeBand的新增
export const VcTimeBandAdd = async (data: AxiosConfig['data']) => AxiosPost('/config/vc-time-band', data)

// Configuration VCTimeBand的编辑
export const VcTimeBandEdit = async (data: AxiosConfig['data']) => AxiosPut('/config/vc-time-band', data)

// Configuration VCTimeBand的删除
export const VCTimeBandDelete = async (data: AxiosConfig['data']) => AxiosDelete('/config/vc-time-band/' + data)

// Configuration Currency的搜索
export const CurrencySearch = async (data: AxiosConfig['data']) => AxiosGet('/config/currencies', data)

// Configuration Currency的新增
export const CurrencyAdd = async (data: AxiosConfig['data']) => AxiosPost('/config/currencies', data)

// Configuration CountryCode的删除
export const CurrencyDelete = async (data: AxiosConfig['data']) => AxiosDelete('/config/currencies/' + data)

// Configuration Currency的下拉框
export const currencys = async (data: AxiosConfig['data']) => AxiosGet('/config/droplist/currencys', data, '')

// Configuration RefNumberPlan的搜索
export const RefNumberPlan = async (data: AxiosConfig['data']) => AxiosGet('/config/ref-number-plan', data)

// Configuration RefNumberPlan的新增
export const RefNumberPlanAdd = async (data: AxiosConfig['data']) => AxiosPost('/config/ref-number-plan', data)

// Configuration RefNumberPlan的编辑
export const RefNumberPlanEdit = async (data: AxiosConfig['data']) => AxiosPut('/config/ref-number-plan', data)

// Configuration RefNumberPlan的删除
export const RefNumberPlanDelete = async (data: AxiosConfig['data']) => AxiosDelete('/config/ref-number-plan/' + data)

// Configuration RefNumberPlan EditCoutry的新增
export const EditCoutrySearch = async (data?: AxiosConfig['data']) => AxiosGet('/config/ref-np-country', data)

// Configuration RefNumberPlan EditCoutry的新增
export const EditCoutryAdd = async (data: AxiosConfig['data']) => AxiosPost('/config/ref-np-country', data)

// Configuration RefNumberPlan EditCoutry的编辑
export const EditCoutryEdit = async (data: AxiosConfig['data']) => AxiosPut('/config/ref-np-country', data)

// Configuration  RefNumberPlan EditCoutry的删除
export const EditCoutryDelete = async (data: AxiosConfig['data']) => AxiosDelete('/config/ref-np-country/' + data)

// Configuration RefNumberPlan EditDestination的新增
export const EditDestinationAdd = async (data: AxiosConfig['data']) => AxiosPost('/config/ref-np-destination', data)

// Configuration RefNumberPlan EditDestination的编辑
export const EditDestinationEdit = async (data: AxiosConfig['data']) => AxiosPut('/config/ref-np-destination', data)

// Configuration  RefNumberPlan EditDestination的删除
export const EditDestinationDelete = async (data: AxiosConfig['data']) => AxiosDelete('/config/ref-np-destination/' + data)

// Configuration RefNumberPlan upload
export const EditDestinationUpload = async (data: AxiosConfig['data']) => Axios({ method: 'post', url: '/config/ref-destination/file', data: data, headers: { "Content-Type": "multipart/form-data" } })

// Configuration RefNumberPlan upload
export const EditCoutryUpload = async (data: AxiosConfig['data']) => Axios({ method: 'post', url: '/config/ref-country/file', data: data, headers: { "Content-Type": "multipart/form-data" } })

// Configuration countryWithCodes的下拉框
export const RefcountryWithCodes = async (data?: AxiosConfig['data']) => AxiosGet('/config/droplist/refNumberPlan/countryWithCodes', data, '')

// Configuration countryWithCodes的下拉框
export const RefcountryCodes = async (data?: AxiosConfig['data']) => AxiosGet('/config/droplist/refNumberPlan/countryCodes', data, '')

// Configuration countryWithCodes的下拉框
export const RefcountryWithCodesById = async (data?: AxiosConfig['data']) => AxiosGet('/config/droplist/referenceNumberPlan/countryWithCodesById', data, '')

// Configuration countryWithCodes的下拉框
export const countryWithCodesById = async (data?: AxiosConfig['data']) => AxiosGet('/config/droplist/vendorClientNumberPlan/countryWithCodesById',data,"")

// Configuration country的下拉框
export const Refcountry = async (data?: AxiosConfig['data']) => AxiosGet('/config/droplist/refNumberPlan/countries', data, '')

/**
 * Configuration  vendor-client-numberplan
 */
// Configuration vendor-client-numberplan 查询
export const getVendorClientNumberPlan = async (data: AxiosConfig['data']) => AxiosGet('/config/vendor-client-numberplan', data)

// Configuration vendor-client-numberplan 新增
export const addVendorClientNumberPlan = async (data: AxiosConfig['data']) => AxiosPost('/config/vendor-client-numberplan', data)

// Configuration vendor-client-numberplan 编辑
export const editVendorClientNumberPlan = async (data: AxiosConfig['data']) => AxiosPut('/config/vendor-client-numberplan', data)

// Configuration vendor-client-numberplan 删除
export const deleteVendorClientNumberPlan = async (data: AxiosConfig['data']) => AxiosDelete('/config/vendor-client-numberplan/' + data)


// Configuration vendor-client-numberplan destination 根据查询条件获取目的地信息
export const getVendorClientDestination = async (data?: AxiosConfig['data']) => AxiosGet('/config/vendor-client-np-destination', data)

// Configuration vendor-client-numberplan destination 新增vendor-client目的地
export const addVendorClientDestination = async (data?: AxiosConfig['data']) => AxiosPost('/config/vendor-client-np-destination', data)

// Configuration vendor-client-numberplan destination 更新vendor-client目的地
export const editVendorClientDestination = async (data?: AxiosConfig['data']) => AxiosPut('/config/vendor-client-np-destination', data)

// Configuration vendor-client-numberplan 根据id批量删除vendor-client目的地
export const deleteVendorClientDestination = async (ids?: AxiosConfig['data']) => AxiosDelete('/config/vendor-client-np-destination/' + ids)

// Configuration vendor-client-numberplan 模板文件上传
export const uploadVendorClientDestination = async (data?: AxiosConfig['data']) => Axios({ method: 'post', url: '/config/vendor-client-np-destination/file', data: data, headers: { "Content-Type": "multipart/form-data" } })

// Configuration vendor-client-numberplan country 查询
export const searchVendorClientCountries = async (data?: AxiosConfig['data']) => AxiosGet('/config/vendor-client-np-country', data)

// Configuration vendor-client-numberplan country 新增
export const addVendorClientCountries = async (data?: AxiosConfig['data']) => AxiosPost('/config/vendor-client-np-country', data)

// Configuration vendor-client-numberplan country 新增
export const editVendorClientCountries = async (data?: AxiosConfig['data']) => AxiosPut('/config/vendor-client-np-country', data)

// Configuration vendor-client-numberplan country 删除
export const deleteVendorClientCountries = async (ids?: AxiosConfig['data']) => AxiosDelete('/config/vendor-client-np-country/' + ids)

export const uploadVendorClientCountries = async (data?: AxiosConfig['data']) => AxiosPost('/config/vendor-client-np-country/file', data)



// 下拉框
// Configuration vendor-client-numberplan vendorClient拨号号码
export const getVendorClientDestDialedDigits = async (data?: AxiosConfig['data']) => AxiosGet('/config/droplist/vendorClientNpDestination/dialedDigits', data)

// Configuration vendor-client-numberplan 获取VendorClientNp目的地名称
export const getVendorClientDestNames = async (data?: AxiosConfig['data']) => AxiosGet('/config/droplist/vendorClientNpDestination/names', data)

// Configuration vendor-client-numberplan 获取VendorClient国家英文名称
export const getVendorClientCountries = async (data?: AxiosConfig['data']) => AxiosGet('/config/droplist/vendorClientNumberPlan/countries', data)

// Configuration vendor-client-numberplan 获取VendorClient国家代码
export const getVendorClientCountryCodes = async (data?: AxiosConfig['data']) => AxiosGet('/config/droplist/vendorClientNumberPlan/countryCodes', data)

// Configuration vendor-client-numberplan 获取国家英文名和国家代码
export const getVendorClientCountryWithCodes = async (data?: AxiosConfig['data']) => AxiosGet('/config/droplist/vendorClientNumberPlan/countryWithCodes', data)

// Configuration vendor-client-numberplan 获取所有VendorClientNumberPlanName
export const getVendorClientNumberPlanNames = async (data?: AxiosConfig['data']) => AxiosGet('/config/droplist/vendorClientNumberPlan/names', data)

// Configuration vendor-client-numberplan 获取所有 ClientName
export const ClientSourceList = async (data?: AxiosConfig['data']) => AxiosGet('/config/droplist/clientNames', data)






// Configuration RefTimeBand的搜索
export const RefTimeBands = async (data: AxiosConfig['data']) => AxiosGet('/config/ref-time-band', data)

// Configuration RefTimeBand的新增
export const RefTimeBandAdd = async (data: AxiosConfig['data']) => AxiosPost('/config/ref-time-band', data)

// Configuration RefTimeBand的编辑
export const RefTimeBandEdit = async (data: AxiosConfig['data']) => AxiosPut('/config/ref-time-band', data)

// Configuration  RefTimeBand的删除
export const RefTimeBandDelete = async (data: AxiosConfig['data']) => AxiosDelete('/config/ref-time-band/' + data)

// Configuration RefTimeBand的下拉框
export const RefTimeBandNames = async (data: AxiosConfig['data']) => AxiosGet('/config/droplist/refTimeBand/names', data)

// VendorSource 下拉数据 
export const VendorSourceList = async (data: AxiosConfig['data']) => AxiosGet('/config/droplist/vendorNames', data, '')
export const VendorSourceCompanies = async (data: AxiosConfig['data']) => AxiosGet('/config/droplist/companies', data, '')

// VendorSource 搜索
export const VendorSourceSearch = async (data: AxiosConfig['data']) => AxiosGet('/config/vendor-source', data, '')

// VendorSource Account 搜索
export const VendorSourceAccountSearch = async (data: AxiosConfig['data']) => AxiosGet('/config/accounts', data, '')

// VendorSource 增加
export const VendorSourceAdd = async (data: AxiosConfig['data']) => AxiosPost('/config/vendor-source', data, '')

// VendorSource 修改
export const VendorSourceEdit = async (data: AxiosConfig['data']) => AxiosPut('/config/vendor-source', data, '')

// VendorSource 删除
export const VendorSourceDelete = async (data: AxiosConfig['data']) => AxiosDelete('/config/vendor-source', data, '')

// RouteClass 下拉数据
export const RouteClassList = async (data: AxiosConfig['data']) => AxiosGet('/config/droplist/routeClass/names', data, '')

// RouteClass 搜索
export const RouteClassSearch = async (data: AxiosConfig['data']) => AxiosGet('/config/route-class', data, '')

// RouteClass 增加
export const RouteClassAdd = async (data: AxiosConfig['data']) => AxiosPost('/config/route-class', data, '')

// RouteClass 修改
export const RouteClassEdit = async (data: AxiosConfig['data']) => AxiosPut('/config/route-class', data, '')

// RouteProduct 搜索
export const RouteProductSearch = async (data: AxiosConfig['data']) => AxiosGet('/config/routeProducts', data, '')

// RouteProduct 增加
export const RouteProductAdd = async (data: AxiosConfig['data']) => AxiosPost('/config/routeProducts', data, '')

// RouteProduct 修改
export const RouteProductEdit = async (data: AxiosConfig['data']) => AxiosPut('/config/routeProducts', data, '')

// RouteProduct refTimeband 下拉值
export const RouteProductRefTimeband = async (data: AxiosConfig['data']) => AxiosGet('/config/droplist/routeProduct/refTimaBands', data, '')

// RouteProduct services
export const RouteProductService = async (data: AxiosConfig['data']) => AxiosGet('/config/services', data, '')

// RouteProduct refNpDestination
export const RouteProductRefNpDes = async (data?: AxiosConfig['data']) => AxiosGet('/config/droplist/refNpDestination/names', data, '')

// RouteProduct Destination 下拉值
export const RouteProductDestination = async (data: AxiosConfig['data']) => AxiosGet('/config/droplist/routeProduct/destinations', data, '')

// RouteProduct Name 下拉值
export const RouteProductName = async (data: AxiosConfig['data']) => AxiosGet('/config/droplist/routeProduct/names', data, '')

// RouteProductDestinations
export const RouteProductDestinationSearch = async (data?: AxiosConfig['data']) => AxiosGet('/config/ref-np-destination', data, '')

// RouteProductCategory 下拉值
export const RouteProductCategoryList = async (data: AxiosConfig['data']) => AxiosGet('/config/droplist/category/names', data, '')

// RouteProductCountries 下拉值
export const RouteProductCountriesList = async (data?: AxiosConfig['data']) => AxiosGet('/config/droplist/refNumberPlan/countries', data, '')

// DestinationCategory 搜索
export const DestinationCategorySearch = async (data: AxiosConfig['data']) => AxiosGet('/config/destination-category', data, '')

// DestinationCategory 添加
export const DestinationCategoryAdd = async (data: AxiosConfig['data']) => AxiosPost('/config/destination-category', data, '')

// DestinationCategory 修改
export const DestinationCategoryEdit = async (data: AxiosConfig['data']) => AxiosPut('/config/destination-category', data, '')

// DestinationCategory 下拉值
export const DestinationCategoryList = async (data: AxiosConfig['data']) => AxiosGet('/config/droplist/category/names', data, '')

// ClientSource 搜索
export const ClientSourceSearch = async (data: AxiosConfig['data']) => AxiosGet('/config/clientSources', data, '')

// ClientSource 新增
export const ClientSourceAdd = async (data: AxiosConfig['data']) => AxiosPost('/config/clientSources', data, '')

// ClientSource 修改
export const ClientSourceEdit = async (data: AxiosConfig['data']) => AxiosPut('/config/clientSources', data, '')

// ClientSource 下拉值
export const ClientSourceNameList = async (data?: AxiosConfig['data']) => AxiosGet('/config/droplist/clientSource/numberPlans', data, '')
export const ClientSourceNameListAdd = async (data?: AxiosConfig['data']) => AxiosGet('/config/droplist/clientSource/refNumberPlans', data, '')
export const ClientSourceSalesList = async (data: AxiosConfig['data']) => AxiosGet('/config/droplist/clientSource/sales', data, '')
export const ClientSourceQcomList = async (data: AxiosConfig['data']) => AxiosGet('/config/droplist/clientSource/qualityCommitments', data, '')
export const ClientSourceRefList = async (data: AxiosConfig['data']) => AxiosGet('/config/droplist/clientSource/referencePriceListss', data, '')

// ClientSourceNumberPlan 搜索
export const ClientSourceNumberPlanSearch = async (data: AxiosConfig['data']) => AxiosGet('/config/ref-number-plan', data, '')

// ClientSourceNumberPlan 下拉值
export const ClientSourceNumberPlanList = async (data: AxiosConfig['data']) => AxiosGet('/config/droplist/refNumberPlan/names', data, '')

// ClientSourceExclude 搜索
export const ClientSourceExcludeSearch = async (data: AxiosConfig['data']) => AxiosGet('/config/clientSources/getDestinations', data, '')

// ClientSourceExclude 国家
export const ClientSourceExcludeCountry = async (data: AxiosConfig['data']) => AxiosGet('/config/droplist/numberPlan/countries', data, '')

// ClientSourceExclude 国家代码
export const ClientSourceExcludeCountryCode = async (data?: AxiosConfig['data']) => AxiosGet('/config/droplist/refNumberPlan/countryCodes', data, '')

// ClientSourceExclude 拨号号码
export const ClientSourceExcludedialedDigits = async (data: AxiosConfig['data']) => AxiosGet('/config/droplist/referenceNumberPlan/countryWithCodesById', data, '')

// CommercialTrunk 搜索
export const CommercialTrunkSearch = async (data: AxiosConfig['data']) => AxiosGet('/config/commercialTrunks', data, '')

// CommercialTrunk 新增
export const CommercialTrunkAdd = async (data: AxiosConfig['data']) => AxiosPost('/config/commercialTrunks', data, '')

// CommercialTrunk 编辑
export const CommercialTrunkEdit = async (data: AxiosConfig['data']) => AxiosPut('/config/commercialTrunks', data, '')

// CommercialTrunk 下拉值
export const CommercialTrunkList = async (data: AxiosConfig['data']) => AxiosGet('/config/droplist/commercialTrunk/Allnames', data, '')

// TechnicalTrunk 搜索
export const TechnicalTrunkSearch = async (data: AxiosConfig['data']) => AxiosGet('/config/technicalTrunks', data, '')

// TechnicalTrunk 新增
export const TechnicalTrunkAdd = async (data: AxiosConfig['data']) => AxiosPost('/config/technicalTrunks', data, '')

// TechnicalTrunk 编辑
export const TechnicalTrunkEdit = async (data: AxiosConfig['data']) => AxiosPut('/config/technicalTrunks', data, '')

// TechnicalTrunk 下拉值
export const TechnicalTrunkList = async (data: AxiosConfig['data']) => AxiosGet('/config/droplist/tichnicalTrunk/allNames', data, '')

// TechnicalTrunkAccount 下拉值
export const TechnicalTrunkAccList = async (data: AxiosConfig['data']) => AxiosGet('/config/droplist/allAcconuts', data, '')



/**公参 numberPlan */
// numberPlan 搜索
export const VcNumberPlanTableSearch = async (data: AxiosConfig['data']) => AxiosGet('/config/vc-number-plan', data)
//numberPlan Edit 获取需修改的数据
export const VcNumberPlanEditor = async (data: AxiosConfig['data']) => AxiosGet('/config/vc-number-plan/editor/' + data)
// numberPlan 新增合同所有数据
export const VcNumberPlanSave = async (data: AxiosConfig['data']) => AxiosPost('/config/vc-number-plan', data)
//numberplan edit 保存数据
export const VcNumberPlanEditSave = async (data: AxiosConfig['data']) => AxiosPut('/config/vc-number-plan', data)
//numberplan 删除数据
export const VcNumberPlanDelete = async (data: AxiosConfig['data']) => AxiosDelete('/config/vc-number-plan/' + data)
/***********
 * 财务模块接口
 * *************/
// /config/droplist/finance/cycles 下拉框数据
export const getFinanceCycles = async (data?: AxiosConfig['data']) => AxiosGet('/config/droplist/finance/cycles', data)

// /config/droplist/finance/destinations  下拉数据
export const getFinanceDestinations = async (data?: AxiosConfig['data']) => AxiosGet('/config/droplist/finance/destinations', data)




// Finance Adjustment cndn 查询
export const AdjustmentCndnSearch = async (data: AxiosConfig['data']) => AxiosGet('/finance/adjustment/cndn', data)

// Finance Adjustment cndn add 新增
export const AdjustmentCndnAdd = async (data: AxiosConfig['data']) => AxiosPost('/finance/adjustment/cndn', data)

// Finance Adjustment cndn Edit 编辑
export const AdjustmentCndnEdit = async (data: AxiosConfig['data']) => AxiosPut('/finance/adjustment/cndn', data)

// Finance Adjustment record search 查询
export const AdjustmentRecordSearch = async (data: AxiosConfig['data']) => AxiosGet('/finance/adjustment/record', data)

// Finance Adjustment record audit 
export const AdjustmentRecordAudit = async (data: AxiosConfig['data']) => AxiosPatch('/finance/adjustment/record/audit', data)

// Finance Adjustment record submit
export const AdjustmentRecordSubmit = async (data: AxiosConfig['data']) => AxiosPatch('/finance/adjustment/record/submit', data)

// Finance Adjustment cndn upload
export const AdjustmentCndnUpload = async (data: AxiosConfig['data']) => Axios({ method: 'post', url: '/finance/adjustment/upload', data: data, headers: { "Content-Type": "multipart/form-data" } })

//Finance Adjustment cndn Download System
//export const AdjustmentRecordDownloadSystem = async (data: AxiosConfig['data']) => AxiosPost('/finance/adjustment/systemDownload', data)
export const AdjustmentRecordDownloadSystem = async (data: AxiosConfig['data']) => Axios({
  url: '/finance/adjustment/systemDownload',
  data: data,
  responseType: 'blob',
  method: 'post'
})
//Finance Adjustment cndn Export
export const AdjustmentCndnExport = async (data: AxiosConfig['data']) => Axios({
  url: '/finance/adjustment/cndn_export',
  data: data,
  responseType: 'blob',
  method: 'post'
})

//Finance Adjustment Record Export
export const AdjustmentRecordExport = async (data: AxiosConfig['data']) => Axios({
  url: '/finance/adjustment/record_export',
  data: data,
  responseType: 'blob',
  method: 'post'
})

// Finance netting record search
export const nettingRecordSearch = async (data: AxiosConfig['data']) => AxiosGet('/finance/netting/record', data)

// Finance Netting Statement Search 查询
export const NettingStatementSearch = async (data: AxiosConfig['data']) => AxiosGet('/finance/netting/statement', data)

// Finance Netting Statement Add 录入
export const NettingStatementAdd = async (data: AxiosConfig['data']) => AxiosPost('/finance/netting/statement', data)

//Finance netting record 编辑
export const NettingStatementEdit = async (data: AxiosConfig['data']) => AxiosPut('/finance/netting/record', data)

//Finance netting record 审批
export const NettingStatementAuditing = async (data: AxiosConfig['data']) => AxiosPatch('/finance/netting/record/auditing', data)

//Finance netting record 提交
export const NettingStatementSubmit = async (data: AxiosConfig['data']) => AxiosPatch('/finance/netting/record/submission', data)

//Finance Reconciliation data-enty Search
export const ReconciliationDataEntySearch = async (data: AxiosConfig['data']) => AxiosGet('/finance/reconciliation/dataEntry', data)

//Finance Reconciliation data-enty Add
export const ReconciliationDataEntyAdd = async (data: AxiosConfig['data']) => AxiosPost('/finance/reconciliation/dataEntry', data)

//Finance Reconciliation data-enty Edit
export const ReconciliationDataEntyEdit = async (data: AxiosConfig['data']) => AxiosPut('/finance/reconciliation/dataEntry', data)

//Finance Reconciliation data-enty 获取destination inbound
export const confirmationDestInbound = async (data: AxiosConfig['data']) => AxiosGet('/finance/reconciliation/dataConfirmation/getInboundDest', data)

//Finance Reconciliation data-enty 获取destination outbound
export const confirmationDestOutbound = async (data: AxiosConfig['data']) => AxiosGet('/finance/reconciliation/dataConfirmation/getOutboundDest', data)

//Finance Adjustment Record Export
export const ReconciliationDataEntyExport = async (data: AxiosConfig['data']) => Axios({
  url: '/finance/reconciliation/dataEntry_export',
  data: data,
  responseType: 'blob',
  method: 'post'
})

//Finance Reconciliation data-comfirmation Search
export const ReconciliationDataComfirmationSearch = async (data: AxiosConfig['data']) => AxiosGet('/finance/reconciliation/dataConfirmation', data)

//Finance Reconciliation data-comfirmation Add
export const ReconciliationDataComfirmationAdd = async (data: AxiosConfig['data']) => AxiosPost('/finance/reconciliation/dataConfirmation', data)

//Finance Reconciliation data-comfirmation Edit
export const ReconciliationDataComfirmationEdit = async (data: AxiosConfig['data']) => AxiosPut('/finance/reconciliation/dataConfirmation', data)

//Finance Reconciliation data-comfirmation Details
export const ReconciliationDataComfirmationDetails = async (data: AxiosConfig['data']) => AxiosGet('/finance/reconciliation/dataConfirmation/details', data)

//Finance Reconciliation data-comfirmation Anti compare
export const ReconciliationDataComfirmationCompare = async (data: AxiosConfig['data']) => AxiosGet('/finance/reconciliation/dataConfirmation/compare', data)

//Finance Reconciliation data-comfirmation Inbound-Destination
export const ReconciliationDataComfirmationInboundDestination = async (data: AxiosConfig['data']) => AxiosGet('/finance/reconciliation/dataConfirmation/getInboundDest', data)

//Finance Reconciliation data-comfirmation Outbound-Destination
export const ReconciliationDataComfirmationOutboundDestination = async (data: AxiosConfig['data']) => AxiosGet('/finance/reconciliation/dataConfirmation/getOutboundDest', data)

// trade 交易 模块

/* trade 交易 模块 上表格 下拉框  */
//Destination 下拉列表
export const vendorClientNpDestination = (data?: AxiosConfig['data']) => AxiosGet('/config/droplist/vendorClientNpDestination/names', data)
//Country 下拉列表
export const vendorClientNumberPlan = (data?: AxiosConfig['data']) => AxiosGet('/config/droplist/vendorClientNumberPlan/countries', data)

// 查询buy rate
export const getBuyRates = (data: AxiosConfig['data']) => AxiosGet('/trade/buy-rates', data)
export const getBuyRateExcel = (data: AxiosConfig['data']) => Axios({
  url: '/trade/buy-rates/exportor',
  data: data,
  responseType: 'blob',
  method: 'post'
})
// 查询floor buy rate
export const getFloorBuyRates = (data: AxiosConfig['data']) => AxiosGet('/trade/floor-buy-rates', data)
export const getFloorBuyRateExcel = (data: AxiosConfig['data']) => Axios({
  url: '/trade/floor-buy-rates/exportor',
  data: data,
  responseType: 'blob',
  method: 'post'
})
// Sell price
export const getSellPrice = (data: AxiosConfig['data']) => AxiosGet('/trade/sell-prices', data)
export const getSellExcel = (data: AxiosConfig['data']) => Axios({
  url: '/trade/sell-prices/exportor',
  data: data,
  responseType: 'blob',
  method: 'post'
})
// 获取RefNp目的地名称
export const getRefInDestinationName = (data?: AxiosConfig['data']) => AxiosGet('/config/droplist/refNpDestination/names', data)
export const getCountryName = (data?: AxiosConfig['data']) => AxiosGet('/config/droplist/refNumberPlan/countries', data)

/* Floor reference price */
export const getFloorRefPrice = async (data?: AxiosConfig['data']) => AxiosGet('/trade/floor-ref-prices', data)
export const getRefPriceExcel = (data: AxiosConfig['data']) => Axios({
  url: '/trade/floor-ref-prices/exportor',
  data: data,
  responseType: 'blob',
  method: 'post'
})
// Floor sell price
export const getFloorSellPrice = (data: AxiosConfig['data']) => AxiosGet('/trade/floor-sell-prices', data)
export const getFloorSellPriceExcel = (data: AxiosConfig['data']) => Axios({
  url: '/trade/floor-sell-prices/exportor',
  data: data,
  responseType: 'blob',
  method: 'post'
})

