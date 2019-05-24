<template>
        <div class="node-item">
            <div class="node-item__head">
                <!--'difference-text': isDifference,-->
                <div class="head-text">
                    <span  v-if="warningIcon" :class="{
                    'difference-text': warningIcon == 'difference',
                    'delay-text': warningIcon == 'delay',
                    'remain-text':warningIcon == 'remain'}">{{warnigText}}</span>
                </div>
                <!-- hover触发域 -->
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
                                   >
                                        <div class="popover-content__row--left">
                                            <p class="popover-content__label">负责人</p>
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
                                            <p class="popover-content__label">计划完成日期</p>
                                            <div class="node-text"><span>{{ popoverData.dateEnd || '—' }}</span></div>
                                        </div>
                                        <div class="popover-content__row&#45;&#45;right">
                                            <p class="popover-content__label">实际完成日期</p>
                                            <div class="node-text"><span>{{ popoverData.dateComplete || '—' }}</span></div>
                                        </div>
                                        <!--<template v-if="costShow">-->
                                            <!--<div class="popover-content__row&#45;&#45;right" v-if="popoverData.typeAilc">-->
                                                <!--<p class="popover-content__label">工价</p>-->
                                                <!--<div class="node-text">-->
                                                    <!--<span>{{ popoverData.labourCost ? `${popoverData.labourCost}元/件` : '—' }}</span>-->
                                                <!--</div>-->
                                            <!--</div>-->
                                        <!--</template>-->
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
                                <button type="buttun" v-if="popoverData.fastReportable" aria-label="快速上报" class="report-btn" @click="handleReport(popoverData.nodeId)">快速上报</button>
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
                <p v-for="(item,index) in prcdNodeTags" :key="index" :class="{'nodeListNodeTagName':true,'nodeListNodeTagNameFinish':status===2}">{{item.tagName}}</p>
            </div>
        </div>
</template>

<script>
    import { getNodeInfoByHover } from '@/api';
    import { mapActions } from 'vuex';
    import NodeMixin from './node-mixin';
    export default {
        props: {
            title: '',
            description: '',
            nodeItem: {},
            missionId: '',
            configure: {},
            orderLeaders:[]  ,   //工单负责人
            prcdNodeTags:[] ,    //标签列表
            status:[]     //节点状态
        },
        mixins: [NodeMixin],
        data() {
            return {
                loading: false,
                popoverData: null,
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
                const { delay, alerted, status,notifys, notifyTypes } = this.nodeItem;
                if ((delay < 0 || alerted) && status !== 2&&notifys.length) {
                    // return this.iconConf['error'];
                    return 'delay';
                }
                if (notifyTypes.indexOf(2) > -1&&notifys.length) {
                    // return this.iconConf['notify'];
                    return 'difference';
                }
                if (notifyTypes.indexOf(0) > -1&&notifys.length) {
                    // return this.iconConf['warning']
                    return 'remain'
                }
                return null;
            },
            warnigText() {
                const { delay, alerted, notifys, notifyTypes } = this.nodeItem;
                if ((delay < 0 || alerted) && status !== 2&&notifys.length) {
                    return `延误${notifys[0].notifyNum}天`;
                }
                if (notifyTypes.indexOf(2) > -1&&notifys.length) {
                    return `差额${notifys[0].notifyNum}件`;
                }
                if (notifyTypes.indexOf(0) > -1&&notifys.length) {
                    return `还剩${notifys[0].notifyNum}天`
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
        .head-text{
            margin-bottom:5px;
            text-align: center;
            height: 15px;
            span{
                padding:1px 5px;
                border-radius: 9px;
                color:#fff;
                font-size:12px;
            }
        }
        .difference-text{
            background-color: #5C67E6;
        }
        .delay-text{
            background-color: #FA4150;
        }
        .remain-text{
            background-color: #FF7F14;
        }
        display: inline-block;
        width: 86px;
        text-align: center;
        cursor: pointer;
        margin: 0 4px;
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
            top: 73%;
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
        &__description {
            margin-top: 3px;
        }
        .nodeListNodeTagName {
            display: block;
            /*width: 100%;*/
            padding: 0 4px;
            /*height: 26px;*/
            line-height: 26px;
            color: #fff;
            background: #ff9c38;
            text-align: center;
            /*margin: 6px 6px 0;*/
            margin-top: 6px;
            cursor: pointer;
        }
        .nodeListNodeTagNameFinish{
            background: #666;
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
