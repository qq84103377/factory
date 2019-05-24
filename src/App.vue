<template>
    <div id="app">
        <transition name="fade" mode="out-in">
            <router-view></router-view>
        </transition>
    </div>
</template>
<script>

const ENV = process.env.NODE_ENV;
export default {
    name: "app",
    mounted() {
        this.setDocumentTitle();
    },
    methods: {
        setDocumentTitle() {
            switch(ENV) {
                case 'beta': return document.title = '云工厂-Beta';
                case 'preprd': return document.title = '云工厂-准生产';
                case 'alpha': return document.title = '云工厂-Alpha';
                case 'development': return document.title = '云工厂-development';
                default: document.title = '云工厂';
            }
        }
    },
    components: {}
};
</script>

<style lang="scss">
@import "./assets/style/reset.css";
@import "./assets/icons/iconfont.css";
@import "./assets/style/element-reset.scss";

#app {
    position: absolute;
    top: 0px;
    bottom: 0px;
    width: 100%;
    height: 100%;
    // overflow-x: hidden;
    overflow-y: auto;
    color: #3b3b3b;
}

.el-message {
    position: absolute;
    /*width: 200px;*/
    z-index: 999999;
}
.select-popper {
    padding: 0 !important;
}
.nf-scroll-container {
    display: flex;
    width: 100%;
    height: 100%;
    flex-direction: column;
    overflow: hidden;
    .nf-scroll-view {
        flex: 1;
        overflow-y: auto;
        &::-webkit-scrollbar {
            width: 6px;
            height: 6px;
        }
        &::-webkit-scrollbar-thumb {
            background-color: #c2c2c2;
            background-clip: padding-box;
            min-height: 28px;
        }
        &::-webkit-scrollbar-track-piece {
            background-color: #fff;
        }
    }
}

.el-tag {
    background: none;
}
.el-tag--primary,
.el-tag {
    background-color: #f2f5fa;
    border: none;
    border-radius: 2px;
    font-size: 12px;
    padding: 0 6px;
    color: #2c2c2c;
    height: 24px;
    .el-icon-close {
        color: #bcc1cc;
        &:hover {
            background-color: #bcc1cc;
            color: #fff;
        }
    }
}
</style>
