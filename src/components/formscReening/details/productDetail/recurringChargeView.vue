<template>
  <div>
    <div class="Basedata contractDetials">
      <!-- Basic data -->
      <div class="container">
        <h1>
          <span class="piece"></span>Basic data
        </h1>
        <a-row style="margin-top:10px; margin-left: 20px;">
          <a-col v-for="(item,key) in baseData"
                 :key="key"
                 :span="12">
            <a-form-item :label="item.name"
                         :colon="false"
                         :label-col="{ span: 6,offset:-1}"
                         :wrapper-col="{ span: 16 }">
              <a-input :value="item.options"
                       v-if="item.type === 'input'"
                       disabled />
            </a-form-item>
          </a-col>
        </a-row>
      </div>
      <!-- Rating zone Yes -->
      <div v-if="currentProductDatas[0].isFixedCharge==1"
           class="Ratingzone">
        <h1>
          <span class="zone"></span>Rating zone
        </h1>
        <div v-for="(list,i) in currentProductDatas[0].ratingZoneList"
             :key="i"
             class="RatingzoneTable">
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
                <a-col :span="24"
                       style="overflow-y: auto">
                  <table class="gridtable border">
                    <thead>
                      <tr>
                        <th v-for="(item,key) in inputcolumns"
                            :key="key">{{item.title}}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(ip,key) in list.ratingDetailList"
                          :key="key">
                        <td>{{list.chargeItem}}</td>
                        <td>{{list.amount}}</td>
                        <td>{{list.beginDate}}</td>
                        <td>{{list.endDate}}</td>
                      </tr>
                    </tbody>
                  </table>
                </a-col>
              </a-row>
            </a-form>
          </div>
        </div>
      </div>
      <!-- Rating zone No -->
      <div v-if="currentProductDatas[0].isFixedCharge==0 && filterRatingZoneList.length"
           class="Ratingzone container">
        <h1>
          <span class="zone"></span>Rating zone
        </h1>
        <div class="ratingzoneAdd-code">
          <div v-for="(filterRatingItem,i) in filterRatingZoneList"
               :key="i">
            <a-row class="Zone-code">
              <a-col :span="18">
                <span class="title">Zone&nbsp;{{i+1}}</span>
              </a-col>
            </a-row>
            <div>
              <a-form :form="form">
                <a-row style="margin-top:20px;">
                  <a-col :span="12"
                         v-for="(item,i ) in zoneData"
                         :key="i">
                    <a-form-item :label="item.title"
                                :colon="false"
                                 :label-col="{ span: 5, offset: 2 }"
                                 :wrapper-col="{ span: 16 }">
                      <a-date-picker disabled
                                     placeholder=""
                                     v-if="item.type === 'picker'"
                                     style="width:100%"
                                     v-decorator="[
                            `${item.name}`,
                            {   initialValue:i===0?filterRatingItem.BeginDate:filterRatingItem.EndDate,
                                rules: [{
                                    required: item.required,
                                    message: `${item.decorator} field should be no-null`
                                }],
                            }
                        ]" />
                    </a-form-item>
                  </a-col>
                  <a-col :span="23">
                    <a-form-item label="Time band"
                                 :colon="false"
                                 :label-col="{ span: 3, offset: 1 }"
                                 :wrapper-col="{ span: 18 }">
                      <div style="border:1px solid #dde0f1;min-height:40px">
                        <template v-if="filterRatingItem.timeBandDetailList && filterRatingItem.timeBandDetailList.length">
                          <ul v-for="(band,key) in filterRatingItem.timeBandDetailList"
                              :key="key">
                            <li style="paddingLeft:16px">
                              <a-row>
                                <a-col :span="3">{{band.type}}</a-col>
                                <a-col :span="21">{{ band.dayFrom || '--' }}- {{ band.dayTo|| '--' }}/ {{band.weekdayFrom || '--' }} - {{ band.weekdayTo|| '--'}}/ {{band.timeFrom || '--'}}- {{band.timeTo}}</a-col>
                              </a-row>
                            </li>
                          </ul>
                        </template>
                      </div>
                    </a-form-item>
                  </a-col>
                </a-row>
              </a-form>
              <div>
                <a-row :span="24"
                       style="overflow-y: auto">
                  <table class="gridtable border">
                    <thead>
                      <tr>
                        <th v-for="(item,key) in filterRatingItem.headArr"
                            :key="key">{{item}}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(row,i) in filterRatingItem.bodyArr"
                          :key="i">
                        <td v-for="(list,i) in row"
                            :key="i">{{list}}</td>
                      </tr>
                    </tbody>
                  </table>
                </a-row>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import {
  Component,
  Prop,
  Watch
} from "vue-property-decorator";
import moment, {
  locale
} from "moment";
import {
  recurringDimension,
  isFixedCharge,
  isSameTariff,
  chargeUnit
} from "@/filter/index";
@Component
export default class recurringCharge extends Vue {
  @Prop() private currentProductData: any;
  @Watch("currentProductData", {
    deep: true,
    immediate: true
  })
  onChange(newVal: any, oldVal: any) {
    this.baseData[0].options = recurringDimension(newVal[0].recurringDimension);
    this.baseData[1].options = newVal[0].dimensionCount;
    this.baseData[2].options = isFixedCharge(newVal[0].isFixedCharge);
    this.baseData[3].options = isSameTariff(newVal[0].isSameTariff);
    console.log("ratingZoneList", newVal[0].ratingZoneList);

    this.ratingZoneList = newVal[0].ratingZoneList;
    console.log(this.ratingZoneList);
    let filterRatingZoneList: any = [];
    for (let rz = 0; rz < newVal[0].ratingZoneList.length; rz++) {
      let count = -1;
      let arrRow: any = [];
      let zoneItem = newVal[0].ratingZoneList[rz];
      let obj: any = {
        BeginDate: moment(zoneItem.beginDate),
        EndDate: moment(zoneItem.endDate),
        timeBandDetailList: [],
        headArr: [],
        bodyArr: []
      };
      console.log(zoneItem);
      let timeBandDetailList = zoneItem.timeBandDetailList;

      /**如果有timeBand*/
      if (timeBandDetailList.length > 0) {
        //将type 处理成peak / offPeak
        let objCount: any = {}; // 记录当前值
        let offPeakCount: number = 0;
        let peakCount: number = 0;
        for (let j = 0; j < timeBandDetailList.length; j++) {
          let item = timeBandDetailList[j];
          if (item.type === 1 && !objCount["peak"]) {
            peakCount = 1;
            objCount["peak"] = "peak";
            item.type = ` peak${peakCount}:\xa0\xa0\xa0\xa0\xa0\xa0\ `;
          } else if (objCount["peak"] && item.type === 1) {
            peakCount += 1;
            item.type = ` peak${peakCount}: \xa0\xa0\xa0\xa0\xa0\xa0\ `;
          }
          if (!objCount["Offpeak"] && item.type === 2) {
            offPeakCount = 1;
            objCount["Offpeak"] = "Offpeak";
            item.type = ` Offpeak${offPeakCount}:\xa0\xa0\xa0\ `;
          } else if (objCount["Offpeak"] && item.type === 2) {
            offPeakCount += 1;
            item.type = ` Offpeak${offPeakCount}:\xa0\xa0\xa0\ `;
          }
        }
        // 赋值 timeBandDetailList
        obj.timeBandDetailList = timeBandDetailList;
        /**head data*/
        for (let t = 0; t < timeBandDetailList.length; t++) {
          let itemTimeBand = timeBandDetailList[t];
          obj.headArr.push(itemTimeBand.type);
        }
        obj.headArr.unshift("destination");
        obj.headArr.push("Chargable unit type");
      } else {
        /**无timeBand*/
        console.log(`No TimeBand`);
        // 头部
        obj.headArr = ["destination", "Rate", "Chargable unit type"];
      }
      /**body data*/
      let destinationArray: any[] = [];
      let chargeUnit: any[] = [];
      for (let k = 0; k < zoneItem.ratingDetailList.length; k++) {
        let detailItem = zoneItem.ratingDetailList[k];
        if (
          !detailItem.timeBandDetailIndex ||
          detailItem.timeBandDetailIndex === 0
        ) {
          chargeUnit.push(detailItem.chargeUnit);
          destinationArray.push(detailItem.destinationList);
          count++;
          this.$set(arrRow, count, []);
        }
        arrRow[count].push(detailItem.rate);
      }
      arrRow.forEach((item: any, i: number) => {
        item.unshift(destinationArray[i]);
        item.push(this.chargeUnit(chargeUnit[i]));
      });
      obj.bodyArr = arrRow;
      filterRatingZoneList.push(obj);
    }
    console.log("处理后的数据：filterRatingZoneList", filterRatingZoneList);
    this.filterRatingZoneList = filterRatingZoneList;
    // this.$set(this,'filterRatingZoneList',filterRatingZoneList)
  }
  private form: any;
  get currentProductDatas() {
    return this.currentProductData;
  }
  get timeBandDetailLists() {
    return this.timeBandDetailList;
  }
  private chargeUnit: Function = chargeUnit;
  private zoneData: any[] = [{
      title: "Begin Date",
      name: "BeginDate",
      type: "picker",
      initialValue: ""
    },
    {
      title: "End Date",
      name: "EndDate",
      type: "picker",
      initialValue: ""
    }
  ];
  private baseData: any[] = [{
      Tips: "Recurring dimension",
      name: "Recurring dimension",
      type: "input",
      options: null
    },
    {
      Tips: "Counts",
      name: "Counts",
      type: "input",
      options: null
    },
    {
      Tips: "Fixed charge",
      name: "Fixed charge",
      type: "input",
      options: null
    },
    {
      Tips: "Same tariff",
      name: "Same tariff",
      type: "input",
      options: null
    }
  ];
  private ratingZoneList: any = [];
  // 数据处理后的 ratingZoneList
  private filterRatingZoneList: any = [];
  private inputcolumns: any = [{
      title: "Charge-Item",
      dataIndex: "Charge-Item"
    },
    {
      title: "Amount",
      dataIndex: "Amount"
    },
    {
      title: "Begin date",
      dataIndex: "BeginDate"
    },
    {
      title: "End date",
      dataIndex: "Enddate"
    }
  ];
  private inputcolumnsOne: any = [{
      title: "destination",
      dataIndex: "destination"
    },
    {
      title: "Rate",
      dataIndex: "Rate"
    },
    {
      title: "Chargable unit type",
      dataIndex: "ChargableUnitType"
    }
  ];
  private tableHead: any = [];
  private tableHeadNoBand: any;
  private arrRow: any = [];
  private timeBandDetailList: any = [];
  beforeCreate(): void {
    let that: any = this;
    this.form = that.$form.createForm(this);
  }
  created() {
    
  }
}
</script>

<style>
.Ratingzone .ant-form-item-label {
  margin-left: 22px;
}
</style><style lang="scss" scoped>
.ratingzoneAdd-code {
  border: 1px solid #e6e6e6;
}

.container {
  border: 1px dashed rgb(211, 210, 210);
  border-radius: 12px;
  padding: 12px 32px;
  margin-bottom: 10px;

  h1 {
    height: 39px;
    line-height: 39px;
    font-size: 18px;
    border-bottom: 1px solid #e6e6e6;
    font-weight:500;
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
    border-bottom: 1px solid #e6e6e6;
    padding-left: 24px;
    margin-bottom: 15px;
    font-weight:500;
    .zone {
      border: 5px solid #f5b148;
      display: inline-block;
      width: 0;
      height: 0;
      line-height: 0;
      margin-left: -21px;
      margin-right: 10px;
      background-color: #e9eaf3;
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
      font-weight: 400;
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
  font-weight: 400;
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
