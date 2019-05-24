<template>
<transition name="dialog-fade">
    <div class="preview-box" v-show="visble">
        <div class="modal" @click="visble = false" v-show="visble"></div>
        <i class="icon prev el-icon-arrow-left"></i>
        
        <div class="swiper">
            <div class="swiper-item" v-for="(item, index) in 1">
                <img src="https://image3.myjuniu.com/bd5324d510034567bd1d353602183313_pro_fd07132005cdb174a17aa38d76b04270" />
            </div>
        </div>
        <i class="icon next el-icon-arrow-right"></i>
    </div>
</transition>
</template>

<script>
    export default {
        data() {
            return {

            }
        },
        props: {
            value: ''
        },
        computed: {
            visble: {
                get() {
                    return this.value
                },
                set(val, oldVal) {
                    this.$emit('input', val)
                }
            } 
        }
    }
</script>

<style lang="scss" scoped>
.dialog-fade-enter-active { 
    animation:dialog-fade-in .3s;
}
.dialog-fade-leave-active{ 
    animation:dialog-fade-out .3s
}
@keyframes dialog-fade-in{
    0% {
        transform:translate3d(0,-20px,0);
        opacity:0
    }
    100%{
        transform:translate3d(0,0,0);
        opacity:1
    }
}
@keyframes dialog-fade-out{
    0% {
        transform:translate3d(0,0,0);
        opacity:1
    }
    100%{
        transform:translate3d(0,-20px,0);
        opacity:0
    }
}
.modal{
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: .5;
    background: #000;
    z-index: -1
}
.preview-box {
    position: fixed;
    left: 0;
    top: 0;
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
    overflow: auto;
    z-index: 9999;
    .swiper {
        margin: auto;
    }
    .swiper-item {
        max-width: 700px;
        max-height: 700px;
        img {
            width: 100%;
            height: 100%
        }
    }
}
</style>