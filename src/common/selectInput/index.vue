<template>
<el-select :size="size" :collapse-tags="collapseTags" :popper-append-to-body="false" :class='multipleCheckBoxStyle' :disabled="disabled" v-model="checkValue" @change="selectAll" :multiple="multiple" :filterable="filterable" :multipleLimit="multipleLimit" :placeholder="placeholder" default-first-option>
    <el-option :value="allName" v-if="allShow && !!options && options.length" class="Test">
        <span :style="allCheck ? {color: '#409EFF', fontWeight: '600'} : {}">{{allName}}</span>
        <span class="allCheck" :style="allCheck ||checkValue.length === options.length ? { color: '#409EFF', float: 'right' } : {}" v-show="allCheck ||checkValue.length === options.length ">
            <a-icon type="check" />
        </span>
    </el-option>

    <el-option v-for="(item,key) in options" @click="select(item)" :key="key" :disabled="item.disabled && !checkValue.includes(item.name || item)" :value="(item.name || item)" />
</el-select>
</template>

<script lang="ts">
import Vue from "vue";
import {
    Component,
    Watch,
    Prop,
    Emit
} from "vue-property-decorator";

@Component
export default class selectInput extends Vue {
    @Prop(Array) private options ? : any; // 数据来源
    @Prop(Boolean) private multiple ? : boolean; // 最多展示几条
    @Prop(Boolean) private filterable ? : boolean; // 是否可搜索
    @Prop({
        type:String,
        default:''
    }) private placeholder ? : string; // 提示
    @Prop(String) private size ? : string; // size 输入框大小
    @Prop(String) private multipleCheckBoxStyle ? : string; // 多选框的class传值
    
    @Prop(Number) private multipleLimit ? : Number; //可选多少条 默认五条
    @Prop({
        type:String,
        default: 'All'
    }) private allName ? : string // 全选自定义名称
    @Prop(Array) private values ? : any // 选中数据
    @Prop({
        type: Boolean,
        default: false
    }) private allShow ? : boolean // 是否需要展示全选
    @Prop({
        type: Boolean,
        default: false
    }) private collapseTags ? : boolean // 数据是否省略显示(多条并做一条)
    @Prop({
        type: Boolean,
        default: false
    }) private disabled ? : boolean // 是否禁用
    @Emit('change') onChange(val ? : string[]) {} // 选中触发
    private allValues: any = []; // 标识记录当前所有数据
    // private checkValue: any[] = []; // 绑定当前所选项
    get checkValue() {
        return this.values
    }

    set checkValue(val) {
        this.$emit("update:values", val)
        this.$emit("change", val)
    }

    private allCheck: boolean = false; // 全选 | 选择选中长度跟数据来源长度一致展示全选
    /* 全选 */
    public All() {
        this.selectAll([this.allName])
    }

    /* 点击选中 */
    public selectAll(val: any) {
        this.checkValue = !val.includes(this.allName) && val;
        this.allCheck = val.length === this.options.length;
        if (val.includes(this.allName) && !this.allValues[0]) {
            this.checkValue = []
            for (let item of this.options) {
                if (!item.disabled) {
                    this.allValues.push(item.name || item)
                }
            }
            if (val instanceof Array) {
                const findIndex = val.findIndex((item: any) => item === 'All' || item.name === 'All')
                val.splice(findIndex, 1)
            }      
            this.checkValue = this.allValues
            this.allCheck = true;
        } else if (val.includes(this.allName) && this.allValues[0]) {
            this.checkValue = [];
            this.allValues = [];
        }
        // this.$nextTick(() => {
        //   this.onChange(this.checkValue)
        // })
    }

    public assValue() {
        // this.checkValue = this.values;
        // console.log('checkValue', this.checkValue);

    }

    /*  */
    public created() {
        // console.log('1');
        // this.checkValue = this.values;
    }

    private allIsDisabled(options: any) {
        return options.every((item: any) => item.disabled)
    }
}
</script>

<style>
.Test {
    border-bottom: 1px solid rgb(240, 237, 237);
}
</style>
