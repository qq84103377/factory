<template>
    <div class='swiper-wrap'>
        <swiper :options="swiperOption" ref="mySwiper">
            <swiper-slide v-for="(item,index) in completeness" :key="index" class="swiper-slide">
                 <div class="completeness-item " v-for="(detailItem,detailIndex) of item">
                     <div class="item-index">{{parseInt(detailItem.id)+1}}</div>
                    <span class="item-detail">
                        {{detailItem.content}}
                    </span>
                 </div>
            </swiper-slide>
        </swiper>
    </div>
</template>
<script>
// import Swiper from 'swiper'
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import { smartReminder } from '../../api/lineReport/lineReportApi'
export default {
    data() {
        return {
            swiperOption: {
                direction: 'vertical',
                autoplay: {
                    delay: 3000,//1秒切换一次
                },
                observer: true,
                observeParents: true,
                effect: 'fade',
                fadeEffect: {
                    crossFade: true,
                }
            },
            completeness: [],
            timer: null
        }
    },
    methods: {
        // 获取智能提醒
        getSmartReminder() {
            let params = {
                unitId: JSON.parse(sessionStorage.getItem('last_login')).id
            };
            return smartReminder(params).then(res => {
                this.completeness = []
                if (res.data.notifications.length) {
                    for (let i in res.data.notifications) {
                        res.data.notifications[i].id = i;
                    }
                    for (var i = 0, len = res.data.notifications.length; i < len; i += 3) {
                        this.completeness.push(res.data.notifications.slice(i, i + 3));
                    }
                    // this.completeness = res.data.notifications
                } else {
                    this.completeness[0] = []
                    for (let i = 0; i < 3; i++) {
                        let obj = {
                            id: i,
                            content: '暂无数据'
                        }
                        this.completeness[0].push(obj);
                    }
                }
            }).catch(err => {
                console.log(err)
            })
        },
    },
    computed: {
        swiper() {
            return this.$refs.mySwiper.swiper
        }
    },
    mounted() {
        this.getSmartReminder();
        this.timer = setInterval(() => {
            this.getSmartReminder()
        }, 15000)
    },
    created() {

    },
    destroyed() {
        clearInterval(this.timer)
    },
    components: {
        swiper,
        swiperSlide
    }
}
</script>
<style lang="scss" scoped>
@function pxTovw($px) {
    @return $px / 1440 * 100 + vw;
}
.swiper-wrap {
    .swiper-container {
        width: 100%;
        height: 300px;
    }
}
.completeness-item {
    min-width: pxTovw(702);
    min-height: pxTovw(20);
    display: flex;
    align-items: center;
    line-height: pxTovw(20);
    opacity: 0.75;
    border-radius: 10px;
    background: linear-gradient(273deg, #0f1245, #1d1853);
    margin-bottom: pxTovw(8);
    padding: pxTovw(8) 0 pxTovw(8) pxTovw(18);
    .item-detail {
        font-family: FZLTXHK;
        font-size: pxTovw(14);
        line-height: 1.5;
        color: #7d86de;
    }
    .item-index {
        min-width: pxTovw(20);
        min-height: pxTovw(20);
        border-radius: 50%;
        border: 1px solid rgba(118, 211, 252, 0.3);
        font-family: FZLTTHJW-GB1-0;
        font-size: pxTovw(12);
        text-align: center;
        line-height: pxTovw(20);
        margin-right: pxTovw(12);
        color: #c6eeff;
        text-shadow: 0 0 8px #3f95bb;
    }
}
.flex {
    display: flex;
}
</style>
