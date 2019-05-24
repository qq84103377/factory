<template>
<el-popover
    placement="bottom"
    width="312"
    trigger="hover"
    :open-delay="200"
    :disabled="popoverDisabled"
    @show="showPopover">
    <!-- hover触发域 -->
    <div class="table-column"
        slot="reference"
        :style="columnStyle"
        :class="currentClass"
        @click="viewDetail">
        <div class="table-column__title">
            <slot name="title">
                {{ title }}
            </slot>
        </div>
        <div class="table-column__value">
            <slot name="value">
                {{ value }}
            </slot>
        </div>
    </div>
    <!-- hover触发域 end-->
    <!-- content -->
    <div class="popover-content">
        <p class="empty-content" v-show="loading"><i class="el-icon-loading"></i></p>
        <main v-if="!loading && popoverData">
            <el-row
                class="popover-content__row"
                type="flex"
                justify="space-between"> 
                    <span class="node-name">{{ popoverData.nodeName }}</span>
                    <span class="node-status"
                    :class="{
                        'is-finish': isFinish,
                        'is-delay': isDelay,
                        'is-ongoing': (isOngoing || isRemain) && !isNotify && !isDelay && !isWaitStart,
                        'is-remain': isRemain && isNotify
                    }">{{ renderStatusText() }}</span>
            </el-row>
            <el-row
                class="popover-content__row margin-top-12"
                type="flex"
                justify="space-between"> 
                    <span class="node-type">{{ popoverData.typeName }}</span>
                    <span class="node-num" v-if="popoverData.progress">
                        {{ popoverData.progress.completed }}/{{ popoverData.progress.total }}
                        <span class="adjust-num" v-if="popoverData.progress.adjusted">(调{{popoverData.progress.adjusted}})</span>
                        <i class="icon-doac" v-if="popoverData.doac">实裁数</i>
                    </span>
            </el-row>
            <!--sku表-->
            <el-row
                    v-if="popoverData.needSkuDetail"
                    class="popover-content__row"
                    type="flex"
                    justify="space-between">
                <nf-sku-table
                        ref="staticSkuTable"
                        :metadatas="popoverData.metadatas"
                        :quantities="popoverData.quantities"></nf-sku-table>
            </el-row>
            <el-row
                class="popover-content__row margin-top-12"
                type="flex"
                justify="space-between"> 
                    <div class="popover-content__row--left">
                        <p class="popover-content__label">负责人</p>
                        <div class="node-text">
                            <span class="charger-item" v-for="item in popoverData.chargers" :key="item.id">{{ item.name }}</span>
                            {{ popoverData.chargers.length ? '' : '未设置'}}
                        </div>
                    </div>
                    <div class="popover-content__row--right" v-if="popoverData.missionNodeReportOutSideFactorys">
                        <p class="popover-content__label">外发厂</p>
                        <div class="node-text">
                            <span>{{popoverData.missionNodeReportOutSideFactorys}}</span>
                        </div>
                    </div>
            </el-row>
            <el-row
                class="popover-content__row margin-top-12"
                type="flex"
                justify="space-between"> 
                    <div class="popover-content__row--left">
                        <p class="popover-content__label">结束时间</p>
                        <div class="node-text"><span>{{ popoverData.dateEnd || '未设置' }}</span></div>
                    </div>
                    <template v-if="costShow">
                        <div class="popover-content__row--right" v-if="popoverData.typeAilc">
                            <p class="popover-content__label">工价</p>
                            <div class="node-text">
                                <span>{{ popoverData.labourCost ? `${popoverData.labourCost}元/件` : '—' }}</span>
                            </div>
                        </div>
                    </template>
            </el-row>
            <el-row
                class="popover-content__row margin-top-12"
                type="flex"
                justify="space-between"> 
                    <div class="popover-content__row--left">
                        <p class="popover-content__label">
                            节点提醒 <span class="popover-content__btn" @click="handleAddRemark">{{ isRemark ? '修改备注' : '+添加备注' }}</span>
                        </p>
                    </div>
            </el-row>
            <el-row
                class="popover-content__row"> 
                    <p class="node-remind"
                        v-for="item in popoverData.nodeNotifys"
                        :key="item.notifyId"
                        :class="{
                            'is-remind': +item.notifyType === 2,
                            'is-warning': +item.notifyType === 0,
                            'is-delay': +item.notifyType === 1
                        }">
                        {{ renderNotifyText(item.notifyType) }}:{{ item.notifyContent }}
                    </p>
            </el-row>
            <el-row>
                <ul class="node-pictures" v-for="(item, index) in popoverData.nodeNotifys" :key="index">
                    <li v-for="(items, indexs) in item.notePictureList" :key="indexs" @click="showBigImg(item.notePictureList, indexs)">
                        <a>
                            <img :src="items" class="img-list">
                        </a>
                    </li>
                </ul>
            </el-row>
            <button type="buttun" v-if="popoverData.fastReportable" aria-label="快速上报" class="report-btn" @click="handleReport">快速上报</button>
        </main>
    </div>
    <!-- content end-->
</el-popover>
</template>

<script>
import { mapActions } from 'vuex';
import NodeMixin from './node-mixin';
export default {
    props: {
        columnStyle: Object,
        title: '',
        value: '',
        nodeItem: '',
        itemClass: {},
        missionId: '',
        configure:{}
    },
    mixins: [NodeMixin],
    data() {
        return {
        }
    },
    computed: {
        currentClass() {
            return {
                ...this.itemClass,
                'border-right-1px': this.isLast
            }
        },
        isLast() {
            return this.$parent.missionDataList[this.$parent.missionList.length - 1] === this;
        },
    },
    beforeDestroy() {
            const missionList = this.$parent.missionDataList;
            const index = missionList.indexOf(this);
            if (index >= 0) {
                missionList.splice(index, 1);
            }
        },
    created() {
        this.$parent.missionDataList.push(this)
    },
    methods: {
        
    }
}
</script>

<style lang="scss" scoped>
    @import './popover-content.scss';
    @mixin column-background($color) {
        .table-column__title,
        .table-column__value {
            background: $color;
        }
    }
    div {
        box-sizing: border-box;
    }
    .border-right-1px {
        border-right: 1px solid #E6EAF0 !important;
    }
    .table-column {
        display: inline-block;
        min-width: 96px;
        font-size: 12px;
        border: 1px solid #E6EAF0;
        border-right: none;
        text-align: center;
        &:hover {
            .table-column__title,
            .table-column__value {
                background: #F7F9FC !important;
            }
        }
        &__title,
        &__value {
            line-height: 28px;
            height: 28px;
            padding: 0 10px;
        }
        &__title {
           font-weight: 500;
           background: #F7F9FC;
           border-bottom: 1px solid #E6EAF0;
        }

        &__value {
            background: #fff;
        }
        // 警报
        &.is-delay-bg {
            @include column-background(#FFF0F1);
        }
        // 已完成
        &.is-finish-bg {
            @include column-background(#EFFBEE);
        }
        // 进行中
        &.is-ongoing-bg {
            @include column-background(#EDF8FF);
        }
        // 预警
        &.is-warning-bg {
            @include column-background(#FFF2E7);
        }
        // 差额
        &.is-remind-bg {
            @include column-background(#EDEFFF);
        }
    }
</style>
<style lang="scss">
    .node-pictures{
        margin: 5px -5px 0 0;
        overflow: hidden;
        li{
            float: left;
            margin: 0 5px 5px 0;
            width: 74px;
            height: 74px;
            line-height: 74px;
            .img-list{
                width: 100%;
                max-height: 100%;
                vertical-align: middle;
                cursor: pointer;
            }
        }
    }
</style>
