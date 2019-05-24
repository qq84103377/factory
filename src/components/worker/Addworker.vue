<template>
    <div class="addworker">
        <section class="nf-scroll-container">
            <page-title title="新建工位">
                <div class="btns">
                    <nf-button @click="addWorker(0)">取消</nf-button>
                    <nf-button type="warning" @click="addWorker(1)">确认</nf-button>
                </div>
            </page-title>
            <div class="nf-scroll-view">
                <el-row class="worker-content">
                    <div style="height:140px;">
                        <content-wrap title="账号资料" type="big">
                        <el-col class="item">
                            <div class="item-id">
                                <el-col>
                                    <span class="start">*</span>
                                    工位号
                                    <div class="nf-input">
                                        <el-input type="text" v-model="userInfo.bossCode" class="disabled"
                                                disabled></el-input>
                                    </div>
                                    <span> - </span>
                                    <div class="nf-input">
                                        <el-input @input="workNum" type="text" :maxlength="30" v-model="workerInfo.id" class="item-login"
                                                placeholder="请输入编号"></el-input>
                                    </div>
                                </el-col>

                            </div>
                            <div class="item-name">

                                <el-col>
                                    <span class="start">*</span>
                                    工位姓名
                                    <div class="nf-input w260">
                                        <el-input type="text" v-model="workerInfo.name" :maxlength="30" placeholder="请输入姓名"></el-input>
                                    </div>
                                </el-col>

                            </div>
                            <div class="item-pwd">
                                <el-col>
                                    <span class="start">*</span>
                                    登录密码
                                    <div class="nf-input w260">
                                        <el-input type="password" v-model="workerInfo.pwd" :maxlength="20" placeholder="请输入登录密码"></el-input>
                                    </div>
                                </el-col>

                            </div>
                        </el-col>
                    </content-wrap>
                    </div>
                    <content-wrap class="group" title="工厂和分组" type="big">
                        <el-table
                            class="no-hover-highlight"
                            :data="selectList"
                            border
                            style="width: 100%">
                            <el-table-column
                            label="所属工厂"
                            width="290">
                                <template slot-scope="scope">
                                    <el-select class="worker-select1" id="add-worker-select1"
                                            v-model="scope.row.facId"
                                            @change="currentFactoryvalue($event, scope.row)">
                                        <el-option
                                                v-for="k in facoptions"
                                                :key="k.id"
                                                :label="k.name"
                                                :value="k.id">
                                        </el-option>
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column
                            label="所属分组">
                                <template slot-scope="scope">
                                    <el-select
                                            class="worker-select1"
                                            id="add-worker-select3"
                                            v-model="scope.row.groupIds" multiple filterable
                                            @visible-change="loadFactoryData($event, scope.row.facId)">

                                        <template>
                                            <div class="createGroup" :class="{'isBorder': scope.row.groupIds.length>0||groupoptions.length>0}">

                                            <span style="text-align: left;display: inline-block;width: 100%;
                                            height: 100%;" @click="addWorkerdialog(scope.row, scope.$index)"> <b style="font-size: 12px;" class="el-icon-plus"></b> 添加</span>
                                                <el-option v-show="groupoptions.length>0?true:false"
                                                        style="height: 0px;padding: 0;" disabled :value="''"></el-option>
                                            </div>

                                        </template>
                                        <el-option
                                                v-for="k in groupoptions"
                                                :key="k.id"
                                                :label="k.name"
                                                :value="k.id">
                                        </el-option>
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column
                            width="120"
                            label="操作">
                                <template slot-scope="scope">
                                    <icon-button type="icon-delete" @click="handleDelete(scope.$index)">删除</icon-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <el-col :span="24" class="worker-add-factory">
                            <span @click="addFactory()">+ 添加</span>
                        </el-col>
                    </content-wrap>
                    <!-- <content-wrap class="production" title="生产准备中心" type="big">
                        <div class="table-wrap" >
                            <el-table
                                class="no-hover-highlight"
                                :data="prepareCenterTableData"
                                border
                                style="width: 100%">
                                <el-table-column
                                label="所属生产准备中心"
                                width="290">
                                <template slot-scope="scope">
                                    <el-select class="worker-select1" id="add-worker-select1"
                                            v-model="scope.row.prepareCenterId"
                                            @change="handleChangePrepareCenter">
                                        <el-option
                                                v-for="k in prepareCenterOptionsTest"
                                                :key="k.id"
                                                :label="k.name"
                                                :value="k.id">
                                        </el-option>
                                    </el-select>
                                </template>
                                </el-table-column>
                                <el-table-column
                                label="操作"
                                width="120">
                                    <template slot-scope="scope">
                                        <icon-button type="icon-delete" @click="handleDeletePrepareCenterRow(scope.$index, scope.row.prepareCenterId)">删除</icon-button>
                                    </template>
                                </el-table-column>
                            </el-table>

                            <el-col :span="24" class="worker-add-factory">
                                <span @click="addPrepareCenterRow">+ 添加</span>
                            </el-col>
                        </div>
                    </content-wrap> -->
                </el-row>
            </div>
        </section>
        <el-dialog :visible.sync="workerDialog" id="addWorkerDialog">
            <h3 class="color-title">请输入分组</h3>
            <div class="color-set"><input type="text" placeholder="请输入想要新建的分组" v-model.trim="groupName"></div>
            <span slot="footer" class="dialog-footer">
                <nf-button @click="workerDialog = false" class="cancel is-plain">取消</nf-button>
                <nf-button :loading="isAddLoading" @click="addGroup(groupName)" type="warning">确定</nf-button>
            </span>
        </el-dialog>
    </div>
</template>

<script type="text/ecmascript-6">
    import md5 from 'js-md5'
    import {
        getEasyFactorys,
        getEasyGroups,
        addWorkbay,
        checkWorkbay,
        addFacGroups,
        selectGroups,
        queryProductPrepareCenterListEasy} from '../../api/api'


    export default {
        data() {
            return {
                // 数据
                isLoading: false,
                isAddLoading: false,
                workerDialog: false,//添加工位弹窗
                groupName: '',//新添加的组名
                currentItem: {},
                currentIndex: '',

                userInfo: {
                    bossCode: ''
                },
                workerInfo: {
                    name: '',
                    id: '',
                    pwd: '',
                    productPrepareCenterIds: []
                },
                tabbleisEdit: true,
                viewTableData: '',
                editTableData: [{
                    factory: '123',
                    group: '哈哈',
                    handle: '删除'
                }],
                selectList: [],
                facoptions: [],
                allFac: [],
                groupoptions: [],
                facvalue: '',
                groupvalue: '',
                isLoading: false,
                prepareCenterOptions: [],
                prepareCenterTableData: [],
                prepareCenterSelected: [], // 生产中心已选中的值
            }
        },
        computed: {
            // 计算属性
            prepareCenterOptionsTest() {
                return this.prepareCenterOptions.filter(item => !this.prepareCenterSelected.includes(item.id))
            }
        },
        methods: {
            // 方法
            workNum(val) {
                if((/^[A-Za-z0-9\-]{1,31}$/).test(val)) {
                }else {
                    this.$message.error('请输入1到30位的字母或数字');
                    this.workerInfo.id ='';
                }
            },
            loadFactoryData(event, facId) {
                if (event) {
                    this.searchGroup(facId, '');
                }
            },
            searchGroup(facId, keyWord) {
                selectGroups({
                    "facId": facId,
                    "keyword": keyWord,
                    "token": "token"
                }).then(res => {
                    this.groupoptions = res.data;
                })
            },
            fetchPrepareCenterList() {
                const userInfo = JSON.parse(sessionStorage.getItem('user_login'));
                const params = {
                    userId: userInfo.userId
                }
                queryProductPrepareCenterListEasy(params)
                .then(res => {
                    this.prepareCenterOptions = res.data['productPrepareCenterList'];
                    this.addPrepareCenterRow();
                    console.log(res.data, '生产准备中心获取列表')
                })
            },
            addWorkerdialog(item, index) {
                //添加分组弹窗
                this.workerDialog = true;
                this.currentItem = item;
                this.currentIndex = index;

            },
            addGroup(facId, index) {
                //下拉框添加分组
                let _this = this;
                if (this.isAddLoading) {
                    return
                }
                //console.log(facId, groupName);
                if (!this.groupName) {
                    this.$message.error('不能为空')
                    return
                }
                let params = {
                    "token": '',
                    "userId": this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId,
                    "facId": _this.currentItem.facId,
                    "name": this.groupName ? this.groupName : ''//防止传null
                };
                this.isAddLoading = true;
                addFacGroups(params).then(res => {
                        if (res.data.code == 0) {
                            var params = {
                                "facId": _this.currentItem.facId,
                                "token": ""
                            }
                            getEasyGroups(params).then(res => {
                                _this.groupoptions = res.data
                                for (var i = 0; i < res.data.length; i++) {
                                    if (res.data[i].name == this.groupName) {
                                        _this.selectList[_this.currentIndex].groupIds.push(res.data[i].id);
                                        _this.workerDialog = false;
                                        _this.groupName = ''
                                    }

                                }
                            })
                            _this.isAddLoading = false;
//                            _this.workerDialog = false;
//                            _this.groupName = ''
                        } else {
                            _this.isAddLoading = false;
                            return _this.$message({
                                showClose: true,
                                message: res.data.msg,
                                type: "error",
                                duration: this.$globalConfig.elementUI.duration
                            });
                        }


                    }
                );
            },
            getUserInfo() {
                let userInfo = JSON.parse(sessionStorage.getItem('user_login'))
                this.userInfo.bossCode = userInfo.loginName
            },
            autoAddFactory() {

                var _this = this;
                let userInfo = JSON.parse(sessionStorage.getItem('user_login'))
                var params = {
                    "userId": userInfo.userId,
                    "token": ""
                }

                let currentFac = ''
                let lastLogin = JSON.parse(sessionStorage.getItem('last_login'))
                getEasyFactorys(params).then(res => {
                    this.allFac = res.data;
                    for (let item of res.data) {
                        if (item.id == lastLogin.id) {
                            currentFac = item
                        }
                    }
                    this.initOptionsList();
                    this.currentFactoryvalue(currentFac.id);
                    this.selectList.push({"facId": currentFac.id, "groupIds": "请选择"});
                })

            },
            addFactory() {
                var _this = this;
                this.initOptionsList();
                if (this.facoptions.length == 0) {
                    return this.$message({
                        type: 'error',
                        message: '没有更多的工厂了',
                        showClose: true,
                        duration: this.$globalConfig.elementUI.duration
                    })
                }
                this.selectList.push({"facId": "", "groupIds": "请选择"});
            },
            // 添加生产准备中心一行
            addPrepareCenterRow() {
                const obj = {
                    prepareCenterId: ''
                }
                this.prepareCenterTableData.push(obj)
            },
            // 移除生产准备中心一行
            handleDeletePrepareCenterRow(index) {
                this.prepareCenterTableData.splice(index, 1);
                this.prepareCenterSelected.splice(index, 1)
            },
            // 生产准备中心select下拉框改变事件
            handleChangePrepareCenter(val) {
                this.getSelectedPrepareCenter();
                console.log(val, this.prepareCenterSelected)
            },
            getSelectedPrepareCenter() {
                let arr = [];
                for (let item of this.prepareCenterTableData) {
                    item.prepareCenterId && arr.push(item.prepareCenterId)
                }
                this.prepareCenterSelected = arr;
                arr = null;
            },
            initOptionsList() {
                //this.allFac 总的选项
                //this.selectList 选中的
                //this.facoptions  下拉的
                this.facoptions = [];
                for (var i = 0; i < this.allFac.length; i++) {
                    let isIn = false;
                    for (var j = 0; j < this.selectList.length; j++) {
                        if (this.allFac[i].id == this.selectList[j].facId) {
                            isIn = true;
                            break;
                        }
                    }
                    if (isIn == false) {
                        this.facoptions.push(this.allFac[i]);
                    }
                }
            },
            currentFactoryvalue(val, item) {
                var _this = this;
                var params = {
                    "facId": val,
                    "token": ""
                }
                if (item) {
                    item.groupIds = []
                }
                getEasyGroups(params).then(res => {
                    //console.log(res, '分组信息');
                    _this.groupoptions = res.data
                });

                this.initOptionsList();
                return val
            },
            handleDelete(index) {
                //删除列
                this.selectList.splice(index, 1);
                this.initOptionsList();
            },
            addWorker(type) {
                var _this = this;

                if (_this.isLoading) {
                    return
                }

                if (type) {
                    if (_this.workerInfo.id && _this.workerInfo.name && _this.userInfo.bossCode && this.workerInfo.pwd) {
                        //确认添加工位
                        // if (!this.prepareCenterSelected.length) {
                        //     _this.$message.error('请至少选择一个生产准备中心');
                        //     _this.isLoading = false;
                        //     return
                        // }
                        _this.isLoading = true
                        var facId = []
                        for (let k of _this.selectList) {
                            facId.push(k)
                            //console.log(k, '选中的select');
                        }
                        var params = {
                            "token": "",
                            "bossCode": _this.userInfo.bossCode,
                            "loginName": _this.workerInfo.id
                        }

                        let facIds = [];
                        let groupIds = [];
                        for (var i = 0; i < _this.selectList.length; i++) {
                            //console.log(_this.selectList[i].facId, '----facId----');
                            facIds.push(_this.selectList[i].facId)
                            for (let j = 0; j < _this.selectList[i].groupIds.length; j++) {
                                groupIds.push(_this.selectList[i].groupIds[j])
                            }
                        }
                        checkWorkbay(params).then(res => {
                            //console.log(res, '验证工位');
                            if (res.data.code == 0) {
                                var userInfo = JSON.parse(sessionStorage.getItem('user_login'));
                                var params = {
                                    bossCode: _this.userInfo.bossCode,
                                    loginName: _this.workerInfo.id,
                                    password: md5(_this.workerInfo.pwd),
                                    userId: userInfo.userId,
                                    userName: _this.workerInfo.name,
                                    headImg: "",
                                    token: "",
                                    facIds: facIds,
                                    groupIds: groupIds,
                                    productPrepareCenterIds: this.prepareCenterSelected
                                }
                                //console.log(JSON.stringify(params), '添加工位的参数');
                                addWorkbay(params).then(res => {
                                    //console.log(res.data.code, '添加工位返回值');
                                    if (res.data.code == 0) {
                                        _this.$message({
                                            showClose: true,
                                            message: res.data.msg,
                                            type: "success",
                                            duration: this.$globalConfig.elementUI.duration
                                        });
                                        _this.$router.go(-1)
                                    } else {
                                        _this.isLoading = false
                                        _this.$message({
                                            showClose: true,
                                            message: res.data.msg,
                                            type: "error",
                                            duration: this.$globalConfig.elementUI.duration
                                        });
                                    }
                                })
                            } else {
                                _this.isLoading = false
                                _this.$message({
                                    showClose: true,
                                    message: res.data.msg,
                                    type: "error",
                                    duration: this.$globalConfig.elementUI.duration
                                });
                            }
                        })
                    } else {
                        _this.isLoading = false
                        _this.$message({
                            showClose: true,
                            message: '资料不完整',
                            type: "error",
                            duration: this.$globalConfig.elementUI.duration
                        });
                    }
                } else {
                    _this.$router.push('/workermanager')
                }
            }
        },
        created: function () {
            // 生命周期实例化钩子函数
            this.getUserInfo()
//            this.getFactoryInfo()
            this.autoAddFactory()
            this.fetchPrepareCenterList()
        },
        mounted: function () {
            // 生命周期渲染后钩子函数
        },
        watch: {
            // 监听属性变化
        }
    }
</script>

<style lang="scss" scoped>
    @import '~scss_vars';

    .el-icon-plus {
        font-size: 12px;
        color: #ff9c38;
    }

    .nf-input {
        width: auto;
        display: inline-block;
    }

    .w80 {
        width: 80px;
    }

    .w260 {
        width: 260px;
    }

    .delbutton {
        height: 57px;
        line-height: 36px;
        color: #929aa6;
        cursor: pointer;
        svg {
            vertical-align: -1px
        }
        &:hover {
            color: #2c2c2c
        }
    }

    .addworker {
        min-width: 1100px;
        height: 100%;
        // background-color: #f3f6fa;
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
            .item {
                margin-bottom: 24px;
                padding-bottom: 24px;
                font-family: MicrosoftYaHei;
                font-size: 14px;
                color: #3b3b3b;
                border-bottom: 1px solid #e6eaf0;
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
</style>

<style lang="scss">
    #add-worker-select1 {
        width: 100%!important;;
        .el-input__inner {
            border: none;
            width: 100%;
        }
    }
    
    #add-worker-select3 {
        .el-input__inner {
            border: none;
            width: 100%;
        }
        .el-select-dropdown__list{
            padding: 0;
        }

    }
    .createGroup {
        box-sizing: border-box;
        color: #ff9c38;
        padding-left: 8px;
        cursor: pointer;
        line-height: 40px;
    }
    .isBorder{
        border-bottom: 1px solid #d8d8d8;
    }

    #addGroup {
        .el-input__inner {
            padding-left: 0;
            border: none;
        }
    }

    #select-create {
        border-bottom: 1px solid #e6e8eb;
        padding: 0;
        background-color: #fff;
        &:hover, .el-select-dropdown__item:hover {
            background-color: #fff;
        }
    }

    #addWorkerDialog {
        .el-dialog--small {
            width: 30%;
        }
        input {
            margin-top: 20px;
            padding: 8px 12px;
            width: 80%;
            height: 40px;
            border: 1px solid #eeeeee;
            border-radius: 5px;
            box-sizing: border-box;
            font-size: 16px;
        }
    }
    #addWorkerDialog .el-table .cell {
        display: flex;
        flex: 1;
        padding:0 !important;
        .el-select {
            display: flex;
            flex: 1;
            .el-select__tags {
                width: 100%;
                justify-content: flex-start;
            }
        }
    }
</style>
