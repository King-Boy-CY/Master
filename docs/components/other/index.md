# collapse-transition
> - 上下折叠动画组件
> - 组件所在位置： `vue-ts-admin\src\views\Finance\components\collapse-transition`
## 简单使用
>  这个就是使用的 ```<transition name="xxxx"></transition>```

```html
<collapse-transition>
  <div v-if="visiable">xxx</div>
</collapse-transition>
```

```javascript
<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
@Component({
  components: {
    collapseTransition: () => import("@/views/Finance/components/collapse-transition/index.js"),
  }
})
export default class XXX extends Vue {
    private visiable:boolean = true
}
</script>
```


# Modal
> - 对话框组件 这里组件文件夹名字写错了,将错就错吧
> - 组件所在位置： `vue-ts-admin\src\common\Model` 引用文件名字还是使用这个，引用后组件命名改正确就好，即```modal: () => import("@/views/common/Model/index.vue")```
## 简单使用
> 使用前先学习[antd Modal对话框](https://www.antdv.com/components/modal-cn/)

```html
<modal v-model="visible" @close="Screencover" title="xxxx title">
    <template slot="model-body">
        <div>body</div>
    </template>
    <template slot="model-footer">
        <!-- footer -->
        <a-button class="save-btn" type="primary" @click="save">Save</a-button>
        <a-button class="return-btn" @click="handleReturn">Return</a-button>
    </template>
</modal>
```

```javascript
<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
@Component({
  components: {
    modal: () => import("@/views/common/Model/index.vue"),
  }
})
export default class XXX extends Vue {
    private visiable:boolean = true
}
</script>
```


> ## Props
> *代表官方api,请先看官方文档

| prop                             | 简介                     |  类型                              | 默认值   |  必传 |
| :---------------------           | :-----                   | :------                            | :----:  | :--: |
| width*                           | 宽度                     | Number, String                     |  80%    |  否   |
| height*                          | 高度                     | Number, String                     |  --     |  否   |
| unsetBodyPadding                 | 是否去除body的padding样式 | Boolean                            |  false  |  否   |
其它api请看[antd modal](https://www.antdv.com/components/modal-cn/)文档,与antd modal保持一致

## Emits
> 回调

| emit                       | 简介                            |  参数  |  
| :--------------------------| :-------------------------------| :---- |  
| close                      | modal的关闭通知回调              |   --  |

其它请看[antd modal](https://www.antdv.com/components/modal-cn/)文档,与antd modal保持一致
