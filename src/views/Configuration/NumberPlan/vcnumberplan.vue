<template>
  <div>
    <!-- 高级搜索 -->
    <Advanced-search ref="searchref"
                     :formoptions="formOptions"
                     :isChildName="true"
                     @Submit="SearchOk"
                     allowClear
                     childDataKey="contractfoVOList" />
    <!-- :data="contractDatas" -->
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

    <!-- Add -->
    <Model align-title="center"
           v-if="activeIndex === 1 && visible"
           v-model="visible"
           shade
           title="Add VC number plan"
           @Screencover="Screencover">
      <template slot="model-body">
        <div>
          <div style="background:#fff;padding:0px 0px;">
          </div>
          <div class="menu-child">
            <Number-planadd ref="numberPlanAdd"></Number-planadd>
          </div>
        </div>
      </template>
      <template slot="model-footer">
        <a-row>
          <a-col :span="24"
                 :style="{ textAlign: 'center' }">
            <div style="margin-top:10px;">
              <a-button type="primary"
                        style="border-radius: 50px;min-width: 75px"
                        @click="addAllData">
                Save
              </a-button>
              <a-button :style="{ marginLeft: '8px', color: '#1890ff', borderRadius: '50px 50px 50px 50px', fontWeight: '600' }"
                        @click="handleReruen">
                Return
              </a-button>
            </div>
          </a-col>
        </a-row>
      </template>
    </Model>
    <!-- Edit 模态框弹出 -->
    <Model align-title="center"
           v-if="activeIndex === 2 && visible"
           v-model="visible"
           shade
           title="Edit VC number plan"
           @Screencover="Screencover">
      <template slot="model-body">
        <div>
          <div style="background:#fff;padding:0px 0px;">
          </div>
          <div class="menu-child">
            <Number-plan-edit ref="numberPlanEdit"
                              :numberPlanId="numberPlanId"
                              :numberPlanStatus="numberPlanStatus"
                              :responseDate="responseDate"></Number-plan-edit>
          </div>
        </div>
      </template>
      <template slot="model-footer">
        <a-row>
          <a-col :span="24"
                 :style="{ textAlign: 'center' }">
            <div style="margin-top:10px;">
              <a-button type="primary"
                        style="border-radius: 50px;min-width: 75px"
                        @click="editAllData">
                Save
              </a-button>
              <a-button :style="{ marginLeft: '8px',color: '#1890ff', borderRadius: '50px 50px 50px 50px', fontWeight: '600' }"
                        @click="handleReruen">
                Return
              </a-button>
            </div>
          </a-col>
        </a-row>
      </template>
    </Model>
    <!-- upload 模态框弹出 -->
    <Model align-title="center"
           v-if="activeIndex === 4 && visible"
           v-model="visible"
           shade
           title="Upload VC number plan"
           @Screencover="Screencover">
      <template slot="model-body">
        <div>
          <div style="background:#fff;padding:0px 0px;">
          </div>
          <div class="menu-child">
            <!-- <input type="file">Upload -->
            <upload :formoptions="uploadOptions"
                    @uploadVcNumberPlanData="uploadVcNumberPlanData"
                    ref="uploadRef"></upload>
          </div>
        </div>
      </template>
      <template slot="model-footer">
        <a-row>
          <a-col :span="24"
                 :style="{ textAlign: 'center' }">
            <div style="margin-top:10px;">
              <a-button type="primary"
                        style="border-radius: 50px;min-width: 75px"
                        @click="uploadData">
                Save
              </a-button>
              <a-button :style="{ marginLeft: '8px',color: '#1890ff', borderRadius: '50px 50px 50px 50px', fontWeight: '600' }"
                        @click="handleReruen">
                Return
              </a-button>

            </div>
          </a-col>
        </a-row>
      </template>
    </Model>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import {
  Component
} from "vue-property-decorator";
import {
  Axios
} from "@/api/axios";
import {
  getDetailAccounts,
  getDetailService,
  VcNumberPlanCountries,
  VcNumberPlanDialedDigits,
  VcNumberPlanDestinations,
  VcNumberPlanTableSearch,
  VcNumberPlanEditor,
  VcNumberPlanSave,
  VcNumberPlanEditSave,
  VcNumberPlanDelete,
} from "@/api/index.ts";
import moment from "moment";
import qs from "qs";
import xlsx from "xlsx";
@Component({
  components: {
    AdvancedSearch: resolve =>
      require(["@/common/Advancedsearch/index.vue"], resolve),
    Model: resolve => require(["@/common/Model/index.vue"], resolve),
    NumberPlanadd: resolve =>
      require(["@/views/Configuration/NumberPlan/NumberPlanadd"], resolve),
    NumberPlanEdit: resolve =>
      require(["@/views/Configuration/NumberPlan/NumberPlanEdit"], resolve),
    Table: () => import("@/views/Finance/components/Table/index.vue"),
    upload: () => import("./upload.vue")
  }
})
export default class VcContract extends Vue {
  private Save: string = "&nbsp;&nbsp;Save&nbsp;&nbsp;&nbsp;";
  private activeIndex: number = 0;
  private listBarEdit: any[] = [{
      name: "Contract Details Edit",
      cName: "contractDetailEdit"
    },
    {
      name: "Service Edit",
      cName: "serviceEdit"
    },
    {
      name: "Cycle Edit",
      cName: "cycleEdit"
    },
    {
      name: "RatePlan Edit",
      cName: "ratePlanEdit"
    },
    {
      name: "Product Edit",
      cName: "productEdit"
    }
  ];
  private onSelectClick(activeObJ: any, selected: any, selectedData: any) {
    console.log(activeObJ);
    console.log(selected);
    console.log(selectedData);
  }
  private activeInAdd: number = 0; //add 默认弹框下标
  private activeSelect: string = "NumberPlanadd";
  private activeInEdit: number = 0; //edit 默认弹框下标
  private detailResMsgAdd: any; // Add Detail 页面接口数据
  private productName: any; //product 页面数据
  private activeSelectAdd: string = "contractDetials"; //add 动态组件切换
  private activeSelectEdit: string = "contractDetailEdit"; //edit 动态组件切换
  private columns: any[] = [{
      title: "Number Plan name",
      dataIndex: "numberPlanName",
      key: "numberPlanName",
      width: 200,
      sorter: (a, b) => a.numberPlanName.toUpperCase().localeCompare(b.numberPlanName.toUpperCase())
    },
    {
      title: "Destination",
      dataIndex: "destinationName",
      key: "destinationName",
      width: 210,
      sorter: (a, b) => a.destinationName.toUpperCase().localeCompare(b.destinationName.toUpperCase())
    },
    {
      title: "Dest.Type",
      dataIndex: "destinationType",
      key: "destinationType",
      customRender: (value: any, row: any, index: any) => {
        const obj = {
          children: value
        };
        const find: any = this.destinationTypeOptions.find(
          (item: any) => item.value === value
        );
        if (find) {
          obj.children = find.name;
        }
        return obj;
      },
      width: 100
    },
    {
      title: "Dialed digits",
      dataIndex: "dialedDigitsList",
      key: "dialedDigitsList",
      width: '26%',
      scopedSlots: {
        customRender: "commaSplitNumber"
      }
    },
    {
      title: "Country code",
      dataIndex: "countryCode",
      key: "countryCode",
      width: 100
    },
    {
      title: "Country",
      dataIndex: "countryName",
      key: "countryName",
      width: 100,
      sorter: (a, b) => {
        if (!a.countryName) {
          return 1
        } else if (!b.countryName) {
          return -1
        }
        return a.countryName.toUpperCase().localeCompare(b.countryName.toUpperCase())
      }
    },
    {
      title: "Rounding rules",
      dataIndex: "roundingRuleName",
      key: "roundingRuleName",
      width: 100
    },
    {
      title: "Status",
      dataIndex: "numberPlanStatus",
      key: "numberPlanStatus",
      customRender: (value: any, row: any, index: any) => {
        const obj = {
          children: value
        };
        const find: any = this.numberPlanStatusOptions.find(
          (item: any) => item.value === value
        );
        if (find) {
          obj.children = find.name;
        }
        return obj;
      },
      width: 100,
      sorter: (a, b) => {
        let valA = a.numberPlanStatus
        let valB = b.numberPlanStatus
        if (valA === 3) {
          valA = 1
        } else if (valA === 1) {
          valA = 3
        }
        if (valB === 3) {
          valB = 1
        } else if (valB === 1) {
          valB = 3
        }
        return valA - valB
      }
    },
    {
      title: "Begin date",
      dataIndex: "beginDate",
      key: "beginDate",
      width: 100
    },
    {
      title: "End date",
      dataIndex: "endDate",
      key: "endDate",
      width: 100
    },
    {
      title: "Modified by",
      dataIndex: "modifiedBy",
      key: "modifiedBy",
      width: 100
    },
    {
      title: "Last modified",
      dataIndex: "lastModified",
      key: "lastModified",
      width: 100
    }
  ];
  private contractDatas: any[] = [];
  private destinationTypeOptions: any = [{
      name: "Mobile",
      value: 1
    },
    {
      name: "Fixed",
      value: 2
    }
  ];
  private numberPlanStatusOptions: any = [{
      name: "Expired",
      value: 1
    },
    {
      name: "Active",
      value: 2
    },
    {
      name: "Future",
      value: 3
    },
    {
      name: "Invalid",
      value: 4
    }
  ];
  private data: any[] = [];
  private formOptions: any[] = [{
      Tips: "Account",
      name: "accountName",
      required: false,
      type: "select",
      span: 8,
      options: null
    },
    {
      Tips: "Service",
      name: "configServiceName",
      required: false,
      type: "select",
      span: 8,
      options: null
    },
    {
      Tips: "Direction",
      name: "direction",
      required: false,
      type: "select",
      span: 8,
      options: [{
          name: "Inbound",
          value: 1
        },
        {
          name: "Outbound",
          value: 2
        }
      ]
    },
    {
      Tips: "Destination",
      name: "destinationNames",
      required: false,
      type: "tags",
      showSearch: true,
      span: 8,
      options: null
    },
    {
      Tips: "Dest.type",
      name: "destinationType",
      required: false,
      type: "select",
      span: 8,
      options: [{
          name: "Mobile",
          value: 1
        },
        {
          name: "Fixed",
          value: 2
        }
      ]
    },
    {
      Tips: "Country",
      name: "countryName",
      required: false,
      type: "select",
      span: 8,
      options: null
    },
    {
      Tips: "Dialed digits",
      name: "dialedDigits",
      showSearch: true,
      required: false,
      type: "tags",
      span: 8,
      options: null
    },
    {
      Tips: "Status",
      name: "numberPlanStatus",
      required: false,
      type: "select",
      span: 8,
      options: [{
          name: "Expired",
          value: 1
        },
        {
          name: "Active",
          value: 2
        },
        {
          name: "Future",
          value: 3
        },
        {
          name: "Invalid",
          value: 4
        }
      ]
    },
    {
      Tips: "Begin date",
      name: "beginDate",
      required: false,
      span: 8,
      type: "picker"
    },
    {
      Tips: "End date",
      name: "endDate",
      required: false,
      span: 8,
      type: "picker"
    }
  ];
  private uploadOptions: any[] = [{
      Tips: "Account",
      name: "Account",
      required: true,
      type: "select",
      options: null
    },
    {
      Tips: "Service",
      name: "Service",
      required: true,
      type: "select",
      options: null
    },
    {
      Tips: "Direction",
      name: "Direction",
      required: true,
      type: "select",
      options: [{
          name: "Inbound",
          value: 1
        },
        {
          name: "Outbound",
          value: 2
        }
      ]
    },
    {
      Tips: "NumberPlanName",
      name: "Number plan name",
      required: true,
      disabled: true,
      type: "input",
      options: null
    },
    {
      Tips: "EffectiveDate",
      name: "Effective date",
      required: true,
      disabled: false,
      type: "picker",
      options: null
    },
    {
      Tips: "Upload",
      name: "Upload",
      required: true,
      disabled: false,
      type: "upload",
      options: null,
      accept: ".xlsx",
      multiple: true
    }
  ];
  private Formscreening: any[] = [
    {
      name: "Add",
      icon: "plus-circle",
      index: 1
    },
    {
      name: "Edit",
      icon: "form",
      index: 2,
      disabled: true,
      tips: "Single for editing"
    },
    {
      name: "Delete",
      icon: "delete",
      index: 3,
      disabled: true
    },
    {
      name: "Upload",
      icon: "upload",
      index: 4
    },
    {
      name: "Export",
      icon: "export",
      index: 7,
      disabled: true
    },
    // {
    //   name: 'Download',
    //   icon: 'download',
    //   index: 7
    // }
  ];
  private formoptionsAudit: any[] = [{
      name: "Contract",
      Tips: "Contract",
      required: true,
      disabled: false,
      initialValue: "",
      type: "select",
      options: []
    },
    {
      name: "Approved",
      Tips: "Approved",
      required: true,
      type: "select",
      options: [{
          name: "Yes",
          value: 1
        },
        {
          name: "No",
          value: 0
        }
      ]
    },
    {
      name: "Reason",
      Tips: "Reason",
      required: false,
      disabled: false,
      type: "input"
    }
  ];
  private form: any; //Submit
  private formAudit: any; //Audit
  public onChange() {}
  private beforeCreate() {
    this.form = this.$form.createForm(this);
    this.formAudit = this.$form.createForm(this);
  }
  // 高级搜索 Search -> 回调
  public SearchOk(values ? : any): void {
    console.log(values);

    let data: any = {
      params: Object.assign({}, values, {
        // destinationType: values.destinationType && values.destinationType.length > 0 ? values.destinationType.join(',') : undefined,
        dialedDigits: values.dialedDigits && values.dialedDigits.length > 0 ?
          values.dialedDigits.join(",") : undefined,
        destinationNames: values.destinationNames && values.destinationNames.length > 0 ?
          values.destinationNames.join(",") : undefined,
          beginDate: values.beginDate ? values.beginDate.format('YYYY-MM-DD') : undefined,
                endDate: values.endDate ? values.endDate.format('YYYY-MM-DD') : undefined,
      })
    };
    console.log("data1111111", data);

    VcNumberPlanTableSearch(data).then((res: any) => {
      console.log(res);
      // res.data.forEach((item: any, index: number) => {
      //   item['id'] = index
      // })
      this.data = res.data;
    });
  }
  /* 用户手动选择/取消选择所有列的回调  Table -> 回调 */
  private selectedRows: any;
  public onSelectAll(selected: boolean, selectedRows: any, changeRows: any) {
    // edit 按钮的disabled状态
    if (selectedRows.length === 1) {
      this.$set(this.Formscreening[1], "disabled", false);
      
    } else {
      this.$set(this.Formscreening[1], "disabled", true);
      
    }
    // if(selectedRows.length=== 0){
     
    // }
    // delete 按钮的disabled状态
    this.$set(this.Formscreening[2], "disabled", !selected);
    this.$set(this.Formscreening[4], "disabled", !selected);
    this.selectedRows = selectedRows;
  }
  private numberPlanStatus: any = "";
  public onSelect(selected: any, selectedRows: boolean, changeRows: any) {
    console.log(selected, selectedRows, changeRows);
    // selectedRows保存选择之后的所有表格行数据
    this.selectedRows = changeRows;
    if (changeRows.length > 0) {
      // edit的功能
      this.numberPlanId = changeRows[0].id;
      this.numberPlanStatus = changeRows[0].numberPlanStatus;
      this.$set(
        this.Formscreening[1],
        "disabled",
        changeRows.length === 1 ? false : true
      );
      // delete 按钮的disabled状态
      this.$set(this.Formscreening[2], "disabled", false);
      this.$set(this.Formscreening[4], "disabled", false);
    } else {
      // delete 按钮的disabled状态
      this.$set(this.Formscreening[2], "disabled", true);
      this.$set(this.Formscreening[4], "disabled", true);
      // edit 按钮的disabled状态
      this.$set(this.Formscreening[1], "disabled", true);
    }
    // edit的功能
    if (this.numberPlanStatus === 4) {
      this.$set(this.Formscreening[1], "disabled", true);
    }
  }
  public AuditChange(val: any, name: string, key ? : number) {
    console.log("val", val, "name", name);
    if ((val = "Approved" && name == "Yes")) {
      console.log(111);

      this.$set(this.formoptionsAudit[2], "disabled", name == "Yes");
      console.log(this.formoptionsAudit[2]);
    } else {
      false;
      this.$set(this.formoptionsAudit[2], "disabled", false);
    }
  }
  /* Audit 内 下拉按下触发 */
  public dropdownAudit(name: string, open: boolean, key ? : number) {}
  private detailsId: any; //单选
  private detailsIds: any; //多选

  /* 下拉按下触发 */
  public dropdownVisibleChange(name: string, open: boolean, key: number) {}
  /* 下拉选中 */
  public handleChange(val: any, name: string, key: number) {
    console.log("val", val, "name", name);
  }
  /* 点击切换页 分页(pagination) -> 回调 */
  public onChang(pageSize: number) {
    // console.log(pageSize)
  }
  /* Add 选项卡 */
  public activeAdd(tab: any, item: any) {
    // console.log(tab,item);

    this.activeInAdd = tab;
    this.activeSelectAdd = item;
  }
  /**Edit 选项卡 */
  public activeEdit(tab: any, item: any) {
    // console.log(tab,item);

    this.activeInEdit = tab;
    this.activeSelectEdit = item;
  }

  public created() {
    getDetailAccounts().then((res: any) => {
      this.formOptions[0]["options"] = res.data;
      this.uploadOptions[0]["options"] = res.data.map((item: any) => {
        return {
          name: item,
          value: item
        }
      })
    });
    getDetailService().then((res: any) => {
      this.formOptions[1]["options"] = res.data;
      this.uploadOptions[1]["options"] = res.data.map((item: any) => {
        return {
          name: item,
          value: item
        }
      })
    });
    VcNumberPlanCountries().then((res: any) => {
      console.log(res.data);
      res.data.unshift("-");
      this.formOptions[5]["options"] = res.data.map((item: any, i: number) => {
        return item;
      });
      console.log(this.formOptions[5]["options"]);
    });
    VcNumberPlanDialedDigits().then((res: any) => {
      this.formOptions[6]["options"] = res.data;
    });
    this.requestDestinationData();
  }
  // 请求destination的数据
  public requestDestinationData() {
    VcNumberPlanDestinations().then((res: any) => {
      console.log(res);

      this.formOptions[3]["options"] = res.data;
    });
  }

  /* 获取新增合同所有数据 */
  public async addAllData() {
    const saveNumberPlan = await (this.$refs.numberPlanAdd as any).checkAll();
    console.log("saveNumberPlan", saveNumberPlan);
    if (!saveNumberPlan) return;
    console.log("pass");
    VcNumberPlanSave(saveNumberPlan).then((res: any) => {
      console.log(res);
      if (res.code > 0) {
        this.$message.success(res.msg);
        this.handleReruen();
        (this.$refs.searchref as any).handleSearch();
        this.requestDestinationData();
      } else {
        // this.$Message.error(`save failed`);
      }
    });
  }
  /**export  导出 */
  public toExport(selectedData: any, name: any = 'vcnumberplan.xls', selected ? : any): void {
    const filterData = selectedData.map((item: any) => {
      let newItem = JSON.parse(JSON.stringify(item))
      delete newItem.id
      let {
        beginDate,
        countryCode,
        countryName,
        destinationName,
        destinationType,
        dialedDigitsList,
        endDate,
        lastModified,
        modifiedBy,
        numberPlanName,
        numberPlanStatus,
        roundingRuleName,
      } = newItem
      let NumberPlanName = numberPlanName;
      let DestinationName = destinationName;
      let DestType = destinationType;
      let Dialeddigits = dialedDigitsList;
      let Countrycode = countryCode;
      let Country = countryName;
      let Roundingrules = roundingRuleName;
      let Status = numberPlanStatus;
      let Begindate = beginDate;
      let Enddate = endDate;
      let Modifiedby = modifiedBy;
      let LastModifieds = lastModified;
      console.log("newItem", newItem);
      let newData = {
        NumberPlanName,
        DestinationName,
        DestType,
        Dialeddigits,
        Countrycode,
        Country,
        Status,
        Begindate,
        Enddate,
        Modifiedby,
        LastModifieds
      }
      return newData
    })
    const ws: xlsx.WorkSheet = xlsx.utils.json_to_sheet(filterData);
    /* generate workbook and add the worksheet */
    const wb: xlsx.WorkBook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');
    // console.log(wb)
    /*  if(!wb.Props) wb.Props = {};
      wb.Props.Title = "Insert Title Here"+res;*/
    /* save to file */
    xlsx.writeFile(wb, name);
  }

  public async editAllData() {
    console.log(`Edit save`);
    const saveNumberPlan = await (this.$refs.numberPlanEdit as any).checkAll();
    console.log(saveNumberPlan);

    if (!saveNumberPlan) return;
    saveNumberPlan.recordList.forEach((items: any, i: number, arr: any) => {
      for (let key in items) {
        if (!!items[key] && Array.isArray(items[key])) {
          items[key] = items[key].join("")
        }
        console.log(items[key]);
      }
    })
    console.log("pass");
    VcNumberPlanEditSave(saveNumberPlan).then((res: any) => {
      console.log('put', res);
      if (res.code > 0) {
        this.$message.success(res.msg);
        this.handleReruen();
        (this.$refs.searchref as any).handleSearch();
      }else{
       this.$message.error(res.msg);
       
      }
    });
  }
  private numberPlanId: any = "";
  private visible: any = false;
  private addEdit: object = {};
  /* 操作栏点击 -> 回调 */
  private responseDate: any[] = [];
  public async activeClick({
      name,
      index
    }: any,
    selected: any,
    selectedData: any,
    activeObJ: any
  ) {
    // console.log(name, index, selected, selectedData);
    console.log(index);
    console.log(name);

    if (name === "Add") {
      console.log(this.activeIndex);
      this.$set(this, "activeIndex", index);
      return this.$set(this, "visible", true);
    }

    if (name === "Edit") {
      this.activeIndex = index;
      console.log(this.numberPlanStatus);
      if (this.numberPlanStatus !== 4) {
        // this.$set(this.Formscreening[1],"disabled",false)

        await VcNumberPlanEditor(this.numberPlanId).then((res: any) => {
          console.log(res);
          if (res.code === 1) this.responseDate = res.data;
          // if (res.code < 1) this.$Message.error(res.msg);
        });
      } else {
        this.$set(this.Formscreening[1], "disabled", true);
        this.$Message.error(`Status for invalid record cannot be edited`);
      }
    }

    if (name === "Delete") {
      this.activeIndex = index;
      // this.Formscreening[2].disabled:
      let idArr: any = []; //id
      let statusArr: any = []; //status
      console.log(this.selectedRows);
      for (let i = 0; i < this.selectedRows.length; i++) {
        let item = this.selectedRows[i];
        idArr.push(item.id);
        statusArr.push(item.numberPlanStatus);
      }
      let paramsId = idArr.join(",");
      console.log(statusArr);
      this.$nextTick(() => {
        if (statusArr.includes(4)) {
          return this.$message.warning(`Data can not be deleted`);
        } else if (statusArr.includes(1) || statusArr.includes(2)) {
          // let url = `/config/vc-number-plan/${paramsId}`;
          let _this = this;
          this.$confirm({
            title: "Confirm!",
            content: `Continue to  deleted the data?`,
            okText: "YES",
            cancelText: "NO",
            onOk() {
              const that = this;
              VcNumberPlanDelete(paramsId).then(res => {
                console.log("Confirm", res);
                if (res.code < 0) {
                  _this.$message.error(res.msg);
                } else {
                  _this.$message.success("Data has been deleted successfully");
                  (_this.$refs.searchref as any).handleSearch();
                  // _this.$refs.searchref.handleSearch()
                }
              });
            }
          });
        } else {
          let _this = this;
          this.$confirm({
            title: "Confirm!",
            content: `Continue to  deleted the data?`,
            okText: "YES",
            cancelText: "NO",
            onOk() {
              const that = this;
              VcNumberPlanDelete(paramsId).then(res => {
                console.log("Confirm", res);
                if (res.code < 0) {
                  _this.$message.error(res.msg);
                } else {
                  _this.$message.success("Data has been deleted successfully");
                  (_this.$refs.searchref as any).handleSearch();
                  // _this.$refs.searchref.handleSearch()
                }
              });
            }
          });
        }
      });
    }

    if (name === "Export") {
      this.activeIndex = index;
      // this.$set(this.Formscreening[1], "disabled", true);
      if (activeObJ === undefined) {
        // Export
        this.toExport(selectedData, undefined, selected)
      }
    }
    if (name === "Upload") {
      this.activeIndex = index;
    }
    if (name === "Download") {
      this.activeIndex = index;
      console.log(xlsx);

    }
    (this.visible = !this.visible) && (this.activeIndex = index);

  }

  // upload点击save的回调
  public uploadData() {
    let uploadRef: any = this.$refs.uploadRef;
    uploadRef.handleSearch();
  }

  // upload接收子组件传来的表单数据
  public uploadVcNumberPlanData(formData, fieldsFile) {
    console.log(formData, fieldsFile);
    let isNotUndefined: Boolean = true;
    for (let i in formData) {
      if (!formData[i]) {
        isNotUndefined = false;
      }
    }
    if (!isNotUndefined) {
      // this.$message.warn("all messages can not null");
    } else {
      let obj: any = new FormData();
      obj.append("file", fieldsFile.file.originFileObj);
      let obj2 = {
        accountName: formData["Account"],
        configServiceName: formData["Service"],
        direction: formData["Direction"],
        numberPlanName: formData["NumberPlanName"],
        beginDate: moment(formData["EffectiveDate"]).format("YYYY-MM-DD")
      };
      Axios({
        method: "post",
        url: "/config/vc-number-plan/file?" + qs.stringify(obj2),
        data: obj,
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }).then(data => {
        console.log(data);
        let advancedSearchData = (this.$refs.searchref as any).getFieldsValue()
        console.log(advancedSearchData);
        if (data.code > 0) {
          this.$message.success("Data uploaded successfully");
          (this.$refs.searchref as any).handleSearch();
          this.handleReruen();
        } else {
          this.$message.error(`Fail to upload data`);
        }
      });
    }
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

<style>
.inner-form-group {
  /*overflow: hidden;*/
  padding: 24px;
  background: #fff;
  border-radius: 6px;
  /* box-shadow: 0px 2px 0px rgb(243, 243, 243); */
}

.inner-form-group .ant-form-item {
  display: flex;
}

.inner-form-group .ant-form-item-control-wrapper {
  flex: 1;
}

#components-form-group {
  max-width: none;
  border-radius: 4px;
  position: relative;
}

#components-form-group .ant-form-item-label {
  text-align: left;
  margin-right: 3px;
}

#components-form-group .inner-form-group .ant-form-item-label label {
  font-weight: 600;
  color: #000;
}

#components-form-group .ant-form-item-children .ant-calendar-picker {
  display: inline-block;
  width: 100%;
}

.components-table .ant-table-thead > tr > th.fixed-width,
.components-table .ant-table-tbody > tr > td {
  word-break: break-all;
}
</style><style lang="scss" scoped>
.slot-model-box {
  margin: 10px 20px;
  // background:#fff;
  box-shadow: 0px 3px 10px 0px rgb(243, 243, 243);
  border-radius: 2px;
  min-height: 300px;
  padding: 20px 5px;
}

.sRow {
  border: 1px solid rgb(62, 119, 216);
  max-width: 611px;
  margin: 0px auto;
  border-radius: 50px 50px 50px 50px;
  box-sizing: border-box;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  justify-content: space-between;
}

.sCol {
  padding: 11px 19px 11px 16px;
  border-radius: 50px 50px 50px 50px;
  color: rgb(62, 119, 216);
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgb(62, 119, 216);
    color: #ffffff;
  }
}

.active {
  transition: all 0.2s;
  background: rgb(62, 119, 216);
  color: #ffffff;
}
</style>
