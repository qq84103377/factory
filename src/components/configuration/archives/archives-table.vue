<template>
    <div class="archives-table-table-list">
        <el-table
                :data="tableData1"
                border
                style="width: 100%">
            <!--属性名称-->
            <el-table-column
                    prop="name"
                    label="属性名称"
                    width="180">
                <template slot-scope="scope">
                    <div>
                        <span>{{scope.row.name}}</span>
                    </div>
                </template>
            </el-table-column>
            <!--属性类型-->
            <el-table-column
                    prop="type"
                    label="属性类型"
                    width="180">
                <template slot-scope="scope">
                    <div>
                        <span>{{scope.row.type}}</span>
                    </div>
                </template>
            </el-table-column>
            <!--备注信息-->
            <el-table-column
                    prop="remark"
                    label="备注信息">
                <template slot-scope="scope">
                    <div>
                        <span>{{scope.row.remark}}</span>
                    </div>
                </template>

            </el-table-column>
            <!--属性选项-->
            <el-table-column
                    prop="address"
                    label="属性选项">
                <template slot-scope="scope">
                    <div>
                        <span v-for="(item,index) in scope.row.commonAttrstoreOptionsList"
                              v-model="item.id"><i v-if="index != 0">、</i>{{item.name}}</span>
                    </div>
                </template>
            </el-table-column>
            <!--是否必填-->
            <el-table-column
                    prop="mandatory"
                    label="是否必填"
                    width="80">
                <template slot-scope="scope">
                    <div class="switch">
                        <el-switch v-model="scope.row.mandatory" on-text="" off-text=""
                                   @change="switchClick(scope.row,scope.$index)"></el-switch>
                    </div>
                </template>
            </el-table-column>
            <!--使用到的模块-->
            <el-table-column
                    prop="moduleName"
                    label="使用到的模块">
                <template slot-scope="scope">
                    <div>
                        <span>{{scope.row.moduleName}}</span>
                    </div>
                </template>
            </el-table-column>
            <!--操作-->
            <el-table-column
                    prop="address"
                    label="操作">
                <template slot-scope="scope">
                    <div class="btn-wrap">
                        <el-button type="text" @click="editor(scope.row,scope.row.name)"
                                   v-if="scope.row.type !== '单行文本' && scope.row.type !== '单行数值'">
                            <icon type="icon-edit"></icon>
                            编辑属性选项
                        </el-button>
                        <el-button type="text" v-else>
                            -
                        </el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <!--编辑属性选项-->
        <attributelist v-if="isShow_click" :row_click="row" :commonAttrstoreId_click='commonAttrstoreId'
                       :dialogForm="isShow_click" @isShow_click="isShowClick" @addSuccessful="addSuccessful"
                       :title="title"></attributelist>
    </div>
</template>
<script>
    import {
        attributeList,//属性列表接口
        updateCommonAttrstoreMandatory,//属性是否必填接口
    } from "@/api/material";
    import attributelist from './attribute-list';
    export default {
        name: "archives-tabel",
        data() {
            return {
                isShow_click: false,//显示与隐藏弹框
                tableData1: [],//列表表格数据
                commonAttrstoreId: '',//当前点击编辑的属性id
                row: [],//当前编辑的数据
                title: '',//当前点击的属性名称
            }
        },
        props: ["input"],
        watch: {
            input() {
                this.attributeList()
            }
        },
        components: {
            attributelist,
        },
        created() {
            this.attributeList()
        },
        methods: {
            // 添加成功重新渲染
            addSuccessful() {
                this.attributeList();
            },
            // 关闭弹窗接收
            isShowClick(val) {
                this.isShow_click = val
            },
            // 切换是否必填
            switchClick(row, index) {
                let params = {
                    userId: JSON.parse(sessionStorage.getItem("user_login")).userId,//用户id
                    id: row.id,//当前id
                    mandatory: row.mandatory == false ? 0 : 1//当前开关状态
                };
                updateCommonAttrstoreMandatory(params).then(res => {
                    if (res.data.code === 0) {
                        if (row.mandatory == true) {
                            this.$message({
                                message: '开启成功',
                                type: 'success'
                            });
                        } else {
                            this.$message({
                                message: '关闭成功',
                                type: 'success'
                            });
                        }
                    } else {
                        this.$message.error(res.data.msg);
                    }
                });
            },
            // 属性库列表数据
            attributeList() {
                let params = {
                    userId: JSON.parse(sessionStorage.getItem("user_login")).userId,//用户id
                    keyword: this.input ? this.input : '',//输入的关键字
                    showCustomField:false // 是否加上自定义属性字段
                };
                attributeList(params).then(res => {
                    if (res.data.code === 0) {
                        for (let i = 0; i < res.data.commonAttrstoreList.length; i++) {
                            if (res.data.commonAttrstoreList[i].type == 1) {
                                res.data.commonAttrstoreList[i].type = "多选菜单"
                            } else if (res.data.commonAttrstoreList[i].type == 2) {
                                res.data.commonAttrstoreList[i].type = "单选菜单"
                            } else if (res.data.commonAttrstoreList[i].type == 3) {
                                res.data.commonAttrstoreList[i].type = "单行文本"
                            } else if (res.data.commonAttrstoreList[i].type == 4) {
                                res.data.commonAttrstoreList[i].type = "单行数值"
                            }
                            if (res.data.commonAttrstoreList[i].mandatory == 0) {
                                res.data.commonAttrstoreList[i].mandatory = false
                            } else if (res.data.commonAttrstoreList[i].mandatory == 1) {
                                res.data.commonAttrstoreList[i].mandatory = true
                            }
                        }
                        this.tableData1 = res.data.commonAttrstoreList
                    } else {
                        this.$message.error(res.data.msg);
                    }
                });
            },
            // 编辑属性选项弹出
            editor(row, name) {
                this.title = name
                this.isShow_click = true
                this.row = row
                this.commonAttrstoreId = row.id//保存当前编辑的id
            },
        }
    }
</script>

<style lang="scss" scoped>
    .archives-table-table-list {
        .switch {
            text-align: center;
        }
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
    .archives-table-table-list {
        .el-switch__core {
            border-color: #C4C6CC;
            background-color: #C4C6CC;
        }
        .el-switch.is-checked .el-switch__core {
            border-color: #FFA914;
            background-color: #FFA914;
        }
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

    }


</style>