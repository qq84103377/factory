<template>
    <div class="new-pay-off">
        <div class="scroll-content">
            <page-title class="pdlr24 pdtb16 bd-bottom" :title="title">
                <div class="btns">
                    <nf-button fsize='12' @click="cancel">取消</nf-button>
                    <nf-button fsize='12' :loading="isSubmitting" type="warning" @click="confirm">确定</nf-button>
                </div>
            </page-title>
            <div class="custom-filter-form bd-bottom" style="padding-right: 24px;">
                <el-form :model="form" label-width="100px">
                    <el-row>
                        <el-col :xs="12" :sm="12" :md="8" :lg="6">
                            <el-form-item label="送料仓库" required>
                                <el-select v-model="form.deliveryStorehouseId" placeholder="请选择或搜索送料仓库" clearable
                                           filterable>
                                    <el-option
                                            v-for="item in options.storeHouses"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="12" :sm="12" :md="8" :lg="6">
                            <el-form-item :label="belongModule==2?'单号':'送料单号'">
                                <el-input :maxlength="50" v-model.trim="form.billDeliveryNo"
                                          placeholder="不填则自动生成流水号"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="12" :sm="12" :md="8" :lg="6">
                            <el-form-item label="送料员" required>
                                <workerLeader v-model="form.deliveryerId" :single="'single'"
                                              :placeholder="'请选择或搜索送料员'"></workerLeader>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="12" :sm="12" :md="8" :lg="6">
                            <el-form-item label="送料日期" required>
                                <el-date-picker
                                        v-model="form.deliveryDate"
                                        type="date"
                                        placeholder="选择日期">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="12" :sm="12" :md="8" :lg="6" v-if="isSampleMaterial">
                            <el-form-item label="设计款号">
                                <design-style-no-select v-model="form.designStyleNo"></design-style-no-select>
                            </el-form-item>
                        </el-col>
                        <!--<el-col :xs="12" :sm="12" :md="8" :lg="6" v-if="belongModule==0">-->
                            <!--<el-form-item label="生产单号">-->
                                <!--<el-select v-model="form.facMissionId" @change="freedomMissionsSel" placeholder="选填"-->
                                           <!--clearable filterable remote :remote-method="remoteFacMissionId">-->
                                    <!--<el-option-->
                                            <!--v-for="item in options.freedomMissions"-->
                                            <!--:key="item.id"-->
                                            <!--:label="item.facMissionNo"-->
                                            <!--:value="item.id">-->
                                    <!--</el-option>-->
                                <!--</el-select>-->
                            <!--</el-form-item>-->
                        <!--</el-col>-->
                        <el-col :xs="12" :sm="12" :md="8" :lg="6">
                            <el-form-item label="加工厂">
                                <el-select v-model="form.outsideFactoryId" placeholder="请选择或搜索" filterable remote
                                           :remote-method="getFactorys">
                                    <el-option key="self" value="self" label="本厂"></el-option>
                                    <el-option
                                            v-for="item in options.facList"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col v-if="belongModule==0" :xs="12" :sm="12" :md="8" :lg="6">
                            <el-form-item label="送料通知单">
                                <el-input v-model="form.billDeliveryNotify.billDeliveryNotifyNo" class="fs12"
                                          placeholder="请选择" @focus="showSearchMaterial('notice')"
                                          :on-icon-click="deleteBillDeliveryNotify"
                                          :icon="form.billDeliveryNotify&&form.billDeliveryNotify.billDeliveryNotifyId?
                                          'close':'caret-bottom'"></el-input>
                            </el-form-item>
                        </el-col>

                    </el-row>
                </el-form>
            </div>
            <div class="action-btn">
                <el-button  v-if="!isSampleMaterial&&!form.billDeliveryNotify.billDeliveryNotifyId"
                           @click="showSearchMaterial('mission')" class="orange-btn" size="small">+ 按工单添加
                </el-button>
                <el-button v-if="!form.billDeliveryNotify.billDeliveryNotifyId" @click="showSearchMaterial('material')"
                           class="orange-btn" size="small">+ 按物料添加</el-button>
                <el-button v-if="isSampleMaterial&&!form.billDeliveryNotify.billDeliveryNotifyId" @click="showSearchMaterial('purchase')" class="orange-btn"
                           size="small">+
                    按采购单添加
                </el-button>
                <el-button v-if="!isSampleMaterial" @click="fillAll" class="blue-btn" size="small">按合计待送一键填齐
                </el-button>
            </div>
            <div ref="newPayOffContent" v-loading="loading" class="main-content">
                <el-table
                        v-if="newPayOff.fieldConfigList.length>0"
                        :height="tableHeight"
                        :data="newPayOff.materialsSkus"
                        border
                        class="custom-table tiny-row no-hover-highlight"
                        style="width: 100%">
                    <el-table-column
                            v-for="column in newPayOff.fieldConfigList"
                            :key="column.code"
                            :prop="column.code"
                            :label="handleLabel(column)"
                            :min-width="column.width"
                            :fixed="newPayOff.fixedLeft.includes(column.name)?'left':newPayOff.fixedRight.includes(column.name)?'right':undefined"
                            :class-name="newPayOff.yellowBg.includes(column.name)?'yellow-bg no-padding':'no-padding'">
                        <template slot-scope="scope">
                            <div class="custom-cell pdlr10">
                                <img @click="previewImg(scope.row)" v-if="column.name ==='图片'" v-errorLogo
                                     style="display:inline-block;vertical-align: middle;width: 24px;height: 24px;"
                                     :src="scope.row[column.code]"/>
                                <div v-else-if="column.name ==='合计通知'">
                                    <el-input v-if="belongModule==2"
                                              @change="notifyTotalChange($event,scope.row,scope.$index)"
                                              placeholder="请输入" type="number"
                                              v-model="scope.row[column.code]"></el-input>
                                    <span v-else>{{scope.row[column.code]}}</span>

                                </div>
                                <div v-else-if="column.name ==='合计送料'">
                                    <el-input @change="notifyTotalChange($event,scope.row,scope.$index)"
                                              placeholder="请输入" type="number"
                                              v-model="scope.row[column.code]"></el-input>
                                </div>
                                <div v-else-if="column.name ==='供应商款号/色号'">
                                    {{scope.row.supplierStyleNo}}/{{scope.row.supplierColorNo}}
                                </div>
                                <div v-else-if="column.name ==='可用库存'">
                                    {{handleColumnData(column,scope.row)}}
                                </div>
                                <div v-else-if="column.name ==='总库存'">
                                    {{handleColumnData(column,scope.row)}}
                                </div>
                                <span v-else>{{scope.row[column.code]}}</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column class-name="no-padding" label="操作" fixed="right" width="160" align="center">
                        <template slot-scope="scope">
                            <div class="action-list">
                                <div  @click="showEditByOrder(scope.row,scope.$index)"
                                     class="item blue pointer">{{belongModule==2?'按单通知':'按单送料'}}
                                </div>
                                <div v-if="!form.billDeliveryNotify.billDeliveryNotifyId" @click="deleteMaterialsSku(scope.row,scope.$index)" class="item red pointer">删除
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <!--图片预览-->
        <nf-previewer ref="previewer" value="path" :list="previewList"></nf-previewer>
        <search-material-dialog
                :outsideFactoryId="form.outsideFactoryId"
                :visible.sync="searchMaterial.visible"
                :type="searchMaterial.type"
                :selectedList="searchMaterial.currentSelectedIds"
                @confirm="confirmAddMaterial"></search-material-dialog>
        <!--按单送料、按单编辑-->
        <edit-by-order-dialog
                :storehouseId="form.deliveryStorehouseId"
                :billDeliveryNotify="form.billDeliveryNotify"
                :belongModule="belongModule"
                :visible.sync="editByOrder.visible"
                :materialsSku="editByOrder.materialsSku"
                @confirm="editByOrderConfirm"
        ></edit-by-order-dialog>
    </div>
</template>

<script>
    import SearchMaterialDialog from "./searchMaterialDialog";

    const fun = require('../../../Common/commonFun.js')
    import {
        getfreedomMissions,
        getStoreAndDeliveriers,
        formQueryOnMaterial,
        formListAddOnMaterial,
        formQueryOnMission,
        formListAddOnMission,
        newPayOffMaterial,
        updatePayOffMaterial,
        getPurchase,
        queryDeliveryDemandForNewBill,
        queryDeliveryDemandForNewBillMaterial,
        queryDeliveryDemandForNewBillNotify,
        getFactorys
    } from '@/api';
    import DesignStyleNoSelect from "@/components/Common/custom-select/designStyleNoSelect";
    import EditByOrderDialog from "./editByOrderDialog";

    export default {
        // isEdit 是否编辑
        // visible 是否可见
        // belongModule： 0：送料单 1：样料送料单 2：送料通知单
        // facMissionIds:[], //按工单选中的
        // materialSkuIds:[], //按物料选中的
        // billMaterialPurchaseIds:[], //按采购单选中的
        // billDeliveryNotify:{}, //选中的通知单
        props: ['isEdit', 'visible', 'belongModule', 'facMissionIds', 'materialSkuIds', 'billMaterialPurchaseIds', 'billDeliveryNotify', 'detailInfo'],
        data() {
            return {
                loading: false,
                options: {
                    freedomMissions: [],
                    storeHouses: [],
                    deliveriers: [],
                    facList: []
                },
                form: {
                    facMissionId: '',
                    billDeliveryNo: '',
                    deliveryStorehouseId: '',
                    deliveryDate: new Date(),
                    deliveryerId: '',
                    designStyleNo: '',
                    billDeliveryNotify: {
                        billDeliveryNotifyId: '',
                        billDeliveryNotifyNo: ''
                    }, //选中的通知单
                    outsideFactoryId: '',
                },
                newPayOff: {
                    materialsSkus: [],
                    fieldConfigList: [
                        {code: 'kindName', name: '分类', width: 120},
                        {code: 'commonMaterialsSkuPicture', name: '图片', width: 60},
                        {code: 'materialsNo', name: '物料款号', width: 120},
                        {code: 'supplierName', name: '供应商', width: 120},
                        {code: 'supplierStyleColor', name: '供应商款号/色号', width: 120},
                        {code: 'materialsName', name: '物料名称', width: 120},
                        {code: 'colorName', name: '颜色', width: 120},
                        {code: 'specificationsRemark', name: '规格', width: 120},
                        {code: 'stockUnitName', name: '库存单位', width: 70},
                        {code: 'availableStock', name: '可用库存', width: 70},
                        {code: 'totalStock', name: '总库存', width: 70},
                    ],
                    yellowBg: this.belongModule==2?['合计通知']:['合计送料'], //要黄色底的列
                    fixedLeft: [],
                    fixedRight:this.belongModule==2?['合计通知']:['合计送料']
                },
                isSubmitting: false,
                outsideFactoryId: 'init',
                styleNo: '',
                tableHeight: 300,
                previewList: [],
                searchMaterial: {
                    visible: false,
                    type: '',
                    facMissionIds: [], //按工单选中的
                    materialSkuIds: [], //按物料选中的
                    billMaterialPurchaseIds: [], //按采购单选中的
                    currentSelectedIds: [], //弹出框弹出时，选中的id
                },
                editByOrder: {
                    visible: false,
                    materialsSku: [], //采购需求列表
                    materialsSkuIndex: ''
                },
            }
        },
        components: {
            EditByOrderDialog,
            SearchMaterialDialog,
            DesignStyleNoSelect,
        },
        computed: {
            facMissionId() {
                return this.$route.query.facMissionId;
            },
            facId() {
                return JSON.parse(sessionStorage.getItem('user_login')).unitId;
            },
            userId() {
                return (this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem("user_login")).userId);
            },
            isSampleMaterial() {
                return this.$route.path === '/sampleMarterielPayoffList' || this.$route.path === '/samplePayoffDetail'
            },

            title() {
                let title = this.isEdit ? '编辑' : '新建'
                switch (Number(this.belongModule)) {
                    case 0:
                        title = title + '送料单';
                        break;
                    case 1:
                        title = title + '样料送料单';
                        break;
                    case 2:
                        title = title + '送料通知单';
                        break;
                }
                return title
            }
        },
        created() {
            // 根据不同belongModule添加不同列
            this.addDynamicFields();
            // 设置默认选中物料
            this.setDefaultMaterial();
            // 获取加工厂下拉列表
            this.getFactorys();
            this.fetchOptions();
            this.getfreedomMissions();
            if (this.isEdit) {
                this.form = {
                    facMissionId: this.detailInfo.form.facMissionId,
                    billDeliveryNo: this.detailInfo.form.billDeliveryNo,
                    deliveryStorehouseId: this.detailInfo.form.deliveryStorehouseId,
                    deliveryDate: this.detailInfo.form.deliveryDate,
                    deliveryerId: this.detailInfo.form.deliveryerId,
                    designStyleNo: this.detailInfo.form.designStyleNo,
                    billDeliveryNotify: {
                        billDeliveryNotifyId: this.detailInfo.form.billNotifyId,
                        billDeliveryNotifyNo: this.detailInfo.form.billNotifyNo,
                    },
                    outsideFactoryId: this.detailInfo.form.outsideFactoryId,
                },
                    this.newPayOff.materialsSkus = JSON.parse(JSON.stringify(this.detailInfo.materialsSkus))
            }
        },
        mounted() {
            this.$nextTick(() => {
                let self = this;
                this.tableHeight = this.$refs.newPayOffContent.offsetHeight
                // 通过捕获系统的onresize事件触发去改变原有的高度
                window.onresize = function () {
                    self.tableHeight = self.$refs.newPayOffContent.offsetHeight
                }
            })
        },
        methods: {
            handleColumnData(column,row) {
                if(this.form.deliveryStorehouseId) {
                    let availableStock = 0, totalStock = 0;
                    if(row.stocks) {
                        row.stocks.forEach(s => {
                            if(s.skuId === row.materialsSkuId && s.storehouseId === this.form.deliveryStorehouseId) {
                                availableStock = s.availableStock
                                totalStock = s.totalStock
                            }
                        })
                    }
                    if(column.name == '可用库存') {
                        return availableStock
                    }else if(column.name == '总库存'){
                        return totalStock
                    }
                }else {
                    return row[column.code]
                }
            },
            handleLabel(column) {
                if(this.form.deliveryStorehouseId) {
                    if(column.name=='可用库存') {
                        return '可用数'
                    }else if (column.name == '总库存') {
                        return '库存数'
                    }else {
                        return column.name
                    }
                }else {
                    return column.name
                }
            },
            // 删除选中的样料通知单
            deleteBillDeliveryNotify(){
                this.form.billDeliveryNotify={
                    billDeliveryNotifyId: '',
                    billDeliveryNotifyNo: ''
                }
                this.newPayOff.materialsSkus = []
            },
            // 设置默认选中物料
            setDefaultMaterial(){
                // facMissionIds:[], //按工单选中的
                // materialSkuIds:[], //按物料选中的
                // billMaterialPurchaseIds:[], //按采购单选中的
                // billDeliveryNotify:{}, //选中的通知单
                if (this.facMissionIds&&this.facMissionIds.length) {
                    this.confirmAddMaterial(this.facMissionIds, 'mission')
                }
                if (this.billMaterialPurchaseIds&&this.billMaterialPurchaseIds.length) {
                    this.confirmAddMaterial(this.billMaterialPurchaseIds, 'purchase')
                }
                if (this.billDeliveryNotify) {
                    this.confirmAddMaterial(this.billDeliveryNotify, 'notice')
                }
                if (this.materialSkuIds&&this.materialSkuIds.length) {
                    this.confirmAddMaterial(this.materialSkuIds, 'material')
                }
            },
            // 根据不同belongModule添加不同列
            addDynamicFields(){
                let addFields = []
                if (this.belongModule == 0) {
                    addFields = [
                            {code: 'totalWaitPayOff', name: '合计待送', width: 70},
                            {code: 'notifyTotal', name: '合计通知', width: 70},
                            {code: 'totalPayOff', name: '合计送料', width: 70},
                            {code: 'totalQuantityDelivered', name: '合计已送', width: 70}
                        ]

                } else if (this.belongModule == 1) {
                    addFields = [{code: 'totalPayOff', name: '合计送料', width: 70}]

                } else {
                    addFields = [
                        {code: 'totalWaitPayOff', name: '合计待送', width: 70},
                        {code: 'notifyTotal', name: '合计通知', width: 70},
                        {code: 'totalQuantityDelivered', name: '合计已送', width: 70}
                    ]
                }
                this.newPayOff.fieldConfigList = [...this.newPayOff.fieldConfigList,...addFields]
            },
            // 合计通知改变时
            notifyTotalChange(val, row, index) {
                this.$set(row, this.belongModule==2?'notifyTotal':'totalPayOff', val)
                if (val) {
                    let total = Number(val)
                    for (let i = 0; i < row.sourceBills.length; i++) {
                        let item = row.sourceBills[i]
                        if (total > 0) {
                            if (item.waitDeliveryQuantity >= total) {
                                this.$set(item, (this.belongModule==2?'notifyQuantity':'deliveryQuantity'), item.waitDeliveryQuantity > total ? total : item.waitDeliveryQuantity)
                                total = 0
                            } else {
                                this.$set(item, (this.belongModule==2?'notifyQuantity':'deliveryQuantity'), item.waitDeliveryQuantity)

                                total = Number((total - (item.waitDeliveryQuantity ? item.waitDeliveryQuantity : 0)).toFixed(2))
                            }
                        } else {
                            this.belongModule==2?item.notifyQuantity = 0:item.deliveryQuantity = 0
                        }

                    }
                    // 如果有剩余
                    if (total > 0) {
                        let lastPurchaseDemand = row.sourceBills[row.sourceBills.length - 1]
                        if (lastPurchaseDemand&&!lastPurchaseDemand.sourceBillId) {
                            if(this.belongModule==2){
                                this.$set(lastPurchaseDemand, 'notifyQuantity', lastPurchaseDemand.notifyQuantity ? (lastPurchaseDemand.notifyQuantity + total) : total)

                            } else {
                                this.$set(lastPurchaseDemand, 'deliveryQuantity', lastPurchaseDemand.deliveryQuantity ? (lastPurchaseDemand.deliveryQuantity + total) : total)
                            }
                        } else {
                            let lastPurchaseDemand = {
                                sourceBillId: '',
                                materialsSkuId: row.materialsSkuId,
                                styleNo: "", //成衣款号
                            }
                            this.belongModule==2?lastPurchaseDemand.notifyQuantity = total:lastPurchaseDemand.deliveryQuantity = total
                            row.sourceBills.push(lastPurchaseDemand)
                        }
                    }
                } else {
                    row.sourceBills.forEach(item => {
                        this.belongModule==2?item.notifyQuantity = 0:item.deliveryQuantity = 0
                    })
                }
            },
            // 一键填齐
            fillAll() {
                this.newPayOff.materialsSkus.forEach(item => {
                    let total = 0
                    item.sourceBills.forEach(billItem => {
                        // 非计划外才有待送料
                        // 如果选中了通知单，则合计送料、本次送料，根据本次通知的值去取，否则，根据待送料的值去取
                        let tempQuantity = this.form.billDeliveryNotify.billDeliveryNotifyId?billItem.notifyQuantity:billItem.waitDeliveryQuantity
                        if (billItem.sourceBillId) {
                            this.$set(billItem, (this.belongModule==2?'notifyQuantity':'deliveryQuantity'), tempQuantity)

                            total = total + (tempQuantity ? tempQuantity : 0)
                        } else {
                            if(this.belongModule==2){
                                total = total + (billItem.notifyQuantity ? billItem.notifyQuantity : 0)

                            } else {
                                total = total + (billItem.deliveryQuantity ? billItem.deliveryQuantity : 0)
                            }

                        }
                    })
                    this.$set(item, this.belongModule==2?'notifyTotal':'totalPayOff', Number(total.toFixed(2)))
                })

            },
            // 删除物料
            deleteMaterialsSku(row, index) {
                this.newPayOff.materialsSkus.splice(index, 1)
            },
            // 点击按单编辑确认
            editByOrderConfirm(newMaterialsSku) {
                this.$set(this.newPayOff.materialsSkus, this.editByOrder.materialsSkuIndex, newMaterialsSku)
            },
            // 显示按单编辑弹窗
            showEditByOrder(row, index) {

                this.editByOrder.materialsSku = row
                this.editByOrder.materialsSkuIndex = index
                this.editByOrder.visible = true
            },
            // 确定添加物料
            confirmAddMaterial(newSelectedList, type) {

                console.log(newSelectedList)
                let params = {
                    pageSize: 2147483647,//这里不应该分页，后台不想改接口，所以直接用了int最大值
                    pageNum: 1
                }
                let api = ''
                console.log(newSelectedList, 9090)
                switch (type) {
                    case 'mission':
                        this.searchMaterial.facMissionIds = newSelectedList;
                        params.facMissionIds = this.searchMaterial.facMissionIds;
                        api = queryDeliveryDemandForNewBill;
                        break;
                    case 'purchase':
                        this.searchMaterial.billMaterialPurchaseIds = newSelectedList;
                        params.billMaterialPurchaseIds = this.searchMaterial.billMaterialPurchaseIds;
                        api = queryDeliveryDemandForNewBillMaterial;
                        break;
                    case 'notice':
                        this.form.billDeliveryNotify = {
                            billDeliveryNotifyId: newSelectedList.billDeliveryNotifyId,
                            billDeliveryNotifyNo: newSelectedList.billDeliveryNotifyNo
                        };
                        params.billDeliveryNotifyId = this.form.billDeliveryNotify.billDeliveryNotifyId;
                        api = queryDeliveryDemandForNewBillNotify;
                        break;
                    case 'material':
                        this.searchMaterial.materialSkuIds = newSelectedList;
                        params.materialSkuIds = this.searchMaterial.materialSkuIds;
                        api = queryDeliveryDemandForNewBillMaterial;
                        break;
                }
                this.loading = true
                api(params).then(res => {
                    this.loading = false
                    if (res.data.code == 0) {
                        // 如果是选择了通知单，清除之前选择的所有物料
                        if(type === 'notice'){
                            this.newPayOff.materialsSkus = []
                        }
                        let oldMaterialsSkus = JSON.parse(JSON.stringify(this.newPayOff.materialsSkus))
                        let newMaterialsSkus = type == 'mission' ? res.data.data.list : res.data.data
                        // 如果是样料送料单，并且搜索的是采购单，手动更改sourceBills的值
                        if(this.belongModule==1&&type ==='material'){
                            newMaterialsSkus.forEach(item => {
                                item.sourceBills = [{
                                    sourceBillId: '',
                                    materialsSkuId: item.materialsSkuId,
                                    styleNo: "",
                                    notifyQuantity:'',
                                    deliveryQuantity:''
                                }]
                            })
                        } else{  //否则，检测是否有计划外送料行，没有的话，加上
                            newMaterialsSkus.forEach(item => {
                                let hasUnplannedItem = item.sourceBills.some(item => !item.sourceBillId)
                                console.log(hasUnplannedItem,78)
                                if(!hasUnplannedItem){
                                    item.sourceBills.push({
                                        sourceBillId: '',
                                        materialsSkuId: item.materialsSkuId,
                                        styleNo: "",
                                        notifyQuantity:'',
                                        deliveryQuantity:''
                                    })
                                }
                            })
                        }
                        newMaterialsSkus.forEach(item => {
                            let tempMaterialsSku = oldMaterialsSkus.find(oldItem => oldItem.materialsSkuId === item.materialsSkuId)
                            if (tempMaterialsSku) {
                                item.sourceBills.forEach(billItem => {
                                    let tempBill = tempMaterialsSku.sourceBills.find(item =>
                                        (item.sourceBillId + item.materialsSkuId) === (billItem.sourceBillId + billItem.materialsSkuId))
                                    if (!tempBill) {
                                        tempMaterialsSku.sourceBills.push(billItem)
                                    }
                                })
                            } else {
                                oldMaterialsSkus.push(item)
                            }
                        })
                        // 将计划外放在最后

                        oldMaterialsSkus.forEach(item => {
                            let unplannedList = []
                            let plannedList = []
                            // 新建送料单不选通知单时，“合计通知”和按单送料的“本次通知”取值为空
                            if(type!=='notice'&&item.notifyTotal==0){
                                item.notifyTotal = ''
                            }
                            item.sourceBills.forEach(billItem => {
                                // 新建送料单不选通知单时，“合计通知”和按单送料的“本次通知”取值为空
                                if(type!=='notice'&&item.notifyQuantity==0){
                                    item.notifyQuantity = ''
                                }
                                billItem.sourceBillId ? plannedList.push(billItem) : unplannedList.push(billItem)
                            })
                            item.sourceBills = [...plannedList, ...unplannedList]
                        })
                        this.newPayOff.materialsSkus = oldMaterialsSkus
                        this.$nextTick(() => {
                            this.fillAll()
                        })
                    }
                })
            },
            // 显示搜索物料弹窗
            showSearchMaterial(type) {
                switch (type) {
                    case 'mission':
                        this.searchMaterial.currentSelectedIds = this.searchMaterial.facMissionIds;
                        break;
                    case 'purchase':
                        this.searchMaterial.currentSelectedIds = this.searchMaterial.currentSelectedIds;
                        break;
                    case 'notice':
                        this.searchMaterial.currentSelectedIds = this.form.billDeliveryNotify;
                        break;
                    case 'material':
                        this.searchMaterial.currentSelectedIds = this.searchMaterial.materialSkuIds;
                        break;
                }
                this.searchMaterial.type = type
                this.searchMaterial.visible = true
            },
            // 预览图片
            previewImg(row) {
                if (!row.commonMaterialsPictureList.length) return;
                this.previewList = row.commonMaterialsPictureList.map(item => {
                    return {
                        path: item
                    }
                });
                this.$nextTick(() => {
                    this.$refs["previewer"].show(0)
                });
            },
            //生产单号
            getfreedomMissions(val) {
                let key = '';
                if (val) {
                    key = val
                }
                let obj = {
                    unitId: this.facId,
                    likeColumn: key
                }
                getfreedomMissions(obj).then(res => {
                    console.log(res);
                    this.options.freedomMissions = res.data.data
                })
            },
            remoteFacMissionId(val) {
                this.getfreedomMissions(val)
            },
            freedomMissionsSel(val) {

                this.options.freedomMissions.forEach(item => {
                    if (val === item.id) {
                        console.log(item.outsideFactoryId);
                        this.outsideFactoryId = item.outsideFactoryId
                        this.styleNo = item.styleNo
                    }
                })

            },
            // 取消按钮
            cancel() {
                this.$emit('update:visible', false)
                this.$emit('cancel')
                // this.$emit('editAgainSucc', this.$route.query.id, this.$route.query.type)
            },
            // 确定
            confirm() {
                if (!this.form.deliveryStorehouseId) {
                    this.$message.error('请选择仓库');
                    return;
                }
                if (!this.form.deliveryDate) {
                    this.$message.error('请选择' + (this.belongModule == 2 ? '操作日期' : '送料日期'));
                    return;
                }
                if (!this.form.deliveryerId) {
                    this.$message.error('请选择' + (this.belongModule == 2 ? '操作员' : '送料员'));
                    return;
                }

                let skus = []
                this.newPayOff.materialsSkus.forEach(item => {
                    item.sourceBills.forEach(billItem => {
                        if (this.belongModule==2&&billItem.notifyQuantity) {
                            skus.push({
                                facMissionId: billItem.sourceBillId,
                                materialSkuId: billItem.materialsSkuId,
                                quantity: billItem.notifyQuantity,
                                supplierId: item.supplierId,
                                status:item.status
                            })
                        }
                        if (this.belongModule!=2&&billItem.deliveryQuantity) {
                            skus.push({
                                facMissionId: billItem.sourceBillId,
                                materialSkuId: billItem.materialsSkuId,
                                quantity: billItem.deliveryQuantity,
                                supplierId: item.supplierId,
                                status:item.status
                            })
                        }
                    })
                })
                if (!skus.length) {
                    this.$message.error(this.belongModule == 2 ? '本次通知不能都为0' : '本次送料不能都为0')
                    return
                }
                let hasMoreThan = false
                let moreThanTip= ''
                for (let i = 0; i < this.newPayOff.materialsSkus.length; i++) {
                    let item = this.newPayOff.materialsSkus[i]
                    if (this.belongModule==2&&item.notifyTotal !== 0 && !item.notifyTotal) {
                        this.$message.error('合计通知未填')
                        return
                    }
                    if (this.belongModule!=2&&item.totalPayOff !== 0 && !item.totalPayOff) {
                        this.$message.error('合计送料未填')
                        return
                    }
                    for (let j = 0; j < item.sourceBills.length; j++) {
                        let billItem = item.sourceBills[j]
                        // 送料单检测【本次送料】是否已超过【本次通知】
                        if (this.belongModule==0&&(billItem.deliveryQuantity > billItem.notifyQuantity)) {
                            hasMoreThan = true
                            moreThanTip ='存在某些物料的【本次送料】已超过【本次通知】，是否继续提交？'
                        }
                        //送料通知单检测【本次通知】是否已超过【本单总占用】
                        if (this.belongModule==2&&(billItem.notifyQuantity > billItem.selfPreuseTotal)) {
                            hasMoreThan = true
                            moreThanTip ='存在某些物料的【本次通知】已超过【本单总占用】，是否继续提交？'
                        }
                    }
                }
                if (hasMoreThan) {
                    this.$confirm(moreThanTip, '提示', {
                        confirmButtonText: '继续提交',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.editPayOff(skus)
                    }).catch(() => {
                    });
                } else {
                    this.editPayOff(skus)
                }
            },
            editPayOff(skus) {

                let params = {
                    userId: this.userId,
                    storehouseId: this.form.deliveryStorehouseId,
                    orderNo: this.form.billDeliveryNo,
                    facMissionId: this.form.facMissionId,
                    outsideFactoryId: this.form.outsideFactoryId,
                    dateDelivery: this.form.deliveryDate ? fun.dateFormatter(this.form.deliveryDate, false) : '',
                    unitId: this.facId,
                    deliveryCreatorId: this.form.deliveryerId,
                    skus: skus,
                    belongModule: this.belongModule, // 1:样料模块 0：物料采购模块
                    designStyleNo: this.form.designStyleNo,
                    billNotifyId: this.form.billDeliveryNotify.billDeliveryNotifyId,
                    // billMaterialPurchaseId: ''
                }
                this.isSubmitting = true
                if (this.isEdit) {
                    //重编辑
                    params.deliveryId = this.$route.query.id
                    updatePayOffMaterial(params).then(res => {
                        this.btnLoading = false;
                        if (res.data.code == 0) {
                            this.$message.success('编辑成功');
                            this.$emit('update:visible', false)
                            this.$emit('success',this.isEdit)
                        } else {
                            this.$message.error(res.data.msg);
                        }
                    })

                } else {
                    newPayOffMaterial(params).then(res => {
                        this.isSubmitting = false
                        console.log(res.data.code);
                        if (res.data.code !== 0) {
                            this.$message.error(res.data.msg);
                        } else {
                            this.$message.success('新建成功');
                            let query = {id: res.data.data, belongModule: this.belongModule}
                            this.$emit('success',this.isEdit,query)
                            this.$emit('update:visible', false)

                        }

                    })
                }
            },
            // 获取新建送料单时的送料仓库和送料员下拉列表
            fetchOptions() {
                const params = {
                    unitId: this.facId
                };
                if (this.facMissionId) {
                    params.facMissionId = this.facMissionId;
                }
                getStoreAndDeliveriers(params)
                    .then(res => {
                        const {deliveriers, storeHouses} = res.data.data;
                        this.options.storeHouses = storeHouses;
                        this.form.deliveryStorehouseId = this.options.storeHouses[0].id;
                        this.options.deliveriers = deliveriers;
                        if (this.isEdit) return;
                        this.form.deliveryerId = this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId;
                    });
            },
            // 加工厂工厂下拉
            getFactorys(key = "") {
                let params = {
                    userId: this.userId,
                    key: key
                }
                getFactorys(params).then(res => {
                    this.options.facList = res.data.data
                })
            },
        }
    }
</script>

<style lang="scss" scoped>
    .new-pay-off {
        position: fixed;
        top: 0;
        right: 0;
        width: 100%;
        height: 100%;
        background-color: #fff;
        z-index: 1000;
        .scroll-content {
            height: 100%;
            margin: 0;
            .action-btn {
                padding: 16px 24px 12px;
                text-align: right;
            }
            .orange-btn {
                color: #ff9c38;
                background: transparent;
                border: 1px solid #ff9c38;
            }
            .blue-btn {
                color: #1CA1FF;
                background: transparent;
                border: 1px solid #1CA1FF;
            }
            .main-content {
                margin: 0 24px 16px;
            }
        }

    }
</style>
<style lang="scss">
    .new-pay-off {
        td.yellow-bg {
            background-color: #FFF9ED !important;
            .el-textarea__inner,
            .el-input__inner {
                background-color: #FFF9ED !important;
            }
        }

        .custom-cell {
            .el-textarea__inner,
            .el-input__inner {
                font-size: 12px;
                min-height: 24px;
                padding: 3px 0;
                height: 24px;
                border: none;
            }
        }
    }

</style>

