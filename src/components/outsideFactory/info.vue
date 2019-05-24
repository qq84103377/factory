<template>
    <div class="outside-info">
        <page-title title="加工厂商档案详情">
            <nf-button class="go-back" @click="$router.go(-1)">
                <i class="icon-left el-icon-arrow-left"></i>返回上级
            </nf-button>
        </page-title>
        <div class="content box-shadow">
            <div class="table-wrap">
                <div class="yellow-border-title mgb10">
                    <h1 class="title">基本信息</h1>
                    <div class="btn-group">
                        <nf-button svg="icon-edit1" v-if="!stopuse&&(outsideMes.reviewStatus==3||outsideMes.reviewStatus==0)" @click="handleEditClick">
                            编辑
                        </nf-button>
                        <nf-button :loading="btnLoading" v-if="!isConfig&&outsideMes.reviewStatus==2" @click="handleReviewStatus(3)">
                            申请驳回
                        </nf-button>
                        <nf-button :loading="btnLoading" v-if="isConfig&&outsideMes.reviewStatus==2" @click="dialogText='反审核申请原因';unPassDialog=true">
                            申请反审
                        </nf-button>
                        <nf-button :loading="btnLoading" v-if="!isConfig&&outsideMes.reviewStatus==3" @click="handleReviewStatus(2)">
                            生成档案
                        </nf-button>
                        <nf-button :loading="btnLoading" v-if="isConfig&&(outsideMes.reviewStatus==3||outsideMes.reviewStatus==0)" @click="handleSubmit">
                            提报
                        </nf-button>
                        <nf-button :loading="btnLoading" type="success" v-if="isConfig&&outsideMes.reviewStatus==1" @click="handleReview(true)">
                            通过
                        </nf-button>
                        <nf-button :loading="btnLoading" type="danger" v-if="isConfig&&outsideMes.reviewStatus==1" @click="dialogText='驳回原因';unPassDialog=true">
                            驳回
                        </nf-button>
                        <nf-button :loading="btnLoading" type="success" v-if="isConfig&&outsideMes.reviewStatus==4" @click="handleReview(true)">
                            批准
                        </nf-button>
                        <nf-button :loading="btnLoading" type="danger" v-if="isConfig&&outsideMes.reviewStatus==4" @click="handleReview(false)">
                            不批准
                        </nf-button>
                        <!-- reviewStatus：1【待审核状态】、4【反审待批准】 -->
                        <nf-button :loading="btnLoading" v-if="isConfig&&(outsideMes.reviewStatus==1||outsideMes.reviewStatus==4)" @click="handleUndo">
                            <span v-if="outsideMes.reviewStatus==1">撤回提报</span>
                            <span v-if="outsideMes.reviewStatus==4">撤回申请</span>
                        </nf-button>
                    </div>
                </div>
                <div class="main-table">
                    <el-form :model="ruleForm" label-width="110px">
                        <el-row>
                            <el-col :span="10">
                                <el-form-item label="加工厂商名称：">
                                    <span>{{ outsideMes.name }}</span>
                                </el-form-item>
                            </el-col>
                            <el-col :span="14">
                                <el-form-item label="加工厂商编号：">
                                    <span>{{ outsideMes.code }}</span>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="10">
                                <el-form-item label="厂商评级：">
                                    <span>{{ outsideMes.factoryRateName }}</span>
                                </el-form-item>
                            </el-col>
                            <el-col :span="14">
                                <el-form-item label="品牌：">
                                    <span>{{ outsideMes.attrName }}</span>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="10">
                                <el-form-item label="联系人：">
                                    <span>{{ outsideMes.contacts }}</span>
                                </el-form-item>
                            </el-col>
                            <el-col :span="14">
                                <el-form-item label="联系电话：">
                                    <span>{{ outsideMes.telephone }}</span>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="10">
                                <el-form-item label="手机：">
                                    <span>{{ outsideMes.mobilePhone }}</span>
                                </el-form-item>
                            </el-col>
                            <el-col :span="14">
                                <el-form-item label="所属地区：">
                                    <span>{{ detailedAddress }}</span>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="10">
                                <el-form-item label="详细地址：">
                                    <span>{{ outsideMes.address }}</span>
                                </el-form-item>
                            </el-col>
                            <el-col :span="14">
                                <el-form-item label="关联加工厂：">
                                    <span>{{ outsideMes.outsideFactoryRelaName }}</span>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="10">
                                <el-form-item label="停用状态：">
                                    <span>{{ outsideMes.stopuse?'已停用':'未停用' }}</span>
                                </el-form-item>
                            </el-col>
                            <el-col :span="14">
                                <el-form-item label="审核状态：">
                                    <span>{{ outsideMes.reviewStatusText }}</span>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="10">
                                <el-form-item label="审批备注：">
                                    <span :class="{'gray':outsideMes.reviewRemark?false:true}">{{ outsideMes.reviewRemark?outsideMes.reviewRemark:"无" }}</span>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </div>
            </div>
            <div class="table-wrap">
                <div class="yellow-border-title mgb10">
                    <h1 class="title">加工厂仓库</h1>
                </div>
                <div class="storehouse-wrap">
                    <span class="storehouse-label">关联仓库：</span>
                    <span class="storehouse-name" @click="handleClickHouse(outsideMes.commonStorehouseId)">{{outsideMes.commonStorehouseName ? outsideMes.commonStorehouseName : '无'}}</span>
                </div>
            </div>
            <div class="table-wrap">
                <div class="yellow-border-title mgb20">
                    <h1 class="title">附件</h1>
                </div>
                <!-- 附件 -->
                <upload-form
                        :isEdit="true"
                        :tableData="outsideMes.attachmentLists"
                        :fileList="outsideMes.attachments"
                        from="outside"
                        @getFileList="getFileList"
                        @getAttachments="getAttachments"></upload-form>
            </div>
            <div class="stopuse-img">
                <img v-if="stopuse" class="cancel-img" src="../../../static/images/pic-stop-use.png"/>
            </div>
        </div>
        <div class="outside-btn-wrap" v-if="showBottomBtns">
            <div class="outside-btn del-btn" @click="handleDel">删除供应商</div>
            <div class="outside-btn stop-btn" v-if="!stopuse" @click="handleStopOrStart(1)">停用供应商</div>
            <div class="outside-btn stop-btn" v-else @click="handleStopOrStart(0)">启用供应商</div>
        </div>
        <!--新增和编辑加工厂商，通用组件-->
        <transition name="right-move">
            <add style="z-index: 1000"
                 v-if="addModuleShow"
                 type="edit"
                 :outsideId="outsideId"
                 :storeData="storeData"
                 @hiddenWindow="cancelAdd"
                 @hideCover="cancelAdd"
                 @update="getOutsideData"></add>
        </transition>
        <transition name="opcity">
            <div style="z-index: 100" class="cover" v-if="addModuleShow" @click="cancelAdd">
            </div>
        </transition>

        <!--删除加工厂商弹窗-->
        <el-dialog class="repertory_dialog repertory_dialog--dele" :visible.sync="deleteFac" modal="false">
            <div class="body">
                <icon w="80" h="80" type="icon-gongdan-jiedianjingbao-da"></icon>
                <p style="color:#3b3b3b;font-size:16px;">是否确定删除当前加工厂商？</p>
                <p style="color:#a2abb8;font-size:14px;">删除后数据不可恢复</p>
            </div>
            <div class="footer">
                <nf-button @click="cancelDell()">取消</nf-button>
                <nf-button type="warning" @click="delOutsideMes" :loading="isloading">确定</nf-button>
            </div>
        </el-dialog>

        <!--反审/驳回弹窗-->
        <el-dialog :title="dialogText" class="custom-dialog" :visible.sync="unPassDialog" size="tiny">
            <div class="body">
                <div style="display: flex;">
                    <p style="white-space: nowrap;margin: 10px 10px 0 0;">{{dialogText}}</p>
                    <el-input type="textarea" rows="6" v-model="message" :placeholder="`请填写${dialogText}`"></el-input>
                </div>
            </div>
            <div slot="footer">
                <nf-button @click="message='';unPassDialog=false">取消</nf-button>
                <nf-button type="warning" @click="confirm" :loading="btnLoading">确定</nf-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {
        billReviewConfig,
        outsideFactoryInfo,
        deleteOutsideFactory,
        beforeDeleteOutside,
        updateStopuse,
        outsideFactoryUndoStatus,
        outsideFactorySubmit,
        outsideFactoryAntiReview,
        outsideFactoryReviewStatus,
        outsideFactoryReview
    } from "@/api";
    import add from './add';
    import uploadForm from '@/components/Common/uploadForm'; // 上传表格
    export default {
        name: "info.vue",
        components: {
            add,
            uploadForm
        },
        data() {
            return {
                dialogText: '',
                message: '',
                unPassDialog: false,
                btnLoading: false,
                isConfig: false,       //是否配置审核台
                deleteFac: false,       //dialog弹窗
                addModuleShow: false,   //侧滑栏
                outsideMes: {},          //加工厂商数据
                isloading: false,        //防止多次点击
                stopuse: false,          //是否停用供应商
                showBottomBtns: 0,        //是否显示底部按钮  0不能，1能
                storeData:{},             //关联仓库
            }
        },
        computed: {
            //拼接所属地区
            detailedAddress() {
                let address = '';
                if (this.outsideMes.provinceName && this.outsideMes.cityName && this.outsideMes.areaName) {
                    address = this.outsideMes.provinceName + ' / ' + this.outsideMes.cityName + ' / ' + this.outsideMes.areaName;
                }
                return address;
            },
            factoryId(){
                return JSON.parse(sessionStorage.getItem("last_login")).id;
            },
            unitId(){
                return JSON.parse(sessionStorage.getItem('user_login')).unitId;
            },
            userId(){
                return JSON.parse(sessionStorage.getItem("user_login")).userId;
            },
            outsideId(){
                return this.$route.params.id;
            },
        },
        methods: {
            //查看仓库
            handleClickHouse(id){
                this.$router.push({
                    path: `/materialInventory/matremaind?storehouseId=${id}`,
                    query: {
                        from: 'outsideFactory'
                    }
                })
            },
            confirm() {
                if(this.dialogText=='驳回原因') {
                    this.handleReview(false)
                }else {
                    this.handleAntiReview()
                }
            },
            handleReview(result) {
                this.btnLoading = true;
                const params ={
                    id: this.outsideId,
                    taskId: this.outsideMes.taskId,
                    result,
                    message: this.message,
                    userId: this.userId,
                    unitId: this.unitId
                }
                outsideFactoryReview(params).then(res => {
                    this.btnLoading = false;
                    if(res.data.code == 0) {
                        this.$message.success('请求成功')
                        this.unPassDialog = false
                        this.message = ''
                        this.getOutsideData()
                    }else {
                        this.$message.error(res.data.msg)
                    }
                })
            },
            handleReviewStatus(reviewStatus) {
                this.btnLoading = true;
                let para = {
                    reviewStatus,
                    id: this.outsideId,
                    userId: this.userId,
                    unitId: this.unitId
                };
                outsideFactoryReviewStatus(para).then(res => {
                    this.btnLoading = false;
                    if(res.data.code == 0) {
                        this.$message.success('请求成功')
                        this.unPassDialog = false
                        this.getOutsideData()
                    }else {
                        this.$message.error(res.data.msg)
                    }
                })
            },
            handleAntiReview() {
                const params = {
                    id: this.outsideId,
                    unitId: this.unitId,
                    userId: this.userId,
                    message: this.message
                }
                this.btnLoading = true;
                outsideFactoryAntiReview(params).then(res => {
                    this.btnLoading = false;
                    if(res.data.code == 0) {
                        this.$message.success(res.data.msg)
                        this.unPassDialog = false
                        this.message = ''
                        this.getOutsideData()
                    }else {
                        this.$message.error(res.data.msg)
                    }
                })
            },
            handleSubmit() {
                const params = {
                    id: this.outsideId,
                    unitId: this.unitId,
                    userId: this.userId
                }
                this.btnLoading = true;
                outsideFactorySubmit(params).then(res => {
                    this.btnLoading = false;
                    if(res.data.code == 0) {
                        this.$message.success('提报成功')
                        this.getOutsideData()
                    }else {
                        this.$message.error(res.data.msg)
                    }
                })
            },
            handleUndo() {
                this.btnLoading = true;
                let para = {
                    unitId: this.unitId,
                    userId: this.userId,
                    id:this.outsideId
                };
                outsideFactoryUndoStatus(para).then(res => {
                    this.btnLoading = false;
                    if(res.data.code == 0) {
                        this.$message.success('撤回成功')
                        this.getOutsideData()
                    }else {
                        this.$message.error(res.data.msg)
                    }
                })
            },
            //是否有审核台
            getBillReviewConfig(){
                    billReviewConfig({unitId:this.unitId}).then(res=>{
                        if(res.data.data.configs && res.data.data.configs.length>0){
                            //是否有审核台
                            this.isConfig = res.data.data.configs.some(v => v.billType == 'OUTSIDE_FACTORY')
                        }
                    })
            },
            // 停用/启用供应商
            handleStopOrStart(type){
                let params = {
                    id: this.outsideId,
                    stopuse: type
                };
                updateStopuse(params).then(res => {
                    if (res.data.code === 0) {
                        this.$message.success(res.data.msg);
                        this.getOutsideData();
                    } else {
                        //失败提示
                        this.$message.error(res.data.msg);
                    }
                });
            },
            //编辑加工厂商信息
            handleEditClick() {
                // 权限
                if(!this.powerJudgement.permissions("fac.outFac.update")){
                    return
                }
                this.addModuleShow = true;
            },
            //删除加工厂商按钮
            handleDel() {
                // 权限
                if (!this.powerJudgement.permissions("fac.outFac.delete")) {
                    return
                }
                let params = {
                    outsideId: this.outsideId,
                    unitId: this.factoryId
                };
                beforeDeleteOutside(params).then(res => {
                    if (res.data.code === 0) {
                        this.deleteFac = true;
                    } else {
                        //失败提示
                        this.$message.error(res.data.msg);
                    }
                });
            },
            //取消删除加工厂商
            cancelDell() {
                this.deleteFac = false;
            },
            //确认删除加工厂商
            delOutsideMes() {
                this.isloading = true;
                let params = {
                    factoryId: this.factoryId,
                    id: this.outsideId
                };
                deleteOutsideFactory(params).then(res => {
                    if (res.data.code === 0) {
                        this.$router.push("/outsideFactory");
                    } else {
                        //失败提示
                        this.$message.error(res.data.msg);
                    }
                    this.isloading = false;
                });
            },
            //关闭侧滑
            cancelAdd() {
                this.addModuleShow = false;
            },
            //获取加工厂商信息
            getOutsideData() {
                const outsideId = this.outsideId;
                let params = {
                    id: outsideId,
                    userId: this.userId
                };
                outsideFactoryInfo(params).then(res => {
                    if (res.data.code === 0) {
                        let data = res.data.data;
                        //封装品牌和关联加工厂的显示格式
                        let brandArr = [];
                        let factoryRelaArr = [];
                        data.attrIds.forEach(v => {
                            brandArr.push(v.name);
                        });
                        data.amongRelas.forEach(v => {
                            factoryRelaArr.push(v.name);
                        });
                        //
                        data.attrName = brandArr.join(',');
                        data.outsideFactoryRelaName = factoryRelaArr.join(',');
                        //封装厂商评级
                        let f_name = [];
                        data.factoryRateName ='';
                        if(data.factoryRateIds!=null){
                            data.factoryRateIds.forEach(vs =>{
                                f_name.push(vs.name);
                            });
                            data.factoryRateName = f_name.join(',');
                        }
                        //封装表格附件格式
                        data.attachmentLists.forEach(item => {
                            item.fileName = item.attachmentName;
                            item.tag = item.attachmentTag;
                        });
                        this.outsideMes = data;
                        this.storeData.name = data.commonStorehouseName;
                        this.storeData.id = data.commonStorehouseId;
                        this.stopuse = data.stopuse;
                        this.showBottomBtns = data.canDelete;

                    } else {
                        //失败提示
                        this.$message.error(res.data.msg);
                    }
                });
            }
        },
        created() {
            this.getBillReviewConfig()
            this.getOutsideData();
        }
    }
</script>

<style lang="scss" scoped>
    .outside-info {
        display: -ms-flexbox;
        display: flex;
        width: 100%;
        -ms-flex-direction: column;
        flex-direction: column;
        overflow: hidden;

        .content {
            padding: 12px 24px;
            background-color: #fff;
            position: relative;
            .table-wrap{
                margin-bottom: 20px;
                .storehouse-wrap{
                    border-bottom: 1px solid #DFE6EC;
                    .storehouse-label{
                        display: inline-block;
                        width: 98px;
                        padding: 20px 12px 20px 0;
                        font-size: 14px;
                        text-align: right;
                    }
                    .storehouse-name{
                        cursor: pointer;
                    }
                }
            }
            .stopuse-img{
                position: absolute;
                top: 20px;
                right: 50px;
            }

            .main-table {
                border-bottom: 1px solid #DFE6EC;
                padding: 0 0 20px 0;
                .el-form-item {
                    margin-bottom: 0;
                }
            }

        }
        .outside-btn-wrap{
            .outside-btn {
                display: inline-block;
                width: 98px;
                line-height: 40px;
                margin: 15px 10px 0 0;
                text-align: center;
                background-color: #fff;
                cursor: pointer;
                &.del-btn{
                    color: #fa4150;
                }
                &.stop-btn{
                    color: #808080;
                }
            }
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
        .btn-group{
            button{
                width: 98px;height: 36px;padding: 0;
                & + &{
                    margin-left: 10px;
                }
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
