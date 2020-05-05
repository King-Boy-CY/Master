<template>
  <div class="Basedata contractDetials">
    <!-- Basic data -->
    <div class="container">
      <h1>
        <span class="piece"></span>Basic data</h1>
      <a-row style="margin-top:10px; margin-left: 20px;">
        <a-col v-for="(item,key) in baseData"
               :key="key"
               :span="8">
          <a-form-item :label="item.name"
                      :colon="false"
                       :label-col="{ span: 10 }"
                       :wrapper-col="{ span: 13 }">
            <a-select v-if="item.type === 'select'"
                      style="width:100%"
                      :placeholder="item.options"
                      disabled>
              <a-select-option :value="key+1"
                               v-for="(child,key) in item.options"
                               :key="key">
                {{child.name || child}}
              </a-select-option>
            </a-select>
            <a-select disabled
                      style="width:100%"
                      :placeholder="item.options"
                      v-else-if="item.type === 'tags'">
              <a-select-option :value="child"
                               v-for="(child,key) in item.options"
                               :key="key">
                {{child}}
              </a-select-option>
            </a-select>

            <a-date-picker disabled
                           v-else-if="item.type === 'picker'"
                           style="width:100%"
                           placeholder="YYYY / MM / DD"
                           format="YYYY / MM / DD" />
            <a-input :value="item.options"
                     v-else-if="item.type === 'input'"
                     disabled />
          </a-form-item>
        </a-col>
      </a-row>
    </div>
    <!-- Rating data -->
    <div class="Ratingdata container">
      <h1>
        <span class="piece"></span>Rating data</h1>
      <a-form :form="form">
        <a-row style="margin-top:10px; margin-left: 20px;">
          <a-col v-for="(item,key) in ratingData"
                 :key="key"
                 :span="12">
            <a-form-item :label="item.name"
                         disabled
                         :colon="false"
                         :label-col="{ span: 9 }"
                         :wrapper-col="{ span: 10 }">
              <a-select disabled
                        v-if="item.type === 'select'"
                        style="width:100%">
                <a-select-option disabled
                                 :placeholder="item.options"
                                 :value="child.name"
                                 v-for="(child,key) in item.options"
                                 :key="key">{{child.name}}</a-select-option>
              </a-select>
              <a-date-picker disabled
                             v-else-if="item.type === 'picker'"
                             style="width:100%"
                             v-decorator="[
                            `${item.name}`,
                            {   
                                rules: [{
                                    required: item.required,
                                    message: `${item.decorator} field should be no-null`
                                }],
                            }
                        ]" />
              <a-input disabled
                       :value="item.options"
                       v-else-if="item.type === 'input'" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- Rating zone -->
    <div class="Ratingzone ">
      <h1>
        <span class="zone"></span>Rating zone</h1>
      <div v-for="(list,i) in ratingZoneList"
           :key="i"
           class="RatingzoneTable ">

        <div class="ratingzoneAdd-code">
          <div class="Zone-code">
            <a-row>
              <a-col :span="18">
                <span class="title">Zone&nbsp;{{i+1}}</span>
              </a-col>
            </a-row>
          </div>
          <a-form>
            <a-row>
              <a-col :span="24">
                <a-form-item label="CommitmentValue"
                              :colon="false"
                             :label-col="{ span: 4, offset: 1 }"
                             :wrapper-col="{ span: 14 }">
                  <a-input disabled
                           class="CommitInput"
                           :value="list.commitmentValue ===-1 ? 'Default' : list.commitmentValue">
                  </a-input>
                </a-form-item>
              </a-col>
              <a-col :span="22">
                <a-form-item label="Destination"
                            :colon="false"
                             :label-col="{ span: 4, offset: 1 }"
                             :wrapper-col="{ span: 19 }">
                  <a-input disabled
                           style="width:100%"
                           :value="list.destinationList">
                  </a-input>
                </a-form-item>
              </a-col>
              <a-col :span="22"
                     v-if="!!list.timeBandDetailList &&list.timeBandDetailList.length>0">
                <a-form-item label="timeBand"
                             :colon="false"
                             :label-col="{ span: 4, offset: 1 }"
                             :wrapper-col="{ span: 19 }">
                  <div style="border:1px solid #dde0f1">
                    <template>
                      <ul v-for="(band,key) in list.timeBandDetailList "
                          :key="key">
                        <li style="paddingLeft:16px">
                          <a-row>
                            <a-col :span="3">{{band.type }}</a-col>
                            <a-col :span="8">{{ band.dayFrom || '-' }}-{{ band.dayTo|| '--' }}/ {{band.weekdayFrom || '--' }}-{{ band.weekdayTo|| '--'}}/ {{band.timeFrom || '--'}}-{{band.timeTo}}</a-col>
                          </a-row>
                        </li>
                      </ul>
                    </template>
                  </div>
                </a-form-item>
              </a-col>
              <a-col :span="24"
                     style="overflow-y: auto">
                <table class="gridtable border">
                  <thead>
                    <tr>
                      <th v-for="(item,key) in tableHead[i]"
                          :key="key">
                        {{item.title}}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td v-for="(ip,key) in rate[i]"
                          :key="key">
                        {{ip}}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </a-col>
            </a-row>
          </a-form>
        </div>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  Component,
  Prop,
  Watch
} from 'vue-property-decorator'
import moment from 'moment'
import {
  isCommitment,
  isGracePeriod,
  isAnyShortfall,
  isTrafficForward,
  isAnyExceed,
  commitmentUnit,
  intervalUnit,
  chargeUnit
} from '@/filter/index'
@Component
export default class flat extends Vue {
  @Prop() private currentProductData: any
  @Watch('currentProductData', {
    deep: true,
    immediate: true
  }) onChange(newVal: any, oldVal: any) {
    // Basic data
    this.baseData[0].options = isCommitment(newVal[0].isCommitment)
    this.baseData[1].options = isGracePeriod(newVal[0].isGracePeriod)
    this.baseData[2].options = newVal[0].gracePeriodCycle
    this.baseData[3].options = isAnyShortfall(newVal[0].isAnyShortfall)
    this.baseData[4].options = newVal[0].trafficFromValue
    this.baseData[5].options = newVal[0].trafficFromPercentage
    this.baseData[6].options = isTrafficForward(newVal[0].isTrafficForward)
    this.baseData[7].options = newVal[0].trafficPeriodCycle
    this.baseData[8].options = isAnyExceed(newVal[0].isAnyExceed)
    this.baseData[9].options = newVal[0].trafficForwardValue
    this.baseData[10].options = newVal[0].trafficForwardPercentage
    // Rating data
    this.ratingData[0].options = newVal[0].totalCommitment
    this.ratingData[1].options = commitmentUnit(newVal[0].commitmentUnit)
    this.$nextTick(() => {
      this.form.setFieldsValue({
        [this.ratingData[2].name]: newVal[0].commitmentBeginDate ? moment(newVal[0].commitmentBeginDate) : "",
        [this.ratingData[3].name]: newVal[0].commitmentEndDate ? moment(newVal[0].commitmentEndDate) : "",
      })
    })

  }
  private chargeUnit: Function = chargeUnit
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
      options: null
    },
    {
      Tips: 'AnyShortfall',
      name: 'Any shortfall',
      type: 'select',
      options: null
    },
    {
      Tips: 'TrafficFrom',
      name: 'Traffic from(Value)',
      type: 'input',
      options: null
    },
    {
      Tips: 'TrafficFrom%',
      name: 'Traffic from(%)',
      type: 'input',
      options: null
    },
    {
      Tips: 'TrafficForwardto',
      name: 'Traffic forward to',
      initialValue: 'No',
      type: 'select',
      options: null
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
      type: 'input',
      options: null
    },
    {
      Tips: 'CommitmentUnit',
      name: 'Commitment(unit)',
      required: true,
      disabled: false,
      type: 'input',
      options: null
    },
    {
      Tips: 'Commitment start time',
      name: 'Commitment start time',
      required: true,
      disabled: false,
      type: 'picker',
      options: null
    },
    {
      Tips: 'Commitment end time',
      name: 'Commitment end time',
      required: true,
      disabled: false,
      type: 'picker',
      options: null
    }
  ];
  private ratingZoneList: any = []
  private tableHead: any = []
  private rate: any = []
  private typeYes: any = []
  private typeNo: any = []
  private form: any
  beforeCreate(): void {
    let that: any = this
    this.form = that.$form.createForm(this);
  }
  created() {
    console.log(this.currentProductData);
    this.ratingZoneList = this.currentProductData[0].ratingZoneList
    console.log(this.ratingZoneList);
    let objCount: any = {} // 记录当前值
    let tableHead: any = []
    let tableHeadOffpeak: any = []
    let tableHeadpeak: any = []

    let chargeUnit: any = []
    let chargeUnitPeak: any = []
    let chargeUnitOffpeak: any = []
    let ss: any[] = []
    let rate: any = []
    let offPeakCount: number = 0
    let peakCount: number = 0
    //改变peak 或 offpeak后面的数字
    for (let i = 0; i < this.ratingZoneList.length; i++) {
      // debugger
      offPeakCount = 0
      peakCount = 0
      objCount = {}
      let items = this.ratingZoneList[i]
      console.log(items);
      if (!tableHead[i]) {
        tableHead[i] = []
      }
      if (!chargeUnit[i]) {
        chargeUnit[i] = []
      }
      if (!rate[i]) {
        rate[i] = []
      }
       //如果有 timeBandDetailList
      if (items.timeBandDetailList && items.timeBandDetailList.length > 0) {
        for (let j = 0; j < items.timeBandDetailList.length; j++) {
          let item = items.timeBandDetailList[j]
          //处理peak offpeak
          if (item.type === 1 && !objCount['peak']) {
            peakCount = 1
            objCount['peak'] = 'peak'
            item.type = ` peak${peakCount}:\xa0\xa0\xa0\xa0\xa0\xa0\ `
          } else if (objCount['peak'] && item.type === 1) {
            peakCount += 1
            item.type = ` peak${peakCount}: \xa0\xa0\xa0\xa0\xa0\xa0\ `
          }
          if (!objCount['Offpeak'] && item.type === 2) {
            offPeakCount = 1
            objCount['Offpeak'] = 'Offpeak'
            item.type = ` Offpeak${offPeakCount}:\xa0\xa0\xa0\ `
          } else if (objCount['Offpeak'] && item.type === 2) {
            offPeakCount += 1
            item.type = ` Offpeak${offPeakCount}:\xa0\xa0\xa0\ `
          }
          tableHead[i].push({
            title: item.type,
          })
        }
      }else{
        tableHead[i]=[{
          title:'Rate'
        }]
      }
      console.log(tableHead);
      

      for (let j = 0; j < items.ratingDetailList.length; j++) {
        let item = items.ratingDetailList[j]
        console.log('ratingDetailList', item);
        console.log(item.chargeUnit);
        chargeUnit[i].push(item.chargeUnit)
        rate[i].push(item.rate)
        // console.log(item.rate);
      }
    }

    console.log(chargeUnit);
    tableHead.forEach((item: any) => {
      item.push({
        title: 'Chargable unit type'
      })
    })

    rate.forEach((item: any, i: number) => {
      let setChargeUnit: any[] = Array.from(new Set(chargeUnit[i]))

      item.push(this.chargeUnit(...setChargeUnit))
    })
    this.tableHead = tableHead
    this.rate = rate
    console.log(this.rate);
    

  }

}
</script>

<style>
.Ratingzone .ant-form-item-label {
  margin-left: 22px;
}
</style><style lang="scss" scoped>
.container {
  border: 1px dashed rgb(211, 210, 210);
  border-radius: 12px;
  padding: 12px 32px;
  margin-bottom: 10px;

  h1 {
    height: 39px;
    line-height: 39px;
    font-size: 18px;
    font-weight: 500;
    border-bottom: 1px solid #e6e6e6;

    .piece {
      border: 5px solid #f5b148;
      display: inline-block;
      width: 0;
      height: 0;
      line-height: 0;
      margin-right: 10px;
      margin-left: 3px;
    }
  }
}

.CommitInput {
  margin-left: -16px;
}

.ivu-table:before {
  background-color: unset;
}

.subCol > ul > li {
  margin: 0 -18px;
  list-style: none;
  text-align: center;
  /* padding: 9px; */
  border-bottom: 1px solid #e6e6e6;
  /* overflow: hidden; */
  height: 50px;
  line-height: 50px;
}

.subCol > ul > li:last-child {
  border-bottom: none;
}

.AdvancedSearch {
  display: flex;
  row-gap: 3;
  justify-content: center;
}

.Ratingzone {
  margin-bottom: 16px;
  border: 1px dashed rgb(211, 210, 210);
  padding: 12px 32px;

  h1 {
    height: 39px;
    line-height: 39px;
    font-size: 18px;
    font-weight: 500;
    border-bottom: 1px solid #e6e6e6;
    padding-left: 24px;
    margin-bottom: 15px;

    .zone {
      border: 5px solid #f5b148;
      display: inline-block;
      width: 0;
      height: 0;
      line-height: 0;
      margin-left: -21px;
      margin-right: 10px;
    }
  }

  .RatingzoneTable {
    border-left: 1px solid #e6e6e6;
    border-right: 1px solid #e6e6e6;
    margin-bottom: 10px;
  }

  .Zone-code {
    padding: 2px;
    border: 1px solid rgb(238, 238, 238);
    background-color: #e9eaf3;

    .title {
      padding: 10px;
      font-weight: 600;
      color: #000;
      display: block;
      padding-left: 20px;
    }
  }
}

.addZone {
  border-radius: 6px;
}

.Ratingzone-code {
  border: 1px solid rgb(212, 212, 212);
  padding: 0;
  margin: 10px 0px;
  background-color: rgb(251, 251, 251);
}

.gridtable {
  font-family: 'Chinese Quote', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue',
    Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',
    'Segoe UI Symbol';
  font-size: 14px;
  font-variant: tabular-nums;
  line-height: 1.5;
  color: rgba(0, 0, 0, 0.65);
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  list-style: none;
  position: relative;
  width: 100%;
  text-align: center;
  overflow-y: scroll;
}

table.border tr th,
table.border tr td {
  border: 1px solid rgb(221, 224, 241);
  height: 2rem;
  line-height: 32px;
}

table.gridtable th {
  background: #fafafa;
  transition: background 0.3s ease;
  color: rgba(0, 0, 0, 0.85);
  font-weight: 500;
  border-bottom: 1px solid #e8e8e8;
  padding: 8px;
  background: rgb(233, 234, 243);
}

table.gridtable td {
  padding: 0px 8px;
  background-color: #ffffff;

  .ant-form-item {
    margin: 0;
  }
}

.table-code {
  display: flex;
  justify-content: space-between;
  position: relative;

  div:nth-child(1) {
    width: 100%;
  }

  div:nth-child(2) {
    vertical-align: middle;
    box-sizing: border-box;

    ul {
      list-style: none;
      padding-top: 60px;
      box-sizing: border-box;

      li {
        -webkit-transition: all 0.2s;
        transition: all 0.2s;
        height: 39px;
        line-height: 40px;
        margin: 0px 5px;

        span {
          display: inline-block;
          background: #f06666;
          width: 24px;
          height: 24px;
          line-height: 27px;
          border-radius: 50%;
          text-align: center;
          cursor: pointer;

          &:hover {
            background: red;
          }
        }

        i {
          font-size: 20px;
          color: #fff;
        }
      }
    }
  }
}

table.border tr th {
  border-right: 1px solid #fff;

  &:last-child {
    border-right: 1px solid rgb(221, 224, 241);
  }
}
</style>
