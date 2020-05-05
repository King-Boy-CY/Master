<template>
  <div class="advanced-search-box">
    <div
      id="components-form-demo-advanced-search"
      class="common-advanced-search"
      :class="isNotShadow?'unset':''"
    >
      <collapse-transition>
        <a-form
          class="ant-advanced-search-form"
          :form="form"
          @submit="handleSearch"
          v-show="!expand"
        >
          <a-row :gutter="24" justify="start" type="flex" class="ant-advanced-search-form-row">
            <a-col v-for="(item,key) in formoptions" :key="key" :span="item.span || span">
              <a-form-item
                :label="item.Tips"
                :colon="false"
                :labelCol="{ span: item.colSpan || 8 }"
                :wrapperCol="{ span: 9 }"
                :hasFeedback="false"
              >
                <a-select
                  :filterOption="item.filterOption?filterOption:'' "
                  :disabled="item.disabled"
                  :getPopupContainer="e => e.parentNode"
                  :allowClear="allowClear"
                  :showSearch="item.showSearch"
                  v-if="item.type == 'select'"
                  v-decorator="getDecorator(item)"
                  :placeholder="isPlaceholder?item.Tips:''"
                  @change="selectChanges($event, item.name, undefined, key)"
                >
                  <!-- @popupScroll="selectScroll($event,item)" @search="fetchSelectSearchData($event,item)" @dropdownVisibleChange="SelectDropdownVisibleChange($event,item)" -->
                  <a-select-option
                    :value="child !== null &&  child !== undefined&&child == 0 ? 0 :child && (isChildName&&child.value || child.name || child) || undefined "
                    v-for="(child,key) in item.options"
                    :key="key"
                  >{{ child !== null && child !== undefined &&child == 0 ? 0 :child && (child.name || child) || undefined}}</a-select-option>
                </a-select>
                <a-range-picker
                  class="width-100"
                  v-decorator="getDecorator(item)"
                  :format="item.format ? item.format : 'YYYY-MM-DD'"
                  :showTime="item.showTime || false"
                  v-else-if="item.type == 'rangePicker'"
                  :ranges="{ Today: [moment(), moment()], 'This Month': [moment(), moment().endOf('month')] }"
                  @change="onChange"
                />
                <a-select
                  :getPopupContainer="e => e.parentNode"
                  mode="multiple"
                  v-else-if="item.type == 'tags'"
                  :maxTagCount="1"
                  v-decorator="getDecorator(item)"
                  :placeholder="isPlaceholder?item.Tips:''"
                  @change="handleChange"
                >
                  <!-- @popupScroll="selectScroll($event,item)" @search="fetchSelectSearchData($event,item)" @dropdownVisibleChange="SelectDropdownVisibleChange($event,item)" -->
                  <a-select-option
                    :value="child !== null &&  child !== undefined &&child == 0 ? 0 :child &&isChildName&&child.value || child.name  || child "
                    v-for="(child,key) in item.options"
                    :key="key"
                  >{{ child !== null && child !== undefined &&child == 0 ? 0 : child && (child.name || child) || undefined}}</a-select-option>
                </a-select>
                <a-input
                  :placeholder="isPlaceholder?item.Tips:''"
                  @change="inputChange"
                  v-else-if="item.type === 'input'"
                  v-decorator="getDecorator(item)"
                />
                <!-- item.initialValue || item.model  -->
                <a-date-picker
                  :getCalendarContainer="e => e.parentNode"
                  v-decorator="getDecorator(item)"
                  @change="onChange"
                  v-else-if="item.type ==='picker'"
                  style="width:100%"
                  placeholder="YYYY-MM-DD"
                  format="YYYY-MM-DD"
                />
                <a-time-picker
                  :placeholder="isPlaceholder?item.Tips:''"
                  :defaultOpenValue="moment('00:00:00', 'HH:mm:ss')"
                  :getCalendarContainer="e => e.parentNode"
                  v-else-if="item.type ==='timeFrom'"
                  v-decorator="getDecorator(item)"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <div class="m-t-5 text-center">
            <a-button type="primary" html-type="submit" icon="search" class="search-btn">Search</a-button>
            <a-button @click="handleReset" icon="undo" class="m-l-10 search-btn reset-btn">Reset</a-button>
          </div>
        </a-form>
      </collapse-transition>
    </div>
    <div class="collapsible" :class="collapsed?'':''">
      <span @click="toggle">
        <a-icon :type="collapsed ? 'down' : 'up'" />
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Emit } from "vue-property-decorator";
import moment from "moment";
import { deepClone, isObject } from "@/assets/ts";
import selectMixin from "@/common/Advancedsearch/select-mixin.ts";

@Component({
  components: {
    collapseTransition: () =>
      import("@/views/Finance/components/collapse-transition/index.js")
  },
  mixins: [selectMixin]
})
export default class Advance extends Vue {
  private collapsed: boolean = false; //控制 是否隐藏
  private expand: Boolean = false; // 高级搜索是否隐藏
  private form: any; // form表单

  public getDecorator(item: any, configObject: any): any[] {
    return [
      item.name,
      {
        rules: [
          {
            required: item.required || item.require,
            message: `${item.Tips} field should be no-null`
          },
          ...(item.pattern || item.min || item.max || item.len || item.dataType
            ? [
                {
                  pattern: item.pattern,
                  min: item.min,
                  max: item.max,
                  len: item.len,
                  message: item.message || "no message",
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
          ...(configObject && configObject.rules ? configObject.rules : []),
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

  private beforeCreate() {
    this.form = this.$form.createForm(this);
  }
  /*  表单数据
                  @param name：label 值 && from输出的字段
                  @param required：是否必填 默认false && from输出的字段
                  @param type: 输入框什么类型， 例如select['下拉'], picker['时间选择器'] -> 目前只支持这俩个
                  @param options：输入框['下拉的子元素数据']
              */
  @Prop({
    type: Boolean,
    default: false
  })
  isChildName?: boolean; //是 child.value 还是 child.name 开头
  @Prop(Array) formoptions?: any;
  @Prop({
    type: Number,
    default: 8
  })
  span?: number;
  @Prop({
    type: Boolean,
    default: false
  })
  public allowClear?: boolean; //单选select 是否支持清除
  @Prop(Boolean) private isPlaceholder?: boolean; // 是否需要使用 Placeholder
  @Prop(Boolean) private isNotShadow?: boolean; // 是否去除阴影
  /* 获取form 表单的数据传给父组件 */
  @Emit("Submit") Submit(values: any) {}
  @Emit("onform") onForm(form: any) {}
  @Emit("selectChange") selectChange(values: any) {}
  @Emit("inputChange") inputChange(e: any) {}
  @Emit("pickerChange") pickerChange(value: any) {}
  @Emit("select") onSelect(
    val: string,
    name: string,
    optionsIndex: number,
    rowIndex: number
  ) {}
  @Emit("onBtnClick") onBtnClick(name: string) {} // 点击的按钮回调name 点击的按钮名字
  /* 搜索 -> 回调 */
  public handleSearch(e?: any) {
    if (e) {
      e.preventDefault();
    }
    this.form.validateFields(
      {
        force: true
      },
      (error: any, values: any) => {
        if (!error) {
          for (const item of this.formoptions) {
            // 处理type为input空字符串情况
            if (item.type === "input" && item.name) {
              values[item.name] =
                values[item.name] !== "" ? values[item.name] : undefined;
            }
          }
          this.Submit(values);
        }
      }
    );
  }
  /* 重置 */
  public handleReset() {
    let resetFieldArr: string[] = [];
    for (let index = 0; index < this.formoptions.length; index++) {
      const element = this.formoptions[index];
      if (element.isresetField !== false) {
        resetFieldArr.push(element.name);
      }
    }
    this.form.resetFields(resetFieldArr);
    this.onBtnClick("reset");
  }
  /* 高级搜索显示隐藏 */
  public toggle() {
    this.expand = !this.expand;
    this.collapsed = !this.collapsed;
    this.$setTableHeight && this.$setTableHeight(this.collapsed);
    this.$vcSetTableHeight && this.$vcSetTableHeight(this.collapsed);
  }
  /* 下拉选择的值 -> 回调 */
  public handleChange(e: string[]) {
    // console.log(e)
    //console.log(`${e}`);
    this.$nextTick(() => {
      this.selectChange(this.form.getFieldsValue());
    });
  }

  public selectChanges(
    val: string,
    name: string,
    optionsIndex: number,
    rowIndex: number
  ) {
    // console.log(val, name, optionsIndex, rowIndex);
    this.onSelect(val, name, optionsIndex, rowIndex);
    this.$nextTick(() => {
      this.selectChange(this.form.getFieldsValue());
    });
  }
  private date: any = {};
  // 时间事件
  public onChange(value: any) {
    this.pickerChange(value);
    // if (!date) return;
    // this.date.Signeddate = date._d;
    // let beg = this.form.getFieldsValue();
    // if (
    //   !!beg.beginDate &&
    //   val === "endDate" &&
    //   moment(beg.beginDate._d).startOf("days") > moment(date._d).endOf("days")
    // ) {
    //   this.form.setFieldsValue({
    //     endDate: undefined
    //   });
    //   return this.$message.warning("结束日期不能小于开始日期");
    // }
    // if (
    //   !!beg.endDate &&
    //   val === "beginDate" &&
    //   moment(beg.endDate._d).endOf("days") < moment(date._d).startOf("days")
    // ) {
    //   this.form.setFieldsValue({
    //     beginDate: undefined
    //   });
    //   return this.$message.warning("开始日期不能大于结束日期");
    // }
  }

  public setFieldsValue(obj: object) {
    this.form.setFieldsValue(obj);
    // console.log(e)
  }

  public getFieldsValue(): object {
    return this.form.getFieldsValue();
  }

  public created() {
    this.onForm(this.form);
  }

  public filterOption(input, option) {
    console.log(input);
    // console.log('input',input,'option',option,option.componentOptions.children[0].text.trim())
    return option.componentOptions.children[0].text.trim().startsWith(input);
  }
}
</script>

<style>
.ant-table-tbody {
  background: rgb(245, 246, 250);
}
</style><style lang="scss" scoped>
.common-advanced-search {
  background-color: #ffffff;

  .ant-advanced-search-form {
    background-color: #ffffff;

    .ant-advanced-search-form-row {
      position: relative;
    }
  }

  .search-btn {
    border-radius: 50px;
    min-width: 100px;
  }

  .reset-btn {
    background-color: rgb(245, 177, 72);
    color: #fff;
    border: none;
  }
}

.collapsible.collapsed-down {
  margin-top: -16px;
}
</style>
