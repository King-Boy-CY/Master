<template>
<div class="slidTip" v-show="slidTipShow && options[0]" :style="{ left: leftwidth + 12 + 'px',}">
    <div class="slidTip-scrollbar-wrap" ref="scrollbarWrap">
        <el-scrollbar>
            <a-menu class="slidTip-box" theme="dark" mode="inline" :selectedKeys="selectedKeys" @select="onSelect" :openKeys="openKeys" @openChange="handleOpenChange" :inlineIndent="16">
                <template v-for="(item) in options[0] && options[0].subMenu">
                    <menuItem v-if="!item.options" :key="item.name" :item="item" />
                    <sub-menu v-else :key="item.name" :item="item" />
                </template>
            </a-menu>
        </el-scrollbar>
    </div>
    <div class="tri_left" :style="{ top: ( client && client.y || 0) + 'px', left: leftwidth + 2 + 'px' }"></div>
</div>
</template>

<script lang="ts">
import Vue from 'vue'
import {
    Component,
    Prop,
    Emit,
    Watch
} from 'vue-property-decorator'
import {
    route
} from '../menu/router-menu'
import menuItem from '../slidchild/menuItem.vue';
import subMenu from '../slidchild/subMenu.vue';
interface menuInterface {
    name: string;
    icon: string;
    url: string;
    subMenu ? : {
        name: string;
        icon: string;
        url: string;
        options ? : {
            name: string;
            icon: string;
            url: string;
        };
    };
}
@Component({
    components: {
        menuItem,
        subMenu
    }
})
export default class slidchild extends Vue {
    private selectedKeys: string[] = [] // 子元素高亮string['name|url']
    private openKeys: any[] = [] // 二级高亮
    private route: any[] = route // 菜单数据
    @Prop(Array) options!: any // 菜单数据
    @Prop(Object) client: any // 当前鼠标点击坐标
    @Prop(Number) leftwidth!: Number // 左侧菜单宽度 未收缩 -> 200 收缩 -> 80
    @Prop(Boolean) slidTipShow!: Boolean // 子菜单得显示/隐藏true,false
    @Prop(Boolean) collapsed!: Boolean // 子菜单得显示/隐藏

    @Emit('Show') Show() {} // 点击X
    @Watch('$route')
    public onRoute(newVal: any): void {
        this.initOpenMenus(newVal)
    }

    @Emit('onopenKeys') OnopenKeys(openKeys: string) {}
    /* 重新获取子菜单 -> 刷新 */
    public created() {
        this.initOpenMenus()
    }
    public stringify(value: any) {
        return JSON.stringify(value)
    }
    // 处理当前激活的二级展开所在结构
    private subActivaPath: string[] = [];
    private getActivatePath(path, iterator) {
        for (let i = 0, len = iterator.options.length; i < len; ++i) {
            const el = iterator.options[i];
            let ops = this.stringify(el.options)
            if (ops && ops.includes(path)) {
                let elOps = this.stringify(el.options);
                if (elOps.includes(path)) {
                    this.subActivaPath.push(iterator.name, el.name);
                }
            }
            if (el.options) {
                this.getActivatePath(path, el)
            }
        }
        return Array.from(new Set(this.subActivaPath));
    }
    // 处理多级菜单Options
    private subMenu_activate: string[] = [];
    public getsubPath(iterator: any) {
        const path = this.$route.path;
        for (const iteratorChid of iterator.options) {
            // 如果没有多级就不操作了
            if (iteratorChid['url'] === path && !iteratorChid['options']) {
                this.subMenu_activate = [];
                this.subActivaPath = [];
                break;
            }
            if (iteratorChid.options) {
                this.getsubPath(iteratorChid)
            }
            this.subMenu_activate = this.getActivatePath(path, iterator);
        }
        return this.subMenu_activate
    }
    // 处理 二级菜单
    public mapsubMenu(path) {
        const menuList: any[] = []
        this.options.map((val: any, index: number) => {
            /* 子菜单是二级 */
            if (!!(val.subMenu.length)) {
                let item: any = {}
                for (const iterator of val.subMenu) {
                    /* 如果子菜单是一级  */
                    if (!iterator.options && iterator.url === path) {
                        return this.OnopenKeys(val.name)
                    }
                    item = {
                        subMenuname: [], // 父级-> 可展开二级菜单的高亮
                        options: '', // 子菜单数据
                        name: val.name // 左侧菜单点击的高亮
                    }
                    item.subMenuname.push(iterator.name)
                    if (!!iterator.options) {
                        let sum: any = this.getsubPath(iterator);
                        // 空代表没有二级菜单 有则当前属于二级菜单
                        if (sum[0]) {
                            item.subMenuname = [].concat(...sum);
                        } else {
                            this.subMenu_activate = [];
                            this.subActivaPath = [];
                        }
                    }
                    item.options = JSON.stringify(iterator.options)
                    menuList.push(item)
                }
            }
        })
        return menuList;
    }
    /* 获取子菜单 && 刷新保存高亮 */
    public initOpenMenus(route ? : any) {
        const path = this.$route.path

        const module: string = route && route.meta.module || this.$route.meta.module || 'Home'
        // console.log('module', module);
        // console.log('this.route', this.route);
        const childMenu: any = this.route.find((item: menuInterface) => item.name === module)
        // console.log('childMenu', childMenu);

        // let mentOptions = localStorage.getItem('childMenu')
        // const childMenu: any = mentOptions && JSON.parse(mentOptions) || undefined
        childMenu && (this.options[0] = childMenu);

        /* 如果是首页 只返回首页高亮 */
        if (this.$route.name === 'Home') {
            return this.OnopenKeys('Home')
        }

        const menuList = this.mapsubMenu(path)
        // // 这里是查找子菜单是否存在这个path
        const findVal = menuList.find((val: any) => val.options && val.options.indexOf(path) > -1)
        // // 点击的高亮
        this.selectedKeys = [path]
        // // 如果子菜单隐藏了就置空子菜单数据
        if (!this.slidTipShow) {
            this.openKeys = []
            return false
        }
        // // openKeys 子菜单二级展开高亮
        !findVal ? (this.openKeys = []) : (this.openKeys = findVal.subMenuname)
        findVal && this.OnopenKeys(findVal.name)
    }
    // 菜单点击
    public onSelect({
        item,
        key,
        selectedKeys
    }: any): void {
        // this.initOpenMenus()
    }
    // 多级展开
    public handleOpenChange(keys: string[]): void {
        this.openKeys = keys
    }
    // 清空所有数据 -> 当页面为首页时调用
    public emptyAll() {
        this.openKeys = [];
        // this.route = [];
        this.selectedKeys = [];
    }

}
</script>

<style lang="scss">
/* 清除ul背景与父级容器保存一致 */
#sub-menu ul {
    background: unset;
    box-shadow: none;
}

.slidTip {
    background: rgb(53, 66, 113);

    .slidTip-scrollbar-wrap {
        height: 100%;
        overflow: auto;

        .el-scrollbar {
            height: 100%;
        }

        .el-scrollbar__wrap {
            overflow: scroll;
            // width: 200%;
            height: 105%;
        }

        .slidTip-box {
            width: 100%;
            height: 100%;
            // min-width: 150px;
            background: rgb(53, 66, 113);
            padding: 20px 0;
        }
    }

}
</style><style lang="scss" scoped>
.slidTip {
    z-index: 100;
    position: fixed;
    left: 210px;
    top: 0;
    bottom: 0;
    min-width: 200px;
    -webkit-transition: all 0.2s;
    transition: all 0.2s;

    // .ant-menu.ant-menu-dark .ant-menu-item-selected,
    // .ant-menu-submenu-popup.ant-menu-dark .ant-menu-item-selected {
    //   // background-color: rgb(211, 213, 214);
    //   // color: rgb(62, 119, 216);
    // }

    .tri_left {
        width: 0px;
        height: 0px;
        border-top: 10px solid transparent;
        border-bottom: 10px solid transparent;
        border-right: 10px solid rgb(53, 66, 113);
        position: fixed;
        top: 91px;
        left: -10px;
    }

    .box {
        // width: 124px;
        overflow: hidden;
        white-space: nowrap;
    }

    .text {
        width: 170px;
    }

    .text-1 {
        width: 148px;
    }
}
</style>
