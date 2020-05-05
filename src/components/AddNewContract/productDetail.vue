<template>
<div class="product-detail">
    <a-modal title="Details" centered width="1200px" v-if="visible" v-model="visible" :footer="null">
        <div :style="activeSelect === 'numberPlan' ? 'box-shadow: 0px 3px 0px 0px rgb(243, 243, 243);border-radius: 3px;margin:10px 20px;' : 'margin:10px 20px;'">
            <a-row type="flex" justify="center">
                <a-col v-if="!!currentProductData&&currentProductData.length" style="font-size:20px">
                    {{currentProductData[0].productName}}
                </a-col>
            </a-row>
            <div class="menu-child">
                <template v-if="!!currentProductData&&currentProductData.length">
                    <flat v-if="currentProductData[0].rateStructure ==1" :currentProductData="currentProductData"></flat>
                    <tier v-if="currentProductData[0].rateStructure ==2" :currentProductData="currentProductData"></tier>
                    <interval v-if="currentProductData[0].rateStructure ==3" :currentProductData="currentProductData"></interval>
                    <recurring-charge v-if="currentProductData[0].rateStructure ==4" :currentProductData="currentProductData"></recurring-charge>
                    <one-time-change-view v-if="currentProductData[0].rateStructure ==5" :currentProductData="currentProductData"></one-time-change-view>
                </template>
            </div>
        </div>
    </a-modal>
</div>
</template>

<script lang="ts">
import Vue from 'vue'
import {
    AxiosGet,
    AxiosPost
} from '@/api/axios'
import {
    Component,
    Prop,
    Emit,
    Watch
} from 'vue-property-decorator'

import moment from 'moment'

@Component({
    components: {
        flat: () => import('@/components/formscReening/details/productDetail/flatView.vue'),
        tier: () => import('@/components/formscReening/details/productDetail/tierView.vue'),
        interval: () => import('@/components/formscReening/details/productDetail/intervalView.vue'),
        recurringCharge: () => import('@/components/formscReening/details/productDetail/recurringChargeView.vue'),
        oneTimeChangeView: () => import('@/components/formscReening/details/productDetail/oneTimeChangeView.vue')
    }
})
export default class ratePlanInsert extends Vue {
    @Prop({
        type: Boolean,
        default: true
    }) private isVisible ? : boolean // 是否显示
    @Prop([String, Number]) private productId ? : string | number // 是否显示

    private activeSelect: string = ''
    private currentProductData: any = []

    private get visible() {
        return this.isVisible
    }

    private set visible(val) {
        this.$emit('update:isVisible', val)
    }

    @Watch('productId', {
        immediate: true
    })
    onChangeProductId(newVal: any, oldVal: any) {
        console.log(this.productId);
        if (!this.productId) {
            return console.log('productDetail this.productId is null');
        }
        const url = `/contract/vc-contract/products/contents/${this.productId}`
        AxiosGet(url).then((res) => {
            console.log(res);
            this.currentProductData = res.data
        })
    }
}
</script>

<style lang="scss" scoped>
.model-title {
    padding: 16px 24px;
    color: rgba(0, 0, 0, 0.65);
    border-bottom: 1px solid #e8e8e8;
    font-weight: 600;

    .ant-modal-close {
        cursor: pointer;
        border: 0;
        background: transparent;
        position: absolute;
        right: 0;
        top: 0;
        z-index: 10;
        font-weight: 700;
        line-height: 1;
        text-decoration: none;
        transition: color 0.3s;
        color: rgba(0, 0, 0, 0.45);
        outline: 0;
        padding: 0;
        transition: all 0.2s;

        &:hover {
            color: #000;
        }
    }
}

.ant-modal-close {
    cursor: pointer;
    border: 0;
    background: transparent;
    position: absolute;
    right: 40px;
    top: 40px;
    z-index: 10;
    font-weight: 700;
    line-height: 1;
    text-decoration: none;
    transition: color 0.3s;
    color: rgba(0, 0, 0, 0.45);
    outline: 0;
    padding: 0;
    transition: all 0.2s;

    &:hover {
        color: #000;
    }
}

.ratePlan {
    // overflow-x: scroll;
    background: rgb(255, 255, 255);
    //margin-top: 20px;
}
</style>
