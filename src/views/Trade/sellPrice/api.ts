import { getRefInDestinationName, getCountryName, getDetailAccounts, getDetailService } from '@/api/index'
// import { getExpData } from '../sellPrice/method'
import { getExpData } from '@/assets/ts/index'
import { expExcelType, getSellPricePageListType, pageFunType } from './type'
import { recodeConfig } from "@/assets/ts/config";
import moment from 'moment'
export const ExpData = function (formData: any) {
  setTimeout(() => {
    let sedFied = ['beginDate', 'endDate', { direction: 1 }];
    getExpData({
      data: formData,
      fns: [getDetailAccounts, getRefInDestinationName, getCountryName, getDetailService],
      field: [undefined, sedFied, sedFied, undefined],
      success:function(data){
          console.log('data',data);
      },
      error:function(err){
          console.log('err',err);
      }
    });
  }, 0);
}
function openDownloads(url: any, saveName: string): void {
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
  let event:any
  if (_window.MouseEvent) {
    event = new MouseEvent('click')
  } else {
    event = document.createEvent('MouseEvents')
    event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null
    )
  }
  aLink.dispatchEvent(event)
}
export const expExcel = async function ({ fn, data, expModule }: expExcelType) {
  let fieName = (expModule || '') + '_' + moment().format('YYYYMMDDHHmmss')
  await fn(data).then((res: any) => {
    let blob = new Blob([res], { type: "application/xlsx" });
    let url = window.URL.createObjectURL(blob);
    openDownloads(url, fieName + '.xlsx');
  })
}

export const pageFun = async function (params: getSellPricePageListType) {
  let { data, currPage, pageSize, fn, backPaginationObj, selectedBtn } = params;
  if (currPage && currPage) {
    data["currPage"] = currPage;
    data["pageSize"] = pageSize;
  }
  let recodeData: pageFunType = {
    data: [], //res.data.list
    backPage: {} //res.data.page,cuur,totalPage pageSize
  }
  await fn(data).then((res: recodeConfig) => {
    const { list, pageNum, pageSize, total } = res.data;
    backPaginationObj = {
      currPage: pageNum,
      pageSize,
      total,
      pageSizeOptions: ["10", "20", "50", "100"],
      align: 'left'
    };
    recodeData['data'] = list;
    recodeData['backPage'] = backPaginationObj;
    if (list.length) {
      selectedBtn[0]["disabled"] = false;
    }
  });
  return recodeData
}