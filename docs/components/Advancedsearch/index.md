# Advancedsearch组件
> - 高级搜索组件
> - Advancedsearch组件所在位置： `vue-ts-admin\src\views\Finance\components\Advancedsearch`
> - form-group组件所在位置： `vue-ts-admin\src\views\Finance\components\form-group`
> - form-group与Advancedsearch类似，只是样式不同，这里就不赘述了(只需注意getDecorator方法中的是item.decorator还是item.name)
## 简单使用
> 使用前先学习[antd form组件](https://www.antdv.com/components/form-cn/)

```html
<Advanced-search 
    ref="AdvancedSearch" :formoptions="searchFormOptions" :isChildName="true" allowClear @Submit="SearchOk"  @selectChange="searchSelectChange" @onBtnClick="onBtnClick"/>
```
```javascript
export interface searchOptionInterface {
    Tips: string; // 显示的标题
    name: string; // form表单的数据的名字(即发送给后台的字段)
    required: boolean; // 是否必填
    showSearch?: boolean; // 是否显示搜索
    type: string; // 类型
    filterOption?: boolean; 
    initialValue?: string | number; //默认值
    options?: {
        name: string,
        value: string | number
    }[]; // 下拉框选择数组
    style?:any; // v-bind:style
    span: number; // a-col的span
    labelCol?:number; // a-form-item的labelCol
    wrapperCol?:number; // a-form-item的wrapperCol
    rules:any[]; // v-decorator的rules 看antd文档
    format:string; // format 设置日期格式
    isCheckNumber?: boolean;  // 校验是否为数字
    // 以下请看 https://www.antdv.com/components/form-cn/#%E6%A0%A1%E9%AA%8C%E8%A7%84%E5%88%99
    pattern?: RegExp; // 正则表达式
    min?: number; // 最小长度
    max?: number; // 最大长度
    len?: number; // 长度
    message?: string; // 错误正则(pattern属性)匹配不成功后信息
    type?: string; // 校验类型
    [prop: string]: any;
}
```

```javascript
<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import {searchOptionInterface} from './interface'
@Component({
  components: {
    Table: () => import("@/views/Finance/components/Advancedsearch/index.vue"),
  }
})
export default class XXX extends Vue {
    private searchFormOptions: searchOptionInterface[] = [
        {
            Tips: 'Number plan',
            name: 'vendorClientNpName',
            required: false,
            type: 'select',
            showSearch: true,
            filterOption: true,
            span: 12,
            colSpan: 6,
            options: [],
        }
    ]

    // 获取/设置数据  目前使用ref
    // this.$refs.AdvancedSearch.getFieldsValue() 获取
    // this.$refs.AdvancedSearch.setFieldsValue() 设置
    
}

</script>
```
> ## Props
> *代表官方api,请先看官方文档


| prop                                            | 简介                 |  类型      | 默认值         |  必传 |
| :---------------------                          | :-----               | :------    | :----:        | :--: |
| formoptions                                     | 表单配置             |    Array     |   --         |  是  |
| span(a-col中的span*(prop))                      | 布局配置              |   Number    |   8          |  否  |
| offset(a-col中的offset*(prop))                  | 布局配置              |   Number    |   0          |  否  |
| labelCol(a-form-item中的labelCol*(prop))        | 布局配置              |   Object    | {span: 9}    |  否  |
| wrapperCol(a-form-item中的wrapperCol*(prop))    | 布局配置              |   Object    | {span: 9}    |  否  |
| collapseTags(select-input 组件)                 | 省略显示多选择下拉框的项(多条并为一条显示)       |   Boolean    |  false  |  否  |
| isNeedSelectChange                              | 是否需要在select框change时执行selectChange回调 |   Boolean    |  true   |  否  |
| needExport                                     | 是否需要显示导出按钮    |   Boolean   |  true       |  否  |
| needExport                                     | 是否需要增加按钮        |   Boolean   |  false      |  否  |
| searchText                                     | 搜索按钮显示名字        |   String    |  Generate   |  否  |
| allowClear                                     | 单选select 是否支持清除 |   Boolean   |  false       |  否  |
| multipleCheckBoxStyle                          | select-input组件的class传值 |   String   |  --       |  否  |
| isShowPlaceHolder                              | 是否显示占位符          |   Boolean   |  false       |  否  |
| showMaskPLan                                   | 多选框中是否需要悬浮显示已选数据       |   Boolean   |  false       |  否  |

> ## Emits
> 回调

| emit                                    | 简介                            |  参数                                    |  
| :-------------------------------------- | :-------------------------------| :-------------------------------------- |  
| Submit                                  | 点击搜索时的回调                 | Function(formObject:any)                 |
| selectChange                            | select框change的回调 name为formoptions，每一项的name | Function(formObject:any,name:string )    |
| monthPickerChange                       | 日期框change的回调               | Function(formObject:any,name:string )    |
| monthPickerChange                       | 日期框change的回调               | Function(formObject:any,name:string )    |
| btnClick                                | 点击的按钮                       | Function(name:string )                   |
