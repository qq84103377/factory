<template>
    <div class="attribute-Popup-dialog">
        <el-dialog :visible.sync="dialogForm1" @close="closeSingleForm1()" :show-close="false" :title="title">
            <div class="attribute-Popup-dialog-body">
                <div class="attribute-Popup-dialog-body-top">
                    <span>分类号</span>
                    <el-input v-model="no" placeholder="请输入分类号"></el-input>
                </div>
                <div class="attribute-Popup-dialog-body-bottom">
                    <span>分类名称</span>
                    <el-input v-model="name" placeholder="请输入分类名称"></el-input>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeSingleForm1('ruleForm')">取 消</el-button>
                <el-button type="primary" @click="singleChange()">确 定</el-button>
            </div>
        </el-dialog>
    </div>

</template>

<script>
    import {
        addOrUpdateMaterialsKinds,//物料新增和修改
    } from "@/api/material";

    export default {
        name: "attribute-Popup",
        data() {
            return {
                dialogForm1: true,
                no: '',//物料分类号
                name: '',//物料分类名称
                id: '',//当前修改或新增id
            }
        },
        props: ["title", "id", "no", "name"],
        created() {
            this.no = this.no
            this.name = this.name
        },
        methods: {
            //关闭通用弹窗
            closeSingleForm1() {
                this.no = ""
                this.name = ""
                this.dialogForm1 = false
                this.$emit('cancel', false)
            },
            // 点击确定新增物料分类
            singleChange() {
                if (this.id) {
                    let params = {
                        userId: JSON.parse(sessionStorage.getItem("user_login")).userId,//用户id
                        no: this.no,//物料分类号
                        name: this.name,//物料分类名称
                        id: this.id,
                    };
                    addOrUpdateMaterialsKinds(params).then(res => {
                        if (res.data.code == 0) {
                            this.$message({
                                message: '修改成功',
                                type: 'success'
                            });
                            this.closeSingleForm1()
                        } else {
                            this.$message.error(res.data.msg);
                        }
                    });
                } else {
                    let params = {
                        userId: JSON.parse(sessionStorage.getItem("user_login")).userId,//用户id
                        no: this.no,//物料分类号
                        name: this.name,//物料分类名称
                    };
                    addOrUpdateMaterialsKinds(params).then(res => {
                        if (res.data.code == 0) {
                            this.$message({
                                message: '新增成功',
                                type: 'success'
                            });
                            this.closeSingleForm1()
                        } else {
                            this.$message.error(res.data.msg);
                        }
                    });
                }

            },
        },
    }
</script>

<style lang="scss" scoped>
    .attribute-Popup-dialog {

    }
</style>
<style lang="scss">
    .attribute-Popup-dialog {
        .el-dialog--small {
            width: 400px;
        }
        .el-dialog__header {
            padding: 0;
            height: 40px;
            font-size: 16px;
            color: #3B3B3B;
            line-height: 40px;
            text-align: center;
            border-bottom: 1px solid rgba(230, 234, 240, 1);
        }
        .el-dialog__body {
            padding: 0;
            padding-top: 24px;
            padding-bottom: 24px;
            padding-right: 61px;
            height: 80px;
            border-bottom: 1px solid rgba(230, 234, 240, 1);
        }
        .el-dialog__footer {
            padding: 0;
            height: 64px;
            padding: 16px 132px;
            .dialog-footer {
                display: block;
                .el-button {
                    padding: 0;
                    width: 64px;
                    height: 32px;
                }
                .el-button + .el-button {
                    margin: 0;
                }
                .el-button--default {
                    float: left;
                }
                .el-button--primary {
                    float: right;
                    background-color: #FFA914;
                }
            }
        }
        .attribute-Popup-dialog-body {
            .attribute-Popup-dialog-body-top {
                height: 32px;
                padding-bottom: 16px;
                line-height: 32px;
                padding-left: 65px;
            }
            .attribute-Popup-dialog-body-bottom {
                height: 32px;
                padding-bottom: 16px;
                line-height: 32px;
                padding-left: 53px;
            }
            .el-input {
                width: 220px;
                height: 32px;
                float: right;
                .el-input__inner {
                    height: 32px;
                    border-radius: 2px;
                }
            }
        }
    }
</style>