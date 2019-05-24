<template>
        <div class="node-item">
            <div class="node-item__head">
                bill-info
                <el-popover
                    placement="bottom"
                    width="312"
                    trigger="hover"
                    @show="showPopover">
                        <icon
                            slot="reference"
                            class="node-item__icon"
                            :type="nodeTypeIcon"
                            @click="viewDetail" />
                        <!-- content -->
                        <div class="popover-content">
                            <main v-if="popoverData">
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
                                <!-- <el-row
                                    class="popover-content__row margin-top-12"
                                    type="flex"
                                    justify="space-between">
                                        <span class="node-type">{{ popoverData.typeName }}</span>
                                        <span class="node-num" v-if="popoverData.progress">
                                            {{ popoverData.progress.completed }}/{{ popoverData.progress.total }}
                                            <i class="icon-doac" v-if="popoverData.doac">实裁数</i>
                                        </span>
                                </el-row> -->
                                <el-row
                                    class="popover-content__row margin-top-12"
                                    type="flex"
                                    justify="space-between">
                                        <div class="popover-content__row--left">
                                            <p class="popover-content__label">节点负责人</p>
                                            <div class="node-text">
                                                <span
                                                        class="charger-item"
                                                        ref="chargerItem"
                                                        :data-chargerId="item.id"
                                                        v-for="item in popoverData.chargers"
                                                        :key="item.id">
                                                    {{ item.name }}
                                                </span>
                                                {{ popoverData.chargers.length ? '' : '未设置'}}
                                            </div>
                                        </div>
                                </el-row>
                                <el-row
                                    class="popover-content__row margin-top-12"
                                    type="flex"
                                    justify="space-between">
                                        <div class="popover-content__row--left">
                                            <p class="popover-content__label">计划结束日期</p>
                                            <div class="node-text"><span>{{ popoverData.dateEnd || '—' }}</span></div>
                                        </div>
                                </el-row>
                                <el-row
                                    class="popover-content__row margin-top-12"
                                    type="flex"
                                    justify="space-between">
                                        <div class="popover-content__row--left">
                                            <p class="popover-content__label">
                                                <!-- dialog 在index.vue -->
                                                节点提醒 <span class="popover-content__btn" @click="handleAddRemark">{{ isRemark ? '修改备注' : '+添加备注' }}</span>
                                            </p>
                                        </div>
                                </el-row>
                                <el-row
                                    class="popover-content__row">
                                        <p class="node-remind"
                                            v-for="item in popoverData.notifys"
                                            :key="item.id"
                                            :class="{
                                                'is-warning': +item.type === 0,
                                                'is-delay': +item.type === 1
                                            }">
                                            {{ renderNotifyText(item.type) }}:{{ item.content }}
                                        </p>
                                </el-row>
                                <!-- <el-row
                                    class="popover-content__row operate-detail"
                                    type="flex"
                                    :gutter="10"
                                    justify="space-between">
                                        <el-col :span="12">
                                            <p class="popover-content__label">提交明细</p>
                                            <ul class="operate-detail__list">
                                                <li class="operate-detail__row operate-detail__header">
                                                    <div class="operate-detail__cell">提交人</div>
                                                    <div class="operate-detail__cell">提交状态</div>
                                                </li>
                                                <li class="operate-detail__row">
                                                    <div class="operate-detail__cell">张晓峰</div>
                                                    <div class="operate-detail__cell">未提交</div>
                                                </li>
                                            </ul>
                                        </el-col>
                                        <el-col :span="12">
                                            <p class="popover-content__label">审核明细</p>
                                            <ul class="operate-detail__list">
                                                <li class="operate-detail__row operate-detail__header">
                                                    <div class="operate-detail__cell">审核人</div>
                                                    <div class="operate-detail__cell">审核状态</div>
                                                </li>
                                                <li class="operate-detail__row">
                                                    <div class="operate-detail__cell">张晓峰</div>
                                                    <div class="operate-detail__cell">未审核</div>
                                                </li>
                                            </ul>
                                        </el-col>
                                </el-row> -->
                            </main>
                        </div>
                        <!-- content end-->
                </el-popover>

                <!-- hover触发域end -->
                <div class="node-item__line" v-show="!isLast"></div>
                <!-- 警报icon -->
                <icon class="node-item__icon--warning" w="12" h="12" v-if="warningIcon" :type="warningIcon" />
            </div>
            <div class="node-item__text">
                {{ title }}
                <slot name="description" v-if="$slots.description || description">
                    <div class="node-item__description">
                            {{ description }}
                    </div>
                </slot>
                <p class="node-item__text--remark" v-if="isRemark">含备注</p>
            </div>
        </div>
</template>

<script>
    import NodeMixin from './node-mixin';
    import DispatchMixin from '@/components/stock/mixins';
    export default {
        props: {
            title: '',
            description: '',
            nodeItem: {},
            missionId: '',
            orderLeaders:[]   //工单负责人
        },
        mixins: [NodeMixin, DispatchMixin],
        data() {
            return {
                loading: false,
                
                iconConf: {
                    error: 'icon-gongdan_jiedianjingbao-xiao',
                    warning: 'icon-early-warning',
                    notify: 'icon-margin',
                    start: 'icon-gongdan-jiedianweikaishi-da',
                    ongoing: 'icon-gongdan-jiedianjinxingzhong-da',
                    finish: 'icon-gongdan-jiedianyiwancheng-da'
                }
            }
        },
        computed: {
            isLast() {
                return this.$parent.nodeList[this.$parent.nodeList.length - 1] === this;
            },
            warningIcon() {
                let { status, notifyTypes } = this.nodeItem;
                if (notifyTypes.indexOf('1') > -1) {
                    return this.iconConf['error'];
                }
                if (notifyTypes.indexOf('0') > -1) {
                    return this.iconConf['warning']
                }
                return null;
            },
            nodeTypeIcon() {
                const { status } = this.nodeItem;
                if (status === 0) return this.iconConf['start'];
                if (status === 1) return this.iconConf['ongoing'];
                if (status === 2) return this.iconConf['finish'];
            }
        },
        created() {
            this.$parent.nodeList.push(this);
        },
        beforeDestroy() {
            const nodeList = this.$parent.nodeList;
            const index = nodeList.indexOf(this);
            if (index >= 0) {
                nodeList.splice(index, 1);
            }
        },
        methods: {
        }
    }
</script>

<style lang="scss" scoped>
    @import './popover-content.scss';
    .node-item {
        display: inline-block;
        width: 86px;
        text-align: center;
        cursor: pointer;
        &__head {
            position: relative;
        }
        &__icon {
            position: relative;
            z-index: 9;
        }
        &__icon--warning {
            position: absolute;
            top: 0;
            left: 52%;
            transform: translateY(-50%);
            z-index: 19;
        }
        &__line {
            position: absolute;
            top: 50%;
            left: 50%;
            right: -50%;
            height: 2px;
            z-index: 1;
            background: #F2F5FA;
            transform: translateY(-50%);
        }
        &__text {
            font-size: 12px;
            margin-top: 6px;
        }
        &__text--remark {
            color: #1CA1FF;
            margin-top: 5px;
        }
        &__description {
            margin-top: 3px;
        }
    }

    .operate-detail {
        margin-top: 12px;
        padding-top: 12px;
        border-top: 1px solid #E6EAF0;
        &__list {
            padding: 0;
            margin: 0;
            border: 1px solid #E6EAF0;
            border-bottom: none;
            li {
                display: flex;
                line-height: 24px;
                font-size: 12px;
            }
            li > div {
                flex: 1;
                padding: 0 5px;
                border-bottom: 1px solid #E6EAF0;
                &:first-child {
                    border-right: 1px solid #E6EAF0
                }
            }
        }
        &__header {
            background: #F7F9FC;
            color: #808080;
        }
    }
</style>

