<template>
  <div>
    <div id="components-form-demo-advanced-search">
      <!-- <transition name="router-slid"> -->
        <collapseTransition>
        <a-form
          class="ant-advanced-search-form"
          :form="form"
          @submit="handleSearch"
          v-show="!expand"
        >
          <!-- <a-row :gutter="24">
            <a-col v-for="(item,key) in formoptions"
                   :key="key"
                  :span="item.span || span">
              <a-form-item :label="item.Tips"
                           :labelCol="{ span: item.colSpan }"
                           >
                <a-select :getPopupContainer="e => e.parentNode"
                          v-if="item.type == 'select'"
                          v-decorator="[
                                        `${item.name}`,
                                        {
                                          rules: [{
                                            required: item.required,
                                            message: `${item.name} field should be no-null`,
                                          }],
                                        }
                                      ]"
                          :placeholder="item.name"
                          @change="handleChange">
                  <a-select-option :value=" child.value || child.name "
                                   v-for="(child,key) in item.options"
                                   :key="key">{{child.name || child}}</a-select-option>
                </a-select>
                <a-select :getPopupContainer="e => e.parentNode"
                          mode="multiple"
                          v-else-if="item.type == 'tags'"
                          v-decorator="[
                                        `${item.name}`,
                                        {
                                          rules: [{
                                            required: item.required,
                                            message: `${item.name} field should be no-null`,
                                          }],
                                        }
                                      ]"
                          :placeholder="item.name"
                          @change="handleChange">
                  <a-select-option :value="child.value || child.name || child"
                                   v-for="(child,key) in item.options"
                                   :key="key">{{child.name || child}}</a-select-option>
                </a-select>
                <a-input :placeholder="item.decorator"
                         v-else-if="item.type === 'input'"
                         v-decorator="[
                                        `${item.name}`,
                                        {
                                        rules: [{
                                          required: it.required,
                                          message: `${it.name} field should be no-null`
                                        }],
                                        }
                                      ]" />
                <a-date-picker :getCalendarContainer="e => e.parentNode"
                               v-decorator="[
          `${item.name}`,
          {
          rules: [{
          required: item.required,
          message: `${item.name} field should be no-null`,
          }],
          }
          ]"
                               @change="onChange"
                               v-else-if="item.type === 'picker'"
                               style="width:100%"
                               placeholder="YYYY / MM / DD" />
              </a-form-item>
            </a-col>
          </a-row>-->
          <a-row class="Row">
            <a-col :span="11">
              <a-form-item  :colon="false" label="Time band name" :labelCol="{ span: 6 }" :wrapperCol="{ span: 18}">
                <!-- <a-input placeholder="Time band name" v-decorator="[
                                        `timeBandName`,
                                        {
                                        rules: [{
                                          required: false,
                                          message: ``
                                        }],
                                        }
                ]" />-->
                <a-select
                  showSearch
                  allowClear
                  :getPopupContainer="e => e.parentNode"
                  v-decorator="[
                                        `timeBandName`,
                                        {
                                        rules: [{
                                          required: false,
                                          message: ``
                                        }],
                                        }
                                      ]"
                >
                  <a-select-option
                    v-for="(item,key) in timeBandName || []"
                    :key="key"
                    :value="item"
                  >{{item}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="11" :offset="2">
              <a-form-item :colon="false" label="Type" :labelCol="{ span: 6 }" :wrapperCol="{ span: 18}">
                <a-select
                  allowClear
                  :getPopupContainer="e => e.parentNode"
                  v-decorator="[
                                        `type`,
                                        {
                                        rules: [{
                                          required: false,
                                          message: ``
                                        }],
                                        }
                                      ]"
                >
                  <a-select-option
                    v-for="(item,key) in ['peak','Off Peak']"
                    :key="key"
                    :value="key+1"
                  >{{item}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="11">
              <a-row>
                <a-col :span="12">
                  <a-form-item :colon="false" label="Days" :labelCol="{ span: 12 }" :wrapperCol="{ span:12}">
                    <a-select
                      allowClear
                      :disabled="isDays"
                      @change="onSelect($event,'dayFrom')"
                      :getPopupContainer="e => e.parentNode"
                      v-decorator="[
                                        `dayFrom`,
                                        {
                                        rules: [{
                                          required: false,
                                          message: ``
                                        }],
                                        }
                                      ]"
                    >
                      <a-select-option v-for="(item,key) in 31" :key="key" :value="item">{{item}}</a-select-option>
                      <!-- <a-select-option >
                      every
                      </a-select-option>-->
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item :colon="false" :class="'to-text-align'" label="to" :labelCol="{ span: 7,offset:5 }"  :wrapperCol="{ span:12}">
                    <a-select
                      allowClear
                      :disabled="isDays"
                      @change="onSelect($event,'dayTo')"
                      :getPopupContainer="e => e.parentNode"
                      v-decorator="[
                                        `dayTo`,
                                        {
                                        rules: [{
                                          required: false,
                                          message: ``
                                        }],
                                        }
                                      ]"
                    >
                      <a-select-option v-for="(item,key) in 31" :key="key" :value="item">{{item}}</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
              </a-row>
            </a-col>
            <a-col :span="11" :offset="2">
              <a-row>
                <a-col :span="12">
                  <a-form-item :colon="false" label="Weekday"  :labelCol="{ span: 12 }" :wrapperCol="{ span:12}">
                    <a-select
                      allowClear
                      :disabled="isWeekday"
                      @change="onSelect($event,'weekdayFrom')"
                      :getPopupContainer="e => e.parentNode"
                      v-decorator="[
                                        `weekdayFrom`,
                                        {
                                        rules: [{
                                          required: false,
                                          message: ``
                                        }],
                                        }
                                      ]"
                    >
                      <a-select-option v-for="(item,key) in 7" :key="key" :value="item">{{item}}</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item :colon="false" :class="'to-text-align'" label="to"  :labelCol="{ span: 7,offset:5 }"  :wrapperCol="{ span:12}">
                    <a-select
                      allowClear
                      :disabled="isWeekday"
                      @change="onSelect($event,'weekdayTo')"
                      :getPopupContainer="e => e.parentNode"
                      v-decorator="[
                                        `weekdayTo`,
                                        {
                                        rules: [{
                                          required: false,
                                          message: ``
                                        }],
                                        }
                                      ]"
                    >
                      <a-select-option v-for="(item,key) in 7" :key="key" :value="item">{{item}}</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
              </a-row>
            </a-col>
            <a-col :span="11">
              <a-row>
                <a-col :span="12">
                  <a-form-item
                    label="Specific time"
                    :colon="false"
                      :labelCol="{ span: 12 }" :wrapperCol="{ span:12}">
                    <a-time-picker
                      :getCalendarContainer="e => e.parentNode"
                      :placeholder="''"
                      :defaultOpenValue="moment('00:00:00', 'HH:mm:ss')"
                      v-decorator="[
                                        `timeFrom`,
                                        {
                                        rules: [{
                                          required: false,
                                          message: ``
                                        }],
                                        }
                                      ]"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item :colon="false" :class="'to-text-align'" label="to"  :labelCol="{ span: 7,offset:5 }" :wrapperCol="{ span:12}">
                    <a-time-picker
                      :getCalendarContainer="e => e.parentNode"
                      :placeholder="''"
                      :defaultOpenValue="moment('00:00:00', 'HH:mm:ss')"
                      v-decorator="[
                                        `timeTo`,
                                        {
                                        rules: [{
                                          required: false,
                                          message: ``
                                        }],
                                        }
                                      ]"
                    />
                  </a-form-item>
                </a-col>
              </a-row>
            </a-col>
          </a-row>
          <a-row style="margin-top:5px">
            <a-col :span="24" :style="{ textAlign: 'center' }">
              <a-button
                type="primary"
                html-type="submit"
                icon="search"
                :style="{ borderRadius: '50px 50px 50px 50px' }"
              >Search</a-button>
              <a-button
                :style="{ marginLeft: '8px', backgroundColor: 'rgb(245,177,72)', color: '#fff', border: 0, borderRadius: '50px 50px 50px 50px' }"
                @click="handleReset"
                icon="undo"
              >Reset</a-button>
            </a-col>
          </a-row>
        </a-form>
      <!-- </transition> -->
      </collapseTransition>
    </div>
    <a-row>
      <a-col :span="24">
        <div class="collapsible" @click="toggle" :style="collapsed ? { marginTop:'-16px' } : ''">
          <span>
            <a-icon :type="collapsed ? 'down' : 'up'" />
          </span>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Emit } from "vue-property-decorator";
import moment from "moment";
import { AxiosGet } from "@/api/axios";

@Component({
  components:{
    collapseTransition: () => import("@/views/Finance/components/collapse-transition/index.js")
  }
})
export default class Advance extends Vue {
  @Prop(Boolean) private isPlaceholder?: boolean; // 是否需要使用 Placeholder
  private collapsed: boolean = false; //控制 是否隐藏
  private expand: Boolean = false; // 高级搜索是否隐藏
  private form: any; // form表单
  private isWeekday: boolean = false;
  private isDays: boolean = false;
  private timeBandName: string[] = [];
  private dayObj: any = {};
  /* 给form 添加当前实例 */
  private beforeCreate() {
    this.form = this.$form.createForm(this);
  }
  public created() {
    AxiosGet("/config/droplist/vcTimeBandNames").then((res:any) => {
      this.timeBandName = res.data || [];
    });
  }
  /*  表单数据
      @param name：label 值 && from输出的字段
      @param required：是否必填 默认false && from输出的字段
      @param type: 输入框什么类型， 例如select['下拉'], picker['时间选择器'] -> 目前只支持这俩个
      @param options：输入框['下拉的子元素数据']
  */
  @Prop(Array) formoptions?: any;
  @Prop({
    type: Number,
    default: 8
  })
  span?: number;

  /* 获取form 表单的数据传给父组件 */
  @Emit("Submit") Submit(values: any) {}

  @Emit("select") selectChange<T>(value: T, name: T) {}
  /* 搜索 -> 回调 */
  public handleSearch(e: any) {
    e.preventDefault();
    this.form.validateFields((error: any, values: any) => {
      // console.log('error', error)
      // console.log('Received values of form: ', values)
      values.beginDate =
        !!values.beginDate &&
        moment(values.beginDate["_d"]).format("YYYY/MM/DD");
      values.EndDate =
        !!values.EndDate && moment(values.EndDate["_d"]).format("YYYY/MM/DD");
      !error && this.Submit(values);
    });
  }
  /* 重置 */
  public handleReset() {
    this.isWeekday = false;
    this.isDays = false;
    this.form.resetFields();
  }
  public onSelect(value: number | string, name: string) {
    if ((!!value && name === "dayTo") || name === "dayFrom") {
      if (!this.dayObj[name]) {
        this.dayObj[name] = value;
      }
      this.form.setFieldsValue({
        weekdayFrom: undefined,
        weekdayTo: undefined
      });
      this.isWeekday = true;
    }
    console.log(!this.dayObj, value, this.form);
    if ((!!value && name === "weekdayTo") || name === "weekdayFrom") {
      if (!this.dayObj[name]) {
        this.dayObj[name] = value;
      }
      this.form.setFieldsValue({
        dayFrom: undefined,
        dayTo: undefined
      });
      this.isDays = true;
    }
    /* 记录当前哪种状态 */
    if (!value) {
      if (this.dayObj[name]) {
        this.dayObj[name] = "";
      }
    }
    if (
      (this.dayObj["dayFrom"] === "" && this.dayObj["dayTo"] === "") ||
      (this.dayObj["dayFrom"] === "" && !this.dayObj["dayTo"]) ||
      (this.dayObj["dayTo"] === "" && !this.dayObj["dayFrom"])
    ) {
      this.isWeekday = false;
    }
    if (
      (this.dayObj["weekdayFrom"] === "" && this.dayObj["weekdayTo"] === "") ||
      (this.dayObj["weekdayFrom"] === "" && !this.dayObj["weekdayTo"]) ||
      (this.dayObj["weekdayTo"] === "" && !this.dayObj["weekdayFrom"])
    ) {
      this.isDays = false;
    }
    if (
      !value &&
      !this.form.getFieldValue("dayTo") &&
      !this.form.getFieldValue("dayFrom")
    ) {
      this.isWeekday = false;
    }
    if (
      !!value &&
      name === "dayTo" &&
      Number(this.form.getFieldValue("dayFrom")) > Number(value)
    ) {
      return this.$message.error("The number of days at the end of a month should not be less than the number of days at the beginning of a month");
    }
    if (
      !!value &&
      name === "dayFrom" &&
      Number(this.form.getFieldValue("dayTo")) < Number(value)
    ) {
      return this.$message.error(" the number of days at the beginning of a month should not be greater than the number of days at the end of a month");
    }
    if (
      !!value &&
      name === "weekdayTo" &&
      Number(this.form.getFieldValue("weekdayFrom")) > Number(value)
    ) {
      return this.$message.error("The end of the working day should not be less than the beginning of the working day");
    }
    if (
      !!value &&
      name === "weekdayFrom" &&
      Number(this.form.getFieldValue("weekdayTo")) < Number(value)
    ) {
      return this.$message.error("The starting time of working day should not be greater than the ending time of working day");
    }
  }
  /* 高级搜索显示隐藏 */
  public toggle() {
    this.expand = !this.expand;
    this.collapsed = !this.collapsed;
  }
  /* 下拉选择的值 -> 回调 */
  public handleChange(e: string[]) {
    // console.log(e)
    //console.log(`${e}`);
  }
  /* 时间选择的值 -> 回调 */
  public onChange(e: any) {
    // console.log(e)
  }

  public setFieldsValue(obj: object) {
        this.form.setFieldsValue(obj);
        // console.log(e)
    }

    public getFieldsValue(): object {
        return this.form.getFieldsValue();
    }
}
</script>
<style>
.to-text-align .ant-form-item-label{
  justify-content: center;
}

.ant-time-picker{
  width: auto;
}
</style>