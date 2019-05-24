<template>
    <div class="return-list">
        <page-title title="退料单列表">
            <div class="btns">
                <nf-button style="font-size:12px;" type="warning" @click="addMaterial">+ 新建退料单</nf-button>
            </div>
        </page-title>
        <div class="box-shadow custom-filter-form">
            <el-form style="margin-left: -25px" :model="form" label-width="100px">
                <el-row>
                    <el-col :xs="12" :sm="12" :md="8" :lg="6">
                        <el-form-item label="退料单号">
                            <el-select 
                                clearable 
                                filterable 
                                remote
                                :remote-method="remoteMethod"
                                :loading="orderLoading"
                                v-model="order" placeholder="请输入单号搜索">
                                <el-option
                                    v-for="item in orderOption"
                                    :key="item.billReturnId"
                                    :label="item.billReturnNo"
                                    :value="item.billReturnNo">
                                </el-option>
                            </el-select>
                            <!-- <el-input v-model="order" placeholder="请输入单号搜索"></el-input> -->
                        </el-form-item>
                    </el-col>
                    <el-col :xs="12" :sm="12" :md="8" :lg="6">
                        <el-form-item label="退料日期">
                            <el-date-picker
                                    type="daterange"
                                    align="right"
                                    v-model="form.orderDate"
                                    placeholder="选择日期范围"
                                    :style="styleObj"
                                    :picker-options="pickerOptions">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="12" :sm="12" :md="8" :lg="6">
                        <el-form-item label="退料员">
                            <workerLeader :style="styleObj"  v-model="man" :single="'single'"
                                          :placeholder="'请选择或搜索'"></workerLeader>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="12" :sm="12" :md="8" :lg="6">
                        <el-form-item label="供应商">
                            <supplier-select ref="supplierSelect" @getSupplierId="getSupplierId"  :single='true' :canAdd = 'false'></supplier-select>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="12" :sm="12" :md="8" :lg="6">
                        <el-form-item label="退料单状态">
                            <filter-check-group multiple v-model="form.cancel">
                                <filter-check-item
                                        v-for="item in options2"
                                        :key="item.value"
                                        :value="item.value"
                                        :label="item.label"></filter-check-item>
                            </filter-check-group>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="12" :sm="12" :md="8" :lg="18">
                        <div class="btn-group">
                            <el-button class="btn btn-reset" @click="returnExcel">导出表格</el-button>
                            <el-button class="btn btn-reset" @click="reset">重置</el-button>
                            <el-button class="btn btn-submit" @click="pageReturn">筛选</el-button>
                        </div>
                    </el-col>

                </el-row>
            </el-form>
        </div>
        <div class="table mgt16" v-loading="loading">
            <el-table
                    v-if="canShow"
                    :data="returnData.returnDetailList"
                    :row-class-name="tableRowClassName"
                    border
                    class="mission"
                    key="mission"
                    style="width: 100%">
                <el-table-column prop="billReturnNo" label="退料单号" width="160" align="center">
                    <template slot-scope="scope">
                        <div :style="{'height':getHeight(scope.row.skus.length),'line-height':getHeight(scope.row.skus.length)}">{{scope.row.billReturnNo}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="dateReturn" label="退料日期" width="120" align="center">
                    <template slot-scope="scope">
                        <div :style="{'height':getHeight(scope.row.skus.length),'line-height':getHeight(scope.row.skus.length)}">{{scope.row.dateReturn | filterTime}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="zip" label="供应商" v-if="configArr.includes('供应商')" width="120" align="center">
                    <template slot-scope="scope">
                        <div :style="{'height':getHeight(scope.row.skus.length),'line-height':getHeight(scope.row.skus.length)}">
                            {{scope.row.supplierName}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="city" label="分类" v-if="configArr.includes('分类')" width="120" align="center">
                    <template slot-scope="scope">
                        <div :style="{'height':getHeight(item.skuDetails.length),'line-height':getHeight(item.skuDetails.length)}" class="cell__row" v-for="item in scope.row.skus">
                            {{item.kindName?item.kindName:item.kindNo}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="图片" v-if="configArr.includes('图片')" align="center" width="120">
                    <template slot-scope="scope">
                        <div v-for="item in  scope.row.skus">
                                <img style="width: 80px;height: 40px;"
                                     v-if="item.commonMaterialsPictureList && item.commonMaterialsPictureList.length"
                                     @click="imgList(item)"
                                     :src="item.commonMaterialsPictureList[0].path?item.commonMaterialsPictureList[0].path:item.commonMaterialsPictureList[0]"
                                     alt="">
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="address" label="物料款号" v-if="configArr.includes('物料款号')" width="120" align="center">
                    <template slot-scope="scope">
                        <div :style="{'height':getHeight(item.skuDetails.length),'line-height':getHeight(item.skuDetails.length)}" class="cell__row" v-for="item in scope.row.skus">
                            {{item.materialNo}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="zip" label="供应商款号/色号" v-if="configArr.includes('供应商款号/色号')" width="140" align="center">
                    <template slot-scope="scope">
                        <div :style="{'height':getHeight(item.skuDetails.length),'line-height':getHeight(item.skuDetails.length)}" class="cell__row" v-for="item in scope.row.skus">
                            {{item.supplierStyleNo}}/{{item.supplierColorNo}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="zip" label="物料名称" v-if="configArr.includes('物料名称')" width="120" align="center">
                    <template slot-scope="scope">
                        <div :style="{'height':getHeight(item.skuDetails.length),'line-height':getHeight(item.skuDetails.length)}" class="cell__row" v-for="item in scope.row.skus">
                            {{item.materialName}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="zip" label="颜色" v-if="configArr.includes('颜色')" width="120" align="center">
                    <template slot-scope="scope">
                        <div :style="{'height':getHeight(item.skuDetails.length),'line-height':getHeight(item.skuDetails.length)}" class="cell__row" v-for="item in scope.row.skus">
                            {{item.colorName?item.colorName:item.colorValue}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="zip" label="规格" v-if="configArr.includes('规格')" width="120" align="center">
                    <template slot-scope="scope">
                        <div :style="{'height':getHeight(item.skuDetails.length),'line-height':getHeight(item.skuDetails.length)}" class="cell__row" v-for="item in scope.row.skus">
                            {{item.specificationsRemark?item.specificationsRemark:item.specificationsNumber}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="zip" label="库存单位" v-if="configArr.includes('单位')" width="120" align="center">
                    <template slot-scope="scope">
                        <div :style="{'height':getHeight(item.skuDetails.length),'line-height':getHeight(item.skuDetails.length)}" class="cell__row" v-for="item in scope.row.skus">
                            {{item.unit}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="zip" label="采购单位" v-if="configArr.includes('单位')" width="120" align="center">
                    <template slot-scope="scope">
                        <div :style="{'height':getHeight(item.skuDetails.length),'line-height':getHeight(item.skuDetails.length)}" class="cell__row" v-for="item in scope.row.skus">
                            {{item.purchaseUnitName}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="zip" label="退料数[采购单位]" v-if="configArr.includes('单位')" width="120" align="center">
                    <template slot-scope="scope">
                        <div v-for="item in scope.row.skus">
                            <div :style="{'border-bottom':item.skuDetails.length>1?'1px solid #E6EAF0':'none'}" class="cell__row" v-for="items in item.skuDetails" >
                                {{items.returnQuantity}}{{item.purchaseUnitName}}
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="zip" label="本次退料[库存单位]" width="120" align="center">
                    <template slot-scope="scope">
                        <div v-for="item in scope.row.skus">
                            <div :style="{'border-bottom':item.skuDetails.length>1?'1px solid #E6EAF0':'none'}" class="cell__row" v-for="items in item.skuDetails" >
                                {{items.returnStockUnitQuantity}}{{item.unit}}
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="zip" label="退料转化率" v-if="configArr.includes('单位')" width="120" align="center">
                    <template slot-scope="scope">
                        <div v-for="item in scope.row.skus">
                            <div :style="{'border-bottom':item.skuDetails.length>1?'1px solid #E6EAF0':'none'}" class="cell__row" v-for="items in item.skuDetails">
                                {{items.conversionRate}}
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="zip" label="退料单价" width="120" align="center">
                    <template slot-scope="scope">
                        <div :style="{'height':getHeight(item.skuDetails.length),'line-height':getHeight(item.skuDetails.length)}" class="cell__row" v-for="item in scope.row.skus">
                            {{item.returnPriceUnit}}元/{{item.purchaseUnitName}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="zip" label="退料金额" width="120" align="center">
                    <template slot-scope="scope">
                        <div :style="{'height':getHeight(scope.row.skus.length),'line-height':getHeight(scope.row.skus.length)}" >
                            {{scope.row.amountTotal}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="zip" label="退料仓库" width="120" align="center">
                    <template slot-scope="scope">
                        <div :style="{'height':getHeight(scope.row.skus.length),'line-height':getHeight(scope.row.skus.length)}" >
                            {{scope.row.storehouseName}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="zip" label="退料员" width="120" align="center">
                    <template slot-scope="scope">
                        <div :style="{'height':getHeight(scope.row.skus.length),'line-height':getHeight(scope.row.skus.length)}" >
                            {{scope.row.creatorName}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="zip" v-if="addtype" label="应收退款" width="120" align="center">
                    <template slot-scope="scope">
                        <div :style="{'height':getHeight(scope.row.skus.length),'line-height':getHeight(scope.row.skus.length)}" >
                            {{scope.row.payOrReceiveAmount}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="zip" v-if="addtype" label="已收款" width="120" align="center">
                    <template slot-scope="scope">
                        <div :style="{'height':getHeight(scope.row.skus.length),'line-height':getHeight(scope.row.skus.length)}" >
                            {{scope.row.verificationOffAmount}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="zip" v-if="addtype" label="结欠" min-width="120" align="center">
                    <template slot-scope="scope">
                        <div :style="{'height':getHeight(scope.row.skus.length),'line-height':getHeight(scope.row.skus.length)}" >
                            {{scope.row.balanceDueAmount}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="zip" label="操作" fixed="right" width="160" align="center">
                    <template slot-scope="scope">
                        <div  :style="{'height':getHeight(scope.row.skus.length),'line-height':getHeight(scope.row.skus.length)}" class="opera">
                            <div class="blue" @click="check(scope.row)">查看</div>
                            <!--<div :style="{'height':32 * scope.row.skus.length + 'px'}" class="line"></div>-->
                            <!--<div class="blue" @click="payOpen(scope.row)">退款</div>-->
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-row class="return-list__pagination" type="flex" justify="end">
            <el-pagination
                    @current-change="handleCurrentChange"
                    :current-page.sync="currentPage"
                    :page-size="20"
                    layout="total, prev, pager, next"
                    :total="returnData.total">
            </el-pagination>
        </el-row>
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
                        <supplier-select :canAdd = 'false'  @getSupplierId="getSupplierId"></supplier-select>
                        <!--<el-select v-model="payForm.supplierId" placeholder="请选择" clearable filterable disabled-->
                                   <!--class="width220">-->
                            <!--<el-option-->
                                    <!--v-for="item in supplierList"-->
                                    <!--:key="item.id"-->
                                    <!--:label="item.name"-->
                                    <!--:value="item.id">-->
                            <!--</el-option>-->
                        <!--</el-select>-->
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
    </div>
</template>

<script>
    import TableCellList from './table-cell-list';
    import supplierSelect from '@/components/Common/custom-select/supplier-select';
    const fun = require('../../Common/commonFun.js')
    import {pageReturn, purchaseQueryListData, returnExcel, returnCollect} from '@/api'
    import {
        getFinanceConfigByUserId,
        MPRFieldConfigList,
        orderLists
    } from '../../../api/material.js'
    import FilterCheckGroup from '../../order/WorkOrders/filter-check-group';
    import FilterCheckItem from '../../order/WorkOrders/filter-check-item';
    export default {
        data() {
            return {
                options2: [
                    {label: '未撤销', value: 0},
                    {label: '已撤销', value: 1},
                ],
                orderOption:'',//退料单号显示列表
                orderLoading:false,
                centerDialogVisible: false, //判断显示图片预览显示与隐藏
                imgLists: [],
                imgIndex: 0,
                styleObj: {
                    width: '100%'
                },
                order: '',
                currentPage: 1,
                form: {
                    orderDate: '',
                    cancel:[0],
                },
                payForm: {
                    billReturnId: '',
                    amount: '',
                    supplierId: '',
                    userCreated: '',
                    operatorId: '',
                    dateOperated: '',
                    billMaterialPurchaseId: ''
                },
                pickerOptions: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                // supplierList: [],
                purchaserList: [],
                supplier: '',
                man: '',
                returnData: [],
                paymentShow: false,
                addtype: false,
                configArr:[],       //配置表头数组
                canShow: false,      //控制是否显示表格
                loading:false, //表格加载中
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
            FilterCheckGroup,
            FilterCheckItem,
            TableCellList,
            supplierSelect
        },
        computed: {
            userId() {
                return (this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem("user_login")).userId);
            },
            unitId() {
                return JSON.parse(sessionStorage.getItem("last_login")).id
            },
            facId() {
                return JSON.parse(sessionStorage.getItem("last_login")).id
            }
        },
        methods: {
            // 设置高度
            getHeight(length) {
                let height = ''
                if (length == 0) {
                    height = '32px'
                } else {
                    height = 32 * length + 'px'
                }
                return height
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
            //获取供应商id
            getSupplierId(val){
                if(val){
                    this.supplier = val.id;
                    //当弹出付款弹窗时，要赋值给选择的供应商
                    if(this.paymentShow){
                        this.payForm.supplierId = val.id;
                    }
                }
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
            // 新建退料单
            addMaterial() {
                // 权限
                if (!this.powerJudgement.permissions("fac.returnOrder.add")) {
                    return
                }
                this.$router.push('/newReturnMarteriel?addtype=' + this.addtype)
            },
            getFinanceConfigByUserId() {
                let params = {
                    userId: JSON.parse(sessionStorage.getItem("user_login")).userId,
                }
                getFinanceConfigByUserId(params).then(res => {
                    if (res.data.code == 0) {
                        res.data.data.forEach((v, i) => {
                            if (v == 'RETURN_ORDER') {
                                this.addtype = true
                            }
                        })
                    }
                })
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
                    unitId: this.facId,
                    supplierId: this.payForm.supplierId,
                    updaterId: this.userId,
                    creatorId: this.payForm.operatorId,
                    collectTotal: this.payForm.amount,
                    billReturnId: this.payForm.billReturnId
                };
                returnCollect(params).then(res => {
                    console.log(res)
                    if (res.data.code == 0) {
                        this.pageReturn();
                        this.paymentShow = false;
                        this.$message.success('付款成功');
                    } else {
                        this.$message.error(res.data.msg);
                    }
                })

            },
            payOpen(row) {
                // 权限
                if (!this.powerJudgement.permissions("fac.returnOrder.getRefundReturnOrder")) {
                    return
                }
                this.payForm = {
                    supplierId: row.supplierId,
                    amount: '',
                    userCreated: '',
                    operatorId: '',
                    dateOperated: fun.dateFormatter(new Date(), false),
                    billReturnId: row.billReturnId
                }
                this.paymentShow = true
            },
            reset() {
                this.supplier = '';
                this.man = '';
                this.form.orderDate = '';
                this.order = '';
                this.form.cancel = [0]
                this.$refs['supplierSelect'].reset()
                this.pageReturn();//刷新一遍
            },
            handleCurrentChange(val) {
                this.pageReturn();
            },
            purchaseQueryListData() {
                let params = {
                    userId: this.userId,
                    factoryId: this.facId
                };
                purchaseQueryListData(params).then(res => {
                    console.log(res);
                    // this.supplierList = res.data.data.supplierList;
                    this.purchaserList = res.data.data.purchaserList;
                })
            },
            pageReturn() {
                var cancel;
                if(this.form.cancel){
                    if(this.form.cancel.length>1){
                        cancel = null
                    }else {
                        cancel = this.form.cancel[0]
                    }
                }else {
                    cancel = 0
                }
                let params = {
                    unitId: this.facId,
                    pageNum: this.currentPage,
                    pageSize: 20,
                    returnOrderNo: this.order ? this.order : '',
                    returnStartDate: this.form.orderDate ? fun.dateFormatter(this.form.orderDate[0], false) : '',
                    returnEndDate: this.form.orderDate ? fun.dateFormatter(this.form.orderDate[0], false) : '',
                    deliveryerId: this.man,
                    supplierId: this.supplier,
                    cancel:cancel
                }
                this.loading = true
                pageReturn(params).then(res => {
                    this.loading = false
                    this.returnData = res.data.data;
                    console.log(res);
                })
            },
            returnExcel() {
                let params = {
                    unitId: this.facId,
                    returnOrderNo: this.order ? this.order : '',
                    returnStartDate: this.form.orderDate ? fun.dateFormatter(this.form.orderDate[0], false) : '',
                    returnEndDate: this.form.orderDate ? fun.dateFormatter(this.form.orderDate[0], false) : '',
                    deliveryerId: this.man,
                    supplierId: this.supplier,
                }
                returnExcel(params).then(res => {
                    //在这里利用则可以直接的生成作为下载用的url，但是在其他代码环境下，可能需要new一个Blob对象，例如
                    //var blob = new Blob([JSON.stringify(res.data)], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
                    let url = window.URL.createObjectURL(res.data);
                    console.log(url);
                    let a = window.document.createElement('a');
                    a.setAttribute('href', url);
                    a.setAttribute('download', '退料单列表.xls');
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                })
            },
            check(row) {
                this.$router.push(`/return/detail?id=${row.billReturnId}&supplierId=${row.supplierId}&supplierName=${row.supplierName}`)
                this.$route.query.id = row.billReturnId
            },
            tableRowClassName(row, index) {
                if (row.cancel) {
                    return 'cancel-row'
                }else {
                    return '';
                }
            },
            // 筛选退料员
            getManId(arrId) {
                console.log(arrId);
                this.man = arrId
            },
            //退料单号搜索
            remoteMethod(query) {
                if (query !== '') {
                    this.orderLoading = true;
                    setTimeout(() => {
                        this.orderLoading = false;
                        let params = {
                            unitId: this.unitId,
                            keyword: query
                        };
                        orderLists(params).then(res => {
                            // console.log("模糊查询的内容:",res);
                            if (res.data.code === 0) {
                                this.orderOption = res.data.data;
                            }else{
                                this.orderOption = [];
                            }
                        });
                    }, 200);
                } else {
                    this.orderOption = [];
                }
            },
        },
        created() {
            // PURCHASE 采购单, ARRIVE 到料单, DELIVER 送料单, RETURN 退料单
            this.getConfigArr('RETURN');
            this.getFinanceConfigByUserId()
            this.pageReturn();
            this.purchaseQueryListData();
        }
    }
</script>

<style lang="scss">
    @import '../../../assets/style/el-table.scss';
    /* common */
    .pay-title {
        font-weight: 700;
        text-align: center;
        font-size: 16px;
        height: 39px;
        line-height: 40px;
        border-bottom: 1px solid #E6EAF0;
    }

    .return-filter .el-input__inner {
        height: 32px;
    }

    .return-filter .el-form-item__content {
        flex: 1
    }

    .return-list {
        .el-table th > .cell {
            padding: 0 !important;
        }
        .pay {
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

    .this .el-input__inner {
        border: none;
        height: 32px;
        width: 100%;
        background-color: #F5F7FA;
    }

    .return-list .el-table td .cell {
        line-height: 18px;
        padding: 0;
    }
</style>


<style scoped lang="scss">
    .return-list__table--wrapper {
        margin-top: 12px;
    }

    .return-list__pagination {
        margin-top: 16px;
    }

    .table {
        min-height: 100px;
        .opera {
            display: flex;
            /*justify-content: space-between;*/
            justify-content: center;
            align-items: center;
            padding: 0 24px;
            box-sizing: border-box;
        }
        .line {
            height: 32px;
            width: 1px;
            background-color: rgba(230, 234, 240, 1);
        }
        .blue {
            color: #1CA1FF;
            text-decoration: underline;
            cursor: pointer;
        }
    }

    .mission {
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
    }
</style>
