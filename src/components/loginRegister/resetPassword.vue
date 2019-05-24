<template>
    <section class="resetPw bg_pubilc">

        <div class="resetPw_wrap">
            <div class="resetPw_wrap--title">
                重置密码
            </div>
            <div class="resetPw_wrap--content">
                <p v-show="errorMsg" class="login_error">
                    <icon type="icon-login_warning"></icon>
                    &nbsp;{{errorMsg}}
                </p>
                <el-form :model="param_resetPw" ref="param_resetPw">
                    <!-- SHOUJIHAO -->
                    <el-form-item>
                        <div class="resetPw_icon">
                            <icon type="icon-denglu_shoujihao"></icon>
                        </div>
                        <el-input maxlength="11" type="text" v-model="param_resetPw.phone" placeholder="手机号码"></el-input>
                    </el-form-item>
                    <!-- YANZHENGMA -->
                    <el-form-item>
                        <div class="resetPw_icon">
                            <icon type="icon-denglu_yanzhengma"></icon>
                        </div>
                        <el-input type="text" v-model="param_resetPw.code" placeholder="验证码"></el-input>
                        <el-button :disabled="isDisabled" class="sendCode" @click="handleSendCode">{{sendCodeBtn}}</el-button>
                    </el-form-item>
                    <!-- MIMA -->
                    <el-form-item>
                        <div class="resetPw_icon">
                            <icon type="icon-denglu_mima"></icon>
                        </div>
                        <el-input type="password" v-model="param_resetPw.password" placeholder="密码(6-20位字母、数字、特殊符号)"></el-input>
                    </el-form-item>
                    <!-- QUERENMIMA -->
                    <el-form-item>
                        <div class="resetPw_icon">
                            <icon type="icon-denglu_mima"></icon>
                        </div>
                        <el-input type="password" v-model="param_resetPw.password1" placeholder="确认密码"></el-input>
                    </el-form-item>
                    <el-button class="submitBtn" type="primary" :loading="resetPw_isLoading" @click="handleSubmit">
                        确认修改
                    </el-button>
                </el-form>
                <p class="resetPw_router">已有账号？
                    <router-link to="/login">马上登录</router-link>
                </p>
            </div>

        </div>

    </section>

</template>

<script>
import {sendMsg,resetPsw} from '@/api/api';
import md5 from "js-md5";
export default {
    data() {
        return {
            param_resetPw: {
                phone: "",
                code: "",
                password: "",
                password1: ""
            },
            resetPw_isLoading: false,
            sendCodeBtn: "发送验证码",
            isDisabled: false,
            errorMsg: ''
        };
    },
    methods: {
        // submit
        async handleSubmit() {
            this.errorMsg = '';
            if (!this.param_resetPw.phone) {
                this.errorMsg = '请填写手机号';
                return
            }
            if (!/^[1][3,4,5,6,7,8][0-9]{9}$/.test(this.param_resetPw.phone)) {
                this.errorMsg = '手机号格式不正确';
                return
            }
            if (!this.param_resetPw.code) {
                this.errorMsg = '请填写验证码';
                return
            }
            if (!this.param_resetPw.password || !this.param_resetPw.password1) {
                this.errorMsg = '请填写密码';
                return
            }
            if (!/^[0-9A-Za-z]{6,20}$/.test(this.param_resetPw.password)) {
                this.errorMsg = '密码为6到20位数字或字母组成';
                return
            }
            if (this.param_resetPw.password !== this.param_resetPw.password1) {
                this.errorMsg = '两次密码不一样';
                return
            }
            this.resetPw_isLoading = true;
            let param = {
                phone: this.param_resetPw.phone,
                psw: md5(this.param_resetPw.password),
                captcha: this.param_resetPw.code
            }
            try {
                const {data} = await resetPsw(param);
                this.resetPw_isLoading = false;
                if (data.code === 0) {
                    await this.$message.success('修改成功');
                    await this.$router.push({
                        path: "/login"
                    });
                } else {
                    await (this.errorMsg = data.msg);
                    await this.$message.error(data.msg);
                }
            }catch(err) {
                console.log(err);
            }
        },
        // 发送验证码
        async handleSendCode() {
            this.errorMsg = '';
            if (!this.param_resetPw.phone) {
                this.errorMsg = '请填写手机号';
                return
            }
            if (!/^[1][3,4,5,6,7,8][0-9]{9}$/.test(this.param_resetPw.phone)) {
                this.errorMsg = '手机号格式不正确';
                return
            }
            try {
                const {data} = await sendMsg({phone: this.param_resetPw.phone});
                if(data.resp.respCode == '000000') {
                    this.sendCode();
                    this.$message.success('发送成功');
                } else {
                    this.$message.error('发送失败');
                }
            }catch(err) {
                console.log(err);
            }
        },
        sendCode() {
            let s = 60;
            this.isDisabled = true;
            this.sendCodeBtn = `已发送${s}`;
            let timer = setInterval(()=>{
                s--;
                this.sendCodeBtn = `已发送${s}`;
                if (s===-1) {
                    clearInterval(timer);
                    this.sendCodeBtn = '发送验证码';
                    this.isDisabled = false;
                }
            }, 1000);
        }
    }
};
</script>

<style lang="scss" scoped>
.resetPw {
    &_wrap {
        width: 416px;
        height: 466px;
        border-radius: 2px;
        background-color: #ffffff;
        box-shadow: 0 3px 12px 0 rgba(0, 0, 0, 0.12);
        &--title {
            height: 64px;
            text-align: center;
            line-height: 64px;
            border-bottom: 1px solid #e6e8eb;
            font-size: 18px;
        }
        &--content {
            position: relative;
            padding: 48px 48px 0;
            .resetPw_icon {
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
            .resetPw_router {
                text-align: center;
                a {
                    color: #1ca1ff;
                }
            }
            .resetPw_error {
                position: absolute;
                top: 24px;
                color: #ff4d4d;
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
    .sendCode {
        margin-left: 10px;
        padding: 0;
        width: 92px;
        height: 45px;
        border-radius: 2px;
        border: solid 1px #e4e6eb;
    }
}
</style>
<style lang="scss">
.resetPw_wrap--content {
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
