<template>
  <div class="advanced-search-box">
    <div id="components-form-demo-advanced-search" class="advanced-search finance-template-style">
      <collapse-transition>
        <!--<transition name="router-slid">-->
        <a-form
          class="ant-advanced-search-form"
          :form="form"
          @submit="handleSearch"
          v-show="!expand"
        >
          <a-row :gutter="24" justify="start" type="flex" class="ant-advanced-search-form-row">
            <a-col
              v-for="(item,key) in formoptions"
              :key="key"
              :span="item.span||span"
              :offset="item.offset"
              :style="item.style || {}"
            >
              <a-form-item
                :label="item.Tips"
                :colon="false"
                :labelCol="item.labelCol||labelCol"
                :wrapperCol="item.wrapperCol||wrapperCol"
                :hasFeedback="false"
              >
                <a-select
                  allowClear
                  :getPopupContainer="triggerNode => triggerNode.parentNode"
                  :mode="item.type == 'tags'?'multiple':undefined"
                  v-if="item.type == 'select'||item.type == 'tags'"
                  v-decorator="getDecorator(item)"
                  :placeholder="isShowPlaceHolder?item.name:''"
                  @change="handleChange($event,item.name)"
                  :disabled="item.disabled"
                >
                  <!-- <a-icon slot="suffixIcon" type="caret-down" :style="{color:'#a3c3ff',fontSize:'16px'}"/> -->
                  <!-- <a-icon type="caret-down" /> -->
                  <a-select-option
                    :value="child.value || child.name"
                    v-for="(child) in item.options"
                    :disabled="child.disabled"
                    :key="child.value || child.name"
                  >{{child.name}}</a-select-option>
                </a-select>
                <template
                  v-else-if="item.type == 'tags-all' && showMaskPLan && item.initialValue.length > 0"
                >
                  <a-popover placement="leftBottom">
                    <template>
                      <p slot="content" v-for="(itw,i) in item.initialValue" :key="i+itw">{{itw}}</p>
                    </template>
                    <span class="display-none"></span>
                    <select-input
                      :values.sync="item.initialValue"
                      allShow
                      :disabled="item.disabled"
                      :options="item.options"
                      multiple
                      filterable
                      :multipleCheckBoxStyle="multipleCheckBoxStyle"
                      :collapseTags="collapseTags"
                      @change="handleChange($event,item.name)"
                      :placeholder="isShowPlaceHolder?item.name:''"
                      style="width:100%"
                      :getPopupContainer="triggerNode => triggerNode.parentNode"
                      v-decorator="getDecorator(item)"
                    />
                  </a-popover>
                </template>
                <template v-else-if="item.type == 'tags-all'">
                  <select-input
                    :values.sync="item.initialValue"
                    allShow
                    :disabled="item.disabled"
                    :options="item.options"
                    multiple
                    filterable
                    :multipleCheckBoxStyle="multipleCheckBoxStyle"
                    :collapseTags="collapseTags"
                    @change="handleChange($event,item.name)"
                    :placeholder="isShowPlaceHolder?item.name:''"
                    style="width:100%"
                    :getPopupContainer="triggerNode => triggerNode.parentNode"
                    v-decorator="getDecorator(item)"
                  />
                </template>
                <a-input
                  :maxLength="item.config&&Object.keys(item.config).length?item.config.maxLength:undefined"
                  :placeholder="isShowPlaceHolder?item.decorator:''"
                  v-else-if="item.type === 'input'"
                  :disabled="item.disabled"
                  v-decorator="getDecorator(item)"
                />
                <a-date-picker
                  :format="item.format || 'YYYY-MM-DD'"
                  :getCalendarContainer="triggerNode => triggerNode.parentNode"
                  :disabled="item.disabled"
                  v-decorator="getDecorator(item)"
                  @change="onChange"
                  v-else-if="item.type === 'picker'"
                  style="width:100%"
                  placeholder="YYYY-MM-DD"
                >
                  <!-- <a-icon slot="suffixIcon" type="caret-down" :style="{color:'#a3c3ff',fontSize:'16px'}"/>   -->
                </a-date-picker>
                <a-month-picker
                  :format="item.format || 'YYYY-MM'"
                  :getCalendarContainer="triggerNode => triggerNode.parentNode"
                  :disabled="item.disabled"
                  v-decorator="getDecorator(item)"
                  @change="monthPickerHandle($event,item.name)"
                  v-else-if="item.type === 'picker-month'"
                  placeholder="YYYY-MM"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <div class="m-t-10 text-center">
            <a-button
              type="primary"
              html-type="submit"
              icon="search"
              class="search-btn"
            >{{searchText}}</a-button>
            <a-button
              type="primary"
              icon="plus-circle"
              @click="handleBtn('Add')"
              v-if="needAdd"
              class="m-l-10 search-btn"
            >Add</a-button>
            <a-button
              type="primary"
              @click="handleBtn('Export')"
              icon="export"
              v-if="needExport"
              class="m-l-10 search-btn"
            >Export</a-button>
            <a-button
              @click="handleBtn('Reset')"
              icon="undo"
              class="m-l-10 search-btn reset-btn"
            >Reset</a-button>
          </div>
        </a-form>
        <!--</transition>-->
      </collapse-transition>
    </div>
    <div class="collapsible" :class="collapsed?'collapsed-down':''">
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
@Component({
  components: {
    collapseTransition: () => import("../collapse-transition/index.js"),
    selectInput: () => import("@/common/selectInput/index.vue")
  }
})
export default class Advance extends Vue {
  private collapsed: boolean = false; //控制 是否隐藏
  private expand: Boolean = false; // 高级搜索是否隐藏
  private form: any; // form表单
  /* 给form 添加当前实例 */
  private beforeCreate() {
    this.form = this.$form.createForm(this);
    console.log(this.form);
  }
  /***
   * 表单数据
   *  @param name：label 值 && from输出的字段
   *  @param required：是否必填 默认false && from输出的字段
   *  @param type: 输入框什么类型， 例如select['下拉'], picker['时间选择器'] -> 目前只支持这俩个
   *  @param options：输入框['下拉的子元素数据']
   */
  @Prop(Array) formoptions?: any;
  @Prop({
    type: Number,
    default: 8
  })
  span?: number;
  @Prop({
    type: Number,
    default: 0
  })
  offset?: number;
  @Prop({
    type: Object,
    default: () => {
      return {
        span: 9
      };
    }
  })
  labelCol?: Object;
  @Prop({
    type: Object,
    default: () => {
      return {
        span: 9
      };
    }
  })
  wrapperCol?: Object;

  @Prop({
    type: Boolean,
    default: true
  })
  isNeedSelectChange?: boolean; // 是否需要 监听选择事件 是否需要在select框change时执行selectChange回调

  @Prop({
    type: Boolean,
    default: false
  })
  collapseTags?: boolean; // 省略显示多选择下拉框的项

  @Prop({
    type: Boolean,
    default: true
  })
  needExport?: boolean; // 是否需要导出
  @Prop({
    type: Boolean,
    default: false
  })
  needAdd?: boolean; // 是否需要增加

  @Prop({
    type: String,
    default: "Generate"
  })
  searchText?: string; // 搜索名字
  @Prop({
    type: Boolean,
    default: false
  })
  public allowClear?: boolean; //单选select 是否支持清除

  @Prop(String) private multipleCheckBoxStyle?: string; // 多选框的class传值

  @Prop({
    type: Boolean,
    default: false
  })
  public isShowPlaceHolder?: boolean; //是否显示占位符

  @Prop({
    type: Boolean,
    default: false
  })
  public showMaskPLan?: boolean;

  // @Prop({
  //   type: Boolean,
  //   default: false
  // })
  // public hovered?: boolean;
  // @Prop({
  //   type: Boolean,
  //   default: false
  // }) useChildValue ?: boolean // 是否绑定key value  是绑定value 否 则为name

  /* 获取form 表单的数据传给父组件 */
  @Emit("Submit") Submit(values: any) {}

  @Emit("selectChange") selectChange(values: any, name: any) {}

  @Emit("monthPickerChange") monthPickerChange(values: any, name: any) {}

  @Emit("btnClick") btnClick(name: string) {}

  private visible = false;
  public getDecorator(item: any, configObject: any): any[] {
    return [
      item.name,
      {
        rules: [
          {
            required: item.required,
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
          ...(item.isCheckNumber ? [{ validator: this.isCheckNumber }] : []),
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

  /* 搜索 -> 回调 */
  public handleSearch(e: any) {
    e.preventDefault();
    this.form.validateFields({ force: true }, (error: any, values: any) => {
      // console.log('error', error)
      // console.log('Received values of form: ', values)
      values.BeginDate = values.BeginDate
        ? values.BeginDate.format("YYYY-MM-DD")
        : undefined;
      values.EndDate = values.EndDate
        ? values.EndDate.format("YYYY-MM-DD")
        : undefined;
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
    });
  }

  public handleBtn(msg: string) {
    if ("Reset" === msg) {
      this.form.resetFields();
      this.formoptions.forEach((item: any) => {
        if (
          item.name == "InboundDestinaiton" ||
          item.name == "OutboundDestinaiton"
        ) {
          console.log("init");
          item.initialValue = [];
        }
        if (item.options) {
          item.options.forEach((ele: any) => {
            ele.disabled = false;
          });
        }
      });
    }
    this.btnClick(msg);
  }

  /* 高级搜索显示隐藏 */
  public toggle() {
    this.expand = !this.expand;
    this.collapsed = !this.collapsed;
    this.$setTableHeight && this.$setTableHeight(this.collapsed);
    this.$vcSetTableHeight && this.$vcSetTableHeight(this.collapsed);
  }

  /* 下拉选择的值 -> 回调 */
  public handleChange(e: string | [], name: String) {
    console.log("validateFields");
    // {force:true},
    // this.form.validateFields((err, values) => {
    //     if (!err) {
    //       console.log('Received values of form: ', values);
    //     }
    //   });
    // console.log(e)
    if (!this.isNeedSelectChange) {
      return;
    }
    this.$nextTick(() => {
      this.selectChange(this.form.getFieldsValue(), name);
    });
  }

  public monthPickerHandle(e: string | [], name: String) {
    // console.log(e)
    this.$nextTick(() => {
      this.monthPickerChange(this.form.getFieldsValue(), name);
    });
  }

  /* 时间选择的值 -> 回调 */
  public onChange(e: any) {
    // console.log(e)
  }

  public setFieldsValue(obj: any) {
    this.form.setFieldsValue(obj);
    // console.log(e)
  }

  public getFieldsValue(): object {
    return this.form.getFieldsValue();
  }
}
</script>

<style lang="scss" scoped>
.advanced-search {
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
