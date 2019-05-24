<template>
    <section class="financialAccount" v-loading="loading">
        <page-title title="单位管理">
            <!--<nf-button type="warning" @click="dialogEditRepertory = true">编辑关联工厂</nf-button>-->
            <nf-button type="warning" svg="icon-btn-add" @click="dialogNew('new')"> 新建财务账户</nf-button>
        </page-title>
        <el-table
                :data="tableData"
                border
                style="width: 100%">
            <el-table-column
                    prop="remitMethodName"
                    label="财务账户"
            >
            </el-table-column>
            <el-table-column
                    label="操作"
                    width="200"
                    align="center"
            >
                <template slot-scope="scope">
                    <div>
                        <span class="financialAccount-changeName" @click="dialogOpenEdit('edit',scope.row)">修改账户名称</span>
                        <span style="color: #808080;cursor: pointer" @click="dialogOpenEdit('del',scope.row)">删除账户</span>
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
                :title="dialogText"
                :visible.sync="dialogVisible"
                custom-class="financialAccount-dialog"
        >
            <div class="financialAccount-dialog-div" v-if="dialogType !=='del'">
                <span>财务账户</span>
                <el-input v-model="inputName" placeholder="请输入内容"></el-input>
            </div>
            <p v-if="dialogType ==='del'" style="text-align: center">
                <icon w="80" h="80" type="icon-gongdan-jiedianjingbao-da"></icon>
                <span style="display: block;font-size: 16px;color: #3B3B3B;font-weight: bold;margin-bottom: 6px;margin-top: 10px;">是否确认删除账户“{{inputName}}”？</span>
                删除后，将不能按此账户收付款，但此账户的历史收付款记录还可查询</p>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogSure">确 定</el-button>
             </span>
        </el-dialog>
    </section>
</template>

<script>
    import {financialAccountQueryList, financialAccountAdd,financialAccountEdit,accountDel} from '../../api/api'

    export default {
        data() {
            return {
                userId: this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId,
                unitId: JSON.parse(sessionStorage.getItem("last_login")).id,
                inputName: '',
                dialogVisible: false,
                loading: false,
                dialogText: '',
                dialogType: '',
                currentPage: 1,
                count: 10,
                accountId: '',
                tableData: []
            }
        },
        created() {
            this.getFinancialAccountQueryList()
        },
        methods: {
            // 获取财务账户列表
            getFinancialAccountQueryList() {
                this.loading = true;
                var params = {
                    userId: this.userId,
                    unitId: this.unitId,
                    pageNum: this.currentPage,
                    pageSize: 20,
                };
                financialAccountQueryList(params).then(res => {
                    this.loading = false;
                    var data = res.data.data;
                    this.tableData = [];
                    this.tableData = data.list;
                    this.count = data.pagination.total;
                    console.log(res);

                })
            },
            // 打开新建弹窗
            dialogNew(type) {
                this.dialogType = type;
                this.dialogText = '新建财务账户';
                this.inputName = '';
                this.dialogVisible = true;
            },
            //编辑账户名
            dialogOpenEdit(type,row) {
                this.dialogType = type;
                if(type==='edit'){
                    this.dialogText = '编辑账户名称';

                }else{
                    this.dialogText = '删除账户';
                }

                this.inputName = row.remitMethodName;
                this.accountId = row.id;
                this.dialogVisible = true;
            },
            //确实按钮
            dialogSure() {
                if (this.dialogType === 'new') {
                    financialAccountAdd({
                        remitMethodName: this.inputName,
                        userId: this.userId,
                        unitId: this.unitId,
                    }).then(res => {
                        this.$message({
                            message: '添加成功',
                            type: 'success',
                        });
                        // 重新获取数据
                        this.dialogVisible = false;
                        this.getFinancialAccountQueryList()
                    })
                }else if (this.dialogType === 'edit') {
                    //编辑
                    financialAccountEdit({
                        remitMethodName: this.inputName,
                        userId: this.userId,
                        unitId: this.unitId,
                        id: this.accountId,
                    }).then(res => {
                        this.$message({
                            message: '编辑成功',
                            type: 'success',
                        });
                        // 重新获取数据
                        this.dialogVisible = false;
                        this.getFinancialAccountQueryList()

                    })
                }else if (this.dialogType === 'del'){
                    //删除
                    accountDel({
                        id: this.accountId,
                    }).then(res => {
                        this.$message({
                            message: '删除成功',
                            type: 'success',
                        });
                        // 重新获取数据
                        this.dialogVisible = false;
                        this.getFinancialAccountQueryList()

                    })
                }


            },
            handleCurrentChange(val) {
                this.getFinancialAccountQueryList()
            },
        }
    }
</script>

<style lang="scss" scoped>
    .financialAccount {
        .financialAccount-changeName {
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
    .financialAccount-dialog {
        width: 560px;
        .el-dialog__header {
            text-align: center;
            border-bottom: 1px solid #808080;
            padding-bottom: 20px;
        }
        .financialAccount-dialog-div {
            padding-left: 100px;
        }
        .el-input, .el-input__inner {
            width: 78%;
        }
        .el-dialog__footer {
            border-top: 1px solid #808080;
            padding-top: 20px;
            margin-top: 20px;
        }
    }

</style>