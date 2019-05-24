<template>
    <div class="topbar">
        <el-scrollbar class="tabs-view-wrapper">
            <tabs-view></tabs-view>
        </el-scrollbar>
        <div class="topbar_line"></div>
        <div class="topbar_set">
            <p  @click="goSetting" v-if="userInfo.type === 1">
                <span>产品中心</span>
            </p>
        </div>
        <div class="topbar_line"></div>
        <el-dropdown>
            <div class="topbar_info">
                <div class="topbar_img">
                    <img :src="userInfo.headImg" v-if="userInfo.headImg" alt="头像">
                    <p v-else>{{userInfo.userName | filterName}}</p>
                </div>
                <div class="topbar_name">
                    <p class="user_name">{{userInfo.userName}}</p>
                    <p class="login_name">
                        <span v-if="userInfo.type!==1">
                            {{userInfo.bossCode}} - {{userInfo.loginName}}
                        </span>
                        <span v-else>{{userInfo.loginName}}</span>
                    </p>
                </div>
                <i class="el-icon-caret-bottom topbar_icon"></i>
            </div>
            <el-dropdown-menu slot="dropdown" class="dropdown">
                <el-dropdown-item @click.native="goToMyData">
                    <span class="my_info">我的资料</span>
                </el-dropdown-item>
                <el-dropdown-item @click.native="loginout">
                    <span class="login_out">退出登录</span>
                </el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
    </div>
</template>

<script>
    import TabsView from '@/components/Common/tabs-view';

    import { mapGetters } from 'vuex';
export default {
    data() {
        return {};
    },
    computed: {
        ...mapGetters(['userInfo'])
    },
    filters: {
        filterName(val) {
            if (val === void 0 || val.length === 0) {
                return;
            }
            if (val.length > 2) {
                return val.substr(-2);
            }
            return val;
        }
    },
    components: {
        TabsView
    },
    methods: {
        goToMyData() {
            this.$router.push('/my-data2');
        },
        loginout() {
            this.$confirm('您确认要退出吗?', '退出', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    sessionStorage.clear();
                    this.$store.commit('setUserInfo', {});
                    this.$store.commit('setFacs', {});
                    this.$message({
                        type: 'success',
                        message: '退出成功!'
                    });
                    this.$emit('loginOut');
                    this.$router.replace('/login');
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
        },
        goSetting() {
            if (this.$route.meta.module === 2) {
                return;
            }
            let origin = window.location.origin
            console.log(JSON.parse(sessionStorage.getItem('user_login')).userId)
            window.open(origin + '/center-admin/#/loignSel?jumpUseId=' + JSON.parse(sessionStorage.getItem('user_login')).userId)
            // window.open(origin + '/#/workermanager?jumpUseId=' + JSON.parse(sessionStorage.getItem('user_login')).userId)
            // this.$router.push('/workermanager');
        }
    },
    async created() {
        // if (this.userInfo.id === void 0) {
            await this.$store.dispatch('getUserInfo');
        // }
        // console.log(this.userInfo, 'userInfo')
    }
};
</script>

<style lang="scss" scoped>
.topbar {
    padding: 0 32px 0 0;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 56px;
    background-color: #fff;
    box-shadow: 0px 5px 12px 0px rgba(13,51,128,0.07);

    .tabs-view-wrapper{
        flex: 1;
    }
    &_info {
        display: flex;
        height: 32px;
    }

    &_set {
        display:flex;
        justify-content: flex-start;
        align-items: center;
        cursor: pointer;
        span {
            font-size: 14px;
            color: #a2abb8;
        }
        p {
            display: flex;
            align-items: center;
            padding: 9px 12px;
            border-radius: 24px;
        }
        p:hover {
            background-color: #F2F4F7;
        }
    }
    &_line {
        width: 1px;
        height: 24px;
        margin-left: 24px;
        margin-right: 24px;
        border-right: 1px solid #e6eaf0;
        }
    &_img {
        cursor: pointer;
        img {
            width: 32px;
            height: 32px;
            border-radius: 50%;
        }
        p {
            width: 32px;
            height: 32px;
            text-align: center;
            line-height: 32px;
            color: #ffffff;
            background: #8ca0ae;
            border-radius: 50%;
        }
    }
    &_name {
        cursor: pointer;
        .user_name {
            margin: 0 16px 0 12px;
            font-size: 14px;
            color: #3b3b3b;
            line-height: 14px;
        }
        .login_name {
            margin: 6px 16px 0 12px;
            font-size: 12px;
            color: #a2abb8;
            line-height: 12px;
        }
    }
    &_icon {
        display: flex;
        align-items: center;
        cursor: pointer;
        font-size: 12px;
        &::before {
        color: #c4c6cc;
        }
    }
}
</style>

<style lang="scss">
.dropdown.el-dropdown-menu {
    width: 145px;
    .login_out {
        color: red;
    }
    .my_info {
        color: #a2abb8;
    }
}
</style>
