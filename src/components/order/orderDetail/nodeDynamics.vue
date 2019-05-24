<template>
    <div class="dynamics">
        <div class="dynamics-item" v-for="item in listData" :key="item.id">
            <el-row
            class="dynamics-item__head"
            type="flex"
            justify="space-between">
                <div class="dynamics-item__head-left">
                    <icon w="24" h="24" type="icon-gongdan-caozuo" />
                    <p class="dynamics-item__msg">系统提醒：已到节点开始日期。</p>
                </div>
                <div class="dynamics-item__head-right dynamics-item__time">
                    2016-04-21  00:00
                </div>
            </el-row>
            <div class="dynamics-item__content">
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            listData: {
                type: Array,
                default: []
            }
        },
        data() {
            return {

            };
        },
        created() {

        },
        methods: {

        }
    }
</script>

<style lang="scss" scoped>
    .dynamics {
        &-item {
            padding: 16px;
            line-height: 24px;
            font-size: 14px;
            background: #fcfcfc;
            border: 1px solid #f2f2f2;
            &__msg {
                display: inline-block;
            }
            &__time {
                color: #a2abb8;
            }
        }
    }
</style>
