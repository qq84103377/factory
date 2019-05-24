/*
 * @Author: kuhn 
 * @Description: 采购需求看板
 * @Date: 2019-05-22 10:32:42 
 * @Last Modified by: kuhn
 * @Last Modified time: 2019-05-24 13:11:24
 */

<template>
    <div class="scroll-content purchase-need">
        <div class="custom-tab-bar pdlr24">
            <div class="bar-list" style="min-width:212px; ">
                <div @click="changeType1" :class="['item',dataType===1?'active':'']">按生产单查看</div>
                <div @click="changeType0" :class="['item',dataType===0?'active':'']">按物料查看</div>
            </div>
            <div>
                <div class="finish-tip">
                    <span class="green-block"></span>
                    已完成
                </div>
                <div class="filter-block">
                    <span>筛选</span>
                    <need-filter ref="purchaseNeedFilter" @filterData="filterData"></need-filter>
                    <el-input @change="handleCurrentChange" v-model="queryColumn" class="mgl8 mgr-4" style="width: 240px;font-size: 12px;" placeholder="输入商品款号/生产单号/物料/供应商"
                              icon="search"></el-input>
                    <nf-button @click="excel" class="mgl8" fsize='12'>导出表格</nf-button>
                </div>
                <el-dropdown class="mgl8 mgr-4" @command="handleMoreCommand">
                    <nf-button class="mgr-4" fsize='12'
                               style="color: #1CA1FF;border-color: #1CA1FF;background: transparent;" plain
                               type="primary">
                        更多
                    </nf-button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="批量标完成">批量标完成</el-dropdown-item>
                        <el-dropdown-item command="批量撤销完成">批量撤销完成</el-dropdown-item>
                        <el-dropdown-item v-if="allocationPurchaser.btnVisible" command="分配采购员">分配采购员</el-dropdown-item>
                        <el-dropdown-item command="采购配置">采购配置</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <nf-button class="mgl8 mgr-4" v-if="purchaseSel" fsize='12' style="width: 120px;" @click="showNewPurchase(true)"
                           type="warning">+ 一键采到送
                </nf-button>
                <nf-button class="mgl8" fsize='12' @click="showNewPurchase(false)" type="warning">+去采购</nf-button>
            </div>
        </div>
        <div  v-loading="supplierLoading"
                ref="purchaseNeedContent"
                class="main-content pdlr24 mgt16 table">
            <!-- 生产单查看 -->
            <el-table
                    v-if="dataType==1 && mission.fieldConfigList.length>0"
                    :height="tableHeight"
                    :row-class-name="tableRowClassName"
                    :data="missionTable"
                    border
                    @sort-change="sortTable"
                    @selection-change="selectChange"
                    key="mission"
                    ref="purchaseNeedMissionTable"
                    class="custom-table tiny-row"
                    style="width: 100%">
                <el-table-column
                        v-for="column in mission.fieldConfigList"
                        v-if="column.code!=='inverseDemand'"
                        :key="column.code"
                        :prop="column.code"
                        :label="column.name"
                        :sortable="mission.sortable.includes(column.name)?'custom':undefined"
                        :min-width="getColumnWidth(column.name)"
                        :fixed="mission.fixedLeft.includes(column.name)?'left':mission.fixedRight.includes(column.name)?'right':undefined"
                        :class-name="mission.yellowBg.includes(column.name)?'yellow-bg':''">
                    <template slot-scope="scope">
                        <div>
                            <span v-if="['制单日期','货期'].includes(column.name)">
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
                                        class="color-text">{{el.commonBillLabelName}}</span></div>
                                <div>
                                    <select-tag v-if="isTagShow" :selectTagList="scope.row.billLabelList" :tagList="tagList"
                                                @addSuccess="addSuccess" :orderId="scope.row.demandSourceBillId"
                                                :materialSkuId="scope.row.materialsSkuId"
                                                @selectItem="selectItem"></select-tag>
                                </div>
                            </div>
                            <div style="height: 24px;width: 100%" v-else-if="column.name ==='供应商'"
                                 @click="showChangeSupplier(scope.$index,scope.row)">
                                {{scope.row[column.code]}}
                            </div>
                            <div v-else-if="column.name ==='供应商款号/色号'">
                                {{scope.row.supplierStyleNo}}/{{scope.row.supplierColorNo}}
                            </div>
                            <div v-else-if="column.name ==='计划采购'" @click="updatePurchaseDemand(scope.row)">
                                {{scope.row[column.code]}}
                            </div>
                            <div v-else-if="column.name ==='主动占用'" @click="active(scope.row)">
                                {{scope.row[column.code]}}
                            </div>
                            <div v-else-if="column.name ==='可用库存'" @click="active(scope.row)">
                                {{scope.row[column.code]}}
                            </div>
                            <span v-else-if="column.name ==='待采购'" :class="{'red':scope.row[column.code]>0}">
                                {{scope.row[column.code]}}
                            </span>
                            <span v-else-if="column.name ==='参考价'">
                                {{scope.row.planCost}}元/{{scope.row.purchaseUnitName}}
                            </span>
                            <span v-else>{{scope.row[column.code]}}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" width="45" align="center">
                    <template slot-scope="scope">
                        <div :class="['pointer',scope.row.quantityPurchased>0?'gray':'blue']" @click="editMaterialSku(scope.row)">
                            <span v-if="scope.row.demandSourceBillType == 0">换料</span>
                            <el-popover
                                    v-else
                                    popper-class="goods-list-popover"
                                    placement="left"
                                    min-width="100"
                                    trigger="click">
                                <ul>
                                    <li @click="getFacPrdOrderGoodsBom(item.id)"
                                        v-for="item in editFacPreOrderBom.goodsList" :key="item.id">{{item.name}}
                                    </li>
                                </ul>
                                <span slot="reference">换料</span>
                            </el-popover>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                        v-if="mission.fieldConfigList.some(item=>item.code==='inverseDemand')"
                        fixed="right"
                        align="center"
                        width="70">
                    <template slot-scope="scope">
                        <div class="blue">
                            <span @click="MaterialBackCalculation(scope.row)" v-if="scope.row.inverseDemand" style="cursor: pointer">物料反算</span>
                        </div>

                    </template>
                </el-table-column>
                <el-table-column
                        fixed="right"
                        align="center"
                        type="selection"
                        width="55">
                </el-table-column>
            </el-table>
            <!-- 按物料查看 -->
            <el-table
                    v-if="dataType==0 && supplier.fieldConfigList.length>0"
                    :height="tableHeight"
                    :row-class-name="tableRowClassName"
                    :data="supplierTable"
                    border
                    @selection-change="selectChange"
                    key="supplier"
                    ref="purchaseNeedSupplierTable"
                    class="custom-table tiny-row"
                    style="width: 100%">
                <el-table-column
                        v-for="column in supplier.fieldConfigList"
                        v-if="column.code!=='inverseDemand'"
                        :key="column.code"
                        :prop="column.code"
                        :label="column.name"
                        :min-width="getColumnWidth(column.name)"
                        :fixed="supplier.fixedLeft.includes(column.name)?'left':supplier.fixedRight.includes(column.name)?'right':undefined"
                        :class-name="supplier.yellowBg.includes(column.name)?'yellow-bg':''">
                    <template slot-scope="scope">
                        <div>
                            <span v-if="['制单日期','货期'].includes(column.name)">
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
                                        class="color-text">{{el.commonBillLabelName}}</span></div>
                                <div>
                                    <select-tag v-if="isTagShow" :selectTagList="scope.row.billLabelList" :tagList="tagList"
                                                @addSuccess="addSuccess" :orderId="scope.row.demandSourceBillId"
                                                :materialSkuId="scope.row.materialsSkuId"
                                                @selectItem="selectItem"></select-tag>
                                </div>
                            </div>

                            <div style="height: 24px;width: 100%" v-else-if="column.name ==='供应商'"
                                 @click="showChangeSupplier(scope.$index,scope.row)">
                                {{scope.row[column.code]}}
                            </div>
                            <div v-else-if="column.name ==='供应商款号/色号'">
                                {{scope.row.supplierStyleNo}}/{{scope.row.supplierColorNo}}
                            </div>
                            <div v-else-if="column.name ==='计划采购'" @click="updatePurchaseDemand(scope.row)">
                                {{scope.row[column.code]}}
                            </div>
                            <div v-else-if="column.name ==='主动占用'" @click="active(scope.row)">
                                {{scope.row[column.code]}}
                            </div>
                            <div v-else-if="column.name ==='可用库存'" @click="active(scope.row)">
                                {{scope.row[column.code]}}
                            </div>
                            <span v-else-if="['待采购','总待采购'].includes(column.name)" :class="{'red':scope.row[column.code]>0}">
                                {{scope.row[column.code]}}
                            </span>
                            <span v-else-if="column.name ==='参考价'">
                                {{scope.row.planCost}}元/{{scope.row.purchaseUnitName}}
                            </span>
                            <span v-else>{{scope.row[column.code]}}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" width="45" align="center">
                    <template slot-scope="scope">
                        <div :class="['pointer',scope.row.quantityPurchased>0?'gray':'blue']" @click="editMaterialSku(scope.row)">
                            <span v-if="scope.row.demandSourceBillType == 0">换料</span>
                            <el-popover
                                    v-else
                                    popper-class="goods-list-popover"
                                    placement="left"
                                    min-width="100"
                                    trigger="click">
                                <ul>
                                    <li @click="getFacPrdOrderGoodsBom(item.id)"
                                        v-for="item in editFacPreOrderBom.goodsList" :key="item.id">{{item.name}}
                                    </li>
                                </ul>
                                <span slot="reference">换料</span>
                            </el-popover>
                        </div>

                    </template>
                </el-table-column>
                <el-table-column
                        v-if="supplier.fieldConfigList.some(item=>item.code==='inverseDemand')"
                        fixed="right"
                        align="center"
                        width="70">
                    <template slot-scope="scope">
                        <div class="blue">
                            <span @click="MaterialBackCalculation(scope.row)" v-if="scope.row.inverseDemand" style="cursor: pointer">物料反算</span>
                        </div>

                    </template>
                </el-table-column>
                <el-table-column
                        fixed="right"
                        align="center"
                        type="selection"
                        width="55">
                </el-table-column>
            </el-table>
        </div>
        <div class="pdlr24 pdtb16 text-right">
            <nf-button @click="columnConfigVisible = true" style="background: #fff" class="mgl8 fl" fsize='12'>表头配置</nf-button>
            <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="20"
                           layout="total, prev, pager, next" :total="total">
            </el-pagination>
            <textarea id="contents" style="position:absolute;height:0;width:0;opacity: 0;" rows="10" cols="10">{{copyData}}</textarea>
        </div>
        <!--//图片预览-->
        <imgPreview @dialogClose="centerDialogVisible=false" :centerDialogVisible="centerDialogVisible"
                    :imgLists="imgLists" :imgIndex="imgIndex"></imgPreview>

        <!--主动占用-->
        <initiative-dialog
                :visible.sync="showDialog"
                :skuId="skuId"
                :materialPurchaseDemandId="materialPurchaseDemandId"
                :materialName="materialName"
                @success="dataType === 1?purchaseMissionPage():purchaseSupplierPage()">
        </initiative-dialog>

        <occupy-dialog @success="dataType === 1?purchaseMissionPage():purchaseSupplierPage()" v-model="occupyNum"
                       :visible.sync="occupyShow" :tableItem="tableItem"></occupy-dialog>

        <el-dialog :modal-append-to-body="false" style="z-index: 9000;" class="custom-dialog"
                   :visible.sync="updatePurchaseDialogVisible" size="tiny">
            <div class="text-center">
                <span>计划采购：</span>
                <el-input style="width: 180px;" v-model="purchaseDemandNum" type="number"
                          :min="purchaseDemandData.materialDemand" placeholder="输入值不能小于物料需求值"></el-input>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="updatePurchaseDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="determineUpdate()">确 认</el-button>
            </div>
        </el-dialog>
        <!-- BOM编辑组件 -->
        <transition name="opcity">
            <div style="z-index: 999" class="cover" v-show='editFacMissionBom.visible||editFacPreOrderBom.visible || newPurchase.visible'>
            </div>
        </transition>
        <transition name="right-move">
            <create-bom-table
                    :facMissionId="editFacMissionBom.facMissionId"
                    from="missionOrder"
                    type="editor"
                    :bomData="editFacMissionBom.bomData"
                    title="编辑BOM表"
                    v-if="editFacMissionBom.visible"
                    :styleId="editFacMissionBom.styleId"
                    @success="changeMaterialSuccess"
                    @cancel="editFacMissionBom.visible =false">
            </create-bom-table>
            <create-bom-table
                    :facPreOrderId="editFacPreOrderBom.facPreOrderId"
                    from="productionOrder"
                    @orderProductionTableEdit="orderProductionTableEdit"
                    type="editor1"
                    v-if="editFacPreOrderBom.visible"
                    :bomData="editFacPreOrderBom.bomData"
                    title="编辑BOM表"
                    :styleId="editFacPreOrderBom.styleId"
                    source='orderProduction'
                    @cancel="editFacPreOrderBom.visible = false">
            </create-bom-table>
            <!--新建采购单-->
            <new-purchase
                    :isSampleMaterial="false"
                    :isEdit="false"
                    :visible.sync="newPurchase.visible"
                    :isPickUpDelivery="newPurchase.isPickUpDelivery"
                    v-if="newPurchase.visible"
                    :demandSelectedList="newPurchase.demandSelectedList"
                    @cancel="cancelSelected"
                    @success="handleCurrentChange(1)"></new-purchase>
        </transition>
        <transition name="opcity">
            <div style="z-index: 999" @click="adjustOrderRightMove=false;workOrderRightMove=false" class="cover" v-if='adjustOrderRightMove||workOrderRightMove'>
            </div>
        </transition>
        <transition name="right-move">
            <adjustOrder @toggle="adjustOrderRightMove=false" fromType="purchaseNeed" v-if="adjustOrderRightMove"></adjustOrder>
            <workCalculation @toggle="workOrderRightMove=false" fromType="purchaseNeed" v-if="workOrderRightMove"></workCalculation>
        </transition>
        <!--供应商选择组件-->
        <supplier-change
                :visible.sync="changeSupplier.visible"
                :materialRow="changeSupplier.materialRow"
                @confirm="updateSupplierData">
        </supplier-change>
        <dynamic-column-config
                :visible.sync="columnConfigVisible"
                :title="dataType === 1?'采购需求看板-按生产表头配置':'采购需求看板-按物料表头配置'"
                :targetType="dataType === 1?'PURCHASE_DEMAND_BILL_LIST':'PURCHASE_DEMAND_MATERIALS_LIST'"
                @confirm="getFieldConfigCodeAndNameList"
        ></dynamic-column-config>
        <!--分配采购员弹窗-->
        <el-dialog  @close="cancelAllocationPurchaser" title="分配采购员" :modal-append-to-body="false" class="custom-dialog  allocation-purchaser-dialog"
                   :visible.sync="allocationPurchaser.visible" size="tiny">
            <el-form label-width="100px">
                <el-form-item label="分配采购员:" required>
                    <workerLeader single="single" v-model="allocationPurchaser.purchaserId"
                                  :placeholder="'请选择'"></workerLeader>
                </el-form-item>
            </el-form>
            <div slot="footer" class="text-right">
                <el-button @click="cancelAllocationPurchaser">取 消</el-button>
                <el-button :loading="allocationPurchaser.isSubmitting" type="primary" @click="confirmAllocationPurchaser">确 认</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import initiativeDialog from './initiativeDialog'
    import {purchaseConfig} from '@/api'
    import {
        purchaseMissionPage,
        purchaseSupplierPage,
        updatePurchaseDemand,
        exportExcelOnMission,
        exportExcelOnSupplier,
        purchaseDemandList,
        manualComplete,
        batchUpdatePurchaseDemandStatus,
        MPRFieldConfigList,
        updateMaterialPurchaseDemanSupplier,
        purchaseMaterialsPage,
        getGoodsForChangeMaterial,
        getFacPrdOrderGoodsBom,
        purchaseFacFieldConfigCodeAndNameList,
        allocationPurchaser,
        checkAllocationPurchaser
    } from '@/api/material.js'
    import {
        queryAllBillLabel,
        allocationBillLabel,
        facMissionBomEditInfo,
        frdOrderBom,
        editFacPrdOrderGoodsMaterialSku,
        stockSkuPreuseConfig
    } from '@/api'
    import adjustOrder from '../../../orderProduction/adjustOrder/index'

    const fun = require('../../../Common/commonFun.js')
    import occupyDialog from './occupyDialog'
    import needFilter from './need-filter'
    import selectTag from '@/components/material/components/selectTag.vue'
    import CreateBomTable from "@/components/goods/goodsBom/CreateBomTable";
    import supplierChange from "@/components/goods/goodsBom/supplierChange.vue";
    import SlideFilter from "../../../Common/slideFilter";
    import DynamicColumnConfig from "../dynamicColumnConfig";
    import NewPurchase from "../new-purchase/new-purchase";
    import workCalculation from "../workOrderCalculation"


    export default {
        data() {
            return {
                workOrderRightMove:false,
                adjustOrderRightMove:false,

                tableItem: {},
                occupyShow: false,
                occupyNum: '', //主动占用数值
                updatePurchaseDialogVisible: false,
                purchaseDemandData: {},
                purchaseDemandNum: 0,
                centerDialogVisible: false, //判断显示图片预览显示与隐藏
                loading: false, // 生产单loading
                supplierLoading: false, // 供应商loading
                imgLists: [],
                imgIndex: 0,
                dataType: 1,
                currentPage: 1,
                form: {},
                queryColumn:'', //搜索关键字
                total: 0,
                supplierTable: [],
                supplier: {
                    fieldConfigList: [],//按物料查看动态列
                    yellowBg:['供应商','主动占用','可用库存','计划采购'], //要黄色底的列
                    fixedLeft:[],
                    fixedRight:['待采购','总待采购']
                },
                missionTable: [],
                mission: {
                    fieldConfigList: [],//按生产单查看动态列
                    sortable: ['生产单号', '制单日期'], //要排序对列
                    yellowBg:['供应商','主动占用','可用库存','计划采购'], //要黄色底的列
                    fixedLeft:[],
                    fixedRight:['待采购']

                },
                copyData: '',
                sortType: 0,
                // configArr: [],       //配置表头数组
                // canShow: false,      //控制是否显示表格
                isTagShow: true, // 标签权限问题
                tagList: [],
                demandIds: [], //选中的列表行的materialPurchaseDemandId
                isSubmitting: false,
                editFacMissionBom: {
                    facMissionId: '',
                    bomData: {},
                    visible: false,
                    styleId: '',
                    materialsSkuId: ''
                },
                editFacPreOrderBom: {
                    facPreOrderId: '',
                    facPrdOrderGoodsId: '',
                    bomData: {},
                    visible: false,
                    styleId: '',
                    goodsList: [],
                    materialsSkuId: ''
                },
                changeSupplier: {
                    visible: false,
                    materialIndex: '', //  物料sku所有，
                    materialRow: {}, //当前要更换供应商单行单物料sku相关信息
                },
                tableHeight: 300,
                purchaseSel: false,
                columnConfigVisible:false,//表头配置弹窗是否可见
                newPurchase:{
                    isPickUpDelivery:false,
                    visible:false,
                    demandSelectedList:[]
                },
                allocationPurchaser:{
                    visible:false,
                    purchaserId:'',
                    isSubmitting:false,
                    btnVisible:false

                },
                showDialog: false,
                skuId: '',
                materialName: '',
                materialPurchaseDemandId: '',
            }
        },
        components: {
            workCalculation,
            adjustOrder,
            initiativeDialog,
            NewPurchase,
            DynamicColumnConfig,
            SlideFilter,
            needFilter,
            selectTag,
            occupyDialog,
            CreateBomTable,
            supplierChange
        },
        watch: {
            $route(to, from) {
                // 如果从新建采购计划页面返回，将原先选中的行全部取消选中
                if (from.path === '/newPurchase') {
                    this.cancelAllCheckbox()
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
        computed: {
            unitId() {
                return JSON.parse(sessionStorage.getItem("last_login")).id
            },
            userId() {
                return (this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem("user_login")).userId);
            },
            facId() {
                return JSON.parse(sessionStorage.getItem("last_login")).id
            }
        },
        mounted() {
            this.$refs.purchaseNeedFilter.filter()
            this.$nextTick(() => {
                let self = this;
                this.tableHeight = this.$refs.purchaseNeedContent.offsetHeight
                // 通过捕获系统的onresize事件触发去改变原有的高度
                window.onresize = function () {
                    self.tableHeight = self.$refs.purchaseNeedContent.offsetHeight
                }
            })
        },
        activated() {
            this.purchaseConfig()
        },
        methods: {
            getColumnWidth(columnName){
                let width = 120
                switch (columnName){
                    case '生产单号': width =160;break;
                    case '图片': width =60;break;
                    case '物料需求': width =70;break;
                    case '制单日期': width =90;break;
                    case '货期': width =90;break;
                    case '单位': width =55;break;
                    case '参考价': width =90;break;
                    case '计划采购': width =70;break;
                    case '单件用量': width =70;break;
                    case '用料货品数': width =90;break;
                    case '损耗率': width =60;break;
                    case '主动占用': width =70;break;
                    case '可用库存': width =70;break;
                    case '本单总占用': width =90;break;
                    case '已采购': width =60;break;
                    case '本单总占用': width =90;break;
                    case '采购未到': width =70;break;
                    case '已到料': width =60;break;
                    case '已退料': width =60;break;
                    case '总库存': width =60;break;
                    case '物料反算': width =70;break;
                    case '总库存': width =80;break;
                    case '合计待采': width =70;break;
                    case '待采购': width =70;break;

                }
                return width
            },
            //物料反算
            MaterialBackCalculation(row){

                //权限
                if (!this.powerJudgement.permissions("fac.purchaseOrder.inverseDemand")) {
                    return
                }

                this.$router.replace({path:this.$route.path,query:{
                        id:row.demandSourceBillId,
                        type:1
                    }});
              if(row.demandSourceBillType===0){
                  //工单
                  this.workOrderRightMove = true
              }else {
                  this.adjustOrderRightMove = true
              }

            },
            // 显示分配采购员弹窗
            showAllocationPurchaser(){
                // 权限
                if(!this.powerJudgement.permissions("fac.purchaseOrder.allocationPurchaser")){
                    return
                }
                if(!this.demandIds.length){
                    this.$message.error('请先勾选采购需求')
                    return
                }
                // 验证是否能分配采购员
                let params = {
                    purchaseDemandIds:this.demandIds
                }
                checkAllocationPurchaser(params).then( res =>{
                    if(res.data.code == 0){
                        this.allocationPurchaser.visible = true
                    } else{
                        this.$message.error(res.data.msg)
                    }
                })
            },
            cancelAllocationPurchaser(){
                this.allocationPurchaser.visible = false
                this.allocationPurchaser.purchaserId = ''

            },
            // 确认分配采购员
            confirmAllocationPurchaser(){
                if(!this.allocationPurchaser.purchaserId){
                    this.$message.error('请先选择采购员')
                    return
                }
                let params = {
                    unitId:this.unitId,
                    operaterId:this.userId,
                    purchaserId:this.allocationPurchaser.purchaserId,
                    purchaseDemandIds:this.demandIds
                }
                this.allocationPurchaser.isSubmitting = true
                allocationPurchaser(params).then(res =>{
                    this.allocationPurchaser.isSubmitting = false
                    this.allocationPurchaser.visible = false
                    this.allocationPurchaser.purchaserId = ''
                    if(res.data.code ==0){
                        this.$message.success('分配成功')
                        this.dataType == 1 ? this.purchaseMissionPage() : this.purchaseSupplierPage()
                    } else{
                        this.$message.success('分配失败')

                    }
                })
            },
            // 取消新建
            cancelSelected(){
                if(this.dataType == 1){
                    this.missionTable.forEach(row => {
                        this.$refs['purchaseNeedMissionTable'].toggleRowSelection(row, false)
                    })
                } else {
                    this.supplierTable.forEach(row =>{
                        this.$refs['purchaseNeedSupplierTable'].toggleRowSelection(row, false)
                    })
                }

            },
            // 获取表格要显示的列
            getFieldConfigCodeAndNameList(){
                let params = {
                    unitId:this.unitId,
                    targetType:this.dataType === 1?'PURCHASE_DEMAND_BILL_LIST':'PURCHASE_DEMAND_MATERIALS_LIST'
                }
                this.dataType === 1?this.mission.fieldConfigList = []:this.supplier.fieldConfigList = []
                purchaseFacFieldConfigCodeAndNameList(params).then(res =>{
                    if( res.data.code===0 ){
                        this.dataType === 1?this.mission.fieldConfigList = res.data.data:this.supplier.fieldConfigList = res.data.data
                    }
                })

            },
            //判断一键采到送是否有
            purchaseConfig() {
                let params = {
                    id: this.unitId
                };
                purchaseConfig(params).then(res => {

                    let selData = res.data.data.find(item => item.code === 'pro_mission_material');
                    this.purchaseSel = selData.select
                })
            },
            // 更多下拉菜单里面按钮的点击
            handleMoreCommand(command) {
                switch (command) {
                    case '批量标完成' :
                        this.batchSetComplete(2);
                        break;
                    case '批量撤销完成' :
                        this.batchSetComplete(1);
                        break;
                    case '分配采购员' :
                        this.showAllocationPurchaser();
                        break;
                    case '采购配置' :
                        this.$router.push('purchaseAllocation');
                        break;
                }
            },
            // 去采购
            showNewPurchase(isPickUpDelivery) {
                // 权限
                if (!this.powerJudgement.permissions("fac.purchaseOrder.add")) {
                    return
                }
                this.newPurchase.isPickUpDelivery = isPickUpDelivery
                this.newPurchase.visible = true
            },
            waitPurchaseSum(row) {
                return row.demands.reduce((total, v) => {
                    return total + (v.waitPurchaseQuantity || 0)
                }, 0)
            },
            showChangeSupplier(index,row) {
                if (row.quantityPurchased > 0) {
                    this.$message.error('该物料需求已开采购单')
                    return
                }
                this.changeSupplier.materialIndex = index
                this.changeSupplier.materialRow = row
                this.changeSupplier.visible = true
            },
            //更新供应商信息
            updateSupplierData(data) {
                let params = {
                    materialPurchaseDemandId: this.changeSupplier.materialRow.materialPurchaseDemandId,
                    supplierId: data.supplierId
                }
                updateMaterialPurchaseDemanSupplier(params).then(res => {
                    if (res.data.code == 0) {
                        let materialIndex = this.changeSupplier.materialIndex
                        let row = {}
                        // 按生产单
                        if (this.dataType == 1) {
                            row = this.missionTable[materialIndex]
                        } else {
                            row = this.supplierTable[materialIndex]
                        }
                        this.$set(row, 'supplierId', data.supplierId)
                        this.$set(row, 'supplierName', data.supplierName)
                        this.$set(row, 'supplierStyleColor', data.supplierStyleNo+'/'+data.supplierColorNo)
                        this.$set(row, 'supplierStyleNo', data.supplierStyleNo)
                        this.$set(row, 'supplierColorNo', data.supplierColorNo)
                        this.$set(row, 'planCost', data.planCost)
                        this.$set(row, 'excludingTaxPrice', data.excludingTaxPrice)
                        this.$message.success('更换成功')
                    } else {
                        this.$message.error(res.data.msg)
                    }
                })

            },
            async editMaterialSku(row) {
                if (row.quantityPurchased > 0) {
                    this.$message.error('该物料需求已开采购单')
                    return
                }
                // 生产工单换料
                if (row.demandSourceBillType == 0) {
                    let params = {
                        userId: this.userId,
                        facId: JSON.parse(sessionStorage.getItem("last_login")).id,
                        missionId: row.demandSourceBillId
                    };
                    facMissionBomEditInfo(params).then(res => {
                        this.editFacMissionBom.styleId = row.styleId
                        this.editFacMissionBom.bomData = res.data.data;
                        this.editFacMissionBom.bomData.name = res.data.data.name
                        this.editFacMissionBom.bomData.commonBomId = res.data.data.commonBomId
                        this.editFacMissionBom.facMissionId = res.data.data.facMissionId;
                        if (this.editFacMissionBom.bomData.commonMaterialsSkuList) {
                            this.editFacMissionBom.bomData.commonMaterialsSkuList.forEach(item => {
                                item.facMissionBomId = res.data.data.id;
                            })
                        }
                        this.editFacMissionBom.materialsSkuId = row.materialsSkuId
                        this.editFacMissionBom.visible = true
                    })

                }
                // 生产订单换料
                else {
                    this.editFacPreOrderBom.goodsList = []
                    this.editFacPreOrderBom.goodsList = await this.getGoodsForChangeMaterial(row.demandSourceBillId, row.materialsSkuId)
                    this.editFacPreOrderBom.materialsSkuId = row.materialsSkuId
                    if (this.editFacPreOrderBom.goodsList.length == 1) {
                        this.getFacPrdOrderGoodsBom(this.editFacPreOrderBom.goodsList[0].id)
                    }
                }
            },
            // 点击换料时，获取订单的所有商品
            async getGoodsForChangeMaterial(facPrdOrderId, materialsSkuId) {
                let params = {
                    facPrdOrderId,
                    materialsSkuId
                }
                let goodsList = []
                await getGoodsForChangeMaterial(params).then(res => {
                    if (res.data.code == 0) {
                        goodsList = res.data.data
                    }
                })
                return goodsList
            },
            // 换料成功后刷新列表
            changeMaterialSuccess() {
                this.dataType == 1 ? this.purchaseMissionPage() : this.purchaseSupplierPage()
            },
            // 获取订单指定商品的bom
            getFacPrdOrderGoodsBom(facPrdOrderGoodsId) {
                $('.goods-list-popover').hide()
                let params = {
                    userId: this.userId,
                    facPrdOrderGoodsId: facPrdOrderGoodsId,
                }
                getFacPrdOrderGoodsBom(params).then(res => {
                    if (res.data.code == 0) {
                        this.editFacPreOrderBom.facPrdOrderGoodsId = facPrdOrderGoodsId
                        this.editFacPreOrderBom.styleId = res.data.data.styleId
                        this.editFacPreOrderBom.bomData = res.data.data;
                        this.editFacPreOrderBom.bomData.name = res.data.data.name
                        this.editFacPreOrderBom.bomData.commonBomId = res.data.data.commonBomId
                        this.editFacPreOrderBom.facMissionId = res.data.data.facMissionId;
                        if (this.editFacPreOrderBom.bomData.commonMaterialsSkuList) {
                            this.editFacPreOrderBom.bomData.commonMaterialsSkuList.forEach(item => {
                                item.facMissionBomId = res.data.data.id;
                            })
                        }

                        this.editFacPreOrderBom.visible = true
                    }
                })
            },
            orderProductionTableEdit(bomData, data) {
                // 统一将单件用量转成字符串
                bomData.commonMaterialsSkuList.forEach(item => {
                    item.singleDosage = item.singleDosage.toString()
                })
                let params = {
                    facPrdOrderGoodsId: this.editFacPreOrderBom.facPrdOrderGoodsId,
                    isMaterials: 1,
                    commonBom: bomData,
                    userId: this.userId,
                    alterPurchaseDemand: data.updateMaterialChecked,
                    unitId: this.unitId
                };
                if (data.updateMaterialRadio !== 'noUpdateBom') {
                    params.updateCommonBomId = data.updateMaterialRadio;
                    params.saveAsCommonBomName = data.updateMaterialInput;
                }
                this.editFacPrdOrderGoodsMaterialSku(params);
            },
            // 编辑生产订单bom
            editFacPrdOrderGoodsMaterialSku(params) {
                params.userId = JSON.parse(sessionStorage.getItem("user_login")).userId
                editFacPrdOrderGoodsMaterialSku(params).then(res => {
                    if (res.data.code === 0) {
                        this.$message({
                            message: '编辑成功',
                            type: 'success',
                        });
                        this.changeMaterialSuccess()
                    } else {
                        this.$message.error(res.data.msg);
                    }
                    this.editFacPreOrderBom.visible = false
                })
            },
            // 获取要换料的bom相关数据
            getFacMissionBom() {
                // demandSourceBillType:0:工单 1:订单
                let params = {
                    userId: this.userId,
                    facId: JSON.parse(sessionStorage.getItem("last_login")).id,
                    missionId: this.$route.query.missionId
                };
                facMissionBomEditInfo(params).then(res => {
                    this.editBom.facMissionBom = res.data.data;
                    this.editBom.facMissionId = res.data.data.facMissionId;
                    this.editBom.facMissionBom.commonMaterialsSkuList.forEach(item => {
                        item.facMissionBomId = res.data.data.id;
                    })
                });
            },
            // 获取选择标签的下拉列表
            getQueryAllBillLabel() {
                let params = {
                    keyword: "",
                    userId: this.userId
                }
                queryAllBillLabel(params).then(res => {
                    // console.log(res.data.data)
                    this.tagList = res.data.data
                })
            },
            // 标签新建成功
            addSuccess() {
                this.getQueryAllBillLabel()
            },
            // 标签选择
            selectItem(billLabelList, orderId, materialSkuId) {
                let params = {
                    orderId: orderId,
                    materialSkuId: materialSkuId,
                    unitId: this.unitId,
                    billLabelList
                }
                allocationBillLabel(params).then(res => {
                    if (res.data.code == 0) {
                        this.dataType == 1 ? this.purchaseMissionPage() : this.purchaseSupplierPage()
                    }
                })
            },
            //修改计划采购的值
            updatePurchaseDemand(row) {
                this.purchaseDemandData = {
                    sourceBillId: row.demandSourceBillId,
                    materialsSkuId: row.materialsSkuId,
                    purchaseDemand: row.planBuyQuantity,
                    materialDemand: row.materialDemand,
                };
                this.purchaseDemandNum = row.planBuyQuantity
                this.updatePurchaseDialogVisible = true

            },
            determineUpdate() {
                if (this.purchaseDemandNum < this.purchaseDemandData.materialDemand) {
                    this.$message.error('输入值不能小于物料需求值');
                    return
                } else {
                    this.purchaseDemandData.purchaseDemand = this.purchaseDemandNum;
                    updatePurchaseDemand(this.purchaseDemandData).then(res => {
                        console.log(res);
                        if (res.data.code === 0) {
                            this.$message({
                                message: '修改成功',
                                type: 'success',
                            });
                            this.dataType == 1 ? this.purchaseMissionPage() : this.purchaseSupplierPage()
                            this.updatePurchaseDialogVisible = false
                        } else {
                            this.$message.error(res.data.msg);
                            this.updatePurchaseDialogVisible = false
                        }
                    })
                }
            },
            // 图片预览
            imgList(item) {
                this.imgIndex = 0;
                this.imgLists = [];
                item.forEach($item => {
                    this.imgLists.push({path: $item})
                })
                // this.imgLists = item.commonMaterialsPictureList;
                this.centerDialogVisible = true;
            },
            sortTable(val) {
                let sort = val.order;
                console.log(val)
                // 生产单
                if (val.prop == "demandSourceBillNo") {
                    this.sortType = sort == "ascending" ? 1 : 2
                }
                // 商品款号
                if (val.prop == "styleNo") {
                    this.sortType = sort == "ascending" ? 3 : 4
                }
                // 制单日期
                if (val.prop == "placeorderAt") {
                    this.sortType = sort == "ascending" ? 5 : 6
                }
                // 货期
                if (val.prop == "deliveryAt") {
                    this.sortType = sort == "ascending" ? 7 : 8
                }
                this.purchaseMissionPage()
                return
            },
            //按生产单查看
            purchaseMissionPage() {
                if(!this.mission.fieldConfigList.length){
                    this.getFieldConfigCodeAndNameList()
                }
                let params = {
                    userId:this.userId,
                    queryColumn:this.queryColumn,
                    pageNo: this.currentPage,
                    pageSize: 20,
                    factoryId: this.facId,
                    sortType: this.sortType,
                    ...this.form
                };
                this.loading = true
                purchaseDemandList(params).then(res => {
                    this.missionTable = res.data.data.list
                    this.total = res.data.data.totalCount
                    this.loading = false
                })
            },
            //按物料查看
            purchaseSupplierPage() {
                if(!this.supplier.fieldConfigList.length){
                    this.getFieldConfigCodeAndNameList()
                }
                let params = {
                    userId:this.userId,
                    queryColumn:this.queryColumn,
                    pageNo: this.currentPage,
                    pageSize: 20,
                    factoryId: this.facId,
                    ...this.form
                };
                this.supplierLoading = true
                purchaseMaterialsPage(params).then(res => {
                    this.supplierTable = res.data.data.list;
                    this.total = res.data.data.totalCount;
                    this.supplierLoading = false
                })
            },
            handleCurrentChange(page) {
                this.currentPage = page
                if (this.dataType === 1) {
                    this.purchaseMissionPage();
                } else {
                    this.purchaseSupplierPage();
                }
            },
            // 主动占用事件
            active(row) {
                // 权限
                // if (!this.powerJudgement.permissions("fac.purchaseOrder.occupy")) {
                //     return
                // }
                // this.occupyShow = true;
                // this.tableItem = row;
                // this.occupyNum = row.stockActivePreuse


                // 生产单号-商品款号-物料分类-物料款号-物料名称-颜色-规格-供应商
                this.materialName = row.facMissionNo+'-'+row.styleNo+'-'+row.kindName+'-'+row.materialsNo+'-'+row.materialsName+'-'+row.colorName+'-'+row.specificationsNo+'-'+row.supplierName;
                this.skuId = row.materialsSkuId;
                this.materialPurchaseDemandId = row.materialPurchaseDemandId;
                this.showDialog = true;
            },
            // 按条件筛选
            filterData(val) {
                this.form = val
                if (this.dataType === 1) {
                    this.purchaseMissionPage();
                } else {
                    this.purchaseSupplierPage();
                }
            },
            changeType1() {
                this.dataType = 1;
                this.demandIds = []
                this.purchaseMissionPage();
            },
            changeType0() {
                this.dataType = 0;
                this.demandIds = []
                this.purchaseSupplierPage();
            },
            //按照工单导出
            exportExcelOnMission() {
                let params = {
                    queryColumn:this.queryColumn,
                    pageNo: this.currentPage,
                    pageSize: 20,
                    factoryId: this.facId,
                    sortType: this.sortType,
                    ...this.form
                };
                exportExcelOnMission(params).then(res => {
                    this.fileData = res.data;
                    //在这里利用则可以直接的生成作为下载用的url，但是在其他代码环境下，可能需要new一个Blob对象，例如
                    //var blob = new Blob([JSON.stringify(res.data)], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
                    let url = window.URL.createObjectURL(res.data);
                    let a = window.document.createElement('a');
                    a.setAttribute('href', url);
                    a.setAttribute('download', '按生产单查看.xls');
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                })
            },
            //按照供应商导出
            exportExcelOnSupplier() {
                let params = {
                    queryColumn:this.queryColumn,
                    pageNo: this.currentPage,
                    pageSize: 20,
                    factoryId: this.facId,
                    ...this.form
                };
                exportExcelOnSupplier(params).then(res => {
                    this.fileData = res.data;
                    //在这里利用则可以直接的生成作为下载用的url，但是在其他代码环境下，可能需要new一个Blob对象，例如
                    //var blob = new Blob([JSON.stringify(res.data)], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
                    let url = window.URL.createObjectURL(res.data);
                    let a = window.document.createElement('a');
                    a.setAttribute('href', url);
                    a.setAttribute('download', '按供应商查看.xls');
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                })
            },
            excel() {
                if (this.dataType === 1) {
                    this.exportExcelOnMission();
                } else {
                    this.exportExcelOnSupplier();
                }
            },
            // 选择项改变
            selectChange(selection) {
                this.demandIds = selection.map(item =>item.materialPurchaseDemandId)
                let tempList = selection
                tempList.forEach(item =>{
                    item.lineId = item.materialPurchaseDemandId
                })
                this.newPurchase.demandSelectedList =selection
                // console.log(this.demandIds)
            },
            // 批量标为完成
            batchSetComplete(status) {
                if (!this.demandIds.length) {
                    this.$message({
                        type: 'error',
                        message: '请先勾选采购需求'
                    });
                    return
                }
                this.$confirm('确认将勾选的物料需求均'+(status==2?'标为完成?':'撤销完成?'), status==2?'批量完成':'批量撤销完成', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let params = {
                        materialPurchaseDemandIds: this.demandIds,
                        status: status
                    }
                    this.isSubmitting = true
                    batchUpdatePurchaseDemandStatus(params).then(res => {
                        this.isSubmitting = false
                        if (res.data.code == 0) {
                            this.$message({
                                type: 'success',
                                message: '操作成功'
                            });
                            this.dataType == 1 ? this.purchaseMissionPage() : this.purchaseSupplierPage()
                            // 去除选中的复选框
                            this.cancelAllCheckbox()
                        }
                    })

                }).catch(() => {
                });
            },
            // 取消列表复选框的选中状态
            cancelAllCheckbox() {
                if (this.dataType == 1) {
                    this.$refs.purchaseNeedMissionTable.clearSelection();
                } else {
                    this.$refs.purchaseNeedSupplierTable.clearSelection();
                }
            },
            tableRowClassName(row, index) {
                let classNames = []
                if (row.purchaseStatus == 2) {
                    classNames.push('green')
                }
                if (row.inverseDemand) {
                    classNames.push('orange')
                }
                if(row.isStripe){
                    classNames.push('gray-bg')
                }

                return classNames.join(' ')
            },


        },
        created() {
            this.allocationPurchaser.btnVisible = this.powerJudgement.hasPermission("fac.purchaseOrder.allocationPurchaser")
            // 标签权限问题
            let powerlist = JSON.parse(sessionStorage.getItem("user_login")).permissionList;
            if (powerlist.indexOf('fac.defectiveLabel.queryAllDefectiveLabel') == -1) {
                this.isTagShow = false
            }
            this.getQueryAllBillLabel()
            this.purchaseConfig()
        },
    }
</script>
<style lang="scss" scoped>

    .goods-list-popover {
        ul li {
            line-height: 36px;
            padding: 0 10px;
            &:hover {
                background: rgb(228, 230, 241);
            }
        }
    }

    .purchase-need .new-bom {
        z-index: 2005;
    }

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

    .purchase-need {
        min-width:1055px ;
        .finish-tip {
            display: inline-block;
            vertical-align: middle;
            line-height: 24px;
            margin-right: 8px;
            font-size: 12px;
            padding: 0 10px 0 0;
            height: 24px;
            color: #23C811;
            border-radius: 2px 0 0 2px;
            background: #c4f7bf;
            .green-block {
                float: left;
                margin-right: 5px;
                background: #23C811;
                width: 24px;
                height: 24px;
                border-radius: 0 2px 2px 0;
            }
        }
        .custom-tab-bar {
            background: #fff;
        }
        .filter-block {
            display: inline-block;
            font-size: 12px;
            padding-right: 8px;
            border-right: 1px solid #DFE6EC;
        }
        .text-center {
            width: 300px;
            margin: 0 auto;
            span {
                line-height: 36px;
            }
        }

    }
</style>
<style lang="scss">
    .purchase-need {
        .orange .cell{color: #ff9c38}
        .green .cell{color: #23C811}

        .allocation-purchaser-dialog .el-dialog--tiny{
            width: 365px;
        }

        .gray-bg{
            background: #F7F9FC;
        }
        .el-table__body-wrapper .yellow-bg {
            background: #FFF9ED !important;
        }
    }
    .goods-list-popover {
        padding: 10px 0;
    }

</style>



