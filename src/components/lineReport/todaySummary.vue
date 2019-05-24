<template>
  <div class="summry-wrap">
    <div class="item">
      <div class="item-title">
        今日合格产量
      </div>
      <div class="item-num-wrap">
        <span class="item-num blue-color">
          {{todayProductingSummary.qualifiedCount}}
          <bubble
            :number='qualifiedDiffVal'
            class="bubble-qualified"
            v-if="qualifiedDiffVal>0"
          >
          </bubble>
        </span>
        <circle-percent :percent='todayProductingSummary.qualifiedRatio'></circle-percent>
      </div>
    </div>
    <div class="item">
      <div class="item-title">
        今日次品量
      </div>
      <div class="item-num-wrap">
        <span class="item-num orange-color">
          {{todayProductingSummary.defectiveCount}}
          <bubble
            :number='defectiveDiffVal'
            class="bubble-qualified"
            v-if="defectiveDiffVal>0"
          >
          </bubble>
        </span>
        <circle-percent
          :shadowColor='"#f1a185"'
          :lineColor='"#f7835a"'
          :unloadColor='"#674d43"'
          :percent='todayProductingSummary.defectiveRatio'
        >
        </circle-percent>
      </div>
    </div>
    <div class="item">
      <div class="item-title">
        今日废品量
      </div>
      <div class="item-num-wrap">
        <span class="item-num rose-red-color">
          {{todayProductingSummary.wastedCount}}
          <bubble
            :number='wastedDiffVal'
            class="bubble-qualified"
            v-if="wastedDiffVal>0"
          >
          </bubble>
        </span>
        <circle-percent
          :shadowColor='"#fa6d98"'
          :lineColor='"#ef4377"'
          :unloadColor='"#7f4053"'
          :percent='todayProductingSummary.wastedRatio'
        >
        </circle-percent>
      </div>
    </div>
  </div>
</template>
<script>
import CirclePercent from './circlePercent'
import Bubble from './bubble'
import { todayProducing } from '../../api/lineReport/lineReportApi'
export default {
  props: ['factoryId', 'chargerId'],
  data() {
    return {
      // 今日产能汇总
      todayProductingSummary: {
        qualifiedCount: 0,
        qualifiedRatio: 0,
        defectiveCount: 0,
        defectiveRatio: 0,
        wastedCount: 0,
        wastedRatio: 0
      },
      // 今日产量-合格差值
      qualifiedDiffVal: 0,
      // 今日产量-次品差值
      defectiveDiffVal: 0,
      // 今日产量-废品差值
      wastedDiffVal: 0,
      timer: null,
      factoryId: [],
      chargerId: []
    }
  },
  methods: {
    // 获取今日产能
    getTodayProdcuting() {
      let params = {
        unitId: JSON.parse(sessionStorage.getItem('last_login')).id,
        outsideFactoryIds: this.factoryId,
        chargerIds: this.chargerId
      };
      return todayProducing(params).then(res => {
        this.todayProductingSummary = res.data.summary
      }).catch(err => {
        console.log(err)
      })
    },
    // 计算差值
    watchDiffVal(newVal, oldVal, target) {
      if (oldVal != 0) {
        this[target] = newVal - oldVal;
        setTimeout(() => {
          this[target] = 0;
        }, 2000)
      }
    }
  },
  watch: {
    "todayProductingSummary.qualifiedCount": {
      handler(newVal, oldVal) {
        if (oldVal != 0) {
          this.watchDiffVal(newVal, oldVal, 'qualifiedDiffVal')
        }
      },
      deep: true
    },
    "todayProductingSummary.defectiveCount": {
      handler(newVal, oldVal) {
        if (oldVal != 0) {
          this.watchDiffVal(newVal, oldVal, 'defectiveDiffVal')
        }
      },
      deep: true
    },
    "todayProductingSummary.wastedCount": {
      handler(newVal, oldVal) {
        if (oldVal != 0) {
          this.watchDiffVal(newVal, oldVal, 'wastedDiffVal')
        }
      },
      deep: true
    },
    factoryId(val) {
      this.factoryId = val;
      this.getTodayProdcuting();
    },
    chargerId(val) {
      this.chargerId = val;
      this.getTodayProdcuting();
    }
  },
  components: {
    CirclePercent,
    Bubble
  },
  created() {
    this.getTodayProdcuting()
    this.timer = setInterval(() => {
        this.getTodayProdcuting()
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
.summry-wrap {
  display: flex;
  width: 100%;
  height: 100%;
  // justify-content: space-between;
}
.item {
  min-width: 13vw;
  min-height: pxTovw(97);
  opacity: 0.9;
  border-radius: 15px;
  background: linear-gradient(
    315deg,
    rgba(34, 26, 74, 1) 0%,
    rgba(36, 33, 90, 1) 100%
  );
  box-shadow: 0px 21px 15px -15px rgba(6, 7, 41, 1);
  padding: pxTovw(17) pxTovw(23) 0 pxTovw(16);
  .item-title {
    font-family: FZLTXHK;
    font-size: pxTovw(14);
    color: #8e96e8;
    text-shadow: 0 0 6px #615ada;
  }
  .item-num-wrap {
    display: flex;
    justify-content: space-between;
  }
  .item-num {
    font-family: FZLTTHJW-GB1-0;
    font-size: pxTovw(54);
    margin-top: 22px;
    position: relative;
    text-shadow: 0 6px 8px #0f0e3a;
  }
}
.item:not(:last-child) {
  margin-right: pxTovw(23);
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
.bubble-qualified {
  top: -42px;
  left: 121px;
}
</style>
