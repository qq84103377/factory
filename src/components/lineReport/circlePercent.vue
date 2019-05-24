<template>
  <div class="circle-wrap">
    <svg
      width="100"
      height="100"
      viewBox="0 0 100 100"
      class="circle-svg"
    >
      <circle
        cx="43"
        cy="43"
        r="39"
        stroke-width="3"
        :stroke="unloadColor"
        fill="none"
      ></circle>
      <circle
        cx="43"
        cy="43"
        r="39"
        stroke-width="6"
        :stroke="shadowColor"
        fill="none"
        transform="matrix(0,-1,1,0,0,86)"
        :stroke-dasharray="computPercent"
        stroke-linecap='round'
        filter='url(#Gaussian_Blur)'
      ></circle>
      <circle
        cx="43"
        cy="43"
        r="39"
        stroke-width="4"
        :stroke="lineColor"
        fill="none"
        stroke-opacity='0.9'
        transform="matrix(0,-1,1,0,0,86)"
        :stroke-dasharray="computPercent"
        stroke-linecap='round'
      ></circle>
      <defs>
        <filter id="Gaussian_Blur">
          <feGaussianBlur
            in="SourceGraphic"
            stdDeviation="1"
          />
        </filter>
      </defs>
    </svg>
    <span
      class="circle-num"
      :style="{'color':lineColor}"
    >
      {{circlePercent}}%
    </span>
  </div>
</template>
<script>
export default {
  props: {
    percent: {
      default: 10,
      type: Number
    },
    shadowColor: {
      default: '#2fade4',
      type: String
    },
    lineColor: {
      default: '#76d3fc',
      type: String
    },
    unloadColor: {
      default: '#233f66',
      type: String
    }
  },
  data() {
    return {
      circlePercent: 0
    }
  },
  computed: {
    computPercent() {
      let percent = this.percent / 100;
      let perimeter = Math.PI * 2 * 39;
      return `${percent * perimeter} ${perimeter * (1 - percent)}`;
    }
  },
  watch: {
    percent: {
      handler(nowVal, oldVal) {
        console.log(nowVal, oldVal);
        console.log(this, this.circlePercent);
        let timer = setInterval(() => {
          if (oldVal < nowVal) {
            if (parseInt(this.circlePercent) == parseInt(nowVal)) {
              this.circlePercent = nowVal;
              clearInterval(timer)
            } else {
              this.circlePercent += 1
            }
          } else if (oldVal > nowVal) {
            if (parseInt(this.circlePercent) == parseInt(nowVal)) {
              this.circlePercent = nowVal;
              clearInterval(timer)
            } else {
              this.circlePercent = (this.circlePercent - 1).toFixed(2)
            }
          }
          else {
            clearInterval(timer)
          }
        }, 10)
      },
      deep: true
    }
  }
};
</script>

<style lang="scss" scoped>
@function pxTovw($px) {
  @return $px / 1440 * 100 + vw;
}
.circle-wrap {
  position: relative;
  left: 20px;
  .circle-num {
    position: absolute;
    left: 46%;
    top: 42%;
    transform: translate(-50%, -50%);
    font-size: pxTovw(14);
    text-align: center;
    text-shadow: 0 6px 8px #2f346a;
    font-weight: bold;
  }
}
circle {
  transition: stroke-dasharray 3s;
}
</style>
