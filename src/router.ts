import Vue from "vue";
import Router from "vue-router";
const Home = (resolve: any) => require(["@/components/index.vue"], resolve);
Vue.use(Router);

export default new Router({
  mode: process.env.NODE_ENV !== "production" ? "history" : "hash",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      redirect: "/Home/index"
    },

    {
      path: "",
      component: Home,
      children: [
        {
          name: "Home",
          path: "/Home/index",
          component: () => import("@/views/Home/index.vue")
        }
      ]
    },
    {
      path: "/Home",
      component: Home,
      children: [
        {
          name: "VcContract",
          path: "/Home/Contract/VcContract",
          meta: {
            module: "Contract"
          },
          component: resolve =>
            require(["@/views/Contract/VcContract.vue"], resolve)
        },
        {
          name: "product",
          path: "/Home/Contract/Vcinformation/product",
          meta: {
            module: "Contract"
          },
          component: resolve =>
            require(["@/views/Contract/Vcinformation/product.vue"], resolve)
        },
        {
          name: "Service",
          path: "/Home/Contract/Vcinformation/Service",
          meta: {
            module: "Contract"
          },
          component: resolve =>
            require(["@/views/Contract/Vcinformation/Service.vue"], resolve)
        },
        {
          name: "Cycle",
          path: "/Home/Contract/Vcinformation/Cycle",
          meta: {
            module: "Contract"
          },
          component: resolve =>
            require(["@/views/Contract/Vcinformation/Cycle.vue"], resolve)
        },
        {
          name: "Rateplan",
          path: "/Home/Contract/Vcinformation/Rateplan",
          meta: {
            module: "Contract"
          },
          component: resolve =>
            require(["@/views/Contract/Vcinformation/Rateplan.vue"], resolve)
        },
        {
          name: "ContractDetails",
          path: "/Home/Contract/Vcinformation/ContractDetails",
          meta: {
            module: "Contract"
          },
          component: resolve =>
            require([
              "@/views/Contract/Vcinformation/ContractDetails.vue"
            ], resolve)
        },
        {
          name: "Account",
          path: "/Home/Configuration/account",
          meta: {
            module: "Configuration"
          },
          component: resolve =>
            require(["@/views/Configuration/account.vue"], resolve)
        },
        {
          name: "Company",
          path: "/Home/Configuration/company",
          meta: {
            module: "Configuration"
          },
          component: resolve =>
            require(["@/views/Configuration/company.vue"], resolve)
        },
        {
          name: "NumberPlan",
          path: "/Home/Configuration/NumberPlan/vcnumberplan",
          meta: {
            module: "Configuration"
          },
          component: resolve =>
            require([
              "@/views/Configuration/NumberPlan/vcnumberplan.vue"
            ], resolve)
        },
        {
          name: "refnumberplan",
          path: "/Home/Configuration/NumberPlan/refnumberplan",
          meta: {
            module: "Configuration"
          },
          component: resolve =>
            require([
              "@/views/Configuration/refnumberplan/refnumberplan.vue"
            ], resolve)
        },
        {
          name: "VendorClientNumberPlan",
          path: "/Home/Configuration/NumberPlan/VendorClientNumberPlan",
          meta: {
            module: "Configuration"
          },
          component: () =>
            import("@/views/Configuration/VendorClientNumberPlan/index.vue")
        },
        {
          name: 'Quality Commitment',
          path: '/Home/Configuration/Qualitycommitmentmanagement/Qualitycommitmentmanagement',
          meta: {
            module: 'Configuration',
          },
          component: resolve => require(["@/views/Configuration/Qualitycommitmentmanagement/Qualitycommitmentmanagement.vue"], resolve)
        },
        {
          name: "VC Time Band",
          path: "/Home/Configuration/VcTimeBand/VcTimeBand",
          meta: {
            module: "Configuration"
          },
          component: resolve =>
            require([
              "@/views/Configuration/VcTimeBand/VcTimeBand.vue"
            ], resolve)
        },
        {
          name: "Ref Time Band",
          path: "/Home/Configuration/RefTimeBand/RefTimeBand",
          meta: {
            module: "Configuration"
          },
          component: resolve =>
            require([
              "@/views/Configuration/RefTimeBand/RefTimeBand.vue"
            ], resolve)
        },
        {
          name: "Configuration-Service",
          path: "/Home/Configuration/Service",
          meta: {
            module: "Configuration"
          },
          component: resolve =>
            require(["@/views/Configuration/Service.vue"], resolve)
        },
        {
          name: "Country Code",
          path: "/Home/Configuration/CountryCode",
          meta: {
            module: "Configuration"
          },
          component: resolve =>
            require(["@/views/Configuration/CountryCode.vue"], resolve)
        },
        {
          name: "Exchange Rate",
          path: "/Home/Configuration/ExchangeRate/ExchangeRate",
          meta: {
            module: "Configuration"
          },
          component: resolve =>
            require([
              "@/views/Configuration/ExchangeRate/ExchangeRate.vue"
            ], resolve)
        },
        {
          name: "Currency",
          path: "/Home/Configuration/ExchangeRate/Currency/Currency",
          meta: {
            module: "Configuration"
          },
          component: resolve =>
            require([
              "@/views/Configuration/ExchangeRate/Currency/Currency.vue"
            ], resolve)
        },
        {
          name: "VC Rounding rules",
          path: "/Home/Configuration/VcRoundingRules/VcRoundingRules",
          meta: {
            module: "Configuration"
          },
          component: resolve =>
            require([
              "@/views/Configuration/VcRoundingRules/VcRoundingRules.vue"
            ], resolve)
        },
        {
          name: "Ref Rounding rules",
          path: "/Home/Configuration/RefRoundingRules/RefRoundingRules",
          meta: {
            module: "Configuration"
          },
          component: resolve =>
            require([
              "@/views/Configuration/RefRoundingRules/RefRoundingRules.vue"
            ], resolve)
        },
        {
          name: "Vendor Source",
          path: "/Home/Configuration/VendorSource/VendorSource",
          meta: {
            module: "Configuration"
          },
          component: resolve =>
            require([
              "@/views/Configuration/VendorSource/VendorSource.vue"
            ], resolve)
        },
        {
          name: "Route Class",
          path: "/Home/Configuration/RouteClass/RouteClass",
          meta: {
            module: "Configuration"
          },
          component: resolve =>
            require([
              "@/views/Configuration/RouteClass/RouteClass.vue"
            ], resolve)
        },
        {
          name: "Route Product",
          path: "/Home/Configuration/RouteProduct/RouteProduct",
          meta: {
            module: "Configuration"
          },
          component: resolve =>
            require([
              "@/views/Configuration/RouteProduct/RouteProduct.vue"
            ], resolve)
        },
        {
          name: "Destination Category",
          path: "/Home/Configuration/DestinationCategory/DestinationCategory",
          meta: {
            module: "Configuration"
          },
          component: resolve =>
            require([
              "@/views/Configuration/DestinationCategory/DestinationCategory.vue"
            ], resolve)
        },
        {
          name: "Client Source",
          path: "/Home/Configuration/ClientSource/ClientSource",
          meta: {
            module: "Configuration"
          },
          component: resolve =>
            require([
              "@/views/Configuration/ClientSource/ClientSource.vue"
            ], resolve)
        },
        {
          name: "Technical Trunk",
          path: "/Home/Configuration/TechnicalTrunk/TechnicalTrunk",
          meta: {
            module: "Configuration"
          },
          component: resolve =>
            require([
              "@/views/Configuration/TechnicalTrunk/TechnicalTrunk.vue"
            ], resolve)
        },
        {
          name: "Commercial Trunk",
          path: "/Home/Configuration/CommercialTrunk/CommercialTrunk",
          meta: {
            module: "Configuration"
          },
          component: resolve =>
            require([
              "@/views/Configuration/CommercialTrunk/CommercialTrunk.vue"
            ], resolve)
        },
        {
          name: "Monthly",
          path: "/Home/Finance/Statement/Monthly",
          meta: {
            module: "Finance"
          },
          component: () => import("@/views/Finance/Statement/monthly/index.vue")
        },
        {
          name: "General",
          path: "/Home/Finance/Statement/General",
          meta: {
            module: "Finance"
          },
          component: () => import("@/views/Finance/Statement/general/index.vue")
        },
        {
          name: "Status",
          path: "/Home/Finance/Statement/Status",
          meta: {
            module: "Finance"
          },
          component: () => import("@/views/Finance/Statement/status/index.vue")
        },
        {
          name: "Data-entry",
          path: "/Home/Finance/Reconciliation/Data-entry",
          meta: {
            module: "Finance"
          },
          component: () =>
            import("@/views/Finance/Reconciliation/data-entry/index.vue")
        },
        {
          name: "Data-confirmation",
          path: "/Home/Finance/Reconciliation/Data-confirmation",
          meta: {
            module: "Finance"
          },
          component: () =>
            import("@/views/Finance/Reconciliation/data-confirmation/index.vue")
        },
        {
          name: "Netting-Record",
          path: "/Home/Finance/Netting/Record",
          meta: {
            module: "Finance"
          },
          component: () => import("@/views/Finance/Netting/record/index.vue")
        },
        {
          name: "Netting-Statement",
          path: "/Home/Finance/Netting/Statement",
          meta: {
            module: "Finance"
          },
          component: () => import("@/views/Finance/Netting/statement/index.vue")
        },

        {
          name: "Adjustment-cn_dn",
          path: "/Home/Finance/Adjustment/CN/DN",
          meta: {
            module: "Finance"
          },
          component: () => import("@/views/Finance/Adjustment/cn_dn/index.vue")
        },
        {
          name: "Adjustment-Record",
          path: "/Home/Finance/Adjustment/Record",
          meta: {
            module: "Finance"
          },
          component: () => import("@/views/Finance/Adjustment/record/index.vue")
        },
        {
          name: "Adjustment-Rerating",
          path: "/Home/Finance/Adjustment/Rerating",
          meta: {
            module: "Finance"
          },
          component: () =>
            import("@/views/Finance/Adjustment/rerating/index.vue")
        },
        {
          name: "overview",
          path: "/Home/routing/overview",
          meta: {
            module: "Routing management"
          },
          component: () => import("@/views/Router/OverView/OverView.vue")
        },
        {
          name: "Commercial",
          path: "/Home/routing/Commercial/:addData",
          meta: {
            module: "Routing management"
          },
          component: () => import("@/views/Router/Commercial/Commercial.vue")
        },
        {
          name: "ShowBenchmark",
          path: "/Home/routing/ShowBenchmark",
          meta: {
            module: "Routing management"
          },
          component: () => import("@/views/Router/Commercial/ShowBenchmark.vue")
        },
        {
          name: "TrackCommercial",
          path: "/Home/routing/TrackCommercial",
          meta: {
            module: "Routing management"
          },
          component: () =>
            import("@/views/Router/TrackCommercial/TrackCommercial.vue")
        },
        {
          name: "CommercialRoute",
          path: "/Home/routing/CommercialRouteDetails",
          meta: {
            module: "Routing management"
          },
          component: () =>
            import(
              "@/views/Router/TrackCommercial/Commercial/CommercialRoute.vue"
            )
        },
        {
          name: "CommercialTrunk",
          path: "/Home/routing/CommercialTrunk",
          meta: {
            module: "Routing management"
          },
          component: () =>
            import(
              "@/views/Router/TrackCommercial/Commercial/CommercialTrunk.vue"
            )
        },
        {
          name: "ManagementTechnical",
          path: "/Home/routing/ManagementTechnical",
          meta: {
            module: "Routing management"
          },
          component: () =>
            import("@/views/Router/ManagementTechnical/ManagementTechnical.vue")
        },
        {
          name: "TechnicaTrunk",
          path: "/Home/routing/TechnicalTrunkConnection",
          meta: {
            module: "Routing management"
          },
          component: () =>
            import(
              "@/views/Router/ManagementTechnical/SwitchOrTechnical/TechnicalTrunk.vue"
            )
        },
        {
          name: "SwitchConfiguration",
          path: "/Home/routing/SwitchConfiguration",
          meta: {
            module: "Routing management"
          },
          component: () =>
            import(
              "@/views/Router/ManagementTechnical/SwitchOrTechnical/SwitchConfiguration.vue"
            )
        },
        {
          name: "ManagementInclusion",
          path: "/Home/routing/ManagementInclusion",
          meta: {
            module: "Routing management"
          },
          component: () =>
            import("@/views/Router/ManagementInclusion/ManagementInclusion.vue")
        },
        {
          name: "ManagementExclusion",
          path: "/Home/routing/ManagementExclusion",
          meta: {
            module: "Routing management"
          },
          component: () =>
            import("@/views/Router/ManagementExclusion/ManagementExclusion.vue")
        },
        {
          name: "RouteClass",
          path: "/Home/routing/RouteClass",
          meta: {
            module: "Routing management"
          },
          component: () =>
            import("@/views/Router/RouteClassBenchmark/RouteClass.vue")
        },
        {
          name: "RoutingProduct",
          path: "/Home/routing/RoutingProduct",
          meta: {
            module: "Routing management"
          },
          component: () =>
            import("@/views/Router/RoutingProduct/RoutingProduct.vue")
        },
        {
          name: "Switch",
          path: "/Home/routing/Switch",
          meta: {
            module: "Routing management"
          },
          component: () => import("@/views/Router/SwitchBenchmark/Switch.vue")
        },
        {
          name: "buyRate",
          path: "/Home/Trade/buyRate",
          meta: {
            module: "Trade"
          },
          component: () => import("@/views/Trade/buyRate/index.vue")
        },
        {
          name: "floorBuyRate",
          path: "/Home/Trade/floorBuyRate",
          meta: {
            module: "Trade"
          },
          component: () => import("@/views/Trade/floorBuyRate/index.vue")
        },
        {
          name: "floorSellPrice",
          path: "/Home/Trade/floorSellPrice",
          meta: {
            module: "Trade"
          },
          component: () => import("@/views/Trade/floorSellPrice/index.vue")
        },
        {
          name: "sellPrice",
          path: "/Home/Trade/sellPrice",
          meta: {
            module: "Trade"
          },
          component: () => import("@/views/Trade/sellPrice/index.vue")
        },
        {
          name: "floorReferencePrice",
          path: "/Home/Trade/floorReferencePrice",
          meta: {
            module: "Trade"
          },
          component: () => import("@/views/Trade/floorReferencePrice/index.vue")
        },
        {
          path: "/*",
          name: "404",
          meta: {
            module: "404"
          },
          component: resolve => require(["@/common/404.vue"], resolve)
        }
      ]
    }
  ]
});
