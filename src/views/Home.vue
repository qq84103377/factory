<template>
    <section class="home clearfix">
        <div class="home_nav fl">
            <nav-home v-if="navModule === 1 || ''"></nav-home>
            <nav-unit v-if="navModule === 2"></nav-unit>
        </div>
        <div class="home_content">
            <div class="home_content--topbar">
                <topbar @loginOut="handleDisconnect"></topbar>
            </div>
            <div class="home_content--main">
                <keep-alive :include="keepAliveArr">
                    <router-view v-if="$route.meta.keepAlive && isRouterAlive"></router-view>
                </keep-alive>
                <router-view v-if="!$route.meta.keepAlive && isRouterAlive"></router-view>
            </div>
        </div>
    </section>

</template>

<script>
// import { RongYunInit } from "../plugin/rongyun";         //注释融云
import { getRongYunToken, getMissionInfoByBarcode } from "@/api";
import { mapState, mapMutations, mapGetters } from "vuex";
export default {
    provide() {
        return {
            homeRouterReload: this.homeRouterReload
        }
    },
    data() {
        return {
            isRouterAlive: true,
            instance: null,
            errorDialogVisible: false,
            missionDialogVisible: false
        };
    },

    async mounted() {
        if (this.$store.state.userInfo.id === void 0) {
            await this.$store.dispatch("getUserInfo");
        }
        // 注释融云
        // let userId = await this.$store.state.userInfo.id;
        // const token = await this.fetchToken(userId);
        // const key = process.env.RongYunKey;
        // RongYunInit(
        //     {
        //         token: token,
        //         appKey: key
        //     },
        //     {
        //         getMessage: this.getRongYunRes,
        //         getInstance: this.getInstance
        //     }
        // );
    },
    computed: {
        ...mapState({
            keepAliveArr: state => state.TabView.keepAliveArr
        }),
        navModule() {
            return this.$route.meta.module || "";
        }
    },
    watch: {
        $route(to, from) {
            if (to.meta.keepAlive) {
                const matchedComponents = this.$router.getMatchedComponents();
                this.$store.dispatch('addKeepLive', matchedComponents[matchedComponents.length - 1].name);
            }
        }
    },
    methods: {
        ...mapMutations(["getRongYunRes", "setScanInfo"]),
        // 获取融云token
        fetchToken(userId) {
            return getRongYunToken({
                userId: userId
            }).then(res => {
                return res.data;
            });
        },
        getInstance(instance) {
            this.instance = instance;
        },
        handleDisconnect() {
            this.instance.disconnect();
        },
        //全局刷新方法
        homeRouterReload() {
            this.isRouterAlive = false;
            this.$nextTick(function () {
                this.isRouterAlive = true;
            })
        }
    }
};
</script>

<style lang="scss" scoped>
.home {
    min-width: 960px;
    width: 100%;
    height: 100%;
    background-color: #fff;
    overflow: hidden;
    &_nav {
        width: 200px;
        flex: 0 0 200px;
        height: 100%;
        overflow-y: auto;
    }
    &_content {
        display: flex;
        flex-direction: column;
        height: 100%;
        overflow: hidden; // 触发BFC
        &--topbar {
            width: 100%;
            z-index: 1;
        }
        &--main {
            flex: 1;
            height: 100%;
            padding: 24px;
            overflow-y: auto;
            background-color: #F0F2F5;
        }
    }

    .error {
        text-align: center;
        &-title {
            margin-top: 32px;
            margin-bottom: 8px;
            font-size: 16px;
        }
        &-desc {
            color: #a2abb8;
        }
    }
    .mission {
        max-height: 550px;
        overflow-y: scroll;
    }
}
</style>
