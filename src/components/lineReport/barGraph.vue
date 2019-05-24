<template>
    <div class="bar-graph-wrap">
        <div id="barGraph">
            <div class="line-wrap">
                <div class="line-title">
                    <!-- {{item!=null?item.completed:0}}/{{item!=null?item.total:0}} -->
                    &nbsp
                </div>
                <div class="fake-bar"></div>
                <div class="line-title">
                    交期
                </div>
                <div class="word-num">
                    工单号
                </div>
            </div>
            <div class="line-wrap" v-for="(item,index,key) in weekArr" :key="index">
                <div class="line-title">
                    {{item!=null?item.completed:0}}/{{item!=null?item.total:0}}
                </div>
                <single-line-bar :percent='item!=null?item.completed/item.total*100:0'>
                </single-line-bar>
                <div class="line-title">
                    {{index}}
                </div>
                <div class="word-num">
                    {{item==null?'-':item.orderNos.length>1?`共${item.orderNos.length}个工单`:item.orderNo}}
                </div>
                <bubble class="bubble" :number='item.diffVal&&item!=null?item.diffVal:0' v-if="item!=null&&item.diffVal&&item.diffVal>0"></bubble>
            </div>
            <div class="axis-wrapper">
                <img src="../../assets/images/Line_arrow@2x.png" alt="" class="axis-img">
            </div>
            <!-- <p class="comleted-date">交期</p>
            <p class="word-num-title">工单</p> -->
        </div>
    </div>
</template>
<script>
import { orderStatus } from '../../api/lineReport/lineReportApi'
import Bubble from './bubble'
let echarts = require('echarts/lib/echarts');
require('echarts/lib/chart/bar');
import SingleLineBar from '../lineReport/singleLineBar'
export default {
    props: {
        weekData: {
            type: Array,
            default: []
        }
    },
    data() {
        return {
            //X轴数据
            xData: [],
            //X轴坐标数据
            xAxisData: [],
            // Y轴坐标数据
            yAxisData: [],
            // 工单号数据
            wordNumArr: [],
            timer: null,
            weekArr: []
        }
    },
    methods: {
        // 获取工单交期/生产状态
        getChartData() {
            let params = {
                unitId: JSON.parse(sessionStorage.getItem('last_login')).id
            };
            orderStatus(params).then(res => {
                this.xAxisData = Object.keys(res.data.week)
                this.weekArr = res.data.week;
            }).catch(err => {
                console.log(err)
            })
        }
    },
    components: {
        SingleLineBar,
        Bubble
    },
    watch: {
        weekArr: {
            handler(newVal, oldVal) {
                //排除默认值
                if (oldVal != []) {
                    for (let i in newVal) {
                        if (newVal[i] != null && oldVal[i] != null && newVal[i].completed != oldVal[i].completed) {
                            newVal[i].diffVal = newVal[i].completed - oldVal[i].completed
                        }
                    }
                }

                this.weekArr = newVal;
                setTimeout(() => {
                    for (let i in this.weekArr) {
                        if (this.weekArr[i] != null) {
                            this.$set(this.weekArr[i], 'diffVal', 0)
                        }
                    }
                }, 2000)
            },
            deep: true
        }
    },
    mounted() {
        this.getChartData()
        this.timer = setInterval(() => {
            this.getChartData()
        }, 15000)
    },
    destroyed() {
        clearInterval(this.timer)
    }
}
</script>
<style lang="scss" scoped>
@function pxTovw($px) {
    @return $px / 1440 * 100 + vw;
}
.bar-graph-wrap {
    width: pxTovw(572);
    margin-top: pxTovw(10);
    height: pxTovw(363);
    background: linear-gradient(to top, #161148, #201a56);
    opacity: 0.9;
    border-radius: 10px;
    position: relative;
    display: flex;
    align-items: center;
    .work-num-wrap {
        display: flex;
        font-size: pxTovw(12);
        align-items: center;
        min-width: 650px;
        justify-content: space-around;
        padding-left: 24px;
        .work-num-item,
        .work-num-title {
            min-width: 11.5%;
        }
        .work-num-item {
            color: #76d3fc;
        }
    }
}
#barGraph {
    width: 100%;
    display: flex;
    // padding-top: 47px;
    // padding-left: 75px;
    position: relative;
    justify-content: space-between;
    padding-left: pxTovw(18);
}
.line-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    .line-title {
        font-family: STHeitiSC;
        font-size: pxTovw(12);
        font-weight: 300;
        color: #7d86de;
        margin-bottom: pxTovw(15);
    }
    .word-num {
        font-family: STHeitiSC;
        font-size: pxTovw(12);
        font-weight: 300;
        color: #76d3fc;
    }
}
.line-wrap:not(:last-child) {
    margin-right: pxTovw(28);
}
.axis-wrapper {
    position: absolute;
    min-width: pxTovw(526);
    height: pxTovw(6);
    bottom: pxTovw(59);
    .axis-img {
        max-width: 100%;
        max-height: 100%;
    }
}
.comleted-date,
.word-num-title {
    position: absolute;
    left: 24px;
    font-family: STHeitiSC;
    font-size: 12px;
    font-weight: 300;
    color: #7d86de;
}
.comleted-date {
    bottom: 40px;
}
.word-num-title {
    bottom: 0px;
}
.bubble {
    top: -30px;
    left: 2px;
}
.fake-bar {
    width: pxTovw(8);
    height: pxTovw(225);
    margin-bottom: pxTovw(31);
}
</style>

