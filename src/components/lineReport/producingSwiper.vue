<template>
    <div class="producing-swiper-wrap">
        <swiper :options="swiperOptions" ref="producingSwiper">
            <swiper-slide v-for="(item,index) in workOrderArr" :key="item">
                <div class="work-order-wrap" v-for="(orderItem,orderIndex) of item " :key="orderIndex">
                    <img :src="orderItem.imageURL" alt="" class="work-order-img" v-errorLogo>
                    <div class="work-order-detail-group">
                        <div class="detail-row">
                            <div class="row-left">
                                <span class="detail-title w-20">
                                    工单
                                    <span class="detail-value">
                                        {{orderItem.orderNo}}
                                    </span>
                                </span>
                                <span class="detail-title w-20">
                                    客户
                                    <span class="detail-value">
                                        {{orderItem.customerName}}
                                    </span>
                                </span>
                            </div>
                            <div class="row-right">
                                <span class="detail-title ">
                                    下单:
                                    <span class="detail-value">
                                        {{orderItem.orderAt!=''&&orderItem.orderAt!=null? orderItem.orderAt.split(' ')[0].replace(/\-/g,'/').replace('20',''):orderItem.orderAt}}
                                    </span>
                                </span>
                                <span class="detail-title">
                                    交货:
                                    <span class="detail-value">
                                        {{orderItem.deliveryAt!=''&&orderItem.orderAt!=null?orderItem.deliveryAt.split(' ')[0].replace(/\-/g,'/').replace('20',''):orderItem.deliveryAt}}
                                    </span>
                                </span>
                            </div>
                        </div>
                        <div class="detail-row ">
                            <div class="row-left">
                                <span class="detail-title w-20">
                                    货品
                                    <span class="detail-value">
                                        {{orderItem.styleNo}}
                                    </span>
                                </span>
                                <span class="detail-title w-20">
                                    剩余
                                    <span class="detail-value">
                                        {{orderItem.dayRemain}}
                                    </span>
                                </span>
                            </div>
                            <div class="row-right">
                                <crosswise-percent :total='orderItem.total' :completed='orderItem.completed'>
                                </crosswise-percent>
                                <bubble class="line-bubble" v-if="orderItem.diffVal" :number='orderItem.diffVal'></bubble>
                            </div>
                        </div>
                    </div>
                </div>
            </swiper-slide>
        </swiper>
    </div>
</template>
<script>
import CrosswisePercent from '../../components/lineReport/crosswisePercent'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import Bubble from './bubble'
import 'swiper/dist/css/swiper.css'
export default {
    props: ['workOrderArr'],
    data() {
        return {
            workOrderCount: 0,
            workOrderTotal: 0,
            dataArr: [],
            timer: null,
            nowIndex: 0,
            swiperOptions: {
                observer: true,
                observeParents: true,
                autoplay: {
                    delay: 5000,
                    disableOnInteraction: false,
                    waitForTransition: false,
                }
            },
        };
    },
    methods: {
        // 获取生产中的工单
    },
    watch: {
        workOrderArr: {
            handler(nowVal, oldVal) {
                if (oldVal.length) {
                    for (let i in nowVal) {
                        for (let j in nowVal[i]) {
                            if (nowVal[i][j].completed != oldVal[i][j].completed) {
                                nowVal[i][j].diffVal = nowVal[i][j].completed - oldVal[i][j].completed
                            }
                        }
                    }
                    this.workOrderArr = nowVal;
                }
                setTimeout(() => {
                    for (let i in this.workOrderArr) {
                        for (let j in this.workOrderArr[i]) {
                            this.$set(this.workOrderArr[i][j], 'diffVal', 0)
                        }
                    }
                }, 2000)
            },
            deep: true
        }
    },
    computed: {
        swiper() {
            return this.$refs.producingSwiper.swiper
        }
    },
    components: {
        CrosswisePercent,
        swiper,
        swiperSlide,
        Bubble
    },
    watch: {
        workOrderArr(val) {
        }
    }
};
</script>
<style lang="scss" scoped>
@function pxTovw($px) {
    @return $px / 1440 * 100 + vw;
}
.el-carousel__item {
    display: flex;
    flex-direction: column;
}
.producing-swiper-wrap {
    .swiper-container {
        width: pxTovw(572);
        height: pxTovw(265);
    }
}
.work-order-wrap {
    display: flex;
    background: linear-gradient(278deg, #0f1245, #1d1853);
    width: pxTovw(542);
    height: pxTovw(49);
    opacity: 0.8;
    border-radius: 10px;
    padding: pxTovw(17) pxTovw(15);
    align-items: center;
    .work-order-img {
        width: pxTovw(48);
        height: pxTovw(48);
        border-radius: 6px;
        box-shadow: 0 0 14px 0 #3a3777;
        margin-right: pxTovw(15);
    }
}
.work-order-detail-group {
    flex: 1;
    .detail-row:first-child {
        margin-bottom: pxTovw(8);
    }
    .detail-row {
        display: flex;
        justify-content: space-between;
        .detail-title {
            color: #7d86de;
            font-size: pxTovw(12);
            font-family: FZLTXHK;
            .detail-value {
                color: #76d3fc;
                margin-left: pxTovw(10);
            }
        }
    }
}
.work-order-wrap:not(:last-child) {
    margin-bottom: pxTovw(8);
}
.w-20 {
    width: 50%;
}
.w-30 {
    width: 30%;
}
.w-56 {
    width: 55.5%;
}
.placeholder-swiper {
    height: 350px;
}
.row-right {
    display: flex;
    width: 50%;
    justify-content: space-between;
    position: relative;
}
.row-left {
    display: flex;
    width: 50%;
    justify-content: space-between;
    position: relative;
}
.line-bubble {
    right: -50px;
    top: -7px;
}
</style>
