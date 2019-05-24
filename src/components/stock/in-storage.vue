<template>
    <section class="in-storage">
        <el-row>
            <page-title class="in-storage__title">
                <div class="title" slot="title">
                    {{(isInStorge == 1||isInStorge == 5) ? '入库' : (isInStorge == 2? '调整' : isInStorge ==
                    3?'发货':isInStorge == 4?'退货':'出库')}}单：
                    <span v-if="isInStorge != 2"
                          :class="[(isInStorge == 1||isInStorge == 5) ? 'green' : (isInStorge == 2? 'red' : isInStorge == 3?'blue':'orange')]">{{(isInStorge == 1||isInStorge == 5) ?inGoodStyleNum:outGoodStyleNum}}款/{{(isInStorge == 1||isInStorge == 5) ?inTotalNum:outTotalNum}}件</span>
                    <span v-else class="red">出库{{outGoodStyleNum}}款/{{outTotalNum}}件, 入库{{inGoodStyleNum}}款/{{inTotalNum}}件</span>
                </div>
                <div class="btn-warp">
                    <nf-button @click="isEdit?$emit('cancel'):$router.go(-1)">取消</nf-button>
                    <nf-button :loading="btnLoading" @click="submit(0)" v-if="isConfig">存草稿</nf-button>
                    <!--<nf-button :loading="btnLoading" type="warning" @click="submit('')" v-if="isEdit">保存</nf-button>-->
                    <nf-button :loading="btnLoading" type="warning" @click="submit(isConfig?1:2)">
                        {{isConfig?'提报':'生成单据'}}
                    </nf-button>
                </div>
            </page-title>
        </el-row>
        <el-row class="in-storage__search">

            <div class="custom-filter-form box-shadow">
                <el-form>
                    <el-row type="flex" style="flex-wrap: wrap">
                        <!--<el-form-item v-if="isInStorge != 2" required label="仓库" class="filter-item">-->
                        <!--<el-select disabled v-model="form.storehouseId" placeholder="请选择">-->
                        <!--<el-option-->
                        <!--v-for="item in storehouseList"-->
                        <!--:key="item.id"-->
                        <!--:label="item.name"-->
                        <!--:value="item.id">-->
                        <!--</el-option>-->
                        <!--</el-select>-->
                        <!--</el-form-item>-->
                        <el-form-item required label="单据号" class="filter-item">
                            <el-input v-model="form.orderNo" placeholder="不填则自动生成"></el-input>
                        </el-form-item>
                        <!--<el-form-item required :label="`${isInStorge == 1 ? '入库' : (isInStorge == 2? '调整' :isInStorge == 3 ? '发货' : '出库')}人`" class="filter-item">-->
                        <el-form-item required label="开单人" class="filter-item">
                            <workerLeader v-model="form.operaterId" :single="'single'"
                                          :placeholder="'请选择或搜索操作人'"></workerLeader>
                        </el-form-item>
                        <el-form-item required label="开单日期" class="filter-item">
                            <el-date-picker
                                    v-model="form.opDate"
                                    type="date"
                                    placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="供应商" class="filter-item">
                            <outsideSupplierSelect ref="outsideSupplierSelect" :canAdd='false' :showSelfFac="isInStorge == 3 || isInStorge == 4"
                                                   @getSupplierId="getSupplierId">
                            </outsideSupplierSelect>
                        </el-form-item>
                        <el-form-item v-if="isInStorge == 0" label="调往仓库" class="filter-item">
                            <el-select v-model="form.inStorehouseId" placeholder="请选择">
                                <el-option
                                        v-for="item in storehouseList"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item required v-if="isInStorge == 3 || isInStorge == 4" label="客户" class="filter-item">
                            <customer  single="single" v-model="form.customerId"></customer>
                            <!--<client-select v-model="form.customerId"></client-select>-->
                        </el-form-item>
                        <el-form-item v-if="isInStorge == 1||isInStorge == 5" label="关联入库通知单" class="filter-item">
                            <el-select :disabled="isEditNotice" @change="handleSelect" @clear="handleClear" clearable v-model="form.infromStockId" placeholder="请选择">
                                <el-option
                                        v-for="item in stockBillList"
                                        :key="item.stockInformId"
                                        :label="item.orderNo"
                                        :value="item.stockInformId">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item :label="isInStorge == 2?'调整说明':'备注'" class="filter-item">
                            <el-input v-model="form.remark" placeholder="请填写20个字符以内"></el-input>
                        </el-form-item>
                    </el-row>
                    <el-row style="margin: 16px 0 24px;padding: 0 80px;font-size: 12px;">
                        <span style="margin-right: 40px;">总计数量:{{isInStorge == 0?'-'+outTotalNum:((isInStorge == 1 || isInStorge == 5)?'+'+inTotalNum:(isInStorge == 3||isInStorge == 4)?outTotalNum:'-'+outTotalNum+'/+'+inTotalNum)}}</span>
                        <span>{{isInStorge == 2?'调整':'总计'}}金额:¥{{(isInStorge == 3||isInStorge == 4)?outTotalPrice:(inTotalPrice+outTotalPrice*-1).toFixed(2)}}</span>
                    </el-row>
                </el-form>
            </div>
        </el-row>
        <el-row class="in-storage__content">
            <page-wrap>
                <div v-if="isInStorge != 1 && isInStorge != 5">
                    <div class="yellow-border-title"
                         style="margin-bottom: 8px;display: flex;justify-content: space-between;">
                        <div class="title">
                            {{isInStorge==3?'发货':isInStorge==4?'退货':'出库'}}合计:{{(isInStorge==3||isInStorge==4)?'':'-'}}{{outGoodStyleNum}}款/{{outTotalNum}}件
                            金额:{{(isInStorge==3||isInStorge==4)?'':'-'}}¥{{outTotalPrice}}
                        </div>
                        <div>
                            <span style="color: red">*</span>{{isInStorge==3?'发货':isInStorge==4?'退货':'出库'}}仓库
                            <el-select :disabled="isInStorge != 2&&!formType || (isEdit && isInStorge==2)" v-model="form.storehouseId"
                                       placeholder="请选择">
                                <el-option
                                        v-for="item in storehouseList"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="in-storage__list">
                        <storage-table
                                :isEdit="isEdit"
                                :type="isInStorge==2?0:isInStorge"
                                :hasRelateOrder="editInfo.detail&&editInfo.detail.stockInformId&&isInStorge==0"
                                v-model="outSkuValue"
                                isStorage
                                :formType="formType"
                                :standbyValue="standbyValue"
                                :tableData.sync="outTableData">
                        </storage-table>
                        <good-search
                                style="width: 100%;"
                                isSelect
                                v-if="!formType && !(editInfo.detail&&editInfo.detail.stockInformId&&isInStorge==0)"
                                @on-item-click='v => fetchInStockDetail(v,0)'></good-search>
                    </div>
                </div>
                <div style="margin-top: 20px;" v-if="isInStorge==1||isInStorge==2||isInStorge == 5">
                    <div class="yellow-border-title"
                         style="margin-bottom: 8px;display: flex;justify-content: space-between;">
                        <div class="title">入库合计:+{{inGoodStyleNum}}款/{{inTotalNum}}件 金额:+¥{{inTotalPrice}}</div>
                        <div>
                            <span style="color: red">*</span>入库仓库
                            <el-select v-if="isInStorge==2" :disabled="isEdit && !formType"
                                       v-model="form.inStockStorehouseId" placeholder="请选择">
                                <el-option
                                        v-for="item in storehouseList"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                            <el-select v-else :disabled="isInStorge != 2 && !formType" v-model="form.storehouseId"
                                       placeholder="请选择">
                                <el-option
                                        v-for="item in storehouseList"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="in-storage__list">
                        <storage-table
                                :isEdit="isEdit"
                                :hasRelateOrder="form.infromStockId"
                                :type="1"
                                v-model="inSkuValue"
                                isStorage
                                :standbyValue="standbyValue"
                                :tableData.sync="inTableData">
                        </storage-table>
                        <good-search
                                v-if="!form.infromStockId"
                                style="width: 100%;"
                                isSelect
                                @on-item-click='v => fetchInStockDetail(v,1)'></good-search>
                    </div>
                </div>
            </page-wrap>
        </el-row>
    </section>
</template>

<script>
    import GoodSearch from './good-search'
    import StorageTable from './table'
    import Utils from '@/utils/format'
    import {mapMutations} from 'vuex'
    import {
        getCustomerGroupLists,
        queryCommonStyleSkuBasicInfo,
        batchInStorageInventoryItem,
        batchOutStorageInventoryItem,
        queryInventoryItemByStyleId,
        getStorehousesByUserId,
        createStockBill,
        updateStockBill,
        billReviewConfig,
        billList,
        stockInformListId,
        stockInformCreate,
        centralStockDetail
    } from '@/api/api'
    // import supplierSelect from '@/components/Common/custom-select/supplier-select';
    import outsideSupplierSelect from '@/components/Common/custom-select/outside-supplier-select';
    import clientSelect from '@/components/Common/custom-select/clientSelect.vue'

    export default {
        props: {
            editInfo: {
                type: Object,
                default: {}
            },
            isEdit: { // 是否编辑库存单
                type: Boolean,
                default: false
            },
            isEditNotice: { // 是否编辑入库通知单
                type: Boolean,
                default: false
            }
        },
        componentName: 'InStorage',
        data() {
            return {
                customerList:[],
                isConfig: false,
                btnLoading: false,
                filterVal: '',
                currentPage: 1,
                form: {
                    operaterId: JSON.parse(sessionStorage.getItem('user_login')).userId,
                    remark: '',
                    // opDate: Utils.formatDate(new Date(), 'yyyy-MM-dd'),
                    opDate: new Date(),
                    inventoryItems: [],
                    stockInItems: [],
                    storehouseId: '', // 出库仓库
                    inStockStorehouseId: '', // 入库仓库
                    orderNo: '',
                    operateDate: '',
                    operateType: '',
                    commonOutsideFactoryId: '',
                    customerId: '',
                    infromStockId: '', // 关联入库通知单
                    inStorehouseId: '' // 调往仓库
                },
                popoverVisble: false,
                inTableData: [],
                outTableData: [],
                inSkuValue: {},
                outSkuValue: {},
                standbyValue: {},
                supplier: {id: ''},
                storehouseList: [],
                selectWasteSkuList: [], //质检节点选择的废品的skuList
                stockBillList: [] //关联入库通知单下拉
            }
        },
        components: {
            StorageTable,
            GoodSearch,
            outsideSupplierSelect,
            clientSelect
        },
        computed: {
            isNoticePage() {
              return this.$route.path == '/home/stock/notice'
            },
            isInStorge() {
                return Number(this.$route.query['type'])
            },
            unitId() {
                return JSON.parse(sessionStorage.getItem('last_login')).id
            },
            userId() {
                return this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId;
            },
            storehouseId() {
                return this.$route.query.storehouseId || ''
            },
            formType() {
                return this.$route.query.formType
            },
            inGoodStyleNum() {
                return this.inTableData.length
            },
            outGoodStyleNum() {
                return this.outTableData.length
            },
            inTotalNum() {
                let num = 0;
                for (let item of this.inTableData) {
                    num += Number(item.num)
                }
                return num
            },
            outTotalNum() {
                let num = 0;
                for (let item of this.outTableData) {
                    num += Number(item.num)
                }
                return num
            },
            inTotalPrice() {
                let num = 0;
                for (let item of this.inTableData) {
                    num += Number(item.totalPrice || 0)
                }
                return Number(num.toFixed(2))
            },
            outTotalPrice() {
                let num = 0;
                for (let item of this.outTableData) {
                    num += Number(item.totalPrice || 0)
                }
                return Number(num.toFixed(2))
            },
            bossUnitId() {
                return JSON.parse(sessionStorage.getItem('user_login')).bossUnitId
            },
        },
        watch: {
            isEditNotice(v) {
            //     if(v) {
            //         // stockInformId orderNo
            //         this.stockBillList = [{stockInformId:this.editInfo.detail.stockInformId,orderNo:this.editInfo.detail.orderNo}]
            //     }else {
            //         this.getStockList()
            //     }
            }
        },
        mounted() {
            this.getStorehousesList()
            // 质检节点跳转
            if (this.$route.query.formType == 'node') {
                this.selectWasteSkuList = JSON.parse(window.localStorage.getItem('selectWasteSkuList'))
                this.fetchInStockDetail(this.selectWasteSkuList[0].styleId, 0)
                this.fetchInStockDetail(this.selectWasteSkuList[0].styleId, 1)
            }
        },
        created() {
            this.getBillReviewConfig()
            this.getStockList()
        },
        methods: {
            ...mapMutations(['setGoodList']),
            getInformTableDataAndSkuValue(data, v, type, isIn) {
                this.inSkuValue = {
                    ...this.inSkuValue,
                    ...data['skuValue']
                };
                console.log(this.inSkuValue,'this.skuValuethis.skuValue');
                this.standbyValue = {
                    ...this.standbyValue,
                    ...data['standbyValue']
                }; // 用来做弹窗备用
                let stockNum = v.skuDTOList.reduce((total,curV) => {
                    return total + curV.quantity
                },0)
                this.inTableData = this.inTableData.concat([
                    {
                        ...v,
                        ...data,
                        commonStyleSkuList: data['skuList'],
                        cost: v.stylePrice,
                        sizes: data['sizes'],
                        num: stockNum,
                        stockNum,
                        totalPrice: stockNum * Number(v.stylePrice),
                        id: v.styleId
                    }
                ]);
                console.log(this.inTableData,'this.tableData ');
            },
            getDetail(stockId) { // 查询关联入库通知单的详情
                    this.inTableData = []
                    this.standbyValue = {}
                    this.inSkuValue = {}
                    centralStockDetail({stockId,unitId:this.unitId}).then(res => {
                        // this.detailInfo = res.data.centralBillStockInfoDTO   commonOutsideFactoryId
                        this.form.commonOutsideFactoryId = res.data.centralBillStockInfoDTO.commonOutsideFactoryId
                        this.$refs['outsideSupplierSelect'].staticSupplier({id: this.form.commonOutsideFactoryId})
                        res.data.centralBillStockInfoDTO.styleDTOList.forEach(v => {
                            const data = this.setTableData(v,true);
                            this.getInformTableDataAndSkuValue(data, v, 1);

                        })
                    })
            },
            handleSelect(id) {
                if(id){
                    this.getDetail(id)
                }
            },
            handleClear() {
                    this.inTableData = []
                    this.standbyValue = {}
                    this.inSkuValue = {}
                    this.form.commonOutsideFactoryId = ''
                    this.$refs['outsideSupplierSelect'].reset()
            },
            getStockList(stockInformIdList=[],storehouseId) {
                const params = {
                    "statusList": stockInformIdList.length?[]:[0],
                    stockInformIdList,
                    "storehouseId": storehouseId||this.storehouseId
                }

                stockInformListId(params).then(res => {
                    this.stockBillList = res.data.stockInformDTOList||[]
                })
            },
            //是否有审核台
            getBillReviewConfig() {
                if (this.isInStorge == 3 || this.isInStorge == 2) {
                    billReviewConfig({unitId: this.unitId}).then(res => {
                        if (res.data.data.configs && res.data.data.configs.length > 0) {
                            //是否有审核台
                            this.isConfig = res.data.data.configs.some(v => v.billType == (this.isInStorge == 3 ? 'STOCK_DELIVERY' : 'STOCK_ADJUST'))
                        }
                    })
                }

            },
            getEditInfo() {
                this.form.storehouseId = this.isInStorge == 5?this.editInfo.detail.stockInStorehouseId:this.editInfo.detail.storehouseId;
                this.form.orderNo = this.editInfo.detail.orderNo
                if (this.isInStorge == 1 || this.isInStorge == 5) {
                    this.inTableData = JSON.parse(JSON.stringify(this.editInfo.tableData))
                    if((this.isInStorge == 1&&this.editInfo.detail.stockInformId)||(this.isInStorge == 5&&this.isEditNotice)) {
                        let v = JSON.parse(JSON.stringify(this.editInfo.skuValue))
                        for (let k in v) {
                            v[k].num = v[k].informedQuantity
                        }
                        this.inSkuValue = v // isEditNotice
                    }else {
                        this.inSkuValue = JSON.parse(JSON.stringify(this.editInfo.skuValue))
                    }
                } else {
                    if(this.isInStorge == 2) {
                        this.outTableData = JSON.parse(JSON.stringify(this.editInfo.otherFlag?this.editInfo.otherTableData:this.editInfo.tableData))
                        this.outSkuValue = JSON.parse(JSON.stringify(this.editInfo.otherFlag?this.editInfo.otherSkuValue:this.editInfo.skuValue))
                        this.inTableData = JSON.parse(JSON.stringify(this.editInfo.otherFlag?this.editInfo.tableData:this.editInfo.otherTableData))
                        this.inSkuValue = JSON.parse(JSON.stringify(this.editInfo.otherFlag?this.editInfo.skuValue:this.editInfo.otherSkuValue))
                        this.form.inStockStorehouseId = this.editInfo.otherFlag ? this.editInfo.detail.storehouseId : this.editInfo.otherDetail.storehouseId
                        this.form.storehouseId = this.editInfo.otherFlag ? this.editInfo.otherDetail.storehouseId : this.editInfo.detail.storehouseId
                        // 编辑调整单的单号赋值只取出库部分的单号
                        this.form.orderNo = this.editInfo.otherFlag ? this.editInfo.otherDetail.orderNo : this.editInfo.detail.orderNo
                    }else {
                        this.outTableData = JSON.parse(JSON.stringify(this.editInfo.tableData))
                        if(this.editInfo.detail.stockInId) {
                            let v = JSON.parse(JSON.stringify(this.editInfo.skuValue))
                            for (let k in v) {
                                v[k].num = v[k].informedQuantity
                            }
                            this.outSkuValue = v
                        }else {
                            this.outSkuValue = JSON.parse(JSON.stringify(this.editInfo.skuValue))
                        }
                    }
                }
                this.$refs['outsideSupplierSelect'].staticSupplier({id: this.editInfo.detail.commonOutsideFactoryId})
                this.form.customerId = this.editInfo.detail.customerId
                this.form.operaterId = this.editInfo.detail.operaterId
                this.form.opDate = this.editInfo.detail.operateDate
                this.form.infromStockId = this.editInfo.detail.stockInformId  // 关联入库通知单
                this.form.commonOutsideFactoryId = this.editInfo.detail.commonOutsideFactoryId
                // this.form.opDate = '2018-11-11' form.infromStockId   form.inStockStorehouseId
                this.form.remark = this.editInfo.detail.remark
            },
            getSupplierId(item) {
                this.form.commonOutsideFactoryId = item.id
            },
            getStorehousesList() {
                getStorehousesByUserId({facId: this.unitId, userId: this.userId,kind: 1}).then(res => {
                    this.storehouseList = res.data.data
                    let item = this.storehouseList.find(i => i.defaultStorehouseTag === 1)
                    const id = item ? item.id : this.storehouseList[0].id
                    if(this.isInStorge != 2) {
                        if (!this.formType) {
                            this.form.inStockStorehouseId = this.storehouseId || id
                        } else {
                            this.form.inStockStorehouseId = id
                        }
                        this.form.storehouseId = this.storehouseId || id
                    }
                })
            },
            getSubmitParams1(arr = [], type) {
                let value = type ? this.inSkuValue : this.outSkuValue
                const inventoryItems = [];
                for (let item of arr) {
                    if (!item.num) continue;
                    const obj = {};
                    // obj.storehouseId = (this.isInStorge == 2 && type) ? this.form.inStockStorehouseId : this.form.storehouseId;
                    // obj.targetType = 'COMMON_GOODS_STYLE';
                    // obj.targetId = item.styleId || item.id;
                    // obj.num = item.num;
                    obj.price = item.cost;
                    // obj.styleNo = item.styleNo;
                    obj.styleId = item.styleId || item.id;
                    obj.skuDetails = [];
                    // if (!this.isInStorge) obj.id = item.id;
                    Object.keys(value).map(skuId => {
                        const id = item.styleId || item.id;
                        if (skuId.includes(id) && value[skuId].num !== '') {
                            const stockSyskuObj = {
                                "styleId": value[skuId].styleId,
                                "skuId": value[skuId].skuId,
                                "quantity": value[skuId].num
                            };
                            // if (!this.isInStorge) {
                            //     const id = this.getStockDetailId(item['inventoryItemStockList'], this.skuValue[skuId].skuId);
                            //     if (id) {
                            //         stockSyskuObj.id = id;
                            //     }
                            // }
                            obj.skuDetails.push(stockSyskuObj)
                        }
                    });
                    inventoryItems.push(obj)
                }
                return inventoryItems
                // obj.targetId = styleId
            },
            submit(addType) {
                if (!this.checkSubmit()) return;
                this.btnLoading = true
                let  params = {}
                // if(((this.isInStorge == 0 || this.isInStorge == 1)&&!this.isEdit) || (this.isInStorge == 5 && !this.isEditNotice)) {
                //     // 出库 入库 通知 新建
                //     params = {
                //         infromStockId: this.form.infromStockId, //关联入库通知单
                //         storehouseId: this.form.storehouseId,
                //         inStorehouseId: this.form.inStorehouseId, //调往仓库
                //         orderNo: this.form.orderNo,
                //         operaterId: this.form.operaterId,
                //         operateType: this.isInStorge == 2 ? 'STOCK_ADJUST' : ((this.isInStorge == 1||this.isInStorge == 5) ? 'STOCK_IN' : this.isInStorge == 3 ? 'STOCK_DELIVERY' : this.isInStorge == 4 ? 'STOCK_SALE_RETURN' : 'STOCK_OUT'),
                //         // dateOperate: Utils.formatDate(this.form.opDate, 'yyyy-MM-dd'),
                //         dateOperate: (typeof this.form.opDate) == 'string' ? this.form.opDate : Utils.formatDate(this.form.opDate, 'yyyy-MM-dd'),
                //         reviewStatus: addType,
                //         commonOutsideFactoryId: this.form.commonOutsideFactoryId,
                //         remark: this.form.remark,
                //         num: (this.isInStorge == 1||this.isInStorge == 5)?this.inTotalNum:this.outTotalNum,
                //         addNum: (this.isInStorge == 1||this.isInStorge == 5)?this.inTotalNum:'',
                //         subtractNum: this.isInStorge == 0?this.outTotalNum:'',
                //         userId: this.userId,
                //         unitId: this.unitId,
                //         bossUnitId: this.bossUnitId,
                //         stockItems: {
                //             goodsDetails: this.getSubmitParams1((this.isInStorge == 1||this.isInStorge == 5) ? this.inTableData : this.outTableData, (this.isInStorge == 1||this.isInStorge == 5) ? 1 : 0)
                //         }
                //     }
                // }else {
                //     // 其他新建 && 出库 入库 通知 编辑
                    params = {
                        addType,
                        facId: this.unitId,
                        userId: this.userId,
                        ...this.form,
                        opDate: (typeof this.form.opDate) == 'string' ? this.form.opDate : Utils.formatDate(this.form.opDate, 'yyyy-MM-dd'),
                        operateDate: (typeof this.form.opDate) == 'string' ? this.form.opDate : Utils.formatDate(this.form.opDate, 'yyyy-MM-dd'),
                        operateType: this.isInStorge == 2 ? 'STOCK_ADJUST' : ((this.isInStorge == 1||this.isInStorge == 5) ? 'STOCK_IN' : this.isInStorge == 3 ? 'STOCK_DELIVERY' : this.isInStorge == 4 ? 'STOCK_SALE_RETURN' : 'STOCK_OUT'),
                        inventoryItems: this.getSubmitParams((this.isInStorge == 1||this.isInStorge == 5) ? this.inTableData : this.outTableData, (this.isInStorge == 1||this.isInStorge == 5) ? 1 : 0),
                        stockInItems: this.isInStorge == 2 ? this.getSubmitParams(this.inTableData, 1) : [],
                        inStorehouseId: this.isInStorge == 2 ? this.form.inStockStorehouseId : this.form.inStorehouseId
                    };
                // }
                if ((this.isEdit&&this.isInStorge!=5)||this.isEditNotice) {
                    if(this.isInStorge == 2) {
                        params.id = this.editInfo.otherFlag ? this.editInfo.otherDetail.adjustOutBillId : this.editInfo.detail.adjustOutBillId
                        params.adjustInBillId = this.editInfo.otherFlag ? this.editInfo.detail.adjustInBillId : this.editInfo.otherDetail.adjustInBillId
                    }else {
                        params.id = this.isEditNotice?this.editInfo.detail.stockInId:this.$route.query.id // 修改的单ID
                    }
                    params.reviewStatus = this.editInfo.detail.reviewStatus
                    console.log(params, '参数');
                    updateStockBill(params).then(res => {
                        this.btnLoading = false
                        if (res.data.code === 0) {
                            this.$message.success('操作成功');
                            this.setGoodList([]);
                            this.$emit('success',params.id);
                            return
                        }
                        this.$message.error(res.data.msg);
                    })
                } else {

                    console.log(params, '参数');
                    if (this.formType) {
                        params.facMissionId = this.$route.query.facMissionId
                        params.facMissionPrcdNodeId = this.$route.query.facMissionPrcdNodeId
                    }
                    // if(this.isInStorge == 0 || this.isInStorge == 1 || this.isInStorge == 5) {
                    //     stockInformCreate(params).then(res => {
                    //         this.btnLoading = false
                    //         if (res.data.code === 0) {
                    //             this.$message.success('操作成功');
                    //             this.setGoodList([]);
                    //             // 生成单据之后直接跳转详情页面
                    //
                    //             if(this.isInStorge == 5) {
                    //                 if(this.isNoticePage) {
                    //                     this.$emit('success',res.data.data);
                    //                     // this.$router.push(`/stockDetailNew?id=${res.data.data}&type=1&storehouseId=${this.storehouseId}`)
                    //                 }else {
                    //                     this.$router.replace(`/stockDetailNew?id=${res.data.data}&type=1&storehouseId=${this.storehouseId}`)
                    //                     this.$emit('success');
                    //                 }
                    //
                    //             }else {
                    //                 this.$router.push(`/stockDetailNew?id=${res.data.data}&type=${this.isInStorge}&storehouseId=${this.storehouseId}`)
                    //             }
                    //             return
                    //         }
                    //         this.$message.error(res.data.message);
                    //     })
                    // }else {
                        createStockBill(params).then(res => {
                            this.btnLoading = false
                            if (res.data.code === 0) {
                                this.$message.success('操作成功');
                                this.setGoodList([]);
                                // 生成单据之后直接跳转详情页面
                                if(this.isInStorge == 0 || this.isInStorge == 1 || this.isInStorge == 5) {
                                    // this.$router.push(`/stockDetailNew?id=${res.data.data}&type=${this.isInStorge}&storehouseId=${this.storehouseId}`)
                                    if(this.isInStorge == 5) {
                                        //通知单
                                        if(this.isNoticePage) {
                                            this.$emit('success',res.data.data);
                                            // this.$router.push(`/stockDetailNew?id=${res.data.data}&type=1&storehouseId=${this.storehouseId}`)
                                        }else {
                                            this.$router.replace(`/stockDetailNew?id=${res.data.data}&type=1&storehouseId=${this.storehouseId}`)
                                            this.$emit('success');
                                        }

                                    }else {
                                        // 出库 入库
                                        this.$router.push(`/stockDetailNew?id=${res.data.data}&type=${this.isInStorge}&storehouseId=${this.storehouseId}`)
                                    }
                                }else {
                                    this.$router.push(`/stockDetail?id=${res.data.data}&type=${this.isInStorge}&storehouseId=${this.storehouseId}`);
                                }

                                // this.$router.push(`/home/stock/bill?storehouseId=${this.storehouseId}`);
                                return
                            }
                            this.$message.error(res.data.msg);
                        })
                    // }
                }
            },
            getSubmitParams(arr = [], type) {
                let value = type ? this.inSkuValue : this.outSkuValue
                const inventoryItems = [];
                for (let item of arr) {
                    if (!item.num) continue;
                    const obj = {};
                    obj.storehouseId = (this.isInStorge == 2 && type) ? this.form.inStockStorehouseId : this.form.storehouseId;
                    obj.targetType = 'COMMON_GOODS_STYLE';
                    obj.targetId = item.styleId || item.id;
                    obj.num = item.num;
                    obj.cost = item.cost;
                    obj.styleNo = item.styleNo;
                    obj.styleId = item.styleId || item.id;
                    obj.inventoryItemStockSysku = [];
                    obj.facPrdOrderId = item.facPrdOrderId
                    // if (!this.isInStorge) obj.id = item.id;
                    Object.keys(value).map(skuId => {
                        const id = item.styleId || item.id;
                        if (skuId.includes(id) && value[skuId].num !== '') {
                            const stockSyskuObj = {
                                styleSkuId: value[skuId].skuId,
                                num: value[skuId].num
                            };
                            // if (!this.isInStorge) {
                            //     const id = this.getStockDetailId(item['inventoryItemStockList'], this.skuValue[skuId].skuId);
                            //     if (id) {
                            //         stockSyskuObj.id = id;
                            //     }
                            // }
                            obj.inventoryItemStockSysku.push(stockSyskuObj)
                        }
                    });
                    inventoryItems.push(obj)
                }
                return inventoryItems
                // obj.targetId = styleId
            },
            // 获取库存货物详情id
            getStockDetailId(inventoryItemStockList = [], skuId) {
                const fItem = inventoryItemStockList.find(item => item.styleSkuId === skuId);
                if (fItem) {
                    return fItem.id;
                }
                return null;
            },
            // getInventoryItemStockSysku(row) {
            //     const inventoryItemStockSysku = [];
            //     Object.keys(this.skuValue).map(idStr => {
            //         // const item = {}
            //         if (row.styleId === this.standbyValue[idStr].styleId) {
            //             const item = row.inventoryItemStockList.find(listItem => listItem.styleSkuId === this.standbyValue[idStr].skuId)
            //             if (this.standbyValue[idStr].num) {
            //                 inventoryItemStockSysku.push({
            //                     ...item,
            //                     skuId: this.standbyValue[idStr].skuId,
            //                     num: this.standbyValue[idStr].num
            //                 })
            //             }
            //         }
            //     });
            //     return inventoryItemStockSysku;
            // },
            checkSubmit() {
                if (((!this.inGoodStyleNum || !this.outGoodStyleNum) && this.isInStorge == 2) || (!this.inGoodStyleNum && (this.isInStorge == 1||this.isInStorge == 5)) || (!this.outGoodStyleNum && this.isInStorge == 0)) {
                    this.$message.error('请选择入库商品或出库商品');
                    return false
                }
                if (((!this.outTotalNum || !this.inTotalNum) && this.isInStorge == 2) || (!this.inTotalNum && this.isInStorge == 1) || (!this.outTotalNum && this.isInStorge == 0)) {
                    this.$message.error('请填写库存数量');
                    return false
                }
                if (!this.form.operaterId || !this.form.opDate || (!this.form.customerId && (this.isInStorge == 3 || this.isInStorge == 4))) {
                    this.$message.error('请填写必填信息');
                    return false
                }
                if (!this.form.storehouseId || (this.isInStorge == 2 && !this.form.inStockStorehouseId)) {
                    this.$message.error('请选择仓库');
                    return false
                }
                return true
            },
            fetchInStockDetail(item, type) {
                queryCommonStyleSkuBasicInfo({
                    styleId: item.id ? item.id : item,
                    facId: this.unitId,
                    userId: this.userId,
                    storehouseId: this.storehouseId,
                    keyword: '',
                })
                    .then(res => {
                        if (!this.isHasData(type ? this.inTableData : this.outTableData, res.data['id'])) {
                            const data = this.setTableData(res.data);
                            // res.data['commonStyleSkuList'] = this.setTableData(res.data['commonStyleSkuList']);
                            this.getTableDataAndSkuValue(data, res, type);
                        } else {
                            this.$message.error('该货品已存在');
                        }
                    })
            },
            fetchOutStockDetail(item) {
                // queryInventoryItemByStyleId({
                //     styleNo: item.styleNo,
                //     styleId: item.id,
                //     facId: this.unitId,
                //     userId: this.userId,
                //     storehouseId: this.storehouseId
                // })
                //     .then(res => {
                //         const bol = this.isHasData(this.outTableData, res.data['styleId']);
                //         if (!bol) {
                //             const data = this.setTableData(res.data);
                //             // res.data['commonStyleSkuList'] = this.setTableData(res.data['commonStyleSkuList']);
                //             this.getTableDataAndSkuValue(data, res, 0);
                //             return;
                //         }
                //         this.$message.error('该货品已存在');
                //     })
            },
            isHasData(arr = [], styleId) {
                return arr.some(item => item.id === styleId)
            },
            getTableDataAndSkuValue(data, res, type) {
                let sum = 0
                if (type) {
                    if (!this.formType) {
                        this.inSkuValue = {
                            ...this.inSkuValue,
                            ...data['skuValue']
                        };
                    } else {
                        this.selectWasteSkuList.forEach(item => {
                            const skuIdStr = `${item.styleId}/${item.colorId}/${item.sizeId}/`
                            const skuIdStr1 = `${item.styleId}/${item.colorId}/${item.sizeId}/${item.standardId}`
                            sum += item.num
                            for (let key in data['skuValue']) {
                                if (skuIdStr == key || skuIdStr1 == key) {
                                    data['skuValue'][key]['num'] = item.num
                                }
                            }
                        })
                        this.inSkuValue = {
                            ...this.inSkuValue,
                            ...data['skuValue']
                        };
                    }
                } else {
                    if (!this.formType) {
                        this.outSkuValue = {
                            ...this.outSkuValue,
                            ...data['skuValue']
                        };
                    } else {
                        this.selectWasteSkuList.forEach(item => {
                            const skuIdStr = `${item.styleId}/${item.colorId}/${item.sizeId}/`
                            const skuIdStr1 = `${item.styleId}/${item.colorId}/${item.sizeId}/${item.standardId}`
                            sum += item.num
                            for (let key in data['skuValue']) {
                                if (skuIdStr == key || skuIdStr1 == key) {
                                    data['skuValue'][key]['num'] = item.num
                                }
                            }
                        })
                        this.outSkuValue = {
                            ...this.outSkuValue,
                            ...data['skuValue']
                        };
                    }

                }

                this.standbyValue = {
                    ...this.standbyValue,
                    ...data['standbyValue']
                }; // 用来做弹窗备用
                // if (!this.isInStorge) this.setSkuValueNum(res.data['inventoryItemStockList']);
                if (type) {
                    if (!this.formType) {
                        this.inTableData = this.inTableData.concat([
                            {
                                ...res.data,
                                commonStyleSkuList: data['skuList'],
                                sizes: data['sizes'],
                                num: 0
                            }
                        ]);
                    } else {
                        this.inTableData = this.inTableData.concat([
                            {
                                ...res.data,
                                commonStyleSkuList: data['skuList'],
                                sizes: data['sizes'],
                                num: sum,
                                stockNum: sum,
                                totalPrice: sum * res.data.cost
                            }
                        ]);
                    }
                } else {
                    if (!this.formType) {
                        this.outTableData = this.outTableData.concat([
                            {
                                ...res.data,
                                commonStyleSkuList: data['skuList'],
                                sizes: data['sizes'],
                                cost: this.isInStorge == 3 ? res.data.price : res.data.cost,
                                num: 0
                            }
                        ]);
                    } else {
                        this.outTableData = this.outTableData.concat([
                            {
                                ...res.data,
                                commonStyleSkuList: data['skuList'],
                                sizes: data['sizes'],
                                num: sum,
                                stockNum: sum,
                                cost: this.isInStorge == 3 ? res.data.price : res.data.cost,
                                totalPrice: sum * (this.isInStorge == 3 ? res.data.price : res.data.cost)
                            }
                        ]);
                    }

                }
            },
            // 设置初始化table输入框数
            setInitInputValue(res) {
                res['commonStyleSkuList'] = res['commonStyleSkuList'].map(item => {
                    item.stockNum = ''; // 用来记录一手数量
                    item.num = '';
                    return item;
                });
                return res
            },
            setTableData(data = {},isRelate) {
                const flag = this.isInStorge == 5 || isRelate
                const commonStyleSkuList = data[flag?'skuDTOList':'commonStyleSkuList'];
                let skuList = []
                    , colors = []
                    , sizes = []
                    , lengths = []
                    , json = {}
                    , skuValue = {}
                    , standbyValue = {};
                const lengthData = this.getLengths(commonStyleSkuList); // 用来半段是否显示‘无’内长
                const isHideLength = (lengthData.length === 1 && lengthData[0].value === '无');
                for (let item of commonStyleSkuList) {
                    item.styleId = flag ? data.styleId : (item.styleId || data.id);
                    const skuIdStr = `${item.styleId}/${item.colorId}/${item.sizeId}/${(!isHideLength && item.standardId) ? item.standardId : ''}`
                    skuValue[skuIdStr] = {
                        num: flag?(this.isEditNotice?item.informedQuantity:item.quantity):'',  // informedQuantity isEditNotice
                        skuId: flag?item.skuId:item.id,
                        styleId: item.styleId
                    }
                    standbyValue[skuIdStr] = {
                        num: flag?(this.isEditNotice?item.informedQuantity:item.quantity):'',
                        skuId: flag?item.skuId:item.id,
                        styleId: item.styleId
                    }
                    if (!json[item.colorId]) {
                        colors.push({
                            stockNum: '',
                            colorName: item.colorNoName || item.colorName,
                            colorId: item.colorId,
                            ...data,
                            id: item.styleId || (flag?item.skuId:item.id)
                        });
                        json[item.colorId] = item.colorId;
                    }
                    if (item.standardId && !json[item.standardId]) {
                        lengths.push({
                            standardValue: (item.standardValue||item.standardName) || '无',
                            standardId: item.standardId,
                            ...data,
                            id: item.styleId
                        });
                        json[item.standardId] = item.standardId;
                    }
                    // const idStr = item.sizeValue + (item.standardId ? '/' + item.standardValue : '')
                    if (!json[item.sizeId]) {
                        sizes.push({
                            ...item,
                            sizeNum: '',
                            sizeValue: flag?item.sizeName:item.sizeValue,
                            sizeId: item.sizeId
                        });
                        json[item.sizeId] = item.sizeId;
                    }
                }
                if (isHideLength) lengths = [];
                for (let colorItem of colors) {
                    const sizeObj = {
                        ...colorItem,
                        lengths
                    };
                    skuList.push(sizeObj)
                }
                console.log(colors,'skuListskuListskuListskuListskuList');
                return {
                    skuList,
                    sizes,
                    skuValue,
                    standbyValue
                }
            },
            getLengths(skuList) {
                let arr = [];
                for (let skuItem of skuList) {
                    const had = arr.some(item => item.id === skuItem.standardId);
                    !had && arr.push({value: (skuItem.standardValue||skuItem.standardName) || '无', id: skuItem.standardId});
                }
                return arr;
            },
            // setSkuValueNum(inventoryItemStockList = []) {
            //     for (let item of inventoryItemStockList) {
            //         Object.keys(this.skuValue).map(idStr => {
            //             if (this.skuValue[idStr].skuId === item.styleSkuId) {
            //                 this.skuValue[idStr].num = item.num
            //             }
            //         })
            //     }
            // }
        }
    }
</script>

<style lang="scss" scoped>
    .in-storage {
        &__search {
            padding-top: 16px;
        }
        &__title {
            border-bottom: 1px solid #e0e6ed;
            // span {
            //     color: #23c811
            // }
            .green {
                color: #23c811
            }
            .orange {
                color: #ffa914
            }
            .red {
                color: #fa4150;
            }
            .blue {
                color: #438DF1;
            }
            button {
                margin-left: 12px;
            }
        }
        &__content {
            margin-top: 16px;
        }
        &__form {
            .el-input {
                width: 250px;
            }
            .el-form-item {
                margin-right: 40px
            }
        }

    }

    .pagination {
        margin-top: 25px;
    }
</style>
<style lang="scss">
    .in-storage {
        .custom-filter-form {
            .el-form-item__label {
                width: 80px;
            }
            .filter-item {
                display: flex;
                align-items: center;
                width: 25%;
            }
        }
    }
</style>
