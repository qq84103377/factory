<template>
<div class="baseInfo">
        <div class="title">
            <div style="font-size:24px;">我的资料</div>
            <div>
                   <nf-button  v-if="!isEdit" @click="sava(false)">取消</nf-button>
                   <nf-button style="margin-left:14px;" type="warning"  v-if="!isEdit" @click="sava(true)">完成</nf-button>
            </div>
        </div>
        <div class="myinfo">
        <header class="headers">
        <div> 
            <div class="line"></div>
            <p>账号资料</p>
        </div>
        <nf-button type="warning" :plain="true" style="margin-left:16px;" v-if="isEdit" @click="isEdit =false;">修改资料</nf-button>                 
        </header>
        <div class="myifo_container">
            <div class="name"><span class="six_three">姓名：</span><span>{{oldUserName}}</span><span v-if="!isEdit" class="changeAll" @click="newKind">点击修改</span></div>
            <div class="num" v-if="type==1"  >
                <span class="six_three">老板号：</span><span>{{user_info.loginName}}</span>    
            </div>
            <div class="num" v-if="type===0" >
                <span class="six_three">工位号：</span><span>{{user_info.loginName}}</span>                
            </div>
            <div  v-if="type===1" class="phone"><span class="six_three">手机号：</span><span>{{user_info.phone}}</span></div>
            <div  v-if="type===0" class="phone"><span class="six_three">密码：</span>******<span  v-if="!isEdit" class="changeAll" @click="changePwds"> 修改密码</span></div>            
        </div>
        <div class="pwd" v-if="type===1">
            <div class="password"><span class="six_three">密码：</span><span>********</span><span  v-if="!isEdit" class="changeAll" @click="changePwds"> 修改密码</span></div>            
        </div>
        <div class="photo">
            <div class="six_three">头像：<span style="margin-left:8px;" class="changeAll" v-if="!isEdit" @click="changeLogo()">点击修改</span></div>
        </div>
        <div class="img_show">
            <div v-if="!logos" class="name">{{userName | filterName}}</div>    
            <img :src="logos" v-if="logos">        
        </div>
                <updatedpwd v-if="this.changepwd&&this.boss"></updatedpwd>
        <div class="" v-if="this.changepwd&&this.boss==false">
            <el-dialog
                    custom-class="dialog1"
                    title=""
                    top="45%"
                    :visible.sync="dialogIsVisible"
                    size="800px">
                <div class="updatePwd">
                    <div class="find-pwd">
                        <header>重置密码</header>
                        <section class="content">
                            <div class="phone">
                                <i class="icon1">
                                    <icon type="icon-denglu_mima" style="border: none;"></icon>
                                </i>
                                <input type="password" v-model="findPwd.pwd" placeholder="旧密码">
                            </div>

                            <div class="phone">
                                <i class="icon1">
                                    <icon type="icon-denglu_mima" style="border: none;"></icon>
                                </i>
                                <input type="password" v-model="findPwd.pwd1" placeholder="新密码(4-12位字母.数字.特殊符号)">
                            </div>

                            <div class="phone">
                                <i class="icon1">
                                    <icon type="icon-denglu_mima" style="border: none;"></icon>
                                </i>
                                <input type="password" v-model="findPwd.pwd2" placeholder="确认密码">
                            </div>
                            <div class="btn">
                                <nf-button type="warning" size="block"  @click="ToReset()">确认修改</nf-button>
                                <!-- <i class="el-icon-loading" v-if="isLoading"></i> 确认修改 -->
                            </div>

                        </section>
                    </div>
                </div>
            </el-dialog>
        </div>                       
        <uploadpic v-if="isUpload" :img="logos" @getImg="handleGetImgUrl"></uploadpic>
            <div class="names">
                <el-dialog :visible.sync="dialogKind" width="30%">
                    <h3 style="display:flex;justify-content:center;" class="color-title">请输入姓名</h3>
                    <div style="display:flex;justify-content:center;margin-top:12px;" class="color-set">
                        <div class="nf-input">
                            <el-input type="text" placeholder="请输入想要新姓名" v-model.trim="changeName"></el-input>
                        </div>
                    </div>
                    <span slot="footer" style="display:flex;justify-content:center;">
                        <nf-button style="margin-right:12px;" @click="dialogKind = false">取消</nf-button>
                        <nf-button @click="changeNameClick" type="warning">确定</nf-button>
                    </span>
                </el-dialog>
        </div>
    </div>
</div>
</template>
<script>
import Vue from "vue";
import VueRouter from "vue-router";
import uploadpic from "../Common/UpdatePic.vue";
import store from "../../vuex/store";
import updatedpwd from "./UpdatePwd";
import { updateMyInfo, getMyInfo, resetWorkbayPsw } from "../../api/api";
import md5 from "js-md5";

export default {
  data() {
    return {
      display: true,
      dialogIsVisible: "",
      findPwd: {},
      boss: JSON.parse(sessionStorage.getItem("user_login"))
        ? JSON.parse(sessionStorage.getItem("user_login")).role == 1
        : "",
      workerResetPwd: sessionStorage.getItem("worker_info") != "undefined", //工位找回密码
      isEdit: true,
      disabled: true, //默认是禁用的
      newUserName: "",
      oldUserName: "获取中...",
      bossCode: "获取中...",
      workerCode: "获取中...",
      resultURL: this.res,
      user_login: {},
      user_info: {},
      isUpload: false,
      logos: "",
      userName: "",
      changepwd: false,
      isLoading: false,
      dialogKind:false,
      type:'',
      changeName:'',
      userId: ''
    };
  },
  components: {
    uploadpic,
    updatedpwd
  },
  filters: {
    filterName(val) {
      if (val && val.length > 2) {
        return val.substr(-2);
      }
      return val;
    }
  },
  methods: {
    newKind() {
        this.changeName = this.oldUserName;
        this.dialogKind = true;
    },
    ToReset() {
      if (this.findPwd.pwd1.length < 4 || this.findPwd.pwd1.length > 12) {
        return this.$message({
          type: "error",
          message: "密码长度不正确",
          showClose: true,
          duration: this.$globalConfig.elementUI.duration
        });
      }

      if (this.findPwd.pwd1 == this.findPwd.pwd2) {
        let userInfo = JSON.parse(sessionStorage.getItem("user_info"));

        let params = {
          bossCode: userInfo.bossCode,
          loginName: userInfo.loginName,
          oldPsw: md5(this.findPwd.pwd),
          newPsw: md5(this.findPwd.pwd1),
          userId: this.userId
        };

        resetWorkbayPsw(params).then(res => {
          if (res.data.code == 0) {
            this.$message({
              type: "success",
              message: res.data.msg,
              duration: this.$globalConfig.elementUI.duration,
              showClose: true
            });
            this.findPwd = {};
            this.changepwd = false;
            this.dialogIsVisible = false;
          } else {
            this.$message({
              type: "error",
              message: res.data.msg,
              duration: this.$globalConfig.elementUI.duration,
              showClose: true
            });
          }
          console.log(res);
        });
      } else {
        this.$message({
          type: "error",
          message: "密码不一致",
          duration: this.$globalConfig.elementUI.duration,
          showClose: true
        });
      }
    },
    handleGetImgUrl(url) {
      console.log(url,'------我的资料头像----');
      this.logos = this.$globalConfig.qiniu.baseUrl + url || "";
      this.sava(true);
      //console.log(this.logos);
    },
    changeLogo() {
        this.isUpload = !this.isUpload;
    },
    changePwds() {
        this.changepwd = !this.changepwd;
        this.dialogIsVisible = this.changepwd && this.boss != true;
    },
    edit() {
      this.disabled = !this.disabled;
      this.isEdit = !this.isEdit;
      this.newUserName = this.oldUserName;
    },
    sava(type) {
      var _this = this;
      if (type) {
        // if (this.logos == undefined || this.logos == '') {

        // } else {

        // }
        // if (logos == undefined) {
        //     logos == '';
        // }
        var logos =
          this.logos && this.logos.slice(1 + this.logos.lastIndexOf("/"));
        if (this.oldUserName.length <= 0 || this.oldUserName.length > 12) {
          return this.$message({
            type: "error",
            message: "姓名的长度为1-12位",
            showClose: true,
            duration: this.$globalConfig.elementUI.duration
          });
        }
        console.log(logos, 'logos')
        var params = {
          token: "",
          userId: _this.user_info.id,
          userName: _this.changeName||this.user_info.userName,
          headImg: ""
        };
        const oldHeadImg = JSON.parse(sessionStorage.getItem("user_info"))
          .headImg;
        if (oldHeadImg && oldHeadImg != null && !logos) {
          params.headImg = oldHeadImg;
        } else if (logos) {
          params.headImg = logos;
        } else {
          params.headImg = null;
        }
        console.log(params);
        // 
        updateMyInfo(params).then(res => {
          if (res.data.code == 0) {
            var oldSession = JSON.parse(sessionStorage.getItem("user_info"));
            oldSession.userName = _this.oldUserName;
            sessionStorage.setItem("user_info", JSON.stringify(oldSession));
            _this.getUserInfo();
            _this.goInfo();
            _this.disabled = type;
            _this.isEdit = type;
            _this.$store.commit("UPDATAPWD");
            _this.$store.dispatch("getUserInfo");
            _this.$message({
              showClose: true,
              message: "保存成功",
              type: "success",
              duration: this.$globalConfig.elementUI.duration
            });
            return;
          }
          _this.$message({
            showClose: true,
            message: "修改失败！",
            type: "error",
            duration: this.$globalConfig.elementUI.duration
          });
        });
      } else {
        this.getUserInfo();
        this.disabled = !type;
        this.isEdit = !type;
        this.$message({
          showClose: true,
          message: "已取消",
          type: "warning",
          duration: this.$globalConfig.elementUI.duration
        });
      }
    },
    getUserInfo() {
      var _this = this;
      _this.user_info =
        JSON.parse(sessionStorage.getItem("user_info")) ||
        JSON.parse(sessionStorage.getItem("worker_info"));
      _this.user_login =
        JSON.parse(sessionStorage.getItem("user_login")) ||
        JSON.parse(sessionStorage.getItem("worker_login"));
      // _this.oldUserName = _this.user_info.userName || _this.user_info.phone;
      console.log(_this.user_info,'_this.user_info.headImg')
    //   _this.user_info.headImg = _this.user_info.headImg || "";
      //console.log(_this.user_login, "开始获取到的信息");
      let params = {
        appId: this.$globalConfig.appId.appId,
        token: "",
        userId: _this.userId
      };
      //根据返回的字段查询默认工厂的具体信息
      getMyInfo(params).then(function(res) {
        console.log(res, "老板登录后的信息");
        if (res.data.code == 0) {
          //成功
          _this.user_info = res.data.data;
          console.log(res.data.data);
          _this.oldUserName = _this.user_info.userName;
          _this.type = res.data.data.type;
          _this.logos = res.data.data.headImg;
          sessionStorage.setItem("user_info", JSON.stringify(_this.user_info));
          _this.$router.push({
            path: "/my-data2"
          });
        }
      });
    },
    goInfo() {
      let params = {
        token: "",
        userId: this.userId
      };
      getMyInfo(params).then(res => {
        this.userName = res.data.data.userName;
        this.logos = res.data.data.headImg;
      });
    },
    changeNameClick() {
        if(this.changeName.length<=0||this.changeName.length>12) {
            this.$message({
            showClose: true,
            message: "姓名长度在1到12位",
            type: "warning",
            duration: this.$globalConfig.elementUI.duration
            }); 
            return;           
        }else{
            this.oldUserName = this.changeName;
            this.dialogKind = false;
        }
    }
  },
  created() {
    this.userId = this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId;
      
    this.getUserInfo();
    // this.goInfo();

  }
};
</script>

<style lang="scss" scoped>
@import "~scss_vars";
.title{
    display: flex;
    padding: 0 32px;
    height: 68px;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;
    margin-bottom: 12px;
}
.myinfo{
    height: 560px;
    background-color: #fff;
    padding: 32px;
    font-size: 14px;
    .headers{
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
        height: 34px;
        div{
            display: flex;
            justify-content: flex-start;
            align-items: center;
            .line{
                width: 6px;
                height: 20px;
                background-color: #ff9c38;
                margin-right: 10px;
                display:inline-block;
            }
            p{
                font-size:20px;
                color:#2c2c2c;
                display:inline-block;
            }
        }
    }
    .six_three{
        color: #636363;
    }
    .changeAll{
        color:#ff9c38;
        margin-left: 32px;
        cursor: pointer;
    }
    .myifo_container{
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin-bottom: 24px;
        div{
            width:33%;
            margin-left:16px;
        }
    }
    .pwd{
        display: flex;
        justify-content: flex-start;
        align-items: center;  
        margin-bottom: 32px;
        .password{
             width:33%;
             margin-left:16px;
        }      
    }
    .photo{
        margin-bottom: 16px;
        .six_three{
            margin-left:16px; 
        }
    }
    .img_show{
        margin-left:16px;
        width: 110px;
        height: 110px;
        margin-bottom: 16px;        
        background-color: rgb(140, 160, 174);
        // border-radius: 50%;        
        img{
            width: 100%;
            height: 100%;
        }
        .name{
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 100%;
            font-size: 42px;
            color: #fff;
        }
    }
        .updatePwd {
            font-size: 14px;
            .find-pwd {
                box-shadow: 0 3px 12px 0 rgba(0, 0, 0, 0.12);
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
                    // display: flex;
                    // justify-content: center;
                    font-size: 18px;
                    color: #2c2c2c;
                    text-align: center;
                }
                .content {
                    padding:48px;
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
                        // box-shadow: inset 1px 1px 3px 0 rgba(0, 0, 0, 0.1);
                        border: solid 1px #e4e6eb;
                        font-size: 14px;
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
                            width: 94px;
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
}
.names {
    .nf-input {
        display: inline-block;
        width: 260px;
    }
}
</style>

<style>
.dialog1 {
  width: 0px;
}
.myinfo .names .el-dialog--small {
    width: 30%;
}
</style>