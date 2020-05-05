<template>
<div class="shadow" :class="shortPadding?'short-padding':''">
    <span class="defined">
        <a-button icon="scissor" @click="() => visible = !visible">User-defined</a-button>
    </span>

    <model title="User-defined" v-model="visible" width="800px" @Screencover="Return">
        <template slot="model-body">
            <div class="All-code">
                <div :style="{ borderBottom: '1px solid #E9E9E9' }">
                    <a-checkbox @change="onCheckAllChange" :checked="checkAll">All</a-checkbox>
                </div>
                <a-checkbox-group v-model="checkedList" @change="onChange">
                    <a-row>
                        <a-col :span="8" v-for="(item,index) in plainOptions" :key="index">
                            <a-checkbox :value="item">{{item}}</a-checkbox>
                        </a-col>
                    </a-row>
                </a-checkbox-group>
                <!-- <a-checkbox-group :options="plainOptions" v-model="checkedList" @change="onChanges" /> -->
            </div>
        </template>
        <template slot="model-footer">
            <a-button class="save-btn" type="primary" @click="Comfirm">Comfirm</a-button>
            <a-button class="return-btn" @click="Return">Return</a-button>
        </template>
    </model>
    <a-table v-if="isRate" :columns="TestArr" :dataSource="data" :pagination="isPagination&&pagination" :size="size" :bordered="border" :expandedRowKeys="expandedRowKeys" @expandedRowsChange="expandedRowsChange" expandRowByClick align="center" :loading="loading" :rowSelection="isRate?undefined:(rowSelection?rowSelection:priteRowSelection)" :class="{ test: zebraStripe }" :rowKey="parentKey" :scroll="scroll || { x: 1300 }">
        <div slot="expandedRowRender" slot-scope="record" style="overflow: hidden;">
            <a-table :columns="childColumnss" :dataSource="record[childDataKey]" :rowKey="childKey" :pagination="false" :rowSelection="childRowSelection?childRowSelection:priteRowSelection" v-if="childTab" :scroll="{ x: '100%' }">
                <div slot="ProductDetails" slot-scope="text, record">
                    <a href="javascript:;" @click="getDetailShow(record)">
                        Details
                        <a-icon type="down" />
                    </a>
                </div>
            </a-table>
        </div>
        <div slot="richText" slot-scope="text" v-html="text && text.replace(/\n/g,'<br>') || undefined"></div>
        <div slot="commaSplit" slot-scope="text">
            <a-popover placement="left" v-if="text && text.split(',').length > 1">
                <div slot="content">
                    <div v-for="(item,key) in text && text.split(',')" :key="key">{{item || ''}}</div>
                </div>
                <div v-for="(item,key) in text && text.split(',').slice(0,1)" :key="key">{{item || ''}}{{key===0?'......':''}}</div>
            </a-popover>
            <div v-else v-for="(item,key) in text && text.split(',')" :key="key">{{item || ''}}</div>
        </div>
    </a-table>
    <a-table v-else class="deep" :columns="TestArr" :dataSource="data" :pagination="isPagination&&pagination" :size="size" :bordered="border" expandRowByClick align="center" :loading="loading" :class="{ test: zebraStripe }" :rowSelection="rowSelection?rowSelection:priteRowSelection" :scroll=" scroll || { x: 1300 }">
        <div slot="richText" slot-scope="text" v-html="text&& text.replace(/\n/g,'<br>') || undefined"></div>
        <div slot="ProductDetails" slot-scope="text, record">
            <a href="javascript:;" @click="getDetailShow(record)">
                Details
                <a-icon type="down" />
            </a>
        </div>
        <a-table v-if="childTab" slot="expandedRowRender" :columns="childColumnss" :dataSource="childData" :pagination="false" :rowSelection="rowSelection?rowSelection:priteRowSelection" :scroll="{ x: '100%' }">
            <div slot="ProductDetails" slot-scope="text, record">
                <a href="javascript:;" @click="getDetailShow(record)">
                    Details
                    <a-icon type="down" />
                </a>
            </div>
        </a-table>
    </a-table>
</div>
</template>

<script lang="ts">
import Vue from "vue";
import {
    Component,
    Emit,
    Prop,
    Watch
} from "vue-property-decorator";
import {
    Mutation
} from "vuex-class";

@Component({
    components: {
        model: () => import("../Model/index.vue")
    }
})
export default class Table extends Vue {
    @Emit("onSelect") onSelect(
        record: any,
        selected: any,
        selectedRows: any,
        key ? : string
    ) {}

    @Emit("onSelectAll") onSelectAll(
        selected: any,
        selectedRows: any,
        changeRows: any,
        key ? : string
    ) {}

    @Emit("onChange") onChange(selectedRowKeys: any, selectedRows: any) {}
    @Emit("insertDetail") insertDetail(ids: number) {}
    @Prop(Array) public columns ? : any;
    /* 表头 */
    @Prop(Array) public data: any;
    /* 表格主体 */
    @Prop(Array) public childColumnss ? : any;
    /* 子表格 表头 */
    @Prop(Array) public childData: any;
    /* 子表格 表格主体 */
    @Prop(String) public size ? : string;
    /* 表格展示大小 */
    // @Prop(Object) public scroll ? : string /* 表格高宽超出显示滚动条 */
    @Prop(Boolean) private loading ? : Boolean; // 加载
    @Prop(Boolean) childTab ? : any; // 启用子表格
    @Prop(Boolean) private zebraStripe ? : boolean; // 是否启用斑马纹
    @Prop(Boolean) private isRate ? : boolean; // 是否是rate
    @Prop(Boolean) private isFinance ? : boolean; // 是否是Finance
    @Prop(Function) private rowClassName ? : any; // 修改行属性
    @Prop(String) private childKey ? : string; // child key
    @Prop(String) private childDataKey ? : string; // childDataKey key
    @Prop(String) private parentKey ? : string; // parentKey key
    @Prop(Boolean) private shortPadding ? : boolean; // 是否使用短padding 表头
    @Prop(Object) private scroll ? : boolean; // 自定义高宽
    @Prop(Object) private rowSelection ? : object; // 框架table 的 rowSelection api
    @Prop(Object) private childRowSelection ? : object; // 同上

    @Prop({
        type: Boolean,
        default: true
    })
    private border ? : boolean; // 是否启用边框
    @Prop({
        type: Array,
        default () {
            return ["10", "20", "50", "100"];
        }
    })
    private pageSizeOptions ? : any; // 分默认条数
    @Prop({
        type: Number,
        default: 10
    })
    private defaultPageSize ? : Number; // 分页默认值
    @Prop({
        type: Boolean,
        default: true
    })
    private useSelectedRowKeys ? : boolean; //  使用 selectedRowKeys
    @Prop({
        type: Boolean,
        default: true
    })
    private isPagination ? : boolean; //  是否使用表格里的分页

    @Prop({
        type: String
    })
    private scrollX ? : any; // scrollX

    @Watch("data", {
        deep: true
    })
    onChangeData(newVal: any, oldVal: any) {
        this.clearSelectRowKeys();
        this.currentPage = 1;
        this.onSelect({}, false, []);
        this.expandedRowKeys = [];
    }

    private currentPage: number = 1;
    private pageSize: number = 10;
    private expandedRowKeys: any[] = [];
    getDetailShow(record: {
        productId: number
    }) {
        //发送给 ratePlanInsert  table 里面 details 展示
        this.insertDetail(record.productId);
    }

    get pagination() {
        return {
            showSizeChanger: true,
            pageSizeOptions: this.pageSizeOptions,
            current: this.currentPage,
            pageSize: this.defaultPageSize,
            defaultPageSize: this.defaultPageSize,
            // showTotal: (total: number, range: Array<string>) =>
            //   `${range[0] || ""} - ${range[1] ||
            //     ""} records / Total ${total} records`,
            onChange: (page: any, pageSize: any) => {
                this.currentPage = page;
                this.defaultPageSize = pageSize;
                this.expandedRowKeys = [];
                // this.clearSelectRowKeys();
            },
            onShowSizeChange: (current: any, size: any) => {
                this.currentPage = current;
                this.defaultPageSize = size;
            }
        };
    }

    get calcScrollX() {
        if (this.checkedList.length <= 4) {
            return "100%";
        } else if (
            this.checkedList.length == 0 ||
            this.checkedList.length == this.columns.length
        ) {
            // console.log("勾选中所有");
            if (this.scrollX && +this.scrollX) {
                return +this.scrollX;
            }
            return 165 * this.columns.length * (this.scrollX || 1);
        } else {
            // console.log("勾选个数低于总数");
            if (this.scrollX && +this.scrollX) {
                return this.checkedList.length / this.columns.length * this.scrollX;
            }
            return 165 * this.checkedList.length * (+this.scrollX || 1);
        }
    }

    /* 表格筛选 */
    private visible: boolean = false; //模态框显示
    private checkedList: any[] = []; //当前选中
    private checkAll: boolean = false; //全选
    private plainOptions: any[] = []; // 数据来源
    private TestArr: any[] = []; // 筛选头部数据
    private checkList: any[] = []; // 当前选中数据
    private key: any = 0;
    private selectedRowKeys: any = [];

    /* 选中项发生变化时的回调 */
    get priteRowSelection(): any {
        return {
            ...(this.useSelectedRowKeys ? {
                selectedRowKeys: this.selectedRowKeys
            } : {}),
            onChange: (selectedRowKeys: any, selectedRows: any) => {
                //console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
                this.onChange(selectedRowKeys, selectedRows);
                this.selectedRowKeys = selectedRowKeys;
                // console.log(this.selectedRowKeys);
            },
            /* 用户手动选择/取消选择某列的回调 */
            onSelect: (record: any, selected: boolean, selectedRows: any) => {
                // console.log("record:"+record, "selected"+selected, "selectedRows"+selectedRows)
                /*选项切换的时候，发送给父组件 */
                const key = record.ratePlanName || "xxx";
                //console.log(key);
                this.onSelect(record, selected, selectedRows, key);
            },
            /* 用户手动选择/取消选择所有列的回调 */
            onSelectAll: (selected: boolean, selectedRows: any, changeRows: any) => {
                const key = changeRows[0].ratePlanName || "xx";
                // console.log(key);
                this.onSelectAll(selected, selectedRows, changeRows, key);
            }
        };
    }

    private expandedRowsChange(expandedRows: any) {
        this.expandedRowKeys = expandedRows;
    }
    // 剪刀手 里面 单击多选框触发事件
    public onChanges(checkedList: any) {
        // this.indeterminate = !!checkedList.length && (checkedList.length < this.plainOptions.length)
        this.checkAll = checkedList.length === this.plainOptions.length;
        this.checkList = [...checkedList];
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

    // 筛选条件 Comfirm
    public Comfirm() {
        if (this.checkList.length === 0) {
            return;
        }
        this.visible = !this.visible;
        // if (this.checkAll) {
        //   console.log(this.columns)
        //   this.TestArr = this.columns;
        //   return
        // }
        const arr: any = [];
        this.columns.forEach((res: any) => {
            for (const key in this.checkList) {
                if (this.checkList[key] === res.title) {
                    arr.push(res);
                }
            }
            res.width = 100 / this.checkedList.length + "%";
        });
        this.TestArr = arr;
        // this.checkAll = false
        // this.checkedList = []
    }

    public Return() {
        this.visible = !this.visible;
    }

    public clearSelectRowKeys() {
        this.selectedRowKeys = [];
    }

    public created() {
        if (!this.checkAll) {
            this.TestArr.push(...this.columns);
        }
        this.columns.forEach((element: any) => {
            this.plainOptions.push(element.title);
            this.checkedList.push(element.title);
            this.checkAll = true;
        });
    }
}
</script>

<style lang="scss">
/* 清楚自带展开图标 */
.test .ant-table-row-expand-icon-cell .ant-table-row-expand-icon {}

.test .ant-table-thead>tr:first-child>th:first-child {
    /* display: none; */
}

.shadow {
    /* box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15); */
    /* box-shadow: 0 2px 8px rgb(224, 224, 224); */
    box-shadow: 0 -2px 8px rgb(236, 236, 236), 0 2px 8px rgba(0, 0, 0, 0.15);
    border-radius: 6px;
    margin-top: 20px;
    /*overflow-x: scroll;*/
}

.shadow td {
    vertical-align: middle;
    text-align: center;
}

.test thead th {
    background-color: rgba(231, 233, 245, 0.6) !important;
}

.test tbody tr:nth-child(odd) {
    /* 匹配奇数行 */
    /* background: #fafafa; */
    /* background: red; */
}

/* .test tbody tr:nth-child(1) {
    background: #fff;
  } */
.test tbody tr:nth-child(even) {
    /* 匹配偶数行 */
    background: #fff;
}

.ant-table-bordered .ant-table-thead>tr>th,
.ant-table-bordered .ant-table-tbody>tr>td {
    padding: 6px;
    vertical-align: middle;
    text-align: center;
}

.ant-table-bordered .ant-table-thead>tr>th {
    background-color: rgba(231, 233, 245, 0.6);
    padding: 8px 10px;
}

.short-padding .ant-table-tbody>tr>td {
    padding: 6px 6px;
    vertical-align: middle;
    text-align: center;
}

.shadow .ant-table-pagination.ant-pagination {
    float: left;
    margin-left: 20px;
}
</style><style lang="scss" scoped>
.defined {
    position: relative;
    text-align: right;
    left: 80%;

    button {
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
}

.ant-table td {
    white-space: nowrap;

    .ant-table td {
        white-space: nowrap;
    }
}

.All-code {
    margin: 20px auto;
    // background: red;
    min-height: 200px;
    width: 600px;
}
</style>
