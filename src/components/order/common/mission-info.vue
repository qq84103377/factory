<template>
        <div class="mission-info">
            <img class="mission-info__pic" :src="missionInfo.pictureURL" v-errorLogo />
            <div class="mission-info__content">
                <div class="mission-info__row">
                    <div class="mission-info__row-item">
                        <span class="mission-info__label">货品款号</span>
                        <span>{{ missionInfo.styleNo }}</span>
                    </div>
                    <div class="mission-info__row-item">
                        <span class="mission-info__label">工单号</span>
                        <span>{{ missionInfo.missionNo }}</span>
                    </div>
                </div>
                <div>
                    <div class="mission-info__row-item">
                        <span class="mission-info__label">货品名称</span>
                        <span>{{ missionInfo.goodsName }}</span>
                    </div>
                    <div class="mission-info__row-item">
                        <span class="mission-info__label">客户</span>
                        <span>{{ missionInfo.custName || missionInfo.customerName || '未填写'}}</span>
                    </div>
                </div>
            </div>
        </div>
</template>

<script>
    export default {
        props: {
            missionInfo: {
                type: Object,
                default: {}
            }
        }
    }
</script>

<style lang="scss" scoped>
    .mission-info {
        display: flex;
        align-items: center;
        padding: 12px;
        border: solid 1px #e6eaf0;
        background: #fff;
        &__pic {
            width: 48px;
            height: 48px;
            margin-right: 16px;
            border: solid 1px #f0f2f5;
        }

        &__content {
            flex: 1;
        }
        &__row {
            margin-bottom: 12px;
            &-item {
                display: inline-block;
                width: 49%;
                font-size: 14px;
            }
        }
        &__label {
            display: inline-block;
            width: 60px;
            margin-right: 5px;
            text-align: right;
            color: #a2abb8
        }
        span {
            white-space: nowrap
        }
    }
</style>
