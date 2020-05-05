<template>
  <div>
    <!-- 高级搜索 -->
    <Advanced-search autoClearSearchValue
                     :formoptions="formOptions"
                     :isChildName="true"
                     allowClear
                     @Submit="SearchOk"
                     ref="AdvancedSearch"
                     isNotShadow />
    <!-- 表格 -->
    <Table parentKey="id"
           :isFinance="true"
           :isNeedCheck="true"
           :selectedBtn="Formscreening"
           @onSelectClick="activeClick"
           @onSelectAll="onSelectAll"
           @onSelect="onSelect"
           :columns="columns"
           :data="data"
           zebraStripe />
    <!-- 弹出框 -->
    <Model align-title="center"
           :height="'auto'"
           v-model="visible"
           shade
           :title="getModalTitle"
           @Screencover="Screencover">
      <template slot="model-body">
        <!-- Add模块 -->
        <form-group v-if="activeIndex === 1 && visible"
                    :formoptions="addFormOptions"
                    :span="12"
                    ref="service"></form-group>
        <!-- edit模块 -->
        <form-group v-if="activeIndex === 2 && visible"
                    :formoptions="editFormOptions"
                    :span="12"
                    ref="editRef"></form-group>
        <!-- upload模块 -->
        <form-group v-if="activeIndex === 4 && visible"
                    :formoptions="baseInfoFormOptions"
                    @uploadChange="uploadFileChange"
                    :span="12"
                    ref="baseInfoFormGroup"></form-group>
      </template>
      <template slot="model-footer">
        <a-row>
          <a-col :span="24"
                 :style="{ textAlign: 'center' }">
            <div style="margin-top:10px;">
              <a-button type="primary"
                        style="border-radius:50px;min-width:75px;"
                        @click="save">Save</a-button>
              <a-button :style="{ marginLeft: '8px', color: '#1890ff', borderRadius: '50px 50px 50px 50px', border: '1px solid #1890ff', fontWeight: '600' }"
                        @click="handleReruen">Return</a-button>
            </div>
          </a-col>
        </a-row>
      </template>
    </Model>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { State, Mutation } from "vuex-class";
import { AxiosGet } from "@/api/axios";
import moment from "moment";
import { ExchangeRates, formOptionsConfigs } from "./editcoutryConfig";
import {
  EditCoutrySearch,
  EditCoutryAdd,
  EditCoutryEdit,
  RefcountryWithCodes,
  RefcountryCodes,
  Refcountry,
  getDetailService,
  EditCoutryDelete,
  EditCoutryUpload,
  searchVendorClientCountries,
  addVendorClientCountries,
  editVendorClientCountries,
  deleteVendorClientCountries,
  uploadVendorClientCountries
  // getVendorClientCountries,
  // getVendorClientCountryCodes,
} from "@/api/index";
import xlsx from "xlsx";
import {
  addFormOptionsData,
  editFormOptionsData,
  columnsData,
  formOptionsData,
  FormscreeningData,
  baseInfoFormOptionsData
} from "./config";
import { onSelectClick } from "@/views/Configuration/Exports";
import { recodeConfig, refsConfig } from "@/assets/ts/config.d";
import { AntdComponent } from "ant-design-vue/types/component";

@Component({
  components: {
    AdvancedSearch: resolve =>
      require(["@/common/Advancedsearch/index.vue"], resolve),
    pagination: resolve => require(["@/common/pagination/index.vue"], resolve),
    Model: resolve => require(["@/common/Model/index.vue"], resolve),
    contractDetials: resolve =>
      require([
        "@/components/AddNewContract/contractDetails/index.vue"
      ], resolve),
    formGroup: () => import("@/views/Finance/components/form-group/index.vue"),
    detailS: resolve =>
      require(["@/components/formscReening/details/index.vue"], resolve),
    Table: () => import("@/views/Finance/components/Table/index.vue")
  }
})
export default class editcoutry extends Vue {
  @Prop([Number, String]) private refnumberplanid: any;
  @Prop(Boolean) private isVendorClient?: boolean;

  private values = {};
  public $refs: refsConfig | any;
  private detailsId: any;
  private relatedContract: string = "";
  private id: any;
  private editcoutryid: any;
  private formDataObj: any;
  private activeIndex: number = 0;
  private baseInfoFormOptions: any[] = baseInfoFormOptionsData; //upload数据
  private columns: ExchangeRates[] = columnsData; //表头数据
  private contractDatas: any = [];
  public data: any = [];
  private formOptions: formOptionsConfigs[] = formOptionsData; //高级搜索数据
  private Formscreening: any[] = FormscreeningData; //操作栏数据
  private addFormOptions: any[] = addFormOptionsData; //新增数据
  private editFormOptions: any[] = editFormOptionsData; //编辑数据

  private CountryCode: any;
  private CountryAndCode: any;
  private Country: any;

  private get getModalTitle(): string {
    if (this.activeIndex === 1) {
      return "Add Edit Coutry";
    } else if (this.activeIndex === 2) {
      return "Edit Coutry Edit";
    } else if (this.activeIndex === 4) {
      return "Upload Edit Coutry";
    }
    return "unKnow";
  }

  /* 用户手动选择/取消选择所有列的回调  Table -> 回调 */
  public onSelectAll(selected: boolean, selectedRows: any, changeRows: any) {
    this.prouccDatiletias(selectedRows);
  }
  public onSelect(record: object, selected: boolean, selectedRows: any) {
    console.log(selectedRows, selected, record);
    record = selectedRows[0];
    this.values[0] = record;
    this.prouccDatiletias(selectedRows);
  }
  public prouccDatiletias(selectedRows: any) {
    if (selectedRows.length) {
      this.detailsId = selectedRows[0].id;
    }
    this.Formscreening.forEach((item: any) => {
      if (item.txt === "edit" || item.txt === "delete") {
        item.disabled = selectedRows.length !== 1;
      } else if (item.txt === "export") {
        item.disabled = this.data.length === 0;
      }
    });
  }

  private save() {
    if (this.activeIndex === 1) {
      this.addAllData();
    } else if (this.activeIndex === 2) {
      this.editAllData();
    } else if (this.activeIndex === 4) {
      this.uploadData();
    }
  }

  // 新增保存
  private addAllData(): void {
    let that: any = this;
    if (this.activeIndex === 1) {
      let obj = JSON.parse(
        JSON.stringify(that.$refs.service.form.getFieldsValue())
      );
      console.log(obj);
      // let find = that.$refs.service.Country.find((res)=>res.name === obj.countryName);
      // console.log('find',find);
      // let refCountryId = find.value;
      let {
        countryName,
        countryCode,
        timeZone,
        beginDate,
        remark,
        endDate
      } = obj;
      let refNpId = that.refnumberplanid;
      console.log(that.refnumberplanid);
      beginDate = moment(beginDate).format("YYYY-MM-DD");
      endDate = moment(endDate).format("YYYY-MM-DD");
      let add = {
        countryName,
        countryCode,
        timeZone,
        beginDate,
        remark,
        [this.isVendorClient ? "vendorClientNpId" : "refNpId"]: refNpId,
        endDate
      };
      console.log(add);
      // console.log(edit, vendorName, vendorName);
      let addCountry: any = EditCoutryAdd;
      if (this.isVendorClient) {
        addCountry = addVendorClientCountries;
      }
      addCountry(add).then((res: any) => {
        if (res.code >= 1) {
          that.visible = !that.visible;
          that.$message.success("Successful addition");
          this.$set(this.Formscreening[1], "disabled", true);
          this.$set(this.Formscreening[2], "disabled", true);
          setTimeout(() => {
            this.SearchOk(this.$refs.AdvancedSearch.getFieldsValue());
          }, 100);
        }
      });
    }
  }
  // 编辑保存
  private editAllData(): void {
    let that: any = this;
    if (this.activeIndex === 2) {
      let obj = JSON.parse(
        JSON.stringify(that.$refs.editRef.form.getFieldsValue())
      );
      let {
        countryName,
        countryCode,
        timeZone,
        beginDate,
        remark,
        endDate
      } = obj;
      let refNpId = that.refnumberplanid;
      console.log(that.refnumberplanid);
      beginDate = moment(beginDate).format("YYYY-MM-DD");
      endDate = moment(endDate).format("YYYY-MM-DD");
      let id = this.id;
      console.log(id);
      let edit = {
        countryName,
        countryCode,
        timeZone,
        beginDate,
        remark,
        [this.isVendorClient ? "vendorClientNpId" : "refNpId"]: refNpId,
        endDate,
        id
      };
      console.log(edit);
      let editCountry: any = EditCoutryEdit;
      if (this.isVendorClient) {
        editCountry = editVendorClientCountries;
      }
      editCountry(edit).then((res: any) => {
        if (res.code >= 1) {
          that.visible = !that.visible;
          that.$message.success("Successful addition");
          this.$set(this.Formscreening[1], "disabled", true);
          this.$set(this.Formscreening[2], "disabled", true);
          setTimeout(() => {
            this.SearchOk(this.$refs.AdvancedSearch.getFieldsValue());
          }, 100);
        }
      });
    }
  }

  // 上传文件的方法 Upload
  private async uploadFileChange(info) {
    let formDataObj: any = new FormData();
    formDataObj.append("file", info.file.originFileObj);
    const name: string = this.isVendorClient ? "vendorClientNpId" : "refNpId";
    formDataObj.append(name, this.refnumberplanid);
    this.formDataObj = formDataObj;
  }
  private uploadData() {
    let uploadCountry: any = EditCoutryUpload;
    if (this.isVendorClient) {
      uploadCountry = uploadVendorClientCountries;
    }
    uploadCountry(this.formDataObj).then((res: recodeConfig) => {
      if (res.code >= 1) {
        this.visible = !this.visible;
        this.$message.success("Successful addition");
      }
    });
  }

  /* 操作栏点击 -> 回调 */
  private SearchOk(values: any): void {
    const data: any = {
      params: Object.assign({}, values, {
        [this.isVendorClient ? "vendorClientNpId" : "refNpId"]: this
          .refnumberplanid,
        effeciveDate:
          values.effeciveDate &&
          moment(values.effeciveDate).format("YYYY-MM-DD"),
        countryName: values.countryName !== "" ? values.countryName : undefined,
        timeZone: values.timeZone !== "" ? values.timeZone : undefined,
        countryCode: values.countryCode !== "" ? values.countryCode : undefined
      })
    };
    console.log(data);
    let searchCountry: any = EditCoutrySearch;
    if (this.isVendorClient) {
      searchCountry = searchVendorClientCountries;
    }
    searchCountry(data).then((res: any) => {
      this.data = res.data;
    });
  }

  private visible: any = false;
  private async activeClick(
    { name, index }: any,
    selected: boolean,
    selectedData: any,
    activeObJ: any
  ) {
    this.activeIndex = index;
    const deleted = selectedData.map((item: any) => item.id).join(","); //多选删除
    this.id = deleted;
    let deleteCountry: any = EditCoutryDelete;
    if (this.isVendorClient) {
      deleteCountry = deleteVendorClientCountries;
    }
    if (index == 2 && this.detailsId) {
      this.activeIndex = 2;
      if (activeObJ === undefined) {
        this.editFormOptions[0].initialValue = this.values[0].countryName;
        this.editFormOptions[1].initialValue = this.values[0].countryCode;
        this.editFormOptions[2].initialValue = this.values[0].timeZone;
        this.editFormOptions[3].initialValue = this.values[0].beginDate;
        this.editFormOptions[4].initialValue = this.values[0].endDate;
        this.editFormOptions[5].initialValue = this.values[0].remark;
      }
    }
    if (index == 3 && this.detailsId) {
      let _this = this;
      this.$confirm({
        title: "Confirm!",
        content: `Continue to  deleted the data?`,
        okText: "YES",
        cancelText: "NO",
        onOk() {
          const that = this;
          deleteCountry(deleted).then((res: any) => {
            console.log("Confirm", res);
            if (res.code > 0) {
              _this.$message.success("Data has been deleted successfully");
              _this.SearchOk(_this.$refs.AdvancedSearch.getFieldsValue());
            }
            _this.visible = false;
          });
        }
      });
    }

    /**export按钮 */
    if (index == 5) {
      // Export
      const name: string = this.isVendorClient
        ? "Vendor/Client Number Plan"
        : "Reference Number plan";
      onSelectClick(this.columns, this.data, name, name);
    }
    index !== 3 && index !== 5 && (this.visible = !this.visible);
  }

  /* 退出 */
  handleReruen() {
    this.Screencover();
  }
  /* 关闭 Add */
  private Screencover() {
    this.visible = !this.visible;
  }
}
</script>

<style lang="scss" scoped>
.ant-form-item-label {
  margin-right: 20px;
}
</style>
