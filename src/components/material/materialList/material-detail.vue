<template>
    <div class="material-detail">
        <!--<page-title :title="isSampleMaterial?'样料到料单详情':'到料单详情'">-->
            <!--<div class="btns">-->
                <!--<nf-button type="warning" style="margin-right: 10px;" v-if="form.repeatEdit" @click="repeatEditMaterial">重编辑</nf-button>-->
                <!--<nf-button @click="routerGoList">返回上级</nf-button>-->
            <!--</div>-->
        <!--</page-title>-->

        <div style="position: relative;">
            <el-tabs v-model="activeName" @tab-click="">
                <el-tab-pane label="到料单详情" name="first">
                    <div class="detail custom-filter-form">
                        <div style="display: flex;">
                            <!-- 详情信息 -->
                            <el-form style="flex: 1" :model="form" status-icon ref="form" label-width="100px" class="demo-ruleForm">
                                <el-row>
                                    <el-col :span="6">
                                        <el-form-item label="物料供应商:" class="form-item">
                                            <span>{{form.supplierName}}</span>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-form-item label="到料单号:">
                                            <span>{{form.orderNo}}</span>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-form-item label="到料日期:" prop="goodsNo">
                                            <span>{{form.dateArrive | filterTime}}</span>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-form-item label="到料员:">
                                            <span>{{form.creatorName}}</span>
                                            <img v-if="cancelFlag" class="cancel-img" src="../../../../static/images/pic-cancel.png"/>

                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col v-if="!isSampleMaterial" :span="6">
                                        <el-form-item label="供应商直发加工厂:" class="form-item" style="white-space: nowrap">
                                            <span>{{form.outsideFactoryName}}</span>
                                        </el-form-item>
                                    </el-col>
                                    <el-col v-if="!isSampleMaterial" :span="6">
                                        <el-form-item label="关联送料单:" class="form-item">
                                            <span @click="$router.push(`/payoffDetail?id=${form.billMaterialDeliveryId}&belongModule=0`)" style="text-decoration: underline;cursor: pointer;">{{form.billMaterialDeliveryNo}}</span>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-form-item label="到料仓库:" class="form-item">
                                            <span>{{form.storehouseName}}</span>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-form-item label="备注信息:">
                                            <span class="red">{{form.remark}}</span>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-form>
                            <!-- 打印按钮 -->
                            <div>
                                <print-template-btn name="到料单" type="arrive" :id="$route.query.id"></print-template-btn>
                                <!-- 标签打印 -->
                                <label-print-btn style="margin-left:8px;" :materialList="tableData.billPurchases" v-if="isSampleMaterial" :orderNo="form.orderNo"></label-print-btn>
                            </div>
                        </div>
                        <!-- 到料单详情 -->
                        <div class="table-census">
                            <span>本次到料:<span class="king" v-if="tableData.materialSkuList">{{tableData.materialSkuList.length}}</span></span>
                            <span class="last-span">到料总额：<span class="king" v-if="tableData">￥{{tableData.amountTotal || 0}}</span></span>
                        </div>
                        <el-row>
                            <el-table
                                    v-if="canShow"
                                    :data="tableData.materialSkuList"
                                    border
                                    style="width: 100%">

                                <el-table-column prop="kindName" label="分类" align="center"
                                                 min-width="110"></el-table-column>
                                <el-table-column label="图片" align="center" width="76">
                                    <template slot-scope="scope">
                                        <img v-if="scope.row.commonMaterialsPictureList&&scope.row.commonMaterialsPictureList.length"
                                             @click="imgList(scope.row)"
                                             style="width: 33px;height: 33px;margin-top: 4px;margin-left: 8px;"
                                             :src="scope.row.commonMaterialsPictureList[0]"
                                             alt="">
                                    </template>
                                </el-table-column>
                                <el-table-column prop="materialsNo" label="物料款号" align="center"
                                                 min-width="110"></el-table-column>
                                <el-table-column prop="materialName" label="物料名称" align="center"
                                                 min-width="110"></el-table-column>
                                <el-table-column prop="colorName" label="颜色" align="center"
                                                 min-width="110"></el-table-column>
                                <el-table-column prop="specificationsRemark" label="规格" align="center"
                                                 min-width="110"></el-table-column>
                                <el-table-column prop="specificationsNumber" label="供应商款号/色号" align="center"
                                                 min-width="110">
                                    <template slot-scope="scope">
                                        <div>{{scope.row.supplierStyleNo}}/{{scope.row.supplierColorNo}}</div>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="quantityPurchase" label="合计采购数(采购单位)" align="center"
                                                 min-width="120">
                                    <template slot-scope="scope">
                                        <div>{{scope.row.quantityPurchase}}{{scope.row.purchaseUnitName}}</div>
                                    </template>
                                </el-table-column>
                                <el-table-column label="合计采购(库存单位)" align="center"
                                                 min-width="110">
                                    <template slot-scope="scope">
                                        <div>{{scope.row.quantityStockUnitPurchase}}{{scope.row.unit}}</div>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="purchaseConversionRate" label="采购转化率" align="center"
                                                 min-width="110"></el-table-column>
                                <el-table-column prop="priceTotal" label="到料金额" align="center"
                                                 min-width="110">
                                    <template slot-scope="scope">
                                        <div>¥{{scope.row.priceTotal}}</div>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="quantity" label="合计到料数(采购单位)" align="center"
                                                 min-width="110">
                                    <template slot-scope="scope">
                                        <div>{{scope.row.quantity}}{{scope.row.purchaseUnitName}}</div>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="conversionRate" label="到料转化率" align="center"
                                                 min-width="110"></el-table-column>
                                <el-table-column prop="quantityArrive" label="合计到料(库存单位)" align="center"
                                                 min-width="110">
                                    <template slot-scope="scope">
                                        <div>{{scope.row.quantityArrive}}{{scope.row.unit}}</div>
                                    </template>
                                </el-table-column>
                                <el-table-column label="操作" fixed="right" align="center"
                                                 min-width="110">
                                    <template slot-scope="scope">
                                        <div @click="viewDetail(scope.row)" style="text-decoration: underline;cursor: pointer;color: #00a0e9">查看详情</div>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-row>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="验布和缩布" name="second">
                    <!-- 验布和缩布 -->
                    <div class="bottom-table">
                        <div class="title clearfix">
                            <div class="fl title-left">
                                <i></i> 验布和缩布
                            </div>
                            <div class="fr">
                                <nf-button style="width:64px;" @click="open('inspection')" :loading="isLoading"
                                           :disabled="checkDisabled || cancelFlag">验布
                                </nf-button>
                                <nf-button style="width:64px;" @click="open('shrunk')" :loading="isShrunkLoading"
                                           :disabled="shrunkDisabled || cancelFlag">缩布
                                </nf-button>
                            </div>
                        </div>
                        <el-row>
                            <el-table
                                    :data="bottomTableData"
                                    border
                                    style="width: 100%">
                                <template v-for="e in cols">
                                    <el-table-column
                                            v-if="e.prop == 'supplierStyleNo'"
                                            :prop="e.prop"
                                            :label="e.label"
                                            :key="e.prop"
                                            :align="e.center"
                                            :min-width="e.width">
                                        <div slot-scope="scope">{{scope.row.supplierStyleNo}}/{{scope.row.supplierColorNo}}</div>
                                    </el-table-column>
                                    <el-table-column
                                            v-else-if="e.prop == 'dateCheck'"
                                            :prop="e.prop"
                                            :label="e.label"
                                            :key="e.prop"
                                            :align="e.center"
                                            :width="e.width">
                                        <div slot-scope="scope">{{scope.row.dateCheck | filterTime}}</div>
                                    </el-table-column>
                                    <el-table-column
                                            v-else-if="e.prop == 'dateShrunk'"
                                            :prop="e.prop"
                                            :label="e.label"
                                            :key="e.prop"
                                            :align="e.center"
                                            :width="e.width">
                                        <div slot-scope="scope">{{scope.row.dateShrunk | filterTime}}</div>
                                    </el-table-column>
                                    <el-table-column
                                            v-else
                                            :prop="e.prop"
                                            :label="e.label"
                                            :key="e.prop"
                                            :align="e.center"
                                            :width="e.width">
                                    </el-table-column>
                                </template>
                                <el-table-column
                                        label="操作"
                                        align="center"
                                        width="100">
                                    <template slot-scope="scope">
                                        <el-button type="text" class="text-line" @click="undoOpen('rowUNdo', scope.row)" :disabled="cancelFlag">
                                            {{scope.row.checked == true&& scope.row.shrunked == false? '撤销验布' : '撤销缩布'}}
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-row>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="财务收支" v-if="showFinance" name="third">
                    <!--应付与应收详情 -->
                    <div class="materialList-financial-details-details">
                        <!--isSampleMaterial 为flase的时候表示当前页面是 '到料单详情'-->
                        <materialList-financial-details
                                title="应付详情"
                                :header="header"
                                :cancelFlag="cancelFlag"
                                :urlSupplier="urlSupplier"
                                :isSampleMaterial="!isSampleMaterial"
                                :flag="'NEED_PAY'">
                        </materialList-financial-details>
                    </div>
                </el-tab-pane>
            </el-tabs>
            <div style="position: absolute;right: 5px;top: 10px;">
                <nf-button @click="routerGoList">返回上级</nf-button>
            </div>
        </div>






        <!--撤销-->
        <div style="margin-top: 10px;">
            <nf-button :disabled="cancelFlag" style="width:64px;" @click="undoOpen('undo')">撤销
            </nf-button>
            <span v-if="cancelFlag">  撤销人:{{undoPeople}}</span>
            <nf-button style="margin-left: 10px;" v-if="form.repeatEdit&&!form.outsideFactoryId" @click="repeatEditMaterial">重编辑</nf-button>
        </div>

        <!-- 撤销窗口 -->
        <el-dialog class="custom-dialog tip-dialog" :visible.sync="isDeleteVisible" :show-close="false"
                   :close-on-click-modal="false" size="tiny">
            <div class="text-center">
                <icon w="80" h="80" type="icon-gongdan-jiedianjingbao-da"></icon>
                <p class="tip-text">{{undoTitle}}</p>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="isDeleteVisible = false">取 消</el-button>
                <el-button :disabled="isSaving" type="primary" v-if="undoType == 'undo'" @click="getUndo()">确认
                </el-button>
                <el-button :disabled="isSaving" type="primary" v-else @click="cancel(row)">确认</el-button>
            </div>
        </el-dialog>
        <!-- 验布弹窗 -->
        <el-dialog :visible.sync="inspectionShow" :show-close="false">
            <div slot="title" class="dialog-title">{{currerType == 'inspection'? '验布' : '缩布'}}</div>
            <el-form :model="inspectionForm" :inline="true">
                <el-form-item :label="currerType == 'inspection'?'验布日期': '缩布时间'" :label-width="100">
                    <el-date-picker
                            v-model="date"
                            type="date"
                            value-format="yyyy-MM-dd"
                            :picker-options="pickerOptions0"
                            placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item :label="currerType == 'inspection'?'验布员': '缩布员'">
                    <el-select v-model="name" placeholder="请选择" clearable filterable>
                        <el-option
                                v-for="item in purchaserList"
                                :key="item.id"
                                :label="item.userName"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-table
                        :data="inspectionData"
                        border
                        style="width: 100%; margin-top:15px;">
                    <template v-for="e in inspectionCols">
                        <el-table-column
                                v-if="e.prop == 'datePurchase'"
                                :prop="e.prop"
                                :label="e.label"
                                :key="e.prop"
                                :align="e.center"
                                :width="e.width">
                            <div slot-scope="scope">{{scope.row.datePurchase | filterTime}}</div>
                        </el-table-column>
                        <el-table-column
                                v-else-if="e.prop == 'supplierStyleNo'"
                                :prop="e.prop"
                                :label="e.label"
                                :key="e.prop"
                                :align="e.center"
                                min-width="90">
                            <div slot-scope="scope">{{scope.row.supplierStyleNo}}/{{scope.row.supplierColorNo}}</div>
                        </el-table-column>
                        <el-table-column
                                v-else-if="e.prop == 'specificationsRemark'"
                                :prop="e.prop"
                                :label="e.label"
                                :key="e.prop"
                                :align="e.center"
                                min-width="90">
                            <div slot-scope="scope">
                                {{scope.row.specificationsRemark?scope.row.specificationsRemark:scope.row.specificationsNo}}
                            </div>
                        </el-table-column>
                        <el-table-column
                                v-else
                                :prop="e.prop"
                                :label="e.label"
                                :key="e.prop"
                                :align="e.center"
                                :width="e.width">
                        </el-table-column>
                    </template>
                    <el-table-column prop="lengthCheck" label="验布长度" align="center" width="120">
                        <template slot-scope="scope">
                            <div class="cell-color" v-if="currerType == 'inspection'&&!scope.row.checked">
                                <el-input class="input" placeholder="请输入"
                                          v-model.number="scope.row.lengthCheck"></el-input>
                            </div>
                            <span v-else>{{scope.row.lengthCheck}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="lengthShrunk" label="缩布长度" align="center" width="120"
                                     v-if="currerType == 'shrunk'">
                        <template slot-scope="scope">
                            <span v-if="scope.row.shrunked">{{scope.row.lengthShrunk}}</span>
                            <div class="cell-color" v-else>
                                <el-input class="input" placeholder="请输入"
                                          v-model.number="scope.row.lengthShrunk"></el-input>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="inspectionShow = false">取 消</el-button>
                <el-button type="primary" v-if="currerType == 'inspection'" @click="save">确 定</el-button>
                <el-button type="primary" v-else @click="shrunkSave">确 定</el-button>
            </div>
        </el-dialog>
        <!--//图片预览-->
        <imgPreview @dialogClose="centerDialogVisible=false" :centerDialogVisible="centerDialogVisible"
                    :imgLists="imgLists" :imgIndex="imgIndex"></imgPreview>
        <transition name="right-move">
            <!--@editAgainSucc="editAgainSucc" ref="newMaterialGet" :detailMaterialdata="form"-->
            <materialAdd @close="newMaterialDialog=false" v-if="newMaterialDialog" @editAgainSucc="editAgainSucc" source="detailMaterial" :supplierId="form.supplierId" :supName="form.supplierName" :detailMaterialdata="form"></materialAdd>
        </transition>
        <transition name="opcity">
            <div class="cover1" v-if="newMaterialDialog" @click="hiddenNewMaterialDialog">
            </div>
        </transition>

        <add-by-order-detail-dialog :materialsSku="addByOrderRow" :visible.sync="addByOrderShow"></add-by-order-detail-dialog>

    </div>
</template>
<script>
    const fun = require('../../Common/commonFun.js')
    import {
        detail,
        materialSku,
        purchaseQueryListData,
        check,
        shrunk,
        undoCheck,
        undoShrunk,
        undo,
        getNeedPayNeedReceiveOrder,
        MPRFieldConfigList
    } from '@/api/material.js'
    import {getNeedPayNeedReceiveOrderByMaterialArriveOrderId} from '@/api'
    import materialListFinancialDetails from './materialList-financial-details.vue'
    import printTemplateBtn from '../printTemplateBtn'
    import materialAdd from './material-add'
    import labelPrintBtn from '../labelPrint/labelPrintBtn'
    import addByOrderDetailDialog from './components/addByOrderDetailDialog'

    export default {
        data() {
            return {
                showFinance: false, //是否显示财务收支
                addByOrderRow: {},
                addByOrderShow: false,
                activeName: 'first',
                newMaterialDialog: false, //重编辑
                centerDialogVisible: false, //判断显示图片预览显示与隐藏
                imgLists: [],
                imgIndex: 0,
                // 倒料表头字段
                header: {
                    lines: '应付金额',
                    collection: '已核销',
                    associated: '关联应收单号'
                },
                pickerOptions0: {
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 8.64e7;
                    }
                },
                form: {
                    billMaterialArriveId: '',
                    creatorName: '',
                    dateArrive: '',
                    remark: '',
                    storehouseName: '',
                    supplierName: ''
                },
                inspectionShow: false, // 验布
                isShrunkLoading: false, // 缩布
                isLoading: false, // 验布
                shrunkDisabled: false, // 验布
                checkDisabled: false, // 验布
                isDeleteVisible: false, // 撤销
                undoType: '', // 撤销
                row: {},
                undoTitle: '',
                tableData: [],
                bottomTableData: [],
                title: '',
                currerType: '',
                inspectionData: [], // 验布
                purchaserList: [],
                inspectionForm: {},
                name: '',
                date: '',
                inspectionCols: [ // 验布
                    {prop: 'orderNo', label: '到料单号', width: 90, center: 'center'},
                    {prop: 'datePurchase', label: '到料日期', width: 100, center: 'center'},
                    {prop: 'purchaserName', label: '到料员', width: 100, center: 'center'},
                    {prop: 'kindName', label: '分类', width: 100, center: 'center'},
                    {prop: 'materialsNo', label: '物料款号', width: 100, center: 'center'},
                    {prop: 'supplierStyleNo', label: '供应商款号/色号', width: 130, center: 'center'},
                    {prop: 'materialsName', label: '物料名称', width: 100, center: 'center'},
                    {prop: 'colorName', label: '颜色', width: 100, center: 'center'},
                    {prop: 'specificationsRemark', label: '规格', width: 100, center: 'center'},
                    {prop: 'unit', label: '库存单位', width: 100, center: 'center'},
                    {prop: 'quantityArrive', label: '合计到料', width: 100, center: 'center'}
                ],
                cols: [
                    {prop: 'kindName', label: '分类', width: 100, center: 'center'},
                    {prop: 'materialsNo', label: '物料款号', width: 100, center: 'center'},
                    {prop: 'supplierStyleNo', label: '供应商款号/色号', width: 130, center: 'center'},
                    {prop: 'materialsName', label: '物料名称', width: 100, center: 'center'},
                    {prop: 'colorName', label: '颜色', width: 100, center: 'center'},
                    {prop: 'specificationsNo', label: '规格', width: 100, center: 'center'},
                    {prop: 'unit', label: '库存单位', width: 100, center: 'center'},
                    {prop: 'totalArrive', label: '合计到料', width: 100, center: 'center'},
                    {prop: 'lengthCheck', label: '验布长度', width: 100, center: 'center'},
                    {prop: 'checkerName', label: '验布员', width: 100, center: 'center'},
                    {prop: 'dateCheck', label: '验布日期', width: 100, center: 'center'},
                    {prop: 'lengthShrunk', label: '缩布长度', width: 100, center: 'center'},
                    {prop: 'shrunkerName', label: '缩布员', width: 100, center: 'center'},
                    {prop: 'dateShrunk', label: '缩布日期', width: 100, center: 'center'}
                ],
                cancelFlag: false,//是否撤销
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
            materialAdd,
            labelPrintBtn,
            addByOrderDetailDialog
        },
        computed: {
            userId() {
                return (this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem("user_login")).userId);
            },
            unitId() {
                return JSON.parse(sessionStorage.getItem("last_login")).id
            },
            isSampleMaterial() {
                return  this.$route.path === '/sampleMaterialDetail'
            }
        },
        methods: {
            viewDetail(row) {
                this.addByOrderRow = row;
                this.addByOrderShow = true;
            },
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
                this.$store.dispatch('deleteVisitedView', this.$route);
                this.$router.go(-1)
            },
            // 重编辑
            repeatEditMaterial(){
                this.newMaterialDialog = true
            },
            hiddenNewMaterialDialog(){
                this.newMaterialDialog = false
            },
            //重编辑成功
            editAgainSucc(orderNoId,supplierId,supplierName){
                this.newMaterialDialog = false
                this.$store.dispatch('deleteVisitedLive', 'materialList');
                this.$router.replace({path:this.$route.path,query:{
                        id:orderNoId,
                        supplierId:supplierId,
                        supplierName:supplierName
                    }});
                this.getDetail()
                this.getHeight(3)
                this.getMaterialSku()
                this.purchaseQueryListData()
                this.getUrlSupplier();
            },
            // 图片预览
            imgList(row) {
                console.log(row.commonMaterialsPictureList);
                if(row.commonMaterialsPictureList&&row.commonMaterialsPictureList.length>0){
                    if(row.commonMaterialsPictureList[0]){
                        this.imgIndex = 0;
                        this.imgLists = row.commonMaterialsPictureList.map(v => {
                            return {path:v}
                        });
                    }else {
                        this.imgLists = []
                        row.commonMaterialsPictureList.forEach(item =>{
                            this.imgLists.push({path:item})
                        })
                    }
                }
                this.centerDialogVisible = true;
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
            getHeight(length) {
                let height = ''
                if (length == 0) {
                    height = '32px'
                } else {
                    height = 32 * length + 'px'
                }
                return height
            },

            // 打开撤销弹窗
            undoOpen(type, row) {
                this.undoType = type
                if (type == 'undo') {
                    this.undoTitle = '是否确定撤销当前到料单？'
                } else {
                    this.undoTitle = '是否确定撤销当前单据？'
                    this.row = row
                }

                this.isDeleteVisible = true
            },
            // 获取验布员和缩布员
            purchaseQueryListData() {
                let params = {
                    userId: this.userId,
                    factoryId: this.unitId
                };
                purchaseQueryListData(params).then(res => {
                    this.purchaserList = res.data.data.purchaserList; // 采购员
                })
            },
            // renderHeader(createElement, {column, $index}) {
            //     return <div class = "table-header" >{this.specific.map(item => {return <div > {item} </div>})}</div>;
            // },
            // 获取详情
            getDetail() {
                let params = {
                    id: this.$route.query.id,
                    userId: this.userId,
                };
                detail(params).then(res => {
                    this.form = res.data.data;
                    this.bottomTableData = res.data.data.actionCheckShrunks;
                    this.tableData = res.data.data.arriveActionDetail;
                    this.cancelFlag = res.data.data.cancel;
                    this.undoPeople = res.data.data.undoPeople;
                })
            },
            // 获取缩布和验布数据
            getMaterialSku() {
                let params = {
                    id: this.$route.query.id
                }
                materialSku(params).then(res => {
                    this.inspectionData = res.data.data
                    if (this.inspectionData.length > 0 && !this.inspectionData.some(item => !item.lengthCheck)) {
                        this.checkDisabled = true
                    }
                    if (this.inspectionData.length > 0 && !this.inspectionData.some(item => !item.lengthShrunk)) {
                        this.shrunkDisabled = true
                    }
                })
            },
            // 撤销到料单
            getUndo() {
                let params = {
                    userId: this.userId,
                    id: this.$route.query.id
                };
                undo(params).then(res => {
                    if (res.data.code == 0) {
                        this.$message.success('撤销成功');
                        this.isDeleteVisible = false;

                        //撤销成功后执行created钩子函数的内容，刷新页面
                        this.getDetail();
                        this.getHeight(3);
                        this.getMaterialSku();
                        this.purchaseQueryListData();
                        this.getUrlSupplier();
                    } else {
                        this.$message.error(res.data.msg)
                    }
                });

            },
            // 撤销验布和缩布
            cancel(row) {
                let params = {
                    billMaterialArriveId: row.centralBillMaterialArriveId,
                    materialSkuId: row.commonMaterialsSkuId
                }
                if (row.checked && row.shrunked == false) {
                    undoCheck(params).then(res => {
                        if (res.data.code == 0) {
                            this.getDetail()
                            this.checkDisabled = false
                            this.$message.success('操作成功')
                        }
                    })
                } else {
                    undoShrunk(params).then(res => {
                        if (res.data.code == 0) {
                            this.getDetail()
                            this.shrunkDisabled = false
                            this.$message.success('操作成功')
                        }
                    })
                }
                this.isDeleteVisible = false
            },
            // 验布和缩布
            open(type) {
                if (type === 'inspection') {
                    // 权限 验布
                    if (this.isSampleMaterial){
                        if (!this.powerJudgement.permissions("fac.sampleArriveOrder.check")) {
                            return
                        }
                    } else {
                        if (!this.powerJudgement.permissions("fac.arriveOrder.check")) {
                            return
                        }
                    }
                } else {
                    // 权限 验布
                    if (this.isSampleMaterial){
                        if (!this.powerJudgement.permissions("fac.sampleArriveOrder.shrinkage")) {
                            return
                        }
                    } else {
                        if (!this.powerJudgement.permissions("fac.arriveOrder.shrinkage")) {
                            return
                        }
                    }
                    // // 权限 缩布
                    // if (!this.powerJudgement.permissions("fac.arriveOrder.shrinkage")||!this.powerJudgement.permissions("fac.sampleArriveOrder.shrinkage")) {
                    //     return
                    // }
                }
                this.currerType = type;
                this.getMaterialSku();
                this.inspectionForm = {
                    unitId: this.unitId,
                    userId: this.userId,
                    storehouseId: this.form.storehouseId,
                    skus: []
                }
                this.name = ''
                this.date = ''
                this.inspectionShow = true
            },
            // 验布
            save() {
                if (this.date == '') {
                    return this.$message.error('请选择验布日期')
                }
                if (this.name == '') {
                    return this.$message.error('请选择验布员')
                }
                let flag1 = false
                this.inspectionData.map(i => {
                    if (i.lengthCheck && !i.checked) {
                        if (i.lengthCheck > i.quantityArrive) {
                            flag1 = true
                        }
                        this.inspectionForm.skus.push({
                            billMaterialArriveId: i.billMaterialArriveId,
                            materialSkuId: i.materialsSkuId,
                            length: i.lengthCheck,
                            totalArrive: i.quantityArrive
                        })
                        return
                    }
                })
                if (flag1) return this.$message.error('验布长度不能超过到料数')
                this.inspectionForm.checkerId = this.name
                this.inspectionForm.dateCheck = fun.dateFormatter(this.date, false)
                this.isLoading = true
                check(this.inspectionForm).then(res => {
                    if (res.data.code == 0) {
                        this.getDetail()
                        this.getMaterialSku()
                        this.isLoading = false
                        this.$message.success('操作成功')
                    } else {
                        this.$message.error(res.data.msg)
                    }
                })
                this.inspectionShow = false
            },
            // 缩布
            shrunkSave() {
                if (this.date == '') {
                    return this.$message.error('请选择缩布日期')
                }
                if (this.name == '') {
                    return this.$message.error('请选择缩布员')
                }
                let flag1 = false
                this.inspectionData.map(i => {
                    if (i.lengthShrunk && !i.shrunked) {
                        if (i.lengthShrunk > i.quantityArrive) {
                            flag1 = true
                        }
                        this.inspectionForm.skus.push({
                            billMaterialArriveId: i.billMaterialArriveId,
                            materialSkuId: i.materialsSkuId,
                            length: i.lengthShrunk,
                            totalArrive: i.quantityArrive
                        })
                        return
                    }
                })
                if (flag1) return this.$message.error('缩布长度不能超过验布数')
                this.inspectionForm.shrunkerId = this.name
                this.inspectionForm.dateShrunk = fun.dateFormatter(this.date, false)
                this.isShrunkLoading = true
                shrunk(this.inspectionForm).then(res => {
                    if (res.data.code == 0) {
                        this.getDetail()
                        this.getMaterialSku()
                        this.isShrunkLoading = false
                        this.$message.success('操作成功')
                    } else {
                        this.$message.error(res.data.msg)
                    }
                })
                this.inspectionShow = false
            },
            getNeedPayNeedReceiveOrderByMaterialArriveOrderId() {
                getNeedPayNeedReceiveOrderByMaterialArriveOrderId({billMaterialArriveId: this.$route.query.id}).then(res => {
                    if(res.data.code == 0) {
                        this.showFinance = res.data.data.needPayNeedReceiveOrderId?true:false
                    }
                })
            }
        },
        created() {
            // PURCHASE 采购单, ARRIVE 到料单, DELIVER 送料单, RETURN 退料单
            this.getConfigArr('ARRIVE');
            this.getDetail()
            this.getHeight(3)
            this.getMaterialSku()
            this.purchaseQueryListData()
            this.getUrlSupplier();
            this.getNeedPayNeedReceiveOrderByMaterialArriveOrderId();
        },
    }
</script>
<style lang="scss" scoped>
    .material-detail {
        .cell__row {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 32px;
            line-height: 32px;
            border-bottom: 1px solid #E6EAF0;
            &:last-child {
                border: none;
            }
        }
        .detail {
            background-color: #fff;
            padding: 24px;
            .form-item {
                margin-left: -10px;
            }
            .king {
                color: #FF7F14;
            }
            .table-census {
                margin-top: 12px;
                font-weight: 500;
                height: 32px;
                background-color: rgb(238, 240, 246);
                border-right: 1px solid rgb(223, 228, 236);
                border-left: 1px solid rgb(223, 228, 236);
                border-top: 1px solid rgb(223, 228, 236);
                display: flex;
                align-items: center;
                padding-left: 14px;
                .last-span {
                    display: inline-block;
                    margin-left: 20px;
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
            }
        }
        .bottom-table {
            padding: 24px;
            background-color: #fff;
            margin: 12px 0;
        }
        .red {
            color: #FA4150;
        }
        .title {
            margin-bottom: 8px;
            .title-left {
                font-size: 14px;
                i {
                    display: inline-block;
                    border: 2px solid #FFA914;
                    height: 10px;
                    vertical-align: middle;
                    margin-top: -2px;
                    margin-right: 4px;
                }
            }
        }
        .border-bottom {
            border-bottom: 1px solid rgb(223, 228, 236) !important;
        }
        .dialog-title {
            text-align: center;
            font-size: 16px;
            height: 40px;
            line-height: 40px;
            box-sizing: border-box;
            border-bottom: 1px solid #E6EAF0;
        }
        .cell-color {
            background-color: #E6EAF0;
            .input {
                border: none
            }
        }
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
                width: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
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
            }
        }
        .text-line {
            color: #808080;
            text-decoration: underline;
            font-size: 12px;
        }
        .table-header {
            display: flex;
            // justify-content:space-between;
            font-size: 12px;
            font-weight: 600;
            div {
                display: flex;
                justify-content: center;
                align-items: center;
                border-right: 1px solid rgb(223, 228, 236);
                height: 28px;
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
        .materialList-financial-details-details {
            background-color: #fff;
            /*padding: 15px 24px 24px 24px;*/
            margin-bottom: 12px;
        }
        .cancel-img {
            height: 98px;
            width: 98px;
            transform: rotate(15deg);
            position: absolute;
            right: -10px;
            top: 32px;
            z-index: 1;
        }
    }
</style>
<style lang="scss">
    @import '../../../assets/style/el-table.scss';

    .material-detail {
        .el-tabs__active-bar{
            background: #ffa914;
        }
        .el-tabs__item {
            font-size: 20px;
            &.is-active{

            }
        }
        .nf-button.is-disabled {
            color: #808080;
        }
        .el-dialog__body {
            padding: 20px;
        }
        .el-dialog__header {
            /*padding: 0*/
        }
        .el-dialog__footer {
            padding: 15px 20px 15px;
            border-top: 1px solid #E6EAF0;
        }
        .el-date-editor--daterange.el-input {
            width: 100% !important;
        }
        .el-table__body {
            .cell,
            td {
                /*padding: 0;*/
            }
        }
        .el-table .cell {
            line-height: 12px;
        }
        .el-table .cell, .el-table th > div {
            /*padding: 0*/
        }
        .el-select {
            width: 100% !important;
        }
        .el-form-item {
            /*margin-bottom: 0 !important;*/
        }
        .cell-color {
            .el-input__inner {
                border: none;
                background-color: #E6EAF0;
            }
        }
    }
</style>



