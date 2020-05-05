<template>
<div>
  <div class="Table-input-code">
    <h1>Basic data</h1>
    <AdvancedSearch :formoptions="formOptions" ref="AdvancedSearch" :isNotShadow="true" @select="handleChange" @valuesChecked="valuesChecked"></AdvancedSearch>
  </div>
  <div class="Table-input-code">
    <h1>New record</h1>
    <!-- @inputBlur="inputBlur" -->
    <Table-input :newAdd="false" :isNotCheck="true" @addChange="addData" @deleteChange="dele" @sourcesUpdata="sourcesUpdata" :inputcolumns='inputcolumns' :inputdata='inputdata' border :Rounding='isRouting' @select="onSelect" @success="success" @successForm="successForm" :addData="Newdata" :tableAdd="selectedRows" ref="TableInput" />
  </div>

</div>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  Component,
  Emit,
  Prop
} from 'vue-property-decorator'
import {
  columns,
  data
} from '@/common/ts/tableData'
import {
  AxiosGet,
  AxiosPost,
} from '@/api/axios'
import {
  direction,
  numberPlanStatus
} from '@/filter/index'
import moment from 'moment'
import flat from '@/components/formscReening/details/productDetail/flatView.vue';
import {

} from '@/filter/index'
@Component({
  components: {
    AdvancedSearch: resolve => require(['@/views/Configuration/NumberPlan/index.vue'], resolve),
    Table: resolve => require(['@/common/Table/index.vue'], resolve),
    TableInput: resolve => require(['@/common/TableInput/index.vue'], resolve)
  }
})
export default class numberPlanEdit extends Vue {
  @Prop() numberPlanId: any
  @Prop() numberPlanStatus: any
  @Prop() responseDate: any
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
  // private roundingRules: any = []
  private CountryAndCode: any
  private isRequired: boolean = false // Rounding rules 列表项 有Default 必选
  get getIsRequired() {
    return this.isRequired
  }
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
      disabled: true,
      width: '20%', // 自定义宽度
      // sorter: (a:any, b:any) => a.age - b.age -> 排序声明函数
      initialValue: ""
    },
    {
      title: 'Dest. type',
      dataIndex: 'destType',
      require: true,
      width: '12%',
      initialValue: ""
      // sorter: (a:any, b:any) => a.age - b.age -> 排序声明函数
    },
    {
      title: 'Dialed digits',
      dataIndex: 'dialedDigits',
      require: true,
      width: '30%',
      initialValue: "",
    },
    {
      title: 'Country code',
      dataIndex: 'CountryCode',
      require: "",
      width: '16%',
      initialValue: ""
    },
    {
      title: 'Country',
      dataIndex: 'Country',
      require: "",
      width: '16%',
      initialValue: ""
    },
    {
      title: 'Rounding rules',
      dataIndex: 'roundingFules',
      require: true,
      width: '20%',
      initialValue: ""
    }
  ];
  /* TableInput 身体 */
  public inputdata: any[] = [{
    key: 1,
    Destination: {
      type: 'input',
      decorator: 'destinationName',
      initialValue: ""
    },
    destType: {
      type: 'select',
      decorator: 'destinationType',
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
      decorator: 'dialedDigitsList',
      initialValue: "",
    },
    CountryCode: {
      type: 'tags',
      showSearch: true,
      required: true,
      decorator: 'countryCode',
      options: [],
      initialValue: [],
      // allowClear: false
    },
    Country: {
      type: 'tags',
      showSearch: true,
      decorator: 'countryName',
      options: [],
      initialValue: [],
      // allowClear: false
    },
    roundingFules: {
      type: 'select',
      decorator: 'roundingRuleName',
      showSearch: true,
      options: [],
      initialValue: "Default",
      // allowClear: false

    }
  }];
  /* Basic data */
  private formOptions: any[] = [{
      Tips: 'Account',
      name: 'accountName',
      required: true,
      type: 'select',
      options: null,
      span: 12,
      initialValue: "",
      disabled: true,
    },
    {
      Tips: 'Service',
      name: 'service',
      required: true,
      type: 'select',
      options: null,
      span: 12,
      initialValue: "",
      disabled: true,
    },
    // {
    //   Tips: '',
    //   name: '',
    //   disabled: false,
    //   required: false,
    //   allowClear: false,
    //   type: '',
    //   options: null,
    //   span: 23,
    //   colSpan: 5
    // },
    {
      Tips: 'Direction',
      name: 'direction',
      required: true,
      type: 'select',
      span: 12,
      disabled: true,
      options: [{
        name: "Inbound",
        value: 1
      }, {
        name: "Outbound",
        value: 2
      }],
      initialValue: ""
    },
    {
      Tips: 'Status',
      name: 'Status',
      required: true,
      type: 'select',
      span: 12,
      options: [],
      initialValue: "",
      disabled: true
    },
    {
      Tips: 'Effective date',
      name: 'EffectiveDate',
      required: true,
      type: 'picker',
      span: 12,
      initialValue: "",
      disabled: true
    },
    {
      Tips: 'Expired date',
      name: 'ExpiredDate',
      required: true,
      disabled: true,
      type: 'picker',
      span: 12,
      initialValue: "",
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
      initialValue: ""
    },
  ];
  private formOptionsEdit: any[] = [{
      Tips: 'Account',
      name: 'accountName',
      required: true,
      type: 'select',
      options: null,
      span: 12,
      initialValue: "",
    },
    {
      Tips: 'Service',
      name: 'service',
      required: true,
      type: 'select',
      options: null,
      span: 12,
      initialValue: ""
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
      initialValue: ""
    },
    {
      Tips: 'Effective date',
      name: 'EffectiveDate',
      required: true,
      type: 'picker',
      span: 12,
      initialValue: ""
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
      initialValue: ""
    },
  ];
  private valuesObject: any
  public valuesChecked(values: any) {
    console.log(values);
    let valuesBeginDate = Number(moment(values.EffectiveDate._d).format("YYYY-MM-DD").split("-").join(""))
    // console.log(valuesBeginDate);

    if (valuesBeginDate > Number(20991231)) {
      return this.$message.error(`Effective date不能大于2099-12-31`)
    } else {
      this.valuesObject = values
    }
  }
  public vmodelChange() {
    this.$nextTick(() => {
      this.rulesSelect = this.form.getFieldValue('defaultRoundingRuless')
      console.log(this.rulesSelect);
    })
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
    if (Object.keys(this.planNameObj).length >= 3) {
      let {
        accountName,
        service,
        direction
      } = this.planNameObj
      const refsAdvancedSearch = (this.$refs.AdvancedSearch as any).form
      refsAdvancedSearch.setFieldsValue({
        'Numberplanname': `${accountName}-${service}-${direction}`
      })
    }
    console.log(this.planNameObj);
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
    console.log(val);
    console.log(name);

    let currentName: string = name
    let match = currentName.match(/[a-zA-Z]+/)
    if (match) {
      currentName = match[0].toLowerCase()
    }
    console.log('currentName', currentName);
    const TableInput: any = this.$refs.TableInput
    if (currentName === 'countrycode' || currentName === 'countryname') {
      let setData: any = {}
      const TableInput: any = this.$refs.TableInput
      if (val && val.length > 1) {
        setData[name] = val.slice(-1)
      }
      const find: any = this.CountryAndCode.find((item: any, index: number, arr: any) => {
        return (currentName === 'countrycode' && item.country_code === val[0]) || (currentName === 'countryname' && item.country_name === val[0])
      })
      // console.log(find);
      let CountryCode = find ? [find.country_code] : this.CountryCode
      let Country = find ? [find.country_name] : this.Country
      console.log(CountryCode);
      console.log(Country);

      this.$set(TableInput.Arr[rowIndex].name[4], 'options', CountryCode)
      this.$set(TableInput.Arr[rowIndex].name[5], 'options', Country)
      console.log(this.$set(TableInput.Arr[rowIndex].name[5], 'options', Country));

      /**
       * val 存在 既设置值时   value也设置上options第一项
       */
      console.log('currentName', currentName);
      if (val && val.length && (currentName === 'countrycode' || currentName === 'countryname') && (Country !== this.Country || CountryCode !== this.CountryCode)) {
        const key = currentName === 'countrycode' ? TableInput.Arr[rowIndex].name[5].decorator : TableInput.Arr[rowIndex].name[4].decorator
        // const data = currentName === 'CountryCode' ? Country !== this.Country ? Country[0] : undefined : CountryCode !== this.CountryCode ? CountryCode[0] : undefined
        const data = currentName === 'countrycode' ? Country[0] : CountryCode[0]
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
  // public async onSelect(val: object, name: string, optionsIndex: number, rowIndex: number) {
  //   console.log(val);

  //   let currentName: string = name
  //   let match = currentName.match(/[a-zA-Z]+/)
  //   if (match) {
  //     currentName = match[0]
  //   }
  //   const TableInput: any = this.$refs.TableInput
  //   const find: any = this.CountryAndCode.find((item: any, index: number, arr: any) => {
  //     console.log('item',item);
  //     console.log('index',index);
  //     console.log('arr',arr);
  //     return (currentName === 'CountryCode' && item.country_code === val) || (currentName === 'Country' && item.country_name === val)
  //   })
  //   console.log(find);
  //   let CountryCode = find ? [find.country_code] : this.CountryCode
  //   console.log(CountryCode);

  //   let Country = find ? [find.country_name] : this.Country
  //   this.$set(TableInput.Arr[rowIndex].name[4], 'options', CountryCode)
  //   this.$set(TableInput.Arr[rowIndex].name[5], 'options', Country)
  //   let setData: any = {}
  //   /**
  //    * val 存在 既设置值时   value也设置上options第一项
  //    */
  //   if (val && (currentName === 'CountryCode' || currentName === 'Country')) {
  //     setData[currentName === 'CountryCode' ? TableInput.Arr[rowIndex].name[5].decorator : TableInput.Arr[rowIndex].name[4].decorator] = currentName === 'CountryCode' ? Country[0] : CountryCode[0]
  //   }

  //   // 如果设置的选项的options 没有现在填的数据  就清空 
  //   // let setData: any = {}
  //   // let data: any = TableInput.form.getFieldValue(currentName === 'CountryCode' ? TableInput.Arr[rowIndex].name[5].decorator : TableInput.Arr[rowIndex].name[4].decorator)
  //   // let isHasValue = (currentName === 'CountryCode' ? Country : CountryCode).find((item: any) => item == data)
  //   // if (!isHasValue) {
  //   //   setData[currentName === 'CountryCode' ? TableInput.Arr[rowIndex].name[5].decorator : TableInput.Arr[rowIndex].name[4].decorator] = undefined
  //   // }
  //   Object.keys(setData).length && TableInput.form.setFieldsValue(setData)
  //   // console.log(val, name, rowIndex);
  //   let getDateArr: any = []
  //   this.$nextTick(() => {
  //     let getDate = TableInput.getData(true)
  //     // if (!getDate.includes('Default')) {
  //     //   this.form.setFields({
  //     //     defaultRoundingRuless: undefined
  //     //   })
  //     // }
  //   })
  // }
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
      const value = (this.$refs.TableInput as any).getData()
      console.log('value', value)
      let arr: any = []
      let dataParams: any[] = []
      let isGoNext: boolean = true;
      (this.$refs.AdvancedSearch as any).handleSearch()

      if (!value) {
        (this.$refs.TableInput as any).check()
      }
      if (value) {

        for (let i = 0; i < value.length; i++) {
          console.log(value[i]);
          // for (let key in value[i]) {
          //   if (value[i][key] == undefined || "") {
          //     return isGoNext = false
          //   }
          // }
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
            "dialedDigitsList": value[i].dialedDigits,
            "countryCode": value[i].CountryCode,
            "countryName": value[i].Country,
            "destinationType": value[i].destType === "Mobile" ? 1 : 2,
            "roundingRuleName": value[i].roundingFules,
          })
        }
        console.log(dataParams);

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
      // console.log(this.isNextCheck,isGoNext,);
      if (this.isNextCheck && isGoNext && this.valuesObject) {
        console.log(dataParams);
        await AxiosPost('/config/vc-number-plan/check', dataParams).then((res: any) => {
          console.log(res);
          if (res.code > 0) {
            // this.$message.success(`Validated successfully`)
            console.log(this.valuesObject, value);
            let directionValue = this.valuesObject.direction
            value.forEach((item: any) => {
              item.destType = item.destType === "Mobile" ? 1 : 2
            });
            // console.log(value);
            let arr: any[] = []
            for (let i = 0; i < value.length; i++) {
              let item = value[i]
              if (!arr[i]) arr[i] = []
              arr[i] = {
                "countryCode": item.CountryCode,
                "countryName": item.Country,
                "destinationName": item.Destination,
                "destinationType": item.destType,
                "dialedDigitsList": item.dialedDigits,
                "roundingRuleName": item.roundingFules,
                "id": this.numberPlanId
              }
            }
            // console.log(arr);
            let saveParams = {
              "accountName": this.valuesObject.accountName,
              "beginDate": moment(this.valuesObject.EffectiveDate).format('YYYY-MM-DD'),
              "endDate": moment(this.valuesObject.ExpiredDate).format('YYYY-MM-DD'),
              "configServiceName": this.valuesObject.service,
              // "defaultRoundingRuleName": this.rulesSelect,
              "numberPlanName": `${this.valuesObject.Numberplanname}`,
              "direction": this.direction(directionValue),
              "recordList": arr
            }
            resolve(saveParams)
            return saveParams
          } else {
            this.$message.error(res.msg)
            return false
          }
          // reject()
          // return

        })
      } else {
        this.$message.error('checked failed')
      }
      reject()
      return
    })
  }

  public async success(value: any) {
    console.log('value', value)
    let arr: any = []
    let dataParams: any[] = []
    let isGoNext: boolean = true;
    (this.$refs.AdvancedSearch as any).handleSearch()
    if (!value) {
      (this.$refs.TableInput as any).check()
    }
    if (value) {
      value.forEach((items: any, i: number, arr: any) => {
        for (let key in items) {
          console.log(items[key]);
          if (!!items[key] && Array.isArray(items[key])) {
            items[key] = items[key].join("")
          }
        }
      })
      for (let i = 0; i < value.length; i++) {
        console.log(value[i]);
        for (let key in value[i]) {
          console.log(value[i])
          if (value[i][key] == undefined || "") {
            return isGoNext = false
          }
        }
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
          "dialedDigitsList": value[i].dialedDigits,
          "countryCode": value[i].CountryCode,
          "countryName": value[i].Country,
          "destinationType": value[i].destType === "Mobile" ? 1 : 2,
          "roundingRuleName": value[i].roundingFules,
        })
      }
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
    // console.log(this.isNextCheck,isGoNext,);
    if (this.isNextCheck && isGoNext && this.valuesObject) {
      await AxiosPost('/config/vc-number-plan/check', dataParams).then((res: any) => {
        console.log(dataParams);
        if (res.code > 0) {
          this.$message.success(res.msg)
          return true
        } else {
          this.$message.error(res.msg)
          return false
        }
      })
    } else {
      this.$message.error('Check failure')
    }
  }

  public successForm(form: any) {
    console.log(form);

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
      [5, ['select', `CountryCode${this.index}`, this.CountryCode, "", true]],
      [6, ['select', `Country${this.index}`, this.Country, , "", true]],
      [7, ['select', `roundingFules${this.index}`, this.inputdata[0].roundingFules.options, "Default", true]]
    ])
    for (let index = 1; index < actions.size + 1; index++) {
      const action: any = actions.get(index);
      arr.push({
        type: action[0],
        decorator: action[1],
        options: action[2],
        initialValue: action[3] || "",
        showSearch: action[4],
      })
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
    console.log(this.responseDate);
    console.log(this.formOptions);
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
      console.log(data);
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
      this.inputdata[0].roundingFules.options = data[7].data.slice(1)
      // this.roundingRules = data[7].data.slice(1)
      this.addData();
    })()
    console.log('this.responseDate',this.responseDate);
    
    this.formOptions[0].initialValue = this.responseDate.accountName
    this.formOptions[1].initialValue = this.responseDate.configServiceName
    this.formOptions[2].initialValue = direction(this.responseDate.direction) //
    this.formOptions[3].initialValue = numberPlanStatus(this.numberPlanStatus) //
    this.formOptions[4].initialValue = moment(this.responseDate.beginDate)
    this.formOptions[5].initialValue = moment(this.responseDate.endDate)
    this.formOptions[6].initialValue = this.responseDate.numberPlanName
    // 当status为Active或者Future时，effective date和expired date可编辑，其他状态不可编辑
    let isStatus = this.formOptions[3].initialValue === 'Active' || this.formOptions[3].initialValue === 'Future';
    /* Effective date AND Expired date 禁止编辑
     this.$set(this.formOptions[4], "disabled", this.formOptions[3].initialValue === 'Expired')
     this.$set(this.formOptions[4], "disabled", !isStatus)
     this.$set(this.formOptions[5], "disabled", !isStatus)
    */

    this.responseDate.Status == 1;
    let date = new Date().getTime(); !!this.responseDate && this.responseDate.recordList.forEach((item: any, i: number) => {
      console.log(item);
      item.destinationType = item.destinationType == 1 ? item.destinationType = "Mobile" : "Fixed"
    })
    for (let index = 0; index < this.responseDate.recordList.length; index++) {
      const element = this.responseDate.recordList[index];
      let options = JSON.parse(JSON.stringify(this.inputdata))
      for (let i = 0; i < this.inputcolumns.length; i++) {
        let columns = this.inputcolumns[i]['dataIndex']
        let data = this.inputdata[index][columns] && this.inputdata[index][columns] || undefined
        if (data && data.decorator) {
          // console.log(data,'data');
          if (data.type === 'tags') {
            data.initialValue = element[data['decorator']] || []
          } else {
            data.initialValue = element[data['decorator']]
          }
        }
      }
    }
    console.log(this.Newdata);

  }

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

<style lang="scss">
.rulesSelect {
  margin-top: -60px;
  margin-left: 11px;
  // border:1px solid red;
  width: 460px;
  height: 46px;

  .ant-form-item-label {
    min-width: 200px;

    label {
      color: rgb(64, 120, 216);
      font-size: 16px;
    }
  }
}
</style><style lang="scss" scoped>
.Table-input-code {
  // padding: 10px;
  // background: #fff;
  // margin-top: 20px;
  // border-radius: 4px;
  // box-shadow: 0 2px 8px rgb(224, 224, 224);

  h1 {
    margin: 10px 0px;
    font-weight: 300;
    font-weight: 300;
    border-left: 5px solid sandybrown;
    padding-left: 5px;
  }
}
</style>
