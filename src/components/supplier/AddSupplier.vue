<template>
    <div class="addSupplier">
        <div class="supplier-header">
            <div class="supplier-title">
                <div class="title-block">
                    <span>供应商管理</span>
                </div>

                <div class="title-btns">
                    <button @click="addsupplier(false)">取消</button>
                    <button @click="addsupplier(true)">确定</button>
                </div>
            </div>
        </div>
        <div class="supplier-content">
            <p>基本信息</p>
            <div class="supplier-info">
                <div class="input-info">
                    <span class="start pos">*</span>供应商姓名 <input type="text" v-model="supplier.name">
                </div>

                <div class="input-info">
                    手机号码<input type="text" v-model="supplier.phone">
                </div>

                <div class="supplierAddr">
                    供应商地址 <input type="text" v-model="supplier.addr" placeholder="请输入地址信息">
                </div>

                <div class="remark">
                    <span>备&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注</span>
                    <textarea v-model="supplier.remark" placeholder="请输入备注信息" cols=50  rows=4></textarea>
                </div>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import {checkFacSupplierName, addFacSupplier} from '../../api/api'

    export default {
        data() {
            return {
                // 数据
                supplier: {
                    name: '',
                    addr: '',
                    remark: '',
                    phone: ''
                }
            }
        },
        computed: {
            // 计算属性

        },
        methods: {
            // 方法
            addsupplier(type) {
                var _this = this
                if (type) {
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
                            "name": _this.supplier.name
                        }
                        checkFacSupplierName(params).then(res => {
                            //console.log(res, '查重结果');
                            if (res.data.code == 4) {
                                let params = {
                                    "token": '',
                                    "facId": JSON.parse(sessionStorage.getItem('last_login')).id,
                                    "name": _this.supplier.name || '',
                                    "supplierId": '',
                                    "address": _this.supplier.addr || '',
                                    "phone": _this.supplier.phone || '',
                                    "remark": _this.supplier.remark || ''
                                }
                                //console.log(params, '-----');

                                addFacSupplier(params).then(function (res) {
                                    //console.log(res, '创建状态!!!');
                                    _this.$message({
                                        showClose: true,
                                        message: res.data.msg,
                                        type: "success",
                                        duration: this.$globalConfig.elementUI.duration
                                    });

                                    _this.$router.go(-1)
                                })
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
                else {
                    _this.$message({
                        showClose: true,
                        message: '已取消',
                        type: "warning",
                        duration: this.$globalConfig.elementUI.duration
                    });
                    this.$router.go(-1)

                }

            }
        },
        created: function () {
            // 生命周期实例化钩子函数
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

    .addSupplier {
        height: 100%;
        padding-left: 47px;
        padding-right: 47px;
        background-color: #fff;
        .supplier-header {
            line-height: 60px;
            border-bottom: 2px solid #ececec;
            .supplier-title {
                display: flex;
                justify-content: space-between;
                min-width: 700px;
                .title-block {
                    font-size: 16px;
                    color: #2c2c2c;
                    border-bottom: 2px solid #000;
                    position: relative;
                    top: 2px;
                }
                .title-btns {
                    button {
                        display: inline-block;
                        width: 64px;
                        height: 30px;
                        border-radius: 100px;
                        background-color: #ff8d37;
                        font-size: 14px;
                        color: #fff;
                        &:first-child {
                            background-color: #fff;
                            border: 1px solid $color-btn;
                            color: $color-btn;
                        }
                    }
                }
            }
        }
        .supplier-content {
            margin-top: 40px;
            p {
                font-family: MicrosoftYaHei;
                font-size: 22px;
                color: #2c2c2c;
            }
            .supplier-info {
                margin-top: 30px;
                .input-info {
                    display: inline-block;
                    margin-right: 50px;
                    position: relative;
                    .pos {
                        position: absolute;
                        left: -8px;
                        top: 2px;
                    }
                    input {
                        padding-left: 5px;
                        margin-left: 5px;
                        width: 180px;
                        height: 36px;
                        border: 1px solid #d5d5d5;
                        border-radius: 4px;
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
                        border: solid 1px #d5d5d5;
                    }
                    textarea {
                        height: 66px;
                        width: 483px;
                        resize:none;
                        outline: none;
                    }
                }
                .remark{
                    display: flex;
                    align-items: center;
                    span{
                        margin-right: 5px;
                    }
                }
            }
        }
    }
</style>