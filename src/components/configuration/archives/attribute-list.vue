<template>
    <div class="archives-table-table-list-list">
        <!--编辑属性选项-->
        <el-dialog :visible.sync="dialogForm1" @close="closeSingleForm1()" show-close="true"
                   :title="title+'-属性选项'">
            <div class="isTable">
                <el-table
                        :data="tableData2"
                        border
                        max-height="500"
                        style="width: 100%">
                    <el-table-column
                            prop="name"
                            label="选项名称"
                            width="150">
                        <template slot-scope="scope">
                            <div class="isDiv" v-if="scope.row.isShow">
                                {{scope.row.name}}
                                <!--{{falg?scope.row.materialName:scope.row.name}}-->
                            </div>
                            <div class="isDiv1" v-else="scope.row.isShow">
                                <el-input v-model="scope.row.name"
                                          placeholder="请输入内容"></el-input>
                            </div>
                            <!--<div class="isDiv1" v-else="scope.row.isShow">-->
                            <!--<el-input v-model="falg?scope.row.materialName:scope.row.name"-->
                            <!--placeholder="请输入内容"></el-input>-->
                            <!--</div>-->
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="name"
                            label="操作">
                        <template slot-scope="scope">
                            <tr class="archives_tr">
                                <td class="archives_td1" v-if="scope.row.isShow">
                                    <div class="btn-wrap">
                                        <el-button type="text" @click="Modify(scope.$index)">
                                            <icon type="icon-edit"></icon>
                                            修改选项名称
                                        </el-button>
                                    </div>
                                </td>
                                <td class="archives_td2" v-if="scope.row.isShow">
                                    <div class="btn-wrap">
                                        <el-button type="text" @click="click_delete(scope.$index,scope.row.id)">
                                            <icon-button type="icon-delete">删除</icon-button>
                                        </el-button>
                                    </div>
                                </td>
                                <td class="archives_que" v-else>
                                    <div class="btn-wrap">
                                        <el-button type="text" @click="cancel(scope.$index,scope.row)"
                                                   style="color: #808080;">
                                            取消
                                        </el-button>
                                    </div>
                                    <div class="btn-wrap1">
                                        <el-button type="text" @click="determine(scope.row,scope.$index)"
                                                   style="color: #FFA914;">
                                            确定
                                        </el-button>
                                    </div>
                                </td>
                            </tr>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="table_div" @click="table_new">
                    <span>+添加选项</span>
                </div>
            </div>
        </el-dialog>
        <!--删除弹窗-->
        <el-dialog
                :show-close="false"
                :modal="false"
                :visible.sync="deleVisible"
                size="tiny">
            <div class="dialog-content-wrap">
                <div>
                    <icon w="80" h="80" type="icon-gongdan-jiedianjingbao-da"></icon>
                    <p class="delete-tip">是否确定删除当前属性？</p>
                </div>
                <div class="handle-delete">
                    <nf-button @click="deleVisible = false">取 消</nf-button>
                    <nf-button type="warning" @click="delMaterialSpec(delItem,delIndex)">确 定</nf-button>
                </div>
            </div>
        </el-dialog>


    </div>

</template>

<script>
    import {
        listMaterialsKinds,//物料档案配置列表接口
        commonAttrstoreOptionsList,//某属性的选项列表
        addCommonAttrstoreOptions,//点击弹框里确定保存接口
        deleteCommonAttrstoreOptions,//删除点击弹框某属性
        updateCommonAttrstoreOptions//修改选项名称
    } from "@/api/material";

    export default {
        name: "archives-tabel",
        data() {
            return {
                title: '',
                deleVisible: false,//删除弹窗
                dialogForm1: false,//弹框显示与隐藏
                tableData2: [],//弹窗表格数据
                commonAttrstoreId: '',//当前点击编辑的属性id
                row: [],//当前编辑的数据
                index: '',// 删除某个属性的索引
                deleteId: '',//删除某条属性的id
            }
        },
        props: ["row_click", "commonAttrstoreId_click", "dialogForm", "title", 'falg', "material_index", "material_i"],
        created() {
            this.dialogForm1 = this.dialogForm//当前显示或隐藏的值
            this.row = this.row_click//当前编辑的列表数据
            this.commonAttrstoreId = this.commonAttrstoreId_click//当前编辑的id
            this.editor()

        },
        methods: {
            // 点击删除当前数据
            click_delete(index, id) {
                this.index = index//保存删除某条的索引
                this.deleteId = id//保存删除某条的id
                this.deleVisible = true
            },
            // 确定删除
            delMaterialSpec() {
                let params = {
                    userId: JSON.parse(sessionStorage.getItem("user_login")).userId,//用户id
                    id: this.deleteId,//删除某条的当前id
                };
                deleteCommonAttrstoreOptions(params).then(res => {
                    if (res.data.code === 0) {
                        this.deleVisible = false
                        this.tableData2.splice(this.index, 1);
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.$emit('addSuccessful')//删除成功重新渲染外面的数据
                    } else {
                        this.$message.error(res.data.msg);
                    }
                });
            },
            // 添加选项
            table_new() {
                if (this.tableData2.length > 0) {
                    if (this.tableData2[this.tableData2.length - 1].id == '') {
                        this.$message.error('请点击确定保存');
                        return;
                    }
                }
                let dataList = {
                    name: '',
                    isShow: false,
                    id: '',
                }
                if (this.tableData2.length >= 1) {
                    this.tableData2[this.tableData2.length - 1].isShow = true
                }
                this.tableData2.push(dataList)
            },
            // 编辑属性选项弹出
            editor() {
                if (this.falg != true) {
                    let params = {
                        userId: JSON.parse(sessionStorage.getItem("user_login")).userId,//用户id
                        commonAttrstoreId: this.commonAttrstoreId,//属性选项id
                    };
                    commonAttrstoreOptionsList(params).then(res => {
                        if (res.data.code === 0) {
                            if (res.data.commonAttrstoreOptionsList) {
                                for (let i = 0; i < res.data.commonAttrstoreOptionsList.length; i++) {
                                    res.data.commonAttrstoreOptionsList[i].isShow = true
                                }
                            }
                            this.tableData2 = res.data.commonAttrstoreOptionsList ? res.data.commonAttrstoreOptionsList : [];
                            this.$emit('addSuccessful')//添加成功重新渲染外面的数据
                        } else {
                            this.$message.error(res.data.msg);
                        }
                    });
                }
                // 物料档案编辑调接口
                else {
                    let params = {
                        userId: JSON.parse(sessionStorage.getItem("user_login")).userId,//用户id
                        pageNum: 0,
                        pageSize: 0,
                    };
                    listMaterialsKinds(params).then(res => {
                        console.log(this.material_index);
                        console.log(this.material_i);
                        var dataList = res.data.kindsList[this.material_index].commonMaterialsKindsAttrsList[this.material_i].commonAttrstoreOptionsList
                        if (dataList) {
                            for (let i = 0; i < dataList.length; i++) {
                                dataList[i].isShow = true
                            }
                        }
                        this.$emit('addSuccessful')//添加成功重新渲染外面的数据
                        this.tableData2 = dataList ? dataList : [];

                    });
                }

            },
            // 点击修改选项名称
            Modify(index) {
                this.tableData2[index].isShow = !this.tableData2[index].isShow
            },

            // 取消
            cancel(index, row) {
                if (!row.id) {
                    this.tableData2.splice(index, 1)
                } else {
                    this.tableData2[index].isShow = !this.tableData2[index].isShow
                }
            },
            // 确定保存
            determine(row, index) {
                if (row.name == '') {
                    this.$message.error('请填写选项名称');
                    return;
                }
                if (!row.id) {
                    let params = {
                        userId: JSON.parse(sessionStorage.getItem("user_login")).userId,//用户id
                        commonAttrstoreId: this.commonAttrstoreId,//属性选项id
                        name: row.name,//当前添加的名称
                    };
                    addCommonAttrstoreOptions(params).then(res => {
                        if (res.data.code === 0) {
                            this.$message({
                                message: '添加成功',
                                type: 'success'
                            });
                            this.tableData2[index].isShow = !this.tableData2[index].isShow
                            this.editor()
                        } else {
                            this.$message.error(res.data.msg);
                        }
                    });
                } else {
                    let params = {
                        userId: JSON.parse(sessionStorage.getItem("user_login")).userId,//用户id
                        commonAttrstoreId: this.commonAttrstoreId,//属性选项id
                        name: row.name,//当前添加的名称
                        id: row.id //当前选中的id
                    };
                    updateCommonAttrstoreOptions(params).then(res => {
                        if (res.data.code === 0) {
                            this.$message({
                                message: '修改成功',
                                type: 'success'
                            });
                            this.tableData2[index].isShow = !this.tableData2[index].isShow
                            this.editor()
                        } else {
                            this.$message.error(res.data.msg);
                        }
                    });
                }

            },
            //关闭通用弹窗
            closeSingleForm1() {
                this.dialogForm1 = false;
                this.$emit("isShow_click", false)
            },
        }
    }
</script>
<style lang="scss" scoped>
    .archives-table-table-list-list {
        .archives_td1 {
            font-size: 12px;
            display: inline-block;
            width: 122px;
            height: 32px;
            border: none;
            border-right: 1px solid rgb(223, 228, 236);
        }
        .archives_td2 {
            width: 61px;
            height: 32px;
            font-size: 12px;
            display: inline-block;
            border: none;
        }
        .archives_que {
            border: none;
            width: 191px;
            height: 32px;
            > div {
                display: inline-block;
            }
            .btn-wrap {
                padding-left: 48px;
                .el-button {
                    > span {
                        color: #808080;
                    }
                }

            }
            .btn-wrap1 {
                padding-left: 44px;
                .el-button {
                    > span {
                        color: #FFA914;
                    }
                }

            }
        }
    }
</style>
<style lang="scss">
    .archives-table-table-list-list {
        .el-dialog--small {
            width: 400px;
        }
        .el-dialog__header {
            height: 40px;
            padding: 0;
            line-height: 40px;
            text-align: center;
        }
        .el-dialog__body {
            font-size: 12px;
            padding: 0 24px;
        }
        .isTable {
            margin-bottom: 24px;
            .el-table td .cell {
                padding: 0;
            }
            .el-table td .cell .isDiv {
                padding-left: 10px;
                overflow: hidden;
                overflow: auto;
            }
            .el-table td .cell .isDiv1 {
                padding-left: 0;
                .el-input__inner {
                    border: 1px solid #ffa914;
                }
            }
            .el-button {
                padding: 0;
                > span {
                    font-size: 12px;
                }
            }
            .btn-wrap {
                height: 32px;
                line-height: 32px;
                padding-left: 10px;
            }
            .table_div {
                text-align: left;
                height: 32px;
                line-height: 32px;
                padding-left: 10px;
                cursor: pointer;
                border-bottom: 1px solid rgba(230, 234, 240, 1);
                border-left: 1px solid rgba(230, 234, 240, 1);
                border-right: 1px solid rgba(230, 234, 240, 1);
                > span {
                    color: #FFA914;
                }
            }
            .table_div:hover {
                background: rgba(247, 249, 252, 1);
            }
            .el-table__body-wrapper {
                overflow: none;
                overflow-y: overlay;
            }
            .el-table tr {
                text-align: left;
            }
            .el-input {
                font-size: 12px;
            }
        }
        .el-dialog__footer {
            border-top: 1px solid rgba(230, 234, 240, 1);
            padding: 0;
            padding: 24px 16px;
        }
        .el-dialog__body {
            text-align: center;
            p {
                font-size: 16px;
                line-height: 60px;
            }
            .handle-delete {
                margin-bottom: 40px;
            }
        }
        .el-button, .el-textarea__inner {
            font-size: 12px;
        }

        .el-dialog__headerbtn {
            line-height: 40px;
            margin-right: 15px;
        }
        .el-dialog__wrapper {
            background-color: rgba(0, 0, 0, 0.5);
        }
        .el-table__row:hover td {
            background-color: #f7f9fc;
        }
    }


</style>