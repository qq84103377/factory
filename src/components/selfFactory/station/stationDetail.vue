<template>
    <div class="addworker" id="station_detail">
        <section class="nf-scroll-container">
            <page-title :title="$route.query.type==2?'工位信息':$route.query.type==1?'新建工位':'编辑工位'">
                <div class="btns">
                    <nf-button @click="$route.query.type==1||$route.query.type==3?addWorker(0):$router.go(-1)">
                        {{$route.query.type==1||$route.query.type==3?'取消':'返回上级'}}
                    </nf-button>
                    <nf-button v-if="$route.query.type==1||$route.query.type==3" type="warning" @click="$route.query.type==1?addWorker(1):addWorker(2)">确认</nf-button>
                </div>
            </page-title>
            <div class="nf-scroll-view">
                <el-row class="worker-content">
                    <div style="height:140px;">
                        <content-wrap title="账号资料" type="big">
                            <div v-if="$route.query.type==2&&!stationInfo.isDisabled" slot="headRight">
                                <nf-button type="warning" :plain="true" @click="$router.push({path:'/selfFacStationDetail',query:{type:3}})">编辑</nf-button>
                                <!-- <span class="edit" @click="edit()">编辑</span> -->
                            </div>
                            <span v-if="$route.query.type==2&&stationInfo.isDisabled" class="canceled"></span>
                            <el-col v-if="$route.query.type==1||$route.query.type==3" class="item">
                                <div class="item-id">
                                    <el-col>
                                        <span class="start">*</span>
                                        工位号
                                        <div class="nf-input">
                                            <el-input v-if="$route.query.type==1" type="text" v-model="userInfo.bossCode" class="disabled"
                                                      disabled></el-input>
                                            <el-input v-else-if="$route.query.type==3" type="text" v-model="editInfo.bossCode" class="disabled"
                                                      disabled></el-input>
                                        </div>
                                        <span> - </span>
                                        <div class="nf-input">
                                            <el-input v-if="$route.query.type==1" @blur="verifyWorkId"
                                                      @focus.once="addWorkerInfo.id = ''" @input="workNum" type="text"
                                                      :maxlength="30"
                                                      v-model="addWorkerInfo.id" class="item-login"
                                                      placeholder="请输入编号"></el-input>
                                            <el-input v-else-if="$route.query.type==3" @blur="verifyWorkId"
                                                      @input="workNum" type="text"
                                                      :maxlength="30"
                                                      v-model="editInfo.no" class="item-login"
                                                      placeholder="请输入编号"></el-input>
                                        </div>
                                    </el-col>
                                </div>
                                <div class="item-name">

                                    <el-col>
                                        <span class="start">*</span>
                                        工位姓名
                                        <div class="nf-input w260">
                                            <el-input v-if="$route.query.type==1" type="text" v-model="addWorkerInfo.name" :maxlength="30"
                                                      placeholder="请输入姓名"></el-input>
                                            <el-input v-else-if="$route.query.type==3" type="text" v-model="editInfo.name" :maxlength="30"
                                                      placeholder="请输入姓名"></el-input>
                                        </div>
                                    </el-col>

                                </div>
                                <div class="item-pwd">
                                    <el-col>
                                        <span class="start" v-if="$route.query.type==1">*</span>
                                        登录密码
                                        <div class="nf-input w260">
                                            <el-input v-if="$route.query.type==1" type="password" v-model="addWorkerInfo.pwd" :maxlength="20"
                                                      placeholder="请输入登录密码"></el-input>
                                            <el-input class="placeholder-input" v-else-if="$route.query.type==3" type="password" v-model="editInfo.pwd"
                                                 @focus="placeholderValue=''" @blur="placeholderValue='******'"    :placeholder="placeholderValue"></el-input>
                                        </div>
                                    </el-col>
                                </div>
                            </el-col>
                            <el-col v-else-if="$route.query.type==2" style="color: #a2abb8" class="item">
                                <div class="item-id">
                                    <el-col>
                                        工位号
                                        <span class="label-info">{{stationInfo.bossCode}}-{{stationInfo.no}}</span>
                                    </el-col>
                                </div>
                                <div class="item-name">

                                    <el-col>
                                        工位姓名
                                        <span class="label-info">{{stationInfo.name}}</span>
                                    </el-col>

                                </div>
                                <div class="item-pwd">
                                    <el-col>
                                        登录密码
                                        <span class="label-info">******</span>
                                    </el-col>
                                </div>
                            </el-col>
                        </content-wrap>
                    </div>
                    <content-wrap class="group" title="角色权限" type="big">
                        <el-checkbox-group v-if="$route.query.type==1||$route.query.type==3" class="list" v-model="checkedWorkers"
                                           @change="handleCheckedWorkerChange">
                            <el-checkbox :title="city" class="item-checkbox" v-for="item in workbaysList"
                                         :label="item.id"
                                         :key="item.id">{{item.name}}
                            </el-checkbox>
                        </el-checkbox-group>
                        <ul class="role" v-else-if="$route.query.type==2">
                            <li class="role-list" v-for="item in stationInfo.roles" :key="item.id"><i></i>{{item.name}}
                            </li>
                        </ul>
                    </content-wrap>
                    <content-wrap class="group" title="工厂和分组" type="big">
                        <el-table
                                class="no-hover-highlight"
                                :data="selectList"
                                border
                                style="width: 50%">
                            <el-table-column
                                    label="所属工厂"
                                    width="350"
                                    prop="facName">
                            </el-table-column>
                            <el-table-column
                                    label="所属分组">
                                <template slot-scope="scope">
                                    <el-cascader
                                            v-if="$route.query.type==1||$route.query.type==3"
                                            change-on-select
                                            :options="options"
                                            v-model="scope.row.group"
                                            class="group-cascader"
                                            @change="handleChange">
                                    </el-cascader>
                                    <span v-else-if="$route.query.type==2" v-for="(item,index) in stationInfo.groups"
                                          :key="index">{{item.name}}{{index==(stationInfo.groups.length-1)?'':' / '}}</span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </content-wrap>
                </el-row>
            </div>

        </section>
        <el-dialog :visible.sync="addWorkPop" width="20%" :show-close=false>
            <span slot="title"
                  style="display:flex;justify-content:center;font-size:20px;border-bottom:1px solid #e6eaf0;padding-bottom:20px;">该工位号已存在</span>
            <div class="pop-body">
                <div><span class="label-name">工位号</span><span>{{repeatWorkInfo.no}}</span></div>
                <div><span class="label-name">工位姓名</span><span>{{repeatWorkInfo.name}}</span></div>
                <div><span class="label-name">当前关联工厂</span><span>{{repeatWorkInfo.facNames}}</span></div>
            </div>
            <div class="pop-tip">是否将此工号加入本厂?</div>
            <span slot="footer" class="dialog-footer">
                    <nf-button @click="addWorkPop = false" class="cancel is-plain">取消</nf-button>
                    <nf-button @click="importWorkId" type="warning">确定</nf-button>
                </span>
        </el-dialog>
        <el-dialog class='removePop' style="text-align: center;" :visible.sync="removePop" width="30%" :show-close=false>
            <icon w="80" h="80" type="icon-gongdan-jiedianjingbao-da"></icon>
            <div class="pop-tip">{{removePopState?'当前工位是某未完成的工单的负责人，不可移出!':'是否确定将该工位移出本厂?'}}</div>
            <span slot="footer" style="text-align: inherit;" class="dialog-footer">
                    <nf-button @click="removePop = false" v-show="!removePopState" class="cancel is-plain">取消</nf-button>
                    <nf-button @click="removeWorker()" type="warning">确定</nf-button>
                </span>
        </el-dialog>
        <div v-if="$route.query.type==2" style="margin-top: 16px;background: #fff;display: inline-block;">
            <nf-button type="warning" :plain="true" @click="removePop = true;removePopState = false">移出本厂</nf-button>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import {
        getFacWorkBayDetail,
        importWorkBayToFac,
        judgeRepeatWorkBay,
        getRoleAuthority,
        addFacWorkBay,
        getEasyGroups,
        updateFacWorkBay,
        removeWorkBayFromFac,
        queryFactoryGroupList,
    } from '../../../api/api'
    import md5 from 'js-md5';

    export default {
        name: "station-detail",
        data() {
            return {
                placeholderValue:'******',
                removePopState:false,
                removePop:false,
                updateFlag:false,
                editInfo:{bossCode:'',no:'',name:'',pwd:'',groups:[],roles:[]},
                stationInfo: {bossCode: '', no: '', name: '', groups: [], roles: [],isDisabled:false},
                repeatWorkInfo: {facNames: '', no: '', name: '', repeatWorkBayId: ''},
                addWorkPop: false,
                isLoading: false,
                group: [],//选中的分组
                groups: [],//所有的分组
                selectList: [{facName: JSON.parse(sessionStorage.getItem("last_login")).name,groups:[],group:[]}],
                checkedWorkers: [],
                userInfo: {
                    bossCode: ''
                },
                addWorkerInfo: {
                    name: '',
                    id: ' ',
                    pwd: '',
                    productPrepareCenterIds: []
                },
                workbaysList: [{}],
                options: [],
            }
        },
        computed: {
            facId(){
                return JSON.parse(sessionStorage.getItem("last_login")).id;
            }
        },
        methods: {
            handleChange(value) {
                console.log(value);
            },
            getAllWorkerList() {
                let params = {
                    facId: this.facId,
                };
                queryFactoryGroupList(params).then(res => {
                    if(res.data.code === 0){
                        let data = res.data.data;
                        //替换属性
                        data = JSON.parse(JSON.stringify(data).replace(/id/g,"value"));
                        data = JSON.parse(JSON.stringify(data).replace(/name/g,"label"));
                        data = JSON.parse(JSON.stringify(data).replace(/childrenFactoryGroupList/g,"children"));
                        data = JSON.parse(JSON.stringify(data).replace(/\"children\"\:\[\]\,/g, ''));
                        this.options = data;
                    }else{
                        this.$message.error(res.data.msg);
                    }
                })
            },
            removeWorker(){
                if(this.removePopState){
                    this.removePop = false;
                    return
                }
                let params = {
                    "id": JSON.parse(sessionStorage.getItem("selfFacStationDetail")).id,
                    "unitId": JSON.parse(sessionStorage.getItem("last_login")).id
                };
                removeWorkBayFromFac(params).then(res => {
                    console.log(res.data);
                    if(res.data.code == 1){
                        this.removePopState = true;
                    }else{
                        this.removePop = false;
                        this.$router.go(-1)
                    }

                })
            },
            async editInfoFn(){
                let params = {
                    "id": JSON.parse(sessionStorage.getItem("selfFacStationDetail")).id,
                    "unitId": JSON.parse(sessionStorage.getItem("last_login")).id
                };
                await getFacWorkBayDetail(params).then(res => {
                    this.editInfo = res.data;
                    for (var i = 0; i < this.editInfo.roles.length; i++) {
                        this.checkedWorkers[i] =  this.editInfo.roles[i].id
                    }
                    console.log(this.checkedWorkers);
                    this.editInfo.pwd = '';
                    this.selectList[0].group = [];
                    for (var i = 0; i < this.selectList[0].groups.length; i++) {
                        for (var j = 0; j < res.data.groups.length; j++) {
                            if(res.data.groups[j].id == this.selectList[0].groups[i].id){
                                this.selectList[0].group.push(res.data.groups[j].id)
                            }
                        }
                    }
                })
                this.getRoleList();
                console.log(this.editInfo,'editInfo');
            },
            importWorkId() {
                var params = {
                    "workBayId": this.repeatWorkInfo.repeatWorkBayId,
                    "unitId": JSON.parse(sessionStorage.getItem("last_login")).id
                };
                importWorkBayToFac(params).then(res => {
                    console.log(res, '引用');
                    if (res.data.code == 0) {
                        this.addWorkPop = false;
                        this.$router.go(-1)
                    }
                })
            },
            verifyWorkId(e) {
                if(this.$route.query.type == 1){
                    if ((/^[A-Za-z0-9\-]{1,31}$/).test(e.target.value)) {
                        var params = {
                            "workBayNo": this.addWorkerInfo.id,
                            "userId": this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId,
                            "unitId": JSON.parse(sessionStorage.getItem("last_login")).id
                        };
                        judgeRepeatWorkBay(params).then(res => {
                            console.log(res, '验证工位');
                            if (res.data.code == 1) {
                                this.addWorkPop = true;
                                this.repeatWorkInfo = res.data.data;
                            }
                        })
                    }
                }else {
                    if ((/^[A-Za-z0-9\-]{1,31}$/).test(e.target.value)) {

                        var params = {
                            "workBayNo": this.editInfo.no,
                            "userId": this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId,
                            "unitId": JSON.parse(sessionStorage.getItem("last_login")).id,
                            'workBayId':JSON.parse(sessionStorage.getItem('selfFacStationDetail')).id
                        };
                        judgeRepeatWorkBay(params).then(res => {
                            console.log(res, '验证工位');
                            if (res.data.code == 1) {
                                this.addWorkPop = true;
                                this.repeatWorkInfo = res.data.data;
                            }
                        })
                    }
                }

            },
            workNum(val) {
                if ((/^[A-Za-z0-9\-]{1,31}$/).test(val)) {
                } else {
                    this.$message.error('请输入1到30位的字母或数字');
                    this.addWorkerInfo.id = '';
                    this.editInfo.no = '';
                }
            },
            addWorker(type) {
                var _this = this;
                if (_this.isLoading) {
                    return
                }
                console.log(_this.addWorkerInfo);
                if (type==1) {


                    if (_this.addWorkerInfo.id && _this.addWorkerInfo.name && _this.userInfo.bossCode && this.addWorkerInfo.pwd) {

                        _this.isLoading = true

                        var params = {
                            "workBayNo": this.addWorkerInfo.id,
                            "userId": this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId,
                            "unitId": JSON.parse(sessionStorage.getItem("last_login")).id
                        };

                        judgeRepeatWorkBay(params).then(res => {
                            console.log(res, '验证工位');
                            if (res.data.code == 0) {
                                var params = {
                                    no: this.addWorkerInfo.id,
                                    name: this.addWorkerInfo.name,
                                    password: md5(this.addWorkerInfo.pwd),
                                    groupList: this.selectList[0].group,
                                    roleList: this.checkedWorkers,
                                    userId: this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId,
                                    unitId: JSON.parse(sessionStorage.getItem("last_login")).id
                                };
                                //console.log(JSON.stringify(params), '添加工位的参数');
                                addFacWorkBay(params).then(res => {
                                    console.log(res.data.code, '添加工位返回值');
                                    if (res.data.code == 0) {
                                        _this.$message({
                                            showClose: true,
                                            message: res.data.msg,
                                            type: "success",
                                        });
                                        _this.isLoading = false
                                        _this.$router.go(-1)
                                    } else {
                                        _this.isLoading = false;
                                        _this.$message({
                                            showClose: true,
                                            message: res.data.msg,
                                            type: "error",
                                        });
                                    }
                                })
                            } else if (res.data.code == 1) {
                                //体系层有重复,可引用到组织层
                                _this.isLoading = false;
                                this.addWorkPop = true;
                                this.repeatWorkInfo = res.data.data;
                            } else {
                                _this.isLoading = false;
                                _this.$message({
                                    showClose: true,
                                    message: res.data.msg,
                                    type: "error",
                                });
                            }
                        })
                    } else {
                        _this.isLoading = false;
                        _this.$message({
                            showClose: true,
                            message: '资料不完整',
                            type: "error",
                        });
                    }
                } else if(type==2){
                    if (_this.editInfo.no && _this.editInfo.name && _this.editInfo.bossCode) {

                        _this.isLoading = true

                        var params = {
                            "workBayNo": this.editInfo.id,
                            "userId": this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId,
                            "unitId": JSON.parse(sessionStorage.getItem("last_login")).id,
                            'workBayId':JSON.parse(sessionStorage.getItem('selfFacStationDetail')).id
                        };
                        console.log(params);
                        judgeRepeatWorkBay(params).then(res => {
                            console.log(res, '验证工位');
                            if (res.data.code == 0) {
                                let params = {
                                    no:this.editInfo.no,
                                    id: JSON.parse(sessionStorage.getItem("selfFacStationDetail")).id,
                                    name: this.editInfo.name,
                                    // password: md5(this.editInfo.pwd),
                                    groupList: this.selectList[0].group,
                                    roleList: this.checkedWorkers,
                                    userId: this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId,
                                    unitId: JSON.parse(sessionStorage.getItem("last_login")).id
                                };
                                if(this.editInfo.pwd){
                                    params.password = md5(this.editInfo.pwd)
                                }
                                console.log(this.editInfo.pwd,'=======',params.password);
                                updateFacWorkBay(params).then(res => {
                                    console.log(res.data, '添加工位返回值');
                                    if (res.data.code == 0) {
                                        _this.$message({
                                            showClose: true,
                                            message: res.data.msg,
                                            type: "success",
                                        });
                                        _this.isLoading = false;
                                        this.updateFlag = true;
                                        _this.$router.go(-1)
                                    } else {
                                        _this.isLoading = false;
                                        _this.$message({
                                            showClose: true,
                                            message: res.data.msg,
                                            type: "error",
                                        });
                                    }
                                })
                            } else if (res.data.code == 1) {
                                //体系层有重复,可引用到组织层
                                _this.isLoading = false;
                                this.addWorkPop = true;
                                this.repeatWorkInfo = res.data.data;
                            } else {
                                _this.isLoading = false;
                                _this.$message({
                                    showClose: true,
                                    message: res.data.msg,
                                    type: "error",
                                    duration: this.$globalConfig.elementUI.duration
                                });
                            }
                        })
                    } else {
                        _this.isLoading = false;
                        _this.$message({
                            showClose: true,
                            message: '资料不完整',
                            type: "error",
                            duration: this.$globalConfig.elementUI.duration
                        });
                    }
                }
                else {
                    // _this.$router.push('/home/setting/selfFacStationManager')
                    _this.$router.go(-1)
                }
            },
            async getUserInfo() {
                if(!this.$store.state.userInfo.loginName){
                    await this.$store.dispatch("getUserInfo");
                }
               let bossCode = (this.$store.state.userInfo.bossCode?this.$store.state.userInfo.bossCode:this.$store.state.userInfo.loginName) || JSON.parse(sessionStorage.getItem("user_login")).loginName;
                this.userInfo.bossCode = bossCode;
                this.editInfo.bossCode = bossCode;
            },
            handleCheckedWorkerChange(e) {
            },
            getRoleList() {
                let params = {facId: JSON.parse(sessionStorage.getItem('last_login')).id};
                getRoleAuthority(params).then(res => {
                    if (res.data.code == 0) {
                        this.workbaysList = res.data.data
                        console.log(this.workbaysList);
                    }
                });
            },
            getAllGroup() {
                let getGroupParams = {
                    "facId": JSON.parse(sessionStorage.getItem('last_login')).id,
                    "token": ""
                };
                getEasyGroups(getGroupParams).then(res => {
                    this.groups = res.data
                    this.selectList[0].groups = this.groups;
                })
            },

        },
        created() {
            this.getUserInfo();
            this.getAllGroup()
            this.getAllWorkerList();
            if (this.$route.query.type == 2) {
                var params = {
                    "id": JSON.parse(sessionStorage.getItem("selfFacStationDetail")).id,
                    "unitId": JSON.parse(sessionStorage.getItem("last_login")).id
                };
                getFacWorkBayDetail(params).then(res => {
                    this.stationInfo = res.data;
                    this.editInfo = res.data;
                    this.editInfo.pwd = ''
                })
            } else if(this.$route.query.type == 3){
              this.editInfoFn()
            }else{
                this.getRoleList();
            }
        },
        watch:{
            $route(v){
                console.log(v.query.type);
                if((v.query.type == 2&&!this.stationInfo.bossCode)||(v.query.type == 2&&this.updateFlag)){
                    var params = {
                        "id": JSON.parse(sessionStorage.getItem("selfFacStationDetail")).id,
                        "unitId": JSON.parse(sessionStorage.getItem("last_login")).id
                    };
                    getFacWorkBayDetail(params).then(res => {
                        console.log(res.data);
                        this.stationInfo = res.data;
                        this.editInfo = res.data;
                        this.editInfo.pwd = ''
                    })
                }else if(v.query.type == 3){
                    this.updateFlag = false;
                    this.editInfoFn()
                }
            },
        }
    }
</script>

<style lang="scss" scoped>
    .addworker {
        min-width: 1100px;
        height: 100%;
        // background-color: #f3f6fa;
        .canceled {
            z-index: 98;
            position: absolute;
            right: 50px;
            top: 9px;
            display: inline-block;
            width: 120px;
            height: 114px;
            transform: rotate(20deg);
            background: url(../../../assets/images/pic_disable.png)
        }
        .worker-select1 {
            width: 100%;
            margin-left: -10px
        }
        .worker-bar {
            display: flex;
            justify-content: space-between;
            height: 64px;
            line-height: 64px;
            padding: 0 32px;
            margin-bottom: 15px;
            border-radius: 2px;
            background-color: #ffffff;
            box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.06);
        }
        .worker-content {
            background-color: #ffffff;
            padding: 32px;
            .role {
                padding-bottom: 24px;
                border-bottom: 1px solid #e6eaf0;
                .role-list {
                    display: inline-block;
                    position: relative;
                    text-indent: 10px;
                    width: 136px;
                    i {
                        left: 0;
                        position: absolute;
                        vertical-align: center;
                        width: 6px;
                        height: 6px;
                        background: #1ca1ff;
                        border-radius: 50%;
                        top: 50%;
                        transform: translateY(-50%);
                    }
                }
            }
            .list {
                border-bottom: 1px solid #e6eaf0;
                .item-checkbox {
                    padding-bottom: 24px;
                    width: 136px;
                    margin-left: 0;
                }
            }
            .item {
                padding-bottom: 24px;
                font-family: MicrosoftYaHei;
                font-size: 14px;
                color: #3b3b3b;
                border-bottom: 1px solid #e6eaf0;
                .label-info {
                    margin-left: 16px;
                    color: #3b3b3b;
                    display: inline-block;
                    line-height: 14px;
                }
                input {
                    box-sizing: border-box;
                    width: 260px;
                    padding-left: 10px;
                    border-radius: 2px;
                    border: solid 1px #d0d3d7;
                    height: 36px;
                    line-height: 36px;
                    font-size: 14px;
                    color: #2c2c2c;
                }
                .item-id,
                .item-name,
                .item-pwd {
                    display: inline-block;
                    margin-right: 22px
                }
                .item-id {
                    .disabled {
                        background-color: #fafafa;
                        width: 100px;
                    }
                    .item-login {
                        width: 120px;
                    }
                }
                .item-name {
                    text-align: right;
                }
                .item-pwd {
                    text-align: right;
                }

            }
            .worker-group {
                margin-top: 40px;
                font-family: MicrosoftYaHei;
                font-size: 14px;
                color: #636363;
            }
            .worker-add-factory {
                height: 48px;
                line-height: 48px;
                border: 1px solid rgb(223, 228, 236);
                border-top: none;
                color: #ff9c38;
                padding-left: 18px;
                span {
                    cursor: pointer;
                }
            }
            .group {
                padding-bottom: 24px;
            }
            .production {
                margin-top: 24px;
            }
            .table-wrap {
                // width: 414px;
                display: inline-block;
            }
            .production-table {
                display: inline-block;
                width: auto;
            }
        }
    }

    .pop-body {
        background: #f5f7fa;
        border: 1px solid #e6eaf0;
        padding: 16px;
        > div {
            overflow: hidden;
            span {
                float: left;
            }
            .label-name {
                width: 100px;
                color: #a2abb8;
                margin-bottom: 14px;
            }
            &:last-child {
                .label-name {
                    margin-bottom: 0;
                }
            }
        }

    }

    .pop-tip {
        margin-top: 32px;
        text-align: center;
        color: #fa4150;
    }

    .nf-input {

        width: auto;
        display: inline-block;
    }

</style>
<style lang="scss">
    #station_detail {
        .placeholder-input{
            input::-webkit-input-placeholder{
                color:rgb(31, 41, 61);
            }
            input::-moz-placeholder{   /* Mozilla Firefox 19+ */
                color:rgb(31, 41, 61);
            }
            input:-moz-placeholder{    /* Mozilla Firefox 4 to 18 */
                color:rgb(31, 41, 61);
            }
            input:-ms-input-placeholder{  /* Internet Explorer 10-11 */
                color:rgb(31, 41, 61);
            }
        }
        .el-select {
            .el-input__inner {
                border: none;
            }
        }
        .el-dialog--small {
            width: 40%;
        }
        .removePop{
            .el-dialog--small {
                width: 30%;
            }
            .el-dialog__footer{
                text-align: center;
            }
        }
        .group-cascader{
            width: 100%;
            .el-input__inner{
                border: none;
            }
        }
    }
</style>