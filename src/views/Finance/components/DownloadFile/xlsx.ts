import { saveAs } from 'file-saver'
import { downloadExcel } from './saveFile'

export const calcTableTd = (
  xLength: number,
  yLength: number,
  x: number,
  y: number
) => {
  /*
   * xLength:number    x轴的单元格长度,
   * yLength:number    y轴的单元格长度,
   * x:number      x轴的起始位置,从0开始计算
   * y:number      y轴的起始位置，从0开始计算
   */
  let arr: any = []
  for (let i = y; i < yLength + y; i++) {
    for (let j = x; j < xLength + x; j++) {
      arr.push([i, j])
    }
  }
  return arr
}

export const exportExcelTransferFormat = (
  data: any,
  PreviewColumns: any,
  head: any,
  styles?: any,
  sheetName?: string
) => {
  const jsonData = {
    sheetName: sheetName || '',
    head: head,
    data: data,
    styles: styles || [],
    merges: []
  }
  console.log(data, PreviewColumns, styles, sheetName)
  for (let i in data) {
    if (data[i].colMerge) {
      PreviewColumns.forEach((item: any, index: number) => {
        for (let j = 0; j < data[i].colMerge.length; j++) {
          const colArr: any = data[i].colMerge[j].split('-')
          if (item.dataIndex === colArr[0]) {
            let obj: {
              grid: number[][]
              merge: { col: number; row: number }
            } = {
              grid: [[data[i].key + 1, index + 1]],
              merge: {
                col: colArr.length,
                row: 1
              }
            }
            if (data[i].rowMerge) {
              for (let k = 0; k < data[i].rowMerge.length; k++) {
                if (item.dataIndex === data[i].rowMerge[k].colName) {
                  obj.merge.row = data[i].rowMerge[k].rowSpan
                }
              }
            }
            jsonData.merges.push(obj as never)
          }
        }
      })
    }
    // else if (data[i].rowMerge) {
    //   PreviewColumns.forEach((item: any, index: number) => {
    //     for (let j = 0; j < data[i].rowMerge.length; j++) {
    //       if (data[i].rowMerge[j].colName) {
    //         if (data[i].rowMerge[j].rowSpan > 0) {
    //           jsonData.merges.push({
    //             grid: [[data[i].key + 1, index + 1]],
    //             merge: {
    //               col: 1,
    //               row: data[i].rowMerge[j].rowSpan
    //             }
    //           })
    //         }
    //       }
    //     }
    //   })
    // }
  }
  downloadExcel(jsonData, jsonData.sheetName)
}
