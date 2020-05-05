<template>
  <div>
    <div class="container">
      <a-row class="sRow"
             type="flex"
             justify="center">
        <a-col v-for="(list,index) in detialBar"
               :key="index"
               class="sCol"
               :class="{ active: index === activeIn }"
               @click="active(index,list.cName)">
          {{list.name}}
        </a-col>
      </a-row>
    </div>

    <div>
      <keep-alive>
        <div :is='activeSelect'
             :detailResMsg="detailResMsg"
             :productName="productName">
        </div>
      </keep-alive>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  Component,
  Prop
} from 'vue-property-decorator'
@Component({
  components: {
    contractDetials: () => import('./contractDetials.vue'),
    service: () => import('./serviceDetials.vue'),
    Cycle: () => import('./cycleDetials.vue'),
    ratePlan: () => import('./ratePlanDetials.vue'),
    product: () => import('./productDetail/productDetials.vue')
  }
})
export default class detailAll extends Vue {
  @Prop(Boolean) private visible ? : boolean
  @Prop(Object) private detailResMsg ? : object
  @Prop(Array) private productName ?
    private title : string = 'Test'
  private detialBar: any[] = [{
      name: "Contract Details",
      cName: "contractDetials"
    },
    {
      name: "Service",
      cName: "service"
    },
    {
      name: "Cycle",
      cName: "cycle"
    },
    {
      name: "Rate plan",
      cName: "ratePlan"
    },
    {
      name: "Product",
      cName: "product"
    }
  ];
  private activeIn: number = 0;
  private activeSelect: string = "contractDetials";
  /* Add 选项卡 */
  public active(tab: any, item: any) {
    console.log(tab, item);

    this.activeIn = tab;
    this.activeSelect = item;
  }
  created() {
    // setTimeout(()=>{
    //   console.log(this.detailResMsg);
    // },1000)
    console.log(this.detailResMsg);

  }
}
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  display: flex;
  flex-flow: nowrap;
  justify-content: center;
}

.sRow {
  border: 1px solid rgb(62, 119, 216);
  // max-width: 468px;
  // margin: 0px auto;
  border-radius: 50px 50px 50px 50px;
  box-sizing: border-box;
  font-size: 14px;
  font-weight: 600;
}

.sCol {
  padding: 11px 19px 11px 16px;
  border-radius: 50px 50px 50px 50px;
  color: rgb(62, 119, 216);
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgb(62, 119, 216);
    color: #ffffff;
  }
}

.active {
  transition: all 0.2s;
  background: rgb(62, 119, 216);
  color: #ffffff;
}
</style>
