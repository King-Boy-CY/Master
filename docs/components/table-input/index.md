# Advancedsearch组件
> - table-input 输入框组件 包括增加删除行数
> - 组件所在位置： vue-ts-admin\src\views\Finance\components\table-input 注意和vue-ts-admin\src\common\TableInput组件不同
> - 这里也需要注意getDecorator方法中的 是item.decorator 不过我们inputcolumns 设置的是每项的dataIndex
## 简单使用
> 使用前先学习[antd form组件](https://www.antdv.com/components/form-cn/)

```html
<Table-input
    :inputcolumns="inputcolumns"
    :initData="initData"
    ref="tableInput"
/>
```
### inputcolumns
```javascript
// table-input inputcolumns
export interface tableInputcolumnInterface {
    title:string;
    required?: boolean;
    type: string;
    options?: {
        name: string;
        value: number | string;
    }[] | string[];
    initialValue?: any;
    disabled?: boolean;
    rules?: any[]; // 看antd文档
    isCheckNumber?: boolean;
    // 以下请看 https://www.antdv.com/components/form-cn/#%E6%A0%A1%E9%AA%8C%E8%A7%84%E5%88%99
    pattern?: RegExp; // 正则表达式
    min?: number; // 最小长度
    max?: number; // 最大长度
    len?: number; // 长度
    message?: string; // 错误正则(pattern属性)匹配不成功后信息
    type?: string; // 校验类型
    [prop: string]: any;
}

export interface initDataInterface {
    [prop: string]: any;
}
```

```javascript
<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { tableInputcolumnInterface,initDataInterface } from './interface'
@Component({
  components: {
    TableInput: () => import("@/views/Finance/components/table-input/index.vue")
  }
})
export default class XXX extends Vue {
    // 数据的key与inputcolumns的dataIndex对应
    private initData: Array<initDataInterface> = [
        {
            Destination:['a','b','c'],
            Calls：'2'
        },
        {
            Destination:['d','e'],
            Calls：'3'
        }
    ]
    private inputcolumns: tableInputcolumnInterface[] = [
        {
            title: "No.",
            dataIndex: "No",
            key: "No",
        },
        {
            title: "Destination",
            dataIndex: "Destination",
            type: "tabs",
            require: true,
            width: "200px",
            initialValue: [],
            options: ['a','b','c','d']
        },
        {
            title: "Calls",
            dataIndex: "Calls",
            type: "input",
            require: true,
            rules: [
                {
                validator: (rule: any, value: any, callback: any) => {
                    if (!value) {
                        callback();
                    }
                    const pattern: RegExp = new RegExp(numberReg, "g");
                    if (!pattern.test(value)) {
                        callback("Calls is out of specification");
                    } 
                    callback();
                }
                }
            ]
        },
    ]

    // 获取/设置数据 
    // this.$refs.tableInput.getData() 获取数据
    // initData 设置数据
    
}

</script>
```

> ## Props
> *代表官方api,请先看官方文档

| prop                             | 简介                 |  类型                              | 默认值   |  必传 |
| :---------------------           | :-----               | :------                            | :----: | :--: |
| [inputcolumns](#inputcolumns)    | 看例子               | Array< tableInputcolumnInterface > |   --    |  是   |
| [initData](#inputcolumns)        | 看例子               | Array< initDataInterface >         |   --    |  否   |
| border                           | 是否显示边框          | Boolean                            |   --    |  否   |
| Check                            | 是否需要校验按钮      | Boolean                            |   true  |  否   |
| newAdd                           | 是否需要新增按钮      | Boolean                            |   true  |  否   |
| align                            | 表格对齐方式:left,center,right    | String   |   center  |  否   |
| btnDisabled                      | 是否禁止按钮点击      | Boolean   |   false  |  否   |
| isShowPlaceHolder                | 是否显示PlaceHolder  | Boolean   |   false  |  否   |
| collapseTags                     | 省略显示多选择下拉框的项(多条并为一条显示)  | Boolean   |   false  |  否   |
| multipleCheckBoxStyle            | select-input组件的class传值 |   String   |  --       |  否  |


## Emits
> 回调

| emit                       | 简介                            |  参数                                                                |  
| :--------------------------| :-------------------------------| :---------------------------------------------------------           |  
| success                    | 校验成功触发的回调               | Function(data:Array< initDataInterface > )                           |
| select                     | selectChange的回调              | Function(newVal:string,dataIndex:string,index:number,colIndex:number)|
| addChange                  | 新增后通知回调                   | --                                                                    |
| deleteChange               | 删除后通知回调                   | Function(data:Array< initDataInterface >)                             |
| inputChange                | 输入框change回调                 | Function(data:Array< initDataInterface >)                             |

