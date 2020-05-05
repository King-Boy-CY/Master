<template>
  <div>
    <div id="components-form-demo-advanced-search" :class="isNotShadow?'unset':''">
      <transition name="router-slid">
        <a-form class="ant-advanced-search-form"
                :form="form"
                @submit="handleSearch"
                v-show="!expand">
          <a-row :gutter="24">
            <a-col v-for="(item,key) in formoptions"
                   :key="key"
                   :span="item.span || span">
              <a-form-item :label="item.Tips"
                           :colon="false"
                           :labelCol="{ span: item.colSpan || 8 }"
                           :hasFeedback="false">
                <a-select @change="handleChange(item.name,$event,key)"
                          :getPopupContainer=" e=>e.parentNode"
                          v-if="item.type==='select'"
                          allowClear
                          :disabled="item.disabled"
                          v-decorator="[
                                `${item.name}`,
                                {
                                    initialValue:item.initialValue,
                                    rules: [{
                                        required: item.required,
                                        message: `${item.Tips} field should be no-null`,
                                    }],
                                }
                            ]">
                  <a-select-option :value="child.name || child"
                                   v-for="(child,key) in item.options"
                                   :key="key"
                                   :disabled="( child.name || child) ==='Low'&& low ">
                    {{child.name || child}}
                  </a-select-option>
                </a-select>
                <a-select :getPopupContainer="e => e.parentNode"
                          mode="multiple"
                          v-else-if="item.type == 'tags'"
                          :maxTagCount="1"
                          v-decorator="[
                                        `${item.name}`,
                                        {
                                          rules: [{
                                            required: item.required,
                                            message: `${item.Tips} field should be no-null`,
                                          }],
                                        }
                                      ]"
                          @change="handleChange">
                  <a-select-option :value="isChildName&&child.value || child.name  || child "
                                   v-for="(child,key) in item.options"
                                   :key="key">{{child.name || child}}</a-select-option>
                </a-select>
                <a-input v-else-if="item.type === 'input'"
                         :disabled="item.disabled || undefined"
                         v-decorator="[
                                        `${item.name}`,
                                        {
                                        initialValue:item.initialValue,
                                        rules: [{
                                          required: item.required,
                                          message: `${item.Tips} field should be no-null`,
                                        }],
                                        }
                                      ]" />
                <a-date-picker :getCalendarContainer="e => e.parentNode"
                               :disabled="item.disabled || undefined"
                               v-decorator="[
          `${item.name}`,
          {
            initialValue:item.initialValue,
          rules: [{
          required: item.required,
          message: `${item.Tips} field should be no-null`,
          }],
          }
          ]"
                               @change="onChange(item.name,$event,key)"
                               v-else-if="item.type ==='picker'"
                               style="width:100%"
                               placeholder="YYYY-MM-DD"
                               format="YYYY-MM-DD" />
              </a-form-item>
            </a-col>
          </a-row>

        </a-form>
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  Component,
  Prop,
  Emit
} from 'vue-property-decorator'
import moment from 'moment'
@Component
export default class Advance extends Vue {
  private collapsed: boolean = false //控制 是否隐藏
  private expand: Boolean = false // 高级搜索是否隐藏
  private form: any // form表单
  /* 给form 添加当前实例 */
  private beforeCreate() {
    this.form = this.$form.createForm(this)
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
  }) isChildName ? : boolean //是 child.value 还是 child.name 开头
  @Prop(Array) formoptions ? : any
  @Prop({
    type: Number,
    default: 8
  }) span ? : number
  @Prop({
    type: Boolean,
    default: false
  }) public allowClear ? : boolean //单选select 是否支持清除
  @Prop(Boolean) private isNotShadow ? : boolean; // 是否去除阴影
  /* 获取form 表单的数据传给父组件 */
  @Emit('Submit') Submit(values: any) {}
  @Emit('onform') onForm(form: any) {}
  @Emit('select') onSelect(name: string, arr: string[]) {}
  @Emit('valuesChecked') valuesChecked(values: any) {}

  /* 搜索 -> 回调 */
  public async handleSearch() {
    this.form.validateFields((err: any, values: any) => {
      if (!err) {
        console.log(values);
        let valuesBeginDate = Number(moment(values.EffectiveDate._d).format("YYYY-MM-DD").split("-").join(""))
        console.log('Received values of form: ', values);
        if (valuesBeginDate > 20991231) return this.$message.error(`Effective date不能大于2099-12-31`)
        this.valuesChecked(values)
      }
    });
  }
  /* 重置 */
  public handleReset() {
    this.form.resetFields()
  }
  /* 高级搜索显示隐藏 */
  public toggle() {
    this.expand = !this.expand
    this.collapsed = !this.collapsed
  }
  /* 下拉选择的值 -> 回调 */
  public handleChange(name: string, e: string[]) {
    this.onSelect(name, e)
    // console.log(e)
    //console.log(`${e}`);
  }
  private date: any = {}
  public onChange(val: any, date: any, name: string) {

  }

  public created() {
    this.onForm(this.form)
  }

  public getFieldsValue(): object {
    return this.form.getFieldsValue();
  }

}
</script>

<style>
</style>
