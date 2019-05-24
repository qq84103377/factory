<!--送料型节点详情-->
<template>
    <div class="material">
        <div class="material__header">
            <nf-button type="success" @click="click_isshow">上报数量</nf-button>
            <button class="material__edit-btn" @click="$router.push({path:'/orderBom',query:instanceWorkflow.mission})">
                查看/编辑 BOM
            </button>
            <div class="material__status">
                完成情况：
                <span class="green">{{ componentData.quantityDoneSku }}</span>
                款SKU已到齐，
                <span class="blue">{{ componentData.quantityDoingSku
                  +componentData.quantityNotStartSku }}</span>
                款还差料
            </div>
            <!-- <view-record-btn class="material__view-btn"></view-record-btn> -->
            <div class="material__view-btn">
                <el-checkbox v-model="isShowSending" class="show-sending" @change="showSending">只看未送齐</el-checkbox>
                <span @click="workCalculationGo" v-if="instanceWorkflow.components.information.inverseDemand" style="line-height:20px;margin-right: 8px;cursor: pointer">物料反算</span>
                <icon-button @click="newFeedBackDialog = true" class="btn" style="line-height:20px;" type="icon-material-returned">余料退回</icon-button>
                <view-record-btn type="material" :componentData="componentData" style="line-height:20px;"></view-record-btn>
            </div>
        </div>
        <div class="material__content">
            <material-table @imgList="imgList" @changeStatus="statusChange"
                            :materials="materialTableData"></material-table>
        </div>
        <transition name="opcity">
            <div style="z-index: 999" @click="workOrderRightMove=false" class="cover" v-if='workOrderRightMove'>
            </div>
        </transition>
        <transition name="right-move">
            <workCalculation @toggle="workOrderRightMove=false" fromType="purchaseNeed" v-if="workOrderRightMove"></workCalculation>
        </transition>
        <el-dialog
                custom-class="nf-dialog-common"
                title="上报数量"
                size="large"
                :visible.sync="dialogVisible">
            <el-row
                    class="form-inline"
                    type="flex">
                <div class="form-item">
                    <span class="form-label">完成日期</span>
                    <div class="input-wrap">
                        <el-date-picker
                                :disabled="date_disabled"
                                type="date"
                                format="yyyy-MM-dd"
                                v-model="reportForm.dateCompleted"
                                @change="pickerReportEndAt"
                                placeholder="选择日期">
                        </el-date-picker>
                    </div>
                </div>
                <div class="form-item">
                    <span class="form-label">完成人员</span>
                    <div class="input-wrap">
                        <el-select
                                :disabled="staff_disabled"
                                v-model="reportForm.chargerId"
                                placeholder="请选择完成人员">
                            <el-option
                                    v-for="(leaderItem, leaderIndex) in selectPersonList"
                                    :key="leaderIndex" :label="leaderItem.userName"
                                    :value="leaderItem.id">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="bed-num">
                    <span style="display:inline-block;width:80px;">送料仓库：</span>
                    <el-select
                            v-model="storeId"
                            @change="storeChange"
                            placeholder="请选择送料仓库">
                        <el-option
                                v-for="(storeItem, storeIndex) in store"
                                :key="storeIndex" :label="storeItem.name"
                                :value="storeItem.id">
                        </el-option>
                    </el-select>
                </div>
            </el-row>
            <div class="base-info">
                <div class="img-info">
                    <img :src="instanceWorkflow.mission.pictureURL" v-errorLogo></div>
                <div style="display:flex;justify-content:space-between;width:100%;height:100%;padding:0 32px;">
                    <div class="second-info">
                        <div>
                            <span class="gray">货品款号</span>
                            <span>{{instanceWorkflow.mission.styleNo}}</span>
                        </div>
                        <div>
                            <span class="gray">货品名称</span>
                            <span>{{instanceWorkflow.mission.goodsName}}</span>
                        </div>
                    </div>
                    <div class="third-info">
                        <div>
                            <span class="gray">工单号</span>
                            <span>{{instanceWorkflow.mission.styleNo}}</span>
                        </div>
                        <div>
                            <span class="gray">&emsp;客户</span>
                            <span>{{instanceWorkflow.mission.customerName}}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div style="margin:12px 0;">
                <material-table :storeId="storeId" @imgList="imgList" @changeStatus="statusChange" isReport
                                :materials="componentData.materials"></material-table>
            </div>
            <div style="text-align:right;" class="all-status">
                <span @click="allSet">全部填齐</span>
                <span @click="allSuccess">全部标为完成</span>
            </div>
            <el-row class="dialog-footer" slot="footer" type="flex" justify="end" align="center">
                <div>
                    <nf-button @click="dialogVisible = false">取 消</nf-button>
                    <nf-button :loading="btnLoading" type="warning" @click="report">确 定</nf-button>
                </div>
            </el-row>
        </el-dialog>
        <!--<div class="outside-fac">-->
        <!--加工工厂：<span class="fac-name">{{statusFacName}}</span><icon class="edit-outside-icon" type="icon-edit" @click="showFacDialog"></icon>-->
        <!--</div>-->
        <!--//图片预览-->

        <imgPreview @dialogClose="centerDialogVisible=false" :centerDialogVisible="centerDialogVisible"
                    :imgLists="imgLists" :imgIndex="imgIndex"></imgPreview>
        <!--外发厂弹窗-->
        <el-dialog :title="dialogTitle" :visible.sync="dialogForm1" :show-close="false" class="outsideDialog">
            <el-form
                    :model="outsideForm"
                    :rules="rules"
                    ref="ruleForm"
                    label-width="90px"
            >
                <el-form-item label="加工工厂" prop="name">
                    <el-select v-model="facInputVal" placeholder="请选择" @change="getFacItem">
                        <el-option
                                v-for="(item, index) in outsideForm"
                                :key="index"
                                :label="item.fabricatingPlantName"
                                :value="item.fabricatingPlantId"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogForm1 = false">取 消</el-button>
                <el-button type="primary" @click="commitOutsideFac" :loading="isloading">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 遮罩层 -->
        <transition name="right-move">
            <newFeedBack v-if="newFeedBackDialog" @addSucsess="addSucsess" ref="newPayOffGet" source="returnMatertial" @cancel="cancel" :mission="instanceWorkflow.mission"></newFeedBack>
        </transition>
        <transition name="opcity">
            <div class="cover1" v-if="newFeedBackDialog"></div>
        </transition>
    </div>
</template>

<script>
    import workCalculation from "@/components/material/materielPurchase/workOrderCalculation"
    import materialTable from "./material-table";
    import viewRecordBtn from "../../common/view-record-btn";
    import newFeedBack from '@/components/material/materielFeed-back/new-feed-back/new-feed-back'
    import {
        materialReport,
        materialChangeSuccess,
        storeList,
        isRelatedFabricatingPlant,
        fabricatingPlants,
        checkReportPermission,
        relatedFabricatingPlant
    } from "@/api";
    import {formatDate} from "@/utils";

    export default {
        inject: ['homeRouterReload'],     //注入全局刷新方法
        props: {
            instanceWorkflow: {},
            selectPersonList: [],
            outsideMsg: {}
        },
        data() {
            return {
                centerDialogVisible: false, //判断显示图片预览显示与隐藏
                newFeedBackDialog: false, // 余料弹窗
                imgLists: [],
                imgIndex: 0,
                reportForm: {
                    chargerId: this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId,
                    dateCompleted: "",
                    materialSkus: []
                },
                tableData: [],
                dialogVisible: false,
                btnLoading: false,
                sign: "0",
                date_disabled: false, //判断日期禁用
                staff_disabled: false, //判断人员禁用
                store: [],
                storeId: "",
                storeName: "",
                dialogForm1: false,     //外发厂弹窗
                dialogTitle: '选择加工工厂',
                facInputVal: '',
                outsideForm: [],
                rules: {
                    name: [
                        {required: true, message: '请选择工厂', trigger: 'blur'},
                    ]
                },
                unitId: '',       //工厂id
                isloading: false,     //防止多次点击
                outsideSelectVal: {},     //外发厂弹窗选中的工厂值
                // 只看未送齐
                isShowSending: false,
                materialTableData: [],
                workOrderRightMove:false
            };
        },
        components: {
            workCalculation,
            materialTable,
            viewRecordBtn,
            newFeedBack
        },
        computed: {
            isBoss() {
                const info = sessionStorage.getItem("user_login");
                return JSON.parse(info).role === 1;
            },
            userId() {
                return (
                    this.$store.state.userInfo.id ||
                    JSON.parse(sessionStorage.getItem("user_login")).userId
                );
            },
            //外发厂名
            statusFacName() {
                if (this.outsideMsg.fabricatingPlantName) {
                    return this.outsideMsg.fabricatingPlantName
                } else {
                    return '未选择'
                }
            },
            componentData() {
                return this.instanceWorkflow.components.material
            }
        },
        watch: {
            dialogVisible(val) {
                // 清空就上报数据
                if (val) {
                    const chargers = this.instanceWorkflow.components.information.chargers;
                    if (this.isBoss && chargers.length) {
                        this.reportForm["chargerId"] = chargers[0].id;
                    } else if (!this.isBoss) {
                        this.reportForm["chargerId"] = this.userId;
                    }
                    for (let materialItem of this.componentData
                        .materials) {
                        for (let skuItem of materialItem.materialSkus) {
                            if (!skuItem.hasOwnProperty("quantity")) {
                                this.$set(skuItem, "quantity", "");
                            } else {
                                skuItem.quantity = "";
                            }
                            for (let i = 0; i < skuItem.stockInfoList.length; i++) {
                                if (this.storeId == skuItem.stockInfoList[i].storehouseId) {
                                    skuItem.storehouseLabel = skuItem.stockInfoList[i].storehouseLabel;
                                    skuItem.materialSkuStock = skuItem.stockInfoList[i].materialSkuStock;
                                } else {
                                    skuItem.storehouseLabel = "-";
                                    skuItem.materialSkuStock = "-";
                                }
                            }
                        }
                    }
                }
            },
            componentData:{
                handler(newVal){
                    this.materialTableData = newVal.materials
                },
                deep:true
            }
        },
        created() {
            this.unitId = JSON.parse(sessionStorage.getItem("last_login")).id;
            this.instanceWorkflow.mission.instanceId = this.$route.query.instanceWorkflowId;
            this.reportForm.dateCompleted = formatDate(new Date(), "yyyy-MM-dd");
            this.lengthShow();
            this.storeList();
            this.getOutsideList();
            this.materialTableData = this.instanceWorkflow.components.material.materials
        },
        methods: {
            //物料反算
            workCalculationGo(){

                //权限
                if (!this.powerJudgement.permissions("fac.purchaseOrder.inverseDemand")) {
                    return
                }

                this.$router.replace({path:this.$route.path,query:{...this.$route.query,id:this.$route.query.missionId}})
                this.workOrderRightMove = true;
            },
            // 新建回料单取消
            cancel(val) {
                this.newFeedBackDialog = val
            },
            // 新建回料单成功
            addSucsess() {
                this.homeRouterReload()
                this.newFeedBackDialog = false
            },
            // 图片预览
            imgList(row) {
                console.log(row.commonMaterialsPictureList);
                if (row.imagePaths[0].path) {
                    this.imgIndex = 0;
                    this.imgLists = row.imagePaths;
                } else {
                    this.imgLists = []
                    row.imagePaths.forEach(item => {
                        this.imgLists.push({path: item})
                    })
                }
                this.centerDialogVisible = true;
            },
            //外发厂弹窗下拉选择
            getFacItem() {
                let that = this;
                this.outsideSelectVal = this.outsideForm.find(function (item) {
                    if (item.fabricatingPlantId == that.facInputVal) {
                        return item;
                    }
                });
            },
            //点击加工厂图标
            showFacDialog() {
                let params = {
                    missionNodeId: this.outsideMsg.missionNodeId,          //工单节点id
                };
                isRelatedFabricatingPlant(params).then(res => {
                    if (res.data.code === 0) {
                        this.dialogForm1 = true;
                    } else {
                        //失败提示
                        this.$message.error(res.data.msg);
                    }
                });
            },
            //提交外发厂内容
            commitOutsideFac() {
                if (this.outsideSelectVal.fabricatingPlantId !== this.outsideMsg.fabricatingPlantId && this.facInputVal.length > 0) {
                    this.isloading = true;
                    let params = {
                        missionNodeId: this.outsideMsg.missionNodeId,                 //工单节点的id
                        fabricatingPlantId: this.outsideSelectVal.fabricatingPlantId,       //加工工厂的id
                        fabricatingPlantName: this.outsideSelectVal.fabricatingPlantName,   //加工工厂的名称
                        fabricatingPlantType: this.outsideSelectVal.fabricatingPlantType,   //加工工厂的类型
                    };
                    relatedFabricatingPlant(params).then(res => {
                        if (res.data.code === 0) {
                            this.outsideMsg.fabricatingPlantId = res.data.data.fabricatingPlantId;
                            this.outsideMsg.fabricatingPlantName = res.data.data.fabricatingPlantName;
                            this.outsideMsg.fabricatingPlantType = res.data.data.fabricatingPlantType;
                            this.dialogForm1 = false;
                            this.$message.success(res.data.msg);
                        } else {
                            //失败提示
                            this.$message.error(res.data.msg);
                        }
                        this.isloading = false;
                    });
                } else {
                    this.dialogForm1 = false;
                }
            },
            //获取外发厂弹窗工厂列表
            getOutsideList() {
                let params = {
                    unitId: this.unitId,          //工厂id
                    userId: this.userId           //用户id
                };
                fabricatingPlants(params).then(res => {
                    if (res.data.code === 0) {
                        this.outsideForm = res.data.data;
                    } else {
                        //失败提示
                        this.$message.error(res.data.msg);
                    }
                });
            },
            allSet() {
                for (let materialItem of this.componentData
                    .materials) {
                    for (let skuItem of materialItem.materialSkus) {
                        this.$set(skuItem, 'quantity', skuItem.quantityUnCompleted);
                    }
                }
            },
            allSuccess() {
                let arr = [];
                for (let materialItem of this.componentData
                    .materials) {
                    for (let skuItem of materialItem.materialSkus) {
                        arr.push(skuItem.bomId);
                    }
                }
                this.statusChange(arr);
            },
            //切换仓库
            storeChange(val) {
                for (let materialItem of this.componentData
                    .materials) {
                    for (let skuItem of materialItem.materialSkus) {
                        if(skuItem.stocks) {
                            for (let i = 0; i < skuItem.stocks.length; i++) {
                                if (val === skuItem.stocks[i].storehouseId && skuItem.materialSkuId === skuItem.stocks[i].skuId) {
                                    skuItem.storehouseLabel = skuItem.stocks[i].storehouseLabel;
                                    skuItem.materialSkuStock = skuItem.stocks[i].totalStock;
                                    skuItem.availableStock = skuItem.stocks[i].availableStock;
                                } else {
                                    skuItem.storehouseLabel = "-";
                                    skuItem.materialSkuStock = "0";
                                    skuItem.availableStock = "0";
                                }
                            }
                        }else {
                            skuItem.storehouseLabel = "-";
                            skuItem.materialSkuStock = "0";
                            skuItem.availableStock = "0";
                        }
                    }
                }
            },
            storeList() {
                let params = {
                    unitId: this.unitId
                };
                storeList(params).then(res => {
                    this.store = res.data.storehouses;
                    this.storeId = res.data.storehouses[0].id;
                    this.storeName = res.data.storehouses[0].name;
                });
            },
            statusChange(id, type) {
                let params = {
                    bomIds: id,
                    instanceId: this.$route.query.instanceWorkflowId
                }
                materialChangeSuccess(params).then(res => {
                    if (res.data.code == 0) {
                        this.$message.success("修改成功");
                        //送料节点表格点击送齐时刷新工单详情，解决上报弹窗操作错位的bug
                        if(type === 'pageTable'){
                            this.homeRouterReload();
                        }else{
                            this.$emit("on-report");
                        }
                    } else {
                        this.$message.error("修改失败")
                    }
                })
            },
           async click_isshow() {
                //没有选择外发厂时，弹出外发厂选择窗口
                // if(!this.outsideMsg.fabricatingPlantName){
                //     this.dialogForm1 = true;
                //     return;
                // }
                var datalist = JSON.parse(sessionStorage.getItem("user_login"))
                    .permissionList;

                if (datalist.indexOf("fac.mission.node.report") === -1) {
                    this.$message.error("抱歉，您没有操作权限");
                    return;
                }
                let obj={
                    facMissionPrcdNodeId:this.$route.query.instanceWorkflowId,
                    userId: this.userId
                };
                let flag = await checkReportPermission(obj).then(res=>{
                    if(res.data.code!==0){
                        this.$message.error(res.data.msg)
                        return false
                    }else {
                        return true
                    }
                });
                if(!flag) return
                if (datalist.indexOf("fac.mission.node.finishDate.update") === -1) {
                    this.date_disabled = true
                }
                if (datalist.indexOf("fac.mission.node.finishBy.update") === -1) {
                    this.staff_disabled = true
                }

                this.dialogVisible = true;
            },
            lengthShow() {
                if (this.componentData.standardIds.length > 0) {
                    this.instanceWorkflow.mission.lengthShow = true;
                } else {
                    this.instanceWorkflow.mission.lengthShow = false;
                }
            },
            report() {
                // if (!this.validParams()) {
                //     this.$message.error("本次送料请输入正数");
                //     return;
                // } else
                if (!this.reportForm.chargerId) {
                    this.$message.error("请选择完成人员！");
                    return;
                } else if (!this.reportForm.dateCompleted) {
                    this.$message.error("请选择完成日期！");
                    return;
                }
                this.reportForm.materialSkus = this.getMaterialSkus();
                const params = this.reportForm;
                params.userId = this.userId;
                params.storehouseId = this.storeId;
                params.instanceId = this.$route.query.instanceWorkflowId;
                params.fabricatingPlantId = this.outsideMsg.fabricatingPlantId;
                params.fabricatingPlantName = this.outsideMsg.fabricatingPlantName;
                params.fabricatingPlantType = this.outsideMsg.fabricatingPlantType;
                this.btnLoading = true;
                materialReport(params).then(res => {
                    this.btnLoading = false;
                    if (res.data.code === 0) {
                        this.$message.success("上报成功");
                        //上报成功刷新工单详情，解决上报弹窗操作错位的bug
                        this.homeRouterReload();
                        // this.$emit("on-report");
                        // this.dialogVisible = false;
                        // return;
                    }else{
                        this.$message.error(res.data.msg || "失败！");
                    }
                });
            },
            getMaterialSkus() {
                const arr = [];
                for (let materialItem of this.componentData
                    .materials) {
                    for (let skuItem of materialItem.materialSkus) {
                        if (skuItem.hasOwnProperty("quantity") && skuItem.quantity) {
                            arr.push({
                                materialSkuId: skuItem.materialSkuId,
                                quantity: skuItem.quantity,
                                storehouseLabel: skuItem.storehouseLabel
                            });
                        }
                    }
                }
                return arr;
            },
            validParams() {
                return this.componentData.materials.some(item => {
                    console.log(item);
                    return item.materialSkus.some(
                        sku => sku.hasOwnProperty("quantity") && sku.quantity && sku.quantity <= sku.selfPreuseTotal
                    );
                });
            },
            pickerReportEndAt(val) {
                this.reportForm.dateCompleted = val;
            },
            // 只查看未送齐的物料
            showSending() {
                if (this.isShowSending) {
                    this.materialTableData = []
                    let templateArr = this.instanceWorkflow.components.material.materials.slice(0)
                    templateArr.forEach(item => {
                        let sendingItems = JSON.parse(JSON.stringify(item))
                        let materialSkus = []
                        item.materialSkus.forEach(item =>{
                            if(item.status ===0){
                                materialSkus.push(item)
                            }
                        })
                        if(materialSkus.length){
                            sendingItems.materialSkus = materialSkus
                            this.materialTableData.push(sendingItems)
                        }

                    })
                }
                else {
                    this.materialTableData = this.instanceWorkflow.components.material.materials
                }
                console.log(this.materialTableData,556677)
            }
        }
    }
    ;
</script>

<style lang="scss" scoped>
    .green {
        color: #23c811;
    }

    .blue {
        color: #1ca1ff;
    }

    .material {
        border-bottom: 1px solid #e6eaf0;
        .show-sending {
            padding-right: 16px;
            margin-right: 6px;
            border-right: 1px solid #e6eaf0;
        }
        .outside-fac {
            margin: 12px 0 15px 0;
            font-size: 14px;
            color: #3B3B3B;
            .fac-name {
                margin: 0 5px 0 10px;
            }
            .edit-outside-icon {
                cursor: pointer;
            }
        }
        &__status {
            display: inline-block;
            // margin-left: 24px;
            font-size: 14px;
        }
        &__edit-btn {
            position: relative;
            padding: 0 12px;
            height: 36px;
            @extend .blue;
            font-size: 14px;
            margin: 0 16px 0 12px;
            border: 1px solid #1ca1ff;
            border-radius: 2px;
        }
        &__view-btn {
            float: right;
            position: relative;
            top: 12px;
            margin-right: 10px;
        }
        &__content {
            margin-top: 12px;
        }
        .material__view-btn{
            display:flex;
            justify-content: flex-start;
        }
    }

    .form-inline {
        justify-content: space-between;
        .form-item {
            display: inline-block;
        }
        .input-wrap {
            display: inline-block;
            width: 194px;
        }
    }

    .base-info {
        height: 72px;
        border: 1px solid #e6eaf0;
        margin: 14px 0;
        box-sizing: border-box;
        padding: 12px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .img-info {
            width: 60px;
            height: 48px;
            border: 1px solid #ccc;
            margin-right: 24px;
            img {
                width: 100%;
                height: 100%;
            }
        }
        .second-info {
            height: 100%;
            display: flex;
            justify-content: space-between;
            align-items: stretch;
            flex-direction: column;
        }
        .third-info {
            height: 100%;
            display: flex;
            justify-content: space-between;
            align-items: stretch;
            flex-direction: column;
        }
        .gray {
            color: #a2abb8;
            margin-right: 12px;
        }
    }
</style>

<style lang="scss">
    .material {
        .outsideDialog {
            .el-dialog {
                width: 480px !important;
                .el-dialog__header {
                    padding-bottom: 18px;
                    border-bottom: 1px solid rgba(230, 234, 240, 1);
                    text-align: center;
                }
                .el-dialog__body {
                    width: 350px;
                    margin: 0 auto;
                    padding: 30px 20px 8px 20px;
                    .el-input {
                        width: 250px;
                    }
                    .el-date-editor.el-input {
                        width: 250px;
                    }
                    .el-textarea {
                        width: 250px;
                        .el-textarea__inner {
                            font-family: Arial;
                        }
                    }
                }
                .el-dialog__footer {
                    padding: 25px 20px;
                    border-top: 1px solid rgba(230, 234, 240, 1);
                    text-align: center;
                    .el-button {
                        width: 130px;
                        line-height: 40px;
                        margin: 0 3px;
                        padding: 0;
                    }
                }
            }
            .el-textarea__inner {
                resize: none;
            }
            .el-table__fixed-header-wrapper thead div {
                color: #97a5bd;
            }
            .el-table .cell, .el-table th > div {
                padding-left: 12px;
                padding-right: 12px;
            }
        }

    }

    .form-inline .el-date-editor.el-input {
        width: 128px;
    }

    .form-inline .el-input__inner {
        border: none;
    }

    .form-inline .input-wrap {
        width: 140px;
    }

    .totalNum .el-input__inner {
        height: 72px;
        font-size: 40px;
        text-align: center;
        border: 1px solid #dce0e6;
    }

    .bed-num .el-input__inner {
        width: 250px;
    }

    .bed-num {
        position: relative;
        // left:24%;
    }

    .all-status {
        span {
            color: #1ca1ff;
            width: 100%;
            height: 48px;
            text-decoration: underline;
            cursor: pointer;
        }
    }
</style>
