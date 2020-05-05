<template>
<div class="contract-product" style="background:#fff; padding:0px 20px;">
    <a-form :form="form">
        <!-- layout="inline" -->
        <a-row>
            <a-col :span="12">
                <!-- :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }" -->
                <a-form-item label="Product" :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }" :colon="false">
                    <a-select notFoundContent="No product" v-decorator="[
          'note',
          {rules: [{ required: true, message: 'Please input your note!' }]}
        ]" :getPopupContainer="triggerNode => triggerNode.parentNode" placeholder="Product">
                        <a-select-option v-for="(item,key) in  rateplanArr || []" :key="key" @click="productnameChange(key,item)" :value="item.typeName">{{item.typeName || undefined}}</a-select-option>
                        <!-- <a-select-opt-group v-for="(outerItem,index) in showRatePlanObject" :key="index">
                            <span slot="label">
                                <a-icon type="home" /> {{outerItem.ratePlanName}}</span>
                            <a-select-option v-for="(item) in  outerItem.tabs" :key="item.index" @click="productnameChange(item.index,item)" :value="item.index">{{item.typeName || undefined}}</a-select-option>
                        </a-select-opt-group> -->
                    </a-select>
                </a-form-item>
            </a-col>
            <a-col :span="6" style="padding-right:10px">
                <!-- <a-tooltip placement="top">
                    <template slot="title">
                        <span>{{isTabs && 'No product' || 'Insert system record'}}</span>
                    </template> -->
                <span class="record disabled" v-if="isTabs">Insert system record</span>
                <span class="record" @click="DuplicateHide" v-else>Insert system record</span>
                <!-- </a-tooltip> -->
            </a-col>
            <a-col :span="6" style="padding-right:10px">
                <!-- <a-tooltip placement="top">
                    <template slot="title">
                        <span>{{isTabs && 'No product' || 'Duplicate current record'}}</span>
                    </template> -->
                <div>
                    <span class="record disabled" v-if="isTabs">Duplicate current record</span>
                    <dupli-cate :listcolum="dupliCateArr" @productCheck="productCheck" v-else>
                        <span class="record">Duplicate current record</span>
                    </dupli-cate>
                </div>
                <!-- </a-tooltip> -->
            </a-col>
        </a-row>
        <model title="Product" v-model="InsertVisible" width="1100px" @Screencover="DuplicateHide">
            <template slot="model-body">
                <AdvancedSearch :formoptions="formOptions" @Submit="SearchOk" allowClear @onform="onForm" />
                <!-- <a-table :columns="columns" :dataSource="data" bordered :scroll="{ x: 600}" :rowSelection="rowSelection">
                    <div slot="ProductDetails" slot-scope="text, record">
                        <a href="javascript:;" @click="getDetailShow(record)">Details
                            <a-icon type="down" /></a>
                    </div>
          </a-table>-->

                <Table @insertDetail="insertDetail" :rowSelection="rowSelection" :columns="columns" :data="data" zebraStripe bordered :scroll="{ x: 600 }" />
                <a-row>
                    <a-col :span="24" :style="{ textAlign: 'center' ,marginTop:'16px'}">
                        <a-button type="primary" :style="{ borderRadius: '50px 50px 50px 50px' }" @click="confirm">Confirm</a-button>
                        <a-button type="primary" @click="DuplicateHide" :style="{ borderRadius: '50px 50px 50px 50px', background:'0px', color: '#1890ff', marginLeft:'8px' }">return</a-button>
                    </a-col>
                </a-row>
                <product-detail :isVisible.sync="isVisible" :productId="productId"></product-detail>
            </template>
        </model>
        <a-row>
            <!-- :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }"  -->
            <a-col :span="12">
                <a-form-item label="Direction" :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }" :colon="false">
                    <a-input placeholder="Basic usage" disabled v-decorator="[
                    'direction',
                    {rules: [{ required: true, message: 'Please input your direction!' }],initialValue:direction}
                    ]" />
                </a-form-item>
            </a-col>
            <a-col :span="12">
                <a-form-item label="Rate Structure" :label-col="{ span: 7 }" :wrapper-col="{ span: 16 }" :colon="false">
                    <a-select disabled :getPopupContainer="triggerNode => triggerNode.parentNode" @change="rateStructre" placeholder="RateStructure" v-decorator="[
                    'Ratestructre',
                    {rules: [{ required: true, message: 'Please input your RateStructure!' }],initialValue:isComponent}
                    ]">
                        <a-select-option v-for="(item,key) in Ratestructre" :key="key">{{item}}</a-select-option>
                    </a-select>
                </a-form-item>
            </a-col>
        </a-row>
    </a-form>
    <keep-alive>
        <div class="dynamic-code" :editData="editData" :editArr="rateplanArr" :contractIndex="contractIndex" :is="isComponent" ref="reference" :key="typenameIndex" :productKey="typenameIndex" />
    </keep-alive>
</div>
</template>

<script lang="ts">
declare module "vue/types/vue" {
    // 声明插件Vue不认识的方法
    interface Vue {
        // $message: any,
        //     $form: any,
        //     localStorage: any,
        //     event: any
    }
}
import Vue from "vue";
import {
    AxiosGet
} from "@/api/axios";
import {
    Component,
    Prop,
    Watch
} from "vue-property-decorator";
import {
    State,
    Mutation
} from "vuex-class";
import {
    deepClone
} from '@/assets/ts';
import moment from 'moment'
@Component({
    components: {
        AdvancedSearch: resolve =>
            require(["@/common/Advancedsearch/index.vue"], resolve),
        Table: resolve => require(["@/common/Table/index.vue"], resolve),
        Flat: resolve => require(["./rateStructre/Flat/index.vue"], resolve),
        Tier: resolve => require(["./rateStructre/Tier/index.vue"], resolve),
        Interval: resolve => require(["./rateStructre/inTerval/index.vue"], resolve),
        RecurringCharge: resolve =>
            require(["./rateStructre/recurringCharge/index.vue"], resolve),
        Penalty: resolve => require(["./rateStructre/penAlty/index.vue"], resolve),
        OneTimeCharge: resolve =>
            require(["./rateStructre/onetimeCharge/index.vue"], resolve),
        Cap: resolve => require(["./rateStructre/Cap/index.vue"], resolve),
        DisCount: resolve => require(["./rateStructre/disCount/index.vue"], resolve),
        dupliCate: resolve => require(["./duplicate.vue"], resolve),
        model: resolve => require(["@/common/Model/index.vue"], resolve),
        productDetail: resolve =>
            require(["@/components/AddNewContract/productDetail.vue"], resolve)
    }
})
export default class product extends Vue {
    @State("ratePlanObject") private ratePlanObject: any;
    @State("productForm") private productForm: any;
    @State("productIndex") private productIndex ? : any;
    @Mutation("mutionProdurt") private mutionProdurt ? : any;
    @State("contractData") contractData: any;
    @State("prossData") prossData: any;
    @State("contractIndex") private contractIndex: any;
    @State('editData') editData: any
    @Mutation("mutionProcutName") mutionProcutName ? : any;
    @Prop(Array) public dataSources: any
    @Prop(Boolean) private isSync: any
    @State('closeModel') closeModel: any

    private typeArr: string[] = [""];
    private recordTabs: any[] = []
    public columns: any[] = [{
            title: "Account",
            dataIndex: "accountName",
            key: "accountName",
            width: "10%"
            // sorter: (a:any, b:any) => a.age - b.age -> 排序声明函数
        },
        {
            title: "Contract",
            dataIndex: "contractName",
            key: "contractName",
            width: "10%"
            // sorter: (a:any, b:any) => a.age - b.age -> 排序声明函数
        },
        {
            title: "Rate plan",
            dataIndex: "ratePlanName",
            key: "ratePlanName",
            width: "20%"
        },
        {
            title: "Product",
            dataIndex: "productName",
            key: "productName",
            width: "20%",
            customRender: (text: any, row: any, index: number) => {
                return {
                    children: (text && text) || undefined
                };
            }
        },
        {
            title: "Begin date",
            dataIndex: "beginDate",
            key: "beginDate"
        },
        {
            title: "End date",
            dataIndex: "endDate",
            key: "endDate"
        },
        {
            title: "Product details",
            dataIndex: "ProductDetails",
            // width: '8%',
            key: "ProductDetails",
            scopedSlots: {
                customRender: "ProductDetails"
            }
        }
    ];
    public data: any[] = [];
    private dupliCateArr: any[] = [];
    /* direction 方向 */
    private direction: string | undefined = "";
    private form: any;
    private typenameIndex: number = new Date().getTime();
    private typeName: string = "";
    private isTabs: boolean = false;
    private rateplanArr: any[] = [];
    /* 给form 添加当前实例 */
    private beforeCreate() {
        this.form = this.$form.createForm(this);
    }

    /* 表格选中数据 */
    private selectedRows: any[] = [];
    /* Insert system record */
    private InsertVisible: boolean = false;
    /* 动态组件 -> 默认 Flat */
    private isComponent: string = "";
    private structureForm: any;
    private timer: number = 0;
    private editIndex: number = new Date().getTime()
    public componentArr: string[] = ['Flat', 'Tier', 'Interval', 'RecurringCharge', 'OneTimeCharge', 'Penalty', 'Cap', 'disCount'];
    /* 高级搜索 */
    private formOptions: any[] = [{
            Tips: "Account",
            name: "accountName",
            required: false,
            type: "select",
            options: null
        },
        {
            Tips: "Contract",
            name: "contractNameList",
            required: false,
            type: "tags",
            options: null
        },
        {
            Tips: "Service",
            name: "configServiceNameList",
            required: false,
            type: "tags",
            options: null
        },
        {
            Tips: "Direction",
            name: "direction",
            required: false,
            type: "select",
            options: [{
                    name: "Inbound"
                },
                {
                    name: "Outbound"
                }
            ]
        },
        {
            Tips: "Cycle",
            name: "cycleNameList",
            required: false,
            type: "select",
            options: null
        },
        // {
        //     Tips: 'Rate plan',
        //     name: 'ratePlan',
        //     required: false,
        //     type: 'select',
        //     options: [{
        //         name: 'Rate plan1'
        //     }, {
        //         name: 'Rate plan2'
        //     }]
        // },
        {
            Tips: "Rate structure",
            name: "rateStructure",
            required: false,
            disabled: true,
            type: "select",
            options: null,
            isresetField: false
        }
        // {
        //     Tips: 'Product',
        //     name: 'Product',
        //     required: false,
        //     type: 'select',
        //     options: [{
        //         name: 'Product1'
        //     }, {
        //         name: 'Product2'
        //     }]
        // },
        // {
        //     Tips: 'begin date',
        //     name: 'beginDate',
        //     required: false,
        //     type: 'picker'
        // },
        // {
        //     Tips: 'End date',
        //     name: 'EndDate',
        //     required: false,
        //     type: 'picker'
        // },
        // {
        //     Tips: 'Operating state',
        //     name: 'operatingState',
        //     required: false,
        //     type: 'select',
        //     options: [{
        //         name: 'Operating state1'
        //     }, {
        //         name: 'Operating state2'
        //     }]
        // }
    ];

    public get rowSelection() {
        return {
            type: "radio",
            onSelect: (record: object, selected: boolean, selectedRows: any) => {
                this.selectedRows = selectedRows;
            }
        };
    }

    /* DuplicateHide product 插入 */
    public DuplicateHide() {
        this.data = [];
        this.InsertVisible = !this.InsertVisible;
    }

    /* Ratestructre */
    private Ratestructre: string[] = [
        "Flat",
        "Tier",
        "Interval",
        "RecurringCharge",
        "OneTimeCharge",
        "Penalty",
        "Cap",
        "DisCount"
    ];
    private Direction: string[] = ["Inbound", "Outbound", "Bilateral"];
    private showRatePlanObject: any[] = [] // 展示的 ratePlan
    /* 高级搜索回调 */
    public SearchOk(values: any): void {
        const data = {
            params: {
                accountName: values.accountName || undefined,
                contractNameList: (values.contractNameList && values.contractNameList.join(",")) ||
                    undefined,
                configServiceNameList: (values.configServiceNameList &&
                        values.configServiceNameList.join(",")) ||
                    undefined,
                direction: this.Direction.indexOf(values.direction) + 1 || undefined,
                cycleNameList: values.cycleNameList,
                rateStructure: this.Ratestructre.indexOf(values.rateStructure) + 1 || undefined
            }
        };
        AxiosGet("/vc-contract/products/summary", data, "/contract").then(
            (res: any) => {
                this.data = res.data;
            }
        );
    }

    /* 用户手动选择/取消选择所有列的回调  Table -> 回调 */
    public onSelectAll(selected: any, selectedRows: any, changeRows: any) {
        // console.log(selected, selectedRows, changeRows);
    }
    /* 用户手动选择/取消选择某列的回调
          @param record: 选中数据
          @param selected: 是否选中 true/false
          @param selectedRows: 所有选中 Array
          */
    public onSelect(record: object, selected: boolean, selectedRows: any) {
        this.selectedRows = selectedRows;
    }

    /* rateStructre */
    public rateStructre(index: number) {
        const componentArr: string[] = [
        "Flat",
        "Tier",
        "Interval",
        "RecurringCharge",
        "OneTimeCharge",
        "Penalty",
        "Cap",
        "DisCount"
    ];
        this.isComponent = componentArr[index];
    }
    /* productName */
    public productnameChange(
        key: number,
        value: {
            RateStructure: string;
            sourceUni: number;
            productKey: number;
            typeName: string;
            direction: number;
            ratePlanName: string;
        }
    ) {
        console.log('value', value);

        // if (!value.RateStructure) {
        //     return this.$error({
        //         title: '缺少 Rate structure',
        //         content: 'rate plan 缺少 Rate structure',
        //     });
        // }
        this.direction = this.Direction[value.direction - 1];
        this.isComponent = value.RateStructure;
        console.log(this.isComponent);
        
        this.typenameIndex = Number(value.productKey) || new Date().getTime();
        /* 设置默认值 */
        this.form.setFieldsValue({
            Ratestructre: value.RateStructure
        });
        this.mutionProdurt(key);
        this.mutionProcutName(value.ratePlanName);
        this.$set(this.dupliCateArr, 0, this.getdupliCateArr(value.typeName));
    }

    public created() {
        Vue.prototype.asyncProductData = async () => {
            this._asyncProductData;
        };

        // const tabs: any = this.getRatePlanProduct()
        // if (
        //     this.ratePlanObject.length &&
        //     tabs.length &&
        //     !this.direction &&
        //     !this.isComponent
        // ) {
        //     this.direction = this.ratePlanObject[0].Direction || undefined;
        //     this.isComponent = tabs[0].RateStructure || undefined;
        //     return false;
        // }

        // this.typenameIndex = +tabs[0].productKey;
        console.log('this.typenameIndex', this.typenameIndex);

        AxiosGet("/config/droplist/accounts").then((res: any) => {
            this.formOptions[0]["options"] = res.data || [];
        });
        AxiosGet("/config/droplist/contracts").then((res: any) => {
            this.formOptions[1]["options"] = res.data || [];
        });
        AxiosGet("/config/droplist/services").then((res: any) => {
            this.formOptions[2]["options"] = res.data || [];
        });
        AxiosGet("/config/droplist/cycles").then((res: any) => {
            this.formOptions[4]["options"] = res.data || [];
        });
    }

    /* 插入 */
    public async confirm() {
        if (!this.selectedRows.length) {
            this.$message.warning('not checked')
            return false
        }
        const arrNum: number[] = this.selectedRows.map((element: any) => element.productId)
        const reference: any = this.$refs.reference;
        let data: any = {};
        await AxiosGet(
            "/contract/vc-contract/products/contents/" + arrNum.join(",")
        ).then((res: any) => {
            // if (res.code > 1) {
            //     return this.$message.error(res.msg);
            // }
            data = res.data[0] || res[0];
        });
        let RateStructure = this.isComponent.toLocaleUpperCase();
        if (data.productName.toLocaleUpperCase().indexOf(RateStructure) === -1) {
            return this.$message.warning("只能引用Rate structure一样的产品");
        }
        if (!reference) {
            return this.$message.warning("未捕获实例->assignmentData");
        }
        this.InsertVisible = !this.InsertVisible;
        this.selectedRows = []
        console.log("data", data);
        this.$nextTick(() => {
            // 防抖
            if (this.timer) {
                clearTimeout(this.timer);
            }
            this.timer = setTimeout(() => {
                reference.assignmentData(data);
            }, 200);
        });
    }

    /* productCheck 复制触发 */
    public productCheck(valueObject: string, item: any, index: number) {
        let reference: any = this.$refs.reference;
        if (this.form.getFieldValue("note") === item.typeName) return;
        if (
            this.isComponent.toLocaleUpperCase() !==
            item["RateStructure"].toLocaleUpperCase()
        ) {
            return this.$message.warning("只能引用Rate structure一样的产品");
        }
        console.log('item', item);

        let typeNameProduct: any = ''
        let data: any = this.prossData[item.typeName + item.productKey]
        if (!data) {
            // cycle 修改了和保存数据的名字后  找之前key保存的数据
            typeNameProduct = Object.keys(this.prossData).find((prossItem: any) => prossItem.indexOf('' + item.productKey) > -1)
            data = this.prossData[typeNameProduct]
        }
        if (!data) {
            // rateplan 插入的productData
            data = item
        }
        // !this.prossData[item.typeName + item.productKey] && !this.prossData[typeNameProduct] && !item.productData
        if (!data) {
            return this.$message.warning(`缺少 ${item.typeName} 参数`);
        }
        if (!data.productData || !data.productData.ratingZoneList || !data.productData.ratingZoneList.length) {
            return this.$message.warning("no data");
        }
        this.$nextTick(() => {
            reference.assignmentData(
                data.productData
            );
        });
        // console.log(index)
        // console.log('radio value', item)
    }
     /**
      * @param items => Array 来源于product所有数据
      * @param name => string 来源于当前product
      * 如果相同结构 && 不为当前product  则为可复制对象
      */
    public Samedata < T extends string > (items: any, name: T): object[] {
        let dupliCateArr: object[] = []
        let values = items
        for (let j = 0; j < values.length; j++) {
            const element = values[j];
            if (name.includes(element.RateStructure) && name !== element.typeName) {
                dupliCateArr.push(element);
            }
        }
        return dupliCateArr
    }
    // 过滤可复制对象
    public getdupliCateArr(name: string) {
        let dupliCateArr: object[] = [];
        if (this.contractIndex === 1) {
            let ratePlanLen = this.ratePlanObject
            for (let i = 0; i < ratePlanLen.length; i++) {
                let tabs = ratePlanLen[i].tabs
                dupliCateArr.push(...this.Samedata < string > (tabs, name))
            }
        } else {
            let recodeLen = this.recordTabs
            dupliCateArr.push(...this.Samedata < string > (recodeLen, name))
        }
        return dupliCateArr;
    }

    /* 获取plan 数据 */
    public activated() {
        AxiosGet("/config/droplist/accounts").then((res: any) => {
            this.formOptions[0]["options"] = res.data || [];
        });
        AxiosGet("/config/droplist/contracts").then((res: any) => {
            this.formOptions[1]["options"] = res.data || [];
        });
        AxiosGet("/config/droplist/services").then((res: any) => {
            this.formOptions[2]["options"] = res.data || [];
        });
        AxiosGet("/config/droplist/cycles").then((res: any) => {
            this.formOptions[4]["options"] = res.data || [];
        });
        if (this.isSync) {
            setTimeout(() => {
                // 延迟一下 防止同步不了rateplan数据
                this._asyncProductData();
            }, 250)
        } else {
            this._asyncProductData();
        }
    }
    // 编辑的时候匹配cycle对应的方向，时间
    public getCycleDetils() {
        let di = ['Inbound', 'Outbound', 'Bilateral']
        let beg, end, Direction: any
        for (let index = 0; index < this.editData.ratePlanList.length; index++) {
            const element = this.editData.ratePlanList[index];
            const proName = element['ratePlanName'].split('-')
            for (let i = 0; i < this.editData.cycleList.length; i++) {
                const element = this.editData.cycleList[i];
                const {
                    configServiceName,
                    cycleName,
                    direction
                } = element
                Direction = element.direction
                if (proName[1] === configServiceName && di.indexOf(proName[2]) + 1 === direction && proName[3] === cycleName) {
                    beg = element.beginDate
                    end = element.endDate
                    Direction = element.direction
                }
            }
        }
        return {
            beg,
            end,
            Direction
        }
    }
    public getEditPlanData(assignmentData ? : any) {
        let ratePlanArr: any = []
        let ratePlan = this.editData.ratePlanList
        for (let i = 0; i < ratePlan.length; i++) {
            const element = ratePlan[i];
            if (element.productList) {
                for (let index = 0; index < element.productList.length; index++) {
                    let raZone = element.productList[index].ratingZoneList
                    if (raZone && raZone.length) {
                        ratePlanArr.push(element.productList[index])
                    } else {
                        ratePlanArr.push(element.productList[index])
                    }
                }
            }
        }
        return ratePlanArr
    }
    // 修改cycle 后 需要执行一次
    public _asyncProductData() {
        let di = ['Inbound', 'Outbound', 'Bilateral']
        console.log(this.contractIndex);

        console.log('778', this.ratePlanObject);
        const ratePlanObject = deepClone(this.ratePlanObject)
        let ratePlanindex: number = 0
        let tabs: any[] = []
        if (this.contractIndex === 1) {
            tabs = ratePlanObject && ratePlanObject.reduce((sum: any, item: any, outIndex: number) => {
                if (Array.isArray(item.tabs)) {
                    item.tabs.map((innerItem: any, innerIndex: number) => {
                        innerItem.ratePlanName = item.ratePlanName;
                        innerItem.index = ratePlanindex++
                    });
                    sum = sum.concat(item.tabs);
                }
                return sum;
            }, []) || []
        } else {
            if (this.ratePlanObject.length) {
                console.log('recordTabs', this.recordTabs);

                tabs = ratePlanObject && ratePlanObject.reduce((sum: any, item: any, outIndex: number) => {
                    if (Array.isArray(item.tabs)) {
                        item.tabs.map((innerItem: any, innerIndex: number) => {
                            for (let k = 0; k < this.recordTabs.length; k++) {
                                const recode = this.recordTabs[k];
                                if (
                                    recode &&
                                    recode['typeName'] === innerItem['typeName'] &&
                                    recode['productData'] && innerItem['productData'] &&
                                    recode['productData']['productName'] === innerItem['productData']['productName']
                                ) {
                                    innerItem['productKey'] = recode['productKey']
                                }
                            }

                            innerItem.ratePlanName = item.ratePlanName || `${item.Account}-${item.configServiceName}-${di[item.direction-1]}-${item.cycleName}`;
                            innerItem.index = ratePlanindex++
                        });
                        sum = sum.concat(item.tabs);
                    }
                    return sum;
                }, []) || []
                this.recordTabs = tabs
            } else {
                let ratePlanList = this.editData.ratePlanList
                let key = new Date().getTime()
                let beg, end, Direction: any
                let arr = this.getEditPlanData()
                let pk:number = 0;
                for (let index = 0; index < ratePlanList.length; index++) {
                    const element = ratePlanList[index];
                    for (let j = 0; j < element.productList.length; j++) {
                        const elem = element.productList[j];
                        pk+=1
                        for (let index = 0; index < this.editData.cycleList.length; index++) {
                            const cycl = this.editData.cycleList[index];
                            let pro = !arr[this.productIndex]['productName'] ? undefined : arr[this.productIndex]['productName'].split('-')
                            if (pro && cycl && cycl.configServiceName === pro[1] && cycl.cycleName === pro[3]) {
                                beg = moment(cycl.beginDate).format('YYYY-MM-DD')
                                end = moment(cycl.endDate).format('YYYY-MM-DD')
                                Direction = cycl.direction
                            }
                        }
                        tabs.push({
                            direction: elem.direction,
                            RateStructure: this.componentArr[elem.rateStructure - 1],
                            typeName: elem.productName,
                            productKey: this.editIndex + index + pk,
                            commitmentBeginDate: beg,
                            commitmentEndDate: end,
                            productData: elem,
                            ratePlanName: element.ratePlanName
                        })                        
                    }
                }
                this.recordTabs = tabs
            }
        }
        // 去除空数据
        for (let i = 0; i < tabs.length; i++) {
            const element = tabs[i];
            if (!element.RateStructure && (!element.typeName || element.productName)) {
                tabs.splice(i, 1)
            }
        }
        console.log('tabs', tabs);
        console.log('editData', this.editData);

        this.rateplanArr = tabs;
        // console.log('this.ratePlanObject', ratePlanObject);

        if (!tabs.length) {
            this.isTabs = true;
            this.direction = "";
            this.isComponent = "";
            this.typenameIndex = 1234;
            this.mutionProdurt(0);
            this.form.setFieldsValue({
                note: "No product",
                Ratestructre: undefined
            });
            return false;
        }
        this.mutionProcutName(tabs[0]["ratePlanName"]);
        this.mutionProdurt(0);
        this.$set(
            this.dupliCateArr,
            0,
            this.getdupliCateArr(tabs[this.productIndex].typeName)
        );
        this.form.setFieldsValue({
            note: tabs[this.productIndex].typeName,
            Ratestructre: tabs[this.productIndex].RateStructure
        });
        this.isComponent = tabs[this.productIndex].RateStructure;
        this.direction =
            tabs[this.productIndex].direction == 1 ?
            "Inbound" :
            tabs[this.productIndex].direction == 2 ?
            "Outbound" :
            undefined;
        this.typenameIndex = +tabs[this.productIndex].productKey;
        this.isTabs = false;
        console.log('this.typenameIndex', this.typenameIndex);
    }
    private getRatePlanProduct(): object[] {
        const ratePlanObject = deepClone(this.ratePlanObject)
        let ratePlanindex: number = 0
        const tabs = ratePlanObject && ratePlanObject.reduce((sum: any, item: any, outIndex: number) => {
            if (Array.isArray(item.tabs)) {
                item.tabs.map((innerItem: any, innerIndex: number) => {
                    innerItem.ratePlanName = item.ratePlanName;
                    innerItem.index = ratePlanindex++
                });
                sum = sum.concat(item.tabs);
            }
            return sum;
        }, []) || []
        // console.log(tabs);
        this.rateplanArr = tabs;
        // console.log('this.ratePlanObject', ratePlanObject);
        this.showRatePlanObject = ratePlanObject
        return tabs
    }

    public onForm(form ? : any) {
        this.structureForm = form;
        this.$nextTick(() => {
            this.structureForm.setFieldsValue({
                rateStructure: this.isComponent
            });
        });
    }

    /* productDetail 弹出框显示/隐藏 */
    public isVisible: boolean = false;
    private productId: string | number = "";

    /**Table Details 传过来的 id */
    public async insertDetail(id: any) {
        this.isVisible = !this.isVisible;
        this.productId = id;
    }

    public deactivated() {
         if(this.closeModel == 'contract') return
        this._asyncProductData();
        console.log(this.typenameIndex);
    }
}
</script>

<style lang="scss">
.base .ant-form-item {
    display: flex;
    align-items: center;
}

.base .ant-form-item-label {
    line-height: 1.5;
    white-space: normal;
}

.contract-product {
    .ant-select-dropdown-menu-item-group-title {
        color: #8cb4fa;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .ant-select-dropdown-menu-item-selected {
        color: #3e77d8;
    }
}
</style><style lang="scss" scoped>
.record {
    display: inline-block;
    padding: 4px 10px;
    width: 100%;
    // line-height: 24px;
    text-align: center;
    // margin: 0 10px;
    text-align: center;
    color: #3e77d8;
    border: 1px solid #3e77d8;
    border-radius: 50px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.2s;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    &:hover {
        background: #3e77d8;
        color: #fff;
    }
}

.Basedata {
    h1 {
        padding: 10px;
        border-bottom: 1px solid #dadada;
        font-weight: 600;
    }
}

.disabled {
    color: rgba(0, 0, 0, 0.25);
    background-color: #f5f5f5;
    border-color: rgba(0, 0, 0, 0.25);
    text-shadow: none;
    box-shadow: none;
    // width: 100px;
    cursor: no-drop;
    font-weight: 600;

    &:hover {
        color: rgba(0, 0, 0, 0.25);
        background-color: #f5f5f5;
        border-color: #d9d9d9;
        text-shadow: none;
        box-shadow: none;
    }
}
</style>
