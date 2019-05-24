<template>
    <div class="supplier-list">
        <!--头部begin-->
        <el-row type="flex" justify="center" align="center" class="header_line">
            <el-col :span="6" class-name="col-height">
                <div class="header-title">供应商管理</div>
            </el-col>
            <el-col :span="5" :offset="8" class-name="col-height">
                <div class="header-content">


                    <el-input
                            @change="remoteSearch"
                            v-model="input2"
                            placeholder="请输入供应商名称"
                            icon="search"
                    >

                    </el-input>


                    <!--<el-input placeholder="请输入供应商名称" icon="search" v-model="input2"-->
                    <!--:on-icon-click="handleIconClick">-->
                    <!--</el-input>-->
                </div>
            </el-col>
            <el-col :span="5" class="add-customer" class-name="col-height">
                <router-link to="/addSupplier"><i class="el-icon-plus"></i>添加供应商</router-link>
            </el-col>
        </el-row>
        <!--头部end-->

        <!--表格begin-->
        <div class="table" id="table">

            <el-table
                    :data="tableData"
                    border
                    stripe
                    height=""
                    @row-click="getDetaile"
                    style="width: 100%"
            >
                <el-table-column
                        class="h72"
                        prop="name"
                        label="供应商名称"
                        sortable
                        height="72"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="phone"
                        label="手机号码"
                        height="72"
                        width="180">
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
                    :total="tableData.length">
            </el-pagination>
        </div>


        <!--分页end-->

    </div>
</template>

<script>
    import {selectFacSupplier, selectFacCustomer} from '../../api/api'

    export default {
        data() {
            return {
                table: 0,
                tableData: [],
                input2: '',
                currentPage1: 1,
                input4: '',
                result: [],
            }
        },
        methods: {
            remoteSearch(val) {
                var _this = this;
                let params = {
                    "facId": JSON.parse(sessionStorage.getItem('last_login')).id,
                    "keyword": val,
                    "pageNo": 1,
                    "token": "",
                    "sortType": 0,
                }
                selectFacSupplier(params).then(res=>{
                    //console.log(res);
                    _this.tableData = res.data.goods
                    _this.table = res.data.count
                })

            },
            getDetaile(val) {
                sessionStorage.removeItem('supplierInfo', JSON.stringify(val))
                sessionStorage.setItem('supplierInfo', JSON.stringify(val))
                this.$router.push('/supplierInfo')
            },
            handleSizeChange(val) {
                //console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                //console.log(`当前页: ${val}`);
                var _this = this;
                let params = {
                    "facId": JSON.parse(sessionStorage.getItem('last_login')).id,
                    "keyword": "",
                    "pageNo": val,
                    "token": "",
                    "sortType": 0
                }
                //获取之前先清空之前的数据
                _this.tableData = []
                selectFacSupplier(params).then(res => {
                    //console.log(res, '供应商列表');
                    _this.tableData = res.data.goods
                    _this.table = res.data.count
                })
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
                    "facId": JSON.parse(sessionStorage.getItem('last_login')).id,
                    "keyword": "",
                    "pageNo": 1,
                    "token": "",
                    "sortType": 0,
                }
                //console.log(params, '供应商第一页列表-参数');
                selectFacSupplier(params).then(res => {
                    //console.log(res, '供应商第一页数据');
                    _this.tableData = res.data.goods
                    _this.table = res.data.count
                })
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
            this.getList()
        }
    }
</script>

<style lang="scss" scoped>
    @import '~scss_vars';

    .supplier-list {
        .header_line {
            height: 50px;
            line-height: 50px;
            .header-title {
                padding-left: 16px;
                font-size: 16px;
                color: #2c2c2c;
            }
            .add-customer {
                display: flex;
                justify-content: center;
                align-items: center;
                a {
                    display: inline-block;
                    width: 118px;
                    text-align: center;
                    line-height: 30px;
                    height: 30px;
                    border-radius: 100px;
                    border: solid 1px $color-btn;
                    color: $color-btn;
                }
            }
        }
        .table {

        }
        .page {
            margin:20px 0;
            text-align: center;
        }

    }
</style>


<style lang="scss">
    @import '~scss_vars';

    #table {
        .el-table tr {
            height: 64px;
        }
        .cell {
            &:hover {
                color: $color-btn;
                cursor: pointer;
                /*text-decoration: underline;*/
            }
        }
    }

</style>


































