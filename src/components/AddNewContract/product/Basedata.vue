<template>
<div class="Basedata">
    <h1>Basic data</h1>
    <a-form :form="form">
        <a-row style="margin-top:10px; margin-left: 20px;position:relative" justify="start" type="flex">
            <a-col v-for="(item,key) in baseData" :key="key" :span="8" style="height: 60px;">
                <a-form-item :label="item.name" :colon="false" :hasFeedback="false" :label-col="{ span: 10 }" :wrapper-col="{ span: 13 }">
                    <a-select @change="handleChange(item.Tips, $event)" :showSearch="item.showSearch" allowClear :getPopupContainer="triggerNode => triggerNode.parentNode" v-if="item.type === 'select'" style="width:100%" v-decorator="[
                `${item.Tips}`,
                {
                  rules: [{
                    required: item.required,
                    message: `${item.name} field should be no-null`,
                  }],
                  initialValue:item.initialValue
                }
              ]" :disabled="item.Tips !== 'Commitment' && item.disabled">
                        <a-select-option :value="key+1" v-for="(child,key) in item.options" :key="key">
                            {{child.name || child}}
                        </a-select-option>
                    </a-select>
                    <!-- initialValue:null -->
                    <!-- <a-select mode="tags" :maxTagCount="0" :disabled="item.Tips !== 'Commitment' && item.disabled" @change="handleChange(item.Tips, $event)" :showSearch="item.showSearch" allowClear :getPopupContainer="triggerNode => triggerNode.parentNode" style="width:100%" v-decorator="[
                `${item.Tips}`,
                {
                  rules: [{
                    required: item.required,
                    message: `${item.name} field should be no-null`,
                  }],

                 initialValue:item.initialValue || undefined
                }
              ]" placeholder="" v-else-if="item.type === 'tags'">
            <a-select-option :value="child" v-for="(child,key) in item.options" :key="key">
              {{child}}
            </a-select-option>
          </a-select> -->
                    <el-select :multiple-limit="1" filterable multiple v-else-if="item.type === 'tags'" allow-create :disabled="item.Tips !== 'Commitment' && item.disabled" @change="handleChange(item.Tips, $event)" :getPopupContainer="triggerNode => triggerNode.parentNode" style="width:100%;vertical-align: middle;" v-decorator="[
                `${item.Tips}`,
                {
                  rules: [{
                    required: item.required,
                    message: `${item.name} field should be no-null`,
                  }],

                 initialValue:item.initialValue || undefined
                }
              ]" placeholder="">
                        <el-option :value="child" v-for="(child,key) in item.options" :key="key">
                        </el-option>
                    </el-select>
                    <!-- <el-select
                    :disabled="item.Tips !== 'Commitment' && item.disabled"
                    @change="handleChange(item.Tips, $event)"
                    filterable
                    no-data-text="No data"
                    allowClear :getPopupContainer="triggerNode => triggerNode.parentNode" style="width:200px;height:50px" v-decorator="[
     `${item.Tips}`,
                {
                  rules: [{
                    required: item.required,
                    message: `${item.name} field should be no-null`,
                  }],
                  initialValue:item.initialValue
                }
              ]" :placeholder="" v-else-if="item.type === 'tags'"  default-first-option>
                        <el-option :value="child" v-for="(child,key) in item.options" :key="key"></el-option>
                    </el-select> -->
                    <a-date-picker :getCalendarContainer="triggerNode => triggerNode.parentNode" :disabled="item.disabled" v-decorator="[
                `${item.Tips}`,
                {
                  rules: [{
                    required: item.required,
                    message: `${item.name} field should be no-null`,
                  }],
                  initialValue:item.initialValue
                }
              ]" @change="onChange" v-else-if="item.type === 'picker'" style="width:100%" placeholder="YYYY-MM-DD" format="YYYY-MM-DD" />
                    <a-input @change="onChane" hasFeedback v-else-if="item.type === 'input'" :disabled="item.disabled" v-decorator="[
                  `${item.Tips}`,
                  {
                    rules: [{
                      required: item.required,
                      message: `${item.name} field should be no-null`
                    }],
                    initialValue:item.initialValue
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
    baseCycle,
    baseData
} from './baseConfig'
import {
    Component,
    Emit,
    Prop
} from 'vue-property-decorator'
import {
    State
} from 'vuex-class'
import moment from 'moment'
// 请求接口
import {
    getPeriodCycles
} from '@/api/index'

@Component
export default class basedata extends Vue {
    @Emit('input') onInput() {} /* 输入框输入触发 */
    @Emit('select') onSelect(value: any, name: string | number) {} /* 输入框输入触发 */
    @Emit('selectClear') selectClear(value: any, name: string) {} /* 输入框输入触发 */
    @Emit('baseForm') baseFormChange(form: any) {} /* form */
    @Prop(Array) private baseData!: any
    @State('ratePlanObject') private ratePlanObject: any
    @State('productIndex') private productIndex ? : any
    @State('contractData') private contractData ? : any
    @State('productName') private productName ? : any
    @State('editData') editData: any
    @State('contractIndex') private contractIndex ? : number;
    @Prop() private editArr ? : any;
    private form: any;
    public beforeCreate() {
        this.form = this.$form.createForm(this);
    }

    /* 时间选中 */
    public onChange(picker: any): void {

    }
    /* Commitment */
    public commitMent(name: string | number, value: string) {
        if (!name) return
        const baseData = this.baseData;
        baseData.forEach((elem: any, index: number) => {
            if (name === 2 || name === 'No') {
                this.form.resetFields()
                this.form.setFieldsValue({
                    'Graceperiod': undefined,
                    'AnyShortfall': undefined,
                    'Anyexceed': undefined,
                    'TrafficForwardto': undefined,
                    'TrafficFrom': undefined,
                    'TrafficFrom%': undefined,
                    'Trafficforwardto': undefined,
                    'Trafficforwardto%': undefined,
                    'GracePeriodcycle': undefined,
                    'ForwardPeriodcycle': undefined
                })
                elem.disabled = true;
                // elem.initialValue = undefined
                elem.required = index === 0 || false;
            } else {
                elem.disabled = false;
                elem.Tips === 'Graceperiod' && (elem.required = true);
            }
        });
    }
    /* Graceperiod */
    public gracePeriod(name: string | number, value: string) {
        if (!name) return
        // console.log(name,value)
        const baseData = this.baseData;
        const AnyShortfall = this.form.getFieldValue('AnyShortfall')

        let fromValue = this.form.getFieldValue('TrafficFrom')
        let fromValue_ = this.form.getFieldValue('TrafficFrom%')
        baseData.forEach((elem: any) => {
            if (name === 2 || name === 'No') {
                this.form.resetFields(['GracePeriodcycle', 'AnyShortfall', 'TrafficFrom', 'TrafficFrom%'])
                this.form.setFieldsValue({
                    'AnyShortfall': undefined,
                    'GracePeriodcycle': undefined,
                    'TrafficFrom': undefined,
                    'TrafficFrom%': undefined
                })
                elem.Tips === 'GracePeriodcycle' && (elem.disabled = true) && (elem.required = false);
                elem.Tips === 'AnyShortfall' && (elem.disabled = true) && (elem.required = false);
                elem.Tips === 'TrafficFrom' && (elem.disabled = true) && (elem.required = false);
                elem.Tips === 'TrafficFrom%' && (elem.disabled = true) && (elem.required = false);
            } else {
                // elem.Tips === 'GracePeriodcycle' && (elem.required = true) && (elem.disabled = false);
                elem.Tips === 'GracePeriodcycle' && (elem.disabled = false, elem.required = true);
                elem.Tips === 'AnyShortfall' && (elem.required = true) && (elem.disabled = false);
                if (name === 1 && AnyShortfall === 'Yes' || AnyShortfall === 1) {
                    elem.Tips === 'TrafficFrom' && (elem.disabled = true) && (elem.required = false);
                    elem.Tips === 'TrafficFrom%' && (elem.disabled = true) && (elem.required = false);
                } else if (name === 1 && AnyShortfall === 'No' || AnyShortfall === 2 && fromValue) {
                    elem.Tips === 'TrafficFrom' && (elem.disabled = false) && (elem.required = true);
                    elem.Tips === 'TrafficFrom%' && (elem.disabled = true) && (elem.required = false);
                } else if (name === 1 && AnyShortfall === 'No' || AnyShortfall === 2 && fromValue_) {
                    elem.Tips === 'TrafficFrom' && (elem.disabled = true) && (elem.required = true);
                    elem.Tips === 'TrafficFrom%' && (elem.disabled = false) && (elem.required = true);
                }
                //  else {
                //   elem.Tips === 'TrafficFrom' && (elem.disabled = false) && (elem.required = false);
                //   elem.Tips === 'TrafficFrom%' && (elem.disabled = false) && (elem.required = false);
                // }
            }
        });
    }
    /* AnyShortfall */
    public anyShortfall(name: string | number, value: string) {
        if (!name) return
        const baseData = this.baseData;
        let fromValue = this.form.getFieldValue('TrafficFrom')
        let fromValue_ = this.form.getFieldValue('TrafficFrom%')
        baseData.forEach((elem: any) => {
            if (name === 2 || name === 'No') {
                if (fromValue) {
                    elem.Tips === 'TrafficFrom%' && (elem.disabled = true);
                    elem.Tips === 'TrafficFrom' && (elem.disabled = false);
                } else if (fromValue_) {
                    elem.Tips === 'TrafficFrom' && (elem.disabled = true);
                    elem.Tips === 'TrafficFrom%' && (elem.disabled = false);
                } else {
                    elem.Tips === 'TrafficFrom' && (elem.disabled = false, elem.required = true);
                    elem.Tips === 'TrafficFrom%' && (elem.disabled = false, elem.required = true);
                }
            } else {
                this.form.resetFields(['TrafficFrom', 'TrafficFrom%'])
                elem.Tips === 'TrafficFrom' && (elem.disabled = true, elem.required = false);
                elem.Tips === 'TrafficFrom%' && (elem.disabled = true, elem.required = false);
            }
        });
    }
    /* TrafficForwardto */
    public trafficForwardto(name: string | number, value: string) {
        if (!name) return
        const baseData = this.baseData;
        const Anyexceed = this.form.getFieldValue('Anyexceed')
        let Trafficforwardto = this.form.getFieldValue('Trafficforwardto')
        let Trafficforwardto_ = this.form.getFieldValue('Trafficforwardto%')
        baseData.forEach((elem: any) => {
            if (name === 2 || name === 'No') {
                this.form.resetFields(['ForwardPeriodcycle', 'Anyexceed', 'Trafficforwardto', 'Trafficforwardto%'])
                this.form.setFieldsValue({
                    'Anyexceed': undefined,
                    'ForwardPeriodcycle': undefined,
                    'Trafficforwardto': undefined,
                    'Trafficforwardto%': undefined
                })
                elem.Tips === 'ForwardPeriodcycle' && (elem.disabled = true, elem.required = false);
                elem.Tips === 'Anyexceed' && (elem.disabled = true, elem.required = false);
                elem.Tips === 'Trafficforwardto' && (elem.disabled = true);
                elem.Tips === 'Trafficforwardto%' && (elem.disabled = true);
            } else {
                elem.Tips === 'ForwardPeriodcycle' && (elem.disabled = false, elem.required = true);
                elem.Tips === 'Anyexceed' && (elem.disabled = false, elem.required = true);
                if (name === 1 && Anyexceed === 'Yes' || Anyexceed === 1) {
                    elem.Tips === 'Trafficforwardto' && (elem.disabled = true, elem.required = false)
                    elem.Tips === 'Trafficforwardto%' && (elem.disabled = true, elem.required = false)
                } else
                if (name === 1 && Anyexceed === 'No' || Anyexceed === 2 && Trafficforwardto) {
                    elem.Tips === 'Trafficforwardto' && (elem.disabled = false, elem.required = true)
                    elem.Tips === 'Trafficforwardto%' && (elem.disabled = true, elem.required = false)
                } else if (name === 1 && Anyexceed === 'No' || Anyexceed === 2 && Trafficforwardto_) {
                    elem.Tips === 'Trafficforwardto' && (elem.disabled = true, elem.required = true)
                    elem.Tips === 'Trafficforwardto%' && (elem.disabled = false, elem.required = true)
                } else if (name === 1 && !value) {
                    elem.Tips === 'Trafficforwardto' && (elem.disabled = true, elem.required = false)
                    elem.Tips === 'Trafficforwardto%' && (elem.disabled = true, elem.required = false)
                }
                // elem.Tips === 'Trafficforwardto' && (elem.disabled = true);
                // elem.Tips === 'Trafficforwardto%' && (elem.disabled = true);
            }
        });
    }
    /* ForwardPeriodcycle */
    public forwardPeriodcycle(name: string | number, value: string) {
        // if (!name) {
        //   return setTimeout(() => {
        //     this.form.setFieldsValue({
        //       ForwardPeriodcycle: 'Next period'
        //     });
        //   }, 0)
        // }
        // const baseData = this.baseData;
        // baseData.forEach((elem: any) => {
        //   if (name === 1) {
        //     elem.Tips === 'Anyexceed' && (elem.required = false);
        //     elem.Tips === 'Trafficforwardto' && (elem.required = false);
        //     elem.Tips === 'Trafficforwardto%' && (elem.required = false);
        //   } else {
        //     elem.Tips === 'Anyexceed' && (elem.required = true);
        //     elem.Tips === 'Trafficforwardto' && (elem.required = true);
        //     elem.Tips === 'Trafficforwardto%' && (elem.required = true);
        //   }
        // });
    }
    /* Anyexceed */
    public anyexceed(name: string | number, value: string) {
        if (!name) return
        const baseData = this.baseData;
        let fromValue = this.form.getFieldValue('Trafficforwardto')
        let fromValue_ = this.form.getFieldValue('Trafficforwardto%')
        baseData.forEach((elem: any) => {
            if (name === 2 || name === 'No') {
                if (fromValue) {
                    elem.Tips === 'Trafficforwardto%' && (elem.disabled = true, elem.required = false);
                    elem.Tips === 'Trafficforwardto' && (elem.disabled = false, elem.required = true);
                } else if (fromValue_) {
                    elem.Tips === 'Trafficforwardto' && (elem.disabled = true, elem.required = false);
                    elem.Tips === 'Trafficforwardto%' && (elem.disabled = false, elem.required = true);
                } else {
                    elem.Tips === 'Trafficforwardto' && (elem.disabled = false, elem.required = true);
                    elem.Tips === 'Trafficforwardto%' && (elem.disabled = false, elem.required = true);
                }
                // elem.Tips === 'Trafficforwardto' && (elem.disabled = false);
                // elem.Tips === 'Trafficforwardto%' && (elem.disabled = false);
            } else {
                console.log('2----a');

                this.form.resetFields(['Trafficforwardto', 'Trafficforwardto%'])
                elem.Tips === 'Trafficforwardto' && (elem.disabled = true, elem.required = false);
                elem.Tips === 'Trafficforwardto%' && (elem.disabled = true, elem.required = false);
            }
        });
    }
    /* GracePeriodcycle */
    public gracePeriodcycle(name: string | number, value: string) {
        if (!name) {
            setTimeout(() => {
                this.form.setFieldsValue({
                    GracePeriodcycle: 'Next period'
                });
            }, 0)
        }
    }
    /* 条件筛选 */
    public switchData(value: string, name: string | number) {
        switch (value) {
            case 'Commitment':
                this.commitMent(name, value);
                break;
            case 'Graceperiod':
                this.gracePeriod(name, value);
                break;
            case 'AnyShortfall':
                this.anyShortfall(name, value);
                break;
            case 'TrafficForwardto':
                this.trafficForwardto(name, value);
                break;
            case 'ForwardPeriodcycle':
                this.forwardPeriodcycle(name, value);
                break;
            case 'Anyexceed':
                this.anyexceed(name, value);
                break;
            case 'GracePeriodcycle':
                this.gracePeriodcycle(name, value);
                break;
            default:
                break;
        }
    }
    /* 下拉选中 */
    public handleChange(value: any, name: string | number): void {
        this.switchData(value, name)
        this.onSelect(value, name)
        if ((value === 'Commitment') && !!value && name === 1) {
            return this.processingData(value, name)
        }
    }
    /* 输入框触发 */
    public onChane(val: any) {
        const baseData = this.baseData; // Trafficforwardto  Trafficforwardto%
        baseData.forEach((elem: any) => {
            /* 承诺量不足时 */
            if (val.target.id === 'TrafficFrom' && !!val.target.value) {
                elem.Tips === 'TrafficFrom%' && (elem.disabled = true, elem.required = false);
                elem.Tips === 'TrafficFrom%' && this.form.setFieldsValue({
                    'TrafficFrom%': undefined,
                });
            } else if (val.target.id === 'TrafficFrom' && !val.target.value) {
                if (elem.Tips === 'TrafficFrom%') {
                    elem.disabled = false
                    elem.required = true
                }
            }
            if (val.target.id === 'TrafficFrom%' && !!val.target.value) {
                elem.Tips === 'TrafficFrom' && (elem.disabled = true, elem.required = false);
                elem.Tips === 'TrafficFrom' && this.form.setFieldsValue({
                    TrafficFrom: undefined,
                });
            } else if (val.target.id === 'TrafficFrom%' && !val.target.value) {
                if (elem.Tips === 'TrafficFrom') {
                    elem.disabled = false
                    elem.required = true
                }

            }

            /* 超出承诺量 */
            if (val.target.id === 'Trafficforwardto' && !!val.target.value) {
                elem.Tips === 'Trafficforwardto%' && (elem.disabled = true, elem.required = false);
                elem.Tips === 'Trafficforwardto%' && this.form.setFieldsValue({
                    'Trafficforwardto%': undefined,
                });
            } else if (val.target.id === 'Trafficforwardto' && !val.target.value) {
                if (elem.Tips === 'Trafficforwardto%') {
                    elem.disabled = false, elem.required = true;
                }
            }
            if (val.target.id === 'Trafficforwardto%' && !!val.target.value) {
                elem.Tips === 'Trafficforwardto' && (elem.disabled = true, elem.required = false);
                elem.Tips === 'Trafficforwardto' && this.form.setFieldsValue({
                    'Trafficforwardto': undefined,
                });
            } else if (val.target.id === 'Trafficforwardto%' && !val.target.value) {
                if (elem.Tips === 'Trafficforwardto') {
                    elem.disabled = false, elem.required = true;
                }

            }
        })
    }
    /* 默认值 数据处理 */
    public processingData(value ? : string, name ? : string | number) {
        const baseData = this.baseData;
        this.$nextTick(() => {
            setTimeout(() => {
                const Anyexceed = this.form.getFieldValue('Anyexceed')
                let Trafficforwardto = this.form.getFieldValue('Trafficforwardto')
                let Trafficforwardto_ = this.form.getFieldValue('Trafficforwardto%')
                const AnyShortfall = this.form.getFieldValue('AnyShortfall')
                let fromValue = this.form.getFieldValue('TrafficFrom')
                let fromValue_ = this.form.getFieldValue('TrafficFrom%')
                let Graceperiod = this.form.getFieldValue('Graceperiod')
                let TrafficForwardto = this.form.getFieldValue("TrafficForwardto")
                let Commitment = this.form.getFieldValue("Commitment")
                // console.log('Trafficforwardto', Trafficforwardto);
                // console.log('Trafficforwardto_', Trafficforwardto_);
                // console.log('Anyexceed', Anyexceed, Anyexceed === 'No' || Anyexceed === 2 && !!Trafficforwardto_);
                // if (Commitment && Commitment === 2 || Commitment === 'No') {
                this.onSelect('Commitment', Commitment)
                // }
                baseData.forEach((res: any) => {
                    // if (!!res.initialValue && !this.form.getFieldValue(res.Tips)) {
                    //   return this.switchData(res.Tips, res.initialValue)
                    // }
                    // return console.log(this.form.getFieldValue(res.Tips))
                    // if (!!res.initialValue) {
                    //     this.switchData(res.Tips, res.initialValue)
                    // }                
                    if (Commitment && Commitment === 2 || Commitment === 'No') {
                        if (res.Tips === 'Graceperiod') {
                            res.disabled = true
                        }
                        if (res.Tips === 'TrafficForwardto') {
                            res.disabled = true
                        }
                    }
                    if (Commitment && Commitment === 1 || Commitment === 'Yes') {
                        if (res.Tips === 'Graceperiod') {
                            res.disabled = false
                        }
                        if (res.Tips === 'TrafficForwardto') {
                            res.disabled = false
                        }
                    }
                    if ((Graceperiod === 'No' || Graceperiod === 2) || !Graceperiod) {
                        res.Tips === 'GracePeriodcycle' && (res.disabled = true, res.required = false)
                        res.Tips === 'AnyShortfall' && (res.disabled = true, res.required = false)
                        res.Tips === 'TrafficFrom' && (res.disabled = true, res.required = false)
                        res.Tips === 'TrafficFrom%' && (res.disabled = true, res.required = false)
                    }
                    if (Graceperiod === 'Yes' || Graceperiod === 1) {
                        res.Tips === 'GracePeriodcycle' && (res.disabled = false, res.required = true)
                        res.Tips === 'AnyShortfall' && (res.disabled = false, res.required = true)
                    }
                    if ((TrafficForwardto === 'No' || TrafficForwardto === 2) || !TrafficForwardto) {
                        res.Tips === 'ForwardPeriodcycle' && (res.disabled = true, res.required = false);
                        res.Tips === 'Anyexceed' && (res.disabled = true, res.required = false);
                        res.Tips === 'Trafficforwardto' && (res.disabled = true);
                        res.Tips === 'Trafficforwardto%' && (res.disabled = true);
                    }
                    if (TrafficForwardto === 'Yes' || TrafficForwardto === 1) {
                        res.Tips === 'ForwardPeriodcycle' && (res.disabled = false, res.required = true);
                        res.Tips === 'Anyexceed' && (res.disabled = false, res.required = true);
                    }
                    if (Anyexceed && Anyexceed === 'Yes' || Anyexceed === 1) {
                        res.Tips === 'Trafficforwardto' && (res.disabled = true, res.required = false)
                        res.Tips === 'Trafficforwardto%' && (res.disabled = true, res.required = false)
                    }
                    if ((Anyexceed === 'No' || Anyexceed === 2) && !!Trafficforwardto) {
                        res.Tips === 'Trafficforwardto' && (res.disabled = false, res.required = true)
                        res.Tips === 'Trafficforwardto%' && (res.disabled = true, res.required = false)
                    }
                    if ((Anyexceed === 'No' || Anyexceed === 2) && !!Trafficforwardto_) {
                        res.Tips === 'Trafficforwardto' && (res.disabled = true, res.required = false)
                        res.Tips === 'Trafficforwardto%' && (res.disabled = false, res.required = true)
                    }
                    //  else {
                    //     console.log('2');

                    //     res.Tips === 'Trafficforwardto' && (res.disabled = true, res.required = false)
                    //     res.Tips === 'Trafficforwardto%' && (res.disabled = true, res.required = false)
                    // }
                    if (AnyShortfall === 'Yes' || AnyShortfall === 1) {
                        res.Tips === 'TrafficFrom' && (res.disabled = true) && (res.required = false);
                        res.Tips === 'TrafficFrom%' && (res.disabled = true) && (res.required = false);
                    }
                    if ((AnyShortfall === 'No' || AnyShortfall === 2) && fromValue) {
                        res.Tips === 'TrafficFrom' && (res.disabled = false, res.required = true)
                        res.Tips === 'TrafficFrom%' && (res.disabled = true, res.required = false)
                    }
                    console.log(fromValue, !!fromValue);

                    if ((AnyShortfall === 'No' || AnyShortfall === 2) && fromValue_) {
                        res.Tips === 'TrafficFrom' && (res.disabled = true, res.required = false)
                        res.Tips === 'TrafficFrom%' && (res.disabled = false, res.required = true)
                    }
                    // else {
                    //     res.Tips === 'TrafficFrom' && (res.disabled = true, res.required = false)
                    //     res.Tips === 'TrafficFrom%' && (res.disabled = true, res.required = false)
                    // }
                })
            }, 300);
        })

    }
    // 提交form
    public baseForm() {
        this.baseFormChange(this.form)
    }
    public periodCycle() {
        setTimeout(() => {
            let tabs:object[] = []
            let commitmentEndDate = ''
            let count: number = 0
            let cycleDate: string[] = []
            let produCycle: string = ''
            if (this.contractIndex === 1) {
                for (let i = 0; i < this.ratePlanObject.length; ++i) {
                    for (let j = 0; j < this.ratePlanObject[i].tabs.length; ++j) {
                        const element:object = this.ratePlanObject[i].tabs[j];
                        tabs.push(element)
                    }
                }
                produCycle = this.productName
            } else {
                tabs = this.editArr
                produCycle = this.editArr[this.productIndex]['ratePlanName']
            }
            console.log('produCycle', this.editArr);

            let di:String[] = ['Inbound', 'Outbound', 'Bilateral']
            /* 获取cycle 未来的周期 */
            // let produCycle = this.productName
            let productService = produCycle.split('-')[1]
            let productDirection:any = produCycle.split('-')[2]
            let productBeg = moment(tabs[this.productIndex]['commitmentBeginDate']).valueOf()
            let productEnd = moment(tabs[this.productIndex]['commitmentEndDate']).valueOf()
            let cycleList = []
            if (this.contractIndex === 1) {
                cycleList = this.contractData.cycleList
            } else {
                cycleList = this.editData.cycleList
            }
            this.baseData[2]['options'] = []
            for (let i = 0; i < cycleList.length; i++) {
                const element:{
                    beginDate:string,
                    endDate:string,
                    direction:string,
                    configServiceName:string
                } = cycleList[i];
                let elBeg = moment(element.beginDate).valueOf()
                let elEnd = moment(element.endDate).valueOf()
                if (di.indexOf(element.direction) + 1 !== 3 && element.configServiceName !== productService && di.indexOf(element.direction) + 1 !== productDirection) {
                    continue
                }
                if (moment(element.beginDate).valueOf() > productEnd) {
                    cycleDate.push(element['cycleName'])
                }
            }
            console.log('tabs', tabs);
            let data: baseCycle = {
                params: {
                    direction: tabs[this.productIndex]['direction'],
                    productName: tabs[this.productIndex]['typeName'].replace(/[\r\n\ +]/g, ""),
                    endDate: moment(tabs[this.productIndex]['commitmentEndDate']).format('YYYY-MM-DD')
                }
            }
            getPeriodCycles(data).then((res: baseData) => {
                this.baseData[2]['options'] = res.data || []
                this.baseData[7]['options'] = res.data || []
                if (this.baseData[2]['options'].join(',').indexOf('Next period') == -1 || this.baseData[7]['options'].join(',').indexOf('Next period') == -1) {
                    this.baseData[2]['options'] = res.data && [...res.data, ...cycleDate, 'Next period']
                    this.baseData[7]['options'] = res.data && [...res.data, ...cycleDate, 'Next period']
                }
            })
        }, 200);
    }
    public activated() {
        console.log('2');

        // this.baseForm()
        // this.processingData()
        this.periodCycle()
    }
    public created() {
        this.processingData()
        this.baseForm()
        this.baseData[2]['options'].push('Next period')
        this.periodCycle()
    }

}
</script>

<style lang="scss" scoped>
.Basedata {
    h1 {
        padding: 10px;
        border-bottom: 1px solid rgb(231, 231, 231);
    }
}
</style>
