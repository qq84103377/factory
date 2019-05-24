<template>
    <div class="line-bar-wrap">
        <div class="line-bar" :style="{'height':percent+'%'}"></div>
    </div>
</template>
<script>
export default {

    props: {
        percent: {
            default: 0,
            type: Number
        }
    }
}
</script>

<style lang="scss" scoped>
@function pxTovw($px) {
    @return $px / 1440 * 100 + vw;
}
.line-bar-wrap {
    width: pxTovw(8);
    height: pxTovw(225);
    background: #16164a;
    border-radius: 5px;
    display: flex;
    justify-content: space-between;
    flex-direction: column-reverse;
    transition: all 1s;
    margin-bottom: pxTovw(31);
    .line-bar {
        width: pxTovw(8);
        border-radius: 5px;
        background: linear-gradient(to bottom, #8fd3ff, #67a9df 11%, #3f3c96);
        transition: all 1s;
    }
}
</style>

