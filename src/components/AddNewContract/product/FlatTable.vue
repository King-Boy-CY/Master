<template>
  <div class="Ratingzone"
       ref="ratingzone">
    <h1>Rating zone</h1>
    <div v-for="(i,k) in ratingzoneAdd"
         :key="k"
         ref="ratingzoneCode">
      <div class="Ratingzone-code">
        <div class="Zone-code">
          <a-row>
            <a-col :span="18">
              <span class="title">Zone&nbsp;{{k+1}}</span>
            </a-col>
            <a-col :span="6">
              <span class="Copy"
                    @click="copyZone">Copy 对对对zone</span>
              <span class="Delete"
                    @click="deleteZone(k)">Delete zone</span>
            </a-col>
          </a-row>
        </div>
        <a-form :form="form">
          <a-row>
            <a-col :span="24">
              <a-form-item label="Commitment (Value)"
                           :colon="false"
                           :hasFeedback="false"
                           :label-col="{ span: 3, offset: 1 }"
                           :wrapper-col="{ span: 14 }">
                <a-input placeholder=""
                         v-decorator="[
                                `Commitment-value`,
                                {
                                rules: [{
                                    required:  true,
                                    message: `Commitment (Value) field should be no-null`
                                }],
                                 initialValue: 'default'
                                }
                            ]" />
                <!-- <a-select
                            :showArrow="false"
                            v-decorator="[
                                `Commitment-value`,
                                {
                                rules: [{
                                    required:  true,
                                    message: `Commitment (Value) field should be no-null`
                                }],
                                initialValue: 'default'
                                }
                            ]"
                            placeholder=""
                        >
                        <a-select-option value="default">default</a-select-option>
                            </a-select> -->
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="Tier unit type"
                           :colon="false"
                           :hasFeedback="false"
                           :label-col="{ span: 3, offset: 1 }"
                           :wrapper-col="{ span: 18 }">
                <a-select allowClear
                          placeholder=""
                          :getPopupContainer="triggerNode => triggerNode.parentNode"
                          v-decorator="[
                                `TierUnittype`,
                                {
                                rules: [{
                                    required:  true,
                                    message: `TierUnittype field should be no-null`
                                }],
                                }
                            ]">
                  <a-select-option v-for="(item,key) in ['Mins','Quarters','Call','User']"
                                   :key="key">
                    {{item}}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="23">
              <a-form-item label="Time band"
                           :colon="false"
                           :hasFeedback="false"
                           :label-col="{ span: 3, offset: 1 }"
                           :wrapper-col="{ span: 19 }">
                <a-textarea placeholder=""
                            :rows="1"
                            class="Timeband"
                            v-decorator="[
                                `timeBand`,
                                {
                                rules: [{
                                    required:  true,
                                    message: `Time band field should be no-null`
                                }],
                                }
                            ]" />
              </a-form-item>
            </a-col>
            <a-col :span="1">
              <span class="Go"
                    @click="goVisibleHide">Go</span>
            </a-col>
            <model title="Time band"
                   v-model="goVisible"
                   width="900px"
                   @Screencover="goVisibleHide">
              <template slot="model-body">
                <Table @onSelectAll="onSelectAll"
                       @onSelect="onSelect"
                       :columns="columns"
                       :data="data"
                       zebraStripe
                       :scroll="{ x: 600, y: 250 }" />
              </template>
              <template slot="model-footer">
                <a-row style="margin-top:20px;">
                  <a-col :span="24"
                         style="text-align:center;">
                    <a-button type="primary"
                              @click="confirm">Confirm</a-button>
                    <a-button style="margin-left:30px;"
                              @click="goVisibleHide">Return</a-button>
                  </a-col>
                </a-row>
              </template>
            </model>
            <a-col :span="24">
              <TableInput :inputcolumns='inputcolumns'
                          :inputdata='inputdata'
                          border
                          :Check="false"
                          :addData="Newdata" />
              <!-- <section>
              <table>
                <thead>
                  <tr>
                    <th v-for="(item,key) in inputcolumns" :key="key">
                      <span :style="{color: item.require ? 'red' : ''}"
                  v-show="item.require">*</span>{{item.title}}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td v-for="">

                    </td>
                  </tr>
                </tbody>
              </table>
            </section> -->
            </a-col>
          </a-row>
        </a-form>
        <a-row>
          <a-col>
            <span class="addZone">Add zone</span>
          </a-col>
        </a-row>
      </div>
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
  columns,
  data
} from '@/common/ts/tableData'

@Component({
  components: {
    TableInput: resolve => require(['@/common/TableInput/index.vue'], resolve),
    selectInput: resolve => require(['@/common/selectInput/index.vue'], resolve),
    Table: resolve => require(["@/common/Table/index.vue"], resolve),
    model: resolve => require(['@/common/Model/index.vue'], resolve)
  }
})
export default class penAlty extends Vue {
  /* Prop -> inputcolumns & inputdata */
  @Prop(Array) private inputcolumns ? : any;
  @Prop(Array) private inputdata ? : any;
  /* 是否需要从后台获取费率区 */
  @Prop(Boolean) private Interval ? : Boolean;
  /* goVisible -> Time band */
  private goVisible: boolean = false;
  public data: any[] = data // Table title
  public columns: any[] = columns // Table body
  /* copyZoneNum -> 计数是否有复制 */
  private ratingzoneAdd: any[] = [{}];
  private options: any[] = [{
      value: 'All',
      label: '全选'
    },
    {
      value: '选项1',
      label: '黄金糕'
    }, {
      value: '选项2',
      label: '双皮奶'
    }, {
      value: '选项3',
      label: '蚵仔煎'
    }, {
      value: '选项4',
      label: '龙须面'
    }, {
      value: '选项5',
      label: '北京烤鸭'
    }, {
      value: '选项6',
      label: '北京烤鸭2'
    }
  ];
  /* From */
  private form: any;
  public beforeCreate() {
    this.form = this.$form.createForm(this);
  }
  /* TableInput Add */
  public Newdata: any = []

  /* ADD 数据生成 */
  public actions() {
    const arr:Array<{
      type:string,
      decorator:string,
      options:Array<{
        name:string
      }>
    }> = [];
    /* 数据 -> TableInput 一致 重复一份作用于配置后台接口，自定义字段，type类型等。。 */
    const actions = new Map([
      [1, []],
      [2, ['input', 'Tierfrom']],
      [3, ['input', 'tireTo']],
      [4, ['input', 'Rate']],
      [5, ['select', 'chargableUnittype', [{
          name: 'Secs'
        },
        {
          name: 'Mins'
        },
        {
          name: 'Quarters'
        },
        {
          name: 'Call'
        },
        {
          name: 'User'
        },
      ]]],
      [6, ['input', 'Band', [{
        name: 'Country2-1'
      }, {
        name: 'Country2-2'
      }]]]
    ])
    for (let index = 1; index < actions.size + 1; index++) {
      const action: any = actions.get(index);
      arr.push({
        type: action[0],
        decorator: action[1],
        options: action[2]
      });
    }
    return arr
  }

  public created() {
    this.addData()
  }
  // add数据
  public addData() {
    this.Newdata = [this.actions()];
  }
  /* copyZone -> dom 复制 */
  public copyZone() {
    this.ratingzoneAdd.push({})
  }
  /* deleteZone -> dom 移除 */
  public deleteZone(index: number) {
    let ratingzoneCode: any = this.$refs.ratingzoneCode;
    let ratingzoneRemove: any = this.$refs.ratingzone;
    index > 0 && ratingzoneRemove.removeChild(ratingzoneCode[index]) && this.ratingzoneAdd.splice(index, 1);
  }
  /* 用户手动选择/取消选择所有列的回调  Table -> 回调 */
  public onSelectAll(selected: any, selectedRows: any, changeRows: any) {
    // this.assigNment(selectedRows)
  }
  /* 用户手动选择/取消选择某列的回调
      @param record: 选中数据
      @param selected: 是否选中 true/false
      @param selectedRows: 所有选中 Array
      */
  public onSelect(record: object, selected: boolean, selectedRows: any) {
    // this.assigNment(selectedRows)
  }
  /* Go Visible */
  public goVisibleHide() {
    this.goVisible = !this.goVisible;
  }
  /* 插入 */
  public confirm() {
    let TableInput: any = this.$refs.TableInput;
    // TableInput.tabAdd()
  }

}
</script>

<style lang="scss" scoped>
.Ratingzone {
  h1 {
    padding: 10px;
    border-bottom: 1px solid rgb(231, 231, 231);
  }

  .Zone-code {
    margin: 25px 10px;
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

  .Copy,
  .Delete,
  .addZone {
    display: inline-block;
    padding: 5px 10px;
    border-radius: 50px;
    color: #fff;
    border: 1px solid #1890ff;
    background-color: #1890ff;
    margin: 5px;
    font-weight: 500;
    cursor: pointer;

    &:hover {
      opacity: 0.8;
    }
  }

  .Delete {
    color: #f5222d;
    border: 1px solid #f5222d;
    background: #f5f5f5;
  }
}

.addZone {
  border-radius: 6px;
}

.Go {
  display: inline-block;
  width: 40px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  color: #fff;
  background-color: #3e77d8;
  transition: all 0.2s;
  cursor: pointer;
  border-radius: 6px;
  margin: 4px 0px;
  margin-left: -29px;

  &:hover {
    opacity: 0.8;
  }
}
</style>
