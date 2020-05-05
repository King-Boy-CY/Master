<template>
  <div>
    <div id="components-form-group">
      <a-form class="inner-form-group" :form="form" @submit="handleSearch">
        <a-row :gutter="24" justify="start" type="flex">
          <a-col v-for="(item,key) in formoptions" :key="key" :span="item.span||span">
            <a-form-item
              :label="item.Tips"
              :colon="false"
              :labelCol="{ span: item.labelSpan ||10,offset:item.offset ||0 }"
              :wrapperCol="item.wrapperSpan?{span:item.wrapperSpan}:undefined"
              :hasFeedback="false"
            >
              <a-select
                allowClear
                v-if="item.type == 'select'||item.type == 'tags'"
                :getPopupContainer="triggerNode => triggerNode.parentNode"
                :mode="item.type == 'tags'?'multiple':undefined"
                :showSearch="item.showSearch"
                :style="{
                                    width:item.btnText? 100-item.btnText.length * 2.5+'%':'',
                                  }"
                v-decorator="[
                                  `${item.decorator}`,
                                  {
                                    rules: [{
                                      required: item.required,
                                      message: `${item.Tips} field should be no-null`,
                                    },...(item.rules && item.rules instanceof Array ? item.rules : [])],
                                    initialValue:item.initialValue || undefined
                                  }
                                ]"
                :placeholder="isShowPlaceHolder?item.Tips:''"
                @change="handleChange($event,item.decorator)"
                :disabled="item.disabled"
              >
                <a-select-option :value="child !== null &&  child !== undefined&&child == 0 ? 0 :child && (child.value || child.name || child) || undefined "
                                   v-for="(child,key) in item.options"
                                   :key="key">{{ child !== null && child !== undefined &&child == 0 ? 0 :child && (child.name || child) || undefined}}</a-select-option>
              </a-select>
              <select-input
                :values.sync="item.initialValue"
                allShow
                :multipleCheckBoxStyle="multipleCheckBoxStyle"
                v-else-if="item.type == 'tags-all'"
                :disabled="item.disabled"
                :options="item.options"
                :collapseTags="collapseTags"
                multiple
                filterable
                @change="handleChange"
                :placeholder="isShowPlaceHolder?item.name:''"
                style="width:100%"
                :getPopupContainer="triggerNode => triggerNode.parentNode"
                v-decorator="[
                                `${item.decorator}`,
                                {
                                rules: [{
                                    required: item.required,
                                    message: `${item.Tips} field should be no-null`,
                                },...(item.rules && item.rules instanceof Array ? item.rules : [])],
                                initialValue: item.initialValue
                                }
                            ]"
              />
              <a-button
                type="primary"
                v-if="item.btnText"
                @click="handleClick(item.btnText)"
                :icon="item.btnIcon||undefined"
                :style="{
                            width:item.btnText.length * 2+'%',
                            marginLeft:item.btnText.length/2+'%'
                          }"
                style="display: inline-block;margin-left: 4%;width: 16%"
              >{{item.btnText}}</a-button>
              <a-input
                :maxLength="item.config&&Object.keys(item.config).length?item.config.maxLength:undefined"
                allowClear
                :placeholder="isShowPlaceHolder?item.Tips:''"
                v-else-if="item.type === 'input'"
                v-decorator="[
                                `${item.decorator}`,
                                {
                                  rules: [{
                                    required: item.required,
                                    message: `${item.Tips} field should be no-null`
                                  },...(item.rules && item.rules instanceof Array ? item.rules : [])],
                                  initialValue:item.initialValue || undefined
                              }
                            ]"
                @change="inputChangeHandle"
                :disabled="item.disabled"
              />
              <a-date-picker
                allowClear
                :format="'YYYY-MM-DD'"
                :disabledDate="item.disabledDate"
                :getCalendarContainer="triggerNode => triggerNode.parentNode"
                v-decorator="[
                            `${item.decorator}`,
                            {
                              rules: [{
                                required: item.required,
                                message: `${item.Tips} field should be no-null`,
                              },...(item.rules && it.rules instanceof Array ? item.rules : [])],
                              initialValue:item.initialValue?moment(item.initialValue,'YYYY-MM-DD'):undefined
                            }
                          ]"
                :disabled="item.disabled"
                @change="onChange"
                v-else-if="item.type === 'picker'"
                style="width:100%"
                placeholder="YYYY-MM-DD"
              />

              <a-month-picker
                allowClear
                :getCalendarContainer="triggerNode => triggerNode.parentNode"
                v-decorator="[
                          `${item.decorator}`,
                          {
                            rules: [{
                              required: item.required,
                              message: `${item.Tips} field should be no-null`,
                            },...(item.rules && item.rules instanceof Array ? item.rules : [])],
                            initialValue:item.initialValue?moment(item.initialValue,'YYYY-MM'):undefined
                          }
                        ]"
                :disabled="item.disabled"
                @change="monthPickerHandle($event,item.decorator)"
                v-else-if="item.type === 'picker-month'"
                :format="'YYYY-MM'"
                :placeholder="item.placeholderName?item.placeholderName:'YYYY-MM'"
              />

              <a-textarea
                allowClear
                v-else-if="item.type === 'textarea'"
                :getCalendarContainer="triggerNode => triggerNode.parentNode"
                v-decorator="[
                            `${item.decorator}`,
                            {
                              rules: [{
                                required: item.required,
                                message: `${item.Tips} field should be no-null`,
                              },...(item.rules && item.rules instanceof Array ? item.rules : [])],
                              initialValue:item.initialValue || undefined
                            }
                          ]"
                :disabled="item.disabled"
                :placeholder="isShowPlaceHolder?item.Tips:''"
                @change="inputChangeHandle"
                :class="{'last-textarea-align':item.isAlign}"
                :rows="item.row || 4"
                :style="{'resize':resize,'height':heightBor}"
              />

              <div v-else-if="item.type === 'upload'" style="display: flex;align-items: center">
                <a-input
                  allowClear
                  style="flex: 1"
                  :placeholder="isShowPlaceHolder?item.Tips:''"
                  v-decorator="[
                              `${item.decorator}`,
                              {
                              rules: [{
                                required: item.required,
                                message: `${item.Tips} field should be no-null`,
                              },...(item.rules && item.rules instanceof Array ? item.rules : [])],
                              initialValue:item.initialValue || undefined
                            }
                          ]"
                  :disabled="true"
                />
                <a-upload
                  style="flex: 0 0 80px;margin-left: 10px"
                  :name="item.name"
                  :multiple="item.multiple || true"
                  :action="item.action"
                  :fileList="[]"
                  :headers="item.headers"
                  @change="uploadChange($event,item)"
                >
                  <a-button type="primary" :disabled="item.disabled">Upload</a-button>
                </a-upload>
              </div>

              <div v-else-if="item.type === 'child'" style="display: flex;align-items: center">
                <a-input
                  allowClear
                  style="flex: 1"
                  :placeholder="isShowPlaceHolder?item.Tips:''"
                  v-decorator="[
                              `${item.decorator}`,
                              {
                              rules: [{
                                required: item.required,
                                message: `${item.Tips} field should be no-null`,
                              },...(item.rules && item.rules instanceof Array ? item.rules : [])],
                              initialValue:item.initialValue || undefined
                            }
                          ]"
                  :disabled="item.disabled"
                />
                <div style="flex: 0 0 45px;margin-left: 10px">
                  <a-button type="primary" :disabled="item.disabled" @click="sendChild($event,item)">· · ·</a-button>
                </div>
              </div>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24" style="text-align: center">
            <slot></slot>
            <!--<a-button type="primary" html-type="submit" icon="search" style="border-radius: 50px">
                      Save
                    </a-button>
                    <a-button @click="handleReturn('Reset')" icon="undo"
                              style="margin-left: 14px;background-color:rgb(245,177,72);color: #fff;border: none;border-radius: 50px ">
                      Return
            </a-button>-->
          </a-col>
        </a-row>
      </a-form>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Emit } from "vue-property-decorator";
import moment from "moment";

@Component({
  components: {
    selectInput: () => import("@/common/selectInput/index.vue")
  }
})
export default class Advance extends Vue {
  private form: any; // form表单
  /* 给form 添加当前实例 */
  private beforeCreate() {
    this.form = this.$form.createForm(this);
  }
  @Prop({
    type: String,
    default: "block"
  })
  private resize?: string;  // textarea是否拉伸
  @Prop({
    type: String,
    default: "block"
  })
  private heightBor?: string;
  /*  表单数据
          @param name：label 值 && from输出的字段
          @param required：是否必填 默认false && from输出的字段
          @param type: 输入框什么类型， 例如select['下拉'], picker['时间选择器'] -> 目前只支持这俩个
          @param options：输入框['下拉的子元素数据']
          formoptions的item.isAlign字段,设置textarea是否对齐,样式在组件最后
   */

  @Prop(Array) formoptions?: any;
  @Prop({
    type: Number,
    default: 8
  })
  span?: number;
  @Prop({
    type: Boolean,
    default: true
  })
  isNeedSelectChange?: boolean; // 是否需要 监听
  @Prop(String) private multipleCheckBoxStyle?: string; // 给select input 传值class
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
  @Prop({
    type: Boolean,
    default: false
  })
  public allowClear?: boolean; //单选select 是否支持清除
  /* 获取form 表单的数据传给父组件 */
  @Emit("Submit") Submit(values: any) {}

  @Emit("selectChange") selectChange(values: any) {}
  @Emit("select") onSelect(
    val: string,
    name: string,
    optionsIndex: number,
    rowIndex: number
  ) {}
  // value 整个表单数据 name 当前操作的选项的名字
  @Emit("monthPickerChange") monthPickerChange(values: any, name: string) {}

  @Emit("inputChange") inputChange(values: any) {}

  @Emit("btnClick") btnClick(values: any) {}

  @Emit("handleClick") handleClick(name: any) {}

  public StaticFileName: string = "";
  /* 搜索 -> 回调 */
  public handleSearch(e: any) {
    e.preventDefault();
    this.form.validateFields((error: any, values: any) => {
      // console.log('error', error)
      // console.log('Received values of form: ', values)
      values.beginDate = values.beginDate
        ? values.beginDate.format("YYYY-MM-DD")
        : undefined;
      values.EndDate = values.EndDate
        ? values.EndDate.format("YYYY-MM-DD")
        : undefined;
      if (!error) {
        this.Submit(values);
      }
    });
  }

  /**子表格 */
  public sendChild(info: any, itemData: any) {
    // console.log(itemData)
    this.$emit("sendChild", itemData)
    // console.log(itemData)
  }

  // 关闭
  public handleReturn(msg: string) {
    if ("Reset" === msg) {
      this.form.resetFields();
    } else {
      this.btnClick(msg);
    }
  }

  /* 下拉选择的值 -> 回调 */
  public handleChange(val: string,
    name: string,
    optionsIndex: number,
    rowIndex: number) {
    // console.log(e)
    // if (!this.isNeedSelectChange) {
    //   return;
    // }
     this.onSelect(val, name, optionsIndex, rowIndex);
    this.$nextTick(() => {
      this.selectChange(this.form.getFieldsValue());
    });
  }

  public monthPickerHandle(e: string | [], name: string) {
    this.$nextTick(() => {
      this.monthPickerChange(this.form.getFieldsValue(), name);
    });
  }

  /* 时间选择的值 -> 回调 */
  public onChange(e: any) {
    // console.log(e)
  }

  private inputChangeHandle() {
    this.$nextTick(() => {
      this.inputChange(this.form.getFieldsValue());
    });
  }

  public uploadChange(info: any, itemData: any) {
    console.log(info,itemData);
    this.$emit("uploadChange", info);
    if (info.file.originFileObj.size>1024*1024*10) {
      this.$message.warning('Documents should not exceed 10M')
      this.form.setFieldsValue({
      [itemData.decorator]: ''
    });
    }else {
      this.form.setFieldsValue({
        [itemData.decorator]: info.file.name
      });
    }
  }

  public setFieldsValue(obj: any): void {
    this.form.setFieldsValue(obj);
  }

  public resetFields(arr?: string[]): void {
    this.form.resetFields(arr ? arr : undefined);
  }

  public getFieldsValue(): any {
    return this.form.getFieldsValue();
  }

  public validateFields(): any {
    let val;
    this.form.validateFields(
      {
        force: true
      },
      (error: any, values: any) => {
        // console.log('error', error)
        // console.log('Received values of form: ', values)
        if (!error) {
          val = values;
        }
      }
    );
    return val;
  }
  public beforeDestroy() {
    this.form.resetFields();
  }
}
</script>

<style>
.router-slide-enter-active,
.router-slide-leave-active {
  transition: all 0.4s;
  /*overflow: hidden;*/
}

.router-slide-enter,
.router-slide-leave-to {
  transform: translate3d(0, -3rem, 0);
  height: 0;
  opacity: 0;
}

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
  /* word-break: break-all;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    white-space:normal;
    line-height:1.5;
    max-width: 90px;
    padding: 3px;
    font-weight: 600; */
  /* font-weight: 600; */
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

form textarea.last-textarea-align {
  width: 96%;
  margin-left: 4%;
}
</style>
<style lang="scss" scoped>
</style>
