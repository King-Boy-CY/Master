# 项目要求
> 1. table数据删除/修改/新增后 要重新查询数据
> 2. 代码尽量精简，并写上注释
> 3. 代码使用ts写法

# 常见问题
## table问题
> 以下描述的组件为 `vue-ts-admin\src\views\Finance\components\Table`
### 1. table没有对齐. 
>  解决:请设置正确的scrollX值，一般目前设置的值不够大，太大则回出现每项空隙很大
### 2. table导出有样式的表格。 
> 解决：请使用 vue-ts-admin\src\assets\ts\xlsx-style

### 3. table出现勾选一个，导致每页的这项都会勾选上。
> 原因：数据中没有key或者key的值不是唯一,正确的为`[{name;"a",key:0},{name:"b",key:1}]` 

> 解决：1.数据里设置上唯一的key。 2.表格传入 parentKey: 'xxx', xxx为唯一数据的属性, 比如例子,`[{name;"a",key:0},{name:"b",key:1}]` 则写为
```html
<Table
    :columns="columns"
    :data="data"
    parentKey:="name"
/>
```

### 4. 若table中切换页数要把上一次选中清除。


```javascript
// 在切页回调中加入两行代码
this.clearSelectRowKeys();
this.onSelect({}, false, []);
```

## 下拉框问题
>  - options请严格使用 [{name:'aa',value:1},{name:'bb',value:2}]
>  - 出现有些值选中的值和传输的值不同 请看代码中 ```<template>```里 select里的options的循环,检查是否正确


## 样式问题

### 1. 修改ui库样式不生效
> 1. 检查.vue 文件的`<style></style>` 这对标签中是否增加了 `scoped`属性,如果有可以在文件里多写一对没scoped 的标签`style`标签，如下
```
<style scoped>
</style>
<style>
// 这里写修改ui库的样式的代码
</style>
```
> 2. 也可使用样式穿透，css 为 >>>, less和scss 为 deep 在选择器前面增加  scss也可使用 ::v-deep
```
<style scoped lang="scss">
/deep/ .xxxx {
}
::v-deep .xxxx {
}
</style>
```

### 2. 修改ui样式导致全局样式出错
> 1. 检查.vue 文件的`<style></style>` 这对标签中是否增加了 `scoped`属性
> 2. 在修改ui库的样式代码里增加父级class选择器
    


## Advancedsearch，table-input和form-group等含form表单的组件
### 1.表单中出现校验过一次后，修改渲染表单的数据(例如：Advancedsearch的formoptions(prop)) 却不再不再检验的问题
> 在校验的方法中多传一个参数`{ force: true }`
```javascript
this.form.validateFields({ force: true }, (error: any, values: any) => {
    if (!error) {
    }
});
```
## 其它组件
### 1. 页面使用了keep-alive，同一页面使用多个相同组件出现数据问题。 
> 请在组件上设置key属性

待完善