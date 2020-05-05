<template>
<div class="home-table card" ref="homeTable">
    <div class="card-header">
        <div class="card-title" @click="toggleModal">{{title}}</div>
        <!-- select框 -->
        <a-select v-model="selectValue" v-if="type!=='echarts' && selectOptions && selectOptions.length" class="card-select" :style="{
            width:  selectWildth?selectWildth:'126px'
        }" style="margin-right:10px">
            <a-select-option v-for="(optionsItem,index) in selectOptions" :key="index" :value="optionsItem.value">{{optionsItem.name}}</a-select-option>
        </a-select>
    </div>
    <div class="card-center" v-if="type==='echarts' && selectOptions && selectOptions.length">
        <!-- 多选框 -->
        <a-checkbox-group v-model="selectValue">
            <a-checkbox v-for="(optionsItem,index) in selectOptions" :key="index" :value="optionsItem.value">{{optionsItem.name}}</a-checkbox>
        </a-checkbox-group>
    </div>
    <!-- 选项卡按钮 -->
    <div class="card-select-btn" v-if="selectBtn && selectBtn.length">
        <div class="select-btn-item" :class="index==activeIndex?'active':''" v-for="(item,index) in selectBtn" :key="index" @click="selectBtnClick(index)">{{item}}
            <div class="activePoint"></div>
        </div>
    </div>
    <div class="card-content">
        <!-- 图 -->
        <div v-if="type==='echarts'" ref="echarts" class="home-table-canvas-normal" :style="{
            width:canvansWidth
        }" @click="titleClick"></div>
        <!-- table -->
        <f-table v-else :isHasBoxShadow="false" :singlePageTableClass="['home-page-table']" :isPagination="false" :useDefined="false" :isFinance="true" ref="table" :columns="columns" :data="data.slice(0,tableLen)" scrollX="100%" :isTableHeight="true" zebraStripe/>
    </div>
    <!-- 弹出框 -->
    <a-modal centered class="edit-modal home-table" width="950px" v-model="modalVisible" :footer="null" :title="title">
        <div class="body">
            <!-- 选项卡按钮 -->
            <div class="card-select-btn" v-if="selectBtn && selectBtn.length">
                <div class="select-btn-item" :class="index==activeIndex?'active':''" v-for="(item,index) in selectBtn" :key="index" @click="selectBtnClick(index)">{{item}}
                    <div class="activePoint"></div>
                </div>
            </div>
            <div class="card-select-btn-right">
                <div class="card-center" v-if="type==='echarts' && selectOptions && selectOptions.length">
                    <!-- 多选框 -->
                    <a-checkbox-group v-model="selectValue">
                        <a-checkbox v-for="(optionsItem,index) in selectOptions" :key="index" :value="optionsItem.value">{{optionsItem.name}}</a-checkbox>
                    </a-checkbox-group>
                </div>
                <!-- select框 -->
                <a-select v-model="selectValue" v-if="type!=='echarts' && selectOptions && selectOptions.length" class="card-select" :style="{
                    width:  selectWildth?selectWildth:'126px'
                }" style="margin-right:10px">
                    <a-select-option v-for="(optionsItem,index) in selectOptions" :key="index" :value="optionsItem.value">{{optionsItem.name}}</a-select-option>
                </a-select>
            </div>
            <!-- echarts -->
            <div v-if="type==='echarts'" ref="allEcharts" class="home-table-canvas-all" :style="{
            height:canvansHeight
            }" @click="titleClick"></div>
            <!-- 分页 -->
            <template v-if="type==='echarts'">
                <div class="statement-pagination">
                    <pagination @change="onChangPage" @showSizeChange="onShowSizeChange" :total="option.yAxis.data.length || 0" :currentPage.sync="pageConfig.currentPage" :pageSize.sync="pageConfig.pageSize" />
                </div>
            </template>
            <!-- table -->
            <f-table v-else :isHasBoxShadow="false" :singlePageTableClass="['home-page-table']" scrollX="100%" :useDefined="false" :isFinance="true" ref="table" :columns="columns" :data="data" zebraStripe />
        </div>
        <div class="text-center p-t-20">
            <a-button class="return-btn" @click="toggleModal">Return</a-button>
        </div>
    </a-modal>
</div>
</template>

<script lang="ts">
import Vue from "vue";
import {
    Component,
    Prop,
    Emit,
    Watch
} from "vue-property-decorator";
// import echarts from 'echarts'
import echarts from '@/lib/echarts' // 按需加载
import {
    deepClone
} from '@/assets/ts';

@Component({
    components: {
        fTable: () => import("views/Finance/components/Table/index.vue"),
        pagination: () => import("@/common/pagination/index.vue"),
    }
})
export default class OverdueAgreement extends Vue {
    @Prop([String, Number]) privateKey ? : any; // 组件标识 
    @Prop(String) title ? : string;
    @Prop(Array) data ? : Array < object > ; // 表格 data
    @Prop(Array) columns ? : Array < object > ; // 表格 表头
    @Prop([String, Number, Array]) value ? : any; // select框 |  多选框 的绑定值
    @Prop(Array) selectOptions ? : Array < object > ; // select | 多选框 options
    @Prop(Number) activeIndex ? : any; // 选项卡 按钮高亮下标
    @Prop(Object) option ? : any; // 传入 echarts的option
    @Prop(String) type ? : string; // 类型
    @Prop({
        type: Number,
        default: 8
    }) tableLen?: number // 非弹出框的table 显示个数  
    @Prop(String) selectWildth ? : string; // select框的width
    @Emit('onTabsClick') onTabsClick(index: number, privateKey: any) {} // 选项卡 按钮点击的回调
    @Emit('onSelectChange') onSelectChange(val: number | string, privateKey: any) {} // select框 修改的回调
    @Prop(Array) selectBtn ? : Array < object > ; // select btn
    @Watch('option', {
        deep: true
    })
    onChangeOptions(newVal: any, oldVal: any) {
        if (this.type === 'echarts') {
            this.myChart.showLoading()
            if (this.timer) {
                clearTimeout(this.timer)
            }
            this.timer = setTimeout(() => {
                this.setMychart(newVal)
                this.modalVisible && this.setModalchart(this.option)
            }, 100)
        }
    }

    public myChart: any // echarts 实例
    public myAllChart: any //modal的 echarts 实例
    private timer: number = 0 // 定时器的id
    private now: number = 0 // 上一次操作时间
    private modalVisible: boolean = false // modal 显隐
    private canvansWidth: string = '100%' // canvans小的框
    private canvansHeight: string = '400px' // modal的canvans的高度

    // 对 echarts 有用
    private pageConfig: any = {
        currentPage: 1,
        pageSize: 10
    }

    private get active() {
        return this.activeIndex
    }
    private set active(index: number) {
        if (this.timer) {
            clearTimeout(this.timer)
        }
        this.timer = setTimeout(() => {
            this.$emit("update:activeIndex", index);
            this.onTabsClick(index, this.privateKey)
            if (this.modalVisible && this.type === 'echarts') {
                this.pageConfig.currentPage = 1
            }
        }, 50)

        // const now = Date.now()
        // if (now - this.now > 2000) {
        //     this.$emit("update:activeIndex", index);
        //     this.onTabsClick(index, this.privateKey)
        //     this.now = now
        // } else {
        //     if (this.timer) {
        //         clearTimeout(this.timer)
        //     }
        //     this.timer = setTimeout(() => {
        //         this.$emit("update:activeIndex", index);
        //         this.onTabsClick(index, this.privateKey)
        //     }, 2000 - (now - this.now))
        // }
    }

    // select 绑定value
    private get selectValue() {
        return this.value;
    }
    private set selectValue(val: number | string) {
        if (this.timer) {
            clearTimeout(this.timer)
        }
        this.timer = setTimeout(() => {
            this.$emit('input', val)
            this.onSelectChange(val, this.privateKey)
        }, 50)
    }

    private selectBtnClick(index: number) {
        this.active = index;
    }

    private setMychart(optionSource): void {
        const option = deepClone(optionSource)
        option.yAxis.data = option.yAxis.data.slice(0, 5).reverse()
        option.series[0].data = option.series[0].data.slice(0, 5).reverse()
        option.series[1].data = option.series[1].data.slice(0, 5).reverse()
        option.series[2].data = option.series[2].data.slice(0, 5).reverse()
        option.series[3].data = option.series[3].data.slice(0, 5).reverse()
        this.myChart.setOption(option);
        this.myChart.hideLoading()
    }
    private initMyChart() {
        // 基于准备好的dom，初始化echarts实例
        this.myChart = echarts.init((this as any).$refs.echarts)
        this.setMychart(this.option)
    }

    private setModalchart(optionSource): void {
        this.myAllChart.showLoading()
        const option = deepClone(optionSource)
        const start: number = (this.pageConfig.currentPage - 1) * this.pageConfig.pageSize || 0
        const end: number = this.pageConfig.currentPage * this.pageConfig.pageSize || 10
        console.log('start', start);
        console.log('end', end);
        option.yAxis.data = option.yAxis.data.slice(start, end).reverse()
        option.series[0].data = option.series[0].data.slice(start, end).reverse()
        option.series[1].data = option.series[1].data.slice(start, end).reverse()
        option.series[2].data = option.series[2].data.slice(start, end).reverse()
        option.series[3].data = option.series[3].data.slice(start, end).reverse()
        this.myAllChart.setOption(option);
        const height: number = option.series[0].data.length / 5 * 400
        this.canvansHeight = height + 'px'
        this.myAllChart.resize({
            // width: 
            height
        })

        this.myAllChart.hideLoading()
    }
    private toggleModal(e, isShow ? : boolean) {
        this.modalVisible = isShow ? true : !this.modalVisible
        if (this.modalVisible && this.type === 'echarts') {
            this.$nextTick(() => {
                if (!this.myAllChart) {
                    this.myAllChart = echarts.init((this as any).$refs.allEcharts)
                }
                this.setModalchart(this.option)
            })
        }
    }

    private onChangPage(currentPage: number) {
        // console.log('this.pageConfig', this.pageConfig);
        this.toggleModal(undefined, true)
    }
    private onShowSizeChange(currentPage: number, pageSize: number) {
        // console.log('this.pageConfig', this.pageConfig);
        this.toggleModal(undefined, true)
    }
    private getCanvansWidth() {
        if (this.type === 'echarts') {
            if (!this.$refs.homeTable) {
                return
            }
            const contentWidth: number = (this.$refs.homeTable as any).offsetWidth
            const width: number = Math.round(contentWidth) - 10
            this.canvansWidth = width + 'px';
            this.myChart.resize({
                width
            })
        }
    }

    private titleClick() {
        this.$router.push('/Home/Contract/VcContract')
    }

    private created() {
        // 访问接口
        // 渲染dom后
        if (this.type === 'echarts') {
            this.$nextTick(() => {
                this.initMyChart()
            })
        }
    }

    private destroyed() {
        if (this.myChart) this.myChart.clear();
        if (this.myAllChart) this.myAllChart.clear();
    }

}
</script>

<style lang="scss">
@import "@/views/Finance/common/css/deep-modal.scss";

.home-page-table.components-table {

    .ant-table-thead>tr>th,
    .ant-table-tbody>tr>td {
        font-size: 14px;
        padding: 4px 2px;
        vertical-align: middle;
        text-align: center;
        border-right: unset;
        line-height: 18px;
    }

    .ant-table-tbody>tr>td {
        padding: 0px 2px !important;
        // height: 20px;
    }

    .ant-table-thead>tr>th {
        background-color: rgb(232, 234, 246);
        color: #333333;
    }

}

.home-table {
    .ant-table-body {
        overflow-x: auto !important;

        &::-webkit-scrollbar {
            height: 6px;
        }

        &::-webkit-scrollbar-thumb {
            border-radius: 6px;
            -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
            background: #d4d4d3;
            cursor: pointer;
        }

        &::-webkit-scrollbar-track {
            -webkit-box-shadow: 0;
            border-radius: 0;
            cursor: pointer;
            //   background: #191f28;
            //   background: #ffffff;
        }
    }
}
</style><style lang="scss" scoped>
@import "@/views/Finance/common/css/modal.scss";

.home-table-canvas-normal {
    // width: 370px;
    width: 95%;
    height: 300px;
    // margin: 0 auto;
    position: absolute;
    left: 50%;
    top: 0;
    transform: translate3d(-50%, 0, 0);
}

.home-table-canvas-all {
    width: 850px;
    height: 800px;
    margin: 0 auto;
}

.card-select-btn {
    margin: auto;
    width: 300px;
    margin-bottom: 10px;
    font-size: 16px;
    display: flex;
    text-align: center;
    cursor: pointer;
    line-height: 30px;
    height: 30px;

    .select-btn-item {
        flex: 1;
        position: relative;
        transition: all 0.5s cubic-bezier(0.39, 0.575, 0.565, 1);

        &.active {
            color: rgb(67, 67, 253);

            .activePoint {
                width: 60%;
                height: 3px;
                background: rgb(67, 67, 253);
                position: absolute;
                bottom: -4px;
                left: 50%;
                // margin-left: -9px;
                transform: translate3d(-50%, 0, 0)
            }
        }

        &:hover {

            color: rgb(67, 67, 253);
        }
    }
}

.home-table {
    background-color: #ffffff;
    min-height: 470px;
    height: 470px;
    // overflow: hidden;
    overflow: auto;

    .card-header {
        margin-top: 6px;
        margin-bottom: 10px;
        display: flex;
        line-height: 28px;

        .card-title {
            flex: 1;
            font-size: 16px;
            font-weight: 600;
            line-height: 16px;
            border-left: #3e77d8 6px solid;
            padding: 2px 0 2px 10px;
            margin-top: 4px;
            margin-bottom: 4px;
            white-space: nowrap;
            cursor: pointer;
            transition: all 0.5s cubic-bezier(0.39, 0.575, 0.565, 1);

            &:hover {
                color: #0000ff
            }
        }

        .card-select {
            flex: 0 0 126px;

            .ant-select-selection--single {
                line-height: 28px;

                .ant-select-selection__rendered {
                    line-height: 28px;
                }
            }
        }
    }

    .card-center {
        margin-left: 10px;
        height: 28px;
        line-height: 28px;
    }

    .card-content {
        position: relative;
        padding: 0 14px;
        overflow: auto;
        min-height: 400px;

        .content-top {
            display: flex;

            .item {
                // overflow: hidden;
                margin: 0 8px;
                flex: 1;
                background-color: rgb(130, 83, 200);
                text-align: center;
                color: #ffffff;

                &.item-right {
                    background-color: rgb(250, 94, 36);
                }

                .item-title {
                    font-size: 14px;
                    line-height: 34px;
                }

                .item-content {
                    font-size: 16px;
                    font-weight: 700;
                    line-height: 44px;
                }
            }
        }
    }
}

.body {
    position: relative;

    .card-select-btn-right {
        position: absolute;
        top: 20px;
        right: 24px;
    }
}
</style>
