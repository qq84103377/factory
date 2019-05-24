<template>
    <div class="station">
        <div class="content">
            <div class="tree">
                <div class="yellow-border-title">
                    <h1 class="title">分组列表</h1>
                </div>
                <div class="tree-wrap" v-if="treeData.length">
                    <div class="all-station" @click="handleAllStation">全部工位</div>
                    <el-tree
                            :data="treeData"
                            :props="defaultProps"
                            :expand-on-click-node="false"
                            @node-click="handleNodeClick">
                    </el-tree>
                </div>
            </div>
            <div class="table-area">
                <el-col :span="24" class="table-search">
                    <el-col :span="8">
                        <div class="remote-search">
                            <span style="display:flex;width:78px;align-items:center;color:#3b3b3b;">所属分组</span>
                            <el-select v-model="group" multiple placeholder="请选择分组">
                                <el-option v-for="item in groups" :key="item.id" :label="item.name" :value="item.id">
                                </el-option>
                            </el-select>
                        </div>
                    </el-col>
                    <el-col :span="1" class="search-btn">
                        <nf-button style="width:98px;" type="filter" @click="getList(1)">筛选</nf-button>
                    </el-col>
                </el-col>
                <page-wrap class="table-wrap">
                    <div class="table" id="table">
                        <el-table
                                class="no-border"
                                :data="tableData" stripe @row-click="getDetaile" style="width: 100%">
                            <el-table-column class-name="is-white-header" class="h72" prop="user_name" label="姓名" sortable
                                             width="160" height="72">
                                <template slot-scope="scope">
                                    <!-- <span v-if="scope.row.disabled" style="color:#bbbbbb;">{{scope.row.user_name}}</span> -->
                                    <span :class="{'disabled-color': scope.row.isDisabled}">{{scope.row.name}}</span>
                                    <span v-if="scope.row.isDisabled" class="disabled-color">(已禁用)</span>
                                </template>
                            </el-table-column>
                            <el-table-column class-name="is-white-header" prop="login_name" sortable label="工位号" height="72"
                                             width="180">
                                <template slot-scope="scope">
                                    <span :class="{'disabled-color': scope.row.isDisabled}">{{bossCode + '-' + scope.row.no}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column class-name="is-white-header" prop="factory" height="72" label="角色">
                                <template slot-scope="scope">
                                    <span :class="{'disabled-color': scope.row.isDisabled}">{{scope.row.roleNames}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column class-name="is-white-header" prop="factory" height="72" label="分组名称">
                                <template slot-scope="scope">
                                    <span :class="{'disabled-color': scope.row.isDisabled}">{{scope.row.groupNames}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column class-name="is-white-header" prop="DATE" sortable height="72" label="创建时间"
                                             width="180">
                                <template slot-scope="scope">
                                    <span :class="{'disabled-color': scope.row.isDisabled}">{{scope.row.createAt}}</span>
                                    <!-- <span v-if="!scope.row.disabled" style="color: #2c2c2c;">{{scope.row.DATE}}</span> -->
                                </template>
                            </el-table-column>
                            <!--<el-table-column-->
                            <!--prop="disabled"-->
                            <!--height="72"-->
                            <!--label="状态"-->
                            <!--width="100">-->
                            <!--<template slot-scope="scope">-->
                            <!--<span v-if="scope.row.disabled"-->
                            <!--style="display: inline-block;color:#bbbbbb; transform:rotate(20deg);">已禁用</span>-->
                            <!--</template>-->
                            <!--</el-table-column>-->
                        </el-table>

                    </div>
                    <!--表格end-->


                    <!--分页begin-->

                    <div class="page">
                        <el-pagination  @current-change="getList(currentPage1)"
                                        :current-page.sync="currentPage1" :page-size="20"
                                        layout="total, prev, pager, next" :total="count">
                        </el-pagination>
                    </div>
                </page-wrap>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import {
        getSelfWorkList,
        queryFactoryGroupListAndUnit,
        getOneWorkbay,
        getEasyFactorys,
        getEasyGroups
    } from '../../../api/api'

    export default {
        name: "station-manager",
        props:{
            keyWord:{
                type:String,
                default:''
            }
        },
        data() {
            return {
                bossCode: '',
                currentPage1: 1,
                value8: '',
                tableData: [],
                count: 0,
                factory: [],//选中的工厂
                factorys: [],//所有的工厂
                group: [],//选中的分组
                groups: [],//所有的分组
                userId: '',
                treeData: [],       //工位分组树
                defaultProps: {
                    children: 'childrenFactoryGroupList',
                    label: 'name'
                },
                facMarkFlag: false,     //工厂标识
            }
        },
        computed:{
            facId() {
                return JSON.parse(sessionStorage.getItem("user_login")).unitId;
            }
        },
        methods: {
            getFactoryGroupTree() {
                let params = {
                    facId: this.facId,
                };
                queryFactoryGroupListAndUnit (params).then(res => {
                    if(res.data.code === 0){
                        this.treeData = [];
                        this.treeData.push(res.data.data);
                    }else{
                        this.$message.error(res.data.msg);
                    }
                })
            },

            handleNodeClick(data) {
                this.group = [];
                if(data.id){
                    this.group.push(data.id);
                }else{
                    this.facMarkFlag = true;
                }
                this.getList(1);
            },
            handleAllStation(){
                this.group = [];
                this.getList(1);
            },
            getDetaile(val) {
                sessionStorage.setItem('selfFacStationDetail', JSON.stringify(val));
                this.$router.push({path:'/selfFacStationDetail',query:{type:2}})
            },
            getAllGroup() {
                    let getGroupParams = {
                        "facId": JSON.parse(sessionStorage.getItem('last_login')).id,
                        "token": ""
                    };
                    this.group = [];//清空分组
                    getEasyGroups(getGroupParams).then(res => {
                        this.groups = res.data
                    })
            },
            getList(val) {
                let params = {
                    unitId: this.facId,
                    groupsFilter: this.group,
                    pageNum: val ,
                    pageSize: 20,
                    keyword:this.keyWord,
                    facMark: this.facMarkFlag,
                    userId: this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId
                };
                getSelfWorkList(params).then(res => {
                    this.facMarkFlag = false;
                    if(res.data.code === 0){
                        this.tableData = res.data.data.workBayList;
                        this.count = res.data.data.totalCount;
                    }else{
                        this.$message.error(res.data.msg);
                    }
                })
            },
        },
        async created(){
            //获取分组下拉数据
            this.getAllGroup();
            if(this.$route.query.gruopId){
                this.group.push(this.$route.query.gruopId)
            }
            if(!this.$store.state.userInfo.loginName){
                await this.$store.dispatch("getUserInfo");
            }
            this.bossCode = (this.$store.state.userInfo.bossCode?this.$store.state.userInfo.bossCode:this.$store.state.userInfo.loginName) || JSON.parse(sessionStorage.getItem("user_login")).loginName;
            this.getList(1);
            this.getFactoryGroupTree();
        },
        watch:{
            keyWord(nv,ov){
                this.getList(1);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .station{
        .content{
            .tree{
                width: 250px;
                min-height: 1040px;
                float: left;
                background-color: #fff;
                .yellow-border-title{
                    height: 40px;
                    padding-left: 10px;
                    border-bottom: 1px solid rgb(209, 216, 229);
                }
                .all-station{
                    line-height: 36px;
                    height: 36px;
                    padding-left: 16px;
                    cursor: pointer;
                    &:hover{
                        background: rgb(228, 230, 241);
                    }
                }
                .el-tree{
                    border: none;
                }
            }
            .table-area{
                padding-left: 260px;
            }
        }
        .table-search {
            background-color: #fff;
            box-sizing: border-box;
            line-height: 1;
            padding: 24px 32px;
            margin-bottom: 16px;
            box-shadow: 0 6px 10px -3px rgba(13, 51, 128, 0.1);
            overflow: hidden;
            .remote-search {
                border-radius: 2px;
                min-width: 260px;
                margin-right: 32px;
                display: flex;
                align-items: center;
                justify-content: flex-start;
                .el-input {
                    width: 95%;
                }
                .el-select {
                    width: 95%;
                }
            }
            .search-btn {
                text-align: right;
            }
        }
        .table-wrap {
            padding: 0;
            padding-bottom: 32px;
            width: 100%;
            min-height: auto;
            overflow: hidden;
        }
        #table {
            z-index: -1;
            .disabled {
                background-color: red;
            }
            .prepare-list {
                .prepare-item:not(:last-child) {
                    &::after {
                        content: '、'
                    }
                }
            }
        }
        .page {
            text-align: right;
            margin-top: 33px;
            padding-right: 32px;
        }
        .disabled-color{
            color: #c4c6cc;
        }
    }
</style>