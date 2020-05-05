<template>
<div>
  <div class="Table-input-code">
    <h1>Basic data</h1>
    <AdvancedSearch :formoptions="formOptions" ref="AdvancedSearch" :isNotShadow="true" @select="handleChange" @valuesChecked="valuesChecked"></AdvancedSearch>
  </div>
  <div class="Table-input-code">
    <h1>New record</h1>
    <!-- @inputBlur="inputBlur" -->
    <Table-input :isNotCheck="true" @addChange="addData" @deleteChange="dele" @sourcesUpdata="sourcesUpdata" :inputcolumns='inputcolumns' :inputdata='inputdata' border :Rounding='isRouting' @select="onSelect" @success="success($event,'check')" @successForm="successForm" :addData="Newdata" :tableAdd="selectedRows" ref="TableInput" />
  </div>
  <Model align-title="center" v-model="showInsert" shade title="Insert Record number plan" @Screencover="Screencover">
    <template slot="model-body">
      <div>
        <div :style="'margin:10px 20px;'">
          <div :style="'background:#fff;margin-top:20px;padding:0px 0px;'">
          </div>
          <div class="menu-child">
            <insert-record @confirmData="confirmData"></insert-record>
          </div>
        </div>
      </div>
    </template>
    <template slot="model-footer">
      <a-row>
        <a-col :span="24" :style="{ textAlign: 'center' }">
          <div style="margin-top:10px;">
            <a-button type="primary" style="border-radius: 50px;min-width: 75px" @click="editAllData">
              Confirm
            </a-button>
            <a-button :style="{ marginLeft: '8px',color: '#1890ff', borderRadius: '50px 50px 50px 50px', fontWeight: '600' }" @click="insertData">
              Return
            </a-button>
          </div>
        </a-col>
      </a-row>
    </template>
  </Model>

  <a-row class="insert-data">
    <a-col :span="9" class="insert-dropdown">
      <a-form :form="form">
        <a-form-item :colon="false" label="DefaultRoundingRules" :label-col="{ span: 10 }" :wrapper-col="{ span: 13}">
          <a-select @change="vmodelChange" v-decorator="[
          'DefaultRoundingRuless',
          {rules: [{ required: getIsRequired, message: 'Please select your defaultRoundingRules!' }],initialValue:rulesSelect},

        ]">
            <a-select-option v-for="(item,i) in roundingRules" :key="i" :value="item">
              {{item}}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-col>
    <a-col :span="3" class="insert-button">
      <a-button :size="'small'" type="primary" @click="insertData">
        Inset record
      </a-button>
    </a-col>
  </a-row>
</div>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  Component,
  Emit
} from 'vue-property-decorator'
import {
  columns,
  data
} from '@/common/ts/tableData'
import {
  AxiosGet,
  AxiosPost
} from '@/api/axios'
import {
  direction
} from '@/filter/index'
import moment from 'moment'
import flat from '@/components/formscReening/details/productDetail/flatView.vue';
@Component({
  components: {
    AdvancedSearch: resolve => require(['@/views/Configuration/NumberPlan/index.vue'], resolve),
    Table: resolve => require(['@/common/Table/index.vue'], resolve),
    TableInput: resolve => require(['@/common/TableInput/index.vue'], resolve),
    Model: resolve => require(["@/common/Model/index.vue"], resolve),
    insertRecord: resolve => require(["@/views/Configuration/NumberPlan/insertRecord.vue"], resolve)
  }
})
export default class numberPlan extends Vue {
  private form: any
  private beforeCreate() {
    this.form = this.$form.createForm(this)
  }
  private planName: string = 'All'; // Number plan name
  // public data: any[] = data // Table title
  public columns: any[] = columns // Table body
  private selectedRows: any[] = [] // 表格选中
  private index: number = 0;
  private planNameObj: any = {}
  private isRouting: boolean = false
  /* TableInput 表格选中 Add */
  public tableAdds: any[] = []
  /* TableInput Add */
  public Newdata: any = []
  private rulesSelect: any = ""
  private roundingRules: any = []
  private CountryAndCode: any
  private isRequired: boolean = false // Rounding rules 列表项 有Default 必选
  get getIsRequired() {
    return this.isRequired
  }
  private visible: any = false
  /* TableInput 头部 */
  public inputcolumns: any = [{
      title: 'No .',
      dataIndex: 'No',
      key: 'No'
    },
    {
      title: 'Destination',
      dataIndex: 'Destination',
      require: true,
      width: '20%' // 自定义宽度
      // sorter: (a:any, b:any) => a.age - b.age -> 排序声明函数
    },
    {
      title: 'Dest. type',
      dataIndex: 'destType',
      require: true,
      width: '12%'
      // sorter: (a:any, b:any) => a.age - b.age -> 排序声明函数
    },
    {
      title: 'Dialed digits',
      dataIndex: 'dialedDigits',
      require: true,
      width: '30%'
    },
    {
      title: 'Country code',
      dataIndex: 'CountryCode',
      require: "",
      width: '16%'
    },
    {
      title: 'Country',
      dataIndex: 'Country',
      require: "",
      width: '16%'
    },
    {
      title: 'Rounding rules',
      dataIndex: 'roundingFules',
      require: false,
      width: '20%'
    }
  ];
  /* TableInput 身体 */
  public inputdata: any[] = [{
    key: 1,
    Destination: {
      type: 'input',
      decorator: 'Destination',

    },
    destType: {
      type: 'select',
      decorator: 'destType',
      options: [{
          name: 'Mobile'
        },
        {
          name: 'Fixed'
        }
      ],
      initialValue: ""
    },
    dialedDigits: {
      type: 'input',
      decorator: 'dialedDigits',
      initialValue: "",
    },
    CountryCode: {
      type: 'tags',
      showSearch: true,
      required: true,
      decorator: 'CountryCode',
      options: [],
      initialValue: undefined,
      // allowClear: false
    },
    Country: {
      type: 'tags',
      showSearch: true,
      decorator: 'Country',
      options: [],
      initialValue: undefined,
      // allowClear: false
    },
    roundingFules: {
      type: 'select',
      decorator: 'roundingFules',
      showSearch: true,
      options: [],
      initialValue: "Default",
      // allowClear: false

    }
  }];
  /* 高级搜索 */
  private formOptions: any[] = [{
      Tips: 'Account',
      name: 'accountName',
      required: true,
      type: 'select',
      options: null,
      span: 12
    },
    {
      Tips: 'Service',
      name: 'service',
      required: true,
      type: 'select',
      options: null,
      span: 12
    },
    {
      Tips: '', //此处加空，避免Account选值后,样式挤压
      name: '',
      disabled: false,
      required: false,
      allowClear: false,
      type: '',
      options: null,
      span: 23,
      colSpan: 5
    },
    {
      Tips: 'Direction',
      name: 'direction',
      required: true,
      type: 'select',
      span: 12,
      options: [{
        name: "Inbound",
        value: 1
      }, {
        name: "Outbound",
        value: 2
      }],
    },
    {
      Tips: 'Effective date',
      name: 'EffectiveDate',
      required: true,
      type: 'picker',
      span: 12
    },
    {
      Tips: 'Number plan name',
      name: 'Numberplanname',
      required: true,
      disabled: true,
      type: 'input',
      options: null,
      span: 24,
      colSpan: 4,
    },
  ];
  private valuesObject: any
  public valuesChecked(values: any) {
    // console.log(values);
    let valuesBeginDate = Number(moment(values.EffectiveDate._d).format("YYYY-MM-DD").split("-").join(""))
    // console.log(valuesBeginDate);

    if (valuesBeginDate > Number(20991231)) {
      // return this.$message.error(`Effective date不能大于2099-12-31`)
    } else {
      this.valuesObject = values
    }
  }
  private insertMsg: any
  public confirmData(msg) {
    console.log(msg);
    this.insertMsg = msg
  }
  public vmodelChange(val) {
    this.rulesSelect = val
  }
  public handleReruen() {
    this.Screencover();
  }
  /* 关闭 Add */
  public Screencover() {
    console.log(`colse`);
    this.showInsert = !this.showInsert
  }
  /**字段处理 */
  private direction(val: any) {
    switch (val) {
      case 1:
        return 'Inbound'
      case 2:
        return 'Outbound'
      case 3:
        return 'Bilateral'
      case "Inbound":
        return 1
      case "Outbound":
        return 2
      case "Bilateral":
        return 3
      default:
        return val
    }
  }
  private showInsert: boolean = false
  public insertData() {
    this.showInsert = !this.showInsert
  }
  /* name change */
  public handleChange(name: string, arr: string[]) {
    console.log(name, arr);
    console.log(this.planNameObj)
    if (!arr) return
    if (!this.planNameObj[name]) {
      this.planNameObj[name] = arr
    }
    console.log(this.planNameObj[name]);
    if (this.planNameObj[name]) {
      this.planNameObj[name] = arr
    }
    if (!!this.planNameObj && Object.keys(this.planNameObj).length >= 3) {
      let {
        accountName,
        service,
        direction
      } = this.planNameObj
      const refsAdvancedSearch = (this.$refs.AdvancedSearch as any).form
      refsAdvancedSearch.setFieldsValue({
        'Numberplanname': `VC-${accountName}-${service}-${direction}`
      })
    }
    console.log(this.planNameObj);
  }
  // confirm
  public editAllData() {
    this.$nextTick(() => {
      const TableInput: any = this.$refs.TableInput
      // this.$set(TableInput,'Arr',TableInput.Arr.concat(this.insertMsg))
      console.log('this.insertMsg', this.insertMsg);
      TableInput.initDataAndColums(this.insertMsg, false)
      console.log('Arr', TableInput.Arr);
    })
    console.log('editAllData', this.inputdata);
    this.insertData()
    // console.log(this.inputdata.concat(this.insertMsg));
  }
  /* 高级搜索 回调 */
  public SearchOk(val: any) {}
  /* 选中项发生变化时的回调 */
  // public rowSelection: any = {
  //     onChange: (selectedRowKeys: any, selectedRows: any) => {
  //         console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
  //     },
  //     /* 用户手动选择/取消选择某列的回调 */
  //     onSelect: (record: any, selected: boolean, selectedRows: any) => {
  //         this.assigNment(selectedRows)
  //     },
  //     /* 用户手动选择/取消选择所有列的回调 */
  //     onSelectAll: (selected: any, selectedRows: any, changeRows: any) => {
  //         this.assigNment(selectedRows)
  //     }
  // }
  /* 输入框输入事件 */
  // public inputBlur(val: string, name: string) {
  //   console.log(val, name);
  //   let dialedDigits = name.slice(0, -1)
  //   let reg = /^(([0-9]+)|([0-9]+-[0-9]+)|([0-9]*\*[0-9]*\([0-9]\)))(,(([0-9]+)|([0-9]+-[0-9]+)|([0-9]*\*[0-9]*\([0-9]\))))*$/
  //   if (dialedDigits == "dialedDigits") {
  //     if (!reg.test(val)) {
  //       alert('Format error')
  //     }
  //   }
  // }

  public async onSelect(val: any, name: string, optionsIndex: number, rowIndex: number) {
    console.log(val, name);

    let currentName: string = name
    let match = currentName.match(/[a-zA-Z]+/)
    if (match) {
      currentName = match[0]
    }
    // console.log(currentName,rowIndex);
    //删除默认的样式
    if (val === undefined && currentName === "roundingFules") {
      await this.$set(this.inputcolumns[6], 'require', true)
    }
    const TableInput: any = this.$refs.TableInput
    if (currentName === 'CountryCode' || currentName === 'Country') {
      let setData: any = {}

      if (val && val.length > 1) {
        setData[name] = val.slice(-1)
      }
      const find: any = this.CountryAndCode.find((item: any, index: number, arr: any) => {
        console.log(item.country_code, val[0], item.country_name, val[0]);
        return (currentName === 'CountryCode' && item.country_code === val[0]) || (currentName === 'Country' && item.country_name === val[0])
      })
      // console.log(find);
      let CountryCode = find ? [find.country_code] : this.CountryCode
      let Country = find ? [find.country_name] : this.Country
      // console.log(CountryCode);
      // console.log(Country);
      console.log(TableInput);

      this.$set(TableInput.Arr[rowIndex].name[4], 'options', CountryCode)
      this.$set(TableInput.Arr[rowIndex].name[5], 'options', Country)
      // console.log(this.$set(TableInput.Arr[rowIndex].name[5], 'options', Country));

      /**
       * val 存在 既设置值时   value也设置上options第一项
       */
      // console.log('currentName', currentName);
      if (
        val && val.length &&
        (currentName === 'CountryCode' || currentName === 'Country') &&
        (Country !== this.Country || CountryCode !== this.CountryCode)
      ) {
        const key = currentName === 'CountryCode' ? TableInput.Arr[rowIndex].name[5].decorator : TableInput.Arr[rowIndex].name[4].decorator
        // const data = currentName === 'CountryCode' ? Country !== this.Country ? Country[0] : undefined : CountryCode !== this.CountryCode ? CountryCode[0] : undefined
        const data = currentName === 'CountryCode' ? Country[0] : CountryCode[0]
        console.log(setData, data, key, "213", setData[key]);
        setData[key] = data
      }

      // 如果设置的选项的options 没有现在填的数据  就清空 
      // let setData: any = {}
      // let data: any = TableInput.form.getFieldValue(currentName === 'CountryCode' ? TableInput.Arr[rowIndex].name[5].decorator : TableInput.Arr[rowIndex].name[4].decorator)
      // let isHasValue = (currentName === 'CountryCode' ? Country : CountryCode).find((item: any) => item == data)
      // if (!isHasValue) {
      //   setData[currentName === 'CountryCode' ? TableInput.Arr[rowIndex].name[5].decorator : TableInput.Arr[rowIndex].name[4].decorator] = undefined
      // }
      console.log('setData', setData);
      this.$nextTick(() => {
        Object.keys(setData).length && TableInput.form.setFieldsValue(setData)
      })
    }
    // if(currentName === 'roundingFules'){
    //   this.$set(TableInput.Arr[rowIndex].name[5], 'options', this.options)
    // }
    // console.log(val, name, rowIndex);
    let getDateArr: any = []
    this.$nextTick(() => {
      let getDate = TableInput.getData(true)
      if (!getDate.includes('Default')) {
        this.form.setFields({
          defaultRoundingRuless: undefined
        })
      }
    })
  }
  public sourcesUpdata(val: any) {
    // console.log(val);
  }
  public check() {
    this.form.validateFields(
      (err: any) => {
        if (!err) {
          // console.info('success')
        }
      },
    );
  }
  /* 表格输入框 校验成功触发 */
  private isNextCheck: boolean = true

  public async checkAll(): Promise < any > {
    return new Promise(async (resolve: any, reject: any) => {
      let value = (this.$refs.TableInput as any).getData()
      if (!value) return
      console.log('value', value)
      let arr: any = []
      let dataParams: any[] = []
      let isGoNext: boolean = true;
      (this.$refs.AdvancedSearch as any).handleSearch()
      for (let i = 0; i < value.length; i++) {
        let roundingFules = value[i].roundingFules
        if (roundingFules === "Default") {
          await this.$set(this, 'isRequired', true)
          this.check()
          if (this.rulesSelect == "") {
            isGoNext = false
          } else {
            isGoNext = true
          }
        } else {
          await this.$set(this, 'isRequired', false)
        }
        // console.log(this.isRequired, isGoNext);
        let itemDest = value[i].Destination
        arr.push(itemDest)
        dataParams.push({
          "destinationName": value[i].Destination,
          "dialedDigitsList": value[i].dialedDigits
        })
      }
      arr.sort((a: any, b: any) => a.localeCompare(b))
      for (let j = 0; j < arr.length; j++) {
        if (arr[j] === arr[j + 1] && arr[j]) {
          this.isNextCheck = false

          return this.$message.error(`Duplicate Destinations are NOT allowed`)
        } else {
          this.isNextCheck = true
        }
      }
      console.log('dataParams', dataParams);
      console.log('isNextCheck', this.isNextCheck, 'isGoNext', isGoNext, 'valuesObject', this.valuesObject);
      if (this.isNextCheck && isGoNext && this.valuesObject && dataParams) {
        await AxiosPost('/config/vc-number-plan/check', dataParams).then((res: any) => {
          if (res.code > 0) {
            // this.$message.success(res.msg)
            // console.log(this.valuesObject, value);
            let directionValue = this.valuesObject.direction
            // console.log(directionValue);
            value.forEach((item: any) => {
              item.destType = item.destType === "Mobile" ? 1 : 2
            });
            // console.log(value);
            let arr: any[] = []
            for (let i = 0; i < value.length; i++) {
              let item = value[i]
              if (Array.isArray(item.CountryCode)) {
                item.CountryCode = item.CountryCode.join("")
              }
              if (Array.isArray(item.Country)) {
                item.Country = item.Country.join("")
              }
              // console.log(item);
              if (!arr[i]) arr[i] = []
              arr[i] = {
                "countryCode": item.CountryCode,
                "countryName": item.Country,
                "destinationName": item.Destination,
                "destinationType": item.destType,
                "dialedDigitsList": item.dialedDigits,
                "roundingRuleName": item.roundingFules
              }
            }
            // console.log(arr);
            let saveParams = {
              "accountName": this.valuesObject.accountName,
              "beginDate": moment(this.valuesObject.EffectiveDate._d).format('YYYY-MM-DD'),
              "configServiceName": this.valuesObject.service,
              "defaultRoundingRuleName": this.rulesSelect,
              "numberPlanName": this.valuesObject.Numberplanname,
              "direction": this.direction(directionValue),
              "recordList": arr
            }
            resolve(saveParams)
            return saveParams
          } else {
            this.$message.error(res.msg)
          }

          reject()
          return

        })
      }
      reject()
      return
    })
  }

  public async success(value: any, msg: string) {
    console.log('value', value)
    let arr: any = []
    let dataParams: any[] = []
    let isGoNext: boolean = true;
    (this.$refs.AdvancedSearch as any).handleSearch()
    if (!value) {
      (this.$refs.TableInput as any).check()
    }
    //  if (!value) return
    for (let i = 0; i < value.length; i++) {
      let roundingFules = value[i].roundingFules
      if (roundingFules === "Default" || roundingFules === undefined) {
        await this.$set(this, 'isRequired', true)
        this.check()
        if (this.rulesSelect == "") {
          isGoNext = false
        } else {
          isGoNext = true
        }
      } else {
        await this.$set(this, 'isRequired', false)
      }
      let itemDest = value[i].Destination
      arr.push(itemDest)
      dataParams.push({
        "destinationName": value[i].Destination,
        "dialedDigitsList": value[i].dialedDigits
      })
    }
    arr.sort((a: any, b: any) => a.localeCompare(b))
    for (let j = 0; j < arr.length; j++) {
      if (arr[j] === arr[j + 1] && arr[j]) {
        this.isNextCheck = false
        return this.$message.error(`Duplicate Destinations are NOT allowed`)
      } else {
        this.isNextCheck = true
      }
    }
    if (this.isNextCheck && isGoNext && this.valuesObject && dataParams) {
      await AxiosPost('/config/vc-number-plan/check', dataParams).then((res: any) => {
        if (res.code > 0) {
          this.$message.success(res.msg)
          return true
        } else {
          console.log(6666)
          this.$message.error(res.msg);
          return false
        }
      })
    }
    return false
  }

  public successForm(form: any) {
    // console.log(form);

  }
  /* ADD 数据生成 */
  public actions() {
    const arr: any = [];
    this.index++
    /* 数据 -> TableInput 一致 重复一份作用于配置后台接口，自定义字段，type类型等。。 */
    const actions = new Map([
      [1, []],
      [2, ['input', `Destination${this.index}`]],
      [3, ['select', `destType${this.index}`, [{
        name: 'Mobile'
      }, {
        name: 'Fixed'
      }]]],
      [4, ['input', `dialedDigits${this.index}`]],
      [5, ['tags', `CountryCode${this.index}`, this.CountryCode, undefined, true]],
      [6, ['tags', `Country${this.index}`, this.Country, , undefined, true]],
      [7, ['select', `roundingFules${this.index}`, this.inputdata[0].roundingFules.options, "Default", true]]
    ])
    for (let index = 1; index < actions.size + 1; index++) {
      const action: any = actions.get(index);
      arr.push({
        type: action[0],
        decorator: action[1],
        options: action[2],
        initialValue: action[3],
        showSearch: action[4],
      });
    }
    return arr
  }
  // 赋值函数
  public assigNment(values: any) {
    return this.selectedRows = values;
  }
  private CountryCode: any
  private Country: any
  created() {
    (async () => {
      const data: any = await Promise.all(
        [
          '/config/droplist/accounts',
          '/config/droplist/services',
          '/config/droplist/countryCodes',
          '/config/droplist/countries',
          '/config/droplist/countryWithCodes',
          '/config/droplist/countryCodes',
          '/config/droplist/countries',
          '/config/droplist/vcRoundingRule/names'
        ].map(
          (url: string) => AxiosGet(url).catch(
            (err: any) => {
              console.log(err)
            }
          )
        )
      );
      data[7].data.unshift('Default')
      this.formOptions[0]['options'] = data[0].data
      this.formOptions[1]['options'] = data[1].data
      this.inputcolumns[2]['options'] = data[2].data
      this.inputcolumns[4]['options'] = data[3].data
      this.CountryAndCode = data[4].data
      this.inputdata[0].CountryCode.options = data[5].data
      this.CountryCode = data[5].data
      this.inputdata[0].Country.options = data[6].data
      this.Country = data[6].data
      this.inputdata[0].roundingFules.options = data[7].data
      this.options = data[7].data
      this.roundingRules = data[7].data.slice(1)

      this.addData();
    })()
  }
  private options: any

  // add数据
  public addData() {
    this.Newdata = [this.actions()];
  }
  /* 插入 */
  public confirm() {
    let TableInput: any = this.$refs.TableInput;
    TableInput.tabAdd()
  }
  public dele() {
    this.index--;
  }
}
</script>

<style lang="scss" scoped>
.Table-input-code {
  h1 {
    margin: 10px 0px;
    font-weight: 300;
    font-weight: 300;
    border-left: 5px solid sandybrown;
    padding-left: 5px;
  }
}

.insert-data {
  display: flex;
  align-items: center;
  width: 100%;
  height: 0;
  position: relative;

  .ant-form-item.ant-form-item-no-colon {
    margin: 0;
  }

  .ant-btn.ant-btn-primary.ant-btn-sm {
    background-color: #3e77d8;
    border-color: #3e77d8;
    padding: 2px 15px;
    border-radius: 50px;
  }

  .insert-dropdown {
    position: absolute;
    top: -50px;
    left: 0;
  }

  .insert-button {
    position: absolute;
    top: -40px;
    right: 240px;
  }
}
</style><style>
.insert-data .ant-form-item.ant-form-item-no-colon .ant-form-item-label label {
  font-weight: 500;
}
</style>
