<template>
    <div class="mission-item">
        <div class="cancel-mask" v-if="missionItem.cancel">
            <!-- <icon class="cancel-mask__icon" w="140" h="50" type="icon-chexiaogongdan-yichexiao"/> -->
        </div>
        <el-row
            class="mission-item__top"
            type="flex"
            align="center">
            <img class="mission-item__picture" @click="$emit('on-preview-click', missionItem)" :src="missionItem.goodsPictureUrl" v-errorLogo/>
            <el-col :span="14" class="mission-item__top--center">
                <div class="mission-item-detail">
                    <div class="mission-item-detail__item">
                        <span class="mission-item-detail__label">设计款号</span>
                        <span class="mission-item-detail__value" :class="{'color-grey': !missionItem.designStyleNo}" style="font-weight: 500">
                            {{ missionItem.designStyleNo || '未填写'}}
                            <!-- {{missionItem.styleName !== '未填写' && missionItem.styleName?'-'+missionItem.styleName:''}} -->
                        </span>
                    </div>
                    <div class="mission-item-detail__item">
                        <span class="mission-item-detail__label">工单号</span>
                        <span class="mission-item-detail__value">{{ missionItem.orderNo }}</span>
                    </div>
                </div>
                <div class="mission-item-detail">
                    <div class="mission-item-detail__item">
                        <span class="mission-item-detail__label">商品名称</span>
                        <span class="mission-item-detail__value" :class="{'color-grey': !missionItem.styleName}" style="font-weight: 500">
                            {{ missionItem.styleName || '未填写'}}
                        </span>
                    </div>
                    <div class="mission-item-detail__item">
                        <span class="mission-item-detail__label">时 间</span>
                        <span class="mission-item-detail__value">
                            <i :class="{'color-grey': !missionItem.placeorderAt}">{{ missionItem.placeorderAt | filterDate }}</i> 至 <i :class="{'color-grey': !missionItem.deliveryAt}">{{ missionItem.deliveryAt | filterDate }}</i>
                        </span>
                    </div>
                </div>
                <div class="mission-item-detail">
                    <div class="mission-item-detail__item">
                        <span class="mission-item-detail__label">设计负责人</span>
                        <span class="mission-item-detail__value"
                            :class="{'color-grey': missionItem.designers && !missionItem.designers.length}">
                            <i class="charger-item" v-for="user in missionItem.designers" :key="user.id">{{ user.name }}</i>
                            {{ missionItem.designers && !missionItem.designers.length ? '未填写' : ''}}
                        </span>
                    </div>
                    <!-- designers -->
                    <div class="mission-item-detail__item">
                        <span class="mission-item-detail__label">工单负责人</span>
                        <span class="mission-item-detail__value"
                            :class="{'color-grey': missionItem.chargers && !missionItem.chargers.length}">
                            <i class="charger-item" v-for="user in missionItem.chargers" :key="user.id">{{ user.name }}</i>
                            {{ missionItem.chargers && !missionItem.chargers.length ? '未填写' : ''}}
                        </span>
                    </div>
                </div>
            </el-col>
            <div class="mission-item__top--right">
                <div class="mission-status">
                    <span class="mission-status__level"
                        v-if="missionItem.priority === 1"
                        :style="{'background': (missionItem.status === 2 || missionItem.cancel) ? '#D3D9E6' : ''}"
                    >加急
                    </span>
                    <span class="mission-status__leve2"
                        v-if="missionItem.priority === 2"
                        :style="{'background': (missionItem.status === 2 || missionItem.cancel) ? '#D3D9E6' : ''}"
                    >特急
                    </span>
                    <span class="mission-status__delay"
                        :class="{
                            'is-finish': missionItem.status === 2,
                            'is-delay': missionItem.delay < 0,
                            'is-cancel': missionItem.cancel || missionItem.status === 0
                        }">{{ renderStatusText() }}</span>
                </div>
                <div class="btn-group" >
                    <nf-button style="z-Index:20;position:relative"  @click="viewDetail">工单详情 >></nf-button>
                </div>
            </div>
        </el-row>
        <!-- 节点列表 -->
        <el-row
            ref="carousel"
            class="mission-item__bottom carousel"
            type="flex">
            <node-list ref="carousel-wrapper"
                :style="{
                    'transform': `translateX(${carouselConf.width * (-carouselIndex)}px)`,
                    'transition': 'transform .3s'}">
                <node-list-item
                    v-for="nodeItem in missionItem.nodes"
                    :key="nodeItem.id"
                    :title="nodeItem.nodeName"
                    :nodeItem="nodeItem"
                    :orderLeaders="missionItem.leaders"
                    :missionId="missionItem.id"></node-list-item>
            </node-list>
            <a class="prve" href="javascript:" v-show="isShowArrow" @click="handlePrve"><i class="el-icon-arrow-left"></i></a>
            <a class="next" href="javascript:" v-show="isShowArrow" @click="handleNext"><i class="el-icon-arrow-right"></i></a>
        </el-row>
    </div>
</template>

<script>
    import NodeListItem from './node-list-item';
    import NodeList from './node-list';
    import { formatDate } from '@/utils';
    export default {
        props: {
            missionItem: {}
        },
        components: {
            NodeListItem,
            NodeList
        },
        data() {
            return {
                carouselWidth: '',
                carouselWrapperWidth: '',
                carouselIndex: 0,
                carouselConf: {
                    num: 5, // 每次5个
                    width: 86, // 单个节点宽度
                }
            }
        },
        computed: {
            isShowArrow() {
                return this.carouselWidth < this.carouselWrapperWidth;
            },
            // 可以移动的距离
            canMoveWidth() {
               const canMoveWidth = this.carouselWrapperWidth - this.carouselWidth;
               return canMoveWidth;
            },
            isCanMove() {
                return this.canMoveWidth > 0 && Math.abs(this.carouselIndex) <= Math.round(this.canMoveWidth / this.carouselConf.width)
            }
        },
        filters: {
            filterDate(val) {
                if (!val) return '未填写';
                val = val.replace(/-/g, '/');
                const date = new Date(val);
                return formatDate(date, 'yyyy-MM-dd');
            }
        },
        mounted() {
            this.getCarouselWidth();
        },
        methods: {
            handlePrve() {
                if (this.carouselIndex <= 0) return;
                this.carouselIndex--;
            },
            handleNext() {
                console.log(Math.round(this.canMoveWidth / this.carouselConf.width))
                if (!this.isCanMove) return;
                this.carouselIndex++;
            },
            getCarouselWidth() {
                this.carouselWidth = this.$refs['carousel'] && this.$refs['carousel'].$el.getBoundingClientRect().width;
                this.carouselWrapperWidth = this.$refs['carousel-wrapper'] && this.$refs['carousel-wrapper'].$el.getBoundingClientRect().width;
            },
            // 渲染工单状态文案
            renderStatusText() {
                if (this.missionItem.cancel) {
                    return '已撤销';
                }
                const { status, delay } = this.missionItem;
                if (status === 2) {
                    return '已完成';
                }
                if (status == 0) {
                    return '未开始';
                }
                if (delay >= 0) {
                    return `完成倒计时: ${delay} 天`;
                }
                return `延误 ${Math.abs(delay)} 天`;
            },
            viewDetail() {
                // 权限
                if(!this.powerJudgement.permissions("fac.spl.design.mission.node.detail")){
                    return
                }
                this.$router.push({
                    path: '/sample/detail',
                    query: {
                        missionId: this.missionItem.id
                    }
                });
            }
        }
    }
</script>

<style lang="scss" scoped>
    .mission-item {
        position: relative;
        padding-bottom: 10px;
        margin-bottom: 12px;
        background: #fff;
        .cancel-mask {
            position: absolute;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            background: rgba(255, 255, 255, .6);
            z-index: 10;
            &__icon {
                float: right;
                margin-top: 30px;
                margin-right: 30px;
                transform: rotate(-30deg)
            }
        }
        &__top,
        &__bottom {
            padding: 12px 24px;
        }
        &__top {
            border-bottom: 1px solid #E6EAF0;
        }
        &__bottom {
            position: relative;
            overflow: hidden;
            margin-top: 10px;
        }
        &__picture {
            width: 80px;
            height: 80px;
            cursor: pointer;
        }
        &__top--center,
        &__top--right {
            padding-top: 4px;
        }
        &__top--center {
            margin-right: 16px;
        }
        &__top--right {
            flex: 1;
            text-align: right;
        }
        .prve,
        .next {
            position: absolute;
            top: 0;
            bottom: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 36px;
            background:rgba(122, 132, 153, .6);
            font-weight: bold;
            color: #fff;
            cursor: pointer;
            z-index: 88;
        }
        .prve {
            left: 0
        }
        .next {
            right: 0;
        }
    }
    .mission-item-detail {
        display: flex;
        flex-wrap: wrap;
        overflow: hidden;
        &:not(:last-child) {
            margin-bottom: 12px;
        }
        &__item {
            width: 50%;
            margin-left: -15px;
        }
        &__label {
            display: inline-block;
            width: 100px;
            margin-right: 4px;
            text-align: right;
            font-size: 14px;
            color: #A2ABB8;
        }
        &__value {
            vertical-align: middle;
            .charger-item:not(:last-child)::after {
                content: '、'
            }
        }
    }
    .mission-status {
        display: inline-block;
        &__level {
            display: inherit;
            padding: 8px;
            margin-right: 8px;
            color: #fff;
            font-size: 12px;
            background: #FF7F14;
        }
        &__leve2 {
            display: inherit;
            padding: 8px;
            margin-right: 8px;
            color: #fff;
            font-size: 12px;
            background: #FA4150;
        }
        &__delay {
            color: #FF7F14;
            &.is-delay {
                color: #FA4150;
            }
            &.is-finish {
                color: #23C811;
            }
            &.is-cancel {
                color: #c2c2c2;
            }
        }
    }
    .btn-group {
        margin-top: 18px;
    }

    .node-popover {
        position: fixed;
        width: 312px;
        height: 251px;
        z-index: 999;
        background: #fff;
        box-shadow: 0px 4px 10px 0px rgba(0,17,51,0.1);
        border-radius: 2px;
        border: 1px solid #DCE0E6;
        transform: translateX(-50%);
    }

    .color-grey {
        color: #babdc2;
    }
</style>
