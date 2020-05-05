import {
    downloadExcel
} from "@/views/Finance/components/DownloadFile/saveFile"
import moment from 'moment'

//第一个参数表头数据
//第二个参数是搜索的数据
//第三条就是标题名字
//第四个参数是sheet
export const  onSelectClick = function(column:any,searchdata:any,title:string='',name:string = '') {
    if (!searchdata.length) {
        return false;
    }
    let fieName = `${title}_` + moment().format("YYYYMMDDHHmmss");
    let columns: Object = {};
    column.forEach(res => (columns[res.title] = res.title));
    let data = searchdata;
    let new_Data: any = [];
    let grid: any = [];
    let stylesArr: any = [];
    data.forEach((item, index) => {
        new_Data.push({});
        grid.push([]);
        stylesArr.push({
            grid: [],
            style: {},
        }); 
        column.forEach((cloum: any, key) => {
            grid[index].push([index + 1, key + 1]);
            stylesArr[index]["grid"].push([index + 1, key + 1]);
            if (index === 0) {
                stylesArr[index]["style"] = {
                    backgroundColor: "yellow",
                    //width: "150px",
                    border:"thin solid black",
                    font: "message-box",
                    textAlign: "center",
                    fontFamily:"Times New Roman",
                    fontSize:"16px"
                };
            } else {
                stylesArr[index]["style"] = {
                    border:"thin solid black",
                    // borderCollapse: 'collapse',
                    verticalAlign:"middle",
                    fontFamily:"Arial Unicode MS",
                    textAlign: "center",
                };
            }
            new_Data[index][cloum.title] = item[cloum.dataIndex];
            console.log(item,index);    
        });
    });
    stylesArr.push(JSON.parse(JSON.stringify(stylesArr[stylesArr.length-1])));
        stylesArr[stylesArr.length-1].grid.forEach((item:any)=>{        
            item[0] = stylesArr.length;
    })
    const jsonData = {
        sheetName: name,
        head:{...columns},
         data: [{...columns},...new_Data],
        styles: stylesArr,
        // merges: []
    };
    console.log(jsonData, "jsonData");
    console.log("stylesArr", stylesArr);

    downloadExcel(jsonData, fieName);
}
