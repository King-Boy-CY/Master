<template>
  <div class="components-table" :class="singlePageTableClass">
    <div class="defined" v-if="useDefined">
      <div class="defined-left">
        <template v-if="selectedBtn.length">
          <template v-for="(item,index) in selectedBtn">
            <a-tooltip
              v-if="item.tips && item.disabled"
              class="tooltip"
              :key="index"
              placement="top"
              :title="item.tips"
              trigger="click"
              :autoAdjustOverflow="false"
            >
              <a-button
                class="btn"
                :class="{
                        'delete':item.name==='Delete',
                        'not-mr':index==selectedBtn.length-1
                      }"
                :key="index"
                :icon="item.icon||''"
                :style="item.style||''"
                :disabled="item.disabled"
                @click="onSelectClick(item,selectedRowKeys,selectedRowdatas)"
              >{{item.name}}</a-button>
            </a-tooltip>

            <a-button
              v-else
              class="btn"
              :class="{
                        'delete':item.name==='Delete',
                        'not-mr':index==selectedBtn.length-1
                      }"
              :key="index"
              :icon="item.icon||''"
              :style="item.style||''"
              :disabled="item.disabled"
              @click="onSelectClick(item,selectedRowKeys,selectedRowdatas)"
            >{{item.name}}</a-button>
          </template>
        </template>
      </div>
      <a-button class="defined-right" icon="scissor" @click="() => visible = !visible">User-defined</a-button>
    </div>
    <!-- 字母表 -->
    <div class="alphabetList" v-if="isAlphabet">
      <a-button
        class="resetBtn"
        v-for="(item, index) in alphabet"
        :class="{isActive: isActive === index} "
        :key="index"
        @click="toggleLetter(item,index)"
      >{{item}}</a-button>
    </div>
    <model
      title="User-defined"
      v-if="useDefined"
      v-model="visible"
      width="800px"
      @Screencover="Return"
    >
      <template slot="model-body">
        <div class="All-code">
          <div :style="{ borderBottom: '1px solid #E9E9E9' }">
            <a-checkbox
              :indeterminate="indeterminate"
              @change="onCheckAllChange"
              :checked="checkAll"
            >All</a-checkbox>
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
        <a-button class="save-btn" type="primary" @click="Comfirm">Comfirm</a-button>
        <a-button class="return-btn" @click="Return">Return</a-button>
      </template>
    </model>
    <!-- v-if="isFinance" -->
    <!-- :scroll="{x: ,y:!isTableHeight && TableHeight || 0}" -->
    <a-table
      :class="{
                'components-table-body-table':lessSpace,
                'components-table-body':isHasBoxShadow,
                'table-td':!iswriting,
                'table-td-writing':iswriting
              }"
      @change="tableOnChange"
      :rowClassName="rowClassName"
      :columns="TestArr"
      :dataSource="data"
      :pagination="isPagination&&pagination"
      :size="size"
      :bordered="border"
      align="center"
      :customCell="customCell"
      :loading="loading"
      :rowSelection="isNeedCheck?rowSelection:undefined"
      :scroll="{x: calcScrollX,y:!isTableHeight && TableHeight || 0}"
      :rowKey="parentKey"
      expandRowByClick
      ref="fist-table"
      v-bind="$attrs"
      v-on="$listeners"
    >
      <template v-if="expandRow">
        <template slot="expandedRowRender" slot-scope="record">
          <a-table
            :columns="childColumnss"
            :dataSource="record[childDataKey]"
            :rowKey="childKey"
            :pagination="false"
            :rowSelection="rowSelection"
            :scroll="{ x: 1300 }"
            v-if="childTab"
          ></a-table>
        </template>
      </template>
      <template v-if="backPagination">
        <template slot="footer">
          <a-pagination
            v-if="data.length"
            :hideOnSinglePage="backPaginationObj.hideOnSinglePage"
            :size="backPaginationObj.size"
            showSizeChanger
            @change="pageChange"
            :showTotal="textTotal"
            :current="backPaginationObj.currPage"
            :pageSizeOptions="backPaginationObj.pageSizeOptions"
            @showSizeChange="pageChange"
            :defaultCurrent="backPaginationObj.defaultCurrent"
            :pageSize.sync="backPaginationObj.pageSize"
            :total="backPaginationObj.total"
            :style="{textAlign: backPaginationObj.align}"
          />
        </template>
      </template>
      <div
        slot="download"
        slot-scope="text, record, index"
        :style="isShowDownloadColor?'color: #1890ff;cursor: pointer;':'' "
        @click="onSoltClick('download',text,record,index)"
      >{{text}}</div>
      <!-- <div slot="richText" slot-scope="text" v-html="text.replace(/\n/g,'<br>')"></div> -->
      <!-- 逗号换行 超出一行悬浮 -->
      <div slot="commaSplit" slot-scope="text">
        <a-popover placement="left" v-if="text && text.split(/,|，/).length > 1">
          <div slot="content">
            <div v-for="(item,key) in text.split(/,|，/)" :key="key">{{item || ''}}</div>
          </div>
          <div
            v-for="(item,key) in text && text.split(/,|，/).slice(0,1)"
            :key="key"
          >{{item || ''}}{{key===0?'......':''}}</div>
        </a-popover>
        <div v-else v-for="(item,key) in text && text.split(/,|，/)" :key="key">{{item || ''}}</div>
      </div>
      <!-- 富文本 -->
      <div slot="richText" slot-scope="text">
        <a-popover placement="left" v-if="text && ( text.split('<br>').length > 2)">
          <div slot="content" v-html="text.replace(/\n/g,'<br>')"></div>
          <div>
            <span v-html="text.split('<br>').slice(0,2).join('<br>').replace(/\n/g,'<br>')"></span> ......
          </div>
        </a-popover>
        <div v-else v-html="text && text.replace(/\n/g,'<br>') || undefined"></div>
      </div>
      <!-- 数字中 3个逗号换行 -->
      <div slot="commaSplitNumber" slot-scope="text" class="commaSplitNumber">
        <a-popover
          placement="left"
          v-if="text && ('' + text).replace(/\s/g,'').replace(/[,，]{2}|，/g,',').split(/,|，/).length > 3"
        >
          <template slot="content">
            <div
              v-html="('' + text).replace(/\s/g,'').replace(/[,，]{2}|，/g,',').replace(/((\d+),(\d+),(\d+)),/g,'$2, $3, $4, <br>')"
            ></div>
          </template>
          <span
            v-html="('' + text).replace(/\s/g,'').replace(/[,，]{2}|，/g,',').split(',').slice(0,3).join(',').replace(/((\d+),(\d+),(\d+))/g,'$2, $3, $4, <br>')"
          ></span> ...
        </a-popover>
        <div
          v-else
          v-html="('' + text).replace(/\s/g,'').replace(/[,，]{2}|，/g,',').replace(/((\d+),(\d+),(\d+)),?/g,'$2, $3, $4, <br>')"
        ></div>
      </div>

      <div slot="echarts" slot-scope="text, record, index">
        <!-- 数据中加上  [Symbol.for('option')] 这个传 echarts的option -->
        <echarts :isShowPopover="true" optionName="option" :options="record" :index="index"></echarts>
      </div>
      <div slot="echarts1" slot-scope="text, record, index">
        <!-- 数据中加上  [Symbol.for('option1')] 这个传 echarts的option  [Symbol.for(optionName)]-->
        <echarts :isShowPopover="true" optionName="option1" :options="record" :index="index"></echarts>
      </div>
    </a-table>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Emit, Prop, Watch } from "vue-property-decorator";
import { Mutation } from "vuex-class";
import { alphabet } from "@/untils/router.ts";
import { deepClone, isArray } from "../../../../assets/ts";

@Component({
  components: {
    model: () => import("@/common/Model/index.vue"),
    echarts: () => import("@/views/Home/table-col-echarts/index.vue")
  }
})
export default class Table extends Vue {
  @Emit("onSelect") onSelect(record: any, selected: any, selectedRows: any) {}
  @Emit("onSelectAll") onSelectAll(
    selected: any,
    selectedRows: any,
    changeRows: any
  ) {}
  @Emit("onSelectClick") onSelectClick(
    activeObJ: any,
    selectedRowKeys: any,
    selectedRowdatas: any
  ) {}
  @Emit("sorterFun") sorterFun(sort: any) {}
  // slot名字 solt对应的数据 本行的所有数据 本行的下标key
  @Emit("onSoltClick") onSoltClick(
    soltName: string,
    text: any,
    record: any,
    index: number
  ) {}
  // 后台分页显示多少条数据事件
  // @Emit("onShowSizeChange") onShowSizeChange(page: number, pageSize: number) {}
  // 后台分页点击分页事件 页数更改与页数大小更改的回调
  @Emit("onPageChange") onPageChange(page: number, pageSize: number) {}
  @Prop() private isAlphabet?: boolean; // 字母表显示
  @Prop(Array) public columns?: any; /* 表头 */
  @Prop(Array) public data: any; /* 表格主体 */
  @Prop(Array) public childColumnss?: any; /* 子表格 表头 */
  @Prop(Array) public childData: any; /* 子表格 表格主体 */
  @Prop(String) public size?: string; /* 表格展示大小 */
  // @Prop(Object) public scroll ? : string /* 表格高宽超出显示滚动条 */
  @Prop(Boolean) private loading?: Boolean; // 加载
  @Prop(Boolean) childTab?: any; // 启用子表格
  @Prop(Boolean) private zebraStripe?: boolean; // 是否启用斑马纹
  @Prop(Boolean) private lessSpace?: boolean; // 是否应用少边距的样式
  @Prop(Boolean) private isFinance?: boolean; // 是否是Finance
  @Prop(Function) private rowClassName?: any; // 修改行属性
  @Prop(Function) private customCell?: any; // 修改列属性
  @Prop(String) private childKey?: string; // child key
  @Prop(String) private childDataKey?: string; // childDataKey key
  @Prop(String) private parentKey?: string; // parentKey key
  @Prop(Boolean) private isShowDownloadColor?: Boolean; // 表格数据行中点击下载数据颜色是否显示
  @Prop(Array) private singlePageTableClass?: Array<string>; // 传入class
  @Prop(Boolean) private expandRow?: boolean; // 是否支持点击展开
  @Prop({
    default: false,
    type: Boolean
  })
  private isTableHeight?: Boolean; // 不需要计算滚动条
  @Prop({
    type: Boolean,
    default: false
  })
  private backPagination?: boolean; // 是否启用后台分页
  @Prop({
    type: Object,
    default: () => {
      return {
        pageSizeOptions: ["10", "20", "50", "100"], //  表格分页每页显示的条数
        defaultPageSize: 10, //  表格分页每页条数
        defaultCurrent: 1, // 表格分页当前页
        size: "", // 尺寸分页
        hideOnSinglePage: false, // 只有一页时是否隐藏分页器
        showQuickJumper: false, // 是否可以快速跳转至某页
        current: 1,
        pageSize: 10,
        align: "left",
        total: 0
      };
    }
  })
  private backPaginationObj?: any; // 后台分页配置
  @Prop({
    type: Boolean,
    default: true
  })
  private border?: boolean; // 是否启用边框
  @Prop({
    type: Boolean,
    default: true
  })
  private showHeader?: boolean; // 是否显示表头
  @Prop([String, Number]) private scrollX?: any; // scrollX
  @Prop({
    type: Boolean,
    default: false
  })
  private isNeedCheck?: boolean; // 表格是否需要 选择框
  @Prop({
    type: Boolean,
    default: false
  })
  private isSingleCheck?: boolean; // 选择框是否为单选

  @Prop({
    type: Array,
    default: () => {
      return [];
    }
  })
  private selectedBtn?: Array<Object>; // 表格是否需要 选择框选择后的 btn

  @Prop({
    type: Boolean,
    default: true
  })
  private useDefined?: boolean; // 是否使用 useDefined

  @Prop({
    type: Boolean,
    default: true
  })
  private useSelectedRowKeys?: boolean; //  使用 selectedRowKeys
  @Prop({
    type: Boolean,
    default: true
  })
  private isPagination?: boolean; //  是否使用表格里的分页
  @Emit("toggleLetter") private toggle_letter(
    letter: string,
    index: number
  ): any {}

  @Prop({
    type: Boolean,
    default: true
  })
  private isHasBoxShadow?: boolean; // 是否有box-shadow样式
  private paginationCurrent: number = 0;
  private paginationTotal: number = 0;
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
  @Watch("data", {
    deep: true
  })
  onChangeData(newVal: any, oldVal: any) {
    this.paginationCurrent = 1;
    this.paginationTotal = this.data.length;
    this.clearSelectRowKeys();
    this.currentPage = 1;
    this.onSelect({}, false, []);
    this.expandedRowKeys = [];
    this.$nextTick(() => {
      if (this.data.length && !this.isTableHeight) {
        this.setTableHeight();
      }
    });
  }
  private setTestArr() {
    this.TestArr = this.newTestArr;
  }
  private widthS: number[] | any = [];
  private newTestArr: any[] = [];
  private getTdOffsetWidth() {
    setTimeout(() => {
      let rowArr = Array.from(document.getElementsByClassName("ant-table-row"));
      let { widthS } = this;
      let recodeKey: number = 0;
      let recodeFlag: number = 0;
      for (let i = 0, rowItem; (rowItem = rowArr[++i]); ) {
        if (rowItem && rowItem["children"]) {
          let child: any = Array.from(rowItem["children"]);
          let childLen: number = child.length;
          for (let key = 0, item; (item = child[++key]); ) {
            if (key !== 0 && item.textContent) {
              let index = key - 1;
              if (
                !this.iswriting &&
                typeof item.textContent === "string" &&
                item.textContent.charCodeAt() > 255
              ) {
                this.iswriting = true;
              }
              if (!widthS[index] && !isArray(widthS[index])) {
                widthS[index] = item.offsetWidth;
              }
              if (isArray(widthS[index])) {
                recodeKey = widthS[index][0];
              }
              if (
                recodeKey !== 0 &&
                isArray(widthS[index]) &&
                widthS[index].length === 1 &&
                widthS[index][0] === recodeKey
              ) {
                let yk = index;
                let recodeArr: number[] = [];
                for (let i = 0; i < recodeKey; ++i) {
                  recodeFlag = yk > recodeFlag ? ++yk : ++recodeFlag;
                  recodeArr.push(child[recodeFlag].offsetWidth);
                }
                widthS[index] = recodeArr;
              }
            }
            if (key !== 0 && !item.textContent && !widthS[key - 1]) {
              widthS[key - 1] = item.offsetWidth;
            }
          }
        }
      }
      this.newTestArr = this.createTableArr(this.TestArr, widthS);
      this.setTestArr();
    }, 200);
  }
  // 记录表格，浏览器高度
  private setTableData: {
    [k: string]: number;
  } = {};
  // 当表格td有中文符合时为true
  private iswriting: boolean = false;
  private isPageFlag = false;
  private isBoolean(value?: boolean) {
    return typeof value === "boolean";
  }
  // 是否需要设定固定高度
  private getdocument(clas: string) {
    return document.getElementsByClassName(clas)[0];
  }
  private setTbD(iscollapsible?: boolean) {
    let { getdocument, setTbH } = this;
    if (!Object.keys(this.setTableData).length || this.isPageFlag) {
      let tabTd = getdocument("components-table-body");
      this.setTableData["offsetHeight"] = tabTd["offsetHeight"];
      this.setTableData["offsetTop"] = tabTd["offsetTop"];
      if (getdocument("ant-table-footer")) {
        let footer = getdocument("ant-table-footer");
        this.setTableData["footerHeight"] = footer["offsetHeight"];
        this.setTableData["pageHeight"] = 20;
      } else {
        let footer = getdocument("ant-pagination");
        this.setTableData["footerHeight"] = footer["offsetHeight"];
        this.setTableData["pageHeight"] = this.setTableData["footerHeight"];
        this.setTableData["pageHeight"] = 16;
      }
      this.setTableData["clientHeight"] = document.documentElement.clientHeight;
    }
    setTbH(iscollapsible);
  }
  private setTbH(iscollapsible?: boolean) {
    let { isBoolean } = this;
    const {
      footerHeight,
      offsetHeight,
      offsetTop,
      clientHeight,
      pageHeight
    } = this.setTableData;

    if (offsetHeight + offsetTop > clientHeight || isBoolean(iscollapsible)) {
      let height = clientHeight - offsetTop - footerHeight;
      let ispH = pageHeight !== 20;
      let hp: number = height + pageHeight;
      let hph: number = height - pageHeight;
      // 后端分页 边距
      // height - pageHeight 因为分页那一块有个margin:16px; 正常加上pageHeight间距就行了
      this.TableHeight = ispH ? hph : hp;
      this.isPageFlag = false;
    }
  }
  // td计算状态
  private isTd: boolean = false;
  private setTableHeight(iscollapsible?: boolean) {
    if (!this.data.length) return;
    let { setTbD, isBoolean, isTd } = this;
    if (!isTd) {
      this.getTdOffsetWidth();
      this.isTd = true;
    }
    this.$nextTick().then(() => {
      let isColl = isBoolean(iscollapsible);
      // 如果是高级搜索收缩
      if (isColl) {
        this.setTableData = {};
        setTimeout(() => {
          setTbD(iscollapsible);
        }, 500);
      } else {
        setTbD(iscollapsible);
      }
    });
  }
  private TableHeight: number = 0;
  private currentPage: number = 1;
  private pageSize: number = 10;

  get pagination() {
    return {
      showSizeChanger: true,
      pageSizeOptions: ["10", "20", "50", "100"],
      current: this.currentPage,
      pageSize: this.pageSize,
      showTotal: (total: number, range: Array<string>) =>
        `${range[0] || ""} - ${range[1] ||
          ""} records / Total ${total} records`,
      onChange: (page: any, pageSize: any) => {
        this.currentPage = page;
        this.pageSize = pageSize;
        // this.clearSelectRowKeys();
        // this.onSelect({}, false, []);
      },
      onShowSizeChange: (current: any, size: any) => {
        this.currentPage = current;
        this.pageSize = size;
      }
    };
  }

  /* 表格筛选 */
  private visible: boolean = false; //模态框显示
  private checkedList: any[] = []; //当前选中
  private indeterminate: boolean = true; //全选样式
  private checkAll: boolean = false; //全选
  private plainOptions: any[] = []; // 数据来源
  private TestArr: any[] = []; // 筛选头部数据
  private checkList: any[] = []; // 当前选中数据
  private selectedRowKeys: any[] = []; // 当前选中项key
  private selectedRowdatas: any[] = []; // 当前选中项data
  private expandedRowKeys: any[] = []; // 展开

  // 用于切换字母的状态
  private isActive: number = 0;
  //字母集
  private alphabet: string[] = alphabet;

  get rowSelection() {
    return {
      ...(this.useSelectedRowKeys
        ? {
            selectedRowKeys: this.selectedRowKeys
          }
        : {}),
      type: this.isSingleCheck ? "radio" : "checkbox",
      onChange: (selectedRowKeys: any, selectedRows: any) => {
        //input 框 全選 回調
        this.selectedRowKeys = selectedRowKeys;
        this.selectedRowdatas = selectedRows;
      },
      /* 用户手动选择/取消选择某列的回调 */
      onSelect: (record: any, selected: boolean, selectedRows: any) => {
        console.log(record, selected, selectedRows);
        /*选项切换的时候，发送给父组件 */
        this.onSelect(record, selected, selectedRows);
      },
      /* 用户手动选择/取消选择所有列的回调 */
      onSelectAll: (selected: any, selectedRows: any, changeRows: any) => {
        // console.log(selected, selectedRows, changeRows)
        this.onSelectAll(selected, selectedRows, changeRows);
      }
    };
  }

  get calcScrollX() {
    if (
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
        return (this.checkedList.length / this.columns.length) * this.scrollX;
      }
      return 165 * this.checkedList.length * (+this.scrollX || 1);
    }
  }
  /**
   * 点击字母
   * toggleAlphabet
   */
  public toggleLetter(item: string, index: number): void {
    console.log(item, index);
    this.isActive = index;
    this.toggle_letter(item, index);
  }

  private expandedRowsChange(expandedRows: any) {
    this.expandedRowKeys = expandedRows;
  }
  //排序
  public tableOnChange(pagination, filters, sorter) {
    if (Object.keys(pagination).length) {
      this.isPageFlag = true;
      this.setTableHeight();
    }
    // console.log(filters);
    // console.log(sorter);
    // 服务端排序回调
    if (Object.keys(sorter).length) {
      this.sorterFun(sorter);
    }
  }
  // 单击多选框触发事件
  public onChange(checkedList: any) {
    console.log(this.pagination);
    this.indeterminate =
      !!checkedList.length && checkedList.length < this.plainOptions.length;
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

  // 筛选条件
  public Comfirm() {
    if (this.checkedList.length === 0) {
      this.$message.warning(
        "Please check the fields that need to be displayed"
      );
      return;
    }
    this.visible = !this.visible;
    if (this.checkAll) {
      this.setTestArr();
      //   this.TestArr = this.columns;
      return;
    }
    const arr: any = [];
    this.columns.forEach((item: any, index: number) => {
      for (const key in this.checkedList) {
        if (
          this.checkedList[key] === item.title ||
          this.checkedList[key] === item.dataIndex ||
          this.checkedList[key] === item.decorator
        ) {
          const newItem = Object.assign({}, item, {
            width: item.width
              ? item.width
              : (100 / this.checkedList.length).toFixed(2) + "%"
          });
          arr.push(newItem);
        }
      }
    });
    let width = 0;
    this.newTestArr.forEach((element, key) => {
      arr.forEach(item => {
        if (element.title === item.title) {
          item.width = element.width;
          width += item.width;
        }
      });
    });
    this.TestArr = arr;
  }

  public Return() {
    this.visible = !this.visible;
  }

  public clearSelectRowKeys() {
    this.selectedRowKeys = [];
  }
  public textTotal(total: number, range: Array<string>) {
    return `${range[0] || ""} - ${range[1] ||
      ""} records / Total ${total} records`;
  }
  // 页码改变的回调，参数是改变后的页码及每页条数
  public pageChange(page, pageSize) {
    this.backPaginationObj.currPage = page;
    this.backPaginationObj.pageSize = pageSize;
    this.onPageChange(page, pageSize);
  }
  // pageSize 变化的回调
  // public showSizeChange(current, size) {
  //   this.backPaginationObj.currPage = current;
  //   this.backPaginationObj.pageSize = size;
  //   this.onShowSizeChange(current, size);
  // }
  // 初始表格数据width
  private childrenKey: number = 0;
  private widthAggregate: number[] = [];
  // 宽度最小最大范围
  private widthRange: { [k: string]: number } = {
    minWidth: 100,
    maxWidth: 300
  };
  private createTableArr(list: any, widthS?: number[] | boolean | string) {
    let new_list = typeof widthS !== "boolean" ? deepClone(list) : list;
    let { widthRange } = this;
    new_list.forEach((item: any, index: number) => {
      // 初始宽度
      if (typeof widthS === "boolean") {
        // item.width = 0;
        this.widthS.push(undefined);
      }
      // 宽度赋值
      if (Array.isArray(widthS) && !item.children && !isArray(widthS[index])) {
        this.widthAggregate = widthS;
        if (widthS[index] > widthRange.maxWidth) {
          widthS[index] = widthRange.maxWidth;
        }
        if (widthS[index] < widthRange.minWidth) {
          widthS[index] = widthRange.minWidth;
        }
        item.width = widthS[index];
      }
      // 处理 children
      if (typeof widthS === "string" && this.widthAggregate[this.childrenKey]) {
        item.width = this.widthAggregate[this.childrenKey][index];
      }
      // 如果有 children
      if (item.children) {
        !isArray(widthS) && (this.widthS[index] = [item.children.length]);
        this.childrenKey = index;
        this.createTableArr(item.children, "children");
        delete item.width;
      }
    });
    return new_list;
  }
  private created() {
    Vue.prototype.$setTableHeight = (isCollapsed: boolean) => {
      this.setTableHeight(isCollapsed);
    };
    if (!this.isTableHeight) {
      this.createTableArr(this.TestArr, true);
    }
  }
}
</script>

<style lang="scss">
.table-td .ant-table-tbody > tr > td {
  word-break: break-all;
}
.table-td-writing .ant-table-tbody > tr > td {
  word-break: break-word !important;
}
.components-table-body {
  ::-webkit-scrollbar-thumb {
    /* 滚动条 拖动条 */
    background-color: rgba(127, 127, 127, 0.25);
  }
  ::-webkit-scrollbar-track {
    /* 滚动条背景槽 */
    background-color: rgba(127, 127, 127, 0.25);
  }
}
/* 清楚自带展开图标 */
.test .ant-table-row-expand-icon-cell .ant-table-row-expand-icon {
}

.test .ant-table-thead > tr:first-child > th:first-child {
  /* display: none; */
}

.test thead th {
  // background-color: rgba(231, 233, 245, 0.6);
  padding: 12px 4px;
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

.alphabetList {
  display: flex;
}

.resetBtn {
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  margin-right: 5px;
  border-color: #3e77d8;
  color: #3e77d8;
  margin-top: 15px;
  font-size: 14px;
  margin-bottom: 12px;
}

.components-table {
  overflow: unset;

  .ant-table-thead > tr > th,
  .ant-table-tbody > tr > td {
    font-size: 14px;
    padding: 10px 4px;
    vertical-align: middle;
    text-align: center;
  }

  // .ant-table-thead>tr>th {
  //     padding: 12px 4px;
  //     background-color: rgba(231, 233, 245, 0.6);
  // }

  .components-table-body {
    box-shadow: 0 -2px 4px rgb(236, 236, 236), 0 2px 4px rgba(0, 0, 0, 0.15);
    overflow: auto;
  }

  .components-table-body-table,
  &.reduce-margin {
    .ant-table-thead > tr > th,
    .ant-table-tbody > tr > td {
      padding: 2px;
    }
  }

  .ant-checkbox-group {
    .ant-checkbox-group-item {
      width: 180px;
    }
  }

  .ant-table-pagination.ant-pagination {
    margin-left: 20px;
    float: left;
  }
}

// .commaSplitNumber {
//   max-width: 300px;
// }
</style><style lang="scss" scoped>
.defined {
  position: relative;
  text-align: right;
  display: flex;
  // overflow: hidden;
  font-family: "Microsoft YaHei";

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

  /*button {
        background: transparent;
        border: 0;
        color: #1890ff;
        font-weight: 600;
        margin: 10px 0px;
        box-shadow: none;
        outline: none;
        // position: absolute;
        // right: 0;
      }*/
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

.alphabetList {
  font-family: "Microsoft YaHei";
}
</style>
