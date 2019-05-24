<template>
    <div class="navUnit">
        <div class="navUnit_bg">
            <p class="navUnit_header">全局设置</p>
            <div class="navUnit_menu">
                <el-menu router :default-active="activeSrc" v-for="(item, index) in navList" :key="index" >
                    <div >
                        <el-submenu v-if="!item.path">
                            <template slot="title" class="item">
                                <span class="icon_wrap">
                                    <icon class="icon" :type="item.icon"></icon>
                                </span>
                                {{item.name}}
                            </template>
                            <el-menu-item-group>
                                <el-menu-item :index="e.path" v-for="(e, num) in item.child" :key="num">{{e.name}}</el-menu-item>
                            </el-menu-item-group>
                        </el-submenu>
                        <el-menu-item class="item" :index="item.path" v-if="item.path">
                            <span class="icon_wrap">
                                <icon class="icon" :type="item.icon"></icon>
                            </span>
                            {{item.name}}
                        </el-menu-item>
                    </div>
                </el-menu>
            </div>
            <div class="navUnit_back">
                <span @click="goHome">
                    <i class="el-icon-arrow-left"></i>返回工厂</span>
            </div>
        </div>
    </div>
</template>

<script>
import data from "./data/navUnit.js";
export default {
    data() {
        return {
            navList: data // 导航list
        };
    },
    computed: {
        activeSrc() {
            return "/" + this.$route.meta.belong;
        }
    },
    methods: {
        goHome() {
            let goBackUrl= sessionStorage.getItem('leftMenuFirstUrl');
            console.log(goBackUrl,'有权限的第一个地址')
            this.$router.push(goBackUrl);
        }
    },
    created(){
        // ;
    },
};
</script>

<style lang="scss" scoped>
.navUnit {
    box-sizing: border-box;
    width: 100%;
    min-height: 100%;
    color: rgba(255, 255, 255, 0.3);
    background-image: linear-gradient(166deg, #4e5b66, #444f59);
    padding-bottom: 50px;
    &_bg {
        width: 100%;
        height: 100%;
        background: url(../../../../assets/images/pic-setting_navbar.png) no-repeat;
    }
    &_header {
        padding: 88px 0 52px 24px;
        font-size: 20px;
        color: rgba(255, 255, 255, 0.8);
    }
    &_menu {
        .icon_wrap {
            display: inline-block;
            width: 24px;
        }
        .icon {
            position: relative;
            top: -1px;
            opacity: 0.5;
        }
    }
    &_back {
        padding: 48px 0 0 24px;
        span {
            padding: 10px 16px;
            color: rgba(255, 255, 255, 0.3);
            border-radius: 24px;
            border: 1px solid rgba(255, 255, 255, 0.3);
            cursor: pointer;
            &:hover {
                color: rgba(255, 255, 255, 0.7);
                border: 1px solid rgba(255, 255, 255, 0.7);
            }
        }
    }
}
.is-active {
    position: relative;
    background-color: rgba(255, 255, 255, 0.03) !important;
    color: rgb(255, 255, 255) !important;
    &::before {
        position: absolute;
        left: 0px;
        content: " ";
        width: 8px;
        height: 48px;
        background-color: #ffa914;
    }
    .icon {
        opacity: 1 !important;
    }
}
</style>
<<style lang="scss">
.navUnit_menu {
    .el-menu {
        border-radius: 0;
        background-color: transparent;
    }
    .el-menu .el-menu-item {
        padding-left: 24px !important;
        margin-bottom: 2px;
        height: 48px;
        line-height: 48px;
    }
    .el-menu-item-group .el-menu-item {
        padding-left: 60px !important;
        height: 40px;
        line-height: 40px;
    }
    .el-submenu__title {
        margin-bottom: 2px;
        padding-left: 24px !important;
        height: 48px;
        line-height: 48px;
    }
    .el-menu-item,
    .el-submenu__title {
        color: rgba(225, 225, 225, 0.5);
    }
    .el-submenu .el-menu-item:hover,
    .el-submenu__title:hover {
        background-color: rgba(255, 255, 255, 0.03);
        color: rgb(255, 255, 255) !important;
    }
    .el-menu--horizontal.el-menu--dark .el-submenu .el-menu-item:hover,
    .el-menu--horizontal.el-menu--dark .el-submenu .el-submenu-title:hover,
    .el-menu-item:hover {
        background-color: rgba(255, 255, 255, 0.03);
        color: rgb(255, 255, 255) !important;
    }
    .el-menu-item-group__title {
        padding-top: 0;
    }
}
</style>

