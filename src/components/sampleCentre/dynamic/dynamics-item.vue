<template>
    <el-row class="dynamics-item" type="flex" align="middle">
        <icon type="icon-gongdan-xitongtixing" w="20" h="20" />
        <p class="dynamics-item__text">{{ logItem.message }}</p>
        <span class="dynamics-item__time">{{ logItem.dateCreated }}</span>
    </el-row>
</template>

<script>
    export default {
        props: {
            logItem: {
                type: Object,
                default: {}
            }
        },
        computed: {
        }
    }
</script>

<style lang="scss" scoped>
    .dynamics-item {
        padding: 12px;
        font-size: 12px;
        background: #FCFCFC;
        border: 1px solid #F2F2F2;
        &__text {
            flex: 1;
            margin: 0 12px;
        }
        &__time {
            color: #A2ABB8
        }
    }
</style>

