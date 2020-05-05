import { saveAs } from 'file-saver'

let dataToExcel = ({ sheetName, head, data, styles, merges }: any) => {
  let excel = '<table cellspacing="0" rules="none" border="0"  frame="void">'
  let titleArr = Object.values(head)
  let dataKeys = Object.keys(head)
  if (titleArr.length && data.length) {
    //excel += `<tr>${titleArr.reduce((a, b) => `${a}<td>${b}</td>`, "")}</tr>`;
    data.forEach(
      (item: any, i: string | number) =>
        (excel += `<tr>${dataKeys.reduce(
          (a, b) => `${a}<td>${data[i][b]}</td>`,
          ''
        )}</tr>`)
    )
  }
  excel += '</table>'
  let styleList = excel.split('<td')
  styles.forEach(
    (element: {
      grid: { forEach: (arg0: (ele: any) => void) => void }
      style: { [s: string]: unknown } | ArrayLike<unknown>
    }) => {
      element.grid.forEach(ele => {
        let index = (ele[0] - 1) * titleArr.length + ele[1]
        let style = ''
        for (let [key, value] of Object.entries(element.style)) {
          style += `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}:${value};`
        }
        if (styleList[index]) {
          styleList[index] = styleList[index].includes('style')
            ? styleList[index].replace('="', `="${style}`)
            : ` style="${style}"${styleList[index]}`
        }
      })
    }
  )
  merges.forEach(
    (element: {
      grid: { forEach: (arg0: (ele: any) => void) => void }
      merge: { [s: string]: unknown } | ArrayLike<unknown>
    }) => {
      element.grid.forEach(ele => {
        let index = (ele[0] - 1) * titleArr.length + ele[1]
        let merge = ''
        for (let [key, value] of Object.entries(element.merge) as any) {
          if (key === 'col') {
            for (let i = 0; i < value - 1; i++) {
              let mark = index + i + 1
              if (styleList[mark]) {
                styleList[mark] = styleList[mark].includes('style')
                  ? styleList[mark].replace('="', `="display:none;`)
                  : ` style="display:none;"${styleList[mark]}`
              }
            }
          } else if (key === 'row') {
            for (let i = 0; i < value - 1; i++) {
              let mark = index + (ele[0] + i - 1) * titleArr.length
              if (styleList[mark]) {
                styleList[mark] = styleList[mark].includes('style')
                  ? styleList[mark].replace('="', `="display:none;`)
                  : ` style="display:none;"${styleList[mark]}`
              }
            }
          }
          merge += ` ${key}span="${value}"`
        }
        if (styleList[index]) {
          styleList[index] = styleList[index].replace(`>`, ` ${merge}>`)
        }
      })
    }
  )
  // 处理合并为0的情况
  styleList.forEach((item, index) => {
    if (item.includes('span="0"')) {
      styleList[index] = item.includes('style')
        ? item.replace('style="', `style="display:none;`)
        : (styleList[index] = item.replace('">', `" style="display:none;" >`))
    }
  })
  excel = styleList.join('<td').replace(/<td[^>]*display[^>]*>(.*?)<\/td>/g, '')
  return { sheetName, excel }
}

let generateExcel = ({ excel, sheetName }: any) => {
  var excelFile =
    "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:x='urn:schemas-microsoft-com:office:excel' xmlns='http://www.w3.org/TR/REC-html40'>"
  excelFile +=
    '<meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8">'
  excelFile += '<head>'
  excelFile += '<!--[if gte mso 9]>'
  excelFile += '<xml>'
  excelFile += '<x:ExcelWorkbook>'
  excelFile += '<x:ExcelWorksheets>'
  excelFile += '<x:ExcelWorksheet>'
  excelFile += '<x:Name>'
  excelFile += sheetName
  excelFile += '</x:Name>'
  excelFile += '<x:WorksheetOptions>'
  excelFile += '<x:DisplayGridlines/>'
  excelFile += '</x:WorksheetOptions>'
  excelFile += '</x:ExcelWorksheet>'
  excelFile += '</x:ExcelWorksheets>'
  excelFile += '</x:ExcelWorkbook>'
  excelFile += '</xml>'
  excelFile += '<![endif]-->'
  excelFile += '</head>'
  excelFile += '<body>'
  excelFile += excel
  excelFile += '</body>'
  excelFile += '</html>'
  return excelFile
}
/**
 * @description json 转 excel 并下载
 * @method downloadExcel
 * @param {object} dataJson 数据 json 对象（sheetName：表单名，head：表格头，data：表格数据，styles：表格样式）
 * @param {string} fileName 下载文件的名字
 */
let downloadExcel = (
  { sheetName = 'sheet', head = {}, data = [], styles = [], merges = [] }: any,
  fileName?: string
) => {
  let dataJson = {
    sheetName,
    head,
    data,
    styles,
    merges
  }
  let excelContent = dataToExcel(dataJson)
  let excelName = (fileName || dataJson.sheetName) + '.xls'
  let excel = generateExcel(excelContent)
  saveAs(
    new Blob([excel], { type: 'application/vnd.ms-excel;charset=utf-8' }),
    excelName
  )
}

/**
* @description 下载本地（public）静态文件
* @method downloadLocalFiles
* @param {string} url 文件地址，如：img/icons/android-chrome-192x192.png
* @param {string} fileName 下载文件的名字
*/

let downloadLocalFiles = (url: string = '', fileName: string = '') => {
  let length: number = (location as any).href.split('/').length - 4
  let name: string = fileName || url.split('/').reverse()[0]
  let arr: string[] = Array.from({ length }).map(() => '../')
  saveAs(arr.join('') + url, name)
  }

export  {downloadExcel,downloadLocalFiles}

