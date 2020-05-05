import { Vue, Component } from 'vue-property-decorator'
import moment from 'moment'
import '../js/prototype.js'
import xlsx from 'xlsx'

declare module 'vue/types/vue' {
  interface Vue {
    // tmpDown: any
    createStatementNumber(): any
    randomNum(min: number, max: number): any

    openDownload(url: string, saveName: string): void

    // downloadExl(json: any, type: any): void

    s2ab(s: any): any

    // getCharCol(n: any): any

    sheet2blob(sheet: any, sheetName?: any): any
    getObjectURL(file: any): any

    openDownloadDialog(url: any, saveName: any): void

    renderContent(value: any, row: any, index: any, dataIndex: any, options?: any): any

    commomBaseInfoPickerChange(formData: any, newData: any, selectName: any, dom: any, currentName?: string): void

    commomBaseInfoSelectChange(formData: any, baseInfoFormOptions: any, dom: any, currentName?: string): void
  }
}

/**
 * mixins
 */
@Component
export default class FinanceMixin extends Vue {

  createStatementNumber(): any {
    return moment(new Date().getTime()).format('YYYYMMDDHHmmss') + this.randomNum(0, 9999).toString().padStart(4, '0')
  }

  getObjectURL(file): any {
    let url: any = null;
    const _window: any = window
    if (_window.createObjectURL != undefined) { // basic
        url = _window.createObjectURL(file);
    } else if (_window.webkitURL != undefined) { // webkit or chrome
        try {
          url = _window.webkitURL.createObjectURL(file);            
        } catch (error) {
          
        }
    } else if (_window.URL != undefined) { // mozilla(firefox)
      try {
        url = _window.URL.createObjectURL(file);
      } catch (error) {
        
      }
    }
    return url;
  }

  renderContent(value: any, row: any, index: any, dataIndex: any, options?: any) {
    const obj = {
      children: value,
      attrs: {
        colSpan: 1,
        rowSpan: 1
      },
    };
    if (row.colMerge) {
      let firstArr: any = []
      let otherArr: any = []
      for (let i = 0; i < row.colMerge.length; i++) {
        const colArr = row.colMerge[i].split('-')
        firstArr.push({ name: colArr[0], len: colArr.length })
        otherArr.push(colArr.slice(1))
      }
      otherArr = [].concat(...otherArr)
      // otherArr = Array.prototype.concat.call([],...otherArr)
      const find1: any = firstArr.find((item: any) => item.name === dataIndex)
      if (find1) {
        obj.attrs.colSpan = +find1.len;
      } else {
        const find2: any = otherArr.find((item: any) => item === dataIndex)
        if (find2) {
          obj.attrs.colSpan = 0;
        }
      }
    }

    if (row.rowMerge && row.rowMerge.length) {
      const find: any = row.rowMerge.find((item: any) => item.colName === dataIndex)
      if (find) {
        obj.attrs.rowSpan = +find.rowSpan;
      }
    }

    if (options && options instanceof Array) {
      // obj.children = options[value]
      const find = options.find((item: any) => item.value === value)
      if (find) {
        obj.children = find.name
      }
    }
    return obj;
  }

  randomNum(min: number, max: number): any {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  openDownload(url: any, saveName: string): void {
    const _window: any = window
    if (!/http/.test(url)) {
      url = _window.HOST + url
    }
    if (typeof url == 'object' && url instanceof Blob) {
      url = URL.createObjectURL(url)
    }
    let aLink = document.createElement('a')
    aLink.href = url
    aLink.download = saveName || ''
    let event
    if (_window.MouseEvent) {
      event = new MouseEvent('click')
    } else {
      event = document.createEvent('MouseEvents')
      event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null
      )
    }
    aLink.dispatchEvent(event)
  }

  // tmpDown: any; //导出的二进制对象
  /*downloadExl(json: any, type: any): any {
    let tmpdata = json[0];
    json.unshift({});
    let keyMap: any = []; //获取keys
    //keyMap =Object.keys(json[0]);
    for (let k in tmpdata) {
      keyMap.push(k);
      json[0][k] = k;
    }
    tmpdata = [];//用来保存转换好的json
    json.map((v: any, i: any) => keyMap.map((k: any, j: any) => Object.assign({}, {
      v: v[k],
      position: (j > 25 ? this.getCharCol(j) : String.fromCharCode(65 + j)) + (i + 1)
    }))).reduce((prev: any, next: any) => prev.concat(next)).forEach((v: any, i: any) => tmpdata[v.position] = {
      v: v.v
    });
    let outputPos = Object.keys(tmpdata); //设置区域,比如表格从A1到D10
    let tmpWB = {
      SheetNames: ['mySheet'], //保存的表标题
      Sheets: {
        'mySheet': Object.assign({},
          tmpdata, //内容
          {
            '!ref': outputPos[0] + ':' + outputPos[outputPos.length - 1] //设置填充区域
          })
      }
    };
    this.tmpDown = new Blob([this.s2ab(xlsx.write(tmpWB,
      {bookType: (type == undefined ? 'xlsx' : type), bookSST: false, type: 'binary'}//这里的数据是用来定义导出的格式类型
    ))], {
      type: ""
    }); //创建二进制对象写入转换好的字节流
    let href = URL.createObjectURL(this.tmpDown); //创建对象超链接
    document.getElementById("hf").href = href; //绑定a标签
    document.getElementById("hf").click(); //模拟点击实现下载
    setTimeout(function () { //延时释放
      URL.revokeObjectURL(this.tmpDown); //用URL.revokeObjectURL()来释放这个object URL
    }, 100);
  }*/

  // 将指定的自然数转换为26进制表示。映射关系：[0-25] -> [A-Z]。
  /* getCharCol(n: any): any {
     let temCol = '',
       s = '',
       m = 0
     while (n > 0) {
       m = n % 26 + 1
       s = String.fromCharCode(m + 64) + s
       n = (n - m) / 26
     }
     return s
   }*/

  s2ab(s: any): any { //字符串转字符流
    let buf = new ArrayBuffer(s.length);
    let view = new Uint8Array(buf);
    for (let i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
  }

  sheet2blob(sheet: any, sheetName?: any): any {
    sheetName = sheetName || 'sheet1';
    let workbook: any = {
      SheetNames: [sheetName],
      Sheets: {}
    };
    workbook.Sheets[sheetName] = sheet; // 生成excel的配置项

    const wopts: any = {
      bookType: 'xlsx', // 要生成的文件类型
      bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
      type: 'binary'
    };
    const wbout: any = xlsx.write(workbook, wopts);
    const blob: any = new Blob([this.s2ab(wbout)], {
      type: "application/octet-stream"
    });
    return blob;
  }

  openDownloadDialog(url: any, saveName: any): void {
    if (typeof url == 'object' && url instanceof Blob) {
      url = URL.createObjectURL(url); // 创建blob地址
    }
    const _window: any = window
    let aLink: any = document.createElement('a');
    aLink.href = url;
    aLink.download = saveName || ''; // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
    let event: any;
    if (_window.MouseEvent) event = new MouseEvent('click');
    else {
      event = document.createEvent('MouseEvents');
      event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    }
    aLink.dispatchEvent(event);
  }

  // base日期选择框回调 参数:(数据,覆盖前面的数据,点击按钮,dom)   作用:设置Month和benginDate endDate联动
  commomBaseInfoPickerChange(formData: any, newData: any = {}, selectName: any, dom: any = this.$refs.baseInfoFormGroup, currentName: string): void {
    let startTime: any,
      endTime: any,
      tempTime: any,
      setData: any = {
        BeginDate: formData['BeginDate'],
        EndDate: formData['EndDate'],
        Cycle: formData['Cycle'] ? formData['Cycle'] : undefined
      }
    if (formData['Month']) {
      // .format('YYYY-MM-DD')
      startTime = moment(formData['Month']).startOf('month')
      endTime = moment(formData['Month']).endOf('month')
      setData.Cycle = undefined
      if (dom.formoptions[5].activeAddDate) {
        // BeginDate =  startTime?moment(startTime);
        // EndDate = moment(new Date(tempTime + '-01').getTime() - 86400000);
        if (currentName === 'Month' && !moment(formData['BeginDate']).isBetween(startTime, endTime)) {
          setData.BeginDate = startTime
        }
        if (currentName === 'Month' && !moment(formData['EndDate']).isBetween(startTime, endTime)) {
          setData.EndDate = endTime
        }
      } else {
        setData.BeginDate = startTime || undefined;
        setData.EndDate = endTime || undefined;
      }
      console.log('setData', setData);
    }
    dom.setFieldsValue(Object.assign({}, newData, setData))
  }

  commomBaseInfoSelectChange(formData: any, baseInfoFormOptions: any, dom: any = this.$refs.baseInfoFormGroup, currentName: string): void {
    // 当ChargeType在操作时，BillingType需要清空
    if (currentName === 'ChargeType') {
      dom.setFieldsValue({
        BillingType:undefined
      })
    }
    if (formData['ChargeType'] === 1) {
      baseInfoFormOptions.forEach((ele: any) => {        
        if (ele.decorator === 'BillingType' || ele.name === 'BillingType') {
          ele.options[0].disabled = false;
          ele.options[1].disabled = true;
          ele.options[2].disabled = true;
        }
        if (ele.decorator === 'Cycle' || ele.name === 'Cycle') {          
          ele.disabled = true;
          ele.required = false;
        }
        if (ele.decorator === 'Month' || ele.name === 'Month') {
          ele.disabled = false;
        }
      })
      // console.log(moment(formData['Month']).startOf('month'));
      
      dom.setFieldsValue({
        Cycle: undefined,
        BeginDate: formData['Month'] ? moment(formData['Month']).startOf('month') : undefined,
        EndDate: formData['Month'] ? moment(formData['Month']).endOf('month') : undefined
      })
    } else if (formData['ChargeType'] === 2) {
      baseInfoFormOptions.forEach((ele: any) => {
        if (ele.decorator === 'BillingType' || ele.name === 'BillingType') {
          ele.options[0].disabled = true;
          ele.options[1].disabled = false;
          ele.options[2].disabled = false;
        }
        if (!formData['Cycle']&&ele.decorator === 'Month' || ele.name === 'Month' && currentName === 'ChargeType') {
          ele.disabled = true;
          ele.required = false;
          dom.setFieldsValue({
            Month: undefined,
            BeginDate: undefined,
            EndDate: undefined
          })
        }
        if (currentName === 'Account' || currentName === 'Service' || currentName === 'Direction') {
          dom.setFieldsValue({
            Cycle: undefined,
            BeginDate: undefined,
            EndDate: undefined
          })
        } else if (ele.decorator === 'Cycle' || ele.name === 'Cycle') {
          ele.disabled = false;
          // console.log(formData['Cycle'],ele.options);
          
          if (formData['Cycle']) {
            let find: any = ele.options.find((element: any) => element.name === formData['Cycle']);
            dom.setFieldsValue({
              BeginDate: moment(find.BeginDate),
              EndDate: moment(find.EndDate)
            })
          }
        }
      })
    }




    // billing type 为1 2 置灰 Cycle 为 3置灰 Month
    // // 如果没有 billing type 则使用 ChargeType 判断
    // const billingType = formData['BillingType'] == 1 || formData['BillingType'] == 2
    // const isHubbing = formData['BillingType'] ? billingType : formData['ChargeType'] == 1
    // baseInfoFormOptions.forEach((item: any) => {
    //   if (item.decorator === 'Month') {
    //     item.disabled = !isHubbing
    //     item.required = isHubbing
    //   } else if (item.decorator === 'Cycle') {
    //     item.disabled = isHubbing
    //     item.required = !isHubbing
    //   } else if (item.decorator === 'BillingType') {
    //     item.options.forEach((innerItem: any, index: number) => {
    //       innerItem.disabled = false
    //       if (formData['ChargeType'] == 1 && (index === 1 || index === 2)) {
    //         innerItem.disabled = true
    //       } else if (formData['ChargeType'] == 2 && index === 0) {
    //         innerItem.disabled = true
    //       }
    //       // 清除已经选上的但是目前被禁用 值
    //       if (formData['BillingType'] == index + 1 && innerItem.disabled) {
    //         changeData['BillingType'] = undefined
    //       }
    //     })
    //   }
    // })
    // if (formData['ChargeType'] == 1) {
    //   changeData['Cycle'] = undefined
    //   // this.baseInfoPickerChange(formData, changeData)
    //   this.commomBaseInfoPickerChange(formData, changeData, undefined, dom,currentName)
    // } else {
    //   changeData['Month'] = undefined
    //   let find: any
    //   if (formData['Cycle']) {
    //     find = CycleOptions.find((item: any) => item.name === formData['Cycle'])
    //   }
    //   if (baseInfoFormOptions[4]&&baseInfoFormOptions[4].activeAddDate) {

    //       if (currentName ==='Cycle') {
    //         changeData.BeginDate = moment(find.BeginDate)
    //         changeData.EndDate = moment(find.EndDate)
    //       }
    //   }else{
    //     changeData.BeginDate =  find ? moment(find.BeginDate): undefined;
    //     changeData.EndDate =  find ? moment(find.EndDate): undefined;
    //   }
    // console.log('beginDate1111111111');
    //   dom.setFieldsValue(Object.assign({}, formData, changeData, {
    //     'Month': undefined
    //   }))

    // }
  }
}
