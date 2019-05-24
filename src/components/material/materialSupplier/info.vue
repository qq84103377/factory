<template>
    <div class="supplier-info">
        <header class="header_line">
            <div class="header_right">
                <span>供应商信息</span>
            </div>
            <div class="header_left">
                <nf-button class="go-back" @click="goBackClick">
                    <i class="icon-left el-icon-arrow-left"></i>返回上级
                </nf-button>
            </div>
        </header>
        <div class="content box-shadow">
            <div class="table-wrap">
                <div class="yellow-border-title mgb20">
                    <h1 class="title">基本信息</h1>
                    <nf-button svg="icon-edit1" style="width: 98px;height: 36px;padding: 0;" @click="editSupplierClick">
                        编辑
                    </nf-button>
                </div>
                <div class="main-table">
                    <el-form :model="ruleForm" label-width="100px">
                        <el-row>
                            <el-col :span="10">
                                <el-form-item label="供应商名称">
                                    <span>{{ supplierMes.name }}</span>
                                </el-form-item>
                            </el-col>
                            <el-col :span="14">
                                <el-form-item label="联系人">
                                    <span>{{ supplierMes.contacts}}</span>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="10">
                                <el-form-item label="供应商编号">
                                    <span>{{ supplierMes.code }}</span>
                                </el-form-item>
                            </el-col>
                            <el-col :span="14">
                                <el-form-item label="联系电话">
                                    <span>{{ supplierMes.mobilePhone }}</span>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="10">
                                <el-form-item label="开户行">
                                    <span>{{ supplierMes.bankName }}</span>
                                </el-form-item>
                            </el-col>
                            <el-col :span="14">
                                <el-form-item label="银行账户">
                                    <span>{{ supplierMes.bankAccount }}</span>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="10">
                                <el-form-item label="所属地区">
                                    <span>{{ detailedAddress }}</span>
                                </el-form-item>
                            </el-col>
                            <el-col :span="14">
                                <el-form-item label="详细地址">
                                    <span>{{ supplierMes.address }}</span>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24">
                                <el-form-item label="备注信息">
                                    <span>{{ supplierMes.remark }}</span>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </div>
            </div>
        </div>
        <div class="del-btn" @click="handleDel">删除供应商</div>

        <!--新增和编辑供应商，通用组件-->
        <transition name="right-move">
            <add v-if="addSupplierShow" type="edit" :supplierId="supplierId" @hiddenWindow="cancelAdd"
                 @hideCover="cancelAdd" @update="getSupData"></add>
        </transition>
        <transition name="opcity">
            <div class="cover" v-if="addSupplierShow" @click="cancelAdd">
            </div>
        </transition>

        <!--删除供应商弹窗-->
        <el-dialog class="repertory_dialog repertory_dialog--dele" :visible.sync="deleteFac" modal="false">
            <div class="body">
                <icon w="80" h="80" type="icon-gongdan-jiedianjingbao-da"></icon>
                <p style="color:#3b3b3b;font-size:16px;">是否确定删除当前供应商？</p>
                <p style="color:#a2abb8;font-size:14px;">删除后数据不可恢复</p>
            </div>
            <div class="footer">
                <nf-button @click="cancelDell()">取消</nf-button>
                <nf-button type="warning" @click="deleteSupMes" :loading="isloading">确定</nf-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {
        materialSupInfo,
        deleteMaterialSup,
        beforeDeleteSup
    } from "@/api";
    import add from './add';

    export default {
        name: "info.vue",
        components: {
            add
        },
        data() {
            return {
                deleteFac: false,       //dialog弹窗
                addSupplierShow: false, //侧滑栏
                supplierId: '',          //供应商id
                supplierMes: {},         //供应商数据
                title: '编辑物料供应商',
                factoryId: '',           //工厂id
                isloading: false        //防止多次点击
            }
        },
        computed: {
            //拼接所属地区
            detailedAddress() {
                let address = '';
                if (this.supplierMes.provinceName && this.supplierMes.cityName && this.supplierMes.areaName) {
                    address = this.supplierMes.provinceName + ' / ' + this.supplierMes.cityName + ' / ' + this.supplierMes.areaName;
                }
                return address;
            }
        },
        methods: {
            //编辑供应商信息
            editSupplierClick() {
                var datalist = JSON.parse(sessionStorage.getItem("user_login"))
                    .permissionList;
                if (datalist.indexOf("fac.supplier.edit") == -1) {
                    this.$message.error("抱歉，您没有操作权限");
                    return;
                }
                this.addSupplierShow = true;
            },
            //删除供应商按钮
            handleDel() {
                var datalist = JSON.parse(sessionStorage.getItem("user_login"))
                    .permissionList;
                if (datalist.indexOf("fac.supplier.delete") == -1) {
                    this.$message.error("抱歉，您没有操作权限");
                    return;
                }
                let params = {
                    supplierId: this.supplierId
                };
                beforeDeleteSup(params).then(res => {
                    if(res.data.code === 0){
                        this.deleteFac = true;
                    }else{
                        //失败提示
                        this.$message.error(res.data.msg);
                    }
                });
            },
            //取消删除供应商
            cancelDell() {
                this.deleteFac = false;
            },
            //确认删除供应商
            deleteSupMes() {
                this.isloading = true;
                let params = {
                    factoryId: this.factoryId,
                    id: this.supplierId
                };
                deleteMaterialSup(params).then(res => {
                    if(res.data.code === 0){
                        this.$router.push("/materialSupplier");
                    }else{
                        //失败提示
                        this.$message.error(res.data.msg);
                    }
                    this.isloading = false;
                });
            },
            //关闭侧滑
            cancelAdd() {
                this.addSupplierShow = false;
            },
            //返回上一层
            goBackClick() {
                this.$router.push("/materialSupplier");
            },
            //获取供应商信息
            getSupData() {
                const supplierId = this.supplierId;
                let params = {
                    id: supplierId
                };
                materialSupInfo(params).then(res => {
                    if(res.data.code === 0){
                        this.supplierMes = res.data.data;
                    }else{
                        //失败提示
                        this.$message.error(res.data.msg);
                    }
                });
            }
        },
        created() {
            this.factoryId = JSON.parse(sessionStorage.getItem("last_login")).id;
            this.supplierId = this.$route.params.id;
            this.getSupData();
        }
    }
</script>

<style lang="scss" scoped>
    .supplier-info {
        display: -ms-flexbox;
        display: flex;
        width: 100%;
        height: 100%;
        -ms-flex-direction: column;
        flex-direction: column;
        overflow: hidden;
        .header_line {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
            height: 68px;
            .header_right {
                font-size: 24px;
            }
        }
        .content {
            padding: 32px;
            background-color: #fff;
            .yellow-border-title {
                display: -ms-flexbox;
                display: flex;
                -ms-flex-align: center;
                align-items: center;
                -ms-flex-pack: justify;
                justify-content: space-between;
                .title {
                    border-left: 6px solid #ffa914;
                    line-height: 20px;
                    font-size: 20px;
                    padding-left: 12px;
                    font-weight: normal;
                }
            }
            .main-table {
                width: 1000px;
                .el-form-item {
                    margin-bottom: 0;
                }
            }
        }
        .del-btn {
            width: 98px;
            line-height: 40px;
            margin-top: 15px;
            text-align: center;
            color: #fa4150;
            background-color: #fff;
            cursor: pointer;
        }
        .repertory_dialog {
            .el-dialog__header {
                display: none;
            }
            .el-dialog__body {
                padding: 0;
            }
            .title {
                width: 100%;
                height: 52px;
                text-align: center;
                line-height: 52px;
                font-size: 20px;
                color: #3b3b3b;
                border-bottom: 1px solid #e0e6ed;
            }
            .footer {
                padding: 0 32px 32px 36px;
                button {
                    margin: 0 6px;
                }
            }
        }
        .repertory_dialog--dele {
            .el-dialog {
                width: 766px;
            }
            .body {
                text-align: center;
                P {
                    margin: 32px 0;
                    font-size: 14px;
                    color: #3b3b3b;
                }
            }
            .footer {
                display: flex;
                justify-content: center;
                padding-top: 28px;
                border-top: 1px solid #e0e6ed;
            }
        }
    }
</style>
<style lang="scss">
    .repertory_dialog .el-dialog--small {
        width: 420px;
    }

    .right-move-enter-active,
    .right-move-leave-active {
        transition: all 0.3s ease;
        transform: translateX(0);
    }

    .right-move-enter,
    .right-move-leave-to {
        transform: translateX(100%);
    }

    .opcity-enter-active,
    .opcity-leave-active {
        transition: all 0.5s ease;
        opacity: 0.5;
    }

    .opcity-enter,
    .opcity-leave-to {
        opacity: 0;
    }

    .cover {
        position: fixed;
        width: 100%;
        height: 100%;
        background-color: #000;
        opacity: 0.5;
        top: 0;
        left: 0;
        z-index: 100;
    }

    .detail-block {
        .group-name {
            padding: 12px 0 8px;
        }
    }
</style>
