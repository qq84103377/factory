<template>
    <transition name="bounce">
        <div class="bubble">
            +{{number}}
        </div>
    </transition>
</template>
<script>
export default {
    props: ['number']
}
</script>
<style lang="scss" scoped>
.bubble {
    min-width: 30px;
    height: 22px;
    padding: 0 5px;
    line-height: 22px;
    border-radius: 11px;
    background: linear-gradient(to bottom, rgb(239, 67, 119), rgb(240, 38, 81));
    box-shadow: 0 8px 6px -2px rgba(127, 14, 37, 0.5);
    font-family: FZLTTHJW-GB1-0;
    font-size: 12px;
    text-align: center;
    color: rgb(255, 255, 255);
    position: absolute;
}
.bounce-enter-active {
    animation: bounce-in 0.5s;
}
.bounce-leave-active {
    animation: bounce-out 1.5s;
}
@keyframes bounce-in {
    0% {
        transform: scale(0);
    }
    50% {
        transform: scale(1.5);
    }
    100% {
        transform: scale(1);
    }
}
@keyframes bounce-out {
    0% {
        opacity: 1;
    }
    100% {
        opacity: 0;
    }
}
</style>

