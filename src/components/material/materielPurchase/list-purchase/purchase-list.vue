<template>
    <div class="scroll-content purchase-list">
        <page-title class="pdlr24 pdtb16"
                    :title="isSampleMaterial?'样料采购单列表':'采购单列表'">
            <div>
                <div class="finish-tip">
                    <span class="green-block"></span>
                    已到齐
                </div>
                <div class="filter-block">
                    <span>筛选</span>
                    <list-filter ref="purchaseListFilter"  :isSampleMaterial="isSampleMaterial"  @submit="submit"
                                @supplierList="supplierList" @purchaserList="purchaserList"></list-filter>
                    <el-input v-model="searchColumn" @change="purchaseList"  class="mgl8 mgr-4" style="width: 300px;font-size: 12px;"
                              :placeholder="isSampleMaterial?'输入采购单号/采购员/供应商/物料/设计款号':'输入采购单号/采购员/供应商/物料/生产单号'" icon="search"></el-input>

                    <nf-button @click="excel" class="mgl8" fsize='12' >导出表格</nf-button>
                </div>
                <el-dropdown class="mgl8 mgr-4" @command="handleMoreCommand">
                    <nf-button class="mgr-4"  fsize='12' style="color: #1CA1FF;border-color: #1CA1FF;background: transparent;" plain type="primary">
                        更多
                    </nf-button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="批量标完成">批量标完成</el-dropdown-item>
                        <el-dropdown-item command="批量撤销完成">批量撤销完成</el-dropdown-item>
                        <el-dropdown-item command="采购配置">采购配置</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <nf-button class="mgl8 mgr-4" v-if="purchaseSel" fsize='12' style="width: 120px;" @click="showNewPurchase(true)" type="warning">+ 一键采到送</nf-button>
                <nf-button class="mgl8" fsize='12' @click="showNewPurchase(false)" type="warning">+去采购</nf-button>
            </div>
        </page-title>
        <div v-loading="loading" ref="purchaseListContent" class="main-content pdlr24  mgt16 table">
            <el-table
                    v-if="purchase.fieldConfigList.length>0"
                    :height="tableHeight"
                    border
                    :data="tableData"
                    :row-class-name="tableRowClassName"
                    :key="isSampleMaterial?'sampleMaterialTable':'materialTable'"
                    class="custom-table tiny-row purchase-list-table"
                    style="width: 100%">

                <el-table-column
                        v-for="column in purchase.fieldConfigList"
                        :key="column.code"
                        :prop="column.code"
                        :label="column.name"
                        :render-header="()=>renderHeader(column.name)"
                        :min-width="getColumnWidth(column.name)">
                    <template slot-scope="scope">
                        <div>
                            <span v-if="['采购日期','预计货期'].includes(column.name)">
                                {{scope.row[column.code] | filterTime}}
                            </span>
                            <div v-else-if="column.name ==='图片'">
                                <img  style="display:inline-block;vertical-align:middle;width: 24px;height: 24px;"
                                      @click="imgList(scope.row.commonMaterialsPictureList)"
                                      v-if="scope.row[column.code]&&scope.row[column.code].length"
                                      :src="scope.row[column.code]"
                                      alt="" />
                            </div>

                            <div  v-else-if="column.name ==='标签'">
                                <div class="tag" v-for="(el,elIndex) in scope.row.billLabelList" :key="elIndex"><span
                                        class="color-text" :class="{'cancel-tag':scope.row.cancel}">{{el.commonBillLabelName}}</span></div>
                                <select-tag v-if="!scope.row.cancel&&isTagShow" :selectTagList="scope.row.billLabelList" :tagList="tagList"
                                            @addSuccess="addSuccess" :orderId="scope.row.orderNoId"
                                            :materialSkuId="scope.row.materialsSkuId"
                                            @selectItem="selectItem"></select-tag>
                            </div>
                            <div  v-else-if="column.name ==='采购单号'">
                                <div>{{scope.row[column.code]}}</div>
                                <div v-if="scope.row.cancel">(已撤销)</div>
                            </div>
                            <div  v-else-if="column.name ==='生产单号'">
                                <div v-if="scope.row.type!==1">{{scope.row[column.code]}}</div>
                                <div v-else>计划外采购</div>
                            </div>
                            <!--<div v-else-if="column.name ==='供应商'" style="height: 24px;width: 100%"-->
                                 <!--@click="showChangeSupplier(scope.$index,scope.row)">-->
                                <!--{{scope.row[column.code]}}-->
                            <!--</div>-->
                            <div v-else-if="column.name ==='供应商款号/色号'">
                                {{scope.row.supplierStyleNo}}/{{scope.row.supplierColorNo}}
                            </div>
                            <div v-else-if="column.name ==='计划采购'" @click="updatePurchaseDemand(scope.row)">
                                {{scope.row[column.code]}}
                            </div>
                            <span v-else-if="column.name ==='合计采购数'">
                                {{scope.row[column.code]}}{{scope.row.purchaseUnitName}}
                            </span>
                            <div v-else-if="['合计采购','本次采购'].includes(column.name)">
                                {{scope.row[column.code]}}{{scope.row.unit}}
                            </div>
                            <div v-else-if="['采购单价','参考价'].includes(column.name)">
                                {{scope.row[column.code]}}元/{{scope.row.purchaseUnitName}}
                            </div>
                            <span v-else-if="['待采购','总待采购'].includes(column.name)" :class="{'red':scope.row[column.code]>0}">
                                {{scope.row[column.code]}}
                            </span>
                            <span v-else-if="column.name ==='样料'">
                                {{scope.row[column.code]?'样料':''}}
                            </span>
                            <span v-else-if="column.name ==='是否到齐'">
                                {{scope.row[column.code]==='已到齐'?'已到齐':''}}
                            </span>
                            <span v-else-if="column.name ==='本次到料'"
                                  :class="changeTypeClass(scope.row)">
                                 {{scope.row[column.code]}}
                            </span>
                            <span v-else>{{scope.row[column.code]}}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" class-name="no-padding" label="操作" width="140" align="center">
                    <template slot-scope="scope">
                        <div class="action-list">
                            <span style="flex: .7;" class="item blue pointer" @click="check(scope.row)">查看</span>
                            <span class="item" v-if="scope.row.cancel">开到料单</span>
                            <span class="item blue pointer"  v-else @click="goIncomingMateriel(scope.row)">开到料单</span>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pdlr24 pdtb16 text-right">
            <nf-button @click="columnConfigVisible = true" style="background: #fff" class="mgl8 fl" fsize='12' >表头配置</nf-button>
            <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="20"
                           layout="total, prev, pager, next" :total="total">
            </el-pagination>
        </div>
        <el-dialog :visible.sync="dialog.remit" size="tiny" :show-close='false'>
            <div slot="title" class="dialog-header">
                付款
            </div>
            <div class="dialog-body">
                <div class="selected">
                    <div>日期：
                        <el-date-picker v-model="date" type="date" placeholder="选择日期" :picker-options="pickerOptions0">
                        </el-date-picker>
                    </div>
                    <div>
                        业务员：
                        <el-select v-model="person" placeholder="请选择业务员" clearable filterable>
                            <el-option
                                    v-for="item in purchaser"
                                    :key="item.id"
                                    :label="item.userName"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="pay-money">
                    <span>付款金额：</span>
                    <el-input placeholder="输入付款金额" v-model="payMoney"></el-input>
                </div>
            </div>
            <div slot="footer" style="display:flex;justify-content:center;">
                <nf-button style="font-size:12px;width:64px;height:32px;margin-right:6px;" @click="cancelRemitDialog">取
                    消
                </nf-button>
                <nf-button style="font-size:12px;width:64px;height:32px;" type="warning" @click="remitSuccess">确 定
                </nf-button>
            </div>
        </el-dialog>
        <!--//图片预览-->
        <imgPreview @dialogClose="centerDialogVisible=false" :centerDialogVisible="centerDialogVisible"
                    :imgLists="imgLists" :imgIndex="imgIndex"></imgPreview>
        <dynamic-column-config
                :visible.sync="columnConfigVisible"
                :title="isSampleMaterial?'样料采购单列表表头配置':'采购单列表表头配置'"
                :targetType="isSampleMaterial?'SAMPLE_PURCHASE_LIST':'PURCHASE_LIST'"
                @confirm="getFieldConfigCodeAndNameList"
        ></dynamic-column-config>
        <transition name="opcity">
            <div style="z-index: 999" class="cover" v-show='newPurchase.visible'>
            </div>
        </transition>
        <!--新建采购单-->
        <transition name="right-move">
            <new-purchase
                    :isSampleMaterial="isSampleMaterial"
                    :isEdit="false"
                    :isPickUpDelivery="newPurchase.isPickUpDelivery"
                    :visible.sync="newPurchase.visible"
                    v-if="newPurchase.visible"
                    @success="handleCurrentChange(1)"></new-purchase>
        </transition>



        <!-- 遮罩层 -->
        <transition name="opcity">
            <div style="z-index: 999" class="cover" @click='materialAddVisible =false' v-if='materialAddVisible'>
            </div>
        </transition>
        <!-- 新建物料 -->
        <transition name="right-move">
            <material-add
                    :orderNoId="orderNoId"
                    @close="materialAddVisible = false"
                    type="add" :supplierId="addMaterialSupId" :supName="addMaterialSupName"
                    style="z-index: 1000;position: fixed;right: 0;top: 0;width: 100%;height: 100%;background: #fff;overflow-y: auto"
                    v-if='materialAddVisible'
            ></material-add>
        </transition>
    </div>
</template>

<script>
    import {purchaseList2, remit, exportPurchaseListExcel, getFinanceConfigByUserId,purchaseFacFieldConfigCodeAndNameList} from '../../../../api/material.js'
    const fun = require('../../../Common/commonFun.js')
    import listFilter from './list-filter'
    import PageTitle from "../../../Common/page-title";
    import selectTag from '@/components/material/components/selectTag.vue'
    import {purchaseConfig,queryAllBillLabel,allocationBillLabel} from '@/api'
    import DynamicColumnConfig from "../dynamicColumnConfig"; //换供应商组件
    import NewPurchase from "../new-purchase/new-purchase.vue"; //新建采购单
    import materialAdd from '../../materialList/material-add'


    export default {
        name:'purchaseList',
        data() {
            return {
                materialAddVisible: false, // 开到料单弹窗
                centerDialogVisible: false, //判断显示图片预览显示与隐藏
                imgLists: [],
                imgIndex: 0,
                pickerOptions0: {
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 8.64e7;
                    }
                },
                currentPage: 1,
                total: 1,
                form:{
                },
                searchColumn:'', //搜索关键字
                tableData: [],
                purchase:{
                    fieldConfigList:[],
                    // yellowBg:['供应商','主动占用','计划采购'], //要黄色底的列
                    // fixedLeft:['分类'],
                    // fixedRight:['待采购','总待采购']
                },

                dialog: {
                    remit: false
                },
                orderNoId: '',
                supplierId: '',
                payMoney: '',
                person: '',
                date: fun.dateFormatter(new Date(), false),
                purchaser: [],
                supplier: [],
                addtype: false,
                loading: false,
                tagList: [], // 标签的下拉列表
                isTagShow: true, // 标签权限
                tableHeight:300,
                columnConfigVisible:false,
                newPurchase:{
                    isPickUpDelivery:false,
                    visible:false
                },
                purchaseSel:false,
                addMaterialSupId: '',  // 开到料单需要的供应商ID
                addMaterialSupName: '',  // 开到料单需要的供应商名称
            }
        },
        components: {
            DynamicColumnConfig,
            PageTitle,
            listFilter,
            selectTag,
            NewPurchase,
            materialAdd
        },
        computed: {
            userId() {
                return (this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem("user_login")).userId);
            },
            unitId() {
                return JSON.parse(sessionStorage.getItem("last_login")).id
            },
            isSampleMaterial() {
                return this.$route.path === '/samplePurchaseList'
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
        mounted () {
            this.$refs.purchaseListFilter.filter()
            this.$nextTick(() => {
                let self = this;
                this.tableHeight = this.$refs.purchaseListContent.offsetHeight
                // 通过捕获系统的onresize事件触发去改变原有的高度
                window.onresize = function() {
                    self.tableHeight = self.$refs.purchaseListContent.offsetHeight
                }
            })
        },
        methods: {
            getColumnWidth(columnName){
                let width = 120
                switch (columnName){
                    case '生产单号': width =160;break;
                    case '采购日期': width =90;break;
                    case '转化率': width =60;break;
                    case '本次采购': width =90;break;
                    case '采购已到': width =70;break;
                    case '是否到齐': width =70;break;
                    case '采购单价': width =80;break;
                    case '采购金额': width =70;break;
                    case '预计货期': width =90;break;
                    case '合计采购': width =90;break;
                    case '合计采购数': width =100;break;
                    case '采购未到': width =70;break;
                    case '图片': width =60;break;
                    case '计划采购': width =70;break;
                    case '主动占用': width =70;break;
                }
                return width
            },
            // 获取表格要显示的列
            getFieldConfigCodeAndNameList(){
                let params = {
                    unitId:this.unitId,
                    targetType:this.isSampleMaterial?'SAMPLE_PURCHASE_LIST':'PURCHASE_LIST'
                }
                this.purchase.fieldConfigList = []
                purchaseFacFieldConfigCodeAndNameList(params).then(res =>{
                    if( res.data.code===0 ){
                        this.purchase.fieldConfigList = res.data.data
                    }
                })

            },
            //判断一键采到送是否有
            purchaseConfig() {
                let params = {
                    id: this.unitId
                };
                purchaseConfig(params).then(res => {
                    let selData = res.data.data.find(item=>item.code==='pro_mission_material');
                    this.purchaseSel = selData.select
                })
            },
            // 更多下拉菜单里面按钮的点击
            handleMoreCommand(command){
                switch (command){
                    case '批量标完成' : this.batchSetComplete();break;
                    case '批量撤销完成' : this.batchSetComplete();break;
                    case '采购配置' : this.$router.push('purchaseAllocation');break;
                }

            },
            showNewPurchase(isPickUpDelivery) {
                // 新建采购单-权限
                if (!this.isSampleMaterial&&!this.powerJudgement.permissions("fac.purchaseOrder.add")) {
                    return
                }
                //新建样料采购单 --权限
                if (this.isSampleMaterial && !this.powerJudgement.permissions("fac.samplePurchaseOrder.add")) {
                    return
                }
                this.newPurchase.isPickUpDelivery = isPickUpDelivery
                this.newPurchase.visible = true
            },
            // 获取选择标签的下拉列表
            getQueryAllBillLabel() {
                let params = {
                    keyword: "",
                    userId: this.userId
                }
                queryAllBillLabel(params).then(res => {
                    this.tagList = res.data.data
                })
            },
            // 标签新建成功
            addSuccess() {
                this.getQueryAllBillLabel()
            },
            // 标签选择
            selectItem(billLabelList, orderId) {
                let params = {
                    orderId: orderId,
                    unitId: this.unitId,
                    billLabelList
                }
                allocationBillLabel(params).then(res => {
                    if (res.data.code == 0) {
                        this.purchaseList()
                    }
                })
            },
            // 图片预览
            imgList(item) {
                this.imgIndex = 0;
                this.imgLists = [];
                item.forEach($item => {
                    this.imgLists.push({path: $item})
                })
                this.centerDialogVisible = true;
            },
            //根据本单到料数量显示不同class
            changeTypeClass(row) {

                let classString = '';
                let num = row.deliveryQuantityNow
                let playNum = row.planBuyQuantity
                if (num > 0 && playNum > 0) {
                    if (num < playNum) {
                        classString += ' blue';
                    } else if (num === playNum) {
                        classString += ' green';
                    } else if (num > playNum) {
                        classString += ' red';
                    }
                }
                return classString
            },
            tableRowClassName(row, index) {
                let classNames = []
                if (row.cancel) {
                    classNames.push('cancel-row')

                }
                if (row.arriveStatusText ==='已到齐') {
                    classNames.push('green')
                }
                if(row.isStripe){
                    classNames.push('gray-bg')
                }
                return classNames.join(' ')
            },
            // renderHeader(createElement, { column, $index }) {
            //     return <div class="table-header">{this.specific.map(item =>{return <div >{item}</div>})}</div>;
            // },
            supplierList(val) {
                this.supplier = val;
            },
            purchaserList(val) {
                this.purchaser = val;
            },
            remit(val, val2) {
                // 权限
                if (!this.powerJudgement.permissions("fac.purchaseOrder.pay")) {
                    return
                }
                this.dialog.remit = true;
                this.orderNoId = val;
                this.supplierId = val2;
            },
            cancelRemitDialog() {
                this.dialog.remit = false;
            },
            remitSuccess() {
                if (!this.person) {
                    this.$message.error('请选择业务员');
                    return;
                }
                if (!this.date) {
                    this.$message.error('请选择日期');
                    return;
                }
                if (!this.payMoney) {
                    this.$message.error('请填写付款金额');
                    return;
                }
                let params = {
                    dateOperated: this.date,
                    unitId: this.unitId,
                    amount: this.payMoney,
                    supplierId: this.supplierId,
                    userCreated: this.userId,
                    operatorId: this.person,
                    billMaterialPurchaseId: this.orderNoId
                };
                remit(params).then(res => {
                    if (res.data.code == 0) {
                        this.dialog.remit = false;
                        this.$message.success('付款成功');
                    } else {
                        this.$message.error(res.data.msg);
                    }
                })

            },
            goIncomingMateriel(val) {
                // 权限
                if(this.isSampleMaterial){
                    if((!this.powerJudgement.permissions("fac.sampleArriveOrder.add"))){
                        return
                    }
                } else {
                    if((!this.powerJudgement.permissions("fac.arriveOrder.add"))){
                        return
                    }
                }
                this.orderNoId = val.orderNoId;
                this.addMaterialSupId = val.supplierId
                this.addMaterialSupName = val.supplierName
                this.materialAddVisible = true
            },
            check(val) {
                if(this.isSampleMaterial){
                    this.$router.push(`/detailSamplePurchase?id=${val.orderNoId}&supplierId=${val.supplierId}&supplierName=${val.supplierName}`)
                } else {
                    this.$router.push(`/detailPurchase?id=${val.orderNoId}&supplierId=${val.supplierId}&supplierName=${val.supplierName}`)
                }
            },
            submit(val){
                this.form = val;
                this.purchaseList()
            },
            purchaseList() {
                let params = {
                    searchColumn: this.searchColumn,
                    unitId: this.unitId,
                    pageNum: this.currentPage,
                    pageSize: 20,
                    belongModule: this.isSampleMaterial ? 1 : 0,
                    ...this.form
                };
                // 按后台传值要求，做了特殊处理，选了两个的话就都不传，选了一个即传一个，不要用数组
                params.cancel = params.cancel?(params.cancel.length==2?null: params.cancel[0]):null
                this.loading = true
                purchaseList2(params).then(res => {
                    this.loading = false
                    this.tableData = res.data.data.list;
                    this.total = res.data.data.total;
                })
            },
            excel() {
                let params = {
                    searchColumn: this.searchColumn,
                    unitId: this.unitId,
                    pageNum: this.currentPage,
                    pageSize: 20,
                    belongModule: this.isSampleMaterial ? 1 : 0,
                    ...this.form
                };
                // 按后台传值要求，做了特殊处理，选了两个的话就都不传，选了一个即传一个，不要用数组
                params.cancel = params.cancel?(params.cancel.length==2?null: params.cancel[0]):null
                exportPurchaseListExcel(params).then(res => {
                    this.fileData = res.data;
                    //在这里利用则可以直接的生成作为下载用的url，但是在其他代码环境下，可能需要new一个Blob对象，例如
                    //var blob = new Blob([JSON.stringify(res.data)], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
                    let url = window.URL.createObjectURL(res.data);
                    let a = window.document.createElement('a');
                    a.setAttribute('href', url);
                    a.setAttribute('download', '采购单列表.xls');
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                })
            },
            handleCurrentChange(page) {
                this.currentPage = page;
                this.purchaseList()
            },
            getFinanceConfigByUserId() {
                let params = {
                    userId: JSON.parse(sessionStorage.getItem("user_login")).userId,
                }
                getFinanceConfigByUserId(params).then(res => {
                    if (res.data.code == 0) {
                        res.data.data.forEach((v, i) => {
                            if (v == 'PURCHASE_ORDER') {
                                this.addtype = true
                                console.log(this.addtype, '采购单addtype')
                            }
                        })
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
        created() {
            // 标签权限问题
            let powerlist = JSON.parse(sessionStorage.getItem("user_login")).permissionList;
            if (powerlist.indexOf('fac.defectiveLabel.queryAllDefectiveLabel') == -1) {
                this.isTagShow = false
            }
            this.purchaseConfig()
            this.getFinanceConfigByUserId()
            this.getFieldConfigCodeAndNameList()
            // this.purchaseList();
            this.getQueryAllBillLabel();

        },
        // watch: {
        //     '$route'(to, from) {
        //         if((to.path ==='/samplePurchaseList'&&from.path ==='/samplePurchaseList')||
        //             (from.path ==='/samplePurchaseList'&&to.path ==='/samplePurchaseList')) {
        //             this.getFinanceConfigByUserId()
        //             this.purchaseList()
        //         }
        //     }
        // },
        // activated() {
            //重编辑后刷新列表和详情
            // console.log(this.$route.query);
            // if (this.$route.query && this.$route.query.active) {
            //     this.getFinanceConfigByUserId()
            //     this.purchaseList();
            // }
            // if (this.$route.query && this.$route.query.orderNoId) {
            //     let query = this.$route.query
            //     this.$router.push(`/detailPurchase?id=${query.orderNoId}&supplierId=${query.supplierId}&supplierName=${query.supplierName}`)
            // }
        // },
    }
</script>

<style lang="scss" scoped>
    .tag {
        padding: 3px 0;
        box-sizing: border-box;
        height: 32px;
        line-height: 32px;
    }

    .color-text {
        padding: 0 5px;
        background-color: #ff9c38;
        color: #fff;
        display: block;
        height: 100%;
    }
    .cancel-tag{
        background-color: #666 !important;
    }
    .purchase-list {
        .dialog-header {
            padding-bottom: 12px;
            font-size: 16px;
            display: flex;
            justify-content: center;
            border-bottom: 1px solid rgba(230, 234, 240, 1);
        }
        .dialog-body {
            .selected {
                display: flex;
                justify-content: space-between;
            }
        }
        .table-header {
            display: flex;
            font-size: 12px;
            font-weight: 600;
            div {
                display: flex;
                justify-content: center;
                align-items: center;
                border-right: 1px solid rgb(223, 228, 236);
                height: 28px;
                &:nth-child(1) {
                    width: 80px;
                }
                &:nth-child(2) {
                    width: 160px;
                }
                &:nth-child(3) {
                    width: 80px;
                    border: none;
                }
            }
        }
    }
</style>
<style lang="scss">
    @import '../../../../assets/style/el-table.scss';
    .purchase-list {
        .gray-bg{
            background: #F7F9FC;
        }
        .green .cell{color: #23C811}
        .finish-tip{
            display: inline-block;
            vertical-align: middle;
            line-height: 24px;
            margin-right: 8px;
            font-size: 12px;
            padding: 0 10px 0 0;
            height: 24px;
            color:#23C811;
            border-radius:2px 0 0 2px ;
            background: #c4f7bf;
            .green-block{
                float: left;
                margin-right: 5px;
                background: #23C811;
                width: 24px;
                height: 24px;
                border-radius: 0 2px 2px 0;
            }
        }
        .custom-tab-bar{
            background: #fff;
        }
        .filter-block{
            display: inline-block;
            font-size: 12px;
            padding-right: 8px;
            border-right: 1px solid #DFE6EC;
        }
        .purchase-list-table .el-table__body,
        .purchase-list-table .el-table__header{
            width: 100% !important;
        }
    }

    .selected {
        .el-input__inner {
            border: none;
            width: 160px;
        }
        .el-date-editor.el-input {
            width: 160px;
        }
    }

    .pay-money {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 12px;
        .el-input {
            width: 200px;
        }
        .el-input__inner {
            width: 200px;
        }
    }
</style>

