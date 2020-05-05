<template>
<div class="import">
    <div class="titleTips">This manipulation will over write all existed data in Quality Commitment “承诺名称”。</div>
    <div class="file">
        <span class="file-name">file</span>
        <a-input class="file-input"></a-input>
        <a-upload class="file-upload">
            <a-button>...</a-button>
        </a-upload>
    </div>
    <div class="file-processing">
        <a-row>
            <a-col :style="{ textAlign: 'center' }" class="processing-span">
                <span @click="Preview">Preview</span>
                <span @click="Submit">Submit</span>
                <span @click="Drop">Drop</span>
            </a-col>
        </a-row>
    </div>
    <div class="preview-table">
        <Table :columns="columns" :data="tableData" zebraStripe :useDefined="false" />
    </div>
</div>
</template>

<script lang="ts">
import Vue from "vue";
import {
    Component
} from "vue-property-decorator";

@Component({
    components: {
        Table: () => import("@/views/Finance/components/Table/index.vue")
    }
})
class rateImport extends Vue {
    // 预览表头
    private columns = [];
    // 预览数据
    private tableData = [];
    // 预览
    private Preview() {}
    // 提交
    private Submit() {}
    // 暂停，中止
    private Drop() {}
}
export default rateImport;
</script>

<style lang="scss" scoped>
.import {
    .file {
        margin-top: 10px;

        .file-name,
        .file-upload {
            margin: 0px 10px;
        }

        .file-input {
            width: 300px;
        }
    }

    .file-processing {
        .processing-span span {
            border-radius: 50px 50px 50px 50px;
            display: inline-block;
            padding: 6px 20px;
            margin: 0px 10px;
            background-color: #1890ff;
            color: #fff;
            border: 0;
            cursor: pointer;
        }
    }

    .preview-table {
        margin-top: 20px;
    }
}
</style>
