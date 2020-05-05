<template>
<div class="left-menu">
    <a-layout-sider v-model="collapsed" collapsible :trigger="null" class="sider" ref="menu" :style="{ overflow: 'hidden', height: '100vh', position: 'fixed', left: 0 }">
        <div class="sider-header" ref="siderHeader">
            <div class="logo">
                <b :style="collapsed ?'font-size:20px;':''">IDD</b><span :style="{ display: collapsed ? 'none' : '' }"> management</span>
            </div>
            <div :class="{ 'user' : !collapsed, 'user-hidde' : collapsed }">
                <span>
                    <a-icon type="user" />&nbsp;Mei Li</span>
                <span>log out >></span>
            </div>
        </div>
        <div class="scrollbar-wrap" :style="{height:clientHeight }" ref="scrollbarWrap">
            <el-scrollbar>
                <a-menu theme="dark" mode="inline" style="background:rgb(53, 66, 113);color:#fff;" :selectedKeys="selectedKeys" @select="onSelect">
                    <a-menu-item :title="item.name" :key="item.name" v-for="(item) in route" @click="routeView(item,$event)">
                        <router-link :to="item.url">
                            <a-icon v-if="!item.src" :type="item.icon"/>
                            <a-icon v-else :component="item.src"/>
                            <span>{{item.name}}</span>
                        </router-link>
                    </a-menu-item>
                </a-menu>
            </el-scrollbar>
        </div>
        <div class="collapsible" @click="trigger" :style="{left:leftwidth-25+'px'}">
            <a-icon :type="collapsed ? 'caret-right' : 'caret-left'" />
        </div>
        <!-- <div class="log-out" :style="collapsed ? { width:'80px', fontSize:'12px' } : {} ">log out >></div> -->
    </a-layout-sider>
    <slidChild :options="options" :client="cline" :leftwidth="leftwidth" :slidTipShow="slidTipShow" :collapsed="collapsed" @onopenKeys="onopenKeys" ref="slichid" />
</div>
</template>

<script lang="ts">
import Vue from 'vue'
import {
    Component,
    Prop,
    Watch
} from 'vue-property-decorator'
import {
    Mutation,
    State
} from 'vuex-class'
import {
    route
} from './router-menu'
@Component({
    components: {
        slidChild: resolve => require(['../slidchild/index.vue'], resolve)
    }
})
export default class leftMenu extends Vue {
    public options: any[] = [] // 弹出菜单 -> 子菜单
    public leftwidth: number = 200; // 默认宽度 -> 菜单栏跟收缩宽度
    public collapsed: boolean = false; // 菜单收缩
    public cline: any = {
        y: 0
    } // 点击当前坐标 -> 作用于子菜单三角位置
    public route: any[] = route // 左侧菜单 -> 配置
    public selectedKeys: any[] = [] // 左侧菜单高亮
    private openKeys: any[] = [] // 二级展开 -> 子菜单
    private MENUNAME: String = 'Home' // 菜单点击名称 -> 作用于分辨是否有子菜单占用空间
    private clientHeight: string | number = '100%' // 设置菜单栏外层高度
    @Mutation('mutionWidth') mutionWidth: any // 设置 菜单栏所占用的宽
    @Mutation('mutionchildShow') mutionchildShow: any
    // 获取子菜单当前状态
    @State('childShow') slidTipShow ? : Boolean // 子菜单显示隐藏
    @Prop(String) private mode!: string
    @Watch('$route') Route(to ? : any) {
        if (to.name === '404') {
            this.mutionchildShow({
                childShow: false
            })
            // localStorage.removeItem('childMenu')
            this.options = []
            this.mutionWidth({
                width: 214
            });
            this.$message.warning(`路径不存在 / The path does not exist - ${ this.$route.path }`);
            return
        }
    }

    @Watch('collapsed') onCollapsed(to ? : any) {
        this.mutionWidth({
            width: (this.slidTipShow ? 200 : 0) + (this.collapsed ? 80 : 200) + (this.slidTipShow ? 20 : 14)
        })
        this.setElScrollbar()
    }

    @Watch('slidTipShow') onSlidTipShow(newVal ? : any, oldVal ? : any) {
        this.mutionWidth({
            width: (newVal ? 200 : 0) + (this.collapsed ? 80 : 200) + (newVal ? 20 : 14)
        })
    }

    private timer: number = 0 // 定时器id
    private scrollTimer: number = 0 // 定时器id
    // 点击菜单栏
    public routeView(item: any, even: any) {
        const ref: any = this.$refs;
        // 每次进入菜单前重置默认值
        this.options = []
        this.MENUNAME = item.name;
        // 首页没有子菜单
        if (item.name === 'Home') {
            this.mutionchildShow({
                childShow: false
            })
            // ref.slichid.emptyAll() && localStorage.removeItem('childMenu');
        } else {
            this.mutionchildShow({
                childShow: true
            })
            item && this.options.push(item)
            setTimeout(() => {
                this.cline = this.getTiggerBtnPos()
            }, 0)
            // item.cline = this.cline
            // localStorage.setItem('childMenu', JSON.stringify(item))
        }
        // 子菜单默认菜单跳转
        // item.menuName && !localStorage.getItem('childMenu') && this.$router.push({ path: item.menuName.url })
    }
    // 获取鼠标点击坐标 -- 作用于: 菜单弹出三角 --
    // public getMousePos(event: any) {
    //     const { offsetTop, offsetHeight } = event.domEvent.target.offsetParent;
    //     let y = (this.$refs.siderHeader as any).offsetHeight + offsetTop+offsetHeight/ 2 - 10
    //     return {
    //         x:200,
    //         y
    //     }
    // }

    //  获取菜单弹出三角的纵坐标
    private getTiggerBtnPos(): object {
        let y: number = 0;
        const siderHeaderHeight = (this.$refs.siderHeader as any).offsetHeight
        const scrollbarWrap: any = this.$refs.scrollbarWrap
        const elScrollbarWrap: any = scrollbarWrap.querySelector('.el-scrollbar__wrap')
        const elScrollbarView: any = elScrollbarWrap.querySelector('.el-scrollbar__view .ant-menu-item-selected')
        // console.log('elScrollbarWrap offsetTop', elScrollbarWrap.offsetTop)
        // console.log('elScrollbarView offsetTop', elScrollbarView.offsetTop );
        // console.log('offsetHeight', elScrollbarView.offsetHeight);
        // console.log('siderHeaderHeight', siderHeaderHeight);
        // console.log('y', siderHeaderHeight + elScrollbarView.offsetTop + elScrollbarView.offsetHeight / 2 - 10);
        if (elScrollbarView && elScrollbarView.offsetTop) {
            // 上面的div高度 + 高亮div距离顶部距离 + 高亮div高度的一半 - 三角形的高度的一半
            y = siderHeaderHeight + elScrollbarView.offsetTop + elScrollbarView.offsetHeight / 2 - 10
        }
        return {
            x: 200,
            y
        }
    }
    // 点击菜单收缩
    public trigger() {
        // this.collapsed 是否折叠菜单
        // this.slidTipShow 是否展示子菜单
        this.collapsed = !this.collapsed
        this.leftwidth = this.collapsed ? 80 : 200
        setTimeout(() => {
            this.setElScrollbar()
        }, 200)
    }
    // 菜单点击触发
    public onSelect({
        item,
        key,
        selectedKeys
    }: any): void {
        this.selectedKeys = selectedKeys
    }
    // 父级高亮
    public onopenKeys(openKeys ? : string) {
        // console.log('this.$route', this.$route);
        let name: any = this.$route.name
        if (name === 'Home' || name === '404') {
            this.selectedKeys = [name];
            return
        }
        if (this.timer) {
            clearTimeout(this.timer)
        }
        this.timer = setTimeout(() => {
            // let locaSto = !localStorage.getItem('childMenu') ? undefined : JSON.parse(localStorage.getItem('childMenu') || JSON.stringify({}))
            // name = openKeys || locaSto && locaSto.name || 'Home'
            name = openKeys || this.$route.meta.module || 'Home'
            this.selectedKeys = [name];
        }, 200)
    }

    private setElScrollbar(isInit ? : any): void {
        if (this.scrollTimer) {
            clearTimeout(this.scrollTimer)
        }
        this.scrollTimer = setTimeout(() => {
            const siderHeaderHeight = (this.$refs.siderHeader as any).offsetHeight
            const scrollbarWrap: any = this.$refs.scrollbarWrap
            const elScrollbarWrap: any = scrollbarWrap.querySelector('.el-scrollbar__wrap')
            const elScrollbarView: any = elScrollbarWrap.querySelector('.el-scrollbar__view .ant-menu-item-selected')
            // console.log('siderHeaderHeight', siderHeaderHeight);
            // console.log('body height', document.body.clientHeight);
            const height: number = document.body.clientHeight - siderHeaderHeight
            this.clientHeight = height + 'px'
            const zoomNumber: number = this.detectZoom()
            elScrollbarWrap.style.height = height + 18 / zoomNumber * 100 + 'px'
            // elScrollbarWrap.style.width = this.collapsed ? '200%' : '200%'
            // console.log('elScrollbarView', elScrollbarView);
            if (isInit && elScrollbarView) {
                elScrollbarView.scrollIntoView(false)
            }
            setTimeout(() => {
                const position: any = this.getTiggerBtnPos()
                this.cline.y = position.y
            }, 300)
        }, 100)
    }

    // 获取浏览器缩放倍数
    private detectZoom() {
        let ratio: number = 0
        const screen: any = window.screen,
            ua: any = navigator.userAgent.toLowerCase();

        if (window.devicePixelRatio !== undefined) {
            ratio = window.devicePixelRatio;
        } else if (~ua.indexOf('msie')) {
            if (screen.deviceXDPI && screen.logicalXDPI) {
                ratio = screen.deviceXDPI / screen.logicalXDPI;
            }
        } else if (window.outerWidth !== undefined && window.innerWidth !== undefined) {
            ratio = window.outerWidth / window.innerWidth;
        }

        if (ratio) {
            ratio = Math.round(ratio * 100);
        }
        return ratio;
    }
    public created(): void {
        this.MENUNAME === this.$route.name || 'x'
        this.onopenKeys()
        // 每次进入菜单前重置默认值
        this.options = []
        const name = this.$route.name
        if (name !== 'Home' && name !== '404') {
            this.mutionchildShow({
                childShow: true
            })
        }
        this.mutionWidth({
            width: (this.slidTipShow ? 200 : 0) + (this.collapsed ? 80 : 200) + (this.slidTipShow ? 20 : 14)
        })
        this.setElScrollbar(true)
        window.addEventListener('resize', this.setElScrollbar);
    }

    private destroyed(): void {
        window.removeEventListener('resize', this.setElScrollbar)
    }
}
</script>

<style lang="scss">
.left-menu {
    .scrollbar-wrap {
        overflow: auto;
        // overflow-y: auto;

        .el-scrollbar {
            height: 100%;
        }

        .el-scrollbar__wrap {
            overflow: scroll;
            width: 200%;
            height: 120%;
            // overflow-y: scroll;
            // overflow-x: hidden;

        }
    }

}
</style><style lang="scss" scoped>
.left-menu {
    z-index: 100;
    background: #354271;

    .logo {
        background: rgb(62, 119, 216);
        color: #fff;
        padding: 15px 3px;
        text-align: center;
    }

    .user,
    .user-hidde {
        font-size: 14px;
        background: rgb(53, 63, 100);
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px;
        color: #fff;
        box-sizing: border-box;
    }

    .user-hidde {
        flex-direction: column;
        padding: 10px 2px;
        height: auto;
        font-size: 13px;
        box-sizing: border-box;

        span {
            padding: 5px 0;
        }
    }

    .sider {
        min-height: 100%;
        background: rgb(53, 66, 113);
        position: relative;
    }

    .collapsible {
        position: fixed;
        text-align: center;
        bottom: 40px;
        width: 25px;
        cursor: pointer;
        height: 80px;
        line-height: 80px;
        color: #fff;
        background: rgb(73, 83, 122);
        border-top-left-radius: 6px;
        border-bottom-left-radius: 6px;
        z-index: 1;
        -webkit-transition: all 0.2s;
        transition: all 0.2s;
        font-size: 20px;
    }

    .log-out {
        position: fixed;
        font-size: 14px;
        bottom: 20px;
        text-align: center;
        width: 200px;
        color: #fff;
    }

}

</style>
