<!--  -->
<template>
  <div>
    <div id="components-form-group">
      <slot name="descriptionSlot"></slot>
      <a-form class="inner-form-group" :form="form" @submit="handleSearch">
        <a-row :gutter="24" justify="start" type="flex">
          <a-col v-for="(item, index) in formoptions" :key="index" :span="item.span || span" :offset="item.colOffset || 0">
            <a-form-item
              :label="item.Tips"
              :colon="false"
              :label-col="{ span: item.labelSpan || 10, offset: item.offset || 0 }"
              :wrapper-col="{span: item.wrapperSpan || 10,offset: item.wrapperOffset||0}"
              :hasFeedback="false"
            >
              <template v-if="item.type === 'select' || item.type === 'tags' ||item.type === 'radioSelect'">
                <a-select
                  allowClear
                  :showSearch ="item.type === 'radioSelect' ? true : false"
                  optionFilterProp="children"
                  :getPopupContainer="triggerNode => triggerNode.parentNode"
                  :mode="item.type === 'tags' ? 'multiple' : undefined"
                  :maxTagCount="item.decorator === 'status' ? 1 : 3"
                  :style="{ width: item.btnText ? 100 - item.btnText.length * 2.5 + '%' : '' }"
                  :filterOption="item.filterType ? filterOption: true"
                  v-decorator="[
                    `${item.decorator}`,
                    {
                      rules: [
                        {
                          required: item.required,
                          message: `${item.Tips} field should be no-null`
                        }
                      ],
                      initialValue: item.initIalValue || undefined
                    }
                  ]"
                  :placeholder="item.placeholder ? iteme.placeholder : ''"
                  @change="handleChange($event, item.decorator)"
                  :disabled="item.disabled"
                >
                  <a-select-option :value="child.id"
                    v-for="(child,key) in item.options"
                    :key="key"
                    :disabled="child.disabled"
                    >
                      {{child.name || child}}
                    </a-select-option>
                </a-select>
                <a-button type="primary"
                  v-if="item.btnText"
                  @click="handleClick(item.btnText)"
                  :icon="item.btnIcon || undefined"
                  :style="{width: item.btnText.length * 2 +'%',marginLeft:item.btnText.legth / 2 + '%'}"
                  style="display:inline-block;margin-left:4%;width:16%"
                >
                  {{item.btnText}}
                </a-button>
              </template>
              <a-input v-else-if="item.type === 'input'"
                allowClear
                :placeholder="item.placeholder ? item.placeholder : ''"
                v-decorator="[
                  `${item.decorator}`,
                  {
                    rules: [{
                      required: item.required,
                      message: `${item.Tips} field should be no-null `
                    }],
                    initialValue: item.initialValue || undefined
                  }
                ]"
                @change="inputChangeHandle($event,item.decorator)"
                :disabled="item.disabled"
                :addonAfter="item.decorator === 'asr' || item.decorator ==='asrMinimum' ? '%':false"
              >
              </a-input>
              <a-date-picker v-else-if="item.type==='picker'"
                allowClear

                placeholder="YYYY-MM-DD"
                :format="'YYYY-MM-DD'"
                :disabledDate="item.disabledDate"
                :getCalendarContainer="triggerNode => triggerNode.parentNode"
                v-decorator="[
                  `${item.decorator}`,
                  {
                    rules: [{
                      required: item.required,
                      message: `${item.Tips} field should be no-null `
                    }],
                    initialValue:item.initialValue?moment(item.initialValue,'YYYY-MM-DD'):undefined
                  }
                ]"
                :disabled="item.disabled"
                @change="onChange($event,item.decorator)"
                style="width:100%"
              >
              </a-date-picker>
              <a-range-picker v-else-if="item.type==='picker-range'"
                allowClear
                :placeholder="['YYYY-MM-DD','YYYY-MM-DD']"
                :mode="['date','date']"
                @openChange = "dateFocus(item.decorator)"
                :getCalendarContainer="triggerNode => triggerNode.parentNode"
                :format="'YYYY-MM-DD'"
                :disabledDate="item.disabledDate"
                @change="rangeChangeHandle($event,item.decorator)"
                style="width:100%"
                v-decorator="[
                  `${item.decorator}`,
                  {
                    rules: [{
                      required: item.required,
                      message: `${item.Tips} field should be no-null`,
                    }],
                    initialValue:item.initialValue.length ===2 ? [moment(item.initialValue[0],'YYYY-MM-DD'),moment(item.initialValue[1],'YYYY-MM-DD')]:undefined

                  }

                ]"
              >
                <template slot="renderExtraFooter">

                </template>

              </a-range-picker>
              <a-month-picker v-else-if="item.type==='picker-month'"
                allowClear
                placeholder="YYYY-MM"
                :getCalendarContainer="triggerNode => triggerNode.parentNode"
                v-decorator="[
                  `${item.decorator}`,
                  {
                    rules: [{
                      required: item.required,
                      message: `${item.Tips} field should be no-null`,
                    }],
                    initialValue:item.initialValue?moment(item.initialValue,'YYYY-MM'):undefined

                  }

                ]"
                :disabled="item.disabled"
                @change="monthPickerHandle($event,item.decorator)"
                :format="'YYYY-MM'"

              >
              </a-month-picker>
              <a-textarea v-else-if="item.type==='textarea'"
                allowClear
                 :placeholder="item.Tips"
                :getCalendarContainer="triggerNode => triggerNode.parentNode"
                v-decorator="[
                  `${item.decorator}`,
                  {
                    rules: [{
                      required: item.required,
                      message: `${item.Tips} field should be no-null`,
                    }],
                     initialValue:item.initialValue || undefined

                  }
                ]"
                :disabled="item.disabled"
                @change="inputChangeHandle"
                :class="{'last-textarea-align':item.isAlign}"
                :rows="item.row || 4"
                :style="{'resize':resize,'height':heightBor}"
              >
              </a-textarea>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row class="searchBtn" style="margin-top: 6px">
          <a-col :span="24" style="text-align: center">
            <slot></slot>
          </a-col>
        </a-row>
      </a-form>
    </div>
  </div>
</template>

<script lang='ts'>
import Vue from 'vue'
import { Component, Prop, Emit } from 'vue-property-decorator'
import moment from 'moment'
import { getDate, agoDate } from '@/untils/router'
@Component
export default class FormGroup extends Vue {
  private form: any
  //当前时间赋值
  private nowDate: string = ''
  //前31天赋值
  private curDate?: Date

  /**
   * Prop
   *
   * textarea style属性
   * @param resize string
   * @Param hightBor string
   *
   */

  @Prop({
    type: String,
    default: 'block'
  })
  private resize?: string

  @Prop({
    type: String,
    default: 'block'
  })
  private heightBor?: string
  /**
   * 表单数据 formoptions
   *      @param name：label 值 && from输出的字段
   *      @param required：是否必填 默认false && from输出的字段
   *      @param type: 输入框什么类型， 例如select['下拉'], picker['时间选择器'] -> 目前只支持这俩个
   *      @param options：输入框['下拉的子元素数据']
   *      @param formoptions的item.isAlign字段,设置textarea是否对齐,样式在组件最后
   *  isNeedSelectChange select是否需要监听
   *  allowClear 单选select是否支持清除
   */

  @Prop(Array) private formoptions?: any

  @Prop() private identifying?: any

  @Prop({
    type: Number,
    default: 8
  })
  private span?: number

  @Prop({
    type: Boolean,
    default: true
  })
  private isNeedSelectChange?: boolean

  @Prop({
    type: Boolean,
    default: false
  })
  private allowClear?: boolean

  /**
   * Emit 获取form表单数据传给父组件
   */

  // submit时触发handleSearch,参数传给父组件
  @Emit('Submit') Submit(err: any, values: any) {}

  // select发生变化时，触发handleChange,参数传给父组件
  @Emit('selectChange') selectChange(values: any, name: string) {}

  //monthPicker发生变化时，触发monthPickerHandle,参数传给父元素
  @Emit('monthPickerChange') monthPickerChange(e: any, values: any, decorator: string = '') {}

  //input发生变化时，触发inputChangeHandle,参数传给父元素
  @Emit('inputChange') inputChange(e: any,values: any,decorator: string): void {}

  //关闭模态框清除form数据
  @Emit('btnClick') btnClick(values: any) {}

  @Emit('handleClick') handleClick(name: any) {}
  // 定义搜索条件，可以只要startwit,

  private  filterOption(input, option) {
    return (
      option.componentOptions.children[0].text.toLowerCase().trim().startsWith(input)
    )
  }

  /**
   *
   * handleSearch
   * submit 数据验证成功后回调事件
   */

  public handleSearch(e: any) {
    e.preventDefault()
    this.form.validateFields((err: any, values: any) => {
      // submit 时传到父组件做数据校验，然后进一步处理
      this.Submit(err, values)
    })
  }

  /**
   * 下拉选择框change  回调
   *
   */
  private handleChange(e: string | [], name: string) {
    if (!this.isNeedSelectChange) {
      return
    }
    this.$nextTick(() => {
      this.selectChange(this.form.getFieldsValue(), name)
    })
  }

  /**
   * monthPicker change时触发
   */

  private monthPickerHandle(e: string | [], name: string) {
    console.log(e)
    this.$nextTick(() => {
      console.log(this.form.getFieldsValue())
      this.monthPickerChange(this.form.getFieldsValue(), name)
    })
  }
  /**
   * range picker change时触发
   */
  private rangeChangeHandle(e: any,decorator: string) {
    console.log(moment(e[0]).format('YYYY-MM-DD'))
    console.log(moment(e[1]).format('YYYY-MM-DD'))

    console.log(decorator)
  }
  onOk(value) {
    console.log(value)
  }

  /**
   * input change时触发
   */

  private inputChangeHandle(e: any,decorator: string):void {
    console.log(e)
    console.log(decorator)
    this.$nextTick(() => {
      this.inputChange(e, this.form.getFieldsValue(), decorator)
    })
  }

  public onChange(e: any, decorator: string) {
    this.$nextTick(() => {
      this.monthPickerChange(e, this.form.getFieldsValue(), decorator)
    })
  }

  /**
   *设置一组输入控件的值
   */

  private setFieldsValue(obj: any): void {
    this.form.setFieldsValue(obj)
  }

  /**
   * 重置一组输入控件的值（为 initialValue）与状态，
   * 如不传入参数，则重置所有组件
   */

  private resetFields(arr?: string[]): void {
    this.form.resetFields(arr ? arr : undefined)
  }

  /**
   * 获取一组输入控件的值，如不传入参数，则获取全部组件的值
   */
  public getFieldsValue(): any {
    return this.form.getFieldsValue()
  }

  /**
   * 校验并获取一组输入域的值与 Error，
   * 若 fieldNames 参数为空，则校验全部组件
   */
  private validateFields(): any {
    let val
    this.form.validateFields(
      {
        force: true
      },
      (err: any, values: any) => {
        if (!err) {
          val = values
        }
      }
    )
    return val
  }

  /**
   * form 添加到当前实例
   */
  private beforeCreate() {
    this.form = this.$form.createForm(this)
  }
  private mounted() {
    console.log(this.formoptions)
  }

  //时间插件获取焦点自动填值
  private dateFocus(name) {
    console.log(123)
    if (this.identifying) {
      const identifying = this.identifying.name
      const num = this.identifying.num
      this.nowDate = getDate()
      let formoptions: any[] = [...this.formoptions]
      const len = formoptions.length
      for (let i = 0; i < len; i++) {
        if (formoptions[i].decorator === name) {
          if (formoptions[i].initialValue.length === 0) {
            if (identifying === 'inclusion' || identifying === 'exclusion') {
              formoptions[i].initialValue = []
            } else if (identifying === 'technical') {
              formoptions[i].initialValue = [this.nowDate,'2019-12-31']

            } else if (identifying === 'routeClass' || identifying === 'routeProduct') {
              if (name === 'beginDate') {
                formoptions[i].initialValue = [agoDate(31),this.nowDate]

              }  else if (name === 'endDate') {
                formoptions[i].initialValue = [agoDate(31),'2099-12-31']
              }
            } else if (identifying === 'commercial') {
              formoptions[i].initialValue = [agoDate(10), agoDate(20, 'before')]

            } else {
              formoptions[i].initialValue = [agoDate(num),this.nowDate]
            }
          }
        }
      }
    }
  }
}
</script>

<style scoped>
.inner-form-group >>> .ant-form-item {
  display: flex;
}

#components-form-group >>> .ant-form-item-label {
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

#components-form-group .inner-form-group >>> .ant-form-item-label label {
  font-weight: 600;
  color: #000;
}

#components-form-group >>> .ant-form-item-children .ant-calendar-picker {
  display: inline-block;
  width: 100%;
}

#components-form-group .inner-form-group >>> .ant-row  {
  margin-bottom: 3px
}

form textarea.last-textarea-align {
  width: 96%;
  margin-left: 4%;
}

#components-form-group {
  max-width: none;
  border-radius: 4px;
  position: relative;
}
.inner-form-group {
  padding: 15px;
  background: #fff;
  border-radius: 6px;
}
</style>
