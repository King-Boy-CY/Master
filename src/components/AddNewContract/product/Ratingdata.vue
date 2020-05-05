<template>
<div class="Ratingdata">
    <h1>Rating data</h1>
    <a-form :form="form">
        <a-row style="margin-top:10px; margin-left: 20px;" justify="start" type="flex">
            <a-col v-for="(item,key) in ratingData" :key="key" :span="12" style="height: 60px;">
                <a-form-item :label="item.name" :colon="false" :hasFeedback="false" :label-col="{ span: 9 }" :wrapper-col="{ span: 10 }">
                    <a-select allowClear :disabled="item.disabled" :getPopupContainer="triggerNode => triggerNode.parentNode" v-if="item.type === 'select'" style="width:100%" @change="handleChange(item.Tips, $event)" v-decorator="[
                `${item.Tips}`,
                {
                  rules: [{
                    required: item.required,
                    message: `${item.name} field should be no-null`,
                  }],
                  initialValue: item.initialValue
                }
              ]">
                        <a-select-option :disabled="child.disabled" :value="child.name" v-for="(child,key) in item.options" :key="key+1">{{child.name}}</a-select-option>
                    </a-select>
                    <a-date-picker format="YYYY-MM-DD" :disabled="item.disabled" :getCalendarContainer="triggerNode => triggerNode.parentNode" v-decorator="[
                `${item.Tips}`,
                {
                  rules: [{
                    required: item.required,
                    message: `${item.name} field should be no-null`,
                  }],
                  initialValue:item.initialValue ? moment(item.initialValue, 'YYYY-MM-DD') : undefined
                }
              ]" @change="onChange($event,item.Tips)" v-else-if="item.type === 'picker'" style="width:100%" placeholder="YYYY-MM-DD" />
                    <a-input @change="onInput" :disabled="item.disabled" hasFeedback v-else-if="item.type === 'input'" v-decorator="[
                  `${item.Tips}`,
                  {
                    rules: [{
                      required: item.required,
                      message: `${item.name} field should be no-null`
                    }],
                    initialValue: item.initialValue || undefined
                }
              ]" />
                </a-form-item>
            </a-col>
        </a-row>
    </a-form>
</div>
</template>

<script lang="ts">
import Vue from 'vue'
import {
    Component,
    Prop,
    Emit
} from 'vue-property-decorator'

@Component({
    components: {
        selectInput: resolve => require(['@/common/selectInput/index.vue'], resolve),
    }
})
export default class basedata extends Vue {
    @Prop(Array) private ratingData: any
    @Emit('input') Input < T > (value: string, name: string) {}; // 输入触发事件
    @Emit('select') Select < T > (value: string, form: any) {} // 下拉触发事件
    @Emit('changeFrom') changeFrom < T > (form: any) {} // 提交此周期form
    @Emit('pickerChange') pickerChange < T > (picker: any, name: string) {} // 时间触发
    private form: any;
    public beforeCreate() {
        this.form = this.$form.createForm(this);
    }
    /* 时间选中 */
    public onChange(picker: any, name: string): void {
        this.pickerChange(picker, name)
    }
    /* 下拉选中 -> 有承诺量的时候必须一致 */
    public handleChange(Tips: string, name: string): void {
        this.ratingData.forEach((elem: any) => {
            if (elem.Tips === 'TierunitType' || elem.Tips === 'IntervalunitType') {
                return this.form.setFieldsValue({
                    [elem.Tips]: name
                })
            }
            if (!name && elem.Tips === 'TierunitType' || elem.Tips === 'IntervalunitType') {
                this.form.setFieldsValue({
                    [elem.Tips]: undefined
                })
            }
        });
        this.Select < String > (name, this.form);
    }
    /* onInput -> 输入框输入触发  */
    public onInput(e: any) {
        this.Input < String > (e.target.value, e.target.id)
    }
    public checkForm() {
        this.changeFrom < String > (this.form);
    }
    public activated() {
        this.checkForm()
    }
    public created() {
        this.checkForm()
    }
}
</script>

<style lang="scss" scoped>
.Ratingdata {
    h1 {
        padding: 10px;
        border-bottom: 1px solid rgb(231, 231, 231);
    }
}
</style>
