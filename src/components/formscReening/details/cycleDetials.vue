<template>

  <table class="gridtable"
         :class="{ border }"
         :style="{ textAlign: align}">
    <thead>
      <tr>
        <th v-for="(item,key) in inputcolumns"
            :key="key">
          <span :style="{color: item.require ? 'red' : ''}"
                v-show="item.require">*</span>{{item.title}}
        </th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="(item,index) in Arr"
          :key="index">
        <td>
          <div>
            {{index+1}}
          </div>
        </td>
        <td>
          <div>
            {{item.configServiceName}}
          </div>
        </td>
        <td>
          <div>
            {{direction(item.direction)}}
          </div>
        </td>
        <td>
          <div>
            {{item.cycleName}}
          </div>
        </td>
        <td>
          <div>
            {{item.beginDate}}
          </div>
        </td>
        <td>
          {{item.endDate}}
        </td>
      </tr>
    </tbody>
  </table>

</template>
<script lang="ts">
import Vue from 'vue'
import {Component ,Prop} from 'vue-property-decorator'
import {direction} from '@/filter/index'
@Component
export default class cycleDetials extends Vue{
  @Prop() private detailResMsg?:any
  private border :boolean=true
  private align :string="center"
  private inputcolumns: any[] = [
      {
      title: "No .",
      dataIndex: "No",
      key: "No",
      dataType: ""
      },
      {
        title: "Service",
        dataIndex: "Service",
        dataType: "select",
        require: true
        // sorter: (a:any, b:any) => a.age - b.age -> 排序声明函数
      },
      {
        title: "Direction",
        dataIndex: "Direction",
        dataType: "select",
        require: true
        // sorter: (a:any, b:any) => a.age - b.age -> 排序声明函数
      },
      {
        title: "Cycle",
        dataIndex: "Cycle",
        dataType: "input",
        require: true
      },
      {
        title: "Begin date",
        dataIndex: "BeginDate",
        dataType: "picker",
        require: true
      },
      {
        title: "End date",
        dataIndex: "EndDate",
        dataType: "picker",
        require: true
      }
    ];
  private Arr:any=[]
  private direction=direction  
  created(){
    console.log(this.detailResMsg.data);
    this.Arr = this.detailResMsg.data.cycleList
    console.log(`DETAILS creTED`);
    
  }
}
</script>
<style lang="scss" scoped>
.gridtable {
  font-family: 'Chinese Quote', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue',
    Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',
    'Segoe UI Symbol';
  font-size: 16px;
  font-variant: tabular-nums;
  line-height: 1.5;
  color: rgba(0, 0, 0, 0.65);
  box-sizing: border-box;
  margin: 16px 0;
  padding: 0;
  list-style: none;
  position: relative;
  width: 100%;
}
table.border tr td {
  height: 38px;
  vertical-align: middle;
  font-size: 1rem;
}
table.border tr th,
table.border tr td {
  border: 1px solid rgb(221, 224, 241);
}
table.border tr th {
  border-right: 1px solid #fff;
  &:last-child {
    border-right: 1px solid rgb(221, 224, 241);
  }
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
</style>
