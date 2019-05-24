<template>
    <section class="documentReview scroll-content" v-loading="loading">
        <div class="documentReview_head">
            <page-title title="审核工作台">
                <nf-button type="warning" style="float: right;" @click="auditConfigurationGo">审核配置</nf-button>
                <nf-button type="warning" style="float: right; margin-right: 8px;" @click="approvalRecordGo()">历史审批记录</nf-button>
                <!-- <nf-button v-if="billType=='FAC_PRD_ORDER'" type="warning" style="float: right;margin-right: 8px;" @click="$router.push('/orderProduction')">查看全部单据</nf-button> -->
            </page-title>
        </div>
        <div class="documentReview_body main-content">
            <div class="documentReview_body_lt">
                <div>
                    <icon class="icon-workbench" type="icon-workbench" style="margin-right: 6px;"></icon>
                    单据类型
                </div>
                <div style="cursor: pointer"
                     @click="billTypeChange(index,item)"
                     :class="['active_title',{'is-active':tabIndex==index}]"
                     v-for="(item,index) in titleData"
                     :key="index">
                    <span>{{item.billTypeName}}</span>
                    <span class="documentReview_title_num" v-if="item.taskCount">{{item.taskCount}}</span>
                </div>
            </div>
            <div class="documentReview_body_rg">
                <div v-if="['OUTSIDE_FACTORY','COMMON_BOM','COMMON_MATERIALS','FAC_PRD_ORDER'].indexOf(billType)===-1&&this.titleData.length>0 " class="documentReview_filter">
                    <el-form
                            label-width="80px"
                            :inline="true"
                            :model="filterFormData"
                            class="filter-form">
                        <el-row
                            type="flex"
                            class="filter-form__row"
                            style="flex-wrap: wrap"
                            >
                            <el-form-item class="filter-form__item" label="商品档案" v-if="billType===('FAC_PRD_ORDER')" >
                                <rich-filter v-model="richFilterParams"
                                             @filter="submit"
                                             dialogType='STYLE'
                                             placeholder="点击可筛选商品"
                                             modelName="FAC_PRD_ORDER"></rich-filter>
                                <!--<goods-select v-model="filterFormData.goodsUnitIdList" :multiple="true"></goods-select>-->
                            </el-form-item>
                            <el-form-item class="filter-form__item" label="加工厂商" v-if="billType===('FAC_PRD_ORDER')">
                                <machining-select multiple v-model="filterFormData.outsideFactoryIdList"></machining-select>
                            </el-form-item>
                            <!--<el-form-item class="filter-form__item" label="厂商货号" v-if="billType===('FAC_PRD_ORDER')">-->
                                <!--<el-select-->
                                        <!--v-model="filterFormData.styleIdList"-->
                                        <!--filterable-->
                                        <!--multiple-->
                                        <!--clearable-->
                                        <!--placeholder="全部">-->
                                    <!--<el-option v-for="item in options.styleIdList" :key="item.styleId" :label="item.plantArticleNumber"-->
                                            <!--:value="item.styleId">-->
                                    <!--</el-option>-->
                                <!--</el-select>-->
                            <!--</el-form-item>-->
                            <el-form-item class="filter-form__item" label="客户" v-if="billType===('FAC_PRD_ORDER')">
                                <el-select
                                        v-model="filterFormData.commonCustomerIdList"
                                        filterable
                                        multiple
                                        clearable
                                        placeholder="全部">
                                    <el-option v-for="item in options.customerList" :key="item.id" :label="item.name"
                                            :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item class="filter-form__item" label="创建人" v-if="billType===('FAC_PRD_ORDER')">
                                <el-select multiple clearable :filter-method="getCreateLists" filterable v-model="filterFormData.createByIdsList" placeholder="请选择">
                                    <el-option
                                            v-for="item in options.createLists"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-row>
                        <el-row
                            type="flex"
                            class="filter-form__row"
                            style="flex-wrap: wrap"
                        >
                            <el-form-item class="filter-form__item" label="单据时间">
                                <el-date-picker
                                        style="width: auto"
                                        @change="orderDateChange"
                                        v-model="filterFormData.orderDateRange"
                                        type="daterange"
                                        placeholder="请选择">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item class="filter-form__item" label="交货日期" v-if="billType===('FAC_PRD_ORDER')">
                                <el-date-picker
                                        style="width: auto"
                                        @change="deliveryDateChange"
                                        v-model="filterFormData.deliveryDateRange"
                                        type="daterange"
                                        placeholder="选择交货日期">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item class="filter-form__item" label="单据号">
                                <el-select
                                        v-if="['STOCK_DELIVERY','STOCK_ADJUST'].indexOf(billType)==-1"
                                        v-model="filterFormData.billNos"
                                        filterable
                                        multiple
                                        clearable
                                        :remote="true"
                                        :remote-method="billNoRemoteMethod"
                                        placeholder="全部">
                                    <el-option v-for="item in options.billNos" :key="item.value" :label="item.name"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                                <stockNoSelect v-else multiple :storehouseId="filterFormData.storehouseId" v-model="filterFormData.billIds"></stockNoSelect>
                            </el-form-item>
                            <el-form-item class="filter-form__item" label="款号" v-if="['FAC_MISSION_ADJUST','FAC_MISSION_COMPLETE','FAC_MISSION_DEFECTIVE','FAC_MISSION_WASTE'].indexOf(billType)>-1">
                                <el-input placeholder="请搜索" v-model="filterFormData.styleKey"></el-input>
                            </el-form-item>
                            <el-form-item class="filter-form__item" label="工单号" v-if="['FAC_MISSION_ADJUST','FAC_MISSION_COMPLETE','FAC_MISSION_DEFECTIVE','FAC_MISSION_WASTE'].indexOf(billType)>-1">
                                <el-select   v-model="filterFormData.missionIds"
                                            filterable
                                            multiple
                                            clearable
                                            :remote="true"
                                           :remote-method="orderRemoteMethod"
                                           placeholder="请选择">
                                    <el-option
                                            v-for="item in orderList"
                                            :key="item.value"
                                            :label="item.name"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item class="filter-form__item" label="外发厂" v-if="['FAC_MISSION_ADJUST','FAC_MISSION_COMPLETE','FAC_MISSION_DEFECTIVE','FAC_MISSION_WASTE'].indexOf(billType)>-1">
                                <!--<outside-supplier-select :multiple="true" ref="OutsideFactoryId" @getSupplierId="getOutsideFactoryId"></outside-supplier-select>-->
                                <el-select   v-model="filterFormData.outsideFactoryIdList"
                                             filterable
                                             multiple
                                             clearable
                                             :remote="true"
                                             :remote-method="outsideFactoryRemoteMethod"
                                             placeholder="请选择">
                                    <el-option
                                            v-for="item in outsideFactoryList"
                                            :key="item.value"
                                            :label="item.name"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                                <!--<machining-select multiple :showSelfFac="true" v-model="filterFormData.outsideFactoryIdList"></machining-select>-->
                            </el-form-item>
                            <el-form-item class="filter-form__item" label="业务员" v-if="['FAC_MISSION_ADJUST','FAC_MISSION_COMPLETE','FAC_MISSION_DEFECTIVE','FAC_MISSION_WASTE'].indexOf(billType)>-1">
                                <workerLeader v-model="filterFormData.counterManIds"
                                              :placeholder="'请选择或搜索'"></workerLeader>
                            </el-form-item>
                            <el-form-item v-if="['STOCK_DELIVERY','STOCK_ADJUST'].indexOf(billType)>-1" class="filter-form__item" label="仓库">
                                <el-select v-model="filterFormData.storehouseId" placeholder="请选择">
                                    <el-option
                                            v-for="item in storehouseList"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item class="filter-form__item" label="下单类型" v-if="billType===('FAC_PRD_ORDER')">
                                <el-select
                                        v-model="filterFormData.placeOrderTypeList"
                                        filterable
                                        multiple
                                        clearable
                                        placeholder="全部">
                                    <el-option v-for="item in options.placeOrderTypeList" :key="item.attrId" :label="item.attrVal"
                                            :value="item.attrId">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-row>
                        <el-row
                            type="flex"
                            class="filter-form__row"
                            >
                            <el-form-item class="filter-form__item el-select" label="采购单号" v-if="billType===('FAC_PRD_ORDER')">
                                <el-input placeholder="搜索采购单号" v-model="filterFormData.buyNo"></el-input>
                            </el-form-item>

                            <!--<el-form-item label="商品属性" class="filter-form__item" v-if="billType===('FAC_PRD_ORDER')">-->
                                <!--<goods-attr-dialog class="goods-attr" @confirm="getAllAttrId" :isShowdevelop="true" :isReset="isReset"></goods-attr-dialog>-->
                            <!--</el-form-item>-->

                        </el-row>

                        <div class="btn-group">
                            <el-button class="btn btn-reset" @click="reset">重置</el-button>
                            <el-button class="btn btn-submit" @click="currentPage=1;getDataList()">筛选</el-button>
                        </div>
                    </el-form>

                </div>
                <!--商品bom-->
                <div v-if="billType === 'COMMON_BOM'" class="documentReview_filter">
                    <el-form
                            label-width="80px"
                            :inline="true"
                            class="filter-form">
                        <el-form-item class="filter-form__item" label="操作时间" style="width: 450px;">
                            <el-date-picker
                                    @change="orderDateChange"
                                    v-model="orderDateRange"
                                    type="datetimerange"
                                    placeholder="请选择">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item class="filter-form__item" label="商品款号" style="width: 300px;">
                            <goods-select v-model="filterFormData.styleIds" :multiple="true"></goods-select>
                        </el-form-item>
                        <div class="btn-group">
                            <el-button class="btn btn-reset" @click="bomFiltreReset">重置</el-button>
                            <el-button class="btn btn-submit" @click="currentPage=1;getDataList()">筛选</el-button>
                        </div>
                    </el-form>
                </div>
                <!--物料档案-->
                <div v-if="billType === 'COMMON_MATERIALS'" class="documentReview_filter">
                    <el-form
                            label-width="80px"
                            :inline="true"
                            class="filter-form">
                        <el-form-item class="filter-form__item" label="提报时间" style="width: 450px;">
                            <el-date-picker
                                    @change=""
                                    v-model="materialFilter.time"
                                    type="datetimerange"
                                    placeholder="请选择">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item class="filter-form__item" label="提报人" style="width: 450px;">
                            <workerLeader v-model="materialFilter.submiterIds"
                                          placeholder="请选择"></workerLeader>
                        </el-form-item>
                        <el-form-item class="filter-form__item" label="物料筛选" style="width: 300px;">
                            <materialSelect v-model="materialFilter.commonMaterialsIds" :multiple="true" :type="'searchMaterialStyleNoScreen'">
                            </materialSelect>
                        </el-form-item>
                        <div class="btn-group">
                            <el-button class="btn btn-reset" @click="materialReset">重置</el-button>
                            <el-button class="btn btn-submit" @click="currentPage=1;getDataList()">筛选</el-button>
                        </div>
                    </el-form>
                </div>

                <outside-filter v-if="billType === 'OUTSIDE_FACTORY'" :isDocumentReview="true"
                                v-model="outsideFilterData" @reset="outsideFilterReset"
                                @filterData="currentPage=1;getDataList()"></outside-filter>
                <div v-if="billType === 'FAC_PRD_ORDER'" class="documentReview_filter" style="display: flex;justify-content: flex-end;padding: 8px">
                    <el-input v-model="keyWord" @input="handleSearch" style="width: 200px;margin-right: 10px;font-size: 12px;" placeholder="输入订单号/款号搜索"></el-input>
                    <div style="display: flex;align-items: center;">
                        <span style="margin-right: 5px;">筛选:</span>
                        <order-filter @submit="handleOrderFilter"></order-filter>
                    </div>
                </div>
                <div class="documentReview_content">
                    <!--<div class="orderProduction-table">-->
                        <component
                                :is="billTypeComponentId"
                                :billType="billType"
                                :facPrdOrderList="facPrdOrderList"
                                @goDetail="goDetail"
                                @taskPass="taskPass"
                                @getNewData="getBillReviewConfigBillType"
                                @taskUnPassDialogGo="taskUnPassDialogGo">
                        </component>

                        <!--<stock-table v-if="tabIndex==1" @unpass="id => taskUnPassDialogGo(id)"></stock-table>-->
                    <!--</div>-->

                </div>
            </div>
        </div>
        <el-row class="return-list__pagination" style="padding: 8px 24px;" type="flex" justify="end">
            <el-pagination
                    @current-change="handleCurrentChange"
                    :current-page.sync="currentPage"
                    :page-size="20"
                    layout="total, prev, pager, next"
                    :total="totalCount">
            </el-pagination>
        </el-row>
        <!--审核配置-->
        <el-dialog
                class="custom-dialog documentReview_dialog"
                title="审核配置"
                :visible.sync="auditConfiguration">
            <el-table
                    border
                    align="center"
                    :data="tableData"
                    style="width: 100%">
                <el-table-column
                        label="单据类型"
                        width="180">
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.billType" @visible-change="disabledSel" placeholder="请选择">
                            <!--:disabled="disabledSel(item.billType)"-->
                            <el-option
                                    :disabled="item.isDisabled"
                                    v-for="item in options.documentType"
                                    :key="item.billType"
                                    :label="item.billTypeName"
                                    :value="item.billType">
                            </el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column
                        label="审核人"
                        width="180">
                    <template slot-scope="scope">
                        <workerLeader v-model="scope.row.normalReviewer" placeholder="搜索选择"></workerLeader>
                    </template>
                </el-table-column>
                <el-table-column
                        label="反审批准人"
                        width="180">
                    <template slot-scope="scope">
                        <workerLeader single="single" v-model="scope.row.antiReviewer"
                                      placeholder="搜索选择"></workerLeader>

                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <span @click="tableDataDel(scope.row,scope.$index)" style="cursor: pointer">删除</span>
                    </template>
                </el-table-column>
            </el-table>
            <p class="dialogDataAdd" @click="dialogDataAddGo">+ 添加</p>
            <div slot="footer" class="dialog-footer">
                <el-button @click="auditConfiguration = false">取 消</el-button>
                <el-button type="primary" @click="confirm">确定</el-button>
            </div>
        </el-dialog>
        <!--驳回弹窗-->
        <el-dialog :title="rejectText+'单据'" class="custom-dialog unpass-dialog" :visible.sync="taskUnPassDialog">
            <div style="display: flex;">
                <p style="white-space: nowrap">{{rejectText}}原因：</p>
                <el-input type="textarea" rows="6" v-model="applyAntiReviewDesc" placeholder="请输入原因"></el-input>
            </div>
            <div slot="footer" class="dialog-footer">
                <nf-button @click="taskUnPassDialog = false">取消</nf-button>
                <nf-button type="warning" @click="taskUnPassSure" :loading="isloadingApply">确定</nf-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import outsideTable from '../outsideFactory/table'
    import stockNoSelect from '@/components/Common/custom-select/stockNoSelect.vue'
    import outsideFilter from '@/components/outsideFactory/outside-filter'
    import {
        bomTaskReview,
        outsideFactoryTask,
        getBomTaskList,
        checkDelete,
        placeOrderTypeList,
        stockBillReview,
        getSelfWorkList,
        selectFacCustomer,
        queryGoodsStyleByPlantArticleNumber,
        getStorehousesByUserId,
        stockBillTask,
        facPrdOrderList,
        facTaskOrderPage,
        orderAdjustmentPage,
        billReviewConfig,
        billReviewConfigUpdate,
        billReviewConfigStatus,
        billReviewConfigBillType,
        adjustPrdOrderReview,
        outsideFactoryReview,
        materialsTask,
        materialsReview,
        getOrderNo,
        getBillDetails,
        commonFilterRemoteSearch,
        commonFilterRemoteSearchForReview,
        billReportReview
    } from '@/api'
    import stockTable from './stockTable'
    import orderTable from './components/orderTable'
    import orderBillTable from './components/orderBillTable'
    import goodsBoomReview from './components/goodsBoomReview'
    import materialTable from './components/materialTable'
    import Utils from '@/utils/format'
    import orderFilter from './components/orderFilter'

    export default {
        name: "index",
        components: {
            outsideTable,
            outsideFilter,
            stockTable,
            orderBillTable,
            orderTable,
            goodsBoomReview,
            stockNoSelect,
            materialTable,
            orderFilter
        },
        data() {
            return {
                keyWord: '',
                materialFilter: {
                    time: [new Date(new Date().getFullYear(), new Date().getMonth(), 1), new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(),23, 59,59)],
                    submiterIds: [],
                    commonMaterialsIds: [],
                },
                bomOrderDateRange:'',
                bomDateStart:'',
                bomDateEnd:'',
                bomFilterStyleIds:[],
                // isReset:false,
                stockRow: {},
                storehouseList: [],
                dataLoading: false,
                billType: '',
                billTypeComponentId: '',
                titleData: [],
                tableData: [
                    {
                        billType: '',
                        normalReviewer: [],
                        antiReviewer: ''
                    }
                ],
                taskUnPassDialogId:'',
                applyAntiReviewDesc:'',
                isloadingApply:false,
                taskUnPassDialog:false,
                auditConfiguration:false,
                facPrdOrderList:[],
                currentPage:1,
                // orderDateRange: '',
                outsideFilterData: {
                    factoryRateIds: [],
                    brandIds: [],
                    statuses: [0]
                },
                richFilterParams:{},
                filterFormData: {
                    styleIds:[],
                    // goodsUnitIdList:[],
                    outsideFactoryIdList:[],
                    styleIdList:[],
                    commonCustomerIdList:[],
                    placeOrderTypeList:[],
                    buyNo:'',
                    createByIdsList:[],
                    dateStart: '',
                    dateEnd: '',
                    billNos: [],
                    billIds: [],
                    storehouseId: '',
                    deliveryDateRange:'',//交货时间
                    orderDateRange:'',//制单日期
                    styleKey: '',
                    missionIds: [],
                    counterManIds: []
                },
                options: {
                    facPrdOrderIdList: [],
                    documentType: [],
                    styleIdList:[],
                    customerList:[],
                    placeOrderTypeList:[],
                    createLists:[],
                    billNos:[],//存储待筛选的单据号
                },
                tabIndex: 0,
                orderList: [],  // 工单号下拉
                totalCount: 0,
                outsideFactoryList:[],//外发厂下拉
            }
        },
        watch: {
            taskUnPassDialog(v) {
                if (!v) {
                    this.applyAntiReviewDesc = ''
                }
            },
            'billType'(val) {
                if (val === 'FAC_PRD_ORDER' || val === 'FAC_PRD_ORDER_ADJUST') {
                    //生产订单
                    this.billTypeComponentId = 'orderTable'
                }
                //工单调整单，工单完成单，工单次品单，工单废品单
                else if (val === 'FAC_MISSION_ADJUST' || val === 'FAC_MISSION_COMPLETE' || val === 'FAC_MISSION_DEFECTIVE' || val === 'FAC_MISSION_WASTE') {
                    this.billTypeComponentId = 'orderBillTable'
                } else if (val === 'STOCK_DELIVERY' || val === 'STOCK_ADJUST') {
                    //STOCK_ADJUST
                    this.billTypeComponentId = 'stockTable'
                } else if (val === 'OUTSIDE_FACTORY') {
                    this.billTypeComponentId = 'outsideTable'
                }else if (val === 'COMMON_BOM') {
                    this.billTypeComponentId = 'goodsBoomReview'
                }else if (val === 'COMMON_MATERIALS') {
                    this.billTypeComponentId = 'materialTable'
                }
            }
        },

        computed: {
            facId() {
                return JSON.parse(sessionStorage.getItem('user_login')).unitId;
            },
            userId() {
                return JSON.parse(sessionStorage.getItem('user_login')).userId;
            },
            unitId() {
                return JSON.parse(sessionStorage.getItem('last_login')).id
            },
            user_info(){
                return JSON.parse(sessionStorage.getItem('user_info'));
            }
        },
        created() {
            this.getBillReviewConfig();
            this.getQueryGoodsStyle();
            this.getFacPrdOrderList();
            this.getStorehousesList();
            this.fetchCustomerList();
            this.getCreateLists();
            this.getPlaceOrderTypeList();
            this.orderRemoteMethod(''); //工单号下拉
            this.outsideFactoryRemoteMethod('');//外发厂下拉
        },
        methods: {
            handleCurrentChange(page) {
                this.currentPage = page
                this.getDataList()
            },
            handleSearch(v) {
                this.getDataList()
            },
            handleOrderFilter(form) {
                this.filterFormData = form
                this.getDataList()
            },
            //单据号远程搜索
            billNoRemoteMethod(value){
                if(!['STOCK_DELIVERY','STOCK_ADJUST'].includes(this.billType)) {
                    let params = {
                        unitId:this.unitId,
                        key:value,
                        userId:this.userId,
                        billType:this.billType
                    }
                    commonFilterRemoteSearchForReview(params).then(res =>{
                        console.log(res,6655)
                        this.options.billNos = res.data.data
                    })
                }

            },
            //工单号远程搜索
            orderRemoteMethod(value){
                let params = {
                    unitId:this.unitId,
                    key:value,
                    userId:this.userId,
                    remoteFilterType:'FAC_MISSION_NO',
                }
                commonFilterRemoteSearch(params).then(res =>{
                    // 将选中的option和搜索到的合并到一起
                    if(res.data.code ==0){
                        this.orderList = res.data.data
                    }
                })
            },
            //外发厂远程搜索
            outsideFactoryRemoteMethod(value){
                let params = {
                    unitId:this.unitId,
                    key:value,
                    userId:this.userId,
                    remoteFilterType:'OUTSIDE_FACTORY',
                }
                commonFilterRemoteSearch(params).then(res =>{
                    // 将选中的option和搜索到的合并到一起
                    if(res.data.code ==0){
                        this.outsideFactoryList = res.data.data
                        this.outsideFactoryList.unshift({
                            name:'本厂',
                            value:'thisfactory'
                        })
                    }
                })
            },
            getMaterialList() {
                const params = {
                    ...this.materialFilter,
                    unitId: this.unitId,
                    userId: this.userId,
                    pageNo: this.currentPage,
                    pageSize: 20,
                    billType: 'COMMON_MATERIALS',
                    dateStart: this.materialFilter.time&&this.materialFilter.time[0]?Utils.formatDate(this.materialFilter.time[0],'yyyy-MM-dd hh:mm:ss'):'',
                    dateEnd: this.materialFilter.time&&this.materialFilter.time[1]?Utils.formatDate(this.materialFilter.time[1],'yyyy-MM-dd hh:mm:ss'):'',
                }
                materialsTask(params).then(res => {
                    this.loading = false;
                    this.facPrdOrderList = res.data.data.list
                    this.totalCount = res.data.data.totalCount
                })
            },
            materialReset() {
                this.materialFilter = {
                    time: [new Date(new Date().getFullYear(), new Date().getMonth(), 1), new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(),23, 59,59)],
                    submiterIds: [],
                    commonMaterialsIds: [],
                }
            },
            //bom重置
            bomFiltreReset(){
                this.orderDateRange = '';
                this.bomOrderDateRange = '';
                this.filterFormData.styleIds =[]
            },
            outsideFilterReset() {
                this.outsideFilterData.factoryRateIds = [];
                this.outsideFilterData.brandIds = [];
                this.outsideFilterData.statuses = [0];
            },
            getStorehousesList() {
                getStorehousesByUserId({facId: this.unitId, userId: this.userId,kind: 1}).then(res => {
                    this.storehouseList = res.data.data
                    let item = this.storehouseList.find(i => i.defaultStorehouseTag === 1)
                    if (item) {
                        this.filterFormData.storehouseId = item.id
                    } else {
                        this.filterFormData.storehouseId = this.storehouseList[0].id
                    }
                })
            },
            billTypeChange(index, item) {
                if (this.billType === item.billType) return;
                this.tabIndex = index;
                this.billType = item.billType;
                this.getDataList()
                this.billNoRemoteMethod('')
            },
            getBillReviewConfigBillType() {
                let params = {
                    userId: this.userId,
                    unitId: this.unitId,
                };
                billReviewConfigBillType(params).then(res => {
                    if (res.data.code === 0) {
                        // let selConfig = this.tableData.map(item => item.billType);
                        // this.titleData = res.data.data.filter(item => selConfig.indexOf(item.billType) > -1);
                        this.titleData = res.data.data;
                        if (this.titleData.length && !this.billType) {
                            this.billType = this.titleData[0].billType
                        } else {
                            const index = this.titleData.findIndex(v => v.billType == this.billType)
                            if (index > -1) {
                                // billType对应的单据类型还存在
                                this.tabIndex = index
                            } else {
                                // billType对应的单据类型已被删除
                                this.tabIndex = 0
                                this.billType = this.titleData.length ? this.titleData[0].billType : ''
                            }
                        }
                        //首次进入页面的时候就请求方法
                        this.getDataList();
                        this.billNoRemoteMethod('')
                    } else {
                        this.$message.error(res.data.msg)
                    }
                })
            },
            // 选取交货日期
            deliveryDateChange(val) {
                const [start, end] = this.filterDate(val);
                this.filterFormData.deliveryStartAt = start;
                this.filterFormData.deliveryEndAt = end;
            },

            getDataList() {
                // 获取审核台列表数据
                let obj = {
                    unitId:this.unitId,
                    userId: this.userId,
                    "pageNo": this.currentPage,
                    "pageSize": 20,
                    billType: this.billType,
                    ...this.filterFormData
                };
                // this.loading = true
                if (this.billType === 'FAC_PRD_ORDER' || this.billType === 'FAC_PRD_ORDER_ADJUST') {
                    if(this.billType === 'FAC_PRD_ORDER_ADJUST') {
                        obj = {
                            ...this.richFilterParams,
                            ...obj
                        }
                    }else {
                        obj.keyWord = this.keyWord;
                    }
                    facTaskOrderPage(obj).then(res => {
                        this.loading = false;
                        this.facPrdOrderList = res.data.data
                        this.totalCount = res.data.data.totalCount
                    })
                } else if (this.billType === 'FAC_MISSION_ADJUST' || this.billType === 'FAC_MISSION_COMPLETE' || this.billType === 'FAC_MISSION_DEFECTIVE' || this.billType === 'FAC_MISSION_WASTE') {
                    orderAdjustmentPage(obj).then(res => {
                        this.loading = false;
                        this.facPrdOrderList = res.data.data.list
                        this.totalCount = res.data.data.totalCount
                    })
                } else if (this.billType === 'COMMON_MATERIALS') {
                    this.getMaterialList()
                }else if (this.billType == 'COMMON_BOM') {
                    //商品bom
                    getBomTaskList(obj).then(res => {
                        this.loading = false;
                        this.facPrdOrderList = res.data.data.list
                        this.totalCount = res.data.data.totalCount
                    })
                } else if (['STOCK_DELIVERY', 'STOCK_ADJUST'].indexOf(this.billType) > -1) {
                    stockBillTask(obj).then(res => {
                        this.loading = false;
                        this.facPrdOrderList = res.data.data.list || []
                        this.totalCount = res.data.data.totalCount
                    })
                } else if (['OUTSIDE_FACTORY'].indexOf(this.billType) > -1) {
                    //statuses为[0,1]的时候表示全选，此时不用传参
                    obj = {...obj, ...this.outsideFilterData}
                    if (this.outsideFilterData.statuses.length === 1) {
                        obj.stopuse = this.outsideFilterData.statuses[0];
                    }
                    outsideFactoryTask(obj).then(res => {
                        this.loading = false;
                        if (res.data.code === 0) {
                            this.totalCount = res.data.data.totalCount
                            let data = res.data.data.list;
                            data.forEach(item => {
                                //封装品牌的显示格式
                                let brandArr = [];
                                item.attrIds.forEach(v => {
                                    brandArr.push(v.name);
                                });
                                item.attrName = brandArr.join(',');
                                //封装厂商评级
                                let f_name = [];
                                item.factoryRateName = '';
                                if (item.factoryRateIds != null) {
                                    item.factoryRateIds.forEach(vs => {
                                        f_name.push(vs.name);
                                    });
                                    item.factoryRateName = f_name.join(',');
                                }
                                //封装停用状态
                                if (item.stopuse) {
                                    item.statuses = '已停用'
                                } else {
                                    item.statuses = '未停用'
                                }
                            });

                            this.facPrdOrderList = data;
                        }
                    })
                }
                else {
                    this.loading = false
                }

            },
            getBillReviewConfig() {
                billReviewConfig({unitId: this.facId}).then(res => {
                    this.options.documentType = res.data.data.billTypes;
                    this.options.documentType = res.data.data.billTypes.filter(item => item.type === 0);
                    this.tableData = res.data.data.configs;
                    this.tableData.forEach(item => {
                        item.antiReviewer = item.antiReviewer[0]
                    })
                    this.getBillReviewConfigBillType()

                })
            },
            // 重置
            reset(){
                this.richFilterParams = {}
                // this.isReset = true;
                // this.orderDateRange = ''
                Object.keys(this.filterFormData).forEach(key => {
                    const isArr = Array.isArray(this.filterFormData[key]);
                    //仓库不能重置
                    if(key=='storehouseId') return
                    if (isArr) {
                        this.filterFormData[key] = [];
                    }
                    else {
                        this.filterFormData[key] = '';
                    }
                });
                this.filterFormData = {
                    ...this.filterFormData,
                    dateStart: '',
                    dateEnd: '',
                    billNos: [],
                    billIds: [],
                };
                //当点击重置按钮的时候刷新页面
                this.getDataList();
            },
            dialogDataAddGo() {
                let obj = {
                    billType: '',
                    normalReviewer: [],
                    antiReviewer: ''
                };
                this.tableData.push(obj)
            },
            tableDataDel(data,index) {
                if (data.billType!='') {
                    let params = {
                        unitId:this.facId,
                        billType:data.billType
                    };
                    checkDelete(params).then(res =>{
                        if (res.data.code==0) {
                            this.tableData.splice(index, 1)
                        }
                        else{
                            this.$message.error(res.data.msg);
                        }
                    })
                }else{
                    this.tableData.splice(index, 1)
                }


            },
            disabledSel(val) {
                if (val) {
                    let billTypeArr = [];
                    this.tableData.forEach(item => {
                        billTypeArr.push(item.billType)

                    });
                    this.options.documentType.forEach($item => {
                        if (billTypeArr.indexOf($item.billType) >= 0) {

                            this.$set($item, 'isDisabled', true)
                        } else {
                            this.$set($item, 'isDisabled', false)
                        }
                    })

                }


            },
            //审核配置
            auditConfigurationGo() {
                this.auditConfiguration = true
                this.getBillReviewConfig()
            },
            // 跳转到历史审批记录
            approvalRecordGo() {
                this.$router.push('/documentReview/appendagePage/approvalRecord');
            },
            confirm() {
                let flag = true
                this.tableData.forEach(item => {
                    item.antiReviewer = new Array(item.antiReviewer)
                    if (!item.billType) {
                        flag = false
                        this.$message.error('单据类型不能为空')
                        this.tableData.forEach(item => {
                            item.antiReviewer = item.antiReviewer[0]
                        })
                    }
                })

                let obj = {
                    unitId: this.facId,
                    configs: this.tableData
                }
                if (!flag) return;
                billReviewConfigUpdate(obj).then(res => {
                    if (res.data.code === 0) {
                        this.$message.success('更新成功')
                        this.auditConfiguration = false
                        this.getBillReviewConfig()
                    } else {
                        this.tableData.forEach(item => {
                            item.antiReviewer = item.antiReviewer[0]
                        })
                        this.$message.error(res.data.msg)

                    }

                })
            },
            // 选取创建日期
            orderDateChange(val) {
                const [start, end] = this.filterDate(val);
                this.filterFormData.dateStart = start;
                this.filterFormData.dateEnd = end;
            },
            filterDate(val) {
                return val.split(/\s-\s/g);
            },
            // 获取生产订单号
            getFacPrdOrderList() {

                facPrdOrderList({"unitId": this.facId}).then(res => {
                    this.options.facPrdOrderIdList = res.data.facPrdOrderList;
                })

            },

            //通过
            taskPass(taskId, type, row) {
                this.$set(row, 'btnLoading', true)
                let obj = {
                    taskId,
                    message: '',
                    result: type,
                    userId: this.userId
                }
                let api
                if (this.billType == 'FAC_PRD_ORDER') {
                    api = billReviewConfigStatus
                } else if (this.billType == 'FAC_PRD_ORDER_ADJUST') {
                    api = adjustPrdOrderReview
                } else if (['STOCK_DELIVERY', 'STOCK_ADJUST'].indexOf(this.billType) > -1) {
                    api = stockBillReview
                    obj.id = row.id
                    obj.stockBillType = row.operateTypeText == '调整' ? 'STOCK_ADJUST' : 'STOCK_DELIVERY'
                } else if (this.billType == 'OUTSIDE_FACTORY') {
                    api = outsideFactoryReview
                    obj.id = row.id,
                    obj.unitId = this.unitId;
                }else if (this.billType == 'COMMON_BOM') {
                    api = bomTaskReview;
                    obj.id = row.id;
                    obj.unitId = this.unitId;
                }else if (this.billType == 'COMMON_MATERIALS') {
                    api = materialsReview;
                    obj.id = row.commonMaterialsId;
                    obj.unitId = this.unitId;
                }
                api(obj).then(res => {
                    this.$set(row, 'btnLoading', false)
                    if (res.data.code === 0) {
                        this.getBillReviewConfigBillType()
                        this.$message.success('操作成功')
                    } else {
                        this.$message.error(res.data.msg)
                    }

                })
            },
            //驳回
            taskUnPassDialogGo(taskId, row, type) {
                this.rejectText = type==2?'拒绝反审':'驳回';
                this.taskUnPassDialog = true;
                this.taskUnPassDialogId = taskId
                if (['STOCK_DELIVERY', 'STOCK_ADJUST', 'OUTSIDE_FACTORY','COMMON_BOM','COMMON_MATERIALS'].indexOf(this.billType) > -1) {
                    this.stockRow = row
                }
            },
            taskUnPassSure() {
                let obj = {
                    taskId: this.taskUnPassDialogId,
                    message: this.applyAntiReviewDesc,
                    result: false,
                    userId: this.userId
                }
                let api
                if (this.billType == 'FAC_PRD_ORDER_ADJUST') {
                    api = adjustPrdOrderReview
                } else if (['STOCK_DELIVERY', 'STOCK_ADJUST'].indexOf(this.billType) > -1) {
                    api = stockBillReview
                    obj.id = this.stockRow.id
                    obj.stockBillType = this.stockRow.operateTypeText == '调整' ? 'STOCK_ADJUST' : 'STOCK_DELIVERY'
                } else if (this.billType == 'OUTSIDE_FACTORY') {
                    api = outsideFactoryReview
                    obj.id = this.stockRow.id,
                    obj.unitId = this.unitId;
                }else if (this.billType == 'COMMON_BOM') {
                    api = bomTaskReview;
                    obj.id = this.stockRow.id;
                    obj.unitId = this.unitId;
                }else if (this.billType == 'COMMON_MATERIALS') {
                    api = materialsReview;
                    obj.id = this.stockRow.commonMaterialsId;
                    obj.unitId = this.unitId;
                }else if (this.billType == 'FAC_MISSION_COMPLETE' || this.billType == 'FAC_MISSION_ADJUST' || this.billType == 'FAC_MISSION_WASTE' || this.billType == 'FAC_MISSION_DEFECTIVE') {
                    //工单完成单：FAC_MISSION_COMPLETE
                    //工单调整单：FAC_MISSION_ADJUST
                    //工单废品单：FAC_MISSION_WASTE
                    //工单次品单：FAC_MISSION_DEFECTIVE
                    api = billReportReview;
                }
                else {
                    api = billReviewConfigStatus
                }
                this.isloadingApply = true;
                api(obj).then(res => {
                    this.taskUnPassDialog = false;
                    this.isloadingApply = false;
                    if (res.data.code === 0) {
                        this.getBillReviewConfigBillType()
                        this.$message.success('操作成功')
                    } else {
                        this.$message.error(res.data.msg)
                    }

                })
            },
            //跳转详情页面
            goDetail(data) {
                let type, path;
                if (this.billType == 'FAC_PRD_ORDER') {
                    type = 'formal'
                    path = '/orderProductioDetail'
                } else if (this.billType == 'FAC_PRD_ORDER_ADJUST') {
                    type = 3
                    path = '/adjustOrder'
                }else if (this.billType == 'COMMON_BOM') {
                    path = '/baseGoodsInfo'
                    this.$router.push({
                        path,
                        query: {id:data.styleId, goodsId:data.goodsId,bomId:data.id,type:'bom'},
                    });
                    return
                }
                this.$router.push({
                    path,
                    query: {id:data, type},
                })
            },
            // 获取商品属性选中的选项
            getAllAttrId(val, categorys,developerIds) {
                this.filterFormData.categorys = categorys&&categorys.length > 0 ? categorys : undefined
                this.filterFormData.goodsAttrIds = val&&val.length > 0 ? val : undefined
                this.filterFormData.developerIds = developerIds&&developerIds.length > 0 ? developerIds : undefined;
            },
            //货号
            getQueryGoodsStyle(){
                let params = {
                    unitId: this.facId,
                    keyword: ''
                }
                queryGoodsStyleByPlantArticleNumber(params).then(res=>{
                    console.log(res, '货号')
                    if (res.data.code === 0) {
                        this.options.styleIdList = res.data.data
                    }
                })
            },
            // 获取客户列表
            fetchCustomerList() {
                selectFacCustomer({
                    facId: this.facId,
                    pageNo: 1,
                    sortType: 0,
                    needAll:true
                }).then(res => {
                    this.options.customerList = res.data.goods;
                });
            },
            // 获取创建人列表
            getCreateLists(val){
                var params = {
                    "userId": this.userId,
                    "unitId":this.facId,
                    "keyword": val?val:'',
                    'pageNum': 1,
                    'pageSize':20,
                    'groupsFilter': []
                }
                getSelfWorkList(params).then(res => {
                    if (res.data.code == 0) {
                        if ( res.data){
                            this.options.createLists = res.data.data.workBayList;
                            this.options.createLists.unshift(this.user_info);
                        }
                    }

                });
            },
            //获取下单类型
            getPlaceOrderTypeList(){
                let params = {
                    unitId: this.facId,
                    keyword: ''
                }
                placeOrderTypeList(params).then(res=>{
                    console.log(res, '下单类型')
                    if (res.data.code === 0) {
                        this.options.placeOrderTypeList = res.data.commonGoodsAttrs
                    }
                })
            },
        },
    }
</script>

<style scoped lang="scss">
    .documentReview {
        .documentReview_head {
            padding: 8px 24px 0 24px;
        }
        .documentReview_body {
            padding: 0 24px;
            display: flex;
            .documentReview_body_lt {
                overflow-y: auto;
                width: 126px;
                min-width: 126px;
                background: #fff;
                margin-right: 10px;
                & > div {
                    height: 32px;
                    line-height: 32px;
                    box-shadow: 0px -1px 0px 0px rgba(230, 234, 240, 1);
                    padding: 0 10px;
                }
                .active_title {
                    background: #fff;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    &.is-active {
                        background: rgba(235, 239, 245, 1);

                    }
                }
                .documentReview_title_num {
                    width: 14px;
                    height: 14px;
                    border-radius: 50%;
                    background: red;
                    color: #fff;
                    text-align: center;
                    font-size: 12px;
                    line-height: normal;
                }
            }
            .documentReview_body_rg {
                flex: 1;
                overflow-x: hidden;
                display: flex;
                flex-direction: column;
                .documentReview_filter {
                    background: rgba(255, 255, 255, 1);
                    border-radius: 2px;
                    padding: 12px 0;
                    margin-bottom: 10px;
                }
                .documentReview_content{
                    overflow-y: auto;
                    flex: 1;
                }
                .mission {

                }
            }
        }
        .filter-form {
            overflow: hidden;
            padding-left: 10px;
            &__item {
                /*display: flex;*/
                margin-bottom: 10px;
                margin-right: 0;
                /* margin-left: -30px;*/
                width: 25%;
                .el-select {
                    width: 100% !important;
                }
                .attrs-select {
                    display: inline-block;
                    box-sizing: border-box;
                    max-width: 245px;
                    width: 217px;
                    padding: 3px 35px 3px 10px;
                    line-height: 30px;
                    height: 36px;
                    border-radius: 2px;
                    color: #bec9d8;
                    cursor: pointer;
                    border: 1px solid rgb(191, 200, 217);
                    transition: border-color .3s;
                    &:hover {
                        border-color: rgb(131, 140, 165);
                    }
                    &__icon {
                        display: inline-block;
                        width: 35px;
                        height: 36px;
                        line-height: 38px;
                        box-sizing: border-box;
                        text-align: center;
                        position: absolute;
                        right: 0;
                        top: 0;
                        font-size: 12px;
                        transition: transform .3s;
                    }
                }
            }
            &__checker {
                max-width: 245px;
                width: 217px;
            }
            &__row {
                overflow: hidden;
            }
            .border-top-1px {
                padding-top: 10px;
                border-top: 1px solid #E6EAF0;
            }
        }
        .btn-group {
            float: right;
            display: flex;
            justify-content: flex-end;
            width: 245px;
            margin-right: 10px;
            button {
                color: #808080;
                font-size: 14px;
            }
            .icon {
                font-size: 12px;
                margin-left: 3px;
            }
            .btn {
                width: 72px;
                height: 36px;
                box-sizing: border-box;
                border-width: 1px;
                border-style: solid;
                border-radius: 2px;
                margin-left: 12px;
                &:hover {
                    opacity: .7;
                }
            }
            .btn-reset {
                border-color: #DCE0E6;
                background: #ffffff;
            }
            .btn-submit {
                border-color: #54D1BC;
                background: #54D1BC;
                color: #fff;
            }
        }
        .dialogDataAdd {
            height: 32px;
            line-height: 32px;
            text-align: center;
            border: 1px solid #e0e6ed;
            border-top: none;
            cursor: pointer;
            color: #ff8d37;
        }
    }


</style>

<style lang="scss">
    @import '../../assets/style/el-table.scss';
    .custom-dialog{
        .el-form-item{
            margin-bottom: 10px;
            display: block;
            margin-right: 0px;
        }
    }
    .documentReview {
        .documentReview_filter{
            .el-form-item__content{
                width: 68%;
            }
        }
        .el-table td .cell {
            line-height: 18px;
            /*padding: 0;*/
        }
        .documentReview_dialog .el-select .el-input__inner {
            border: none;
        }
        .unpass-dialog {
            .el-dialog {
                width: 360px;
            }
        }
    }

    .cellHeight .cell {
        height: 100%;
    }
</style>
