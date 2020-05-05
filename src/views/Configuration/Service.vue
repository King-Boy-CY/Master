<template>
  <div>
    <!-- 高级搜索 -->
    <Advanced-search
      :formoptions="formOptions"
      :isChildName="true"
      allowClear
      @Submit="SearchOk"
      :data="contractDatas"
      childDataKey="contractfoVOList"
    />
    <!-- 操作栏 -->
    <!-- 表格 -->
    <Table
       parentKey="id"
      :isFinance="true"
      :isNeedCheck="true"
      :selectedBtn="Formscreening"
      @onSelectClick="activeClick"
      :columns="columns"
      :data="data"
      zebraStripe
    />
    <!-- Details 模态弹出框 -->
    <Model
      title="VC Informantion"
      v-if="activeIndex === 6 && visible"
      v-model="visible"
      @Screencover="Screencover"
    >
      <template slot="model-body">
        <detail-s :detailResMsg="detailResMsg" :productName="productName"></detail-s>
      </template>
      <template slot="model-footer">
        <a-row>
          <a-col :span="24" :style="{ textAlign: 'center' }" @click="handlesaveAll">
            <div style="margin-top:10px;">
              <a-button
                :style="{ marginLeft: '8px', color: '#1890ff', borderRadius: '50px 50px 50px 50px', border: '1px solid #1890ff', fontWeight: '600' }"
                @click="handleReruen"
              >Return</a-button>
            </div>
          </a-col>
        </a-row>
      </template>
    </Model>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { State, Mutation } from "vuex-class";
import { AxiosGet } from "@/api/axios";
// import { AxiosPut } from "../../api/axios";

@Component({
  components: {
    AdvancedSearch: resolve =>
      require(["@/common/Advancedsearch/index.vue"], resolve),
    // Table: resolve => require(["@/common/Table/index.vue"], resolve),
    // pagination: resolve => require(["@/common/pagination/index.vue"], resolve),s
    Model: resolve => require(["@/common/Model/index.vue"], resolve),
    detailS: resolve =>
      require(["@/components/formscReening/details/index.vue"], resolve),
    Table: () => import("@/views/Finance/components/Table/index.vue")
  }
})
export default class Company extends Vue {
  @State("productRatingZoneList") private productRatingZoneList?: any;
  @State("ratePlanObject") private ratePlanObject: any;
  @State("contractData") private contractData: any;
  @State("productForm") private productForm: any;
  @State("detailsId") detailsId: any;
  @Mutation("mutionDetailsId") mutionDetailsId: any;
  private values = {};
  private activeIndex: number = 0;
  private listBar: any[] = [
    {
      name: "Contract Details",
      cName: "contractDetials"
    },
    {
      name: "Service",
      cName: "service"
    },
    {
      name: "Cycle",
      cName: "cycle"
    },
    {
      name: "Rate plan",
      cName: "ratePlan"
    },
    // {
    //   name: "Number plan",
    //   cName: "numberPlan"
    // },
    {
      name: "Product",
      cName: "product"
    }
  ];
  private onSelectClick(activeObJ: any, selected: any, selectedData: any) {
    console.log(activeObJ);
    console.log(selected);
    console.log(selectedData);
  }
  private activeIn: number = 0;
  private detailResMsg: any; // Detail 页面接口数据
  private productName: any; //product 页面数据
  private activeSelect: string = "CompanyCom";
  private activeSelectEdit: string = "CompanyEdit";
  public columns: any[] = [
    {
      title: "Service",
      dataIndex: "serviceName",
      key: "serviceName"
    },
    {
      title: "Type",
      dataIndex: "serviceType",
      key: "serviceType"
    },
    {
      title: "Created date",
      dataIndex: "createdTime",
      key: "createdTime"
    },
    {
      title: "Created by",
      dataIndex: "createdBy",
      key: "createdBy"
    },
    {
      title: "Modified by",
      dataIndex: "modifiedBy",
      key: "modifiedBy"
    },
    {
      title: "Last modified",
      dataIndex: "lastModified",
      key: "lastModified"
    }
  ];
  private contractDatas: any[] = [];
  public data: any[] = [];
  private formOptions: any[] = [
    {
      Tips: "Service",
      required: false,
      name: "serviceName",
      type: "select",
      span: 12,
      colSpan: 4,
      options: null
    },
    {
      Tips: "Type",
      required: false,
      name: "serviceType",
      type: "select",
      span: 12,
      colSpan: 4,
      options:[{
        name: 'Real',
        value: 1
      }, {
        name: 'virtual',
        value: 2
      }]
      
    }
  ];
  public active(tab: any, item: any) {
    this.activeIn = tab;
    this.activeSelect = item;
  }
  private Formscreening: any[] = [
    {
      name: "Export",
      icon: "export",
      index: 1
    }
  ];
  /* 点击切换页 分页(pagination) -> 回调 */
  public onChang(pageSize: number) {
    // console.log(pageSize)
  }
  
  /* 操作栏点击 -> 回调 */
  public SearchOk(values: any): void {
    let serviceType: string[] = ['Real', 'virtual']
    let data: any = {
      params: Object.assign({}, values, {})
    };
    AxiosGet("/config/services", data).then((res: any) => {
      this.data = res.data;
      for(let key in res.data){
        // console.log('这里',res.data[key].serviceType)
        if(res.data[key].serviceType == 1){
            res.data[key].serviceType = serviceType[0]
        }
        if(res.data[key].serviceType == 2){
            res.data[key].serviceType = serviceType[1]
        }
      }
    });
  }
  public created(){
      AxiosGet('/config/droplist/services').then((res: any) => {
          this.formOptions[0]['options'] = res.data
      })
  }
  // activeObJ: any, selected: any, selectedData: any
  public async activeClick(
    { name, index }: any,
    selected: any,
    selectedData: any
  ) {
    if (index == 3) {
      let id = this.detailsId[0].id;
      let url = `/contracts/details/${id}`;
      // console.log(id);
      await AxiosGet(url).then((response: any) => {
        this.detailResMsg = response;
        let ratePlanList = this.detailResMsg.data.ratePlanList;
        let productName: any = [];
        for (var i = 0; i < ratePlanList.length; i++) {
          let items = ratePlanList[i];
          console.log(items.productList);
          items.productList.map((item: any, index: number) => {
            productName.push(Object.assign({}, item));
            return productName;
          });
        }
        this.productName = productName;
      });
    } 
  }
}
</script>
<style lang="scss" scoped>
</style>
