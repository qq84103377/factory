<template>
    <div class="addworker update-worker">
        <div class="nf-scroll-container">
            <page-title title="工位管理">
                <div class="btns">
                    <nf-button @click="addWorker()">取消</nf-button>
                    <nf-button type="warning" @click="addWorker(1)">确认</nf-button>
                </div>
            </page-title>
            <!-- <div class="worker-bar">
                <div class="worker-title">
                    <span>工位管理</span>
                </div>
                
            </div> -->
            <div class="nf-scroll-view">
                <el-row class="worker-content">
                        <!-- <el-col :span="24" class="content-title">
                            <b></b>
                            <span>账号资料</span>
                        </el-col> -->
                    <content-wrap title="账号资料" type="big">
                        <el-col :span="24" class="item">


                            <div class="item-id">
                                <span class="start">*</span>
                                工位号
                                <div class="nf-input w120">
                                    <el-input type="text" class="disabled" v-model="userInfo.bossCode" disabled></el-input>
                                </div>
                                - 
                                <div class="nf-input w120">
                                    <el-input type="text" v-model="workerInfo.loginName" :maxlength="30" placeholder="请输入工位账号"></el-input>
                                </div>
                            </div>
                            <div class="item-name">
                                <span class="start">*</span>
                                工位姓名
                                <div class="nf-input w260">
                                    <el-input type="text" v-model="workerInfo.userName" :maxlength="30" placeholder="请输入姓名"></el-input>
                                </div>
                            </div>
                            <div class="item-pwd">
                                <span class="start">*</span>
                                登录密码
                                <div class="nf-input w260">
                                    <el-input type="password" v-model="workerInfo.pwd" placeholder="请输入登录密码"></el-input>
                                </div>
                            </div>



                        </el-col>
                    </content-wrap>
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
                                            v-model="scope.row.facname"
                                            @change="currentFactoryvalue($event, scope.row, scope.$index)">
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
                                    <el-select class="worker-select1" id="add-worker-select2" v-model="scope.row.groupIds" filterable multiple @change="handleSelect">
                                        <template>
                                            <div class="createGroup" :class="{'isBorder':scope.row.groupIds.length>0||groupoptions.length>0}">

                                            <span style="text-align: left;display: inline-block;width: 100%;
                                                height: 100%;" @click="addWorkerdialog(scope.row,scope.$index)"> <b style="font-size: 12px;" class="el-icon-plus"></b> 添加</span>
                                                <el-option v-show="groupoptions.length>0?true:false"
                                                        style="height: 0px;padding: 0;" disabled :value="''"></el-option>
                                            </div>

                                        </template>
                                        <el-option v-for="(k ,index) in scope.row.options" :key="index" :label="k.name" :value="k.id">
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
                            <span @click="addFactory()">
                                + 添加
                            </span>
                        </el-col>
                    </content-wrap>
                    <!-- <content-wrap class="production" title="生产准备中心" type="big">
                        <div class="table-wrap">
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
                                        <icon-button type="icon-delete" @click="handleDeletePrepareCenterRow(scope.$index)">删除</icon-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <el-col :span="24" class="worker-add-factory">
                                        <span @click="addPrepareCenterRow()">
                                            + 添加</span>
                            </el-col>
                        </div>
                    </content-wrap> -->
                </el-row>
            </div>
        </div>

        <el-dialog :visible.sync="workerDialog" id="addWorkerDialog">
            <h3 class="color-title">请输入分组</h3>
            <div class="color-set"><input type="text" placeholder="请输入想要新建的分组" v-model="groupName"></div>
            <span slot="footer" class="dialog-footer">
                <nf-button @click="workerDialog = false" class="cancel is-plain">取消</nf-button>
                <nf-button  @click="addGroup(groupName)" type="warning">确定</nf-button>
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
        getOneWorkbay,
        updateWorkbay,
        addFacGroups,
        selectGroups,
        queryProductPrepareCenterListEasy
    } from '../../api/api'

    export default {
        data() {
            return {
                // 数据
                isLoading:false,
                isAddLoading:false,
                workerDialog:false,//添加工位弹窗
                groupName:'',//新添加的组名
                currentItem:{},
                currentIndex:'',
                userInfo: {
                    bossCode: ''
                },
                workerInfo: {
                    name: '',
                    id: '',
                    pwd: '',
                    loginName: ''
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
                groupoptions: [],
                facvalue: '',
                groupvalue: '',
                isLoading: false,
                facInfos: [],//工厂列表
                prepareCenterOptions: [],
                prepareCenterTableData: [],
                prepareCenterSelected: []
            }
        },
        computed: {
            // 计算属性
            prepareCenterOptionsTest: {
                get() {
                    return this.prepareCenterOptions.filter(item => !this.prepareCenterSelected.includes(item.id))
                },
                set(val) {

                }
            }
        },
        watch: {

        },
        methods: {

//            搜索/新建分组
            searchGroup(facId, keyWord, index) {
                let _this = this;
                selectGroups({
                    "facId": facId,
                    "keyword": keyWord,
                    "token": "token"
                }).then(res => {
                    _this.selectList[index].options = res.data

                })
            },
            addWorkerdialog(item,index){
                //添加分组弹窗
                this.workerDialog = true;
                this.currentItem = item;
                this.currentIndex = index;

            },
            addGroup(facId, groupName, index) {
                //下拉框添加分组
                let _this = this;
                if(_this.isAddLoading){
                    return
                }
                //console.log(facId, groupName);
                if (!_this.groupName) {
                    return //console.log('没有名字不能添加分组!')
                }
                let params = {
                    "token": '',
                    "userId": this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId,
                    "facId": _this.currentItem.facId,
                    "name": _this.groupName
                };
                this.isAddLoading = true;

                addFacGroups(params).then(res => {
                        if (res.data.code == 0) {
                            var params = {
                                "facId": _this.currentItem.facId,
                                "token": ""
                            }
                            getEasyGroups(params).then(res => {
                                //console.log(res, '分组信息');
                                _this.groupoptions = res.data
                                _this.selectList[_this.currentIndex].options = res.data
                                for (var i = 0; i < res.data.length; i++) {
                                    if (res.data[i].name == _this.groupName) {
                                        _this.selectList[_this.currentIndex].groupIds.push(res.data[i].id);
                                        _this.workerDialog = false;
                                        _this.groupName = ''
                                    }

                                }
                            })
                            _this.isAddLoading = false;
                           // _this.selectList[_this.currentIndex]['newGroup'] = ''
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
//                this.$refs.searchAdd.value="";
//                this.selectList.item.addGroup="";
//                console.log(document.querySelector("#addGroup").children[0].value);
            },
            handleSelect(val) {
                //console.log(val)
            },
            // 方法
            getUserInfo() {
                let userInfo = JSON.parse(sessionStorage.getItem('user_login'))
                this.userInfo.bossCode = userInfo.loginName

                var _this = this;
                var workerDetailed = JSON.parse(sessionStorage.getItem('workerDetailed'))
                var params = {
                    "workbayId": workerDetailed.id,
                    "token": ""
                }
                getOneWorkbay(params).then(res => {
                    console.log(res, '工位信息');
                    _this.workerInfo.pwd = '';
                    _this.workerInfo.userName = res.data.userName;
                    _this.workerInfo.loginName = res.data.loginName;
                    _this.fetchPrepareCenterList(res.data.productPrepareCenters);
                    // _this.storePrepareCenterTableData(res.data.productPrepareCenters);
                    res.data.facInfos.map(item => {
                        item.facId = item.facid;
                        item.groupIds = []
                        item.groups.map(item2 => {

                            item.groupIds.push(item2.id);
                        });
                        //item.groupOptions = item.data.groupoptions
                    })

                    _this.selectList = [...res.data.facInfos]

                    console.log('=========选中的List',_this.selectList );

                    _this.getFactoryInfo();

                })
                //this.facoptions.push(editInfo.tableData.facname)
            },
            fetchPrepareCenterList(productPrepareCenters) {
                const userInfo = JSON.parse(sessionStorage.getItem('user_login'));
                const params = {
                    userId: userInfo.userId
                }
                queryProductPrepareCenterListEasy(params)
                .then(res => {
                    this.prepareCenterOptions = res.data['productPrepareCenterList'];
                    // this.addPrepareCenterRow();
                    this.storePrepareCenterTableData(productPrepareCenters);
                    console.log(res.data, '生产准备中心获取列表')
                })
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
            },
            getSelectedPrepareCenter() {
                let arr = [];
                for (let item of this.prepareCenterTableData) {
                    item.prepareCenterId && !arr.includes(item.prepareCenterId) && arr.push(item.prepareCenterId)
                }
                this.prepareCenterSelected = arr;
                arr = null;
            },
            // 获取返回的生产准备中心数据
            storePrepareCenterTableData(arr) {
                const tableData = [], selectedArr = [];
                for (let item of arr) {
                    tableData.push({
                        prepareCenterId: item.id
                    });
                    selectedArr.push(item.id);
                }
                this.prepareCenterTableData = tableData;
                this.$nextTick(() => {
                    this.prepareCenterSelected = selectedArr;
                });
            },
            addFactory() {
                var _this = this;

                this.initOptionsList();

                if (this.facoptions.length==0) {
                    return this.$message({
                        type:'error',
                        message:'没有更多的工厂了',
                        showClose:true,
                        duration:this.$globalConfig.elementUI.duration
                    })
                }

                this.selectList.push({"facId": "", "groupIds": "请选择"});

            }, initOptionsList(){
                //this.facInfos 总的选项
                //this.selectList 选中的
                //this.facoptions  下拉的

                this.facoptions = [];

//                
                for (var i = 0; i < this.facInfos.length; i++) {
                    let isIn=false;
                    for (var j = 0; j < this.selectList.length; j++) {


                        if ( this.facInfos[i].id==this.selectList[j].facId ) {
                            isIn=true;
                            //alert(this.facInfos[i].name);
                            break;
                        }

                    }
                    if(isIn==false) {
                        this.facoptions.push(this.facInfos[i]);
                    }

                }
//                console.log('所有的工厂',this.facInfos);
//                console.log('选中的工厂',this.selectList);
//                console.log('下拉',this.facoptions);
            },
            getFactoryInfo() {
                var _this = this;
                let userInfo = JSON.parse(sessionStorage.getItem('user_login'))
                var params = {
                    "userId": userInfo.userId,
                    "token": ""
                }
                getEasyFactorys(params).then(res => {
                    console.log(res, '获取工厂下拉列表');

                    _this.selectList.groups = res.data;
                    //_this.selectList.facoptions = res.data;
                    _this.facInfos = res.data;

                    _this.initOptionsList();


                })
            },
            currentFactoryvalue(val, item,index) {
                console.log('更新工位下拉框改变后的值',val,index);
                var _this = this;
                var params = {
                    "facId": val,
                    "token": ""
                }

                if (item) {
                    item.groupIds = []
                }
//                _this.groupoptions = []
                getEasyGroups(params).then(res => {
                    //console.log(res, '分组信息');
                    _this.groupoptions = res.data


                    _this.selectList[index].options = res.data;
                    _this.selectList[index].facId = val;
                    _this.selectList[index].facid = val;
                    //_this.selectList[index].facname = val;
                    //console.log();

                    this.initOptionsList();
                })

                return val
            },
            handleDelete(index) {
                //删除列
                this.selectList.splice(index, 1);
                this.initOptionsList();
            },
            addWorker(type) {
                var _this = this;
                if(_this.isLoading){
                    return
                }
                if (type) {
                    //确认添加工位
                    //console.log(_this.selectList, '--------------');
                    if (!_this.checkFormData()) return;
                    let facIds = [];
                    let groupIds = [];
                    for (var i = 0; i < _this.selectList.length; i++) {
                        facIds.push(_this.selectList[i].facId)
                        for (let j = 0; j < _this.selectList[i].groupIds.length; j++) {
                            groupIds.push(_this.selectList[i].groupIds[j])
                        }


                    }
//                    var facId = []
//                    var groupId = []
//                    for (let k of _this.selectList) {
//                        facId.push(k.facId)
//                        groupId.push(k.groupId)
//                        //console.log(k.groupIds, '选中的select');
//                    }
//                     if (!groupIds.length) {
//                         return this.$message({
//                             showClose: true,
//                             message: '请选取工位分组！',
//                             type: "error",
//                             duration: this.$globalConfig.elementUI.duration
//                         });
//                     }
                    _this.isLoading = true
                    var userInfo = JSON.parse(sessionStorage.getItem('user_login'))
                    var params = {
                        bossCode: _this.userInfo.bossCode,
                        workbayId: JSON.parse(sessionStorage.getItem('workerDetailed')).id,
                        loginName: _this.workerInfo.loginName,
                        password: _this.workerInfo.pwd?md5(_this.workerInfo.pwd):'',
                        userId: userInfo.userId,
                        userName: _this.workerInfo.userName,
                        headImg: "",
                        token: "",
                        facIds: facIds,
                        groupIds: groupIds,
                        productPrepareCenterIds: this.prepareCenterSelected
                    }


                    console.log(params, '更新工位的参数');
                    updateWorkbay(params).then(res => {
                        //console.log(res, '更新工位返回值');
                        if (res.data.code == 0) {
	                        _this.$router.push('/workermanager')
                            _this.$message({
                                showClose: true,
                                message: res.data.msg,
                                type: "success",
                                duration: this.$globalConfig.elementUI.duration
                            });
                            return
                        }
	                    _this.$message({
		                    showClose: true,
		                    message: res.data.msg,
		                    type: "error",
		                    duration: this.$globalConfig.elementUI.duration
	                    });
	                    _this.isLoading = false
                    })
                } else {
                    _this.isLoading = false
                    _this.$message({
                        showClose: true,
                        message: "已取消",
                        type: "warning",
                        duration: this.$globalConfig.elementUI.duration
                    });
                    _this.$router.go(-1)
                }
            },
            checkFormData() {
                if (!this.workerInfo['loginName']) {
                    this.$message({
                        showClose: true,
                        message: '请设置工位账号！',
                        type: "error",
                        duration: this.$globalConfig.elementUI.duration
                    });
                    return false
                }
                if (!this.workerInfo['userName']) {
                    this.$message({
                        showClose: true,
                        message: '请输入姓名！',
                        type: "error",
                        duration: this.$globalConfig.elementUI.duration
                    });
                    return false
                }
                return true
            },
        },
        created: function () {
            // 生命周期实例化钩子函数
            this.getUserInfo();

        }
        ,
        mounted: function () {
            // 生命周期渲染后钩子函数
        }
    }
</script>

<style lang="scss" scoped>
    @import '~scss_vars';
    .delete-btn {
        // margin: 1px 0;
        margin-left: 24px;
        padding: 0;
        width: 98px;
        height: 36px;
    }
    .nf-input {
        width: auto;
        display: inline-block;
    }
    .w120 {
        width: 120px;
    }
    .w260 {
        width: 260px;
    }
    .addworker {
        min-width: 1100px;
        height: 100%;
        background-color: #f3f6fa;
        .worker-bar {
            display: flex;
            justify-content: space-between;
            height: 64px;
            line-height: 64px;
            padding: 0 32px;
            margin-bottom: 16px;
            border-radius: 2px;
            background-color: #ffffff;
            box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.06);
            .worker-title {
                span {
                    width: 72px;
                    height: 24px;
                    font-family: MicrosoftYaHei;
                    font-size: 18px;
                    text-align: left;
                    color: #2c2c2c;
                }
            }
        }
        .worker-content {
            background-color: #ffffff;
            padding: 32px;
            .worker-select1 {
                width: 100%;
                margin-left: -10px
            }
            .content-title {
                height: 723px;
                border-radius: 2px;
                margin-top: 16px;
                line-height: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                b {
                    display: inline-block;
                    width: 6px;
                    height: 20px;
                    background-color: $color-btn;
                    margin-right: 10px;
                }
                span {
                    font-size: 20px;
                    color: #2c2c2c;
                    line-height: 20px;
                    height: 20px;
                }
            }
            .item {
                padding-bottom: 24px;
                margin-bottom: 24px;
                font-family: MicrosoftYaHei;
                font-size: 14px;
                color: #3b3b3b;
                border-bottom: 1px solid #e6eaf0;
                input {
                    box-sizing: border-box;
                    padding-left: 10px;
                    width: 260px;
                    height: 36px;
                    border-radius: 2px;
                    background-color: #fff;
                    border: solid 1px #d0d3d7;
                }
                .item-id,
                .item-name,
                .item-pwd {
                    display: inline-block;
                    margin-right: 32px
                }
                .item-id{
                    input{
                        width: 120px;
                    }
                }
                .item-name{
                    text-align: right;
                }
                .item-pwd{
                    text-align: right;
                    margin-right: 22px                    
                }
            }
            .worker-group {
                margin-top: 60px;
                font-family: MicrosoftYaHei;
                font-size: 20px;
                color: #636363;
                i{
                    display: inline-block;
                    width: 6px;
                    height: 20px;
                    background-color: $color-btn;
                    position: relative;
                    top: 2px;
                }
            }
            .worker-add-factory {
                height: 48px;
                padding-left: 18px;
                line-height: 48px;
                border: 1px solid rgb(223, 228, 236);
                border-top: none;
                color: #ff9c38;
                span {
                    cursor: pointer;
                }
                i {
                    font-size: 12px;
                }
                .add-btn {
                    padding-left: 1%
                }
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
            .group {
                padding-bottom: 24px;
                border-bottom: 1px solid #e6eaf0;
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
    .update-worker{
        .group{
            .content_wrap--head{
                display:block;
                padding-top:20px;
            }
        }
    }
    #add-worker-select1 {
        width: 260px;
    }

    #add-worker-select2 {
        width: 100%;
        .el-input__inner {
            border: none;
            width: 100%;
        }
    }

    #add-worker-select1,
    #add-worker-select2 {
        .el-input__inner {
            border: none;
        }
    }

    #addWorkerDialog{
        .el-dialog--small{
            width: 30%;
        }
    }
</style>