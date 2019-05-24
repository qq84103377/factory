<template>
<div class="progress">
   <svg viewBox="0 0 100 100" style="width:100%;height:100%">
        <path class="el-progress-circle__track" stroke-width="4.8" :d="trackPath" stroke="#ffffff" fill="none"></path>
        <path class="el-progress-circle__path" stroke-width="4.8" :d="trackPath" stroke-linecap="round" stroke="#1ca1ff" fill="none" :style="circlePathStyle"></path>
    </svg>
</div>
</template>

<script>
export default {
    props: {
        percentage: {
            type: Number,
            default: 0
        }
    },
    computed: {
        trackPath() {
            var radius = parseInt(50 - parseFloat(this.relativeStrokeWidth) / 2, 10);

            return `M 50 50 m 0 -${radius} a ${radius} ${radius} 0 1 1 0 ${radius * 2} a ${radius} ${radius} 0 1 1 0 -${radius * 2}`;
        },
        relativeStrokeWidth() {
            return (6 / 100 * 100).toFixed(1);
        },
        perimeter() {
            var radius = 50 - parseFloat(this.relativeStrokeWidth) / 2;
            return 2 * Math.PI * radius;
        },
        circlePathStyle() {
            var perimeter = this.perimeter;
            return {
                strokeDasharray: `${perimeter}px,${perimeter}px`,
                strokeDashoffset: (1 - this.percentage / 100) * perimeter + 'px',
                transition: 'stroke-dashoffset 0.6s ease 0s, stroke 0.6s ease'
            };
        },
    }
}
</script>

<style scoped>
  .progress {
        position: absolute;
        top: -2px;
        left: -3px;
        /* z-index: -1; */
        width: 37px;
        height: 36px;
  }
</style>
