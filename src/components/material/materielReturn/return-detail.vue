<template>
    <div class="detail-purchase">
        <header class="header">
            <page-title title="退料单详情">
                <div>
                    <nf-button type="warning" style="margin-right: 10px;" v-if="!cancel" @click="repeatEditPurchases">重编辑</nf-button>
                    <nf-button @click="routerGoList">
                        返回上级
                    </nf-button>
                </div>
            </page-title>
        </header>
        <div class="detail-table" v-loading="loading">
            <div class="need-filter">
                <el-row :gutter="20">
                    <el-col :span="6">
                        <div class="grid-content">
                            <div class="label-name">物料供应商:</div>
                            <div>{{form.supplierName}}</div>
                        </div>
                    </el-col>
                    <el-col :span="6">
                        <div class="grid-content">
                            <div class="label-name">退料单号:</div>
                            <div>{{form.billReturnNo}}</div>
                        </div>
                    </el-col>
                    <el-col :span="6">
                        <div class="grid-content">
                            <div class="label-name">退料日期:</div>
                            <div>{{form.dateReturn | filterTime}}</div>
                        </div>
                    </el-col>
                    <el-col :span="6">
                        <div class="grid-content">
                            <div class="label-name">退料员:</div>
                            <div>{{form.creatorName}}</div>
                            <img v-if="cancel" class="cancel-img" src="../../../../static/images/pic-cancel.png"/>
                        </div>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="6">
                        <div class="grid-content">
                            <div class="label-name">退料仓库:</div>
                            <div>{{form.storehouseName | filterTime}}</div>
                        </div>
                    </el-col>
                    <el-col :span="6" class="plan-tab">
                        <div class="grid-content">
                            <div class="label-name">备注信息:</div>
                            <div class="red">{{form.remark}}</div>
                        </div>
                    </el-col>
                </el-row>
            </div>
            <!-- 打印按钮 -->
            <div class="print-btn clearfix fr">
                <print-template-btn name="退料单" type="return" :id="$route.query.id"></print-template-btn>
            </div>
            <!-- 退料单详情 -->
            <div class="table-census">
                <div class="blue-text"><i></i>退料详情</div>
                <span>本次退料<span class="king">{{form.quantitySku}} 款</span></span>
                <span class="last-span">退料金额：<span class="king">￥{{form.amountTotal}}</span></span>
            </div>
            <div id="select-table" class="select-table">
                <el-table
                        v-if="canShow"
                        :data="form.skus"
                        border
                        :row-class-name="setRowClassName"
                        style="width: 100%">
                    <el-table-column prop="kindName" label="分类" v-if="configArr.includes('分类')" align="center">
                    </el-table-column>
                    <el-table-column label="图片" v-if="configArr.includes('图片')" align="center" width="120">
                        <template slot-scope="scope">
                            <img style="width: 80px;height: 40px;"
                                 v-if="scope.row.commonMaterialsPictureList && scope.row.commonMaterialsPictureList.length"
                                 @click="imgList(scope.row)"
                                 :src="scope.row.commonMaterialsPictureList[0].path?scope.row.commonMaterialsPictureList[0].path:scope.row.commonMaterialsPictureList[0]"
                                 alt="">
                        </template>
                    </el-table-column>
                    <el-table-column prop="materialNo" label="物料款号" v-if="configArr.includes('物料款号')" width="90" align="center">
                    </el-table-column>
                    <el-table-column label="供应商款号/色号" v-if="configArr.includes('供应商款号/色号')" width="140" align="center">
                        <template slot-scope="scope">
                            {{scope.row.supplierStyleNo}}/
                            {{scope.row.supplierColorNo}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="materialName" label="物料名称" v-if="configArr.includes('物料名称')" width="90" align="center">
                    </el-table-column>
                    <el-table-column prop="colorName" label="颜色" v-if="configArr.includes('颜色')" align="center">
                        <template slot-scope="scope">
                            {{scope.row.colorName?scope.row.colorName:scope.row.colorValue}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="specificationsNumber" label="规格" v-if="configArr.includes('规格')" align="center">
                        <template slot-scope="scope">
                            {{scope.row.specificationsRemark?scope.row.specificationsRemark:scope.row.specificationsNumber}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="unit" label="库存单位" v-if="configArr.includes('单位')" align="center">
                    </el-table-column>
                    <el-table-column prop="unit" label="采购单位" align="center">
                    </el-table-column>
                    <!--<el-table-column prop="styleNo" label="商品款号" :render-header="renderHeader" width="540">-->
                        <!--<template slot-scope="scope">-->
                            <!--<div v-if="item.type===0" class="specific-table"-->
                                 <!--v-for="(item,index) in scope.row.skuDetails" :key="index">-->
                                <!--<div>{{item.billArriveNo}}</div>-->
                                <!--<div>{{item.dateArrive}}</div>-->
                                <!--<div>{{item.purchaseNo}}</div>-->
                                <!--<div>{{item.styleNo}}</div>-->
                                <!--<div>{{item.demandSourceBillNo}}</div>-->
                            <!--</div>-->
                            <!--<div v-else style="height:32px;line-height:32px;padding-left:12px;">-->
                                <!--直接退料-->
                            <!--</div>-->
                        <!--</template>-->
                    <!--</el-table-column>-->
                    <el-table-column prop="styleNo" label="到料单号" width="120">
                        <template slot-scope="scope">
                            <div v-if="item.type===0" class="specific-table"
                                 v-for="(item,index) in scope.row.skuDetails" :key="index">
                                <div>{{item.billArriveNo}}</div>
                            </div>
                            <div v-else style="height:32px;line-height:32px;padding-left:12px;">
                                直接退料
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="styleNo" label="到料日期" width="160">
                        <template slot-scope="scope">
                            <div v-if="item.type===0" class="specific-table"
                                 v-for="(item,index) in scope.row.skuDetails" :key="index">
                                <div>{{item.dateArrive}}</div>
                            </div>
                            <div v-else style="height:32px;line-height:32px;padding-left:12px;">
                                直接退料
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="styleNo" label="采购单号" width="120">
                        <template slot-scope="scope">
                            <div v-if="item.type===0" class="specific-table"
                                 v-for="(item,index) in scope.row.skuDetails" :key="index">
                                <div>{{item.purchaseNo}}</div>
                            </div>
                            <div v-else style="height:32px;line-height:32px;padding-left:12px;">
                                直接退料
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="styleNo" label="商品款号" width="120">
                        <template slot-scope="scope">
                            <div v-if="item.type===0" class="specific-table"
                                 v-for="(item,index) in scope.row.skuDetails" :key="index">
                                <div>{{item.styleNo}}</div>
                            </div>
                            <div v-else style="height:32px;line-height:32px;padding-left:12px;">
                                直接退料
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="styleNo" label="生产单号" width="120">
                        <template slot-scope="scope">
                            <div v-if="item.type===0" class="specific-table"
                                 v-for="(item,index) in scope.row.skuDetails" :key="index">
                                <div>{{item.demandSourceBillNo}}</div>
                            </div>
                            <div v-else style="height:32px;line-height:32px;padding-left:12px;">
                                直接退料
                            </div>
                        </template>
                    </el-table-column>

                    <el-table-column prop="quantityPurchased" label="计划采购" width="90" align="center">
                        <template slot-scope="scope">
                            <div v-for="(items,index) in scope.row.skuDetails" :key="index" class="center-block">
                                {{items.planBuyQuantity}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="unArrivedPurchaseQuantity" label="本次采购[库存单位]" width="90" align="center">
                        <template slot-scope="scope">
                            <div v-for="(items,index) in scope.row.skuDetails" :key="index" class="center-block">
                                {{items.quantityStockUnitPurchase}}{{scope.row.unit}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="unArrivedPurchaseQuantity" label="到料数[采购单位]" width="90" align="center">
                        <template slot-scope="scope">
                            <div v-for="(items,index) in scope.row.skuDetails" :key="index" class="center-block">
                                {{items.arriveQuantity}}{{scope.row.purchaseUnitName}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="quantityArrived" label="本次到料[库存单位]" width="90" align="center">
                        <template slot-scope="scope">
                            <div v-for="(item,indexs) in scope.row.skuDetails" :key="indexs" class="center-block">
                                {{item.arriveStockUnitQuantity}}{{scope.row.unit}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="unArrivedPurchaseQuantity" label="到料单价" width="90" align="center">
                        <template slot-scope="scope">
                            <div v-for="(item,index) in scope.row.skuDetails" :key="index" class="center-block">
                                <span>{{item.arrivePriceUnit}}元/{{scope.row.purchaseUnitName}}</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="unitPrice" label="本次退料[库存单位]" width="90" align="center">
                        <template slot-scope="scope">
                            <div v-for="(item,indexs) in scope.row.skuDetails" :key="indexs" class="center-block">
                                {{item.returnStockUnitQuantity}}{{scope.row.unit}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="unitPrice" label="退料数[采购单位]" width="90" align="center">
                        <template slot-scope="scope">
                            <div v-for="(item,indexs) in scope.row.skuDetails" :key="indexs" class="center-block">
                                {{item.returnQuantity}}{{scope.row.purchaseUnitName}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="unitPrice" label="退料转化率" width="90" align="center">
                        <template slot-scope="scope">
                            <div v-for="(item,indexs) in scope.row.skuDetails" :key="indexs" class="center-block">
                                {{item.conversionRate}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="amountTotal" label="退料单价" width="90">
                        <template slot-scope="scope">
                            <div v-for="(item,indexs) in scope.row.skuDetails" :key="indexs" class="center-block">
                                {{item.returnPriceUnit}}元/{{scope.row.purchaseUnitName}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="amountTotal" label="退料金额" min-width="90">
                        <template slot-scope="scope">
                            <div v-for="(item,indexs) in scope.row.skuDetails" :key="indexs" class="center-block">
                                {{item.returnPriceTotal}}
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <!-- 流水记录 -->
            <!--<div class="table-census mgt17" style="width:700px;">-->
            <!--<div class="blue-text"><i></i>流水记录</div>-->
            <!--<span>本单应付退款：<span class="king">￥{{form.amountTotal}}</span></span>-->
            <!--<span class="last-span">实际收到退款：<span class="red">￥{{form.amountCollectTotal}}</span></span>-->
            <!--<nf-button style="width:64px;height:24px;font-size:12px; line-heihgt:24px;padding:0;margin-left:32px;"-->
            <!--type="warning" @click="payOpen">收退款-->
            <!--</nf-button>-->
            <!--</div>-->
            <!--<div id="select-table" class="select-table" v-if="form.collects">-->
            <!--<el-table :data="form.collects" border style="width: 700px">-->
            <!--<el-table-column prop="type" label="流水类型" align="center" width="90">-->
            <!--</el-table-column>-->
            <!--<el-table-column prop="dateCreated" label="日期" width="90" align="center">-->
            <!--<template slot-scope="scoped">-->
            <!--{{scoped.row.dateCollect | filterTime}}-->
            <!--</template>-->
            <!--</el-table-column>-->
            <!--<el-table-column prop="creatorName" label="业务员" width="90" align="center"></el-table-column>-->
            <!--<el-table-column prop="supplierName" label="供应商" width="90" align="center"></el-table-column>-->
            <!--<el-table-column prop="collectTotal" label="金额" width="90" align="center">-->
            <!--</el-table-column>-->
            <!--<el-table-column prop="dateOperated" label="操作时间" width="90" align="center">-->
            <!--<template slot-scope="scoped">-->
            <!--{{scoped.row.dateCreate | filterTime}}-->
            <!--</template>-->
            <!--</el-table-column>-->
            <!--<el-table-column prop="updaterName" label="操作人" align="center" width="90">-->
            <!--</el-table-column>-->
            <!--<el-table-column prop="specificationsNo" label="操作" align="center" width="70">-->
            <!--<template slot-scope="scope">-->
            <!--<el-button type="text" size="small" class="text-line" @click="getUndo(scope.row)">撤销-->
            <!--</el-button>-->
            <!--</template>-->
            <!--</el-table-column>-->
            <!--</el-table>-->
            <!--</div>-->
        </div>
        <!--应付与应收详情 -->
        <div class="materialList-financial-details-details">
            <materialList-financial-details
                    :title="'应收详情'"
                    :header="header"
                    :flag="'NEED_RECEIVE'"
                    @orderStatus="orderStatus"
                    :urlSupplier="urlSupplier"
                    :cancelFlag="cancel">
            </materialList-financial-details>
        </div>
        <!-- footer -->
        <div class="footer">
            <nf-button :disabled="cancel" style="width:64px" @click="permissionsCxGo">撤销</nf-button>
            <span v-if="cancel">撤销人:{{undoPeople}}</span>
        </div>
        <!-- 撤销窗口 -->
        <el-dialog class="custom-dialog tip-dialog" :visible.sync="isDeleteVisible" :show-close="false"
                   :close-on-click-modal="false" size="tiny">
            <div class="text-center">
                <icon w="80" h="80" type="icon-gongdan-jiedianjingbao-da"></icon>
                <p class="tip-text">是否确定撤销当前退料单</p>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="isDeleteVisible = false">取 消</el-button>
                <el-button :disabled="isSaving" type="primary" @click="getCancel()">确认</el-button>
            </div>
        </el-dialog>

        <!--//图片预览-->
        <imgPreview  @dialogClose="centerDialogVisible=false" :centerDialogVisible="centerDialogVisible" :imgLists="imgLists" :imgIndex="imgIndex"></imgPreview>

        <!-- 付款弹窗 -->
        <el-dialog
                :visible.sync="paymentShow"
                width="20%"
                :show-close="false"
                custom-class="pay"
                top="30%">
            <div slot="title" class="pay-title">退款</div>
            <el-form :model="payForm" class="pay-form">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="日期">
                            <el-date-picker
                                    v-model="payForm.dateOperated"
                                    type="date"
                                    :picker-options="pickerOptions0"
                                    value-format="yyyy-MM-dd"
                                    placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="业务员">
                            <el-select v-model="payForm.operatorId" placeholder="请选择" clearable filterable>
                                <el-option
                                        v-for="item in purchaserList"
                                        :key="item.id"
                                        :label="item.userName"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-form-item label="供应商" class="mgl44">
                        <el-select v-model="payForm.supplierId" placeholder="请选择" clearable filterable disabled
                                   class="width220">
                            <el-option
                                    v-for="item in supplierList"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-form-item label="付款金额" class="mgl30">
                        <el-input v-model="payForm.amount" class="width220" placeholder="请输入付款金额(￥)"></el-input>
                    </el-form-item>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="paymentShow = false">取 消</el-button>
                <el-button type="primary" @click="remitSuccess">确 定</el-button>
            </span>
        </el-dialog>
        <!--重编辑-->
        <transition name="right-move">
            <newReturn v-if="newReturnPurchaseDialog" @editAgainSucc="editAgainSucc" ref="newPurchaseGet" :detailReturnPurchasedata="form" source="detailReturnPurchase"></newReturn>
        </transition>
        <transition name="opcity">
            <div class="cover1" v-if="newReturnPurchaseDialog" @click="hiddenNewPurchaseDialog">
            </div>
        </transition>
    </div>
</template>

<script>
    const fun = require('../../Common/commonFun.js')
    import {
        returnDetail,
        purchaseQueryListData,
        manualArriveComplete,
        remit,
        returnUndo,
        purchaseUndo,
        returnCollect
    } from '@/api'
    import materialListFinancialDetails from '../materialList/materialList-financial-details.vue'
    import newReturn from './new-return'
    import printTemplateBtn from '../printTemplateBtn'
    import {
        MPRFieldConfigList
    } from '@/api/material.js'
    export default {
        data() {
            return {
                newReturnPurchaseDialog:false,
                centerDialogVisible: false, //判断显示图片预览显示与隐藏
                imgLists: [],
                imgIndex: 0,
                header: {
                    lines: '应收金额',
                    collection: '已收款',
                    associated: '关联应付单号'
                },
                pickerOptions0: {
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 8.64e7;
                    }
                },
                form: {
                    supplierName: '',
                    orderNo: '',
                    expectDateEnd: '',
                    dateCreated: '',
                    storehouseName: '',
                    creatorName: '',
                    remark: '',
                    purchase: {},
                    arrive: {},
                    remittance: {}
                },
                // specific: ['到料单号', '到料日期', '采购单号', '商品款号', '生产单号'],
                // specific1: ['商品款号', '生产单号', '计划采购'],
                paymentShow: false,
                loading: false,
                isDeleteVisible: false,
                payForm: {
                    amount: '',
                    supplierId: '',
                    userCreated: '',
                    operatorId: '',
                    dateOperated: '',
                    billMaterialPurchaseId: ''
                },
                purchaser: [],
                supplier: [],
                supplierList: [],
                purchaserList: [],
                cancel:false,
                orderStatusV: '',//是否撤销
                undoPeople: '',//撤销人
                urlSupplier: [],//从url获取的供应商信息
                configArr:[],       //配置表头数组
                canShow: false      //控制是否显示表格
            }
        },
        filters: {
            filterTime(val) {
                if (val) {
                    return val.slice(0, 11);
                } else {
                    return "未设置"
                }
            }
        },
        components: {
            materialListFinancialDetails,
            printTemplateBtn,
            newReturn
        },
        computed: {
            userId() {
                return (this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem("user_login")).userId);
            },
            unitId() {
                return JSON.parse(sessionStorage.getItem("last_login")).id
            }
        },
        watch: {
            '$route.query.id':function (val) {
                if(val){
                    this.getDetailFilter();
                    this.purchaseQueryListData();
                    this.getUrlSupplier();
                }
            }
        },
        methods: {
            //获取动态配置数组
            getConfigArr(code) {
                let params = {
                    unitId: this.unitId,
                    moduleCode: code
                };
                MPRFieldConfigList(params).then(res => {
                    this.configArr = res.data.data.fieldConfigList;
                    //解决直接渲染表格错乱的问题
                    this.$nextTick(function(){
                        this.canShow = true;
                    })
                })
            },
            routerGoList(){
                this.$router.push('/returnMarteriel')
            },
            //重编辑
            repeatEditPurchases(){
                this.newReturnPurchaseDialog = true
            },
            hiddenNewPurchaseDialog(){
                this.newReturnPurchaseDialog = false
            },
            editAgainSucc(){
                this.newReturnPurchaseDialog = false
            },

            //从url获取供应商信息
            getUrlSupplier(){
                const urlVal = this.$route.query;
                if(urlVal.supplierId){
                    const supMes = {};
                    supMes.id = urlVal.supplierId;
                    if(urlVal.supplierName){
                        supMes.name = urlVal.supplierName;
                    }else{
                        supMes.name = '';
                    }
                    this.urlSupplier.push(supMes);
                }
            },
            // 接收撤销人和是否已经撤销
            orderStatus(v, v1) {
                this.orderStatusV = v
                // if(v) {
                //     this.cancel = v==1?false:true
                // }
                this.undoPeople = v1
            },
            // 图片预览
            imgList(row) {
                console.log(row.commonMaterialsPictureList);
                if(row.commonMaterialsPictureList[0].path){
                    this.imgIndex = 0;
                    this.imgLists = row.commonMaterialsPictureList;
                }else {
                    this.imgLists = []
                    row.commonMaterialsPictureList.forEach(item =>{
                        this.imgLists.push({path:item})
                    })
                }
                this.centerDialogVisible = true;
            },
            permissionsCxGo() {
                // 权限
                if (!this.powerJudgement.permissions("fac.returnOrder.refundDelete")) {
                    return
                }
                this.isDeleteVisible = true
            },

            goIncomingMateriel() {
                this.$router.push(`/materialAdd?type=add&id=${this.form.id}&supplierId=${this.form.supplierId}`)
            },
            // 流水记录撤销
            getUndo(row) {
                let params = {
                    remittanceId: row.actionId,
                    userId: this.userId
                }
                purchaseUndo(params).then(res => {
                    if (res.data.code == 0) {
                        this.$message.success('操作成功')
                        this.getDetailFilter();
                    } else {
                        this.$message.error(res.data.msg)
                    }
                })
            },
            // 采购单撤销
            getCancel() {
                //  /v1/api/material/purchase/cancel/采购单id的值?unitId=登录工厂id
                let params = {
                    userId: this.userId,
                    id: this.$route.query.id
                }
                returnUndo(params).then(res => {
                    if (res.data.code == 0) {
                        this.getDetailFilter()
                        //  this.loading = false
                        this.isDeleteVisible = false
                        this.$message.success('撤销成功')
                    } else {
                        this.$message.error(res.data.msg);
                    }
                })
            },
            //获取供应商、 业务员
            purchaseQueryListData() {
                let params = {
                    userId: this.userId,
                    factoryId: this.unitId
                };
                purchaseQueryListData(params).then(res => {
                    console.log(res);
                    this.supplierList = res.data.data.supplierList; // 供应商
                    this.purchaserList = res.data.data.purchaserList; // 业务员
                })
            },
            // 打开付款
            payOpen() {
                // 权限
                if (!this.powerJudgement.permissions("fac.returnOrder.getRefundReturnOrder")) {
                    return
                }
                this.payForm = {
                    supplierId: this.form.supplierId,
                    amount: '',
                    userCreated: '',
                    operatorId: '',
                    dateOperated: fun.dateFormatter(new Date(), false),
                    billMaterialPurchaseId: ''
                }
                this.paymentShow = true
            },
            remitSuccess() {
                if (!this.payForm.operatorId) {
                    this.$message.error('请选择业务员');
                    return;
                }
                if (!this.payForm.dateOperated) {
                    this.$message.error('请选择日期');
                    return;
                }
                if (!this.payForm.amount) {
                    this.$message.error('请填写付款金额');
                    return;
                }
                let params = {
                    dateCollect: this.payForm.dateOperated ? fun.dateFormatter(this.payForm.dateOperated, false) : '',
                    unitId: this.unitId,
                    supplierId: this.payForm.supplierId,
                    updaterId: this.userId,
                    creatorId: this.payForm.operatorId,
                    collectTotal: this.payForm.amount,
                    billReturnId: this.$route.query.id
                };
                returnCollect(params).then(res => {
                    console.log(res)
                    if (res.data.code == 0) {
                        this.getDetailFilter()
                        this.paymentShow = false;
                        this.$message.success('付款成功');
                    } else {
                        this.$message.error(res.data.msg);
                    }
                })

            },
            //手动到齐
            manualArrive(val, item) {
                console.log(val, item);
                let params = {
                    billMaterialPurchaseId: val.billMaterialPurchaseId,
                    facMissionNo: val.facMissionNo,
                    materialSkuId: item.materialsSkuId
                };
                manualArriveComplete(params).then(res => {
                    this.getDetailFilter();
                    console.log(res);
                })
            },
            // 获取详情
            getDetailFilter() {
                this.loading = true
                returnDetail({id: this.$route.query.id}).then(res => {
                    this.form = res.data.data;
                    this.cancel = res.data.data.cancel
                    this.loading = false
                })
            },
            // renderHeader(createElement, {column, $index}) {
            //     return <div class="table-header">
            //         {
            //             this.specific.map(item =>{
            //             return <div >{item}</div>
            //         })
            // }
            // </div>;
            // },
            // renderHeader1(createElement, {column, $index}) {
            //     return <div class= "table-header1" >
            //         {
            //             this.specific1.map(item => {
            //             return <div> {item} </div>
            //         })
            // }
            // </div>;
            // },
        },
        created() {
            // PURCHASE 采购单, ARRIVE 到料单, DELIVER 送料单, RETURN 退料单
            this.getConfigArr('RETURN');
            this.getDetailFilter();
            this.purchaseQueryListData();
            this.getUrlSupplier();
        }
    }
</script>

<style lang="scss" scoped>
    .detail-purchase {
        .cancel-img {
            height:98px;
            width:98px;
            transform: rotate(15deg);
            position: absolute;
            right:-10px;
            top: 34px;
            z-index: 1;
        }
        background-color: #fff;
        width: 100%;
        .need-filter {
            margin-bottom: 10px;
            width: 100%;
            box-sizing: border-box;
            .el-row {
                &:last-child {
                    margin-bottom: 0;
                }
            }
            .grid-content {
                min-height: 32px;
                display: flex;
                justify-content: flex-start;
                align-items: center;
                position: relative;
                .label-name {
                    display: inline-block;
                    width: 72px;
                    font-size: 12px;
                    text-align: right;
                    margin-right: 10px;
                }
            }
            .red-star {
                font-size: 12px;
                color: #FA4150;
            }
        }
        .header {
            background-color: #F0F2F5;
            padding-top: 16px;
        }
        .detail-table {
            padding: 24px;
        }
        .footer {
            padding-top: 12px;
            background-color: #F0F2F5;
        }
        .pay-title {
            font-weight: 700;
            text-align: center;
            font-size: 16px;
            height: 39px;
            line-height: 40px;
            border-bottom: 1px solid #E6EAF0;
        }
        .materialList-financial-details-details {
            background-color: #fff;
            padding: 15px 24px 24px 24px;
            margin-bottom: 12px;
        }
    }

    .select-table {
        // padding: 0 16px;
        .specific-table {
            padding: 0;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            border-bottom: 1px solid rgb(223, 228, 236);
            &:last-child {
                border: none;
            }
            div {
                height: 32px;
                display: flex;
                justify-content: center;
                align-items: center;
                width:100%;
                /*border-right: 1px solid rgb(223, 228, 236);*/
                /*&:nth-child(1) {*/
                    /*width: 134px;*/
                /*}*/
                /*&:nth-child(2) {*/
                    /*width: 96px;*/
                /*}*/
                /*&:nth-child(3) {*/
                    /*width: 120px;*/
                /*}*/
                /*&:nth-child(4) {*/
                    /*width: 80px;*/
                /*}*/
                /*&:nth-child(5) {*/
                    /*border: none;*/
                    /*width: 130px;*/
                /*}*/
            }
        }
        .specific-table1 {
            padding: 0;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            border-bottom: 1px solid rgb(223, 228, 236);
            &:last-child {
                border: none;
            }
            div {
                height: 32px;
                display: flex;
                justify-content: center;
                align-items: center;
                border-right: 1px solid rgb(223, 228, 236);
                &:nth-child(1) {
                    width: 72px;
                }
                &:nth-child(2) {
                    width: 96px;
                }
                &:nth-child(3) {
                    width: 68px;
                    border: none;
                }
            }
        }
        .this {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            background-color: #F5F7FA;
        }
    }

    .table-census {
        font-weight: 500;
        height: 32px;
        background-color: #f7f9fc;
        border-right: 1px solid rgb(223, 228, 236);
        border-left: 1px solid rgb(223, 228, 236);
        border-top: 1px solid rgb(223, 228, 236);
        display: flex;
        align-items: center;
        padding-left: 14px;
        box-sizing: border-box;
        .last-span {
            display: inline-block;
            margin-left: 20px;
        }
    }

    .center-block {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 32px;
        border-bottom: 1px solid rgb(223, 228, 236);
        &:last-child {
            border: none;
        }
    }

    .table-search {
        height: 32px;
        margin: 0 16px;
        border-right: 1px solid rgb(223, 228, 236);
        border-left: 1px solid rgb(223, 228, 236);
        border-bottom: 1px solid rgb(223, 228, 236);
    }

    .add-table {
        padding: 20px 16px;
    }

    .search-table {
        padding: 20px 16px;
    }

    /*.table-header {*/
        /*display: flex;*/
        /*font-size: 12px;*/
        /*font-weight: 600;*/
        /*div {*/
            /*display: flex;*/
            /*justify-content: center;*/
            /*align-items: center;*/
            /*border-right: 1px solid rgb(223, 228, 236);*/
            /*height: 28px;*/
            /*width: 100%;*/
            /*&:nth-child(1) {*/
                /*width: 120px;*/
            /*}*/
            /*&:nth-child(2) {*/
                /*width: 96px;*/
            /*}*/
            /*&:nth-child(3) {*/
                /*width: 120px;*/
            /*}*/
            /*&:nth-child(4) {*/
                /*width: 80px;*/
            /*}*/
            /*&:nth-child(5) {*/
                /*width: 130px;*/
                /*border: none;*/
            /*}*/
        /*}*/
    /*}*/

    /*.table-header1 {*/
        /*display: flex;*/
        /*// justify-content:space-between;*/
        /*font-size: 12px;*/
        /*font-weight: 600;*/
        /*div {*/
            /*display: flex;*/
            /*justify-content: center;*/
            /*align-items: center;*/
            /*border-right: 1px solid rgb(223, 228, 236);*/
            /*height: 28px;*/
            /*&:nth-child(1) {*/
                /*width: 72px;*/
            /*}*/
            /*&:nth-child(2) {*/
                /*width: 96px;*/
            /*}*/
            /*&:nth-child(3) {*/
                /*width: 68px;*/
                /*border: none;*/
            /*}*/
        /*}*/
    /*}*/

    .center-block {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 32px;
        border-bottom: 1px solid rgb(223, 228, 236);
        &:last-child {
            border: none;
        }
    }

    .blue-text {
        color: #1CA1FF;
        margin-right: 32px;
        i {
            display: inline-block;
            border: 2px solid #1CA1FF;
            height: 10px;
            vertical-align: middle;
            margin-top: -2px;
            margin-right: 4px;
        }
    }

    .look {
        color: #1CA1FF;
        text-decoration: underline;

    }

    .mgt17 {
        margin-top: 17px;
    }

    .center {
        text-align: center;
    }

    .text-line {
        text-decoration: underline;
        cursor: pointer;
        color: #808080;
        display: inline-block;
        // text-align: center;
    }

    .king {
        color: #FF7F14;
    }

    .red {
        color: red;
    }

    .green {
        color: #23C811;
        text-decoration: none !important;
    }

    .blue {
        color: #1CA1FF;
    }
</style>
<style lang="scss">
    @import '../../../assets/style/el-table.scss';

    .detail-purchase {
        /*.el-table th > .cell {*/
            /*padding: 0 !important;*/
        /*}*/
        .pay {
            // width:30% !important;
            width: 400px !important;
            .el-date-editor.el-input, .el-select {
                width: 125px !important;
            }
        }
        .el-dialog__header {
            padding: 0 !important;
        }
        .el-dialog__footer {
            border-top: 1px solid rgb(191, 200, 217) !important;
            text-align: center;
        }
        .pay-form {
            .el-input__inner {
                border: none !important;
                width: 100% !important;
            }
            .mgl30 {
                margin-left: 30px !important;
            }
            .mgl44 {
                margin-left: 44px !important;
            }
            .width220 {
                width: 220px !important;
                border: 1px solid rgb(191, 200, 217) !important;
            }
        }
        .select-table {
            .el-table__body {
                .cell,
                td {
                    padding: 0;
                }
            }
            .el-table .cell {
                line-height: 32px;
            }
        }
    }

    .table-search .el-input__inner {
        border: none;
        height: 32px;
    }

    .this .el-input__inner {
        border: none;
        height: 32px;
        width: 100%;
        background-color: #F5F7FA;
    }

    .materiel-header {
        .el-checkbox__inner {
            height: 16px;
            width: 16px;
        }
        .el-checkbox__label {
            font-size: 12px;
            font-weight: 500;
            color: #97a5bd;
        }
    }

</style>

