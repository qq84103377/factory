<template>
    <p class="inline-loading" v-show="loading" :style="styleObj">
        <i class="el-icon-loading"></i>
    </p>
</template>

<script>
export default {
    props: {
        styleObj: {},
        loading: Boolean
    }
}
</script>

<style scoped>
    .inline-loading {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 16px;
        height: 186px;
        background: #fff;
    }
</style>
