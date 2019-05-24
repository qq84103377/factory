<template>
    <div>
        <el-dialog custom-class="find-pwd-dialog" :visible.sync="updataPwdVisible">


            <div class="find-pwd">
                <header>重置密码</header>
                <section class="content">
                    <!--<div class="tip" v-show="findPwd.isError">-->
                    <!--<icon type="icon-gongdan-jiedianjingbao-da"></icon>&nbsp;&nbsp;{{findPwd.msg}}-->
                    <!--</div>-->
                    <!--<div class="phone">-->
                    <!--<i class="icon1">-->
                    <!--<icon type="icon-denglu_shoujihao"></icon>-->
                    <!--</i>-->
                    <!--<input type="text" v-model="findPwd.phone" placeholder="手机号码">-->
                    <!--</div>-->


                    <div class="phone">
                        <i class="icon1">
                            <icon type="icon-denglu_yanzhengma"></icon>
                        </i>
                        <input type="text" v-model="findPwd.captcha" placeholder="验证码" style="width: 220px;">
                        <span class="send" :class="{'isSend':isSend}"
                              @click="findPwdGetCode()">{{findPwd.codeWord}}</span>

                    </div>

                    <div class="phone">
                        <i class="icon1">
                            <icon type="icon-denglu_mima" style="border: none;"></icon>
                        </i>
                        <input type="password" v-model="findPwd.pwd" placeholder="密码(6-20位字母.数字.特殊符号)">
                    </div>

                    <div class="phone">
                        <i class="icon1">
                            <icon type="icon-denglu_mima" style="border: none;"></icon>
                        </i>
                        <input type="password" v-model="findPwd.pwd1" placeholder="确认密码">
                    </div>


                    <div class="btn" >
                        <nf-button type="warning" size="block" @click="enter()">确认修改</nf-button>
                        <!-- <i class="el-icon-loading" v-if="isLoading"></i> 确认修改 -->
                    </div>

                </section>
            </div>
        </el-dialog>
    </div>
</template>


<script type="text/ecmascript-6">

    import Vue from 'vue'
    import VueRouter from 'vue-router'
    import store from '../../vuex/store'
    import md5 from 'js-md5'

    Vue.use(VueRouter)
    import {sendMsg, resetPsw, checkPhoneCaptcha} from '../../api/api'

    export default {
        data() {
            return {
                findPwd: {
                    captcha: '',//验证码
                    codeWord: '验证码',//倒计时
                    pwd: '',//密码1
                    pwd1: '',//密码2


                },
                phone: '',
                code: '',
                pwd: '',
                updataPwdVisible: true,
                captcha: '',
                isGood: true,
                isSend: false,
                codeWord: '验证码',
                time: 60,
                isLoading:false,
            }
        },
        methods: {

            enter() {
                var _this = this
                if (_this.findPwd.captcha == '' || _this.findPwd.pwd == '') {
                    return this.$message({
                        showClose: true,
                        message: '请检查您输入的信息',
                        type: "error",
                        duration: _this.$globalConfig.elementUI.duration
                    });
                }else if(_this.findPwd.pwd.length<4||_this.findPwd.pwd.length>12){
                    return this.$message({
                        showClose: true,
                        message: '密码长度不正确',
                        type: "error",
                        duration: _this.$globalConfig.elementUI.duration
                    });
                }else if (_this.findPwd.pwd != _this.findPwd.pwd1) {
                    return this.$message({
                        showClose: true,
                        message: '密码不一致',
                        type: "error",
                        duration: _this.$globalConfig.elementUI.duration
                    });
                }
                let resetPswparams = {
                    phone: JSON.parse(sessionStorage.getItem('user_info')).phone,
                    psw: md5(_this.findPwd.pwd),
                    captcha: _this.findPwd.captcha
                }
                resetPsw(resetPswparams).then(function (res) {
                    if (res.data.code == 0) {
                        _this.$message({
                            showClose: true,
                            message: res.data.msg,
                            type: "success",
                            duration: _this.$globalConfig.elementUI.duration
                        });
                        _this.$router.push({
                            path: '/index'
                        })
                        return
                    } else {
                        _this.$message({
                            showClose: true,
                            message: res.data.msg,
                            type: "error",
                            duration: _this.$globalConfig.elementUI.duration
                        });
                    }

                })
//

            },
            findPwdGetCode() {
                let _this = this;
                if (_this.isSend) {
                        return _this.$message({
                            showClose: true,
                            message: '60秒内不能重复发送验证码',
                            type: "error",
                            duration: _this.$globalConfig.elementUI.duration
                        });
                }
                let params = {'phone': JSON.parse(sessionStorage.getItem('user_info')).phone}
                sendMsg(params).then(function (res) {
                    if (res.data.code == 1) {
                        return _this.$message({
                            showClose: true,
                            message: res.data.msg,
                            type: "error",
                            duration: _this.$globalConfig.elementUI.duration
                        });
                    }
                    _this.$message({
                        showClose: true,
                        message: '已发送',
                        type: "success",
                        duration: _this.$globalConfig.elementUI.duration
                    });
                    _this.captcha = res.data.captcha;
                    let timer = setInterval(() => {
                        if (_this.time <= 0) {
                            _this.isSend = false;
                            _this.time = 60;
                            _this.findPwd.codeWord = '验证码';
                            _this.isGood = true;
                            clearInterval(timer);
                        } else {
                            _this.isSend = true;
                            _this.isGood = false;
                            _this.time--
                            _this.findPwd.codeWord = _this.time + '秒后重试'
                        }

                    }, 1000)
                })

            },
//            checkPhone1() {
//                var reg = /^1(3|4|5|8)[0-9]{9}$/
//                if (reg.test(this.phone)) {
//                    this.isGood = false
//                } else {
//                    this.isGood = true
//                    return this.$message({
//                        showClose: true,
//                        message: '请检查手机号',
//                        type: "error",
//                        duration: this.$globalConfig.elementUI.duration
//                    });
//                }
//            }
        }
    }

</script>

<style lang="scss">
    @import '~scss_vars';

    .updatePwd .min360 {
        width: 360px;
        height: 410px;
        border-radius: 12px;
        .el-dialog__header {
            height: 65px;
            border-radius: 12px 12px 0 0;
            background-color: #262f3b;
            padding: 0;
            .el-dialog__title {
                width: 80px;
                height: 26px;
                padding-left: 59px;
                padding-top: 19px;
                display: inline-block;
                font-size: 20px;
                color: #fff;
                text-align: center;
            }
            .el-dialog__headerbtn {
                padding: 8px;
                box-sizing: border-box;
            }
        }
        .el-dialog__body {
            padding: 0;
            .user-info {
                margin-top: 38px;
                padding-left: 60px;
                padding-right: 60px;
                padding-top: 4px;
                & > div {
                    padding-top: 10px;
                    padding-bottom: 8px;
                    input {
                        width: 100%;
                        border: none;
                        outline: none;
                        &::-webkit-input-placeholder { /* WebKit browsers */
                            font-size: 14px;
                        }
                    }
                    border-bottom: 1px solid #b2b2b2;
                    margin-top: 26px;
                }
                .code {
                    .good {
                        background-color: #ccc;
                    }
                }
                & div:nth-of-type(1) {
                    margin-top: 32px;
                    position: relative;
                    input {
                        width: 150px;
                    }
                    button {
                        width: 94px;
                        height: 30px;
                        border-radius: 15px;
                        background-color: $color-btn;
                        position: absolute;
                        right: 0;
                        top: 2px;
                        border: none;
                        outline: none;
                        color: #fff;
                    }
                }
            }
            .reg-btn {
                width: 240px;
                height: 46px;
                border-radius: 100px;
                background-color: $color-btn;
                border: none;
                outline: none;
                margin-top: 30px;
                font-size: 14px;
                color: #fff;
            }
            .good {
                background-color: #ccc;
            }

        }

    }

    /*找回密码*/

    .find-pwd-dialog {
        width: 0;
        margin-top: 15%;
        .find-pwd {
            box-shadow: 0 3px 12px 0 rgba(0, 0, 0, 0.12);
            padding-bottom: 48px;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            width: 416px;
            background-color: #fff;
            border-radius: 2px;
            header {
                line-height: 64px;
                border-bottom: 1px solid #e6e8eb;
                text-align: center;
                font-size: 18px;
                color: #2c2c2c;
            }
            .content {
                margin-top: 48px;
                padding: 0 48px;
                position: relative;
                .tip {
                    position: absolute;
                    left: 62px;
                    top: -28px;
                    font-size: 14px;
                    color: #ff4d4d;
                }
                input {
                    box-sizing: border-box;
                    width: 320px;
                    height: 45px;
                    padding-left: 50px;
                    margin-bottom: 16px;
                    border-radius: 2px;
                    background-color: #ffffff;
                    box-shadow: inset 1px 1px 3px 0 rgba(0, 0, 0, 0.1);
                    border: solid 1px #e4e6eb;
                }
                .phone {
                    position: relative;
                    .icon1 {
                        box-shadow: 1px 0px 3px 0 rgba(0, 0, 0, 0.05);
                        background-color: #fcfcfc;
                        width: 45px;
                        height: 43px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        border-radius: 1px 0px 0px 1px;
                        border-right: 1px solid #e4e6eb;
                        position: absolute;
                        left: 1px;
                        top: 1px;
                    }
                    .send {
                        position: relative;
                        box-shadow: 1px 0px 3px 0 rgba(0, 0, 0, 0.05);
                        box-sizing: border-box;
                        line-height: 45px;
                        text-align: center;
                        display: inline-block;
                        margin-left: 2px;
                        position: relative;
                        top: 1px;
                        width: 93px;
                        height: 45px;
                        border-radius: 2px;
                        background-color: #ffffff;
                        border: solid 1px #e4e6eb;
                        cursor: pointer;
                        font-size: 14px;
                        color: #2c2c2c;
                    }
                }
                .captcha {
                    position: relative;
                    .yanzhengma {
                        box-shadow: 1px 0px 3px 0 rgba(0, 0, 0, 0.05);
                        background-color: #fcfcfc;
                        width: 45px;
                        height: 43px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        border-radius: 1px 0px 0px 1px;
                        border-right: 1px solid #e4e6eb;
                        position: absolute;
                        left: 1px;
                        top: 1px;
                    }

                    input {
                        display: inline-block;
                    }

                    .send {
                        position: relative;
                        box-shadow: 1px 0px 3px 0 rgba(0, 0, 0, 0.05);
                        box-sizing: border-box;
                        line-height: 45px;
                        text-align: center;
                        display: inline-block;
                        margin-left: 2px;
                        position: relative;
                        top: 1px;
                        width: 93px;
                        height: 45px;
                        border-radius: 2px;
                        background-color: #ffffff;
                        border: solid 1px #e4e6eb;
                        cursor: pointer;
                        font-size: 14px;
                        color: #2c2c2c;
                    }
                }
            }
            .btn {
                margin-top: 16px;
                text-align: center;
                // width: 320px;
                // height: 45px;
                // line-height: 45px;
                // text-align: center;
                // font-size: 16px;
                // color: #ffffff;
                // border-radius: 2px;
                // background-color: $color-btn;
            }
            .go-login {
                margin-top: 16px;
                width: 320px;
                text-align: center;
                font-size: 12px;
                color: #2c2c2c;
            }
        }
    }

</style>