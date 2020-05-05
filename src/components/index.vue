<template>
<!-- <div> -->
<a-layout id="components-layout-demo-custom-trigger" class="body">
    <left-menu></left-menu>
    <a-layout class="content-box" :style="{ marginLeft: leftwidth + 'px'}">
        <a-spin tip="Loading..." size="large" :spinning="!!loading">
            <!-- <Header></Header> -->
            <Content></Content>
            <!-- <Footer></Footer> -->
        </a-spin>
    </a-layout>
</a-layout>
<!-- </div> -->
</template>

<script lang="ts">
import {
    Component,
    Vue
} from 'vue-property-decorator'
import Content from '@/components/menu/content.vue' // 身体
import Footer from '@/components/menu/footer.vue' // 页脚
import Header from '@/components/menu/header.vue' // 头部
import leftMenu from '@/components/menu/leftMenu.vue' // 左侧菜单
import {
    State
} from 'vuex-class'

@Component({
    components: {
        Content,
        Footer,
        Header,
        leftMenu
    }
})
export default class Home extends Vue {
    @State('leftwidth') leftwidth ? : number
    @State('loading') loading ? : boolean
}
</script>

<style lang="scss">
@import '@/assets/css/global.scss';
</style><style lang="scss" scoped>
.body {
    min-height: 100vh;
    background-color: rgb(245, 246, 250);

    .content-box {
        transition: margin 0.2s;
        background-color: rgb(245, 246, 250)
    }
}
</style>
