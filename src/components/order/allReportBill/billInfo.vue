<template>
    <div class="bill-info">
        <img class="bill-info__pic" :src="missionInfo.pictureURL" v-errorLogo />
        <div class="bill-info__content">
            <div class="bill-info__row">
                <div class="bill-info__row-item">
                    <span class="bill-info__label">商品：</span>
                    <span>{{missionInfo.styleNo}}</span>
                    <span v-if="missionInfo.styleNo && missionInfo.styleName">-</span>
                    <span>{{missionInfo.styleName}}</span>
                </div>
                <div class="bill-info__row-item">
                    <span class="bill-info__label">工单号：</span>
                    <span>{{ missionInfo.orderNo }}</span>
                </div>
            </div>
            <div>
                <div class="bill-info__row-item">
                    <span class="bill-info__label">客户：</span>
                    <span>{{ missionInfo.custName || missionInfo.customerName || '未填写'}}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'billInfo',
        props: ['missionInfo'],
    }
</script>

<style lang="scss" scoped>
    .bill-info {
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
                width: 50%;
                margin-left: -25px;
                font-size: 14px;
            }
        }
        &__label {
            display: inline-block;
            width: 80px;
            margin-right: 5px;
            text-align: right;
            color: #a2abb8
        }
        span {
            white-space: nowrap
        }
    }
</style>
