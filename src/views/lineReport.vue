<template>
  <div class='root-wrap'>
    <div
      class="wrap"
      id="lineReport"
    >
      <div class="left-part">
        <!-- 今日产能 start -->
        <div class="part-item-wrap">
          <div
            class="item-header"
            style='justifyContent: space-between;'
          >
            <div class="item-title-pic four-word-title">
              <img
                src="../assets/images/SliceToAE_title1@2x.png"
                alt=""
              >
            </div>
            <div class='selector-group'>
              <factory-selector @passId='facFilterHandler'></factory-selector>
              <selector @passId='staffFilter'></selector>
            </div>
          </div>
          <div class="item-content">
            <today-summary
              :factoryId='factoryId'
              :chargerId='chargerId'
            ></today-summary>
          </div>
        </div>
        <!-- 今日产能 end -->

        <!-- 今日合格产能曲线 start -->
        <div class="part-item-wrap">
          <div class="item-header space-between">
            <div class="header-left">
              <img
                src="../assets/images/SliceToAE_title2@2x.png"
                alt=""
                class="six-word-title"
              >
              <div class="line-type-wrap">
                <div class="line-item">
                  <span class="line-name">
                    合格产量
                  </span>
                  <div class="line-style line-blue"></div>
                </div>
                <div class="line-item">
                  <span class="line-name">
                    返工量
                  </span>
                  <div class="line-style line-orange"></div>
                </div>
                <div class="line-item">
                  <span class="line-name">
                    废品量
                  </span>
                  <div class="line-style line-rose-red"></div>
                </div>
                <div class="line-item">
                  <span class="line-name">
                    合格率
                  </span>
                  <div class="line-short-style"></div>
                  <div class="line-short-style"></div>
                </div>
              </div>
            </div>
            <!-- <selector @passId='test'></selector> -->
          </div>
          <div class="item-content">
            <div class="line-chart-wrap">
              <line-charts
                :id="'today'"
                :chartData='todayProducingData'
              ></line-charts>
            </div>
          </div>
        </div>
        <!-- 今日合格产能曲线 end -->

        <!-- 七日合格产能曲线 start -->
        <div class="part-item-wrap">
          <div class="item-header">
            <div class="header-left">
              <img
                src="../assets/images/SliceToAE_title3@2x.png"
                alt=""
                class="sevent-day-line"
              >
            </div>
          </div>
          <div class="item-content">
            <div class="line-chart-wrap">
              <line-charts
                :id="'seventToday'"
                :chartData='weekProductingData'
              ></line-charts>
            </div>
          </div>
        </div>
        <!-- 七日合格产能曲线 end -->

        <!-- 智能提醒 start-->
        <div class="part-item-wrap">
          <div class="item-header">
            <img
              src="../assets/images/SliceToAE_title4@2x.png"
              alt=""
              class="four-word-title"
            >
          </div>
          <div class="item-content">
            <smartReminderSwiper></smartReminderSwiper>
          </div>
        </div>
        <!-- 智能提醒 end-->
      </div>
      <div class="right-part">
        <!-- 生产中的工单 start -->
        <div class="part-item-wrap">
          <div class="item-header">
            <img
              src="../assets/images/SliceToAE_title5@2x.png"
              alt=""
              class="six-word-title"
            >
            <div class="header-detail">
              <span class="detail-num">{{workOrderCount}}</span> 个工单 共计
              <span class="detail-num">{{workOrderTotal}}</span> 件货品
            </div>
          </div>
          <div class="item-content">
            <producing-swiper :workOrderArr='workOrderArr'></producing-swiper>
          </div>
        </div>
        <!-- 生产中的工单 end -->

        <!-- 工单交期 start -->
        <div class="part-item-wrap">
          <div class="item-header">
            <img
              src="../assets/images/SliceToAE_title6@2x.png"
              alt=""
              class="eight-word-title"
            >
            <div class="header-detail">
              未来一周共计
              <span class="detail-num">{{workingTotal}}</span> 个工单到达交期
            </div>
          </div>
          <div class="item-content">
            <bar-graph :weekdata='workTime'></bar-graph>
          </div>
        </div>
        <!-- 工单交期 end -->

      </div>
      <img
        src="../assets/images/SliceToAE_decroation@2x.png"
        alt=""
        class="header-icon"
      >
    </div>
    <background></background>
    <div
      class="mask"
      v-if="loading"
    >
      <div class="mask-text">
        <img
          src="../assets/images/loading-motion-1.gif"
          alt=""
        >
        <p>全力数据加载中…</p>
      </div>
    </div>
  </div>
</template>
<script>
import LineCharts from '../components/lineReport/lineCharts';
import ProducingSwiper from '../components/lineReport/producingSwiper';
import BarGraph from '../components/lineReport/barGraph'
import Background from '../components/lineReport/backGround'
import smartReminderSwiper from '../components/lineReport/smartReminder'
import { producingWorkOrder, todayProducing, todayProducingCurve, weekProductingCurve, orderStatus } from '../api/lineReport/lineReportApi';
import TodaySummary from '../components/lineReport/todaySummary'
import selector from '../components/lineReport/selector'
import factorySelector from '../components/lineReport/factory-selector'
export default {
  data() {
    return {
      //正在进行中的工单数组
      workOrderArr: [],
      //正在进行中的工单数量
      workOrderCount: 0,
      //正在进行中的工单货品总数
      workOrderTotal: 0,
      // 今日产能曲线数据
      todayProducingData: {
        times: [],
        series: []
      },
      // 七日合格产能曲线数据
      weekProductingData: {
        times: [],
        series: []
      },
      loading: true,
      timer: null,
      // 工单交期/生产状态
      workTime: [],
      workingTotal: 0,
      chargerId: [],
      factoryId: []
    };
  },
  methods: {
    // 获取生产中的工单
    getWorkingData() {

      return producingWorkOrder(this.getUnitId())
        .then(res => {
          this.workOrderArr = res.data.pages;
          this.workOrderCount = res.data.count;
          this.workOrderTotal = res.data.total;
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 获取今日产能曲线
    getTodayProducingCurve() {
      return todayProducingCurve({ ...this.getUnitId(), chargerIds: this.chargerId, outsideFactoryIds: this.factoryId }).then(res => {
        this.todayProducingData.series = res.data.series
        this.todayProducingData.times = res.data.times
      }).catch(err => {
        console.log(err)
      })
    },
    // 获取七日合格产能曲线
    getWeekProductingCurve() {
      return weekProductingCurve({ ...this.getUnitId(), chargerIds: this.chargerId, outsideFactoryIds: this.factoryId }).then(res => {
        this.weekProductingData.series = res.data.series
        this.weekProductingData.times = res.data.times
      }).catch(err => {
        console.log(err)
      })
    },
    // 获取工单交期/生产状态
    getChartData() {
      let params = {
        unitId: JSON.parse(sessionStorage.getItem('last_login')).id
      };
      orderStatus(params).then(res => {
        this.workingTotal = res.data.quantity;
        this.workTime.weekData = res.data.week;
      }).catch(err => {
        console.log(err)
      })
    },
    // 获取unitId
    getUnitId() {
      let params = {
        unitId: JSON.parse(sessionStorage.getItem('last_login')).id
      };
      return params
    },
    // 发送请求
    sendRequest() {
      Promise.all([this.getTodayProducingCurve(), this.getWeekProductingCurve(), this.getWorkingData(), this.getChartData()]).then(res => {
        this.loading = false;
      }).catch(err => {
        console.log(err)
      })
    },
    facFilterHandler(val) {
      this.factoryId = val;
      Promise.all([this.getTodayProducingCurve(), this.getWeekProductingCurve()])
    },
    staffFilter(val) {
      this.chargerId = val;
      Promise.all([this.getTodayProducingCurve(), this.getWeekProductingCurve()])
    }
  },
  created() {
    this.sendRequest();
    this.timer = setInterval(() => {
        this.sendRequest();
    }, 15000)
  },
  destroyed() {
    clearInterval(this.timer)
  },
  watch: {
  },
  components: {
    LineCharts,
    ProducingSwiper,
    BarGraph,
    Background,
    smartReminderSwiper,
    TodaySummary,
    selector,
    factorySelector
  }
};
</script>
<style lang="scss" scoped>
@function pxTovw($px) {
  @return $px / 1440 * 100 + vw;
}
@mixin computeSize($width, $height) {
  width: $width/2 + px;
  height: $height/2 + px;
}
@font-face {
  font-family: "FZLTTHJW-GB1-0";
  src: local("static/方正兰亭大黑_GBK.ttf");
}
@font-face {
  font-family: "FZLTXHK";
  src: local("static/方正兰亭纤黑.ttf");
}
.root-wrap {
  width: 100%;
  height: 100%;
  position: relative;
  background: linear-gradient(119deg, #111c55, #080d36 17%, #0e0530);
  overflow-x: hidden;
  overflow-y: scroll;
  min-width: 1440px;
}
.wrap {
  width: 100%;
  padding: 45px 39px 33px 48px;
  display: flex;
  position: absolute;
  z-index: 99;
}
.item-title-pic {
  img {
    max-width: 100%;
    max-height: 100%;
  }
}
.four-word-title {
  @include computeSize(188, 70);
}
.six-word-title {
  @include computeSize(268, 70);
}
.sevent-day-line {
  @include computeSize(348, 70);
}
.eight-word-title {
  @include computeSize(366, 70);
}

.left-part {
  padding-right: pxTovw(30);
  border-right: solid 2px #1e1e3d;
}
.right-part {
  padding-left: pxTovw(30);
}
.header-icon {
  position: absolute;
  top: 15px;
  left: 0;
  width: 32px;
  height: 81px;
}
.part-item-wrap:not(:last-child) {
  margin-bottom: pxTovw(14);
}
.item-header {
  display: flex;
  align-items: center;
  margin-bottom: pxTovw(10);
  .line-type-wrap {
    min-width: pxTovw(378);
    height: pxTovw(7);
    padding: pxTovw(8) pxTovw(24);
    opacity: 0.9;
    border-radius: 11px;
    background-color: #1e1a4c;
    display: flex;
    justify-content: space-between;
    .line-item {
      display: flex;
      align-items: center;
    }
    .line-name {
      font-family: STHeitiSC;
      font-size: pxTovw(12);
      font-weight: 300;
      color: #7d86de;
    }
    .line-style {
      margin-left: pxTovw(14);
      width: pxTovw(23);
      height: 2px;
      border-radius: 5px;
    }
    .line-short-style {
      width: 15px;
      height: 2px;
      margin-right: 5px;
      border-radius: 5px;
      background-color: #4b4f8e;
      box-shadow: 0 0 4px 0 #4b4f8e;
      margin-left: 14px;
    }
    .line-short-style:last-child {
      margin-left: 0;
    }
    .line-blue {
      background-color: #76d3fc;
      box-shadow: 0 0 4px 0 #2fade4;
    }
    .line-orange {
      box-shadow: 0 0 4px 0 #f1a185;
      background-color: #f7835a;
    }
    .line-rose-red {
      box-shadow: 0 0 4px 0 #fa6d98;
      background-color: #ef4377;
    }
  }
  .header-left {
    display: flex;
    flex: 1;
    align-items: center;
  }
  .header-detail {
    min-width: pxTovw(154);
    height: pxTovw(19);
    line-height: pxTovw(19);
    color: #7d86de;
    padding: pxTovw(2) pxTovw(14);
    font-size: pxTovw(12);
    text-align: center;
    opacity: 0.9;
    border-radius: 15px;
    background-color: #1d1f54;
    .detail-num {
      color: #76d3fc;
      font-size: pxTovw(14);
    }
  }
}
.item-content {
  display: flex;
  .line-chart-wrap {
    min-width: pxTovw(720);
    min-height: pxTovw(165);
    opacity: 0.9;
    border-radius: 10px;
    background: linear-gradient(to top, #161148, #201a56);
    display: flex;
    align-items: center;
  }
  .producing-item-wrap {
    margin-top: 15px;
    .producing-item {
      width: 762px;
      height: 110px;
      opacity: 0.8;
      border-radius: 10px;
      margin-bottom: 10px;
      background-image: linear-gradient(278deg, #171c5d, #211b59);
    }
  }
}
.blue-color {
  color: #76d3fc;
}
.orange-color {
  color: #f7835a;
}
.rose-red-color {
  color: #ef4377;
}
.mask {
  width: 100%;
  height: 100%;
  position: relative;
  background-color: rgba(11, 6, 29, 0.49);
  z-index: 101;
  .mask-text {
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 102;
    transform: translate(-50%, -50%);
    p {
      text-align: center;
      margin-top: 28px;
      font-size: 18px;
      color: #fff;
    }
  }
}
.space-between {
  justify-content: space-between;
}
.selector-group {
  display: flex;
}
</style>
