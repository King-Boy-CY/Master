<template>
  <a-form :form="form" class="table-input">
    <div class="code-box-demo error-exclude">
      <table class="gridtable text-center" :class="{ border }">
        <thead>
          <tr>
            <th v-for="(item,key) in inputcolumns" :key="key">
              <span :style="{color: item.require ? 'red' : ''}" v-show="item.require">*</span>
              {{item.title}}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item,key) in Arr" :key="item.key">
            <td v-for="(it,index) in item.name" :key="index" :style="{ width:it.width }">
              <a-form-item>
                <span v-if=" index <= 0 ">{{ key + 1}}</span>
              </a-form-item>
              <a-form-item>
                <a-select
                  showArrow
                  :disabled="it.disabled"
                  :getPopupContainer="triggerNode => triggerNode.parentNode"
                  :placeholder="isShowPlaceHolder?it.decorator:''"
                  v-if="it.type === 'select'||it.type === 'tags'"
                  :mode="it.type === 'tags'?'multiple':undefined"
                  :style="{minWidth:'130px'}"
                  v-decorator="getDecorator(it,{initialValue:it.initialValue || it.model},inputcolumns[index])"
                  @change="handleChange($event, it.decorator, key, key)"
                >
                  <a-select-option
                    :disabled="itn.disabled"
                    v-for="(itn,index) in it.options"
                    :value="itn.name || itn"
                    :key="index"
                  >{{itn.name || itn}}</a-select-option>
                </a-select>
                <select-input
                  @change="handleChange($event,it.decorator,key,key)"
                  :multipleCheckBoxStyle="multipleCheckBoxStyle"
                  :collapseTags="collapseTags"
                  :disabled="it.disabled"
                  v-else-if="it.type === 'tabs'"
                  :values.sync="it.initialValue"
                  ref="selectAll"
                  allShow
                  :options="it.options || []"
                  multiple
                  filterable
                  :placeholder="isShowPlaceHolder?it.decorator:''"
                  class="width-100"
                  :getPopupContainer="triggerNode => triggerNode.parentNode"
                  v-decorator="getDecorator(it,{initialValue:it.initialValue || it.model || [] },inputcolumns[index])"
                />
                <a-date-picker
                  :format="'YYYY-MM-DD'"
                  :disabled="it.disabled"
                  :getCalendarContainer="triggerNode => triggerNode.parentNode"
                  v-else-if="it.type === 'picker' && !it.model"
                  v-decorator="getDecorator(it,{initialValue:it.initialValue || it.model},inputcolumns[index])"
                  placeholder="YYYY-MM-DD"
                ></a-date-picker>
                <a-input
                  :maxLength="it.config&&Object.keys(it.config).length?it.config.maxLength:undefined"
                  :disabled="it.disabled"
                  @change="_inputChange"
                  @blur="inputBlur"
                  :placeholder="isShowPlaceHolder?it.decorator:''"
                  v-else-if="it.type === 'input' "
                  v-decorator="getDecorator(it,{initialValue:it.initialValue || it.model},inputcolumns[index])"
                />
              </a-form-item>
            </td>
            <td class="td-delete" style="border:0;">
              <span @click="deleteTab(key)" class="delete">
                <a-icon type="minus" />
              </span>
            </td>
          </tr>
          <div></div>
        </tbody>
      </table>
      <a-row :gutter="24" class="Row">
        <a-col :span="8"></a-col>
        <a-col :span="8">
          <span @click="Add" v-if="newAdd">
            <a-icon type="plus" />
          </span>
        </a-col>
        <a-col :span="8">
          <span @click="check" v-if="Check">Check</span>
        </a-col>
      </a-row>
    </div>
  </a-form>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Emit, Watch } from "vue-property-decorator";
import moment from "moment";
import { deepClone } from "@/assets/ts/index.ts";
import { tableInputcolumnInterface, initDataInterface } from "./interface";
@Component({
  components: {
    selectInput: () => import("@/common/selectInput/index.vue")
  }
})
export default class TableInput extends Vue {
  // 使用请看 inputcolumns 和 initData
  // 例如
  // [{
  //       title: "No.",
  //       dataIndex: "No",
  //       key: "No",
  //     },
  //     {
  //       title: "ChargeItem",
  //       dataIndex: "chargeItem",
  //       type: "tabs",
  //       require: true,
  //       width: '200px',
  //       initialValue: [],
  //       options: []
  //     },{
  //       title: "Amount",
  //       dataIndex: "Amount",
  //       type: "input",
  //     }]
  @Prop(Array) private inputcolumns!: tableInputcolumnInterface[]; // header
  /**
   *  initData 初始化数据 数据的key与inputcolumns的dataIndex对应
   *  例：private initData：string[] = [
   *   {
   *      chargeItem: 1,
   *      Amount: 2,
   *   }];
   */
  @Prop({
    type: Array
  })
  initData?: Array<initDataInterface>;

  @Prop(Boolean) private border?: boolean; //是否显示边框
  @Prop({
    type: Boolean,
    default: true
  })
  private Check?: any; // 是否需要校验？
  @Prop({
    type: Boolean,
    default: true
  })
  private newAdd?: any; // 是否需要新增？
  @Prop({
    type: String,
    default: "center"
  })
  private align?: string; // 表格对齐方式 -> left,center,right 默认center
  @Prop({
    type: Boolean,
    default: false
  })
  private btnDisabled?: any; // 是否禁止按钮点击
  @Prop({
    type: Boolean,
    default: false
  })
  public isShowPlaceHolder?: boolean; //是否显示占位符
  @Prop({
    type: Boolean,
    default: false
  })
  collapseTags?: boolean; // 省略显示多选择下拉框的项

  @Prop(String) private multipleCheckBoxStyle?: string; // 多选框的class传值
  @Emit("success") success(val: any) {} // 校验成功触发
  @Emit("inputBlur") inputBlurs<T>(val: T, id: T) {} // 输入框失焦触发
  @Emit("select") onSelect(
    val: string,
    name: string,
    index: number,
    colIndex: number
  ) {}
  @Emit("addChange") addChange() {}
  @Emit("deleteChange") deleteChange(data: any): any {}
  @Emit("inputChange") inputChange(val: any): any {} // 输入框输入触发

  // 用于监听初始化数据
  @Watch("initData", {
    deep: true,
    immediate: true // 立即执行
  })
  onInitData(newVal: any, oldVal: any) {
    this.initDataAndColums(newVal, true);
  }
  public inputBlur(val: any) {
    let ev: any = event;
    this.inputBlurs<String>(val.target.value, val.target.id);
    // console.log(ev.target)
  }

  private Arr: any[] = [];
  private form: any; // form表单
  private keys: number = 0;
  private timer: number = 0; // 计时器

  /* 给form 添加当前实例 */
  private beforeCreate() {
    this.form = this.$form.createForm(this);
  }

  public getDecorator(item: any, configObject: any, inputcolumn: any): any[] {
    return [
      item.decorator,
      {
        rules: [
          {
            required: item.required || item.require,
            message:
              (inputcolumn.title || inputcolumn.dataIndex || item.decorator) +
              `field should be no-null`
          },
          ...(item.pattern || item.min || item.max || item.len || item.dataType
            ? [
                {
                  pattern: item.pattern,
                  min: item.min,
                  max: item.max,
                  len: item.len,
                  message: item.message || 
                  'no message',
                  type: item.dataType
                }
              ]
            : []),
          ...(item.isCheckNumber
            ? [
                {
                  validator: this.isCheckNumber
                }
              ]
            : []),
          ...((configObject && configObject.rules) || []),
          ...(item.rules && item.rules instanceof Array ? item.rules : [])
        ],
        initialValue:
          (configObject && configObject.initialValue) ||
          item.initialValue ||
          undefined
      }
    ];
  }
  public isCheckNumber(rule: any, value: any, callback: any) {
    if (!value) {
      return callback();
    }
    let pattern = /^\d*$/;
    if (!pattern.test(value)) {
      callback("Only numbers can be entered");
    } else {
      callback();
    }
  }

  /* select 回调 */
  public handleChange(
    val: string,
    name: string,
    index: number,
    colIndex: number
  ) {
    this.onSelect(val, name, index, colIndex);
  }

  /* 校验 */
  public check() {
    this.form.validateFields((err: any, value: any) => {
      if (!err) {
        // value.date = !!(value.date) && moment(value.date['_d']).format('YYYY-MM-DD');
        value.date = value.date ? value.date.format("YYYY-MM-DD") : undefined;
        this.success(this.processingData(value));
      }
    });
  }

  /* 字段-数据处理 */
  public processingData(value: any) {
    if (!value) return;
    const Arr: any[] = this.Arr;
    let arr: any = [];
    const inputcolumns: any = this.inputcolumns;
    Arr.forEach((elem: any, index) => {
      const item = elem.name;
      let processingObj: any = {};
      // console.log(item.length,Arr)
      for (let i = 0; i < item.length; i++) {
        const element = item[i];
        // console.log(element)
        if (element.decorator) {
          processingObj[inputcolumns[i]["dataIndex"]] =
            value[element.decorator] || undefined;
        }
      }
      arr.push(processingObj);
    });
    return arr;
  }

  /* ADD 增加数据行 */
  public Add() {
    if (this.btnDisabled) return false;
    if (!this.Arr || !this.Arr.length) return;
    const deep: any = deepClone(this.Arr[0]);
    const key = new Date().getTime();
    deep.key = ++this.keys;
    deep.name.forEach((deepNameItem: any, deepIndex: number) => {
      if (deepNameItem.children && deepNameItem.children.length) {
        deepNameItem.children.forEach((item: any, index) => {
          if (item.decorator) {
            const match = item.decorator.match(/[a-zA-Z]+/);
            if (match) {
              item.decorator = match[0] + key + index;
            }
          }
          item.initialValue = undefined;
        });
      }
      if (deepNameItem.decorator) {
        const match = deepNameItem.decorator.match(/[a-zA-Z]+/);
        if (match) {
          deepNameItem.decorator = match[0] + key + deepIndex;
        }
      }
      if (this.inputcolumns) {
        // 找出初始值
        const find: any = this.inputcolumns.find(
          (item: any, index: number) => item.dataIndex == deepNameItem.dataIndex
        );
        deepNameItem.initialValue = (find && find.initialValue) || undefined;
      }
    });
    // console.log('deep', deep);
    this.Arr.push(deep);
    this.addChange();
  }

  private init(inputdata: any[]) {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(() => {
      // console.log("this.inputcolumns", this.inputcolumns);
      // console.log("inputdata", inputdata);
      if (!this.inputcolumns) {
        return;
      }
      const originObject = this.inputcolumns.reduce(
        (sums: any, item: any, index: any) => {
          sums[item.dataIndex] = item.initialValue;
          return sums;
        },
        {}
      );
      let TestArr: any[] = [];
      const timeKey: any = new Date().valueOf();
      for (let i = 0; i < this.inputcolumns.length; i++) {
        const res: any = this.inputcolumns[i];
        let j = 0;
        // 至少执行一次 没数据则生成了一行空数据
        do {
          // 与原始数据合并
          const item: any = Object.assign(
            {},
            deepClone(originObject),
            (inputdata.length && inputdata[j]) || undefined
          );
          for (let dataIndex in item) {
            // 数据 item[dataIndex]
            if (res.dataIndex == dataIndex) {
              // deepClone(res)
              TestArr.push(
                Object.assign({}, res, {
                  decorator: res.dataIndex
                    ? res.dataIndex + timeKey + j
                    : undefined,
                  initialValue: item[dataIndex],
                  ...(!res.type ? { num: this.keys + 1 } : {})
                })
              );
              continue;
            }
          }
          j++;
        } while (j < inputdata.length);
      }
      this.Arr.push({
        name: TestArr,
        key: this.keys
      });
      this.keys++;
      console.log("this.Arr", this.Arr);
    }, 100);
  }

  public initDataAndColums(inputdata: any, isInit: boolean = true): any {
    if (!this.inputcolumns)
      return this.$message.warning("请配置组件表格表头数据来源");
    // if (!inputdata) return this.$message.warning("请配置组件表格身体数据来源");
    isInit && this.reset();
    this.init(inputdata);
  }

  public reset() {
    this.$set(this, "Arr", []);
    this.form = this.$form.createForm(this);
  }

  public created() {}

  // 获取所有数据方法 isNotVerify 是否不验证
  public getData(isNotVerify?: boolean): any[] {
    let val;
    if (isNotVerify) {
      return this.processingData(this.form.getFieldsValue());
    }
    this.form.validateFields((err: any, value: any) => {
      if (!err) {
        value.date =
          !!value.date && moment(value.date["_d"]).format("YYYY-MM-DD");
        val = value;
      }
    });
    return this.processingData(val);
  }

  /* 删除表格某一行 */
  public deleteTab(key: number) {
    if (this.btnDisabled || this.Arr.length <= 1) return false;
    this.Arr.splice(key, 1);
    this.$nextTick(() => {
      const data = this.form.getFieldsValue();
      this.deleteChange(this.processingData(data));
    });

    console.log("this.Arr", this.Arr);
  }

  /* 输入框输入触发 */
  public _inputChange(e: any) {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(() => {
      this.inputChange(this.processingData(this.form.getFieldsValue()));
    }, 500);
  }

  public getFieldsValue(object?: object) {
    return this.form.getFieldsValue(object);
  }
}
</script>

<style lang="scss" scoped>
.gridtable {
  font-family: "Chinese Quote", -apple-system, BlinkMacSystemFont, "Segoe UI",
    "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue",
    Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
    "Segoe UI Symbol";
  font-size: 14px;
  font-variant: tabular-nums;
  line-height: 1.5;
  color: rgba(0, 0, 0, 0.65);
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  list-style: none;
  position: relative;
  width: 100%;
}

table.border tr th,
table.border tr td {
  border: 1px solid rgb(221, 224, 241);
}

table.gridtable th {
  transition: background 0.3s ease;
  color: rgba(0, 0, 0, 0.85);
  font-weight: 500;
  border-bottom: 1px solid #e8e8e8;
  padding: 8px;
  /*background: rgb(233, 234, 243);*/
  background: #eff5ff;
  /*vertical-align: middle;*/
}

table.gridtable td {
  padding: 0px 8px;
  background-color: #ffffff;

  .ant-form-item {
    margin: 0;
  }
}

.td-delete {
  vertical-align: middle;
}

.delete {
  display: inline-block;
  background: #f5b148;
  width: 24px;
  height: 24px;
  line-height: 24px;
  border-radius: 50%;
  text-align: center;
  cursor: pointer;
  color: #fff;
  transition: all 0.3s ease-in;

  &:hover {
    background: #f5970f;
  }
}

.Row {
  padding: 15px 0px;
  transition: all 0.2s;
  text-align: center;

  span {
    cursor: pointer;
  }

  div:nth-child(1) span {
    color: rgb(64, 120, 216);
    font-size: 18px;
    font-weight: 600;
  }

  div:nth-child(2) span {
    border-radius: 50px;
    display: inline-block;
    width: 100px;
    /*background: rgb(62, 119, 216);*/
    background: #a3c3ff;
    color: #fff;
    padding: 2px;
    transition: all 0.3s ease-in;

    &:hover {
      background: #5f8eff;
    }

    i {
      font-size: 17px;
    }
  }

  div:nth-child(3) span {
    border-radius: 50px;
    display: inline-block;
    background: rgb(62, 119, 216);
    color: #fff;
    padding: 2px;
    width: 80px;

    &:hover {
      opacity: 0.8;
    }
  }
}
</style>
<style>
.table-input .el-input--suffix .el-input__inner {
  height: 32px !important;
  line-height: 32px !important;
}
</style>