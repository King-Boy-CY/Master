<template>
  <div class="status statement">
    <!-- 高级搜索 -->
    <Advanced-search
      :formoptions="formOptions"
      :formscreening="Formscreening"
      :needExport="false"
      searchText="Search"
      @Submit="SearchOk"
      @selectChange="selectChange"
      @monthPickerChange="monthPickerChange"
      @btnClick="activeClick"
      ref="AdvancedSearch"
    ></Advanced-search>
    <!--:isSingleCheck="true"-->
    <Table
      :isFinance="true"
      :isNeedCheck="true"
      :selectedBtn="selectedBtn"
      @onSelectClick="onSelectClick"
      :scrollX="1600"
      ref="table"
      :lessSpace="true"
      @onSelect="onSelect"
      @onSelectAll="onSelectAll"
      :columns="columns"
      :data="data"
      :isPagination="false"
      :rowClassName="rowClassName"
      zebraStripe
      :childColumnss="columns"
    />
    <!--<div class="statement-pagination">
      &lt;!&ndash; 分页 &ndash;&gt;
      <pagination @change="onChang"
                  @showSizeChange="onShowSizeChange"/>
    </div>-->
    <a-modal
      centered
      class="edit-modal"
      width="900px"
      v-model="visible"
      :footer="null"
      title="Edit"
      onOk="handleOk"
    >
      <!--<template slot="footer">
        <a-button key="submit" type="primary" @click="save">
          Save
        </a-button>
        <a-button key="back" @click="handleReturn">Return</a-button>
      </template>-->
      <form-group :formoptions="editFormOptions" :span="12" ref="formGroup"></form-group>
      <div style="padding-top: 20px;text-align: center">
        <a-button type="primary" style="border-radius: 50px;min-width: 90px" @click="save">Save</a-button>
        <a-button
          @click="handleReturn('Reset')"
          style="margin-left: 14px;border-color:#1890ff;color:#1890ff;border-radius: 50px;min-width: 90px"
        >Return</a-button>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { columns, data, lockedDateOptions } from "./Test";
import moment from "moment";
import {
  getAccountOptions,
  getServiceOptions
} from "@/views/Finance/common/js/exchangeData.ts";
import {
  DirectionOptions,
  BillingTypeOptions,
  ChargeTypeOptions
} from "@/views/Finance/common/data/index.ts";
import financeMixin from "@/views/Finance/common/js/mixin.ts";
import xlsx from "xlsx";
import { refsConfig, recodeConfig } from "@/assets/ts/config.d";
@Component({
  components: {
    AdvancedSearch: () =>
      import("@/views/Finance/components/Advancedsearch/index.vue"),
    Table: () => import("@/views/Finance/components/Table/index.vue"),
    pagination: () => import("@/common/pagination/index.vue"),
    // model: () => import('@/common/Model/index.vue')
    formGroup: () => import("@/views/Finance/components/form-group/index.vue")
  },
  mixins: [financeMixin]
})
export default class ST extends Vue {
  public columns: any[] = columns;
  public data: any = [];
  private selectkeyArr: number = 0;
  private selectkeyIndex: any = [];
  private searchData: any;
  private DirectionOptions: any[] = DirectionOptions();
  private BillingTypeOptions: any[] = BillingTypeOptions();
  private ChargeTypeOptions: any[] = ChargeTypeOptions();
  // table选择框 选择后的按钮
  private selectedBtn: any = [
    {
      name: "Edit",
      icon: "edit",
      index: 0,
      disabled: true
    },
    {
      name: "Export",
      icon: "export",
      index: 1,
      disabled: true
    }
  ];

  /* 弹出框显示/隐藏 */
  public visible: boolean = false;
  /*  高级搜索输入框数据
            @param name：label 值 && from输出的字段
            @param required：是否必填 默认false && from输出的字段
            @param type: 输入框什么类型， 例如select['下拉'], picker['时间选择器'] -> 目前只支持这俩个
            @param options：输入框['下拉的子元素数据']
        */
  private formOptions: any[] = [
    {
      Tips: "Service",
      name: "Service",
      required: false,
      type: "select",
      options: null
    },
    {
      Tips: "Account",
      name: "Account",
      required: false,
      type: "select",
      options: null
    },
    {
      Tips: "Charge type",
      name: "ChargeType",
      required: false,
      type: "select",
      options: this.ChargeTypeOptions
    },
    {
      Tips: "Billing type",
      name: "BillingType",
      required: false,
      type: "select",
      options: [
        {
          name: "Invoice",
          value: 1,
          disabled: false
        },
        {
          name: "Declaration",
          value: 2,
          disabled: false
        }
      ]
    },
    {
      Tips: "Direction",
      name: "Direction",
      required: false,
      type: "select",
      options: this.DirectionOptions
    },
    {
      Tips: "Status",
      name: "Status",
      required: false,
      type: "select",
      options: lockedDateOptions
    },
    {
      Tips: "Begin date",
      name: "BeginDate",
      required: false,
      type: "picker"
    },
    {
      Tips: "End date",
      name: "EndDate",
      required: false,
      type: "picker"
    }
  ];

  private editFormOptions: any[] = [
    {
      Tips: "Statement name",
      decorator: "StatementName",
      required: false,
      type: "input",
      disabled: true
    },
    {
      Tips: "Statement number",
      decorator: "StatementNumber",
      required: false,
      type: "input",
      disabled: true
    },
    {
      Tips: "Status",
      decorator: "Status",
      required: true,
      type: "select",
      options: lockedDateOptions
    },
    {
      Tips: "Locked date",
      decorator: "LockedDate",
      required: false,
      type: "select",
      initialValue: "",
      options: lockedDateOptions,
      disabled: true
    },
    {
      Tips: "Charge type",
      decorator: "ChargeType",
      required: false,
      type: "select",
      options: this.ChargeTypeOptions,
      disabled: true
    },
    {
      Tips: "Direction",
      decorator: "Direction",
      required: false,
      type: "select",
      options: this.DirectionOptions,
      disabled: true
    },
    {
      Tips: "Billing type",
      decorator: "BillingType",
      required: false,
      type: "select",
      options: this.BillingTypeOptions,
      disabled: true
    },
    {
      Tips: "Issuer",
      decorator: "Issuer",
      required: false,
      type: "input",
      disabled: true
    },
    {
      Tips: "Begin date",
      decorator: "BeginDate",
      required: false,
      type: "picker",
      disabled: true
    },
    {
      Tips: "End date",
      decorator: "EndDate",
      required: false,
      type: "picker",
      disabled: true
    }
  ];
  /* 筛选栏 button-数据
         @param name: button 名字
         @param icon: button 图标
      */
  private Formscreening: any[] = [
    {
      name: "Generate"
    },
    {
      name: "Export"
    },
    {
      name: "Reset"
    }
  ];

  // 高级搜索 Search -> 回调
  public SearchOk(formData: any) {
    this.searchData = formData;
    if (
      formData["BeginDate"] &&
      formData["EndDate"] &&
      moment(formData["BeginDate"]).valueOf() >
        moment(formData["EndDate"]).valueOf()
    ) {
      this.$message.warning("开始时间不能大于结束时间");
      return;
    }
    setTimeout(() => {
      this.data = data.filter((item: any) => {
        let isFilter = true;
        for (let key in formData) {
          if (key != "BeginDate" && key != "EndDate") {
            if (formData[key] && item[key] != formData[key]) {
              isFilter = false;
            }
          }
          if (
            !(
              (formData["BeginDate"]
                ? moment(formData["BeginDate"])
                : moment("1970-01-01")) <
                moment(item["EndDate"]).add(1, "days") &&
              moment(formData["EndDate"]) > moment(item["BeginDate"])
            )
          ) {
            isFilter = false;
          }
        }
        return isFilter;
      });
    }, 500);
  }

  public selectChange(formData: any, name: string) {
    const ref: any = this.$refs;
    this.commomBaseInfoSelectChange(
        formData,
        this.formOptions,
        this.$refs.AdvancedSearch,
        name
      );
    // for (let i in this.formOptions) {
    //   if (this.formOptions[i].name == "BillingType") {
    //     for (let j in this.formOptions[i].options) {
    //       let obj = this.formOptions[i].options[j];
    //     }
    //   }
    // }
  }

  public monthPickerChange(formData: any) {}

  // 修改按钮可否点击
  private changeDisable(selectedRows: any) {
    // 0 edit   1 export
    if (selectedRows.length === 1) {
      this.selectedBtn[0].disabled = false;
      this.selectedBtn[1].disabled = false;
    } else if (selectedRows.length > 1) {
      this.selectedBtn[0].disabled = true;
      this.selectedBtn[1].disabled = false;
    } else {
      this.selectedBtn[0].disabled = true;
      this.selectedBtn[1].disabled = true;
    }
  }

  /* 用户手动选择/取消选择所有列的回调  Table -> 回调 */
  public onSelectAll(selected: any, selectedRows: any, changeRows: any) {
    console.log(selected, selectedRows, changeRows);
    this.changeDisable(selectedRows);
  }

  /* 用户手动选择/取消选择某列的回调
           @param record: 选中数据
           @param selected: 是否选中 true/false
           @param selectedRows: 所有选中 Array
        */
  public onSelect(record: object, selected: boolean, selectedRows: any) {
    this.changeDisable(selectedRows);
  }

  /* 点击切换页 分页(pagination) -> 回调 */
  public onChang(pageSize: number) {
    // console.log(pageSize)
  }

  /* 选择当前列表显示多少列
          @param: current  : 当前页
          @param：pageSize : 当前显示多少列
       */
  public onShowSizeChange(current: number, pageSize: number): void {
    // console.log(current, pageSize)
  }

  /* 操作栏点击 -> 回调 */
  public activeClick(msg: any) {}

  /* 校验所有 */
  handlesaveAll() {
    // console.log("校验开始");
  }

  /* 退出 */

  private rowClassName(record: any, index: any) {
    if (record.te) {
      return "left";
    }
    return "";
  }

  private onSelectClick(activeObJ: any, selected: any, selectedData: any) {
    if (activeObJ.index) {
      // Export
      const filterData = selectedData.map((item: any) => {
        let newItem = JSON.parse(JSON.stringify(item));
        delete newItem.key;

        for (let key in newItem) {
          let find: any;

          switch (key) {
            case "Service":
              find = this.formOptions[0]["options"].find(
                (inner: any) => inner.value === item[key]
              );
              break;
            case "Account":
              find = this.formOptions[1]["options"].find(
                (inner: any) => inner.value === item[key]
              );
              break;
            case "Status":
              find = lockedDateOptions.find(
                (inner: any) => inner.value === item[key]
              );
              break;
            case "LockedDate":
              find = lockedDateOptions.find(
                (inner: any) => inner.value === item[key]
              );
              break;
            case "ChargeType":
              find = this.ChargeTypeOptions.find(
                (inner: any) => inner.value === item[key]
              );
              break;
            case "BillingType":
              find = this.BillingTypeOptions.find(
                (inner: any) => inner.value === item[key]
              );
              break;
            case "Direction":
              find = this.DirectionOptions.find(
                (inner: any) => inner.value === item[key]
              );
              break;
          }
          if (find) {
            newItem[key] = find.name;
          }
        }
        return newItem;
      });
      const ws: xlsx.WorkSheet = xlsx.utils.json_to_sheet(filterData);
      /* generate workbook and add the worksheet */
      const wb: xlsx.WorkBook = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(wb, ws, "Sheet1");
      // console.log(wb)
      /*  if(!wb.Props) wb.Props = {};
                    wb.Props.Title = "Insert Title Here"+res;*/
      /* save to file */
      xlsx.writeFile(wb, `Statement_Status_Record.xlsx`);
      // this.openDownloadDialog(this.sheet2blob(sheet), `Status_${moment().format('YYYYMM')}.xlsx`);
    } else {
      // Edit
      if (selectedData.length > 1) {
        this.$warning({
          title: "Warning!",
          content:
            "The data cannot be edited,you can not checked more than one",
          onOk() {},
          onCancel() {}
        });
        return;
      }
      this.selectkeyIndex = selected;
      this.selectkeyArr = selectedData;
      // console.log(activeName, selected, selectedData)
      const data = Object.assign({}, selectedData[0], {
        EndDate: moment(selectedData[0].EndDate),
        BeginDate: moment(selectedData[0].BeginDate)
      });
      this.visible = true;
      // this.editFormOptions.forEach((item: any) => {
      //   item.initialValue = data[item.decorator]
      // })
      // 判断status状态，判断是否禁止选择里面的选择项
      const status = [[1, 2], [2, 3], [3, 4], [4]];
      lockedDateOptions.forEach((item: any) => {
        item.disabled = !status[selectedData[0].Status - 1].includes(
          item.value
        );
      });
      this.$nextTick(() => {
        const ref: any = this.$refs;
        ref.formGroup.setFieldsValue(data);
      });
    }
  }

  private save() {
    const formGroup: any = this.$refs.formGroup;
    const formData: any = formGroup.getFieldsValue();
    const baseInfoData = formGroup.validateFields();
    const AdvancedSearch: any = this.$refs.AdvancedSearch;
    const AdvancedSearcFormData: any = AdvancedSearch.getFieldsValue();
    const index: number = this.selectkeyIndex;
    if (baseInfoData) {
      let concatData: any = Object.assign({}, this.selectkeyArr[0], {
        Status: formData.Status,
        LockedDate:
          formData.Status === 2
            ? moment(undefined).format("YYYYMMDD")
            : formData.LockedDate,
        LastModified: moment(undefined).format("YYYY-MM-DD HH:mm:ss")
      });
      data[index] = concatData;
      this.SearchOk(AdvancedSearcFormData);
      this.visible = false;
    }else {
      return
    }
  }

  private handleReturn() {
    this.visible = !this.visible;
  }

  public async created() {
    let AccountOptions = await getAccountOptions();
    let ServiceOptions = await getServiceOptions();
    this.columns[0]["options"] = ServiceOptions;
    this.formOptions[0]["options"] = ServiceOptions;
    this.columns[1]["options"] = AccountOptions;
    this.formOptions[1]["options"] = AccountOptions;
  }
}
</script>

<style lang="scss">
@import "@/views/Finance/common/css/deep-modal.scss";

/*.status .ant-table-thead > tr > th, .status .ant-table-tbody > tr > td {*/
/*text-align: left;*/
/*}*/

.status .ant-table-tbody tr.left td:not(:first-child) {
  text-align: left;
}
</style><style lang="scss" scoped>
@import "@/views/Finance/common/css/Statement.scss";
@import "@/views/Finance/common/css/modal.scss";
</style>
