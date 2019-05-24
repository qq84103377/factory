<template>
    <section class="workerMangement" v-loading="loading">
        <page-title title="员工管理">
        </page-title>
        <el-table
                :data="tableData"
                border
                style="width: 100%">
            <el-table-column
                    prop="userName"
                    label="姓名"
                    width="140"
            >
            </el-table-column>
            <el-table-column
                    prop="phone"
                    label="手机"
                    width="140"
            >
                <template slot-scope="scope">
                    <span v-if="scope.row.type!==0">{{scope.row.phone}}</span>

                </template>
            </el-table-column>
            <el-table-column
                    label="关联工厂"
            >
                <template slot-scope="scope">
                    <span style="margin-right: 5px;" v-for="item in scope.row.facUnitList">{{item.name}}</span>

                </template>
            </el-table-column>
            <el-table-column
                    label="关联店铺"
            >
                <template slot-scope="scope">
                    <span style="margin-right: 5px;" v-for="item in scope.row.storeUnitList">{{item.name}}</span>

                </template>
            </el-table-column>
            <el-table-column
                    prop="userName"
                    label="其他"
                    width="180"
            >
                <template slot-scope="scope">
                    <span v-if="scope.row.sysConfigCentre">{{scope.row.sysConfigCentre.name}}</span>
                    <span v-if="scope.row.sysFinanceCentre">{{scope.row.sysFinanceCentre.name}}</span>

                </template>
            </el-table-column>
            <el-table-column
                    label="操作"
                    width="200"
                    align="center"
            >
                <template slot-scope="scope">
                    <div>
                        <span class="workerMangement-changeName" @click="dialogOpenEdit(scope.row)">编辑关联组织</span>
                        <span style="color: #808080;cursor: pointer" @click="workerDel(scope.row.id)">全部移出</span>
                    </div>
                </template>
            </el-table-column>

        </el-table>
        <div class="page">
            <el-pagination @current-change="handleCurrentChange"
                           :current-page.sync="currentPage" :page-size="20"
                           layout="total, prev, pager, next" :total="count">
            </el-pagination>
        </div>
        <el-dialog
                :title="'编辑关联组织-'+dialogText"
                :visible.sync="dialogVisible"
                custom-class="workerMangement-dialog"
        >
            <div class="workerMangement-dialog-div">
                <div class="workerMangement-fac" v-for="item in organizationEdit" :key="item">
                    <div class="workerMangement-fac-lt">{{item.name}}</div>
                    <div class="workerMangement-fac-rg">
                        <el-checkbox-group v-model="item.checkIds" @change="changeValue">
                            <div class="workerMangement-fac-check" v-for="checkItem in item.dataList" :key="checkItem">
                                <el-checkbox :label="checkItem.id">
                                    <span>{{checkItem.name}}</span>
                                </el-checkbox>
                            </div>
                        </el-checkbox-group>
                    </div>
                </div>
            </div>

            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogSure">确 定</el-button>
             </span>
        </el-dialog>
    </section>
</template>

<script>
    import {
        membersMemberPage,
        membersMemberDetail,
        membersMemberDelete,
        membersMemberMemberUpdate,
        unitRelateGroup
    } from '../../api/api'

    export default {
        data() {
            return {
                organizationEdit: [{name: '工厂'}, {name: '店铺'}, {name: '其他'}],
                checkList: ['选中且禁用', '复选框 A'],
                userId: this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId,
                unitId: JSON.parse(sessionStorage.getItem("last_login")).id,
                inputName: '',
                loading: false,
                dialogVisible: false,
                dialogText: '',
                currentPage: 1,
                count: 10,
                accountId: '',
                tableData: [],
                editId: ''
            }
        },
        created() {
            this.getMembersMemberPage();
            this.getUnitRelateGroup();

        },
        methods: {
            // 获取所有的工厂店铺和其他列表
            getUnitRelateGroup(){
                // 获取体系所有相关组织集
                unitRelateGroup({userId: this.userId}).then(res => {
                    console.log(res);
                    var data = res.data.data;
                    this.organizationEdit[0].dataList = data.facUnitList;
                    this.organizationEdit[1].dataList = data.storeUnitList;
                    this.organizationEdit[2].dataList = [];
                    // 有配置中心
                    if (data.sysConfigCentre) {
                        data.sysConfigCentre.type = 1;
                        this.organizationEdit[2].dataList.push(data.sysConfigCentre)
                    }
                    // 有财务中心
                    if (data.sysFinanceCentre) {
                        data.sysFinanceCentre.type = 2;
                        this.organizationEdit[2].dataList.push(data.sysFinanceCentre)
                    }
                })
            },
            // 获取财务账户列表
            getMembersMemberPage() {
                this.loading = true;
                var params = {
                    userId: this.userId,
                    pageNum: this.currentPage,
                    pageSize: 20,
                };
                membersMemberPage(params).then(res => {
                    this.loading = false;
                    var data = res.data.data;
                    this.tableData = data.list;
                    this.count = data.pagination.total;
                    console.log(res);

                })
            },
            //编辑
            dialogOpenEdit(row) {
                this.dialogText = row.userName;
                this.editId = row.id;
                // 选中的工厂
                this.organizationEdit[0].checkIds = [];
                row.facUnitList.forEach(item => {
                    this.organizationEdit[0].checkIds.push(item.id)
                })


                //选中的店铺
                this.organizationEdit[1].checkIds = [];
                row.storeUnitList.forEach(item => {
                    this.organizationEdit[1].checkIds.push(item.id)
                })


                //选中的其他
                this.organizationEdit[2].checkIds = [];
                if (row.sysConfigCentre) {
                    this.organizationEdit[2].checkIds.push(row.sysConfigCentre.id);
                }
                if (row.sysFinanceCentre) {
                    this.organizationEdit[2].checkIds.push(row.sysFinanceCentre.id);
                }


                //     var aaa = [...this.organizationEdit];
                //     this.organizationEdit = aaa;
                // });

                this.dialogVisible = true;
            },
            //确实按钮
            dialogSure() {
                console.log(this.organizationEdit);
                var obj = {
                    id: this.editId,
                    facUnitList: [],
                    storeUnitList: [],
                };
                // 工厂list
                this.organizationEdit[0].checkIds.forEach(item => {
                    this.organizationEdit[0].dataList.forEach(list => {
                        if (item === list.id) {
                            obj.facUnitList.push(list)
                        }
                    })

                });
                // 店铺list
                this.organizationEdit[1].checkIds.forEach(item => {
                    this.organizationEdit[1].dataList.forEach(list => {
                        if (item === list.id) {
                            obj.storeUnitList.push(list)
                        }
                    })
                });
                // 其他
                if (this.organizationEdit[2]) {
                    this.organizationEdit[2].checkIds.forEach(item => {
                        this.organizationEdit[2].dataList.forEach(list => {
                            if (item === list.id) {
                                if (list.type === 1) {
                                    //配置中心
                                    obj.sysConfigCentre = list
                                }
                                if (list.type === 2) {
                                    //财务中心
                                    obj.sysFinanceCentre = list
                                }
                            }
                        })
                    });
                }
                ;
                membersMemberMemberUpdate(obj).then(res => {
                    console.log(res);
                    if(res.data.code===0){
                        this.$message({
                            message: '编辑成功',
                            type: 'success'
                        });

                        this.getMembersMemberPage();
                        this.dialogVisible = false;
                    }else {
                        this.$message(res.data.msg);
                    }
                })

            },
            changeValue() {
                //激活页面刷新
                var aaa = [...this.organizationEdit];
                this.organizationEdit = aaa;
                console.log(121);
            },
            //删除用户
            workerDel(id) {
                this.$confirm('此操作将永久删除该人员, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    var obj = {
                        id: id,
                        userId: this.userId
                    }
                    membersMemberDelete(obj).then(res => {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.getMembersMemberPage()
                    })

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });

            },
            //分页
            handleCurrentChange(val) {
                this.getMembersMemberPage()
            },
        }
    }
</script>

<style lang="scss" scoped>
    .workerMangement {
        .workerMangement-changeName {
            color: #1CA1FF;
            display: inline-block;
            border-right: 1px solid #E6EAF0;
            padding-right: 10px;
            margin-right: 10px;
            height: 13px;
            line-height: 13px;
            cursor: pointer;
        }
        .page {
            text-align: right;
            margin-top: 33px;
            padding-right: 32px;
        }

    }
</style>
<style lang="scss">
    .workerMangement-dialog {
        width: 800px;
        .el-dialog__header {
            text-align: center;
            border-bottom: 1px solid rgb(223, 228, 236);
            padding-bottom: 20px;
        }
        .workerMangement-dialog-div {
            /*padding-left: 100px;*/
            border: 1px solid rgb(223, 228, 236);
            .workerMangement-fac {
                display: flex;
                min-height: 40px;
                border-bottom: 1px solid rgb(223, 228, 236);
                &:last-child {
                    border: none;
                }
                .workerMangement-fac-lt {
                    min-width: 100px;
                    border-right: 1px solid rgb(223, 228, 236);
                    /*background: rgb(223, 228, 236);*/
                    font-weight: bold;
                    color: #333;
                    font-size: 16px;
                    padding-left: 10px;
                    padding-top: 10px;
                }
                .workerMangement-fac-rg {
                    padding-top: 10px;
                    padding-left: 20px;
                    .workerMangement-fac-check {
                        display: inline-block;
                        width: 120px;
                        margin-bottom: 6px;
                    }
                }
            }
        }
        .el-dialog__footer {
            border-top: 1px solid rgb(223, 228, 236);
            padding-top: 20px;
            margin-top: 20px;
        }
    }

</style>