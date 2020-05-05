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
    <!-- Add模态弹出框 -->
    <Model align-title="center"
           :height="'auto'"
           v-model="visible"
           shade
           :title="getModalTitle">
      <template slot="model-body">
        <!-- Add模块 -->
        <linkage v-if="activeIndex === 1 && visible"
                 @select="handleChange"
                 :formoptions="addFormOptions"
                 :span="12"
                 ref="service"></linkage>
        <!-- edit模块 -->
        <linkage v-if="activeIndex === 2 && visible"
                 @select="edithandleChange"
                 :formoptions="editFormOptions"
                 :span="12"
                 ref="editRef"></linkage>
        <!-- upload -->
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
import { Component, Prop, Emit } from "vue-property-decorator";
import { State, Mutation } from "vuex-class";
import { AxiosGet } from "@/api/axios";
import moment from "moment";
import {
  ExchangeRates,
  formOptionsConfigs,
  UploadCndnFile
} from "./EditdestinationConfig";
import {
  RouteProductDestinationSearch,
  EditDestinationAdd,
  EditDestinationEdit,
  EditDestinationUpload,
  RefcountryWithCodes,
  RefcountryCodes,
  RouteProductCategoryList,
  Refcountry,
  EditDestinationDelete,
  getVendorClientDestination,
  addVendorClientDestination,
  editVendorClientDestination,
  deleteVendorClientDestination,
  uploadVendorClientDestination,
  getVendorClientCountries,
  getVendorClientCountryCodes,
  getVendorClientCountryWithCodes,
  RefcountryWithCodesById,
  countryWithCodesById
  // getVendorClientNumberPlanNames,
  // getVendorClientDestNames,
  // getVendorClientDestDialedDigits
} from "@/api/index";
import { recodeConfig, refsConfig } from "@/assets/ts/config.d";
import { onSelectClick } from "@/views/Configuration/Exports";
import {
  addFormOptionsData,
  editFormOptionsData,
  columnsData,
  formOptionsData,
  FormscreeningData,
  baseInfoFormOptionsData
} from "./config";
import { downloadExcel } from "@/assets/ts/xlsx-style/index";

import { distinct, deepClone } from "@/assets/ts/index";
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
    linkage: () => import("./linkage.vue"),
    detailS: resolve =>
      require(["@/components/formscReening/details/index.vue"], resolve),
    Table: () => import("@/views/Finance/components/Table/index.vue")
  }
})
export default class editcoutryadd extends Vue {
  @Prop([Number, String]) private refnumberplanid: any;
  @Prop() private refnumberplanname: any;
  @Prop(Boolean) private isVendorClient?: boolean; // 是否是Vendor-Client numberplan 页面
  private values = {};
  public $refs: refsConfig | any;
  private detailsId: any;
  private relatedContract: string = "";
  private id: any;
  private searchdata: any;
  private formDataObj: any;
  private Editdestinationid: any;
  private activeIndex: number = 0;
  private columns: ExchangeRates[] = columnsData;
  private addFormOptions: any[] = addFormOptionsData; //新增数据
  private editFormOptions: any[] = editFormOptionsData; //编辑数据
  private contractDatas: any = [];
  public data: any = [];
  public refCountryId: any;
  public editrefCountryId: any;
  private formOptions: formOptionsConfigs[] = formOptionsData; //高级搜索数据
  private Formscreening: any[] = FormscreeningData; //操作栏数据
  private baseInfoFormOptions: any[] = baseInfoFormOptionsData;
  private CountryCode: any;
  private CountryAndCode: any;
  private Country: any;

  private get getModalTitle(): string {
    if (this.activeIndex === 1) {
      return "Add editDestienatione";
    } else if (this.activeIndex === 2) {
      return "Edit editDestination";
    } else if (this.activeIndex === 4) {
      return "Upload editDestination";
    }
    return "unKnow";
  }
  public created() {
    let // getCountries: any = Refcountry,
      // getCountryCodes: any = RefcountryCodes,
      getCountryWithCodes: any = RefcountryWithCodes,
      getCountryWithCodesById: any = RefcountryWithCodesById;
    if (this.isVendorClient) {
      // getCountries = getVendorClientCountries;
      // getCountryCodes = getVendorClientCountryCodes;
      getCountryWithCodes = getVendorClientCountryWithCodes;
      getCountryWithCodesById = countryWithCodesById;
    }
    const data: any = {
      params: {
        [this.isVendorClient ? "vendorClientName" : "referenceName"]: this
          .refnumberplanname
      }
    };
    // getCountries().then((res: recodeConfig) => {
    //   this.Country = res.data;
    //   this.$set(this.addFormOptions[2], "options", res.data);
    //   this.$set(this.editFormOptions[2], "options", res.data);

    //   console.log("this.formOptions", this.formOptions);
    //   console.log("this.addFormOptions", this.addFormOptions);
    //   console.log("this.editFormOptions", this.editFormOptions);
    // });
    // getCountryCodes().then((res: recodeConfig) => {
    //   this.CountryCode = res.data;
    //   this.$set(this.editFormOptions[3], "options", res.data);
    //   this.$set(this.editFormOptions[3], "options", res.data);
    // });

    getCountryWithCodes().then((res: recodeConfig) => {
      this.CountryAndCode = res.data;

      let coutrycode: any[] = [],
        coutry: any[] = [];
      for (let item of res.data) {
        coutrycode.push(item.countryCode);
        coutry.push(item.countryName);
      }

      this.Country = deepClone(distinct(coutry));
      this.$set(this.addFormOptions[2], "options", deepClone(distinct(coutry)));
      this.$set(this.editFormOptions[2], "options", deepClone(distinct(coutry)));

      this.CountryCode = deepClone(distinct(coutrycode));
      this.$set(this.editFormOptions[3], "options", deepClone(distinct(coutrycode)));
      this.$set(this.editFormOptions[3], "options", deepClone(distinct(coutrycode)));
    });

    RouteProductCategoryList("").then((res: recodeConfig) => {
      this.$set(this.formOptions[5], "options", deepClone(distinct(res.data)));
      this.$set(this.addFormOptions[4], "options", deepClone(distinct(res.data)));
      this.$set(this.editFormOptions[4], "options", deepClone(distinct(res.data)));
    });
    this.getCountryWithCodesByIdData();
  }

  private getCountryWithCodesByIdData() {
    let getCountryWithCodesById: any = RefcountryWithCodesById;
    if (this.isVendorClient) {
      getCountryWithCodesById = countryWithCodesById;
    }
    const data: any = {
      params: {
        [this.isVendorClient ? "vendorClientName" : "referenceName"]: this
          .refnumberplanname
      }
    };
    getCountryWithCodesById(data).then((res: recodeConfig) => {
      let coutrycode: any[] = [],
        coutry: any[] = [];
      for (let item of res.data) {
        coutrycode.push(item.countryCode);
        coutry.push(item.countryName);
      }
      // 去重
      this.$set(this.formOptions[4], "options", deepClone(distinct(coutrycode)));
      this.$set(this.formOptions[3], "options", deepClone(distinct(coutry)));
    });
  }

  /* 新增下拉联动 */
  public handleChange(
    val: any,
    currentName: string,
    key: number,
    rowIndex: number
  ) {
    this.changeCountryAndCode(val, currentName, key, rowIndex, true);
  }

  /* 编辑下拉联动 */
  public edithandleChange(
    val: any,
    currentName: string,
    key: number,
    rowIndex: number
  ) {
    this.changeCountryAndCode(val, currentName, key, rowIndex, false);
  }

  // country 和country code 联动 isAddPage: 是增加界面
  private changeCountryAndCode(
    val: any,
    currentName: string,
    key: number,
    rowIndex: number,
    isAddPage?: boolean
  ) {
    if (currentName === "countryCode" || currentName === "countryName") {
      let setData: any = {};
      const find: any = this.CountryAndCode.find(
        (item: any, index: number, arr: any) => {
          // console.log(item.countryCode, val, item.countryName, val);
          return (
            (currentName === "countryCode" && item.countryCode === val) ||
            (currentName === "countryName" && item.countryName === val)
          );
        }
      );
      let countryCode = find ? [find.countryCode] : this.CountryCode;
      let countryName = find ? [find.countryName] : this.Country;
      console.log("val", val);
      console.log("find", find);
      const dataKey: string =
        currentName === "countryName" ? "countryCode" : "countryName";
      if (
        val &&
        val.length &&
        (currentName === "countryCode" || currentName === "countryName") &&
        (countryName !== this.Country || countryCode !== this.CountryCode)
      ) {
        const countryCodes =
          currentName === "countryCode" ? countryName : countryCode;
        console.log(find, countryName, countryCode);
        setData[dataKey] = countryCodes;
        if (isAddPage && find) {
          this.refCountryId = find.id;
        } else {
          this.editrefCountryId = find.id;
        }
      } else {
        // 没找到 数据 设置为空
        setData[dataKey] = undefined;
      }
      let form: any;
      if (isAddPage) {
        form = this.$refs.service;
      } else {
        form = this.$refs.editRef;
      }
      console.log("setData", setData);
      Object.keys(setData).length && form.form.setFieldsValue(setData);
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

  private async uploadData() {
    let that: any = this;
    let uploadDestination: any = EditDestinationUpload;
    if (this.isVendorClient) {
      uploadDestination = uploadVendorClientDestination;
    }
    uploadDestination(this.formDataObj).then((res: recodeConfig) => {
      if (res.code >= 1) {
        that.visible = !that.visible;
        that.$message.success("Successful addition");
      }
      console.log(res.code);
      if (res.code == -203) {
        that.$message.error(res.msg);
      }
    });
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
  public addAllData(): void {
    let that: any = this;
    if (this.activeIndex === 1) {
      let obj = JSON.parse(
        JSON.stringify(that.$refs.service.form.getFieldsValue())
      );
      console.log(obj);
      let refCountryId = this.refCountryId;
      let {
        destinationName,
        categoryList,
        countryCode,
        destinationType,
        dialedDigitList,
        beginDate,
        remark,
        endDate
      } = obj;
      let refNpId = that.refnumberplanid;
      beginDate = moment(beginDate).format("YYYY-MM-DD");
      endDate = moment(endDate).format("YYYY-MM-DD");
      (destinationType =
        destinationType == "Mobile"
          ? 1
          : destinationType || destinationType == "Fixed"
          ? 2
          : destinationType),
        (categoryList =
          categoryList instanceof Array ? categoryList.join(",") : "");
      let add = {
        destinationName,
        categoryList,
        [this.isVendorClient
          ? "vendorClientCountryId"
          : "refCountryId"]: refCountryId,
        beginDate,
        destinationType,
        dialedDigitList: dialedDigitList
          ? dialedDigitList.replace(/\s/g, "")
          : undefined,
        remark,
        [this.isVendorClient ? "vendorClientNpId" : "refNpId"]: refNpId,
        endDate
      };
      let addDestination: any = EditDestinationAdd;
      if (this.isVendorClient) {
        addDestination = addVendorClientDestination;
      }
      addDestination(add).then((res: any) => {
        if (res.code >= 1) {
          that.visible = !that.visible;
          that.$message.success("Successful addition");
          this.$set(this.Formscreening[1], "disabled", true);
          this.$set(this.Formscreening[2], "disabled", true);
          setTimeout(() => {
            this.SearchOk(this.$refs.AdvancedSearch.getFieldsValue());
            this.getCountryWithCodesByIdData();
          }, 100);
        } else if (res.code < 1) {
          that.$message.warning(res.msg);
        }
      });
    }
  }

  // 编辑保存
  public editAllData(): void {
    let that: any = this;
    if (this.activeIndex === 2) {
      let obj = JSON.parse(
        JSON.stringify(that.$refs.editRef.form.getFieldsValue())
      );
      let refCountryId = this.editrefCountryId;
      let {
        destinationName,
        categoryList,
        countryCode,
        destinationType,
        dialedDigitList,
        beginDate,
        remark,
        endDate
      } = obj;
      let refNpId = that.refnumberplanid;
      let id = this.id;
      beginDate = moment(beginDate).format("YYYY-MM-DD");
      endDate = moment(endDate).format("YYYY-MM-DD");
      (destinationType =
        destinationType == "Mobile"
          ? 1
          : destinationType || destinationType == "Fixed"
          ? 2
          : destinationType),
        (categoryList =
          categoryList instanceof Array ? categoryList.join(",") : "");
      let edit = {
        destinationName,
        categoryList,
        [this.isVendorClient
          ? "vendorClientCountryId"
          : "refCountryId"]: refCountryId,
        beginDate,
        destinationType,
        dialedDigitList: dialedDigitList
          ? dialedDigitList.replace(/\s/g, "")
          : undefined,
        remark,
        id,
        [this.isVendorClient ? "vendorClientNpId" : "refNpId"]: refNpId,
        endDate
      };
      console.log(edit);
      let editDestination: any = EditDestinationEdit;
      if (this.isVendorClient) {
        editDestination = editVendorClientDestination;
      }
      editDestination(edit).then((res: any) => {
        if (res.code >= 1) {
          that.visible = !that.visible;
          that.$message.success("Successful addition");
          this.$set(this.Formscreening[1], "disabled", true);
          this.$set(this.Formscreening[2], "disabled", true);
          setTimeout(() => {
            this.SearchOk(this.$refs.AdvancedSearch.getFieldsValue());
            this.getCountryWithCodesByIdData();
          }, 100);
        }
      });
    }
  }

  /* 操作栏点击 -> 回调 */
  public SearchOk(values: any): void {
    const data: any = {
      params: Object.assign({}, values, {
        [this.isVendorClient ? "vendorClientNpId" : "refNpId"]: this
          .refnumberplanid,
        effeciveDate: values.effeciveDate
          ? moment(values.effeciveDate).format("YYYY-MM-DD")
          : undefined,
        countryCode:
          values.countryCode instanceof Array
            ? values.countryCode[0]
            : values.countryCode,
        countryName:
          values.countryName instanceof Array
            ? values.countryName[0]
            : values.countryName,
        destinationName:
          values.destinationName !== "" ? values.destinationName : undefined,
        dialedDigitList:
          values.dialedDigitList !== "" ? values.dialedDigitList : undefined
      })
    };
    let getDestination: any = RouteProductDestinationSearch;
    if (this.isVendorClient) {
      getDestination = getVendorClientDestination;
    }
    getDestination(data).then((res: any) => {
      this.data = res.data;
      this.data.map((item: any, index: number) => {
        // console.log(item.detailList);
        // console.log(innerItem.type)
        if (item.destinationType === 1) {
          item.destinationType = "Mobile";
        } else if (item.destinationType === 2) {
          item.destinationType = "Fixed";
        }
      });
    });
  }

  private visible: any = false;
  public async activeClick(
    { name, index }: any,
    selected: boolean,
    selectedData: any,
    activeObJ: any
  ) {
    this.activeIndex = index;
    const deleted = selectedData.map((item: any) => item.id).join(","); //多选删除
    this.id = deleted;
    if (index == 2 && this.detailsId) {
      this.activeIndex = 2;
      let categoryList = this.values[0].categoryList
        ? this.values[0].categoryList.split(",")
        : undefined;
      if (activeObJ === undefined) {
        this.editFormOptions[0].initialValue = this.values[0].destinationName;
        this.editFormOptions[1].initialValue = this.values[0].destinationType;
        this.editFormOptions[2].initialValue = this.values[0].countryName;
        this.editFormOptions[3].initialValue = this.values[0].countryCode;
        this.editFormOptions[4].initialValue = categoryList;
        this.editFormOptions[5].initialValue = this.values[0].beginDate;
        this.editFormOptions[6].initialValue = this.values[0].endDate;
        this.editFormOptions[7].initialValue = this.values[0].dialedDigitList;
        this.editFormOptions[8].initialValue = this.values[0].remark;
      }
    }
    if (index == 3 && this.detailsId) {
      let _this = this;
      let deleteDestination: any = EditDestinationDelete;
      if (this.isVendorClient) {
        deleteDestination = deleteVendorClientDestination;
      }
      this.$confirm({
        title: "Confirm!",
        content: `Continue to deleted the data?`,
        okText: "YES",
        cancelText: "NO",
        onOk() {
          deleteDestination(deleted).then((res: any) => {
            console.log("Confirm", res);
            if (res.code > 0) {
              _this.$message.success("Data has been deleted successfully");
              _this.SearchOk(_this.$refs.AdvancedSearch.getFieldsValue());
              _this.getCountryWithCodesByIdData();
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
        ? "Vendor/Client-Number-Plan"
        : "Reference Number plan";
      // onSelectClick(this.columns, this.data, name, name);
      downloadExcel(this.columns, this.data, name);
    }
    index !== 5 && index !== 3 && (this.visible = true);
  }

  /* 退出 */
  handleReruen() {
    this.visible = !this.visible;
  }
}
</script>

<style lang="scss" scoped>
.ant-form-item-label {
  margin-right: 20px;
}
</style>
