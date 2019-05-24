<template>
    <div class="box">
        <div class="item" :style="{'background': background?background:'#ff9c38'}"></div>
    </div>
</template>

<script>
    export default {
        name: "title-line",
        props: {
            background: {
                type: String,
            }
        }
    }
</script>

<style lang="scss" scoped>
    .box {
        display: inline-block;
        position: relative;
        margin-right: 10px;
        .item {
            width: 6px;
            height: 20px;
            display: inline-block;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
        }
    }
</style>