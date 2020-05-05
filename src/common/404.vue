<template>
<div class="bcg">
    <a-button type="primary">
        <router-link to="/">
            <a-icon type="left" />
            back Home
        </router-link>
    </a-button>
</div>
</template>

<script lang="ts">
import Vue from 'vue'
import {
    Component
} from 'vue-property-decorator'

@Component
export default class Ne404 extends Vue {}
</script>

<style lang="scss" scoped>
.bcg {
    background-image: url('../assets/images/404.png');
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center center;
    height: 380px;
}
</style>
