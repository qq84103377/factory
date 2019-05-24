<template>
  <div class="crosswise-wrap">
      <div class="percent">
          {{`${completed}/${total}   (${computPercent})`}}
      </div>
      <div class="progress-bar-wrap">
          <div class="progress-bar" :style="{'width':computPercent}"></div>
      </div>
  </div>
</template>
<script>
export default {
    props: {
        total: {
            default: 0,
            type: Number
        },
        completed: {
            default: 0,
            type: Number
        }
    },
    computed: {
        computPercent() {
            if (this.total == 0) {
                return '0%'
            } else {
                return `${parseInt(this.completed / this.total * 100)}%`
            }
        }
    }
}
</script>
<style lang="scss" scoped>
@function pxTovw($px) {
    @return $px / 1440 * 100 + vw;
}
.crosswise-wrap {
    // width: 324px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-around;
    .percent {
        font-family: FZLTXHK;
        font-size: pxTovw(12);
        color: #76d3fc;
    }
    .progress-bar-wrap {
        width: pxTovw(150);
        // flex: 1;
        height: 4px;
        border-radius: 5px;
        background-color: #233f66;
        overflow: hidden;
    }
    .progress-bar {
        height: 4px;
        transition: all 1.5s;
        border-radius: 5px;
        background-color: #76d3fc;
        box-shadow: 0 0 4px 0 #2fade4;
    }
}
</style>

