<template>
    <section class="register bg_pubilc">

        <div class="register_wrap">
            <div class="register_wrap--title">
                老板注册
            </div>
            <div class="register_wrap--content">
                <p v-show="errorMsg" class="register_error">
                    <icon type="icon-login_warning"></icon>
                    &nbsp;{{errorMsg}}
                </p>
                <el-form :model="param_register" ref="param_register">
                    <!-- SHOUJIHAO -->
                    <el-form-item>
                        <div class="register_icon">
                            <icon type="icon-denglu_shoujihao"></icon>
                        </div>
                        <el-input type="text" v-model="param_register.phone" placeholder="手机号码"></el-input>
                    </el-form-item>
                    <!-- YANZHENGMA -->
                    <el-form-item>
                        <div class="register_icon">
                            <icon type="icon-denglu_yanzhengma"></icon>
                        </div>
                        <el-input type="text" v-model="param_register.code" placeholder="验证码"></el-input>
                        <el-button :disabled="isDisabled" class="sendCode" @click="handleSendCode">{{sendCodeBtn}}</el-button>
                    </el-form-item>
                    <!-- LAOBANHAO -->
                    <el-form-item>
                        <div class="register_icon">
                            <icon type="icon-denglu_laobanhao"></icon>
                        </div>
                        <el-input type="text" v-model="param_register.bossCoun" @blur="AjaxCheckLoginName" placeholder="老板号(2-12位字母与数字)"></el-input>
                    </el-form-item>
                    <!-- LAOBANXINGMING -->
                    <el-form-item>
                        <div class="register_icon">
                            <icon type="icon-denglu_laobanhao"></icon>
                        </div>
                        <el-input type="text" v-model="param_register.bossName" placeholder="老板姓名"></el-input>
                    </el-form-item>
                    <!-- MIMA -->
                    <el-form-item>
                        <div class="register_icon">
                            <icon type="icon-denglu_mima"></icon>
                        </div>
                        <el-input type="password" v-model="param_register.password" placeholder="密码(6-20位字母、数字、特殊符号)"></el-input>
                    </el-form-item>
                    <!-- QUERENMIMA -->
                    <el-form-item>
                        <div class="register_icon">
                            <icon type="icon-denglu_mima"></icon>
                        </div>
                        <el-input type="password" v-model="param_register.password1" placeholder="确认密码"></el-input>
                    </el-form-item>
                    <el-button class="submitBtn" type="primary" :loading="register_isLoading" @click="handleSubmit">
                        注册账号
                    </el-button>
                </el-form>
                <p class="register_router">已有账号？<router-link to="/login">马上登录</router-link></p>
            </div>

        </div>

    </section>

</template>

<script>
import config from "@/config";
import {sendMsg,doRegister,checkPhoneCaptcha,checkPhone,checkLoginName} from '@/api/api';
import md5 from 'js-md5'
export default {
    data() {
        return {
            param_register: {
                phone: "",
                code: "",
                bossCoun: '',
                bossName: '',
                password: '',
                password1: ''
            },
            errorMsg: '',
            register_isLoading: false,
            sendCodeBtn: "发送验证码",
            isDisabled: false
        };
    },
    methods: {
        async handleSubmit() {
            this.register_isLoading = true;
            let isOK = await this.handleValidate();
            if(!isOK) {
                this.register_isLoading = false;
                return
            }
            let param = {
                phone: this.param_register.phone,
                password: md5(this.param_register.password),
                appId: config.appId.appId,
                loginName: this.param_register.bossCoun,
                userName: this.param_register.bossName
            }
            try {
                const {data} = await doRegister(param);
                this.register_isLoading = false;
                await this.$message.success('注册成功')
                if (data.code === 0) {
                    this.$router.push('/login')
                } else {
                    this.$message.error(data.msg);
                    this.errorMsg = data.msg;
                }
            } catch (error) {
                console.log(error)
            }
        },
        // 发送验证码
        async handleSendCode() {
            this.errorMsg = '';
            if (!this.param_register.phone) {
                this.errorMsg = '请填写手机号';
                return
            }
            if (!/^[1][3,4,5,6,7,8][0-9]{9}$/.test(this.param_register.phone)) {
                this.errorMsg = '手机号格式不正确';
                return
            }
            let str = await this.AjaxCheckPhone(this.param_register.phone);
            if (str) {
                this.errorMsg = str;
                return
            }
            try {
                const {data} = await sendMsg({phone: this.param_register.phone});
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
        },
        // 检查手机号
        async AjaxCheckPhone(phone) {
            let str = '';
            try {
                const {data} = await checkPhone({phone: phone})
                if(data.code===0){
                    await (str = data.msg)
                } else {
                    await (str = '')
                }
            }catch(err) {
                console.log(err)
            }
            return str
        },
        // 检查用户名
        async AjaxCheckLoginName() {
            this.errorMsg = '';
            if (!this.param_register.bossCoun) {
                this.errorMsg = '请输入老板号';
                return false
            }
            try {
                const {data} = await checkLoginName({loginName: this.param_register.bossCoun});
                if(data.code === 0) {
                    this.errorMsg = data.msg;
                    return data.msg
                }
                return ''
            }catch(err) {
                console.log(err);
            }
        },
        // 表单数据校验
        async handleValidate() {
            this.errorMsg = '';
            if (!this.param_register.phone) {
                this.errorMsg = '请填写手机号';
                return false
            }
            if (!/^[1][3,4,5,6,7,8][0-9]{9}$/.test(this.param_register.phone)) {
                this.errorMsg = '手机号格式不正确';
                return false
            }
            if (!this.param_register.code) {
                this.errorMsg = '请填写手机验证码';
                return false
            }
            let str = await this.AjaxCheckLoginName();
            if (str) {
                this.errorMsg = str;
                return false
            }
            if (!this.param_register.bossName) {
                this.errorMsg = '请填写老板姓名';
                return false
            }
            if (!this.param_register.password) {
                this.errorMsg = '请填写密码';
                return false
            }
            if (!/^[0-9A-Za-z]{6,20}$/.test(this.param_register.password)) {
                this.errorMsg = '密码为6到20位数字或字母组成';
                return false
            }
            if (this.param_register.password !== this.param_register.password1) {
                this.errorMsg = '两次密码不一样，请检查';
                return false
            }
            return true
        }
    }
};
</script>

<style lang="scss" scoped>
.register {
    &_wrap {
        width: 416px;
        height: 623px;
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
            .register_icon {
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
            .register_router {
                text-align: center;
                a {
                    color: #1ca1ff;
                }
            }
            .register_error {
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
.register_wrap--content {
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
