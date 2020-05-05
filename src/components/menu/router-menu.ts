
import { icons } from './icon.url'
export const route: any[] = [
  {
    name: 'Home',
    url: '/Home/index',
    icon: 'home',
  },
  {
    name: 'Contract',
    icon: 'book',
    url: '',
    src:icons.contractIcon,
    subMenu: [
      {
        name: 'Vc Contract',
        url: '/Home/Contract/VcContract',
      },
      {
        name: 'Vc information',
        icon: '',
        options: [
          { name: 'Contract Details', url: '/Home/Contract/Vcinformation/ContractDetails' },
          {
            name: 'Service',
            url: '/Home/Contract/Vcinformation/Service',
          },
          { name: 'Cycle', url: '/Home/Contract/Vcinformation/Cycle' },
          { name: 'Rate plan', url: '/Home/Contract/Vcinformation/Rateplan' },
          { name: 'Product', url: '/Home/Contract/Vcinformation/product' },
        ],
      },
    ],
  },
  {
    name: 'Configuration',
    icon: 'book',
    url: '',
    src:icons.configationIcon,
    subMenu: [
      {
        name: 'Account',
        icon: '',
        url: '/Home/Configuration/Account',
      },
      {
        name: 'Company',
        icon: '',
        url: '/Home/Configuration/company',
      },
      {
        name: 'Service',
        icon: '',
        url: '/Home/Configuration/Service',
      },
      {
        name: 'VC Rounding rules',
        icon: '',
        url: '/Home/Configuration/VcRoundingRules/VcRoundingRules',
      },
      {
        name: 'VC Time Band',
        icon: '',
        url: '/Home/Configuration/VcTimeBand/VcTimeBand',
      },
      {
        name: 'Reference Rounding rules',
        icon: '',
        url: '/Home/Configuration/RefRoundingRules/RefRoundingRules',
      },
      {
        name: 'Quality Commitment',
        icon: '',
        url: '/Home/Configuration/Qualitycommitmentmanagement/Qualitycommitmentmanagement',
      },
      {
        name: 'Vendor Source',
        icon: '',
        url: '/Home/Configuration/VendorSource/VendorSource',
      },
      {
        name: 'Route Class',
        icon: '',
        url: '/Home/Configuration/RouteClass/RouteClass',
      },
      {
        name: 'Route Product',
        icon: '',
        url: '/Home/Configuration/RouteProduct/RouteProduct',
      },
      {
        name: 'Destination Category',
        icon: '',
        url: '/Home/Configuration/DestinationCategory/DestinationCategory',
      },
      {
        name: 'Client Source',
        icon: '',
        url: '/Home/Configuration/ClientSource/ClientSource',
      },
      {
        name: 'Technical Trunk',
        icon: '',
        url: '/Home/Configuration/TechnicalTrunk/TechnicalTrunk'
      },
      {
        name: 'Commercial Trunk',
        icon: '',
        url: '/Home/Configuration/CommercialTrunk/CommercialTrunk'
      },
      {
        name: 'Reference Time Band',
        icon: '',
        url: '/Home/Configuration/RefTimeBand/RefTimeBand',
      },
      {
        name: 'Exchange Rate',
        icon: '',
        options: [
          { name: 'Currency', url: '/Home/Configuration/ExchangeRate/Currency/Currency' },
          { name: 'Exchange Rate', url: '/Home/Configuration/ExchangeRate/ExchangeRate' },
        ],
      },
      {
        name: 'Country Code',
        icon: '',
        url: '/Home/Configuration/CountryCode',
      },
      {
        name: 'Number Plan',
        icon: '',
        options: [
          { name: 'VC Number Plan ', url: '/Home/Configuration/NumberPlan/vcnumberplan' },
          { name: 'Reference Number Plan ', url: '/Home/Configuration/NumberPlan/refnumberplan' },
          { name: 'Vendor/Client Number Plan', url: '/Home/Configuration/NumberPlan/VendorClientNumberPlan' },
        ],
      },
    ],
  },
  {
    name: 'Finance',
    icon: 'book',
    url: '',
    src:icons.financeIcon,
    subMenu: [
      {
        name: 'Statement',
        icon: '',
        options: [
          { name: 'Monthly', url: '/Home/Finance/Statement/Monthly' },
          { name: 'General', url: '/Home/Finance/Statement/General' },
          { name: 'Status', url: '/Home/Finance/Statement/Status' },
        ],
      },
      {
        name: 'Reconciliation',
        icon: '',
        options: [
          { name: 'Data-entry', url: '/Home/Finance/Reconciliation/Data-entry' },
          { name: 'Data-confirmation', url: '/Home/Finance/Reconciliation/Data-confirmation' },
        ],
      },
      {
        name: 'Netting',
        icon: '',
        options: [
          { name: 'Statement ', url: '/Home/Finance/Netting/Statement' },
          { name: 'Record', url: '/Home/Finance/Netting/Record' },
        ],
      },
      {
        name: 'Adjustment',
        icon: '',
        options: [
          { name: 'CN/DN', url: '/Home/Finance/Adjustment/CN/DN' },
          { name: 'Rerating', url: '/Home/Finance/Adjustment/Rerating' },
          { name: 'Record ', url: '/Home/Finance/Adjustment/Record' },
        ],
      },
    ],
  },
  {
    name: 'Routing management',
    icon: 'book',
    url: '',
    src:icons.routeIcon,
    subMenu: [
      {
        name: 'Overview of current routing',
        icon: '',
        url: '/Home/routing/overview',
      },
      {
        name: 'Commercial route suggestion',
        icon: '',
        url: '/Home/routing/Commercial/1',
      },
      {
        name: 'Commercial accepted route',
        icon: '',
        url: '/Home/routing/TrackCommercial',
      },
      {
        name: 'Technical routing order',
        icon: '',
        url: '/Home/routing/ManagementTechnical',
      },
      {
        name: 'Management of Inclusion',
        icon: '',
        url: '/Home/routing/ManagementInclusion',
      },
      {
        name: 'Management of Exclusion',
        icon: '',
        url: '/Home/routing/ManagementExclusion',
      },
      {
        name: 'Route class Benchmark',
        icon: '',
        url: '/Home/routing/RouteClass',
      },
      {
        name: 'Routing Product Benchmark',
        icon: '',
        url: '/Home/routing/RoutingProduct',
      }
    ],
  },
  {
    name: 'Trade',
    icon: 'book',
    url: '',
    src:icons.tradeIcon,
    subMenu: [
      {
        name: 'Buy rate',
        icon: '',
        url: '/Home/Trade/buyRate',
      },
      {
        name: 'Floor buy rate',
        icon: '',
        url: '/Home/Trade/floorBuyRate',
      },
      {
        name: 'Sell price',
        icon: '',
        url: '/Home/Trade/sellPrice',
      },
      {
        name: 'Floor sell price',
        icon: '',
        url: '/Home/Trade/floorSellPrice',
      },
      {
        name: 'Floor reference price',
        icon: '',
        url: '/Home/Trade/floorReferencePrice',
      },
    ],
  },
]
