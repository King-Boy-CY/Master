<template>
  <div style="background:#fff; padding:0px 20px;">
    <div class="formitems">
      <a-form class="formsize">
        <!-- <a-row>
          <a-col :span="24"> -->
        <a-form-item label="Product"
                      :colon="false"
                     :label-col="{ span:3 }"
                     :wrapper-col="{ span: 21}">
          <a-select :getPopupContainer="e => e.parentNode"
                    class="itemss"
                    v-model="key">
            <template>
              <a-select-option v-for="(items,key) in productName"
                               :key="key"
                               :value="items.productName"
                               @click="productnameChange">
                <!-- :value="item.typeName" -->
                {{items.productName}}
              </a-select-option>
            </template>
          </a-select>
        </a-form-item>
        <!-- </a-col>
        </a-row> -->
      </a-form>

      <h3 class="allTitle">{{key}}</h3>

    </div>

    <flat v-if="currentProductData[0].rateStructure ==1"
          :currentProductData="currentProductData"
          :key="key"></flat>
    <tier v-if="currentProductData[0].rateStructure ==2"
          :currentProductData="currentProductData"
          :key="key"></tier>
    <interval v-if="currentProductData[0].rateStructure ==3"
              :currentProductData="currentProductData"
              :key="key"></interval>
    <recurring-charge v-if="currentProductData[0].rateStructure ==4"
                      :currentProductData="currentProductData"
                      :key="key"></recurring-charge>
    <one-time-change-view v-if="currentProductData[0].rateStructure ==5"
                          :currentProductData="currentProductData"
                          :key="key"></one-time-change-view>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import {Component ,Prop } from 'vue-property-decorator'
@Component({
  components:{
    flat : ()=> import('./flatView.vue'),
    tier : ()=> import('./tierView.vue'),
    interval : ()=> import('./intervalView.vue'),
    recurringCharge : ()=> import('./recurringChargeView.vue'),
    oneTimeChangeView : ()=>import('./oneTimeChangeView.vue')
  }
})
export default class serviceDetials extends Vue{
  @Prop() private detailResMsg? :any
  @Prop() private productName ?:any
  private ratingzoneAdd: any[] = [{
    CommitmentValue: {
      type: 'input',
      message: 'Commitment (Value) field should be no-null',
      initialValue: 'defalut',
      required: true,
      name: 'CommitmentValue',
      decorator: 'CommitmentValue',
      disabled: false
    },
    Destination: {
      type: 'input',
      message: 'Destination field should be no-null',
      initialValue: [],
      disabled: false,
      required: true,
      options: null,
      name: 'Destination',
      decorator: 'Destination'
    },
    timeBand: {
      type: 'textarea',
      message: 'Time band field should be no-null',
      initialValue: '',
      required: true,
      name: 'Time band',
      decorator: 'timeBand',
      disabled: false,
      isAdd: false
    },
    inputcolumns: {
      options: [{
          title: 'No .',
          dataIndex: 'No',
          key: 'No'
        },
        {
          title: 'Tier from',
          dataIndex: 'Tierfrom',
          require: false
        },
        {
          title: 'Tire to',
          dataIndex: 'tireTo',
          require: false
        },
        {
          title: 'Rate',
          dataIndex: 'Rate',
          require: false
        },
        {
          title: 'Chargable unit type',
          dataIndex: 'ChargableunitType',
          require: false
        },
        {
          title: 'Band',
          dataIndex: 'Band',
          require: false
        }
      ]
    },
    inputdata: {
      type: 'tableCloums',
      options: [{
        name: [{},
          {
            type: 'input',
            decorator: 'Tierfrom0',
            initialValue: '0'
          },
          {
            type: 'input',
            decorator: 'tireTo0',
            initialValue: '∞'
          },
          {
            type: 'input',
            decorator: 'Rate0',
            initialValue: ''
          },
          {
            type: 'select',
            decorator: 'ChargableunitType0',
            options: [{
                name: 'Secs',
                disabled: false
              },
              {
                name: 'Mins',
                disabled: false
              },
              {
                name: 'Quarters',
                disabled: false
              },
              {
                name: 'Call',
                disabled: false
              },
              {
                name: 'User',
                disabled: false
              },
            ]
          },
          {
            type: 'input',
            decorator: 'Band0',
            initialValue: ''
          }

        ],
        key: 0
      }],
      key: 0
    }
  }];
  private baseData: any[] = [{
      Tips: 'Commitment',
      name: 'Commitment',
      initialValue: 'Yes',
      type: 'select',
      options: null
    },
    {
      Tips: 'Graceperiod',
      name: 'Grace period',
      initialValue: 'No',
      type: 'select',
      options: null
    },
    {
      Tips: 'GracePeriodcycle',
      name: 'Grace period cycle',
      showSearch: true,
      initialValue: 'Next period',
      required: false,
      disabled: false,
      type: 'tags',
      options:null
    },
    {
      Tips: 'AnyShortfall',
      name: 'Any shortfall',
      type: 'select',
      options:null
    },
    {
      Tips: 'TrafficFrom',
      name: 'Traffic from(Value)',
      type: 'input',
      options:null
    },
    {
      Tips: 'TrafficFrom%',
      name: 'Traffic from(%)',
      type: 'input',
      options:null
    },
    {
      Tips: 'TrafficForwardto',
      name: 'Traffic forward to',
      initialValue: 'No',
      type: 'select',
      options:null
    },
    {
      Tips: 'ForwardPeriodcycle',
      name: 'Forward period cycle',
      initialValue: 'Next period',
      type: 'tags',
      options: null
    },
    {
      Tips: 'Anyexceed',
      name: 'Any exceed',
      initialValue: 'Yes',
      type: 'select',
      options: null
    },
    {
      Tips: 'Trafficforwardto',
      name: 'Traffic forward to(Value)',
      type: 'input',
      options: null
    },
    {
      Tips: 'Trafficforwardto%',
      name: 'Traffic forward to(%)',
      type: 'input',
      options: null
    }
  ];
  private ratingData: any[] = [{
      Tips: 'TotalCommitmentValue',
      name: 'Total Commitment(value)',
      required: true,
      disabled: false,
      initialValue: '',
      type: 'input',
      options:null
    },
    {
      Tips: 'CommitmentUnit',
      name: 'Commitment(unit)',
      required: true,
      disabled: false,
      type: 'select',
      options:null
    },
    {
      Tips: 'commitmentunitstartTime',
      name: 'Commitmentunitstart time',
      required: true,
      disabled: false,
      type: 'picker',
      options:null
    },
    {
      Tips: 'commitmentunitendtTime',
      name: 'Commitmentunitend time',
      required: true,
      disabled: false,
      type: 'picker',
      options:null
    },
    {
      Tips: 'IntervalunitType',
      name: 'Interval unit type',
      required: true,
      disabled: false,
      type: 'select',
      options:null
    }
  ];
  private key :string=""
  get currentProductData(){
    // const filter = this.productName.filter((item:any,i:number)=>item.productName === this.key)
    // return filter.length?filter:this.productName.length?this.productName[0]:[]
    return this.productName.filter((item:any,i:number)=>item.productName === this.key)
  }
  public productnameChange(key:any){
    console.log(`Selected`,key);
    this.key=key.productName || key.key
    console.log(this.key);
    this.$forceUpdate()
    console.log(this.currentProductData);
    // Basic data数据根据procuctName 切换渲染
   
    //  this.$set(this.baseData[0].options,this.currentProductData[0].isCommitment== 1 ? 'YES' :'No')
    // this.baseData[0].options = this.currentProductData[0].isCommitment== 1 ? 'YES' :'No'
    // this.baseData[1].options = this.currentProductData[0].isGracePeriod == 1 ? 'YES' :'No'
    // this.baseData[2].options = this.currentProductData[0].gracePeriodCycle
    // this.baseData[3].options = this.currentProductData[0].isAnyShortfall== 1 ? 'YES' :'No'
    // this.baseData[4].options = this.currentProductData[0].trafficFromValue
    // this.baseData[5].options = this.currentProductData[0].trafficFromPercentage
    // this.baseData[6].options = this.currentProductData[0].isTrafficForward
    // this.baseData[7].options = this.currentProductData[0].trafficPeriodCycle
    // this.baseData[8].options = this.currentProductData[0].isAnyExceed
    // this.baseData[9].options = this.currentProductData[0].trafficForwardValue
    // this.baseData[10].options = this.currentProductData[0].trafficForwardPercentage

    this.$set(this.baseData[0],'options',this.currentProductData[0].isCommitment== 1 ? 'YES' :'No')
    this.$set(this.baseData[1],'options',this.currentProductData[0].isGracePeriod == 1 ? 'YES' :'No')
    this.$set(this.baseData[2],'options',this.currentProductData[0].gracePeriodCycle)
    this.$set(this.baseData[3],'options',this.currentProductData[0].isAnyShortfall== 1 ? 'YES' :'No')
    this.$set(this.baseData[4],'options',this.currentProductData[0].trafficFromValue)
    this.$set(this.baseData[5],'options',this.currentProductData[0].trafficFromPercentage)
    this.$set(this.baseData[6],'options',this.currentProductData[0].isTrafficForward)
    this.$set(this.baseData[7],'options',this.currentProductData[0].trafficPeriodCycle)
    this.$set(this.baseData[8],'options',this.currentProductData[0].isAnyExceed)
    this.$set(this.baseData[9],'options',this.currentProductData[0].trafficForwardValue)
    this.$set(this.baseData[10],'options',this.currentProductData[0].trafficForwardPercentage)
   
  }
  
  created(){
    console.log(this.productName);
    this.productName.forEach((item:any,i:number,arr)=> {
      console.log(item.ratingZoneList.length);
      if(item.ratingZoneList.length===0){
        arr.splice(i,1)
      }
    })
    this.productnameChange(this.productName[0])
    console.log(this.currentProductData);
    // Basic data 数据渲染
    // this.baseData[0].options = this.currentProductData[0].isCommitment== 1 ? 'YES' :'No'
    // this.baseData[1].options = this.currentProductData[0].isGracePeriod == 1 ? 'YES' :'No'
    // this.baseData[2].options = this.currentProductData[0].gracePeriodCycle
    // this.baseData[3].options = this.currentProductData[0].isAnyShortfall== 1 ? 'YES' :'No'
    // this.baseData[4].options = this.currentProductData[0].trafficFromValue
    // this.baseData[5].options = this.currentProductData[0].trafficFromPercentage
    // this.baseData[6].options = this.currentProductData[0].isTrafficForward
    // this.baseData[7].options = this.currentProductData[0].trafficPeriodCycle
    // this.baseData[8].options = this.currentProductData[0].isAnyExceed
    // this.baseData[9].options = this.currentProductData[0].trafficForwardValue
    // this.baseData[10].options = this.currentProductData[0].trafficForwardPercentage
  }
  
}
</script>
<style lang="scss">
.formitems .ant-form-item-label {
  margin-right: 0 !important;
  font-size: 30px;
}
.formitems .formsize .ant-form-item label {
  font-size: 22px;
  padding-left: 16px;
}
.formitems .formsize .ant-select-selection-selected-value {
  font-size: 1rem;
  color: rgb(63, 63, 63);
}
.formitems {
    .ant-select-dropdown-menu-item-group-title {
        color: #8cb4fa;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .ant-select-dropdown-menu-item-selected {
        color: #3e77d8;
    }
}
</style>

<style lang="scss" scoped>
.allTitle {
  background: rgb(237, 239, 248);
  margin: -16px 0 16px 0;
  height: 39px;
  line-height: 39px;
  border: 1px solid rgb(237, 239, 248);
  text-align: center;
  font-size: 20px;
}

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
  font-size: 1rem;
}
.contractDetials .ant-input-disabled {
  background-color: #fff;
  cursor: default;
  color: rgba(0, 0, 0, 0.85);
  opacity: 0.8;
}
.contractDetials .ant-input {
  font-size: 1rem;
}

.contractDetials
  input.ant-calendar-picker-input.ant-input-disabled::-webkit-input-placeholder {
   color: red !important;
}

.contractDetials
  input.ant-calendar-picker-input.ant-input-disabled:-moz-placeholder {
   color: red !important;
}

.contractDetials
  input.ant-calendar-picker-input.ant-input-disabled::-moz-placeholder {
   color: red !important;
}

.contractDetials
  input.ant-calendar-picker-input.ant-input-disabled:-ms-input-placeholder {
   color: red !important;
}
</style>
