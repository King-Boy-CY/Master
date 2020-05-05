<template>
  <div>
    <div id="components-form-demo-advanced-search"
         class="contractDetials unset">
      <a-form class="ant-advanced-search-form"
              :form="form"
              v-show="expand">
        <a-row>
          <a-col :span="8"
                 v-for="(item,key) in formoptions"
                 :key="key">
            <a-form-item :label="item.Tips"
                         :colon="false"
                         :label-col="{ span: 10, offset: 2 }"
                         :hasFeedback="false">
              <a-popover trigger="hover"
                         v-if="item.showPopover && item.popover">
                <div slot="content">{{item.popover || ''}}</div>
                <span style="display:none">.</span>
                <a-select v-if="item.type==='select'"
                          disabled
                          :placeholder="item.initialValue">
                  <a-select-option :defaultValue="child"
                                   v-for="(child,key) in item.options"
                                   :key="key"
                                   disabled>
                    {{child.name || child}}
                  </a-select-option>
                </a-select>
                <a-date-picker v-if="item.type === 'picker'"
                               placeholder=""
                               disabled
                               style="width:100%"
                               v-decorator="[
                            `${item.name}`,
                            {   initialValue:item.initialValue,
                                rules: [{
                                    required: item.required,
                                    message: `${item.Tips} field should be no-null`
                                }],
                            }
                        ]" />
                <a-input v-else-if="item.type === 'input'"
                         disabled
                         v-decorator="[
                            `${item.name}`,
                            {   initialValue:item.initialValue,
                                rules: [{
                                    required: item.required,
                                    message: `${item.Tips} field should be no-null`
                                }],
                            }
                        ]" />
              </a-popover>
              <template v-else>
                <a-select v-if="item.type==='select'"
                          disabled
                          :placeholder="item.initialValue">
                  <a-select-option :defaultValue="child"
                                   v-for="(child,key) in item.options"
                                   :key="key"
                                   disabled>
                    {{child.name || child}}
                  </a-select-option>
                </a-select>
                <a-date-picker v-if="item.type === 'picker'"
                               placeholder=""
                               disabled
                               style="width:100%"
                               v-decorator="[
                            `${item.name}`,
                            {   initialValue:item.initialValue||undefined,
                                rules: [{
                                    required: item.required,
                                    message: `${item.Tips} field should be no-null`
                                }],
                            }
                        ]" />
                <a-input v-else-if="item.type === 'input'"
                         disabled
                         v-decorator="[
                            `${item.name}`,
                            {   initialValue:item.initialValue,
                                rules: [{
                                    required: item.required,
                                    message: `${item.Tips} field should be no-null`
                                }],
                            }
                        ]" />
              </template>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {
    Component,
    Prop
} from 'vue-property-decorator'
import {
    Mutation
} from 'vuex-class'
import {
    AxiosGet
} from '@/api/axios'
import moment from 'moment'
@Component({
    components: {
        selectInput: resolve => require(['@/common/selectInput/index.vue'], resolve)
    }
})
export default class contractDetails extends Vue {
    @Mutation('mutionContract') mutionContract: any
    @Prop(Object) private detailResMsg ? : any
    private low: boolean = true;
    private autoRenew: boolean = true;
    private singedDate: boolean = true;
    private relatedContract: boolean = true;
    
    // private placeholder: object = {};
    // private date: object = {}
    private form: any;
    private expand: boolean = true
    @Prop({
        type: Number,
        default: 8
    }) span ? : number
    private formoptions: any[] = [{
            Tips: 'Account',
            name: 'accountName',
            required: true,
            type: 'select',
            options: null,
            initialValue: undefined,
            popover: undefined
        },
        {
            Tips: 'Contract',
            name: 'ContractName',
            type: 'input',
            initialValue: undefined,
            popover: undefined,
            showPopover: true
        },
        {
            Tips: 'Contract Abbrv.',
            name: 'ContractAbbrv',
            type: 'input',
            options: null,
            initialValue: undefined,
            popover: undefined,
            showPopover: true

        },
        {
            Tips: 'Service',
            name: 'Service',
            type: 'select',
            options: null,
            initialValue: undefined,
            popover: undefined

        },
        {
            Tips: 'Related Contract',
            name: 'relatedContract',
            type: 'select',
            options: null,
            initialValue: '',
            popover: undefined,
            showPopover: true
        },
        {
            Tips: 'Priority',
            name: 'priority',
            initialValue: 'High',
            required: false,
            type: 'select',
            options: [{
                name: 'High',
                value: true
            }, {
                name: 'Low'
            }],
            popover: undefined
        },
        {
            Tips: 'Signed date',
            name: 'Signeddate',
            type: 'picker',
            initialValue: undefined,
            popover: undefined
        },
        {
            Tips: 'begin date',
            name: 'beginDate',
            type: 'picker',
            initialValue: undefined,
            popover: undefined
        },
        {
            Tips: 'End date',
            name: 'EndDate',
            type: 'picker',
            initialValue: undefined,
            popover: undefined
        },
        {
            Tips: 'Auto renew',
            name: 'autoRenew',
            required: false,
            disabled: false,
            type: 'select',
            options: [{
                name: 'Yes'
            }, {
                name: 'No'
            }],
            initialValue: undefined,
            popover: undefined
        },
        {
            Tips: 'Renew date',
            name: 'singedDate',
            required: false,
            disabled: true,
            type: 'picker',
            initialValue: undefined,
            popover: undefined
        },

    ]
    /* 下拉选中 */

    private resDate: any
    public created() {
        console.log(typeof this.detailResMsg)
        console.log(this.detailResMsg.data.contractDetail.relatedContract);

        this.formoptions[0].initialValue = [this.detailResMsg.data.contractDetail.accountName]
        this.formoptions[3].initialValue = [this.detailResMsg.data.contractDetail.configServiceNameList]
        this.formoptions[4].initialValue = this.detailResMsg.data.contractDetail.relatedContract
        this.formoptions[5].initialValue = this.detailResMsg.data.contractDetail.priority == 1 ? 'Low' : 'High'
        this.formoptions[9].initialValue = this.detailResMsg.data.contractDetail.isAutoRenew == 1 ? 'YES' : 'NO'
        console.log(this.formoptions[6]);
        console.log(this.detailResMsg.data.contractDetail.contractAbbrv);

        this.formoptions[1].initialValue = this.detailResMsg.data.contractDetail.contractName
        this.formoptions[2].initialValue = this.detailResMsg.data.contractDetail.contractAbbrv
        this.formoptions[6].initialValue = this.detailResMsg.data.contractDetail.singedDate ? moment(this.detailResMsg.data.contractDetail.singedDate) : ""
        this.formoptions[7].initialValue = this.detailResMsg.data.contractDetail.beginDate ? moment(this.detailResMsg.data.contractDetail.beginDate) : ""
        this.formoptions[8].initialValue = this.detailResMsg.data.contractDetail.endDate ? moment(this.detailResMsg.data.contractDetail.endDate) : ""
        this.formoptions[10].initialValue = this.detailResMsg.data.contractDetail.renewDate ? moment(this.detailResMsg.data.contractDetail.renewDate) : ""

        this.formoptions[0].popover = this.detailResMsg.data.contractDetail.accountName
        this.formoptions[3].popover = this.detailResMsg.data.contractDetail.configServiceNameList
        this.formoptions[4].popover = this.detailResMsg.data.contractDetail.relatedContract
        this.formoptions[5].popover = this.detailResMsg.data.contractDetail.priority == 1 ? 'Low' : 'High'
        this.formoptions[9].popover = this.detailResMsg.data.contractDetail.isAutoRenew == 1 ? 'YES' : 'NO'
        this.formoptions[1].popover = this.detailResMsg.data.contractDetail.contractName
        this.formoptions[2].popover = this.detailResMsg.data.contractDetail.contractAbbrv
        this.formoptions[6].popover = this.detailResMsg.data.contractDetail.singedDate || ""
        this.formoptions[7].popover = this.detailResMsg.data.contractDetail.beginDate || ""
        this.formoptions[8].popover = this.detailResMsg.data.contractDetail.endDate || ""
        this.formoptions[10].popover = this.detailResMsg.data.contractDetail.renewDate || ""

        // this.$nextTick(() => {
        //     this.form.setFieldsValue({
        //         [this.formoptions[1].name]: this.detailResMsg.data.contractDetail.contractName,
        //         [this.formoptions[2].name]: this.detailResMsg.data.contractDetail.contractAbbrv,
        //         [this.formoptions[6].name]: this.detailResMsg.data.contractDetail.singedDate ? moment(this.detailResMsg.data.contractDetail.singedDate) : "",
        //         [this.formoptions[7].name]: this.detailResMsg.data.contractDetail.beginDate ? moment(this.detailResMsg.data.contractDetail.beginDate) : "",
        //         [this.formoptions[8].name]: this.detailResMsg.data.contractDetail.endDate ? moment(this.detailResMsg.data.contractDetail.endDate) : "",
        //         [this.formoptions[10].name]: this.detailResMsg.data.contractDetail.renewDate ? moment(this.detailResMsg.data.contractDetail.renewDate) : "",
        //     })
        // })

    }
    public pickChang(name: string, index: number) {}
    beforeCreate(): void {
        let that: any = this
        this.form = that.$form.createForm(this);
    }
    public deactivated() {
        this.form.validateFields((err: any, values: any) => {
            if (!err) {
                this.mutionContract(values)
            }
        })
    }
}
</script>

<style>
.contractDetials .ant-advanced-search-form {
  margin-top: 10px;
}

.contractDetials .ant-select-disabled .ant-select-selection {
  background: #fff;
  cursor: default;
}

.contractDetials .ant-select-selection__placeholder {
  color: rgba(0, 0, 0, 0.85);
  opacity: 0.8;
  /* font-size: 1rem; */
}

.contractDetials .ant-form-item-label label {
  font-weight: 600;
}

.contractDetials .ant-input-disabled {
  background-color: #fff;
  cursor: default;
  color: rgba(0, 0, 0, 0.85);
  opacity: 0.8;
}

/* .contractDetials .ant-input {
     font-size: 1rem;
}  */

/* .contractDetials
  input.ant-calendar-picker-input.ant-input-disabled::-webkit-input-placeholder {
  ?color: red !important;
}

.contractDetials
  input.ant-calendar-picker-input.ant-input-disabled:-moz-placeholder {
  ?color: red !important;
} */

.contractDetials
  input.ant-calendar-picker-input.ant-input-disabled::-moz-placeholder {
  color: red !important;
}

.contractDetials
  input.ant-calendar-picker-input.ant-input-disabled:-ms-input-placeholder {
  color: red !important;
}
</style>
