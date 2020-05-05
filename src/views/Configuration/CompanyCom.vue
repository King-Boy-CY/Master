<template>
  <div>
    <div id="components-form-demo-advanced-search"
    style="he">
      <div class="formoptions">
        <a :style="{ marginLeft: '8px', fontSize: '18px'}"
           @click="toggle">
        </a>
      </div>
      <a-form class="ant-advanced-search-form"
              :form="form"
              @submit="handleSearch"
              v-show="expand">
        <a-row>
          <a-col :span="item.span || span"
                 v-for="(item,key) in formoptions"
                 :key="key">
            <a-form-item :label="item.Tips"
                         :colon="false"
                         :label-col="{ offset: 3 || item.colSoffset }"
                         :labelCol="{ span: item.colSpan || colSpan,offset: 1 }" 
                         :hasFeedback="false">
              <a-select @change="handleChange(item.name,$event,key)"
                        @dropdownVisibleChange="dropdownVisibleChange(item.name,$event,key)"
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
                            ]"
                        :placeholder="item.name">
                <a-select-option :value="child.name || child"
                                 v-for="(child,key) in item.options"
                                 :key="key"
                                 :disabled="( child.name || child) ==='Low'&& low ">
                  {{child.name || child}}
                </a-select-option>
              </a-select>
              <a-date-picker @click="pickChang(item.name,key)"
                             :disabled="item.disabled"
                             v-if="item.type === 'picker'"
                             :getCalendarContainer="e => e.parentNode"
                             v-decorator="[
                            `${item.name}`,
                            {
                              rules: [{
                                required: item.required,
                                message: `${item.Tips} field should be no-null`,
                              }]
                            }
                        ]"
                             @change="onChange(item.name,$event,key)"
                             style="width:100%"
                             placeholder="YYYY/MM/DD"
                             format="YYYY/MM/DD" />
              <a-input :placeholder="item.decorator"
                       :disabled="item.disabled"
                       v-else-if="item.type === 'input'"
                       :getPopupContainer=" e => e.parentNode"
                       v-decorator="[
                            `${item.name}`,
                            {
                                rules: [{
                                    required: item.required,
                                    message: `${item.Tips} field should be no-null`
                                }],
                            }
                        ]" />
              <a-select mode="multiple"
              :maxTagCount="1"
                        :getPopupContainer=" e => e.parentNode"
                        v-decorator="[
                                      `${item.name}`,
                                      {
                                        rules: [{
                                          required: item.required,
                                          message: `${item.Tips} field should be no-null`,
                                        }],
                                      }
                                    ]"
                        @click=" handleChange(item.name, key, child.name)"
                        v-else-if=" item. type === 'tags'">
                <a-select-option v-for=" (itn,index) in item.options"
                                 :value="itn.name || itn"
                                 allowClear
                                 :key="index">
                  {{itn.name || itn}}

                </a-select-option>
              </a-select>
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
  AxiosGet,
} from '@/api/axios'
import moment from 'moment'

@Component({
  components: {
    
    selectInput: resolve => require(['@/common/selectInput/index.vue'], resolve)
    
  }
})
export default class Home extends Vue {
    @Mutation('mutionContract') mutionContract: any
    @Mutation('mutionContractData') mutionContractData: any
    private low: boolean = true;
    private autoRenew: boolean = true;
    private singedDate: boolean = true;
    private relatedContract: boolean = true;
    private placeholder: any = {};
    private date: any = {}
    private form: any;
    private expand: boolean = true
    public beforeCreate(): void {
    let that: any = this
    this.form = that.$form.createForm(this);

    }
    //  @Prop(Array) formoptions?:any
    @Prop({
        type: Number,
        default: 4
    }) span ? : number
    private formoptions: any[] = [
        {
            Tips: 'Company',
            name: 'companyName',
            required: true,
            type: 'input',
            options: null,
            span:12,
            colSpan:5
        },
        {
            Tips: 'Contact',
            name: 'contact',
            disabled: false,
            required: false,
            type: 'input',
            options: null,
            span:12,
            colSpan:5
        },
          {
            Tips: '',
            name: '',
            disabled: false,
            required: false,
            allowClear: false,
            type:'' ,
            options: null,
            span:23,
            colSpan:5
        },   {
            Tips: 'Phone',
            name: 'phone',
            disabled: false,
            required: false,
            allowClear: false,
            type: 'input',
            options: null,
            span:12,
            colSpan:5
        },   
          
                
  ]
  /* 下拉选中 */
  public handleChange(val: any, name: string, key: number) {
    this.formoption(val, name, key)
    console.log('val', val, 'name', name, );
  }
  public crearChange(val: any, name: string, key: number) {
    this.formoption(val, name, key)
  }
  public handleSearch(val: any) {}
  public toggle(val: any) {

  }
  public formoption(val: any, name: string, key: number) {
  
  }
  public onChange(val: any, date: any, name: string) {
   
  }
  public onTags(values: string[]) {}
  public pickChang(name: string, index: number) {}
  public created() {
     
}

  }

</script>
