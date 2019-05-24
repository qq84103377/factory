<template>
    <div class="customer-list">
        <!--头-->
        <page-title title="客户列表" bg>
            <el-input
                    @change="remoteSearch"
                    v-model="input2"
                    placeholder="请输入客户名称"
                    icon="search"
                    style="width: 220px;">
            </el-input>
            <nf-button type="warning" svg="icon-btn-add" @click="goToAddCustomer()">添加客户
            </nf-button>
        </page-title>
        <div class="filterList">
            <p style="line-height: 36px;margin-right: 10px;">客户分组</p>
            <div class="nf-input w260">
                <el-select style="width: 260px;" @change="selChange" multiple popper-class="popperClass" v-model="groupIds" placeholder="全部">
                    <el-option value="all" label="全部">全部</el-option>
                    <el-option
                            v-for="item in groupLists"
                            :key="item.groupId"
                            :label="item.groupName"
                            :value="item.groupId">
                    </el-option>
                </el-select>
            </div>
            <el-button class="btn btn-submit" @click="submit">筛选</el-button>
        </div>
        <!--头部end-->

        <!--表格begin-->
        <div class="table" id="table">

            <el-table
                    :data="tableData"
                    stripe
                    border
                    height=""
                    @row-click="getDetaile"
                    style="width: 100%"
            >
                <el-table-column
                        class="h72"
                        prop="name"
                        label="客户名称"
                        sortable
                        height="72"
                        width="270">
                </el-table-column>
                <el-table-column
                        class="h72"
                        prop="groupName"
                        label="客户分组"
                        height="72"
                        width="200">
                    <template slot-scope="scope">
                        <span :style="{color:scope.row.groupName==='未分组'?'#999':'#333'}">{{scope.row.groupName}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="phone"
                        label="手机号码"
                        height="72"
                        width="240">
                </el-table-column>
                <el-table-column
                        prop="remark"
                        height="72"
                        label="备注"
                        :formatter="formatter">
                </el-table-column>
            </el-table>

        </div>

        <!--表格end-->

        <!--分页begin-->
        <div class="page">
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page.sync="currentPage1"
                    :page-size="20"
                    layout="total, prev, pager, next"
                    :total="table">
            </el-pagination>
        </div>

        <!--分页end-->
        <!--新建弹窗-->
        <transition name="right-move">
            <AddCustomer @toggle="toggle" v-if="isShow"></AddCustomer>
        </transition>
        <transition name="opcity">
            <div class="cover" v-show="isShow" @click="isShow = false">
            </div>
        </transition>

    </div>
</template>

<script>
    import {getCustomerGroupLists, selectFacCustomer} from "../../api/api";
    import AddCustomer from './AddCustomer'

    export default {
        components: {AddCustomer},
        computed: {
            // 计算属性
            unitId(){
                return JSON.parse(sessionStorage.getItem("user_login")).unitId;
            },
        },
        data() {
            return {
                groupLists: [],
                groupIds: [],
                isShow: false,
                table: 0,
                tableData: [],
                input2: "",
                currentPage1: 1,
                pageSize1: 20,
                sign: '0'
            };
        },
        methods: {

            selChange(val){
                console.log(val);
                if(val.indexOf('all')>-1){
                    this.groupIds=[]
                    $('.popperClass').css('display','none')
                }
            },
            submit(){
                this.getList()
            },
            getCustomerGroupLists(){
                getCustomerGroupLists({unitId:this.unitId}).then(res=>{
                    if(res.data.code===0){
                        res.data.data.forEach(item=>{
                            if(item.groupName==='未分组'){
                                item.groupId = 'nogroup'
                            }
                        })
                        this.groupLists = res.data.data
                    }else {
                        this.$message.error(res.data.msg)
                    }

                })
            },
            toggle(val) {
                if (val) {
                    this.getList();
                }
                this.isShow = false

            },
            goToAddCustomer() {
                var datalist = JSON.parse(sessionStorage.getItem("user_login"))
                    .permissionList;
                if (datalist) {
                    for (let i = 0; i < datalist.length; i++) {
                        if (datalist[i] == "fac.customer.add") {
                            this.sign = "1";
                        }
                    }
                }
                if (this.sign == "0" || !datalist) {
                    this.$message.error("抱歉，您没有操作权限");
                    return;
                }
                //添加客户
                // this.$router.push("/addCustomer");
                this.isShow = true
            },
            remoteSearch(val) {
                var _this = this;
                let params = {
                    facId: JSON.parse(sessionStorage.getItem("last_login")).id,
                    keyword: val,
                    pageNo: 1,
                    token: "",
                    sortType: 0
                };
                //console.log(params, '关键字参数');
                selectFacCustomer(params).then(res => {
                    //console.log(res, '关键字结果');
                    _this.tableData = res.data.goods;
                    _this.table = res.data.count;
                });
            },
            getDetaile(val) {
                //console.log(val, '点击的客户信息');
                sessionStorage.setItem("customerInfo", JSON.stringify(val));
                this.$router.push("/customerinfo");
            },
            handleSizeChange(val) {
                //console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                //console.log(`当前页: ${val}`);
                var _this = this;
                let params = {
                    facId: JSON.parse(sessionStorage.getItem("last_login")).id,
                    keyword: _this.input2,
                    pageNo: val,
                    token: "",
                    sortType: 0
                };
                //获取之前先清空之前的数据
                //console.log(params, '第一页数据参数');
                _this.tableData = [];
                selectFacCustomer(params).then(res => {
                    _this.tableData = res.data.goods;
                    _this.table = res.data.count;
                });
            },
            formatter(row, column) {
                return row.remark;
            },
            handleIconClick(ev) {
                //console.log(ev);
            },
            getList() {
                var _this = this;
                let params = {
                    facId: JSON.parse(sessionStorage.getItem("last_login")).id,
                    keyword: "",
                    pageNo: 1,
                    token: "",
                    sortType: 0,
                    groupIds:this.groupIds
                };
                //console.log(params, '第一页列表');
                selectFacCustomer(params).then(res => {
                    //console.log(res, '第一页数据');
                    _this.tableData = res.data.goods;
                    _this.table = res.data.count;
                });
                //==========后台暂不可用,等待后台结果============
                //                let params = {
                //                    "facId": sessionStorage.getItem('curFacId'),
                //                    "token": '123'
                //                }
                //                //console.log(params, '查询参数---');
                //                getFacCustomerList(params).then(function (res) {
                //                    //console.log(res.data.length, '当前客户列表');
                //                    _this.tableData = res.data
                //                })
                //==========后台暂不可用,等待后台结果============
            }
        },
        created() {
            this.getList();
            this.getCustomerGroupLists();
        }
    };
</script>

<style lang="scss" scoped>
    @import "~scss_vars";

    .customer-list {
        .filterList {
            display: flex;
            border: 1px solid #e0e6ed;
            padding: 20px;
            .btn {
                width: 72px;
                height: 36px;
                box-sizing: border-box;
                border-width: 1px;
                border-style: solid;
                border-radius: 2px;
                margin-left: 12px;
                &:hover {
                    opacity: .7;
                }
            }
            .btn-submit {
                border-color: #54D1BC;
                background: #54D1BC;
                color: #fff;
            }
        }

        .table {
            margin-top: 17px;
        }
        .page {
            padding-right: 30px;
            margin: 20px 0;
            text-align: right;
        }
    }
</style>


<style lang="scss">
    @import "~scss_vars";

    #table {
        .el-table__header-wrapper {
            tr {
                height: 48px;
            }
        }
        .cell {
            &:hover {
                color: $color-btn;
                cursor: pointer;
                /*text-decoration: underline;*/
            }
        }
        .el-table__body-wrapper {
            tr {
                height: 56px;
            }
        }
    }
</style>


































