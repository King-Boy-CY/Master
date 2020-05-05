<template>
<div>
    <div class="defined-left">
        <template v-if="selectedBtn.length">
            <template v-for="(item,index) in selectedBtn">
                <a-tooltip v-if="item.tips && item.disabled" class="tooltip" :key="index" placement="top" :title="item.tips" trigger="click" :autoAdjustOverflow="false">
                    <a-button class="btn" :class="{
                        'delete':item.name==='Delete',
                        'not-mr':index==selectedBtn.length-1
                      }" :key="index" :icon="item.icon||''" :style="item.style||''" :disabled="item.disabled" @click="onSelectClick(item,selectedRowKeys,selectedRowdatas)">{{item.name}}</a-button>
                </a-tooltip>

                <a-button v-else class="btn" :class="{
                        'delete':item.name==='Delete',
                        'not-mr':index==selectedBtn.length-1
                      }" :key="index" :icon="item.icon||''" :style="item.style||''" :disabled="item.disabled" @click="onSelectClick(item,selectedRowKeys,selectedRowdatas)">{{item.name}}</a-button>
            </template>
        </template>
    </div>
    <!-- <a-button class="defined-right" icon="scissor" @click="() => visible = !visible">User-defined</a-button> -->
    <div class="table_code">
        <i-table :size="tableSize" ref="fist-table"  :height="TableHeight"  no-data-text="No data" :border="border" @on-selection-change="onSelect" :stripe="stripe" :columns="columns" :data="newData"></i-table>
        <div style="margin: 20px 0px 20px 0px;" v-if="isPagination" class="Pagination">
            <a-pagination v-if="data.length" :hideOnSinglePage="hideOnSinglePage" :size="size" showSizeChanger @change="pageChange" :showTotal="textTotal" :current="current" :pageSizeOptions="pageSizeOptions" @showSizeChange="onShowSizeChange" :defaultCurrent="defaultCurrent" :pageSize.sync="pageSize" :total="total" />
        </div>
    </div>
    <model title="User-defined" v-if="useDefined" v-model="visible" width="800px" @Screencover="Return">
        <template slot="model-body">
            <div class="All-code">
                <div :style="{ borderBottom: '1px solid #E9E9E9' }">
                    <a-checkbox :indeterminate="indeterminate" @change="onCheckAllChange" :checked="checkAll">All</a-checkbox>
                </div>
                <br />
                <a-checkbox-group v-model="checkedList" @change="onChange">
                    <a-row>
                        <a-col :span="8" v-for="(item,index) in plainOptions" :key="index">
                            <a-checkbox :value="item">{{item}}</a-checkbox>
                        </a-col>
                    </a-row>
                </a-checkbox-group>
                <!-- <a-checkbox-group :options="plainOptions" v-model="checkedList" @change="onChange" /> -->
            </div>
        </template>
        <template slot="model-footer">
            <a-row>
                <a-col :span="24" :style="{ textAlign: 'center' }">
                    <a-button type="primary" @click="Comfirm">Comfirm</a-button>
                    <a-button style="margin-left:20px;" @click="Return">Return</a-button>
                </a-col>
            </a-row>
        </template>
    </model>
</div>
</template>

<script lang="ts">
import Vue from 'vue'
import {
    Component,
    Emit,
    Prop,
    Watch
} from 'vue-property-decorator'
import {
    State
} from 'vuex-class'
@Component({
    components: {
        model: () => import("@/common/Model/index.vue"),
    }
})
export default class table_timeband extends Vue {
    @Prop({
        type: Array,
        default: () => {
            return [];
        }
    })
    @Prop() private selectedBtn ? : any; // 表格是否需要 选择框选择后的 btn
    @Prop() private columns ? : any; // 表格头部数据
    @Prop() private size ? : string;
    @Prop() private tableSize ? : string;
    @Prop() private hideOnSinglePage ? : Boolean;
    @Prop({
        type: Boolean,
        default: true
    })
    private useDefined ? : boolean; // 是否使用 useDefined
    @Prop({
        type: Array,
        default: () => {
            return []
        }
    }) private data ? : any; // 表格table数据
    @Prop({
        type: Boolean,
        default: true
    }) private border ? : any; // 表格是否显示边框
    @Prop({
        type: Boolean,
        default: true
    }) private stripe ? : any; // 表格是否显示斑马纹

    @Prop({
        type: Number,
        default: 1
    }) private defaultCurrent ? : any; // 表格分页当前页
    @Prop({
        default: 10,
        type: Number
    }) private defaultPageSize ? : any; //  表格分页每页条数
    @Prop({
        type: Array,
        default: () => {
            return ["10", "20", "50", "100"]
        }
    }) private pageSizeOptions ? : any; //  表格分页每页显示的条数
    private current: number = 0
    @Prop({
        type: Boolean,
        default: true
    }) private isPagination ? : Boolean;
    private TableHeight: number = 0
    private visible: boolean = false
    private selectedRowKeys: number = 0
    private TestArr: any = []
    private checkedList: any = []; //当前选中
    private checkAll: boolean = false; //全选
    private plainOptions: any = []; // 数据来源
    private indeterminate: boolean = true; //全选样式
    private checkList: any = []; // 当前选中数据
    private total: number = 0 // 当前分页总总数
    @Emit('onSelect') onSelectTabs(item: any, row: any, index: any) {} // 表格选中回调
    @Emit('pageSelect') onPageSelect < T > (current: T, pageSize: T) {} // 分页切换触发
    @Emit('showSizeChange') showSizeChangea < T > (page: T, pageSize: T) {} // 分页显示多少条触发
    @Emit('onSelectClick') onSelectClicks(item: any, selectedRowKeys: any, selectedRowdatas: any) {} // 分页显示多少条触发
    @Watch('data', {
        deep: true
    })
    watchdata() {
        this.current = 1
        this.newData = this.data
        this.pageArr(this.defaultCurrent, this.defaultPageSize)
        this.pageSize = this.defaultPageSize
        this.total = this.data.length;
        if (this.data.length) {
            this.setTableHeight();
        }
    }
    private setTableData: {
        [k: string]: number
    } = {};
    private setTableHeight(iscollapsible ? : boolean) {
        if (!this.data.length) return;
        setTimeout(() => {
            // 表格高度
            if (!Object.keys(this.setTableData).length) {
                this.setTableData["offsetHeight"] = this.$refs["fist-table"]["$el"][
                    "offsetHeight"
                ];
                this.setTableData["offsetTop"] = this.$refs["fist-table"]["$el"][
                    "offsetTop"
                ];
                let footer = document.getElementsByClassName(
                    "Pagination"
                )[0];
                this.setTableData["footerHeight"] = footer["offsetHeight"];
                this.setTableData["footerOffsetTop"] = footer["offsetTop"];
                this.setTableData["clientHeight"] =
                    document.documentElement.clientHeight;
            }
            // 如果是高级搜索收缩
            if (iscollapsible) {
                return (this.TableHeight = 0);
            }
            const {
                footerHeight,
                definedHeight,
                offsetHeight,
                offsetTop,
                clientHeight,
                footerOffsetTop
            } = this.setTableData;
            if (offsetHeight + offsetTop > clientHeight) {
                let height = Math.abs(clientHeight - offsetTop) - footerHeight;
                this.TableHeight = height + 20;
            }
        }, 500);
    }
    private selectedRowdatas: any = []
    private pages = 0
    private pagSizes = 0
    @Watch("columns", {
        immediate: true,
        deep: true
    })
    onChangeValue(newVal: any, oldVal: any) {
        this.TestArr = newVal;
        this.checkedList = this.plainOptions = newVal.map((element: any) => {
            return element.title || element.dataIndex || element.decorator;
        });
        this.indeterminate = false;
        this.checkAll = true;
    }
    // 筛选条件
    public Comfirm() {
        if (this.checkedList.length === 0) {
            this.$message.warning("请勾选需要展示的字段");
            return;
        }
        this.visible = !this.visible;
        if (this.checkAll) {
            this.TestArr = this.columns;
            return;
        }
        const arr: any = [];
        this.columns.forEach((item: any, index: number) => {
            // for (const key in this.checkedList) {
            //     if (
            //         this.checkedList[key] === item.title ||
            //         this.checkedList[key] === item.dataIndex ||
            //         this.checkedList[key] === item.decorator
            //     ) {
            //         const newItem = Object.assign({}, item, {
            //             width: item.width ?
            //                 item.width : (100 / this.checkedList.length).toFixed(2) + "%"
            //         });
            //         console.log('item',item);

            //         arr.push(newItem);
            //     }
            // }            
            if (this.checkedList[index] === item.title) {
                const newItem = Object.assign({}, item, {
                    width: item.width ?
                        item.width : (100 / this.checkedList.length).toFixed(2) + "%"
                });
                arr.push(newItem);
            }
        });
        // this.TestArr = arr;
        console.log(this.TestArr);

        console.log(arr);
    }
    // 单击多选框触发事件
    public onChange(checkedList: any) {
        this.indeterminate = !!checkedList.length && checkedList.length < this.plainOptions.length;
        this.checkAll = checkedList.length === this.plainOptions.length;
        this.checkList = [...checkedList];
        // console.log(this.checkedList);
    }
    // 全选触发
    public onCheckAllChange(e: any) {
        Object.assign(this, {
            checkedList: e.target.checked ? this.plainOptions : [],
            indeterminate: false,
            checkAll: e.target.checked
        });
        e.target.checked && (this.checkList = this.plainOptions);
    }
    // 表格选中回调
    public onSelect(item: any, row: any, index: any) {
        console.log(item, row, index);
        this.selectedRowdatas = item
        this.onSelectTabs(item, row, item)
    }
    public onSelectClick(item: any, selectedRowKeys: any, selectedRowdatas: any) {
        console.log('item, selectedRowKeys, selectedRowdatas', item, selectedRowKeys, selectedRowdatas);

        this.onSelectClicks(item, selectedRowKeys, selectedRowdatas)
    }
    /* 分页函数 */
    public pageArr(page: number, pageSize: number) {
        this.current = page
        this.pages = page
        this.pagSizes = pageSize
        let start = (page - 1) * pageSize
        let end = (page) * pageSize
        let newData = this.data.slice(start, end)
        this.newData = newData
    }
    public pageChange(page: number, pageSize: number) {
        this.pageArr(page, pageSize)
        this.onPageSelect < Number > (page, pageSize)
    }
    // 分页显示多少条回调
    public onShowSizeChange(current: number, size: number) {
        this.pageArr(current, size)
        this.showSizeChangea < Number > (current, size)
    }
    private newData: any = [] // 处理的数据
    private pageSize: number = 0 // 默认显示的条数
    public created() {
        this.pageSize = this.defaultPageSize
        this.total = 0
        this.defaultCurrent = 1
        Vue.prototype.$vcSetTableHeight = (iscollapsible?:boolean) => {
            this.setTableHeight(iscollapsible);
        }
    }
    public Return() {
        this.visible = !this.visible
    }
    public textTotal(total: number, range: Array < string > ) {
        return `${range[0] || ""} - ${range[1] ||
          ""} records / Total ${total} records`
    }

}
</script>

<style>
.ivu-table:before {
    background-color: unset;
}

.subCol>ul>li {
    margin: 0 -18px;
    list-style: none;
    text-align: center;
    /* padding: 9px; */
    border-bottom: 1px solid #e6e6e6;
    /* overflow: hidden; */
    height: 50px;
    line-height: 50px;
}

.subCol>ul>li:last-child {
    border-bottom: none;
}

.AdvancedSearch {
    display: flex;
    row-gap: 3;
    justify-content: center;
}

.Ratingzone-code .select_code .el-input__inner {
    height: 32px;
    line-height: 32px;
}

.table_code .ivu-table-header table {
    width: 100% !important;
}

.table_code .ivu-table-body table {
    width: 100% !important;
}
</style><style lang="scss">
.defined-right {
    flex: 0 0 130px;
    background: transparent;
    border: 0;
    color: #1890ff;
    font-weight: 600;
    margin: 10px 0px;
    box-shadow: none;
    outline: none;
    // position: absolute;
    // right: 0;
}

.defined-left {
    flex: 1;
    text-align: left;
    line-height: 100%;
    padding-top: 10px;
    overflow: hidden;

    button.btn {
        min-width: 100px;
        border-radius: 50px;
        border: 1px solid #5286d7;
        color: #5286d7;
        margin-right: 14px;
        margin-bottom: 6px;

        &.not-mr {
            margin-right: 0;
        }

        &:hover {
            background-color: #316ad7 !important;
            border-color: #316ad7 !important;
            color: #fff !important;
        }

        &.delete:hover {
            background-color: #f5b148 !important;
            border-color: #f5b148 !important;
            color: #fff !important;
        }
    }

    .tooltip {
        border-radius: 50px;
        margin-right: 14px;
        margin-bottom: 6px;

        &:hover {
            background-color: #316ad7 !important;
            border-color: #316ad7 !important;
            color: #fff !important;
        }

        &.delete:hover {
            background-color: #f5b148 !important;
            border-color: #f5b148 !important;
            color: #fff !important;
        }

        .btn {
            margin-bottom: 0;
            margin-right: 0;
            border-radius: 50px;
            /*border: none;*/
        }
    }
}
</style>
