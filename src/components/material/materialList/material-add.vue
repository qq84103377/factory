<template>
    <div :class="{'material-new-remove-right':source=='detailMaterial','material-add':true} ">
        <page-title :title="title" style="padding: 24px;">
            <div class="btns">
                <div v-if="type == 'add' || source">
                    <nf-button @click="$emit('close')">取消</nf-button>
                    <nf-button :loading="btnLoading" type="warning" @click="addArrive">确定</nf-button>
                </div>
                <nf-button v-else @click="$router.go(-1)">返回上级</nf-button>
            </div>
        </page-title>
        <div class="form" style="padding-top: 0;">
            <!--<div>{{newTableSel}}</div>-->
            <!--<div style="color: red">{{purchaseSelectList}}</div>-->
            <!-- 新建基本信息 -->
            <el-form :model="form" status-icon ref="form" label-width="100px" class="demo-ruleForm"
                     v-if="type == 'add' || source=='detailMaterial'">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="物料供应商" class="form-item red-star" prop="supplier">
                            <!--<el-select :disabled="$route.query.supplierId" @change="getNewTable" v-model="form.supplier"-->
                            <!--placeholder="请选择供应商" clearable-->
                            <!--filterable>-->
                            <!--<el-option-->
                            <!--v-for="item in supplierList"-->
                            <!--:key="item.id"-->
                            <!--:label="item.name"-->
                            <!--:value="item.id">-->
                            <!--</el-option>-->
                            <!--</el-select>-->
                            <supplier-select
                                    :canAdd = 'true'
                                    :canSelect="supplierId?false:true"
                                    :parentSupplier="urlSupplier"
                                    @getSupplierId="getSupplierId">
                            </supplier-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="到料单号">
                            <el-input v-model.trim="form.order" placeholder="不填则自动生产流水号"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="到料员" class="form-item" required>
                            <workerLeader v-model="form.materielMan"  :single="'single'"
                                          :placeholder="'请选择到料员'"></workerLeader>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="到料日期" required>
                            <el-date-picker
                                    v-model="form.date"
                                    type="date"
                                    placeholder="请选择日期"
                            >
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="到料仓库" class="form-item" required>
                            <el-select v-model="form.storeId" placeholder="请选择到料仓库" clearable filterable>
                                <el-option
                                        v-for="item in store"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="备注信息">
                            <el-input v-model.trim="form.remark" placeholder="请输入备注"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <div style="line-height: 36px;">
                            <el-checkbox v-if="!isSampleMaterial" v-model="form.checked" style="margin-left: 32px;">供应商直发加工厂</el-checkbox>
                            <outside-supplier-select :parentSupplier="parentFacId" style="display: inline-block;" v-if="form.checked" :canSelect="newTableSel.length==0" @getSupplierId="getFac"></outside-supplier-select>
                        </div>
                    </el-col>
                </el-row>
            </el-form>
            <!-- 新建表格 -->
            <div v-if="type == 'add' || source=='detailMaterial'" class="table-census">
                <div>
                    <span>本次到料：<span class="king">{{ newTableSel.length }} 款</span></span>
                    <span class="last-span">到料金额：<span class="king">￥{{totalMoney}}</span></span>
                </div>
                <div>
                    <el-button @click="visible.prod = true"  class="orange-btn" size="small">+ 按生产单添加</el-button>
                    <el-button @click="visible.purchase = true"  class="orange-btn" size="small">+ 按采购单添加</el-button>
                    <el-button @click="visible.material = true"   class="orange-btn" size="small">+ 按物料添加</el-button>
                    <el-button @click="allWrite" class="blue-btn" size="small">按合计未到一键填齐</el-button>
                </div>
            </div>
            <div v-if="type == 'add' || source=='detailMaterial'" class="tabless">
                <material-add-table :isSampleMaterial="isSampleMaterial"
                                    ref="materialAddTable" :tableData="newTableSel"
                                    @del="deleteMaterialsSku"
                                    @addByOrder="handleAddByOrder"></material-add-table>
                <!--<material-add-table :isSampleMaterial="isSampleMaterial" style="margin-top: 20px;" ref="materialCheckTable" @selectionChange="selectionChange" v-if="newTable" :tableData="newTable" :source="source" :isSelectTion="true" :deleteRowData="deleteRowData"></material-add-table>-->
            </div>
            <div v-show="id && source!=='detailMaterial'" class="mg20" @click="tableShow = !tableShow">展开该供应商其他未到齐的采购单<i
                    :class="{'mgl10': true,'el-icon-arrow-down': !tableShow, 'el-icon-arrow-up':tableShow}"></i></div>
            <div v-if="id && source!=='detailMaterial'" v-show="tableShow" class="tabless">
                <el-table key="4" v-if="tableData" :data="tableData" border style="width: 100%"
                          v-loading='loading'>
                    <el-table-column prop="orderNo" label="采购单号" align="center" width="120">
                    </el-table-column>
                    <el-table-column prop="purchaseDate" label="采购日期" align="center" width="120">
                        <template slot-scope="scope">
                            <div>
                                {{scope.row.purchaseDate| filterTime}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="分类" width="140" align="center">
                        <template slot-scope="scope">
                            <div :style="{'height':item.meterialPurchaseDetail.length * 32+'px',
                            'line-height':item.meterialPurchaseDetail.length * 32+'px'}" class="cell__row"
                                 v-for="item in  scope.row.meterialSkuSet">
                                {{item.kindName}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="colorName" label="物料款号" align="center" width="120">
                        <template slot-scope="scope">
                            <div :style="{'height':item.meterialPurchaseDetail.length * 32+'px','line-height':item.meterialPurchaseDetail.length * 32+'px'}"
                                 class="cell__row" v-for="item in  scope.row.meterialSkuSet">
                                {{item.materialsNo}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="unit" label="物料名称" align="center" width="120">
                        <template slot-scope="scope">
                            <div :style="{'height':item.meterialPurchaseDetail.length * 32+'px','line-height':item.meterialPurchaseDetail.length * 32+'px'}"
                                 class="cell__row" v-for="item in  scope.row.meterialSkuSet">
                                {{item.materialsName}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="unArrivedPurchaseQuantity" label="颜色" width="120" align="center">
                        <template slot-scope="scope">
                            <div :style="{'height':item.meterialPurchaseDetail.length * 32+'px','line-height':item.meterialPurchaseDetail.length * 32+'px'}"
                                 class="cell__row" v-for="item in  scope.row.meterialSkuSet">
                                {{item.colorName}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="stock" label="规格" width="120" align="center">
                        <template slot-scope="scope">
                            <div :style="{'height':item.meterialPurchaseDetail.length * 32+'px','line-height':item.meterialPurchaseDetail.length * 32+'px'}"
                                 class="cell__row" v-for="item in  scope.row.meterialSkuSet">
                                {{item.specificationsNo}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="specificationsNo" label="供应商款号/色号" align="center" width="140">
                        <template slot-scope="scope">
                            <div :style="{'height':item.meterialPurchaseDetail.length * 32+'px','line-height':item.meterialPurchaseDetail.length * 32+'px'}"
                                 class="cell__row" v-for="item in  scope.row.meterialSkuSet">
                                {{item.specificationsNo}}/{{item.supplierColorNo}}
                            </div>
                        </template>
                    </el-table-column>
                    <!--<el-table-column prop="waitPurchaseQuantity" label="库存单位" width="100" align="center">-->
                        <!--<template slot-scope="scope">-->
                            <!--<div :style="{'height':item.meterialPurchaseDetail.length * 32+'px','line-height':item.meterialPurchaseDetail.length * 32+'px'}"-->
                                 <!--class="cell__row" v-for="item in  scope.row.meterialSkuSet">-->
                                <!--{{item.unit}}-->
                            <!--</div>-->
                        <!--</template>-->
                    <!--</el-table-column>-->
                    <el-table-column prop="waitPurchaseQuantity" label="成衣款号" :render-header="renderHeader" width="300">
                        <template slot-scope="scope">
                            <div v-for="(item,indexsku) in scope.row.meterialSkuSet" :key="indexsku">
                                <div v-if="items.type===0" class="specific-table"
                                     v-for="(items,indexs) in item.meterialPurchaseDetail" :key="indexs">
                                    <div>{{items.styleNo}}</div>
                                    <div>{{items.demandSourceBillNo}}</div>
                                    <div>{{items.planBuyQuantity}}</div>
                                </div>
                                <div v-else
                                     style="height:32px;line-height:32px;padding-left:12px;border-bottom:1px solid rgb(223, 228, 236);">
                                    计划外采购（无采购需求）
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="waitPurchaseQuantity" label="本次采购[库存单位]" width="120" align="center">
                        <template slot-scope="scope">
                            <div v-for="(item,indexsku) in scope.row.meterialSkuSet" :key="indexsku">
                                <div
                                        :class="{'boder-none':scope.row.meterialSkuSet&&indexsku==scope.row.meterialSkuSet.length-1&&indexs==item.meterialPurchaseDetail.length-1}"
                                        class="cell__row-border" v-for="(items,indexs) in item.meterialPurchaseDetail"
                                        :key="indexs">
                                    {{items.purchaseQuantityNow}}
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="specificationsNo" label="采购未到" align="center" width="120">
                        <template slot-scope="scope">
                            <div v-for="(item,indexsku) in scope.row.meterialSkuSet" :key="indexsku">
                                <div
                                        :class="{'boder-none':scope.row.meterialSkuSet&&indexsku==scope.row.meterialSkuSet.length-1&&indexs==item.meterialPurchaseDetail.length-1}"
                                        class="cell__row-border" v-for="(items,indexs) in item.meterialPurchaseDetail"
                                        :key="indexs">
                                    {{items.unArrivedPurchaseQuantity}}
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="unit" label="本次到料[库存单位]" align="center" width="120">
                        <template slot-scope="scope">
                            <div v-for="(item,indexsku) in scope.row.meterialSkuSet" :key="indexsku">
                                <div
                                        :class="{'boder-none':scope.row.meterialSkuSet&&indexsku==scope.row.meterialSkuSet.length-1&&indexs==item.meterialPurchaseDetail.length-1}"
                                        class="cell__row-border" v-for="(items,indexs) in item.meterialPurchaseDetail"
                                        :key="indexs">
                                    <div v-if="items.arriveStatus==2">-</div>
                                    <div v-if="items.arriveStatus!==2" class="now">
                                        <el-input @input="compluteAllMoney(scope.row,item)" placeholder="请输入" @blur="checkInput" type="number"
                                                  v-model.number="items.deliveryQuantityNow"></el-input>
                                    </div>
                                </div>
                            </div>

                        </template>
                    </el-table-column>
                    <el-table-column label="是否到齐" width="120" align="center">
                        <template slot-scope="scope">
                            <div v-for="(item,indexsku) in scope.row.meterialSkuSet" :key="indexsku">
                                <div
                                        :class="{'boder-none':scope.row.meterialSkuSet&&indexsku==scope.row.meterialSkuSet.length-1&&indexs==item.meterialPurchaseDetail.length-1}"
                                        class="cell__row-border" v-for="(items,indexs) in item.meterialPurchaseDetail"
                                        :key="indexs">
                                    <span v-if="items.arriveStatus==2">已到齐</span>
                                    <span style="text-decoration:underline;cursor:pointer;color:#808080;"
                                          v-if="items.arriveStatus!==2" @click="setArrive(items)">手动到齐</span>
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="stock" label="采购单价" width="120" align="center">
                        <template slot-scope="scope">
                            <div :style="{'height':item.meterialPurchaseDetail.length * 32+'px',
                            'line-height':item.meterialPurchaseDetail.length * 32+'px'}" class="cell__row"
                                 v-for="item in  scope.row.meterialSkuSet">
                                {{item.unitCost}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="purchaseMoney" label="到料单价" width="120" align="center">
                        <template slot-scope="scope">
                            <div :style="{'height':item.meterialPurchaseDetail.length * 32+'px',
                            'line-height':item.meterialPurchaseDetail.length * 32+'px'}" class="cell__row now"
                                 v-for="item in  scope.row.meterialSkuSet">
                                <el-input @input="compluteAllMoney(scope.row,item)" :style="{'height':item.meterialPurchaseDetail&&item.meterialPurchaseDetail.length>=1?32 * item.meterialPurchaseDetail.length+ 'px !important':'',
                                'line-height':item.meterialPurchaseDetail&&item.meterialPurchaseDetail.length>=1?32 * item.meterialPurchaseDetail.length+ 'px !important':''}"
                                          class="price" placeholder="请输入"
                                          v-model.number="item.priceUnit"></el-input>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="purchaserName" label="到料金额" width="120" align="center">
                        <template slot-scope="scope">
                            <div :style="{'height':item.meterialPurchaseDetail.length * 32+'px',
                            'line-height':item.meterialPurchaseDetail.length * 32+'px'}" class="cell__row now"
                                 v-for="item in  scope.row.meterialSkuSet">
                                <el-input @input="compluteDanJia(scope.row,item)" :style="{'height':item.meterialPurchaseDetail&&item.meterialPurchaseDetail.length>=1?32 * item.meterialPurchaseDetail.length+ 'px !important':'',
                                'line-height':item.meterialPurchaseDetail&&item.meterialPurchaseDetail.length>=1?32 * item.meterialPurchaseDetail.length+ 'px !important':''}"
                                          class="price" placeholder="请输入"
                                          v-model.number="item.priceAll"></el-input>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <!--&lt;!&ndash;财务中心&ndash;&gt;-->
            <!--<div class="materialListFinancial" v-if="addtype">-->
                <!--<material-list-financial-->
                        <!--ref="materialList"-->
                        <!--title="应付金额"-->
                        <!--:money="money"-->
                        <!--:supplierName="supplierName">-->
                <!--</material-list-financial>-->
            <!--</div>-->
            <purchase-add-dialog @confirm="confirmCb($event,1)" :purchaseSelectList="purchaseSelectList" :visible.sync="visible.purchase" :supId="form.outsideFactoryId" :supplierId="form.supplier"></purchase-add-dialog>
            <material-add-dialog @confirm="confirmCb($event,2)" :materialSelectList="materialSelectList" :visible.sync="visible.material" :supId="form.outsideFactoryId" :supplierId="form.supplier"></material-add-dialog>
            <prod-add-dialog @confirm="confirmCb($event,3)" :prodSelectList="prodSelectList" :visible.sync="visible.prod" :supId="form.outsideFactoryId" :supplierId="form.supplier"></prod-add-dialog>
            <add-by-order-dialog @confirm="confirmAddByOrder" :materialsSku="addByOrderRow" :visible.sync="visible.addByOrder"></add-by-order-dialog>
        </div>

    </div>
</template>
<script>
    const fun = require('../../Common/commonFun.js')
    import {addArrive,updateArrive, purchaseList2} from '../../../api/material.js'
    import {storeList,queryDeliveryDemandForNewBill} from '../../../api/api.js'
    import materialAddTable from './components/material-add-table.vue'
    import materialListFinancial from './materialList-financial.vue'
    import supplierSelect from '@/components/Common/custom-select/supplier-select';
    import purchaseAddDialog from './components/purchaseAddDialog'
    import materialAddDialog from './components/materialAddDialog'
    import prodAddDialog from './components/prodAddDialog'
    import addByOrderDialog from './components/addByOrderDialog'

    export default {
        props:['source','detailMaterialdata','type','supplierId','supName','orderNoId'],  // orderNoId 采购单ID 在采购单列表开到料单需要用
        data() {
            return {
                parentFacId: {},
                visible: {
                  purchase: false,
                  material: false,
                  addByOrder: false,
                  prod: false
                },
                centerDialogVisible: false, //判断显示图片预览显示与隐藏
                imgLists: [],
                imgIndex: 0,
                form: {
                    order: '',
                    supplier: '',
                    storeId: '',
                    date: new Date(),
                    materielMan: '',
                    remark: '',
                    outsideFactoryId: '',
                    checked: false,
                },
                newTableSel: [],
                newTable: [],
                tableData: [],
                store: [],
                repeatEditTimes: 1,
                materialsSkus: [],
                loading: false,
                btnLoading: false,
                tableShow: false,
                specific: ['商品款号', '生产单号', '计划采购'],
                addtype: false,//判断财务详情是否显示
                urlSupplier: [],//从url获取的供应商信息
                canSelect: false, //是否可以点击供应商下拉
                likeColumn:'',
                supplierName:'',    //供应商名称
                styleArr:[],        //物料款号数组，用于统计本次到料数
                deleteRowData:[], // 删除的行
                purchaseSelectList: [],  // 按采购单添加选择的
                materialSelectList: [],  // 按物料添加选择的
                prodSelectList: [],  // 按生产单添加选择的
                addByOrderRow: {},
                addByOrderRowIndex: 0
            }
        },
        watch: {
          'form.checked'(v) {
              if(!v) {
                  this.form.outsideFactoryId = ''
              }
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
            materialListFinancial,
            materialAddTable,
            supplierSelect,
            purchaseAddDialog,
            materialAddDialog,
            prodAddDialog,
            addByOrderDialog
        },
        computed: {
            userId() {
                return (this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem("user_login")).userId);
            },
            unitId() {
                return JSON.parse(sessionStorage.getItem("last_login")).id
            },
            isSampleMaterial() {
                return this.$route.path === '/samplePurchaseList'|| this.$route.path === '/sampleMaterialDetail'|| this.$route.path === '/sampleMaterialList'
            },
            totalMoney() {
               return this.newTableSel.reduce((total,value) => {
                    let curNum = value.sourceBillForArriveList.reduce((t,v) => {
                        return (t + (v.priceUnit * (v.deliveryQuantityNow || 0)).toFixed(4) * 1).toFixed(4) * 1
                    },0)
                    return (total + curNum).toFixed(4) * 1
                },0) || 0
            }
        },
        methods: {
            // 按单到料点击确定
            confirmAddByOrder(newMaterialsSku) {
                this.$set(this.newTableSel,this.addByOrderRowIndex,newMaterialsSku)
            },
            // 一键填齐
            allWrite() {
                this.newTableSel.forEach(v => {
                    this.$set(v,'deliveryQuantityNow',v.totalUnArrivedPurchaseQuantity)
                    let total = v.deliveryQuantityNow;
                    let flag = false;
                    let num = 0;
                    for (let i = 0; i < v.sourceBillForArriveList.length; i++) {
                        let item = v.sourceBillForArriveList[i];
                        if(flag) {
                            item.deliveryQuantityNow = 0
                            this.$set(item,'quantity',0)
                            continue
                        }
                        if(total - item.unArrivedPurchaseQuantity>0) {
                            item.deliveryQuantityNow = item.unArrivedPurchaseQuantity
                            this.$set(item,'quantity',item.conversionRate*1>0?(item.unArrivedPurchaseQuantity/item.conversionRate).toFixed(2)*1:0)
                            total = total - item.unArrivedPurchaseQuantity
                        }else {
                            item.deliveryQuantityNow = total || 0
                            this.$set(item,'quantity',item.conversionRate*1>0?((total || 0)/item.conversionRate).toFixed(2)*1:0)
                            flag = true
                        }
                        num = (num + item.quantity).toFixed(2) * 1
                    }
                    this.$set(v,'quantity',num)
                })
            },
            // 按单到料
            handleAddByOrder(row, index) {
                this.addByOrderRowIndex = index
                this.addByOrderRow = row
                this.visible.addByOrder = true
            },
            // 删除物料
            deleteMaterialsSku(row,index){
                // materialsSkuId
                this.newTableSel.splice(index,1)
                this.purchaseSelectList.splice(this.purchaseSelectList.findIndex(item => item.materialsSkuId===row.materialsSkuId),1)
                let tempList = []
                this.materialSelectList.forEach(item => {
                    if(item.materialsSkuId!== row.materialsSkuId){
                        tempList.push(item)
                    }
                })
                this.materialSelectList = tempList
            },
            confirmCb(select,type) {
                let billMaterialPurchaseIds = [], materialSkuIds = [];
                if(type == 1) {
                    this.purchaseSelectList = select
                    billMaterialPurchaseIds = this.purchaseSelectList.map(v => v.billPurchaseId)
                    materialSkuIds = []
                }else if(type == 2) {
                    this.materialSelectList = select
                    billMaterialPurchaseIds = []
                    materialSkuIds = this.materialSelectList.map(v => v.materialsSkuId)
                }else {
                    this.prodSelectList = select
                    this.prodSelectList.forEach(p => {
                        p.meterialSkuSet.forEach(m => {
                            materialSkuIds.push(m.materialsSkuId)
                            billMaterialPurchaseIds.push(m.orderId)
                        })
                    })
                    billMaterialPurchaseIds = [...new Set(billMaterialPurchaseIds)]
                    materialSkuIds = [...new Set(materialSkuIds)]
                }

                let params = {
                    unitId: this.unitId,
                    billMaterialPurchaseIds,
                    materialSkuIds,
                }
                this.handleData(params)

            },
            async handleData(params) {
                await queryDeliveryDemandForNewBill(params).then(res => {
                    if(res.data.code == 0) {
                        res.data.data.forEach(v => {
                            v.totalUnArrivedPurchaseQuantity = v.sourceBillForArriveList.reduce((t,s) => {
                                return (t + s.unArrivedPurchaseQuantity).toFixed(2)*1
                            },0)
                        })

                        let materialArr = [];
                        this.newTableSel.forEach(s => {
                            // 在原本选中的表格查找跟接口返回的相同数据
                            if(res.data.data.some(v => s.materialsSkuId === v.materialsSkuId)) {
                                let row = res.data.data.find(v => s.materialsSkuId === v.materialsSkuId)
                                let billArr = [];
                                s.sourceBillForArriveList.forEach(b => {
                                    //原本有的
                                    if(row.sourceBillForArriveList.some(r => r.billMaterialPurchaseId===b.billMaterialPurchaseId&&r.materialsSkuId===b.materialsSkuId&&r.sourceBillId===b.sourceBillId)) {
                                        billArr.push(b)
                                    }
                                })

                                row.sourceBillForArriveList.forEach(sour => {
                                    if(!billArr.some(bill => bill.billMaterialPurchaseId===sour.billMaterialPurchaseId&&bill.materialsSkuId===sour.materialsSkuId&&bill.sourceBillId===sour.sourceBillId)) {
                                        billArr.push(sour)
                                    }
                                })
                                materialArr.push({...s,sourceBillForArriveList:billArr})
                            }
                        })
                        res.data.data.forEach(v => {
                            // 返回数据没有在原来选中表格中
                            if(!materialArr.some(m => m.materialsSkuId === v.materialsSkuId)) {
                                materialArr.push(v)
                            }
                        })
                        this.newTableSel = materialArr
                        if(this.newTableSel.length) {
                            // 选中的物料的供应商ID是否一致
                            if(this.newTableSel.every(v => this.newTableSel[0].supplierId === v.supplierId)) {
                                this.urlSupplier = [{id: this.newTableSel[0].supplierId,name: this.newTableSel[0].supplierName}]
                            }else {
                                this.urlSupplier = [{id: '',name: ''}]
                            }
                        }else {
                            this.urlSupplier = [{id: '',name: ''}]
                        }
                    }
                })
            },
            getFac(v) {
                this.form.outsideFactoryId = v.id || ''
            },
            checkInput(e) {
                if(e.target.valueAsNumber<0){
                    this.$message.error('请输入正数')
                }
            },
            selectionChange(selData,row){
                // 取消勾选还是勾选
                let index = selData.findIndex(item=>item==row)
                if(index >-1){
                    //勾选
                    let indexSel = this.newTableSel.findIndex(item=>item.orderNo===row.orderNo)
                    if(indexSel===-1){
                        this.newTableSel.push(row)

                    }
                }else {
                    this.newTableSel.forEach((item,itemIndex)=>{
                        if(item.orderNoId===row.orderNoId){
                            this.newTableSel.splice(itemIndex,1)
                        }
                    })
                }
                //款式
                this.styleArr = [];
                this.newTableSel.forEach(item =>{
                    if(item.meterialSkuSet.length){
                        item.meterialSkuSet.forEach(i =>{
                            this.styleArr.push(i.materialsNo);
                        })
                    }
                });
                console.log( this.styleArr);
                this.styleArr = Array.from(new Set(this.styleArr));
            },
            //获取供应商id
            getSupplierId(val){
                if(val.id){
                    this.form.supplier = val.id;
                    this.supplierName = val.name;
                }else {
                    this.form.supplier = '';
                    this.supplierName = '';
                }
            },
            // 图片预览
            imgList(row) {
                console.log(row.commonMaterialsPictureList);
                if (row.commonMaterialsPictureList && row.commonMaterialsPictureList.length > 0) {
                    if (row.commonMaterialsPictureList[0].path) {
                        this.imgIndex = 0;
                        this.imgLists = row.commonMaterialsPictureList;
                    } else {
                        this.imgLists = []
                        row.commonMaterialsPictureList.forEach(item => {
                            this.imgLists.push({path: item})
                        })
                    }
                }
                this.centerDialogVisible = true;
            },
            renderHeader(createElement, {column, $index}) {
                return <div class = "table-header" >{this.specific.map(item => {return <div > {item} </div>})}</div>
            },
            setArrive(val) {
                val.arriveStatus = 2;
                val.manualArriveComplete = true;
                val.deliveryQuantityNow = 0;
            },
            juade() {
                //获取组件的表格数据
                this.materialsSkus = [];
                let newTable = [],deliverFlag,quantityFlag,priceUnitFlag;
                newTable = this.$refs.materialAddTable.newTable;
                    for (let item of newTable) {
                    for (let sku of item.sourceBillForArriveList) {
                        if(sku.deliveryQuantityNow<=0||!sku.deliveryQuantityNow){
                            deliverFlag = true
                        }
                        else if (sku.quantity<=0||!sku.quantity) {
                            quantityFlag = true
                        }
                        else if (sku.priceUnit<=0||!sku.priceUnit) {
                            priceUnitFlag = true
                        }
                        // 到料单价 到料数 本次到料 均不为0时才传值
                            if(sku.deliveryQuantityNow > 0 && sku.quantity > 0 && sku.priceUnit > 0){
                                let obj = {};
                                obj.billMaterialPurchaseId = sku.billMaterialPurchaseId;
                                obj.priceUnit = sku.priceUnit || 0; // 到料单价
                                obj.quantity = sku.quantity || 0; // 到料数
                                obj.quantityStockUnit = sku.deliveryQuantityNow || 0; //本次到料
                                obj.stockUnitName = sku.stockUnitName; //库存单位
                                obj.purchaseUnitName = sku.purchaseUnitName; //采购单位
                                obj.manualArriveComplete = sku.manualArriveComplete||false;
                                obj.type = sku.type;
                                obj.demandSourceBillId = sku.sourceBillId;
                                obj.materialsSkuId = sku.materialsSkuId;
                                this.materialsSkus.push(obj);
                            }

                    }
                }
                        if (deliverFlag) {
                        this.$message.error('请填写本次到料且数值大于0');
                        return false;
                    }
                        if (quantityFlag) {
                            this.$message.error('请填写到料数且数值大于0');
                            return false;
                        }
                        if (priceUnitFlag) {
                            this.$message.error('请填写到料单价且数值大于0');
                            return false;
                        }
                if(this.materialsSkus.length==0) {
                        this.$message.error('请添加本次到料物料')
                    return false
                }

                return true;
            },
            async addArrive() {
                if (!this.form.supplier) {
                    this.$message.error('请选择供应商');
                    return;
                }
                if (!this.form.date) {
                    this.$message.error('请选择到料日期');
                    return;
                }
                if (!this.form.materielMan) {
                    this.$message.error('请选择到料员');
                    return;
                }
                if (!this.form.storeId) {
                    this.$message.error('请选择到料仓库');
                    return;
                }
                if (await !this.juade()) {
                    return;
                }
                else {
                        let params = {
                        unitId: this.unitId,
                        supplierId: this.form.supplier,
                        orderNo: this.form.order,
                        storehouseId: this.form.storeId,
                        dateArrive: this.form.date ? fun.dateFormatter(this.form.date, false) : '',
                        creatorId: this.form.materielMan,
                        remark: this.form.remark,
                        materialsSkus: this.materialsSkus,
                        userId:this.userId,
                        belongModule:this.isSampleMaterial?1:0,
                        outsideFactoryId: this.form.checked ? this.form.outsideFactoryId : ''
                    };
                    // if(this.addtype){
                    //     params = {
                    //         ...params,
                    //         // 财务收支字段
                    //         remitMethodId: this.$refs.materialList.form.remitMethodId,//银行卡id
                    //         journalAccountAmount: this.$refs.materialList.form.journalAccountAmount,//收支金额
                    //         // payOrReceiveAmount: this.money,//应付或应收金额
                    //         remitMethodName: this.$refs.materialList.form.remitMethodName,//银行卡名称
                    //         journalAccountCode: this.$refs.materialList.form.journalAccountCode,//流水单号
                    //         journalAccountDateCreated: this.$refs.materialList.form.dateCreatedBegin ? fun.dateFormatter(this.$refs.materialList.form.dateCreatedBegin, false) : '',//流水时间
                    //         salesmanName: this.$refs.materialList.form.salesmanName ? this.$refs.materialList.form.salesmanName:JSON.parse(sessionStorage.getItem("user_info")).userName,//业务员名称
                    //         salesmanId: this.$refs.materialList.form.salesmanId ? this.$refs.materialList.form.salesmanId:JSON.parse(sessionStorage.getItem("user_login")).userId, //业务员id
                    //     }
                    // }
                        console.log(params,'=3=3=');
                        this.btnLoading = true;
                    //重编辑
                    if(this.source){
                        console.log(params);
                        params.arriveId = this.$route.query.id
                        updateArrive(params).then(res => {
                            this.btnLoading = false;
                            if (res.data.code == 0) {
                                this.$emit('editAgainSucc', res.data.data, this.form.supplier, this.supplierName)

                            } else {
                                this.$message.error(res.data.msg);
                            }
                        });
                    }else {
                        //新建
                        addArrive(params).then(res => {
                            this.btnLoading = false;
                            if (res.data.code == 0) {
                                this.$emit('close');
                                this.$message.success('新建成功')
                                this.$emit('successCb')
                                this.$store.dispatch('deleteVisitedView', this.$route);
                                this.$store.dispatch('deleteVisitedLive', 'materialList');
                                // this.$router.push('/materialList')
                            } else {
                                this.$message.error(res.data.msg);
                            }
                        });
                    }

                }
            },
            compluteDanJia(row, item) {
                let sum = 0;
                item.meterialPurchaseDetail.forEach(els => {
                    sum += els.deliveryQuantityNow;
                });
                if (sum !== 0) {
                    item.priceUnit = item.priceAll / sum;
                } else {
                    item.priceUnit = 0;
                }
            },
            compluteAllMoney(row, item) {
                //到料数
                let sumD = 0;
                item.meterialPurchaseDetail.forEach(els => {
                    if (els.deliveryQuantityNow == '-') {
                        els.deliveryQuantityNow = 0;
                    }
                    sumD += els.deliveryQuantityNow;
                });
                // item.priceAll = (item.priceUnit * sum).toFixed(2);
                this.$set(item,'priceAll',(item.priceUnit * sumD).toFixed(2))
// 触发数值变化
                let sum = 0
                let sum1 = 0
                this.newTableSel.forEach(el => {
                    for (let sku of el.meterialSkuSet) {
                        if (sku.priceAll == undefined) {
                            sku.priceAll = 0;
                        }
                        if (sku.priceAllType === 1) {
                            sku.priceAll = 0;
                        }
                        sum += Number(sku.priceAll);
                    }

                })
                if (this.id) {
                    this.tableData.forEach(el => {
                        for (let sku of el.meterialSkuSet) {
                            if (sku.priceAll == undefined) {
                                sku.priceAll = 0;
                            }
                            if (sku.priceAllType === 1) {
                                sku.priceAll = 0;
                            }
                            sum1 += Number(sku.priceAll);
                        }
                    })
                }
                console.log(sum, sum1);
                // this.money = (sum + sum1).toFixed(2);
            },
            storeList() {
                let params = {
                    unitId: this.unitId
                };
                storeList(params).then(res => {
                    this.store = res.data.storehouses;
                    this.form.storeId = res.data.storehouses[0].id;
                    this.store.forEach(item => {
                        if (item.isDefault == true) {
                            this.form.storeId = item.id
                        }
                    })
                });
            },
        },
        async created() {
            const urlVal = this.$route.query;

            // if (urlVal.addtype == 'false') {
                this.addtype = false
            // } else {
            //     this.addtype = true
            // }
            if(this.orderNoId) {
                let params = {
                    "unitId": this.unitId,
                    "billMaterialPurchaseIds": [this.orderNoId],
                    "materialSkuIds": []
                }
               await this.handleData(params)
                this.allWrite()
            }


            if(this.type == 'add'){
                this.title =this.isSampleMaterial?'新建样料到料单':'新建到料单';
                this.storeList()
            }else{
                this.title =this.isSampleMaterial?'样料到料单详情':'到料单详情';
            }
            if(this.source){
                this.title =this.isSampleMaterial?'样料到料单重编辑':'到料单重编辑';
                this.storeList()
            }

            if(this.supplierId){
                this.form.supplier = this.supplierId;

                const supMes = {};
                supMes.id = this.supplierId;
                if(this.supName){
                    supMes.name = this.supName;
                }else{
                    supMes.name = '';
                }
                this.urlSupplier.push(supMes);
                this.canSelect = true;
            }

            // this.title = this.$route.query.type == 'add' ? '新建到料单' : '到料单详情';
            // this.$route.query.type == 'add' ? this.storeList() : '';
            // this.$route.query.supplierId ? this.form.supplier = this.$route.query.supplierId : '';
            if(this.detailMaterialdata){
                this.form.materielMan = this.detailMaterialdata.creatorId;
                return
            }
            this.form.materielMan = this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId;
            // console.log(this.form.supplier, '~~~~~');
        },
        mounted(){
            // 重编辑
            if(this.detailMaterialdata){
                console.log(this.detailMaterialdata);
                this.canSelect = true;
                this.form.order = this.detailMaterialdata.orderNo;
                this.form.supplier = this.detailMaterialdata.supplierId;
                this.form.date = this.detailMaterialdata.dateArrive;
                this.form.checked = this.detailMaterialdata.outsideFactoryName?true:false;
                this.form.outsideFactoryId = this.detailMaterialdata.outsideFactoryId;
                this.parentFacId = {id:this.form.outsideFactoryId}
                // this.form.materielMan = this.detailMaterialdata.creatorId;
                this.form.remark = this.detailMaterialdata.remark;
                //修改字段匹配
                this.newTableSel = this.detailMaterialdata.arriveActionDetail.materialSkuList.map(item=>{
                    let totalUnArrivedPurchaseQuantity = 0;
                    let sourceBillForArriveList = item.billPurchaseList.map(bill => {
                        let unArrivedPurchaseQuantity = (bill.quantityStockUnitPurchase-bill.quantityArrive).toFixed(2) * 1
                        totalUnArrivedPurchaseQuantity = (totalUnArrivedPurchaseQuantity + unArrivedPurchaseQuantity).toFixed(2) * 1
                        return {
                            billMaterialPurchaseId: bill.billMaterialPurchaseId, //采购单ID
                            materialsSkuId: bill.materialSkuId, //物料ID
                            sourceBillId: bill.demandSourceBillId, //生产单ID
                            purchaseDate: bill.datePurchase, //采购日期
                            billMaterialPurchaseNo: bill.billMaterialPurchaseOrderNo, //采购单号
                            styleNo: bill.styleNo, //成衣款号
                            sourceBillNo: bill.demandSourceBillNo, //生产单号
                            outsideFactoryName: '', //加工厂
                            conversionRate: bill.purchaseConversionRate, //采购转化率
                            purchaseQuantityStockUnitNow: bill.quantityStockUnitPurchase, //本次采购(库存单位)
                            unArrivedPurchaseQuantity, //采购未到
                            arriveStatus: ((bill.quantityStockUnitPurchase-bill.quantityArrive).toFixed(2) * 1) > 0 ? 1 : 2, //是否到齐
                            priceUnit: bill.priceUnit, //到料单价
                            purchaseUnitName: item.purchaseUnitName, //采购单位
                            stockUnitName: item.unit, //库存单位
                            deliveryQuantityNow: bill.quantityArrive, //本次到料
                            quantity: bill.quantity // 到料数(采购单位)
                        }
                    })
                        return {
                            kindName: item.kindName, // 分类
                            commonMaterialsSkuPicture: item.commonMaterialsPictureList?item.commonMaterialsPictureList[0]:'', //图片
                            materialsNo: item.kindNo, //物料款号
                            materialsName: item.materialName, //物料名称
                            colorName: item.colorName, //颜色
                            specificationsNo: item.specificationsNumber, // 规格
                            supplierStyleColor: item.supplierStyleNo + '/' + item.supplierColorNo, //供应商款号/色号
                            totalUnArrivedPurchaseQuantity, //合计未到
                            quantity: item.quantity, //合计到料数
                            purchaseUnitName: item.purchaseUnitName, //采购单位
                            stockUnitName:item.unit, //库存单位
                            deliveryQuantityNow: item.quantityArrive, //合计到料
                            materialsSkuId: item.materialSkuId, //物料Id
                            sourceBillForArriveList, //按单到料列表
                        }
                });

            }
        },
    }
</script>
<style lang="scss" scoped>
    .material-new-remove-right{
        position: fixed;
        top: 0;
        right: 0;
        width: calc(100% - 300px) !important;
        height: 100%;
        overflow-y: scroll;
        overflow-x: hidden;
        background-color: #fff;
        z-index: 2000;
        .page_title{
            padding: 16px;
        }

    }
    .material-add {
        .red-star:before{
            position: absolute;
            top: 12px;
            left: 7px;
            content: '*';
            color: #ff4949;
            margin-right: 4px;
            font-size: 14px;
        }
        .king {
            color: #FF7F14;
        }
        .mg20 {
            margin: 20px 0;
            color: #808080;
        }
        .mgl10 {
            margin-left: 10px;
        }
        .form {
            background-color: #fff;
            padding: 24px 24px 24px 15px;
        }
        .mgt20 {
            margin-top: 20px !important;
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
        .table-census {
            height: 50px;
            background-color: #F7F9FC;
            border-right: 1px solid rgb(223, 228, 236);
            border-left: 1px solid rgb(223, 228, 236);
            border-top: 1px solid rgb(223, 228, 236);
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 14px;
            .last-span {
                display: inline-block;
                margin-left: 20px;
            }
        }
        .table-header {
            display: flex;
            justify-content: flex-start;
            font-size: 12px;
            font-weight: 600;
            div {
                display: flex;
                justify-content: center;
                align-items: center;
                border-right: 1px solid rgb(223, 228, 236);
                height: 28px;
                &:nth-child(1) {
                    padding: 0 6px;
                    width: 80px;
                    box-sizing: border-box;
                }
                &:nth-child(2) {
                    padding: 0 6px;
                    width: 140px;
                    box-sizing: border-box;
                }
                &:nth-child(3) {
                    width: 80px;
                    padding: 0 6px;
                    border: none;
                    box-sizing: border-box;
                }
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
                display: flex;
                justify-content: center;
                align-items: center;
                border-right: 1px solid rgb(223, 228, 236);
                border-bottom: 1px solid rgb(223, 228, 236);
                margin-bottom: -1px;
                &:nth-child(1) {
                    width: 80px;
                    box-sizing: border-box;
                }
                &:nth-child(2) {
                    width: 140px;
                    box-sizing: border-box;
                }
                &:nth-child(3) {
                    width: 80px;
                    border-right: none;
                }
            }
        }
        .this {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            background-color: #E6EAF0;
        }
        .footer {
            margin-top: 12px;
        }
        .cell__row {
            height: 32px;
            line-height: 32px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            word-break: break-all;
            border-bottom: 1px solid #E6EAF0;
            box-sizing: border-box;
            &:last-child {
                border: none;
            }
        }
        .cell__row-border {
            height: 32px;
            line-height: 32px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-between;
            word-break: break-all;
            border-bottom: 1px solid #E6EAF0;
            box-sizing: border-box;
        }
        .boder-none {
            border: none;
        }
        .materialListFinancial {
            margin-top: 25px;
        }
        .orange-btn{
            color:#ff9c38 ;
            background: transparent;
            border: 1px solid #ff9c38;
        }
        .blue-btn{
            color:#1CA1FF ;
            background: transparent;
            border: 1px solid #1CA1FF;
        }
    }

</style>
<style lang="scss">
    @import '../../../assets/style/el-table.scss';

    .material-add {
        .el-date-editor.el-input {
            width: 100% !important;
        }
        .el-select {
            width: 100% !important;
        }
        .el-form-item {
            margin-bottom: 12px !important;
        }
        .now {
            .el-input__inner {
                border-top: none;
                border-right: none;
                border-left: none;
                border-bottom: 1px solid #E6EAF0;
                height: 32px;
                margin-top: 1px;
                text-align: center;
                background-color: #F5F7FA;
            }
        }
        .price {
            .el-input__inner {
                border: none;
                height: 100%;
                border-bottom: 1px solid #E6EAF0;
                text-align: center;
                background-color: #F5F7FA;
            }
        }
    }

    .tabless {
        .el-table th > .cell {
            padding: 0;
        }
        .el-table__body {
            .cell,
            td {
                padding: 0;
            }
        }
        .el-table .cell {
            line-height: 12px;
        }
    }
</style>


