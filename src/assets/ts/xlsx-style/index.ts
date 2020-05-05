import xlsx from 'yxg-xlsx-style'
import { deepClone } from '@/assets/ts/index'
import moment from 'moment'
function saveAs(obj: any, fileName: string) {
    let dom: any = document.createElement("a");
    dom.download = fileName || "下载";
    dom.href = URL.createObjectURL(obj);
    dom.click();
    setTimeout(function () {
        URL.revokeObjectURL(obj);
    }, 100);
}

function getCharCol(n: number) {
    let temCol = '',
        s = '',
        m = 0
    while (n > 0) {
        m = n % 26 + 1
        s = String.fromCharCode(m + 64) + s
        n = (n - m) / 26
    }
    return s
}
function s2ab(s: any) {
    let buf: any
    if (typeof ArrayBuffer !== 'undefined') {
        buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
    } else {
        buf = new Array(s.length);
        for (var i = 0; i != s.length; ++i) buf[i] = s.charCodeAt(i) & 0xFF;
        return buf;
    }
}

/**
 * @param columns 表头  
 * columns里面如果有options 则会根据内容去匹配到对应的描述 例如 [{title:'xxx',dataIndex:'xxx',options:[{name:'active',value:1}]}]
 * columns里面如果有width 则会根据width去设置宽度
 * @param json json数据
 * @param fileName 导出文件名
 * @param sheetName 文件的sheet名
 * @param type 类型
 * 文章 https://www.cnblogs.com/yinxingen/p/11052184.html
 * xlxs-style 文档 https://github.com/yinxingen/yxg-xlsx-style
 */
export function downloadExcel(columns: any[], json: any[], fileName: string, sheetName?: string, type?: string) {
    const firstRow = deepClone(json[0]);
    let tmpData = deepClone(json);
    tmpData.unshift({});
    console.log('columns', columns);
    console.log('json', json);

    // 获取表头 title和数据key 的对应关系
    let headerTitleAndDataIndex: string[] = columns.reduce((prev: any, item: any, index: number) => {
        if (item.children) {
            prev = prev.concat(item.children.map((innerItem: any, i: number) => {
                return {
                    title: item.title + ' ' + innerItem.title,
                    dataIndex: innerItem.dataIndex,
                    width: innerItem.dataIndex,
                    options: innerItem.options,
                }
            }))
        } else if (item.title) {
            prev = prev.concat([item])
        }
        return prev
    }, []);
    let keyMap: string[] = headerTitleAndDataIndex.map((item: any) => item.title); //获取keys
    console.log('headerTitleAndDataIndex', headerTitleAndDataIndex);
    // console.log('keyMap', keyMap);

    for (const k in firstRow) {
        // console.log('k', k);
        if (k === 'detailList' && firstRow[k] instanceof Array) {
            console.log('firstRow[k]', firstRow[k]);
            for (const innerKey in firstRow[k][0]) {
                const find: any = headerTitleAndDataIndex.find((item: any) =>
                    item.dataIndex == innerKey
                )
                // console.log('innerKey', innerKey);
                tmpData[0][innerKey] = find ? find.title : k;
            }
        } else {
            const find: any = headerTitleAndDataIndex.find((item: any) => item.dataIndex == k)
            tmpData[0][k] = find ? find.title : k;
        }
    }
    // console.log('tmpData', tmpData);

    let data: any = []; // 用来保存转换好的json 
    const firstStyleObject: any = {
        font: { sz: 16 },
        fill: {
            bgColor: { indexed: 64 },
            fgColor: { rgb: "FFFF00" },
            // border: {
            //     top: "thin",
            //     bottom: "thin",
            //     left: "thin",
            //     right: "thin"
            // }
        },
        alignment: {
            horizontal: "center"
        }
    }
    const otherStyleObject: any = {
        font: { sz: 16 },
        alignment: {
            horizontal: "center",
            vertical: "center"
        },
    }
    // data["!merges"] = [{
    //     s: { c: 1, r: 0 },
    //     e: { c: 4, r: 0 }
    // }];
    let mergesArr: any = []
    // 处理数据 将数据合并
    let len: number = tmpData.length
    for (let i = 0; i < len; i++) {
        const item: any = tmpData[i]
        if (item.detailList) {
            // item.detailList 是数组
            let addArr = item.detailList.map((datailItem: any) => {
                const obj: any = Object.assign({}, item, datailItem)
                delete obj.detailList
                return obj
            })
            tmpData.splice(i, 1, ...addArr)
            len = len + addArr.length - 1
            // console.log('r', i);
            // console.log('len', addArr.length);
            for (const key in item) {
                if (key !== 'detailList') {
                    // 找到合并列的位置
                    let findIndex: number = headerTitleAndDataIndex.findIndex((item: any) => item.dataIndex == key)
                    // console.log('findIndex', findIndex);
                    addArr.length > 1 && mergesArr.push({
                        s: { c: findIndex, r: i },
                        e: { c: findIndex, r: i + addArr.length - 1 }
                    })
                }
            }
        }
        // console.log('index', i);
        // console.log('item', item);
    }
    // console.log('mergesArr', mergesArr);
    // console.log('tmpData', tmpData);

    tmpData.map((v: any, i: number) => keyMap.map((k: any, j: number) => {
        // 找到对应的dataIndex 用它找数据 i为0的时候是表头数据
        const find: any = headerTitleAndDataIndex.find((item: any) => item.title == k)
        // 内容
        let str: string = ''
        if (i === 0) { // 表头
            str = k
        } else if (find && find.options && find.options.length && v[find.dataIndex]) {
            // 有option的 需要替换为options 里数据对应的文字
            const desObj = find.options.find((innerItem: any) => innerItem.value == v[find.dataIndex])
            str = desObj && desObj.name || ''
        } else if (find && v[find.dataIndex]) {
            str = v[find.dataIndex]
        }
        return Object.assign({}, {
            v: str,
            position: (j > 25 ? getCharCol(j) : String.fromCharCode(65 + j)) + (i + 1)
        })
    })).reduce((prev: any, next: any, index: number) => prev.concat(next)).forEach((v: any) => data[v.position] = {
        v: v.v || '',
        s: /[A-Za-z]1$/.test(v.position) ? firstStyleObject : otherStyleObject // 设置xlsx单元格样式
    });
    const outputPos = Object.keys(data); //设置区域,比如表格从A1到D10
    // 合并单元格  s：start 合并开始位置, e：end合并结束位置, c:col 列  r： row 行
    // data["!merges"] = [{
    //     s: { c: 1, r: 0 },
    //     e: { c: 4, r: 0 }
    // }];
    data["!merges"] = mergesArr
    data['!cols'] = headerTitleAndDataIndex.map((item: any) => {
        return { wpx: +item.width || 150 }
    });
    const tmpWB = {
        SheetNames: [sheetName ? sheetName : 'sheet1'], //保存的表标题
        Sheets: {
            [sheetName ? sheetName : 'sheet1']: Object.assign({},
                data, //内容
                {
                    '!ref': outputPos[0] + ':' + outputPos[outputPos.length - 1] //设置填充区域
                })
        }
    };
    console.log('data', data);
    let tmpDown = new Blob([s2ab(xlsx.write(tmpWB,
        { bookType: (type == undefined ? 'xlsx' : type), bookSST: false, type: 'binary' }//这里的数据是用来定义导出的格式类型
    ))], {
        type: ""
    });
    const wopts: any = { bookType: 'xlsx', bookSST: true, type: 'binary', cellStyles: true };
    saveAs(tmpDown, fileName + '_' + moment().format("YYYYMMDDHHmmss") + '.' + (wopts.bookType == "biff2" ? "xls" : wopts.bookType));
}