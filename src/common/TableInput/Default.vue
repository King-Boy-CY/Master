<template>
<model v-model="_visible" title="Default rounding rules" width="800px" v-if="Rounding" @Screencover="hide" overflowY="hidden">
    <template slot="model-body">
        <a-form>
            <a-row style="margin:10px;">
                <a-col :span="24">
                    <a-form-item label="Default rule" :label-col="{ span: 4 }" :wrapper-col="{ span: 19 }">
                        <a-input placeholder="default rule name" disabled />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item label="Default rule" :label-col="{ span: 9 }" :wrapper-col="{ span: 12 }">
                        <a-input placeholder="30" disabled />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item label="Initial rounding" :label-col="{ span: 9 }" :wrapper-col="{ span: 12 }">
                        <a-input placeholder="28" disabled />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item label="Additional rounding" :label-col="{ span: 9 }" :wrapper-col="{ span: 12 }">
                        <a-input placeholder="50" disabled />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item label="Maximum" :label-col="{ span: 9 }" :wrapper-col="{ span: 12 }">
                        <a-input placeholder="600000" disabled />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item label="Measure adjustment" :label-col="{ span: 9 }" :wrapper-col="{ span: 12 }">
                        <a-input placeholder="80" disabled />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item label="Treat maximum as a cap" :label-col="{ span: 11 }" :wrapper-col="{ span: 12 }">
                        <a-select defaultValue="a1" style="width: 200px" disabled>
                            <a-select-option v-for="i in 25" :key="(i + 9).toString(36) + i">
                                {{(i + 9).toString(36) + i}}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="24" style="text-align:center;">
                    <a-button @click="hide">return</a-button>
                </a-col>
            </a-row>
        </a-form>
    </template>
</model>
</template>

<script lang="ts">
import Vue from 'vue'
import {
    Component,
    Prop,
    Emit
} from 'vue-property-decorator'

@Component({
    components: {
        model: resolve => require(['@/common/Model/index.vue'], resolve)
    }
})
export default class Default extends Vue {
    @Prop(Boolean) private Rounding ? : boolean //rumber plan
    @Prop(Boolean) private defaultVisible ? : boolean //rumber plan
    @Emit('hide') hide() {}

    private get _visible():any {
        return !!this.defaultVisible;
    }
    private set _visible(visible: any) {
        this.$emit('update:defaultVisible', !!visible)
    }

}
</script>
