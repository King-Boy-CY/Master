<template>
  <div>
    <a-form :form="form"
            @submit="handleSearch">
      <a-row justify="start"
             type="flex">
        <a-col :span="11"
               :offset="1"
               v-for="(item,key) in formoptions"
               :key="key">
          <a-form-item :label="item.name"
                       :colon="false"
                       :wrapperCol="{ span: 15 }"
                       :labelCol="{ span: 8}"
                       :hasFeedback="false">
            <a-select @change="handleChange(item.Tips,$event,key)"
                      @dropdownVisibleChange="dropdownVisibleChange(item.Tips,$event,key)"
                      :getPopupContainer=" e=>e.parentNode"
                      v-if="item.type==='select'"
                      allowClear
                      :disabled="item.disabled"
                      v-decorator="[
                                `${item.Tips}`,
                                {
                                    initialValue:item.initialValue,
                                    rules: [{
                                        required: item.required,
                                        message: `${item.Tips} field should be no-null`,
                                    }],
                                    initialValue:item.initialValue || undefined
                                }
                            ]"
                      placeholder>
              <a-select-option :value="child.value"
                               v-for="(child,key) in item.options"
                               :key="key"
                               :disabled="( child.name || child) ==='Low'&& low ">{{child.name || child}}</a-select-option>
            </a-select>
            <a-date-picker @click="pickChang(item.Tips,key)"
                           :disabled="item.disabled"
                           v-if="item.type === 'picker'"
                           :getCalendarContainer="e => e.parentNode"
                           v-decorator="[
                            `${item.Tips}`,
                            {
                              rules: [{
                                required: item.required,
                                message: `${item.Tips} field should be no-null`,
                              }]
                            }
                        ]"
                           @change="onChange(item.Tips,$event,key)"
                           style="width:100%"
                           placeholder="YYYY-MM-DD" />
            <a-input placeholder
                     :disabled="item.disabled"
                     allowClear
                     v-else-if="item.type === 'input'"
                     :getPopupContainer=" e => e.parentNode"
                     v-decorator="[
                            `${item.Tips}`,
                            {
                                rules: [{
                                    required: item.required,
                                    message: `${item.Tips} field should be no-null`,
                                }

                                ]
                            }
                        ]" />
            <a-select mode="multiple"
                      :maxTagCount="1"
                      :getPopupContainer=" e => e.parentNode"
                      v-decorator="[
                                      `${item.Tips}`,
                                      {
                                        rules: [{
                                          required: item.required,
                                          message: `${item.Tips} field should be no-null`,
                                        }],
                                      }
                                    ]"
                      placeholder
                      @click=" handleChange(item.Tips, key, child.name)"
                      v-else-if=" item. type === 'tags'">
              <a-select-option v-for=" (itn,index) in item.options"
                               :value="itn.value"
                               :key="index">{{itn.name || itn}}</a-select-option>
            </a-select>

            <a-row v-if="item.type === 'upload'">
              <a-col :span="16">
                <a-input allowClear
                         v-decorator="[
                              `${item.Tips}`,
                              {
                              rules: [{
                                required: item.required,
                                message: `${item.Tips} field should be no-null`,
                              },...(item.rules && item.rules instanceof Array ? item.rules : [])],
                              initialValue:item.initialValue || undefined
                            }
                          ]" :disabled="true" />
            </a-col>
            <a-col :span="5" :offset="1">
              <a-upload :name="item.Tips" :accept="item.accept" :multiple="item.multiple || true" :action="item.action" :fileList="[]" :headers="item.headers" @change="uploadChange($event,item)">
                <a-button type="primary" :disabled="item.disabled">Upload</a-button>
              </a-upload>
            </a-col>
          </a-row>
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</div>
</template>

<script lang="ts">
import Vue from "vue";
import {
  Component,
  Prop,
  Emit
} from "vue-property-decorator";
@Component({
  components: {}
})
export default class upload extends Vue {
  @Prop() formoptions: any;
  @Emit("uploadVcNumberPlanData") uploadVcNumberPlanData(value: any, file: any) {}
  /* 获取form 表单的数据传给父组件 */
  @Emit("Submit") Submit(values: any) {}
  private form: any; // form表单
  private NumberPlanNameArr: any = {}; // NumberPlanName自动生成数据保存
  private fieldsFileObj: any
  /* 给form 添加当前实例 */
  private beforeCreate() {
    this.form = this.$form.createForm(this);
  }
  public dropdownVisibleChange(name, $event, key) {}
  // select下拉框触发回调
  public handleChange(labelName, value, optionsKey) {
    console.log(labelName, value, optionsKey)
    let formData: any = this.form.getFieldsValue();
    if (
      labelName == "Account" ||
      labelName == "Service" ||
      labelName == "Direction"
    ) {
      this.NumberPlanNameArr[labelName] = value;
      console.log(this.NumberPlanNameArr)
      // 将direction为1，2的转化为字符串
      if (labelName == "Direction") {
        this.NumberPlanNameArr['Direction'] = this.NumberPlanNameArr['Direction'] === 1 ? 'Inbound' : 'Outbound';
      }
      if (Object.values(this.NumberPlanNameArr).length >= 3) {
        this.form.setFieldsValue({
          ["NumberPlanName"]: `VC-${this.NumberPlanNameArr.Account}-${this.NumberPlanNameArr.Service}-${this.NumberPlanNameArr.Direction}`
        });
      }
    }
  }

  public onChange(name, $event, key) {}

  private uploadChange($event, item) {
    console.log($event);
    console.log(item)
    if ($event.file.status === "done") {
      this.$message.success(`${$event.file.name} file uploaded successfully`);
    }
    this.form.setFieldsValue({
      [item.Tips]: $event.file.name,
    });
    this.fieldsFileObj = $event;
  }

  private handleSearch() {
    this.form.validateFields((msg) => {
      console.log(msg);
    });
    let advancedSearchData = this.form.getFieldsValue()
    console.log(advancedSearchData);

    this.uploadVcNumberPlanData(advancedSearchData, this.fieldsFileObj);
  }
}
</script>

<style scoped>
.ant-form.ant-form-horizontal .ant-form-item {
  margin: 0;
}
</style>
