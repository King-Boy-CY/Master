<template>
<a-form :form="form">
    <section class="code-box-demo error-exclude">
        <!-- <div style="overflow: auto hidden"> -->
        <el-scrollbar>
            <table class="gridtable" :class="{ border }" :style="{ textAlign: align}">
                <thead>
                    <tr>
                        <th v-for="(item,key) in inputcolumns" :key="key">
                            <span :style="{color: item.require ? 'red' : ''}" v-show="item.require">*</span>
                            {{item.title}}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item,key) in Arr" :key="item.key">
                        <td v-for="(it,index) in item.name" :key="index">
                            <a-form-item>
                                <span v-if=" index <= 0 ">{{ key + 1}}</span>
                            </a-form-item>

                            <template v-if="it.children">
                                <div style="display:flex;">
                                    <a-form-item v-for="(kn,o) in it.children" :key="o" :label="kn.slotName" :required="false" :colon="false" :labelCol="{span:item.labelCol || kn.slotName ? 6 : 0,pull:item.pull || 2,push:item.push || 0}" :wrapperCol="{span:item.wrapperCol || 18}" :style="{ width: it.width }">
                                        <a-select :style="{ width: kn.width || 100+'%'}" :placeholder="it.defaultValue = ''" showArrow :showSearch="kn.showSearch" v-if="kn.type === 'select'" :allowClear="!!kn.allowClear || kn.allowClear===undefined" :disabled="kn.disabled" v-decorator="[
                                    `${kn.decorator}`,
                                    {
                                      rules: [{
                                        required:  kn.require,
                                        message: `${inputcolumns[index].title || inputcolumns[index].dataIndex || kn.decorator} field should be no-null`
                                      },...(kn.rules && kn.rules instanceof Array ? kn.rules : [])],
                                      initialValue: kn.initialValue || undefined
                                    }
                                  ]" @change="handleChange($event, kn.decorator, undefined, key,index)">
                                            <!-- @click="handleChange(itn.name || itn, it.decorator, index, key)" -->
                                            <a-select-option :disabled="itn.disabled" v-for="(itn,index) in kn.options" :value="itn.name || itn" :key="index">{{itn.name || itn}}</a-select-option>
                                        </a-select>
                                        <a-time-picker :placeholder="it.defaultValue || ''" :defaultOpenValue="moment('00:00:00', 'HH:mm:ss')" :style="{ width: kn.width || 100+'%'}" v-else-if="kn.type === 'timeFrom' && !kn.model" :disabled="kn.disabled" v-decorator="[
                                  `${kn.decorator}`,
                                  {
                                    rules: [{
                                      required: kn.require,
                                      message: `${inputcolumns[index].title || inputcolumns[index].dataIndex || kn.decorator} field should be no-null`
                                    },...(kn.rules && kn.rules instanceof Array ? kn.rules : [])],
                                     initialValue:kn.initialValue && moment(kn.initialValue, 'HH:mm:ss') || undefined
                                  }
                                ]"></a-time-picker>
                                        <a-select :style="{ width: kn.width || 100+'%'}" allowClear mode="tags" v-decorator="[
                                  `${kn.decorator}`,
                                  {
                                    rules: [{
                                      required:  kn.require,
                                      message: `${inputcolumns[index].title || inputcolumns[index].dataIndex || kn.decorator} field should be no-null`
                                    },...(kn.rules && kn.rules instanceof Array ? kn.rules : [])],
                                    initialValue: kn.model || kn.initialValue
                                  }]" @change="handleChange($event, kn.decorator, undefined, key,index)" v-else-if="kn.type === 'tags'">
                                            <a-select-option v-for="(itn,index) in kn.options" :value="itn.name || itn" :key="index">{{itn.name || itn}}</a-select-option>
                                        </a-select>
                                        <!-- 支持删除，单选 ，下拉搜索 -->
                                        <el-select :multiple-limit="1" filterable multiple v-else-if="kn.type === 'eltags'" allow-create :disabled="kn.disabled" :placeholder="inputcolumns[index].title || inputcolumns[index].dataIndex || kn.decorator" @change="handleChange" style="width:100%;height:50%,magin-top:10%" :style="{ width: kn.width || 100+'%'}" v-decorator="[
                                        `${kn.Tips}`,
                                        {
                                        rules: [{
                                            required: kn.required,
                                            message: `${kn.name} field should be no-null`,
                                        }],

                                        initialValue:kn.initialValue || undefined
                                        }
                                    ]">
                                            <el-option :value="itn" v-for="(itn,key) in kn.options" :key="key">{{itn}}</el-option>
                                        </el-select>
                                        <a-date-picker showTime format="YYYY-MM-DD HH:mm:ss" :style="{ width: kn.width || 100+'%'}" v-else-if="kn.type === 'picker' && !kn.model" :disabled="kn.disabled" v-decorator="[
                                  `${kn.decorator}`,
                                  {
                                    rules: [{
                                      required:  kn.require,
                                      message: `${inputcolumns[index].title || inputcolumns[index].dataIndex || kn.decorator} field should be no-null`
                                    },...(kn.rules && kn.rules instanceof Array ? kn.rules : [])],
                                    initialValue: kn.model || kn.initialValue
                                  }
                                ]"></a-date-picker>
                                        <a-input :style="{ width: kn.width || 100+'%'}" :maxLength="kn.config&&Object.keys(kn.config).length?kn.config.maxLength:undefined" @change="testChange" @blur="inputBlur" :placeholder="isPlaceholder?(inputcolumns[index].title || inputcolumns[index].dataIndex || it.decorator):''" :disabled="it.disabled" v-else-if="it.type === 'input' " v-decorator="[
                                    `${kn.decorator}`,
                                    {
                                      rules: [{
                                        required: kn.require,
                                        message: `${inputcolumns[index].title || inputcolumns[index].dataIndex || kn.decorator} field should be no-null`
                                      },...(kn.rules && kn.rules instanceof Array ? kn.rules : [])],
                                      initialValue: kn.model || kn.initialValue
                                  }
                                ]" />
                                    </a-form-item>
                                </div>
                            </template>
                            <a-form-item v-else :style="{ width: it.width }">
                                <a-select showArrow :showSearch="it.showSearch" v-if="it.type === 'select'" :style="{minWidth:'10px'}" :allowClear="!!it.allowClear || it.allowClear===undefined" :disabled="it.disabled" v-decorator="[
                                 `${it.decorator}`,
                                    {
                                      rules: [{
                                        required:  it.require,
                                        message: `${inputcolumns[index].title || inputcolumns[index].dataIndex || it.decorator} field should be no-null`
                                      },...(it.rules && it.rules instanceof Array ? it.rules : [])],
                                      initialValue: it.initialValue || undefined
                                    }
                                  ]" @change="handleChange($event, it.decorator, undefined, key,index)">
                                    <!-- @click="handleChange(itn.name || itn, it.decorator, index, key)" -->
                                    <a-select-option :disabled="itn.disabled" v-for="(itn,index) in it.options" :value="itn.name || itn" :key="index">{{itn.name || itn}}</a-select-option>
                                </a-select>
                                <a-time-picker :placeholder="it.defaultValue = ''" v-else-if="it.type === 'timeFrom' && !it.model" :disabled="it.disabled" v-decorator="[
                                  `${it.decorator}`,
                                  {
                                    rules: [{
                                      required:  it.require,
                                      message: `${inputcolumns[index].title || inputcolumns[index].dataIndex || it.decorator} field should be no-null`
                                    },...(it.rules && it.rules instanceof Array ? it.rules : [])],
                                    initialValue: kn.initialValue && moment(kn.initialValue, 'HH:mm:ss') || undefined
                                  }
                                ]"></a-time-picker>
                                <a-select allowClear mode="tags" :placeholder="isPlaceholder?(inputcolumns[index].title || inputcolumns[index].dataIndex || it.decorator):''" v-decorator="[
                                  `${it.decorator}`,
                                  {
                                    rules: [{
                                      required:  it.require,
                                      message: `${inputcolumns[index].title || inputcolumns[index].dataIndex || it.decorator} field should be no-null`
                                    },...(it.rules && it.rules instanceof Array ? it.rules : [])],
                                    initialValue: it.model || it.initialValue
                                  }]" @change="handleChange($event, it.decorator, undefined, key,index)" v-else-if="it.type === 'tags'">
                                    <a-select-option v-for="(itn,index) in it.options" :value="itn.name || itn" :key="index">{{itn.name || itn}}</a-select-option>
                                </a-select>
                                <!-- :getPopupContainer="triggerNode => triggerNode.parentNode" -->
                                <!-- 支持删除，单选 ，下拉搜索 -->
                                <el-select :multiple-limit="1" filterable multiple v-else-if="it.type === 'eltags'" allow-create :disabled="it.disabled" :placeholder="inputcolumns[index].title || inputcolumns[index].dataIndex || it.decorator" @change="handleChange" style="width:100%;height:50%,magin-top:10%" v-decorator="[
                                `${it.Tips}`,
                                {
                                rules: [{
                                    required: it.required,
                                    message: `${it.name} field should be no-null`,
                                }],

                                initialValue:it.initialValue || undefined
                                }
                            ]">
                                    <el-option :value="itn" v-for="(itn,key) in it.options" :key="key">{{itn}}</el-option>
                                </el-select>
                                <!--  -->
                                <a-date-picker showTime format="YYYY-MM-DD HH:mm:ss" style="width:100%" v-else-if="it.type === 'picker' && !it.model" :disabled="it.disabled" v-decorator="[
                                  `${it.decorator}`,
                                  {
                                    rules: [{
                                      required:  it.require,
                                      message: `${inputcolumns[index].title || inputcolumns[index].dataIndex || it.decorator} field should be no-null`
                                    },...(it.rules && it.rules instanceof Array ? it.rules : [])],
                                    initialValue: it.model || it.initialValue
                                  }
                                ]"></a-date-picker>
                                <!--  -->
                                <a-date-picker showTime v-else-if="it.type === 'rangerpicker' && !it.model" :disabled="it.disabled" v-decorator="[
                                  `${it.decorator}`,
                                  {
                                    rules: [{
                                      required:  it.require,
                                      message: `${inputcolumns[index].title || inputcolumns[index].dataIndex || it.decorator} field should be no-null`
                                    },...(it.rules && it.rules instanceof Array ? it.rules : [])],
                                    initialValue: it.model || it.initialValue
                                  }
                                ]"></a-date-picker>
                                <a-input :maxLength="it.config&&Object.keys(it.config).length?it.config.maxLength:undefined" @change="testChange" @blur="inputBlur" :placeholder="isPlaceholder?(inputcolumns[index].title || inputcolumns[index].dataIndex || it.decorator):''" :disabled="it.disabled" v-else-if="it.type === 'input' " v-decorator="[
                                    `${it.decorator}`,
                                    {
                                      rules: [{
                                        required: it.require,
                                        message: `${inputcolumns[index].title || inputcolumns[index].dataIndex || it.decorator} field should be no-null`
                                      },...(it.rules && it.rules instanceof Array ? it.rules : [])],
                                      initialValue: it.model || it.initialValue
                                  }
                                ]" />
                            </a-form-item>
                        </td>
                        <td class="td-delete" v-if="delItem" style="border:0;">
                            <span @click="deleteTab(key)" class="delete">
                                <a-icon type="minus" />
                            </span>
                        </td>
                    </tr>
                    <div></div>
                </tbody>
            </table>
        </el-scrollbar>
        <a-row :gutter="24" class="Row">
            <a-col :span="8">
                <span v-if="Rounding" @click=" () => defaultVisible = !defaultVisible">Default Rounding rules</span>
            </a-col>
            <a-col :span="8">
                <span @click="Add" v-if="newAdd">
                    <a-icon type="plus" />
                </span>
            </a-col>
            <a-col :span="8">
                <!-- <span @click="check"
          v-if="Check">Check</span>-->
            </a-col>
        </a-row>

        <Default Rounding :defaultVisible.sync="defaultVisible" @hide="defaHide" />
    </section>
</a-form>
</template>

<script lang="ts">
declare module "vue/types/vue" {
    // 声明插件Vue不认识的方法
}
import Vue from "vue";
import {
    Component,
    Prop,
    Emit,
    Watch
} from "vue-property-decorator";
import moment from "moment";
@Component({
    components: {
        Default: resolve => require(["./Default.vue"], resolve)
    }
})
export default class TableInput extends Vue {
    @Prop(Array) private inputcolumns ? : any; // header
    @Prop(Array) private inputdata ? : any; // body
    @Prop(Boolean) private isPlaceholder ? : boolean; // 是否需要使用 Placeholder
    @Prop(Boolean) private border ? : boolean; //是否显示边框
    @Prop(Boolean) private Rounding ? : boolean; //rumber plan
    @Prop(Array) private addData ? : any; // addData -> Add新增所配置的数据
    @Prop({
        type: Boolean,
        default: true
    })
    private Check ? : any; // 是否需要校验？
    @Prop({
        type: Boolean,
        default: true
    })
    private newAdd ? : any; // 是否需要新增？
    @Prop({
        type: Boolean,
        default: true
    })
    private delItem ? : any; // 是否需要删减？
    @Prop({
        type: String,
        default: "center"
    })
    private align ? : string; // 表格对齐方式 -> left,center,right 默认center
    @Prop({
        type: Boolean,
        default: false
    })
    private diyAdd ? : any; // 是否自定义add事件
    @Prop({
        type: Array
    })
    private initData ? : any;
    /**
     *  初始化数据 与inputdata传入数据相同
     *  例：private initData：object[] = [
     *   {
     *      key: 1,
     *      chargeItem: {
     *       decorator: 'chargeItem'
     *       type: 'input',
     *       initialValue：'xx'
     *      },
     *      Amount: {
     *       type: 'input',
     *       decorator: 'Amount'
     *      }
     *   }];
     */
    //   @Prop(Boolean) private isNotCheck ? : boolean //check按钮 isNotVerify 是否不验证
    @Prop(Array) private tableAdd ? : any;
    @Emit("success") success(val: any) {} // 校验成功触发
    @Emit("input") Enterinput < T > (val: T, id: T, arr: any) {} // 输入框输入触发
    @Emit("inputBlur") inputBlurs < T > (val: T, id: T) {} // 输入框失焦触发
    @Emit("emptyAll") emptyAll() {}
    @Emit("successForm") successForm(form: any) {}
    @Emit("select") onSelect(
        val: string,
        name: string,
        optionsIndex: number,
        rowIndex: number
    ) {}
    @Emit("addChange") addChange() {}
    @Emit("deleteChange") deleteChange() {}
    @Emit("sourcesUpdata") sourcesUpdatas(arr: any[]) {}
    // @Watch('ModelInput') Watinput(val: string, $event: any) {
    //     let ev: any = event;
    //     this.Enterinput < String > (val, ev.target.id)
    // }
    // 用于监听初始化数据
    @Watch("initData", {
        deep: true,
        immediate: true
    })
    onInitData(newVal: string, oldVal: any) {
        // 延迟 让Test方法执行在 本方法之前 延迟时间小于 init方法防抖时间
        setTimeout(() => {
            if (newVal && newVal.length) {
                this.initDataAndColums(newVal, true);
            }
        }, 0);
    }
    public inputBlur(val: any) {
        let ev: any = event;
        this.inputBlurs < String > (val.target.value, val.target.id);
        //console.log(this.ModelInput)
        // console.log(ev.target)
    }
    private Addinputdata: any = this.inputdata;
    private defaultVisible: boolean = false;
    private TestArr: any[] = [];
    private Arr: any[] = [];
    private form: any; // form表单
    private ModelInput: string = "";
    private keys: number = 0;
    private timer: number = 0; // 定时器id
    /* 给form 添加当前实例 */
    private beforeCreate() {
        this.form = this.$form.createForm(this);
    }
    /* select 回调 */
    public handleChange(
        val: string,
        name: string,
        optionsIndex: number,
        rowIndex: number
    ) {
        console.log(val, name, optionsIndex, rowIndex);

        this.onSelect(val, name, optionsIndex, rowIndex);
    }
    /* 校验 */
    //   public check() {
    //     // this.isNotCheck 是否不检验  不管是否通过返都回数据
    //     if (this.isNotCheck) {
    //       this.form.validateFields({
    //         force: true
    //       })
    //       return this.success(this.processingData(this.form.getFieldsValue()))
    //     }
    //     this.form.validateFields({
    //         force: true
    //       },
    //       (err: any, value: any) => {
    //         if (!err) {
    //           value.date = !!(value.date) && moment(value.date['_d']).format('YYYY-MM-DD');
    //           this.success(this.processingData(value));
    //         }
    //       }
    //     )
    //   }
    /* 字段-数据处理 */
    public processingData(value: any) {
        const Arr: any[] = this.Arr;
        let arr: any = [];
        const inputcolumns: any = this.inputcolumns;
        Arr.forEach((elem: any, index) => {
            const item = elem.name;
            let processingObj: any = {};
            for (let i = 0; i < item.length; i++) {
                const element = item[i];
                if (element.children) {
                    for (let i = 0; i < element.children.length; i++) {
                        const elem = element.children[i];
                        let decorator: any = elem.decorator.match(/[a-zA-Z]+/);
                        processingObj[decorator[0]] = value[elem.decorator];
                    }
                }
                if (element.decorator) {
                    processingObj[inputcolumns[i]["dataIndex"]] =
                        value[element.decorator] || undefined;
                }
            }
            arr.push(processingObj);
        });
        return arr;
    }
    /* ADD 增加数据行 */
    public Add() {
        if (this.diyAdd) {
            return this.$emit("onDiyAdd");
        }
        if (!this.addData)
            return this.$message.warning(
                "请先配置组件ADD数据来源 / Configure Add data first"
            );
        if (this.addData && !this.addData.length)
            return this.$message.warning(
                "组件ADD数据为空 / Configure Add data first"
            );
        this.keys++;
        const inputcolumns = this.inputcolumns;
        const addData = this.addData;
        addData.forEach((em: any, index: number) => {
            for (const key in em) {
                let columns = inputcolumns[key];
                if (em[key] && typeof em[key] === "object") {
                    if (Object.keys(columns).length > 1) {
                        em[key]["require"] = columns.require || false;
                        em[key]["width"] = columns.width || undefined;
                        em[key]["rules"] = columns.rules || undefined;
                        em[key]["config"] = columns.config || undefined;
                    }
                }
            }
        });
        this.addChange();
        this.Arr.push({
            name: addData[0],
            key: this.keys
        });
        console.log("this.Arr", this.Arr);
    }
    /* 表格选中插入 */
    public tabAdd() {
        if (!this.tableAdd)
            return this.$message.warning(
                "请先配置组件Table数据来源 / Configure Table data first"
            );
        if (this.tableAdd && !this.tableAdd.length)
            return this.$message.warning(
                "请先勾选Table数据 / Configure Table data first"
            );
        let arr: any = [];
        let testArr: any = [];
        const data: any = [...(this.addData || this.inputdata)];
        const selectedRows = this.tableAdd;
        selectedRows.forEach((val: any, index: number) => {
            arr[index] = [];
            for (const k in data) {
                let l = data[k];
                testArr[k] = [];
                for (const p in l) {
                    let testObj = {
                        type: l[p]["type"] || undefined,
                        options: l[p]["options"] || undefined,
                        decorator: l[p]["decorator"] || undefined,
                        model: val[l[p]["decorator"]] || "No ."
                    };
                    testArr[k].push(testObj);
                }
                arr[index] = [].concat(testArr);
            }
        });
        const test = this.Arr.concat(...arr);
        this.Arr = test;
    }

    private init(inputdata: any[]) {
        if (this.timer) {
            clearTimeout(this.timer);
        }
        this.timer = setTimeout(() => {
            inputdata.forEach((em: any, index: number) => {
                let TestArr: any[] = [];
                this.inputcolumns.forEach((res: any) => {
                    if (em[res.dataIndex] && typeof em[res.dataIndex] === "object") {
                        em[res.dataIndex]["require"] = res.require || false;
                        em[res.dataIndex]["width"] = res.width || "";
                        em[res.dataIndex]["rules"] = res.rules;
                        em[res.dataIndex]["config"] = res.config;
                        em[res.dataIndex]["disabled"] =
                            res.disabled || em[res.dataIndex]["disabled"];
                        if (em[res.dataIndex]["decorator"].indexOf(index) > -1) {
                            // em[res.dataIndex]['decorator']
                        } else {
                            em[res.dataIndex]["decorator"] =
                                em[res.dataIndex]["decorator"] + index;
                        }
                        TestArr.push(em[res.dataIndex]);
                    }!em[res.dataIndex] &&
                        TestArr.push({
                            num: em.key,
                            width: "7%"
                            // width: 100 / this.TestArr.length + '%'
                        });
                });
                this.Arr.push({
                    name: TestArr,
                    key: this.keys
                });
                this.keys++;
            });
        }, 100);
    }

    /* 匹配表头 查找相同数据 */
    public Test(isInit ? : any) {
        this.initDataAndColums(this.inputdata, isInit);
    }
    /**后台数据渲染 解决 渲染成一行  */
    public initDataAndColums(inputdata: any, isInit: boolean = true) {
        if (!this.inputcolumns)
            return this.$message.warning("请配置组件表格表头数据来源");
        if (!inputdata) return this.$message.warning("请配置组件表格身体数据来源");
        if (isInit) {
            this.Arr = [];
            this.form = this.$form.createForm(this);
        }
        this.init(inputdata);
    }
    public created() {
        this.Test();
        this.successForm(this.form);
    }
    public sourcesUpdata() {
        this.sourcesUpdatas(this.Arr);
    }
    /* 删除表格某一行 */
    public deleteTab(key: number) {
        if (this.Arr.length <= 1) {
            return true;
        }
        this.Arr.splice(key, 1);
        // this.deleteChange()
        /* 当只有一条数据重置 */
        this.Arr.length === 1 && this.emptyAll();
    }
    /* hide defalut */
    public defaHide() {
        this.defaultVisible = !this.defaultVisible;
    }
    /* 输入框输入触发 */
    public testChange(e: any) {
        this.Enterinput < String > (e.target.value, e.target.id, this.Arr);
    }
    // isNotVerify 是否不验证
    public getData(isNotVerify ? : boolean): any {
        if (isNotVerify) {
            return this.processingData(this.form.getFieldsValue());
        }
        let data: any;
        this.form.validateFields((err: any, value: any) => {
            if (!err) {
                value.date = !!value.date && moment(value.date["_d"]).format("YYYY-MM-DD");
                data = this.processingData(value);
            }
        });
        return data;
    }
    public getArr() {
        return this.Arr;
    }
}
</script>

<style lang="scss" scoped>
.gridtable {
    font-family: "Chinese Quote", -apple-system, BlinkMacSystemFont, "Segoe UI",
        "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue",
        Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
        "Segoe UI Symbol";
    font-size: 14px;
    font-variant: tabular-nums;
    line-height: 1.5;
    color: rgba(0, 0, 0, 0.65);
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    list-style: none;
    position: relative;
    width: 100%;
}

table.border tr th,
table.border tr td {
    border: 1px solid rgb(221, 224, 241);
    overflow: hidden;
}

table.gridtable th {
    background: #fafafa;
    transition: background 0.3s ease;
    color: rgba(0, 0, 0, 0.85);
    font-weight: 500;
    border-bottom: 1px solid #e8e8e8;
    padding: 8px;
    background: rgb(233, 234, 243);
}

table.gridtable td {
    padding: 0px 8px;
    background-color: #ffffff;

    .ant-form-item {
        margin: 0;
    }
}

.td-delete {
    vertical-align: middle;
}

.delete {
    display: inline-block;
    background: #f06666;
    width: 24px;
    height: 24px;
    line-height: 24px;
    border-radius: 50%;
    text-align: center;
    cursor: pointer;
    color: #fff;

    &:hover {
        background: red;
    }
}

.Row {
    padding: 15px 0px;
    transition: all 0.2s;
    text-align: center;

    span {
        cursor: pointer;
    }

    div:nth-child(1) span {
        color: rgb(64, 120, 216);
        font-size: 18px;
        font-weight: 600;
    }

    div:nth-child(2) span {
        border-radius: 50px;
        display: inline-block;
        width: 100px;
        background: rgb(62, 119, 216);
        color: #fff;
        padding: 2px;

        &:hover {
            opacity: 0.8;
        }

        i {
            font-size: 17px;
        }
    }

    div:nth-child(3) span {
        border-radius: 50px;
        display: inline-block;
        background: rgb(62, 119, 216);
        color: #fff;
        padding: 2px;
        width: 80px;

        &:hover {
            opacity: 0.8;
        }
    }
}
</style>
