<template>
  <div>
    <!-- 高级搜索 -->
    <Advanced-search
      autoClearSearchValue
      :formoptions="formOptions"
      :isChildName="true"
      allowClear
      @Submit="SearchOk"
      ref="AdvancedSearch"
    />
    <!-- 操作栏 -->
    <!-- 表格 -->
    <!-- <Table @onSelectAll="onSelectAll"
           @onSelect="onSelect"
           :columns="columns"
           :data="data"
    zebraStripe />-->
    <Table
       parentKey="id"
      :isFinance="true"
      :isNeedCheck="true"
      :selectedBtn="Formscreening"
      @onSelectClick="activeClick"
      @onSelectAll="onSelectAll"
      @onSelect="onSelect"
      :columns="columns"
      :data="data"
      zebraStripe
    />
    <!-- Add模态弹出框 -->
    <Model
      align-title="center"
      :height="'auto'"
      v-if="activeIndex === 1 && visible"
      v-model="visible"
      shade
      title="Add Company"
      @Screencover="Screencover"
    >
      <template slot="model-body">
        <div>
          <div
            :style="activeSelect === 'numberPlan' ? 'box-shadow: 0px 3px 0px 0px rgb(243, 243, 243);border-radius: 3px;margin:10px 20px;' : 'margin:10px 20px;'"
          >
            <div
              :style="activeSelect === 'numberPlan' ? 'background:#fff;margin-top:20px;padding:20px 0px;' : 'background:#fff;margin-top:20px;padding:0px 0px;'"
            ></div>
            <div class="menu-child">
              <keep-alive>
                <div :is="activeSelect" ref="isdeep" />
              </keep-alive>
            </div>
          </div>
        </div>
      </template>
      <template slot="model-footer">
        <a-row>
          <a-col :span="24" :style="{ textAlign: 'center' }" @click="handlesaveAll">
            <div style="margin-top:10px;">
              <a-button
                type="primary"
                style="border-radius:50px;min-width:75px;"
                @click="addAllData"
              >&nbsp; Save&nbsp;</a-button>
              <a-button
                :style="{ marginLeft: '8px', color: '#1890ff', borderRadius: '50px 50px 50px 50px', border: '1px solid #1890ff', fontWeight: '600' }"
                @click="handleReruen"
              >Return</a-button>
            </div>
          </a-col>
        </a-row>
      </template>
    </Model>
    <!-- edit 模态框弹出 -->
    <Model
      align-title="center"
      :height="'auto'"
      v-if="activeIndex === 2 && visible"
      v-model="visible"
      shade
      title="Company Edit"
      @Screencover="Screencover"
    >
      <template slot="model-body">
        <div>
          <div
            :style="activeSelectEdit === 'numberPlan' ? 'box-shadow: 0px 3px 0px 0px rgb(243, 243, 243);border-radius: 3px;margin:10px 20px;' : 'margin:10px 20px;'"
          >
            <div
              :style="activeSelectEdit === 'numberPlan' ? 'background:#fff;margin-top:20px;padding:20px 0px;' : 'background:#fff;margin-top:20px;padding:0px 0px;'"
            ></div>
            <div class="menu-child">
              <keep-alive>
                <div :is="activeSelectEdit" ref="editRef" :values="values" />
              </keep-alive>
            </div>
          </div>
        </div>
      </template>
      <template slot="model-footer">
        <a-row>
          <a-col :span="24" :style="{ textAlign: 'center' }" @click="handlesaveAll">
            <div style="margin-top:10px;">
              <a-button
                type="primary"
                style="border-radius:50px;min-width:75px;"
                @click="editllData"
              >Save  </a-button>
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
import { AxiosGet, AxiosPost, AxiosPut } from "@/api/axios";
import {
    recodeConfig,
    refsConfig
} from '@/assets/ts/config.d'
// import { AxiosPut } from "../../api/axios";

@Component({
  components: {
    AdvancedSearch: resolve =>
      require(["@/common/Advancedsearch/index.vue"], resolve),
    pagination: resolve => require(["@/common/pagination/index.vue"], resolve),
    Model: resolve => require(["@/common/Model/index.vue"], resolve),
    contractDetials: resolve =>
      require(["@/components/AddNewContract/contractDetails/index.vue"], resolve),
    CompanyCom: resolve =>
      require(["@/views/Configuration/CompanyCom.vue"], resolve),
    CompanyEdit: resolve =>
      require(["@/views/Configuration/CompanyEdit.vue"], resolve),
    detailS: resolve =>
      require(["@/components/formscReening/details/index.vue"], resolve),
    Table: () => import("@/views/Finance/components/Table/index.vue")
  }
})
export default class Company extends Vue {
  public $refs: refsConfig | any
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
      title: "Company",
      dataIndex: "companyName",
      key: "companyName"
    },
    {
      title: "Account",
      dataIndex: "accountName",
      key: "accountName"
    },
    {
      title: "Contact",
      dataIndex: "contact",
      key: "contact"
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone"
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
  private detailsId: any = []
  private contractDatas: any = [];
  public data: any = [];
  private formOptions: any = [
    {
      Tips: "Company",
      required: false,
      showSearch: true,   //下拉搜索
      name: "companyName",
      type: "select",
      filterOption:"filterOption",
      autoClearSearchValue:true,
      span: 14,
      colSpan: 4,
      options: [],
    }
  ];
  /* Add 选项卡 */
  public active(tab: any, item: any) {
    this.activeIn = tab;
    this.activeSelect = item;
  }
  private Formscreening: any[] = [
    {
      name: "Add",
      icon: "plus-circle",
      index: 1
    },
    {
      name: "Edit",
      icon: "form",
      disabled: true,
      tips: "Please select only one record to proceed",
      index: 2
    },
    {
      name: "Export",
      icon: "export",
      index: 3
    }
  ];
  public prouccDatiletias(selectedRows: any) {
    if (selectedRows.length) {
      this.detailsId = selectedRows[0].id;
    }
    this.$set(this.Formscreening[1], "disabled", selectedRows.length !== 1);
  }
  /* 用户手动选择/取消选择所有列的回调  Table -> 回调 */
  public onSelectAll(selected: boolean, selectedRows: any, changeRows: any) {
    if (selected == true) {
      this.prouccDatiletias(selectedRows);
    }
  }
  public onSelect(record: object, selected: boolean, selectedRows: any) {
    record = selectedRows[0]
    this.values[0] = record
    if(selected == true){
            this.$set(this.values,0,record);
    } 
    if (!selectedRows.length) {
      return (this.Formscreening[1].disabled = true);
    }
    if (selectedRows.length > 1) {
      this.Formscreening[1].disabled = true;
      this.Formscreening[1].tips = "Please select only one record to proceed";
      return false;
    }
    if (selectedRows.length === 1) {
      return (this.Formscreening[1].disabled = false);
    } 
    
  }
  /* 点击切换页 分页(pagination) -> 回调 */
  public onChang(pageSize: number) {
    // console.log(pageSize)
  }

  /* 获取新增合同所有数据 */
  // private selectChangebr(){
  //   const AdvancedSearch = this.$refs.AdvancedSearch
  //   const AdvancedSearchs = AdvancedSearch.getFieldsValue()
  //   if(AdvancedSearchs.companyName.length > 1){
  //        AdvancedSearchs.companyName.pop()
  //   }
  //   console.log('AdvancedSearchs',AdvancedSearchs.companyName)
  // }
  public addAllData(values: any): void {
    let that: any = this;
    if (this.activeIndex === 1) {
      let {
        companyName,
        contact,
        phone
      } = this.$refs.isdeep.form.getFieldsValue();
      //  console.log(this.$refs.isdeep.form.getFieldsValue());
      AxiosPost("/config/company", {
        companyName,
        contact,
        phone
      }).then((res:any) => {
        if (res.code >= 1) {
          this.visible = !this.visible;
          AxiosGet("/config/company").then((res: any) => {
            this.data = res.data;
          });
        }
        if (res.code != 1) {
          return this.$message.warning(res.msg);
        }
      });
    }
  }
  public editllData(values: any): void {
    let that: any = this;
    let data = this.$refs.editRef.form.getFieldsValue();
    data.id = this.values[0].id;
    AxiosPut("/config/company", data).then((res:any) => {
      if (res.code == 1) {
        this.visible = !this.visible;
        AxiosGet("/config/company").then((res: any) => {
          this.data = res.data;
        });
      }
      if (res.code != 1) {
        return this.$message.warning(res.msg);
      }
    });
  }
  public selectChange(values: any){
    console.log('slkaj')
  }
  /* 操作栏点击 -> 回调 */
  public SearchOk(values: any): void {
    console.log('values',values)
    let data: any = {
      params: Object.assign({}, values, {
        companyName:values.companyName
      })
    };
    AxiosGet("/config/company",data).then((res: any) => {
      this.data = res.data;
    });
  }

  private visible: any = false;

  // activeObJ: any, selected: any, selectedData: any
  public async activeClick(
    { name, index }: any,
    selected: boolean,
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
    } else if (index == 6) {
    }
    index !== 3 && (this.visible = !this.visible) && (this.activeIndex = index);
  }
  public created(data:any){
      AxiosGet('/config/company',data).then((res: any) => {    
          res.data.forEach((item: any)=>{
              // console.log('item',item.companyName)
              this.formOptions[0].options.push(item.companyName)
          })

      })
  }
  public updated(data: any){
        console.log('改变')
  }
  /* 校验所有 */
  handlesaveAll() {
    // console.log("校验开始");
  }
  /* 退出 */
  handleReruen() {
    this.Screencover();
  }
  /* 关闭 Add */
  public Screencover() {
    this.visible = !this.visible;
  }
}
</script>

<style lang="scss" scoped>
</style>
