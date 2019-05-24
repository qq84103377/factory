<template>
    <div class="worker-detailed" id="worker-detailed">
        <span class="canceled" v-if="disabled"></span>
        <!-- <div class="is-cancel" v-if="disabled"></div> -->
        <page-title title="工位信息">
            <nf-button @click="back()">返回上级</nf-button>
        </page-title>
            
            <!-- <el-col :span="4">
                <div class="worker-title">
                    <span>工位信息</span>
                </div>
            </el-col> -->
            <!-- <el-col :span="4" :offset="16">
                <div class="btns">
                    <nf-button @click="back()"><i class="el-icon-arrow-left"></i>返回上级</nf-button>
                </div>
            </el-col> -->
        <el-row class="worker-content">
            <content-wrap title="账号资料" type="big">
                <div v-if="!disabled" slot="headRight">
                    <nf-button type="warning" :plain="true" @click="edit()">编辑</nf-button>
                    <!-- <span class="edit" @click="edit()">编辑</span> -->
                </div>
                <el-col :span="24" class="item">
                    <el-col :span="8">
                        <span class="item-title">工位号:</span>

                        <span class="item-content">{{userInfo.bossCode}} - {{workerInfo.login_name}}</span>
                        <!--<input type="text" v-model="userInfo.bossCode" disabled>-->


                        <!--<input type="text" v-model="workerInfo.login_name" disabled>-->
                    </el-col>

                    <el-col :span="8">
                        <span class="item-title">工位姓名:</span>
                        <span class="item-content">{{workerInfo.user_name}}</span>
                        <!--<input type="text" v-model="workerInfo.user_name" disabled>-->
                    </el-col>

                    <el-col :span="8">
                        <span class="item-title">登录密码:</span>
                        <span class="item-content">******</span>
                        <!--<input type="password" v-model="workerInfo.pwd" disabled>-->
                    </el-col>
                </el-col>
            </content-wrap>
            <!-- <el-col :span="24" class="content-title">
                <div>
                    <b></b>
                    <span>账号资料</span>
                </div>
                <div v-if="!disabled">
                    <nf-button type="warning" :plain="true" @click="edit()">编辑</nf-button>
                </div>
            </el-col> -->

            <!-- <el-col :span="24" class="item">
                    <el-col :span="8">
                        <span class="item-title">工位号:</span>

                        <span class="item-content">{{userInfo.bossCode}} - {{workerInfo.login_name}}</span>
                    </el-col>

                    <el-col :span="8">
                        <span class="item-title">工位姓名:</span>
                        <span class="item-content">{{workerInfo.user_name}}</span>
                    </el-col>

                    <el-col :span="8">
                        <span class="item-title">登录密码:</span>
                        <span class="item-content">******</span>
                    </el-col>
            </el-col> -->
            <content-wrap class="group" title="工厂和分组" type="big">
            <!-- <el-col :span="24" class="worker-group">
                <i></i>
                工厂和分组
            </el-col> -->
                <el-col :span="24" class="tabBox">


                    <el-table
                            ref="singleTable"
                            :data="tableData3"
                            border
                            style="width: 100%"
                            highlight-current-row>
                        <!--<el-table-column-->
                        <!--type="selection"-->
                        <!--width="55">-->
                        <!--</el-table-column>-->
                        <el-table-column
                                prop="facname"
                                label="所属工厂"
                                width="280">
                            <!--<template scope="scope">{{ scope.row.date }}</template>-->
                        </el-table-column>
                        <el-table-column
                                prop="groupinfos"
                                label="分组">
                            <template slot-scope="scope">
                                <span v-for="(item, index) in scope.row.groups" :key="index">
                                    {{ item.name }}<i v-if="index !== scope.row.groups.length-1">、</i>
                                </span>
                            </template>
                        </el-table-column>

                    </el-table>

                </el-col>
            </content-wrap>
            <!-- <content-wrap class="production" title="生产准备中心" type="big">
                <item-base class="prepare-item" v-for="item in productPrepareCenter" :key="item.id">{{ item.name }}</item-base>
            </content-wrap> -->
            <el-col :span="24" class="worker-add-factory">
                <el-row>
                    <el-col :span="8">
                        <nf-button v-show="!disabled" type="danger" plain @click="rmFactory()">禁用工位
                        </nf-button>
                        <nf-button v-show="disabled" type="danger" plain @click="rmFactory()">启用工位
                        </nf-button>
                        <!-- <span class="rm"
                                            @click="rmFactory()"> {{disabled == false ? "禁用工位" : "解禁工位"}}</span> -->
                    </el-col>
                </el-row>
            </el-col>

        </el-row>
    </div>
</template>

<script type="text/ecmascript-6">
    import {getEasyFactorys, getEasyGroups, addWorkbay, checkWorkbay, getOneWorkbay, banWorkbay} from '../../api/api'

    export default {
        data() {
            return {
                // 数据
                userInfo: {
                    bossCode: ''
                },
                workerInfo: {
                    pwd: ''
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
                logining: false,
                workerDetailed: {},
                tableData3: [],
                productPrepareCenter: [],
                currentRow: '',
                rmFlag: false,
                disabled: "获取中..."

            }
        },
        computed: {
            // 计算属性

        },
        methods: {
            // 方法
            getWorkerInfo() {
                var _this = this;
                let userInfo = JSON.parse(sessionStorage.getItem('user_login'))
                _this.userInfo.bossCode = userInfo.loginName
                _this.workerInfo = {...JSON.parse(sessionStorage.getItem('workerDetailed')), pwd: ''}
                var params = {
                    "workbayId": _this.workerInfo.id,
                    "token": ""
                }
                getOneWorkbay(params).then(res => {
                    //console.log(res, '单个工位的信息');
                    _this.workerInfo.pwd = res.data.password
                    _this.tableData3 = res.data.facInfos
                    _this.productPrepareCenter = res.data.productPrepareCenters;
                    //console.log(_this.tableData3, '-----');

                    // 工位状态
                    _this.disabled = res.data.disabled
                })
            },
            rmFactory() {
                //删除工厂修改为解禁/禁用
                var _this = this;
                var params = {
                    "userId": this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId,
                    "workbayId": _this.workerInfo.id,
                    "token": "",
                    "type": !_this.disabled * 1
                }
                banWorkbay(params).then(res => {
                    if (res.data.code == 0) {
                        _this.$message({
                            type: 'success',
                            showClose: true,
                            message: res.data.msg,
                        });
                        setTimeout(function () {
                            _this.$router.push('/workermanager')
                        }, 300)

                    }
                })

            },
            handleSelectionChange(val) {
                //console.log(val, '下拉改变处理函数');
            },


            setCurrent(row) {
                this.$refs.singleTable.setCurrentRow(row);
            },
            edit() {
                var obj = {
                    userInfo: this.userInfo,
                    workerInfo: this.workerInfo,
                    tableData: this.tableData3
                }
                sessionStorage.setItem('editInfo', JSON.stringify(obj))
                this.$router.push('/UpdateWorker')
            },
            back() {
                this.$router.go(-1)
            }


        },
        created: function () {
            // 生命周期实例化钩子函数
            this.getWorkerInfo()
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

    .worker-detailed {
        background-color: #f3f6fa;
        min-width: 1100px;
        .worker-bar {
            height: 64px;
            line-height: 64px;
            border-radius: 2px;
            background-color: #ffffff;
            box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.06);
            .el-col {
                .worker-title {
                    padding-left: 32px;
                    span {
                        width: 72px;
                        height: 24px;
                        font-family: MicrosoftYaHei;
                        font-size: 18px;
                        text-align: left;
                        color: #2c2c2c;
                    }
                }
                .btns {
                    text-align: right;
                    padding-right: 32px;
                    i {
                        margin-right: 5px;
                        font-size: 12px;
                    }
                }
            }
        }
        .worker-content {
            margin-top: 16px;
            background-color: #ffffff;
            padding: 32px;
            .content-title {
                height: 723px;
                border-radius: 2px;
                margin-top: 16px;
                line-height: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                div {
                    span {
                        font-size: 20px;
                        color: #2c2c2c;
                        line-height: 20px;
                        height: 20px;
                    }
                    b {
                        display: inline-block;
                        height: 20px;
                        width: 6px;
                        background-color: $color-btn;
                        position: relative;
                        top: 2px;
                    }
                    &:last-child {
                        /*padding-right: 66px;*/
                        .edit {
                            display: inline-block;
                            width: 64px;
                            height: 32px;
                            line-height: 32px;
                            text-align: center;
                            border-radius: 2px;
                            border: solid 1px #ff9c38;
                            font-family: MicrosoftYaHei;
                            font-size: 14px;
                            color: #ff9c38;
                            cursor: pointer;
                        }
                    }
                }

            }
            .item {
                padding-bottom: 24px;
                font-family: MicrosoftYaHei;
                font-size: 14px;
                color: #636363;
                border-bottom: 1px solid #e6eaf0;
                .item-box {
                    margin-top: 24px;
                    input {
                        padding-left: 10px;
                        width: 180px;
                        height: 36px;
                        border-radius: 2px;
                        background-color: #fff;
                        border: none;
                    }
                }
                
                .item-title{
                    color: #636363;
                    font-size: 14px;
                }
                .item-content{
                    font-size: 14px;
                    color: #2c2c2c;
                }

            }
            .worker-group {
                margin-top: 60px;
                font-family: MicrosoftYaHei;
                font-size: 20px;
                color: #2c2c2c;
                i{
                    display: inline-block;
                    width: 6px;
                    height: 20px;
                    background-color: #ff9c38;
                    position: relative;
                    top: 3px;
                }
            }
            .table {
            }
            .worker-add-factory {
                margin-top: 50px;
                height: 48px;
                line-height: 48px;
                span {
                    display: inline-block;
                    width: 96px;
                    height: 32px;
                    line-height: 32px;
                    text-align: center;
                    border-radius: 2px;
                    background-color: #ffffff;
                    border: 1px solid #d0d3d7;
                    color: #aaaaaa;
                }
                .rm {
                    cursor: pointer;
                    display: inline-block;
                    width: 96px;
                    height: 32px;
                    line-height: 32px;
                    text-align: center;
                    border-radius: 2px;
                    background-color: #ffffff;
                    &:hover {
                        border: 1px solid $color-btn;
                        color: $color-btn;
                    }
                }
            }
            .group {
                margin-top: 20px;
                margin-bottom: 22px;
            }
            .tabBox {
                border-bottom: none;
                .table-edit {
                    .el-col {
                        background-color: #f7f9fc;
                        height: 48px;
                        line-height: 48px;
                        padding-left: 1%;
                        border-right: none;
                        border-left: none;
                        border-bottom: 1px solid #ccc;
                    }
                }
                .tab-select {
                    .el-col {
                        padding: 10px;
                        border-right: 1px solid #cccccc;
                        border-bottom: 1px solid #ccc;
                        &:last-child {
                            border-right: none;
                        }
                    }
                }
            }
            .production {
                padding-bottom: 14px;
                // border-bottom: 1px solid #e6eaf0;
                .prepare-item {
                    margin-right: 8px;
                }
            }
        }
    }
</style>

<style lang="scss">
    .worker-detailed{
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
        width: 640px;
        .el-input__inner {
            border: none;
            width: 100%;
        }
    }

    #add-worker-select1, #add-worker-select2 {
        .el-input__inner {
            border: none;
        }
    }

    #worker-detailed {
        position: relative;
        .is-cancel {
            position: absolute;
            top: 80px;
            left: 0;
            width: 100%;
            height: 72%;
            background-color: rgba(255, 255, 255, 0.6);
            color: #e0e0e0;
            z-index: 99;
        }
        .canceled {
            z-index: 98;
            position: absolute;
            right: 50px;
            top: 120px;
            display: inline-block;
            width: 120px;
            height: 114px;
            transform: rotate(20deg);
            background: url(../../assets/images/pic_disable.png)
        }
    }
</style>