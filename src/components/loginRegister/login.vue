<template>
    <section class="login bg_pubilc">
        <div class="login_wrap">
            <div class="login_wrap--title">
                <span :class="{'isActive':current}" @click="handleActive(true)">账号登录</span>
                <span :class="{'isActive':!current}" @click="handleActive(false)">工位登录</span>
            </div>
            <div class="login_wrap--content">
                <div v-if="current" @keyup.enter="handleLogin">
                    <p v-show="errorMsg" class="login_error">
                        <icon type="icon-login_warning"></icon>
                        &nbsp;{{errorMsg}}
                    </p>
                    <el-form :model="param_login" ref="param_login">
                        <el-form-item>
                            <div class="login_icon">
                                <icon type="icon-denglu_shoujihao"></icon>
                            </div>
                            <el-input type="text" v-model="param_login.account" placeholder="手机号码或者老板号"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <div class="login_icon">
                                <icon type="icon-denglu_mima"></icon>
                            </div>
                            <el-input type="password" v-model="param_login.password" placeholder="密码"></el-input>
                        </el-form-item>
                        <el-button class="submitBtn" type="primary" :loading="login_isLoading" @click="handleLogin">
                            登录
                        </el-button>
                    </el-form>
                    <p class="login_router">
                        <span>没有账号？
                            <router-link to="/register">立即注册</router-link>
                        </span>
                        <span>
                            <router-link to="resetPassword">忘记密码？</router-link>
                        </span>
                    </p>
                </div>
                <div v-show="!current" @keyup.enter="handleWokerLogin">
                    <p v-if="errorMsg_worker" class="login_error">
                        <icon type="icon-login_warning"></icon>
                        &nbsp;{{errorMsg_worker}}
                    </p>
                    <el-form :model="param_workerLogin" ref="param_workerLogin">
                        <el-form-item>
                            <div class="login_icon">
                                <icon type="icon-denglu_yuangongzhanghao"></icon>
                            </div>
                            <el-input type="text" v-model="param_workerLogin.bossCode" placeholder="老板号"></el-input>
                            <span style="color:rgb(186, 189, 194);">&nbsp;-&nbsp;</span>
                            <el-input class="login_number" type="text" v-model="param_workerLogin.loginName" placeholder="员工编号"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <div class="login_icon">
                                <icon type="icon-denglu_mima"></icon>
                            </div>
                            <el-input type="password" v-model="param_workerLogin.password" placeholder="密码"></el-input>
                        </el-form-item>
                        <el-button class="submitBtn" type="primary" :loading="wokerLogin_isLoading" @click="handleWokerLogin">
                            登录
                        </el-button>
                    </el-form>
                </div>
            </div>
        </div>
    </section>

</template>

<script>
import config from "@/config";
import md5 from "js-md5";
import navListData from '@/components/Common/business/nav/data/navHome.js'
import { doLogin, workbayLogin, getFacInfo } from "@/api/api";
export default {
    data() {
        return {
            current: true, // 切换登录
            param_login: {
                account: "",
                password: ""
            },
            param_workerLogin: {
                bossCode: "", //老板号
                loginName: "", // 编号
                password: ""
            },
            errorMsg: "", // login 错误信息
            errorMsg_worker: "", // 员工登录  错误信息
            wokerLogin_isLoading: false,
            login_isLoading: false,
            leftMenuFirstUrl:'/workorders',
            navListData:navListData

        };
    },
    methods: {
        // 切换登录
        handleActive(param) {
            this.current = param;
        },
        // 老板登录
        async handleLogin() {
            this.errorMsg = "";
            // validate
            if (!this.param_login.account) {
                this.errorMsg = "请输入账号！";
                return;
            }
            if (!this.param_login.password) {
                this.errorMsg = "请输入密码！";
                return;
            }
            // login
            this.login_isLoading = true;
            let param = {
                loginName: this.param_login.account,
                password: md5(this.param_login.password),
                appId: config.appId.appId
            };
            try {
                let { data } = await doLogin(param);
                this.login_isLoading = false;
                if (data.code === 0) {
                    await this.$store.commit("setLoginData", data);
                    await sessionStorage.setItem("user_login", JSON.stringify(data));

                    //没有设置roleSignId的话就设置
                    if(!this.getCookie("roleSignId")){
                        document.cookie = 'roleSignId' + "="+this.$store.state.LoginTimes ;
                    }else {
                        var cookie = parseInt(this.getCookie("roleSignId"))+100
                        this.$store.commit('setLoginTimes',cookie)
                        document.cookie = 'roleSignId' + "="+ cookie;
                    }

                    // await sessionStorage.setItem("roleSignId", data.signId);
                    console.log(sessionStorage.getItem('roleSignId'));
                    await this.AjaxGetFacInfo(
                        data.userId,
                        data.unitId
                    );                     
                    // 未创建工厂跳转到创建工厂
                    if (!data.unitId) {
                        await this.$router.replace({
                            path: "/createdFac"
                        });
                        return;
                    }
                    await this.setLeftMenuFirstUrl();
                    await this.$router.replace({
                        // path:this.$route.query.redirect?decodeURIComponent(this.$route.query.redirect):this.leftMenuFirstUrl
                        path:this.leftMenuFirstUrl
                    });
                } else {
                    this.errorMsg = data.msg;
                }
            } catch (error) {
                console.log(error);
            }
        },
        // 员工登录
        async handleWokerLogin() {
            this.errorMsg_worker = "";
            // validate
            if (!this.param_workerLogin.bossCode) {
                this.errorMsg_worker = "请输入老板号！";
                return;
            }
            if (!this.param_workerLogin.loginName) {
                this.errorMsg_worker = "请输入员工号！";
                return;
            }
            if (!this.param_workerLogin.password) {
                this.errorMsg_worker = "请输入密码！";
                return;
            }
            this.wokerLogin_isLoading = true;
            const param = {
                bossCode: this.param_workerLogin.bossCode,
                loginName: this.param_workerLogin.loginName,
                password: md5(this.param_workerLogin.password),
                appId: config.appId.appId
            };
            try {
                const { data } = await workbayLogin(param);
                this.wokerLogin_isLoading = false;
                console.log(data);
                if (data.code === 0) {
                    data.unitId = data.to;
                    data.role = 0;                    
                    await this.AjaxGetFacInfo(data.userId, data.to);
                    await sessionStorage.setItem("user_login", JSON.stringify(data));


                    //没有设置roleSignId的话就设置
                    if(!this.getCookie("roleSignId")){
                        document.cookie = 'roleSignId' + "="+this.$store.state.LoginTimes ;
                    }else {
                        var cookie = parseInt(this.getCookie("roleSignId"))+100
                        this.$store.commit('setLoginTimes',cookie)
                        document.cookie = 'roleSignId' + "="+ cookie;
                    }

                    await this.$store.commit("setLoginData", data);
                    await this.setLeftMenuFirstUrl();
                    await this.$router.replace({
                      path:this.$route.query.redirect?decodeURIComponent(this.$route.query.redirect):this.leftMenuFirstUrl
                    });
                } else {
                    this.errorMsg_worker = data.msg;
                }
            } catch (err) {
                console.log(err);
            }
        },

        // 匹配cookie值
        getCookie(name) { //获取指定名称的cookie值
// (^| )name=([^;]*)(;|$),match[0]为与整个正则表达式匹配的字符串，match[i]为正则表达式捕获数组相匹配的数组；
            var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
            if(arr != null) {
                console.log(arr);
                return unescape(arr[2]);
            }
            return null;
        },

        // 获取工厂信息
        async AjaxGetFacInfo(userId, unitId) {
            let param = {
                facId: unitId,
                userId: userId
            };
            try {
                const { data } = await getFacInfo(param);
                sessionStorage.setItem("last_login", JSON.stringify(data));
            } catch (err) {
                console.log(err);
            }
        },
        setLeftMenuFirstUrl(){
            // 控制显示第一个有权限的菜单
            let firstMenus = JSON.parse(sessionStorage.getItem('user_login')).firstMenus;
            console.log(firstMenus);
            if(firstMenus){
                for(let i=0;i<this.navListData.length;i++){
                    if(firstMenus.indexOf(this.navListData[i].name)!==-1){
                        this.leftMenuFirstUrl= this.navListData[i].path?this.navListData[1].path:this.navListData[i].child[0].path;
                        // this.leftMenuFirstUrl=this.navListData[i].path;
                        sessionStorage.setItem("leftMenuFirstUrl", this.leftMenuFirstUrl);
                        break;
                    }
                }
            }
        }
    }
};
</script>

<style lang="scss" scoped>
.login {
    &_wrap {
        width: 416px;
        background: #fff;
        border-radius: 2px;
        background-color: #ffffff;
        box-shadow: 0 3px 12px 0 rgba(0, 0, 0, 0.12);
        &--title {
            height: 64px;
            display: flex;
            justify-content: center;
            align-items: center;
            border-bottom: 1px solid #e6e8eb;
            cursor: pointer;
            span {
                box-sizing: border-box;
                line-height: 62px;
                width: 120px;
                text-align: center;
                font-size: 18px;
                color: #b3bbc7;
            }
            .isActive {
                color: #2c2c2c;
                border-bottom: 4px solid #ff9c38;
                margin-top: 4px;
            }
        }
        &--content {
            position: relative;
            min-height: 280px;
            box-sizing: border-box;
            padding: 48px 48px 0 48px;
            .login_icon {
                display: inline-block;
                width: 45px;
                height: 43px;
                text-align: center;
                line-height: 43px;
                border: solid 1px #e4e6eb;
                border-right: 0;
                border-radius: 2px 0 0 2px;
                background-color: #fcfcfc;
            }
            .login_router {
                display: flex;
                justify-content: space-between;
                a {
                    color: #1ca1ff;
                }
            }
            .login_error {
                position: absolute;
                top: 24px;
                color: #ff4d4d;
            }
        }
    }
    .submitBtn {
        margin-bottom: 16px;
        width: 100%;
        height: 45px;
        border-radius: 2px;
    }
}
</style>
<style lang="scss">
.login_wrap--content {
    .el-form-item {
        margin-bottom: 16px;
    }
    .el-form-item__content {
        display: flex;
        line-height: 45px;
    }
    .el-input {
        flex: 1;
    }
    .el-input__inner {
        height: 45px;
        border-radius: 0 2px 2px 0;
        border: solid 1px #e4e6eb;
        box-shadow: inset 1px 1px 3px 0 rgba(0, 0, 0, 0.1);
    }
}
</style>
