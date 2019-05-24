<!--供应商详情-->
<template>
    <div class="supplier-detaile">
        <div class="supplier-header">
            <div class="supplier-title">
                <p>供应商管理</p>
                <span class="back" @click="back()">< 返回列表</span>
            </div>
        </div>
        <div class="supplier-content">
            <div class="title-btns">
                <p class="base-info">基本信息</p>
                <div>
                    <span v-show="isEdit" @click="manageSupplier('remove')">删除供应商</span>
                    <button v-show="isEdit" @click="manageSupplier()">取消</button>
                    <button v-show="isEdit" @click="manageSupplier('update')">完成</button>
                    <button v-show="!isEdit" @click="isEdit = true">编辑</button>
                </div>

            </div>
            <div class="supplier-info">
                <div class="input-info">
                    <span class="start pos">*</span>客户姓名 <input :disabled="!isEdit" :class="{'only-read':isEdit}"
                                                                type="text" v-model="supplier.name">
                </div>

                <div class="input-info">
                    手机号码<input :disabled="!isEdit" :class="{'only-read':isEdit}" type="text" v-model="supplier.phone">
                </div>

                <div class="supplierAddr">
                    客户地址 <input :disabled="!isEdit" type="text" :class="{'only-read':isEdit}" v-model="supplier.address"
                                placeholder="无">
                </div>

                <div class="remark">
                    <span>备&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注</span>
                    <textarea :disabled="!isEdit" :class="{'only-read':isEdit}" v-model="supplier.remark"
                              placeholder="无" cols=50             rows=4></textarea>
                </div>
            </div>
        </div>
        <el-row>
            <el-col class="material" :span="24">供应物料</el-col>
            <el-col class="lining" :span="24">面料</el-col>
            <el-col class="panel">
                <el-collapse accordion>
                    <el-collapse-item>
                        <template slot="title">
                            ML001 | 涤纶布
                        </template>

                        <template>

                        </template>
                    </el-collapse-item>
                </el-collapse>
            </el-col>
            <el-col class="panel">
                <el-collapse accordion>
                    <el-collapse-item>
                        <template slot="title">
                            ML001 | 涤纶布
                        </template>

                        <template>
                            <el-table
                                    :data="tableData"
                                    border
                                    style="width: 100%"
                                    :default-sort = "{prop: 'date', order: 'descending'}"
                            >
                                <el-table-column
                                        prop="date"
                                        label="日期"
                                        sortable
                                        width="180">
                                </el-table-column>
                                <el-table-column
                                        prop="name"
                                        label="姓名"
                                        sortable
                                        width="180">
                                </el-table-column>
                                <el-table-column
                                        prop="address"
                                        label="地址">
                                </el-table-column>
                            </el-table>
                        </template>
                    </el-collapse-item>
                </el-collapse>
            </el-col>
            <el-col class="panel">
                <el-collapse accordion>
                    <el-collapse-item>
                        <template slot="title">
                            ML001 | 涤纶布
                        </template>

                        <template>
                            <el-table
                                    :data="tableData"
                                    border
                                    style="width: 100%"
                                    :default-sort = "{prop: 'date', order: 'descending'}"
                            >
                                <el-table-column
                                        prop="date"
                                        label="日期"
                                        sortable
                                        width="180">
                                </el-table-column>
                                <el-table-column
                                        prop="name"
                                        label="姓名"
                                        sortable
                                        width="180">
                                </el-table-column>
                                <el-table-column
                                        prop="address"
                                        label="地址">
                                </el-table-column>
                            </el-table>
                        </template>
                    </el-collapse-item>
                </el-collapse>
            </el-col>


            <el-col class="lining" :span="24">辅料</el-col>
            <el-col class="panel">
                <el-collapse accordion>
                    <el-collapse-item>
                        <template slot="title">
                            ML001 | 涤纶布
                        </template>

                        <template>
                            <el-table
                                    :data="tableData"
                                    border
                                    style="width: 100%"
                                    :default-sort = "{prop: 'date', order: 'descending'}"
                            >
                                <el-table-column
                                        prop="date"
                                        label="日期"
                                        sortable
                                        width="180">
                                </el-table-column>
                                <el-table-column
                                        prop="name"
                                        label="姓名"
                                        sortable
                                        width="180">
                                </el-table-column>
                                <el-table-column
                                        prop="address"
                                        label="地址">
                                </el-table-column>
                            </el-table>
                        </template>
                    </el-collapse-item>
                </el-collapse>
            </el-col>
            <el-col class="panel">
                <el-collapse accordion>
                    <el-collapse-item>
                        <template slot="title">
                            ML001 | 涤纶布
                        </template>

                        <template>
                            <el-table
                                    :data="tableData"
                                    border
                                    style="width: 100%"
                                    :default-sort = "{prop: 'date', order: 'descending'}"
                            >
                                <el-table-column
                                        prop="date"
                                        label="日期"
                                        sortable
                                        width="180">
                                </el-table-column>
                                <el-table-column
                                        prop="name"
                                        label="姓名"
                                        sortable
                                        width="180">
                                </el-table-column>
                                <el-table-column
                                        prop="address"
                                        label="地址">
                                </el-table-column>
                            </el-table>
                        </template>
                    </el-collapse-item>
                </el-collapse>
            </el-col>
            <el-col class="panel">
                <el-collapse accordion>
                    <el-collapse-item>
                        <template slot="title">
                            ML001 | 涤纶布
                        </template>

                        <template>
                            <el-table
                                    :data="tableData"
                                    border
                                    style="width: 100%"
                                    :default-sort = "{prop: 'date', order: 'descending'}"
                            >
                                <el-table-column
                                        prop="date"
                                        label="日期"
                                        sortable
                                        width="180">
                                </el-table-column>
                                <el-table-column
                                        prop="name"
                                        label="姓名"
                                        sortable
                                        width="180">
                                </el-table-column>
                                <el-table-column
                                        prop="address"
                                        label="地址">
                                </el-table-column>
                            </el-table>
                        </template>
                    </el-collapse-item>
                </el-collapse>
            </el-col>
        </el-row>
    </div>
</template>

<script type="text/ecmascript-6">
    import {deleteFacSupplier, updateFacSupplier} from '../../api/api'

    export default {
        data() {
            return {
                // 数据
                supplier: {
                    name: '获取中...',
                    address: '',
                    remark: '获取中...',
                    phone: ''
                },
                isEdit: false,
                tableData:[]

            }
        },
        computed: {
            // 计算属性

        },
        methods: {
            // 方法
            back() {
                this.$router.go(-1)
            },
            manageSupplier(type) {
                var _this = this
                //更新供应商信息
                if (type == "update") {
                    if (_this.supplier.name) {
                        var reg = /^1(3|4|5|8)[0-9]{9}$/
                        if (_this.supplier.phone) {
                            if (!reg.test(_this.supplier.phone)) {
                                return _this.$message({
                                    showClose: true,
                                    message: '请填写正确的手机号',
                                    type: "error",
                                    duration: this.$globalConfig.elementUI.duration
                                });
                            }
                        }
                        //添加客户 , 先查重
                        let params = {
                            "token": "",
                            "facId": JSON.parse(sessionStorage.getItem('last_login')).id,
                            "supplierId": JSON.parse(sessionStorage.getItem('supplierInfo')).id,
                            "name": _this.supplier.name || '',
                            "address": _this.supplier.address || '',
                            "phone": _this.supplier.phone || '',
                            "remark":_this.supplier.remark||'默认没有备注',
                        }
                        updateFacSupplier(params).then(res => {
                            if (res.data.code == 0) {
                                _this.$message({
                                    showClose: true,
                                    message: res.data.msg,
                                    type: "success",
                                    duration: this.$globalConfig.elementUI.duration
                                });
                                this.$router.go(-1)

                            } else {
                                _this.$message({
                                    showClose: true,
                                    message: res.data.msg,
                                    type: "error",
                                    duration: this.$globalConfig.elementUI.duration
                                });
                            }
                        })

                    } else {
                        _this.$message({
                            showClose: true,
                            message: '必须输入姓名',
                            type: "error",
                            duration: this.$globalConfig.elementUI.duration
                        });
                    }
                }
                //删除供应商信息
                else if (type == "remove") {
                    this.$confirm('您确认要删除吗?', '删除供应商', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'error'
                    }).then(() => {
                        let params = {
                            "facId": JSON.parse(sessionStorage.getItem('last_login')).id,
                            "supplierId": JSON.parse(sessionStorage.getItem('supplierInfo')).id,
                            "token": ""
                        }
                        deleteFacSupplier(params).then(res => {
                            if (res.data.code == 0) {
                                _this.$message({
                                    showClose: true,
                                    message: res.data.msg,
                                    type: "success",
                                    duration: this.$globalConfig.elementUI.duration
                                });
                                this.$router.go(-1)

                            }
                        })
                    }).catch(() => {
                        this.$message({
                            showClose: true,
                            message: '已取消!',
                            type: "warning",
                            duration: this.$globalConfig.elementUI.duration
                        });
                        this.$router.go(-1)

                    });
                }
                else {
                    this.$message({
                        showClose: true,
                        message: '已取消!',
                        type: "warning",
                        duration: this.$globalConfig.elementUI.duration
                    });
                    this.$router.go(-1)

                }

            },
            getSupplierInfo() {
                var _this = this;
                _this.supplier = JSON.parse(sessionStorage.getItem('supplierInfo'))
            }
        },
        created: function () {
            // 生命周期实例化钩子函数
            this.getSupplierInfo()
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

    .supplier-detaile {
        height: auto;
        padding-bottom: 47px;
        padding-left: 47px;
        padding-right: 47px;
        background-color: #fff;

        .supplier-header {
            line-height: 60px;
            border-bottom: 2px solid #ececec;
            .supplier-title {
                display: flex;
                align-items: center;
                justify-content: space-between;
                font-family: MicrosoftYaHei;
                font-size: 16px;
                color: #2c2c2c;
                p {
                    border-bottom: 2px solid #2c2c2c;
                    position: relative;
                    top: 2px;
                }
                .back {
                    cursor: pointer;
                    display: inline-block;
                    text-align: center;
                    width: 94px;
                    height: 30px;
                    line-height: 30px;
                    border-radius: 100px;
                    border: solid 1px $color-btn;
                    font-size: 12px;
                    color: $color-btn;
                }

            }
        }
        .supplier-content {
            margin-top: 40px;

            .title-btns {
                display: flex;
                justify-content: space-between;
                .base-info {
                    font-family: MicrosoftYaHei;
                    font-size: 22px;
                    color: #2c2c2c;
                }
                span {
                    color: $color-btn;
                    margin-right: 20px;
                    cursor: pointer;
                }
                button {
                    display: inline-block;
                    width: 64px;
                    height: 30px;
                    border-radius: 100px;
                    background-color: #ff8d37;
                    font-size: 14px;
                    color: #fff;
                    &:nth-child(2) {
                        background-color: #fff !important;
                        border: 1px solid $color-btn;
                        color: $color-btn;
                    }
                }
            }
            .supplier-info {
                margin-top: 30px;
                .only-read {
                    border: 1px solid #d5d5d5 !important;
                }
                .input-info {
                    display: inline-block;
                    margin-right: 50px;
                    position: relative;
                    .pos {
                        position: absolute;
                        left: -8px;
                        top: 14px;
                    }
                    input {
                        padding-left: 5px;
                        margin-left: 5px;
                        width: 180px;
                        height: 36px;
                        border-bottom: 1px solid #979797;
                        border-radius: 4px;
                        border: none;
                    }
                }
                .supplierAddr, .remark {
                    margin-top: 28px;
                    input, textarea {
                        padding-left: 5px;
                        margin-left: 5px;
                        width: 483px;
                        height: 36px;
                        border-radius: 4px;
                        border: none;
                    }
                    textarea {
                        height: 66px;
                        width: 483px;
                        resize: none;
                        outline: none;
                        border:none;
                    }
                }
                .remark {
                    display: flex;
                    align-items: baseline;
                    span {
                        margin-right: 5px;
                    }
                }
            }
        }
        .el-row {
            margin-top: 60px;
            color: #2c2c2c;
            font-family: MicrosoftYaHei;
            .material {
                font-size: 22px;
            }
            .lining{
                padding-left: 10px;
                margin-top: 20px;
                font-size: 20px;
            }
            .panel{
                margin-top: 20px;
            }
        }
    }
</style>
