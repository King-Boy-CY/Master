<template>
  <div>
    <a-row style="background:#fff;">
      <a-col :style="{ textAlign: 'center', background: '#fff', padding: '10px 0px' }">
        Number plan name
        <a-select :getPopupContainer="triggerNode => triggerNode.parentNode"
                  size="default"
                  style="width: 300px"
                  @change="handleChange"
                  v-model="planName">
          <a-select-option v-for="i in 5"
                           :key="(i + 9).toString(36) + i">
            {{(i + 9).toString(36) + i}}
          </a-select-option>
        </a-select>
      </a-col>
    </a-row>
    <AdvancedSearch :formoptions="formOptions"
                    @Submit="SearchOk"/>
    <div style="background:#fff;margin-top:20px;box-shadow: 0 2px 8px rgb(224, 224, 224);border-radius: 4px;">
      <a-table :rowSelection="rowSelection"
               :pagination="false"
               :columns="columns"
               :dataSource="data">
        <template slot="footer">
          <a-row>
            <a-col :span="24"
                   :style="{ textAlign: 'center' }">
              <a-button type="primary"
                        :style="{ borderRadius: '50px 50px 50px 50px' }"
                        @click="confirm">
                Confirm
              </a-button>
              <a-button type="primary"
                        :style="{ borderRadius: '50px 50px 50px 50px', background:'0px', color: '#1890ff', marginLeft:'8px' }">
                return
              </a-button>
            </a-col>
          </a-row>
        </template>
      </a-table>
    </div>
    <div class="Table-input-code">
      <h1>Creat data</h1>
      <Table-input @addChange="addData"
                   @deleteChange="dele"
                   :inputcolumns='inputcolumns'
                   :inputdata='inputdata'
                   border
                   Rounding
                   @success="success"
                   :addData="Newdata"
                   :tableAdd="selectedRows"
                   ref="TableInput" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {
    Component
} from 'vue-property-decorator'
import {
    columns,
    data
} from '@/common/ts/tableData'

@Component({
    components: {
        AdvancedSearch: resolve => require(['@/common/Advancedsearch/index.vue'], resolve),
        Table: resolve => require(['@/common/Table/index.vue'], resolve),
        TableInput: resolve => require(['@/common/TableInput/index.vue'], resolve)
    }
})
export default class numberPlan extends Vue {
    private planName: string = 'All'; // Number plan name
    public data: any[] = data // Table title
    public columns: any[] = columns // Table body
    private selectedRows: any[] = [] // 表格选中
    private  index:number = 0;
    /* TableInput 表格选中 Add */
    public tableAdds: any[] = []
    /* TableInput Add */
    public Newdata: any = []
    /* TableInput 身体 */
    public inputdata: any[] = [{
        key: 1,
        Destination: {
            type: 'input',
            decorator: 'Destination'
        },
        destType: {
            type: 'select',
            decorator: 'destType',
            options: [{
                    name: 'CountryCode1'
                },
                {
                    name: 'CountryCode2'
                }
            ]
        },
        dialedDigits: {
            type: 'input',
            decorator: 'dialedDigits'
        },
        Country: {
            type: 'tags',
            decorator: 'Country',
            options: [{
                    name: 'roundingFules1'
                },
                {
                    name: 'roundingFules2'
                }
            ]
        },
        CountryCode: {
            type: 'tags',
            decorator: 'CountryCode',
            options: [{
                    name: 'roundingFules1'
                },
                {
                    name: 'roundingFules2'
                }
            ]
        },
        roundingFules: {
            type: 'select',
            decorator: 'roundingFules',
            options: [{
                    name: 'roundingFules1'
                },
                {
                    name: 'roundingFules2'
                }
            ]
        }
    }];
    /* TableInput 头部 */
    public inputcolumns: any = [{
            title: 'No .',
            dataIndex: 'No',
            key: 'No'
        },
        {
            title: 'Destination',
            dataIndex: 'Destination',
            require: false,
            width: '15%' // 自定义宽度
            // sorter: (a:any, b:any) => a.age - b.age -> 排序声明函数
        },
        {
            title: 'Dest. type',
            dataIndex: 'destType',
            require: false
            // sorter: (a:any, b:any) => a.age - b.age -> 排序声明函数
        },
        {
            title: 'Dialed digits',
            dataIndex: 'dialedDigits',
            require: false,
            width: '15%'
        },
        {
            title: 'Country code',
            dataIndex: 'CountryCode',
            require: false,
            width: '16%'
        },
        {
            title: 'Country',
            dataIndex: 'Country',
            require: false,
            width: '16%'
        },
        {
            title: 'Rounding rules',
            dataIndex: 'roundingFules',
            require: false
        }
    ];
    /* 高级搜索 */
    private formOptions: any[] = [{
            Tips: 'Numberplanname',
            name: 'planName',
            required: false,
            type: 'select',
            options: [{
                name: 'Accout1'
            }, {
                name: 'Accout2'
            }]
        },
        {
            Tips: 'Destination',
            name: 'Destination',
            required: false,
            type: 'select',
            options: [{
                name: 'Contract1'
            }, {
                name: 'Contract2'
            }]
        },
        {
            Tips: 'Dest. Type',
            name: 'DestType',
            required: false,
            type: 'select',
            options: [{
                name: 'Service1'
            }, {
                name: 'Service2'
            }]
        },
        {
            Tips: 'Countryname',
            name: 'Countryname',
            required: false,
            type: 'select',
            options: [{
                name: 'Direction1'
            }, {
                name: 'Direction2'
            }]
        },
        {
            Tips: 'Dialed digits',
            name: 'dialedDigits',
            required: false,
            type: 'select',
            options: [{
                name: 'Cycle1'
            }, {
                name: 'Cycle2'
            }]
        },
        {
            Tips: 'Account',
            name: 'Account',
            required: false,
            type: 'select',
            options: [{
                name: 'Rate plan1'
            }, {
                name: 'Rate plan2'
            }]
        },
        {
            Tips: 'Number plantype',
            name: 'planType',
            required: false,
            type: 'select',
            options: [{
                name: 'Product1'
            }, {
                name: 'Product2'
            }]
        },
        {
            Tips: 'Direction',
            name: 'Direction',
            required: false,
            type: 'select',
            options: [{
                name: 'Status1'
            }, {
                name: 'Status2'
            }]
        },
        {
            Tips: 'begin date',
            name: 'beginDate',
            required: false,
            type: 'picker'
        },
        {
            Tips: 'End date',
            name: 'EndDate',
            required: false,
            type: 'picker'
        }
    ];
    /* name change */
    public handleChange() {

    }

    /* 高级搜索 回调 */
    public SearchOk(val: any) {
    }
    /* 选中项发生变化时的回调 */
    public rowSelection: any = {
        onChange: (selectedRowKeys: any, selectedRows: any) => {
            // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
        },
        /* 用户手动选择/取消选择某列的回调 */
        onSelect: (record: any, selected: boolean, selectedRows: any) => {
            this.assigNment(selectedRows)
        },
        /* 用户手动选择/取消选择所有列的回调 */
        onSelectAll: (selected: any, selectedRows: any, changeRows: any) => {
            this.assigNment(selectedRows)
        }
    }
    /* 输入框输入事件 */
    public  (val: string, name: string) {
        // console.log(val,name)
        // if (name !== 'Destination') return true;
        // const data = this.inputdata[0];
        // this.inputcolumns.forEach((elem: any, index: number) => {
        //     if (!!data[elem.dataIndex]) {
        //         data['destType']['require'] = !!val;
        //         data['dialedDigits']['require'] = !!val;
        //         data['roundingFules']['require'] = !!val;
        //         data['destType']['decorator'] === elem['dataIndex'] && (elem.require = !!val);
        //         data['dialedDigits']['decorator'] === elem['dataIndex'] && (elem.require = !!val);
        //         data['roundingFules']['decorator'] === elem['dataIndex'] && (elem.require = !!val);
        //     }
        // });
    }
    /* 表格输入框 校验成功触发 */
    public success(value: any) {
        // console.log(value)
    }
    /* ADD 数据生成 */
    public actions() {
        const arr:Array<{
            type:string,
            decorator:string,
            options:Array<{name:string}>
        }> = [];
        this.index++
        /* 数据 -> TableInput 一致 重复一份作用于配置后台接口，自定义字段，type类型等。。 */
        const actions = new Map([
            [1, []],
            [2, ['input', `Destination${this.index}`]],
            [3, ['select', `destType${this.index}`, [{
                name: `destType2-1-${this.index}`
            }, {
                name: `destType2-2`
            }]]],
            [4, ['input', `dialedDigits${this.index}`]],
            [5, ['tags', `CountryCode${this.index}`, [{
                name: 'CountryCode2-1-'
            }, {
                name: 'CountryCode2-2'
            }]]],
            [6, ['tags', `Country${this.index}`, [{
                name: 'Country2-1'
            }, {
                name: 'Country2-2'
            }]]],
            [7, ['select', `roundingFules${this.index}`, [{
                name: 'roundingFules2-1'
            }, {
                name: 'roundingFules2-2'
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
    // 赋值函数
    public assigNment(values: any) {
        return this.selectedRows = values;
    }
    public created() {
        this.addData()
    }
    // add数据
    public addData() {
        this.Newdata = [this.actions()];
    }
    /* 插入 */
    public confirm() {
        let TableInput: any = this.$refs.TableInput;
        TableInput.tabAdd()
    }
    public dele () {
        this.index--;
    }
    // public testChange (val:string) {
    //     console.log(val)
    // }
    // /* 重置数据 TableInput数据只有一条 触发 */
    // public emptyAll () {
    //   console.log('111')
    //   // this.tableAdds = [];
    //   // this.Newdata.slice(0,1);
    // }
}
</script>

<style lang="scss" scoped>
.Table-input-code {
  padding: 10px;
  background: #fff;
  margin-top: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgb(224, 224, 224);

  h1 {
    margin: 10px 0px;
    font-weight: 600;
    border-left: 5px solid sandybrown;
    padding-left: 5px;
  }
}
</style>
