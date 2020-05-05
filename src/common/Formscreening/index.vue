<template>
  <div class="Formscreening">
    <a-row :gutter="24">
      <a-col v-for="(item,key) in Formscreening"
             :key="key"
             :span="( 3 )">
        <a-tooltip v-if="item.disabled"
                   placement="top"
                   :title="item.tips"
                   :autoAdjustOverflow="false">
          <a-button :icon="item.icon"
                    :disabled="item.disabled"
                    :class="{
            'color-blue': item.name !== 'Delete',
            'Delete'    : item.name === 'Delete',
            'active'    : key === activeindex
        }"
                    @click.stop="active(item,key)">
            {{item.name}}
          </a-button>
        </a-tooltip>

        <a-button v-else
                  :icon="item.icon"
                  :disabled="item.disabled"
                  :class="{
            'color-blue': item.name !== 'Delete',
            'Delete'    : item.name === 'Delete',
            'active'    : key === activeindex
        }"
                  @click.stop="active(item,key)">
          {{item.name}}
        </a-button>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {
    Component,
    Prop,
    Emit
} from 'vue-property-decorator'

@Component
export default class Formscreening extends Vue {
    @Prop(Array) private Formscreening ? : any
    @Emit('activeClick') activeClick(values: object) {}
    private backred: string = ''
    private activeindex: number = 0
    public active(item: any, key: number) {
      console.log(item,key);

        this.activeindex = key
        this.activeClick({
            name: item.name,
            index: key + 1
        })
    }
}
</script>

<style lang="scss" scoped>
.Formscreening {
  padding: 20px;
  position: relative;
}

.Button-className {
  margin-left: 8px;
  color: #1890ff;
  border: 0;
  border-radius: 50px 50px 50px 50px;
}

.delete {
  color: rgb(245, 187, 101);
}

.color-blue,
.Delete {
  color: #1890ff;
  border: 1px solid #1890ff;
  border-radius: 50px 50px 50px 50px;
  transition: all 0.2s ease-in;

  &:hover {
    background: rgb(62, 111, 216);
    color: #fff;
    border: 0;
  }
}

.Delete {
  border: 1px solid rgb(245, 177, 72);
  color: rgb(245, 177, 72);
  background: transparent;
}

.active {
  transition: all 0.2s;
  background: rgb(62, 111, 216);
  color: #fff;
  border: 0;
}

.right {
  position: absolute;
  right: 0;
  text-align: right;
}
</style>
