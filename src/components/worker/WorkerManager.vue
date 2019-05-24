<template>
    <div class="worker-manager" id="workmanager">
        <!-- <section class="nf-scroll-container"> -->
            <page-title title="工位管理">
            		<el-input @change="remoteSearch" v-model="value8" placeholder="请输入姓名/工号" icon="search" style="width: 220px; margin-right: 8px;">
                </el-input>
                <nf-button type="warning" svg="icon-btn-add" @click="add">
                    新建工位
                </nf-button>
            </page-title>
            <el-col :span="24" class="table-search">
                <el-col :span="8">
                    <div class="remote-search">
                        <span style="display:flex;width:78px;align-items:center;color:#3b3b3b;">所属工厂</span>
                        <el-select v-model="factory" multiple @change="readSearch" placeholder="请选择工厂">
                            <el-option v-for="item in factorys" :key="item.id" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>


                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="remote-search">
                        <span style="display:flex;width:78px;align-items:center;color:#3b3b3b;">所属分组</span>
                        <el-select v-model="group" multiple placeholder="请选择分组" no-data-text="请先选择工厂">
                            <el-option v-for="item in groups" :key="item.id" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                    </div>
                </el-col>
                <el-col :span="1" class="search-btn">
                    <!--<el-button type="success" @click="filterSearch()">搜索筛选</el-button>-->
                    <nf-button style="width:98px;" type="filter" @click="filterSearch">筛选</nf-button>
                </el-col>
            </el-col>
            <!--表格begin-->
            <!-- <div class="nf-scroll-view"> -->
            <page-wrap class="table-wrap">
                <div class="table" id="table">
                    <el-table
                    class="no-border"
                    :data="tableData" stripe @row-click="getDetaile" style="width: 100%">
                        <el-table-column class-name="is-white-header" class="h72" prop="user_name" label="姓名" sortable width="160" height="72">
                            <template slot-scope="scope">
                                <!-- <span v-if="scope.row.disabled" style="color:#bbbbbb;">{{scope.row.user_name}}</span> -->
                                <span :class="{'disabled-color': scope.row.disabled}">{{scope.row.user_name}}</span>
                                <span v-if="scope.row.disabled" class="disabled-color">(已禁用)</span>
                            </template>
                        </el-table-column>
                        <el-table-column  class-name="is-white-header" prop="login_name" sortable label="工位号" height="72" width="180">
                            <template slot-scope="scope">
                                <span :class="{'disabled-color': scope.row.disabled}">{{bossCode + '-' + scope.row.login_name}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column class-name="is-white-header" prop="factory" height="72" label="工厂-分组">
                            <template slot-scope="scope">
                                <span v-for="(item,index) in scope.row.factory"
                                :class="{'disabled-color': scope.row.disabled}">
                                    {{item.name}}
                                    <span v-if="item.groups.length!=0">-</span>
                                    <span v-for="(k,i) in item.groups">{{k.name}}
                                        <i v-if="i!=item.groups.length-1">/</i>
                                    </span>
                                    <i v-if="index!=scope.row.factory.length-1">；</i>
                                </span>
                            </template>
                        </el-table-column>
                        <!-- <el-table-column class-name="is-white-header" label="生产准备中心">
                            <template slot-scope="scope">
                                <div class="prepare-list">
                                    <span
                                    class="prepare-item"
                                    :class="{'disabled-color': scope.row.disabled}"
                                    v-for="item in scope.row.productPrepareCenters"
                                    :key="item.id">{{ item.name }}</span>
                                </div>
                            </template>
                        </el-table-column> -->
                        <el-table-column class-name="is-white-header" prop="DATE" sortable height="72" label="创建时间" width="180">
                            <template slot-scope="scope">
                                <span :class="{'disabled-color': scope.row.disabled}">{{scope.row.DATE}}</span>                                <!-- <span v-if="!scope.row.disabled" style="color: #2c2c2c;">{{scope.row.DATE}}</span> -->
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
                    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                                :current-page.sync="currentPage1" :page-size="20"
                                layout="total, prev, pager, next" :total="count">
                    </el-pagination>
                </div>
            </page-wrap>
            <!-- </div> -->
        <!-- </section> -->
<!--&gt;>>>>>> Stashed changes-->

        <!--分页end-->
        <!--收费限制弹窗-->
        <warn-dialog :visible.sync="isShow" type="4" message="当前工位数已达到上限，无法再创建！" text="如有需要请联系云工厂客服或实施人员" @confirm="confirm"></warn-dialog>
    </div>
</template>

<script type="text/ecmascript-6">
    import {getWorkbayList, getOneWorkbay, getEasyFactorys, getEasyGroups} from '../../api/api'
    import warnDialog from '@/components/Common/dialog/warnDialog.vue'

    export default {
        components:{warnDialog},
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
                isShow: false, // 收费限制弹窗
                canCreate: true, // 是否可新建
            }
        },
        methods: {
            // 新建工位
            add() {
                if(this.canCreate) {
                    this.$router.push('/addworker')
                } else {
                    this.isShow = true
                }
            },
            confirm(){
                this.isShow = false
            },
            filterSearch() {
                //筛选
                let searchParams = {
                    "userId": this.userId,
                    "keyword": "",
                    "pageNo": 1,
                    "token": "",
                    "facIds": this.factory,
                    "groupIds": this.group,
                }
                getWorkbayList(searchParams).then(res => {
                    this.tableData = res.data.data;
                    this.count = res.data.data.length;
                    this.canCreate = res.data.canCreate
                })
            },
            addWorkerPath() {
                this.$router.push('/addworker')
            },
            handleSizeChange(val) {
                //console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                //console.log(`当前页: ${val}`);
                var _this = this;
                let params = {
                    "facId": JSON.parse(sessionStorage.getItem('last_login')).id,
                    userId: this.userId,
                    // "keyword": "",
                    "pageNo": val,
                    "token": "",
                    "sortType": 0
                }
                //获取之前先清空之前的数据

                getWorkbayList(params).then(res => {
                    //console.log(res, '分页的工位列表');
                    _this.tableData = []
                    for (var i = 0; i < res.data.data.length; i++) {
                        //console.log(res);
                        if (res.data.data[i].disabled === true) {
                            res.data.data[i].disabled = '已禁用'
                        }

                    }
                    _this.tableData = res.data.data
                    _this.table = res.data.count
                    _this.count = res.data.count
                })
            },
            getDetaile(val) {
                //console.log(val, '工位详情页面');
                sessionStorage.setItem('workerDetailed', JSON.stringify(val));
                this.$router.push('/workerDetailed')
            },
            remoteSearch(val) {
                //console.log(val);
                var _this = this;
                // var userLogin = JSON.parse(sessionStorage.getItem('user_login'))
                var lastLogin = JSON.parse(sessionStorage.getItem('last_login'))
                var params = {
                    "userId": this.userId,
                    "keyword": val,
                    "token": "",
                    "facIds": []
                }
                getWorkbayList(params).then(res => {
                    if (res.data.code == 0) {
                        _this.tableData = res.data.data
                        _this.count = res.data.count
                        _this.canCreate = res.data.canCreate
                    } else {
                        _this.$message({
                            showClose: true,
                            message: res.data.msg,
                            type: "error",
                        });
                    }

                })

            },
            handle(index, row) {
                //console.log(index, row);
                //alert(`当前点击的是第${index + 1}个,名字叫${row.name}`)
            },
            filterTag(value, row) {
                return row.tag === value
                //console.log(value);
            },
            getAllWorkerList() {
                var _this = this;
                // var userLogin = JSON.parse(sessionStorage.getItem('user_login'))
                var lastLogin = JSON.parse(sessionStorage.getItem('last_login'))
                var params = {
                    "userId": this.userId,
                    "keyword": "",
                    "token": "",
                    "facIds": []
                }

                getWorkbayList(params).then(res => {
                    //console.log(res, '获取到所有的工位列表1111');
                    for (var i = 0; i < res.data.data.length; i++) {
                        //console.log(res.data.data[i].disabled);
                        if (res.data.data[i].disabled === true) {
                            res.data.data[i].disabled = '已禁用'
                        }

                    }
                    _this.tableData = res.data.data
                    _this.count = res.data.count
                    _this.canCreate = res.data.canCreate
                })
            },
            getAllFac() {
                let getFacparams = {
                    "userId": this.userId,
                    "token": ""
                }
                getEasyFactorys(getFacparams).then(res => {
                    this.factorys = res.data
                })
            },
            readSearch(val) {
                if (val.length > 1) {
                    this.group = [];//清空分组
                    this.groups = [];//清空分组
                } else {
                    let getGroupParams = {
                        "facId": val[0],
                        "token": ""
                    }
                    this.group = [];//清空分组
                    getEasyGroups(getGroupParams).then(res => {
                        this.groups = res.data
                    })
                }


            }
        },
        created() {
            // console.log(this.$store.state.userInfo.loginName, 'aaaa')
            this.bossCode = this.$store.state.userInfo.loginName || JSON.parse(sessionStorage.getItem("user_login")).loginName;
            this.userId = this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId;

            this.getAllFac();
            this.getAllWorkerList();
        }
    }
</script>

<style lang="scss" scoped>
    @import '~scss_vars';
    .disabled-color {
        color: #c4c6cc;
    }
    .caret-wrapper {
        z-index: 1;
    }
    .worker-manager {
        // background-color: #f3f6fa;
        min-width: 1010px;
        .el-row {
            height: 64px;
            line-height: 64px;
            background-color: #fff;
            margin-bottom: 16px;
            border-radius: 2px;
            box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.06);
            .el-col {
                font-family: MicrosoftYaHei;
                font-size: 18px;
                text-align: right;
                padding-right: 40px;
                color: #2c2c2c;
                .worker-title {
                    font-size:24px;
                    text-align: left;
                    span {
                        padding-left: 32px;
                    }
                }
                /*.remote-search {*/
                /*min-width: 260px;*/
                /*text-align-last: left;*/
                /*border-radius: 2px;*/
                /*}*/
                .add-worker-btn {
                    text-align: right;
                    width: 112px;
                    border-radius: 2px;
                    background-color: $color-btn;
                    color: #fff;
                    border: none;
                }
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
    }
</style>
<style lang="scss">
    // #workmanager {
    //     width: 100%;
    //     height: 100%;
    // }
    // #workmanager .sort-caret {
    //     z-index: 1;
    // }
</style>
