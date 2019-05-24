<template>
    <div class="detail-purchase scroll-content">
        <div class="custom-tab-bar pdlr24">
            <div class="bar-list" style="min-width:212px; ">
                <div @click="showTab(0)" :class="['item',currentTab===0?'active':'']">{{isSampleMaterial?'样料采购单详情':'采购单详情'}}</div>
                <div @click="showTab(1)" :class="['item',currentTab===1?'active':'']">到料详情</div>
                <div v-if="showFinance" @click="showTab(2)" :class="['item',currentTab===2?'active':'']">财务收支</div>
            </div>
            <div>
                <nf-button fsize='12' @click="routerGoList">
                    返回上级
                </nf-button>
            </div>
        </div>
        <div v-loading="loading" class="main-content pdlr24 mgt16 ">
            <!--采购单详情-->
            <div v-show="currentTab==0" class="purchase-detail">
                <!--基本信息-->
                <div class="base-info">
                    <el-row :gutter="20">
                        <el-col v-if="isSampleMaterial" :span="6">
                            <div class="grid-content">
                                <div class="label-name">设计款号:</div>
                                <div>{{form.designStyleNo }}</div>
                            </div>
                        </el-col>
                        <el-col :span="6">
                            <div class="grid-content">
                                <div class="label-name">物料供应商:</div>
                                <div>{{form.supplierName}}</div>
                            </div>
                        </el-col>
                        <el-col :span="6">
                            <div class="grid-content">
                                <div class="label-name">采购单号:</div>
                                <div>{{form.orderNo}}</div>
                            </div>
                        </el-col>
                        <el-col v-if="!isSampleMaterial" :span="6">
                            <div class="grid-content">
                                <div class="label-name">预计货期:</div>
                                <div>{{form.expectDateEnd | filterTime}}</div>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="6">
                            <div class="grid-content">
                                <div class="label-name">采购日期:</div>
                                <div>{{form.datePurchase | filterTime}}</div>
                            </div>
                        </el-col>
                        <el-col :span="6">
                            <div class="grid-content">
                                <div class="grid-content">
                                    <div class="label-name">采购员:</div>
                                    <div>{{form.creatorName}}</div>
                                </div>
                            </div>
                        </el-col>
                        <el-col :span="6" class="plan-tab">
                            <div class="grid-content">
                                <div class="label-name">备注信息:</div>
                                <div class="red">{{form.remark}}</div>
                            </div>
                        </el-col>
                    </el-row>
                    <img v-if="cancel" class="img" src="../../../../../static/images/pic-cancel.png"/>
                </div>
                <!-- 打印按钮 -->
                <div style="position: absolute;right: 24px;top: 12px;">
                    <print-template-btn name="采购单" type="purchase" :id="form.id"></print-template-btn>
                </div>
                <!-- 采购详情 -->
                <div class="table-census">
                    <div class="blue-text"><i></i>采购详情</div>
                    <span>物料SKU：<span class="king" v-if="purchases">{{purchases.length}} 款</span></span>
                    <span class="last-span">采购金额：<span class="king">￥{{form.purchase.amountTotal}}</span></span>
                </div>
                <div ref="detailPurchaseContent" class="main-content">
                    <el-table
                            :height="tableHeight"
                            class="custom-table tiny-row no-hover-highlight"
                            :data="purchases"
                            border
                            style="width: 100%;margin-bottom: 12px">
                        <el-table-column
                                v-for="column in purchaseDetail.fieldConfigList"
                                :key="column.code"
                                :prop="column.code"
                                :label="column.name"
                                :min-width="column.width"
                                :render-header="()=>renderHeader(column.name)"
                        >
                            <template slot-scope="scope">
                                <div class="custom-cell pdlr10">
                                    <img @click="previewImg(scope.row)" v-if="column.name ==='图片'" v-errorLogo
                                         style="display:inline-block;vertical-align: middle;width: 24px;height: 24px;"
                                         :src="scope.row[column.code]"/>

                                    <div v-else-if="column.name ==='供应商款号/色号'" >
                                        {{scope.row.supplierStyleNo}}/{{scope.row.supplierColorNo}}
                                    </div>
                                    <div v-else-if="column.name ==='采购金额'">
                                        <span v-if="scope.row[column.code]">¥{{scope.row[column.code]}}</span>
                                    </div>
                                    <div v-else-if="column.name ==='合计采购数'">
                                        <span>{{scope.row[column.code]}}{{scope.row.purchaseUnitName}}</span>
                                    </div>
                                    <div v-else-if="column.name ==='采购单价'">
                                        <span>{{scope.row[column.code]}}元/{{scope.row.purchaseUnitName}}</span>
                                    </div>
                                    <div v-else-if="column.name ==='合计采购'">
                                        {{scope.row[column.code]}}{{scope.row.unit}}
                                    </div>
                                    <div v-else-if="column.name ==='合计未到'">
                                        <span :class="[{'green':scope.row[column.code]==0},{'red':scope.row[column.code]>0}]" class="green">{{scope.row[column.code]}}</span>
                                    </div>
                                    <div v-else-if="column.name ==='样料'">
                                        {{scope.row[column.code]?'样料':''}}
                                    </div>
                                    <div v-else>{{scope.row[column.code]}}</div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column
                                v-if="!isSampleMaterial"
                                label="操作"
                                fixed="right"
                                width="95"
                                type="expand">
                            <template slot-scope="props">
                                <div>
                                    <el-table class="custom-table no-hover-highlight tiny-row"
                                              :data="props.row.materialsSkus"
                                              style="width: 100%">
                                        <el-table-column prop="styleNo" label="商品款号" width="160">
                                        </el-table-column>
                                        <el-table-column prop="demandSourceBillNo" label="生产单号" width="160">
                                            <template slot-scope="scope">
                                                {{scope.row.demandSourceBillNo&&scope.row.demandSourceBillNo.length?scope.row.demandSourceBillNo :' 计划外采购'}}
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="planBuyQuantity" label="计划采购" width="80">
                                        </el-table-column>
                                        <el-table-column  prop="stockActivePreuse" label="主动占用" width="80">
                                        </el-table-column>
                                        <el-table-column
                                                :render-header="()=>renderHeader('本次采购')"
                                                prop="quantity" label="本次采购" width="90">
                                            <template slot-scope="scope">
                                                {{scope.row.quantityStockUnitPurchase}}{{props.row.unit}}
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="quantityArrived" label="采购已到" width="80">
                                        </el-table-column>
                                        <el-table-column prop="unArrivedPurchaseQuantity" label="采购未到" width="80">
                                            <template slot-scope="scope">
                                                <span :class="[{'green':scope.row.unArrivedPurchaseQuantity==0},{'red':scope.row.unArrivedPurchaseQuantity>0}]"
                                                      class="green">{{scope.row.unArrivedPurchaseQuantity}}</span>
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="是否到齐" min-width="80">
                                            <template slot-scope="scope">
                                                <div @click="manualArrive(props.row,scope.row)">
                                                    <span v-if="scope.row.arriveStatus=='2'">已到齐</span>
                                                    <span v-else class="text-line">手动到齐</span>
                                                </div>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </div>
                            </template>
                        </el-table-column>



                    </el-table>
                </div>
                <div style="margin:0 -24px;background:#F0F2F5;padding-top: 16px;">
                    <nf-button @click="columnConfigVisible = true" style="background: #fff"  fsize='12'>表头配置</nf-button>
                    <nf-button fsize='12' style="background: #fff;margin-left: 8px;" @click="permissionsCx" :disabled="cancel">撤销</nf-button>
                    <nf-button fsize='12' style="background: #fff;margin-left: 8px;" v-if="form.repeatEdit" @click="repeatEditPurchases">重编辑</nf-button>
                    <nf-button :disabled="cancel" fsize='12' style="background: #fff;margin-left: 8px;"
                               @click="$router.push({path: '/newReturnMarteriel',query:{supplierId: form.supplierId}})">退料
                    </nf-button>
                </div>

            </div>
            <!--到料详情-->
            <div v-show="currentTab==1" class="arrive-detail">
                <div class="table-census">
                    <div class="blue-text"><i></i>到料记录</div>
                    <span>到料金额:<span class="king">￥{{form.arrive&&form.arrive.amountTotal || 0}}</span></span>
                    <nf-button v-if="materielBtnShow" :disabled="cancel"
                               style="width:64px;height:24px;font-size:12px; line-heihgt:24px;padding:0;margin-left:32px;"
                               type="warning" @click="goIncomingMateriel">开到料单
                    </nf-button>
                </div>
                <div ref="arriveDetailContent" class="main-content">
                    <el-table
                            :row-class-name="tableRowClassName"
                            class="custom-table tiny-row no-hover-highlight"
                            :height="tableHeight"
                            :data="arrives"
                            border
                            style="width: 100%">
                        <el-table-column prop="orderNo" label="到料单号" width="120"></el-table-column>
                        <el-table-column prop="dateCreated" label="到料日期" width="90">
                            <template slot-scope="scope">
                                {{scope.row.dateCreated | filterTime}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="storehouseName" label="到料仓库" width="140"></el-table-column>
                        <el-table-column prop="creatorName" label="到料员" width="90"></el-table-column>
                        <el-table-column prop="kindName" label="分类" width="90">
                        </el-table-column>
                        <el-table-column  label="图片" width="80">
                            <template slot-scope="scope">
                                <div>
                                    <img @click="previewImg(scope.row)"  v-errorLogo
                                         style="display:inline-block;vertical-align: middle;width: 24px;height: 24px;"
                                         :src="scope.row.commonMaterialsSkuPicture"/>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="materialsNo" label="物料款号" width="90">
                        </el-table-column>
                        <el-table-column prop="sampleMaterial" label="样料" v-if="isSampleMaterial" width="90">
                            <template slot-scope="scope">
                                {{scope.row.sampleMaterial?'样料':''}}
                            </template>
                        </el-table-column>
                        <el-table-column label="供应商款号/色号" width="140">
                            <template slot-scope="scope">
                                <div>
                                    {{scope.row.supplierColorNo}}/{{scope.row.supplierStyleNo}}
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="materialsName" label="物料名称" width="120">
                            <template slot-scope="scope">
                                <div>
                                    {{scope.row.materialsName || scope.row.materialsNo}}
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="colorName" label="颜色">
                            <template slot-scope="scope">
                                <div>
                                    {{scope.row.colorName || scope.row.colorValue}}
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="specificationsRemark" label="规格">
                            <template slot-scope="scope">
                                <div>
                                    {{scope.row.specificationsRemark || scope.row.specificationsNo}}
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="商品款号" width="120" v-if="!isSampleMaterial">
                            <template slot-scope="scope">
                                <div>
                                    {{scope.row.styleNo}}
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="生产单号" width="160"  v-if="!isSampleMaterial">
                            <template slot-scope="scope">
                                <div>{{scope.row.demandSourceBillNo?scope.row.demandSourceBillNo:'计划外采购'}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="计划采购"  v-if="!isSampleMaterial">
                            <template slot-scope="scope">
                                <div>{{scope.row.planBuyQuantity}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="到料数" width="120">
                            <template slot-scope="scope">
                                <div>
                                    {{scope.row.quantityArrived}} {{scope.row.purchaseUnitName}}
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column
                                :render-header="()=>renderHeader('本次采购')"
                                label="本次采购" width="130" >
                            <template slot-scope="scope">
                                <div>{{scope.row.quantityStockUnit}} {{scope.row.unit}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="quantityArrived" label="本次到料" width="130" >
                            <template slot-scope="scope">
                                <div>
                                    {{scope.row.quantityStockUnitArrived}} {{scope.row.unit}}
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="quantityArrived" label="到料转化率" width="90" >
                            <template slot-scope="scope">
                                <div>
                                    {{scope.row.conversionRate}}
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column  label="到料单价" width="90" >
                            <template slot-scope="scope">
                                <div>
                                    {{scope.row.priceUnit}}元/{{scope.row.purchaseUnitName}}
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="priceTotal" label="到料总额" width="90" >
                            <template slot-scope="scope">
                                <div>￥{{scope.row.priceTotal || 0}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column fixed="right" label="操作" width="90" >
                            <template slot-scope="scope">
                                <el-button type="text" size="small" class="look"
                                           @click="$router.push({path:'/materialDetail',query:{id: scope.row.billMaterialPurchaseId}})">
                                    查看详情
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
            <div v-if="showFinance" v-show="currentTab==2" class="materialList-financial-details-details">
                <materialList-financial-details
                        :title="'应付详情'"
                        :header="header"
                        :flag="'NEED_PAY'"
                        :cancelFlag="cancel"
                        :urlSupplier="urlSupplier"
                        @orderStatus="orderStatus">
                </materialList-financial-details>
            </div>
        </div>

        <!-- 撤销窗口 -->
        <el-dialog class="custom-dialog tip-dialog" :visible.sync="isDeleteVisible" :show-close="false"
                   :close-on-click-modal="false" size="tiny">
            <div class="text-center">
                <icon w="80" h="80" type="icon-gongdan-jiedianjingbao-da"></icon>
                <p class="tip-text">是否确定撤销当前采购单</p>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="isDeleteVisible = false">取 消</el-button>
                <el-button :disabled="isSaving" type="primary" @click="getCancel()">确认</el-button>
            </div>
        </el-dialog>
        <!-- 付款弹窗 -->
        <el-dialog
                :visible.sync="paymentShow"
                width="20%"
                :show-close="false"
                custom-class="pay"
                top="30%">
            <div slot="title" class="pay-title">付款</div>
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

        <transition name="right-move">
            <new-purchase
                    :isSampleMaterial="isSampleMaterial"
                    :isEdit="true"
                    :isPickUpDelivery="false"
                    :visible.sync="newPurchase.visible"
                    v-if="newPurchase.visible"
                    :detailPurchasedata="newPurchase.detailPurchasedata"
                    @success="getDetailFilter"></new-purchase>
        </transition>
        <transition name="opcity">
            <div style="z-index: 999" class="cover" v-if="newPurchase.visible" @click="newPurchase.visible = false">
            </div>
        </transition>
        <!--表头配置-->
        <dynamic-column-config
                :visible.sync="columnConfigVisible"
                :title="isSampleMaterial?'样料采购单详情表头配置':'采购单详情表头配置'"
                :targetType="isSampleMaterial?'SAMPLE_PURCHASE_DETAILS':'PURCHASE_DETAILS'"
                @confirm="getFieldConfigCodeAndNameList"
        ></dynamic-column-config>
        <!--图片预览-->
        <nf-previewer ref="previewer" value="path" :list="previewList"></nf-previewer>
    </div>
</template>

<script>
    const fun = require('../../../Common/commonFun.js')
    import materialListFinancialDetails from '@/components/material/materialList/materialList-financial-details.vue'
    import {
        purchaseDetail,
        purchaseQueryListData,
        manualArriveComplete,
        remit,
        cancel,
        purchaseUndo,
        purchaseFacFieldConfigCodeAndNameList
    } from '@/api/material.js'
    import {getNeedPayNeedReceiveOrderByMaterialArriveOrderId} from '@/api'
    import NewPurchase from '../new-purchase/new-purchase'
    import printTemplateBtn from '../../printTemplateBtn'
    import DynamicColumnConfig from "../dynamicColumnConfig";

    export default {
        data() {
            return {
                currentTab:0,
                columnConfigVisible:false,
                tableHeight:300,
                purchaseDetail: {
                    fieldConfigList: [],
                    fixedLeft:[],
                    fixedRight:[]
                },
                // 图片预览
                previewList:[],
                newPurchase:{
                    visible:false,
                    detailPurchasedata:{}
                },

                financialDataGetData:[],
                centerDialogVisible: false, //判断显示图片预览显示与隐藏
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

                paymentShow: false,
                loading: false,
                isDeleteVisible: false,
                materielBtnShow: false, // 开料单按钮
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
                purchases: [], // 采购详情
                arrives: [], // 到料记录
                cancel: false,
                header: {
                    lines: '应付金额',
                    collection: '已核销',
                    associated: '关联应收单号'
                },
                urlSupplier: [],//从url获取的供应商信息
                showFinance:false,//是否显示收支详情模块
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
        computed: {
            userId() {
                return (this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem("user_login")).userId);
            },
            unitId() {
                return JSON.parse(sessionStorage.getItem("last_login")).id
            },
            isSampleMaterial() {
                return this.$route.path === '/detailSamplePurchase'
            }
        },
        components: {
            materialListFinancialDetails,
            NewPurchase,
            printTemplateBtn,
            DynamicColumnConfig
        },
        methods: {
            tableRowClassName(row, index) {

                if(row.isStripe){
                    return 'gray-bg'
                }

                return ''
            },
            // 预览图片
            previewImg(row){
                if (!row.commonMaterialsPictureList || !row.commonMaterialsPictureList.length) return;
                this.previewList = row.commonMaterialsPictureList.map(item => {
                    return {
                        path: item
                    }
                });
                this.$nextTick(() => {
                    this.$refs["previewer"].show(0)
                });
            },
            // 获取表格要显示的列
            getFieldConfigCodeAndNameList(){
                let params = {
                    unitId:this.unitId,
                    targetType:this.isSampleMaterial?'SAMPLE_PURCHASE_DETAILS':'PURCHASE_DETAILS'
                }
                this.purchaseDetail.fieldConfigList = []
                purchaseFacFieldConfigCodeAndNameList(params).then(res =>{
                    if( res.data.code===0 ){
                        let tempList = res.data.data
                        tempList.forEach(column =>{
                            switch (column.name){
                                case '图片' :column.width = 70;break;
                                case '生产单号' :column.width = 160;break;
                                case '设计款号' :column.width = 180;break;
                                case '供应商款号/色号' :column.width = 180;break;

                                default:column.width = 120;break;
                            }

                        })
                        this.purchaseDetail.fieldConfigList = res.data.data
                    }

                })

            },
            // 切换tab
            showTab(tabIndex){
                this.currentTab = tabIndex
                this.$nextTick(function (e) {
                    switch (this.currentTab){
                        case 0 :this.tableHeight = this.$refs.detailPurchaseContent.offsetHeight-24 ;break;
                        case 1 :this.tableHeight = this.$refs.arriveDetailContent.offsetHeight-24 ;break;
                    }
                })
            },
            // 返回列表
            routerGoList(){
                this.$store.dispatch('deleteVisitedView', this.$route);
                this.$router.go(-1)
            },
            //重编辑
            repeatEditPurchases(){
                this.newPurchase.visible = true
            },
            //从url获取供应商信息
            getUrlSupplier() {
                const urlVal = this.$route.query;
                if (urlVal.supplierId) {
                    const supMes = {};
                    supMes.id = urlVal.supplierId;
                    if (urlVal.supplierName) {
                        supMes.name = urlVal.supplierName;
                    } else {
                        supMes.name = '';
                    }
                    this.urlSupplier.push(supMes);
                }
            },
            // 接收撤销人和是否已经撤销
            orderStatus(v, v1) {
                this.orderStatusV = v
                this.undoPeople = v1
            },
            //计算已到料数，显示不同class
            // changeTypeClass(item) {
            //     const quantityArrived = item.quantityArrived;   //已到料
            //     const unArrivedPurchaseQuantity = item.unArrivedPurchaseQuantity;   //采购未到
            //     const quantity = item.quantity;      //本次采购
            //     const planBuyQuantity = item.planBuyQuantity;       //采购计划
            //     const sum = quantityArrived + unArrivedPurchaseQuantity + quantity;
            //     if (quantityArrived >= 0 && unArrivedPurchaseQuantity >= 0 && quantity >= 0 && planBuyQuantity >= 0 && sum > 0) {
            //
            //         if (sum < planBuyQuantity) {
            //             return 'blue';
            //         } else if (sum >= planBuyQuantity) {
            //             return 'green'
            //         }
            //     }
            //
            // },
            // 撤销
            permissionsCx() {
                // 权限 !this.powerJudgement.permissions("fac.purchaseOrder.delete")
                if (!this.powerJudgement.permissions("fac.samplePurchaseOrder.repeal") ) {
                    return
                }
                this.isDeleteVisible = true
            },
            // 开到料单
            goIncomingMateriel() {
                // 权限
                if((!this.powerJudgement.permissions("fac.sampleArriveOrder.add"))){
                    return
                }
                if(this.isSampleMaterial){
                    this.$router.push(`/sampleMaterialAdd?type=add&id=${this.form.id}&supplierId=${this.form.supplierId}&supplierName=${this.form.supplierName}`)
                } else {
                    this.$router.push(`/materialAdd?type=add&id=${this.form.id}&supplierId=${this.form.supplierId}&supplierName=${this.form.supplierName}`)
                }
            },
            // 采购单撤销
            getCancel() {
                let params = {
                    userId: this.userId,
                    unitId: this.unitId,
                    id: this.form.id
                }

                //  this.loading = true
                cancel(params).then(res => {
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
                    this.supplierList = res.data.data.supplierList; // 供应商
                    this.purchaserList = res.data.data.purchaserList; // 业务员
                })
            },
            // 打开付款
            // payOpen() {
            //     this.payForm = {
            //         supplierId: this.form.supplierId,
            //         amount: '',
            //         userCreated: '',
            //         operatorId: '',
            //         dateOperated: fun.dateFormatter(new Date(), false),
            //         billMaterialPurchaseId: ''
            //     }
            //     this.paymentShow = true
            // },
            // remitSuccess() {
            //     if (!this.payForm.operatorId) {
            //         this.$message.error('请选择业务员');
            //         return;
            //     }
            //     if (!this.payForm.dateOperated) {
            //         this.$message.error('请选择日期');
            //         return;
            //     }
            //     if (!this.payForm.amount) {
            //         this.$message.error('请填写付款金额');
            //         return;
            //     }
            //     let params = {
            //         dateOperated: this.payForm.dateOperated,
            //         unitId: this.unitId,
            //         amount: this.payForm.amount,
            //         supplierId: this.payForm.supplierId,
            //         userCreated: this.userId,
            //         operatorId: this.payForm.operatorId,
            //         billMaterialPurchaseId: this.form.id
            //     };
            //     remit(params).then(res => {
            //         if (res.data.code == 0) {
            //             this.getDetailFilter()
            //             this.paymentShow = false;
            //             this.$message.success('付款成功');
            //         } else {
            //             this.$message.error(res.data.msg);
            //         }
            //     })
            //
            // },

            //手动到齐
            manualArrive(val, item) {
                let params = {
                    billMaterialPurchaseId: val.billMaterialPurchaseId,
                    demandSourceBillId: item.demandSourceBillId,
                    materialSkuId: item.materialsSkuId
                };
                manualArriveComplete(params).then(res => {
                    this.getDetailFilter();
                })
            },
            // 获取详情
            getDetailFilter() {
                this.loading = true
                purchaseDetail({billMaterialPurchaseId: this.$route.query.id}).then(res => {
                    this.loading = false
                    if(res.data.code == 0){
                        this.arrives = res.data.data.arrive ? res.data.data.arrive.arriveDetailList : [];
                        this.form = res.data.data;
                        this.cancel = res.data.data.cancel == 0 ? false : true;
                        this.purchases = res.data.data.purchase.purchases || []; // 采购详情
                        this.newPurchase.detailPurchasedata ={
                            form:this.form,
                            materialsSkus:this.purchases
                        }
                        // 组装编辑采购详情需要用到的
                        this.purchases.forEach(skuItem => {
                            if (skuItem.materialsSkus.some(item => item.arriveStatus != 2)) {
                                this.materielBtnShow = true
                            } else {
                                this.materielBtnShow = false
                            }
                        })

                    }

                })
            },
            getIsShowFinance() {
                getNeedPayNeedReceiveOrderByMaterialArriveOrderId({billMaterialArriveId: this.$route.query.id}).then(res => {
                    if(res.data.code == 0) {
                        this.showFinance = res.data.data.needPayNeedReceiveOrderId?true:false
                    }
                })
            },
            renderHeader(columnName){
                let title = ''
                switch(columnName){
                    case '本次采购':title ='本次采购/库存单位';break;
                    case '合计采购':title ='合计采购/库存单位';break;
                    case '合计采购数':title ='合计采购数/采购单位';break;
                }
                if(title){
                    return <div class="custom-header">
                        <span>{columnName}</span>
                        <el-tooltip effect="light" content={title}  placement="top"><i style='padding-left:5px' class='el-icon-information'></i></el-tooltip>
                    </div>
                } else {
                    return <div><span>{columnName}</span></div>

                }

            },
        },
        mounted() {
            this.$nextTick(() => {
                let self = this;
                switch (this.currentTab){
                    case 0 :this.tableHeight = this.$refs.detailPurchaseContent.offsetHeight-24 ;break;
                    case 1 :this.tableHeight = this.$refs.arriveDetailContent.offsetHeight-24 ;break;
                }

                // 通过捕获系统的onresize事件触发去改变原有的高度
                window.onresize = function () {
                        self.tableHeight = this.currentTab==0?
                            self.$refs.detailPurchaseContent.offsetHeight-24:self.$refs.arriveDetailContent.offsetHeight-24
                }

            })
        },
        created() {
            this.getFieldConfigCodeAndNameList();
            this.getDetailFilter();
            this.purchaseQueryListData();
            this.getUrlSupplier();
            this.getIsShowFinance();
        }
    }
</script>

<style lang="scss" scoped>
    .detail-purchase {
        box-sizing: border-box;
        .custom-tab-bar{
            background-color: #fff;
        }

        .purchase-detail {
            display: flex;
            flex-direction: column;
            height: 100%;
            position: relative;
            padding: 12px 24px 0;
            box-sizing: border-box;
            background-color: #fff;
            .main-content{
                flex: 1;
            }
            .base-info {
                font-size: 12px;
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
            }
        }
        .arrive-detail {
            display: flex;
            flex-direction: column;
            height: 100%;
            position: relative;
            padding: 12px 24px 0;
            box-sizing: border-box;
            background-color: #fff;
            .main-content{
                flex: 1;
            }
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
            height: 100%;
            background-color: #fff;
            overflow-y: auto;
        }
    }



    .table-census {
        font-size: 12px;
        font-weight: 500;
        height: 32px;
        background-color: rgb(238, 240, 246);
        border: 1px solid rgb(223, 228, 236);
        border-bottom: none;
        display: flex;
        align-items: center;
        padding-left: 14px;
        .last-span {
            display: inline-block;
            margin-left: 20px;
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
    .text-line {
        text-decoration: underline;
        cursor: pointer;
        color: #808080;
        display: inline-block;
    }

    .king {
        color: #FF7F14;
    }

    .img {
        height: 98px;
        width: 98px;
        transform: rotate(15deg);
        position: absolute;
        right: 24px;
        top: 57px;
        z-index: 1;
    }

</style>
<style lang="scss">
    .detail-purchase {
        padding-bottom: 12px;
        .el-table__expand-icon{
            height: 24px;
            top: 1px;
        }
        .el-table__expand-icon--expanded{
            height: 24px;
            transform: rotate(0);
            &.el-table__expand-icon:before{
                content: '收起详情';
                top: 1px;
                color: #1ca1ff;
            }
            .el-icon{
                transform: rotate(90deg);
            }
        }
        .el-table__expand-icon > .el-icon{
            left: 70px;
        }
        .el-table__expand-icon:before{
            content: '展开详情';
            color: #1ca1ff;
            position: absolute;
            left: 0;
            top: 1px;
        }
        .el-table__expanded-cell{
            height: auto;
            overflow: hidden;
            padding: 0;
            background-color:#FAFBFC ;
            /*.el-table__body-wrapper{*/
                /*padding-bottom: 12px;*/
            /*}*/
            .el-table{
                border: none;
                th .cell{
                    background-color: #EBEFF5;
                }
                .el-table__row,
                .el-input__inner{
                    background-color:#FAFBFC ;
                }

            }
        }
        /*.el-table__body-wrapper{*/
            /*border: none;*/
            /*&>table>tbody>tr:last-child .el-table__expanded-cell{*/
                /*padding-bottom: 15px;*/
            /*}*/
        /*}*/

        .pay {
            width: 400px !important;
            .el-date-editor.el-input, .el-select {
                width: 125px !important;
            }
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
        .gray-bg{
            background: #F7F9FC;
        }

    }

</style>

