<template>
<div>
    <ul v-for="(item,index) in Arr" :key="index">
        <li>
            <a-collapse v-model="activeKey" class="rateplan-li">
                <a-collapse-panel :key=" (index+1).toString()">
                    <div slot="header">
                        <span class="rateplan">Rate plan{{index+1}}:</span>
                        <span>{{item.ratePlanName}}</span></div>
                    <table class="gridtable" :class="{ border }" :style="{ textAlign: align}">
                        <thead>
                            <tr>
                                <th v-for="(item,key) in inputcolumns" :key="key">
                                    <span :style="{color: item.require ? 'red' : ''}" v-show="item.require">*</span>{{item.title}}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(tab,key) in item.productList" :key=key>
                                <td>
                                    <div>
                                        {{key+1}}
                                    </div>
                                </td>
                                <td>
                                    <div>
                                        {{rateStructure(tab.rateStructure)}}
                                    </div>
                                </td>
                                <td>
                                    <div>
                                        {{tab.productName}}
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </a-collapse-panel>
            </a-collapse>
        </li>
    </ul>

</div>
</template>

<script lang="ts">
import Vue from 'vue'
import {
    Component,
    Prop
} from 'vue-property-decorator'
import {
    rateStructure
} from '@/filter/index'
@Component
export default class serviceDetials extends Vue {
    @Prop() private detailResMsg ? : any
    private rateStructure = rateStructure
    private activeKey: any = []
    private align: string = "center"
    private border: boolean = true
    private inputcolumns: any = [{
            title: 'No .',
            dataIndex: 'No',
            key: 'No'
        },
        {
            title: 'Rate structure',
            dataIndex: 'Service',
            dataType: 'select',
            //require: true
            // sorter: (a:any, b:any) => a.age - b.age -> 排序声明函数
        },
        {
            title: 'Product',
            dataIndex: 'Direction',
            dataType: 'select',
            //require: true
            // sorter: (a:any, b:any) => a.age - b.age -> 排序声明函数
        },
    ]
    private Arr: any = []
    created() {
        let ratePlanArr: any = this.detailResMsg.data.ratePlanList //[Array]
        this.Arr = this.detailResMsg.data.ratePlanList
        let forArr: any = []
        for (let i: number = 0; i <= this.detailResMsg.data.ratePlanList.length; i++) {
            forArr.push(i.toString())
        }
        this.activeKey = forArr
        // console.log(this.activeKey);
        // console.log(this.detailResMsg.data.ratePlanList);
    }
}
</script>

<style lang="scss" scoped>
.rateplan {
    margin-right: 16px;
    font-size: 16px;
    font-weight: 500;
}

.gridtable {
    font-family: 'Chinese Quote', -apple-system, BlinkMacSystemFont, 'Segoe UI',
        'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue',
        Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',
        'Segoe UI Symbol';
    font-size: 16px;
    font-variant: tabular-nums;
    line-height: 1.5;
    color: rgba(0, 0, 0, 0.65);
    box-sizing: border-box;
    margin: 16px 0;
    padding: 0;
    list-style: none;
    position: relative;
    width: 100%;
}

ol,
ul {
    margin-top: 12px;
}

table.border tr td {
    height: 38px;
    vertical-align: middle;
    font-size: 1rem;
}

table.border tr th,
table.border tr td {
    border: 1px solid rgb(221, 224, 241);
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

table.border tr th {
    border-right: 1px solid #fff;

    &:last-child {
        border-right: 1px solid rgb(221, 224, 241);
    }
}
</style>
